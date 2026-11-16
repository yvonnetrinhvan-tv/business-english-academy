import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Btn, Card, PageTitle, ProgressBar } from '../components/ui'
import { useStore } from '../lib/store'
import { ACCEPT, extractFile, FileError } from '../lib/fileText'
import { extractCandidates, makeId, parseVocabTable } from '../lib/vocabExtract'
import { lookupWord, mapPool } from '../lib/dictionary'
import type { VocabItem } from '../types'

interface Row extends VocabItem {
  selected: boolean
  count?: number
}

export default function ImportPage() {
  const { vocab, state, addCustomVocab, removeCustomVocab } = useStore()
  const [busy, setBusy] = useState<string | null>(null)
  const [progress, setProgress] = useState<[number, number] | null>(null)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [mode, setMode] = useState<'table' | 'text' | null>(null)
  const [added, setAdded] = useState(0)
  const [online, setOnline] = useState(true)

  const patch = (i: number, p: Partial<Row>) => setRows((rs) => rs.map((r, k) => (k === i ? { ...r, ...p } : r)))

  const lookup = async (list: Row[]) => {
    setBusy('Đang tra nghĩa và phiên âm…')
    setProgress([0, list.length])
    const res = await mapPool(list, 4, (r) => lookupWord(r.term), (d) => setProgress([d, list.length]))
    const byTerm = new Map(list.map((r, i) => [r.term, res[i]]))
    setRows((rs) => rs.map((r) => {
      const l = byTerm.get(r.term)
      return l ? { ...r, ipa: r.ipa || l.ipa, pos: r.pos || l.pos, meaningVi: r.meaningVi || l.meaningVi, selected: r.selected && !!(r.meaningVi || l.meaningVi) } : r
    }))
    setBusy(null)
    setProgress(null)
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(''); setRows([]); setMode(null); setAdded(0); setFileName(file.name)
    setBusy('Đang đọc file…')
    try {
      const out = await extractFile(file)
      const known = new Set(vocab.map((v) => v.term.toLowerCase()))
      if (out.kind === 'sheets') {
        const table = parseVocabTable(out.rows, file.name)
        if (table) {
          const fresh = table.filter((t) => !known.has(t.term.toLowerCase()))
          setRows(fresh.map((t) => ({ ...t, selected: true })))
          setMode('table')
          if (!fresh.length) setError('Tất cả từ trong file đã có sẵn trong ứng dụng.')
          setBusy(null)
          return
        }
      }
      const cands = extractCandidates(out.text, { known })
      if (!cands.length) throw new FileError('Không tìm thấy từ mới phù hợp trong file này.')
      const list: Row[] = cands.map((c) => ({
        id: makeId(c.term), term: c.term, ipa: '', pos: '', meaningVi: '', exampleEn: c.exampleEn, exampleVi: '',
        source: file.name, selected: true, count: c.count,
      }))
      setRows(list)
      setMode('text')
      if (online) await lookup(list)
      else setBusy(null)
    } catch (e) {
      setError(e instanceof FileError ? e.message : 'Không đọc được file. Thử file khác hoặc lưu lại ở định dạng .docx / .xlsx / .pdf.')
      setBusy(null)
    }
  }

  const ready = rows.filter((r) => r.selected && r.meaningVi.trim())
  const missing = rows.filter((r) => r.selected && !r.meaningVi.trim()).length

  const save = () => {
    const items: VocabItem[] = ready.map(({ selected: _s, count: _c, ...v }) => ({ ...v, term: v.term.trim(), meaningVi: v.meaningVi.trim() }))
    addCustomVocab(items)
    setAdded(items.length)
    setRows([]); setMode(null)
  }

  return (
    <>
      <PageTitle sub="Tải file PDF, Word, Excel, CSV hoặc TXT. Ứng dụng tự chọn từ mới để làm flashcards.">Nhập từ vựng từ tài liệu</PageTitle>

      <Card className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium">Chọn file (tối đa 15 MB)</label>
        <input id="file" type="file" accept={ACCEPT} disabled={!!busy}
          onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }}
          className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-700 file:px-4 file:py-2 file:font-semibold file:text-white" />
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} className="mt-1" />
          <span>Tự tra nghĩa tiếng Việt và phiên âm trên mạng (miễn phí).
            <span className="block text-xs text-slate-500">File được đọc ngay trên máy bạn, không tải lên đâu cả. Chỉ từng từ đơn lẻ được gửi tới dictionaryapi.dev và MyMemory. Tắt nếu tài liệu bảo mật.</span></span>
        </label>
        <p className="mt-3 text-xs text-slate-500">
          Mẹo: file Excel/CSV có cột 1 là từ tiếng Anh, cột 2 là nghĩa (có thể thêm cột ví dụ) sẽ được nhập thẳng, không cần tra.
        </p>
      </Card>

      {busy && (
        <Card className="mb-4" >
          <p role="status" className="text-sm">{busy}</p>
          {progress && <div className="mt-2"><ProgressBar value={progress[0]} max={progress[1]} label="Tiến độ tra từ" /></div>}
        </Card>
      )}
      {error && <div role="alert" className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-900">{error}</div>}
      {added > 0 && (
        <div role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          Đã thêm {added} từ vào lịch ôn. <Link className="font-semibold underline" to="/on-tap">Ôn ngay</Link>
        </div>
      )}

      {rows.length > 0 && !busy && (
        <>
          <Card className="mb-3">
            <p className="text-sm">
              <b>{fileName}</b>: {rows.length} từ {mode === 'text' ? 'gợi ý (sắp theo tần suất)' : 'từ bảng'}.
              Đã chọn <b>{rows.filter((r) => r.selected).length}</b>
              {missing > 0 && <>, <span className="text-rose-700">{missing} từ thiếu nghĩa (sẽ bị bỏ qua, hãy điền nghĩa)</span></>}.
            </p>
            {mode === 'text' && <p className="mt-1 text-xs text-slate-500">Nghĩa tự tra chỉ là gợi ý và có thể sai với ngữ cảnh kế toán/tài chính. Sửa trực tiếp ở ô nghĩa trước khi lưu.</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn onClick={save} disabled={!ready.length}>Thêm {ready.length} từ vào lịch ôn</Btn>
              {mode === 'text' && missing > 0 && online && <Btn variant="ghost" onClick={() => void lookup(rows.filter((r) => r.selected && !r.meaningVi))}>Tra lại từ thiếu</Btn>}
              <Btn variant="ghost" onClick={() => setRows((rs) => rs.map((r) => ({ ...r, selected: !rs.every((x) => x.selected) })))}>Chọn / bỏ chọn tất cả</Btn>
            </div>
          </Card>

          <ul className="grid gap-2">
            {rows.map((r, i) => (
              <li key={r.id}>
                <Card className={r.selected ? '' : 'opacity-50'}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" aria-label={`Chọn ${r.term}`} checked={r.selected} onChange={(e) => patch(i, { selected: e.target.checked })} />
                    <span className="font-semibold">{r.term}</span>
                    {r.count && r.count > 1 ? <span className="text-xs text-slate-500">×{r.count}</span> : null}
                    <input aria-label={`Phiên âm ${r.term}`} value={r.ipa} onChange={(e) => patch(i, { ipa: e.target.value })} placeholder="phiên âm" className="w-28 rounded border border-slate-200 px-2 py-1 text-sm" />
                    <input aria-label={`Từ loại ${r.term}`} value={r.pos} onChange={(e) => patch(i, { pos: e.target.value })} placeholder="loại" className="w-14 rounded border border-slate-200 px-2 py-1 text-sm" />
                  </div>
                  <input aria-label={`Nghĩa ${r.term}`} value={r.meaningVi} onChange={(e) => patch(i, { meaningVi: e.target.value })}
                    placeholder="Nghĩa tiếng Việt" className={`mt-2 w-full rounded border px-2 py-1 text-sm ${r.selected && !r.meaningVi.trim() ? 'border-rose-400' : 'border-slate-200'}`} />
                  {r.exampleEn && <p className="mt-2 text-xs text-slate-600">“{r.exampleEn}”</p>}
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      {state.customVocab.length > 0 && (
        <Card className="mt-6">
          <h2 className="mb-2 font-semibold">Từ đã nhập ({state.customVocab.length})</h2>
          <ul className="divide-y divide-slate-100">
            {state.customVocab.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <span><b>{v.term}</b> · {v.meaningVi}{v.source && <span className="text-xs text-slate-400"> · {v.source}</span>}</span>
                <button type="button" onClick={() => removeCustomVocab(v.id)} aria-label={`Xóa ${v.term}`} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100">Xóa</button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
