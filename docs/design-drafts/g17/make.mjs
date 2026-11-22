// g17 구분자 시안 비교 페이지: shots/(shoot.mjs 결과)와 manifest.json으로 index.html을 만든다.
// 사용: node docs/design-drafts/g17/make.mjs → docs/design-drafts/g17/index.html
// 보기: 저장소 루트에서 python3 -m http.server 4418 → http://localhost:4418/docs/design-drafts/g17/
// 위쪽 버튼으로 조합(영문/국문, 데스크톱 1280/360, 라이트/다크)을 바꾸면 모든 자리의 캡처가 그 조합으로 바뀐다.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { VARIANTS, TAG_EN, TAG_KO_BASE, tagKo } from './variants.mjs';

const root = new URL('../../../', import.meta.url).pathname;
const here = new URL('./', import.meta.url).pathname;
const tokens = readFileSync(root + 'src/styles/tokens.css', 'utf8');
const fonts = readFileSync(root + 'src/styles/fonts.css', 'utf8').replaceAll("url('/fonts/", "url('/public/fonts/");
const M = JSON.parse(readFileSync(here + 'shots/manifest.json', 'utf8'));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s) => `<code>${esc(s)}</code>`;
// 보이지 않는 공백을 표에서 드러낸다
const show = (s) => esc(s).replaceAll(String.fromCharCode(0x2003), '<span class="ws">[전각 공백]</span>');

const VS = ['base', 'A', 'B', 'C'];
const VNAME = { base: '현재', A: 'A 글자 구분', B: 'B 문장 부호와 말', C: 'C 여백과 선' };
const COMBOS = [
  ['en-light-desk', '영문 1280 라이트'],
  ['ko-dark-desk', '국문 1280 다크'],
  ['ko-light-360', '국문 360 라이트'],
  ['en-dark-360', '영문 360 다크'],
];

// 자리: 성격 번호 (1) 나열 (2) 필드 (3) 문서 제목 (4) 라벨 안 병렬 (5) 빈 날짜
const SPOTS = [
  ['teach', 'Teaching 섹션 제목과 건수 줄', '1', '홈 Teaching. 제목 `Teaching · Books · Advisory`, 오른쪽 건수'],
  ['ip', 'IP 섹션 제목과 서랍 건수 줄', '1', '`지식재산 · 출판물`, `등록 7 · 출원 8`, `등록 8 · 등록 진행 중 2`'],
  ['nav', '상단 탭', '1', '데스크톱만. 국문 탭 `지식재산 · 출판물`. C는 링크 안에 선을 넣지 않고 쉼표'],
  ['menu', '메뉴 시트', '1', '360만. 하위 링크 `강의 · 저서 · 자문`과 탭. C는 링크라 쉼표'],
  ['edu', 'About 학력: 학위와 세부전공', '2', '`M.S. in Electrical Engineering · Control & network optimization`'],
  ['work', 'Selected Work 카드: 로고와 고객, 분야 칩', '2 4', '로고 뒤 `· 롯데정밀화학`, 칩의 국문 분야 이름'],
  ['ledger', '전체 프로젝트 원장: 소속과 고객, 분야와 역량', '1 2 4', '3~10행. 메타 줄 `PwC 컨설팅 · 롯데정밀화학`, 태그 줄'],
  ['filter', '원장 필터 선택 상자', '4', '분야 `석유화학·철강`, 역량 `제어·최적화`를 고른 상태'],
  ['rec', '케이스 스터디 머리: 도슨트', '1', '제목과 기록표. 스택 줄에 `External STT/TTS APIs`(항목 안 슬래시)'],
  ['rec2', '케이스 스터디 머리: 법령 RAG', '1', '스택 줄 5개'],
  ['cmp', '기종 비교: 좁은 칸 라벨', '2', '360만. `AgiBot X2 Ultra · Selected`'],
  ['scr', '실서비스 화면 캡션', '2', '`legalQ live service, captured Nov 21, 2026 · legalq.dnotitia.ai`'],
  ['ss', '표준 구성 그림의 SVG 라벨', '1', '`LLM · STT · TTS` (360은 오른쪽 끝까지 밀어 찍음)'],
  ['cv-head', 'CV 머리: 직함과 현재 소속', '2', '`AI Engineer · Director, R&D Group, GenON`'],
  ['cv-exp', 'CV 경력: 역할', '2', '`GenON, R&D Group — Director / AI Product Engineer`. 모든 안에서 역할을 다음 줄로(인쇄와 같게)'],
  ['cv-proj', 'CV 대표 프로젝트: 소속과 고객, 스택 줄', '1 2', ''],
  ['cv-other', 'CV 기타 프로젝트: 소속과 고객', '2', ''],
  ['cv-pat', 'CV 특허 건수', '1', '`7 registered · 8 filed`'],
  ['cv-sw', 'CV 프로그램 등록: 빈 날짜', '5', '날짜 없는 2건의 `—`'],
  ['cv-teach', 'CV 강의와 자문 제목', '1', '국문 `강의·자문`'],
];

