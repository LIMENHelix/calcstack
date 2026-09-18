// Regenerates public/sitemap.xml from the data files — run before build/deploy
// whenever calculators or variants change:  node scripts/gen-sitemap.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const SITE = 'https://calcstack-eight.vercel.app'

const calcSrc = readFileSync('src/data/calculators.ts', 'utf8')
const varSrc = readFileSync('src/data/variants.ts', 'utf8')
const statsSrc = readFileSync('src/data/stats.ts', 'utf8')
const personaSrc = readFileSync('src/data/personas.ts', 'utf8')
const personaSlugs = [...personaSrc.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1])

// literal slugs:  slug: 'some-slug'
const literalSlugs = [...(calcSrc + varSrc).matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1])

// generated state/city slugs: slugState / slugCity entries
const stateSlugs = [...varSrc.matchAll(/slugState: '([a-z0-9-]+)'/g)].map((m) => `sales-tax-calculator-${m[1]}`)
const citySlugs = [...varSrc.matchAll(/slugCity: '([a-z0-9-]+)'/g)].map((m) => `sales-tax-calculator-${m[1]}`)

// paycheck variants: generated from state rules in paycheck.ts
const paySrc = readFileSync('src/data/paycheck.ts', 'utf8')
const paycheckSlugs = [...paySrc.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => `paycheck-calculator-${m[1]}`)

const calcSlugs = [...new Set([...literalSlugs, ...stateSlugs, ...citySlugs, ...paycheckSlugs])].sort()

// per-state data pages from stats.ts (HOME_VALUES slugs)
const stateDataSlugs = [...statsSrc.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1])

const urls = [
  `  <url><loc>${SITE}/</loc><priority>1.0</priority></url>`,
  `  <url><loc>${SITE}/tools/bill-analyzer</loc><priority>0.9</priority></url>`,
  `  <url><loc>${SITE}/data/mortgage-payment-by-state</loc><priority>0.8</priority></url>`,
  `  <url><loc>${SITE}/data/average-salary-by-job</loc><priority>0.8</priority></url>`,
  `  <url><loc>${SITE}/directory</loc><priority>0.7</priority></url>`,
  `  <url><loc>${SITE}/embeds</loc><priority>0.7</priority></url>`,
  `  <url><loc>${SITE}/tax-season</loc><priority>0.8</priority></url>`,
  `  <url><loc>${SITE}/for</loc><priority>0.8</priority></url>`,
  ...personaSlugs.map((s) => `  <url><loc>${SITE}/for/${s}</loc><priority>0.8</priority></url>`),
  ...stateDataSlugs.map((s) => `  <url><loc>${SITE}/data/mortgage-payment-in/${s}</loc></url>`),
  ...calcSlugs.map((s) => `  <url><loc>${SITE}/calculators/${s}</loc></url>`),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`

writeFileSync('public/sitemap.xml', xml)
console.log(`sitemap.xml written: ${urls.length} URLs`)
