// g14 ③ 지능 계층: 명령 하나가 좌표 → 액션 청크 → 관절 목표각 → 토크로 바뀌는 과정 (새 섹션) 시안 3종.
// 출처: 회사소개서(고객 대상) "로봇 지능 계층 구조"(Illustrative 예시, 16×29 액션 청크, 토크 식), 제품 사양서 v0.1 Ⅰ.2(모델과 설치 위치).
// 회사소개서 그림은 쓰지 않고 내용만 다시 그린다 (사용자 결정 2026-11-21).
import { L, esc } from './lib.mjs';

const cmd = L('“Go to where the red cup is”', '“빨간 컵 있는 곳으로 가”');
const layers = [
  {
    name: L('Perception and mapping', '인지·매핑'),
    does: L('Maps the space, finds the goal', '지도를 만들고 목표를 좌표로'),
    where: L('FSR-VLN · local server', 'FSR-VLN · 로컬 서버'),
    in: [L('RGB-D, LiDAR points,', 'RGB-D, LiDAR 점군,'), L('language goal', '자연어 목표')],
    out: [L('semantic map,', '시맨틱 맵,'), L('goal coordinates', '목표 3D 좌표')],
    outTag: L('GOAL COORDINATES', '목표 좌표'),
    short: L('Perception', '인지·매핑'),
  },
  {
    name: L('VLA policy', '상위 지능 (VLA)'),
    does: L('Turns the goal into next motions', '목표를 앞으로 취할 동작으로'),
    where: L('GR00T N1.7 · local server', 'GR00T N1.7 · 로컬 서버'),
    in: [L('camera images,', '카메라 이미지,'), L('instruction, robot state', '자연어 지시, 로봇 상태')],
    out: [L('action chunk,', '액션 청크,'), L('16 steps × 29 joints', '16 스텝 × 관절 29개')],
    outTag: L('ACTION CHUNK · 16 × 29', '액션 청크 · 16 × 29'),
    short: L('VLA policy', 'VLA'),
  },
  {
    name: L('Whole-body control', '전신 제어'),
    does: L('Sets each step’s pose, keeps balance', '매 스텝 자세 결정, 균형·접촉 처리'),
    where: L('GEAR-SONIC · on-board PC2', 'GEAR-SONIC · 온보드 PC2'),
    in: [L('velocity or target pose,', '속도 명령·목표 자세,'), L('observation history', '관측 이력')],
    out: [L('joint target angles', '관절 목표각')],
    outTag: L('JOINT TARGETS · 29', '관절 목표각 · 29'),
    short: L('Body control', '전신 제어'),
  },
  {
    name: L('Motors', '하드웨어 (모터)'),
    does: L('Drives joints to close the error', '목표와 현재 각의 오차를 줄이도록 구동'),
    where: L('motor control · on-board PC1', '모터 제어 · 온보드 PC1'),
    in: [L('joint target angles', '관절 목표각')],
    out: [L('joint torque', '관절 토크')],
    outTag: L('JOINT TORQUE', '관절 토크'),
    short: L('Motors', '모터'),
  },
];
const eq = 'τ = Kp(θ* − θ) − Kd·ω';
const descent = L('EACH LAYER DOWN: LESS INFORMATION, MORE PRECISION', '내려갈수록 정보는 줄고 구체성은 늘어남');

const defs = (id) =>
  `<defs><marker id="${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon class="mk" points="0 0, 8 3, 0 6"/></marker></defs>`;

// 표본 그림: 좌표(축 + 점), 액션 청크(16×29 격자), 관절 목표각(29개 눈금), 토크 식.
function coords(x, y) {
  return `<path class="ptr" d="M${x},${y + 28} H${x + 28} M${x},${y + 28} V${y} M${x},${y + 28} L${x + 14},${y + 38}"/><circle class="dot" cx="${x + 22}" cy="${y + 10}" r="4"/><text class="t m" x="${x + 48}" y="${y + 24}" style="font-size:16px;fill:var(--text)">[2.3, 1.1, 0.8]</text>`;
}
function grid(x, y, cw = 6, ch = 3, gap = 1) {
  let s = '';
  for (let r = 0; r < 16; r++)
    for (let c = 0; c < 29; c++) {
      const v = 0.5 + 0.5 * Math.sin(c * 0.55 + r * 0.32) * Math.cos(c * 0.21 - r * 0.18);
      s += `<rect class="cell" x="${x + c * (cw + gap)}" y="${y + r * (ch + gap)}" width="${cw}" height="${ch}" opacity="${(0.15 + 0.85 * v).toFixed(2)}"/>`;
    }
  return s;
}
function ticks(x, y, h = 36, step = 7) {
  let s = `<path class="rule" d="M${x - 2},${y + h / 2} H${x + 28 * step + 2}"/>`;
  for (let c = 0; c < 29; c++) {
    const v = Math.sin(c * 0.9) * 0.6 + Math.sin(c * 0.23 + 1) * 0.4;
    const t = (v * h) / 2.2;
    s += `<path class="tk" d="M${x + c * step},${y + h / 2} V${(y + h / 2 - t).toFixed(1)}"/>`;
  }
  return s;
}
const eqText = (x, y, anchor = 'start') => `<text class="t m" x="${x}" y="${y}" text-anchor="${anchor}" style="fill:var(--text)">${eq}</text>`;

