// Responsive QA follow-up drafts (tasks 7.1): CV ≤720, case record table 861–1100, mobile case pager, badge wrap.
// Renders the real built pages with each variant applied (same method as g5/cv-button).
// Usage: npm run build && npx astro preview --port 4410, then
//   node docs/design-drafts/g7/responsive/shots.mjs http://localhost:4410
// Output: shots/<proposal>-<variant>-<lang>-<theme>-<width>.png ("cur" = current build). index.html shows them side by side.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const origin = process.argv[2] ?? 'http://localhost:4410';
const dir = new URL('./', import.meta.url).pathname;
const css = readFileSync(dir + 'variants.css', 'utf8');
mkdirSync(dir + 'shots', { recursive: true });

// proposal key → data attribute, variants, page, widths, element to capture, height
const sets = [
  { key: 'cv', attr: 'cv', vs: ['cur', 'a', 'b', 'c'], page: 'cv/', widths: [360, 390], sel: 'main .sec:nth-of-type(3), main .sec:nth-of-type(5)', h: 900 },
  { key: 'rec', attr: 'rec', vs: ['cur', 'a', 'b', 'c'], page: 'work/docent-humanoid/', widths: [1000], sel: '.sidebar', h: 1000 },
  { key: 'pn', attr: 'pn', vs: ['cur', 'a', 'b', 'c'], page: 'work/docent-humanoid/', widths: [360, 390], sel: '.pn-end', h: 900 },
  { key: 'badge', attr: 'badge', vs: ['cur', 'a'], page: 'work/docent-humanoid/', widths: [1000], sel: '.rec', h: 1000 },
];

const browser = await chromium.launch();
for (const s of sets)
  for (const v of s.vs)
    for (const lang of ['en', 'ko'])
      for (const theme of ['light', 'dark'])
        for (const w of s.widths) {
          const page = await browser.newPage({ viewport: { width: w, height: s.h }, colorScheme: theme });
          await page.goto(origin + (lang === 'ko' ? '/ko/' : '/') + s.page);
          await page.evaluate(
            ({ attr, v, css }) => {
              document.documentElement.dataset[attr] = v;
              document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
              // rec C: chips carry their own boundary, so drop the " ·" separators.
              if (attr === 'rec' && v === 'c')
                document.querySelectorAll('.rec .stk span').forEach((el) => (el.textContent = el.textContent.replace(/\s*·\s*$/, '')));
              // pn C: the words stay for screen readers only.
              if (attr === 'pn' && v === 'c')
                document.querySelectorAll('.pn.end .pn-k').forEach((k) =>
                  k.childNodes.forEach((n) => {
                    if (n.nodeType === 3 && n.textContent.trim()) {
                      const sr = document.createElement('span');
                      sr.className = 'sr-only';
                      sr.textContent = n.textContent;
                      n.replaceWith(sr);
                    }
                  }),
                );
            },
            { attr: s.attr, v, css },
          );
          const name = `${s.key}-${v}-${lang}-${theme}-${w}`;
          const els = page.locator(s.sel);
          if ((await els.count()) > 1) {
            // CV: Experience + Selected Projects in one image (top of the first to bottom of the last).
            const a = await els.first().boundingBox();
            const b = await els.last().boundingBox();
            await page.setViewportSize({ width: w, height: Math.ceil(b.y + b.height) + 40 });
            await page.screenshot({ path: `${dir}shots/${name}.png`, clip: { x: 0, y: a.y, width: w, height: b.y + b.height - a.y } });
          } else {
            await els.first().screenshot({ path: `${dir}shots/${name}.png` });
          }
          await page.close();
        }
await browser.close();
