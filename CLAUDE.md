# vnopic — 개발 가이드 (Claude용)

**작업 전 반드시 `docs/PLAN.md`를 읽을 것.** 기획의 기준 문서다.
- 기획과 다른 구현이 필요하면 사용자에게 먼저 확인하고, 합의되면 PLAN.md부터 고친다.
- 기능을 끝내면 PLAN.md 8장 로드맵 상태를 갱신한다.

## 앱 요약
베트남어 OPIc(NH→IM) 개인 학습 앱. 문장을 블록 조립으로 반복 암기.
핵심: **책갈피(이어하기) + 회차 반복 + 오답노트**. 압박 요소(목표량, 연속일, 타이머) 금지.
UI는 한국어, 학습 콘텐츠는 베트남어. 휴대폰 세로 화면 기준.

## 명령어
```bash
npm install
npm run dev      # 개발 서버
npm test         # 진도 로직 테스트 (vitest)
npm run build    # dist/ 생성 (정적 사이트)
```

## 구조
```
src/
├── data/course.js        # 콘텐츠: 주제 → 답변 → 문장(블록은 ' / '로 구분)
├── lib/course.js         # 코스 평탄화, 블록 분리/섞기
├── lib/progress.js       # 진도 상태(순수 함수) + localStorage 저장
├── lib/progress.test.js
├── components/Assemble.jsx  # 블록 조립 UI
├── components/Backup.jsx    # 진도 백업 파일 저장/불러오기
├── screens/Home.jsx      # 책갈피, 회차 진행, 목차, 오답노트 진입
├── screens/Study.jsx     # 코스 학습 / 오답 연습 (mode)
├── screens/Notes.jsx     # 오답노트
├── App.jsx               # 화면 전환 (라우터 없음, state로 관리)
└── styles.css
```

## 배포
GitHub Pages. `main`에 푸시하면 `.github/workflows/deploy.yml`이 테스트 → 빌드 → 배포.
주소: https://sumokmax-proj.github.io/vnopic/ (vite `base: './'`라 하위 경로에서도 동작)

## 규칙
- 백엔드 없음. 진도는 localStorage(`vnopic:progress`). 저장 구조를 바꾸면 `version`을 올리고 마이그레이션 작성.
- 진도 로직은 `lib/progress.js`의 순수 함수로만 바꾸고 테스트 추가.
- 콘텐츠 수정 시 문장 id(`답변id-번호`)는 유지 (진도 기록이 id에 묶여 있음).
- 커밋 메시지는 한국어.
