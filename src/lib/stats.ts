import type { ProgressState, StudySession } from '../types'

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function secondsOnDay(sessions: StudySession[], day: Date): number {
  const k = dayKey(day)
  return sessions.filter((s) => dayKey(new Date(s.startedAt)) === k).reduce((a, s) => a + s.seconds, 0)
}

/** 7 ngày gần nhất, ngày cũ nhất trước */
export function last7Days(sessions: StudySession[], now: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    return { date: d, seconds: secondsOnDay(sessions, d) }
  })
}

/** Số ngày liên tiếp có học (tính đến hôm nay; nếu hôm nay chưa học thì tính đến hôm qua) */
export function streak(sessions: StudySession[], now: Date): number {
  const days = new Set(sessions.filter((s) => s.seconds > 0).map((s) => dayKey(new Date(s.startedAt))))
  const d = new Date(now)
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(dayKey(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function averageScore(sessions: StudySession[]): number | null {
  const scored = sessions.filter((s) => s.total && s.total > 0)
  if (!scored.length) return null
  const pct = scored.reduce((a, s) => a + (s.score ?? 0) / (s.total as number), 0) / scored.length
  return Math.round(pct * 100)
}

export const totalSeconds = (st: ProgressState) => st.sessions.reduce((a, s) => a + s.seconds, 0)

export function formatDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)} giây`
  const m = Math.round(sec / 60)
  if (m < 60) return `${m} phút`
  return `${Math.floor(m / 60)} giờ ${m % 60} phút`
}
