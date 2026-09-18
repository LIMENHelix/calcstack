import type { CalculatorMeta } from './calculators'
import { PAYCHECK_STATES } from './paycheck'

export interface VariantMeta extends CalculatorMeta {
  /** Slug of the base calculator component to render. */
  baseSlug: string
  /** Pre-filled input values for the base component. */
  presets?: Record<string, number>
  /** Slug of the core calculator this variant derives from (for related links). */
  parentSlug: string
  /** Pre-selected state for state-aware components (e.g. paycheck). */
  stateSlug?: string
}

/* ---------- Sales tax by state ---------- */
/* Average combined state + local rates (widely published estimates). Each page
   tells the user their city rate may differ and shows how to find the exact one. */
const STATE_TAX: { state: string; slugState: string; rate: number; stateOnly: number }[] = [
  { state: 'Alabama', slugState: 'alabama', rate: 9.29, stateOnly: 4.0 },
  { state: 'Alaska', slugState: 'alaska', rate: 1.82, stateOnly: 0 },
  { state: 'Arizona', slugState: 'arizona', rate: 8.38, stateOnly: 5.6 },
  { state: 'Arkansas', slugState: 'arkansas', rate: 9.45, stateOnly: 6.5 },
  { state: 'California', slugState: 'california', rate: 8.85, stateOnly: 7.25 },
  { state: 'Colorado', slugState: 'colorado', rate: 7.81, stateOnly: 2.9 },
  { state: 'Connecticut', slugState: 'connecticut', rate: 6.35, stateOnly: 6.35 },
  { state: 'Delaware', slugState: 'delaware', rate: 0, stateOnly: 0 },
  { state: 'Florida', slugState: 'florida', rate: 7.0, stateOnly: 6.0 },
  { state: 'Georgia', slugState: 'georgia', rate: 7.38, stateOnly: 4.0 },
  { state: 'Hawaii', slugState: 'hawaii', rate: 4.5, stateOnly: 4.0 },
  { state: 'Idaho', slugState: 'idaho', rate: 6.03, stateOnly: 6.0 },
  { state: 'Illinois', slugState: 'illinois', rate: 8.86, stateOnly: 6.25 },
  { state: 'Indiana', slugState: 'indiana', rate: 7.0, stateOnly: 7.0 },
  { state: 'Iowa', slugState: 'iowa', rate: 6.94, stateOnly: 6.0 },
  { state: 'Kansas', slugState: 'kansas', rate: 8.68, stateOnly: 6.5 },
  { state: 'Kentucky', slugState: 'kentucky', rate: 6.0, stateOnly: 6.0 },
  { state: 'Louisiana', slugState: 'louisiana', rate: 9.55, stateOnly: 4.45 },
  { state: 'Maine', slugState: 'maine', rate: 5.5, stateOnly: 5.5 },
  { state: 'Maryland', slugState: 'maryland', rate: 6.0, stateOnly: 6.0 },
  { state: 'Massachusetts', slugState: 'massachusetts', rate: 6.25, stateOnly: 6.25 },
  { state: 'Michigan', slugState: 'michigan', rate: 6.0, stateOnly: 6.0 },
  { state: 'Minnesota', slugState: 'minnesota', rate: 7.88, stateOnly: 6.875 },
  { state: 'Mississippi', slugState: 'mississippi', rate: 7.07, stateOnly: 7.0 },
  { state: 'Missouri', slugState: 'missouri', rate: 8.39, stateOnly: 4.225 },
  { state: 'Montana', slugState: 'montana', rate: 0, stateOnly: 0 },
  { state: 'Nebraska', slugState: 'nebraska', rate: 6.97, stateOnly: 5.5 },
  { state: 'Nevada', slugState: 'nevada', rate: 8.24, stateOnly: 6.85 },
  { state: 'New Hampshire', slugState: 'new-hampshire', rate: 0, stateOnly: 0 },
  { state: 'New Jersey', slugState: 'new-jersey', rate: 6.6, stateOnly: 6.625 },
  { state: 'New Mexico', slugState: 'new-mexico', rate: 7.72, stateOnly: 4.875 },
  { state: 'New York', slugState: 'new-york', rate: 8.53, stateOnly: 4.0 },
  { state: 'North Carolina', slugState: 'north-carolina', rate: 7.0, stateOnly: 4.75 },
  { state: 'North Dakota', slugState: 'north-dakota', rate: 7.04, stateOnly: 5.0 },
  { state: 'Ohio', slugState: 'ohio', rate: 7.24, stateOnly: 5.75 },
  { state: 'Oklahoma', slugState: 'oklahoma', rate: 8.98, stateOnly: 4.5 },
  { state: 'Oregon', slugState: 'oregon', rate: 0, stateOnly: 0 },
  { state: 'Pennsylvania', slugState: 'pennsylvania', rate: 6.34, stateOnly: 6.0 },
  { state: 'Rhode Island', slugState: 'rhode-island', rate: 7.0, stateOnly: 7.0 },
  { state: 'South Carolina', slugState: 'south-carolina', rate: 7.5, stateOnly: 6.0 },
  { state: 'South Dakota', slugState: 'south-dakota', rate: 6.4, stateOnly: 4.2 },
  { state: 'Tennessee', slugState: 'tennessee', rate: 9.55, stateOnly: 7.0 },
  { state: 'Texas', slugState: 'texas', rate: 8.2, stateOnly: 6.25 },
  { state: 'Utah', slugState: 'utah', rate: 7.25, stateOnly: 6.1 },
  { state: 'Vermont', slugState: 'vermont', rate: 6.3, stateOnly: 6.0 },
  { state: 'Virginia', slugState: 'virginia', rate: 5.75, stateOnly: 5.3 },
  { state: 'Washington', slugState: 'washington', rate: 9.38, stateOnly: 6.5 },
  { state: 'West Virginia', slugState: 'west-virginia', rate: 6.57, stateOnly: 6.0 },
  { state: 'Wisconsin', slugState: 'wisconsin', rate: 5.43, stateOnly: 5.0 },
  { state: 'Wyoming', slugState: 'wyoming', rate: 5.36, stateOnly: 4.0 },
  { state: 'District of Columbia', slugState: 'washington-dc', rate: 6.0, stateOnly: 6.0 },
]

