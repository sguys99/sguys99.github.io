// g13 ① Visitor journey 시안 3종. 출처: 착수보고서 3-1~3-4, 포커스 세미나 7쪽(적용 구역 개념도).
// 위치는 개념도(-illustrative-). 브랜드·캐릭터 이름과 실제 멘트는 넣지 않는다.
import { L, figure, lint, esc, path } from './lib.mjs';

const steps = [
  {
    t: L('Welcome', '환영 인사'),
    d: L('Walks out to the welcome spot, waves, and greets visitors in the selected language.', '환영 위치로 걸어 나와 손을 흔들고 선택한 언어로 환영 인사'),
    k: L('navigation · gesture · voice · face', '자율주행·제스처·음성·표정'),
  },
  {
    t: L('Name check', '성함 확인'),
    d: L('Asks for a name, matches it against the visitor list, and greets the visitor by name; if unsure, asks once more, then greets without a name.', '성함을 묻고 사전 등록 명단과 대조해 이름으로 인사. 확신이 낮으면 한 번 되묻고, 그래도 실패하면 이름 없이 인사'),
    k: L('STT · list match · TTS', 'STT·명단 대조·TTS'),
  },
  {
    t: L('Souvenir handout', '기념품 전달'),
    d: L('Carries a basket on fixed-pose arms along a set route at low speed while visitors take one.', '고정 자세로 바구니를 받치고 정해진 동선을 저속 보행, 관람객이 직접 수령'),
    k: L('balance control · navigation', '균형 제어·자율주행'),
  },
  {
    t: L('Photo time', '포토타임'),
    d: L('Lines up at the photo spot, offers a high five, finger heart, or signature pose, and counts down on its face display.', '포토스팟에서 하이파이브·손가락 하트·시그니처 포즈를 취하고 얼굴 화면으로 카운트다운'),
    k: L('gesture · face display', '제스처·얼굴 화면'),
  },
];
const callNote = L(
  'A docent starts each tour with a tablet button or a wake word. The robot runs all four steps in one pass, says goodbye, and walks back to the waiting zone to charge.',
  '도슨트가 태블릿 버튼이나 호출어로 회차를 시작한다. 로봇은 네 단계를 이어서 수행하고, 마무리 인사 후 대기 구역으로 돌아가 충전한다.',
);

const stepList = (l) =>
  `<ol class="g13-steps">${steps
    .map((s, i) => `<li><span class="mk-n" aria-hidden="true">${i + 1}</span><div><b>${esc(s.t[l])}</b><p>${esc(s.d[l])}</p><span class="tg">${esc(s.k[l])}</span></div></li>`)
    .join('')}</ol>`;

// ---------- A1. 로비 평면 개념도 + 단계 목록 ----------
const mark = (n, x, y) => `<circle class="mkc" cx="${x}" cy="${y}" r="12"/><text class="mkt" x="${x}" y="${y + 4}" text-anchor="middle">${n}</text>`;
const lab = (x, y, name, sub, a = 'start') =>
  `<text class="nt" x="${x}" y="${y}" text-anchor="${a}">${esc(name)}</text>` + (sub ? `<text class="ns" x="${x}" y="${y + 14}" text-anchor="${a}">${esc(sub)}</text>` : '');

