import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num } from '@/lib/calc'

/* ---------------- Tip Pool Splitter ---------------- */

interface PoolRow {
  name: string
  hours: number
  points: number
}

const DEFAULT_ROWS: PoolRow[] = [
  { name: 'Server A', hours: 8, points: 1.0 },
  { name: 'Server B', hours: 8, points: 1.0 },
  { name: 'Bartender', hours: 6, points: 1.0 },
  { name: 'Busser', hours: 8, points: 0.5 },
  { name: 'Host', hours: 0, points: 0.25 },
]

export function TipPoolCalc(_props: CalcProps) {
  const [pool, setPool] = useNumber(1000)
  const [rows, setRows] = useState<PoolRow[]>(DEFAULT_ROWS)

  const setRow = (i: number, patch: Partial<PoolRow>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  const r = useMemo(() => {
    const active = rows.filter((row) => row.hours > 0 && row.points > 0)
    const totalWeighted = active.reduce((a, row) => a + row.hours * row.points, 0)
    const perPointHour = totalWeighted > 0 ? pool / totalWeighted : 0
    const shares = rows.map((row) =>
      row.hours > 0 && row.points > 0 ? row.hours * row.points * perPointHour : 0,
    )
    const distributed = shares.reduce((a, s) => a + s, 0)
    return { active, totalWeighted, perPointHour, shares, remainder: pool - distributed }
  }, [pool, rows])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Total tips in the pool" value={pool} onChange={setPool} prefix="$" />
          <p className="text-sm font-medium">Staff (hours worked × points weight)</p>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_64px_64px] gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <span>Name</span>
              <span>Hours</span>
              <span>Points</span>
            </div>
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_64px_64px] gap-2">
                <Input
                  value={row.name}
                  onChange={(e) => setRow(i, { name: e.target.value })}
                  className="h-9"
                />
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={row.hours}
                  onChange={(e) => setRow(i, { hours: parseFloat(e.target.value) || 0 })}
                  className="h-9"
                />
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.25"
                  value={row.points}
                  onChange={(e) => setRow(i, { points: parseFloat(e.target.value) || 0 })}
                  className="h-9"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Typical points: servers/bartenders 1.0, bussers 0.5, hosts/runners 0.25. Set hours to 0
              to skip someone.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <Result big label="Value per point-hour" value={usd(r.perPointHour, 2)} />
          {rows.map((row, i) =>
            r.shares[i] > 0 || (row.hours > 0 && row.points > 0) ? (
              <Result key={i} label={row.name || `Person ${i + 1}`} value={usd(r.shares[i], 2)} />
            ) : null,
          )}
          <p className="text-sm text-muted-foreground">
            {num(r.totalWeighted, 1)} total point-hours across {r.active.length} people. Distributed:{' '}
            {usd(r.perPointHour * r.totalWeighted, 2)} of {usd(pool, 2)}.
          </p>
          <p className="text-xs text-muted-foreground">
            Points systems split the pool by responsibility, not just presence — a busser working the
            same 8 hours gets half a server&apos;s share at 0.5 points. Use the weights your house
            agreed on; the math must be visible to everyone in the pool.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Tip Credit / Minimum Wage Checker ---------------- */

