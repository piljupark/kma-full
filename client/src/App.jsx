import { useState } from "react";

const API = "/api";

const C = {
  navy: "#0F1B3D", deepBlue: "#1A3A8F", blueViolet: "#4C3BCF",
  purple: "#6B4FBB", softViolet: "#A78BFA", cyan: "#38BDF8",
  lavender: "#EEF0FF", paleBg: "#F4F7FF", lightGray: "#F8F9FC",
  coolGray: "#64748B", navyBlack: "#0D1B2A", white: "#FFFFFF",
  border: "#E2E8F0", success: "#10B981", warning: "#F59E0B", danger: "#EF4444",
};

// ── Dummy Data ─────────────────────────────────────────────────────────────

const DUMMY_STATS = [
  { label: "이번 주 변환", value: "7", unit: "건", color: C.blueViolet, bg: C.lavender },
  { label: "검색된 장표", value: "43", unit: "장", color: C.purple, bg: "#F3F0FF" },
  { label: "구조 진단", value: "3", unit: "건", color: "#0891B2", bg: "#E0F7FA" },
  { label: "검토 필요", value: "5", unit: "장", color: C.warning, bg: "#FFF9E6" },
];

const DUMMY_RECENT = [
  { id: 1, name: "A사 리더십 교육 제안서", badge: "PPTX 다운로드", badgeColor: C.success, date: "오늘 14:23", icon: "📊" },
  { id: 2, name: "B사 온보딩 프로그램 제안서", badge: "3장 검토 필요", badgeColor: C.warning, date: "오늘 11:05", icon: "📊" },
  { id: 3, name: "조직문화 진단 제안서", badge: "리포트 보기", badgeColor: C.blueViolet, date: "어제 16:30", icon: "📋" },
  { id: 4, name: "KMA 공통 HR 템플릿", badge: "열기", badgeColor: C.purple, date: "어제 09:15", icon: "📁" },
];

const DUMMY_SEARCH_RESULTS = [
  { id: 1, fileName: "2024_A사_신입사원교육제안서.pptx", page: "12p", slideType: "교육체계도", title: "신입사원 온보딩 교육체계", relevance: 96, summary: "신입사원 온보딩 과정의 단계별 교육 흐름을 보여주는 장표입니다. 입문→직무→현업적응 3단계 구성.", keywords: ["온보딩", "신입사원", "교육체계", "단계별"] },
  { id: 2, fileName: "B사_온보딩프로그램_제안서.pdf", page: "8p", slideType: "커리큘럼", title: "온보딩 프로그램 구성", relevance: 91, summary: "입문교육, 직무교육, 멘토링을 3단계로 구성한 장표입니다. 각 단계별 기간과 목표 명시.", keywords: ["커리큘럼", "3단계", "멘토링", "직무교육"] },
  { id: 3, fileName: "KMA_공통_HR제안템플릿.pptx", page: "21p", slideType: "프로세스", title: "교육 설계 및 운영 프로세스", relevance: 88, summary: "교육 설계부터 운영, 평가까지 전체 흐름을 시각화한 장표입니다.", keywords: ["프로세스", "운영", "평가", "설계"] },
  { id: 4, fileName: "C사_리더십개발_제안.pptx", page: "5p", slideType: "추진전략", title: "리더십 역량 개발 전략", relevance: 82, summary: "리더십 역량 모델 기반의 단계별 개발 방향을 제시하는 장표입니다.", keywords: ["리더십", "역량", "전략", "개발"] },
  { id: 5, fileName: "조직문화진단_보고서.pdf", page: "3p", slideType: "현황분석", title: "조직문화 현황 진단 결과", relevance: 76, summary: "구성원 대상 설문 기반 조직문화 진단 결과를 정리한 장표입니다.", keywords: ["진단", "설문", "조직문화", "현황"] },
];

const DUMMY_LIBRARY = [
  { fileId: "lib1", originalName: "2024_A사_신입사원교육제안서.pptx", estimatedSlides: 24, size: "3.2MB" },
  { fileId: "lib2", originalName: "KMA_공통_HR제안템플릿.pptx", estimatedSlides: 32, size: "5.1MB" },
  { fileId: "lib3", originalName: "B사_온보딩프로그램_제안서.pdf", estimatedSlides: 18, size: "2.8MB" },
];

const DUMMY_SLIDES = [
  { page: "1p", title: "표지", originalType: "표지형", appliedLayout: "표지형", reviewLevel: "낮음", reviewNote: null },
  { page: "2p", title: "목차", originalType: "목차형", appliedLayout: "목차형", reviewLevel: "낮음", reviewNote: null },
  { page: "3p", title: "제안 배경", originalType: "본문형", appliedLayout: "2단 구성형", reviewLevel: "보통", reviewNote: "텍스트 분량 재조정 필요" },
  { page: "4p", title: "고객 과업 이해", originalType: "현황분석형", appliedLayout: "비교표형", reviewLevel: "낮음", reviewNote: null },
  { page: "5p", title: "HRD 추진 방향", originalType: "추진전략형", appliedLayout: "프로세스형", reviewLevel: "낮음", reviewNote: null },
  { page: "6p", title: "교육체계 설계", originalType: "교육체계형", appliedLayout: "교육체계형", reviewLevel: "높음", reviewNote: "도형 재배치 및 색상 보정 확인 필요" },
  { page: "7p", title: "세부 커리큘럼", originalType: "커리큘럼형", appliedLayout: "표형", reviewLevel: "보통", reviewNote: "표 열 너비 조정 권장" },
  { page: "8p", title: "운영 프로세스", originalType: "프로세스형", appliedLayout: "프로세스형", reviewLevel: "낮음", reviewNote: null },
  { page: "9p", title: "기대효과", originalType: "기대효과형", appliedLayout: "2단 구성형", reviewLevel: "낮음", reviewNote: null },
  { page: "10p", title: "견적", originalType: "예산형", appliedLayout: "표형", reviewLevel: "보통", reviewNote: "금액 포맷 통일 필요" },
];

