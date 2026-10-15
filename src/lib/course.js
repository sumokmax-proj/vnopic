import { ANSWERS, TOPICS } from '../data/course.js'

export const splitBlocks = (vi) => vi.split(' / ').map((b) => b.trim()).filter(Boolean)
export const joinBlocks = (vi) => splitBlocks(vi).join(' ')

// 코스 순서대로 펼친 문장 목록. 책갈피(cursor)는 이 배열의 인덱스.
export function buildCourse(answers = ANSWERS) {
  const flat = []
  answers.forEach((a) => {
    a.sentences.forEach((s, i) => {
      flat.push({
        sid: `${a.id}-${i + 1}`,
        answerId: a.id,
        topic: a.topic,
        index: i,
        total: a.sentences.length,
        ko: s.ko,
        vi: s.vi,
        blocks: splitBlocks(s.vi),
        text: joinBlocks(s.vi),
      })
    })
  })
  return flat
}

export const COURSE = buildCourse()
export const ANSWER_BY_ID = Object.fromEntries(ANSWERS.map((a) => [a.id, a]))
export const SENTENCE_BY_ID = Object.fromEntries(COURSE.map((s) => [s.sid, s]))
export const FIRST_INDEX_OF_ANSWER = Object.fromEntries(
  ANSWERS.map((a) => [a.id, COURSE.findIndex((s) => s.answerId === a.id)]),
)
export { ANSWERS, TOPICS }

// 원래 순서와 같은 결과는 피해서 섞기 (블록이 2개 이상일 때)
export function shuffleBlocks(blocks, rand = Math.random) {
  const items = blocks.map((text, i) => ({ id: i, text }))
  if (items.length < 2) return items
  const original = blocks.join('\u0000')
  for (let tries = 0; tries < 10; tries++) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[items[i], items[j]] = [items[j], items[i]]
    }
    if (items.map((b) => b.text).join('\u0000') !== original) break
  }
  return items
}
