// 법령 검색 Agentic RAG 케이스 스터디 다이어그램 시안 생성 (2026-11-21, g15).
// 다른 세션과 dist/를 함께 쓰지 않도록, 빌드된 사이트의 사본(SITE)을 받아 SITE/draft-g15/{en,ko}/<variant>/ 로 쓴다.
// 사용: node docs/design-drafts/g15/make.mjs <SITE> → (SITE에서 정적 서버) → node docs/design-drafts/g15/shoot.mjs <port>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { problemFig, problemLint } from './problem.mjs';

const site = process.argv[2];
if (!site) throw new Error('usage: make.mjs <site dir>');
const css = readFileSync(new URL('./draft.css', import.meta.url), 'utf8');
const CID = 'data-astro-cid-p5wr5ghm';

export const groups = {
  problem: { no: '02', title: { en: 'Problem', ko: '문제' }, fig: problemFig, vs: ['problem-a', 'problem-b', 'problem-c'] },
};
const extra = await Promise.all(
  ['map', 'arch', 'flow', 'compare', 'prompt', 'shot'].map((m) => import(`./${m}.mjs`).catch(() => null)),
);
for (const m of extra) if (m?.group) Object.assign(groups, m.group);

const issues = problemLint() + extra.reduce((n, m) => n + (m?.lintAll?.() ?? 0), 0);

mkdirSync(`${site}/draft-g15/img`, { recursive: true });
for (const f of readdirSync(new URL('./img/', import.meta.url))) copyFileSync(new URL(`./img/${f}`, import.meta.url), `${site}/draft-g15/img/${f}`);

let n = 0;
for (const l of ['en', 'ko']) {
  const src = readFileSync(`${site}/${l === 'ko' ? 'ko/' : ''}work/legal-agentic-rag/index.html`, 'utf8');
  for (const g of Object.values(groups)) {
    for (const v of g.vs) {
      const t = g.title[l];
      const sec = `<section class="d-sec" id="g15" aria-labelledby="h-g15" ${CID}><span class="no num" aria-hidden="true" ${CID}>${g.no}</span><div ${CID}><div class="hd" ${CID}><h2 id="h-g15" ${CID}>${t}</h2></div><div class="g15">${g.fig(v, l, t)}</div></div></section>`;
      let html = src.replace(/<section class="d-sec" id="context"/, `${sec}$&`);
      html = html.replace('</head>', `<style>${css}</style></head>`);
      const dir = `${site}/draft-g15/${l}/${v}`;
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}/index.html`, html);
      n++;
    }
  }
}
writeFileSync(`${site}/draft-g15/list.json`, JSON.stringify(Object.values(groups).flatMap((g) => g.vs)));
console.log(`${n} drafts in ${site}/draft-g15/ (lint issues: ${issues})`);
