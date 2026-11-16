import { describe, expect, it } from 'vitest'
import {
  afterAnswer, afterIntro, availableModes, buildPractice, buildQuestion, buildSession, checkTyped, clozeOf,
  gradeFromOutcome, levenshtein, makeItem, pickMode, type Mode,
} from '../lib/review'
import { forecast, isLeech, isNewCard, newCard, review } from '../lib/srs'
import type { CardState, VocabItem } from '../types'

const v = (id: string, term: string, meaningVi: string, pos = 'n.', exampleEn = ''): VocabItem =>
  ({ id, term, ipa: '', pos, meaningVi, exampleEn, exampleVi: '' })
const POOL: VocabItem[] = [
  v('a', 'attach', 'đính kèm', 'v.', 'I have attached the signed contract.'),
  v('b', 'deadline', 'hạn chót', 'n.', 'The deadline is Friday.'),
  v('c', 'confirm', 'xác nhận', 'v.', 'Could you confirm the time?'),
  v('d', 'follow up', 'theo dõi', 'phr. v.', 'I am following up on my last email.'),
  v('e', 'urgent', 'khẩn cấp', 'adj.', 'This request is urgent.'),
  v('f', 'budget', 'ngân sách', 'n.'),
]
const T0 = new Date('2026-03-10T09:00:00Z')
const rng = (seq: number[]) => { let i = 0; return () => seq[i++ % seq.length] }
const card = (id: string, o: Partial<CardState> = {}): CardState => ({ ...newCard(id, T0), lastReviewed: T0.toISOString(), reps: 1, intervalDays: 1, ...o })
const CTX = { canSpeak: true, poolSize: POOL.length }

describe('cloze', () => {
  it('khoét từ, kể cả biến thể và cụm', () => {
    expect(clozeOf(POOL[0])).toEqual({ sentence: 'I have _____ the signed contract.', answer: 'attached' })
    expect(clozeOf(POOL[3])?.answer).toBe('following up')
    expect(clozeOf(POOL[1])?.sentence).toBe('The _____ is Friday.')
  })
  it('không có ví dụ hoặc không chứa từ → null; không khoét giữa từ khác', () => {
    expect(clozeOf(POOL[5])).toBeNull()
    expect(clozeOf(v('x', 'form', 'mẫu', 'n.', 'The information is ready.'))).toBeNull()
  })
})

describe('chấm gõ', () => {
  it('đúng, gần đúng, sai', () => {
    expect(checkTyped('  Deadline. ', ['deadline'])).toEqual({ correct: true, near: false })
    expect(checkTyped('deadlin', ['deadline'])).toEqual({ correct: false, near: true })
    expect(checkTyped('deadlne!', ['deadline']).near).toBe(true)
    expect(checkTyped('dedline', ['deadline']).near).toBe(true)
    expect(checkTyped('dealine', ['deadline']).correct).toBe(false)
    expect(checkTyped('', ['deadline'])).toEqual({ correct: false, near: false })
    expect(checkTyped('xyz', ['deadline']).near).toBe(false)
  })
  it('từ ngắn không có "gần đúng"; dấu gạch nối = khoảng trắng', () => {
    expect(checkTyped('cat', ['car']).near).toBe(false)
    expect(checkTyped('month end close', ['month-end close']).correct).toBe(true)
  })
  it('chấp nhận nhiều đáp án (cloze)', () => {
    expect(checkTyped('attach', ['attached', 'attach']).correct).toBe(true)
  })
  it('levenshtein', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3)
    expect(levenshtein('a', 'a')).toBe(0)
  })
})

