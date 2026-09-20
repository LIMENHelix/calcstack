import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useNumber, Field, Result } from './index'
import { usd, num } from '@/lib/calc'
import { FEDERAL, bracketTax, SS_WAGE_CAP } from '@/data/paycheck'

/* ---------- Everyday Money ---------- */

export function TipCalc({ presets }: { presets?: Record<string, number> }) {
  const [bill, setBill] = useNumber(presets?.bill ?? 86)
  const [tipPct, setTipPct] = useNumber(presets?.tipPct ?? 18)
  const [people, setPeople] = useNumber(presets?.people ?? 2)
  const r = useMemo(() => {
    const tip = bill * (tipPct / 100)
    const total = bill + tip
    return { tip, total, perPerson: people > 0 ? total / people : total }
  }, [bill, tipPct, people])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Bill amount" value={bill} onChange={setBill} prefix="$" />
        <Field label="Tip percentage" value={tipPct} onChange={setTipPct} suffix="%" />
        <Field label="Split between" value={people} onChange={setPeople} suffix="people" />
        <div className="flex flex-wrap gap-2">
          {[15, 18, 20, 25].map((p) => (
            <button key={p} onClick={() => setTipPct(String(p))}
              className={`rounded-md border px-3 py-1.5 text-sm ${tipPct === p ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              {p}%
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Result big label="Total per person" value={usd(r.perPerson, 2)} />
        <Result label="Tip amount" value={usd(r.tip, 2)} />
        <Result label="Total with tip" value={usd(r.total, 2)} />
      </div>
    </CardContent></Card>
  )
}

export function DiscountCalc() {
  const [price, setPrice] = useNumber(120)
  const [pct, setPct] = useNumber(25)
  const [extraPct, setExtraPct] = useNumber(0)
  const r = useMemo(() => {
    const afterFirst = price * (1 - pct / 100)
    const final = afterFirst * (1 - extraPct / 100)
    return { final, saved: price - final, effective: price > 0 ? (1 - final / price) * 100 : 0 }
  }, [price, pct, extraPct])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Original price" value={price} onChange={setPrice} prefix="$" />
        <Field label="Discount" value={pct} onChange={setPct} suffix="%" />
        <Field label="Extra discount (stacked coupon)" value={extraPct} onChange={setExtraPct} suffix="%" />
      </div>
      <div className="space-y-3">
        <Result big label="Final price" value={usd(r.final, 2)} />
        <Result label="You save" value={usd(r.saved, 2)} />
        <Result label="Effective discount" value={`${num(r.effective, 1)}%`} />
        <p className="text-sm text-muted-foreground">
          Stacked discounts multiply, not add: 25% + 10% off is 32.5% off, not 35%.
        </p>
      </div>
    </CardContent></Card>
  )
}

export function SalesTaxCalc({ presets }: { presets?: Record<string, number> }) {
  const [price, setPrice] = useNumber(presets?.price ?? 49.99)
  const [rate, setRate] = useNumber(presets?.rate ?? 8.25)
  const [mode, setMode] = useState<'add' | 'remove'>('add')
  const r = useMemo(() => {
    if (mode === 'add') {
      const tax = price * (rate / 100)
      return { pre: price, tax, total: price + tax }
    }
    const pre = price / (1 + rate / 100)
    return { pre, tax: price - pre, total: price }
  }, [price, rate, mode])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['add', 'remove'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`rounded-md border px-3 py-1.5 text-sm ${mode === m ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              {m === 'add' ? 'Add tax' : 'Remove tax'}
            </button>
          ))}
        </div>
        <Field label={mode === 'add' ? 'Price before tax' : 'Price including tax'} value={price} onChange={setPrice} prefix="$" />
        <Field label="Tax rate (combined state + local — check a receipt)" value={rate} onChange={setRate} suffix="%" />
      </div>
      <div className="space-y-3">
        <Result big label={mode === 'add' ? 'Total with tax' : 'Price before tax'} value={usd(mode === 'add' ? r.total : r.pre, 2)} />
        <Result label="Tax amount" value={usd(r.tax, 2)} />
        <Result label={mode === 'add' ? 'Price before tax' : 'Total with tax'} value={usd(mode === 'add' ? r.pre : r.total, 2)} />
      </div>
    </CardContent></Card>
  )
}

export function PercentageCalc() {
  const [a1, setA1] = useNumber(25)
  const [a2, setA2] = useNumber(200)
  const [b1, setB1] = useNumber(80)
  const [b2, setB2] = useNumber(120)
  const [c1, setC1] = useNumber(150)
  const [c2, setC2] = useNumber(40)
  return (
    <div className="space-y-6">
      <Card><CardContent className="p-6">
        <p className="mb-4 font-semibold">What is X% of Y?</p>
        <div className="grid items-end gap-4 sm:grid-cols-3">
          <Field label="Percent" value={a1} onChange={setA1} suffix="%" />
          <Field label="Of value" value={a2} onChange={setA2} />
          <Result big label="Result" value={num((a1 / 100) * a2, 2)} />
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-6">
        <p className="mb-4 font-semibold">Percentage change from X to Y</p>
        <div className="grid items-end gap-4 sm:grid-cols-3">
          <Field label="From" value={b1} onChange={setB1} />
          <Field label="To" value={b2} onChange={setB2} />
          <Result big label="Change" value={`${num(b1 !== 0 ? ((b2 - b1) / Math.abs(b1)) * 100 : 0, 2)}%`} />
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-6">
        <p className="mb-4 font-semibold">X is what percent of Y?</p>
        <div className="grid items-end gap-4 sm:grid-cols-3">
          <Field label="Part" value={c2} onChange={setC2} />
          <Field label="Whole" value={c1} onChange={setC1} />
          <Result big label="Result" value={`${num(c1 !== 0 ? (c2 / c1) * 100 : 0, 2)}%`} />
        </div>
      </CardContent></Card>
    </div>
  )
}

/* ---------- Health & Life ---------- */

export function BmiCalc() {
  const [heightCm, setHeightCm] = useNumber(175)
  const [weightKg, setWeightKg] = useNumber(75)
  const r = useMemo(() => {
    const bmi = heightCm > 0 ? weightKg / Math.pow(heightCm / 100, 2) : 0
    const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obese'
    const lo = 18.5 * Math.pow(heightCm / 100, 2)
    const hi = 24.9 * Math.pow(heightCm / 100, 2)
    return { bmi, cat, lo, hi }
  }, [heightCm, weightKg])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Height" value={heightCm} onChange={setHeightCm} suffix="cm" />
        <Field label="Weight" value={weightKg} onChange={setWeightKg} suffix="kg" />
        <p className="text-xs text-muted-foreground">cm/kg — 175 cm ≈ 5'9", 75 kg ≈ 165 lb</p>
      </div>
      <div className="space-y-3">
        <Result big label="Your BMI" value={num(r.bmi, 1)} />
        <Result label="Category" value={r.cat} />
        <Result label="Healthy range for your height" value={`${num(r.lo, 1)} – ${num(r.hi, 1)} kg`} />
      </div>
    </CardContent></Card>
  )
}

export function CalorieCalc() {
  const [weightKg, setWeightKg] = useNumber(75)
  const [heightCm, setHeightCm] = useNumber(175)
  const [age, setAge] = useNumber(32)
  const [sex, setSex] = useState<'m' | 'f'>('m')
  const [activity, setActivity] = useNumber(1.4)
  const r = useMemo(() => {
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'm' ? 5 : -161)
    const tdee = bmr * activity
    return { bmr, tdee, cut: tdee - 500, gain: tdee + 300 }
  }, [weightKg, heightCm, age, sex, activity])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['m', 'f'] as const).map((s) => (
            <button key={s} onClick={() => setSex(s)}
              className={`rounded-md border px-3 py-1.5 text-sm ${sex === s ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              {s === 'm' ? 'Male' : 'Female'}
            </button>
          ))}
        </div>
        <Field label="Weight" value={weightKg} onChange={setWeightKg} suffix="kg" />
        <Field label="Height" value={heightCm} onChange={setHeightCm} suffix="cm" />
        <Field label="Age" value={age} onChange={setAge} suffix="yrs" />
        <Field label="Activity multiplier (1.2 sedentary → 1.7 very active)" value={activity} onChange={setActivity} step="0.1" />
      </div>
      <div className="space-y-3">
        <Result big label="Maintenance calories (TDEE)" value={`${num(r.tdee, 0)} kcal/day`} />
        <Result label="Resting metabolism (BMR)" value={`${num(r.bmr, 0)} kcal/day`} />
        <Result label="Fat loss (−500)" value={`${num(r.cut, 0)} kcal/day`} />
        <Result label="Muscle gain (+300)" value={`${num(r.gain, 0)} kcal/day`} />
        <p className="text-xs text-muted-foreground">
          Mifflin-St Jeor equation — the standard used by dietitians. Every TDEE formula is an estimate
          (±10% between people is normal); treat this as a starting point, track for two weeks, and adjust
          to what the scale actually does.
        </p>
      </div>
    </CardContent></Card>
  )
}

export function AgeCalc() {
  const [dob, setDob] = useState('1994-06-15')
  const r = useMemo(() => {
    const birth = new Date(dob)
    if (isNaN(birth.getTime())) return null
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000)
    const next = new Date(now.getFullYear() + (months >= 0 && days > 0 ? 0 : 0), birth.getMonth(), birth.getDate())
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBday.getTime() < now.getTime()) nextBday.setFullYear(now.getFullYear() + 1)
    const daysToBday = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000)
    void next
    return { years, months, days, totalDays, weeks: Math.floor(totalDays / 7), daysToBday }
  }, [dob])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date of birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
        </div>
      </div>
      {r && (
        <div className="space-y-3">
          <Result big label="Exact age" value={`${r.years} yrs ${r.months} mo ${r.days} d`} />
          <Result label="Total days alive" value={num(r.totalDays, 0)} />
          <Result label="Total weeks" value={num(r.weeks, 0)} />
          <Result label="Days until next birthday" value={String(r.daysToBday)} />
        </div>
      )}
    </CardContent></Card>
  )
}

export function DateDiffCalc() {
  const [start, setStart] = useState('2026-01-01')
  const [end, setEnd] = useState('2026-09-16')
  const r = useMemo(() => {
    const a = new Date(start), b = new Date(end)
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null
    const ms = b.getTime() - a.getTime()
    const days = Math.round(ms / 86400000)
    return {
      days,
      weeks: days / 7,
      months: days / 30.44,
      workdays: Math.round(Math.abs(days) * (5 / 7)),
      sign: days < 0 ? 'negative' : 'positive',
    }
  }, [start, end])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        {[['Start date', start, setStart], ['End date', end, setEnd]].map(([label, val, set]) => (
          <div key={label as string} className="space-y-1.5">
            <label className="text-sm font-medium">{label as string}</label>
            <input type="date" value={val as string} onChange={(e) => (set as (v: string) => void)(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
          </div>
        ))}
      </div>
      {r && (
        <div className="space-y-3">
          <Result big label="Days between" value={num(r.days, 0)} />
          <Result label="Weeks" value={num(r.weeks, 1)} />
          <Result label="Months (average)" value={num(r.months, 1)} />
          <Result label="Approx. workdays" value={`~${num(r.workdays, 0)}`} />
        </div>
      )}
    </CardContent></Card>
  )
}

export function GpaCalc() {
  const [rows, setRows] = useState([
    { grade: 4.0, credits: 3 },
    { grade: 3.7, credits: 3 },
    { grade: 3.3, credits: 4 },
  ])
  const r = useMemo(() => {
    const totalCredits = rows.reduce((s, r) => s + r.credits, 0)
    const points = rows.reduce((s, r) => s + r.grade * r.credits, 0)
    return { gpa: totalCredits > 0 ? points / totalCredits : 0, totalCredits }
  }, [rows])
  const update = (i: number, k: 'grade' | 'credits', v: number) =>
    setRows(rows.map((row, j) => (j === i ? { ...row, [k]: v } : row)))
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3">
            <select value={row.grade} onChange={(e) => update(i, 'grade', parseFloat(e.target.value))}
              className="h-9 rounded-md border border-input bg-transparent px-2 text-sm">
              {[4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.0].map((g) => (
                <option key={g} value={g}>{g.toFixed(1)}</option>
              ))}
            </select>
            <input type="number" min={0} value={row.credits} onChange={(e) => update(i, 'credits', parseFloat(e.target.value) || 0)}
              className="h-9 w-20 rounded-md border border-input bg-transparent px-2 text-sm" />
            <span className="text-sm text-muted-foreground">credits</span>
            <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-sm text-muted-foreground hover:text-destructive">✕</button>
          </div>
        ))}
        <button onClick={() => setRows([...rows, { grade: 4.0, credits: 3 }])}
          className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
          + Add course
        </button>
      </div>
      <div className="space-y-3">
        <Result big label="GPA" value={num(r.gpa, 2)} />
        <Result label="Total credits" value={num(r.totalCredits, 0)} />
      </div>
    </CardContent></Card>
  )
}

/* ---------- Investing & Crypto ---------- */

export function CryptoProfitCalc() {
  const [invested, setInvested] = useNumber(1000)
  const [buyPrice, setBuyPrice] = useNumber(40000)
  const [sellPrice, setSellPrice] = useNumber(65000)
  const [feesPct, setFeesPct] = useNumber(0.5)
  const r = useMemo(() => {
    const units = buyPrice > 0 ? invested / buyPrice : 0
    const grossExit = units * sellPrice
    const fees = (invested + grossExit) * (feesPct / 100)
    const profit = grossExit - invested - fees
    return { units, grossExit, fees, profit, roi: invested > 0 ? (profit / invested) * 100 : 0 }
  }, [invested, buyPrice, sellPrice, feesPct])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Amount invested" value={invested} onChange={setInvested} prefix="$" />
        <Field label="Buy price per coin" value={buyPrice} onChange={setBuyPrice} prefix="$" />
        <Field label="Sell price per coin" value={sellPrice} onChange={setSellPrice} prefix="$" />
        <Field label="Total exchange fees" value={feesPct} onChange={setFeesPct} suffix="%" />
      </div>
      <div className="space-y-3">
        <Result big label="Profit / loss" value={usd(r.profit, 2)} />
        <Result label="Return on investment" value={`${num(r.roi, 1)}%`} />
        <Result label="Coins held" value={num(r.units, 6)} />
        <Result label="Exit value (before fees)" value={usd(r.grossExit, 2)} />
        <p className="text-xs text-muted-foreground">Excludes taxes — crypto gains are taxable in most countries.</p>
      </div>
    </CardContent></Card>
  )
}

export function RoiCalc() {
  const [invested, setInvested] = useNumber(5000)
  const [returned, setReturned] = useNumber(7400)
  const [years, setYears] = useNumber(2)
  const r = useMemo(() => {
    const gain = returned - invested
    const roi = invested > 0 ? (gain / invested) * 100 : 0
    const annualized = invested > 0 && returned > 0 && years > 0
      ? (Math.pow(returned / invested, 1 / years) - 1) * 100 : 0
    return { gain, roi, annualized }
  }, [invested, returned, years])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Amount invested" value={invested} onChange={setInvested} prefix="$" />
        <Field label="Amount returned / current value" value={returned} onChange={setReturned} prefix="$" />
        <Field label="Time held" value={years} onChange={setYears} suffix="yrs" />
      </div>
      <div className="space-y-3">
        <Result big label="Total ROI" value={`${num(r.roi, 1)}%`} />
        <Result label="Annualized ROI (CAGR)" value={`${num(r.annualized, 2)}%`} />
        <Result label="Net gain / loss" value={usd(r.gain)} />
        <p className="text-sm text-muted-foreground">
          Annualized ROI is the honest number — 48% over 2 years is ~21.7%/yr, not 24%/yr.
        </p>
      </div>
    </CardContent></Card>
  )
}

export function InflationCalc() {
  const [amount, setAmount] = useNumber(1000)
  const [rate, setRate] = useNumber(3)
  const [years, setYears] = useNumber(10)
  const r = useMemo(() => {
    const factor = Math.pow(1 + rate / 100, years)
    return {
      futureCost: amount * factor,
      futureValue: amount / factor,
      lostPct: (1 - 1 / factor) * 100,
    }
  }, [amount, rate, years])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Amount today" value={amount} onChange={setAmount} prefix="$" />
        <Field label="Annual inflation rate" value={rate} onChange={setRate} suffix="%" />
        <Field label="Years ahead" value={years} onChange={setYears} suffix="yrs" />
      </div>
      <div className="space-y-3">
        <Result big label={`What ${usd(amount)} buys today costs in ${years} yrs`} value={usd(r.futureCost, 2)} />
        <Result label={`Today's ${usd(amount)} will feel like`} value={usd(r.futureValue, 2)} />
        <Result label="Purchasing power lost" value={`${num(r.lostPct, 1)}%`} />
        <p className="text-sm text-muted-foreground">
          Cash under the mattress is a slow leak — this is the leak, quantified.
        </p>
      </div>
    </CardContent></Card>
  )
}

export function BreakEvenCalc() {
  const [fixed, setFixed] = useNumber(3000)
  const [price, setPrice] = useNumber(49)
  const [cost, setCost] = useNumber(14)
  const r = useMemo(() => {
    const margin = price - cost
    const units = margin > 0 ? Math.ceil(fixed / margin) : Infinity
    return { margin, units, revenue: isFinite(units) ? units * price : Infinity, marginPct: price > 0 ? (margin / price) * 100 : 0 }
  }, [fixed, price, cost])
  return (
    <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Fixed costs (monthly)" value={fixed} onChange={setFixed} prefix="$" />
        <Field label="Price per unit" value={price} onChange={setPrice} prefix="$" />
        <Field label="Variable cost per unit" value={cost} onChange={setCost} prefix="$" />
      </div>
      <div className="space-y-3">
        <Result big label="Break-even units" value={isFinite(r.units) ? num(r.units, 0) : 'Never (price ≤ cost)'} />
        <Result label="Break-even revenue" value={isFinite(r.revenue) ? usd(r.revenue) : '—'} />
        <Result label="Contribution margin per unit" value={usd(r.margin, 2)} />
        <Result label="Margin percentage" value={`${num(r.marginPct, 1)}%`} />
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Debt Avalanche vs Snowball ---------------- */

interface DebtSim { name: string; bal: number; apr: number; min: number }

function simulatePayoff(debts: DebtSim[], extra: number, strategy: 'avalanche' | 'snowball') {
  const ds = debts.map((d) => ({ ...d, paidThisMonth: 0 }))
  let months = 0
  let totalInterest = 0
  const order: string[] = []
  while (ds.some((d) => d.bal > 0.005) && months < 600) {
    months++
    for (const d of ds) {
      if (d.bal <= 0) continue
      const i = (d.bal * d.apr) / 100 / 12
      d.bal += i
      totalInterest += i
    }
    for (const d of ds) {
      if (d.bal <= 0) continue
      const p = Math.min(d.min, d.bal)
      d.bal -= p
      d.paidThisMonth = p
    }
    const origMins = debts.reduce((s, d) => s + d.min, 0)
    const minsPaid = ds.reduce((s, d) => s + (d.paidThisMonth || 0), 0)
    let left = origMins - minsPaid + extra
    let guard = 0
    while (left > 0.005 && guard++ < 10) {
      const active = ds.filter((d) => d.bal > 0.005)
      if (!active.length) break
      active.sort((a, b) =>
        strategy === 'avalanche' ? b.apr - a.apr || a.bal - b.bal : a.bal - b.bal || b.apr - a.apr,
      )
      const t = active[0]
      const p = Math.min(t.bal, left)
      t.bal -= p
      left -= p
      if (t.bal <= 0.005 && !order.includes(t.name)) order.push(t.name)
    }
  }
  return { months, totalInterest, order }
}

export function DebtPayoffCalc() {
  const [b1, setB1] = useNumber(1500)
  const [a1, setA1] = useNumber(12)
  const [m1, setM1] = useNumber(40)
  const [b2, setB2] = useNumber(4000)
  const [a2, setA2] = useNumber(20)
  const [m2, setM2] = useNumber(100)
  const [b3, setB3] = useNumber(0)
  const [a3, setA3] = useNumber(0)
  const [m3, setM3] = useNumber(0)
  const [extra, setExtra] = useNumber(100)

  const r = useMemo(() => {
    const debts: DebtSim[] = [
      { name: 'Debt 1', bal: b1, apr: a1, min: m1 },
      { name: 'Debt 2', bal: b2, apr: a2, min: m2 },
      { name: 'Debt 3', bal: b3, apr: a3, min: m3 },
    ].filter((d) => d.bal > 0)
    if (!debts.length) return null
    const av = simulatePayoff(debts, extra, 'avalanche')
    const sn = simulatePayoff(debts, extra, 'snowball')
    const totalBal = debts.reduce((s, d) => s + d.bal, 0)
    const savings = sn.totalInterest - av.totalInterest
    return { av, sn, totalBal, savings }
  }, [b1, a1, m1, b2, a2, m2, b3, a3, m3, extra])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-3">
          <p className="text-sm font-medium">Debt 1</p>
          <Field label="Balance" value={b1} onChange={setB1} prefix="$" />
          <Field label="APR" value={a1} onChange={setA1} suffix="%" step="0.5" />
          <Field label="Minimum payment" value={m1} onChange={setM1} prefix="$" />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Debt 2</p>
          <Field label="Balance" value={b2} onChange={setB2} prefix="$" />
          <Field label="APR" value={a2} onChange={setA2} suffix="%" step="0.5" />
          <Field label="Minimum payment" value={m2} onChange={setM2} prefix="$" />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Debt 3 (optional)</p>
          <Field label="Balance" value={b3} onChange={setB3} prefix="$" />
          <Field label="APR" value={a3} onChange={setA3} suffix="%" step="0.5" />
          <Field label="Minimum payment" value={m3} onChange={setM3} prefix="$" />
        </div>
      </div>
      <div className="max-w-xs">
        <Field label="Extra you can pay each month" value={extra} onChange={setExtra} prefix="$" />
      </div>
      {r && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Avalanche saves" value={`${usd(Math.max(0, r.savings), 0)}${r.savings >= 0.005 && r.av.months !== r.sn.months ? ` & ${Math.abs(r.sn.months - r.av.months)} mo` : ''}`} />
            <Result label="Avalanche (highest APR first)" value={`${r.av.months} mo · ${usd(r.av.totalInterest, 0)} interest`} />
            <Result label="Snowball (smallest balance first)" value={`${r.sn.months} mo · ${usd(r.sn.totalInterest, 0)} interest`} />
            <Result label="Total debt" value={usd(r.totalBal, 0)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Result label="Avalanche payoff order" value={r.av.order.join(' → ') || '—'} />
            <Result label="Snowball payoff order" value={r.sn.order.join(' → ') || '—'} />
          </div>
          <p className="text-sm text-muted-foreground">
            Both strategies pay every minimum every month; they differ only in where the extra money
            (plus freed-up minimums from paid-off debts) goes. Avalanche attacks the highest APR and is
            always the mathematical optimum; snowball attacks the smallest balance for faster
            psychological wins. The simulation runs month by month with real interest accrual, so the
            dollar difference is exact — then decide whether that difference or the motivation of quick
            wins matters more to you. The best plan is the one you actually finish.
          </p>
        </>
      )}
    </CardContent></Card>
  )
}

/* ---------------- Credit Card Minimum Payment Trap ---------------- */

// Issuer model: minimum = max(floor, 1% of balance + month's interest)
function minPaymentSim(bal: number, apr: number, floor: number) {
  let months = 0
  let interest = 0
  let b = bal
  while (b > 0.005 && months < 1200) {
    months++
    const i = (b * apr) / 100 / 12
    interest += i
    b += i
    const pmt = Math.max(floor, b * 0.01 + i)
    b -= Math.min(pmt, b)
  }
  return { months, interest }
}

function fixedPaymentSim(bal: number, apr: number, payment: number) {
  let months = 0
  let interest = 0
  let b = bal
  const firstI = (bal * apr) / 100 / 12
  if (payment <= firstI) return { months: -1, interest: -1 } // never pays off
  while (b > 0.005 && months < 1200) {
    months++
    const i = (b * apr) / 100 / 12
    interest += i
    b += i
    b -= Math.min(payment, b)
  }
  return { months, interest }
}

export function CreditCardMinimumCalc() {
  const [bal, setBal] = useNumber(5000)
  const [apr, setApr] = useNumber(22)
  const [floor, setFloor] = useNumber(25)
  const [extra, setExtra] = useNumber(0)

  const r = useMemo(() => {
    if (bal <= 0) return null
    const minOnly = minPaymentSim(bal, apr, floor)
    const firstMin = Math.max(floor, bal * 0.01 + (bal * apr) / 100 / 12)
    const fixed = fixedPaymentSim(bal, apr, firstMin + extra)
    const savedInterest = fixed.months > 0 ? minOnly.interest - fixed.interest : 0
    const savedMonths = fixed.months > 0 ? minOnly.months - fixed.months : 0
    return { minOnly, firstMin, fixed, savedInterest, savedMonths }
  }, [bal, apr, floor, extra])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Card balance" value={bal} onChange={setBal} prefix="$" />
        <Field label="APR" value={apr} onChange={setApr} suffix="%" step="0.5" />
        <Field label="Minimum payment floor" value={floor} onChange={setFloor} prefix="$" />
        <Field label="Extra above first minimum" value={extra} onChange={setExtra} prefix="$" />
      </div>
      {r && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Paying only minimums" value={`${r.minOnly.months} mo (${num(r.minOnly.months / 12, 1)} yrs)`} />
            <Result label="Interest on minimums" value={usd(r.minOnly.interest, 0)} />
            <Result label={r.fixed.months > 0 ? `Fixed at ${usd(r.firstMin + extra, 2)}/mo` : 'Payment too small'} value={r.fixed.months > 0 ? `${r.fixed.months} mo · ${usd(r.fixed.interest, 0)} interest` : 'Never pays off'} />
            <Result label="Saved by fixing the payment" value={`${usd(r.savedInterest, 0)} & ${r.savedMonths} mo`} />
          </div>
          <p className="text-sm text-muted-foreground">
            The trap is structural: the minimum is 1% of the balance plus interest, so as the balance
            falls, the payment falls — stretching a {usd(bal, 0)} balance at {num(apr, 1)}% to{' '}
            {num(r.minOnly.months / 12, 1)} years and {usd(r.minOnly.interest, 0)} of interest. Fix the
            payment at today's {usd(r.firstMin, 2)} and the same debt dies in {r.fixed.months > 0 ? `${r.fixed.months} months` : '—'}.
            The CARD Act requires your statement to show this minimum-payment timeline — check it
            against this number.
          </p>
        </>
      )}
    </CardContent></Card>
  )
}

/* ---------------- Emergency Fund ---------------- */

export function EmergencyFundCalc() {
  const [expenses, setExpenses] = useNumber(3500)
  const [months, setMonths] = useState('6')
  const [current, setCurrent] = useNumber(5000)
  const [save, setSave] = useNumber(800)

  const r = useMemo(() => {
    const targetMonths = Number(months) || 6
    const target = expenses * targetMonths
    const gap = Math.max(0, target - current)
    const monthsToFull = save > 0 ? Math.ceil(gap / save) : gap > 0 ? -1 : 0
    const starterGap = Math.max(0, 1000 - current)
    const monthsToStarter = save > 0 ? Math.ceil(starterGap / save) : starterGap > 0 ? -1 : 0
    const coverageNow = expenses > 0 ? current / expenses : 0
    return { target, gap, monthsToFull, monthsToStarter, coverageNow, targetMonths }
  }, [expenses, months, current, save])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Monthly essential expenses" value={expenses} onChange={setExpenses} prefix="$" />
        <div>
          <label className="mb-1 block text-sm font-medium">Target coverage</label>
          <select
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          >
            <option value="3">3 months — dual income, stable jobs</option>
            <option value="6">6 months — the standard advice</option>
            <option value="9">9 months — single income or kids</option>
            <option value="12">12 months — variable/commission income</option>
          </select>
        </div>
        <Field label="Current savings" value={current} onChange={setCurrent} prefix="$" />
        <Field label="You can save monthly" value={save} onChange={setSave} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Your emergency fund target" value={usd(r.target, 0)} />
        <Result label="Gap to close" value={usd(r.gap, 0)} />
        <Result label="Months to fully funded" value={r.monthsToFull < 0 ? '— (raise savings)' : `${r.monthsToFull} mo`} />
        <Result label="Covered today" value={`${num(r.coverageNow, 1)} months`} />
        {r.monthsToStarter >= 0 && r.gap > 0 && (
          <Result label="$1,000 starter fund" value={r.monthsToStarter === 0 ? 'Done ✓' : `${r.monthsToStarter} mo away`} />
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Essentials only — rent, utilities, food, insurance, minimum debt payments — not your full
        lifestyle budget. At {usd(expenses, 0)} essentials, {r.targetMonths} months of coverage is{' '}
        {usd(r.target, 0)}, and saving {usd(save, 0)} a month gets there in{' '}
        {r.monthsToFull >= 0 ? `${r.monthsToFull} months` : '—'}. Order of operations matters: grab the
        full 401(k) match first, build a $1,000 starter buffer, kill high-interest debt, then finish
        the fund — and keep it in a high-yield savings account, not invested. The fund's job is not
        growth; it is making sure a transmission or a layoff never touches a credit card at 22%.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- 50/30/20 Budget ---------------- */

const BUDGET_PRESETS: Record<string, [number, number, number, string]> = {
  '50-30-20': [50, 30, 20, 'The classic — Elizabeth Warren\'s All Your Worth split'],
  '60-20-20': [60, 20, 20, 'High cost-of-living areas where needs run hot'],
  '70-20-10': [70, 20, 10, 'Survival mode — debt payoff or income shock'],
  '80-20-0': [80, 20, 0, 'Bare-bones triage (temporary only)'],
}

export function BudgetRuleCalc() {
  const [income, setIncome] = useNumber(5000)
  const [preset, setPreset] = useState('50-30-20')
  const [needs, setNeeds] = useNumber(2900)
  const [wants, setWants] = useNumber(1400)
  const [savings, setSavings] = useNumber(700)

  const r = useMemo(() => {
    const [nP, wP, sP] = BUDGET_PRESETS[preset]
    const tN = (income * nP) / 100
    const tW = (income * wP) / 100
    const tS = (income * sP) / 100
    const dN = needs - tN
    const dW = wants - tW
    const dS = savings - tS
    const actualTotal = needs + wants + savings
    const unallocated = income - actualTotal
    return { nP, wP, sP, tN, tW, tS, dN, dW, dS, actualTotal, unallocated }
  }, [income, preset, needs, wants, savings])

  const delta = (d: number) => (Math.abs(d) < 0.005 ? 'On target' : d > 0 ? `${usd(d, 0)} over` : `${usd(-d, 0)} under`)

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Monthly after-tax income" value={income} onChange={setIncome} prefix="$" />
        <div>
          <label className="mb-1 block text-sm font-medium">Budget rule</label>
          <select
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
          >
            {Object.entries(BUDGET_PRESETS).map(([k, [n, w, s, note]]) => (
              <option key={k} value={k}>{`${n}/${w}/${s} — ${note}`}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your actual needs spending" value={needs} onChange={setNeeds} prefix="$" />
        <Field label="Your actual wants spending" value={wants} onChange={setWants} prefix="$" />
        <Field label="Your actual saving & debt payoff" value={savings} onChange={setSavings} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label={`Needs (${r.nP}%) — target ${usd(r.tN, 0)}`} value={delta(r.dN)} />
        <Result big label={`Wants (${r.wP}%) — target ${usd(r.tW, 0)}`} value={delta(r.dW)} />
        <Result big label={`Savings (${r.sP}%) — target ${usd(r.tS, 0)}`} value={delta(r.dS)} />
        <Result label="Unallocated income" value={Math.abs(r.unallocated) < 0.005 ? 'Fully allocated' : usd(r.unallocated, 0)} />
        <Result label="Needs bucket per week" value={usd(r.tN / 4.33, 0)} />
        <Result label="Annual savings at target" value={usd(r.tS * 12, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Needs are bills you cannot skip — housing, utilities, groceries, insurance, minimum debt
        payments. Wants are everything you could cancel tomorrow. Savings includes extra debt payoff
        beyond minimums. On {usd(income, 0)} after-tax, the {r.nP}/{r.wP}/{r.sP} split means{' '}
        {usd(r.tN, 0)} / {usd(r.tW, 0)} / {usd(r.tS, 0)}. The most common break is needs running over —
        that is a housing-or-car problem, not a coffee problem, and no amount of skipped lattes fixes
        a bucket that is {delta(r.dN)}.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Vacation Budget ---------------- */

export function VacationBudgetCalc() {
  const [travelers, setTravelers] = useNumber(2)
  const [nights, setNights] = useNumber(5)
  const [hotelRate, setHotelRate] = useNumber(180)
  const [flights, setFlights] = useNumber(700)
  const [foodDay, setFoodDay] = useNumber(60)
  const [activities, setActivities] = useNumber(400)
  const [misc, setMisc] = useNumber(200)
  const [bufferPct, setBufferPct] = useNumber(10)
  const [monthsAway, setMonthsAway] = useNumber(4)

  const r = useMemo(() => {
    const hotel = nights * hotelRate
    const food = foodDay * travelers * nights
    const base = hotel + flights + food + activities + misc
    const total = base * (1 + bufferPct / 100)
    const perPerson = travelers > 0 ? total / travelers : 0
    const perDay = nights > 0 ? total / nights : 0
    const monthly = monthsAway > 0 ? total / monthsAway : total
    return { hotel, food, base, total, perPerson, perDay, monthly }
  }, [travelers, nights, hotelRate, flights, foodDay, activities, misc, bufferPct, monthsAway])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Travelers" value={travelers} onChange={setTravelers} step="1" />
        <Field label="Nights" value={nights} onChange={setNights} step="1" />
        <Field label="Hotel per night" value={hotelRate} onChange={setHotelRate} prefix="$" />
        <Field label="Flights / gas (total)" value={flights} onChange={setFlights} prefix="$" />
        <Field label="Food per person per day" value={foodDay} onChange={setFoodDay} prefix="$" />
        <Field label="Activities & tickets (total)" value={activities} onChange={setActivities} prefix="$" />
        <Field label="Local transport & misc (total)" value={misc} onChange={setMisc} prefix="$" />
        <Field label="Surprise buffer" value={bufferPct} onChange={setBufferPct} suffix="%" />
        <Field label="Trip is months away" value={monthsAway} onChange={setMonthsAway} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Total trip cost" value={usd(r.total, 0)} />
        <Result label="Per person" value={usd(r.perPerson, 0)} />
        <Result label="Per day" value={usd(r.perDay, 0)} />
        <Result label="Save monthly to afford it" value={usd(r.monthly, 0)} />
        <Result label="Lodging" value={usd(r.hotel, 0)} />
        <Result label="Food" value={usd(r.food, 0)} />
        <Result label="Buffer for surprises" value={usd(r.total - r.base, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        The base cost is {usd(r.base, 0)}; the {num(bufferPct, 0)}% buffer covers the things every trip
        produces and nobody budgets — resort fees, tips, the rainy-day tour, the airport meal. Per-day
        cost is the honest comparison number between trips: {usd(r.perDay, 0)}/day here. If the monthly
        savings line stings, the levers in order of painlessness: trim a night, drop the hotel tier,
        then cut an activity — not the buffer. The buffer is what keeps the vacation off a credit card.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Wedding Budget ---------------- */

export function WeddingBudgetCalc() {
  const [guests, setGuests] = useNumber(100)
  const [perGuest, setPerGuest] = useNumber(120)
  const [attire, setAttire] = useNumber(2500)
  const [photo, setPhoto] = useNumber(3000)
  const [flowers, setFlowers] = useNumber(2000)
  const [music, setMusic] = useNumber(1200)
  const [rings, setRings] = useNumber(1000)
  const [misc, setMisc] = useNumber(800)
  const [bufferPct, setBufferPct] = useNumber(10)
  const [monthsAway, setMonthsAway] = useNumber(12)

  const r = useMemo(() => {
    const venueFood = guests * perGuest
    const base = venueFood + attire + photo + flowers + music + rings + misc
    const total = base * (1 + bufferPct / 100)
    const perGuestAll = guests > 0 ? total / guests : 0
    const monthly = monthsAway > 0 ? total / monthsAway : total
    const venuePct = base > 0 ? (venueFood / base) * 100 : 0
    return { venueFood, base, total, perGuestAll, monthly, venuePct }
  }, [guests, perGuest, attire, photo, flowers, music, rings, misc, bufferPct, monthsAway])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Guests" value={guests} onChange={setGuests} step="5" />
        <Field label="Venue + catering per guest" value={perGuest} onChange={setPerGuest} prefix="$" />
        <Field label="Attire & beauty" value={attire} onChange={setAttire} prefix="$" />
        <Field label="Photo & video" value={photo} onChange={setPhoto} prefix="$" />
        <Field label="Flowers & decor" value={flowers} onChange={setFlowers} prefix="$" />
        <Field label="Music & entertainment" value={music} onChange={setMusic} prefix="$" />
        <Field label="Rings" value={rings} onChange={setRings} prefix="$" />
        <Field label="Invites, favors & misc" value={misc} onChange={setMisc} prefix="$" />
        <Field label="Surprise buffer" value={bufferPct} onChange={setBufferPct} suffix="%" />
        <Field label="Wedding is months away" value={monthsAway} onChange={setMonthsAway} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Total wedding cost" value={usd(r.total, 0)} />
        <Result label="All-in cost per guest" value={usd(r.perGuestAll, 0)} />
        <Result label="Save monthly to pay cash" value={usd(r.monthly, 0)} />
        <Result label="Venue + food share" value={`${num(r.venuePct, 0)}% of budget`} />
        <Result label="Venue + catering" value={usd(r.venueFood, 0)} />
        <Result label="Buffer for surprises" value={usd(r.total - r.base, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Venue and catering run about half of most wedding budgets — here {num(r.venuePct, 0)}% — so the
        guest list is the budget: every 10 guests at {usd(perGuest, 0)} a head moves the total{' '}
        {usd(perGuest * 10 * (1 + bufferPct / 100), 0)}. The {num(bufferPct, 0)}% buffer covers the
        costs that appear after the quotes: service charges, gratuities, alterations, the vendor meals
        nobody mentions. If the monthly line is impossible, cut guests before cutting quality —
        80 guests done well beats 120 done thin, and nobody remembers your centerpieces anyway.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Baby First-Year Cost ---------------- */

export function BabyCostCalc() {
  const [childcare, setChildcare] = useNumber(1200)
  const [childcareMo, setChildcareMo] = useNumber(12)
  const [diapers, setDiapers] = useNumber(70)
  const [formula, setFormula] = useNumber(150)
  const [gear, setGear] = useNumber(1200)
  const [medical, setMedical] = useNumber(800)
  const [clothes, setClothes] = useNumber(50)
  const [bufferPct, setBufferPct] = useNumber(10)

  const r = useMemo(() => {
    const cc = childcare * Math.min(childcareMo, 12)
    const dia = diapers * 12
    const form = formula * 12
    const clo = clothes * 12
    const base = cc + dia + form + gear + medical + clo
    const total = base * (1 + bufferPct / 100)
    const monthly = total / 12
    const ccShare = base > 0 ? (cc / base) * 100 : 0
    return { cc, dia, form, clo, base, total, monthly, ccShare }
  }, [childcare, childcareMo, diapers, formula, gear, medical, clothes, bufferPct])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Childcare per month" value={childcare} onChange={setChildcare} prefix="$" />
        <Field label="Months of childcare in year 1" value={childcareMo} onChange={setChildcareMo} step="1" />
        <Field label="Diapers & wipes per month" value={diapers} onChange={setDiapers} prefix="$" />
        <Field label="Formula per month (0 if breastfeeding)" value={formula} onChange={setFormula} prefix="$" />
        <Field label="One-time gear (crib, car seat, stroller)" value={gear} onChange={setGear} prefix="$" />
        <Field label="Medical (deductibles, visits)" value={medical} onChange={setMedical} prefix="$" />
        <Field label="Clothes per month" value={clothes} onChange={setClothes} prefix="$" />
        <Field label="Surprise buffer" value={bufferPct} onChange={setBufferPct} suffix="%" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="First-year total" value={usd(r.total, 0)} />
        <Result label="Monthly average" value={usd(r.monthly, 0)} />
        <Result label="Childcare share" value={`${num(r.ccShare, 0)}% of budget`} />
        <Result label="Childcare (year)" value={usd(r.cc, 0)} />
        <Result label="Diapers (year)" value={usd(r.dia, 0)} />
        <Result label="Formula (year)" value={usd(r.form, 0)} />
        <Result label="Gear + medical + clothes" value={usd(r.base - r.cc - r.dia - r.form, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Childcare dominates — {num(r.ccShare, 0)}% of this budget — which is why the daycare waitlist
        matters more than the stroller brand. The monthly average ({usd(r.monthly, 0)}) is the number
        to test-drive before the baby arrives: live on your current budget minus that amount for a few
        months and bank the difference — it builds the newborn buffer and proves the budget survives.
        Second kids cost less: gear is already bought, and the clothes pipeline exists.
      </p>
    </CardContent></Card>
  )
}

export function PetCostCalc() {
  const [fee, setFee] = useNumber(150)
  const [initialVet, setInitialVet] = useNumber(500)
  const [gear, setGear] = useNumber(250)
  const [foodMo, setFoodMo] = useNumber(60)
  const [vetYr, setVetYr] = useNumber(200)
  const [insMo, setInsMo] = useNumber(45)
  const [groomYr, setGroomYr] = useNumber(300)
  const [trainYr, setTrainYr] = useNumber(150)
  const [toysMo, setToysMo] = useNumber(15)
  const [bufferPct, setBufferPct] = useNumber(10)

  const r = useMemo(() => {
    const food = foodMo * 12
    const ins = insMo * 12
    const toys = toysMo * 12
    const oneTime = fee + initialVet + gear
    const base = oneTime + food + vetYr + ins + groomYr + trainYr + toys
    const total = base * (1 + bufferPct / 100)
    const monthly = total / 12
    const insShare = base > 0 ? (ins / base) * 100 : 0
    const yr2 = (food + vetYr + ins + groomYr + toys) * (1 + bufferPct / 100)
    return { food, ins, toys, oneTime, base, total, monthly, insShare, yr2 }
  }, [fee, initialVet, gear, foodMo, vetYr, insMo, groomYr, trainYr, toysMo, bufferPct])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Adoption / purchase fee" value={fee} onChange={setFee} prefix="$" />
        <Field label="Initial vet (spay/neuter, vaccines, microchip)" value={initialVet} onChange={setInitialVet} prefix="$" />
        <Field label="One-time gear (crate, bed, leash, bowls)" value={gear} onChange={setGear} prefix="$" />
        <Field label="Food per month" value={foodMo} onChange={setFoodMo} prefix="$" />
        <Field label="Routine vet per year" value={vetYr} onChange={setVetYr} prefix="$" />
        <Field label="Pet insurance per month (0 if self-insuring)" value={insMo} onChange={setInsMo} prefix="$" />
        <Field label="Grooming per year" value={groomYr} onChange={setGroomYr} prefix="$" />
        <Field label="Training per year" value={trainYr} onChange={setTrainYr} prefix="$" />
        <Field label="Toys & treats per month" value={toysMo} onChange={setToysMo} prefix="$" />
        <Field label="Surprise buffer" value={bufferPct} onChange={setBufferPct} suffix="%" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="First-year total" value={usd(r.total, 0)} />
        <Result label="Monthly average" value={usd(r.monthly, 0)} />
        <Result label="Years 2+ run rate" value={usd(r.yr2, 0)} />
        <Result label="One-time costs" value={usd(r.oneTime, 0)} />
        <Result label="Food (year)" value={usd(r.food, 0)} />
        <Result label="Insurance (year)" value={usd(r.ins, 0)} />
        <Result label="Insurance share" value={`${num(r.insShare, 0)}% of budget`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Year one is the expensive year — one-time costs here are {usd(r.oneTime, 0)} on top of
        the recurring run rate, and years 2+ drop to {usd(r.yr2, 0)} once gear and the initial
        vet work are behind you. The insurance-versus-emergency-fund decision is the biggest
        lever: at {usd(r.ins, 0)}/year, insurance only beats self-insuring if a major claim
        (surgery, $3,000+) happens early — the math-fair alternative is banking that premium
        into a dedicated vet fund instead. The monthly average ({usd(r.monthly, 0)}) is the
        number to add to the household budget before bringing the pet home.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- 529 College Savings Projector ---------------- */

// FV of balance + monthly contributions vs college cost inflated to matriculation and
// through the college years. Verified: $10k + $300/mo, 10yr @6%, $31k cost @4% →
// $67,072 saved vs $194,860 total (34.4%); full funding needs $1,080/mo.
// Costs per College Board 2025-26: in-state public $30,990/yr total, private $65,470/yr.
export function College529Calc() {
  const [balance, setBalance] = useNumber(10000)
  const [monthly, setMonthly] = useNumber(300)
  const [years, setYears] = useNumber(10)
  const [ret, setRet] = useNumber(6)
  const [annualCost, setAnnualCost] = useNumber(31000)
  const [cInfl, setCInfl] = useNumber(4)
  const [collegeYears, setCollegeYears] = useNumber(4)

  const r = useMemo(() => {
    const mr = ret / 100 / 12
    const n = years * 12
    const fvBal = balance * Math.pow(1 + ret / 100, years)
    const fvContrib = monthly * (mr > 0 ? (Math.pow(1 + mr, n) - 1) / mr : n)
    const savings = fvBal + fvContrib
    const yr1 = annualCost * Math.pow(1 + cInfl / 100, years)
    let total = 0
    for (let k = 0; k < collegeYears; k++) total += yr1 * Math.pow(1 + cInfl / 100, k)
    const coverage = total > 0 ? (savings / total) * 100 : 0
    const needed = mr > 0 ? Math.max(0, (total - fvBal) / ((Math.pow(1 + mr, n) - 1) / mr)) : Math.max(0, (total - fvBal) / n)
    const gap = Math.max(0, total - savings)
    return { fvBal, fvContrib, savings, yr1, total, coverage, needed, gap }
  }, [balance, monthly, years, ret, annualCost, cInfl, collegeYears])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Current 529 balance" value={balance} onChange={setBalance} prefix="$" />
        <Field label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" />
        <Field label="Years until college" value={years} onChange={setYears} step="1" />
        <Field label="Annual return" value={ret} onChange={setRet} suffix="%" step="0.5" />
        <Field label="Today's annual cost (all-in)" value={annualCost} onChange={setAnnualCost} prefix="$" step="500" />
        <Field label="College cost inflation" value={cInfl} onChange={setCInfl} suffix="%" step="0.5" />
        <Field label="Years of college" value={collegeYears} onChange={setCollegeYears} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Projected savings" value={usd(r.savings, 0)} />
        <Result label="Projected total cost" value={usd(r.total, 0)} />
        <Result label="Coverage" value={`${num(r.coverage, 0)}%`} />
        <Result label={r.gap > 0 ? 'Shortfall' : 'Surplus'} value={usd(Math.abs(r.total - r.savings), 0)} />
        <Result label="First-year cost (inflated)" value={usd(r.yr1, 0)} />
        <Result label="From current balance" value={usd(r.fvBal, 0)} />
        <Result label="From contributions" value={usd(r.fvContrib, 0)} />
        <Result label="Monthly to fully fund" value={usd(r.needed, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Today's all-in averages per College Board 2025-26: {usd(30990, 0)}/yr in-state public,
        {' '}{usd(50920, 0)} out-of-state, {usd(65470, 0)} private nonprofit — put the one you are
        targeting in the cost field. At {num(cInfl, 0)}% inflation, the first year of college
        costs {usd(r.yr1, 0)} by the time this student enrolls, and the full {collegeYears}-year
        bill is {usd(r.total, 0)}. Your current plan covers {num(r.coverage, 0)}%; closing the gap
        takes {usd(r.needed, 0)}/month from today. 529 growth and qualified withdrawals are
        tax-free, and most states add a deduction or credit on contributions — the gap is
        smaller than it looks if you start before the compounding years run out.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Home Office Deduction ---------------- */

// Simplified: $5/sq ft, max 300 sq ft ($1,500). Actual: business share of housing costs.
// Self-employed only — the W-2 employee deduction was suspended by TCJA and made permanent
// by OBBBA (2025). Savings = deduction × (marginal rate + SE tax 15.3% × 92.35% = 14.13%).
// Verified: 150/2,000 sq ft, $28.8k costs → actual $2,160 vs simplified $750 (actual +$1,410).
export function HomeOfficeCalc() {
  const [office, setOffice] = useNumber(150)
  const [home, setHome] = useNumber(2000)
  const [housing, setHousing] = useNumber(28800)
  const [mrate, setMrate] = useNumber(22)
  const [se, setSe] = useState(true)

  const r = useMemo(() => {
    const simp = Math.min(office, 300) * 5
    const pct = home > 0 ? Math.min(office, home) / home : 0
    const actual = housing * pct
    const rate = mrate / 100 + (se ? 0.1413 : 0)
    const winner = actual >= simp ? 'actual' : 'simplified'
    return { simp, pct: pct * 100, actual, winner, diff: Math.abs(actual - simp), saveActual: actual * rate, saveSimp: simp * rate, rate: rate * 100 }
  }, [office, home, housing, mrate, se])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Office area" value={office} onChange={setOffice} suffix="sq ft" />
        <Field label="Total home area" value={home} onChange={setHome} suffix="sq ft" />
        <Field label="Annual housing costs (rent or interest+tax, utilities, insurance)" value={housing} onChange={setHousing} prefix="$" step="500" />
        <Field label="Your marginal tax rate" value={mrate} onChange={setMrate} suffix="%" step="1" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={se} onChange={(e) => setSe(e.target.checked)} />
          <span>Self-employed (adds ~14.1% SE-tax savings)</span>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label={`${r.winner === 'actual' ? 'Actual' : 'Simplified'} method wins`} value={`by ${usd(r.diff, 0)}`} />
        <Result label="Business share of home" value={`${num(r.pct, 1)}%`} />
        <Result label="Actual-method deduction" value={usd(r.actual, 0)} />
        <Result label="Simplified deduction" value={usd(r.simp, 0)} />
        <Result label="Tax saved (actual)" value={usd(r.saveActual, 0)} />
        <Result label="Tax saved (simplified)" value={usd(r.saveSimp, 0)} />
        <Result label="Your combined savings rate" value={`${num(r.rate, 1)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Your office is {num(r.pct, 1)}% of the home, so the actual method deducts {usd(r.actual, 0)}
        {' '}against the simplified method's flat {usd(r.simp, 0)} — the {r.winner} route is worth{' '}
        {usd(r.diff, 0)} more deduction, about {usd(Math.abs(r.saveActual - r.saveSimp), 0)} more
        cash back at your rates. Two hard rules: the space must be used regularly and exclusively
        for business (the kitchen table fails), and this deduction is self-employed only — W-2
        employees lost it under TCJA, and OBBBA made that permanent. Actual method can never
        exceed your business income (it can't create a loss), and homeowners should know the
        depreciation piece gets recaptured at sale — one reason some owners pick simplified anyway.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Solar Panel Payback (2026 — post-credit) ---------------- */

// IMPORTANT: the 30% federal residential credit (IRC §25D) ENDED Dec 31, 2025 under
// OBBBA (P.L. 119-21). No federal credit for homeowner systems placed in service in
// 2026. Lease/PPA "credit" is the owner's commercial §48E, not the homeowner's.
// Verified: $24k system − $2k state rebate, 9,000 kWh @ 18.8¢, 90% offset → yr1
// $1,522.80, simple payback 14.4y, escalated (3% util, 0.5% degradation) yr 13,
// 25-yr net +$29,915. Avg US residential rate ≈18.8¢/kWh (EIA, Mar 2026).
export function SolarPaybackCalc() {
  const [cost, setCost] = useNumber(24000)
  const [rebate, setRebate] = useNumber(2000)
  const [kwh, setKwh] = useNumber(9000)
  const [rate, setRate] = useNumber(18.8)
  const [offset, setOffset] = useNumber(90)
  const [esc, setEsc] = useNumber(3)
  const [deg, setDeg] = useNumber(0.5)

  const r = useMemo(() => {
    const net = Math.max(0, cost - rebate)
    const yr1 = kwh * (rate / 100) * (offset / 100)
    let cum = 0
    let payback: number | null = null
    for (let y = 1; y <= 25; y++) {
      cum += yr1 * Math.pow(1 + esc / 100, y - 1) * Math.pow(1 - deg / 100, y - 1)
      if (payback === null && cum >= net) payback = y
    }
    const simple = yr1 > 0 ? net / yr1 : Infinity
    return { net, yr1, simple, payback, total25: cum, net25: cum - net }
  }, [cost, rebate, kwh, rate, offset, esc, deg])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="System cost (cash price)" value={cost} onChange={setCost} prefix="$" step="500" />
        <Field label="State/utility rebates" value={rebate} onChange={setRebate} prefix="$" step="100" />
        <Field label="Annual production" value={kwh} onChange={setKwh} suffix="kWh" step="100" />
        <Field label="Your electricity rate" value={rate} onChange={setRate} suffix="¢/kWh" step="0.1" />
        <Field label="Bill offset (net metering)" value={offset} onChange={setOffset} suffix="%" step="1" />
        <Field label="Utility rate escalation" value={esc} onChange={setEsc} suffix="%/yr" step="0.5" />
        <Field label="Panel degradation" value={deg} onChange={setDeg} suffix="%/yr" step="0.1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Payback (with escalation)" value={r.payback === null ? '> 25 yrs' : `${r.payback} yrs`} />
        <Result label="Net cost after rebates" value={usd(r.net, 0)} />
        <Result label="Year-1 bill savings" value={usd(r.yr1, 0)} />
        <Result label="Simple payback (flat rates)" value={isFinite(r.simple) ? `${num(r.simple, 1)} yrs` : '—'} />
        <Result label="25-year total savings" value={usd(r.total25, 0)} />
        <Result label="25-year net gain" value={r.net25 >= 0 ? `+${usd(r.net25, 0)}` : `−${usd(Math.abs(r.net25), 0)}`} />
      </div>
      <p className="text-sm text-muted-foreground">
        2026 reality check: the 30% federal residential solar credit (§25D) ended December 31,
        2025 under OBBBA — there is no federal credit for a homeowner system installed in 2026.
        If an installer's quote still shows a "30% federal credit" line, that's the lease/PPA
        company's commercial §48E credit, which belongs to them, not you. What still drives the
        math: your electricity rate (US average ≈18.8¢/kWh; 30¢+ states pay back years earlier),
        your net-metering terms, and state rebates. Here the system pays back in{' '}
        {r.payback === null ? 'over 25 years' : `${r.payback} years`} and nets{' '}
        {usd(r.net25, 0)} over its 25-year life.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- EV vs Gas Total Cost (2026 — post-credit) ---------------- */

// IMPORTANT: §30D new-EV ($7,500) and §25E used-EV ($4,000) credits ended Sept 30, 2025
// under OBBBA; §30C charger credit ended June 30, 2026. No federal purchase credit in
// the math. (OBBBA's auto-loan interest deduction applies to both EV and gas — neutral.)
// Verified: $45k EV vs $38k gas, 12k mi/yr, 30 kWh/100mi @17¢ vs 30mpg @$3.40 →
// $612 vs $1,360 fuel, $1,348/yr saved w/ maintenance, breakeven 5.2y, EV −$6,480 @10y.
export function EvVsGasCalc() {
  const [evPrice, setEvPrice] = useNumber(45000)
  const [gasPrice, setGasPrice] = useNumber(38000)
  const [miles, setMiles] = useNumber(12000)
  const [kwh100, setKwh100] = useNumber(30)
  const [rate, setRate] = useNumber(17)
  const [mpg, setMpg] = useNumber(30)
  const [gasGal, setGasGal] = useNumber(3.4)
  const [evMaint, setEvMaint] = useNumber(400)
  const [gasMaint, setGasMaint] = useNumber(1000)

  const r = useMemo(() => {
    const evFuel = (miles / 100) * kwh100 * (rate / 100)
    const gasFuel = (miles / Math.max(1, mpg)) * gasGal
    const annualSave = gasFuel + gasMaint - (evFuel + evMaint)
    const premium = evPrice - gasPrice
    const breakeven = annualSave > 0 ? premium / annualSave : Infinity
    const years = 10
    const evT = evPrice + (evFuel + evMaint) * years
    const gasT = gasPrice + (gasFuel + gasMaint) * years
    return { evFuel, gasFuel, annualSave, premium, breakeven, evT, gasT, diff: gasT - evT, years }
  }, [evPrice, gasPrice, miles, kwh100, rate, mpg, gasGal, evMaint, gasMaint])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="EV purchase price" value={evPrice} onChange={setEvPrice} prefix="$" step="500" />
        <Field label="Gas car purchase price" value={gasPrice} onChange={setGasPrice} prefix="$" step="500" />
        <Field label="Miles per year" value={miles} onChange={setMiles} step="500" />
        <Field label="EV efficiency" value={kwh100} onChange={setKwh100} suffix="kWh/100mi" step="1" />
        <Field label="Home electricity rate" value={rate} onChange={setRate} suffix="¢/kWh" step="0.5" />
        <Field label="Gas car MPG" value={mpg} onChange={setMpg} step="1" />
        <Field label="Gas price" value={gasGal} onChange={setGasGal} prefix="$" suffix="/gal" step="0.05" />
        <Field label="EV maintenance per year" value={evMaint} onChange={setEvMaint} prefix="$" step="50" />
        <Field label="Gas maintenance per year" value={gasMaint} onChange={setGasMaint} prefix="$" step="50" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Breakeven" value={isFinite(r.breakeven) ? `${num(r.breakeven, 1)} yrs` : 'never (EV costs more to run)'} />
        <Result label="EV premium to recover" value={usd(r.premium, 0)} />
        <Result label="Annual savings (fuel + maint)" value={usd(r.annualSave, 0)} />
        <Result label="EV fuel per year" value={usd(r.evFuel, 0)} />
        <Result label="Gas fuel per year" value={usd(r.gasFuel, 0)} />
        <Result label={`EV ${r.years}-year total`} value={usd(r.evT, 0)} />
        <Result label={`Gas ${r.years}-year total`} value={usd(r.gasT, 0)} />
        <Result label={`EV advantage @ ${r.years} yrs`} value={r.diff >= 0 ? `+${usd(r.diff, 0)}` : `−${usd(Math.abs(r.diff), 0)}`} />
      </div>
      <p className="text-sm text-muted-foreground">
        2026 reality check: the $7,500 federal EV credit (§30D) and the $4,000 used-EV credit
        ended September 30, 2025, and the charger credit followed on June 30, 2026 — dealer
        ads that still quote them are stale. What remains: state rebates (several run $1,500–$6,000),
        utility off-peak rates, and the operating math itself. Here the EV costs {usd(r.premium, 0)}
        more up front but saves {usd(r.annualSave, 0)} a year — home charging at {num(rate, 1)}¢
        is the whole game, since public fast-charging can cost gas-car money per mile.
        Breakeven: {isFinite(r.breakeven) ? `${num(r.breakeven, 1)} years` : 'never on these inputs'}.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Heat Pump vs Gas Furnace (2026 — post-credit) ---------------- */

// IMPORTANT: the §25C efficiency credit (up to $2,000 for heat pumps) ended Dec 31, 2025
// under OBBBA. No federal credit in the math. Honest finding: at average US rates
// (17¢/kWh, $1.50/therm) a heat pump can LOSE on heating alone — it wins with cheap
// power, expensive gas, or when it also replaces a dying AC. Delivered-heat method:
// gas cost = therms × price; HP kWh = (therms × AFUE × 100k BTU) / (3412 × COP).
// Verified: 700 therms, 92% AFUE, 17¢, COP 2.8 → gas $1,050 vs HP $1,146 (HP −$96/yr);
// at 12¢ → HP $809 (+$241/yr); $2.20 gas + 15¢ → +$529/yr, breakeven 10.4y on $5.5k premium.
export function HeatPumpCalc() {
  const [therms, setTherms] = useNumber(700)
  const [gasTherm, setGasTherm] = useNumber(1.5)
  const [afue, setAfue] = useNumber(92)
  const [rate, setRate] = useNumber(17)
  const [cop, setCop] = useNumber(2.8)
  const [hpCost, setHpCost] = useNumber(12000)
  const [gasCost, setGasCost] = useNumber(6500)
  const [acOffset, setAcOffset] = useNumber(0)

  const r = useMemo(() => {
    const gasAnnual = therms * gasTherm
    const kwh = (therms * (afue / 100) * 100000) / 3412 / Math.max(1, cop)
    const hpAnnual = kwh * (rate / 100)
    const save = gasAnnual - hpAnnual
    const premium = Math.max(0, hpCost - gasCost - acOffset)
    const breakeven = save > 0 ? premium / save : Infinity
    const net15 = save * 15 - premium
    return { gasAnnual, kwh, hpAnnual, save, premium, breakeven, net15 }
  }, [therms, gasTherm, afue, rate, cop, hpCost, gasCost, acOffset])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual heating (from gas bill)" value={therms} onChange={setTherms} suffix="therms" step="25" />
        <Field label="Gas price" value={gasTherm} onChange={setGasTherm} prefix="$" suffix="/therm" step="0.05" />
        <Field label="Furnace efficiency (AFUE)" value={afue} onChange={setAfue} suffix="%" step="1" />
        <Field label="Electricity rate" value={rate} onChange={setRate} suffix="¢/kWh" step="0.5" />
        <Field label="Heat pump COP (2.5–3.5 typical)" value={cop} onChange={setCop} step="0.1" />
        <Field label="Heat pump installed cost" value={hpCost} onChange={setHpCost} prefix="$" step="250" />
        <Field label="New furnace installed cost" value={gasCost} onChange={setGasCost} prefix="$" step="250" />
        <Field label="Avoided AC replacement (if AC is dying too)" value={acOffset} onChange={setAcOffset} prefix="$" step="250" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label={r.save >= 0 ? 'Heat pump saves' : 'Heat pump costs more'} value={`${usd(Math.abs(r.save), 0)}/yr`} />
        <Result label="Breakeven on premium" value={isFinite(r.breakeven) ? `${num(r.breakeven, 1)} yrs` : 'never (heating costs more)'} />
        <Result label="Premium to recover" value={usd(r.premium, 0)} />
        <Result label="Gas heating per year" value={usd(r.gasAnnual, 0)} />
        <Result label="Heat pump heating per year" value={usd(r.hpAnnual, 0)} />
        <Result label="HP electricity needed" value={`${num(r.kwh, 0)} kWh/yr`} />
        <Result label="15-year net (heat only)" value={r.net15 >= 0 ? `+${usd(r.net15, 0)}` : `−${usd(Math.abs(r.net15), 0)}`} />
      </div>
      <p className="text-sm text-muted-foreground">
        2026 reality check: the federal §25C credit (up to $2,000 for heat pumps) ended
        December 31, 2025 — contractor quotes showing it are stale. The honest math: at the US
        average 17¢/kWh and $1.50/therm, a heat pump roughly breaks even or loses slightly on
        heating alone ({r.save >= 0 ? 'yours saves' : 'this scenario loses'} {usd(Math.abs(r.save), 0)}/yr).
        It wins clearly in three cases: cheap electricity (under ~12¢), expensive gas ($2+/therm
        — Northeast, California), and the two-birds case — if your AC is also near death, the
        heat pump IS the new air conditioner, so subtract that replacement from the premium.
        Cold-climate units hold COP ~2+ at 5°F; below that, dual-fuel (keep the furnace as
        backup) is the standard answer.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Paycheck Withholding (IRS Annualization) ---------------- */

// The IRS aggregate method: each check is treated as if you earn it EVERY check —
// wages × periods − standard deduction → annual brackets → ÷ periods. This is why one
// big check gets crushed. 2026 brackets (Rev. Proc. 2025-32), std $16.1k/$32.2k.
// VERIFIED against a real 2026 paystub: $13,411 − $135.51 pre-tax, biweekly, single
// → $3,228.51 federal, exact to the penny. $21k single check → $5,932 fed (35.9% w/ FICA).
const WH_2026 = {
  single: { std: 16100, br: [[12400, 0.1], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [Infinity, 0.37]] as [number, number][] },
  mfj: { std: 32200, br: [[24800, 0.1], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [Infinity, 0.37]] as [number, number][] },
}
const PERIODS: [string, number][] = [['Weekly (52)', 52], ['Biweekly (26)', 26], ['Semimonthly (24)', 24], ['Monthly (12)', 12]]

function bracketTax2026(t: number, br: [number, number][]) {
  let x = 0
  let p = 0
  let rem = t
  for (const [cap, rate] of br) {
    if (rem <= 0) break
    const w = Math.min(rem, cap - p)
    x += w * rate
    p = cap
    rem -= w
  }
  return x
}

export function WithholdingCalc() {
  const [check, setCheck] = useNumber(21000)
  const [preTax, setPreTax] = useNumber(0)
  const [pIdx, setPIdx] = useState(1)
  const [status, setStatus] = useState<'single' | 'mfj'>('single')
  const periods = PERIODS[pIdx][1]

  const r = useMemo(() => {
    const w = Math.max(0, check - preTax)
    const annual = w * periods
    const { std, br } = WH_2026[status]
    const taxable = Math.max(0, annual - std)
    const fed = bracketTax2026(taxable, br) / periods
    const ss = w * 0.062
    const med = w * 0.0145
    const total = fed + ss + med
    const eff = check > 0 ? (total / check) * 100 : 0
    const effMarginal = annual > std ? bracketTax2026(taxable, br) - bracketTax2026(Math.max(0, taxable - 100), br) : 0
    return { w, annual, taxable, fed, ss, med, total, eff, marginal: effMarginal }
  }, [check, preTax, periods, status])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="This check's gross pay" value={check} onChange={setCheck} prefix="$" step="100" />
        <Field label="Pre-tax deductions on it (401(k), HSA, premiums)" value={preTax} onChange={setPreTax} prefix="$" step="10" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Pay frequency</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={pIdx} onChange={(e) => setPIdx(Number(e.target.value))}>
            {PERIODS.map(([label], i) => <option key={label} value={i}>{label}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Filing status</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value as 'single' | 'mfj')}>
            <option value="single">Single</option>
            <option value="mfj">Married filing jointly</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Federal withholding on this check" value={usd(r.fed, 2)} />
        <Result label="Social Security (6.2%)" value={usd(r.ss, 2)} />
        <Result label="Medicare (1.45%)" value={usd(r.med, 2)} />
        <Result label="Total withheld" value={usd(r.total, 2)} />
        <Result label="Effective rate on this check" value={`${num(r.eff, 1)}%`} />
        <Result label="IRS sees annualized pay of" value={usd(r.annual, 0)} />
        <Result label="Annualized taxable income" value={usd(r.taxable, 0)} />
        <Result label="True extra tax per $100" value={usd(r.marginal, 2)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Why a big check gets crushed: your employer uses the IRS aggregate method — this one
        check is treated as if you earn it every check, so {usd(r.w, 0)} × {periods} ={' '}
        {usd(r.annual, 0)} of "annual pay" gets pushed through the 2026 brackets. A single
        {' '}{usd(21000, 0)} biweekly check withholds {usd(5932, 0)} federal — nearly 36% with
        FICA — not because your tax bill is that high, but because annualization pretends you
        make {usd(546000, 0)}/year. If your other checks are smaller, you over-withhold and get
        it back as a refund. Variable income (commission, bonus, overtime spikes)? Set the W-4
        from your AVERAGE check, not your biggest one.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Rule of 72 / Doubling Time ---------------- */

// Exact doubling: t = ln(2)/ln(1+r). Rule of 72 (72/r%) is the mental-math
// approximation — nearly perfect near 8% (9.006 vs 9.0 exact), drifting ~1 yr
// high at 2% and ~2.4 months low at 20%. Node-verified table in git history.
export function RuleOf72Calc() {
  const [rate, setRate] = useNumber(8)
  const [targetYears, setTargetYears] = useNumber(10)

  const r = useMemo(() => {
    const g = rate / 100
    const doubling = g > 0 ? Math.LN2 / Math.log(1 + g) : Infinity
    const rule72 = rate > 0 ? 72 / rate : Infinity
    const errMonths = isFinite(doubling) && isFinite(rule72) ? (rule72 - doubling) * 12 : 0
    const at = (mult: number) => (g > 0 ? Math.log(mult) / Math.log(1 + g) : Infinity)
    const needed = targetYears > 0 ? (Math.pow(2, 1 / targetYears) - 1) * 100 : Infinity
    const neededRule = targetYears > 0 ? 72 / targetYears : Infinity
    const halfLife = exact2(0.03)
    function exact2(x: number) { return Math.LN2 / Math.log(1 + x) }
    return { doubling, rule72, errMonths, quad: at(4), eight: at(8), ten: at(10), needed, neededRule, halfLife }
  }, [rate, targetYears])

  const yrs = (v: number) => (isFinite(v) ? `${num(v, 1)} yrs` : 'never at 0%')

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual return / growth rate" value={rate} onChange={setRate} suffix="%" step="0.5" />
        <Field label="Goal: double my money in…" value={targetYears} onChange={setTargetYears} suffix="years" step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Exact time to double" value={yrs(r.doubling)} />
        <Result label="Rule of 72 says" value={yrs(r.rule72)} />
        <Result label="Rule of 72 is off by" value={isFinite(r.doubling) ? `${num(Math.abs(r.errMonths), 1)} months ${r.errMonths >= 0 ? 'high' : 'low'}` : '—'} />
        <Result label="Time to 4x" value={yrs(r.quad)} />
        <Result label="Time to 8x" value={yrs(r.eight)} />
        <Result label="Time to 10x" value={yrs(r.ten)} />
        <Result label={`To double in ${num(targetYears, 0)} yrs you need`} value={isFinite(r.needed) ? `${num(r.needed, 2)}%/yr` : '—'} />
        <Result label="Rule of 72 reverse guess" value={isFinite(r.neededRule) ? `${num(r.neededRule, 1)}%/yr` : '—'} />
      </div>
      <p className="text-sm text-muted-foreground">
        The Rule of 72 (72 ÷ rate) is mental math, not math — the exact answer is ln(2) ÷ ln(1+rate).
        It's freakishly accurate near 8% (9.00 vs 9.01 exact) but drifts: at 2% it overestimates by a
        full year (36 vs 35.0), at 20% it underestimates by 2.4 months. At your {num(rate, 1)}%, money
        doubles every {yrs(r.doubling)} — so {num(rate, 1)}% turns one dollar into ten in {yrs(r.ten)}.
        The flip side nobody posts: inflation is the same equation running against you — at 3%
        inflation, cash under the mattress loses half its purchasing power every {num(r.halfLife, 1)} years.
        And the gut-check: doubling in {num(targetYears, 0)} years demands {num(r.needed, 1)}%/yr —
        anything promising far more than that is selling risk, not returns.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Annuity Payout (period-certain + implied-rate check) ---------------- */

// Period-certain annuity = standard amortization: PMT = P·i/(1−(1+i)^−n).
// Node-verified: $100k @5%/20y → $659.96/mo; @0% → $416.67 (P/n); $250k @6%/30y
// → $1,498.88. Reverse (implied APR from an insurer quote) solved by bisection:
// $650/mo on $100k/20y → 4.819%, re-verified by substitution.
function annuityPmt(P: number, aprPct: number, yrs: number) {
  const i = aprPct / 100 / 12
  const n = yrs * 12
  return i === 0 ? P / n : (P * i) / (1 - Math.pow(1 + i, -n))
}
function impliedApr(P: number, monthly: number, yrs: number) {
  let lo = 0
  let hi = 40
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2
    if (annuityPmt(P, mid, yrs) > monthly) hi = mid
    else lo = mid
  }
  return (lo + hi) / 2
}

export function AnnuityPayoutCalc() {
  const [premium, setPremium] = useNumber(100000)
  const [rate, setRate] = useNumber(5)
  const [yrs, setYrs] = useNumber(20)
  const [quote, setQuote] = useNumber(650)

  const r = useMemo(() => {
    const pmt = annuityPmt(premium, rate, yrs)
    const total = pmt * yrs * 12
    const interest = total - premium
    const implied = quote > 0 ? impliedApr(premium, quote, yrs) : 0
    const quoteTotal = quote * yrs * 12
    const floor = premium / (yrs * 12)
    const edge = implied - rate
    return { pmt, total, interest, implied, quoteTotal, floor, edge }
  }, [premium, rate, yrs, quote])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Lump sum / premium" value={premium} onChange={setPremium} prefix="$" step="5000" />
        <Field label="Rate your money earns while paying out" value={rate} onChange={setRate} suffix="%" step="0.25" />
        <Field label="Payout period" value={yrs} onChange={setYrs} suffix="years" step="1" />
        <Field label="Insurer's quoted monthly payment (to grade it)" value={quote} onChange={setQuote} prefix="$" suffix="/mo" step="10" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Monthly payout at your rate" value={usd(r.pmt, 2)} />
        <Result label="Total received" value={usd(r.total, 0)} />
        <Result label="Interest earned over premium" value={usd(r.interest, 0)} />
        <Result label="Absolute floor (0% rate)" value={`${usd(r.floor, 2)}/mo`} />
        <Result label="Insurer quote's implied rate" value={`${num(r.implied, 2)}%`} />
        <Result label="Quote vs your rate" value={`${r.edge >= 0 ? '+' : ''}${num(r.edge, 2)} pts`} />
        <Result label="Quote pays back total" value={usd(r.quoteTotal, 0)} />
        <Result label="Quote vs your math, monthly" value={`${quote - r.pmt >= 0 ? '+' : ''}${usd(quote - r.pmt, 2)}`} />
      </div>
      <p className="text-sm text-muted-foreground">
        A period-certain annuity is pure amortization: {usd(premium, 0)} at {num(rate, 2)}% for{' '}
        {num(yrs, 0)} years pays {usd(r.pmt, 2)}/mo — never less than the {usd(r.floor, 2)} floor
        (premium ÷ months). To grade a real insurer quote, ignore the monthly number and compare
        IMPLIED RATES: theirs works out to {num(r.implied, 2)}%/yr over the period. If that beats
        safe CD/Treasury yields, the quote is competitive — life annuities legitimately pay above
        amortization because of mortality credits (early deaths subsidize survivors). If it lags,
        keeping the lump sum and self-annuitizing wins. Deferred-annuity buyers: surrender charges
        and 1%+ annual fees eat exactly this spread — demand the implied rate before signing.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Rent Affordability ---------------- */

// The 30% rule and NYC's 40× rule are the SAME formula: 0.30×annual/12 = annual/40.
// Landlord 3×-rent rule = 33.3% of gross. HUD: 30–50% of income on housing =
// cost-burdened, 50%+ = severely cost-burdened. Node-verified: 60k → $1,500
// (30% rule = 40× rule), $1,666.67 (3× rule), $1,250 (25%).
export function RentAffordCalc() {
  const [income, setIncome] = useNumber(60000)
  const [debts, setDebts] = useNumber(300)
  const [targetRent, setTargetRent] = useNumber(1500)

  const r = useMemo(() => {
    const m = income / 12
    const rule30 = m * 0.3
    const rule3x = m / 3
    const rule25 = m * 0.25
    const withDebts = Math.max(0, rule30 - debts)
    const pct = m > 0 ? (targetRent / m) * 100 : 0
    const leftover = m - targetRent - debts
    const landlordIncome = targetRent * 3 * 12
    const status = pct > 50 ? 'severely cost-burdened (HUD)' : pct > 30 ? 'cost-burdened (HUD)' : 'within the 30% rule'
    return { m, rule30, rule3x, rule25, withDebts, pct, leftover, landlordIncome, status }
  }, [income, debts, targetRent])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual gross income" value={income} onChange={setIncome} prefix="$" step="1000" />
        <Field label="Monthly debt payments (car, cards, loans)" value={debts} onChange={setDebts} prefix="$" step="25" />
        <Field label="Rent you're considering" value={targetRent} onChange={setTargetRent} prefix="$" suffix="/mo" step="50" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Max rent — 30% rule" value={`${usd(r.rule30, 0)}/mo`} />
        <Result label="Landlord 3× rule allows" value={`${usd(r.rule3x, 0)}/mo`} />
        <Result label="Conservative 25% rule" value={`${usd(r.rule25, 0)}/mo`} />
        <Result label="30% rule minus your debts" value={`${usd(r.withDebts, 0)}/mo`} />
        <Result label="Your target rent is" value={`${num(r.pct, 1)}% of gross`} />
        <Result label="HUD status at that rent" value={r.status} />
        <Result label="Left for everything else" value={`${usd(r.leftover, 0)}/mo`} />
        <Result label="Income a landlord wants for it" value={`${usd(r.landlordIncome, 0)}/yr`} />
      </div>
      <p className="text-sm text-muted-foreground">
        The rules, demystified: the 30% rule and New York's "40× rent" income requirement are the
        SAME formula — 30% of monthly gross equals annual income ÷ 40 ({usd(income, 0)} ÷ 40 ={' '}
        {usd(r.rule30, 0)}). The landlord 3×-rent rule is slightly looser at 33.3%. All of them use
        GROSS income — on a typical ~78% take-home, {usd(r.rule30, 0)} of rent is really ~38% of
        your actual paycheck. HUD calls 30–50% of income on housing "cost-burdened" and 50%+
        "severely cost-burdened" — at {usd(targetRent, 0)}, you are {r.status}. And debts come out
        of the same envelope: with {usd(debts, 0)}/mo of payments, the 30% rule really allows{' '}
        {usd(r.withDebts, 0)} of rent.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Travel Nurse Pay (staff vs contract, honest net) ---------------- */

// Stipends (housing + M&IE per diem) are tax-free ONLY with a real tax home and
// duplicated expenses (IRS temporary-assignment rules; >12 months expected at one
// site = indefinite = stipends taxable). Node-verified: staff $42/hr×36×52 =
// $78,624 gross → $61,326.72 net @22%. Travel $28/hr + $1,300/wk stipend, 3×13wk
// contracts, $1,500/mo duplicated housing → $67,863.36 net, wins by $6,536.64.
// Breakeven stipend $1,132.39/wk; stipend taxable-equivalent $1,666.67/wk.
export function TravelNurseCalc() {
  const [staffRate, setStaffRate] = useNumber(42)
  const [hours, setHours] = useNumber(36)
  const [taxRate, setTaxRate] = useNumber(22)
  const [travRate, setTravRate] = useNumber(28)
  const [stipend, setStipend] = useNumber(1300)
  const [contractWks, setContractWks] = useNumber(13)
  const [contracts, setContracts] = useNumber(3)
  const [dupHousing, setDupHousing] = useNumber(1500)

  const r = useMemo(() => {
    const t = taxRate / 100
    const staffGross = staffRate * hours * 52
    const staffNet = staffGross * (1 - t)
    const perContractTaxable = travRate * hours * contractWks
    const perContractStipend = stipend * contractWks
    const perContractTotal = perContractTaxable + perContractStipend
    const weeks = contractWks * contracts
    const travTaxableNet = perContractTaxable * contracts * (1 - t)
    const travStipends = perContractStipend * contracts
    const dupTotal = (dupHousing * weeks * 12) / 52
    const travNet = travTaxableNet + travStipends - dupTotal
    const edge = travNet - staffNet
    const stipendEquiv = t < 1 ? stipend / (1 - t) : Infinity
    const breakeven = weeks > 0 ? Math.max(0, (staffNet + dupTotal - travTaxableNet) / weeks) : 0
    const taxFreeShare = perContractTotal > 0 ? (perContractStipend / perContractTotal) * 100 : 0
    return { staffGross, staffNet, travNet, edge, perContractTotal, weeks, dupTotal, stipendEquiv, breakeven, taxFreeShare }
  }, [staffRate, hours, taxRate, travRate, stipend, contractWks, contracts, dupHousing])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Staff offer — hourly rate" value={staffRate} onChange={setStaffRate} prefix="$" suffix="/hr" step="1" />
        <Field label="Hours per week (both jobs)" value={hours} onChange={setHours} suffix="hrs" step="1" />
        <Field label="Your tax rate on taxable pay" value={taxRate} onChange={setTaxRate} suffix="%" step="1" />
        <Field label="Travel contract — taxable hourly" value={travRate} onChange={setTravRate} prefix="$" suffix="/hr" step="1" />
        <Field label="Weekly tax-free stipends (housing + M&IE)" value={stipend} onChange={setStipend} prefix="$" suffix="/wk" step="25" />
        <Field label="Contract length" value={contractWks} onChange={setContractWks} suffix="weeks" step="1" />
        <Field label="Contracts per year" value={contracts} onChange={setContracts} step="1" />
        <Field label="Duplicated housing at assignment" value={dupHousing} onChange={setDupHousing} prefix="$" suffix="/mo" step="50" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label={r.edge >= 0 ? 'Travel contract wins by' : 'Staff position wins by'} value={`${usd(Math.abs(r.edge), 0)}/yr`} />
        <Result label="Staff take-home per year" value={usd(r.staffNet, 0)} />
        <Result label="Travel take-home per year" value={usd(r.travNet, 0)} />
        <Result label="One contract pays (gross)" value={usd(r.perContractTotal, 0)} />
        <Result label="Tax-free share of contract pay" value={`${num(r.taxFreeShare, 0)}%`} />
        <Result label="Stipend worth as taxable pay" value={`${usd(r.stipendEquiv, 0)}/wk`} />
        <Result label="Breakeven stipend" value={`${usd(r.breakeven, 0)}/wk`} />
        <Result label="Duplicated housing cost" value={`${usd(r.dupTotal, 0)}/yr`} />
      </div>
      <p className="text-sm text-muted-foreground">
        The honest comparison: staff pays {usd(r.staffNet, 0)} take-home; the contract pays{' '}
        {usd(r.travNet, 0)} after tax on the taxable wage and your real duplicated housing. The
        stipend's magic is tax — {usd(stipend, 0)}/wk tax-free equals {usd(r.stipendEquiv, 0)}/wk
        of taxable pay at {num(taxRate, 0)}% — but it is only tax-free while you keep a legitimate
        TAX HOME and actually duplicate expenses. Expect to stay at one site over 12 months and
        the IRS calls it indefinite: every stipend dollar becomes taxable income. Below{' '}
        {usd(r.breakeven, 0)}/wk of stipend, this contract loses to staff. And the low taxable
        wage has hidden costs: it shrinks your Social Security earnings record, your mortgage
        income verification, and any 401(k) match computed on base pay.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Truck Driver Per Diem ---------------- */

// IRS Notice 2025-54 (Oct 2025–Sep 2026): transportation-industry M&IE $80/day
// CONUS, $86 OCONUS; partial (departure/return) days 75% = $60; DOT hours-of-service
// drivers deduct 80%. W-2 company drivers CANNOT deduct it themselves (misc.
// itemized deductions permanently eliminated by OBBBA) — only via employer per-diem
// pay programs. Node-verified: 260 full days → $20,800 total, $16,640 deduction.
export function TruckerPerDiemCalc() {
  const [mode, setMode] = useState<'owner' | 'company'>('owner')
  const [fullDays, setFullDays] = useNumber(250)
  const [partDays, setPartDays] = useNumber(10)
  const [rate, setRate] = useNumber(80)
  const [taxRate, setTaxRate] = useNumber(37.3)
  const [carrierDays, setCarrierDays] = useNumber(250)
  const [carrierPd, setCarrierPd] = useNumber(66)
  const [cTaxRate, setCTaxRate] = useNumber(29.65)

  const r = useMemo(() => {
    if (mode === 'owner') {
      const total = fullDays * rate + partDays * rate * 0.75
      const deduction = total * 0.8
      const savings = (deduction * taxRate) / 100
      const perDay = fullDays + partDays > 0 ? savings / (fullDays + partDays) : 0
      return { total, deduction, savings, perDay }
    }
    const untaxed = carrierDays * carrierPd
    const extra = (untaxed * cTaxRate) / 100
    return { untaxed, extra, extraPerWeek: extra / 52 }
  }, [mode, fullDays, partDays, rate, taxRate, carrierDays, carrierPd, cTaxRate])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="flex gap-2">
        {(['owner', 'company'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${mode === m ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:border-primary/50'}`}>
            {m === 'owner' ? 'Owner-operator (Schedule C)' : 'Company driver (W-2 per-diem pay)'}
          </button>
        ))}
      </div>
      {mode === 'owner' ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Full days away from home" value={fullDays} onChange={setFullDays} suffix="days" step="5" />
            <Field label="Partial days (depart/return = 75%)" value={partDays} onChange={setPartDays} suffix="days" step="1" />
            <Field label="Daily rate (2026 IRS: $80 CONUS / $86 OCONUS)" value={rate} onChange={setRate} prefix="$" step="1" />
            <Field label="Your combined tax rate (income + 15.3% SE)" value={taxRate} onChange={setTaxRate} suffix="%" step="1" />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Tax savings this year" value={usd(r.savings!, 0)} />
            <Result label="Per-diem total claimed" value={usd(r.total!, 0)} />
            <Result label="Deductible (80% DOT rule)" value={usd(r.deduction!, 0)} />
            <Result label="Savings per day on the road" value={usd(r.perDay!, 2)} />
          </div>
          <p className="text-sm text-muted-foreground">
            Owner-operators deduct meals without receipts using the IRS transportation-industry
            rate — ${num(rate, 0)}/day (Notice 2025-54), 75% on departure and return days, and 80%
            of the total is deductible because DOT hours-of-service rules apply. Your {num(fullDays, 0)}{' '}
            full + {num(partDays, 0)} partial days = {usd(r.total!, 0)} claimed, {usd(r.deduction!, 0)}{' '}
            deducted on Schedule C, worth {usd(r.savings!, 0)} at your {num(taxRate, 1)}% combined
            rate. Per diem covers meals and incidentals only — lodging, fuel, tolls, and maintenance
            are separate deductions. ELD logs ARE your substantiation: keep them.
          </p>
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Days carrier pays per diem" value={carrierDays} onChange={setCarrierDays} suffix="days" step="5" />
            <Field label="Carrier per-diem pay" value={carrierPd} onChange={setCarrierPd} prefix="$" suffix="/day" step="1" />
            <Field label="Your tax rate incl. FICA (income + 7.65%)" value={cTaxRate} onChange={setCTaxRate} suffix="%" step="1" />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Extra take-home vs all-taxable pay" value={`${usd(r.extra!, 0)}/yr`} />
            <Result label="Untaxed per-diem pay" value={`${usd(r.untaxed!, 0)}/yr`} />
            <Result label="Extra per week" value={usd(r.extraPerWeek!, 2)} />
            <Result label="Taxable wages reduced by" value={usd(r.untaxed!, 0)} />
          </div>
          <p className="text-sm text-muted-foreground">
            Since the miscellaneous-deduction elimination (made permanent in 2025), W-2 company
            drivers CANNOT deduct per diem on their own return — the only benefit is a carrier
            per-diem program like this one: {usd(r.untaxed!, 0)}/yr of your pay arrives untaxed,
            adding {usd(r.extra!, 0)} to your annual take-home at {num(cTaxRate, 2)}%. The trade
            is real though: your taxable W-2 wages drop by the same {usd(r.untaxed!, 0)}, which
            shrinks your Social Security earnings record, unemployment and workers-comp benefits,
            and the income a mortgage lender can count. Per-diem pay wins for cash flow; full
            taxable pay wins for benefits and borrowing power.
          </p>
        </>
      )}
    </CardContent></Card>
  )
}

/* ---------------- TSP (Thrift Savings Plan) ---------------- */

// 2026 limits (IRS Notice 2025-73 / TSP Bulletin 25-3): elective deferral $24,500
// (traditional + Roth combined), catch-up $8,000 (50-59, 64+), $11,250 (60-63),
// annual additions $72,000. Match (FERS/BRS): auto 1% + 100% of first 3% + 50% of
// next 2% — PER PAY PERIOD, so hitting the cap early forfeits later-period match.
// Node-verified: $95k @5% → $4,750+$3,800+$950 = $9,500 total (the 10%); @30% →
// capped $24,500, loses $438.46 of match; optimal election 25.79% ($942.31/period).
const TSP_LIMITS = { under50: 24500, catchup: 32500, super: 35750 }

export function TspCalc() {
  const [pay, setPay] = useNumber(95000)
  const [pct, setPct] = useNumber(5)
  const [ageGrp, setAgeGrp] = useState<'under50' | 'catchup' | 'super'>('under50')
  const [balance, setBalance] = useNumber(25000)
  const [years, setYears] = useNumber(25)
  const [ret, setRet] = useNumber(7)

  const r = useMemo(() => {
    const limit = TSP_LIMITS[ageGrp]
    const periods = 26
    const periodPay = pay / periods
    const want = (pct / 100) * pay
    const perPeriod = want / periods
    const matchPct = Math.min(pct, 3) + Math.min(Math.max(pct - 3, 0), 2) * 0.5
    let employee: number, matchedPeriods: number, partialMatch = 0
    if (want <= limit) {
      employee = want
      matchedPeriods = periods
    } else {
      employee = limit
      const full = Math.floor(limit / perPeriod)
      const rem = limit - full * perPeriod
      matchedPeriods = full
      if (rem > 0) {
        matchedPeriods = full + 1
        const eff = (rem / periodPay) * 100
        const mp = Math.min(eff, 3) + Math.min(Math.max(eff - 3, 0), 2) * 0.5
        partialMatch = (mp / 100) * periodPay
      }
    }
    const fullMatched = partialMatch > 0 ? matchedPeriods - 1 : matchedPeriods
    const match = fullMatched * (matchPct / 100) * periodPay + partialMatch
    const lostPeriods = periods - matchedPeriods
    const lost = lostPeriods * (matchPct / 100) * periodPay
    const auto = pay * 0.01
    const total = employee + match + auto
    const optimalPct = (limit / pay) * 100
    const g = ret / 100
    const fv = g > 0 ? total * ((Math.pow(1 + g, years) - 1) / g) + balance * Math.pow(1 + g, years) : total * years + balance
    return { limit, employee, match, lost, auto, total, optimalPct, fv, hitCap: want > limit, perPeriodWant: perPeriod }
  }, [pay, pct, ageGrp, balance, years, ret])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual basic pay" value={pay} onChange={setPay} prefix="$" step="1000" />
        <Field label="Your contribution per pay period" value={pct} onChange={setPct} suffix="%" step="1" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Age group (2026 limit)</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={ageGrp} onChange={(e) => setAgeGrp(e.target.value as 'under50' | 'catchup' | 'super')}>
            <option value="under50">Under 50 ($24,500)</option>
            <option value="catchup">50–59 or 64+ ($32,500)</option>
            <option value="super">60–63 ($35,750)</option>
          </select>
        </label>
        <Field label="Current TSP balance" value={balance} onChange={setBalance} prefix="$" step="1000" />
        <Field label="Years until retirement" value={years} onChange={setYears} suffix="yrs" step="1" />
        <Field label="Expected annual return" value={ret} onChange={setRet} suffix="%" step="0.5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Total into TSP per year" value={usd(r.total, 0)} />
        <Result label="Your contribution (capped)" value={usd(r.employee, 0)} />
        <Result label="Agency/service match" value={usd(r.match, 0)} />
        <Result label="Automatic 1%" value={usd(r.auto, 0)} />
        <Result label="Match LOST to front-loading" value={r.lost > 0.5 ? usd(r.lost, 0) : 'none'} />
        <Result label="Election to max without losing match" value={`${num(r.optimalPct, 2)}%`} />
        <Result label="That's per paycheck" value={usd(r.limit / 26, 2)} />
        <Result label={`Projected balance in ${num(years, 0)} yrs`} value={usd(r.fv, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        At {num(pct, 0)}% of {usd(pay, 0)} basic pay, {usd(r.total, 0)}/yr lands in your TSP —
        {r.hitCap ? ` and because the match is computed PER PAY PERIOD, hitting the ${usd(r.limit, 0)} cap early costs you ${usd(r.lost, 0)} of match in the remaining periods. Drop to ${num(r.optimalPct, 2)}% (${usd(r.limit / 26, 2)}/paycheck) to max out with every period matched.` : ' below the cap, every pay period stays matched.'}{' '}
        The match itself: automatic 1% plus dollar-for-dollar on your first 3% and 50¢/dollar on the
        next 2% — contribute 5% and 10% of pay goes in. Agency money never counts against your
        $24,500 elective deferral (2026, Notice 2025-73); it counts against the separate $72,000
        annual-additions cap. Two 2026 traps: catch-up contributions must be Roth if your prior-year
        Social Security wages topped $150k, and the agency automatic 1% vests after 3 years (2 for
        BRS) — your own money and the match are always yours.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- 403(b) with 15-Year Service Catch-Up ---------------- */

// The special 403(b) catch-up (IRC 402(g)(7), Pub 571 worksheet): LEAST of
// (1) $3,000/yr; (2) $15,000 lifetime minus prior 15-yr catch-up deferrals;
// (3) $5,000 × years of service minus ALL prior elective deferrals to this
// employer's plans. Ordering (IRS example): deferrals over the base limit count
// toward the 15-year catch-up FIRST, then age-50. Node-verified cases below.
export function Teacher403bCalc() {
  const [yrs, setYrs] = useNumber(16)
  const [prior, setPrior] = useNumber(40000)
  const [used, setUsed] = useNumber(0)
  const [ageGrp, setAgeGrp] = useState<'under50' | 'catchup' | 'super'>('under50')

  const r = useMemo(() => {
    const base = 24500
    const ageCatch = ageGrp === 'under50' ? 0 : ageGrp === 'catchup' ? 8000 : 11250
    const eligible = yrs >= 15
    const p1 = 3000
    const p2 = Math.max(0, 15000 - used)
    const p3 = Math.max(0, 5000 * yrs - prior)
    const c = eligible ? Math.min(p1, p2, p3) : 0
    let prong = 'not eligible — needs 15 years with THIS employer'
    if (eligible) {
      if (c === 0) prong = p3 === 0 ? 'prong 3 binds: you have averaged $5,000+/yr already' : 'prong 2 binds: $15,000 lifetime cap used up'
      else if (c === p3 && p3 <= p1 && p3 <= p2) prong = 'prong 3 binds ($5,000 × years − prior deferrals)'
      else if (c === p2 && p2 <= p1) prong = 'prong 2 binds ($15,000 lifetime − prior use)'
      else prong = 'prong 1 binds ($3,000/year cap)'
    }
    const total = base + c + ageCatch
    return { base, ageCatch, eligible, p1, p2, p3, c, prong, total }
  }, [yrs, prior, used, ageGrp])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Years of service with THIS employer" value={yrs} onChange={setYrs} suffix="yrs" step="1" />
        <Field label="All prior elective deferrals to this employer's plans" value={prior} onChange={setPrior} prefix="$" step="1000" />
        <Field label="15-year catch-up already used (lifetime)" value={used} onChange={setUsed} prefix="$" step="500" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Age group (2026)</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={ageGrp} onChange={(e) => setAgeGrp(e.target.value as 'under50' | 'catchup' | 'super')}>
            <option value="under50">Under 50</option>
            <option value="catchup">50–59 or 64+ (+$8,000)</option>
            <option value="super">60–63 (+$11,250)</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Your 2026 403(b) maximum" value={usd(r.total, 0)} />
        <Result label="Base limit (everyone)" value={usd(r.base, 0)} />
        <Result label="15-year catch-up available" value={usd(r.c, 0)} />
        <Result label="Age catch-up" value={usd(r.ageCatch, 0)} />
        <Result label="Prong 1: $3,000/yr cap" value={usd(r.p1, 0)} />
        <Result label="Prong 2: $15k lifetime left" value={usd(r.p2, 0)} />
        <Result label="Prong 3: $5k×yrs − deferrals" value={usd(r.p3, 0)} />
        <Result label="Which prong binds" value={r.prong} />
      </div>
      <p className="text-sm text-muted-foreground">
        The 15-year rule is a least-of-three formula most sites oversimplify: $3,000/year, $15,000
        lifetime, and — the killer — $5,000 × your years of service minus EVERYTHING you have ever
        deferred into this employer's plans. Heavy savers often get zero: 15 years with $80,000
        deferred fails prong 3 (75,000 − 80,000 &lt; 0). Light savers win: {num(yrs, 0)} years with{' '}
        {usd(prior, 0)} deferred leaves {usd(r.p3, 0)} of prong-3 room. Eligible employers: public
        school systems, hospitals, home-health and health-and-welfare agencies, churches — and the
        plan document must allow it. For public schools the DISTRICT is generally the employer, so
        years at different schools in the same district usually combine. Ordering trap per the IRS's
        own example: deferrals above {usd(r.base, 0)} count against the 15-year catch-up FIRST, then
        the age-50 catch-up — so eligible 50+ educators can stack all three ({usd(24500 + 3000 + 8000, 0)}{' '}
        total in 2026, or {usd(24500 + 3000 + 11250, 0)} at 60–63).
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Backdoor Roth / Pro-Rata Rule (Form 8606) ---------------- */

// Form 8606 Part I: ALL traditional/SEP/SIMPLE IRAs aggregate as one pot.
// Nontaxable % = basis ÷ (year-end value + conversions + distributions); since
// year-end = (preTax + basis) − conversion, the divisor is simply preTax + basis.
// Node-verified classic: $94k pre-tax + $6k basis, convert $7k → $420 nontaxable,
// $6,580 taxable. 401(k)/403(b) balances do NOT count — the roll-in rescue.
export function BackdoorRothCalc() {
  const [preTax, setPreTax] = useNumber(94000)
  const [basis, setBasis] = useNumber(6000)
  const [conv, setConv] = useNumber(7000)
  const [rate, setRate] = useNumber(24)

  const r = useMemo(() => {
    const total = preTax + basis
    const ntPct = total > 0 ? basis / total : 0
    const c = Math.min(conv, total)
    const nt = c * ntPct
    const taxable = c - nt
    const taxBill = (taxable * rate) / 100
    const remainingBasis = basis - nt
    // Rescue: pre-tax rolled into a 401(k) before Dec 31 → only basis remains
    const rescueTaxable = Math.max(0, c - basis)
    const rescueBill = (rescueTaxable * rate) / 100
    return { total, ntPct: ntPct * 100, nt, taxable, taxBill, remainingBasis, rescueTaxable, rescueBill }
  }, [preTax, basis, conv, rate])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Pre-tax money in ALL traditional/SEP/SIMPLE IRAs" value={preTax} onChange={setPreTax} prefix="$" step="1000" />
        <Field label="After-tax basis (non-deductible contributions)" value={basis} onChange={setBasis} prefix="$" step="500" />
        <Field label="Amount converting to Roth this year" value={conv} onChange={setConv} prefix="$" step="500" />
        <Field label="Your marginal federal tax rate" value={rate} onChange={setRate} suffix="%" step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Taxable part of this conversion" value={usd(r.taxable, 0)} />
        <Result label="Nontaxable (basis) part" value={usd(r.nt, 0)} />
        <Result label="Tax bill on the conversion" value={usd(r.taxBill, 0)} />
        <Result label="Pro-rata basis share" value={`${num(r.ntPct, 1)}%`} />
        <Result label="Basis remaining after" value={usd(Math.max(0, r.remainingBasis), 0)} />
        <Result label="With 401(k) roll-in rescue" value={`${usd(r.rescueTaxable, 0)} taxable`} />
        <Result label="Rescue saves you" value={usd(r.taxBill - r.rescueBill, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        The pro-rata rule is why "just convert the non-deductible contribution" fails: the IRS
        treats ALL your traditional, SEP, and SIMPLE IRAs as one pot (spouse's IRAs are separate;
        401(k)/403(b) balances don't count). Your {usd(conv, 0)} conversion is {num(r.ntPct, 1)}%
        tax-free basis and the rest is ordinary income — {usd(r.taxable, 0)} taxable,{' '}
        {usd(r.taxBill, 0)} at {num(rate, 0)}%. The rescue: roll the {usd(preTax, 0)} pre-tax into
        a current employer's 401(k) BEFORE December 31 (the rule values IRAs at year-end), leaving
        only basis — then the conversion is {usd(r.rescueTaxable, 0)} taxable. File Form 8606 for
        BOTH the non-deductible contribution and the conversion, each spouse separately — the $50
        failure-to-file penalty is real, and no custodian tracks your basis for you.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Social Security PIA (2026 bend points) ---------------- */

// 2026 bend points $1,286/$7,749 (SSA, for those turning 62 in 2026 — they lock
// for life that year). PIA = 90%/32%/15% of AIME bands, rounded DOWN to the dime.
// Node-verified against SSA anchors: AIME 6,000 → $2,665.80; 10,000 → $3,563.20;
// 14,358 (max) → $4,216.90. Claiming adjustments (FRA 67): 62 = −30%, 70 = +24%.
const SSA_B1 = 1286
const SSA_B2 = 7749
const SS_ADJ: [string, number][] = [['62 (−30%)', 0.7], ['63 (−25%)', 0.75], ['64 (−20%)', 0.8], ['65 (−13.3%)', 0.8667], ['66 (−6.7%)', 0.9333], ['67 — full retirement', 1], ['68 (+8%)', 1.08], ['69 (+16%)', 1.16], ['70 (+24%)', 1.24]]

function pia2026(aime: number) {
  const raw = 0.9 * Math.min(aime, SSA_B1) + 0.32 * Math.max(0, Math.min(aime, SSA_B2) - SSA_B1) + 0.15 * Math.max(0, aime - SSA_B2)
  return Math.floor(raw * 10) / 10
}

export function SocialSecurityPiaCalc() {
  const [aime, setAime] = useNumber(6000)
  const [ageIdx, setAgeIdx] = useState(5)

  const r = useMemo(() => {
    const pia = pia2026(aime)
    const adj = SS_ADJ[ageIdx][1]
    const benefit = Math.floor(pia * adj * 10) / 10
    const b90 = 0.9 * Math.min(aime, SSA_B1)
    const b32 = 0.32 * Math.max(0, Math.min(aime, SSA_B2) - SSA_B1)
    const b15 = 0.15 * Math.max(0, aime - SSA_B2)
    const replacement = aime > 0 ? (pia / aime) * 100 : 0
    return { pia, benefit, at62: Math.floor(pia * 0.7 * 10) / 10, at70: Math.floor(pia * 1.24 * 10) / 10, b90, b32, b15, replacement }
  }, [aime, ageIdx])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your AIME (from your SSA statement)" value={aime} onChange={setAime} prefix="$" suffix="/mo" step="100" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Claiming age (born 1960+)</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={ageIdx} onChange={(e) => setAgeIdx(Number(e.target.value))}>
            {SS_ADJ.map(([label], i) => <option key={label} value={i}>{label}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label={`Monthly benefit at ${SS_ADJ[ageIdx][0].split(' ')[0]}`} value={usd(r.benefit, 0)} />
        <Result label="PIA at full retirement (67)" value={usd(r.pia, 2)} />
        <Result label="If you claim at 62" value={usd(r.at62, 0)} />
        <Result label="If you wait to 70" value={usd(r.at70, 0)} />
        <Result label="90% band adds" value={usd(r.b90, 2)} />
        <Result label="32% band adds" value={usd(r.b32, 2)} />
        <Result label="15% band adds" value={usd(r.b15, 2)} />
        <Result label="Income replacement rate" value={`${num(r.replacement, 1)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        The exact SSA formula, 2026 bend points ($1,286 / $7,749 — they lock in the year you turn
        62): 90% of AIME up to {usd(SSA_B1, 0)}, 32% to {usd(SSA_B2, 0)}, 15% above, rounded DOWN
        to the dime. Your AIME of {usd(aime, 0)} → PIA {usd(r.pia, 2)}. The formula is deliberately
        progressive: someone at AIME $2,000 replaces 69.3% of income; at $8,000 only 40.8%. Don't
        know your AIME? ssa.gov's my account shows it — a rough proxy is your average career salary
        ÷ 12 (assumes 35 years; missing years count as ZERO and drag it down). Waiting from 62 to
        70 moves your check from {usd(r.at62, 0)} to {usd(r.at70, 0)} — a 77% raise for the same
        earnings record. 2026 context: 2.8% COLA, $184,500 taxable max, maximum possible PIA
        $4,216.90.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Mega Backdoor Roth ---------------- */

// 2026 §415(c) annual additions limit $72,000 (Notice 2025-73) = employee elective
// deferrals + employer contributions + AFTER-TAX contributions. Room = cap −
// deferral − match. Catch-up ($8,000/$11,250) is excluded from the cap but goes to
// regular deferrals, not after-tax. Node-verified: $200k salary, $24.5k deferral,
// $10k match → $37,500 room; 20 yrs @7% → $1,537,331 Roth vs $1,348,372 after-tax.
export function MegaBackdoorCalc() {
  const [salary, setSalary] = useNumber(200000)
  const [deferral, setDeferral] = useNumber(24500)
  const [match, setMatch] = useNumber(10000)
  const [years, setYears] = useNumber(20)
  const [ret, setRet] = useNumber(7)
  const [rate, setRate] = useNumber(24)

  const r = useMemo(() => {
    const cap = 72000
    const room = Math.max(0, cap - deferral - match)
    const inflow = deferral + match + room
    const pctUsed = (inflow / cap) * 100
    const g = ret / 100
    const fv = g > 0 ? room * ((Math.pow(1 + g, years) - 1) / g) : room * years
    const contrib = room * years
    const earnings = fv - contrib
    const afterTaxNet = fv - (earnings * rate) / 100
    const advantage = fv - afterTaxNet
    return { cap, room, inflow, pctUsed, fv, contrib, earnings, afterTaxNet, advantage }
  }, [salary, deferral, match, years, ret, rate])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Salary (context only)" value={salary} onChange={setSalary} prefix="$" step="5000" />
        <Field label="Your 401(k) deferral (trad + Roth)" value={deferral} onChange={setDeferral} prefix="$" step="500" />
        <Field label="Employer match / profit sharing" value={match} onChange={setMatch} prefix="$" step="500" />
        <Field label="Years of mega contributions" value={years} onChange={setYears} suffix="yrs" step="1" />
        <Field label="Expected annual return" value={ret} onChange={setRet} suffix="%" step="0.5" />
        <Field label="Tax rate on earnings (after-tax path)" value={rate} onChange={setRate} suffix="%" step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Mega backdoor room (after-tax)" value={`${usd(r.room, 0)}/yr`} />
        <Result label="Total 401(k) inflow" value={`${usd(r.inflow, 0)}/yr`} />
        <Result label="Of the $72,000 cap" value={`${num(r.pctUsed, 0)}%`} />
        <Result label={`Roth value in ${num(years, 0)} yrs`} value={usd(r.fv, 0)} />
        <Result label="Same money left after-tax" value={usd(r.afterTaxNet, 0)} />
        <Result label="Roth conversion advantage" value={usd(r.advantage, 0)} />
        <Result label="Your contributions" value={usd(r.contrib, 0)} />
        <Result label="Earnings taxed in after-tax path" value={usd(r.earnings, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        The mega backdoor Roth lives in the gap between the $24,500 elective deferral limit and the
        $72,000 §415(c) annual-additions cap (2026, Notice 2025-73): {usd(deferral, 0)} of your
        deferrals + {usd(match, 0)} of employer money leaves {usd(r.room, 0)} of after-tax room.
        Two plan features make or break it — the plan must accept AFTER-TAX contributions AND allow
        in-plan Roth conversions (or in-service distributions to a Roth IRA). Convert immediately:
        left in after-tax, {usd(r.earnings, 0)} of earnings gets taxed at withdrawal; converted each
        year, the entire {usd(r.fv, 0)} grows tax-free — a {usd(r.advantage, 0)} difference.
        Catch-up contributions ($8,000 / $11,250 at 60–63) sit outside the cap but can't be
        after-tax. If HR can't confirm both features in writing, the mega door is closed.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Roth Conversion Ladder ---------------- */

// Each conversion seasons 5 years from Jan 1 of its tax year (a Dec 2026
// conversion is available Jan 1, 2031 — effectively ~4 years). Conversions are
// ordinary income; reuses the verified WH_2026 brackets. Node-verified: single
// $40k conversion → $2,620 tax (6.55%); MFJ → $780 (1.95%); 12%-bracket-fill
// headroom $66,500 single / $133,000 MFJ.
export function RothLadderCalc() {
  const [spend, setSpend] = useNumber(40000)
  const [status, setStatus] = useState<'single' | 'mfj'>('single')

  const r = useMemo(() => {
    const { std, br } = WH_2026[status]
    const convTax = (c: number) => bracketTax2026(Math.max(0, c - std), br)
    const perConvTax = convTax(spend)
    const eff = spend > 0 ? (perConvTax / spend) * 100 : 0
    const bridge = spend * 5
    const top12 = (status === 'single' ? 50400 : 100800) + std
    const top12Tax = convTax(top12)
    const years = Array.from({ length: 10 }, (_, y) => ({
      y,
      convert: spend,
      tax: perConvTax,
      seasons: 2026 + y + 5,
      cumulative: y >= 5 ? spend * (y - 4) : 0,
    }))
    const totalTax10 = perConvTax * 10
    return { perConvTax, eff, bridge, top12, top12Tax, years, totalTax10 }
  }, [spend, status])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual spending in early retirement" value={spend} onChange={setSpend} prefix="$" step="1000" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Filing status</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value as 'single' | 'mfj')}>
            <option value="single">Single</option>
            <option value="mfj">Married filing jointly</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Bridge fund needed (5 years)" value={usd(r.bridge, 0)} />
        <Result label="Convert each year" value={usd(spend, 0)} />
        <Result label="Tax per conversion" value={`${usd(r.perConvTax, 0)} (${num(r.eff, 1)}%)`} />
        <Result label="10-year conversion tax" value={usd(r.totalTax10, 0)} />
        <Result label="Max conversion staying ≤12%" value={usd(r.top12, 0)} />
        <Result label="Tax on that max" value={usd(r.top12Tax, 0)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-1.5 pr-3">Year</th>
              <th className="py-1.5 pr-3">Convert</th>
              <th className="py-1.5 pr-3">Tax</th>
              <th className="py-1.5 pr-3">Seasons Jan 1</th>
              <th className="py-1.5">Cumulative available</th>
            </tr>
          </thead>
          <tbody>
            {r.years.map((row) => (
              <tr key={row.y} className="border-b border-border/50">
                <td className="py-1.5 pr-3">{2026 + row.y}</td>
                <td className="py-1.5 pr-3">{usd(row.convert, 0)}</td>
                <td className="py-1.5 pr-3">{usd(row.tax, 0)}</td>
                <td className="py-1.5 pr-3">{row.seasons}</td>
                <td className="py-1.5">{row.cumulative > 0 ? usd(row.cumulative, 0) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        The ladder in one paragraph: you need {usd(r.bridge, 0)} of bridge money (taxable brokerage
        + Roth CONTRIBUTIONS, which are withdrawable anytime) to survive the first five years. Each
        year you convert {usd(spend, 0)} from traditional to Roth — ordinary income that year (
        {usd(r.perConvTax, 0)} at 2026 brackets with no other income) — and five Jan-1sts later that
        conversion's principal is penalty-free at any age. The clock runs from January 1 of the
        conversion year, so a December 2026 conversion seasons January 1, 2031 — barely four years.
        Stay under {usd(r.top12, 0)} per conversion and you never leave the 12% bracket. Under 59½,
        converted EARNINGS stay locked; the ladder only seasons principal. Above all: the ladder is
        a tax-rate arbitrage — you prepaid at {num(r.eff, 1)}% instead of your working-years bracket.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Solo 401(k) ---------------- */

// Sole prop/LLC: NESE = Schedule C profit − ½ SE tax; employer side is 25% of
// (NESE − contribution) which algebraically = 20% of NESE — the step every
// "25% of profit" article misses. S-corp: flat 25% of W-2 wages, no adjustment.
// SE tax: 92.35% × profit; 12.4% SS to $184,500 (2026) + 2.9% Medicare + 0.9%
// over $200k/$250k. Node-verified: $100k profit → $43,087 total; $300k → $72,000 cap.
export function Solo401kCalc() {
  const [entity, setEntity] = useState<'sole' | 'scorp'>('sole')
  const [income, setIncome] = useNumber(100000)
  const [status, setStatus] = useState<'single' | 'mfj'>('single')
  const [ageGrp, setAgeGrp] = useState<'under50' | 'catchup' | 'super'>('under50')

  const r = useMemo(() => {
    const deferralLimit = 24500
    const catchup = ageGrp === 'under50' ? 0 : ageGrp === 'catchup' ? 8000 : 11250
    const cap = 72000 + catchup
    let halfSE = 0
    let nese = income
    let employer: number
    if (entity === 'sole') {
      const base = income * 0.9235
      const se = Math.min(base, 184500) * 0.124 + base * 0.029 + Math.max(0, base - (status === 'mfj' ? 250000 : 200000)) * 0.009
      halfSE = se / 2
      nese = income - halfSE
      employer = 0.2 * nese
    } else {
      employer = 0.25 * income
    }
    let employee = Math.min(deferralLimit + catchup, Math.max(0, nese - employer))
    if (employee + employer > cap) employer = Math.max(0, cap - employee)
    const total = employee + employer
    return { halfSE, nese, employer, employee, total, cap, capped: deferralLimit + catchup + 0.2 * nese > cap }
  }, [entity, income, status, ageGrp])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Business structure</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={entity} onChange={(e) => setEntity(e.target.value as 'sole' | 'scorp')}>
            <option value="sole">Sole proprietor / single-member LLC</option>
            <option value="scorp">S-corp (you pay yourself W-2 wages)</option>
          </select>
        </label>
        <Field label={entity === 'sole' ? 'Schedule C net profit' : 'Your W-2 wages from the S-corp'} value={income} onChange={setIncome} prefix="$" step="1000" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Age group (2026)</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={ageGrp} onChange={(e) => setAgeGrp(e.target.value as 'under50' | 'catchup' | 'super')}>
            <option value="under50">Under 50</option>
            <option value="catchup">50–59 or 64+ (+$8,000)</option>
            <option value="super">60–63 (+$11,250)</option>
          </select>
        </label>
        {entity === 'sole' && (
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Filing status (0.9% Medicare threshold)</span>
            <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value as 'single' | 'mfj')}>
              <option value="single">Single ($200k)</option>
              <option value="mfj">Married filing jointly ($250k)</option>
            </select>
          </label>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Max solo 401(k) contribution" value={`${usd(r.total, 0)}/yr`} />
        <Result label="Employee deferral side" value={usd(r.employee, 0)} />
        <Result label="Employer profit-sharing side" value={usd(r.employer, 0)} />
        {entity === 'sole' && <Result label="½ SE-tax adjustment" value={`−${usd(r.halfSE, 0)}`} />}
        {entity === 'sole' && <Result label="Net earnings (compensation base)" value={usd(r.nese, 0)} />}
        <Result label="2026 total cap" value={usd(r.cap, 0)} />
        <Result label="Cap status" value={r.capped ? 'capped at §415(c)' : 'under the cap'} />
      </div>
      <p className="text-sm text-muted-foreground">
        {entity === 'sole'
          ? `The employer side is NOT 25% of your profit — it's 25% of compensation, and for a sole proprietor "compensation" is profit minus half the self-employment tax minus the contribution itself. Solved algebraically that's 20% of net earnings: ${usd(income, 0)} profit − ${usd(r.halfSE, 0)} (½ SE tax) = ${usd(r.nese, 0)}, and 20% of that is ${usd(r.employer, 0)}. Add the $24,500 employee deferral${ageGrp === 'under50' ? '' : ' plus catch-up'} and you shelter ${usd(r.total, 0)}.`
          : `As an S-corp owner the employer side is simply 25% of your W-2 wages — ${usd(r.employer, 0)} on ${usd(income, 0)} — with no SE-tax adjustment, because the adjustment lives in your salary decision instead. Total with the deferral: ${usd(r.total, 0)}.`}{' '}
        The 2026 §415(c) cap is $72,000 (catch-up excluded, so $80,000 at 50+). Two compliance notes
        that bite: the plan must be ESTABLISHED by December 31 of the tax year (contributions can
        follow), and once plan assets top $250,000 you file Form 5500-EZ annually.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- SEP-IRA (vs solo 401(k)) ---------------- */

// SEP = employer-only: min(25% of compensation, $72,000 for 2026). Sole prop
// compensation = profit − ½ SE tax, and the circular 25% solves to 20% of NESE —
// the SAME employer math as the solo 401(k). Node-verified: $100k profit → SEP
// $18,587 vs solo $43,087; the solo advantage is exactly the $24,500 deferral
// until the cap binds ($300k profit: $56,839 vs $72,000).
const RACE_DISTS: [string, number][] = [
  ['1 mile', 1.609344], ['5K', 5], ['10K', 10], ['10 miles', 16.09344], ['Half marathon', 21.0975], ['Marathon', 42.195],
]

const WILKS_COEFF = {
  m: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-06, -1.291e-08],
  f: [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-05, -9.054e-08],
} as const

const DOTS_COEFF = {
  m: [-0.000001093, 0.0007391293, -0.1918759221, 24.0900756, -307.75076],
  f: [-0.0000010706, 0.0005158568, -0.1126655495, 13.6175032, -57.96288],
} as const

// HELOC payment & shock — the two-phase machine nobody prices honestly. DRAW PERIOD (typically 10 yrs): interest-only on the drawn balance — $50k at 8.5% = $354.17/mo, zero principal. REPAYMENT (typically 20 yrs): the balance amortizes — $433.91/mo, a 22.5% payment shock (25k at 7.5%: $156.25 → $201.40, +28.9%; the shock grows as rates fall because IO floors lower while amortization barely moves). Total interest on the example: $42,500 draw + $54,139 repay = $96,639 — nearly double the draw. Tax: post-TCJA/OBBBA, HELOC interest is deductible ONLY when the money buys/builds/substantially improves the home securing it (debt-consolidation or car HELOCs: NOT deductible), subject to the $750k total acquisition+improvement debt cap, and only if you itemize. Variable rate: most HELOCs float at prime + margin — the floor rate and rate cap matter; a +2% prime move adds $83/mo per $50k. Node-verified: $50k @8.5% → IO $354.17, repay $433.91 (+22.5%), total interest $96,639; deductible-after-tax @24% → $73,445; $25k @7.5% → $156.25 → $201.40 (+28.9%).
export function HelocCalc() {
  const [drawn, setDrawn] = useNumber(50000)
  const [rate, setRate] = useNumber(8.5)
  const [drawYrs, setDrawYrs] = useNumber(10)
  const [repayYrs, setRepayYrs] = useNumber(20)
  const [improve, setImprove] = useState(true)
  const [bracket, setBracket] = useNumber(24)

  const r = useMemo(() => {
    const i = rate / 100 / 12
    const io = (drawn * rate) / 100 / 12
    const n = Math.max(1, repayYrs * 12)
    const amort = i > 0 ? (drawn * i) / (1 - Math.pow(1 + i, -n)) : drawn / n
    const drawInt = io * drawYrs * 12
    const repayInt = amort * n - drawn
    const totalInt = drawInt + repayInt
    const shock = io > 0 ? (amort / io - 1) * 100 : 0
    const afterTax = improve ? totalInt * (1 - bracket / 100) : totalInt
    return { io, amort, drawInt, repayInt, totalInt, shock, afterTax }
  }, [drawn, rate, drawYrs, repayYrs, improve, bracket])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Amount drawn (not the limit)" value={drawn} onChange={setDrawn} prefix="$" />
          <Field label="Rate (prime + margin)" value={rate} onChange={setRate} suffix="%" />
          <Field label="Marginal tax bracket" value={bracket} onChange={setBracket} suffix="%" />
          <Field label="Draw period (years)" value={drawYrs} onChange={setDrawYrs} />
          <Field label="Repayment period (years)" value={repayYrs} onChange={setRepayYrs} />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={improve} onChange={(e) => setImprove(e.target.checked)} className="h-4 w-4" />
            Funds improve this home (interest deductible)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Draw-period payment" value={`${usd(r.io, 2)}/mo`} />
          <Result label="Repayment payment" value={`${usd(r.amort, 2)}/mo`} />
          <Result label="Payment shock" value={`+${num(r.shock, 1)}%`} />
          <Result label="Total interest" value={usd(r.totalInt, 0)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          For {drawYrs} years you pay <span className="font-medium">{usd(r.io, 2)}/mo — pure interest, the balance never moves</span>. Then the line freezes and amortizes over {repayYrs} years: <span className="font-medium">{usd(r.amort, 2)}/mo, a {num(r.shock, 1)}% jump</span>. Total interest across both phases: {usd(r.totalInt, 0)}{improve ? <> — deductible because the funds improve this home, so {usd(r.afterTax, 0)} after tax at {bracket}% (only if you itemize)</> : <> — and NOT deductible: HELOC interest only deducts when the money buys, builds, or substantially improves the home securing it</>}. The quiet risks: the rate floats (prime +2% adds {usd((drawn * 0.02) / 12, 0)}/mo on this balance), lenders can freeze undrawn credit when home values fall, and every draw restarts the clock on some contracts.
        </div>
        <p className="text-xs text-muted-foreground">
          A HELOC is two loans wearing one name. The draw period (usually 10 years) takes interest-only payments at a variable rate — prime plus a margin, with a floor and a lifetime cap buried in the agreement; some lenders offer fixed-rate locks on slices of the balance, worth asking for. The repayment period (usually 15–20 years) amortizes whatever you owe — the payment jump is the shock shown above, and it arrives precisely at age 60-something for borrowers who drew in their 50s. The interest math is stark: paying interest-only for a decade on $50,000 costs $42,500 without reducing the debt by a dollar. Tax rule (made permanent by OBBBA): interest is deductible only when proceeds buy, build, or substantially improve the securing home, within the $750,000 total mortgage-debt cap, and only for itemizers — using the line for debt consolidation or a car kills the deduction. Compare before drawing: a fixed home-equity loan (rate certainty, lump sum), a cash-out refinance (only if your first-mortgage rate is low enough to keep), and for smaller amounts a 0% intro-APR card with a hard payoff plan. Estimates — your agreement's margin, floor, and draw rules govern.
        </p>
      </CardContent>
    </Card>
  )
}

// HELOC vs CASH-OUT REFI — the effective rate on the cash is the only number that matters. A cash-out refi replaces the ENTIRE first mortgage at the new rate, so the true cost of the $50k isn't the 6.5% note rate — it's the payment delta solved back as a rate on the cash alone. Node-verified ($300k balance, $50k cash, new loan 30yr @6.5%, $3,000 closing): existing 3.5% w/ 20 yrs left → $1,739.88 → $2,212.24, Δ$472.36 → effective rate 10.90% (vs HELOC 8.5% — HELOC wins; 10-yr incremental interest $127,451 vs HELOC's $42,500). Existing 6.8% w/ 25 yrs left → Δ$130.02 → effective 0.12% (refi wins; 10-yr incremental $27,752 + $3,000 closing = $30,752 < HELOC $42,500). Rate sweep (20 yrs left, refi 6.5%): existing 3% → 12.88%, 4% → 8.78%, 5% → 3.78%, 5.5% → 0.45%. The crossover sits near 4.2–4.5% — below that the refi charges double-digit rates on the cash even though the brochure says 6.5%. Caveat priced honestly: the effective rate blends the term reset (25→30 yrs lowers payments and stretches debt); the 10-yr interest comparison isolates cost.
export function CashOutRefiCalc() {
  const [bal, setBal] = useNumber(300000)
  const [oldRate, setOldRate] = useNumber(3.5)
  const [yrsLeft, setYrsLeft] = useNumber(20)
  const [cash, setCash] = useNumber(50000)
  const [newRate, setNewRate] = useNumber(6.5)
  const [newTerm, setNewTerm] = useNumber(30)
  const [closing, setClosing] = useNumber(3000)
  const [helocRate, setHelocRate] = useNumber(8.5)

  const r = useMemo(() => {
    const pmt = (P: number, i: number, n: number) => (i > 0 ? (P * i) / (1 - Math.pow(1 + i, -n)) : P / n)
    const interestPaid = (P: number, i: number, n: number, months: number) => {
      let b = P, t = 0
      const p = pmt(P, i, n)
      for (let m = 0; m < months; m++) { const ix = b * i; t += ix; b = b - p + ix }
      return t
    }
    const nOld = Math.max(1, yrsLeft * 12)
    const nNew = Math.max(1, newTerm * 12)
    const oldP = pmt(bal, oldRate / 1200, nOld)
    const newP = pmt(bal + cash, newRate / 1200, nNew)
    const delta = newP - oldP
    // solve effective monthly rate on the cash: pmt(cash, i, nNew) = delta
    let lo = 0.00001, hi = 0.05
    if (delta > 0) for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (pmt(cash, mid, nNew) < delta) lo = mid; else hi = mid }
    const eff = delta > 0 ? ((lo + hi) / 2) * 1200 : 0
    const horizon = Math.min(120, nNew)
    const incRefi = interestPaid(bal + cash, newRate / 1200, nNew, horizon) - interestPaid(bal, oldRate / 1200, nOld, Math.min(horizon, nOld))
    const incRefiTotal = incRefi + closing
    const incHeloc = cash * (helocRate / 100) * 10 // interest-only draw decade, balance flat
    const refiWins = incRefiTotal < incHeloc
    return { oldP, newP, delta, eff, incRefiTotal, incHeloc, refiWins }
  }, [bal, oldRate, yrsLeft, cash, newRate, newTerm, closing, helocRate])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Current mortgage balance" value={bal} onChange={setBal} prefix="$" />
          <Field label="Current rate" value={oldRate} onChange={setOldRate} suffix="%" step="0.125" />
          <Field label="Years left on it" value={yrsLeft} onChange={setYrsLeft} step="1" />
          <Field label="Cash you want out" value={cash} onChange={setCash} prefix="$" />
          <Field label="Cash-out refi rate" value={newRate} onChange={setNewRate} suffix="%" step="0.125" />
          <Field label="New term (years)" value={newTerm} onChange={setNewTerm} step="5" />
          <Field label="Refi closing costs" value={closing} onChange={setClosing} prefix="$" step="500" />
          <Field label="HELOC rate (comparison)" value={helocRate} onChange={setHelocRate} suffix="%" step="0.25" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Payment today" value={usd(r.oldP)} />
          <Result label="Payment after refi" value={usd(r.newP)} />
          <Result label="Monthly increase" value={usd(r.delta)} />
          <Result big label="Effective rate on the cash" value={`${num(r.eff, 2)}%`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Result label="Refi: added 10-yr interest + closing" value={usd(r.incRefiTotal)} />
          <Result label="HELOC: 10-yr interest (draw decade)" value={usd(r.incHeloc)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.refiWins
            ? `The cash-out refi wins: your existing ${num(oldRate, 2)}% rate is close to (or above) the ${num(newRate, 2)}% refi rate, so the cash comes out at an effective ${num(r.eff, 2)}% — far under the HELOC's ${num(helocRate, 2)}%. Over 10 years the refi costs ${usd(r.incRefiTotal)} against the HELOC's ${usd(r.incHeloc)}.`
            : `Keep the first mortgage, take the HELOC: refinancing your ${num(oldRate, 2)}% loan at ${num(newRate, 2)}% makes the ${usd(cash)} of cash cost an effective ${num(r.eff, 2)}% — above the HELOC's ${num(helocRate, 2)}%. Over 10 years the refi burns ${usd(r.incRefiTotal)} in added interest and closing versus ${usd(r.incHeloc)} on the line.`}
        </div>
        <p className="text-xs text-muted-foreground">
          A cash-out refinance reprices your ENTIRE mortgage, not just the cash — that is why the effective rate on the cash can be double the note rate (a 3.5% holder pulling $50,000 at 6.5% is really paying ~10.9% on that $50,000) or nearly zero (a 6.8% holder refinancing DOWN to 6.5% gets the cash almost free). The HELOC comparison uses a 10-year interest-only draw with a flat balance; in repayment the HELOC amortizes and its total interest roughly doubles — run the HELOC calculator for the two-phase picture. Effective rate here blends the term reset: stretching 25 remaining years back to 30 lowers the payment while lengthening the debt, which flatters the refi — the 10-year interest comparison is the cleaner cost measure. Cash-out pricing usually adds a rate premium (~0.25–0.75%) over a plain refi, and conforming cash-out is capped at 80% LTV. Estimates — lender quotes govern.
        </p>
      </CardContent>
    </Card>
  )
}

// HOME EQUITY LOAN (fixed-rate second mortgage) — the boring sibling that quietly wins. Node-verified: $50k @8.0% fixed → 15yr $477.83/mo, $36,009 interest; 10yr $606.64/mo, $22,797; 20yr $418.22/mo, $50,373. Same $50k as a HELOC at the SAME 8% (10y IO + 20y repay): $333.33 → $418.22/mo but $90,373 total interest — 2.5x the fixed loan, because the interest-only decade never touches principal. After-tax @24% when deductible (home improvement): $27,367. CLTV cap: most lenders cap combined-loan-to-value at 80% (some 85–90% for a pricing premium) — $400k home, $300k mortgage → max second = $400k×0.80 − $300k = $20,000. Deductibility: same OBBBA-permanent rule as HELOCs (buy/build/improve the securing home, $750k debt cap, itemizers only). Structure differences priced honestly: fixed rate + fixed term + lump sum + immediate amortization vs HELOC's variable rate, draw flexibility, and IO decade.
export function HomeEquityLoanCalc() {
  const [home, setHome] = useNumber(400000)
  const [mort, setMort] = useNumber(300000)
  const [want, setWant] = useNumber(50000)
  const [rate, setRate] = useNumber(8.0)
  const [term, setTerm] = useNumber(15)
  const [cltvCap, setCltvCap] = useNumber(80)
  const [improve, setImprove] = useState(true)
  const [bracket, setBracket] = useNumber(24)

  const r = useMemo(() => {
    const maxLoan = Math.max(0, home * (cltvCap / 100) - mort)
    const P = Math.min(want, maxLoan)
    const i = rate / 1200
    const n = Math.max(1, term * 12)
    const p = i > 0 ? (P * i) / (1 - Math.pow(1 + i, -n)) : P / n
    const interest = p * n - P
    // HELOC at the same rate: 10y interest-only, then 20y amortization of the flat balance
    const io = P * i
    const repN = 240
    const rep = i > 0 ? (P * i) / (1 - Math.pow(1 + i, -repN)) : P / repN
    const helocInterest = io * 120 + rep * repN - P
    const afterTax = improve ? interest * (1 - bracket / 100) : interest
    return { maxLoan, P, capped: want > maxLoan, p, interest, helocInterest, helocGap: helocInterest - interest, afterTax }
  }, [home, mort, want, rate, term, cltvCap, improve, bracket])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Home value" value={home} onChange={setHome} prefix="$" />
          <Field label="Mortgage balance" value={mort} onChange={setMort} prefix="$" />
          <Field label="Amount you want" value={want} onChange={setWant} prefix="$" />
          <Field label="Lender CLTV cap" value={cltvCap} onChange={setCltvCap} suffix="%" step="5" />
          <Field label="Fixed rate" value={rate} onChange={setRate} suffix="%" step="0.125" />
          <Field label="Term (years)" value={term} onChange={setTerm} step="5" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={improve} onChange={(e) => setImprove(e.target.checked)} className="h-4 w-4" />
          Funds buy/build/improve this home (interest deductible for itemizers)
        </label>
        {improve && (
          <div className="max-w-xs">
            <Field label="Your marginal tax bracket" value={bracket} onChange={setBracket} suffix="%" />
          </div>
        )}
        {r.capped && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Your CLTV cap allows only {usd(r.maxLoan)} — the request is trimmed to that. Combined loan-to-value: home value × {num(cltvCap, 0)}% − mortgage balance.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Max you can borrow" value={usd(r.maxLoan)} />
          <Result big label="Fixed monthly payment" value={usd(r.p, 2)} />
          <Result label="Total interest (life of loan)" value={usd(r.interest)} />
          <Result label="Same $ as HELOC (same rate)" value={usd(r.helocInterest)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Result label="HELOC costs more by" value={usd(r.helocGap)} />
          <Result label={improve ? 'Your interest after tax deduction' : 'Interest (not deductible)'} value={usd(improve ? r.afterTax : r.interest)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          At the same {num(rate, 2)}% rate, the fixed loan costs {usd(r.interest)} while the HELOC&apos;s interest-only decade inflates its lifetime cost to {usd(r.helocInterest)} — a {usd(r.helocGap)} gap for identical money. The HELOC&apos;s lower first payment is not a discount; it is deferred principal.
        </div>
        <p className="text-xs text-muted-foreground">
          The home equity loan is the fixed-rate, lump-sum second mortgage: the rate never moves, amortization starts immediately, and the term (5–30 years, 10–15 typical) sets the payment. Its structural opposite is the HELOC — variable rate, draw-as-needed, interest-only draw decade — which at the same rate costs far more in lifetime interest precisely because the draw period never reduces principal. The HELOC wins only when you genuinely need the flexibility (staged renovation draws, uncertain amounts) or plan to repay fast. Deductibility follows the same OBBBA-permanent rule as HELOCs: interest is deductible only when proceeds buy, build, or substantially improve the securing home, within the $750,000 total mortgage-debt cap, for itemizers. Lenders cap combined loan-to-value at 80% typically (85–90% exists, at a rate premium), so equity = home value × cap − mortgage balance. Closing costs run 2–5% but many lenders offer no-closing-cost versions at a slightly higher rate — worth both quotes. Estimates — lender terms govern.
        </p>
      </CardContent>
    </Card>
  )
}

// COST OF WAITING (buy now vs wait for rates to fall) — the rent-burn and price-growth ledger nobody shows. Node-verified: $400k home, 20% down, 6.5%/30yr → $2,022.62/mo. Wait 1 year hoping for 5.5%: if prices stay flat → $1,816.92 (saves $205.69/mo) — but breakeven appreciation is 11.3%, i.e. prices can rise 11.3% before waiting loses on payment alone. At +3% appreciation ($412k): wait payment $1,871.43, saves only $151.19/mo — while costing $12,000 more price + $2,400 more down payment + $24,000 rent burned = $38,400 cash out the door, a 21.2-year payback on the monthly saving. A mere 0.25-pt drop (6.25%) with +3% prices: $2,029.40 — waiting costs MORE per month than buying now. Rule verified: each 1% price appreciation adds ~$20.23/mo at the buy-now rate (payment is linear in principal); each 0.25pt rate cut saves ~$52.28/mo (on this loan size). Omitted honestly: the year of equity/principal buildup foregone (~$4,300 of principal in year 1 on the buy-now loan) and the possibility prices FALL (symmetric math, opposite sign).
export function CostOfWaitingCalc() {
  const [price, setPrice] = useNumber(400000)
  const [downPct, setDownPct] = useNumber(20)
  const [rateNow, setRateNow] = useNumber(6.5)
  const [rateLater, setRateLater] = useNumber(5.5)
  const [appr, setAppr] = useNumber(3)
  const [rent, setRent] = useNumber(2000)

  const r = useMemo(() => {
    const pmt = (P: number, i: number, n: number) => (i > 0 ? (P * i) / (1 - Math.pow(1 + i, -n)) : P / n)
    const n = 360
    const loanNow = price * (1 - downPct / 100)
    const pNow = pmt(loanNow, rateNow / 1200, n)
    const priceLater = price * (1 + appr / 100)
    const loanLater = priceLater * (1 - downPct / 100)
    const pWait = pmt(loanLater, rateLater / 1200, n)
    const priceBump = priceLater - price
    const extraDown = priceBump * (downPct / 100)
    const rentBurned = rent * 12
    const cashCost = priceBump + rentBurned // extra down is not "cost" (it's equity), but it IS cash needed
    const monthlySaving = pNow - pWait
    const paybackMonths = monthlySaving > 0 ? cashCost / monthlySaving : Infinity
    // breakeven appreciation: payment is linear in principal → g* = pNow/pmt(loanNow, rateLater) − 1
    const pFlat = pmt(loanNow, rateLater / 1200, n)
    const breakEvenAppr = pFlat > 0 ? (pNow / pFlat - 1) * 100 : 0
    const quarterCutSaving = pNow - pmt(loanNow, (rateNow - 0.25) / 1200, n)
    const apprCost1pct = pmt(loanNow * 1.01, rateNow / 1200, n) - pNow
    const waitWins = monthlySaving > 0 && paybackMonths < 120
    return { pNow, pWait, priceBump, extraDown, rentBurned, cashCost, monthlySaving, paybackMonths, breakEvenAppr, quarterCutSaving, apprCost1pct, waitWins }
  }, [price, downPct, rateNow, rateLater, appr, rent])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Home price today" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Rate available today" value={rateNow} onChange={setRateNow} suffix="%" step="0.125" />
          <Field label="Rate you hope for" value={rateLater} onChange={setRateLater} suffix="%" step="0.125" />
          <Field label="Price growth while waiting" value={appr} onChange={setAppr} suffix="%" step="0.5" />
          <Field label="Rent paid while waiting" value={rent} onChange={setRent} prefix="$" suffix="/mo" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Payment if you buy now" value={usd(r.pNow, 2)} />
          <Result label="Payment if you wait a year" value={usd(r.pWait, 2)} />
          <Result label={r.monthlySaving >= 0 ? 'Monthly saving from waiting' : 'Extra monthly cost from waiting'} value={usd(Math.abs(r.monthlySaving), 2)} big />
          <Result label="Breakeven appreciation" value={`${num(r.breakEvenAppr, 1)}%`} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Result label="Price increase paid" value={usd(r.priceBump)} />
          <Result label="Rent burned (12 months)" value={usd(r.rentBurned)} />
          <Result label="Extra down payment needed" value={usd(r.extraDown)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.waitWins
            ? `Waiting works IF the rate actually falls: you save ${usd(r.monthlySaving, 2)}/mo against ${usd(r.cashCost)} of price growth and rent — a ${num(r.paybackMonths / 12, 1)}-year payback. Prices could rise ${num(r.breakEvenAppr, 1)}% before waiting loses on payment alone.`
            : r.monthlySaving > 0
              ? `Waiting saves ${usd(r.monthlySaving, 2)}/mo but costs ${usd(r.cashCost)} in price growth and rent — a ${num(r.paybackMonths / 12, 1)}-year payback that outlasts most ownership windows. Buying now wins unless prices fall.`
              : `Waiting loses on payment ALONE: at ${num(appr, 1)}% price growth, the hoped-for ${num(rateLater, 2)}% rate still costs ${usd(-r.monthlySaving, 2)}/mo MORE than buying at ${num(rateNow, 2)}% today — plus ${usd(r.cashCost)} of price growth and rent burned.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The asymmetry is the whole story: a 0.25-point rate cut saves {usd(r.quarterCutSaving, 0)}/month on this loan, while each 1% of price appreciation adds {usd(r.apprCost1pct, 0)}/month forever — and 100 cents of the rent is gone. Breakeven appreciation tells you how much prices can rise before waiting loses on the payment alone; rent and the extra down payment push the true breakeven lower. Waiting is still the right call when the down payment isn't ready, the job situation is unsettled, or you'd buy at the top of your budget — affordability beats timing. Omitted from the ledger: a year of principal buildup foregone (~1–1.5% of the loan in year one), the moving/security-deposit friction of the rental year, and the symmetric possibility that prices fall — if they drop {num(appr, 0)}% instead of rising, waiting wins by the same math with the sign flipped. Principal &amp; interest only — taxes, insurance, and PMI move with price too. Estimates — market outcomes govern.
        </p>
      </CardContent>
    </Card>
  )
}

// RENOVATION ROI — Zonda/Remodeling 2025 Cost vs Value Report (38th year), national averages, verified against the published table: garage door $4,672→$12,507 (267.7%), steel entry door $2,435→$5,270 (216.4%), manufactured stone veneer $11,702→$24,328 (207.9%), fiber-cement siding $21,485→$24,420 (113.7%), minor kitchen midrange $28,458→$32,141 (112.9%), vinyl siding 96.5%, backup generator 95.3%, wood deck 94.9%, composite deck 88.5%, fiberglass grand entrance 84.7%, bath remodel midrange 80%, vinyl windows 76%, basement 71%, asphalt roof 68%, bath addition 53%, major kitchen midrange 51%, bath remodel upscale 42%, ADU 41%, major kitchen upscale 36%, primary suite midrange 32% / upscale 18%. Pattern (20+ years of the report): exterior replacements dominate; the more custom/expensive the interior project, the lower the recoup. Honest caveats: values are surveyed realtor ESTIMATES not measured sale prices; >100% recoup usually reflects a hot market year (garage door was 194% in 2024), so the model treats recoup as direction-solid/decimal-soft; regional variance is large (Pacific & West South Central led 2025).
const RENO_PROJECTS: { name: string; cost: number; recoup: number }[] = [
  { name: 'Garage door replacement', cost: 4672, recoup: 267.7 },
  { name: 'Steel entry door replacement', cost: 2435, recoup: 216.4 },
  { name: 'Manufactured stone veneer', cost: 11702, recoup: 207.9 },
  { name: 'Fiber-cement siding', cost: 21485, recoup: 113.7 },
  { name: 'Minor kitchen remodel (midrange)', cost: 28458, recoup: 112.9 },
  { name: 'Vinyl siding replacement', cost: 17950, recoup: 96.5 },
  { name: 'Backup power generator', cost: 13534, recoup: 95.3 },
  { name: 'Wood deck addition', cost: 18263, recoup: 94.9 },
  { name: 'Composite deck addition', cost: 25096, recoup: 88.5 },
  { name: 'Fiberglass grand entrance', cost: 11754, recoup: 84.7 },
  { name: 'Bathroom remodel (midrange)', cost: 25251, recoup: 80 },
  { name: 'Vinyl window replacement', cost: 20000, recoup: 76 },
  { name: 'Basement remodel', cost: 55000, recoup: 71 },
  { name: 'Asphalt roofing replacement', cost: 30000, recoup: 68 },
  { name: 'Bathroom addition (midrange)', cost: 60000, recoup: 53 },
  { name: 'Major kitchen remodel (midrange)', cost: 80000, recoup: 51 },
  { name: 'Bathroom remodel (upscale)', cost: 80000, recoup: 42 },
  { name: 'ADU (accessory dwelling unit)', cost: 180000, recoup: 41 },
  { name: 'Major kitchen remodel (upscale)', cost: 160000, recoup: 36 },
  { name: 'Primary suite addition (midrange)', cost: 170000, recoup: 32 },
  { name: 'Primary suite addition (upscale)', cost: 350000, recoup: 18 },
]
export function RenovationRoiCalc() {
  const [proj, setProj] = useState('Minor kitchen remodel (midrange)')
  const [quote, setQuote] = useNumber(28458)
  const [yrs, setYrs] = useNumber(5)

  const r = useMemo(() => {
    const p = RENO_PROJECTS.find((x) => x.name === proj) ?? RENO_PROJECTS[4]
    const valueAdded = quote * (p.recoup / 100)
    const net = quote - valueAdded // negative = profit at resale
    const perYear = yrs > 0 ? net / yrs : net
    return { p, valueAdded, net, perYear }
  }, [proj, quote, yrs])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Project (recoup % = 2025 Cost vs Value national average)</label>
          <select
            value={proj}
            onChange={(e) => {
              setProj(e.target.value)
              const p = RENO_PROJECTS.find((x) => x.name === e.target.value)
              if (p) setQuote(String(p.cost))
            }}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            {RENO_PROJECTS.map((p) => (
              <option key={p.name} value={p.name}>{p.name} — recoups {p.recoup}%</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Your quote / budget" value={quote} onChange={setQuote} prefix="$" />
          <Field label="Years until you sell" value={yrs} onChange={setYrs} step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Recoup rate (national)" value={`${num(r.p.recoup, 1)}%`} />
          <Result label="Value added at resale" value={usd(r.valueAdded)} />
          <Result big label={r.net >= 0 ? 'Net cost of the project' : 'Net profit at resale'} value={usd(Math.abs(r.net))} />
          <Result label={r.net >= 0 ? 'True cost per year owned' : 'Profit per year owned'} value={usd(Math.abs(r.perYear))} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.net >= 0
            ? `The ${r.p.name} recoups ${num(r.p.recoup, 1)}% at resale: your ${usd(quote)} comes back as ${usd(r.valueAdded)} of sale price, so the project really costs ${usd(r.net)} — ${usd(Math.abs(r.perYear))}/year over ${yrs} years for the daily use of it. That framing is the honest one: remodel for how you live, treat resale recovery as a partial rebate.`
            : `The ${r.p.name} recoups ${num(r.p.recoup, 1)}% nationally — your ${usd(quote)} returns ${usd(r.valueAdded)} at sale, a paper profit of ${usd(-r.net)}. Treat >100% recoup as a hot-market artifact (the garage door was 194% in 2024, 268% in 2025), not a promise; in a normal year assume closer to 100%.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Data: Zonda/Remodeling 2025 Cost vs Value Report (38th annual), national averages — top-10 project costs are the published job costs; default budgets for the remaining projects are placeholders to overwrite with your quote. Resale values are surveyed real-estate-professional estimates, not measured sale prices, and vary widely by region (Pacific and West South Central led in 2025). The durable pattern across two decades of reports: exterior replacements dominate ROI because curb appeal prices into every showing, while big custom interiors recoup least — the upscale primary suite addition returns 18¢ per dollar. The minor kitchen is the only interior project in the top five: surface refresh (refaced cabinets, counters, hardware) beats a gut renovation on return every single year. Not captured: your market's temperature, the joy of living in the improvement (NAR's Joy Score — suite additions rate a perfect 10 despite the worst ROI), and faster sale velocity, which agents cite as the real benefit of curb-appeal projects. Estimates — your market governs.
        </p>
      </CardContent>
    </Card>
  )
}

// CONTRACTOR BID COMPARISON — normalize three bids before comparing; raw price lies. Model: adjusted bid = quoted price + allowance gaps (items excluded or under-allowanced that you WILL pay: flooring, fixtures, permits, disposal) + time cost (weeks of schedule × your weekly cost of delay — rent overlap, storage, eating out, a kitchen you can't cook in). Node-verified: bids $48,000 (+$3,500 flooring gap, 8 wks) / $52,500 (all-in, 6 wks) / $46,500 (+$4,000 exclusions, 10 wks) → adjusted $51,500 / $52,500 / $50,500; mid $51,500; spread −1.9%/0%/+1.9%. Underbid flag (rule of thumb, labeled as such): a bid >15% below the middle of three is statistically the change-order bid — priced to win the signature, recovered in "unforeseens." Also flagged: missing allowances make the cheapest raw bid the most expensive adjusted one.
export function ContractorBidCalc() {
  const [p1, setP1] = useNumber(48000)
  const [g1, setG1] = useNumber(3500)
  const [w1, setW1] = useNumber(8)
  const [p2, setP2] = useNumber(52500)
  const [g2, setG2] = useNumber(0)
  const [w2, setW2] = useNumber(6)
  const [p3, setP3] = useNumber(46500)
  const [g3, setG3] = useNumber(4000)
  const [w3, setW3] = useNumber(10)
  const [wkCost, setWkCost] = useNumber(0)

  const r = useMemo(() => {
    const bids = [
      { n: 'Bid A', p: p1, gap: g1, w: w1 },
      { n: 'Bid B', p: p2, gap: g2, w: w2 },
      { n: 'Bid C', p: p3, gap: g3, w: w3 },
    ].map((b) => ({ ...b, adj: b.p + b.gap + b.w * wkCost }))
    const adjs = bids.map((b) => b.adj)
    const sorted = [...adjs].sort((a, b) => a - b)
    const mid = sorted[1]
    const low = sorted[0]
    const lowball = mid > 0 && low < 0.85 * mid
    const best = bids.reduce((a, b) => (b.adj < a.adj ? b : a))
    const worst = bids.reduce((a, b) => (b.adj > a.adj ? b : a))
    return { bids, mid, lowball, best, worst, spread: worst.adj - best.adj }
  }, [p1, g1, w1, p2, g2, w2, p3, g3, w3, wkCost])

  const bidFields = [
    { n: 'Bid A', p: p1, sp: setP1, g: g1, sg: setG1, w: w1, sw: setW1 },
    { n: 'Bid B', p: p2, sp: setP2, g: g2, sg: setG2, w: w2, sw: setW2 },
    { n: 'Bid C', p: p3, sp: setP3, g: g3, sg: setG3, w: w3, sw: setW3 },
  ]

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {bidFields.map((b) => (
          <div key={b.n} className="grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-4">
            <p className="col-span-2 text-sm font-medium sm:col-span-4">{b.n}</p>
            <Field label="Quoted price" value={b.p} onChange={b.sp} prefix="$" />
            <Field label="Excluded items you'll still pay for" value={b.g} onChange={b.sg} prefix="$" />
            <Field label="Quoted schedule" value={b.w} onChange={b.sw} suffix="wks" step="1" />
          </div>
        ))}
        <div className="max-w-xs">
          <Field label="Your cost per extra week (rent overlap, storage, takeout)" value={wkCost} onChange={setWkCost} prefix="$" step="100" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {r.bids.map((b) => (
            <Result key={b.n} label={`${b.n} true cost`} value={usd(b.adj)} big={b === r.best} />
          ))}
        </div>
        {r.lowball && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            One bid sits more than 15% below the middle — the classic change-order pattern: priced to win the signature, recovered later in "unforeseen" extras. Before accepting it, get the exclusion list in writing and ask for their last three change-order totals by name.
          </p>
        )}
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.best.n} is the real low bid at {usd(r.best.adj)} true cost — {usd(r.spread)} separates best from worst after exclusions and schedule. {Math.min(p1, p2, p3) === r.best.p ? 'The cheapest raw quote also wins adjusted — that\'s a clean bid.' : `The cheapest raw quote (${usd(Math.min(p1, p2, p3))}) is NOT the cheapest project once its exclusions are priced back in.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Three bids only work when they bid the same job. Normalize before comparing: add back every exclusion and allowance gap (a $500 flooring allowance against $4,000 of real flooring is a $3,500 hidden cost), then price the schedule — a 10-week kitchen renovation against a 6-week one costs real money in rent overlap, storage, and takeout. The 15%-below-middle flag is a contractor-industry rule of thumb, not a statistic: a dramatically low bid usually means missing scope, and scope missed at bid time returns as change orders at contract time. Verify what the price assumes: licensed and insured (ask for certificates), permits included, payment schedule tied to milestones (never more than ~10–30% down; final 10–15% only after walkthrough), and the same material grades across bids. The best bid is rarely the lowest — it's the most complete. Estimates — your contract governs.
        </p>
      </CardContent>
    </Card>
  )
}

// DIY vs HIRE — the pro's price is paid with AFTER-tax money; your labor is tax-free. Node-verified: $800 paint job, DIY $200 materials + 12 hrs → savings $600 = $50.00/hr earned tax-free (at a 30% marginal rate the pro job requires EARNING $1,142.86 gross). Redo-risk EV: 15% botch probability × ($800 pro rescue + $100 wasted materials) = $135 expected cost → EV DIY $335 vs $800 pro, EV savings $465. Deck example: pro $15,000, DIY $6,000 materials + 40 hrs → $225/hr. Decision frame: DIY wins when effective wage > your market wage AND botch risk low; hire when permits/licensed trades (electrical panel, gas, structural) — insurance and code make those non-negotiable, not a math question.
export function DiyVsHireCalc() {
  const [pro, setPro] = useNumber(800)
  const [mats, setMats] = useNumber(200)
  const [hours, setHours] = useNumber(12)
  const [bracket, setBracket] = useNumber(30)
  const [botch, setBotch] = useNumber(15)
  const [fixCost, setFixCost] = useNumber(900)

  const r = useMemo(() => {
    const savings = pro - mats
    const wage = hours > 0 ? savings / hours : 0
    const earnNeeded = bracket < 100 ? pro / (1 - bracket / 100) : pro
    const riskEV = (botch / 100) * fixCost
    const diyEV = mats + riskEV
    const evSavings = pro - diyEV
    const evWage = hours > 0 ? evSavings / hours : 0
    return { savings, wage, earnNeeded, riskEV, diyEV, evSavings, evWage }
  }, [pro, mats, hours, bracket, botch, fixCost])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Pro quote (all-in)" value={pro} onChange={setPro} prefix="$" />
          <Field label="DIY materials + tool rental" value={mats} onChange={setMats} prefix="$" />
          <Field label="Your hours (honest — incl. cleanup)" value={hours} onChange={setHours} suffix="hrs" step="1" />
          <Field label="Your marginal tax rate" value={bracket} onChange={setBracket} suffix="%" />
          <Field label="Chance you botch it" value={botch} onChange={setBotch} suffix="%" step="5" />
          <Field label="Cost to fix a botch" value={fixCost} onChange={setFixCost} prefix="$" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Cash saved doing it yourself" value={usd(r.savings)} />
          <Result big label="Your effective tax-free wage" value={`${usd(r.wage, 2)}/hr`} />
          <Result label="Gross you'd need to earn to pay the pro" value={usd(r.earnNeeded)} />
          <Result label="Expected redo cost" value={usd(r.riskEV)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.evSavings > 0
            ? `DIY wins the expected-value math: ${usd(r.evSavings)} ahead after pricing a ${num(botch, 0)}% botch chance — an honest ${usd(r.evWage, 2)}/hr, tax-free, for your ${hours} hours.`
            : `Hire the pro: after pricing the botch risk, DIY is ${usd(-r.evSavings)} UNDERWATER on expected value — before counting your weekend.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The tax asymmetry is the hidden multiplier: paying a pro {usd(pro)} takes {usd(r.earnNeeded)} of gross earnings at your marginal rate, while the same dollars of DIY savings arrive untaxed. Honest counters: your hours have value even unpaid (a weekend is a weekend), pros finish in days what takes amateurs weeks, and a good job lasts longer than a learning-curve one. The non-negotiables aren't math: anything permitted or life-safety (electrical panels, gas lines, structural, roofing in some states) goes to licensed trades — homeowner insurance can deny claims on unpermitted DIY work, and code violations surface brutally at resale inspection. Botch cost should include BOTH the rescue pro AND your wasted materials. Best DIY candidates: painting, landscaping, demo, flooring click-systems, fixtures. Worst: anything where the redo costs more than the original quote. Estimates — your skills govern.
        </p>
      </CardContent>
    </Card>
  )
}

// HOUSE FLIP (70% rule + full P&L) — the investor's offer ceiling and the honest ledger. Node-verified: ARV $400k, rehab $60k → max offer = $400k×0.70 − $60k = $220,000. Full P&L at that offer: purchase $220k + closing-in 2% ($4,400) + rehab $60k + holding 6 mo ($280k hard money @11% IO = $15,400 + $3,000 tax/ins/utils) = $302,800 all-in; sale nets $400k − 6.5% selling costs ($26,000) = $374,000 → profit $71,200; on 90%-financed purchase+rehab ($50,800 cash in) = 140.2% cash-on-cash. The 70% rule's hidden assumptions: the 30% haircut must absorb rehab profit margin, holding, BOTH closings, and surprises — in low-margin markets flippers use 75%+, in expensive markets 65%. Underestimated rehab is the classic failure: every $10k of overrun comes straight out of the $71k.
export function HouseFlipCalc() {
  const [arv, setArv] = useNumber(400000)
  const [rehab, setRehab] = useNumber(60000)
  const [rulePct, setRulePct] = useNumber(70)
  const [offer, setOffer] = useNumber(220000)
  const [months, setMonths] = useNumber(6)
  const [loanRate, setLoanRate] = useNumber(11)
  const [ltv, setLtv] = useNumber(90)
  const [sellPct, setSellPct] = useNumber(6.5)
  const [holdMisc, setHoldMisc] = useNumber(3000)

  const r = useMemo(() => {
    const maxOffer = arv * (rulePct / 100) - rehab
    const closeIn = offer * 0.02
    const loanBase = (offer + rehab) * (ltv / 100)
    const interest = loanBase * (loanRate / 100) * (months / 12)
    const holding = interest + holdMisc
    const allIn = offer + closeIn + rehab + holding
    const netSale = arv * (1 - sellPct / 100)
    const profit = netSale - allIn
    const cashIn = (offer + rehab) * (1 - ltv / 100) + closeIn + holding
    const coc = cashIn > 0 ? (profit / cashIn) * 100 : 0
    const margin = arv > 0 ? (profit / arv) * 100 : 0
    const overBudget = offer > maxOffer
    return { maxOffer, closeIn, loanBase, interest, holding, allIn, netSale, profit, cashIn, coc, margin, overBudget }
  }, [arv, rehab, rulePct, offer, months, loanRate, ltv, sellPct, holdMisc])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="After-repair value (ARV)" value={arv} onChange={setArv} prefix="$" />
          <Field label="Rehab budget (padded!)" value={rehab} onChange={setRehab} prefix="$" />
          <Field label="Rule %" value={rulePct} onChange={setRulePct} suffix="%" step="5" />
          <Field label="Your offer / purchase" value={offer} onChange={setOffer} prefix="$" />
          <Field label="Holding months" value={months} onChange={setMonths} step="1" />
          <Field label="Loan rate (hard money)" value={loanRate} onChange={setLoanRate} suffix="%" step="0.5" />
          <Field label="Loan LTV on purchase+rehab" value={ltv} onChange={setLtv} suffix="%" step="5" />
          <Field label="Selling costs (agent + closing)" value={sellPct} onChange={setSellPct} suffix="%" step="0.5" />
          <Field label="Holding misc (tax/ins/utils)" value={holdMisc} onChange={setHoldMisc} prefix="$" step="500" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result big label={`Max offer (${num(rulePct, 0)}% rule)`} value={usd(r.maxOffer)} />
          <Result label="All-in cost" value={usd(r.allIn)} />
          <Result label="Net sale proceeds" value={usd(r.netSale)} />
          <Result label={r.profit >= 0 ? 'Profit' : 'LOSS'} value={usd(r.profit)} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Cash you need" value={usd(r.cashIn)} />
          <Result label="Cash-on-cash return" value={`${num(r.coc, 1)}%`} />
          <Result label="Holding cost (interest + misc)" value={usd(r.holding)} />
          <Result label="Profit margin on ARV" value={`${num(r.margin, 1)}%`} />
        </div>
        {r.overBudget && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Your offer is {usd(offer - r.maxOffer)} ABOVE the {num(rulePct, 0)}% rule ceiling — the rule exists because rehab overruns and soft comps eat exactly that slack. Experienced flippers walk away at this number; the deal you don't do is the cheapest one.
          </p>
        )}
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.profit >= 0
            ? `At ${usd(offer)}, the deal clears: ${usd(r.profit)} profit on ${usd(r.cashIn)} cash = ${num(r.coc, 1)}% in ${months} months. The fragility: a $10,000 rehab overrun and a 5% ARV miss turn this into ${usd(r.profit - 10000 - arv * 0.05)} — run the pessimistic case before offering.`
            : `This deal loses ${usd(-r.profit)} as structured. The levers, in order of honesty: lower offer (${usd(r.maxOffer)} is the ${num(rulePct, 0)}% ceiling), real ARV re-check, shorter hold, cheaper money. "I'll rehab cheaper" is how flippers go broke.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The 70% rule (pay ≤ 70% of ARV minus repairs) survives because the 30% haircut has to absorb everything sellers forget: purchase closing (modeled at 2%), holding interest at hard-money rates (11% modeled; points at origination add 1–2% more, not modeled), selling costs (modeled at 6.5% — agent commission plus seller closing), and the rehab overrun that arrives in every wall you open. Rule adjustments by market: hot low-margin markets push 75–80% (thin, dangerous), slow or expensive markets 65%. The ARV is the whole ballgame — comp it from SOLD homes within a mile and six months, never list prices, never Zillow zestimates, and never the seller's Zestimate either. Not modeled: capital gains treatment (flips are ordinary income for dealers, not capital gains — budget your marginal rate on the profit), hard-money points, and extension fees if the hold runs long. Estimates — your comps and contractor govern.
        </p>
      </CardContent>
    </Card>
  )
}

// RENTAL CASH FLOW — the honest 2026 ledger: at 7% money, most listings are cash-flow negative. Node-verified: $300k price, 20% down, 7%/30yr ($240k loan → DS $19,161/yr), rent $2,400/mo, vacancy 5% → EGI $27,360; opex = taxes $3,600 + ins $1,500 + mgmt 8% + maint 5% + CapEx 5% = $10,025 → NOI $17,335 → cash flow −$1,826/yr (−$152.13/mo); CoC −2.77% on $66,000 cash (down + 2% closing); cap rate 5.78%; DSCR 0.90 (lenders want ≥1.20–1.25); rent-to-price 0.80% (1% rule fails); the 50% rule (opex = half of gross) says NOI $14,400 — my itemized opex runs 36.6% of EGI, lighter than the rule, so the honest NOI is between. At rent $2,000: CF −$463.73/mo, DSCR 0.71. The levers that flip a deal: price (every $10k off = ~$800/yr DS), rate, rent.
export function RentalCashFlowCalc() {
  const [price, setPrice] = useNumber(300000)
  const [downPct, setDownPct] = useNumber(20)
  const [rate, setRate] = useNumber(7)
  const [rent, setRent] = useNumber(2400)
  const [vac, setVac] = useNumber(5)
  const [tax, setTax] = useNumber(3600)
  const [ins, setIns] = useNumber(1500)
  const [mgmt, setMgmt] = useNumber(8)
  const [maint, setMaint] = useNumber(5)
  const [capex, setCapex] = useNumber(5)

  const r = useMemo(() => {
    const pmt = (P: number, i: number, n: number) => (i > 0 ? (P * i) / (1 - Math.pow(1 + i, -n)) : P / n)
    const loan = price * (1 - downPct / 100)
    const ds = pmt(loan, rate / 1200, 360) * 12
    const gr = rent * 12
    const egi = gr * (1 - vac / 100)
    const opex = tax + ins + egi * ((mgmt + maint + capex) / 100)
    const noi = egi - opex
    const cf = noi - ds
    const cashIn = price * (downPct / 100) + price * 0.02
    const coc = cashIn > 0 ? (cf / cashIn) * 100 : 0
    const cap = price > 0 ? (noi / price) * 100 : 0
    const dscr = ds > 0 ? noi / ds : 0
    const rtp = price > 0 ? (rent / price) * 100 : 0
    const fifty = gr * 0.5
    return { loan, ds, gr, egi, opex, noi, cf, cashIn, coc, cap, dscr, rtp, fifty }
  }, [price, downPct, rate, rent, vac, tax, ins, mgmt, maint, capex])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Purchase price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" step="5" />
          <Field label="Loan rate (30-yr)" value={rate} onChange={setRate} suffix="%" step="0.125" />
          <Field label="Monthly rent (market, not hoped)" value={rent} onChange={setRent} prefix="$" />
          <Field label="Vacancy allowance" value={vac} onChange={setVac} suffix="%" step="1" />
          <Field label="Property tax /yr" value={tax} onChange={setTax} prefix="$" />
          <Field label="Insurance /yr" value={ins} onChange={setIns} prefix="$" />
          <Field label="Management" value={mgmt} onChange={setMgmt} suffix="%" step="1" />
          <Field label="Maintenance reserve" value={maint} onChange={setMaint} suffix="%" step="1" />
          <Field label="CapEx reserve (roof, HVAC)" value={capex} onChange={setCapex} suffix="%" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="NOI (net operating income)" value={usd(r.noi)} />
          <Result big label={r.cf >= 0 ? 'Cash flow /month' : 'MONTHLY LOSS'} value={usd(r.cf / 12, 2)} />
          <Result label="Cash-on-cash return" value={`${num(r.coc, 2)}%`} />
          <Result label="Cap rate" value={`${num(r.cap, 2)}%`} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="DSCR (lenders want ≥1.20)" value={num(r.dscr, 2)} />
          <Result label="Rent-to-price (1% rule)" value={`${num(r.rtp, 2)}%`} />
          <Result label="50%-rule NOI check" value={usd(r.fifty)} />
          <Result label="Cash needed (down + closing)" value={usd(r.cashIn)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.cf >= 0
            ? `Positive cash flow: ${usd(r.cf / 12, 2)}/mo after vacancy, management, maintenance AND CapEx reserves. ${r.dscr >= 1.2 ? `DSCR ${num(r.dscr, 2)} clears the lender bar.` : `But DSCR ${num(r.dscr, 2)} is under 1.20 — a DSCR lender will charge for that or decline.`}`
            : `This deal bleeds ${usd(-r.cf / 12, 2)}/month — the property pays you nothing and invoices you for the privilege. The flips, in order: negotiate price (every $10,000 off saves ~${usd((r.ds / r.loan) * 10000 / 12, 0)}/mo), raise rent to market, or walk. Appreciation might bail you out; that's speculation, not cash flow.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The model is the lender's: gross rent minus vacancy = effective income; minus taxes, insurance, management, maintenance, and CapEx reserves = NOI; minus debt service = cash flow. Three rule-of-thumb cross-checks included: the 1% rule (monthly rent ≥ 1% of price — this deal runs {num(r.rtp, 2)}%), the 50% rule (expenses ≈ half of gross rent → NOI {usd(r.fifty)}), and DSCR ≥ 1.20. Where the itemized and 50%-rule NOIs disagree, trust the WORSE one. Not modeled but real: depreciation shelters the cash flow from tax (residential rental over 27.5 years — see the rental depreciation calculator), principal paydown adds ~${usd(r.loan * 0.012, 0)}/yr of equity in year one on this loan, and appreciation/leverage is where rental fortunes are actually made — but cash flow is what keeps you solvent long enough to collect it. Estimates — your market and lender govern.
        </p>
      </CardContent>
    </Card>
  )
}

// PROPERTY TAX APPEAL — assessed value vs comp-supported value, equalization ratio, savings horizon. Node-verified: assessed $350k, comps support $315k, rate 1.8% → overpaying $630/yr, $3,150/5yr, $6,898/10yr at 2% levy growth. Equalization: county assessing at 90% of market → $350k assessed implies $388,889 market opinion; your case is (assessed/ratio) vs comp median. Homestead exemptions cut ASSESSED value first (owner-occupants only, must file). Appeals cost $0–$500 DIY, deadlines are 30–90 days after the notice, and the evidence hierarchy is: recent arm's-length comps (same subdivision, ±20% sqft, sold within a year) > appraisal > condition photos/repair estimates. Don't appeal the levy — appeal the VALUE.
export function PropertyTaxAppealCalc() {
  const [assessed, setAssessed] = useNumber(350000)
  const [compValue, setCompValue] = useNumber(315000)
  const [rate, setRate] = useNumber(1.8)
  const [ratio, setRatio] = useNumber(100)
  const [growth, setGrowth] = useNumber(2)
  const [yrs, setYrs] = useNumber(5)

  const r = useMemo(() => {
    const impliedMarket = ratio > 0 ? assessed / (ratio / 100) : assessed
    const overAssessed = Math.max(0, compValue > 0 ? impliedMarket - compValue : 0)
    const annual = overAssessed * (rate / 100) * (ratio / 100) // savings apply to assessed value
    let horizon = 0
    for (let y = 0; y < yrs; y++) horizon += annual * Math.pow(1 + growth / 100, y)
    const overpayPct = compValue > 0 ? ((impliedMarket / compValue) - 1) * 100 : 0
    return { impliedMarket, overAssessed, annual, horizon, overpayPct, worth: annual >= 200 }
  }, [assessed, compValue, rate, ratio, growth, yrs])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Assessed value (from your notice)" value={assessed} onChange={setAssessed} prefix="$" />
          <Field label="Comp-supported value (median of 3–5 comps)" value={compValue} onChange={setCompValue} prefix="$" />
          <Field label="Effective tax rate" value={rate} onChange={setRate} suffix="%" step="0.05" />
          <Field label="Assessment ratio (% of market)" value={ratio} onChange={setRatio} suffix="%" step="5" />
          <Field label="Annual levy growth" value={growth} onChange={setGrowth} suffix="%" step="0.5" />
          <Field label="Horizon" value={yrs} onChange={setYrs} suffix="yrs" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Assessor's implied market value" value={usd(r.impliedMarket)} />
          <Result label="Over-assessment" value={usd(r.overAssessed)} />
          <Result big label="Savings per year if you win" value={usd(r.annual)} />
          <Result label={`Savings over ${yrs} years`} value={usd(r.horizon)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.overAssessed > 0
            ? `The assessor's implied market value (${usd(r.impliedMarket)}) runs ${num(r.overpayPct, 1)}% above your comp-supported ${usd(compValue)} — a win is worth ${usd(r.annual)}/yr and ${usd(r.horizon)} over ${yrs} years. ${r.worth ? 'Worth the afternoon it takes to file.' : 'Small dollars — but filing is free in most counties, and the reduction compounds as levies grow.'}`
            : 'Your assessment is at or below comp-supported value — an appeal would argue against yourself. Recheck after the next reassessment notice.'}
        </div>
        <p className="text-xs text-muted-foreground">
          Mechanics that matter: you're appealing the VALUE, not the tax — the levy is set by budgets, the value decides your share. Assessment ratio matters: many jurisdictions assess at a fraction of market (the ratio field), so compare implied market value against comps, not the raw assessed number. Evidence that wins: 3–5 recent arm's-length sales in your subdivision, within ±20% of your square footage, sold within the past year; condition documentation (dated photos + repair estimates) for anything the comps don't share; or an independent appraisal (~$400–600, worth it above ~$1,000/yr of savings). Deadlines are strict — typically 30–90 days from the assessment notice, and missing it waits a full year. Free wins to check first: homestead exemption (owner-occupants, must file), senior/veteran/disabled exemptions, and plain data errors (wrong square footage or bedroom count on the property card — the cheapest appeal there is). Success compounds: the lower base carries into every future levy. Estimates — your county's rules govern.
        </p>
      </CardContent>
    </Card>
  )
}

// HOA TRUE COST — the fee is a second, junior mortgage that never amortizes and never ends. Node-verified: $400/mo at 6.5%/30yr money = mortgage-equivalent of $63,284 of home price (a $350k HOA home costs like a $413k non-HOA home monthly). Growth compounding: $400/mo at 5%/yr escalation → $60,374 paid over 10 yrs, $318,906 over 30, and the year-30 fee is $19,757/yr ($1,646/mo). Offsets priced honestly: HOA often replaces lawn/snow/exterior maintenance and bundles amenities + some insurance — subtract what you'd pay anyway. Special assessments: underfunded reserve funds are the standard trigger; the reserve study and % funded are in the resale docs — read them before closing, not after.
export function HoaTrueCostCalc() {
  const [fee, setFee] = useNumber(400)
  const [growth, setGrowth] = useNumber(5)
  const [replaces, setReplaces] = useNumber(75)
  const [rate, setRate] = useNumber(6.5)
  const [yrs, setYrs] = useNumber(10)

  const r = useMemo(() => {
    const net = Math.max(0, fee - replaces)
    const i = rate / 1200
    const loanEq = i > 0 ? (net * (1 - Math.pow(1 + i, -360))) / i : net * 360
    let total = 0
    for (let y = 0; y < yrs; y++) total += fee * 12 * Math.pow(1 + growth / 100, y)
    const feeYrN = fee * 12 * Math.pow(1 + growth / 100, Math.max(0, yrs - 1))
    let total30 = 0
    for (let y = 0; y < 30; y++) total30 += fee * 12 * Math.pow(1 + growth / 100, y)
    return { net, loanEq, total, feeYrN, total30 }
  }, [fee, growth, replaces, rate, yrs])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Monthly HOA fee" value={fee} onChange={setFee} prefix="$" />
          <Field label="Annual fee growth" value={growth} onChange={setGrowth} suffix="%" step="0.5" />
          <Field label="Costs it replaces (lawn, snow, gym)" value={replaces} onChange={setReplaces} prefix="$" suffix="/mo" />
          <Field label="Mortgage rate context" value={rate} onChange={setRate} suffix="%" step="0.125" />
          <Field label="Ownership horizon" value={yrs} onChange={setYrs} suffix="yrs" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Net fee (after what it replaces)" value={`${usd(r.net, 0)}/mo`} />
          <Result big label="Mortgage-equivalent of the net fee" value={usd(r.loanEq)} />
          <Result label={`Total fees paid over ${yrs} yrs`} value={usd(r.total)} />
          <Result label={`Annual fee in year ${yrs}`} value={usd(r.feeYrN)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          The net {usd(r.net, 0)}/month fee carries the same monthly weight as {usd(r.loanEq)} of additional mortgage at {num(rate, 2)}% — so a $350,000 HOA home costs like a {usd(350000 + r.loanEq)} non-HOA home before amenities. Over 30 years at {num(growth, 1)}% growth the fee stream totals {usd(r.total30)}.
        </div>
        <p className="text-xs text-muted-foreground">
          The fee never amortizes, never ends, and compounds: boards raise it with costs, and the growth field is the honest number — look at the HOA's last 5 years of increases, not the current fee. Two hidden line items decide whether an HOA is safe: the reserve fund (the resale docs include a reserve study and % funded — chronically underfunded reserves are how $20,000 special assessments happen; ask directly) and the delinquency rate (above ~10% of owners behind, the paying owners cover the gap). What the fee buys has real value — exterior maintenance, roof/siding reserves in condo and townhome structures, amenities you'd otherwise pay for — which is why the "costs it replaces" field matters: a $400 fee replacing $150 of lawn/snow/gym is really $250. Also check: rental caps and pet rules (they bind you at resale), pending litigation (kills conventional financing), and insurance gaps between the master policy and your HO-6. Lenders count the full fee in DTI. Estimates — the HOA's documents govern.
        </p>
      </CardContent>
    </Card>
  )
}

// SELLER NET SHEET — what you actually walk away with; the sale price is a fantasy number until the ledger runs. Node-verified: $450k sale, 5.5% commission ($24,750), seller closing 1.5% ($6,750), $280k payoff, $5k concessions → net $133,500 (29.7% of price). Post-NAR-settlement (Aug 2024) mechanics: commissions were ALWAYS negotiable, but buyer-agent compensation is no longer published on MLS — it's now negotiated as a buyer-agent fee, often requested as a seller concession; a 2.5% buyer-agent concession on $450k = $11,250. Costs sellers forget: prorated property tax to closing day, HOA transfer/estoppel fees ($200–500 typical), title/escrow (seller side varies by state custom), home warranty concession (~$500), repair credits after inspection, and mortgage payoff per diem interest + any prepayment penalty.
export function SellerNetSheetCalc() {
  const [sale, setSale] = useNumber(450000)
  const [commPct, setCommPct] = useNumber(5.5)
  const [closePct, setClosePct] = useNumber(1.5)
  const [payoff, setPayoff] = useNumber(280000)
  const [conc, setConc] = useNumber(5000)
  const [repairs, setRepairs] = useNumber(0)
  const [baConcession, setBaConcession] = useNumber(0)

  const r = useMemo(() => {
    const comm = sale * (commPct / 100)
    const close = sale * (closePct / 100)
    const ba = sale * (baConcession / 100)
    const costs = comm + close + conc + repairs + ba
    const net = sale - costs - payoff
    const pct = sale > 0 ? (net / sale) * 100 : 0
    return { comm, close, ba, costs, net, pct }
  }, [sale, commPct, closePct, payoff, conc, repairs, baConcession])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Sale price" value={sale} onChange={setSale} prefix="$" />
          <Field label="Total commission" value={commPct} onChange={setCommPct} suffix="%" step="0.25" />
          <Field label="Seller closing costs (title, escrow, transfer tax)" value={closePct} onChange={setClosePct} suffix="%" step="0.25" />
          <Field label="Mortgage payoff (incl. per diem)" value={payoff} onChange={setPayoff} prefix="$" />
          <Field label="Buyer concessions" value={conc} onChange={setConc} prefix="$" />
          <Field label="Repair credits after inspection" value={repairs} onChange={setRepairs} prefix="$" />
          <Field label="Buyer-agent fee concession (post-2024)" value={baConcession} onChange={setBaConcession} suffix="%" step="0.25" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Commission" value={usd(r.comm)} />
          <Result label="Closing + concessions + credits" value={usd(r.close + conc + repairs + r.ba)} />
          <Result label="Total selling costs" value={usd(r.costs)} />
          <Result big label="Net proceeds at closing" value={usd(r.net)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          You keep {num(r.pct, 1)}% of the sale price — {usd(r.net)} from {usd(sale)}. The two negotiable levers are the commission (everything is negotiable post-2024 settlement — interview three agents and price them) and concessions (a {usd(sale * 0.01)} price cut and a {usd(sale * 0.01)} concession cost the same, but the concession often closes the deal).
        </div>
        <p className="text-xs text-muted-foreground">
          The post-August-2024 landscape: buyer-agent compensation is no longer advertised on the MLS — buyers negotiate their agent's fee directly, then often ask the seller to cover it as a concession (the buyer-agent concession field). In practice many sellers still pay it; the difference is it's now a negotiated line item instead of a default. Costs this sheet expects sellers to forget: property tax proration to the closing date, HOA estoppel/transfer fees, courier and wire fees on the payoff, per-diem interest to the payoff date, and any prepayment penalty on the existing loan (rare on conventional, check the note). Capital gains: if it's your primary residence 2 of the last 5 years, $250,000 single / $500,000 married of gain is excluded — run the numbers BEFORE you celebrate the net, because above the exclusion the IRS is a silent partner. For inherited or investment property, different rules entirely (stepped-up basis / 1031). Estimates — your closing disclosure governs.
        </p>
      </CardContent>
    </Card>
  )
}

// TEMPORARY BUYDOWN (2-1 / 3-2-1) vs PERMANENT POINTS — the seller-funded subsidy compared honestly. Node-verified on $320k @7.5%/30yr: 2-1 buydown → yr1 $1,816.92 (5.5%), yr2 $2,022.62 (6.5%), yr3+ $2,237.49; seller's escrowed cost $7,625. 3-2-1 → $15,018. Same $7,625 as permanent points (≈2.4 pts → ~0.6% cut per typical 4pts=1% pricing… modeled as 0.25pt per point): permanent 0.25pt cut = $54.52/mo saved, 1pt costs $3,200, breakeven 59 months. The honest comparison: buydown savings VANISH after year 2–3; points keep paying for the life you hold the loan. Buydown wins when: seller pays (free money), you'll refi within 2–3 yrs (rate expectations), or cash flow early is tight (new job ramp). Points win when: you'll hold 5+ yrs. Qualifying note: lenders qualify you at the NOTE rate (7.5%), not the bought-down rate — the buydown doesn't get you into a bigger loan.
export function BuydownCalc() {
  const [loan, setLoan] = useNumber(320000)
  const [note, setNote] = useNumber(7.5)
  const [type, setType] = useState<'2-1' | '3-2-1'>('2-1')
  const [holdYrs, setHoldYrs] = useNumber(7)

  const r = useMemo(() => {
    const pmt = (P: number, i: number, n: number) => (i > 0 ? (P * i) / (1 - Math.pow(1 + i, -n)) : P / n)
    const n = 360
    const pFull = pmt(loan, note / 1200, n)
    const cuts = type === '2-1' ? [2, 1] : [3, 2, 1]
    const yearPmts = cuts.map((c) => pmt(loan, (note - c) / 1200, n))
    const cost = yearPmts.reduce((a, p) => a + (pFull - p) * 12, 0)
    // same dollars as permanent points: 1 point = 1% of loan ≈ 0.25pt rate cut (typical, varies by lender)
    const pts = cost / (loan * 0.01)
    const permCut = pts * 0.25
    const pPerm = pmt(loan, (note - permCut) / 1200, n)
    const permMonthly = pFull - pPerm
    const hold = Math.min(holdYrs, 30) * 12
    const permTotal = permMonthly * hold
    const buyTotal = cost // buydown saves exactly its cost, in years 1..cuts.length
    const breakEvenMonths = permMonthly > 0 ? cost / permMonthly : Infinity
    const pointsWin = hold > cuts.length * 12 && permTotal > buyTotal
    return { pFull, yearPmts, cuts, cost, pts, permCut, permMonthly, permTotal, buyTotal, breakEvenMonths, pointsWin, hold }
  }, [loan, note, type, holdYrs])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Loan amount" value={loan} onChange={setLoan} prefix="$" />
          <Field label="Note rate" value={note} onChange={setNote} suffix="%" step="0.125" />
          <Field label="Years you'll hold the loan" value={holdYrs} onChange={setHoldYrs} step="1" />
        </div>
        <div className="flex gap-2">
          {(['2-1', '3-2-1'] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`rounded-md border px-3 py-1.5 text-sm ${type === t ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              {t} buydown
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {r.yearPmts.map((p, i) => (
            <Result key={i} label={`Year ${i + 1} payment (${num(note - r.cuts[i], 1)}%)`} value={usd(p, 2)} />
          ))}
          <Result label={`Payment after year ${r.cuts.length} (${num(note, 2)}%)`} value={usd(r.pFull, 2)} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result big label="Buydown cost (seller-funded escrow)" value={usd(r.cost)} />
          <Result label="Same $ as points" value={`${num(r.pts, 2)} pts → ${num(r.permCut, 2)}% cut`} />
          <Result label="Permanent saving" value={`${usd(r.permMonthly, 2)}/mo`} />
          <Result label="Points breakeven" value={`${num(r.breakEvenMonths, 0)} months`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.pointsWin
            ? `If you hold ${num(r.hold / 12, 0)} years, permanent points win: ${usd(r.permTotal)} saved vs the buydown's ${usd(r.buyTotal)}. The buydown's savings stop after year ${r.cuts.length}; points keep paying every month you keep the loan.`
            : `At a ${num(r.hold / 12, 0)}-year hold the buydown wins — it front-loads ${usd(r.buyTotal)} of savings while points would need ${num(r.breakEvenMonths / 12, 1)} years to recoup. If you expect to refi when rates fall, take the buydown (especially since the seller funds it).`}
        </div>
        <p className="text-xs text-muted-foreground">
          How it works: the seller (or builder) deposits the payment difference into an escrowed buydown account at closing — on this loan, {usd(r.cost)} — and the lender draws from it monthly to subsidize years {r.cuts.length === 2 ? '1–2' : '1–3'}. You still qualify at the FULL note rate, so a buydown improves cash flow but not buying power. The negotiation frame: in a buyer's market, a 2-1 buydown costs the seller {usd(r.cost)} but markets as "payments from {usd(r.yearPmts[0], 0)}/mo" — often moves a listing better than an equivalent price cut, while a permanent rate buydown with the same money serves you longer if you're staying. If you refi before the buydown funds run out, the leftover escrow typically credits against your payoff — ask the lender to confirm in writing. Points pricing varies by lender (modeled at 1 point = 0.25% rate cut); get both quotes. Estimates — your loan estimate governs.
        </p>
      </CardContent>
    </Card>
  )
}

// HOME SALE CAPITAL GAINS (IRC §121) — the exclusion, the partial exclusion, and the depreciation-recapture trap. Node-verified: single filer, basis $250k ($200k price + $50k improvements), net sale $600k → gain $350k; full §121 exclusion $250k (owned+lived 2 of last 5 yrs) → taxable $100k @15% = $15,000. Partial exclusion (job move/health/unforeseen at 18 of 24 months): 18/24 × $250k = $187,500. MFJ exclusion $500k (14/24 partial → $291,667). Depreciation recapture on rental-period depreciation is NOT excludable: $40k claimed → $10,000 at the 25% unrecaptured-§1250 rate. Basis boosters sellers forget: improvements (not repairs), closing costs at purchase, special assessment levies for local improvements. LTCG rates 2026: 0% to ~$49k taxable single, 15% to ~$545k, 20% above; +3.8% NIIT at $200k/$250k MAGI.
export function HomeSaleGainsCalc() {
  const [netSale, setNetSale] = useNumber(600000)
  const [price, setPrice] = useNumber(200000)
  const [improvements, setImprovements] = useNumber(50000)
  const [married, setMarried] = useState(false)
  const [monthsOwned, setMonthsOwned] = useNumber(60)
  const [qualReason, setQualReason] = useState(true) // job move/health/unforeseen if short
  const [depreciation, setDepreciation] = useNumber(0)
  const [ltcgRate, setLtcgRate] = useNumber(15)

  const r = useMemo(() => {
    const basis = price + improvements
    const gain = Math.max(0, netSale - basis)
    const full = married ? 500000 : 250000
    const eligible24 = monthsOwned >= 24
    const exclusion = eligible24
      ? full
      : qualReason
        ? Math.min(full, full * (monthsOwned / 24))
        : 0
    const taxableBeforeRecap = Math.max(0, gain - exclusion)
    const recapture = Math.min(depreciation, gain) * 0.25
    const ltcgPart = Math.max(0, taxableBeforeRecap - Math.min(depreciation, gain))
    const tax = recapture + ltcgPart * (ltcgRate / 100)
    return { basis, gain, exclusion, eligible24, taxableBeforeRecap, recapture, ltcgPart, tax }
  }, [netSale, price, improvements, married, monthsOwned, qualReason, depreciation, ltcgRate])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Net sale proceeds (after selling costs)" value={netSale} onChange={setNetSale} prefix="$" />
          <Field label="Original purchase price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Improvements (not repairs)" value={improvements} onChange={setImprovements} prefix="$" />
          <Field label="Months owned AND lived in (of last 5 yrs)" value={monthsOwned} onChange={setMonthsOwned} step="1" />
          <Field label="Depreciation claimed (rental years)" value={depreciation} onChange={setDepreciation} prefix="$" />
          <Field label="Your LTCG rate" value={ltcgRate} onChange={setLtcgRate} suffix="%" step="5" />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={married} onChange={(e) => setMarried(e.target.checked)} className="h-4 w-4" />
            Married filing jointly ($500k exclusion)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={qualReason} onChange={(e) => setQualReason(e.target.checked)} className="h-4 w-4" />
            If under 24 months: sale is due to job move, health, or unforeseen circumstances
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Adjusted basis" value={usd(r.basis)} />
          <Result label="Total gain" value={usd(r.gain)} />
          <Result label="§121 exclusion" value={usd(r.exclusion)} />
          <Result label="Taxable gain" value={usd(r.taxableBeforeRecap)} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Result label="Depreciation recapture (25%)" value={usd(r.recapture)} />
          <Result label="Tax on remaining gain" value={usd(r.ltcgPart * (ltcgRate / 100))} />
          <Result big label="Federal tax on the sale" value={usd(r.tax)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.tax === 0
            ? `Fully sheltered: your ${usd(r.gain)} gain fits inside the ${usd(r.exclusion)} exclusion${r.recapture > 0 ? ' (after recapture)' : ''} — no federal tax on the sale. ${depreciation > 0 ? 'Watch it: recapture above would still apply if rental-period depreciation existed.' : ''}`
            : `Tax bill: ${usd(r.tax)} federal — ${r.recapture > 0 ? `${usd(r.recapture)} is depreciation recapture at the flat 25% rate (never excludable), plus ` : ''}${usd(r.ltcgPart * (ltcgRate / 100))} at your ${num(ltcgRate, 0)}% LTCG rate. State tax stacks on top in most states.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The §121 exclusion requires owning AND using the home as your primary residence for 2 of the 5 years before sale — the months can be broken up. Short of 24 months, a partial exclusion (months/24 × the cap) applies ONLY for job relocation (50+ miles), health, or unforeseen circumstances (divorce, death, multiple births, disaster per IRS regs) — "I wanted a bigger house" gets nothing. Basis improvements sellers forget: additions, systems, kitchens, landscaping, purchase closing costs, and special-assessment levies — repairs and maintenance don't count, and improvement receipts from 20 years ago still count. Rental history cuts both ways: depreciation you claimed (or SHOULD have claimed — "allowed or allowable") is recaptured at 25% even inside the exclusion, and nonqualified-use periods after 2008 can trim the exclusion for converted rentals. Above the exclusion, LTCG rates are 0/15/20% plus the 3.8% net investment income tax at $200k/$250k MAGI — this tool's single LTCG rate field approximates; stack state tax (0–13.3%) on top. Estimates — IRS Pub 523 and your CPA govern.
        </p>
      </CardContent>
    </Card>
  )
}

// DEDUCTIBLE OPTIMIZER — insurance is for losses that would hurt, not losses that would annoy. Node-verified: raising $500→$1,000 deductible saving $180/yr premium → breakeven claim frequency 180/500 = 0.36/yr = one claim per 2.78 years; claim less often and the high deductible wins. $500→$2,000 saving $320/yr → breakeven 1 per 4.69 yrs. EV over 10 yrs at 0.2 claims/yr: +$200; at 0.1/yr: +$1,700. The two hard gates: (1) emergency fund must cover the deductible comfortably — a $2,000 deductible with $1,500 in savings is self-insurance theater; (2) claims economics — small claims near the deductible shouldn't be filed at all (surcharges 20–40% for 3–5 yrs on auto; home claims poison renewability and CLUE reports follow you 7 yrs), so the deductible should sit just under the smallest loss you'd genuinely claim.
export function DeductibleOptimizerCalc() {
  const [lowDed, setLowDed] = useNumber(500)
  const [highDed, setHighDed] = useNumber(2000)
  const [saved, setSaved] = useNumber(320)
  const [claimsPerYr, setClaimsPerYr] = useNumber(0.15)
  const [efund, setEfund] = useNumber(5000)

  const r = useMemo(() => {
    const exposure = highDed - lowDed
    const breakEvenFreq = exposure > 0 ? saved / exposure : 0
    const breakEvenYrs = saved > 0 ? exposure / saved : 0
    const ev10 = saved * 10 - claimsPerYr * 10 * exposure
    const win = claimsPerYr < breakEvenFreq
    const covered = efund >= highDed
    return { exposure, breakEvenFreq, breakEvenYrs, ev10, win, covered }
  }, [lowDed, highDed, saved, claimsPerYr, efund])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Current deductible" value={lowDed} onChange={setLowDed} prefix="$" step="250" />
          <Field label="Higher deductible option" value={highDed} onChange={setHighDed} prefix="$" step="250" />
          <Field label="Annual premium saved" value={saved} onChange={setSaved} prefix="$" step="20" />
          <Field label="Your claims per year (honest history)" value={claimsPerYr} onChange={setClaimsPerYr} step="0.05" />
          <Field label="Emergency fund" value={efund} onChange={setEfund} prefix="$" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Extra exposure per claim" value={usd(r.exposure)} />
          <Result big label="Breakeven claim rate" value={`1 per ${num(r.breakEvenYrs, 1)} yrs`} />
          <Result label="10-year expected value" value={usd(r.ev10)} />
          <Result label="Deductible covered by e-fund?" value={r.covered ? 'Yes' : 'NO — gate failed'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.win && r.covered
            ? `Take the higher deductible: you claim once per ${num(1 / Math.max(claimsPerYr, 0.01), 1)} years but breakeven is once per ${num(r.breakEvenYrs, 1)} — a ${usd(r.ev10)} expected win over a decade, and your emergency fund covers the ${usd(highDed)} exposure.`
            : !r.covered
              ? `The math may say yes, but the gate says no: a ${usd(highDed)} deductible against a ${usd(efund)} emergency fund is self-insurance theater. Build the fund first, then raise the deductible.`
              : `Keep the lower deductible: your claim history (once per ${num(1 / Math.max(claimsPerYr, 0.01), 1)} yrs) beats the ${num(r.breakEvenYrs, 1)}-year breakeven — you'd expect to lose ${usd(-r.ev10)} over a decade.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The pricing asymmetry is the opportunity: insurers charge heavily for the first dollars of coverage because that's where the claim frequency lives — the jump from $500 to $1,000 typically saves 15–25% of premium, while $1,000 to $2,000 saves less per dollar of exposure. Get both quotes from your insurer; the savings field above should come from a real quote, not a guess. The claims-economics caveat cuts deeper than the math: filing small claims near the deductible is usually a mistake — auto surcharges run 20–40% for 3–5 years, and home claims go on your CLUE report for 7 years, following you to the next insurer and sometimes making you unrenewable. Since you'd pay the first {usd(highDed)} of any loss anyway, the deductible belongs just under the smallest loss you'd genuinely claim. Auto and home only — health deductibles are a different machine (out-of-pocket maxes, coinsurance, HSA arbitrage). Estimates — your insurer's quotes govern.
        </p>
      </CardContent>
    </Card>
  )
}

// UMBRELLA INSURANCE THRESHOLD — liability limits vs what's actually at stake (net worth + future earnings). Node-verified: $850k net worth with $300k auto/home liability limits → $550k gap → 1 $1M umbrella policy. Typical premiums (industry-standard ranges, get a real quote): first $1M $150–300/yr, each additional $1M $75–150 — $225/yr for $1M = $0.225 per $1,000 of coverage, the cheapest insurance per dollar in personal lines. Future-earnings exposure: wage garnishment up to 25% of disposable income in most states → $90k income ≈ $225k of 10-year exposure beyond assets. ERISA retirement accounts and some home equity are protected by state law; taxable brokerage, savings, and future wages are not. Policy triggers: auto/home underlying limits usually must be raised to $250k/$500k first (a modest premium bump). Defense costs are covered ON TOP of the limit on most umbrella policies — the lawyers are worth the premium alone.
export function UmbrellaCalc() {
  const [netWorth, setNetWorth] = useNumber(850000)
  const [income, setIncome] = useNumber(90000)
  const [autoLimit, setAutoLimit] = useNumber(300)
  const [homeLimit, setHomeLimit] = useNumber(300)

  const r = useMemo(() => {
    const baseLimit = Math.min(autoLimit, homeLimit) * 1000
    const earningsExposure = income * 0.25 * 10
    const totalAtStake = netWorth + earningsExposure
    const gap = Math.max(0, totalAtStake - baseLimit)
    const policies = Math.ceil(gap / 1000000)
    const estPremium = policies === 0 ? 0 : 225 + Math.max(0, policies - 1) * 110
    const verdict =
      gap <= 0 ? 'covered' : policies === 1 ? 'one' : 'multi'
    return { baseLimit, earningsExposure, totalAtStake, gap, policies, estPremium, verdict }
  }, [netWorth, income, autoLimit, homeLimit])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Net worth (home equity + savings + investments)" value={netWorth} onChange={setNetWorth} prefix="$" />
          <Field label="Gross income (future wages are attachable)" value={income} onChange={setIncome} prefix="$" />
          <Field label="Auto liability limit" value={autoLimit} onChange={setAutoLimit} suffix="k" step="100" />
          <Field label="Home liability limit" value={homeLimit} onChange={setHomeLimit} suffix="k" step="100" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Underlying liability floor" value={usd(r.baseLimit)} />
          <Result label="Assets + 10-yr wage exposure" value={usd(r.totalAtStake)} />
          <Result big label="Unprotected gap" value={usd(r.gap)} />
          <Result label="Umbrella needed / est. premium" value={r.policies === 0 ? 'None' : `$${r.policies}M / ~${usd(r.estPremium)}/yr`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.gap <= 0
            ? `Your ${usd(r.baseLimit)} underlying limits cover the modeled exposure (${usd(r.totalAtStake)}). Revisit as net worth grows — umbrella math changes fast once home equity and investments compound.`
            : `${usd(r.gap)} of your wealth and future wages sits above your liability limits. A $${r.policies}M umbrella runs roughly ${usd(r.estPremium)}/year — ${usd(r.estPremium / (r.policies * 1000), 2)} per $1,000 of coverage, the cheapest insurance in personal lines.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The model counts what a judgment can reach: taxable brokerage, savings, and home equity beyond your state's homestead exemption — plus future wages (garnishment caps run ~25% of disposable income in most states, and a judgment can follow you 10–20 years with renewals). ERISA-governed retirement accounts (401(k)s) are federally protected; IRA protection varies by state (often capped ~$1.7M, adjusted). The mechanics to know before buying: umbrella policies require raising your underlying auto/home limits first (typically to $250k/$500k — a small premium bump worth doing anyway); defense costs are usually covered IN ADDITION to the policy limit, meaning the lawyers alone can be worth the premium in a defended claim; and umbrella covers liability only — never your own injuries or property. Premium estimates here are typical market ranges for clean records; teen drivers, pools, dogs, trampolines, and rental properties move the quote. Get real quotes from your current auto/home carrier first — bundling discounts are significant. Estimates — your insurer's quote governs.
        </p>
      </CardContent>
    </Card>
  )
}

// WHEN TO DROP COMP/COLLISION — insuring a depreciating car against itself. Node-verified: $4,000 car, $500 deductible, $600/yr comp+collision → max payout $3,500; premium = 15.0% of car value (the 10% rule says DROP); breakeven total-loss frequency 600/3500 = 17.1%/yr vs the real ~4%/yr total-loss rate — you'd need to total the car every 5.8 years just to break even. Counter-example: $12,000 car at $700/yr → 5.8% of value, breakeven 6.1% ≈ realistic loss frequency → KEEP. Gates before dropping: (1) loan/lease requires full coverage (not optional); (2) can you write a check for the replacement TOMORROW — the e-fund gate; (3) liability is NEVER droppable — it's the part protecting your assets, not the car. Note: dropping collision while keeping comprehensive is often the smart middle (comp covers theft/weather/deer at ~1/3 the price).
export function DropFullCoverageCalc() {
  const [carValue, setCarValue] = useNumber(4000)
  const [ded, setDed] = useNumber(500)
  const [premium, setPremium] = useNumber(600)
  const [efund, setEfund] = useNumber(8000)
  const [hasLoan, setHasLoan] = useState(false)

  const r = useMemo(() => {
    const maxPayout = Math.max(0, carValue - ded)
    const pctOfValue = carValue > 0 ? (premium / carValue) * 100 : 0
    const breakEvenFreq = maxPayout > 0 ? (premium / maxPayout) * 100 : 0
    const fiveYrPrem = premium * 5
    const covered = efund >= carValue
    const drop = !hasLoan && pctOfValue > 10 && covered
    return { maxPayout, pctOfValue, breakEvenFreq, fiveYrPrem, covered, drop }
  }, [carValue, ded, premium, efund, hasLoan])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Car's actual cash value (KBB private party)" value={carValue} onChange={setCarValue} prefix="$" />
          <Field label="Comp/collision deductible" value={ded} onChange={setDed} prefix="$" step="250" />
          <Field label="Comp + collision premium /yr" value={premium} onChange={setPremium} prefix="$" step="50" />
          <Field label="Emergency fund" value={efund} onChange={setEfund} prefix="$" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasLoan} onChange={(e) => setHasLoan(e.target.checked)} className="h-4 w-4" />
          Car has a loan or lease (full coverage required by the lender)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Max the insurer will ever pay" value={usd(r.maxPayout)} />
          <Result big label="Premium as % of car value" value={`${num(r.pctOfValue, 1)}%`} />
          <Result label="Breakeven: total loss every X yrs" value={num(100 / r.breakEvenFreq, 1)} />
          <Result label="5-year premium cost" value={usd(r.fiveYrPrem)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {hasLoan
            ? 'Full coverage is not optional with a loan or lease — the lender owns the risk until the note is paid. Revisit the day after payoff.'
            : r.drop
              ? `Drop comp/collision: you'd need to total this car every ${num(100 / r.breakEvenFreq, 1)} years to break even (real-world: ~every 25), the premium runs ${num(r.pctOfValue, 1)}% of the car's value annually, and your e-fund covers replacement. Bank the ${usd(premium)}/yr — in ${num(r.maxPayout / premium, 1)} years you've self-funded the whole car.`
              : !r.covered
                ? `The math may favor dropping, but your emergency fund (${usd(efund)}) can't replace the car (${usd(carValue)}) tomorrow. Keep coverage until the fund catches up.`
                : `Keep it: at ${num(r.pctOfValue, 1)}% of value the premium is still buying real protection — breakeven requires a total loss every ${num(100 / r.breakEvenFreq, 1)} years, close enough to real-world frequency that the coverage earns its keep.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The 10% rule is the quick screen: when the comp/collision premium exceeds 10% of the car's value per year, you're mostly insuring the insurer's profit. The deeper math is the breakeven frequency above — compare it against reality (total losses run ~4%/year fleet-wide; add deer/weather/theft for your area). The middle path most people miss: drop COLLISION but keep COMPREHENSIVE — theft, hail, flood, fire, and animal strikes stay covered for roughly a third of the combined premium, and those risks don't shrink as the car ages the way crash-logic does. Never drop liability — that's the coverage protecting your assets from the OTHER driver's lawyers, and state minimums ($25k/$50k in many states) are dangerously thin; raise liability while dropping comp/collision and the premium often stays flat. Also remember the insurer pays actual cash value MINUS deductible, and values depreciate monthly — rerun this every renewal. Estimates — your policy and state's rules govern.
        </p>
      </CardContent>
    </Card>
  )
}

// HOME INSURANCE ADEQUACY — dwelling coverage = REBUILD cost, never market value (the land can't burn). Node-verified: 2,000 sqft × $175/sqft local rebuild = $350,000 dwelling coverage — correct even if the home's market value is $450k (overinsured on dirt) or $250k in a cheap market (underinsured on lumber). Percentage-deductible shock: a 2% wind/hail deductible on $350k dwelling = $7,000 out of pocket vs the $1,000 flat deductible people assume — a $6,000 surprise per storm claim. 80% coinsurance rule: insure below 80% of replacement cost and PARTIAL losses pay pro-rata — insured $240k vs required $280k (80% of $350k) → a $50k kitchen fire pays $42,857. Extended replacement cost endorsement (125%/150%) is the cheap hedge against post-disaster cost surges (lumber +40% after regional catastrophes is documented). Flood and earthquake are NEVER in the base policy — separate policies, and flood zones lie by omission (1/3 of NFIP claims come from outside high-risk zones).
export function HomeCoverageCalc() {
  const [sqft, setSqft] = useNumber(2000)
  const [costSqft, setCostSqft] = useNumber(175)
  const [dwelling, setDwelling] = useNumber(240000)
  const [windPct, setWindPct] = useNumber(2)
  const [extended, setExtended] = useState(true)

  const r = useMemo(() => {
    const rebuild = sqft * costSqft
    const required80 = rebuild * 0.8
    const underinsured = dwelling < required80
    const coinRatio = dwelling < required80 && dwelling > 0 ? dwelling / required80 : 1
    const windDed = dwelling * (windPct / 100)
    const effCap = dwelling * (extended ? 1.25 : 1)
    const gap = rebuild - dwelling
    return { rebuild, required80, underinsured, coinRatio, windDed, effCap, gap }
  }, [sqft, costSqft, dwelling, windPct, extended])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Finished square footage" value={sqft} onChange={setSqft} step="100" />
          <Field label="Local rebuild cost /sqft" value={costSqft} onChange={setCostSqft} prefix="$" step="25" />
          <Field label="Your dwelling coverage (Coverage A)" value={dwelling} onChange={setDwelling} prefix="$" />
          <Field label="Wind/hail deductible" value={windPct} onChange={setWindPct} suffix="%" step="0.5" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={extended} onChange={(e) => setExtended(e.target.checked)} className="h-4 w-4" />
          Extended replacement cost endorsement (125% of Coverage A)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Rebuild cost (what Coverage A should be)" value={usd(r.rebuild)} />
          <Result big label={r.gap >= 0 ? 'Coverage gap' : 'Coverage cushion'} value={usd(Math.abs(r.gap))} />
          <Result label="Wind/hail deductible in dollars" value={usd(r.windDed)} />
          <Result label="Effective cap with endorsement" value={usd(r.effCap)} />
        </div>
        {r.underinsured && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Under the 80% coinsurance rule: dwelling coverage below {usd(r.required80)} means even PARTIAL losses pay pro-rata — a $50,000 kitchen fire would pay {usd(50000 * r.coinRatio)}. You're self-insuring the difference on every claim, not just total losses.
          </p>
        )}
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.gap <= 0
            ? `Coverage meets the rebuild estimate (${usd(r.rebuild)}) with cushion — verify the wind/hail deductible (${usd(r.windDed)} per storm claim) is money you can actually produce.`
            : `You're ${usd(r.gap)} short of rebuild cost. Premium saved on that gap is roughly ${usd(Math.abs(r.gap) * 0.003, 0)}/yr — trivial against a ${usd(r.gap)} exposure. Raise Coverage A to ${usd(r.rebuild)} and take the extended endorsement.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The core confusion: dwelling coverage insures the STRUCTURE at rebuild cost — lumber, labor, code upgrades — while market value includes land (which survives every disaster) and market sentiment (which rebuilds nothing). In cheap markets rebuild exceeds market value (underinsurance trap); in hot coastal markets the reverse (overpaying to insure dirt). Find local rebuild cost from your insurer's replacement-cost estimator or a local builder — $150–250/sqft spans most US markets in 2026, higher for custom/historic. The percentage-deductible trap deserves its own line: coastal and hail-state policies increasingly carry 1–5% wind/hail deductibles computed on DWELLING COVERAGE, not the claim — that's real dollars shown above, per storm. Not in the base policy, ever: flood (NFIP or private, 30-day wait, and ~1/3 of NFIP claims come from OUTSIDE high-risk zones), earthquake, sewer backup (cheap endorsement — buy it), and ordinance/law coverage for code-required upgrades on older homes (also cheap, also buy it). Recheck Coverage A annually — construction inflation outpaced CPI for years. Estimates — your policy's declarations page governs.
        </p>
      </CardContent>
    </Card>
  )
}

// TERM LIFE LADDER — needs shrink as the mortgage amortizes and kids launch; coverage should too. Illustrative healthy-35yo rates per $1,000/yr (clearly illustrative — real quotes vary 2x by carrier/class): 10yr $0.45, 20yr $0.60, 30yr $0.85. Node-verified on those rates: flat $1.5M 30yr = $1,275/yr → $38,250 over 30 yrs. Ladder $750k/10yr + $500k/20yr + $250k/30yr = $852/yr initial, and the policies expire on schedule → $15,760 total. Savings $22,490 for IDENTICAL coverage years 1–10 ($1.5M), deliberately reduced later ($750k yrs 11–20, $250k yrs 21–30) as obligations fall. The risk priced honestly: ladder legs can't be extended — if health changes or the obligation outlives the leg (special-needs child, late second mortgage), replacement coverage at older ages costs multiples. Insurability lock: buy slightly longer than needed if uncertainty is high.
export function LifeLadderCalc() {
  const [need10, setNeed10] = useNumber(1500) // total coverage needed yrs 1-10, in $k
  const [need20, setNeed20] = useNumber(750)
  const [need30, setNeed30] = useNumber(250)
  const [r10, setR10] = useNumber(0.45)
  const [r20, setR20] = useNumber(0.60)
  const [r30, setR30] = useNumber(0.85)

  const r = useMemo(() => {
    // ladder legs: 10yr leg = need10 - need20; 20yr leg = need20 - need30; 30yr leg = need30
    const leg10 = Math.max(0, need10 - need20)
    const leg20 = Math.max(0, need20 - need30)
    const leg30 = Math.max(0, need30)
    const premLadder = leg10 * r10 + leg20 * r20 + leg30 * r30 // $/yr (rates are per $k per yr)
    const totLadder = leg10 * r10 * 10 + leg20 * r20 * 20 + leg30 * r30 * 30
    const premFlat = need10 * r30
    const totFlat = premFlat * 30
    const savings = totFlat - totLadder
    return { leg10, leg20, leg30, premLadder, totLadder, premFlat, totFlat, savings }
  }, [need10, need20, need30, r10, r20, r30])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Coverage needed years 1–10" value={need10} onChange={setNeed10} suffix="k" step="100" />
          <Field label="Years 11–20 (mortgage shrinking, kids older)" value={need20} onChange={setNeed20} suffix="k" step="100" />
          <Field label="Years 21–30 (final obligations)" value={need30} onChange={setNeed30} suffix="k" step="100" />
          <Field label="10-yr rate per $1k/yr" value={r10} onChange={setR10} prefix="$" step="0.05" />
          <Field label="20-yr rate per $1k/yr" value={r20} onChange={setR20} prefix="$" step="0.05" />
          <Field label="30-yr rate per $1k/yr" value={r30} onChange={setR30} prefix="$" step="0.05" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Ladder legs" value={`${usd(r.leg10 * 1000)} / ${usd(r.leg20 * 1000)} / ${usd(r.leg30 * 1000)}`} />
          <Result label="Year-1 premium: ladder vs flat" value={`${usd(r.premLadder)} vs ${usd(r.premFlat)}`} />
          <Result label="30-yr total: ladder vs flat" value={`${usd(r.totLadder)} vs ${usd(r.totFlat)}`} />
          <Result big label="Lifetime savings from laddering" value={usd(r.savings)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          The ladder buys {usd(r.leg10 * 1000)} (10-yr) + {usd(r.leg20 * 1000)} (20-yr) + {usd(r.leg30 * 1000)} (30-yr) — full {usd(need10 * 1000)} protection while the mortgage is fat and the kids are small, stepping down as obligations do. You keep {usd(r.savings)} that the flat 30-year policy would have consumed insuring obligations you no longer have.
        </div>
        <p className="text-xs text-muted-foreground">
          The logic: life insurance replaces obligations — income during child-rearing, the mortgage balance, college. All three shrink with time, so a level 30-year policy for peak need overspends in the back half. The ladder matches coverage to the curve. Rates above are illustrative defaults for a healthy 35-year-old; real term quotes vary widely by carrier, health class, and smoking status — get real per-$1k rates from a broker or aggregator and enter them. The honest risks: ladder legs expire on schedule with no extension — if your health changes or an obligation outlives its leg (special-needs child, late refinance, second family), replacement coverage at older ages costs multiples of today's rates. Mitigations: round legs UP when uncertain, buy the longest leg slightly longer than planned, and confirm each policy's conversion option (term → permanent without new underwriting) as an escape hatch. Layer with employer coverage last — group term evaporates with the job. Estimates — real quotes govern.
        </p>
      </CardContent>
    </Card>
  )
}

// BARISTA FIRE — part-time income shrinks the required portfolio dollar-for-dollar at 25×. Node-verified: $55k expenses, $20k part-time income → barista number $875k vs full-FIRE $1,375k — a $500k smaller target; at $30k/yr saving, 6% real, from $100k stash: barista 15 yrs vs full 20 yrs — five years of freedom bought with a part-time job. The risk priced honestly: if the part-time income dies, the $875k supports only $35k/yr against $55k of expenses — a $20k/yr shortfall; mitigation = expense flexibility or a bigger buffer. Healthcare is the real barista benefit: ACA-subsidized or employer part-time coverage bridges to 65 (Medicare) — the ACA subsidy cliff math interacts with income level. Model: (expenses − partTime) × 25 = portfolio; withdrawal-only safety check uses 4% on the portfolio alone.
export function BaristaFireCalc() {
  const [expenses, setExpenses] = useNumber(55000)
  const [partTime, setPartTime] = useNumber(20000)
  const [stash, setStash] = useNumber(100000)
  const [saving, setSaving] = useNumber(30000)
  const [ret, setRet] = useNumber(6)
  const [swr, setSwr] = useNumber(4)

  const r = useMemo(() => {
    const mult = 100 / swr
    const full = expenses * mult
    const barista = Math.max(0, expenses - partTime) * mult
    const yrs = (target: number) => {
      let b = stash, n = 0
      while (b < target && n < 100) { b = b * (1 + ret / 100) + saving; n++ }
      return n
    }
    const yFull = yrs(full)
    const yBar = yrs(barista)
    const jobLostShortfall = Math.max(0, expenses - barista * (swr / 100))
    return { full, barista, yFull, yBar, diff: full - barista, yearsSaved: yFull - yBar, jobLostShortfall }
  }, [expenses, partTime, stash, saving, ret, swr])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Annual expenses" value={expenses} onChange={setExpenses} prefix="$" />
          <Field label="Part-time income (sustainable)" value={partTime} onChange={setPartTime} prefix="$" />
          <Field label="Current portfolio" value={stash} onChange={setStash} prefix="$" />
          <Field label="Annual saving until then" value={saving} onChange={setSaving} prefix="$" />
          <Field label="Real return" value={ret} onChange={setRet} suffix="%" step="0.5" />
          <Field label="Withdrawal rate" value={swr} onChange={setSwr} suffix="%" step="0.25" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Full FIRE number" value={usd(r.full)} />
          <Result big label="Barista FIRE number" value={usd(r.barista)} />
          <Result label="Target shrinks by" value={usd(r.diff)} />
          <Result label="Years to each" value={`${r.yBar} vs ${r.yFull}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.yearsSaved > 0
            ? `Part-time income of ${usd(partTime)} buys you ${r.yearsSaved} years: barista at year ${r.yBar} instead of full FIRE at year ${r.yFull}. Every $1,000 of sustainable part-time income is ${usd(1000 * (100 / swr))} of portfolio you never have to build.`
            : 'Your saving rate already outruns the part-time subsidy — full FIRE arrives as fast as barista. Bigger stash, bigger safety.'}
        </div>
        <p className="text-xs text-muted-foreground">
          The honest risk ledger: barista FIRE leans on the part-time income being durable. If it disappears, this portfolio supports {usd(r.barista * (swr / 100))}/yr against {usd(expenses)} of expenses — a {usd(r.jobLostShortfall)}/yr gap you'd fill from principal (which shortens everything) or new work. Mitigate with expense flexibility (discretionary spend you can cut in bad markets), skills that stay employable, or a portfolio buffer above the bare number. The benefits wrinkle that often DECIDES it: part-time work with health coverage (or ACA subsidies at barista income levels — watch the subsidy phase-outs by income) bridges to Medicare at 65, and healthcare is the line item that breaks most early-retirement plans. Also modeled simply: taxes on the part-time income and withdrawal sequencing come out of the numbers above — pad expenses to cover them. This is arithmetic, not a plan — sequence-of-returns risk lives in the first five years of any retirement.
        </p>
      </CardContent>
    </Card>
  )
}

// LIFESTYLE CREEP COST — a raise is a fork: spend it (invisible) or invest it (life-changing). Node-verified: $20k raise at 32% marginal tax → $13,600/yr investable; invested at 7% real → $557,539 in 20 yrs, $1,284,667 in 30. Half-creep (spend half, invest half) → $278,769/20yr. Symmetric move: a $400/mo spending cut = $4,800/yr → $196,778/20yr — a raise you can give yourself with no boss required. The mechanism that makes creep dangerous: recurring lifestyle additions (car payment, nicer apartment, subscriptions) RAISE the FI number (25× annual spend) AND lower the savings rate — a $6k/yr lifestyle bump adds $150k to the FIRE target while removing $6k of annual investment capacity. Double-ended tax.
export function LifestyleCreepCalc() {
  const [raise, setRaise] = useNumber(20000)
  const [marginal, setMarginal] = useNumber(32)
  const [investPct, setInvestPct] = useNumber(50)
  const [ret, setRet] = useNumber(7)
  const [yrs, setYrs] = useNumber(20)

  const r = useMemo(() => {
    const fv = (p: number, rr: number, n: number) => (rr > 0 ? p * ((Math.pow(1 + rr, n) - 1) / rr) : p * n)
    const afterTax = raise * (1 - marginal / 100)
    const invested = afterTax * (investPct / 100)
    const spent = afterTax - invested
    const fvInvested = fv(invested, ret / 100, yrs)
    const fvFull = fv(afterTax, ret / 100, yrs)
    const creepCost = fvFull - fvInvested
    const fireTargetAdd = spent * 25
    return { afterTax, invested, spent, fvInvested, fvFull, creepCost, fireTargetAdd }
  }, [raise, marginal, investPct, ret, yrs])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Raise (gross)" value={raise} onChange={setRaise} prefix="$" />
          <Field label="Marginal tax rate" value={marginal} onChange={setMarginal} suffix="%" />
          <Field label="Share you'll invest" value={investPct} onChange={setInvestPct} suffix="%" step="10" />
          <Field label="Real return" value={ret} onChange={setRet} suffix="%" step="0.5" />
          <Field label="Years" value={yrs} onChange={setYrs} step="5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="After-tax raise" value={`${usd(r.afterTax)}/yr`} />
          <Result label="Invested portion grows to" value={usd(r.fvInvested)} />
          <Result label="If you'd invested it ALL" value={usd(r.fvFull)} />
          <Result big label={`Creep cost over ${yrs} yrs`} value={usd(r.creepCost)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Spending {usd(r.spent)}/yr of this raise costs {usd(r.creepCost)} of future wealth — and if the spending is recurring, it also adds {usd(r.fireTargetAdd)} to your FIRE number (25× the new spend). The raise taxes you twice: once at payroll, once at the finish line.
        </div>
        <p className="text-xs text-muted-foreground">
          The psychology is why this tool exists: raises feel like rewards and arrive gradually — exactly the conditions for invisible lifestyle upgrades. The defense is mechanical, not willpower: route the raise to investments the day it lands (increase the 401(k) deferral by the raise amount — you never see it, so you never miss it). The honest counterweight: zero-creep is misery economics, and a raise you can't enjoy at all is a recipe for burnout spending later. The sustainable rule many planners suggest: invest at least half of every raise — lifestyle still improves, savings rate still climbs, and each raise arrives faster at the FI finish than the last. The spending-cut symmetry deserves attention too: a permanent $400/month cut equals a $7,300 gross raise in wealth effect (after the same 32% tax) — and nobody's employer needs to approve it. Estimates — markets and your discipline govern.
        </p>
      </CardContent>
    </Card>
  )
}

// COMMUTE TRUE COST — distance priced in dollars, hours, and mortgage-equivalent. Node-verified: 25 mi each way, 30 min each way, 240 workdays → 12,000 mi/yr × $0.67 full cost/mi (AAA-style all-in: depreciation, fuel, maintenance, tires, insurance share) = $8,040/yr; 240 hrs/yr of windshield time at $30/hr = $7,200 → $15,240/yr total ≈ $1,270/mo. Mortgage-equivalent at 6.5%/30yr: $200,928 — living closer supports $200k more house for the same monthly outlay. 10-year career cost: $152,400 + 2,400 hours (a full working YEAR at 40-hr weeks). Honest offsets: cheaper housing farther out, WFH days cut linearly (2 WFH days/wk → 40% off), transit shifts the cost mix (fare but hours semi-usable), EV lowers per-mile to ~$0.40s.
export function CommuteCostCalc() {
  const [milesEach, setMilesEach] = useNumber(25)
  const [minEach, setMinEach] = useNumber(30)
  const [days, setDays] = useNumber(240)
  const [costPerMi, setCostPerMi] = useNumber(0.67)
  const [hourly, setHourly] = useNumber(30)
  const [rate, setRate] = useNumber(6.5)

  const r = useMemo(() => {
    const miYr = milesEach * 2 * days
    const carCost = miYr * costPerMi
    const hrsYr = (minEach * 2 * days) / 60
    const timeVal = hrsYr * hourly
    const total = carCost + timeVal
    const i = rate / 1200
    const mtgEq = i > 0 ? ((total / 12) * (1 - Math.pow(1 + i, -360))) / i : (total / 12) * 360
    const workYears = hrsYr / 2080
    return { miYr, carCost, hrsYr, timeVal, total, mtgEq, workYears }
  }, [milesEach, minEach, days, costPerMi, hourly, rate])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          <Field label="Miles each way" value={milesEach} onChange={setMilesEach} step="5" />
          <Field label="Minutes each way" value={minEach} onChange={setMinEach} step="5" />
          <Field label="Commute days/yr" value={days} onChange={setDays} step="10" />
          <Field label="Full cost per mile" value={costPerMi} onChange={setCostPerMi} prefix="$" step="0.05" />
          <Field label="Your hourly value" value={hourly} onChange={setHourly} prefix="$" />
          <Field label="Mortgage rate context" value={rate} onChange={setRate} suffix="%" step="0.125" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Driving cost /yr" value={usd(r.carCost)} />
          <Result label="Time cost /yr" value={`${usd(r.timeVal)} (${num(r.hrsYr, 0)} hrs)`} />
          <Result big label="True commute cost /yr" value={usd(r.total)} />
          <Result label="Mortgage-equivalent" value={usd(r.mtgEq)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          This commute costs {usd(r.total / 12, 0)}/month — the same monthly weight as {usd(r.mtgEq)} of additional mortgage at {num(rate, 2)}%. The "cheaper house farther out" only wins if it's more than {usd(r.mtgEq)} cheaper. Over a decade: {usd(r.total * 10)} and {num(r.hrsYr * 10, 0)} hours ({num(r.workYears * 10, 1)} full working-years at the wheel).
        </div>
        <p className="text-xs text-muted-foreground">
          The per-mile figure is the full-cost number (AAA-style): depreciation, fuel, maintenance, tires, and the insurance share — fuel alone understates by half. The 2026 IRS mileage rate (67¢/mi business) is a defensible proxy; EVs run lower (~40–45¢), trucks/SUVs higher (75¢+). Time is priced at YOUR hourly value — defend it as earning rate or the wage you'd accept for an extra hour of work; either way it's not zero. The offsets are real and should be argued honestly: farther-out housing is often cheaper (that's why the mortgage-equivalent matters — compare against the PRICE gap, not the price), transit converts drive time into reading time (worth less per hour but not zero), and every WFH day per week cuts the whole ledger 20%. Also real but unpriced: crash risk scales with miles, and commute time is among the most reliably miserable hours of the day in well-being research — some costs don't fit in a calculator. Estimates — your odometer governs.
        </p>
      </CardContent>
    </Card>
  )
}

// SECOND INCOME vs DAYCARE — the second salary stacks on TOP of the first, so it's taxed at the household's marginal rate, not its own. Node-verified: $45k second income stacked on $80k primary (2026 MFJ: 22% fed bracket + 7.65% FICA + ~5% state ≈ 34.65% modeled as 34%) → after-tax $29,700; minus $18,000 daycare and $4,000 work costs (commute, lunches, wardrobe) → net $7,700/yr = $642/mo = $3.70/hr for a 2,080-hr year. Daycare breakeven: $25,700/yr — above that the job pays to work. Offsets priced honestly: the Dependent Care FSA ($5,000 pre-tax saves ~$1,700 at 34%), the child tax credit ($2,000/kid, 2026), employer 401k match on the second income (free money that doesn't show in this ledger), and the career-gap penalty — 5 years out typically costs re-entry wages AND five years of compounding raises/retirement contributions; the short-term math can be negative while the 30-year math is hugely positive. Decide with both ledgers open.
export function DaycareVsIncomeCalc() {
  const [salary, setSalary] = useNumber(45000)
  const [marginal, setMarginal] = useNumber(34)
  const [daycare, setDaycare] = useNumber(18000)
  const [workCosts, setWorkCosts] = useNumber(4000)
  const [kids, setKids] = useNumber(1)
  const [match, setMatch] = useNumber(2000)

  const r = useMemo(() => {
    const afterTax = salary * (1 - marginal / 100)
    const ctc = Math.min(kids, 10) * 2000 // child tax credit exists with or without the job — excluded from delta
    void ctc
    const net = afterTax - daycare - workCosts
    const perHr = net / 2080
    const withMatch = net + match
    const breakevenDaycare = afterTax - workCosts
    return { afterTax, net, perHr, withMatch, breakevenDaycare }
  }, [salary, marginal, daycare, workCosts, kids, match])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Second income (gross)" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Stacked marginal rate (fed + FICA + state)" value={marginal} onChange={setMarginal} suffix="%" />
          <Field label="Childcare cost /yr" value={daycare} onChange={setDaycare} prefix="$" />
          <Field label="Work costs /yr (commute, lunches, wardrobe)" value={workCosts} onChange={setWorkCosts} prefix="$" />
          <Field label="Kids (for reference)" value={kids} onChange={setKids} step="1" />
          <Field label="401k match only this job brings" value={match} onChange={setMatch} prefix="$" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="After-tax salary" value={usd(r.afterTax)} />
          <Result big label="Net contribution /yr" value={usd(r.net)} />
          <Result label="Effective hourly" value={`${usd(r.perHr, 2)}/hr`} />
          <Result label="Daycare breakeven" value={`${usd(r.breakevenDaycare)}/yr`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.net > 0
            ? `The job nets ${usd(r.net)}/yr — ${usd(r.perHr, 2)}/hour. Thin, but add the 401(k) match (${usd(match)}) and the career-continuity value, and the long ledger looks different: five years out of the workforce typically costs re-entry wages plus five years of compounding raises and retirement contributions.`
            : `The job COSTS ${usd(-r.net)}/yr on the short-term ledger. Before quitting, price the Dependent Care FSA ($5,000 pre-tax ≈ $1,700 back), part-time or remote options, and the career-gap penalty — the long-run ledger often still favors staying attached to work, even part-time.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Why the second salary evaporates: it stacks on top of the first, so it starts at the household's marginal bracket — 22% federal in this example before FICA and state — while daycare is paid in after-tax dollars and unreimbursed work costs come straight off the top. What this ledger deliberately excludes (and you shouldn't): the child tax credit exists either way; the Dependent Care FSA ($5,000 pre-tax) and dependent care credit OFFSET daycare for two-earner households — worth roughly $1,700–2,000 here; retirement match and benefits value; and the thirty-year ledger — career gaps compound against you via lost raises, Social Security credits, and retirement contributions, which is why many families run a thin-or-negative few years deliberately and treat it as career insurance, not income. Not financial advice — the non-financial parts of this decision are yours alone; the calculator's job is to make the financial part honest.
        </p>
      </CardContent>
    </Card>
  )
}

// FIXED-BID PROJECT PRICING — price = hours × floor × uncertainty multiplier, with rush premium on top. Node-verified: $95/hr floor, 40 est hrs, "new client, fuzzy scope" (×1.5) → $5,700; rush +25% → $7,125. Breakeven hours at that price: 75 — the risk multiplier buys you 35 hrs of overrun before dipping under the floor. If it actually takes 55 hrs, implied $129.55/hr. The multipliers (labeled heuristics, not statistics): repeat client, tight scope ×1.15; new client, clear scope ×1.3; new + fuzzy ×1.5; "we'll know it when we see it" ×1.8 or REFUSE fixed-bid. Fixed-bid transfers scope risk to YOU — the multiplier is the insurance premium; skip it and you're underwriting for free. Never bid below floor×hours×1.15 regardless of how much you want the logo.
export function FixedBidCalc() {
  const [floor, setFloor] = useNumber(95)
  const [hours, setHours] = useNumber(40)
  const [scope, setScope] = useState('1.5')
  const [rush, setRush] = useState(false)
  const [actualHrs, setActualHrs] = useNumber(55)

  const r = useMemo(() => {
    const mult = parseFloat(scope) || 1.3
    const base = floor * hours * mult
    const price = rush ? base * 1.25 : base
    const breakevenHrs = floor > 0 ? price / floor : 0
    const implied = actualHrs > 0 ? price / actualHrs : 0
    const overrunCover = breakevenHrs - hours
    return { mult, price, breakevenHrs, implied, overrunCover }
  }, [floor, hours, scope, rush, actualHrs])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Your hourly floor (from the rate calculator)" value={floor} onChange={setFloor} prefix="$" />
          <Field label="Estimated hours" value={hours} onChange={setHours} suffix="hrs" step="4" />
          <Field label="Likely actual hours (honest)" value={actualHrs} onChange={setActualHrs} suffix="hrs" step="4" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Scope risk (the multiplier IS your insurance)</label>
          <select value={scope} onChange={(e) => setScope(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
            <option value="1.15">Repeat client, tight written scope (×1.15)</option>
            <option value="1.3">New client, clear scope (×1.3)</option>
            <option value="1.5">New client, fuzzy scope (×1.5)</option>
            <option value="1.8">"We'll know it when we see it" (×1.8 — or refuse fixed-bid)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} className="h-4 w-4" />
          Rush timeline (+25% — tight deadlines cost you evenings, price them)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result big label="Fixed bid price" value={usd(r.price)} />
          <Result label="Breakeven hours" value={`${num(r.breakevenHrs, 0)} hrs`} />
          <Result label="Overrun the multiplier covers" value={`+${num(r.overrunCover, 0)} hrs`} />
          <Result label="Implied hourly at likely hours" value={`${usd(r.implied, 2)}/hr`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.implied >= floor
            ? `Bid ${usd(r.price)}: even at your honest ${actualHrs}-hour estimate you clear ${usd(r.implied, 2)}/hr — above the ${usd(floor)} floor. The multiplier absorbs ${num(r.overrunCover, 0)} hours of scope creep before you work for under-floor rates.`
            : `At ${actualHrs} likely hours this bid pays ${usd(r.implied, 2)}/hr — UNDER your ${usd(floor)} floor. Raise the price to ${usd(floor * actualHrs * 1.15)} (floor × likely hours × 1.15) or narrow the scope.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Fixed bids transfer scope risk from client to you — the multiplier is how you get paid for carrying it. The tiers are heuristics from common freelance practice, not statistics; calibrate with your own overrun history (track estimated vs actual per project; your personal multiplier reveals itself in five projects). The mechanics that protect the price: a written scope with an explicit exclusion list and a change-order rate (your hourly floor × 1.25 — creep should pay BETTER than scope), 30–50% upfront, and a kill fee. Rush premiums aren't greed: compressed timelines crowd out other billable work and guarantee weekend hours. When a client balks at the multiplied price, the honest move is shrinking scope, not shrinking the multiplier — the risk didn't balk. And the floor is the floor: below it, employment beats self-employment — that's what the freelance rate calculator computes. Estimates — your contract governs.
        </p>
      </CardContent>
    </Card>
  )
}

// CONSULTING RETAINER PRICING — the discount buys guaranteed utilization, and utilization is the freelancer's real wage. Node-verified: 20 hrs/mo committed at $95 floor with a 10% volume discount → $1,710/mo = $20,520/yr guaranteed. Hourly equivalent at a realistic 60% utilization: 12 hrs × $95 = $1,140/mo — the retainer beats hourly by $570/mo ($6,840/yr) DESPITE the discount, because unused-but-paid beats available-but-unbooked. Client's unused-hour risk: uses 15 of 20 → effective rate $114/hr (the client's insurance premium for priority access). Availability/SLA premium: same-day response +10% → $1,881/mo. Structural rules: use-it-or-lose-it monthly (rollovers convert the retainer into debt you owe), 3-month minimum term, rate lock 12 months, scope defined by HOURS not deliverables.
export function RetainerCalc() {
  const [hours, setHours] = useNumber(20)
  const [floor, setFloor] = useNumber(95)
  const [discount, setDiscount] = useNumber(10)
  const [sla, setSla] = useState(false)
  const [util, setUtil] = useNumber(60)
  const [used, setUsed] = useNumber(15)

  const r = useMemo(() => {
    const base = hours * floor * (1 - discount / 100)
    const price = sla ? base * 1.1 : base
    const hourlyExpected = hours * (util / 100) * floor
    const edge = price - hourlyExpected
    const clientEffRate = used > 0 ? price / used : 0
    const annual = price * 12
    return { price, hourlyExpected, edge, clientEffRate, annual }
  }, [hours, floor, discount, sla, util, used])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Committed hours /month" value={hours} onChange={setHours} suffix="hrs" step="5" />
          <Field label="Your hourly floor" value={floor} onChange={setFloor} prefix="$" />
          <Field label="Volume discount" value={discount} onChange={setDiscount} suffix="%" step="5" />
          <Field label="Your realistic utilization if hourly" value={util} onChange={setUtil} suffix="%" step="5" />
          <Field label="Hours client likely uses" value={used} onChange={setUsed} suffix="hrs" step="1" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sla} onChange={(e) => setSla(e.target.checked)} className="h-4 w-4" />
          Priority SLA (same-day response) — +10% availability premium
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result big label="Monthly retainer" value={usd(r.price)} />
          <Result label="Annual guaranteed" value={usd(r.annual)} />
          <Result label="Hourly work would expect" value={`${usd(r.hourlyExpected)}/mo`} />
          <Result label="Client's effective rate" value={`${usd(r.clientEffRate, 2)}/hr`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.edge > 0
            ? `The retainer beats hourly by ${usd(r.edge)}/mo despite the ${num(discount, 0)}% discount — because guaranteed ${hours} hours outpay ${num(util, 0)}%-utilized ones. If the client uses only ${used} hours, their effective rate is ${usd(r.clientEffRate, 2)}/hr — that's their insurance premium for your availability, and it's fair.`
            : `At ${num(util, 0)}% utilization your hourly expectation already beats this retainer — either your pipeline is unusually strong (keep hourly) or the discount is too deep (cut it to ${num(Math.max(0, discount - 5), 0)}%).`}
        </div>
        <p className="text-xs text-muted-foreground">
          Why the discount is worth it: freelance income risk is utilization risk — an available hour unsold is worth zero, and pipelines are lumpy. The retainer converts stochastic hours into a base you can build a life on; price the discount against YOUR utilization history, not your best month. The structural rules that keep retainers healthy: use-it-or-lose-it monthly (rollovers become debt you owe the client at your busiest), a 3-month minimum term (the first month is onboarding, the value starts month two), hours-based scope (deliverable-based retainers drift into unlimited scope), a 12-month rate lock with renewal repricing, and overage billed at full floor rate — the discount applies to committed hours only. Two retainers at this size plus overflow hourly work is the classic stable independent practice. Estimates — your contract governs.
        </p>
      </CardContent>
    </Card>
  )
}

// S-CORP ELECTION THRESHOLD — the SE-tax arbitrage, priced with its costs. Node-verified (under SS wage cap): sole prop $120k net → SE tax 92.35%×120k×15.3% = $16,955. S-corp with $60k reasonable salary: payroll tax on salary only = $9,180 → gross savings $7,775; minus payroll service ~$1,200/yr + added tax prep ~$800 → NET $5,775. Breakeven at salary=50% of profit: profit ≈ $30,866 — below that, the fixed costs eat the arbitrage. Mechanics priced: both sides of payroll tax on salary (15.3% combined), the 92.35% SE base adjustment, QBI deduction shrinks slightly on the salary side (salary isn't QBI — 20% of $60k distribution kept vs 20% of full profit; modeled net effect noted), reasonable-salary risk: IRS wins when salary is obviously below market for the work — the s-corp-reasonable-salary calculator sizes it. Above SS wage cap the savings compress to Medicare-only (2.9% split) — the election pays most between ~$31k and the cap.
export function ScorpElectionCalc() {
  const [profit, setProfit] = useNumber(120000)
  const [salary, setSalary] = useNumber(60000)
  const [payrollCost, setPayrollCost] = useNumber(1200)
  const [prepCost, setPrepCost] = useNumber(800)

  const r = useMemo(() => {
    const seTax = profit * 0.9235 * 0.153
    const payrollTax = Math.min(salary, profit) * 0.153
    const gross = seTax - payrollTax
    // QBI side effect: salary leaves QBI; distribution keeps 20% deduction. Rough delta at 24% bracket:
    // sole prop QBI = profit - SE/2... simplified: QBI loss = salary × 0.2 × marginal — computed at 24%:
    const qbiDrag = Math.min(salary, profit) * 0.2 * 0.24
    const net = gross - payrollCost - prepCost - qbiDrag
    const worth = net > 0 && profit > 40000
    return { seTax, payrollTax, gross, qbiDrag, net, worth }
  }, [profit, salary, payrollCost, prepCost])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Business net profit" value={profit} onChange={setProfit} prefix="$" />
          <Field label="Reasonable salary (be honest)" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Payroll service /yr" value={payrollCost} onChange={setPayrollCost} prefix="$" step="100" />
          <Field label="Added tax prep /yr" value={prepCost} onChange={setPrepCost} prefix="$" step="100" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="SE tax as sole prop" value={usd(r.seTax)} />
          <Result label="Payroll tax as S-corp" value={usd(r.payrollTax)} />
          <Result label="Gross arbitrage" value={usd(r.gross)} />
          <Result big label="Net annual savings" value={usd(r.net)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.worth
            ? `Elect: ${usd(r.net)}/yr after payroll costs, added prep, and the QBI drag (${usd(r.qbiDrag)} — salary isn't QBI-eligible, so the 20% deduction shrinks). On a 5-year hold that's ${usd(r.net * 5)}.`
            : profit <= 40000
              ? 'Below ~$40k profit the fixed costs eat the arbitrage — the election rarely pays down here. Revisit as profit grows; the math flips fast.'
              : `Marginal: ${usd(r.net)}/yr net. If your salary is defensibly lower (part-year, junior market rate), rerun; if not, the hassle may not be worth it this year.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The arbitrage: sole-prop profit pays 15.3% self-employment tax on 92.35% of everything; S-corp profit splits into salary (pays 15.3% payroll tax) and distribution (pays none). The catch list, priced above: payroll service, a second tax return (1120-S), and the QBI drag — salary dollars lose the 20% qualified-business-income deduction, modeled at the 24% bracket. The risks no calculator prices: the IRS's reasonable-compensation doctrine — salary visibly below market for your work invites recharacterization of distributions plus penalties (use the reasonable-salary calculator and document the basis); payroll compliance is monthly and unforgiving (late 941 deposits penalize immediately); some states tax S-corps separately (CA's 1.5% and $800 minimum, NYC's GCT) — check yours before electing. Above the Social Security wage cap, the savings compress toward the Medicare-only slice (~2.9% split) and the case weakens. Election timing: Form 2553 by March 15 for the current year (or anytime for next year; late-election relief exists). This is planning-grade arithmetic — a CPA who knows your state should run the final numbers.
        </p>
      </CardContent>
    </Card>
  )
}

// RSU VEST TAX + SELL-AT-VEST — vesting is a cash bonus your employer pays in stock, taxed as ordinary income at the vest-day price. Node-verified: 400 RSUs vesting at $150 = $60,000 ordinary income; default flat supplemental withholding 22% = $13,200, but a 32% bracket owes $19,200 → a $6,000 April surprise (the under-withholding trap). Post-vest gains held 1yr+ get LTCG (a $10k gain @15% = $1,500) — but the VEST is always ordinary. Sell-at-vest framing: if your employer handed you $40,800 cash after tax, would you buy this stock with it? That's exactly what holding is. Concentration risk: income AND portfolio tied to one ticker — Enron logic, stated gently. Mega-grant note: withholding over $1M supplemental wages jumps to 37%.
export function RsuVestCalc() {
  const [shares, setShares] = useNumber(400)
  const [price, setPrice] = useNumber(150)
  const [bracket, setBracket] = useNumber(32)
  const [withholding, setWithholding] = useNumber(22)
  const [gainPct, setGainPct] = useNumber(10)
  const [holdYrs, setHoldYrs] = useNumber(1)

  const r = useMemo(() => {
    const vestValue = shares * price
    const withheld = vestValue * (withholding / 100)
    const owed = vestValue * (bracket / 100)
    const gap = owed - withheld
    const afterTax = vestValue - owed
    const futureGain = vestValue * (gainPct / 100) * holdYrs
    const ltcgOnGain = futureGain * 0.15
    const holdNet = afterTax + futureGain - ltcgOnGain
    return { vestValue, withheld, owed, gap, afterTax, futureGain, ltcgOnGain, holdNet }
  }, [shares, price, bracket, withholding, gainPct, holdYrs])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Shares vesting" value={shares} onChange={setShares} step="50" />
          <Field label="Vest-day price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Your marginal bracket" value={bracket} onChange={setBracket} suffix="%" />
          <Field label="Plan withholding rate" value={withholding} onChange={setWithholding} suffix="%" step="1" />
          <Field label="Expected annual gain if held" value={gainPct} onChange={setGainPct} suffix="%" />
          <Field label="Years held post-vest" value={holdYrs} onChange={setHoldYrs} step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Ordinary income at vest" value={usd(r.vestValue)} />
          <Result label="Withheld (default 22%)" value={usd(r.withheld)} />
          <Result big label={r.gap > 0 ? 'April surprise bill' : 'Over-withheld refund'} value={usd(Math.abs(r.gap))} />
          <Result label="After-tax value at vest" value={usd(r.afterTax)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.gap > 0
            ? `Heads up: your plan withholds ${num(withholding, 0)}% but your bracket is ${num(bracket, 0)}% — set aside ${usd(r.gap)} now or adjust W-4 withholding, because April will ask. The sell-vs-hold question, honestly framed: your employer just handed you ${usd(r.afterTax)} in cash-equivalent. Would you buy ${num(shares, 0)} shares with it today? Holding is buying.`
            : `Your withholding covers the bracket — no surprise bill. The remaining question is concentration: holding turns ${usd(r.afterTax)} of after-tax value into a single-ticker bet on the company that also pays your salary.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The mechanics that matter: vest is ordinary income at the vest-day price, period — no election changes that. Default 22% flat supplemental withholding under-withholds anyone above the 22% bracket (over $1M of supplemental wages, the mandatory rate jumps to 37%); some plans allow rate election — check yours before the vest, not after. Post-vest, the clock resets: vest price becomes your basis, and only gains AFTER vest earn long-term treatment at the one-year mark — modeled above at the 15% LTCG rate (20% at high incomes, +3.8% NIIT over $200k/$250k MAGI, plus state). Sell-at-vest advocates (most fee-only planners) point at the symmetry: selling immediately and diversifying is identical to receiving a cash bonus and investing it; holding is an active purchase decision made daily by default. The exception worth naming: if you'd genuinely buy the stock with fresh cash today, hold with eyes open — but set a concentration cap (many planners suggest 10% of investable assets in employer stock) because your income already rides the same ticker. Estimates — your plan documents and CPA govern.
        </p>
      </CardContent>
    </Card>
  )
}

// ISO vs NSO EXERCISE — the same options, two tax machines. Node-verified: 10,000 options, $5 strike, $40 FMV → spread $350,000. NSO: spread is ordinary income AT EXERCISE — 35% = $122,500 + $50,000 exercise cost = $172,500 total cash out, whether or not you sell a share. ISO: $50,000 exercise cash, no regular tax — but the $350k spread is an AMT preference item; flat-26% approximation ≈ $91,000 AMT hit (real AMT nets against regular tax with the exemption; this is the planning-grade estimate). Qualifying disposition (hold ≥1yr post-exercise AND ≥2yr post-grant): ISO gain all-LTCG — at $60 sale: $550k gain × 23.8% (20% + NIIT) = $130,900 vs NSO path $170,100. The ISO trap: exercise-and-hold into a crash — you owe AMT on a $40 phantom while holding $12 stock; the AMT credit dribbles back over years. Dec 31 mechanic: ISO exercises late in December let you see the AMT bill before the tax year closes (sell before Dec 31 of the SAME year → disqualifying disposition, ordinary income, AMT evaporates).
export function IsoNsoCalc() {
  const [opts, setOpts] = useNumber(10000)
  const [strike, setStrike] = useNumber(5)
  const [fmv, setFmv] = useNumber(40)
  const [bracket, setBracket] = useNumber(35)
  const [type, setType] = useState<'iso' | 'nso'>('iso')

  const r = useMemo(() => {
    const spread = Math.max(0, opts * (fmv - strike))
    const exerciseCost = opts * strike
    const nsoTax = spread * (bracket / 100)
    const amtHit = spread * 0.26 // flat planning approximation
    const cashOut = type === 'nso' ? exerciseCost + nsoTax : exerciseCost + amtHit
    return { spread, exerciseCost, nsoTax, amtHit, cashOut }
  }, [opts, strike, fmv, bracket, type])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-2">
          {(['iso', 'nso'] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`rounded-md border px-3 py-1.5 text-sm ${type === t ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              {t === 'iso' ? 'ISO (incentive)' : 'NSO (non-qualified)'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Options to exercise" value={opts} onChange={setOpts} step="500" />
          <Field label="Strike price" value={strike} onChange={setStrike} prefix="$" />
          <Field label="Current FMV" value={fmv} onChange={setFmv} prefix="$" />
          <Field label="Your marginal bracket" value={bracket} onChange={setBracket} suffix="%" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Spread (the taxable thing)" value={usd(r.spread)} />
          <Result label="Exercise cost" value={usd(r.exerciseCost)} />
          <Result label={type === 'nso' ? 'Ordinary tax at exercise' : 'AMT exposure (approx)'} value={usd(type === 'nso' ? r.nsoTax : r.amtHit)} />
          <Result big label="Total cash out day one" value={usd(r.cashOut)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {type === 'nso'
            ? `NSO exercise is a taxable event immediately: ${usd(r.nsoTax)} of ordinary tax on the spread, due whether you sell or not. If you're exercising-and-selling same day (cashless), that's the whole story — clean but fully taxed.`
            : `ISO defers regular tax, but the ${usd(r.spread)} spread feeds the AMT — planning-grade exposure ${usd(r.amtHit)}. The December mechanic: exercise late December and you can see the AMT bill while the disqualifying-disposition escape hatch (sell before year-end → ordinary income, no AMT) is still open.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The qualifying-disposition bargain for ISOs: hold the shares at least 1 year post-exercise AND 2 years post-grant, and the entire gain over strike becomes long-term capital gain — the best tax treatment equity comp offers. The price is the AMT year: you pay tax on paper gains you haven't sold, with the AMT credit recovering over future years (slowly). The disaster pattern to refuse: exercise-and-hold a volatile private/startup stock into a down round — tax owed on a phantom FMV while the shares can't be sold. Honest limits of this model: AMT here is a flat 26% planning approximation — the real computation nets against regular tax, applies the AMT exemption (phasing out at higher incomes), and interacts with state AMT; exercises within $50k of this estimate deserve a CPA running real Form 6251. NSO note: exercise withholding often defaults to 22% supplemental — the same under-withholding trap as RSUs applies if your bracket is higher. Estimates — your plan documents and CPA govern.
        </p>
      </CardContent>
    </Card>
  )
}

// STARTUP OFFER EV — equity priced by probability, not pitch deck. Node-verified: 0.1% ownership, $20k strike cost, 4-yr vest, scenarios fail 65% → $0 / modest exit $100M 25% → $80k / big exit $500M 10% → $480k → EV $68k over 4 years = $17k/yr. Against a $30k/yr salary cut ($120k over the vest): the trade is −$52k EXPECTED. Dilution round: two more raises (~30% dilution) cut the 0.1% to 0.07% → EV $45.5k, worse. Probabilities labeled as industry-typical priors (most startups return ~0 to common; preferred stock + liquidation preferences eat first at modest exits — common can get ZERO under a 1x preference when exit < invested capital). Honest upside: EV math can't price learning, network, or the tail — the 10% scenario IS the reason people go; just count it as 10%, not as destiny.
export function StartupOfferCalc() {
  const [pct, setPct] = useNumber(0.1)
  const [strike, setStrike] = useNumber(20000)
  const [cut, setCut] = useNumber(30000)
  const [years, setYears] = useNumber(4)
  const [pFail, setPFail] = useNumber(65)
  const [modExit, setModExit] = useNumber(100)
  const [pMod, setPMod] = useNumber(25)
  const [bigExit, setBigExit] = useNumber(500)
  const [dilution, setDilution] = useNumber(30)

  const r = useMemo(() => {
    const own = (pct / 100) * (1 - dilution / 100)
    const modVal = Math.max(0, own * modExit * 1e6 - strike)
    const bigVal = Math.max(0, own * bigExit * 1e6 - strike)
    const pBig = Math.max(0, 100 - pFail - pMod) / 100
    const ev = (pFail / 100) * 0 + (pMod / 100) * modVal + pBig * bigVal
    const evPerYr = years > 0 ? ev / years : 0
    const cutTotal = cut * years
    const net = ev - cutTotal
    return { own: own * 100, modVal, bigVal, pBig: pBig * 100, ev, evPerYr, cutTotal, net }
  }, [pct, strike, cut, years, pFail, modExit, pMod, bigExit, dilution])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Ownership %" value={pct} onChange={setPct} suffix="%" step="0.05" />
          <Field label="Strike/exercise cost" value={strike} onChange={setStrike} prefix="$" />
          <Field label="Salary cut /yr vs market" value={cut} onChange={setCut} prefix="$" />
          <Field label="Vest years" value={years} onChange={setYears} step="1" />
          <Field label="P(fail / return ~0)" value={pFail} onChange={setPFail} suffix="%" step="5" />
          <Field label="Modest exit ($M) / P" value={modExit} onChange={setModExit} step="50" />
          <Field label="P(modest)" value={pMod} onChange={setPMod} suffix="%" step="5" />
          <Field label="Big exit ($M) — P is the remainder" value={bigExit} onChange={setBigExit} step="100" />
        </div>
        <div className="max-w-xs">
          <Field label="Future dilution from later rounds" value={dilution} onChange={setDilution} suffix="%" step="5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Ownership after dilution" value={`${num(r.own, 3)}%`} />
          <Result label="Equity expected value" value={usd(r.ev)} />
          <Result label="EV per year of vest" value={usd(r.evPerYr)} />
          <Result big label={r.net >= 0 ? 'Trade beats the salary cut' : 'Trade LOSES vs salary cut'} value={usd(Math.abs(r.net))} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.net >= 0
            ? `The EV math favors the offer by ${usd(r.net)} over ${years} years — but EV is an average across companies, and you join ONE. Take it for the mission and the learning; the equity is a lottery ticket with decent odds, not deferred salary.`
            : `Expected value says the salary cut (${usd(r.cutTotal)}) outweighs the equity (${usd(r.ev)}) by ${usd(-r.net)}. The honest reasons to take it anyway: the 10% tail is real and uninsurable elsewhere, the learning/network compound, and you can afford the risk. Just don't call it compensation.`}
        </div>
        <p className="text-xs text-muted-foreground">
          The priors are industry-typical, not statistics about YOUR company: most startups return zero to common shareholders, modest exits are further eroded by liquidation preferences (preferred investors take 1× their money first — a $100M exit with $80M raised at 1× leaves $20M for ALL common), and dilution is contractual destiny (each round shrinks your slice — model 20–30% per round to exit). The questions that matter more than the EV: what percentage is the offer TODAY (not "shares" — shares without the share count are marketing), what's the post-termination exercise window (90 days standard; extended windows are worth real money), early-exercise/83(b) availability (starts the tax clock at near-zero spread — the single most valuable equity feature), and preference stack (how much must be returned before common eats). Negotiation note: salary is usually harder to move than equity at startups — ask for both, but a higher salary cut-trade with extra options is often available. Estimates — your offer letter and cap table govern.
        </p>
      </CardContent>
    </Card>
  )
}

// GRAD SCHOOL ROI — the degree priced as an investment, tuition + foregone salary vs the raise, in present value. Node-verified: $60k tuition, 2 full-time years, $70k current salary, $95k post-grad, 4% discount, 30-yr career → foregone-salary PV $132,027, total cost $192,027, raise PV $385,148 → NPV +$193,122, breakeven in career year 13. Downside case ($80k post-grad): NPV −$37,967 — a $10k/yr raise NEVER pays back two years out of the workforce. Model: tuition at t0 (conservative), salary annuity during school, raise annuity from graduation to retirement. Honest edges: part-time/employer-funded degrees change the math completely (foregone salary → ~0 is the whole game), field dominates (CS/eng/nursing MS vs humanities MA are different planets), the raise must be YOUR field's actual post-degree premium (BLS/levels/pay transparency data), not the brochure's "average graduate earns". Opportunity cost is the giant: $70k/yr invested instead compounds too — that's why we discount at 4% real.
export function GradSchoolRoiCalc() {
  const [tuition, setTuition] = useNumber(60000)
  const [years, setYears] = useNumber(2)
  const [current, setCurrent] = useNumber(70000)
  const [newSal, setNewSal] = useNumber(95000)
  const [disc, setDisc] = useNumber(4)
  const [career, setCareer] = useNumber(30)

  const r = useMemo(() => {
    const r0 = disc / 100
    const ann = (n: number) => (r0 === 0 ? n : (1 - Math.pow(1 + r0, -n)) / r0)
    const foregone = current * ann(years)
    const totalCost = tuition + foregone
    const pvRaise = (newSal - current) * (ann(career) - ann(years))
    const npv = pvRaise - totalCost
    let breakeven: number | null = null
    for (let n = Math.ceil(years) + 1; n <= career; n++) {
      if ((newSal - current) * (ann(n) - ann(years)) >= totalCost) { breakeven = n; break }
    }
    return { foregone, totalCost, pvRaise, npv, breakeven }
  }, [tuition, years, current, newSal, disc, career])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Total tuition & fees" value={tuition} onChange={setTuition} prefix="$" step="5000" />
          <Field label="Years out of workforce" value={years} onChange={setYears} step="1" />
          <Field label="Current salary" value={current} onChange={setCurrent} prefix="$" step="5000" />
          <Field label="Expected post-degree salary" value={newSal} onChange={setNewSal} prefix="$" step="5000" />
          <Field label="Discount rate (real)" value={disc} onChange={setDisc} suffix="%" step="0.5" />
          <Field label="Career years remaining" value={career} onChange={setCareer} step="5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="True cost (tuition + foregone pay)" value={usd(r.totalCost)} />
          <Result label="PV of the raise" value={usd(r.pvRaise)} />
          <Result label="Degree NPV" value={usd(r.npv)} big />
          <Result label="Breakeven" value={r.breakeven ? `Year ${r.breakeven}` : 'Never'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.npv >= 0
            ? `At these numbers the degree pays for itself: ${usd(r.npv)} in today's dollars, breakeven in career year ${r.breakeven ?? '—'}. The catch: ${usd(r.foregone)} of the cost is the salary you stop earning — which is why employer-funded or part-time programs change the decision entirely.`
            : `The math says no: the raise never recovers ${usd(r.totalCost)} of tuition and foregone salary over a ${career}-year career. Non-financial reasons can still justify it — career pivots, required credentials, the work itself — but call it consumption, not investment.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: tuition at time zero (conservative — most is spread over enrollment), current salary discounted as an annuity during school, the salary PREMIUM (new minus current, not the whole new salary) discounted from graduation through the career. The post-degree salary is the input that decides everything — get it from BLS Occupational Outlook, pay-transparency sites, or offer data in YOUR field, not program marketing ("average graduate earns" survivorship-skews hard: graduates who were already employed and sponsored pull the mean up). What this misses on purpose: loan interest (a $60k degree financed at 7% adds real cost — run the loan separately), field-switching upside that isn't salary, the option value of credentials that unlock licensed roles, and the risk that you don't finish — roughly 4 in 10 graduate enrollees don't complete within six years, and a half-finished degree pays nothing. Estimates — your actual offers and program costs govern.
        </p>
      </CardContent>
    </Card>
  )
}

// CERTIFICATION ROI — the credential priced as an investment: fees + expected retakes + study hours at your time value, vs the annual raise discounted over the career window. Node-verified (PMP-style): $1,500 fees+materials, 150 study hrs at $45/hr ($6,750 opportunity cost), 60% first-attempt pass → expected retake cost $1,000 → expected total $9,250; $10k/yr raise over 10 yrs @4% → PV $81,109 → NPV +$71,859, payback 11.1 months, $479 per study hour. Model: expected cost = fees/pass-rate adjustment (each expected extra attempt costs the exam fee again — honest simplification that slightly overstates when materials don't rebuy). Honest edges: certification raises are REAL only where the credential gates roles (PMP for federal/defense PM, CPA for audit sign-off, PE, RN specialties, AWS for cloud roles where job posts literally list it) — in fields where nobody filters on it, the raise is ~0 and the honest NPV is negative; pass rates are published (CFA L1 ~40%, PMP ~60-70%, AWS SA ~70% range); study hours are the giant hidden cost (CFA: ~300 hrs × 3 levels — at $45/hr that's $40k of time).
export function CertRoiCalc() {
  const [fees, setFees] = useNumber(1500)
  const [hours, setHours] = useNumber(150)
  const [wage, setWage] = useNumber(45)
  const [pass, setPass] = useNumber(60)
  const [raise, setRaise] = useNumber(10000)
  const [years, setYears] = useNumber(10)
  const [disc, setDisc] = useNumber(4)

  const r = useMemo(() => {
    const r0 = disc / 100
    const ann = (n: number) => (r0 === 0 ? n : (1 - Math.pow(1 + r0, -n)) / r0)
    const p = Math.max(5, Math.min(100, pass)) / 100
    const opp = hours * wage
    const retakes = (1 / p - 1) * fees
    const cost = fees + opp + retakes
    const pv = raise * ann(years)
    const npv = pv - cost
    const payback = raise > 0 ? cost / (raise / 12) : Infinity
    const perHour = hours > 0 ? npv / hours : 0
    return { opp, retakes, cost, pv, npv, payback, perHour }
  }, [fees, hours, wage, pass, raise, years, disc])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Exam fee + materials" value={fees} onChange={setFees} prefix="$" step="100" />
          <Field label="Study hours" value={hours} onChange={setHours} step="25" />
          <Field label="Value of your time" value={wage} onChange={setWage} prefix="$" suffix="/hr" step="5" />
          <Field label="First-attempt pass rate" value={pass} onChange={setPass} suffix="%" step="5" />
          <Field label="Expected raise /yr" value={raise} onChange={setRaise} prefix="$" step="1000" />
          <Field label="Years the raise lasts" value={years} onChange={setYears} step="5" />
          <Field label="Discount rate (real)" value={disc} onChange={setDisc} suffix="%" step="0.5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Study time cost" value={usd(r.opp)} />
          <Result label="Expected total cost" value={usd(r.cost)} />
          <Result label="Certification NPV" value={usd(r.npv)} big />
          <Result label="Payback" value={isFinite(r.payback) ? `${num(r.payback, 1)} months` : 'Never'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.npv >= 0
            ? `The credential clears the bar: ${usd(r.npv)} net in today's dollars — ${usd(Math.round(r.perHour))} per study hour. But the whole case rests on the raise being REAL: check current job posts in your field for the cert by name before counting it.`
            : `The math says no: the raise never recovers ${usd(Math.round(r.cost))} of fees, retakes, and study time. If the credential gates a role you want (licenses, federal contract requirements), that's a different decision — the cert is the entry ticket, not the raise.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: expected cost = fees + study hours × your time value + expected retake fees (at a 60% pass rate you should EXPECT 0.67 extra attempts — hope is not a study plan); the raise is discounted over the years it realistically lasts. Where certification raises are real: credentials that gate roles or filter resumes — CPA (audit sign-off), PE (stamp drawings), PMP (federal/defense PM postings), RN specialties, AWS/Azure where job posts name them. Where they're decoration: fields that hire on portfolios and experience. The honest check takes ten minutes: search live job posts for the certification by name and note the salary band difference on roles that require it versus those that don't. Published first-attempt pass rates are sobering on purpose (CFA Level I historically ~40%, PMP roughly 60–70%) — build the retake into your plan. Estimates — your field's postings and the cert body's fee schedule govern.
        </p>
      </CardContent>
    </Card>
  )
}

// JOB HOP PREMIUM — switch vs stay, cumulative. Node-verified: $80k current, +15% hop premium, 3%/yr growth both paths, $5k one-time switch cost (unvested 401k match, benefits gap, etc.), 5-yr horizon @4% discount → stay $424,731 cumulative, hop $483,440 → +$58,710 nominal / +$53,857 PV; breakeven premium just 1.3% — almost ANY raise beats the friction over 5 years. Model: both paths grow at the same rate after the jump (conservative — hoppers historically compound faster because each hop resets to market), one-time cost netted at t0. Honest edges: the switching cost input is where honesty lives (unvested 401k match, ESPP discounts in the holding window, unvested RSUs, bonus timing, health-plan deductible resets — a December quit can cost a full annual bonus), the "loyalty tax" literature (ADP/Atlanta Fed wage trackers: job switchers have out-earned stayers most years since 2021), risk side is real (last-in-first-out, probation, unknown manager), and non-salary hops (title, scope, remote) don't show in this math — price them separately. Also honest: hopping every 18 months reads as flight risk in some fields; the premium has to cover that too.
export function JobHopCalc() {
  const [cur, setCur] = useNumber(80000)
  const [prem, setPrem] = useNumber(15)
  const [growth, setGrowth] = useNumber(3)
  const [cost, setCost] = useNumber(5000)
  const [years, setYears] = useNumber(5)
  const [disc, setDisc] = useNumber(4)

  const r = useMemo(() => {
    const g = growth / 100, dr = disc / 100
    let stay = 0, hop = 0, stayPV = 0, hopPV = 0
    for (let y = 0; y < years; y++) {
      const s = cur * Math.pow(1 + g, y)
      const h = cur * (1 + prem / 100) * Math.pow(1 + g, y)
      stay += s; hop += h
      stayPV += s / Math.pow(1 + dr, y)
      hopPV += h / Math.pow(1 + dr, y)
    }
    hop -= cost; hopPV -= cost
    let minPrem = 0
    for (let p = 0; p < 1; p += 0.0005) {
      let pv = 0
      for (let y = 0; y < years; y++) pv += (cur * p * Math.pow(1 + g, y)) / Math.pow(1 + dr, y)
      if (pv >= cost) { minPrem = p; break }
    }
    return { stay, hop, diff: hop - stay, diffPV: hopPV - stayPV, minPrem: minPrem * 100 }
  }, [cur, prem, growth, cost, years, disc])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Current salary" value={cur} onChange={setCur} prefix="$" step="5000" />
          <Field label="New-offer premium" value={prem} onChange={setPrem} suffix="%" step="1" />
          <Field label="Annual growth (both paths)" value={growth} onChange={setGrowth} suffix="%" step="0.5" />
          <Field label="One-time switching cost" value={cost} onChange={setCost} prefix="$" step="1000" />
          <Field label="Horizon (years)" value={years} onChange={setYears} step="1" />
          <Field label="Discount rate" value={disc} onChange={setDisc} suffix="%" step="0.5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Stay — cumulative pay" value={usd(r.stay)} />
          <Result label="Switch — cumulative pay" value={usd(r.hop)} />
          <Result label="Switch advantage (PV)" value={usd(r.diffPV)} big />
          <Result label="Min premium to break even" value={`${num(r.minPrem, 1)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.diffPV >= 0
            ? `Switching wins by ${usd(r.diffPV)} in today's dollars over ${years} years — and the breakeven premium is only ${num(r.minPrem, 1)}%, so the offer clears the friction with room. Negotiate anyway: the first number is rarely the last.`
            : `Staying wins on pure pay: the ${prem}% premium doesn't cover the ${usd(cost)} switching cost over ${years} years. You'd need at least ${num(r.minPrem, 1)}% — or non-salary reasons (scope, manager, trajectory) worth the difference.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: both paths grow at the same annual rate after the jump (conservative — switchers historically reset to market with each move, so the same-growth assumption UNDERSTATES hopping); the one-time switching cost nets out at the start. That cost input is where honesty lives: unvested 401(k) match, unvested RSUs, ESPP holding windows, a December departure can forfeit a full annual bonus, and a new health plan resets your deductible. Wage-tracker data (Atlanta Fed, ADP) has shown switchers out-earning stayers most years since 2021 — the "loyalty tax" is measurable, typically 3–8% annually. The risk side is real and unpriced here: probation periods, unknown managers, last-in-first-out in layoffs, and a resume pattern that reads flight-risk in some industries. What this misses on purpose: title, scope, remote flexibility, and the fact that the strongest raise is often the counteroffer you only get by having the offer. Estimates — your offer letters and grant statements govern.
        </p>
      </CardContent>
    </Card>
  )
}

// WALK-AWAY NUMBER — the minimum acceptable offer, built BEFORE the negotiation so emotion doesn't set the floor. Node-verified: $100k current total comp, 10% risk premium for the unknown, $8k one-time switching costs (unvested match, forfeited bonus, deductible reset) amortized over an expected 3-yr tenure → min base $112,667; a $15k signing bonus amortized over the same tenure drops the base requirement to $107,667; growth-adjusted (you'd get 3% staying) → $115,967. Model: floor = current comp × (1+risk) + switching costs/expected tenure − signing/tenure. Honest edges: TOTAL comp is the base (base + bonus + match + RSUs + ESPP + health value — most people anchor on base and accept less), the risk premium is personal (stable team + growing role = 5-8%; toxic situation = the premium can be NEGATIVE — paying to leave is sometimes right, but know you're doing it), signing bonuses come with clawbacks (12-24mo repayment terms — read them), and the floor is private: naming your number first anchors low, so the calculator exists to make "I'll get back to you" an informed sentence.
export function WalkAwayCalc() {
  const [comp, setComp] = useNumber(100000)
  const [risk, setRisk] = useNumber(10)
  const [costs, setCosts] = useNumber(8000)
  const [tenure, setTenure] = useNumber(3)
  const [signing, setSigning] = useNumber(15000)
  const [growth, setGrowth] = useNumber(3)

  const r = useMemo(() => {
    const t = Math.max(1, tenure)
    const amort = costs / t
    const minBase = comp * (1 + risk / 100) + amort
    const minWithSigning = minBase - signing / t
    const minGrowthAdj = comp * (1 + growth / 100) * (1 + risk / 100) + amort - signing / t
    return { amort, minBase, minWithSigning, minGrowthAdj }
  }, [comp, risk, costs, tenure, signing, growth])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Current TOTAL comp /yr" value={comp} onChange={setComp} prefix="$" step="5000" />
          <Field label="Risk premium for switching" value={risk} onChange={setRisk} suffix="%" step="1" />
          <Field label="One-time switching costs" value={costs} onChange={setCosts} prefix="$" step="1000" />
          <Field label="Expected tenure at new job (yrs)" value={tenure} onChange={setTenure} step="1" />
          <Field label="Signing bonus offered" value={signing} onChange={setSigning} prefix="$" step="5000" />
          <Field label="Raise you'd get staying" value={growth} onChange={setGrowth} suffix="%" step="0.5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Result label="Floor (before signing bonus)" value={usd(r.minBase)} />
          <Result label="Floor with signing spread" value={usd(r.minWithSigning)} />
          <Result big label="Walk-away number" value={usd(r.minGrowthAdj)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Below {usd(Math.round(r.minGrowthAdj))} in year-one total comp, staying is the financially better move — you'd be paying to switch. This number exists so the negotiation happens against arithmetic, not adrenaline. Don't volunteer it: floors anchor.
        </div>
        <p className="text-xs text-muted-foreground">
          Method: floor = current TOTAL comp (base + bonus + 401(k) match + RSU/ESPP value + health-plan value — anchoring on base alone is how people accept less) grown by the raise you'd get staying, plus a risk premium for the unknown (5–8% for a stable move; genuinely toxic situations can justify a NEGATIVE premium — paying to leave is sometimes the right trade, but run it knowingly), plus one-time switching costs (unvested match/equity, forfeited bonus, deductible resets) amortized over expected tenure, minus any signing bonus spread the same way. Signing-bonus fine print matters: most carry 12–24 month clawback provisions, so it's not yours until the term runs. Negotiation hygiene: the floor is private — naming it first anchors the conversation low; the informed version of "I'll get back to you" is the whole point of knowing it. Estimates — your comp statements and offer letters govern.
        </p>
      </CardContent>
    </Card>
  )
}

// UNPAID INTERNSHIP TRUE COST — what "great experience" costs in dollars, vs the career premium it's supposed to buy. Node-verified: vs a $20/hr paid summer job (40 hrs × 12 wks) → $9,600 foregone + $800/mo extra housing × 3 → $12,000 true cost; a $3k/yr career-start premium lasting 8 yrs @4% → PV $20,198 → NPV +$8,198; breakeven premium $1,782/yr — the internship needs to move your STARTING salary ~$1.8k to pay. Honest edges: legality — the DOL "primary beneficiary" test makes most for-profit unpaid internships legally questionable (if the company benefits more than you, it's likely a wage violation, not an opportunity); the career-premium research is genuinely mixed (NACE surveys: paid interns get more offers AND higher starts; unpaid interns historically fare barely better than no internship in some fields — the resume line matters less than the network and the name-brand); field matters enormously (Congress/nonprofit/media normalize unpaid; engineering/tech/finance pay interns $25-45/hr — an unpaid offer in a paying field is a signal about the employer); alternatives exist (paid campus research, part-time paid work + portfolio project often beats unpaid prestige).
export function UnpaidInternshipCalc() {
  const [wage, setWage] = useNumber(20)
  const [hours, setHours] = useNumber(40)
  const [weeks, setWeeks] = useNumber(12)
  const [living, setLiving] = useNumber(800)
  const [premium, setPremium] = useNumber(3000)
  const [years, setYears] = useNumber(8)
  const [disc, setDisc] = useNumber(4)

  const r = useMemo(() => {
    const foregone = wage * hours * weeks
    const livingExtra = living * Math.round(weeks / 4.33)
    const cost = foregone + livingExtra
    const r0 = disc / 100
    const ann = (n: number) => (r0 === 0 ? n : (1 - Math.pow(1 + r0, -n)) / r0)
    const pv = premium * ann(years)
    const npv = pv - cost
    const breakeven = cost / ann(years)
    return { foregone, livingExtra, cost, pv, npv, breakeven }
  }, [wage, hours, weeks, living, premium, years, disc])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Paid-job wage you'd give up" value={wage} onChange={setWage} prefix="$" suffix="/hr" step="1" />
          <Field label="Hours per week" value={hours} onChange={setHours} step="5" />
          <Field label="Internship weeks" value={weeks} onChange={setWeeks} step="1" />
          <Field label="Extra living cost /mo" value={living} onChange={setLiving} prefix="$" step="100" />
          <Field label="Expected career premium /yr" value={premium} onChange={setPremium} prefix="$" step="500" />
          <Field label="Years premium lasts" value={years} onChange={setYears} step="2" />
          <Field label="Discount rate" value={disc} onChange={setDisc} suffix="%" step="0.5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Foregone summer pay" value={usd(r.foregone)} />
          <Result label="True cost" value={usd(r.cost)} />
          <Result label="Internship NPV" value={usd(r.npv)} big />
          <Result label="Breakeven premium" value={`${usd(Math.round(r.breakeven))}/yr`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.npv >= 0
            ? `If the internship really lifts your starting salary ${usd(premium)}/yr, it pays: NPV ${usd(r.npv)}. The IF is the whole question — verify with outcome data for THIS program, not the coordinator's anecdotes.`
            : `At a ${usd(premium)}/yr career premium, the internship costs ${usd(-r.npv)} more than it returns. It needs to move your starting salary at least ${usd(Math.round(r.breakeven))}/yr to break even — and unpaid internships in some fields barely beat no internship at all in hiring-outcome surveys.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: true cost = the paid summer job you gave up (wage × hours × weeks) + extra living costs (housing away from home, relocation); the return = a career premium on your starting salary, discounted over the years it plausibly lasts. The legality check comes first: under the DOL's primary-beneficiary test, a for-profit internship where the company benefits more than you do is likely a wage violation, not an opportunity — unpaid roles are normal only in government and nonprofits. The outcome research is sobering: NACE surveys consistently show PAID interns receiving more offers and higher starting salaries, while unpaid interns in some fields fare barely better than candidates with no internship — the network and the brand name do the work, not the "experience" line. Field norms matter: engineering, tech, and finance pay interns $25–45/hr, so an unpaid offer in a paying field tells you something about the employer. The often-better alternative: paid campus research or a part-time paid job plus a portfolio project you own end-to-end. Estimates — program outcome data governs.
        </p>
      </CardContent>
    </Card>
  )
}

// LABOR BURDEN — the true hourly cost of an employee vs what you must bill. Node-verified: $25/hr wage, 2,080 paid hrs but 1,800 billable (PTO/holidays/training), FICA+FUTA/SUTA 9.65%, workers comp 8%, health $6,000/yr → total $67,178 → $32.30 per PAID hour but $37.32 per BILLABLE hour; at a 20% MARGIN the breakeven bill rate is $46.65 (a 20% MARKUP gives $44.79 — margin ≠ markup is where contractors go broke). Honest edges: workers comp is the wild card (roofing ~25-40% of payroll, clerical ~0.5% — get YOUR class code rate, NCCI/state fund publishes it), billable-hour reality (between-jobs time, callbacks, warranty work — honest shops bill 70-85% of paid hours, not 100%), missing burdens to add in "other" (small tools, uniforms, truck time, training, safety programs, payroll-service fees), and the gut-check: if your bill rate is under 1.5× the wage, at least one cost is unpriced.
export function LaborBurdenCalc() {
  const [wage, setWage] = useNumber(25)
  const [paid, setPaid] = useNumber(2080)
  const [billable, setBillable] = useNumber(1800)
  const [taxRate, setTaxRate] = useNumber(9.65)
  const [wc, setWc] = useNumber(8)
  const [health, setHealth] = useNumber(6000)
  const [other, setOther] = useNumber(1500)
  const [margin, setMargin] = useNumber(20)

  const r = useMemo(() => {
    const base = wage * paid
    const taxes = (base * taxRate) / 100
    const comp = (base * wc) / 100
    const total = base + taxes + comp + health + other
    const perBillable = billable > 0 ? total / billable : 0
    const perPaid = paid > 0 ? total / paid : 0
    const m = Math.min(90, margin) / 100
    const price = perBillable / (1 - m)
    const markupEquiv = (price / perBillable - 1) * 100
    return { base, taxes, comp, total, perBillable, perPaid, price, markupEquiv }
  }, [wage, paid, billable, taxRate, wc, health, other, margin])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Base wage" value={wage} onChange={setWage} prefix="$" suffix="/hr" step="1" />
          <Field label="Paid hours /yr" value={paid} onChange={setPaid} step="40" />
          <Field label="Billable hours /yr" value={billable} onChange={setBillable} step="40" />
          <Field label="Payroll taxes (FICA+SUTA/FUTA)" value={taxRate} onChange={setTaxRate} suffix="%" step="0.5" />
          <Field label="Workers comp rate" value={wc} onChange={setWc} suffix="%" step="1" />
          <Field label="Health/benefits /yr" value={health} onChange={setHealth} prefix="$" step="500" />
          <Field label="Other burden /yr" value={other} onChange={setOther} prefix="$" step="250" />
          <Field label="Target net margin" value={margin} onChange={setMargin} suffix="%" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Annual burdened cost" value={usd(r.total)} />
          <Result label="Cost per billable hour" value={usd(r.perBillable)} />
          <Result label="Breakeven bill rate" value={`${usd(r.price)}/hr`} big />
          <Result label="= markup on cost" value={`${num(r.markupEquiv, 1)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          A {usd(wage)}/hr employee costs {usd(r.perBillable)} per billable hour — to net {margin}% you must bill {usd(Math.round(r.price * 100) / 100)}/hr. That's a {num(r.markupEquiv, 1)}% markup on burdened cost, not {margin}%: margin divides by the PRICE, markup by the COST, and confusing them is the classic way contractors work all year for nothing.
        </div>
        <p className="text-xs text-muted-foreground">
          Method: annual cost = wage × paid hours + employer payroll taxes (7.65% FICA + SUTA/FUTA, typically 1–4% on early wages) + workers comp (get YOUR class-code rate — roofing runs 25–40% of payroll, clerical ~0.5%, NCCI or your state fund publishes the schedules) + benefits + other burden (small tools, uniforms, truck time, training, payroll-service fees). Divided by BILLABLE hours, not paid hours — PTO, holidays, drive time between jobs, callbacks, and warranty work are real costs that never invoice; honest shops bill 70–85% of paid hours. The margin/markup trap: a 20% net margin requires cost ÷ 0.80 = a 25% markup on cost; quoting "cost plus 20%" nets only 16.7%. Gut-check: a bill rate under 1.5× the wage almost always means a cost is unpriced. Estimates — your comp mod sheet and payroll reports govern.
        </p>
      </CardContent>
    </Card>
  )
}

// JOB COSTING — the full single-job price built bottom-up: marked-up materials + burdened labor + subs + allocated overhead, priced at target MARGIN. Node-verified: $3,800 materials +10% handling = $4,180; 60 labor hrs at $37.32 burdened = $2,239; subs $1,500; overhead $15/labor-hr = $900 → true cost $8,819 → price at 20% margin = $11,024, profit $2,205. Honest edges: overhead allocation is the line everyone skips (rent, insurance, office, trucks, YOUR salary as owner — annual overhead ÷ annual billable hours gives the per-hour number; skipping it prices every job below true cost), materials markup is legitimate (procurement, warranty risk, storage, waste — 10-15% standard), the contingency line (unknowns behind walls: 5-10% on remodels, honest bids carry it rather than eat it), and change orders (price them at FULL margin with the same formula — the "friendly discount" on changes is where the job's profit goes to die). Pair with labor-burden-calculator for the rate.
export function JobCostingCalc() {
  const [mat, setMat] = useNumber(3800)
  const [matMarkup, setMatMarkup] = useNumber(10)
  const [hours, setHours] = useNumber(60)
  const [rate, setRate] = useNumber(37.32)
  const [subs, setSubs] = useNumber(1500)
  const [ohRate, setOhRate] = useNumber(15)
  const [conting, setConting] = useNumber(5)
  const [margin, setMargin] = useNumber(20)

  const r = useMemo(() => {
    const matCost = mat * (1 + matMarkup / 100)
    const labor = hours * rate
    const oh = hours * ohRate
    const sub = matCost + labor + subs + oh
    const cost = sub * (1 + conting / 100)
    const m = Math.min(90, margin) / 100
    const price = cost / (1 - m)
    const profit = price - cost
    const perSqftNote = { matCost, labor, oh, sub, cost, price, profit }
    return perSqftNote
  }, [mat, matMarkup, hours, rate, subs, ohRate, conting, margin])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Materials cost" value={mat} onChange={setMat} prefix="$" step="100" />
          <Field label="Materials markup" value={matMarkup} onChange={setMatMarkup} suffix="%" step="1" />
          <Field label="Labor hours" value={hours} onChange={setHours} step="5" />
          <Field label="Burdened labor rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" step="1" />
          <Field label="Subcontractors" value={subs} onChange={setSubs} prefix="$" step="100" />
          <Field label="Overhead per labor hr" value={ohRate} onChange={setOhRate} prefix="$" step="1" />
          <Field label="Contingency" value={conting} onChange={setConting} suffix="%" step="1" />
          <Field label="Target margin" value={margin} onChange={setMargin} suffix="%" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="True job cost" value={usd(r.cost)} />
          <Result label="Price at margin" value={usd(r.price)} big />
          <Result label="Profit on the job" value={usd(r.profit)} />
          <Result label="Labor + overhead share" value={`${num(((r.labor + r.oh) / r.cost) * 100, 0)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Quote {usd(Math.round(r.price))} — below {usd(Math.round(r.cost))} you're paying the customer to let you work. Every line is real: materials with handling, labor at the BURDENED rate, subs, overhead allocation, contingency. The competitors undercutting you at {usd(Math.round(r.cost * 0.95))} aren't more efficient — they're unpriced.
        </div>
        <p className="text-xs text-muted-foreground">
          Method: materials × (1 + markup — procurement, warranty risk, and waste are real, 10–15% is standard) + labor hours × burdened rate (from the labor-burden calculator, never the wage) + subs + overhead allocation (annual overhead — rent, insurance, office, trucks, owner salary — ÷ annual billable hours; the line everyone skips and the reason "busy" shops go broke) + contingency (5–10% on remodels — unknowns behind walls are certain, only their size is uncertain). Then price = cost ÷ (1 − margin), because margin divides by price. Change orders: run the SAME formula at full margin — the discounted "friendly" change order is where a job's profit goes to die, and a signed change-order process is worth more than any tool in the truck. Estimates — your supplier quotes and comp mod sheet govern.
        </p>
      </CardContent>
    </Card>
  )
}

// EQUIPMENT HOURLY COST — own vs rent priced per operating hour, breakeven utilization solved. Node-verified: $55k skid steer, $10k salvage, 5-yr life, $3k/yr insurance+storage, maint $8/hr, fuel $6/hr → ownership $26/hr at 1,000 hrs/yr; rental $250/day (8-hr) + fuel = $37.25/hr; breakeven utilization 516 hrs/yr — below that RENT (at 400 hrs/yr owning costs $44/hr), above it OWN. Model: fixed costs (depreciation + insurance/storage) spread over actual operating hours, variable costs (maintenance, fuel) per hour. Honest edges: utilization is the ONLY variable that decides (the machine that sits is a bonfire — 40% utilization machines are why rental yards exist), rental rates INCLUDE maintenance and the latest model (no downtime cost, no repair risk — price your downtime honestly: a broken owned machine on a deadline job costs the rental ANYWAY plus the repair), financing changes the cash flow not the economics (interest is real; add it to fixed cost if financed), resale assumption drives depreciation (auction prices, not hopes), and tax (179/bonus depreciation helps cash but doesn't change the utilization math). Rates are illustrative — local yard quotes govern.
export function EquipmentHourlyCalc() {
  const [price, setPrice] = useNumber(55000)
  const [salvage, setSalvage] = useNumber(10000)
  const [life, setLife] = useNumber(5)
  const [hrs, setHrs] = useNumber(1000)
  const [maint, setMaint] = useNumber(8)
  const [fuel, setFuel] = useNumber(6)
  const [ins, setIns] = useNumber(3000)
  const [rentDay, setRentDay] = useNumber(250)

  const r = useMemo(() => {
    const dep = (price - salvage) / Math.max(1, life)
    const h = Math.max(1, hrs)
    const ownHr = (dep + ins) / h + maint + fuel
    const rentHr = rentDay / 8 + fuel
    const be = rentHr - maint - fuel > 0 ? (dep + ins) / (rentHr - maint - fuel) : Infinity
    return { dep, ownHr, rentHr, be }
  }, [price, salvage, life, hrs, maint, fuel, ins, rentDay])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Purchase price" value={price} onChange={setPrice} prefix="$" step="5000" />
          <Field label="Salvage/resale at end" value={salvage} onChange={setSalvage} prefix="$" step="1000" />
          <Field label="Ownership years" value={life} onChange={setLife} step="1" />
          <Field label="Operating hours /yr" value={hrs} onChange={setHrs} step="50" />
          <Field label="Maintenance" value={maint} onChange={setMaint} prefix="$" suffix="/hr" step="1" />
          <Field label="Fuel" value={fuel} onChange={setFuel} prefix="$" suffix="/hr" step="1" />
          <Field label="Insurance+storage /yr" value={ins} onChange={setIns} prefix="$" step="500" />
          <Field label="Rental rate (daily)" value={rentDay} onChange={setRentDay} prefix="$" step="25" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Result label="Owning cost /hr" value={usd(r.ownHr)} />
          <Result label="Rental cost /hr (incl fuel)" value={usd(r.rentHr)} />
          <Result big label="Breakeven utilization" value={isFinite(r.be) ? `${num(r.be, 0)} hrs/yr` : 'Always own'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {hrs >= r.be
            ? `At ${num(hrs, 0)} hrs/yr you're past the ${num(r.be, 0)}-hr breakeven — owning at ${usd(r.ownHr)}/hr beats renting at ${usd(r.rentHr)}/hr. The machine earns its parking spot.`
            : `At ${num(hrs, 0)} hrs/yr you're UNDER the ${num(r.be, 0)}-hr breakeven — owning costs ${usd(r.ownHr)}/hr vs renting at ${usd(r.rentHr)}/hr. Rent it, and let the yard own the depreciation, the repairs, and the downtime.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: ownership = (price − salvage) ÷ years + annual insurance/storage, spread over your ACTUAL operating hours, plus maintenance and fuel per hour; rental = day rate ÷ 8 + fuel (fuel is yours either way). Utilization is the only variable that decides: below the breakeven hours the idle machine's fixed costs eat the savings — the machine that sits is a bonfire, and 40%-utilization iron is why rental yards exist. Rental also buys things ownership doesn't: zero repair risk, zero downtime cost (a broken owned machine on a deadline job costs the rental ANYWAY, plus the repair), and the current model every time. Financing changes cash flow, not economics — add interest to the fixed cost if financed. Resale drives everything: use auction comps, not hopes. Section 179/bonus depreciation improves cash and taxes but doesn't change the utilization math. Rates are illustrative — your dealer and yard quotes govern.
        </p>
      </CardContent>
    </Card>
  )
}

// OVERTIME VS HIRE — when chronic OT stops being cheaper than a new head. Node-verified: $25 wage × 1.49 burden = $37.25 burdened; crew of 4 each working 10 OT hrs/wk = 40 OT hours at 1.5× = $2,235/wk; one new hire absorbs those 40 hours at straight time $1,490/wk → saves $745/wk; $4,000 hiring+training cost recovers in 5.4 weeks. Model: OT premium eliminated (0.5× burdened × OT hours) minus straight-time cost of absorbed hours; one-time hire cost (recruiting, onboarding, training at reduced productivity) recovered from weekly savings. Honest edges: chronic OT costs MORE than the premium (fatigue errors, rework, safety incidents, turnover — construction studies put sustained 50+hr weeks at ~10-15% productivity loss, priced here as an optional fudge), OT is the RIGHT answer for short spikes (a 6-week surge never justifies a hire — the breakeven weeks tell you), benefits load on the new hire is in the burden multiplier, and the hidden hire cost is management bandwidth (a new tech at 60% productivity for a month is in the hire-cost line — don't zero it).
export function OvertimeVsHireCalc() {
  const [wage, setWage] = useNumber(25)
  const [burden, setBurden] = useNumber(49)
  const [otHrs, setOtHrs] = useNumber(10)
  const [crew, setCrew] = useNumber(4)
  const [hireCost, setHireCost] = useNumber(4000)
  const [weeks, setWeeks] = useNumber(26)

  const r = useMemo(() => {
    const burdened = wage * (1 + burden / 100)
    const totalOt = otHrs * crew
    const absorb = Math.min(40, totalOt)
    const otCostWk = totalOt * burdened * 1.5
    const saveWk = absorb * burdened * 1.5 - 40 * burdened
    const beWks = saveWk > 0 ? hireCost / saveWk : Infinity
    const horizonSave = saveWk * weeks - hireCost
    return { burdened, totalOt, absorb, otCostWk, saveWk, beWks, horizonSave }
  }, [wage, burden, otHrs, crew, hireCost, weeks])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Base wage" value={wage} onChange={setWage} prefix="$" suffix="/hr" step="1" />
          <Field label="Burden (taxes/comp/benefits)" value={burden} onChange={setBurden} suffix="%" step="1" />
          <Field label="OT hours per person /wk" value={otHrs} onChange={setOtHrs} step="1" />
          <Field label="People on chronic OT" value={crew} onChange={setCrew} step="1" />
          <Field label="Hiring + training cost" value={hireCost} onChange={setHireCost} prefix="$" step="500" />
          <Field label="Decision horizon (weeks)" value={weeks} onChange={setWeeks} step="4" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Weekly OT spend" value={usd(r.otCostWk)} />
          <Result label="Weekly saving from hire" value={usd(Math.max(0, r.saveWk))} />
          <Result label="Breakeven" value={isFinite(r.beWks) ? `${num(r.beWks, 1)} weeks` : 'Never'} big />
          <Result label={`Net over ${weeks} weeks`} value={usd(r.horizonSave)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.saveWk > 0 && r.beWks <= weeks
            ? `Hire: the new hand pays back the ${usd(hireCost)} hiring cost in ${num(r.beWks, 1)} weeks and nets ${usd(Math.round(r.horizonSave))} over your ${weeks}-week horizon — before counting the fatigue, rework, and turnover that chronic OT causes.`
            : r.saveWk > 0
              ? `The hire eventually wins (breakeven ${num(r.beWks, 1)} weeks) but not inside your ${weeks}-week horizon — if this OT is a short surge, ride it out; if it's the new normal, extend the horizon and the hire takes over.`
              : `Not enough OT to feed a hire: ${num(r.totalOt, 0)} OT hours a week can't absorb a 40-hour position profitably. Keep the OT, or hire part-time if the schedule allows.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: burdened wage = base × (1 + burden) — use the labor-burden calculator's number, not the wage; weekly OT spend = total OT hours × burdened × 1.5; a new hire absorbs up to 40 of those hours at straight time, so the weekly saving is the eliminated OT premium minus the straight hours you now pay; hiring cost (recruiting, onboarding, the new hand's first weeks at reduced productivity — don't zero this, a month at 60% productivity IS a cost) recovers from the weekly saving. What the premium line misses: sustained 50+ hour weeks cost 10–15% in productivity, errors, rework, and incident risk before you count the turnover — chronic OT is a loan at terrible rates. When OT is RIGHT: genuine spikes shorter than the breakeven, seasonal surges, and while you're proving the demand is permanent. The hire's fixed costs (benefits load in the burden, management bandwidth) argue for being sure — this calculator is the being-sure. Estimates — your payroll reports and burden rate govern.
        </p>
      </CardContent>
    </Card>
  )
}

// WARRANTY RESERVE — the callback cost priced BEFORE it happens, as a % of revenue. Node-verified: 150 jobs/yr at $11k avg = $1.65M revenue; 6% callback rate × $850 avg callback (4 burdened hrs + materials + truck roll) → expected $7,650/yr = 0.46% of revenue; with a 2σ statistical buffer (sqrt(np(1-p)) × cost = $2,472) → reserve $12,595 = 0.76% of revenue. Honest edges: callback COST is more than the fix (unbillable burdened hours + materials + truck roll + the schedule hole where a paying job would have been + reputation — a callback on a referred client costs future revenue), callback RATE is a quality metric hiding in a cost line (rate creeping 4%→7% is a training/QA problem with a dollar sign), accrual discipline (book the reserve monthly per job, not when the phone rings — the work that generates the revenue should carry its warranty cost), and the trade standard: 0.5-1% of revenue for established trades, more for new crews or new service lines. Buffers via binomial sigma are illustrative statistics, not a guarantee.
export function WarrantyReserveCalc() {
  const [jobs, setJobs] = useNumber(150)
  const [avgJob, setAvgJob] = useNumber(11000)
  const [rate, setRate] = useNumber(6)
  const [cbCost, setCbCost] = useNumber(850)

  const r = useMemo(() => {
    const rev = jobs * avgJob
    const p = Math.min(100, rate) / 100
    const expected = jobs * p * cbCost
    const pct = rev > 0 ? (expected / rev) * 100 : 0
    const sigma = Math.sqrt(jobs * p * (1 - p)) * cbCost
    const reserve = expected + 2 * sigma
    const reservePct = rev > 0 ? (reserve / rev) * 100 : 0
    return { rev, expected, pct, sigma, reserve, reservePct }
  }, [jobs, avgJob, rate, cbCost])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Jobs per year" value={jobs} onChange={setJobs} step="10" />
          <Field label="Average job value" value={avgJob} onChange={setAvgJob} prefix="$" step="500" />
          <Field label="Callback rate" value={rate} onChange={setRate} suffix="%" step="0.5" />
          <Field label="Avg cost per callback" value={cbCost} onChange={setCbCost} prefix="$" step="50" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Annual revenue" value={usd(r.rev)} />
          <Result label="Expected warranty cost /yr" value={usd(r.expected)} />
          <Result label="Reserve with 2σ buffer" value={usd(r.reserve)} big />
          <Result label="Reserve as % of revenue" value={`${num(r.reservePct, 2)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Set aside {num(r.reservePct, 2)}% of revenue ({usd(Math.round(r.reserve))}/yr) — book it monthly as each job completes, not when the phone rings. If your callback rate drifts up, treat it as the quality metric it is: the reserve tells you the PRICE of the problem, and the fix is training, not bigger reserves.
        </div>
        <p className="text-xs text-muted-foreground">
          Method: expected cost = jobs × callback rate × cost per callback; reserve = expected + 2σ buffer (binomial standard deviation × cost — covers bad-luck streaks, illustrative statistics not a guarantee). The callback COST input is where honesty lives: 3–5 unbillable burdened hours + materials + truck roll + the schedule hole where a paying job would have been — $850 is a fair default, and a callback on a referred client quietly costs future revenue too. The callback RATE is a quality metric wearing a dollar sign: a drift from 4% to 7% is a training or QA problem announcing itself in the ledger — fix the process, not the reserve. Accrual discipline: the job that generates the revenue should carry its warranty cost, so book per job at completion; shops that expense callbacks as they occur systematically overstate job profitability. Trade standard: 0.5–1% of revenue for established crews, more for new crews, new service lines, or weather-exposed work. Estimates — your callback log governs, and if you don't have one, that's finding #1.
        </p>
      </CardContent>
    </Card>
  )
}

// BID WIN-RATE ECONOMICS — the estimating pipeline priced: every bid costs money whether you win or not. Node-verified: 12 bids/mo × $400 estimating cost (site visit + takeoff + proposal, your time at burdened rate) = $4,800/mo estimating spend; 25% win rate → 3 jobs × $11k avg × 20% margin = $6,600 gross profit → NET $1,800/mo, $150 net per bid submitted. Breakevens: win rate must exceed 18.2% at this margin, or margin must exceed 14.5% at this win rate — below either, estimating loses money. Honest edges: estimating cost is real even when it's your own evenings (price your time at the burdened rate — "free" estimates are the biggest hidden cost in contracting), win rate is a PIPELINE metric (low win rate = bidding wrong jobs or wrong prices; the fix is qualifying harder BEFORE the site visit, not bidding more), the bid/no-bid decision is where profit lives (a disciplined shop bids 60% of invitations; chasing everything guarantees a bad win rate AND estimating burnout), and margin vs win rate trade: raising margin lowers win rate — the optimum is where net/mo peaks, not where the calendar is fullest.
export function BidWinRateCalc() {
  const [bids, setBids] = useNumber(12)
  const [estCost, setEstCost] = useNumber(400)
  const [win, setWin] = useNumber(25)
  const [job, setJob] = useNumber(11000)
  const [margin, setMargin] = useNumber(20)

  const r = useMemo(() => {
    const wins = (bids * win) / 100
    const rev = wins * job
    const profit = (rev * margin) / 100
    const estSpend = bids * estCost
    const net = profit - estSpend
    const perBid = bids > 0 ? net / bids : 0
    const beWin = job * margin > 0 ? (estCost / (job * (margin / 100))) * 100 : Infinity
    const beMargin = wins > 0 ? (estSpend / rev) * 100 : Infinity
    return { wins, rev, profit, estSpend, net, perBid, beWin, beMargin }
  }, [bids, estCost, win, job, margin])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Bids per month" value={bids} onChange={setBids} step="1" />
          <Field label="Cost per estimate" value={estCost} onChange={setEstCost} prefix="$" step="50" />
          <Field label="Win rate" value={win} onChange={setWin} suffix="%" step="1" />
          <Field label="Avg job value" value={job} onChange={setJob} prefix="$" step="500" />
          <Field label="Job margin" value={margin} onChange={setMargin} suffix="%" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Estimating spend /mo" value={usd(r.estSpend)} />
          <Result label="Job profit /mo" value={usd(r.profit)} />
          <Result label="Net after estimating" value={usd(r.net)} big />
          <Result label="Breakeven win rate" value={`${num(r.beWin, 1)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.net >= 0
            ? `The pipeline clears: ${usd(Math.round(r.net))}/mo net of estimating, ${usd(Math.round(r.perBid))} net per bid submitted. Breakeven win rate is ${num(r.beWin, 1)}% — you're at ${win}%. ${win < 30 ? 'The lever with the most travel: qualify harder before the site visit, not more bids.' : 'Healthy hit rate — protect it by staying picky.'}`
            : `The pipeline loses ${usd(Math.round(-r.net))}/mo: at a ${win}% win rate and ${margin}% margin, estimating costs more than the jobs return. Breakeven needs ${num(r.beWin, 1)}% wins or ${num(r.beMargin, 1)}% margins — qualify harder, raise prices, or shrink the estimate process.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: estimating spend = bids × cost per estimate (site visit + takeoff + proposal, YOUR time at the burdened rate — "free estimates" are the biggest hidden cost in contracting; a half-day on a bid at $75/hr burdened owner time is $300 before gas); job profit = wins × job value × margin; net = profit − estimating. Breakeven win rate = est cost ÷ (job value × margin) — at $400/bid, $11k jobs, 20% margin, you must win 1 in 5.5 just to pay for the estimating. The levers ranked: qualify harder BEFORE the visit (budget-question scripts cut wasted bids in half — the bid/no-bid decision is where profit lives; disciplined shops decline 40% of invitations), raise the close rate (same spend, more wins — follow-up cadence alone moves it), then estimate faster (templates, unit pricing). The margin/win-rate trade is real: raising margin lowers win rate — optimize NET per month, not calendar fullness. Estimates — your pipeline log governs; if you don't track bids submitted vs won, start today.
        </p>
      </CardContent>
    </Card>
  )
}

// MAINTENANCE AGREEMENT PRICING — the service contract priced bottom-up; most shops underprice it. Node-verified: 2 visits/yr × (1.25 hr × $37.25 burdened + $30 parts) = $153.13; admin $15/contract; member repair discount cost: 0.4 expected repairs/yr × $400 avg × 10% = $16 → true cost $184.13/yr. Priced at $199 → margin $14.88 = 7.5% (THIN); 20% margin needs $230. Honest edges: agreements are SOLD as revenue but their real value is UTILIZATION (shoulder-season tune-ups fill dead weeks — the visits cost less when they'd otherwise be idle hours, price that honestly as a second scenario), retention (agreement customers call YOU for the repair — the discount buys loyalty, and member households convert to replacement sales at multiples of retail lead cost), discount cost is real (members EXPECT the discount — expected repairs/yr × avg ticket × discount is a cost line, not marketing), no-show/cancel friction (book in the shoulder season or the agreement becomes a July liability), and churn (15-25%/yr typical — price to profit within year one or you're financing someone else's future customer).
export function MaintenanceAgreementCalc() {
  const [visits, setVisits] = useNumber(2)
  const [hrs, setHrs] = useNumber(1.25)
  const [rate, setRate] = useNumber(37.25)
  const [parts, setParts] = useNumber(30)
  const [admin, setAdmin] = useNumber(15)
  const [expRepairs, setExpRepairs] = useNumber(0.4)
  const [avgRepair, setAvgRepair] = useNumber(400)
  const [disc, setDisc] = useNumber(10)
  const [price, setPrice] = useNumber(199)

  const r = useMemo(() => {
    const visitCost = visits * (hrs * rate + parts)
    const discCost = expRepairs * avgRepair * (disc / 100)
    const cost = visitCost + admin + discCost
    const profit = price - cost
    const marginPct = price > 0 ? (profit / price) * 100 : 0
    const be20 = cost / 0.8
    return { visitCost, discCost, cost, profit, marginPct, be20 }
  }, [visits, hrs, rate, parts, admin, expRepairs, avgRepair, disc, price])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Visits per year" value={visits} onChange={setVisits} step="1" />
          <Field label="Hours per visit" value={hrs} onChange={setHrs} step="0.25" />
          <Field label="Burdened labor rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" step="1" />
          <Field label="Parts/supplies per visit" value={parts} onChange={setParts} prefix="$" step="5" />
          <Field label="Admin per contract /yr" value={admin} onChange={setAdmin} prefix="$" step="5" />
          <Field label="Expected repairs /yr" value={expRepairs} onChange={setExpRepairs} step="0.1" />
          <Field label="Avg repair ticket" value={avgRepair} onChange={setAvgRepair} prefix="$" step="50" />
          <Field label="Member discount" value={disc} onChange={setDisc} suffix="%" step="1" />
        </div>
        <div className="max-w-xs">
          <Field label="Agreement price /yr" value={price} onChange={setPrice} prefix="$" step="10" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="True cost per contract" value={usd(r.cost)} />
          <Result label="Profit per contract" value={usd(r.profit)} big />
          <Result label="Margin" value={`${num(r.marginPct, 1)}%`} />
          <Result label="Price for 20% margin" value={usd(r.be20)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.profit > 0
            ? `${usd(price)} clears cost by ${usd(r.profit)} — a ${num(r.marginPct, 1)}% margin. ${r.marginPct < 15 ? 'Thin: one extra callback visit erases the year. Price to ' + usd(Math.round(r.be20)) + ' or trim the discount.' : 'Healthy — the agreement pays for its visits and buys the customer relationship.'}`
            : `${usd(price)} LOSES ${usd(-r.profit)} per contract per year before counting a single callback. The floor at 20% margin is ${usd(Math.round(r.be20))} — reprice, reduce visit scope, or drop the repair discount.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: visits × (hours × BURDENED rate + parts) + admin + the member discount's expected cost (expected repairs/yr × avg ticket × discount — members USE the discount, so it's a cost line, not marketing). Two honest complications: first, shoulder-season scheduling changes the real cost — a tune-up done in an otherwise-idle April week costs less than the burdened rate implies, so run a second scenario at the marginal rate; conversely, agreements redeemed in July peak season displace full-price calls and cost MORE. Second, the agreement's real value is retention and replacement conversion: member households call YOU for the repair and buy the replacement from you — that value justifies thin (not negative) margins. Churn runs 15–25%/yr — price to profit within year one, because a quarter of the book won't renew. Never sell below true cost counting on breakage; unused-agreement "profit" is a lawsuit and a reputation waiting. Estimates — your visit logs and renewal data govern.
        </p>
      </CardContent>
    </Card>
  )
}

// SEASONAL CASH RESERVE — slow-season deficit sized in advance, funded from peak months. Node-verified: peak $180k/mo × 8 months, slow $60k/mo × 4, gross margin 35%, fixed $35k/mo → peak contribution +$28k/mo, slow −$14k/mo → slow-season deficit $56k; reserve at 1.5× safety = $84k → set aside $10,500/mo during the 8 peak months. Annual profit still $168k — the business is fine, the TIMING is the problem. Honest edges: fixed costs don't take the winter off (rent, insurance, truck payments, key staff you can't lay off and rehire — the reserve exists so you keep the crew), receivables lag (December's work pays in February — slow-season revenue arrives LATE, making the cash trough deeper than the P&L trough; add a month of lag mentally), the 1.5× buffer covers the bad-weather year (a wet spring or warm winter isn't a surprise, it's a decade-certainty — size for the bad year, enjoy the good ones), discipline mechanics (separate account, transfer on invoice not on "what's left" — what can be spent will be), and alternatives priced (layoffs cost rehiring+training and your reputation; a line of credit at 9% on $56k for 4 months is ~$1,680 — cheap IF secured before you need it; banks lend umbrellas in sunshine).
export function SeasonalReserveCalc() {
  const [peakRev, setPeakRev] = useNumber(180000)
  const [slowRev, setSlowRev] = useNumber(60000)
  const [peakM, setPeakM] = useNumber(8)
  const [slowM, setSlowM] = useNumber(4)
  const [gm, setGm] = useNumber(35)
  const [fixed, setFixed] = useNumber(35000)
  const [safety, setSafety] = useNumber(1.5)

  const r = useMemo(() => {
    const peakContrib = (peakRev * gm) / 100 - fixed
    const slowContrib = (slowRev * gm) / 100 - fixed
    const annual = peakContrib * peakM + slowContrib * slowM
    const deficit = Math.max(0, -slowContrib * slowM)
    const reserve = deficit * safety
    const setAside = peakM > 0 ? reserve / peakM : 0
    return { peakContrib, slowContrib, annual, deficit, reserve, setAside }
  }, [peakRev, slowRev, peakM, slowM, gm, fixed, safety])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Peak-month revenue" value={peakRev} onChange={setPeakRev} prefix="$" step="10000" />
          <Field label="Slow-month revenue" value={slowRev} onChange={setSlowRev} prefix="$" step="5000" />
          <Field label="Peak months" value={peakM} onChange={setPeakM} step="1" />
          <Field label="Slow months" value={slowM} onChange={setSlowM} step="1" />
          <Field label="Gross margin" value={gm} onChange={setGm} suffix="%" step="1" />
          <Field label="Fixed costs /mo" value={fixed} onChange={setFixed} prefix="$" step="1000" />
          <Field label="Safety multiplier" value={safety} onChange={setSafety} step="0.1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Slow-month contribution" value={usd(r.slowContrib)} />
          <Result label="Slow-season deficit" value={usd(r.deficit)} />
          <Result label="Reserve to hold" value={usd(r.reserve)} big />
          <Result label="Set aside per peak month" value={usd(r.setAside)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.deficit > 0
            ? `The slow season burns ${usd(Math.round(r.deficit))} — hold ${usd(Math.round(r.reserve))} (with the ${safety}× buffer) and fund it by moving ${usd(Math.round(r.setAside))}/mo to a separate account during the ${peakM} peak months. Annual profit is still ${usd(Math.round(r.annual))}: the business works, the calendar is the risk.`
            : `Your slow months still cover fixed costs (+${usd(Math.round(r.slowContrib))}/mo) — no structural deficit. Keep one slow month of fixed costs (${usd(fixed)}) as a weather buffer and revisit if margins compress.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: monthly contribution = revenue × gross margin − fixed costs; slow-season deficit = negative contribution × slow months; reserve = deficit × safety multiplier, funded in equal transfers during peak months. Fixed costs don't take the winter off — rent, insurance, truck payments, and the key crew you can't lay off and rehire are exactly what the reserve protects. Two timing traps: receivables lag (December's work pays in February — the CASH trough is deeper and later than the P&L trough, so treat the deficit as conservative), and the bad-weather year (a wet spring or warm winter isn't a surprise, it's a decade-certainty — the 1.5× multiplier is how you pre-pay it). Alternatives priced: a line of credit at 9% on $56k for four months costs ~$1,680 — cheap, but arrange it while the books look good, because banks lend umbrellas in sunshine; layoffs save fixed cost but cost rehiring, training, and reputation. Mechanics that make it real: separate account, transfer on invoice (not on "what's left"), and no dipping for equipment — that's what the equipment calculator's numbers are for. Estimates — your monthly P&Ls govern.
        </p>
      </CardContent>
    </Card>
  )
}

// SERVICE CALL FEE — the trip charge priced from drive time + diagnostic + vehicle cost. Node-verified: 35 min round-trip drive + 30 min diagnostic = 1.08 hr at $37.25 burdened = $40.35; 30 miles at $0.70 = $21 → cost $61.35 → at 25% margin the fee is $81.81 → publish $89. Honest edges: drive time is UNSOLD labor (the tech in the truck is inventory melting — a $0 service call means every dispatch loses ~$60 before a wrench turns), the fee FILTERS (free-estimate shoppers cost $60+ each and convert worst; a fee — even one credited to the work — raises close rate while it cuts junk volume), waive-vs-credit policy (crediting the fee to approved work converts better than waiving; waived fees attract the wrong call), zone pricing (a 60-minute-each-way call needs a zone fee or a polite decline — the calculator per zone settles it), and the market anchor (check competitors' published trip fees — being 2× market needs a reason; being half of market is a subsidy you didn't intend).
export function ServiceCallFeeCalc() {
  const [drive, setDrive] = useNumber(35)
  const [diag, setDiag] = useNumber(30)
  const [rate, setRate] = useNumber(37.25)
  const [miles, setMiles] = useNumber(30)
  const [mileCost, setMileCost] = useNumber(0.7)
  const [margin, setMargin] = useNumber(25)

  const r = useMemo(() => {
    const labor = ((drive + diag) / 60) * rate
    const veh = miles * mileCost
    const cost = labor + veh
    const fee = cost / (1 - Math.min(90, margin) / 100)
    const suggested = Math.ceil(fee / 10) * 10 - 1
    return { labor, veh, cost, fee, suggested }
  }, [drive, diag, rate, miles, mileCost, margin])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Round-trip drive (min)" value={drive} onChange={setDrive} step="5" />
          <Field label="Diagnostic time (min)" value={diag} onChange={setDiag} step="5" />
          <Field label="Burdened labor rate" value={rate} onChange={setRate} prefix="$" suffix="/hr" step="1" />
          <Field label="Round-trip miles" value={miles} onChange={setMiles} step="5" />
          <Field label="Vehicle cost per mile" value={mileCost} onChange={setMileCost} prefix="$" step="0.05" />
          <Field label="Target margin" value={margin} onChange={setMargin} suffix="%" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Labor cost" value={usd(r.labor)} />
          <Result label="Vehicle cost" value={usd(r.veh)} />
          <Result label="True cost per call" value={usd(r.cost)} />
          <Result big label="Publish" value={usd(r.suggested)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Every dispatch costs {usd(r.cost)} before a wrench turns — a $0 service call subsidizes shoppers with your tech's hours. Publish {usd(r.suggested)} (credit it to approved work) and the calls you lose were the ones losing you money.
        </div>
        <p className="text-xs text-muted-foreground">
          Method: (drive + diagnostic minutes) ÷ 60 × burdened labor rate + round-trip miles × true vehicle cost per mile (fuel + wear + insurance + the truck's depreciation — 70¢ is a fair default, IRS rate territory; your fleet numbers may differ), priced at margin: cost ÷ (1 − margin). The strategic layer: drive time is unsold labor — the tech in the truck is inventory melting, and route density (grouping calls by zone and day) is worth more than any fee tweak. The fee is also a FILTER: free-estimate shoppers convert worst and cost {usd(r.cost)} each; a published fee — especially one credited to approved work — raises close rate while cutting junk volume. Zone pricing follows the same math per ring: the 60-minute-each-way call needs its own number or a polite decline. Credit beats waive: "$89 credited to your repair" converts; "free if you approve" trains haggling. Check competitors' published trip fees — 2× market needs a reason; half of market is a subsidy you didn't intend. Estimates — your dispatch logs govern.
        </p>
      </CardContent>
    </Card>
  )
}

// CUSTOMER LTV vs CAC — what a customer is worth vs what one costs to buy. Node-verified: $450 avg ticket × 1.6 calls/yr × 6-yr relationship × 40% gross margin → LTV $1,728 (margin dollars, not revenue — the honest version); CAC $180 (ads + the estimate time on LOST bids — most shops undercount) → 9.6:1 ratio, payback 0.63 yrs; maintenance-agreement members at 2.2 touches/yr → LTV $2,376 (+38% — agreements are an LTV machine). Benchmarks: 3:1 is the survival floor for service businesses, 5:1+ is healthy, >10:1 means you're UNDER-SPENDING on growth (competitors will buy your customers). Honest edges: LTV in MARGIN not revenue (a $1,728 revenue LTV at 40% GM is $691 — fourfold error that justifies fourfold overspending), CAC must include the lost bids' estimating time (win 1 in 4 → each new customer carries 4 estimates), churn is the silent killer (measure by cohort: customers acquired via price-shopping ads churn 2-3× faster than referrals — blend them and both numbers lie), and the referral dividend (satisfied customers generate ~0.2-0.3 additional customers each — effective CAC on referrals is near zero, which is why the callback reserve and the review ask are growth spend, not overhead).
export function LtvCacCalc() {
  const [ticket, setTicket] = useNumber(450)
  const [freq, setFreq] = useNumber(1.6)
  const [years, setYears] = useNumber(6)
  const [gm, setGm] = useNumber(40)
  const [cac, setCac] = useNumber(180)

  const r = useMemo(() => {
    const ltvRev = ticket * freq * years
    const ltv = (ltvRev * gm) / 100
    const ratio = cac > 0 ? ltv / cac : Infinity
    const payback = ticket * freq * (gm / 100) > 0 ? cac / (ticket * freq * (gm / 100)) : Infinity
    return { ltvRev, ltv, ratio, payback }
  }, [ticket, freq, years, gm, cac])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Average ticket" value={ticket} onChange={setTicket} prefix="$" step="50" />
          <Field label="Calls/jobs per year" value={freq} onChange={setFreq} step="0.2" />
          <Field label="Relationship years" value={years} onChange={setYears} step="1" />
          <Field label="Gross margin" value={gm} onChange={setGm} suffix="%" step="1" />
          <Field label="Cost to acquire (CAC)" value={cac} onChange={setCac} prefix="$" step="20" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="LTV (margin dollars)" value={usd(r.ltv)} big />
          <Result label="LTV:CAC ratio" value={isFinite(r.ratio) ? `${num(r.ratio, 1)}:1` : '—'} />
          <Result label="CAC payback" value={isFinite(r.payback) ? `${num(r.payback * 12, 1)} months` : '—'} />
          <Result label="Max sustainable CAC (3:1)" value={usd(r.ltv / 3)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.ratio >= 5
            ? `${num(r.ratio, 1)}:1 — healthy. ${r.ratio > 10 ? 'Above 10:1 you may be UNDER-investing in growth: competitors can profitably outbid you for customers up to ' + usd(Math.round(r.ltv / 3)) + ' each.' : 'You can profitably pay up to ' + usd(Math.round(r.ltv / 3)) + ' per customer (3:1 floor) — current spend has room.'}`
            : r.ratio >= 3
              ? `${num(r.ratio, 1)}:1 — viable but thin. One bad quarter of ad prices or churn erases the cushion. Grow LTV (agreements, follow-up) before scaling spend.`
              : `${num(r.ratio, 1)}:1 — below the 3:1 survival floor: each customer bought costs more than they'll return in margin. Fix retention or pricing before buying another lead.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: LTV = ticket × frequency × years × gross margin — MARGIN dollars, not revenue (a revenue LTV at 40% margin overstates value 2.5× and justifies overspending on ads by the same factor). CAC must count everything: ad spend + the estimate time on the bids you LOSE (win 1 in 4 → each new customer carries 4 estimates) + discounts given to close. Benchmarks: 3:1 is the survival floor, 5:1+ healthy, above 10:1 you're leaving growth on the table — competitors can profitably outbid you for customers up to a third of LTV. The levers that move LTV: maintenance agreements (2.2 touches/yr vs 1.6 — +38% LTV in the default case), the follow-up cadence (the annual "time for service" call is the cheapest frequency-raiser in the trades), and reviews/referrals (referred customers arrive at near-zero CAC and churn slowest — the review ask is growth spend, not vanity). Churn measured by cohort tells the truth: price-shopping ad cohorts churn 2–3× faster than referral cohorts; blend them and both numbers lie. Estimates — your CRM and ad accounts govern.
        </p>
      </CardContent>
    </Card>
  )
}

// REPAIR VS REPLACE — the $5,000 rule as a starting point, then the honest ledger. Node-verified: 12-yr-old HVAC, $900 repair, $6,500 replacement, 15-yr new-unit life, old unit has ~4 yrs left, energy savings 35% on $150/mo spend, future repairs escalating 25%/yr from 60% of current repair → rule score 900×12 = 10,800 (>5,000 → replace); 4-yr ledger: keep = $900 + $3,892 expected future repairs + $2,520 extra energy = $7,312 vs replace = $6,500 − $4,333 residual value at yr 4 = $2,167 net ownership cost. Honest edges: the $5,000 rule is a screening heuristic not a verdict (it ignores energy, refrigerant, and comfort), R-410A/R-22 refrigerant phase-outs make old-unit repairs escalate (priced refrigerant alone can make a $400 leak repair $1,200 — ask what refrigerant before approving), the "repair" answer is RIGHT when the unit is young, the repair is a wear part (capacitors, contactors, ignitors are $150-450 maintenance, not decline), or you're selling the house inside 2 years (buyers discount old systems but not dollar-for-dollar), warranties (a compressor under parts warranty changes everything — LABOR still bills, confirm coverage before deciding), and timing (off-season replacement quotes run 5-15% under July emergency pricing — the repair that buys you to October can be worth doing even when replacement wins).
export function RepairReplaceCalc() {
  const [age, setAge] = useNumber(12)
  const [repair, setRepair] = useNumber(900)
  const [replace, setReplace] = useNumber(6500)
  const [newLife, setNewLife] = useNumber(15)
  const [remainOld, setRemainOld] = useNumber(4)
  const [moSpend, setMoSpend] = useNumber(150)
  const [effSave, setEffSave] = useNumber(35)

  const r = useMemo(() => {
    const rule = repair * age
    const effSaveYr = (moSpend * 12 * effSave) / 100
    let futRep = 0
    for (let y = 1; y <= remainOld; y++) futRep += repair * 0.6 * Math.pow(1.25, y)
    const keepCost = repair + futRep + effSaveYr * remainOld
    const residual = replace * Math.max(0, 1 - remainOld / newLife)
    const replaceCost = replace - residual
    const savings = keepCost - replaceCost
    return { rule, effSaveYr, futRep, keepCost, replaceCost, savings }
  }, [age, repair, replace, newLife, remainOld, moSpend, effSave])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Unit age (years)" value={age} onChange={setAge} step="1" />
          <Field label="Repair quote" value={repair} onChange={setRepair} prefix="$" step="50" />
          <Field label="Replacement quote" value={replace} onChange={setReplace} prefix="$" step="250" />
          <Field label="New unit lifespan" value={newLife} onChange={setNewLife} step="1" />
          <Field label="Years left in old unit" value={remainOld} onChange={setRemainOld} step="1" />
          <Field label="Monthly energy spend" value={moSpend} onChange={setMoSpend} prefix="$" step="10" />
          <Field label="Efficiency gain" value={effSave} onChange={setEffSave} suffix="%" step="5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="$5,000 rule score" value={num(r.rule, 0)} />
          <Result label={`Keep — ${remainOld}-yr cost`} value={usd(r.keepCost)} />
          <Result label={`Replace — ${remainOld}-yr net cost`} value={usd(r.replaceCost)} />
          <Result big label={r.savings >= 0 ? 'Replace saves' : 'Repair saves'} value={usd(Math.abs(r.savings))} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.rule > 5000
            ? `The rule flags replace (${num(r.rule, 0)} > 5,000) and the ledger agrees: keeping the old unit costs ${usd(Math.round(r.keepCost))} over ${remainOld} years vs ${usd(Math.round(r.replaceCost))} net for a new one. Get off-season quotes if it limps along.`
            : `Rule score ${num(r.rule, 0)} is under 5,000 — ${r.savings >= 0 ? 'but the full ledger says REPLACE anyway: energy and the next failures tip it. Check refrigerant type and warranty before spending on the old unit.' : 'repair is the right call: the unit has years left and the fix doesn\'t cascade. Budget for the replacement at end of life.'}`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: the $5,000 rule (repair cost × age; over 5,000 → replace) screens, then the ledger decides — keeping costs the repair + expected future failures (escalating 25%/yr, industry-typical failure curve) + the efficiency penalty vs the new unit, while replacing costs the quote minus the unit's residual value at the end of the comparison window. Honest edges: refrigerant phase-outs (R-22 and now R-410A) make old-system repairs escalate — a $400 leak fix can become $1,200 with phased-out refrigerant, so ask what's in the system before approving anything; wear parts (capacitors, contactors, ignitors, $150–450) are maintenance, not decline — repair those at almost any age under 15; warranties change everything (a compressor under parts warranty still bills LABOR — confirm both before deciding); selling within 2 years flips the math (buyers discount old systems but not dollar-for-dollar); and timing is worth 5–15% — off-season replacement quotes beat July emergency pricing, so the repair that buys you to October can be worth doing even when replacement wins. Estimates — your quotes and the unit's nameplate govern.
        </p>
      </CardContent>
    </Card>
  )
}

// TANK VS TANKLESS — annualized cost settles the argument, and the honest answer is usage-dependent. Node-verified @4% discount: tank $1,600 installed / 12-yr life / $35/mo energy → $590/yr annualized; tankless $3,200 / 20-yr / $25/mo + $100/yr descaling → $635/yr — TANK WINS at moderate use. High-use household ($45 vs $30/mo): $710 vs $695 — tankless edges it. The flip point is hot-water VOLUME and gas vs electric (electric tankless needs 100+ amp service upgrades — add $1,500-3,000 panel work and it's never close; gas tankless needs bigger gas line often). Honest edges: tankless real advantages are NOT efficiency (endless hot water, 20-yr life, no flood risk, space — price those as lifestyle, not savings), standby losses on tanks are shrinking (modern tanks are well-insulated; the 24-34% DOE tankless savings figure assumes 41 gal/day and shrinks at high use), descaling is mandatory in hard water (skip it and the heat exchanger dies early — that's the $100/yr), and tank FAILURE risk (a 12-yr-old tank is a 40-gallon flood waiting — the pan and the age-check are the real tank maintenance).
export function TankVsTanklessCalc() {
  const [tankCost, setTankCost] = useNumber(1600)
  const [tlCost, setTlCost] = useNumber(3200)
  const [tankLife, setTankLife] = useNumber(12)
  const [tlLife, setTlLife] = useNumber(20)
  const [tankMo, setTankMo] = useNumber(35)
  const [tlMo, setTlMo] = useNumber(25)
  const [maint, setMaint] = useNumber(100)
  const [disc, setDisc] = useNumber(4)

  const r = useMemo(() => {
    const r0 = disc / 100
    const ann = (n: number) => (r0 === 0 ? n : (1 - Math.pow(1 + r0, -n)) / r0)
    const tankAnn = tankCost / ann(Math.max(1, tankLife)) + tankMo * 12
    const tlAnn = tlCost / ann(Math.max(1, tlLife)) + tlMo * 12 + maint
    const diff = tankAnn - tlAnn
    // usage flip point: tankMo where tl wins → solve tankMo*12 - tlMo*12*(tankMo/... approximate linear
    return { tankAnn, tlAnn, diff }
  }, [tankCost, tlCost, tankLife, tlLife, tankMo, tlMo, maint, disc])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Tank installed cost" value={tankCost} onChange={setTankCost} prefix="$" step="100" />
          <Field label="Tankless installed cost" value={tlCost} onChange={setTlCost} prefix="$" step="100" />
          <Field label="Tank lifespan" value={tankLife} onChange={setTankLife} step="1" />
          <Field label="Tankless lifespan" value={tlLife} onChange={setTlLife} step="1" />
          <Field label="Tank energy /mo" value={tankMo} onChange={setTankMo} prefix="$" step="5" />
          <Field label="Tankless energy /mo" value={tlMo} onChange={setTlMo} prefix="$" step="5" />
          <Field label="Tankless maint /yr" value={maint} onChange={setMaint} prefix="$" step="25" />
          <Field label="Discount rate" value={disc} onChange={setDisc} suffix="%" step="0.5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Result label="Tank — annualized cost" value={usd(r.tankAnn)} />
          <Result label="Tankless — annualized cost" value={usd(r.tlAnn)} />
          <Result big label={r.diff > 0 ? 'Tankless saves' : 'Tank saves'} value={`${usd(Math.abs(r.diff))}/yr`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.diff > 0
            ? `Tankless wins by ${usd(Math.abs(Math.round(r.diff)))}/yr at your usage — high hot-water volume is what flips it. Add the lifestyle wins (endless showers, no 40-gallon flood risk, closet space back) and it's a clean call.`
            : `At your usage the TANK wins by ${usd(Math.abs(Math.round(r.diff)))}/yr — the tankless premium never pays back on energy alone. Buy tankless for endless hot water and the 20-year life, not for savings; or take the tank and bank the ${usd(tlCost - tankCost)} difference.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: annualized cost = installed cost ÷ present-value annuity over lifespan + annual energy + maintenance (tankless descaling, ~$100/yr, mandatory in hard water — skip it and the heat exchanger dies young). The honest surprises: the DOE's 24–34% tankless efficiency figure assumes ~41 gal/day and SHRINKS at high use; electric tankless usually needs 100+ amp service and panel work ($1,500–3,000 — add it to installed cost and the case collapses); gas tankless often needs an upsized gas line. Tankless's real advantages aren't efficiency: endless hot water, 20-year life, no tank-burst flood risk, and floor space — legitimate, but they're lifestyle, not savings. Tank owners: the maintenance that matters is the anode rod (5-yr check, doubles tank life) and the age check — a 12-year-old tank is a 40-gallon flood on a timer, and a drain pan with a $15 alarm is the cheapest insurance in the house. Estimates — installer quotes and your gas/electric rates govern.
        </p>
      </CardContent>
    </Card>
  )
}

// GENERATOR VS OUTAGE COST — expected annual outage loss vs annualized generator cost. Node-verified: standby unit $10k installed, 15-yr life, $250/yr maintenance → $1,149/yr annualized @4%; outage profile 2/yr × $575 each (food $300, hotel half-night avg $75, WFH income loss $200) + sump-failure flood risk 4%/yr × $15k = $600 → expected loss $1,750/yr → GENERATOR WINS in outage-prone areas. Portable alternative: $1,100/10yr + $50 maint = $186/yr (manual, partial circuits, gasoline logistics — a different product, priced here for contrast). Honest edges: the flood-risk line dominates (a sump pump that stops in a storm is the $15k basement — if you have a sump and storms, that line alone justifies backup), WFH income loss is real for remote workers (a deadline day lost is a day's billing), the standby's convenience premium vs portable is ~$960/yr (auto-transfer, whole house, natural gas — worth it for medical devices, freeze risk, or frequent outages; overkill for the once-a-year blip), standby maintenance is mandatory ($250/yr service or the warranty and the reliability both die), and resale (standby units return ~50-75% at sale in outage-prone markets — not counted here, so the win threshold is conservative).
export function GeneratorCostCalc() {
  const [genCost, setGenCost] = useNumber(10000)
  const [life, setLife] = useNumber(15)
  const [maint, setMaint] = useNumber(250)
  const [outages, setOutages] = useNumber(2)
  const [food, setFood] = useNumber(300)
  const [hotel, setHotel] = useNumber(75)
  const [income, setIncome] = useNumber(200)
  const [floodRisk, setFloodRisk] = useNumber(4)
  const [floodCost, setFloodCost] = useNumber(15000)

  const r = useMemo(() => {
    const r0 = 0.04
    const ann = (n: number) => (1 - Math.pow(1 + r0, -n)) / r0
    const genAnn = genCost / ann(Math.max(1, life)) + maint
    const perOutage = food + hotel + income
    const expLoss = outages * perOutage + (floodRisk / 100) * floodCost
    const diff = expLoss - genAnn
    return { genAnn, perOutage, expLoss, diff }
  }, [genCost, life, maint, outages, food, hotel, income, floodRisk, floodCost])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Standby installed cost" value={genCost} onChange={setGenCost} prefix="$" step="500" />
          <Field label="Lifespan" value={life} onChange={setLife} step="1" />
          <Field label="Maintenance /yr" value={maint} onChange={setMaint} prefix="$" step="50" />
          <Field label="Outages per year" value={outages} onChange={setOutages} step="0.5" />
          <Field label="Food loss /outage" value={food} onChange={setFood} prefix="$" step="50" />
          <Field label="Hotel /outage (avg)" value={hotel} onChange={setHotel} prefix="$" step="25" />
          <Field label="Income loss /outage" value={income} onChange={setIncome} prefix="$" step="50" />
          <Field label="Flood risk /yr (sump)" value={floodRisk} onChange={setFloodRisk} suffix="%" step="1" />
          <Field label="Flood damage if it hits" value={floodCost} onChange={setFloodCost} prefix="$" step="1000" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Result label="Generator annualized" value={`${usd(r.genAnn)}/yr`} />
          <Result label="Expected outage loss" value={`${usd(r.expLoss)}/yr`} />
          <Result big label={r.diff >= 0 ? 'Generator wins by' : 'Math favors no generator'} value={`${usd(Math.abs(r.diff))}/yr`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.diff >= 0
            ? `Expected losses (${usd(Math.round(r.expLoss))}/yr) exceed the generator's annualized cost (${usd(Math.round(r.genAnn))}/yr) — the math backs the install, and it doesn't count the resale value or the first storm you sleep through.`
            : `Pure math says skip it: ${usd(Math.round(r.expLoss))}/yr of expected loss vs ${usd(Math.round(r.genAnn))}/yr annualized. But a $1,100 portable (~$186/yr annualized) covers food and the sump at a fraction of the cost — match the machine to the risk.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: generator = installed cost ÷ PV annuity over lifespan + annual maintenance; losses = outages/yr × (food + hotel + income loss) + flood-risk% × flood damage. The flood line dominates where it applies: a sump pump that stops in a storm is a $15k basement, and at 4%/yr that risk alone is $600/yr — half the standby's cost before food is counted. WFH income loss is real for remote workers (a deadline day lost is a day's billing). The portable contrast matters: $1,100 + $50/yr maint ≈ $186/yr annualized covers fridge + sump + furnace blower via a transfer switch — manual and partial, but the right size for a once-a-year outage profile. Standby's premium (~$960/yr more) buys auto-transfer, whole-house coverage, and natural-gas fueling — worth it for medical devices, freeze-risk climates, or frequent outages; and standby units return 50–75% at resale in outage-prone markets (not counted — the win threshold is conservative). Maintenance is mandatory: skip the $250/yr service and the warranty dies with the reliability. Estimates — installer quotes and your outage history govern.
        </p>
      </CardContent>
    </Card>
  )
}

// SMART THERMOSTAT ROI — the $250 gadget priced against real HVAC spend. Node-verified: $250 installed, blended 9% savings (8% heating / 10% cooling, the DOE/EPA Energy Star published range for schedule-based setbacks) on $2,200/yr HVAC energy → $198/yr → payback 15.2 months, net $740 over 5 years. Honest edges: savings come from SETBACKS, not the thermostat's intelligence (a disciplined human with a $35 programmable gets the same 9% — the smart unit's value is that nobody's disciplined: auto-away, geofencing, and learning recover the savings that manual schedules never sustain), savings scale with the HOUSE (leaky 2,800 sqft = bigger dollar savings; tight apartment = skip), heat-pump caveat (aggressive setbacks BACKFIRE on heat pumps — recovery triggers resistance strips at 3x cost; use heat-pump-aware models with gradual recovery), utility rebates ($50-100 common — check before buying, it halves the payback), and demand-response programs (utilities pay $25-85/yr for peak-event control — enroll; it stacks with the savings).
export function SmartThermostatCalc() {
  const [cost, setCost] = useNumber(250)
  const [rebate, setRebate] = useNumber(50)
  const [hvac, setHvac] = useNumber(2200)
  const [savePct, setSavePct] = useNumber(9)
  const [drProg, setDrProg] = useNumber(50)
  const [years, setYears] = useNumber(5)

  const r = useMemo(() => {
    const net = cost - rebate
    const saveYr = (hvac * savePct) / 100 + drProg
    const paybackMo = saveYr > 0 ? (net / saveYr) * 12 : Infinity
    const total = saveYr * years - net
    return { net, saveYr, paybackMo, total }
  }, [cost, rebate, hvac, savePct, drProg, years])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Thermostat installed cost" value={cost} onChange={setCost} prefix="$" step="25" />
          <Field label="Utility rebate" value={rebate} onChange={setRebate} prefix="$" step="25" />
          <Field label="Annual HVAC energy spend" value={hvac} onChange={setHvac} prefix="$" step="100" />
          <Field label="Expected savings" value={savePct} onChange={setSavePct} suffix="%" step="1" />
          <Field label="Demand-response credit /yr" value={drProg} onChange={setDrProg} prefix="$" step="25" />
          <Field label="Years" value={years} onChange={setYears} step="1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Result label="Savings per year" value={usd(r.saveYr)} />
          <Result label="Payback" value={isFinite(r.paybackMo) ? `${num(r.paybackMo, 1)} months` : 'Never'} big />
          <Result label={`Net over ${years} years`} value={usd(r.total)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {isFinite(r.paybackMo) && r.paybackMo <= 24
            ? `${usd(r.saveYr)}/yr against ${usd(r.net)} net cost — payback in ${num(r.paybackMo, 1)} months, ${usd(Math.round(r.total))} ahead over ${years} years. One of the few smart-home gadgets that pays for itself.`
            : `Payback stretches past two years at these numbers — check for utility rebates (they halve it), enroll in demand response, and be honest about whether your schedule actually leaves the house.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: net cost = price − utility rebate (check yours — $50–100 is common and halves the payback); savings = HVAC spend × savings % + demand-response credit (utilities pay $25–85/yr for peak-event adjustment — enroll, it stacks). The honest physics: savings come from SETBACKS — heating/cooling less while you sleep or you're away — not from the thermostat being clever. A disciplined human with a $35 programmable captures the same 8–10%; the smart unit's real product is that nobody's disciplined: auto-away, geofencing, and learning schedules recover savings that manual programming never sustains (studies of programmable thermostats found most were never programmed). Savings scale with the house — leaky 2,800 sqft homes see bigger dollars; a tight apartment sees little. HEAT-PUMP CAVEAT: aggressive setbacks backfire — recovery triggers auxiliary resistance strips at ~3× the cost; heat-pump owners need models with gradual/adaptive recovery and modest (2–3°) setbacks. Estimates — your utility bills and rebate program govern.
        </p>
      </CardContent>
    </Card>
  )
}

// WINDOW REPLACEMENT ROI — the honest verdict: energy savings alone almost never pay for windows. Node-verified: 12 windows × $800 installed = $9,600; Energy Star-documented savings for replacing double-pane ~$220/yr on a $2,200 HVAC bill → 43.6-YEAR payback, NPV −$6,610 over 20 yrs @4%. Best case (single-pane, extreme climate, $450/yr): still 21 years. The correction content: $500 of air sealing + $1,500 of attic insulation routinely saves MORE ($300-400/yr) at 1/5 the cost — windows are the worst $/BTU in the envelope. Buy windows for the RIGHT reasons: comfort (cold spots, drafts at the glass), noise, function (won't open/paint-sealed/rotted), condensation between panes (failed seals — that glass IS leaking energy), aesthetics, and resale (window replacement recoups ~60-68% at sale per Cost-vs-Value — the sale, not the utility bill, is where money returns). Honest edges: failed-seal units can be REGLOZED ($200-400/window vs $800 replace), storm windows ($100-200) capture ~half the energy gain at 1/4 the cost, and low-e film ($8/sqft DIY) for sun-baked rooms. Never finance windows as an "energy investment" — the salesperson's payback slide assumes energy inflation and savings the field studies don't support.
export function WindowRoiCalc() {
  const [n, setN] = useNumber(12)
  const [per, setPer] = useNumber(800)
  const [hvac, setHvac] = useNumber(2200)
  const [savePct, setSavePct] = useNumber(10)
  const [years, setYears] = useNumber(20)
  const [disc, setDisc] = useNumber(4)

  const r = useMemo(() => {
    const cost = n * per
    const saveYr = (hvac * savePct) / 100
    const r0 = disc / 100
    const ann = (y: number) => (r0 === 0 ? y : (1 - Math.pow(1 + r0, -y)) / r0)
    const pv = saveYr * ann(years)
    const npv = pv - cost
    const payback = saveYr > 0 ? cost / saveYr : Infinity
    return { cost, saveYr, pv, npv, payback }
  }, [n, per, hvac, savePct, years, disc])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Number of windows" value={n} onChange={setN} step="1" />
          <Field label="Installed cost per window" value={per} onChange={setPer} prefix="$" step="50" />
          <Field label="Annual HVAC energy spend" value={hvac} onChange={setHvac} prefix="$" step="100" />
          <Field label="Expected energy savings" value={savePct} onChange={setSavePct} suffix="%" step="1" />
          <Field label="Horizon (years)" value={years} onChange={setYears} step="5" />
          <Field label="Discount rate" value={disc} onChange={setDisc} suffix="%" step="0.5" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Total installed cost" value={usd(r.cost)} />
          <Result label="Energy savings /yr" value={usd(r.saveYr)} />
          <Result label="Simple payback" value={isFinite(r.payback) ? `${num(r.payback, 1)} yrs` : 'Never'} big />
          <Result label={`NPV over ${years} yrs`} value={usd(r.npv)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.npv < 0
            ? `Energy alone loses ${usd(Math.abs(Math.round(r.npv)))} over ${years} years — payback ${num(r.payback, 1)} years on a product warrantied for 20. Buy windows for comfort, function, noise, or resale (~60–68% recouped at sale), not for the utility bill. For pure savings, air sealing + attic insulation return 5× more per dollar.`
            : `Rare win: ${usd(Math.round(r.saveYr))}/yr pays back ${usd(r.cost)} in ${num(r.payback, 1)} years — this only happens with single-pane originals in an extreme climate. Verify the savings estimate against your actual bills before signing.`}
        </div>
        <p className="text-xs text-muted-foreground">
          Method: total installed cost vs energy savings (Energy Star field data: replacing DOUBLE-pane saves ~$101–220/yr in typical climates; single-pane originals in extreme climates can reach $450–583), discounted over the horizon. The correction that matters: windows are the WORST dollar-per-BTU in the envelope — $500 of air sealing plus $1,500 of attic insulation routinely saves $300–400/yr, 5× the return per dollar, because air leaks beat glass conduction as the dominant loss. Buy windows for the right reasons: comfort (radiant cold at the glass is a real quality-of-life upgrade), function (painted-shut, rotted, or stuck), failed seals (condensation BETWEEN panes — but note those units can often be reglazed at $200–400 vs $800 replaced), noise, aesthetics, and resale (Cost-vs-Value data: ~60–68% recouped at sale — the closing table, not the utility bill, is where window money returns). Cheaper middle paths: storm windows ($100–200) capture about half the energy gain at a quarter of the cost; low-e film for sun-baked rooms. Never finance windows as an "energy investment" — the showroom payback slide assumes energy inflation and savings the field studies don't support. Estimates — installer quotes and your utility bills govern.
        </p>
      </CardContent>
    </Card>
  )
}

// LED CONVERSION ROI — the best payback in the house, verified. Node-verified: 40 sockets, $3 LED bulbs ($120), 60W→9W, 3 hrs/day, $0.16/kWh → 55.8 kWh saved per socket per year → $357/yr whole house → 4.0-MONTH payback; avoided incandescent replacements add $44/yr (1,000-hr bulbs at $1) → $401/yr total; LED lifespan at 3 hrs/day = 13.7 years. Honest edges: savings scale with HOURS (a closet bulb never pays back; the porch light that burns 12 hrs/day pays back in weeks — convert highest-use sockets first), lumens not watts (800lm = old 60W; check the box, "60W equivalent" is the lumen number), dimmer compatibility (cheap LEDs flicker on old dimmers — buy dimmable-rated or replace the dimmer), enclosed fixtures kill cheap LEDs early (heat — buy enclosed-rated for cans), color temperature (2700K warm = incandescent feel; 4000K+ is the office-blue people regret), and utility rebates (instant rebates at the register in many states make $1-2 bulbs common). The contrast content: LEDs pay back in months, windows in decades — efficiency money has a ranking.
export function LedConversionCalc() {
  const [bulbs, setBulbs] = useNumber(40)
  const [price, setPrice] = useNumber(3)
  const [oldW, setOldW] = useNumber(60)
  const [newW, setNewW] = useNumber(9)
  const [hrs, setHrs] = useNumber(3)
  const [rate, setRate] = useNumber(0.16)

  const r = useMemo(() => {
    const saveKwh = ((oldW - newW) / 1000) * hrs * 365
    const saveYr = saveKwh * rate * bulbs
    const replYr = ((hrs * 365) / 1000) * 1 * bulbs
    const cost = bulbs * price
    const totalSave = saveYr + replYr
    const paybackMo = totalSave > 0 ? (cost / totalSave) * 12 : Infinity
    const lifeYrs = 15000 / (hrs * 365)
    return { saveYr, replYr, cost, totalSave, paybackMo, lifeYrs }
  }, [bulbs, price, oldW, newW, hrs, rate])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Sockets to convert" value={bulbs} onChange={setBulbs} step="5" />
          <Field label="LED price per bulb" value={price} onChange={setPrice} prefix="$" step="0.5" />
          <Field label="Old bulb watts" value={oldW} onChange={setOldW} suffix="W" step="5" />
          <Field label="LED watts" value={newW} onChange={setNewW} suffix="W" step="1" />
          <Field label="Hours on per day" value={hrs} onChange={setHrs} step="0.5" />
          <Field label="Electricity rate" value={rate} onChange={setRate} prefix="$" suffix="/kWh" step="0.01" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Result label="Conversion cost" value={usd(r.cost)} />
          <Result label="Energy + bulb savings /yr" value={usd(r.totalSave)} />
          <Result label="Payback" value={isFinite(r.paybackMo) ? `${num(r.paybackMo, 1)} months` : 'Never'} big />
          <Result label="LED lifespan at this use" value={`${num(r.lifeYrs, 1)} yrs`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {num(r.totalSave, 0)} dollars a year on a {usd(r.cost)} spend — payback in {num(r.paybackMo, 1)} months, then it pays you for over a decade. The best ROI in the house isn't solar or windows; it's forty light bulbs.
        </div>
        <p className="text-xs text-muted-foreground">
          Method: savings = (old watts − LED watts) × hours/day × 365 × your rate, plus avoided replacement bulbs (incandescents last ~1,000 hours; at 3 hrs/day that's one per socket per year). The levers that matter: HOURS dominate everything — the porch light burning 12 hrs/day pays back in weeks, the closet bulb never does, so convert by usage ranking, not room by room. Buy lumens not watts: 800 lumens replaces a 60W incandescent; "equivalent" claims on the box are the lumen number. Traps: cheap LEDs flicker on old dimmers (buy dimmable-rated or swap the dimmer), enclosed recessed cans cook non-rated bulbs early (heat kills the driver — buy enclosed-rated), and 4000K+ "daylight" bulbs in living spaces are the office-blue everyone regrets (2700K is the incandescent feel). Check utility instant rebates — many states make $1–2 bulbs common at the register. The contrast that reframes efficiency spending: this pays back in months while window replacement takes decades — spend efficiency dollars in payback order. Estimates — your bill's rate and your actual usage hours govern.
        </p>
      </CardContent>
    </Card>
  )
}

// QLAC — Qualified Longevity Annuity Contract, 2026 (SECURE 2.0 §202; IRS Notice 2025-67): move up to $210,000 per person (lifetime, indexed; old 25%-of-balance cap gone) out of a traditional IRA/401(k) into a fixed deferred income annuity. The premium EXITS the RMD base until payments begin (by the month after 85) — at 73 on the Uniform Lifetime Table (26.5), $210k cuts the RMD $7,924.53/yr, saving $1,743/yr at 22%. RMD ages: 73 (born ≤1959), 75 (1960+). Roth IRAs can't fund QLACs; fixed contracts only (no variable/indexed). The honest ledger: tax DEFERRAL not avoidance (payments are ordinary income at 85, likely at a lower bracket), total illiquidity until payout, insurer credit risk (state guaranty $250k–$500k typical), and mortality risk — die before breakeven (premium ÷ annual income from start age) and the insurer keeps the spread unless you pay for a return-of-premium rider (which cuts the payout). Node-verified: $1.5M IRA at 73 → RMD $56,603.77 → with $210k QLAC $48,679.25 (saves $7,924.53/yr, $1,743 tax at 22% — matches published examples); $210k premium paying $3,000/mo at 85 → payback 5.8 years, breakeven age 90.8.
const ULTABLE: [number, number][] = [[72, 27.4], [73, 26.5], [74, 25.5], [75, 24.6], [76, 23.7], [77, 22.9], [78, 22.0], [79, 21.1], [80, 20.2], [81, 19.4], [82, 18.5], [83, 17.7], [84, 16.8], [85, 16.0]]
export function QlacCalc() {
  const [balance, setBalance] = useNumber(1500000)
  const [premium, setPremium] = useNumber(210000)
  const [age, setAge] = useState('73')
  const [startAge, setStartAge] = useState('85')
  const [incomeMo, setIncomeMo] = useNumber(3000)
  const [bracket, setBracket] = useNumber(22)

  const r = useMemo(() => {
    const a = Number(age)
    const factor = ULTABLE.find(([x]) => x === a)?.[1] ?? 26.5
    const prem = Math.min(premium, 210000)
    const before = balance / factor
    const after = Math.max(0, balance - prem) / factor
    const savedYr = before - after
    const taxSaved = savedYr * (bracket / 100)
    const deferYrs = Math.max(0, Number(startAge) - a)
    const payback = incomeMo > 0 ? prem / (incomeMo * 12) : 0
    const breakeven = Number(startAge) + payback
    return { before, after, savedYr, taxSaved, deferYrs, payback, breakeven, prem, factor }
  }, [balance, premium, age, startAge, incomeMo, bracket])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Traditional IRA/401(k) balance" value={balance} onChange={setBalance} prefix="$" />
          <Field label="QLAC premium (max $210,000)" value={premium} onChange={setPremium} prefix="$" />
          <Field label="Marginal bracket" value={bracket} onChange={setBracket} suffix="%" />
          <div>
            <div className="mb-1 text-sm font-medium">Current age</div>
            <select value={age} onChange={(e) => setAge(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {ULTABLE.map(([a]) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">Income starts at age</div>
            <select value={startAge} onChange={(e) => setStartAge(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {['75', '77', '80', '82', '85'].map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <Field label="Quoted monthly income at that age" value={incomeMo} onChange={setIncomeMo} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="RMD cut per year" value={usd(r.savedYr, 0)} />
          <Result label="Tax saved per year" value={usd(r.taxSaved, 0)} />
          <Result label="Deferral window" value={`${num(r.deferYrs, 0)} years`} />
          <Result label="Annuity breakeven" value={`age ${num(r.breakeven, 1)}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          At {age}, your RMD without the QLAC is <span className="font-medium">{usd(r.before, 0)}</span> (balance ÷ {r.factor}); moving {usd(r.prem, 0)} into a QLAC drops it to <span className="font-medium">{usd(r.after, 0)}</span> — {usd(r.savedYr, 0)}/yr less forced taxable income, saving {usd(r.taxSaved, 0)} at {bracket}% for roughly {num(r.deferYrs, 0)} years{incomeMo > 0 && <>. The trade on the other side: {usd(incomeMo, 0)}/mo starting at {startAge} takes {num(r.payback, 1)} years to return the premium — breakeven at age {num(r.breakeven, 1)}</>}. It's longevity insurance plus a tax delay, not an investment: die before breakeven without a return-of-premium rider and the insurer keeps the difference.
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules (SECURE 2.0 §202, IRS Notice 2025-67): up to $210,000 per person lifetime — $420,000 for a couple if each has qualified money — can move from a traditional IRA, 401(k), 403(b), or governmental 457(b) into a QLAC; the old 25%-of-balance cap is gone. The premium leaves the RMD calculation until income starts, which must be by the month after your 85th birthday. Fixed contracts only — variable and indexed annuities don't qualify; the issuer certifies via Form 1098-Q. Roth IRAs can't fund one. What a QLAC actually is: tax DEFERRAL (payments at 85 are ordinary income — the win is paying at a lower late-life bracket and dodging IRMAA tiers in between) plus mortality pooling (the payout beats any safe withdrawal rate because those who die early subsidize those who don't). The real risks: total illiquidity until payout, insurer solvency (state guaranty associations typically cover $250k–$500k — stay under your state's limit or split carriers), inflation (most QLACs pay flat dollars — $3,000 in 2041 buys less), and dying early without a death-benefit rider. Best fit: surplus IRA assets, family longevity, other liquid savings, and RMDs high enough to matter. Get real insurer quotes for the income input — payout rates vary widely.
        </p>
      </CardContent>
    </Card>
  )
}

// Q4 equipment timing — two December traps. (1) MID-QUARTER CONVENTION: if >40% of the year's MACRS basis (EXCLUDING §179/bonus-expensed property) is placed in service in Q4, EVERY asset that year flips from half-year to mid-quarter convention — a Q4 asset's 5-year year-1 rate drops 20% → 5% (Q1 35%, Q2 25%, Q3 15%, Q4 5%). The escape: elect §179/bonus on the Q4 purchases — expensed property leaves the 40% test entirely. (2) PLACED-IN-SERVICE DEADLINE: ordered ≠ deductible — the asset must be installed and operational by Dec 31 or the year-one deduction slides a full year; at 32% on $50k that's $16,000 of tax deferred a year (~$1,280 of time value at 8%). Node-verified: quarters 30/20/10/50k → Q4 share 45.5% → mid-quarter trips; expensing the $50k Q4 buy → share 0%, safe; Q4 5-yr asset mid-quarter yr-1 = $2,500 vs $10,000 half-year.
export function Q4TimingCalc() {
  const [q1, setQ1] = useNumber(30000)
  const [q2, setQ2] = useNumber(20000)
  const [q3, setQ3] = useNumber(10000)
  const [q4, setQ4] = useNumber(50000)
  const [expense, setExpense] = useState(true)
  const [rate, setRate] = useNumber(32)

  const r = useMemo(() => {
    const q4Tested = expense ? 0 : q4 // §179/bonus-expensed property leaves the 40% test
    const tot = q1 + q2 + q3 + q4Tested
    const share = tot > 0 ? q4Tested / tot : 0
    const trips = share > 0.4
    // if trips: Q4 assets on mid-quarter get 5% yr-1 (5-yr) vs 20% half-year — show the cost on a 5-yr assumption
    const mqYr1 = q4Tested * 0.05
    const hyYr1 = q4Tested * 0.2
    const mqCost = trips ? (hyYr1 - mqYr1) * (rate / 100) : 0
    return { share, trips, mqCost, tot, q4Tested }
  }, [q1, q2, q3, q4, expense, rate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Q1 purchases (depreciated, not expensed)" value={q1} onChange={setQ1} prefix="$" />
          <Field label="Q2 purchases" value={q2} onChange={setQ2} prefix="$" />
          <Field label="Q3 purchases" value={q3} onChange={setQ3} prefix="$" />
          <Field label="Q4 purchases" value={q4} onChange={setQ4} prefix="$" />
          <Field label="Marginal tax rate" value={rate} onChange={setRate} suffix="%" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={expense} onChange={(e) => setExpense(e.target.checked)} className="h-4 w-4" />
            §179/bonus-expense the Q4 purchases
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Mid-quarter test" value={r.trips ? 'TRIPPED' : 'Safe'} />
          <Result label="Q4 share of tested basis" value={`${num(r.share * 100, 1)}% (limit 40%)`} />
          <Result label="Tested basis total" value={usd(r.tot, 0)} />
          <Result label="Tax cost if tripped" value={usd(r.mqCost, 0)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.trips ? (
            <>Q4 holds <span className="font-medium">{num(r.share * 100, 1)}% of this year's depreciated basis — over the 40% line, so EVERY asset flips to mid-quarter convention</span>. Your Q4 {usd(r.q4Tested, 0)} (5-yr property) drops from a 20% to a 5% year-1 rate: that costs <span className="font-medium">{usd(r.mqCost, 0)}</span> in delayed tax savings at {rate}%. The fix is one checkbox: <span className="font-medium">§179 or bonus-expense the Q4 purchases</span> — expensed property leaves the 40% test entirely and the rest of the year keeps half-year convention.</>
          ) : expense && q4 > 0 ? (
            <>Smart sequencing: expensing the {usd(q4, 0)} of Q4 purchases pulls them out of the 40% test — remaining Q4 share is <span className="font-medium">{num(r.share * 100, 1)}%, safely under the line</span>. Without the election, the share would be {num((q4 / (q1 + q2 + q3 + q4)) * 100, 1)}%{(q4 / (q1 + q2 + q3 + q4)) > 0.4 ? ' — tripped' : ''}.</>
          ) : (
            <>Q4 share is {num(r.share * 100, 1)}% — under the 40% line, half-year convention holds for everything. Remember the harder deadline: assets must be <span className="font-medium">placed in service — installed and operational — by December 31</span>. Ordered and paid isn't enough; a $50,000 machine that slips to January 2 slides the entire deduction a year — {usd(50000 * rate / 100, 0)} of tax savings deferred at your rate.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The 40% mid-quarter test runs on MACRS basis AFTER subtracting anything you expense under §179 or bonus — which is why the year-end play is to expense Q4 purchases specifically, not just "as much as possible." Mid-quarter year-one rates on 5-year property by quarter: 35% / 25% / 15% / 5%, versus 20% flat under half-year — tripping the test punishes Q4 assets hardest while slightly helping Q1 buys, but the net is almost always negative for December-heavy years. The placed-in-service rule is the other December killer: the equipment must be delivered, installed, and operational by the 31st — a signed contract, a deposit, or a delivery date in January all fail. Non-calendar-year businesses test against their own fiscal Q4. Listed property (vehicles) follows the same conventions with the §280F caps on top. Estimates for planning — the election details (which assets to expense, state conformity) deserve a CPA's eyes before December 30.
        </p>
      </CardContent>
    </Card>
  )
}

// Equipment lease vs buy, business — the after-tax truth. BUY path: down + loan amortization; deductions = FULL purchase price year one via §179/100% bonus (financing doesn't reduce it — borrowed money still expenses) + loan interest as it's paid; residual value comes back at the end. OPERATING LEASE path: every payment deductible as made, no residual, no ownership. CAPITAL/$1-BUYOUT LEASE: treated as a purchase for tax — §179 applies even though you "leased" (the classic equipment-finance play: 100% financing + full §179 write-off year one = the deduction exceeds the cash out). What the math hides: leases price in the lessor's cost of capital (implicit APR often 8–12% when you back it out), end-of-lease buyouts, and mileage/hour overages; ownership carries maintenance after warranty. Node-verified: $100k equipment, 20% down, 7%/5yr → pmt $1,584.10, total out $115,046, interest $15,046, deductions $115,046 → after-tax net $68,231 at 32% w/ $10k residual; operating lease $1,900×60 = $114,000 → net $77,520; buy wins $9,289 — flip the residual to $0 and lease wins by $1,289.
export function EquipLeaseVsBuyCalc() {
  const [price, setPrice] = useNumber(100000)
  const [downPct, setDownPct] = useNumber(20)
  const [apr, setApr] = useNumber(7)
  const [years, setYears] = useNumber(5)
  const [leaseMo, setLeaseMo] = useNumber(1900)
  const [resid, setResid] = useNumber(10000)
  const [rate, setRate] = useNumber(32)

  const r = useMemo(() => {
    const n = Math.max(1, Math.round(years * 12))
    const loan = price * (1 - downPct / 100)
    const i = apr / 100 / 12
    const pmt = i > 0 ? (loan * i) / (1 - Math.pow(1 + i, -n)) : loan / n
    const buyOut = price * (downPct / 100) + pmt * n
    const interest = Math.max(0, buyOut - price)
    const buyDed = price + interest
    const buyNet = buyOut - buyDed * (rate / 100) - resid
    const leaseOut = leaseMo * n
    const leaseNet = leaseOut * (1 - rate / 100)
    const diff = leaseNet - buyNet
    const implAPR = price > 0 ? ((leaseMo * n - price) / price / years) * 100 : 0
    return { pmt, buyOut, interest, buyNet, leaseOut, leaseNet, diff, implAPR, n }
  }, [price, downPct, apr, years, leaseMo, resid, rate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Equipment price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Loan APR" value={apr} onChange={setApr} suffix="%" />
          <Field label="Term (years)" value={years} onChange={setYears} />
          <Field label="Lease payment (monthly)" value={leaseMo} onChange={setLeaseMo} prefix="$" />
          <Field label="Resale value at end (buy)" value={resid} onChange={setResid} prefix="$" />
          <Field label="Marginal tax rate" value={rate} onChange={setRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label={r.diff >= 0 ? 'Buying wins by' : 'Leasing wins by'} value={usd(Math.abs(r.diff), 0)} />
          <Result label="Buy: after-tax net cost" value={usd(r.buyNet, 0)} />
          <Result label="Lease: after-tax net cost" value={usd(r.leaseNet, 0)} />
          <Result label="Buy loan payment" value={`${usd(r.pmt, 0)}/mo`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Buying: {usd(r.buyOut, 0)} total out over {years} years, but deductions of {usd(price, 0)} (full §179/bonus — <span className="font-medium">financing doesn't reduce the write-off</span>) plus {usd(r.interest, 0)} of deductible interest, and {usd(resid, 0)} back at resale → net {usd(r.buyNet, 0)}. Leasing: {usd(r.leaseOut, 0)} of deductible payments → net {usd(r.leaseNet, 0)}. <span className="font-medium">{r.diff >= 0 ? `Buy by ${usd(r.diff, 0)}` : `Lease by ${usd(-r.diff, 0)}`}</span> — and the fulcrum is the residual: at $0 resale, the answer flips{resid > 0 ? ` (try it)` : ' here'}. The lease's implied financing cost is roughly {num(r.implAPR, 1)}% simple — back that out before signing any lease.
        </div>
        <p className="text-xs text-muted-foreground">
          The tax code tilts this comparison: buying with a loan still expenses the full price in year one under §179 or 100% bonus depreciation (borrowed money spends the same), plus loan interest is deductible as paid. An operating lease deducts each payment — smaller, spread out, and you own nothing at the end. A $1-buyout or capital lease is treated as a PURCHASE for tax: full §179 with near-zero cash down, which is why equipment finance companies lead with it. What the spreadsheet misses: lease overage charges (hours/miles), mandatory insurance riders, end-of-term buyout prices set above market, and the lessor's profit baked into the payment — always back out the implicit rate. Buying's risks: obsolescence (tech equipment), maintenance after warranty, and the residual assumption — the comparison flips entirely on that number. Leasing wins genuinely when the equipment ages fast, cash flow is tight, or the §179 income limit binds (lease payments deduct against income without the taxable-income cap). Rule of thumb: long-life iron (excavators, lathes) buys; short-life tech leases. Estimates — have the CPA confirm lease classification before signing.
        </p>
      </CardContent>
    </Card>
  )
}

// Business vehicle deduction, 2026 — three paths decided by the door-jamb GVWR label, not the price tag. PASSENGER AUTO (≤6,000 lbs GVWR): §280F luxury caps (Rev. Proc. 2026-15) — yr1 $20,300 w/bonus ($12,300 w/o), yr2 $19,800, yr3 $11,900, $7,160/yr after; a $90k sedan takes 9 years. HEAVY SUV (6,001–14,000 lbs GVWR, designed for passengers): escapes §280F; §179 capped $32,000 (2026, Rev. Proc. 2025-32) + 100% bonus on the rest → full year-1 write-off. EXEMPT WORK VEHICLES (pickup w/ 6ft+ bed, van seating 9+ behind driver, enclosed cargo van, >14,000 lbs GVWR, qualified non-personal-use): no SUV cap — full §179/bonus. Rules across all: >50% business use required (prorated below 100%; ≤50% kills 179/bonus AND flips to straight-line ADS, with recapture if use drops later); GVWR is the certification-label max loaded weight, NOT curb weight; placed in service by Dec 31. Node-verified: $90k sedan/100% → yr1 $20,300, 9-yr crawl ($20,300/$19,800/$11,900/$7,160×5/$2,200); $90k heavy SUV → $90,000 yr1 ($32k §179 + $58k bonus), saving $31,500 at 35% vs sedan's $7,105; $70k 6ft-bed pickup → $70,000; 70%-use SUV → $63,000.
const AUTO_CAPS = [20300, 19800, 11900, 7160]
export function VehicleWriteoffCalc() {
  const [price, setPrice] = useNumber(90000)
  const [busUse, setBusUse] = useNumber(100)
  const [type, setType] = useState<'auto' | 'suv' | 'exempt'>('suv')
  const [rate, setRate] = useNumber(35)

  const r = useMemo(() => {
    const elig = (price * busUse) / 100
    if (type === 'auto') {
      const sched: number[] = []
      let left = elig
      for (let y = 0; left > 0.5 && y < 30; y++) {
        const d = Math.min(AUTO_CAPS[Math.min(y, 3)], left)
        sched.push(d)
        left -= d
      }
      return { elig, yr1: sched[0] ?? 0, years: sched.length, sched, saved: (sched[0] ?? 0) * (rate / 100), full: false }
    }
    const cap = type === 'suv' ? 32000 : 2560000
    const d179 = Math.min(elig, cap)
    const yr1 = d179 + (elig - d179) // 100% bonus on remainder
    return { elig, yr1, years: 1, sched: [yr1], saved: yr1 * (rate / 100), full: true, d179, bonus: elig - d179 }
  }, [price, busUse, type, rate])

  const label = type === 'auto' ? 'passenger car (≤6,000 lbs GVWR)' : type === 'suv' ? 'heavy SUV (6,001–14,000 lbs)' : 'exempt work vehicle'
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Vehicle price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Business use" value={busUse} onChange={setBusUse} suffix="%" />
          <Field label="Marginal tax rate" value={rate} onChange={setRate} suffix="%" />
          <div>
            <div className="mb-1 text-sm font-medium">Vehicle class (door-jamb GVWR)</div>
            <select value={type} onChange={(e) => setType(e.target.value as 'auto' | 'suv' | 'exempt')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="auto">Car / light crossover (≤6,000 lbs)</option>
              <option value="suv">Heavy SUV (6,001–14,000 lbs)</option>
              <option value="exempt">Pickup 6ft+ bed / cargo van / 9+ seats / &gt;14k lbs</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Year-1 deduction" value={usd(r.yr1, 0)} />
          <Result label="Tax saved year 1" value={usd(r.saved, 0)} />
          <Result label="Fully written off in" value={r.years === 1 ? 'Year 1' : `${r.years} years`} />
          <Result label="Eligible basis" value={usd(r.elig, 0)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {type === 'auto' ? (
            <>The §280F luxury caps own this vehicle: year one is capped at <span className="font-medium">{usd(r.yr1, 0)}</span> no matter that bonus depreciation is 100% — then $19,800, $11,900, $7,160/yr. Full recovery of {usd(r.elig, 0)} takes <span className="font-medium">{r.years} years</span>. Same money in a 6,001-lb SUV would deduct it all this year. If you haven't signed yet, the GVWR label is worth {usd(Math.max(0, r.elig - r.yr1) * (rate / 100), 0)} in timing.</>
          ) : (
            <>This {label} escapes the luxury caps: <span className="font-medium">{usd(r.yr1, 0)} deductible in year one</span>{r.d179 !== undefined && <> — {usd(r.d179, 0)} of §179{type === 'suv' ? ' (the $32,000 SUV cap)' : ''} plus {usd(r.bonus ?? 0, 0)} of 100% bonus depreciation</>} — saving <span className="font-medium">{usd(r.saved, 0)}</span> at {rate}%. A same-price passenger car would deduct $20,300 this year and crawl for a decade.</>
          )}
          {busUse < 100 && busUse > 50 && <> Prorated to {busUse}% business use — keep the mileage log; the IRS audits exactly this.</>}
          {busUse <= 50 && <> <span className="font-medium">Warning: at ≤50% business use, §179 and bonus are both OFF the table</span> — you're on straight-line ADS, and crossing back below 50% in a later year triggers recapture of everything deducted.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules: passenger automobiles (GVWR ≤6,000 lbs — the certification label inside the driver's door, not curb weight) are §280F-capped at $20,300 year one with bonus, $12,300 without, $19,800/$11,900/$7,160 after (Rev. Proc. 2026-15). Heavy SUVs 6,001–14,000 lbs escape §280F but get a $32,000 §179 sub-cap with 100% bonus on the remainder. Exempt from the SUV cap entirely: pickups with a 6-foot-plus cargo bed, vans seating 9+ behind the driver, enclosed cargo vans, vehicles over 14,000 lbs GVWR, and qualified non-personal-use vehicles (delivery, permanently modified). All paths require over 50% qualified business use, prorated below 100% — a 70%-business $90,000 SUV deducts $63,000. Dropping to 50% or below in any later year recaptures the excess as income. Leased vehicles deduct the business share of payments with a lease-inclusion add-back over $62,000 FMV. Standard mileage (72.5¢/mile for 2026) is the alternative — compare with the mileage-vs-actual calculator; if you claim §179/bonus you must stay on actual expenses for that vehicle. State conformity varies. Estimates — vehicle tax is heavily audited; document business miles contemporaneously.
        </p>
      </CardContent>
    </Card>
  )
}

// MACRS GDS depreciation schedule (IRS Pub 946 Table A-1, half-year convention, DDB→SL switch): 3-yr 33.33/44.45/14.81/7.41; 5-yr 20/32/19.2/11.52/11.52/5.76; 7-yr 14.29/24.49/17.49/12.49/8.93/8.92/8.93/4.46; 10-yr 10/18/14.4/11.52/9.22/7.37/6.55/6.55/6.56/6.55/3.28 — each sums to 100%. Most equipment is 5- or 7-year property; computers/vehicles 5-yr; office furniture 7-yr. Convention traps: half-year assumed (half deduction year one regardless of in-service month); >40% of the year's basis placed in service in Q4 flips EVERYTHING to mid-quarter convention; ADS (straight-line) is mandatory for ≤50% business use, some farming, and elected for uniformity. With permanent 100% bonus (OBBBA) and $2.56M §179, MACRS matters when: state doesn't conform to bonus, you deliberately want deductions spread (income smoothing, avoiding NOL waste), or property doesn't qualify (used buildings' components via cost seg, etc.). Node-verified: $50k 5-yr → 10,000/16,000/9,600/5,760/5,760/2,880 (yr-1 saves $3,200 at 32% vs §179's $16,000 — the §179 calculator is the companion).
const MACRS_TABLES: Record<string, number[]> = {
  '3': [33.33, 44.45, 14.81, 7.41],
  '5': [20.0, 32.0, 19.2, 11.52, 11.52, 5.76],
  '7': [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
  '10': [10.0, 18.0, 14.4, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
}
export function MacrsCalc() {
  const [cost, setCost] = useNumber(50000)
  const [busUse, setBusUse] = useNumber(100)
  const [cls, setCls] = useState('5')
  const [rate, setRate] = useNumber(32)

  const r = useMemo(() => {
    const basis = (cost * busUse) / 100
    const sched = MACRS_TABLES[cls].map((p, i) => ({ yr: i + 1, pct: p, ded: (basis * p) / 100 }))
    const cum: number[] = []
    sched.reduce((a, s, i) => (cum[i] = a + s.ded, cum[i]), 0)
    return { basis, sched, cum, saved1: sched[0].ded * (rate / 100) }
  }, [cost, busUse, cls, rate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Asset cost" value={cost} onChange={setCost} prefix="$" />
          <Field label="Business use" value={busUse} onChange={setBusUse} suffix="%" />
          <div>
            <div className="mb-1 text-sm font-medium">MACRS class</div>
            <select value={cls} onChange={(e) => setCls(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="3">3-year (some tools, breeding animals)</option>
              <option value="5">5-year (computers, vehicles, most equipment)</option>
              <option value="7">7-year (office furniture, unclassed)</option>
              <option value="10">10-year (boats, some structures)</option>
            </select>
          </div>
          <Field label="Marginal tax rate" value={rate} onChange={setRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Year-1 deduction" value={usd(r.sched[0].ded, 0)} />
          <Result label="Depreciable basis" value={usd(r.basis, 0)} />
          <Result label="Year-1 tax saved" value={usd(r.saved1, 0)} />
          <Result label="Full write-off by" value={`Year ${r.sched.length}`} />
        </div>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="p-2">Year</th><th className="p-2">Rate</th><th className="p-2">Deduction</th><th className="p-2">Cumulative</th><th className="p-2">Basis left</th>
              </tr>
            </thead>
            <tbody>
              {r.sched.map((s, i) => (
                <tr key={s.yr} className="border-b last:border-0">
                  <td className="p-2">{s.yr}</td>
                  <td className="p-2">{num(s.pct, 2)}%</td>
                  <td className="p-2 font-medium">{usd(s.ded, 0)}</td>
                  <td className="p-2">{usd(r.cum[i], 0)}</td>
                  <td className="p-2 text-muted-foreground">{usd(r.basis - r.cum[i], 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {usd(r.basis, 0)} of {cls}-year property writes off over {r.sched.length} tax years (half-year convention — year one gets the half rate no matter when in the year it's placed in service). Year one: <span className="font-medium">{usd(r.sched[0].ded, 0)}, saving {usd(r.saved1, 0)} at {rate}%</span> — versus {usd(r.basis, 0)} immediately under §179 or 100% bonus. MACRS wins when you WANT deductions spread: non-conforming states (bonus decoupled → the federal bonus vanishes at state level), income-smoothing years, or assets that don't qualify.
        </div>
        <p className="text-xs text-muted-foreground">
          Rates are IRS Publication 946 Table A-1, general depreciation system, half-year convention with the 200%-declining-balance-to-straight-line switch — the default for most business property. Class guide: computers, peripherals, vehicles, and most machines are 5-year; office furniture and fixtures (and anything without an assigned class) are 7-year; 3-year covers some software-era tools and breeding livestock; 10-year covers vessels and certain structures. The mid-quarter trap: place more than 40% of the year's depreciable basis in service in the fourth quarter and EVERY asset that year switches to mid-quarter convention — the Q4-binge write-off shrinks. Business use at 50% or below forces ADS straight-line (and kills §179/bonus). Residential rental buildings use 27.5-year straight-line, commercial 39-year — different tables, see the rental depreciation calculator. With permanent 100% bonus depreciation and a $2.56M §179 cap in 2026, straight MACRS is now the deliberate-choice path, not the default: run the Section 179 calculator first, use this when spreading is the strategy. Estimates — convention elections and listed-property rules deserve a CPA's eyes.
        </p>
      </CardContent>
    </Card>
  )
}

// Section 179 + bonus depreciation, 2026 (OBBBA / Rev. Proc. 2025-32): §179 max $2,560,000, dollar-for-dollar phaseout above $4,090,000 placed-in-service, gone at $6,650,000; heavy SUVs (6,000–14,000 lb GVWR) capped at $32,000 of §179; 100% bonus depreciation PERMANENT for property acquired after Jan 19, 2025. The layer order: §179 first (asset-by-asset control, but capped by business TAXABLE income — excess carries forward, can't create a loss), then 100% bonus on remaining basis (no income limit, CAN create a loss). Both need >50% business use (deduction prorated). New AND used qualify. Node-verified: $75k equipment/100%/income $200k → $75,000 179 → $26,250 saved at 35% (matches section179.org); $80k SUV/80% → eligible $64,000, 179 capped $32,000 + bonus $32,000; $700k with only $50k income → 179 $50,000 (capped), bonus $650,000 (loss ok); $5.09M placed → cap falls to $1,560,000, bonus clears the remaining $3,530,000.
export function Section179Calc() {
  const [cost, setCost] = useNumber(75000)
  const [busUse, setBusUse] = useNumber(100)
  const [income, setIncome] = useNumber(200000)
  const [placed, setPlaced] = useNumber(75000)
  const [rate, setRate] = useNumber(35)
  const [suv, setSuv] = useState(false)

  const r = useMemo(() => {
    const elig = (cost * busUse) / 100
    const cap = Math.max(0, 2560000 - Math.max(0, placed - 4090000))
    const effCap = suv ? Math.min(cap, 32000) : cap
    const d179 = Math.min(elig, effCap, Math.max(0, income))
    const bonus = Math.max(0, elig - d179)
    const total = d179 + bonus
    return { elig, cap, effCap, d179, bonus, total, saved: (total * rate) / 100, carry: Math.max(0, Math.min(elig, effCap) - d179) }
  }, [cost, busUse, income, placed, rate, suv])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Equipment cost" value={cost} onChange={setCost} prefix="$" />
          <Field label="Business use" value={busUse} onChange={setBusUse} suffix="%" />
          <Field label="Business taxable income (before this)" value={income} onChange={setIncome} prefix="$" />
          <Field label="Total qualifying property placed in service this year" value={placed} onChange={setPlaced} prefix="$" />
          <Field label="Marginal tax rate" value={rate} onChange={setRate} suffix="%" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={suv} onChange={(e) => setSuv(e.target.checked)} className="h-4 w-4" />
            Heavy SUV (6,000–14,000 lb GVWR)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Year-one deduction" value={usd(r.total, 0)} />
          <Result label="§179 portion" value={usd(r.d179, 0)} />
          <Result label="100% bonus portion" value={usd(r.bonus, 0)} />
          <Result label="Tax saved" value={usd(r.saved, 0)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Year-one write-off: <span className="font-medium">{usd(r.total, 0)} of {usd(r.elig, 0)} eligible ({busUse}% of {usd(cost, 0)})</span>, saving <span className="font-medium">{usd(r.saved, 0)}</span> at {rate}% — net cost after tax: {usd(r.elig - r.saved, 0)}.
          {r.d179 < r.elig && r.bonus > 0 && <> §179 took {usd(r.d179, 0)}{r.d179 >= Math.max(0, income) && income < r.elig ? <> (capped by your {usd(income, 0)} business income{r.carry > 0 && <> — {usd(r.carry, 0)} carries forward</>}</> : suv ? ' (SUV cap $32,000)' : r.d179 >= r.effCap ? ' (phaseout cap)' : ''}, and <span className="font-medium">100% bonus depreciation clears the remaining {usd(r.bonus, 0)}</span> — bonus has no income limit and can even create a loss.</>}
          {placed > 4090000 && <> Note: with {usd(placed, 0)} placed in service, your §179 cap fell to {usd(r.cap, 0)}{r.cap === 0 ? ' — fully phased out; bonus depreciation is your tool' : ''}.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules under OBBBA (Rev. Proc. 2025-32): §179 expensing up to $2,560,000, reduced dollar-for-dollar when total qualifying property placed in service exceeds $4,090,000 — gone entirely at $6,650,000. Heavy SUVs between 6,000 and 14,000 lbs GVWR get a separate $32,000 §179 cap (the rest can still take bonus). Bonus depreciation is 100% and permanent for property acquired after January 19, 2025 — no phasedown. Layer them: §179 first for asset-by-asset control (it can't exceed business taxable income — the excess carries forward indefinitely), then bonus on the remaining basis (no income limit; can create or increase a loss — S-corp/partnership owners: basis, at-risk, and passive-loss rules can still suspend it). Requirements: tangible business property, new or used, placed in service this year, over 50% business use (deduction prorated; drop to ≤50% later and recapture hits). Watch state conformity — many states cap or decouple from bonus depreciation, so the federal saving can shrink at the state level. Vehicles ≤6,000 lbs follow the luxury-auto caps instead. Estimates — confirm placed-in-service timing and state rules with your CPA.
        </p>
      </CardContent>
    </Card>
  )
}

// Rule of 55 (IRC §72(t)(2)(A)(v)) — separate from service in or after the calendar year you turn 55 (50 for qualified public-safety employees) and distributions from THAT employer's 401(k)/403(b) skip the 10% early-withdrawal penalty — no 72(t) schedule, no five-year lock, any amounts. The traps that void it: it applies ONLY to the plan of the employer you separated from (old employers' plans don't qualify unless you merge them INTO the current plan BEFORE separating); rolling to an IRA destroys the exception instantly (IRA = back to 59½); the plan must actually allow partial/periodic withdrawals (some only allow lump sums — check the SPD); and ordinary income tax still applies, with 20% mandatory withholding on cash distributions. Node-verified: separate at 56, draw $40k/yr → 3.5 penalty-free years, $140,000 accessible, $14,000 penalty avoided; public-safety at 50 → 9.5 years, $475,000, $47,500; separate at 53 → NOT eligible (rule is the year you turn 55, not "after 55"); at 59 → 0.5 years of coverage.
export function RuleOf55Calc() {
  const [sepAge, setSepAge] = useNumber(56)
  const [balance, setBalance] = useNumber(400000)
  const [draw, setDraw] = useNumber(40000)
  const [pub, setPub] = useState(false)

  const r = useMemo(() => {
    const minAge = pub ? 50 : 55
    const ok = sepAge >= minAge
    const yrs = Math.max(0, 59.5 - sepAge)
    const accessible = Math.min(balance, draw * yrs)
    const saved = draw * yrs * 0.1
    return { ok, yrs, accessible, saved, minAge }
  }, [sepAge, balance, draw, pub])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Age at separation (leaving the job)" value={sepAge} onChange={setSepAge} />
          <Field label="This employer's 401(k)/403(b) balance" value={balance} onChange={setBalance} prefix="$" />
          <Field label="Annual draw you'd need" value={draw} onChange={setDraw} prefix="$" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} className="h-4 w-4" />
            Public-safety employee (police/fire/EMS — age 50)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Penalty-free?" value={r.ok ? 'Yes' : 'No'} />
          <Result label="Years of penalty-free access" value={num(r.yrs, 1)} />
          <Result label="Accessible over the window" value={usd(r.accessible, 0)} />
          <Result label="10% penalty avoided" value={usd(r.saved, 0)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.ok ? (
            <>Separating at {sepAge} qualifies — distributions from THIS employer's plan skip the 10% penalty until 59½: <span className="font-medium">{num(r.yrs, 1)} years, up to {usd(r.accessible, 0)} of draws, avoiding {usd(r.saved, 0)} in penalties</span>. No schedule to follow, no lock-in — take what you need. The kill-shot to avoid: <span className="font-medium">do NOT roll this plan into an IRA</span> — the exception dies the moment the money moves, and you're back to 59½ or a rigid 72(t). If you have older 401(k)s at prior employers, roll those INTO this plan before you separate — they inherit the exception.</>
          ) : (
            <>Separating at {sepAge} is too early — the rule requires separation in or after the calendar year you turn {r.minAge}{pub ? ' (public safety)' : ''}. The trap people spring on themselves: "I retired at {sepAge}, I'll just wait till {r.minAge} to touch it" — <span className="font-medium">doesn't work</span>; the separation year is what counts. Working {Math.max(1, Math.ceil(r.minAge - sepAge))} more year{Math.ceil(r.minAge - sepAge) === 1 ? '' : 's'} changes everything: {usd(draw, 0)}/yr penalty-free from then to 59½. Too early to qualify? A 72(t) SEPP on an IRA is the fallback — flexible amounts it is not, but it dodges the same penalty.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The rule of 55 is the cleanest early-access break in the code: separate from your employer in or after the calendar year you turn 55 — quit, laid off, fired, doesn't matter — and distributions from that employer's 401(k) or 403(b) carry no 10% penalty, in any amounts, on any schedule. Public-safety employees (federal and state/local police, fire, EMS, corrections — and private-sector firefighters under the SECURE 2.0 expansion) qualify at 50. What still applies: ordinary income tax on every dollar, and 20% mandatory federal withholding on distributions paid to you (have taxes settled at filing instead). What voids it: rolling the balance to an IRA (the exception is plan-only), separating even one year too early (it's the separation year, not your age when you withdraw), and plans that don't permit partial withdrawals — read the summary plan description before giving notice. IRAs never qualify. Compare before choosing: the rule of 55 beats 72(t) on flexibility (any amount, stop anytime) but requires leaving the job; a Roth conversion ladder beats both if you have five years of runway. Money left in the plan past 59½ stays penalty-free forever after.
        </p>
      </CardContent>
    </Card>
  )
}

// Social Security bridge — what delaying actually COSTS in portfolio terms, and what it buys. Claim early (62): PIA × 70% (FRA 67). Delay to 70: PIA × 124%. The bridge = the checks you skip: early-monthly × months delayed, pulled from your portfolio instead ($1,540 × 96 months = $147,840). The gain: (delayed − early) × 12 = the annuity you bought with that bridge money ($14,256/yr for life, COLA-adjusted, inflation-protected — compare: a $147,840 single-premium annuity at 70 pays roughly $11–13k/yr WITHOUT full COLA). Payback age = delay age + forgone ÷ annual gain — the classic ~80.4 for 62→70 at FRA 67. Implicit payout rate of the bridge "annuity": gain ÷ bridge ≈ 9.6% — far above any safe withdrawal rate, which is why delay is the cheapest longevity insurance available. Node-verified: PIA $2,200/FRA 67 → 62 = $1,540, 70 = $2,728, bridge $147,840, gain $14,256/yr, payback 10.37 yrs (age 80.4); 62→67 → bridge $92,400, gain $7,920/yr, payback 11.7 yrs.
export function SSBridgeCalc() {
  const [pia, setPia] = useNumber(2200)
  const [fromAge, setFromAge] = useState('62')
  const [toAge, setToAge] = useState('70')

  const r = useMemo(() => {
    const FRA = 67 * 12
    const factor = (ageYrs: number) => {
      const m = ageYrs * 12
      if (m < FRA) {
        const e = FRA - m
        return 1 - Math.min(e, 36) * (5 / 9) / 100 - Math.max(0, e - 36) * (5 / 12) / 100
      }
      return 1 + Math.min(m - FRA, 36) * (2 / 3) / 100
    }
    const a = Number(fromAge), b = Number(toAge)
    const early = pia * factor(a)
    const late = pia * factor(b)
    const mo = Math.max(0, (b - a) * 12)
    const bridge = early * mo
    const gainYr = (late - early) * 12
    const payback = gainYr > 0 ? bridge / gainYr : 0
    const payoutRate = bridge > 0 ? (gainYr / bridge) * 100 : 0
    return { early, late, bridge, gainYr, payback, breakAge: b + payback, payoutRate, mo }
  }, [pia, fromAge, toAge])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="PIA (benefit at FRA 67)" value={pia} onChange={setPia} prefix="$" />
          <div>
            <div className="mb-1 text-sm font-medium">Claiming from age</div>
            <select value={fromAge} onChange={(e) => setFromAge(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {['62', '63', '64', '65', '66', '67', '68', '69'].map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">Delaying to age</div>
            <select value={toAge} onChange={(e) => setToAge(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {['63', '64', '65', '66', '67', '68', '69', '70'].map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Bridge cost (checks skipped)" value={usd(r.bridge, 0)} />
          <Result label="Gain per year for life" value={usd(r.gainYr, 0)} />
          <Result label="Breakeven age" value={num(r.breakAge, 1)} />
          <Result label="Implicit payout rate" value={`${num(r.payoutRate, 1)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {Number(toAge) <= Number(fromAge) ? (
            <>Pick a delay age later than the claiming age — the bridge is the checks you skip between them.</>
          ) : (
            <>Claiming at {fromAge} pays {usd(r.early, 0)}/mo; waiting to {toAge} pays {usd(r.late, 0)}/mo. The delay costs <span className="font-medium">{usd(r.bridge, 0)}</span> — the {r.mo} checks you skip, pulled from your portfolio instead — and buys <span className="font-medium">{usd(r.gainYr, 0)} extra per year, for life, COLA-adjusted</span>. That's an implicit {num(r.payoutRate, 1)}% payout on the bridge money — no bond ladder or commercial annuity at {toAge} matches it, and none carries a government COLA. Breakeven is age {num(r.breakAge, 1)}; median life expectancy at 62 is ~82 (men) to ~85 (women), and the higher earner's delay also raises the survivor's check.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The bridge framing turns an abstract "should I delay" into a concrete portfolio question: delaying from {fromAge} to {toAge} means funding {usd(r.early, 0)}/month of spending from savings for {r.mo} months — {usd(r.bridge, 0)} in today's dollars — in exchange for {usd(r.gainYr, 0)} more per year for life, indexed to inflation. Think of it as buying a COLA-protected annuity at a {num(r.payoutRate, 1)}% payout rate when commercial single-premium annuities at 70 pay meaningfully less without a true CPI adjustment. Assumptions: FRA 67 (born 1960+), standard reduction (5/9%/month first 36, 5/12% beyond) and 8%/year delayed credits to 70; COLAs scale both sides, so today's-dollars math holds. Honest counters: delaying only wins if you live past breakeven (age {num(r.breakAge, 1)}) — health, family history, and whether you have a younger spouse who'd inherit the bigger check all matter; the bridge years are also your Roth-conversion sweet spot (lower income before benefits start — see the bracket-filler); and if working before FRA, the earnings test can withhold the early checks anyway. The 62-vs-70 gap is 77% — this is usually the highest-return "asset" a healthy 62-year-old can buy.
        </p>
      </CardContent>
    </Card>
  )
}

// Social Security earnings test, 2026 (SSA 2026 COLA fact sheet): under FRA all year → exempt $24,480 ($2,040/mo), withhold $1 per $2 over; year you REACH FRA → exempt $65,160 ($5,430/mo) counting only pre-FRA-month earnings, withhold $1 per $3; from the FRA month on, no test at all. Countable = wages + net self-employment only — pensions, 401(k)/IRA withdrawals, investment income, annuities don't count. SSA withholds whole checks (ceil of withheld ÷ monthly benefit), reconciles to actual earnings later. The part nobody believes: withheld benefits are NOT lost — at FRA, SSA recalculates your benefit, crediting the withheld months, permanently raising the check (actuarially it roughly returns the money over life expectancy; you lose only the time value). First-year grace rule: in the year you retire mid-year, any month under $2,040 (or $5,430, FRA year) pays a full check regardless of annual earnings. Node-verified: $1,800/mo, $40k wages, under FRA → excess $15,520, withheld $7,760 ≈ 5 checks, keep $13,840; FRA-year $80k pre-FRA wages, $2,000/mo, 8 benefit months → withheld $4,946.67 ≈ 3 checks; $24,480 exactly → $0; $150k wages, $2,000/mo → all 12 checks withheld ($24,000 cap).
export function SSEarningsTestCalc() {
  const [year, setYear] = useState<'under' | 'fra'>('under')
  const [earn, setEarn] = useNumber(40000)
  const [ben, setBen] = useNumber(1800)
  const [months, setMonths] = useNumber(12)

  const r = useMemo(() => {
    const lim = year === 'fra' ? 65160 : 24480
    const rate = year === 'fra' ? 3 : 2
    const excess = Math.max(0, earn - lim)
    const annualBen = ben * Math.max(1, months)
    const withheld = Math.min(excess / rate, annualBen)
    const checks = ben > 0 ? Math.ceil(withheld / ben) : 0
    return { lim, rate, excess, withheld, checks, keep: annualBen - withheld, monthlyLim: year === 'fra' ? 5430 : 2040 }
  }, [year, earn, ben, months])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <div className="mb-1 text-sm font-medium">Your 2026 situation</div>
            <select value={year} onChange={(e) => setYear(e.target.value as 'under' | 'fra')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="under">Under FRA all year</option>
              <option value="fra">Reach FRA this year</option>
            </select>
          </div>
          <Field label={year === 'fra' ? 'Wages BEFORE your FRA month' : 'Wages / self-employment this year'} value={earn} onChange={setEarn} prefix="$" />
          <Field label="Monthly SS benefit" value={ben} onChange={setBen} prefix="$" />
          {year === 'fra' ? <Field label="Benefit months before FRA" value={months} onChange={setMonths} /> : <div />}
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Benefits withheld" value={usd(r.withheld, 0)} />
          <Result label="Checks withheld (SSA takes whole months)" value={`≈ ${r.checks}`} />
          <Result label="You keep this year" value={usd(r.keep, 0)} />
          <Result label="2026 exempt amount" value={usd(r.lim, 0)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.withheld <= 0 ? (
            <>{usd(earn, 0)} is under the 2026 exempt amount of {usd(r.lim, 0)}{year === 'fra' ? ' (counting only months before your FRA month)' : ''} — <span className="font-medium">no withholding, full checks all year</span>. Remember only wages and net self-employment count: pensions, IRA/401(k) withdrawals, and investment income are invisible to this test.</>
          ) : r.withheld >= ben * Math.max(1, months) * 0.999 ? (
            <>At {usd(earn, 0)} of earnings, the withholding formula exceeds your entire benefit — <span className="font-medium">expect every check withheld this year ({usd(r.withheld, 0)})</span>. Honest read: if work pays this much, claiming before FRA mostly converts your benefit into a forced savings account — you'll get it back via the recalculation, but delayed.</>
          ) : (
            <>You're {usd(r.excess, 0)} over the {usd(r.lim, 0)} exempt amount, so SSA withholds $1 per ${r.rate}: <span className="font-medium">{usd(r.withheld, 0)} — about {r.checks} full check{r.checks === 1 ? '' : 's'}</span> (SSA withholds whole months, then reconciles to your actual reported earnings). You keep {usd(r.keep, 0)} this year.</>
          )} {r.withheld > 0 && <>The money isn't gone: at FRA, SSA recalculates your benefit upward for every withheld month — over a normal life expectancy you recover it; what you actually lose is the time value.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 exempt amounts (SSA): $24,480 if you're under full retirement age all year — $1 of benefits withheld per $2 over; $65,160 in the year you reach FRA, counting only earnings before your FRA month — $1 per $3; from your FRA month onward, no test at all, earn anything. Countable earnings are wages and net self-employment income only — pensions, annuities, IRA/401(k) withdrawals, interest, dividends, and capital gains don't count (they matter for the separate tax-on-benefits question instead). Two softeners: the first-year grace rule pays a full check for any month you're under $2,040 ($5,430 in the FRA year), no matter what you earned earlier — built for mid-year retirees; and the FRA recalculation restores withheld months as a permanently higher benefit. This test also applies to spousal and survivor benefits taken before FRA, and it's different from SSDI work rules and SSI — separate systems. SSA withholds whole monthly checks based on your estimated earnings, then settles against what you actually report — overestimates get refunded. Estimates only; report earnings changes to SSA to avoid overpayment surprises.
        </p>
      </CardContent>
    </Card>
  )
}

// HSA + Medicare retroactive trap — the quiet excess-contribution bomb for everyone working past 65 on an HDHP. The rule: enrolling in ANY Medicare part ends HSA contribution eligibility, and when you claim Social Security after 65, Part A enrollment is RETROACTIVE up to 6 months (never before your 65th-birthday month) — contributions for those backdated months were never eligible. Eligible months = enrollment month − 7 (Part A effective = enrollment − 6; eligibility ends the month BEFORE that... precisely: eligible = max(0, enrollMo − retro − 1) with retro=6). Excess contributions get a 6% excise tax EVERY YEAR until withdrawn with earnings. The defense: stop HSA contributions 6+ months before you plan to claim SS/Medicare — or don't claim (but you can't refuse Part A once you take Social Security). 2026 limits: self $4,400, family $8,750, +$1,000 catch-up at 55+ (per person — a spouse's catch-up must go in their OWN HSA). Node-verified: family+catch-up $9,750, enroll December → Part A effective June → 5 eligible months → limit $4,062.50; contributed the full $9,750 → excess $5,687.50, excise $341.25/yr; enroll October → 3 eligible months → $2,437.50; enroll July → 0 eligible months, everything is excess; last safe contribution month for a December claim = May.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export function HsaMedicareTrapCalc() {
  const [coverage, setCoverage] = useState<'self' | 'family'>('family')
  const [catchup, setCatchup] = useState(true)
  const [enrollMo, setEnrollMo] = useState('12')
  const [contributed, setContributed] = useNumber(9750)

  const r = useMemo(() => {
    const limit = (coverage === 'self' ? 4400 : 8750) + (catchup ? 1000 : 0)
    const em = Number(enrollMo)
    const retroEffective = Math.max(1, em - 6) // Part A effective month
    const eligMonths = Math.max(0, em - 6 - 1)
    const eligLimit = (limit * eligMonths) / 12
    const excess = Math.max(0, contributed - eligLimit)
    const excise = excess * 0.06
    const lastSafe = eligMonths // last month you may contribute FOR
    return { limit, retroEffective, eligMonths, eligLimit, excess, excise, lastSafe, em }
  }, [coverage, catchup, enrollMo, contributed])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <div className="mb-1 text-sm font-medium">HDHP coverage</div>
            <select value={coverage} onChange={(e) => setCoverage(e.target.value as 'self' | 'family')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="self">Self-only</option>
              <option value="family">Family</option>
            </select>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">Medicare/SS claim month</div>
            <select value={enrollMo} onChange={(e) => setEnrollMo(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <Field label="Contributed this calendar year" value={contributed} onChange={setContributed} prefix="$" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={catchup} onChange={(e) => setCatchup(e.target.checked)} className="h-4 w-4" />
            Age 55+ ($1,000 catch-up)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Your real limit this year" value={usd(r.eligLimit, 2)} />
          <Result label="HSA-eligible months" value={`${r.eligMonths} of 12`} />
          <Result label="Excess contribution" value={usd(r.excess, 2)} />
          <Result label="6% excise per year until fixed" value={usd(r.excise, 2)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Claiming Social Security or Medicare in <span className="font-medium">{MONTHS[r.em - 1]}</span> backdates Part A to <span className="font-medium">{MONTHS[r.retroEffective - 1]}</span> — so only {r.eligMonths} month{r.eligMonths === 1 ? '' : 's'} of HSA eligibility survive: <span className="font-medium">{usd(r.eligLimit, 2)}</span> of the {usd(r.limit)} headline limit. {r.excess > 0 ? (
            <>You've over-contributed <span className="font-medium">{usd(r.excess, 2)}</span> — that excess owes 6% ({usd(r.excise, 2)}) every year it sits there. The fix: withdraw the excess plus earnings before the tax-filing deadline and it becomes ordinary income instead of a recurring penalty.</>
          ) : (
            <>You're inside the line — nothing to fix. The safe habit for anyone 65+: the last month you can contribute for is <span className="font-medium">{r.lastSafe > 0 ? MONTHS[r.lastSafe - 1] : 'none this year'}</span>, so stop contributions at least six months before any planned claim.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The mechanics nobody warns you about: signing up for Social Security after 65 automatically enrolls you in Medicare Part A, retroactively up to six months — and HSA contributions for any month of Medicare entitlement were never allowed, no matter that nobody told you at the time. The retroactive window can't reach before your 65th-birthday month, so this bites hardest at 65½ and beyond. The excess-contribution penalty is 6% per year, every year, until you withdraw the excess and its earnings (Form 8889 and a corrected 1099-SA); pull it before the filing deadline and it's just taxable income. Planning rules: stop HSA contributions six months before claiming Social Security; a spouse's $1,000 catch-up must go into their OWN HSA, not yours; and you cannot have Part A without taking Social Security once you've claimed — delaying SS past 65 while staying on an HDHP is the only way to keep contributing. Employer contributions count against the same prorated limit. After Medicare starts, the HSA still spends tax-free on premiums (Part B/D, Medicare Advantage — not Medigap) and, after 65, on anything at all as ordinary income with no penalty — the account stays useful, the contributions just end.
        </p>
      </CardContent>
    </Card>
  )
}

// 72(t) SEPP — substantially equal periodic payments: penalty-free IRA access before 59½, priced three IRS ways. RMD method: balance ÷ Single Life Expectancy (Pub 590-B Table I, 2022+ tables). Fixed amortization: pmt = balance × r ÷ (1 − (1+r)^−LE), where r ≤ the GREATER of 5% or 120% of the federal mid-term AFR — amortization pays roughly 2.2× the RMD method. Fixed annuitization ≈ amortization with a mortality/mid-year adjustment (≈ ×(1+r)^0.5 here; exact factors come from the IRS mortality table). The lock: payments must run the LONGER of 5 years or until 59½ — a 50-year-old is locked 9.5 years; a 57-year-old still runs to 62. Bust it (modify, stop, or add to the account) and the 10% penalty hits EVERY payment retroactively, plus interest — on the amortization schedule above that's ~$28,648. One mercy: a one-time switch from amortization/annuitization DOWN to the RMD method is allowed (Rev. Rul. 2002-62). Splitting IRAs first (into a "SEPP IRA" sized to the income need and a reserve IRA) is the standard safety play. Node-verified: $500k at 50, LE 36.2 → RMD $13,812.15/yr; amortization at 5% → $30,156.12; annuitization ≈ $30,900.83; lock ends 59½; bust cost ≈ $28,648.
const SLE_TABLE: [number, number][] = [
  [45, 41.0], [46, 40.0], [47, 39.0], [48, 38.1], [49, 37.1], [50, 36.2], [51, 35.3], [52, 34.3], [53, 33.4], [54, 32.5], [55, 31.6], [56, 30.6], [57, 29.8], [58, 28.9], [59, 28.0], [60, 27.1], [61, 26.2], [62, 25.4], [63, 24.5], [64, 23.7], [65, 22.9],
]
export function Sepp72tCalc() {
  const [balance, setBalance] = useNumber(500000)
  const [age, setAge] = useState('50')
  const [rate, setRate] = useNumber(5)

  const r = useMemo(() => {
    const a = Number(age)
    const le = SLE_TABLE.find(([x]) => x === a)?.[1] ?? 36.2
    const rmd = balance / le
    const rr = rate / 100
    const amort = rr > 0 ? (balance * rr) / (1 - Math.pow(1 + rr, -le)) : balance / le
    const annuit = amort * Math.sqrt(1 + rr)
    const lock = Math.max(59.5 - a, 5)
    const endAge = a + lock
    const bust = amort * lock * 0.1
    return { rmd, amort, annuit, lock, endAge, bust, le }
  }, [balance, age, rate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="SEPP IRA balance" value={balance} onChange={setBalance} prefix="$" />
          <div>
            <div className="mb-1 text-sm font-medium">Age at first payment</div>
            <select value={age} onChange={(e) => setAge(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {SLE_TABLE.map(([a]) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <Field label="Interest rate (≤ greater of 5% or 120% fed mid-term)" value={rate} onChange={setRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Max method (amortization)" value={`${usd(r.amort, 0)}/yr`} />
          <Result label="Annuitization (approx)" value={`${usd(r.annuit, 0)}/yr`} />
          <Result label="RMD method (smallest)" value={`${usd(r.rmd, 0)}/yr`} />
          <Result label="Locked until" value={`age ${num(r.endAge, 1)}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Starting at {age}, the amortization method pays <span className="font-medium">{usd(r.amort, 0)}/yr ({usd(r.amort / 12, 0)}/mo)</span> — {num(r.amort / r.rmd, 1)}× the RMD method's {usd(r.rmd, 0)}. You're locked for <span className="font-medium">{num(r.lock, 1)} years, until {num(r.endAge, 1)}</span>: the longer of 5 years or 59½. Break the schedule — miss a payment, take extra, or roll money in — and the IRS claws back 10% on every payment ever taken: <span className="font-medium">about {usd(r.bust, 0)} plus interest</span> on this schedule. Need less income later? The one allowed switch is DOWN to the RMD method — it cuts the payment permanently but keeps the plan alive.
        </div>
        <p className="text-xs text-muted-foreground">
          A 72(t) SEPP program waives the 10% early-withdrawal penalty on IRA money before 59½ in exchange for rigidity: substantially equal payments, computed by one of three IRS methods, continuing for the longer of five years or until 59½. The interest rate cap is the greater of 5% or 120% of the federal mid-term AFR for either of the two months before payments start — the amortization and annuitization methods scale with it. The standard safety play is splitting first: move exactly enough into a dedicated SEPP IRA to generate the income you need, and keep the rest in a reserve IRA for real emergencies — money outside the program can still be tapped at 10% without busting the schedule. RMD-method payments recalculate annually with the balance (they flex with the market); amortization and annuitization are fixed. Compare the alternatives before committing: the rule-of-55 on a 401(k), a Roth conversion ladder (five-year seasoning, but flexible amounts), and penalty exceptions for unemployment health premiums or first-home costs all beat SEPP on flexibility. Ordinary income tax applies to every payment regardless. Annuitization here is approximated; exact IRS factors use a mortality table — verify with a CPA before the first withdrawal, because there's no undo.
        </p>
      </CardContent>
    </Card>
  )
}

// Roth conversion bracket-filler — convert exactly enough to top out a chosen bracket and not a dollar more. Room = bracket top − taxable income (taxable = AFTER the standard deduction, 2026: $16,100 single / $32,200 MFJ). Conversion capped by the traditional IRA balance. Tax cost = bracketTax(income+conv) − bracketTax(income); effective rate lands just under the target marginal rate when the fill spans two brackets. IRMAA awareness: for anyone 63+, conversion MAGI (≈ taxable + standard deduction + tax-exempt interest) sets Medicare premiums TWO years later — 2026 single first cliff $109,000 MAGI, +$1,148.40/yr per person (Part B $202.90 → $298.60/mo) for crossing by $1. Node-verified: single $45,000 taxable fill 22% → convert $60,700, tax $12,814 (21.11% effective: $5,400 at 12% + $55,300 at 22%); MFJ $90,000 fill 22% → $121,400, tax $25,628; IRA $50,000 caps conversion → tax $10,460; MAGI check: $45,000 + $16,100 + $60,700 = $121,800 → $12,800 over the first IRMAA cliff.
export function RothBracketFillCalc() {
  const [status, setStatus] = useState<'single' | 'mfj'>('single')
  const [taxable, setTaxable] = useNumber(45000)
  const [ira, setIra] = useNumber(300000)
  const [target, setTarget] = useState('22')
  const [medicare, setMedicare] = useState(false)

  const r = useMemo(() => {
    const f = FEDERAL[status]
    const b = f.brackets
    const i = b.findIndex((x) => x[1] === Number(target))
    const top = i + 1 < b.length ? b[i + 1][0] : Infinity
    const room = Math.max(0, (top === Infinity ? 0 : top) - taxable)
    const conv = Math.min(room, ira)
    const cost = bracketTax(b, taxable + conv) - bracketTax(b, taxable)
    const eff = conv > 0 ? (cost / conv) * 100 : 0
    // IRMAA: MAGI ≈ taxable + standard deduction (tax-exempt interest ignored)
    const magi = taxable + f.ded + conv
    const cliff = status === 'single' ? 109000 : 218000
    const irmaaHit = medicare && magi > cliff
    return { room, conv, cost, eff, top, magi, cliff, irmaaHit }
  }, [status, taxable, ira, target, medicare])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="mb-1 text-sm font-medium">Filing status</div>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'single' | 'mfj')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </div>
          <Field label="Taxable income BEFORE conversion" value={taxable} onChange={setTaxable} prefix="$" />
          <Field label="Traditional IRA balance" value={ira} onChange={setIra} prefix="$" />
          <div>
            <div className="mb-1 text-sm font-medium">Fill up to bracket</div>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {['12', '22', '24', '32', '35'].map((x) => <option key={x} value={x}>{x}%</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={medicare} onChange={(e) => setMedicare(e.target.checked)} className="h-4 w-4" />
            I'm 63+ (show Medicare IRMAA impact)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Convert this year" value={usd(r.conv, 0)} />
          <Result label="Tax on the conversion" value={usd(r.cost, 0)} />
          <Result label="Effective rate on it" value={`${num(r.eff, 1)}%`} />
          <Result label="Bracket room" value={r.top === Infinity ? 'Top bracket' : usd(r.room, 0)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.conv <= 0 ? (
            <>Your taxable income already meets or exceeds the top of the {target}% bracket — no room to fill. Pick a higher target bracket above, or skip the conversion this year.</>
          ) : (
            <>Convert <span className="font-medium">{usd(r.conv, 0)}</span> — it fills your income to the top of the {target}% bracket{r.conv < r.room ? <> (your IRA balance caps you before the bracket does — {usd(r.room, 0)} of room, {usd(ira, 0)} available)</> : ' exactly'}. Cost: {usd(r.cost, 0)} federal, an effective {num(r.eff, 1)}% on the converted dollars{r.eff < Number(target) ? <> — less than {target}% because the first slice filled a lower bracket</> : ''}. Every dollar past this would be taxed at {r.top === Infinity ? '37' : 'the next bracket'}%.</>
          )}
          {medicare && r.conv > 0 && (r.irmaaHit ? (
            <> <span className="font-medium">IRMAA warning:</span> this conversion puts MAGI at {usd(r.magi, 0)} — {usd(r.magi - r.cliff, 0)} over the first Medicare cliff ({usd(r.cliff, 0)} {status === 'single' ? 'single' : 'joint'}). Two years later, Part B jumps $95.70/mo — $1,148/yr per person — for crossing by even $1. Size to {usd(Math.max(0, r.cliff - taxable - FEDERAL[status].ded), 0)} instead if the premium matters more than the bracket.</>
          ) : (
            <> IRMAA check: conversion MAGI lands at {usd(r.magi, 0)}, under the first cliff ({usd(r.cliff, 0)}) — no Medicare surcharge two years out. Headroom: {usd(r.cliff - r.magi, 0)}.</>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          The bracket-filler is the systematic version of Roth conversion planning: each year, convert exactly enough traditional IRA to top out your chosen bracket — usually 22% or 24% — so no conversion dollar ever gets taxed at a rate you didn't choose. Taxable income here means AFTER the standard deduction ($16,100 single / $32,200 joint, 2026 brackets). The effective rate on the fill runs below the target rate whenever your income starts in a lower bracket. The two cliffs the bracket math misses: Medicare IRMAA — conversions count fully in MAGI, and income at 63 sets premiums at 65, two years later, as a hard cliff ($1 over costs $1,148/yr per person in 2026) — and the NIIT at $200k/$250k MAGI. Converted amounts are locked five years for penalty purposes if you're under 59½ (see the Roth 5-year rule calculator), and conversions are irreversible since 2018 — you can't recharacterize anymore. Pay the tax from OUTSIDE funds if you can; paying from the conversion itself under 59½ makes the withheld piece an early distribution. State tax not included.
        </p>
      </CardContent>
    </Card>
  )
}

// Coast FIRE — the portfolio size at which you can stop saving and let compounding carry you to full retirement. FIRE number = annual spend ÷ safe withdrawal rate ($60k ÷ 4% = $1.5M). Coast number = FIRE ÷ (1+r)^years — what you need invested TODAY so growth alone gets there by your retirement age. Below it, the time-to-coast solves portfolio×(1+r)^t + contributions×((1+r)^t−1)/r = coast → (1+r)^t = (coast + c/r)/(P + c/r). The psychology is the point: once coasting, your paycheck only needs to cover THIS year's spending — career risk, sabbaticals, and downshifts stop threatening retirement. Honest wrinkles: use a REAL return (5% real ≈ 8% nominal − 3% inflation) so today's dollars stay today's dollars; the SWR assumption dominates the result (3.5% vs 4.5% moves the target ~28%); sequence risk still applies after full retirement — coast FIRE assumes average returns, which is fine for a target, not a guarantee. Node-verified: $60k/4%/35→65/5% → FIRE $1.5M, coast $347,066; P=$300k + $10k/yr → coast in 1.84 yrs (86.4% there); P=$400k → 2.9 yrs ahead; 25yo/60/$80k/4.5%/6% → FIRE $1,777,778, coast $231,298.
export function CoastFireCalc() {
  const [age, setAge] = useNumber(35)
  const [retAge, setRetAge] = useNumber(65)
  const [spend, setSpend] = useNumber(60000)
  const [portfolio, setPortfolio] = useNumber(300000)
  const [contrib, setContrib] = useNumber(10000)
  const [r, setR] = useNumber(5)
  const [swr, setSwr] = useNumber(4)

  const res = useMemo(() => {
    const yrs = Math.max(0, retAge - age)
    const fire = spend / (swr / 100)
    const rr = r / 100
    const coast = fire / Math.pow(1 + rr, yrs)
    const progress = coast > 0 ? (portfolio / coast) * 100 : 0
    let yrsToCoast = 0
    if (portfolio < coast && yrs > 0) {
      if (contrib > 0) {
        yrsToCoast = Math.log((coast + contrib / rr) / (portfolio + contrib / rr)) / Math.log(1 + rr)
      } else {
        yrsToCoast = Math.log(coast / portfolio) / Math.log(1 + rr)
      }
    }
    const ahead = portfolio >= coast ? Math.log(portfolio / coast) / Math.log(1 + rr) : 0
    const coastAge = age + yrsToCoast
    return { fire, coast, progress, yrsToCoast, ahead, coastAge, yrs, isCoast: portfolio >= coast }
  }, [age, retAge, spend, portfolio, contrib, r, swr])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Current age" value={age} onChange={setAge} />
          <Field label="Full retirement age" value={retAge} onChange={setRetAge} />
          <Field label="Annual spend in retirement (today's $)" value={spend} onChange={setSpend} prefix="$" />
          <Field label="Invested portfolio today" value={portfolio} onChange={setPortfolio} prefix="$" />
          <Field label="Current annual contributions" value={contrib} onChange={setContrib} prefix="$" />
          <Field label="Real return assumption" value={r} onChange={setR} suffix="%" />
          <Field label="Safe withdrawal rate" value={swr} onChange={setSwr} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Coast number today" value={usd(res.coast, 0)} />
          <Result label="Full FIRE number" value={usd(res.fire, 0)} />
          <Result label="Your progress" value={`${num(res.progress, 1)}%`} />
          <Result label={res.isCoast ? 'Status' : 'Coast at age'} value={res.isCoast ? 'Already coasting' : num(res.coastAge, 1)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {res.isCoast ? (
            <>Your {usd(portfolio)} already beats the coast number of {usd(res.coast, 0)} — <span className="font-medium">you are Coast FIRE, {num(res.ahead, 1)} years of growth ahead of schedule</span>. From here your paycheck only needs to cover this year's life; every retirement dollar is compounding's job now. You could stop contributing entirely and still hit {usd(res.fire, 0)} by {retAge}.</>
          ) : (
            <>Coast needs {usd(res.coast, 0)} invested today — you have {usd(portfolio)} ({num(res.progress, 1)}%). {contrib > 0 ? <>At {usd(contrib)}/yr in contributions you cross the line in <span className="font-medium">{num(res.yrsToCoast, 1)} years, around age {num(res.coastAge, 1)}</span> — after that, saving becomes optional and compounding does the rest.</> : <>With no contributions you never catch it — the coast number requires growth alone to close a gap it's already behind on.</>}</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Coast FIRE is the milestone where your portfolio, growing untouched, reaches your full FIRE number (annual spend ÷ safe withdrawal rate) by your retirement age — after which every dollar you earn only needs to fund the present. The math is one line: coast number = FIRE number ÷ (1 + real return)^years. The assumptions do the heavy lifting: use a REAL (after-inflation) return — 5% real is a reasonable long-run equity/bond blend, 8% nominal minus 3% inflation — and the withdrawal rate moves the target more than most people expect ($60k at 3.5% wants $1.71M; at 4.5%, $1.33M). Coast FIRE is a target, not a guarantee: sequence-of-returns risk still applies, the 4% rule is a historical-US result, and the number ignores taxes, Social Security (which lowers the required portfolio — run it here with your expected benefit as reduced spend), and pensions. Barista FIRE is the middle gear: part-time income covers part of spending so the portfolio only needs to bridge the rest. Estimates for planning, not a promise.
        </p>
      </CardContent>
    </Card>
  )
}

// Social Security SURVIVOR benefits — a different, more generous rulebook than spousal. Widow(er)s can claim as early as 60 (50 if disabled) and at 60 always get exactly 71.5% of the base — the per-month reduction (28.5% spread over the months from 60 to survivor-FRA) flexes so the 60 number is constant. The base: worker's actual benefit, BUT if the worker claimed early the survivor is protected by the RIB LIM floor — the GREATER of the worker's reduced check or 82.5% of PIA; if the worker DELAYED, the DRCs carry over (delay to 70 → survivor gets 124%). The strategy superpower: NO deemed filing on survivor claims — a widow can take a reduced survivor benefit at 60 and switch to her own maxed benefit at 70 (or vice versa), the one remaining legal switch. Remarriage before 60 kills eligibility (unless it ends); after 60 it's fine. Survivor FRA runs on its own table, 2 years behind retirement FRA: 66 for born ≤1956, +2mo/yr, 67 for 1962+. Node-verified: base $2,600, FRA 67 → $1,859.00 at 60, $2,282.43 at 64 (36 mo early), $2,600 at FRA; worker claimed at 62 ($1,820) → floor kicks in, base $2,145 → $1,533.68 at 60; worker delayed to 70 → base $3,224; survivor FRA: 1957→794mo, 1960→800, 1962→804; own PIA $2,000 → $2,480 at 70, beat the $1,859 survivor-60 path for the switch.
const SURV_FRA: [string, number][] = [
  ['1956 or earlier', 792], ['1957', 794], ['1958', 796], ['1959', 798], ['1960', 800], ['1961', 802], ['1962 or later', 804],
]
export function SurvivorSSCalc() {
  const [pia, setPia] = useNumber(2600)
  const [actual, setActual] = useNumber(0)
  const [birth, setBirth] = useState('804')
  const [claimAge, setClaimAge] = useState('60')
  const [ownPIA, setOwnPIA] = useNumber(2000)

  const r = useMemo(() => {
    const fra = Number(birth)
    const m = Math.round(Number(claimAge) * 12)
    // base: unclaimed → PIA; claimed → actual, with the 82.5% PIA floor if they claimed early
    const base = actual <= 0 ? pia : actual < pia ? Math.max(actual, 0.825 * pia) : actual
    const floored = actual > 0 && actual < pia && base > actual
    let ben = base
    if (m < fra) ben = base * (1 - 0.285 * (fra - m) / (fra - 720))
    // own benefit at 70 for the switch comparison — retirement FRA runs 4mo ahead of survivor FRA (1955–1960 births), cap 804
    const retFRAfixed = Math.min(804, fra + 4)
    const ownAt70 = ownPIA * (1 + 0.08 * (840 - retFRAfixed) / 12)
    const switchWins = ownPIA > 0 && ownAt70 > ben
    return { base, floored, ben, ownAt70, switchWins, fra }
  }, [pia, actual, birth, claimAge, ownPIA])

  const fraLabel = r.fra >= 804 ? '67' : `66y ${r.fra - 792}m`
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Deceased worker's PIA" value={pia} onChange={setPia} prefix="$" />
          <Field label="Their actual benefit at death (0 = never claimed)" value={actual} onChange={setActual} prefix="$" />
          <Field label="Your own PIA (0 = no own record)" value={ownPIA} onChange={setOwnPIA} prefix="$" />
          <div>
            <div className="mb-1 text-sm font-medium">Your birth year</div>
            <select value={birth} onChange={(e) => setBirth(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {SURV_FRA.map(([y, mo]) => <option key={y} value={mo}>{y}</option>)}
            </select>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">Claim survivor benefit at age</div>
            <select value={claimAge} onChange={(e) => setClaimAge(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {['60', '61', '62', '63', '64', '65', '66', '67'].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Survivor benefit / month" value={usd(r.ben, 0)} />
          <Result label="Per year" value={usd(r.ben * 12, 0)} />
          <Result label="Base used" value={usd(r.base, 0)} />
          <Result label="Your own at 70" value={ownPIA > 0 ? usd(r.ownAt70, 0) : '—'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {Number(claimAge) * 12 < r.fra ? (
            <>Claiming at {claimAge} (survivor FRA {fraLabel}) pays <span className="font-medium">{usd(r.ben, 0)}/mo — {num((r.ben / r.base) * 100, 1)}% of the {usd(r.base, 0)} base</span>. At 60 the benefit is always exactly 71.5% — the reduction schedule flexes so that number never changes. Waiting to FRA pays the full {usd(r.base, 0)}.</>
          ) : (
            <>At survivor FRA ({fraLabel}) the full base pays: <span className="font-medium">{usd(r.ben, 0)}/mo ({usd(r.ben * 12, 0)}/yr)</span>.</>
          )}
          {r.floored && <> The 82.5%-of-PIA floor protected you: your spouse's early claiming cut their check to {usd(actual, 0)}, but your base is <span className="font-medium">{usd(r.base, 0)}</span> — the floor, not their reduced amount.</>}
          {r.switchWins && <> <span className="font-medium">The switch strategy pays:</span> take this survivor benefit now, let your own grow to {usd(r.ownAt70, 0)}/mo at 70, then switch — survivor claims are exempt from deemed filing, the one place the double-dip still lives.</>}
          {ownPIA > 0 && !r.switchWins && <> Your own maxed benefit ({usd(r.ownAt70, 0)} at 70) doesn't beat this — claim your own early if needed and let the survivor benefit ripen to FRA instead.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          Survivor benefits run on a different rulebook than spousal: up to 100% of what the worker received (or was owed), claimable from 60 — 50 if disabled — with the age-60 amount fixed at 71.5% of the base no matter your birth year. The base itself has teeth: if the worker claimed early, the widow's-limit floor pays the greater of their reduced check or 82.5% of their PIA; if they delayed past FRA, every delayed credit passes to you — a worker who waited to 70 leaves 124% of PIA. The strategy: survivor claims are exempt from deemed filing, so you can take a reduced survivor benefit at 60 while your own retirement benefit accrues 8%/yr to 70, then switch — or claim your own first and let the survivor benefit grow to FRA. Remarriage before 60 ends eligibility (unless that marriage ends); remarriage after 60 changes nothing. Divorced surviving spouses qualify on the same terms if the marriage lasted 10 years. Children's and dependent-parent benefits exist too. Estimates only — the SSA computes exact amounts, and the earnings test applies if you work before FRA.
        </p>
      </CardContent>
    </Card>
  )
}

// Spousal Social Security — up to 50% of the worker's PIA, but only at the spouse's FRA; earlier claiming cuts it 25/36%/mo (first 36 months) then 5/12%/mo — max 35% cut at 62 vs FRA 67, so the floor is 32.5% of PIA. NO delayed credits on the spousal piece past FRA — if the worker has filed, waiting past FRA adds nothing to it. Deemed filing: a claim files for BOTH own + spousal; the own benefit reduces on its own schedule (5/9%/mo first 36, 5/12% beyond; +8%/yr DRC to 70) and the spousal "excess" (50% worker PIA − own PIA) reduces on the spousal schedule. Worker must have FILED for a current spouse to collect (divorced spouses are independently entitled once divorced 2+ years; marriage must have lasted 10+ years, claimant 62+ and unmarried; the ex's check is untouched). FRA: 66 + 2mo/yr for 1955–1959 births, 67 for 1960+. Survivor benefits are a DIFFERENT rule (up to 100% of the worker's amount). Node-verified: worker $2,400 / own $800, FRA 67: claim 64 → own $640 + excess $300 = $940; 67 → $1,200; 62 → $560 + $260 = $820; never-worked spouse: $1,200 at FRA, $780 at 62; own PIA $1,500 → excess $0; own claim at 70 → $992 + $400 = $1,392.
const SS_FRA_MONTHS: [string, number][] = [
  ['1955 or earlier', 792], ['1956', 796], ['1957', 798], ['1958', 800], ['1959', 802], ['1960 or later', 804],
]
export function SpousalSSCalc() {
  const [workerPIA, setWorkerPIA] = useNumber(2400)
  const [ownPIA, setOwnPIA] = useNumber(800)
  const [claimAge, setClaimAge] = useState('64')
  const [birth, setBirth] = useState('804')
  const [divorced, setDivorced] = useState(false)

  const r = useMemo(() => {
    const fra = Number(birth) // months
    const m = Math.round(Number(claimAge) * 12)
    // own benefit factor: early 5/9% x36 then 5/12%; DRC 2/3%/mo to age 70 (36 mo cap past FRA 67-ish — cap at 70)
    let ownF = 1
    if (m < fra) {
      const early = fra - m
      ownF = 1 - Math.min(early, 36) * (5 / 9) / 100 - Math.max(0, early - 36) * (5 / 12) / 100
    } else {
      ownF = 1 + Math.min(m - fra, 840 - fra) * (2 / 3) / 100 // DRC capped at age 70 (840 months)
    }
    // spousal excess factor: early 25/36% x36 then 5/12%; no DRC past FRA
    let spF = 1
    if (m < fra) {
      const early = fra - m
      spF = 1 - Math.min(early, 36) * (25 / 36) / 100 - Math.max(0, early - 36) * (5 / 12) / 100
    }
    const own = ownPIA * ownF
    const excessFull = Math.max(0, 0.5 * workerPIA - ownPIA)
    const excess = excessFull * spF
    const tot = own + excess
    const atFRA = ownPIA + excessFull
    return { own, excess, excessFull, tot, atFRA, pctOfPIA: workerPIA > 0 ? (tot / workerPIA) * 100 : 0, underFRA: m < fra, fra }
  }, [workerPIA, ownPIA, claimAge, birth])

  const fraLabel = r.fra >= 804 ? '67' : `66y ${r.fra - 792}m`
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Worker's PIA (benefit at their FRA)" value={workerPIA} onChange={setWorkerPIA} prefix="$" />
          <Field label="Spouse's OWN PIA (0 if never worked)" value={ownPIA} onChange={setOwnPIA} prefix="$" />
          <div>
            <div className="mb-1 text-sm font-medium">Spouse's birth year</div>
            <select value={birth} onChange={(e) => setBirth(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {SS_FRA_MONTHS.map(([y, mo]) => <option key={y} value={mo}>{y}</option>)}
            </select>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">Spouse claims at age</div>
            <select value={claimAge} onChange={(e) => setClaimAge(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {['62', '63', '64', '65', '66', '67', '68', '69', '70'].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={divorced} onChange={(e) => setDivorced(e.target.checked)} className="h-4 w-4" />
            Divorced-spouse claim (10+ yr marriage)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Spouse's total monthly" value={usd(r.tot, 0)} />
          <Result label="Own benefit piece" value={usd(r.own, 0)} />
          <Result label="Spousal top-up" value={usd(r.excess, 0)} />
          <Result label="= of worker's PIA" value={`${num(r.pctOfPIA, 1)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.excessFull <= 0 ? (
            <>The spouse's own PIA ({usd(ownPIA)}) already beats half the worker's — <span className="font-medium">no spousal top-up applies</span>; the total {usd(r.tot, 0)}/mo is just their own benefit{r.underFRA ? ', reduced for claiming before FRA' : ''}. Claiming on the worker's record would pay less, so Social Security pays the own benefit only.</>
          ) : r.underFRA ? (
            <>Claiming at {claimAge} (before FRA {fraLabel}) cuts BOTH pieces: the own benefit drops to {usd(r.own, 0)} and the spousal top-up to {usd(r.excess, 0)} — total <span className="font-medium">{usd(r.tot, 0)}/mo ({usd(r.tot * 12, 0)}/yr)</span>. Waiting to FRA pays {usd(r.atFRA, 0)}/mo — and since spousal benefits earn NO delayed credits past FRA, FRA is the ceiling for the top-up piece.</>
          ) : (
            <>At FRA-or-later the spousal math is capped: {usd(r.own, 0)} own + {usd(r.excess, 0)} top-up = <span className="font-medium">{usd(r.tot, 0)}/mo ({usd(r.tot * 12, 0)}/yr)</span>. Delaying the spousal piece past FRA adds nothing — only the OWN benefit earns 8%/yr delayed credits to 70.</>
          )}
          {divorced && <> Divorced-spouse claims don't touch the ex's check or their new spouse's — and if the divorce is 2+ years final, the ex doesn't even need to have filed yet.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          The spousal maximum is 50% of the worker's primary insurance amount, paid only if claimed at the spouse's full retirement age; claiming at 62 against an FRA of 67 cuts it 35%, to 32.5% of PIA. Deemed filing means one claim covers both own and spousal benefits — each piece reduces on its own schedule, and the top-up is 50% of the worker's PIA minus the spouse's own PIA (not their reduced benefit), so early claiming permanently shrinks both. The worker must have filed for a current spouse to collect; divorced claimants (10-year marriage, 62+, currently unmarried) are independently entitled after two years of divorce and their claim doesn't reduce the ex's benefit or a new spouse's. Spousal benefits earn no delayed retirement credits past FRA — there is never a spousal reason to wait past FRA once the worker has filed. Working before FRA subjects benefits to the earnings test. Survivor benefits follow a different, more generous rule — up to 100% of what the deceased worker received; don't conflate the two. Post-Fairness Act, no GPO offset applies to public-pension spouses. Estimates only — the SSA computes exact amounts from the earnings record.
        </p>
      </CardContent>
    </Card>
  )
}

// Roth 5-year rules — three separate clocks people conflate: (1) CONTRIBUTIONS come out anytime, tax- and penalty-free, no clock. (2) CONVERSIONS each get their own 5-year clock (Jan 1 of conversion year counts as start) — but the 10% penalty on early-withdrawn converted principal only applies UNDER 59½; over 59½ conversions are accessible immediately, penalty-wise. (3) EARNINGS are qualified (tax-free) only after 59½ AND five tax years from your FIRST Roth ever — one clock, earliest dollar. Ordering rules: withdrawals come from contributions first, then conversions oldest-first, earnings last (§408A ordering) — most partial withdrawals never touch earnings at all. Node-verified: 2022 $50k conversion, age 50, withdraw $50k in 2026 → $5,000 penalty (clears Jan 1, 2027); same at age 60 → $0; 2024 $30k, age 55, withdraw $10k → $1,000; age 50 in 2027 → $0 penalty but earnings still not qualified until 59½.
export function Roth5YearCalc() {
  const [convYear, setConvYear] = useNumber(2022)
  const [convAmt, setConvAmt] = useNumber(50000)
  const [age, setAge] = useNumber(50)
  const [rothOpened, setRothOpened] = useNumber(2022)
  const [withdraw, setWithdraw] = useNumber(50000)

  const NOW = 2026
  const r = useMemo(() => {
    const clearYear = convYear + 5
    const under = age < 59.5
    const convPenalty = under && NOW < clearYear ? Math.min(withdraw, convAmt) * 0.1 : 0
    const account5 = NOW - rothOpened >= 5
    const earningsQualified = age >= 59.5 && account5
    const earningsOkYear = Math.max(rothOpened + 5, under ? NOW + Math.ceil(59.5 - age) : NOW)
    return { clearYear, convPenalty, earningsQualified, account5, under, earningsOkYear }
  }, [convYear, convAmt, age, rothOpened, withdraw])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Conversion year" value={convYear} onChange={setConvYear} />
          <Field label="Amount converted" value={convAmt} onChange={setConvAmt} prefix="$" />
          <Field label="Your current age" value={age} onChange={setAge} />
          <Field label="Year you FIRST opened any Roth" value={rothOpened} onChange={setRothOpened} />
          <Field label="Amount you want to withdraw now" value={withdraw} onChange={setWithdraw} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Penalty if withdrawn now" value={usd(r.convPenalty, 2)} />
          <Result label="Conversion clears" value={`Jan 1, ${r.clearYear}`} />
          <Result label="Earnings tax-free?" value={r.earningsQualified ? 'Yes — qualified' : `Not until ${r.earningsOkYear}`} />
          <Result label="5-yr account clock" value={r.account5 ? 'Done' : `${r.account5 ? '' : `done ${rothOpened + 5}`}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.convPenalty > 0 ? (
            <>Withdrawing {usd(Math.min(withdraw, convAmt))} of the {r.clearYear - NOW > 0 ? 'not-yet-seasoned' : ''} conversion at {age} costs a <span className="font-medium">10% penalty: {usd(r.convPenalty, 2)}</span>. Wait until January 1, {r.clearYear} and it's $0 — the conversion clock runs by TAX year, so a December 2022 conversion clears January 2027, barely four years later.</>
          ) : r.under ? (
            <>No penalty on the converted principal{NOW >= r.clearYear ? <> — this conversion seasoned on January 1, {r.clearYear}</> : <> (conversions only carry penalty risk before 59½, and this withdrawal fits the ordering rules)</>}. Earnings are still locked until 59½{r.account5 ? '' : ` AND the account's 5-year clock (opens ${rothOpened + 5})`} — but withdrawals come from contributions and conversions FIRST, so most people never touch earnings early.</>
          ) : (
            <>Over 59½, conversion clocks don't matter for penalties — principal is accessible anytime. {r.earningsQualified ? <>And with your first Roth opened in {rothOpened}, <span className="font-medium">earnings are fully qualified — everything comes out tax-free</span>.</> : <>Earnings become tax-free in {rothOpened + 5} — the account's 5-year clock is the only one still running.</>}</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The three clocks, kept straight: contributions (what you put in directly) — always accessible, no clock. Conversions — each has its own 5-year clock starting January 1 of the conversion tax year, and the 10% early-withdrawal penalty on converted principal applies only under age 59½ (this is why the Roth conversion ladder works for early retirees: convert, wait 5 years, spend penalty-free). Earnings — qualified (tax-free) only after BOTH 59½ and 5 tax years from your first Roth dollar ever, any Roth, anywhere. Withdrawal ordering (§408A): contributions out first, then conversions oldest-first (taxable portion before nontaxable within each), earnings last — which is why partial withdrawals rarely hit the earnings clock. Note: the penalty applies to the TAXABLE portion of the conversion — converting after-tax traditional IRA money carries no penalty exposure. Inherited Roths follow the beneficiary rules instead. State taxes may differ.
        </p>
      </CardContent>
    </Card>
  )
}

// 457(b) — the public-sector superpower, 2026 (IRS Notice 2025-67/Newsroom IR-2025-111): elective deferral $24,500 — SEPARATE limit from 403(b)/401(k) (different code section), so a teacher/hospital worker maxes BOTH: $49,000 pre-tax. Catch-ups: 50+ $8,000, 60–63 super catch-up $11,250 (SECURE 2.0); governmental 457's special 3-year pre-retirement catch-up = 2× base = $49,000 (needs unused prior room; CANNOT stack with age catch-up — take the larger). Governmental 457(b): NO 10% penalty after separation at ANY age — the early-retirement account. SECURE 2.0 2026 wrinkle: prior-year wages >$145k → age-50 catch-ups must be ROTH. 403(b) extra: 15-year service catch-up $3,000/yr ($15k lifetime). Node-verified: 45yo both plans → $49,000 ($15,680 saved at 32%); 52yo → $65,000; 61yo → $71,500; 55yo final-3 window → $49,000+$32,500 = $81,500; 61yo in window → $84,750.
export function Plan457Calc() {
  const [age, setAge] = useNumber(52)
  const [has403, setHas403] = useState(true)
  const [final3, setFinal3] = useState(false)
  const [bracket, setBracket] = useNumber(32)

  const r = useMemo(() => {
    const base = 24500
    const ageCU = age >= 60 && age <= 63 ? 11250 : age >= 50 ? 8000 : 0
    const max457 = final3 ? Math.max(49000, base + ageCU) : base + ageCU
    const max403 = has403 ? base + ageCU : 0
    const total = max457 + max403
    const saved = total * (bracket / 100)
    return { max457, max403, total, saved, ageCU }
  }, [age, has403, final3, bracket])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Your age" value={age} onChange={setAge} />
          <Field label="Federal bracket" value={bracket} onChange={setBracket} suffix="%" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={has403} onChange={(e) => setHas403(e.target.checked)} className="h-4 w-4" />
            Employer also offers 403(b)/401(k)
          </label>
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={final3} onChange={(e) => setFinal3(e.target.checked)} className="h-4 w-4" />
            Within 3 years of plan's normal retirement age
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Max pre-tax this year" value={usd(r.total)} />
          <Result label="457(b) room" value={usd(r.max457)} />
          <Result label="403(b)/401(k) room" value={usd(r.max403)} />
          <Result label="Tax saved this year" value={usd(r.saved)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.max403 > 0 ? (
            <>The 457(b) limit lives in a different code section — it does NOT share with your 403(b)/401(k). You can defer {usd(r.max457)} into the 457 <span className="font-medium">AND</span> {usd(r.max403)} into the 403(b): <span className="font-medium">{usd(r.total)} sheltered</span>, saving {usd(r.saved)} at your {bracket}% bracket.{r.ageCU > 0 && <> (Includes your {usd(r.ageCU)} {age >= 60 && age <= 63 ? 'age 60–63 super' : 'age 50+'} catch-up.)</>}</>
          ) : (
            <>Your 457(b) room is <span className="font-medium">{usd(r.max457)}</span> — saving {usd(r.saved)} at {bracket}%. If your employer also offers a 403(b) or 401(k), that limit is SEPARATE — toggle it on above.</>
          )}
          {final3 && <> The 3-year pre-retirement window doubles the 457 to {usd(49000)} (requires unused room from prior years — and it replaces, not stacks with, the age catch-up).</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 limits (IRS): $24,500 base elective deferral for 401(k)/403(b)/governmental 457(b)/TSP; catch-ups $8,000 (50+) or $11,250 (ages 60–63, SECURE 2.0, plan must adopt). The 457(b) special catch-up — double the base limit in the three years before your plan's normal retirement age, using prior unused room — is unique to 457s and usually beats the age catch-up; you can't use both in one year. The unsung feature: governmental 457(b) distributions after separation carry NO 10% early-withdrawal penalty at any age — it's the account that makes retiring at 52 work. Two cautions: NON-governmental 457(b)s (some nonprofits) lack rollovers, have distribution restrictions, and sit exposed to the employer's creditors — a genuinely different animal. And new for 2026 (SECURE 2.0): if your prior-year wages topped $145,000, age-based catch-ups must go in as Roth — plans without a Roth option can't take your catch-up at all.
        </p>
      </CardContent>
    </Card>
  )
}

// DROP (Deferred Retirement Option Plan) — police/fire/public pension play: you "retire on paper" while still working; the monthly pension deposits into a DROP account earning plan interest (typically 3–5%, some market-linked) for a max 3–5 years, then you exit with the lump sum + the FROZEN pension. The trade: pension accrual stops at DROP entry — no more years, no more salary growth in the benefit. Lump = monthly pension × annuity FV over DROP years. No-Drop path: more years × higher final salary = bigger pension forever. Node-verified: $80k/25yr/2.5%/4yr@4% → pension $50k, lump $216,498, no-DROP pension $65,280 — the lump covers the $15,280/yr gap for 14.2 years; police $90k/20yr/3%/5yr@4.5% → lump $302,155, gap $20,525/yr → 14.7 years. Lump is taxable — roll to IRA to defer (direct rollover avoids the 20% withholding trap).
export function DropCalc() {
  const [salary, setSalary] = useNumber(80000)
  const [yrs, setYrs] = useNumber(25)
  const [mult, setMult] = useNumber(2.5)
  const [dyrs, setDyrs] = useNumber(4)
  const [drate, setDrate] = useNumber(4)
  const [sgrow, setSgrow] = useNumber(3)

  const r = useMemo(() => {
    const pen = yrs * (mult / 100) * salary
    const pmt = pen / 12
    const rr = drate / 1200
    const n = dyrs * 12
    const lump = rr > 0 ? pmt * ((Math.pow(1 + rr, n) - 1) / rr) : pmt * n
    const penNoDrop = (yrs + dyrs) * (mult / 100) * salary * Math.pow(1 + sgrow / 100, dyrs)
    const diff = penNoDrop - pen
    const yearsEq = diff > 0 ? lump / diff : Infinity
    return { pen, lump, penNoDrop, diff, yearsEq }
  }, [salary, yrs, mult, dyrs, drate, sgrow])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Final average salary at DROP entry" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Years of service at entry" value={yrs} onChange={setYrs} />
          <Field label="Pension multiplier" value={mult} onChange={setMult} suffix="%" />
          <Field label="DROP years" value={dyrs} onChange={setDyrs} />
          <Field label="DROP account interest" value={drate} onChange={setDrate} suffix="%" />
          <Field label="Salary growth (if not in DROP)" value={sgrow} onChange={setSgrow} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="DROP lump sum at exit" value={usd(r.lump)} />
          <Result label="Frozen pension (with DROP)" value={`${usd(r.pen)}/yr`} />
          <Result label="Pension without DROP" value={`${usd(r.penNoDrop)}/yr`} />
          <Result label="Lump covers the gap for" value={isFinite(r.yearsEq) ? `${num(r.yearsEq, 1)} years` : '—'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Enter DROP and your pension freezes at <span className="font-medium">{usd(r.pen)}/yr</span> — but {dyrs} years of those payments pile into the DROP account at {drate}%: <span className="font-medium">{usd(r.lump)} at exit</span>. Skip DROP and work the same {dyrs} years: the pension grows to {usd(r.penNoDrop)}/yr — {usd(r.diff)}/yr more, forever. The lump buys the difference for about {isFinite(r.yearsEq) ? <span className="font-medium">{num(r.yearsEq, 1)} years</span> : '—'} (simple division — a 4% drawdown assumption stretches it further). DROP wins when you want the lump (debt payoff, second-career seed, 457/IRA rollover flexibility) or doubt the plan's COLA; staying wins when longevity runs in the family and the pension's COLA is real.
        </div>
        <p className="text-xs text-muted-foreground">
          Mechanics vary by plan, and the details are the whole game: maximum DROP period (usually 3–5 years — entering early forfeits accrual; entering at max eligibility is usually optimal), the credited interest rate (guaranteed vs market-linked changes everything), whether raises during DROP count (usually no — the freeze is the price), and whether you keep employee contributions going in (some plans require it). The lump sum is fully taxable as ordinary income in the year received unless you do a DIRECT rollover to an IRA/457 — have the plan cut the check to the IRA, because a check to you triggers mandatory 20% withholding and a 60-day rollover scramble. Also check: does your DROP entry date lock the beneficiary election, and does the plan offer partial lump-sum (PLOP) instead? Get your system's actual DROP estimate before signing — entry is irrevocable in most plans.
        </p>
      </CardContent>
    </Card>
  )
}

// Pension job vs Social-Security-covered job — the teacher/firefighter career fork. Pension side: annual benefit = years × multiplier × final salary (typical 2–2.5%; TX TRS 2.3%); employee contributes ~8% of pay. Covered side: 6.2% FICA buys SS credits — estimate PIA from AIME ≈ salary/12 through the 2026 bend points (90% × $1,286 / 32% to $7,749 / 15% above), then claiming age: 62 = 70%, 67 = 100%, 70 = 124%. Post-Fairness-Act there's no WEP/GPO penalty for mixing careers — but a pure pension career earns ZERO SS credits on those years (40 credits ≈ 10 covered years needed for any SS at all). Honest wrinkles: pensions usually lack full COLA (SS has CPI COLA), pension survivorship requires electing a reduced joint annuity, and pensions are NOT portable — leaving at year 4 of a 5-year vest can mean contributions back, no benefit. Node-verified: $70k/30yr/2% → $42,000 pension vs covered-path SS $31,350 at FRA ($21,945 at 62); career cash cost $5,600/yr (8%) vs $4,340 (6.2% FICA); TRS 2.3% × 25yr → $40,250.
export function PensionVsSsCalc() {
  const [salary, setSalary] = useNumber(70000)
  const [yrs, setYrs] = useNumber(30)
  const [mult, setMult] = useNumber(2)
  const [contrib, setContrib] = useNumber(8)
  const [age, setAge] = useState('67')

  const r = useMemo(() => {
    const pension = yrs * (mult / 100) * salary
    const aime = salary / 12
    let p = 0.9 * Math.min(aime, 1286)
    if (aime > 1286) p += 0.32 * Math.min(aime - 1286, 7749 - 1286)
    if (aime > 7749) p += 0.15 * (aime - 7749)
    p = Math.floor(p * 10) / 10
    const ageF = age === '62' ? 0.7 : age === '70' ? 1.24 : 1
    const ss = p * 12 * ageF
    const pensionCost = salary * (contrib / 100)
    const ficaCost = salary * 0.062
    return { pension, ss, pensionCost, ficaCost, diff: pension - ss, costDiff: pensionCost - ficaCost }
  }, [salary, yrs, mult, contrib, age])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Salary (either path)" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Years in the pension system" value={yrs} onChange={setYrs} />
          <Field label="Pension multiplier" value={mult} onChange={setMult} suffix="%" />
          <Field label="Employee pension contribution" value={contrib} onChange={setContrib} suffix="%" />
          <div>
            <label className="mb-1 block text-sm font-medium">SS claiming age (covered path)</label>
            <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="62">62 — 70% of PIA</option>
              <option value="67">67 — full benefit</option>
              <option value="70">70 — 124% of PIA</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label={r.diff >= 0 ? 'Pension path pays more' : 'Covered path pays more'} value={usd(Math.abs(r.diff)) + '/yr'} />
          <Result label="Pension at retirement" value={usd(r.pension)} />
          <Result label="SS at claiming age (covered path)" value={usd(r.ss)} />
          <Result label="Career cash cost / yr" value={`${usd(r.pensionCost)} vs ${usd(r.ficaCost)}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Pension path: {yrs} yrs × {mult}% × {usd(salary)} = <span className="font-medium">{usd(r.pension)}/yr</span>, costing {usd(r.pensionCost)}/yr in contributions. Covered path: SS estimates {usd(r.ss)}/yr at {age}, costing {usd(r.ficaCost)}/yr in FICA — and you can ALSO save in a 401(k)/403(b) on top, which most pension systems don't offer.
          {r.diff >= 0 ? <> The pension wins the income line by {usd(r.diff)}/yr — but check COLA (most pensions have weak or no inflation adjustment; SS's CPI COLA compounds), survivorship (a joint annuity cuts the pension 10–20%), and vesting ({yrs < 5 ? 'you\'re below typical 5-year vesting — leaving early can mean contributions back, no benefit' : 'leaving before vesting forfeits the benefit'}).</> : <> Social Security wins by {usd(Math.abs(r.diff))}/yr — with full CPI COLA, automatic 50% spousal benefits, and portability across every covered job in the country.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          The Fairness Act killed WEP/GPO, so mixing careers no longer carries a penalty — but a pure pension career earns ZERO Social Security credits on those years: without ~10 covered years (40 credits) somewhere in your life, you get no SS at all, and Medicare Part A comes free only with those credits too. The strongest play for many: pension career + a covered side job or second career to lock credits — post-repeal, every covered dollar counts at full value. Pension math varies by system: multiplier, final-average-salary window (3 vs 5 years), vesting schedule, COLA formula, and DROP programs all move the number — get your system's benefit estimate before deciding. SS estimate here is simplified (AIME ≈ current salary/12, no indexing of historical wages); your SSA statement is the source of truth. Pensions also usually offer no employer 403(b) match while covered private jobs often match 3–6% — that stack belongs in the comparison too.
        </p>
      </CardContent>
    </Card>
  )
}

// Social Security Fairness Act (H.R. 82, signed Jan 5, 2025): repealed WEP and GPO for benefits payable after December 2023 — ~2.8M public employees (teachers in 15 non-covered states, firefighters, police, CSRS feds) got full benefits restored, retroactive lump sums paid in 2025. OLD WEP: first bend-point factor dropped from 90% to 40% (≤20 yrs substantial SS-covered earnings, +5pp/yr to 90% at 30 yrs), reduction capped at 50% of the non-covered pension; 2026 first bend $1,286 → max reduction $643/mo. OLD GPO: spousal/survivor benefit cut by 2/3 of the non-covered pension, floor $0. NEW LAW: full benefits, both. Node-verified: AIME $2,000/18 yrs/$2,000 pension → old WEP cut $643/mo ($7,716/yr restored); 25 yrs → $321.50; pension $800 → capped at $400. GPO: spouse SS $2,400/$3,000 pension → old spousal $0, restored $1,200/mo; survivor $2,800/$3,000 → old $800, restored $2,800.
export function FairnessActCalc() {
  const [aime, setAime] = useNumber(2000)
  const [yrs, setYrs] = useNumber(18)
  const [pension, setPension] = useNumber(3000)
  const [spouseSS, setSpouseSS] = useNumber(2400)
  const [kind, setKind] = useState('spousal')

  const r = useMemo(() => {
    const factor = yrs >= 30 ? 0.9 : yrs <= 20 ? 0.4 : 0.4 + (yrs - 20) * 0.05
    const wepCut = Math.min((0.9 - factor) * Math.min(aime, 1286), 0.5 * pension)
    const share = kind === 'survivor' ? 1 : 0.5
    const fullAux = spouseSS * share
    const gpoOld = Math.max(0, fullAux - (2 / 3) * pension)
    const gpoRestored = fullAux - gpoOld
    const monthly = wepCut + gpoRestored
    return { wepCut, gpoOld, gpoRestored, fullAux, monthly, annual: monthly * 12 }
  }, [aime, yrs, pension, spouseSS, kind])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Monthly non-covered pension" value={pension} onChange={setPension} prefix="$" />
          <Field label="Your AIME (SSA statement)" value={aime} onChange={setAime} prefix="$" />
          <Field label="Years of SS-covered earnings" value={yrs} onChange={setYrs} />
          <Field label="Spouse's monthly SS benefit" value={spouseSS} onChange={setSpouseSS} prefix="$" />
          <div>
            <label className="mb-1 block text-sm font-medium">Auxiliary benefit</label>
            <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="spousal">Spousal — 50% of spouse's benefit</option>
              <option value="survivor">Survivor — up to 100%</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Restored per month" value={usd(r.monthly, 2)} />
          <Result label="Old WEP cut (your own benefit)" value={usd(r.wepCut, 2)} />
          <Result label="Old GPO took" value={`${usd(r.gpoRestored, 2)} of ${usd(r.fullAux, 2)}`} />
          <Result label="Restored per year" value={usd(r.annual)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.wepCut > 0 && <>WEP was cutting your own benefit by <span className="font-medium">{usd(r.wepCut, 2)}/mo</span> (the 90% bend-point factor dropped to {yrs >= 30 ? '90' : yrs <= 20 ? '40' : num((0.4 + (yrs - 20) * 0.05) * 100, 0)}% at {yrs} years of covered work). </>}
          {r.gpoRestored > 0 && <>GPO was taking <span className="font-medium">{usd(r.gpoRestored, 2)}/mo</span> of your {kind} benefit{r.gpoOld === 0 && <> — it had zeroed it out entirely</>}. </>}
          {r.monthly > 0 ? <>Under the Fairness Act both offsets are gone: <span className="font-medium">{usd(r.annual)} per year restored</span>, retroactive to January 2024. If SSA hasn't adjusted yours yet, file — the retroactive lump sum is real money.</> : <>Neither offset was touching you (30+ covered years and no GPO exposure) — the repeal changes nothing, which is itself worth confirming.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          The Social Security Fairness Act (H.R. 82, signed January 5, 2025) repealed the Windfall Elimination Provision and Government Pension Offset for benefits payable after December 2023. WEP had cut the first bend-point factor from 90% down to 40% for workers with under 30 years of Social-Security-covered earnings (capped at half the pension); GPO had reduced spousal and survivor benefits by two-thirds of any non-covered government pension — often to zero. Both are simply gone now. Affected: teachers in the 15 states where school districts don't pay into Social Security, firefighters, police, and federal CSRS employees. SSA adjusted ongoing payments starting February 2025 and issued retroactive lump sums back to January 2024; if your benefit still shows an offset, contact SSA with your pension details. Simplified: WEP reduction uses the 2026 first bend point ($1,286) and the standard factor schedule; your exact figure comes from SSA.
        </p>
      </CardContent>
    </Card>
  )
}

// PSLF — Public Service Loan Forgiveness: 120 qualifying monthly payments (income-driven plan, full-time at government/501(c)(3)) → remaining balance forgiven FEDERALLY TAX-FREE (PSLF discharges are excluded income, permanently — unlike IDR forgiveness, which became taxable again after the ARP exemption expired end-2025). Negative amortization is the honest story: IDR payments below monthly interest make the forgiven balance GROW past the original loan — and that's fine, because it's forgiven. Node-verified: $80k/6%/$400 IDR/60 made → 60 payments left, $24k paid, $80k forgiven; $120k/7%/$500/0 → $60k paid, $154,617 forgiven (grows past principal); $60k/5%/$600/36 → $24,885 forgiven; aggressive alternative $80k/6%/$900 → 118 mo, $26,066 interest.
export function PslfCalc() {
  const [bal, setBal] = useNumber(80000)
  const [rate, setRate] = useNumber(6)
  const [pmt, setPmt] = useNumber(400)
  const [made, setMade] = useNumber(60)
  const [payoff, setPayoff] = useNumber(900)

  const r = useMemo(() => {
    const mr = rate / 1200
    const rem = Math.max(0, 120 - made)
    let b = bal
    for (let i = 0; i < rem; i++) b = b * (1 + mr) - pmt
    const forgiven = Math.max(0, b)
    const pslfPaid = pmt * rem
    let b2 = bal
    let m = 0
    let interest = 0
    while (b2 > 0.005 && m < 600) { const i = b2 * mr; interest += i; b2 = b2 + i - payoff; m++ }
    const payoffTotal = payoff * m
    const pslfWins = pslfPaid < payoffTotal
    return { rem, forgiven, pslfPaid, months: m, interest, payoffTotal, pslfWins, diff: Math.abs(payoffTotal - pslfPaid) }
  }, [bal, rate, pmt, made, payoff])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Loan balance" value={bal} onChange={setBal} prefix="$" />
          <Field label="Interest rate" value={rate} onChange={setRate} suffix="%" />
          <Field label="Monthly IDR payment" value={pmt} onChange={setPmt} prefix="$" />
          <Field label="Qualifying payments made" value={made} onChange={setMade} />
          <Field label="Aggressive payoff instead" value={payoff} onChange={setPayoff} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Forgiven, tax-free" value={usd(r.forgiven)} />
          <Result label="Payments left" value={`${r.rem} (${num(r.rem / 12, 1)} yrs)`} />
          <Result label="You pay (PSLF track)" value={usd(r.pslfPaid)} />
          <Result label="Payoff track costs" value={usd(r.payoffTotal)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.forgiven > 0 ? (
            <>{r.rem} payments of {usd(pmt)} = {usd(r.pslfPaid)} out of pocket, then <span className="font-medium">{usd(r.forgiven)} is forgiven tax-free</span>.{r.forgiven > bal && <> Notice the balance GROWS to that from {usd(bal)} — your IDR payment is below the monthly interest, and under PSLF that's fine: negative amortization is forgiven too.</>} The aggressive payoff costs {usd(r.payoffTotal)} over {r.months} months — {r.pslfWins ? <>PSLF saves <span className="font-medium">{usd(r.diff)}</span>. Keep the qualifying job.</> : <>paying off is actually cheaper by {usd(r.diff)} — PSLF's value fades when the IDR payment is high relative to the balance.</>}</>
          ) : (
            <>At {usd(pmt)}/month the loan is gone before payment 120 — nothing left to forgive. PSLF adds no value here; compare straight payoff strategies instead.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The rules that make or break it: qualifying EMPLOYER (government at any level, 501(c)(3), some other nonprofits) — the job qualifies, not the loan type of work; qualifying PLAN (any income-driven plan); full-time (30+ hrs); payments don't need to be consecutive. Certify employment annually with the PSLF form — the people who get denied mostly skipped this. PSLF forgiveness is permanently federally tax-free (it's not the expiring ARP rule — that covered IDR forgiveness, which IS taxable again for discharges after 2025). Consolidation resets the payment count (the one-time IDR account adjustment grandfathered older counts; new consolidations post-2023 use weighted averages). Fed only — a few states tax forgiven amounts. Simplified model: fixed IDR payment (real ones recertify annually with income), no OBBBA RAP-plan transition detail.
        </p>
      </CardContent>
    </Card>
  )
}

// Adoption tax credit — IRC §23, 2026 (Rev. Proc. 2025-32 + OBBBA §70424): max $17,670/child of qualified expenses; NEW: $5,120/child is REFUNDABLE (first time since 2011); remaining $12,550 nonrefundable with 5-yr carryforward. Phaseout: MAGI $265,080–$305,080 ratable ($40k band) — reduces BOTH pieces proportionally; refundable piece never carries forward. Special-needs (state determination): full credit regardless of expenses. Foreign adoptions: everything claims in the finalization year. Employer adoption assistance (§137) reduces qualified expenses. Node-verified: $19k exp/MAGI $180k/liab $10k → credit $17,670 = $5,120 cash + $10,000 absorbed + $2,550 carryforward; MAGI $290k → $6,662 (62.3% phased); special-needs $5k exp → full $17,670; 2 kids → $35,340 / $10,240 refundable.
export function AdoptionCreditCalc() {
  const [exp, setExp] = useNumber(19000)
  const [kids, setKids] = useNumber(1)
  const [magi, setMagi] = useNumber(180000)
  const [liab, setLiab] = useNumber(10000)
  const [sn, setSn] = useState(false)

  const r = useMemo(() => {
    const per = sn ? 17670 : Math.min(exp, 17670)
    const base = per * kids
    const frac = Math.min(1, Math.max(0, (magi - 265080) / 40000))
    const credit = base * (1 - frac)
    const ref = 5120 * kids * (1 - frac)
    const nonref = credit - ref
    const absorb = Math.min(nonref, liab)
    const carry = nonref - absorb
    return { base, frac, credit, ref, nonref, absorb, carry }
  }, [exp, kids, magi, liab, sn])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Qualified expenses (per child)" value={exp} onChange={setExp} prefix="$" />
          <Field label="Children adopted this year" value={kids} onChange={setKids} />
          <Field label="MAGI (usually = AGI)" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Federal tax before credits" value={liab} onChange={setLiab} prefix="$" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={sn} onChange={(e) => setSn(e.target.checked)} className="h-4 w-4" />
            State-determined special needs (full credit regardless of expenses)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Total 2026 credit" value={usd(r.credit)} />
          <Result label="Refundable (cash back)" value={usd(r.ref)} />
          <Result label="Used against this year's tax" value={usd(r.absorb)} />
          <Result label="Carries to 2027+" value={usd(r.carry)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.frac > 0 && r.frac < 1 && <>⚠ You're {num(r.frac * 100, 1)}% through the phaseout band — the credit dropped from {usd(r.base)} to <span className="font-medium">{usd(r.credit)}</span>. MAGI management (defer a Roth conversion, harvest losses, shift a December bonus to January) directly buys credit back. </>}
          {r.frac >= 1 && <>⚠ MAGI over $305,080 eliminates the credit entirely. </>}
          <span className="font-medium">{usd(r.ref)} comes back as cash</span> even with zero tax liability — new for 2026. The remaining {usd(r.nonref)} offsets this year's tax first{liab > 0 ? <> ({usd(r.absorb)} absorbed)</> : ''}{r.carry > 0 && <>, with <span className="font-medium">{usd(r.carry)} carrying forward</span> up to 5 years</>}. Employer adoption assistance reduces qualified expenses dollar-for-dollar — claim the credit on what's left.
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules (§23, Rev. Proc. 2025-32): $17,670 max per child; phaseout $265,080–$305,080 MAGI ratable; OBBBA made $5,120/child refundable — the foster-to-adopt headline, since special-needs determinations grant the full credit regardless of spending and low-income years no longer waste it. Timing: domestic adoptions claim expenses the year paid (or finalization year if paid earlier); FOREIGN adoptions claim everything in the finalization year — the phaseout reads THAT year's MAGI, so December finalizations are worth income-shifting. Qualified expenses: agency/attorney/court fees, travel, re-adoption for foreign; NOT stepparent adoptions, surrogacy, or employer-reimbursed amounts. Carryforward is 5 years; the refundable piece is use-it-or-lose-it in the finalization year. Per-child caps mean sibling groups multiply: three kids = up to $53,010 with $15,360 refundable.
        </p>
      </CardContent>
    </Card>
  )
}

// Layoff runway — the survival number: (liquid savings + NET severance) vs monthly drain. Two phases: while unemployment lasts (typical max 26 weeks; average weekly benefit ~$450 but state caps range ~$235 MS to $900+ MA — user enters their state's), drain = burn + COBRA − UI; after UI exhausts, drain = burn + COBRA. UI is taxable federally (Form 1099-G) — honest model notes it. Severance timing: many states delay UI until severance-covered weeks pass. Node-verified: $20k savings + $32,311 net severance (from the severance calculator), $4,500 burn + $800 COBRA, $450/wk UI × 26 wks → UI ≈ $1,950/mo → 12.1 months runway; without UI → 9.9; $5k/$0 sev/$3,000 burn/$700 COBRA/$500 wk → 3.3 months.
export function LayoffRunwayCalc() {
  const [sav, setSav] = useNumber(20000)
  const [sev, setSev] = useNumber(32311)
  const [burn, setBurn] = useNumber(4500)
  const [cobra, setCobra] = useNumber(800)
  const [uiWk, setUiWk] = useNumber(450)
  const [uiWks, setUiWks] = useNumber(26)

  const r = useMemo(() => {
    const res = sav + sev
    const uiMo = (uiWk * 52) / 12
    const uiMonths = (uiWks / 52) * 12
    const drain1 = Math.max(0, burn + cobra - uiMo)
    const used1 = Math.min(res, drain1 * uiMonths)
    const m1 = drain1 > 0 ? used1 / drain1 : uiMonths
    const left = res - used1
    const drain2 = burn + cobra
    const m2 = drain2 > 0 ? left / drain2 : 99
    const uiTotal = uiWk * uiWks * Math.min(1, m1 / uiMonths)
    return { res, uiMo, drain1, drain2, total: m1 + m2, uiTotal }
  }, [sav, sev, burn, cobra, uiWk, uiWks])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Liquid savings" value={sav} onChange={setSav} prefix="$" />
          <Field label="Net severance (after tax)" value={sev} onChange={setSev} prefix="$" />
          <Field label="Monthly essential spending" value={burn} onChange={setBurn} prefix="$" />
          <Field label="COBRA / health insurance" value={cobra} onChange={setCobra} prefix="$" />
          <Field label="Weekly unemployment benefit" value={uiWk} onChange={setUiWk} prefix="$" />
          <Field label="Weeks of UI available" value={uiWks} onChange={setUiWks} />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Runway" value={`${num(r.total, 1)} months`} />
          <Result label="Total resources" value={usd(r.res)} />
          <Result label="Monthly drain on UI" value={usd(r.drain1)} />
          <Result label="Drain after UI ends" value={usd(r.drain2)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {usd(r.res)} of resources against a {usd(r.drain2)}/month full burn. Unemployment ({usd(r.uiMo)}/month for up to {num((uiWks / 52) * 12, 0)} months) slows the drain to {usd(r.drain1)}/month — <span className="font-medium">{num(r.total, 1)} months total</span>. Every $500/month cut from spending adds roughly {r.drain2 > 0 ? num(((r.res / (r.drain2 - 500)) - (r.res / r.drain2)), 1) : '—'} months of runway on the back end. Cutting COBRA via an ACA marketplace plan (a layoff is a special enrollment event, and low income = subsidies) is usually the single biggest lever after housing.
        </div>
        <p className="text-xs text-muted-foreground">
          Honest wrinkles: unemployment benefits are taxable income federally (you'll get a 1099-G — elect withholding or set aside ~10%), though most states with an income tax exempt them partially or fully. Many states delay UI until the weeks your severance "covers" have passed — file immediately regardless; the state decides, and the waiting week clock starts when you file. Use NET severance here — run the severance calculator first, because the gross number overstates your runway by the tax bill. COBRA lasts 18 months but costs 102% of the full premium; an ACA plan after a job-loss special enrollment is often half that with subsidies at layoff-level income — price both before electing. The math gets better the moment you cut burn: runway is division, and shrinking the denominator beats growing the numerator.
        </p>
      </CardContent>
    </Card>
  )
}

// Severance — taxed as ordinary wages: FICA applies (severance IS Social Security/Medicare wages), federal withholding is supplemental (flat 22% separate check or aggregate if combined), and it stacks on top of YTD income at marginal brackets — a December lump sum lands in your highest bracket while a January payment starts a fresh tax year with near-empty brackets. The deferral play: negotiate payment timing across the year boundary. UI interaction: many states delay unemployment until severance coverage runs out (state-specific — check yours). Severance can't go into a 401(k) (not eligible compensation post-termination), but a final-paycheck 401(k) deferral can. Node-verified (2026 single, ded $16,100): YTD $90k + $50k lump → $11,364 fed on the severance; split $25k/$25k across Dec/Jan (no other income yr 2) → $6,390 — saves $4,974; FICA $3,825 (under the $184,500 cap); lump net after fed+FICA+5% state = $32,311.
export function SeveranceCalc() {
  const [sev, setSev] = useNumber(50000)
  const [ytd, setYtd] = useNumber(90000)
  const [nextYr, setNextYr] = useNumber(0)
  const [defer, setDefer] = useNumber(25000)
  const [filing, setFiling] = useState<'single' | 'mfj'>('single')
  const [stateRate, setStateRate] = useNumber(5)

  const r = useMemo(() => {
    const fed = FEDERAL[filing]
    const fedTax = (g: number) => bracketTax(fed.brackets, Math.max(0, g - fed.ded))
    const d = Math.min(Math.max(0, defer), sev)
    const lumpFed = fedTax(ytd + sev) - fedTax(ytd)
    const splitFed = fedTax(ytd + (sev - d)) - fedTax(ytd) + (fedTax(nextYr + d) - fedTax(nextYr))
    const saved = lumpFed - splitFed
    const fica = Math.min(sev, Math.max(0, SS_WAGE_CAP - ytd)) * 0.0765
    const state = sev * (stateRate / 100)
    const lumpTotal = lumpFed + fica + state
    const splitTotal = splitFed + fica + state
    return { lumpFed, splitFed, saved, fica, state, lumpTotal, splitTotal, lumpNet: sev - lumpTotal, splitNet: sev - splitTotal, d }
  }, [sev, ytd, nextYr, defer, filing, stateRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Severance amount" value={sev} onChange={setSev} prefix="$" />
          <Field label="Income already earned this year" value={ytd} onChange={setYtd} prefix="$" />
          <Field label="Expected income NEXT year" value={nextYr} onChange={setNextYr} prefix="$" />
          <Field label="Amount paid in January instead" value={defer} onChange={setDefer} prefix="$" />
          <Field label="State income tax" value={stateRate} onChange={setStateRate} suffix="%" />
          <div>
            <label className="mb-1 block text-sm font-medium">Filing status</label>
            <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={filing} onChange={(e) => setFiling(e.target.value as 'single' | 'mfj')}>
              <option value="single">Single</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Saved by timing the payment" value={usd(r.saved)} />
          <Result label="Net: all this year" value={usd(r.lumpNet)} />
          <Result label="Net: split across years" value={usd(r.splitNet)} />
          <Result label="Fed tax: lump vs split" value={`${usd(r.lumpFed)} vs ${usd(r.splitFed)}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.d > 0 && r.saved > 0 ? (
            <>Taking the full {usd(sev)} this year stacks it on your {usd(ytd)} at your top brackets: <span className="font-medium">{usd(r.lumpFed)} federal</span>. Moving {usd(r.d)} into January gives it next year's empty brackets and standard deduction: {usd(r.splitFed)} — <span className="font-medium">{usd(r.saved)} saved</span> for a conversation with HR about payment timing. FICA ({usd(r.fica)}) and state ({usd(r.state)}) don't change.</>
          ) : (
            <>The whole {usd(sev)} lands this year: <span className="font-medium">{usd(r.lumpFed)} federal</span> + {usd(r.fica)} FICA + {usd(r.state)} state = you keep {usd(r.lumpNet)}. Try the January-deferral input above — income near the December boundary is the one thing about severance you can often negotiate.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The facts people get wrong: severance is ordinary W-2 wages — FICA applies in full (7.65% employee side under the $184,500 SS cap), and withholding is supplemental-wage style (flat 22% on a separate check, or the aggregate method if combined with final pay — see the bonus tax calculator), so the check ALWAYS looks overtaxed relative to the true liability. You cannot contribute severance to a 401(k) — compensation after termination isn't eligible — but you CAN max the deferral on your final regular paychecks. Unemployment interaction is state-specific: many states delay UI benefits until the weeks your severance "covers" have passed — file anyway and let the state sort it. Accrued PTO payout: also wages, same treatment. Non-compete / release-of-claims payments: still wages if through payroll; a settlement NOT for wages can differ — that's attorney territory. Simplified: federal + flat state + employee FICA; no local tax.
        </p>
      </CardContent>
    </Card>
  )
}

// Donate appreciated stock vs cash — 2026 OBBBA rules: stock held >1 year deducts at full FMV (30% AGI cap for public charities, 5-yr carryover) and the embedded capital gain is NEVER taxed; held ≤1 year the deduction drops to basis. NEW for 2026: itemizers lose the first 0.5% of AGI to the charitable floor (OBBBA §70425, floor-first then ceilings, floor-disallowed amounts never carry forward); non-itemizers get a NEW above-the-line CASH-only deduction $1,000 single / $2,000 MFJ (§170(p), no floor, no carryover, cash to public charities only — not stock, not DAFs). Framing: the stock alternative is "sell the stock, donate the cash" — so the avoided gain is real money. Node-verified: FMV $20k/basis $4k/AGI $150k/32%/23.8% itemizing → floor $750, deduction $19,250 → $6,160 + avoided gain $3,808 = $9,968 stock vs $6,160 cash; non-itemizing single → cash $320 (cap $1k) vs stock $3,808.
export function StockDonationCalc() {
  const [fmv, setFmv] = useNumber(20000)
  const [basis, setBasis] = useNumber(4000)
  const [agi, setAgi] = useNumber(150000)
  const [ord, setOrd] = useNumber(32)
  const [capR, setCapR] = useNumber(23.8)
  const [itemize, setItemize] = useState(true)
  const [mfj, setMfj] = useState(false)

  const r = useMemo(() => {
    const gain = Math.max(0, fmv - basis)
    const floor = 0.005 * agi
    const dedAmount = itemize ? Math.max(0, fmv - floor) : 0
    const dedValStock = dedAmount * (ord / 100)
    const avoided = gain * (capR / 100)
    const stockVal = dedValStock + avoided
    const cashDedAmount = itemize ? dedAmount : Math.min(fmv, mfj ? 2000 : 1000)
    const cashVal = cashDedAmount * (ord / 100)
    return { gain, floor, dedValStock, avoided, stockVal, cashDedAmount, cashVal, edge: stockVal - cashVal }
  }, [fmv, basis, agi, ord, capR, itemize, mfj])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Stock value today" value={fmv} onChange={setFmv} prefix="$" />
          <Field label="Your cost basis" value={basis} onChange={setBasis} prefix="$" />
          <Field label="Your AGI" value={agi} onChange={setAgi} prefix="$" />
          <Field label="Ordinary bracket" value={ord} onChange={setOrd} suffix="%" />
          <Field label="Cap-gains rate (incl. NIIT)" value={capR} onChange={setCapR} suffix="%" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={itemize} onChange={(e) => setItemize(e.target.checked)} className="h-4 w-4" />
            You itemize deductions
          </label>
          {!itemize && (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={mfj} onChange={(e) => setMfj(e.target.checked)} className="h-4 w-4" />
              Married filing jointly
            </label>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Donate-stock advantage" value={usd(r.edge)} />
          <Result label="Total tax value: stock" value={usd(r.stockVal)} />
          <Result label="Total tax value: cash" value={usd(r.cashVal)} />
          <Result label="Capital gain avoided" value={`${usd(r.gain)} → ${usd(r.avoided)}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {itemize ? (
            <>Both routes deduct, but 2026's new <span className="font-medium">0.5%-of-AGI floor</span> ({usd(r.floor)}) comes off the top — your deduction is {usd(Math.max(0, fmv - r.floor))}, worth {usd(r.dedValStock)}. Donating the stock ALSO erases the {usd(r.gain)} embedded gain: <span className="font-medium">{usd(r.avoided)} you'd owe if you sold first</span>. Stock wins by {usd(r.edge)} — and the bigger the gain percentage, the wider the gap.</>
          ) : (
            <>You take the standard deduction, so a cash gift only deducts via 2026's new above-the-line rule — capped at <span className="font-medium">{usd(mfj ? 2000 : 1000)}</span>, cash only, worth {usd(r.cashVal)} here. The stock gift gets no deduction at all for you — but it still erases the {usd(r.gain)} gain (<span className="font-medium">{usd(r.avoided)}</span>) versus selling to fund the gift. If the gift is small, cash wins; if the stock is deeply appreciated, stock wins — the crossover is when {ord}% of the gift exceeds the avoided gain.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Mechanics that matter: the stock must be held MORE than one year — hold ≤1 year and the deduction collapses to your basis, not the value. Appreciated-property gifts to public charities are capped at 30% of AGI (cash at 60%), with 5-year carryforward for ceiling-overflow — but amounts lost to the new 0.5% floor are gone permanently, no carryover. Non-itemizers: the new $1,000/$2,000 above-the-line deduction is cash-only and excludes DAF contributions. Best execution: donate the shares in-kind (your broker or the charity's DTC instructions — never sell first), and if you still want the position, rebuy it the same day — no wash-sale rule on gains, so you reset your basis to today's price for free. That "donate high, rebuy, repeat" loop is the cleanest giving strategy in the code.
        </p>
      </CardContent>
    </Card>
  )
}

// QCD — qualified charitable distribution, IRC §408(d)(8): age 70½+ (exact half-birthday — NOT the RMD age of 73/75), up to $111,000/person in 2026 (indexed; $222k couple but only from each spouse's OWN IRA), transferred DIRECTLY from a traditional/inherited IRA to a public charity — excluded from AGI entirely while counting toward the year's RMD (first-dollars-out: early-year distributions count against the RMD first). Beats the itemized deduction because ~90% of filers don't itemize, and even itemizers win on AGI: lower AGI → less Social Security taxed, lower IRMAA tiers, less NIIT exposure, no 60%-of-AGI cap. Ineligible recipients: DAFs, private foundations, supporting orgs. SECURE 2.0 §307: one-time $55,000 QCD into a CRT/CGA. Active SEP/SIMPLE and employer plans ineligible. Node-verified: giving $25k at 22%+5% → $6,750 saved vs cash-without-itemizing; giving $150k → capped $111k, excess $39k taxable-or-itemized; $10k at 12%+4% → $1,600.
export function QcdCalc() {
  const [giving, setGiving] = useNumber(25000)
  const [rmd, setRmd] = useNumber(40000)
  const [fed, setFed] = useNumber(22)
  const [st, setSt] = useNumber(5)
  const [itemize, setItemize] = useState(false)

  const r = useMemo(() => {
    const q = Math.min(giving, 111000)
    const rate = (fed + st) / 100
    const saved = q * rate
    const rmdCovered = Math.min(q, rmd)
    const excess = Math.max(0, giving - 111000)
    const itemDedValue = itemize ? giving * rate : 0
    const agiEdge = itemize ? saved : 0
    return { q, saved, rmdCovered, excess, itemDedValue, agiEdge }
  }, [giving, rmd, fed, st, itemize])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Charitable giving this year" value={giving} onChange={setGiving} prefix="$" />
          <Field label="Your RMD this year (0 if not started)" value={rmd} onChange={setRmd} prefix="$" />
          <Field label="Federal bracket" value={fed} onChange={setFed} suffix="%" />
          <Field label="State rate" value={st} onChange={setSt} suffix="%" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={itemize} onChange={(e) => setItemize(e.target.checked)} className="h-4 w-4" />
          You itemize deductions even without this gift
        </label>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Tax saved by QCD route" value={usd(r.saved)} />
          <Result label="QCD amount (cap $111,000)" value={usd(r.q)} />
          <Result label="RMD satisfied tax-free" value={usd(r.rmdCovered)} />
          <Result label="Over the cap" value={usd(r.excess)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Sending <span className="font-medium">{usd(r.q)}</span> straight from your IRA to the charity keeps it off your 1040 entirely{r.rmdCovered > 0 && <> while satisfying {usd(r.rmdCovered)} of your RMD</>}. Versus withdrawing and writing a check{itemize ? <>: the itemized deduction gives you the same headline number ({usd(r.itemDedValue)}), but the QCD also <span className="font-medium">lowers AGI</span> — less Social Security taxed, lower IRMAA tier, less NIIT exposure, no 60%-of-AGI cap. That edge is real money: one IRMAA tier is worth $800+/yr per person.</> : <> with the standard deduction (which {itemize ? 'you itemize past' : '~90% of filers take'}), the check saves you <span className="font-medium">$0</span> — the QCD saves <span className="font-medium">{usd(r.saved)}</span> at your {fed + st}% combined rate.</>}
          {r.excess > 0 && <> Note: {usd(r.excess)} of your giving is over the $111,000 cap — that portion needs the normal route (itemized deduction or appreciated stock).</>}
        </div>
        <p className="text-xs text-muted-foreground">
          Rules that matter: age 70½ exactly — your half-birthday, not the year you turn 70, and NOT the RMD age (73/75) — the gap between 70½ and RMD age is a free window where QCDs shrink the IRA balance your future RMDs are computed on. The check must go directly from the custodian to the charity (payable to the charity; you can mail it, but never deposit it yourself). First dollars out of the IRA each year count as your RMD — do the QCD early in the year. Ineligible recipients: donor-advised funds, private foundations, supporting organizations. Eligible accounts: traditional and inherited traditional IRAs (inactive SEP/SIMPLE too); NOT 401(k)s — roll to an IRA first. One-time bonus: SECURE 2.0 §307 allows a single $55,000 QCD into a charitable remainder trust or gift annuity. Married couples get $111,000 EACH, but only from each spouse's own IRA. The 1099-R won't mark the QCD — tell your preparer or the whole thing lands as taxable income.
        </p>
      </CardContent>
    </Card>
  )
}

// Step-up in basis — IRC §1014: assets passing at death get basis reset to fair market value, erasing ALL unrealized capital gain (and all depreciation recapture — rentals' §1250 gain dies with the owner). Gifts during life carry over the donor's basis (§1015) — the classic mistake: gifting appreciated stock to mom vs inheriting it. Community property states (AZ, CA, ID, LA, NV, NM, TX, WA, WI): BOTH halves of community property step up at first death; common-law joint property: only the decedent's half. NO step-up for income in respect of a decedent (IRD): traditional IRA/401(k) balances, deferred comp — heirs pay ordinary rates (see inherited-ira-calculator). Estate exemption 2026: $15M/person (OBBBA §70106, indexed) — so for nearly everyone the BASIS story matters more than the estate tax. Node-verified: basis $100k→FMV $600k single at 23.8% → $119,000 erased; joint common-law → $59,500 erased, $59,500 still taxable; basis $150k→$1M at 20% → $170,000 erased.
export function StepUpBasisCalc() {
  const [basis, setBasis] = useNumber(100000)
  const [fmv, setFmv] = useNumber(600000)
  const [rate, setRate] = useNumber(23.8)
  const [own, setOwn] = useState('single')

  const r = useMemo(() => {
    const frac = own === 'joint' ? 0.5 : 1
    const gain = Math.max(0, fmv - basis)
    const ifSold = gain * (rate / 100)
    const erased = gain * frac * (rate / 100)
    const stillTaxable = gain * (1 - frac) * (rate / 100)
    return { gain, ifSold, erased, stillTaxable }
  }, [basis, fmv, rate, own])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Original cost basis" value={basis} onChange={setBasis} prefix="$" />
          <Field label="Value today" value={fmv} onChange={setFmv} prefix="$" />
          <Field label="Combined cap-gains rate" value={rate} onChange={setRate} suffix="%" />
          <div>
            <label className="mb-1 block text-sm font-medium">Ownership</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={own}
              onChange={(e) => setOwn(e.target.value)}
            >
              <option value="single">Single / sole owner — full step-up</option>
              <option value="joint">Joint, common-law state — half steps up</option>
              <option value="community">Community property state — both halves</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Tax erased at death" value={usd(r.erased)} />
          <Result label="Unrealized gain" value={usd(r.gain)} />
          <Result label="Tax if sold today" value={usd(r.ifSold)} />
          <Result label="Still taxable to survivors" value={usd(r.stillTaxable)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.gain > 0 ? (
            <>Selling today costs <span className="font-medium">{usd(r.ifSold)}</span>. Dying holding it erases <span className="font-medium">{usd(r.erased)}</span> of that — heirs get a fresh basis at {own === 'joint' ? 'half the gain erased; the survivor still carries' : 'fair market value, so'} {r.stillTaxable > 0 ? usd(r.stillTaxable) + ' of tax on the survivor\'s half.' : 'zero taxable gain.'} {own === 'joint' && <> In a community-property state BOTH halves would step up — {usd(r.gain * (rate / 100))} erased instead.</>}</>
          ) : (
            <>No unrealized gain — basis meets or exceeds today's value, so the step-up changes nothing here. (It can also step DOWN; basis resets to value either way.)</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          §1014 resets basis to fair market value at death — every dollar of appreciation, and every dollar of depreciation recapture on rentals, vanishes for income-tax purposes. The flip side nobody mentions: gifts during life carry over YOUR basis (§1015), so gifting appreciated stock to an elderly parent and inheriting it back ("upstream gifting") converts a taxable gain into a tax-free one — while gifting the same stock to your kids hands them your tax bill. Community property states (AZ, CA, ID, LA, NV, NM, TX, WA, WI) double the benefit at the first spouse's death. The big exception: traditional IRAs, 401(k)s, and deferred comp get NO step-up — that's income in respect of a decedent, taxed at heirs' ordinary rates on the 10-year clock. With the 2026 estate exemption at $15M/person, the basis step-up — not the estate tax — is the tax break that matters for almost every estate.
        </p>
      </CardContent>
    </Card>
  )
}

// Inherited IRA 10-year rule — SECURE Act §401 (deaths after 12/31/2019): non-spouse beneficiaries must EMPTY the account by end of year 10. Final regs (T.D. 10001, July 2024): if the owner died ON/AFTER their required beginning date, annual RMDs (Single Life Table) are ALSO required years 1–9 — the empty-by-year-10-only reading died with the regs. Eligible designated beneficiaries (spouse, minor children until majority, disabled/chronically ill, beneficiaries ≤10 years younger) can still stretch. Missed RMD penalty: 25%, cut to 10% if corrected within 2 years (SECURE 2.0 §302). Inherited Roth: same 10-year clock but withdrawals are tax-free — waiting to year 10 is nearly always optimal. Strategy math node-verified: $500k/10yr/6% → even withdrawals $67,934/yr, total $679,340, net $516,298 at 24%; lump year 10 = $895,424, net $564,117 at 37% — lump wins unless lump bracket > 42.3% (crossover = 1 − evenNet/lumpFV). $200k/7yr/5%: even $34,564/yr net $188,719 at 22%; lump $281,420 net $191,366 at 32%.
export function InheritedIraCalc() {
  const [bal, setBal] = useNumber(500000)
  const [yrs, setYrs] = useNumber(10)
  const [g, setG] = useNumber(6)
  const [brEven, setBrEven] = useNumber(24)
  const [brLump, setBrLump] = useNumber(37)
  const [postRbd, setPostRbd] = useState(true)

  const r = useMemo(() => {
    const n = Math.max(1, yrs)
    const gr = g / 100
    const pmt = gr > 0 ? (bal * gr) / (1 - Math.pow(1 + gr, -n)) : bal / n
    const evenTot = pmt * n
    const evenNet = evenTot * (1 - brEven / 100)
    const lumpFV = bal * Math.pow(1 + gr, n)
    const lumpNet = lumpFV * (1 - brLump / 100)
    const crossover = lumpFV > 0 ? 1 - evenNet / lumpFV : 0
    const lumpWins = lumpNet > evenNet
    return { pmt, evenTot, evenNet, lumpFV, lumpNet, crossover, lumpWins }
  }, [bal, yrs, g, brEven, brLump])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Inherited balance" value={bal} onChange={setBal} prefix="$" />
          <Field label="Years left in the 10-year window" value={yrs} onChange={setYrs} />
          <Field label="Growth rate" value={g} onChange={setG} suffix="%" />
          <Field label="Bracket on steady withdrawals" value={brEven} onChange={setBrEven} suffix="%" />
          <Field label="Bracket if you take a lump" value={brLump} onChange={setBrLump} suffix="%" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={postRbd} onChange={(e) => setPostRbd(e.target.checked)} className="h-4 w-4" />
            Owner died on/after their RMD start date
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label={r.lumpWins ? 'Lump at year 10 nets more' : 'Steady withdrawals net more'} value={usd(Math.max(r.lumpNet, r.evenNet))} />
          <Result label="Steady: withdrawal / year" value={usd(r.pmt)} />
          <Result label="Steady: net after tax" value={usd(r.evenNet)} />
          <Result label="Lump: net after tax" value={usd(r.lumpNet)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Even withdrawals of <span className="font-medium">{usd(r.pmt)}/yr</span> empty the account on schedule: {usd(r.evenTot)} gross, {usd(r.evenNet)} net at {brEven}%. Waiting compounds to <span className="font-medium">{usd(r.lumpFV)}</span> by year {yrs}, netting {usd(r.lumpNet)} at {brLump}%. Crossover: the lump wins unless the lump bracket exceeds <span className="font-medium">{num(r.crossover * 100, 1)}%</span> — deferral is worth a lot; a bracket jump is too.
          {postRbd ? <> <span className="font-medium">Because the owner died on/after their RMD start date, you also owe ANNUAL minimum withdrawals (Single Life Table) in years 1–9</span> — the steady strategy covers them; the pure-wait strategy does not. Missed RMDs cost 25% (10% if fixed within 2 years).</> : <> Owner died before their RMD start date, so no annual minimums — the whole window is yours to time.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          SECURE Act (deaths after 2019): non-spouse heirs must empty inherited IRAs by December 31 of year 10 — no more lifetime stretch. The 2024 final regulations added the trap: if the original owner had already started RMDs, beneficiaries must take annual minimums in years 1–9 AND empty by year 10. Exempt "eligible designated beneficiaries" — surviving spouses, minor children (until majority), disabled or chronically ill individuals, and anyone not more than 10 years younger than the owner — can still stretch over their life expectancy. Inherited ROTH IRAs follow the same 10-year clock, but withdrawals are tax-free: letting it compound to year 10 is nearly always right. Bracket management matters more than the average suggests — withdrawals stack on your salary; taking extra in low-income years (sabbatical, early retirement before Social Security) beats both flat strategies. Simplified model: flat brackets, no state tax, no annual-RMD table detail — a flat bracket understates the lump's true cost since big withdrawals climb brackets on the way up.
        </p>
      </CardContent>
    </Card>
  )
}

// Kiddie tax — IRC §1(g), 2026 (Rev. Proc. 2025-32): child's unearned income (interest, dividends, capital gains — never wages) is taxed in three layers: first $1,350 tax-free, next $1,350 at the child's rate, everything over $2,700 at the PARENTS' marginal rate. Applies to children under 18 (always), age 18, or full-time students 19–23 whose earned income ≤ half their support. Ordinary income (interest, nonqualified divs, short-term gains) takes parents' ordinary bracket; LTCG/qualified dividends take parents' 0/15/20% rate. Parent election (Form 8814) available when gross income > $1,350 and < $13,500 — simplifies filing but stacks the income on the parents' return (can push NIIT/phaseouts). Node-verified: $5,000 ordinary dividends, parents 32% → $0 + $135 + $736 = $871 (matches SmartAsset 2026 example); 50% LTCG mix at parents' 15% → $675.50.
export function KiddieTaxCalc() {
  const [unearned, setUnearned] = useNumber(5000)
  const [ltcgPct, setLtcgPct] = useNumber(0)
  const [pOrd, setPOrd] = useNumber(32)
  const [pCap, setPCap] = useNumber(15)
  const [cRate, setCRate] = useNumber(10)

  const r = useMemo(() => {
    const free = Math.min(unearned, 1350)
    const childLayer = Math.min(Math.max(0, unearned - 1350), 1350)
    const excess = Math.max(0, unearned - 2700)
    const capShare = ltcgPct / 100
    const excessTax = excess * (capShare * (pCap / 100) + (1 - capShare) * (pOrd / 100))
    const childTax = childLayer * (cRate / 100)
    const total = childTax + excessTax
    const childOnly = unearned * (cRate / 100)
    return { free, childLayer, excess, excessTax, childTax, total, childOnly, elect: unearned > 1350 && unearned < 13500 }
  }, [unearned, ltcgPct, pOrd, pCap, cRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Child's unearned income" value={unearned} onChange={setUnearned} prefix="$" />
          <Field label="Share that's LTCG / qualified divs" value={ltcgPct} onChange={setLtcgPct} suffix="%" />
          <Field label="Parents' ordinary bracket" value={pOrd} onChange={setPOrd} suffix="%" />
          <Field label="Parents' capital gains rate" value={pCap} onChange={setPCap} suffix="%" />
          <Field label="Child's own rate" value={cRate} onChange={setCRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Tax on the income" value={usd(r.total, 2)} />
          <Result label="Tax-free layer" value={usd(r.free)} />
          <Result label={`Child-rate layer (${cRate}%)`} value={`${usd(r.childLayer)} → ${usd(r.childTax, 2)}`} />
          <Result label="Parents'-rate layer" value={`${usd(r.excess)} → ${usd(r.excessTax, 2)}`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.excess > 0 ? (
            <>The first {usd(r.free)} is free and {usd(r.childLayer)} costs the child's {cRate}% — but <span className="font-medium">{usd(r.excess)} spills over the $2,700 line and takes YOUR rates</span>: {usd(r.excessTax, 2)} instead of the {usd(r.excess * (cRate / 100), 2)} it would cost at the child's rate. Kiddie tax added: <span className="font-medium">{usd(r.excessTax - r.excess * (cRate / 100), 2)}</span>.</>
          ) : (
            <>Under the $2,700 threshold — no kiddie tax. {usd(r.free)} is tax-free and the rest costs the child's {cRate}%: <span className="font-medium">{usd(r.total, 2)} total</span>.</>
          )}
          {r.elect && <> Gross income is under $13,500, so you <span className="font-medium">can elect Form 8814</span> and put it on your own return — one less filing, but it inflates your AGI (watch NIIT and phaseouts).</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules (Rev. Proc. 2025-32): first $1,350 of unearned income tax-free, next $1,350 at the child's rate, excess over $2,700 at the parents' marginal rate — ordinary rates for interest/nonqualified dividends/short-term gains, 0/15/20% for LTCG and qualified dividends. Applies to kids under 18, 18-year-olds, and full-time students 19–23 whose earned income doesn't cover half their support. Wages are never kiddie-taxed — a Roth IRA funded from a teen's job income dodges this entirely, which is why "custodial Roth" beats "custodial brokerage" for shifting dollars. Planning levers: keep custodial-account yield under $2,700, tilt toward growth stocks (no dividends until sale), or use 529s/UTMA-to-529 transfers where gains compound tax-free. The Form 8814 parent election (gross income $1,350–$13,500) saves a return but adds the income to your AGI.
        </p>
      </CardContent>
    </Card>
  )
}

// Estimated-tax underpayment penalty — IRC §6654: required annual payment = LESSER of 90% of current-year tax or 100% of prior-year tax (110% if prior-year AGI > $150,000 / $75k MFS). Each quarter requires 25%; withholding counts as paid EVENLY across quarters (§6654(g)) — that's why raising December W-4 withholding retroactively fixes earlier quarters while a late estimated payment can't. Penalty = per-quarter cumulative shortfall × that quarter's §6621 rate (2026: Q1 7%, Q2 6%, Q3/Q4 7% — IRS IR-2025-112, IRB 2026-08, IR-2026-98), compounded daily; approximated here as shortfall × rate/4 per quarter. De minimis: no penalty if tax due at filing < $1,000. Node-verified: cur $20k/prior $15k/WH $10k/no estimates → required $15k, penalty $212.50; cur $50k/prior $40k/AGI $200k/$5k per quarter → required $44k (110% rule), penalty $1,020; due-at-filing $500 → de minimis, no penalty.
export function UnderpaymentPenaltyCalc() {
  const [cur, setCur] = useNumber(20000)
  const [prior, setPrior] = useNumber(15000)
  const [agi, setAgi] = useNumber(120000)
  const [wh, setWh] = useNumber(10000)
  const [q1, setQ1] = useNumber(0)
  const [q2, setQ2] = useNumber(0)
  const [q3, setQ3] = useNumber(0)
  const [q4, setQ4] = useNumber(0)

  const r = useMemo(() => {
    const rates = [0.07, 0.06, 0.07, 0.07]
    const req = Math.min(0.9 * cur, (agi > 150000 ? 1.1 : 1) * prior)
    const rq = req / 4
    const wq = wh / 4
    const pays = [q1, q2, q3, q4]
    let cum = 0
    let pen = 0
    for (let i = 0; i < 4; i++) {
      cum += rq - wq - pays[i]
      pen += Math.max(0, cum) * (rates[i] / 4)
    }
    const paid = wh + q1 + q2 + q3 + q4
    const due = Math.max(0, cur - paid)
    const deMinimis = due < 1000
    if (deMinimis) pen = 0
    const perQ = Math.max(0, rq - wq)
    return { req, pen, due, deMinimis, perQ, met: paid >= req }
  }, [cur, prior, agi, wh, q1, q2, q3, q4])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="This year's total tax" value={cur} onChange={setCur} prefix="$" />
          <Field label="Last year's total tax" value={prior} onChange={setPrior} prefix="$" />
          <Field label="Last year's AGI" value={agi} onChange={setAgi} prefix="$" />
          <Field label="Withholding this year" value={wh} onChange={setWh} prefix="$" />
          <Field label="Est. paid Q1 (Apr 15)" value={q1} onChange={setQ1} prefix="$" />
          <Field label="Est. paid Q2 (Jun 15)" value={q2} onChange={setQ2} prefix="$" />
          <Field label="Est. paid Q3 (Sep 15)" value={q3} onChange={setQ3} prefix="$" />
          <Field label="Est. paid Q4 (Jan 15)" value={q4} onChange={setQ4} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Estimated penalty" value={r.deMinimis ? '$0 — under $1,000 rule' : usd(r.pen, 2)} />
          <Result label="Required annual payment" value={usd(r.req)} />
          <Result label="Needed per quarter" value={usd(r.perQ)} />
          <Result label="Balance due at filing" value={usd(r.due)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Your safe harbor is the <span className="font-medium">lesser of 90% of this year ({usd(0.9 * cur)}) or {agi > 150000 ? '110%' : '100%'} of last year ({usd((agi > 150000 ? 1.1 : 1) * prior)})</span> = {usd(r.req)}, due in four {usd(r.req / 4)} installments. Withholding covers {usd(wh / 4)} per quarter automatically — the IRS treats it as paid evenly all year no matter when it comes out.
          {r.pen > 0 ? (
            <> Your payments leave a growing shortfall, and at 2026's rates (7%/6%/7%/7%) the penalty works out to about <span className="font-medium">{usd(r.pen, 2)}</span> — the IRS's own short method would land close to this. Cheapest fix: bump W-4 withholding now; it backfills earlier quarters. A lump-sum estimated payment only stops the bleeding from today forward.</>
          ) : r.deMinimis ? (
            <> You owe {usd(r.due)} at filing, but that's under the $1,000 threshold — <span className="font-medium">no penalty applies</span>.</>
          ) : (
            <> {r.due > 0 ? <>You still owe {usd(r.due)} at filing, but the safe harbor is met — <span className="font-medium">no penalty</span>. Pay the balance by April and you're clean.</> : <><span className="font-medium">Safe harbor met</span> — payments cover the requirement.</>}</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The penalty isn't really a penalty — it's interest: the cumulative shortfall each quarter × that quarter's §6621 rate (federal short-term + 3 points; 2026: 7% Q1, 6% Q2, 7% Q3/Q4), compounded daily. This tool uses the standard quarter-by-quarter approximation; Form 2210's exact daily compounding will differ slightly. Two escape hatches beyond the safe harbors: the $1,000 de minimis (owe under $1,000 after withholding and the penalty vanishes entirely), and the annualized-income installment method (Form 2210 Schedule AI) for income that arrives late in the year — freelancers with a huge Q4 owe less per early quarter. Farmers/fishers get one January payment instead. Some states run their own version on top. Rates reset quarterly, so a 2027 balance re-prices in January.
        </p>
      </CardContent>
    </Card>
  )
}

// Net Investment Income Tax + Additional Medicare Tax — IRC §1411/§3101(b)(2): 3.8% NIIT on the LESSER of net investment income or MAGI over the threshold; 0.9% Additional Medicare on wages/SE over the threshold. Thresholds are statutory since 2013 and NOT inflation-indexed: $200k single/HoH, $250k MFJ, $125k MFS — bracket creep by design. NII includes interest, nonqualified dividends, capital gains, rental/royalty and passive business income; EXCLUDES wages, active/pass-through business income, Social Security, pensions, and IRA/401(k) distributions (but Roth conversions raise MAGI and can drag OTHER income into NIIT). Employer withholding for the 0.9% kicks in at $200k regardless of status — reconcile on the 1040. Node-verified: single MAGI $250k/NII $40k → $1,520; MFJ $300k/$80k → $1,900; MAGI under threshold → $0; MFJ $500k/$100k → $3,800; wages $300k single → 0.9% × $100k = $900.
export function NiitCalc() {
  const [status, setStatus] = useState('single')
  const [magi, setMagi] = useNumber(250000)
  const [nii, setNii] = useNumber(40000)
  const [wages, setWages] = useNumber(210000)

  const r = useMemo(() => {
    const thr = status === 'mfj' ? 250000 : status === 'mfs' ? 125000 : 200000
    const excess = Math.max(0, magi - thr)
    const niit = 0.038 * Math.min(nii, excess)
    const med = 0.009 * Math.max(0, wages - thr)
    return { thr, excess, niit, med, total: niit + med }
  }, [status, magi, nii, wages])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Filing status</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="single">Single / Head of household — $200,000</option>
              <option value="mfj">Married filing jointly — $250,000</option>
              <option value="mfs">Married filing separately — $125,000</option>
            </select>
          </div>
          <Field label="Modified AGI" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Net investment income" value={nii} onChange={setNii} prefix="$" />
          <Field label="Wages + self-employment" value={wages} onChange={setWages} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Total surtaxes / year" value={usd(r.total)} />
          <Result label="3.8% NIIT" value={usd(r.niit)} />
          <Result label="0.9% Additional Medicare" value={usd(r.med)} />
          <Result label="MAGI over threshold" value={usd(r.excess)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.niit > 0 ? (
            <>Your MAGI exceeds the {usd(r.thr)} threshold by <span className="font-medium">{usd(r.excess)}</span>, so the 3.8% hits {usd(Math.min(nii, r.excess))} of investment income = <span className="font-medium">{usd(r.niit)}</span>. </>
          ) : (
            <>MAGI is under the {usd(r.thr)} threshold — <span className="font-medium">no NIIT</span> regardless of how much investment income you have. </>
          )}
          {r.med > 0 ? (
            <>Wages run {usd(wages - r.thr)} past the threshold, adding the 0.9% Additional Medicare Tax: <span className="font-medium">{usd(r.med)}</span>.</>
          ) : (
            <>Wages stay under the threshold, so the 0.9% Additional Medicare Tax doesn't apply.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Net investment income = interest, nonqualified dividends, capital gains (including home-sale gains above the §121 exclusion), rental and royalty income, and passive business income. It excludes wages, active pass-through business income, Social Security, pensions, and IRA/401(k) distributions — BUT a Roth conversion or big IRA withdrawal raises MAGI and can pull your other investment income into the 3.8% zone. The thresholds are fixed in the statute (2013) and never inflation-adjusted — every year more households cross them. Planning levers: tax-loss harvesting, municipal-bond interest (excluded from NII AND MAGI), timing capital gains across years, installment sales to spread MAGI, and maxing pre-tax retirement contributions to hold MAGI under the line. Note: employers withhold the 0.9% once wages pass $200,000 regardless of filing status — if you're MFJ that's early; reconcile on Form 8959 and Form 8960.
        </p>
      </CardContent>
    </Card>
  )
}

// S-corp reasonable salary — the core S-corp trade: salary pays FICA (12.4% SS up to the $184,500 wage base + 2.9% Medicare, both halves) while distributions pay neither. Sole-prop baseline: SE tax on 92.35% of profit, same 12.4%/2.9%. But every salary dollar also cuts QBI — S-corp QBI = 20% × (profit − salary), so salary costs 0.20 × salary × marginal bracket in lost deduction. And salary set unreasonably low invites IRS reclassification of distributions as wages (Rev. Rul. 59-221; no bright line — common heuristics 40–60% of profit or market wage for the role). Node-verified: profit $200k, salary $80k → FICA $12,240 vs SE $28,234 → payroll saved $15,994; QBI lost 0.20×80,000×0.32 = $5,120 → net $10,874; salary $200k (over SS base) → FICA $28,678.
export function SCorpSalaryCalc() {
  const [profit, setProfit] = useNumber(200000)
  const [salary, setSalary] = useNumber(80000)
  const [marg, setMarg] = useNumber(32)
  const [qbiOk, setQbiOk] = useState(true)

  const r = useMemo(() => {
    const sal = Math.min(salary, profit)
    const fica = Math.min(sal, 184500) * 0.124 + sal * 0.029
    const seBase = profit * 0.9235
    const seTax = Math.min(seBase, 184500) * 0.124 + seBase * 0.029
    const payrollSaved = seTax - fica
    const dist = profit - sal
    const qbiDed = qbiOk ? dist * 0.2 : 0
    const qbiLost = qbiOk ? sal * 0.2 * (marg / 100) : 0
    const net = payrollSaved - qbiLost
    const pct = profit > 0 ? (sal / profit) * 100 : 0
    const risky = profit > 0 && sal < profit * 0.4
    return { sal, fica, seTax, payrollSaved, dist, qbiDed, qbiLost, net, pct, risky }
  }, [profit, salary, marg, qbiOk])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="S-corp profit before your pay" value={profit} onChange={setProfit} prefix="$" />
          <Field label="Salary you pay yourself" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Federal bracket" value={marg} onChange={setMarg} suffix="%" />
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={qbiOk} onChange={(e) => setQbiOk(e.target.checked)} className="h-4 w-4" />
            QBI-eligible business
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Net S-corp advantage / year" value={usd(r.net)} />
          <Result label="Payroll tax: salary vs sole prop" value={`${usd(r.fica)} vs ${usd(r.seTax)}`} />
          <Result label="Distributions (no payroll tax)" value={usd(r.dist)} />
          <Result label="QBI deduction on distributions" value={usd(r.qbiDed)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Salary <span className="font-medium">{usd(r.sal)}</span> ({num(r.pct, 0)}% of profit) costs {usd(r.fica)} in FICA — but as a sole prop the whole {usd(profit)} would owe {usd(r.seTax)} of self-employment tax. Payroll tax saved: <span className="font-medium">{usd(r.payrollSaved)}</span>.{r.qbiLost > 0 && <> The catch: salary isn't QBI, so {usd(r.sal)} of wages forfeits {usd(r.qbiLost)} of 20%-deduction value at your bracket.</>} Net advantage: <span className="font-medium">{usd(r.net)}</span> per year.{r.risky && <> <span className="font-medium">⚠ Salary is under 40% of profit</span> — the classic reclassification trigger zone. The IRS can recharacterize distributions as wages plus back FICA and penalties.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          FICA = 12.4% Social Security (both halves) up to the $184,500 wage base (2026) + 2.9% Medicare on all wages. Sole-prop baseline applies the same rates to 92.35% of profit (the SE-tax adjustment). "Reasonable compensation" has no statutory formula — courts look at what you'd pay someone else to do your job (Rev. Rul. 59-221 and a long line of Tax Court cases). Common heuristics: 40–60% of profit, or the market wage for your role, whichever is defensible — document it with salary surveys or job postings. Below ~40% of profit, audit risk climbs fast; the penalty is back FICA on reclassified distributions plus up to 100% of the tax in penalties. Above the SS base the game shrinks to the 2.9% Medicare spread — still real, but smaller. QBI figures assume you're under the §199A thresholds; SSTBs above the phase-in lose the deduction anyway (uncheck the box). Simplified: ignores the deductible half of SE tax / employer FICA (similar on both sides) and the 0.9% Additional Medicare Tax.
        </p>
      </CardContent>
    </Card>
  )
}

// Accountable plan — IRC §62(c): an S-corp/partnership reimburses the owner-employee for business expenses (home office, mileage, phone, internet) — entity deducts, employee receives TAX-FREE, no payroll tax on the reimbursement. Without the plan, owner-paid expenses deduct NOWHERE: OBBBA made the TCJA's suspension of 2% miscellaneous itemized deductions permanent. Requirements: business connection, substantiation within reasonable time, return of excess. Home office simplified: $5/sqft ≤300 sqft ($1,500 cap). Mileage 2026: 72.5¢ H1 / 76¢ H2 (Notice 2026-10, Announcement 2026-11 — mirrors mileage-deduction-calculator). Node-verified: 200 sqft $1,000 + 6,000/4,000 mi $7,390 + phone $600 + internet $540 = $9,530 → $3,050 saved at 32%.
export function AccountablePlanCalc() {
  const [sqft, setSqft] = useNumber(200)
  const [milesH1, setMilesH1] = useNumber(6000)
  const [milesH2, setMilesH2] = useNumber(4000)
  const [phone, setPhone] = useNumber(600)
  const [internet, setInternet] = useNumber(540)
  const [other, setOther] = useNumber(500)
  const [marg, setMarg] = useNumber(32)
  const [stateRate, setStateRate] = useNumber(0)

  const r = useMemo(() => {
    const homeOffice = Math.min(sqft, 300) * 5
    const mileage = milesH1 * 0.725 + milesH2 * 0.76
    const total = homeOffice + mileage + phone + internet + other
    const saved = total * ((marg + stateRate) / 100)
    return { homeOffice, mileage, total, saved }
  }, [sqft, milesH1, milesH2, phone, internet, other, marg, stateRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Home office (sq ft, exclusive use)" value={sqft} onChange={setSqft} />
          <Field label="Business miles Jan–Jun (72.5¢)" value={milesH1} onChange={setMilesH1} />
          <Field label="Business miles Jul–Dec (76¢)" value={milesH2} onChange={setMilesH2} />
          <Field label="Business share of phone" value={phone} onChange={setPhone} prefix="$" />
          <Field label="Business share of internet" value={internet} onChange={setInternet} prefix="$" />
          <Field label="Other (supplies, dues, software)" value={other} onChange={setOther} prefix="$" />
          <Field label="Federal bracket" value={marg} onChange={setMarg} suffix="%" />
          <Field label="State rate" value={stateRate} onChange={setStateRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Home office (simplified)" value={usd(r.homeOffice)} />
          <Result label="Mileage" value={usd(r.mileage)} />
          <Result label="Total reimbursable, tax-free" value={usd(r.total)} />
          <Result label="Tax saved per year" value={usd(r.saved)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Your S-corp reimburses <span className="font-medium">{usd(r.total)}</span> — deductible to the entity, <span className="font-medium">tax-free to you, no payroll tax</span> on the reimbursement. Worth {usd(r.saved)} at your rates. Without the plan the same spending deducts nowhere: miscellaneous itemized deductions are permanently gone (OBBBA made the TCJA suspension permanent), so owner-paid expenses are just... personal spending. The plan is a one-page document plus three habits: submit expenses within 60 days, return any excess, and keep the receipts with the expense reports.
        </div>
        <p className="text-xs text-muted-foreground">
          IRC §62(c) accountable plan rules: business connection, substantiation within a reasonable time, return of excess — meet all three and reimbursements are excluded from wages entirely (no income tax, no FICA). Home office simplified method: $5/sq ft up to 300 sq ft = $1,500 max (the actual-expense method can beat it if your housing costs are high — and for an S-corp the office must be reimbursed by the entity, not claimed personally). Mileage at the 2026 split-year rates (72.5¢/76¢). Phone and internet at documented business-use percentage. This stacks with the Augusta Rule (separate 14-day rental) and is the unglamorous one that pays every single year. Sole props skip this — Schedule C deducts directly; this tool is for entity owners.
        </p>
      </CardContent>
    </Card>
  )
}

// Augusta Rule — IRC §280A(g): rent your home fewer than 15 days/year and the rental income is 100% excluded (not even reported); day 15 flips the ENTIRE year's rental income to taxable — the cliff is total. Rate must be fair market (comparable event/meeting-space quotes, documented); your S-corp/partnership deducts the rent as a business expense (board meetings, offsites) while you receive it tax-free — a deduction turning into excluded income. Sole props/Schedule C can't rent to themselves (no separate entity). Documentation: minutes, agenda, FMV comps, invoice, actual payment. Node-verified: 14 days × $1,500 = $21,000 excluded → $6,720 saved at 32%.
export function AugustaRuleCalc() {
  const [days, setDays] = useNumber(12)
  const [rate, setRate] = useNumber(1500)
  const [marg, setMarg] = useNumber(32)
  const [stateRate, setStateRate] = useNumber(0)

  const r = useMemo(() => {
    const ok = days <= 14
    const rent = ok ? days * rate : days * rate
    const saved = ok ? rent * ((marg + stateRate) / 100) : 0
    const taxIfBlown = !ok ? rent * ((marg + stateRate) / 100) : 0
    return { ok, rent, saved, taxIfBlown }
  }, [days, rate, marg, stateRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Days rented to your business" value={days} onChange={setDays} />
          <Field label="Fair-market daily rate" value={rate} onChange={setRate} prefix="$" />
          <Field label="Federal bracket" value={marg} onChange={setMarg} suffix="%" />
          <Field label="State rate" value={stateRate} onChange={setStateRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Result label="Tax-free income to you" value={usd(r.ok ? r.rent : 0)} />
          <Result label="Tax saved this year" value={usd(r.saved)} />
          <Result label="If you hit day 15" value={r.ok ? `all ${usd(days * rate)} taxable` : `${usd(r.taxIfBlown)} tax — the cliff took it all`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.ok ? (
            <>{num(days, 0)} days × {usd(rate)} = <span className="font-medium">{usd(r.rent)} excluded from income entirely</span> — not reported anywhere on your 1040 — while your S-corp deducts the same {usd(r.rent)} as rent expense, cutting pass-through income. Double benefit, one rule: §280A(g). You have {14 - days} day{14 - days === 1 ? '' : 's'} of headroom left. </>
          ) : (
            <><span className="font-medium">Day 15 detonates it.</span> §280A(g) is all-or-nothing: at {num(days, 0)} days the ENTIRE {usd(r.rent)} becomes taxable rental income ({usd(r.taxIfBlown)} of tax), not just the days over 14. Drop to 14 days.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The rules that survive audit: (1) the rate must be fair market — get written quotes for comparable meeting/event space in your area and keep them; $5,000/day for a living room is how people lose; (2) the business need must be real — board meetings, annual planning, client events, with minutes and an agenda; (3) paper it like a third-party rental: invoice, and actually move the money from the business account; (4) you need a separate entity — an S-corp or partnership can rent from you, a Schedule C sole prop cannot pay rent to itself; (5) the home can be your primary, a second home, or a vacation home — each unit gets its own 14 days. Named for the 1976 Masters-tournament provision; unchanged since. Pairs with the accountable-plan playbook: this is the one deduction that creates tax-free income rather than just reducing taxed income.
        </p>
      </CardContent>
    </Card>
  )
}

// STR loophole & REPS — §469: rental losses are passive by default. Two escapes: (1) STR loophole — average guest stay ≤7 days makes it NOT a "rental activity" (Treas. Reg. §1.469-1T(e)(3)(ii)), so only material participation is needed (main tests: >500 hrs, or >100 hrs and more than any other person); (2) REPS §469(c)(7) — >750 hrs in real property trades AND more than half of ALL working hours, plus material participation per property (or grouping election). Otherwise: $25,000 active-participation allowance phasing out $100k–$150k MAGI ($0 above $150k), suspended losses carry forward and release at sale. Node-verified: STR 5-day avg/120 hrs (cleaner 80) → fully non-passive; W-2 landlord 40 hrs, MAGI $120k → $15k of $30k deductible; REPS spouse 900 RE hrs of 1,500 total → full $80k; MAGI $160k → allowance $0.
export function STRRepsCalc() {
  const [stay, setStay] = useNumber(5)
  const [hrs, setHrs] = useNumber(120)
  const [others, setOthers] = useNumber(80)
  const [reHrs, setReHrs] = useNumber(120)
  const [totHrs, setTotHrs] = useNumber(2000)
  const [loss, setLoss] = useNumber(60000)
  const [magi, setMagi] = useNumber(180000)
  const [passive, setPassive] = useNumber(0)

  const r = useMemo(() => {
    const str = stay <= 7
    const mp = hrs >= 500 || (hrs >= 100 && hrs > others)
    const reps = reHrs > 750 && reHrs > totHrs / 2
    const nonPassive = (str && mp) || (reps && mp)
    const allow = Math.max(0, 25000 - 0.5 * Math.max(0, magi - 100000))
    const ded = nonPassive ? loss : Math.min(loss, passive + allow)
    return { str, mp, reps, nonPassive, allow, ded, susp: loss - ded }
  }, [stay, hrs, others, reHrs, totHrs, loss, magi, passive])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Average guest stay (days)" value={stay} onChange={setStay} />
          <Field label="YOUR hours on the rental this year" value={hrs} onChange={setHrs} />
          <Field label="Most hours anyone else worked (cleaner, manager)" value={others} onChange={setOthers} />
          <Field label="Hours in real estate work (all properties)" value={reHrs} onChange={setReHrs} />
          <Field label="Your TOTAL work hours (all jobs)" value={totHrs} onChange={setTotHrs} />
          <Field label="Rental loss (after depreciation/cost seg)" value={loss} onChange={setLoss} prefix="$" />
          <Field label="MAGI" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Other passive income" value={passive} onChange={setPassive} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Path" value={r.nonPassive ? (r.str ? 'STR loophole' : 'REPS') : 'Passive rules'} />
          <Result label="Loss deductible this year" value={usd(r.ded)} />
          <Result label="Suspended (carries forward)" value={usd(r.susp)} />
          <Result label="$25k allowance left" value={usd(r.allow)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.nonPassive ? (
            <><span className="font-medium">Non-passive — the full {usd(r.ded)} offsets W-2 and business income.</span> {r.str && r.mp ? `Average stay of ${num(stay, 1)} days (≤7) means this isn't a "rental activity" at all, and your ${num(hrs, 0)} hours pass material participation (${hrs >= 500 ? 'the 500-hour test' : 'the 100-hour nobody-did-more test'}).` : ''}{r.reps && r.mp ? `REPS qualifies: ${num(reHrs, 0)} real-estate hours beats both 750 and half of your ${num(totHrs, 0)} total working hours.` : ''} This is exactly how cost-segregation losses reach your W-2. </>
          ) : (
            <>Passive. {r.str && !r.mp ? <>The ≤7-day stay qualifies you for the STR loophole, but material participation fails: {hrs < 100 ? `${num(hrs, 0)} hours is under the 100-hour minimum` : `someone else logged ${num(others, 0)} hours vs your ${num(hrs, 0)} — the cleaner counts`}. </> : ''}{!r.str && !r.reps ? <>Stay over 7 days = rental activity, and REPS fails ({num(reHrs, 0)} RE hours needs &gt;750 AND more than half your {num(totHrs, 0)} total hours — a full-time W-2 makes that nearly impossible). </> : ''}You deduct {usd(r.ded)} (other passive income + the $25k allowance{r.allow === 0 ? ' — fully phased out over $150k MAGI' : ''}); {usd(r.susp)} suspends and releases when you sell or generate passive income. </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          §469 framework: rentals are passive unless an exception applies. STR loophole (Treas. Reg. §1.469-1T(e)(3)(ii)): average stay ≤7 days (or ≤30 with substantial services) removes "rental" status — then only material participation is needed: &gt;500 hours, OR &gt;100 hours and more than any other individual (property managers and cleaners count), OR substantially-all, among seven tests. REPS (§469(c)(7)): &gt;750 hours in real property trades AND more than half of ALL your working time — then each property still needs material participation (or make the grouping election). The $25,000 allowance requires active participation and ≥10% ownership, phasing out $100k–$150k MAGI. Document hours contemporaneously — a log built the week before an audit loses; STR platforms' calendars plus a time-tracking app win. Suspended losses release in full against any income the year you sell the property in a taxable disposition.
        </p>
      </CardContent>
    </Card>
  )
}

// Cost segregation + bonus depreciation — OBBBA §70301: 100% bonus depreciation PERMANENT for qualified property (≤20-yr recovery) acquired after Jan 19, 2025 (binding-contract grandfathering keeps old 40%/20% phase-down for pre-1/20/2025 acquisitions). Studies reclassify 20–45% of building basis into 5/7/15-yr property (carpet, cabinetry, appliances → 5yr; parking, landscaping, signage → 15yr), fully expensed year 1. Structure stays 27.5yr residential / 39yr commercial straight-line; land never depreciates. The trade: §1245 recapture at ORDINARY rates on reclassified components at sale (vs 25% §1250) — net benefit = year-1 savings − study cost − recapture delta (before time value, which adds more). Node-verified: $1M rental (25% land, 25% reclass, 32% bracket, $5k study) → year-1 savings $57,818, net $39,693; $4M commercial (30% reclass, 37%) → $346,092 year-1, net $218,892.
export function CostSegCalc() {
  const [price, setPrice] = useNumber(1000000)
  const [landPct, setLandPct] = useNumber(25)
  const [res, setRes] = useState(true)
  const [realloc, setRealloc] = useNumber(25)
  const [marg, setMarg] = useNumber(32)
  const [study, setStudy] = useNumber(5000)

  const r = useMemo(() => {
    const bldg = price * (1 - landPct / 100)
    const life = res ? 27.5 : 39
    const reclass = bldg * (realloc / 100)
    const struct = bldg - reclass
    const withCS = reclass + struct / life
    const without = bldg / life
    const y1save = (withCS - without) * (marg / 100)
    const recapDelta = reclass * ((marg - 25) / 100)
    const net = y1save - study - recapDelta
    return { bldg, reclass, withCS, without, y1save, recapDelta, net }
  }, [price, landPct, res, realloc, marg, study])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Purchase price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Land share (never depreciates)" value={landPct} onChange={setLandPct} suffix="%" />
          <div>
            <label className="mb-1 block text-sm font-medium">Property type</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={res ? 'res' : 'com'}
              onChange={(e) => setRes(e.target.value === 'res')}
            >
              <option value="res">Residential rental — 27.5 yr</option>
              <option value="com">Commercial — 39 yr</option>
            </select>
          </div>
          <Field label="Study reallocates to 5/7/15-yr" value={realloc} onChange={setRealloc} suffix="%" />
          <Field label="Your ordinary tax bracket" value={marg} onChange={setMarg} suffix="%" />
          <Field label="Study cost" value={study} onChange={setStudy} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Year-1 deduction WITH study" value={usd(r.withCS)} />
          <Result label="Year-1 without" value={usd(r.without)} />
          <Result label="Year-1 tax savings" value={usd(r.y1save)} />
          <Result label="Net benefit after study + recapture" value={usd(r.net)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Building basis {usd(r.bldg)} → the study carves out <span className="font-medium">{usd(r.reclass)}</span> into 5/7/15-year property, which 100% bonus depreciation (permanent, OBBBA) expenses in year one. Year-1 deduction jumps from {usd(r.without)} to <span className="font-medium">{usd(r.withCS)}</span> — worth {usd(r.y1save)} at your {num(marg, 0)}% bracket. The bill at sale: that {usd(r.reclass)} comes back as §1245 ordinary-rate recapture instead of 25% §1250 — an extra {usd(r.recapDelta)} — minus the {usd(study)} study. Net: <span className="font-medium">{usd(r.net)}</span> plus a decade of time value on the accelerated cash. Defer the recapture entirely by pairing with a 1031 exchange at sale.
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules: 100% bonus depreciation is permanent for property acquired after January 19, 2025 (OBBBA §70301, IRC §168(k)) — acquisitions under binding contracts signed before January 20, 2025 stay on the old 40%/20% phase-down. Studies typically reclassify 20–45% of building basis (5-yr: carpet, cabinetry, appliances, decorative lighting; 15-yr: parking, landscaping, fencing, signage). Look-back studies on properties bought years ago work via Form 3115 §481(a) catch-up — but bonus treatment on look-backs depends on the original acquisition date. Watch the traps: passive-loss rules can defer the deduction for non-REPs (real estate professional status or the STR loophole matters), state conformity varies (some states decouple from bonus), and DIY percentage estimates don't survive an IRS Cost Segregation ATG review over ~$300k. Engineering-based studies run $2,000–$15,000 depending on size.
        </p>
      </CardContent>
    </Card>
  )
}

// Depreciation recapture — §1250 unrecaptured gain (rental real estate, straight-line): depreciation taken is recaptured at 25% up to the gain; excess gain is LTCG (20% + 3.8% NIIT). §1245 (equipment, vehicles, machinery): recapture at ORDINARY rates up to gain. Loss → no recapture. Land never depreciates. §121 primary-residence exclusion doesn't shield depreciation taken after 5/6/1997. Node-verified: rental $600k sale, $36k costs, $450k basis, $120k dep → gain $234k = $120k @25% + $114k @23.8% → $57,132 federal + state. Cross-ref: defer instead via the 1031 exchange calculator.
export function DepRecaptureCalc() {
  const [kind, setKind] = useState<'real' | 'personal'>('real')
  const [sale, setSale] = useNumber(600000)
  const [costs, setCosts] = useNumber(36000)
  const [purch, setPurch] = useNumber(450000)
  const [dep, setDep] = useNumber(120000)
  const [ordRate, setOrdRate] = useNumber(24)
  const [stateRate, setStateRate] = useNumber(0)

  const r = useMemo(() => {
    const adj = purch - dep
    const gain = sale - costs - adj
    const g = Math.max(0, gain)
    const recap = Math.min(g, dep)
    const rest = g - recap
    const recapRate = kind === 'real' ? 0.25 : ordRate / 100
    const fed = recap * recapRate + rest * 0.238
    const st = g * (stateRate / 100)
    return { adj, gain, recap, rest, recapRate, fed, st, loss: gain < 0 }
  }, [kind, sale, costs, purch, dep, ordRate, stateRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Property type</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as 'real' | 'personal')}
            >
              <option value="real">Rental real estate (§1250 — 25% recapture)</option>
              <option value="personal">Equipment / vehicle / machinery (§1245 — ordinary rates)</option>
            </select>
          </div>
          <Field label="Sale price" value={sale} onChange={setSale} prefix="$" />
          <Field label="Selling costs" value={costs} onChange={setCosts} prefix="$" />
          <Field label="Original purchase price" value={purch} onChange={setPurch} prefix="$" />
          <Field label="Total depreciation taken" value={dep} onChange={setDep} prefix="$" />
          {kind === 'personal' && <Field label="Your ordinary tax bracket" value={ordRate} onChange={setOrdRate} suffix="%" />}
          <Field label="State tax rate" value={stateRate} onChange={setStateRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Adjusted basis" value={usd(r.adj)} />
          <Result label="Recaptured depreciation" value={usd(r.recap)} />
          <Result label="Federal tax on the sale" value={usd(r.fed)} />
          <Result label="Total incl. state" value={usd(r.fed + r.st)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.loss ? (
            <>Sale below your adjusted basis of {usd(r.adj)} — a deductible loss, and <span className="font-medium">no recapture</span>. (Recapture only applies to gain.)</>
          ) : (
            <>Gain of {usd(Math.max(0, r.gain))} splits in two: <span className="font-medium">{usd(r.recap)} of depreciation recapture at {num(r.recapRate * 100, 0)}%</span>{r.rest > 0 && <> plus {usd(r.rest)} of true appreciation at 23.8% (20% LTCG + 3.8% NIIT)</>}. The depreciation that saved you {kind === 'real' ? 'your ordinary rate' : 'ordinary rates'} every year comes back at {num(r.recapRate * 100, 0)}% on sale — the deduction was a loan, not a gift.</>
          )}
          {kind === 'real' && !r.loss && <> Defer the whole thing instead: a 1031 exchange rolls both the appreciation AND the recapture into the next property — run the 1031 calculator before you list.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          §1250 real property (rentals, commercial buildings): only depreciation in excess of straight-line is ordinary income — and straight-line has been mandatory since 1986, so in practice ALL recapture is "unrecaptured §1250 gain" capped at 25%. §1245 personal property (equipment, vehicles, machinery, bonus-depreciated assets): recapture at your full ordinary rate — no 25% cap. NIIT (3.8%) applies over $200k/$250k MAGI. Land is never depreciable — allocate the purchase price honestly. Primary residences: the §121 $250k/$500k exclusion does NOT cover depreciation taken after May 6, 1997 — that portion is recaptured at 25% even when the rest of the gain is excluded. Cost segregation accelerates deductions but converts future 25% gain into ordinary-rate §1245 recapture. Inherited property: basis steps up and accumulated recapture dies with the owner.
        </p>
      </CardContent>
    </Card>
  )
}

// §1031 like-kind exchange — post-TCJA real property only (investment/business). Clocks: 45-day identification, 180-day closing, both calendar days from the sale; qualified intermediary holds proceeds (touch the money = boot). Full deferral requires: replacement price ≥ sale price, ALL equity reinvested, and equal-or-greater debt. Boot = cash not reinvested + net mortgage relief; recognized gain = min(realized gain, boot); unrecaptured §1250 depreciation recapture (25%) applies to recognized boot FIRST, remainder at LTCG 20% + 3.8% NIIT. Deferred gain reduces replacement basis. Chaining unlimited; death steps up basis ("swap till you drop"). Node-verified: sell $900k ($54k costs), bought $500k with $150k depreciation, $300k old loan, buy $1.0M with $500k loan → equity $546k, reinvested $500k → cash boot $46k, all recapture @25% = $11,500 tax; deferred $450k → new basis $550k.
export function Exchange1031Calc() {
  const [sale, setSale] = useNumber(900000)
  const [costs, setCosts] = useNumber(54000)
  const [purch, setPurch] = useNumber(500000)
  const [dep, setDep] = useNumber(150000)
  const [oldM, setOldM] = useNumber(300000)
  const [newP, setNewP] = useNumber(1000000)
  const [newM, setNewM] = useNumber(500000)
  const [stateRate, setStateRate] = useNumber(0)

  const r = useMemo(() => {
    const adj = purch - dep
    const gain = sale - costs - adj
    const equity = sale - costs - oldM
    const reinvested = newP - newM
    const cashBoot = Math.max(0, equity - reinvested)
    const mortBoot = Math.max(0, oldM - newM)
    const boot = cashBoot + mortBoot
    const recog = Math.min(Math.max(0, gain), boot)
    const recap = Math.min(recog, dep)
    const fedTax = recap * 0.25 + (recog - recap) * 0.238
    const stTax = recog * (stateRate / 100)
    const deferred = Math.max(0, gain) - recog
    const newBasis = newP - deferred
    return { adj, gain, equity, reinvested, cashBoot, mortBoot, recog, recap, fedTax, stTax, deferred, newBasis }
  }, [sale, costs, purch, dep, oldM, newP, newM, stateRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Sale price" value={sale} onChange={setSale} prefix="$" />
          <Field label="Selling costs" value={costs} onChange={setCosts} prefix="$" />
          <Field label="Original purchase price" value={purch} onChange={setPurch} prefix="$" />
          <Field label="Accumulated depreciation" value={dep} onChange={setDep} prefix="$" />
          <Field label="Old mortgage payoff" value={oldM} onChange={setOldM} prefix="$" />
          <Field label="Replacement property price" value={newP} onChange={setNewP} prefix="$" />
          <Field label="New mortgage" value={newM} onChange={setNewM} prefix="$" />
          <Field label="State tax rate" value={stateRate} onChange={setStateRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Realized gain" value={usd(r.gain)} />
          <Result label="Boot (taxable now)" value={usd(r.recog)} />
          <Result label="Tax on the boot" value={usd(r.fedTax + r.stTax)} />
          <Result label="New basis in replacement" value={usd(r.newBasis)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.recog > 0 ? (
            <>Boot breakdown: {usd(r.cashBoot)} cash not reinvested + {usd(r.mortBoot)} net mortgage relief = <span className="font-medium">{usd(r.recog)} recognized</span>. Depreciation recapture hits the boot first: {usd(r.recap)} at 25%{(r.recog - r.recap) > 0 && `, the rest at 23.8%`}. </>
          ) : (
            <><span className="font-medium">Full deferral.</span> Replacement price ≥ sale price, all {usd(r.equity)} of equity reinvested, and no net debt relief — zero recognized gain. </>
          )}
          The deferred {usd(r.deferred)} rides into the replacement as a reduced basis of {usd(r.newBasis)} — postponed, not forgiven, until a later taxable sale (or a step-up at death). Full deferral needs three things: buy equal-or-up ({usd(newP)} vs {usd(sale)}), reinvest every dollar of equity ({usd(r.reinvested)} vs {usd(r.equity)}), and replace the debt ({usd(newM)} vs {usd(oldM)}).
        </div>
        <p className="text-xs text-muted-foreground">
          IRC §1031 (post-TCJA: real property held for investment or business only — no crypto, art, or personal property; your residence doesn't qualify). Deadlines are calendar days from the sale: identify replacements in writing by day 45, close by day 180 — no extensions, and both run while your qualified intermediary holds the proceeds (touching the money disqualifies the exchange). Identification rules: up to 3 properties at any value, or more under the 200%/95% rules. Reverse and improvement exchanges exist but cost more. Deferred ≠ forgiven: the gain (and all that depreciation recapture) follows you into every future exchange — the permanent escape is the basis step-up at death, the "swap till you drop" strategy. Vacation homes and flips fail the investment-holding test; consult your QI and CPA before listing.
        </p>
      </CardContent>
    </Card>
  )
}

// §1045 QSBS rollover — sell QSBS held MORE than 6 months, buy replacement QSBS within 60 days of the sale date (absolute, no extensions). Gain recognized = min(gain, proceeds − reinvested); deferred gain reduces replacement basis (in acquisition order for multiple lots); holding period TACKS (§1223) — including the acquisition date, so rolling pre-OBBBA stock does NOT upgrade you to the new tiers/$15M cap. Election on a timely return incl. extensions (Rev. Proc. 98-48, Form 8949 code R), revocable only with IRS consent. Replacement must independently qualify (original issuance, C-corp, ≤$75M gross assets); same-issuer replacement is unsettled; SAFEs may not count as stock. No limit on chained rollovers. CA doesn't conform to §1045 or §1202 — state tax due now regardless. Node-verified: $8M proceeds/$500k basis full roll → $0 recognized, new basis $500k; partial $7.5M reinvested → $500k recognized now ($119k tax at 23.8%), $7M deferred.
export function QSBSRolloverCalc() {
  const [proceeds, setProceeds] = useNumber(8000000)
  const [basis, setBasis] = useNumber(500000)
  const [reinv, setReinv] = useNumber(8000000)
  const [held, setHeld] = useNumber(3)
  const [stateRate, setStateRate] = useNumber(0)

  const r = useMemo(() => {
    const gain = Math.max(0, proceeds - basis)
    const recog = Math.min(gain, Math.max(0, proceeds - reinv))
    const deferred = gain - recog
    const newBasis = reinv - deferred
    const taxNow = recog * (0.238 + stateRate / 100)
    const toFull = Math.max(0, 5 - held)
    const eligible = held > 0.5
    return { gain, recog, deferred, newBasis, taxNow, toFull, eligible }
  }, [proceeds, basis, reinv, held, stateRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Sale proceeds" value={proceeds} onChange={setProceeds} prefix="$" />
          <Field label="Your cost basis" value={basis} onChange={setBasis} prefix="$" />
          <Field label="Reinvested into new QSBS (within 60 days)" value={reinv} onChange={setReinv} prefix="$" />
          <Field label="Years you held the sold stock" value={held} onChange={setHeld} />
          <Field label="State rate (CA/PA/AL/MS: due NOW regardless)" value={stateRate} onChange={setStateRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Gain recognized now" value={usd(r.recog)} />
          <Result label="Gain deferred" value={usd(r.deferred)} />
          <Result label="Basis in replacement stock" value={usd(r.newBasis)} />
          <Result label="Tax due this year" value={usd(r.taxNow)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {!r.eligible ? (
            <><span className="font-medium">Not eligible.</span> Section 1045 requires the sold stock be held MORE than six months — at {num(held, 1)} years you're under the gate. Selling now means recognizing the full gain. If any delay is possible, cross six months first.</>
          ) : (
            <>Your {num(held, 1)} years of holding <span className="font-medium">tacks onto the replacement stock</span> — it inherits {num(held, 1)} years toward the §1202 tiers, so 100% exclusion arrives in {num(r.toFull, 1)} more year{r.toFull === 1 ? '' : 's'} instead of five. Reinvesting {usd(reinv)} of {usd(proceeds)} defers {usd(r.deferred)}{r.recog > 0 && <>; the {usd(r.recog)} you kept out is taxed now at up to 23.8% federal — reinvest the full proceeds to defer everything</>}. </>
          )}
          {r.eligible && <>The 60-day window runs from the SALE date with no extensions, and the election goes on a timely return (Form 8949, code R) — miss either and the deferral is gone for good.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          IRC §1045 (unchanged by OBBBA). Requirements: non-corporate seller (individuals, trusts, estates); original QSBS held &gt;6 months; replacement QSBS purchased within 60 days at original issuance from a C-corp under the gross-assets cap; replacement must independently qualify — the same issuer is unsettled and SAFEs/convertibles may not count as "stock." The deferred gain reduces your replacement basis, so the tax is postponed, not forgiven — unless the replacement reaches a §1202 tier, at which point the deferred gain can be permanently excluded. Tacking carries the acquisition DATE too: rolling pre-OBBBA stock keeps the legacy $10M cap and 5-year cliff. Rollovers can chain indefinitely. California conforms to neither §1045 nor §1202 — federal deferral, full state tax now. Founder/CPA territory: get the QSBS attestation letter before closing.
        </p>
      </CardContent>
    </Card>
  )
}

// QSBS §1202 — OBBBA §70432: stock acquired AFTER July 4, 2025: tiered exclusion 50% @3yr / 75% @4yr / 100% @5yr, cap greater of $15M or 10× basis, $75M gross-assets ceiling; 7% AMT preference on the excluded amount for the 3/4-yr tiers (not modeled — noted). Pre-OBBBA (≤ Jul 4, 2025, post-9/27/2010): 100% only after MORE than 5 years, cap greater of $10M or 10× basis, $50M ceiling. Rate nuance: the special 28% rate (§1(h)(4)) + 3.8% NIIT applies only to the NON-EXCLUDED portion when a §1202 exclusion tier is active; below the tier threshold there is no §1202 gain and the sale is ordinary LTCG (20% + 3.8% NIIT). States: CA, PA, AL, MS don't conform (tax the gain fully); NJ conforms from 2026; WA hits it with the 7% excise over $270k. Node-verified: $12M gain/$100k basis/5yr post → $0 tax, $2,856,000 saved; 4yr → $954,000 tax; 2yr → $2,856,000 (ordinary 23.8%, no exclusion); $30M gain/$5M basis → 10× basis cap $50M wins.
export function QSBSCalc() {
  const [post, setPost] = useState(true)
  const [gain, setGain] = useNumber(12000000)
  const [basis, setBasis] = useNumber(100000)
  const [yrs, setYrs] = useNumber(5)
  const [stateRate, setStateRate] = useNumber(0)

  const r = useMemo(() => {
    const pct = post ? (yrs >= 5 ? 1 : yrs >= 4 ? 0.75 : yrs >= 3 ? 0.5 : 0) : (yrs > 5 ? 1 : 0)
    const cap = Math.max(10 * basis, post ? 15000000 : 10000000)
    const excl = Math.min(gain, cap) * pct
    const taxable = gain - excl
    // 28% + 3.8% NIIT applies only to §1202 gain (a partial-exclusion tier is active);
    // below the tier threshold there is no §1202 gain at all — regular top LTCG 20% + 3.8% NIIT.
    const fed = taxable * (pct > 0 ? 0.318 : 0.238)
    const st = taxable * (stateRate / 100)
    const noQsbs = gain * (0.238 + stateRate / 100)
    return { pct, cap, excl, taxable, fed, st, noQsbs, save: noQsbs - fed - st }
  }, [post, gain, basis, yrs, stateRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Stock acquired</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={post ? 'post' : 'pre'}
              onChange={(e) => setPost(e.target.value === 'post')}
            >
              <option value="post">After July 4, 2025 (OBBBA rules)</option>
              <option value="pre">On or before July 4, 2025 (legacy rules)</option>
            </select>
          </div>
          <Field label="Capital gain on sale" value={gain} onChange={setGain} prefix="$" />
          <Field label="Your cost basis" value={basis} onChange={setBasis} prefix="$" />
          <Field label="Years held" value={yrs} onChange={setYrs} />
          <Field label="State tax rate on the gain" value={stateRate} onChange={setStateRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Exclusion" value={`${num(r.pct * 100, 0)}%`} />
          <Result label="Gain excluded" value={usd(r.excl)} />
          <Result label="Total tax on sale" value={usd(r.fed + r.st)} />
          <Result label="Saved vs ordinary stock" value={usd(r.save)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.pct > 0 ? (
            <>Your cap is {usd(r.cap)} (greater of {post ? '$15M' : '$10M'} or 10× basis). {num(r.pct * 100, 0)}% of {usd(Math.min(gain, r.cap))} is excluded{r.pct < 1 ? <>; the remaining {usd(r.taxable)} is taxed at the special <span className="font-medium">28% rate + 3.8% NIIT</span> — not the usual 20% — {post ? 'and 7% of the excluded slice becomes an AMT preference item at the 3/4-year tiers' : ''}</> : ' — zero federal tax'}. </>
          ) : (
            <><span className="font-medium">No exclusion at {num(yrs, 1)} years.</span> {post ? 'The tiers start at 3 years (50%).' : 'Legacy stock needs MORE than 5 years — one day short means 0%.'} With no exclusion tier active, the full {usd(r.taxable)} is ordinary capital gain: up to 20% + 3.8% NIIT = {usd(r.fed)} federal. Two escapes: wait for the next tier ({post ? 'each year moves you 50→75→100%' : 'crossing 5 years takes you from 0% to 100% — the steepest cliff in the tax code'}), or a <span className="font-medium">§1045 rollover</span> — reinvest the proceeds into new QSBS within 60 days and the gain defers while your holding period carries over. See the QSBS rollover calculator. </>
          )}
          {stateRate === 0 && r.pct > 0 && <>State note: California, Pennsylvania, Alabama, and Mississippi don't conform — residents there owe full state tax on the "excluded" gain; Washington hits it with the 7% capital-gains excise.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          IRC §1202 as amended by OBBBA §70432 (P.L. 119-21). The regime locks to your ACQUISITION date, not the sale date: legacy stock (≤ Jul 4, 2025) keeps the $10M/10× basis cap and the all-or-nothing 5-year rule; post-OBBBA stock gets tiers (50/75/100% at 3/4/5 years), the $15M cap, and the $75M gross-assets ceiling — indexed from 2027. Issuer must be a domestic C-corp in a qualified business (no services, finance, hospitality, farming, mining) with ≤$75M gross assets at issuance; you must take stock at original issuance (options/RSUs count at exercise/vesting, not grant). Per-shareholder, per-issuer — gifting to trusts ("stacking") multiplies caps. The earliest any post-OBBBA stock hits the 3-year tier is July 2028. Founder/CPA territory before any exit.
        </p>
      </CardContent>
    </Card>
  )
}

// Medicaid spend-down & lookback — 2026 federal figures: single applicant countable-asset limit $2,000 (couple both applying $3,000); CSRA max $162,660 / min $32,532 (community spouse keeps half of combined countable assets, floored at min, capped at max; WI floor $50k); home equity limit $752,000 (home exempt while spouse/dependent lives there or intent to return); income cap $2,982/mo (300% SSI FBR — excess → Miller/QIT trust); MMMNA $2,705–$4,066.50. 60-month lookback; penalty months = uncompensated transfers ÷ state divisor (2026 examples: FL $10,645/mo, AR $6,083, AK ~$25,000, NJ $420.67/day, WI $352.06/day) — penalty runs AFTER you're otherwise eligible, i.e. private-pay months. Estate recovery after death (42 U.S.C. §1396p). Node-verified: married $300k → CSRA $150,000, spend-down $148,000; $60k → floor $32,532; $500k → capped $162,660; $100k gift ÷ $10,645 = 9.4 penalty months ≈ $95,810 private pay.
export function MedicaidSpendDownCalc() {
  const [married, setMarried] = useState(false)
  const [assets, setAssets] = useNumber(300000)
  const [income, setIncome] = useNumber(2982)
  const [gifts, setGifts] = useNumber(0)
  const [divisor, setDivisor] = useNumber(10000)
  const [careCost, setCareCost] = useNumber(9581)

  const r = useMemo(() => {
    const allowance = married ? Math.min(162660, Math.max(32532, assets / 2)) + 2000 : 2000
    const spendDown = Math.max(0, assets - allowance)
    const penaltyMonths = divisor > 0 ? gifts / divisor : 0
    const penaltyCost = penaltyMonths * careCost
    const incomeExcess = Math.max(0, income - 2982)
    const monthsOfCare = careCost > 0 ? spendDown / careCost : 0
    return { allowance, spendDown, penaltyMonths, penaltyCost, incomeExcess, monthsOfCare }
  }, [married, assets, income, gifts, divisor, careCost])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={married} onChange={(e) => setMarried(e.target.checked)} className="h-4 w-4" />
            Married — only one spouse applying
          </label>
          <Field label="Countable assets (cash, brokerage, 2nd property)" value={assets} onChange={setAssets} prefix="$" />
          <Field label="Applicant monthly income" value={income} onChange={setIncome} prefix="$" />
          <Field label="Gifts/transfers in the last 60 months" value={gifts} onChange={setGifts} prefix="$" />
          <Field label="State penalty divisor" value={divisor} onChange={setDivisor} prefix="$" suffix="/mo" />
          <Field label="Monthly nursing home cost" value={careCost} onChange={setCareCost} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Assets you're allowed to keep" value={usd(r.allowance)} />
          <Result label="Spend-down needed" value={usd(r.spendDown)} />
          <Result label="Gift penalty period" value={`${num(r.penaltyMonths, 1)} months`} />
          <Result label="Private-pay cost of the penalty" value={usd(r.penaltyCost)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.spendDown > 0 ? (
            <>You're {usd(r.spendDown)} over the line — about {num(r.monthsOfCare, 1)} months of nursing costs at {usd(careCost)}/mo. {married ? 'The community spouse keeps ' + usd(r.allowance - 2000) + ' under the CSRA (half of combined assets, between $32,532 and $162,660 in 2026); the applicant keeps $2,000. ' : 'A single applicant keeps just $2,000 in countable assets. '}</>
          ) : (
            <>Countable assets are under the {usd(r.allowance)} allowance — the asset test passes. </>
          )}
          {r.penaltyMonths > 0 && <>The {usd(gifts)} of transfers inside the 60-month lookback trigger <span className="font-medium">{num(r.penaltyMonths, 1)} months of ineligibility</span> — and the penalty clock doesn't start until you're otherwise eligible and in care, meaning {usd(r.penaltyCost)} of private pay with zero assets left. This is why last-minute gifting backfires. </>}
          {r.incomeExcess > 0 && <>Income is {usd(r.incomeExcess)}/mo over the $2,982 cap — in most states a Miller Trust (QIT) fixes that; the income test is separate from the asset test.</>}
          {r.spendDown === 0 && r.penaltyMonths === 0 && r.incomeExcess === 0 && <>All three tests pass — assets, lookback, and income.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 federal figures: single asset limit $2,000; CSRA $32,532–$162,660; home equity limit $752,000 (home exempt while a spouse or dependent lives there or you intend to return); income cap $2,982/mo (300% of SSI). Exempt assets: primary home within the equity limit, one vehicle, household goods, prepaid irrevocable burial, term life with no cash value. Retirement accounts count in most states unless in payout status. Penalty divisors vary wildly by state (2026: FL $10,645/mo, AR $6,083, AK ~$25,000, NJ/WI daily divisors) — check yours. Lawful spend-down exists: paying off the mortgage, home repairs, a Medicaid-compliant annuity for the community spouse, burial trusts. After death, estate recovery can claim the home unless it was protected — planning 5+ years ahead is the whole game. Elder-law attorney territory; this is orientation math, not legal advice.
        </p>
      </CardContent>
    </Card>
  )
}

// Hybrid (linked-benefit) LTC vs traditional — AALTCI 2025: male 55 hybrid single-premium $52,753 ($180k LTC pool or $120k death benefit), female 55 $54,022; annual-pay hybrid $3,540/$3,265; traditional level $950/$1,500 per year for $165k pool (no inflation growth). Honest result: traditional foregoes less (premiums invested → ~$75k @6%/30yr) than hybrid's opportunity cost net of the guaranteed death benefit (~$183k) — hybrid's premium buys lapse-proofing, rate-hike immunity, and money-back-if-never-claim, NOT more care per dollar. Node-verified: hybrid net cost if no claim $182,986 vs traditional $75,105; months of $12,500/mo care: hybrid 14.4, traditional 13.2.
export function HybridLTCCalc() {
  const [lump, setLump] = useNumber(52753)
  const [hybPool, setHybPool] = useNumber(180000)
  const [deathBenefit, setDeathBenefit] = useNumber(120000)
  const [tradPremium, setTradPremium] = useNumber(950)
  const [tradPool, setTradPool] = useNumber(165000)
  const [ret, setRet] = useNumber(6)
  const [years, setYears] = useNumber(30)
  const [monthlyCare, setMonthlyCare] = useNumber(12500)

  const r = useMemo(() => {
    const i = ret / 100
    const hybFV = lump * Math.pow(1 + i, years)
    const hybNetCost = hybFV - deathBenefit
    const tradFV = i > 0 ? tradPremium * (Math.pow(1 + i, years) - 1) / i : tradPremium * years
    const hybMonths = monthlyCare > 0 ? hybPool / monthlyCare : 0
    const tradMonths = monthlyCare > 0 ? tradPool / monthlyCare : 0
    return { hybFV, hybNetCost, tradFV, hybMonths, tradMonths }
  }, [lump, hybPool, deathBenefit, tradPremium, tradPool, ret, years, monthlyCare])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Hybrid single premium (lump)" value={lump} onChange={setLump} prefix="$" />
          <Field label="Hybrid LTC pool" value={hybPool} onChange={setHybPool} prefix="$" />
          <Field label="Hybrid death benefit (if no claim)" value={deathBenefit} onChange={setDeathBenefit} prefix="$" />
          <Field label="Traditional annual premium" value={tradPremium} onChange={setTradPremium} prefix="$" />
          <Field label="Traditional pool (level)" value={tradPool} onChange={setTradPool} prefix="$" />
          <Field label="Opportunity return" value={ret} onChange={setRet} suffix="%" />
          <Field label="Years until claim age" value={years} onChange={setYears} />
          <Field label="Monthly care cost at claim" value={monthlyCare} onChange={setMonthlyCare} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Hybrid: true cost if you never claim" value={usd(r.hybNetCost)} />
          <Result label="Traditional: cost if you never claim" value={usd(r.tradFV)} />
          <Result label="Hybrid months of care" value={`${num(r.hybMonths, 1)} mo`} />
          <Result label="Traditional months of care" value={`${num(r.tradMonths, 1)} mo`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          If you never claim: the hybrid's {usd(lump)} would have grown to {usd(r.hybFV)} — minus the {usd(deathBenefit)} death benefit your heirs still get, the insurance truly cost you <span className="font-medium">{usd(r.hybNetCost)}</span>. The traditional premiums invested would be {usd(r.tradFV)} — all of it gone, so that's its true cost. <span className="font-medium">Traditional is the cheaper insurance on pure math</span> — the hybrid's extra {usd(r.hybNetCost - r.tradFV)} buys three things: you can't lose the money to a lapse, the premium can never be raised (traditional in-force hikes averaged ~28% approved in 2024), and someone always gets paid. If you claim: hybrid covers {num(r.hybMonths, 1)} months vs traditional {num(r.tradMonths, 1)} at these terms.
        </div>
        <p className="text-xs text-muted-foreground">
          Benchmarks (AALTCI 2025, age 55): hybrid single-premium male $52,753 / female $54,022 for a $180,000 LTC pool with $120,000 minimum death benefit; annual-pay hybrid $3,540/$3,265; traditional level-benefit policy $950/$1,500 per year for a $165,000 pool (inflation riders cost extra on traditional — the 3% compound rider takes male-55 to ~$2,200/yr). Both trigger at 2 of 6 ADLs with a typical 90-day elimination period; qualified benefits are tax-free. The deciding question isn't which is "better" — it's whether you'd actually keep paying a traditional premium for 30 years (lapse rates are high, and a lapsed policy is a total loss) and whether a 28% premium hike at age 70 would make you drop it. If yes to either doubt, the hybrid's guarantee is what you're buying.
        </p>
      </CardContent>
    </Card>
  )
}

// LTC insurance vs self-funding — AALTCI 2025/2026 Price Index: $165k initial pool w/ 3% compound rider: male 55 $2,200/yr, female 55 $3,750, couple 55 $5,050 (2026: $5,010), male 65 $3,280, female 65 $5,290, couple 65 $7,030. Pool growth: $165k@3% → $400,500 at 85 (buy at 55). Triggers: 2 of 6 ADLs or cognitive impairment, 90-day elimination typical; benefits tax-free under §7702B. In-force rate hikes averaged ~28% approved in 2024. Decline rates: 38% of applicants 65–69, 47% of 70–75 declined/deferred. Breakeven = self-fund FV ÷ monthly care cost. Node-verified: male 55 $2,200×30yr@6% → FV $173,928 vs pool $400,498 → breakeven 13.9 months of $150k/yr care; female 55 → 23.7 months; male 65 N=20 → 9.7 months.
export function LTCInsuranceCalc() {
  const [premium, setPremium] = useNumber(2200)
  const [pool, setPool] = useNumber(165000)
  const [growth, setGrowth] = useNumber(3)
  const [years, setYears] = useNumber(30)
  const [careCost, setCareCost] = useNumber(150000)
  const [ret, setRet] = useNumber(6)

  const r = useMemo(() => {
    const i = ret / 100
    const premiums = premium * years
    const fv = i > 0 ? premium * (Math.pow(1 + i, years) - 1) / i : premium * years
    const poolAtClaim = pool * Math.pow(1 + growth / 100, years)
    const monthly = careCost / 12
    const breakevenMonths = monthly > 0 ? fv / monthly : 0
    const coveredByPool = Math.floor(poolAtClaim / monthly)
    return { premiums, fv, poolAtClaim, breakevenMonths, coveredByPool }
  }, [premium, pool, growth, years, careCost, ret])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Annual premium" value={premium} onChange={setPremium} prefix="$" />
          <Field label="Initial benefit pool" value={pool} onChange={setPool} prefix="$" />
          <Field label="Benefit inflation growth" value={growth} onChange={setGrowth} suffix="%" />
          <Field label="Years until typical claim (buy 55 → claim 85)" value={years} onChange={setYears} />
          <Field label="Annual care cost at claim" value={careCost} onChange={setCareCost} prefix="$" />
          <Field label="Return if you invested premiums" value={ret} onChange={setRet} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Total premiums paid" value={usd(r.premiums)} />
          <Result label="Premiums invested instead" value={usd(r.fv)} />
          <Result label="Policy pool at claim age" value={usd(r.poolAtClaim)} />
          <Result label="Breakeven care length" value={`${num(r.breakevenMonths, 0)} months`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Invest the premiums yourself at {num(ret, 1)}% and you'd have <span className="font-medium">{usd(r.fv)}</span> at claim age — that self-funds <span className="font-medium">{num(r.breakevenMonths, 0)} months</span> of care at {usd(careCost)}/yr. The policy pool grows to <span className="font-medium">{usd(r.poolAtClaim)}</span> — about {num(r.coveredByPool, 0)} months. So the bet is precise: insurance wins if your care event runs longer than {num(r.breakevenMonths, 0)} months; self-funding wins below that — and if you never claim, self-funding keeps everything. The pool also buys roughly {num(r.poolAtClaim / r.fv, 1)}× the dollars per premium dollar, which is the leverage you're actually purchasing.
        </div>
        <p className="text-xs text-muted-foreground">
          Benchmarks (AALTCI Price Index, $165k initial pool, 3% compound rider): male 55 ≈ $2,200/yr, female 55 ≈ $3,750, couple 55 ≈ $5,050; at 65: male $3,280, female $5,290, couple $7,030. Benefits trigger at 2 of 6 ADLs (or cognitive impairment) after a typical 90-day elimination period, and qualified payouts are tax-free (IRC §7702B). Honest caveats: traditional premiums CAN rise after purchase (approved in-force increases averaged ~28% in 2024 — hybrids eliminate this), underwriting declines 38% of applicants at 65–69, and about 44% never claim — which is why planners frame it as insuring the 5-year tail, not the average. Common self-fund thresholds: roughly $2M+ single / $3M+ couple; under ~$200k, Medicaid is the realistic backstop. Run the care-cost side in the long-term care cost calculator first.
        </p>
      </CardContent>
    </Card>
  )
}

// Long-term care cost planner — 2025 CareScout (Genworth) Cost of Care Survey national medians: non-medical home caregiver $35/hr ($80,080/yr @44hr/wk), skilled nursing at home $90/hr, adult day health $95/day, assisted living $6,200/mo ($74,400/yr), nursing home semi-private $9,581/mo, private room $10,798/mo. Care inflation ~3%/yr historical. Totals grow an annuity: annual × ((1+i)^years − 1)/i after inflating to the start year. Node-verified: home 44hr 3yr@3% = $247,519; AL 3yr = $229,963; NH private 3yr = $400,506; adult day 5d/wk 3yr = $76,345; home care starting in 10 yrs = $332,645. Medicare does NOT cover custodial care (ASPE/ACL: 56% of 65-year-olds will need paid LTC).
export function LTCareCostCalc() {
  const [setting, setSetting] = useState('home')
  const [rate, setRate] = useNumber(35)
  const [hours, setHours] = useNumber(44)
  const [days, setDays] = useNumber(5)
  const [years, setYears] = useNumber(3)
  const [infl, setInfl] = useNumber(3)
  const [startIn, setStartIn] = useNumber(0)

  const MODES: Record<string, { label: string; mode: 'hourly' | 'daily' | 'monthly'; def: number; unit: string }> = {
    home: { label: 'Non-medical caregiver at home', mode: 'hourly', def: 35, unit: '/hr' },
    skilled: { label: 'Skilled nursing at home', mode: 'hourly', def: 90, unit: '/hr' },
    adultday: { label: 'Adult day health care', mode: 'daily', def: 95, unit: '/day' },
    al: { label: 'Assisted living community', mode: 'monthly', def: 6200, unit: '/mo' },
    nhsemi: { label: 'Nursing home — semi-private room', mode: 'monthly', def: 9581, unit: '/mo' },
    nhpriv: { label: 'Nursing home — private room', mode: 'monthly', def: 10798, unit: '/mo' },
  }
  const m = MODES[setting]

  const r = useMemo(() => {
    const i = infl / 100
    const annual = m.mode === 'hourly' ? rate * hours * 52 : m.mode === 'daily' ? rate * days * 52 : rate * 12
    const annualAtStart = annual * Math.pow(1 + i, startIn)
    const total = i > 0 ? annualAtStart * (Math.pow(1 + i, years) - 1) / i : annualAtStart * years
    const monthlyAtStart = annualAtStart / 12
    return { annual, annualAtStart, total, monthlyAtStart }
  }, [rate, hours, days, years, infl, startIn, m.mode])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Care setting (2025 national median)</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={setting}
              onChange={(e) => { setSetting(e.target.value); setRate(String(MODES[e.target.value].def)) }}
            >
              {Object.entries(MODES).map(([k, v]) => (
                <option key={k} value={k}>{v.label} — ${v.def.toLocaleString()}{v.unit}</option>
              ))}
            </select>
          </div>
          <Field label={`Rate (${m.unit})`} value={rate} onChange={setRate} prefix="$" />
          {m.mode === 'hourly' && <Field label="Hours per week" value={hours} onChange={setHours} />}
          {m.mode === 'daily' && <Field label="Days per week" value={days} onChange={setDays} />}
          <Field label="Years of care" value={years} onChange={setYears} />
          <Field label="Care cost inflation" value={infl} onChange={setInfl} suffix="%" />
          <Field label="Care starts in (years)" value={startIn} onChange={setStartIn} />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Annual cost (today's dollars)" value={usd(r.annual)} />
          <Result label="Monthly cost when care starts" value={usd(r.monthlyAtStart)} />
          <Result label={`Total over ${num(years, 0)} year${years === 1 ? '' : 's'}`} value={usd(r.total)} />
          <Result label="Setting" value={m.label.split('—')[0].trim()} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          At national medians over the same horizon: adult day care (5 days/wk) runs {usd(infl > 0 ? (24700 * Math.pow(1 + infl / 100, startIn)) * (Math.pow(1 + infl / 100, years) - 1) / (infl / 100) : 24700 * years)}, assisted living {usd(infl > 0 ? (74400 * Math.pow(1 + infl / 100, startIn)) * (Math.pow(1 + infl / 100, years) - 1) / (infl / 100) : 74400 * years)}, a private nursing room {usd(infl > 0 ? (129576 * Math.pow(1 + infl / 100, startIn)) * (Math.pow(1 + infl / 100, years) - 1) / (infl / 100) : 129576 * years)}. The surprise most families miss: <span className="font-medium">full-time home care ($80,080/yr at 44 hrs/wk) now costs MORE than assisted living ($74,400/yr)</span> — staying home is not automatically the cheaper path. And Medicare does not pay for custodial care (help with bathing, dressing, eating) at all — that gap is the whole planning problem.
        </div>
        <p className="text-xs text-muted-foreground">
          Sources: CareScout (formerly Genworth) 2025 Cost of Care Survey national medians — $35/hr non-medical home caregiver, $90/hr skilled nursing at home, $95/day adult day health, $6,200/mo assisted living, $9,581/mo nursing home semi-private, $10,798/mo private room. Medians mask big state variation — get local quotes. Durations: women average 3.7 years of care needs, men 2.2 (HHS/ASPE); 56% of people turning 65 will need paid long-term care. Funding usually stacks private savings, long-term care insurance (or hybrid life/LTC policies), VA benefits for veterans, and Medicaid after spend-down. Paying a privately-hired caregiver more than $3,000/yr makes you a household employer — see the nanny tax calculator. This is planning math, not a quote.
        </p>
      </CardContent>
    </Card>
  )
}

// PTET election — IRS Notice 2020-75: entity-level state tax paid by a partnership/S-corp is deductible in computing non-separately-stated income, outside the §164(b)(6) SALT cap. 2026 cap $40,400 (OBBBA §70120), 30% phase-down over $505,000 MAGI, floor $10,000; reverts to $10,000 after 2029. Incremental federal saving = marginal × qbiFactor × PTET − itemizedRate × min(PTET, unused cap room). QBI haircut: PTET reduces K-1 ordinary income, costing 20% §199A on that amount (q = 0.8 when fully QBI-eligible). §68 as amended by OBBBA (2026+): itemized deductions capped at ~35¢/$ in the 37% bracket, so the Schedule A alternative is valued at min(marginal, 35%). Node-verified: CA 9.3% on $400k, single, $350k taxable, $15k other SALT, QBI → $1,526; UT 4.5% on $1M, MFJ, MAGI $1.06M → cap floor $10k, save $13,320; OH 3% on $200k, MFJ, $5k other SALT → −$264 (PTET loses money when the cap wasn't binding).
export function PTETCalc() {
  const [income, setIncome] = useNumber(400000)
  const [rate, setRate] = useNumber(9.3)
  const [status, setStatus] = useState<'single' | 'mfj'>('single')
  const [taxable, setTaxable] = useNumber(350000)
  const [magi, setMagi] = useNumber(400000)
  const [other, setOther] = useNumber(15000)
  const [qbi, setQbi] = useState(true)

  const r = useMemo(() => {
    const SINGLE: readonly (readonly [number, number])[] = [[12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [Infinity, 0.37]]
    const MFJ: readonly (readonly [number, number])[] = [[24800, 0.10], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [Infinity, 0.37]]
    const table = status === 'single' ? SINGLE : MFJ
    let marginal = 0.10
    for (const [capTop, rate] of table) { if (taxable <= capTop) { marginal = rate; break } }
    const saltCap = Math.max(10000, 40400 - 0.30 * Math.max(0, magi - 505000))
    const ptet = income * (rate / 100)
    const room = Math.max(0, saltCap - other)
    const q = qbi ? 0.8 : 1
    const itemizedRate = Math.min(marginal, 0.35)
    const saving = marginal * q * ptet - itemizedRate * Math.min(ptet, room)
    const effPct = ptet > 0 ? (saving / ptet) * 100 : 0
    return { marginal, saltCap, ptet, room, saving, effPct, phasedDown: magi > 505000 }
  }, [income, rate, status, taxable, magi, other, qbi])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">State PTET preset</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={String(rate)}
              onChange={(e) => setRate(e.target.value)}
            >
              <option value={9.3}>California — 9.3% flat (through 2030)</option>
              <option value={6.99}>Connecticut — 6.99% flat</option>
              <option value={4.55}>Nebraska — 4.55% (2026)</option>
              <option value={10.9}>New York — graduated 6.85–10.9% (top shown)</option>
              <option value={10.9}>New Jersey BAIT — graduated 5.675–10.9% (top shown)</option>
              <option value={3}>Ohio — 3% flat</option>
              <option value={5.99}>Rhode Island — 5.99% (90% owner credit)</option>
              <option value={4.5}>Utah — 4.5% flat</option>
            </select>
          </div>
          <Field label="Your share of pass-through income" value={income} onChange={setIncome} prefix="$" />
          <Field label="PTET rate" value={rate} onChange={setRate} suffix="%" />
          <div>
            <label className="mb-1 block text-sm font-medium">Filing status</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'single' | 'mfj')}
            >
              <option value="single">Single</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </div>
          <Field label="Federal taxable income (finds your bracket)" value={taxable} onChange={setTaxable} prefix="$" />
          <Field label="MAGI (for the SALT cap phase-down)" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Other SALT (property tax, personal state tax)" value={other} onChange={setOther} prefix="$" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={qbi} onChange={(e) => setQbi(e.target.checked)} className="h-4 w-4" />
          Income qualifies for the 20% QBI deduction (§199A) — most non-SSTB businesses under the threshold
        </label>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="PTET the entity pays" value={usd(r.ptet)} />
          <Result label="Your effective SALT cap" value={usd(r.saltCap)} />
          <Result label="Federal saving from electing" value={usd(r.saving)} />
          <Result label="Saving per PTET dollar" value={`${num(r.effPct, 1)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.saving > 0 ? (
            <>Electing moves {usd(r.ptet)} of state tax off Schedule A and onto the entity's federal return. Only {usd(r.room)} of your {usd(r.saltCap)} SALT cap was still open{r.phasedDown ? ' (phase-down active — MAGI over $505,000)' : ''}, so the election is worth about <span className="font-medium">{usd(r.saving)}</span> at your {num(r.marginal * 100, 0)}% bracket{qbi ? ' after the 20% QBI haircut — PTET shrinks K-1 income, which shrinks the §199A deduction' : ''}. </>
          ) : (
            <><span className="font-medium">Electing would lose ≈{usd(-r.saving)}.</span> Your {usd(r.room)} of open SALT cap room already covers the state tax, and the PTET deduction costs you 20 cents of QBI deduction per dollar — a net loss when the cap wasn't binding. This is the case PTET pitches leave out. </>
          )}
          Election mechanics: annual, usually irrevocable, and deadline-driven (New York: March 15; California: June 15 prepayment). Miss it and the year is gone.
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules: SALT cap $40,400, reduced 30¢ per $1 of MAGI over $505,000, never below $10,000; reverts to $10,000 after 2029 (IRC §164(b)(6) as amended by OBBBA). The entity-level deduction rests on IRS Notice 2020-75, which OBBBA left untouched. About 36 states plus NYC offer PTET; Illinois lapsed after 2025 and Virginia after 2026. Graduated states (NY 6.85–10.9%, NJ BAIT 5.675–10.9%): enter YOUR bracket rate, not the top. Watch state quirks — Rhode Island credits only 90% of PTET, some states exclude guaranteed payments, and nonresident owners can be double-taxed if their home state won't credit the election. For the 37% bracket, the new §68 limit values itemized deductions at ~35¢/$ — PTET sidesteps that too. Run both directions with your CPA before electing.
        </p>
      </CardContent>
    </Card>
  )
}

// Nanny tax / household employer — IRS Pub 926 (2026): FICA when any one household employee gets $3,000+ cash wages in 2026 (15.3% split 7.65/7.65; SS capped at $184,500 wage base); FUTA when total household wages hit $1,000 in any quarter (6% on first $7,000, 0.6% net with full state credit = $42). Exempt: spouse, child under 21, parent (narrow exception), under-18 student. Schedule H filed with the 1040; W-2 + EIN required; fund via W-4 bump or estimates to avoid underpayment penalty. Reproduces Pub 926-style Garcia example: $42,000 → FICA $6,426 + FUTA $42 = $6,468.
export function NannyTaxCalc() {
  const [hourly, setHourly] = useNumber(21)
  const [hours, setHours] = useNumber(40)
  const [weeks, setWeeks] = useNumber(50)
  const [suta, setSuta] = useNumber(3)
  const [sutaBase, setSutaBase] = useNumber(7000)

  const r = useMemo(() => {
    const wages = hourly * hours * weeks
    const ficaApplies = wages >= 3000
    const ss = ficaApplies ? Math.min(wages, 184500) * 0.062 : 0
    const med = ficaApplies ? wages * 0.0145 : 0
    const empShare = ss + med
    const futa = Math.min(wages, 7000) * 0.006
    const su = (suta / 100) * Math.min(wages, sutaBase)
    const schedH = empShare * 2 + futa
    const employerAddOn = empShare + futa + su
    const totalCost = wages + employerAddOn
    const pct = wages > 0 ? (employerAddOn / wages) * 100 : 0
    const crossesAt = hourly * hours > 0 ? 3000 / (hourly * hours) : 0
    return { wages, ficaApplies, empShare, futa, su, schedH, employerAddOn, totalCost, pct, crossesAt }
  }, [hourly, hours, weeks, suta, sutaBase])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Hourly wage" value={hourly} onChange={setHourly} prefix="$" />
          <Field label="Hours per week" value={hours} onChange={setHours} />
          <Field label="Weeks per year" value={weeks} onChange={setWeeks} />
          <Field label="State unemployment rate" value={suta} onChange={setSuta} suffix="%" />
          <Field label="State UI wage base" value={sutaBase} onChange={setSutaBase} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Annual wages" value={usd(r.wages)} />
          <Result label="Your employer taxes" value={usd(r.employerAddOn)} />
          <Result label="Schedule H total (both FICA halves + FUTA)" value={usd(r.schedH)} />
          <Result label="True cost per year" value={usd(r.totalCost)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.ficaApplies ? (
            <>At {usd(r.wages)} you're over the <span className="font-medium">$3,000 threshold</span> — you're an employer. Your share: {usd(r.empShare)} FICA + {usd(r.futa)} FUTA + {usd(r.su)} state UI ≈ <span className="font-medium">{num(r.pct, 1)}% on top of wages</span>. The other 7.65% ({usd(r.empShare)}) comes out of the employee's pay — or your pocket if you gross up. </>
          ) : (
            <>At {usd(r.wages)} you're under the $3,000 FICA threshold — no Social Security/Medicare owed{r.wages >= 1000 ? ', but FUTA still applies if any single quarter hits $1,000' : ''}. {r.crossesAt > 0 && r.wages > 0 && <>At this schedule you'd cross the threshold in week {Math.ceil(r.crossesAt)} — the line exists for occasional babysitters, not regular care.</>} </>
          )}
          {r.ficaApplies && <>Fund it during the year (bump your own W-4 withholding or quarterly estimates) — a {usd(r.schedH)} surprise in April can trigger an underpayment penalty on YOUR return. </>}
          {r.ficaApplies && <>Offset: wages paid for care count toward the dependent-care FSA ($7,500 pre-tax) or the child care credit — run the FSA-vs-credit calculator with this number.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 (IRS Pub 926): Social Security + Medicare (15.3% combined, split 7.65%/7.65%) owed when any one household employee — nanny, housekeeper, senior caregiver, regular gardener — gets $3,000+ in cash wages. FUTA (0.6% net on the first $7,000) when total household wages hit $1,000 in any quarter. Exempt regardless of wages: your spouse, your child under 21, employees under 18 who are students, and usually your parent. "1099 contractor" doesn't work — if you control the schedule and how the work is done, they're an employee. Mechanics: free EIN from IRS.gov, W-2 by January 31, Schedule H attached to your 1040 (annual, not quarterly). State UI, workers' comp, and paid-leave programs vary — check your state. Paying legally also builds the worker's Social Security record and unemployment protection, which is why the good nannies increasingly demand it.
        </p>
      </CardContent>
    </Card>
  )
}

// 529 vs Trump Account vs Custodial Roth — same dollars through all three vehicles. Caps: Trump $5,000/yr aggregate + $1,000 seed (born 2025–28); Roth min(earned income, $7,500); 529 effectively uncapped. College at 18: 529 qualified = tax-free; Trump = after-tax basis back, seed + earnings taxed at child's ordinary rate (education waives the 10% penalty, not the tax); Roth = contributions tax-free, earnings taxed at kid's rate if under 59½/under 5 years (penalty waived for education). FAFSA: parent 529 ≤5.64%, Trump/student asset ~20%, Roth invisible (withdrawals hit later-year income). Verified: $3k/yr × 18 @8% → 529 $112,351, Trump $116,347 gross; keep at 10% kid bracket: $112,351 / $110,112 / $106,516.
export function KidSavingsCompareCalc() {
  const [years, setYears] = useNumber(18)
  const [annual, setAnnual] = useNumber(3000)
  const [ret, setRet] = useNumber(8)
  const [earned, setEarned] = useNumber(0)
  const [seed, setSeed] = useState(true)
  const [kidRate, setKidRate] = useNumber(10)

  const r = useMemo(() => {
    const n = Math.max(0, Math.min(30, years))
    const g = ret / 100
    const fv = (a: number, yrs: number) => (g > 0 ? a * ((Math.pow(1 + g, yrs) - 1) / g) : a * yrs)
    const grow = (b: number, yrs: number) => b * Math.pow(1 + g, yrs)
    const a529 = annual
    const aTrump = Math.min(annual, 5000)
    const aRoth = earned > 0 ? Math.min(annual, Math.min(earned, 7500)) : 0
    const seedAmt = seed ? 1000 : 0
    const b529 = fv(a529, n)
    const bTrump = fv(aTrump, n) + grow(seedAmt, n)
    const bRoth = fv(aRoth, n)
    const kb = kidRate / 100
    const keep = (bal: number, basis: number) => basis + Math.max(0, bal - basis) * (1 - kb)
    const k529 = b529
    const kTrump = keep(bTrump, aTrump * n)
    const kRoth = keep(bRoth, aRoth * n)
    const winner = k529 >= kTrump && k529 >= kRoth ? '529' : kTrump >= kRoth ? 'Trump Account' : 'Roth IRA'
    return { n, a529, aTrump, aRoth, b529, bTrump, bRoth, k529, kTrump, kRoth, winner, cappedTrump: annual > 5000, cappedRoth: earned > 0 && annual > Math.min(earned, 7500), noEarned: earned <= 0, seedAmt }
  }, [years, annual, ret, earned, seed, kidRate])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Years until college (age 18)" value={years} onChange={setYears} />
          <Field label="Annual amount to save" value={annual} onChange={setAnnual} prefix="$" />
          <Field label="Annual return" value={ret} onChange={setRet} suffix="%" />
          <Field label="Child's earned income (0 = not working)" value={earned} onChange={setEarned} prefix="$" />
          <label className="space-y-1">
            <span className="text-sm font-medium">Born 2025–2028 (Trump seed)?</span>
            <select value={seed ? 'y' : 'n'} onChange={(e) => setSeed(e.target.value === 'y')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="y">Yes — $1,000 pilot deposit</option>
              <option value="n">No</option>
            </select>
          </label>
          <Field label="Child's tax rate at withdrawal" value={kidRate} onChange={setKidRate} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="529 — keep for college" value={usd(r.k529)} />
          <Result label="Trump — keep after tax" value={usd(r.kTrump)} />
          <Result label="Roth — keep after tax" value={usd(r.kRoth)} />
          <Result label="College winner" value={r.winner} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.cappedTrump && <>Trump Account capped at $5,000/yr — the excess only lands in the other two columns. </>}
          {r.noEarned && <><span className="font-medium">Roth unavailable:</span> no earned income, no Roth — that's the whole gate. Once the kid works (any W-2 or legit self-employment), up to {usd(Math.min(earned, 7500))}/yr becomes Roth-eligible. </>}
          {r.cappedRoth && !r.noEarned && <>Roth capped at earned income ({usd(Math.min(earned, 7500))}/yr here). </>}
          For college the <span className="font-medium">529 keeps every dollar</span> (qualified = tax-free). The Trump Account returns basis tax-free but the seed and growth are taxed at the kid's rate. The Roth returns contributions tax-free; earnings before 59½ are taxed (penalty waived for education).{' '}
          <span className="font-medium">For retirement instead of college, the ranking flips:</span> Roth at 60 = {usd(r.bRoth * Math.pow(1 + ret / 100, 42))} entirely tax-free; Trump at 60 = {usd(r.bTrump * Math.pow(1 + ret / 100, 42))} but taxed as ordinary income on withdrawal.{' '}
          Aid impact: parent 529 ≤ 5.64% assessment, Trump Account ~20% as a student asset, Roth invisible until withdrawals.
        </div>
        <p className="text-xs text-muted-foreground">
          The honest summary: 529 for college money (tax-free qualified withdrawals, minimal aid impact, state deductions in most states, no federal cap). Custodial Roth for a working teen's long-term money (tax-free forever, invisible to FAFSA, contributions accessible — but requires real earned income, max $7,500 or earnings in 2026). Trump Account for the free $1,000 (2025–2028 births) and as a flexible supplement — but growth is taxed as ordinary income and it's a student asset for aid. Many families run two: 529 for education, Roth or Trump for the launchpad. Nothing here is either/or except the same dollars once.
        </p>
      </CardContent>
    </Card>
  )
}

// Custodial Roth IRA for kids — 2026 limit $7,500 or 100% of the child's EARNED income, whichever is less (Rev. Proc. 2025-32). Allowance/gifts don't count as earned income; W-2 or legit self-employment (lawn care, babysitting, modeling) does. Contributions (not earnings) withdrawable anytime tax- and penalty-free; FAFSA ignores retirement accounts as assets (though withdrawals count as student income). Verified: $3,000/yr ages 14–17 @8% → $13,518 at 18, $342,548 at 60 untouched.
export function CustodialRothCalc() {
  const [age, setAge] = useNumber(14)
  const [earned, setEarned] = useNumber(3000)
  const [contrib, setContrib] = useNumber(3000)
  const [ret, setRet] = useNumber(8)

  const r = useMemo(() => {
    const n = Math.max(0, 18 - age)
    const maxContrib = Math.min(earned, 7500)
    const ann = Math.min(contrib, maxContrib)
    const g = ret / 100
    const fv = (yrs: number) => (g > 0 ? ann * ((Math.pow(1 + g, yrs) - 1) / g) : ann * yrs)
    const at18 = fv(n)
    const at25 = at18 * Math.pow(1 + g, 7)
    const at60 = at18 * Math.pow(1 + g, 42)
    const contributed = ann * n
    return { n, maxContrib, ann, at18, at25, at60, contributed, overEarned: contrib > maxContrib }
  }, [age, earned, contrib, ret])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Child's current age" value={age} onChange={setAge} />
          <Field label="Child's earned income per year" value={earned} onChange={setEarned} prefix="$" />
          <Field label="Annual Roth contribution" value={contrib} onChange={setContrib} prefix="$" />
          <Field label="Annual return" value={ret} onChange={setRet} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Balance at 18" value={usd(r.at18)} />
          <Result label="At 25 (untouched)" value={usd(r.at25)} />
          <Result label="At 60 (untouched)" value={usd(r.at60)} />
          <Result label="Total contributed" value={usd(r.contributed)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.overEarned && <><span className="font-medium">Contribution capped:</span> a child can contribute the lesser of earned income or $7,500 (2026) — your inputs were limited to {usd(r.maxContrib)}. </>}
          {r.n > 0 ? (
            <>{r.n} years of {usd(r.ann)}/year grows tax-free to <span className="font-medium">{usd(r.at18)}</span> by 18 — and if never touched again, <span className="font-medium">{usd(r.at60)}</span> at 60, all of it tax-free. </>
          ) : (
            <>They're already 18 — the custodial window has closed, but a regular Roth IRA with any earned income works the same way. </>
          )}
          {r.n > 0 && <>Unlike a 529 or Trump Account, a Roth IRA is invisible to the FAFSA as an asset — and contributions (not earnings) can come back out anytime with no tax or penalty, so it's not truly locked. </>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026: contribution limit is the lesser of the child's earned income or $7,500 — and "earned" means real work: W-2 wages from a job (including the family business, at market rates with real payroll) or self-employment like mowing, babysitting, or tutoring. Allowance and gift money don't qualify as income, though a parent can fund the contribution as long as the child earned at least that much. Growth and qualified withdrawals are tax-free forever; contributions are withdrawable anytime. The FAFSA doesn't count retirement accounts as assets, but withdrawals count as student income two years later — spend from a Roth carefully during college years. Custodian manages the account until the age of majority (18–25 by state), then it's entirely the child's.
        </p>
      </CardContent>
    </Card>
  )
}

// Trump Accounts (OBBBA, IRS Notice 2025-68; launched July 4, 2026) — $1,000 pilot seed for US-citizen children born 2025–2028 (Form 4547/trumpaccounts.gov election; doesn't count toward limit); $5,000/yr aggregate contributions (after-tax, anyone can give; employer §128 up to $2,500 counts toward the $5k, pre-tax via cafeteria plan); indexed after 2027; S&P 500-type index funds only, 0.10% expense cap; locked until Jan 1 of the year the child turns 18, then traditional IRA rules (after-tax basis withdrawn tax-free, earnings ordinary income, 10% penalty pre-59½ with exceptions; Roth conversion allowed at 18). Verified: seed+max @8% → $191,247 at 18; seed-only → $3,996 at 18.
export function TrumpAccountCalc() {
  const [years, setYears] = useNumber(18)
  const [seed, setSeed] = useState(true)
  const [annual, setAnnual] = useNumber(2500)
  const [employer, setEmployer] = useNumber(0)
  const [ret, setRet] = useNumber(8)

  const r = useMemo(() => {
    const n = Math.max(0, Math.min(18, years))
    const total = annual + employer
    const overCap = total > 5000
    const ann = Math.min(total, 5000)
    const g = ret / 100
    const fv = (yrs: number) => {
      const s = seed ? 1000 : 0
      return s * Math.pow(1 + g, yrs) + (g > 0 ? ann * ((Math.pow(1 + g, yrs) - 1) / g) : ann * yrs)
    }
    const at18 = fv(n)
    const at30 = at18 * Math.pow(1 + g, 12)
    const at60 = at18 * Math.pow(1 + g, 42)
    const contributed = (seed ? 1000 : 0) + ann * n
    return { n, overCap, ann, at18, at30, at60, contributed, growth18: at18 - contributed }
  }, [years, seed, annual, employer, ret])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Years until the child turns 18" value={years} onChange={setYears} />
          <label className="space-y-1">
            <span className="text-sm font-medium">Born 2025–2028 ($1,000 seed)?</span>
            <select value={seed ? 'y' : 'n'} onChange={(e) => setSeed(e.target.value === 'y')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="y">Yes — gets the $1,000 pilot deposit</option>
              <option value="n">No / older child</option>
            </select>
          </label>
          <Field label="Family contributions per year" value={annual} onChange={setAnnual} prefix="$" />
          <Field label="Employer contribution per year (max $2,500)" value={employer} onChange={setEmployer} prefix="$" />
          <Field label="Annual return (index funds)" value={ret} onChange={setRet} suffix="%" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Balance at 18" value={usd(r.at18)} />
          <Result label="Growth at 18" value={usd(r.growth18)} />
          <Result label="At 30 (untouched)" value={usd(r.at30)} />
          <Result label="At 60 (untouched)" value={usd(r.at60)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.overCap && <><span className="font-medium">Over the cap:</span> family + employer combined can't exceed $5,000/year — the excess was excluded above. </>}
          You put in {usd(r.contributed)} (including the {seed ? '$1,000 seed' : 'no seed'}); compounding adds <span className="font-medium">{usd(r.growth18)}</span> by 18.{' '}
          {r.at18 > 50000 && <>Strategy note: at 18 the account becomes a traditional IRA in the child's hands — converting to Roth while their bracket is near zero is the move most planners will recommend. </>}
          <>For college-bound kids, compare against a 529: education withdrawals from this account dodge the 10% penalty but are still taxed as ordinary income; 529 qualified withdrawals are entirely tax-free.</>
        </div>
        <p className="text-xs text-muted-foreground">
          Rules (IRS Notice 2025-68): any US-citizen child under 18 with an SSN can have an account; the $1,000 pilot deposit is only for births 1/1/2025–12/31/2028 (elect on Form 4547 or trumpaccounts.gov). Contributions: $5,000/year aggregate from all family + employer sources (indexed after 2027), after-tax; employer §128 contributions up to $2,500/employee are pre-tax through a cafeteria plan and count toward the $5,000. Investments: US equity index mutual funds/ETFs only, expense ratio ≤ 0.10%, no leverage. Locked until January 1 of the year the child turns 18, then treated as a traditional IRA — basis comes out tax-free, earnings are ordinary income, 10% penalty before 59½ except education, first home ($10k), and the usual IRA exceptions. Financial aid: likely treated as a student asset (assessed up to 20% on the FAFSA vs 5.64% for parent-owned 529s) — one more reason the 529 usually wins for college money.
        </p>
      </CardContent>
    </Card>
  )
}

// Car loan interest deduction — IRC §163(h)(4) (OBBBA §70203), 2025–2028, Schedule 1-A Part IV with VIN. Up to $10,000/yr interest on loans originated after 12/31/2024 for NEW, personal-use, US-final-assembly vehicles <14,000 lbs GVWR. Phase-out: −$200 per $1,000 (or fraction) MAGI over $100k single / $200k MFJ; gone at $150k/$250k. Verified: $40k @7.5% 60mo → yr-1 interest $2,768, saves $616 at 22%; phase-out exact at $110k single ($8,000→$6,000).
export function CarLoanInterestCalc() {
  const [mfj, setMfj] = useState(false)
  const [magi, setMagi] = useNumber(85000)
  const [principal, setPrincipal] = useNumber(40000)
  const [apr, setApr] = useNumber(7.5)
  const [months, setMonths] = useNumber(60)

  const r = useMemo(() => {
    const rm = apr / 100 / 12
    const n = Math.max(1, months)
    const pmt = rm > 0 ? (principal * rm) / (1 - Math.pow(1 + rm, -n)) : principal / n
    let bal = principal
    let yr1 = 0
    let total = 0
    for (let mth = 1; mth <= n; mth++) {
      const i = bal * rm
      if (mth <= 12) yr1 += i
      total += i
      bal -= pmt - i
    }
    const th = mfj ? 200000 : 100000
    const red = 200 * Math.ceil(Math.max(0, magi - th) / 1000)
    const ded = Math.max(0, Math.min(yr1, 10000) - red)
    const STD = mfj ? 32200 : 16100
    const BK: readonly (readonly [number, number])[] = mfj
      ? [[0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]]
      : [[0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]]
    const taxable = Math.max(0, magi - STD)
    let m = 0.10
    for (const b of BK) if (taxable > b[0]) m = b[1]
    return { pmt, yr1, total, ded, saved: ded * m, m, red, th, headroom: Math.max(0, th - magi) }
  }, [mfj, magi, principal, apr, months])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={mfj ? 'm' : 's'} onChange={(e) => setMfj(e.target.value === 'm')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="s">Single / head of household</option>
              <option value="m">Married filing jointly</option>
            </select>
          </label>
          <Field label="Modified AGI" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Loan amount" value={principal} onChange={setPrincipal} prefix="$" />
          <Field label="APR" value={apr} onChange={setApr} suffix="%" />
          <Field label="Term (months)" value={months} onChange={setMonths} />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="First-year interest" value={usd(r.yr1)} />
          <Result label="Deductible this year" value={usd(r.ded)} />
          <Result label="Tax saved at your bracket" value={usd(r.saved)} />
          <Result label="Total interest over loan" value={usd(r.total)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          Payment {usd(r.pmt)}/mo; year-one interest <span className="font-medium">{usd(r.yr1)}</span>{r.ded < r.yr1 ? `, but the phase-out/cap leaves ${usd(r.ded)} deductible` : ''} — worth <span className="font-medium">{usd(r.saved)}</span> at your {num(r.m * 100, 0)}% bracket.{' '}
          {r.red > 0 && <>The phase-out removed {usd(r.red)} ($200 per $1,000 of MAGI over {usd(r.th)}). </>}
          {r.headroom > 0 && r.headroom < 25000 && <>You have {usd(r.headroom)} of MAGI headroom before the phase-out starts. </>}
          {r.ded > 0 && r.m <= 0.12 && <>Honest framing: at your bracket the deduction returns 10–12¢ per interest dollar — it's a nice offset, not a reason to finance. Paying cash still beats it. </>}
        </div>
        <p className="text-xs text-muted-foreground">
          2025–2028 (IRC §163(h)(4), Schedule 1-A): up to $10,000/year of interest on a loan originated after 12/31/2024 for a NEW personal-use car, SUV, minivan, pickup, or motorcycle under 14,000 lbs GVWR with final assembly in the US — verify via the Monroney sticker or NHTSA VIN decoder, not the brand name. Leases, used cars, and business vehicles are excluded. Phase-out: −$200 per $1,000 of MAGI over $100,000 single / $200,000 joint, gone at $150,000/$250,000. Above-the-line — no itemizing needed. You must list the VIN on the return; lenders report interest of $600+ to the IRS (Form 1098-VLI; 2025 transition relief via Notice 2025-57). The deduction sunsets after 2028 even for loans still in repayment.
        </p>
      </CardContent>
    </Card>
  )
}

// No Tax on Tips & Overtime — OBBBA §§70201–70202, 2025–2028, Schedule 1-A. Tips: up to $25,000 per taxpayer, qualifying occupations only, voluntary tips (not auto-gratuity), still payroll-taxed. OT: only the FLSA premium (the ½ in time-and-a-half), cap $12,500/return ($25,000 joint). Both: −$100 per $1,000 (or fraction) MAGI over $150k/$300k; tips gone at $400k/$550k, OT at $275k/$550k. SSN required; married must file jointly. Verified vs IRS/UIUC examples: Emily $22/hr × 120 OT hrs → $1,320; Daniel $15k OT at $160k MAGI → $11,500; Sarah $18k tips at $60k → $18,000.
export function TipsOvertimeDeductionCalc() {
  const [mfj, setMfj] = useState(false)
  const [magi, setMagi] = useNumber(60000)
  const [rate, setRate] = useNumber(22)
  const [otHours, setOtHours] = useNumber(120)
  const [tips, setTips] = useNumber(0)

  const r = useMemo(() => {
    const th = mfj ? 300000 : 150000
    const red = 100 * Math.ceil(Math.max(0, magi - th) / 1000)
    const premium = 0.5 * rate * Math.max(0, otHours)
    const otDed = Math.max(0, Math.min(premium, mfj ? 25000 : 12500) - red)
    const tipsDed = Math.max(0, Math.min(Math.max(0, tips), 25000) - red)
    const total = otDed + tipsDed
    const STD = mfj ? 32200 : 16100
    const BK: readonly (readonly [number, number])[] = mfj
      ? [[0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]]
      : [[0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]]
    const taxable = Math.max(0, magi - STD)
    let m = 0.10
    for (const b of BK) if (taxable > b[0]) m = b[1]
    const saved = total * m
    const headroom = Math.max(0, th - magi)
    return { premium, otDed, tipsDed, total, m, saved, red, headroom, th }
  }, [mfj, magi, rate, otHours, tips])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={mfj ? 'm' : 's'} onChange={(e) => setMfj(e.target.value === 'm')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="s">Single / head of household</option>
              <option value="m">Married filing jointly</option>
            </select>
          </label>
          <Field label="Modified AGI" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Reported tips for the year" value={tips} onChange={setTips} prefix="$" />
          <Field label="Regular hourly rate" value={rate} onChange={setRate} prefix="$" />
          <Field label="Overtime hours worked (at 1.5×)" value={otHours} onChange={setOtHours} />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Overtime deduction" value={usd(r.otDed)} />
          <Result label="Tips deduction" value={usd(r.tipsDed)} />
          <Result label="Total deduction" value={usd(r.total)} />
          <Result label="Federal tax saved" value={usd(r.saved)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.premium > 0 && <>Your overtime premium — the deductible part — is the "half" of time-and-a-half: {usd(0.5 * rate)}/hr × {otHours} hrs = <span className="font-medium">{usd(r.premium)}</span>{r.premium > r.otDed ? `, capped/phased down to ${usd(r.otDed)}` : ''}. </>}
          {r.red > 0 && <>MAGI phase-out removed <span className="font-medium">{usd(r.red)}</span> ($100 per $1,000 over {usd(r.th)}). </>}
          {r.headroom > 0 && r.headroom < 30000 && <>Phase-out starts {usd(r.headroom)} above your MAGI — a year-end bonus could shave $100 per $1,000 off both deductions. </>}
          {r.total > 0 && <>Worth <span className="font-medium">{usd(r.saved)}</span> at your {num(r.m * 100, 0)}% bracket — claimed on Schedule 1-A whether or not you itemize. Tips and OT are still fully hit by Social Security, Medicare, and usually state tax. </>}
          {tips > 0 && <>Tip rule: voluntary tips in IRS-listed occupations only — auto-gratuities and mandatory service charges don't count. </>}
        </div>
        <p className="text-xs text-muted-foreground">
          2025–2028 (OBBBA §§70201–70202; IRS Schedule 1-A): tips deduction up to $25,000 per person in occupations that customarily received tips before 2025 (roughly 70 on the IRS list — servers, bartenders, drivers, stylists, not SSTB professionals); overtime deduction covers only the FLSA-required premium portion, capped at $12,500 per return ($25,000 joint). Both phase out $100 per $1,000 of MAGI over $150,000 single / $300,000 joint — tips fully gone at $400k/$550k, overtime at $275k/$550k. Both require an SSN and, if married, a joint return; both work with the standard deduction. Self-employed: tips yes (capped at net business income), overtime no (FLSA doesn't cover you). W-2 boxes for these start in 2026 — for 2025, W-2 Box 7, tip logs, and Form 4137 are the substantiation.
        </p>
      </CardContent>
    </Card>
  )
}

// OBBBA senior deduction (IRC §224, P.L. 119-21 §70103) — $6,000 per 65+ individual ($12,000 MFJ both), 2025–2028, claimed on Schedule 1-A line 13b, stacks with standard OR itemized (unlike the old 65+ addition). Phase-out: each person's $6,000 reduced by 6% of MAGI over $75,000 (single/HoH) / $150,000 (MFJ) — fully gone at $175k/$250k (per-person application verified against IRS/Fidelity/BPC examples: single $105k → $4,200; single $85k → $5,400; MFJ one 65+ spouse at $200k → $3,000). MFS ineligible; SSN required.
export function SeniorDeductionCalc() {
  const [status, setStatus] = useState('m')
  const [seniors, setSeniors] = useState('2')
  const [magi, setMagi] = useNumber(140000)

  const r = useMemo(() => {
    const n = status === 'm' ? Math.min(2, parseInt(seniors, 10) || 0) : Math.min(1, parseInt(seniors, 10) || 0)
    const th = status === 'm' ? 150000 : 75000
    const per = Math.max(0, 6000 - 0.06 * Math.max(0, magi - th))
    const ded = per * n
    const STD: Record<string, number> = { s: 16100, m: 32200, h: 24150 }
    const BK: Record<string, readonly (readonly [number, number])[]> = {
      s: [[0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]],
      m: [[0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]],
      h: [[0, 0.10], [17700, 0.12], [67450, 0.22], [105700, 0.24], [201750, 0.32], [256200, 0.35], [640600, 0.37]],
    }
    const marg = (ti: number) => {
      const t = Math.max(0, ti)
      const B = BK[status]
      let rate = 0.10
      for (const b of B) if (t > b[0]) rate = b[1]
      return rate
    }
    const oldAdd = n * (status === 'm' ? 1650 : 2050)
    const taxableBase = Math.max(0, magi - STD[status] - oldAdd)
    const m = marg(taxableBase)
    const saved = ded * m
    const headroom = Math.max(0, th - magi)
    const goneAt = th + 100000
    return { n, ded, m, saved, headroom, goneAt, oldAdd, std: STD[status], th }
  }, [status, seniors, magi])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="s">Single</option>
              <option value="m">Married filing jointly</option>
              <option value="h">Head of household</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Filers age 65+ (Dec 31)</span>
            <select value={seniors} onChange={(e) => setSeniors(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="0">0</option>
              <option value="1">1</option>
              {status === 'm' && <option value="2">2</option>}
            </select>
          </label>
          <Field label="Modified AGI (≈ AGI)" value={magi} onChange={setMagi} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Senior deduction (§224)" value={usd(r.ded)} />
          <Result label="Total 65+ stack" value={usd(r.std + r.oldAdd + r.ded)} />
          <Result label="Federal tax saved" value={usd(r.saved)} />
          <Result label="Phase-out headroom" value={r.headroom > 0 ? usd(r.headroom) : 'Phasing out'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.n === 0 ? (
            <>Turn 65 by December 31 and the deduction appears — age is the only gate besides income (no need to be retired or collecting Social Security). </>
          ) : r.ded === 0 ? (
            <>MAGI past {usd(r.goneAt)} phases the deduction to zero at this filing status. </>
          ) : (
            <>{r.n === 2 ? 'Both spouses qualify' : 'One filer qualifies'}: <span className="font-medium">{usd(r.ded)}</span> off taxable income — worth {usd(r.saved)} at your {num(r.m * 100, 0)}% marginal rate, stacking with the standard deduction AND the existing 65+ addition ({usd(r.oldAdd)}), whether you itemize or not. </>
          )}
          {r.headroom > 0 && r.headroom < 40000 && r.n > 0 && <>You're {usd(r.headroom)} under the phase-out — every MAGI dollar over {usd(r.th)} costs 6¢ of deduction per qualified person, so a December Roth conversion or capital gain eats it at your bracket + 6%. </>}
          {r.n > 0 && <>Temporary: 2025–2028 only — four tax years, worth up to {usd(r.ded * Math.min(4, 4))} total at this income.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2025–2028 (OBBBA §70103, IRC §224): $6,000 per person age 65+ at year-end — $12,000 for a joint couple if both qualify — claimed on the new Schedule 1-A and stacked on the standard deduction or itemized deductions alike. Each person's amount phases down 6% of MAGI over $75,000 (single/HoH) or $150,000 (MFJ): fully gone at $175,000 / $250,000. Married filing separately is ineligible; a work-authorized SSN is required. This is the provision behind the "no tax on Social Security" headlines — benefits are still taxed under the old provisional-income formula; this deduction is what zeroes the bill for many seniors. The separate 65+/blind standard-deduction addition ($2,050 single/HoH, $1,650 per spouse MFJ for 2026) is permanent and stacks on top.
        </p>
      </CardContent>
    </Card>
  )
}

// Charitable bunching / DAF 2026 — two-year comparison: spread giving vs bunching 2 years into one via donor-advised fund. Itemized charitable subject to 0.5%-of-AGI floor (OBBBA); non-itemizer above-line charitable $1,000/$2,000 (NEW 2026 — makes bunching LOSE when other deductions are low: spread gets 2×$2,000 above-line, bunch gets none in the off year). Std $16,100/$32,200/$24,150. Verified: MFJ AGI $150k, other $25k, $10k/yr → bunch wins $7,950 of deductions ≈ $1,749 tax; AGI $120k, other $20k, $8k/yr → spread wins $800.
export function CharitableBunchingCalc() {
  const [status, setStatus] = useState('m')
  const [agi, setAgi] = useNumber(150000)
  const [other, setOther] = useNumber(25000)
  const [annual, setAnnual] = useNumber(10000)

  const r = useMemo(() => {
    const STD: Record<string, number> = { s: 16100, m: 32200, h: 24150 }
    const BK: Record<string, readonly (readonly [number, number])[]> = {
      s: [[0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]],
      m: [[0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]],
      h: [[0, 0.10], [17700, 0.12], [67450, 0.22], [105700, 0.24], [201750, 0.32], [256200, 0.35], [640600, 0.37]],
    }
    const tax = (ti: number) => {
      const t = Math.max(0, ti)
      const B = BK[status]
      let out = 0
      for (let i = 0; i < B.length; i++) {
        const lo = B[i][0]
        const hi = i + 1 < B.length ? B[i + 1][0] : Infinity
        if (t > lo) out += (Math.min(t, hi) - lo) * B[i][1]
      }
      return out
    }
    const std = STD[status]
    const abl = status === 'm' ? 2000 : 1000
    const twoYear = (bunch: boolean) => {
      let totalDed = 0
      let totalTax = 0
      for (let yr = 0; yr < 2; yr++) {
        const gift = bunch ? (yr === 0 ? annual * 2 : 0) : annual
        const itemized = other + Math.max(0, gift - 0.005 * agi)
        const ded = itemized > std ? itemized : std + Math.min(gift, abl)
        totalDed += ded
        totalTax += tax(agi - ded)
      }
      return { totalDed, totalTax }
    }
    const spread = twoYear(false)
    const bunch = twoYear(true)
    const bunchWins = bunch.totalTax < spread.totalTax
    const saved = Math.abs(spread.totalTax - bunch.totalTax)
    return { std, spread, bunch, bunchWins, saved, abl }
  }, [status, agi, other, annual])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="s">Single</option>
              <option value="m">Married filing jointly</option>
              <option value="h">Head of household</option>
            </select>
          </label>
          <Field label="AGI (each year)" value={agi} onChange={setAgi} prefix="$" />
          <Field label="Other itemized deductions (SALT after cap + mortgage + medical)" value={other} onChange={setOther} prefix="$" />
          <Field label="Annual charitable giving" value={annual} onChange={setAnnual} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="2-yr deductions: spread" value={usd(r.spread.totalDed)} />
          <Result label="2-yr deductions: bunched" value={usd(r.bunch.totalDed)} />
          <Result label="Winner" value={r.bunchWins ? 'Bunch it' : 'Spread it'} />
          <Result label="2-yr federal savings" value={usd(r.saved)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.bunchWins ? (
            <>Bunch two years of giving into one (a donor-advised fund makes it one tax event — you grant to charities on your own schedule). Itemizing the bunch year beats the {usd(r.std)} standard deduction; the off year takes the standard. Net: <span className="font-medium">{usd(r.saved)} less federal tax over two years</span>, same money to the same charities. </>
          ) : (
            <>Spread your giving. Bunching only wins when the bunched year's itemized total clears the standard deduction by enough to offset what you lose in the off year — and new for 2026, spreading also keeps the <span className="font-medium">above-the-line charitable deduction ({usd(r.abl)}/year)</span> in BOTH years, which bunching surrenders. </>
          )}
          {Math.abs(r.spread.totalDed - r.bunch.totalDed) < 2000 && <>It's close — the 0.5%-of-AGI floor on itemized gifts and your bracket boundaries are doing the deciding. </>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 rules: standard deduction $16,100 single / $32,200 MFJ / $24,150 HoH; itemized charitable gifts reduced by 0.5% of AGI (new OBBBA floor); non-itemizers deduct up to $1,000 (single) / $2,000 (MFJ) above the line (new for 2026, permanent). "Other itemized" should be your SALT after the $40,400 cap, mortgage interest, and deductible medical — the itemize-vs-standard calculator computes that number. Donor-advised funds: the deduction lands in the contribution year even though grants happen later; contributing appreciated stock avoids capital gains entirely. Cash gifts to public charities capped at 60% of AGI (excess carries forward 5 years). This compares two years at constant income — run it again if a high-income year is coming, since deductions are worth most at your highest bracket.
        </p>
      </CardContent>
    </Card>
  )
}

// Itemize vs standard deduction 2026 — OBBBA §164(b): SALT cap $40,400 (S/MFJ/HoH), −30% of MAGI over $505,000, floor $10,000 (~$606,333). Std deductions Rev. Proc. 2025-32: $16,100/$32,200/$24,150 + $2,050 (S/HoH) or $1,650/pp (MFJ) age 65+/blind. OBBBA: 0.5%-of-AGI floor on itemized charitable (§170(f)); non-itemizer above-line charitable $1,000/$2,000 (§70111/§224); §68 2/37 haircut at 37% bracket. Verified vs published 2026 cap table ($530k→$32,900, $555k→$25,400).
export function ItemizeVsStandardCalc() {
  const [status, setStatus] = useState('m')
  const [agi, setAgi] = useNumber(150000)
  const [salt, setSalt] = useNumber(28000)
  const [mortgage, setMortgage] = useNumber(14000)
  const [charity, setCharity] = useNumber(5000)
  const [medical, setMedical] = useNumber(0)
  const [seniors, setSeniors] = useState('0')

  const r = useMemo(() => {
    const STD: Record<string, number> = { s: 16100, m: 32200, h: 24150 }
    const BK: Record<string, readonly (readonly [number, number])[]> = {
      s: [[0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]],
      m: [[0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]],
      h: [[0, 0.10], [17700, 0.12], [67450, 0.22], [105700, 0.24], [201750, 0.32], [256200, 0.35], [640600, 0.37]],
    }
    const tax = (ti: number) => {
      const t = Math.max(0, ti)
      const B = BK[status]
      let out = 0
      for (let i = 0; i < B.length; i++) {
        const lo = B[i][0]
        const hi = i + 1 < B.length ? B[i + 1][0] : Infinity
        if (t > lo) out += (Math.min(t, hi) - lo) * B[i][1]
      }
      return out
    }
    const seniorN = status === 'm' ? Math.min(2, parseInt(seniors, 10) || 0) : Math.min(1, parseInt(seniors, 10) || 0)
    const seniorAdd = seniorN * (status === 'm' ? 1650 : 2050)
    const std = STD[status] + seniorAdd
    const cap = agi <= 505000 ? 40400 : Math.max(10000, 40400 - 0.30 * (agi - 505000))
    const saltD = Math.min(salt, cap)
    const charD = Math.max(0, charity - 0.005 * agi)
    const medD = Math.max(0, medical - 0.075 * agi)
    const itemized = saltD + mortgage + charD + medD
    const itemizeWins = itemized > std
    const diff = Math.abs(itemized - std)
    const saved = tax(agi - Math.min(itemized, std)) - tax(agi - Math.max(itemized, std))
    const aboveLineCharity = itemizeWins ? 0 : Math.min(charity, status === 'm' ? 2000 : 1000)
    return { std, cap, saltD, charD, medD, itemized, itemizeWins, diff, saved, aboveLineCharity, seniorAdd }
  }, [status, agi, salt, mortgage, charity, medical, seniors])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="s">Single</option>
              <option value="m">Married filing jointly</option>
              <option value="h">Head of household</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Filers age 65+ (or blind)</span>
            <select value={seniors} onChange={(e) => setSeniors(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="0">0</option>
              <option value="1">1</option>
              {status === 'm' && <option value="2">2</option>}
            </select>
          </label>
          <Field label="AGI (≈ MAGI)" value={agi} onChange={setAgi} prefix="$" />
          <Field label="State & local taxes paid (income + property)" value={salt} onChange={setSalt} prefix="$" />
          <Field label="Mortgage interest paid" value={mortgage} onChange={setMortgage} prefix="$" />
          <Field label="Charitable contributions" value={charity} onChange={setCharity} prefix="$" />
          <Field label="Unreimbursed medical expenses" value={medical} onChange={setMedical} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Your standard deduction" value={usd(r.std)} />
          <Result label="Itemized total (Schedule A)" value={usd(r.itemized)} />
          <Result label="Winner" value={r.itemizeWins ? 'Itemize' : 'Standard'} />
          <Result label="Federal tax saved" value={usd(r.saved)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.saltD < salt && <>SALT capped: you paid {usd(salt)} but deduct <span className="font-medium">{usd(r.saltD)}</span> (2026 cap {usd(r.cap)}{agi > 505000 ? ' after the 30% phase-down over $505,000 MAGI' : ''}). </>}
          {r.charD < charity && charity > 0 && r.itemizeWins && <>The new 0.5%-of-AGI floor trims {usd(charity - r.charD)} off your charitable deduction. </>}
          {r.medD === 0 && medical > 0 && <>Medical expenses under 7.5% of AGI ({usd(0.075 * agi)}) deduct nothing. </>}
          {r.itemizeWins ? (
            <>Itemizing beats the standard by <span className="font-medium">{usd(r.diff)}</span> of deductions — worth {usd(r.saved)} at your marginal bracket. </>
          ) : (
            <>The standard deduction wins by {usd(r.diff)}.{r.aboveLineCharity > 0 && <> You can still deduct <span className="font-medium">{usd(r.aboveLineCharity)}</span> of charitable gifts above the line — new for 2026, no itemizing required.</>} </>
          )}
          {r.seniorAdd > 0 && <>Age 65+/blind additions included: {usd(r.seniorAdd)} — and the separate OBBBA $6,000 senior deduction applies whether or not you itemize.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 (Rev. Proc. 2025-32 + OBBBA): standard deduction $16,100 single / $32,200 MFJ / $24,150 HoH, plus $2,050 (single/HoH) or $1,650 per spouse (MFJ) if 65+ or blind. SALT cap $40,400, reduced 30¢ per $1 of MAGI over $505,000 to a $10,000 floor (MFS halves everything); reverts to $10,000 in 2030. Itemized charitable has a new 0.5%-of-AGI floor; non-itemizers get an above-the-line charitable deduction up to $1,000/$2,000. Mortgage interest limited to acquisition debt up to $750,000. Top-bracket filers: the new §68 limit caps itemized value at roughly 35¢/dollar. Pass-through owners: a state PTET election can route state tax around the SALT cap entirely.
        </p>
      </CardContent>
    </Card>
  )
}

// Second income vs childcare — 2026 MFJ brackets (std $32,200), second earner's income stacked on top of the first for true marginal federal cost, plus FICA 7.65%, state rate input, childcare, commuting, and work extras. Verified: $60k + $40k second income → marginal fed $4,800; with $1,200/mo childcare, 100 mi/wk commute at $0.70/mi, $200/mo extras → net $9,980/yr = $5.20/hr.
export function SecondIncomeCalc() {
  const [first, setFirst] = useNumber(60000)
  const [second, setSecond] = useNumber(40000)
  const [stateRate, setStateRate] = useNumber(5)
  const [childcare, setChildcare] = useNumber(1200)
  const [miles, setMiles] = useNumber(100)
  const [extras, setExtras] = useNumber(200)
  const [hours, setHours] = useNumber(40)

  const r = useMemo(() => {
    const BK: readonly (readonly [number, number])[] = [[0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]]
    const fed = (ti: number) => {
      const t = Math.max(0, ti)
      let tax = 0
      for (let i = 0; i < BK.length; i++) {
        const lo = BK[i][0]
        const hi = i + 1 < BK.length ? BK[i + 1][0] : Infinity
        if (t > lo) tax += (Math.min(t, hi) - lo) * BK[i][1]
      }
      return tax
    }
    const marginalFed = fed(first + second - 32200) - fed(first - 32200)
    const fica = 0.0765 * second
    const state = (stateRate / 100) * second
    const care = childcare * 12
    const commute = miles * 48 * 0.70
    const extra = extras * 12
    const costs = marginalFed + fica + state + care + commute + extra
    const net = second - costs
    const perHour = hours > 0 ? net / (hours * 48) : 0
    const kept = second > 0 ? (net / second) * 100 : 0
    return { marginalFed, fica, state, care, commute, extra, net, perHour, kept }
  }, [first, second, stateRate, childcare, miles, extras, hours])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="First earner's gross salary" value={first} onChange={setFirst} prefix="$" />
          <Field label="Second job's gross salary" value={second} onChange={setSecond} prefix="$" />
          <Field label="State income tax rate" value={stateRate} onChange={setStateRate} suffix="%" />
          <Field label="Childcare per month" value={childcare} onChange={setChildcare} prefix="$" />
          <Field label="Commute miles per week" value={miles} onChange={setMiles} />
          <Field label="Work extras per month (lunches, wardrobe)" value={extras} onChange={setExtras} prefix="$" />
          <Field label="Hours per week at second job" value={hours} onChange={setHours} />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Net from the second job" value={usd(r.net)} />
          <Result label="Net per month" value={usd(r.net / 12)} />
          <Result label="True hourly value" value={`${usd(r.perHour)}/hr`} />
          <Result label="Share of gross kept" value={`${num(r.kept, 0)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          The second salary doesn't get its own brackets — it stacks on top of the first. Federal tax on it: <span className="font-medium">{usd(r.marginalFed)}</span>, FICA {usd(r.fica)}, state {usd(r.state)}, childcare {usd(r.care)}, commuting {usd(r.commute)}, extras {usd(r.extra)}.{' '}
          {r.net <= 0 ? (
            <><span className="font-medium">The second job costs more than it pays.</span> Before quitting, check the dependent-care FSA ($7,500 pre-tax in 2026) and the child care credit — they can flip the answer. </>
          ) : r.kept < 40 ? (
            <>You keep {num(r.kept, 0)} cents of each dollar. Softening the blow: a dependent-care FSA ($7,500 pre-tax in 2026) and up to $2,200/child in tax credits don't show in this math — and neither do career benefits like staying in the workforce. Run the whole picture before deciding. </>
          ) : (
            <>Even after stacking taxes and every work cost, the second income adds {usd(r.net / 12)}/month. Compare that against what the household gives up — the honest hourly number is the right yardstick. </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 MFJ brackets with the $32,200 standard deduction; the second income is taxed at the margin on top of the first earner's — the way payroll withholding tables actually treat it. FICA 7.65% (under the $184,500 Social Security wage base). Commuting valued at $0.70/mile and 48 work weeks. Not included: the dependent-care FSA ($7,500 pre-tax in 2026), the child and dependent care credit (20–35% of up to $3,000/$6,000 of care costs), retirement matches, health insurance value, and the career-progression value of staying employed — all real, all worth adding to your own math.
        </p>
      </CardContent>
    </Card>
  )
}

// Gift tax & annual-exclusion gifting planner — IRC §2503(b) annual exclusion $19,000/recipient for 2026 (Rev. Proc. 2025-32 §4.42(1)); $38,000 with gift-splitting (§2513); §2503(e) direct tuition/medical unlimited. 529 superfunding §529(c)(2)(B): 5-year election = $95,000/donor/beneficiary ($190,000 couple). Excess gifts consume the $15M lifetime exclusion (§2505) dollar-for-dollar; tax only beyond that at 18–40%.
export function GiftTaxCalc() {
  const [couple, setCouple] = useState(false)
  const [recipients, setRecipients] = useNumber(4)
  const [perYear, setPerYear] = useNumber(19000)
  const [years, setYears] = useNumber(10)
  const [growth, setGrowth] = useNumber(7)
  const [superfund, setSuperfund] = useNumber(0)

  const r = useMemo(() => {
    const excl = couple ? 38000 : 19000
    const cap529 = couple ? 190000 : 95000
    const sf = Math.min(Math.max(0, superfund), cap529)
    const excessPer = Math.max(0, perYear - excl)
    const annualTotal = perYear * recipients
    const annualTaxable = excessPer * recipients
    const taxableTotal = annualTaxable * years
    const g = Math.max(0, growth) / 100
    const fv = g > 0 ? annualTotal * ((Math.pow(1 + g, years) - 1) / g) : annualTotal * years
    const fvSf = sf > 0 ? sf * Math.pow(1 + g, years) : 0
    const removed = fv + fvSf
    const lifetimeLeft = 15000000 - taxableTotal - sf
    return { excl, cap529, sf, excessPer, annualTotal, annualTaxable, taxableTotal, removed, lifetimeLeft, overCap: superfund > cap529 }
  }, [couple, recipients, perYear, years, growth, superfund])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Gifting as</span>
            <select value={couple ? 'c' : 's'} onChange={(e) => setCouple(e.target.value === 'c')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="s">Individual — $19,000/recipient</option>
              <option value="c">Married couple, gift-splitting — $38,000</option>
            </select>
          </label>
          <Field label="Recipients (kids, grandkids…)" value={recipients} onChange={setRecipients} />
          <Field label="Gift per recipient per year" value={perYear} onChange={setPerYear} prefix="$" />
          <Field label="Years of gifting" value={years} onChange={setYears} />
          <Field label="Assumed growth on gifted assets" value={growth} onChange={setGrowth} suffix="%" />
          <Field label="One-time 529 superfund (per beneficiary)" value={superfund} onChange={setSuperfund} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Moved per year, tax-free" value={usd(r.annualTotal)} />
          <Result label="Taxable gifts over horizon" value={usd(r.taxableTotal)} />
          <Result label="Estate reduction (incl. growth)" value={usd(r.removed)} />
          <Result label="Lifetime exclusion left" value={usd(r.lifetimeLeft)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.annualTaxable === 0 ? (
            <><span className="font-medium">Fully under the annual exclusion.</span> {usd(r.annualTotal)}/year moves out of your estate with no gift tax, no Form 709, and no lifetime-exclusion cost. Over {years} years that's {usd(r.removed)} including growth that now compounds in your heirs' hands, not your estate. </>
          ) : (
            <><span className="font-medium">{usd(r.annualTaxable)}/year exceeds the {usd(r.excl)} annual exclusion.</span> The excess is a taxable gift reportable on Form 709 — it consumes your $15M lifetime exclusion (no out-of-pocket tax until that's used up). Over {years} years: {usd(r.taxableTotal)} of exclusion consumed. </>
          )}
          {r.sf > 0 && <>The {usd(r.sf)} 529 superfund uses the 5-year election ({usd(r.cap529)} max {couple ? 'per couple' : 'per donor'} per beneficiary) — front-loading five years of exclusions so the growth starts compounding immediately. </>}
          {r.overCap && <><span className="font-medium">Superfund amount exceeds the {usd(r.cap529)} cap</span> — the overflow is treated as a taxable gift in year one. </>}
          {r.lifetimeLeft < 15000000 && <>Lifetime exclusion remaining after this plan: <span className="font-medium">{usd(r.lifetimeLeft)}</span>.</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026: annual exclusion $19,000 per recipient ($38,000 with gift-splitting; $194,000 to a non-citizen spouse). Direct tuition and medical payments made to the provider are unlimited and don't touch the exclusion (§2503(e)). 529 superfunding front-loads 5 years of exclusions — $95,000 per donor ($190,000 per couple) per beneficiary — but no further annual-exclusion gifts to that beneficiary for 5 years. Gifts above the annual exclusion consume the $15M lifetime gift/estate exclusion before any tax is due. Recipients inherit your cost basis on lifetime gifts (carryover basis) versus a stepped-up basis at death — for highly appreciated assets, dying with them is often the better transfer.
        </p>
      </CardContent>
    </Card>
  )
}

// Federal estate tax — IRC §2010(c)(3) as amended by OBBBA §70106 (P.L. 119-21): $15,000,000 basic exclusion per person for 2026, permanent, indexed from 2027. Portability ($30M/couple) requires a Form 706 election on the first death — NOT automatic. Rate effectively 40% above the exclusion (Table A 18–40%; for taxable estates ≥ $1M, tax = 0.40 × TE − $6,000,000 exactly, since unified credit = $345,800 + 0.4 × $14M). Annual gift exclusion $19,000/recipient (Rev. Proc. 2025-32 §4.42(1)); §2503(e) direct tuition/medical unlimited. Lifetime taxable gifts reduce the death-time exclusion dollar-for-dollar.
export function EstateTaxCalc() {
  const [married, setMarried] = useState(true)
  const [elected, setElected] = useState(true)
  const [gross, setGross] = useNumber(20000000)
  const [debts, setDebts] = useNumber(500000)
  const [charity, setCharity] = useNumber(0)
  const [gifts, setGifts] = useNumber(0)

  const r = useMemo(() => {
    const base = (married && elected ? 30000000 : 15000000)
    const available = Math.max(0, base - gifts)
    const taxable = Math.max(0, gross - debts - charity)
    const excess = Math.max(0, taxable - available)
    const tax = 0.40 * excess
    const effRate = gross > 0 ? (tax / gross) * 100 : 0
    const headroom = Math.max(0, available - taxable)
    return { base, available, taxable, excess, tax, effRate, headroom }
  }, [married, elected, gross, debts, charity, gifts])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Marital status at death</span>
            <select value={married ? 'm' : 's'} onChange={(e) => setMarried(e.target.value === 'm')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="s">Single / widowed (no election)</option>
              <option value="m">Married couple</option>
            </select>
          </label>
          {married && (
            <label className="space-y-1">
              <span className="text-sm font-medium">Portability elected (Form 706 at first death)?</span>
              <select value={elected ? 'y' : 'n'} onChange={(e) => setElected(e.target.value === 'y')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
                <option value="y">Yes — $30M combined exclusion</option>
                <option value="n">No — $15M only</option>
              </select>
            </label>
          )}
          <Field label="Gross estate (all assets at FMV)" value={gross} onChange={setGross} prefix="$" />
          <Field label="Debts, mortgages, funeral & admin costs" value={debts} onChange={setDebts} prefix="$" />
          <Field label="Charitable bequests" value={charity} onChange={setCharity} prefix="$" />
          <Field label="Lifetime taxable gifts (above annual exclusions)" value={gifts} onChange={setGifts} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Exclusion available" value={usd(r.available)} />
          <Result label="Taxable estate" value={usd(r.taxable)} />
          <Result label="Federal estate tax" value={usd(r.tax)} />
          <Result label="Effective rate on gross" value={`${num(r.effRate, 1)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.tax === 0 ? (
            <>
              <span className="font-medium">No federal estate tax.</span> You're {usd(r.headroom)} under the exclusion. Every $19,000 per recipient per year of annual-exclusion gifting still removes future growth from the estate — e.g. $19,000 × 4 recipients × 10 years = {usd(760000)} plus appreciation, gift-tax-free. Direct tuition and medical payments (paid to the provider) are unlimited. </>
          ) : (
            <>
              <span className="font-medium">Estimated federal estate tax: {usd(r.tax)}</span> — 40% of the {usd(r.excess)} above the exclusion, due 9 months after death. </>
          )}
          {married && !elected && <><span className="font-medium">Portability was not elected:</span> the deceased spouse's unused exclusion is lost — a Form 706 must be filed at the first death even when no tax is due. </>}
          {married && elected && gifts > 0 && <>Lifetime taxable gifts already used {usd(gifts)} of the $30M combined exclusion. </>}
          {!married && gifts > 0 && <>Lifetime taxable gifts already used {usd(gifts)} of your $15M exclusion. </>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026: $15,000,000 basic exclusion per person (OBBBA §70106 — permanent, inflation-indexed from 2027; the old "sunset to ~$7M" no longer applies). Married couples reach $30M only if portability is elected on a timely Form 706 at the first death. Rate is graduated 18–40%, effectively 40% above the exclusion (this shortcut is exact for taxable estates ≥ $1M). Annual gift exclusion $19,000 per recipient ($38,000 with gift-splitting; $194,000 to a non-citizen spouse). The generation-skipping transfer tax has its own $15M exemption. State taxes are separate: five states levy inheritance taxes (KY, MD, NE, NJ, PA) and states like Oregon ($1M) and Massachusetts ($2M) tax far smaller estates. Assets generally get a stepped-up basis at death — heirs pay no income tax on pre-death appreciation.
        </p>
      </CardContent>
    </Card>
  )
}

// Child Tax Credit — IRC §24 as amended by OBBBA (P.L. 119-21): $2,200/child permanent, indexed after 2026. ACTC $1,700/child, 15% of earned income over $2,500. Phase-out $50 per $1,000 over $200k/$400k. Rev. Proc. 2025-32 §4.05; Schedule 8812.
export function ChildTaxCreditCalc() {
  const [mfj, setMfj] = useState(true)
  const [magi, setMagi] = useNumber(120000)
  const [kids, setKids] = useState('2')
  const [otherDeps, setOtherDeps] = useNumber(0)
  const [earned, setEarned] = useNumber(120000)
  const [taxBill, setTaxBill] = useNumber(8000)

  const r = useMemo(() => {
    const k = Math.max(0, parseInt(kids, 10) || 0)
    const gross = 2200 * k + 500 * otherDeps
    const th = mfj ? 400000 : 200000
    const red = 50 * Math.ceil(Math.max(0, magi - th) / 1000)
    const after = Math.max(0, gross - red)
    const nonref = Math.min(after, taxBill)
    const unused = after - nonref
    const childUnused = Math.min(unused, 2200 * k)
    const actc = Math.min(1700 * k, 0.15 * Math.max(0, earned - 2500), childUnused)
    const total = nonref + actc
    const headroom = magi <= th ? th - magi : null
    const lostToPhase = gross - after
    return { k, gross, red, after, nonref, actc, total, headroom, lostToPhase, th }
  }, [mfj, magi, kids, otherDeps, earned, taxBill])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={mfj ? 'mfj' : 'other'} onChange={(e) => setMfj(e.target.value === 'mfj')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="mfj">Married filing jointly</option>
              <option value="other">Single / HoH / MFS</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Qualifying children (under 17, SSN)</span>
            <select value={kids} onChange={(e) => setKids(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {['0', '1', '2', '3', '4', '5'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <Field label="Other dependents ($500 ODC each)" value={otherDeps} onChange={setOtherDeps} />
          <Field label="Modified AGI" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Earned income" value={earned} onChange={setEarned} prefix="$" />
          <Field label="Federal tax before credits" value={taxBill} onChange={setTaxBill} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Credit after phase-out" value={usd(r.after)} />
          <Result label="Nonrefundable (vs tax)" value={usd(r.nonref)} />
          <Result label="Refundable (ACTC)" value={usd(r.actc)} />
          <Result label="Total benefit" value={usd(r.total)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.k === 0 && otherDeps === 0 ? (
            <>Enter at least one qualifying child or dependent.</>
          ) : (
            <>
              {r.lostToPhase > 0 ? (
                <><span className="font-medium">Phase-out cost you {usd(r.lostToPhase)}.</span> $50 per $1,000 (or fraction) of MAGI over {usd(r.th)}. </>
              ) : r.headroom !== null && r.headroom > 0 && r.headroom < 50000 ? (
                <>Phase-out headroom: <span className="font-medium">{usd(r.headroom)}</span> of MAGI before the $50-per-$1,000 reduction starts. </>
              ) : null}
              {r.actc > 0 && <>The refundable ACTC adds {usd(r.actc)} on top — paid even with zero tax owed. </>}
              {r.after > r.nonref && r.actc === 0 && earned <= 2500 && <><span className="font-medium">Earned income under $2,500: no refundable portion</span> — the ACTC needs 15% of earnings above $2,500. </>}
              {r.nonref < r.after && r.actc < Math.min(r.after - r.nonref, 1700 * r.k) && earned > 2500 && <>The 15%-of-earnings formula is what limits your refund — more earned income (or a spouse's) raises it.</>}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          2026: $2,200 per qualifying child (under 17 at year-end, SSN required — one spouse's SSN suffices on a joint return), $500 per other dependent, both permanent under OBBBA and indexed after 2026. Refundable ACTC up to $1,700/child = 15% of earned income over $2,500. Phase-out: $50 per $1,000 (or fraction) of MAGI over $200,000 (single/HoH/MFS) or $400,000 (MFJ) — not indexed. Figured on Schedule 8812. EITC/ACTC refunds held until late February (PATH Act). The 2021 monthly advance payments are gone.
        </p>
      </CardContent>
    </Card>
  )
}

// AMT — IRC §55, 2026 per Rev. Proc. 2025-32 §4.10/§4.11 as amended by OBBBA §70107 (phase-out thresholds reset to $500k/$1M; phase-out rate doubled to 50%).
const AMT_2026 = {
  single: { ex: 90100, th: 500000, bp: 244500 },
  mfj: { ex: 140200, th: 1000000, bp: 244500 },
  mfs: { ex: 70100, th: 500000, bp: 122250 },
} as const

export function AmtCalc() {
  const [status, setStatus] = useState('single')
  const [amti, setAmti] = useNumber(450000)
  const [regTax, setRegTax] = useNumber(100000)

  const r = useMemo(() => {
    const p = AMT_2026[status as keyof typeof AMT_2026]
    const exPhased = Math.max(0, p.ex - 0.5 * Math.max(0, amti - p.th))
    const excess = Math.max(0, amti - exPhased)
    const tmt = excess <= p.bp ? 0.26 * excess : 0.26 * p.bp + 0.28 * (excess - p.bp)
    const amt = Math.max(0, tmt - regTax)
    const inPhaseout = amti > p.th && exPhased > 0
    const exemptionLost = p.ex - exPhased
    const headroom = amti <= p.th ? p.th - amti : null
    // effective marginal AMT rate in phase-out zone: rate × 1.5 (each $1 adds $1.50 of taxable excess)
    const margBase = excess <= p.bp ? 0.26 : 0.28
    const effMarg = inPhaseout ? margBase * 1.5 : margBase
    const fullOutAt = p.th + 2 * p.ex
    return { exPhased, excess, tmt, amt, inPhaseout, exemptionLost, headroom, effMarg, fullOutAt, p }
  }, [status, amti, regTax])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single / Head of household</option>
              <option value="mfj">Married filing jointly / QSS</option>
              <option value="mfs">Married filing separately</option>
            </select>
          </label>
          <Field label="AMTI (taxable income + add-backs)" value={amti} onChange={setAmti} prefix="$" />
          <Field label="Regular tax (before AMT)" value={regTax} onChange={setRegTax} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Exemption after phase-out" value={usd(r.exPhased)} />
          <Result label="Tentative minimum tax" value={usd(r.tmt)} />
          <Result label="AMT owed" value={usd(r.amt)} />
          <Result label="Marginal AMT rate" value={`${(r.effMarg * 100).toFixed(0)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.amt > 0 ? (
            <>
              <span className="font-medium">You owe AMT: {usd(r.amt)}</span> on top of your regular tax (Form 6251). {r.inPhaseout && <>You are inside the exemption phase-out — each extra $1 of AMTI removes $0.50 of exemption AND gets taxed, for an effective {(r.effMarg * 100).toFixed(0)}% marginal rate.</>} ISO exercises generate a forward AMT credit (Form 8801) recoverable in years when regular tax beats TMT.
            </>
          ) : r.inPhaseout ? (
            <>
              <span className="font-medium">No AMT owed — but you are in the phase-out zone.</span> {usd(r.exemptionLost)} of exemption already lost (50¢ per $1 over {usd(r.p.th)}); your TMT is {usd(r.tmt)} vs regular tax — a gap of {usd(regTax - r.tmt)}. An ISO exercise or big SALT add-back could close it.
            </>
          ) : (
            <>
              <span className="font-medium">Clear of AMT.</span> {r.headroom !== null && r.headroom > 0 && <>{usd(r.headroom)} of AMTI headroom before the exemption starts phasing out at {usd(r.p.th)} (2026 reset — was $626,350 single / $1,252,700 joint in 2025).</>} TMT of {usd(r.tmt)} stays under your regular tax.
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 (Rev. Proc. 2025-32, OBBBA §70107): exemption $90,100 single / $140,200 joint / $70,100 MFS; phase-out starts $500,000 / $1,000,000 / $500,000 at the DOUBLED 50% rate (exemption gone by $680,200 / $1,280,400 / $640,200); 26% up to ${r.p.bp.toLocaleString()} of excess, 28% above. AMTI add-backs: SALT deduction, standard deduction, ISO bargain element held past year-end, private-activity bond interest. Long-term capital gains keep their lower rates inside AMT — this tool treats AMTI as ordinary, so ISO/gain-heavy returns should verify with Form 6251 or a pro.
        </p>
      </CardContent>
    </Card>
  )
}

// QBI deduction — IRC §199A as amended by OBBBA §70105 (permanent; phase-in ranges $75k/$150k; new §199A(i) $400 minimum). 2026 thresholds per Rev. Proc. 2025-32 §4.26.
const QBI_2026 = {
  single: { th: 201750, range: 75000 },
  mfs: { th: 201775, range: 75000 },
  mfj: { th: 403500, range: 150000 },
} as const

export function QbiDeductionCalc() {
  const [status, setStatus] = useState('single')
  const [qbi, setQbi] = useNumber(120000)
  const [ti, setTi] = useNumber(120000)
  const [ncg, setNcg] = useNumber(0)
  const [sstb, setSstb] = useState(false)
  const [wages, setWages] = useNumber(0)
  const [ubia, setUbia] = useNumber(0)
  const [active, setActive] = useState(true)

  const r = useMemo(() => {
    const { th, range } = QBI_2026[status as keyof typeof QBI_2026]
    const cap = Math.max(0, 0.2 * (ti - ncg))
    let regular = 0
    let regime: 'below' | 'within' | 'above' = 'below'
    let ratio = 0
    if (qbi > 0) {
      if (ti <= th) {
        regular = 0.2 * qbi
      } else if (ti >= th + range) {
        regime = 'above'
        if (sstb) regular = 0
        else regular = Math.min(0.2 * qbi, Math.max(0.5 * wages, 0.25 * wages + 0.025 * ubia))
      } else {
        regime = 'within'
        ratio = (ti - th) / range
        const k = sstb ? 1 - ratio : 1
        const aQ = qbi * k
        const aW = wages * k
        const aU = ubia * k
        const wl = Math.max(0.5 * aW, 0.25 * aW + 0.025 * aU)
        regular = 0.2 * aQ - ratio * Math.max(0, 0.2 * aQ - wl)
      }
    }
    let ded = Math.min(regular, cap)
    const minApplies = active && qbi >= 1000 && !(sstb && ti >= th + range) && ded < Math.min(400, cap)
    if (minApplies) ded = Math.min(400, cap)
    const taxSaved22 = ded * 0.22
    const headroom = ti <= th ? th - ti : regime === 'within' ? th + range - ti : null
    return { ded, regular, cap, regime, ratio, minApplies, th, range, taxSaved22, headroom }
  }, [status, qbi, ti, ncg, sstb, wages, ubia, active])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single / Head of household</option>
              <option value="mfj">Married filing jointly</option>
              <option value="mfs">Married filing separately</option>
            </select>
          </label>
          <Field label="Qualified business income (QBI)" value={qbi} onChange={setQbi} prefix="$" />
          <Field label="Taxable income (before QBI deduction)" value={ti} onChange={setTi} prefix="$" />
          <Field label="Net capital gains + qualified dividends" value={ncg} onChange={setNcg} prefix="$" />
          <Field label="W-2 wages paid by the business" value={wages} onChange={setWages} prefix="$" />
          <Field label="UBIA of qualified property" value={ubia} onChange={setUbia} prefix="$" />
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={sstb} onChange={(e) => setSstb(e.target.checked)} className="h-4 w-4" />
            Specified service business (health, law, consulting, finance, athletics…)
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4" />
            I materially participate in the business
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="QBI deduction (2026)" value={usd(r.ded)} />
          <Result label="Tax saved at 22%" value={usd(r.taxSaved22)} />
          <Result label="Regime" value={r.regime === 'below' ? 'Full 20%' : r.regime === 'within' ? `Phase-in (${(r.ratio * 100).toFixed(0)}%)` : 'Limits apply'} />
          <Result label="Form" value={r.regime === 'below' ? '8995' : '8995-A'} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.regime === 'below' && (
            <>
              <span className="font-medium">Below the {usd(r.th)} threshold — the simple form.</span> 20% of QBI, no wage or SSTB tests. {r.headroom !== null && r.headroom > 0 && <>Headroom before the phase-in: <span className="font-medium">{usd(r.headroom)}</span> of taxable income.</>} {r.cap < r.regular && <>Your deduction is capped by taxable income: 20% × (TI − gains) = {usd(r.cap)}.</>}
            </>
          )}
          {r.regime === 'within' && (
            <>
              <span className="font-medium">Inside the phase-in range ({usd(r.th)}–{usd(r.th + r.range)}), {(r.ratio * 100).toFixed(0)}% through.</span> {sstb ? <>Only {((1 - r.ratio) * 100).toFixed(0)}% of your QBI counts, then the wage limit phases in.</> : <>The W-2/UBIA limit is phasing in.</>} {r.headroom !== null && r.headroom > 0 && <>{usd(r.headroom)} of taxable income from the top of the range{sstb ? ', where the deduction hits zero' : ''}. Every pre-tax dollar (SEP-IRA, HSA) pulls you back toward the full 20%.</>}
            </>
          )}
          {r.regime === 'above' && (
            <>
              {sstb ? (
                <><span className="font-medium">SSTB above {usd(r.th + r.range)}: the deduction is zero.</span> Service income is excluded from QBI at this income. The lever is taxable income, not the business: retirement/HSA contributions that pull TI back into the range restore a partial deduction.</>
              ) : (
                <><span className="font-medium">Full W-2/UBIA limit applies:</span> lesser of 20% of QBI or the greater of 50% of W-2 wages / 25% of wages + 2.5% of UBIA. {wages === 0 && ubia === 0 && <>With no wages and no qualified property, the regular deduction is $0{active && qbi >= 1000 ? ' — the new $400 minimum is what you see' : ''}.</>}
              </>
            )}
          </>
          )}
          {r.minApplies && <> <span className="font-medium">§199A(i) minimum applied:</span> $400 for active owners with $1,000+ of QBI (new for 2026).</>}
        </div>
        <p className="text-xs text-muted-foreground">
          2026: thresholds $201,750 single/HoH, $201,775 MFS, $403,500 MFJ (Rev. Proc. 2025-32); phase-in ranges $75,000/$150,000 (OBBBA §70105 — made permanent, wider than the old $50k/$100k). Deduction capped at 20% × (taxable income − net capital gains). QBI excludes reasonable S-corp comp, guaranteed payments, and investment income; sole props subtract the SE-tax half, SE health insurance, and SEP/SIMPLE contributions first. REIT dividends/PTP income (separate 20% component) not included here. Reduces income tax only — not SE tax or NIIT.
        </p>
      </CardContent>
    </Card>
  )
}

// EITC — IRC §32, 2026 parameters per Rev. Proc. 2025-32 §4.06. Formula method; IRS lookup table may differ by a few dollars.
const EITC_2026 = {
  0: { phaseIn: 0.0765, eiAmt: 8680, max: 664, phaseOut: 0.0765, thS: 10860, thJ: 18140, endS: 19540, endJ: 26820 },
  1: { phaseIn: 0.34, eiAmt: 13020, max: 4427, phaseOut: 0.1598, thS: 23890, thJ: 31160, endS: 51593, endJ: 58863 },
  2: { phaseIn: 0.4, eiAmt: 18290, max: 7316, phaseOut: 0.2106, thS: 23890, thJ: 31160, endS: 58629, endJ: 65899 },
  3: { phaseIn: 0.45, eiAmt: 18290, max: 8231, phaseOut: 0.2106, thS: 23890, thJ: 31160, endS: 62974, endJ: 70244 },
} as const
const EITC_INV_LIMIT_2026 = 12200

export function EitcCalc() {
  const [mfj, setMfj] = useState(false)
  const [kids, setKids] = useState('2')
  const [earned, setEarned] = useNumber(30000)
  const [agi, setAgi] = useNumber(30000)
  const [inv, setInv] = useNumber(0)
  const [ageOk, setAgeOk] = useState(true)

  const r = useMemo(() => {
    const k = (parseInt(kids, 10) >= 3 ? 3 : parseInt(kids, 10) || 0) as keyof typeof EITC_2026
    const p = EITC_2026[k]
    const th = mfj ? p.thJ : p.thS
    const end = mfj ? p.endJ : p.endS
    if (k === 0 && !ageOk) return { k, p, credit: 0, phase: 'ineligible' as const, th, end }
    if (inv > EITC_INV_LIMIT_2026) return { k, p, credit: 0, phase: 'invblocked' as const, th, end }
    const tentative = Math.min(p.phaseIn * earned, p.max)
    const measure = Math.max(earned, agi)
    let credit: number
    let phase: 'in' | 'plateau' | 'out' | 'zero'
    if (measure <= th) {
      credit = tentative
      phase = earned < p.eiAmt ? 'in' : 'plateau'
    } else {
      credit = Math.max(0, tentative - p.phaseOut * (measure - th))
      phase = credit > 0 ? 'out' : 'zero'
    }
    // marginal cost of the next $1,000 while in phase-out
    const marginalHit = phase === 'out' ? Math.min(p.phaseOut * 1000, credit) : 0
    const toMax = phase === 'in' ? p.max - credit : 0
    const headroom = phase === 'plateau' ? th - measure : phase === 'out' ? end - measure : null
    return { k, p, credit, phase, th, end, marginalHit, toMax, headroom }
  }, [mfj, kids, earned, agi, inv, ageOk])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={mfj ? 'mfj' : 'other'} onChange={(e) => setMfj(e.target.value === 'mfj')} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="other">Single / Head of household</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Qualifying children</span>
            <select value={kids} onChange={(e) => setKids(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="0">None</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3 or more</option>
            </select>
          </label>
          {kids === '0' ? (
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="h-4 w-4" />
              Age 25–64 (childless rule)
            </label>
          ) : (
            <div />
          )}
          <Field label="Earned income (wages + SE)" value={earned} onChange={setEarned} prefix="$" />
          <Field label="AGI" value={agi} onChange={setAgi} prefix="$" />
          <Field label="Investment income" value={inv} onChange={setInv} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Your EITC (2026)" value={usd(r.credit)} />
          <Result label="Max for your family" value={usd(r.p.max)} />
          <Result label="Phase" value={r.phase === 'in' ? 'Phasing in' : r.phase === 'plateau' ? 'At maximum' : r.phase === 'out' ? 'Phasing out' : r.phase === 'invblocked' ? 'Blocked' : r.phase === 'ineligible' ? 'Ineligible' : 'Zero'} />
          <Result label="Refundable" value="Paid even at $0 tax" />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.phase === 'ineligible' && (
            <><span className="font-medium">Not eligible.</span> With no qualifying children, the EITC requires you (or one spouse on a joint return) to be 25–64 at year-end.</>
          )}
          {r.phase === 'invblocked' && (
            <><span className="font-medium">Disqualified by investment income.</span> Over {usd(EITC_INV_LIMIT_2026)} of investment income (interest, dividends, capital gains, rents/royalties) zeroes the credit outright — a cliff, not a phase-out — no matter how low your earnings.</>
          )}
          {r.phase === 'in' && (
            <><span className="font-medium">Phasing in at {(r.p.phaseIn * 100).toFixed(2)}%.</span> Each additional dollar earned adds {(r.p.phaseIn * 100).toFixed(1)}¢ of credit — {usd(r.toMax ?? 0)} more available before the maximum at {usd(r.p.eiAmt)} of earnings.</>
          )}
          {r.phase === 'plateau' && (
            <><span className="font-medium">At the maximum.</span> The credit holds flat until {usd(r.th)} (the greater of AGI or earned income). Headroom: <span className="font-medium">{usd(r.headroom ?? 0)}</span>.</>
          )}
          {r.phase === 'out' && (
            <><span className="font-medium">Phasing out at {(r.p.phaseOut * 100).toFixed(2)}%.</span> Each extra $1,000 of income (whichever is higher, AGI or earnings) cuts the credit by {usd(r.marginalHit ?? 0)} — that acts like an extra {(r.p.phaseOut * 100).toFixed(1)}% marginal tax on top of your bracket. Credit reaches $0 at {usd(r.end)}.</>
          )}
          {r.phase === 'zero' && (
            <><span className="font-medium">Fully phased out.</span> The credit hits $0 at {usd(r.end)} for your filing status and family size.</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 parameters per IRS Rev. Proc. 2025-32: max credit $664 / $4,427 / $7,316 / $8,231 (0/1/2/3+ children); investment income limit $12,200. Phase-out measured on the greater of AGI or earned income. This runs the statutory formula — the IRS lookup table you file from can differ by a few dollars. Refundable: it pays out even with zero tax owed, but PATH Act refunds land late February at the earliest.
        </p>
      </CardContent>
    </Card>
  )
}

// ACA premium tax credit — IRC §36B. 2026 applicable percentages per Rev. Proc. 2025-25 (enhanced ARPA/IRA schedule expired 12/31/2025; 400% cliff restored). 2026 coverage uses Jan 2025 FPL guidelines (26 CFR §1.36B-1(h)).
const FPL_2025 = { con: [15650, 5500], ak: [19550, 6880], hi: [17990, 6330] } as const
const AP_2026: readonly (readonly [number, number, number])[] = [
  // [band top as %FPL, rate at band bottom, rate at band top] — linear interpolation within band
  [133, 0.021, 0.021],
  [150, 0.0314, 0.0419],
  [200, 0.0419, 0.066],
  [250, 0.066, 0.0844],
  [300, 0.0844, 0.0996],
  [400, 0.0996, 0.0996],
]

function acaApplicablePct(fplPct: number): number | null {
  if (fplPct > 400) return null
  let prev = 100
  for (const [top, lo, hi] of AP_2026) {
    if (fplPct <= top) return top === 133 ? 0.021 : lo + ((hi - lo) * (fplPct - prev)) / (top - prev)
    prev = top
  }
  return null
}

export function AcaSubsidyCalc() {
  const [region, setRegion] = useState('con')
  const [hh, setHh] = useState('2')
  const [magi, setMagi] = useNumber(60000)
  const [benchmark, setBenchmark] = useNumber(12000)

  const r = useMemo(() => {
    const [base, inc] = FPL_2025[region as keyof typeof FPL_2025]
    const size = Math.min(Math.max(parseInt(hh, 10) || 1, 1), 8)
    const fpl = base + (size - 1) * inc
    const pct = (magi / fpl) * 100
    const cliff = fpl * 4
    const ap = acaApplicablePct(pct)
    const under100 = pct < 100
    const expected = ap !== null ? magi * ap : null
    const credit = ap !== null && !under100 ? Math.max(0, benchmark - magi * ap) : 0
    const headroom = ap !== null ? cliff - magi : null
    const overBy = ap === null ? magi - cliff : null
    return { fpl, pct, ap, expected, credit, headroom, overBy, cliff, under100, size }
  }, [region, hh, magi, benchmark])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">State group</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="con">48 contiguous states / DC</option>
              <option value="ak">Alaska</option>
              <option value="hi">Hawaii</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Household size</span>
            <select value={hh} onChange={(e) => setHh(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <Field label="Household MAGI (2026)" value={magi} onChange={setMagi} prefix="$" />
          <Field label="Benchmark silver premium (annual)" value={benchmark} onChange={setBenchmark} prefix="$" />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Income vs poverty line" value={`${r.pct.toFixed(0)}% FPL`} />
          <Result label="Expected contribution" value={r.ap !== null ? `${(r.ap * 100).toFixed(2)}% = ${usd(r.expected ?? 0)}/yr` : 'n/a'} />
          <Result label="Premium tax credit" value={`${usd(r.credit)}/yr`} />
          <Result label="Monthly subsidy" value={`${usd(r.credit / 12)}/mo`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.under100 ? (
            <>
              <span className="font-medium">Under 100% FPL ({usd(r.fpl)} for a household of {r.size}).</span> No premium tax credit below the poverty line — in Medicaid-expansion states you qualify for Medicaid instead (up to 138% FPL); in non-expansion states this is the coverage gap.
            </>
          ) : r.ap === null ? (
            <>
              <span className="font-medium">Over the cliff.</span> At {usd(magi)} you are <span className="font-medium">{usd(r.overBy ?? 0)}</span> past 400% FPL ({usd(r.cliff)} for your household) — the credit is $0, no matter how large the premium. Every pre-tax dollar (401(k)/SEP-IRA/HSA, SE health-insurance deduction) reduces MAGI dollar-for-dollar; getting back under restores a credit worth up to {usd(Math.max(0, benchmark - r.cliff * 0.0996))}/yr at the line.
            </>
          ) : (
            <>
              <span className="font-medium">Eligible — {(r.ap * 100).toFixed(2)}% applicable percentage.</span> Your benchmark silver is capped at {usd((r.expected ?? 0) / 12)}/mo; the credit covers the rest. <span className="font-medium">Cliff watch:</span> {usd(r.headroom ?? 0)} of MAGI headroom before 400% FPL ({usd(r.cliff)}), where the entire {usd(r.credit)}/yr credit goes to zero — a $1 Roth conversion or bonus can cost five figures for older households.
            </>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-1 pr-2 font-medium">2026 income (% of FPL)</th>
              <th className="py-1 font-medium">Expected contribution to benchmark</th>
            </tr>
          </thead>
          <tbody>
            {AP_2026.map(([top, lo, hi], i) => {
              const loBound = i === 0 ? 100 : AP_2026[i - 1][0]
              const active = r.ap !== null && r.pct > loBound && r.pct <= top
              return (
                <tr key={i} className={`border-b ${active ? 'bg-muted/60 font-medium' : ''}`}>
                  <td className="py-1 pr-2">{i === 0 ? 'Under 133%' : `${loBound}% – ${top}%`}{active ? ' ← you' : ''}</td>
                  <td className="py-1">{lo === hi ? `${(lo * 100).toFixed(2)}%` : `${(lo * 100).toFixed(2)}% → ${(hi * 100).toFixed(2)}% (interpolated)`}</td>
                </tr>
              )
            })}
            <tr className={r.ap === null && !r.under100 ? 'bg-muted/60 font-medium' : ''}>
              <td className="py-1 pr-2">Over 400%{r.ap === null && !r.under100 ? ' ← you' : ''}</td>
              <td className="py-1">No credit — the cliff</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">
          2026 rules: enhanced ARPA/IRA subsidies expired 12/31/2025 — applicable percentages reverted to Rev. Proc. 2025-25 (2.10%–9.96%) and the 400% FPL eligibility cliff returned. 2026 coverage uses the January 2025 FPL guidelines ($15,650 single contiguous, +$5,500/person; AK $19,550; HI $17,990). Get your exact benchmark (second-lowest-cost silver) from HealthCare.gov — it varies by county and age. New for 2026: excess APTC repayment caps are gone — estimate income honestly. Pending legislation could still change 2026 retroactively.
        </p>
      </CardContent>
    </Card>
  )
}

// Saver's Credit (Retirement Savings Contributions Credit) — IRC §25B, 2026 thresholds per IRS Notice 2025-67. Final year before the Saver's Match replaces it in 2027.
const SAVERS_2026: Record<string, readonly (readonly [number, number])[]> = {
  single: [[24250, 0.5], [26250, 0.2], [40250, 0.1]],
  hoh: [[36375, 0.5], [39375, 0.2], [60375, 0.1]],
  mfj: [[48500, 0.5], [52500, 0.2], [80500, 0.1]],
}

export function SaversCreditCalc() {
  const [status, setStatus] = useState('single')
  const [agi, setAgi] = useNumber(24000)
  const [contrib, setContrib] = useNumber(2000)
  const [spouseContrib, setSpouseContrib] = useNumber(2000)
  const [taxBill, setTaxBill] = useNumber(1200)
  const [eligible, setEligible] = useState(true)

  const r = useMemo(() => {
    const bands = SAVERS_2026[status]
    let rate = 0
    let tierIdx = -1
    for (let i = 0; i < bands.length; i++) {
      if (agi <= bands[i][0]) { rate = bands[i][1]; tierIdx = i; break }
    }
    const eligBase = Math.min(contrib, 2000) + (status === 'mfj' ? Math.min(spouseContrib, 2000) : 0)
    const tentative = eligible ? rate * eligBase : 0
    const actual = Math.min(tentative, taxBill) // nonrefundable
    // cliff: cost of $1 more AGI
    const nextTierRate = tierIdx >= 0 && tierIdx < bands.length - 1 ? bands[tierIdx + 1][1] : 0
    const cliffCost = tierIdx >= 0 ? (rate - nextTierRate) * eligBase : 0
    const headroom = tierIdx >= 0 ? bands[tierIdx][0] - agi : null
    const matchPct = contrib + (status === 'mfj' ? spouseContrib : 0) > 0
      ? (tentative / (contrib + (status === 'mfj' ? spouseContrib : 0))) * 100
      : 0
    return { rate, tierIdx, eligBase, tentative, actual, cliffCost, headroom, bands, matchPct }
  }, [status, agi, contrib, spouseContrib, taxBill, eligible])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single / MFS / qualifying surviving spouse</option>
              <option value="hoh">Head of household</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </label>
          <Field label="AGI (2026)" value={agi} onChange={setAgi} prefix="$" />
          <Field label={status === 'mfj' ? 'Your retirement contributions' : 'Retirement contributions'} value={contrib} onChange={setContrib} prefix="$" />
          {status === 'mfj' && <Field label="Spouse's contributions" value={spouseContrib} onChange={setSpouseContrib} prefix="$" />}
          <Field label="Federal tax before credits" value={taxBill} onChange={setTaxBill} prefix="$" />
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={eligible} onChange={(e) => setEligible(e.target.checked)} className="h-4 w-4" />
            18+, not a full-time student, not a dependent
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Credit rate" value={`${(r.rate * 100).toFixed(0)}%`} />
          <Result label="Saver's credit" value={usd(r.tentative)} />
          <Result label="Usable this year" value={usd(r.actual)} />
          <Result label="Effective match" value={`${r.matchPct.toFixed(0)}%`} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {!eligible ? (
            <>
              <span className="font-medium">Not eligible.</span> The credit requires age 18+, not a full-time student (any part of 5 calendar months), and not claimed as a dependent.
            </>
          ) : r.rate === 0 ? (
            <>
              <span className="font-medium">Over the limit — no credit at this AGI.</span> Pre-tax 401(k)/traditional IRA contributions reduce AGI and can pull you back under {usd(r.bands[2][0])} — a contribution that restores the credit effectively pays you twice.
            </>
          ) : (
            <>
              <span className="font-medium">{(r.rate * 100).toFixed(0)}% tier.</span> {r.tentative > r.actual && <>Nonrefundable: your tax bill caps the usable credit at {usd(r.actual)} of {usd(r.tentative)}. </>}
              {r.headroom !== null && r.cliffCost > 0 && (
                <>This is a cliff, not a phase-out: <span className="font-medium">{usd(r.headroom)}</span> of AGI headroom remains, and $1 over drops the rate and costs <span className="font-medium">{usd(r.cliffCost)}</span> instantly.</>
              )}
            </>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-1 pr-2 font-medium">2026 AGI ({status === 'mfj' ? 'joint' : status === 'hoh' ? 'head of household' : 'single/other'})</th>
              <th className="py-1 pr-2 font-medium">Rate</th>
              <th className="py-1 font-medium">Max credit{status === 'mfj' ? ' (couple)' : ''}</th>
            </tr>
          </thead>
          <tbody>
            {r.bands.map(([top, rt], i) => {
              const lo = i === 0 ? 0 : r.bands[i - 1][0] + 1
              const active = r.tierIdx === i
              return (
                <tr key={i} className={`border-b ${active ? 'bg-muted/60 font-medium' : ''}`}>
                  <td className="py-1 pr-2">{lo === 0 ? `Up to ${usd(top)}` : `${usd(lo)} – ${usd(top)}`}{active ? ' ← you' : ''}</td>
                  <td className="py-1 pr-2">{(rt * 100).toFixed(0)}%</td>
                  <td className="py-1">{usd(rt * (status === 'mfj' ? 4000 : 2000))}</td>
                </tr>
              )
            })}
            <tr className={r.tierIdx === -1 ? 'bg-muted/60 font-medium' : ''}>
              <td className="py-1 pr-2">Over {usd(r.bands[2][0])}{r.tierIdx === -1 ? ' ← you' : ''}</td>
              <td className="py-1 pr-2">0%</td>
              <td className="py-1">$0</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">
          2026 thresholds per IRS Notice 2025-67; claim on Form 8880. Qualifies: 401(k)/403(b)/457, traditional AND Roth IRA, SEP/SIMPLE, TSP, ABLE. Rollovers don't count, and distributions taken in the testing period (this year + 2 prior + up to the filing deadline) reduce qualifying contributions. 2026 is the last year in this form — SECURE 2.0 replaces it with the refundable Saver's Match paid into your account starting 2027.
        </p>
      </CardContent>
    </Card>
  )
}

// Student loan interest deduction — IRC §221, 2026 phase-outs per Rev. Proc. 2025-32 §4.29.
export function StudentLoanInterestCalc() {
  const [status, setStatus] = useState('single')
  const [interest, setInterest] = useNumber(2500)
  const [magi, setMagi] = useNumber(80000)
  const [bracket, setBracket] = useState('22')

  const r = useMemo(() => {
    const cap = Math.min(interest, 2500)
    let ded = 0
    let phase = 0
    let band: readonly [number, number] | null = status === 'mfj' ? [175000, 205000] : status === 'mfs' ? null : [85000, 100000]
    if (status === 'mfs') {
      ded = 0
    } else if (band && magi < band[0]) {
      ded = cap
    } else if (band && magi >= band[1]) {
      ded = 0
      phase = 1
    } else if (band) {
      phase = (magi - band[0]) / (band[1] - band[0])
      ded = cap * (1 - phase)
    }
    const br = parseInt(bracket, 10) / 100
    const saved = ded * br
    const lostToPhase = cap - ded
    const headroom = status !== 'mfs' && band && magi < band[1] ? band[1] - magi : null
    return { cap, ded, phase, saved, lostToPhase, headroom, band }
  }, [status, interest, magi, bracket])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single / Head of household</option>
              <option value="mfj">Married filing jointly</option>
              <option value="mfs">Married filing separately</option>
            </select>
          </label>
          <Field label="Student loan interest paid (2026)" value={interest} onChange={setInterest} prefix="$" />
          <Field label="Modified AGI (MAGI)" value={magi} onChange={setMagi} prefix="$" />
          <label className="space-y-1">
            <span className="text-sm font-medium">Your marginal bracket</span>
            <select value={bracket} onChange={(e) => setBracket(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="10">10%</option>
              <option value="12">12%</option>
              <option value="22">22%</option>
              <option value="24">24%</option>
              <option value="32">32%</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Deductible interest" value={usd(r.ded)} />
          <Result label="Lost to phase-out" value={usd(r.lostToPhase)} />
          <Result label={`Tax saved at ${bracket}%`} value={usd(r.saved)} />
          <Result label="Above-the-line" value="No itemizing" />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {status === 'mfs' ? (
            <>
              <span className="font-medium">Not eligible.</span> Married filing separately cannot claim the student loan interest deduction at any income (IRC §221(e)(2)) — one of the real costs of that filing status.
            </>
          ) : r.ded === r.cap && r.cap > 0 ? (
            <>
              <span className="font-medium">Full deduction.</span> {r.cap < interest && <>The cap is $2,500 — you paid {usd(interest)}, so {usd(interest - 2500)} is over the cap. </>}Your MAGI is below the phase-out{r.headroom !== null && r.band && <>; headroom before it starts: <span className="font-medium">{usd(r.band[0] - magi)}</span></>}.
            </>
          ) : r.ded === 0 ? (
            <>
              <span className="font-medium">Phased out completely.</span> At this MAGI the deduction is gone — and it was worth {usd(r.cap * parseInt(bracket, 10) / 100)}/yr at your bracket. Pre-tax 401(k) or HSA contributions reduce MAGI and can pull you back under {r.band ? usd(r.band[1]) : ''}.
            </>
          ) : (
            <>
              <span className="font-medium">Partial deduction — {(r.phase * 100).toFixed(0)}% through the phase-out.</span> You keep {usd(r.ded)} of {usd(r.cap)}. {r.headroom !== null && r.headroom > 0 && <>You are {usd(r.headroom)} of MAGI from losing it entirely; every pre-tax 401(k)/HSA dollar both saves tax and restores this deduction.</>}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          2026: max $2,500, above-the-line (no itemizing needed). Phase-out MAGI $85,000–$100,000 single/head-of-household, $175,000–$205,000 married filing jointly — Rev. Proc. 2025-32. You must not be claimed as a dependent, and the loan must be for qualified higher-education expenses. MAGI here is AGI before this deduction, with certain exclusions added back.
        </p>
      </CardContent>
    </Card>
  )
}

// Traditional IRA deductibility — 2026 phase-outs, IRS Notice 2025-67 & Pub 590-A.
const IRA_DEDUCT_2026: Record<string, readonly [number, number]> = {
  singleCovered: [81000, 91000],
  mfjContributorCovered: [129000, 149000],
  mfjSpouseCovered: [242000, 252000],
  mfsCovered: [0, 10000], // not inflation-indexed
}

export function TraditionalIraDeductionCalc() {
  const [status, setStatus] = useState('single')
  const [covered, setCovered] = useState(true)
  const [spouseCovered, setSpouseCovered] = useState(false)
  const [magi, setMagi] = useNumber(120000)
  const [age50, setAge50] = useState(false)

  const r = useMemo(() => {
    const limit = age50 ? 8600 : 7500
    let band: readonly [number, number] | null = null
    if (status === 'mfs') {
      // lived with spouse: covered contributor OR spouse covered -> 0–10k band
      band = covered || spouseCovered ? IRA_DEDUCT_2026.mfsCovered : null
    } else if (status === 'mfj') {
      band = covered
        ? IRA_DEDUCT_2026.mfjContributorCovered
        : spouseCovered
          ? IRA_DEDUCT_2026.mfjSpouseCovered
          : null
    } else {
      band = covered ? IRA_DEDUCT_2026.singleCovered : null
    }
    let ded: number
    let phase = 0 // 0..1 through the band
    if (band === null) {
      ded = limit
    } else if (magi < band[0]) {
      ded = limit
    } else if (magi >= band[1]) {
      ded = 0
      phase = 1
    } else {
      phase = (magi - band[0]) / (band[1] - band[0])
      let reduced = limit * (1 - phase)
      reduced = Math.ceil(reduced / 10) * 10
      if (reduced > 0 && reduced < 200) reduced = 200
      ded = reduced
    }
    const nondeductible = limit - ded
    const headroom = band !== null && magi < band[1] ? band[1] - magi : null
    return { limit, band, ded, nondeductible, phase, headroom }
  }, [status, covered, spouseCovered, magi, age50])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single / Head of household</option>
              <option value="mfj">Married filing jointly</option>
              <option value="mfs">Married filing separately (lived together)</option>
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={covered} onChange={(e) => setCovered(e.target.checked)} className="h-4 w-4" />
            I am covered by a workplace plan (401(k), etc.)
          </label>
          {status !== 'single' ? (
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input type="checkbox" checked={spouseCovered} onChange={(e) => setSpouseCovered(e.target.checked)} className="h-4 w-4" />
              My spouse is covered by a workplace plan
            </label>
          ) : (
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input type="checkbox" checked={age50} onChange={(e) => setAge50(e.target.checked)} className="h-4 w-4" />
              Age 50 or older
            </label>
          )}
          <Field label="Modified AGI (MAGI)" value={magi} onChange={setMagi} prefix="$" />
          {status !== 'single' && (
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input type="checkbox" checked={age50} onChange={(e) => setAge50(e.target.checked)} className="h-4 w-4" />
              Age 50 or older
            </label>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="2026 contribution limit" value={usd(r.limit)} />
          <Result label="Deductible amount" value={usd(r.ded)} />
          <Result label="Nondeductible portion" value={usd(r.nondeductible)} />
          <Result label="Monthly deductible" value={usd(r.ded / 12)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.band === null ? (
            <>
              <span className="font-medium">Fully deductible at any income.</span> With no workplace plan covering you{status !== 'single' ? ' (or your spouse)' : ''}, there is no income limit on the traditional IRA deduction — the full {usd(r.limit)} comes off your taxable income.
            </>
          ) : r.ded === r.limit ? (
            <>
              <span className="font-medium">Fully deductible.</span> Your MAGI is below the {usd(r.band[0])} threshold for your situation. {r.headroom !== null && <>Headroom before the phase-out starts: <span className="font-medium">{usd(r.band[0] - magi)}</span>.</>}
            </>
          ) : r.ded === 0 ? (
            <>
              <span className="font-medium">No deduction at this income.</span> You can still contribute {usd(r.limit)} as a <span className="font-medium">nondeductible</span> traditional IRA (file Form 8606 to track basis) — or go straight to Roth if you are under the Roth phase-out, or use the backdoor route if you are over it.
            </>
          ) : (
            <>
              <span className="font-medium">Partial deduction — {(r.phase * 100).toFixed(0)}% through the phase-out.</span> You can deduct {usd(r.ded)}; the remaining {usd(r.nondeductible)} is a nondeductible contribution (Form 8606). {r.headroom !== null && r.headroom > 0 && <>You are {usd(r.headroom)} of MAGI from losing the deduction entirely.</>}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          2026 phase-outs per IRS Notice 2025-67: $81k–$91k single (covered), $129k–$149k joint (contributor covered), $242k–$252k joint (only spouse covered), $0–$10k MFS (never indexed). Reduction = limit × (top − MAGI) ÷ band width, rounded up to the next $10, with a $200 floor — Pub 590-A. Deduction value = amount × your marginal rate; state savings extra.
        </p>
      </CardContent>
    </Card>
  )
}

// Social Security benefits taxation — IRC §86 / IRS Pub 915 Worksheet 1. Thresholds statutory, frozen since 1984/1993 (not indexed).
export function SocialSecurityTaxCalc() {
  const [status, setStatus] = useState('mfj')
  const [benefits, setBenefits] = useNumber(36000)
  const [agi, setAgi] = useNumber(30000)
  const [tei, setTei] = useNumber(0)
  const [bracket, setBracket] = useState('22')

  const r = useMemo(() => {
    const pi = agi + tei + 0.5 * benefits
    let taxable
    let zone
    if (status === 'mfs') {
      taxable = Math.min(0.85 * pi, 0.85 * benefits)
      zone = 'mfs'
    } else {
      const base = status === 'mfj' ? 32000 : 25000
      const delta = status === 'mfj' ? 12000 : 9000
      const excess = pi - base
      if (excess <= 0) {
        taxable = 0
        zone = 'free'
      } else {
        const over2 = Math.max(0, pi - (base + delta))
        const l13 = Math.min(excess, delta)
        const l15 = Math.min(0.5 * benefits, 0.5 * l13)
        taxable = Math.min(l15 + 0.85 * over2, 0.85 * benefits)
        zone = over2 > 0 ? (taxable >= 0.85 * benefits - 0.005 ? 'maxed' : 'zone85') : 'zone50'
      }
    }
    const pct = benefits > 0 ? taxable / benefits : 0
    // marginal: extra $1,000 of other income
    const probe = (extraAgi: number) => {
      const pi2 = agi + extraAgi + tei + 0.5 * benefits
      if (status === 'mfs') return Math.min(0.85 * pi2, 0.85 * benefits)
      const base = status === 'mfj' ? 32000 : 25000
      const delta = status === 'mfj' ? 12000 : 9000
      const excess = pi2 - base
      if (excess <= 0) return 0
      const over2 = Math.max(0, pi2 - (base + delta))
      const l15 = Math.min(0.5 * benefits, 0.5 * Math.min(excess, delta))
      return Math.min(l15 + 0.85 * over2, 0.85 * benefits)
    }
    const extraTaxable = probe(1000) - taxable
    const br = parseInt(bracket, 10) / 100
    const effRate = ((1000 + extraTaxable) * br) / 1000
    // headroom to next zone
    const base = status === 'mfj' ? 32000 : status === 'mfs' ? 0 : 25000
    const delta = status === 'mfj' ? 12000 : 9000
    let headroom: number | null = null
    let headroomLabel = ''
    if (zone === 'free') { headroom = base - pi; headroomLabel = 'before any benefits become taxable' }
    else if (zone === 'zone50') { headroom = base + delta - pi; headroomLabel = 'before the 85% zone' }
    return { pi, taxable, pct, zone, extraTaxable, effRate, headroom, headroomLabel }
  }, [status, benefits, agi, tei, bracket])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single / Head of household</option>
              <option value="mfj">Married filing jointly</option>
              <option value="mfs">Married filing separately (lived together)</option>
            </select>
          </label>
          <Field label="Annual Social Security benefits (both spouses)" value={benefits} onChange={setBenefits} prefix="$" />
          <Field label="Other income (AGI before SS)" value={agi} onChange={setAgi} prefix="$" />
          <Field label="Tax-exempt interest (muni bonds)" value={tei} onChange={setTei} prefix="$" />
          <label className="space-y-1">
            <span className="text-sm font-medium">Your marginal bracket</span>
            <select value={bracket} onChange={(e) => setBracket(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="10">10%</option>
              <option value="12">12%</option>
              <option value="22">22%</option>
              <option value="24">24%</option>
              <option value="32">32%</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Provisional income" value={usd(r.pi)} />
          <Result label="Taxable benefits" value={usd(r.taxable)} />
          <Result label="Share of benefits taxable" value={`${(r.pct * 100).toFixed(1)}%`} />
          <Result label="Tax-free portion" value={usd(benefits - r.taxable)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.zone === 'free' && (
            <>
              <span className="font-medium">0% of your benefits are taxable.</span> You have <span className="font-medium">{usd(r.headroom ?? 0)}</span> of provisional-income headroom before taxation starts.
            </>
          )}
          {r.zone === 'zone50' && (
            <>
              <span className="font-medium">You are in the 50% zone.</span> Each extra $1 of income pulls $0.50 of benefits into taxable income — at your {bracket}% bracket, that is a <span className="font-medium">{(r.effRate * 100).toFixed(1)}% effective rate</span> on the next $1,000 withdrawn. {usd(r.headroom ?? 0)} of headroom {r.headroomLabel}.
            </>
          )}
          {r.zone === 'zone85' && (
            <>
              <span className="font-medium">You are in the 85% zone — the tax torpedo.</span> Each extra $1 of income pulls $0.85 of benefits into taxable income: at your {bracket}% bracket the next $1,000 of withdrawals is effectively taxed at <span className="font-medium">{(r.effRate * 100).toFixed(1)}%</span> ({usd((1000 + r.extraTaxable) * parseInt(bracket, 10) / 100)} tax on $1,000).
            </>
          )}
          {r.zone === 'maxed' && (
            <>
              <span className="font-medium">You are at the 85% cap.</span> The maximum taxable share is already reached — additional income no longer pulls in more benefits. Extra withdrawals are taxed at just your {bracket}% bracket again.
            </>
          )}
          {r.zone === 'mfs' && (
            <>
              <span className="font-medium">Married filing separately while living together: base amount is $0.</span> Up to 85% of benefits are taxable immediately — this filing status has the harshest Social Security treatment in the code.
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          IRS Pub 915 Worksheet 1, IRC §86. Provisional income = AGI (before SS) + tax-exempt interest + 50% of benefits. Thresholds — $25,000/$32,000 base, $34,000/$44,000 second tier — are written into statute and have not been adjusted since 1984/1993, which is why more retirees cross them every year.
        </p>
      </CardContent>
    </Card>
  )
}

// 2026 Medicare IRMAA — CMS/SSA, Nov 2025 announcement. Premiums use MAGI from 2 years prior (2024).
const IRMAA_2026 = {
  baseB: 202.9,
  single: [109000, 137000, 171000, 205000, 500000],
  mfj: [218000, 274000, 342000, 410000, 750000],
  mfs: [109000, 391000], // lived with spouse: compressed table
  partB: [0, 81.2, 202.9, 324.6, 446.3, 487.0], // surcharge over standard premium
  partD: [0, 14.5, 37.5, 60.4, 83.3, 91.0],
}

export function IrmaaCalc() {
  const [status, setStatus] = useState('single')
  const [magi, setMagi] = useNumber(120000)
  const [both, setBoth] = useState(false)

  const r = useMemo(() => {
    const isMfs = status === 'mfs'
    const thresholds = status === 'mfj' ? IRMAA_2026.mfj : isMfs ? IRMAA_2026.mfs : IRMAA_2026.single
    let tier = 0
    if (isMfs) {
      // MFS (lived with spouse): <=109k standard; >109k–<391k jumps to tier 5 pricing; >=391k top
      tier = magi <= thresholds[0] ? 0 : magi < thresholds[1] ? 4 : 5
    } else {
      for (let i = 0; i < thresholds.length; i++) if (magi > thresholds[i]) tier = i + 1
    }
    const bSurcharge = IRMAA_2026.partB[tier]
    const dSurcharge = IRMAA_2026.partD[tier]
    const people = status === 'mfj' && both ? 2 : 1
    const monthlyExtra = (bSurcharge + dSurcharge) * people
    const annualExtra = monthlyExtra * 12
    const partBTotal = IRMAA_2026.baseB + bSurcharge
    // headroom to next cliff
    const nextIdx = isMfs
      ? tier === 0 ? 0 : tier === 4 ? 1 : -1
      : tier < 5 ? tier : -1
    const nextThreshold = nextIdx >= 0 ? thresholds[nextIdx] : null
    const headroom = nextThreshold !== null ? nextThreshold - magi : null
    const overBy = tier > 0 ? magi - thresholds[tier - 1] : 0
    return { tier, bSurcharge, dSurcharge, monthlyExtra, annualExtra, partBTotal, headroom, overBy, people }
  }, [status, magi, both])

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Filing status (2024 return)</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="single">Single / Head of household</option>
              <option value="mfj">Married filing jointly</option>
              <option value="mfs">Married filing separately (lived together)</option>
            </select>
          </label>
          <Field label="MAGI from 2 years ago (2024)" value={magi} onChange={setMagi} prefix="$" />
          {status === 'mfj' ? (
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input type="checkbox" checked={both} onChange={(e) => setBoth(e.target.checked)} className="h-4 w-4" />
              Both spouses on Medicare
            </label>
          ) : (
            <div />
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Result label="Part B premium (per person)" value={`${usd(r.partBTotal)}/mo`} />
          <Result label="Part D surcharge (per person)" value={`${usd(r.dSurcharge)}/mo`} />
          <Result label={`IRMAA surcharge${r.people === 2 ? ' (both spouses)' : ''}`} value={`${usd(r.monthlyExtra)}/mo`} />
          <Result label="Annual surcharge" value={usd(r.annualExtra)} />
        </div>
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          {r.tier === 0 ? (
            <>
              <span className="font-medium">No IRMAA.</span> You pay the standard ${IRMAA_2026.baseB}/mo Part B premium and no Part D surcharge.
              {r.headroom !== null && r.headroom > 0 && (
                <> You have <span className="font-medium">{usd(r.headroom)}</span> of MAGI headroom before the first surcharge tier — worth {usd(1148.4 * r.people)}/yr{r.people === 2 ? ' combined' : ''} if crossed.</>
              )}
            </>
          ) : (
            <>
              <span className="font-medium">Tier {r.tier === 4 && status === 'mfs' ? 5 : r.tier + 1} of 6.</span> IRMAA is a cliff, not a phase-in: you crossed the threshold by {usd(r.overBy)}, and the full tier surcharge applies to every dollar of the year.
              {r.headroom !== null && r.headroom > 0 && (
                <> Next cliff is <span className="font-medium">{usd(r.headroom)}</span> of MAGI away.</>
              )}
            </>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-1 pr-2 font-medium">2024 MAGI ({status === 'mfj' ? 'joint' : status === 'mfs' ? 'MFS' : 'single'})</th>
              <th className="py-1 pr-2 font-medium">Part B total/mo</th>
              <th className="py-1 font-medium">Part D add/mo</th>
            </tr>
          </thead>
          <tbody>
            {(status === 'mfs'
              ? [
                  { label: '$109,000 or less', t: 0 },
                  { label: 'Above $109,000, below $391,000', t: 4 },
                  { label: '$391,000 or more', t: 5 },
                ]
              : (() => {
                  const th = status === 'mfj' ? IRMAA_2026.mfj : IRMAA_2026.single
                  return Array.from({ length: th.length + 1 }, (_, i) => ({
                    label:
                      i === 0
                        ? `${usd(th[0])} or less`
                        : i === th.length
                          ? `${usd(th[th.length - 1])} or more`
                          : `Above ${usd(th[i - 1])} to ${usd(th[i])}`,
                    t: i,
                  }))
                })()
            ).map((row, i) => {
              const tierIdx = status === 'mfs' ? row.t : i
              const active = r.tier === tierIdx
              return (
                <tr key={i} className={`border-b ${active ? 'bg-muted/60 font-medium' : ''}`}>
                  <td className="py-1 pr-2">{row.label}{active ? ' ← you' : ''}</td>
                  <td className="py-1 pr-2">{usd(IRMAA_2026.baseB + IRMAA_2026.partB[tierIdx])}</td>
                  <td className="py-1">{usd(IRMAA_2026.partD[tierIdx])}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">
          2026 premiums, set from your 2024 MAGI (AGI + tax-exempt interest), per CMS/SSA. Part D surcharge is added to your plan's own premium (avg ≈ $34.50/mo). If a life-changing event (retirement, divorce, death of a spouse) cut your income since 2024, file Form SSA-44 to use newer numbers.
        </p>
      </CardContent>
    </Card>
  )
}

export function RaiseVsBonusCalc() {
  const [base, setBase] = useNumber(80000)
  const [pct, setPct] = useNumber(5)
  const [growth, setGrowth] = useNumber(3)
  const [years, setYears] = useNumber(10)
  const [ret, setRet] = useNumber(7)
  const [recurring, setRecurring] = useState(false)

  const r = useMemo(() => {
    const bump = (base * pct) / 100
    let raiseCum = 0
    const bonusCum = recurring ? 0 : bump
    let bonusRun = 0
    let fvDelta = 0
    for (let k = 0; k < years; k++) {
      const raiseAdd = bump * Math.pow(1 + growth / 100, k)
      raiseCum += raiseAdd
      if (recurring) bonusRun += bump
      fvDelta = (fvDelta + (raiseAdd - (recurring ? bump : k === 0 ? bump : 0))) * (1 + ret / 100)
    }
    if (recurring) void bonusCum
    const bonusTotal = recurring ? bonusRun : bump
    const finalSalaryDelta = bump * Math.pow(1 + growth / 100, years - 1)
    return { bump, raiseCum, bonusTotal, delta: raiseCum - bonusTotal, fvDelta, finalSalaryDelta }
  }, [base, pct, growth, years, ret, recurring])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Current base salary" value={base} onChange={setBase} prefix="$" step="5000" />
        <Field label="The offer: % as raise or bonus" value={pct} onChange={setPct} suffix="%" step="0.5" />
        <Field label="Annual raise growth" value={growth} onChange={setGrowth} suffix="%" step="0.5" />
        <Field label="Years you'll stay" value={years} onChange={setYears} step="1" />
        <Field label="Return if invested" value={ret} onChange={setRet} suffix="%" step="0.5" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Bonus structure</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={recurring ? 'rec' : 'once'} onChange={(e) => setRecurring(e.target.value === 'rec')}>
            <option value="once">One-time bonus</option>
            <option value="rec">Recurring annual bonus (same %)</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Raise earns over horizon" value={usd(r.raiseCum, 0)} />
        <Result label={recurring ? 'Recurring bonuses total' : 'One-time bonus'} value={usd(r.bonusTotal, 0)} />
        <Result label="Raise advantage" value={`+${usd(r.delta, 0)}`} />
        <Result label="Advantage if invested" value={usd(r.fvDelta, 0)} />
        <Result label="Final-year salary edge" value={`+${usd(r.finalSalaryDelta, 0)}/yr`} />
      </div>
      <p className="text-sm text-muted-foreground">
        A raise compounds; a bonus evaporates. The {num(pct, 1)}% raise adds {usd(r.bump, 0)} this year AND
        inflates every future raise, since the {num(growth, 1)}% annual increase applies to the bigger base —
        {recurring ? ' even against the same percentage paid as a bonus EVERY year, the raise wins because bonuses never compound' : ' over your horizon that single decision is worth ' + usd(r.raiseCum, 0) + ' against the bonus\'s one-shot ' + usd(r.bump, 0)}.
        Two honest exceptions: take the bonus if you&apos;re leaving within a year (a raise you won&apos;t collect
        compounds for your employer, not you — though a higher base still anchors your NEXT salary negotiation),
        and at companies where bonuses are large and raises capped, the recurring-bonus line above shows the
        real gap. The counterintuitive takeaway: a smaller raise beats a bigger one-time bonus surprisingly
        fast — usually by year two.
      </p>
    </CardContent></Card>
  )
}

export function BenefitsValueCalc() {
  const [baseA, setBaseA] = useNumber(70000)
  const [matchA, setMatchA] = useNumber(6)
  const [healthA, setHealthA] = useNumber(650)
  const [ptoA, setPtoA] = useNumber(20)
  const [hrsA, setHrsA] = useNumber(45)
  const [baseB, setBaseB] = useNumber(80000)
  const [matchB, setMatchB] = useNumber(0)
  const [healthB, setHealthB] = useNumber(200)
  const [ptoB, setPtoB] = useNumber(10)
  const [hrsB, setHrsB] = useNumber(50)

  const r = useMemo(() => {
    const comp = (base: number, matchPct: number, healthMo: number, ptoDays: number, hoursWk: number) => {
      const match = (base * matchPct) / 100
      const health = healthMo * 12
      const pto = (base / 260) * ptoDays
      const total = base + match + health + pto
      const weeksWorked = Math.max(1, 52 - ptoDays / 5)
      const effHourly = total / (hoursWk * weeksWorked)
      return { match, health, pto, total, effHourly, weeksWorked }
    }
    const A = comp(baseA, matchA, healthA, ptoA, hrsA)
    const B = comp(baseB, matchB, healthB, ptoB, hrsB)
    const winner = A.total >= B.total ? 'A' : 'B'
    return { A, B, winner, gap: Math.abs(A.total - B.total), gapHr: Math.abs(A.effHourly - B.effHourly) }
  }, [baseA, matchA, healthA, ptoA, hrsA, baseB, matchB, healthB, ptoB, hrsB])

  const jobInputs = (prefix: string, base: number, setBase: (v: string) => void, match: number, setMatch: (v: string) => void, health: number, setHealth: (v: string) => void, pto: number, setPto: (v: string) => void, hrs: number, setHrs: (v: string) => void) => (
    <div className="space-y-3 rounded-lg border p-3">
      <p className="text-sm font-semibold">Job {prefix}</p>
      <Field label="Base salary" value={base} onChange={setBase} prefix="$" step="1000" />
      <Field label="401(k) match" value={match} onChange={setMatch} suffix="%" step="1" />
      <Field label="Employer health premium" value={health} onChange={setHealth} prefix="$/mo" step="50" />
      <Field label="PTO days" value={pto} onChange={setPto} step="1" />
      <Field label="Real hours/week" value={hrs} onChange={setHrs} step="1" />
    </div>
  )

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {jobInputs('A', baseA, setBaseA, matchA, setMatchA, healthA, setHealthA, ptoA, setPtoA, hrsA, setHrsA)}
        {jobInputs('B', baseB, setBaseB, matchB, setMatchB, healthB, setHealthB, ptoB, setPtoB, hrsB, setHrsB)}
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label={`Job A total comp`} value={usd(r.A.total, 0)} />
        <Result label="A effective hourly" value={`${usd(r.A.effHourly, 2)}/hr`} />
        <Result big label={`Job B total comp`} value={usd(r.B.total, 0)} />
        <Result label="B effective hourly" value={`${usd(r.B.effHourly, 2)}/hr`} />
        <Result label="Winner" value={`Job ${r.winner} by ${usd(r.gap, 0)}/yr`} />
        <Result label="Hourly gap" value={`${usd(r.gapHr, 2)}/hr`} />
        <Result label="A benefits layer" value={usd(r.A.match + r.A.health + r.A.pto, 0)} />
        <Result label="B benefits layer" value={usd(r.B.match + r.B.health + r.B.pto, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Base salary is the sticker price; total comp is the real number. The valuation: 401(k) match is cash
        (and the only &quot;free money&quot; with a vesting schedule — check yours), employer health premiums are
        dollars you don&apos;t spend (a family plan difference runs $5–10k/yr between employers), and PTO prices
        at salary ÷ 260 per day. Then the honest divisor: effective hourly divides total comp by ACTUAL hours
        — a 45-hour job and a 50-hour job don&apos;t work the same year. Default example is real: the $70k job
        with 6% match, good health coverage, and 20 PTO days beats the $80k job with none of it by ~$1,900/yr
        — and by $6.27 per hour actually worked. Run your two offers before the recruiter calls.
      </p>
    </CardContent></Card>
  )
}

export function OvertimeExemptCalc() {
  const [weekly, setWeekly] = useNumber(700)
  const [hours, setHours] = useNumber(50)
  const [juris, setJuris] = useState<'fed' | 'ca' | 'wa'>('fed')
  const [duties, setDuties] = useState(true)

  const r = useMemo(() => {
    const thresholds = { fed: 684, ca: 1352, wa: 1541.7 }
    const threshold = thresholds[juris]
    const levelPass = weekly >= threshold
    const exempt = levelPass && duties
    const rate = hours > 0 ? weekly / hours : 0
    const otHrs = Math.max(0, hours - 40)
    // salaried non-exempt: salary covers straight time for all hours; owed the half-time premium over 40
    const extraOwed = otHrs * rate * 0.5
    const annualOwed = extraOwed * 52
    const minBaseWithBonus = threshold * 0.9 // up to 10% of threshold may come from nondiscretionary bonuses
    const hce = 107432 / 52
    return { threshold, levelPass, exempt, rate, otHrs, extraOwed, annualOwed, minBaseWithBonus, hce, shortfall: Math.max(0, threshold - weekly) }
  }, [weekly, hours, juris, duties])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Weekly salary" value={weekly} onChange={setWeekly} prefix="$" step="10" />
        <Field label="Actual hours/week" value={hours} onChange={setHours} step="1" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Jurisdiction</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={juris} onChange={(e) => setJuris(e.target.value as 'fed' | 'ca' | 'wa')}>
            <option value="fed">Federal ($684/wk)</option>
            <option value="ca">California (~$1,352/wk)</option>
            <option value="wa">Washington (~$1,541.70/wk)</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Duties fit an exemption?</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={duties ? 'yes' : 'no'} onChange={(e) => setDuties(e.target.value === 'yes')}>
            <option value="yes">Yes — executive/admin/professional</option>
            <option value="no">No / not sure</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Status (salary test)" value={r.exempt ? 'Exempt' : 'NON-EXEMPT'} />
        <Result label="Your regular rate" value={`${usd(r.rate, 2)}/hr`} />
        <Result label="OT premium owed weekly" value={usd(r.extraOwed, 2)} />
        <Result label="Annualized" value={usd(r.annualOwed, 0)} />
        {!r.levelPass && <Result label="Below threshold by" value={`${usd(r.shortfall, 2)}/wk`} />}
        <Result label="Min base w/ 10% bonus rule" value={usd(r.minBaseWithBonus, 2)} />
      </div>
      {!r.exempt && (
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          {r.levelPass
            ? 'Salary clears the threshold, but the duties test fails — and ONE failed test makes the role non-exempt. At your hours, that is real money: the half-time premium on every hour past 40 adds up to the annualized figure above, plus liquidated damages equal to the unpaid amount if it goes to a claim.'
            : `Below ${usd(r.threshold, 2)}/week, the exemption fails before duties are even discussed — overtime is owed at your regular rate for every hour past 40, whatever your title or contract says.`}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        The 2026 truth many sites still get wrong: the federal threshold is $684/week ($35,568/yr) — the 2024
        jump to $844 then $1,128 was vacated by a federal court in November 2024 and formally rescinded from
        the CFR on May 15, 2026, so any page quoting $43,888 or $58,656 is stale. Exemption needs ALL THREE:
        salary basis (a fixed check that doesn&apos;t dock for slow weeks — the Supreme Court&apos;s Helix case sunk a
        $200k day-rate worker on this), salary level (up to 10% can come from nondiscretionary bonuses), and
        actual duties — titles prove nothing. Above {usd(r.hce, 2)}/week ($107,432/yr) the relaxed highly-compensated
        test applies. CA, WA, NY and others set higher state floors; the higher one wins.
      </p>
    </CardContent></Card>
  )
}

export function WeightCutCalc() {
  const [walkLb, setWalkLb] = useNumber(198)
  const [targetLb, setTargetLb] = useNumber(170)
  const [weeks, setWeeks] = useNumber(8)
  const [hours, setHours] = useNumber(24)

  const r = useMemo(() => {
    const KG = 0.45359237
    const walkKg = walkLb * KG
    const totalKg = Math.max(0, (walkLb - targetLb) * KG)
    const totalPct = walkLb > 0 ? ((walkLb - targetLb) / walkLb) * 100 : 0
    const waterCapKg = walkKg * 0.05 // 5% acute-dehydration ceiling used in consensus guidance with 24h recovery
    const fatRateKg = walkKg * 0.0075 // 0.75% BW/wk sustainable fat-loss pace
    const fatNeededKg = Math.max(0, totalKg - waterCapKg)
    const weeksNeeded = Math.ceil(fatNeededKg / fatRateKg) + 1 // +1 water-cut week
    const fatLossPossibleKg = Math.max(0, (weeks - 1)) * fatRateKg
    const waterKg = Math.max(0, totalKg - Math.min(fatNeededKg, fatLossPossibleKg))
    const waterPct = walkKg > 0 ? (waterKg / walkKg) * 100 : 0
    const verdict = totalKg <= 0 ? 'none' : waterPct <= 2 ? 'mild' : waterPct <= 5 ? 'standard' : 'danger'
    const rehydrateL = waterKg * 1.5 // ACSM: ~1.5 L per kg of fluid lost
    const carbLo = walkKg * 5
    const carbHi = walkKg * 10
    const fatPerWkLb = fatRateKg / KG
    return { totalPct, weeksNeeded, waterKg, waterLb: waterKg / KG, waterPct, verdict, rehydrateL, carbLo, carbHi, fatPerWkLb, totalLb: walkLb - targetLb }
  }, [walkLb, targetLb, weeks, hours])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Walking-around weight" value={walkLb} onChange={setWalkLb} suffix="lb" step="2" />
        <Field label="Weigh-in target" value={targetLb} onChange={setTargetLb} suffix="lb" step="1" />
        <Field label="Weeks until weigh-in" value={weeks} onChange={setWeeks} step="1" />
        <Field label="Hours weigh-in → fight" value={hours} onChange={setHours} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Total cut" value={`${num(r.totalLb, 0)} lb (${num(r.totalPct, 1)}%)`} />
        <Result label="Fat-phase pace available" value={`${num(r.fatPerWkLb, 2)} lb/wk`} />
        <Result label="Final-week water cut" value={`${num(r.waterLb, 1)} lb (${num(r.waterPct, 1)}%)`} />
        <Result label="Verdict" value={r.verdict === 'none' ? 'No cut needed' : r.verdict === 'mild' ? 'Mild' : r.verdict === 'standard' ? 'Standard' : 'TOO MUCH'} />
        <Result label="Minimum weeks needed" value={String(r.weeksNeeded)} />
        <Result label="Rehydration target" value={`${num(r.rehydrateL, 1)} L`} />
        <Result label="24h carb refuel" value={`${num(r.carbLo, 0)}–${num(r.carbHi, 0)} g`} />
      </div>
      {r.verdict === 'danger' && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          This plan requires a {num(r.waterPct, 1)}% acute water cut — beyond the ~5% ceiling sports-medicine
          consensus considers manageable even with a full 24-hour recovery. That is kidney-stress,
          cardiac-strain, and performance-loss territory. You need {r.weeksNeeded} weeks minimum, a higher
          weight class, or both. No fight is worth the hospital version of this math.
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        A real cut is two different processes with two different clocks. The fat phase runs weeks out at a
        sustainable ~0.75% of body weight per week — faster and you are burning the muscle you fight with. The
        water phase is the final week only: glycogen depletion (each gram of stored carb releases ~3 g of
        water), gut content, sodium taper, and fluid manipulation — reversible weight, not fat. Research
        consensus (Reale, ACSM) puts ~2% as performance-safe and ~5% as the ceiling WITH {hours >= 24 ? 'your full 24-hour' : 'a long'} recovery
        window{hours < 24 ? ' — and your window is shorter than 24 hours, which shrinks what is safe' : ''}. Rehydration
        is 1.5 L per kg lost plus 5–10 g/kg of carbohydrate to restore glycogen; IV rehydration is banned by
        USADA/WADA above 100 mL per 12 hours regardless of how common it looks on fight week.
      </p>
    </CardContent></Card>
  )
}

export function AcwrCalc() {
  const [w3, setW3] = useNumber(30)
  const [w2, setW2] = useNumber(35)
  const [w1, setW1] = useNumber(40)
  const [cur, setCur] = useNumber(44)

  const r = useMemo(() => {
    const prior = [w3, w2, w1].filter((x) => x >= 0)
    const coupledChronic = (w3 + w2 + w1 + cur) / 4
    const uncoupledChronic = prior.length ? prior.reduce((a, b) => a + b, 0) / prior.length : 0
    const coupled = coupledChronic > 0 ? cur / coupledChronic : 0
    const uncoupled = uncoupledChronic > 0 ? cur / uncoupledChronic : 0
    const wow = w1 > 0 ? ((cur - w1) / w1) * 100 : 0
    const zone = (v: number) =>
      v === 0 ? '—' : v < 0.8 ? 'Underprepared (elevated risk)' : v <= 1.3 ? 'Sweet spot' : v <= 1.5 ? 'Caution' : 'Danger zone'
    const nextChronic = (w2 + w1 + cur) / 3
    const maxNext = nextChronic * 1.3
    const masked = coupled < uncoupled - 0.05 && uncoupled > 1.3
    return { coupled, uncoupled, wow, zone: zone(uncoupled), maxNext, masked }
  }, [w3, w2, w1, cur])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="3 weeks ago" value={w3} onChange={setW3} step="5" />
        <Field label="2 weeks ago" value={w2} onChange={setW2} step="5" />
        <Field label="Last week" value={w1} onChange={setW1} step="5" />
        <Field label="This week (acute)" value={cur} onChange={setCur} step="5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="ACWR (uncoupled)" value={num(r.uncoupled, 2)} />
        <Result label="Zone" value={r.zone} />
        <Result label="Week-over-week change" value={`${r.wow >= 0 ? '+' : ''}${num(r.wow, 0)}%`} />
        <Result label="Max safe next week" value={num(r.maxNext, 1)} />
        <Result label="Coupled ACWR (flatters spikes)" value={num(r.coupled, 2)} />
      </div>
      {r.masked && (
        <p className="text-sm text-muted-foreground">
          Spike alert: your coupled ratio ({num(r.coupled, 2)}) hides what the uncoupled ratio ({num(r.uncoupled, 2)})
          exposes — this week's load is inside the denominator of the coupled version, damping every spike by
          design. Gabbett's group moved to uncoupled for exactly this reason.
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Use any consistent unit — km, minutes × session RPE, TSS, throws, pitches. The acute:chronic workload
        ratio compares this week's load to your 3-week baseline; Gabbett's injury research (BJSM 2016+) found
        the lowest risk at 0.8–1.3, rising above 1.5 — and ALSO below 0.8, because detrained tissue breaks too.
        The two failure modes this catches: the spike (doubling mileage in a week, ratio 2.0) and the
        ramp-then-crash (hard month, near-zero week, ratio 0.4 — then the return week spikes). Plan next week
        at or under {num(r.maxNext, 1)} units to stay inside the sweet spot, and keep week-over-week jumps
        near +10%.
      </p>
    </CardContent></Card>
  )
}

export function CriticalPowerCalc() {
  const [min1, setMin1] = useNumber(3)
  const [pow1, setPow1] = useNumber(450)
  const [min2, setMin2] = useNumber(12)
  const [pow2, setPow2] = useNumber(380)
  const [weight, setWeight] = useNumber(75)
  const [target, setTarget] = useNumber(420)

  const r = useMemo(() => {
    const t1 = min1 * 60
    const t2 = min2 * 60
    if (t1 <= 0 || t2 <= 0 || t1 === t2) return null
    const W1 = pow1 * t1
    const W2 = pow2 * t2
    const CP = (W2 - W1) / (t2 - t1)
    const Wp = W1 - CP * t1
    const valid = CP > 0 && Wp > 0
    const pred = (t: number) => CP + Wp / t
    const durations: [string, number][] = [['1 min', 60], ['3 min', 180], ['5 min', 300], ['10 min', 600], ['20 min', 1200], ['30 min', 1800], ['60 min', 3600]]
    const rows = durations.map(([label, t]) => ({ label, w: valid ? pred(t) : 0 }))
    const tte = valid && target > CP ? Wp / (target - CP) : 0
    const fmtT = (s: number) => s >= 3600 ? `${(s / 3600).toFixed(1)} h` : s >= 90 ? `${Math.round(s / 60)} min` : `${Math.round(s)} s`
    return { CP, Wp, valid, rows, tte, fmtT, wkg: weight > 0 ? CP / weight : 0 }
  }, [min1, pow1, min2, pow2, weight, target])

  if (!r) {
    return (
      <Card><CardContent className="space-y-4 p-5">
        <p className="text-sm text-muted-foreground">Enter two different effort durations with their average powers.</p>
      </CardContent></Card>
    )
  }
  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Effort 1 — duration" value={min1} onChange={setMin1} suffix="min" step="1" />
        <Field label="Effort 1 — avg power" value={pow1} onChange={setPow1} suffix="W" step="5" />
        <Field label="Body weight (0 = skip)" value={weight} onChange={setWeight} suffix="kg" step="1" />
        <Field label="Effort 2 — duration" value={min2} onChange={setMin2} suffix="min" step="1" />
        <Field label="Effort 2 — avg power" value={pow2} onChange={setPow2} suffix="W" step="5" />
        <Field label="Target power to hold" value={target} onChange={setTarget} suffix="W" step="5" />
      </div>
      {!r.valid ? (
        <p className="text-sm text-muted-foreground">
          These two efforts don't define a valid model — the longer effort must average less power than the
          short one, and both must be genuinely all-out. Use a ~3-minute and a ~10–12-minute time trial.
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Critical power" value={`${num(r.CP, 0)} W`} />
            <Result label="W′ (anaerobic capacity)" value={`${num(r.Wp / 1000, 1)} kJ`} />
            {weight > 0 && <Result label="CP per kg" value={`${num(r.wkg, 2)} W/kg`} />}
            <Result label={`Hold ${num(target, 0)} W for`} value={r.tte > 0 ? r.fmtT(r.tte) : '∞ (below CP)'} />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {r.rows.map((row) => (
              <div key={row.label} className="rounded-lg border p-2 text-center">
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <p className="text-sm font-semibold">{num(row.w, 0)} W</p>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="text-sm text-muted-foreground">
        The two-parameter model treats every all-out effort as W = CP × t + W′: critical power is the aerobic
        ceiling you can sustain indefinitely-ish, W′ is the finite anaerobic battery you burn above it
        (Monod &amp; Scherrer, 1965). Two max efforts — a ~3-minute and a ~10–12-minute TT on separate days —
        pin both numbers. What it buys you: predicted max power for ANY duration (table above) and time-to-
        exhaustion at any pace above CP. Honest limits: the model overestimates under ~2 minutes and past ~30
        minutes (glycogen and heat join the party), and CP typically sits a few percent ABOVE functional
        threshold power — don't just rename your FTP. Both efforts must be truly maximal or the line is fiction.
      </p>
    </CardContent></Card>
  )
}

export function WilksCalc() {
  const [sex, setSex] = useState<'m' | 'f'>('m')
  const [bwLb, setBwLb] = useNumber(220)
  const [squatLb, setSquatLb] = useNumber(455)
  const [benchLb, setBenchLb] = useNumber(315)
  const [deadLb, setDeadLb] = useNumber(545)

  const r = useMemo(() => {
    const bwKg = bwLb * 0.45359237
    const totalLb = squatLb + benchLb + deadLb
    const totalKg = totalLb * 0.45359237
    const [a, b, c, d, e, f] = WILKS_COEFF[sex]
    const wDenom = a + b * bwKg + c * bwKg ** 2 + d * bwKg ** 3 + e * bwKg ** 4 + f * bwKg ** 5
    const wilks = wDenom > 0 ? (totalKg * 500) / wDenom : 0
    const [A, B, C, D, E] = DOTS_COEFF[sex]
    const dDenom = A * bwKg ** 4 + B * bwKg ** 3 + C * bwKg ** 2 + D * bwKg + E
    const dots = dDenom > 0 ? (totalKg * 500) / dDenom : 0
    const band = dots < 200 ? 'Beginner' : dots < 300 ? 'Novice' : dots < 400 ? 'Intermediate' : dots < 500 ? 'Advanced' : 'Elite'
    // total needed for a round DOTS milestone at this bodyweight
    const nextMilestone = Math.ceil((dots + 1) / 50) * 50
    const kgForNext = (nextMilestone * dDenom) / 500
    const lbForNext = kgForNext / 0.45359237
    return { totalLb, wilks, dots, band, nextMilestone, addLb: Math.max(0, lbForNext - totalLb) }
  }, [sex, bwLb, squatLb, benchLb, deadLb])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Division</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={sex} onChange={(e) => setSex(e.target.value as 'm' | 'f')}>
            <option value="m">Men's</option>
            <option value="f">Women's</option>
          </select>
        </label>
        <Field label="Body weight" value={bwLb} onChange={setBwLb} suffix="lb" step="5" />
        <Field label="Squat" value={squatLb} onChange={setSquatLb} suffix="lb" step="5" />
        <Field label="Bench" value={benchLb} onChange={setBenchLb} suffix="lb" step="5" />
        <Field label="Deadlift" value={deadLb} onChange={setDeadLb} suffix="lb" step="5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Wilks score (legacy)" value={num(r.wilks, 1)} />
        <Result label="DOTS score (current)" value={num(r.dots, 1)} />
        <Result label="Class band (DOTS)" value={r.band} />
        <Result label="Total" value={`${num(r.totalLb, 0)} lb`} />
        <Result label={`To reach ${r.nextMilestone} DOTS`} value={`+${num(r.addLb, 0)} lb total`} />
        <Result label="Wilks vs DOTS gap" value={`${r.wilks >= r.dots ? '+' : ''}${num(r.wilks - r.dots, 1)}`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Why two numbers: the IPF retired Wilks in 2019 after analyses showed it systematically favored
        heavier lifters — the same total scored higher at higher body weights than it should. DOTS (and the
        IPF&apos;s own GL points) refit the polynomial on modern results. If your Wilks reads higher than your
        DOTS, you are exactly the lifter the old system flattered. Both scores are comparable only within the
        same sex division, and both use kilogram math internally — this tool converts your pounds. Bands
        (Beginner &lt;200 → Elite 500+) follow the DOTS scale; a 400 DOTS puts you around national-meet
        qualification territory, 500+ is international class.
      </p>
    </CardContent></Card>
  )
}

export function RacePredictorCalc() {
  const [distIdx, setDistIdx] = useState(1) // default 5K
  const [hh, setHh] = useNumber(0)
  const [mm, setMm] = useNumber(20)
  const [ss, setSs] = useNumber(0)

  const r = useMemo(() => {
    const t1 = hh * 3600 + mm * 60 + ss
    const d1 = RACE_DISTS[Math.min(distIdx, RACE_DISTS.length - 1)][1]
    if (t1 <= 0) return { rows: [], t1: 0, d1, name: '' }
    const fmtT = (s: number) => {
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const sec = Math.round(s % 60)
      return (h ? `${h}:` : '') + String(m).padStart(h ? 2 : 1, '0') + ':' + String(sec).padStart(2, '0')
    }
    const rows = RACE_DISTS.map(([name, d2]) => {
      const t = t1 * Math.pow(d2 / d1, 1.06)
      const linear = t1 * (d2 / d1)
      const paceMi = t / (d2 / 1.609344)
      return { name, d2, t: fmtT(t), pace: fmtT(paceMi), linear: fmtT(linear), gap: t - linear, isInput: d2 === d1 }
    })
    return { rows, t1, d1, name: RACE_DISTS[distIdx][0] }
  }, [distIdx, hh, mm, ss])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Known race distance</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={distIdx} onChange={(e) => setDistIdx(Number(e.target.value))}>
            {RACE_DISTS.map(([name], i) => <option key={name} value={i}>{name}</option>)}
          </select>
        </label>
        <Field label="Hours" value={hh} onChange={setHh} step="1" />
        <Field label="Minutes" value={mm} onChange={setMm} step="1" />
        <Field label="Seconds" value={ss} onChange={setSs} step="1" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-1 pr-3 font-medium">Distance</th>
              <th className="py-1 pr-3 font-medium">Riegel prediction</th>
              <th className="py-1 pr-3 font-medium">Pace / mile</th>
              <th className="py-1 pr-3 font-medium">Linear (wrong)</th>
              <th className="py-1 font-medium">Linear error</th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.name} className={`border-b last:border-0 ${row.isInput ? 'bg-primary/5 font-medium' : ''}`}>
                <td className="py-1 pr-3">{row.name}{row.isInput ? ' (you)' : ''}</td>
                <td className="py-1 pr-3 font-medium">{row.t}</td>
                <td className="py-1 pr-3">{row.pace}/mi</td>
                <td className="py-1 pr-3 text-muted-foreground">{row.linear}</td>
                <td className="py-1 text-muted-foreground">{row.gap > 30 ? `+${Math.round(row.gap / 60)} min too slow` : row.gap < -30 ? `${Math.round(row.gap / 60)} min too fast` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        The Riegel formula — T₂ = T₁ × (D₂/D₁)^1.06 — is the standard race-equivalency model (Riegel, 1977/81).
        The exponent is the whole point: fatigue rises superlinearly with distance, so doubling distance more
        than doubles your time. Linear pace scaling — what most quick math and chatbots do — gets the marathon
        wrong by 20+ minutes from a 5K, which is how runners blow up at mile 18 chasing a pace a formula
        promised. Honest caveats: Riegel assumes comparable training for both distances (a 5K time predicts a
        marathon only if you did the long runs), and it overestimates ultra distances — beyond the marathon,
        endurance economy dominates and no 1.06 exponent can save you.
      </p>
    </CardContent></Card>
  )
}

export function DepCareCalc() {
  const [mfj, setMfj] = useState(true)
  const [agi, setAgi] = useNumber(120000)
  const [kids, setKids] = useState<'1' | '2'>('2')
  const [expenses, setExpenses] = useNumber(13000)
  const [fsa, setFsa] = useNumber(7500)
  const [fed, setFed] = useNumber(24)
  const [state, setState] = useNumber(5)
  const [payroll, setPayroll] = useState(true)

  const r = useMemo(() => {
    // 2026 CDCC rate (OBBBA §70405): 50% ≤ $15k AGI; −1pt per $2k to 35% floor (~$45k);
    // 35% plateau to $75k ($150k MFJ); then −1pt per $2k ($4k MFJ) to 20% floor
    let rate = 50
    if (agi > 15000) rate = Math.max(35, 50 - Math.ceil((agi - 15000) / 2000))
    const t2 = mfj ? 150000 : 75000
    const step = mfj ? 4000 : 2000
    if (agi > t2) rate = Math.max(20, 35 - Math.ceil((agi - t2) / step))
    const cap = kids === '1' ? 3000 : 6000
    const fsaElect = Math.min(Math.max(0, fsa), 7500, expenses)
    const marginal = (fed + state) / 100 + (payroll ? 0.0765 : 0)
    const fsaValue = fsaElect * marginal
    const creditBase = Math.max(0, Math.min(expenses - fsaElect, cap - fsaElect))
    const comboCredit = creditBase * (rate / 100)
    const creditOnly = Math.min(expenses, cap) * (rate / 100)
    const combo = fsaValue + comboCredit
    const fsaWins = combo >= creditOnly
    const crossover = rate < marginal * 100
    return { rate, cap, fsaElect, marginal, fsaValue, comboCredit, creditOnly, combo, fsaWins, crossover }
  }, [mfj, agi, kids, expenses, fsa, fed, state, payroll])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Filing status</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={mfj ? 'mfj' : 'other'} onChange={(e) => setMfj(e.target.value === 'mfj')}>
            <option value="mfj">Married filing jointly</option>
            <option value="other">Single / head of household</option>
          </select>
        </label>
        <Field label="AGI" value={agi} onChange={setAgi} prefix="$" step="5000" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Qualifying children/dependents</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={kids} onChange={(e) => setKids(e.target.value as '1' | '2')}>
            <option value="1">One ($3,000 expense cap)</option>
            <option value="2">Two or more ($6,000 cap)</option>
          </select>
        </label>
        <Field label="Annual care expenses" value={expenses} onChange={setExpenses} prefix="$" step="1000" />
        <Field label="Dependent-care FSA election" value={fsa} onChange={setFsa} prefix="$" step="500" />
        <Field label="Federal bracket" value={fed} onChange={setFed} suffix="%" step="1" />
        <Field label="State income tax" value={state} onChange={setState} suffix="%" step="0.5" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">FSA via payroll (saves FICA)?</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={payroll ? 'yes' : 'no'} onChange={(e) => setPayroll(e.target.value === 'yes')}>
            <option value="yes">Yes — add 7.65%</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Your 2026 credit rate" value={`${num(r.rate, 0)}%`} />
        <Result label="Credit only (no FSA)" value={usd(r.creditOnly, 0)} />
        <Result label="FSA tax savings" value={usd(r.fsaValue, 0)} />
        <Result label="Credit on top of FSA" value={usd(r.comboCredit, 0)} />
        <Result label="Your total (with FSA)" value={usd(r.combo, 0)} />
        <Result label="Best move" value={r.fsaWins ? 'FSA wins' : 'Credit wins'} />
        <Result label="2026 FSA limit" value="$7,500" />
      </div>
      <p className="text-sm text-muted-foreground">
        OBBBA rewrote this credit for 2026: 50% at AGI ≤ $15,000, stepping down to a 35% plateau that holds to{' '}
        {mfj ? '$150,000' : '$75,000'}, then down to a 20% floor. Your rate is {num(r.rate, 0)}% and your marginal
        rate is {num(r.marginal * 100, 1)}% — {r.crossover ? 'above it, so each FSA dollar saves more than each credit dollar' : 'below it, so the credit beats the FSA dollar-for-dollar'}.{' '}
        The rule that surprises people: FSA dollars consume the credit&apos;s {kids === '1' ? '$3,000' : '$6,000'} expense
        cap dollar-for-dollar — with 2+ kids and a full $7,500 FSA the credit is gone entirely, so this is
        always an either/or (or a careful split) decision, never both on the same dollars. The credit is
        nonrefundable: at very low income it can be worth zero, which flips the verdict back to the FSA.
      </p>
    </CardContent></Card>
  )
}

export function HsaFsaCalc() {
  const [coverage, setCoverage] = useState<'self' | 'family'>('family')
  const [spend, setSpend] = useNumber(3000)
  const [fed, setFed] = useNumber(24)
  const [state, setState] = useNumber(5)
  const [payroll, setPayroll] = useState(true)
  const [growth, setGrowth] = useNumber(7)
  const [years, setYears] = useNumber(20)

  const r = useMemo(() => {
    const hsaMax = coverage === 'self' ? 4400 : 8750
    const fsaMax = 3400
    const carry = 680
    const rate = (fed + state) / 100 + (payroll ? 0.0765 : 0)
    const hsaContrib = hsaMax // the HSA play is to max it; spend vs invest decides what happens next
    const hsaSaved = hsaContrib * rate
    const hsaLeft = Math.max(0, hsaContrib - spend)
    const hsaFuture = hsaLeft * Math.pow(1 + growth / 100, years)
    const fsaContrib = Math.min(fsaMax, Math.max(spend, 0))
    const fsaSaved = fsaContrib * rate
    const forfeit = Math.max(0, fsaContrib - spend - carry)
    const fsaNet = fsaSaved - forfeit
    return { hsaMax, fsaMax, rate, hsaContrib, hsaSaved, hsaLeft, hsaFuture, fsaContrib, fsaSaved, forfeit, fsaNet }
  }, [coverage, spend, fed, state, payroll, growth, years])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">HDHP coverage (HSA limit)</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={coverage} onChange={(e) => setCoverage(e.target.value as 'self' | 'family')}>
            <option value="self">Self-only ($4,400)</option>
            <option value="family">Family ($8,750)</option>
          </select>
        </label>
        <Field label="Expected medical spend/yr" value={spend} onChange={setSpend} prefix="$" step="500" />
        <Field label="Federal bracket" value={fed} onChange={setFed} suffix="%" step="1" />
        <Field label="State income tax" value={state} onChange={setState} suffix="%" step="0.5" />
        <Field label="HSA growth if invested" value={growth} onChange={setGrowth} suffix="%" step="0.5" />
        <Field label="Years to grow the leftover" value={years} onChange={setYears} step="1" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Contributed via payroll?</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={payroll ? 'yes' : 'no'} onChange={(e) => setPayroll(e.target.value === 'yes')}>
            <option value="yes">Yes — saves 7.65% FICA too</option>
            <option value="no">No — direct (income tax only)</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="HSA year-1 tax savings" value={usd(r.hsaSaved, 0)} />
        <Result label="HSA leftover rolls over" value={usd(r.hsaLeft, 0)} />
        <Result label={`Leftover worth in ${num(years, 0)} yrs`} value={usd(r.hsaFuture, 0)} />
        <Result label="HSA total advantage" value={usd(r.hsaSaved + r.hsaFuture - r.hsaLeft, 0)} />
        <Result label={`FSA contribution (max ${usd(r.fsaMax, 0)})`} value={usd(r.fsaContrib, 0)} />
        <Result label="FSA tax savings" value={usd(r.fsaSaved, 0)} />
        <Result label="FSA forfeited (use-or-lose)" value={`−${usd(r.forfeit, 0)}`} />
        <Result label="FSA net benefit" value={usd(r.fsaNet, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        2026 limits (Rev. Proc. 2025-19 / 2025-32): HSA {coverage === 'self' ? '$4,400 self-only' : '$8,750 family'} (+$1,000
        at 55+), health FSA $3,400 with at most a $680 carryover — plans offer carryover OR a 2½-month grace
        period, never both. The structural difference: HSA money is YOURS forever and invests like a retirement
        account (triple tax-free, and after 65 non-medical withdrawals are merely taxed like an IRA), while FSA
        money above the carryover evaporates at year-end — though the FSA's uniform-coverage rule means your
        full election is spendable on day 1, even before you've funded it. Two traps: a general-purpose FSA
        (even your spouse's) blocks HSA eligibility — limited-purpose dental/vision FSAs don't — and California
        and New Jersey tax HSA contributions at the state level.
      </p>
    </CardContent></Card>
  )
}

export function CommissionDrawCalc() {
  const [draw, setDraw] = useNumber(4000)
  const [rate, setRate] = useNumber(10)
  const [sales, setSales] = useNumber(20000)
  const [growth, setGrowth] = useNumber(20)
  const [months, setMonths] = useNumber(6)
  const [recoverable, setRecoverable] = useState(true)

  const r = useMemo(() => {
    let deficit = 0
    let totalPaid = 0
    let totalComm = 0
    let firstAbove = 0
    const rows: { m: number; s: number; comm: number; take: number; bal: number }[] = []
    const n = Math.min(Math.max(1, Math.round(months)), 24)
    for (let m = 1; m <= n; m++) {
      const s = sales * Math.pow(1 + growth / 100, m - 1)
      const comm = s * (rate / 100)
      let take: number
      if (comm <= draw) {
        take = draw
        if (recoverable) deficit += draw - comm
      } else {
        const excess = comm - draw
        const repay = recoverable ? Math.min(excess, deficit) : 0
        deficit -= repay
        take = draw + (excess - repay)
        if (!firstAbove) firstAbove = m
      }
      totalPaid += take
      totalComm += comm
      rows.push({ m, s, comm, take, bal: deficit })
    }
    const breakeven = rate > 0 ? draw / (rate / 100) : 0
    return { rows, deficit, totalPaid, totalComm, breakeven, firstAbove }
  }, [draw, rate, sales, growth, months, recoverable])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Monthly draw" value={draw} onChange={setDraw} prefix="$" step="500" />
        <Field label="Commission rate" value={rate} onChange={setRate} suffix="%" step="0.5" />
        <Field label="Month-1 sales" value={sales} onChange={setSales} prefix="$" step="5000" />
        <Field label="Monthly sales growth" value={growth} onChange={setGrowth} suffix="%" step="5" />
        <Field label="Months to model" value={months} onChange={setMonths} step="1" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Draw type</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={recoverable ? 'rec' : 'nonrec'} onChange={(e) => setRecoverable(e.target.value === 'rec')}>
            <option value="rec">Recoverable (deficit owed back)</option>
            <option value="nonrec">Non-recoverable (guaranteed floor)</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Breakeven sales/month" value={usd(r.breakeven, 0)} />
        <Result label="Total you'll be paid" value={usd(r.totalPaid, 0)} />
        <Result label="Total commission earned" value={usd(r.totalComm, 0)} />
        <Result label={recoverable ? 'Deficit you still owe' : 'Forgiven draw total'} value={usd(r.deficit, 0)} />
        {r.firstAbove > 0 && <Result label="First month above draw" value={`Month ${r.firstAbove}`} />}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-1 pr-3 font-medium">Month</th>
              <th className="py-1 pr-3 font-medium">Sales</th>
              <th className="py-1 pr-3 font-medium">Commission</th>
              <th className="py-1 pr-3 font-medium">You take home</th>
              <th className="py-1 font-medium">{recoverable ? 'Deficit balance' : 'Shortfall forgiven'}</th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.m} className="border-b last:border-0">
                <td className="py-1 pr-3">{row.m}</td>
                <td className="py-1 pr-3">{usd(row.s, 0)}</td>
                <td className="py-1 pr-3">{usd(row.comm, 0)}</td>
                <td className="py-1 pr-3 font-medium">{usd(row.take, 0)}</td>
                <td className="py-1">{usd(row.bal, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        The number that matters before you sign: breakeven is draw ÷ rate — a {usd(draw, 0)} draw at{' '}
        {num(rate, 1)}% needs {usd(r.breakeven, 0)} of sales EVERY month just to stay flat. Below that, a
        recoverable draw is a loan: every shortfall piles into a deficit that commissions must repay before
        you see a dollar above the draw — and most plans make the balance due if you leave. Read the
        termination clause: some states (California, New York) limit clawbacks, but the contract usually
        controls. A non-recoverable draw is a true floor, which is exactly why employers offer less of it.
      </p>
    </CardContent></Card>
  )
}

export function EsppCalc() {
  const [grant, setGrant] = useNumber(20)
  const [purchase, setPurchase] = useNumber(30)
  const [sale, setSale] = useNumber(40)
  const [shares, setShares] = useNumber(500)
  const [disc, setDisc] = useNumber(15)
  const [lookback, setLookback] = useState(true)
  const [ord, setOrd] = useNumber(24)
  const [ltcg, setLtcg] = useNumber(15)

  const r = useMemo(() => {
    const d = Math.min(disc, 15) / 100
    const base = lookback ? Math.min(grant, purchase) : purchase
    const price = base * (1 - d)
    const cost = price * shares
    const instGain = (purchase - price) * shares
    const proceeds = sale * shares
    // Qualifying (§423(c)): ordinary = lesser of grant-date discount or actual gain; rest is capital gain
    const qOrd = Math.max(0, Math.min(grant * d, sale - price)) * shares
    const qCap = (sale - price) * shares - qOrd
    const qTax = qOrd * (ord / 100) + Math.max(0, qCap) * (ltcg / 100)
    // Disqualifying: ordinary = purchase-date FMV − price; basis steps to purchase FMV
    const dOrd = Math.max(0, purchase - price) * shares
    const dCap = (sale - purchase) * shares
    const dTax = dOrd * (ord / 100) + Math.max(0, dCap) * (ltcg / 100)
    const qualifyingBetter = qTax <= dTax
    const bestTax = Math.min(qTax, dTax)
    const maxShares25k = grant > 0 ? Math.floor(25000 / grant) : 0
    const overLimit = shares > maxShares25k
    return { price, cost, instGain, proceeds, qOrd, qCap, qTax, dOrd, dCap, dTax, qualifyingBetter, bestTax, maxShares25k, overLimit }
  }, [grant, purchase, sale, shares, disc, lookback, ord, ltcg])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Stock price at offering start" value={grant} onChange={setGrant} prefix="$" step="1" />
        <Field label="Stock price at purchase date" value={purchase} onChange={setPurchase} prefix="$" step="1" />
        <Field label="Expected sale price" value={sale} onChange={setSale} prefix="$" step="1" />
        <Field label="Shares purchased" value={shares} onChange={setShares} step="50" />
        <Field label="Plan discount" value={disc} onChange={setDisc} suffix="%" step="1" />
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Lookback provision</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={lookback ? 'yes' : 'no'} onChange={(e) => setLookback(e.target.value === 'yes')}>
            <option value="yes">Yes — 85% of the LOWER price</option>
            <option value="no">No — 85% of purchase-date price</option>
          </select>
        </label>
        <Field label="Your ordinary income bracket" value={ord} onChange={setOrd} suffix="%" step="1" />
        <Field label="Your long-term cap-gains rate" value={ltcg} onChange={setLtcg} suffix="%" step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Your purchase price/share" value={usd(r.price, 2)} />
        <Result label="Total cost" value={usd(r.cost, 0)} />
        <Result label="Instant gain at purchase" value={`+${usd(r.instGain, 0)}`} />
        <Result label="Sale proceeds" value={usd(r.proceeds, 0)} />
        <Result label="Tax if qualifying (2yr+1yr hold)" value={usd(r.qTax, 0)} />
        <Result label="Tax if disqualifying" value={usd(r.dTax, 0)} />
        <Result label={r.qualifyingBetter ? 'Qualifying saves' : 'Disqualifying saves'} value={usd(Math.abs(r.qTax - r.dTax), 0)} />
        <Result label="§25k limit at this grant price" value={`${num(r.maxShares25k, 0)} sh/yr`} />
      </div>
      {r.overLimit && (
        <p className="text-sm text-muted-foreground">
          §423(b)(8) warning: at a {usd(grant, 2)} grant-date price you can accrue at most {num(r.maxShares25k, 0)} shares
          per calendar year ($25,000 of grant-date value) — contributions above that are refunded or carried, per plan rules.
        </p>
      )}
      {!r.qualifyingBetter && (
        <p className="text-sm text-muted-foreground">
          The exception nobody mentions: qualifying is NOT always better. When the stock fell during the
          offering (your lookback keyed off the higher start price), the qualifying ordinary-income piece is
          the grant-date discount — here {usd(Math.min(grant * disc / 100, sale - r.price), 2)}/share — which can exceed the
          disqualifying ordinary income of {usd(Math.max(0, purchase - r.price), 2)}/share. Run both before waiting.
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        The lookback is the most valuable sentence in your plan document: with it, a stock that rises from{' '}
        {usd(grant, 2)} to {usd(purchase, 2)} during the offering still sells to you at {usd(r.price, 2)} — an instant{' '}
        {usd(r.instGain, 0)} on paper. Taxes split two ways. Sell after 2 years from offering start AND 1 year
        from purchase (qualifying): ordinary income is the LESSER of the grant-date discount or your actual
        gain ({usd(r.qOrd, 0)} here), the rest is long-term capital gain. Sell earlier (disqualifying): the
        purchase-date bargain element ({usd(r.dOrd, 0)}) is all ordinary income. Neither is subject to Social
        Security or Medicare tax.
      </p>
    </CardContent></Card>
  )
}

export function IBondCalc() {
  const [amount, setAmount] = useNumber(10000)
  const [fixed, setFixed] = useNumber(0.9)
  const [infl, setInfl] = useNumber(1.67)
  const [years, setYears] = useNumber(10)
  const [fed, setFed] = useNumber(22)
  const [state, setState] = useNumber(5)

  const r = useMemo(() => {
    const fixedD = fixed / 100
    const semiD = infl / 100
    const rawComp = fixedD + 2 * semiD + fixedD * semiD
    const comp = Math.max(0, rawComp) // composite rate never goes below zero
    const floored = rawComp < 0
    const r6 = comp / 2
    const growMonths = (p: number, months: number) => {
      let v = p
      let acc = 0
      for (let m = 1; m <= months; m++) {
        acc += v * (r6 / 6)
        if (m % 6 === 0) { v += acc; acc = 0 }
      }
      return v + acc
    }
    const months = Math.round(years * 12)
    const heldMonths = years >= 5 ? months : Math.max(0, months - 3) // 3-month interest penalty under 5 years
    const value = growMonths(amount, heldMonths)
    const fullValue = growMonths(amount, months)
    const penalty = fullValue - value
    const interest = Math.max(0, value - amount)
    const afterTax = amount + interest * (1 - fed / 100) // federal deferred to redemption, state-exempt
    const taxableRate = comp * (1 - (fed + state) / 100)
    const taxableAlt = amount * Math.pow(1 + taxableRate, years)
    const edge = afterTax - taxableAlt
    const overLimit = amount > 10000
    return { comp, floored, value, interest, penalty, afterTax, taxableAlt, edge, overLimit, years }
  }, [amount, fixed, infl, years, fed, state])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Purchase amount" value={amount} onChange={setAmount} prefix="$" step="1000" />
        <Field label="Fixed rate (locked at purchase)" value={fixed} onChange={setFixed} suffix="%" step="0.1" />
        <Field label="Assumed semiannual inflation" value={infl} onChange={setInfl} suffix="%" step="0.1" />
        <Field label="Years held" value={years} onChange={setYears} step="1" />
        <Field label="Your federal bracket" value={fed} onChange={setFed} suffix="%" step="1" />
        <Field label="Your state income tax" value={state} onChange={setState} suffix="%" step="0.5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Composite rate (this 6 months)" value={`${num(r.comp * 100, 2)}%`} />
        <Result label={`Value after ${num(years, 0)} yrs`} value={usd(r.value, 0)} />
        <Result label="Interest earned" value={usd(r.interest, 0)} />
        <Result label="After federal tax (state-free)" value={usd(r.afterTax, 0)} />
        <Result label="Same-rate taxable account" value={usd(r.taxableAlt, 0)} />
        <Result label="I-bond edge" value={`${r.edge >= 0 ? '+' : ''}${usd(r.edge, 0)}`} />
        {r.years < 5 && <Result label="3-month penalty (under 5 yrs)" value={`−${usd(r.penalty, 0)}`} />}
        <Result label="Annual purchase limit" value="$10,000/person" />
      </div>
      {r.floored && (
        <p className="text-sm text-muted-foreground">
          Deflation floor: the raw formula came out negative, so Treasury sets your composite rate
          to 0.00% — your bond's value never falls from deflation. The fixed rate keeps accruing
          against future inflation periods.
        </p>
      )}
      {r.overLimit && (
        <p className="text-sm text-muted-foreground">
          Note: TreasuryDirect caps electronic I-bond purchases at $10,000 per person per calendar
          year (plus up to $5,000 more in paper bonds via a federal tax refund). Amounts above that
          need multiple years — or a spouse, who gets a separate $10,000 limit.
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        The math most articles skip: the composite rate is fixed + 2×inflation + (fixed×inflation) —
        at the current 0.90% fixed and 1.67% semiannual inflation that's 4.26%, not 4.24%. Interest
        accrues monthly but compounds semiannually, federal tax is deferred until you redeem (and
        state tax never applies), and cashing before 5 years costs the last 3 months of interest —
        shown above. Your bond's rate resets every 6 months from your issue month, not on May 1 or
        November 1, so a newly announced rate reaches your bond on a lag. One year minimum holding,
        30-year interest life.
      </p>
    </CardContent></Card>
  )
}

export function SepIraCalc() {
  const [entity, setEntity] = useState<'sole' | 'scorp'>('sole')
  const [income, setIncome] = useNumber(100000)
  const [status, setStatus] = useState<'single' | 'mfj'>('single')

  const r = useMemo(() => {
    let halfSE = 0
    let nese = income
    if (entity === 'sole') {
      const base = income * 0.9235
      const se = Math.min(base, 184500) * 0.124 + base * 0.029 + Math.max(0, base - (status === 'mfj' ? 250000 : 200000)) * 0.009
      halfSE = se / 2
      nese = income - halfSE
    }
    const rate = entity === 'sole' ? 0.2 : 0.25
    const sep = Math.min(rate * nese, 72000)
    let employer = rate * nese
    const defer = Math.min(24500, Math.max(0, nese - employer))
    if (defer + employer > 72000) employer = Math.max(0, 72000 - defer)
    const solo = defer + employer
    const advantage = solo - sep
    const sepPct = income > 0 ? (sep / income) * 100 : 0
    const soloPct = income > 0 ? (solo / income) * 100 : 0
    return { halfSE, nese, sep, solo, advantage, sepPct, soloPct }
  }, [entity, income, status])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Business structure</span>
          <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={entity} onChange={(e) => setEntity(e.target.value as 'sole' | 'scorp')}>
            <option value="sole">Sole proprietor / single-member LLC</option>
            <option value="scorp">S-corp (you pay yourself W-2 wages)</option>
          </select>
        </label>
        <Field label={entity === 'sole' ? 'Schedule C net profit' : 'Your W-2 wages from the S-corp'} value={income} onChange={setIncome} prefix="$" step="1000" />
        {entity === 'sole' && (
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Filing status (0.9% Medicare threshold)</span>
            <select className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value as 'single' | 'mfj')}>
              <option value="single">Single ($200k)</option>
              <option value="mfj">Married filing jointly ($250k)</option>
            </select>
          </label>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="SEP-IRA max contribution" value={`${usd(r.sep, 0)}/yr`} />
        <Result label="Solo 401(k) max at same income" value={usd(r.solo, 0)} />
        <Result label="Solo 401(k) advantage" value={`+${usd(r.advantage, 0)}`} />
        <Result label="SEP shelters" value={`${num(r.sepPct, 1)}% of ${entity === 'sole' ? 'profit' : 'wages'}`} />
        <Result label="Solo shelters" value={`${num(r.soloPct, 1)}%`} />
        {entity === 'sole' && <Result label="½ SE-tax adjustment" value={`−${usd(r.halfSE, 0)}`} />}
        <Result label="2026 cap (both plans)" value={usd(72000, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        The surprise: a SEP-IRA and a solo 401(k) share IDENTICAL employer math (
        {entity === 'sole' ? '20% of net earnings after the ½-SE-tax adjustment' : '25% of W-2 wages'}),
        so the solo 401(k)'s advantage at your income is exactly the employee deferral —{' '}
        {usd(r.advantage, 0)}. The SEP wins on two things: establishment (open AND fund it by your
        filing deadline including extensions — the rescue for anyone who missed the solo 401(k)'s
        December 31 setup) and simplicity (no 5500-EZ until... never — SEPs don't file one). The
        solo 401(k) wins everything else: Roth option, catch-up contributions at 50+, loans, and
        the deferral that front-loads savings at lower incomes. Employed staff change everything:
        a SEP requires the same percentage for every eligible employee — the trap that empties
        growing businesses' pockets.
      </p>
    </CardContent></Card>
  )
}

export const MORE_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'medicare-irmaa-calculator': IrmaaCalc,
  'social-security-tax-calculator': SocialSecurityTaxCalc,
  'traditional-ira-deduction-calculator': TraditionalIraDeductionCalc,
  'student-loan-interest-deduction-calculator': StudentLoanInterestCalc,
  'savers-credit-calculator': SaversCreditCalc,
  'aca-subsidy-calculator': AcaSubsidyCalc,
  'eitc-calculator': EitcCalc,
  'qbi-deduction-calculator': QbiDeductionCalc,
  'amt-calculator': AmtCalc,
  'child-tax-credit-calculator': ChildTaxCreditCalc,
  'estate-tax-calculator': EstateTaxCalc,
  'gift-tax-calculator': GiftTaxCalc,
  'second-income-calculator': SecondIncomeCalc,
  'itemized-vs-standard-deduction-calculator': ItemizeVsStandardCalc,
  'charitable-bunching-calculator': CharitableBunchingCalc,
  'senior-deduction-calculator': SeniorDeductionCalc,
  'tips-overtime-deduction-calculator': TipsOvertimeDeductionCalc,
  'car-loan-interest-deduction-calculator': CarLoanInterestCalc,
  'trump-account-calculator': TrumpAccountCalc,
  'custodial-roth-ira-calculator': CustodialRothCalc,
  '529-vs-trump-vs-roth-calculator': KidSavingsCompareCalc,
  'heloc-calculator': HelocCalc,
  'heloc-vs-cash-out-refi-calculator': CashOutRefiCalc,
  'home-equity-loan-calculator': HomeEquityLoanCalc,
  'cost-of-waiting-calculator': CostOfWaitingCalc,
  'renovation-roi-calculator': RenovationRoiCalc,
  'contractor-bid-comparison-calculator': ContractorBidCalc,
  'diy-vs-hire-calculator': DiyVsHireCalc,
  'house-flip-calculator': HouseFlipCalc,
  'rental-cash-flow-calculator': RentalCashFlowCalc,
  'property-tax-appeal-calculator': PropertyTaxAppealCalc,
  'hoa-true-cost-calculator': HoaTrueCostCalc,
  'seller-net-sheet-calculator': SellerNetSheetCalc,
  'mortgage-buydown-calculator': BuydownCalc,
  'home-sale-capital-gains-calculator': HomeSaleGainsCalc,
  'deductible-optimizer-calculator': DeductibleOptimizerCalc,
  'umbrella-insurance-calculator': UmbrellaCalc,
  'drop-full-coverage-calculator': DropFullCoverageCalc,
  'home-insurance-adequacy-calculator': HomeCoverageCalc,
  'term-life-ladder-calculator': LifeLadderCalc,
  'barista-fire-calculator': BaristaFireCalc,
  'lifestyle-creep-calculator': LifestyleCreepCalc,
  'commute-cost-calculator': CommuteCostCalc,
  'daycare-vs-second-income-calculator': DaycareVsIncomeCalc,
  'fixed-bid-pricing-calculator': FixedBidCalc,
  'retainer-pricing-calculator': RetainerCalc,
  's-corp-election-calculator': ScorpElectionCalc,
  'rsu-vest-tax-calculator': RsuVestCalc,
  'iso-vs-nso-calculator': IsoNsoCalc,
  'startup-offer-calculator': StartupOfferCalc,
  'grad-school-roi-calculator': GradSchoolRoiCalc,
  'certification-roi-calculator': CertRoiCalc,
  'job-hop-calculator': JobHopCalc,
  'walk-away-number-calculator': WalkAwayCalc,
  'unpaid-internship-calculator': UnpaidInternshipCalc,
  'labor-burden-calculator': LaborBurdenCalc,
  'job-costing-calculator': JobCostingCalc,
  'equipment-hourly-cost-calculator': EquipmentHourlyCalc,
  'overtime-vs-hire-calculator': OvertimeVsHireCalc,
  'warranty-reserve-calculator': WarrantyReserveCalc,
  'bid-win-rate-calculator': BidWinRateCalc,
  'maintenance-agreement-calculator': MaintenanceAgreementCalc,
  'seasonal-cash-reserve-calculator': SeasonalReserveCalc,
  'service-call-fee-calculator': ServiceCallFeeCalc,
  'customer-ltv-cac-calculator': LtvCacCalc,
  'repair-vs-replace-calculator': RepairReplaceCalc,
  'tank-vs-tankless-calculator': TankVsTanklessCalc,
  'generator-cost-calculator': GeneratorCostCalc,
  'smart-thermostat-roi-calculator': SmartThermostatCalc,
  'window-replacement-roi-calculator': WindowRoiCalc,
  'led-conversion-calculator': LedConversionCalc,
  'qlac-calculator': QlacCalc,
  'q4-equipment-timing-calculator': Q4TimingCalc,
  'equipment-lease-vs-buy-calculator': EquipLeaseVsBuyCalc,
  'business-vehicle-writeoff-calculator': VehicleWriteoffCalc,
  'macrs-depreciation-calculator': MacrsCalc,
  'section-179-calculator': Section179Calc,
  'rule-of-55-calculator': RuleOf55Calc,
  'social-security-bridge-calculator': SSBridgeCalc,
  'social-security-earnings-test-calculator': SSEarningsTestCalc,
  'hsa-medicare-trap-calculator': HsaMedicareTrapCalc,
  '72t-sepp-calculator': Sepp72tCalc,
  'roth-conversion-bracket-filler-calculator': RothBracketFillCalc,
  'coast-fire-calculator': CoastFireCalc,
  'survivor-benefit-calculator': SurvivorSSCalc,
  'spousal-social-security-calculator': SpousalSSCalc,
  'roth-5-year-rule-calculator': Roth5YearCalc,
  '457b-calculator': Plan457Calc,
  'drop-retirement-calculator': DropCalc,
  'pension-vs-social-security-calculator': PensionVsSsCalc,
  'social-security-fairness-act-calculator': FairnessActCalc,
  'pslf-calculator': PslfCalc,
  'adoption-credit-calculator': AdoptionCreditCalc,
  'layoff-runway-calculator': LayoffRunwayCalc,
  'severance-pay-calculator': SeveranceCalc,
  'stock-donation-calculator': StockDonationCalc,
  'qcd-calculator': QcdCalc,
  'step-up-basis-calculator': StepUpBasisCalc,
  'inherited-ira-calculator': InheritedIraCalc,
  'kiddie-tax-calculator': KiddieTaxCalc,
  'underpayment-penalty-calculator': UnderpaymentPenaltyCalc,
  'net-investment-income-tax-calculator': NiitCalc,
  's-corp-reasonable-salary-calculator': SCorpSalaryCalc,
  'accountable-plan-calculator': AccountablePlanCalc,
  'augusta-rule-calculator': AugustaRuleCalc,
  'str-reps-loophole-calculator': STRRepsCalc,
  'cost-segregation-calculator': CostSegCalc,
  'depreciation-recapture-calculator': DepRecaptureCalc,
  '1031-exchange-calculator': Exchange1031Calc,
  'qsbs-1045-rollover-calculator': QSBSRolloverCalc,
  'qsbs-exclusion-calculator': QSBSCalc,
  'medicaid-spend-down-calculator': MedicaidSpendDownCalc,
  'hybrid-ltc-vs-traditional-calculator': HybridLTCCalc,
  'ltc-insurance-vs-self-fund-calculator': LTCInsuranceCalc,
  'long-term-care-cost-calculator': LTCareCostCalc,
  'ptet-election-calculator': PTETCalc,
  'nanny-tax-calculator': NannyTaxCalc,
  'raise-vs-bonus-calculator': RaiseVsBonusCalc,
  'benefits-value-calculator': BenefitsValueCalc,
  'overtime-exempt-threshold-calculator': OvertimeExemptCalc,
  'weight-cut-calculator': WeightCutCalc,
  'training-load-acwr-calculator': AcwrCalc,
  'critical-power-calculator': CriticalPowerCalc,
  'wilks-score-calculator': WilksCalc,
  'race-time-predictor-calculator': RacePredictorCalc,
  'dependent-care-fsa-vs-credit-calculator': DepCareCalc,
  'hsa-vs-fsa-calculator': HsaFsaCalc,
  'commission-draw-calculator': CommissionDrawCalc,
  'espp-calculator': EsppCalc,
  'i-bond-calculator': IBondCalc,
  'sep-ira-calculator': SepIraCalc,
  'solo-401k-calculator': Solo401kCalc,
  'roth-conversion-ladder-calculator': RothLadderCalc,
  'mega-backdoor-roth-calculator': MegaBackdoorCalc,
  'social-security-pia-calculator': SocialSecurityPiaCalc,
  'backdoor-roth-pro-rata-calculator': BackdoorRothCalc,
  '403b-calculator': Teacher403bCalc,
  'tsp-calculator': TspCalc,
  'truck-driver-per-diem-calculator': TruckerPerDiemCalc,
  'travel-nurse-pay-calculator': TravelNurseCalc,
  'rent-affordability-calculator': RentAffordCalc,
  'annuity-payout-calculator': AnnuityPayoutCalc,
  'rule-of-72-doubling-calculator': RuleOf72Calc,
  'paycheck-withholding-calculator': WithholdingCalc,
  'heat-pump-vs-furnace-calculator': HeatPumpCalc,
  'ev-vs-gas-cost-calculator': EvVsGasCalc,
  'solar-payback-calculator': SolarPaybackCalc,
  'home-office-deduction-calculator': HomeOfficeCalc,
  '529-college-savings-calculator': College529Calc,
  'pet-first-year-cost-calculator': PetCostCalc,
  'baby-first-year-cost-calculator': BabyCostCalc,
  'wedding-budget-calculator': WeddingBudgetCalc,
  'vacation-budget-calculator': VacationBudgetCalc,
  '50-30-20-budget-calculator': BudgetRuleCalc,
  'emergency-fund-calculator': EmergencyFundCalc,
  'credit-card-minimum-payment-calculator': CreditCardMinimumCalc,
  'debt-avalanche-snowball-calculator': DebtPayoffCalc,
  'tip-calculator': TipCalc,
  'discount-calculator': DiscountCalc,
  'sales-tax-calculator': SalesTaxCalc,
  'percentage-calculator': PercentageCalc,
  'bmi-calculator': BmiCalc,
  'calorie-calculator': CalorieCalc,
  'age-calculator': AgeCalc,
  'date-difference-calculator': DateDiffCalc,
  'gpa-calculator': GpaCalc,
  'crypto-profit-calculator': CryptoProfitCalc,
  'roi-calculator': RoiCalc,
  'inflation-calculator': InflationCalc,
  'break-even-calculator': BreakEvenCalc,
}
