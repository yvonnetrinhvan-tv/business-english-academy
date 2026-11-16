import { describe, expect, it, vi } from 'vitest'
import { extractCandidates, parseVocabTable } from '../lib/vocabExtract'
import { lookupWord, mapPool } from '../lib/dictionary'
import { parseCsv } from '../lib/fileText'

const TEXT = `The Finance Controller reviewed the accrual schedule. The accrual was posted late.
Variances above 5% need approval. Each variance must be explained by the Marketing team.
Mr Nguyen approved the reconciliation. The reconciliation shows a shortfall in cash.
IFRS and GAAP differ. We need the reconciliation before month-end.`

describe('trích từ từ văn bản', () => {
  const c = extractCandidates(TEXT)
  const terms = c.map((x) => x.term)

  it('xếp theo tần suất, gộp số nhiều', () => {
    expect(terms[0]).toBe('reconciliation')
    expect(c[0].count).toBe(3)
    expect(terms).toContain('variance')
    expect(terms).not.toContain('variances')
    expect(c.find((x) => x.term === 'variance')?.count).toBe(2)
  })
  it('bỏ từ phổ biến, viết tắt, tên riêng', () => {
    for (const bad of ['need', 'must', 'ifrs', 'gaap', 'nguyen']) expect(terms).not.toContain(bad)
  })
  it('bỏ từ đã biết', () => {
    expect(extractCandidates(TEXT, { known: new Set(['accrual']) }).map((x) => x.term)).not.toContain('accrual')
  })
  it('gắn câu ví dụ chứa từ', () => {
    expect(c.find((x) => x.term === 'shortfall')?.exampleEn).toContain('shortfall in cash')
  })
})

describe('bảng từ vựng', () => {
  it('nhận bảng có tiêu đề, cột bất kỳ thứ tự', () => {
    const t = parseVocabTable([['Nghĩa', 'Từ vựng', 'IPA'], ['hạch toán', 'book', '/bʊk/'], ['đối chiếu', 'reconcile', '']], 'a.xlsx')!
    expect(t.map((x) => [x.term, x.meaningVi, x.ipa])).toEqual([['book', 'hạch toán', '/bʊk/'], ['reconcile', 'đối chiếu', '']])
    expect(t[0].source).toBe('a.xlsx')
  })
  it('nhận bảng không tiêu đề (cột 1 từ, cột 2 nghĩa)', () => {
    expect(parseVocabTable([['audit', 'kiểm toán'], ['ledger', 'sổ cái']])).toHaveLength(2)
  })
  it('từ chối bảng số liệu', () => {
    expect(parseVocabTable([['Region', 'Revenue'], ['North', 1200], ['South', 900]])).toBeNull()
  })
})

describe('csv', () => {
  it('xử lý ngoặc kép và dấu phân cách', () => {
    expect(parseCsv('a;b\n"x;y";"z ""q"""\n')).toEqual([['a', 'b'], ['x;y', 'z "q"']])
  })
})

describe('tra từ', () => {
  const fakeFetch = (dict: unknown, tr: unknown) => vi.fn(async (url: string | URL | Request) =>
    String(url).includes('dictionaryapi')
      ? ({ ok: dict !== null, json: async () => dict } as Response)
      : ({ ok: true, json: async () => tr } as Response))

  it('lấy phiên âm, từ loại, nghĩa', async () => {
    const f = fakeFetch([{ phonetic: '/əˈkruːəl/', meanings: [{ partOfSpeech: 'noun' }] }], { responseData: { translatedText: 'dồn tích' } })
    expect(await lookupWord('accrual', f as unknown as typeof fetch)).toEqual({ ipa: '/əˈkruːəl/', pos: 'n.', meaningVi: 'dồn tích' })
  })
  it('lỗi mạng không làm hỏng, trả rỗng', async () => {
    const f = vi.fn(async () => { throw new Error('offline') })
    expect(await lookupWord('x', f as unknown as typeof fetch)).toEqual({ ipa: '', pos: '', meaningVi: '' })
  })
  it('bỏ nghĩa khi hết quota hoặc trùng từ gốc', async () => {
    const f = fakeFetch(null, { responseData: { translatedText: 'MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS' } })
    expect((await lookupWord('x', f as unknown as typeof fetch)).meaningVi).toBe('')
  })
  it('mapPool giữ thứ tự kết quả', async () => {
    expect(await mapPool([1, 2, 3, 4, 5], 2, async (n) => n * 2)).toEqual([2, 4, 6, 8, 10])
  })
})
