// g16 시안 갤러리: 롯데정밀화학 AI 과제 추진 로드맵 케이스 스터디 다이어그램 3종 × 시안 3개 (2026-11-21).
// 사용: node docs/design-drafts/g16/make.mjs → docs/design-drafts/g16/index.html
// 보기: 저장소 루트에서 python3 -m http.server 4416 → http://localhost:4416/docs/design-drafts/g16/
// 자료: docs/project-references/ai-roadmap/ — AI 과제 추진 Roadmap(2024-05) 5·6·7·10장, 수행사례(2025-01) 5·6장.
// 과제명은 일반 명칭(공장·제품·부서명, 재무 효과 제외). 막대 위치는 로드맵 장표(10장) 도형 좌표를 분기로 환산.
// 색·서체는 src/styles/tokens.css, 모양 규칙은 DESIGN.md 5.24.4(회로도)와 같다.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../../../', import.meta.url).pathname;
const tokens = readFileSync(root + 'src/styles/tokens.css', 'utf8');
const fonts = readFileSync(root + 'src/styles/fonts.css', 'utf8').replaceAll("url('/fonts/", "url('/public/fonts/");

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (en, ko) => ({ en, ko });
const isKo = (c) => /[ㄱ-힝]/.test(c);
/** 글자 폭 추정 (px). size: 글자 크기 */
const est = (s, size = 12) => [...s].reduce((n, c) => n + (isKo(c) ? size : c === ' ' ? size * 0.3 : size * 0.56), 0);
const warn = [];

// ---------- SVG 조각 ----------
const R = 8;
const sgn = (v) => Math.sign(v);
/** 직각 경로, 꺾이는 곳마다 반지름 8 (diagram-design 규칙 1) */
function poly(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const ix = sgn(x - px), iy = sgn(y - py), ox = sgn(nx - x), oy = sgn(ny - y);
    d += ` L${x - ix * R},${y - iy * R} Q${x},${y} ${x + ox * R},${y + oy * R}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${lx},${ly}`;
}
function txt(x, y, s, cls, { anchor = 'start', lh = 14 } = {}) {
  const a = anchor === 'start' ? '' : ` text-anchor="${anchor}"`;
  return String(s)
    .split('\n')
    .map((line, i) => `<text class="${cls}" x="${x}" y="${y + i * lh}"${a}>${esc(line)}</text>`)
    .join('');
}
const rect = (x, y, w, h, cls, rx = 4) =>
  `<rect class="${cls}" x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" width="${+Math.max(w, 0).toFixed(1)}" height="${+h.toFixed(1)}" rx="${rx}"/>`;
const open = (W, H, id) =>
  `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><marker id="mk-${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto-start-reverse"><polygon class="mk" points="0 0, 8 3, 0 6"/></marker></defs>`;
const arrow = (d, id, cls = 'ln') => `<path class="${cls}" d="${d}" marker-end="url(#mk-${id})"/>`;
/** 연결선 라벨: 가림 바탕 + 8px 글자 (선과 6px 이상 띄워 y를 준다) */
function elabel(x, y, s, bg = '') {
  const w = est(s, 8) * 1.1 + 8;
  return `<rect class="em${bg ? ' ' + bg : ''}" x="${x - w / 2}" y="${y - 8}" width="${w}" height="11" rx="2"/><text class="el" x="${x}" y="${y}" text-anchor="middle">${esc(s)}</text>`;
}
/** 범례: 아래 가는 선 + 견본, 글자 폭에 맞춰 배치 */
function legend(items, W, H, l) {
  const y = H - 12;
  let s = `<line class="rule" x1="0" y1="${y - 20}" x2="${W}" y2="${y - 20}"/>`;
  let x = 0;
  for (const it of items) {
    s += rect(x, y - 10, 16, 12, it.cls, 3) + `<text class="lg" x="${x + 24}" y="${y}">${esc(it.label[l])}</text>`;
    x += 24 + est(it.label[l]) + 28;
  }
  if (x - 28 > W) warn.push(`legend overflow ${l} ${x}`);
  return s;
}

// ---------- 공통 문구 ----------
const TY = {
  own: { cls: 'k-own', label: t('PoC run by our team', '수행팀 PoC') },
  poc: { cls: 'k-poc', label: t('PoC', 'PoC 수행') },
  sol: { cls: 'k-sol', label: t('Proven solution', '솔루션 도입') },
  dev: { cls: 'k-dev', label: t('Development prep', '개발 준비') },
  add: { cls: 'k-add', label: t('Enabler we added', '수행팀 제안 과제') },
  idea: { cls: 'u-idea', label: t('Task idea', '발굴 과제') },
};

