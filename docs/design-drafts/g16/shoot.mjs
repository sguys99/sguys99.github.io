// g16 시안 캡처. 저장소 루트에서 python3 -m http.server 4416 상태로 실행. 결과는 g16/shots/.
// 사용: node docs/design-drafts/g16/shoot.mjs [port] [view] [theme] [w]   (기본: en light desk)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [port = '4416', view = 'en', theme = 'light', w = 'desk'] = process.argv.slice(2);
const out = new URL('./shots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: w === 'mob' ? { width: 390, height: 844 } : { width: 1100, height: 900 }, deviceScaleFactor: 2 });
await p.goto(`http://localhost:${port}/docs/design-drafts/g16/?view=${view}&theme=${theme}&w=${w}`);
await p.evaluate(() => document.fonts.ready);
const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
if (over) console.warn('horizontal page overflow');
for (const id of await p.$$eval('.card', (cs) => cs.map((c) => c.id)))
  await p.locator('#' + id).screenshot({ path: `${out}${id}-${view}-${theme}-${w}.png` });
await b.close();
console.log('shots:', out);
