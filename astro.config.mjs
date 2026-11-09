// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sguys99.github.io',
  // Matches the default directory build output (page/index.html), which GitHub Pages serves at page/.
  trailingSlash: 'always',
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
});
