// g13 ② Architecture 시안 3종 (도슨트 휴머노이드). 출처: 착수보고서 4-1·4-2, 포커스 세미나 10쪽(GenP 아키텍처).
// 고객·협력사 명칭과 서버 사양은 넣지 않는다 (CLAUDE.md 규칙 3).
import { L, figure, lint, esc } from './lib.mjs';

const lgSafety = { kind: 'acc-line', label: L('Safety channel, separate path', '안전 채널 (별도 경로)') };
const lgDevice = { kind: 'input', label: L('People and on-site devices', '사람·현장 단말') };
const lgModule = { kind: 'plain', label: L('Software module', '소프트웨어 모듈') };

// ---------- B1. 4열 회로도: 현장 | 현장 서버 | 로봇 온보드(+외부) ----------
export const b1 = {
  width: 720,
  height: 552,
  zones: [
    { id: 'site', label: L('On site', '현장'), x: 0, y: 76, w: 112, h: 380 },
    { id: 'server', label: L('On-prem server', '현장 서버'), x: 140, y: 216, w: 160, h: 236 },
    { id: 'ext', label: L('External', '외부'), x: 320, y: 0, w: 400, h: 56 },
    { id: 'robot', label: L('Robot, onboard', '로봇 (온보드)'), x: 320, y: 76, w: 400, h: 380 },
    { id: 's2', label: L('System 2 · understand and plan', 'System 2 · 이해와 계획'), x: 332, y: 108, w: 376, h: 96 },
    { id: 's1', label: L('System 1 · real-time control', 'System 1 · 실시간 제어'), x: 332, y: 276, w: 376, h: 96 },
  ],
  nodes: [
    { id: 'visitors', kind: 'input', label: L('Visitors', '관람객'), sub: L('speech', '발화'), x: 8, y: 140, w: 96, h: 48 },
    { id: 'tablet', kind: 'input', label: L('Docent tablet', '도슨트 태블릿'), x: 8, y: 244, w: 96, h: 40 },
    { id: 'operator', kind: 'input', label: L('Operator', '관제 운영자'), x: 8, y: 312, w: 96, h: 40 },
    { id: 'estop', kind: 'focus', label: L('Wireless\nE-Stop', '무선\n비상정지'), x: 8, y: 396, w: 96, h: 48 },
    { id: 'dash', kind: 'plain', label: L('Control dashboard', '관제 대시보드'), sub: L('alarms · E-Stop', '상태·알람·E-Stop'), x: 152, y: 244, w: 136, h: 48 },
    { id: 'lists', kind: 'plain', label: L('Lists and scripts', '명단·멘트 관리'), sub: L('per tour, 4 languages', '회차별·4개국어'), x: 152, y: 316, w: 136, h: 48 },
    { id: 'logs', kind: 'plain', label: L('Logs', '로그'), sub: L('kept on site', '현장 보관'), x: 152, y: 388, w: 136, h: 48 },
    { id: 'api', kind: 'logic', label: L('STT/TTS API', 'STT/TTS API'), sub: L('allowed domains only', '허용 도메인만'), x: 560, y: 8, w: 136, h: 40 },
    { id: 'voice', kind: 'plain', label: L('Voice', '음성 대화'), sub: L('STT · TTS', 'STT·TTS'), x: 596, y: 136, w: 100, h: 56 },
    { id: 'orch', kind: 'plain', label: L('Orchestration', '오케스트레이션'), sub: L('4 scenarios', '4대 시나리오'), x: 460, y: 136, w: 124, h: 56 },
    { id: 'planner', kind: 'plain', label: L('Planner', '플래너'), sub: L('plan · replan', '계획·재계획'), x: 344, y: 136, w: 104, h: 56 },
    { id: 'bus', kind: 'logic', label: L('Runtime bus · commands and status', '런타임 버스 · 명령과 상태'), x: 332, y: 224, w: 376, h: 32 },
    { id: 'percep', kind: 'plain', label: L('Perception', '인식'), sub: L('people · distance', '사람·거리'), x: 344, y: 304, w: 104, h: 56 },
    { id: 'nav', kind: 'plain', label: L('Navigation', '자율주행'), sub: L('SLAM · avoidance', 'SLAM·회피'), x: 460, y: 304, w: 124, h: 56 },
    { id: 'body', kind: 'plain', label: L('Body control', '전신 제어'), sub: L('balance · stop', '균형·정지'), x: 596, y: 304, w: 100, h: 56 },
    { id: 'hw', kind: 'logic', label: L('Hardware and SDK', '하드웨어·SDK'), sub: L('LiDAR · RGB-D · mics · face display · joints', 'LiDAR·RGB-D·마이크·얼굴 화면·관절'), x: 332, y: 392, w: 376, h: 48 },
  ],
  edges: [
    { from: 'visitors', to: 'voice', style: 'both', pts: [[84, 140], [84, 64], [660, 64], [660, 136]] },
    { from: 'voice', to: 'api', style: 'both', pts: [[696, 164], [714, 164], [714, 28], [696, 28]] },
    { from: 'tablet', to: 'dash', pts: [[104, 264], [152, 264]] },
    { from: 'operator', to: 'dash', pts: [[104, 332], [124, 332], [124, 280], [152, 280]] },
    { from: 'dash', to: 'bus', style: 'both', pts: [[288, 248], [332, 248]] },
    { from: 's2', to: 'bus', style: 'both', pts: [[520, 204], [520, 224]] },
    { from: 'bus', to: 's1', style: 'both', pts: [[520, 256], [520, 276]] },
    { from: 'body', to: 'hw', pts: [[644, 360], [644, 392]] },
    {
      from: 'estop', to: 'body', style: 'acc',
      pts: [[56, 444], [56, 476], [714, 476], [714, 332], [696, 332]],
      label: { text: L('SAFETY CHANNEL · SKIPS PLANNING', '안전 채널 · 판단 계층 우회'), x: 520, y: 467 },
    },
  ],
};

