// g15 보조: 실서비스(legalq.dnotitia.ai) 첫 화면 확인용 캡처. 사용: node docs/design-drafts/g15/peek.mjs <url> <out.png> [width] [height]
import { chromium } from 'playwright';
const [url, out, w = '1440', h = '900'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 })).newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.screenshot({ path: out });
console.log(await p.title());
console.log((await p.evaluate(() => document.body.innerText)).slice(0, 1500));
await b.close();
