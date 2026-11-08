import { useContext, useState } from 'react'
import { WordContext } from '../components/Words.jsx'
import { HanjaTag } from '../components/Hanja.jsx'
import { HANVIET, QUIZ, TYPE_INFO } from '../lib/hanviet.js'
import { isLapDone } from '../lib/progress.js'
import { RULES } from '../data/hanviet.js'

const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'diff', label: `${TYPE_INFO.diff.icon} ${TYPE_INFO.diff.label}` },
  { id: 'near', label: `${TYPE_INFO.near.icon} ${TYPE_INFO.near.label}` },
  { id: 'reversed', label: `${TYPE_INFO.reversed.icon} ${TYPE_INFO.reversed.label}` },
  { id: 'same', label: `${TYPE_INFO.same.icon} ${TYPE_INFO.same.label}` },
  { id: 'viet', label: `${TYPE_INFO.viet.icon} 베트남식·기타` },
  { id: 'wrong', label: '📒 오답' },
]

export default function Hanja({ state, onQuiz, onReview, onHome }) {
  const { openHanja } = useContext(WordContext)
  const [filter, setFilter] = useState('all')
  const track = state.hanja
  const total = QUIZ.length
  const lapDone = isLapDone(track, total)
  const fresh = track.lap === 1 && track.cursor === 0 && Object.keys(track.history).length === 0
  const pct = Math.round((Math.min(track.cursor, total) / total) * 100)
  const wrongIds = QUIZ.filter((q) => track.notes[q.key]).map((q) => q.key)

  const list = HANVIET.filter((h) => {
    if (filter === 'all') return true
    if (filter === 'wrong') return !!track.notes[h.key]
    if (filter === 'viet') return h.type === 'viet' || h.type === 'mixed'
    return h.type === filter
  })

  return (
    <div className="screen">
      <header className="topbar">
        <button className="btn text" onClick={onHome}>← 홈</button>
        <span className="topbar-title">한자 어휘</span>
        <span className="muted small">{HANVIET.length}단어</span>
      </header>

      <p className="muted small">코스 문장에 나오는 한자어예요. 한국어와 뜻이 다른 단어(⚠️)에 특히 주의하세요.</p>

      {/* 연습문제 책갈피 */}
      <section className="card bookmark">
        <div className="bookmark-top">
          <span className="lap-badge">{track.lap}회차 · 연습문제</span>
          <span className="muted small">{Math.min(track.cursor, total)}/{total}</span>
        </div>
        <p className="bookmark-title">베트남어 단어 보고 한국어 한자어 고르기</p>
        <div className="bar"><div style={{ width: `${pct}%` }} /></div>
        <button className="btn primary block-btn" onClick={onQuiz}>
          {lapDone ? '회차 결과 보기' : fresh ? '시작하기' : '이어서 풀기'}
        </button>
      </section>

      {/* 한자 오답 */}
      <section className="card row">
        <div>
          <p className="card-title">📒 한자 오답</p>
          <p className="muted small">
            {wrongIds.length ? `틀린 단어 ${wrongIds.length}개` : '연습문제에서 틀린 단어가 여기 모여요.'}
          </p>
        </div>
        {wrongIds.length > 0 && (
          <button className="btn" onClick={() => onReview(wrongIds)}>다시 풀기</button>
        )}
      </section>

      {/* 대응 규칙 */}
      <details className="card rules">
        <summary className="card-title">💡 한국 한자음 → 베트남 음 대응 규칙</summary>
        <p className="muted small">한국 음을 알면 베트남 음을 짐작할 수 있어요. (경향이고 예외도 있어요)</p>
        <p className="rules-head">받침 → 끝소리</p>
        {RULES.finals.map((r) => (
          <p key={r.ko} className="rule"><b>{r.ko}</b> → {r.vi}<br /><span className="muted">{r.ex}</span></p>
        ))}
        <p className="rules-head">첫소리</p>
        {RULES.initials.map((r) => (
          <p key={r.ko} className="rule"><b>{r.ko}</b> → {r.vi}<br /><span className="muted">{r.ex}</span></p>
        ))}
        <p className="rule small">{RULES.dueum}</p>
      </details>

      {/* 단어 목록 */}
      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.id} className={`filter ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="muted center small">해당하는 단어가 없어요.</p>}
      {list.map((h) => (
        <button key={h.key} type="button" className="hanja-item" onClick={() => openHanja(h.key)}>
          <span className="hanja-item-main">
            <span className="word-vi">
              {h.display}
              {state.words[h.key] && <span className="saved-mark"> ★</span>}
            </span>
            <span className="hanja-item-sub">
              {h.hanja.replaceAll('_', '·')} [{h.reading.replaceAll('_', '·')}] · {h.meaning}
            </span>
          </span>
          <HanjaTag type={h.type} />
        </button>
      ))}
    </div>
  )
}
