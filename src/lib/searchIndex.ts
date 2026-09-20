import { CALCULATORS } from '@/data/calculators'
import { VARIANTS } from '@/data/variants'
import { HOME_VALUES } from '@/data/stats'

export interface SearchEntry {
  title: string
  path: string
  keywords: string
  kind: 'Calculator' | 'Tool' | 'Data'
}

const entries: SearchEntry[] = [
  ...CALCULATORS.map((c) => ({
    title: c.shortTitle,
    path: `/calculators/${c.slug}`,
    keywords: `${c.title} ${c.category} ${c.tagline}`,
    kind: 'Calculator' as const,
  })),
  ...VARIANTS.map((v) => ({
    title: v.shortTitle,
    path: `/calculators/${v.slug}`,
    keywords: `${v.title} ${v.category} ${v.tagline}`,
    kind: 'Calculator' as const,
  })),
  ...HOME_VALUES.map((h) => ({
    title: `Average Mortgage Payment in ${h.state}`,
    path: `/data/mortgage-payment-in/${h.slug}`,
    keywords: `mortgage payment ${h.state} home price house cost`,
    kind: 'Data' as const,
  })),
  {
    title: 'Bill Analyzer',
    path: '/tools/bill-analyzer',
    keywords: 'bills expenses budget analyze subscriptions overpaying paste',
    kind: 'Tool',
  },
  {
    title: 'Average Mortgage Payment by State',
    path: '/data/mortgage-payment-by-state',
    keywords: 'mortgage payment states comparison table home prices',
    kind: 'Data',
  },
  {
    title: 'Average Salary by Job',
    path: '/data/average-salary-by-job',
    keywords: 'salary jobs occupations pay wages income hourly',
    kind: 'Data',
  },
]

/** Ranked substring search over titles and keywords. */
export function searchAll(query: string, limit = 8): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const terms = q.split(/\s+/).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const scored = entries
    .map((e) => {
      const t = e.title.toLowerCase()
      const k = e.keywords.toLowerCase()
      let score = 0
      for (const term of terms) {
        const wordStart = new RegExp(`\\b${term}`).test(t) // "kansas" must not match "arKANSAS"
        if (t.startsWith(term)) score += 3
        else if (wordStart) score += 2
        else if (k.includes(term)) score += 1
        else if (t.includes(term)) score += 0.5
        else return null // every term must match something
      }
      return { e, score }
    })
    .filter((x): x is { e: SearchEntry; score: number } => x !== null)
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.e)
}

export const ALL_ENTRIES = entries

/** Total searchable pages — the single source for every "N calculators" claim on the site. */
export const SEARCH_TOTAL = CALCULATORS.length + VARIANTS.length
