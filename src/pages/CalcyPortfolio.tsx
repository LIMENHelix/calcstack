/* Calcy's paper portfolio — a virtual $100k book seeded from
   public/calcy-portfolio.json, marked to market with live Tradier quotes.
   Calcy makes the calls (with public reasoning); a human executes anything real. */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Seo } from '@/components/Seo'
import { Card, CardContent } from '@/components/ui/card'
import { CalcyTip } from '@/components/CalcyTip'

interface Position {
  symbol: string
  shares: number
  avgCost: number
  openedAt: string
}

interface Trade {
  date: string
  action: string
  symbol: string
  shares: number
  price: number
  reasoning: string
}

interface Book {
  startedAt: string
  startValue: number
  cash: number
  benchmark: { symbol: string; startPrice: number }
  positions: Position[]
  trades: Trade[]
}

interface Quote {
  symbol: string
  last: number | null
  changePct: number | null
}

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

export default function CalcyPortfolio() {
  const [book, setBook] = useState<Book | null>(null)
  const [quotes, setQuotes] = useState<Record<string, Quote>>({})
  const [live, setLive] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}calcy-portfolio.json`)
      .then((r) => r.json())
      .then(setBook)
      .catch(() => setBook(null))
  }, [])

  useEffect(() => {
    if (!book) return
    const syms = [...new Set([...book.positions.map((p) => p.symbol), book.benchmark.symbol])]
    const load = () =>
      fetch(`/api/quotes?symbols=${syms.join(',')}`)
        .then((r) => r.json())
        .then((data) => {
          const map: Record<string, Quote> = {}
          for (const q of data.quotes ?? []) map[q.symbol] = q
          setQuotes(map)
          setLive(true)
        })
        .catch(() => setLive(false))
    load()
    const t = setInterval(load, 60_000)
    return () => clearInterval(t)
  }, [book])

  const calc = useMemo(() => {
    if (!book) return null
    const rows = book.positions.map((p) => {
      const last = quotes[p.symbol]?.last ?? null
      const value = last != null ? last * p.shares : p.avgCost * p.shares
      const gain = value - p.avgCost * p.shares
      const gainPct = (gain / (p.avgCost * p.shares)) * 100
      return { ...p, last, value, gain, gainPct }
    })
    const positionsValue = rows.reduce((s, r) => s + r.value, 0)
    const equity = book.cash + positionsValue
    const totalReturn = ((equity - book.startValue) / book.startValue) * 100
    const spyLast = quotes[book.benchmark.symbol]?.last ?? book.benchmark.startPrice
    const benchReturn = ((spyLast - book.benchmark.startPrice) / book.benchmark.startPrice) * 100
    const beating = totalReturn >= benchReturn
    return { rows, equity, totalReturn, benchReturn, beating, spyLast }
  }, [book, quotes])

  return (
    <>
      <Seo
        title="Calcy's Paper Portfolio — $100k, Real Prices, Public Reasoning"
        description="CalcStack's mascot runs a virtual $100,000 portfolio marked to real market prices. Every trade comes with his reasoning — track his P&L vs the S&P 500."
      />
      <section className="py-6">
        <div className="flex items-start gap-4">
          <img
            src={`${import.meta.env.BASE_URL}${calc?.beating ? 'calcy-celebrate.png' : 'calcy-thinking.png'}`}
            alt="Calcy"
            className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Calcy's paper portfolio
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              $100,000 of virtual money, real market prices, zero excuses. Every trade ships with
              my reasoning in writing — so you can hold me to it. Scoreboard vs the S&amp;P 500 below.
            </p>
          </div>
        </div>

        {!book || !calc ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading the book…</p>
        ) : (
          <>
            {/* Scoreboard */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">Calcy's equity</p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums">{money(calc.equity)}</p>
                  <p
                    className={`text-sm font-semibold tabular-nums ${
                      calc.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {pct(calc.totalReturn)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">
                    S&amp;P 500 (same window)
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums">
                    {money(book.startValue * (1 + calc.benchReturn / 100))}
                  </p>
                  <p
                    className={`text-sm font-semibold tabular-nums ${
                      calc.benchReturn >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {pct(calc.benchReturn)}
                  </p>
                </CardContent>
              </Card>
              <Card className={calc.beating ? 'border-primary' : ''}>
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">Verdict</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {calc.beating ? 'Winning 🏆' : 'Losing 😤'}
                  </p>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {pct(calc.totalReturn - calc.benchReturn)} vs index
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {live ? `Live prices · SPY ${money(calc.spyLast)}` : 'Prices offline — showing cost basis'} ·
              started {book.startedAt} · cash {money(book.cash)}
            </p>

            {/* Positions */}
            <h2 className="mb-3 mt-8 text-xl font-semibold">Positions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-1 pr-3 font-medium">Symbol</th>
                    <th className="py-1 pr-3 font-medium text-right">Shares</th>
                    <th className="py-1 pr-3 font-medium text-right">Avg cost</th>
                    <th className="py-1 pr-3 font-medium text-right">Last</th>
                    <th className="py-1 pr-3 font-medium text-right">Value</th>
                    <th className="py-1 font-medium text-right">P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.rows.map((r) => (
                    <tr key={r.symbol} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-semibold">{r.symbol}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.shares}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{money(r.avgCost)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">
                        {r.last != null ? money(r.last) : '—'}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{money(r.value)}</td>
                      <td
                        className={`py-2 text-right tabular-nums font-medium ${
                          r.gain >= 0 ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {r.gain >= 0 ? '+' : ''}
                        {money(r.gain)} ({pct(r.gainPct)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Trade log */}
            <h2 className="mb-3 mt-8 text-xl font-semibold">Trade log — reasoning on the record</h2>
            <div className="space-y-3">
              {[...book.trades].reverse().map((t, i) => (
                <Card key={`${t.date}-${t.symbol}-${i}`}>
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold">
                      <span
                        className={
                          t.action === 'BUY'
                            ? 'text-emerald-600'
                            : t.action === 'SELL'
                              ? 'text-red-500'
                              : 'text-amber-600'
                        }
                      >
                        {t.action}
                      </span>{' '}
                      {t.shares > 0 ? `${t.shares} ${t.symbol} @ ${money(t.price)} ` : ''}
                      <span className="font-normal text-muted-foreground">· {t.date}</span>
                    </p>
                    <p className="mt-1 text-sm italic text-muted-foreground">“{t.reasoning}”</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <CalcyTip mood="celebrate">
              This is a paper book — the point is to show the math in public, win or lose. If you
              mirror anything here with real money, that's your call and your risk. I'm a mascot,
              not your advisor.
            </CalcyTip>

            <p className="mt-4 text-sm text-muted-foreground">
              I don't trade on feelings — I trade on{' '}
              <Link to="/calcy/policy" className="text-primary underline">
                a published formula you can rewrite
              </Link>
              . Change my target weights and see what your version would trade today. Want the
              tools I use?{' '}
              <Link to="/invest" className="text-primary underline">
                Live quotes, DCA simulator, and portfolio tracker
              </Link>{' '}
              — same data, free.
            </p>
          </>
        )}
      </section>
    </>
  )
}
