// g15 ② 프롬프트 속 저장소 지도 시안 3종. 근거: systemprompt.md "저장소 구조 & 스키마", "전처리 규칙", "VDB→MCP 검증 파이프라인" 3단계(파일명 결정),
// 조문검색 워크플로우(404 폴백). 근로기준법 메타데이터 값은 legalQ 답변(2026-11-21)의 대상 법령 블록.
// 파일 안의 글(법령 원문·키)은 영문 페이지에서도 원문 그대로 둔다(실제 저장소가 국문). 설명만 언어별.
import { L, figure, lint, esc } from './lib.mjs';

const T = (x, y, t, c = 'code', a = 'start') => `<text class="${c}" x="${x}" y="${y}" text-anchor="${a}">${esc(t)}</text>`;
const P = (d, c = 'brk') => `<path class="${c}" d="${d}"/>`;

// ---------- A. 설명을 단 파일 구조도: 저장소 트리 → 법령 파일 → 규약별 쓰임 ----------
const lines = [
  ['---', 'k'], ['제목: 근로기준법'], ['법령구분: 법률'], ['소관부처: [고용노동부]'], ['공포일자: 2026-08-04'], ['시행일자: 2026-10-02'],
  ['상태: 시행'], ['출처: law.go.kr/법령/근로기준법'], ['---', 'k'], ['# 근로기준법', 'h'], ['## 제23조 (해고 등의 제한)', 'h'],
  ['① 사용자는 근로자에게 정당한 이유 없이 …'], ['## 부칙', 'h'], ['부칙 <제{번호}호,{공포일자}>'],
];
const LY = (i) => 56 + i * 20;
export const a = {
  width: 720,
  height: 412,
  zones: [
    { id: 'repo', label: L('Repository · legalize-kr', '저장소 · legalize-kr'), x: 0, y: 0, w: 216, h: 352 },
    { id: 'file', label: L('One statute file', '법령 파일 하나'), x: 236, y: 0, w: 316, h: 352 },
  ],
  nodes: [],
  edges: [{ pts: [[124, 108], [248, 108]], label: { text: L('OPEN BY PATH', '경로로 바로 열기'), x: 186, y: 98 } }],
  raw: {
    under: (l) => {
      let s = '';
      // 트리: 이름과 연결선
      const rows = [
        [16, 52, 'kr/'], [40, 80, '근로기준법/'], [64, 112, '법률.md', 'acc'], [64, 136, '시행령.md'], [64, 160, '시행규칙.md'],
        [40, 192, '민법/'], [64, 216, '법률.md'], [40, 248, '도로교통법/'], [64, 272, '법률.md · …'],
      ];
      s += `<rect class="hl" x="56" y="96" width="68" height="24" rx="4"/>`;
      for (const [x, y, t, c] of rows) s += T(x, y, t, c === 'acc' ? 'code acc' : 'code');
      s += P('M24,58 V244 M24,76 H34 M24,188 H34 M24,244 H34');
      s += P('M48,86 V156 M48,108 H58 M48,132 H58 M48,156 H58 M48,198 V212 M48,212 H58 M48,254 V268 M48,268 H58');
      s += T(16, 316, l === 'ko' ? '법령 폴더 약 3,046개' : 'about 3,046 statute folders', 'tx');
      s += T(16, 332, l === 'ko' ? '폴더 = 법률·시행령·시행규칙 세트' : 'folder = act, decree, and rule set', 'tx');
      // 파일 카드
      s += `<rect class="card" x="248" y="32" width="292" height="308" rx="6"/>`;
      s += T(260, 50, 'kr/근로기준법/법률.md', 'code acc');
      lines.forEach(([t, c], i) => (s += T(260, LY(i) + 12, t, c ? `code ${c}` : 'code')));
      // 오른쪽 설명: 괄호선 + 이름 + 쓰임
      const notes = [
        [LY(1), LY(7) + 16, L('Metadata', '메타데이터'), L('header and stats', '대상 법령 표시·통계')],
        [LY(10), LY(11) + 16, L('Article heading', '조문 제목 줄'), L('found without search', '검색 없이 바로 찾음')],
        [LY(12), LY(13) + 16, L('Addenda marker', '부칙 표시'), L('source for history', '개정 이력의 근거')],
      ];
      for (const [y1, y2, t1, t2] of notes) {
        const m = (y1 + y2) / 2;
        s += P(`M548,${y1 + 2} H556 V${y2 - 2} H548 M556,${m} H564`);
        s += T(572, m - 4, t1[l], 'ct b') + T(572, m + 14, t2[l], 'ct');
      }
      // 아래: 커밋 메시지 규약
      s += `<rect class="card" x="0" y="368" width="720" height="40" rx="6"/>`;
      s += T(16, 392, l === 'ko' ? '커밋 메시지' : 'Commit message', 'ct b');
      s += T(148, 392, '법률: 근로기준법 (일부개정)', 'code');
      s += T(440, 392, l === 'ko' ? '개정 1건 = 커밋 1개 → 시점 비교' : 'one amendment = one commit → compare', 'ct');
      return s;
    },
  },
};

