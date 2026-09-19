import fs from 'fs'

const path = 'src/data/personas.ts'
let t = fs.readFileSync(path, 'utf8')

// persona slug -> { remove: [...], addAfter: { anchorSlug: [slugsToInsert...] } }
const PLAN = {
  'real-estate-agents': {
    remove: ['sales-tax-calculator', 'percentage-calculator'],
    addAfter: { 'gci-goal-calculator': ['closing-cost-calculator', 'dti-calculator', 'home-affordability-calculator', 'mortgage-points-calculator', 'prorated-rent-calculator'] },
  },
  'teachers': {
    remove: ['sales-tax-calculator', 'percentage-calculator'],
    addAfter: { 'teacher-pay-calculator': ['final-grade-calculator', 'student-loan-idr-calculator', 'pension-lump-sum-vs-annuity-calculator'] },
  },
  'engineers': {
    remove: ['crypto-profit-calculator', 'percentage-calculator'],
    addAfter: { 'salary-to-hourly-calculator': ['paycheck-withholding-calculator', 'bonus-tax-calculator'] },
  },
  'truck-drivers': {
    remove: ['percentage-calculator'],
    addAfter: { 'truck-driver-pay-calculator': ['mileage-deduction-calculator', 'mileage-vs-actual-expense-calculator', 'quarterly-estimated-tax-calculator', 'self-employment-tax-calculator'] },
  },
  'military-veterans': {
    remove: ['percentage-calculator'],
    addAfter: { 'va-loan-calculator': ['moving-cost-calculator', 'cost-of-living-comparison-calculator', 'rent-vs-buy-calculator', 'home-affordability-calculator'] },
  },
  'accountants': {
    remove: ['percentage-calculator'],
    addAfter: { 'marginal-tax-bracket-calculator': ['paycheck-withholding-calculator', 'quarterly-estimated-tax-calculator'] },
  },
  'doctors': {
    remove: [],
    addAfter: { 'wrvu-compensation-calculator': ['student-loan-idr-calculator', 'student-loan-vs-investing-calculator'] },
  },
  'students': {
    remove: ['date-difference-calculator'],
    addAfter: { 'gpa-calculator': ['final-grade-calculator'], '50-30-20-budget-calculator': ['rent-affordability-calculator'] },
  },
  'tipped-workers': {
    remove: ['discount-calculator'],
    addAfter: { 'tip-pool-calculator': ['paycheck-withholding-calculator', 'w4-withholding-calculator'] },
  },
  'first-time-homebuyers': {
    remove: ['sales-tax-calculator', 'percentage-calculator'],
    addAfter: { 'rent-vs-buy-calculator': ['rent-affordability-calculator', 'moving-cost-calculator'] },
  },
  'landlords': {
    remove: ['sales-tax-calculator', 'percentage-calculator'],
    addAfter: { 'prorated-rent-calculator': ['mortgage-points-calculator', 'closing-cost-calculator', 'commercial-lease-calculator', '15-year-mortgage-calculator'] },
  },
}

const parts = t.split(/(?=\n  \{\n    slug: ')/)
let changed = 0

const out = parts.map((part) => {
  const m = part.match(/^\n  \{\n    slug: '([^']+)'/)
  if (!m || !PLAN[m[1]]) return part
  const slug = m[1]
  const plan = PLAN[slug]
  const cs = part.match(/calcSlugs: \[([\s\S]*?)\]/)
  if (!cs) throw new Error(`no calcSlugs in ${slug}`)
  let slugs = [...cs[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
  const before = slugs.length
  for (const rem of plan.remove) {
    if (!slugs.includes(rem)) throw new Error(`${slug}: cannot remove missing ${rem}`)
    slugs = slugs.filter((s) => s !== rem)
  }
  for (const [anchor, adds] of Object.entries(plan.addAfter)) {
    const idx = slugs.indexOf(anchor)
    if (idx === -1) throw new Error(`${slug}: anchor ${anchor} not found`)
    const fresh = adds.filter((a) => !slugs.includes(a))
    slugs.splice(idx + 1, 0, ...fresh)
  }
  console.log(`${slug}: ${before} -> ${slugs.length} tools`)
  changed++
  const newList = 'calcSlugs: [\n' + slugs.map((s) => `      '${s}',`).join('\n') + '\n    ]'
  return part.replace(/calcSlugs: \[[\s\S]*?\]/, newList)
})

if (changed !== Object.keys(PLAN).length) throw new Error(`only ${changed} personas matched`)
fs.writeFileSync(path, out.join(''))
console.log('personas.ts rewritten,', changed, 'personas updated')
