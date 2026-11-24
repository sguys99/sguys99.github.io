// Copy checks for the AI-trace cleanup (docs/anti-ai-slop-plan.md, step 0.4). Reads the content sources directly:
// src/content/*.yaml, diagrams/*.yaml, projects/ and personal/ frontmatter. YAML keys and comments are not text.
// Usage: node scripts/check-text.mjs [mode]
//   (default)                     rejects em dashes and unapproved middle dots in content, UI and built HTML/CSS.
//   --dump <en|ko> [--pairs]      every en (or ko) string as `file  key.path  text`; --pairs: en and ko together
//   --report [--json] [--detail]  plan 4 counts per file and in total: dashes, middle dots, Korean endings ①–④,
//                                 contrast ("아닌", ", not"), "from X to Y", colons, semicolons, buzzwords; then the
//                                 UI and component lines with — or · outside comments. --detail lists every hit
//                                 (all but the target ending ①) with its key path and context.
//   --facts <commit>              compares numbers, dates, and Latin-script names per key path with <commit>
//                                 (plan 5.8) and exits 1 on any difference. Run after each rewrite batch.
//   --self-test                   runs the fixtures at the end of this file.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { distCopy } from './dist-copy.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const TAG = '[check-text]';

// --- Content sources ----------------------------------------------------------------------------

// Display order: top-level YAML, projects, personal, diagrams (paths relative to the repo root).
const GROUPS = [
  /^src\/content\/[^/]+\.yaml$/,
  /^src\/content\/projects\/.+\.md$/,
  /^src\/content\/personal\/.+\.md$/,
  /^src\/content\/diagrams\/[^/]+\.yaml$/,
  /^src\/content\/.+\.(?:ya?ml|md)$/,
];
const order = (paths) =>
  paths
    .map((p) => [GROUPS.findIndex((g) => g.test(p)), p])
    .filter(([g]) => g >= 0)
    .sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1))
    .map(([, p]) => p);
const workPaths = () =>
  order(
    readdirSync(join(ROOT, 'src/content'), { recursive: true }).map(
      (f) => 'src/content/' + f.split('\\').join('/'),
    ),
  );

const load = (path, src) =>
  parse(path.endsWith('.md') ? (src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '') : src);

// Every string value as { path, text, lang }; lang is '' for language-neutral strings (stack items, years, ids).
function flatten(doc) {
  const items = [];
  let pairs = 0;
  const walk = (v, path) => {
    if (typeof v === 'string')
      items.push({ path, text: v, lang: /\.(en|ko)$/.exec(path)?.[1] ?? '' });
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === 'object') {
      if (typeof v.en === 'string' && typeof v.ko === 'string') pairs++;
      for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k);
    }
  };
  walk(doc, '');
  return { items, pairs };
}

const readWork = (p) => readFileSync(join(ROOT, p), 'utf8');
const content = (paths, read) =>
  paths.map((p) => ({ file: p.slice('src/content/'.length), ...flatten(load(p, read(p))) }));

// --- Counts (plan 4) ----------------------------------------------------------------------------

// Words and phrases from .claude/skills/antislop-copywriting (Empty AI Vocabulary, Significance Inflation, Empty
// Claims, Persuasive Authority, Temporal Runway, Filler Phrases, Generic Conclusion) and core rule R-16 it cites,
// plus "leverage" from plan 4.3.
const BUZZ_WORDS = [
  'unlock',
  'elevate',
  'empower',
  'delve',
  'showcase',
  'testament',
  'landscape',
  'journey',
  'robust',
  'seamless',
  'seamlessly',
  'revolutionary',
  'revolutionize',
  'revolutionizing',
  'intelligent',
  'ultimate',
  'powerful',
  'effortless',
  'effortlessly',
  'pivotal',
  'fundamentally',
  'leverage',
];
const BUZZ_PHRASES = [
  'game changer',
  'next level',
  'cutting edge',
  'AI powered',
  'next generation',
  'the future of',
  'a new era',
  'industry leading',
  'world class',
  'trusted by',
  'at its core',
  'the real question',
  'what really matters',
  'the deeper issue',
  'the heart of the matter',
  "in today's",
  'fast paced',
  'ever evolving',
  'in an era of',
  'increasingly connected',
  'in order to',
  'due to the fact that',
  'at this point in time',
  'it is important to note',
  'the future looks bright',
  'exciting times',
  'let that sink in',
  'the takeaway is',
];
const BUZZ = new RegExp(
  `\\b(?:(?:${BUZZ_WORDS.join('|')})(?:s|es|d|ed|ing|ly|ness)?|${BUZZ_PHRASES.map((p) =>
    p.replace(/ /g, '[\\s-]+'),
  ).join('|')})\\b`,
  'gi',
);

// "from X to Y" inside one clause; numeric when X and the first words of Y both hold a number (12 to 3,046).
const FROM_TO =
  /\bfrom\s+((?:[^.;:,()!?\n]|[.,](?=\d)){1,80}?)\s+to\s+((?:[^.;:,()!?\n]|[.,](?=\d)){1,40})/gi;
