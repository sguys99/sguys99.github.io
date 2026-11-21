// g12 구현 확인: 케이스 페이지의 Problem·Architecture·Service flow 캡처.
// dist 사본을 정적 서버로 띄운 상태에서 실행 (기본 포트 4331). 결과는 g12/shots/impl/.
// 사용: node docs/design-drafts/g12/check.mjs [port]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const port = process.argv[2] || '4331';
const out = new URL('./shots/impl/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const l of ['en', 'ko'])
  for (const theme of ['light', 'dark'])
    for (const [dev, vp] of [
      ['desk', { width: 1440, height: 900 }],
      ['mob', { width: 360, height: 800 }],
    ]) {
      const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1.5 });
      await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
      const p = await ctx.newPage();
      await p.goto(`http://localhost:${port}/${l === 'ko' ? 'ko/' : ''}work/lotte-inventory-blend-optimization/`);
      await p.addStyleTag({ content: '.topbar{position:static!important}' });
      await p.evaluate(() => document.fonts.ready);
      const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (over) console.warn(`horizontal overflow: ${l} ${theme} ${dev}`);
      for (const id of ['problem', 'arch', 'flow'])
        await p.locator('#' + id).screenshot({ path: `${out}${id}-${l}-${theme}-${dev}.png` });
      if (theme === 'light' && dev === 'desk') await p.screenshot({ path: `${out}top-${l}.png` });
      await ctx.close();
    }
await b.close();
console.log('ok');