// ---------- 로드맵 데이터 (2024-05 최종본 10장, 26건) ----------
// q0·q1: 2024년 1분기 시작 = 0, 분기 단위. 장표 막대의 x 좌표·폭을 환산(반 분기 단위로 반올림).
const LANES = [
  { id: 'prod', label: t('Employee\nproductivity', '직원\n생산성 강화') },
  { id: 'comp', label: t('Business\ncompetitiveness', '사업\n경쟁력 강화') },
  { id: 'data', label: t('Data-driven\ndecisions', '데이터 기반\n의사결정') },
  { id: 'infra', label: t('Infrastructure\nand governance', '인프라·\n거버넌스') },
];
const T = (id, lane, type, q0, q1, en, ko, flag = '') => ({ id, lane, type, q0, q1, name: t(en, ko), own: flag === 'own', enabler: flag === 'enabler' });
const TASKS = [
  T('mix', 'prod', 'poc', 0, 2, 'Green-material\nmixing', '그린소재\n믹싱 최적화', 'own'),
  T('cctv', 'prod', 'sol', 2, 4, 'Smart CCTV', '지능형 CCTV'),
  T('draw', 'prod', 'sol', 4, 6, 'Drawing\nrecognition', '도면 인식'),
  T('digest', 'prod', 'dev', 6, 8, 'Market news\ndigest', '시장 동향\n요약 메일링'),
  T('watch', 'prod', 'dev', 8, 10, 'Competitor\nmonitoring', '고객·기술\n동향 모니터링'),
  T('fcam', 'prod', 'sol', 0, 4, 'Forklift person detection', '지게차 인체 감지 카메라'),
  T('patent', 'prod', 'sol', 4, 6, 'Patentability\ncheck', '특허성 검증'),
  T('paper', 'prod', 'sol', 6, 8, 'Research\ntrend search', '학술 동향\n검색'),
  T('pdm', 'comp', 'poc', 0, 2, 'Predictive\nmaintenance', '설비 예지보전'),
  T('column', 'comp', 'poc', 2, 4, 'Column\nautomation', '칼럼 운전\n자동화'),
  T('dose', 'comp', 'poc', 4, 6, 'Dosing\nautomation', '케미컬 조제\n자동화'),
  T('water', 'comp', 'poc', 6, 8, 'Water yield\noptimization', '초순수 채수\n최적화'),
  T('motor', 'comp', 'poc', 8, 10, 'Motor\ndiagnostics', '모터 진단'),
  T('agv', 'comp', 'sol', 2, 3.5, 'Driverless\nforklift', '자율주행\n지게차'),
  T('grade', 'comp', 'poc', 3.5, 5.5, 'Visual quality\ngrading', '정성 품질\n판정'),
  T('visc', 'comp', 'poc', 5.5, 7.5, 'Viscosity\nprediction', '반제품\n점도 예측'),
  T('react', 'comp', 'poc', 7.5, 9.5, 'Reaction-time\nsetting', '반응 시간\n자동 설정'),
  T('pulp', 'data', 'poc', 1, 3, 'Cotton-pulp\nprice forecast', '면 펄프\n단가 예측', 'own'),
  T('raw', 'data', 'poc', 3, 5, 'Raw-material\nprice forecast', '주원료\n단가 예측'),
  T('wood', 'data', 'poc', 5, 7, 'Wood-pulp\nsupply chain', '목재 펄프\n공급망 관리'),
  T('demand', 'data', 'dev', 7, 9, 'Demand\nforecast', '고객사\n수요 예측'),
  T('survey', 'data', 'sol', 2, 3.5, 'Survey\ninsights', '고객 조사\n분석'),
  T('cost', 'data', 'sol', 3.5, 5.5, 'Construction\ncost estimate', '공사비 예측'),
  T('profit', 'data', 'dev', 5.5, 9.5, 'Profit by utilization rate', '가동률별 손익 시뮬레이션'),
  T('gov', 'infra', 'sol', 2, 4, 'Data\ngovernance', '데이터\n거버넌스', 'enabler'),
  T('lake', 'infra', 'sol', 4, 8, 'Data lake and platform', '데이터 레이크·분석 플랫폼', 'enabler'),
];
if (TASKS.length !== 26) throw new Error('task count');
const tyOf = (k) => (k.own ? 'own' : k.type);

/** 같은 레인 안에서 겹치지 않게 행 배정 (시작 순, 빈 행 우선) */
function pack(list) {
  const ends = [];
  const rows = new Map();
  for (const k of [...list].sort((a, b) => a.q0 - b.q0)) {
    let r = ends.findIndex((e) => e <= k.q0 + 1e-9);
    if (r < 0) r = ends.push(0) - 1;
    ends[r] = k.q1;
    rows.set(k.id, r);
  }
  return { n: ends.length, rows };
}

// =====================================================================
// ③ Roadmap — 공통 Gantt 그리기 (레인 정의만 다름)
// =====================================================================
const GW = 728, GX = 128, GQ = 50; // 레인 머리 0–128, 분기 50px × 12 = 2024–2026
function ganttFrame(l, H) {
  let s = '';
  ['2024', '2025', '2026'].forEach((y, i) => (s += txt(GX + i * 200 + 100, 16, y, 'ty', { anchor: 'middle' })));
  for (let i = 0; i < 6; i++) s += txt(GX + i * 100 + 50, 34, i % 2 ? t('H2', '하반기')[l] : t('H1', '상반기')[l], 'ts', { anchor: 'middle' });
  return s;
}
function ganttGrid(top, bottom) {
  let s = '';
  for (let i = 0; i <= 6; i++) s += `<line class="${i % 2 ? 'gl' : 'gl yr'}" x1="${GX + i * 100}" y1="${top}" x2="${GX + i * 100}" y2="${bottom}"/>`;
  return s;
}
function bar(k, x, y, w, h, l) {
  const lines = k.name[l].split('\n');
  const max = Math.max(...lines.map((s) => est(s, 11)));
  if (max > w - 10) warn.push(`bar ${k.id} ${l}: ${Math.round(max)} > ${w - 10}`);
  const y0 = y + h / 2 + 4 - ((lines.length - 1) * 12) / 2;
  return rect(x, y, w, h, TY[tyOf(k)].cls) + txt(x + 6, y0, k.name[l], 'tb', { lh: 12 });
}
/** lanes: [{label, sub, tasks, note?}] */
function gantt(lanes, l, id, legendItems, notes = []) {
  const ROW = 40, PAD = 8, GAP = 8, TOP = 48;
  let y = TOP;
  const placed = lanes.map((ln) => {
    const p = pack(ln.tasks);
    const h = Math.max(p.n * ROW + PAD, 76);
    const o = { ...ln, y, h, p };
    y += h + GAP;
    return o;
  });
  const bottom = y - GAP;
  const H = bottom + 56;
  let s = open(GW, H, id) + ganttFrame(l, H);
  for (const ln of placed) s += rect(0, ln.y, GW, ln.h, 'zone', 8);
  s += ganttGrid(TOP - 4, bottom);
  for (const ln of placed) {
    const nl = ln.label[l].split('\n').length;
    s += txt(12, ln.y + 22, ln.label[l], 'tl');
    s += txt(12, ln.y + 22 + nl * 14 + 2, ln.sub[l], 'ts');
    for (const k of ln.tasks) {
      const r = ln.p.rows.get(k.id);
      s += bar(k, GX + k.q0 * GQ + 2, ln.y + PAD + r * ROW, (k.q1 - k.q0) * GQ - 4, 32, l);
    }
  }
  for (const n of notes) {
    const ln = placed.find((p) => p.id === n.lane);
    const nx = GX + n.q * GQ + (n.anchor === 'end' ? -8 : 8);
    const lines = n.text[l].split('\n');
    const nw = Math.max(...lines.map((x) => est(x, 9) * 1.1)) + 8;
    s += rect(n.anchor === 'end' ? nx - nw + 4 : nx - 4, ln.y + n.dy - 11, nw, lines.length * 12 + 6, 'zone', 2);
    s += txt(nx, ln.y + n.dy, n.text[l], 'tx', { anchor: n.anchor || 'start', lh: 12 });
  }
  return s + legend(legendItems, GW, H, l) + '</svg>';
}
const count = (n, l) => (l === 'en' ? `${n} task${n === 1 ? '' : 's'}` : `${n}건`);

