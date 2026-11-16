import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Btn, Card, PageTitle, ProgressBar } from '../components/ui'
import ReviewQuestion, { VocabDetail } from '../components/ReviewQuestion'
import { useStore } from '../lib/store'
import { forecast, isLeech, isNewCard, isReviewDue, mastery, newCard } from '../lib/srs'
import { canSpeak } from '../lib/speech'
import { useStudyTimer } from '../lib/useStudyTimer'
import { formatDuration } from '../lib/stats'
import {
  afterAnswer, afterIntro, buildPractice, buildQuestion, buildSession, gradeFromOutcome, MODE_LABEL, pickMode,
  type Forced, type Mode, type Outcome, TYPE_ONLY_LABEL, type PracticeScope, type QueueItem, type StepResult,
} from '../lib/review'
import type { VocabItem } from '../types'

const dow = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const SEC_PER_CARD = 20

interface RunConfig { items: QueueItem[]; practice: boolean; forced: Forced }
interface Answer { vocabId: string; mode: Mode; correct: boolean; ms: number }
interface Summary { answers: Answer[]; failedIds: string[]; seconds: number; practice: boolean }

export default function Review() {
  const { ready } = useStore()
  const [run, setRun] = useState<RunConfig | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  if (!ready) return <p>Đang tải…</p>
  if (run) return <Session key={run.items[0]?.uid} cfg={run} onEnd={(s) => { setRun(null); setSummary(s) }} />
  if (summary) return <SummaryView s={summary} onBack={() => setSummary(null)} />
  return <Home onStart={setRun} />
}

// ============================ Màn hình chính ============================

