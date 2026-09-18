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

export const MORE_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
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