// ---------- B2. 계층 띠: 위에서 아래로 사람 → 서버 → System 2 → 버스 → System 1 → 하드웨어 ----------
const COL = [148, 288, 428, 568];
const CW = 132;
const rowsB2 = [
  { id: 'r1', name: L('People and devices', '사람·단말'), where: L('on site', '현장'), y: 0, h: 64 },
  { id: 'r2', name: L('Server', '현장 서버'), where: L('on-prem', '온프레미스'), y: 76, h: 64 },
  { id: 'r3', name: L('System 2', 'System 2'), where: L('understand, plan', '이해·계획'), y: 152, h: 64 },
  { id: 'r4', name: L('Runtime bus', '런타임 버스'), where: L('onboard', '온보드'), y: 228, h: 40 },
  { id: 'r5', name: L('System 1', 'System 1'), where: L('real-time control', '실시간 제어'), y: 280, h: 64 },
  { id: 'r6', name: L('Hardware', '하드웨어'), where: L('SDK absorbed here', 'SDK 흡수'), y: 356, h: 64 },
];
const chip = (id, kind, row, col, label, sub, span = 1) => ({
  id, kind, label, sub, x: COL[col], y: row.y + (row.h - (sub ? 40 : 32)) / 2, w: CW * span + (span - 1) * 8, h: sub ? 40 : 32,
});
const R = Object.fromEntries(rowsB2.map((r) => [r.id, r]));
export const b2 = {
  width: 720,
  height: 484,
  zones: rowsB2.map((r) => ({ id: r.id, x: 0, y: r.y, w: 720, h: r.h })),
  nodes: [
    chip('estop', 'focus', R.r1, 0, L('Wireless E-Stop', '무선 비상정지')),
    chip('visitors', 'input', R.r1, 1, L('Visitors', '관람객')),
    chip('tablet', 'input', R.r1, 2, L('Docent tablet', '도슨트 태블릿')),
    chip('operator', 'input', R.r1, 3, L('Operator', '관제 운영자')),
    chip('dash', 'plain', R.r2, 0, L('Dashboard', '관제 대시보드'), L('alarms · E-Stop', '알람·E-Stop')),
    chip('lists', 'plain', R.r2, 1, L('Lists, scripts', '명단·멘트'), L('per tour', '회차별')),
    chip('logs', 'plain', R.r2, 2, L('Logs', '로그'), L('kept on site', '현장 보관')),
    chip('planner', 'plain', R.r3, 0, L('Planner', '플래너'), L('plan · replan', '계획·재계획')),
    chip('orch', 'plain', R.r3, 1, L('Orchestration', '오케스트레이션'), L('4 scenarios', '4대 시나리오')),
    chip('voice', 'plain', R.r3, 2, L('Voice', '음성 대화'), L('STT · TTS', 'STT·TTS')),
    chip('api', 'input', R.r3, 3, L('STT/TTS API', 'STT/TTS API'), L('external, firewall', '외부망·방화벽')),
    chip('bus', 'logic', R.r4, 0, L('Commands and status topics', '명령·상태 토픽'), undefined, 4),
    chip('body', 'plain', R.r5, 0, L('Body control', '전신 제어'), L('balance · stop', '균형·정지')),
    chip('nav', 'plain', R.r5, 1, L('Navigation', '자율주행'), L('SLAM · avoidance', 'SLAM·회피')),
    chip('percep', 'plain', R.r5, 2, L('Perception', '인식'), L('people · distance', '사람·거리')),
    chip('sensors', 'logic', R.r6, 0, L('Sensors', '센서'), L('LiDAR · RGB-D · mics', 'LiDAR·RGB-D·마이크')),
    chip('compute', 'logic', R.r6, 1, L('Onboard PC', '온보드 PC')),
    chip('joints', 'logic', R.r6, 2, L('Joints, hands', '관절·손')),
    chip('face', 'logic', R.r6, 3, L('Face display', '얼굴 화면'), L('expressions · LED', '표정·LED')),
  ],
  edges: [
    { from: 'estop', to: 'body', style: 'acc', pts: [[148, 32], [132, 32], [132, 312], [148, 312]] },
  ],
  raw: {
    under: (l) =>
      rowsB2
        .map(
          (r) =>
            `<text class="zl" x="12" y="${r.y + r.h / 2 - (r.h > 48 ? 2 : -4)}">${esc(r.name[l])}</text>` +
            (r.h > 48 ? `<text class="ns" x="12" y="${r.y + r.h / 2 + 12}">${esc(r.where[l])}</text>` : ''),
        )
        .join(''),
  },
};

