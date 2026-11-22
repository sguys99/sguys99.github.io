// g17 구분자 시안 캡처: 빌드된 실제 페이지(dist/)를 띄워 두고, 안 A·B·C를 페이지 안에서 적용(글자 교체 + CSS 추가)해 자리별로 찍는다.
// src/는 바꾸지 않는다. 규칙은 variants.mjs, 비교 페이지는 make.mjs.
// 사용:
//   1) 최신 빌드를 서빙한다. 저장소 루트에서 (Node 24) `npm run build` 후 `npm run preview -- --port 4417`
//      (이미 떠 있는 preview가 있으면 그 주소를 쓴다. 기본 http://localhost:4329)
//   2) node docs/design-drafts/g17/shoot.mjs [http://localhost:4417] [--only A,ko-light-360,cv]
//      --only: 안(base,A,B,C), 조합(en-light-desk 등), 페이지(home,docent,legal,genp,cv). --no-pdf: PDF 생략, --keep-pdf: .pdf도 남김
//   3) node docs/design-drafts/g17/make.mjs → docs/design-drafts/g17/index.html
// 결과: shots/<자리>-<안>-<조합>.png, shots/pdf-<안>-<언어>[-last].png(CV PDF 첫 쪽과 끝 쪽, pdftoppm·pdfinfo 필요),
//       shots/manifest.json(가로 넘침, 줄 머리 구분자, 문서 제목·OG alt·description·PDF 바닥글, 복사 텍스트 표본)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { rules } from './variants.mjs';

