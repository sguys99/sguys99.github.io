// Print /cv/ and /ko/cv/ from dist/ to PDF (tasks 6.12, DESIGN.md 10장 PDF).
// Runs after `astro build`. Serves dist/ with node:http because pages use root-relative font/CSS paths.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';
import { CV_PDF } from '../src/cv-pdf.mjs';

const DIST = new URL('../dist/', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  let path = join(DIST, normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(DIST)) return res.writeHead(403).end();
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  server.close();
  console.error(
    `[cv-pdf] Chromium is missing. Run: npx playwright install chromium\n${err.message}`,
  );
  process.exit(1);
}

try {
  // Light scheme: the print palette in tokens.css is light anyway; this pins it (6.11).
  const page = await browser.newPage({ colorScheme: 'light' });
  for (const [lang, file] of Object.entries(CV_PDF)) {
    const route = dirname(file) + '/';
    const res = await page.goto(origin + route, { waitUntil: 'networkidle' });
    if (!res?.ok()) throw new Error(`${route} returned ${res?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    // @page in the CV CSS sets size and margins; backgrounds are not printed (10장).
    await page.pdf({
      path: join(DIST, file),
      preferCSSPageSize: true,
      printBackground: false,
      tagged: true,
    });
    console.log(`[cv-pdf] ${lang}: ${file}`);
  }
} finally {
  await browser.close();
  server.close();
}
