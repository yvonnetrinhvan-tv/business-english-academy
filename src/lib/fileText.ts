import type { Cell } from './vocabExtract'

export type ExtractedFile =
  | { kind: 'text'; text: string }
  | { kind: 'sheets'; rows: Cell[][]; text: string }

export const MAX_BYTES = 15 * 1024 * 1024
export const ACCEPT = '.pdf,.docx,.xlsx,.csv,.txt,.md'

export class FileError extends Error {}

const ext = (name: string) => name.toLowerCase().split('.').pop() ?? ''

/** Đọc file ngay trên trình duyệt. File không được gửi đi đâu cả. */
export async function extractFile(file: File): Promise<ExtractedFile> {
  if (file.size > MAX_BYTES) throw new FileError('File lớn hơn 15 MB. Hãy tách nhỏ file rồi thử lại.')
  const e = ext(file.name)

  if (e === 'txt' || e === 'md') return { kind: 'text', text: await file.text() }

  if (e === 'csv') {
    const rows = parseCsv(await file.text())
    return { kind: 'sheets', rows, text: rows.flat().join('\n') }
  }

  if (e === 'pdf') {
    const pdfjs = await import('pdfjs-dist')
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
    let text = ''
    for (let n = 1; n <= doc.numPages; n++) {
      const content = await (await doc.getPage(n)).getTextContent()
      for (const it of content.items) {
        if ('str' in it) text += it.str + (it.hasEOL ? '\n' : ' ')
      }
      text += '\n'
    }
    if (text.trim().length < 20) throw new FileError('Không đọc được chữ trong PDF này. Có thể đây là PDF dạng ảnh (bản scan), chưa hỗ trợ OCR.')
    return { kind: 'text', text }
  }

  if (e === 'docx') {
    const mammoth = await import('mammoth/mammoth.browser')
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    if (!value.trim()) throw new FileError('File Word không có chữ.')
    return { kind: 'text', text: value }
  }

  if (e === 'xlsx') {
    const { default: readXlsx } = await import('read-excel-file/browser')
    const sheets = await readXlsx(file)
    const rows = (sheets[0]?.data ?? []) as Cell[][]
    const text = sheets.flatMap((s) => (s.data as Cell[][]).flat()).filter((c) => typeof c === 'string').join('\n')
    return { kind: 'sheets', rows, text }
  }

  if (e === 'doc' || e === 'xls') throw new FileError(`Định dạng .${e} cũ chưa hỗ trợ. Mở file bằng Word/Excel rồi "Lưu thành" .docx hoặc .xlsx.`)
  throw new FileError('Định dạng chưa hỗ trợ. Dùng PDF, Word (.docx), Excel (.xlsx), CSV hoặc TXT.')
}

/** CSV đơn giản, hỗ trợ dấu ngoặc kép và dấu phẩy/chấm phẩy/tab. */
export function parseCsv(src: string): string[][] {
  const first = src.split('\n', 1)[0]
  const delim = [',', ';', '\t'].map((d) => [d, first.split(d).length] as const).sort((a, b) => b[1] - a[1])[0][0]
  const rows: string[][] = []
  let row: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (q) {
      if (c === '"' && src[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') q = false
      else cur += c
    } else if (c === '"') q = true
    else if (c === delim) { row.push(cur); cur = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cur); rows.push(row); row = []; cur = ''
    } else cur += c
  }
  if (cur || row.length) { row.push(cur); rows.push(row) }
  return rows
}
