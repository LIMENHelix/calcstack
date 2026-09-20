// Structural audit: every metadata slug has a component + why entry; no dups; valid categories;
// variants/stats/personas reference real slugs; sitemap consistent.
import { readFileSync, readdirSync } from 'node:fs'

const VALID_CATS = new Set(['Trades & Engineering', 'Home & Yard', 'Careers & Salary', 'Freelance & Career', 'Auto & Transport', 'Retirement', 'Savings & Investing', 'Everyday Money', 'Housing & Mortgage', 'Loans & Debt', 'Health & Life', 'Fitness & Sports', 'Investing & Crypto', 'School & Science'])

const calcSrc = readFileSync('src/data/calculators.ts', 'utf8')
const slugs = [...calcSrc.matchAll(/slug: '([^']+)'/g)].map(m => m[1])
const cats = [...calcSrc.matchAll(/category: '([^']+)'/g)].map(m => m[1])

const problems = []

// dup slugs
const seen = new Map()
slugs.forEach(s => seen.set(s, (seen.get(s) || 0) + 1))
const dups = [...seen].filter(([, n]) => n > 1)
if (dups.length) problems.push(`DUP SLUGS: ${dups.map(([s, n]) => `${s}×${n}`).join(', ')}`)

// categories
const badCats = [...new Set(cats.filter(c => !VALID_CATS.has(c)))]
if (badCats.length) problems.push(`BAD CATEGORIES: ${badCats.join(', ')}`)

// component registrations across all map files
const mapFiles = readdirSync('src/calcs').filter(f => f.endsWith('.tsx'))
const compSlugs = []
for (const f of mapFiles) {
  const src = readFileSync(`src/calcs/${f}`, 'utf8')
  for (const m of src.matchAll(/'([a-z0-9-]+)':\s*[A-Z]\w+Calc/g)) compSlugs.push(m[1])
}
const compSet = new Set(compSlugs)
const metaSet = new Set(slugs)
const noComp = slugs.filter(s => !compSet.has(s))
const noMeta = [...compSet].filter(s => !metaSet.has(s))
if (noComp.length) problems.push(`METADATA WITHOUT COMPONENT (${noComp.length}): ${noComp.join(', ')}`)
if (noMeta.length) problems.push(`COMPONENT WITHOUT METADATA (${noMeta.length}): ${noMeta.join(', ')}`)

// why.ts coverage
const whySrc = readFileSync('src/data/why.ts', 'utf8')
const whyKeys = new Set([...whySrc.matchAll(/'([a-z0-9-]+)':/g)].map(m => m[1]))
const noWhy = slugs.filter(s => !whyKeys.has(s))
if (noWhy.length) problems.push(`MISSING WHY (${noWhy.length}): ${noWhy.join(', ')}`)

// variants/stats/personas reference real calculator slugs
for (const [file, re] of [['src/data/variants.ts', /calcSlug: '([^']+)'/g], ['src/data/stats.ts', /calcSlug: '([^']+)'/g], ['src/data/personas.ts', /calcSlugs:\s*\[([^\]]*)\]/g]]) {
  try {
    const src = readFileSync(file, 'utf8')
    if (file.endsWith('personas.ts')) {
      for (const m of src.matchAll(re)) {
        const refs = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1])
        const bad = refs.filter(s => !metaSet.has(s))
        if (bad.length) problems.push(`${file} BAD REFS: ${bad.join(', ')}`)
      }
    } else {
      const refs = [...src.matchAll(re)].map(m => m[1])
      const bad = [...new Set(refs.filter(s => !metaSet.has(s)))]
      if (bad.length) problems.push(`${file} BAD REFS: ${bad.join(', ')}`)
    }
  } catch { /* file may not exist */ }
}

// metadata field completeness per entry (rough block parse)
const blocks = calcSrc.split(/\n  \{\n/).slice(1)
let fieldIssues = []
for (const b of blocks) {
  const slug = (b.match(/slug: '([^']+)'/) || [])[1]
  if (!slug) continue
  for (const field of ['title:', 'shortTitle:', 'category:', 'description:', 'tagline:', 'intro:', 'howItWorks:', 'faq:']) {
    if (!b.includes(field)) fieldIssues.push(`${slug} missing ${field}`)
  }
  const faqCount = (b.match(/\bq: '/g) || []).length
  if (faqCount < 2) fieldIssues.push(`${slug} has only ${faqCount} FAQs`)
  const hiwCount = (b.match(/^\s+'[^']+',$/gm) || []).length
  if (hiwCount < 3) fieldIssues.push(`${slug} howItWorks looks thin (${hiwCount})`)
}
if (fieldIssues.length) problems.push(`FIELD ISSUES (${fieldIssues.length}): ${fieldIssues.slice(0, 20).join(' | ')}${fieldIssues.length > 20 ? ' …' : ''}`)

// sitemap consistency
const site = readFileSync('public/sitemap.xml', 'utf8')
const locCount = (site.match(/<loc>/g) || []).length
console.log(`calculators.ts slugs: ${slugs.length} | component regs: ${compSlugs.length} | why entries: ${whyKeys.size} | sitemap URLs: ${locCount}`)
console.log(problems.length ? `\nPROBLEMS:\n${problems.join('\n')}` : '\nALL STRUCTURAL CHECKS PASS')
