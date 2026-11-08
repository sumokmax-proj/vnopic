import { useEffect, useMemo, useState } from 'react'
import Home from './screens/Home.jsx'
import Notes from './screens/Notes.jsx'
import WordList from './screens/WordList.jsx'
import Hanja from './screens/Hanja.jsx'
import { HanjaCourse, HanjaReview } from './screens/HanjaQuiz.jsx'
import { CourseStudy, ReviewStudy } from './screens/Study.jsx'
import { WordContext, WordSheet } from './components/Words.jsx'
import { HanjaSheet } from './components/Hanja.jsx'
import { QUIZ } from './lib/hanviet.js'
import { COURSE } from './lib/course.js'
import {
  load, save, completeCourseSentence, recordResult, startNextLap, moveBookmark, markBackedUp,
  toggleWord, completeHanja, recordHanja, startNextHanjaLap,
} from './lib/progress.js'

export default function App() {
  const [state, setState] = useState(load)
  // home | course | notes | review | words | hanja | hanjaQuiz | hanjaReview
  const [screen, setScreen] = useState('home')
  const [reviewSids, setReviewSids] = useState([])
  const [hanjaReviewIds, setHanjaReviewIds] = useState([])
  // 열려 있는 시트: { kind: 'word', text, sid } | { kind: 'hanja', key }
  const [sheet, setSheet] = useState(null)

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
  const openHanja = (key) => setSheet({ kind: 'hanja', key })
  const wordCtx = useMemo(
    () => ({ open: (text, sid) => setSheet({ kind: 'word', text, sid }), openHanja, words: state.words }),
    [state.words],
  )
  const goHanja = () => setScreen('hanja')

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
          onHanja={goHanja}
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
      {screen === 'hanja' && (
        <Hanja
          state={state}
          onHome={goHome}
          onQuiz={() => setScreen('hanjaQuiz')}
          onReview={(ids) => {
            setHanjaReviewIds(ids)
            setScreen('hanjaReview')
          }}
        />
      )}
      {screen === 'hanjaQuiz' && (
        <HanjaCourse
          state={state}
          onComplete={(id, mistakes) => setState((s) => completeHanja(s, id, mistakes, QUIZ.length))}
          onNextLap={() => setState((s) => startNextHanjaLap(s))}
          onMenu={goHanja}
          onToggleWord={onToggleWord}
          onOpen={openHanja}
        />
      )}
      {screen === 'hanjaReview' && (
        <HanjaReview
          ids={hanjaReviewIds}
          state={state}
          onResult={(id, mistakes) => setState((s) => recordHanja(s, id, mistakes))}
          onMenu={goHanja}
          onToggleWord={onToggleWord}
          onOpen={openHanja}
        />
      )}
      {sheet?.kind === 'hanja' && (
        <HanjaSheet
          hkey={sheet.key}
          words={state.words}
          onToggle={onToggleWord}
          onOpen={openHanja}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet?.kind === 'word' && (
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
