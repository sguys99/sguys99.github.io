// g14 ① 공통 코어 + 도메인 프로파일 (Approach 안) 시안 3종 + ⑥ 도메인 비교표 시안 2종.
// 출처: GenP 제품 정의서 v0.3 Ⅰ.2~3(코어 + 프로파일, 도메인 포트폴리오), Ⅱ.2(공통 FR), Ⅲ~Ⅴ(도메인 프로파일·태스크 팩·검증 지표).
// 대외 트랙(행사·고객·기관 이름)은 넣지 않는다 (CLAUDE.md 규칙 3).
import { L, esc, figure, lint } from './lib.mjs';

// ---------- 공통 내용 ----------
const domains = [
  {
    id: 'life',
    name: L('Living support', '생활 지원'),
    focus: L('Manipulation-led', '조작 중심'),
    basic: [L('Deliver items and drinks', '물품·음료 전달'), L('Take out trash', '쓰레기 배출'), L('Move small objects', '작은 물건 이동')],
    option: L('laundry · recycling · tables', '세탁물·분리수거·식탁 정리'),
  },
  {
    id: 'docent',
    name: L('Docent', '홍보관 도슨트'),
    focus: L('Dialogue and guidance', '대화·안내 중심'),
    basic: [L('Guide route and stops', '안내 동선·정위치'), L('Greetings', '안내 인사'), L('Visitor Q&A', '관람객 Q&A')],
    option: L('photo poses · exhibits · follow-me', '포토 모션·전시 안내·추종 안내'),
  },
  {
    id: 'insp',
    name: L('Site inspection', '현장 감시'),
    focus: L('Movement and perception', '이동·인식 중심'),
    basic: [L('Patrol route and return', '순찰 동선·복귀'), L('Photograph, read status', '지점 촬영·상태 판독'), L('Detect anomalies, alert', '이상 탐지·알림')],
    option: L('reports · night patrol · thermal', '리포트·야간 순찰·열화상'),
  },
];
const core = [
  { id: 'voice', label: L('Voice', '음성 대화'), sub: L('call · interrupt', '호출·끼어들기') },
  { id: 'scn', label: L('Scenarios', '시나리오 실행'), sub: L('run · recover', '실행·복구') },
  { id: 'nav', label: L('Navigation', '자율주행'), sub: L('localize · avoid', '위치추정·회피') },
  { id: 'body', label: L('Body control', '전신 제어'), sub: L('walk · balance', '보행·균형') },
  { id: 'panel', label: L('Control panel', '관제시스템'), sub: L('monitor · alarms', '모니터링·알람') },
  { id: 'safe', label: L('Safety frame', '안전 프레임'), sub: L('3-path E-Stop', '비상정지 3경로') },
];
const hwLabel = L('Robot hardware · G1 today, other robots through a hardware abstraction layer', '로봇 하드웨어 · 현재 G1, HAL로 다른 기체 확장');

// ---------- A1. 교체 경계선: 위는 도메인별 태스크 팩, 아래는 공통 코어 ----------
const A1W = 720;
export const a1 = {
  width: A1W,
  height: 492,
  zones: [
    ...domains.map((d, i) => ({
      id: `z-${d.id}`,
      label: d.name,
      note: d.id === 'docent' ? L('case 02', '사례 02') : undefined,
      x: i * 248,
      y: 0,
      w: 224,
      h: 212,
    })),
    { id: 'core', label: L('Common core · domain-neutral', '공통 코어 · 도메인 중립'), x: 0, y: 264, w: 720, h: 120 },
  ],
  nodes: [
    ...domains.flatMap((d, i) => [
      ...d.basic.map((b, k) => ({ id: `${d.id}-${k}`, kind: 'input', label: b, x: i * 248 + 12, y: 36 + k * 40, w: 200, h: 32 })),
      { id: `${d.id}-opt`, kind: 'ghost', label: L('Option pack', '옵션 팩'), sub: d.option, x: i * 248 + 12, y: 156, w: 200, h: 44 },
    ]),
    ...core.map((c, k) => ({ ...c, kind: 'plain', x: 16 + k * 116, y: 296, w: 108, h: 72 })),
    { id: 'hw', kind: 'logic', label: hwLabel, x: 0, y: 400, w: 720, h: 40 },
  ],
  edges: domains.map((d, i) => ({ pts: [[i * 248 + 112, 212], [i * 248 + 112, 264]] })),
  raw: {
    under: (l) => {
      const t = L('CUSTOMIZED ABOVE · SHARED BELOW', '위는 도메인별 교체 · 아래는 공통')[l];
      const w = [...t].reduce((n, c) => n + (/[ㄱ-힝]/.test(c) ? 8 : 4.8), 0) + 16;
      return `<path class="ln acc dash" d="M0,236 H${A1W}"/><rect class="em" x="${236 - w / 2}" y="218" width="${w}" height="12" rx="2"/><text class="t lab acc" x="236" y="227" text-anchor="middle">${esc(t)}</text>`;
    },
  },
};
const a1Legend = [
  { kind: 'input', label: L('Task pack, per domain', '도메인별 태스크 팩') },
  { kind: 'ghost', label: L('Option pack', '옵션 팩') },
  { kind: 'plain', label: L('Shared module', '공통 모듈') },
  { kind: 'acc-line', label: L('Customization line', '맞춤 경계') },
];

