// 도슨트 휴머노이드 케이스 스터디 다이어그램 시안 생성 (2026-11-21, g13).
// 다른 세션과 dist/를 함께 쓰지 않도록, 빌드된 사이트의 사본(SITE)을 받아 SITE/draft-g13/{en,ko}/<variant>/ 로 쓴다.
// 사용: node docs/design-drafts/g13/make.mjs <SITE> → (SITE에서 정적 서버) → node docs/design-drafts/g13/shoot.mjs <port>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { journeyFig, journeyLint } from './journey.mjs';
import { archFig, archLint } from './arch.mjs';
import { safetyFig, safetyLint } from './safety.mjs';
import { robotFig, roadmapFig } from './robot.mjs';

const site = process.argv[2];
if (!site) throw new Error('usage: make.mjs <site dir>');
const css = readFileSync(new URL('./draft.css', import.meta.url), 'utf8');
const CID = 'data-astro-cid-p5wr5ghm';

export const groups = {
  journey: { title: { en: 'Visitor journey', ko: '관람 동선' }, fig: journeyFig, vs: ['journey-a', 'journey-b', 'journey-c'] },
  arch: { title: { en: 'Architecture', ko: '아키텍처' }, fig: archFig, vs: ['arch-a', 'arch-b', 'arch-c'] },
  safety: { title: { en: 'Safety', ko: '안전 체계' }, fig: safetyFig, vs: ['safety-a', 'safety-b', 'safety-c'] },
  robot: { title: { en: 'Robot selection', ko: '기종 선정' }, fig: robotFig, vs: ['robot-a', 'robot-b', 'robot-c'] },
  roadmap: { title: { en: 'Roadmap', ko: '단계 확장' }, fig: roadmapFig, vs: ['roadmap-a', 'roadmap-b', 'roadmap-c'] },
};

const issues = journeyLint() + archLint() + safetyLint();

mkdirSync(`${site}/draft-g13/img`, { recursive: true });
for (const k of ['g1', 'x2']) copyFileSync(new URL(`./img/${k}.webp`, import.meta.url), `${site}/draft-g13/img/${k}.webp`);

let n = 0;
for (const l of ['en', 'ko']) {
  const src = readFileSync(`${site}/${l === 'ko' ? 'ko/' : ''}work/docent-humanoid/index.html`, 'utf8');
  for (const g of Object.values(groups)) {
    for (const v of g.vs) {
      const t = g.title[l];
      const sec = `<section class="d-sec" id="g13" aria-labelledby="h-g13" ${CID}><span class="no num" aria-hidden="true" ${CID}>05</span><div ${CID}><div class="hd" ${CID}><h2 id="h-g13" ${CID}>${t}</h2></div><div class="g13">${g.fig(v, l, t)}</div></div></section>`;
      let html = src.replace(/<section class="d-sec" id="arch"/, `${sec}$&`);
      html = html.replace('</head>', `<style>${css}</style></head>`);
      const dir = `${site}/draft-g13/${l}/${v}`;
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}/index.html`, html);
      n++;
    }
  }
}
console.log(`${n} drafts in ${site}/draft-g13/ (lint issues: ${issues})`);
