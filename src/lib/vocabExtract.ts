import type { VocabItem } from '../types'
import { STOPWORDS } from './stopwords'

export interface Candidate {
  term: string
  count: number
  exampleEn: string
}

export interface ExtractOptions {
  /** Từ đã có (bỏ qua), viết thường */
  known?: Set<string>
  max?: number
  minLength?: number
}

const WORD_RE = /[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g

/** Tách câu thô theo dấu chấm hỏi/than/chấm và xuống dòng. */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

/**
 * Trích từ ứng viên từ văn bản tiếng Anh. Không dùng AI.
 * - Bỏ từ phổ biến, từ quá ngắn, từ viết tắt (VIẾT HOA), tên riêng (luôn viết hoa giữa câu).
 * - Xếp theo tần suất, rồi theo độ dài.
 * - Gắn câu ví dụ đầu tiên (20–220 ký tự) có chứa từ đó.
 */
export function extractCandidates(text: string, opts: ExtractOptions = {}): Candidate[] {
  const { known = new Set<string>(), max = 60, minLength = 4 } = opts
  const stats = new Map<string, { count: number; capMid: number; lower: number }>()

  for (const m of text.matchAll(WORD_RE)) {
    const raw = m[0].replace(/[’]/g, "'")
    if (raw.length < minLength) continue
    if (raw === raw.toUpperCase() && raw.length > 1) continue // viết tắt
    const w = raw.toLowerCase()
    if (STOPWORDS.has(w) || known.has(w) || w.includes("'")) continue
    const before = text.slice(Math.max(0, (m.index ?? 0) - 3), m.index ?? 0).trimEnd()
    const sentenceStart = before === '' || /[.!?:\n]$/.test(before) || (m.index ?? 0) === 0
    const isCap = raw[0] !== raw[0].toLowerCase()
    const s = stats.get(w) ?? { count: 0, capMid: 0, lower: 0 }
    s.count++
    if (isCap && !sentenceStart) s.capMid++
    if (!isCap) s.lower++
    stats.set(w, s)
  }

  // Gộp số nhiều đơn giản: "variances" → "variance"
  for (const [w, s] of [...stats]) {
    if (w.length > 4 && w.endsWith('s') && !w.endsWith('ss')) {
      const base = stats.get(w.slice(0, -1))
      if (base) {
        base.count += s.count
        base.capMid += s.capMid
        base.lower += s.lower
        stats.delete(w)
      }
    }
  }

  const words = [...stats]
    .filter(([, s]) => !(s.capMid > 0 && s.lower === 0)) // tên riêng
    .sort((a, b) => b[1].count - a[1].count || b[0].length - a[0].length || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([w, s]) => ({ term: w, count: s.count, exampleEn: '' }))

  const pending = new Map(words.map((c) => [c.term, c]))
  for (const sentence of splitSentences(text)) {
    if (!pending.size) break
    if (sentence.length < 20 || sentence.length > 220) continue
    const toks = new Set([...sentence.matchAll(WORD_RE)].map((m) => m[0].toLowerCase()))
    for (const [term, c] of pending) {
      if (toks.has(term) || toks.has(term + 's')) {
        c.exampleEn = sentence
        pending.delete(term)
      }
    }
  }
  return words
}

// ---------- Bảng từ vựng (Excel / CSV) ----------

export type Cell = string | number | boolean | Date | null | undefined
const cellStr = (c: Cell) => (c === null || c === undefined ? '' : c instanceof Date ? c.toISOString().slice(0, 10) : String(c).trim())

const COLS = {
  term: /^(word|term|vocab(ulary)?|english|tiếng anh|từ vựng|từ)$/i,
  meaningVi: /^(meaning|vietnamese|vi|nghĩa|tiếng việt|dịch|nghĩa tiếng việt)$/i,
  ipa: /^(ipa|pronunciation|phiên âm)$/i,
  pos: /^(pos|type|part of speech|từ loại)$/i,
  exampleEn: /^(example|example sentence|ví dụ|ví dụ tiếng anh)$/i,
  exampleVi: /^(example vi|ví dụ tiếng việt|dịch ví dụ)$/i,
} as const
type ColKey = keyof typeof COLS

const TERM_SHAPE = /^[A-Za-z][A-Za-z\s'’\-/()&.]{0,60}$/

/**
 * Nếu bảng trông như danh sách từ vựng (cột 1 tiếng Anh, cột 2 nghĩa) thì chuyển thành VocabItem.
 * Trả về null nếu không giống danh sách từ vựng (khi đó coi file là văn bản thường).
 */
export function parseVocabTable(rows: Cell[][], source?: string): VocabItem[] | null {
  const grid = rows.map((r) => r.map(cellStr)).filter((r) => r.some(Boolean))
  if (grid.length < 2) return null

  const map: Partial<Record<ColKey, number>> = {}
  let start = 0
  grid[0].forEach((h, i) => {
    ;(Object.keys(COLS) as ColKey[]).forEach((k) => {
      if (map[k] === undefined && COLS[k].test(h)) map[k] = i
    })
  })
  if (map.term !== undefined && map.meaningVi !== undefined) start = 1
  else {
    map.term = 0
    map.meaningVi = 1
    map.exampleEn = grid.some((r) => (r[2] ?? '').length > 15) ? 2 : undefined
    delete map.ipa
    delete map.pos
    delete map.exampleVi
  }

  const body = grid.slice(start)
  const get = (r: string[], k: ColKey) => (map[k] === undefined ? '' : r[map[k] as number] ?? '')
  const valid = body.filter((r) => TERM_SHAPE.test(get(r, 'term')) && get(r, 'meaningVi') && !/^[\d.,\s%-]+$/.test(get(r, 'meaningVi')))
  if (!valid.length || valid.length / body.length < 0.6) return null

  return valid.map((r) => ({
    id: makeId(get(r, 'term')),
    term: get(r, 'term'),
    ipa: get(r, 'ipa'),
    pos: get(r, 'pos'),
    meaningVi: get(r, 'meaningVi'),
    exampleEn: get(r, 'exampleEn'),
    exampleVi: get(r, 'exampleVi'),
    source,
  }))
}

export const makeId = (term: string) => 'cv-' + term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
