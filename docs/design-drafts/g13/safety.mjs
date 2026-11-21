// g13 ③ Safety 시안 3종. 출처: 착수보고서 5-1·5-2, 포커스 세미나 11쪽(안전 체계).
import { L, figure, lint, esc, est } from './lib.mjs';

// ---------- C1. 접근 거리 원 + 3경로 비상정지 신호 ----------
const CX = 160, CY = 164;
export const c1 = {
  width: 720,
  height: 364,
  zones: [
    { id: 'prox', label: L('Distance response', '접근 거리별 대응'), x: 0, y: 0, w: 320, h: 300 },
    { id: 'stop', label: L('Emergency stop, three paths', '비상정지 3경로'), x: 340, y: 0, w: 380, h: 300 },
  ],
  nodes: [
    { id: 't1', kind: 'input', label: L('Remote button', '리모컨 버튼'), sub: L('zero torque, may fall', '0 토크, 쓰러질 수 있음'), x: 352, y: 40, w: 148, h: 52 },
    { id: 't2', kind: 'input', label: L('Voice "Stop"', '음성 "멈춰"'), sub: L('stops, stays standing', '선 채로 멈춤'), x: 352, y: 112, w: 148, h: 52 },
    { id: 't3', kind: 'input', label: L('Dashboard button', '대시보드 버튼'), sub: L('stops standing · logged', '선 채로 멈춤·기록'), x: 352, y: 184, w: 148, h: 52 },
    { id: 'llm', kind: 'ghost', label: L('Planning, dialogue', '판단·대화 계층'), sub: L('LLM · bypassed', 'LLM · 거치지 않음'), x: 536, y: 36, w: 172, h: 48 },
    { id: 'chan', kind: 'focus', label: L('Safety channel', '안전 채널'), sub: L('separate path', '별도 경로'), x: 536, y: 112, w: 172, h: 52 },
    { id: 'body', kind: 'plain', label: L('Body control', '전신 제어'), sub: L('stops at once', '즉시 정지'), x: 536, y: 228, w: 172, h: 52 },
  ],
  edges: [
    { from: 't1', to: 'chan', pts: [[500, 66], [516, 66], [516, 124], [536, 124]] },
    { from: 't2', to: 'chan', pts: [[500, 138], [536, 138]] },
    { from: 't3', to: 'chan', pts: [[500, 210], [524, 210], [524, 152], [536, 152]] },
    { from: 'chan', to: 'body', style: 'acc', pts: [[622, 164], [622, 228]], label: { text: L('DIRECT', '직결'), x: 632, y: 200, anchor: 'start' } },
  ],
  raw: {
    under: (l) => {
      const ring = (r, cls, text, y) => {
        const w = est(text) + 12;
        return `<circle class="${cls}" cx="${CX}" cy="${CY}" r="${r}"/><rect class="em wash" x="${CX - w / 2}" y="${y - 12}" width="${w}" height="16" rx="2"/><text class="rt ${cls}" x="${CX}" y="${y}" text-anchor="middle">${esc(text)}</text>`;
      };
      return (
        ring(108, 'r1', l === 'ko' ? '1m 이내 · 감속' : '1 m · slow down', CY - 108 + 4) +
        ring(52, 'r05', l === 'ko' ? '0.5m 이내 · 정지' : '0.5 m · stop', CY - 52 + 4) +
        `<circle class="robot" cx="${CX}" cy="${CY}" r="9"/><text class="ns" x="${CX}" y="${CY + 26}" text-anchor="middle">${l === 'ko' ? '로봇' : 'robot'}</text>` +
        `<text class="ns" x="${CX}" y="290" text-anchor="middle">${l === 'ko' ? 'LiDAR + Depth 카메라 이중 감지' : 'LiDAR + depth camera'}</text>`
      );
    },
  },
};

// ---------- C2. 거리 눈금 + 비상정지 표 ----------
export function c2Ruler(l) {
  const t = (en, ko) => esc(l === 'ko' ? ko : en);
  return `<svg viewBox="0 0 720 124" aria-hidden="true" focusable="false">
<text class="ns" x="0" y="16">${t('VISITOR APPROACHING', '관람객 접근')}</text>
<path class="ln" d="M120,12 H660" marker-end="url(#g13-ruler)"/>
<defs><marker id="g13-ruler" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon class="mk" points="0 0, 8 3, 0 6"/></marker></defs>
<rect class="band far" x="0" y="32" width="360" height="40" rx="6"/>
<rect class="band mid" x="368" y="32" width="152" height="40" rx="6"/>
<rect class="band near" x="528" y="32" width="152" height="40" rx="6"/>
<text class="nt" x="180" y="56" text-anchor="middle">${t('Normal speed', '정상 속도')}</text>
<text class="nt" x="444" y="56" text-anchor="middle">${t('Slows down', '자동 감속')}</text>
<text class="nt acc" x="604" y="56" text-anchor="middle">${t('Stops', '완전 정지')}</text>
<circle class="robot" cx="704" cy="52" r="9"/>
<path class="tick" d="M364,72 V88"/><path class="tick" d="M524,72 V88"/>
<text class="ns" x="364" y="100" text-anchor="middle">1 m</text><text class="ns" x="524" y="100" text-anchor="middle">0.5 m</text>
<text class="ns" x="704" y="100" text-anchor="middle">${t('robot', '로봇')}</text>
<text class="ns" x="0" y="120">${t('Resumes when the visitor steps away · walls and exhibits on the map are exempt from the 0.5 m stop', '관람객이 물러나면 자동 재개 · 지도에 있는 벽·전시물은 0.5m 정지 예외')}</text>
</svg>`;
}

