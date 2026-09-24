/* LIMEN Helix bridge config — maps CalcStack clusters to the portal domain
   that is reading the same system live. CalcStack is the P0/P1 layer: free
   tools that hand traffic uphill to the domain's live read and paid tiers.
   Category defaults + slug keyword overrides for tools that belong to a
   different domain than their store category. */

export interface LimenDomain {
  url: string
  label: string // portal domain name
  line: string // "LIMEN Helix is reading the ___ system live"
}

const DOMAINS: Record<string, LimenDomain> = {
  finance: {
    url: 'https://limenhelix.com/finance',
    label: 'finance',
    line: 'the financial system — rates, bank health, market stress',
  },
  economy: {
    url: 'https://limenhelix.com/economy',
    label: 'economy',
    line: 'the economy — jobs, prices, and output',
  },
  energy: {
    url: 'https://limenhelix.com/energy',
    label: 'energy',
    line: 'the energy system — grids, fuel, and rates',
  },
  utility: {
    url: 'https://limenhelix.com/utility-watch',
    label: 'utility watch',
    line: 'utility companies, read from their own filings',
  },
  medicine: {
    url: 'https://limenhelix.com/medicine',
    label: 'medicine',
    line: 'the public-health system',
  },
  infrastructure: {
    url: 'https://limenhelix.com/infrastructure',
    label: 'infrastructure',
    line: 'infrastructure — build costs and stress',
  },
  governance: {
    url: 'https://limenhelix.com/governance',
    label: 'governance',
    line: 'governance — budgets, tax, and policy',
  },
  education: {
    url: 'https://limenhelix.com/education',
    label: 'education',
    line: 'the education system',
  },
  trade: {
    url: 'https://limenhelix.com/trade',
    label: 'trade',
    line: 'trade flows and tariffs',
  },
  defense: {
    url: 'https://limenhelix.com/defense',
    label: 'defense',
    line: 'the defense system',
  },
  industry: {
    url: 'https://limenhelix.com/industry',
    label: 'industry',
    line: 'industry and manufacturing',
  },
  agriculture: {
    url: 'https://limenhelix.com/agriculture',
    label: 'agriculture',
    line: 'agriculture — crops, inputs, and prices',
  },
  environment: {
    url: 'https://limenhelix.com/environment',
    label: 'environment',
    line: 'the environment',
  },
  culture: {
    url: 'https://limenhelix.com/culture',
    label: 'culture',
    line: 'culture and events',
  },
}

const CATEGORY_MAP: Record<string, keyof typeof DOMAINS> = {
  'Savings & Investing': 'finance',
  'Investing & Crypto': 'finance',
  'Everyday Money': 'finance',
  'Loans & Debt': 'finance',
  Retirement: 'finance',
  'Housing & Mortgage': 'finance',
  'Freelance & Career': 'economy',
  'Careers & Salary': 'economy',
  'Auto & Transport': 'energy',
  'Home & Yard': 'infrastructure',
  'Trades & Engineering': 'infrastructure',
  'Fitness & Sports': 'medicine',
  'Health & Life': 'medicine',
  'School & Science': 'education',
}

/* Slug keyword overrides — checked before the category default. Order matters:
   first match wins. Keep these specific and safe. */
const SLUG_OVERRIDES: [RegExp, keyof typeof DOMAINS][] = [
  [/\b(bah|military|va-loan|pcs)/, 'defense'],
  [/\b(solar|utility|kwh|kilowatt|heat-pump|ev-vs-gas|ev-home)/, 'energy'],
  [/\b(gpa|grade|sat|act|tuition)/, 'education'],
  [/\b(tariff|landed-cost|import)/, 'trade'],
  [/\b(property-tax|w4|w-4|withholding)/, 'governance'],
  [/\b(wedding|event|party)/, 'culture'],
  [/\b(farm|crop|yield|fertilizer|livestock|acre)/, 'agriculture'],
  [/\b(carbon|recycl|compost|rainwater)/, 'environment'],
  [/\b(oee|machin|manufactur)/, 'industry'],
  [/\b(gut|septic|lawn|renov|remodel|roof|concrete|asphalt|gravel|paint|floor|fence|deck|drywall|hvac|plumb|electric|weld|board|lumber)/, 'infrastructure'],
]

export function limenFor(category: string, slug: string): LimenDomain | null {
  for (const [re, key] of SLUG_OVERRIDES) {
    if (re.test(slug)) return DOMAINS[key]
  }
  const key = CATEGORY_MAP[category]
  return key ? DOMAINS[key] : null
}
