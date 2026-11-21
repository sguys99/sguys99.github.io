// g12 시안 갤러리 생성: 그린소재 재고 조합 최적화 다이어그램 4종 (2026-11-21).
// 사용: node docs/design-drafts/g12/make.mjs → docs/design-drafts/g12/index.html
// 보기: 저장소 루트에서 python3 -m http.server 4330 → http://localhost:4330/docs/design-drafts/g12/
// 렌더링은 src/components/Diagram.astro를 따르고, 시안용 요소(decision, labelAt, retired, notes)만 더했다.
import { readFileSync, writeFileSync } from 'node:fs';
import { groups } from './specs.mjs';

const root = new URL('../../../', import.meta.url).pathname;
const tokens = readFileSync(root + 'src/styles/tokens.css', 'utf8');
const fonts = readFileSync(root + 'src/styles/fonts.css', 'utf8').replaceAll("url('/fonts/", "url('/public/fonts/");

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const est = (s) => [...s].reduce((n, c) => n + (/[ㄱ-힝]/.test(c) ? 12 : 6.8), 0);
const lw = (s) => [...s].reduce((n, c) => n + (/[ㄱ-힝]/.test(c) ? 8 : 4.8), 0);
const within = (a, b) => a !== b && a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;

function svg(spec, l, id) {
  const { width: W, height: H, zones = [], nodes, edges, legend, notes = [] } = spec;
  const nested = new Set(zones.filter((z) => zones.some((o) => within(z, o))).map((z) => z.id));
  const onWash = (p) => {
    const z = zones
      .filter((z) => p.x >= z.x && p.y >= z.y && p.x <= z.x + z.w && p.y <= z.y + z.h)
      .sort((a, b) => a.w * a.h - b.w * b.h)[0];
    return !!z && !nested.has(z.id);
  };
  const mk = `mk-${id}-${l}`;
  let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><marker id="${mk}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto-start-reverse"><polygon class="mk" points="0 0, 8 3, 0 6"/></marker></defs>`;
  for (const z of zones) {
    s += `<rect class="zone${nested.has(z.id) ? ' in' : ''}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="8"/>`;
    if (!z.center) {
      const y = z.labelAt === 'bl' ? z.y + z.h - 12 : z.y + 20;
      const tr = z.labelAt === 'tr';
      s += `<text class="zl" x="${tr ? z.x + z.w - 12 : z.x + 12}" y="${y}"${tr ? ' text-anchor="end"' : ''}>${esc(z.label[l])}</text>`;
    }
  }
  for (const e of edges) {
    const cls = e.style === 'back' ? ' back' : e.style === 'retired' ? ' retired' : '';
    s += `<path class="ln${cls}" d="${e.d}" marker-end="url(#${mk})"${e.style === 'both' ? ` marker-start="url(#${mk})"` : ''}/>`;
  }
  for (const z of zones.filter((z) => z.center)) {
    const w = est(z.label[l]) + 12;
    s += `<rect class="zm${nested.has(z.id) ? ' in' : ''}" x="${z.x + z.w / 2 - w / 2}" y="${z.y + 8}" width="${w}" height="16" rx="2"/><text class="zl" x="${z.x + z.w / 2}" y="${z.y + 20}" text-anchor="middle">${esc(z.label[l])}</text>`;
  }
  for (const e of edges.filter((e) => e.label)) {
    const lb = e.label;
    const w = lw(lb.text[l]) + 8;
    const x = lb.anchor === 'start' ? lb.x - 4 : lb.x - w / 2;
    s += `<rect class="em${onWash(lb) ? ' wash' : ''}" x="${x}" y="${lb.y - 8}" width="${w}" height="11" rx="2"/><text class="el" x="${lb.x}" y="${lb.y}" text-anchor="${lb.anchor || 'middle'}">${esc(lb.text[l])}</text>`;
  }
  for (const n of nodes) {
    const ls = n.label[l].split('\n');
    const rows = ls.length + (n.sub ? 1 : 0);
    const y0 = n.y + n.h / 2 - ((rows - 1) * 14) / 2 + 4;
    const cx = n.x + n.w / 2;
    s += `<g class="k-${n.kind}">`;
    if (n.kind === 'decision') {
      const cy = n.y + n.h / 2;
      s += `<polygon points="${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}"/>`;
    } else s += `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6"/>`;
    ls.forEach((t, i) => (s += `<text class="nt${n.kind === 'decision' ? ' sm' : ''}" x="${cx}" y="${y0 + i * 14}" text-anchor="middle">${esc(t)}</text>`));
    if (n.sub) s += `<text class="ns" x="${cx}" y="${y0 + ls.length * 14}" text-anchor="middle">${esc(n.sub[l])}</text>`;
    s += `</g>`;
  }
  for (const n of notes) s += `<text class="note ${n.cls}" x="${n.x}" y="${n.y}" text-anchor="${n.anchor || 'start'}">${esc(n.text[l])}</text>`;
  const LGY = H - 12;
  const step = W / legend.length;
  s += `<line class="rule" x1="0" y1="${LGY - 20}" x2="${W}" y2="${LGY - 20}"/>`;
  legend.forEach((g, i) => {
    s += `<g class="k-${g.kind}"><rect x="${i * step}" y="${LGY - 10}" width="16" height="12" rx="3"/></g><text class="lg" x="${i * step + 24}" y="${LGY}">${esc(g.label[l])}</text>`;
  });
  return s + '</svg>';
}