const args = process.argv.slice(2);
const BASE = (args.find((a) => /^https?:/.test(a)) ?? 'http://localhost:4329').replace(/\/$/, '');
const oi = args.indexOf('--only');
const ONLY = oi >= 0 ? args[oi + 1].split(',') : null;
const PDF = !args.includes('--no-pdf');
const KEEP_PDF = args.includes('--keep-pdf'); // 기본은 PNG만 남기고 .pdf는 지운다(용량)
const keep = (...ks) => !ONLY || ks.some((k) => ONLY.includes(k));
const OUT = new URL('./shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const origin = new URL(BASE).origin;

const COMBOS = [
  { id: 'en-light-desk', lang: 'en', theme: 'light', vp: { width: 1280, height: 900 } },
  { id: 'ko-dark-desk', lang: 'ko', theme: 'dark', vp: { width: 1280, height: 900 } },
  { id: 'ko-light-360', lang: 'ko', theme: 'light', vp: { width: 360, height: 780 } },
  { id: 'en-dark-360', lang: 'en', theme: 'dark', vp: { width: 360, height: 780 } },
];
const VS = ['base', 'A', 'B', 'C'];

// 자리: sel(합집합으로 자름), prep(찍기 전 페이지 조작), only('desk'|'mob'), top(대화상자: 화면 좌표로 자름)
const PAGES = [
  {
    page: 'home',
    path: '/',
    spots: [
      { id: 'teach', sel: ['#teaching .sec-head'] },
      { id: 'ip', sel: ['#ip .sec-head', '#ip .drawers'] },
      { id: 'edu', sel: ['#about .edu'] },
      { id: 'work', sel: ['#work li.proj:has(a[href*="lotte-ai-masterplan"]) .body'] },
      {
        id: 'ledger',
        prep: async (p) =>
          p.evaluate(() => document.querySelector('[aria-controls="pl-list"][aria-expanded="false"]')?.click()),
        sel: ['.pl-row:nth-child(n+3):nth-child(-n+10)'],
      },
      {
        id: 'filter',
        prep: async (p) =>
          p.evaluate(() => {
            const set = (id, v) => {
              const s = document.getElementById(id);
              s.value = v;
              s.dispatchEvent(new Event('change', { bubbles: true }));
            };
            set('pl-d', 'Petrochemical & Steel');
            set('pl-c', 'Control & Optimization');
          }),
        sel: ['.pl-tools', '#pl-list'],
      },
      { id: 'nav', only: 'desk', sel: ['.topbar nav'] },
      {
        id: 'menu',
        only: 'mob',
        top: true,
        prep: async (p) => {
          await p.evaluate(() => scrollTo(0, 0));
          await p.click('.menu-btn');
          await p.waitForTimeout(150);
        },
        sel: ['#sheet .sheet-in'],
      },
    ],
  },
  {
    page: 'docent',
    path: '/work/docent-humanoid/',
    spots: [
      { id: 'rec', sel: ['.cs-title', 'dl.rec'] },
      { id: 'cmp', only: 'mob', sel: ['.cmp tbody tr:nth-child(1)', '.cmp tbody tr:nth-child(2)'] },
    ],
  },
  {
    page: 'legal',
    path: '/work/legal-agentic-rag/',
    spots: [
      { id: 'rec2', sel: ['.cs-title', 'dl.rec'] },
      { id: 'scr', sel: ['.scr figcaption'], pad: 12 },
    ],
  },
  {
    page: 'genp',
    path: '/work/genp-humanoid/',
    spots: [
      {
        id: 'ss',
        prep: async (p) =>
          p.evaluate(() => {
            const r = document.querySelector('.ss .ss-scroll');
            r.scrollLeft = r.scrollWidth;
          }),
        sel: ['.ss .ss-scroll'],
      },
    ],
  },
  {
    page: 'cv',
    path: '/cv/',
    spots: [
      { id: 'cv-head', sel: ['.cv .head'] },
      { id: 'cv-exp', sel: ['#h-experience', '[aria-labelledby="h-experience"] .row:nth-child(-n+2)'] },
      { id: 'cv-proj', sel: ['[aria-labelledby="h-selected"] .row[data-g17-spot]'] },
      { id: 'cv-other', sel: ['#h-other', '[aria-labelledby="h-other"] .row:nth-child(-n+3)'] },
      { id: 'cv-pat', sel: ['#h-patents'] },
      { id: 'cv-sw', sel: ['#h-software', '[aria-labelledby="h-software"] .row:nth-child(-n+3)'] },
      { id: 'cv-teach', sel: ['#h-teaching', '[aria-labelledby="h-teaching"] .row:nth-child(1)'] },
    ],
  },
];

// ---------------------------------------------------------------------------------------------
// 페이지 안에서 실행: 안 R을 적용한다. 바꾼 요소에는 data-g17을 단다(줄 머리 검사 대상).
function apply(R) {
  const NB = String.fromCharCode(0xa0);
  if (R.v === 'base') return;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SPLIT = /\s+·\s+/; // 컴포넌트가 넣은 구분자(앞은 NBSP 또는 공백). 라벨 안 `·`(붙여 씀)는 나누지 않는다
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const mark = (el) => (el.dataset.g17 = '1');
  const sr = (s) => `<span class="sr-only">${s}</span>`;
  const rule = R.mode === 'rule';
  const tag = (s) => R.tags[s.trim()] ?? s.trim();
  const field = (a, b, spec) => (spec.t === 'paren' ? `${a} (${b})` : `${a}${spec.s}${b}`);
  // C: 항목(HTML)을 세로선 목록으로. 숨긴 쉼표가 스크린 리더와 복사 텍스트에 남는다.
  const ruleize = (el, items, cls) => {
    el.classList.add('g17-sl');
    if (cls) el.classList.add(cls);
    el.innerHTML = items
      .map((h, i) => `<span class="g17-i">${h}${i < items.length - 1 ? sr(', ') : ''}</span>`)
      .join('');
    mark(el);
  };

  const css = `
    /* 모든 안: CV 역할은 화면에서도 인쇄처럼 다음 줄 (기호 없이) */
    .cv .row h3 > .sub { display: block; }
    /* C: 세로선 목록. 줄 머리 항목의 선은 왼쪽 밖으로 밀려 잘린다 */
    .g17-sl { display: flex; flex-wrap: wrap; overflow: clip; margin-inline: calc(-1 * var(--sp-2)); }
    a.g17-sl { display: inline-flex; }
    .g17-sl > .g17-i { position: relative; min-width: 0; padding-inline: var(--sp-2); }
    .g17-sl > .g17-i::before, .g17-rl::before, .pl-cap.g17-c .g17-caps > .g17-i::before {
      content: ''; position: absolute; left: -1px; top: 0.3em; bottom: 0.3em;
      border-left: 1px solid var(--line-strong);
    }
    .g17-rl { position: relative; padding-left: var(--sp-2); }
    .g17-nw, .pl-cap .g17-i { white-space: nowrap; }
    .g17-rl::before { left: 0; }
    .g17-nd::before { content: ''; display: inline-block; width: var(--sp-3); vertical-align: middle;
      border-top: 1px solid var(--line-strong); }
    .pl-cap.g17-c .g17-caps { display: inline-flex; flex-wrap: nowrap; overflow: clip;
      margin-inline: calc(-1 * var(--sp-2)); vertical-align: top; }
    .pl-cap.g17-c .g17-caps > .g17-i { position: relative; padding-inline: var(--sp-2); }
    .g17-dl.g17-sl { display: none; }
    .g17-hasdl::before { display: none !important; }
    @container (max-width: 560px) {
      .g17-dl.g17-sl { display: flex; margin-top: var(--sp-1); font-size: var(--fs-2xs); color: var(--text-3); }
      html:lang(ko) .g17-dl.g17-sl { font-size: var(--fs-xs); }
      .g17-dl .sel-w { color: var(--accent); }
    }
    @media (max-width: 560px) {
      ${rule ? '' : `.pl-cap b::after { content: '${R.list}' !important; }`}
      .pl-cap.g17-c { display: flex; flex-wrap: wrap; overflow: clip; margin-inline: calc(-1 * var(--sp-2)); }
      .pl-cap.g17-c > b { position: relative; padding-inline: var(--sp-2); }
      .pl-cap.g17-c > b::after { content: none !important; }
      .pl-cap.g17-c > b::before { content: ''; position: absolute; left: -1px; top: 0.3em; bottom: 0.3em;
        border-left: 1px solid var(--line-strong); }
      .pl-cap.g17-c .g17-caps { display: contents; }
    }`;
  const st = document.createElement('style');
  st.dataset.g17 = R.v;
  st.textContent = css;
  document.head.append(st);

  // (1) 섹션 제목, 탭, 메뉴, CV 제목: 문자열 그대로 바꾸거나(A·B) 세로선 목록(C)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const n of texts) {
    const k = n.nodeValue.trim();
    if (!(k in R.texts)) continue;
    const el = n.parentElement;
    const v = el.closest('a, nav, dialog') && R.linkTexts?.[k] ? R.linkTexts[k] : R.texts[k];
    if (typeof v === 'string') {
      n.nodeValue = n.nodeValue.replace(k, v);
      mark(el);
    } else if (el.childNodes.length === 1) ruleize(el, v.map(esc));
  }

  // (4) 분야·역량 국문 이름: 칩, 원장 분야, 필터 선택 상자
  if (R.lang === 'ko') {
    for (const el of $$('.tag')) el.textContent = tag(el.textContent);
    for (const o of $$('#pl-d option, #pl-c option')) {
      const l = o.dataset.label;
      if (R.tags[l]) {
        o.dataset.label = R.tags[l];
        o.text = o.text.replace(l, R.tags[l]);
      }
    }
  }

  // (1) 건수 줄: Teaching 머리, IP 서랍, CV 특허 머리
  for (const el of $$('#teaching .sec-head .meta, #ip .db, #h-patents small')) {
    const items = el.textContent.split(SPLIT);
    if (items.length < 2) continue;
    if (rule) ruleize(el, items.map(esc));
    else {
      el.textContent = items.join(R.list);
      mark(el);
    }
  }

  // (2) 학력 세부전공: <b>학교</b> 학위 · 세부전공
  for (const p of $$('#about .edu li p')) {
    const t = p.lastChild;
    if (t?.nodeType !== 3 || !SPLIT.test(t.nodeValue)) continue;
    const [deg, focus] = t.nodeValue.split(SPLIT);
    const b = p.querySelector('b').outerHTML;
    if (rule) ruleize(p, [`${b}${esc(deg)}`, esc(focus)]);
    else {
      t.nodeValue = field(deg, focus, R.edu);
      mark(p);
    }
  }

  // (2) 대표 프로젝트 카드: 로고 · 고객
  for (const s of $$('#work .proj-meta .org > span:not(.logo)')) {
    if (!/^·\s/.test(s.textContent)) continue;
    const client = s.textContent.replace(/^·\s+/, '');
    if (R.logo.t === 'rule') {
      s.textContent = client;
      s.classList.add('g17-rl');
    } else if (R.logo.t === 'comma') {
      s.textContent = ', ' + client;
      s.style.marginLeft = 'calc(-1 * var(--sp-2))';
    } else s.textContent = R.logo.s + client;
    mark(s);
  }

  // (2) 원장·CV 메타 줄: 소속 · 고객
  for (const el of $$('.pl-who, .cv .row .meta')) {
    if (!SPLIT.test(el.textContent) || el.children.length) continue;
    const [a, b] = el.textContent.split(SPLIT);
    if (rule) ruleize(el, [esc(a), esc(b)]);
    else {
      el.textContent = field(a, b, R.field);
      mark(el);
    }
  }

  // (1)(4) 원장 태그: <b>분야</b>역량 · 역량
  for (const p of $$('.pl-cap')) {
    const b = p.querySelector('b');
    const caps = p.lastChild.nodeValue.split(SPLIT).map(tag);
    b.textContent = tag(b.textContent);
    if (rule) {
      p.classList.add('g17-c');
      p.lastChild.remove();
      const w = document.createElement('span');
      w.className = 'g17-caps';
      w.innerHTML = caps
        .map((c, i) => `<span class="g17-i">${esc(c)}${i < caps.length - 1 ? sr(', ') : ''}</span>`)
        .join('');
      b.insertAdjacentHTML('beforeend', sr(', '));
      p.append(w);
    } else {
      // 태그는 통째로 줄을 넘긴다(지금은 360px에서 `& Optimization`이 줄 머리에 옴). 쉼표는 앞 태그에 붙인다
      p.lastChild.remove();
      p.insertAdjacentHTML(
        'beforeend',
        caps.map((c, i) => `<span class="g17-nw">${esc(c)}${i < caps.length - 1 ? R.list.trimEnd() : ''}</span>`).join(' '),
      );
    }
    mark(p);
  }

  // (1) 케이스 스터디 기술 스택 줄: <span>이름 NBSP·</span>
  for (const dd of $$('dd.stk')) {
    const spans = $$(':scope > span', dd);
    const items = spans.map((s) => s.textContent.replace(/\s*·$/, ''));
    if (rule) ruleize(dd, items.map(esc));
    else {
      spans.forEach((s, i) => (s.textContent = items[i] + (i < items.length - 1 ? ',' : '')));
      mark(dd);
    }
  }

  // (1) CV 기술 스택 줄: <span>이름</span>NBSP· <span>…
  for (const p of $$('.cv .stack')) {
    const items = $$(':scope > span', p).map((s) => s.textContent);
    if (rule) ruleize(p, items.map(esc));
    else {
      for (const n of [...p.childNodes]) if (n.nodeType === 3 && n.nodeValue.includes('·')) n.nodeValue = ', ';
      mark(p);
    }
  }

  // (2) CV 머리: 직함 · 현재 소속
  for (const el of $$('.cv .head .role')) {
    const [a, b] = el.textContent.trim().split(SPLIT);
    if (rule) ruleize(el, [esc(a), esc(b)]);
    else {
      el.textContent = field(a, b, R.head);
      mark(el);
    }
  }

  // (2) CV 역할: 모든 안에서 기호를 빼고 다음 줄로 (CSS 위)
  if (R.roleLine)
    for (const s of $$('.cv .row h3 > .sub')) s.textContent = s.textContent.replace(/^\s*—\s*/, '');

  // (5) CV 빈 날짜
  for (const w of $$('.cv .when')) {
    if (w.textContent.trim() !== '—') continue;
    w.textContent = '';
    if (R.empty === 'rule') w.classList.add('g17-nd');
  }

  // (2) 기종 비교: 좁은 칸 라벨 "이름 · 선정"
  for (const td of $$('.cmp td[data-l]')) {
    const l = td.dataset.l;
    if (!SPLIT.test(l)) continue;
    const [a, b] = l.split(SPLIT);
    if (rule) {
      td.dataset.l = a;
      td.classList.add('g17-hasdl');
      const s = document.createElement('span');
      s.className = 'g17-dl';
      td.prepend(s);
      ruleize(s, [esc(a), `<span class="sel-w">${esc(b)}</span>`]);
    } else td.dataset.l = field(a, b, R.pick);
  }

  // (2) 실서비스 화면 캡션: 캡션 · <a>host</a>
  for (const fc of $$('.scr figcaption')) {
    const t = fc.firstChild;
    const a = fc.querySelector('a');
    const cap = t.nodeValue.replace(/\s*·\s*$/, '');
    if (rule) ruleize(fc, [esc(cap), a.outerHTML]);
    else if (R.cap.t === 'paren') {
      t.nodeValue = cap + ' (';
      a.after(document.createTextNode(')'));
      mark(fc);
    } else {
      t.nodeValue = cap + R.cap.s;
      mark(fc);
    }
  }

  // (1) 표준 구성 그림의 SVG 라벨 "LLM · STT · TTS"
  for (const t of $$('.ss svg text')) {
    if (t.textContent.trim() !== 'LLM · STT · TTS') continue;
    if (!Array.isArray(R.svg)) {
      t.textContent = R.svg;
      continue;
    }
    const NS = 'http://www.w3.org/2000/svg';
    t.textContent = '';
    R.svg.forEach((w, i) => {
      const s = document.createElementNS(NS, 'tspan');
      if (i) s.setAttribute('dx', '15');
      s.textContent = w;
      t.append(s);
    });
    const y = +t.getAttribute('y');
    let at = 0;
    for (let i = 0; i < R.svg.length - 1; i++) {
      at += R.svg[i].length;
      const x = (t.getEndPositionOfChar(at - 1).x + t.getStartPositionOfChar(at).x) / 2;
      const l = document.createElementNS(NS, 'line');
      Object.entries({ x1: x, x2: x, y1: y - 10, y2: y + 2 }).forEach(([k, v]) => l.setAttribute(k, v));
      l.style.stroke = 'var(--line-strong)';
      t.after(l);
    }
  }

  // (3) 문서 제목, OG, description, PDF 바닥글 (화면에 안 보임 → manifest 표)
  const cvT = R.lang === 'ko' ? '이력서' : 'CV';
  const title = (s) => {
    const p = s.split(' · ');
    return R.title.cv && p[1] === cvT ? p.join(R.title.cv) : p.join(R.title.sep);
  };
  document.title = title(document.title);
  const meta = (q) => document.querySelector(q);
  meta('meta[property="og:title"]')?.setAttribute('content', title(meta('meta[property="og:title"]').content));
  const alt = meta('meta[property="og:image:alt"]');
  alt?.setAttribute('content', alt.content.split(' · ').join(', '));
  for (const d of [meta('meta[name="description"]'), meta('meta[property="og:description"]')]) {
    if (!d || !d.content.includes(' · ')) continue;
    const [n, h, r] = d.content.split(' · ');
    d.setAttribute('content', R.title.cv ? `${n}, ${h} (${r})` : [n, h, r].join(' | '));
  }
  for (const s of $$('style')) {
    const m = s.textContent.match(/(@bottom-left\s*\{\s*content:\s*)("(?:[^"\\]|\\.)*")/);
    if (!m) continue;
    const p = JSON.parse(m[2]).split(' · ');
    const f = R.foot.cv ? `${p[0]}${R.foot.cv}${p[1]}${R.foot.sep}${p[2]}` : p.join(R.foot.sep);
    s.textContent = s.textContent.replace(m[2], JSON.stringify(f));
  }
}

// 페이지 안에서 실행: 가로 넘침, 줄 머리에 온 구분 글자, 문서 문자열, 복사 텍스트 표본
function inspect() {
  const lineStart = [];
  for (const el of document.querySelectorAll('[data-g17]')) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode;
      const s = n.nodeValue;
      for (let i = 1; i < s.length; i++) {
        if (!',/|'.includes(s[i])) continue;
        let j = i - 1;
        while (j >= 0 && /\s/.test(s[j])) j--;
        if (j < 0) continue;
        const r = document.createRange();
        r.setStart(n, i);
        r.setEnd(n, i + 1);
        const a = r.getClientRects()[0];
        r.setStart(n, j);
        r.setEnd(n, j + 1);
        const b = r.getClientRects()[0];
        if (a && b && a.top > b.top + 2) lineStart.push(s.slice(Math.max(0, i - 12), i + 12));
      }
    }
  }
  const sel = getSelection();
  const copy = {};
  for (const [k, q] of [
    ['stack', 'dd.stk'],
    ['who', '.pl-who'],
    ['cap', '.pl-cap'],
    ['role', '.cv .head .role'],
  ]) {
    const el = document.querySelector(q);
    if (!el) continue;
    sel.selectAllChildren(el);
    copy[k] = sel.toString();
  }
  sel.removeAllRanges();
  const m = (q) => document.querySelector(q)?.getAttribute('content') ?? null;
  const foot = [...document.querySelectorAll('style')]
    .map((s) => s.textContent.match(/@bottom-left\s*\{\s*content:\s*("(?:[^"\\]|\\.)*")/)?.[1])
    .find(Boolean);
  return {
    overflow: document.documentElement.scrollWidth > innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    lineStart,
    copy,
    strings: {
      title: document.title,
      ogTitle: m('meta[property="og:title"]'),
      ogAlt: m('meta[property="og:image:alt"]'),
      description: m('meta[name="description"]'),
      footer: foot ? JSON.parse(foot) : null,
    },
  };
}

async function settle(p) {
  await p.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.race([
      Promise.all(
        [...document.images].map(
          (i) => i.complete || new Promise((ok) => ['load', 'error'].forEach((e) => i.addEventListener(e, ok))),
        ),
      ),
      new Promise((ok) => setTimeout(ok, 8000)),
    ]);
    await document.fonts.ready;
  });
  await p.waitForLoadState('networkidle');
  await p.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
  });
}

