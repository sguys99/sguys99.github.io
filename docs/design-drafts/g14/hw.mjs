// g14 ⑤ G1 하드웨어 맵 (Architecture 안 소제목) 시안 3종.
// 출처: 제품 사양서 v0.1 Ⅰ(시스템 구성, 모델과 기능 설치 위치), Ⅲ(PC1·PC2), Ⅳ(G1 기본 사양: 제조사 공개 사양 기준).
// 사진: src/assets/robots/unitree-g1.jpg (도슨트 케이스와 같은 제조사 이미지, 출처 표기). 서버 GPU 등 TBD 사양은 넣지 않는다.
import { L, esc } from './lib.mjs';

const credit = L('Product image: Unitree Robotics. Specifications: manufacturer data for the G1 EDU.', '제품 이미지: Unitree Robotics. 사양: G1 EDU 제조사 공개 사양.');
const title = (l) => L('Hardware', '하드웨어 구성')[l];

// ---------- G1. 사진 + 지시선: 머리 센서, 몸통 컴퓨팅, 팔, 관절 ----------
const calls = [
  { y: 62, px: 193, name: L('Head sensors', '머리 센서'), sub: [L('3D LiDAR · Livox Mid-360', '3D LiDAR · Livox Mid-360'), L('depth camera · RealSense D435i', '깊이 카메라 · RealSense D435i')] },
  { y: 132, px: 196, name: L('Two computers', '컴퓨터 2대'), sub: [L('PC1 · motor control, robot state', 'PC1 · 저수준 모터 제어, 기체 상태'), L('PC2 · Jetson Orin NX 16GB: ROS 2, voice, Nav2, WBC', 'PC2 · Jetson Orin NX 16GB: ROS 2, 음성, Nav2, WBC')] },
  { y: 196, px: 200, name: L('Arms', '팔'), sub: [L('payload about 3 kg · gripper as an option', '가반하중 약 3kg · 그리퍼 옵션')] },
  { y: 248, px: 160, name: L('Joints', '관절'), sub: [L('23 to 43 DoF by build · dual encoders', 'EDU 구성별 23~43 DoF · 이중 엔코더'), L('knee up to 120 N·m', '무릎 최대 120 N·m')] },
];
const strip = [
  [L('Height, weight', '크기·무게'), L('1.32 m · 35 kg', '1.32m · 35kg')],
  [L('Battery', '배터리'), L('9,000 mAh · about 2 h', '9,000mAh · 약 2시간')],
  [L('Audio', '오디오'), L('4 mics · 5 W speaker', '마이크 4개 · 5W 스피커')],
  [L('Link', '통신'), L('Wi-Fi 6 · BT 5.2', 'Wi-Fi 6 · BT 5.2')],
];
function g1(l) {
  const W = 720, H = 452;
  let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">`;
  s += `<rect class="photo-bg" x="40" y="0" width="300" height="368" rx="6"/><image href="../../img/g1.webp" x="40" y="16" width="300" height="350" preserveAspectRatio="xMidYMid meet"/>`;
  calls.forEach((c) => {
    s += `<path class="ptr" d="M${c.px},${c.y} H404"/><circle class="pd" cx="${c.px}" cy="${c.y}" r="3.5"/>`;
    s += `<text class="t b" x="416" y="${c.y + 4}">${esc(c.name[l])}</text>`;
    c.sub.forEach((t, i) => (s += `<text class="t s" x="416" y="${c.y + 20 + i * 13}">${esc(t[l])}</text>`));
  });
  s += `<text class="t s" x="416" y="320">${esc(L('Top speed about 2 m/s; the service limit is set', '최대 속도 약 2m/s, 운영 속도 상한은')[l])}</text><text class="t s" x="416" y="333">${esc(L('by the risk assessment', '위험성 평가로 별도 확정')[l])}</text>`;
  s += `<line class="rule" x1="0" y1="392" x2="${W}" y2="392"/>`;
  strip.forEach(([k, v], i) => (s += `<text class="t lab" x="${i * 180}" y="416">${esc(k[l].toUpperCase())}</text><text class="t" x="${i * 180}" y="436">${esc(v[l])}</text>`));
  return s + `</svg>`;
}