function roadmapA(l, id) {
  const lanes = LANES.map((ln) => {
    const tasks = TASKS.filter((k) => k.lane === ln.id);
    const sub = ln.id === 'infra' ? t(`${tasks.length} · we proposed`, `${tasks.length}건 · 수행팀 제안`) : t(count(tasks.length, 'en'), count(tasks.length, 'ko'));
    return { ...ln, sub, tasks };
  });
  return gantt(lanes, l, id, [TY.own, TY.poc, TY.sol, TY.dev]);
}

function roadmapC(l, id) {
  const by = (f) => TASKS.filter(f);
  const lanes = [
    { id: 'sol', label: t('Proven\nsolution', '솔루션\n도입'), tasks: by((k) => k.type === 'sol' && !k.enabler) },
    { id: 'poc', label: t('PoC', 'PoC 수행'), tasks: by((k) => k.type === 'poc') },
    { id: 'en', label: t('Data and\ngovernance', '데이터·\n거버넌스'), tasks: by((k) => k.enabler) },
    { id: 'dev', label: t('Development\nprep', '개발\n준비'), tasks: by((k) => k.type === 'dev') },
  ].map((ln) => ({ ...ln, sub: t(count(ln.tasks.length, 'en'), count(ln.tasks.length, 'ko')) }));
  const notes = [
    { lane: 'sol', q: 8, dy: 22, text: t('Proven solutions go\nfirst for early wins', '검증된 솔루션을\n앞에 배치해 빠른 성과') },
    { lane: 'en', q: 8, dy: 18, text: t('Data platform comes\nbefore development', '데이터 플랫폼을\n개발 과제보다 먼저') },
    { lane: 'dev', q: 5.5, dy: 22, anchor: 'end', text: t('Starts once data and\ninfrastructure are ready', '인프라·거버넌스를\n갖춘 뒤 착수') },
  ];
  return gantt(lanes, l, id, [TY.own, TY.poc, TY.sol, TY.dev], notes);
}

function roadmapB(l, id) {
  const TOP = 48, LH = 56, GAP = 8, SQ = 16, P = 22;
  const half = (k) => Math.floor(k.q0 / 2);
  const order = { own: 0, poc: 1, sol: 2, dev: 3 };
  const H = TOP + LANES.length * (LH + GAP) - GAP + 36 + 56;
  let s = open(GW, H, id) + ganttFrame(l, H);
  const lanesY = LANES.map((_, i) => TOP + i * (LH + GAP));
  lanesY.forEach((y) => (s += rect(0, y, GW, LH, 'zone', 8)));
  const bottom = lanesY.at(-1) + LH;
  s += ganttGrid(TOP - 4, bottom + 32);
  const perHalf = Array(6).fill(0);
  LANES.forEach((ln, i) => {
    const y = lanesY[i];
    const tasks = TASKS.filter((k) => k.lane === ln.id);
    s += txt(12, y + 22, ln.label[l], 'tl');
    for (let h = 0; h < 6; h++) {
      const cell = tasks.filter((k) => half(k) === h).sort((a, b) => order[tyOf(a)] - order[tyOf(b)]);
      perHalf[h] += cell.length;
      cell.forEach((k, j) => {
        const x = GX + h * 100 + 10 + j * P;
        s += rect(x, y + 12, SQ, SQ, TY[tyOf(k)].cls, 3);
        if (k.own) s += txt(GX + h * 100 + 10, y + 46, k.name[l].replace('\n', ' '), 'ts acc');
      });
    }
  });
  // 반기별 착수 건수
  s += txt(12, bottom + 24, t('Starts', '착수')[l], 'tl');
  perHalf.forEach((n, h) => (s += txt(GX + h * 100 + 50, bottom + 24, n ? String(n) : '–', 'tn', { anchor: 'middle' })));
  return s + legend([TY.own, TY.poc, TY.sol, TY.dev], GW, H, l) + '</svg>';
}

// =====================================================================
// ① Funnel
// =====================================================================
function funnelA(l, id) {
  const W = 720, X = 224, S = 472 / 163, RH = 64, BY = 12, BH = 28;
  const rows = [
    { n: 163, name: t('Ideas collected', '자체 발굴 과제'), date: t('Mar 7 – Apr 12', '3.7 – 4.12'), segs: [[56, 'bar-n', t('Round 1 · 56', '1차 · 56')], [107, 'bar-n2', t('Round 2 · 107', '2차 · 107')]] },
    { n: 24, name: t('Shortlisted', '우선순위 선별'), date: t('Mar 27 – Apr 17', '3.27 – 4.17'), segs: [[24, 'bar-n']], note: t('Top 15% on strategic importance and feasibility', '전략적 중요성·수행 용이성 평가 상위 15%') },
    { n: 24, name: t('Classified', '추진 방식 분류'), date: t('Apr 19', '4.19'), segs: [[12, 'k-poc', '12'], [8, 'k-sol', '8'], [4, 'k-dev', '4']], note: t('Impact × maturity: PoC 12, solution 8, prep 4', '영향도 × 성숙도: PoC 12, 솔루션 8, 개발 준비 4') },
    { n: 26, name: t('On the roadmap', '로드맵 반영'), date: t('Apr 30', '4.30'), segs: [[12, 'k-poc'], [8, 'k-sol'], [4, 'k-dev'], [2, 'k-add', '2']], note: t('Plus data governance and a data lake', '데이터 거버넌스·데이터 레이크 2건 추가') },
    { n: 3, name: t('PoCs delivered', 'PoC 수행'), date: t('2024–25', '2024–25'), segs: [[3, 'k-own']], note: t('Mixing optimization, cotton-pulp price, LLM platform', '믹싱 최적화, 면 펄프 단가 예측, LLM 플랫폼') },
  ];
  const H = rows.length * RH + 48;
  let s = open(W, H, id);
  // 실루엣: 위 막대 아래변 → 아래 막대 윗변
  rows.forEach((r, i) => {
    if (i === rows.length - 1) return;
    const y1 = i * RH + BY + BH, y2 = (i + 1) * RH + BY;
    const w1 = r.n * S, w2 = rows[i + 1].n * S;
    s += `<polygon class="sil" points="${X},${y1} ${X + w1},${y1} ${X + w2},${y2} ${X},${y2}"/>`;
  });
  rows.forEach((r, i) => {
    const y = i * RH;
    s += txt(52, y + 36, String(r.n), `tc${i === rows.length - 1 ? ' acc' : ''}`, { anchor: 'end' });
    s += txt(64, y + 24, r.name[l], 'tn') + txt(64, y + 38, r.date[l], 'ts');
    let x = X;
    for (const [n, cls, lab] of r.segs) {
      const w = n * S - (r.segs.length > 1 ? 2 : 0);
      s += rect(x, y + BY, w, BH, cls, 3);
      if (lab && w > 20) {
        const str = typeof lab === 'string' ? lab : lab[l];
        s += txt(lab.en ? x + 8 : x + w / 2, y + BY + 18, str, 'ts dark', { anchor: lab.en ? 'start' : 'middle' });
      }
      x += n * S;
    }
    if (r.note) s += txt(x + 12, y + BY + 18, r.note[l], 'td');
  });
  return s + legend([TY.poc, TY.sol, TY.dev, TY.add, TY.own], W, H, l) + '</svg>';
}

