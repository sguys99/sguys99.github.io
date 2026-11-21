// g14 ④ 데이터·모델 학습 루프 (새 섹션) 시안 3종.
// 출처: 회사소개서(고객 대상) "VLA 학습 데이터 구축 절차"·"VLA 모델 학습/평가", 제품 정의서 v0.3 Ⅱ.1(데이터·모델 파이프라인은 사내 설비, 산출 모델만 납품)·Ⅵ(데이터 수집),
//       상용화 로드맵 v0.2 Ⅵ.3(B1 Teleop 수집·EpisodeSchema, B2 VLA 학습·평가와 회귀 게이트), 에이지테크랩 시나리오 rev0.2(캔 분리수거 시연).
import { L, esc, figure, lint } from './lib.mjs';

const defs = (id) =>
  `<defs><marker id="${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon class="mk" points="0 0, 8 3, 0 6"/></marker><marker id="${id}a" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon class="mk acc" points="0 0, 8 3, 0 6"/></marker></defs>`;
const metrics = L('Measured by success rate, generalization, safety, speed, and recovery.', '평가 지표: 작업 성공률, 일반화 성능, 안전성, 수행 속도, 복구 능력.');

// ---------- D1. 고리: 6단계가 시계 방향으로 돌고, 가운데 에피소드 데이터셋이 쌓인다 ----------
const st = [
  { name: L('Collect', '데이터 수집'), sub: L('VR teleop · simulation', 'VR 텔레옵·시뮬레이션') },
  { name: L('Record episodes', '에피소드 기록'), sub: L('L + V + S + A + O', 'L + V + S + A + O') },
  { name: L('Curate and label', '정제·라벨링'), sub: L('segments · outcomes', '구간 지시·성공/실패') },
  { name: L('Fine-tune VLA', 'VLA 파인튜닝'), sub: L('pretrained + task data', '사전학습 + 작업 데이터') },
  { name: L('Evaluate', '단계별 평가'), sub: L('offline → sim → robot', '오프라인→시뮬→실기'), focal: true },
  { name: L('Run on site', '현장 적용'), sub: L('keep failure scenes', '실패 구간 저장') },
];
function d1(l) {
  const W = 720, H = 500, cx = 360, cy = 220, RX = 256, RY = 168, SW = 152, SH = 56;
  const th = (k) => ((-90 + k * 60) * Math.PI) / 180;
  const P = (t) => [cx + RX * Math.cos(t), cy + RY * Math.sin(t)];
  const box = (k) => {
    const [px, py] = P(th(k));
    return [Math.round((px - SW / 2) / 4) * 4, Math.round((py - SH / 2) / 4) * 4];
  };
  const inside = (k, [x, y]) => {
    const [bx, by] = box(k);
    return x > bx - 8 && x < bx + SW + 8 && y > by - 8 && y < by + SH + 8;
  };
  const id = `d1${l}`;
  let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">${defs(id)}`;
  for (let k = 0; k < 6; k++) {
    let a = th(k), b = th(k + 1);
    while (inside(k, P(a))) a += 0.005;
    while (inside((k + 1) % 6, P(b))) b -= 0.005;
    const [x1, y1] = P(a), [x2, y2] = P(b);
    s += `<path class="arc" d="M${x1.toFixed(1)},${y1.toFixed(1)} A${RX},${RY} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}" marker-end="url(#${id})"/>`;
  }
  // 바퀴살: 기록·정제·현장 → 데이터셋 (쓰기), 데이터셋 → 학습 (읽기). 허브 가장자리에서 상자 가장자리까지 직선.
  const hub = [cx - 100, cy - 40, 200, 80];
  const edgePt = ([bx, by, bw, bh], [tx, ty]) => {
    const [mx, my] = [bx + bw / 2, by + bh / 2];
    const dx = tx - mx, dy = ty - my;
    const f = Math.min(bw / 2 / Math.abs(dx || 1e-9), bh / 2 / Math.abs(dy || 1e-9));
    return [mx + dx * f, my + dy * f];
  };
  const spoke = (k, into) => {
    const [bx, by] = box(k);
    const st = [bx, by, SW, SH];
    const o = edgePt(hub, [bx + SW / 2, by + SH / 2]), i = edgePt(st, [cx, cy]);
    const [p, q] = into ? [i, o] : [o, i];
    const g = 6, len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const ux = (q[0] - p[0]) / len, uy = (q[1] - p[1]) / len;
    return `<path class="ln dash thin" d="M${(p[0] + ux * g).toFixed(1)},${(p[1] + uy * g).toFixed(1)} L${(q[0] - ux * g).toFixed(1)},${(q[1] - uy * g).toFixed(1)}" marker-end="url(#${id})"/>`;
  };
  s += spoke(1, true) + spoke(2, true) + spoke(5, true) + spoke(3, false);
  s += `<g class="k-logic"><rect x="${hub[0]}" y="${hub[1]}" width="200" height="80" rx="6"/></g><text class="t b" x="${cx}" y="${cy - 4}" text-anchor="middle">${esc(L('Episode dataset', '에피소드 데이터셋')[l])}</text><text class="t s" x="${cx}" y="${cy + 14}" text-anchor="middle">${esc(L('EpisodeSchema · train, val, eval', 'EpisodeSchema · 학습·검증·평가')[l])}</text>`;
  st.forEach((t, k) => {
    const [x, y] = box(k);
    s += `<g class="${t.focal ? 'k-focus' : 'k-plain'}"><rect x="${x}" y="${y}" width="${SW}" height="${SH}" rx="6"/></g><text class="t b" x="${x + SW / 2}" y="${y + 24}" text-anchor="middle">${esc(t.name[l])}</text><text class="t s" x="${x + SW / 2}" y="${y + 40}" text-anchor="middle">${esc(t.sub[l])}</text>`;
  });
  const [ex, ey] = box(4);
  s += `<text class="t lab acc" x="${ex}" y="${ey + SH + 20}">${esc(L('BELOW TARGET → CLASSIFY CAUSE', '목표 미달 → 원인 분류')[l])}</text><text class="t lab acc" x="${ex}" y="${ey + SH + 32}">${esc(L('→ COLLECT FAILURE SCENES', '→ 실패 장면 추가 수집')[l])}</text>`;
  s += `<line class="rule" x1="0" y1="${H - 32}" x2="${W}" y2="${H - 32}"/><text class="t" x="0" y="${H - 8}">${esc(metrics[l])}</text>`;
  return s + `</svg>`;
}

