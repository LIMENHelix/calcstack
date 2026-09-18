/* Paycheck engine: 2026 federal brackets + per-state income tax rules.
   State data is a simplified single-filer model — brackets and
   deductions are approximate, local taxes/credits/pre-tax deductions excluded.
   Every page using this data says so and points users to their state revenue dept. */

export interface StateRule {
  slug: string
  name: string
  kind: 'none' | 'flat' | 'brackets'
  ded: number // approximate state standard deduction + exemptions, single filer
  dedMfj?: number // MFJ deduction when it differs from 2× single (e.g. Kansas)
  rate?: number // flat rate %
  brackets?: [number, number][] // [taxable income threshold, marginal rate %]
  bracketsMfj?: [number, number][] // exact MFJ thresholds when not exactly 2× single (e.g. New York)
  note?: string
}

export const FEDERAL = {
  single: {
    ded: 16100,
    brackets: [[0, 10], [12400, 12], [50400, 22], [105700, 24], [201775, 32], [256225, 35], [640600, 37]] as [number, number][],
  },
  mfj: {
    ded: 32200,
    brackets: [[0, 10], [24800, 12], [100800, 22], [211400, 24], [403550, 32], [512450, 35], [768700, 37]] as [number, number][],
  },
}

export const SS_RATE = 6.2
export const SS_WAGE_CAP = 184500 // 2026 Social Security wage base (SSA)
export const MEDICARE_RATE = 1.45
export const MEDICARE_SURTAX = 0.9
export const MEDICARE_SURTAX_THRESHOLD = { single: 200000, mfj: 250000 }

