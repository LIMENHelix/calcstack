import { Link } from 'react-router'
import { DATA_YEAR } from '@/data/stats'
import { MortgageTable } from '@/components/MortgageTable'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'
import { EmbedSnippet } from '@/components/EmbedSnippet'

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

export default function DataMortgage() {
  return (
    <>
      <Seo
        title="Average Mortgage Payment by State (All 50 States + DC)"
        description="Typical monthly mortgage payment for every US state, computed from approximate typical home values. Adjust the rate and term — the table recalculates live."
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

      <MortgageTable />
      <p className="mt-2 text-xs text-muted-foreground">
        * Approximate typical values ({DATA_YEAR}), rounded. Principal &amp; interest only — excludes
        property tax, insurance, HOA, PMI. Figures of this type derive from public housing indices
        and federal housing data; verify current numbers before making decisions.
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
      <EmbedSnippet slug="table/mortgage-by-state" title="Average Mortgage Payment by State table" />
    </>
  )
}
