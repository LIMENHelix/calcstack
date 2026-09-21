/* Portfolio tracker — positions live in localStorage only, prices come from
   /api/quotes (Tradier). Nothing leaves the browser except ticker symbols. */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface Position {
  symbol: string
  shares: number
  costBasis: number // per share
}

interface Quote {
  symbol: string
  last: number | null
  changePct: number | null
}

const STORAGE_KEY = 'calcstack-portfolio'
const SYMBOL_RE = /^[A-Za-z][A-Za-z0-9.\-]{0,9}$/

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

function loadPositions(): Position[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (p): p is Position =>
          p && typeof p.symbol === 'string' && Number(p.shares) > 0 && Number(p.costBasis) >= 0,
      )
      .map((p) => ({ symbol: p.symbol.toUpperCase(), shares: Number(p.shares), costBasis: Number(p.costBasis) }))
  } catch {
    return []
  }
}

export function PortfolioTracker() {
  const [positions, setPositions] = useState<Position[]>(loadPositions)
  const [quotes, setQuotes] = useState<Record<string, Quote>>({})
  const [live, setLive] = useState(false)
  const [sym, setSym] = useState('')
  const [shares, setShares] = useState('')
  const [cost, setCost] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    } catch {
      /* storage full/blocked — session-only is fine */
    }
  }, [positions])

  const refresh = useCallback(async (pos: Position[]) => {
    if (pos.length === 0) return
    const syms = [...new Set(pos.map((p) => p.symbol))]
    try {
      const res = await fetch(`/api/quotes?symbols=${syms.join(',')}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      const map: Record<string, Quote> = {}
      for (const q of data.quotes ?? []) map[q.symbol] = q
      setQuotes(map)
      setLive(true)
    } catch {
      setLive(false)
    }
  }, [])

  useEffect(() => {
    refresh(positions)
    const t = setInterval(() => refresh(positions), 60_000)
    return () => clearInterval(t)
  }, [positions, refresh])

  const add = () => {
    const s = sym.trim().toUpperCase()
    const sh = Number(shares)
    const cb = Number(cost)
    if (!SYMBOL_RE.test(s) || !(sh > 0) || !(cb >= 0) || positions.length >= 20) return
    const existing = positions.find((p) => p.symbol === s)
    if (existing) {
      // merge: weighted average cost basis
      const totalShares = existing.shares + sh
      const avg = (existing.shares * existing.costBasis + sh * cb) / totalShares
      setPositions(
        positions.map((p) => (p.symbol === s ? { symbol: s, shares: totalShares, costBasis: avg } : p)),
      )
    } else {
      setPositions([...positions, { symbol: s, shares: sh, costBasis: cb }])
    }
    setSym('')
    setShares('')
    setCost('')
  }

  const rows = useMemo(
    () =>
      positions.map((p) => {
        const last = quotes[p.symbol]?.last ?? null
        const value = last != null ? last * p.shares : null
        const costTotal = p.costBasis * p.shares
        const gain = value != null ? value - costTotal : null
        const gainPct = gain != null && costTotal > 0 ? (gain / costTotal) * 100 : null
        return { ...p, last, value, costTotal, gain, gainPct }
      }),
    [positions, quotes],
  )

  const totalValue = rows.reduce((s, r) => s + (r.value ?? 0), 0)
  const totalCost = rows.reduce((s, r) => s + r.costTotal, 0)
  const totalGain = totalValue - totalCost
  const anyPriced = rows.some((r) => r.value != null)

  const inputCls = 'h-8 rounded-md border bg-background px-2 text-sm'

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Your positions</h3>
          <p className="text-xs text-muted-foreground">
            {live ? 'live prices' : 'prices offline — cost basis still works'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={sym}
            onChange={(e) => setSym(e.target.value)}
            placeholder="Ticker"
            className={`${inputCls} w-24`}
            maxLength={10}
          />
          <input
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="Shares"
            inputMode="decimal"
            className={`${inputCls} w-24`}
          />
          <input
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost/share"
            inputMode="decimal"
            className={`${inputCls} w-28`}
          />
          <button
            onClick={add}
            className="h-8 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground"
          >
            Add position
          </button>
        </div>

        {rows.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-1 pr-3 font-medium">Symbol</th>
                  <th className="py-1 pr-3 font-medium text-right">Shares</th>
                  <th className="py-1 pr-3 font-medium text-right">Last</th>
                  <th className="py-1 pr-3 font-medium text-right">Value</th>
                  <th className="py-1 pr-3 font-medium text-right">Gain/Loss</th>
                  <th className="py-1 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.symbol} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-semibold">{r.symbol}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{r.shares}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {r.last != null ? money(r.last) : '—'}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {r.value != null ? money(r.value) : '—'}
                    </td>
                    <td
                      className={`py-2 pr-3 text-right tabular-nums font-medium ${
                        (r.gain ?? 0) > 0 ? 'text-emerald-600' : (r.gain ?? 0) < 0 ? 'text-red-500' : ''
                      }`}
                    >
                      {r.gain != null ? (
                        <>
                          {r.gain >= 0 ? '+' : ''}
                          {money(r.gain)}
                          {r.gainPct != null && (
                            <span className="ml-1 text-xs">
                              ({r.gainPct >= 0 ? '+' : ''}
                              {r.gainPct.toFixed(1)}%)
                            </span>
                          )}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => setPositions(positions.filter((p) => p.symbol !== r.symbol))}
                        className="text-xs text-muted-foreground hover:text-red-500"
                        aria-label={`Remove ${r.symbol}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {anyPriced && (
                <tfoot>
                  <tr className="font-semibold">
                    <td className="pt-2 pr-3" colSpan={3}>
                      Total
                    </td>
                    <td className="pt-2 pr-3 text-right tabular-nums">{money(totalValue)}</td>
                    <td
                      className={`pt-2 pr-3 text-right tabular-nums ${
                        totalGain > 0 ? 'text-emerald-600' : totalGain < 0 ? 'text-red-500' : ''
                      }`}
                    >
                      {totalGain >= 0 ? '+' : ''}
                      {money(totalGain)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Positions stay in your browser (localStorage) — nothing is uploaded. Adding the same
          ticker twice merges at a weighted-average cost.
        </p>
      </CardContent>
    </Card>
  )
}
