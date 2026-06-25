import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// .env 파일 읽기 (dotenv 없이 직접 파싱)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('❌ .env 파일에 ANTHROPIC_API_KEY가 없습니다.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${Buffer.from(file.originalname, 'latin1').toString('utf8')}`;
    cb(null, safeName);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ── Helpers ──────────────────────────────────────────────

const client = new Anthropic({ apiKey: API_KEY });

async function extractText(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  try {
    if (ext === '.pdf') {
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text || '';
    } else if (ext === '.pptx' || ext === '.ppt') {
      const { default: officeParser } = await import('officeparser');
      const text = await officeParser.parseOfficeAsync(filePath);
      return text || '';
    }
  } catch (e) {
    console.error('extractText error:', e.message);
  }
  return '';
}

async function askClaude(systemPrompt, userPrompt) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  return msg.content[0].text;
}

// ── Routes ──────────────────────────────────────────────

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: '파일이 없습니다.' });
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const text = await extractText(file.path, originalName);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const slideMatches = text.match(/(\n\s*\n|\f)/g);
    const estimatedSlides = Math.max(1, Math.min(slideMatches ? slideMatches.length : 1, 60));
    res.json({
      fileId: file.filename, originalName,
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      estimatedSlides, wordCount,
      textPreview: text.slice(0, 500),
      hasText: text.length > 50,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/transform', async (req, res) => {
  const { beforeFileId, beforeName, refFileId, refName, options } = req.body;
  try {
    const beforeText = await extractText(path.join(uploadDir, beforeFileId), beforeName);
    const refText = await extractText(path.join(uploadDir, refFileId), refName);
    const system = `당신은 HR 제안서 전문가입니다. 제안서의 장표를 분석하고 구조화된 JSON으로만 응답합니다. 마크다운 코드블록 없이 순수 JSON만 출력하세요.`;
    const prompt = `
[Before 제안서 내용]
${beforeText.slice(0, 3000)}

[Reference 제안서 내용]
${refText.slice(0, 2000)}

[변환 옵션]
- 변환 강도: ${options?.intensity || '레이아웃 중심'}
- 색상 기준: ${options?.color || '레퍼런스 색상 적용'}
- 출력 형식: ${options?.format || 'PPTX'}

위 Before 제안서를 분석하여 장표별 변환 결과를 JSON으로 반환하세요.

응답 형식:
{
  "totalSlides": 숫자,
  "completionScore": 0~100 숫자,
  "summary": "전체 변환 요약 2~3문장",
  "slides": [
    {
      "page": "1p",
      "title": "장표 제목",
      "originalType": "원본 장표 유형",
      "appliedLayout": "적용된 레이아웃 유형",
      "status": "완료",
      "reviewLevel": "낮음|보통|높음",
      "reviewNote": "검토 포인트 한 줄"
    }
  ],
  "improvements": ["개선사항 1", "개선사항 2", "개선사항 3"]
}`;
    const raw = await askClaude(system, prompt);
    let result;
    try { result = JSON.parse(raw); }
    catch { const m = raw.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : { error: '파싱 실패' }; }
    res.json(result);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

app.post('/api/search', async (req, res) => {
  const { query, fileIds, fileNames } = req.body;
  try {
    const texts = [];
    for (let i = 0; i < fileIds.length; i++) {
      const text = await extractText(path.join(uploadDir, fileIds[i]), fileNames[i]);
      texts.push({ name: fileNames[i], text: text.slice(0, 2000) });
    }
    const system = `당신은 HR 제안서 장표 검색 전문가입니다. 마크다운 코드블록 없이 순수 JSON만 출력하세요.`;
    const prompt = `
[검색어]
"${query}"

[업로드된 파일 내용]
${texts.map((t, i) => `=== 파일 ${i + 1}: ${t.name} ===\n${t.text}`).join('\n\n')}

위 파일들에서 검색어와 관련 있는 장표를 찾아 JSON으로 반환하세요.

응답 형식:
{
  "results": [
    {
      "fileName": "파일명",
      "page": "추정 페이지",
      "slideType": "장표 유형",
      "title": "장표 제목",
      "relevance": 0~100,
      "summary": "요약 1~2문장",
      "keywords": ["키워드1", "키워드2", "키워드3"]
    }
  ]
}
관련도 높은 순서로 최대 6개까지 반환하세요.`;
    const raw = await askClaude(system, prompt);
    let result;
    try { result = JSON.parse(raw); }
    catch { const m = raw.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : { results: [] }; }
    res.json(result);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

app.post('/api/diagnose', async (req, res) => {
  const { fileId, fileName } = req.body;
  try {
    const text = await extractText(path.join(uploadDir, fileId), fileName);
    const system = `당신은 HR 제안서 구조 진단 전문가입니다. KMA(한국능률협회) 기준의 HR 제안서 구조를 잘 알고 있습니다. 마크다운 코드블록 없이 순수 JSON만 출력하세요.`;
    const prompt = `
[제안서 내용]
${text.slice(0, 4000)}

위 제안서를 분석하여 구조 진단 결과를 JSON으로 반환하세요.

HR 제안서의 이상적인 구조:
표지 → 제안배경 → 고객과업이해 → HRD추진방향 → 교육체계설계 → 세부커리큘럼 → 운영프로세스 → 수행경험 → 기대효과 → 견적 → 부록

응답 형식:
{
  "completionScore": 0~100,
  "totalSlides": 추정 장표 수,
  "summary": "진단 요약 2문장",
  "currentFlow": [{ "idx": 번호, "label": "장표명", "type": "유형", "status": "ok|warning|duplicate", "note": null }],
  "recommendedFlow": [{ "idx": 번호, "label": "권장 장표명", "type": "유형", "status": "ok|missing|moved", "existsInCurrent": true }],
  "missingSlides": ["빠진 장표"],
  "comments": ["코멘트1", "코멘트2", "코멘트3"],
  "strengthPoints": ["잘 된 점1", "잘 된 점2"]
}`;
    const raw = await askClaude(system, prompt);
    let result;
    try { result = JSON.parse(raw); }
    catch { const m = raw.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : { error: '파싱 실패' }; }
    res.json(result);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// 1시간 지난 업로드 파일 자동 삭제
setInterval(() => {
  const files = fs.readdirSync(uploadDir);
  const now = Date.now();
  files.forEach(f => {
    const fp = path.join(uploadDir, f);
    if (now - fs.statSync(fp).mtimeMs > 3600000) fs.unlinkSync(fp);
  });
}, 600000);

// React 빌드 정적 서빙
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(PORT, () => console.log(`\n✦ KMA Server running on http://localhost:${PORT}\n`));