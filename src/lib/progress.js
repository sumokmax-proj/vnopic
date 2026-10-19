// 진도 상태: 책갈피 + 회차 + 오답노트
// 모든 변경은 순수 함수로 (state → 새 state). 저장은 load/save만 담당.

export const STORAGE_KEY = 'vnopic:progress'
export const VERSION = 1

export function initialState() {
  return {
    version: VERSION,
    lap: 1, // 현재 회차
    cursor: 0, // 다음에 할 문장의 코스 인덱스 (책갈피)
    lapMisses: {}, // { [lap]: [sid, ...] } 회차별로 틀린 문장
    notes: {}, // 오답노트 { [sid]: { misses, lastLap } }
    history: {}, // 누적 기록 { [sid]: { tries, misses } }
    updatedAt: null,
    backupAt: null, // 마지막으로 백업 파일을 저장한 시각
  }
}

const now = () => new Date().toISOString()

// 문장 하나를 끝냈을 때 결과 반영. mistakes: 틀린 탭 + 힌트 + 문장보기 횟수
export function recordResult(state, sid, mistakes) {
  const missed = mistakes > 0
  const prevHist = state.history[sid] ?? { tries: 0, misses: 0 }
  const history = {
    ...state.history,
    [sid]: { tries: prevHist.tries + 1, misses: prevHist.misses + (missed ? 1 : 0) },
  }

  const notes = { ...state.notes }
  if (missed) {
    notes[sid] = { misses: (notes[sid]?.misses ?? 0) + 1, lastLap: state.lap }
  } else {
    delete notes[sid] // 실수 없이 완성하면 오답노트에서 졸업
  }

  return { ...state, history, notes, updatedAt: now() }
}

// 코스 모드에서 문장을 끝냈을 때: 결과 기록 + 회차 오답 집계 + 책갈피 이동
export function completeCourseSentence(state, sid, mistakes, courseLength) {
  let next = recordResult(state, sid, mistakes)
  if (mistakes > 0) {
    const list = next.lapMisses[next.lap] ?? []
    if (!list.includes(sid)) {
      next = { ...next, lapMisses: { ...next.lapMisses, [next.lap]: [...list, sid] } }
    }
  }
  return { ...next, cursor: Math.min(state.cursor + 1, courseLength) }
}

export const isLapDone = (state, courseLength) => state.cursor >= courseLength

export function startNextLap(state) {
  return { ...state, lap: state.lap + 1, cursor: 0, updatedAt: now() }
}

export function moveBookmark(state, index, courseLength) {
  const cursor = Math.max(0, Math.min(index, courseLength - 1))
  return { ...state, cursor, updatedAt: now() }
}

export const lapMissCount = (state, lap) => (state.lapMisses[lap] ?? []).length

// ── 백업 (내보내기 / 가져오기) ─────────────
export const markBackedUp = (state) => ({ ...state, backupAt: now() })

export function exportBackup(state) {
  return JSON.stringify({ app: 'vnopic', exportedAt: now(), progress: state }, null, 2)
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

// 백업 파일 내용을 검사해서 진도 상태로 돌려줌. 문제가 있으면 Error.
export function parseBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('백업 파일을 읽을 수 없어요.')
  }
  const p = data?.app === 'vnopic' ? data.progress : null
  if (!isObj(p)) throw new Error('vnopic 백업 파일이 아니에요.')
  if (p.version !== VERSION) throw new Error('지원하지 않는 백업 버전이에요.')
  const valid =
    Number.isInteger(p.lap) && p.lap >= 1 &&
    Number.isInteger(p.cursor) && p.cursor >= 0 &&
    isObj(p.lapMisses) && isObj(p.notes) && isObj(p.history)
  if (!valid) throw new Error('백업 파일 내용이 올바르지 않아요.')
  return { ...initialState(), ...p }
}

// ── 저장 ──────────────────────────────────
export function load(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    if (!raw) return initialState()
    const parsed = JSON.parse(raw)
    if (parsed?.version !== VERSION) return initialState()
    return { ...initialState(), ...parsed }
  } catch {
    return initialState()
  }
}

export function save(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 저장 실패(사생활 모드 등)는 무시 — 앱은 계속 동작
  }
}
