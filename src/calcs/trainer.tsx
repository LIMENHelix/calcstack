import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

/* ---------------- Trainer Rate: what must I charge? ---------------- */

export function TrainerRateCalc() {
  const [goal, setGoal] = useNumber(80000)
  const [costs, setCosts] = useNumber(12000)
  const [sessionsWk, setSessionsWk] = useNumber(25)
  const [weeks, setWeeks] = useNumber(46)

  const r = useMemo(() => {
    const sessions = sessionsWk * weeks
    const need = goal + costs
    const rate = sessions > 0 ? need / sessions : 0
    const monthly = need / 12
    return { sessions, need, rate, monthly }
  }, [goal, costs, sessionsWk, weeks])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Take-home income goal" value={goal} onChange={setGoal} prefix="$" />
        <Field label="Annual business costs (rent, insurance, software)" value={costs} onChange={setCosts} prefix="$" />
        <Field label="Sessions per week" value={sessionsWk} onChange={setSessionsWk} step="1" />
        <Field label="Working weeks per year" value={weeks} onChange={setWeeks} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Sessions per year" value={num(r.sessions, 0)} />
        <Result label="Revenue needed" value={usd(r.need, 0)} />
        <Result big label="Required rate per session" value={usd(r.rate, 2)} />
        <Result label="Revenue per month" value={usd(r.monthly, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Required rate = (income goal + business costs) ÷ (sessions per week × working weeks). Forty-six working
        weeks assumes vacation, holidays, sick days, and the January slump — trainers who plan on 52 weeks
        overestimate capacity by 10% or more. If the required rate is above your market, the levers are more
        sessions, group training, or online clients — not hoping.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Session Package Pricing ---------------- */

export function SessionPackageCalc() {
  const [rate, setRate] = useNumber(80)
  const [size, setSize] = useNumber(10)
  const [discountPct, setDiscountPct] = useNumber(10)

  const r = useMemo(() => {
    const listValue = rate * size
    const packagePrice = listValue * (1 - discountPct / 100)
    const perSession = size > 0 ? packagePrice / size : 0
    const clientSaves = listValue - packagePrice
    const monthlyAt2PerWk = perSession * 2 * 4.33 // two sessions/week → per-month revenue per client
    return { listValue, packagePrice, perSession, clientSaves, monthlyAt2PerWk }
  }, [rate, size, discountPct])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Single session rate" value={rate} onChange={setRate} prefix="$" />
        <Field label="Sessions in package" value={size} onChange={setSize} step="1" />
        <Field label="Package discount" value={discountPct} onChange={setDiscountPct} suffix="%" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="List value (singles)" value={usd(r.listValue, 2)} />
        <Result big label="Package price" value={usd(r.packagePrice, 2)} />
        <Result label="Effective rate per session" value={usd(r.perSession, 2)} />
        <Result label="Client saves" value={usd(r.clientSaves, 2)} />
      </div>
      <p className="text-sm text-muted-foreground">
        A 10-pack at 10% off trades {usd(r.clientSaves, 2)} of rate for {usd(r.packagePrice, 2)} of cash up front
        and a committed client — usually the right trade, since a prepaid client shows up and a drop-in does not.
        Keep discounts in the 5–15% band: deeper than that and you are paying retail price for loyalty you could
        earn with scheduling alone. One client on this package at 2 sessions/week is about {usd(r.monthlyAt2PerWk, 0)}
        per month of revenue.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Client Capacity ---------------- */

export function ClientCapacityCalc() {
  const [hoursWk, setHoursWk] = useNumber(40)
  const [sessionMin, setSessionMin] = useNumber(60)
  const [bufferMin, setBufferMin] = useNumber(15)
  const [utilPct, setUtilPct] = useNumber(75)
  const [perClientWk, setPerClientWk] = useNumber(2)
  const [rate, setRate] = useNumber(75)
  const [weeks, setWeeks] = useNumber(48)

  const r = useMemo(() => {
    const slotMin = sessionMin + bufferMin
    const slots = slotMin > 0 ? (hoursWk * 60) / slotMin : 0
    const sessions = slots * (utilPct / 100)
    const clients = perClientWk > 0 ? Math.floor(sessions / perClientWk) : 0
    const weekly = sessions * rate
    const yearly = weekly * weeks
    return { slotMin, slots, sessions, clients, weekly, yearly }
  }, [hoursWk, sessionMin, bufferMin, utilPct, perClientWk, rate, weeks])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Working hours per week" value={hoursWk} onChange={setHoursWk} step="1" />
        <Field label="Session length" value={sessionMin} onChange={setSessionMin} suffix="min" />
        <Field label="Buffer between sessions" value={bufferMin} onChange={setBufferMin} suffix="min" />
        <Field label="Bookable utilization" value={utilPct} onChange={setUtilPct} suffix="%" />
        <Field label="Sessions per client per week" value={perClientWk} onChange={setPerClientWk} step="1" />
        <Field label="Rate per session" value={rate} onChange={setRate} prefix="$" />
        <Field label="Working weeks per year" value={weeks} onChange={setWeeks} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Session slots per week" value={num(r.slots, 1)} />
        <Result label="Sessions at utilization" value={num(r.sessions, 1)} />
        <Result big label="Clients you can carry" value={String(r.clients)} />
        <Result label="Weekly revenue at capacity" value={usd(r.weekly, 0)} />
      </div>
      <Result label="Annual revenue at capacity" value={usd(r.yearly, 0)} />
      <p className="text-sm text-muted-foreground">
        Slots = working minutes ÷ (session + buffer). Utilization below 100% is honest — no-shows, cancellations,
        and your own admin eat slots. At {num(r.sessions, 1)} sessions a week and {perClientWk} per client, your
        ceiling is {r.clients} active clients worth {usd(r.yearly, 0)} a year. To grow past the ceiling: raise the
        rate, semi-private sessions (2–4 clients per slot), or online programming — you cannot add hours forever.
      </p>
    </CardContent></Card>
  )
}

export const TRAINER_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'trainer-rate-calculator': TrainerRateCalc,
  'session-package-calculator': SessionPackageCalc,
  'client-capacity-calculator': ClientCapacityCalc,
}
