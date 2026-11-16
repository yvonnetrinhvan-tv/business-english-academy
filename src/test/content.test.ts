import { describe, expect, it } from 'vitest'
import { lessons, allVocab } from '../data/lessons'

describe('nội dung', () => {
  it('có 30 bài, chia đều 15/15, id duy nhất', () => {
    expect(lessons).toHaveLength(30)
    expect(lessons.filter((l) => l.program === 'office')).toHaveLength(15)
    expect(lessons.filter((l) => l.program === 'finance')).toHaveLength(15)
    expect(new Set(lessons.map((l) => l.id)).size).toBe(30)
  })

  it('có 10 bài đầy đủ (5 mỗi chương trình, liền từ bài 1)', () => {
    for (const prog of ['office', 'finance'] as const) {
      const ready = lessons.filter((l) => l.program === prog && l.content).map((l) => l.order)
      expect(ready).toEqual([1, 2, 3, 4, 5])
    }
    expect(lessons.filter((l) => l.content)).toHaveLength(10)
  })

  it('mỗi bài đủ 3+ phần, 10 từ, ≥ 10 bài tập', () => {
    for (const l of lessons.filter((x) => x.content)) {
      expect(l.content!.sections.length, l.id).toBeGreaterThanOrEqual(3)
      expect(l.content!.vocab, l.id).toHaveLength(10)
      expect(l.content!.exercises.length, l.id).toBeGreaterThanOrEqual(10)
    }
  })

  it('đáp án điền từ và sắp xếp nhất quán, bài viết có mẫu đạt yêu cầu', () => {
    for (const l of lessons.filter((x) => x.content)) {
      for (const e of l.content!.exercises) {
        if (e.type === 'writing') {
          const m = e.modelAnswer.toLowerCase()
          expect(m.split(/\s+/).length, e.id).toBeGreaterThanOrEqual(e.minWords)
          for (const group of e.requiredPhrases) expect(group.some((p) => m.includes(p)), `${e.id}: ${group}`).toBe(true)
        }
        if (e.type === 'fill') {
          const full = e.prompt.replace('___', e.answers[0])
          expect(full, e.id).not.toContain('___')
        }
      }
    }
  })

  it('từ vựng đủ trường, id duy nhất', () => {
    expect(new Set(allVocab.map((v) => v.id)).size).toBe(allVocab.length)
    for (const v of allVocab) {
      for (const k of ['term', 'ipa', 'pos', 'meaningVi', 'exampleEn', 'exampleVi'] as const) expect(v[k], `${v.id}.${k}`).toBeTruthy()
    }
  })

  it('bài tập hợp lệ', () => {
    for (const l of lessons.filter((x) => x.content)) {
      const ex = l.content!.exercises
      const types = new Set(ex.map((e) => e.type))
      expect(types).toEqual(new Set(['mcq', 'fill', 'order', 'writing']))
      for (const e of ex) {
        if (e.type === 'mcq') expect(e.options[e.answer]).toBeTruthy()
        if (e.type === 'fill') expect(e.prompt).toContain('___')
        if (e.type === 'order') expect([...e.words].join(' ')).toBe(e.answer)
      }
      for (const s of l.content!.sections) {
        expect(s.heading.vi).toBeTruthy()
        s.body.forEach((b) => { expect(b.en).toBeTruthy(); expect(b.vi).toBeTruthy() })
      }
    }
  })
})
