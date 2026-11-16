import { useState } from 'react'
import { Btn, Card } from './ui'
import { useStore } from '../lib/store'
import { backupFileName, downloadText, exportJson, parseBackup } from '../lib/backup'

const when = (iso?: string) => (iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—')

export default function SyncPanel() {
  const { sync, state, importState } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [backupMsg, setBackupMsg] = useState('')

  const act = async (fn: () => Promise<void>) => {
    setBusy(true); setMsg('')
    try { await fn() } catch { /* lỗi đã nằm trong sync.status.error */ } finally { setBusy(false) }
  }

  const s = sync.status
  const signedIn = !!s.email

  return (
    <Card className="mb-4">
      <h2 className="font-semibold">Đồng bộ giữa các thiết bị</h2>

      {!sync.enabled && (
        <p className="mt-2 text-sm text-slate-600">
          Chưa bật. Tiến độ chỉ lưu trên trình duyệt này. Xem README.md, mục “Đồng bộ nhiều thiết bị” để bật bằng Supabase (miễn phí).
        </p>
      )}

      {sync.enabled && !signedIn && (
        <form className="mt-3 grid gap-2" onSubmit={(e) => e.preventDefault()}>
          <p className="text-sm text-slate-600">Đăng nhập cùng một tài khoản trên máy tính và điện thoại.</p>
          <p className="text-xs text-slate-500">Khi đồng bộ, tiến độ và từ vựng bạn đã nhập (kể cả câu ví dụ lấy từ tài liệu) được lưu trên Supabase. Không dùng cho tài liệu bảo mật.</p>
          <label className="text-sm" htmlFor="sync-email">Email</label>
          <input id="sync-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <label className="text-sm" htmlFor="sync-pass">Mật khẩu (ít nhất 6 ký tự)</label>
          <input id="sync-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <div className="flex flex-wrap gap-2">
            <Btn type="submit" disabled={busy || !email || !password} onClick={() => act(() => sync.signIn(email.trim(), password))}>Đăng nhập</Btn>
            <Btn variant="ghost" disabled={busy || !email || !password} onClick={() => act(async () => {
              const r = await sync.signUp(email.trim(), password)
              setMsg(r.needsConfirm ? 'Đã tạo tài khoản. Kiểm tra email để xác nhận rồi đăng nhập.' : 'Đã tạo tài khoản và đăng nhập.')
            })}>Tạo tài khoản mới</Btn>
          </div>
          {s.error && <p role="alert" className="rounded-lg bg-rose-50 p-2 text-sm text-rose-900">{s.error}</p>}
          {msg && <p role="status" className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-900">{msg}</p>}
        </form>
      )}

      {sync.enabled && signedIn && (
        <div className="mt-3 text-sm">
          <p>Tài khoản: <b>{s.email}</b></p>
          <p role="status" className="mt-1">
            {s.state === 'syncing' ? 'Đang đồng bộ…' : s.state === 'error' ? <span className="text-rose-700">Lỗi: {s.error}</span> : <>Đã đồng bộ lúc {when(s.lastSyncedAt)}</>}
          </p>
          <p className="mt-1 text-xs text-slate-500">Tự động đồng bộ sau mỗi thay đổi và khi bạn quay lại ứng dụng.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={() => act(sync.syncNow)} disabled={busy || s.state === 'syncing'}>Đồng bộ ngay</Btn>
            <Btn variant="ghost" onClick={() => act(sync.signOut)} disabled={busy}>Đăng xuất</Btn>
          </div>
        </div>
      )}

      <hr className="my-4 border-slate-200" />
      <h3 className="text-sm font-semibold">Sao lưu bằng file</h3>
      <p className="text-xs text-slate-500">Dùng khi chưa bật đồng bộ, hoặc để giữ một bản dự phòng. Nhập file sẽ <b>gộp</b> vào dữ liệu hiện tại, không ghi đè.</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Btn variant="ghost" onClick={() => { downloadText(backupFileName(), exportJson(state)); setBackupMsg('Đã tải file sao lưu.') }}>Tải file sao lưu</Btn>
        <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Nhập từ file
          <input type="file" accept=".json,application/json" className="sr-only" aria-label="Nhập file sao lưu"
            onChange={async (e) => {
              const f = e.target.files?.[0]; e.target.value = ''
              if (!f) return
              const parsed = parseBackup(await f.text())
              if (!parsed) { setBackupMsg('File không đúng định dạng sao lưu của ứng dụng.'); return }
              importState(parsed)
              setBackupMsg(`Đã gộp: ${Object.keys(parsed.cards).length} thẻ, ${parsed.sessions.length} buổi học, ${parsed.completedLessons.length} bài hoàn thành.`)
            }} />
        </label>
      </div>
      {backupMsg && <p role="status" className="mt-2 text-sm">{backupMsg}</p>}
    </Card>
  )
}