describe('quy đổi kết quả → mức SRS', () => {
  it('sai → again; gần đúng/gợi ý → hard', () => {
    expect(gradeFromOutcome('typing', { correct: false, ms: 1000 })).toBe('again')
    expect(gradeFromOutcome('typing', { correct: false, near: true, ms: 1000 })).toBe('hard')
    expect(gradeFromOutcome('typing', { correct: true, usedHint: true, ms: 1000 })).toBe('hard')
  })
  it('easy chỉ cho kiểu tự nhớ ra, đúng nhanh; trắc nghiệm đúng = good', () => {
    expect(gradeFromOutcome('typing', { correct: true, ms: 3000 })).toBe('easy')
    expect(gradeFromOutcome('typing', { correct: true, ms: 9000 })).toBe('good')
    expect(gradeFromOutcome('mcq-vi', { correct: true, ms: 500 })).toBe('good')
  })
  it('flashcard dùng mức tự chấm', () => {
    expect(gradeFromOutcome('flashcard', { correct: true, ms: 1, selfGrade: 'hard' })).toBe('hard')
  })
})

describe('chọn kiểu ôn', () => {
  it('khó dần theo mức nhớ', () => {
    expect(pickMode(card('a', { reps: 0 }), POOL[0], CTX, { rand: () => 0 })).toBe('mcq-vi')
    expect(['mcq-en', 'cloze']).toContain(pickMode(card('a', { reps: 1 }), POOL[0], CTX, { rand: () => 0.5 }))
    const high = new Set<Mode>()
    for (let i = 0; i < 40; i++) high.add(pickMode(card('a', { reps: 5 }), POOL[0], CTX, { rand: () => i / 40 }))
    expect([...high].sort()).toEqual(['cloze', 'flashcard', 'listening', 'typing'])
  })
  it('không lặp kiểu vừa dùng khi còn lựa chọn khác', () => {
    for (let i = 0; i < 20; i++) expect(pickMode(card('a', { reps: 1 }), POOL[0], CTX, { last: 'cloze', rand: () => i / 20 })).toBe('mcq-en')
  })
  it('thiếu điều kiện thì lùi về kiểu khả dụng', () => {
    expect(availableModes(POOL[5], { canSpeak: false, poolSize: 6 })).not.toContain('cloze')
    expect(availableModes(POOL[5], { canSpeak: false, poolSize: 6 })).not.toContain('listening')
    expect(availableModes(POOL[0], { canSpeak: true, poolSize: 3 })).not.toContain('mcq-vi')
    expect(pickMode(card('f', { reps: 1 }), POOL[5], { canSpeak: false, poolSize: 6 }, { rand: () => 0 })).toBe('mcq-en')
  })
  it('học lại sau khi quên và từ khó: chỉ kiểu nhận ra', () => {
    for (let i = 0; i < 20; i++) {
      expect(['mcq-vi', 'mcq-en']).toContain(pickMode(card('a', { reps: 6 }), POOL[0], CTX, { relearn: true, rand: () => i / 20 }))
      expect(['mcq-vi', 'mcq-en']).toContain(pickMode(card('a', { reps: 6, lapses: 4 }), POOL[0], CTX, { rand: () => i / 20 }))
    }
  })
  it('ép một kiểu; kiểu không khả dụng thì dùng flashcard', () => {
    expect(pickMode(card('a'), POOL[0], CTX, { forced: 'typing' })).toBe('typing')
    expect(pickMode(card('f'), POOL[5], CTX, { forced: 'cloze' })).toBe('flashcard')
  })
})

describe('câu hỏi', () => {
  it('trắc nghiệm: 4 đáp án khác nhau, đúng 1, ưu tiên cùng từ loại', () => {
    for (let s = 0; s < 30; s++) {
      for (const mode of ['mcq-vi', 'mcq-en'] as const) {
        const q = buildQuestion(mode, POOL[0], POOL, rng([s / 30, (s * 7 % 30) / 30, 0.3]))
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options!.map((o) => o.toLowerCase())).size).toBe(4)
        expect(q.options![q.answerIndex!]).toBe(mode === 'mcq-vi' ? 'đính kèm' : 'attach')
      }
    }
  })
  it('đáp án nhiễu không trùng nghĩa với đáp án đúng', () => {
    const pool = [POOL[0], v('z', 'append', 'đính kèm', 'v.'), POOL[1], POOL[2], POOL[3]]
    const q = buildQuestion('mcq-vi', pool[0], pool)
    expect(q.options!.filter((o) => o === 'đính kèm')).toHaveLength(1)
  })
  it('cloze/typing/listening có đáp án chấp nhận', () => {
    expect(buildQuestion('cloze', POOL[0], POOL).accepted).toEqual(['attached', 'attach'])
    expect(buildQuestion('typing', POOL[1], POOL).accepted).toEqual(['deadline'])
    expect(buildQuestion('cloze', POOL[5], POOL).mode).toBe('flashcard')
  })
})

