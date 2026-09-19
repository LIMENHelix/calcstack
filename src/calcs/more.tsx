import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useNumber, Field, Result } from './index'
import { usd, num } from '@/lib/calc'

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

// QSBS §1202 — OBBBA §70432: stock acquired AFTER July 4, 2025: tiered exclusion 50% @3yr / 75% @4yr / 100% @5yr, cap greater of $15M or 10× basis, $75M gross-assets ceiling; 7% AMT preference on the excluded amount for the 3/4-yr tiers (not modeled — noted). Pre-OBBBA (≤ Jul 4, 2025, post-9/27/2010): 100% only after MORE than 5 years, cap greater of $10M or 10× basis, $50M ceiling. Non-excluded §1202 gain is taxed at the special 28% rate (§1(h)(4)) + 3.8% NIIT = 31.8% — NOT the regular 15/20% LTCG brackets, which is why a failed QSBS bet costs MORE than ordinary stock (pre-OBBBA 4.5-yr sale: −$960k vs no-QSBS). States: CA, PA, AL, MS don't conform (tax the gain fully); NJ conforms from 2026; WA hits it with the 7% excise over $270k. Node-verified: $12M gain/$100k basis/5yr post → $0 tax, $2,856,000 saved; 4yr → $954,000 tax; $30M gain/$5M basis → 10× basis cap $50M wins.
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
    const fed = taxable * 0.318
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
            <><span className="font-medium">No exclusion at {num(yrs, 1)} years.</span> {post ? 'The tiers start at 3 years (50%).' : 'Legacy stock needs MORE than 5 years — one day short means 0%.'} And here's the trap: the full {usd(r.taxable)} gain is taxed at 28% + 3.8% NIIT ({usd(r.fed)}), which is <span className="font-medium">worse than the 23.8% an ordinary stock would pay</span> — a failed QSBS bet costs you {usd(-r.save)} extra. A §1045 rollover into new QSBS within 60 days keeps the clock running instead. </>
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