// ---------- B3. 배치와 경계: 로비 / 현장 서버 / 외부망 ----------
export const b3 = {
  width: 720,
  height: 340,
  zones: [
    { id: 'lobby', label: L('Lobby', '로비'), x: 0, y: 0, w: 352, h: 276 },
    { id: 'server', label: L('On-prem server', '현장 서버'), x: 372, y: 0, w: 168, h: 276 },
    { id: 'net', label: L('Outside', '외부망'), x: 560, y: 0, w: 160, h: 276 },
  ],
  nodes: [
    { id: 'robot', kind: 'focus', label: L('Robot', '로봇'), sub: L('runs scenarios onboard', '시나리오를 온보드에서 실행'), x: 16, y: 40, w: 184, h: 136 },
    { id: 'visitors', kind: 'input', label: L('Visitors', '관람객'), x: 232, y: 40, w: 104, h: 40 },
    { id: 'tablet', kind: 'input', label: L('Docent tablet', '도슨트 태블릿'), x: 232, y: 112, w: 104, h: 40 },
    { id: 'estop', kind: 'input', label: L('Wireless E-Stop', '무선 비상정지'), x: 16, y: 212, w: 184, h: 44 },
    { id: 'server', kind: 'plain', label: L('Control server', '관제 서버'), sub: L('dashboard · lists · logs', '대시보드·명단·로그'), x: 384, y: 40, w: 144, h: 120 },
    { id: 'api', kind: 'plain', label: L('STT/TTS API', 'STT/TTS API'), x: 572, y: 40, w: 136, h: 40 },
    { id: 'fw', kind: 'logic', label: L('Firewall', '방화벽'), sub: L('allowed domains only', '허용 도메인만'), x: 572, y: 112, w: 136, h: 48 },
    { id: 'intranet', kind: 'ghost', label: L('Internal network', '사내망'), sub: L('not connected', '연동하지 않음'), x: 572, y: 212, w: 136, h: 44 },
  ],
  edges: [
    { from: 'visitors', to: 'robot', style: 'both', pts: [[232, 60], [200, 60]] },
    { from: 'robot', to: 'server', style: 'both', pts: [[200, 96], [384, 96]] },
    { from: 'tablet', to: 'server', pts: [[336, 132], [384, 132]], label: { text: L('WEB UI', '웹 UI'), x: 360, y: 123 } },
    { from: 'robot', to: 'fw', pts: [[200, 168], [640, 168], [640, 160]] },
    { from: 'fw', to: 'api', pts: [[640, 112], [640, 80]] },
    { from: 'estop', to: 'robot', style: 'acc', pts: [[108, 212], [108, 176]], label: { text: L('DIRECT RADIO', '직접 무선'), x: 120, y: 198, anchor: 'start' } },
  ],
};

export const notesB3 = [
  L('Scenarios run on the robot, so a tour keeps going if the network drops.', '시나리오는 로봇에서 실행되어 네트워크가 끊겨도 회차가 멈추지 않는다.'),
  L('The on-prem server only monitors and keeps logs; nothing leaves the site.', '현장 서버는 관제와 로그 보관만 맡고, 데이터는 현장 밖으로 나가지 않는다.'),
  L('Outbound traffic is limited to the speech APIs; the internal network is not connected.', '외부망은 음성 API 용도로만 열고, 사내망과는 연동하지 않는다.'),
];

const lgFocus = { kind: 'focus', label: L('Where scenarios run', '시나리오 실행 위치') };
const lgGhost = { kind: 'ghost', label: L('Not connected', '연동하지 않음') };

export const arch = {
  'arch-a': { spec: b1, legend: [lgSafety, lgDevice, lgModule] },
  'arch-b': { spec: b2, legend: [lgSafety, lgDevice, lgModule] },
  'arch-c': { spec: b3, legend: [lgFocus, lgSafety, lgGhost], notes: notesB3 },
};

export function archFig(v, l, title) {
  const d = arch[v];
  const after = d.notes ? `<ul class="g13-notes">${d.notes.map((n) => `<li>${esc(n[l])}</li>`).join('')}</ul>` : '';
  return figure(d.spec, d.legend, l, title, after);
}
export const archLint = () => Object.entries(arch).reduce((n, [k, d]) => n + lint(k, d.spec), 0);