export const PAYCHECK_STATES: StateRule[] = [
  { slug: 'alabama', name: 'Alabama', kind: 'brackets', ded: 2500, brackets: [[0, 2], [500, 4], [3000, 5]] },
  { slug: 'alaska', name: 'Alaska', kind: 'none', ded: 0, note: 'Alaska has no state income tax.' },
  { slug: 'arizona', name: 'Arizona', kind: 'flat', ded: 14600, rate: 2.5 },
  { slug: 'arkansas', name: 'Arkansas', kind: 'brackets', ded: 2340, brackets: [[0, 0], [5500, 2], [10900, 3], [15600, 3.4], [25700, 3.9]] },
  { slug: 'california', name: 'California', kind: 'brackets', ded: 5706, dedMfj: 11412, brackets: [[0, 1], [11079, 2], [26264, 4], [41452, 6], [57542, 8], [72724, 9.3], [371479, 10.3], [445771, 11.3], [742953, 12.3]], note: '2025 FTB Schedule X brackets (latest published; 2026 thresholds arrive fall 2026). Excludes the 1.3% SDI payroll tax (uncapped) and the 1% Behavioral Health Services surtax over $1M (top effective rate 13.3%).' },
  { slug: 'colorado', name: 'Colorado', kind: 'flat', ded: 15000, rate: 4.4 },
  { slug: 'connecticut', name: 'Connecticut', kind: 'brackets', ded: 0, brackets: [[0, 2], [10000, 4.5], [50000, 6], [100000, 6.5], [200000, 6.9], [250000, 6.99]], note: 'Personal exemptions and credits phase out with income and are not modeled.' },
  { slug: 'delaware', name: 'Delaware', kind: 'brackets', ded: 3250, brackets: [[0, 0], [2000, 2.2], [5000, 3.9], [10000, 4.8], [20000, 5.2], [25000, 5.55], [60000, 6.6]] },
  { slug: 'washington-dc', name: 'District of Columbia', kind: 'brackets', ded: 14600, brackets: [[0, 4], [10000, 6], [40000, 6.5], [60000, 8.5], [250000, 8.75], [1000000, 10.75]] },
  { slug: 'florida', name: 'Florida', kind: 'none', ded: 0, note: 'Florida has no state income tax.' },
  { slug: 'georgia', name: 'Georgia', kind: 'flat', ded: 12000, rate: 5.19 },
  { slug: 'hawaii', name: 'Hawaii', kind: 'brackets', ded: 4400, brackets: [[0, 1.4], [2400, 3.2], [4800, 5.5], [9600, 6.4], [14400, 6.8], [19200, 7.2], [24000, 7.6], [36000, 8.25], [48000, 9], [150000, 10], [175000, 11]] },
  { slug: 'idaho', name: 'Idaho', kind: 'flat', ded: 15000, rate: 5.3 },
  { slug: 'illinois', name: 'Illinois', kind: 'flat', ded: 0, rate: 4.95 },
  { slug: 'indiana', name: 'Indiana', kind: 'flat', ded: 0, rate: 3.0, note: 'Excludes county income taxes (roughly 1–2% in most counties).' },
  { slug: 'iowa', name: 'Iowa', kind: 'flat', ded: 0, rate: 3.8 },
  { slug: 'kansas', name: 'Kansas', kind: 'brackets', ded: 12765, dedMfj: 26560, brackets: [[0, 5.2], [23000, 5.58]], note: 'Kansas consolidated to two brackets (5.2%/5.58%) effective 2024 (SB 1); deduction shown combines the $3,605 standard deduction and the $9,160 personal exemption ($8,240 + $18,320 married) with no dependents.' },
  { slug: 'kentucky', name: 'Kentucky', kind: 'flat', ded: 3160, rate: 4.0, note: 'Excludes local occupational taxes (about 1–2% in Louisville and Lexington).' },
  { slug: 'louisiana', name: 'Louisiana', kind: 'flat', ded: 12500, rate: 3.0 },
  { slug: 'maine', name: 'Maine', kind: 'brackets', ded: 15000, brackets: [[0, 5.8], [26050, 6.75], [61600, 7.15]] },
  { slug: 'maryland', name: 'Maryland', kind: 'brackets', ded: 2700, brackets: [[0, 2], [1000, 3], [2000, 4], [3000, 4.75], [100000, 5], [150000, 5.25], [250000, 5.5], [500000, 6.25], [1000000, 6.5]], note: 'Excludes county income taxes, which average roughly 2.5% — most Marylanders owe them.' },
  { slug: 'massachusetts', name: 'Massachusetts', kind: 'flat', ded: 0, rate: 5.0, note: 'Excludes the 4% surtax over ~$1M and the 0.46% paid family leave payroll tax.' },
  { slug: 'michigan', name: 'Michigan', kind: 'flat', ded: 0, rate: 4.25, note: 'Some cities (Detroit, Grand Rapids) levy local income taxes not modeled here.' },
  { slug: 'minnesota', name: 'Minnesota', kind: 'brackets', ded: 14950, dedMfj: 29900, brackets: [[0, 5.35], [32570, 6.8], [106990, 7.85], [198630, 9.85]], bracketsMfj: [[0, 5.35], [47620, 6.8], [189180, 7.85], [330410, 9.85]], note: '2025 MN DOR schedule. Standard deduction phases down for AGI over ~$238,950; not modeled.' },
  { slug: 'mississippi', name: 'Mississippi', kind: 'flat', ded: 10000, rate: 4.4 },
  { slug: 'missouri', name: 'Missouri', kind: 'flat', ded: 15000, rate: 4.7, note: 'Kansas City and St. Louis each levy a 1% earnings tax not modeled here.' },
  { slug: 'montana', name: 'Montana', kind: 'brackets', ded: 15000, brackets: [[0, 4.7], [20500, 5.9]] },
  { slug: 'nebraska', name: 'Nebraska', kind: 'brackets', ded: 15000, brackets: [[0, 2.46], [3700, 3.51], [22170, 5.01], [35730, 5.2]], note: 'Nebraska ties its standard deduction to the federal amount (shown at 2025 level).' },
  { slug: 'nevada', name: 'Nevada', kind: 'none', ded: 0, note: 'Nevada has no state income tax.' },
  { slug: 'new-hampshire', name: 'New Hampshire', kind: 'none', ded: 0, note: 'New Hampshire taxes only interest and dividends — wages are untaxed.' },
  { slug: 'new-jersey', name: 'New Jersey', kind: 'brackets', ded: 0, brackets: [[0, 1.4], [20000, 1.75], [35000, 3.5], [40000, 5.525], [75000, 6.37], [500000, 8.97], [1000000, 10.75]] },
  { slug: 'new-mexico', name: 'New Mexico', kind: 'brackets', ded: 15000, brackets: [[0, 1.5], [5500, 3.2], [11000, 4.3], [16000, 4.9], [210000, 5.9]], note: '2025 schedule as restructured by HB 14 (new 1.5% bottom bracket). NM ties its standard deduction to the federal amount.' },
  { slug: 'new-york', name: 'New York', kind: 'brackets', ded: 8000, dedMfj: 16050, brackets: [[0, 4], [8500, 4.5], [11700, 5.25], [13900, 5.5], [80650, 6], [215400, 6.85], [1077550, 9.65], [5000000, 10.3], [25000000, 10.9]], bracketsMfj: [[0, 4], [17150, 4.5], [23600, 5.25], [27900, 5.5], [161550, 6], [323200, 6.85], [2155350, 9.65], [5000000, 10.3], [25000000, 10.9]], note: 'NY DTF 2025 rate schedule. MFJ uses exact DTF joint thresholds (not doubled singles). Excludes NYC and Yonkers income taxes (NYC adds roughly 3–3.9%).' },
  { slug: 'north-carolina', name: 'North Carolina', kind: 'flat', ded: 12750, rate: 4.25 },
  { slug: 'north-dakota', name: 'North Dakota', kind: 'brackets', ded: 15000, brackets: [[0, 0], [48475, 1.95], [244825, 2.5]], note: '2025 thresholds. ND ties its standard deduction to the federal amount.' },
  { slug: 'ohio', name: 'Ohio', kind: 'brackets', ded: 0, brackets: [[0, 0], [26050, 2.75], [100000, 3.5]], note: 'Excludes municipal income taxes (often 1–3% in Ohio cities).' },
  { slug: 'oklahoma', name: 'Oklahoma', kind: 'brackets', ded: 7350, brackets: [[0, 0.25], [1000, 0.75], [2500, 1.75], [3750, 2.75], [4900, 3.75], [7200, 4.75]] },
  { slug: 'oregon', name: 'Oregon', kind: 'brackets', ded: 2835, dedMfj: 5670, brackets: [[0, 4.75], [4300, 6.75], [10750, 8.75], [125000, 9.9]], note: '2025 DOR brackets and deduction. Oregon also allows a federal-tax subtraction (up to $8,500) that phases out at higher incomes — not modeled; treat high-income estimates as slightly high.' },
  { slug: 'pennsylvania', name: 'Pennsylvania', kind: 'flat', ded: 0, rate: 3.07, note: 'Excludes local earned income taxes (commonly 1–3.9%, highest in Philadelphia).' },
  { slug: 'rhode-island', name: 'Rhode Island', kind: 'brackets', ded: 10900, dedMfj: 21800, brackets: [[0, 3.75], [79900, 4.75], [181650, 5.99]], note: 'RI Division of Taxation 2025 uniform rate schedule (ADV 2025-22).' },
  { slug: 'south-carolina', name: 'South Carolina', kind: 'brackets', ded: 15000, brackets: [[0, 0], [3560, 3], [17830, 6.2]], note: '2025 thresholds; top rate reduced to 6.2%. SC ties its standard deduction to the federal amount.' },
  { slug: 'south-dakota', name: 'South Dakota', kind: 'none', ded: 0, note: 'South Dakota has no state income tax.' },
  { slug: 'tennessee', name: 'Tennessee', kind: 'none', ded: 0, note: 'Tennessee has no state income tax.' },
  { slug: 'texas', name: 'Texas', kind: 'none', ded: 0, note: 'Texas has no state income tax.' },
  { slug: 'utah', name: 'Utah', kind: 'flat', ded: 0, rate: 4.55, note: 'Utah offers a taxpayer credit that lowers the effective rate for lower incomes; not modeled.' },
  { slug: 'vermont', name: 'Vermont', kind: 'brackets', ded: 15000, brackets: [[0, 3.35], [47900, 6.6], [116000, 7.6], [242000, 8.75]], note: '2025 VT schedule (Joint Fiscal Office). Vermont ties its standard deduction to the federal amount.' },
  { slug: 'virginia', name: 'Virginia', kind: 'brackets', ded: 8500, brackets: [[0, 2], [3000, 3], [5000, 5], [17000, 5.75]] },
  { slug: 'washington', name: 'Washington', kind: 'none', ded: 0, note: 'Washington has no wage income tax; excludes the 0.58% WA Cares long-term care payroll tax.' },
  { slug: 'west-virginia', name: 'West Virginia', kind: 'brackets', ded: 0, brackets: [[0, 2.11], [10000, 2.81], [25000, 3.16], [40000, 4.22], [60000, 4.58]], note: '2026 rates (SB 392 cut all brackets 5%, retroactive to Jan 1, 2026). WV has no standard deduction; a $2,000 personal exemption per person is not modeled.' },
  { slug: 'wisconsin', name: 'Wisconsin', kind: 'brackets', ded: 13560, dedMfj: 25110, brackets: [[0, 3.5], [14680, 4.4], [50480, 5.3], [323290, 7.65]], bracketsMfj: [[0, 3.5], [19580, 4.4], [67300, 5.3], [431060, 7.65]], note: '2025 WI DOR schedule (Act 15 widened the 4.4% bracket to $50,480 single). Standard deduction slides down with income — shown at maximum; modest incomes see less.' },
  { slug: 'wyoming', name: 'Wyoming', kind: 'none', ded: 0, note: 'Wyoming has no state income tax.' },
]

