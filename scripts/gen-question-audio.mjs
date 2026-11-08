// 질문 음성(mp3) 생성 — ElevenLabs Text-to-Speech
// 실행:
//   node scripts/gen-question-audio.mjs --list-voices          # 베트남어 목소리 찾기 (공유 라이브러리)
//   node scripts/gen-question-audio.mjs --voice <voice_id>     # 질문 mp3 생성 (바뀐 질문만)
//   옵션: --model eleven_turbo_v2_5 (기본) / --force (전부 다시)
// API 키는 이 스크립트가 보내지 않음: 클라우드 환경에 저장된 키가 api.elevenlabs.io 요청에 자동으로 붙음.
// 로컬에서 돌릴 땐 ELEVENLABS_API_KEY 환경변수 사용.
// 결과: public/audio/q/<답변id>.mp3 + src/data/audio.js (음성이 있는 질문 목록)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { ANSWERS } from '../src/data/course.js'

const API = 'https://api.elevenlabs.io/v1'
const args = process.argv.slice(2)
const opt = (name, dflt) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : dflt
}
const MODEL = opt('--model', 'eleven_turbo_v2_5')
const FORCE = args.includes('--force')
const OUT = 'public/audio/q'
const MANIFEST = 'src/data/audio.js'

const headers = { 'Content-Type': 'application/json' }
if (process.env.ELEVENLABS_API_KEY) headers['xi-api-key'] = process.env.ELEVENLABS_API_KEY

async function call(path, body) {
  const res = await fetch(`${API}/${path}`, { method: body ? 'POST' : 'GET', headers, body: body && JSON.stringify(body) })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return res
}

if (args.includes('--list-voices')) {
  const res = await call('shared-voices?page_size=50&language=vi')
  const { voices } = await res.json()
  voices.forEach((v) =>
    console.log([v.voice_id, v.name, v.gender, v.accent, v.age, v.use_case, `${v.public_owner_id}`].join(' | ')),
  )
  process.exit(0)
}

const VOICE = opt('--voice')
if (!VOICE) throw new Error('--voice <voice_id> 가 필요해요 (--list-voices로 찾기)')

// 이전에 만든 목록 (문장·목소리가 바뀐 질문만 다시 생성)
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
  const res = await call(`text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    text: a.q.vi,
    model_id: MODEL,
    language_code: 'vi',
  })
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
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
console.log(`완료: ${Object.keys(done).length}개, 목소리 ${VOICE}, 모델 ${MODEL}`)