// ---------- A2. 기능 행렬: 공통 요구는 세 도메인 모두, 도메인 요구는 한 곳만 ----------
const coreRows = [
  L('Voice call, interrupt, stop word', '음성 호출·끼어들기·정지 발화'),
  L('Scenario run and recovery', '시나리오 실행·복구'),
  L('Indoor navigation, obstacle avoidance', '실내 자율주행·장애물 회피'),
  L('Walking, posture, balance', '보행·자세·균형 보상'),
  L('Semantic map, goal coordinates', '시맨틱 맵·목표좌표 변환'),
  L('Monitoring, alarms, schedules', '모니터링·알람·예약 실행'),
  L('Three-path emergency stop', '비상정지 3경로'),
];
const profRows = [
  [L('Hand items to a person', '대인 전달 (handover)'), 0],
  [L('Timed delivery, missed-task alert', '정시 전달 예약·미수행 알림'), 0],
  [L('Commentary from a knowledge base', '지식베이스 기반 전시 해설'), 1],
  [L('Keep one speaker among many', '다중 화자 중 대상 유지'), 1],
  [L('Navigate dense crowds', '밀집 관람객 환경 주행'), 1],
  [L('Scheduled patrol and return', '스케줄 순찰·복귀'), 2],
  [L('Read gauges, lamps, exteriors', '게이지·표시등·외관 판독'), 2],
  [L('Patrol reports', '순찰 리포트 자동 생성'), 2],
];
function a2Svg(l) {
  const W = 720, RH = 28, CX = [432, 552, 672];
  const y0 = 40;
  const g1 = y0 + 4, g1h = 28 + coreRows.length * RH + 8;
  const g2 = g1 + g1h + 12, g2h = 28 + profRows.length * RH + 8;
  const H = g2 + g2h + 56;
  let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">`;
  domains.forEach((d, i) => (s += `<text class="t b" x="${CX[i]}" y="20" text-anchor="middle">${esc(d.name[l])}</text><text class="t s" x="${CX[i]}" y="34" text-anchor="middle">${esc(d.focus[l])}</text>`));
  s += `<rect class="band" x="0" y="${g1}" width="${W}" height="${g1h}" rx="8"/><text class="zl" x="12" y="${g1 + 20}">${esc(L('Common core', '공통 코어')[l])}</text>`;
  s += `<rect class="band acc" x="0" y="${g2}" width="${W}" height="${g2h}" rx="8"/><text class="zl acc" x="12" y="${g2 + 20}">${esc(L('Domain profiles · the only part that changes', '도메인 프로파일 · 바뀌는 부분')[l])}</text>`;
  coreRows.forEach((r, k) => {
    const y = g1 + 28 + k * RH + 18;
    s += `<text class="t" x="24" y="${y}">${esc(r[l])}</text>`;
    CX.forEach((x) => (s += `<circle class="dot" cx="${x}" cy="${y - 4}" r="5"/>`));
  });
  profRows.forEach(([r, c], k) => {
    const y = g2 + 28 + k * RH + 18;
    s += `<text class="t" x="24" y="${y}">${esc(r[l])}</text>`;
    CX.forEach((x, i) => (s += i === c ? `<circle class="dot acc" cx="${x}" cy="${y - 4}" r="5"/>` : `<path class="tick" d="M${x - 4},${y - 4} H${x + 4}"/>`));
  });
  const LG = H - 12;
  s += `<line class="rule" x1="0" y1="${LG - 20}" x2="${W}" y2="${LG - 20}"/>`;
  s += `<circle class="dot" cx="8" cy="${LG - 4}" r="5"/><text class="lg" x="24" y="${LG}">${esc(L('Required in every domain', '모든 도메인 필수')[l])}</text>`;
  s += `<circle class="dot acc" cx="248" cy="${LG - 4}" r="5"/><text class="lg" x="264" y="${LG}">${esc(L('Domain-specific requirement', '도메인 특화 요구')[l])}</text>`;
  s += `<path class="tick" d="M484,${LG - 4} H492"/><text class="lg" x="504" y="${LG}">${esc(L('Not needed', '해당 없음')[l])}</text>`;
  return s + `<style>.g14 .tick{stroke:var(--line-strong);stroke-width:1.6}</style></svg>`;
}