/* ---------- Sales tax by city (top 20 metros by search volume) ---------- */
/* Combined local rates as commonly published; pages tell users to check receipts. */
const CITY_TAX: { city: string; slugCity: string; rate: number; stateName: string }[] = [
  { city: 'New York City', slugCity: 'new-york-city', rate: 8.875, stateName: 'New York' },
  { city: 'Los Angeles', slugCity: 'los-angeles', rate: 9.5, stateName: 'California' },
  { city: 'Chicago', slugCity: 'chicago', rate: 10.25, stateName: 'Illinois' },
  { city: 'Houston', slugCity: 'houston', rate: 8.25, stateName: 'Texas' },
  { city: 'Phoenix', slugCity: 'phoenix', rate: 8.6, stateName: 'Arizona' },
  { city: 'Philadelphia', slugCity: 'philadelphia', rate: 8.0, stateName: 'Pennsylvania' },
  { city: 'San Antonio', slugCity: 'san-antonio', rate: 8.25, stateName: 'Texas' },
  { city: 'San Diego', slugCity: 'san-diego', rate: 7.75, stateName: 'California' },
  { city: 'Dallas', slugCity: 'dallas', rate: 8.25, stateName: 'Texas' },
  { city: 'San Jose', slugCity: 'san-jose', rate: 9.375, stateName: 'California' },
  { city: 'Austin', slugCity: 'austin', rate: 8.25, stateName: 'Texas' },
  { city: 'Seattle', slugCity: 'seattle', rate: 10.35, stateName: 'Washington' },
  { city: 'Denver', slugCity: 'denver', rate: 8.81, stateName: 'Colorado' },
  { city: 'Boston', slugCity: 'boston', rate: 6.25, stateName: 'Massachusetts' },
  { city: 'Las Vegas', slugCity: 'las-vegas', rate: 8.375, stateName: 'Nevada' },
  { city: 'Portland', slugCity: 'portland', rate: 0, stateName: 'Oregon' },
  { city: 'Nashville', slugCity: 'nashville', rate: 9.25, stateName: 'Tennessee' },
  { city: 'Atlanta', slugCity: 'atlanta', rate: 8.9, stateName: 'Georgia' },
  { city: 'Miami', slugCity: 'miami', rate: 7.0, stateName: 'Florida' },
  { city: 'Minneapolis', slugCity: 'minneapolis', rate: 9.03, stateName: 'Minnesota' },
]

