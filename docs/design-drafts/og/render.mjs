// Renders the OG drafts to PNG with Playwright (no project dependency; see DESIGN.md 6.6 for the command).
//   node docs/design-drafts/og/render.mjs          -> draft shots (a,b,c x en/ko x light/dark) into shots/
//   node docs/design-drafts/og/render.mjs --site   -> og-a light only, into public/og-en.png and public/og-ko.png,
//                                                    plus public/favicon.ico (16 + 32 PNGs of public/favicon.svg, light)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const site = process.argv.includes('--site');
// CHROME=<path> reuses an installed Chromium instead of `npx playwright install chromium`.
const browser = await chromium.launch({ executablePath: process.env.CHROME });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const d of site ? ['a'] : ['a', 'b', 'c'])
  for (const lang of ['en', 'ko'])
    for (const theme of site ? ['light'] : ['light', 'dark']) {
      await page.goto(`file://${dir}og-${d}.html?lang=${lang}&theme=${theme}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const out = site
        ? `${dir}../../../public/og-${lang}.png`
        : `${dir}shots/${d}-${lang}-${theme}.png`;
      await page.screenshot({ path: out });
      // Half-size preview (chat-thumbnail check), macOS sips.
      if (!site)
        execFileSync('sips', ['-z', '315', '600', out, '--out', out.replace('.png', '-600.png')], {
          stdio: 'ignore',
        });
    }
if (site) {
  const pub = `${dir}../../../public/`;
  const svg = readFileSync(`${pub}favicon.svg`, 'utf8');
  const pngs = [];
  for (const n of [16, 32]) {
    const p = await browser.newPage({ viewport: { width: n, height: n }, colorScheme: 'light' });
    await p.setContent(
      `<style>*{margin:0}</style><img src="data:image/svg+xml,${encodeURIComponent(svg)}" width="${n}" height="${n}">`,
    );
    pngs.push([n, await p.screenshot({ omitBackground: true })]);
  }
  writeFileSync(`${pub}favicon.ico`, ico(pngs));
}
await browser.close();

// ICO container around PNG images: 6-byte header, 16-byte entry per image, then the PNG data.
function ico(images) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(([n, png], i) => {
    const e = 6 + 16 * i;
    head[e] = n; // width (0 would mean 256)
    head[e + 1] = n;
    head.writeUInt16LE(1, e + 4); // planes
    head.writeUInt16LE(32, e + 6); // bits per pixel
    head.writeUInt32LE(png.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([head, ...images.map(([, png]) => png)]);
}
