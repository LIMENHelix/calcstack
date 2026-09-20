export interface BillItem {
  raw: string
  label: string
  amount: number // as entered
  monthly: number // normalized
  yearly: number
  frequency: 'monthly' | 'yearly' | 'weekly' | 'quarterly' | 'one-time'
  category: string
}

const CATEGORY_KEYWORDS: [string, string][] = [
  ['Housing', 'rent|mortgage|hoa|property tax'],
  ['Utilities', 'electric|electricity|power|water|sewer|gas bill|utility|utilities|trash|garbage'],
  ['Internet & Phone', 'internet|broadband|wifi|comcast|xfinity|spectrum|att|at&t|verizon|t-mobile|tmobile|phone|mobile|cell'],
  ['Streaming & Subscriptions', 'netflix|hulu|disney|spotify|hbo|max|prime|youtube|apple music|subscription|streaming|paramount|peacock|audible|patreon|icloud|gym|membership'],
  ['Insurance', 'insurance|geico|progressive|state farm|allstate|premium'],
  ['Transport', 'car payment|auto loan|fuel|gasoline|parking|transit|metro|uber|lyft'],
  ['Groceries & Dining', 'grocery|groceries|supermarket|restaurant|dining|takeout|doordash|ubereats'],
  ['Debt', 'loan|credit card|student loan|debt|payment plan'],
  ['Health', 'gym|doctor|dental|medical|pharmacy|prescription|therapy|health'],
  ['Childcare & Education', 'childcare|daycare|tuition|school|babysit'],
]

/** Rough typical US monthly costs for flagging (order-of-magnitude benchmarks). */
export const BENCHMARKS: Record<string, number> = {
  'Utilities': 240,
  'Internet & Phone': 130,
  'Streaming & Subscriptions': 60,
  'Insurance': 180,
  'Transport': 250,
  'Groceries & Dining': 600,
  'Health': 120,
  'Housing': 1700,
}

function categorize(label: string): string {
  const l = label.toLowerCase()
  for (const [cat, pattern] of CATEGORY_KEYWORDS) {
    if (new RegExp(pattern).test(l)) return cat
  }
  return 'Other'
}

function detectFrequency(line: string): { freq: BillItem['frequency']; factor: number } {
  const l = line.toLowerCase()
  if (/\b(per|a|each|\/)\s*week\b|\bweekly\b|\/wk\b/.test(l)) return { freq: 'weekly', factor: 52 / 12 }
  if (/\b(per|a|each|\/)\s*(year|yr)\b|\byearly\b|\bannual(ly)?\b|\/yr\b/.test(l)) return { freq: 'yearly', factor: 1 / 12 }
  if (/\bquarterly\b|every 3 months/.test(l)) return { freq: 'quarterly', factor: 1 / 3 }
  if (/\b(one[- ]time|once|one off)\b/.test(l)) return { freq: 'one-time', factor: 0 }
  return { freq: 'monthly', factor: 1 } // default assumption
}

/**
 * Parses pasted bill/expense text into structured items.
 * Handles: "Netflix $15.49", "Electric: 142.30/mo", "Gym - $45 monthly",
 * "Rent $1,650", CSV-ish lines, bullet lists. All local, nothing uploaded.
 */
export function parseBills(text: string): BillItem[] {
  const items: BillItem[] = []
  const lines = text.split(/\r?\n/)
  const amountRe = /\$?\s*(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/g

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    // find all numeric tokens, use the LAST one as the amount (typical "label $amount")
    const matches = [...line.matchAll(amountRe)]
    if (matches.length === 0) continue
    const last = matches[matches.length - 1]
    const amount = parseFloat(last[1].replace(/,/g, ''))
    if (!isFinite(amount) || amount <= 0) continue

    // label = line with the amount and currency symbols stripped
    let label = line
      .replace(last[0], ' ')
      .replace(/[$€£]/g, '')
      .replace(/^[\s\-–—*•:;,.]+|[\s\-–—:;,.]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    // strip trailing frequency words from the label
    label = label.replace(/\b(per|a|each)\s*(month|mo|week|wk|year|yr|quarter)\b\.?/gi, '').replace(/\b(monthly|weekly|yearly|annually|quarterly)\b\.?/gi, '').replace(/\s*\/(mo|month|week|wk|year|yr|quarter)\b\.?/gi, '').replace(/[\s\-–—:;,.]+$/g, '').trim()
    if (label.length < 2) label = `Item ${items.length + 1}`
    // de-dupe label capitalization
    label = label.charAt(0).toUpperCase() + label.slice(1)

    const { freq, factor } = detectFrequency(line)
    const monthly = amount * factor
    items.push({
      raw: line,
      label,
      amount,
      monthly,
      yearly: monthly * 12,
      frequency: freq,
      category: categorize(label),
    })
  }
  return items
}

export function summarize(items: BillItem[]) {
  const recurring = items.filter((i) => i.frequency !== 'one-time')
  const monthlyTotal = recurring.reduce((s, i) => s + i.monthly, 0)
  const byCategory = new Map<string, number>()
  for (const i of recurring) {
    byCategory.set(i.category, (byCategory.get(i.category) ?? 0) + i.monthly)
  }
  const categories = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
  const flags = categories
    .filter(([cat, v]) => BENCHMARKS[cat] !== undefined && v > BENCHMARKS[cat] * 1.25)
    .map(([cat, v]) => ({ cat, monthly: v, benchmark: BENCHMARKS[cat] }))
  return { monthlyTotal, yearlyTotal: monthlyTotal * 12, categories, flags, count: items.length }
}
