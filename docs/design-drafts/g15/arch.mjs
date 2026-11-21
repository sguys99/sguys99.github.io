// g15 ③ Architecture 시안 3종. 근거: README(무상태 백엔드, 브라우저 암호화 저장, IP 제한·동시성), config.example.json
// (MCP 서버 3종 중 공개 서비스 화이트리스트, max_turns 8, Claude Sonnet 4.6), legal_prompts.json hybrid-r6 도구 5종,
// seahorse-vdb-reindex-handoff(조·항 단위 재적재, Dense·BM25), systemprompt.md(VDB 전체 ~3,046개), legalQ 화면(3턴 제한).
// 내부 엔드포인트·키·사내 저장소 이름은 넣지 않는다.
import { L, figure, lint } from './lib.mjs';

const N = {
  chat: { kind: 'input', label: L('legalQ web chat', '웹 챗 legalQ'), sub: L('desktop · mobile', '데스크톱·모바일') },
  hist: { kind: 'logic', label: L('Chat history', '대화 기록'), sub: L('encrypted in browser', '브라우저 암호화 저장') },
  guard: { kind: 'logic', label: L('Guardrails', '가드레일'), sub: L('rate · concurrency · PII', 'IP 제한·동시성·개인정보') },
  agent: { kind: 'llm', label: L('Agent', '에이전트'), sub: L('tool loop, up to 8 turns', '도구 호출 반복 · 최대 8턴') },
  llm: { kind: 'llm', label: L('Claude\nSonnet 4.6') },
  prompt: { kind: 'focus', label: L('System\nprompt', '시스템\n프롬프트'), sub: L('with repo map', '저장소 지도 포함') },
  smcp: { kind: 'logic', label: L('Seahorse MCP'), sub: L('search, neighbors', '의미 검색·인접 청크') },
  gmcp: { kind: 'logic', label: L('GitHub MCP'), sub: L('3 read-only tools', '읽기 전용 도구 3개') },
  vdb: { kind: 'logic', label: L('Seahorse vector DB', 'Seahorse 벡터 DB'), sub: L('hybrid · article chunks', 'Dense·BM25 · 조·항 청크') },
  repo: { kind: 'logic', label: L('legalize-kr repo', 'legalize-kr 저장소'), sub: L('Markdown · Git history', 'Markdown · Git 이력') },
  reidx: { kind: 'logic', label: L('Re-index by article', '조·항 단위 재적재') },
  law: { kind: 'ghost', label: L('National Law Info. Center', '국가법령정보센터'), sub: L('law.go.kr') },
};
const at = (id, x, y, w, h, over = {}) => ({ id, ...N[id], x, y, w, h, ...over });

// ---------- A. 왼쪽 → 오른쪽 회로도 ----------
export const a = {
  width: 720,
  height: 404,
  zones: [
    { id: 'u', label: L('Users', '이용자'), x: 0, y: 32, w: 136, h: 312 },
    { id: 's', label: L('Agent server', '에이전트 서버'), x: 148, y: 32, w: 252, h: 312 },
    { id: 'm', label: L('MCP', 'MCP'), x: 412, y: 32, w: 140, h: 312 },
    { id: 'k', label: L('Knowledge', '지식원'), x: 564, y: 32, w: 156, h: 312 },
  ],
  nodes: [
    at('chat', 8, 72, 120, 56),
    at('hist', 8, 168, 120, 56),
    at('guard', 160, 72, 76, 56, { sub: L('rate · PII', '제한·개인정보') }),
    at('agent', 268, 56, 120, 200, { sub: L('≤ 8 tool turns', '도구 반복 · 최대 8턴') }),
    at('llm', 160, 152, 80, 48),
    at('prompt', 160, 220, 80, 64, { sub: undefined }),
    at('smcp', 420, 72, 124, 56),
    at('gmcp', 420, 200, 124, 56),
    at('vdb', 572, 72, 140, 56),
    at('reidx', 572, 148, 140, 32),
    at('repo', 572, 200, 140, 56),
    at('law', 572, 284, 140, 48, { label: L('National Law\nInformation Center', '국가법령정보센터') }),
  ],
  edges: [
    { from: 'chat', to: 'hist', style: 'both', pts: [[68, 128], [68, 168]] },
    { from: 'chat', to: 'guard', style: 'both', pts: [[128, 100], [160, 100]] },
    { from: 'guard', to: 'agent', style: 'both', pts: [[236, 100], [268, 100]] },
    { from: 'llm', to: 'agent', style: 'both', pts: [[240, 176], [268, 176]] },
    { from: 'prompt', to: 'agent', pts: [[240, 252], [268, 252]] },
    { from: 'agent', to: 'smcp', style: 'both', pts: [[388, 100], [420, 100]] },
    { from: 'agent', to: 'gmcp', style: 'both', pts: [[388, 228], [420, 228]] },
    { from: 'smcp', to: 'vdb', style: 'both', pts: [[544, 100], [572, 100]] },
    { from: 'gmcp', to: 'repo', style: 'both', pts: [[544, 228], [572, 228]] },
    { from: 'repo', to: 'reidx', pts: [[642, 200], [642, 180]] },
    { from: 'reidx', to: 'vdb', pts: [[642, 148], [642, 128]] },
    { from: 'law', to: 'repo', pts: [[642, 284], [642, 256]] },
  ],
};

