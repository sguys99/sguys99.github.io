// g15 ⑦ 실서비스 캡처: legalQ에 예시 질문을 넣고 답변이 끝난 화면을 저장한다 (질문 1회 = 일일 제한 1회 사용).
// 헤드리스 환경에 한자 글꼴이 없어, 답변이 끝난 뒤 Noto Sans KR을 보조 글꼴로 덧붙여 다시 그린다(내용은 바꾸지 않음).
// 사용: node docs/design-drafts/g15/capture.mjs <desk|mob> "<질문>" <out-prefix>
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const [dev, q, out] = process.argv.slice(2);
const vp = dev === 'mob' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, locale: 'ko-KR', bypassCSP: true });
const p = await ctx.newPage();
await p.goto('https://legalq.dnotitia.ai/', { waitUntil: 'networkidle' });
await p.screenshot({ path: `${out}-home.png` });
const box = p.locator('textarea').first();
await box.fill(q);
await box.press('Enter');
// 스트리밍 중 한 장 (도구 호출 표시가 있으면 남기려고)
await p.waitForTimeout(6000);
await p.screenshot({ path: `${out}-working.png` });
writeFileSync(`${out}-working.txt`, await p.evaluate(() => document.body.innerText));
let last = -1, still = 0;
for (let i = 0; i < 120 && still < 4; i++) {
  await p.waitForTimeout(2000);
  const n = (await p.evaluate(() => document.body.innerText)).length;
  still = n === last && n > 800 ? still + 1 : 0;
  last = n;
}
await p.addStyleTag({ url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap' });
await p.evaluate(() => {
  for (const el of document.querySelectorAll('body *')) {
    const f = getComputedStyle(el).fontFamily;
    if (!f.includes('Noto Sans KR')) el.style.fontFamily = `${f}, "Noto Sans KR"`;
  }
});
await p.waitForTimeout(1500);
await p.evaluate(() => document.fonts.ready);
const sc = 'div.overflow-y-auto';
await p.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollTop = 0; }, sc);
await p.waitForTimeout(500);
await p.screenshot({ path: `${out}-top.png` });
const H = await p.evaluate((s) => document.querySelector(s)?.scrollHeight ?? 0, sc);
await p.setViewportSize({ width: vp.width, height: Math.min(H + 400, 6000) });
await p.waitForTimeout(800);
await p.screenshot({ path: `${out}-tall.png` });
writeFileSync(`${out}.txt`, await p.evaluate(() => document.body.innerText));
console.log('scrollHeight', H);
await b.close();
