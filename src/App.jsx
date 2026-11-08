import { useEffect, useMemo, useState } from 'react'
import Home from './screens/Home.jsx'
import Notes from './screens/Notes.jsx'
import WordList from './screens/WordList.jsx'
import { CourseStudy, ReviewStudy } from './screens/Study.jsx'
import { WordContext, WordSheet } from './components/Words.jsx'
import { COURSE } from './lib/course.js'
import {
  load, save, completeCourseSentence, recordResult, startNextLap, moveBookmark, markBackedUp,
  toggleWord,
} from './lib/progress.js'

export default function App() {
  const [state, setState] = useState(load)
  const [screen, setScreen] = useState('home') // home | course | notes | review | words
  const [reviewSids, setReviewSids] = useState([])
  const [sheet, setSheet] = useState(null) // 열려 있는 뜻 시트 { text, sid }

  // effect는 값을 돌려주면 안 됨 (React가 정리 함수로 호출함) → 항상 중괄호 본문으로
  useEffect(() => {
    save(state)
  }, [state])
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => {})
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0) // 최신 Chrome은 Promise를 돌려줌 — 반환하지 말 것
    setSheet(null)
  }, [screen])

  const goHome = () => setScreen('home')
  const onToggleWord = (word) => setState((s) => toggleWord(s, word))
  const wordCtx = useMemo(
    () => ({ open: (text, sid) => setSheet({ text, sid }), words: state.words }),
    [state.words],
  )

  return (
    <WordContext.Provider value={wordCtx}>
    <main className="app">
      {screen === 'home' && (
        <Home
          state={state}
          onContinue={() => setScreen('course')}
          onJump={(index) => {
            setState((s) => moveBookmark(s, index, COURSE.length))
            setScreen('course')
          }}
          onNotes={() => setScreen('notes')}
          onWords={() => setScreen('words')}
          onExported={() => setState((s) => markBackedUp(s))}
          onImported={(restored) => setState(restored)}
        />
      )}
      {screen === 'course' && (
        <CourseStudy
          state={state}
          onComplete={(sid, mistakes) =>
            setState((s) => completeCourseSentence(s, sid, mistakes, COURSE.length))
          }
          onNextLap={() => setState((s) => startNextLap(s))}
          onHome={goHome}
          onNotes={() => setScreen('notes')}
        />
      )}
      {screen === 'notes' && (
        <Notes
          state={state}
          onHome={goHome}
          onPractice={(sids) => {
            setReviewSids(sids)
            setScreen('review')
          }}
        />
      )}
      {screen === 'review' && (
        <ReviewStudy
          sids={reviewSids}
          onResult={(sid, mistakes) => setState((s) => recordResult(s, sid, mistakes))}
          onHome={goHome}
          onNotes={() => setScreen('notes')}
        />
      )}
      {screen === 'words' && <WordList state={state} onToggle={onToggleWord} onHome={goHome} />}
      {sheet && (
        <WordSheet
          text={sheet.text}
          sid={sheet.sid}
          words={state.words}
          onToggle={onToggleWord}
          onClose={() => setSheet(null)}
        />
      )}
    </main>
    </WordContext.Provider>
  )
}
