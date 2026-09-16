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
          Free calculators for freelancers, borrowers, and savers. Every result updates instantly,
          every calculation runs in your browser — no accounts, no uploads, no ads in your face.
        </p>
      </section>

      {CATEGORIES.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{cat}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CALCULATORS.filter((c) => c.category === cat).map((c) => (
              <Link key={c.slug} to={`/calculators/${c.slug}`}>
                <Card className="h-full transition-colors hover:border-primary">
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