const nodeCount = (s) => s.nodes.length;
let body = '';
for (const g of groups) {
  body += `<section class="grp" id="${g.id}"><h2>${esc(g.title.ko)}</h2><p class="where">${esc(g.where)}</p>`;
  for (const v of g.variants) {
    const id = `${g.id}-${v.key}`;
    body += `<article class="card" id="${id}">
      <header><span class="key">${v.key}</span><h3>${esc(v.name)}</h3><span class="meta">노드 ${nodeCount(v.spec)} · ${v.spec.width}×${v.spec.height}</span></header>
      <dl><div><dt>의도</dt><dd>${esc(v.intent)}</dd></div><div><dt>장점</dt><dd>${esc(v.pros)}</dd></div><div><dt>단점</dt><dd>${esc(v.cons)}</dd></div></dl>
      <figure class="dg">
        <div class="dg-scroll" lang="en">${svg(v.spec, 'en', id)}</div>
        <div class="dg-scroll" lang="ko">${svg(v.spec, 'ko', id)}</div>
      </figure>
    </article>`;
  }
  body += '</section>';
}

const html = `<!doctype html>
<html lang="ko" data-view="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>g12 Green-material diagrams</title>
<link rel="stylesheet" href="/public/fonts/pretendard/pretendardvariable-dynamic-subset.css">
<style>
${fonts.replaceAll("url('/fonts/", "url('/public/fonts/")}
${tokens}
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--font-ko); font-size: var(--fs-md); line-height: 1.6; }
.bar { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; gap: var(--sp-2, 8px) 16px; align-items: center; padding: 12px 16px; background: var(--surface); border-bottom: 1px solid var(--line); }
.bar h1 { font-size: var(--fs-md); font-weight: 600; margin-right: auto; }
.bar nav { display: flex; gap: 4px; flex-wrap: wrap; }
.bar a { font-size: var(--fs-xs); color: var(--text-2); text-decoration: none; padding: 2px 6px; }
.seg { display: inline-flex; border: 1px solid var(--line-strong); border-radius: 999px; overflow: hidden; }
.seg button { font: inherit; font-size: var(--fs-xs); border: 0; background: none; color: var(--text-2); padding: 4px 10px; cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
main { max-width: 820px; margin: 0 auto; padding: 24px 16px 80px; }
.grp { margin-top: 40px; }
.grp h2 { font-size: var(--fs-xl); font-weight: 600; }
.where { color: var(--text-3); font-size: var(--fs-sm); margin-bottom: 16px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 24px 32px 28px; margin-top: 16px; }
html[data-w="mob"] .card { max-width: 358px; padding: 20px 16px; margin-inline: auto; }
.card header { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.key { font-family: var(--font-meta); font-size: var(--fs-sm); color: var(--accent); }
.card h3 { font-size: var(--fs-lg); font-weight: 600; }
.meta { margin-left: auto; font-family: var(--font-meta); font-size: var(--fs-2xs); color: var(--text-3); }
dl { margin: 12px 0 20px; display: grid; gap: 4px; font-size: var(--fs-sm); color: var(--text-2); }
dl div { display: grid; grid-template-columns: 40px 1fr; gap: 8px; }
dt { color: var(--text-3); font-weight: 600; }
.dg-scroll { overflow-x: auto; }
html[data-view="en"] .dg-scroll[lang="ko"], html[data-view="ko"] .dg-scroll[lang="en"] { display: none; }
.dg-scroll[lang="en"] svg { font-family: var(--font); }
.dg-scroll[lang="ko"] svg { font-family: var(--font-ko); }
svg { display: block; width: 100%; min-width: 640px; height: auto; }
/* Diagram.astro와 같은 규칙 */
.k-accent rect, .k-accent polygon { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1; }
.k-strong rect { fill: var(--surface); stroke: var(--text-2); stroke-width: 1.2; }
.k-logic rect { fill: var(--chip); stroke: var(--line-strong); stroke-width: 0.8; }
.k-plain rect { fill: var(--surface); stroke: var(--line-strong); stroke-width: 1; }
.k-input rect { fill: var(--surface); stroke: var(--line-strong); stroke-dasharray: 4 3; }
.k-decision polygon { fill: var(--surface); stroke: var(--text-2); stroke-width: 1.2; }
.nt { fill: var(--text); font-size: 12px; font-weight: var(--fw-strong); }
.nt.sm { font-size: 11px; }
.ns, .el { fill: var(--text-3); font-family: var(--font-meta); }
.ns { font-size: 9px; }
.el { font-size: 8px; letter-spacing: 0.06em; }
.zone { fill: var(--bg); }
.zl { fill: var(--text-2); font-size: 12px; font-weight: var(--fw-strong); }
.zm { fill: var(--bg); }
.zone.in, .zm.in { fill: var(--surface); }
.zone.in { stroke: var(--line-strong); stroke-width: 0.8; }
.em { fill: var(--surface); }
.em.wash { fill: var(--bg); }
.ln { fill: none; stroke: var(--text-3); stroke-width: 1.2; }
.ln.back { stroke-dasharray: 4 3; }
.ln.retired { stroke: var(--line-strong); stroke-dasharray: 2 3; }
.mk { fill: var(--text-3); }
.rule { stroke: var(--line); }
.lg { fill: var(--text-2); font-size: 12px; }
.note.big { fill: var(--text); font-size: 20px; font-weight: 600; }
.note.big.accent { fill: var(--accent); }
.note.small { fill: var(--text-3); font-family: var(--font-meta); font-size: 9px; }
.note.tag { fill: var(--text-3); font-family: var(--font-meta); font-size: 9px; letter-spacing: 0.06em; }
</style>
</head>
<body>
<div class="bar">
  <h1>g12 · 그린소재 다이어그램 시안</h1>
  <nav>${groups.map((g) => `<a href="#${g.id}">${esc(g.title.ko.split(' · ')[0])}</a>`).join('')}</nav>
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
console.log('wrote g12/index.html');