const cityTaxVariants: VariantMeta[] = CITY_TAX.map(({ city, slugCity, rate, stateName }) => ({
  slug: `sales-tax-calculator-${slugCity}`,
  baseSlug: 'sales-tax-calculator',
  parentSlug: 'sales-tax-calculator',
  title: `${city} Sales Tax Calculator — ${rate}% Combined Rate`,
  shortTitle: `${city} Sales Tax Calculator`,
  category: 'Everyday Money',
  description: `Free ${city} sales tax calculator pre-set to the ${rate}% combined local rate. Add tax to a price or reverse it from a receipt total. Instant, no signup.`,
  tagline: `Pre-set to ${city}'s ${rate}% combined rate.`,
  presets: { rate },
  intro: rate === 0
    ? `${city}, ${stateName} has no sales tax — one of the few places in the US where the sticker price is the checkout price. This calculator is pre-set to 0%, which means totals equal the sticker price; it is still useful in "Remove tax" mode when comparing receipts from trips to taxed cities, or you can enter any rate to model what a purchase would cost elsewhere.`
    : `The combined sales tax rate in ${city}, ${stateName} is ${rate}% — state, county, and city/district taxes stacked together. This calculator comes pre-set to that rate, so entering a sticker price gives you the real checkout total immediately. It also works in reverse: paste a receipt total in "Remove tax" mode to recover the pre-tax amount for expense reports.`,
  howItWorks: rate === 0
    ? [
        `${city} has no sales tax — the rate field starts at 0%.`,
        'Enter a price: total equals the sticker price.',
        'To compare with a taxed city, enter that city\'s rate instead.',
        'Use "Remove tax" mode on receipts from taxed locations elsewhere.',
      ]
    : [
        `The rate field starts at ${rate}% — ${city}'s combined local rate.`,
        'Enter the price before tax (or a receipt total in "Remove tax" mode).',
        'Read the tax amount and total instantly.',
        'Special taxing districts can add small surcharges — your receipt shows the exact applied rate.',
      ],
  faq: [
    {
      q: `What is the sales tax rate in ${city}?`,
      a: rate === 0
        ? `Zero. ${stateName} has no state or local sales tax in ${city} — the sticker price is the final price, which is why cross-border shopping is common.`
        : `The combined rate in ${city} is ${rate}%, stacking ${stateName}'s state tax with county, city, and district taxes. Special districts inside the metro can differ slightly; your receipt shows the exact rate applied.`,
    },
    {
      q: 'How do I remove tax from a receipt total?',
      a: rate === 0
        ? 'Nothing to remove in Portland — but for a receipt from a taxed city, switch to "Remove tax" mode, enter that city\'s rate and the total, and the pre-tax amount comes back.'
        : `Switch to "Remove tax" mode and enter the total. The math divides by 1.${String(rate).replace('.', '').padEnd(3, '0').slice(0, 3)} — dividing the total by 1 + the rate — which correctly backs the tax out.`,
    },
    {
      q: 'Do online purchases charge this rate?',
      a: 'Generally yes — since the 2018 Wayfair decision, most online retailers collect sales tax based on your delivery address, so shipped-to-home orders typically carry your local combined rate.',
    },
  ],
}))

