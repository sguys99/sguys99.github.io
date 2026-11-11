// sitemap.xml (tasks 6.16): every indexable page in both languages with en/ko/x-default alternates, same rule as Head.astro.
// Built from content so new case studies join automatically. Not listed: 404, HTML CV (PDF is the public entry, 11.8), PDFs.
import type { APIRoute } from 'astro';
import { caseList } from '../components/CaseStudy.astro';
import { contentDate } from '../components/Footer.astro';
import { LANGS, langPath } from '../i18n/ui';

export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', ...(await caseList()).map((p) => `/work/${p.id}/`)];
  const abs = (path: string) => new URL(path, site).href;
  const date = contentDate();
  const lastmod = date ? `\n    <lastmod>${date}</lastmod>` : '';
  const alt = (path: string) =>
    [...LANGS.map((l) => [l, langPath(path, l)]), ['x-default', langPath(path, 'en')]]
      .map(([hl, p]) => `\n    <xhtml:link rel="alternate" hreflang="${hl}" href="${abs(p)}"/>`)
      .join('');
  const urls = paths
    .flatMap((path) => LANGS.map((l) => langPath(path, l)))
    .map((path) => `  <url>\n    <loc>${abs(path)}</loc>${lastmod}${alt(path)}\n  </url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
