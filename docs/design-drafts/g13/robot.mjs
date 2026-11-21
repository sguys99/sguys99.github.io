// g13 ④ Robot selection (Approach 안) 시안 3종 + ⑤ Roadmap (Outcome 안) 시안 3종.
// 출처: 착수보고서 4-3·별첨 D, 포커스 세미나 9쪽(기종 비교)·12쪽(단계별 확장). 사진은 세미나 9쪽 원본(Unitree, AgiBot 제공 이미지).
import { L, esc } from './lib.mjs';

const head = [L('', ''), L('Unitree G1 (EDU)', 'Unitree G1 (EDU)'), L('AgiBot X2 Ultra', 'AgiBot X2 Ultra')];
const rows = [
  [L('Face display', '얼굴 디스플레이'), L('None; needs a custom front panel and expression control', '미탑재, 전면부 개조와 표정 제어 개발 필요'), L('Built in; expressions and LED through the SDK', '기본 탑재, SDK 표정 제어·LED')],
  [L('Head and gaze', '헤드와 시선'), L('Fixed head, no neck joint', '헤드 고정, 목 자유도 없음'), L('Neck joint to face visitors; head touch sensor', '목 관절로 시선 정렬, 헤드 터치 센서')],
  [L('Interaction motions', '인터랙션 모션'), L('Basic gestures; scenario motions built in-house', '기본 제스처 위주, 시나리오 모션 직접 개발'), L('28 presets plus a custom motion tool', '프리셋 28종, 커스텀 모션 제작·배포')],
  [L('Navigation sensors', '자율주행 센서'), L('LiDAR −7° to 52° vertical; blind spot near the floor', 'LiDAR 수직 −7°~52°, 근거리 바닥 사각'), L('LiDAR ±45° vertical; 156° wide-angle stereo', 'LiDAR 수직 ±45°, 광각 스테레오 156°')],
  [L('Charging in service', '운영 중 충전'), L('Battery swap; about 2 hours continuous', '불가 (배터리 교체식), 연속 약 2시간'), L('Walks back to a charging spot', '가능 (충전 스팟 복귀 연계)')],
  [L('Height, weight', '크기·무게'), L('1.32 m, 35 kg', '1.32m, 35kg'), L('1.31 m, 39 kg', '1.31m, 39kg')],
];
const verdict = L(
  'Chose X2 Ultra: it meets every requirement with stock hardware, so no modification was needed, and a unit in local stock removed the 7–10 week import lead time. The software absorbs each robot’s SDK in its hardware layer, so the same stack runs on G1.',
  'X2 Ultra 선정: 모든 요구 사항을 기본 사양으로 충족해 하드웨어 개조가 필요 없고, 국내 재고로 7~10주 해외 조달 기간을 없앴다. 소프트웨어는 기종별 SDK를 하드웨어 계층에서 흡수하므로 같은 스택이 G1에서도 동작한다.',
);
const sel = L('Selected', '선정');

function table(l) {
  return `<table class="g13-tbl cmp"><colgroup><col class="c0"><col><col class="pick"></colgroup>
<thead><tr><th scope="col"><span class="sr-only">${l === 'ko' ? '항목' : 'Criterion'}</span></th><th scope="col">${head[1][l]}</th><th scope="col" class="pick">${head[2][l]} <span class="badge-sel">${sel[l]}</span></th></tr></thead>
<tbody>${rows
    .map((r) => `<tr><th scope="row">${esc(r[0][l])}</th><td data-l="G1">${esc(r[1][l])}</td><td class="pick" data-l="X2 Ultra · ${sel[l]}">${esc(r[2][l])}</td></tr>`)
    .join('')}</tbody></table><p class="g13-cap">${esc(verdict[l])}</p>`;
}