const stateTaxVariants: VariantMeta[] = STATE_TAX.map(({ state, slugState, rate, stateOnly }) => ({
  slug: `sales-tax-calculator-${slugState}`,
  baseSlug: 'sales-tax-calculator',
  parentSlug: 'sales-tax-calculator',
  title: stateOnly === 0 ? `${state} Sales Tax Calculator — No Sales Tax` : `${state} Sales Tax Calculator — ${stateOnly}% State Rate + Local Tax`,
  shortTitle: `${state} Sales Tax Calculator`,
  category: 'Everyday Money',
  description: stateOnly === 0
    ? `${state} has no sales tax. Free calculator to confirm totals, compare against taxed states, or model what purchases would cost elsewhere.`
    : `Free ${state} sales tax calculator pre-set to the average combined rate (~${rate}%). Add tax to a price or reverse it out of a receipt. Adjust for your city.`,
  tagline: stateOnly === 0 ? `${state} has no sales tax — the sticker price is the price.` : `${state} rates pre-loaded — just enter the price.`,
  presets: { rate },
  intro: stateOnly === 0
    ? `${state} is one of the five states with no statewide sales tax — the sticker price is the checkout price. This calculator is pre-set to 0%, which makes it a comparison tool: enter another state's rate to see what the same purchase would cost there, or use "Remove tax" mode on receipts from trips to taxed states.`
    : `${state} has a statewide sales tax of ${stateOnly}%, but what you actually pay at the register is higher: counties and cities stack their own rates on top, bringing the average combined rate in ${state} to roughly ${rate}%. This calculator comes pre-set to that average — adjust the rate field to your city's exact rate (shown on any receipt) for a precise answer. It works in both directions: add tax to a sticker price, or reverse tax out of a total.`,
  howItWorks: stateOnly === 0
    ? [
        `${state} has no sales tax — the rate field starts at 0%.`,
        'Enter a price: the total equals the sticker price.',
        'To compare with a taxed state, enter its rate instead.',
        'Use "Remove tax" mode on receipts from taxed states you visit.',
      ]
    : [
        `The rate field starts at ${rate}% — the average combined ${state} rate. Change it to your local rate for exact math.`,
        'Enter the price before tax (or the receipt total in "Remove tax" mode).',
        'Read the tax amount and total instantly.',
        'For bookkeeping, use "Remove tax" to recover the pre-tax amount from a receipt.',
      ],
  faq: [
    {
      q: `What is the sales tax rate in ${state}?`,
      a: stateOnly === 0
        ? `Zero — ${state} levies no statewide sales tax. (Alaska allows local-option taxes in some municipalities, averaging under 2% where they exist.) This is why residents of taxed neighbors cross the border for big purchases.`
        : `The statewide rate is ${stateOnly}%, but local additions bring the combined rate to roughly ${rate}% on average in ${state}. Exact rates vary by city and county — your receipt always shows the rate that was actually applied.`,
    },
    {
      q: 'Why is my receipt rate different from the pre-set rate?',
      a: `This calculator uses the ${state} average combined rate. City and district taxes vary — sometimes by over a percentage point within the same metro area. Type the rate printed on your receipt into the rate field for exact results.`,
    },
    {
      q: 'Is anything exempt from sales tax?',
      a: 'Most states exempt groceries, prescription drugs, or both, and many exempt clothing below a threshold. Exemption rules are state-specific — check your state revenue department\'s list for the categories you buy most.',
    },
  ],
}))