const rowsC2 = [
  [L('Remote button', '리모컨 물리 버튼'), L('Docent or staff', '현장 도슨트·운영 직원'), L('Zero torque; the robot may fall', '0 토크 정지 (쓰러질 수 있음)'), L('Last resort', '최후 수단')],
  [L('Voice: "Stop"', '음성 "멈춰"'), L('Anyone nearby', '현장의 누구나'), L('Stops and stays standing', '주행·동작 멈춤, 선 상태 유지'), L('Standard path in service', '운영 중 표준 경로')],
  [L('Dashboard button', '대시보드 버튼'), L('Operator', '관제 운영자'), L('Stops and stays standing', '주행·동작 멈춤, 선 상태 유지'), L('Recommended; audit log', '운영 중 권장, 감사 로그')],
];
const headC2 = [L('Trigger', '트리거'), L('Who', '조작 주체'), L('Stop behavior', '정지 동작'), L('Note', '비고')];

export function c2(l) {
  return `<div class="dg c2"><div class="x-scroll" tabindex="0" role="region" aria-label="${l === 'ko' ? '접근 거리별 대응' : 'Distance response'}">${c2Ruler(l)}</div>
<table class="g13-tbl"><thead><tr>${headC2.map((h) => `<th scope="col">${h[l]}</th>`).join('')}</tr></thead><tbody>${rowsC2
    .map((r) => `<tr>${r.map((c, i) => `<td data-l="${headC2[i][l]}">${esc(c[l])}</td>`).join('')}</tr>`)
    .join('')}</tbody></table>
<p class="g13-key"><span class="sw-acc" aria-hidden="true"></span>${
    l === 'ko'
      ? '세 경로 모두 판단·대화 계층(LLM)을 거치지 않고 별도 안전 채널로 전신 제어에 직결. 어느 한 경로만 동작해도 즉시 정지'
      : 'All three paths skip the planning and dialogue layers (LLM) and go through a separate safety channel straight to body control, so any one of them stops the robot at once.'
  }</p></div>`;
}

// ---------- C3. 3중 방호 (감지 ⊂ 제어 ⊂ 관제, 안쪽이 관람객) ----------
const bandsC3 = [
  {
    name: L('Monitor · manage', '관제 · 관리'),
    items: L('Live battery and drive status, threshold alarms, fewer motions in crowds, backup robot on standby', '배터리·구동계 실시간 감시와 임계 알람, 밀집 시 동작 축소, 백업 로봇 대기'),
  },
  {
    name: L('Control · respond', '제어 · 대응'),
    items: L('Three-path E-Stop, anti-tip and speed limits, separate profiles for walking and interacting', '3경로 비상정지, 전복 방지와 속도 제한, 이동 중·인터랙션 중 안전 프로파일 분리'),
  },
  {
    name: L('Sense · prevent', '감지 · 예방'),
    items: L('LiDAR and depth camera: slow at 1 m, stop at 0.5 m, resume when clear', 'LiDAR·Depth 이중 센서: 1m 감속, 0.5m 정지, 이탈 시 재개'),
  },
];
export function c3(l) {
  let s = '';
  bandsC3.forEach((b, i) => {
    const x = i * 24, y = i * 64, w = 720 - i * 48, h = 300 - i * 64 - (i ? 16 * i : 0);
    s += `<rect class="ring3 b${i}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`;
    s += `<text class="zl${i === 2 ? ' acc' : ''}" x="${x + 16}" y="${y + 24}">${esc(b.name[l])}</text>`;
    s += `<text class="it" x="${x + 16}" y="${y + 44}">${esc(b.items[l])}</text>`;
  });
  s += `<g class="k-input"><rect x="72" y="200" width="576" height="36" rx="6"/></g><text class="nt" x="360" y="222" text-anchor="middle">${l === 'ko' ? '로비의 관람객 (어린이 포함, 다수 동시 접근)' : 'Visitors in the lobby, children included, often many at once'}</text>`;
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${l === 'ko' ? '안전 체계' : 'Safety'}"><svg viewBox="0 0 720 300" aria-hidden="true" focusable="false">${s}</svg></div>
<p class="hint">${l === 'ko' ? '그림을 옆으로 밀어 전체를 볼 수 있습니다.' : 'Scroll sideways to see the whole diagram.'}</p></figure>`;
}

const lgC1 = [
  { kind: 'acc-line', label: L('Safety channel', '안전 채널') },
  { kind: 'input', label: L('Stop trigger', '정지 트리거') },
  { kind: 'ghost', label: L('Bypassed layer', '거치지 않는 계층') },
];

export function safetyFig(v, l, title) {
  if (v === 'safety-a') return figure(c1, lgC1, l, title);
  if (v === 'safety-b') return c2(l);
  return c3(l);
}
export const safetyLint = () => lint('safety-a', c1);
