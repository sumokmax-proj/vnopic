import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = parseInt(process.env.PORT || '3100', 10)
const DIST = join(__dirname, 'dist')

if (!existsSync(DIST)) {
  console.error('[vnopic] dist/ 폴더가 없습니다. npm run build 를 먼저 실행하세요.')
  process.exit(1)
}

const app = express()

/* ── Security headers ────────────────────────── */
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  // Allow Anthropic API calls from browser (AI analysis feature)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://api.anthropic.com; " +
    "img-src 'self' data:;"
  )
  next()
})

/* ── Static assets (hashed filenames → long cache) ── */
app.use('/assets', express.static(join(DIST, 'assets'), {
  maxAge: '1y',
  immutable: true,
}))

/* ── Other static files (short cache) ── */
app.use(express.static(DIST, {
  maxAge: '1h',
  index: false, // we handle / ourselves for SPA
}))

/* ── Health check ── */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, ts: new Date().toISOString() })
})

/* ── SPA fallback: all routes → index.html ── */
app.get('*', (req, res) => {
  res.sendFile(join(DIST, 'index.html'))
})

/* ── Error handler ── */
app.use((err, req, res, _next) => {
  console.error('[vnopic] 서버 오류:', err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🇻🇳  vnopic 서버 시작`)
  console.log(`   Local  : http://localhost:${PORT}`)
  console.log(`   Network: http://0.0.0.0:${PORT}`)
  console.log(`   Env    : production\n`)
})

process.on('SIGTERM', () => { console.log('[vnopic] SIGTERM 수신 — 종료'); process.exit(0) })
process.on('SIGINT',  () => { console.log('[vnopic] SIGINT 수신 — 종료');  process.exit(0) })