export function bracketTax(brackets: [number, number][], taxable: number): number {
  let tax = 0
  for (let i = 0; i < brackets.length; i++) {
    const [start, rate] = brackets[i]
    const end = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity
    if (taxable > start) tax += (Math.min(taxable, end) - start) * (rate / 100)
    else break
  }
  return tax
}

export interface PaycheckResult {
  gross: number
  federal: number
  ss: number
  medicare: number
  state: number
  net: number
  effectiveRate: number
}

export function computePaycheck(gross: number, filing: 'single' | 'mfj', state: StateRule): PaycheckResult {
  const fed = FEDERAL[filing]
  const fedTaxable = Math.max(0, gross - fed.ded)
  const federal = bracketTax(fed.brackets, fedTaxable)
  const ss = Math.min(gross, SS_WAGE_CAP) * (SS_RATE / 100)
  const medicare =
    gross * (MEDICARE_RATE / 100) +
    Math.max(0, gross - MEDICARE_SURTAX_THRESHOLD[filing]) * (MEDICARE_SURTAX / 100)

  // State: MFJ approximated by doubling single brackets and deduction,
  // unless the state provides an exact MFJ deduction (dedMfj)
  const scale = filing === 'mfj' ? 2 : 1
  const stateDed = filing === 'mfj' && state.dedMfj ? state.dedMfj : state.ded * scale
  const stateTaxable = Math.max(0, gross - stateDed)
  let stateTax = 0
  if (state.kind === 'flat') stateTax = stateTaxable * ((state.rate ?? 0) / 100)
  if (state.kind === 'brackets' && state.brackets) {
    const scaled = filing === 'mfj' && state.bracketsMfj
      ? state.bracketsMfj
      : state.brackets.map(([t, r]) => [t * scale, r] as [number, number])
    stateTax = bracketTax(scaled, stateTaxable)
  }

  const net = gross - federal - ss - medicare - stateTax
  return {
    gross,
    federal,
    ss,
    medicare,
    state: stateTax,
    net,
    effectiveRate: gross > 0 ? ((gross - net) / gross) * 100 : 0,
  }
}

