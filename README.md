# Vietnamese OPIc Flashcard App (vnopic)

베트남어 OPIc 시험 준비용 플래시카드 앱. Claude AI로 문장 분석 기능 포함.

## 배경 / 의도

`opic-vn-im`(Supabase 연동 버전) 이전의 초기 버전 — 로컬 데이터 기반으로 빠르게 플래시카드 학습 흐름을 먼저 만들어본 프로토타입.

## 현재 상태

🟢 운영 중이었음 (port 3100) — AWS에서는 종료, 추후 다른 환경에서 이어서 작업 예정

## 사용 기술

| 항목 | 선택 |
|------|------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Express.js (`server.js`) |
| AI 분석 | Claude API (백엔드 프록시 경유) |

## 실행 방법

```bash
npm install
cp .env.example .env   # ANTHROPIC_API_KEY 입력
npm run dev             # 프론트엔드 (Vite)
npm start                # 백엔드 (port 3100)
```

## 관련 프로젝트

후속 버전인 `opic-vn-im`에서 Supabase 백엔드를 붙여 계속 개발 중.
