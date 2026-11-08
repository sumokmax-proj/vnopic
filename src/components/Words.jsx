import { createContext, useContext } from 'react'
import { lookup, normalize } from '../lib/glossary.js'

// 어디서든 블록을 탭하면 뜻 시트를 열 수 있게 하는 컨텍스트
export const WordContext = createContext({ open: () => {}, words: {} })

// 탭하면 뜻이 나오는 블록 묶음
// variant="text": 문장처럼 보임(점선 밑줄) / "block": 조립 완료된 블록 모양
export function WordChips({ blocks, sid, variant = 'text' }) {
  const { open, words } = useContext(WordContext)
  return (
    <span className={`chips ${variant}`}>
      {blocks.map((b, i) => (
        <button
          key={`${i}-${b}`}
          type="button"
          className={`chip ${words[normalize(b)] ? 'saved' : ''}`}
          onClick={() => open(b, sid)}
        >
          {b}
        </button>
      ))}
    </span>
  )
}

function Star({ on, onClick, label }) {
  return (
    <button type="button" className={`star ${on ? 'on' : ''}`} onClick={onClick} aria-label={label}>
      {on ? '★' : '☆'}
    </button>
  )
}

// 아래에서 올라오는 뜻 시트
export function WordSheet({ text, sid, words, onToggle, onClose }) {
  const info = lookup(text)
  const toggle = (key, shown) => onToggle({ key, text: shown, sid })

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label="단어 뜻" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <p className="sheet-word">{info.text}</p>
          <Star
            on={!!words[info.key]}
            onClick={() => toggle(info.key, info.text)}
            label={words[info.key] ? '단어장에서 빼기' : '단어장에 저장'}
          />
        </div>
        <p className="sheet-meaning">{info.meaning ?? '아직 뜻 정보가 없어요.'}</p>

        {info.parts.length > 1 && (
          <div className="sheet-parts">
            <p className="muted small">단어별 뜻</p>
            {info.parts.map((p, i) => (
              <div key={`${i}-${p.key}`} className="part-row">
                <span className="part-vi">{p.text}</span>
                <span className="part-ko">{p.meaning}</span>
                <Star
                  on={!!words[p.key]}
                  onClick={() => toggle(p.key, p.text)}
                  label={words[p.key] ? '단어장에서 빼기' : '단어장에 저장'}
                />
              </div>
            ))}
          </div>
        )}

        <p className="muted small">☆를 누르면 내 단어장에 저장돼요.</p>
        <button type="button" className="btn block-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}