/** 0–162 중 24개를 고정 시드로 고른다 (선별 위치는 임의, 점수와 무관) */
const PICK = (() => {
  let seed = 7;
  const set = new Set();
  while (set.size < 24) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    set.add(seed % 163);
  }
  return set;
})();
function funnelB(l, id) {
  const W = 720, PW = 112, PG = 40, GY = 76;
  const px = (i) => i * (PW + PG);
  const H = GY + 96 + 64;
  let s = open(W, H, id);
  const head = (i, n, name, sub, acc) => txt(px(i), 28, String(n), `tc${acc ? ' acc' : ''}`) + txt(px(i), 48, name[l], 'tn') + txt(px(i), 62, sub[l], 'ts');
  // 1–2: 163칸 격자 (14 × 12, 6px 네모)
  const grid = (i, cls) => {
    let g = '';
    for (let k = 0; k < 163; k++) g += rect(px(i) + (k % 14) * 8, GY + Math.floor(k / 14) * 8, 6, 6, cls(k), 1);
    return g;
  };
  s += head(0, 163, t('Ideas collected', '자체 발굴 과제'), t('56 + 107 in 2 rounds', '1차 56 + 2차 107'));
  s += grid(0, (k) => (k < 56 ? 'u-idea' : 'u-idea2'));
  s += head(1, 24, t('Shortlisted', '우선순위 선별'), t('top 15% by score', '평가 상위 15%'));
  s += grid(1, (k) => (PICK.has(k) ? 'u-sel' : 'u-off'));
  // 3–4: 고른 과제만 큰 네모(12px, 6열)로
  const types = [...Array(12).fill('k-poc'), ...Array(8).fill('k-sol'), ...Array(4).fill('k-dev')];
  const big = (i, list) => list.map((cls, k) => rect(px(i) + (k % 6) * 16, GY + Math.floor(k / 6) * 16, 12, 12, cls, 2)).join('');
  s += head(2, 24, t('Classified', '추진 방식 분류'), t('impact × maturity', '영향도 × 성숙도'));
  s += big(2, types);
  s += head(3, 26, t('On the roadmap', '로드맵 반영'), t('+2 we proposed', '+2 수행팀 제안'));
  s += big(3, [...types, 'k-add', 'k-add']);
  s += head(4, 3, t('PoCs delivered', 'PoC 수행'), t('by our team', '수행팀'), true);
  [t('Green mixing', '그린소재 믹싱'), t('Pulp price', '면 펄프 단가'), t('LLM platform', 'LLM 플랫폼')].forEach((n, k) => {
    s += rect(px(4), GY + k * 24, 12, 12, 'k-own', 2) + txt(px(4) + 20, GY + k * 24 + 10, n[l], 'ts dark');
  });
  // 단계 사이 화살표 + 라벨
  const labs = [t('score', '평가'), t('matrix', '분류'), t('plan', '일정'), t('run', '수행')];
  for (let i = 0; i < 4; i++) {
    const x1 = px(i) + PW + 6, x2 = px(i + 1) - 6, y = GY + 44;
    s += arrow(`M${x1},${y} L${x2},${y}`, id) + elabel((x1 + x2) / 2, y - 8, labs[i][l]);
  }
  return s + legend([TY.poc, TY.sol, TY.dev, TY.add, TY.own], W, H, l) + '</svg>';
}

function funnelC(l, id) {
  const W = 720, H = 324, TOP = 48;
  const D = (d) => 40 + d * 9; // 3.7 = 0일
  const x = { r1: D(0), sc: D(20), r2: D(36), sl: D(41), mx: D(43), sp: D(48), rm: D(54), rp: D(64) };
  let s = open(W, H, id);
  // 날짜 안내선
  for (const k of Object.keys(x)) s += `<line class="guide" x1="${x[k]}" y1="${TOP - 8}" x2="${x[k]}" y2="232"/>`;
  // 1차 56
  s += `<path class="st-1" d="M${x.r1},${TOP} L${x.r2},${TOP} L${x.r2},${TOP + 56} L${x.r1},${TOP + 56} Z"/>`;
  // 2차 +107 → 163, 4.17까지 24로 좁아짐
  const tap = x.r2 + 12;
  s += `<path class="st-2" d="M${x.r2},${TOP + 56} L${tap},${TOP + 56} L${tap},${TOP + 163} L${x.r2},${TOP + 163} Z"/>`;
  s += `<path class="st-1" d="M${x.r2},${TOP} L${tap},${TOP} L${tap},${TOP + 56} L${x.r2},${TOP + 56} Z"/>`;
  s += `<path class="st-1" d="M${tap},${TOP} L${x.sl},${TOP} L${x.sl},${TOP + 24} C${x.sl - 20},${TOP + 24} ${tap + 4},${TOP + 163} ${tap},${TOP + 163} Z"/>`;
  // 24 → 4.19 분류: PoC 12 / 솔루션 8 / 개발 준비 4로 갈라짐, 4.30 +2
  s += `<path class="st-s" d="M${x.sl},${TOP} L${x.mx},${TOP} L${x.mx},${TOP + 24} L${x.sl},${TOP + 24} Z"/>`;
  const fan = 28;
  const subs = [
    { n: 12, y0: TOP, y1: TOP, lab: t('PoC 12', 'PoC 12') },
    { n: 8, y0: TOP + 12, y1: TOP + 24, lab: t('Solution 8', '솔루션 8') },
    { n: 4, y0: TOP + 20, y1: TOP + 44, lab: t('Prep 4', '개발 준비 4') },
  ];
  for (const b of subs) {
    const c = x.mx + fan / 2;
    s += `<path class="st-s" d="M${x.mx},${b.y0} C${c},${b.y0} ${c},${b.y1} ${x.mx + fan},${b.y1} L${x.rp},${b.y1} L${x.rp},${b.y1 + b.n} L${x.mx + fan},${b.y1 + b.n} C${c},${b.y1 + b.n} ${c},${b.y0 + b.n} ${x.mx},${b.y0 + b.n} Z"/>`;
    s += txt(x.rp + 8, b.y1 + b.n / 2 + 3, b.lab[l], 'ts dark');
  }
  s += `<path class="st-e" d="M${x.rm},${TOP + 60} L${x.rp},${TOP + 60} L${x.rp},${TOP + 62} L${x.rm},${TOP + 62} Z"/>`;
  s += txt(x.rp + 8, TOP + 64, t('+2 enablers', '+2 기반 과제')[l], 'ts dark');
  s += txt(x.rp + 8, TOP - 12, t('26 tasks', '26건')[l], 'tn');
  // 건수
  s += txt(x.r1 + 10, TOP + 33, '56', 'tn');
  s += txt(x.r2 - 8, TOP + 112, '+107', 'tn', { anchor: 'end' });
  s += txt(x.r2 - 8, TOP + 128, t('163 in total', '총 163건')[l], 'ts', { anchor: 'end' });
  s += txt(x.sl + 4, TOP - 12, '24', 'tn', { anchor: 'middle' });
  // 날짜 축 + 단계 이름 (두 줄로 엇갈림)
  s += `<line class="axis" x1="${x.r1}" y1="236" x2="${x.rp}" y2="236"/>`;
  const ms = [
    ['r1', t('Mar 7', '3.7'), t('Round 1', '1차 수집'), 0],
    ['sc', t('Mar 27', '3.27'), t('Scoring', '1차 평가'), 1],
    ['r2', t('Apr 12', '4.12'), t('Round 2', '2차 수집'), 0],
    ['sl', t('Apr 17', '4.17'), t('Shortlist', '대상 선정'), 1],
    ['mx', t('Apr 19', '4.19'), t('Matrix', '매트릭스'), 0],
    ['sp', t('Apr 24', '4.24'), t('Specs', '과제 정의서'), 1],
    ['rm', t('Apr 30', '4.30'), t('Roadmap', '로드맵'), 0],
    ['rp', t('May 10', '5.10'), t('Report', '최종 보고'), 1],
  ];
  for (const [k, d, n, row] of ms) {
    const a = k === 'r1' ? 'start' : k === 'rp' ? 'end' : 'middle';
    const yy = 256 + row * 34;
    s += `<line class="axis" x1="${x[k]}" y1="232" x2="${x[k]}" y2="240"/>`;
    s += txt(x[k], yy, d[l], 'ts', { anchor: a }) + txt(x[k], yy + 14, n[l], 'tb', { anchor: a });
  }
  return s + '</svg>';
}

