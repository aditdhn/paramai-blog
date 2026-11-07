import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '@/consts'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const [sectors, posts] = await Promise.all([
    getCollection('sectors', ({ data }) => !data.draft),
    getCollection('posts', ({ data }) => !data.draft),
  ])

  const items = [
    ...sectors.map((s) => ({
      title: s.data.title,
      description: s.data.description,
      pubDate: s.data.pubDate,
      link: `/sectors/${s.data.sectorSlug}/`,
      customData: s.data.updatedDate ? `<atom:updated>${s.data.updatedDate.toISOString()}</atom:updated>` : undefined,
    })),
    ...posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/posts/${p.id}/`,
      customData: p.data.updatedDate ? `<atom:updated>${p.data.updatedDate.toISOString()}</atom:updated>` : undefined,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
  })
}
