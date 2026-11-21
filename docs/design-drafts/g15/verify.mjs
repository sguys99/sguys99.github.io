// g15 구현 확인: 케이스 페이지 전체를 4가지 조합으로 캡처하고 가로 넘침을 검사한다. 결과는 shots/impl/.
// 사용: node docs/design-drafts/g15/verify.mjs <port> [path]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const port = process.argv[2] || '4416';
const path = process.argv[3] || 'work/legal-agentic-rag/';
const out = new URL('./shots/impl/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const combos = [['en', 'light', 'desk'], ['ko', 'dark', 'desk'], ['ko', 'light', 'mob'], ['en', 'dark', 'mob']];
const vps = { desk: { width: 1440, height: 900 }, mob: { width: 360, height: 780 } };
const b = await chromium.launch();
for (const [l, theme, dev] of combos) {
  const ctx = await b.newContext({ viewport: vps[dev], deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}/${l === 'ko' ? 'ko/' : ''}${path}`);
  await p.addStyleTag({ content: '.topbar{position:static!important}' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => { for (const i of document.querySelectorAll('img')) { i.loading = 'eager'; await i.decode().catch(() => {}); } });
  const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (over > 0) console.warn(`horizontal overflow ${over}px: ${l} ${theme} ${dev}`);
  const name = path.replace(/\W+/g, '-').replace(/-$/, '') || 'home';
  await p.screenshot({ path: `${out}${name}-${l}-${dev}-${theme}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
console.log('impl shots:', out);
