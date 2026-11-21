// g15 ① Problem 시안 3종: 일상어 질문이 실제로 요구하는 것.
// 근거: legalQ 실서비스 답변(2026-11-21 캡처) — 해고: 근로기준법 제23·26·27·28·30·31·33조, 노동위원회법·행정소송법 참조
//       전세: 전세사기피해자법 제2·3조, 주택임대차보호법·민법 참조 / 해외직구: 관세법 수입물품 면세 조문
//       Seahorse 검색 기본값 top_k=3 (seahorse-vdb-reindex-handoff §3.2), 기본 청크 1,000자 (§1)
import { L, figure, lint, esc } from './lib.mjs';

// ---------- A. 질문 해부: 질문 → 답에 필요했던 근거 → 검색 1회의 한계 ----------
const rowY = [32, 128, 224];
const qa = [
  { q: L('Bought something\noverseas. Taxes?', '해외직구를 했는데\n세금은 어떻게 되나요?') },
  { q: L("Told I'm fired.\nHow can I contest it?", '해고 통보를 받았는데\n구제 방법이 있나요?') },
  { q: L('Lease fraud last year.\nAm I eligible for aid?', '작년에 전세사기를 당했는데\n지원 대상인가요?') },
];
export const a = {
  width: 720,
  height: 368,
  zones: rowY.map((y, i) => ({ id: `r${i}`, x: 0, y, w: 720, h: 84 })),
  nodes: [
    ...qa.map((r, i) => ({ id: `q${i}`, kind: 'input', label: r.q, x: 8, y: rowY[i] + 12, w: 176, h: 56 })),
    { id: 'tax', kind: 'plain', label: L('Customs Act', '관세법'), sub: L('import duty exemptions', '수입물품 면세 조문'), x: 204, y: 44, w: 168, h: 56 },
    { id: 'term', kind: 'logic', label: L('Term mapping', '용어 변환'), sub: L('overseas → customs', '해외직구 → 관세'), x: 384, y: 44, w: 116, h: 56 },
    { id: 'labor', kind: 'plain', label: L('Labor Standards Act', '근로기준법'), sub: L('Art. 23·26·27·28·30·31·33', '제23·26·27·28·30·31·33조'), x: 204, y: 140, w: 168, h: 56 },
    { id: 'labor2', kind: 'plain', label: L('2 related acts', '관련 법령 2개'), sub: L('cited in articles', '노동위원회법·행정소송법'), x: 384, y: 140, w: 116, h: 56 },
    { id: 'fraud', kind: 'plain', label: L('Lease Fraud Victims Act', '전세사기피해자법'), sub: L('Art. 2·3, eligibility', '제2·3조 정의·요건'), x: 204, y: 236, w: 168, h: 56 },
    { id: 'fraud2', kind: 'plain', label: L('2 related acts', '관련 법령 2개'), sub: L('cited in criteria', '주택임대차보호법·민법'), x: 384, y: 236, w: 116, h: 56 },
    { id: 'add', kind: 'logic', label: L('Addenda', '부칙'), sub: L('timing', '시행 시점'), x: 512, y: 236, w: 64, h: 56 },
  ],
  edges: [
    { from: 'q0', to: 'tax', pts: [[184, 72], [204, 72]] },
    { from: 'q1', to: 'labor', pts: [[184, 168], [204, 168]] },
    { from: 'q2', to: 'fraud', pts: [[184, 264], [204, 264]] },
  ],
  raw: {
    base: (l) =>
      [
        [8, L('Question', '질문')],
        [204, L('What the answer needed', '답에 필요했던 근거')],
        [596, L('Limit of one search', '검색 1회의 한계')],
      ]
        .map(([x, t]) => `<text class="zl" x="${x}" y="16">${esc(t[l])}</text>`)
        .join(''),
    over: (l) => {
      const why = [
        [L('No statute name', '질문에 법령명도'), L('or legal term', '법률 용어도 없음'), ''],
        [L('7 articles needed,', '답은 조문 7개,'), L('top 3 by default', '기본 검색 결과는 3개'), ' acc'],
        [L('3 statutes, plus', '법령 3개에 걸치고'), L('timing in addenda', '시점은 부칙으로'), ''],
      ];
      return why
        .map(([t1, t2, c], i) => `<text class="ct${c}" x="596" y="${rowY[i] + 36}">${esc(t1[l])}</text><text class="ct${c}" x="596" y="${rowY[i] + 54}">${esc(t2[l])}</text>`)
        .join('');
    },
  },
};
const lgA = [
  { kind: 'input', label: L('User question', '이용자 질문') },
  { kind: 'plain', label: L('Statutes and articles cited', '인용한 법령·조문') },
  { kind: 'logic', label: L('Agent reasoning', '에이전트 판단') },
];

