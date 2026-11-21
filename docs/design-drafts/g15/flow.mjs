// g15 ④ Service flow(의도 라우팅) 시안 3종. 근거: systemprompt.md 의도 분류, 라우팅 테이블, VDB→MCP 선택적 검증,
// 폴백 규칙 #0~#3, 작업유형별 워크플로우. C의 질문은 규칙 설명용 예(최신성 신호 "현행" → 저장소 원문 재확인), 제26조는 근로기준법 해고의 예고.
import { L, figure, lint, esc } from './lib.mjs';

// ---------- A. 의도 6행 × 두 지식원 레인 ----------
const VP = 172, VC = 304, RP = 452, RC = 588; // 레인별 1차·조건부 칸
const rowsA = [
  { y: 168, h: 88, t: L('Meaning search', '의미 검색'), s: L('default', '기본값') },
  { y: 268, h: 40, t: L('Article lookup', '조문 검색') },
  { y: 320, h: 40, t: L('Revision history', '개정 이력') },
  { y: 372, h: 40, t: L('Compare two dates', '시점 간 비교') },
  { y: 424, h: 40, t: L('Compare statutes', '법령 간 비교') },
  { y: 476, h: 40, t: L('Statistics', '통계') },
];
export const a = {
  width: 720,
  height: 644,
  zones: [
    { id: 'vl', label: L('Vector DB · Seahorse MCP', '벡터 DB · Seahorse MCP'), x: 160, y: 136, w: 268, h: 392 },
    { id: 'rl', label: L('Repository · GitHub MCP', '법령 저장소 · GitHub MCP'), x: 440, y: 136, w: 280, h: 392 },
  ],
  nodes: [
    { id: 'q', kind: 'input', label: L('Question', '질문'), x: 0, y: 4, w: 96, h: 40 },
    { id: 'pre', kind: 'logic', label: L('Preprocess', '전처리'), sub: L('normalize names', '공백·가운뎃점 정규화'), x: 120, y: 4, w: 136, h: 40 },
    { id: 'gate', kind: 'decision', label: L('Appendix?', '별표?'), x: 280, y: 0, w: 112, h: 48 },
    { id: 'app', kind: 'plain', label: L('Point to law.go.kr', '국가법령정보센터 안내'), sub: L('stop, no more calls', '추가 호출 없이 마감'), x: 424, y: 4, w: 168, h: 40 },
    { id: 'cls', kind: 'llm', label: L('Classify intent', '의도 분류'), sub: L('6 intents', '의도 6가지'), x: 280, y: 76, w: 112, h: 40 },
    // 1 의미 검색
    { id: 'v1', kind: 'logic', label: L('search'), sub: L('by meaning', '의미 검색'), x: VP, y: 192, w: 112, h: 40 },
    { id: 'r1a', kind: 'new', label: L('get_file_contents'), sub: L('if recency signal', '최신성 신호가 있으면'), x: RC, y: 168, w: 128, h: 40 },
    { id: 'r1b', kind: 'input', label: L('search_code'), sub: L('if empty or off-topic', '0건·어긋나면'), x: RC, y: 216, w: 128, h: 40 },
    // 2 조문 검색
    { id: 'r2', kind: 'logic', label: L('get_file_contents'), sub: L('straight to the path', '경로로 직행'), x: RP, y: 268, w: 128, h: 40 },
    { id: 'v2', kind: 'input', label: L('search'), sub: L('if 404, check name', '404면 법령명 확인'), x: VC, y: 268, w: 112, h: 40 },
    // 3 개정 이력
    { id: 'v3', kind: 'logic', label: L('search'), sub: L('"<statute> addenda"', '"법령명 부칙"'), x: VP, y: 320, w: 112, h: 40 },
    { id: 'r3', kind: 'input', label: L('get_file_contents'), sub: L('else parse addenda', '부족하면 부칙 파싱'), x: RC, y: 320, w: 128, h: 40 },
    // 4 시점 간 비교
    { id: 'r4', kind: 'logic', label: L('list_commits → get_file_contents ×2'), sub: L('two commits by date', '두 시점의 커밋'), x: RP, y: 372, w: 264, h: 40 },
    // 5 법령 간 비교
    { id: 'r5', kind: 'logic', label: L('get_file_contents ×N'), sub: L('one call per statute', '법령마다 1회'), x: RP, y: 424, w: 144, h: 40 },
    { id: 'v5', kind: 'input', label: L('search'), sub: L('if by topic', '주제 기반이면'), x: VC, y: 424, w: 112, h: 40 },
    // 6 통계
    { id: 'r6', kind: 'logic', label: L('search_code'), sub: L('frontmatter · approx.', 'frontmatter · 근사치'), x: RP, y: 476, w: 128, h: 40 },
    { id: 'ans', kind: 'llm', label: L('Verbatim quote · source · disclaimer', '원문 인용 · 출처 · 면책'), sub: L('article, paragraph, and item numbers as written', '조·항·호 번호 그대로'), x: 160, y: 556, w: 560, h: 40 },
  ],
  edges: [
    { from: 'q', to: 'pre', pts: [[96, 24], [120, 24]] },
    { from: 'pre', to: 'gate', pts: [[256, 24], [280, 24]] },
    { from: 'gate', to: 'app', pts: [[392, 24], [424, 24]], label: { text: L('YES', '예'), x: 408, y: 14 } },
    { from: 'gate', to: 'cls', pts: [[336, 48], [336, 76]], label: { text: L('NO', '아니오'), x: 344, y: 66, anchor: 'start' } },
    { from: 'v1', to: 'r1a', style: 'acc', pts: [[284, 204], [560, 204], [560, 188], [588, 188]] },
    { from: 'v1', to: 'r1b', style: 'back', pts: [[284, 220], [572, 220], [572, 236], [588, 236]] },
    { from: 'r2', to: 'v2', style: 'back', pts: [[452, 288], [416, 288]] },
    { from: 'v3', to: 'r3', style: 'back', pts: [[284, 340], [588, 340]] },
    { from: 'r5', to: 'v5', style: 'back', pts: [[452, 444], [416, 444]] },
    { from: 'vl', to: 'ans', pts: [[294, 528], [294, 556]] },
    { from: 'rl', to: 'ans', pts: [[580, 528], [580, 556]] },
  ],
  raw: {
    under: (l) => {
      let s = `<path class="ln" d="M280,96 H20 Q12,96 12,104 V496"/>`;
      for (const r of rowsA) {
        const cy = r.y + r.h / 2;
        s += `<circle class="spine" cx="12" cy="${cy}" r="3"/><text class="ct b" x="24" y="${cy + (r.s ? -2 : 4)}">${esc(r.t[l])}</text>`;
        if (r.s) s += `<text class="tx" x="24" y="${cy + 14}">${esc(r.s[l])}</text>`;
      }
      return s;
    },
  },
};
const lgA = [
  { kind: 'logic', label: L('First call', '1차 호출') },
  { kind: 'input', label: L('Conditional call', '조건부 호출') },
  { kind: 'acc-line', label: L('Re-check latest text', '최신 원문 재확인') },
  { kind: 'llm', label: L('LLM step', 'LLM 판단') },
];

