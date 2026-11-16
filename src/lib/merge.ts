import type { CardState, ProgressState } from '../types'

/** JSON ổn định (khóa sắp xếp) để so sánh hai trạng thái. */
export function stableStringify(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`).join(',')}}`
  }
  return JSON.stringify(v)
}
export const sameState = (a: ProgressState, b: ProgressState) => stableStringify(a) === stableStringify(b)

const t = (iso?: string) => (iso ? new Date(iso).getTime() || 0 : 0)

/** Thẻ nào mới hơn thì thắng: ôn gần nhất, rồi nhiều lượt ôn hơn, rồi so chuỗi để kết quả cố định. */
function pickCard(a: CardState, b: CardState): CardState {
  const d = t(a.lastReviewed) - t(b.lastReviewed)
  if (d !== 0) return d > 0 ? a : b
  if (a.reps !== b.reps) return a.reps > b.reps ? a : b
  return stableStringify(a) >= stableStringify(b) ? a : b
}

const uniqSorted = (xs: string[]) => [...new Set(xs)].sort()

/**
 * Gộp hai trạng thái học từ hai thiết bị. Không mất dữ liệu của bên nào:
 * - thẻ ôn: lấy bản ôn gần nhất cho từng từ
 * - buổi học, bài đã xong, từ nhập: hợp của hai bên
 * - từ đã xóa (deletedVocab): thắng, từ đó và thẻ của nó bị loại
 * - mục tiêu ngày, bài viết xung đột: bên sửa gần nhất (updatedAt) thắng
 * Giao hoán (merge(a,b) = merge(b,a)) và lũy đẳng (merge(a,a) = a), nên nhiều thiết bị hội tụ về cùng kết quả.
 */
export function mergeStates(a: ProgressState, b: ProgressState): ProgressState {
  const newer = t(a.updatedAt) > t(b.updatedAt) || (t(a.updatedAt) === t(b.updatedAt) && stableStringify(a) >= stableStringify(b)) ? a : b
  const older = newer === a ? b : a

  const deleted = new Set([...(a.deletedVocab ?? []), ...(b.deletedVocab ?? [])])

  const cards: Record<string, CardState> = {}
  for (const id of new Set([...Object.keys(a.cards), ...Object.keys(b.cards)])) {
    if (deleted.has(id)) continue
    const ca = a.cards[id]
    const cb = b.cards[id]
    cards[id] = ca && cb ? pickCard(ca, cb) : (ca ?? cb)
  }

  const vocab = new Map<string, ProgressState['customVocab'][number]>()
  for (const v of [...older.customVocab, ...newer.customVocab]) if (!deleted.has(v.id)) vocab.set(v.id, v)

  const sessions = new Map<string, ProgressState['sessions'][number]>()
  for (const s of [...a.sessions, ...b.sessions]) sessions.set(s.id, s)

  return {
    version: 1,
    cards,
    sessions: [...sessions.values()].sort((x, y) => t(x.startedAt) - t(y.startedAt) || x.id.localeCompare(y.id)),
    completedLessons: uniqSorted([...a.completedLessons, ...b.completedLessons]),
    dailyGoalMinutes: newer.dailyGoalMinutes,
    writings: { ...older.writings, ...newer.writings },
    customVocab: [...vocab.values()].sort((x, y) => x.id.localeCompare(y.id)),
    deletedVocab: uniqSorted([...deleted]),
    updatedAt: newer.updatedAt,
  }
}

/** Kiểm tra dữ liệu đọc từ file/đám mây có đúng dạng không, và điền các trường còn thiếu (bản cũ). */
export function normalizeState(raw: unknown): ProgressState | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Partial<ProgressState>
  if (r.version !== 1 || typeof r.cards !== 'object' || !Array.isArray(r.sessions)) return null
  return {
    version: 1,
    cards: r.cards ?? {},
    sessions: r.sessions ?? [],
    completedLessons: r.completedLessons ?? [],
    dailyGoalMinutes: typeof r.dailyGoalMinutes === 'number' ? r.dailyGoalMinutes : 20,
    writings: r.writings ?? {},
    customVocab: r.customVocab ?? [],
    deletedVocab: r.deletedVocab ?? [],
    updatedAt: r.updatedAt ?? '1970-01-01T00:00:00.000Z',
  }
}
