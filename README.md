# KMA Proposal Transformer — 실행 가이드

## 구조
```
kma-full/
  server/   ← Node.js 백엔드 (파일 업로드 + Claude API)
  client/   ← React 프론트엔드
```

## 실행 방법 (터미널 2개 필요)

### 터미널 1 — 서버 실행
```
cd server
npm start
```
→ http://localhost:3001 에서 실행됨

### 터미널 2 — 클라이언트 실행
```
cd client
npm run dev
```
→ http://localhost:5173 브라우저에서 열기

## 사용 방법
1. 브라우저에서 http://localhost:5173 접속
2. 원하는 기능 페이지로 이동
3. 페이지 상단 🔑 Claude API 키 입력 (sk-ant-...)
4. 파일 업로드 후 분석 시작

## Claude API 키 발급
https://console.anthropic.com 접속 → API Keys → Create Key

## 주의사항
- 서버(터미널 1)가 먼저 실행되어 있어야 합니다
- 업로드 파일은 1시간 후 자동 삭제됩니다
- PPTX/PDF 파일의 텍스트를 추출하여 AI가 분석합니다
