/* Investing hub — live market quotes (via /api/quotes → Tradier) + the
   calculators that turn those prices into decisions. Quotes degrade
   gracefully: if the API key isn't configured yet, the math still works. */
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CALCULATORS } from '@/data/calculators'
import { Seo } from '@/components/Seo'
import { Card, CardContent } from '@/components/ui/card'
import { CalcyTip } from '@/components/CalcyTip'
import { PortfolioTracker } from '@/components/PortfolioTracker'
import { DcaSimulator } from '@/components/DcaSimulator'

interface Quote {
  symbol: string
  last: number | null
  change: number | null
  changePct: number | null
  name?: string
}

const DEFAULT_SYMBOLS = ['SPY', 'QQQ', 'DIA', 'VTI', 'BND', 'GLD']
const SYMBOL_RE = /^[A-Za-z][A-Za-z0-9.\-]{0,9}$/

const INVEST_SLUGS = [
  'compound-interest-calculator',
  'roi-calculator',
  'coast-fire-calculator',
  'dividend-drip-calculator',
  'safe-withdrawal-calculator',
  'crypto-profit-calculator',
  'inflation-calculator',
  '401k-contribution-calculator',
  'roth-vs-traditional-calculator',
  'capital-gains-tax-calculator',
  'net-investment-income-tax-calculator',
  'student-loan-vs-investing-calculator',
]

export default function Invest() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [status, setStatus] = useState<'loading' | 'live' | 'offline'>('loading')
  const [asOf, setAsOf] = useState<string>('')
  const [custom, setCustom] = useState('')
  const [symbols, setSymbols] = useState<string[]>(DEFAULT_SYMBOLS)

  const load = useCallback(async (syms: string[]) => {
    try {
      const res = await fetch(`/api/quotes?symbols=${syms.join(',')}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      setQuotes(data.quotes ?? [])
      setAsOf(data.asOf ?? '')
      setStatus('live')
    } catch {
      setStatus('offline')
    }
  }, [])

  useEffect(() => {
    load(symbols)
    const t = setInterval(() => load(symbols), 60_000)
    return () => clearInterval(t)
  }, [symbols, load])

  const addSymbol = () => {
    const s = custom.trim().toUpperCase()
    if (!SYMBOL_RE.test(s) || symbols.includes(s) || symbols.length >= 12) return
    setSymbols([...symbols, s])
    setCustom('')
  }

  const investCalcs = INVEST_SLUGS.map((s) => CALCULATORS.find((c) => c.slug === s)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  )

  return (
    <>
      <Seo
        title="Investing — Live Quotes + the Math That Turns Prices into Decisions"
        description="Live market quotes next to the calculators that matter: compound growth, dollar-cost averaging, capital gains, Coast FIRE, and retirement math. Free, instant, no signup."
      />
      <section className="py-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Investing — <span className="text-primary">live prices, real math.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Quotes update every minute while markets are open. Every calculator below runs in your
          browser — no account, no uploads.
        </p>

        {/* Quote board */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {status === 'live' ? (
                <>Live quotes{asOf && <> · updated {new Date(asOf).toLocaleTimeString()}</>}</>
              ) : status === 'loading' ? (
                'Loading quotes…'
              ) : (
                'Live quotes coming online — the calculators below all work now.'
              )}
            </p>
            <div className="flex gap-2">
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSymbol()}
                placeholder="Add ticker (e.g. AAPL)"
                className="h-8 w-36 rounded-md border bg-background px-2 text-sm"
                maxLength={10}
              />
              <button
                onClick={addSymbol}
                className="h-8 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground"
              >
                Add
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(status === 'live' ? quotes : symbols.map((s) => ({ symbol: s, last: null, change: null, changePct: null }))).map((q) => (
              <Card key={q.symbol}>
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-bold">{q.symbol}</p>
                  <p className="text-lg font-semibold tabular-nums">
                    {q.last != null ? `$${q.last.toFixed(2)}` : '—'}
                  </p>
                  <p
                    className={`text-xs font-medium tabular-nums ${
                      (q.changePct ?? 0) > 0 ? 'text-emerald-600' : (q.changePct ?? 0) < 0 ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                  >
                    {q.changePct != null ? `${q.changePct > 0 ? '+' : ''}${q.changePct.toFixed(2)}%` : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <CalcyTip mood="thinking">
          Price is what you see; math is what you keep. Run any number on this page through the
          calculators below before you act on it.
        </CalcyTip>

        {/* Portfolio tracker + DCA simulator on live data */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <PortfolioTracker />
          <DcaSimulator />
        </div>

        {/* Calcy's paper portfolio teaser */}
        <Link to="/calcy" className="mt-4 block">
          <Card className="transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <img
                src={`${import.meta.env.BASE_URL}calcy.png`}
                alt="Calcy"
                className="h-12 w-12 shrink-0"
              />
              <div>
                <p className="text-sm font-semibold">Calcy's paper portfolio — $100k, live scoreboard</p>
                <p className="text-xs text-muted-foreground">
                  The mascot puts his math where his mouth is: real prices, public reasoning, tracked vs the S&amp;P 500.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Calculator grid */}
        <h2 className="mb-4 mt-10 text-xl font-semibold">The investor's toolkit</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {investCalcs.map((c) => (
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
    </>
  )
}
