export default function Header({ category, current, total, view, setView }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇻🇳</span>
          <h1 className="text-lg font-bold text-indigo-700 tracking-tight">
            오픽 베트남어 학습
          </h1>
        </div>

        {/* Center: progress */}
        {view === 'cards' && total > 0 && (
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-xs text-gray-500">{category}</span>
            <span className="text-sm font-semibold text-indigo-600">
              {current} / {total}
            </span>
          </div>
        )}

        {/* Admin toggle */}
        <button
          onClick={() => setView(v => v === 'cards' ? 'admin' : 'cards')}
          className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
            view === 'admin'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          {view === 'admin' ? '← 학습으로' : '⚙ 관리'}
        </button>
      </div>
    </header>
  )
}
