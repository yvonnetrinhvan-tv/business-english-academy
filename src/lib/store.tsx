import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { CardState, Grade, ProgressState, StudySession, VocabItem } from '../types'
import { allVocab } from '../data/lessons'
import { emptyState, type ProgressRepository } from './storage'
import { repository as defaultRepo } from './repository'
import { newCard, review } from './srs'

interface Store {
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

export function StoreProvider({ children, repo = defaultRepo }: { children: ReactNode; repo?: ProgressRepository }) {
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

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => setState(fn), [])

  const value = useMemo<Store>(
    () => ({
      state,
      ready,
      gradeCard: (vocabId, grade) =>
        update((s) => {
          const now = new Date()
          const cur: CardState = s.cards[vocabId] ?? newCard(vocabId, now)
          return { ...s, cards: { ...s.cards, [vocabId]: review(cur, grade, now) } }
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
            fresh.push(it)
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
          return { ...s, customVocab: s.customVocab.filter((v) => v.id !== id), cards }
        }),
      vocab: [...allVocab, ...state.customVocab],
      resetAll: async () => {
        await repo.reset()
        setState(emptyState())
      },
    }),
    [state, ready, update, repo],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore phải nằm trong StoreProvider')
  return v
}
