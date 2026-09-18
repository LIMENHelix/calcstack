import { Link } from 'react-router'
import { CALCULATORS, CATEGORIES } from '@/data/calculators'
import { PERSONAS } from '@/data/personas'
import { Seo } from '@/components/Seo'
import { SearchBar } from '@/components/SearchBar'
import { Card, CardContent } from '@/components/ui/card'
import { AdSlot } from '@/components/Monetization'

export default function Home() {
  return (
    <>
      <Seo
        title="CalcStack — Free Calculators for Your Job & Your Money"
        description="Free, instant calculators organized by the job you do: contractor bid sheets and markup math, agent commission splits, trainer rates, gig-driver mileage deductions, paychecks by state, mortgages, and everyday money. No signup — runs in your browser."
      />
      <section className="mb-10 mt-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Money questions, <span className="text-primary">answered in seconds.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {CALCULATORS.length} free calculators — business math for contractors, agents, trainers, drivers, and
          restaurant owners, plus paychecks by state and everyday money. Results update as you type, and every
          calculation runs in your browser — no accounts, no uploads, no email gates.
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
          The newest tools on the site — what a car really costs per mile, the 20/4/10 car budget,
          and the lease-vs-buy answer with real math.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.filter((c) =>
            ['car-true-cost-calculator', 'car-affordability-calculator', 'lease-vs-buy-calculator', 'rent-vs-buy-calculator', 'rmd-calculator', 'va-funding-fee-calculator'].includes(c.slug),
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

      {CATEGORIES.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{cat}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATORS.filter((c) => c.category === cat).map((c) => (
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
        </section>
      ))}

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
