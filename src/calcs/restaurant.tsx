import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- Food Cost Percentage ---------------- */

export function FoodCostCalc() {
  const [beginInv, setBeginInv] = useNumber(8000)
  const [purchases, setPurchases] = useNumber(12000)
  const [endInv, setEndInv] = useNumber(7000)
  const [foodSales, setFoodSales] = useNumber(40000)

  const r = useMemo(() => {
    const cogs = beginInv + purchases - endInv
    const pct = foodSales > 0 ? (cogs / foodSales) * 100 : 0
    const grossProfit = foodSales - cogs
    return { cogs, pct, grossProfit }
  }, [beginInv, purchases, endInv, foodSales])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Beginning inventory" value={beginInv} onChange={setBeginInv} prefix="$" />
        <Field label="Purchases this period" value={purchases} onChange={setPurchases} prefix="$" />
        <Field label="Ending inventory" value={endInv} onChange={setEndInv} prefix="$" />
        <Field label="Food sales this period" value={foodSales} onChange={setFoodSales} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Cost of goods sold" value={usd(r.cogs, 0)} />
        <Result big label="Food cost %" value={`${num(r.pct, 1)}%`} />
        <Result label="Gross profit on food" value={usd(r.grossProfit, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        COGS = beginning inventory + purchases − ending inventory. Food cost % = COGS ÷ food sales.
        Most full-service restaurants target 28–35%; this is your <em>actual</em> food cost, which always runs a
        few points above the theoretical (menu-card) cost because of waste, comps, and theft — the gap between the
        two is where profit leaks.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Plate Cost & Menu Price ---------------- */

export function PlateCostCalc() {
  const [plateCost, setPlateCost] = useNumber(4.2)
  const [targetPct, setTargetPct] = useNumber(30)
  const [covers, setCovers] = useNumber(300)

  const r = useMemo(() => {
    const price = targetPct > 0 ? plateCost / (targetPct / 100) : 0
    const rounded = Math.round(price + 0.05) - 0.05 // nearest .95 psychological price point (float-safe)
    const margin = price - plateCost
    const marginRounded = rounded - plateCost
    const monthly = marginRounded * covers
    return { price, rounded, margin, marginRounded, monthly }
  }, [plateCost, targetPct, covers])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Ingredient cost per plate" value={plateCost} onChange={setPlateCost} prefix="$" />
        <Field label="Target food cost" value={targetPct} onChange={setTargetPct} suffix="%" />
        <Field label="Covers per month (this dish)" value={covers} onChange={setCovers} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Menu price at target" value={usd(r.price, 2)} />
        <Result label="At a .95 price point" value={usd(r.rounded, 2)} />
        <Result label="Margin per plate (.95)" value={usd(r.marginRounded, 2)} />
        <Result label="Margin per month (.95)" value={usd(r.monthly, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Menu price = plate cost ÷ target food cost %. At a 30% target, a $4.20 plate prices at $14.00 — or $13.95
        at a psychological price point. Cost the plate honestly: protein, starch, veg, sauce, garnish, oil and
        breading — the little items are where plate costing usually goes wrong. Re-run this every time supplier
        prices move; beef moving $0.40/lb moves your plate cost whether you notice or not.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Prime Cost ---------------- */

export function PrimeCostCalc() {
  const [foodCogs, setFoodCogs] = useNumber(13000)
  const [bevCogs, setBevCogs] = useNumber(3000)
  const [labor, setLabor] = useNumber(18000)
  const [sales, setSales] = useNumber(55000)

  const r = useMemo(() => {
    const cogs = foodCogs + bevCogs
    const prime = cogs + labor
    const pct = sales > 0 ? (prime / sales) * 100 : 0
    const laborPct = sales > 0 ? (labor / sales) * 100 : 0
    const cogsPct = sales > 0 ? (cogs / sales) * 100 : 0
    const afterPrime = sales - prime
    const verdict = pct <= 60 ? 'Healthy — under the 60% benchmark' : pct <= 65 ? 'Workable, but watch it — 60–65%' : 'Danger zone — above 65% leaves almost nothing for rent, utilities, or profit'
    return { cogs, prime, pct, laborPct, cogsPct, afterPrime, verdict }
  }, [foodCogs, bevCogs, labor, sales])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Food COGS" value={foodCogs} onChange={setFoodCogs} prefix="$" />
        <Field label="Beverage COGS" value={bevCogs} onChange={setBevCogs} prefix="$" />
        <Field label="Total labor (wages + taxes + benefits)" value={labor} onChange={setLabor} prefix="$" />
        <Field label="Total sales" value={sales} onChange={setSales} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Prime cost" value={`${num(r.pct, 1)}%`} />
        <Result label="COGS % of sales" value={`${num(r.cogsPct, 1)}%`} />
        <Result label="Labor % of sales" value={`${num(r.laborPct, 1)}%`} />
        <Result label="Left for overhead + profit" value={usd(r.afterPrime, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Prime cost = COGS + labor — the two costs you control daily. Benchmark: 60–65% of sales for full-service,
        lower for quick-service. <strong>{r.verdict}.</strong> Every point of prime cost on {usd(sales, 0)} of sales
        is {usd(sales * 0.01, 0)} a month straight to or from the bottom line.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Pour Cost (Bar) ---------------- */

const BOTTLES: [string, string][] = [['750', '750 ml'], ['1000', '1 L'], ['1750', '1.75 L']]
const POURS: [string, string][] = [['1', '1 oz'], ['1.25', '1.25 oz'], ['1.5', '1.5 oz'], ['2', '2 oz']]
const ML_PER_OZ = 29.5735

export function PourCostCalc() {
  const [bottleCost, setBottleCost] = useNumber(24)
  const [bottle, setBottle] = useState('750')
  const [pour, setPour] = useState('1.5')
  const [price, setPrice] = useNumber(12)

  const r = useMemo(() => {
    const oz = parseFloat(bottle) / ML_PER_OZ
    const pourOz = parseFloat(pour)
    const pours = Math.floor(oz / pourOz) // full pours only — the rest is spillage/angels' share
    const costPerPour = pours > 0 ? bottleCost / pours : 0
    const pourPct = price > 0 ? (costPerPour / price) * 100 : 0
    const revenue = pours * price
    const profit = revenue - bottleCost
    return { oz, pours, costPerPour, pourPct, revenue, profit }
  }, [bottleCost, bottle, pour, price])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Bottle cost" value={bottleCost} onChange={setBottleCost} prefix="$" />
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Bottle size</p>
          <select className={inputCls} value={bottle} onChange={(e) => setBottle(e.target.value)}>
            {BOTTLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Pour size</p>
          <select className={inputCls} value={pour} onChange={(e) => setPour(e.target.value)}>
            {POURS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <Field label="Drink price" value={price} onChange={setPrice} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Full pours per bottle" value={String(r.pours)} />
        <Result label="Cost per pour" value={usd(r.costPerPour, 2)} />
        <Result big label="Pour cost" value={`${num(r.pourPct, 1)}%`} />
        <Result label="Gross profit per bottle" value={usd(r.profit, 2)} />
      </div>
      <p className="text-sm text-muted-foreground">
        A {bottle === '750' ? '750 ml' : bottle === '1000' ? '1 L' : '1.75 L'} bottle holds {num(r.oz, 1)} oz —
        {' '}{r.pours} full {pour}-oz pours after accounting for spillage. Pour cost = cost per pour ÷ drink price;
        bars typically target 18–24% for liquor, ~25% for wine by the glass, and price draft beer to 20–30%.
        At ${num(price, 2)} a pour this bottle earns {usd(r.revenue, 2)} against a {usd(bottleCost, 2)} cost.
      </p>
    </CardContent></Card>
  )
}

export const RESTAURANT_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'food-cost-calculator': FoodCostCalc,
  'plate-cost-calculator': PlateCostCalc,
  'prime-cost-calculator': PrimeCostCalc,
  'pour-cost-calculator': PourCostCalc,
}
