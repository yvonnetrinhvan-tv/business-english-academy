import { describe, expect, it, vi } from 'vitest'
import { syncOnce, SyncController, type AuthApi, type RemoteStore } from '../lib/sync'
import { supabaseRemoteStore } from '../lib/supabaseRemote'
import { sameState } from '../lib/merge'
import { emptyState } from '../lib/storage'
import type { ProgressState } from '../types'

/** Kho từ xa trong bộ nhớ, giống hành vi bảng Supabase có cột version. */
class FakeRemote implements RemoteStore {
  row: { data: unknown; version: number } | null = null
  writes = 0
  /** Chạy ngay trước mỗi lần ghi, dùng để mô phỏng thiết bị khác ghi xen vào */
  beforeWrite?: () => void
  async fetch() { return this.row ? { data: structuredClone(this.row.data), version: this.row.version } : null }
  async write(data: ProgressState, expected: number | null) {
    this.beforeWrite?.()
    this.beforeWrite = undefined
    if (expected === null ? this.row !== null : this.row?.version !== expected) return false
    this.row = { data: structuredClone(data), version: (this.row?.version ?? 0) + 1 }
    this.writes++
    return true
  }
}

const card = (id: string, at: string, reps: number) => ({ vocabId: id, ease: 2.5, intervalDays: 1, reps, lapses: 0, due: at, lastReviewed: at })
const dev = (p: Partial<ProgressState>): ProgressState => ({ ...emptyState(), ...p })

