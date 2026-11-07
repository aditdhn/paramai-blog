# Content map: what lives where

Two sites, two jobs. Agreed split (approved by the founder):

| Site | Job | What lives there |
|---|---|---|
| **paramai.in/blog** (React page in `aditdhn/param-ai-main-updated`, VPS) | Assessment guides | The 13 assessment / stream guides. Slugs: `src/frontend/src/data/blogArticles.ts` in the main repo (that file is the list of record; do not copy slugs here). |
| **paramai.blog** (this repo, Vercel) | Student hook: discovery | Sector pages (`/sectors/`), data stories (`/data/`), discovery and general editorial (`/posts/`). |

## /data/ is a hook, not the full dataset

`/data/` is the free preview: the stat strip, the three callouts and the top 5 fields by median pay (with caveats). The other fields, the share-on-a-regular-salary view and the pay ladders are not rendered here; the page sends readers to the free assessment on paramai.in (`utm_campaign=data`). All figures still come from `src/data/career-stats.json`; only the presentation is trimmed.

## /data/ is a hook, not the full dataset

`/data/` is the free preview: the stat strip, the three callouts and the top 5 fields by median pay (with caveats). The other fields, the share-on-a-regular-salary view and the pay ladders are not rendered on this page at all; it sends readers to the free assessment on paramai.in (`utm_campaign=data`). All figures still come from `src/data/career-stats.json`; only the presentation is trimmed.

## Rules

1. **No piece lives on both sites.** If a topic needs to be on both, write two different pieces with different jobs and link between them.
2. **If a page is ever duplicated anyway**, the secondary page gets `rel="canonical"` pointing at the primary. Here, `BaseLayout` takes a `canonical` prop, and `canonicalToApp` frontmatter on a sector post does the same. The primary is paramai.in/blog for assessment guides, and paramai.blog for sectors and data.
3. **Figures have one source of truth**: `src/data/career-stats.json` (below). Components and posts never hand-type career numbers.
4. Every outbound link to the assessment goes through `AssessmentCTA` (or the existing `utm_source=blog` pattern) so GA4 attribution stays consistent. The `/data/` page uses `utm_medium=data&utm_campaign=numbers-behind-careers`.

## Wording rules for data pages

- Say "not on a regular salary" for the complement of the salaried share. Never "self-employed".
- The career count is "1,500+ real careers" everywhere on paramai.blog, including /data/, as on paramai.in (founder decision). It is one constant, `CAREER_COUNT` in `src/lib/careerStats.ts`, so pages cannot disagree. `career-stats.json` still records the audited universe (1,490 distinct careers) as a source fact for the drift check; it is not shown on the site.
- No reliability or validation claims about the data.
- Pay is indicative context, not a promise.
- Pay ladders are basic pay before allowances.

## Career figures: single source of truth

`src/data/career-stats.json` is **generated**, never edited by hand. It is read through `src/lib/careerStats.ts`.

Sources, all in `aditdhn/param-ai-main-updated`:

| Figures | Source file |
|---|---|
| 13-field pay, salaried share, sample sizes | `docs/career_kb/navigator_field_plfs_2025.csv` |
| IAS / IPS / Army / professor ladders | `config/career_progressions.json` |
| PLFS record count, audited career count (1,490, recorded only), all-India median and mean | `docs/career_kb/README.md` |

The JSON records the source repo/ref, a SHA-256 of each source file, and `figuresSha256`, a digest of the figures themselves.

### Drift check

`npm run check:stats` (also run automatically as `prebuild`, so `npm run build` and the Vercel build fail) recomputes the digest and fails if the figures were edited without a refresh. It also checks that there are 13 fields and 4 ladders and that ladder pay and years increase.

To compare against the real sources instead of the recorded digest:

```bash
node scripts/refresh-career-stats.mjs --source <path-to-main-repo-checkout> --check
```

### Refreshing the career figures

1. Get the three source files at the commit you want, e.g. a checkout of the main repo, or into a scratch folder:
   ```bash
   for f in docs/career_kb/navigator_field_plfs_2025.csv config/career_progressions.json docs/career_kb/README.md; do
     gh api "repos/aditdhn/param-ai-main-updated/contents/$f?ref=<branch-or-sha>" --jq .content | base64 -d > "<scratch>/$(basename $f)"
   done
   ```
2. Regenerate: `node scripts/refresh-career-stats.mjs --source <scratch-or-checkout> --ref <full-commit-sha>`
3. `npm run check:stats && npm run build`, then eyeball `/data/`.
4. Commit the JSON together with any wording change the new numbers force. If the README no longer states a number the script reads, the script fails loudly: fix the script's pattern, don't type the number.

The editorial one-line caveats under some fields live in `FIELD_NOTES` and the ladder display names/sources in `LADDERS`, both in `scripts/refresh-career-stats.mjs` (not numbers).

Recorded source ref for the current figures: see `meta.sourceRef` in the JSON.