export const a1 = {
  width: 720,
  height: 300,
  zones: [
    { id: 'lobby', label: L('Lobby, illustrative', '로비 (개념도)'), x: 0, y: 0, w: 720, h: 300 },
    { id: 'wait', x: 16, y: 172, w: 176, h: 112, dash: true },
  ],
  nodes: [
    { id: 'wall', kind: 'logic', label: L('Exhibit wall', '전시 벽'), x: 200, y: 12, w: 240, h: 28 },
    { id: 'dock', kind: 'logic', label: L('Charging spot', '충전 스팟'), x: 32, y: 228, w: 144, h: 40 },
    { id: 'door', kind: 'input', label: L('Visitor entrance', '입구·관람객 집결'), x: 560, y: 248, w: 144, h: 40 },
  ],
  edges: [
    { from: 'wait', to: 's2', pts: [[192, 200], [280, 200], [280, 132]] },
    { from: 's2', to: 's3', pts: [[300, 120], [344, 120], [344, 200], [356, 200]] },
    { from: 's3', to: 's4', pts: [[388, 200], [620, 200], [620, 132]] },
    { from: 's4', to: 'wait', style: 'back', pts: [[620, 108], [620, 56], [120, 56], [120, 172]], label: { text: L('BACK TO CHARGE', '복귀 후 충전'), x: 520, y: 48 } },
  ],
  raw: {
    under: (l) => `<path class="route" d="M400,200 H520"/>`,
    over: (l) =>
      lab(32, 196, l === 'ko' ? '대기 구역' : 'Waiting zone') +
      `<rect class="mkc" x="260" y="108" width="40" height="24" rx="12"/><text class="mkt" x="280" y="124" text-anchor="middle">1 · 2</text>` +
      lab(280, 84, l === 'ko' ? '환영 인사·성함 확인' : 'Welcome, name check', l === 'ko' ? '정지·시선 정렬·이름 호칭' : 'stops, faces, greets by name', 'middle') +
      mark(3, 372, 200) +
      lab(460, 176, steps[2].t[l], l === 'ko' ? '저속 보행·관람객 자율 수령' : 'slow walk, visitors take one', 'middle') +
      mark(4, 620, 120) +
      lab(600, 116, steps[3].t[l], l === 'ko' ? '포즈·카운트다운' : 'pose, countdown', 'end'),
  },
};