async function rect(p, sels, top) {
  return p.evaluate(
    ({ sels, top }) => {
      const rs = sels
        .flatMap((s) => [...document.querySelectorAll(s)])
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width && r.height);
      if (!rs.length) return null;
      const dx = top ? 0 : scrollX;
      const dy = top ? 0 : scrollY;
      const x = Math.min(...rs.map((r) => r.left)) + dx;
      const y = Math.min(...rs.map((r) => r.top)) + dy;
      return {
        x,
        y,
        width: Math.max(...rs.map((r) => r.right)) + dx - x,
        height: Math.max(...rs.map((r) => r.bottom)) + dy - y,
      };
    },
    { sels, top },
  );
}

const manifestPath = OUT + 'manifest.json';
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { pages: {}, shots: {} };
const browser = await chromium.launch();
const t0 = Date.now();
for (const c of COMBOS) {
  if (ONLY && COMBOS.some((x) => ONLY.includes(x.id)) && !ONLY.includes(c.id)) continue;
  const ctx = await browser.newContext({
    viewport: c.vp,
    deviceScaleFactor: 2,
    colorScheme: c.theme,
    reducedMotion: 'reduce',
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {}
  }, c.theme);
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  const mob = c.vp.width < 600;
  for (const v of VS) {
    if (ONLY && VS.some((x) => ONLY.includes(x)) && !ONLY.includes(v)) continue;
    for (const pg of PAGES) {
      if (ONLY && PAGES.some((x) => ONLY.includes(x.page)) && !ONLY.includes(pg.page)) continue;
      const url = BASE + (c.lang === 'ko' ? '/ko' : '') + pg.path;
      const res = await p.goto(url, { waitUntil: 'networkidle' });
      if (!res?.ok()) throw new Error(`${url} ${res?.status()}`);
      await settle(p);
      await p.evaluate(apply, rules(v, c.lang));
      if (pg.page === 'cv')
        await p.evaluate(() => {
          const row = [...document.querySelectorAll('[aria-labelledby="h-selected"] .row')].find((r) =>
            r.querySelector('.meta')?.dataset.g17 || /\s·\s/.test(r.querySelector('.meta')?.textContent ?? ''),
          );
          row?.setAttribute('data-g17-spot', '');
        });
      await settle(p);
      const info = await p.evaluate(inspect);
      manifest.pages[`${pg.page}-${v}-${c.id}`] = info;
      const notes = [info.overflow && `OVERFLOW ${info.scrollWidth}`, info.lineStart.length && `line-start ${info.lineStart.length}`]
        .filter(Boolean)
        .join(' ');
      for (const s of pg.spots) {
        if (s.only && s.only !== (mob ? 'mob' : 'desk')) continue;
        if (s.prep) await s.prep(p);
        const r = await rect(p, s.sel, s.top);
        const file = `${s.id}-${v}-${c.id}.png`;
        if (!r) {
          console.warn('  no element', file);
          continue;
        }
        const pad = s.pad ?? 8;
        const clip = {
          x: Math.max(0, r.x - pad),
          y: Math.max(0, r.y - pad),
          width: Math.min(r.width + 2 * pad, (s.top ? c.vp.width : 99999) - Math.max(0, r.x - pad)),
          height: r.height + 2 * pad,
        };
        await p.screenshot({ path: OUT + file, clip, fullPage: !s.top, animations: 'disabled' });
        manifest.shots[file] = { spot: s.id, v, combo: c.id, page: pg.page };
        if (s.top) await p.keyboard.press('Escape');
      }
      console.log(`[g17] ${pg.page} ${v} ${c.id}${notes ? '  ' + notes : ''}`);
    }
  }
  await ctx.close();
}

