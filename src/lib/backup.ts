import type { ProgressState } from '../types'
import { normalizeState } from './merge'

export function backupFileName(now = new Date()): string {
  return `bpe-academy-backup-${now.toISOString().slice(0, 10)}.json`
}

export function exportJson(state: ProgressState): string {
  return JSON.stringify({ app: 'bpe-academy', exportedAt: new Date().toISOString(), state }, null, 2)
}

/** Đọc file sao lưu. Trả null nếu không đúng dạng. */
export function parseBackup(text: string): ProgressState | null {
  try {
    const raw = JSON.parse(text)
    return normalizeState(raw?.app === 'bpe-academy' ? raw.state : raw)
  } catch {
    return null
  }
}

export function downloadText(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
