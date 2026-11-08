import { useMemo, useState } from 'react'
import { HanjaDetail, SaveStar } from '../components/Hanja.jsx'
import { HANVIET_BY_KEY, QUIZ, makeChoices } from '../lib/hanviet.js'
import { isLapDone, lapMissCount } from '../lib/progress.js'

function TopBar({ onBack, left, right }) {
  return (
    <header className="topbar">
      <button className="btn text" onClick={onBack}>← 한자</button>
      <span className="topbar-title">{left}</span>
      <span className="muted small">{right}</span>
    </header>
  )
}

// 문제 하나: 베트남어 단어 → 한국어 한자어 4지선다
function Question({ entry, words, onToggleWord, onOpen, onDone }) {
  const choices = useMemo(() => makeChoices(entry), [entry])
  const [picked, setPicked] = useState(null)
  const answered = picked !== null
  const correct = picked === entry.ko

  return (
    <div className="quiz">
      <div className="card quiz-prompt">
        <p className="muted small">이 베트남어 단어는 어떤 한국어 한자어일까요?</p>
        <p className="quiz-word">{entry.display}</p>
      </div>

      <div className="choices">
        {choices.map((c) => {
          const cls = !answered ? '' : c === entry.ko ? 'correct' : c === picked ? 'wrong' : 'dim'
          return (
            <button key={c} type="button" className={`choice ${cls}`} disabled={answered} onClick={() => setPicked(c)}>
              {c}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="result">
          {correct ? (
            <p className="result-msg good">정답이에요 ✨</p>
          ) : (
            <p className="result-msg">정답은 '{entry.ko}' · 한자 오답에 담았어요</p>
          )}
          <div className="card">
            <div className="sheet-head">
              <p className="sheet-word">{entry.display}</p>
              <SaveStar entry={entry} words={words} onToggle={onToggleWord} />
            </div>
            <HanjaDetail entry={entry} onOpen={onOpen} />
          </div>
          <div className="actions">
            <button className="btn primary" onClick={() => onDone(correct ? 0 : 1)}>다음</button>
          </div>
        </div>
      )}
    </div>
  )
}

// 연습문제: 책갈피부터 순서대로
export function HanjaCourse({ state, onComplete, onNextLap, onMenu, onToggleWord, onOpen }) {
  const track = state.hanja
  const total = QUIZ.length

  if (isLapDone(track, total)) {
    const now = lapMissCount(track, track.lap)
    const prev = track.lap > 1 ? lapMissCount(track, track.lap - 1) : null
    return (
      <div className="screen center">
        <p className="lap-badge">한자 {track.lap}회차 완주</p>
        <h2>한자 어휘 한 바퀴 끝 🎉</h2>
        <p>전체 {total}단어 중 이번 회차에 틀린 단어 <b>{now}개</b></p>
        {prev !== null && (
          <p className="muted">
            지난 회차 {prev}개 → {now < prev ? `${prev - now}개 줄었어요!` : '천천히 돌다 보면 줄어들어요.'}
          </p>
        )}
        <div className="actions col">
          <button className="btn primary" onClick={onNextLap}>{track.lap + 1}회차 시작</button>
          <button className="btn text" onClick={onMenu}>한자 메뉴로</button>
        </div>
      </div>
    )
  }

  const entry = QUIZ[track.cursor]
  return (
    <div className="screen">
      <TopBar onBack={onMenu} left={`${track.lap}회차 · 한자 연습`} right={`${track.cursor + 1}/${total}`} />
      <Question
        key={entry.key}
        entry={entry}
        words={state.words}
        onToggleWord={onToggleWord}
        onOpen={onOpen}
        onDone={(mistakes) => onComplete(entry.key, mistakes)}
      />
      <div className="lap-progress">
        <div className="bar"><div style={{ width: `${(track.cursor / total) * 100}%` }} /></div>
        <span className="muted small">{track.cursor}/{total}</span>
      </div>
    </div>
  )
}

// 한자 오답만 다시 풀기 (책갈피는 그대로)
export function HanjaReview({ ids, state, onResult, onMenu, onToggleWord, onOpen }) {
  const [i, setI] = useState(0)
  const [solved, setSolved] = useState(0)

  if (i >= ids.length) {
    return (
      <div className="screen center">
        <h2>한자 오답 연습 끝 👏</h2>
        <p>{ids.length}단어 중 <b>{solved}단어</b>를 맞혀서 한자 오답에서 뺐어요.</p>
        <div className="actions col">
          <button className="btn primary" onClick={onMenu}>한자 메뉴로</button>
        </div>
      </div>
    )
  }

  const entry = HANVIET_BY_KEY[ids[i]]
  return (
    <div className="screen">
      <TopBar onBack={onMenu} left="한자 오답 연습" right={`${i + 1}/${ids.length}`} />
      <Question
        key={`${entry.key}-${i}`}
        entry={entry}
        words={state.words}
        onToggleWord={onToggleWord}
        onOpen={onOpen}
        onDone={(mistakes) => {
          onResult(entry.key, mistakes)
          if (mistakes === 0) setSolved((n) => n + 1)
          setI((n) => n + 1)
        }}
      />
    </div>
  )
}