// ---------- A3. 슬롯: 코어 하나에 프로파일을 끼우고, 다음 도메인은 프로파일만 추가 ----------
export const a3 = {
  width: 720,
  height: 352,
  zones: [{ id: 'core', label: L('Common core', '공통 코어'), note: L('built once', '한 번 개발'), x: 0, y: 0, w: 336, h: 232 }],
  nodes: [
    ...core.map((c, k) => ({ ...c, kind: 'plain', x: 16 + (k % 2) * 156, y: 36 + Math.floor(k / 2) * 64, w: 148, h: 52 })),
    { id: 'hw', kind: 'logic', label: L('Robot hardware', '로봇 하드웨어'), sub: L('G1 · next robots via HAL', 'G1 · HAL로 차기 기체'), x: 0, y: 248, w: 336, h: 48 },
    ...domains.map((d, i) => ({
      id: d.id,
      kind: 'input',
      label: L(`${d.name.en} · ${d.focus.en.toLowerCase()}`, `${d.name.ko} · ${d.focus.ko}`),
      sub: L(
        { life: 'deliver · take out trash · move objects', docent: 'guide route · greet · visitor Q&A', insp: 'patrol · read status · alert' }[d.id],
        d.basic.map((b) => b.ko).join(' · '),
      ),
      x: 400,
      y: 8 + i * 56,
      w: 320,
      h: 48,
    })),
    { id: 'next', kind: 'ghost', label: L('Next domain', '다음 도메인'), sub: L('add a profile, no core rework', '코어 재개발 없이 프로파일만 추가'), x: 400, y: 176, w: 320, h: 48 },
  ],
  edges: [
    ...domains.map((d, i) => ({ from: d.id, to: 'core', pts: [[400, 32 + i * 56], [336, 32 + i * 56]] })),
    { from: 'next', to: 'core', style: 'acc', pts: [[400, 200], [336, 200]] },
  ],
};

