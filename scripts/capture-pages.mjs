// Screenshot a served build for before/after copy checks (docs/anti-ai-slop-plan.md 0.5, 5.1, 8.4).
// Dev tool, not part of `npm run build`. Serve a build first (`npm run build`, then `npm run preview`; if a
// preview server is already running, astro prints its URL instead), then:
//   node scripts/capture-pages.mjs --label before [--base http://localhost:4321] [--only legal,cv] [--collapsed]
// Pages: /, /cv/, every case study (/work/<slug>/), 404, each in en and ko, at 1440 and 360 px, light and dark.
// --only keeps pages whose name or path contains one of the comma-separated filters (e.g. /ko/).
// Folded lists and drawers are opened first so every row is in the shot; --collapsed keeps them as served.
// Output in _workspace/shots/<label>/ (not committed): <page>__<lang>__<width>__<theme>__page.png (full page,
// 1x), ...__fig-<nn>-<section>-<kind>.png per figure (2x; at 360 px also --full when the figure scrolls), and
// manifest.json: page overflow (scrollWidth > innerWidth) and SVG <text> that leaves its box (see measure()).
// Names do not depend on the copy, so shots from two labels pair by file name.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';

const ROOT = new URL('../', import.meta.url).pathname;
const { values: opt } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:4321' },
    label: { type: 'string' },
    only: { type: 'string' },
    collapsed: { type: 'boolean', default: false },
  },
});
if (!/^[\w.-]+$/.test(opt.label ?? '')) {
  console.error('[capture] usage: node scripts/capture-pages.mjs --label <name> [--base <url>]');
  process.exit(1);
}
const origin = new URL(opt.base).origin;
const OUT = join(ROOT, '_workspace/shots', opt.label);
const WIDTHS = [
  { width: 1440, height: 900 },
  { width: 360, height: 780 },
];
const THEMES = ['light', 'dark'];

// Case studies: the same rule that builds /work/<slug>/ (featured: true and a caseStudy block).
const DIR = join(ROOT, 'src/content/projects');
const slugs = [];
for (const f of (await readdir(DIR)).filter((f) => f.endsWith('.md')).sort()) {
  const fm = (await readFile(join(DIR, f), 'utf8')).match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (/^featured:\s*true\b/m.test(fm) && /^caseStudy:/m.test(fm)) slugs.push(f.slice(0, -3));
}
const only = opt.only?.split(',').filter(Boolean);
const PAGES = [
  ['home', '/'],
  ['cv', '/cv/'],
  ...slugs.map((s) => [`work-${s}`, `/work/${s}/`]),
  ['404', '/capture-404/'],
]
  .flatMap(([name, path]) => [
    { name, lang: 'en', path },
    { name, lang: 'ko', path: '/ko' + path },
  ])
  .filter((p) => !only || only.some((o) => p.name.includes(o) || p.path.includes(o)));

