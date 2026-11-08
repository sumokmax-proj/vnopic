import { describe, it, expect } from 'vitest'
import { lookup, normalize, segment } from './glossary.js'
import { COURSE } from './course.js'

describe('glossary', () => {
  it('코스의 모든 블록에 뜻이 있다', () => {
    const missing = new Set()
    COURSE.forEach((s) => s.blocks.forEach((b) => {
      if (!lookup(b).meaning) missing.add(normalize(b))
    }))
    expect([...missing]).toEqual([])
  })

  it('모든 블록을 사전 단어로 나눌 수 있다', () => {
    const fail = new Set()
    COURSE.forEach((s) => s.blocks.forEach((b) => {
      if (!segment(normalize(b).split(/\s+/))) fail.add(normalize(b))
    }))
    expect([...fail]).toEqual([])
  })

  it('블록을 단어별로 분해한다', () => {
    const r = lookup('công nghệ thông tin.')
    expect(r.text).toBe('công nghệ thông tin')
    expect(r.meaning).toBe('정보기술 (IT)')
    expect(r.parts.map((p) => p.key)).toEqual(['công nghệ', 'thông tin'])
  })

  it('대문자/문장부호는 무시하고, 표시는 원래 모양 유지', () => {
    const r = lookup('Xin chào,')
    expect(r.key).toBe('xin chào')
    expect(r.text).toBe('Xin chào')
    expect(r.parts.map((p) => p.text)).toEqual(['Xin', 'chào'])
  })

  it('한 음절 단어는 분해하지 않는다', () => {
    expect(lookup('tôi').parts).toEqual([])
  })
})
