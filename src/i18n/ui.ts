// UI strings (menus, buttons, labels). Content lives in src/content/. Terms follow docs/glossary.md.
// Minimal set for the layout shell (tasks 5.3); tasks 5.7 completes it.

export type Lang = 'en' | 'ko';

const ui = {
  skip: { en: 'Skip to content', ko: '본문 바로가기' },
  profile: { en: 'Profile', ko: '프로필' },
  now: { en: 'Now', ko: '현재' },
  email: { en: 'Email', ko: '이메일' },
  cv: { en: 'Download CV', ko: 'CV 다운로드' },
  placeholder: { en: 'Placeholder', ko: '자리 표시' },
  menu: { en: 'Menu', ko: '메뉴' },
  openMenu: { en: 'Open menu', ko: '메뉴 열기' },
  closeMenu: { en: 'Close menu', ko: '메뉴 닫기' },
  sections: { en: 'Sections', ko: '섹션' },
  language: { en: 'Language', ko: '언어' },
  theme: { en: 'Theme', ko: '테마' },
  // Language link shows and reads the *other* language (DESIGN.md 5.3).
  otherLang: { en: 'KO', ko: 'EN' },
  switchLang: { en: '한국어로 보기', ko: 'View in English' },
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
} satisfies Record<string, Record<Lang, string>>;

export type UiKey = keyof typeof ui;

export const t = (lang: Lang, key: UiKey) => ui[key][lang];

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
