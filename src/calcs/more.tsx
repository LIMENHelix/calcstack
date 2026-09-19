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
