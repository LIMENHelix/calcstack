import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num, monthlyPayment } from '@/lib/calc'

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
          <Field label="Billable share of hours (rest is admin, sales, email)" value={billablePct} onChange={setBillablePct} suffix="%" />
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

/* ---------------- Mortgage (flagship: PITI + PMI + HOA + amortization) ---------------- */

const DONUT_COLORS = ['#2563eb', '#93c5fd', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

export function MortgageCalc({ presets }: { presets?: Record<string, number> }) {
  const [price, setPrice] = useNumber(presets?.price ?? 400000)
  const [downPct, setDownPct] = useNumber(presets?.downPct ?? 20)
  const [rate, setRate] = useNumber(presets?.rate ?? 6.5)
  const [years, setYears] = useNumber(presets?.years ?? 30)
  const [taxRate, setTaxRate] = useNumber(presets?.taxRate ?? 1.1)
  const [insurance, setInsurance] = useNumber(presets?.insurance ?? 1800)
  const [pmiRate, setPmiRate] = useNumber(presets?.pmiRate ?? 0.5)
  const [hoa, setHoa] = useNumber(presets?.hoa ?? 0)
  const [showAll, setShowAll] = useState(false)

  const r = useMemo(() => {
    const down = price * (downPct / 100)
    const principal = Math.max(0, price - down)
    const pmt = monthlyPayment(principal, rate, years)
    const n = Math.round(years * 12)
    const mr = rate / 100 / 12
    const taxMo = (price * (taxRate / 100)) / 12
    const insMo = insurance / 12
    const needsPmi = downPct < 20 && principal > 0
    const pmiMo = needsPmi ? (principal * (pmiRate / 100)) / 12 : 0

    // monthly amortization with PMI drop-off at 78% LTV (of original price)
    let bal = principal
    let totalInterest = 0
    let totalPmi = 0
    let pmiEndMonth: number | null = null
    const yearly: { year: number; principal: number; interest: number; balance: number }[] = []
    let yP = 0, yI = 0
    for (let m = 1; m <= n && bal > 0.005; m++) {
      const int = bal * mr
      const pr = Math.min(pmt - int, bal)
      bal -= pr
      totalInterest += int
      yP += pr
      yI += int
      if (needsPmi) {
        if (bal > 0.78 * price) totalPmi += pmiMo
        else if (pmiEndMonth === null) pmiEndMonth = m
      }
      if (m % 12 === 0 || bal <= 0.005 || m === n) {
        yearly.push({ year: Math.ceil(m / 12), principal: yP, interest: yI, balance: Math.max(0, bal) })
        yP = 0; yI = 0
      }
    }
    const monthlyTotal = pmt + taxMo + insMo + pmiMo + hoa
    const grand = totalInterest + totalPmi + taxMo * n + insMo * n + hoa * n + principal
    const payoff = new Date()
    payoff.setMonth(payoff.getMonth() + n)
    return {
      down, principal, pmt, taxMo, insMo, pmiMo, hoa, monthlyTotal,
      totalInterest, totalPmi, grand, yearly, pmiEndMonth, needsPmi, payoff,
    }
  }, [price, downPct, rate, years, taxRate, insurance, pmiRate, hoa])

  // monthly breakdown donut: principal+interest split of first payment, tax, ins, pmi, hoa
  const firstInterest = r.principal * (rate / 100 / 12)
  const firstPrincipal = Math.max(0, r.pmt - firstInterest)
  const segs = [
    { label: 'Principal', v: firstPrincipal },
    { label: 'Interest', v: firstInterest },
    { label: 'Property tax', v: r.taxMo },
    { label: 'Insurance', v: r.insMo },
    { label: 'PMI', v: r.pmiMo },
    { label: 'HOA', v: r.hoa },
  ].filter((s) => s.v > 0.005)
  const segTotal = segs.reduce((a, s) => a + s.v, 0) || 1
  let offset = 25

  const shownYears = showAll ? r.yearly : r.yearly.slice(0, 10)

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Home price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Interest rate (APR)" value={rate} onChange={setRate} suffix="%" />
          <Field label="Loan term" value={years} onChange={setYears} suffix="yrs" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Property tax (annual)" value={taxRate} onChange={setTaxRate} suffix="%" />
          <Field label="Home insurance (annual)" value={insurance} onChange={setInsurance} prefix="$" />
          <Field label="PMI rate (if down < 20%)" value={pmiRate} onChange={setPmiRate} suffix="%" />
          <Field label="HOA (monthly)" value={hoa} onChange={setHoa} prefix="$" />
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <Result big label="Total monthly payment (PITI + PMI + HOA)" value={usd(r.monthlyTotal, 2)} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Result label="Principal & interest" value={usd(r.pmt, 2)} />
              <Result label="Tax + insurance / mo" value={usd(r.taxMo + r.insMo, 2)} />
              <Result label={r.needsPmi ? 'PMI / mo (until 78% LTV)' : 'PMI / mo'} value={r.needsPmi ? usd(r.pmiMo, 2) : '$0 (20%+ down)'} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Result label="Total interest (life of loan)" value={usd(r.totalInterest)} />
              <Result label="Total cost of home" value={usd(r.grand + r.down)} />
              <Result label="Payoff date" value={r.payoff.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
            </div>
            {r.pmiEndMonth !== null && (
              <p className="text-sm text-muted-foreground">
                PMI ends in month {r.pmiEndMonth} when the balance drops below 78% of the home price —
                saving {usd(r.pmiMo, 2)}/mo afterward. Total PMI paid: {usd(r.totalPmi)}.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Comparing against a lender quote? Quotes often differ because they include an escrow cushion,
              daily interest to closing, or rolled-in closing costs — none of which are part of the loan
              itself. Match our &quot;Principal &amp; interest&quot; line against theirs first; it&apos;s the
              only apples-to-apples number.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <svg viewBox="0 0 42 42" className="h-36 w-36 shrink-0" role="img" aria-label="Monthly payment breakdown">
              <circle cx="21" cy="21" r="15.9155" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
              {segs.map((s, i) => {
                const pct = (s.v / segTotal) * 100
                const el = (
                  <circle key={s.label} cx="21" cy="21" r="15.9155" fill="none"
                    stroke={DONUT_COLORS[i % DONUT_COLORS.length]} strokeWidth="7"
                    strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset} />
                )
                offset -= pct
                return el
              })}
            </svg>
            <ul className="space-y-1 text-xs">
              {segs.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  {s.label} <span className="text-muted-foreground">{usd(s.v, 0)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Amortization schedule (yearly)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3">Year</th><th className="py-2 pr-3">Principal paid</th>
                  <th className="py-2 pr-3">Interest paid</th><th className="py-2">Remaining balance</th>
                </tr>
              </thead>
              <tbody>
                {shownYears.map((y) => (
                  <tr key={y.year} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium">{y.year}</td>
                    <td className="py-2 pr-3">{usd(y.principal)}</td>
                    <td className="py-2 pr-3">{usd(y.interest)}</td>
                    <td className="py-2">{usd(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {r.yearly.length > 10 && (
            <button onClick={() => setShowAll(!showAll)} className="mt-2 text-sm text-primary hover:underline">
              {showAll ? 'Show less' : `Show all ${r.yearly.length} years`}
            </button>
          )}
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
            <Field label="Monthly contribution (deposited at each month end)" value={monthly} onChange={setMonthly} prefix="$" />
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
    const m = Math.pow(1 + rate / 100, 1 / 12) - 1 // true APY → monthly rate
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
    // Exact month-by-month simulation: the final month pays only the remaining
    // balance plus that month's interest, so we don't overcharge a full payment.
    const m = rate / 100 / 12
    let bal = balance
    let newInterest = 0
    let newMonths = 0
    if (newPmt <= balance * m) {
      newMonths = baseMonths
      newInterest = baseInterest
    } else {
      while (bal > 0.005 && newMonths < baseMonths + 1200) {
        const interest = bal * m
        newInterest += interest
        const pay = Math.min(newPmt, bal + interest)
        bal = bal + interest - pay
        newMonths += 1
      }
    }
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

/* ---------------- Debt Payoff: Snowball vs Avalanche ---------------- */

interface DebtInput { bal: number; rate: number; min: number }

function simulateDebts(debts: DebtInput[], extra: number, mode: 'snowball' | 'avalanche') {
  const ds = debts.filter((d) => d.bal > 0).map((d) => ({ ...d }))
  if (ds.length === 0) return { months: 0, interest: 0, never: false }
  const order = [...ds]
    .sort((a, b) => (mode === 'snowball' ? a.bal - b.bal : b.rate - a.rate))
    .map((d) => ds.indexOf(d))
  const budget = ds.reduce((a, d) => a + d.min, 0) + extra
  let months = 0
  let interest = 0
  while (ds.some((d) => d.bal > 0.005) && months < 1200) {
    months++
    let budgetLeft = budget
    for (const d of ds) {
      if (d.bal <= 0) continue
      const i = (d.bal * d.rate) / 1200
      d.bal += i
      interest += i
    }
    for (const d of ds) {
      if (d.bal <= 0) continue
      const pay = Math.min(d.min, d.bal)
      d.bal -= pay
      budgetLeft -= pay
    }
    for (const idx of order) {
      const d = ds[idx]
      if (d && d.bal > 0.005) {
        const pay = Math.min(budgetLeft, d.bal)
        d.bal -= pay
        budgetLeft -= pay
        break
      }
    }
  }
  return { months, interest, never: months >= 1200 }
}

export function DebtPayoffCalc() {
  const [b1, setB1] = useNumber(7000)
  const [r1, setR1] = useNumber(24.99)
  const [m1, setM1] = useNumber(175)
  const [b2, setB2] = useNumber(1200)
  const [r2, setR2] = useNumber(0)
  const [m2, setM2] = useNumber(40)
  const [b3, setB3] = useNumber(15000)
  const [r3, setR3] = useNumber(6.5)
  const [m3, setM3] = useNumber(350)
  const [extra, setExtra] = useNumber(200)

  const r = useMemo(() => {
    const debts = [
      { bal: b1, rate: r1, min: m1 },
      { bal: b2, rate: r2, min: m2 },
      { bal: b3, rate: r3, min: m3 },
    ]
    const snow = simulateDebts(debts, extra, 'snowball')
    const aval = simulateDebts(debts, extra, 'avalanche')
    const base = simulateDebts(debts, 0, 'avalanche')
    const totalDebt = b1 + b2 + b3
    const totalMins = m1 + m2 + m3
    const winner = aval.interest <= snow.interest ? 'avalanche' : 'snowball'
    const interestDiff = Math.abs(snow.interest - aval.interest)
    const monthDiff = Math.abs(snow.months - aval.months)
    const debtFree = new Date()
    debtFree.setMonth(debtFree.getMonth() + (winner === 'avalanche' ? aval.months : snow.months))
    // negative-amortization guard: any debt whose minimum can't cover interest
    const negAm = debts.some((d) => d.bal > 0 && d.min <= (d.bal * d.rate) / 1200)
    return { snow, aval, base, totalDebt, totalMins, winner, interestDiff, monthDiff, debtFree, negAm }
  }, [b1, r1, m1, b2, r2, m2, b3, r3, m3, extra])

  const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          {[
            { name: 'Debt 1 — e.g. credit card', b: b1, setB: setB1, rt: r1, setRt: setR1, mn: m1, setMn: setM1 },
            { name: 'Debt 2 — e.g. medical / store card', b: b2, setB: setB2, rt: r2, setRt: setR2, mn: m2, setMn: setM2 },
            { name: 'Debt 3 — e.g. car / personal loan', b: b3, setB: setB3, rt: r3, setRt: setR3, mn: m3, setMn: setM3 },
          ].map((d) => (
            <div key={d.name} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
              <p className="text-sm font-medium sm:col-span-3">{d.name}</p>
              <Field label="Balance" value={d.b} onChange={d.setB} prefix="$" />
              <Field label="Interest rate" value={d.rt} onChange={d.setRt} suffix="%" />
              <Field label="Minimum payment" value={d.mn} onChange={d.setMn} prefix="$" suffix="/mo" />
            </div>
          ))}
          <div className="max-w-xs">
            <Field label="Extra you can pay monthly (beyond minimums)" value={extra} onChange={setExtra} prefix="$" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label={r.winner === 'avalanche' ? 'Avalanche wins on math' : 'Snowball wins on math'} value={`${usd(r.interestDiff)} less interest`} />
          <Result label="Debt-free date (winner)" value={fmtDate(r.debtFree)} />
          <Result label="Avalanche: months / interest" value={r.aval.never ? 'Never (see note)' : `${r.aval.months} mo / ${usd(r.aval.interest)}`} />
          <Result label="Snowball: months / interest" value={r.snow.never ? 'Never (see note)' : `${r.snow.months} mo / ${usd(r.snow.interest)}`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">Total debt / monthly minimums</td><td className="p-2 text-right">{usd(r.totalDebt)} / {usd(r.totalMins, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Minimums only — time & interest</td><td className="p-2 text-right">{r.base.never ? 'Never (minimums don\'t cover interest)' : `${r.base.months} months, ${usd(r.base.interest)} interest`}</td></tr>
              <tr className="border-t font-medium"><td className="p-2">What your extra {usd(extra, 0)}/mo saves</td><td className="p-2 text-right">{r.base.never || r.aval.never ? '—' : `${usd(r.base.interest - r.aval.interest)} and ${r.base.months - r.aval.months} months`}</td></tr>
              <tr className="border-t"><td className="p-2">Avalanche vs snowball gap</td><td className="p-2 text-right">{usd(r.interestDiff)} and {r.monthDiff} month{r.monthDiff === 1 ? '' : 's'}</td></tr>
            </tbody>
          </table>
        </div>
        {r.negAm && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            One of your minimums does not cover that debt's monthly interest — the balance grows
            even when you pay on time. Raise that minimum first, before any strategy debate.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Avalanche (highest rate first) always wins on math — often by less than people expect.
          Snowball (smallest balance first) wins on behavior: the early zero balance keeps people
          paying. When the gap is a few hundred dollars, take the strategy you will actually finish.
          Simulation pays minimums on everything, then directs your extra plus freed-up minimums to
          the current target each month.
        </p>
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
  'debt-payoff-calculator': DebtPayoffCalc,
}
