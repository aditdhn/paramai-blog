#!/usr/bin/env node
// Regenerates src/data/career-stats.json from the three source files in
// aditdhn/param-ai-main-updated. This is the ONLY supported way to change the
// figures. See CONTENT_MAP.md ("Refreshing the career figures").
//
//   node scripts/refresh-career-stats.mjs --source <dir> [--ref <git sha/branch>] [--check]
//
// <dir> is a checkout of the main repo, or any folder holding
// navigator_field_plfs_2025.csv, career_progressions.json and README.md
// (flat or in docs/career_kb + config). --check compares instead of writing.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { figuresDigest } from './lib/stats-digest.mjs'

const args = process.argv.slice(2)
const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined)
const source = arg('--source')
const ref = arg('--ref')
const check = args.includes('--check')
if (!source) {
  console.error('usage: node scripts/refresh-career-stats.mjs --source <dir> [--ref <sha>] [--check]')
  process.exit(2)
}

const find = (name, sub) => {
  for (const p of [join(source, name), join(source, sub, name)]) if (existsSync(p)) return p
  throw new Error(`${name} not found under ${source}`)
}
const files = {
  csv: ['docs/career_kb/navigator_field_plfs_2025.csv', find('navigator_field_plfs_2025.csv', 'docs/career_kb')],
  progressions: ['config/career_progressions.json', find('career_progressions.json', 'config')],
  readme: ['docs/career_kb/README.md', find('README.md', 'docs/career_kb')],
}
const read = (k) => readFileSync(files[k][1], 'utf8').replace(/\r\n/g, '\n')
const sha = (k) => createHash('sha256').update(read(k)).digest('hex')

const parseCsv = (text) => {
  const rows = []
  let cur = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      cur.push(cell)
      cell = ''
    } else if (ch === '\n') {
      cur.push(cell)
      cell = ''
      if (cur.some((c) => c !== '')) rows.push(cur)
      cur = []
    } else cell += ch
  }
  if (cell !== '' || cur.length) {
    cur.push(cell)
    rows.push(cur)
  }
  const [head, ...body] = rows
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])))
}

// Short plain-language caveats shown on the page (editorial, not figures).
const FIELD_NOTES = {
  management: 'Includes owner-managers who are not on a regular salary.',
  science_research: 'Small sample: indicative only.',
  law_governance: 'Pay covers only the quarter of workers on a regular salary.',
  creative_design: 'Pay covers only the quarter of workers on a regular salary.',
  defence_security: 'Includes guards and constables, so mostly non-officer ranks.',
}
const LADDERS = [
  { id: 'ias_officer', name: 'IAS officer', source: 'IAS (Pay) Rules 2016, rule 3(1)' },
  { id: 'ips_officer', name: 'IPS officer', source: 'IPS (Pay) Rules 2016, G.S.R. 910(E)' },
  { id: 'army_officer', name: 'Army officer', source: 'Indian Army officer recruitment notice' },
  { id: 'professor', name: 'University professor', source: 'UGC Regulations 2018 + UGC pay letter' },
]

const num = (s, label) => {
  const n = Number(s)
  if (!Number.isFinite(n)) throw new Error(`bad number for ${label}: ${s}`)
  return n
}
const must = (re, text, label) => {
  const m = text.match(re)
  if (!m) throw new Error(`README no longer states ${label}`)
  return num(m[1].replace(/,/g, ''), label)
}

const readme = read('readme')
const csv = parseCsv(read('csv'))
const kb = JSON.parse(read('progressions')).careers

const fields = csv.map((r) => ({
  id: r.field_id,
  name: r.field_name,
  medianRs: num(r.regular_median_rs_month, r.field_id),
  meanRs: num(r.regular_mean_rs_month, r.field_id),
  regularSharePct: num(r.regular_salaried_share_pct, r.field_id),
  sampleN: num(r.regular_sample_n, r.field_id),
  ...(FIELD_NOTES[r.field_id] ? { note: FIELD_NOTES[r.field_id] } : {}),
}))

const clean = (t) => t.replace(/\s*\(Levels? [^)]*\)\s*$/, '')
const ladders = LADDERS.map((l) => {
  const levels = kb[l.id].levels
  return {
    id: l.id,
    name: l.name,
    source: l.source,
    startPayRs: levels[0].salary_inr_min,
    stages: levels.map((lv) => ({ title: clean(lv.title), fromYear: lv.years_min, topPayRs: lv.salary_inr_max })),
  }
})

const figures = {
  allIndiaMedianRs: must(/All-India median: Rs ([\d,]+)/, readme, 'all-India median'),
  allIndiaMeanRs: must(/mean regular earnings come out at Rs ([\d,]+)/, readme, 'all-India mean'),
  plfsRecords: must(/MPER_Q2_Q4_2025\.csv`, ([\d,]+) person records/, readme, 'PLFS record count'),
  distinctCareersAudited: must(/all ([\d,]+) distinct careers/, readme, 'audited career count'),
  fields,
  ladders,
}

const target = resolve(fileURLToPath(import.meta.url), '../../src/data/career-stats.json')

if (check) {
  const cur = JSON.parse(readFileSync(target, 'utf8'))
  if (JSON.stringify(cur.figures) !== JSON.stringify(figures)) {
    console.error('career-stats.json figures differ from the source files. Run the refresh (without --check).')
    process.exit(1)
  }
  console.log('career-stats.json figures match the source files.')
} else {
  const prev = existsSync(target) ? JSON.parse(readFileSync(target, 'utf8')) : undefined
  const out = {
    meta: {
      note: 'GENERATED by scripts/refresh-career-stats.mjs. Do not edit by hand: scripts/check-career-stats.mjs fails the build if figures no longer match figuresSha256.',
      sourceRepo: 'aditdhn/param-ai-main-updated',
      sourceRef: ref ?? prev?.meta.sourceRef ?? 'unspecified',
      sources: Object.fromEntries(Object.entries(files).map(([k, [rel]]) => [rel, sha(k)])),
      dataPeriod: 'NSO PLFS, April to December 2025',
      figuresSha256: figuresDigest(figures),
    },
    figures,
  }
  writeFileSync(target, JSON.stringify(out, null, 2) + '\n')
  console.log(`wrote ${target}`)
}