// ---------- G2. 사양 카드: 작은 사진 + 감지·컴퓨팅·몸·전원 4칸 ----------
const cards = [
  [L('Sensing', '감지'), [[L('3D LiDAR', '3D LiDAR'), 'Livox Mid-360'], [L('Depth camera', '깊이 카메라'), 'RealSense D435i'], [L('Audio', '오디오'), L('4 mics, 5 W speaker', '마이크 4개, 5W 스피커')], [L('Body', '기체'), L('IMU, dual joint encoders', 'IMU, 관절 이중 엔코더')]]],
  [L('Compute', '컴퓨팅'), [[L('PC1', 'PC1'), L('8-core, motor control', '8코어, 저수준 모터 제어')], [L('PC2', 'PC2'), 'Jetson Orin NX 16GB'], [L('On PC2', 'PC2 탑재'), L('ROS 2, voice, Nav2 + FAST-LIO2, SONIC WBC', 'ROS 2, 음성, Nav2 + FAST-LIO2, SONIC WBC')]]],
  [L('Body', '몸'), [[L('Size', '크기'), L('1.32 m, 35 kg', '1.32m, 35kg')], [L('Joints', '관절'), L('23–43 DoF by build', 'EDU 구성별 23~43 DoF')], [L('Arm payload', '팔 가반하중'), L('about 3 kg', '약 3kg')], [L('Speed', '속도'), L('up to 2 m/s', '최대 약 2m/s')]]],
  [L('Power and link', '전원·통신'), [[L('Battery', '배터리'), L('9,000 mAh, about 2 h', '9,000mAh, 약 2시간')], [L('Swap', '교체'), L('quick-release packs', '퀵릴리즈 교체식')], [L('Network', '통신'), 'Wi-Fi 6, BT 5.2']]],
];
const v = (x, l) => (typeof x === 'string' ? x : x[l]);
function g2(l) {
  return `<div class="hw2"><div class="hw2-ph"><img src="../../img/g1.webp" alt="${esc(L('Unitree G1 humanoid robot, front view', 'Unitree G1 휴머노이드 로봇 정면')[l])}"><p class="g14-credit">Unitree G1 EDU</p></div>
<div class="hw2-grid">${cards
    .map(([h, rows], i) => `<section class="hw2-c${i === 1 ? ' hi' : ''}"><h4>${esc(h[l])}</h4><dl>${rows.map(([k, val]) => `<div><dt>${esc(v(k, l))}</dt><dd>${esc(v(val, l))}</dd></div>`).join('')}</dl></section>`)
    .join('')}</div></div><p class="g14-credit">${esc(credit[l])}</p>`;
}