// CV PDF 1쪽: 인쇄 레이아웃(역할 줄)과 바닥글. 빌드의 scripts/cv-pdf.mjs와 같은 옵션.
if (PDF)
  for (const v of VS) {
    if (ONLY && VS.some((x) => ONLY.includes(x)) && !ONLY.includes(v)) continue;
    for (const lang of ['en', 'ko']) {
      const pg = await browser.newPage({ colorScheme: 'light' });
      await pg.route('**/*', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
      await pg.goto(BASE + (lang === 'ko' ? '/ko' : '') + '/cv/', { waitUntil: 'networkidle' });
      await settle(pg);
      await pg.evaluate(apply, rules(v, lang));
      await settle(pg);
      const stem = `${OUT}pdf-${v}-${lang}`;
      await pg.pdf({ path: stem + '.pdf', preferCSSPageSize: true, printBackground: false, tagged: true });
      try {
        execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-r', '110', '-png', '-singlefile', stem + '.pdf', stem]);
        manifest.shots[`pdf-${v}-${lang}.png`] = { spot: 'pdf', v, combo: lang, page: 'cv' };
      } catch (e) {
        console.warn('pdftoppm failed', e.message);
      }
      // 마지막 쪽(바닥글 확인용)도 한 장
      try {
        const n = +execFileSync('pdfinfo', [stem + '.pdf']).toString().match(/Pages:\s+(\d+)/)[1];
        execFileSync('pdftoppm', ['-f', String(n), '-l', String(n), '-r', '110', '-png', '-singlefile', stem + '.pdf', stem + '-last']);
        manifest.shots[`pdf-${v}-${lang}-last.png`] = { spot: 'pdf-last', v, combo: lang, page: 'cv' };
      } catch {}
      if (!KEEP_PDF) rmSync(stem + '.pdf');
      await pg.close();
      console.log(`[g17] pdf ${v} ${lang}`);
    }
  }
await browser.close();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log(`[g17] done in ${Math.round((Date.now() - t0) / 1000)}s → ${OUT}`);