const md = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

// ---------- 안 요약 ----------
let summary = `<table class="t"><thead><tr><th>자리 성격</th>${['A', 'B', 'C']
  .map((v) => `<th>${esc(VNAME[v])}</th>`)
  .join('')}</tr></thead><tbody>`;
const CAT = { 1: '(1) 키워드 나열', 2: '(2) 필드 구분', 3: '(3) 문서 제목', 4: '(4) 라벨 안 병렬', 5: '(5) 빈 날짜' };
for (const k of [1, 2, 3, 4, 5])
  summary += `<tr><th>${CAT[k]}</th>${['A', 'B', 'C']
    .map((v) => `<td><b>EN</b> ${md(VARIANTS[v].rules[k].en)}<br><b>KO</b> ${md(VARIANTS[v].rules[k].ko)}</td>`)
    .join('')}</tr>`;
summary += '</tbody></table>';
const cards = ['A', 'B', 'C']
  .map(
    (v) => `<article class="vc"><h3><span class="key">${v}</span>${esc(VARIANTS[v].name)}</h3>
      <dl><div><dt>의도</dt><dd>${md(VARIANTS[v].intent)}</dd></div><div><dt>장점</dt><dd>${md(VARIANTS[v].pros)}</dd></div><div><dt>단점</dt><dd>${md(VARIANTS[v].cons)}</dd></div></dl></article>`,
  )
  .join('');

// ---------- 자리별 캡처 ----------
const gallery = SPOTS.map(([id, title, cat, note]) => {
  const cells = VS.map((v) => {
    const imgs = COMBOS.map(([c]) => {
      const f = `${id}-${v}-${c}.png`;
      return existsSync(here + 'shots/' + f)
        ? `<img data-c="${c}" src="shots/${f}" alt="${esc(VNAME[v])} ${esc(title)}" loading="lazy">`
        : `<p data-c="${c}" class="none">이 조합에는 없는 자리</p>`;
    }).join('');
    return `<figure class="cell v-${v}"><figcaption>${esc(VNAME[v])}</figcaption>${imgs}</figure>`;
  }).join('');
  return `<section class="spot" id="s-${id}"><h3>${esc(title)} <span class="cat">(${cat.split(' ').join(')(')})</span></h3>${
    note ? `<p class="note">${md(note)}</p>` : ''
  }<div class="cells">${cells}</div></section>`;
}).join('');