describe('syncOnce', () => {
  it('lần đầu: tạo dòng từ dữ liệu trên máy', async () => {
    const r = new FakeRemote()
    const local = dev({ completedLessons: ['office-01'], updatedAt: '2026-01-01T00:00:00Z' })
    const out = await syncOnce(local, r)
    expect(out).toEqual(local)
    expect(r.row?.version).toBe(1)
  })

  it('máy tính và điện thoại học riêng rồi đồng bộ: cả hai thấy đủ dữ liệu', async () => {
    const r = new FakeRemote()
    const pc = dev({ cards: { a: card('a', '2026-01-02T00:00:00Z', 2) }, completedLessons: ['office-01'], updatedAt: '2026-01-02T00:00:00Z' })
    const phone = dev({ cards: { b: card('b', '2026-01-03T00:00:00Z', 1) }, completedLessons: ['finance-01'], updatedAt: '2026-01-03T00:00:00Z' })

    const pc1 = await syncOnce(pc, r)         // PC đẩy lên
    const phone1 = await syncOnce(phone, r)   // điện thoại gộp
    const pc2 = await syncOnce(pc1, r)        // PC kéo về

    for (const s of [phone1, pc2]) {
      expect(Object.keys(s.cards).sort()).toEqual(['a', 'b'])
      expect(s.completedLessons).toEqual(['finance-01', 'office-01'])
    }
    expect(sameState(phone1, pc2)).toBe(true)
  })

  it('không ghi lại khi bên kia đã đủ dữ liệu', async () => {
    const r = new FakeRemote()
    const s = dev({ completedLessons: ['x'], updatedAt: '2026-01-01T00:00:00Z' })
    await syncOnce(s, r)
    const before = r.writes
    await syncOnce(s, r)
    expect(r.writes).toBe(before)
  })

  it('thiết bị khác ghi xen vào: tải lại, gộp lại, không mất dữ liệu của ai', async () => {
    const r = new FakeRemote()
    const base = dev({ cards: { a: card('a', '2026-01-01T00:00:00Z', 1) }, updatedAt: '2026-01-01T00:00:00Z' })
    await syncOnce(base, r)

    const other = dev({ ...base, cards: { ...base.cards, z: card('z', '2026-01-05T00:00:00Z', 4) }, updatedAt: '2026-01-05T00:00:00Z' })
    const mine = dev({ ...base, completedLessons: ['finance-01'], updatedAt: '2026-01-04T00:00:00Z' })
    // ngay trước khi tôi ghi, thiết bị kia ghi trước
    r.beforeWrite = () => { r.row = { data: other, version: (r.row?.version ?? 0) + 1 } }

    const out = await syncOnce(mine, r)
    expect(Object.keys(out.cards).sort()).toEqual(['a', 'z'])
    expect(out.completedLessons).toEqual(['finance-01'])
    expect((r.row?.data as ProgressState).completedLessons).toEqual(['finance-01'])
    expect(Object.keys((r.row?.data as ProgressState).cards).sort()).toEqual(['a', 'z'])
  })

  it('hai thiết bị cùng tạo dòng đầu tiên: bên thua gộp lại', async () => {
    const r = new FakeRemote()
    const a = dev({ completedLessons: ['office-01'], updatedAt: '2026-01-01T00:00:00Z' })
    const b = dev({ completedLessons: ['finance-01'], updatedAt: '2026-01-02T00:00:00Z' })
    r.beforeWrite = () => { r.row = { data: a, version: 1 } }
    const out = await syncOnce(b, r)
    expect(out.completedLessons).toEqual(['finance-01', 'office-01'])
  })

  it('từ chối dữ liệu từ xa sai định dạng thay vì ghi đè', async () => {
    const r = new FakeRemote()
    r.row = { data: { hello: 'world' }, version: 3 }
    await expect(syncOnce(dev({}), r)).rejects.toThrow(/không hợp lệ/)
    expect(r.row.version).toBe(3)
  })

  it('xóa từ ở một máy lan sang máy kia', async () => {
    const r = new FakeRemote()
    const v = { id: 'cv-x', term: 'x', ipa: '', pos: '', meaningVi: 'y', exampleEn: '', exampleVi: '' }
    const pc = dev({ customVocab: [v], cards: { 'cv-x': card('cv-x', '2026-01-01T00:00:00Z', 1) }, updatedAt: '2026-01-01T00:00:00Z' })
    await syncOnce(pc, r)
    const phone = await syncOnce(dev({}), r)
    expect(phone.customVocab).toHaveLength(1)
    const phoneDeleted = dev({ ...phone, customVocab: [], deletedVocab: ['cv-x'], cards: {}, updatedAt: '2026-01-09T00:00:00Z' })
    await syncOnce(phoneDeleted, r)
    const pcAfter = await syncOnce(pc, r)
    expect(pcAfter.customVocab).toEqual([])
    expect(pcAfter.cards['cv-x']).toBeUndefined()
  })
})

describe('SyncController', () => {
  const fakeApi = (remote: RemoteStore, user: { email: string } | null = { email: 'a@b.c' }) => {
    let cb: ((u: { email: string } | null) => void) | undefined
    const api: AuthApi = {
      getUser: async () => user,
      onChange: (f) => { cb = f; return () => {} },
      signIn: vi.fn(async (_e: string, p: string) => { if (p !== 'good-pass') throw new Error('Invalid login credentials'); cb?.({ email: 'a@b.c' }) }),
      signUp: vi.fn(async () => ({ needsConfirm: false })),
      signOut: async () => { cb?.(null) },
      remote: () => remote,
    }
    return api
  }

  it('không cấu hình: vô hiệu hóa, run trả nguyên dữ liệu', async () => {
    const c = new SyncController(null)
    expect(c.status.state).toBe('disabled')
    const s = dev({})
    expect(await c.run(s)).toBe(s)
  })

  it('đăng nhập sai báo lỗi tiếng Việt; đúng thì sang trạng thái idle', async () => {
    const c = new SyncController(fakeApi(new FakeRemote(), null))
    await c.init()
    expect(c.status.state).toBe('signed-out')
    await expect(c.signIn('a@b.c', 'bad')).rejects.toThrow()
    expect(c.status.error).toBe('Sai email hoặc mật khẩu.')
    await c.signIn('a@b.c', 'good-pass')
    expect(c.status).toMatchObject({ state: 'idle', email: 'a@b.c' })
  })

  it('chưa đăng nhập thì không đồng bộ', async () => {
    const r = new FakeRemote()
    const c = new SyncController(fakeApi(r, null))
    await c.init()
    await c.run(dev({ completedLessons: ['x'] }))
    expect(r.row).toBeNull()
  })

  it('lỗi mạng: giữ dữ liệu, báo lỗi thân thiện, không văng ra ngoài trạng thái cũ', async () => {
    const r = new FakeRemote()
    r.fetch = async () => { throw new Error('Failed to fetch') }
    const c = new SyncController(fakeApi(r))
    await c.init()
    await expect(c.run(dev({}))).rejects.toThrow()
    expect(c.status.state).toBe('error')
    expect(c.status.error).toMatch(/Không có kết nối/)
    expect(c.signedIn).toBe(true)
  })

  it('đồng bộ thành công ghi lại thời điểm', async () => {
    const c = new SyncController(fakeApi(new FakeRemote()))
    await c.init()
    await c.run(dev({ updatedAt: '2026-01-01T00:00:00Z' }))
    expect(c.status.state).toBe('idle')
    expect(c.status.lastSyncedAt).toBeTruthy()
  })
})

