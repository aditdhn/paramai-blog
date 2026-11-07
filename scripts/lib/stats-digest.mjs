import { createHash } from 'node:crypto'

// Canonical (key-sorted) JSON so the digest does not depend on key order or whitespace.
const canon = (v) =>
  Array.isArray(v)
    ? v.map(canon)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))
      : v

export const figuresDigest = (figures) =>
  createHash('sha256').update(JSON.stringify(canon(figures))).digest('hex')
