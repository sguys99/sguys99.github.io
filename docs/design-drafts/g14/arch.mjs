// g14 ② Architecture 시안 3종: GenP 아키텍처 Agentic 버전 (Phase 2/3, To-Be)만 그린다 (사용자 결정 2026-11-21).
// 출처: GenP_아키텍쳐 rev0.6 2쪽(Agentic 버전, "P1 기반 유지 / Phase 2/3 확장" 구분), 제품 정의서 v0.3 Ⅰ.4(Phase 2/3 범위), 제품 사양서 v0.1 Ⅰ.2(설치 위치).
import { L, figure, lint, esc } from './lib.mjs';

// ---------- B1. 4구역 회로도: Ops | 로컬 서버 | 로봇 온보드 (+외부 API). Phase 2/3 추가분은 포인트 색 윤곽 ----------
export const b1 = {
  width: 720,
  height: 492,
  zones: [
    { id: 'ops', label: L('Ops · on-prem or SaaS', 'Ops · 온프렘 또는 SaaS'), x: 0, y: 76, w: 168, h: 344 },
    { id: 'local', label: L('Local server', '로컬 서버'), x: 188, y: 76, w: 160, h: 344 },
    { id: 'ext', label: L('External', '외부'), x: 368, y: 0, w: 352, h: 56 },
    { id: 'robot', label: L('Robot · on-board', '로봇 · 온보드'), x: 368, y: 76, w: 352, h: 344 },
  ],
  nodes: [
    { id: 'console', kind: 'new', label: L('Console', '통합 콘솔'), sub: L('overview · alarms', '현황·알람'), x: 12, y: 112, w: 144, h: 56 },
    { id: 'fleet', kind: 'new', label: L('Fleet · Task Ops', 'Fleet · Task Ops'), x: 12, y: 196, w: 144, h: 48 },
    { id: 'dm', kind: 'new', label: L('Data · Model Ops', 'Data · Model Ops'), sub: L('datasets · deploy', '데이터셋·배포'), x: 12, y: 276, w: 144, h: 56 },
    { id: 'common', kind: 'new', label: L('Common platform', '공통 플랫폼'), sub: L('auth · DB · logs', '인증·DB·로그'), x: 12, y: 360, w: 144, h: 48 },
    { id: 'cp', kind: 'plain', label: L('Control panel', '관제시스템'), sub: L('run · monitor · alarms', '실행·모니터링·알람'), x: 200, y: 112, w: 136, h: 56 },
    { id: 'vla', kind: 'plain', label: L('VLA server', 'VLA 서버'), sub: L('manipulation', '조작 정책'), x: 200, y: 196, w: 136, h: 48 },
    { id: 'vln', kind: 'plain', label: L('VLN server', 'VLN 서버'), sub: L('semantic map · goals', '시맨틱 맵·목표좌표'), x: 200, y: 276, w: 136, h: 56 },
    { id: 'db', kind: 'plain', label: L('Logs and DB', '로그·운영 DB'), sub: L('kept on site', '현장 보관'), x: 200, y: 360, w: 136, h: 48 },
    { id: 'api', kind: 'logic', label: L('LLM · STT · TTS', 'LLM · STT · TTS'), sub: L('commercial APIs', '상용 API'), x: 560, y: 8, w: 148, h: 40 },
    { id: 'planner', kind: 'new', label: L('Planner', '플래너'), sub: L('plans, composes', '계획·조합'), x: 380, y: 112, w: 116, h: 56 },
    { id: 'memory', kind: 'new', label: L('Memory', '메모리'), x: 512, y: 112, w: 84, h: 56 },
    { id: 'voice', kind: 'plain', label: L('Voice', '음성 대화'), sub: L('STT · TTS', 'STT·TTS'), x: 612, y: 112, w: 96, h: 56 },
    { id: 'adapter', kind: 'new', label: L('Adapter', '어댑터'), sub: L('perception · navigation · manipulation · motion', '인식·주행·조작·모션'), x: 380, y: 196, w: 328, h: 48 },
    { id: 'nav', kind: 'plain', label: L('Navigation', '자율주행'), sub: L('localize · plan · stop', '위치추정·경로·안전 정지'), x: 380, y: 276, w: 160, h: 56 },
    { id: 'motion', kind: 'plain', label: L('Motion control', '모션 제어'), sub: L('walk · manipulate · balance', '보행·조작 실행·균형'), x: 548, y: 276, w: 160, h: 56 },
    { id: 'hw', kind: 'logic', label: L('Robot hardware', '로봇 하드웨어'), sub: L('G1 · X2 · … · RGB-D · LiDAR · joints', 'G1 · X2 · … · RGB-D · LiDAR · 관절'), x: 380, y: 360, w: 328, h: 48 },
  ],
  edges: [
    { from: 'voice', to: 'api', style: 'both', pts: [[660, 112], [660, 48]] },
    { from: 'voice', to: 'planner', pts: [[660, 168], [660, 184], [464, 184], [464, 168]] },
    { from: 'planner', to: 'memory', style: 'both', pts: [[496, 140], [512, 140]] },
    { from: 'planner', to: 'adapter', pts: [[424, 168], [424, 196]] },
    { from: 'adapter', to: 'nav', pts: [[460, 244], [460, 276]] },
    { from: 'adapter', to: 'motion', pts: [[628, 244], [628, 276]] },
    { from: 'nav', to: 'hw', style: 'both', pts: [[460, 332], [460, 360]] },
    { from: 'motion', to: 'hw', style: 'both', pts: [[628, 332], [628, 360]] },
    { from: 'cp', to: 'planner', style: 'both', pts: [[336, 140], [380, 140]] },
    { from: 'vla', to: 'adapter', style: 'both', pts: [[336, 220], [380, 220]] },
    { from: 'vln', to: 'nav', style: 'both', pts: [[336, 304], [380, 304]] },
    { from: 'console', to: 'cp', style: 'both dash', pts: [[156, 140], [200, 140]] },
    { from: 'dm', to: 'vla', style: 'dash', pts: [[156, 288], [172, 288], [172, 228], [200, 228]] },
    { from: 'db', to: 'dm', style: 'dash', pts: [[200, 384], [184, 384], [184, 316], [156, 316]] },
  ],
};
const b1Legend = [
  { kind: 'new', label: L('Added in Phase 2/3', 'Phase 2/3 확장') },
  { kind: 'plain', label: L('Kept from Phase 1', 'P1 기반 유지') },
  { kind: 'logic', label: L('Hardware, external', '하드웨어·외부') },
  { kind: 'dash-line', label: L('Remote link', '원격 연결') },
];

