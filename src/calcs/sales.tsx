import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

/* ---------------- Tiered Sales Commission ---------------- */

export function SalesCommissionCalc() {
  const [sales, setSales] = useNumber(120000)
  const [rate1, setRate1] = useNumber(5)
  const [cap1, setCap1] = useNumber(50000)
  const [rate2, setRate2] = useNumber(8)
  const [cap2, setCap2] = useNumber(100000)
  const [rate3, setRate3] = useNumber(12)

  const r = useMemo(() => {
    const t1Base = Math.min(sales, cap1)
    const t2Base = Math.max(0, Math.min(sales, cap2) - cap1)
    const t3Base = Math.max(0, sales - cap2)
    const t1 = (t1Base * rate1) / 100
    const t2 = (t2Base * rate2) / 100
    const t3 = (t3Base * rate3) / 100
    const total = t1 + t2 + t3
    const blended = sales > 0 ? (total / sales) * 100 : 0
    return { t1Base, t2Base, t3Base, t1, t2, t3, total, blended }
  }, [sales, rate1, cap1, rate2, cap2, rate3])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <Field label="Your sales this period" value={sales} onChange={setSales} prefix="$" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Tier 1 rate" value={rate1} onChange={setRate1} suffix="%" />
        <Field label="Tier 1 up to" value={cap1} onChange={setCap1} prefix="$" />
        <Field label="Tier 2 rate" value={rate2} onChange={setRate2} suffix="%" />
        <Field label="Tier 2 up to" value={cap2} onChange={setCap2} prefix="$" />
        <Field label="Tier 3 rate (above tier 2)" value={rate3} onChange={setRate3} suffix="%" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label={`Tier 1 (${num(rate1, 1)}% × ${usd(r.t1Base, 0)})`} value={usd(r.t1, 2)} />
        <Result label={`Tier 2 (${num(rate2, 1)}% × ${usd(r.t2Base, 0)})`} value={usd(r.t2, 2)} />
        <Result label={`Tier 3 (${num(rate3, 1)}% × ${usd(r.t3Base, 0)})`} value={usd(r.t3, 2)} />
        <Result big label="Total commission" value={usd(r.total, 2)} />
      </div>
      <Result label="Blended rate on sales" value={`${num(r.blended, 2)}%`} />
      <p className="text-sm text-muted-foreground">
        Tiers are marginal, like tax brackets: each rate applies only to the sales inside its band.
        $120,000 at 5/8/12% pays 5% × $50k + 8% × $50k + 12% × $20k = $8,900 — a 7.42% blended rate,
        not 12% of everything.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Quota Attainment & Pace ---------------- */

export function QuotaAttainmentCalc() {
  const [quota, setQuota] = useNumber(1200000)
  const [closed, setClosed] = useNumber(520000)
  const [elapsed, setElapsed] = useNumber(6)

  const r = useMemo(() => {
    const months = Math.min(12, Math.max(1, Math.round(elapsed)))
    const attainment = quota > 0 ? (closed / quota) * 100 : 0
    const paceTarget = (quota * months) / 12
    const pacePct = (months / 12) * 100
    const gap = closed - paceTarget
    const remaining = Math.max(0, quota - closed)
    const monthsLeft = 12 - months
    const perMonth = monthsLeft > 0 ? remaining / monthsLeft : remaining
    const avgSoFar = closed / months
    const projected = avgSoFar * 12
    const projPct = quota > 0 ? (projected / quota) * 100 : 0
    return { months, attainment, paceTarget, pacePct, gap, perMonth, avgSoFar, projected, projPct, monthsLeft }
  }, [quota, closed, elapsed])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual quota" value={quota} onChange={setQuota} prefix="$" />
        <Field label="Closed-won so far" value={closed} onChange={setClosed} prefix="$" />
        <Field label="Months elapsed" value={elapsed} onChange={setElapsed} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Attainment" value={`${num(r.attainment, 1)}%`} />
        <Result label="On-pace target by now" value={usd(r.paceTarget, 0)} />
        <Result label={r.gap >= 0 ? 'Ahead of pace' : 'Behind pace'} value={usd(Math.abs(r.gap), 0)} />
        <Result label="Needed per remaining month" value={usd(r.perMonth, 0)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Your average per month" value={usd(r.avgSoFar, 0)} />
        <Result label="Projected year-end" value={usd(r.projected, 0)} />
        <Result label="Projected attainment" value={`${num(r.projPct, 1)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        After {r.months} month{r.months === 1 ? '' : 's'} a linear pace is {num(r.pacePct, 0)}% of quota
        {' '}({usd(r.paceTarget, 0)}). If your average monthly close ({usd(r.avgSoFar, 0)}) stays flat, you finish at
        {' '}{usd(r.projected, 0)} — {num(r.projPct, 1)}%. To make the full number you need {usd(r.perMonth, 0)} per
        month for the rest of the year. (Real quotas are seasonal — adjust the months-elapsed input to your
        fiscal calendar.)
      </p>
    </CardContent></Card>
  )
}

/* ---------------- OTE Planner ---------------- */

export function OteCalc() {
  const [base, setBase] = useNumber(70000)
  const [variable, setVariable] = useNumber(60000)
  const [rate, setRate] = useNumber(5)

  const r = useMemo(() => {
    const ote = base + variable
    const quota = rate > 0 ? (variable / rate) * 100 : 0
    const perMonth = quota / 12
    const at80 = base + variable * 0.8
    const at120 = base + variable * 1.2
    return { ote, quota, perMonth, at80, at120 }
  }, [base, variable, rate])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Base salary" value={base} onChange={setBase} prefix="$" />
        <Field label="Variable at 100% of quota" value={variable} onChange={setVariable} prefix="$" />
        <Field label="Commission rate on sales" value={rate} onChange={setRate} suffix="%" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="OTE (base + variable)" value={usd(r.ote, 0)} />
        <Result label="Implied annual quota" value={usd(r.quota, 0)} />
        <Result label="Quota per month" value={usd(r.perMonth, 0)} />
        <Result label="Base as % of OTE" value={r.ote > 0 ? `${num((base / r.ote) * 100, 0)}%` : '—'} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Earn at 80% of quota" value={usd(r.at80, 0)} />
        <Result label="Earn at 100% of quota" value={usd(r.ote, 0)} />
        <Result label="Earn at 120% of quota" value={usd(r.at120, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Implied quota = variable ÷ commission rate. A $130k OTE with $60k variable at 5% means carrying a
        {' '}{usd(r.quota, 0)} quota — {usd(r.perMonth, 0)} every month. Compare job offers on the implied quota,
        not the OTE headline: a higher OTE with an unrealistic quota pays less than a lower OTE you can hit.
        (Ignores accelerators/decelerators — check the comp plan for those.)
      </p>
    </CardContent></Card>
  )
}

export const SALES_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'sales-commission-calculator': SalesCommissionCalc,
  'quota-attainment-calculator': QuotaAttainmentCalc,
  'ote-calculator': OteCalc,
}
