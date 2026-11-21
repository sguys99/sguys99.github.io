// g15 ⑥ 프롬프트 내부 구조 시안 3종. 근거: docs/project-references/legal/systemprompt.md (Hybrid v3, 12,651자).
// 섹션별 글자 수는 "## " 머리 기준으로 나눈 실측(코드 블록 안 "## 제1조", "## 부칙", "## 분석 결과"는 앞 섹션에 합침).
// 개수: 절대 규칙 6, 의도 6, 라우팅 행 6, 최신성 키워드 17, 폴백 단계 6(#0~#5), 전처리 4, 워크플로우 5, 예외 12, 파일 종류 4, frontmatter 필드 8.
import { L, figure, lint, esc } from './lib.mjs';

const SEC = {
  role: [L('Role', '역할 소개'), 236],
  rules: [L('Absolute rules', '절대 규칙'), 662],
  multi: [L('Multi-turn', '멀티턴 처리'), 934],
  exc: [L('Exceptions', '예외 처리'), 734],
  tools: [L('Tool guide', '도구 소개'), 1554],
  repo: [L('Repository layout, schema', '저장소 구조·스키마'), 1670],
  pre: [L('Preprocessing', '전처리 규칙'), 277],
  intent: [L('Intent classes', '의도 분류'), 937],
  route: [L('Routing table', '라우팅 테이블'), 589],
  verify: [L('Verification pipeline', '검증 파이프라인'), 1307],
  fall: [L('Fallback rules', '폴백 규칙'), 1392],
  work: [L('Workflows by task', '작업유형별 워크플로우'), 1664],
  out: [L('Output format', '출력 형식'), 695],
};
const TOTAL = Object.values(SEC).reduce((n, [, c]) => n + c, 0);
const GROUPS = [
  [L('Rules and limits', '규칙과 경계'), ['role', 'rules', 'multi', 'exc']],
  [L('Knowledge of the sources', '지식원 설명'), ['tools', 'repo']],
  [L('Decision rules', '판단 규칙'), ['pre', 'intent', 'route', 'verify', 'fall', 'work']],
  [L('Output', '출력'), ['out']],
];
const pct = (c) => (c * 100) / TOTAL;
const f1 = (x) => `${x.toFixed(1)}%`;

// ---------- A. 문서 지도: 묶음 비율 띠 + 섹션별 길이 막대 ----------
function svgA(l) {
  const BX = 232, SCALE = 28; // 1% = 28
  let y = 72;
  let s = '';
  // 위 100% 띠
  let x = 0;
  GROUPS.forEach(([g, ids], i) => {
    const w = (ids.reduce((n, k) => n + SEC[k][1], 0) / TOTAL) * 720;
    s += `<rect class="seg${i === 1 ? ' acc' : ''}" x="${x}" y="24" width="${w - 2}" height="20" rx="2"/>`;
    const last = i === GROUPS.length - 1;
    s += `<text class="tx" x="${last ? 716 : x}" y="58" text-anchor="${last ? 'end' : 'start'}">${esc(g[l])} ${f1(pct(ids.reduce((n, k) => n + SEC[k][1], 0)))}</text>`;
    x += w;
  });
  s += `<text class="zl" x="0" y="14">${l === 'ko' ? '시스템 프롬프트 12,651자' : 'System prompt, 12,651 characters'}</text>`;
  for (const [g, ids] of GROUPS) {
    y += 16;
    s += `<text class="ct b" x="0" y="${y + 12}">${esc(g[l])}</text>`;
    y += 20;
    for (const k of ids) {
      const [name, c] = SEC[k];
      const p = pct(c);
      s += `<text class="ct" x="16" y="${y + 12}">${esc(name[l])}</text>`;
      s += `<rect class="bar${k === 'repo' ? ' acc' : ''}" x="${BX}" y="${y + 2}" width="${p * SCALE}" height="12" rx="2"/>`;
      s += `<text class="tx${k === 'repo' ? ' acc' : ''}" x="${BX + p * SCALE + 6}" y="${y + 12}">${f1(p)}</text>`;
      y += 22;
    }
  }
  return `<svg viewBox="0 0 720 ${y + 8}" aria-hidden="true" focusable="false">${s}</svg>`;
}