// ---------- B2. 계층 띠: 위에서 아래로 Ops → 로컬 서버 → 판단 → 어댑터 → 제어 → 하드웨어 ----------
const COL = [152, 296, 440, 584];
const CW = 136;
const rows = [
  { id: 'r1', name: L('Ops', 'Ops'), where: L('on-prem or SaaS', '온프렘·SaaS'), tag: true, y: 0, h: 64 },
  { id: 'r2', name: L('Local server', '로컬 서버'), where: L('off-board', '오프보드'), y: 76, h: 64 },
  { id: 'r3', name: L('Agent', '판단'), where: L('on-board', '온보드'), y: 152, h: 64 },
  { id: 'r4', name: L('Adapter', '어댑터'), where: L('on-board', '온보드'), tag: true, y: 228, h: 40 },
  { id: 'r5', name: L('Control', '제어'), where: L('on-board', '온보드'), y: 280, h: 64 },
  { id: 'r6', name: L('Hardware', '하드웨어'), where: L('swappable', '기체 교체 가능'), y: 356, h: 64 },
];
const R = Object.fromEntries(rows.map((r) => [r.id, r]));
const chip = (id, kind, row, col, label, sub, span = 1) => ({
  id, kind, label, sub, x: COL[col], y: row.y + (row.h - (sub ? 40 : 32)) / 2, w: CW * span + (span - 1) * 8, h: sub ? 40 : 32,
});
export const b2 = {
  width: 720,
  height: 492,
  zones: rows.map((r) => ({ id: r.id, x: 0, y: r.y, w: 720, h: r.h })),
  nodes: [
    chip('console', 'plain', R.r1, 0, L('Console', '통합 콘솔'), L('overview · alarms', '현황·알람')),
    chip('fleet', 'plain', R.r1, 1, L('Fleet · Task Ops', 'Fleet · Task Ops'), L('robots · tasks', '로봇·태스크')),
    chip('dm', 'plain', R.r1, 2, L('Data · Model Ops', 'Data · Model Ops'), L('datasets · deploy', '데이터셋·배포')),
    chip('common', 'logic', R.r1, 3, L('Common platform', '공통 플랫폼'), L('auth · DB · logs', '인증·DB·로그')),
    chip('cp', 'plain', R.r2, 0, L('Control panel', '관제시스템'), L('run · monitor', '실행·모니터링')),
    chip('vla', 'plain', R.r2, 1, L('VLA server', 'VLA 서버'), L('manipulation', '조작 정책')),
    chip('vln', 'plain', R.r2, 2, L('VLN server', 'VLN 서버'), L('semantic map', '시맨틱 맵')),
    chip('db', 'logic', R.r2, 3, L('Logs and DB', '로그·운영 DB'), L('kept on site', '현장 보관')),
    chip('voice', 'plain', R.r3, 0, L('Voice', '음성 대화'), L('STT · TTS', 'STT·TTS')),
    chip('planner', 'focus', R.r3, 1, L('Planner', '플래너'), L('plans, composes tasks', '태스크 계획·조합')),
    chip('memory', 'plain', R.r3, 2, L('Memory', '메모리'), L('context', '맥락')),
    chip('api', 'input', R.r3, 3, L('LLM · STT · TTS', 'LLM · STT · TTS'), L('external API', '외부 API')),
    chip('adapter', 'logic', R.r4, 0, L('Perception · Navigation · Manipulation · Motion control', '인식 · 주행 · 조작 · 모션 제어'), undefined, 4),
    chip('nav', 'plain', R.r5, 0, L('Navigation', '자율주행'), L('localize · plan · filter · stop', '위치추정·경로·필터링·정지'), 2),
    chip('motion', 'plain', R.r5, 2, L('Motion control', '모션 제어'), L('walk · manipulate · balance', '보행·조작 실행·균형'), 2),
    chip('g1', 'logic', R.r6, 0, L('Unitree G1', 'Unitree G1'), L('in service', '운용 중')),
    chip('x2', 'logic', R.r6, 1, L('AgiBot X2', 'AgiBot X2'), L('next robot', '차기 기체')),
    chip('more', 'ghost', R.r6, 2, L('Other robots', '다른 기체')),
    chip('sens', 'logic', R.r6, 3, L('Sensors', '센서'), L('RGB-D · LiDAR · joints', 'RGB-D·LiDAR·관절')),
  ],
  edges: [],
  raw: {
    under: (l) =>
      rows
        .map((r) => {
          const cy = r.y + r.h / 2;
          return `<text class="t b" x="12" y="${cy - 2}">${esc(r.name[l])}${r.tag ? '<tspan class="tg" dx="6">Phase 2/3</tspan>' : ''}</text><text class="t s" x="12" y="${cy + 12}">${esc(r.where[l])}</text>`;
        })
        .join(''),
  },
};
const b2Legend = [
  { kind: 'focus', label: L('Planner, the Phase 2/3 core', '플래너 (Phase 2/3 핵심)') },
  { kind: 'input', label: L('External API', '외부 API') },
  { kind: 'logic', label: L('Platform, hardware', '플랫폼·하드웨어') },
  { kind: 'ghost', label: L('Future robots', '확장 기체') },
];

