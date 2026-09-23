/* Calcy's REAL book — actual money in a live Tradier account, traded by the
   same published formula as the paper portfolio. Public via /api/realbook
   (symbols + quantities only, 5-min cache), marked to live quotes. */
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface RealBook {
  startedAt: string
  startValue: number
  cash: number | null
  positions: { symbol: string; quantity: number; costBasis: number }[]
}

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

export function RealBook() {
  const [book, setBook] = useState<RealBook | null>(null)
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    fetch('/api/realbook')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setBook)
      .catch(() => setOffline(true))
  }, [])

  useEffect(() => {
    if (!book || book.positions.length === 0) return
    fetch(`/api/quotes?symbols=${book.positions.map((p) => p.symbol).join(',')}`)
      .then((r) => r.json())
      .then((d) => {
        const m: Record<string, number> = {}
        for (const q of d.quotes ?? []) if (q.last != null) m[q.symbol] = q.last
        setPrices(m)
      })
      .catch(() => {})
  }, [book])

  const calc = useMemo(() => {
    if (!book) return null
    const rows = book.positions.map((p) => {
      const last = prices[p.symbol] ?? null
      const value = last != null ? last * p.quantity : p.costBasis
      const gain = value - p.costBasis
      return { ...p, last, value, gain }
    })
    const invested = rows.reduce((s, r) => s + r.value, 0)
    const equity = invested + (book.cash ?? 0)
    const ret = ((equity - book.startValue) / book.startValue) * 100
    return { rows, equity, ret }
  }, [book, prices])

  if (offline || !book || !calc) return null

  return (
    <Card className="mt-6 border-primary/40">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">
            The real book — <span className="text-primary">actual money</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Funded {book.startedAt} with {money(book.startValue)} · live from the brokerage
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Same formula, real dollars. A $100 book proves the pipe works — every fill lands here,
          public, within five minutes.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Real equity</p>
            <p className="text-2xl font-extrabold tabular-nums">{money(calc.equity)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Since {book.startedAt}</p>
            <p
              className={`text-2xl font-extrabold tabular-nums ${calc.ret >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
            >
              {pct(calc.ret)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cash</p>
            <p className="text-2xl font-extrabold tabular-nums">{money(book.cash ?? 0)}</p>
          </div>
        </div>
        {calc.rows.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-1 pr-3">Symbol</th>
                  <th className="py-1 pr-3 text-right">Shares</th>
                  <th className="py-1 pr-3 text-right">Cost</th>
                  <th className="py-1 pr-3 text-right">Last</th>
                  <th className="py-1 text-right">P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {calc.rows.map((r) => (
                  <tr key={r.symbol} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-semibold">{r.symbol}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{r.quantity}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{money(r.costBasis)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {r.last != null ? money(r.last) : '—'}
                    </td>
                    <td
                      className={`py-2 text-right font-medium tabular-nums ${r.gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
                    >
                      {r.gain >= 0 ? '+' : ''}
                      {money(r.gain)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
