import { describe, expect, it } from 'vitest'
import { lessons, allVocab } from '../data/lessons'

describe('nội dung', () => {
  it('có 30 bài, chia đều 15/15, id duy nhất', () => {
    expect(lessons).toHaveLength(30)
    expect(lessons.filter((l) => l.program === 'office')).toHaveLength(15)
    expect(lessons.filter((l) => l.program === 'finance')).toHaveLength(15)
    expect(new Set(lessons.map((l) => l.id)).size).toBe(30)
  })

  it('có đúng 2 bài mẫu đầy đủ', () => {
    expect(lessons.filter((l) => l.content).map((l) => l.title).sort()).toEqual(['Budget Variance Analysis', 'Professional Email Writing'])
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