/* ---------- Single-check withholding (employer payroll method) ---------- */

export const SUPPLEMENTAL_RATE = 22 // flat federal rate on supplemental wages under $1M (IRS Pub 15)

export interface CheckInput {
  checkGross: number
  periodsPerYear: number // 52 weekly, 26 biweekly, 24 semimonthly, 12 monthly
  bonusInCheck: number // portion paid as supplemental wages, withheld at flat 22%
  pretax125: number // per-check Section 125 (health/dental/vision premiums, FSA/HSA via cafeteria plan)
  pretax401k: number // per-check pre-tax 401(k) — Roth 401(k) is post-tax, do not include
}

export interface CheckResult {
  ficaWages: number
  fedWages: number
  federalRegular: number
  federalSupplemental: number
  federal: number
  ss: number
  medicare: number
  state: number
  net: number
  annualizedPace: number
}

export function computeCheck(input: CheckInput, filing: 'single' | 'mfj', state: StateRule): CheckResult {
  const periods = Math.max(1, Math.round(input.periodsPerYear))
  const ficaWages = Math.max(0, input.checkGross - input.pretax125)
  const fedWages = Math.max(0, ficaWages - input.pretax401k)
  const bonus = Math.min(Math.max(0, input.bonusInCheck), fedWages)
  const regular = fedWages - bonus
  const fed = FEDERAL[filing]
  // IRS percentage/aggregate method: annualize the regular portion, bracket-tax it, divide back
  const federalRegular = bracketTax(fed.brackets, Math.max(0, regular * periods - fed.ded)) / periods
  const federalSupplemental = bonus * (SUPPLEMENTAL_RATE / 100)
  const ss = ficaWages * (SS_RATE / 100) // per-check; ignores YTD wage-cap crossing (disclosed)
  const medicare = ficaWages * (MEDICARE_RATE / 100) // 0.9% surtax is reconciled at filing (disclosed)
  const scale = filing === 'mfj' ? 2 : 1
  const stateDed = filing === 'mfj' && state.dedMfj ? state.dedMfj : state.ded * scale
  const stateTaxableAnnual = Math.max(0, fedWages * periods - stateDed)
  let stateTax = 0
  if (state.kind === 'flat') stateTax = (stateTaxableAnnual * ((state.rate ?? 0) / 100)) / periods
  if (state.kind === 'brackets' && state.brackets) {
    const scaled = filing === 'mfj' && state.bracketsMfj
      ? state.bracketsMfj
      : state.brackets.map(([t, r]) => [t * scale, r] as [number, number])
    stateTax = bracketTax(scaled, stateTaxableAnnual) / periods
  }
  const federal = federalRegular + federalSupplemental
  const net = input.checkGross - input.pretax125 - input.pretax401k - federal - ss - medicare - stateTax
  return { ficaWages, fedWages, federalRegular, federalSupplemental, federal, ss, medicare, state: stateTax, net, annualizedPace: fedWages * periods }
}