// ---------- (3) 문서 문자열 ----------
const S = (page, v, lang) => M.pages[`${page}-${v}-${lang === 'en' ? 'en-light-desk' : 'ko-dark-desk'}`]?.strings ?? {};
const nf = { en: ['Page not found', 'Kwang Myung Yu'], ko: ['페이지를 찾을 수 없습니다', '유광명'] };
const nfTitle = (v, l) => nf[l].join(v === 'base' ? ' · ' : v === 'B' ? ', ' : ' | ');
let strings = '';
for (const l of ['en', 'ko']) {
  const rows = [
    ['홈 `<title>`, og:title', (v) => S('home', v, l).title],
    ['케이스 스터디 `<title>` (도슨트)', (v) => S('docent', v, l).title],
    ['CV `<title>`', (v) => S('cv', v, l).title],
    ['404 `<title>` (계산)', (v) => nfTitle(v, l)],
    ['og:image:alt (모든 쪽)', (v) => S('home', v, l).ogAlt],
    ['CV description', (v) => S('cv', v, l).description],
    ['CV PDF 바닥글 (@page)', (v) => S('cv', v, l).footer],
  ];
  strings += `<h3>${l === 'en' ? '영문' : '국문'}</h3><div class="tw"><table class="t"><thead><tr><th>자리</th>${VS.map(
    (v) => `<th>${esc(VNAME[v])}</th>`,
  ).join('')}</tr></thead><tbody>${rows
    .map(([k, f]) => `<tr><th>${md(k)}</th>${VS.map((v) => `<td>${show(f(v))}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;
}

// ---------- (4) 분야·역량 국문 이름 ----------
const tags = `<div class="tw"><table class="t"><thead><tr><th>영문 값 (모든 안 그대로)</th>${VS.map(
  (v) => `<th>${esc(VNAME[v])}</th>`,
).join('')}</tr></thead><tbody>${TAG_EN.map(
  (e, i) =>
    `<tr${i === 6 ? ' class="gap"' : ''}><th>${esc(e)}</th>${VS.map((v) => `<td>${esc(tagKo(v, e))}</td>`).join('')}</tr>`,
).join('')}</tbody></table></div><p class="note">위 6개는 분야(DOMAINS), 아래 7개는 역량(CAPABILITIES). 바뀌는 것은 ${code(
  Object.values(TAG_KO_BASE).filter((s) => s.includes('·')).length,
)}개.</p>`;

// ---------- PDF ----------
const pdf = ['en', 'ko']
  .map(
    (l) => `<h3>${l === 'en' ? '영문' : '국문'} CV PDF</h3><div class="cells pdf">${VS.map(
      (v) => `<figure class="cell"><figcaption>${esc(VNAME[v])}</figcaption>
        <img src="shots/pdf-${v}-${l}.png" alt="${esc(VNAME[v])} ${l} CV PDF 첫 쪽" loading="lazy" class="pg">
        <img src="shots/pdf-${v}-${l}-last.png" alt="${esc(VNAME[v])} ${l} CV PDF 끝 쪽" loading="lazy" class="pg"></figure>`,
    ).join('')}</div>`,
  )
  .join('');

// ---------- 검사 ----------
const bad = Object.entries(M.pages).filter(([, p]) => p.overflow || p.lineStart.length);
const checks = `<p>페이지 ${Object.keys(M.pages).length}개(5쪽 × 4안 × 4조합): 가로 넘침 ${
  bad.filter(([, p]) => p.overflow).length
}, 줄 머리에 온 쉼표, 슬래시, 세로 막대 ${bad.reduce((n, [, p]) => n + p.lineStart.length, 0)}.</p>
<p>복사 텍스트 표본(360 국문): ${['A', 'B', 'C']
  .map((v) => `${v} ${code(JSON.stringify(M.pages[`docent-${v}-ko-light-360`]?.copy.stack ?? ''))}`)
  .join(', ')}</p>`;

const html = `<!doctype html>
<html lang="ko" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>g17 구분자 시안</title>
<link rel="stylesheet" href="/public/fonts/pretendard/pretendardvariable-dynamic-subset.css">
<style>
${fonts}
${tokens}
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--font-ko); font-size: var(--fs-md); line-height: 1.6; }
.bar { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; gap: var(--sp-2) var(--sp-4); align-items: center; padding: var(--sp-3) var(--sp-4); background: var(--surface); border-bottom: 1px solid var(--line); }
.bar h1 { font-size: var(--fs-md); font-weight: 600; margin-right: auto; }
.seg { display: inline-flex; flex-wrap: wrap; border: 1px solid var(--line-strong); border-radius: 999px; overflow: hidden; }
.seg button { font: inherit; font-size: var(--fs-xs); border: 0; background: none; color: var(--text-2); padding: var(--sp-1) var(--sp-3); cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
.bar nav { display: flex; flex-wrap: wrap; gap: var(--sp-1); width: 100%; }
.bar nav a { font-size: var(--fs-xs); color: var(--text-2); text-decoration: none; padding: 0 var(--sp-1); }
main { max-width: 1440px; margin: 0 auto; padding: var(--sp-5) var(--sp-4) var(--sp-8); }
h2 { font-size: var(--fs-xl); font-weight: 600; margin: var(--sp-7) 0 var(--sp-3); }
h3 { font-size: var(--fs-lg); font-weight: 600; margin: var(--sp-5) 0 var(--sp-2); }
p { max-width: 80ch; }
.intro { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: var(--sp-4) var(--sp-5); font-size: var(--fs-sm); color: var(--text-2); }
.intro ul { padding-left: var(--sp-5); }
.intro b, .intro code { color: var(--text); }
code { font-family: var(--font-meta); font-size: 0.92em; background: var(--chip); padding: 0 var(--sp-1); border-radius: 4px; }
.ws { color: var(--accent); font-size: var(--fs-2xs); }
.vcs { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--sp-3); margin-top: var(--sp-3); }
.vc { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: var(--sp-4); font-size: var(--fs-sm); }
.vc h3 { margin: 0 0 var(--sp-2); display: flex; gap: var(--sp-2); align-items: baseline; }
.key { font-family: var(--font-meta); color: var(--accent); }
.vc dl { display: grid; gap: var(--sp-2); color: var(--text-2); }
.vc dt { color: var(--text-3); font-weight: 600; }
.tw { overflow-x: auto; }
.t { border-collapse: collapse; font-size: var(--fs-sm); margin-top: var(--sp-2); min-width: 640px; }
.t th, .t td { border-bottom: 1px solid var(--line); padding: var(--sp-2) var(--sp-3); text-align: left; vertical-align: top; }
.t thead th { color: var(--text-3); font-weight: 600; }
.t tbody th { font-weight: 600; white-space: nowrap; }
.t tr.gap th, .t tr.gap td { border-top: 2px solid var(--line-strong); }
.spot { border-top: 1px solid var(--line); padding-top: var(--sp-2); margin-top: var(--sp-5); }
.spot h3 { margin-top: var(--sp-2); }
.cat { font-family: var(--font-meta); font-size: var(--fs-xs); color: var(--accent); font-weight: 400; }
.note { font-size: var(--fs-sm); color: var(--text-2); margin-bottom: var(--sp-2); }
.cells { display: grid; grid-template-columns: repeat(auto-fill, minmax(var(--min, 300px), 1fr)); gap: var(--sp-3); }
html[data-w="desk"] .cells:not(.pdf) { --min: 560px; }
.cells.pdf { --min: 300px; }
.cell { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: var(--sp-2); min-width: 0; }
.cell figcaption { font-size: var(--fs-xs); font-weight: 600; color: var(--text-2); margin-bottom: var(--sp-1); }
.cell.v-base figcaption { color: var(--text-3); }
.cell img { display: block; max-width: 100%; height: auto; }
.cell img.pg { border: 1px solid var(--line); margin-top: var(--sp-2); width: 100%; }
.cell [data-c] { display: none; }
${COMBOS.map(([c]) => `html[data-c="${c}"] .cell [data-c="${c}"] { display: block; }`).join('\n')}
.none { font-size: var(--fs-xs); color: var(--text-3); }
</style>
</head>
<body>
<div class="bar">
  <h1>g17 구분자 시안 (계획 단계 2.1)</h1>
  <span class="seg" data-k="c">${COMBOS.map(([c, n]) => `<button data-v="${c}">${esc(n)}</button>`).join('')}</span>
  <nav><a href="#rules">규칙</a><a href="#shots">자리별 캡처</a>${SPOTS.map(([id, t]) => `<a href="#s-${id}">${esc(t.split(':')[0])}</a>`).join('')}<a href="#strings">문서 제목</a><a href="#tags">분야와 역량 이름</a><a href="#pdf">CV PDF</a></nav>
</div>
<main>
<div class="intro">
  <p>빌드된 실제 페이지에 안마다 글자와 CSS를 바꿔 넣고 찍었다(<code>shoot.mjs</code>). src/는 그대로다. 위 버튼으로 조합을 바꾸면 모든 자리가 그 조합으로 바뀐다. 각 칸의 첫째는 지금 화면이다.</p>
  <ul>
    <li><b>모든 안 공통</b>: CV 역할은 화면에서도 인쇄처럼 다음 줄로 내려 기호를 쓰지 않는다(소속에 쉼표, 영문 직함에 슬래시가 있어 어떤 기호도 겹침). og:image:alt는 스크린 리더가 읽으므로 쉼표. 원장 태그는 한 태그가 줄에서 갈라지지 않게 한다(지금은 360 영문에서 <code>& Optimization</code>이 줄 머리에 옴).</li>
    <li>(1)과 (4)의 조합: A는 쉼표 + 붙임 슬래시(<code>LLM 에이전트/RAG, 예측</code>), B는 쉼표 + "와/과"(<code>LLM 에이전트와 RAG, 예측</code>), C는 세로선 + 붙임 슬래시.</li>
  </ul>
</div>
<h2 id="rules">안별 규칙</h2>
<div class="tw">${summary}</div>
<div class="vcs">${cards}</div>
<h2 id="shots">자리별 캡처</h2>
${gallery}
<h2 id="strings">(3) 문서 제목과 화면에 안 보이는 문구</h2>
${strings}
<h2 id="tags">(4) 분야와 역량의 국문 이름</h2>
${tags}
<h2 id="pdf">CV PDF (첫 쪽과 끝 쪽)</h2>
<p class="note">빌드의 scripts/cv-pdf.mjs와 같은 옵션. 첫 쪽에 머리와 역할 줄, 끝 쪽에 바닥글.</p>
${pdf}
<h2>검사</h2>
${checks}
</main>
<script>
const st = { c: 'en-light-desk' };
const q = new URLSearchParams(location.search);
if (q.get('c')) st.c = q.get('c');
function apply() {
  const h = document.documentElement;
  h.dataset.c = st.c;
  h.dataset.w = st.c.endsWith('desk') ? 'desk' : 'mob';
  h.dataset.theme = st.c.includes('dark') ? 'dark' : 'light';
  document.querySelectorAll('.seg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === st.c)));
}
document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { st.c = b.dataset.v; apply(); }));
// 2배율 캡처를 CSS 크기로
document.querySelectorAll('.cell img:not(.pg)').forEach((i) => {
  const fit = () => (i.style.width = i.naturalWidth / 2 + 'px');
  i.complete ? fit() : i.addEventListener('load', fit);
});
apply();
</script>
</body>
</html>`;
writeFileSync(here + 'index.html', html);
console.log('wrote g17/index.html');
