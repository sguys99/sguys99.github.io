// Dumps src/content into a JS global for static design drafts: node docs/design-drafts/export-content.mjs <outdir>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { parse } from 'yaml';
const dir = 'src/content';
const out = {};
for (const f of readdirSync(dir)) {
  if (f.endsWith('.yaml')) out[f.replace('.yaml', '')] = parse(readFileSync(`${dir}/${f}`, 'utf8'));
}
for (const c of ['projects', 'personal']) {
  out[c] = Object.fromEntries(
    readdirSync(`${dir}/${c}`).map((f) => [f.replace('.md', ''), parse(readFileSync(`${dir}/${c}/${f}`, 'utf8').split(/^---$/m)[1])]),
  );
}
writeFileSync(`${process.argv[2]}/content.js`, `// Generated from src/content by export-content.mjs. Do not edit.\nwindow.CONTENT = ${JSON.stringify(out, null, 1)};\n`);
