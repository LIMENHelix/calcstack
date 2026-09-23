/* Calcy's Investment Policy Statement — the formula that runs the book, in
   public, plus an interactive lab where visitors can rewrite the formula and
   see exactly what trades their version would trigger on the live portfolio.
   Pure client-side math; proposals go out via mailto, nothing is stored. */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Seo } from '@/components/Seo'
import { Card, CardContent } from '@/components/ui/card'
import { CalcyTip } from '@/components/CalcyTip'

interface Position {
  symbol: string
  shares: number
  avgCost: number
}
interface Policy {
  targets: Record<string, number>
  bandPct: number
  cashFloorPct: number
  updatedAt?: string
}
interface Book {
  cash: number
  positions: Position[]
  policy?: Policy
}
interface Quote {
  symbol: string
  last: number | null
}

const SYMBOLS = ['VTI', 'QQQ', 'SCHD', 'GLD', 'NVDA'] as const
const NAMES: Record<string, string> = {
  VTI: 'Total US market',
  QQQ: 'Nasdaq-100 growth',
  SCHD: 'Dividend quality',
  GLD: 'Gold hedge',
  NVDA: 'Single-stock satellite',
}

const DEFAULT_POLICY: Policy = {
  targets: { VTI: 56, QQQ: 22, SCHD: 7, GLD: 8, NVDA: 5 },
  bandPct: 20,
  cashFloorPct: 2,
}