const DUMMY_CUR_FLOW = [
  { idx: 1, label: "표지", type: "표지형", status: "ok" },
  { idx: 2, label: "회사소개", type: "회사소개형", status: "warning" },
  { idx: 3, label: "교육과정 소개", type: "커리큘럼형", status: "ok" },
  { idx: 4, label: "견적", type: "예산형", status: "warning" },
  { idx: 5, label: "기대효과", type: "기대효과형", status: "ok" },
];

const DUMMY_REC_FLOW = [
  { idx: 1, label: "표지", type: "표지형", status: "ok" },
  { idx: 2, label: "제안 배경", type: "제안배경형", status: "missing" },
  { idx: 3, label: "고객 과업 이해", type: "과업이해형", status: "missing" },
  { idx: 4, label: "HRD 추진 방향", type: "추진전략형", status: "missing" },
  { idx: 5, label: "교육체계 설계", type: "교육체계형", status: "ok" },
  { idx: 6, label: "세부 커리큘럼", type: "커리큘럼형", status: "moved" },
  { idx: 7, label: "수행 경험", type: "사례소개형", status: "missing" },
  { idx: 8, label: "기대효과", type: "기대효과형", status: "moved" },
  { idx: 9, label: "견적", type: "예산형", status: "moved" },
  { idx: 10, label: "부록", type: "부록형", status: "missing" },
];

const TRANSFORM_STEPS = [
  "장표 분해 중",
  "텍스트·표·도형 분석 중",
  "Reference 레이아웃 추출 중",
  "장표 유형 매칭 중",
  "PPTX 초안 생성 중",
];

const FILTER_TAGS = ["표지", "목차", "회사소개", "제안배경", "과업이해", "추진전략", "교육체계", "커리큘럼", "일정표", "운영방안", "강사진", "예산", "기대효과", "제안요약", "부록"];

// ── Shared Components ──────────────────────────────────────────────────────

function Tag({ children, color = C.blueViolet, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: small ? "2px 8px" : "4px 11px", borderRadius: 99,
      background: color + "18", color,
      fontSize: small ? 10 : 11, fontWeight: 700,
      letterSpacing: "-0.01em", border: `1px solid ${color}28`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Card({ children, style = {}, onClick, hoverable }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hoverable && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white,
        border: `1px solid ${hov ? C.blueViolet + "55" : C.border}`,
        borderRadius: 16,
        boxShadow: hov ? "0 8px 32px rgba(76,59,207,0.11)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.15s, border-color 0.15s",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}>{children}</div>
  );
}

function Btn({ children, onClick, primary, ghost, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "11px 20px", borderRadius: 10,
      border: `1px solid ${disabled ? C.border : primary ? "transparent" : ghost ? C.blueViolet + "50" : C.border}`,
      background: disabled ? C.lightGray
        : primary ? `linear-gradient(135deg,${C.blueViolet},${C.purple})`
        : ghost ? C.lavender : C.white,
      color: disabled ? C.coolGray : primary ? C.white : ghost ? C.blueViolet : C.navyBlack,
      fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: "-0.02em", whiteSpace: "nowrap", ...style,
    }}>{children}</button>
  );
}

