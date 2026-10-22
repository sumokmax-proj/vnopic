import { Component } from 'react'

// 화면이 하얗게 비는 대신 오류 내용을 보여줌 (휴대폰에서 원인 파악용)
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <main className="app">
        <div className="screen">
          <h2>앗, 오류가 났어요</h2>
          <p className="muted small">진도는 그대로 저장되어 있어요. 이 화면을 캡처해서 알려주세요.</p>
          <pre className="error-box">
            {String(error?.message ?? error)}
            {'\n\n'}
            {navigator.userAgent}
            {'\n\n'}
            {String(error?.stack ?? '').split('\n').slice(0, 6).join('\n')}
          </pre>
          <button className="btn primary" onClick={() => location.reload()}>다시 시작</button>
        </div>
      </main>
    )
  }
}
