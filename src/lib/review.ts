import type { CardState, Grade, VocabItem } from '../types'
import { isDue, isLeech, isNewCard, isReviewDue } from './srs'
import { shuffle } from './exercises'

// ===================== Kiểu ôn =====================

export type Mode = 'flashcard' | 'mcq-vi' | 'mcq-en' | 'cloze' | 'typing' | 'listening'

export const MODE_LABEL: Record<Mode, string> = {
  flashcard: 'Flashcard tự chấm',
  'mcq-vi': 'Chọn nghĩa',
  'mcq-en': 'Chọn từ',
  cloze: 'Điền vào câu',
  typing: 'Gõ từ',
  listening: 'Nghe và gõ',
}

export interface ModeContext {
  canSpeak: boolean
  /** Tổng số từ có thể làm đáp án nhiễu */
  poolSize: number
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Tìm từ/cụm trong câu ví dụ (chấp nhận biến thể ngắn: attach → attached, follow up → following up). */
export function clozeOf(v: VocabItem): { sentence: string; answer: string } | null {
  if (!v.exampleEn) return null
  const words = v.term.trim().split(/[\s-]+/).filter(Boolean)
  if (!words.length) return null
  const body = words.map((w) => `${esc(w)}[a-z]{0,4}`).join('[\\s-]+')
  const m = new RegExp(`(^|[^A-Za-z])(${body})(?![A-Za-z])`, 'i').exec(v.exampleEn)
  if (!m) return null
  const start = m.index + m[1].length
  const answer = m[2]
  return { sentence: v.exampleEn.slice(0, start) + '_____' + v.exampleEn.slice(start + answer.length), answer }
}

export function availableModes(v: VocabItem, ctx: ModeContext): Mode[] {
  const out: Mode[] = ['flashcard', 'typing']
  if (ctx.poolSize >= 4) out.push('mcq-vi', 'mcq-en')
  if (clozeOf(v)) out.push('cloze')
  if (ctx.canSpeak) out.push('listening')
  return out
}

/**
 * Từ mới học: nhận ra (chọn đáp án). Càng nhớ lâu, càng chuyển sang tự nhớ ra (gõ, nghe, điền câu).
 * Đây là cách ôn hiệu quả hơn lật thẻ: nhớ ra khó hơn nhận ra và củng cố trí nhớ mạnh hơn.
 */
const STAGES: Mode[][] = [
  ['mcq-vi'],
  ['mcq-en', 'cloze'],
  ['cloze', 'typing', 'mcq-en', 'flashcard'],
  ['typing', 'listening', 'cloze', 'flashcard'],
]

export interface PickOptions {
  forced?: Mode | 'auto'
  last?: Mode
  /** Đang học lại sau khi quên: chỉ dùng kiểu nhận ra cho dễ */
  relearn?: boolean
  rand?: () => number
}

export function pickMode(card: CardState | undefined, v: VocabItem, ctx: ModeContext, o: PickOptions = {}): Mode {
  const rand = o.rand ?? Math.random
  const avail = availableModes(v, ctx)
  if (o.forced && o.forced !== 'auto') return avail.includes(o.forced) ? o.forced : 'flashcard'
  if (o.relearn || isLeech(card)) {
    const easy = (['mcq-vi', 'mcq-en'] as Mode[]).filter((m) => avail.includes(m))
    if (easy.length) return easy[Math.floor(rand() * easy.length)]
    return 'flashcard'
  }
  const stage = Math.min(card?.reps ?? 0, STAGES.length - 1)
  let options = STAGES[stage].filter((m) => avail.includes(m))
  if (o.last && options.length > 1) options = options.filter((m) => m !== o.last)
  if (!options.length) options = avail.filter((m) => m !== 'flashcard')
  if (!options.length) return 'flashcard'
  return options[Math.floor(rand() * options.length)]
}

// ===================== Câu hỏi =====================

export interface Question {
  mode: Mode
  vocabId: string
  options?: string[]
  answerIndex?: number
  accepted?: string[]
  /** Chuỗi hiển thị chỗ trống cho câu điền, ví dụ "He ___ the file" */
  sentence?: string
}

function distractors(v: VocabItem, pool: VocabItem[], key: 'meaningVi' | 'term', rand: () => number): string[] {
  const seen = new Set<string>([v[key].toLowerCase()])
  const others = pool.filter((p) => p.id !== v.id)
  const samePos = shuffle(others.filter((p) => p.pos && p.pos === v.pos), rand)
  const rest = shuffle(others.filter((p) => !(p.pos && p.pos === v.pos)), rand)
  const out: string[] = []
  for (const p of [...samePos, ...rest]) {
    const val = p[key]
    if (!val || seen.has(val.toLowerCase())) continue
    seen.add(val.toLowerCase())
    out.push(val)
    if (out.length === 3) break
  }
  return out
}

export function buildQuestion(mode: Mode, v: VocabItem, pool: VocabItem[], rand: () => number = Math.random): Question {
  if (mode === 'mcq-vi' || mode === 'mcq-en') {
    const key = mode === 'mcq-vi' ? 'meaningVi' : 'term'
    const correct = v[key]
    const options = shuffle([correct, ...distractors(v, pool, key, rand)], rand)
    return { mode, vocabId: v.id, options, answerIndex: options.indexOf(correct) }
  }
  if (mode === 'cloze') {
    const c = clozeOf(v)
    if (c) return { mode, vocabId: v.id, sentence: c.sentence, accepted: [...new Set([c.answer, v.term])] }
  }
  if (mode === 'typing' || mode === 'listening') return { mode, vocabId: v.id, accepted: [v.term] }
  return { mode: 'flashcard', vocabId: v.id }
}

// ===================== Chấm bài gõ =====================

export const normalizeAnswer = (s: string) =>
  s.toLowerCase().replace(/[-–—]/g, ' ').replace(/[.,;:!?"'’()]/g, '').replace(/\s+/g, ' ').trim()

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

export interface TypedResult { correct: boolean; near: boolean }

/** Đúng hẳn, hoặc "gần đúng" (sai 1 ký tự với từ từ 5 ký tự trở lên) */
export function checkTyped(input: string, accepted: string[]): TypedResult {
  const x = normalizeAnswer(input)
  if (!x) return { correct: false, near: false }
  const acc = accepted.map(normalizeAnswer)
  if (acc.includes(x)) return { correct: true, near: false }
  const near = acc.some((a) => a.length >= 5 && levenshtein(a, x) === 1)
  return { correct: false, near }
}

// ===================== Quy đổi kết quả → mức SRS =====================

export interface Outcome {
  correct: boolean
  near?: boolean
  usedHint?: boolean
  /** Thời gian trả lời (ms) */
  ms: number
  /** Chỉ dùng cho flashcard tự chấm */
  selfGrade?: Grade
}

const PRODUCTION: Mode[] = ['typing', 'cloze', 'listening']

/**
 * - sai → again
 * - gần đúng hoặc dùng gợi ý → hard
 * - đúng ngay, kiểu tự nhớ ra, nhanh (≤ 6 giây), không gợi ý → easy
 * - còn lại đúng → good
 */
export function gradeFromOutcome(mode: Mode, o: Outcome): Grade {
  if (mode === 'flashcard' && o.selfGrade) return o.selfGrade
  if (!o.correct) return o.near ? 'hard' : 'again'
  if (o.usedHint) return 'hard'
  if (PRODUCTION.includes(mode) && o.ms <= 6000) return 'easy'
  return 'good'
}

// ===================== Hàng đợi phiên ôn =====================

export interface QueueItem {
  uid: string
  vocabId: string
  kind: 'intro' | 'quiz'
  relearn?: boolean
}

let uidN = 0
export const makeItem = (vocabId: string, kind: QueueItem['kind'], relearn = false): QueueItem => ({ uid: `q${++uidN}`, vocabId, kind, relearn })

export interface SessionPlan { items: QueueItem[]; dueCount: number; newCount: number }

/**
 * Phiên ôn tính lịch: thẻ quá hạn lâu nhất ôn trước, từ mới xen kẽ (cứ 3 thẻ ôn thì 1 từ mới).
 */
export function buildSession(vocab: VocabItem[], cards: Record<string, CardState>, now: Date, limit: number, newLimit: number): SessionPlan {
  const due = vocab
    .filter((v) => cards[v.id] && isReviewDue(cards[v.id], now))
    .sort((a, b) => new Date(cards[a.id].due).getTime() - new Date(cards[b.id].due).getTime())
    .slice(0, limit)
  const fresh = vocab.filter((v) => isNewCard(cards[v.id])).slice(0, newLimit)
  const items: QueueItem[] = []
  let nextNew = 0
  due.forEach((v, i) => {
    items.push(makeItem(v.id, 'quiz'))
    if ((i + 1) % 3 === 0 && nextNew < fresh.length) items.push(makeItem(fresh[nextNew++].id, 'intro'))
  })
  while (nextNew < fresh.length) items.push(makeItem(fresh[nextNew++].id, 'intro'))
  return { items, dueCount: due.length, newCount: fresh.length }
}

export type PracticeScope = 'weak' | 'all'

/** Luyện thêm (không đổi lịch ôn): "yếu" = từng quên hoặc còn mới nhớ (khoảng ôn < 4 ngày). */
export function buildPractice(vocab: VocabItem[], cards: Record<string, CardState>, scope: PracticeScope, limit: number, rand: () => number = Math.random): QueueItem[] {
  const learned = vocab.filter((v) => cards[v.id] && !isNewCard(cards[v.id]))
  const pick = scope === 'weak'
    ? learned.filter((v) => cards[v.id].lapses > 0 || cards[v.id].intervalDays < 4).sort((a, b) => cards[b.id].lapses - cards[a.id].lapses)
    : shuffle(learned, rand)
  return pick.slice(0, limit).map((v) => makeItem(v.id, 'quiz'))
}

export const insertAt = <T,>(arr: T[], item: T, pos: number): T[] => {
  const p = Math.min(Math.max(pos, 0), arr.length)
  return [...arr.slice(0, p), item, ...arr.slice(p)]
}

export interface StepResult {
  queue: QueueItem[]
  failed: Set<string>
  /** Mức SRS cần ghi cho thẻ này. null = không ghi (đang học lại trong phiên). */
  grade: Grade | null
}

/**
 * Xử lý sau một câu trả lời:
 * - Trả lời sai lần đầu: ghi "quên", thẻ quay lại sau 4 thẻ (kiểu dễ) để nhớ lại ngay.
 * - Đang học lại: đúng thì xong (không ghi thêm, tránh tăng khoảng ôn khi vừa quên); sai thì quay lại sau 3 thẻ.
 */
export function afterAnswer(queue: QueueItem[], item: QueueItem, grade: Grade, correct: boolean, failed: Set<string>): StepResult {
  const rest = queue.filter((q) => q.uid !== item.uid)
  const f = new Set(failed)
  if (f.has(item.vocabId)) {
    if (correct) { f.delete(item.vocabId); return { queue: rest, failed: f, grade: null } }
    return { queue: insertAt(rest, makeItem(item.vocabId, 'quiz', true), 3), failed: f, grade: null }
  }
  if (grade === 'again') {
    f.add(item.vocabId)
    return { queue: insertAt(rest, makeItem(item.vocabId, 'quiz', true), 4), failed: f, grade }
  }
  return { queue: rest, failed: f, grade }
}

/** Sau khi xem từ mới: cho làm câu kiểm tra sau khoảng 3 thẻ. */
export function afterIntro(queue: QueueItem[], item: QueueItem): QueueItem[] {
  const rest = queue.filter((q) => q.uid !== item.uid)
  return insertAt(rest, makeItem(item.vocabId, 'quiz'), 3)
}

export { isDue }
