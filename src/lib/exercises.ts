import type { Exercise } from '../types'

const normalize = (s: string) =>
  s.toLowerCase().replace(/[.,;:!?"']/g, '').replace(/\s+/g, ' ').trim()

export function checkFill(ex: Extract<Exercise, { type: 'fill' }>, input: string): boolean {
  const v = normalize(input)
  return v.length > 0 && ex.answers.some((a) => normalize(a) === v)
}

export function checkOrder(ex: Extract<Exercise, { type: 'order' }>, picked: string[]): boolean {
  return normalize(picked.join(' ')) === normalize(ex.answer)
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface WritingFeedback {
  words: number
  enoughWords: boolean
  /** mỗi nhóm cụm từ bắt buộc: có xuất hiện ít nhất 1 cụm không */
  phraseHits: { group: string[]; hit: boolean }[]
  score: number // 0..100
}

/** Chấm luyện viết bằng quy tắc (không dùng AI). Chỉ kiểm tra độ dài và cụm từ bắt buộc. */
export function checkWriting(ex: Extract<Exercise, { type: 'writing' }>, text: string): WritingFeedback {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lower = text.toLowerCase()
  const phraseHits = ex.requiredPhrases.map((group) => ({
    group,
    hit: group.some((p) => lower.includes(p.toLowerCase())),
  }))
  const enoughWords = words >= ex.minWords
  const hitRatio = phraseHits.length ? phraseHits.filter((p) => p.hit).length / phraseHits.length : 1
  const lengthRatio = Math.min(1, words / ex.minWords)
  const score = Math.round(hitRatio * 70 + lengthRatio * 30)
  return { words, enoughWords, phraseHits, score }
}
