// UI strings (menus, buttons, labels, status words). Content lives in src/content/. Terms follow docs/glossary.md;
// English wording follows DESIGN.md 1장 "UI 문구 어조". `{name}` marks a value filled in by t(lang, key, vars).
import { CAPABILITIES, DOMAINS } from '../content.config';

export type Lang = 'en' | 'ko';
export const LANGS: Lang[] = ['en', 'ko'];

const ui = {
  // Shell (DESIGN.md 5.1–5.4, 9장)
  skip: { en: 'Skip to content', ko: '본문 바로가기' },
  profile: { en: 'Profile', ko: '프로필' },
  email: { en: 'Email', ko: '이메일' },
  cv: { en: 'Download CV (PDF)', ko: 'CV 다운로드 (PDF)' },
  cvKey: { en: 'CV', ko: 'CV' },
  cvPdf: { en: 'Download PDF', ko: 'PDF 다운로드' },
  menu: { en: 'Menu', ko: '메뉴' },
  openMenu: { en: 'Open menu', ko: '메뉴 열기' },
  closeMenu: { en: 'Close menu', ko: '메뉴 닫기' },
  sections: { en: 'Sections', ko: '섹션' },
  language: { en: 'Language', ko: '언어' },
  theme: { en: 'Theme', ko: '테마' },
  // Language link shows and reads the *other* language (DESIGN.md 5.3).
  otherLang: { en: 'KO', ko: 'EN' },
  switchLang: { en: '한국어로 보기', ko: 'View in English' },
  // Other language's name, in that language (CV toolbar, 6.4).
  otherLangName: { en: '한국어', ko: 'English' },
  toggleTheme: { en: 'Toggle dark mode', ko: '다크 모드 전환' },

  // Section names (DESIGN.md 6.2)
  about: { en: 'About', ko: '소개' },
  work: { en: 'Selected Work', ko: '대표 프로젝트' },
  experience: { en: 'Experience', ko: '경력' },
  teaching: { en: 'Teaching · Books · Advisory', ko: '강의 · 저서 · 자문' },
  awards: { en: 'Awards & Education', ko: '수상 · 학력' },
  personal: { en: 'Personal Projects', ko: '개인 프로젝트' },
  ip: { en: 'IP & Publications', ko: '지식재산 · 출판물' },
  contact: { en: 'Contact', ko: '연락처' },

  // Tab names (DESIGN.md 5.2)
  tab_about: { en: 'About', ko: '소개' },
  tab_work: { en: 'Work', ko: '대표 프로젝트' },
  tab_experience: { en: 'Experience', ko: '경력' },
  tab_personal: { en: 'Personal', ko: '개인 프로젝트' },
  tab_ip: { en: 'Publications', ko: '지식재산 · 출판물' },
  tab_contact: { en: 'Contact', ko: '연락처' },

  // Section head counts (5.13)
  workCount: { en: '{n} / {total} projects', ko: '{n} / {total} 건' },
  orgCount: { en: '{n} organizations', ko: '{n} 곳' },
  recordCount: { en: '{n} records', ko: '총 {n}건' },

  // Record kinds: stats labels (5.17), IP drawers (5.21), group labels (5.22), CV sections (6.4)
  projects: { en: 'Projects', ko: '프로젝트' },
  patents: { en: 'Patents', ko: '특허' },
  software: { en: 'Software', ko: '프로그램 등록' },
  papers: { en: 'Papers', ko: '논문' },
  reports: { en: 'Reports', ko: '연구보고서' },
  books: { en: 'Books', ko: '저서' },
  teachingKind: { en: 'Teaching', ko: '강의' },
  advisory: { en: 'Advisory', ko: '자문' },
  awardsGroup: { en: 'Awards', ko: '수상' },
  education: { en: 'Education', ko: '학력' },

  // Stats table (5.17) and drawer summaries (5.21)
  atAGlance: { en: 'At a glance', ko: '숫자로 보기' },
  featuredCount: { en: '{n} featured', ko: '대표 {n}건' },
  // NBSP before "·": a wrapped line never starts with the separator (6.17, 7.1).
  regFiled: { en: '{reg} registered\u00a0· {filed} filed', ko: '등록 {reg}\u00a0· 출원 {filed}' },
  regPending: {
    en: '{reg} registered\u00a0· {pending} pending',
    ko: '등록 {reg}\u00a0· 등록 진행 중 {pending}',
  },
  selectedCount: { en: '{n} selected', ko: '대표 {n}' },
  withDoi: { en: 'with DOI', ko: 'DOI 연결' },

  // Badges and status words (5.7, glossary 9.2)
  lead: { en: 'Lead', ko: '총괄' },
  selected: { en: 'Selected', ko: '대표' },
  inProgress: { en: 'In progress', ko: '진행 중' },
  present: { en: 'Present', ko: '현재' },
  registered: { en: 'Registered', ko: '등록' },
  filed: { en: 'Filed', ko: '출원' },
  filing: { en: 'Filing in progress', ko: '출원 진행 중' },
  pending: { en: 'Pending', ko: '등록 진행 중' },
  // Personal project status (5.20)
  status_active: { en: 'Active', ko: '운영 중' },
  'status_in-progress': { en: 'In progress', ko: '진행 중' },
  status_archived: { en: 'Archived', ko: '보관' },

  // Selected work and ledger (5.18, 5.19)
  outcome: { en: 'Outcome', ko: '성과' },
  allProjects: { en: 'All Projects', ko: '전체 프로젝트' },
  domain: { en: 'Domain', ko: '도메인' },
  capability: { en: 'Capability', ko: '역량' },
  allDomains: { en: 'All domains', ko: '모든 도메인' },
  allCapabilities: { en: 'All capabilities', ko: '모든 역량' },
  clearFilters: { en: 'Clear filters', ko: '필터 해제' },
  showing: { en: 'Showing {n} of {total} projects', ko: '전체 {total}건 중 {n}건 표시' },
  noMatch: { en: 'No projects match these filters.', ko: '조건에 맞는 프로젝트가 없습니다.' },
  showAll: { en: 'Show all ({n})', ko: '모두 보기 ({n})' },
  showLess: { en: 'Show less', ko: '접기' },

  // Personal projects (5.20)
  all: { en: 'All', ko: '전체' },
  repository: { en: 'Repository', ko: '저장소' },
  liveDemo: { en: 'Live demo', ko: '데모' },

  // Contact and copy button (5.8, 5.23)
  openTo: { en: 'Open to', ko: '의뢰 가능 분야' },
  reachMe: { en: 'Reach me', ko: '연락 방법' },
  copy: { en: 'Copy', ko: '복사' },
  copied: { en: 'Copied', ko: '복사됨' },
  // aria-label starts with the visible word (label in name, 9장).
  copyEmail: { en: 'Copy email address: {email}', ko: '이메일 주소 복사: {email}' },
  emailCopied: { en: 'Email address copied', ko: '이메일 주소를 복사했습니다' },

  // Footer (5.5)
  lastUpdated: { en: 'Last updated', ko: '최종 수정' },
  siteSource: { en: 'Site source', ko: '사이트 소스' },
  backToTop: { en: 'Back to top', ko: '맨 위로' },

  // Case study (5.24, 6.3)
  projectFacts: { en: 'Project facts', ko: '프로젝트 정보' },
  onThisPage: { en: 'On this page', ko: '이 페이지' },
  caseStudies: { en: 'Case studies', ko: '케이스 스터디 목록' },
  previous: { en: 'Previous', ko: '이전' },
  next: { en: 'Next', ko: '다음' },
  client: { en: 'Client', ko: '고객' },
  organization: { en: 'Organization', ko: '소속' },
  period: { en: 'Period', ko: '기간' },
  role: { en: 'Role', ko: '역할' },
  stack: { en: 'Stack', ko: '기술 스택' },
  cs_context: { en: 'Context', ko: '배경' },
  cs_problem: { en: 'Problem', ko: '문제' },
  cs_role: { en: 'My role', ko: '역할' },
  cs_approach: { en: 'Approach', ko: '접근' },
  cs_arch: { en: 'Architecture', ko: '아키텍처' },
  cs_outcome: { en: 'Outcome', ko: '성과' },
  keyDecisions: { en: 'Key decisions', ko: '주요 결정' },
  decision: { en: 'Decision', ko: '결정' },
  why: { en: 'Why', ko: '이유' },
  tradeoff: { en: 'Trade-off', ko: '트레이드오프' },
  layer: { en: 'Layer', ko: '계층' },
  components: { en: 'Components', ko: '구성 요소' },
  flows: { en: 'Flows', ko: '흐름' },
  // Screen-reader text replacing the → and ↩ flow arrows (5.24.4).
  flowTo: { en: 'to', ko: '연결' },
  flowBack: { en: 'back to', ko: '되돌아감' },

  // CV (6.4, 10장)
  cvTitle: { en: 'CV', ko: '이력서' },
  cv_profile: { en: 'Profile', ko: '소개' },
  cv_skills: { en: 'Skills', ko: '기술' },
  cv_selected: { en: 'Selected Projects', ko: '대표 프로젝트' },
  cv_other: { en: 'Other Projects', ko: '기타 프로젝트' },
  cv_reports: { en: 'Selected Reports', ko: '주요 보고서' },
  cv_teaching: { en: 'Teaching & Advisory', ko: '강의·자문' },
  cv_moreReports: { en: '+{n} more reports at {site}', ko: '보고서 {n}건 더 보기: {site}' },
  print: { en: 'Print / Save PDF', ko: '인쇄 / PDF 저장' },

  // 404 (6.5)
  nf_title: { en: 'Page not found', ko: '페이지를 찾을 수 없습니다' },
  nf_body: {
    en: 'The page you requested does not exist or has moved.',
    ko: '요청하신 페이지가 없거나 주소가 바뀌었습니다.',
  },
  nf_home: { en: 'Go to home', ko: '홈으로' },
  // Goes to the other language's home and is shown in that language (lang attribute).
  nf_other: { en: '한국어 홈', ko: 'English home' },
  nf_sections: { en: 'Sections', ko: '섹션 바로 가기' },
} satisfies Record<string, Record<Lang, string>>;

