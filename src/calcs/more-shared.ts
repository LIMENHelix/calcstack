// Shared helpers/constants extracted from more.tsx by scripts/split-more.mjs


export interface DebtSim { name: string; bal: number; apr: number; min: number }

export function simulatePayoff(debts: DebtSim[], extra: number, strategy: 'avalanche' | 'snowball') {
  const ds = debts.map((d) => ({ ...d, paidThisMonth: 0 }))
  let months = 0
  let totalInterest = 0
  const order: string[] = []
  while (ds.some((d) => d.bal > 0.005) && months < 600) {
    months++
    for (const d of ds) {
      if (d.bal <= 0) continue
      const i = (d.bal * d.apr) / 100 / 12
      d.bal += i
      totalInterest += i
    }
    for (const d of ds) {
      if (d.bal <= 0) continue
      const p = Math.min(d.min, d.bal)
      d.bal -= p
      d.paidThisMonth = p
    }
    const origMins = debts.reduce((s, d) => s + d.min, 0)
    const minsPaid = ds.reduce((s, d) => s + (d.paidThisMonth || 0), 0)
    let left = origMins - minsPaid + extra
    let guard = 0
    while (left > 0.005 && guard++ < 10) {
      const active = ds.filter((d) => d.bal > 0.005)
      if (!active.length) break
      active.sort((a, b) =>
        strategy === 'avalanche' ? b.apr - a.apr || a.bal - b.bal : a.bal - b.bal || b.apr - a.apr,
      )
      const t = active[0]
      const p = Math.min(t.bal, left)
      t.bal -= p
      left -= p
      if (t.bal <= 0.005 && !order.includes(t.name)) order.push(t.name)
    }
  }
  return { months, totalInterest, order }
}

export function minPaymentSim(bal: number, apr: number, floor: number) {
  let months = 0
  let interest = 0
  let b = bal
  while (b > 0.005 && months < 1200) {
    months++
    const i = (b * apr) / 100 / 12
    interest += i
    b += i
    const pmt = Math.max(floor, b * 0.01 + i)
    b -= Math.min(pmt, b)
  }
  return { months, interest }
}

export function fixedPaymentSim(bal: number, apr: number, payment: number) {
  let months = 0
  let interest = 0
  let b = bal
  const firstI = (bal * apr) / 100 / 12
  if (payment <= firstI) return { months: -1, interest: -1 } // never pays off
  while (b > 0.005 && months < 1200) {
    months++
    const i = (b * apr) / 100 / 12
    interest += i
    b += i
    b -= Math.min(payment, b)
  }
  return { months, interest }
}

export const BUDGET_PRESETS: Record<string, [number, number, number, string]> = {
  '50-30-20': [50, 30, 20, 'The classic — Elizabeth Warren\'s All Your Worth split'],
  '60-20-20': [60, 20, 20, 'High cost-of-living areas where needs run hot'],
  '70-20-10': [70, 20, 10, 'Survival mode — debt payoff or income shock'],
  '80-20-0': [80, 20, 0, 'Bare-bones triage (temporary only)'],
}

export const WH_2026 = {
  single: { std: 16100, br: [[12400, 0.1], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [Infinity, 0.37]] as [number, number][] },
  mfj: { std: 32200, br: [[24800, 0.1], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [Infinity, 0.37]] as [number, number][] },
}
export const PERIODS: [string, number][] = [['Weekly (52)', 52], ['Biweekly (26)', 26], ['Semimonthly (24)', 24], ['Monthly (12)', 12]]

export function bracketTax2026(t: number, br: [number, number][]) {
  let x = 0
  let p = 0
  let rem = t
  for (const [cap, rate] of br) {
    if (rem <= 0) break
    const w = Math.min(rem, cap - p)
    x += w * rate
    p = cap
    rem -= w
  }
  return x
}

export function annuityPmt(P: number, aprPct: number, yrs: number) {
  const i = aprPct / 100 / 12
  const n = yrs * 12
  return i === 0 ? P / n : (P * i) / (1 - Math.pow(1 + i, -n))
}
export function impliedApr(P: number, monthly: number, yrs: number) {
  let lo = 0
  let hi = 40
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2
    if (annuityPmt(P, mid, yrs) > monthly) hi = mid
    else lo = mid
  }
  return (lo + hi) / 2
}

export const TSP_LIMITS = { under50: 24500, catchup: 32500, super: 35750 }