// ---------- B. 요청 처리 단계에 맞춘 프롬프트 섹션 ----------
const ST = [L('Input', '입력'), L('Preprocess', '전처리'), L('Appendix', '별표 확인'), L('Classify', '의도 분류'), L('Retrieve', '조회'), L('Verify', '검증·폴백'), L('Answer', '출력')];
const SX = (i) => i * 104; // 칸 96 + 간격 8
const chip = (id, i, label, sub, y = 72, kind = 'plain', h = 56, span = 1) => ({ id, kind, label, sub, x: SX(i), y, w: 96 * span + 8 * (span - 1), h });
export const b = {
  width: 720,
  height: 364,
  zones: [],
  nodes: [
    chip('c0', 0, L('Multi-turn', '멀티턴\n처리'), L('per-turn intent', '턴마다 새로 분류')),
    chip('c1', 1, L('Normalize', '전처리\n규칙'), L('4 rules', '규칙 4개')),
    chip('c2', 2, L('Fallback #0', '폴백 #0'), L('appendix stop', '별표 즉시 마감')),
    chip('c3', 3, L('Intent\nclasses', '의도\n분류'), L('6 intents', '의도 6가지')),
    chip('c4', 4, L('Routing\ntable', '라우팅\n테이블'), L('6 rows', '6행')),
    chip('c4b', 4, L('Workflows', '워크\n플로우'), L('5 task types', '작업 유형 5개'), 136),
    chip('c5', 5, L('Recency\ncheck', '검증\n파이프라인'), L('17 keywords', '최신성 키워드 17개')),
    chip('c5b', 5, L('Fallback\n#1–#5', '폴백\n#1–#5'), L('no hits, errors', '0건·어긋남·오류'), 136),
    chip('c6', 6, L('Output\nformat', '출력\n형식'), L('quote · source', '원문·출처·면책')),
    { id: 'kn', kind: 'focus', label: L('Knowledge: tool guide · repository layout and schema', '참고 지식: 도구 소개 · 저장소 구조·스키마'), sub: L('read by retrieval and verification', '조회·검증 단계가 참고'), x: SX(3), y: 216, w: 96 * 4 + 8 * 3, h: 48 },
    { id: 'ex', kind: 'logic', label: L('Exceptions · 12 cases', '예외 처리 · 12가지'), sub: L('not found, ambiguous, API errors …', '미발견·모호·API 오류 …'), x: 0, y: 216, w: 96 * 3 + 8 * 2, h: 48 },
  ],
  edges: [
    { from: 'kn', to: 'c4b', style: 'back', pts: [[468, 216], [468, 192]] },
    { from: 'kn', to: 'c5b', style: 'back', pts: [[572, 216], [572, 192]] },
  ],
  raw: {
    base: (l) => {
      // 위: 절대 규칙 띠, 단계 갈매기
      let s = `<rect class="seg" x="0" y="0" width="720" height="24" rx="4"/><text class="ct b" x="12" y="16">${esc(l === 'ko' ? '절대 규칙 6개 · 모든 단계에 적용' : '6 absolute rules · apply to every step')}</text>`;
      s += `<text class="tx" x="708" y="16" text-anchor="end">${esc(l === 'ko' ? '검색 결과만 · 원문 그대로 · 조언 금지 · 출처 · 읽기 전용 · 별표 없음' : 'results only · verbatim · no advice · source · read-only · no appendix')}</text>`;
      ST.forEach((t, i) => {
        const x = SX(i);
        s += `<path class="stg" d="M${x},36 H${x + 90} L${x + 96},48 L${x + 90},60 H${x} ${i ? `L${x + 6},48 Z` : 'Z'}"/>`;
        s += `<text class="stt" x="${x + (i ? 52 : 46)}" y="52" text-anchor="middle">${esc(t[l])}</text>`;
      });
      return s;
    },
    over: (l) => `<text class="tx" x="0" y="292">${esc(l === 'ko' ? '각 상자 = 시스템 프롬프트의 섹션, 아래 줄 = 그 섹션에 든 규칙 수' : 'Each box = one section of the system prompt; second line = rules it holds')}</text>`,
  },
};
const lgB = [
  { kind: 'plain', label: L('Prompt section', '프롬프트 섹션') },
  { kind: 'focus', label: L('Reference knowledge', '참고 지식') },
  { kind: 'logic', label: L('Exception table', '예외 표') },
];