// 선화: 같은 비율의 단순 도형. X2는 얼굴 화면·목·가슴 LED, G1은 화면 없는 고정 헤드.
function robotSvg(kind, l, callouts) {
  const x2 = kind === 'x2';
  let s = '';
  // 다리·발
  s += `<rect class="rb" x="42" y="148" width="15" height="62" rx="6"/><rect class="rb" x="63" y="148" width="15" height="62" rx="6"/>`;
  s += `<rect class="rb dk" x="38" y="210" width="22" height="8" rx="3"/><rect class="rb dk" x="60" y="210" width="22" height="8" rx="3"/>`;
  // 골반·허리
  s += `<rect class="rb dk" x="40" y="128" width="40" height="18" rx="7"/><rect class="rb dk" x="48" y="112" width="24" height="18" rx="4"/>`;
  // 팔
  s += `<rect class="rb" x="${x2 ? 18 : 22}" y="58" width="12" height="66" rx="6"/><rect class="rb" x="${x2 ? 90 : 86}" y="58" width="12" height="66" rx="6"/>`;
  // 몸통
  s += x2 ? `<rect class="rb" x="32" y="52" width="56" height="62" rx="18"/>` : `<rect class="rb" x="36" y="52" width="48" height="60" rx="12"/>`;
  if (x2) s += `<path class="led" d="M48,64 Q60,58 72,64"/>`;
  // 목·머리
  if (x2) {
    s += `<rect class="rb dk" x="54" y="44" width="12" height="10" rx="2"/>`;
    s += `<rect class="rb dk" x="42" y="8" width="36" height="38" rx="9"/><rect class="face" x="47" y="16" width="26" height="18" rx="4"/>`;
    s += `<rect class="eye" x="53" y="21" width="4" height="8" rx="2"/><rect class="eye" x="63" y="21" width="4" height="8" rx="2"/>`;
  } else {
    s += `<rect class="rb dk" x="46" y="18" width="28" height="34" rx="12"/><path class="visor" d="M50,30 H70"/>`;
  }
  let c = '';
  let W = 120;
  if (callouts) {
    W = 260;
    const items = x2
      ? [
          [L('Face display', '얼굴 화면'), 74, 25, 34],
          [L('Neck joint', '목 관절'), 66, 49, 62],
          [L('LED strip', 'LED 라이팅'), 72, 63, 90],
        ]
      : [[L('Fixed head', '고정 헤드'), 74, 30, 34]];
    items.forEach(([t, px, py, ty]) => {
      c += `<path class="ptr" d="M${px},${py} H130 V${ty} H138"/><circle class="pd" cx="${px}" cy="${py}" r="2"/><text class="ct" x="144" y="${ty + 4}">${esc(t[l])}</text>`;
    });
  }
  return `<svg viewBox="0 0 ${W} 224" aria-hidden="true" focusable="false" class="rsvg">${s}${c}</svg>`;
}

const credit = L('Product images: Unitree Robotics, AgiBot', '제품 이미지: Unitree Robotics, AgiBot');
function figRow(l, mode) {
  const cell = (k) =>
    mode === 'photo'
      ? `<img src="/draft-g13/img/${k}.webp" alt="${k === 'g1' ? 'Unitree G1' : 'AgiBot X2 Ultra'}" width="480" height="560" loading="lazy">`
      : robotSvg(k, l, true);
  return `<div class="cmp-fig ${mode}"><span></span><div>${cell('g1')}</div><div class="pick">${cell('x2')}</div></div>${
    mode === 'photo' ? `<p class="g13-credit">${credit[l]}</p>` : ''
  }`;
}

export function robotFig(v, l) {
  if (v === 'robot-a') return `<div class="g13-robot">${table(l)}</div>`;
  if (v === 'robot-b') return `<div class="g13-robot">${figRow(l, 'line')}${table(l)}</div>`;
  return `<div class="g13-robot">${figRow(l, 'photo')}${table(l)}</div>`;
}

// ---------- ⑤ Roadmap: 단계별 확장과 역할 분담 ----------
const tasks = [L('Welcome', '환영과 맞이'), L('Guidance, small talk', '기본 안내와 대화'), L('Key exhibits', '주요 전시 해설'), L('Escorting', '동선 인솔'), L('In-depth zones', '구역별 심화 해설'), L('Hands-on area', '체험 공간 안내')];
const stages = [
  { n: L('Before', '도입 전'), robot: 0 },
  { n: L('Step 1, this project', 'Step 1 (본 사업)'), robot: 2 },
  { n: L('Step 2, proposed', 'Step 2 (제안)'), robot: 5 },
];
const who = { r: L('Robot', '로봇'), s: L('Staff', '직원') };
const rmNote = L(
  'Step 2 adds software modules on the same robot and sensors; its timing and scope will be set from pilot data. The docent’s role moves from explaining to designing scenarios and content.',
  'Step 2는 같은 로봇과 센서에 소프트웨어 모듈만 추가하며, 시점과 범위는 시범운영 데이터로 협의한다. 도슨트의 역할은 설명자에서 시나리오·콘텐츠 설계자로 바뀐다.',
);

function rmA(l) {
  return `<table class="g13-tbl rm"><thead><tr><th scope="col">${l === 'ko' ? '업무' : 'Task'}</th>${stages.map((s) => `<th scope="col">${s.n[l]}</th>`).join('')}</tr></thead>
<tbody>${tasks
    .map(
      (t, i) =>
        `<tr><th scope="row">${t[l]}</th>${stages.map((s) => (i < s.robot ? `<td class="r">${who.r[l]}</td>` : `<td class="s">${who.s[l]}</td>`)).join('')}</tr>`,
    )
    .join('')}</tbody></table><p class="g13-cap">${esc(rmNote[l])}</p>`;
}

