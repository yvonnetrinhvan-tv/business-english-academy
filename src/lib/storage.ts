import type { ProgressState } from '../types'

/**
 * Lớp lưu trữ tách riêng khỏi giao diện.
 * Bản demo dùng LocalStorageRepository.
 * Sau này thêm SupabaseRepository (cùng interface) rồi đổi ở src/lib/repository.ts.
 */
export interface ProgressRepository {
  load(): Promise<ProgressState>
  save(state: ProgressState): Promise<void>
  reset(): Promise<void>
}

export const STORAGE_KEY = 'bpe-academy:progress:v1'

export function emptyState(): ProgressState {
  return { version: 1, cards: {}, sessions: [], completedLessons: [], dailyGoalMinutes: 20, writings: {}, customVocab: [] }
}

export class LocalStorageRepository implements ProgressRepository {
  constructor(private key: string = STORAGE_KEY, private storage: Storage = window.localStorage) {}

  async load(): Promise<ProgressState> {
    try {
      const raw = this.storage.getItem(this.key)
      if (!raw) return emptyState()
      const parsed = JSON.parse(raw) as Partial<ProgressState>
      if (parsed.version !== 1) return emptyState()
      return { ...emptyState(), ...parsed } as ProgressState
    } catch {
      return emptyState()
    }
  }

  async save(state: ProgressState): Promise<void> {
    this.storage.setItem(this.key, JSON.stringify(state))
  }

  async reset(): Promise<void> {
    this.storage.removeItem(this.key)
  }
}