function Spinner({ size = 34 }) {
  return (
    <>
      <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: size, height: size, borderRadius: "50%", border: `3px solid ${C.lavender}`, borderTopColor: C.blueViolet, animation: "_spin 0.8s linear infinite", flexShrink: 0 }} />
    </>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return <div style={{ background: C.danger + "12", border: `1px solid ${C.danger}40`, borderRadius: 10, padding: "12px 16px", color: C.danger, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>⚠ {msg}</div>;
}

function PageHeader({ eyebrow, title, accent, sub }) {
  const idx = accent ? title.indexOf(accent) : -1;
  return (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "38px 72px 34px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontSize: 10, color: C.blueViolet, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>{eyebrow}</div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.navyBlack, letterSpacing: "-0.045em", margin: "0 0 12px", lineHeight: 1.2 }}>
          {idx >= 0
            ? <>{title.slice(0, idx)}<span style={{ color: C.blueViolet }}>{accent}</span>{title.slice(idx + accent.length)}</>
            : title}
        </h1>
        {sub && <p style={{ fontSize: 14, color: C.coolGray, letterSpacing: "-0.01em", lineHeight: 1.65, margin: 0 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── File Upload Card ───────────────────────────────────────────────────────

function FileUploadCard({ title, subtitle, fileInfo, onUpload, loading, accent = C.blueViolet }) {
  const [drag, setDrag] = useState(false);

  const handle = async (file) => {
    if (!file) return;
    onUpload(null, true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API}/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onUpload(data, false);
    } catch (e) { onUpload(null, false, e.message); }
  };

  return (
    <Card style={{ padding: 24, flex: 1 }}>
      <Tag color={accent} small>PPTX / PDF</Tag>
      <div style={{ fontSize: 15, fontWeight: 800, color: C.navyBlack, letterSpacing: "-0.035em", marginTop: 10, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.coolGray, marginBottom: 16, letterSpacing: "-0.01em" }}>{subtitle}</div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 0", gap: 12 }}>
          <Spinner /><div style={{ fontSize: 12, color: C.coolGray }}>분석 중...</div>
        </div>
      ) : fileInfo ? (
        <div style={{ background: C.paleBg, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <div style={{ width: 44, height: 34, background: C.lavender, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {fileInfo.originalName?.endsWith(".pdf") ? "📕" : "📊"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navyBlack, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileInfo.originalName}</div>
              <div style={{ fontSize: 11, color: C.coolGray, marginTop: 2 }}>{fileInfo.estimatedSlides}장 추정 · {fileInfo.size}</div>
            </div>
          </div>
          {fileInfo.textPreview && (
            <div style={{ background: C.white, borderRadius: 8, padding: "8px 10px", fontSize: 10, color: C.coolGray, lineHeight: 1.6, maxHeight: 52, overflow: "hidden", marginBottom: 10 }}>
              {fileInfo.textPreview.slice(0, 160)}...
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tag color={C.success} small>✓ 업로드 완료</Tag>
            <button onClick={() => onUpload(null, false)} style={{ background: "none", border: "none", fontSize: 11, color: C.coolGray, cursor: "pointer", fontWeight: 600 }}>다시 선택</button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${drag ? accent : C.border}`, borderRadius: 12, padding: "38px 16px", cursor: "pointer", background: drag ? accent + "08" : "transparent", transition: "all 0.15s" }}>
          <input type="file" accept=".pptx,.ppt,.pdf" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
          <div style={{ fontSize: 34, marginBottom: 10 }}>⬆</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.02em" }}>파일을 끌어오거나 클릭</div>
          <div style={{ fontSize: 11, color: C.coolGray, marginTop: 4 }}>PPTX · PPT · PDF · 최대 50MB</div>
        </label>
      )}
    </Card>
  );
}

// ── NavBar ─────────────────────────────────────────────────────────────────

function NavBar({ page, setPage }) {
  const menus = [
    { id: "transform", label: "제안서 스타일 변환" },
    { id: "search", label: "장표 검색" },
    { id: "diagnosis", label: "구조 진단" },
  ];
  return (
    <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 72px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => setPage("home")}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${C.blueViolet},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: C.white, fontWeight: 900 }}>K</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.navyBlack, letterSpacing: "-0.04em", lineHeight: 1.1 }}>KMA Proposal Transformer</div>
          <div style={{ fontSize: 9, color: C.coolGray, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Proposal Workspace</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 2, background: C.lightGray, borderRadius: 12, padding: 4 }}>
        {menus.map(m => (
          <button key={m.id} onClick={() => setPage(m.id)} style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: page === m.id ? `linear-gradient(135deg,${C.blueViolet},${C.purple})` : "transparent", color: page === m.id ? C.white : C.coolGray, fontSize: 13, fontWeight: page === m.id ? 700 : 500, cursor: "pointer", letterSpacing: "-0.02em", transition: "all 0.15s" }}>{m.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {["작업 이력", "템플릿 관리", "관리자"].map(l => (
          <button key={l} style={{ background: "none", border: "none", fontSize: 12, color: C.coolGray, cursor: "pointer", padding: "6px 10px", borderRadius: 8, fontWeight: 500, letterSpacing: "-0.02em" }}>{l}</button>
        ))}
        <div style={{ width: 1, height: 20, background: C.border, margin: "0 8px" }} />
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.blueViolet},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.white, fontWeight: 700, cursor: "pointer" }}>김</div>
      </div>
    </nav>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <div style={{ minHeight: "100vh", background: C.paleBg }}>
      <div style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.deepBlue} 50%,${C.blueViolet} 100%)`, padding: "72px 72px 80px", position: "relative", overflow: "hidden" }}>
        {[[280, -50, 360], [-70, 180, 260], [520, 270, 200]].map(([x, y, s], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: C.softViolet, opacity: 0.06, pointerEvents: "none" }} />
        ))}
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 99, padding: "5px 14px", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.softViolet, display: "inline-block" }} />
              <span style={{ fontSize: 10, color: C.softViolet, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>AI Proposal Workspace</span>
            </div>
            <h1 style={{ fontSize: 46, fontWeight: 900, color: C.white, lineHeight: 1.15, letterSpacing: "-0.045em", margin: "0 0 20px" }}>
              흩어진 제안서를<br />
              <span style={{ color: C.softViolet }}>AI가 읽고,</span> 정리하고,<br />
              다시 디자인합니다
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, letterSpacing: "-0.01em", marginBottom: 36 }}>
              Before 제안서와 Reference 파일을 업로드하면,<br />KMA 제안서 업무 흐름에 맞는 수정 가능한 PPTX 초안을 생성합니다.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setPage("transform")} style={{ background: C.softViolet, color: C.white, border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.02em", boxShadow: "0 4px 20px rgba(167,139,250,0.35)" }}>
                제안서 변환 시작하기 →
              </button>
              <button onClick={() => setPage("search")} style={{ background: "rgba(255,255,255,0.1)", color: C.white, border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "-0.02em" }}>
                장표 검색하기
              </button>
            </div>
          </div>

          <div style={{ position: "relative", height: 270 }}>
            <div style={{ position: "absolute", left: 0, top: 28, width: 158, padding: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 16, backdropFilter: "blur(8px)" }}>
              <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: 99, padding: "3px 10px", fontSize: 9, color: C.white, fontWeight: 700, display: "inline-block", marginBottom: 10, letterSpacing: "0.07em" }}>BEFORE</div>
              <div style={{ height: 66, background: "rgba(255,255,255,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>📄</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>기존 PPT / PDF</div>
            </div>
            <div style={{ position: "absolute", left: "50%", top: 6, transform: "translateX(-50%)", background: C.blueViolet, borderRadius: 99, padding: "5px 14px", fontSize: 9, color: C.white, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(76,59,207,0.5)", letterSpacing: "0.07em" }}>✦ AI MATCHING</div>
            <div style={{ position: "absolute", left: "50%", top: 48, transform: "translateX(-50%)", width: 148, padding: 14, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(167,139,250,0.45)", borderRadius: 16, zIndex: 2, backdropFilter: "blur(8px)", boxShadow: "0 8px 32px rgba(76,59,207,0.22)" }}>
              <div style={{ background: "rgba(167,139,250,0.22)", borderRadius: 99, padding: "3px 10px", fontSize: 9, color: C.softViolet, fontWeight: 700, display: "inline-block", marginBottom: 10, letterSpacing: "0.07em" }}>REFERENCE</div>
              <div style={{ height: 66, background: "rgba(255,255,255,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🗂</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>스타일 레퍼런스</div>
            </div>
            <div style={{ position: "absolute", right: 0, top: 28, width: 158, padding: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 16, backdropFilter: "blur(8px)" }}>
              <div style={{ background: "rgba(16,185,129,0.18)", borderRadius: 99, padding: "3px 10px", fontSize: 9, color: "#34D399", fontWeight: 700, display: "inline-block", marginBottom: 10, letterSpacing: "0.07em" }}>AFTER ✓</div>
              <div style={{ height: 66, background: "rgba(255,255,255,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>✨</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>변환된 PPTX</div>
            </div>
            <div style={{ position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {["Style Mapping", "Layout Extract"].map(t => (
                <div key={t} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 99, padding: "3px 10px", fontSize: 9, color: "rgba(255,255,255,0.55)", fontWeight: 600, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 72px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 44 }}>
          {DUMMY_STATS.map(s => (
            <Card key={s.label} style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: "-0.04em" }}>{s.value}</span>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.navyBlack, letterSpacing: "-0.05em", lineHeight: 1 }}>{s.value}<span style={{ fontSize: 13 }}>{s.unit}</span></div>
                <div style={{ fontSize: 11, color: C.coolGray, marginTop: 3 }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 10, color: C.blueViolet, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>핵심 기능</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.95fr 1fr", gap: 16, alignItems: "start" }}>
            {[
              { id: "transform", icon: "✦", label: "제안서 스타일 변환", desc: "Before PPT와 Reference를 업로드하면 AI가 레이아웃을 분석해 PPTX 변환 리포트를 생성합니다.", color: C.blueViolet, mt: 0, badge: "가장 많이 사용" },
              { id: "search", icon: "⊕", label: "장표 검색", desc: "여러 PPT/PDF 안에서 원하는 장표를 자연어로 검색해 위치를 찾아줍니다.", color: C.purple, mt: 22 },
              { id: "diagnosis", icon: "◈", label: "구조 진단", desc: "HR 제안서 관점에서 흐름, 누락 장표, 완성도 점수를 분석하고 추천 구조를 제시합니다.", color: "#0891B2", mt: 10 },
            ].map(f => (
              <Card key={f.id} hoverable style={{ padding: 28, marginTop: f.mt }} onClick={() => setPage(f.id)}>
                {f.badge && <div style={{ marginBottom: 12 }}><Tag color={C.success} small>{f.badge}</Tag></div>}
                <div style={{ width: 46, height: 46, borderRadius: 14, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: f.color, fontWeight: 900, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.navyBlack, letterSpacing: "-0.035em", marginBottom: 8 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: C.coolGray, lineHeight: 1.65, letterSpacing: "-0.01em" }}>{f.desc}</div>
                <div style={{ marginTop: 20, fontSize: 12, color: f.color, fontWeight: 700 }}>시작하기 →</div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: C.blueViolet, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>최근 작업</div>
            <button style={{ background: "none", border: "none", fontSize: 12, color: C.coolGray, cursor: "pointer", fontWeight: 600 }}>전체 보기 →</button>
          </div>
          <Card>
            {DUMMY_RECENT.map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < DUMMY_RECENT.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.lavender, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: C.coolGray, marginTop: 2 }}>{item.date}</div>
                </div>
                <Tag color={item.badgeColor} small>{item.badge}</Tag>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Transform Page ─────────────────────────────────────────────────────────

const INTS = ["가볍게 정리", "레이아웃 중심", "디자인 적극 반영"];
const COLS = ["원본 색상 유지", "레퍼런스 색상 적용", "KMA 브랜드 톤"];
const FMTS = ["PPTX", "PDF", "PPTX+PDF"];

function TransformPage() {
  const [beforeInfo, setBeforeInfo] = useState(null);
  const [beforeLoading, setBL] = useState(false);
  const [refInfo, setRefInfo] = useState(null);
  const [refLoading, setRL] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [colorMode, setColorMode] = useState(1);
  const [fmt, setFmt] = useState(0);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const hBefore = (info, loading, err) => {
    setBL(loading);
    if (err) setError(err);
    else if (!loading) setBeforeInfo(info);
  };
  const hRef = (info, loading, err) => {
    setRL(loading);
    if (err) setError(err);
    else if (!loading) setRefInfo(info);
  };

  const run = () => {
    setResult(null); setError(""); setStep(0);
    TRANSFORM_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setStep(i);
        if (i === TRANSFORM_STEPS.length - 1) {
          setTimeout(() => {
            setStep(5);
            setResult({
              completionScore: 87,
              summary: "Before 제안서 10개 장표를 Reference 스타일로 변환했습니다. 전반적으로 레이아웃 통일성이 향상되었으며, 2개 장표에서 검토가 필요합니다.",
              improvements: ["제안 배경 장표에 2단 레이아웃 적용으로 가독성 향상", "교육체계 장표 도형 정렬 및 색상 통일 확인 필요", "견적 표 폰트 크기 및 여백 재조정 권장"],
              slides: DUMMY_SLIDES,
            });
          }, 800);
        }
      }, i * 680);
    });
  };

  const running = step >= 0 && step < 5;
  const rc = r => r === "높음" ? C.danger : r === "보통" ? C.warning : C.success;

  return (
    <div style={{ minHeight: "100vh", background: C.paleBg }}>
      <PageHeader eyebrow="제안서 스타일 변환" title="Before 제안서를 Reference 스타일로 다시 구성합니다" accent="Reference 스타일" sub="기존 제안서의 내용과 맥락은 유지하고, 레이아웃·색상·표·도형 스타일을 레퍼런스 기준으로 정리합니다." />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 72px" }}>
        <ErrorBox msg={error} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 76px 1fr", gap: 14, alignItems: "center", marginBottom: 24 }}>
          <FileUploadCard title="Before 제안서" subtitle="변환할 기존 제안서 파일" fileInfo={beforeInfo} onUpload={hBefore} loading={beforeLoading} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.blueViolet},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.white, fontWeight: 700, boxShadow: "0 4px 14px rgba(76,59,207,0.28)" }}>AI</div>
            <div style={{ fontSize: 20, color: C.border }}>→</div>
          </div>
          <FileUploadCard title="Reference 제안서" subtitle="따라 하고 싶은 스타일의 파일" fileInfo={refInfo} onUpload={hRef} loading={refLoading} accent={C.purple} />
        </div>

        <Card style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.coolGray, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 18 }}>변환 옵션</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {[{ label: "변환 강도", opts: INTS, val: intensity, set: setIntensity }, { label: "색상 기준", opts: COLS, val: colorMode, set: setColorMode }, { label: "출력 형식", opts: FMTS, val: fmt, set: setFmt }].map(g => (
              <div key={g.label}>
                <div style={{ fontSize: 11, color: C.coolGray, fontWeight: 700, marginBottom: 10 }}>{g.label}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {g.opts.map((o, i) => (
                    <button key={o} onClick={() => g.set(i)} style={{ flex: 1, padding: "8px 4px", borderRadius: 9, fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1px solid ${g.val === i ? C.blueViolet : C.border}`, background: g.val === i ? C.blueViolet : "transparent", color: g.val === i ? C.white : C.coolGray, transition: "all 0.1s", letterSpacing: "-0.01em" }}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {step === -1 && !result && (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Btn primary onClick={run} disabled={!beforeInfo || !refInfo} style={{ padding: "15px 56px", fontSize: 15 }}>
              {!beforeInfo || !refInfo ? "파일을 모두 업로드해주세요" : "✦ AI 변환 시작하기"}
            </Btn>
          </div>
        )}

        {running && (
          <Card style={{ padding: 32, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.03em", marginBottom: 28 }}>AI 분석 진행 중</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TRANSFORM_STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, opacity: i > step ? 0.32 : 1, transition: "opacity 0.3s" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${done ? C.success : active ? C.blueViolet : C.border}`, background: done ? C.success : active ? C.blueViolet + "14" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                      {done ? <span style={{ color: C.white, fontSize: 12 }}>✓</span> : active ? <Spinner size={14} /> : <span style={{ fontSize: 10, color: C.coolGray, fontWeight: 700 }}>{i + 1}</span>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.blueViolet : done ? C.navyBlack : C.coolGray, letterSpacing: "-0.02em" }}>{s}</span>
                    {done && <Tag color={C.success} small>완료</Tag>}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {result && (
          <>
            <Card style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 28 }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ width: 96, height: 96, borderRadius: "50%", background: `conic-gradient(${C.blueViolet} 0% ${result.completionScore}%, ${C.border} ${result.completionScore}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: C.blueViolet, letterSpacing: "-0.04em" }}>{result.completionScore}</span>
                      <span style={{ fontSize: 9, color: C.coolGray }}>점</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.coolGray, marginTop: 10 }}>변환 완성도</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.navyBlack, lineHeight: 1.7, marginBottom: 14, letterSpacing: "-0.01em" }}>{result.summary}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {result.improvements?.map((imp, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.navyBlack, background: C.lavender, borderRadius: 9, padding: "9px 14px", letterSpacing: "-0.01em" }}>💡 {imp}</div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.03em", marginBottom: 20 }}>장표 비교 미리보기</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 1fr", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: C.coolGray, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Before</div>
                  <div style={{ height: 156, background: C.lightGray, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 34 }}>📄</div>
                    <div style={{ fontSize: 11, color: C.coolGray }}>{beforeInfo?.originalName || "원본 제안서"}</div>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${C.blueViolet},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                    <span style={{ color: C.white, fontSize: 14 }}>✦</span>
                  </div>
                  <div style={{ fontSize: 9, color: C.blueViolet, fontWeight: 700 }}>AI 변환</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.success, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>After</div>
                  <div style={{ height: 156, background: C.success + "08", borderRadius: 12, border: `1px solid ${C.success}30`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 34 }}>✨</div>
                    <div style={{ fontSize: 11, color: C.success, fontWeight: 600 }}>변환 완료 · PPTX</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.03em" }}>장표별 변환 리포트</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Tag color={C.success} small>완료 {result.slides.filter(s => s.reviewLevel === "낮음").length}장</Tag>
                  <Tag color={C.warning} small>검토 {result.slides.filter(s => s.reviewLevel !== "낮음").length}장</Tag>
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>{["페이지", "장표 제목", "원본 유형", "적용 레이아웃", "검토 필요"].map(h => (
                    <th key={h} style={{ textAlign: "left", fontSize: 10, color: C.coolGray, letterSpacing: "0.05em", textTransform: "uppercase", padding: "0 10px 12px 0", fontWeight: 700 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {result.slides.map((s, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px 10px 10px 0", fontSize: 12, fontWeight: 700, color: C.navyBlack }}>{s.page}</td>
                      <td style={{ padding: "10px 10px 10px 0", fontSize: 13, fontWeight: 600, color: C.navyBlack, letterSpacing: "-0.01em", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</td>
                      <td style={{ padding: "10px 10px 10px 0" }}><Tag color={C.coolGray} small>{s.originalType}</Tag></td>
                      <td style={{ padding: "10px 10px 10px 0" }}><Tag color={C.blueViolet} small>{s.appliedLayout}</Tag></td>
                      <td style={{ padding: "10px 0" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <Tag color={rc(s.reviewLevel)} small>{s.reviewLevel}</Tag>
                          {s.reviewNote && <div style={{ fontSize: 10, color: C.coolGray }}>{s.reviewNote}</div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary style={{ padding: "13px 32px" }}>⬇ PPTX 다운로드</Btn>
              <Btn style={{ padding: "13px 24px" }}>PDF 다운로드</Btn>
              <Btn style={{ padding: "13px 24px" }}>검토 필요 장표만 보기</Btn>
              <Btn onClick={() => { setResult(null); setStep(-1); setBeforeInfo(null); setRefInfo(null); }} style={{ padding: "13px 24px" }}>다시 변환하기</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Search Page ────────────────────────────────────────────────────────────

function SearchPage() {
  const [files, setFiles] = useState(DUMMY_LIBRARY);
  const [fileLoading, setFL] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilters, setAF] = useState([]);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const addFile = async (file) => {
    setFL(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API}/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiles(prev => [...prev, data]);
    } catch (e) { setError(e.message); }
    finally { setFL(false); }
  };

  const search = () => {
    if (!query.trim() || files.length === 0) return;
    setSearching(true); setResults(null); setSelected(null); setError("");
    const realFiles = files.filter(f => !f.fileId.startsWith("lib"));
    if (realFiles.length > 0) {
      const q = activeFilters.length > 0 ? `${query} (유형: ${activeFilters.join(", ")})` : query;
      fetch(`${API}/search`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q, fileIds: realFiles.map(f => f.fileId), fileNames: realFiles.map(f => f.originalName) }) })
        .then(r => r.json())
        .then(data => { if (data.error) throw new Error(data.error); setResults(data.results || []); })
        .catch(e => { setError(e.message); setResults(DUMMY_SEARCH_RESULTS); })
        .finally(() => setSearching(false));
    } else {
      setTimeout(() => { setResults(DUMMY_SEARCH_RESULTS); setSearching(false); }, 1200);
    }
  };

  const rc = r => r >= 85 ? C.success : r >= 70 ? C.warning : C.coolGray;

  return (
    <div style={{ minHeight: "100vh", background: C.paleBg }}>
      <PageHeader eyebrow="장표 검색" title="예전에 만든 좋은 장표, 파일을 뒤지지 않고 찾습니다" accent="파일을 뒤지지 않고" sub="여러 PPT/PDF 파일을 업로드하면 AI가 각 장표를 분석해 원하는 장표의 위치를 찾아줍니다." />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 72px" }}>
        <ErrorBox msg={error} />

        <Card style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.02em" }}>파일 라이브러리</div>
              <div style={{ fontSize: 11, color: C.coolGray, marginTop: 2 }}>{files.length}개 파일 · 분석 완료</div>
            </div>
            <label style={{ background: `linear-gradient(135deg,${C.blueViolet},${C.purple})`, color: C.white, borderRadius: 9, padding: "9px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em" }}>
              + 파일 추가
              <input type="file" accept=".pptx,.ppt,.pdf" style={{ display: "none" }} multiple onChange={e => Array.from(e.target.files).forEach(addFile)} />
            </label>
          </div>
          {fileLoading && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}><Spinner size={20} /><span style={{ fontSize: 12, color: C.coolGray }}>파일 분석 중...</span></div>}
          {files.length === 0 && !fileLoading && <div style={{ textAlign: "center", padding: "28px 0", color: C.coolGray, fontSize: 13 }}>검색할 PPTX/PDF 파일을 추가하세요</div>}
          {files.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 11, border: `1px solid ${C.border}`, background: C.lightGray }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{f.originalName.endsWith(".pdf") ? "📕" : "📊"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.navyBlack, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.originalName}</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
                      <Tag color={C.success} small>분석 완료</Tag>
                      <span style={{ fontSize: 10, color: C.coolGray }}>{f.estimatedSlides}장</span>
                    </div>
                  </div>
                  <button onClick={() => { setFiles(prev => prev.filter((_, j) => j !== i)); setResults(null); setSelected(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.coolGray, fontSize: 16 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
              placeholder="예: 신입사원 온보딩 교육체계 장표 찾아줘"
              style={{ flex: 1, padding: "13px 18px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.navyBlack, outline: "none", background: C.lightGray, letterSpacing: "-0.02em", fontFamily: "inherit" }} />
            <Btn primary onClick={search} disabled={!query.trim() || files.length === 0 || searching} style={{ padding: "0 28px" }}>
              {searching ? "검색 중..." : "검색"}
            </Btn>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["온보딩 교육체계", "리더십 역량모델", "교육 운영 프로세스", "조직문화 진단", "커리큘럼", "기대효과"].map(t => (
              <button key={t} onClick={() => setQuery(t)} style={{ border: `1px solid ${C.border}`, borderRadius: 99, padding: "5px 14px", fontSize: 11, color: C.coolGray, background: C.white, cursor: "pointer", fontWeight: 600 }}>{t}</button>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {FILTER_TAGS.map(tag => {
            const on = activeFilters.includes(tag);
            return (
              <button key={tag} onClick={() => setAF(prev => on ? prev.filter(t => t !== tag) : [...prev, tag])}
                style={{ border: `1px solid ${on ? C.blueViolet : C.border}`, borderRadius: 99, padding: "5px 14px", fontSize: 11, color: on ? C.white : C.coolGray, background: on ? C.blueViolet : C.white, cursor: "pointer", fontWeight: 600, transition: "all 0.1s" }}>{tag}</button>
            );
          })}
        </div>

        {searching && (
          <Card style={{ padding: 40, textAlign: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Spinner /><div style={{ fontSize: 13, color: C.coolGray }}>Claude AI가 장표를 분석하고 있습니다...</div>
            </div>
          </Card>
        )}

        {results && (
          <div style={{ display: "grid", gridTemplateColumns: selected !== null ? "1fr 360px" : "1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: C.coolGray, marginBottom: 14 }}>
                <span style={{ fontWeight: 700, color: C.navyBlack }}>{results.length}개</span>의 장표가 발견되었습니다
              </div>
              {results.length === 0 && <Card style={{ padding: 48, textAlign: "center", color: C.coolGray, fontSize: 14 }}>관련 장표를 찾지 못했습니다. 검색어를 바꿔보세요.</Card>}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {results.map((r, i) => (
                  <Card key={i} hoverable style={{ padding: 18, borderColor: selected === i ? C.blueViolet : C.border }} onClick={() => setSelected(selected === i ? null : i)}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 88, height: 62, background: `linear-gradient(135deg,${C.lavender},${C.paleBg})`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: `1px solid ${C.border}` }}>📋</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                          <Tag color={C.blueViolet} small>{r.slideType}</Tag>
                          <span style={{ fontSize: 11, color: C.coolGray }}>{r.fileName} · {r.page}</span>
                          <span style={{ marginLeft: "auto" }}><Tag color={rc(r.relevance)} small>관련도 {r.relevance}%</Tag></span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.03em", marginBottom: 5 }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: C.coolGray, lineHeight: 1.55 }}>{r.summary}</div>
                        <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
                          {r.keywords?.map(kw => <span key={kw} style={{ fontSize: 10, color: C.coolGray, background: C.lightGray, borderRadius: 6, padding: "2px 8px" }}># {kw}</span>)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {selected !== null && results[selected] && (
              <Card style={{ padding: 24, height: "fit-content", position: "sticky", top: 80 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navyBlack }}>장표 상세</div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.coolGray, fontSize: 18 }}>✕</button>
                </div>
                <div style={{ height: 138, background: `linear-gradient(135deg,${C.lavender},${C.paleBg})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, marginBottom: 16, border: `1px solid ${C.border}` }}>📋</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.navyBlack, letterSpacing: "-0.035em", marginBottom: 4 }}>{results[selected].title}</div>
                <div style={{ fontSize: 11, color: C.coolGray, marginBottom: 12 }}>{results[selected].fileName} · {results[selected].page}</div>
                <div style={{ marginBottom: 12 }}><Tag color={C.blueViolet}>{results[selected].slideType}</Tag></div>
                <div style={{ fontSize: 12, color: C.coolGray, lineHeight: 1.65, marginBottom: 14 }}>{results[selected].summary}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
                  {results[selected].keywords?.map(kw => <span key={kw} style={{ fontSize: 11, color: C.blueViolet, background: C.lavender, borderRadius: 6, padding: "3px 9px", fontWeight: 600 }}># {kw}</span>)}
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Btn primary style={{ width: "100%", padding: "11px 0" }}>⬇ 해당 장표 다운로드</Btn>
                  <Btn style={{ width: "100%", padding: "11px 0" }}>새 제안서에 추가</Btn>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Diagnosis Page ─────────────────────────────────────────────────────────

function DiagnosisPage({ setPage }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [fileLoading, setFL] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    setFL(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API}/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFileInfo(data);
    } catch (e) { setError(e.message); }
    finally { setFL(false); }
  };

  const DUMMY_RESULT = {
    completionScore: 62,
    summary: "현재 제안서는 기본 구성은 갖추고 있으나 제안 배경과 과업 이해 장표가 누락되어 설득력이 부족합니다. 전체 11개 권장 장표 중 5개만 확인됩니다.",
    currentFlow: DUMMY_CUR_FLOW,
    recommendedFlow: DUMMY_REC_FLOW,
    missingSlides: ["제안 배경", "고객 과업 이해", "HRD 추진 방향", "수행 경험", "부록"],
    comments: ["제안 초반부에 '현황 진단' 또는 '제안 배경' 장표를 추가하면 설득력이 높아집니다.", "견적 장표가 너무 앞에 배치되어 제안 논리가 약해 보일 수 있습니다.", "수행 경험 장표가 없어 신뢰도 보완이 필요합니다."],
    strengthPoints: ["교육과정 커리큘럼이 체계적으로 구성되어 있습니다.", "기대효과 장표가 명확하게 정리되어 있습니다."],
  };

  const run = () => {
    setRunning(true); setResult(null); setError("");
    const isDummy = !fileInfo || fileInfo.fileId?.startsWith("demo");
    if (isDummy) {
      setTimeout(() => { setResult(DUMMY_RESULT); setRunning(false); }, 2000);
    } else {
      fetch(`${API}/diagnose`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId: fileInfo.fileId, fileName: fileInfo.originalName }) })
        .then(r => r.json())
        .then(data => { if (data.error) throw new Error(data.error); setResult(data); })
        .catch(e => { setError(e.message); setResult(DUMMY_RESULT); })
        .finally(() => setRunning(false));
    }
  };

  const sc = s => s === "missing" ? C.blueViolet : s === "moved" ? C.warning : s === "warning" ? C.warning : C.success;
  const sl = s => s === "missing" ? "+ 추가 권장" : s === "moved" ? "↕ 순서 조정" : s === "warning" ? "⚠ 재검토" : "✓";

  return (
    <div style={{ minHeight: "100vh", background: C.paleBg }}>
      <PageHeader eyebrow="제안서 구조 진단" title="제안서의 흐름까지 AI가 함께 점검합니다" accent="AI가 함께 점검" sub="표지부터 기대효과, 견적, 부록까지 제안서의 설득 구조를 분석하고 개선 방향을 추천합니다." />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 72px" }}>
        <ErrorBox msg={error} />

        <Card style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
            {fileLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Spinner size={24} /><span style={{ fontSize: 13, color: C.coolGray }}>파일 분석 중...</span></div>
            ) : fileInfo ? (
              <div style={{ display: "flex", gap: 14, alignItems: "center", background: C.paleBg, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 26 }}>✅</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.02em" }}>{fileInfo.originalName}</div>
                  <div style={{ fontSize: 12, color: C.coolGray, marginTop: 3 }}>{fileInfo.estimatedSlides}장 추정 · {fileInfo.size}</div>
                </div>
                <button onClick={() => { setFileInfo(null); setResult(null); }} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.coolGray, fontSize: 12, fontWeight: 600 }}>다시 선택</button>
              </div>
            ) : (
              <label style={{ display: "flex", alignItems: "center", gap: 16, border: `2px dashed ${C.border}`, borderRadius: 12, padding: "20px 24px", cursor: "pointer" }}>
                <input type="file" accept=".pptx,.ppt,.pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                <div style={{ fontSize: 28 }}>📂</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navyBlack, letterSpacing: "-0.02em" }}>진단할 제안서를 업로드하세요</div>
                  <div style={{ fontSize: 12, color: C.coolGray, marginTop: 2 }}>PPTX 또는 PDF · 클릭하거나 파일을 끌어오세요</div>
                </div>
              </label>
            )}
            <Btn primary onClick={run} disabled={!fileInfo || running} style={{ padding: "16px 28px", fontSize: 14 }}>
              {running ? "분석 중..." : "◈ 진단 시작하기"}
            </Btn>
          </div>
        </Card>

        {!fileInfo && !result && !running && (
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <button onClick={() => setFileInfo({ originalName: "KMA_공통_HR제안템플릿.pptx", estimatedSlides: 5, size: "2.4MB", fileId: "demo" })}
              style={{ background: "none", border: `1px dashed ${C.blueViolet}`, borderRadius: 10, padding: "10px 22px", color: C.blueViolet, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              데모 데이터로 미리보기
            </button>
          </div>
        )}

        {running && (
          <Card style={{ padding: 40, textAlign: "center", marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Spinner /><div style={{ fontSize: 13, color: C.coolGray }}>Claude AI가 제안서 구조를 분석하고 있습니다...</div>
            </div>
          </Card>
        )}

        {result && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, marginBottom: 24 }}>
              <Card style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 10, color: C.coolGray, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>제안서 완성도</div>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: `conic-gradient(${C.blueViolet} 0% ${result.completionScore}%, ${C.border} ${result.completionScore}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <div style={{ width: 76, height: 76, borderRadius: "50%", background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: C.blueViolet, letterSpacing: "-0.04em" }}>{result.completionScore}</span>
                    <span style={{ fontSize: 9, color: C.coolGray }}>/ 100</span>
                  </div>
                </div>
                {result.missingSlides?.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%", alignItems: "flex-start" }}>
                    <div style={{ fontSize: 10, color: C.coolGray, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 4 }}>보완 필요</div>
                    {result.missingSlides.slice(0, 5).map(s => <Tag key={s} color={C.warning} small>{s}</Tag>)}
                  </div>
                )}
              </Card>
              <Card style={{ padding: 24 }}>
                <div style={{ fontSize: 13, color: C.navyBlack, lineHeight: 1.7, marginBottom: 16, letterSpacing: "-0.01em" }}>{result.summary}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.comments?.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", borderRadius: 10, background: i === 0 ? C.lavender : C.lightGray, border: `1px solid ${i === 0 ? C.blueViolet + "25" : C.border}` }}>
                      <span>{i === 0 ? "💡" : "⚠️"}</span>
                      <span style={{ fontSize: 12, color: C.navyBlack, lineHeight: 1.6, letterSpacing: "-0.01em" }}>{c}</span>
                    </div>
                  ))}
                  {result.strengthPoints?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", borderRadius: 10, background: C.success + "08", border: `1px solid ${C.success}30` }}>
                      <span>✅</span>
                      <span style={{ fontSize: 12, color: C.navyBlack, lineHeight: 1.6, letterSpacing: "-0.01em" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <Card style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                  <Tag color={C.coolGray}>현재 구조</Tag>
                  <span style={{ fontSize: 11, color: C.coolGray }}>{result.currentFlow?.length}장</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.currentFlow?.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: s.status !== "ok" ? C.warning + "10" : C.lightGray, border: `1px solid ${s.status !== "ok" ? C.warning + "40" : C.border}` }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.coolGray, minWidth: 20 }}>{s.idx}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.navyBlack, letterSpacing: "-0.02em" }}>{s.label}</span>
                      <Tag color={sc(s.status)} small>{s.type}</Tag>
                      {s.status !== "ok" && <Tag color={C.warning} small>{sl(s.status)}</Tag>}
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                  <Tag color={C.blueViolet}>AI 추천 구조</Tag>
                  <span style={{ fontSize: 11, color: C.coolGray }}>{result.recommendedFlow?.length}장</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {result.recommendedFlow?.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, background: s.status === "missing" ? C.blueViolet + "08" : s.status === "moved" ? C.warning + "08" : C.lightGray, border: `1px solid ${s.status === "missing" ? C.blueViolet + "30" : s.status === "moved" ? C.warning + "30" : C.border}`, borderStyle: s.status === "missing" ? "dashed" : "solid" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.coolGray, minWidth: 20 }}>{s.idx}</span>
                      <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: s.status === "missing" ? C.blueViolet : C.navyBlack, letterSpacing: "-0.02em" }}>{s.label}</span>
                      <Tag color={sc(s.status)} small>{sl(s.status)}</Tag>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary style={{ padding: "13px 24px" }}>빠진 장표 템플릿 추가</Btn>
              <Btn style={{ padding: "13px 24px" }}>제안서 순서 재구성</Btn>
              <Btn style={{ padding: "13px 24px" }}>구조 진단 리포트 다운로드</Btn>
              <Btn ghost onClick={() => setPage("transform")} style={{ padding: "13px 24px" }}>스타일 변환으로 이동 →</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div style={{ fontFamily: "'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif" }}>
      <NavBar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "transform" && <TransformPage />}
      {page === "search" && <SearchPage />}
      {page === "diagnosis" && <DiagnosisPage setPage={setPage} />}
    </div>
  );
}
