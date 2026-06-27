import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import Card from './components/Card'
import Footer from './components/Footer'
import AdminView from './components/AdminView'
import seedData from './data/cards.json'

const CATEGORIES = ['전체', '자기소개', '직장/업무', '취미/여가', '거주지', '여행', '음식']
const LS_KEY = 'vnopic-cards'

function loadCards() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return seedData.cards
}

export default function App() {
  const [cards, setCards] = useState(loadCards)
  const [category, setCategory] = useState('전체')
  const [isRandom, setIsRandom] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [view, setView] = useState('cards') // 'cards' | 'admin'
  const analysisCache = useRef(new Map())

  // Persist cards to localStorage on change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cards))
  }, [cards])

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [category])

  const filtered = category === '전체'
    ? cards
    : cards.filter(c => c.category === category)

  const current = filtered.length > 0 ? filtered[currentIndex % filtered.length] : null

  const goNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      if (isRandom) {
        let idx
        do { idx = Math.floor(Math.random() * filtered.length) }
        while (filtered.length > 1 && idx === currentIndex)
        setCurrentIndex(idx)
      } else {
        setCurrentIndex(i => (i + 1) % filtered.length)
      }
    }, 100)
  }

  const goPrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex(i => (i - 1 + filtered.length) % filtered.length)
    }, 100)
  }

  const handleFlip = () => setIsFlipped(f => !f)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      <Header
        category={category}
        current={filtered.length > 0 ? currentIndex + 1 : 0}
        total={filtered.length}
        view={view}
        setView={setView}
      />

      {view === 'admin' ? (
        <AdminView
          cards={cards}
          setCards={setCards}
          categories={CATEGORIES.slice(1)}
          onBack={() => setView('cards')}
        />
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
          {current ? (
            <Card
              key={current.id}
              card={current}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              analysisCache={analysisCache}
            />
          ) : (
            <div className="text-gray-400 text-center">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg">이 카테고리에 카드가 없습니다.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={goPrev}
              disabled={filtered.length <= 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 hover:border-indigo-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← 이전
            </button>
            <span className="text-sm text-gray-500 min-w-[60px] text-center">
              {filtered.length > 0 ? `${currentIndex + 1} / ${filtered.length}` : '0 / 0'}
            </span>
            <button
              onClick={goNext}
              disabled={filtered.length <= 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 hover:border-indigo-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음 →
            </button>
          </div>
        </main>
      )}

      <Footer
        categories={CATEGORIES}
        category={category}
        setCategory={setCategory}
        isRandom={isRandom}
        setIsRandom={setIsRandom}
      />
    </div>
  )
}