const NUMBER = /\d|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|half)\b/i;
// After an en dash that closes a range: a digit, #n, a quarter, a month and year, Present, or the end (`2026 –`).
const RANGE_END =
  /^(?:\d|#\d|Q\d|Present\b|현재|$|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w* \d)/;
const ALIKE = /[\u318D\u2022\u2027\u30FB]/g; // ㆍ • ‧ ・

// Korean endings. ③ is the nominal ~ㅁ form (함, 음, 됨, 임, ...), ④ ends in 다. Heuristic: nouns that end in the
// same syllables are listed below; any other noun ending in them (사람, 시스템 do not) reads as ③, a false positive.
const KO_M = /(?:함|음|됨|임|짐|킴|냄|줌|옴|앰|룸|춤|둠|뀜|봄|김|움|꿈|듦|씀|뺌|남|림)$/;
const KO_M_NOUNS = [
  ...['결함', '포함', '다음', '처음', '마음', '소음', '녹음', '잡음', '모음', '묶음', '이음'],
  ...['웃음', '울음', '믿음', '물음', '걸음', '얼음', '게임', '프레임', '타임', '네임', '모임'],
  ...['도움', '맞춤', '어둠', '알림', '스트림', '강남'],
];
const KO_M_SINGLE = new Set(['꿈', '봄', '김', '춤', '남', '림']);
const CLOSE = /[\s.!?…)\]}"'”’」』》〉]+$/u;

