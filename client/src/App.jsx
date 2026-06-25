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
const INTS = ["가볍게 정리", "레이아웃 중심", "디자인 적극 반영"];
const COLS = ["원본 색상 유지", "레퍼런스 색상 적용", "KMA 브랜드 톤"];
const FMTS = ["PPTX", "PDF", "PPTX+PDF"];

const DUMMY_DIAGNOSIS = {
  completionScore: 62,
  summary: "현재 제안서는 기본 구성은 갖추고 있으나 제안 배경과 과업 이해 장표가 누락되어 설득력이 부족합니다. 전체 11개 권장 장표 중 5개만 확인됩니다.",
  currentFlow: DUMMY_CUR_FLOW,
  recommendedFlow: DUMMY_REC_FLOW,
  missingSlides: ["제안 배경", "고객 과업 이해", "HRD 추진 방향", "수행 경험", "부록"],
  comments: ["제안 초반부에 '현황 진단' 또는 '제안 배경' 장표를 추가하면 설득력이 높아집니다.", "견적 장표가 너무 앞에 배치되어 제안 논리가 약해 보일 수 있습니다.", "수행 경험 장표가 없어 신뢰도 보완이 필요합니다."],
  strengthPoints: ["교육과정 커리큘럼이 체계적으로 구성되어 있습니다.", "기대효과 장표가 명확하게 정리되어 있습니다."],
};

// ── Shared Components ──────────────────────────────────────────────────────

function Tag({ children, color = C.blueViolet, small }) {
  return (
    <span
      style={{ background: color + "18", color, border: `1px solid ${color}28` }}
      className={`inline-flex items-center rounded-full font-bold whitespace-nowrap tracking-tight ${small ? "px-2 py-0.5 text-[10px]" : "px-[11px] py-1 text-[11px]"}`}
    >{children}</span>
  );
}

function Card({ children, className = "", style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov && onClick ? C.blueViolet + "55" : C.border}`,
        boxShadow: hov && onClick ? "0 8px 32px rgba(76,59,207,0.11)" : "0 1px 4px rgba(0,0,0,0.04)",
        ...style,
      }}
      className={`bg-white rounded-2xl transition-all duration-150 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >{children}</div>
  );
}

function Btn({ children, onClick, primary, ghost, disabled, className = "", style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={primary && !disabled ? { background: `linear-gradient(135deg,${C.blueViolet},${C.purple})`, ...style } : style}
      className={`px-5 py-[11px] rounded-[10px] text-[13px] font-bold tracking-tight whitespace-nowrap transition-all
        ${disabled ? "bg-[#F8F9FC] text-[#64748B] border border-[#E2E8F0] cursor-not-allowed"
          : primary ? "text-white border-0 cursor-pointer"
          : ghost ? "bg-[#EEF0FF] text-[#4C3BCF] border border-[#4C3BCF]/30 cursor-pointer"
          : "bg-white text-[#0D1B2A] border border-[#E2E8F0] cursor-pointer"}
        ${className}`}
    >{children}</button>
  );
}

function Spinner({ size = 34 }) {
  return (
    <>
      <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: size, height: size, border: `3px solid ${C.lavender}`, borderTopColor: C.blueViolet, animation: "_spin 0.8s linear infinite" }} className="rounded-full flex-shrink-0" />
    </>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="rounded-[10px] px-4 py-3 text-[13px] font-semibold mb-4" style={{ background: C.danger + "12", border: `1px solid ${C.danger}40`, color: C.danger }}>
      ⚠ {msg}
    </div>
  );
}

function PageHeader({ eyebrow, title, accent, sub }) {
  const idx = accent ? title.indexOf(accent) : -1;
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-5 md:px-[72px] py-6 md:py-[38px]">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: C.blueViolet }}>{eyebrow}</div>
        <h1 className="text-[26px] md:text-[34px] font-black tracking-tight mb-3 leading-snug" style={{ color: C.navyBlack }}>
          {idx >= 0
            ? <>{title.slice(0, idx)}<span style={{ color: C.blueViolet }}>{accent}</span>{title.slice(idx + accent.length)}</>
            : title}
        </h1>
        {sub && <p className="text-[13px] md:text-[14px] leading-relaxed" style={{ color: C.coolGray }}>{sub}</p>}
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
    <Card className="p-5 md:p-6 flex-1">
      <Tag color={accent} small>PPTX / PDF</Tag>
      <div className="text-[15px] font-extrabold tracking-tight mt-2.5 mb-1" style={{ color: C.navyBlack }}>{title}</div>
      <div className="text-[12px] mb-4" style={{ color: C.coolGray }}>{subtitle}</div>

      {loading ? (
        <div className="flex flex-col items-center py-7 gap-3">
          <Spinner /><div className="text-[12px]" style={{ color: C.coolGray }}>분석 중...</div>
        </div>
      ) : fileInfo ? (
        <div className="rounded-xl p-4" style={{ background: C.paleBg }}>
          <div className="flex gap-2.5 items-center mb-3">
            <div className="w-11 h-[34px] rounded-[7px] flex items-center justify-center text-xl flex-shrink-0" style={{ background: C.lavender }}>
              {fileInfo.originalName?.endsWith(".pdf") ? "📕" : "📊"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold truncate" style={{ color: C.navyBlack }}>{fileInfo.originalName}</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.coolGray }}>{fileInfo.estimatedSlides}장 추정 · {fileInfo.size}</div>
            </div>
          </div>
          {fileInfo.textPreview && (
            <div className="rounded-lg px-2.5 py-2 text-[10px] leading-relaxed max-h-[52px] overflow-hidden mb-2.5" style={{ background: C.white, color: C.coolGray }}>
              {fileInfo.textPreview.slice(0, 160)}...
            </div>
          )}
          <div className="flex justify-between items-center">
            <Tag color={C.success} small>✓ 업로드 완료</Tag>
            <button onClick={() => onUpload(null, false)} className="text-[11px] font-semibold bg-transparent border-0 cursor-pointer" style={{ color: C.coolGray }}>다시 선택</button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
          className="flex flex-col items-center justify-center rounded-xl p-8 cursor-pointer transition-all"
          style={{ border: `2px dashed ${drag ? accent : C.border}`, background: drag ? accent + "08" : "transparent" }}>
          <input type="file" accept=".pptx,.ppt,.pdf" className="hidden" onChange={e => handle(e.target.files[0])} />
          <div className="text-3xl mb-2.5">⬆</div>
          <div className="text-[13px] font-bold tracking-tight" style={{ color: C.navyBlack }}>파일을 끌어오거나 클릭</div>
          <div className="text-[11px] mt-1" style={{ color: C.coolGray }}>PPTX · PPT · PDF · 최대 50MB</div>
        </label>
      )}
    </Card>
  );
}

