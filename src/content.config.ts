import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// "sectors" = one post per KB sector (41 total). These feed the sector landing pages.
const sectors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sectors' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sectorId: z.string(), // S1..S41
    sectorSlug: z.string(), // e.g. "ai-ml"
    heroTagline: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('ParamAI™ Research'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // If true, a rel=canonical pointing back to paramai.in equivalent is emitted.
    canonicalToApp: z.string().optional(),
  }),
})

// "posts" = general editorial (assessment science, parent guides, etc.)
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('ParamAI™ Research'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { sectors, posts }