// =====================================================================
// ② Matrix
// =====================================================================
const QUAD = {
  poc: { n: 12, cls: 'k-own', name: t('Run a PoC first', 'PoC로 먼저 검증'), short: t('PoC', 'PoC 수행'),
    desc: t('High impact, with proven use cases.\nTest the value before building the system.', '영향이 크고 적용 사례가 있는 영역.\n시스템 구축 전에 효과를 먼저 검증.'),
    ex: t('e.g. mixing optimization, cotton-pulp price', '예: 그린소재 믹싱 최적화, 면 펄프 단가 예측'), act: t('Validate in a PoC before building', '구축 전 PoC로 효과 검증') },
  sol: { n: 8, cls: 'k-sol', name: t('Adopt a proven solution', '검증된 솔루션 도입'), short: t('Proven solution', '솔루션 도입'),
    desc: t('Easy to do, but lower impact.\nBring in a commercial tool for early wins.', '수행은 쉽지만 영향이 작은 영역.\n상용 솔루션을 도입해 작은 성공부터.'),
    ex: t('e.g. smart CCTV, drawing recognition', '예: 지능형 CCTV, 도면 인식'), act: t('Adopt a commercial tool for quick wins', '상용 솔루션 도입으로 빠른 성과') },
  dev: { n: 4, cls: 'k-dev', name: t('Prepare, then build', '기반을 갖춘 뒤 추진'), short: t('Development prep', '개발 준비'),
    desc: t('High impact, but the groundwork is missing.\nReady the data and infrastructure first.', '영향은 크지만 수행 기반이 부족한 영역.\n데이터와 인프라를 먼저 준비.'),
    ex: t('e.g. demand forecast, profit simulation', '예: 고객사 수요 예측, 손익 시뮬레이션'), act: t('Prepare data and infrastructure first', '데이터·인프라 준비 후 추진') },
  mon: { n: 0, cls: 'k-mon', name: t('Monitor the technology', '기술 동향 모니터링'), short: t('Monitor', '모니터링'),
    desc: t('Lower impact and immature technology.\nWatch for an opening.', '영향도 작고 기술도 성숙하지 않은 영역.\n동향을 지켜보며 기회를 포착.'),
    ex: t('No task fell here', '해당 과제 없음'), act: t('Watch the technology for an opening', '기술 동향 지속 모니터링') },
};
// 자료(6장) 배치: 가로 = 사업 영향도(오른쪽 높음), 세로 = 기술 성숙도(위 높음)
const QPOS = [['sol', 0, 0], ['poc', 1, 0], ['mon', 0, 1], ['dev', 1, 1]];

function matrixA(l, id) {
  const W = 720, H = 372, X0 = 64, CW = 316, CH = 144, G = 16, Y0 = 24;
  let s = open(W, H, id);
  s += arrow(`M48,332 L48,${Y0 - 4}`, id, 'ln ax') + arrow(`M48,332 L716,332`, id, 'ln ax');
  s += txt(40, Y0 + 12, t('High', '높음')[l], 'ts', { anchor: 'end' }) + txt(40, 320, t('Low', '낮음')[l], 'ts', { anchor: 'end' });
  s += txt(56, 12, t('Technology maturity', '기술 성숙도')[l], 'ts dark');
  s += txt(X0, 352, t('Low', '낮음')[l], 'ts') + txt(712, 352, t('High', '높음')[l], 'ts', { anchor: 'end' });
  s += txt(388, 352, t('Business impact', '사업 영향도')[l], 'ts dark', { anchor: 'middle' });
  for (const [k, c, r] of QPOS) {
    const q = QUAD[k];
    const x = X0 + c * (CW + G), y = Y0 + r * (CH + G);
    const focal = k === 'poc';
    s += rect(x, y, CW, CH, focal ? 'k-own' : k === 'mon' ? 'k-mon' : 'zone in', 8);
    s += txt(x + 16, y + 32, q.name[l], 'tt');
    s += txt(x + CW - 16, y + 36, String(q.n), `tc lg${focal ? ' acc' : k === 'mon' ? ' mut' : ''}`, { anchor: 'end' });
    s += txt(x + 16, y + 62, q.desc[l], 'td', { lh: 18 });
    s += txt(x + 16, y + CH - 18, q.ex[l], 'ts');
    for (const line of q.desc[l].split('\n')) if (est(line) > CW - 32) warn.push(`matrixA desc ${k} ${l}`);
  }
  return s + '</svg>';
}

