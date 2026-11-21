// g15에서 고른 시안을 src/content/diagrams/legal-agentic-rag.yaml로 옮긴다 (DESIGN.md 11.16).
// problem = ①-C, prompt = ⑥-B, repomap = ②-A, arch = ③-B, flow = ④-A. 직각 꼭짓점(pts)은 lib.path()로 d 문자열이 된다.
// 시안과 다른 점: ① 고충은 callouts(사이트의 고충 말풍선), "필요한 만큼 반복"은 texts / ③ MCP 띠에 이름을 달고 안쪽 영역을 내림
// / ④ 왼쪽 척추는 style line + texts(name, bullet), 재확인 대상 상자는 input / ⑥ 갈매기는 stages(폭 104), 그림 폭 728.
// 사용: node docs/design-drafts/g15/export.mjs > src/content/diagrams/legal-agentic-rag.yaml && npx prettier --write 그 파일
import { L, path } from './lib.mjs';
import * as P from './problem.mjs';
import * as A from './arch.mjs';
import * as F from './flow.mjs';
import { group as mapGroup } from './map.mjs';
import * as PR from './prompt.mjs';

const q = (s) => JSON.stringify(s); // YAML은 JSON 문자열을 그대로 받는다
const clone = ({ raw, ...d }) => structuredClone(d); // raw(시안 전용 그리기 함수)는 옮기지 않는다
const loc = (l) => `{ en: ${q(l.en)}, ko: ${q(l.ko)} }`;
const node = (n) =>
  `{ id: ${n.id}, kind: ${n.kind}, label: ${loc(n.label)}${n.sub ? `, sub: ${loc(n.sub)}` : ''}, x: ${n.x}, y: ${n.y}, w: ${n.w}, h: ${n.h} }`;
const zone = (z) =>
  `{ id: ${z.id}, label: ${loc(z.label)}${z.note ? `, note: { text: ${loc(z.note)} }` : ''}, x: ${z.x}, y: ${z.y}, w: ${z.w}, h: ${z.h} }`;
const edge = (e) =>
  `{ from: ${e.from}, to: ${e.to}, d: ${q(path(e.pts))}${e.style ? `, style: ${e.style}` : ''}${
    e.label ? `, label: { text: ${loc(e.label.text)}, x: ${e.label.x}, y: ${e.label.y}${e.label.anchor ? `, anchor: ${e.label.anchor}` : ''} }` : ''
  } }`;
const text = (t) =>
  `{ text: ${loc(t.text)}, x: ${t.x}, y: ${t.y}${t.anchor ? `, anchor: ${t.anchor}` : ''}${t.style ? `, style: ${t.style}` : ''}${t.bullet ? ', bullet: true' : ''} }`;
const list = (k, xs, f, ind = '  ') => (xs.length ? `${ind}${k}:\n${xs.map((x) => `${ind}  - ${f(x)}`).join('\n')}\n` : '');
const legend = (xs, ind = '  ') => list('legend', xs, (l) => `{ kind: ${l.kind}, label: ${loc(l.label)} }`, ind);
function diagram(key, d, { lg, texts = [], callouts = [], stages } = {}) {
  let s = `${key}:\n  width: ${d.width}\n  height: ${d.height}\n`;
  if (lg) s += legend(lg);
  if (stages) s += `  stages:\n    x: ${stages.x}\n    y: ${stages.y}\n    w: ${stages.w}\n    h: ${stages.h}\n${list('items', stages.items, loc, '    ')}`;
  s += list('zones', d.zones ?? [], zone);
  s += list('nodes', d.nodes, node);
  s += list('callouts', callouts, (c) => `{ n: ${c.n}, on: ${c.on}, text: ${loc(c.text)}, x: ${c.x}, y: ${c.y}, w: ${c.w}, h: ${c.h}, px: ${c.px}, py: ${c.py} }`);
  s += list('texts', texts, text);
  s += list('edges', d.edges, edge);
  return s;
}

// ① Problem C
const pc = clone(P.c);
const loop = pc.edges.find((e) => e.label);
const loopText = { text: loop.label.text, x: loop.label.x, y: loop.label.y, anchor: 'middle' };
delete loop.label;
const pains = [
  { n: 1, on: 'b2', text: L('Chunks split articles', '조문이 청크 경계에서 잘림'), x: 176, w: 168, px: 244 },
  { n: 2, on: 'b3', text: L('Needs more than 3', '필요한 조문이 3개 초과'), x: 360, w: 168, px: 428 },
  { n: 3, on: 'b4', text: L('No revision history', '개정 이력·과거 원문 없음'), x: 544, w: 160, px: 624 },
].map((c) => ({ ...c, y: 100, h: 24, py: 80 }));
const lgP = [
  { kind: 'input', label: L('Question', '질문') },
  { kind: 'logic', label: L('Search, file, data', '검색·파일·데이터') },
  { kind: 'llm', label: L('LLM call', 'LLM 호출') },
  { kind: 'focus', label: L('Agent loop', '에이전트 반복') },
  { kind: 'mark', label: L('Where it fell short', '한계') },
];

