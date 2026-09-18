import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- Gig True Hourly ---------------- */

export function GigHourlyCalc() {
  const [gross, setGross] = useNumber(250)
  const [hours, setHours] = useNumber(12)
  const [miles, setMiles] = useNumber(180)
  const [mpg, setMpg] = useNumber(28)
  const [gas, setGas] = useNumber(3.4)
  const [wear, setWear] = useNumber(0.15)

  const r = useMemo(() => {
    const fuel = mpg > 0 ? (miles / mpg) * gas : 0
    const wearCost = miles * wear
    const expenses = fuel + wearCost
    const net = gross - expenses
    const hourly = hours > 0 ? net / hours : 0
    const grossHourly = hours > 0 ? gross / hours : 0
    return { fuel, wearCost, expenses, net, hourly, grossHourly }
  }, [gross, hours, miles, mpg, gas, wear])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Gross earnings (app payout + tips)" value={gross} onChange={setGross} prefix="$" />
        <Field label="Hours online" value={hours} onChange={setHours} suffix="hrs" />
        <Field label="Miles driven" value={miles} onChange={setMiles} suffix="mi" />
        <Field label="Vehicle MPG" value={mpg} onChange={setMpg} />
        <Field label="Gas price" value={gas} onChange={setGas} prefix="$" />
        <Field label="Wear & maintenance per mile" value={wear} onChange={setWear} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Fuel cost" value={usd(r.fuel, 2)} />
        <Result label="Wear & maintenance" value={usd(r.wearCost, 2)} />
        <Result label="Net earnings" value={usd(r.net, 2)} />
        <Result big label="True hourly" value={`${usd(r.hourly, 2)}/hr`} />
      </div>
      <p className="text-sm text-muted-foreground">
        The app shows {usd(r.grossHourly, 2)}/hr gross — after fuel and vehicle wear it is {usd(r.hourly, 2)}/hr.
        Wear per mile (oil, tires, brakes, depreciation) typically runs 10–20¢ for an economy car and more for
        anything bigger; the IRS standard rate (76¢/mi from July 2026) bundles all of it, which is why the tax
        deduction usually exceeds your out-of-pocket costs. Count all hours online, not just active — waiting is working.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Mileage Deduction (2026 split year) ---------------- */

// IRS 2026: 72.5¢/mi Jan 1–Jun 30 (Notice 2026-10), 76¢/mi Jul 1–Dec 31 (Announcement 2026-11)
const RATE_H1_2026 = 0.725
const RATE_H2_2026 = 0.76

export function MileageDeductionCalc() {
  const [milesH1, setMilesH1] = useNumber(8000)
  const [milesH2, setMilesH2] = useNumber(12000)
  const [bracket, setBracket] = useState('22')

  const r = useMemo(() => {
    const dedH1 = milesH1 * RATE_H1_2026
    const dedH2 = milesH2 * RATE_H2_2026
    const deduction = dedH1 + dedH2
    const incRate = parseFloat(bracket) / 100
    // Deduction cuts income tax at the marginal rate, and SE tax at 15.3% × 92.35% of Schedule C profit
    const seRate = 0.153 * 0.9235
    const savings = deduction * (incRate + seRate)
    return { dedH1, dedH2, deduction, savings, incRate, seRate }
  }, [milesH1, milesH2, bracket])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Business miles Jan–Jun 2026" value={milesH1} onChange={setMilesH1} step="1" suffix={`@ ${RATE_H1_2026 * 100}¢`} />
        <Field label="Business miles Jul–Dec 2026" value={milesH2} onChange={setMilesH2} step="1" suffix={`@ ${RATE_H2_2026 * 100}¢`} />
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Marginal income tax bracket</p>
          <select className={inputCls} value={bracket} onChange={(e) => setBracket(e.target.value)}>
            {[['10', '10%'], ['12', '12%'], ['22', '22%'], ['24', '24%'], ['32', '32%']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Deduction Jan–Jun" value={usd(r.dedH1, 0)} />
        <Result label="Deduction Jul–Dec" value={usd(r.dedH2, 0)} />
        <Result big label="Total 2026 deduction" value={usd(r.deduction, 0)} />
        <Result label="Est. tax savings (income + SE tax)" value={usd(r.savings, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        2026 is a split year: 72.5¢/mile through June 30, then 76¢/mile (IRS Notice 2026-10, raised mid-year by
        Announcement 2026-11 on fuel prices). Savings estimate = deduction × (income bracket + 15.3% self-employment
        tax × the 92.35% SE base factor). You must keep a mileage log — date, miles, purpose — and the standard
        mileage method must be chosen in the vehicle's first business year to keep the option open. Parking and
        tolls are deductible on top of the mileage rate.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Delivery Offer Profit ---------------- */

export function DeliveryOfferCalc() {
  const [payout, setPayout] = useNumber(9.5)
  const [miles, setMiles] = useNumber(6.5)
  const [minutes, setMinutes] = useNumber(28)
  const [mpg, setMpg] = useNumber(28)
  const [gas, setGas] = useNumber(3.4)
  const [wear, setWear] = useNumber(0.15)

  const r = useMemo(() => {
    const fuel = mpg > 0 ? (miles / mpg) * gas : 0
    const cost = fuel + miles * wear
    const net = payout - cost
    const perMile = miles > 0 ? payout / miles : 0
    const perHour = minutes > 0 ? net / (minutes / 60) : 0
    const verdict = perMile >= 1.5 ? 'Accept — clears the $1.50/mile rule' : perMile >= 1 ? 'Borderline — take it only toward home or a hot zone' : 'Decline — below $1.00/mile pays you to wear out your car'
    return { fuel, cost, net, perMile, perHour, verdict }
  }, [payout, miles, minutes, mpg, gas, wear])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Offer payout" value={payout} onChange={setPayout} prefix="$" />
        <Field label="Total miles (to pickup + dropoff)" value={miles} onChange={setMiles} suffix="mi" />
        <Field label="Estimated minutes" value={minutes} onChange={setMinutes} suffix="min" />
        <Field label="Vehicle MPG" value={mpg} onChange={setMpg} />
        <Field label="Gas price" value={gas} onChange={setGas} prefix="$" />
        <Field label="Wear per mile" value={wear} onChange={setWear} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Cost to run it" value={usd(r.cost, 2)} />
        <Result label="Net profit" value={usd(r.net, 2)} />
        <Result big label="Payout per mile" value={`${usd(r.perMile, 2)}/mi`} />
        <Result label="Net per hour" value={`${usd(r.perHour, 2)}/hr`} />
      </div>
      <p className="text-sm text-muted-foreground">
        <strong>{r.verdict}.</strong> Veteran drivers screen offers on dollars per mile — $1.50+ is the common
        accept line — and check per-hour after costs as the second gate. Count ALL miles: the drive to the
        restaurant is unpaid distance on every platform. A {usd(payout, 2)} offer at {num(miles, 1)} miles is
        {' '}{usd(r.perMile, 2)}/mile gross, but only {usd(r.net, 2)} in your pocket.
      </p>
    </CardContent></Card>
  )
}

export const GIG_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'gig-driver-hourly-calculator': GigHourlyCalc,
  'mileage-deduction-calculator': MileageDeductionCalc,
  'delivery-offer-calculator': DeliveryOfferCalc,
}
