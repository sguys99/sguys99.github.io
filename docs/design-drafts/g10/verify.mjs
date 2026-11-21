// 구현 확인: 실제 케이스 페이지의 Approach(실험 결과)·Architecture·Service flow를 캡처. 사용: node verify.mjs [port]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const port = process.argv[2] || '4321';
const out = new URL('./verify/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const l of ['en', 'ko']) for (const theme of ['light', 'dark']) for (const [dev, vp] of [['desk', { width: 1440, height: 900 }], ['mob', { width: 360, height: 800 }]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2 });
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`http://localhost:${port}/${l === 'ko' ? 'ko/' : ''}work/lotte-price-forecasting/`);
  await p.addStyleTag({ content: '.topbar{position:static!important}' });
  await p.evaluate(() => document.fonts.ready);
  const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (over > 0) console.warn(`overflow ${over}px: ${l} ${theme} ${dev}`);
  if (errs.length) console.warn(`console errors ${l} ${theme} ${dev}:`, errs);
  for (const id of ['approach', 'arch', 'flow']) await p.locator(`#${id}`).screenshot({ path: `${out}${id}-${l}-${dev}-${theme}.png` });
  if (l === 'en' && theme === 'light' && dev === 'desk') console.log('toc:', await p.$$eval('.toc a', (a) => a.map((x) => x.textContent).join(' | ')));
  await ctx.close();
}
await b.close();
console.log('verify:', out);