function rmB(l) {
  const X0 = 152, SW = 88, GAP = 8;
  let s = '';
  const t2 = [L('Welcome', '환영과 맞이'), L('Guidance,\nsmall talk', '기본 안내·대화'), L('Key\nexhibits', '주요 전시 해설'), L('Escorting', '동선 인솔'), L('In-depth\nzones', '구역별\n심화 해설'), L('Hands-on\narea', '체험 공간\n안내')];
  t2.forEach((t, i) => {
    const words = t[l].split('\n');
    words.forEach((w, j) => (s += `<text class="ct" x="${X0 + i * (SW + GAP) + SW / 2}" y="${16 + j * 14 + (words.length === 1 ? 7 : 0)}" text-anchor="middle">${esc(w)}</text>`));
  });
  stages.forEach((st, r) => {
    const y = 52 + r * 56;
    s += `<text class="zl" x="0" y="${y + 22}">${esc(st.n[l])}</text>`;
    tasks.forEach((_, i) => {
      const robot = i < st.robot;
      s += `<rect class="seg ${robot ? 'r' : 's'}" x="${X0 + i * (SW + GAP)}" y="${y + 4}" width="${SW}" height="28" rx="4"/>`;
      s += `<text class="${robot ? 'sr' : 'ss'}" x="${X0 + i * (SW + GAP) + SW / 2}" y="${y + 22}" text-anchor="middle">${robot ? who.r[l] : who.s[l]}</text>`;
    });
    if (st.robot) {
      const hx = X0 + st.robot * (SW + GAP) - GAP / 2;
      s += `<path class="hand" d="M${hx},${y} V${y + 36}"/>`;
    }
  });
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${l === 'ko' ? '단계 확장' : 'Roadmap'}"><svg viewBox="0 0 720 220" aria-hidden="true" focusable="false">${s}</svg></div>
<p class="hint">${l === 'ko' ? '그림을 옆으로 밀어 전체를 볼 수 있습니다.' : 'Scroll sideways to see the whole diagram.'}</p></figure><p class="g13-cap">${esc(rmNote[l])}</p>`;
}

const cards = [
  {
    h: L('Step 1 · lobby welcome', 'Step 1 · 로비 웰컴'),
    tag: L('This project, pilot from Dec 2026', '본 사업, 2026년 12월 시범운영'),
    rows: [
      [L('Robot’s role', '로봇 역할'), L('Greeting, calling visitors by name, small talk, photo time', '환영 인사, 이름 호칭, 기본 대화, 포토타임')],
      [L('Built', '개발'), L('Common platform: 4 languages, expressions, safety, control', '공통 플랫폼: 4개국어, 표정, 안전, 관제')],
      [L('Hardware', '하드웨어'), L('One humanoid, one on-site server', '휴머노이드 1대, 현장 서버 1대')],
    ],
  },
  {
    h: L('Step 2 · guided tour', 'Step 2 · 투어 경험'),
    tag: L('Proposed, after the pilot', '제안, 시범운영 후 협의'),
    rows: [
      [L('Robot’s role', '로봇 역할'), L('Exhibit commentary, escorting between zones', '전시 해설, 구역 간 인솔 동행')],
      [L('Adds', '추가 개발'), L('Follow-me, pointing gestures, visitor detection', '추종, 가리키기 제스처, 관람객 감지 응대')],
      [L('Hardware', '하드웨어'), L('No change; server may be added', '변경 없음 (필요 시 서버 증설)')],
    ],
  },
];
function rmC(l) {
  const dots = (n) => tasks.map((_, i) => `<span class="dt ${i < n ? 'r' : 's'}" title="${tasks[i][l]}"></span>`).join('');
  return `<div class="rm-cards">${cards
    .map(
      (c, i) => `<section class="rm-card${i ? ' next' : ''}"><h4>${c.h[l]}</h4><p class="rm-tag">${c.tag[l]}</p><dl>${c.rows
        .map(([k, v]) => `<div><dt>${k[l]}</dt><dd>${v[l]}</dd></div>`)
        .join('')}</dl><p class="rm-dots" aria-label="${l === 'ko' ? `6개 업무 중 로봇 ${stages[i + 1].robot}개` : `Robot covers ${stages[i + 1].robot} of 6 tasks`}">${dots(stages[i + 1].robot)}<span class="rm-n">${stages[i + 1].robot}/6</span></p></section>`,
    )
    .join('<span class="rm-arrow" aria-hidden="true"></span>')}</div><p class="g13-cap">${
    l === 'ko' ? '점: 환영부터 체험 공간 안내까지 6개 업무 중 로봇이 맡는 구간. ' : 'Dots: of six docent tasks, from welcome to the hands-on area, the ones the robot takes. '
  }${esc(rmNote[l])}</p>`;
}

export function roadmapFig(v, l) {
  if (v === 'roadmap-a') return rmA(l);
  if (v === 'roadmap-b') return rmB(l);
  return rmC(l);
}
