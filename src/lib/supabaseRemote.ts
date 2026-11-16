import type { SupabaseClient } from '@supabase/supabase-js'
import type { ProgressState } from '../types'
import { SyncController, type AuthApi, type RemoteStore } from './sync'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const syncConfigured = !!(url && key)

/** Phần nói chuyện với bảng `progress` (xem supabase/schema.sql). Tách riêng để test bằng client giả. */
export function supabaseRemoteStore(client: Pick<SupabaseClient, 'from'>): RemoteStore {
  return {
    async fetch() {
      const { data, error } = await client.from('progress').select('data, version').maybeSingle()
      if (error) throw new Error(error.message)
      return data ? { data: data.data, version: data.version as number } : null
    },
    async write(state: ProgressState, expected: number | null) {
      if (expected === null) {
        const { error } = await client.from('progress').insert({ data: state, version: 1 })
        if (!error) return true
        if (error.code === '23505') return false // thiết bị khác vừa tạo dòng
        throw new Error(error.message)
      }
      const { data, error } = await client
        .from('progress')
        .update({ data: state, version: expected + 1, updated_at: new Date().toISOString() })
        .eq('version', expected)
        .select('version')
      if (error) throw new Error(error.message)
      return (data?.length ?? 0) === 1
    },
  }
}

/** Tạo bộ điều khiển đồng bộ. Không cấu hình → vô hiệu hóa, ứng dụng vẫn chạy bằng bộ nhớ trình duyệt. */
export function createSyncController(): SyncController {
  if (!syncConfigured) return new SyncController(null)

  // Tải thư viện khi cần để không làm nặng lần mở đầu
  let clientP: Promise<SupabaseClient> | null = null
  const client = () =>
    (clientP ??= import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url as string, key as string, { auth: { persistSession: true, autoRefreshToken: true } })))

  const api: AuthApi = {
    async getUser() {
      const { data } = await (await client()).auth.getSession()
      const email = data.session?.user.email
      return email ? { email } : null
    },
    onChange(cb) {
      let off = () => {}
      void client().then((c) => {
        const { data } = c.auth.onAuthStateChange((_e, s) => cb(s?.user.email ? { email: s.user.email } : null))
        off = () => data.subscription.unsubscribe()
      })
      return () => off()
    },
    async signIn(email, password) {
      const { error } = await (await client()).auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
    },
    async signUp(email, password) {
      const { data, error } = await (await client()).auth.signUp({ email, password })
      if (error) throw new Error(error.message)
      return { needsConfirm: !data.session }
    },
    async signOut() { await (await client()).auth.signOut() },
    remote() {
      // Gọi trong lúc đã đăng nhập; client đã được tạo
      return {
        fetch: async () => supabaseRemoteStore(await client()).fetch(),
        write: async (d, v) => supabaseRemoteStore(await client()).write(d, v),
      }
    },
  }
  const c = new SyncController(api)
  void c.init()
  return c
}