// ---------- D2. 파이프라인: 사내 설비(납품 안 함) 안에서 수집 → 학습 → 단계별 평가, 학습 모델만 현장으로. 실패는 포인트 색 길로 되돌아온다 ----------
export const d2 = {
  width: 720,
  height: 456,
  zones: [
    { id: 'house', label: L('In-house pipeline', '사내 데이터·모델 파이프라인'), note: L('not delivered', '납품 대상 아님'), x: 0, y: 0, w: 720, h: 264 },
    { id: 'eval', label: L('Staged evaluation', '단계별 평가'), x: 296, y: 144, w: 412, h: 108 },
    { id: 'site', label: L('Customer site', '고객 현장'), x: 0, y: 296, w: 720, h: 88 },
  ],
  nodes: [
    { id: 'define', kind: 'plain', label: L('Define task', '작업 정의'), sub: L('success criteria', '성공 기준·예외'), x: 16, y: 36, w: 112, h: 56 },
    { id: 'demo', kind: 'plain', label: L('Demonstrate', '행동 시연'), sub: L('VR teleop · sim', 'VR 텔레옵·시뮬'), x: 160, y: 36, w: 112, h: 56 },
    { id: 'record', kind: 'plain', label: L('Record', '데이터 기록'), sub: L('L+V+S+A+O', 'L+V+S+A+O'), x: 304, y: 36, w: 112, h: 56 },
    { id: 'curate', kind: 'plain', label: L('Curate, label', '정제·라벨링'), sub: L('segments · outcomes', '구간·성공/실패'), x: 448, y: 36, w: 112, h: 56 },
    { id: 'tune', kind: 'step', label: L('Fine-tune VLA', 'VLA 파인튜닝'), sub: L('GR00T N1.7', 'GR00T N1.7'), x: 592, y: 36, w: 112, h: 56 },
    { id: 'classify', kind: 'plain', label: L('Classify cause', '원인 분류'), sub: L('4 failure types', '인식·판단·행동·환경'), x: 160, y: 180, w: 112, h: 56 },
    { id: 'robot', kind: 'plain', label: L('Real robot', '실기 평가'), sub: L('optional', '선택'), x: 312, y: 180, w: 120, h: 56 },
    { id: 'sim', kind: 'plain', label: L('Simulation', '가상환경 평가'), sub: L('objects · light', '물체·조명·장애물'), x: 448, y: 180, w: 120, h: 56 },
    { id: 'offline', kind: 'plain', label: L('Offline check', '오프라인 검증'), sub: L('eval data', '평가 데이터'), x: 584, y: 180, w: 112, h: 56 },
    { id: 'field', kind: 'plain', label: L('Field operation', '현장 운영'), sub: L('monitor performance, safety', '운영 중 성능·안전 모니터링'), x: 272, y: 316, w: 176, h: 56 },
  ],
  edges: [
    { from: 'define', to: 'demo', pts: [[128, 64], [160, 64]] },
    { from: 'demo', to: 'record', pts: [[272, 64], [304, 64]] },
    { from: 'record', to: 'curate', pts: [[416, 64], [448, 64]] },
    { from: 'curate', to: 'tune', pts: [[560, 64], [592, 64]] },
    { from: 'tune', to: 'offline', pts: [[648, 92], [648, 180]] },
    { from: 'offline', to: 'sim', pts: [[584, 208], [568, 208]] },
    { from: 'sim', to: 'robot', pts: [[448, 208], [432, 208]] },
    { from: 'robot', to: 'field', pts: [[372, 236], [372, 316]], label: { text: L('TRAINED MODEL ONLY', '학습 모델만 납품'), x: 384, y: 288, anchor: 'start' } },
    { from: 'eval', to: 'classify', style: 'acc', pts: [[296, 220], [272, 220]] },
    { from: 'classify', to: 'demo', style: 'acc', pts: [[216, 180], [216, 92]], label: { text: L('COLLECT MORE', '추가 수집'), x: 224, y: 140, anchor: 'start' } },
    { from: 'field', to: 'classify', style: 'acc dash', pts: [[272, 344], [200, 344], [200, 236]], label: { text: L('FAILURE SCENES', '실패 구간'), x: 192, y: 284, anchor: 'end' } },
  ],
};
const d2Legend = [
  { kind: 'acc-line', label: L('Below target: back to data', '목표 미달: 데이터로 되돌림') },
  { kind: 'step', label: L('Model training', '모델 학습') },
  { kind: 'plain', label: L('Data and evaluation step', '데이터·평가 단계') },
];

