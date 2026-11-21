// g13 시안 캡처. 사이트 사본을 정적 서버로 띄운 상태에서 실행. 결과는 docs/design-drafts/g13/shots/.
// 사용: node docs/design-drafts/g13/shoot.mjs <port> [variants...]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const port = process.argv[2] || '4413';
const all = ['journey', 'arch', 'safety', 'robot', 'roadmap'].flatMap((g) => ['a', 'b', 'c'].map((x) => `${g}-${x}`));
const only = process.argv.slice(3);
const out = new URL('./shots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
// 비교에 쓰는 조합만: 데스크톱 영문 라이트 / 데스크톱 국문 다크 / 모바일 국문 라이트 / 모바일 영문 다크
const combos = [
  ['en', 'light', 'desk'],
  ['ko', 'dark', 'desk'],
  ['ko', 'light', 'mob'],
  ['en', 'dark', 'mob'],
];
const vps = { desk: { width: 1440, height: 900 }, mob: { width: 390, height: 844 } };
const b = await chromium.launch();
for (const v of only.length ? only : all) {
  for (const [l, theme, dev] of combos) {
    const ctx = await b.newContext({ viewport: vps[dev], deviceScaleFactor: 2 });
    await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${port}/draft-g13/${l}/${v}/`);
    await p.addStyleTag({ content: '.topbar{position:static!important}' });
    await p.evaluate(() => document.fonts.ready);
    const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (over) console.warn(`horizontal overflow: ${v} ${l} ${theme} ${dev}`);
    await p.locator('#g13').screenshot({ path: `${out}${v}-${l}-${dev}-${theme}.png` });
    await ctx.close();
  }
}
await b.close();
console.log('shots:', out);
