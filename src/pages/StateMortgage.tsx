import { useParams, Link } from 'react-router'
import { HOME_VALUES, DATA_YEAR } from '@/data/stats'
import { monthlyPayment, usd, num } from '@/lib/calc'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'

const RATE = 6.5
const YEARS = 30

export default function StateMortgage() {
  const { slug } = useParams()
  const s = HOME_VALUES.find((h) => h.slug === slug)

  if (!s) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">State not found</h1>
        <p className="mt-2 text-muted-foreground">
          <Link to="/data/mortgage-payment-by-state" className="text-primary underline">All states →</Link>
        </p>
      </div>
    )
  }

  const principal = s.value * 0.8
  const pmt = monthlyPayment(principal, RATE, YEARS)
  const interest = pmt * YEARS * 12 - principal

  const all = HOME_VALUES.map((h) => monthlyPayment(h.value * 0.8, RATE, YEARS)).sort((a, b) => a - b)
  const nationalMedian = all[Math.floor(all.length / 2)]
  const vsMedian = ((pmt - nationalMedian) / nationalMedian) * 100
  const rank = HOME_VALUES.filter((h) => monthlyPayment(h.value * 0.8, RATE, YEARS) > pmt).length + 1
  const incomeNeeded = (pmt / 0.28) * 12

  const faq = [
    {
      q: `What is the average mortgage payment in ${s.state}?`,
      a: `On a typical ${s.state} home (~${usd(s.value)}, ${DATA_YEAR} estimate) with 20% down over 30 years at ~${RATE}%, the principal-and-interest payment is about ${usd(pmt, 0)}/month — before property tax, insurance, and any HOA dues.`,
    },
    {
      q: `How does ${s.state} compare to other states?`,
      a: `${s.state} ranks #${rank} of 51 (states + DC) by typical payment — about ${num(Math.abs(vsMedian), 0)}% ${vsMedian >= 0 ? 'above' : 'below'} the middle-of-the-pack state.`,
    },
    {
      q: `How much income do I need to buy a typical home in ${s.state}?`,
      a: `Using the 28% rule (housing under 28% of gross income), a ${usd(pmt, 0)}/month P&I payment implies roughly ${usd(incomeNeeded, 0)}/year of gross household income — plus room for taxes and insurance.`,
    },
    {
      q: 'Are these exact figures?',
      a: `No — computed from approximate typical home values (${DATA_YEAR}, rounded) at fixed assumptions. Your payment depends on your actual price, rate, down payment, and term; use the mortgage calculator for your numbers.`,
    },
  ]

  return (
    <>
      <Seo
        title={`Average Mortgage Payment in ${s.state} (${DATA_YEAR})`}
        description={`Typical monthly mortgage payment in ${s.state}: about ${usd(pmt, 0)} on a ~${usd(s.value)} home with 20% down. See the full breakdown and compare other states.`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({
              '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">CalcStack</Link>
        <span className="mx-2">/</span>
        <Link to="/data/mortgage-payment-by-state" className="hover:text-foreground">Mortgage by State</Link>
        <span className="mx-2">/</span><span className="text-foreground">{s.state}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Average Mortgage Payment in {s.state}</h1>
      <p className="mb-6 max-w-3xl text-muted-foreground">
        Based on a typical {s.state} home value of roughly {usd(s.value)} ({DATA_YEAR} estimate,
        rounded), financed with 20% down over {YEARS} years at ~{RATE}%.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Monthly payment (P&I)</p>
          <p className="text-3xl font-bold text-primary">{usd(pmt, 0)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Loan amount (80%)</p>
          <p className="text-2xl font-bold">{usd(principal)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total interest ({YEARS} yrs)</p>
          <p className="text-2xl font-bold">{usd(interest)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">vs. middle state</p>
          <p className={`text-2xl font-bold ${vsMedian >= 0 ? 'text-amber-600' : 'text-primary'}`}>
            {vsMedian >= 0 ? '+' : ''}{num(vsMedian, 0)}%
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-card p-5">
        <h2 className="mb-2 font-semibold">{s.state} at a glance</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Typical home value: ~{usd(s.value)} ({DATA_YEAR} estimate)</li>
          <li>• Payment rank among 51 states/DC: <strong className="text-foreground">#{rank}</strong> (1 = most expensive)</li>
          <li>• Income needed by the 28% rule: ~{usd(incomeNeeded, 0)}/yr gross household</li>
          <li>• Assumptions: 20% down, {YEARS}-year term, ~{RATE}% rate, P&I only</li>
        </ul>
        <p className="mt-3 text-sm">
          Your real numbers: <Link to="/calculators/mortgage-payment-calculator" className="text-primary underline-offset-4 hover:underline">mortgage calculator</Link>
          {' · '}{s.state} purchase costs: <Link to={`/calculators/sales-tax-calculator-${s.slug}`} className="text-primary underline-offset-4 hover:underline">{s.state} sales tax calculator</Link>
          {' · '}<Link to="/data/mortgage-payment-by-state" className="text-primary underline-offset-4 hover:underline">Compare all states →</Link>
        </p>
      </div>

      <AdSlot />

      <article className="mt-10 max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        {faq.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-muted-foreground">{f.a}</p>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          * Approximate typical values ({DATA_YEAR}), rounded; principal &amp; interest only. Figures of
          this type derive from public housing indices; verify current numbers before decisions.
        </p>
      </article>

      <AffiliateCard items={DEFAULT_AFFILIATES} />
    </>
  )
}
