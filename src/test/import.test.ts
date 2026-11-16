import { describe, expect, it, vi } from 'vitest'
import { extractCandidates, parseVocabTable } from '../lib/vocabExtract'
import { lookupWord, mapPool } from '../lib/dictionary'
import { parseCsv } from '../lib/fileText'
import { glossaryLookup } from '../data/glossary'

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

describe('trích cụm từ', () => {
  const T = `Keep an audit trail for every entry. The audit trail shows who posted the entry.
The month-end close starts early. We finish the month-end close in three days.
Internal controls matter. Internal controls reduce risk. Every journal entry needs approval.`
  const c = extractCandidates(T)
  const phrases = c.filter((x) => x.kind === 'phrase').map((x) => x.term)

  it('lấy cụm 2 từ lặp lại', () => {
    expect(phrases).toContain('audit trail')
    expect(phrases).toContain('month-end close')
    expect(phrases).toContain('internal controls')
  })
  it('bỏ cụm chỉ xuất hiện 1 lần và cụm có từ phổ biến', () => {
    expect(phrases).not.toContain('journal entry')
    expect(phrases.some((p) => p.split(' ').includes('the') || /^(of|for|in|on|with|by) | (and|the)( |$)/.test(p))).toBe(false)
  })
  it('không lặp từ đơn luôn nằm trong cụm', () => {
    const words = c.filter((x) => x.kind === 'word').map((x) => x.term)
    expect(words).not.toContain('trail')
    expect(words).not.toContain('controls')
  })
  it('gắn câu ví dụ chứa cụm', () => {
    expect(c.find((x) => x.term === 'audit trail')?.exampleEn).toMatch(/audit trail/i)
  })
  it('tắt trích cụm khi maxPhrases = 0', () => {
    expect(extractCandidates(T, { maxPhrases: 0 }).some((x) => x.kind === 'phrase')).toBe(false)
  })
  it('bỏ cụm đã biết', () => {
    expect(extractCandidates(T, { known: new Set(['audit trail']) }).map((x) => x.term)).not.toContain('audit trail')
  })
  it('bỏ cụm là tên riêng', () => {
    const t = 'We met with Blue Harbor yesterday. Blue Harbor agreed. Later Blue Harbor signed.'
    expect(extractCandidates(t).map((x) => x.term)).not.toContain('blue harbor')
  })
})

describe('cụm có giới từ', () => {
  const T = `Segregation of duties prevents fraud. We test segregation of duties each quarter.
Staff must follow the delegation of authority. The delegation of authority sets limits.
Reconciliation with bank statements is monthly. Review of reconciliations happens once.
Payment for invoices needs approval. We wait for approval.`
  const phrases = extractCandidates(T).filter((x) => x.kind === 'phrase').map((x) => x.term)
  it('lấy cụm từ + giới từ + từ lặp ≥ 2 lần', () => {
    expect(phrases).toContain('segregation of duties')
    expect(phrases).toContain('delegation of authority')
  })
  it('bỏ cụm chỉ gặp 1 lần', () => {
    expect(phrases).not.toContain('reconciliation with bank')
    expect(phrases).not.toContain('payment for invoices')
  })
  it('không lặp từ đơn nằm trong cụm, có câu ví dụ', () => {
    const c = extractCandidates(T)
    expect(c.filter((x) => x.kind === 'word').map((x) => x.term)).not.toContain('duties')
    expect(c.find((x) => x.term === 'segregation of duties')?.exampleEn).toMatch(/segregation of duties/i)
  })
  it('bỏ cụm là tên riêng', () => {
    const t = 'We met Bank of America today. Bank of America agreed. Bank of America signed.'
    expect(extractCandidates(t).map((x) => x.term)).not.toContain('bank of america')
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
  it('cụm từ: bỏ tra từ điển, đặt từ loại phr.', async () => {
    const f = fakeFetch([{ phonetic: '/x/' }], { responseData: { translatedText: 'dấu vết kiểm toán' } })
    const r = await lookupWord('audit trail', f as unknown as typeof fetch)
    expect(r).toEqual({ ipa: '', pos: 'phr.', meaningVi: 'dấu vết kiểm toán' })
    expect(f.mock.calls.some(([u]) => String(u).includes('dictionaryapi'))).toBe(false)
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

describe('bảng thuật ngữ', () => {
  it('tra đúng thuật ngữ và dạng số nhiều', () => {
    expect(glossaryLookup('Audit trail')).toBe('dấu vết kiểm toán')
    expect(glossaryLookup('variances')).toBe('chênh lệch')
    expect(glossaryLookup('operating expense')).toBe('chi phí hoạt động')
    expect(glossaryLookup('zzz')).toBeUndefined()
  })
})
