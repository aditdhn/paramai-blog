import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { readFileSync, readdirSync } from 'node:fs'

// lastmod for pages whose content was revised: read updatedDate from frontmatter.
const lastmod = new Map()
for (const [dir, base, key] of [
  ['src/content/posts', '/posts/', null],
  ['src/content/sectors', '/sectors/', 'sectorSlug'],
]) {
  for (const file of readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
    const fm = (readFileSync(dir + '/' + file, 'utf8').replace(/\r\n/g, '\n').split('\n---')[0]) ?? ''
    const upd = fm.match(/^updatedDate:\s*(\S+)/m)?.[1]
    if (!upd) continue
    const slug = key ? fm.match(new RegExp('^' + key + ':\\s*"?([^"\\n]+)"?', 'm'))?.[1] : file.replace(/\.mdx?$/, '')
    if (slug) lastmod.set('https://paramai.blog' + base + slug + '/', new Date(upd).toISOString())
  }
}

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
  integrations: [mdx(), sitemap({
      serialize(item) {
        const lm = lastmod.get(item.url)
        if (lm) item.lastmod = lm
        return item
      },
    }), tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
})