/* ---------- Tip calculator by profession ---------- */
const TIP_PROFS: { slug: string; prof: string; pct: number; bill: number; note: string; etiquette: string }[] = [
  {
    slug: 'tip-calculator-hairdresser',
    prof: 'Hairdresser',
    pct: 20, bill: 75,
    note: 'Pre-set to 20% — the common salon standard.',
    etiquette: '18–20% is the common salon range for good work; 25%+ for a colorist who fixed a disaster. Tip on the full service price before any discounts, and tip assistants who shampooed separately ($5–10 is customary).',
  },
  {
    slug: 'tip-calculator-tattoo-artist',
    prof: 'Tattoo Artist',
    pct: 20, bill: 300,
    note: 'Pre-set to 20% on session price.',
    etiquette: '15–25% of the session price is the studio norm, with 20% common for custom work. For multi-session pieces, tip per session. Cash is preferred at many shops.',
  },
  {
    slug: 'tip-calculator-uber',
    prof: 'Uber & Rideshare',
    pct: 15, bill: 24,
    note: 'Pre-set to 15% of the fare.',
    etiquette: '10–20% of the fare is typical; $1–2 minimum on short rides. Drivers keep 100% of in-app tips. Airport runs, luggage help, and late-night pickups argue for the top of the range.',
  },
  {
    slug: 'tip-calculator-delivery',
    prof: 'Food Delivery',
    pct: 18, bill: 32,
    note: 'Pre-set to 18% of the order.',
    etiquette: '15–20% of the order total, with a $3–5 floor so short trips are worth a driver\'s time. Bad weather, long distances, and apartment stairs all argue upward. Tip on the food total before app fees.',
  },
]

const tipVariants: VariantMeta[] = TIP_PROFS.map(({ slug, prof, pct, bill, note, etiquette }) => ({
  slug,
  baseSlug: 'tip-calculator',
  parentSlug: 'tip-calculator',
  title: `${prof} Tip Calculator — How Much to Tip (${pct}% Preset)`,
  shortTitle: `${prof} Tip Calculator`,
  category: 'Everyday Money',
  description: `Free ${prof.toLowerCase()} tip calculator pre-set to ${pct}%. Enter the amount, adjust the percentage, split between people. Instant and no signup.`,
  tagline: note,
  presets: { tipPct: pct, bill },
  intro: `Tipping norms for ${prof.toLowerCase()}s are their own world — different from restaurants, different from each other. This calculator comes pre-set to ${pct}% so the default answer is already sensible; adjust to your situation and split between people if needed.`,
  howItWorks: [
    `The tip field starts at ${pct}% — the common rate for ${prof.toLowerCase()}s.`,
    'Enter the amount on the bill, fare, or session price.',
    'Adjust the percentage up or down for exceptional or poor service.',
    'Split between people if you are sharing the cost.',
  ],
  faq: [
    { q: `How much should I tip a ${prof.toLowerCase()}?`, a: etiquette },
    {
      q: 'Should I tip on the discounted price or full price?',
      a: 'Full price before discounts or coupons. The service took the same effort regardless of your deal.',
    },
    {
      q: 'What if service was genuinely bad?',
      a: 'Dropping to 10% signals displeasure without stiffing someone who may depend on tips for base pay. If the problem was management (long waits, wrong orders), the worker usually was not the cause.',
    },
  ],
}))

/* ---------- Freelance rate by profession ---------- */
const FREE_PROFS: { slug: string; prof: string; salary: number; billable: number; note: string }[] = [
  { slug: 'freelance-rate-calculator-graphic-designer', prof: 'Graphic Designer', salary: 75000, billable: 55, note: 'Preset for a mid-career designer: $75K income goal, 55% billable.' },
  { slug: 'freelance-rate-calculator-web-developer', prof: 'Web Developer', salary: 120000, billable: 60, note: 'Preset for a senior developer: $120K income goal, 60% billable.' },
  { slug: 'freelance-rate-calculator-writer', prof: 'Freelance Writer', salary: 65000, billable: 65, note: 'Preset for a full-time writer: $65K income goal, 65% billable.' },
  { slug: 'freelance-rate-calculator-photographer', prof: 'Photographer', salary: 80000, billable: 50, note: 'Preset for a photographer: $80K goal, 50% billable (editing eats hours).' },
]

