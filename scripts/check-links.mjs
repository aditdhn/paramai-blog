#!/usr/bin/env node
// Build-time internal link check. Walks dist/**/*.html, resolves every internal
// href/src (with or without a trailing slash) against dist, and exits 1 if any
// target is missing. External hosts are listed, never fetched.
// Runs automatically after `npm run build` (npm "postbuild").
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, resolve, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(import.meta.url), '../../dist')
if (!existsSync(root)) {
  console.error('check-links: dist/ not found. Run `npm run build` first.')
  process.exit(2)
}

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

const htmlFiles = walk(root).filter((f) => f.endsWith('.html'))
const SITE = 'https://paramai.blog'
const externalHosts = new Map()
const missing = []
let checked = 0

const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.replace(/[?#].*$/, ''))
  const base = join(root, clean)
  if (!resolve(base).startsWith(root)) return false
  if (clean.endsWith('/')) return existsSync(join(base, 'index.html'))
  return (
    (existsSync(base) && statSync(base).isFile()) ||
    existsSync(base + '.html') ||
    existsSync(join(base, 'index.html'))
  )
}

// Group 3: href/src of a/link/img/script/source. Group 4: og:image / twitter:image style
// meta content pointing at this site (the social preview image).
const attrRe =
  /<(?:a|link|img|script|source)\b[^>]*?\s(?:href|src)="([^"]*)"|<meta\b[^>]*?\scontent="(https:\/\/paramai\.blog[^"]*\.(?:png|jpe?g|svg|webp))"/gi

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const page = '/' + relative(root, file).split(sep).join('/')
  for (const m of html.matchAll(attrRe)) {
    const url = (m[1] ?? m[2] ?? '').trim()
    if (!url || url.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(url)) continue
    let internal = null
    if (/^https?:\/\//i.test(url) || url.startsWith('//')) {
      const u = new URL(url.startsWith('//') ? 'https:' + url : url)
      if (u.origin === SITE) internal = u.pathname + u.search
      else {
        externalHosts.set(u.host, (externalHosts.get(u.host) ?? 0) + 1)
        continue
      }
    } else if (url.startsWith('/')) internal = url
    else continue // relative links are not used on this site
    checked++
    if (!exists(internal)) missing.push(`${page}  ->  ${url}`)
  }
}

console.log(`check-links: ${htmlFiles.length} pages, ${checked} internal links checked.`)
console.log('External hosts (not fetched): ' + ([...externalHosts.keys()].sort().join(', ') || 'none'))
if (missing.length) {
  console.error(`\ncheck-links FAILED: ${missing.length} broken internal link(s):`)
  for (const l of [...new Set(missing)]) console.error('  ' + l)
  process.exit(1)
}
console.log('check-links OK')
