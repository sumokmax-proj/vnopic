import { useState } from 'react'

const CLAUDE_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

function safeParseJSON(raw) {
  // 1차: 그대로 파싱 시도
  try { return JSON.parse(raw) } catch (_) {}

  // 2차: 흔한 문제 자동 교정 후 재시도
  const fixed = raw
    // 스마트 따옴표 → 일반 쌍따옴표
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // JSON 값 위치의 홑따옴표 → 쌍따옴표
    // ": '...' 패턴을 ": "..." 로 변환 (내부 홑따옴표 이스케이프 없이)
    .replace(/:\s*'([^']*)'/g, (_, v) => `: "${v.replace(/"/g, '\\"')}"`)
    // trailing comma 제거
    .replace(/,\s*([}\]])/g, '$1')

  try { return JSON.parse(fixed) } catch (e) {
    throw new Error(`응답 파싱 실패: ${e.message}`)
  }
}

async function analyzeVietnamese(text) {
  if (!CLAUDE_KEY) throw new Error('VITE_ANTHROPIC_API_KEY가 .env에 설정되지 않았습니다.')

  const prompt = `다음 베트남어 OPIc 답변 문장을 분석해주세요:

"${text}"

한국어로 다음 4가지 항목을 분석해주세요:
1. 문장 구조: 주어/동사/목적어 등 구조와 특이한 어순 설명
2. 핵심 표현: 중요한 어구나 표현 3개 (베트남어 → 한국어 의미와 설명)
3. 어휘 분석: 주요 단어 5개 (단어, 품사, 의미)
4. 활용 예문: 같은 핵심 표현을 사용한 예문 2개 (베트남어 + 한국어 번역)

[중요] 반드시 아래 JSON 형식으로만 응답하세요. 규칙:
- 모든 문자열 값은 반드시 쌍따옴표(")로 감싸세요. 홑따옴표(') 사용 금지.
- JSON 외에 다른 텍스트, 설명, 코드블록 마커를 붙이지 마세요.
- 문자열 내부에 쌍따옴표가 필요하면 백슬래시로 이스케이프(\\")하세요.

{
  "structure": "문장 구조 설명 (2-3문장)",
  "expressions": [
    {"vi": "표현", "ko": "의미", "note": "사용 팁"}
  ],
  "vocabulary": [
    {"word": "단어", "pos": "품사", "meaning": "의미"}
  ],
  "examples": [
    {"vi": "베트남어 예문", "ko": "한국어 번역"}
  ]
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': CLAUDE_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API 오류 ${res.status}`)
  }

  const data = await res.json()
  const content = data.content?.[0]?.text || ''
  // 코드블록(```json ... ```) 또는 순수 JSON 모두 처리
  const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/(\{[\s\S]*\})/)
  if (!jsonMatch) throw new Error('응답에서 JSON을 찾을 수 없습니다')
  return safeParseJSON(jsonMatch[1] || jsonMatch[0])
}

export default function Analysis({ card, analysisCache }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const cacheKey = card.id

  const handleAnalyze = async () => {
    // Check cache first
    if (analysisCache.current.has(cacheKey)) {
      setResult(analysisCache.current.get(cacheKey))
      setOpen(true)
      return
    }

    setLoading(true)
    setError(null)
    setOpen(true)

    try {
      const data = await analyzeVietnamese(card.answer.vi)
      analysisCache.current.set(cacheKey, data)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = () => {
    if (!open && !result) {
      handleAnalyze()
    } else {
      setOpen(o => !o)
    }
  }

  const hasCached = analysisCache.current.has(cacheKey)

  return (
    <div className="w-full">
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${
          open
            ? 'bg-violet-600 text-white shadow-md'
            : 'bg-white border border-gray-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 shadow-sm'
        }`}
      >
        <span className="flex items-center gap-2">
          <span>🤖</span>
          <span>분석하기 (Phân tích AI)</span>
          {hasCached && <span className="text-xs opacity-70">(캐시됨)</span>}
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 bg-white rounded-xl border border-violet-100 shadow-sm overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Claude AI 분석 중...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl">
              <p className="font-semibold mb-1">⚠️ 오류 발생</p>
              <p>{error}</p>
              {!CLAUDE_KEY && (
                <p className="mt-2 text-xs text-red-500">
                  .env 파일에 VITE_ANTHROPIC_API_KEY를 설정해주세요.
                </p>
              )}
            </div>
          )}

          {result && !loading && (
            <div className="p-4 space-y-4 text-sm">
              {/* 문장 구조 */}
              <section>
                <h3 className="font-bold text-violet-700 mb-1.5 flex items-center gap-1.5">
                  <span>📐</span> 문장 구조
                </h3>
                <p className="text-gray-700 leading-relaxed bg-violet-50 rounded-lg px-3 py-2">
                  {result.structure}
                </p>
              </section>

              {/* 핵심 표현 */}
              {result.expressions?.length > 0 && (
                <section>
                  <h3 className="font-bold text-violet-700 mb-1.5 flex items-center gap-1.5">
                    <span>💡</span> 핵심 표현
                  </h3>
                  <div className="space-y-2">
                    {result.expressions.map((expr, i) => (
                      <div key={i} className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                        <span className="font-semibold text-amber-800">{expr.vi}</span>
                        <span className="text-gray-500 mx-2">→</span>
                        <span className="text-gray-700">{expr.ko}</span>
                        {expr.note && (
                          <p className="text-xs text-amber-600 mt-0.5">{expr.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 어휘 분석 */}
              {result.vocabulary?.length > 0 && (
                <section>
                  <h3 className="font-bold text-violet-700 mb-1.5 flex items-center gap-1.5">
                    <span>📚</span> 어휘 분석
                  </h3>
                  <div className="grid grid-cols-1 gap-1.5">
                    {result.vocabulary.map((v, i) => (
                      <div key={i} className="flex items-baseline gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                        <span className="font-semibold text-indigo-700 min-w-[80px]">{v.word}</span>
                        <span className="text-xs text-gray-400 bg-gray-200 rounded px-1">{v.pos}</span>
                        <span className="text-gray-600">{v.meaning}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 활용 예문 */}
              {result.examples?.length > 0 && (
                <section>
                  <h3 className="font-bold text-violet-700 mb-1.5 flex items-center gap-1.5">
                    <span>✏️</span> 활용 예문
                  </h3>
                  <div className="space-y-2">
                    {result.examples.map((ex, i) => (
                      <div key={i} className="bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                        <p className="text-green-800 font-medium">{ex.vi}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{ex.ko}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
