// g17 구분자 시안: 안 A·B·C의 규칙 (docs/anti-ai-slop-plan.md 2.1, 5.3). shoot.mjs(화면 적용)와 make.mjs(비교 페이지)가 함께 쓴다.
// 자리 성격: (1) 키워드 나열  (2) 필드 구분  (3) 문서 제목(순수 텍스트)  (4) 라벨 안 병렬(국문)  (5) 빈 날짜.
// 'base'는 지금 사이트(바꾸지 않음). 색·간격은 tokens.css 변수만 쓴다(shoot.mjs의 CSS).

const NB = '\u00a0';

// (4) 분야·역량 국문 이름 13개. 영문 값은 모든 안에서 그대로(이미 `&`).
export const TAG_EN = [
  'Energy & Utilities',
  'Manufacturing',
  'Petrochemical & Steel',
  'Healthcare',
  'Robotics',
  'Public & Legal',
  'Physical AI',
  'LLM Agents & RAG',
  'Anomaly Detection',
  'Forecasting',
  'Control & Optimization',
  'Computer Vision',
  'MLOps',
];
export const TAG_KO_BASE = {
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
};
const SLASH = {
  '에너지·유틸리티': '에너지/유틸리티',
  '석유화학·철강': '석유화학/철강',
  '공공·법률': '공공/법률',
  'LLM 에이전트·RAG': 'LLM 에이전트/RAG',
  '제어·최적화': '제어/최적화',
};
// 받침: 지(없음)→와, 학(ㄱ)→과, 공(ㅇ)→과, 트(없음)→와, 어(없음)→와
const WA = {
  '에너지·유틸리티': '에너지와 유틸리티',
  '석유화학·철강': '석유화학과 철강',
  '공공·법률': '공공과 법률',
  'LLM 에이전트·RAG': 'LLM 에이전트와 RAG',
  '제어·최적화': '제어와 최적화',
};

export const VARIANTS = {
  A: {
    name: '글자 구분',
    intent:
      '중간점 자리에 같은 일을 하는 글자를 하나씩 정해 넣는다. 나열은 쉼표, 필드는 슬래시, 문서 제목은 세로 막대. 화면 구조는 그대로.',
    pros: '구현이 가장 단순(ui.ts와 join 문자열만 교체). 복사, 스크린 리더, PDF에서 보이는 그대로 읽힘.',
    cons: '슬래시가 이미 다른 뜻으로 쓰임(`03 / 08`, `GPA 3.83 / 4.3`, 영문 직함 `Director / AI Product Engineer`, 개인 프로젝트 스택 줄). 같은 줄에 뜻이 다른 슬래시가 섞임.',
    rules: {
      1: { en: '쉼표 `, ` (제목은 `Teaching, Books & Advisory`)', ko: '쉼표 `, ` (`강의, 저서, 자문`, `지식재산, 출판물`)' },
      2: { en: '`NBSP/ ` (`GenON / Global F&B company`)', ko: '`NBSP/ ` (`PwC 컨설팅 / 삼성전자`)' },
      3: { en: '` | ` (`Kwang Myung Yu | AI Engineer`)', ko: '` | ` (`유광명 | AI Engineer`)' },
      4: { en: '`&` 유지', ko: '`/` 붙여 씀 (`제어/최적화`)' },
      5: { en: '빈칸', ko: '빈칸' },
    },
  },
  B: {
    name: '문장 부호와 말',
    intent:
      '이력서 본문처럼 읽히게 한다. 나열은 쉼표, 두 말은 "와/과", 덧붙는 정보는 괄호, 문서 제목은 쉼표. 기호를 늘리지 않는다.',
    pros: '가장 자연스럽게 읽힘(`M.S. in Electrical Engineering (Control & network optimization)`, `AgiBot X2 Ultra (Selected)`). 스크린 리더가 그대로 읽어도 매끄러움.',
    cons: '자리마다 쉼표와 괄호 중 골라야 해 규칙이 둘. 쉼표가 든 값(`Director, R&D Group, GenON`, 캡션의 날짜) 옆은 괄호로 피해야 함. 국문 문서 제목의 쉼표가 어색(`페이지를 찾을 수 없습니다, 유광명`). "와/과" 라벨이 길어짐.',
    rules: {
      1: { en: '쉼표 `, ` (제목은 `Teaching, Books & Advisory`)', ko: '셋 이상 쉼표, 둘은 "와/과" (`강의, 저서, 자문`, `지식재산과 출판물`)' },
      2: { en: '소속/고객은 쉼표, 덧붙는 값은 괄호 (`AI Engineer (Director, R&D Group, GenON)`)', ko: '같음 (`PwC 컨설팅, 삼성전자`, `AgiBot X2 Ultra (선정)`)' },
      3: { en: '쉼표 `, ` (`Kwang Myung Yu, AI Engineer`), 이름 + CV는 띄어쓰기', ko: '쉼표 (`유광명, AI Engineer`), 이름 + 이력서는 띄어쓰기' },
      4: { en: '`&` 유지', ko: '"와/과" (`제어와 최적화`)' },
      5: { en: '빈칸', ko: '빈칸' },
    },
  },
  C: {
    name: '여백과 선',
    intent:
      '화면에서는 글자를 넣지 않고 가는 세로선(--line-strong)과 간격(--sp-2)으로 나눈다. 스크린 리더와 복사 텍스트에는 숨긴 쉼표가 남는다. 문서 제목은 세로 막대, PDF 바닥글은 전각 공백.',
    pros: '구분 기호가 글자로 보이지 않아 표나 원장 같은 인상이 가장 조용함. 줄 머리 선은 잘려 보이지 않음(줄바꿈 걱정 없음). 라벨 안 `/`와 섞여도 모양이 달라 구분됨.',
    cons: 'ui.ts 문자열을 배열/마크업으로 바꾸고 컴포넌트마다 구조를 바꿔야 해 구현 범위가 가장 큼. CSS `content`와 `attr()` 자리(원장 모바일, 기종 비교 라벨)와 SVG는 별도 처리. PDF는 글자 묶음이 갈라져 글자 위치 확인이 필요.',
    rules: {
      1: { en: '세로선 + 숨긴 쉼표', ko: '세로선 + 숨긴 쉼표' },
      2: { en: '세로선 + 숨긴 쉼표', ko: '세로선 + 숨긴 쉼표' },
      3: { en: '` | ` (PDF 바닥글만 전각 공백)', ko: '` | ` (PDF 바닥글만 전각 공백)' },
      4: { en: '`&` 유지', ko: '`/` 붙여 씀 (`제어/최적화`)' },
      5: { en: '짧은 가는 선(CSS)', ko: '짧은 가는 선(CSS)' },
    },
  },
};

