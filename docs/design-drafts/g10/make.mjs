// 원자재 가격 예측 케이스 스터디 다이어그램 시안 생성 (2026-11-21, g10).
// dist의 케이스 페이지에 시안을 끼워 dist/draft-g10/{en,ko}/<variant>/ 로 쓴다.
//   arch-*: Architecture 표 자리 / flow-*: Outcome 앞 새 섹션 Service flow / exp-*: Approach 목록 아래
// 순서: npm run build → node docs/design-drafts/g10/make.mjs → npm run preview → node docs/design-drafts/g10/shoot.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { diagrams } from './content.mjs';
import { figure, lint } from './lib.mjs';
import { expA, expB, expC } from './exp.mjs';

const root = new URL('../../../', import.meta.url).pathname;
const css = readFileSync(new URL('./draft.css', import.meta.url), 'utf8');
const CID = 'data-astro-cid-p5wr5ghm';
const title = {
  arch: { en: 'Architecture', ko: '아키텍처' },
  flow: { en: 'Service flow', ko: '서비스 흐름' },
  exp: { en: 'Experiments', ko: '실험' },
};

let issues = 0;
for (const [k, v] of Object.entries(diagrams)) issues += lint(k, v.spec);

const exps = { 'exp-a': expA, 'exp-b': expB, 'exp-c': expC };
const variants = [...Object.keys(diagrams), ...Object.keys(exps)];

for (const l of ['en', 'ko']) {
  const src = readFileSync(`${root}dist/${l === 'ko' ? 'ko/' : ''}work/lotte-price-forecasting/index.html`, 'utf8');
  for (const v of variants) {
    let html = src;
    if (v.startsWith('arch')) {
      const d = diagrams[v];
      html = html.replace(/<table class="tbl arch"[\s\S]*?<\/table>/, `<div class="g10">${figure(d.spec, d.legend, l, title.arch[l])}</div>`);
    } else if (v.startsWith('flow')) {
      const d = diagrams[v];
      const sec = `<section class="d-sec" id="flow" aria-labelledby="h-flow" ${CID}><span class="no num" aria-hidden="true" ${CID}>06</span><div ${CID}><div class="hd" ${CID}><h2 id="h-flow" ${CID}>${title.flow[l]}</h2></div><div class="g10">${figure(d.spec, d.legend, l, title.flow[l])}</div></div></section>`;
      html = html
        .replace(/(<section class="d-sec" id="outcome"[^>]*><span class="no num"[^>]*>)06/, `${sec}$107`);
    } else {
      const at = html.indexOf('</ul>', html.indexOf('id="approach"')) + 5;
      html = html.slice(0, at) + `<div class="g10 g10-exp" id="exp"><h3 ${CID}>${title.exp[l]}</h3>${exps[v](l)}</div>` + html.slice(at);
    }
    html = html.replace('</head>', `<style>${css}</style></head>`);
    const dir = `${root}dist/draft-g10/${l}/${v}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, html);
  }
}
console.log(`drafts: dist/draft-g10/{en,ko}/{${variants.join(',')}}/ (lint issues: ${issues})`);
