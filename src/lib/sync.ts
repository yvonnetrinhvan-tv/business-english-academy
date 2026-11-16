import type { ProgressState } from '../types'
import { mergeStates, normalizeState, sameState } from './merge'

/** Kho từ xa (Supabase hoặc giả lập khi test). Mỗi người dùng một dòng, có số phiên bản để tránh ghi đè nhau. */
export interface RemoteStore {
  fetch(): Promise<{ data: unknown; version: number } | null>
  /** Ghi nếu phiên bản còn đúng (expected = null nghĩa là tạo mới). Trả false nếu có thiết bị khác vừa ghi. */
  write(data: ProgressState, expectedVersion: number | null): Promise<boolean>
}

const MAX_TRIES = 4

/**
 * Một lượt đồng bộ: tải bản từ xa → gộp với bản trên máy → ghi lại nếu có thay đổi.
 * Nếu thiết bị khác ghi xen vào (phiên bản lệch) thì tải lại và gộp lần nữa.
 * Trả về trạng thái đã gộp để áp dụng vào máy này.
 */
export async function syncOnce(local: ProgressState, remote: RemoteStore): Promise<ProgressState> {
  let merged = local
  for (let i = 0; i < MAX_TRIES; i++) {
    const row = await remote.fetch()
    const remoteState = row ? normalizeState(row.data) : null
    if (row && !remoteState) throw new Error('Dữ liệu trên đám mây có định dạng không hợp lệ.')
    merged = remoteState ? mergeStates(local, remoteState) : local
    if (remoteState && sameState(merged, remoteState)) return merged // bên kia đã đủ, khỏi ghi
    if (await remote.write(merged, row ? row.version : null)) return merged
  }
  throw new Error('Không đồng bộ được vì dữ liệu liên tục thay đổi. Thử lại sau.')
}

// ---------------- Điều khiển đăng nhập + trạng thái (cho giao diện) ----------------

export interface AuthApi {
  getUser(): Promise<{ email: string } | null>
  onChange(cb: (user: { email: string } | null) => void): () => void
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string): Promise<{ needsConfirm: boolean }>
  signOut(): Promise<void>
  remote(): RemoteStore
}

export type SyncState = 'disabled' | 'signed-out' | 'idle' | 'syncing' | 'error'
export interface SyncStatus {
  state: SyncState
  email?: string
  lastSyncedAt?: string
  error?: string
}

export class SyncController {
  status: SyncStatus
  private listeners = new Set<() => void>()
  private unsub?: () => void

  constructor(private api: AuthApi | null) {
    this.status = { state: api ? 'signed-out' : 'disabled' }
  }

  get enabled() { return this.api !== null }
  get signedIn() { return this.status.state === 'idle' || this.status.state === 'syncing' || (this.status.state === 'error' && !!this.status.email) }

  subscribe = (fn: () => void) => { this.listeners.add(fn); return () => { this.listeners.delete(fn) } }
  getSnapshot = () => this.status
  private set(p: Partial<SyncStatus>) { this.status = { ...this.status, ...p }; this.listeners.forEach((l) => l()) }

  async init() {
    if (!this.api) return
    try {
      const u = await this.api.getUser()
      if (u) this.set({ state: 'idle', email: u.email })
    } catch { /* offline: coi như chưa đăng nhập, người dùng thử lại sau */ }
    this.unsub = this.api.onChange((u) => {
      if (u) this.set({ state: 'idle', email: u.email, error: undefined })
      else this.set({ state: 'signed-out', email: undefined, error: undefined })
    })
  }
  dispose() { this.unsub?.() }

  async signIn(email: string, password: string) {
    if (!this.api) return
    try { await this.api.signIn(email, password); this.set({ error: undefined }) }
    catch (e) { this.set({ error: authMessage(e) }); throw e }
  }
  async signUp(email: string, password: string): Promise<{ needsConfirm: boolean }> {
    if (!this.api) return { needsConfirm: false }
    try { const r = await this.api.signUp(email, password); this.set({ error: undefined }); return r }
    catch (e) { this.set({ error: authMessage(e) }); throw e }
  }
  async signOut() { await this.api?.signOut() }

  /** Đồng bộ một lượt. Ném lỗi để nơi gọi biết, đồng thời cập nhật trạng thái hiển thị. */
  async run(local: ProgressState): Promise<ProgressState> {
    if (!this.api || !this.signedIn) return local
    this.set({ state: 'syncing' })
    try {
      const merged = await syncOnce(local, this.api.remote())
      this.set({ state: 'idle', lastSyncedAt: new Date().toISOString(), error: undefined })
      return merged
    } catch (e) {
      this.set({ state: 'error', error: friendly(e) })
      throw e
    }
  }
}

function authMessage(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e)
  if (/invalid login/i.test(m)) return 'Sai email hoặc mật khẩu.'
  if (/already registered|already been registered/i.test(m)) return 'Email này đã có tài khoản. Hãy đăng nhập.'
  if (/password should be at least|weak/i.test(m)) return 'Mật khẩu cần ít nhất 6 ký tự.'
  if (/email not confirmed/i.test(m)) return 'Email chưa được xác nhận. Kiểm tra hộp thư, hoặc tắt "Confirm email" trong Supabase.'
  if (/rate limit/i.test(m)) return 'Thử quá nhiều lần. Đợi vài phút rồi thử lại.'
  if (/fetch|network/i.test(m)) return 'Không có kết nối mạng.'
  return m
}

function friendly(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e)
  if (/fetch|network|failed to/i.test(m)) return 'Không có kết nối. Tiến độ vẫn lưu trên máy và sẽ đồng bộ khi có mạng.'
  if (/relation .* does not exist|schema cache|42P01|PGRST205/i.test(m)) return 'Chưa tạo bảng "progress" trong Supabase. Chạy file supabase/schema.sql.'
  return m
}
