import { useContext, useState } from 'react'
import { WordContext } from '../components/Words.jsx'
import { lookup } from '../lib/glossary.js'
import { SENTENCE_BY_ID } from '../lib/course.js'

// 예문에서 저장한 단어를 굵게
function Highlight({ sentence, word }) {
  const i = sentence.toLowerCase().indexOf(word.toLowerCase())
  if (i < 0) return sentence
  return (
    <>
      {sentence.slice(0, i)}
      <b>{sentence.slice(i, i + word.length)}</b>
      {sentence.slice(i + word.length)}
    </>
  )
}

export default function WordList({ state, onToggle, onHome }) {
  const { open } = useContext(WordContext)
  const [hide, setHide] = useState(false)
  const items = Object.entries(state.words)
    .map(([key, w]) => ({ key, ...w }))
    .sort((a, b) => (b.savedAt ?? '').localeCompare(a.savedAt ?? ''))

  return (
    <div className="screen">
      <header className="topbar">
        <button className="btn text" onClick={onHome}>← 홈</button>
        <span className="topbar-title">내 단어장</span>
        <span className="muted small">{items.length}개</span>
      </header>

      {items.length === 0 ? (
        <p className="muted center">아직 저장한 단어가 없어요.</p>
      ) : (
        <>
          <div className="wordlist-tools">
            <span className="muted small">탭하면 자세한 뜻이 나와요.</span>
            <button className="btn text" onClick={() => setHide((h) => !h)}>
              {hide ? '뜻 보이기' : '뜻 가리기'}
            </button>
          </div>
          {items.map((w) => {
            const s = w.sid ? SENTENCE_BY_ID[w.sid] : null
            return (
              <div key={w.key} className="word-item" role="button" onClick={() => open(w.text, w.sid)}>
                <div className="word-item-main">
                  <p className="word-vi">{w.text}</p>
                  <p className={`word-ko ${hide ? 'hidden' : ''}`}>{hide ? '뜻 보기 ›' : lookup(w.key).meaning}</p>
                  {s && (
                    <p className="word-ex">
                      <Highlight sentence={s.text} word={w.text} />
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="star on"
                  aria-label="단어장에서 빼기"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle({ key: w.key, text: w.text, sid: w.sid })
                  }}
                >
                  ★
                </button>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