// ---------- A2. 시나리오 레인 (단계 × 이동·음성·제스처·관람객) ----------
const lanes = [
  {
    n: L('Move', '이동'),
    c: [L('Walks to the welcome\nspot, faces visitors', '환영 위치로 보행,\n시선 정렬'), L('Stands still', '정지 상태 유지'), L('Slow walk on a set\nroute, arms fixed', '고정 동선 저속 보행,\n팔 고정 자세'), L('To the photo spot,\nthen back to charge', '포토스팟 이동 후\n대기 구역 복귀')],
  },
  {
    n: L('Voice', '음성'),
    c: [L('Greets in the\nselected language', '선택 언어로\n환영 인사'), L('Asks for a name,\nre-asks once', '성함 질문,\n되묻기 1회'), L('Invites visitors\nto take one', '수령 안내'), L('Counts down,\nsays goodbye', '카운트다운,\n마무리 인사')],
  },
  {
    n: L('Gesture, face', '제스처·표정'),
    c: [L('Wave, bow, smile', '손 흔들기·인사·미소'), L('Listening face,\nlight bow', '듣는 중 표정,\n가벼운 인사'), L('Keeps the basket\nlevel', '바구니 수평 유지'), L('High five, heart,\nsignature pose', '하이파이브·하트·\n시그니처 포즈')],
  },
  {
    n: L('Visitor', '관람객'),
    c: [L('Gathers at the\nentrance', '입구에 모임'), L('Says their name', '이름을 말함'), L('Takes a souvenir', '기념품 수령'), L('Poses for photos', '함께 사진 촬영')],
  },
];
export function a2(l) {
  const X0 = 112, CWd = 152, TOP = 52, RH = 60;
  let s = '';
  steps.forEach((st, i) => {
    const x = X0 + i * CWd, y = 0, h = 36, w = CWd - 4;
    const notch = i ? `${x + 8},${y + h / 2} ` : '';
    s += `<polygon class="stg" points="${notch}${x},${y} ${x + w - 8},${y} ${x + w},${y + h / 2} ${x + w - 8},${y + h} ${x},${y + h}"/>`;
    s += `<circle class="mkc" cx="${x + 22}" cy="18" r="9"/><text class="mkt" x="${x + 22}" y="21" text-anchor="middle">${i + 1}</text>`;
    s += `<text class="stt" x="${x + 38}" y="22">${esc(st.t[l])}</text>`;
  });
  lanes.forEach((ln, r) => {
    const y = TOP + r * RH;
    s += `<line class="rule" x1="0" y1="${y}" x2="720" y2="${y}"/>`;
    s += `<text class="zl" x="0" y="${y + 24}">${esc(ln.n[l])}</text>`;
    ln.c.forEach((c, i) => {
      c[l].split('\n').forEach((t, j) => (s += `<text class="ct" x="${X0 + i * CWd + 8}" y="${y + 24 + j * 16}">${esc(t)}</text>`));
    });
  });
  s += `<line class="rule" x1="0" y1="${TOP + lanes.length * RH}" x2="720" y2="${TOP + lanes.length * RH}"/>`;
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${l === 'ko' ? '관람 동선' : 'Visitor journey'}"><svg viewBox="0 0 720 ${TOP + lanes.length * RH + 4}" aria-hidden="true" focusable="false">${s}</svg></div>
<p class="hint">${l === 'ko' ? '그림을 옆으로 밀어 전체를 볼 수 있습니다.' : 'Scroll sideways to see the whole diagram.'}</p></figure><p class="g13-cap">${esc(callNote[l])}</p>`;
}

// ---------- A3. 노선도 (호출 → 4단계 → 복귀) ----------
const stations = [
  { t: L('Call', '호출'), d: L('Tablet button\nor wake word', '태블릿 버튼\n또는 호출어'), k: L('web UI · voice', '웹 UI·음성'), end: true },
  ...steps.map((s, i) => ({
    t: s.t,
    d: [L('Walks out, waves,\ngreets visitors', '걸어 나와 손 흔들고\n환영 인사'), L('Matches the name\nto the visitor list', '명단과 대조해\n이름으로 인사'), L('Carries a basket\nat walking pace', '바구니를 받치고\n저속 보행'), L('Poses, counts down\non its face display', '포즈 후 얼굴 화면\n카운트다운')][i],
    k: [L('nav · gesture · TTS', '주행·제스처·TTS'), L('STT · list match', 'STT·명단 대조'), L('balance · nav', '균형·주행'), L('gesture · face', '제스처·표정')][i],
  })),
  { t: L('Return', '복귀'), d: L('Says goodbye,\nwalks back to charge', '마무리 인사 후\n복귀·충전'), k: L('nav · charging', '주행·충전'), end: true },
];
export function a3(l) {
  const xs = stations.map((_, i) => 64 + i * 115.2);
  let s = `<path class="track" d="M${xs[0]},72 H${xs.at(-1)}"/>`;
  s += `<path class="track dash" d="M${xs.at(-1)},72 V100" />`;
  stations.forEach((st, i) => {
    const x = Math.round(xs[i]);
    s += `<text class="nt" x="${x}" y="44" text-anchor="middle">${esc(st.t[l])}</text>`;
    if (st.end) s += `<circle class="st0" cx="${x}" cy="72" r="7"/>`;
    else s += `<circle class="mkc" cx="${x}" cy="72" r="11"/><text class="mkt" x="${x}" y="76" text-anchor="middle">${i}</text>`;
    st.d[l].split('\n').forEach((t, j) => (s += `<text class="ct" x="${x}" y="${112 + j * 16}" text-anchor="middle">${esc(t)}</text>`));
    s += `<text class="ns" x="${x}" y="160" text-anchor="middle">${esc(st.k[l])}</text>`;
  });
  s = s.replace(`<path class="track dash" d="M${xs.at(-1)},72 V100" />`, '');
  s += `<line class="rule" x1="0" y1="184" x2="720" y2="184"/><text class="ns" x="0" y="204">${
    l === 'ko' ? '이동 구간 전체: 1m 이내 감속, 0.5m 이내 정지 · 회차 사이에는 대기 구역에서 충전' : 'Whole route: slows within 1 m, stops within 0.5 m · charges in the waiting zone between tours'
  }</text>`;
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${l === 'ko' ? '관람 동선' : 'Visitor journey'}"><svg viewBox="0 0 720 212" aria-hidden="true" focusable="false">${s}</svg></div>
<p class="hint">${l === 'ko' ? '그림을 옆으로 밀어 전체를 볼 수 있습니다.' : 'Scroll sideways to see the whole diagram.'}</p></figure>`;
}

export function journeyFig(v, l, title) {
  if (v === 'journey-a') return figure(a1, null, l, title, `<p class="g13-cap">${esc(callNote[l])}</p>${stepList(l)}`);
  if (v === 'journey-b') return a2(l);
  return a3(l);
}
export const journeyLint = () => lint('journey-a', a1);