// ---------- B. 결정 순서도: 왼쪽 의도 판정, 오른쪽 의미 검색 경로 ----------
const DY = [64, 152, 240, 328, 416];
const dLab = [
  [L('Appendix\ndetail?', '별표 세부\n요구?'), L('Point to law.go.kr', '국가법령정보센터 안내'), L('stop, no more calls', '추가 호출 없이 마감'), 'plain'],
  [L('Statute +\narticle no.?', '법령명 +\n조문번호?'), L('get_file_contents'), L('path first, then vector DB', '경로 직행 · 404면 벡터 DB'), 'logic'],
  [L('History?', '개정 이력?'), L('Search addenda', '벡터 DB 부칙 검색'), L('then the file if short', '부족하면 파일의 부칙'), 'logic'],
  [L('Compare?', '비교?'), L('list_commits + files', 'list_commits + 파일'), L('2 dates or N statutes', '두 시점 또는 법령 N개'), 'logic'],
  [L('Counts?', '통계?'), L('search_code'), L('frontmatter, approximate', 'frontmatter · 근사치'), 'logic'],
];
export const b = {
  width: 720,
  height: 576,
  zones: [{ id: 'ms', label: L('Meaning search · default', '의미 검색 · 기본값'), x: 400, y: 48, w: 320, h: 408 }],
  nodes: [
    { id: 'q', kind: 'input', label: L('Question', '질문'), x: 0, y: 0, w: 120, h: 40 },
    { id: 'pre', kind: 'logic', label: L('Preprocess', '전처리'), sub: L('normalize names', '공백·가운뎃점 정규화'), x: 144, y: 0, w: 144, h: 40 },
    ...dLab.flatMap(([d, n, sub, k], i) => [
      { id: `d${i}`, kind: 'decision', label: d, x: 16, y: DY[i], w: 144, h: 64 },
      { id: `a${i}`, kind: k, label: n, sub, x: 192, y: DY[i] + 12, w: 168, h: 40 },
    ]),
    { id: 'm1', kind: 'logic', label: L('Vector DB search', '벡터 DB 검색'), sub: L('Seahorse · hybrid', 'Seahorse · 하이브리드'), x: 448, y: 76, w: 152, h: 40 },
    { id: 'm2', kind: 'decision', label: L('Empty or\noff-topic?', '0건 또는\n어긋남?'), x: 452, y: 148, w: 144, h: 64 },
    { id: 'f1', kind: 'logic', label: L('search_code'), sub: L('keyword fallback', '키워드 폴백'), x: 612, y: 160, w: 100, h: 40 },
    { id: 'm3', kind: 'decision', label: L('Recency\nsignal?', '최신성\n신호?'), x: 452, y: 236, w: 144, h: 64 },
    { id: 'v1', kind: 'focus', label: L('get_file_contents'), sub: L('latest text from the repo', '저장소 최신 원문 재확인'), x: 440, y: 332, w: 168, h: 40 },
    { id: 'ans', kind: 'llm', label: L('Verbatim answer', '원문 인용 답변'), sub: L('source · disclaimer', '출처·면책'), x: 448, y: 404, w: 152, h: 40 },
  ],
  edges: [
    { from: 'q', to: 'pre', pts: [[120, 20], [144, 20]] },
    { from: 'pre', to: 'd0', pts: [[216, 40], [216, 52], [88, 52], [88, 64]] },
    ...DY.map((y, i) => ({ from: `d${i}`, to: `a${i}`, pts: [[160, y + 32], [192, y + 32]], label: { text: L('YES', '예'), x: 176, y: y + 22 } })),
    ...DY.slice(0, 4).map((y, i) => ({ from: `d${i}`, to: `d${i + 1}`, pts: [[88, y + 64], [88, y + 88]], label: { text: L('NO', '아니오'), x: 96, y: y + 80, anchor: 'start' } })),
    { from: 'd4', to: 'm1', pts: [[88, 480], [88, 520], [376, 520], [376, 96], [448, 96]], label: { text: L('NO · MEANING SEARCH', '아니오 · 의미 검색'), x: 232, y: 510 } },
    { from: 'm1', to: 'm2', pts: [[524, 116], [524, 148]] },
    { from: 'm2', to: 'f1', pts: [[596, 180], [612, 180]] },
    { from: 'f1', to: 'm3', pts: [[662, 200], [662, 268], [596, 268]] },
    { from: 'm2', to: 'm3', pts: [[524, 212], [524, 236]], label: { text: L('NO', '아니오'), x: 532, y: 228, anchor: 'start' } },
    { from: 'm3', to: 'v1', style: 'acc', pts: [[524, 300], [524, 332]], label: { text: L('YES', '예'), x: 532, y: 320, anchor: 'start' } },
    { from: 'v1', to: 'ans', pts: [[524, 372], [524, 404]] },
    { from: 'm3', to: 'ans', pts: [[452, 268], [424, 268], [424, 424], [448, 424]], label: { text: L('NO', '아니오'), x: 420, y: 258, anchor: 'end' } },
  ],
};
const lgB = [
  { kind: 'input', label: L('Question', '질문') },
  { kind: 'logic', label: L('Tool call', '도구 호출') },
  { kind: 'focus', label: L('Re-check latest text', '최신 원문 재확인') },
  { kind: 'llm', label: L('Answer', '답변') },
];

