import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import type { CardState, Grade, ProgressState, StudySession, VocabItem } from '../types'
import { allVocab } from '../data/lessons'
import { emptyState, type ProgressRepository } from './storage'
import { repository as defaultRepo } from './repository'
import { newCard, review } from './srs'
import { SyncController, type SyncStatus } from './sync'
import { mergeStates, sameState, stableStringify } from './merge'

export interface SyncApi {
  enabled: boolean
  status: SyncStatus
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<{ needsConfirm: boolean }>
  signOut: () => Promise<void>
  syncNow: () => Promise<void>
}

const disabledSync = new SyncController(null)

interface Store {
  sync: SyncApi
  /** Gộp dữ liệu từ file sao lưu vào dữ liệu hiện tại (không ghi đè) */
  importState: (incoming: ProgressState) => void
  state: ProgressState
  ready: boolean
  gradeCard: (vocabId: string, grade: Grade) => void
  ensureCards: (vocabIds: string[]) => void
  logSession: (s: Omit<StudySession, 'id'>) => void
  completeLesson: (lessonId: string) => void
  saveWriting: (exerciseId: string, text: string) => void
  setDailyGoal: (minutes: number) => void
  addCustomVocab: (items: VocabItem[]) => void
  removeCustomVocab: (id: string) => void
  /** Từ trong bài học + từ người học tự nhập */
  vocab: VocabItem[]
  resetAll: () => Promise<void>
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children, repo = defaultRepo, sync = disabledSync }: { children: ReactNode; repo?: ProgressRepository; sync?: SyncController }) {
  const [state, setState] = useState<ProgressState>(emptyState())
  const [ready, setReady] = useState(false)
  const loaded = useRef(false)

  useEffect(() => {
    repo.load().then((s) => {
      setState(s)
      loaded.current = true
      setReady(true)
    })
  }, [repo])

  useEffect(() => {
    if (loaded.current) void repo.save(state)
  }, [state, repo])

  // Mọi thay đổi do người học tạo ra đều đóng dấu thời gian, để gộp giữa các thiết bị
  const update = useCallback(
    (fn: (s: ProgressState) => ProgressState) =>
      setState((s) => {
        const next = fn(s)
        return next === s ? s : { ...next, updatedAt: new Date().toISOString() }
      }),
    [],
  )

  // ---- Đồng bộ nhiều thiết bị ----
  const syncStatus = useSyncExternalStore(sync.subscribe, sync.getSnapshot)
  const stateRef = useRef(state)
  stateRef.current = state
  const lastSynced = useRef('')
  const running = useRef(false)
  const lastRun = useRef(0)

  const runSync = useCallback(async () => {
    if (!sync.enabled || !sync.signedIn || !loaded.current || running.current) return
    running.current = true
    try {
      const merged = await sync.run(stateRef.current)
      lastSynced.current = stableStringify(merged)
      lastRun.current = Date.now()
      setState((s) => {
        const m = mergeStates(s, merged)
        return sameState(m, s) ? s : m
      })
    } catch {
      /* trạng thái lỗi đã được hiển thị; dữ liệu vẫn an toàn trên máy */
    } finally {
      running.current = false
    }
  }, [sync])

  const signedIn = syncStatus.state !== 'signed-out' && syncStatus.state !== 'disabled' && !!syncStatus.email
  // Vừa đăng nhập / vừa mở ứng dụng đã đăng nhập: đồng bộ ngay
  useEffect(() => {
    if (ready && signedIn) void runSync()
  }, [ready, signedIn, syncStatus.email, runSync])
  // Có thay đổi mới: đồng bộ sau 2,5 giây
  useEffect(() => {
    if (!ready || !signedIn || stableStringify(state) === lastSynced.current) return
    const t = setTimeout(() => void runSync(), 2500)
    return () => clearTimeout(t)
  }, [state, ready, signedIn, runSync])
  // Quay lại ứng dụng hoặc có mạng lại: kéo dữ liệu mới từ thiết bị kia
  useEffect(() => {
    if (!signedIn) return
    const kick = () => { if (!document.hidden && Date.now() - lastRun.current > 10_000) void runSync() }
    document.addEventListener('visibilitychange', kick)
    window.addEventListener('online', kick)
    return () => { document.removeEventListener('visibilitychange', kick); window.removeEventListener('online', kick) }
  }, [signedIn, runSync])

  const value = useMemo<Store>(
    () => ({
      state,
      ready,
      gradeCard: (vocabId, grade) =>
        update((s) => {
          const now = new Date()
          const cur: CardState = s.cards[vocabId] ?? newCard(vocabId, now)
          return { ...s, cards: { ...s.cards, [vocabId]: review(cur, grade, now, { fuzz: Math.random }) } }
        }),
      ensureCards: (ids) =>
        update((s) => {
          const now = new Date()
          const missing = ids.filter((id) => !s.cards[id])
          if (!missing.length) return s
          const cards = { ...s.cards }
          missing.forEach((id) => (cards[id] = newCard(id, now)))
          return { ...s, cards }
        }),
      logSession: (sess) =>
        update((s) => ({ ...s, sessions: [...s.sessions, { ...sess, id: crypto.randomUUID() }] })),
      completeLesson: (id) =>
        update((s) => (s.completedLessons.includes(id) ? s : { ...s, completedLessons: [...s.completedLessons, id] })),
      saveWriting: (id, text) => update((s) => ({ ...s, writings: { ...s.writings, [id]: text } })),
      setDailyGoal: (m) => update((s) => ({ ...s, dailyGoalMinutes: m })),
      addCustomVocab: (items) =>
        update((s) => {
          const have = new Set([...allVocab, ...s.customVocab].map((v) => v.term.toLowerCase()))
          const fresh: VocabItem[] = []
          for (const it of items) {
            const k = it.term.toLowerCase()
            if (have.has(k)) continue
            have.add(k)
            // Từ từng bị xóa: dùng id mới, vì id cũ đã có "bia mộ" trên các thiết bị khác
            fresh.push(s.deletedVocab.includes(it.id) ? { ...it, id: `${it.id}-${Date.now().toString(36)}` } : it)
          }
          if (!fresh.length) return s
          const now = new Date()
          const cards = { ...s.cards }
          fresh.forEach((v) => { if (!cards[v.id]) cards[v.id] = newCard(v.id, now) })
          return { ...s, customVocab: [...s.customVocab, ...fresh], cards }
        }),
      removeCustomVocab: (id) =>
        update((s) => {
          const cards = { ...s.cards }
          delete cards[id]
          return { ...s, customVocab: s.customVocab.filter((v) => v.id !== id), cards, deletedVocab: [...new Set([...s.deletedVocab, id])] }
        }),
      importState: (incoming) => setState((s) => ({ ...mergeStates(s, incoming), updatedAt: new Date().toISOString() })),
      sync: {
        enabled: sync.enabled,
        status: syncStatus,
        signIn: (e, p) => sync.signIn(e, p),
        signUp: (e, p) => sync.signUp(e, p),
        signOut: () => sync.signOut(),
        syncNow: () => runSync(),
      },
      vocab: [...allVocab, ...state.customVocab],
      resetAll: async () => {
        await repo.reset()
        setState(emptyState())
      },
    }),
    [state, ready, update, repo, sync, syncStatus, runSync],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore phải nằm trong StoreProvider')
  return v
}