describe('hàng đợi phiên ôn', () => {
  it('quá hạn lâu nhất trước, từ mới xen kẽ, thẻ chưa ôn không tính là đến hạn', () => {
    const cards: Record<string, CardState> = {
      a: card('a', { due: '2026-03-01T00:00:00Z' }),
      b: card('b', { due: '2026-03-05T00:00:00Z' }),
      c: card('c', { due: '2026-03-08T00:00:00Z' }),
      d: card('d', { due: '2026-03-09T00:00:00Z' }),
      e: card('e', { due: '2027-01-01T00:00:00Z' }), // chưa đến hạn
      f: newCard('f', T0), // mới thêm, chưa từng ôn
    }
    const plan = buildSession(POOL, cards, T0, 20, 10)
    expect(plan.dueCount).toBe(4)
    expect(plan.newCount).toBe(1)
    expect(plan.items.map((i) => `${i.vocabId}:${i.kind}`)).toEqual(['a:quiz', 'b:quiz', 'c:quiz', 'f:intro', 'd:quiz'])
  })
  it('giới hạn số thẻ ôn và số từ mới', () => {
    const cards = Object.fromEntries(POOL.map((p) => [p.id, card(p.id, { due: '2026-03-01T00:00:00Z' })]))
    expect(buildSession(POOL, cards, T0, 2, 5).items).toHaveLength(2)
    expect(buildSession(POOL, {}, T0, 5, 3).items.filter((i) => i.kind === 'intro')).toHaveLength(3)
    expect(buildSession(POOL, {}, T0, 5, 0).items).toHaveLength(0)
  })
  it('luyện thêm: "yếu" = từng quên hoặc mới nhớ; bỏ từ chưa học', () => {
    const cards = { a: card('a', { lapses: 2, intervalDays: 30 }), b: card('b', { intervalDays: 40 }), c: card('c', { intervalDays: 1 }), d: newCard('d', T0) }
    const ids = buildPractice(POOL, cards, 'weak', 10).map((i) => i.vocabId)
    expect(ids).toEqual(['a', 'c'])
    expect(buildPractice(POOL, cards, 'all', 10).map((i) => i.vocabId).sort()).toEqual(['a', 'b', 'c'])
  })
})

