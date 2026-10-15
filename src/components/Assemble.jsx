import { useMemo, useState } from 'react'
import { shuffleBlocks } from '../lib/course.js'

// 문장 하나 조립. 실수(틀린 탭·힌트·문장 보기) 횟수를 onDone으로 넘김.
export default function Assemble({ sentence, startWithReading, onDone }) {
  const pool = useMemo(() => shuffleBlocks(sentence.blocks), [sentence])
  const [phase, setPhase] = useState(startWithReading ? 'read' : 'build')
  const [placed, setPlaced] = useState([]) // pool item id 배열
  const [mistakes, setMistakes] = useState(0)
  const [wrongId, setWrongId] = useState(null)
  const [peeking, setPeeking] = useState(false)
  const [peeked, setPeeked] = useState(false)

  const done = placed.length === sentence.blocks.length
  const expected = sentence.blocks[placed.length]

  const place = (item) => {
    if (done || placed.includes(item.id)) return
    if (item.text === expected) {
      setPlaced((p) => [...p, item.id])
    } else {
      setMistakes((m) => m + 1)
      setWrongId(item.id)
      setTimeout(() => setWrongId((w) => (w === item.id ? null : w)), 450)
    }
  }

  const hint = () => {
    const item = pool.find((b) => !placed.includes(b.id) && b.text === expected)
    if (!item) return
    setMistakes((m) => m + 1)
    setPlaced((p) => [...p, item.id])
  }

  const togglePeek = () => {
    if (!peeked) {
      setPeeked(true)
      setMistakes((m) => m + 1)
    }
    setPeeking((v) => !v)
  }

  if (phase === 'read') {
    return (
      <div className="assemble">
        <p className="ko-prompt">{sentence.ko}</p>
        <p className="vi-reading">{sentence.text}</p>
        <p className="muted small">문장을 소리 내어 한두 번 읽어 보세요.</p>
        <div className="actions">
          <button className="btn primary" onClick={() => setPhase('build')}>조립하기</button>
        </div>
      </div>
    )
  }

  const byId = Object.fromEntries(pool.map((b) => [b.id, b]))

  return (
    <div className="assemble">
      <p className="ko-prompt">{sentence.ko}</p>

      <div className={`answer-line ${done ? (mistakes ? 'done' : 'done perfect') : ''}`}>
        {placed.length === 0 && <span className="placeholder">블록을 순서대로 탭하세요</span>}
        {placed.map((id) => (
          <span key={id} className="block placed">{byId[id].text}</span>
        ))}
      </div>

      {peeking && !done && <p className="vi-peek">{sentence.text}</p>}

      {!done && (
        <>
          <div className="pool">
            {pool.map((b) =>
              placed.includes(b.id) ? (
                <span key={b.id} className="block ghost">{b.text}</span>
              ) : (
                <button
                  key={b.id}
                  className={`block ${wrongId === b.id ? 'wrong' : ''}`}
                  onClick={() => place(b)}
                >
                  {b.text}
                </button>
              ),
            )}
          </div>
          <div className="tools">
            <button className="btn text" onClick={togglePeek}>{peeking ? '문장 숨기기' : '문장 보기'}</button>
            <button className="btn text" onClick={hint}>힌트</button>
          </div>
        </>
      )}

      {done && (
        <div className="result">
          {mistakes === 0 ? (
            <p className="result-msg good">완벽해요 ✨</p>
          ) : (
            <p className="result-msg">실수 {mistakes}번 · 오답노트에 담았어요</p>
          )}
          <div className="actions">
            <button className="btn primary" onClick={() => onDone(mistakes)}>다음</button>
          </div>
        </div>
      )}
    </div>
  )
}
