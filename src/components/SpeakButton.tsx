import { canSpeak, speak } from '../lib/speech'

export default function SpeakButton({ text, label = 'Nghe phát âm' }: { text: string; label?: string }) {
  if (!canSpeak()) return null
  return (
    <button type="button" onClick={() => speak(text)} aria-label={`${label}: ${text}`}
      className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100">
      🔊 {label.replace('Nghe phát âm', 'Nghe')}
    </button>
  )
}
