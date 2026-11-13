// About 학력 시안 생성 (2026-11-13): dist 홈에 시안 마크업을 넣어 dist/draft-edu-*/ 로 쓴다 (npm run preview 로 열기). 캡처는 shots/. npm run build 후 실행.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const edu = {
  en: [
    { yrs: '2006 – 2008', school: 'KAIST', deg: 'M.S. in Electrical Engineering', focus: 'Control & network optimization', gpa: 'GPA 3.83 / 4.3' },
    { yrs: '1999 – 2006', school: 'Pusan National University', deg: 'B.S., School of Electrical Engineering', focus: '', gpa: 'GPA 4.09 / 4.5' },
  ],
  ko: [
    { yrs: '2006 – 2008', school: 'KAIST (한국과학기술원)', deg: '전기 및 전자공학 공학석사', focus: '세부전공: 제어 최적화·네트워크 최적화', gpa: 'GPA 3.83 / 4.3' },
    { yrs: '1999 – 2006', school: '부산대학교', deg: '전기전자통신공학부 공학사', focus: '', gpa: 'GPA 4.09 / 4.5' },
  ],
};
const label = { en: 'Education', ko: '학력' };
const c = 'data-astro-cid-oxgmilyn';

const variants = {
  // A: 숫자 표 자리에 2칸 띠. 학교명이 숫자처럼 크게.
  a: (l) => `<dl class="dx-a" aria-label="${label[l]}">${edu[l].map((e) => `
    <div><dt>${e.school}</dt><dd class="d">${e.deg}${e.focus ? `<br><span class="f">${e.focus}</span>` : ''}</dd><dd class="m num">${e.yrs}&nbsp;· ${e.gpa}</dd></div>`).join('')}
  </dl>`,
  // B: 역량 표의 첫 행으로 흡수. 새 모양 없음.
  b: (l) => `<!--B-->`,
  // C: 작은 머리표 + 연도 | 학교·학위 | GPA 3열 원장.
  c: (l) => `<section class="dx-c" aria-label="${label[l]}"><p class="eb">${label[l]}</p><ul>${edu[l].map((e) => `
    <li><span class="y num">${e.yrs}</span><div><b>${e.school}</b><span class="d">${e.deg}${e.focus ? ` · ${e.focus}` : ''}</span></div><span class="g num">${e.gpa}</span></li>`).join('')}
  </ul></section>`,
};

const css = `<style>
.dx-a{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:var(--sp-6);border-top:1px solid var(--line)}
.dx-a>div{padding:var(--sp-4) var(--sp-4) 0;border-left:1px solid var(--line);min-width:0}
.dx-a>div:first-child{border-left:0;padding-left:0}
.dx-a dt{font-family:var(--font-display);font-size:var(--fs-xl);font-weight:var(--fw-medium);line-height:1.2;color:var(--text)}
.dx-a .d{margin-top:var(--sp-1);font-size:var(--fs-sm);color:var(--text-2)}
.dx-a .f{color:var(--text-3)}
.dx-a .m{margin-top:var(--sp-1);font-family:var(--font-meta);font-size:var(--fs-2xs);color:var(--text-3)}
.dx-a+.skills{margin-top:var(--sp-5)}
.dx-c{margin-top:var(--sp-6)}
.dx-c .eb{font-family:var(--font-meta);font-size:var(--fs-xs);letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--sp-2)}
.dx-c ul{list-style:none;border-top:1px solid var(--line)}
.dx-c li{display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:var(--sp-4);align-items:baseline;padding:var(--sp-3) 0;border-bottom:1px solid var(--line)}
.dx-c .y,.dx-c .g{font-family:var(--font-meta);font-size:var(--fs-xs);color:var(--text-3)}
.dx-c b{font-size:var(--fs-sm);font-weight:var(--fw-strong);margin-right:var(--sp-2)}
.dx-c .d{font-size:var(--fs-sm);color:var(--text-2)}
.dx-c li:last-child{border-bottom:0}
.dx-c+.skills{margin-top:var(--sp-4)}
@media (max-width:560px){
 .dx-a{grid-template-columns:minmax(0,1fr)}
 .dx-a>div{border-left:0;padding-left:0}
 .dx-a>div+div{border-top:1px solid var(--line);margin-top:var(--sp-4)}
 .dx-c li{grid-template-columns:minmax(0,1fr);gap:var(--sp-0)}
}
</style>`;

for (const l of ['en', 'ko']) {
  const src = readFileSync(`dist/${l === 'en' ? '' : 'ko/'}index.html`, 'utf8');
  for (const [k, f] of Object.entries(variants)) {
    let out = src.replace('</head>', css + '</head>');
    if (k === 'b') {
      const rows = edu[l].map((e) => `${e.school} — ${e.deg}${e.focus ? ` (${e.focus})` : ''}, <span class="num" style="font-family:var(--font-meta);font-size:var(--fs-xs);color:var(--text-3);white-space:nowrap">${e.yrs}&nbsp;· ${e.gpa}</span>`).join('<br>');
      out = out.replace(`<dl class="skills" ${c}>`, `<dl class="skills" ${c}><div ${c}><dt ${c}>${label[l]}</dt><dd ${c}>${rows}</dd></div>`);
    } else {
      out = out.replace(`<dl class="skills" ${c}>`, f(l) + `<dl class="skills" ${c}>`);
    }
    const dir = `dist/draft-edu-${k}${l === 'ko' ? '-ko' : ''}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, out);
  }
}