// ---------- B3. 배치와 경계: 고객 현장(로봇 + 로컬 서버) | Ops | 외부. 데이터가 현장을 나가는 길은 게이트웨이 하나 ----------
export const b3 = {
  width: 720,
  height: 568,
  zones: [
    { id: 'site', label: L('Customer site · on-prem', '고객 현장 · 온프렘'), x: 0, y: 76, w: 476, h: 420 },
    { id: 'robot', label: L('Robot · on-board', '로봇 · 온보드'), x: 12, y: 108, w: 216, h: 268 },
    { id: 'server', label: L('Local server', '로컬 서버'), x: 248, y: 108, w: 216, h: 268 },
    { id: 'ops', label: L('Ops · on-prem or SaaS', 'Ops · 온프렘 또는 SaaS'), x: 500, y: 76, w: 220, h: 420 },
  ],
  nodes: [
    { id: 'api', kind: 'logic', label: L('LLM · STT · TTS', 'LLM · STT · TTS'), sub: L('commercial APIs', '상용 API'), x: 96, y: 8, w: 192, h: 40 },
    { id: 'agent', kind: 'plain', label: L('Voice · Planner · Memory', '음성 · 플래너 · 메모리'), sub: L('understand and plan', '이해와 계획'), x: 24, y: 140, w: 192, h: 56 },
    { id: 'ctrl', kind: 'plain', label: L('Navigation · Motion', '주행 · 모션 제어'), sub: L('Nav2 + FAST-LIO2 · SONIC WBC', 'Nav2 + FAST-LIO2 · SONIC WBC'), x: 24, y: 224, w: 192, h: 56 },
    { id: 'hw', kind: 'logic', label: L('Unitree G1', 'Unitree G1'), sub: L('RGB-D · LiDAR · joints', 'RGB-D · LiDAR · 관절'), x: 24, y: 308, w: 192, h: 56 },
    { id: 'cp', kind: 'plain', label: L('Control panel', '관제시스템'), sub: L('run · monitor · E-Stop', '실행·모니터링·E-Stop'), x: 260, y: 140, w: 192, h: 56 },
    { id: 'models', kind: 'plain', label: L('VLA · VLN serving', 'VLA · VLN 서빙'), sub: L('GR00T N1.7 · FSR-VLN', 'GR00T N1.7 · FSR-VLN'), x: 260, y: 224, w: 192, h: 56 },
    { id: 'db', kind: 'plain', label: L('Logs and DB', '로그·운영 DB'), sub: L('kept on site', '현장 보관'), x: 260, y: 308, w: 192, h: 56 },
    { id: 'gw', kind: 'focus', label: L('Export gateway', '반출 게이트웨이'), sub: L('optional · de-identified first', '옵션 · 비식별화 후 반출'), x: 260, y: 412, w: 192, h: 56 },
    { id: 'console', kind: 'plain', label: L('Console', '통합 콘솔'), sub: L('overview · alarms · remote', '현황·알람·원격'), x: 512, y: 140, w: 196, h: 56 },
    { id: 'fto', kind: 'plain', label: L('Fleet · Task Ops', 'Fleet · Task Ops'), sub: L('robots · tasks', '로봇·태스크'), x: 512, y: 224, w: 196, h: 56 },
    { id: 'dm', kind: 'plain', label: L('Data · Model Ops', 'Data · Model Ops'), sub: L('datasets · registry · rollback', '데이터셋·레지스트리·롤백'), x: 512, y: 308, w: 196, h: 56 },
    { id: 'common', kind: 'logic', label: L('Common platform', '공통 플랫폼'), sub: L('auth · multi-tenant', '인증·멀티테넌트'), x: 512, y: 412, w: 196, h: 56 },
  ],
  edges: [
    { from: 'api', to: 'agent', style: 'both', pts: [[192, 48], [192, 140]] },
    { from: 'agent', to: 'cp', style: 'both', pts: [[216, 168], [260, 168]] },
    { from: 'agent', to: 'ctrl', pts: [[120, 196], [120, 224]] },
    { from: 'ctrl', to: 'hw', style: 'both', pts: [[120, 280], [120, 308]] },
    { from: 'ctrl', to: 'models', style: 'both', pts: [[216, 252], [260, 252]] },
    { from: 'cp', to: 'console', style: 'both dash', pts: [[452, 168], [512, 168]] },
    { from: 'dm', to: 'models', style: 'dash', pts: [[512, 336], [484, 336], [484, 260], [452, 260]], label: { text: L('MODELS', '모델 배포'), x: 478, y: 302, anchor: 'end' } },
    { from: 'db', to: 'gw', pts: [[356, 364], [356, 412]] },
    { from: 'gw', to: 'dm', style: 'acc', pts: [[452, 440], [492, 440], [492, 352], [512, 352]] },
  ],
};
const b3Legend = [
  { kind: 'acc-line', label: L('Data leaving the site', '현장 밖으로 나가는 데이터') },
  { kind: 'dash-line', label: L('Remote link', '원격 연결') },
  { kind: 'plain', label: L('Software module', '소프트웨어 모듈') },
  { kind: 'logic', label: L('Hardware, platform, API', '하드웨어·플랫폼·API') },
];

const capB = L(
  'Target architecture for Phase 2 and 3. A planner composes tasks on its own instead of running predefined scenarios, and an Ops platform runs many robots and sites together.',
  'Phase 2·3 목표 구조. 사전 정의된 시나리오 실행을 넘어 플래너가 상황에 맞게 태스크를 스스로 계획·조합하고, Ops 플랫폼으로 여러 로봇과 현장을 통합 운영한다.',
);
export function archFig(v, l, t) {
  const cap = `<p class="g14-cap">${esc(capB[l])}</p>`;
  if (v === 'arch-a') return figure(b1, b1Legend, l, t, cap);
  if (v === 'arch-b') return figure(b2, b2Legend, l, t, cap);
  if (v === 'arch-c') return figure(b3, b3Legend, l, t, cap);
}
export const archLint = () => lint('arch-a', b1) + lint('arch-b', b2) + lint('arch-c', b3);
