import { describe, it, expect } from 'vitest'
import { ENTRIES, HUN } from '../data/hanviet.js'
import { HANVIET, QUIZ, CHAR_INDEX, SOUND_INDEX, makeChoices, baseReading } from './hanviet.js'

describe('hanviet data', () => {
  it('단어가 중복되지 않는다', () => {
    const vis = ENTRIES.map((e) => e.vi)
    expect(new Set(vis).size).toBe(vis.length)
  })

  it('한자·한국 음·베트남 음절 수가 맞는다', () => {
    const bad = ENTRIES.filter((e) => {
      const n = e.vi.split(' ').length
      return [...e.hanja].length !== n || [...e.reading].length !== n
    }).map((e) => e.vi)
    expect(bad).toEqual([])
  })

  it('모든 한자에 훈이 있다', () => {
    const missing = new Set()
    ENTRIES.forEach((e) => [...e.hanja].forEach((ch) => ch !== '_' && !HUN[ch] && missing.add(ch)))
    expect([...missing]).toEqual([])
  })

  it('같은 한자 + 같은 베트남 음이면 한국 음도 같다 (두음법칙은 같은 음으로 봄)', () => {
    const seen = {}
    const conflicts = []
    HANVIET.forEach((h) => h.chars.forEach((c) => {
      if (!c.ch) return
      const k = `${c.ch}/${c.vi}`
      const base = baseReading(c.ko)
      if (seen[k] && seen[k] !== base) conflicts.push(`${k}: ${seen[k]} vs ${c.ko}`)
      seen[k] = base
    }))
    expect(conflicts).toEqual([])
  })

  it('모든 단어에 뜻과 코스 속 예문이 있다', () => {
    expect(HANVIET.filter((h) => !h.meaning).map((h) => h.key)).toEqual([])
    expect(HANVIET.filter((h) => !h.example).map((h) => h.key)).toEqual([])
  })

  it('순서 반대 단어는 한국어가 정말 거꾸로다', () => {
    ENTRIES.filter((e) => e.type === 'reversed').forEach((e) => {
      expect([...e.ko].reverse().join('')).toBe(e.reading)
      expect([...e.koHanja].reverse().join('')).toBe(e.hanja)
    })
  })

  it('연습문제 정답은 서로 겹치지 않는다', () => {
    const kos = QUIZ.map((q) => q.ko)
    expect(new Set(kos).size).toBe(kos.length)
    expect(QUIZ.every((q) => !['viet', 'mixed'].includes(q.type))).toBe(true)
  })
})

describe('hanviet lookup', () => {
  it('두음법칙 되돌리기', () => {
    expect(baseReading('역')).toBe(baseReading('력'))
    expect(baseReading('입')).toBe(baseReading('립'))
    expect(baseReading('연')).toBe(baseReading('련'))
    expect(baseReading('성')).toBe('성')
  })

  it('같은 한자 / 같은 소리 색인', () => {
    expect(CHAR_INDEX['成'].map((h) => h.key)).toEqual(expect.arrayContaining(['thành viên', 'thành công', 'hoàn thành']))
    expect([...SOUND_INDEX['công']]).toEqual(expect.arrayContaining(['工', '公']))
    expect([...SOUND_INDEX['thành']]).toEqual(expect.arrayContaining(['成', '城']))
  })

  it('보기는 정답 포함 서로 다른 4개', () => {
    QUIZ.forEach((q) => {
      const c = makeChoices(q)
      expect(c).toHaveLength(4)
      expect(new Set(c).size).toBe(4)
      expect(c).toContain(q.ko)
    })
  })

  it('고유명사는 문장 속 대문자 모양으로 보인다', () => {
    expect(HANVIET.find((h) => h.key === 'hà nội').display).toBe('Hà Nội')
    expect(HANVIET.find((h) => h.key === 'hiện tại').display).toBe('hiện tại') // 문장 맨 앞 대문자는 무시
  })
})
