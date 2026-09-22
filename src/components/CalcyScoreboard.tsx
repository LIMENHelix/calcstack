/* Compact homepage scoreboard for Calcy's paper portfolio — fetches the book
   JSON + live quotes and shows equity, return vs SPY, and the verdict. */
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

interface Book {
  startValue: number
  cash: number
  benchmark: { symbol: string; startPrice: number }
  positions: { symbol: string; shares: number; avgCost: number }[]
  trades: { date: string; action: string; symbol: string }[]
}

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

export function CalcyScoreboard() {
  const [state, setState] = useState<{
    equity: number
    totalReturn: number
    benchReturn: number
    lastAction: string
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const book: Book = await (
          await fetch(`${import.meta.env.BASE_URL}calcy-portfolio.json`)
        ).json()
        const syms = [...new Set([...book.positions.map((p) => p.symbol), book.benchmark.symbol])]
        const data = await (await fetch(`/api/quotes?symbols=${syms.join(',')}`)).json()
        const q: Record<string, number> = {}
        for (const x of data.quotes ?? []) if (x.last != null) q[x.symbol] = x.last
        const positionsValue = book.positions.reduce(
          (s, p) => s + p.shares * (q[p.symbol] ?? p.avgCost),
          0,
        )
        const equity = book.cash + positionsValue
        const totalReturn = ((equity - book.startValue) / book.startValue) * 100
        const spy = q[book.benchmark.symbol] ?? book.benchmark.startPrice
        const benchReturn = ((spy - book.benchmark.startPrice) / book.benchmark.startPrice) * 100
        const last = book.trades[book.trades.length - 1]
        const lastAction = last
          ? `${last.action}${last.symbol && last.symbol !== '—' ? ` ${last.symbol}` : ''} · ${last.date}`
          : ''
        if (!cancelled) setState({ equity, totalReturn, benchReturn, lastAction })
      } catch {
        /* scoreboard stays hidden if data is unavailable */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!state) return null
  const beating = state.totalReturn >= state.benchReturn

  return (
    <Link to="/calcy" className="mb-12 block">
      <div className="rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md sm:flex sm:items-center sm:gap-6">
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}${beating ? 'calcy-celebrate.png' : 'calcy-thinking.png'}`}
            alt="Calcy"
            className="h-12 w-12 shrink-0"
          />
          <div>
            <p className="text-sm font-bold">Calcy vs the S&amp;P 500</p>
            <p className="text-xs text-muted-foreground">
              The mascot's $100k paper portfolio · last move: {state.lastAction}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-6 sm:ml-auto sm:mt-0">
          <div className="text-right">
            <p className="text-lg font-extrabold tabular-nums">{money(state.equity)}</p>
            <p
              className={`text-xs font-semibold tabular-nums ${
                state.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              Calcy {pct(state.totalReturn)}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-lg font-extrabold tabular-nums ${
                state.benchReturn >= 0 ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {pct(state.benchReturn)}
            </p>
            <p className="text-xs text-muted-foreground">S&amp;P 500</p>
          </div>
          <div className="self-center text-xl">{beating ? '🏆' : '😤'}</div>
        </div>
      </div>
    </Link>
  )
}