// ---------- H. 도메인 비교표 ----------
const hRows = [
  [L('Task focus', '태스크 성격'), [L('Manipulation: deliver, tidy, carry', '조작 중심: 전달·정리·운반'), L('Dialogue and guidance', '대화와 안내 중심'), L('Movement and perception: inspect, detect anomalies', '이동과 인식 중심: 점검·이상탐지')]],
  [L('Basic pack', '기본 팩'), domains.map((d) => L(d.basic.map((b, i) => (i ? b.en[0].toLowerCase() + b.en.slice(1) : b.en)).join(', ').replace('q&A', 'Q&A'), d.basic.map((b) => b.ko).join(', ')))],
  [L('Option pack', '옵션 팩'), [L('Laundry, recycling, clearing tables', '세탁물 정리, 분리수거, 식탁 치우기'), L('Photo poses, exhibit guide, follow-me guide', '포토 모션, 전시 안내, 대상 추종 안내'), L('Patrol reports, night patrol, special sensors', '순찰 리포트, 야간 순찰, 특수 센서 계측')]],
  [L('Key technology', '핵심 기술'), [L('Manipulation, close-range safety around people', 'Manipulation, 대인 근접 안전'), L('Commentary content, crowd navigation, speaker separation', '해설 콘텐츠, 밀집 주행, 화자 분리'), L('Vision reading, scheduled patrol, remote monitoring', 'Vision 판독, 스케줄 순찰, 원격 모니터링')]],
  [L('Measured by', '검증 지표'), [L('Residents per staff member, anomaly-to-response time, tasks handled per day', '운영 인력 1인당 담당 세대, 이상 감지→대응 시간, 위임 태스크 처리 건수'), L('Guided sessions per day, visitor satisfaction, staff replacement rate', '안내 세션 수, 관람객 만족도, 상주 인력 대체율'), L('Patrol coverage, anomaly-to-alert time, inspection hours saved', '순찰 커버리지, 이상 감지→통보 시간, 점검 공수 절감')]],
  [L('Status, Sep 2026', '상태 (2026.09)'), [L('Basic pack trained and demonstrated', '기본 팩 학습·시연 완료'), L('Task draft ready', '태스크 초안 준비'), L('Tasks to be defined with customers', '고객 협의로 태스크 정의 예정')]],
];
function h1Table(l) {
  return `<table class="g14-tbl dom"><colgroup><col style="width:19%"><col style="width:27%"><col style="width:27%"><col style="width:27%"></colgroup>
<thead><tr><th scope="col"><span class="sr-only">${l === 'ko' ? '항목' : 'Criterion'}</span></th>${domains.map((d) => `<th scope="col">${esc(d.name[l])}</th>`).join('')}</tr></thead>
<tbody>${hRows.map(([h, vs]) => `<tr><th scope="row">${esc(h[l])}</th>${vs.map((v, i) => `<td data-l="${esc(domains[i].name[l])}">${esc(v[l])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
const status = [L('Demonstrated', '시연 완료'), L('Draft', '초안'), L('To define', '정의 예정')];
function h2Table(l) {
  const col = (k) => hRows[k][1];
  return `<table class="g14-tbl dom2"><colgroup><col style="width:22%"><col style="width:26%"><col style="width:26%"><col style="width:26%"></colgroup>
<thead><tr><th scope="col">${l === 'ko' ? '도메인' : 'Domain'}</th><th scope="col">${esc(hRows[1][0][l])}</th><th scope="col">${esc(hRows[3][0][l])}</th><th scope="col">${esc(hRows[4][0][l])}</th></tr></thead>
<tbody>${domains
    .map(
      (d, i) =>
        `<tr><th scope="row"><div class="dh"><span class="dn">${esc(d.name[l])}</span><span class="df">${esc(col(0)[i][l].split(':')[0])}</span><span class="st st${i}">${esc(status[i][l])}</span></div></th><td data-l="${esc(hRows[1][0][l])}">${esc(col(1)[i][l])}<span class="op">+ ${esc(col(2)[i][l])}</span></td><td data-l="${esc(hRows[3][0][l])}">${esc(col(3)[i][l])}</td><td data-l="${esc(hRows[4][0][l])}">${esc(col(4)[i][l])}</td></tr>`,
    )
    .join('')}</tbody></table><p class="g14-cap">${esc(L('Status as of September 2026. "+" marks the option pack.', '상태는 2026년 9월 기준. "+"는 옵션 팩.')[l])}</p>`;
}

const capA = L(
  'Customization only swaps task packs, content, and sensor options above the line; a new domain adds a profile without reworking the core.',
  '고객 맞춤은 선 위의 태스크 팩·콘텐츠·센서 옵션 교체로만 대응하고, 새 도메인은 코어 재개발 없이 프로파일만 추가한다.',
);

const capA2 = L(
  'Customization only swaps task packs, content, and sensor options; a new domain adds a profile without reworking the core.',
  '고객 맞춤은 태스크 팩·콘텐츠·센서 옵션 교체로만 대응하고, 새 도메인은 코어 재개발 없이 프로파일만 추가한다.',
);
export function coreFig(v, l, t) {
  if (v === 'core-a') return figure(a1, a1Legend, l, t, `<p class="g14-cap">${esc(capA[l])}</p>`);
  if (v === 'core-b')
    return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${esc(t)}">${a2Svg(l)}</div><p class="g14-cap">${esc(capA2[l])}</p></figure>`;
  if (v === 'core-c')
    return figure(a3, [
      { kind: 'plain', label: L('Shared module', '공통 모듈') },
      { kind: 'input', label: L('Domain profile', '도메인 프로파일') },
      { kind: 'acc-line', label: L('Expansion without core rework', '코어 재개발 없는 확장') },
    ], l, t, `<p class="g14-cap">${esc(capA2[l])}</p>`);
  if (v === 'table-a') return h1Table(l);
  if (v === 'table-b') return h2Table(l);
}
export const coreCss = `
.g14-tbl.dom thead th { text-transform: none; letter-spacing: 0; font-size: var(--fs-sm); color: var(--text); font-weight: var(--fw-medium); }
.g14-tbl.dom td:first-child { color: var(--text-2); font-weight: var(--fw-regular); }
.g14-tbl.dom tbody th { color: var(--text); font-weight: var(--fw-medium); font-size: var(--fs-sm); }
.g14-tbl.dom2 .dh { display: grid; gap: var(--sp-1); }
.g14-tbl.dom2 .dn { color: var(--text); font-weight: var(--fw-medium); }
.g14-tbl.dom2 .df { color: var(--text-3); font-size: var(--fs-xs); font-weight: var(--fw-regular); }
.g14-tbl.dom2 .st { justify-self: start; margin-top: var(--sp-1); padding: 0 var(--sp-1h); border: 1px solid var(--line-strong); border-radius: var(--radius-xs); font-size: var(--fs-2xs); color: var(--text-2); font-weight: var(--fw-regular); line-height: 1.6; }
.g14-tbl.dom2 .st0 { border-color: var(--accent); color: var(--accent); }
.g14-tbl.dom2 .st2 { border-style: dashed; color: var(--text-3); }
.g14-tbl.dom2 .op { display: block; margin-top: var(--sp-1); color: var(--text-3); font-size: var(--fs-xs); }
.g14-tbl.dom2 td:first-child { color: var(--text-2); font-weight: var(--fw-regular); }
`;
export const coreLint = () => lint('core-a', a1) + lint('core-c', a3);
