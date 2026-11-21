// SCM 케이스 스터디 다이어그램 시안 생성 (2026-11-21, g9).
// dist의 케이스 페이지에서 아키텍처 표를 시안 마크업으로 바꿔 dist/draft-arch/{en,ko}/{a,b,c}/ 로 쓴다.
// 순서: npm run build → node docs/design-drafts/g9/make.mjs → npm run preview → node docs/design-drafts/g9/shoot.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { flow, ops, notes, ui } from './content.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- A. 회로도 (SVG) ----------
const MARK = `<defs><marker id="dg-ar" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon class="dg-mk" points="0 0, 8 3, 0 6"/></marker></defs>`;

function box(x, y, w, h, s, l) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const name = esc(s.t[l]);
  const sub = s.sub && esc(s.sub[l]);
  return `<g class="k-${s.kind}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>
  <text class="dg-t" x="${cx}" y="${sub ? cy - 3 : cy + 4}" text-anchor="middle">${name}</text>
  ${sub ? `<text class="dg-s" x="${cx}" y="${cy + 12}" text-anchor="middle">${sub}</text>` : ''}</g>`;
}
// 글자 폭 추정 (라틴 6.8px, 한글 12px @12px)
const est = (t) => [...t].reduce((n, c) => n + (/[\u3131-\uD79D]/.test(c) ? 12 : 6.8), 0);
// center: 위에서 내려오는 연결선이 영역 이름 가운데를 지나가므로, 이름을 선 위에 올리고 바탕으로 가린다.
const zone = (x, y, w, h, label, center = false) =>
  `<rect class="dg-z" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>` +
  (center
    ? `<rect class="dg-zm" x="${x + w / 2 - est(label) / 2 - 6}" y="${y + 8}" width="${est(label) + 12}" height="16" rx="2"/><text class="dg-zl" x="${x + w / 2}" y="${y + 20}" text-anchor="middle">${esc(label)}</text>`
    : `<text class="dg-zl" x="${x + 12}" y="${y + 20}">${esc(label)}</text>`);
const path = (d, cls = '') => `<path class="dg-a ${cls}" d="${d}" marker-end="url(#dg-ar)"/>`;
const line = (d) => `<path class="dg-a" d="${d}"/>`;

function legendSvg(l, y) {
  const items = ['sllm', 'llm', 'logic'];
  let x = 0;
  return (
    `<line class="dg-rule" x1="0" y1="${y - 16}" x2="720" y2="${y - 16}"/>` +
    items
      .map((k) => {
        const t = esc(flow.legend[k][l]);
        const g = `<g class="k-${k}"><rect x="${x}" y="${y - 6}" width="16" height="12" rx="3"/></g><text class="dg-lg" x="${x + 24}" y="${y + 4}">${t}</text>`;
        x += 232;
        return g;
      })
      .join('')
  );
}

function aFlow(l) {
  const col = (i) => 176 + i * 188; // 에이전트 열 x (폭 168)
  const BW = 144;
  const H = 40;
  const top = 176;
  const step = 56;
  let s = '';
  // 영역
  s += zone(176, 8, 544, 84, flow.orch.label[l]);
    flow.agents.forEach((a, i) => (s += zone(col(i), 136, 168, 264, '')));
  s += zone(0, 136, 156, 264, flow.bi.label[l]);
  // 연결선 (상자보다 먼저)
  s += path('M156,60 H188');
  s += path('M332,60 H376') + path('M520,60 H564');
  // 라우터 → 버스 → 3개 에이전트
  s += line('M636,80 V116');
  s += line('M268,116 H636');
  s += path('M268,116 Q260,116 260,124 V176');
  s += path('M448,116 V176') + path('M636,116 V176');
  s += `<rect class="dg-m" x="332" y="96" width="32" height="12" rx="2"/><text class="dg-al" x="348" y="105" text-anchor="middle">${flow.a2a[l]}</text>`;
  // 에이전트 단계 (영역 이름은 연결선 위에)
  flow.agents.forEach((a, i) => (s += zone(col(i), 136, 168, 0, a.label[l], true).replace(/<rect class="dg-z"[^>]*>/, '')));
  flow.agents.forEach((a, i) => {
    const x = col(i) + 12;
    a.steps.forEach((st, j) => {
      const y = top + j * step;
      if (j) s += path(`M${x + BW / 2},${y - 16} V${y}`);
      s += box(x, y, BW, H, st, l);
    });
    const last = top + (a.steps.length - 1) * step + H;
    s += path(`M${x + BW / 2},${last} V424`);
  });
  // 답변 구성 → BI 엔진 (아래에서 위로)
  s += box(188, 424, 520, H, flow.layout, l);
  s += path('M188,444 H86 Q78,444 78,436 V384');
  const biY = [344, 288, 232, 176];
  flow.bi.steps.forEach((st, j) => {
    const y = biY[j];
    if (j) s += path(`M78,${y + H + 16} V${y + H}`);
    s += box(8, y, 140, H, st, l);
  });
  s += path('M116,176 V80', 'dg-back');
  s += box(0, 40, 156, H, { kind: 'in', t: flow.portal }, l);
  // 오케스트레이터 단계
  flow.orch.steps.forEach((st, i) => (s += box(188 + i * 188, 40, BW, H, st, l)));
  s += legendSvg(l, 516);
  return `<svg class="dga" viewBox="0 0 720 528" role="img" aria-label="${esc(ui.figFlow[l])}">${MARK}${s}</svg>`;
}

