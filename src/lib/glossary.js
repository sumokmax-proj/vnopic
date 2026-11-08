import { BLOCKS, WORDS } from '../data/glossary.js'

const MAX_WORD = 4 // 단어 하나의 최대 음절 수

export const normalize = (text) => text.trim().replace(/[.,!?;:]+$/, '').toLowerCase()
const stripPunct = (text) => text.trim().replace(/[.,!?;:]+$/, '')

// 음절 배열을 WORDS 단어들로 나눔 (조각 수가 가장 적게). 못 나누면 null.
// allowWhole=false면 전체를 한 덩어리로 보는 것은 제외 (분해 표시용)
export function segment(syllables, { allowWhole = true } = {}) {
  const n = syllables.length
  const best = Array(n + 1).fill(null)
  best[0] = []
  for (let i = 0; i < n; i++) {
    if (!best[i]) continue
    for (let len = 1; len <= MAX_WORD && i + len <= n; len++) {
      if (!allowWhole && i === 0 && len === n) continue
      const key = syllables.slice(i, i + len).join(' ')
      if (!WORDS[key]) continue
      const cand = [...best[i], [i, i + len]]
      if (!best[i + len] || cand.length < best[i + len].length) best[i + len] = cand
    }
  }
  return best[n]
}

// 블록(또는 단어) 뜻 찾기 → { key, text, meaning, parts: [{ key, text, meaning }] }
export function lookup(text) {
  const display = stripPunct(text)
  const key = normalize(text)
  const meaning = BLOCKS[key] ?? WORDS[key] ?? null
  const shown = display.split(/\s+/)
  const syllables = key.split(/\s+/)
  const ranges = syllables.length > 1 ? segment(syllables, { allowWhole: false }) : null
  const parts = (ranges ?? []).map(([a, b]) => {
    const k = syllables.slice(a, b).join(' ')
    return { key: k, text: shown.slice(a, b).join(' '), meaning: WORDS[k] }
  })
  return { key, text: display, meaning, parts }
}
