import { describe, expect, it } from 'vitest'
import { checkFill, checkOrder, checkWriting, shuffle } from '../lib/exercises'
import type { Exercise } from '../types'

type Fill = Extract<Exercise, { type: 'fill' }>
type Writing = Extract<Exercise, { type: 'writing' }>

const fill: Fill = { id: 'f', type: 'fill', prompt: 'x ___', promptVi: '', answers: ['confirm'], hintVi: '', explanationVi: '' }
const writing: Writing = { id: 'w', type: 'writing', promptVi: '', scenarioEn: '', minWords: 5, requiredPhrases: [['confirm'], ['deadline', 'due']], modelAnswer: '' }

describe('chấm bài', () => {
  it('fill bỏ qua hoa/thường và dấu câu', () => {
    expect(checkFill(fill, ' Confirm. ')).toBe(true)
    expect(checkFill(fill, 'confirmed')).toBe(false)
    expect(checkFill(fill, '')).toBe(false)
  })
  it('order so sánh theo câu', () => {
    const ex: Extract<Exercise, { type: 'order' }> = { id: 'o', type: 'order', promptVi: '', words: ['a', 'b'], answer: 'a b.', explanationVi: '' }
    expect(checkOrder(ex, ['a', 'b.'])).toBe(true)
    expect(checkOrder(ex, ['b.', 'a'])).toBe(false)
  })
  it('shuffle giữ đủ phần tử', () => {
    expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4])
  })
  it('writing: tính điểm theo cụm từ và độ dài', () => {
    const full = checkWriting(writing, 'Please confirm before the deadline today ok')
    expect(full.score).toBe(100)
    const none = checkWriting(writing, '')
    expect(none.score).toBe(0)
    const half = checkWriting(writing, 'Please confirm this soon thanks')
    expect(half.score).toBe(100 - 35)
  })
})
