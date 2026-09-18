import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- Lawn Care Pricing (per visit) ---------------- */

const FREQ: Record<string, { label: string; factor: number; visitsMo: number }> = {
  weekly: { label: 'Weekly', factor: 1.0, visitsMo: 4.33 },
  biweekly: { label: 'Every 2 weeks', factor: 1.25, visitsMo: 2.17 },
  monthly: { label: 'Monthly', factor: 1.6, visitsMo: 1 },
}

export function LawnPricingCalc() {
  const [sqft, setSqft] = useNumber(8000)
  const [obstacles, setObstacles] = useNumber(5)
  const [freq, setFreq] = useState('weekly')
  const [rate, setRate] = useNumber(70)

  const r = useMemo(() => {
    const f = FREQ[freq]
    // Mow time: ~700 sq ft/min on a rider (open field), + 1.5 min per obstacle (trees, beds, fences), + 15 min load/edge/blow
    const mowMin = sqft / 700 + obstacles * 1.5 + 15
    const base = (mowMin / 60) * rate
    const price = base * f.factor
    const monthly = price * f.visitsMo
    const season = price * (freq === 'weekly' ? 30 : freq === 'biweekly' ? 15 : 7)
    return { mowMin, base, price, monthly, season, factor: f.factor }
  }, [sqft, obstacles, freq, rate])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Mowable area" value={sqft} onChange={setSqft} suffix="sq ft" />
        <Field label="Obstacles (trees, beds, fences)" value={obstacles} onChange={setObstacles} step="1" />
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Visit frequency</p>
          <select className={inputCls} value={freq} onChange={(e) => setFreq(e.target.value)}>
            {Object.entries(FREQ).map(([v, o]) => <option key={v} value={v}>{o.label}</option>)}
          </select>
        </div>
        <Field label="Target rate (covers labor, fuel, equipment)" value={rate} onChange={setRate} prefix="$" suffix="/hr" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Time on site" value={`${num(r.mowMin, 0)} min`} />
        <Result big label="Price per visit" value={usd(r.price, 2)} />
        <Result label="Monthly revenue (this client)" value={usd(r.monthly, 0)} />
        <Result label="Season revenue (this client)" value={usd(r.season, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Time model: mowable sq ft ÷ 700 per minute, plus 1.5 minutes per obstacle, plus 15 minutes of
        load-in, edging, and blowing — times your target hourly rate. Biweekly lawns get a 25% growth surcharge
        and monthly 60%: the mower does the same route but double the grass. Season assumes ~30 weekly visits
        (April–October in most of the US).
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Season Revenue Planner ---------------- */

export function LawnRevenueCalc() {
  const [clients, setClients] = useNumber(40)
  const [avgPrice, setAvgPrice] = useNumber(45)
  const [visits, setVisits] = useNumber(30)
  const [costPerVisit, setCostPerVisit] = useNumber(8)
  const [upsellPct, setUpsellPct] = useNumber(15)

  const r = useMemo(() => {
    const gross = clients * avgPrice * visits
    const direct = clients * visits * costPerVisit
    const upsell = (gross * upsellPct) / 100
    const net = gross - direct + upsell
    const monthly = net / 7 // 7-month mowing season, most of the US
    return { gross, direct, upsell, net, monthly }
  }, [clients, avgPrice, visits, costPerVisit, upsellPct])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Recurring clients" value={clients} onChange={setClients} step="1" />
        <Field label="Average price per visit" value={avgPrice} onChange={setAvgPrice} prefix="$" />
        <Field label="Visits per season" value={visits} onChange={setVisits} step="1" />
        <Field label="Direct cost per visit (fuel, blades, disposal)" value={costPerVisit} onChange={setCostPerVisit} prefix="$" />
        <Field label="Upsell revenue (mulch, cleanups, aeration)" value={upsellPct} onChange={setUpsellPct} suffix="% of mowing" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Mowing revenue (season)" value={usd(r.gross, 0)} />
        <Result label="Direct costs" value={usd(r.direct, 0)} />
        <Result label="Upsell revenue" value={usd(r.upsell, 0)} />
        <Result big label="Season net before overhead" value={usd(r.net, 0)} />
      </div>
      <Result label="Average per month (7-month season)" value={usd(r.monthly, 0)} />
      <p className="text-sm text-muted-foreground">
        Season revenue = clients × price × visits. The client count is the whole game: 40 clients at $45 for
        30 visits is $54,000 of mowing — and every client you add is worth {usd(avgPrice * visits, 0)} a season
        before upsells. Route density decides the real margin: two neighbors on one stop share the drive time,
        which is why landscapers discount referrals next door, not across town.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Snow Removal Bid ---------------- */

export function SnowBidCalc() {
  const [sqft, setSqft] = useNumber(1000)
  const [depth, setDepth] = useNumber(6)
  const [rate, setRate] = useNumber(90)
  const [pushes, setPushes] = useNumber(15)

  const r = useMemo(() => {
    // Time: 15 min setup + 8 min per 1,000 sq ft + 2 min per inch of depth
    const minutes = 15 + (sqft / 1000) * 8 + depth * 2
    const perPush = (minutes / 60) * rate
    const seasonal = perPush * pushes * 0.85 // 15% seasonal-contract discount
    const perPushSeasonal = pushes > 0 ? seasonal / pushes : 0
    return { minutes, perPush, seasonal, perPushSeasonal }
  }, [sqft, depth, rate, pushes])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Driveway/lot area" value={sqft} onChange={setSqft} suffix="sq ft" />
        <Field label="Snow depth trigger" value={depth} onChange={setDepth} suffix="in" />
        <Field label="Your rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" />
        <Field label="Pushes per season (local average)" value={pushes} onChange={setPushes} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Time per push" value={`${num(r.minutes, 0)} min`} />
        <Result big label="Price per push" value={usd(r.perPush, 2)} />
        <Result label="Seasonal contract (15% off)" value={usd(r.seasonal, 2)} />
        <Result label="Effective per push (seasonal)" value={usd(r.perPushSeasonal, 2)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Time model: 15 minutes of setup and travel amortized per stop, 8 minutes per 1,000 sq ft plowed, plus
        2 minutes per inch of depth — deep snow is slower per pass and sometimes takes two passes. Seasonal
        contracts trade a ~15% discount for guaranteed revenue regardless of snowfall; in a light winter you win,
        in a heavy one the client does. Price per-push work higher to carry the risk back.
      </p>
    </CardContent></Card>
  )
}

export const LAWN_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'lawn-care-pricing-calculator': LawnPricingCalc,
  'lawn-revenue-planner': LawnRevenueCalc,
  'snow-removal-bid-calculator': SnowBidCalc,
}
