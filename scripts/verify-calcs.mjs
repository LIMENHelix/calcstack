#!/usr/bin/env node
/**
 * Static calculator verification: every metadata slug must have
 *   1. a registered component in a calcs/*.tsx registry
 *   2. a WHY_USE entry
 *   3. an entry in public/sitemap.xml
 *   4. complete metadata fields (title, description, intro, howItWorks, faq)
 * Also: every registered component slug must have metadata.
 * Run: node scripts/verify-calcs.mjs
 */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const calcsDir = join(root, 'src/calcs')

// --- collect registered component slugs from all registry exports ---
const componentSlugs = new Set()
const tsxFiles = [
  ...readdirSync(calcsDir).filter((f) => f.endsWith('.tsx')).map((f) => join(calcsDir, f)),
  ...readdirSync(join(calcsDir, 'more-waves'))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => join(calcsDir, 'more-waves', f)),
]
for (const f of tsxFiles) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/^ {2}'([a-z0-9-]+)':\s*\w+,?\s*$/gm)) componentSlugs.add(m[1])
}
// paycheck-calculator registers inline in CalculatorPage.tsx
const pageSrc = readFileSync(join(root, 'src/pages/CalculatorPage.tsx'), 'utf8')
for (const m of pageSrc.matchAll(/^ {2}'([a-z0-9-]+)':\s*\w+,?\s*$/gm)) componentSlugs.add(m[1])
// lazy registry (more-lazy.ts)
const lazySrc = readFileSync(join(calcsDir, 'more-lazy.ts'), 'utf8')
for (const m of lazySrc.matchAll(/^ {2}'([a-z0-9-]+)':\s*lazy\(/gm)) componentSlugs.add(m[1])

// --- metadata slugs + field completeness ---
const calcSrc = readFileSync(join(root, 'src/data/calculators.ts'), 'utf8')
const metaSlugs = [...calcSrc.matchAll(/^ {4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1])
const metaSet = new Set(metaSlugs)

// crude completeness check: each entry block should contain these fields
const entries = calcSrc.split(/^ {2}\{\n/gm).slice(1)
const incomplete = []
for (const block of entries) {
  const slug = (block.match(/slug: '([a-z0-9-]+)'/) || [])[1]
  if (!slug) continue
  for (const field of ['title:', 'description:', 'intro:', 'howItWorks:', 'faq:']) {
    if (!block.includes(field)) incomplete.push(`${slug} missing ${field}`)
  }
}

// --- why.ts entries ---
const whySrc = readFileSync(join(root, 'src/data/why.ts'), 'utf8')
const whySlugs = new Set([...whySrc.matchAll(/^ {2}'([a-z0-9-]+)':$/gm)].map((m) => m[1]))

// --- sitemap ---
const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')

let fail = 0
const err = (msg) => { console.error('FAIL:', msg); fail++ }

for (const slug of metaSlugs) {
  if (!componentSlugs.has(slug)) err(`${slug}: metadata but no registered component`)
  if (!whySlugs.has(slug)) err(`${slug}: no WHY_USE entry`)
  if (!sitemap.includes(`/calculators/${slug}`)) err(`${slug}: not in sitemap`)
}
for (const slug of componentSlugs) {
  if (!metaSet.has(slug)) err(`${slug}: component registered but no metadata entry`)
}
for (const msg of incomplete) err(msg)

console.log(`checked ${metaSlugs.length} metadata entries, ${componentSlugs.size} components, ${whySlugs.size} why-entries`)
if (fail === 0) console.log('ALL CHECKS PASSED')
else { console.error(`${fail} problem(s) found`); process.exit(1) }
