/* Starter deployment calculator — "I'm starting with $X, what's the best math?"
   Applies Calcy's published policy weights to whatever amount the visitor types,
   in whole shares at live prices, and shows what's affordable, what's locked
   out, and the exact price of admission to unlock it. */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'

interface Policy {
  targets: Record<string, number>
  cashFloorPct: number
}

const NAMES: Record<string, string> = {
  VTI: 'Total US market',
  QQQ: 'Nasdaq-100 growth',
  SCHD: 'Dividend quality',
  GLD: 'Gold hedge',
  NVDA: 'Single-stock satellite',
}

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

export function StarterDeploy() {
  const [amount, setAmount] = useState('100')
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [prices, setPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}calcy-portfolio.json`)
      .then((r) => r.json())
      .then((b) => setPolicy(b.policy ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!policy) return
    fetch(`/api/quotes?symbols=${Object.keys(policy.targets).join(',')}`)
      .then((r) => r.json())
      .then((d) => {
        const m: Record<string, number> = {}
        for (const q of d.quotes ?? []) if (q.last != null) m[q.symbol] = q.last
        setPrices(m)
      })
      .catch(() => {})
  }, [policy])

  const plan = useMemo(() => {
    if (!policy) return null
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) return null
    const syms = Object.keys(policy.targets)
    const weightSum = syms.reduce((s, k) => s + policy.targets[k], 0)
    if (weightSum <= 0) return null
    const cashFloor = (policy.cashFloorPct / 100) * amt
    let cash = amt - cashFloor

    // Ideal dollars per symbol, then floor to whole shares.
    const rows = syms
      .map((sym) => {
        const price = prices[sym] ?? null
        const idealUsd = (amt * policy.targets[sym]) / weightSum
        let shares = price ? Math.floor(Math.min(idealUsd, cash) / price) : 0
        return { sym, price, idealUsd, shares }
      })
      .sort((a, b) => policy.targets[b.sym] - policy.targets[a.sym])

    // Deploy, then greedily park leftover cash in the highest-weight share that fits.
    for (const r of rows) cash -= r.shares * (r.price ?? 0)
    let moved = true
    while (moved) {
      moved = false
      for (const r of rows) {
        if (r.price != null && r.price <= cash) {
          r.shares += 1
          cash -= r.price
          moved = true
          break
        }
      }
    }
    const deployed = amt - cashFloor - cash
    return { rows, cash, cashFloor, deployed, amt }
  }, [policy, prices, amount])

  return (
    <Card className="border-primary/40">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold">Starting with $X? Here's the best math.</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Type your starting amount — Calcy's published policy weights deploy it in whole shares
          at live prices. Whatever's priced out shows its exact cost of admission.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-lg font-bold">$</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            inputMode="decimal"
            className="h-10 w-36 rounded-md border bg-background px-3 text-lg font-semibold tabular-nums"
            aria-label="Starting amount"
          />
          <span className="text-xs text-muted-foreground">try 100 · 500 · 1,000 · 10,000</span>
        </div>

        {plan && (
          <>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3">Position</th>
                    <th className="py-2 pr-3 text-right">Target</th>
                    <th className="py-2 pr-3 text-right">Live price</th>
                    <th className="py-2 text-right">Your deployment</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.rows.map((r) => (
                    <tr key={r.sym} className="border-b last:border-0">
                      <td className="py-2 pr-3">
                        <span className="font-semibold">{r.sym}</span>{' '}
                        <span className="text-xs text-muted-foreground">{NAMES[r.sym]}</span>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{policy?.targets[r.sym]}%</td>
                      <td className="py-2 pr-3 text-right tabular-nums">
                        {r.price != null ? money(r.price) : '—'}
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        {r.shares > 0 ? (
                          <span className="font-semibold text-primary">
                            {r.shares} share{r.shares > 1 ? 's' : ''} · {money(r.shares * (r.price ?? 0))}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            locked — need {r.price != null ? money(r.price) : '—'} for 1 share
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm">
              Deployed <strong>{money(plan.deployed)}</strong> of {money(plan.amt)} ·{' '}
              {money(plan.cash + plan.cashFloor)} rides as cash
              {plan.deployed === 0 && (
                <span className="text-muted-foreground">
                  {' '}
                  — nothing fits yet; the cheapest seat at this table is SCHD.
                </span>
              )}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This is the exact formula running{' '}
              <Link to="/calcy" className="text-primary underline">
                Calcy's live book
              </Link>{' '}
              —{' '}
              <Link to="/calcy/policy" className="text-primary underline">
                rewrite the weights
              </Link>{' '}
              and this table follows your version. Education, not advice; whole shares only.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
