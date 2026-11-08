import { ENTRIES, HUN } from '../data/hanviet.js'
import { ANSWERS, COURSE, FIRST_INDEX_OF_ANSWER } from './course.js'
import { lookup } from './glossary.js'

export const TYPE_INFO = {
  same: { icon: '✅', label: '같음' },
  near: { icon: '🟡', label: '쓰임 차이' },
  diff: { icon: '⚠️', label: '뜻 다름' },
  reversed: { icon: '🔄', label: '순서 반대' },
  viet: { icon: '🇻🇳', label: '베트남식' },
  mixed: { icon: '🔀', label: '일부 고유어' },
}

// 연습문제에 나오는 구분 (한국어에 대응하는 단어가 있는 것)
export const QUIZ_TYPES = new Set(['same', 'near', 'diff', 'reversed'])

// text 안에서 단어(word, 소문자)가 독립된 음절로 나오는 위치
function findWord(text, word) {
  const lower = text.toLowerCase()
  let i = lower.indexOf(word)
  while (i >= 0) {
    const before = i === 0 ? ' ' : lower[i - 1]
    const after = lower[i + word.length] ?? ' '
    if (/[\s,.!?]/.test(before) && /[\s,.!?]/.test(after)) return i
    i = lower.indexOf(word, i + 1)
  }
  return -1
}

// 문장 속 모양 (고유명사 대문자). 문장 맨 앞이면 대문자가 문장 때문이라 소문자 그대로
const shownIn = (text, at, word) => (at > 0 ? text.slice(at, at + word.length) : word)

// 코스에서 처음 나오는 예문 (문장 우선, 없으면 질문)
function findExample(word) {
  for (let idx = 0; idx < COURSE.length; idx++) {
    const s = COURSE[idx]
    const at = findWord(s.text, word)
    if (at >= 0) return { sid: s.sid, text: s.text, ko: s.ko, order: idx, display: shownIn(s.text, at, word) }
  }
  for (const a of ANSWERS) {
    const at = findWord(a.q.vi, word)
    if (at >= 0) {
      return { sid: null, text: a.q.vi, ko: a.q.ko, order: FIRST_INDEX_OF_ANSWER[a.id] - 0.5, display: shownIn(a.q.vi, at, word) }
    }
  }
  return null
}

export const HANVIET = ENTRIES.map((e) => {
  const vis = e.vi.split(' ')
  const readings = [...e.reading]
  const chars = [...e.hanja].map((ch, i) =>
    ch === '_' ? { ch: null, vi: vis[i] } : { ch, vi: vis[i], ko: readings[i], hun: HUN[ch] },
  )
  const example = findExample(e.vi)
  return {
    ...e,
    key: e.vi,
    display: example?.display ?? e.vi, // 고유명사 대문자 등 문장 속 모양
    ko: QUIZ_TYPES.has(e.type) ? (e.ko ?? e.reading) : null,
    chars,
    meaning: lookup(e.vi).meaning,
    example,
  }
})

export const HANVIET_BY_KEY = Object.fromEntries(HANVIET.map((h) => [h.key, h]))

// 연습문제: 코스에서 처음 나오는 순서
export const QUIZ = HANVIET.filter((h) => h.ko)
  .slice()
  .sort((a, b) => (a.example?.order ?? 1e9) - (b.example?.order ?? 1e9) || a.key.localeCompare(b.key))

// 같은 한자가 들어간 단어들
export const CHAR_INDEX = {}
// 같은 베트남 음절에 대응하는 한자들 (같은 소리 다른 한자)
export const SOUND_INDEX = {}
HANVIET.forEach((h) =>
  h.chars.forEach((c) => {
    if (!c.ch) return
    ;(CHAR_INDEX[c.ch] ??= []).includes(h) || CHAR_INDEX[c.ch].push(h)
    ;(SOUND_INDEX[c.vi] ??= new Set()).add(c.ch)
  }),
)

// 두음법칙을 되돌린 기본 음 (歷: 역사의 '역' = 유력의 '력', 立: 입정의 '입' = 독립의 '립')
// 첫소리 ㅇ/ㄴ을 ㄹ로 통일해서 같은 글자인지 비교할 때 사용
export function baseReading(syllable) {
  const code = syllable.charCodeAt(0) - 0xac00
  if (code < 0 || code > 11171) return syllable
  const initial = Math.floor(code / 588)
  const rest = code % 588
  const ㄴ = 2, ㅇ = 11, ㄹ = 5
  if (initial !== ㄴ && initial !== ㅇ) return syllable
  return String.fromCharCode(0xac00 + ㄹ * 588 + rest)
}

const shuffle = (arr, rand) => {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 4지선다 보기: 정답 + 정답과 음절을 많이 공유하는 오답 3개 (소리 대응을 써야 풀 수 있게)
export function makeChoices(entry, rand = Math.random) {
  const answer = entry.ko
  const answerSyl = new Set([...answer])
  const pool = [...new Set(QUIZ.map((q) => q.ko))].filter((k) => k !== answer)
  const score = (k) => [...k].filter((c) => answerSyl.has(c)).length
  const picked = shuffle(pool, rand)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3)
  return shuffle([answer, ...picked], rand)
}
