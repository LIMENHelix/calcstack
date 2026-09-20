import { Link } from 'react-router'
import { CALCULATORS, CATEGORIES } from '@/data/calculators'
import { VARIANTS } from '@/data/variants'
import { PERSONAS } from '@/data/personas'
import { Seo } from '@/components/Seo'
import { SearchBar } from '@/components/SearchBar'
import { Card, CardContent } from '@/components/ui/card'
import { AdSlot } from '@/components/Monetization'

export default function Home() {
  return (
    <>
      <Seo
        title="CalcStack — 530 Free Calculators for Work, Money & Life"
        description="Free, instant calculators for every job and every money question: contractor bids, salon and studio pricing, paychecks by state, mortgages, training and nutrition math, retirement, and everyday life. No signup — runs in your browser."
      />
      <section className="mb-10 mt-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          The math behind your work, <span className="text-primary">answered in seconds.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {CALCULATORS.length + VARIANTS.length} free calculators — by profession, by state, by goal. Bid sheets and
          salon pricing, paychecks and mortgages, training cycles and retirement math. Results update as you type,
          and every calculation runs in your browser — no accounts, no uploads, no email gates.
        </p>
        <SearchBar />
        <p className="mt-3 text-sm text-muted-foreground">
          or <Link to="/directory" className="text-primary underline-offset-4 hover:underline">browse the full directory of every page</Link>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-medium">
          {['100% free', 'No signup', 'Private — runs locally', 'Instant results'].map((b) => (
            <span key={b} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary">
              {b}
            </span>
          ))}
        </div>
      </section>

      <Link to="/tools/bill-analyzer" className="mb-12 block">
        <div className="rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 to-transparent p-6 transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Featured tool ✦ New</p>
            <p className="mt-1 text-xl font-bold">Bill Analyzer</p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Paste your bills as plain text — get monthly and yearly totals, spending by category,
              and flags on what you're overpaying. 100% private: parsed in your browser, never uploaded.
            </p>
          </div>
          <span className="mt-4 inline-block shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground sm:mt-0">
            Analyze my bills →
          </span>
        </div>
      </Link>

      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold">Just shipped</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {CALCULATORS.length} calculators and counting. Newest: the small-business
          reality-check suite — bounce house payback math, laundromat NOI and the
          water-bill test, vending route payback, notary signing-agent true hourly,
          massage pricing with the body cap, pest route annuities, mobile grooming,
          tree service crew economics, and landscape install costing.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.filter((c) =>
            ['bounce-house-rental-calculator', 'laundromat-roi-calculator', 'vending-machine-route-calculator', 'notary-signing-agent-calculator', 'massage-therapist-pricing-calculator', 'tree-service-pricing-calculator'].includes(c.slug),
          ).map((c) => (
            <Link key={c.slug} to={`/calculators/${c.slug}`}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold">{c.shortTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.tagline}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold">Pro tools for your business</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          The math that decides whether a business makes money — bid sheets, pricing, quotas, and the tax deduction
          every driver misses.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.filter((c) =>
            ['bid-sheet-calculator', 'markup-margin-calculator', 'gci-goal-calculator', 'mileage-deduction-calculator', 'lawn-care-pricing-calculator', 'prime-cost-calculator'].includes(c.slug),
          ).map((c) => (
            <Link key={c.slug} to={`/calculators/${c.slug}`}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold">{c.shortTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.tagline}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold">Bet you didn&apos;t expect these 🤯</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          The tools people use every week but never think to search for — from the weight room to the mulch bed.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CALCULATORS.filter((c) =>
            ['one-rep-max-calculator', 'running-pace-calculator', 'mulch-calculator', 'final-grade-calculator', 'ohms-law-calculator', 'macro-calculator', 'heart-rate-zone-calculator', 'concrete-calculator', 'body-fat-calculator', 'gravel-calculator', 'periodization-planner', 'velocity-based-training-calculator', 'ckd-carb-up-calculator', 'vo2max-calculator', 'paycheck-calculator'].includes(c.slug),
          ).map((c) => (
            <Link key={c.slug} to={`/calculators/${c.slug}`}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold">{c.shortTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.tagline}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot />

      {CATEGORIES.map((cat, i) => {
        const catCalcs = CALCULATORS.filter((c) => c.category === cat)
        const catAnchor = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return (
        <details key={cat} className="group mb-6" open={i === 0}>
          <summary className="mb-4 flex cursor-pointer list-none items-center gap-2 text-xl font-semibold [&::-webkit-details-marker]:hidden">
            <span className="inline-block text-muted-foreground transition-transform group-open:rotate-90">▸</span>
            {cat}
            <span className="text-sm font-normal text-muted-foreground">
              ({catCalcs.length})
            </span>
          </summary>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catCalcs.slice(0, 9).map((c) => (
              <Link key={c.slug} to={`/calculators/${c.slug}`}>
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                  <CardContent className="p-5">
                    <p className="font-semibold">{c.shortTitle}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {catCalcs.length > 9 && (
            <Link
              to={`/directory#${catAnchor}`}
              className="mt-4 inline-block rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              View all {catCalcs.length} in {cat} →
            </Link>
          )}
        </details>
        )
      })}

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Toolkits by profession</h2>
          <Link to="/for" className="text-sm text-primary hover:underline">
            All {PERSONAS.length} toolkits →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.slice(0, 9).map((p) => (
            <Link key={p.slug} to={`/for/${p.slug}`}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <CardContent className="p-5">
                  <p className="font-semibold">{p.job}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.calcSlugs.length} tools curated for how {p.job.split(' ')[0].toLowerCase()} actually work
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Data &amp; Research</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/data/mortgage-payment-by-state">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <CardContent className="p-5">
                <p className="font-semibold">Average Mortgage Payment by State</p>
                <p className="mt-1 text-sm text-muted-foreground">All 50 states + DC, computed live at your rate and term.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/data/average-salary-by-job">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <CardContent className="p-5">
                <p className="font-semibold">Average Salary by Job</p>
                <p className="mt-1 text-sm text-muted-foreground">40 occupations with honest hourly equivalents.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="mb-3 text-xl font-semibold">Why CalcStack?</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>
            Most calculator sites bury the tool under ads, popups, and email gates. CalcStack is the
            opposite: the calculator is the first thing on the page, results update as you type, and
            nothing you enter ever leaves your browser.
          </p>
          <p>
            Each calculator comes with a plain-English explanation of the math behind it and honest
            answers to the questions people actually ask — what rate should I charge, how much house
            can I afford, is it worth paying extra on a loan. The numbers are yours; the context is
            free.
          </p>
        </div>
      </section>
    </>
  )
}