function aOps(l) {
  let s = '';
  ops.envs.forEach((e, i) => {
    const x = i * 372;
    s += zone(x, 80, 348, 168, e.label[l]);
  });
  s += zone(0, 272, 720, 84, ops.shared[l]);
  // 코드 경로
  s += path('M284,20 H182 Q174,20 174,28 V120');
  s += path('M436,20 H538 Q546,20 546,28 V120');
  s += `<text class="dg-al" x="164" y="52" text-anchor="end">${esc(ops.auto[l])}</text>`;
  s += `<text class="dg-al" x="556" y="52">${esc(ops.pr[l])}</text>`;
  // 모델 경로
  s += path('M344,300 V268 Q344,260 336,260 H182 Q174,260 174,252 V232');
  s += path('M376,300 V268 Q376,260 384,260 H538 Q546,260 546,252 V232');
  s += box(284, 0, 152, 40, { kind: 'in', t: ops.git }, l);
  ops.envs.forEach((e, i) => {
    const x = i * 372 + 12;
    s += box(x, 120, 324, 48, { kind: 'logic', t: ops.appT, sub: ops.app }, l);
    s += box(x, 184, 324, 48, { kind: 'sllm', t: ops.infer, sub: ops.inferSub }, l);
  });
  s += box(268, 300, 184, 44, { kind: 'sllm', t: ops.train, sub: ops.trainSub }, l);
  s += box(496, 300, 212, 44, { kind: 'llm', t: ops.gen, sub: ops.genSub }, l);
  return `<svg class="dga" viewBox="0 0 720 360" role="img" aria-label="${esc(ui.figOps[l])}">${MARK}${s}</svg>`;
}

const variantA = (l) => `
<figure class="dg"><figcaption>${ui.figFlow[l]}</figcaption><div class="dga-scroll" tabindex="0">${aFlow(l)}</div></figure>
<figure class="dg"><figcaption>${ui.figOps[l]}</figcaption><div class="dga-scroll" tabindex="0">${aOps(l)}</div></figure>`;

// ---------- B. 단계 원장 (HTML) ----------
const chip = (s, l) =>
  `<span class="ch k-${s.kind}">${esc(s.t[l])}${s.sub ? `<span class="ch-s">${esc(s.sub[l])}</span>` : ''}</span>`;
const chain = (steps, l) =>
  `<span class="cn">${steps.map((s, i) => `<span class="sg">${i ? '<span class="ar" aria-hidden="true"></span>' : ''}${chip(s, l)}</span>`).join('')}</span>`;

function legendHtml(l) {
  return `<ul class="dg-lgd">${['sllm', 'llm', 'logic']
    .map((k) => `<li><span class="sw k-${k}"></span>${flow.legend[k][l]}</li>`)
    .join('')}</ul>`;
}

function bFlow(l) {
  const rows = [
    [{ en: 'Portal', ko: '포털' }, chain([{ kind: 'in', t: flow.portal }], l)],
    [flow.orch.label, chain(flow.orch.steps, l) + `<span class="tag">→ ${flow.a2a[l]}</span>`],
    [
      { en: 'Agents', ko: '에이전트' },
      `<div class="trs">${flow.agents
        .map((a) => `<div class="tr"><span class="tl">${a.label[l]}</span>${chain(a.steps, l)}</div>`)
        .join('')}</div>`,
    ],
    [flow.layout.t, chain([flow.layout], l)],
    [flow.bi.label, chain(flow.bi.steps, l) + `<span class="tag back">↩ 01 ${l === 'en' ? 'Portal' : '포털'}</span>`],
  ];
  return `<ol class="dgb">${rows
    .map(
      ([k, v], i) =>
        `<li><span class="n num">${String(i + 1).padStart(2, '0')}</span><span class="k">${k[l]}</span><div class="v">${v}</div></li>`,
    )
    .join('')}</ol>${legendHtml(l)}`;
}

