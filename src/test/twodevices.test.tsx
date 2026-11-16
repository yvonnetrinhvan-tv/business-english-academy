import { describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { StoreProvider, useStore } from '../lib/store'
import { LocalStorageRepository } from '../lib/storage'
import { SyncController, type AuthApi, type RemoteStore } from '../lib/sync'
import type { ProgressState } from '../types'

class FakeRemote implements RemoteStore {
  row: { data: unknown; version: number } | null = null
  async fetch() { return this.row ? { data: structuredClone(this.row.data), version: this.row.version } : null }
  async write(data: ProgressState, expected: number | null) {
    if (expected === null ? this.row !== null : this.row?.version !== expected) return false
    this.row = { data: structuredClone(data), version: (this.row?.version ?? 0) + 1 }
    return true
  }
}

async function device(remote: RemoteStore, name: string) {
  const api: AuthApi = {
    getUser: async () => ({ email: 'me@example.com' }),
    onChange: () => () => {},
    signIn: async () => {}, signUp: async () => ({ needsConfirm: false }), signOut: async () => {},
    remote: () => remote,
  }
  const sync = new SyncController(api)
  await sync.init()
  const repo = new LocalStorageRepository(`dev-${name}-${Math.random()}`, window.localStorage)
  const wrapper = ({ children }: { children: ReactNode }) => <StoreProvider repo={repo} sync={sync}>{children}</StoreProvider>
  const hook = renderHook(() => useStore(), { wrapper })
  await waitFor(() => expect(hook.result.current.ready).toBe(true))
  return { ...hook, repo }
}

describe('học trên máy tính và điện thoại', () => {
  it('tiến độ ở máy tính sang điện thoại và ngược lại', async () => {
    const remote = new FakeRemote()
    const pc = await device(remote, 'pc')
    const phone = await device(remote, 'phone')

    // Máy tính: ôn một thẻ, hoàn thành bài, nhập một từ
    act(() => {
      pc.result.current.ensureCards(['em-attach'])
      pc.result.current.gradeCard('em-attach', 'good')
      pc.result.current.completeLesson('office-01')
      pc.result.current.addCustomVocab([{ id: 'cv-ledger', term: 'ledger', ipa: '', pos: 'n.', meaningVi: 'sổ cái', exampleEn: '', exampleVi: '' }])
    })
    await act(async () => { await pc.result.current.sync.syncNow() })

    // Điện thoại: mở ra, đồng bộ → thấy dữ liệu của máy tính
    await act(async () => { await phone.result.current.sync.syncNow() })
    expect(phone.result.current.state.cards['em-attach'].reps).toBe(1)
    expect(phone.result.current.state.completedLessons).toContain('office-01')
    expect(phone.result.current.vocab.some((v) => v.term === 'ledger')).toBe(true)

    // Điện thoại: học tiếp, ghi buổi học, xóa từ đã nhập
    act(() => {
      phone.result.current.logSession({ kind: 'flashcards', startedAt: '2026-01-01T00:00:00Z', seconds: 90, score: 1, total: 1 })
      phone.result.current.removeCustomVocab('cv-ledger')
      phone.result.current.completeLesson('finance-01')
    })
    await act(async () => { await phone.result.current.sync.syncNow() })

    // Máy tính: đồng bộ lại → thấy thay đổi từ điện thoại, từ đã xóa không sống lại
    await act(async () => { await pc.result.current.sync.syncNow() })
    const s = pc.result.current.state
    expect(s.sessions).toHaveLength(1)
    expect(s.completedLessons.sort()).toEqual(['finance-01', 'office-01'])
    expect(pc.result.current.vocab.some((v) => v.term === 'ledger')).toBe(false)
    expect(s.cards['cv-ledger']).toBeUndefined()
  })

  it('nhập lại từ đã xóa: từ vẫn còn sau khi đồng bộ', async () => {
    const remote = new FakeRemote()
    const pc = await device(remote, 'pc')
    const v = { id: 'cv-audit', term: 'audit', ipa: '', pos: 'n.', meaningVi: 'kiểm toán', exampleEn: '', exampleVi: '' }
    act(() => { pc.result.current.addCustomVocab([v]) })
    await act(async () => { await pc.result.current.sync.syncNow() })
    act(() => { pc.result.current.removeCustomVocab('cv-audit') })
    await act(async () => { await pc.result.current.sync.syncNow() })
    act(() => { pc.result.current.addCustomVocab([v]) })
    await act(async () => { await pc.result.current.sync.syncNow() })
    expect(pc.result.current.vocab.filter((x) => x.term === 'audit')).toHaveLength(1)
    expect((remote.row?.data as ProgressState).customVocab.some((x) => x.term === 'audit')).toBe(true)
  })

  it('mất mạng: học tiếp bình thường, có mạng lại thì gộp', async () => {
    const remote = new FakeRemote()
    const pc = await device(remote, 'pc')
    let offline = true
    const realFetch = remote.fetch.bind(remote)
    remote.fetch = async () => { if (offline) throw new Error('Failed to fetch'); return realFetch() }

    act(() => { pc.result.current.completeLesson('office-01') })
    await act(async () => { await pc.result.current.sync.syncNow() })
    expect(pc.result.current.sync.status.state).toBe('error')
    expect(pc.result.current.state.completedLessons).toContain('office-01') // dữ liệu vẫn còn

    offline = false
    await act(async () => { await pc.result.current.sync.syncNow() })
    expect(pc.result.current.sync.status.state).toBe('idle')
    expect((remote.row?.data as ProgressState).completedLessons).toContain('office-01')
  })
})
