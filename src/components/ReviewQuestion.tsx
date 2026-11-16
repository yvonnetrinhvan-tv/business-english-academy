import { useEffect, useRef, useState, type ReactNode } from 'react'
import SpeakButton from './SpeakButton'
import { Btn, Card } from './ui'
import { canSpeak, speak } from '../lib/speech'
import { checkTyped, MODE_LABEL, type Outcome, type Question } from '../lib/review'
import { previewInterval } from '../lib/srs'
import type { CardState, Grade, VocabItem } from '../types'

interface Props {
  q: Question
  vocab: VocabItem
  card: CardState
  relearn: boolean
  leech: boolean
  /** Gọi ngay khi có kết quả (để lưu lịch ôn) */
  onResult: (o: Outcome) => void
  /** Gọi khi người học bấm Tiếp tục */
  onNext: () => void
}

/** Thông tin đầy đủ của từ, hiện sau khi trả lời hoặc khi học từ mới. */
export function VocabDetail({ v }: { v: VocabItem }) {
  return (
    <div className="space-y-1 text-left">
      <p className="text-2xl font-bold">{v.term}</p>
      <p className="text-sm text-slate-500">{[v.ipa, v.pos].filter(Boolean).join(' · ')}</p>
      <p className="text-lg font-semibold text-brand-700">{v.meaningVi}</p>
      {v.exampleEn && <p className="pt-1">{v.exampleEn}</p>}
      {v.exampleVi && <p className="text-sm text-slate-600">{v.exampleVi}</p>}
      <div className="flex gap-2 pt-2">
        <SpeakButton text={v.term} label="Nghe từ" />
        {v.exampleEn && <SpeakButton text={v.exampleEn} label="Nghe câu" />}
      </div>
    </div>
  )
}

