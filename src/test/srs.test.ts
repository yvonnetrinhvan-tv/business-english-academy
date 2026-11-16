import { describe, expect, it } from 'vitest'
import { isDue, mastery, newCard, review } from '../lib/srs'

const t0 = new Date('2026-01-01T09:00:00Z')
const days = (n: number) => new Date(t0.getTime() + n * 86400000)

describe('SRS', () => {
  it('thẻ mới đến hạn ngay', () => expect(isDue(newCard('a', t0), t0)).toBe(true))

  it('good: 1 ngày → 3 ngày → nhân hệ số', () => {
    let c = review(newCard('a', t0), 'good', t0)
    expect(c.intervalDays).toBe(1)
    c = review(c, 'good', days(1))
    expect(c.intervalDays).toBe(3)
    c = review(c, 'good', days(4))
    expect(c.intervalDays).toBe(7.5)
    expect(isDue(c, days(5))).toBe(false)
    expect(isDue(c, days(12))).toBe(true)
  })

  it('again: ôn lại sau 10 phút, tăng lapses, giảm ease nhưng không dưới 1.3', () => {
    let c = review(newCard('a', t0), 'good', t0)
    for (let i = 0; i < 10; i++) c = review(c, 'again', t0)
    expect(c.lapses).toBe(10)
    expect(c.ease).toBe(1.3)
    expect(new Date(c.due).getTime() - t0.getTime()).toBe(10 * 60 * 1000)
  })

  it('easy cho khoảng cách xa hơn good', () => {
    const base = review(review(newCard('a', t0), 'good', t0), 'good', t0)
    expect(review(base, 'easy', t0).intervalDays).toBeGreaterThan(review(base, 'good', t0).intervalDays)
  })

  it('mastery theo khoảng cách', () => {
    expect(mastery(undefined)).toBe('new')
    expect(mastery({ ...newCard('a', t0), reps: 3, intervalDays: 30 })).toBe('mastered')
    expect(mastery({ ...newCard('a', t0), reps: 2, intervalDays: 5 })).toBe('familiar')
  })
})
