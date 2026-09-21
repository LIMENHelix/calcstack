/* DCA simulator — buys a fixed dollar amount at each monthly close from
   /api/history (Tradier) and compares against a lump sum invested up front. */
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface Close {
  date: string
  close: number
}

const SYMBOL_RE = /^[A-Za-z][A-Za-z0-9.\-]{0,9}$/

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

interface Result {
  months: number
  invested: number
  dcaShares: number
  dcaAvg: number
  dcaValue: number
  lumpShares: number
  lumpValue: number
  lastPrice: number
  winner: 'dca' | 'lump' | 'tie'
}

export function DcaSimulator() {
  const [symbol, setSymbol] = useState('SPY')
  const [monthly, setMonthly] = useState('500')
  const [years, setYears] = useState(3)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [r, setR] = useState<Result | null>(null)

  const run = async () => {
    const s = symbol.trim().toUpperCase()
    const m = Number(monthly)
    if (!SYMBOL_RE.test(s) || !(m > 0)) {
      setError('Enter a valid ticker and a monthly amount above $0.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/history?symbol=${encodeURIComponent(s)}&months=${years * 12}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      const closes: Close[] = (data.closes ?? []).filter(
        (c: Close) => Number.isFinite(c.close) && c.close > 0,
      )
      if (closes.length < 2) {
        setError(`Not enough history for ${s} yet — try a bigger ticker like SPY or QQQ.`)
        return
      }
      let dcaShares = 0
      for (const c of closes) dcaShares += m / c.close
      const invested = m * closes.length
      const lumpShares = invested / closes[0].close
      const lastPrice = closes[closes.length - 1].close
      const dcaValue = dcaShares * lastPrice
      const lumpValue = lumpShares * lastPrice
      const winner = dcaValue > lumpValue * 1.0001 ? 'dca' : lumpValue > dcaValue * 1.0001 ? 'lump' : 'tie'
      setR({
        months: closes.length,
        invested,
        dcaShares,
        dcaAvg: invested / dcaShares,
        dcaValue,
        lumpShares,
        lumpValue,
        lastPrice,
        winner,
      })
    } catch {
      setError('History service is offline right now — try again in a minute.')
    } finally {
      setBusy(false)
    }
  }

  const inputCls = 'h-8 rounded-md border bg-background px-2 text-sm'

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold">Dollar-cost averaging vs lump sum</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Real monthly closes, two strategies, one winner. This is the argument, settled with data.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Ticker"
            className={`${inputCls} w-24`}
            maxLength={10}
          />
          <label className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">$</span>
            <input
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              inputMode="decimal"
              className={`${inputCls} w-24`}
            />
            <span className="text-muted-foreground">/mo</span>
          </label>
          <select
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className={inputCls}
          >
            <option value={1}>1 year</option>
            <option value={3}>3 years</option>
            <option value={5}>5 years</option>
            <option value={10}>10 years</option>
          </select>
          <button
            onClick={run}
            disabled={busy}
            className="h-8 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? 'Running…' : 'Run it'}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {r && (
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className={`rounded-lg border p-3 ${
                  r.winner === 'dca' ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  DCA — {money(r.invested / r.months)}/mo for {r.months} months
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">{money(r.dcaValue)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.dcaShares.toFixed(3)} shares @ avg {money(r.dcaAvg)}
                </p>
              </div>
              <div
                className={`rounded-lg border p-3 ${
                  r.winner === 'lump' ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  Lump sum — {money(r.invested)} on day one
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">{money(r.lumpValue)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.lumpShares.toFixed(3)} shares @ {money(r.invested / r.lumpShares)}
                </p>
              </div>
            </div>
            <p className="text-sm">
              {r.winner === 'tie' ? (
                <>Dead heat — within a rounding error either way.</>
              ) : (
                <>
                  <span className="font-semibold">
                    {r.winner === 'dca' ? 'DCA wins this window' : 'Lump sum wins this window'}
                  </span>{' '}
                  by {money(Math.abs(r.dcaValue - r.lumpValue))} on the same {money(r.invested)}{' '}
                  invested. Last close: {money(r.lastPrice)}.
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Historical monthly closes via Tradier. Lump sum wins most rising markets; DCA wins
              when the early months dip. Past performance is not a promise — it's a pattern.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
