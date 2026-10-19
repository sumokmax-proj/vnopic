import { useRef, useState } from 'react'
import { exportBackup, parseBackup } from '../lib/progress.js'

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

// 진도 백업: 파일로 저장 / 파일에서 불러오기
export default function Backup({ state, onExported, onImported }) {
  const fileRef = useRef(null)
  const [msg, setMsg] = useState(null)

  const download = () => {
    const blob = new Blob([exportBackup(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vnopic-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    onExported()
    setMsg({ ok: true, text: '백업 파일을 저장했어요.' })
  }

  const upload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const restored = parseBackup(await file.text())
      const ok = window.confirm(
        `${restored.lap}회차 진도로 되돌릴까요?\n지금 이 기기의 진도는 백업 내용으로 바뀌어요.`,
      )
      if (!ok) return
      onImported(restored)
      setMsg({ ok: true, text: '진도를 불러왔어요.' })
    } catch (err) {
      setMsg({ ok: false, text: err.message })
    }
  }

  const last = formatDate(state.backupAt)

  return (
    <section className="backup">
      <h3 className="section-title">진도 백업</h3>
      <p className="muted small">
        진도는 이 휴대폰 브라우저에만 저장돼요. 가끔 파일로 저장해 두면 기기를 바꾸거나 브라우저 데이터가 지워져도 이어서 할 수 있어요.
        {last && ` (마지막 백업 ${last})`}
      </p>
      <div className="backup-actions">
        <button className="btn" onClick={download}>백업 파일 저장</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>백업 불러오기</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={upload} />
      </div>
      {msg && <p className={`small ${msg.ok ? 'ok-text' : 'err-text'}`}>{msg.text}</p>}
    </section>
  )
}
