// Reading time estimator. 200 wpm is the standard English-prose rate used by
// Medium and most blog platforms. For technical/career content that's slightly
// denser, the real value is probably closer to 180 — but 200 is the convention
// readers expect, and the number is meant as a rough guide, not a stopwatch.
const WORDS_PER_MINUTE = 200

export function readingTime(markdown: string): string {
  const words = markdown
    .replace(/<[^>]*>/g, ' ') // strip inline HTML in MDX
    .replace(/[`*_#>[\]()]/g, ' ') // strip markdown syntax chars
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  return `${minutes} min read`
}
