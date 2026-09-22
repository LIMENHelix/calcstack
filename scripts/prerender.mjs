// Prerender: writes a unique static index.html for every route so crawlers get
// a real title, meta description, canonical, OG tags, JSON-LD, and meaningful
// text content in the first payload — not the empty SPA shell. The React app
// still boots on top for visitors (createRoot replaces the stub).
// Runs as part of `npm run build` (postbuild step, after vite build).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const req = createRequire(import.meta.url)
const esbuild = req('esbuild')
const result = esbuild.buildSync({
  stdin: {
    contents: `
export { CALCULATORS } from './src/data/calculators'
export { VARIANTS } from './src/data/variants'
export { WHY_USE } from './src/data/why'
export { PERSONAS } from './src/data/personas'
export { HOME_VALUES, DATA_YEAR } from './src/data/stats'
`,
    loader: 'ts',
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  logLevel: 'silent',
})
const mod = { exports: {} }
new Function('module', 'exports', 'require', result.outputFiles[0].text)(mod, mod.exports, req)
const { CALCULATORS, VARIANTS, WHY_USE, PERSONAS, HOME_VALUES, DATA_YEAR } = mod.exports

const SITE = 'https://calcstack.app/calcstack'
const template = readFileSync('dist/index.html', 'utf8')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function renderPage({ path, title, description, stub, jsonLd }) {
  const url = `${SITE}${path}`
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
      `<meta name="description" content="${esc(description)}" />`,
    )
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s,
      `<meta property="og:description" content="${esc(description)}" />`,
    )
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s,
      `<meta name="twitter:description" content="${esc(description)}" />`,
    )
  const headExtras = [
    `<link rel="canonical" href="${url}" />`,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n    ')
  html = html.replace('</head>', `    ${headExtras}\n  </head>`)
  html = html.replace('<div id="root"></div>', `<div id="root">${stub}</div>`)
  const out = join('dist', 'calcstack', path, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

const S =
  'max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#1c1917'

function calcStub(c) {
  const why = WHY_USE[c.slug]
  return `<div style="${S}">
  <p style="font-size:14px;color:#78716c">CalcStack — free, instant, no signup. The interactive calculator loads automatically.</p>
  <h1 style="font-size:28px;margin:8px 0 4px">${esc(c.shortTitle)}</h1>
  <p style="font-size:16px;color:#57534e"><em>${esc(c.tagline)}</em></p>
  <p>${esc(c.intro)}</p>
  ${why ? `<h2 style="font-size:20px;margin:24px 0 8px">Why people use this</h2>\n  <p>${esc(why)}</p>` : ''}
  <h2 style="font-size:20px;margin:24px 0 8px">How it works</h2>
  <ol>${c.howItWorks.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
  <h2 style="font-size:20px;margin:24px 0 8px">Common questions</h2>
  ${c.faq.map((f) => `<h3 style="font-size:16px;margin:16px 0 4px">${esc(f.q)}</h3>\n  <p>${esc(f.a)}</p>`).join('\n  ')}
  <p style="margin-top:24px"><a href="${SITE}/directory">Browse all 500+ free calculators →</a></p>
</div>`
}

const faqJsonLd = (c, path) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: c.faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

let count = 0

// Every calculator + variant page (includes all state paycheck/sales-tax pages)
for (const c of [...CALCULATORS, ...VARIANTS]) {
  const path = `/calculators/${c.slug}`
  renderPage({
    path,
    title: c.title,
    description: c.description,
    stub: calcStub(c),
    jsonLd: c.faq.length ? faqJsonLd(c, path) : null,
  })
  count++
}

// Persona pages
for (const p of PERSONAS) {
  renderPage({
    path: `/for/${p.slug}`,
    title: p.title,
    description: p.description,
    stub: `<div style="${S}">
  <h1 style="font-size:28px;margin:8px 0 4px">Calculators for ${esc(p.job)}</h1>
  <p>${esc(p.hero)}</p>
  <h2 style="font-size:20px;margin:24px 0 8px">The questions these tools answer</h2>
  <ul>${p.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
  <h2 style="font-size:20px;margin:24px 0 8px">Common questions</h2>
  ${p.faq.map((f) => `<h3 style="font-size:16px;margin:16px 0 4px">${esc(f.q)}</h3>\n  <p>${esc(f.a)}</p>`).join('\n  ')}
  <p style="margin-top:24px"><a href="${SITE}/directory">Browse all 500+ free calculators →</a></p>
</div>`,
    jsonLd: p.faq.length ? faqJsonLd(p, `/for/${p.slug}`) : null,
  })
  count++
}

// State mortgage data pages
for (const s of HOME_VALUES) {
  renderPage({
    path: `/data/mortgage-payment-in/${s.slug}`,
    title: `Average Mortgage Payment in ${s.state} (${DATA_YEAR})`,
    description: `Median home price in ${s.state} and the monthly payment it implies at current rates — principal, interest, taxes, and insurance broken down.`,
    stub: `<div style="${S}">
  <h1 style="font-size:28px;margin:8px 0 4px">Average Mortgage Payment in ${esc(s.state)} (${DATA_YEAR})</h1>
  <p>The median single-family sale price in ${esc(s.state)} is $${s.value.toLocaleString('en-US')} (Redfin, May ${DATA_YEAR}). This page turns that price into a real monthly payment and compares it with every other state.</p>
  <p><a href="${SITE}/data/mortgage-payment-by-state">Compare all states →</a></p>
</div>`,
  })
  count++
}

// Static pages — unique titles/descriptions, light stubs
const STATIC = [
  ['/directory', 'Directory — All 500+ Free Calculators', 'Every CalcStack calculator organized by profession, state, and goal.'],
  ['/invest', 'Investing — Live Quotes + the Math That Turns Prices into Decisions', 'Live market quotes next to compound growth, DCA, capital gains, Coast FIRE, and retirement calculators.'],
  ['/calcy', "Calcy's Paper Portfolio — $100k, Real Prices, Public Reasoning", "CalcStack's mascot runs a virtual $100,000 portfolio marked to real market prices, with every trade's reasoning on the record."],
  ['/tools/bill-analyzer', 'Bill Analyzer — Paste Your Bills, See Where the Money Goes', 'Paste bills as plain text: monthly and yearly totals, spending by category, and overpayment flags. 100% private, runs in your browser.'],
  ['/data/mortgage-payment-by-state', `Average Mortgage Payment by State (${DATA_YEAR})`, 'Median home prices and implied monthly payments for all 50 states, ranked and compared.'],
  ['/data/average-salary-by-job', 'Average Salary by Job', 'Typical pay for dozens of jobs — compare your offer, your raise, or your career change.'],
  ['/tax-season', 'Tax Season — Every Calculator You Need Before You File', 'Paycheck withholding, W-4, freelancer quarterly taxes, deductions, and refund math in one place.'],
  ['/open-enrollment', 'Open Enrollment — Benefits Math, Decoded', 'HSA vs FSA, high-deductible vs PPO, and 401(k) match math for benefits season.'],
  ['/home-buying', 'Home Buying — The Complete Math Toolkit', 'Mortgage payments, PMI drop-off, closing costs, rent vs buy, and down-payment savings plans.'],
  ['/advertise', 'Advertise on CalcStack', 'Put your business in front of people actively doing money math — contractors, nurses, agents, trainers, and owners.'],
  ['/embeds', 'Embed CalcStack — Free Calculators for Your Site', 'Drop any CalcStack calculator into your website with one iframe snippet. Free.'],
  ['/for', 'Calculators by Profession', 'Curated calculator toolkits for contractors, nurses, agents, trainers, drivers, owners, and more.'],
]
for (const [path, title, description] of STATIC) {
  renderPage({
    path,
    title,
    description,
    stub: `<div style="${S}"><h1 style="font-size:28px;margin:8px 0 4px">${esc(title)}</h1>\n  <p>${esc(description)}</p></div>`,
  })
  count++
}

console.log(`prerender complete: ${count} unique route pages written to dist/calcstack/`)
