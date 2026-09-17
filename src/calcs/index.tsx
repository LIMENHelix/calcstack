import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num, monthlyPayment, monthsToPayoff } from '@/lib/calc'

export interface CalcProps {
  presets?: Record<string, number>
  stateSlug?: string
}

export function useNumber(initial: number): [number, (v: string) => void] {
  const [v, setV] = useState(initial)
  return [v, (s: string) => setV(parseFloat(s) || 0)]
}

export function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 'any',
}: {
  label: string
  value: number
  onChange: (v: string) => void
  prefix?: string
  suffix?: string
  step?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          inputMode="decimal"
          value={value}
          step={step}
          min={0}
          onChange={(e) => onChange(e.target.value)}
          className={prefix ? 'pl-7' : suffix ? 'pr-12' : ''}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export function Result({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`font-bold ${big ? 'text-3xl text-primary' : 'text-xl'}`}>{value}</p>
    </div>
  )
}

/* ---------------- Freelance Rate ---------------- */

export function FreelanceRateCalc({ presets }: { presets?: Record<string, number> }) {
  const [salary, setSalary] = useNumber(presets?.salary ?? 100000)
  const [expenses, setExpenses] = useNumber(presets?.expenses ?? 10000)
  const [hoursPerWeek, setHoursPerWeek] = useNumber(presets?.hoursPerWeek ?? 40)
  const [billablePct, setBillablePct] = useNumber(presets?.billablePct ?? 60)
  const [weeksOff, setWeeksOff] = useNumber(presets?.weeksOff ?? 4)

  const r = useMemo(() => {
    const weeks = Math.max(1, 52 - weeksOff)
    const billableHours = weeks * hoursPerWeek * (billablePct / 100)
    const hourly = billableHours > 0 ? (salary + expenses) / billableHours : 0
    return { weeks, billableHours, hourly, day: hourly * 8 }
  }, [salary, expenses, hoursPerWeek, billablePct, weeksOff])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Target annual take-home income" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Annual business expenses" value={expenses} onChange={setExpenses} prefix="$" />
          <Field label="Hours worked per week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" />
          <Field label="Billable share of hours" value={billablePct} onChange={setBillablePct} suffix="%" />
          <Field label="Weeks off per year" value={weeksOff} onChange={setWeeksOff} suffix="wks" />
        </div>
        <div className="space-y-3">
          <Result big label="Minimum hourly rate" value={usd(r.hourly, 2)} />
          <Result label="Equivalent day rate (8h)" value={usd(r.day)} />
          <Result label="Billable hours per year" value={num(r.billableHours, 0)} />
          <Result label="Annual revenue target (income + expenses)" value={usd(salary + expenses)} />
          <p className="text-sm text-muted-foreground">
            Quote projects at or above {usd(r.hourly, 2)}/hr internally. Below this floor, a salaried
            job pays you more.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Salary ↔ Hourly ---------------- */

export function SalaryHourlyCalc() {
  const [mode, setMode] = useState<'toHourly' | 'toSalary'>('toHourly')
  const [amount, setAmount] = useNumber(75000)
  const [hours, setHours] = useNumber(40)
  const [weeks, setWeeks] = useNumber(52)

  const r = useMemo(() => {
    const totalHours = hours * weeks
    const hourly = mode === 'toHourly' ? amount / totalHours : amount
    const annual = mode === 'toHourly' ? amount : amount * totalHours
    return {
      hourly,
      annual,
      daily: hourly * 8,
      weekly: hourly * hours,
      biweekly: hourly * hours * 2,
      monthly: annual / 12,
    }
  }, [mode, amount, hours, weeks])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['toHourly', 'toSalary'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  mode === m ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {m === 'toHourly' ? 'Salary → Hourly' : 'Hourly → Salary'}
              </button>
            ))}
          </div>
          <Field
            label={mode === 'toHourly' ? 'Annual salary' : 'Hourly rate'}
            value={amount}
            onChange={setAmount}
            prefix="$"
          />
          <Field label="Hours per week" value={hours} onChange={setHours} suffix="hrs" />
          <Field label="Paid weeks per year" value={weeks} onChange={setWeeks} suffix="wks" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Result big label="Hourly" value={usd(r.hourly, 2)} />
          <Result big label="Annual" value={usd(r.annual)} />
          <Result label="Daily (8h)" value={usd(r.daily)} />
          <Result label="Weekly" value={usd(r.weekly)} />
          <Result label="Biweekly" value={usd(r.biweekly)} />
          <Result label="Monthly" value={usd(r.monthly)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Mortgage ---------------- */

export function MortgageCalc({ presets }: { presets?: Record<string, number> }) {
  const [price, setPrice] = useNumber(presets?.price ?? 400000)
  const [downPct, setDownPct] = useNumber(presets?.downPct ?? 20)
  const [rate, setRate] = useNumber(presets?.rate ?? 6.5)
  const [years, setYears] = useNumber(presets?.years ?? 30)

  const r = useMemo(() => {
    const down = price * (downPct / 100)
    const principal = Math.max(0, price - down)
    const pmt = monthlyPayment(principal, rate, years)
    const n = years * 12
    const total = pmt * n
    return { down, principal, pmt, total, interest: total - principal }
  }, [price, downPct, rate, years])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Home price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Interest rate (APR)" value={rate} onChange={setRate} suffix="%" />
          <Field label="Loan term" value={years} onChange={setYears} suffix="yrs" />
        </div>
        <div className="space-y-3">
          <Result big label="Monthly payment (P&I)" value={usd(r.pmt, 2)} />
          <Result label="Loan amount" value={usd(r.principal)} />
          <Result label="Down payment" value={usd(r.down)} />
          <Result label="Total paid over life of loan" value={usd(r.total)} />
          <Result label="Total interest" value={usd(r.interest)} />
          <p className="text-sm text-muted-foreground">
            Excludes property tax, insurance, HOA, and PMI — budget an additional 20–40%.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Compound Interest ---------------- */

export function CompoundInterestCalc() {
  const [initial, setInitial] = useNumber(10000)
  const [monthly, setMonthly] = useNumber(500)
  const [rate, setRate] = useNumber(7)
  const [years, setYears] = useNumber(30)

  const r = useMemo(() => {
    const m = rate / 100 / 12
    let balance = initial
    const schedule: { year: number; balance: number; contributed: number }[] = []
    let contributed = initial
    for (let y = 1; y <= years; y++) {
      for (let i = 0; i < 12; i++) {
        balance = balance * (1 + m) + monthly
        contributed += monthly
      }
      schedule.push({ year: y, balance, contributed })
    }
    return { final: balance, contributed, growth: balance - contributed, schedule }
  }, [initial, monthly, rate, years])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Field label="Starting amount" value={initial} onChange={setInitial} prefix="$" />
            <Field label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" />
            <Field label="Annual return rate" value={rate} onChange={setRate} suffix="%" />
            <Field label="Years" value={years} onChange={setYears} suffix="yrs" />
          </div>
          <div className="space-y-3">
            <Result big label="Final balance" value={usd(r.final)} />
            <Result label="Total contributed" value={usd(r.contributed)} />
            <Result label="Total growth" value={usd(r.growth)} />
          </div>
        </div>
        <div className="mt-6 max-h-64 overflow-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-right">Balance</th>
                <th className="p-2 text-right">Contributed</th>
                <th className="p-2 text-right">Growth</th>
              </tr>
            </thead>
            <tbody>
              {r.schedule.map((s) => (
                <tr key={s.year} className="border-t">
                  <td className="p-2">{s.year}</td>
                  <td className="p-2 text-right">{usd(s.balance)}</td>
                  <td className="p-2 text-right">{usd(s.contributed)}</td>
                  <td className="p-2 text-right">{usd(s.balance - s.contributed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Savings Goal ---------------- */

export function SavingsGoalCalc() {
  const [goal, setGoal] = useNumber(30000)
  const [saved, setSaved] = useNumber(2000)
  const [months, setMonths] = useNumber(24)
  const [rate, setRate] = useNumber(4.5)

  const r = useMemo(() => {
    const m = rate / 100 / 12
    const n = Math.max(1, Math.round(months))
    // Future value of current savings; solve for deposit d: goal = saved*(1+m)^n + d*(((1+m)^n - 1)/m)
    const fvSaved = saved * Math.pow(1 + m, n)
    const annuityFactor = m === 0 ? n : (Math.pow(1 + m, n) - 1) / m
    const deposit = Math.max(0, (goal - fvSaved) / annuityFactor)
    const totalDeposits = deposit * n + saved
    return { deposit, interest: Math.max(0, goal - totalDeposits), n }
  }, [goal, saved, months, rate])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Savings goal" value={goal} onChange={setGoal} prefix="$" />
          <Field label="Already saved" value={saved} onChange={setSaved} prefix="$" />
          <Field label="Deadline" value={months} onChange={setMonths} suffix="mos" />
          <Field label="Account interest rate (APY)" value={rate} onChange={setRate} suffix="%" />
        </div>
        <div className="space-y-3">
          <Result big label="Required monthly deposit" value={usd(r.deposit, 2)} />
          <Result label="Interest earned along the way" value={usd(r.interest, 2)} />
          <Result label="Months to goal" value={String(r.n)} />
          <p className="text-sm text-muted-foreground">
            Too steep? Add months or trim the goal until the deposit fits your budget — a plan you
            keep beats a plan you abandon.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Loan Payoff ---------------- */

export function LoanPayoffCalc() {
  const [balance, setBalance] = useNumber(25000)
  const [rate, setRate] = useNumber(8)
  const [yearsLeft, setYearsLeft] = useNumber(5)
  const [extra, setExtra] = useNumber(100)

  const r = useMemo(() => {
    const pmt = monthlyPayment(balance, rate, yearsLeft)
    const baseMonths = yearsLeft * 12
    const baseInterest = pmt * baseMonths - balance
    const newPmt = pmt + extra
    const newMonthsRaw = monthsToPayoff(balance, rate, newPmt)
    const newMonths = isFinite(newMonthsRaw) ? newMonthsRaw : baseMonths
    const newInterest = newPmt * newMonths - balance
    return {
      pmt,
      baseMonths,
      baseInterest,
      newPmt,
      newMonths,
      monthsSaved: Math.max(0, baseMonths - newMonths),
      interestSaved: Math.max(0, baseInterest - newInterest),
    }
  }, [balance, rate, yearsLeft, extra])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Loan balance" value={balance} onChange={setBalance} prefix="$" />
          <Field label="Interest rate (APR)" value={rate} onChange={setRate} suffix="%" />
          <Field label="Remaining term" value={yearsLeft} onChange={setYearsLeft} suffix="yrs" />
          <Field label="Extra monthly payment" value={extra} onChange={setExtra} prefix="$" />
        </div>
        <div className="space-y-3">
          <Result label="Current monthly payment" value={usd(r.pmt, 2)} />
          <Result big label="Interest saved with extra payments" value={usd(r.interestSaved)} />
          <Result label="Time saved" value={`${num(r.monthsSaved, 0)} months`} />
          <Result label="New payoff time" value={`${num(r.newMonths, 0)} months (${num(r.newMonths / 12, 1)} yrs)`} />
          <Result label="Baseline interest (no extra)" value={usd(r.baseInterest)} />
        </div>
      </CardContent>
    </Card>
  )
}

export const CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'freelance-rate-calculator': FreelanceRateCalc,
  'salary-to-hourly-calculator': SalaryHourlyCalc,
  'mortgage-payment-calculator': MortgageCalc,
  'compound-interest-calculator': CompoundInterestCalc,
  'savings-goal-calculator': SavingsGoalCalc,
  'loan-payoff-calculator': LoanPayoffCalc,
}