// Runs in the page. Marks each figure with data-cap and returns its box and checks. SVG text check: each
// <text> belongs to the smallest rect/polygon/circle that holds its anchor point (x, y at mid-glyph), else to
// the viewBox; sides it crosses by more than 1 unit (2 up/down: glyph boxes run taller than the 11-12 unit
// label masks) are reported in viewBox units. Label masks are sized from a per-glyph estimate, so a small
// overrun there is a near miss; a node box (rect inside <g>) is the hard limit.
function measure() {
  const desc = (el) =>
    el.tagName.toLowerCase() +
    (el.id ? '#' + el.id : '') +
    [...el.classList].map((c) => '.' + c).join('') +
    (el.parentElement?.tagName === 'g' && el.parentElement.classList.length
      ? ' in g.' + [...el.parentElement.classList].join('.')
      : '');
  const r1 = (n) => Math.round(n * 10) / 10;
  const vw = innerWidth;
  const sw = document.documentElement.scrollWidth;
  const wide = new Set();
  if (sw > vw)
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (!r.width || r.right <= vw + 0.5) continue;
      let a = el.parentElement;
      while (a && a !== document.body && getComputedStyle(a).overflowX === 'visible')
        a = a.parentElement;
      if (!a || a === document.body) wide.add(el);
    }
  const hscroll = {
    overflow: sw > vw,
    scrollWidth: sw,
    innerWidth: vw,
    // Outermost elements past the right edge (not inside a scroll or clip box).
    offenders: [...wide]
      .filter((el) => !wide.has(el.parentElement))
      .slice(0, 8)
      .map((el) => `${desc(el)} right=${Math.round(el.getBoundingClientRect().right)}`),
  };

  const sel = 'article :is(figure, .cmp, .dom, table.arch)';
  const figs = [...document.querySelectorAll(sel)].filter((f) => !f.parentElement.closest(sel));
  const figures = figs.map((fig, i) => {
    fig.dataset.cap = String(i);
    const box = fig.getBoundingClientRect();
    const region = fig.querySelector('[role="region"]');
    const textOverflow = [];
    const tight = [];
    for (const svg of fig.querySelectorAll('svg[viewBox]')) {
      if (svg.classList.contains('icon')) continue;
      const k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      const canvas = svg.getBoundingClientRect();
      const shapes = [...svg.querySelectorAll('rect, polygon, circle')]
        .filter((s) => !s.closest('defs'))
        .map((s) => ({ s, r: s.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && r.height > 0);
      for (const t of svg.querySelectorAll('text')) {
        const tr = t.getBoundingClientRect();
        const text = t.textContent.trim();
        if (!tr.width || !text) continue;
        const p = svg.createSVGPoint();
        p.x = t.x.baseVal[0]?.value ?? 0;
        p.y = (t.y.baseVal[0]?.value ?? 0) - parseFloat(getComputedStyle(t).fontSize) * 0.35;
        const { x, y } = p.matrixTransform(t.getScreenCTM());
        const own = shapes
          .filter(({ r }) => x >= r.left - 0.5 && x <= r.right + 0.5 && y >= r.top && y <= r.bottom)
          .sort((a, b) => a.r.width * a.r.height - b.r.width * b.r.height)[0];
        const b = own?.r ?? canvas;
        const d = {
          left: (b.left - tr.left) / k,
          right: (tr.right - b.right) / k,
          top: (b.top - tr.top) / k,
          bottom: (tr.bottom - b.bottom) / k,
        };
        const item = { text: text.slice(0, 60), box: own ? desc(own.s) : 'viewBox' };
        if (Math.max(d.left, d.right) > 1 || Math.max(d.top, d.bottom) > 2)
          textOverflow.push({
            ...item,
            ...Object.fromEntries(
              Object.entries(d)
                .filter(([, v]) => v > 0)
                .map(([s, v]) => [s, r1(v)]),
            ),
          });
        // Less than 2 units of side room inside a node box: the next longer wording will cross it.
        else if (own && own.s.closest('g') && Math.max(d.left, d.right) > -2)
          tight.push({ ...item, room: r1(-Math.max(d.left, d.right)) });
      }
    }
    // Text cut off by an overflow box. Screen-reader-only copies (.sr-only, the 1px table heads on phones)
    // are clipped on purpose, so anything inside a box of 1px or less is skipped.
    const shown = (el) => {
      for (let a = el; a && a !== fig; a = a.parentElement) {
        const r = a.getBoundingClientRect();
        if (r.width <= 1 || r.height <= 1) return false;
      }
      return true;
    };
    const clipped = [...fig.querySelectorAll('*')]
      .filter((el) => el !== region && el.scrollWidth > el.clientWidth + 1)
      .filter((el) => /hidden|clip/.test(getComputedStyle(el).overflowX) && shown(el))
      .map(desc);
    return {
      i,
      section: fig.closest('section[id]')?.id ?? 'page',
      kind: fig.classList[0] ?? fig.tagName.toLowerCase(),
      box: { x: box.left + scrollX, y: box.top + scrollY, width: box.width, height: box.height },
      scroll: region ? Math.max(0, region.scrollWidth - region.clientWidth) : 0,
      textOverflow,
      tight,
      clipped,
    };
  });
  const root = document.documentElement;
  return {
    theme: {
      dataTheme: root.dataset.theme ?? null,
      bg: getComputedStyle(document.body).backgroundColor,
    },
    hscroll,
    figures,
  };
}

// Lazy images load and fonts (including the Korean subsets new text pulls in) settle before any shot.
async function settle(page, expand) {
  await page.evaluate(async (expand) => {
    if (expand) {
      for (const d of document.querySelectorAll('details')) d.open = true;
      for (const b of document.querySelectorAll('.toggle-all[aria-expanded="false"]:not([hidden])'))
        b.click();
    }
    const imgs = [...document.images];
    for (const img of imgs) img.loading = 'eager';
    const loaded = (img) =>
      img.complete ||
      new Promise((ok) => ['load', 'error'].forEach((e) => img.addEventListener(e, ok)));
    await Promise.race([Promise.all(imgs.map(loaded)), new Promise((ok) => setTimeout(ok, 10000))]);
    await document.fonts.ready;
  }, expand);
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    scrollTo(0, 0);
    await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
  });
}

const pad = (n) => String(n + 1).padStart(2, '0');
const clip = ({ x, y, width, height }, m = 4) => ({
  x: Math.max(0, x - m),
  y: Math.max(0, y - m),
  width: width + 2 * m,
  height: height + 2 * m,
});

