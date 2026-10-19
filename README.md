# vnopic — 베트남어 OPIc 학습 앱

> **목표:** 내가 재미있게 베트남어 OPIc을 공부하고 연습할 수 있는 앱

문장을 **블록 조립**으로 통째로 익히는 휴대폰용 웹앱.
**책갈피**로 어디까지 했는지 이어서 하고, 코스를 **회차**로 반복하면서 약한 문장을 **오답노트**에 모은다.

- **앱 주소: https://sumokmax-proj.github.io/vnopic/** (휴대폰에서 열고 "홈 화면에 추가")
- 기획서: [`docs/PLAN.md`](docs/PLAN.md)
- 개발 가이드: [`CLAUDE.md`](CLAUDE.md)

## 실행

```bash
npm install
npm run dev      # http://localhost:5173 (같은 와이파이의 휴대폰에서도 접속 가능)
npm test
npm run build    # dist/ 생성
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 테스트 → 빌드 → GitHub Pages 배포를 자동으로 합니다.
최초 1회만: 저장소 **Settings → Pages → Source를 "GitHub Actions"** 로 설정.

## 이전 버전
- v1 프로토타입: 이 저장소 커밋 `c9aadc5`
- v2 (시험 모드, 프로필 맞춤화, Supabase): `sumokmax-proj/opic-vn-im`