function sentenceKind(s) {
  const w = s
    .replace(CLOSE, '')
    .split(/[\s([{"'“‘「『《〈·,/]/)
    .pop();
  if (w.length > 1 && w.endsWith('다') && w !== '바다') return 4;
  if (KO_M.test(w) && !KO_M_SINGLE.has(w) && !KO_M_NOUNS.some((n) => w.endsWith(n))) return 3;
  return 0;
}

// cls 1–4 as plan 4.2 (④ beats ③ beats the period check), mixed: sentences end differently,
// prd: breaks "one sentence: no period, two or more: a period each" (plan 2), at: end of the deciding sentence.
function koEnding(text) {
  const t = text.trim();
  const ends = [...t.matchAll(/(?<=[.!?])\s+/g)]
    .filter((m) => !/\b(?:vol|no|art|pp|vs|e\.g|i\.e)\.$/i.test(t.slice(0, m.index)))
    .map((m) => [m.index, m.index + m[0].length]);
  const sents = [];
  let start = 0;
  for (const [a, b] of ends) (sents.push([start, a]), (start = b));
  sents.push([start, t.length]);
  const kinds = sents.map(([a, b]) => [sentenceKind(t.slice(a, b)), b]);
  const period = t.replace(/[\s)\]}"'”’」』》〉]+$/u, '').endsWith('.');
  const worst = kinds.find((k) => k[0] === 4) ?? kinds.find((k) => k[0] === 3);
  return {
    cls: worst ? worst[0] : period ? 2 : 1,
    mixed: new Set(kinds.map((k) => k[0])).size > 1,
    prd: kinds.length === 1 ? period : !period,
    at: worst ? worst[1] : t.length,
  };
}

// Calls hit(key, at, len) for every signal in one string. Keys are the FIELDS below.
function analyze(s, lang, hit) {
  for (const m of s.matchAll(/\u2014/g)) hit('em', m.index, 1);
  for (const m of s.matchAll(/\u2013/g)) {
    const range = /\d$/.test(s.slice(0, m.index).trimEnd());
    hit(
      range && RANGE_END.test(s.slice(m.index + 1).trimStart()) ? 'enRange' : 'enJoin',
      m.index,
      1,
    );
  }
  for (const m of s.matchAll(/\u00b7/g)) {
    const unit =
      /(?:^|[^A-Za-z])N$/.test(s.slice(0, m.index)) && /^m(?![A-Za-z])/.test(s.slice(m.index + 1));
    hit(unit ? 'unitNm' : ({ en: 'midEn', ko: 'midKo' }[lang] ?? 'midOther'), m.index, 1);
  }
  for (const m of s.matchAll(ALIKE)) hit('alike', m.index, 1);
  if (!lang) return;
  const L = lang === 'en' ? 'En' : 'Ko';
  for (const m of s.matchAll(/:/g))
    if (!/\d:\d/.test(s.slice(m.index - 1, m.index + 2)) && !s.startsWith('//', m.index + 1))
      hit('colon' + L, m.index, 1);
  for (const m of s.matchAll(/;/g)) hit('semi' + L, m.index, 1);
  if (lang === 'ko') {
    for (const m of s.matchAll(/아니라|아닌(?!지)/g)) hit('koNot', m.index, m[0].length);
    const e = koEnding(s);
    // Plan 4.2 counts strings of 25+ characters; ③ ④ in shorter ones (decision titles, labels) are counted apart.
    if ([...s].length < 25) {
      if (e.cls > 2) hit('endShort', e.at, 0);
      return;
    }
    hit('ko25', 0, 0);
    hit('end' + e.cls, e.at, 0);
    if (e.mixed) hit('mixed', e.at, 0);
    if (e.prd) hit('period', s.length, 0);
    return;
  }
  for (const m of s.matchAll(/,\s+not\s(?!only\b)/gi)) hit('enNot', m.index, m[0].length);
  for (const m of s.matchAll(/\bnot only\b/gi)) hit('enNotOnly', m.index, m[0].length);
  for (const m of s.matchAll(/\brather than\b/gi)) hit('enRather', m.index, m[0].length);
  for (const m of s.matchAll(FROM_TO)) {
    const y = m[2].trim().split(/\s+/).slice(0, 5).join(' ');
    hit(NUMBER.test(m[1]) && NUMBER.test(y) ? 'fromNum' : 'fromOther', m.index, m[0].length);
  }
  for (const m of s.matchAll(BUZZ)) hit('buzz', m.index, m[0].length);
}

const FIELDS = {
  pairs: 'en/ko pairs',
  enChars: 'en characters',
  koChars: 'ko characters',
  em: 'em dash',
  enRange: 'en dash, range',
  enJoin: 'en dash, joining',
  midEn: 'middle dot, en',
  midKo: 'middle dot, ko',
  midOther: 'middle dot, language-neutral string',
  unitNm: 'N·m unit (kept)',
  alike: 'middle dot lookalike (ㆍ • ‧ ・)',
  ko25: 'ko strings of 25+ characters',
  end1: 'ko ending ① noun, no period',
  end2: 'ko ending ② noun with period',
  end3: 'ko ending ③ ~함/~음/~됨/~임',
  end4: 'ko ending ④ ~다',
  endShort: 'ko ending ③ or ④ in strings under 25 characters',
  mixed: 'ko sentences ending differently in one string',
  period: 'ko period rule broken (one sentence with ".", or several without)',
  koNot: 'ko 아닌/아니라',
  enNot: 'en ", not"',
  enNotOnly: 'en "not only"',
  enRather: 'en "rather than"',
  fromNum: 'en "from X to Y", numeric',
  fromOther: 'en "from X to Y", other',
  colonEn: 'en colon',
  colonKo: 'ko colon',
  semiEn: 'en semicolon',
  semiKo: 'ko semicolon',
  buzz: 'en buzzword',
};
const UNLISTED = new Set(['pairs', 'enChars', 'koChars', 'ko25', 'end1']);

function measure(files) {
  const rows = [];
  const hits = [];
  for (const { file, items, pairs } of files) {
    const row = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, 0]));
    row.pairs = pairs;
    for (const { path, text, lang } of items) {
      if (lang) row[lang + 'Chars'] += [...text].length;
      analyze(text, lang, (key, at, len) => {
        row[key]++;
        if (!UNLISTED.has(key)) hits.push({ key, file, path, at, len, text });
      });
    }
    rows.push({ file, ...row });
  }
  const total = Object.fromEntries(
    Object.keys(FIELDS).map((k) => [k, rows.reduce((n, r) => n + r[k], 0)]),
  );
  return { rows, total, hits };
}

// --- UI and component sources -------------------------------------------------------------------

// Blanks comments, keeping line breaks: // and /* */ in script, /* */ in CSS, <!-- --> and {/* */} in Astro markup.
// Heuristic scanner: strings, template literals, and regex literals are skipped so "//" inside them is not a comment.
function stripComments(src, mode) {
  const out = src.split('');
  const n = src.length;
  const blank = (a, b) => {
    for (let k = a; k < b; k++) if (src[k] !== '\n') out[k] = ' ';
  };
  const comment = (i, end) => {
    const line = src[i + 1] === '/';
    const e = line ? src.indexOf('\n', i) : src.indexOf('*/', i + 2);
    const stop = e < 0 ? end : Math.min(end, line ? e : e + 2);
    blank(i, stop);
    return stop;
  };
  const quoted = (i, q) => {
    for (i++; i < n && src[i] !== q && src[i] !== '\n'; i++) if (src[i] === '\\') i++;
    return i + 1;
  };
  const template = (i, end) => {
    while (i < end && src[i] !== '`')
      if (src[i] === '\\') i += 2;
      else if (src[i] === '$' && src[i + 1] === '{') i = script(i + 2, end, true) + 1;
      else i++;
    return i + 1;
  };
  // With brace, stops at the unmatched "}" (end of an Astro {expression}) and returns its index.
  const script = (i, end, brace) => {
    let depth = 0;
    let prev = '';
    while (i < end) {
      const c = src[i];
      if (c === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) i = comment(i, end);
      else if (c === "'" || c === '"') ((i = quoted(i, c)), (prev = c));
      else if (c === '`') ((i = template(i + 1, end)), (prev = c));
      else if (c === '/' && (prev === '' || '(,=:[!&|?{};+-*%~^'.includes(prev))) {
        let cls = false;
        for (i++; i < end && src[i] !== '\n'; i++)
          if (src[i] === '\\') i++;
          else if (src[i] === '[') cls = true;
          else if (src[i] === ']') cls = false;
          else if (src[i] === '/' && !cls) break;
        i++;
        prev = '/';
      } else {
        if (c === '{') depth++;
        else if (c === '}' && depth-- === 0 && brace) return i;
        if (!/\s/.test(c)) prev = c;
        i++;
      }
    }
    return i;
  };
  const css = (i, end) => {
    while (i < end)
      if (src[i] === '/' && src[i + 1] === '*') i = comment(i, end);
      else if (src[i] === '"' || src[i] === "'") i = quoted(i, src[i]);
      else i++;
  };
  const markup = (i, end) => {
    while (i < end) {
      const tag = /^<(script|style)\b/.exec(src.slice(i, i + 8))?.[1];
      if (src.startsWith('<!--', i)) {
        const e = src.indexOf('-->', i);
        const stop = e < 0 ? end : e + 3;
        blank(i, stop);
        i = stop;
      } else if (src[i] === '{') i = script(i + 1, end, true) + 1;
      else if (tag) {
        // The open tag may hold {expressions} (define:vars); a self-closing tag has no body.
        let j = i + 1;
        while (j < end && src[j] !== '>') j = src[j] === '{' ? script(j + 1, end, true) + 1 : j + 1;
        const close = src.indexOf(`</${tag}`, j);
        const stop = src[j - 1] === '/' ? j + 1 : close < 0 ? end : close;
        if (src[j - 1] !== '/') (tag === 'style' ? css : script)(j + 1, stop, false);
        i = stop;
      } else i++;
    }
  };
  if (mode === 'css') css(0, n);
  else if (mode === 'js') script(0, n, false);
  else {
    const fm = /^---\r?\n[\s\S]*?\r?\n---/.exec(src);
    if (fm) script(3, fm[0].length - 3, false);
    markup(fm ? fm[0].length : 0, n);
  }
  return out.join('');
}

// Literal characters, \u escapes, HTML entities, and CSS escapes of each mark.
const UI_MARKS = [
  ['—', /\u2014|\\u2014|&mdash;|&#8212;|&#x2014;|\\0*2014(?![0-9a-f])/gi],
  ['·', /\u00b7|\\u00b7|&middot;|&#183;|&#xb7;|\\0*b7(?![0-9a-f])/gi],
  ['lookalike', /[\u318D\u2022\u2027\u30FB]|\\u(?:318d|2022|2027|30fb)|&bull;/gi],
];
const UI_SOURCES = ['src/components', 'src/layouts', 'src/pages'];

function uiHits(file, src) {
  const mode = file.endsWith('.css') ? 'css' : file.endsWith('.astro') ? 'astro' : 'js';
  const hits = [];
  stripComments(src, mode)
    .split('\n')
    .forEach((line, i) => {
      const marks = {};
      for (const [name, re] of UI_MARKS) {
        const n = [...line.matchAll(re)].filter(
          (m) => !(name === '·' && line[m.index - 1] === 'N' && line[m.index + 1] === 'm'),
        ).length;
        if (n) marks[name] = n;
      }
      if (Object.keys(marks).length)
        hits.push({ file, line: i + 1, marks, text: line.trim().replace(/\s{2,}/g, ' ') });
    });
  return hits;
}

function uiFiles() {
  const astro = UI_SOURCES.flatMap((d) =>
    readdirSync(join(ROOT, d), { recursive: true })
      .filter((f) => f.endsWith('.astro'))
      .map((f) => `${d}/${f.split('\\').join('/')}`)
      .sort(),
  );
  const css = readdirSync(join(ROOT, 'src/styles'))
    .filter((f) => f.endsWith('.css'))
    .sort()
    .map((f) => `src/styles/${f}`);
  return ['src/i18n/ui.ts', ...astro, ...css];
}

// --- Build check (plan 5.2, 7.1) ------------------------------------------------------------------

const ALLOWED_DOTS = /(?<![\p{L}_])N·m|(?<![\p{L}\p{N}_])(?:Kd·ω|조·항(?:·호)?)/gu;
// In Korean these tokens may be followed immediately by a particle, e.g. 조·항을 or N·m의.
const TOKEN_END =
  /^(?:(?:으로부터|으로써|으로서|으로|에서|에게|까지|부터|마다|보다|처럼|로|에|의|이|가|와|과|을|를|별)?(?:은|는|도|만)?)(?![\p{L}\p{N}_])/u;
const LECTURE_TITLE = 'incheon-llm-agent-lectures.title.ko';

function forbiddenMark(text, lectureTitle = false) {
  if (!/[—·]/.test(text)) return;
  const copy = text.replace(ALLOWED_DOTS, (term, start) =>
    TOKEN_END.test(text.slice(start + term.length)) ? term.replaceAll('·', ' ') : term,
  );
  const rest = lectureTitle ? copy.replace('학부·석사', '학부 석사') : copy;
  return /[—·]/.exec(rest);
}

function buildCheck() {
  const sources = content(workPaths(), readWork);
  const lectureTitle = sources
    .find((s) => s.file === 'teaching.yaml')
    ?.items.find((i) => i.path === LECTURE_TITLE)?.text;
  let failures = 0;
  function check(text, location, role) {
    const lecture =
      role === 'lecture-title' || (role === 'html-text' && text.trim() === lectureTitle);
    const mark = forbiddenMark(text, lecture);
    if (mark) {
      console.error(`${TAG} ${location}: "${mark[0]}" in ${around(text, mark.index, 1)}`);
      failures++;
    }
  }
  for (const { file, items } of sources)
    for (const item of items) {
      const lecture = file === 'teaching.yaml' && item.path === LECTURE_TITLE;
      check(item.text, `src/content/${file} ${item.path}`, lecture ? 'lecture-title' : undefined);
    }
  const ui = 'src/i18n/ui.ts';
  stripComments(readWork(ui), 'js')
    .split('\n')
    .forEach((line, i) => {
      const decoded = line.replace(
        /\\(?:\\|u\{([\da-f]+)\}|u([\da-f]{4})|x([\da-f]{2}))/gi,
        (escape, braced, unicode, hex) =>
          escape === '\\\\' ? '\\' : String.fromCodePoint(parseInt(braced ?? unicode ?? hex, 16)),
      );
      check(decoded, `${ui}:${i + 1}`);
    });
  const files = readdirSync(join(ROOT, 'dist'), { recursive: true })
    .filter((f) => /\.(?:css|html)$/.test(f))
    .map((f) => 'dist/' + f);
  if (!files.some((f) => f.endsWith('.html')))
    throw new Error(`${TAG} no built HTML found in dist/`);
  distCopy(files, readWork, check);
  if (failures) process.exitCode = 1;
  else
    console.log(
      `${TAG} ${sources.length} content files, UI strings, ${files.length} HTML/CSS files: punctuation ok`,
    );
}

// --- Facts (plan 5.8) ---------------------------------------------------------------------------

// SVG path data is geometry, not copy; boxes may be resized in plan step 5.
const GEOMETRY = /(?:^|\.)(?:d|curve|route)$/;

const firstWord = (s, at) => {
  const before = s.slice(0, at).replace(/[\s"'“‘([]+$/, '');
  return before === '' || /[.!?]$/.test(before);
};

// Fact tokens of one string as a multiset (array). Latin-script tokens first: all of them in ko and neutral strings,
// in en only likely names (two capitals, a digit, camelCase, or a capital not opening a sentence). Then dates and
// numbers (commas dropped, % kept). Separators (·, /, commas, parentheses) never join tokens, so `A · B` → `A, B`
// or `A (B)` keeps the same multiset.
function facts(s, lang) {
  const out = [];
  const rest = s
    .replace(/\u00a0/g, ' ')
    .replace(/[A-Za-z0-9][A-Za-z0-9+#&_.-]*/g, (tok, at) => {
      if (!/[A-Za-z]/.test(tok)) return tok;
      const t = tok.replace(/[._&-]+$/, '');
      const name =
        lang !== 'en' ||
        /[A-Z].*[A-Z]|\d|[a-z][A-Z]/.test(t) ||
        (/^[A-Z]/.test(t) && !firstWord(s, at));
      if (name) out.push('name:' + t);
      return ' ';
    })
    .replace(
      /(?<!\d)((?:19|20)\d\d)[-./](0[1-9]|1[0-2])(?:[-./](0[1-9]|[12]\d|3[01]))?(?!\d)/g,
      (_, y, m, d) => (out.push(`date:${y}-${m}${d ? '-' + d : ''}`), ' '),
    );
  for (const m of rest.matchAll(/(?<![\d.])(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?%?/g))
    out.push('num:' + m[0].replace(/,/g, ''));
  return out;
}

function diff(a, b) {
  const n = new Map();
  for (const t of a) n.set(t, (n.get(t) ?? 0) + 1);
  for (const t of b) n.set(t, (n.get(t) ?? 0) - 1);
  const missing = [];
  const added = [];
  for (const [t, c] of n) {
    for (let i = 0; i < c; i++) missing.push(t);
    for (let i = 0; i < -c; i++) added.push(t);
  }
  return { missing, added };
}

const keyed = (files) =>
  new Map(
    files.map(({ file, items }) => [
      file,
      new Map(items.filter((x) => !GEOMETRY.test(x.path)).map((x) => [x.path, x])),
    ]),
  );

const short = (s) => (s.length > 160 ? s.slice(0, 159) + '…' : s).replace(/\n/g, '\\n');

function factsMode(commit) {
  const git = (...a) =>
    execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26, stdio: 'pipe' });
  let hash;
  try {
    hash = git('rev-parse', '--short', '--verify', `${commit}^{commit}`).trim();
  } catch {
    console.error(`${TAG} unknown commit: ${commit}`);
    process.exit(2);
  }
  const basePaths = order(
    git('ls-tree', '-r', '--name-only', hash, '--', 'src/content').split('\n'),
  );
  const base = keyed(content(basePaths, (p) => git('show', `${hash}:${p}`)));
  const work = keyed(content(workPaths(), readWork));
  const lines = [];
  let checked = 0;
  let differ = 0;
  for (const file of new Set([...base.keys(), ...work.keys()])) {
    const [b, w] = [base.get(file), work.get(file)];
    if (!b || !w) {
      lines.push(`${file}  only in ${b ? hash : 'the working tree'} (${(b ?? w).size} keys)`);
      checked += (b ?? w).size;
      differ += (b ?? w).size;
      continue;
    }
    for (const path of new Set([...b.keys(), ...w.keys()])) {
      checked++;
      const [x, y] = [b.get(path), w.get(path)];
      if (!x || !y) {
        differ++;
        lines.push(
          `${file}  ${path}  only in ${x ? hash : 'the working tree'}: ${short((x ?? y).text)}`,
        );
        continue;
      }
      const { missing, added } = diff(facts(x.text, x.lang), facts(y.text, y.lang));
      if (!missing.length && !added.length) continue;
      differ++;
      lines.push(`${file}  ${path}`);
      if (missing.length) lines.push(`  missing: ${missing.join('  ')}`);
      if (added.length) lines.push(`  added:   ${added.join('  ')}`);
      lines.push(
        `  was: ${x.text.replace(/\n/g, '\\n')}`,
        `  now: ${y.text.replace(/\n/g, '\\n')}`,
      );
    }
  }
  console.log(`${TAG} facts: working tree vs ${hash}`);
  if (lines.length) console.log(lines.join('\n'));
  console.log(`${checked} keys checked, ${differ} differ`);
  process.exit(differ ? 1 : 0);
}

// --- Output -------------------------------------------------------------------------------------

const num = (n) => n.toLocaleString('en-US');
const around = (s, at, len) => {
  const a = Math.max(0, at - 28);
  const b = Math.min(s.length, at + len + 28);
  return ((a ? '…' : '') + s.slice(a, b) + (b < s.length ? '…' : '')).replace(/\n/g, '\\n');
};

function table(title, cols, rows, total) {
  const w = Math.max(...rows.map((r) => r.file.length), 5);
  const line = (name, r) =>
    name.padEnd(w) + cols.map(([k, h]) => num(r[k]).padStart(h.length + 2)).join('');
  return [
    title,
    ''.padEnd(w) + cols.map(([, h]) => h.padStart(h.length + 2)).join(''),
    ...rows.map((r) => line(r.file, r)),
    line('total', total),
  ].join('\n');
}

const SYMBOL_COLS = [
  ['pairs', 'pairs'],
  ['enChars', 'en-chars'],
  ['koChars', 'ko-chars'],
  ['em', 'em'],
  ['enRange', 'ndash-rng'],
  ['enJoin', 'ndash-join'],
  ['midEn', 'mid-en'],
  ['midKo', 'mid-ko'],
  ['midOther', 'mid-oth'],
  ['unitNm', 'N-m'],
  ['alike', 'alike'],
];
const PATTERN_COLS = [
  ['ko25', 'ko25'],
  ['end1', 'e1'],
  ['end2', 'e2'],
  ['end3', 'e3'],
  ['end4', 'e4'],
  ['endShort', 'e34<25'],
  ['mixed', 'mixed'],
  ['period', 'period'],
  ['koNot', 'ko-not'],
  ['enNot', 'en-not'],
  ['enNotOnly', 'not-only'],
  ['enRather', 'rather'],
  ['fromNum', 'from#'],
  ['fromOther', 'from~'],
  ['colonEn', 'col-en'],
  ['colonKo', 'col-ko'],
  ['semiEn', 'semi-en'],
  ['semiKo', 'semi-ko'],
  ['buzz', 'buzz'],
];
const TOP = [
  ['middle dots', ['midEn', 'midKo', 'midOther']],
  ['ko endings ③ ④ (any length)', ['end3', 'end4', 'endShort']],
  ['em dash and joining en dash', ['em', 'enJoin']],
  [
    'contrast (아닌/아니라, ", not", "not only", "rather than")',
    ['koNot', 'enNot', 'enNotOnly', 'enRather'],
  ],
  ['"from X to Y", other', ['fromOther']],
  ['colons and semicolons', ['colonEn', 'colonKo', 'semiEn', 'semiKo']],
];

function reportMode(json, detail) {
  const files = content(workPaths(), readWork);
  const { rows, total, hits } = measure(files);
  const ui = uiFiles().flatMap((f) => uiHits(f, readWork(f)));
  const uiTotal = {};
  for (const h of ui)
    for (const [k, n] of Object.entries(h.marks)) uiTotal[k] = (uiTotal[k] ?? 0) + n;
  if (json) {
    const out = { files: rows, total, ui, uiTotal };
    if (detail)
      out.hits = hits.map(({ text, ...h }) => ({ ...h, context: around(text, h.at, h.len) }));
    console.log(JSON.stringify(out, null, 2));
    return;
  }
  const t = total;
  const out = [
    `${TAG} report: ${files.length} files in src/content/`,
    '',
    table(
      'Symbols (string values; mid = middle dot, N-m = the N·m unit, kept)',
      SYMBOL_COLS,
      rows,
      t,
    ),
    '',
    table(
      'Patterns (ko25: ko strings of 25+ chars, e1–e4: their endings ①–④, e34<25: ③ ④ in shorter ko strings, mixed: sentences end differently, period: period rule broken)',
      PATTERN_COLS,
      rows,
      t,
    ),
    '',
    'Top files',
    ...TOP.map(([label, keys]) => {
      const top = rows
        .map((r) => [r.file, keys.reduce((n, k) => n + r[k], 0)])
        .filter(([, n]) => n)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      return `  ${label}: ${top.map(([f, n]) => `${f} ${n}`).join(', ') || 'none'}`;
    }),
    '',
    `UI and components (src/i18n/ui.ts, components, layouts, pages, styles; comments excluded): ${ui.length} lines`,
    ...ui.map(
      (h) =>
        `  ${h.file}:${h.line}  ${Object.entries(h.marks)
          .map(([k, n]) => `${k}×${n}`)
          .join(' ')}  ${h.text.length > 140 ? h.text.slice(0, 139) + '…' : h.text}`,
    ),
    '',
    'Totals',
    `  ${num(t.pairs)} en/ko pairs, en ${num(t.enChars)} chars, ko ${num(t.koChars)} chars`,
    `  em dash ${t.em}; en dash ${t.enRange + t.enJoin} (range ${t.enRange}, joining ${t.enJoin})`,
    `  middle dot ${t.midEn + t.midKo + t.midOther} (en ${t.midEn}, ko ${t.midKo}, neutral ${t.midOther}), plus N·m ${t.unitNm}; lookalikes ${t.alike}`,
    `  ko endings in ${t.ko25} strings: ① ${t.end1}, ② ${t.end2}, ③ ${t.end3}, ④ ${t.end4} (mixed ${t.mixed}, period rule ${t.period}); ③ ④ in shorter strings ${t.endShort}`,
    `  contrast: ko 아닌/아니라 ${t.koNot}; en ", not" ${t.enNot}, "not only" ${t.enNotOnly}, "rather than" ${t.enRather}`,
    `  from X to Y: numeric ${t.fromNum}, other ${t.fromOther}`,
    `  colons: en ${t.colonEn}, ko ${t.colonKo}; semicolons: en ${t.semiEn}, ko ${t.semiKo}; buzzwords: ${t.buzz}`,
    `  UI and components: ${ui.length} lines (${Object.entries(uiTotal)
      .map(([k, n]) => `${k} ${n}`)
      .join(', ')})`,
  ];
  if (detail)
    for (const key of Object.keys(FIELDS).filter((k) => !UNLISTED.has(k))) {
      const list = hits.filter((h) => h.key === key);
      if (!list.length) continue;
      out.push('', `## ${FIELDS[key]} (${list.length})`);
      for (const h of list) out.push(`${h.file}  ${h.path}  ${around(h.text, h.at, h.len)}`);
    }
  console.log(out.join('\n'));
}

function dumpMode(lang, pairs) {
  const esc = (s) => s.replace(/\n/g, '\\n');
  for (const { file, items } of content(workPaths(), readWork)) {
    if (!pairs) {
      for (const x of items) if (x.lang === lang) console.log(`${file}  ${x.path}  ${esc(x.text)}`);
      continue;
    }
    const byKey = new Map();
    for (const x of items)
      if (x.lang)
        byKey.set(x.path.slice(0, -3), { ...byKey.get(x.path.slice(0, -3)), [x.lang]: x.text });
    for (const [path, p] of byKey)
      if (p.en !== undefined && p.ko !== undefined)
        console.log(`${file}  ${path}\n  en  ${esc(p.en)}\n  ko  ${esc(p.ko)}`);
  }
}

// --- Self-test ----------------------------------------------------------------------------------

function selfTest() {
  const fail = [];
  const expect = (name, got, want) => {
    if (JSON.stringify(got) !== JSON.stringify(want))
      fail.push(`${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  };
  const count = (s, lang, keys) => {
    const c = Object.fromEntries(keys.map((k) => [k, 0]));
    analyze(s, lang, (k) => k in c && c[k]++);
    return c;
  };

  // Korean endings ①–④: closing brackets and quotes ignored, nouns that only look like ~ㅁ, mixed sentences.
  const end = (s) => koEnding(s).cls;
  expect(
    'end ①',
    end('하이브리드 검색 지식 베이스로 국가 법령정보를 찾는 서비스 개발 (베타 공개)'),
    1,
  );
  expect('end ① noun', end('설비 데이터에서 이상 징후를 찾아내는 비지도 학습 기반 결함'), 1);
  expect('end ① 알림', end('설비 이상을 감지하면 담당자에게 보내는 실시간 알림'), 1);
  expect('end ②', end('영향이 크고 적용 사례가 있는 영역. 시스템 구축 전에 효과를 먼저 검증.'), 2);
  expect('end ③', end('벡터 DB를 한 번 조회하는 방식으로는 개정 시점에 대한 이력 자체가 없음'), 3);
  expect('end ③ quote', end("'조문번호와 출처를 붙여 최신 원문 그대로 인용해야 함'"), 3);
  expect('end ③ short', count('효과가 나기까지 단계가 하나 늘어남', 'ko', ['ko25', 'endShort']), {
    ko25: 0,
    endShort: 1,
  });
  expect('end ④', end('도슨트가 태블릿 버튼이나 호출어로 회차를 시작한다.'), 4);
  const mixed = koEnding('첫 문장은 명사형으로 끝나는 설명. 두 번째 문장은 서술형으로 바뀐다.');
  expect('end ④ mixed', [mixed.cls, mixed.mixed], [4, true]);
  expect(
    'period rule',
    [
      '한 문장인데 마침표가 붙은 명사형 설명.',
      '두 문장 중 첫 문장. 마침표 없이 끝난 둘째 문장',
      '마침표 없는 한 문장',
    ].map((s) => koEnding(s).prd),
    [true, true, false],
  );

  expect(
    'period after English manufacturer',
    koEnding('제품 이미지: Unitree Robotics. 사양: G1 EDU 제조사 공개 사양.').prd,
    false,
  );
  expect('bibliographic abbreviations', koEnding('Energies, vol. 19, no. 4, art. 874').prd, false);

  // Middle dots (N·m is a unit), en dash ranges vs joins, "from X to Y", contrast, colons, buzzwords.
  const dots = ['midEn', 'unitNm', 'alike'];
  expect('dots', count('knee up to 120 N·m · torque ㆍ arms', 'en', dots), {
    midEn: 1,
    unitNm: 1,
    alike: 1,
  });
  const dash = ['enRange', 'enJoin'];
  expect('ndash', count('pp. 107–114, #1–#5, 2018–23 records', 'en', dash), {
    enRange: 3,
    enJoin: 0,
  });
  expect('ndash open', count('2026 –', '', dash), { enRange: 1, enJoin: 0 });
  expect('ndash join', count('fast – and cheap', 'en', dash), { enRange: 0, enJoin: 1 });
  expect(
    'from-to',
    count(
      'Cut error from 6.5% to 3.4% MAPE, time from over 10 minutes to about one second, and went from onboarding to scale.',
      'en',
      ['fromNum', 'fromOther'],
    ),
    { fromNum: 2, fromOther: 1 },
  );
  expect(
    'contrast en',
    count('Two sources, not one; rather than a single index, not only fast', 'en', [
      'enNot',
      'enNotOnly',
      'enRather',
      'semiEn',
    ]),
    { enNot: 1, enNotOnly: 1, enRather: 1, semiEn: 1 },
  );
  expect(
    'contrast ko',
    count('법률 용어가 아닌 일상어, 키워드가 아니라 의미, 맞는지 아닌지: 10:30', 'ko', [
      'koNot',
      'colonKo',
    ]),
    { koNot: 2, colonKo: 1 },
  );
  expect('buzz', count('Built a robust, seamless pipeline to leverage data', 'en', ['buzz']), {
    buzz: 3,
  });

  // Facts: separators and rewording do not count, changed numbers, dates, and names do.
  const same = (a, b, lang) => diff(facts(a, lang), facts(b, lang));
  const none = { missing: [], added: [] };
  expect(
    'facts comma',
    same(
      'Grew from 12 to 3,046 statutes (Dense · BM25)',
      'Grew from 12 to 3046 statutes (Dense, BM25)',
      'en',
    ),
    none,
  );
  expect('facts paren', same('Vector DB · Seahorse', 'Vector DB (Seahorse)', 'en'), none);
  expect(
    'facts reword',
    same("Designed the agent's scenarios", 'Wrote scenarios for the agent', 'en'),
    none,
  );
  expect(
    'facts ko',
    same(
      '학습·평가에 LLM·TTS와 Qwen3-Embedding-8B 사용',
      '학습과 평가에 LLM, TTS와 Qwen3-Embedding-8B 사용',
      'ko',
    ),
    none,
  );
  expect('facts number', same('Cut MAPE from 6.5% to 3.4%', 'Cut MAPE from 6.4% to 3.4%', 'en'), {
    missing: ['num:6.5%'],
    added: ['num:6.4%'],
  });
  expect('facts date', same('2024.03 – 2024.09', '2024.03 – 2024.10', ''), {
    missing: ['date:2024-09'],
    added: ['date:2024-10'],
  });
  expect('facts name', same('Built it with LangGraph', 'Built it with LangChain', 'en'), {
    missing: ['name:LangGraph'],
    added: ['name:LangChain'],
  });

  // UI: comments in frontmatter, markup, and <style> are skipped; strings, text, and CSS content are not.
  const astro = [
    '---',
    '// note · here',
    "const a = 'A · B'; /* — */",
    "const u = 'https://x.y/z'; // keep the URL ·",
    "const r = /\\/\\//g, s = ' · '; // c · d",
    '---',
    '<!-- · -->',
    '<p>{/* — */}{a} — b</p>',
    '<style>',
    "  li + li::before { content: ' · '; } /* · */",
    '</style>',
  ].join('\n');
  expect(
    'ui',
    uiHits('x.astro', astro).map((h) => [h.line, Object.values(h.marks)[0]]),
    [
      [3, 1],
      [5, 1],
      [8, 1],
      [10, 1],
    ],
  );

  expect(
    'build punctuation',
    [
      '120N·m의 토크, Kd·ω, 조·항을 대조, 조·항·호',
      '사용처 — 목록',
      '선택·이력',
      '조·항목',
      'RN·m',
      'N·model',
      '분야 학부·석사',
    ].map((text) => forbiddenMark(text)?.[0] ?? ''),
    ['', '—', '·', '·', '·', '·', '·'],
  );
  expect('lecture title exception', forbiddenMark('학부·석사 강의', true)?.[0] ?? '', '');
  const outputs = {
    'test.html': `<!-- — --><script>'—'</script><template><svg><text>one &middot; two</text></svg></template>
      <img alt="alt &#x2014;"><meta name="description" content="desc &#183;">
      <script type="application/ld+json">{"name":"JSON \\u2014"}</script><p data-l="label ·"
      style="--sep:'\\0000b7'"></p><style>@media print{p::before{content:var(--sep)}} </style>`,
    'test.css': `/* — */ a::after{content:attr(data-l) / "\\2014"} .x{font-family:"unused ·"}`,
  };
  const built = [];
  distCopy(
    Object.keys(outputs),
    (file) => outputs[file],
    (text) => {
      if (forbiddenMark(text)) built.push(text);
    },
  );
  expect(
    'built HTML and CSS content',
    built.sort(),
    ['one · two', 'alt —', 'desc ·', 'JSON —', 'label ·', '·', '—'].sort(),
  );

  if (fail.length) {
    console.error(`${TAG} self-test failed\n  ` + fail.join('\n  '));
    process.exit(1);
  }
  console.log(`${TAG} self-test ok`);
}

// --- Main ---------------------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const after = (f) => {
  const v = args[args.indexOf(f) + 1];
  return v && !v.startsWith('--') ? v : undefined;
};
const usage = () =>
  readFileSync(new URL(import.meta.url), 'utf8')
    .match(/^(?:\/\/.*\n)+/)[0]
    .replace(/^\/\/ ?/gm, '');

if (flag('--self-test')) selfTest();
else if (flag('--report')) reportMode(flag('--json'), flag('--detail'));
else if (flag('--facts')) {
  if (!after('--facts')) {
    console.error(`${TAG} --facts needs a commit\n\n` + usage());
    process.exit(2);
  }
  factsMode(after('--facts'));
} else if (flag('--dump')) {
  const lang = after('--dump');
  if (!flag('--pairs') && lang !== 'en' && lang !== 'ko') {
    console.error(`${TAG} --dump needs en or ko (or --pairs)\n\n` + usage());
    process.exit(2);
  }
  dumpMode(lang, flag('--pairs'));
} else if (args.length) {
  console.error(`${TAG} unknown arguments: ${args.join(' ')}\n\n` + usage());
  process.exit(2);
} else buildCheck();
