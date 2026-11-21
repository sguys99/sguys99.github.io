// g16 구현 확인: 빌드 결과를 띄운 서버에서 케이스 스터디의 세 그림과 홈 Selected Work를 캡처. 결과는 g16/shots/impl/.
// 사용: node docs/design-drafts/g16/verify.mjs [port]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const port = process.argv[2] || '4417';
const out = new URL('./shots/impl/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const views = [
  ['en', 'light', { width: 1280, height: 900 }],
  ['ko', 'dark', { width: 1280, height: 900 }],
  ['ko', 'light', { width: 390, height: 844 }],
  ['en', 'light', { width: 1000, height: 900 }],
];
for (const [lang, theme, vp] of views) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, colorScheme: theme });
  const p = await ctx.newPage();
  const base = `http://localhost:${port}${lang === 'ko' ? '/ko' : ''}`;
  await p.goto(`${base}/work/lotte-ai-masterplan/`);
  await p.evaluate(() => document.fonts.ready);
  const tag = `${lang}-${theme}-${vp.width}`;
  const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (over) console.warn(tag, 'horizontal page overflow');
  for (const sel of ['.ts', '.qd', '.gt']) await p.locator(sel).first().screenshot({ path: `${out}${sel.slice(1)}-${tag}.png` });
  await p.locator('#approach').screenshot({ path: `${out}approach-${tag}.png` });
  await p.screenshot({ path: `${out}top-${tag}.png` });
  await p.goto(`${base}/#work`);
  await p.locator('#work .work').screenshot({ path: `${out}home-work-${tag}.png` });
  await ctx.close();
}
await b.close();
console.log('shots:', out);