/* ---------- Variable-income YTD projection ---------- */

export interface YtdInput {
  ytdGross: number // from your latest paystub
  ytdFederal: number // YTD federal income tax withheld (not FICA)
  ytdState: number // YTD state income tax withheld
  checksRemaining: number
  avgCheckGross: number // expected regular gross per remaining check
  bonusRemaining: number // total commission/bonus still expected this year
  pretaxPerCheck: number // combined Section 125 + pre-tax 401(k) per remaining check
  periodsPerYear: number
}

export interface YtdResult {
  projectedGross: number
  projectedFedLiability: number
  projectedFedWithheld: number
  fedBalance: number // positive = you owe, negative = refund
  projectedStateLiability: number
  projectedStateWithheld: number
  stateBalance: number
  perCheckAdjustment: number // extra to withhold per remaining check (negative = reduce)
}

export function computeYtd(input: YtdInput, filing: 'single' | 'mfj', state: StateRule): YtdResult {
  const rem = Math.max(0, Math.round(input.checksRemaining))
  const periods = Math.max(1, Math.round(input.periodsPerYear))
  const bonusRem = Math.max(0, input.bonusRemaining)
  const pretax = Math.max(0, input.pretaxPerCheck)
  const projectedGross = input.ytdGross + rem * input.avgCheckGross + bonusRem
  const fed = FEDERAL[filing]
  // YTD pretax already embedded in ytdGross figures the user copies from the stub;
  // we only model remaining-check pretax explicitly.
  const fedTaxable = Math.max(0, projectedGross - rem * pretax - fed.ded)
  const projectedFedLiability = bracketTax(fed.brackets, fedTaxable)
  const regularFedWages = Math.max(0, input.avgCheckGross - pretax)
  const perCheckWH = bracketTax(fed.brackets, Math.max(0, regularFedWages * periods - fed.ded)) / periods
  const projectedFedWithheld = input.ytdFederal + rem * perCheckWH + bonusRem * (SUPPLEMENTAL_RATE / 100)
  const scale = filing === 'mfj' ? 2 : 1
  const stateDed = filing === 'mfj' && state.dedMfj ? state.dedMfj : state.ded * scale
  const stateTaxable = Math.max(0, projectedGross - rem * pretax - stateDed)
  let projectedStateLiability = 0
  if (state.kind === 'flat') projectedStateLiability = stateTaxable * ((state.rate ?? 0) / 100)
  if (state.kind === 'brackets' && state.brackets) {
    const scaled = state.brackets.map(([t, r]) => [t * scale, r] as [number, number])
    projectedStateLiability = bracketTax(scaled, stateTaxable)
  }
  let perCheckStateWH = 0
  const stateRegularAnnual = Math.max(0, regularFedWages * periods - stateDed)
  if (state.kind === 'flat') perCheckStateWH = (stateRegularAnnual * ((state.rate ?? 0) / 100)) / periods
  if (state.kind === 'brackets' && state.brackets) {
    const scaled = state.brackets.map(([t, r]) => [t * scale, r] as [number, number])
    perCheckStateWH = bracketTax(scaled, stateRegularAnnual) / periods
  }
  const projectedStateWithheld = input.ytdState + rem * perCheckStateWH + bonusRem * ((state.rate ?? (state.brackets?.[0]?.[1] ?? 0)) / 100)
  const fedBalance = projectedFedLiability - projectedFedWithheld
  const stateBalance = projectedStateLiability - projectedStateWithheld
  return {
    projectedGross,
    projectedFedLiability,
    projectedFedWithheld,
    fedBalance,
    projectedStateLiability,
    projectedStateWithheld,
    stateBalance,
    perCheckAdjustment: rem > 0 ? fedBalance / rem : 0,
  }
}
