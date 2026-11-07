#!/usr/bin/env node
// Fails (exit 1) if src/data/career-stats.json was edited by hand: its figures
// must hash to the digest recorded by scripts/refresh-career-stats.mjs, and the
// structural invariants the page relies on must hold. Runs before every build.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { figuresDigest } from './lib/stats-digest.mjs'

const file = resolve(fileURLToPath(import.meta.url), '../../src/data/career-stats.json')
const { meta, figures } = JSON.parse(readFileSync(file, 'utf8'))
const errors = []

if (figuresDigest(figures) !== meta.figuresSha256) {
  errors.push(
    'figures do not match meta.figuresSha256: the JSON was edited by hand. Revert it, or re-run scripts/refresh-career-stats.mjs against the source files (see CONTENT_MAP.md).',
  )
}
if (figures.fields.length !== 13) errors.push(`expected 13 fields, found ${figures.fields.length}`)
if (new Set(figures.fields.map((f) => f.id)).size !== figures.fields.length) errors.push('duplicate field ids')
if (figures.ladders.length !== 4) errors.push(`expected 4 ladders, found ${figures.ladders.length}`)
for (const l of figures.ladders) {
  l.stages.forEach((s, i) => {
    if (i > 0 && s.fromYear <= l.stages[i - 1].fromYear) errors.push(`${l.id}: stage years not increasing`)
    if (s.topPayRs <= (i === 0 ? l.startPayRs : l.stages[i - 1].topPayRs)) errors.push(`${l.id}: pay not increasing at ${s.title}`)
  })
}

if (errors.length) {
  console.error('career-stats check FAILED:\n - ' + errors.join('\n - '))
  process.exit(1)
}
console.log('career-stats check OK (' + meta.figuresSha256.slice(0, 12) + ')')