function matrixB(l, id) {
  const W = 720, X0 = 112, CW = 296, CH = 116, G = 8, Y0 = 32;
  const H = Y0 + 2 * CH + G + 56;
  let s = open(W, H, id);
  s += txt(X0 + CW / 2, 18, t('Lower business impact', '사업 영향도 낮음')[l], 'tl', { anchor: 'middle' });
  s += txt(X0 + CW + G + CW / 2, 18, t('Higher business impact', '사업 영향도 높음')[l], 'tl', { anchor: 'middle' });
  s += txt(0, Y0 + CH / 2 - 2, t('Mature\ntechnology', '기술\n성숙도 높음')[l], 'tl');
  s += txt(0, Y0 + CH + G + CH / 2 - 2, t('Emerging\ntechnology', '기술\n성숙도 낮음')[l], 'tl');
  for (const [k, c, r] of QPOS) {
    const q = QUAD[k];
    const x = X0 + c * (CW + G), y = Y0 + r * (CH + G);
    s += rect(x, y, CW, CH, k === 'mon' ? 'k-mon' : 'zone', 8);
    s += txt(x + 16, y + 26, q.short[l], 'tn');
    s += txt(x + CW - 16, y + 30, String(q.n), `tc${k === 'mon' ? ' mut' : ''}`, { anchor: 'end' });
    const sq = k === 'poc' ? 'k-poc' : q.cls;
    for (let i = 0; i < q.n; i++) s += rect(x + 16 + i * 22, y + 44, 16, 16, k === 'poc' && i < 2 ? 'k-own' : sq, 3);
    if (!q.n) s += txt(x + 16, y + 56, t('No task', '해당 없음')[l], 'ts');
    s += txt(x + 16, y + 92, q.act[l], 'td');
  }
  return s + legend([TY.own, TY.poc, TY.sol, TY.dev], W, H, l) + '</svg>';
}

function matrixC(l, id) {
  const W = 720, H = 316;
  let s = open(W, H, id) + '<g transform="translate(0,-28)">';
  const box = (x, y, w, h, n, name, sub, cls = 'k-plain', acc) =>
    rect(x, y, w, h, cls, 6) + txt(x + w / 2, y + 34, String(n), `tc${acc ? ' acc' : ''}`, { anchor: 'middle' }) + txt(x + w / 2, y + 56, name[l], 'tn', { anchor: 'middle' }) + txt(x + w / 2, y + 72, sub[l], 'ts', { anchor: 'middle' });
  // 연결선 먼저
  s += arrow('M112,144 L148,144', id) + elabel(130, 136, t('score', '평가')[l]);
  s += arrow('M248,144 L284,144', id) + elabel(266, 136, t('matrix', '분류')[l]);
  s += arrow('M536,144 L572,144', id) + elabel(554, 136, t('plan', '일정')[l]);
  s += arrow('M632,236 L632,192', id) + elabel(648, 218, t('add', '추가')[l]);
  s += box(0, 100, 112, 88, 163, t('Ideas', '발굴 과제'), t('2 rounds', '2차례 수집'));
  s += box(152, 100, 96, 88, 24, t('Shortlisted', '선별'), t('top 15%', '상위 15%'));
  // 매트릭스
  s += rect(288, 52, 248, 184, 'zone', 8) + txt(412, 72, t('Impact × maturity', '영향도 × 성숙도')[l], 'zl', { anchor: 'middle' });
  const cells = { sol: [300, 84], poc: [416, 84], mon: [300, 156], dev: [416, 156] };
  for (const [k, [x, y]] of Object.entries(cells)) {
    const q = QUAD[k];
    const cls = k === 'poc' ? 'k-own' : q.cls;
    s += rect(x, y, 108, 64, cls, 6);
    s += txt(x + 54, y + 28, String(q.n), `tc sm${k === 'poc' ? ' acc' : k === 'mon' ? ' mut' : ''}`, { anchor: 'middle' });
    s += txt(x + 54, y + 48, q.short[l], 'ts dark', { anchor: 'middle' });
  }
  s += txt(300, 256, t('↑ technology maturity   → business impact', '↑ 기술 성숙도   → 사업 영향도')[l], 'ts');
  s += box(576, 100, 112, 88, 26, t('Roadmap tasks', '로드맵 과제'), t('2024–26', '2024–26'));
  s += rect(576, 236, 112, 48, 'k-add', 6) + txt(632, 256, t('+2 enablers', '+2 기반 과제')[l], 'tn', { anchor: 'middle' }) + txt(632, 272, t('governance · lake', '거버넌스·레이크')[l], 'ts', { anchor: 'middle' });
  const quad = { cls: 'k-own', label: t('PoC quadrant', 'PoC 영역') };
  return s + '</g>' + legend([quad, TY.sol, TY.dev, TY.add], W, H, l) + '</svg>';
}

