#!/usr/bin/env node
// One-shot seed: writes an .mdx stub for each of the 41 KB sectors.
// Safe to re-run: existing files are skipped unless --force is passed.
//
// Usage:
//   node scripts/seed-sectors.mjs
//   node scripts/seed-sectors.mjs --force
import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'src', 'content', 'sectors')

// Mirrors src/backend/data/knowledge_bank/sector_*.json (41 sectors).
// Order = S1..S41. Keep this list in sync if the backend adds/removes sectors.
const SECTORS = [
  ['S1', 'ai-ml', 'AI & Machine Learning', 'From LLM engineers to applied ML researchers — the careers defining India’s AI decade.'],
  ['S2', 'data-science', 'Data Science & Analytics', 'Turning messy data into decisions: analysts, scientists, and data engineers.'],
  ['S3', 'cloud-devops', 'Cloud & DevOps', 'Platform engineers, SREs, and the people keeping modern software running.'],
  ['S4', 'cybersecurity', 'Cybersecurity', 'Offensive, defensive, and governance roles in an under-supplied field.'],
  ['S5', 'software-engineering', 'Software Engineering', 'The broad software craft — backend, frontend, mobile, systems.'],
  ['S6', 'fintech', 'Fintech', 'Payments, lending, wealth, and the financial rails of Digital India.'],
  ['S7', 'biotech', 'Biotech', 'Life sciences meets engineering — from synthetic biology to diagnostics.'],
  ['S8', 'renewable-energy', 'Renewable Energy', 'Solar, wind, storage, and grid engineering for the energy transition.'],
  ['S9', 'health-tech', 'Health Tech', 'Digital health, medical devices, and healthcare delivery innovation.'],
  ['S10', 'space-tech', 'Space Tech', 'India’s private space sector — launch, satellites, and downstream services.'],
  ['S11', 'quantum', 'Quantum Technologies', 'Quantum computing, sensing, and communications — a deep-tech frontier.'],
  ['S12', 'advanced-manufacturing', 'Advanced Manufacturing', 'Robotics, additive manufacturing, and the factory of the future.'],
  ['S13', 'agritech', 'Agritech', 'Precision agriculture, supply-chain tech, and climate-resilient farming.'],
  ['S14', 'edtech', 'EdTech', 'Learning platforms, assessment, tutoring, and education infrastructure.'],
  ['S15', 'creative-tech-media-entertainment', 'Creative Tech, Media & Entertainment', 'Gaming, animation, XR, and digital storytelling careers.'],
  ['S16', 'legal-tech-compliance', 'Legal Tech & Compliance', 'Automating legal workflows, compliance, and regulatory intelligence.'],
  ['S17', 'smart-cities-urban-tech', 'Smart Cities & Urban Tech', 'Urban mobility, IoT, and civic infrastructure careers.'],
  ['S18', 'logistics-scm-ecommerce', 'Logistics, SCM & E-commerce', 'Supply chains, warehousing, last-mile, and commerce tech.'],
  ['S19', 'mental-health-wellness', 'Mental Health & Wellness', 'Clinical, coaching, and digital-first wellness careers.'],
  ['S20', 'tourism-hospitality', 'Tourism & Hospitality', 'Experience design, operations, and hospitality tech.'],
  ['S21', 'healthcare-clinical', 'Healthcare & Clinical', 'Doctors, nurses, allied health, and hospital operations.'],
  ['S22', 'nuclear-advanced-energy', 'Nuclear & Advanced Energy', 'Fission, fusion, and next-generation power generation.'],
  ['S23', 'defence-tech', 'Defence Tech', 'Dual-use technology, indigenous defence, and strategic industries.'],
  ['S24', 'neuroscience-cognitive', 'Neuroscience & Cognitive Science', 'Brain, mind, and the science of learning and behaviour.'],
  ['S25', 'marine-ocean-water', 'Marine, Ocean & Water', 'Oceanography, marine engineering, and water infrastructure.'],
  ['S26', 'hr-tech-future-of-work', 'HR Tech & Future of Work', 'Talent platforms, people analytics, and workplace design.'],
  ['S27', 'real-estate-proptech', 'Real Estate & PropTech', 'Property markets, construction tech, and built-environment careers.'],
  ['S28', 'sports-science-tech', 'Sports Science & Tech', 'Performance, analytics, and the business of sport.'],
  ['S29', 'fashion-tech-retail', 'Fashion Tech & Retail', 'Design, merchandising, and retail-tech careers.'],
  ['S30', 'psychology-behavioral-econ', 'Psychology & Behavioural Economics', 'Human behaviour applied to products, policy, and health.'],
  ['S31', 'international-dev-ngo', 'International Development & NGOs', 'Impact careers across development, policy, and humanitarian work.'],
  ['S32', 'hybrid-crossdisciplinary', 'Hybrid & Cross-Disciplinary', 'Careers that live between fields — and why they’re exploding.'],
  ['S33', 'govtech-public-admin', 'GovTech & Public Administration', 'Civil services, public-sector technology, and governance.'],
  ['S34', 'media-journalism', 'Media & Journalism', 'Reporting, editing, and the modern newsroom.'],
  ['S35', 'automotive-mobility', 'Automotive & Mobility', 'EVs, autonomy, and the future of how India moves.'],
  ['S36', 'chemicals-materials-nano', 'Chemicals, Materials & Nanotech', 'Materials science and specialty chemistry careers.'],
  ['S37', 'entrepreneurship-vc', 'Entrepreneurship & Venture Capital', 'Founders, operators, and investors.'],
  ['S38', 'language-culture', 'Language & Culture', 'Translation, linguistics, cultural research, and the humanities.'],
  ['S39', 'south-asia-frontier', 'South Asia Frontier Roles', 'Emerging regional careers across South Asia.'],
  ['S40', 'skilled-trades', 'Skilled Trades', 'Electricians, technicians, and the vocational economy.'],
  ['S41', 'business-sales-management', 'Business, Sales & Management', 'General management, sales leadership, and operations roles.'],
]

const force = process.argv.includes('--force')
mkdirSync(OUT_DIR, { recursive: true })

const today = new Date().toISOString().slice(0, 10)

let created = 0
let skipped = 0
for (const [id, slug, title, tagline] of SECTORS) {
  const filePath = join(OUT_DIR, `${slug}.mdx`)
  if (existsSync(filePath) && !force) {
    skipped++
    continue
  }
  const body = `---
title: "${title}"
description: "${tagline}"
sectorId: "${id}"
sectorSlug: "${slug}"
heroTagline: "${tagline}"
pubDate: ${today}
tags: ["sector", "${slug}"]
draft: true
---

import AssessmentCTA from '@/components/AssessmentCTA.astro'

## What this sector covers

> **TODO:** Write 2-3 paragraphs on what ${title.toLowerCase()} actually involves
> in India in 2026 — major sub-areas, typical employers, and how the sector is
> changing. Keep it honest; skip the hype.

## Who thrives here

> **TODO:** What personality profile (RIASEC + OCEAN) tends to fit this sector?
> Pull language from ParamAI’s trait model so the page ranks for assessment-
> related queries.

## Entry paths

> **TODO:** 3-4 realistic entry paths (degree routes, bootcamps, apprenticeships,
> lateral moves). Link to the specific careers in ParamAI’s knowledge bank.

<AssessmentCTA sectorSlug="${slug}" />

## Further reading

> **TODO:** Link 2-3 authoritative external sources (reports, syllabi,
> government programs).
`
  writeFileSync(filePath, body, 'utf8')
  created++
}

console.log(`Seed complete: ${created} created, ${skipped} skipped (use --force to overwrite).`)
