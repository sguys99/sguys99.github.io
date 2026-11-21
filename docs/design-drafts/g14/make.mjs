// GenP 휴머노이드 제품 케이스 스터디 다이어그램 시안 생성 (2026-11-21, g14).
// 다른 세션과 dist/를 함께 쓰지 않도록, 빌드된 사이트의 사본(SITE)을 받아 SITE/draft-g14/{en,ko}/<variant>/ 로 쓴다.
// 사용: node docs/design-drafts/g14/make.mjs <SITE> → (SITE에서 정적 서버) → node docs/design-drafts/g14/shoot.mjs <port>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { coreFig, coreCss, coreLint } from './core.mjs';
import { archFig, archLint } from './arch.mjs';
import { stackFig } from './stack.mjs';
import { loopFig, loopLint } from './loop.mjs';
import { hwFig, hwCss, hwTitle } from './hw.mjs';

const site = process.argv[2];
if (!site) throw new Error('usage: make.mjs <site dir>');
const css = readFileSync(new URL('./draft.css', import.meta.url), 'utf8') + coreCss + hwCss;
const CID = 'data-astro-cid-p5wr5ghm';

export const groups = {
  core: { title: { en: 'Common core and domain profiles', ko: '공통 코어와 도메인 프로파일' }, fig: coreFig, vs: ['core-a', 'core-b', 'core-c'] },
  table: { title: { en: 'Domain profiles', ko: '도메인 프로파일 비교' }, fig: coreFig, vs: ['table-a', 'table-b'] },
  arch: { title: { en: 'Architecture', ko: '아키텍처' }, fig: archFig, vs: ['arch-a', 'arch-b', 'arch-c'] },
  stack: { title: { en: 'From command to torque', ko: '명령에서 토크까지' }, fig: stackFig, vs: ['stack-a', 'stack-b', 'stack-c'] },
  loop: { title: { en: 'Learning loop', ko: '학습 루프' }, fig: loopFig, vs: ['loop-a', 'loop-b', 'loop-c'] },
  hw: { title: { en: hwTitle('en'), ko: hwTitle('ko') }, fig: hwFig, vs: ['hw-a', 'hw-b', 'hw-c'] },
};

const issues = coreLint() + archLint() + loopLint();

mkdirSync(`${site}/draft-g14/img`, { recursive: true });
copyFileSync(new URL('./img/g1.webp', import.meta.url), `${site}/draft-g14/img/g1.webp`);

let n = 0;
for (const l of ['en', 'ko']) {
  const src = readFileSync(`${site}/${l === 'ko' ? 'ko/' : ''}work/genp-humanoid/index.html`, 'utf8');
  for (const g of Object.values(groups)) {
    for (const v of g.vs) {
      const t = g.title[l];
      const sec = `<section class="d-sec" id="g14" aria-labelledby="h-g14" ${CID}><span class="no num" aria-hidden="true" ${CID}>05</span><div ${CID}><div class="hd" ${CID}><h2 id="h-g14" ${CID}>${t}</h2></div><div class="g14">${g.fig(v, l, t)}</div></div></section>`;
      let html = src.replace(/<section class="d-sec" id="arch"/, `${sec}$&`);
      html = html.replace('</head>', `<style>${css}</style></head>`);
      const dir = `${site}/draft-g14/${l}/${v}`;
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}/index.html`, html);
      n++;
    }
  }
}
console.log(`${n} drafts in ${site}/draft-g14/ (lint issues: ${issues})`);