// =====================================================================
// 갤러리
// =====================================================================
const groups = [
  {
    id: 'funnel',
    title: '① 과제 선별 깔때기',
    where: '자리: Approach 목록 아래 (approach). 163건에서 로드맵 26건, PoC 3건까지 거른 과정',
    variants: [
      { key: 'A', name: '단계 원장 막대', draw: funnelA, intent: '다섯 단계를 행으로 쌓고, 막대 길이를 건수에 비례시켜 왼쪽 정렬 깔때기 실루엣을 만든다. 행마다 날짜와 거른 기준을 한 줄씩.', pros: '수치가 정직하게 비례. 기준·날짜를 함께 읽혀 설명력이 높고 구현이 단순.', cons: '163 → 3의 낙차가 커서 아래 막대가 짧다. 그림 자체의 인상은 가장 차분함.' },
      { key: 'B', name: '단위 격자 (작은 그림 5개)', draw: funnelB, intent: '과제 하나 = 네모 하나. 163칸 격자에서 24칸이 남고, 유형으로 나뉘고, PoC 3건으로 끝난다.', pros: '“많이 걸렀다”가 한눈에 보이고 가장 기억에 남음. ③ 로드맵 범례와 같은 네모 모양으로 이어짐.', cons: '3–5단은 네모를 키워 그림 간 크기가 다름. 2단의 남은 칸 위치는 임의(점수 아님).' },
      { key: 'C', name: '2개월 타임라인 흐름', draw: funnelC, intent: '3.7–5.10 날짜 축 위로 과제 흐름의 두께(=건수)가 바뀐다. 2차 수집에서 부풀고, 선별에서 좁아지고, 분류에서 세 갈래로.', pros: '2개월간 수집 → 평가 → 분류 → 로드맵의 진행이 보여 컨설팅 방법론이 드러남.', cons: '가장 복잡. PoC 3건은 나오지 않음. 단계 이름이 짧아짐.' },
    ],
  },
  {
    id: 'matrix',
    title: '② 분류 매트릭스',
    where: '자리: Approach, ① 아래. 상위 24건을 사업 영향도 × 기술 성숙도로 나눠 추진 방식을 정함 (자료 6·7장 배치 그대로: 가로 영향도, 세로 성숙도)',
    variants: [
      { key: 'A', name: '컨설팅 2×2', draw: matrixA, intent: '축 화살표와 네 칸. 칸마다 추진 방식 이름, 건수, 2줄 설명, 예시 과제. PoC 칸 하나만 포인트 색.', pros: '컨설팅 결과물의 인상이 가장 강함. 각 영역의 추진 방식이 문장으로 남음.', cons: '글이 많아 그림이 큼(372 높이).' },
      { key: 'B', name: '표형 2×2 + 단위 네모', draw: matrixB, intent: '행·열 머리를 단 표 모양 매트릭스. 칸마다 과제 수만큼 네모, 수행팀 PoC 2건은 포인트 색.', pros: '건수 비교가 즉시 보이고, ③ 로드맵과 같은 범례로 이어짐. 축 화살표 없이 깔끔.', cons: '예시 과제명과 영역 설명이 짧아짐.' },
      { key: 'C', name: '①+② 합본 파이프라인', draw: matrixC, intent: '163 → 24 → 매트릭스 → 26(+2)를 한 장에. ①을 따로 넣지 않는 안.', pros: '그림 수가 줄어 Approach가 가벼움. 선별과 분류의 관계가 한 줄로 이어짐.', cons: '매트릭스 칸이 작아 추진 방식 설명이 빠짐. PoC 3건 단계 없음.' },
    ],
  },
  {
    id: 'roadmap',
    title: '③ 3개년 로드맵',
    where: '자리: 새 섹션 Roadmap / 로드맵 (Outcome 앞) 또는 Outcome 소제목. 2024-05 최종본 26건, 과제명은 일반 명칭',
    variants: [
      { key: 'A', name: '추진 방향별 Gantt (26건 전부)', draw: roadmapA, intent: '레인 = 추진 방향 4개, 가로 = 2024–2026 반기. 막대 모양으로 추진 방식, 수행팀 PoC 2건만 포인트 색.', pros: '실제 로드맵 결과물에 가장 가까워 규모와 밀도가 그대로 보임.', cons: '복잡도 예산(12개) 초과, 막대 글자 11px. 좁은 화면은 가로 스크롤.' },
      { key: 'B', name: '착수 시점 점도표', draw: roadmapB, intent: '레인 × 반기 칸에 그 반기에 착수하는 과제를 네모로. 이름은 수행팀 PoC만, 아래에 반기별 착수 건수.', pros: '가볍고 한눈에 리듬(2024 하반기에 착수 집중)이 보임.', cons: '기간과 과제명이 빠져 “무엇을”이 약함.' },
      { key: 'C', name: '추진 방식별 Gantt + 배치 원칙', draw: roadmapC, intent: '레인을 추진 방식(솔루션·PoC·데이터 기반·개발 준비)으로 바꾸고 배치 원칙을 메모로.', pros: '“솔루션 먼저, 데이터 플랫폼 후 개발 준비” 같은 로드맵 설계 논리가 드러나 컨설팅 역량을 강조.', cons: '추진 방향(비전 3축)이 빠짐. 세로로 가장 김.' },
    ],
  },
];

let body = `<section class="intro">
  <h2>페이지 구성안 (/work/lotte-ai-masterplan/)</h2>
  <ol>
    <li><b>Context</b> 전사 AI 도입 TF, 자체 발굴 과제 163건 · 추진 방향 3축(직원 생산성, 사업 경쟁력, 데이터 기반 의사결정)</li>
    <li><b>Problem</b> 과제는 많지만 평가 기준·우선순위·실행 계획이 없음</li>
    <li><b>My role</b> PM 총괄 + PoC 3건 리드</li>
    <li><b>Approach</b> 목록 + <b>①</b> 선별 깔때기 + <b>②</b> 분류 매트릭스 (②-C를 고르면 한 장)</li>
    <li><b>Roadmap</b> (새 섹션) <b>③</b> 3개년 로드맵</li>
    <li><b>Outcome</b> 26건 로드맵, PoC 3건 → 가격 예측·그린소재 케이스 스터디로 링크, LLM 플랫폼은 한 줄</li>
  </ol>
  <p class="fine">확인할 점: LLM 플랫폼 PoC는 2024-05 로드맵 26건에 없고 이후 추가된 과제입니다. ①의 마지막 단 “PoC 3건”은 26건의 부분집합이 아니라는 점을 그림에서 구분할지 정해 주세요.</p>
</section>`;
for (const g of groups) {
  body += `<section class="grp" id="${g.id}"><h2>${esc(g.title)}</h2><p class="where">${esc(g.where)}</p>`;
  for (const v of g.variants) {
    const id = `${g.id}-${v.key}`;
    body += `<article class="card" id="${id}">
      <header><span class="key">${v.key}</span><h3>${esc(v.name)}</h3></header>
      <dl><div><dt>의도</dt><dd>${esc(v.intent)}</dd></div><div><dt>장점</dt><dd>${esc(v.pros)}</dd></div><div><dt>단점</dt><dd>${esc(v.cons)}</dd></div></dl>
      <figure class="dg">
        <div class="dg-scroll" lang="en">${v.draw('en', id + '-en')}</div>
        <div class="dg-scroll" lang="ko">${v.draw('ko', id + '-ko')}</div>
      </figure>
    </article>`;
  }
  body += '</section>';
}