export default function ReviewQuestion({ q, vocab, card, relearn, leech, onResult, onNext }: Props) {
  const [phase, setPhase] = useState<'ask' | 'feedback'>('ask')
  const [picked, setPicked] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [hint, setHint] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState(false) // đã lật ít nhất một lần → được chấm
  const [result, setResult] = useState<{ correct: boolean; near: boolean } | null>(null)
  const started = useRef(Date.now())
  const nextRef = useRef<HTMLButtonElement>(null)

  const finish = (correct: boolean, near = false, selfGrade?: Grade) => {
    const o: Outcome = { correct, near, usedHint: hint > 0, ms: Date.now() - started.current, selfGrade }
    onResult(o)
    if (q.mode === 'flashcard') { onNext(); return }
    setResult({ correct, near })
    setPhase('feedback')
  }

  // Tự phát âm với kiểu nghe
  useEffect(() => { if (q.mode === 'listening') speak(vocab.term) }, [q.mode, vocab.term])
  // Phím tắt: 1-4 chọn đáp án, Enter qua câu kế
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === 'feedback') return
      if (q.mode === 'flashcard' && e.key === ' ' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault()
        flip()
        return
      }
      const n = Number(e.key)
      if (q.options && n >= 1 && n <= q.options.length && picked === null) pickOption(n - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, picked, q])
  useEffect(() => { if (phase === 'feedback') nextRef.current?.focus() }, [phase])

  const flip = () => { setFlipped((f) => !f); setSeen(true) }

  const pickOption = (i: number) => {
    setPicked(i)
    finish(i === q.answerIndex)
  }

  const submitTyped = () => {
    if (!text.trim()) return
    const r = checkTyped(text, q.accepted ?? [])
    finish(r.correct, r.near)
  }

  const hintText = () => {
    const t = vocab.term
    if (hint <= 0) return ''
    const masked = t.split('').map((c, i) => (i === 0 || c === ' ' || c === '-' ? c : '_')).join(' ')
    return hint === 1 ? masked : `${t.slice(0, Math.ceil(t.length / 2))}${' _'.repeat(Math.floor(t.length / 2))}`
  }

  const header = (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">{MODE_LABEL[q.mode]}</span>
      {relearn && <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-900">Học lại</span>}
      {leech && <span className="rounded bg-rose-100 px-2 py-0.5 text-rose-900">Từ khó</span>}
    </div>
  )

  let body: ReactNode = null

  if (q.mode === 'flashcard') {
    const now = new Date()
    body = (
      <>
        <button type="button" onClick={flip} aria-label={flipped ? 'Lật thẻ về mặt tiếng Anh' : 'Lật thẻ xem nghĩa'}
          className="block min-h-40 w-full rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition active:scale-[0.99]">
          {flipped ? (
            <span className="block text-left">
              <span className="block text-center text-2xl font-bold text-brand-700">{vocab.meaningVi}</span>
              <span className="mt-3 block"><VocabDetail v={vocab} /></span>
            </span>
          ) : (
            <span className="block py-4">
              <span className="block text-3xl font-bold">{vocab.term}</span>
              <span className="mt-1 block text-slate-500">{[vocab.ipa, vocab.pos].filter(Boolean).join(' · ')}</span>
              <span className="mt-3 block text-xs text-slate-400">Chạm để lật</span>
            </span>
          )}
        </button>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <SpeakButton text={vocab.term} label="Nghe từ" />
          <Btn onClick={flip}>{flipped ? 'Lật lại mặt tiếng Anh' : 'Hiện đáp án'}</Btn>
        </div>
        {seen && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {([['again', 'Quên', 'bg-rose-600'], ['hard', 'Khó', 'bg-amber-600'], ['good', 'Nhớ', 'bg-brand-700'], ['easy', 'Dễ', 'bg-sky-700']] as const).map(([g, label, cls]) => (
              <button key={g} type="button" onClick={() => finish(g !== 'again', false, g)}
                className={`rounded-lg px-2 py-3 text-sm font-semibold text-white ${cls}`}>
                {label}<span className="block text-xs font-normal opacity-90">{previewInterval(card, g, now)}</span>
              </button>
            ))}
          </div>
        )}
      </>
    )
  } else if (q.mode === 'mcq-vi' || q.mode === 'mcq-en') {
    body = (
      <>
        {q.mode === 'mcq-vi' ? (
          <div className="text-center">
            <p className="text-sm text-slate-500">Nghĩa của từ này là gì?</p>
            <p className="mt-1 text-3xl font-bold">{vocab.term}</p>
            <p className="text-slate-500">{[vocab.ipa, vocab.pos].filter(Boolean).join(' · ')}</p>
            <div className="mt-2 flex justify-center"><SpeakButton text={vocab.term} label="Nghe từ" /></div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-slate-500">Từ tiếng Anh nào có nghĩa này?</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{vocab.meaningVi}</p>
            {vocab.pos && <p className="text-sm text-slate-500">({vocab.pos})</p>}
          </div>
        )}
        <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Các đáp án">
          {q.options!.map((o, i) => {
            const isAnswer = phase === 'feedback' && i === q.answerIndex
            const isWrong = phase === 'feedback' && picked === i && i !== q.answerIndex
            return (
              <button key={o} type="button" role="radio" aria-checked={picked === i} disabled={phase === 'feedback'} onClick={() => pickOption(i)}
                className={`rounded-lg border px-3 py-3 text-left text-sm ${isAnswer ? 'border-emerald-600 bg-emerald-50' : isWrong ? 'border-rose-500 bg-rose-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                <span className="mr-2 text-xs text-slate-400">{i + 1}</span>{o}
              </button>
            )
          })}
        </div>
      </>
    )
  } else {
    // cloze / typing / listening
    const prompt =
      q.mode === 'cloze' ? (
        <div className="text-center">
          <p className="text-sm text-slate-500">Điền từ còn thiếu vào câu</p>
          <p className="mt-2 text-xl font-medium leading-relaxed">{q.sentence}</p>
          <p className="mt-2 text-sm text-slate-500">Nghĩa của từ: <b className="text-brand-700">{vocab.meaningVi}</b></p>
        </div>
      ) : q.mode === 'typing' ? (
        <div className="text-center">
          <p className="text-sm text-slate-500">Gõ từ tiếng Anh có nghĩa:</p>
          <p className="mt-1 text-2xl font-bold text-brand-700">{vocab.meaningVi}</p>
          {vocab.pos && <p className="text-sm text-slate-500">({vocab.pos})</p>}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-slate-500">Nghe và gõ lại từ bạn nghe được</p>
          <div className="mt-3">
            {canSpeak() ? <button type="button" onClick={() => speak(vocab.term)} className="rounded-full bg-brand-700 px-6 py-3 text-lg font-semibold text-white">🔊 Nghe lại</button> : <p className="text-sm text-rose-700">Thiết bị không hỗ trợ phát âm.</p>}
          </div>
          {hint > 0 && <p className="mt-2 text-sm text-slate-500">Nghĩa: <b>{vocab.meaningVi}</b></p>}
        </div>
      )
    body = (
      <>
        {prompt}
        <form className="mt-4" onSubmit={(e) => { e.preventDefault(); if (phase === 'ask') submitTyped() }}>
          <label htmlFor="typed" className="sr-only">Câu trả lời</label>
          <input id="typed" autoFocus value={text} onChange={(e) => setText(e.target.value)} disabled={phase === 'feedback'}
            autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck={false}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-lg" placeholder="Gõ đáp án" />
          {hint > 0 && q.mode !== 'listening' && <p className="mt-2 font-mono text-slate-500" aria-label="Gợi ý">{hintText()}</p>}
          {phase === 'ask' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn type="submit" disabled={!text.trim()}>Kiểm tra</Btn>
              <Btn variant="ghost" onClick={() => setHint((h) => Math.min(2, h + 1))} disabled={hint >= (q.mode === 'listening' ? 1 : 2)}>Gợi ý</Btn>
              <Btn variant="ghost" onClick={() => finish(false)}>Không nhớ</Btn>
            </div>
          )}
        </form>
      </>
    )
  }

  return (
    <Card>
      {header}
      {body}
      {phase === 'feedback' && result && (
        <div className="mt-4" role="status">
          <div className={`rounded-lg p-3 text-sm ${result.correct ? 'bg-emerald-50 text-emerald-900' : result.near ? 'bg-amber-50 text-amber-900' : 'bg-rose-50 text-rose-900'}`}>
            <b>{result.correct ? 'Đúng.' : result.near ? 'Gần đúng, sai chính tả.' : 'Chưa đúng.'}</b>
            {!result.correct && text.trim() && <> Bạn gõ: <i>{text}</i>.</>}
            {!result.correct && !q.options && <> Đáp án: <b>{q.accepted?.[0]}</b>.</>}
          </div>
          <div className="mt-3 rounded-lg bg-slate-50 p-3"><VocabDetail v={vocab} /></div>
          <div className="mt-3"><button ref={nextRef} type="button" onClick={onNext} className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900">Tiếp tục</button></div>
        </div>
      )}
    </Card>
  )
}