// ---------- B. 질의 유형 × 방식 매트릭스 (HTML 표) ----------
const DOT = {
  y: '<svg class="dt" viewBox="0 0 12 12" width="12" height="12"><circle cx="6" cy="6" r="5"/></svg>',
  p: '<svg class="dt" viewBox="0 0 12 12" width="12" height="12"><circle class="o" cx="6" cy="6" r="4.5"/><path d="M6 1.5 A4.5 4.5 0 0 0 6 10.5 Z"/></svg>',
  n: '<svg class="dt" viewBox="0 0 12 12" width="12" height="12"><circle class="o" cx="6" cy="6" r="4.5"/></svg>',
};
const rowsB = [
  [L('Everyday-language situation', '일상어 상황 질문'), 'y', 'n', 'y', L('keyword search needs legal terms', '키워드 검색은 법률 용어가 필요')],
  [L('Statute name + article number', '법령명 + 조문번호'), 'p', 'y', 'y', L('default chunks ignored article bounds', '기본 청크는 조문 경계를 모름')],
  [L('Answer across many articles', '여러 조문·법령에 걸친 답'), 'p', 'p', 'y', L('3 results by default; whole files are heavy', '기본 결과 3개, 파일 전체는 무거움')],
  [L('Latest amendment', '최신 개정 반영'), 'p', 'y', 'y', L('index lags behind the repository', '색인이 저장소보다 늦을 수 있음')],
  [L('Revision history, past text', '개정 이력·과거 원문'), 'n', 'y', 'y', L('no Git history in the vector DB', '벡터 DB에는 Git 이력이 없음')],
  [L('Counts by ministry or type', '소관부처·구분별 개수'), 'n', 'p', 'p', L('search caps at 1,000 hits, approximate', '검색 1,000건 상한, 근사치')],
];
function tableB(lang) {
  const h = lang === 'ko' ? ['질의 유형', '벡터 DB 1회', '저장소 1회', '에이전트', '이유'] : ['Question type', 'Vector DB once', 'Repository once', 'Agent', 'Why'];
  const nm = { y: lang === 'ko' ? '잘 됨' : 'works', p: lang === 'ko' ? '일부' : 'partly', n: lang === 'ko' ? '어려움' : 'hard' };
  const cell = (v, ag) => `<td class="dot${ag ? ' ag' : ''} ${v}" data-l="${ag ? h[3] : ''}"><span aria-hidden="true">${DOT[v]}</span><span class="sr-only">${nm[v]}</span></td>`;
  return `<table class="g15-tbl mx"><thead><tr>${h.map((x, i) => `<th scope="col"${i === 3 ? ' class="ag"' : ''}>${x}</th>`).join('')}</tr></thead><tbody>
${rowsB
  .map(([t, v1, v2, v3, why]) => `<tr><th scope="row">${esc(t[lang])}</th><td class="dot ${v1}" data-l="${h[1]}"><span aria-hidden="true">${DOT[v1]}</span><span class="sr-only">${nm[v1]}</span></td><td class="dot ${v2}" data-l="${h[2]}"><span aria-hidden="true">${DOT[v2]}</span><span class="sr-only">${nm[v2]}</span></td>${cell(v3, true)}<td class="why" data-l="${h[4]}">${esc(why[lang])}</td></tr>`)
  .join('')}</tbody></table>
<p class="g15-key"><span>${DOT.y} ${nm.y}</span><span>${DOT.p} ${nm.p}</span><span>${DOT.n} ${nm.n}</span></p>`;
}

