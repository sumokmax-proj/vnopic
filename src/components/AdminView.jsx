import { useState } from 'react'

const EMPTY_CARD = {
  id: '',
  category: '자기소개',
  question: { vi: '', ko: '' },
  answer: { vi: '', ko: '' },
  level: 'IM',
  tags: [],
}

export default function AdminView({ cards, setCards, categories }) {
  const [editing, setEditing] = useState(null) // card being edited or 'new'
  const [form, setForm] = useState(EMPTY_CARD)
  const [filterCat, setFilterCat] = useState('전체')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const visible = filterCat === '전체'
    ? cards
    : cards.filter(c => c.category === filterCat)

  const startNew = () => {
    const maxId = cards.reduce((m, c) => Math.max(m, parseInt(c.id) || 0), 0)
    setForm({ ...EMPTY_CARD, id: String(maxId + 1).padStart(3, '0') })
    setEditing('new')
  }

  const startEdit = (card) => {
    setForm(JSON.parse(JSON.stringify(card)))
    setEditing(card.id)
  }

  const handleSave = () => {
    if (!form.question.vi.trim() || !form.answer.vi.trim()) return
    if (editing === 'new') {
      setCards(prev => [...prev, form])
    } else {
      setCards(prev => prev.map(c => c.id === editing ? form : c))
    }
    setEditing(null)
  }

  const handleDelete = (id) => {
    setCards(prev => prev.filter(c => c.id !== id))
    setDeleteConfirm(null)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ cards }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cards.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const setField = (path, value) => {
    setForm(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-lg font-bold text-gray-800">카드 관리</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            JSON 내보내기
          </button>
          <button
            onClick={startNew}
            className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + 카드 추가
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {['전체', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 transition-all ${
              filterCat === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-indigo-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Card list */}
      <div className="space-y-2">
        {visible.map(card => (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {card.category}
                </span>
                <span className="text-xs text-gray-400">#{card.id}</span>
                <span className="text-xs text-gray-400">{card.level}</span>
              </div>
              <p className="text-sm text-gray-800 truncate">{card.question.vi}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{card.question.ko}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => startEdit(card)}
                className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                수정
              </button>
              {deleteConfirm === card.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    확인
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(card.id)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">총 {visible.length}개 카드</p>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h3 className="text-base font-bold text-gray-800 mb-4">
                {editing === 'new' ? '새 카드 추가' : '카드 수정'}
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">카테고리</label>
                    <select
                      value={form.category}
                      onChange={e => setField('category', e.target.value)}
                      className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-400"
                    >
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">레벨</label>
                    <select
                      value={form.level}
                      onChange={e => setField('level', e.target.value)}
                      className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-400"
                    >
                      {['NH', 'IM', 'IH', 'AL'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium">질문 (베트남어) *</label>
                  <textarea
                    value={form.question.vi}
                    onChange={e => setField('question.vi', e.target.value)}
                    rows={2}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 resize-none"
                    placeholder="Hãy giới thiệu về bản thân bạn."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">질문 (한국어)</label>
                  <input
                    value={form.question.ko}
                    onChange={e => setField('question.ko', e.target.value)}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-400"
                    placeholder="자신에 대해 소개해 주세요."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">모범 답변 (베트남어) *</label>
                  <textarea
                    value={form.answer.vi}
                    onChange={e => setField('answer.vi', e.target.value)}
                    rows={4}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 resize-none"
                    placeholder="Xin chào, tôi tên là..."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">모범 답변 (한국어)</label>
                  <textarea
                    value={form.answer.ko}
                    onChange={e => setField('answer.ko', e.target.value)}
                    rows={3}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 resize-none"
                    placeholder="안녕하세요, 저는..."
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.question.vi.trim() || !form.answer.vi.trim()}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