// ---------- B. 경로 만들기: 질문 → 정규화 → 파일 → 경로 → 조문 ----------
const X5 = [0, 148, 296, 444, 592];
export const b = {
  width: 720,
  height: 388,
  zones: [
    { id: 'rule', label: L('File name by statute type', '법령구분 → 파일명'), x: 0, y: 140, w: 412, h: 188 },
    { id: 'miss', note: L('If the file is missing', '파일이 없으면'), x: 428, y: 140, w: 292, h: 188 },
  ],
  nodes: [
    { id: 's1', kind: 'input', label: L('근로 기준법\n제23조 알려줘'), x: X5[0], y: 48, w: 128, h: 64 },
    { id: 's2', kind: 'logic', label: L('근로기준법'), sub: L('no spaces, one dot', '공백 제거·가운뎃점 통일'), x: X5[1], y: 48, w: 128, h: 64 },
    { id: 's3', kind: 'logic', label: L('법률.md'), sub: L('type: act', '법령구분: 법률'), x: X5[2], y: 48, w: 128, h: 64 },
    { id: 's4', kind: 'focus', label: L('kr/근로기준법/\n법률.md'), sub: L('get_file_contents'), x: X5[3], y: 48, w: 128, h: 64 },
    { id: 's5', kind: 'llm', label: L('## 제23조'), sub: L('quote verbatim', '원문 그대로 인용'), x: X5[4], y: 48, w: 128, h: 64 },
    { id: 'm1', kind: 'logic', label: L('404 · no file', '404 · 파일 없음'), x: 444, y: 176, w: 128, h: 40 },
    { id: 'm2', kind: 'logic', label: L('Vector DB', '벡터 DB'), sub: L('confirm statute name', '법령명 확인'), x: 444, y: 264, w: 128, h: 48 },
    { id: 'm3', kind: 'llm', label: L('Ask back', '되묻기'), sub: L('"Did you mean …?"', '"혹시 ○○을 말씀…?"'), x: 588, y: 264, w: 120, h: 48 },
  ],
  edges: [
    { from: 's1', to: 's2', pts: [[128, 80], [148, 80]] },
    { from: 's2', to: 's3', pts: [[276, 80], [296, 80]] },
    { from: 's3', to: 's4', pts: [[424, 80], [444, 80]] },
    { from: 's4', to: 's5', pts: [[572, 80], [592, 80]] },
    { from: 's4', to: 'm1', style: 'back', pts: [[476, 112], [476, 176]] },
    { from: 'm1', to: 'm2', pts: [[508, 216], [508, 264]] },
    { from: 'm2', to: 'm3', pts: [[572, 288], [588, 288]] },
  ],
  raw: {
    base: (l) => {
      const ttl = [L('Question', '질문'), L('Normalize', '정규화'), L('Pick the file', '파일 고르기'), L('Build the path', '경로 만들기'), L('Find the article', '조문 찾기')];
      return ttl
        .map((t, i) => `<text class="code k" x="${X5[i]}" y="24">${String(i + 1).padStart(2, '0')}</text><text class="zl" x="${X5[i] + 24}" y="24">${esc(t[l])}</text>`)
        .join('');
    },
    over: (l) => {
      const rows = [
        [L('Act', '법률'), '법률.md'],
        [L('Presidential decree (enforcement)', '대통령령 (시행령)'), '시행령.md'],
        [L('Ministerial rule', '부령'), '시행규칙.md'],
        [L('Standalone decree', '독립 대통령령'), '대통령령.md'],
      ];
      let s = '';
      rows.forEach(([k, f], i) => {
        const y = 196 + i * 32;
        s += T(16, y, k[l], 'ct') + P(`M268,${y - 4} H292`, 'ln') + `<path class="ln" d="M288,${y - 7} L292,${y - 4} L288,${y - 1}"/>` + T(304, y, f, 'code');
        if (i < 3) s += `<line class="rule" x1="16" y1="${y + 12}" x2="396" y2="${y + 12}"/>`;
      });
      return s;
    },
  },
};

