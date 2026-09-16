import { useState } from 'react'
import { Link } from 'react-router'
import { HOME_VALUES, DATA_YEAR } from '@/data/stats'
import { monthlyPayment, usd } from '@/lib/calc'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'

const FAQ = [
  {
    q: 'What is the average mortgage payment in the US?',
    a: 'On a typical home financed at 20% down over 30 years at ~6.5%, payments cluster between roughly $1,000/month in the lowest-cost states (West Virginia, Mississippi) and $4,300+/month in Hawaii and California. The full state-by-state table is above.',
  },
  {
    q: 'Why does the same house cost so much more per month in some states?',
    a: 'Almost entirely home prices: the loan is 80% of the price, so payment scales directly with local values. Property taxes and insurance widen the real gap further — this table shows principal and interest only.',
  },
  {
    q: 'Are these exact numbers?',
    a: `No — they are computed from approximate typical home values (${DATA_YEAR} estimates) at a fixed 6.5% rate with 20% down over 30 years. Use them to compare states, then run your real numbers in the mortgage calculator.`,
  },
  {
    q: 'How much income do I need for the typical payment in my state?',
    a: 'Using the 28% rule (housing under 28% of gross income), divide the monthly payment by 0.28 and multiply by 12. A $2,000 payment implies roughly $86,000/year of gross household income.',
  },
]

export default function MortgageByState() {
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const rows = HOME_VALUES.map((s) => {
    const principal = s.value * 0.8
    const pmt = monthlyPayment(principal, rate, years)
    return { ...s, principal, pmt, interest: pmt * years * 12 - principal }
  }).sort((a, b) => b.pmt - a.pmt)

  const median = rows[Math.floor(rows.length / 2)]

  return (
    <>
      <Seo
        title="Average Mortgage Payment by State (All 50 States + DC)"
        description="Typical monthly mortgage payment for every US state, computed from approximate typical home values. Compare states, then calculate your own payment."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">CalcStack</Link>
        <span className="mx-2">/</span><span>Data</span>
        <span className="mx-2">/</span><span className="text-foreground">Mortgage Payment by State</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Average Mortgage Payment by State</h1>
      <p className="mb-6 max-w-3xl text-muted-foreground">
        Typical monthly principal &amp; interest payment in every state, computed from approximate
        typical home values ({DATA_YEAR} estimates, rounded) assuming 20% down. Values are
        approximate and for state-to-state comparison — adjust the rate and term below, then run
        your own numbers in the <Link to="/calculators/mortgage-payment-calculator" className="text-primary underline-offset-4 hover:underline">mortgage calculator</Link>.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-6 rounded-lg border bg-card p-4">
        <label className="flex items-center gap-2 text-sm">
          Rate
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            className="h-9 w-20 rounded-md border border-input bg-transparent px-2 text-sm" />
          %
        </label>
        <label className="flex items-center gap-2 text-sm">
          Term
          <input type="number" value={years} onChange={(e) => setYears(parseFloat(e.target.value) || 30)}
            className="h-9 w-20 rounded-md border border-input bg-transparent px-2 text-sm" />
          yrs
        </label>
        <p className="text-sm text-muted-foreground">
          Middle-of-the-pack state ({median.state}): <strong className="text-foreground">{usd(median.pmt, 0)}/mo</strong>
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">State</th>
              <th className="p-2 text-right">Typical home value*</th>
              <th className="p-2 text-right">Loan (80%)</th>
              <th className="p-2 text-right">Monthly P&I</th>
              <th className="p-2 text-right">Total interest</th>
              <th className="p-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t hover:bg-muted/40">
                <td className="p-2 font-medium">{r.state}</td>
                <td className="p-2 text-right">{usd(r.value)}</td>
                <td className="p-2 text-right">{usd(r.principal)}</td>
                <td className="p-2 text-right font-semibold text-primary">{usd(r.pmt, 0)}</td>
                <td className="p-2 text-right text-muted-foreground">{usd(r.interest)}</td>
                <td className="p-2 text-right">
                  <Link to={`/calculators/sales-tax-calculator-${r.slug}`} className="text-xs text-muted-foreground hover:text-primary">
                    tax →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        * Approximate typical values ({DATA_YEAR}), rounded. Principal &amp; interest only — excludes
        property tax, insurance, HOA, PMI. Sources of this type include public housing indices and
        federal housing data; verify current numbers before making decisions.
      </p>

      <AdSlot />

      <article className="mt-10 max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </article>

      <AffiliateCard items={DEFAULT_AFFILIATES} />
    </>
  )
}