function bOps(l) {
  const app = { kind: 'logic', t: ops.appT, sub: ops.app };
  const inf = { kind: 'sllm', t: ops.infer, sub: ops.inferSub };
  const env = (id) => ops.envs.find((e) => e.id === id).label[l];
  return `<div class="dgb-ops">
  <span></span><span class="h">${env('dev')}</span><span class="h">${env('prod')}</span>
  <span class="k">${l === 'en' ? 'Release' : '배포'}</span><span class="v"><span class="tag">${ops.git[l]} → ${ops.auto[l]}</span></span><span class="v"><span class="tag">${ops.pr[l]}</span></span>
  <span class="k">${ops.appT[l]}</span><span class="v">${chip(app, l)}</span><span class="v">${chip(app, l)}</span>
  <span class="k">${l === 'en' ? 'Models' : '모델'}</span><span class="v">${chip(inf, l)}</span><span class="v">${chip(inf, l)}</span>
  <span class="k">${ops.shared[l]}</span><span class="v span">${chip({ kind: 'sllm', t: ops.train, sub: ops.trainSub }, l)}<span class="tag">→ ${ops.weights[l]} → ${l === 'en' ? 'both inference servers' : '두 추론 서버'}</span>${chip({ kind: 'llm', t: ops.gen, sub: ops.genSub }, l)}</span>
</div>`;
}

const variantB = (l) => `
<figure class="dg"><figcaption>${ui.figFlow[l]}</figcaption>${bFlow(l)}</figure>
<figure class="dg"><figcaption>${ui.figOps[l]}</figcaption>${bOps(l)}</figure>`;

// ---------- C. 개요 + 확대 (HTML) ----------
const dot = (k) => `<span class="sw k-${k}" aria-hidden="true"></span>`;
function cFlow(l) {
  const blocks = [
    { t: flow.portal, items: [] },
    { t: flow.orch.label, items: flow.orch.steps.map((s) => [s.kind, s.t[l]]) },
    {
      t: { en: 'Agents', ko: '에이전트' },
      items: flow.agents.map((a, i) => [i === 0 ? 'sllm' : 'llm', a.label[l]]),
      focus: true,
    },
    { t: flow.layout.t, items: [] },
    { t: flow.bi.label, items: flow.bi.steps.map((s) => ['logic', s.t[l]]) },
  ];
  const ov = `<div class="dgc-ov"><ol>${blocks
    .map(
      (b) =>
        `<li class="${b.focus ? 'fo' : ''}"><b>${b.t[l]}</b>${b.items.length ? `<ul>${b.items.map(([k, t]) => `<li>${dot(k)}${t}</li>`).join('')}</ul>` : ''}</li>`,
    )
    .join('')}</ol><p class="ret"><span>${ui.back[l]}</span></p></div>`;
  const sp = [...flow.agents[0].steps, { kind: 'logic', t: { en: 'SQL by the BI engine', ko: 'BI 엔진의 SQL 변환' }, sub: flow.bi.steps[1].sub }];
  const strip = `<p class="dgc-h">${ui.spot[l]}</p><ol class="dgc-sp">${sp
    .map(
      (s, i) =>
        `<li class="k-${s.kind}"><span class="num">${i + 1}</span>${esc(s.t[l])}${s.sub ? `<span class="ch-s">${esc(s.sub[l])}</span>` : ''}</li>`,
    )
    .join('')}</ol>
  <div class="dgc-notes"><span class="bk a" aria-hidden="true"></span><span class="bk b" aria-hidden="true"></span><p class="nt a"><span class="num">2, 4</span>${notes.sllm[l]}</p><p class="nt b"><span class="num">5</span>${notes.bi[l]}</p></div>`;
  return ov + strip + legendHtml(l);
}

function cOps(l) {
  const env = (e) => `<div class="st"><b>${e.label[l]}</b><span class="r k-logic">${ops.appT[l]}</span><span class="r k-sllm">${ops.infer[l]}</span></div>`;
  return `<div class="dgc-ops">
  <span class="src k-in">${ops.git[l]}</span><span class="rl"><em>${ops.auto[l]}</em></span>${env(ops.envs[0])}<span class="rl"><em>${ops.pr[l]}</em></span>${env(ops.envs[1])}
  <span class="br"><em>${ops.weights[l]}</em></span>
  <span class="src tr k-sllm">${ops.train[l]}<span class="ch-s">${ops.trainSub[l]}</span></span>
</div><p class="dgc-sh">${dot('llm')}${ops.gen[l]} (${ops.genSub[l]}): ${ops.shared[l]}</p>`;
}

const variantC = (l) => `
<figure class="dg"><figcaption>${ui.figFlow[l]}</figcaption>${cFlow(l)}</figure>
<figure class="dg"><figcaption>${ui.figOps[l]}</figcaption>${cOps(l)}</figure>`;

// ---------- 주입 ----------
const css = readFileSync(new URL('./draft.css', import.meta.url), 'utf8');
const variants = { a: variantA, b: variantB, c: variantC };
for (const l of ['en', 'ko']) {
  const src = readFileSync(`dist/${l === 'ko' ? 'ko/' : ''}work/samsung-scm-agent/index.html`, 'utf8');
  for (const [v, fn] of Object.entries(variants)) {
    let html = src.replace(/<table class="tbl arch"[\s\S]*?<\/table>/, `<div class="dg-wrap dg-${v}">${fn(l)}</div>`);
    html = html.replace('</head>', `<style>${css}</style></head>`);
    const dir = `dist/draft-arch/${l}/${v}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, html);
  }
}
console.log('draft pages: dist/draft-arch/{en,ko}/{a,b,c}/');