// ---------- D3. 에피소드 해부 + 작은 고리: 시연 한 번이 다섯 줄의 기록이 되고, 그 기록이 학습 루프를 돈다 ----------
function d3(l) {
  const W = 720, H = 400, X0 = 120, X1 = 680, id = `d3${l}`;
  const segs = [
    [X0, 240, L('move to table', '테이블로 이동')],
    [240, 392, L('grasp the can', '캔 파지')],
    [392, 560, L('carry to the bin', '분리수거함으로 이동')],
    [560, X1, L('drop, sort', '분리수거')],
  ];
  const tracks = [L('Language', '언어 지시'), L('Vision', '카메라 영상'), L('State', '로봇 상태'), L('Action', '행동'), L('Outcome', '결과')];
  let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">${defs(id)}`;
  segs.forEach(([a, b, t]) => (s += `<text class="t s" x="${(a + b) / 2}" y="16" text-anchor="middle">${esc(t[l])}</text>`));
  segs.slice(1).forEach(([a]) => (s += `<path class="ptr" d="M${a},24 V212" stroke-dasharray="2 3"/>`));
  tracks.forEach((t, k) => {
    const y = 32 + k * 36;
    s += `<text class="t b" x="0" y="${y + 16}">${esc(t[l])}</text><text class="t s" x="104" y="${y + 16}" text-anchor="end">${'LVSAO'[k]}</text>`;
    if (k === 0) s += `<rect class="band in" x="${X0}" y="${y}" width="${X1 - X0}" height="24" rx="4"/><text class="t" x="${X0 + 12}" y="${y + 16}">${esc(L('“Pick up the can on the table and sort it into recycling”', '“테이블 위 캔을 집어 분리수거함에 정리해”')[l])}</text>`;
    if (k === 1) for (let i = 0; i < 14; i++) s += `<rect class="frame" x="${X0 + i * 40}" y="${y}" width="36" height="24" rx="2"/>`;
    if (k === 2) {
      let d = `M${X0},${y + 12}`;
      for (let x = X0; x <= X1; x += 8) d += ` L${x},${(y + 12 - 9 * Math.sin((x - X0) / 34) * Math.cos((x - X0) / 97)).toFixed(1)}`;
      s += `<path class="wave" d="${d}"/>`;
    }
    if (k === 3) for (let i = 0; i < 35; i++) s += `<rect class="cell" x="${X0 + i * 16}" y="${y + 4}" width="12" height="16" rx="1" opacity="${(0.25 + 0.6 * Math.abs(Math.sin(i * 0.7))).toFixed(2)}"/>`;
    if (k === 4) s += `<path class="rule" d="M${X0},${y + 12} H${X1 - 72}"/><rect class="band acc" x="${X1 - 64}" y="${y}" width="96" height="24" rx="12"/><text class="t b" x="${X1 - 16}" y="${y + 16}" text-anchor="middle" style="fill:var(--accent)">${esc(L('success', '성공')[l])}</text>`;
  });
  // 학습 루프 (작게)
  const ly = 248, B = [[0, L('Collect', '수집'), L('teleop · sim', '텔레옵·시뮬')], [188, L('Curate, label', '정제·라벨링'), L('per segment', '구간별 라벨')], [376, L('Fine-tune VLA', 'VLA 파인튜닝'), L('GR00T N1.7', 'GR00T N1.7')], [564, L('Evaluate', '단계별 평가'), L('offline · sim · robot', '오프라인·시뮬·실기')]];
  s += `<line class="rule" x1="0" y1="232" x2="${W}" y2="232"/>`;
  B.forEach(([x, n, sub], i) => {
    s += `<g class="${i === 3 ? 'k-focus' : 'k-plain'}"><rect x="${x}" y="${ly}" width="140" height="56" rx="6"/></g><text class="t b" x="${x + 70}" y="${ly + 24}" text-anchor="middle">${esc(n[l])}</text><text class="t s" x="${x + 70}" y="${ly + 40}" text-anchor="middle">${esc(sub[l])}</text>`;
    if (i < 3) s += `<path class="ln" d="M${x + 140},${ly + 28} H${x + 188}" marker-end="url(#${id})"/>`;
  });
  s += `<path class="ln acc" d="M634,${ly + 56} V${ly + 84} Q634,${ly + 92} 626,${ly + 92} H78 Q70,${ly + 92} 70,${ly + 84} V${ly + 56}" marker-end="url(#${id}a)"/>`;
  const rt = L('BELOW TARGET · COLLECT FAILURE SCENES', '목표 미달 · 실패 장면 추가 수집')[l];
  s += `<rect class="em" x="${360 - rt.length * 3}" y="${ly + 72}" width="${rt.length * 6}" height="11" rx="2"/><text class="t lab acc" x="360" y="${ly + 80}" text-anchor="middle">${esc(rt)}</text>`;
  s += `<text class="t" x="0" y="${H - 4}">${esc(metrics[l])}</text>`;
  return s + `</svg>`;
}

const capD = L(
  'The data and model pipeline is an in-house facility; customers receive only the trained models.',
  '데이터·모델 파이프라인은 사내 설비로 운영하고, 고객에게는 학습된 모델만 납품한다.',
);
export function loopFig(v, l, t) {
  const cap = `<p class="g14-cap">${esc(capD[l])}</p>`;
  if (v === 'loop-b') return figure(d2, d2Legend, l, t, cap + `<p class="g14-cap">${esc(metrics[l])}</p>`);
  const svg = v === 'loop-a' ? d1(l) : d3(l);
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${esc(t)}">${svg}</div>${cap}</figure>`;
}
export const loopLint = () => lint('loop-b', d2);