const freelanceVariants: VariantMeta[] = FREE_PROFS.map(({ slug, prof, salary, billable, note }) => ({
  slug,
  baseSlug: 'freelance-rate-calculator',
  parentSlug: 'freelance-rate-calculator',
  title: `${prof} Rate Calculator — What to Charge Per Hour`,
  shortTitle: `${prof} Rate Calculator`,
  category: 'Freelance & Career',
  description: `Free ${prof.toLowerCase()} hourly rate calculator. Pre-set for typical ${prof.toLowerCase()} income goals and billable hours — adjust to your situation for your minimum rate.`,
  tagline: note,
  presets: { salary, billablePct: billable },
  intro: `A ${prof.toLowerCase()}'s rate has to cover more than the work clients see — admin, marketing, equipment, insurance, and the unpaid hours between gigs. This calculator starts from typical numbers for a working ${prof.toLowerCase()} (a $${(salary / 1000).toFixed(0)}K income goal and ${billable}% billable time) and produces your minimum hourly and day rate. Adjust every field to your real numbers; the defaults are a starting point, not a verdict.`,
  howItWorks: [
    `Income goal starts at $${salary.toLocaleString('en-US')} — set it to what a salaried role would pay you.`,
    `Billable share starts at ${billable}% — typical for ${prof.toLowerCase()}s once admin and client-hunting are counted.`,
    'Add your real annual business expenses (gear, software, insurance, studio).',
    'Read your minimum hourly and day rates. Quote projects above this floor.',
  ],
  faq: [
    {
      q: `What do ${prof.toLowerCase()}s typically charge?`,
      a: `Published surveys show enormous ranges because they mix beginners with specialists. What matters is your floor: with the defaults here, a ${prof.toLowerCase()} needs roughly $${Math.round((salary + 10000) / (48 * 40 * (billable / 100)))}/hour just to match the salaried equivalent — before any premium for experience or specialization.`,
    },
    {
      q: 'Hourly, day rate, or per project?',
      a: 'Use the hourly floor internally, quote fixed project prices to clients. Project pricing rewards efficiency; the floor keeps you from bidding below your own salary.',
    },
    {
      q: 'When should I raise my rates?',
      a: 'When more than about 80% of proposals get accepted without negotiation, you are underpriced. Raise 10–15% for new clients first; existing clients at renewal.',
    },
  ],
}))

/* ---------- Mortgage variants ---------- */
const MORTGAGE_VARIANTS: VariantMeta[] = [
  {
    slug: 'jumbo-loan-calculator',
    baseSlug: 'mortgage-payment-calculator',
    parentSlug: 'mortgage-payment-calculator',
    title: 'Jumbo Loan Calculator — Mortgages Above Conforming Limits',
    shortTitle: 'Jumbo Loan Calculator',
    category: 'Loans & Debt',
    description: 'Free jumbo loan calculator for mortgages above conforming limits. Pre-set to a $900K home with 20% down — estimate payments on large loans.',
    tagline: 'For loans above the conforming limit.',
    presets: { price: 900000, downPct: 20, rate: 6.9 },
    intro: 'Jumbo loans finance amounts above the conforming loan limit (over $800K in most counties, higher in expensive metros). Lenders price them individually: expect stricter credit requirements, larger down payments (10–20%), and cash-reserve requirements of 6–12 months of payments. This calculator is pre-set to a representative jumbo scenario — $900K with 20% down.',
    howItWorks: [
      'Price starts at $900,000 with 20% down — adjust to your target property.',
      'Enter your quoted jumbo rate (often close to or even below conforming rates for strong borrowers).',
      'Read the monthly P&I payment and total interest.',
      'Compare terms: on large balances, 0.25 points of rate is hundreds of dollars per month.',
    ],
    faq: [
      {
        q: 'What is the jumbo loan limit?',
        a: 'It equals the conforming loan limit, which adjusts annually and is higher in designated high-cost counties. Check the current year\'s FHFA limit for your county — loans above it are jumbo by definition.',
      },
      {
        q: 'Are jumbo rates higher?',
        a: 'Historically yes, but in recent years strong borrowers sometimes get jumbo rates at or below conforming ones — banks compete for wealthy clients. Quote at least three lenders; the variance is large.',
      },
      {
        q: 'How much do I need in reserves for a jumbo loan?',
        a: 'Commonly 6–12 months of total housing payments in verifiable assets after closing. On a $720K loan that can mean $30–60K remaining in accounts — plan for it before making an offer.',
      },
    ],
  },
]

