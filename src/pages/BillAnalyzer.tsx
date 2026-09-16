import { useMemo, useState } from 'react'
import { parseBills, summarize, BENCHMARKS } from '@/lib/bills'
import { usd } from '@/lib/calc'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'
import { Card, CardContent } from '@/components/ui/card'

const SAMPLE = `Rent $1,650
Electric bill: 168.40/mo
Internet - Comcast $89.99 monthly
Netflix $15.49
Spotify 11.99/mo
Gym membership $45
Car insurance $214/month
Phone - Verizon $95
Grocery store runs about $520
Water/sewer $78 quarterly avg
Amazon Prime $139/year
DoorDash $110`

const FAQ = [
  {
    q: 'Is my financial data uploaded anywhere?',
    a: 'No. The parsing runs entirely in your browser with plain JavaScript — you can disconnect from the internet and it still works. Nothing is sent to any server, stored, or logged. Close the tab and it is gone.',
  },
  {
    q: 'What formats can I paste?',
    a: 'Almost anything with one expense per line: "Netflix $15.49", "Electric: 142.30/mo", "Gym — $45 monthly". It understands /mo, monthly, /yr, annual, quarterly, and weekly. Copy from a notes app, a spreadsheet column, or type bills in by hand.',
  },
  {
    q: 'How does it decide I am "overpaying"?',
    a: 'Each line is categorized (utilities, streaming, insurance, etc.) and compared against rough typical US household costs. Anything more than 25% above the typical range gets flagged. These are order-of-magnitude benchmarks, not judgments — a big household legitimately spends more.',
  },
  {
    q: 'What should I do with the results?',
    a: 'The flags are your negotiation list: internet, phone, and insurance are the three categories where a single phone call or comparison-shop most often cuts 15–30%. Then feed the monthly total into the savings goal calculator to see what the trimmed amount becomes if you invest the difference.',
  },
]

export default function BillAnalyzer() {
  const [text, setText] = useState('')
  const items = useMemo(() => parseBills(text), [text])
  const s = useMemo(() => summarize(items), [items])

  return (
    <>
      <Seo
        title="Bill Analyzer — Paste Your Bills, See Where the Money Goes"
        description="Paste bills or expenses as plain text and get instant totals, categories, annualized costs, and overpayment flags. 100% private — everything runs in your browser."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <span>CalcStack</span>
        <span className="mx-2">/</span>
        <span>Tools</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">Bill Analyzer</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Bill Analyzer</h1>
      <p className="mb-6 max-w-2xl text-lg text-muted-foreground">
        Paste your bills as plain text — any format — and see monthly and yearly totals, spending
        by category, and which bills look overpriced. Everything runs locally in your browser; your
        numbers never touch a server.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Paste bills here — one per line</label>
              <button
                onClick={() => setText(SAMPLE)}
                className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Try sample data
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={14}
              placeholder={'Netflix $15.49\nElectric bill: 142.30/mo\nRent $1,650\nGym $45 monthly\nAmazon Prime $139/year'}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              🔒 Parsed locally with plain JavaScript. No upload, no storage, no account.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {items.length === 0 ? (
            <Card>
              <CardContent className="flex h-full min-h-48 items-center justify-center p-6 text-center text-sm text-muted-foreground">
                Your breakdown appears here as you type. Tip: hit "Try sample data" to see it work.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Monthly total</p>
                  <p className="text-3xl font-bold text-primary">{usd(s.monthlyTotal, 2)}</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Yearly total</p>
                  <p className="text-3xl font-bold">{usd(s.yearlyTotal, 0)}</p>
                </div>
              </div>

              {s.flags.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
                  <p className="mb-1 font-semibold text-amber-900">⚠ Worth a second look</p>
                  <ul className="space-y-1 text-amber-800">
                    {s.flags.map((f) => (
                      <li key={f.cat}>
                        {f.cat}: {usd(f.monthly, 0)}/mo vs typical ~{usd(f.benchmark, 0)}/mo — compare
                        providers or negotiate.
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-right">Monthly</th>
                      <th className="p-2 text-right">Yearly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{it.label}</td>
                        <td className="p-2">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            {it.category}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {it.frequency === 'one-time' ? 'one-time' : usd(it.monthly, 2)}
                          {it.frequency !== 'monthly' && it.frequency !== 'one-time' && (
                            <span className="ml-1 text-xs text-muted-foreground">({it.frequency})</span>
                          )}
                        </td>
                        <td className="p-2 text-right">{it.frequency === 'one-time' ? usd(it.amount, 2) : usd(it.yearly, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {s.categories.length > 0 && (
                <div className="space-y-2 rounded-lg border p-4">
                  <p className="text-sm font-semibold">By category</p>
                  {s.categories.map(([cat, v]) => {
                    const pct = s.monthlyTotal > 0 ? (v / s.monthlyTotal) * 100 : 0
                    const bench = BENCHMARKS[cat]
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs">
                          <span>{cat}{bench ? ` (typical ~${usd(bench, 0)})` : ''}</span>
                          <span>{usd(v, 0)}/mo · {pct.toFixed(0)}%</span>
                        </div>
                        <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${bench && v > bench * 1.25 ? 'bg-amber-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AdSlot />

      <article className="mt-10 max-w-3xl space-y-8">
        <section>
          <h2 className="mb-2 text-2xl font-bold">Why paste bills into a calculator?</h2>
          <p className="text-muted-foreground">
            Because budgeting apps want your bank login, and spreadsheets want your evening. The Bill
            Analyzer sits between them: paste whatever you have — a notes-app list, lines copied from
            statements, rough numbers from memory — and get an instant, structured picture of your
            fixed costs. The category flags point at the bills where people most commonly overpay:
            internet, phone, insurance, and forgotten subscriptions. Those four categories account
            for the majority of successful "I called and got a lower rate" stories.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-bold">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-1 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <AffiliateCard items={DEFAULT_AFFILIATES} />
    </>
  )
}