export type UiKey = keyof typeof ui;

/** UI string; `{name}` slots are filled from `vars`. */
export const t = (lang: Lang, key: UiKey, vars: Record<string, string | number> = {}) =>
  ui[key][lang].replace(/\{(\w+)\}/g, (m, k: string) => String(vars[k] ?? m));

export type Domain = (typeof DOMAINS)[number];
export type Capability = (typeof CAPABILITIES)[number];

// Domain and Capability tags (glossary 6). Content holds the English value; this is the Korean label.
const TAG_KO = {
  'Energy & Utilities': '에너지·유틸리티',
  Manufacturing: '제조',
  'Petrochemical & Steel': '석유화학·철강',
  Healthcare: '헬스케어',
  Robotics: '로보틱스',
  'Public & Legal': '공공·법률',
  'Physical AI': 'Physical AI',
  'LLM Agents & RAG': 'LLM 에이전트·RAG',
  'Anomaly Detection': '이상탐지',
  Forecasting: '예측',
  'Control & Optimization': '제어·최적화',
  'Computer Vision': '컴퓨터 비전',
  MLOps: 'MLOps',
} satisfies Record<Domain | Capability, string>;

export const tag = (lang: Lang, value: Domain | Capability) =>
  lang === 'en' ? value : TAG_KO[value];