const html = `<!doctype html>
<html lang="ko" data-view="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>g16 AI roadmap diagrams</title>
<link rel="stylesheet" href="/public/fonts/pretendard/pretendardvariable-dynamic-subset.css">
<style>
${fonts}
${tokens}
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--font-ko); font-size: var(--fs-md); line-height: 1.6; }
.bar { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding: 12px 16px; background: var(--surface); border-bottom: 1px solid var(--line); }
.bar h1 { font-size: var(--fs-md); font-weight: 600; margin-right: auto; }
.bar nav { display: flex; gap: 4px; flex-wrap: wrap; }
.bar a { font-size: var(--fs-xs); color: var(--text-2); text-decoration: none; padding: 2px 6px; }
.seg { display: inline-flex; border: 1px solid var(--line-strong); border-radius: 999px; overflow: hidden; }
.seg button { font: inherit; font-size: var(--fs-xs); border: 0; background: none; color: var(--text-2); padding: 4px 10px; cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
main { max-width: 860px; margin: 0 auto; padding: 24px 16px 80px; }
.intro { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 20px 24px; font-size: var(--fs-sm); color: var(--text-2); }
.intro h2 { font-size: var(--fs-lg); color: var(--text); margin-bottom: 8px; }
.intro ol { padding-left: 20px; display: grid; gap: 2px; }
.intro b { color: var(--text); font-weight: 600; }
.fine { margin-top: 10px; color: var(--text-3); }
.grp { margin-top: 40px; }
.grp h2 { font-size: var(--fs-xl); font-weight: 600; }
.where { color: var(--text-3); font-size: var(--fs-sm); margin-bottom: 16px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 24px 32px 28px; margin-top: 16px; }
html[data-w="mob"] .card { max-width: 358px; padding: 20px 16px; margin-inline: auto; }
.card header { display: flex; align-items: baseline; gap: 10px; }
.key { font-family: var(--font-meta); font-size: var(--fs-sm); color: var(--accent); }
.card h3 { font-size: var(--fs-lg); font-weight: 600; }
dl { margin: 12px 0 20px; display: grid; gap: 4px; font-size: var(--fs-sm); color: var(--text-2); }
dl div { display: grid; grid-template-columns: 40px 1fr; gap: 8px; }
dt { color: var(--text-3); font-weight: 600; }
.dg-scroll { overflow-x: auto; }
html[data-view="en"] .dg-scroll[lang="ko"], html[data-view="ko"] .dg-scroll[lang="en"] { display: none; }
.dg-scroll[lang="en"] svg { font-family: var(--font); }
.dg-scroll[lang="ko"] svg { font-family: var(--font-ko); }
svg { display: block; width: 100%; min-width: 640px; height: auto; }
/* 종류 (Diagram.astro 규칙과 같은 값) */
.k-own { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1.2; }
.k-poc { fill: var(--surface); stroke: var(--text-2); stroke-width: 1.2; }
.k-sol { fill: var(--chip); stroke: var(--line-strong); stroke-width: 0.8; }
.k-dev { fill: var(--surface); stroke: var(--text-3); stroke-width: 1; stroke-dasharray: 4 3; }
.k-add { fill: var(--bg); stroke: var(--text-3); stroke-width: 1; }
.k-mon { fill: none; stroke: var(--line-strong); stroke-width: 1; stroke-dasharray: 2 3; }
.k-plain { fill: var(--surface); stroke: var(--line-strong); stroke-width: 1; }
.zone { fill: var(--bg); }
.zone.in { fill: var(--bg); stroke: var(--line-strong); stroke-width: 0.8; }
.u-idea { fill: var(--line-strong); } .u-idea2 { fill: var(--line-strong); opacity: 0.6; }
.u-off { fill: var(--line); } .u-sel { fill: var(--text-2); }
.bar-n { fill: var(--line-strong); } .bar-n2 { fill: var(--chip); stroke: var(--line-strong); stroke-width: 0.8; }
.sil { fill: var(--chip); opacity: 0.7; }
.st-1 { fill: var(--line-strong); } .st-2 { fill: var(--line); } .st-s { fill: var(--text-2); } .st-e { fill: var(--text-3); }
.guide { stroke: var(--line); stroke-dasharray: 2 3; }
.axis { stroke: var(--line-strong); }
.gl { stroke: var(--line); } .gl.yr { stroke: var(--line-strong); }
/* 글자 */
.tn { fill: var(--text); font-size: 12px; font-weight: var(--fw-strong); }
.tb { fill: var(--text); font-size: 11px; font-weight: var(--fw-medium); }
.tt { fill: var(--text); font-size: 16px; font-weight: var(--fw-strong); }
.tl, .ty, .zl { fill: var(--text-2); font-size: 12px; font-weight: var(--fw-strong); }
.td { fill: var(--text-2); font-size: 12px; }
.ts { fill: var(--text-3); font-family: var(--font-meta); font-size: 9px; }
.ts.dark { fill: var(--text-2); }
.ts.acc, .tc.acc { fill: var(--accent); }
.tx { fill: var(--text-3); font-family: var(--font-meta); font-size: 9px; }
.tc { fill: var(--text); font-size: 24px; font-weight: var(--fw-strong); font-variant-numeric: tabular-nums; }
.tc.lg { font-size: 28px; } .tc.sm { font-size: 20px; } .tc.mut { fill: var(--text-3); }
.el { fill: var(--text-3); font-family: var(--font-meta); font-size: 8px; letter-spacing: 0.06em; }
.em { fill: var(--surface); }
.ln { fill: none; stroke: var(--text-3); stroke-width: 1.2; }
.ln.ax { stroke: var(--text-2); }
.mk { fill: var(--text-3); }
.rule { stroke: var(--line); }
.lg { fill: var(--text-2); font-size: 12px; }
</style>
</head>
<body>
<div class="bar">
  <h1>g16 · AI 과제 추진 로드맵 다이어그램 시안</h1>
  <nav>${groups.map((g) => `<a href="#${g.id}">${esc(g.title)}</a>`).join('')}</nav>
  <span class="seg" data-k="view"><button data-v="en">EN</button><button data-v="ko">KO</button></span>
  <span class="seg" data-k="theme"><button data-v="light">Light</button><button data-v="dark">Dark</button></span>
  <span class="seg" data-k="w"><button data-v="desk">Desktop</button><button data-v="mob">Mobile</button></span>
</div>
<main>${body}</main>
<script>
const st = { view: 'en', theme: 'light', w: 'desk' };
const q = new URLSearchParams(location.search);
for (const k in st) if (q.get(k)) st[k] = q.get(k);
function apply() {
  const h = document.documentElement;
  h.dataset.view = st.view; h.dataset.w = st.w;
  h.setAttribute('data-theme', st.theme);
  document.querySelectorAll('.seg').forEach((s) => s.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(st[s.dataset.k] === b.dataset.v))));
}
document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { st[b.parentElement.dataset.k] = b.dataset.v; apply(); }));
apply();
</script>
</body>
</html>`;

writeFileSync(new URL('./index.html', import.meta.url), html);
if (warn.length) console.warn('width warnings:\n  ' + [...new Set(warn)].join('\n  '));
console.log('wrote g16/index.html');