async function shoot(browser, { width, height }, theme) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: theme,
    reducedMotion: 'reduce',
  });
  // The theme a visitor's toggle stores (Base.astro applies it before first paint); colorScheme is the OS side.
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {}
  }, theme);
  // Only the site itself: no visit counter or other third-party requests.
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
  const page = await ctx.newPage();
  const runs = [];
  for (const p of PAGES) {
    const stem = `${p.name}__${p.lang}__${width}__${theme}`;
    for (const f of (await readdir(OUT)).filter((f) => f.startsWith(stem + '__')))
      await rm(join(OUT, f));
    const res = await page.goto(opt.base + p.path, { waitUntil: 'networkidle' });
    const status = res?.status() ?? 0;
    if (status !== (p.name === '404' ? 404 : 200)) throw new Error(`${p.path} returned ${status}`);
    await settle(page, !opt.collapsed);
    const m = await page.evaluate(measure);
    const shot = { animations: 'disabled', fullPage: true };
    await page.screenshot({ ...shot, path: join(OUT, `${stem}__page.png`), scale: 'css' });
    const figures = [];
    for (const f of m.figures) {
      const { i, box: _, ...rest } = f;
      const name = `fig-${pad(i)}-${f.section}-${f.kind}`;
      if (!f.box.width || !f.box.height) {
        figures.push({ name, file: null, full: null, note: 'zero size', ...rest });
        continue;
      }
      const file = `${stem}__${name}.png`;
      await page.screenshot({ ...shot, path: join(OUT, file), clip: clip(f.box) });
      // Narrow screens scroll the drawing inside the figure; --full shows the part past the edge.
      let full = null;
      if (f.scroll > 1 && width < 640) {
        const box = await page.evaluate((i) => {
          const fig = document.querySelector(`[data-cap="${i}"]`);
          fig.querySelector('[role="region"]').style.overflow = 'visible';
          const r = fig.getBoundingClientRect();
          const w = Math.max(
            r.width,
            ...[...fig.querySelectorAll('svg')].map(
              (s) => s.getBoundingClientRect().right - r.left,
            ),
          );
          return { x: r.left + scrollX, y: r.top + scrollY, width: w, height: r.height };
        }, f.i);
        full = `${stem}__${name}--full.png`;
        await page.screenshot({ ...shot, path: join(OUT, full), clip: clip(box) });
        await page.evaluate((i) => {
          document.querySelector(`[data-cap="${i}"] [role="region"]`).style.overflow = '';
        }, f.i);
      }
      figures.push({ name, file, full, ...rest });
    }
    runs.push({
      page: p.name,
      lang: p.lang,
      width,
      theme,
      path: p.path,
      status,
      file: `${stem}__page.png`,
      theme_applied: m.theme,
      hscroll: m.hscroll,
      figures,
    });
    const notes = [
      m.hscroll.overflow && `h-overflow ${m.hscroll.scrollWidth}px`,
      figures.some((f) => f.textOverflow.length) &&
        `text-overflow ${figures.reduce((n, f) => n + f.textOverflow.length, 0)}`,
    ].filter(Boolean);
    console.log(
      `[capture] ${stem}: ${figures.length} fig${notes.length ? '  ' + notes.join(', ') : ''}`,
    );
  }
  await ctx.close();
  return runs;
}

const t0 = Date.now();
await mkdir(OUT, { recursive: true });
try {
  const res = await fetch(opt.base);
  if (!res.ok) throw new Error(`status ${res.status}`);
} catch (err) {
  console.error(
    `[capture] ${opt.base} is not serving (${err.message}). Run npm run preview first.`,
  );
  process.exit(1);
}
const browser = await chromium.launch();
let runs;
try {
  runs = (
    await Promise.all(WIDTHS.flatMap((w) => THEMES.map((theme) => shoot(browser, w, theme))))
  ).flat();
} finally {
  await browser.close();
}

// A partial run (--only) replaces its own entries in an existing manifest and keeps the rest.
const key = (r) => `${r.page}__${r.lang}__${r.width}__${r.theme}`;
const MANIFEST = join(OUT, 'manifest.json');
const old = await readFile(MANIFEST, 'utf8')
  .then((s) => JSON.parse(s).runs)
  .catch(() => []);
const fresh = new Set(runs.map(key));
const all = [...old.filter((r) => !fresh.has(key(r))), ...runs].sort((a, b) =>
  key(a).localeCompare(key(b)),
);
const figs = all.flatMap((r) => r.figures);
const summary = {
  page_shots: all.length,
  figure_shots: figs.filter((f) => f.file).length,
  full_shots: figs.filter((f) => f.full).length,
  hscroll: all.filter((r) => r.hscroll.overflow).map(key),
  text_overflow: all.flatMap((r) =>
    r.figures
      .filter((f) => f.textOverflow.length)
      .map((f) => `${key(r)}__${f.name}: ${f.textOverflow.length}`),
  ),
  clipped: all.flatMap((r) =>
    r.figures.filter((f) => f.clipped.length).map((f) => `${key(r)}__${f.name}`),
  ),
};
await writeFile(
  MANIFEST,
  JSON.stringify(
    { label: opt.label, base: opt.base, updated: new Date().toISOString(), summary, runs: all },
    null,
    2,
  ) + '\n',
);
console.log(
  `[capture] ${runs.length} page runs in ${Math.round((Date.now() - t0) / 1000)}s → ${OUT}\n` +
    `[capture] total ${summary.page_shots} page + ${summary.figure_shots} figure + ${summary.full_shots} full shots; ` +
    `h-overflow ${summary.hscroll.length}, figures with text overflow ${summary.text_overflow.length}`,
);
