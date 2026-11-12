# sguys99.github.io

Personal website of Kwang Myung Yu, AI Engineer: career, projects, and CV in English and Korean.

- English: https://sguys99.github.io/
- Korean: https://sguys99.github.io/ko/

## Stack

- [Astro](https://astro.build) with static output and Content Collections
- Plain CSS with design tokens (CSS custom properties)
- Astro i18n routing: English at `/`, Korean at `/ko/`
- [Playwright](https://playwright.dev) (Chromium) to print the CV pages to PDF at build time

## Quick start

Requires Node 24 (see `.nvmrc`).

```bash
nvm use
npm ci
npx playwright install chromium   # once, needed for the CV PDF step
npm run dev
```

| Command           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Start the dev server                                       |
| `npm run build`   | Build the site, generate the CV PDFs, check internal links |
| `npm run preview` | Serve the build output locally                             |
| `npm run format`  | Format with Prettier (`format:check` only checks)          |

## Project structure

```
src/content/      Content source (profile, experience, projects, personal, patents, ...)
src/components/   UI components
src/layouts/      Page layouts
src/pages/        English routes; Korean routes under pages/ko/
src/i18n/         UI strings (menus, buttons)
src/styles/       Design tokens and global styles
public/           Images, favicons, OG images, fonts
scripts/          Build steps: CV PDF generation, link check
docs/             Plan, tasks, design drafts, glossary
DESIGN.md         Design tokens, component specs, decision log
```

## Editing content

All content lives in `src/content/`. Components and pages contain no copy of their own.
Each entry holds both English (`en`) and Korean (`ko`) text; the content schema requires both,
so the build fails if either is missing.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site
(including the CV PDFs) and deploys `dist/` to GitHub Pages. The workflow can also be run manually.

## License

© Kwang Myung Yu. All rights reserved.

This repository is public for reference only. No part of it may be copied, modified, or
redistributed without prior written permission. This covers the source code and all content,
including the profile photo, the CV, and career and project descriptions.
