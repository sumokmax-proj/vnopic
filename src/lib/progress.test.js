import { describe, it, expect } from 'vitest'
import {
  initialState, recordResult, completeCourseSentence, isLapDone,
  startNextLap, moveBookmark, lapMissCount, load, save,
  exportBackup, parseBackup, markBackedUp,
} from './progress.js'
import { COURSE, buildCourse, splitBlocks, shuffleBlocks, joinBlocks } from './course.js'

const memStorage = () => {
  const m = new Map()
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }
}

describe('course', () => {
  it('모든 문장 id가 고유하고 블록이 있다', () => {
    const ids = COURSE.map((s) => s.sid)
    expect(new Set(ids).size).toBe(ids.length)
    COURSE.forEach((s) => expect(s.blocks.length).toBeGreaterThan(0))
  })

  it('블록 분리/결합', () => {
    expect(splitBlocks('Xin chào, / tôi / tên là / Sumok.')).toEqual(['Xin chào,', 'tôi', 'tên là', 'Sumok.'])
    expect(joinBlocks('Xin chào, / tôi')).toBe('Xin chào, tôi')
  })

  it('섞은 결과는 원래 순서와 다르다', () => {
    const blocks = ['a', 'b', 'c', 'd']
    for (let i = 0; i < 20; i++) {
      expect(shuffleBlocks(blocks).map((b) => b.text)).not.toEqual(blocks)
    }
  })

  it('buildCourse는 답변 순서대로 펼친다', () => {
    const c = buildCourse([
      { id: 'A', topic: 't', sentences: [{ ko: '', vi: 'x' }, { ko: '', vi: 'y' }] },
      { id: 'B', topic: 't', sentences: [{ ko: '', vi: 'z' }] },
    ])
    expect(c.map((s) => s.sid)).toEqual(['A-1', 'A-2', 'B-1'])
  })
})

describe('progress', () => {
  it('실수가 있으면 오답노트에 들어가고, 완벽하면 빠진다', () => {
    let s = recordResult(initialState(), '001-1', 2)
    expect(s.notes['001-1']).toEqual({ misses: 1, lastLap: 1 })
    s = recordResult(s, '001-1', 1)
    expect(s.notes['001-1'].misses).toBe(2)
    s = recordResult(s, '001-1', 0)
    expect(s.notes['001-1']).toBeUndefined()
    expect(s.history['001-1']).toEqual({ tries: 3, misses: 2 })
  })

  it('코스 완료 시 책갈피가 다음으로 이동하고 회차 오답이 집계된다', () => {
    let s = completeCourseSentence(initialState(), '001-1', 1, 3)
    expect(s.cursor).toBe(1)
    s = completeCourseSentence(s, '001-2', 0, 3)
    s = completeCourseSentence(s, '001-3', 3, 3)
    expect(s.cursor).toBe(3)
    expect(isLapDone(s, 3)).toBe(true)
    expect(lapMissCount(s, 1)).toBe(2)
  })

  it('다음 회차는 처음부터, 이전 회차 기록은 유지', () => {
    let s = completeCourseSentence(initialState(), '001-1', 1, 1)
    s = startNextLap(s)
    expect(s.lap).toBe(2)
    expect(s.cursor).toBe(0)
    expect(lapMissCount(s, 1)).toBe(1)
    expect(lapMissCount(s, 2)).toBe(0)
    expect(s.notes['001-1']).toBeDefined()
  })

  it('책갈피 이동은 범위 안으로 제한', () => {
    expect(moveBookmark(initialState(), 99, 10).cursor).toBe(9)
    expect(moveBookmark(initialState(), -3, 10).cursor).toBe(0)
  })

  it('저장/불러오기', () => {
    const st = memStorage()
    const s = completeCourseSentence(initialState(), '001-1', 1, 10)
    save(s, st)
    expect(load(st)).toEqual(s)
  })

  it('깨진 저장 데이터는 초기 상태로', () => {
    const st = memStorage()
    st.setItem('vnopic:progress', '{broken')
    expect(load(st)).toEqual(initialState())
  })
})

describe('backup', () => {
  it('내보낸 백업을 그대로 되살린다', () => {
    let s = completeCourseSentence(initialState(), '001-1', 2, 10)
    s = markBackedUp(startNextLap(s))
    expect(parseBackup(exportBackup(s))).toEqual(s)
  })

  it('잘못된 파일은 거부한다', () => {
    expect(() => parseBackup('not json')).toThrow('읽을 수 없어요')
    expect(() => parseBackup('{"foo":1}')).toThrow('vnopic 백업 파일이 아니에요')
    const bad = { app: 'vnopic', progress: { ...initialState(), cursor: -1 } }
    expect(() => parseBackup(JSON.stringify(bad))).toThrow('올바르지 않아요')
    const old = { app: 'vnopic', progress: { ...initialState(), version: 99 } }
    expect(() => parseBackup(JSON.stringify(old))).toThrow('버전')
  })
})
