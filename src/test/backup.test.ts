import { describe, expect, it } from 'vitest'
import { exportJson, parseBackup, backupFileName } from '../lib/backup'
import { emptyState } from '../lib/storage'

describe('sao lưu', () => {
  it('xuất rồi nhập lại ra cùng dữ liệu', () => {
    const s = { ...emptyState(), completedLessons: ['office-01'], dailyGoalMinutes: 45 }
    expect(parseBackup(exportJson(s))).toEqual(s)
  })
  it('từ chối file sai', () => {
    expect(parseBackup('không phải json')).toBeNull()
    expect(parseBackup('{"app":"khac","state":{}}')).toBeNull()
    expect(parseBackup('{"version":2}')).toBeNull()
  })
  it('tên file có ngày', () => {
    expect(backupFileName(new Date('2026-03-04T10:00:00Z'))).toBe('bpe-academy-backup-2026-03-04.json')
  })
})