function Home({ onStart }: { onStart: (c: RunConfig) => void }) {
  const { state, vocab } = useStore()
  const [limit, setLimit] = useState(20)
  const [newLimit, setNewLimit] = useState(10)
  const [forced, setForced] = useState<Forced>('type')
  const [scope, setScope] = useState<PracticeScope>('weak')
  const now = new Date()

  const cards = Object.values(state.cards)
  const plan = useMemo(() => buildSession(vocab, state.cards, new Date(), limit, newLimit), [vocab, state.cards, limit, newLimit])
  const dueAll = vocab.filter((v) => state.cards[v.id] && isReviewDue(state.cards[v.id], now)).length
  const newAll = vocab.filter((v) => isNewCard(state.cards[v.id])).length
  const leeches = vocab.filter((v) => isLeech(state.cards[v.id]))
  const fc = forecast(cards, now)
  const maxFc = Math.max(1, ...fc)
  const dist = { new: 0, learning: 0, familiar: 0, mastered: 0 }
  vocab.forEach((v) => { dist[mastery(isNewCard(state.cards[v.id]) ? undefined : state.cards[v.id])]++ })

  const recent = state.sessions.filter((s) => (s.kind === 'review' || s.kind === 'flashcards') && s.total).slice(-10)
  const recTotal = recent.reduce((a, s) => a + (s.total ?? 0), 0)
  const retention = recTotal ? Math.round((recent.reduce((a, s) => a + (s.score ?? 0), 0) / recTotal) * 100) : null

  const practiceItems = useMemo(() => buildPractice(vocab, state.cards, scope, 15), [vocab, state.cards, scope])
  const total = plan.items.length
  const minutes = Math.max(1, Math.round((total * SEC_PER_CARD) / 60))
  const nextDue = fc.findIndex((n, i) => i > 0 && n > 0)

  const sel = 'rounded border border-slate-300 px-2 py-1 text-sm'
  return (
    <>
      <PageTitle sub="Ôn theo lịch ngắt quãng. Từ càng nhớ lâu, câu hỏi càng khó.">Ôn tập</PageTitle>

      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <Card><p className="text-2xl font-bold">{dueAll}</p><p className="text-xs text-slate-600">Đến hạn ôn</p></Card>
        <Card><p className="text-2xl font-bold">{newAll}</p><p className="text-xs text-slate-600">Từ mới</p></Card>
        <Card><p className="text-2xl font-bold">{retention === null ? '—' : `${retention}%`}</p><p className="text-xs text-slate-600">Nhớ đúng gần đây</p></Card>
      </div>

      <Card className="mb-4">
        <h2 className="font-semibold">Phiên ôn hôm nay</h2>
        {total === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            Không có thẻ nào cần ôn.{' '}
            {nextDue > 0 ? `Thẻ kế tiếp đến hạn ${nextDue === 1 ? 'ngày mai' : `sau ${nextDue} ngày`} (${fc[nextDue]} thẻ).` : newAll === 0 ? 'Hãy thêm từ mới từ bài học hoặc tab Nhập từ.' : ''}
          </p>
        ) : (
          <p className="mt-2 text-sm">{plan.dueCount} thẻ ôn + {plan.newCount} từ mới · khoảng {minutes} phút</p>
        )}
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <label className="flex items-center justify-between gap-2 sm:block">Số thẻ ôn tối đa
            <select aria-label="Số thẻ ôn tối đa" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className={`${sel} sm:mt-1 sm:w-full`}>
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
          <label className="flex items-center justify-between gap-2 sm:block">Từ mới mỗi phiên
            <select aria-label="Từ mới mỗi phiên" value={newLimit} onChange={(e) => setNewLimit(Number(e.target.value))} className={`${sel} sm:mt-1 sm:w-full`}>
              {[0, 1, 5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
          <label className="flex items-center justify-between gap-2 sm:block">Kiểu ôn
            <select aria-label="Kiểu ôn" value={forced} onChange={(e) => setForced(e.target.value as Forced)} className={`${sel} sm:mt-1 sm:w-full`}>
              <option value="type">{TYPE_ONLY_LABEL} (mặc định)</option>
              <option value="auto">Tự động (trắc nghiệm → gõ)</option>
              {(Object.keys(MODE_LABEL) as Mode[]).filter((m) => m !== 'listening' || canSpeak()).map((m) => <option key={m} value={m}>{MODE_LABEL[m]}</option>)}</select></label>
        </div>
        <p className="mt-2 text-xs text-slate-500">Mặc định: mọi thẻ tự gõ đáp án (gõ từ theo nghĩa hoặc điền câu), không có trắc nghiệm. Chọn “Tự động” nếu muốn từ mới làm trắc nghiệm trước, từ nhớ lâu mới chuyển sang gõ và nghe. Từ quên sẽ quay lại sau vài thẻ.</p>
        <div className="mt-3"><Btn disabled={total === 0} onClick={() => onStart({ items: plan.items, practice: false, forced })}>Bắt đầu ôn ({total} thẻ)</Btn></div>
      </Card>

      <Card className="mb-4">
        <h2 className="mb-3 font-semibold">Dự báo 7 ngày tới (số thẻ đến hạn)</h2>
        <div className="flex h-24 items-end gap-2" role="img" aria-label="Biểu đồ số thẻ đến hạn 7 ngày tới">
          {fc.map((n, i) => {
            const d = new Date(now); d.setDate(now.getDate() + i)
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium">{n}</span>
                <div className="w-full rounded-t bg-brand-600" style={{ height: `${Math.max(2, (n / maxFc) * 56)}px` }} />
                <span className="text-xs text-slate-500">{i === 0 ? 'Nay' : dow[d.getDay()]}</span>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="mb-2 font-semibold">Mức ghi nhớ ({vocab.length} từ)</h2>
        <div className="flex h-3 overflow-hidden rounded-full bg-slate-200" role="img" aria-label="Phân bố mức ghi nhớ">
          {([['new', 'bg-slate-400'], ['learning', 'bg-amber-500'], ['familiar', 'bg-sky-600'], ['mastered', 'bg-emerald-600']] as const).map(([k, c]) => (
            <div key={k} className={c} style={{ width: `${vocab.length ? (dist[k] / vocab.length) * 100 : 0}%` }} />
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          <li>Mới: <b>{dist.new}</b></li><li>Đang học: <b>{dist.learning}</b></li><li>Quen (≥4 ngày): <b>{dist.familiar}</b></li><li>Thuộc (≥21 ngày): <b>{dist.mastered}</b></li>
        </ul>
        {leeches.length > 0 && (
          <p className="mt-2 text-sm text-rose-800">Từ khó (quên từ 4 lần): {leeches.map((v) => v.term).join(', ')}. Hãy thử đặt câu ví dụ của riêng bạn cho các từ này.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold">Luyện thêm</h2>
        <p className="mt-1 text-xs text-slate-500">Làm thêm bất cứ lúc nào. Kết quả <b>không đổi lịch ôn</b>, nên không làm lệch lịch ngắt quãng.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select aria-label="Phạm vi luyện thêm" value={scope} onChange={(e) => setScope(e.target.value as PracticeScope)} className={sel}>
            <option value="weak">Từ còn yếu</option><option value="all">Tất cả từ đã học</option></select>
          <Btn variant="ghost" disabled={practiceItems.length === 0} onClick={() => onStart({ items: practiceItems, practice: true, forced })}>
            Luyện {practiceItems.length} thẻ</Btn>
        </div>
        {practiceItems.length === 0 && <p className="mt-2 text-xs text-slate-500">Chưa có từ nào phù hợp. Học một số từ mới trước.</p>}
      </Card>
    </>
  )
}

// ============================ Phiên ôn ============================

function Session({ cfg, onEnd }: { cfg: RunConfig; onEnd: (s: Summary) => void }) {
  const { state, vocab, gradeCard, ensureCards, logSession } = useStore()
  const timer = useStudyTimer()
  const byId = useMemo(() => new Map(vocab.map((v) => [v.id, v] as const)), [vocab])
  const ctx = useMemo(() => ({ canSpeak: canSpeak(), poolSize: vocab.length }), [vocab.length])

  const [queue, setQueue] = useState<QueueItem[]>(cfg.items)
  const failed = useRef(new Set<string>())
  const answers = useRef<Answer[]>([])
  const pending = useRef<StepResult | null>(null)
  const lastMode = useRef<Mode | undefined>(undefined)
  const done = useRef(false)
  const totalUnique = useMemo(() => new Set(cfg.items.map((i) => i.vocabId)).size, [cfg.items])

  const current = queue[0]
  const vocabItem: VocabItem | undefined = current ? byId.get(current.vocabId) : undefined
  const cardNow = current ? state.cards[current.vocabId] ?? newCard(current.vocabId, new Date()) : undefined

  // Chọn kiểu và dựng câu hỏi một lần cho mỗi mục trong hàng đợi
  const question = useMemo(() => {
    if (!current || current.kind === 'intro' || !vocabItem) return null
    const mode = pickMode(state.cards[current.vocabId], vocabItem, ctx, { forced: cfg.forced, last: lastMode.current, relearn: current.relearn })
    return buildQuestion(mode, vocabItem, vocab)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.uid])

  const finish = () => {
    if (done.current) return
    done.current = true
    const { seconds, startedAt } = timer.stop()
    const first = answers.current.filter((a, i) => answers.current.findIndex((b) => b.vocabId === a.vocabId) === i)
    if (!cfg.practice && first.length > 0) {
      logSession({ kind: 'review', startedAt, seconds, score: first.filter((a) => a.correct).length, total: first.length })
    }
    onEnd({ answers: answers.current, failedIds: [...new Set(answers.current.filter((a) => !a.correct).map((a) => a.vocabId))], seconds, practice: cfg.practice })
  }

  // Rời trang giữa chừng vẫn ghi lại phần đã ôn
  const live = useRef({ n: 0 })
  live.current.n = answers.current.length
  useEffect(() => () => {
    if (done.current || cfg.practice || answers.current.length === 0) return
    const { seconds, startedAt } = timer.stop()
    const first = answers.current.filter((a, i) => answers.current.findIndex((b) => b.vocabId === a.vocabId) === i)
    logSession({ kind: 'review', startedAt, seconds, score: first.filter((a) => a.correct).length, total: first.length })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onResult = (o: Outcome) => {
    if (!current || !question) return
    const grade = gradeFromOutcome(question.mode, o)
    const step = afterAnswer(queue, current, grade, o.correct, failed.current)
    if (!cfg.practice && step.grade) {
      if (!state.cards[current.vocabId]) ensureCards([current.vocabId])
      gradeCard(current.vocabId, step.grade)
    }
    answers.current.push({ vocabId: current.vocabId, mode: question.mode, correct: o.correct, ms: o.ms })
    lastMode.current = question.mode
    pending.current = step
  }

  const onNext = () => {
    const step = pending.current
    pending.current = null
    if (!step) return
    failed.current = step.failed
    setQueue(step.queue)
    if (step.queue.length === 0) finish()
  }

  if (!current || !vocabItem || !cardNow) {
    return <Card><p>Hết thẻ.</p><div className="mt-3"><Btn onClick={finish}>Xem kết quả</Btn></div></Card>
  }

  const remaining = new Set(queue.map((q) => q.vocabId)).size
  return (
    <>
      <PageTitle sub={`${cfg.practice ? 'Luyện thêm (không đổi lịch ôn) · ' : ''}Còn ${remaining} từ`}>Ôn tập</PageTitle>
      <div className="mb-4"><ProgressBar value={totalUnique - remaining} max={totalUnique} label="Tiến độ phiên ôn" /></div>

      {current.kind === 'intro' ? (
        <Card key={current.uid}>
          <div className="mb-3 text-xs"><span className="rounded bg-sky-100 px-2 py-0.5 font-medium text-sky-900">Từ mới</span></div>
          <VocabDetail v={vocabItem} />
          <p className="mt-3 text-xs text-slate-500">Đọc kỹ, nghe phát âm. Bạn sẽ được kiểm tra ngay sau vài thẻ.</p>
          <div className="mt-3">
            <Btn onClick={() => { ensureCards([current.vocabId]); setQueue(afterIntro(queue, current)) }}>Đã xem, kiểm tra tôi</Btn>
          </div>
        </Card>
      ) : question ? (
        <ReviewQuestion key={current.uid} q={question} vocab={vocabItem} card={cardNow} relearn={!!current.relearn}
          leech={isLeech(state.cards[current.vocabId])} onResult={onResult} onNext={onNext} />
      ) : null}

      <div className="mt-6"><Btn variant="ghost" onClick={finish}>Kết thúc sớm</Btn></div>
    </>
  )
}

// ============================ Tổng kết ============================

function SummaryView({ s, onBack }: { s: Summary; onBack: () => void }) {
  const { state, vocab } = useStore()
  const first = s.answers.filter((a, i) => s.answers.findIndex((b) => b.vocabId === a.vocabId) === i)
  const right = first.filter((a) => a.correct).length
  const pct = first.length ? Math.round((right / first.length) * 100) : 0
  const byMode = new Map<Mode, { ok: number; n: number }>()
  s.answers.forEach((a) => { const m = byMode.get(a.mode) ?? { ok: 0, n: 0 }; m.n++; if (a.correct) m.ok++; byMode.set(a.mode, m) })
  const term = (id: string) => vocab.find((v) => v.id === id)
  const fc = forecast(Object.values(state.cards), new Date())
  const leeches = s.failedIds.filter((id) => isLeech(state.cards[id]))

  return (
    <>
      <PageTitle>{s.practice ? 'Kết thúc luyện thêm' : 'Hoàn thành phiên ôn'}</PageTitle>
      <Card className="mb-4">
        <p className="text-3xl font-bold">{right}/{first.length} <span className="text-lg font-medium text-slate-500">đúng ngay lần đầu ({pct}%)</span></p>
        <p className="mt-1 text-sm text-slate-600">Thời gian: {formatDuration(s.seconds)}{s.practice ? '' : ` · Ngày mai: ${fc[1]} thẻ đến hạn`}</p>
        {s.practice && <p className="mt-1 text-xs text-slate-500">Luyện thêm không thay đổi lịch ôn.</p>}
      </Card>

      {byMode.size > 0 && (
        <Card className="mb-4">
          <h2 className="mb-2 font-semibold">Theo kiểu ôn</h2>
          <ul className="grid gap-1 text-sm">
            {[...byMode].map(([m, v]) => <li key={m} className="flex justify-between"><span>{MODE_LABEL[m]}</span><span>{v.ok}/{v.n}</span></li>)}
          </ul>
        </Card>
      )}

      {s.failedIds.length > 0 && (
        <Card className="mb-4">
          <h2 className="mb-2 font-semibold">Từ cần chú ý ({s.failedIds.length})</h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {s.failedIds.map((id) => { const v = term(id); return v && <li key={id} className="py-2"><b>{v.term}</b> · {v.meaningVi}{leeches.includes(id) && <span className="ml-2 rounded bg-rose-100 px-1.5 text-xs text-rose-900">từ khó</span>}</li> })}
          </ul>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Btn onClick={onBack}>Về màn hình ôn tập</Btn>
        <Link to="/"><Btn variant="ghost">Về tổng quan</Btn></Link>
      </div>
    </>
  )
}
