export default function Footer({ categories, category, setCategory, isRandom, setIsRandom }) {
  return (
    <footer className="bg-white border-t border-gray-200 pb-safe">
      <div className="max-w-2xl mx-auto px-4 py-3 flex flex-col gap-3">
        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Options row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setIsRandom(r => !r)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                isRandom ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isRandom ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-xs text-gray-600">랜덤 모드</span>
          </label>

          <span className="text-xs text-gray-400">
            🇻🇳 OPIc NH → IM
          </span>
        </div>
      </div>
    </footer>
  )
}
