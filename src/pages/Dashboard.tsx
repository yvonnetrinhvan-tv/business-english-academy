import { Link } from 'react-router-dom'
import { Card, PageTitle, ProgressBar, Btn } from '../components/ui'
import { useStore } from '../lib/store'
import { lessons, allVocab } from '../data/lessons'
import { isDue, mastery } from '../lib/srs'
import { formatDuration, last7Days, secondsOnDay, streak } from '../lib/stats'

const dow = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export default function Dashboard() {
  const { state } = useStore()
  const now = new Date()
  const todaySec = secondsOnDay(state.sessions, now)
  const goalSec = state.dailyGoalMinutes * 60
  const week = last7Days(state.sessions, now)
  const maxWeek = Math.max(goalSec, ...week.map((d) => d.seconds))
  const dueCount = Object.values(state.cards).filter((c) => isDue(c, now)).length
  const newCount = allVocab.filter((v) => !state.cards[v.id]).length
  const learned = allVocab.filter((v) => ['familiar', 'mastered'].includes(mastery(state.cards[v.id]))).length
  const today = lessons.find((l) => l.content && !state.completedLessons.includes(l.id))
  const done = state.completedLessons.length

  return (
    <>
      <PageTitle sub="Học đều mỗi ngày, ôn đúng lúc.">Tổng quan</PageTitle>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Bài học hôm nay</h2>
          {today ? (
            <>
              <p className="mt-2 text-lg font-bold">{today.title}</p>
              <p className="text-sm text-slate-600">{today.titleVi} · {today.minutes} phút · {today.level}</p>
              <div className="mt-3"><Link to={`/bai/${today.id}`}><Btn>Bắt đầu học</Btn></Link></div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-600">Bạn đã học hết các bài có nội dung. Các bài còn lại đang được soạn.</p>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold">Thời gian học hôm nay</h2>
          <p className="mt-2 text-2xl font-bold">{formatDuration(todaySec)}</p>
          <p className="mb-2 text-sm text-slate-600">Mục tiêu: {state.dailyGoalMinutes} phút · Chuỗi: {streak(state.sessions, now)} ngày</p>
          <ProgressBar value={todaySec} max={goalSec} label="Tiến độ mục tiêu ngày" />
        </Card>

        <Card>
          <h2 className="font-semibold">Ôn từ vựng</h2>
          <p className="mt-2 text-sm">Đến hạn ôn: <b>{dueCount}</b> · Từ mới: <b>{newCount}</b></p>
          <div className="mt-3"><Link to="/on-tap"><Btn variant={dueCount + newCount ? 'primary' : 'ghost'}>Mở flashcards</Btn></Link></div>
        </Card>

        <Card>
          <h2 className="font-semibold">Tiến độ tổng</h2>
          <p className="mt-2 text-sm">Bài đã hoàn thành: <b>{done}/{lessons.length}</b></p>
          <ProgressBar value={done} max={lessons.length} label="Tiến độ bài học" />
          <p className="mt-3 text-sm">Từ đã quen: <b>{learned}/{allVocab.length}</b></p>
          <ProgressBar value={learned} max={allVocab.length} label="Tiến độ từ vựng" />
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-3 font-semibold">7 ngày gần nhất (phút)</h2>
        <div className="flex h-28 items-end gap-2" role="img" aria-label="Biểu đồ thời gian học 7 ngày">
          {week.map((d) => (
            <div key={d.date.toISOString()} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-brand-600" style={{ height: `${Math.max(2, (d.seconds / maxWeek) * 80)}px` }} />
              <span className="text-xs text-slate-500">{dow[d.date.getDay()]}</span>
              <span className="text-xs font-medium">{Math.round(d.seconds / 60)}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
