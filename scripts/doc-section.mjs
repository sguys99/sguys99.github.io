// Prints one section of a long Markdown doc so agents don't read the whole file (CLAUDE.md "문서 읽기").
//   node scripts/doc-section.mjs DESIGN.md                  outline: ## and ### headings with start line and length
//   node scripts/doc-section.mjs DESIGN.md 5.24             the section, up to the next heading of the same or higher level
//   node scripts/doc-section.mjs DESIGN.md 5.24 --outline   only the headings inside that section
//   node scripts/doc-section.mjs docs/glossary.md "Case study" --depth 4
// A query matches a numbered heading by its number ("5.2" is 5.2, not 5.20), otherwise any heading containing it.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const depthAt = args.indexOf('--depth');
const depth = depthAt >= 0 ? Number(args[depthAt + 1]) : 3;
const [file, query] = args.filter(
  (a, i) => !a.startsWith('--') && (depthAt < 0 || i !== depthAt + 1),
);
if (!file) {
  console.error(
    'usage: node scripts/doc-section.mjs <file.md> [heading or number] [--outline] [--depth N]',
  );
  process.exit(2);
}

const lines = readFileSync(file, 'utf8').split('\n');
const headings = [];
let fenced = false;
lines.forEach((line, i) => {
  if (/^(```|~~~)/.test(line)) fenced = !fenced;
  const m = !fenced && line.match(/^(#{1,6}) (.*)/);
  if (m) headings.push({ line: i + 1, level: m[1].length, text: m[2] });
});
// A heading's section ends before the next heading of the same or higher level.
for (const [i, h] of headings.entries()) {
  const next = headings.slice(i + 1).find((n) => n.level <= h.level);
  h.end = next ? next.line - 1 : lines.length;
}

const outline = (list) =>
  list.forEach((h) =>
    console.log(
      `${String(h.line).padStart(5)} ${'#'.repeat(h.level)} ${h.text} (${h.end - h.line + 1})`,
    ),
  );

if (!query) {
  outline(headings.filter((h) => h.level >= 2 && h.level <= depth));
  process.exit(0);
}

const q = query.toLowerCase();
const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const byNumber = headings.filter((h) =>
  new RegExp(`^${escaped}\\.?(\\s|$)`).test(h.text.toLowerCase()),
);
const matches = byNumber.length
  ? byNumber
  : headings.filter((h) => h.text.toLowerCase().includes(q));
if (!matches.length) {
  console.error(`no heading matches "${query}". Run without a query for the outline.`);
  process.exit(1);
}
if (matches.length > 1) {
  console.error(`${matches.length} headings match "${query}". Use a more specific query:`);
  outline(matches);
  process.exit(1);
}

const [h] = matches;
if (flag('--outline')) {
  outline(
    headings.filter(
      (s) => s.line >= h.line && s.line <= h.end && s.level <= Math.max(depth, h.level + 1),
    ),
  );
} else {
  console.log(`[${file}:${h.line}-${h.end}]`);
  console.log(lines.slice(h.line - 1, h.end).join('\n'));
}