// ---------- C. 숫자로 본 프롬프트 (원장) ----------
const ledger = [
  ['6', L('Absolute rules', '절대 규칙'), L('Answer only from search results; quote verbatim; no legal advice; always cite; read-only; no appendix tables.', '검색 결과로만 답, 원문 그대로 인용, 법적 조언 금지, 출처 필수, 읽기 전용, 별표 미포함')],
  ['6', L('Intents', '의도'), L('Article lookup, history, compare two dates, compare statutes, statistics, meaning search (default).', '조문검색, 이력, 시점 간 비교, 법령 간 비교, 통계, 의미검색(기본값)')],
  ['17', L('Recency keywords', '최신성 키워드'), L('"current", "latest", "now", "this year", "recently amended" … trigger a re-check of the latest text.', '현행, 최신, 지금, 올해, 최근, 개정된 … 이 있으면 저장소 최신 원문으로 다시 확인')],
  ['6', L('Fallback steps', '폴백 단계'), L('#0 appendix gate first, then empty results, off-topic results, keyword query, nothing found, repeated API errors.', '#0 별표 게이트가 가장 먼저, 이어서 0건, 어긋난 결과, 키워드 질의 구성, 미발견, 연쇄 오류'), true],
  ['4 · 8', L('Repository conventions', '저장소 규약'), L('4 file types per statute folder, 8 frontmatter fields, article heading and addenda marker patterns.', '법령 폴더의 파일 4종, frontmatter 필드 8개, 조문 제목·부칙 표시 패턴'), true],
  ['12', L('Exception cases', '예외 상황'), L('Not found, ambiguous, large file, out of scope, interpretation request, source mismatch, API errors …', '법령 미발견, 모호한 질문, 대용량 파일, 범위 외, 해석 요청, 원문 상이, API 오류 …')],
];
function ledgerC(l) {
  return `<ol class="g15-ledger">${ledger
    .map(([n, t, d, acc]) => `<li${acc && n.includes('·') ? ' class="acc"' : ''}><span class="n">${n}</span><div><p class="t">${esc(t[l])}</p><p class="d">${esc(d[l])}</p></div></li>`)
    .join('')}</ol><p class="g15-cap">${esc(l === 'ko' ? '시스템 프롬프트 12,651자 중 약 1/4이 두 지식원과 저장소 규약 설명이다.' : 'About a quarter of the 12,651-character prompt describes the two sources and the repository conventions.')}</p>`;
}

export const group = {
  prompt: { no: '04', title: { en: 'Inside the system prompt', ko: '시스템 프롬프트 구조' }, fig: promptFig, vs: ['prompt-a', 'prompt-b', 'prompt-c'] },
};
export function lintAll() {
  return lint('prompt-b', b);
}
export function promptFig(v, lang, label) {
  const scroll = (svg) => `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${esc(label)}">${svg}</div><p class="hint">${lang === 'ko' ? '그림을 옆으로 밀어 전체를 볼 수 있습니다.' : 'Scroll sideways to see the whole diagram.'}</p></figure>`;
  if (v === 'prompt-a') return scroll(svgA(lang));
  if (v === 'prompt-b') return figure(b, lgB, lang, label);
  return ledgerC(lang);
}