// ---------- C. 질문 1건을 따라가는 시퀀스 ----------
const LX = [64, 272, 480, 648];
export const c = {
  width: 720,
  height: 532,
  zones: [],
  nodes: [
    { id: 'u', kind: 'input', label: L('User', '이용자'), x: 4, y: 0, w: 120, h: 40 },
    { id: 'ag', kind: 'llm', label: L('Agent', '에이전트'), x: 212, y: 0, w: 120, h: 40 },
    { id: 'vd', kind: 'logic', label: L('Vector DB', '벡터 DB'), x: 420, y: 0, w: 120, h: 40 },
    { id: 'rp', kind: 'logic', label: L('Repository', '법령 저장소'), x: 592, y: 0, w: 112, h: 40 },
  ],
  edges: [],
  raw: {
    under: () => LX.map((x) => `<line class="life" x1="${x}" y1="40" x2="${x}" y2="476"/>`).join(''),
    over: (l) => {
      const ah = (x, y, dir, c = '') => `<path class="ah${c}" d="M${x},${y} l${-8 * dir},-3 v6 Z"/>`;
      const msg = (y, i, j, t, { back = false, acc = false, code = false } = {}) => {
        const x1 = LX[i], x2 = LX[j], dir = Math.sign(x2 - x1);
        const cls = acc ? 'ln acc' : back ? 'ln back' : 'ln';
        const w = [...t].reduce((n, ch) => n + (/[ㄱ-힝]/.test(ch) ? 12 : code ? 7.2 : 6.8), 0) + 8;
        return `<path class="${cls}" d="M${x1},${y} H${x2 - dir}"/>${ah(x2, y, dir, acc ? ' acc' : '')}<rect class="em" x="${(x1 + x2) / 2 - w / 2}" y="${y - 22}" width="${w}" height="18" rx="2"/><text class="${code ? 'code' : 'ct'}${acc ? ' acc' : ''}" x="${(x1 + x2) / 2}" y="${y - 8}" text-anchor="middle">${esc(t)}</text>`;
      };
      const note = (y, t, w = 232) => `<rect class="card" x="${LX[1] - w / 2}" y="${y - 14}" width="${w}" height="28" rx="4"/><text class="ct" x="${LX[1]}" y="${y + 4}" text-anchor="middle">${esc(t)}</text>`;
      const step = (y, n) => `<text class="tx" x="0" y="${y + 3}">${String(n).padStart(2, '0')}</text>`;
      const K = l === 'ko';
      return [
        step(84, 1) + msg(84, 0, 1, K ? '현행법상 해고 예고 기간은?' : 'Notice rule for dismissal, now?'),
        step(136, 2) + note(136, K ? '의미 검색 · 최신성 신호 "현행"' : 'Meaning search · recency signal'),
        step(196, 3) + msg(196, 1, 2, 'search("해고 예고")', { code: true }),
        step(244, 4) + msg(244, 2, 1, K ? '근로기준법 제26조 청크' : 'chunk: Labor Standards Act, Art. 26', { back: true }),
        step(304, 5) + msg(304, 1, 3, 'get_file_contents("kr/근로기준법/법률.md")', { acc: true, code: true }),
        step(352, 6) + msg(352, 3, 1, K ? '최신 원문 · ## 제26조' : 'latest text · ## 제26조', { back: true }),
        step(404, 7) + note(404, K ? '청크와 원문 대조 · 다르면 ⚠ 표시' : 'Compare chunk and text · flag if they differ', 260),
        step(460, 8) + msg(460, 1, 0, K ? '제26조 원문 + 출처 + 면책' : 'Art. 26 + source + disclaimer'),
      ].join('');
    },
  },
};
const lgC = [
  { kind: 'acc-line', label: L('Re-check latest text', '최신 원문 재확인') },
  { kind: 'input', label: L('User', '이용자') },
  { kind: 'llm', label: L('Agent', '에이전트') },
  { kind: 'logic', label: L('Knowledge source', '지식원') },
];

export const group = {
  flow: { no: '06', title: { en: 'Service flow', ko: '서비스 흐름' }, fig: flowFig, vs: ['flow-a', 'flow-b', 'flow-c'] },
};
export function lintAll() {
  return lint('flow-a', a) + lint('flow-b', b) + lint('flow-c', c);
}
export function flowFig(v, lang, label) {
  if (v === 'flow-a') return figure(a, lgA, lang, label);
  if (v === 'flow-b') return figure(b, lgB, lang, label);
  return figure(c, lgC, lang, label);
}