// ── NavBar ─────────────────────────────────────────────────────────────────

function NavBar({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menus = [
    { id: "transform", label: "제안서 스타일 변환" },
    { id: "search", label: "장표 검색" },
    { id: "diagnosis", label: "구조 진단" },
  ];

  const go = (id) => { setPage(id); setMenuOpen(false); };

  return (
    <>
      <nav className="sticky top-0 z-[200] bg-white border-b border-[#E2E8F0] px-5 md:px-[72px] h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={() => go("home")}>
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px] font-black text-white"
            style={{ background: `linear-gradient(135deg,${C.blueViolet},${C.purple})` }}>K</div>
          <div className="hidden sm:block">
            <div className="text-[13px] font-extrabold tracking-tight leading-none" style={{ color: C.navyBlack }}>KMA Proposal Transformer</div>
            <div className="text-[9px] font-semibold tracking-[0.1em] uppercase mt-0.5" style={{ color: C.coolGray }}>AI Proposal Workspace</div>
          </div>
        </div>

        {/* Center menus — desktop */}
        <div className="hidden md:flex gap-0.5 rounded-xl p-1" style={{ background: C.lightGray }}>
          {menus.map(m => (
            <button key={m.id} onClick={() => go(m.id)}
              style={page === m.id ? { background: `linear-gradient(135deg,${C.blueViolet},${C.purple})` } : {}}
              className={`px-[18px] py-2 rounded-[9px] border-0 text-[13px] tracking-tight transition-all cursor-pointer
                ${page === m.id ? "text-white font-bold" : "font-medium bg-transparent"}`}
              style2={{ color: page === m.id ? undefined : C.coolGray }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Right — desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {["작업 이력", "템플릿 관리", "관리자"].map(l => (
            <button key={l} className="bg-transparent border-0 text-[12px] px-2.5 py-1.5 rounded-lg font-medium cursor-pointer" style={{ color: C.coolGray }}>{l}</button>
          ))}
          <div className="w-px h-5 mx-2" style={{ background: C.border }} />
          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] text-white font-bold cursor-pointer"
            style={{ background: `linear-gradient(135deg,${C.blueViolet},${C.purple})` }}>김</div>
        </div>

        {/* Hamburger — mobile */}
        <button className="md:hidden flex flex-col justify-center gap-[5px] p-2 bg-transparent border-0 cursor-pointer" onClick={() => setMenuOpen(o => !o)}>
          <span className={`block w-5 h-0.5 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} style={{ background: C.navyBlack }} />
          <span className={`block w-5 h-0.5 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} style={{ background: C.navyBlack }} />
          <span className={`block w-5 h-0.5 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} style={{ background: C.navyBlack }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-[199] bg-white shadow-lg" style={{ borderBottom: `1px solid ${C.border}` }}>
          {menus.map(m => (
            <button key={m.id} onClick={() => go(m.id)}
              className="w-full text-left px-5 py-4 text-[14px] font-semibold bg-transparent border-0 cursor-pointer"
              style={{ color: page === m.id ? C.blueViolet : C.navyBlack, borderBottom: `1px solid ${C.border}` }}>
              {m.label}
            </button>
          ))}
          {["작업 이력", "템플릿 관리", "관리자"].map(l => (
            <button key={l} className="w-full text-left px-5 py-3.5 text-[13px] bg-transparent border-0 cursor-pointer" style={{ color: C.coolGray, borderBottom: `1px solid ${C.border}` }}>{l}</button>
          ))}
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] text-white font-bold"
              style={{ background: `linear-gradient(135deg,${C.blueViolet},${C.purple})` }}>김</div>
            <span className="text-[13px] font-semibold" style={{ color: C.navyBlack }}>김담당자</span>
          </div>
        </div>
      )}
    </>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <div className="min-h-screen" style={{ background: C.paleBg }}>
      {/* Hero */}
      <div className="relative overflow-hidden px-5 md:px-[72px] py-10 md:py-[72px]"
        style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.deepBlue} 50%,${C.blueViolet} 100%)` }}>
        {[[280, -50, 360], [-70, 180, 260], [520, 270, 200]].map(([x, y, s], i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{ left: x, top: y, width: s, height: s, background: C.softViolet, opacity: 0.06 }} />
        ))}

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 mb-6"
              style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.softViolet }} />
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: C.softViolet }}>AI Proposal Workspace</span>
            </div>
            <h1 className="text-[32px] md:text-[46px] font-black text-white leading-tight tracking-tight mb-5">
              흩어진 제안서를<br />
              <span style={{ color: C.softViolet }}>AI가 읽고,</span> 정리하고,<br />
              다시 디자인합니다
            </h1>
            <p className="text-[14px] md:text-[15px] leading-relaxed mb-9" style={{ color: "rgba(255,255,255,0.65)" }}>
              Before 제안서와 Reference 파일을 업로드하면,<br className="hidden md:block" />KMA 제안서 업무 흐름에 맞는 수정 가능한 PPTX 초안을 생성합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setPage("transform")}
                className="px-7 py-3.5 rounded-xl border-0 text-[14px] font-bold cursor-pointer text-white"
                style={{ background: C.softViolet, boxShadow: "0 4px 20px rgba(167,139,250,0.35)" }}>
                제안서 변환 시작하기 →
              </button>
              <button onClick={() => setPage("search")}
                className="px-7 py-3.5 rounded-xl text-[14px] font-semibold cursor-pointer text-white"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)" }}>
                장표 검색하기
              </button>
            </div>
          </div>

          {/* Hero visual — desktop only */}
          <div className="hidden md:block relative h-[270px]">
            {[
              { pos: { left: 0, top: 28 }, labelBg: "rgba(255,255,255,0.14)", labelColor: C.white, label: "BEFORE", icon: "📄", sub: "기존 PPT / PDF", bg: "rgba(255,255,255,0.1)", border: "rgba(255,255,255,0.18)" },
              { pos: { left: "50%", top: 48, transform: "translateX(-50%)", zIndex: 2 }, labelBg: "rgba(167,139,250,0.22)", labelColor: C.softViolet, label: "REFERENCE", icon: "🗂", sub: "스타일 레퍼런스", bg: "rgba(255,255,255,0.14)", border: "rgba(167,139,250,0.45)", shadow: "0 8px 32px rgba(76,59,207,0.22)" },
              { pos: { right: 0, top: 28 }, labelBg: "rgba(16,185,129,0.18)", labelColor: "#34D399", label: "AFTER ✓", icon: "✨", sub: "변환된 PPTX", bg: "rgba(255,255,255,0.1)", border: "rgba(16,185,129,0.3)" },
            ].map((card, i) => (
              <div key={i} className="absolute w-[158px] p-3.5 rounded-2xl backdrop-blur-sm"
                style={{ ...card.pos, background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
                <div className="rounded-full px-2.5 py-0.5 text-[9px] font-bold inline-block mb-2.5 tracking-[0.07em]"
                  style={{ background: card.labelBg, color: card.labelColor }}>{card.label}</div>
                <div className="h-[66px] rounded-[10px] flex items-center justify-center text-3xl" style={{ background: "rgba(255,255,255,0.08)" }}>{card.icon}</div>
                <div className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>{card.sub}</div>
              </div>
            ))}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[9px] text-white font-bold whitespace-nowrap tracking-[0.07em]"
              style={{ background: C.blueViolet, boxShadow: "0 4px 20px rgba(76,59,207,0.5)" }}>✦ AI MATCHING</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1100px] mx-auto px-5 md:px-[72px] py-10 md:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {DUMMY_STATS.map(s => (
            <Card key={s.label} className="p-4 md:p-5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <span className="text-xl font-black" style={{ color: s.color }}>{s.value}</span>
              </div>
              <div>
                <div className="text-[20px] md:text-[22px] font-black tracking-tight leading-none" style={{ color: C.navyBlack }}>
                  {s.value}<span className="text-[13px]">{s.unit}</span>
                </div>
                <div className="text-[11px] mt-1" style={{ color: C.coolGray }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mb-10">
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase mb-5" style={{ color: C.blueViolet }}>핵심 기능</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "transform", icon: "✦", label: "제안서 스타일 변환", desc: "Before PPT와 Reference를 업로드하면 AI가 레이아웃을 분석해 PPTX 변환 리포트를 생성합니다.", color: C.blueViolet, badge: "가장 많이 사용" },
              { id: "search", icon: "⊕", label: "장표 검색", desc: "여러 PPT/PDF 안에서 원하는 장표를 자연어로 검색해 위치를 찾아줍니다.", color: C.purple },
              { id: "diagnosis", icon: "◈", label: "구조 진단", desc: "HR 제안서 관점에서 흐름, 누락 장표, 완성도 점수를 분석하고 추천 구조를 제시합니다.", color: "#0891B2" },
            ].map(f => (
              <Card key={f.id} className="p-6 md:p-7" onClick={() => setPage(f.id)}>
                {f.badge && <div className="mb-3"><Tag color={C.success} small>{f.badge}</Tag></div>}
                <div className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center text-xl font-black mb-4" style={{ background: f.color + "18", color: f.color }}>{f.icon}</div>
                <div className="text-[15px] md:text-[16px] font-extrabold tracking-tight mb-2" style={{ color: C.navyBlack }}>{f.label}</div>
                <div className="text-[13px] leading-relaxed" style={{ color: C.coolGray }}>{f.desc}</div>
                <div className="mt-5 text-[12px] font-bold" style={{ color: f.color }}>시작하기 →</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent work */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: C.blueViolet }}>최근 작업</div>
            <button className="bg-transparent border-0 text-[12px] font-semibold cursor-pointer" style={{ color: C.coolGray }}>전체 보기 →</button>
          </div>
          <Card>
            {DUMMY_RECENT.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3.5 px-4 md:px-5 py-3.5" style={{ borderBottom: i < DUMMY_RECENT.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-lg flex-shrink-0" style={{ background: C.lavender }}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold tracking-tight truncate" style={{ color: C.navyBlack }}>{item.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.coolGray }}>{item.date}</div>
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
  const [filterReview, setFilterReview] = useState(false);

  const hBefore = (info, loading, err) => { setBL(loading); if (err) setError(err); else if (!loading) setBeforeInfo(info); };
  const hRef = (info, loading, err) => { setRL(loading); if (err) setError(err); else if (!loading) setRefInfo(info); };

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
  const visibleSlides = filterReview ? result?.slides?.filter(s => s.reviewLevel !== "낮음") : result?.slides;

  return (
    <div className="min-h-screen" style={{ background: C.paleBg }}>
      <PageHeader eyebrow="제안서 스타일 변환" title="Before 제안서를 Reference 스타일로 다시 구성합니다" accent="Reference 스타일" sub="기존 제안서의 내용과 맥락은 유지하고, 레이아웃·색상·표·도형 스타일을 레퍼런스 기준으로 정리합니다." />
      <div className="max-w-[1100px] mx-auto px-5 md:px-[72px] py-8 md:py-9">
        <ErrorBox msg={error} />

        {/* Upload */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_76px_1fr] gap-4 items-center mb-6">
          <FileUploadCard title="Before 제안서" subtitle="변환할 기존 제안서 파일" fileInfo={beforeInfo} onUpload={hBefore} loading={beforeLoading} />
          <div className="flex flex-row md:flex-col items-center justify-center gap-2 md:gap-2.5 py-2 md:py-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] text-white font-bold"
              style={{ background: `linear-gradient(135deg,${C.blueViolet},${C.purple})`, boxShadow: "0 4px 14px rgba(76,59,207,0.28)" }}>AI</div>
            <div className="text-xl rotate-90 md:rotate-0" style={{ color: C.border }}>→</div>
          </div>
          <FileUploadCard title="Reference 제안서" subtitle="따라 하고 싶은 스타일의 파일" fileInfo={refInfo} onUpload={hRef} loading={refLoading} accent={C.purple} />
        </div>

        {/* Options */}
        <Card className="p-5 md:p-6 mb-6">
          <div className="text-[11px] font-bold tracking-[0.07em] uppercase mb-4" style={{ color: C.coolGray }}>변환 옵션</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[{ label: "변환 강도", opts: INTS, val: intensity, set: setIntensity }, { label: "색상 기준", opts: COLS, val: colorMode, set: setColorMode }, { label: "출력 형식", opts: FMTS, val: fmt, set: setFmt }].map(g => (
              <div key={g.label}>
                <div className="text-[11px] font-bold mb-2.5" style={{ color: C.coolGray }}>{g.label}</div>
                <div className="flex gap-1">
                  {g.opts.map((o, i) => (
                    <button key={o} onClick={() => g.set(i)}
                      className="flex-1 py-2 rounded-[9px] text-[11px] font-semibold cursor-pointer transition-all"
                      style={{ border: `1px solid ${g.val === i ? C.blueViolet : C.border}`, background: g.val === i ? C.blueViolet : "transparent", color: g.val === i ? C.white : C.coolGray }}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {step === -1 && !result && (
          <div className="text-center mb-7">
            <Btn primary onClick={run} disabled={!beforeInfo || !refInfo} className="px-14 py-4 text-[15px]">
              {!beforeInfo || !refInfo ? "파일을 모두 업로드해주세요" : "✦ AI 변환 시작하기"}
            </Btn>
          </div>
        )}

        {running && (
          <Card className="p-7 md:p-8 mb-6">
            <div className="text-[14px] font-bold tracking-tight mb-7" style={{ color: C.navyBlack }}>AI 분석 진행 중</div>
            <div className="flex flex-col gap-3.5">
              {TRANSFORM_STEPS.map((s, i) => {
                const done = i < step, active = i === step;
                return (
                  <div key={s} className="flex items-center gap-3.5 transition-opacity duration-300" style={{ opacity: i > step ? 0.32 : 1 }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ border: `2px solid ${done ? C.success : active ? C.blueViolet : C.border}`, background: done ? C.success : active ? C.blueViolet + "14" : "transparent" }}>
                      {done ? <span className="text-white text-[12px]">✓</span> : active ? <Spinner size={14} /> : <span className="text-[10px] font-bold" style={{ color: C.coolGray }}>{i + 1}</span>}
                    </div>
                    <span className="text-[13px] tracking-tight" style={{ fontWeight: active ? 700 : 500, color: active ? C.blueViolet : done ? C.navyBlack : C.coolGray }}>{s}</span>
                    {done && <Tag color={C.success} small>완료</Tag>}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {result && (
          <>
            {/* Score + summary */}
            <Card className="p-6 md:p-7 mb-5">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ background: `conic-gradient(${C.blueViolet} 0% ${result.completionScore}%, ${C.border} ${result.completionScore}% 100%)` }}>
                    <div className="w-[72px] h-[72px] rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-2xl font-black tracking-tight" style={{ color: C.blueViolet }}>{result.completionScore}</span>
                      <span className="text-[9px]" style={{ color: C.coolGray }}>점</span>
                    </div>
                  </div>
                  <div className="text-[11px] mt-2.5" style={{ color: C.coolGray }}>변환 완성도</div>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] leading-relaxed mb-3.5" style={{ color: C.navyBlack }}>{result.summary}</div>
                  <div className="flex flex-col gap-2">
                    {result.improvements?.map((imp, i) => (
                      <div key={i} className="text-[12px] rounded-[9px] px-3.5 py-2.5 leading-relaxed" style={{ background: C.lavender, color: C.navyBlack }}>💡 {imp}</div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Before/After */}
            <Card className="p-5 md:p-6 mb-5">
              <div className="text-[13px] font-bold tracking-tight mb-5" style={{ color: C.navyBlack }}>장표 비교 미리보기</div>
              <div className="grid grid-cols-[1fr_52px_1fr] gap-3 items-center">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.06em] uppercase mb-2.5" style={{ color: C.coolGray }}>Before</div>
                  <div className="h-[110px] md:h-[140px] rounded-xl flex flex-col items-center justify-center gap-2 border" style={{ background: C.lightGray, border: `1px solid ${C.border}` }}>
                    <div className="text-3xl">📄</div>
                    <div className="text-[11px] px-2 text-center truncate w-full" style={{ color: C.coolGray }}>{beforeInfo?.originalName || "원본 제안서"}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${C.blueViolet},${C.purple})` }}>
                    <span className="text-white text-sm">✦</span>
                  </div>
                  <div className="text-[9px] font-bold" style={{ color: C.blueViolet }}>AI 변환</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.06em] uppercase mb-2.5" style={{ color: C.success }}>After</div>
                  <div className="h-[110px] md:h-[140px] rounded-xl flex flex-col items-center justify-center gap-2 border" style={{ background: C.success + "08", border: `1px solid ${C.success}30` }}>
                    <div className="text-3xl">✨</div>
                    <div className="text-[11px] font-semibold" style={{ color: C.success }}>변환 완료 · PPTX</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Slide report */}
            <Card className="p-5 md:p-6 mb-5">
              <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <div className="text-[13px] font-bold tracking-tight" style={{ color: C.navyBlack }}>장표별 변환 리포트</div>
                <div className="flex gap-2 items-center flex-wrap">
                  <Tag color={C.success} small>완료 {result.slides.filter(s => s.reviewLevel === "낮음").length}장</Tag>
                  <Tag color={C.warning} small>검토 {result.slides.filter(s => s.reviewLevel !== "낮음").length}장</Tag>
                  <button onClick={() => setFilterReview(f => !f)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full cursor-pointer transition-all"
                    style={{ border: `1px solid ${filterReview ? C.warning : C.border}`, background: filterReview ? C.warning + "12" : "transparent", color: filterReview ? C.warning : C.coolGray }}>
                    {filterReview ? "전체 보기" : "검토 필요만 보기"}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[480px]">
                  <thead>
                    <tr>{["페이지", "장표 제목", "원본 유형", "적용 레이아웃", "검토 필요"].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold tracking-[0.05em] uppercase pb-3 pr-2.5" style={{ color: C.coolGray }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {visibleSlides?.map((s, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td className="py-2.5 pr-2.5 text-[12px] font-bold" style={{ color: C.navyBlack }}>{s.page}</td>
                        <td className="py-2.5 pr-2.5 text-[13px] font-semibold max-w-[140px] truncate" style={{ color: C.navyBlack }}>{s.title}</td>
                        <td className="py-2.5 pr-2.5"><Tag color={C.coolGray} small>{s.originalType}</Tag></td>
                        <td className="py-2.5 pr-2.5"><Tag color={C.blueViolet} small>{s.appliedLayout}</Tag></td>
                        <td className="py-2.5">
                          <div className="flex flex-col gap-1">
                            <Tag color={rc(s.reviewLevel)} small>{s.reviewLevel}</Tag>
                            {s.reviewNote && <div className="text-[10px]" style={{ color: C.coolGray }}>{s.reviewNote}</div>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <Btn primary className="px-8 py-3.5">⬇ PPTX 다운로드</Btn>
              <Btn className="px-6 py-3.5">PDF 다운로드</Btn>
              <Btn onClick={() => { setResult(null); setStep(-1); setBeforeInfo(null); setRefInfo(null); setFilterReview(false); }} className="px-6 py-3.5">다시 변환하기</Btn>
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
    <div className="min-h-screen" style={{ background: C.paleBg }}>
      <PageHeader eyebrow="장표 검색" title="예전에 만든 좋은 장표, 파일을 뒤지지 않고 찾습니다" accent="파일을 뒤지지 않고" sub="여러 PPT/PDF 파일을 업로드하면 AI가 각 장표를 분석해 원하는 장표의 위치를 찾아줍니다." />
      <div className="max-w-[1100px] mx-auto px-5 md:px-[72px] py-8 md:py-9">
        <ErrorBox msg={error} />

        {/* File library */}
        <Card className="p-4 md:p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-[13px] font-bold tracking-tight" style={{ color: C.navyBlack }}>파일 라이브러리</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.coolGray }}>{files.length}개 파일 · 분석 완료</div>
            </div>
            <label className="px-4 py-2 rounded-[9px] text-[12px] font-bold text-white cursor-pointer"
              style={{ background: `linear-gradient(135deg,${C.blueViolet},${C.purple})` }}>
              + 파일 추가
              <input type="file" accept=".pptx,.ppt,.pdf" className="hidden" multiple onChange={e => Array.from(e.target.files).forEach(addFile)} />
            </label>
          </div>
          {fileLoading && <div className="flex items-center gap-2.5 py-1.5"><Spinner size={20} /><span className="text-[12px]" style={{ color: C.coolGray }}>파일 분석 중...</span></div>}
          {files.length === 0 && !fileLoading && <div className="text-center py-7 text-[13px]" style={{ color: C.coolGray }}>검색할 PPTX/PDF 파일을 추가하세요</div>}
          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {files.map((f, i) => (
                <div key={i} className="flex gap-2.5 items-center px-3.5 py-2.5 rounded-[11px]" style={{ border: `1px solid ${C.border}`, background: C.lightGray }}>
                  <div className="text-xl flex-shrink-0">{f.originalName.endsWith(".pdf") ? "📕" : "📊"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold truncate" style={{ color: C.navyBlack }}>{f.originalName}</div>
                    <div className="flex gap-1.5 mt-1 items-center">
                      <Tag color={C.success} small>분석 완료</Tag>
                      <span className="text-[10px]" style={{ color: C.coolGray }}>{f.estimatedSlides}장</span>
                    </div>
                  </div>
                  <button onClick={() => { setFiles(prev => prev.filter((_, j) => j !== i)); setResults(null); setSelected(null); }}
                    className="bg-transparent border-0 cursor-pointer text-lg leading-none flex-shrink-0" style={{ color: C.coolGray }}>×</button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Search */}
        <Card className="p-4 md:p-5 mb-4">
          <div className="flex gap-2.5 mb-3.5">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
              placeholder="예: 신입사원 온보딩 교육체계 장표 찾아줘"
              className="flex-1 px-4 py-3 rounded-[10px] text-[14px] outline-none tracking-tight"
              style={{ border: `1.5px solid ${C.border}`, background: C.lightGray, color: C.navyBlack }} />
            <Btn primary onClick={search} disabled={!query.trim() || files.length === 0 || searching} className="px-5 md:px-6">
              {searching ? "검색 중..." : "검색"}
            </Btn>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["온보딩 교육체계", "리더십 역량모델", "교육 운영 프로세스", "조직문화 진단", "커리큘럼", "기대효과"].map(t => (
              <button key={t} onClick={() => setQuery(t)} className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold bg-white cursor-pointer" style={{ border: `1px solid ${C.border}`, color: C.coolGray }}>{t}</button>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {FILTER_TAGS.map(tag => {
            const on = activeFilters.includes(tag);
            return (
              <button key={tag} onClick={() => setAF(prev => on ? prev.filter(t => t !== tag) : [...prev, tag])}
                className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer transition-all"
                style={{ border: `1px solid ${on ? C.blueViolet : C.border}`, background: on ? C.blueViolet : C.white, color: on ? C.white : C.coolGray }}>{tag}</button>
            );
          })}
        </div>

        {searching && (
          <Card className="p-10 text-center">
            <div className="flex flex-col items-center gap-3.5">
              <Spinner /><div className="text-[13px]" style={{ color: C.coolGray }}>Claude AI가 장표를 분석하고 있습니다...</div>
            </div>
          </Card>
        )}

        {results && (
          <div className={selected !== null ? "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5" : ""}>
            <div>
              <div className="text-[12px] mb-3.5" style={{ color: C.coolGray }}>
                <span className="font-bold" style={{ color: C.navyBlack }}>{results.length}개</span>의 장표가 발견되었습니다
              </div>
              {results.length === 0 && <Card className="p-12 text-center text-[14px]" style={{ color: C.coolGray }}>관련 장표를 찾지 못했습니다. 검색어를 바꿔보세요.</Card>}
              <div className="flex flex-col gap-3">
                {results.map((r, i) => (
                  <Card key={i} className="p-4 md:p-[18px]" style={{ borderColor: selected === i ? C.blueViolet : C.border }} onClick={() => setSelected(selected === i ? null : i)}>
                    <div className="flex gap-3 md:gap-4">
                      <div className="w-[68px] md:w-[88px] h-[50px] md:h-[62px] rounded-[9px] flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${C.lavender},${C.paleBg})`, border: `1px solid ${C.border}` }}>📋</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 items-start mb-1.5 flex-wrap">
                          <Tag color={C.blueViolet} small>{r.slideType}</Tag>
                          <span className="text-[11px] truncate" style={{ color: C.coolGray }}>{r.fileName} · {r.page}</span>
                          <span className="ml-auto"><Tag color={rc(r.relevance)} small>관련도 {r.relevance}%</Tag></span>
                        </div>
                        <div className="text-[13px] md:text-[14px] font-bold tracking-tight mb-1" style={{ color: C.navyBlack }}>{r.title}</div>
                        <div className="text-[12px] leading-relaxed" style={{ color: C.coolGray }}>{r.summary}</div>
                        <div className="flex gap-1.5 mt-2.5 flex-wrap">
                          {r.keywords?.map(kw => <span key={kw} className="text-[10px] rounded-[6px] px-2 py-0.5" style={{ color: C.coolGray, background: C.lightGray }}># {kw}</span>)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {selected !== null && results[selected] && (
              <div className="mt-4 lg:mt-0">
                <Card className="p-5 md:p-6 lg:sticky lg:top-20">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[13px] font-bold" style={{ color: C.navyBlack }}>장표 상세</div>
                    <button onClick={() => setSelected(null)} className="bg-transparent border-0 cursor-pointer text-lg" style={{ color: C.coolGray }}>✕</button>
                  </div>
                  <div className="h-[120px] rounded-xl flex items-center justify-center text-5xl mb-4"
                    style={{ background: `linear-gradient(135deg,${C.lavender},${C.paleBg})`, border: `1px solid ${C.border}` }}>📋</div>
                  <div className="text-[15px] font-extrabold tracking-tight mb-1" style={{ color: C.navyBlack }}>{results[selected].title}</div>
                  <div className="text-[11px] mb-3" style={{ color: C.coolGray }}>{results[selected].fileName} · {results[selected].page}</div>
                  <div className="mb-3"><Tag color={C.blueViolet}>{results[selected].slideType}</Tag></div>
                  <div className="text-[12px] leading-relaxed mb-3.5" style={{ color: C.coolGray }}>{results[selected].summary}</div>
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {results[selected].keywords?.map(kw => <span key={kw} className="text-[11px] rounded-[6px] px-2.5 py-1 font-semibold" style={{ color: C.blueViolet, background: C.lavender }}># {kw}</span>)}
                  </div>
                  <div className="flex flex-col gap-2" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    <Btn primary className="w-full py-3 justify-center">⬇ 해당 장표 다운로드</Btn>
                    <Btn className="w-full py-3 justify-center">새 제안서에 추가</Btn>
                  </div>
                </Card>
              </div>
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

  const run = () => {
    setRunning(true); setResult(null); setError("");
    const isDummy = !fileInfo || fileInfo.fileId?.startsWith("demo");
    if (isDummy) {
      setTimeout(() => { setResult(DUMMY_DIAGNOSIS); setRunning(false); }, 2000);
    } else {
      fetch(`${API}/diagnose`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId: fileInfo.fileId, fileName: fileInfo.originalName }) })
        .then(r => r.json())
        .then(data => { if (data.error) throw new Error(data.error); setResult(data); })
        .catch(e => { setError(e.message); setResult(DUMMY_DIAGNOSIS); })
        .finally(() => setRunning(false));
    }
  };

  const sc = s => s === "missing" ? C.blueViolet : s === "moved" ? C.warning : s === "warning" ? C.warning : C.success;
  const sl = s => s === "missing" ? "+ 추가 권장" : s === "moved" ? "↕ 순서 조정" : s === "warning" ? "⚠ 재검토" : "✓";

  return (
    <div className="min-h-screen" style={{ background: C.paleBg }}>
      <PageHeader eyebrow="제안서 구조 진단" title="제안서의 흐름까지 AI가 함께 점검합니다" accent="AI가 함께 점검" sub="표지부터 기대효과, 견적, 부록까지 제안서의 설득 구조를 분석하고 개선 방향을 추천합니다." />
      <div className="max-w-[1100px] mx-auto px-5 md:px-[72px] py-8 md:py-9">
        <ErrorBox msg={error} />

        {/* Upload + run */}
        <Card className="p-4 md:p-6 mb-5">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {fileLoading ? (
              <div className="flex items-center gap-3 flex-1"><Spinner size={24} /><span className="text-[13px]" style={{ color: C.coolGray }}>파일 분석 중...</span></div>
            ) : fileInfo ? (
              <div className="flex gap-3.5 items-center flex-1 rounded-xl px-4 py-3.5" style={{ background: C.paleBg }}>
                <div className="text-2xl">✅</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold tracking-tight truncate" style={{ color: C.navyBlack }}>{fileInfo.originalName}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: C.coolGray }}>{fileInfo.estimatedSlides}장 추정 · {fileInfo.size}</div>
                </div>
                <button onClick={() => { setFileInfo(null); setResult(null); }} className="bg-transparent border-0 cursor-pointer text-[12px] font-semibold" style={{ color: C.coolGray }}>다시 선택</button>
              </div>
            ) : (
              <label className="flex items-center gap-4 rounded-xl px-5 py-5 cursor-pointer flex-1" style={{ border: `2px dashed ${C.border}` }}>
                <input type="file" accept=".pptx,.ppt,.pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                <div className="text-2xl">📂</div>
                <div>
                  <div className="text-[14px] font-bold tracking-tight" style={{ color: C.navyBlack }}>진단할 제안서를 업로드하세요</div>
                  <div className="text-[12px] mt-0.5" style={{ color: C.coolGray }}>PPTX 또는 PDF · 클릭하거나 파일을 끌어오세요</div>
                </div>
              </label>
            )}
            <Btn primary onClick={run} disabled={!fileInfo || running} className="py-4 px-7 text-[14px]">
              {running ? "분석 중..." : "◈ 진단 시작하기"}
            </Btn>
          </div>
        </Card>

        {!fileInfo && !result && !running && (
          <div className="text-center mb-6">
            <button onClick={() => setFileInfo({ originalName: "KMA_공통_HR제안템플릿.pptx", estimatedSlides: 5, size: "2.4MB", fileId: "demo" })}
              className="bg-transparent rounded-[10px] px-5 py-2.5 text-[12px] font-semibold cursor-pointer"
              style={{ border: `1px dashed ${C.blueViolet}`, color: C.blueViolet }}>
              데모 데이터로 미리보기
            </button>
          </div>
        )}

        {running && (
          <Card className="p-10 text-center mb-6">
            <div className="flex flex-col items-center gap-3.5">
              <Spinner /><div className="text-[13px]" style={{ color: C.coolGray }}>Claude AI가 제안서 구조를 분석하고 있습니다...</div>
            </div>
          </Card>
        )}

        {result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 mb-5">
              <Card className="p-7 flex flex-col items-center justify-center">
                <div className="text-[10px] font-semibold tracking-[0.08em] uppercase mb-3.5" style={{ color: C.coolGray }}>제안서 완성도</div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                  style={{ background: `conic-gradient(${C.blueViolet} 0% ${result.completionScore}%, ${C.border} ${result.completionScore}% 100%)` }}>
                  <div className="w-[76px] h-[76px] rounded-full bg-white flex flex-col items-center justify-center">
                    <span className="text-[26px] font-black tracking-tight" style={{ color: C.blueViolet }}>{result.completionScore}</span>
                    <span className="text-[9px]" style={{ color: C.coolGray }}>/ 100</span>
                  </div>
                </div>
                {result.missingSlides?.length > 0 && (
                  <div className="flex flex-col gap-1.5 w-full items-start">
                    <div className="text-[10px] font-semibold tracking-[0.04em] mb-1" style={{ color: C.coolGray }}>보완 필요</div>
                    {result.missingSlides.slice(0, 5).map(s => <Tag key={s} color={C.warning} small>{s}</Tag>)}
                  </div>
                )}
              </Card>
              <Card className="p-5 md:p-6">
                <div className="text-[13px] leading-relaxed mb-4" style={{ color: C.navyBlack }}>{result.summary}</div>
                <div className="flex flex-col gap-2">
                  {result.comments?.map((c, i) => (
                    <div key={i} className="flex gap-2.5 px-3.5 py-2.5 rounded-[10px]" style={{ background: i === 0 ? C.lavender : C.lightGray, border: `1px solid ${i === 0 ? C.blueViolet + "25" : C.border}` }}>
                      <span>{i === 0 ? "💡" : "⚠️"}</span>
                      <span className="text-[12px] leading-relaxed" style={{ color: C.navyBlack }}>{c}</span>
                    </div>
                  ))}
                  {result.strengthPoints?.map((s, i) => (
                    <div key={i} className="flex gap-2.5 px-3.5 py-2.5 rounded-[10px]" style={{ background: C.success + "08", border: `1px solid ${C.success}30` }}>
                      <span>✅</span>
                      <span className="text-[12px] leading-relaxed" style={{ color: C.navyBlack }}>{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Flow comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Card className="p-5 md:p-6">
                <div className="flex gap-2 items-center mb-4">
                  <Tag color={C.coolGray}>현재 구조</Tag>
                  <span className="text-[11px]" style={{ color: C.coolGray }}>{result.currentFlow?.length}장</span>
                </div>
                <div className="flex flex-col gap-2">
                  {result.currentFlow?.map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px]"
                      style={{ background: s.status !== "ok" ? C.warning + "10" : C.lightGray, border: `1px solid ${s.status !== "ok" ? C.warning + "40" : C.border}` }}>
                      <span className="text-[11px] font-bold min-w-[20px]" style={{ color: C.coolGray }}>{s.idx}</span>
                      <span className="flex-1 text-[13px] font-semibold tracking-tight" style={{ color: C.navyBlack }}>{s.label}</span>
                      <Tag color={sc(s.status)} small>{s.type}</Tag>
                      {s.status !== "ok" && <Tag color={C.warning} small>{sl(s.status)}</Tag>}
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5 md:p-6">
                <div className="flex gap-2 items-center mb-4">
                  <Tag color={C.blueViolet}>AI 추천 구조</Tag>
                  <span className="text-[11px]" style={{ color: C.coolGray }}>{result.recommendedFlow?.length}장</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {result.recommendedFlow?.map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3.5 py-2 rounded-[10px]"
                      style={{
                        background: s.status === "missing" ? C.blueViolet + "08" : s.status === "moved" ? C.warning + "08" : C.lightGray,
                        border: `1px solid ${s.status === "missing" ? C.blueViolet + "30" : s.status === "moved" ? C.warning + "30" : C.border}`,
                        borderStyle: s.status === "missing" ? "dashed" : "solid",
                      }}>
                      <span className="text-[11px] font-bold min-w-[20px]" style={{ color: C.coolGray }}>{s.idx}</span>
                      <span className="flex-1 text-[12px] font-semibold tracking-tight" style={{ color: s.status === "missing" ? C.blueViolet : C.navyBlack }}>{s.label}</span>
                      <Tag color={sc(s.status)} small>{sl(s.status)}</Tag>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <Btn primary className="px-6 py-3.5">빠진 장표 템플릿 추가</Btn>
              <Btn className="px-6 py-3.5">제안서 순서 재구성</Btn>
              <Btn className="px-6 py-3.5">구조 진단 리포트 다운로드</Btn>
              <Btn ghost onClick={() => setPage("transform")} className="px-6 py-3.5">스타일 변환으로 이동 →</Btn>
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
    <div>
      <NavBar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "transform" && <TransformPage />}
      {page === "search" && <SearchPage />}
      {page === "diagnosis" && <DiagnosisPage setPage={setPage} />}
    </div>
  );
}