describe('supabaseRemoteStore', () => {
  /** Client giả mô phỏng chuỗi lệnh của supabase-js */
  const mk = (handlers: { select?: () => unknown; insert?: (v: unknown) => unknown; update?: (v: unknown, eq: [string, unknown]) => unknown }) => ({
    from: (table: string) => {
      expect(table).toBe('progress')
      return {
        select: () => ({ maybeSingle: async () => handlers.select!() }),
        insert: async (v: unknown) => handlers.insert!(v),
        update: (v: unknown) => ({ eq: (c: string, x: unknown) => ({ select: async () => handlers.update!(v, [c, x]) }) }),
      }
    },
  }) as never

  it('fetch trả dữ liệu và version; trả null khi chưa có dòng', async () => {
    expect(await supabaseRemoteStore(mk({ select: () => ({ data: { data: { a: 1 }, version: 7 }, error: null }) })).fetch()).toEqual({ data: { a: 1 }, version: 7 })
    expect(await supabaseRemoteStore(mk({ select: () => ({ data: null, error: null }) })).fetch()).toBeNull()
    await expect(supabaseRemoteStore(mk({ select: () => ({ data: null, error: { message: 'boom' } }) })).fetch()).rejects.toThrow('boom')
  })

  it('tạo mới: thành công, hoặc false khi trùng khóa (23505)', async () => {
    const ok = supabaseRemoteStore(mk({ insert: () => ({ error: null }) }))
    expect(await ok.write(emptyState(), null)).toBe(true)
    const dup = supabaseRemoteStore(mk({ insert: () => ({ error: { code: '23505', message: 'dup' } }) }))
    expect(await dup.write(emptyState(), null)).toBe(false)
    const bad = supabaseRemoteStore(mk({ insert: () => ({ error: { code: '42501', message: 'rls' } }) }))
    await expect(bad.write(emptyState(), null)).rejects.toThrow('rls')
  })

  it('cập nhật có điều kiện theo version: 1 dòng = thành công, 0 dòng = xung đột', async () => {
    const seen: unknown[] = []
    const win = supabaseRemoteStore(mk({ update: (v, eq) => { seen.push(v, eq); return { data: [{ version: 5 }], error: null } } }))
    expect(await win.write(emptyState(), 4)).toBe(true)
    expect(seen[1]).toEqual(['version', 4])
    expect((seen[0] as { version: number }).version).toBe(5)
    const lose = supabaseRemoteStore(mk({ update: () => ({ data: [], error: null }) }))
    expect(await lose.write(emptyState(), 4)).toBe(false)
  })
})