// ---------- G3. 표준 구성 1식: 로봇 | 로컬 서버 | 외부 API, 무엇이 어디서 도는지 ----------
function g3(l) {
  const W = 720, H = 404;
  const col = (x, w, head, sub, items, acc) => {
    let s = `<text class="t b" x="${x}" y="244">${esc(head[l])}</text><text class="t s" x="${x}" y="260">${esc(sub[l])}</text>`;
    items.forEach(([n, d], i) => {
      const y = 284 + i * 28;
      s += `<path class="rule" d="M${x},${y - 14} H${x + w}"/><text class="t" x="${x}" y="${y + 2}"${acc === i ? ' style="fill:var(--accent);font-weight:var(--fw-strong)"' : ''}>${esc(n[l])}</text><text class="t s" x="${x + w}" y="${y + 2}" text-anchor="end">${esc(d[l])}</text>`;
    });
    return s;
  };
  let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false"><defs><marker id="g3${l}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto-start-reverse"><polygon class="mk" points="0 0, 8 3, 0 6"/></marker></defs>`;
  // 사진
  s += `<rect class="photo-bg" x="0" y="0" width="216" height="216" rx="6"/><image href="../../img/g1.webp" x="8" y="8" width="200" height="200" preserveAspectRatio="xMidYMid meet"/>`;
  // 서버 (선화)
  const sx = 296;
  s += `<g class="k-plain"><rect x="${sx}" y="56" width="152" height="120" rx="6"/></g>`;
  for (let i = 0; i < 4; i++) s += `<rect class="band" x="${sx + 12}" y="${68 + i * 26}" width="128" height="18" rx="2"/><circle class="dot" cx="${sx + 128}" cy="${77 + i * 26}" r="2.5"/>`;
  // 외부
  s += `<g class="k-input"><rect x="556" y="72" width="156" height="88" rx="6"/></g><text class="t b" x="634" y="112" text-anchor="middle">LLM · STT · TTS</text><text class="t s" x="634" y="128" text-anchor="middle">${esc(L('commercial APIs', '상용 API')[l])}</text>`;
  // 연결
  s += `<path class="ln" d="M216,116 H${sx}" marker-end="url(#g3${l})" marker-start="url(#g3${l})"/>`;
  s += `<rect class="em" x="220" y="94" width="72" height="11" rx="2"/><text class="t lab" x="256" y="102" text-anchor="middle">WI-FI 6</text><text class="t lab" x="256" y="134" text-anchor="middle">ROS 2 + ZMQ</text>`;
  s += `<path class="ln dash" d="M${sx + 152},116 H556" marker-end="url(#g3${l})" marker-start="url(#g3${l})"/><text class="t lab" x="504" y="106" text-anchor="middle">${esc(L('OUTBOUND', '외부망')[l])}</text>`;
  s += col(0, 216, L('Unitree G1 · on-board', 'Unitree G1 · 온보드'), L('PC1 motors · PC2 Jetson Orin NX', 'PC1 모터 · PC2 Jetson Orin NX'), [
    [L('Whole-body control', '전신 제어'), L('GEAR-SONIC', 'GEAR-SONIC')],
    [L('Navigation', '자율주행'), L('Nav2 + FAST-LIO2', 'Nav2 + FAST-LIO2')],
    [L('Voice, sensors', '음성·센서'), L('ROS 2 nodes', 'ROS 2 노드')],
    [L('Planner', '플래너'), L('behavior tree, in review', 'Behavior Tree (검토 중)')],
  ]);
  s += col(260, 236, L('Local server · off-board', '로컬 서버 · 오프보드'), L('one GPU server per site', '현장당 GPU 서버 1대'), [
    [L('VLA policy server', 'VLA 정책 서버'), L('GR00T N1.7', 'GR00T N1.7')],
    [L('VLN server', 'VLN 서버'), L('FSR-VLN', 'FSR-VLN')],
    [L('Control panel', '관제시스템'), L('Next.js + FastAPI', 'Next.js + FastAPI')],
    [L('Logs, model versions', '로그·모델 버전'), L('kept on site', '현장 보관')],
  ], 0);
  s += col(556, 156, L('External', '외부'), L('closed network: move on-prem', '폐쇄망이면 온프렘 전환'), [
    [L('STT', 'STT'), L('Whisper', 'Whisper')],
    [L('LLM, TTS', 'LLM·TTS'), L('vendor TBD', '선정 중')],
  ]);
  return s + `</svg>`;
}

export function hwFig(v, l, t) {
  if (v === 'hw-b') return g2(l);
  const svg = v === 'hw-a' ? g1(l) : g3(l);
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${esc(t)}">${svg}</div><p class="g14-credit">${esc(credit[l])}</p></figure>`;
}
export const hwTitle = title;
export const hwCss = `
.hw2 { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: var(--sp-4); align-items: start; margin-top: var(--sp-2); }
.hw2-ph img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: var(--radius-sm); background: #fff; }
.hw2-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-3); }
.hw2-c { border: 1px solid var(--line-strong); border-radius: var(--radius-sm); padding: var(--sp-3) var(--sp-4); background: var(--surface); }
.hw2-c.hi { border-color: var(--accent); }
.hw2-c h4 { font-size: var(--fs-sm); font-weight: var(--fw-strong); color: var(--text); margin-bottom: var(--sp-2); }
.hw2-c.hi h4 { color: var(--accent); }
.hw2-c dl { display: grid; gap: var(--sp-1); }
.hw2-c dl > div { display: grid; grid-template-columns: 88px minmax(0, 1fr); gap: var(--sp-2); font-size: var(--fs-sm); }
.hw2-c dt { color: var(--text-3); }
.hw2-c dd { color: var(--text-2); }
@container (max-width: 560px) {
  .hw2 { grid-template-columns: minmax(0, 1fr); }
  .hw2-ph img { max-width: 160px; }
  .hw2-grid { grid-template-columns: minmax(0, 1fr); }
}
`;
