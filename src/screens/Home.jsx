import { ANSWERS, ANSWER_BY_ID, COURSE, FIRST_INDEX_OF_ANSWER, TOPICS } from '../lib/course.js'
import { isLapDone, lapMissCount } from '../lib/progress.js'

export default function Home({ state, onContinue, onJump, onNotes }) {
  const total = COURSE.length
  const lapDone = isLapDone(state, total)
  const current = lapDone ? null : COURSE[state.cursor]
  const fresh = state.lap === 1 && state.cursor === 0 && Object.keys(state.history).length === 0
  const noteCount = Object.keys(state.notes).length
  const pct = Math.round((state.cursor / total) * 100)

  const notesInAnswer = (answerId) =>
    Object.keys(state.notes).filter((sid) => sid.startsWith(`${answerId}-`)).length

  const pastLaps = Array.from({ length: state.lap - 1 }, (_, i) => i + 1).reverse()

  return (
    <div className="screen">
      <header className="home-header">
        <h1>vnopic</h1>
        <p className="muted small">문장이 입에 붙는 베트남어 OPIc</p>
      </header>

      {/* 책갈피 */}
      <section className="card bookmark">
        <div className="bookmark-top">
          <span className="lap-badge">{state.lap}회차</span>
          <span className="muted small">{pct}%</span>
        </div>
        {lapDone ? (
          <p className="bookmark-title">이번 회차를 다 돌았어요 🎉</p>
        ) : fresh ? (
          <p className="bookmark-title">처음부터 시작해 볼까요?</p>
        ) : (
          <>
            <p className="muted small">🔖 여기까지 했어요</p>
            <p className="bookmark-title">
              {current.topic} · {ANSWER_BY_ID[current.answerId].q.ko}
            </p>
            <p className="muted small">문장 {current.index + 1}/{current.total}부터</p>
          </>
        )}
        <div className="bar"><div style={{ width: `${pct}%` }} /></div>
        <button className="btn primary block-btn" onClick={onContinue}>
          {lapDone ? '회차 결과 보기' : fresh ? '시작하기' : '이어하기'}
        </button>
      </section>

      {/* 오답노트 */}
      <section className="card row" onClick={noteCount ? onNotes : undefined} role={noteCount ? 'button' : undefined}>
        <div>
          <p className="card-title">📒 오답노트</p>
          <p className="muted small">
            {noteCount ? `약한 문장 ${noteCount}개가 모여 있어요` : '아직 비어 있어요. 틀린 문장이 여기 모여요.'}
          </p>
        </div>
        {noteCount > 0 && <span className="chev">›</span>}
      </section>

      {pastLaps.length > 0 && (
        <section className="laps">
          {pastLaps.map((lap) => (
            <span key={lap} className="muted small">
              {lap}회차: 틀린 문장 {lapMissCount(state, lap)}개
            </span>
          ))}
        </section>
      )}

      {/* 목차 */}
      <section>
        <h3 className="section-title">목차</h3>
        {TOPICS.map((topic) => {
          const answers = ANSWERS.filter((a) => a.topic === topic)
          const weak = answers.reduce((n, a) => n + notesInAnswer(a.id), 0)
          const open = current?.topic === topic
          return (
            <details key={topic} className="toc-topic" open={open}>
              <summary>
                <span>{topic}</span>
                {weak > 0 && <span className="weak-badge">오답 {weak}</span>}
              </summary>
              {answers.map((a) => {
                const start = FIRST_INDEX_OF_ANSWER[a.id]
                const end = start + a.sentences.length
                const status = state.cursor >= end ? 'done' : state.cursor >= start ? 'now' : ''
                const weakHere = notesInAnswer(a.id)
                return (
                  <button
                    key={a.id}
                    className={`toc-item ${status}`}
                    onClick={() => {
                      if (window.confirm(`"${a.q.ko}"\n여기부터 시작할까요? 책갈피가 이 질문으로 옮겨져요.`)) onJump(start)
                    }}
                  >
                    <span className="toc-mark">{status === 'done' ? '✓' : status === 'now' ? '🔖' : '·'}</span>
                    <span className="toc-q">{a.q.ko}</span>
                    {weakHere > 0 && <span className="weak-badge">{weakHere}</span>}
                  </button>
                )
              })}
            </details>
          )
        })}
      </section>
    </div>
  )
}
