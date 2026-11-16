import { useState } from 'react'
import { Btn, Card, PageTitle } from '../components/ui'
import { useStore } from '../lib/store'
import { averageScore, formatDuration, totalSeconds } from '../lib/stats'
import { getLesson } from '../data/lessons'

const kindLabel = { lesson: 'Đọc bài', flashcards: 'Flashcards', exercises: 'Bài tập' } as const

export default function History() {
  const { state, setDailyGoal, resetAll } = useStore()
  const [confirm, setConfirm] = useState(false)
  const list = [...state.sessions].reverse()
  const avg = averageScore(state.sessions)

  return (
    <>
      <PageTitle sub="Điểm số, thời lượng thực tế và lịch sử các buổi học.">Lịch sử học</PageTitle>

      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <Card><p className="text-xl font-bold">{state.sessions.length}</p><p className="text-xs text-slate-600">Buổi học</p></Card>
        <Card><p className="text-xl font-bold">{formatDuration(totalSeconds(state))}</p><p className="text-xs text-slate-600">Tổng thời gian</p></Card>
        <Card><p className="text-xl font-bold">{avg === null ? '—' : `${avg}%`}</p><p className="text-xs text-slate-600">Điểm trung bình</p></Card>
      </div>

      <Card className="mb-4">
        <label className="text-sm font-medium" htmlFor="goal">Mục tiêu mỗi ngày (phút)</label>
        <select id="goal" value={state.dailyGoalMinutes} onChange={(e) => setDailyGoal(Number(e.target.value))}
          className="ml-2 rounded border border-slate-300 px-2 py-1">
          {[10, 15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Card>

      {list.length === 0 ? (
        <Card><p className="text-sm text-slate-600">Chưa có buổi học nào. Hãy mở một bài học để bắt đầu.</p></Card>
      ) : (
        <Card>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="py-2">Ngày</th><th>Loại</th><th>Bài</th><th>Điểm</th><th>Thời lượng</th></tr></thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="py-2">{new Date(s.startedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{kindLabel[s.kind]}</td>
                  <td>{s.lessonId ? getLesson(s.lessonId)?.title : '—'}</td>
                  <td>{s.total ? `${s.score}/${s.total}` : '—'}</td>
                  <td>{formatDuration(s.seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="mt-6">
        {!confirm ? <Btn variant="ghost" onClick={() => setConfirm(true)}>Xóa toàn bộ tiến độ</Btn> : (
          <div className="flex items-center gap-2 text-sm">
            <span>Xóa hết dữ liệu trên trình duyệt này?</span>
            <Btn variant="danger" onClick={async () => { await resetAll(); setConfirm(false) }}>Xóa</Btn>
            <Btn variant="ghost" onClick={() => setConfirm(false)}>Hủy</Btn>
          </div>
        )}
      </div>
    </>
  )
}
