// CV button drafts (tasks 6.12, DESIGN.md 5.1 "활성 상태의 모양 미정").
// Renders the real built sidebar with each variant applied, so the drafts sit in their actual context.
// Usage: npm run build && npx astro preview --port 4410, then
//   node docs/design-drafts/g5/cv-button/shots.mjs http://localhost:4410
// A = outline button (the provisional implementation), B = fifth record row, C = soft accent block.
// Mobile (≤860): the spec hides the CV link; every variant adds it to the end of the compact contact row.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const origin = process.argv[2] ?? 'http://localhost:4410';
const dir = new URL('./', import.meta.url).pathname;
const css = readFileSync(dir + 'variants.css', 'utf8');
const browser = await chromium.launch();

for (const v of ['a', 'b', 'c'])
  for (const lang of ['en', 'ko'])
    for (const theme of ['light', 'dark'])
      for (const [w, h] of [
        [1440, 900],
        [390, 520],
      ]) {
        const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: theme });
        await page.goto(origin + (lang === 'ko' ? '/ko/' : '/'));
        await page.evaluate(
          ({ v, css }) => {
            document.documentElement.dataset.cv = v;
            document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
            const cv = document.querySelector('.sidebar .cv');
            const list = document.querySelector('#side-contact');
            const cid = [...cv.attributes].find((a) => a.name.startsWith('data-astro-cid')).name;
            const lang = document.documentElement.lang;
            // Mobile row item (all variants): icon + short label, like the other contact links.
            const li = document.createElement('li');
            li.className = 'cv-m';
            li.setAttribute(cid, '');
            li.innerHTML = `<a class="v" ${cid} href="${cv.getAttribute('href')}" download>${cv.querySelector('svg').outerHTML}<span class="lbl" ${cid}>CV (PDF)</span></a>`;
            list.append(li);
            if (v === 'b') {
              // Fifth record row: key "CV", value "PDF" + icon, same look as the other rows.
              const row = document.createElement('li');
              row.className = 'cv-row';
              row.setAttribute(cid, '');
              row.innerHTML = `<span class="k" ${cid}>CV</span><a class="v" ${cid} href="${cv.getAttribute('href')}" download><span>${lang === 'ko' ? 'PDF 다운로드' : 'Download PDF'}</span>${cv.querySelector('svg').outerHTML}</a>`;
              li.before(row);
            }
            if (v === 'c') {
              cv.insertAdjacentHTML('beforeend', '<span class="fmt">PDF</span>');
              cv.prepend(cv.querySelector('svg'));
            }
          },
          { v, css },
        );
        const name = `${v}-${lang}-${theme}-${w}`;
        if (w > 860) {
          await page.locator('.sidebar').screenshot({ path: `${dir}shots/${name}.png` });
          await page.locator('.sidebar .cv, .sidebar .cv-row a').first().hover();
          await page.locator('.sidebar').screenshot({ path: `${dir}shots/${name}-hover.png` });
        } else {
          await page.screenshot({ path: `${dir}shots/${name}.png` });
        }
        await page.close();
      }

await browser.close();