describe('xử lý sau khi trả lời (học lại trong phiên)', () => {
  const mk = (...ids: string[]) => ids.map((id) => makeItem(id, 'quiz'))

  it('đúng: bỏ khỏi hàng đợi, ghi mức SRS', () => {
    const q = mk('a', 'b', 'c')
    const r = afterAnswer(q, q[0], 'good', true, new Set())
    expect(r.queue.map((i) => i.vocabId)).toEqual(['b', 'c'])
    expect(r.grade).toBe('good')
  })
  it('sai lần đầu: ghi again, quay lại sau 4 thẻ ở dạng học lại', () => {
    const q = mk('a', 'b', 'c', 'd', 'e', 'f')
    const r = afterAnswer(q, q[0], 'again', false, new Set())
    expect(r.grade).toBe('again')
    expect(r.queue.map((i) => i.vocabId)).toEqual(['b', 'c', 'd', 'e', 'a', 'f'])
    expect(r.queue[4].relearn).toBe(true)
    expect(r.failed.has('a')).toBe(true)
  })
  it('học lại: đúng thì xong và KHÔNG ghi thêm; sai thì quay lại sau 3 thẻ, vẫn không ghi', () => {
    const failed = new Set(['a'])
    const q = [makeItem('a', 'quiz', true), ...mk('b', 'c', 'd', 'e')]
    const ok = afterAnswer(q, q[0], 'good', true, failed)
    expect(ok.grade).toBeNull()
    expect(ok.queue.map((i) => i.vocabId)).toEqual(['b', 'c', 'd', 'e'])
    expect(ok.failed.has('a')).toBe(false)
    const bad = afterAnswer(q, q[0], 'again', false, failed)
    expect(bad.grade).toBeNull()
    expect(bad.queue.map((i) => i.vocabId)).toEqual(['b', 'c', 'd', 'a', 'e'])
    expect(bad.failed.has('a')).toBe(true)
  })
  it('xem từ mới xong: câu kiểm tra sau 3 thẻ; hàng đợi ngắn thì xuống cuối', () => {
    const intro = makeItem('n', 'intro')
    const q = [intro, ...mk('a', 'b', 'c', 'd')]
    expect(afterIntro(q, intro).map((i) => i.vocabId)).toEqual(['a', 'b', 'c', 'n', 'd'])
    expect(afterIntro([intro], intro).map((i) => `${i.vocabId}:${i.kind}`)).toEqual(['n:quiz'])
  })
  it('hàng đợi luôn kết thúc: mọi từ sai cuối cùng cũng thoát khi trả lời đúng', () => {
    let q = mk('a', 'b')
    let failed = new Set<string>()
    const script = [false, true, false, true, true, true]
    let steps = 0
    for (const ok of script) {
      if (!q.length) break
      const r = afterAnswer(q, q[0], ok ? 'good' : 'again', ok, failed)
      q = r.queue; failed = r.failed; steps++
    }
    expect(q).toEqual([])
    expect(failed.size).toBe(0)
    expect(steps).toBeGreaterThan(2)
  })
})

describe('SRS bổ sung', () => {
  it('xê dịch ±5% chỉ từ 3 ngày; trần 365 ngày', () => {
    const base = card('a', { reps: 2, intervalDays: 10, ease: 2.5 })
    expect(review(base, 'good', T0, { fuzz: () => 0 }).intervalDays).toBe(23.8) // 25 × 0.95
    expect(review(base, 'good', T0, { fuzz: () => 0.999 }).intervalDays).toBe(26.2) // 25 × 1.0499
    expect(review(card('a', { reps: 0 }), 'good', T0, { fuzz: () => 0 }).intervalDays).toBe(1)
    expect(review(card('a', { reps: 5, intervalDays: 300, ease: 3 }), 'easy', T0).intervalDays).toBe(365)
  })
  it('phân biệt thẻ mới/đã học, từ khó', () => {
    expect(isNewCard(undefined)).toBe(true)
    expect(isNewCard(newCard('a', T0))).toBe(true)
    expect(isNewCard(review(newCard('a', T0), 'again', T0))).toBe(false)
    expect(isLeech(card('a', { lapses: 4 }))).toBe(true)
    expect(isLeech(card('a', { lapses: 3 }))).toBe(false)
  })
  it('dự báo 7 ngày: quá hạn tính vào hôm nay, bỏ thẻ mới', () => {
    const now = new Date(2026, 2, 10, 9, 0, 0)
    const d = (n: number, h = 12) => new Date(2026, 2, 10 + n, h, 0, 0).toISOString()
    const f = forecast([card('a', { due: d(-3) }), card('b', { due: d(0, 20) }), card('c', { due: d(1) }), card('d', { due: d(1) }), card('e', { due: d(6) }), card('f', { due: d(7) }), newCard('g', now)], now)
    expect(f).toEqual([2, 2, 0, 0, 0, 0, 1])
  })
})
