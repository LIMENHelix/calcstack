import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

/* ---------------- Billable Hours → Revenue ---------------- */

export function BillableHoursCalc() {
  const [revenueGoal, setRevenueGoal] = useNumber(300000)
  const [rate, setRate] = useNumber(250)
  const [utilPct, setUtilPct] = useNumber(70)
  const [hoursWk, setHoursWk] = useNumber(40)
  const [weeks, setWeeks] = useNumber(48)

  const r = useMemo(() => {
    const required = rate > 0 ? revenueGoal / rate : 0
    const capacity = hoursWk * weeks * (utilPct / 100)
    const slack = capacity - required
    const perWeek = weeks > 0 ? required / weeks : 0
    const feasible = slack >= 0
    return { required, capacity, slack, perWeek, feasible }
  }, [revenueGoal, rate, utilPct, hoursWk, weeks])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Revenue goal" value={revenueGoal} onChange={setRevenueGoal} prefix="$" />
        <Field label="Billing rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" />
        <Field label="Utilization (billable % of hours)" value={utilPct} onChange={setUtilPct} suffix="%" />
        <Field label="Working hours per week" value={hoursWk} onChange={setHoursWk} step="1" />
        <Field label="Working weeks per year" value={weeks} onChange={setWeeks} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Billable hours required" value={num(r.required, 0)} />
        <Result label="Billable capacity at utilization" value={num(r.capacity, 0)} />
        <Result label={r.feasible ? 'Slack (hours)' : 'Shortfall (hours)'} value={num(Math.abs(r.slack), 0)} />
        <Result big label="Billable hours needed per week" value={num(r.perWeek, 1)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Required hours = revenue ÷ rate. Capacity = hours × weeks × utilization — and utilization is where plans
        die: admin, business development, email, and training typically eat 25–40% of a professional&apos;s week.
        At {num(utilPct, 0)}% utilization, {num(hoursWk, 0)}-hour weeks over {num(weeks, 0)} weeks give you
        {' '}{num(r.capacity, 0)} billable hours. {r.feasible ? `That covers the goal with ${num(r.slack, 0)} hours of slack.` : `That is ${num(Math.abs(r.slack), 0)} hours SHORT — raise the rate, raise utilization, or lower the goal.`}
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Realization Rate ---------------- */

export function RealizationRateCalc() {
  const [workedHrs, setWorkedHrs] = useNumber(1600)
  const [billedHrs, setBilledHrs] = useNumber(1400)
  const [rate, setRate] = useNumber(250)
  const [invoiced, setInvoiced] = useNumber(322000)
  const [collected, setCollected] = useNumber(308000)

  const r = useMemo(() => {
    const workedValue = workedHrs * rate
    const billedValue = billedHrs * rate
    const billingReal = workedValue > 0 ? (billedValue / workedValue) * 100 : 0
    const invoiceReal = billedValue > 0 ? (invoiced / billedValue) * 100 : 0
    const collectionReal = invoiced > 0 ? (collected / invoiced) * 100 : 0
    const overall = workedValue > 0 ? (collected / workedValue) * 100 : 0
    const leakage = workedValue - collected
    return { workedValue, billedValue, billingReal, invoiceReal, collectionReal, overall, leakage }
  }, [workedHrs, billedHrs, rate, invoiced, collected])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Hours worked" value={workedHrs} onChange={setWorkedHrs} step="1" />
        <Field label="Hours billed (after write-downs)" value={billedHrs} onChange={setBilledHrs} step="1" />
        <Field label="Standard rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" />
        <Field label="Amount invoiced" value={invoiced} onChange={setInvoiced} prefix="$" />
        <Field label="Amount collected" value={collected} onChange={setCollected} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Worked value" value={usd(r.workedValue, 0)} />
        <Result label="Billed value" value={usd(r.billedValue, 0)} />
        <Result label="Billing realization" value={`${num(r.billingReal, 1)}%`} />
        <Result label="Invoice realization" value={`${num(r.invoiceReal, 1)}%`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Collection rate" value={`${num(r.collectionReal, 1)}%`} />
        <Result big label="Overall realization" value={`${num(r.overall, 1)}%`} />
        <Result label="Total leakage vs worked value" value={usd(r.leakage, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Realization leaks in three places: worked → billed (write-downs before invoicing), billed → invoiced
        (discounts at the bill), invoiced → collected (clients who never pay). Overall = collected ÷ worked value.
        Firms typically run 80–90% overall; every point of leakage here is {usd(r.workedValue * 0.01, 0)} on your
        numbers — usually the cheapest revenue a firm can find.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Consultant Day Rate ---------------- */

export function ConsultantDayRateCalc() {
  const [goal, setGoal] = useNumber(150000)
  const [overheadPct, setOverheadPct] = useNumber(30)
  const [billableDays, setBillableDays] = useNumber(120)

  const r = useMemo(() => {
    const need = goal * (1 + overheadPct / 100)
    const dayRate = billableDays > 0 ? need / billableDays : 0
    const hourly = dayRate / 8
    const weekly = dayRate * 5
    return { need, dayRate, hourly, weekly }
  }, [goal, overheadPct, billableDays])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Income goal (salary equivalent)" value={goal} onChange={setGoal} prefix="$" />
        <Field label="Overhead + benefits load" value={overheadPct} onChange={setOverheadPct} suffix="%" />
        <Field label="Billable days per year" value={billableDays} onChange={setBillableDays} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Revenue needed" value={usd(r.need, 0)} />
        <Result big label="Required day rate" value={usd(r.dayRate, 2)} />
        <Result label="Hourly equivalent" value={`${usd(r.hourly, 2)}/hr`} />
        <Result label="Weekly retainer equivalent" value={usd(r.weekly, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Day rate = (income goal × (1 + overhead)) ÷ billable days. The overhead load replaces what an employer
        used to pay: health insurance, retirement match, payroll taxes, software, and unpaid vacation. Billable
        days are the honest constraint — 240 working days minus sales, admin, and delivery gaps lands most solo
        consultants at 100–150. A {usd(goal, 0)} goal over {num(billableDays, 0)} billable days needs
        {' '}{usd(r.dayRate, 0)} a day; quoting less means a smaller income, not a busier calendar.
      </p>
    </CardContent></Card>
  )
}

export const PRO_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'billable-hours-calculator': BillableHoursCalc,
  'realization-rate-calculator': RealizationRateCalc,
  'consultant-day-rate-calculator': ConsultantDayRateCalc,
}
