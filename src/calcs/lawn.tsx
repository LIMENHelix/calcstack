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

/* ---------------- Sod Order ---------------- */

export function SodCalc() {
  const [length, setLength] = useNumber(40)
  const [width, setWidth] = useNumber(50)
  const [waste, setWaste] = useState('10')
  const [pallet, setPallet] = useState('450')
  const [price, setPrice] = useNumber(0.5)

  const r = useMemo(() => {
    const area = length * width
    const order = area * (1 + parseFloat(waste) / 100)
    const rolls = Math.ceil(order / 10) // standard roll = 2 ft × 5 ft = 10 sq ft
    const pallets = Math.ceil(order / parseFloat(pallet))
    const cost = order * price
    return { area, order, rolls, pallets, cost }
  }, [length, width, waste, pallet, price])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Lawn length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Lawn width" value={width} onChange={setWidth} suffix="ft" />
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Waste factor</p>
          <select className={inputCls} value={waste} onChange={(e) => setWaste(e.target.value)}>
            <option value="5">5% — rectangular, few obstacles</option>
            <option value="10">10% — typical yard</option>
            <option value="15">15% — curves, beds, first install</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Pallet size</p>
          <select className={inputCls} value={pallet} onChange={(e) => setPallet(e.target.value)}>
            <option value="400">400 sq ft (warm-season slabs)</option>
            <option value="450">450 sq ft (common standard)</option>
            <option value="500">500 sq ft (cool-season rolls)</option>
          </select>
        </div>
        <Field label="Sod price" value={price} onChange={setPrice} prefix="$" suffix="/sq ft" step="0.05" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Net area" value={`${num(r.area, 0)} sq ft`} />
        <Result big label="Order quantity" value={`${num(r.order, 0)} sq ft`} />
        <Result label="10 sq ft rolls" value={String(r.rolls)} />
        <Result label="Pallets to order" value={String(r.pallets)} />
      </div>
      <Result label="Material estimate" value={usd(r.cost, 0)} />
      <p className="text-sm text-muted-foreground">
        A standard roll is 2 ft × 5 ft = 10 sq ft; pallets run 400–500 sq ft depending on grass and
        region (warm-season slabs trend 400, cool-season rolls 500) — confirm the farm's number before
        ordering, because it changes the count. Sod is perishable: it heats up and dies on the pallet
        within 12–24 hours in warm weather, so schedule delivery for the morning you install and water
        each section within 30 minutes of laying it. Typical material runs $0.35–0.80 per sq ft;
        delivery and install are extra.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Irrigation Zone Check ---------------- */

const HEAD_TYPES: [string, number][] = [
  ['Pop-up spray (~1.5 GPM)', 1.5],
  ['Rotor (~3.0 GPM)', 3.0],
  ['MP rotator (~1.0 GPM)', 1.0],
  ['Bubbler (~2.0 GPM)', 2.0],
]
const SOIL_INTAKE: [string, number][] = [
  ['Sandy (~1.5 in/hr)', 1.5],
  ['Loam (~0.75 in/hr)', 0.75],
  ['Clay (~0.3 in/hr)', 0.3],
]

export function IrrigationZoneCalc() {
  const [bucketGal, setBucketGal] = useNumber(5)
  const [bucketSec, setBucketSec] = useNumber(20)
  const [heads, setHeads] = useState<number[]>([6, 2, 0, 0])
  const [area, setArea] = useNumber(1500)
  const [soil, setSoil] = useState('0.75')

  const r = useMemo(() => {
    const measured = bucketSec > 0 ? (60 * bucketGal) / bucketSec : 0
    const design = measured * 0.8 // never design to 100% of measured flow — pressure swings, future demand
    const demand = HEAD_TYPES.reduce((a, [, g], i) => a + g * (heads[i] || 0), 0)
    const fits = demand <= design
    const margin = design - demand
    const pr = area > 0 ? (96.25 * demand) / area : 0
    const intake = parseFloat(soil)
    const runoff = pr > intake
    return { measured, design, demand, fits, margin, pr, intake, runoff }
  }, [bucketGal, bucketSec, heads, area, soil])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Bucket test — gallons caught" value={bucketGal} onChange={setBucketGal} suffix="gal" />
        <Field label="Bucket test — seconds to fill" value={bucketSec} onChange={setBucketSec} suffix="s" />
        <Field label="Zone area watered" value={area} onChange={setArea} suffix="sq ft" />
        {HEAD_TYPES.map(([label], i) => (
          <div key={label} className="space-y-1.5">
            <p className="text-sm font-medium">{label}</p>
            <input
              type="number" min={0} value={heads[i] || ''} placeholder="0"
              onChange={(e) => setHeads((p) => p.map((c, j) => (j === i ? parseInt(e.target.value) || 0 : c)))}
              className={inputCls}
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Soil type</p>
          <select className={inputCls} value={soil} onChange={(e) => setSoil(e.target.value)}>
            {SOIL_INTAKE.map(([l, v]) => <option key={l} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Measured supply" value={`${num(r.measured, 1)} GPM`} />
        <Result label="Design capacity (80%)" value={`${num(r.design, 1)} GPM`} />
        <Result big label="Zone demand" value={`${num(r.demand, 1)} GPM`} />
        <Result label="Verdict" value={r.fits ? `FITS (${num(r.margin, 1)} GPM spare)` : `TOO BIG (${num(-r.margin, 1)} GPM over)`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Precipitation rate" value={`${num(r.pr, 2)} in/hr`} />
        <Result label="Soil intake (typical)" value={`${num(r.intake, 2)} in/hr`} />
        <Result label="Runoff risk" value={r.runoff ? 'HIGH — cycle & soak' : 'Low'} />
        <Result label="Runtime for 0.5 inch" value={r.pr > 0 ? `${num(0.5 / r.pr * 60, 0)} min` : '—'} />
      </div>
      <p className="text-sm text-muted-foreground">
        Supply is a bucket test: GPM = 60 × gallons ÷ seconds, measured at the hose bib with
        everything else off. Design to 80% of that — pressure sags when the neighborhood waters, and
        valves lose flow over time. Precipitation rate is the industry formula PR = 96.25 × zone GPM
        ÷ zone sq ft (the constant converts gallons to inches over square feet per hour); sprays run
        ~1.5–2 in/hr, rotors ~0.5, which is why they never share a zone. If PR beats your soil's
        intake rate, split runtime into cycle-and-soak repeats or the water sheets off instead of
        soaking in. Head GPMs are typical defaults — nozzle charts from the manufacturer govern.
      </p>
    </CardContent></Card>
  )
}

export const LAWN_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'lawn-care-pricing-calculator': LawnPricingCalc,
  'lawn-revenue-planner': LawnRevenueCalc,
  'snow-removal-bid-calculator': SnowBidCalc,
  'sod-calculator': SodCalc,
  'irrigation-zone-calculator': IrrigationZoneCalc,
}