const PRESETS: { name: string; blurb: string; policy: Policy }[] = [
  {
    name: "Calcy's policy",
    blurb: 'The one running the live book right now.',
    policy: DEFAULT_POLICY,
  },
  {
    name: 'Classic 60/40',
    blurb: 'Grandpa’s portfolio. Stocks do the work, dividends calm the nerves.',
    policy: { targets: { VTI: 45, QQQ: 15, SCHD: 25, GLD: 10, NVDA: 3 }, bandPct: 25, cashFloorPct: 2 },
  },
  {
    name: 'All-weather',
    blurb: 'Built to not care what the economy does next.',
    policy: { targets: { VTI: 40, QQQ: 10, SCHD: 20, GLD: 25, NVDA: 3 }, bandPct: 20, cashFloorPct: 2 },
  },
  {
    name: 'Tech maximalist',
    blurb: 'For visitors who think drawdowns are a personality trait.',
    policy: { targets: { VTI: 35, QQQ: 40, SCHD: 5, GLD: 5, NVDA: 13 }, bandPct: 15, cashFloorPct: 2 },
  },
]

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function CalcyPolicy() {
  const [book, setBook] = useState<Book | null>(null)
  const [quotes, setQuotes] = useState<Record<string, Quote>>({})
  const [targets, setTargets] = useState<Record<string, number>>({ ...DEFAULT_POLICY.targets })
  const [bandPct, setBandPct] = useState(DEFAULT_POLICY.bandPct)
  const [cashFloorPct, setCashFloorPct] = useState(DEFAULT_POLICY.cashFloorPct)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}calcy-portfolio.json`)
      .then((r) => r.json())
      .then((b: Book) => {
        setBook(b)
        if (b.policy) {
          setTargets({ ...b.policy.targets })
          setBandPct(b.policy.bandPct)
          setCashFloorPct(b.policy.cashFloorPct)
        }
      })
      .catch(() => setBook(null))
  }, [])

  useEffect(() => {
    fetch(`/api/quotes?symbols=${SYMBOLS.join(',')}`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Quote> = {}
        for (const q of data.quotes ?? []) map[q.symbol] = q
        setQuotes(map)
      })
      .catch(() => {})
  }, [])

  const lab = useMemo(() => {
    if (!book) return null
    const rows = SYMBOLS.map((sym) => {
      const pos = book.positions.find((p) => p.symbol === sym)
      const shares = pos?.shares ?? 0
      const last = quotes[sym]?.last ?? pos?.avgCost ?? 0
      const value = shares * last
      return { sym, shares, last, value }
    })
    const invested = rows.reduce((s, r) => s + r.value, 0)
    const equity = invested + book.cash
    const targetSum = Object.values(targets).reduce((s, t) => s + t, 0)
    const cashFloor = (cashFloorPct / 100) * equity
    const spendable = Math.max(0, book.cash - cashFloor)

    const actions = rows.map((r) => {
      const targetPct = targets[r.sym] ?? 0
      const currentPct = equity > 0 ? (r.value / equity) * 100 : 0
      const lo = (targetPct * (100 - bandPct)) / 100
      const hi = (targetPct * (100 + bandPct)) / 100
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD'
      let shares = 0
      if (targetPct > 0 && currentPct < lo && r.last > 0) {
        // Buy up toward target, limited by spendable cash (allocated later).
        const needed = ((targetPct - currentPct) / 100) * equity
        shares = Math.floor(needed / r.last)
        action = shares > 0 ? 'BUY' : 'HOLD'
      } else if (currentPct > hi && r.last > 0) {
        const excess = ((currentPct - targetPct) / 100) * equity
        shares = Math.min(r.shares, Math.floor(excess / r.last))
        action = shares > 0 ? 'SELL' : 'HOLD'
      }
      return { ...r, targetPct, currentPct, lo, hi, action, shares }
    })

    // Enforce the cash floor: scale buys down if they exceed spendable cash.
    let buyCost = actions.reduce((s, a) => s + (a.action === 'BUY' ? a.shares * a.last : 0), 0)
    if (buyCost > spendable && buyCost > 0) {
      const scale = spendable / buyCost
      for (const a of actions) {
        if (a.action === 'BUY') {
          a.shares = Math.floor(a.shares * scale)
          if (a.shares === 0) a.action = 'HOLD'
        }
      }
      buyCost = actions.reduce((s, a) => s + (a.action === 'BUY' ? a.shares * a.last : 0), 0)
    }
    const sellProceeds = actions.reduce(
      (s, a) => s + (a.action === 'SELL' ? a.shares * a.last : 0),
      0,
    )
    const breached = actions.filter((a) => a.action !== 'HOLD').length
    return { rows, equity, actions, targetSum, breached, buyCost, sellProceeds, spendable }
  }, [book, quotes, targets, bandPct, cashFloorPct])

  const proposalText = useMemo(() => {
    if (!lab) return ''
    const lines = [
      'Calcy policy proposal',
      `Targets (% of book): ${SYMBOLS.map((s) => `${s} ${targets[s]}%`).join(', ')}`,
      `Rebalance band: ±${bandPct}% of target · Cash floor: ${cashFloorPct}%`,
      `Sum of targets: ${lab.targetSum}% (rest is cash)`,
      '',
      'Trades this formula would fire today on the live book:',
      ...lab.actions
        .filter((a) => a.action !== 'HOLD')
        .map(
          (a) =>
            `${a.action} ${a.shares} ${a.sym} @ ~$${a.last.toFixed(2)} (now ${a.currentPct.toFixed(1)}% vs target ${a.targetPct}%)`,
        ),
      lab.breached === 0 ? '(none — everything inside its band)' : '',
    ]
    return lines.filter(Boolean).join('\n')
  }, [lab, targets, bandPct, cashFloorPct])

  const setTarget = (sym: string, v: number) => setTargets((t) => ({ ...t, [sym]: v }))

  return (
    <>
      <Seo
        title="Calcy's Investment Policy — The Formula That Runs the Book"
        description="The exact formula Calcy trades by: target weights, rebalance bands, cash floor. Rewrite it yourself and see what your version would trade today on the live portfolio."
      />
      <section className="py-6">
        <div className="flex items-start gap-4">
          <img
            src={`${import.meta.env.BASE_URL}calcy-thinking.png`}
            alt="Calcy"
            className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              The formula I trade by
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              No feelings, no hunches. Target weights, a rebalance band, a cash floor — when a
              position drifts outside its band, the formula fires a trade. Read it, then rewrite
              it below and see what your version would do to{' '}
              <Link to="/calcy" className="text-primary underline">
                my live book
              </Link>{' '}
              today.
            </p>
          </div>
        </div>

        {/* The policy, in plain English */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold">The rules, in English</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Every dollar has a <strong>target weight</strong> — a fixed % of the book each
                position should hold.
              </li>
              <li>
                Each target gets a <strong>rebalance band</strong> of ±{bandPct}%. Positions may
                wander inside their band untouched — trading on every wiggle is how fees eat you.
              </li>
              <li>
                When a position closes <em>outside</em> its band: sell the overflow down to
                target, or buy up toward target — whole shares only.
              </li>
              <li>
                Buys can never push cash below the <strong>cash floor</strong> ({cashFloorPct}%).
                A book with zero cash can't buy dips.
              </li>
              <li>At most 3 trades per week. Most weeks the correct trade is none.</li>
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
              Current policy: VTI {DEFAULT_POLICY.targets.VTI}% · QQQ {DEFAULT_POLICY.targets.QQQ}%
              · SCHD {DEFAULT_POLICY.targets.SCHD}% · GLD {DEFAULT_POLICY.targets.GLD}% · NVDA{' '}
              {DEFAULT_POLICY.targets.NVDA}% · band ±{DEFAULT_POLICY.bandPct}% · floor{' '}
              {DEFAULT_POLICY.cashFloorPct}%. Reviewed every Monday, in public.
            </p>
          </CardContent>
        </Card>

        <CalcyTip>
          A formula you can argue with is worth ten you can't. Change the weights below — the
          trade list updates instantly against my real positions and live prices.
        </CalcyTip>

        {/* The lab */}
        <Card className="mt-6 border-primary/40">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Rewrite my brain</h2>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    title={p.blurb}
                    onClick={() => {
                      setTargets({ ...p.policy.targets })
                      setBandPct(p.policy.bandPct)
                      setCashFloorPct(p.policy.cashFloorPct)
                    }}
                    className="rounded-full border px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {SYMBOLS.map((sym) => (
                <div key={sym} className="grid grid-cols-[64px_1fr_56px] items-center gap-3">
                  <div>
                    <div className="text-sm font-bold">{sym}</div>
                    <div className="text-[11px] text-muted-foreground">{NAMES[sym]}</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={1}
                    value={targets[sym] ?? 0}
                    onChange={(e) => setTarget(sym, Number(e.target.value))}
                    className="w-full accent-primary"
                    aria-label={`${sym} target weight`}
                  />
                  <div className="text-right text-sm font-semibold tabular-nums">
                    {targets[sym] ?? 0}%
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[64px_1fr_56px] items-center gap-3 border-t pt-4">
                <div className="text-sm font-bold">Band</div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={bandPct}
                  onChange={(e) => setBandPct(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Rebalance band"
                />
                <div className="text-right text-sm font-semibold tabular-nums">±{bandPct}%</div>
              </div>
              <div className="grid grid-cols-[64px_1fr_56px] items-center gap-3">
                <div className="text-sm font-bold">Floor</div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={cashFloorPct}
                  onChange={(e) => setCashFloorPct(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Cash floor"
                />
                <div className="text-right text-sm font-semibold tabular-nums">
                  {cashFloorPct}%
                </div>
              </div>
            </div>

            {lab && (
              <p
                className={`mt-4 text-sm font-medium ${lab.targetSum + cashFloorPct > 100 ? 'text-red-600' : 'text-muted-foreground'}`}
              >
                Targets sum to {lab.targetSum}% + {cashFloorPct}% cash floor
                {lab.targetSum + cashFloorPct > 100
                  ? ' — over 100%, trim something.'
                  : ` — ${100 - lab.targetSum - cashFloorPct}% rides as cash.`}
              </p>
            )}
          </CardContent>
        </Card>

        {/* What your formula would do */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold">What your formula would trade today</h2>
            {!lab ? (
              <p className="mt-4 text-sm text-muted-foreground">Loading the live book…</p>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  Against my actual positions at live prices (book value {money(lab.equity)}).
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="py-2 pr-3">Symbol</th>
                        <th className="py-2 pr-3">Now</th>
                        <th className="py-2 pr-3">Target</th>
                        <th className="py-2 pr-3">Band</th>
                        <th className="py-2 text-right">Verdict</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lab.actions.map((a) => (
                        <tr key={a.sym} className="border-b last:border-0">
                          <td className="py-2 pr-3 font-semibold">{a.sym}</td>
                          <td className="py-2 pr-3 tabular-nums">{a.currentPct.toFixed(1)}%</td>
                          <td className="py-2 pr-3 tabular-nums">{a.targetPct}%</td>
                          <td className="py-2 pr-3 tabular-nums text-muted-foreground">
                            {a.lo.toFixed(1)}–{a.hi.toFixed(1)}%
                          </td>
                          <td className="py-2 text-right">
                            {a.action === 'HOLD' ? (
                              <span className="text-muted-foreground">hold</span>
                            ) : (
                              <span
                                className={`font-bold ${a.action === 'BUY' ? 'text-primary' : 'text-red-600'}`}
                              >
                                {a.action} {a.shares} @ ${a.last.toFixed(2)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {lab.breached === 0
                    ? 'Everything inside its band — your formula says do nothing. Correct answer most weeks.'
                    : `${lab.breached} band breach${lab.breached > 1 ? 'es' : ''} · buys ${money(lab.buyCost)} (spendable cash ${money(lab.spendable)}) · sells free up ${money(lab.sellProceeds)}.`}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    href={`mailto:chris@limenhelix.com?subject=${encodeURIComponent('Calcy policy proposal')}&body=${encodeURIComponent(proposalText)}`}
                  >
                    Propose this formula →
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(proposalText).then(() => {
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      })
                    }}
                    className="rounded-lg border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
                  >
                    {copied ? 'Copied!' : 'Copy the math'}
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Proposals land in the owner's inbox. If yours beats my policy on paper, it gets
                  adopted in a Monday review — with your name in the trade log.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
