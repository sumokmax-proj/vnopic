import { COURSE, TOPICS } from '../lib/course.js'

export default function Notes({ state, onPractice, onHome }) {
  const items = COURSE.filter((s) => state.notes[s.sid]) // 코스 순서 유지

  return (
    <div className="screen">
      <header className="topbar">
        <button className="btn text" onClick={onHome}>← 홈</button>
        <span className="topbar-title">오답노트</span>
        <span className="muted small">{items.length}문장</span>
      </header>

      {items.length === 0 ? (
        <p className="muted center">오답노트가 비었어요. 다 익혔네요! 👏</p>
      ) : (
        <>
          <p className="muted small">실수 없이 다시 완성하면 오답노트에서 빠져요.</p>
          <button className="btn primary block-btn" onClick={() => onPractice(items.map((s) => s.sid))}>
            오답만 연습하기 ({items.length}문장)
          </button>
          {TOPICS.map((topic) => {
            const list = items.filter((s) => s.topic === topic)
            if (!list.length) return null
            return (
              <section key={topic}>
                <h3 className="section-title">{topic} <span className="weak-badge">{list.length}</span></h3>
                {list.map((s) => (
                  <div key={s.sid} className="note-item">
                    <p className="vi">{s.text}</p>
                    <p className="muted small">{s.ko}</p>
                    <p className="note-meta">누적 {state.history[s.sid]?.misses ?? 0}번 틀림</p>
                  </div>
                ))}
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}
