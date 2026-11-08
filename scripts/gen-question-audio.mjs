// 질문 음성(mp3) 생성 — Google Cloud Text-to-Speech
// 실행: node scripts/gen-question-audio.mjs [--voice vi-VN-...] [--force] [--list-voices]
// API 키는 이 스크립트가 보내지 않음: 클라우드 환경의 네트워크 시크릿(X-Goog-Api-Key)이
// texttospeech.googleapis.com 요청에 자동으로 붙음. 로컬에서 돌릴 땐 GOOGLE_TTS_KEY 환경변수 사용.
// 결과: public/audio/q/<답변id>.mp3 + src/data/audio.js (음성이 있는 질문 목록과 문장)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { ANSWERS } from '../src/data/course.js'

const API = 'https://texttospeech.googleapis.com/v1'
const args = process.argv.slice(2)
const opt = (name, dflt) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : dflt
}
const VOICE = opt('--voice', 'vi-VN-Neural2-A') // 기본: 여성, 북부 발음
const FORCE = args.includes('--force')
const OUT = 'public/audio/q'
const MANIFEST = 'src/data/audio.js'

const headers = { 'Content-Type': 'application/json' }
if (process.env.GOOGLE_TTS_KEY) headers['X-Goog-Api-Key'] = process.env.GOOGLE_TTS_KEY

async function call(path, body) {
  const res = await fetch(`${API}/${path}`, { method: body ? 'POST' : 'GET', headers, body: body && JSON.stringify(body) })
  const json = await res.json()
  if (!res.ok) throw new Error(`${res.status} ${json.error?.message ?? JSON.stringify(json)}`)
  return json
}

if (args.includes('--list-voices')) {
  const { voices } = await call('voices?languageCode=vi-VN')
  voices.forEach((v) => console.log(v.name, v.ssmlGender))
  process.exit(0)
}

// 이전에 만든 목록 (문장이 바뀐 질문만 다시 생성)
let prev = {}
if (existsSync(MANIFEST)) {
  const m = readFileSync(MANIFEST, 'utf8').match(/QUESTION_AUDIO = (\{[\s\S]*?\n\})/)
  if (m) prev = JSON.parse(m[1])
}

mkdirSync(OUT, { recursive: true })
const done = {}
for (const a of ANSWERS) {
  const file = `${OUT}/${a.id}.mp3`
  const same = prev[a.id]?.text === a.q.vi && prev[a.id]?.voice === VOICE && existsSync(file)
  if (same && !FORCE) {
    done[a.id] = prev[a.id]
    continue
  }
  const { audioContent } = await call('text:synthesize', {
    input: { text: a.q.vi },
    voice: { languageCode: 'vi-VN', name: VOICE },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
  })
  writeFileSync(file, Buffer.from(audioContent, 'base64'))
  done[a.id] = { text: a.q.vi, voice: VOICE }
  console.log('✓', a.id, a.q.vi)
}

writeFileSync(
  MANIFEST,
  `// 자동 생성: node scripts/gen-question-audio.mjs — 직접 고치지 말 것
// 음성 파일이 있는 질문 { [답변id]: { text, voice } }. 질문 문장이 바뀌면 스크립트를 다시 돌리면 그 질문만 새로 만듦
export const QUESTION_AUDIO = ${JSON.stringify(done, null, 2)}
`,
)
console.log(`완료: ${Object.keys(done).length}개, 음성 ${VOICE}`)
