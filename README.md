# paramai-blog

Content hub for **[www.paramai.blog](https://www.paramai.blog)** — the editorial/SEO arm of [ParamAI](https://paramai.in).

Every post funnels to the assessment on `paramai.in`. The blog deliberately lives in a **separate repo and separate domain** so its SEO footprint, deploy cadence, and CMS surface stay independent of the main product.

## Stack

- [Astro 5](https://astro.build/) + MDX content collections
- Tailwind CSS for styling
- Deployed to Vercel (static)
- RSS + sitemap generated at build time

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output into dist/
npm run preview   # serve the built output locally
```

## Content model

Two content collections (see `src/content/config.ts`):

| Collection | Path | Purpose |
|---|---|---|
| `sectors` | `src/content/sectors/*.mdx` | One stub per KB sector (41 total). Feeds `/sectors/:slug/` landing pages. |
| `posts` | `src/content/posts/*.mdx` | General editorial — assessment science, parent guides, student stories. |

Sector posts are seeded with `draft: true`. Flip to `draft: false` when the post is ready to ship.

### Seeding / re-seeding sector stubs

```bash
node scripts/seed-sectors.mjs          # creates missing stubs, skips existing
node scripts/seed-sectors.mjs --force  # overwrites everything
```

Keep the `SECTORS` array in `scripts/seed-sectors.mjs` in sync with `src/backend/data/knowledge_bank/sector_*.json` in the main repo.

## Cross-linking conventions

- Every CTA uses `utm_source=blog` so conversions are measurable in analytics.
- `<AssessmentCTA sectorSlug="..."/>` drops in a styled call-to-action linking to the assessment with sector-specific UTM.
- Use `canonicalToApp` frontmatter on a sector post only if the content substantially duplicates a paramai.in page.

## Deploy

**First-time setup:** see [DEPLOY.md](./DEPLOY.md) for a step-by-step guide covering Vercel project import, Hostinger DNS records, SSL, and Google Search Console submission. Total time ~15 minutes + DNS propagation.

**Steady state:**

1. Push to `main` → Vercel builds and deploys to `www.paramai.blog`.
2. Apex `paramai.blog` redirects to `www.paramai.blog` via `vercel.json`.
3. Every PR gets a preview deploy URL for review.

## Related repos

- [`param-ai-main`](https://github.com/aditdhn/param-ai-main-updated) — Go backend + React frontend for the assessment product at paramai.in.
