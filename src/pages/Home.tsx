import { Link } from 'react-router'
import { CALCULATORS, CATEGORIES } from '@/data/calculators'
import { Seo } from '@/components/Seo'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <>
      <Seo
        title="CalcStack — Free Financial & Freelancer Calculators"
        description="Free, instant calculators: freelance hourly rate, salary-to-hourly, mortgage payment, compound interest, savings goals, and loan payoff. No signup, runs in your browser."
      />
      <section className="mb-10 mt-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Money questions, <span className="text-primary">answered in seconds.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {CALCULATORS.length} free calculators for freelancers, borrowers, savers, and everyday
          money. Results update as you type, and every calculation runs in your browser — no
          accounts, no uploads, no email gates.
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
