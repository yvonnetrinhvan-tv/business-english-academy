import { useCallback, useEffect, useRef } from 'react'

/**
 * Đo thời gian học thực tế: chỉ tính khi tab đang hiển thị.
 * Gọi stop() để lấy số giây đã học (và đặt lại bộ đếm).
 */
export function useStudyTimer() {
  const accMs = useRef(0)
  const startedAt = useRef<number | null>(Date.now())
  const sessionStart = useRef(new Date().toISOString())

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (startedAt.current !== null) {
          accMs.current += Date.now() - startedAt.current
          startedAt.current = null
        }
      } else if (startedAt.current === null) {
        startedAt.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const stop = useCallback(() => {
    const total = accMs.current + (startedAt.current !== null ? Date.now() - startedAt.current : 0)
    const startedIso = sessionStart.current
    accMs.current = 0
    startedAt.current = Date.now()
    sessionStart.current = new Date().toISOString()
    return { seconds: Math.max(1, Math.round(total / 1000)), startedAt: startedIso }
  }, [])

  return { stop }
}