const paycheckVariants: VariantMeta[] = PAYCHECK_STATES.map((st) => {
  const noTax = st.kind === 'none'
  const rateDesc = noTax
    ? 'no state income tax'
    : st.kind === 'flat'
      ? `a flat ${st.rate}% state income tax`
      : 'progressive state income tax brackets'
  return {
    slug: `paycheck-calculator-${st.slug}`,
    baseSlug: 'paycheck-calculator',
    parentSlug: 'paycheck-calculator',
    stateSlug: st.slug,
    title: noTax
      ? `${st.name} Paycheck Calculator — 2026 Take-Home Pay (No State Income Tax)`
      : `${st.name} Paycheck Calculator — 2026 Take-Home Pay After Taxes`,
    shortTitle: `${st.name} Paycheck Calculator`,
    category: 'Freelance & Career',
    description: `Free ${st.name} paycheck calculator. Enter your salary to see 2026 take-home pay per year, month, and paycheck after federal, FICA, and ${st.name} state taxes.`,
    tagline: noTax
      ? `${st.name} takes no state income tax — see your real take-home.`
      : `${st.name} has ${rateDesc} — see your real take-home.`,
    intro: `Your offer letter says one number; your bank account says another. This calculator bridges the gap for ${st.name}: 2026 federal income tax brackets, Social Security and Medicare payroll taxes, and ${st.name}'s ${rateDesc}, all computed as you type. Results are estimates — they exclude pre-tax deductions like 401(k) contributions and health premiums, tax credits, and local taxes.${st.note ? ' ' + st.note : ''}`,
    howItWorks: [
      'Enter your annual gross salary and filing status.',
      `${st.name} is pre-selected — switch states to compare a move or a remote-work offer.`,
      'Federal tax uses the 2026 brackets after the standard deduction; FICA is 6.2% Social Security (up to the wage cap) plus 1.45% Medicare.',
      `State tax uses ${st.name}'s ${rateDesc}.`,
      'Read take-home pay per year, month, biweekly paycheck, and week, plus the full breakdown.',
    ],
    faq: [
      noTax
        ? {
            q: `Does ${st.name} tax my paycheck?`,
            a: `${st.note ?? st.name + ' has no state income tax.'} You still pay federal income tax and FICA payroll taxes, which this calculator shows separately.`,
          }
        : {
            q: `What is the income tax rate in ${st.name}?`,
            a: `${st.name} has ${rateDesc}.${st.note ? ' ' + st.note : ''} The calculator applies it to your salary automatically and shows the effective (real) percentage at the bottom.`,
          },
      {
        q: 'Why is my actual paycheck different?',
        a: 'Real paychecks include pre-tax deductions (401(k), health insurance, HSA) that lower taxable income, plus benefits and credits this estimate excludes. Local income taxes, where they exist, are also excluded. Compare the breakdown against your paystub to calibrate.',
      },
      {
        q: `Is ${st.name} a high-tax state for workers?`,
        a: `Use the state dropdown to compare: enter the same salary and switch between ${st.name} and another state. The take-home difference on an $75,000 salary between the highest- and lowest-tax states runs several thousand dollars per year — real money when evaluating a move.`,
      },
    ],
  }
})

export const VARIANTS: VariantMeta[] = [
  ...stateTaxVariants,
  ...cityTaxVariants,
  ...tipVariants,
  ...freelanceVariants,
  ...MORTGAGE_VARIANTS,
  ...paycheckVariants,
]