// ③ Architecture B: MCP 띠에 이름, 안쪽 영역·칩·아래 계층을 내림
const ab = clone(A.b);
const dy = (id, by) => {
  const n = ab.nodes.find((n) => n.id === id) ?? ab.zones.find((z) => z.id === id);
  n.y += by;
};
const r3 = ab.zones.find((z) => z.id === 'r3');
Object.assign(r3, { label: L('MCP · read-only tools', 'MCP · 읽기 전용 도구'), h: 120 });
for (const id of ['sg', 'gg']) Object.assign(ab.zones.find((z) => z.id === id), { y: 240, h: 76 });
for (const id of ['t1', 't2', 't3', 't4', 't5']) dy(id, 20);
dy('r4', 12);
for (const id of ['vdb', 'repo', 'reidx', 'law']) dy(id, 12);
ab.height = 532;
const E = (from, to, pts, style = 'both') => ({ from, to, pts, style });
ab.edges = [
  E('chat', 'agent', [[264, 72], [264, 132]]),
  E('agent', 'sg', [[232, 180], [232, 200], [200, 200], [200, 240]]),
  E('agent', 'gg', [[328, 180], [328, 200], [500, 200], [500, 240]]),
  E('sg', 'vdb', [[148, 316], [148, 376]]),
  E('gg', 'repo', [[500, 316], [500, 376]]),
  E('repo', 'reidx', [[400, 424], [400, 452], [268, 452]], null),
  E('reidx', 'vdb', [[192, 440], [192, 424]], null),
  E('law', 'repo', [[626, 440], [626, 424]], null),
];
for (const n of ab.nodes) if (n.sub === undefined) delete n.sub;
const lgA = [
  { kind: 'input', label: L('User', '이용자') },
  { kind: 'llm', label: L('Agent, LLM', '에이전트·LLM') },
  { kind: 'logic', label: L('Tools and data', '도구·데이터') },
  { kind: 'focus', label: L('System prompt', '시스템 프롬프트') },
  { kind: 'ghost', label: L('Upstream source', '외부 원천') },
];

// ④ Service flow A
const fa = clone(F.a);
fa.nodes.find((n) => n.id === 'r1a').kind = 'input';
fa.edges.unshift({ from: 'cls', to: 'vl', style: 'line', pts: [[280, 96], [12, 96], [12, 496]] });
const rowsA = [
  [168, 88, L('Meaning search', '의미 검색'), L('default', '기본값')],
  [268, 40, L('Article lookup', '조문 검색')],
  [320, 40, L('Revision history', '개정 이력')],
  [372, 40, L('Compare two dates', '시점 간 비교')],
  [424, 40, L('Compare statutes', '법령 간 비교')],
  [476, 40, L('Statistics', '통계')],
];
const flowTexts = rowsA.flatMap(([y, h, t, s]) => [
  { text: t, x: 24, y: y + h / 2 + 4, style: 'name', bullet: true },
  ...(s ? [{ text: s, x: 24, y: y + h / 2 + 18 }] : []),
]);
const lgF = [
  { kind: 'logic', label: L('First call', '1차 호출') },
  { kind: 'input', label: L('Conditional call', '조건부 호출') },
  { kind: 'acc-line', label: L('Re-check latest text', '최신 원문 재확인') },
  { kind: 'llm', label: L('LLM step', 'LLM 판단') },
];

// ⑥ System prompt B: 7칸 × 104, 그림 폭 728
const pb = clone(PR.b);
pb.width = 728;
for (const n of pb.nodes) {
  if (n.id === 'kn') Object.assign(n, { x: 316, w: 408 });
  else if (n.id === 'ex') Object.assign(n, { x: 4, w: 304 });
  else n.x += 4;
}
pb.zones = [
  {
    id: 'rules',
    label: L('6 absolute rules · apply to every step', '절대 규칙 6개 · 모든 단계에 적용'),
    note: L('verbatim · no advice · cite · read-only', '원문 그대로 · 조언 금지 · 출처 · 읽기 전용'),
    x: 0, y: 0, w: 728, h: 32,
  },
];
const stagesP = {
  x: 0, y: 40, w: 104, h: 24,
  items: [L('Input', '입력'), L('Preprocess', '전처리'), L('Appendix', '별표 확인'), L('Classify', '의도 분류'), L('Retrieve', '조회'), L('Verify', '검증·폴백'), L('Answer', '출력')],
};
const promptTexts = [
  { text: L('Each box = one section of the system prompt; second line = rules it holds', '각 상자 = 시스템 프롬프트의 섹션, 아래 줄 = 그 섹션에 든 규칙 수'), x: 4, y: 292 },
];
const lgPr = [
  { kind: 'plain', label: L('Prompt section', '프롬프트 섹션') },
  { kind: 'focus', label: L('Reference knowledge', '참고 지식') },
  { kind: 'logic', label: L('Exception table', '예외 표') },
];

