import { Link } from 'react-router'
import { CALCULATORS } from '@/data/calculators'
import { Seo } from '@/components/Seo'

const SECTIONS: { title: string; blurb: string; slugs: readonly string[] }[] = [
  {
    title: 'Can you afford it — decide before you tour',
    blurb: 'The payment is only part of the cost. Run the numbers before the open house.',
    slugs: ['home-affordability-calculator', 'mortgage-payment-calculator', 'fha-loan-calculator', 'va-loan-calculator', '15-year-mortgage-calculator', 'rent-vs-buy-calculator'],
  },
  {
    title: 'Cash to close — the check nobody warns you about',
    blurb: 'Down payment is not the only money due at the table.',
    slugs: ['closing-cost-calculator', 'va-funding-fee-calculator'],
  },
  {
    title: 'After the keys — moving and first-place budgets',
    blurb: 'The last surprise costs of a first place, priced in advance.',
    slugs: ['moving-cost-calculator', 'first-apartment-budget-calculator'],
  },
  {
    title: 'Already own? Rate-check your mortgage',
    blurb: 'Refinance pitches lead with the payment drop. Check the break-even month first.',
    slugs: ['refinance-break-even-calculator', 'loan-payoff-calculator'],
  },
]

const REASONS: Record<string, string> = {
  'home-affordability-calculator': 'Income and debts in, maximum and comfortable price out — taxes, insurance, and PMI already inside.',
  'mortgage-payment-calculator': 'Principal, interest, and the amortization schedule — see what rate changes do to 30 years.',
  'fha-loan-calculator': '3.5% down, 580 credit — the real payment with financed UFMIP and lifetime MIP included.',
  'va-loan-calculator': 'Veterans: zero down, no monthly insurance ever, funding fee financed — priced against FHA and conventional on the same house.',
  '15-year-mortgage-calculator': 'Half the term, a third of the interest — tested honestly against investing the difference.',
  'rent-vs-buy-calculator': 'The true breakeven year with maintenance, appreciation, and selling costs — not the napkin version.',
  'closing-cost-calculator': 'Cash to close beyond the down payment: lender fees, title, escrow, prepaid taxes and insurance.',
  'va-funding-fee-calculator': '2026 VA funding fee rates, exemption check, and what financing the fee adds to the loan.',
  'moving-cost-calculator': 'DIY truck vs full-service movers, priced by distance and home size.',
  'first-apartment-budget-calculator': 'Rent you can actually afford with deposits, utilities, and the move-in stack.',
  'refinance-break-even-calculator': 'Closing costs ÷ monthly savings, then the honest horizon total that exposes a reset clock.',
  'loan-payoff-calculator': 'What extra payments do to the end date — the cheapest rate cut is often the one you make yourself.',
}

export default function HomeBuying() {
  return (
    <>
      <Seo
        title="Home Buying Hub — Mortgage, Closing Cost & Rent vs Buy Calculators (2026)"
        description="Free home buying calculators: mortgage payment with amortization, true rent-vs-buy breakeven, cash to close, VA funding fee, and moving costs. Do the math before the offer."
      />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Buy the house with math, not vibes</h1>
      <p className="mb-6 max-w-2xl text-muted-foreground">
        The listing photos are engineered to make you skip the spreadsheet. These calculators
        price the whole decision — the monthly payment, the cash due at closing, and the year
        buying finally beats renting.
      </p>

      <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-3">
        <div><p className="font-semibold">Jan – Feb</p><p className="text-muted-foreground">Gather W-2s and tax returns, get pre-approved before the crowd</p></div>
        <div><p className="font-semibold">Mar – Jun</p><p className="text-muted-foreground">Peak inventory — and peak competition and prices</p></div>
        <div><p className="font-semibold">Nov – Feb</p><p className="text-muted-foreground">Fewer listings, but motivated sellers and less bidding</p></div>
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

      <section className="mt-12 max-w-2xl space-y-4 text-sm">
        <h2 className="text-xl font-semibold">Home buying questions, answered</h2>
        <div>
          <p className="font-medium">How much house can I actually afford?</p>
          <p className="text-muted-foreground">
            Lenders qualify you on the 28/36 rule — housing costs under 28% of gross income, all
            debts under 36% — but that is the maximum they will lend, not what leaves room for a
            life. Run the mortgage calculator at the payment that keeps you comfortable, then
            check the price that payment buys at today's rates. The rate matters more than the
            price: 1% on the rate moves the payment about as much as 10% on the price.
          </p>
        </div>
        <div>
          <p className="font-medium">How much cash do I need beyond the down payment?</p>
          <p className="text-muted-foreground">
            Closing costs typically run 2–5% of the price — lender fees, title insurance, escrow,
            appraisal, plus prepaid taxes and insurance. On a $350,000 home that is $7,000–$17,500
            on top of the down payment. The closing cost calculator itemizes it so the
            "cash to close" line on the Loan Estimate holds no surprises.
          </p>
        </div>
        <div>
          <p className="font-medium">Is buying actually better than renting for me?</p>
          <p className="text-muted-foreground">
            It depends almost entirely on how long you stay. Transaction costs in and out run
            roughly 8–10% of the price, so short stays almost never pay. The rent-vs-buy
            calculator finds your breakeven year honestly — with maintenance, appreciation,
            and selling costs included — and for many movers it lands past year five.
          </p>
        </div>
        <div>
          <p className="font-medium">Veteran using a VA loan — what is the funding fee?</p>
          <p className="text-muted-foreground">
            The VA funding fee replaces mortgage insurance: 2.15% of the loan for first use with
            no money down, dropping with 5%+ down and rising slightly on subsequent use. Veterans
            with service-connected disability ratings are exempt entirely. The VA funding fee
            calculator checks the 2026 rates and shows what financing the fee into the loan
            actually costs over time.
          </p>
        </div>
      </section>
    </>
  )
}