export const SSA_B1 = 1286
export const SSA_B2 = 7749
export const SS_ADJ: [string, number][] = [['62 (−30%)', 0.7], ['63 (−25%)', 0.75], ['64 (−20%)', 0.8], ['65 (−13.3%)', 0.8667], ['66 (−6.7%)', 0.9333], ['67 — full retirement', 1], ['68 (+8%)', 1.08], ['69 (+16%)', 1.16], ['70 (+24%)', 1.24]]

export function pia2026(aime: number) {
  const raw = 0.9 * Math.min(aime, SSA_B1) + 0.32 * Math.max(0, Math.min(aime, SSA_B2) - SSA_B1) + 0.15 * Math.max(0, aime - SSA_B2)
  return Math.floor(raw * 10) / 10
}

export const RACE_DISTS: [string, number][] = [
  ['1 mile', 1.609344], ['5K', 5], ['10K', 10], ['10 miles', 16.09344], ['Half marathon', 21.0975], ['Marathon', 42.195],
]

export const WILKS_COEFF = {
  m: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-06, -1.291e-08],
  f: [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-05, -9.054e-08],
} as const

export const DOTS_COEFF = {
  m: [-0.000001093, 0.0007391293, -0.1918759221, 24.0900756, -307.75076],
  f: [-0.0000010706, 0.0005158568, -0.1126655495, 13.6175032, -57.96288],
} as const

