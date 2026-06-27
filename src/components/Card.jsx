import Analysis from './Analysis'

const CATEGORY_COLORS = {
  '자기소개': 'bg-blue-100 text-blue-700',
  '직장/업무': 'bg-purple-100 text-purple-700',
  '취미/여가': 'bg-green-100 text-green-700',
  '거주지': 'bg-yellow-100 text-yellow-700',
  '여행': 'bg-orange-100 text-orange-700',
  '음식': 'bg-red-100 text-red-700',
}

const LEVEL_COLORS = {
  'NH': 'bg-gray-100 text-gray-600',
  'IM': 'bg-emerald-100 text-emerald-700',
  'IH': 'bg-blue-100 text-blue-700',
  'AL': 'bg-violet-100 text-violet-700',
}

export default function Card({ card, isFlipped, onFlip, analysisCache }) {
  const catColor = CATEGORY_COLORS[card.category] || 'bg-gray-100 text-gray-600'
  const lvlColor = LEVEL_COLORS[card.level] || 'bg-gray-100 text-gray-600'

  return (
    <div className="w-full max-w-lg flex flex-col gap-4">
      {/* Flip card */}
      <div className="card-flip-container w-full" style={{ height: '280px' }}>
        <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front — Question */}
          <div
            className="card-face card-front bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow"
            onClick={onFlip}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColor}`}>
                {card.category}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${lvlColor}`}>
                  {card.level}
                </span>
                <span className="text-xs text-gray-400">탭하여 뒤집기</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <span className="text-4xl">❓</span>
              <p className="text-xl font-semibold text-gray-800 leading-relaxed">
                {card.question.vi}
              </p>
              <p className="text-sm text-gray-500">{card.question.ko}</p>
            </div>

            <div className="flex justify-end mt-4">
              <span className="text-xs text-gray-300">#{card.id}</span>
            </div>
          </div>

          {/* Back — Answer */}
          <div
            className="card-face card-back bg-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow"
            onClick={onFlip}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColor}`}>
                {card.category}
              </span>
              <span className="text-xs text-indigo-400">탭하여 뒤집기</span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-3 overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">🇻🇳 Vietnamese</span>
                <p className="mt-1 text-base text-gray-800 leading-relaxed">{card.answer.vi}</p>
              </div>
              <hr className="border-indigo-100" />
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">🇰🇷 Korean</span>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{card.answer.ko}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis panel — only shown when flipped */}
      {isFlipped && (
        <Analysis
          card={card}
          analysisCache={analysisCache}
        />
      )}
    </div>
  )
}
