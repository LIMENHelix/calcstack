import { Link } from 'react-router'
import { CALCULATORS } from '@/data/calculators'
import { Seo } from '@/components/Seo'

const TAX_SLUGS = {
  w2: ['paycheck-calculator'],
  selfEmployed: [
    'quarterly-estimated-tax-calculator',
    'self-employment-tax-calculator',
    'mileage-deduction-calculator',
    'mileage-vs-actual-expense-calculator',
    '1099-vs-w2-calculator',
  ],
  savers: ['hsa-growth-calculator', 'rmd-calculator', 'social-security-breakeven-calculator', 'crypto-profit-calculator'],
  households: ['mortgage-payment-calculator', 'rental-depreciation-calculator', 'student-loan-idr-calculator', 'sales-tax-calculator'],
} as const

const REASONS: Record<string, string> = {
  'paycheck-calculator': 'All 50 states + DC — check withholding before the W-4 deadline, not after.',
  'quarterly-estimated-tax-calculator': 'The four-payment number for 1099 income, with 2026 brackets and safe harbor.',
  'self-employment-tax-calculator': 'The 15.3% both-sides-of-FICA bill, computed exactly.',
  'mileage-deduction-calculator': 'Business miles × the 2026 split-year IRS rate (72.5¢ / 76¢).',
  'mileage-vs-actual-expense-calculator': 'Standard rate vs real costs — the bigger deduction wins.',
  '1099-vs-w2-calculator': 'What a contract rate is really worth after self-employment costs.',
  'hsa-growth-calculator': 'Last chance for prior-year HSA contributions runs to April 15.',
  'rmd-calculator': 'Miss the Dec 31 RMD deadline and the penalty is 25% of the shortfall.',
  'social-security-breakeven-calculator': 'Claiming decisions are tax decisions too.',
  'crypto-profit-calculator': 'Every sale or swap is a taxable event — price the gain now.',
  'mortgage-payment-calculator': 'Mortgage interest only helps if you itemize — run the payment first.',
  'rental-depreciation-calculator': 'Landlords: the 27.5-year deduction and the recapture bill at sale.',
  'student-loan-idr-calculator': 'Forgiven balances are taxable again after 2025 — model the tax bomb.',
  'sales-tax-calculator': 'Big purchases before year-end? Know the true total.',
}

function TaxSection({ title, slugs }: { title: string; slugs: readonly string[] }) {
  const calcs = slugs
    .map((s) => CALCULATORS.find((c) => c.slug === s))
    .filter((c): c is (typeof CALCULATORS)[number] => Boolean(c))
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <ul className="space-y-3">
        {calcs.map((c) => (
          <li key={c.slug}>
            <Link to={`/calculators/${c.slug}`} className="font-medium text-primary underline-offset-4 hover:underline">
              {c.shortTitle}
            </Link>
            <span className="ml-2 text-sm text-muted-foreground">{REASONS[c.slug]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function TaxSeason() {
  return (
    <>
      <Seo
        title="Tax Season Hub — Every Tax Calculator, 2026 Rules"
        description="Free tax calculators for filing season: paycheck withholding by state, quarterly estimated taxes, self-employment tax, mileage deductions, HSA limits, and more. 2026 rules, no signup."
      />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Tax season, minus the surprises</h1>
      <p className="mb-6 max-w-2xl text-muted-foreground">
        Every tax calculator on CalcStack in one place, all running current 2026 federal rules.
        The cheapest tax bill is the one you plan in advance — these are the tools for that.
      </p>

      <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-4">
        <div><p className="font-semibold">Apr 15</p><p className="text-muted-foreground">2025 return + Q1 estimate + prior-year HSA</p></div>
        <div><p className="font-semibold">Jun 15</p><p className="text-muted-foreground">Q2 estimated payment</p></div>
        <div><p className="font-semibold">Sep 15</p><p className="text-muted-foreground">Q3 estimated payment</p></div>
        <div><p className="font-semibold">Jan 15</p><p className="text-muted-foreground">Q4 estimate · Dec 31: RMDs & last deductions</p></div>
      </div>

      <TaxSection title="W-2 employees — fix withholding before it costs you" slugs={TAX_SLUGS.w2} />
      <TaxSection title="Self-employed, freelancers & gig workers" slugs={TAX_SLUGS.selfEmployed} />
      <TaxSection title="Savers & investors" slugs={TAX_SLUGS.savers} />
      <TaxSection title="Households, homeowners & landlords" slugs={TAX_SLUGS.households} />

      <section className="mt-12 max-w-2xl space-y-4 text-sm">
        <h2 className="text-xl font-semibold">Tax season questions, answered</h2>
        <div>
          <p className="font-medium">Does an extension give me more time to pay?</p>
          <p className="text-muted-foreground">
            No — Form 4868 extends the filing deadline to October 15, not the payment deadline.
            Tax owed is still due April 15, and interest plus the failure-to-pay penalty (0.5%/month)
            run from that date. Estimate with the quarterly calculator and pay something.
          </p>
        </div>
        <div>
          <p className="font-medium">Why is my refund smaller than last year?</p>
          <p className="text-muted-foreground">
            A refund is just your own money back — it shrinks when withholding matches reality better
            or when credits phase out. The useful number is total tax, not the refund. Run your real
            pay through the paycheck calculator and compare withholding against it.
          </p>
        </div>
        <div>
          <p className="font-medium">I got a 1099 for the first time. What do I owe?</p>
          <p className="text-muted-foreground">
            More than you expect: self-employment tax (15.3% on 92.35% of profit) plus income tax,
            with nobody withholding for you. The quarterly estimated tax calculator computes the
            exact figure under 2026 rules and splits it into the four payments the IRS expects.
          </p>
        </div>
        <div>
          <p className="font-medium">Where can I verify these numbers?</p>
          <p className="text-muted-foreground">
            Every calculator lists its sources (IRS revenue procedures, SSA, state revenue
            departments) in its methodology note, and our full audit trail is public. Treat every
            result as an estimate and verify against IRS.gov or a tax professional before filing.
          </p>
        </div>
      </section>
    </>
  )
}
