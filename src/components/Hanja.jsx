import { HANVIET_BY_KEY, CHAR_INDEX, SOUND_INDEX, TYPE_INFO } from '../lib/hanviet.js'

export function HanjaTag({ type }) {
  const t = TYPE_INFO[type]
  return <span className={`htag ${type}`}>{t.icon} {t.label}</span>
}

// 예문에서 단어를 굵게
export function Highlight({ sentence, word }) {
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

// 한자 + 한국 음 표시. 순서 반대면 한국어 쪽도 같이
export function HanjaWord({ entry, size = 'big' }) {
  return (
    <div className={`hanja-word ${size}`}>
      <span className="hanja-chars">{entry.chars.map((c, i) => (c.ch ? <span key={i}>{c.ch}</span> : <span key={i} className="native">{c.vi}</span>))}</span>
      <span className="hanja-reading">[{[...entry.reading].map((r) => (r === '_' ? '–' : r)).join('')}]</span>
      {entry.type === 'reversed' && (
        <span className="hanja-ko">→ 한국어 {entry.koHanja} [{entry.ko}]</span>
      )}
    </div>
  )
}

// 연습문제 정답 공개와 한자 시트에서 함께 쓰는 상세 내용
export function HanjaDetail({ entry, onOpen }) {
  return (
    <div className="hanja-detail">
      <HanjaWord entry={entry} />
      <div className="hanja-type">
        <HanjaTag type={entry.type} />
        {entry.note && <span className="hanja-note">{entry.note}</span>}
      </div>
      <p className="hanja-meaning"><span className="muted small">뜻</span> {entry.meaning}</p>

      <div className="char-rows">
        {entry.chars.filter((c) => c.ch).map((c) => {
          const others = (CHAR_INDEX[c.ch] ?? []).filter((h) => h.key !== entry.key)
          const sameSound = [...(SOUND_INDEX[c.vi] ?? [])].filter((ch) => ch !== c.ch)
          return (
            <div key={c.ch} className="char-row">
              <p>
                <span className="char-big">{c.ch}</span> <b>{c.hun} {c.ko}</b> · <span className="char-vi">{c.vi}</span>
              </p>
              {others.length > 0 && (
                <p className="small">
                  <span className="muted">같은 한자 </span>
                  {others.map((h) => (
                    <button key={h.key} type="button" className="link" onClick={() => onOpen?.(h.key)}>
                      {h.display}
                    </button>
                  ))}
                </p>
              )}
              {sameSound.length > 0 && (
                <p className="small">
                  <span className="muted">같은 소리 '{c.vi}', 다른 한자 </span>
                  {sameSound.map((ch) => {
                    const h = CHAR_INDEX[ch][0]
                    return (
                      <button key={ch} type="button" className="link" onClick={() => onOpen?.(h.key)}>
                        {ch} ({h.display})
                      </button>
                    )
                  })}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {entry.example && (
        <div className="hanja-example">
          <p className="vi"><Highlight sentence={entry.example.text} word={entry.display} /></p>
          <p className="muted small">{entry.example.ko}</p>
        </div>
      )}
    </div>
  )
}

export function SaveStar({ entry, words, onToggle }) {
  const key = entry.key
  const on = !!words[key]
  return (
    <button
      type="button"
      className={`star ${on ? 'on' : ''}`}
      aria-label={on ? '단어장에서 빼기' : '단어장에 저장'}
      onClick={() => onToggle({ key, text: entry.display, sid: entry.example?.sid ?? null })}
    >
      {on ? '★' : '☆'}
    </button>
  )
}

// 아래에서 올라오는 한자 시트
export function HanjaSheet({ hkey, words, onToggle, onOpen, onClose }) {
  const entry = HANVIET_BY_KEY[hkey]
  if (!entry) return null
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label="한자 어휘" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <p className="sheet-word">{entry.display}</p>
          <SaveStar entry={entry} words={words} onToggle={onToggle} />
        </div>
        <HanjaDetail entry={entry} onOpen={onOpen} />
        <button type="button" className="btn block-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}
