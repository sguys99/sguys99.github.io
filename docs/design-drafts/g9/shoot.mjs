// g9 시안 캡처: npm run preview(4321) 상태에서 실행. 결과는 docs/design-drafts/g9/shots/.
// 사용: node docs/design-drafts/g9/shoot.mjs [port] [variants...]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const port = process.argv[2] || '4321';
const only = process.argv.slice(3);
const out = new URL('./shots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const v of only.length ? only : ['a', 'b', 'c']) {
  for (const l of ['en', 'ko']) {
    for (const theme of ['light', 'dark']) {
      for (const [dev, vp] of [
        ['desk', { width: 1440, height: 900 }],
        ['mob', { width: 390, height: 844 }],
      ]) {
        const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2 });
        await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
        const p = await ctx.newPage();
        await p.goto(`http://localhost:${port}/draft-arch/${l}/${v}/`);
        await p.addStyleTag({ content: '.topbar{position:static!important}' });
        await p.evaluate(() => document.fonts.ready);
        const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (over) console.warn(`horizontal overflow: ${v} ${l} ${theme} ${dev}`);
        await p.locator('#arch').screenshot({ path: `${out}${v}-${l}-${dev}-${theme}.png` });
        await ctx.close();
      }
    }
  }
}
await b.close();
console.log('shots:', out);
