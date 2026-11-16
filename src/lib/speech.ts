/** Phát âm bằng Web Speech API của trình duyệt (miễn phí, chạy offline tùy thiết bị). */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string, lang = 'en-US'): boolean {
  if (!canSpeak()) return false
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = 0.9
  window.speechSynthesis.speak(u)
  return true
}
