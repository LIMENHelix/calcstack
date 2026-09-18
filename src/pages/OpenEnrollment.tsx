import { Link } from 'react-router'
import { CALCULATORS } from '@/data/calculators'
import { Seo } from '@/components/Seo'
import { AdSlot } from '@/components/Monetization'

const SECTIONS: { title: string; blurb: string; slugs: readonly string[] }[] = [
  {
    title: 'Choose the plan — the biggest decision',
    blurb: 'Price the whole year, not the monthly premium.',
    slugs: ['health-plan-comparison-calculator', 'hsa-growth-calculator'],
  },
  {
    title: 'Job changes & gaps',
    blurb: 'Leaving a job mid-year changes the whole equation.',
    slugs: ['cobra-cost-calculator', '1099-vs-w2-calculator'],
  },
  {
    title: 'See it in your paycheck',
    blurb: 'New elections change take-home on day one.',
    slugs: ['paycheck-calculator'],
  },
]

const REASONS: Record<string, string> = {
  'health-plan-comparison-calculator': 'HDHP vs PPO at YOUR expected usage, with break-even bills and HSA eligibility.',
  'hsa-growth-calculator': 'What maxing the HSA is worth in 20 years — 2026 IRS limits built in.',
  'cobra-cost-calculator': 'The 102% full-premium shock vs the marketplace, inside the 60-day window.',
  '1099-vs-w2-calculator': 'Going independent? Price the benefits you are giving up first.',
  'paycheck-calculator': 'New premiums and HSA/401(k) deductions hit take-home — preview the change.',
}

export default function OpenEnrollment() {
  return (
    <>
      <Seo
        title="Open Enrollment Hub — Health Plan, HSA & Benefits Calculators (2026)"
        description="Free open enrollment calculators: compare HDHP vs PPO total yearly cost, HSA growth with 2026 limits, COBRA vs marketplace, and paycheck impact of new elections."
      />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Open enrollment, decided with math</h1>
      <p className="mb-6 max-w-2xl text-muted-foreground">
        Most people spend more time picking a phone plan than a health plan. These calculators
        turn the benefits packet into numbers — total yearly cost, tax savings, and what new
        elections do to your paycheck.
      </p>

      <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-3">
        <div><p className="font-semibold">Oct–Dec</p><p className="text-muted-foreground">Most employer open enrollment windows</p></div>
        <div><p className="font-semibold">Nov 1 – Jan 15</p><p className="text-muted-foreground">ACA marketplace open enrollment</p></div>
        <div><p className="font-semibold">Oct 15 – Dec 7</p><p className="text-muted-foreground">Medicare annual enrollment period</p></div>
      </div>

      {SECTIONS.map((s) => {
        const calcs = s.slugs
          .map((slug) => CALCULATORS.find((c) => c.slug === slug))
          .filter((c): c is (typeof CALCULATORS)[number] => Boolean(c))
        return (
          <section key={s.title} className="mt-10">
            <h2 className="mb-1 text-xl font-semibold">{s.title}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{s.blurb}</p>
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
      })}

      <AdSlot />

      <section className="mt-12 max-w-2xl space-y-4 text-sm">
        <h2 className="text-xl font-semibold">Open enrollment questions, answered</h2>
        <div>
          <p className="font-medium">HDHP or PPO — how do I actually decide?</p>
          <p className="text-muted-foreground">
            Compare total yearly cost, not premiums: premiums × 12 plus what you would pay at your
            expected usage. If the premium savings exceed the extra deductible exposure, the HDHP
            wins healthy years and roughly ties bad ones — and it unlocks the HSA, worth $1,300+
            a year in tax savings at a 30% marginal rate. Run both plans through the comparison
            calculator with last year's actual bills.
          </p>
        </div>
        <div>
          <p className="font-medium">Should I max my HSA before my 401(k)?</p>
          <p className="text-muted-foreground">
            After grabbing any 401(k) match, the HSA usually comes next — it is the only account
            that is tax-deductible going in, tax-free growing, and tax-free coming out for medical
            costs. The 2026 limit is $4,400 self-only / $8,750 family. The HSA growth calculator
            shows what two decades of that triple advantage becomes.
          </p>
        </div>
        <div>
          <p className="font-medium">What happens if I do nothing during open enrollment?</p>
          <p className="text-muted-foreground">
            Most employers roll over your current elections — but FSAs usually reset to zero,
            premiums change January 1 regardless, and this year's plans may have different
            deductibles and networks under the same name. Doing nothing is still a choice; spend
            the ten minutes.
          </p>
        </div>
        <div>
          <p className="font-medium">I missed my employer's window. Am I stuck?</p>
          <p className="text-muted-foreground">
            Mostly yes until next year — unless you have a qualifying life event (marriage, birth,
            job loss, moving), which opens a 60-day special enrollment. Job loss also triggers
            COBRA rights; the COBRA calculator prices that against the marketplace before you elect.
          </p>
        </div>
      </section>
    </>
  )
}
