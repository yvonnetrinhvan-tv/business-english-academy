import { describe, expect, it } from 'vitest'
import { mergeStates, normalizeState, sameState } from '../lib/merge'
import { emptyState } from '../lib/storage'
import type { CardState, ProgressState, StudySession, VocabItem } from '../types'

const card = (id: string, reviewed: string, reps: number, interval = 1): CardState => ({
  vocabId: id, ease: 2.5, intervalDays: interval, reps, lapses: 0, due: reviewed, lastReviewed: reviewed,
})
const sess = (id: string, at: string): StudySession => ({ id, kind: 'lesson', startedAt: at, seconds: 60 })
const vocab = (id: string): VocabItem => ({ id, term: id.slice(3), ipa: '', pos: '', meaningVi: 'x', exampleEn: '', exampleVi: '' })
const st = (p: Partial<ProgressState>): ProgressState => ({ ...emptyState(), ...p })

describe('mergeStates', () => {
  it('thẻ: lấy bản ôn gần nhất cho từng từ, giữ thẻ chỉ có một bên', () => {
    const pc = st({ cards: { a: card('a', '2026-01-02T00:00:00Z', 2), b: card('b', '2026-01-01T00:00:00Z', 1) } })
    const phone = st({ cards: { a: card('a', '2026-01-03T00:00:00Z', 3), c: card('c', '2026-01-01T00:00:00Z', 1) } })
    const m = mergeStates(pc, phone)
    expect(Object.keys(m.cards).sort()).toEqual(['a', 'b', 'c'])
    expect(m.cards.a.reps).toBe(3)
  })

  it('buổi học và bài hoàn thành: hợp của hai bên, không trùng', () => {
    const a = st({ sessions: [sess('s1', '2026-01-01T00:00:00Z'), sess('s2', '2026-01-02T00:00:00Z')], completedLessons: ['office-01'] })
    const b = st({ sessions: [sess('s2', '2026-01-02T00:00:00Z'), sess('s3', '2026-01-03T00:00:00Z')], completedLessons: ['finance-01', 'office-01'] })
    const m = mergeStates(a, b)
    expect(m.sessions.map((s) => s.id)).toEqual(['s1', 's2', 's3'])
    expect(m.completedLessons).toEqual(['finance-01', 'office-01'])
  })

  it('từ đã xóa không bị sống lại; thẻ của nó bị bỏ', () => {
    const pc = st({ customVocab: [vocab('cv-audit')], cards: { 'cv-audit': card('cv-audit', '2026-01-01T00:00:00Z', 1) } })
    const phone = st({ customVocab: [], deletedVocab: ['cv-audit'], updatedAt: '2026-01-05T00:00:00Z' })
    const m = mergeStates(pc, phone)
    expect(m.customVocab).toEqual([])
    expect(m.cards['cv-audit']).toBeUndefined()
    expect(mergeStates(phone, pc)).toEqual(m)
  })

  it('từ nhập ở hai máy khác nhau đều được giữ', () => {
    const m = mergeStates(st({ customVocab: [vocab('cv-a')] }), st({ customVocab: [vocab('cv-b')] }))
    expect(m.customVocab.map((v) => v.id)).toEqual(['cv-a', 'cv-b'])
  })

  it('mục tiêu ngày: bên sửa gần nhất thắng', () => {
    const a = st({ dailyGoalMinutes: 30, updatedAt: '2026-01-05T00:00:00Z' })
    const b = st({ dailyGoalMinutes: 10, updatedAt: '2026-01-01T00:00:00Z' })
    expect(mergeStates(a, b).dailyGoalMinutes).toBe(30)
    expect(mergeStates(b, a).dailyGoalMinutes).toBe(30)
  })

  it('giao hoán và lũy đẳng trên dữ liệu phức tạp', () => {
    const a = st({
      cards: { x: card('x', '2026-01-02T00:00:00Z', 2), y: card('y', '2026-01-02T00:00:00Z', 1) },
      sessions: [sess('s1', '2026-01-01T00:00:00Z')], writings: { w: 'bản a' }, updatedAt: '2026-01-02T00:00:00Z',
    })
    const b = st({
      cards: { x: card('x', '2026-01-04T00:00:00Z', 3) },
      sessions: [sess('s2', '2026-01-02T00:00:00Z')], writings: { w: 'bản b' }, dailyGoalMinutes: 45, updatedAt: '2026-01-04T00:00:00Z',
    })
    expect(sameState(mergeStates(a, b), mergeStates(b, a))).toBe(true)
    const m = mergeStates(a, b)
    expect(sameState(mergeStates(m, m), m)).toBe(true)
    expect(sameState(mergeStates(m, a), m)).toBe(true)
    expect(m.writings.w).toBe('bản b')
  })
})

describe('normalizeState', () => {
  it('điền trường còn thiếu từ bản cũ và từ chối dữ liệu sai', () => {
    const old = { version: 1, cards: {}, sessions: [], completedLessons: [], dailyGoalMinutes: 20, writings: {} }
    expect(normalizeState(old)).toMatchObject({ customVocab: [], deletedVocab: [] })
    expect(normalizeState({ version: 2 })).toBeNull()
    expect(normalizeState('x')).toBeNull()
    expect(normalizeState(null)).toBeNull()
  })
})
