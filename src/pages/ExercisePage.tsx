import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Btn, Card, PageTitle, ProgressBar } from '../components/ui'
import { getLesson } from '../data/lessons'
import { useStore } from '../lib/store'
import { useStudyTimer } from '../lib/useStudyTimer'
import { checkFill, checkOrder, checkWriting, shuffle } from '../lib/exercises'
import type { Exercise } from '../types'

const PASS_RATIO = 0.6

export default function ExercisePage() {
  const { id } = useParams()
  const lesson = id ? getLesson(id) : undefined
  const { ready } = useStore()
  if (!ready) return <p>Đang tải…</p>
  if (!lesson?.content) return <p>Bài tập chưa có. <Link className="underline" to="/chuong-trinh">Về danh mục</Link></p>
  return <Runner lessonId={lesson.id} title={lesson.title} exercises={lesson.content.exercises} />
}

function Runner({ lessonId, title, exercises }: { lessonId: string; title: string; exercises: Exercise[] }) {
  const { logSession, completeLesson, saveWriting, state } = useStore()
  const timer = useStudyTimer()
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{ seconds: number } | null>(null)

  const next = (wasCorrect: boolean) => {
    const c = correct + (wasCorrect ? 1 : 0)
    setCorrect(c)
    if (index + 1 < exercises.length) {
      setIndex(index + 1)
      return
    }
    const { seconds, startedAt } = timer.stop()
    logSession({ kind: 'exercises', lessonId, startedAt, seconds, score: c, total: exercises.length })
    if (c / exercises.length >= PASS_RATIO) completeLesson(lessonId)
    setResult({ seconds })
    setDone(true)
  }

  if (done) {
    const pct = Math.round((correct / exercises.length) * 100)
    const passed = correct / exercises.length >= PASS_RATIO
    return (
      <>
        <PageTitle>Kết quả: {title}</PageTitle>
        <Card>
          <p className="text-3xl font-bold">{correct}/{exercises.length} ({pct}%)</p>
          <p className="mt-1 text-sm text-slate-600">Thời gian: {Math.max(1, Math.round((result?.seconds ?? 0) / 60))} phút</p>
          <p className="mt-2">{passed ? '✓ Đạt. Bài học được đánh dấu hoàn thành.' : 'Chưa đạt 60%. Đọc lại bài rồi làm lại nhé.'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/on-tap"><Btn>Ôn từ vựng</Btn></Link>
            <Link to={`/bai/${lessonId}`}><Btn variant="ghost">Đọc lại bài</Btn></Link>
            <Link to="/"><Btn variant="ghost">Về tổng quan</Btn></Link>
          </div>
        </Card>
      </>
    )
  }

  const ex = exercises[index]
  return (
    <>
      <PageTitle sub={`Câu ${index + 1}/${exercises.length}`}>Bài tập: {title}</PageTitle>
      <div className="mb-4"><ProgressBar value={index} max={exercises.length} label="Tiến độ bài tập" /></div>
      <ExerciseView key={ex.id} ex={ex} savedWriting={state.writings[ex.id]} onSaveWriting={(t) => saveWriting(ex.id, t)} onNext={next} isLast={index + 1 === exercises.length} />
    </>
  )
}

function Feedback({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div role="status" className={`mt-3 rounded-lg p-3 text-sm ${ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
      <b>{ok ? 'Đúng.' : 'Chưa đúng.'}</b> {children}
    </div>
  )
}

function ExerciseView({ ex, savedWriting, onSaveWriting, onNext, isLast }: {
  ex: Exercise; savedWriting?: string; onSaveWriting: (t: string) => void; onNext: (ok: boolean) => void; isLast: boolean
}) {
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)
  const [choice, setChoice] = useState<number | null>(null)
  const [text, setText] = useState(savedWriting ?? '')
  const [picked, setPicked] = useState<number[]>([])
  const shuffled = useMemo(() => (ex.type === 'order' ? shuffle(ex.words) : []), [ex])

  const finishCheck = (v: boolean) => { setOk(v); setChecked(true) }
  const nextBtn = <div className="mt-3"><Btn onClick={() => onNext(ok)}>{isLast ? 'Xem kết quả' : 'Câu tiếp'}</Btn></div>

  if (ex.type === 'mcq') {
    return (
      <Card>
        <p className="font-semibold">{ex.prompt}</p>
        <p className="mb-3 text-sm text-slate-600">{ex.promptVi}</p>
        <div className="grid gap-2" role="radiogroup" aria-label="Các đáp án">
          {ex.options.map((o, i) => (
            <button key={o} type="button" role="radio" aria-checked={choice === i} disabled={checked}
              onClick={() => setChoice(i)}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${choice === i ? 'border-brand-600 bg-brand-50' : 'border-slate-300'}`}>
              {o}
            </button>
          ))}
        </div>
        {!checked && <div className="mt-3"><Btn disabled={choice === null} onClick={() => finishCheck(choice === ex.answer)}>Kiểm tra</Btn></div>}
        {checked && <><Feedback ok={ok}>{ok ? '' : `Đáp án: ${ex.options[ex.answer]}. `}{ex.explanationVi}</Feedback>{nextBtn}</>}
      </Card>
    )
  }

  if (ex.type === 'fill') {
    return (
      <Card>
        <p className="font-semibold">{ex.prompt}</p>
        <p className="text-sm text-slate-600">{ex.promptVi}</p>
        <p className="mb-3 text-xs text-slate-500">Gợi ý: {ex.hintVi}</p>
        <label className="sr-only" htmlFor="fill">Điền từ</label>
        <input id="fill" value={text} onChange={(e) => setText(e.target.value)} disabled={checked}
          autoCapitalize="none" autoComplete="off"
          className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Nhập từ còn thiếu" />
        {!checked && <div className="mt-3"><Btn disabled={!text.trim()} onClick={() => finishCheck(checkFill(ex, text))}>Kiểm tra</Btn></div>}
        {checked && <><Feedback ok={ok}>{ok ? '' : `Đáp án: ${ex.answers[0]}. `}{ex.explanationVi}</Feedback>{nextBtn}</>}
      </Card>
    )
  }

  if (ex.type === 'order') {
    const words = picked.map((i) => shuffled[i])
    return (
      <Card>
        <p className="mb-3 font-semibold">{ex.promptVi}</p>
        <div className="mb-3 min-h-12 rounded-lg border border-dashed border-slate-300 p-2" aria-label="Câu của bạn">
          {words.length === 0 && <span className="text-sm text-slate-400">Bấm các từ bên dưới theo thứ tự.</span>}
          {picked.map((i, pos) => (
            <button key={i} type="button" disabled={checked} onClick={() => setPicked(picked.filter((_, p) => p !== pos))}
              className="m-1 rounded bg-brand-100 px-2 py-1 text-sm">{shuffled[i]}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {shuffled.map((w, i) => (
            <button key={i} type="button" disabled={checked || picked.includes(i)} onClick={() => setPicked([...picked, i])}
              className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-30">{w}</button>
          ))}
        </div>
        {!checked && <div className="mt-3 flex gap-2">
          <Btn disabled={picked.length !== shuffled.length} onClick={() => finishCheck(checkOrder(ex, words))}>Kiểm tra</Btn>
          <Btn variant="ghost" onClick={() => setPicked([])}>Xóa</Btn></div>}
        {checked && <><Feedback ok={ok}>{ok ? '' : `Đáp án: ${ex.answer} `}{ex.explanationVi}</Feedback>{nextBtn}</>}
      </Card>
    )
  }

  // writing
  const fb = checked ? checkWriting(ex, text) : null
  return (
    <Card>
      <p className="font-semibold">{ex.scenarioEn}</p>
      <p className="mb-3 text-sm text-slate-600">{ex.promptVi}</p>
      <label className="sr-only" htmlFor="writing">Bài viết của bạn</label>
      <textarea id="writing" rows={9} value={text} onChange={(e) => setText(e.target.value)} disabled={checked}
        className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Viết bằng tiếng Anh…" />
      <p className="text-xs text-slate-500">Tối thiểu {ex.minWords} từ.</p>
      {!checked && <div className="mt-3"><Btn disabled={!text.trim()} onClick={() => {
        onSaveWriting(text)
        const r = checkWriting(ex, text)
        finishCheck(r.score >= 70)
      }}>Chấm bài</Btn></div>}
      {fb && (
        <>
          <Feedback ok={ok}>Điểm quy tắc: {fb.score}/100. Số từ: {fb.words}{fb.enoughWords ? '' : ` (cần ≥ ${ex.minWords})`}.</Feedback>
          <ul className="mt-2 text-sm">
            {fb.phraseHits.map((p) => (
              <li key={p.group.join('|')}>{p.hit ? '✓' : '✗'} Cụm từ: {p.group.join(' / ')}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">Chấm bằng quy tắc đơn giản (độ dài, cụm từ), chưa đánh giá ngữ pháp. So sánh với bài mẫu:</p>
          <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-sm">{ex.modelAnswer}</pre>
          {nextBtn}
        </>
      )}
    </Card>
  )
}