// HELOC payment & shock — the two-phase machine nobody prices honestly. DRAW PERIOD (typically 10 yrs): interest-only on the drawn balance — $50k at 8.5% = $354.17/mo, zero principal. REPAYMENT (typically 20 yrs): the balance amortizes — $433.91/mo, a 22.5% payment shock (25k at 7.5%: $156.25 → $201.40, +28.9%; the shock grows as rates fall because IO floors lower while amortization barely moves). Total interest on the example: $42,500 draw + $54,139 repay = $96,639 — nearly double the draw. Tax: post-TCJA/OBBBA, HELOC interest is deductible ONLY when the money buys/builds/substantially improves the home securing it (debt-consolidation or car HELOCs: NOT deductible), subject to the $750k total acquisition+improvement debt cap, and only if you itemize. Variable rate: most HELOCs float at prime + margin — the floor rate and rate cap matter; a +2% prime move adds $83/mo per $50k. Node-verified: $50k @8.5% → IO $354.17, repay $433.91 (+22.5%), total interest $96,639; deductible-after-tax @24% → $73,445; $25k @7.5% → $156.25 → $201.40 (+28.9%).
export const RENO_PROJECTS: { name: string; cost: number; recoup: number }[] = [
  { name: 'Garage door replacement', cost: 4672, recoup: 267.7 },
  { name: 'Steel entry door replacement', cost: 2435, recoup: 216.4 },
  { name: 'Manufactured stone veneer', cost: 11702, recoup: 207.9 },
  { name: 'Fiber-cement siding', cost: 21485, recoup: 113.7 },
  { name: 'Minor kitchen remodel (midrange)', cost: 28458, recoup: 112.9 },
  { name: 'Vinyl siding replacement', cost: 17950, recoup: 96.5 },
  { name: 'Backup power generator', cost: 13534, recoup: 95.3 },
  { name: 'Wood deck addition', cost: 18263, recoup: 94.9 },
  { name: 'Composite deck addition', cost: 25096, recoup: 88.5 },
  { name: 'Fiberglass grand entrance', cost: 11754, recoup: 84.7 },
  { name: 'Bathroom remodel (midrange)', cost: 25251, recoup: 80 },
  { name: 'Vinyl window replacement', cost: 20000, recoup: 76 },
  { name: 'Basement remodel', cost: 55000, recoup: 71 },
  { name: 'Asphalt roofing replacement', cost: 30000, recoup: 68 },
  { name: 'Bathroom addition (midrange)', cost: 60000, recoup: 53 },
  { name: 'Major kitchen remodel (midrange)', cost: 80000, recoup: 51 },
  { name: 'Bathroom remodel (upscale)', cost: 80000, recoup: 42 },
  { name: 'ADU (accessory dwelling unit)', cost: 180000, recoup: 41 },
  { name: 'Major kitchen remodel (upscale)', cost: 160000, recoup: 36 },
  { name: 'Primary suite addition (midrange)', cost: 170000, recoup: 32 },
  { name: 'Primary suite addition (upscale)', cost: 350000, recoup: 18 },
]
export const ULTABLE: [number, number][] = [[72, 27.4], [73, 26.5], [74, 25.5], [75, 24.6], [76, 23.7], [77, 22.9], [78, 22.0], [79, 21.1], [80, 20.2], [81, 19.4], [82, 18.5], [83, 17.7], [84, 16.8], [85, 16.0]]
export const AUTO_CAPS = [20300, 19800, 11900, 7160]
export const MACRS_TABLES: Record<string, number[]> = {
  '3': [33.33, 44.45, 14.81, 7.41],
  '5': [20.0, 32.0, 19.2, 11.52, 11.52, 5.76],
  '7': [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
  '10': [10.0, 18.0, 14.4, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
}
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const SLE_TABLE: [number, number][] = [
  [45, 41.0], [46, 40.0], [47, 39.0], [48, 38.1], [49, 37.1], [50, 36.2], [51, 35.3], [52, 34.3], [53, 33.4], [54, 32.5], [55, 31.6], [56, 30.6], [57, 29.8], [58, 28.9], [59, 28.0], [60, 27.1], [61, 26.2], [62, 25.4], [63, 24.5], [64, 23.7], [65, 22.9],
]
export const SURV_FRA: [string, number][] = [
  ['1956 or earlier', 792], ['1957', 794], ['1958', 796], ['1959', 798], ['1960', 800], ['1961', 802], ['1962 or later', 804],
]
export const SS_FRA_MONTHS: [string, number][] = [
  ['1955 or earlier', 792], ['1956', 796], ['1957', 798], ['1958', 800], ['1959', 802], ['1960 or later', 804],
]
export const AMT_2026 = {
  single: { ex: 90100, th: 500000, bp: 244500 },
  mfj: { ex: 140200, th: 1000000, bp: 244500 },
  mfs: { ex: 70100, th: 500000, bp: 122250 },
} as const

export const QBI_2026 = {
  single: { th: 201750, range: 75000 },
  mfs: { th: 201775, range: 75000 },
  mfj: { th: 403500, range: 150000 },
} as const

export const EITC_2026 = {
  0: { phaseIn: 0.0765, eiAmt: 8680, max: 664, phaseOut: 0.0765, thS: 10860, thJ: 18140, endS: 19540, endJ: 26820 },
  1: { phaseIn: 0.34, eiAmt: 13020, max: 4427, phaseOut: 0.1598, thS: 23890, thJ: 31160, endS: 51593, endJ: 58863 },
  2: { phaseIn: 0.4, eiAmt: 18290, max: 7316, phaseOut: 0.2106, thS: 23890, thJ: 31160, endS: 58629, endJ: 65899 },
  3: { phaseIn: 0.45, eiAmt: 18290, max: 8231, phaseOut: 0.2106, thS: 23890, thJ: 31160, endS: 62974, endJ: 70244 },
} as const
export const EITC_INV_LIMIT_2026 = 12200

export const FPL_2025 = { con: [15650, 5500], ak: [19550, 6880], hi: [17990, 6330] } as const
export const AP_2026: readonly (readonly [number, number, number])[] = [
  // [band top as %FPL, rate at band bottom, rate at band top] — linear interpolation within band
  [133, 0.021, 0.021],
  [150, 0.0314, 0.0419],
  [200, 0.0419, 0.066],
  [250, 0.066, 0.0844],
  [300, 0.0844, 0.0996],
  [400, 0.0996, 0.0996],
]

export function acaApplicablePct(fplPct: number): number | null {
  if (fplPct > 400) return null
  let prev = 100
  for (const [top, lo, hi] of AP_2026) {
    if (fplPct <= top) return top === 133 ? 0.021 : lo + ((hi - lo) * (fplPct - prev)) / (top - prev)
    prev = top
  }
  return null
}

export const SAVERS_2026: Record<string, readonly (readonly [number, number])[]> = {
  single: [[24250, 0.5], [26250, 0.2], [40250, 0.1]],
  hoh: [[36375, 0.5], [39375, 0.2], [60375, 0.1]],
  mfj: [[48500, 0.5], [52500, 0.2], [80500, 0.1]],
}

export const IRA_DEDUCT_2026: Record<string, readonly [number, number]> = {
  singleCovered: [81000, 91000],
  mfjContributorCovered: [129000, 149000],
  mfjSpouseCovered: [242000, 252000],
  mfsCovered: [0, 10000], // not inflation-indexed
}

export const IRMAA_2026 = {
  baseB: 202.9,
  single: [109000, 137000, 171000, 205000, 500000],
  mfj: [218000, 274000, 342000, 410000, 750000],
  mfs: [109000, 391000], // lived with spouse: compressed table
  partB: [0, 81.2, 202.9, 324.6, 446.3, 487.0], // surcharge over standard premium
  partD: [0, 14.5, 37.5, 60.4, 83.3, 91.0],
}

