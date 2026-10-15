import { useState } from 'react'
import Assemble from '../components/Assemble.jsx'
import { ANSWER_BY_ID, COURSE, SENTENCE_BY_ID } from '../lib/course.js'
import { isLapDone, lapMissCount } from '../lib/progress.js'

function TopBar({ onHome, left, right }) {
  return (
    <header className="topbar">
      <button className="btn text" onClick={onHome}>← 홈</button>
      <span className="topbar-title">{left}</span>
      <span className="muted small">{right}</span>
    </header>
  )
}

function AnswerSummary({ answer, missed, onNext, onHome, nextLabel }) {
  return (
    <div className="screen">
      <TopBar onHome={onHome} left={answer.topic} right="답변 전체" />
      <div className="card">
        <p className="q-vi">{answer.q.vi}</p>
        <p className="muted small">{answer.q.ko}</p>
      </div>
      <p className="muted small">이어서 읽어 보세요. 표시된 문장은 이번에 틀린 문장이에요.</p>
      <div className="summary">
        {answer.sentences.map((_, i) => {
          const s = SENTENCE_BY_ID[`${answer.id}-${i + 1}`]
          return (
            <div key={s.sid} className={`summary-line ${missed.has(s.sid) ? 'missed' : ''}`}>
              <p className="vi">{s.text}</p>
              <p className="muted small">{s.ko}</p>
            </div>
          )
        })}
      </div>
      <div className="actions">
        <button className="btn primary" onClick={onNext}>{nextLabel}</button>
      </div>
    </div>
  )
}

function QuestionHeader({ sentence }) {
  const answer = ANSWER_BY_ID[sentence.answerId]
  return (
    <div className="card question">
      <p className="q-vi">{answer.q.vi}</p>
      <p className="muted small">{answer.q.ko}</p>
    </div>
  )
}

// 코스: 책갈피 위치부터 순서대로
export function CourseStudy({ state, onComplete, onNextLap, onHome, onNotes }) {
  const [missed, setMissed] = useState(() => new Set())
  const [summaryFor, setSummaryFor] = useState(null)

  if (summaryFor) {
    const lapDone = isLapDone(state, COURSE.length)
    return (
      <AnswerSummary
        answer={ANSWER_BY_ID[summaryFor]}
        missed={missed}
        onHome={onHome}
        nextLabel={lapDone ? '회차 결과 보기' : '다음 질문'}
        onNext={() => setSummaryFor(null)}
      />
    )
  }

  if (isLapDone(state, COURSE.length)) {
    const now = lapMissCount(state, state.lap)
    const prev = state.lap > 1 ? lapMissCount(state, state.lap - 1) : null
    return (
      <div className="screen center">
        <p className="lap-badge">{state.lap}회차 완주</p>
        <h2>한 바퀴 다 돌았어요 🎉</h2>
        <p>
          전체 {COURSE.length}문장 중 이번 회차에 틀린 문장 <b>{now}개</b>
        </p>
        {prev !== null && (
          <p className="muted">
            지난 회차 {prev}개 →{' '}
            {now < prev ? `${prev - now}개 줄었어요. 문장이 익숙해지고 있어요!` : '천천히 계속 돌다 보면 줄어들어요.'}
          </p>
        )}
        <div className="actions col">
          <button className="btn primary" onClick={onNextLap}>{state.lap + 1}회차 시작</button>
          {Object.keys(state.notes).length > 0 && (
            <button className="btn" onClick={onNotes}>오답노트 보기</button>
          )}
          <button className="btn text" onClick={onHome}>홈으로</button>
        </div>
      </div>
    )
  }

  const sentence = COURSE[state.cursor]

  const handleDone = (mistakes) => {
    setMissed((m) => {
      const next = new Set(m)
      if (mistakes > 0) next.add(sentence.sid)
      else next.delete(sentence.sid)
      return next
    })
    onComplete(sentence.sid, mistakes)
    if (sentence.index === sentence.total - 1) setSummaryFor(sentence.answerId)
  }

  return (
    <div className="screen">
      <TopBar
        onHome={onHome}
        left={`${state.lap}회차 · ${sentence.topic}`}
        right={`문장 ${sentence.index + 1}/${sentence.total}`}
      />
      <QuestionHeader sentence={sentence} />
      <Assemble
        key={sentence.sid}
        sentence={sentence}
        startWithReading={state.lap === 1}
        onDone={handleDone}
      />
      <div className="lap-progress">
        <div className="bar"><div style={{ width: `${(state.cursor / COURSE.length) * 100}%` }} /></div>
        <span className="muted small">{state.cursor}/{COURSE.length}</span>
      </div>
    </div>
  )
}

// 오답 연습: 시작 시점의 오답노트 문장들만 (책갈피는 그대로)
export function ReviewStudy({ sids, onResult, onHome, onNotes }) {
  const [i, setI] = useState(0)
  const [solved, setSolved] = useState(0)

  if (i >= sids.length) {
    return (
      <div className="screen center">
        <h2>오답 연습 끝 👏</h2>
        <p>
          {sids.length}문장 중 <b>{solved}문장</b>을 실수 없이 완성해서 오답노트에서 뺐어요.
        </p>
        <div className="actions col">
          <button className="btn primary" onClick={onNotes}>오답노트로</button>
          <button className="btn text" onClick={onHome}>홈으로</button>
        </div>
      </div>
    )
  }

  const sentence = SENTENCE_BY_ID[sids[i]]
  return (
    <div className="screen">
      <TopBar onHome={onHome} left={`오답 연습 · ${sentence.topic}`} right={`${i + 1}/${sids.length}`} />
      <QuestionHeader sentence={sentence} />
      <Assemble
        key={`${sentence.sid}-${i}`}
        sentence={sentence}
        startWithReading={false}
        onDone={(mistakes) => {
          onResult(sentence.sid, mistakes)
          if (mistakes === 0) setSolved((n) => n + 1)
          setI((n) => n + 1)
        }}
      />
    </div>
  )
}
