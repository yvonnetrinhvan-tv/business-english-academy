import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Btn, Card, PageTitle, ProgressBar } from '../components/ui'
import SpeakButton from '../components/SpeakButton'
import { useStore } from '../lib/store'
import { isDue, newCard, previewInterval } from '../lib/srs'
import { useStudyTimer } from '../lib/useStudyTimer'
import type { Grade } from '../types'

const NEW_PER_SESSION = 10

export default function Review() {
  const { ready } = useStore()
  if (!ready) return <p>Đang tải…</p>
  return <ReviewSession />
}

function ReviewSession() {
  const { state, gradeCard, ensureCards, logSession, vocab: allVocab } = useStore()
  const timer = useStudyTimer()

  // Chụp danh sách ôn một lần khi bắt đầu phiên
  const initial = useMemo(() => {
    const now = new Date()
    const due = Object.values(state.cards).filter((c) => isDue(c, now)).map((c) => c.vocabId)
    const fresh = allVocab.filter((v) => !state.cards[v.id]).slice(0, NEW_PER_SESSION).map((v) => v.id)
    return [...due, ...fresh]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [queue, setQueue] = useState<string[]>(initial)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const [good, setGood] = useState(0)
  const [finished, setFinished] = useState(false)
  // Ghi nhận phiên khi rời trang giữa chừng (nếu chưa ghi)
  const live = useRef({ reviewed: 0, good: 0, finished: false })
  live.current = { reviewed, good, finished }
  useEffect(() => () => {
    const l = live.current
    if (l.finished || l.reviewed === 0) return
    const { seconds, startedAt } = timer.stop()
    logSession({ kind: 'flashcards', startedAt, seconds, score: l.good, total: l.reviewed })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const total = initial.length
  const currentId = queue[0]
  const vocab = currentId ? allVocab.find((v) => v.id === currentId) : undefined
  const card = currentId ? state.cards[currentId] ?? newCard(currentId, new Date()) : undefined

  const finish = () => {
    if (finished) return
    const { seconds, startedAt } = timer.stop()
    if (reviewed > 0) logSession({ kind: 'flashcards', startedAt, seconds, score: good, total: reviewed })
    live.current.finished = true
    setFinished(true)
  }

  const answer = (g: Grade) => {
    if (!currentId) return
    if (!state.cards[currentId]) ensureCards([currentId])
    gradeCard(currentId, g)
    setReviewed((n) => n + 1)
    if (g !== 'again') setGood((n) => n + 1)
    const rest = queue.slice(1)
    const next = g === 'again' ? [...rest, currentId] : rest
    setQueue(next)
    setFlipped(false)
    if (!next.length) {
      const { seconds, startedAt } = timer.stop()
      logSession({ kind: 'flashcards', startedAt, seconds, score: good + (g !== 'again' ? 1 : 0), total: reviewed + 1 })
      live.current.finished = true
      setFinished(true)
    }
  }

  if (total === 0) {
    return (
      <>
        <PageTitle>Ôn từ vựng</PageTitle>
        <Card><p>Không có từ nào đến hạn ôn. Quay lại sau nhé.</p>
          <div className="mt-3"><Link to="/chuong-trinh"><Btn variant="ghost">Xem chương trình</Btn></Link></div></Card>
      </>
    )
  }

  if (finished || !vocab || !card) {
    return (
      <>
        <PageTitle>Hoàn thành phiên ôn</PageTitle>
        <Card>
          <p>Đã ôn <b>{reviewed}</b> lượt, nhớ được <b>{good}</b> lượt.</p>
          <div className="mt-3"><Link to="/"><Btn>Về tổng quan</Btn></Link></div>
        </Card>
      </>
    )
  }

  const now = new Date()
  const grades: { g: Grade; label: string; cls: string }[] = [
    { g: 'again', label: 'Quên', cls: 'bg-rose-600 hover:bg-rose-700' },
    { g: 'hard', label: 'Khó', cls: 'bg-amber-600 hover:bg-amber-700' },
    { g: 'good', label: 'Nhớ', cls: 'bg-brand-700 hover:bg-brand-900' },
    { g: 'easy', label: 'Dễ', cls: 'bg-sky-700 hover:bg-sky-800' },
  ]

  return (
    <>
      <PageTitle sub={`Còn ${queue.length} thẻ`}>Ôn từ vựng</PageTitle>
      <div className="mb-4"><ProgressBar value={total - new Set(queue).size} max={total} label="Tiến độ phiên ôn" /></div>

      <Card className="min-h-64 text-center">
        <p className="text-3xl font-bold">{vocab.term}</p>
        <p className="mt-1 text-slate-500">{[vocab.ipa, vocab.pos].filter(Boolean).join(' · ')}</p>
        <div className="mt-2 flex justify-center gap-2">
          <SpeakButton text={vocab.term} label="Nghe từ" />
          {vocab.exampleEn && <SpeakButton text={vocab.exampleEn} label="Nghe câu" />}
        </div>
        {flipped ? (
          <div className="mt-4 space-y-2 text-left">
            <p className="text-xl font-semibold text-brand-700">{vocab.meaningVi}</p>
            {vocab.exampleEn && <p>{vocab.exampleEn}</p>}
            {vocab.exampleVi && <p className="text-sm text-slate-600">{vocab.exampleVi}</p>}
          </div>
        ) : (
          <div className="mt-8"><Btn onClick={() => setFlipped(true)}>Hiện đáp án</Btn></div>
        )}
      </Card>

      {flipped && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {grades.map(({ g, label, cls }) => (
            <button key={g} type="button" onClick={() => answer(g)}
              className={`rounded-lg px-2 py-3 text-sm font-semibold text-white ${cls}`}>
              {label}
              <span className="block text-xs font-normal opacity-90">{previewInterval(card, g, now)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6"><Btn variant="ghost" onClick={finish}>Kết thúc sớm</Btn></div>
    </>
  )
}