// ---------- C. 프롬프트 발췌 → 도구 호출 → 찾은 조문 (HTML) ----------
function codeC(lang) {
  const t = lang === 'ko'
    ? ['시스템 프롬프트에 넣은 규약 (발췌)', '에이전트의 도구 호출', '찾은 조문', '질문: "근로 기준법 제23조 알려줘"', '검색 호출 없이 한 번에 파일을 연다']
    : ['Conventions in the system prompt (excerpt)', "The agent's tool call", 'Article found', 'Question: "근로 기준법 제23조 알려줘" (Labor Standards Act, Art. 23)', 'Opens the file in one call, no search'];
  const m = (s) => `<mark>${s}</mark>`;
  return `<div class="g15-code">
<div class="pane p1"><p class="pt">${t[0]}</p><pre><code><span class="c">## 저장소 구조 &amp; 스키마</span>
${m('kr/{법령명(띄어쓰기 제거)}/')}
  ${m('법률.md')}        <span class="c"># 국회 제정 법률</span>
  시행령.md      <span class="c"># 대통령령 (시행령)</span>
  시행규칙.md    <span class="c"># 부령 (시행규칙)</span>
  대통령령.md    <span class="c"># 독립 대통령령</span>

조문  ${m('## 제X조 (제목)')}
부칙  부칙 &lt;제{번호}호,{공포일자}&gt;
커밋  {법령구분}: {법령명} ({개정유형})

<span class="c">## 전처리 규칙</span>
띄어쓰기 제거   근로 기준법 → 근로기준법
가운뎃점        · (U+00B7) → ㆍ (U+318D)</code></pre></div>
<div class="arrow" aria-hidden="true"></div>
<div class="col">
<div class="pane"><p class="pt">${t[1]}</p><p class="q">${esc(t[3])}</p><pre><code>get_file_contents(
  path=${m('"kr/근로기준법/법률.md"')}
)</code></pre><p class="note">${t[4]}</p></div>
<div class="pane"><p class="pt">${t[2]}</p><pre><code>${m('## 제23조 (해고 등의 제한)')}
① 사용자는 근로자에게 정당한 이유 없이
해고, 휴직, 정직, 전직, 감봉, 그 밖의 …</code></pre></div>
</div></div>`;
}

export const group = {
  map: { no: '04', title: { en: 'Repository map in the prompt', ko: '프롬프트 속 저장소 지도' }, fig: mapFig, vs: ['map-a', 'map-b', 'map-c'] },
};
export function lintAll() {
  return lint('map-a', a) + lint('map-b', b);
}
const lgB = [
  { kind: 'input', label: L('Question', '질문') },
  { kind: 'logic', label: L('Rule from the prompt', '프롬프트 규칙') },
  { kind: 'focus', label: L('One file call', '파일 호출 1회') },
  { kind: 'llm', label: L('Answer', '답변') },
];
export function mapFig(v, lang, label) {
  if (v === 'map-a') return figure(a, [], lang, label);
  if (v === 'map-b') return figure(b, lgB, lang, label);
  return codeC(lang);
}