// ---------- B. 계층 스택: 위에서 아래로 ----------
export const b = {
  width: 720,
  height: 520,
  zones: [
    { id: 'r1', label: L('Users', '이용자'), note: L('3 turns per chat', '대화당 3턴'), x: 0, y: 0, w: 720, h: 84 },
    { id: 'r2', label: L('Agent server', '에이전트 서버'), note: L('stateless', '무상태'), x: 0, y: 100, w: 720, h: 92 },
    { id: 'r3', x: 0, y: 208, w: 720, h: 112 },
    { id: 'sg', label: L('Seahorse MCP'), x: 16, y: 220, w: 264, h: 84 },
    { id: 'gg', label: L('GitHub MCP'), x: 296, y: 220, w: 408, h: 84 },
    { id: 'r4', label: L('Knowledge sources', '지식원'), x: 0, y: 332, w: 720, h: 132 },
  ],
  nodes: [
    at('chat', 176, 32, 176, 40),
    at('hist', 368, 32, 176, 40),
    at('guard', 16, 132, 160, 48),
    at('agent', 192, 132, 176, 48),
    at('llm', 384, 132, 128, 48, { label: L('Claude Sonnet 4.6') }),
    at('prompt', 528, 132, 176, 48, { label: L('System prompt', '시스템 프롬프트'), sub: L('intents · routing · repo map', '의도·라우팅·저장소 지도') }),
    { id: 't1', kind: 'logic', label: L('search'), x: 28, y: 252, w: 116, h: 36 },
    { id: 't2', kind: 'logic', label: L('adjacent chunks'), x: 152, y: 252, w: 116, h: 36 },
    { id: 't3', kind: 'logic', label: L('search_code'), x: 308, y: 252, w: 120, h: 36 },
    { id: 't4', kind: 'logic', label: L('get_file_contents'), x: 440, y: 252, w: 136, h: 36 },
    { id: 't5', kind: 'logic', label: L('list_commits'), x: 588, y: 252, w: 104, h: 36 },
    at('vdb', 16, 364, 252, 48, { sub: L('Dense·BM25 hybrid · article chunks', 'Dense·BM25 하이브리드 · 조·항 단위 청크') }),
    at('repo', 296, 364, 408, 48, { sub: L('about 3,046 statutes as Markdown · Git history', '법령 약 3,046개 Markdown · Git 이력') }),
    at('reidx', 116, 428, 152, 24),
    at('law', 548, 428, 156, 24, { sub: undefined, label: L('Source: law.go.kr', '원천: 국가법령정보센터') }),
  ],
  edges: [
    { from: 'chat', to: 'agent', style: 'both', pts: [[264, 72], [264, 132]] },
    { from: 'agent', to: 'sg', style: 'both', pts: [[232, 180], [232, 200], [148, 200], [148, 220]] },
    { from: 'agent', to: 'gg', style: 'both', pts: [[328, 180], [328, 200], [500, 200], [500, 220]] },
    { from: 'sg', to: 'vdb', style: 'both', pts: [[148, 304], [148, 364]] },
    { from: 'gg', to: 'repo', style: 'both', pts: [[500, 304], [500, 364]] },
    { from: 'repo', to: 'reidx', pts: [[400, 412], [400, 440], [268, 440]] },
    { from: 'reidx', to: 'vdb', pts: [[192, 428], [192, 412]] },
    { from: 'law', to: 'repo', pts: [[626, 428], [626, 412]] },
  ],
};