// ---------- C. 전후 대비: 벡터 DB 1회 조회 vs 에이전트 ----------
export const c = {
  width: 720,
  height: 404,
  zones: [
    { id: 'before', label: L('Before · one vector search', '이전 · 벡터 DB 1회 조회'), x: 0, y: 0, w: 720, h: 152 },
    { id: 'after', label: L('After · agent with two sources', '이후 · 두 지식원을 쓰는 에이전트'), x: 0, y: 168, w: 720, h: 176 },
  ],
  nodes: [
    { id: 'b1', kind: 'input', label: L('Question', '질문'), x: 16, y: 40, w: 112, h: 40 },
    { id: 'b2', kind: 'logic', label: L('Hybrid search', '하이브리드 검색'), sub: L('one call', '1회 호출'), x: 176, y: 40, w: 136, h: 40 },
    { id: 'b3', kind: 'logic', label: L('3 chunks', '청크 3개'), sub: L('1,000 characters each', '1,000자 단위'), x: 360, y: 40, w: 136, h: 40 },
    { id: 'b4', kind: 'llm', label: L('Answer', '답변 생성'), x: 544, y: 40, w: 160, h: 40 },
    { id: 'a1', kind: 'input', label: L('Question', '질문'), x: 16, y: 236, w: 112, h: 40 },
    { id: 'a2', kind: 'focus', label: L('Agent', '에이전트'), sub: L('intent → route → verify', '의도 → 경로 → 검증'), x: 176, y: 228, w: 160, h: 56 },
    { id: 't1', kind: 'logic', label: L('Vector DB', '벡터 DB'), sub: L('find by meaning', '의미로 찾기'), x: 392, y: 200, w: 136, h: 40 },
    { id: 't2', kind: 'logic', label: L('Statute file', '법령 파일'), sub: L('exact current text', '정확한 현행 원문'), x: 392, y: 248, w: 136, h: 40 },
    { id: 't3', kind: 'logic', label: L('History, stats', '이력·통계'), sub: L('commits · metadata', '커밋·메타데이터'), x: 392, y: 296, w: 136, h: 40 },
    { id: 'a3', kind: 'llm', label: L('Verbatim answer', '원문 인용 답변'), sub: L('source · disclaimer', '출처·면책'), x: 576, y: 236, w: 128, h: 40 },
  ],
  edges: [
    { from: 'b1', to: 'b2', pts: [[128, 60], [176, 60]] },
    { from: 'b2', to: 'b3', pts: [[312, 60], [360, 60]] },
    { from: 'b3', to: 'b4', pts: [[496, 60], [544, 60]] },
    { from: 'a1', to: 'a2', pts: [[128, 256], [176, 256]] },
    { from: 'a2', to: 't1', style: 'both', pts: [[336, 240], [352, 240], [352, 220], [392, 220]] },
    { from: 'a2', to: 't2', style: 'both', pts: [[336, 256], [364, 256], [364, 268], [392, 268]] },
    { from: 'a2', to: 't3', style: 'both', pts: [[336, 272], [348, 272], [348, 316], [392, 316]], label: { text: L('REPEAT AS NEEDED', '필요한 만큼 반복'), x: 256, y: 304 } },
    { from: 'a2', to: 'a3', pts: [[304, 228], [304, 192], [640, 192], [640, 236]] },
  ],
  raw: {
    over: (l) => {
      const pains = [
        [L('Chunks split articles', '조문이 청크 경계에서 잘림'), 176],
        [L('Needs more than 3', '필요한 조문이 3개 초과'), 360],
        [L('No revision history', '개정 이력·과거 원문 없음'), 544],
      ];
      return pains
        .map(([t, x], i) => `<circle class="mkc" cx="${x + 8}" cy="${116}" r="8"/><text class="mkt" x="${x + 8}" y="${119}" text-anchor="middle">${i + 1}</text><text class="ct" x="${x + 24}" y="${120}">${esc(t[l])}</text>`)
        .join('');
    },
  },
};
const lgC = [
  { kind: 'input', label: L('Question', '질문') },
  { kind: 'logic', label: L('Search, file, data', '검색·파일·데이터') },
  { kind: 'llm', label: L('LLM call', 'LLM 호출') },
  { kind: 'focus', label: L('Agent loop', '에이전트 반복') },
];

export function problemLint() {
  return lint('problem-a', a) + lint('problem-c', c);
}

export function problemFig(v, lang, label) {
  if (v === 'problem-a') return figure(a, lgA, lang, label);
  if (v === 'problem-b') return `<div class="g15-mx">${tableB(lang)}</div>`;
  return figure(c, lgC, lang, label);
}
