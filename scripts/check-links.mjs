// Internal link check over dist/ (tasks 7.7). Runs last in `npm run build`, after cv-pdf.mjs writes the PDFs.
// Fails on: same-origin href/src/srcset/content/CSS url() with no file, #fragment with no id in the target page,
// language links whose current-section anchors are missing in the other language, one-way hreflang pairs.
// External URLs are not checked here (network flakiness); see tasks 7.7. `--self-test` runs the fixture below.
import { statSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SITE = 'https://sguys99.github.io';

// pages: Map(route → html). files: Map(route → text) of sitemap.xml and CSS. has(route) → file exists.
// top: top-level directories of dist/; other absolute same-origin URLs are other repos' Pages sites (external).
export function check(pages, files, has, top) {
  const errors = [];
  const ids = new Map();
  for (const [route, html] of pages)
    ids.set(route, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  const pageOf = (path) => (path.endsWith('/') ? path + 'index.html' : path);

  // Returns the target route of a same-origin URL, or null for external/other schemes.
  const target = (where, raw, base) => {
    const url = new URL(raw, SITE + base);
    if (url.origin !== SITE) return null;
    const dir = url.pathname.match(/^\/([^/]+)\//)?.[1];
    if (raw.startsWith(SITE) && dir && !top.has(dir)) return null;
    const route = pageOf(decodeURIComponent(url.pathname));
    if (!has(route)) {
      errors.push(`${where}: ${raw} → no file ${route}`);
      return null;
    }
    const frag = decodeURIComponent(url.hash.slice(1));
    if (frag && ids.has(route) && !ids.get(route).has(frag))
      errors.push(`${where}: ${raw} → no id="${frag}" in ${route}`);
    return route;
  };

  const alternates = new Map();
  for (const [route, raw] of pages) {
    // Inline scripts and styles hold strings that look like attributes; JSON-LD URLs are not links here.
    const html = raw.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '');
    const base = route.replace(/index\.html$/, '');
    for (const [, attr, val] of html.matchAll(/\s(href|src|srcset|content)="([^"]*)"/g)) {
      if (attr === 'content' && !val.startsWith(SITE)) continue;
      if (attr === 'srcset')
        for (const s of val.split(',')) target(route, s.trim().split(/\s+/)[0], base);
      else if (!/^(mailto|tel|javascript|data):/.test(val)) target(route, val, base);
    }
    // The scroll-spy appends the current section (main > section[id], .d-sec[id]) to [data-lang-alt] links.
    const sections = [
      ...html.matchAll(
        /<section\b[^>]*\sid="([^"]+)"|<[^>]*class="[^"]*\bd-sec\b[^>]*\sid="([^"]+)"/g,
      ),
    ].map((m) => m[1] ?? m[2]);
    for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*data-lang-alt/g)) {
      const to = target(route, href, base);
      for (const id of to && to !== route ? sections : [])
        if (!ids.get(to)?.has(id))
          errors.push(`${route}: language link ${href} lacks section #${id}`);
    }
    const alt = {};
    for (const m of html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/g)) {
      const lang = m[0].match(/hreflang="([^"]+)"/)?.[1];
      const href = m[0].match(/href="([^"]+)"/)?.[1];
      if (lang && href) alt[lang] = target(route, href, base);
    }
    if (alt.en || alt.ko) alternates.set(route, alt);
  }
  // hreflang pairs must point back to each other (en ↔ ko).
  for (const [route, alt] of alternates)
    for (const lang of ['en', 'ko']) {
      const back = alternates.get(alt[lang]);
      if (!alt[lang] || !back || back.en !== alt.en || back.ko !== alt.ko)
        errors.push(`${route}: hreflang ${lang} → ${alt[lang]} does not map back`);
    }

  for (const [route, text] of files) {
    const urls = route.endsWith('.css')
      ? [...text.matchAll(/url\(["']?([^"')]+)/g)]
          .map((m) => m[1])
          .filter((u) => !u.startsWith('data:'))
      : [...text.matchAll(/<loc>([^<]+)<\/loc>|\shref="([^"]+)"/g)].map((m) => m[1] ?? m[2]);
    for (const u of urls) target(route, u, route);
  }
  return errors;
}

if (process.argv.includes('--self-test')) {
  const pages = new Map([
    [
      '/index.html',
      '<a href="#a">ok</a><a href="#nope">bad</a><a href="/ko/#a">ok</a><section id="a"></section><a href="/ko/" data-lang-alt>KO</a><img src="/x.png">',
    ],
    ['/ko/index.html', '<span id="b"></span>'],
  ]);
  const errors = check(pages, new Map(), (r) => pages.has(r), new Set(['ko']));
  const want = ['#nope', '/ko/#a', 'lacks section #a', '/x.png'];
  const miss = want.filter((w) => !errors.some((e) => e.includes(w)));
  if (miss.length || errors.length !== want.length) {
    console.error('[check-links] self-test failed', { errors, miss });
    process.exit(1);
  }
  console.log('[check-links] self-test ok');
  process.exit(0);
}

const DIST = new URL('../dist/', import.meta.url).pathname;
const pages = new Map();
const files = new Map();
for (const f of await readdir(DIST, { recursive: true })) {
  const route = '/' + f.split('\\').join('/');
  if (f.endsWith('.html')) pages.set(route, await readFile(join(DIST, f), 'utf8'));
  else if (f.endsWith('.css') || f === 'sitemap.xml')
    files.set(route, await readFile(join(DIST, f), 'utf8'));
}
const top = new Set(
  (await readdir(DIST, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name),
);
const errors = check(
  pages,
  files,
  (r) => statSync(join(DIST, r), { throwIfNoEntry: false })?.isFile() === true,
  top,
);
if (errors.length) {
  console.error(
    `[check-links] ${errors.length} broken internal link(s):\n  ` + errors.join('\n  '),
  );
  process.exit(1);
}
console.log(`[check-links] ${pages.size} pages, ${files.size} css/xml files: internal links ok`);
