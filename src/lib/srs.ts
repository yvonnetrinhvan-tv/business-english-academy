import type { CardState, Grade } from '../types'

const DAY = 24 * 60 * 60 * 1000
export const MIN_EASE = 1.3

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
export function review(card: CardState, grade: Grade, now: Date): CardState {
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
