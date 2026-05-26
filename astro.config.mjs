import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  site: 'https://paramai.blog',
  // trailingSlash: 'always' makes Astro generate canonical URLs with trailing
  // slashes (e.g. /sectors/technology/) matching Vercel's trailingSlash:true
  // redirect behaviour. Without this, Astro emits /sectors/technology as the
  // canonical while Vercel 308-redirects that URL to /sectors/technology/,
  // causing Google Search Console to flag every page as "Page with redirect"
  // and "Alternative page with proper canonical tag".
  trailingSlash: 'always',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
})