// ② Repository map A
const repomap = `repomap:
  repo: ${loc(L('Repository · legalize-kr', '저장소 · legalize-kr'))}
  tree:
${[[0, 'kr/'], [1, '근로기준법/'], [2, '법률.md', true], [2, '시행령.md'], [2, '시행규칙.md'], [1, '민법/'], [2, '법률.md'], [1, '도로교통법/'], [2, '법률.md · …']]
  .map(([d, n, f]) => `    - { depth: ${d}, name: ${q(n)}${f ? ', focus: true' : ''} }`)
  .join('\n')}
  treeNote:
    - ${loc(L('about 3,046 statute folders', '법령 폴더 약 3,046개'))}
    - ${loc(L('folder = act, decree, and rule set', '폴더 = 법률·시행령·시행규칙 세트'))}
  open: ${loc(L('OPEN BY PATH', '경로로 바로 열기'))}
  file: ${loc(L('One statute file', '법령 파일 하나'))}
  path: ${q('kr/근로기준법/법률.md')}
  lines:
${[
  ['---', 'muted'], ['제목: 근로기준법'], ['법령구분: 법률'], ['소관부처: [고용노동부]'], ['공포일자: 2026-08-04'], ['시행일자: 2026-10-02'],
  ['상태: 시행'], ['출처: law.go.kr/법령/근로기준법'], ['---', 'muted'], ['# 근로기준법', 'head'], ['## 제23조 (해고 등의 제한)', 'head'],
  ['① 사용자는 근로자에게 정당한 이유 없이 …'], ['## 부칙', 'head'], ['부칙 <제{번호}호,{공포일자}>'],
]
  .map(([t, k]) => `    - { text: ${q(t)}${k ? `, kind: ${k}` : ''} }`)
  .join('\n')}
  notes:
    - { from: 1, to: 7, title: ${loc(L('Metadata', '메타데이터'))}, body: ${loc(L('header and stats', '대상 법령 표시·통계'))} }
    - { from: 10, to: 11, title: ${loc(L('Article heading', '조문 제목 줄'))}, body: ${loc(L('found without search', '검색 없이 바로 찾음'))} }
    - { from: 12, to: 13, title: ${loc(L('Addenda marker', '부칙 표시'))}, body: ${loc(L('source for history', '개정 이력의 근거'))} }
  commit:
    label: ${loc(L('Commit message', '커밋 메시지'))}
    text: ${q('법률: 근로기준법 (일부개정)')}
    note: ${loc(L('one amendment = one commit → compare', '개정 1건 = 커밋 1개 → 시점 비교'))}
`;
void mapGroup;

const head = `# 법령 검색 Agentic RAG 케이스 스터디 다이어그램 (DESIGN.md 5.24.4, 5.24.13, 11.16). 시안 g15에서 고른 조합:
# problem = ①-C 이전 vs 이후, prompt = ⑥-B 처리 단계에 맞춘 섹션, repomap = ②-A 파일 구조도, arch = ③-B 계층 스택, flow = ④-A 의도 6행 × 두 레인.
# 출처: docs/project-references/legal/ (systemprompt.md, legal-chat-agent-main 문서·설정), legalQ 답변(2026-11-21).
# 이 파일은 docs/design-drafts/g15/export.mjs로 만들었다. 좌표는 SVG 단위(4px 격자), 연결선 d는 직각 + 모서리 반지름 8.
# 포인트 색: 문제는 에이전트(focus)·한계 번호, 프롬프트는 참고 지식, 아키텍처는 시스템 프롬프트, 흐름은 최신 원문 재확인 경로 1개.

${legend(lgA, '').replace(/^/, '')}`;
process.stdout.write(
  [
    head.trimEnd(),
    diagram('problem', pc, { lg: lgP, texts: [loopText], callouts: pains }),
    diagram('prompt', pb, { lg: lgPr, texts: promptTexts, stages: stagesP }),
    repomap,
    diagram('arch', ab),
    diagram('flow', fa, { lg: lgF, texts: flowTexts }),
  ].join('\n'),
);