/** 브라우저에 넘길 규칙 (shoot.mjs의 apply()가 읽는다). 배열 값 = 세로선 목록(C). */
export function rules(v, lang) {
  if (v === 'base') return { v };
  const ko = lang === 'ko';
  const common = {
    v,
    lang,
    roleLine: true, // CV 역할: 모든 안에서 인쇄처럼 다음 줄로 (기호 없음)
  };
  if (v === 'A')
    return {
      ...common,
      mode: 'glyph',
      list: ', ',
      field: { t: 'sep', s: NB + '/ ' },
      logo: { t: 'sep', s: '/ ' },
      head: { t: 'sep', s: NB + '/ ' },
      edu: { t: 'sep', s: NB + '/ ' },
      pick: { t: 'sep', s: NB + '/ ' },
      cap: { t: 'sep', s: NB + '/ ' },
      texts: ko
        ? { '강의 · 저서 · 자문': '강의, 저서, 자문', '지식재산 · 출판물': '지식재산, 출판물', '강의·자문': '강의, 자문' }
        : { 'Teaching · Books · Advisory': 'Teaching, Books & Advisory' },
      tags: ko ? SLASH : {},
      svg: 'LLM, STT, TTS',
      empty: '',
      title: { sep: ' | ' },
      foot: { sep: ' | ' },
    };
  if (v === 'B')
    return {
      ...common,
      mode: 'glyph',
      list: ', ',
      field: { t: 'sep', s: ', ' },
      logo: { t: 'comma' },
      head: { t: 'paren' },
      edu: { t: 'paren' },
      pick: { t: 'paren' },
      cap: { t: 'paren' },
      texts: ko
        ? { '강의 · 저서 · 자문': '강의, 저서, 자문', '지식재산 · 출판물': '지식재산과 출판물', '강의·자문': '강의와 자문' }
        : { 'Teaching · Books · Advisory': 'Teaching, Books & Advisory' },
      tags: ko ? WA : {},
      svg: 'LLM, STT, TTS',
      empty: '',
      title: { sep: ', ', cv: ' ' },
      foot: { cv: ' ', sep: ', ' }, // `이름 이력서, host`
    };
  return {
    ...common,
    mode: 'rule',
    field: { t: 'rule' },
    logo: { t: 'rule' },
    head: { t: 'rule' },
    edu: { t: 'rule' },
    pick: { t: 'rule' },
    cap: { t: 'rule' },
    texts: ko
      ? { '강의 · 저서 · 자문': ['강의', '저서', '자문'], '지식재산 · 출판물': ['지식재산', '출판물'], '강의·자문': ['강의', '자문'] }
      : { 'Teaching · Books · Advisory': ['Teaching', 'Books', 'Advisory'] },
    // 탭·메뉴·404 목록의 링크 안에는 선을 넣지 않는다(링크가 둘로 보임) → 쉼표 글자
    linkTexts: ko
      ? { '강의 · 저서 · 자문': '강의, 저서, 자문', '지식재산 · 출판물': '지식재산, 출판물' }
      : { 'Teaching · Books · Advisory': 'Teaching, Books & Advisory' },
    tags: ko ? SLASH : {},
    svg: ['LLM', 'STT', 'TTS'],
    empty: 'rule',
    title: { sep: ' | ' },
    foot: { sep: '\u2003' }, // 전각 공백: @page margin box는 CSS 선을 못 그림
  };
}

/** 분야·역량 국문 이름: 안별 */
export const tagKo = (v, en) => {
  const b = TAG_KO_BASE[en];
  if (v === 'B') return WA[b] ?? b;
  if (v === 'A' || v === 'C') return SLASH[b] ?? b;
  return b;
};