// ---------- C1. 계단: 왼쪽 계층 상자가 한 칸씩 내려가고, 오른쪽에 그 계층이 내놓는 데이터의 모양 ----------
function c1(l) {
  const W = 720, RY = [72, 176, 280, 384], RH = 80;
  let s = `<svg viewBox="0 0 ${W} 480" aria-hidden="true" focusable="false">${defs(`c1${l}`)}`;
  s += `<text class="t lab" x="${W}" y="20" text-anchor="end">${esc(descent[l])}</text>`;
  // 명령
  s += `<g class="k-input"><rect x="0" y="0" width="280" height="40" rx="6"/></g><text class="t b" x="140" y="25" text-anchor="middle">${esc(cmd[l])}</text>`;
  s += `<path class="ln" d="M140,40 V${RY[0]}" marker-end="url(#c1${l})"/>`;
  layers.forEach((ly, k) => {
    const x = 24 * k, y = RY[k];
    if (k < 3) s += `<path class="ln" d="M${x + 160},${y + RH} V${RY[k + 1]}" marker-end="url(#c1${l})"/>`;
    s += `<g class="${k === 1 ? 'k-focus' : 'k-plain'}"><rect x="${x}" y="${y}" width="280" height="${RH}" rx="6"/></g>`;
    s += `<text class="t m s" x="${x + 12}" y="${y + 20}">L${k + 1}</text><text class="t b" x="${x + 36}" y="${y + 20}">${esc(ly.name[l])}</text>`;
    s += `<text class="t" x="${x + 12}" y="${y + 44}">${esc(ly.does[l])}</text>`;
    s += `<text class="t s" x="${x + 12}" y="${y + 64}">${esc(ly.where[l])}</text>`;
    // 표본 패널
    const px = 360;
    s += `<rect class="band" x="${px}" y="${y}" width="${W - px}" height="${RH}" rx="6"/><text class="t lab${k === 1 ? ' acc' : ''}" x="${px + 12}" y="${y + 16}">${esc(ly.outTag[l])}</text>`;
    s += `<path class="ptr" d="M${x + 280},${y + RH / 2} H${px}" stroke-dasharray="2 3"/>`;
    if (k === 0) s += coords(px + 16, y + 28);
    if (k === 1) s += grid(px + 16, y + 24);
    if (k === 2) s += ticks(px + 20, y + 30);
    if (k === 3) s += eqText(px + 16, y + 52);
  });
  return s + `</svg>`;
}

// ---------- C2. 깔때기: 아래로 좁아지는 띠, 왼쪽 입력 · 오른쪽 출력 ----------
function c2(l) {
  const W = 720, widths = [400, 344, 288, 232], Y = [64, 140, 216, 292], H = 64;
  let s = `<svg viewBox="0 0 ${W} 420" aria-hidden="true" focusable="false">${defs(`c2${l}`)}`;
  s += `<g class="k-input"><rect x="220" y="0" width="280" height="40" rx="20"/></g><text class="t b" x="360" y="25" text-anchor="middle">${esc(cmd[l])}</text>`;
  s += `<text class="t lab" x="148" y="56" text-anchor="end">${esc(L('IN', '입력')[l])}</text><text class="t lab" x="572" y="56">${esc(L('OUT', '출력')[l])}</text>`;
  layers.forEach((ly, k) => {
    const w = widths[k], x = (W - w) / 2, y = Y[k], cy = y + H / 2;
    s += `<rect class="band ${k === 1 ? 'acc' : 'in'}" x="${x}" y="${y}" width="${w}" height="${H}" rx="6"/>`;
    s += `<text class="t b" x="360" y="${cy - 2}" text-anchor="middle">${esc(ly.name[l])}</text><text class="t s" x="360" y="${cy + 14}" text-anchor="middle">${esc(ly.where[l])}</text>`;
    const ins = ly.in, outs = k === 3 ? [...ly.out, { en: eq, ko: eq }] : ly.out;
    ins.forEach((t, i) => (s += `<text class="t s" x="${x - 12}" y="${cy - (ins.length - 1) * 6 + i * 12 + 3}" text-anchor="end">${esc(t[l])}</text>`));
    outs.forEach((t, i) => (s += `<text class="t s" x="${x + w + 12}" y="${cy - (outs.length - 1) * 6 + i * 12 + 3}"${k === 1 ? ' style="fill:var(--accent)"' : ''}>${esc(t[l])}</text>`));
  });
  s += `<path class="ln" d="M360,40 V64" marker-end="url(#c2${l})"/>`;
  s += `<text class="t lab" x="360" y="380" text-anchor="middle">${esc(descent[l])}</text>`;
  return s + `</svg>`;
}