// ---------- C. 에이전트를 가운데 둔 허브: 발견(왼쪽) · 검증(오른쪽) ----------
export const c = {
  width: 720,
  height: 416,
  zones: [
    { id: 'disc', label: L('Discover by meaning', '발견 · 의미로 찾기'), x: 0, y: 112, w: 264, h: 116 },
    { id: 'veri', label: L('Verify exact text', '검증 · 정확한 원문'), note: undefined, x: 456, y: 112, w: 264, h: 116 },
  ],
  nodes: [
    at('chat', 280, 0, 160, 44),
    at('guard', 280, 64, 160, 40, { sub: L('rate · concurrency · PII', 'IP 제한·동시성·개인정보') }),
    at('agent', 280, 140, 160, 64),
    at('vdb', 12, 152, 128, 56, { label: L('Seahorse\nvector DB', 'Seahorse\n벡터 DB'), sub: undefined }),
    at('smcp', 164, 156, 88, 48, { label: L('Seahorse\nMCP'), sub: undefined }),
    at('gmcp', 468, 156, 88, 48, { label: L('GitHub\nMCP'), sub: undefined }),
    at('repo', 580, 152, 128, 56, { label: L('legalize-kr\nrepo', 'legalize-kr\n저장소'), sub: undefined }),
    at('llm', 240, 240, 112, 48),
    at('prompt', 368, 240, 112, 48, { label: L('System prompt', '시스템 프롬프트') }),
    at('reidx', 280, 328, 160, 32),
  ],
  edges: [
    { from: 'chat', to: 'guard', style: 'both', pts: [[360, 44], [360, 64]] },
    { from: 'guard', to: 'agent', style: 'both', pts: [[360, 104], [360, 140]] },
    { from: 'agent', to: 'smcp', style: 'both', pts: [[280, 180], [252, 180]] },
    { from: 'smcp', to: 'vdb', style: 'both', pts: [[164, 180], [140, 180]] },
    { from: 'agent', to: 'gmcp', style: 'both', pts: [[440, 180], [468, 180]] },
    { from: 'gmcp', to: 'repo', style: 'both', pts: [[556, 180], [580, 180]] },
    { from: 'llm', to: 'agent', style: 'both', pts: [[312, 240], [312, 204]] },
    { from: 'prompt', to: 'agent', pts: [[408, 240], [408, 204]] },
    { from: 'repo', to: 'reidx', pts: [[644, 208], [644, 344], [440, 344]], label: { text: L('SAME FILES', '같은 파일'), x: 540, y: 334 } },
    { from: 'reidx', to: 'vdb', pts: [[280, 344], [76, 344], [76, 208]] },
  ],
};

// A는 위 32px 빈 띠를 없앤다.
for (const z of a.zones) z.y -= 32;
for (const n of a.nodes) n.y -= 32;
for (const e of a.edges) e.pts = e.pts.map(([x, y]) => [x, y - 32]);
a.height -= 32;

const lg = [
  { kind: 'input', label: L('User', '이용자') },
  { kind: 'llm', label: L('Agent, LLM', '에이전트·LLM') },
  { kind: 'logic', label: L('Tools and data', '도구·데이터') },
  { kind: 'focus', label: L('System prompt', '시스템 프롬프트') },
  { kind: 'ghost', label: L('Upstream source', '외부 원천') },
];

export const group = {
  arch: { no: '05', title: { en: 'Architecture', ko: '아키텍처' }, fig: archFig, vs: ['arch-a', 'arch-b', 'arch-c'] },
};
export function lintAll() {
  return lint('arch-a', a) + lint('arch-b', b) + lint('arch-c', c);
}
export function archFig(v, lang, label) {
  return figure({ 'arch-a': a, 'arch-b': b, 'arch-c': c }[v], v === 'arch-c' ? lg.slice(0, 4) : lg, lang, label);
}