export function TipCreditCalc(_props: CalcProps) {
  const [minWage, setMinWage] = useNumber(7.25)
  const [cashWage, setCashWage] = useNumber(2.13)
  const [tipsPerHour, setTipsPerHour] = useNumber(15)
  const [hoursPerWeek, setHoursPerWeek] = useNumber(30)

  const r = useMemo(() => {
    const requiredCredit = Math.max(0, minWage - cashWage)
    const effective = cashWage + tipsPerHour
    const shortfall = Math.max(0, minWage - effective)
    const weeklyTopUp = shortfall * hoursPerWeek
    const weeklyGross = effective * hoursPerWeek
    const tipsAboveCredit = Math.max(0, tipsPerHour - requiredCredit)
    return { requiredCredit, effective, shortfall, weeklyTopUp, weeklyGross, tipsAboveCredit }
  }, [minWage, cashWage, tipsPerHour, hoursPerWeek])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="State minimum wage" value={minWage} onChange={setMinWage} prefix="$" suffix="/hr" />
          <Field label="Cash wage your employer pays" value={cashWage} onChange={setCashWage} prefix="$" suffix="/hr" />
          <Field label="Average tips earned" value={tipsPerHour} onChange={setTipsPerHour} prefix="$" suffix="/hr" />
          <Field label="Tipped hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" />
          <p className="text-xs text-muted-foreground">
            Federal baseline: $7.25 minimum, $2.13 tipped cash wage, $5.12 max tip credit. Many
            states set higher minimums; California, Oregon, Washington, Nevada, Montana, Alaska, and
            Minnesota prohibit tip credits entirely — enter your state&apos;s actual numbers above
            (find them on your state labor department site or your paystub).
          </p>
        </div>
        <div className="space-y-3">
          {r.shortfall > 0 ? (
            <Result big label="Employer must top up per hour" value={usd(r.shortfall, 2)} />
          ) : (
            <Result big label="Effective hourly wage" value={usd(r.effective, 2)} />
          )}
          <Result label="Weekly gross (cash wage + tips)" value={usd(r.weeklyGross, 2)} />
          <Result label="Tip credit being claimed" value={usd(r.requiredCredit, 2)} />
          {r.shortfall > 0 ? (
            <Result label="Weekly top-up owed to you" value={usd(r.weeklyTopUp, 2)} />
          ) : (
            <Result label="Tips above the credit (all yours)" value={usd(r.tipsAboveCredit, 2)} />
          )}
          <p className="text-sm text-muted-foreground">
            {r.shortfall > 0
              ? `Your cash wage plus tips falls ${usd(r.shortfall, 2)}/hr short of the minimum. The law requires your employer to make up the difference — every pay period, no averaging across weeks. That is ${usd(r.weeklyTopUp, 2)} this week.`
              : `You clear the minimum by ${usd(r.effective - minWage, 2)}/hr. The employer may claim up to ${usd(r.requiredCredit, 2)}/hr of your tips as the "tip credit" — everything above that is untouchable.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Tip Income Share / Budget ---------------- */

export function TipIncomeCalc(_props: CalcProps) {
  const [baseWage, setBaseWage] = useNumber(10)
  const [hoursPerWeek, setHoursPerWeek] = useNumber(30)
  const [tipsPerWeek, setTipsPerWeek] = useNumber(400)

  const r = useMemo(() => {
    const baseWeekly = baseWage * hoursPerWeek
    const totalWeekly = baseWeekly + tipsPerWeek
    const tipShare = totalWeekly > 0 ? (tipsPerWeek / totalWeekly) * 100 : 0
    const annual = totalWeekly * 52
    const monthly = annual / 12
    const floorAnnual = baseWeekly * 52
    const floorMonthly = floorAnnual / 12
    return { baseWeekly, totalWeekly, tipShare, annual, monthly, floorAnnual, floorMonthly }
  }, [baseWage, hoursPerWeek, tipsPerWeek])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Base hourly wage (before tips)" value={baseWage} onChange={setBaseWage} prefix="$" suffix="/hr" />
          <Field label="Hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" />
          <Field label="Average tips per week" value={tipsPerWeek} onChange={setTipsPerWeek} prefix="$" />
          <p className="text-xs text-muted-foreground">
            Use your average over the last 8–12 weeks, not your best Friday. Slow-season average is
            even safer for budgeting.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Total weekly income" value={usd(r.totalWeekly, 2)} />
          <Result label="Share of income from tips" value={`${num(r.tipShare, 1)}%`} />
          <Result label="Estimated annual income" value={usd(r.annual)} />
          <Result label="Monthly average" value={usd(r.monthly, 2)} />
          <Result label="Guaranteed floor (base pay only, monthly)" value={usd(r.floorMonthly, 2)} />
          <p className="text-sm text-muted-foreground">
            {r.tipShare >= 50
              ? `Over half your income (${num(r.tipShare, 0)}%) is tips — variable money. The durable budget rule: size rent, car, and bills against the ${usd(r.floorMonthly, 2)} guaranteed floor, and treat tips as savings, debt payoff, and fun money.`
              : `Tips are ${num(r.tipShare, 0)}% of income — meaningful but not dominant. Budget core bills against base pay plus a conservative tip estimate (your slow-month average), and bank the upside weeks.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const TIP_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'tip-pool-calculator': TipPoolCalc,
  'tip-credit-calculator': TipCreditCalc,
  'tip-income-calculator': TipIncomeCalc,
}