// The build does not type-check, so fail it here on a missing or empty string (CLAUDE.md 규칙 2).
const slots = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
for (const [key, v] of Object.entries(ui as Record<string, Record<Lang, string>>)) {
  if (LANGS.some((l) => !v[l]?.trim())) throw new Error(`src/i18n/ui.ts: "${key}" needs en and ko`);
  if (slots(v.en) !== slots(v.ko)) throw new Error(`src/i18n/ui.ts: "${key}" en/ko slots differ`);
}
for (const v of [...DOMAINS, ...CAPABILITIES])
  if (!(TAG_KO as Record<string, string>)[v]?.trim())
    throw new Error(`src/i18n/ui.ts: tag "${v}" needs a Korean label`);

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ym = (lang: Lang, s: string) => {
  const [y, m] = s.split('-');
  // NBSP: "Oct 2026" never splits across lines (7.1).
  return lang === 'ko' ? `${y}.${m}` : `${MON[+m - 1]}\u00a0${y}`;
};

/** Period as shown on the page (DESIGN.md 6.2, 7장): `Mar 2024 – Jan 2025` / `2024.03 – 2025.01`, `– Present` / `– 현재`. */
export const fmtPeriod = (lang: Lang, p: { start: string; end?: string; status?: string }) =>
  p.status === 'present'
    ? `${ym(lang, p.start)} – ${t(lang, 'present')}`
    : p.end && p.end !== p.start
      ? `${ym(lang, p.start)} – ${ym(lang, p.end)}`
      : ym(lang, p.start);

/** Year span for the project ledger (DESIGN.md 5.19, 7장): `2024 – 2025`, one year when equal, `2026 – Present` / `2026 – 현재`. */
export const fmtYears = (lang: Lang, p: { start: string; end?: string; status?: string }) => {
  const s = p.start.slice(0, 4);
  const e = p.status === 'present' ? t(lang, 'present') : p.end?.slice(0, 4);
  return e && e !== s ? `${s} – ${e}` : s;
};

/** Home sections in page order (DESIGN.md 6.2). */
export const SECTIONS = [
  'about',
  'work',
  'experience',
  'teaching',
  'awards',
  'personal',
  'ip',
  'contact',
] as const;
export type SectionId = (typeof SECTIONS)[number];

/** Tabs and the sections each one covers (DESIGN.md 6.2 "탭과 섹션 매핑 규칙"). */
export const TABS: { id: SectionId; covers: SectionId[] }[] = [
  { id: 'about', covers: ['about'] },
  { id: 'work', covers: ['work'] },
  { id: 'experience', covers: ['experience', 'teaching', 'awards'] },
  { id: 'personal', covers: ['personal'] },
  { id: 'ip', covers: ['ip'] },
  { id: 'contact', covers: ['contact'] },
];

/** Language codes as shown in the switch (DESIGN.md 5.4); the same on both pages. */
export const LANG_CODE: Record<Lang, string> = { en: 'EN', ko: 'KO' };

/** Home URL for a language (trailingSlash: 'always'). */
export const homePath = (lang: Lang) => (lang === 'en' ? '/' : '/ko/');

/**
 * The same page in language `to` (DESIGN.md 6.1): `/x/` ↔ `/ko/x/`. Also for hreflang (6.6).
 * 404 goes to the language home, since the same path may not exist in the other language.
 */
export function langPath(path: string, to: Lang): string {
  if (/^\/(ko\/)?404(\.html|\/)?$/.test(path)) return homePath(to);
  const rest = path.replace(/^\/ko\//, '/');
  return to === 'en' ? rest : `/ko${rest}`;
}
