/**
 * Tra phiên âm, từ loại và nghĩa tiếng Việt bằng dịch vụ miễn phí, không cần khóa:
 * - dictionaryapi.dev: phiên âm + từ loại
 * - MyMemory: gợi ý nghĩa tiếng Việt (có thể sai ngữ cảnh chuyên ngành, người học nên kiểm tra)
 * Chỉ gửi từng từ hoặc cụm từ, không gửi nội dung tài liệu.
 */
export interface Lookup {
  ipa: string
  pos: string
  meaningVi: string
}

type Fetch = typeof fetch

const POS: Record<string, string> = {
  noun: 'n.', verb: 'v.', adjective: 'adj.', adverb: 'adv.', preposition: 'prep.',
  conjunction: 'conj.', pronoun: 'pron.', interjection: 'interj.',
}

async function getJson(url: string, f: Fetch, ms = 8000): Promise<unknown> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await f(url, { signal: ctrl.signal })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

interface DictEntry { phonetic?: string; phonetics?: { text?: string }[]; meanings?: { partOfSpeech?: string }[] }

export async function lookupWord(word: string, f: Fetch = fetch): Promise<Lookup> {
  const w = encodeURIComponent(word)
  const isPhrase = /\s/.test(word.trim())
  const [dict, tr] = await Promise.all([
    // dictionaryapi.dev không có cụm từ: bỏ qua để đỡ gọi thừa
    isPhrase ? Promise.resolve(null) : getJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`, f),
    getJson(`https://api.mymemory.translated.net/get?q=${w}&langpair=en|vi`, f),
  ])

  let ipa = ''
  let pos = ''
  const entry = Array.isArray(dict) ? (dict[0] as DictEntry | undefined) : undefined
  if (entry) {
    ipa = entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || ''
    const p = entry.meanings?.[0]?.partOfSpeech
    pos = p ? POS[p] ?? p : ''
  }

  let meaningVi = ''
  const t = tr as { responseData?: { translatedText?: string }; quotaFinished?: boolean } | null
  const text = t?.responseData?.translatedText?.trim()
  if (text && !t?.quotaFinished && text.toLowerCase() !== word.toLowerCase() && !/MYMEMORY WARNING/i.test(text)) {
    meaningVi = text
  }
  if (isPhrase) pos = 'phr.'
  return { ipa, pos, meaningVi }
}

/** Chạy song song giới hạn số luồng, báo tiến độ. */
export async function mapPool<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>, onProgress?: (done: number) => void): Promise<R[]> {
  const out = new Array<R>(items.length)
  let next = 0
  let done = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i], i)
      onProgress?.(++done)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}