// ---------- C3. 가로 릴레이: 명령 → 4계층, 아래에 각 출력, 그 아래 실행 위치 ----------
function c3(l) {
  const W = 720, X = [0, 150, 300, 450, 600], BW = 120;
  const names = [L('Command', '명령'), ...layers.map((ly) => ly.short)];
  let s = `<svg viewBox="0 0 ${W} 300" aria-hidden="true" focusable="false">${defs(`c3${l}`)}`;
  names.forEach((n, i) => {
    const kind = i === 0 ? 'k-input' : i === 2 ? 'k-focus' : 'k-plain';
    s += `<g class="${kind}"><rect x="${X[i]}" y="24" width="${BW}" height="56" rx="6"/></g><text class="t b" x="${X[i] + BW / 2}" y="56" text-anchor="middle">${esc(n[l])}</text>`;
    if (i < 4) s += `<path class="ln" d="M${X[i] + BW},52 H${X[i + 1]}" marker-end="url(#c3${l})"/>`;
    s += `<text class="t lab" x="${X[i]}" y="12">${i === 0 ? esc(L('INPUT', '입력')[l]) : `L${i}`}</text>`;
  });
  // 출력 표본
  const oy = 108;
  X.forEach((x, i) => (s += `<rect class="band" x="${x}" y="${oy}" width="${BW}" height="88" rx="6"/>`));
  s += `<text class="t s" x="60" y="${oy + 40}" text-anchor="middle">${esc(L('speech or', '음성 또는')[l])}</text><text class="t s" x="60" y="${oy + 52}" text-anchor="middle">${esc(L('control panel', '관제시스템')[l])}</text>`;
  s += `<text class="t m" x="210" y="${oy + 48}" text-anchor="middle" style="fill:var(--text)">[2.3, 1.1, 0.8]</text><text class="t s" x="210" y="${oy + 72}" text-anchor="middle">${esc(L('goal coordinates', '목표 좌표')[l])}</text>`;
  s += grid(304, oy + 12, 3, 2, 1) + `<text class="t s" x="360" y="${oy + 80}" text-anchor="middle" style="fill:var(--accent)">${esc(L('16 × 29 action chunk', '16 × 29 액션 청크')[l])}</text>`;
  s += ticks(456, oy + 20, 32, 3.8) + `<text class="t s" x="510" y="${oy + 80}" text-anchor="middle">${esc(L('joint targets', '관절 목표각')[l])}</text>`;
  s += `<text class="t m s" x="660" y="${oy + 48}" text-anchor="middle" style="fill:var(--text)">${eq}</text><text class="t s" x="660" y="${oy + 72}" text-anchor="middle">${esc(L('joint torque', '관절 토크')[l])}</text>`;
  // 실행 위치
  const ry = 228;
  const where = [
    [0, 120, L('Person, operator', '사람·운영자')],
    [150, 420, L('Local server · GPU', '로컬 서버 · GPU')],
    [450, 570, L('On-board PC2', '온보드 PC2')],
    [600, 720, L('On-board PC1', '온보드 PC1')],
  ];
  where.forEach(([a, b, t]) => (s += `<rect class="band in" x="${a}" y="${ry}" width="${b - a}" height="32" rx="4"/><text class="t" x="${(a + b) / 2}" y="${ry + 20}" text-anchor="middle">${esc(t[l])}</text>`));
  s += `<text class="t lab" x="0" y="${ry - 8}">${esc(L('RUNS ON', '실행 위치')[l])}</text><text class="t lab" x="0" y="${oy - 8}">${esc(L('OUTPUT', '출력')[l])}</text><text class="t lab" x="${W}" y="${ry + 64}" text-anchor="end">${esc(descent[l])}</text>`;
  return s + `</svg>`;
}

const capC = L(
  'Illustrative. One spoken command changes form at each layer, from language to coordinates, an action chunk, joint targets, and torque.',
  '예시. 음성 명령 하나가 계층을 내려가며 자연어 → 좌표 → 액션 청크 → 관절 목표각 → 토크로 형태를 바꾼다.',
);
export function stackFig(v, l, t) {
  const svg = v === 'stack-a' ? c1(l) : v === 'stack-b' ? c2(l) : c3(l);
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${esc(t)}">${svg}</div><p class="g14-cap">${esc(capC[l])}</p></figure>`;
}
