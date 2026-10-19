import { useEffect, useState } from 'react'
import Home from './screens/Home.jsx'
import Notes from './screens/Notes.jsx'
import { CourseStudy, ReviewStudy } from './screens/Study.jsx'
import { COURSE } from './lib/course.js'
import {
  load, save, completeCourseSentence, recordResult, startNextLap, moveBookmark, markBackedUp,
} from './lib/progress.js'

export default function App() {
  const [state, setState] = useState(load)
  const [screen, setScreen] = useState('home') // home | course | notes | review
  const [reviewSids, setReviewSids] = useState([])

  useEffect(() => save(state), [state])
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => {})
  }, [])
  useEffect(() => window.scrollTo(0, 0), [screen])

  const goHome = () => setScreen('home')

  return (
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
    </main>
  )
}
