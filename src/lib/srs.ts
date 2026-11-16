import type { CardState, Grade } from '../types'

const DAY = 24 * 60 * 60 * 1000
export const MIN_EASE = 1.3
export const MAX_INTERVAL_DAYS = 365
/** Số lần quên từ ngưỡng này trở lên thì coi là "từ khó" (leech) */
export const LEECH_LAPSES = 4

export function newCard(vocabId: string, now: Date): CardState {
  return { vocabId, ease: 2.5, intervalDays: 0, reps: 0, lapses: 0, due: now.toISOString() }
}

/**
 * Lịch ôn dạng SM-2 rút gọn.
 * - again: quên → học lại sau 10 phút, ease giảm 0.2
 * - hard: nhớ khó → interval x1.2, ease giảm 0.15
 * - good: interval 1 → 3 → x ease
 * - easy: nhớ tốt → x ease x1.3, ease tăng 0.15
 */
export interface ReviewOptions {
  /** Trả số ngẫu nhiên [0,1). Dùng để xê dịch khoảng ôn ±5% (tránh dồn nhiều thẻ vào cùng một ngày). Mặc định: không xê dịch. */
  fuzz?: () => number
}

export function review(card: CardState, grade: Grade, now: Date, opts: ReviewOptions = {}): CardState {
  let { ease, intervalDays, reps, lapses } = card
  let dueMs: number

  if (grade === 'again') {
    lapses += 1
    reps = 0
    ease = Math.max(MIN_EASE, ease - 0.2)
    intervalDays = 0
    dueMs = now.getTime() + 10 * 60 * 1000
  } else {
    if (grade === 'hard') {
      ease = Math.max(MIN_EASE, ease - 0.15)
      intervalDays = Math.max(1, round1(intervalDays * 1.2))
    } else if (grade === 'good') {
      intervalDays = reps === 0 ? 1 : reps === 1 ? 3 : round1(intervalDays * ease)
    } else {
      ease += 0.15
      intervalDays = reps === 0 ? 3 : round1(Math.max(intervalDays, 1) * ease * 1.3)
    }
    intervalDays = Math.min(MAX_INTERVAL_DAYS, intervalDays)
    if (opts.fuzz && intervalDays >= 3) intervalDays = round1(intervalDays * (0.95 + 0.1 * opts.fuzz()))
    reps += 1
    dueMs = now.getTime() + intervalDays * DAY
  }

  return {
    ...card,
    ease: round2(ease),
    intervalDays,
    reps,
    lapses,
    due: new Date(dueMs).toISOString(),
    lastReviewed: now.toISOString(),
  }
}

/** Thẻ chưa từng được ôn (mới thêm vào lịch, hoặc chưa có thẻ). */
export const isNewCard = (card: CardState | undefined) => !card || (!card.lastReviewed && card.reps === 0 && card.lapses === 0)

/** Thẻ đã học và đến hạn ôn (không tính thẻ mới). */
export const isReviewDue = (card: CardState, now: Date) => !isNewCard(card) && isDue(card, now)

export const isLeech = (card: CardState | undefined) => !!card && card.lapses >= LEECH_LAPSES

/** Số thẻ đến hạn mỗi ngày trong `days` ngày tới. Phần tử 0 = hôm nay (gồm cả thẻ quá hạn). */
export function forecast(cards: CardState[], now: Date, days = 7): number[] {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const out = new Array<number>(days).fill(0)
  for (const c of cards) {
    if (isNewCard(c)) continue
    const idx = Math.floor((new Date(c.due).getTime() - start.getTime()) / DAY)
    if (idx < days) out[Math.max(0, idx)]++
  }
  return out
}

export function isDue(card: CardState, now: Date): boolean {
  return new Date(card.due).getTime() <= now.getTime()
}

/** Mức ghi nhớ để hiển thị: mới / đang học / quen / thuộc */
export function mastery(card: CardState | undefined): 'new' | 'learning' | 'familiar' | 'mastered' {
  if (!card || card.reps === 0) return card && card.lapses > 0 ? 'learning' : 'new'
  if (card.intervalDays >= 21) return 'mastered'
  if (card.intervalDays >= 4) return 'familiar'
  return 'learning'
}

/** Mô tả ngắn thời gian ôn tiếp theo cho nút bấm */
export function previewInterval(card: CardState, grade: Grade, now: Date): string {
  const next = review(card, grade, now)
  if (grade === 'again') return '10 phút'
  const d = next.intervalDays
  return d < 1 ? '<1 ngày' : d < 30 ? `${Math.round(d)} ngày` : `${Math.round(d / 30)} tháng`
}

const round1 = (n: number) => Math.round(n * 10) / 10
const round2 = (n: number) => Math.round(n * 100) / 100
