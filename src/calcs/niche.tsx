import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { num } from '@/lib/calc'

function Select({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
}

function mmss(totalMinutes: number): string {
  if (!isFinite(totalMinutes) || totalMinutes <= 0) return '—'
  const m = Math.floor(totalMinutes)
  const s = Math.round((totalMinutes - m) * 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/* ---------------- One-Rep Max ---------------- */

export function OneRepMaxCalc() {
  const [weight, setWeight] = useNumber(185)
  const [reps, setReps] = useNumber(5)
  const r = useMemo(() => {
    const epley = weight * (1 + reps / 30)
    const brzycki = reps >= 37 ? NaN : weight * (36 / (37 - reps))
    const orm = reps === 1 ? weight : (epley + (isFinite(brzycki) ? brzycki : epley)) / 2
    const pcts = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50]
    return { epley, brzycki, orm, pcts }
  }, [weight, reps])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Weight lifted" value={weight} onChange={setWeight} suffix="lb" />
        <Field label="Reps performed (1–12 most accurate)" value={reps} onChange={setReps} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Estimated 1RM (average)" value={`${num(r.orm, 1)} lb`} />
        <Result label="Epley formula" value={`${num(r.epley, 1)} lb`} />
        <Result label="Brzycki formula" value={isFinite(r.brzycki) ? `${num(r.brzycki, 1)} lb` : '—'} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Training percentages</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {r.pcts.map((p) => (
            <div key={p} className="rounded-lg border p-2 text-center">
              <p className="text-xs text-muted-foreground">{p}%</p>
              <p className="font-semibold">{num(r.orm * p / 100, 1)}</p>
            </div>
          ))}
        </div>
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Heart Rate Zones (Karvonen) ---------------- */

export function HeartRateZoneCalc() {
  const [age, setAge] = useNumber(30)
  const [resting, setResting] = useNumber(60)
  const zones = useMemo(() => {
    const max = 220 - age
    const hrr = max - resting
    const band = (lo: number, hi: number) =>
      `${Math.round(resting + hrr * lo)}–${Math.round(resting + hrr * hi)} bpm`
    return [
      { name: 'Zone 1 — Recovery', range: band(0.5, 0.6) },
      { name: 'Zone 2 — Endurance / fat burn', range: band(0.6, 0.7) },
      { name: 'Zone 3 — Aerobic', range: band(0.7, 0.8) },
      { name: 'Zone 4 — Threshold', range: band(0.8, 0.9) },
      { name: 'Zone 5 — Max effort', range: band(0.9, 1.0) },
    ]
  }, [age, resting])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Age" value={age} onChange={setAge} suffix="years" step="1" />
        <Field label="Resting heart rate" value={resting} onChange={setResting} suffix="bpm" step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result big label="Estimated max HR" value={`${220 - age} bpm`} />
        <Result label="Heart rate reserve" value={`${220 - age - resting} bpm`} />
      </div>
      <div className="space-y-2">
        {zones.map((z) => (
          <div key={z.name} className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">{z.name}</span>
            <span className="font-semibold text-primary">{z.range}</span>
          </div>
        ))}
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Macro Calculator ---------------- */

export function MacroCalc() {
  const [weight, setWeight] = useNumber(170)
  const [height, setHeight] = useNumber(68)
  const [age, setAge] = useNumber(30)
  const [sex, setSex] = useState('m')
  const [activity, setActivity] = useState('1.45')
  const [goal, setGoal] = useState('maintain')

  const r = useMemo(() => {
    const kg = weight * 0.453592
    const cm = height * 2.54
    const bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === 'm' ? 5 : -161)
    let cal = bmr * parseFloat(activity)
    if (goal === 'cut') cal *= 0.8
    if (goal === 'bulk') cal *= 1.1
    const proteinPerKg = goal === 'cut' ? 2.0 : goal === 'bulk' ? 1.6 : 1.8
    const protein = kg * proteinPerKg
    const fat = (cal * 0.25) / 9
    const carbs = (cal - protein * 4 - fat * 9) / 4
    return { cal, protein, fat, carbs }
  }, [weight, height, age, sex, activity, goal])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Weight" value={weight} onChange={setWeight} suffix="lb" />
        <Field label="Height" value={height} onChange={setHeight} suffix="in" />
        <Field label="Age" value={age} onChange={setAge} suffix="years" step="1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Sex" value={sex} onChange={setSex} options={[['m', 'Male'], ['f', 'Female']]} />
        <Select label="Activity level" value={activity} onChange={setActivity} options={[
          ['1.2', 'Sedentary'], ['1.375', 'Light (1–3 days/wk)'], ['1.45', 'Moderate (3–5 days/wk)'],
          ['1.6', 'Very active (6–7 days/wk)'], ['1.75', 'Athlete / physical job'],
        ]} />
        <Select label="Goal" value={goal} onChange={setGoal} options={[
          ['cut', 'Fat loss (−20%)'], ['maintain', 'Maintain'], ['bulk', 'Muscle gain (+10%)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Daily calories" value={`${num(r.cal, 0)}`} />
        <Result label="Protein" value={`${num(r.protein, 0)} g`} />
        <Result label="Carbs" value={`${num(r.carbs, 0)} g`} />
        <Result label="Fat" value={`${num(r.fat, 0)} g`} />
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Running Pace ---------------- */

export function RunningPaceCalc() {
  const [distance, setDistance] = useNumber(10)
  const [unit, setUnit] = useState('km')
  const [hours, setHours] = useNumber(0)
  const [minutes, setMinutes] = useNumber(50)
  const [seconds, setSeconds] = useNumber(0)

  const r = useMemo(() => {
    const km = unit === 'km' ? distance : distance * 1.60934
    const mins = hours * 60 + minutes + seconds / 60
    const paceKm = mins / km
    const paceMi = mins / (km / 1.60934)
    const speedKph = km / (mins / 60)
    const riegel = (dKm: number) => mins * Math.pow(dKm / km, 1.06)
    return {
      paceKm, paceMi, speedKph,
      p5k: riegel(5), p10k: riegel(10), pHm: riegel(21.0975), pM: riegel(42.195),
    }
  }, [distance, unit, hours, minutes, seconds])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Distance" value={distance} onChange={setDistance} />
        <Select label="Unit" value={unit} onChange={setUnit} options={[['km', 'Kilometers'], ['mi', 'Miles']]} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Hours" value={hours} onChange={setHours} step="1" />
        <Field label="Minutes" value={minutes} onChange={setMinutes} step="1" />
        <Field label="Seconds" value={seconds} onChange={setSeconds} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Pace per km" value={mmss(r.paceKm)} />
        <Result big label="Pace per mile" value={mmss(r.paceMi)} />
        <Result label="Speed" value={`${num(r.speedKph, 1)} km/h`} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Equivalent race times (Riegel prediction)</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[['5K', r.p5k], ['10K', r.p10k], ['Half marathon', r.pHm], ['Marathon', r.pM]].map(([l, v]) => (
            <div key={l as string} className="rounded-lg border p-2 text-center">
              <p className="text-xs text-muted-foreground">{l}</p>
              <p className="font-semibold">{mmss(v as number)}</p>
            </div>
          ))}
        </div>
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Mulch ---------------- */

export function MulchCalc() {
  const [area, setArea] = useNumber(500)
  const [depth, setDepth] = useNumber(3)
  const r = useMemo(() => {
    const cuft = (area * depth) / 12
    return { cuft, cuyd: cuft / 27, bags2: cuft / 2, bags3: cuft / 3 }
  }, [area, depth])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Area to cover" value={area} onChange={setArea} suffix="sq ft" />
        <Field label="Depth" value={depth} onChange={setDepth} suffix="inches" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Cubic yards (bulk)" value={num(r.cuyd, 2)} />
        <Result label="Cubic feet" value={num(r.cuft, 0)} />
        <Result label="2 cu ft bags" value={num(r.bags2, 0)} />
        <Result label="3 cu ft bags" value={num(r.bags3, 0)} />
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Gravel ---------------- */

export function GravelCalc() {
  const [length, setLength] = useNumber(40)
  const [width, setWidth] = useNumber(10)
  const [depth, setDepth] = useNumber(4)
  const r = useMemo(() => {
    const cuft = (length * width * depth) / 12
    const cuyd = cuft / 27
    return { cuft, cuyd, tons: cuyd * 1.4 }
  }, [length, width, depth])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Depth" value={depth} onChange={setDepth} suffix="in" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Tons needed (approx)" value={num(r.tons, 2)} />
        <Result label="Cubic yards" value={num(r.cuyd, 2)} />
        <Result label="Cubic feet" value={num(r.cuft, 0)} />
      </div>
      <p className="text-xs text-muted-foreground">Tonnage assumes ~1.4 tons per cubic yard, typical for crushed stone. Add 5–10% for compaction and waste.</p>
    </CardContent></Card>
  )
}

/* ---------------- Concrete ---------------- */

export function ConcreteCalc() {
  const [length, setLength] = useNumber(10)
  const [width, setWidth] = useNumber(10)
  const [depth, setDepth] = useNumber(4)
  const r = useMemo(() => {
    const cuft = (length * width * depth) / 12
    return { cuft, cuyd: cuft / 27, bags80: cuft / 0.6, bags60: cuft / 0.45 }
  }, [length, width, depth])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Thickness" value={depth} onChange={setDepth} suffix="in" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Cubic yards" value={num(r.cuyd, 2)} />
        <Result label="Cubic feet" value={num(r.cuft, 1)} />
        <Result label="80 lb bags" value={num(r.bags80, 0)} />
        <Result label="60 lb bags" value={num(r.bags60, 0)} />
      </div>
      <p className="text-xs text-muted-foreground">Ready-mix is usually economical above ~1 cubic yard. Order 5–10% extra for spillage and uneven subgrade.</p>
    </CardContent></Card>
  )
}

/* ---------------- Body Fat (US Navy) ---------------- */

export function BodyFatCalc() {
  const [sex, setSex] = useState('m')
  const [height, setHeight] = useNumber(70)
  const [waist, setWaist] = useNumber(34)
  const [neck, setNeck] = useNumber(15)
  const [hip, setHip] = useNumber(38)

  const bf = useMemo(() => {
    const cm = (i: number) => i * 2.54
    if (sex === 'm') {
      const d = cm(waist) - cm(neck)
      if (d <= 0) return NaN
      return 495 / (1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(cm(height))) - 450
    }
    const d = cm(waist) + cm(hip) - cm(neck)
    if (d <= 0) return NaN
    return 495 / (1.29579 - 0.35004 * Math.log10(d) + 0.221 * Math.log10(cm(height))) - 450
  }, [sex, height, waist, neck, hip])

  const category = !isFinite(bf) ? '—'
    : sex === 'm'
      ? bf < 6 ? 'Essential fat' : bf < 14 ? 'Athletes' : bf < 18 ? 'Fitness' : bf < 25 ? 'Average' : 'Above average'
      : bf < 14 ? 'Essential fat' : bf < 21 ? 'Athletes' : bf < 25 ? 'Fitness' : bf < 32 ? 'Average' : 'Above average'

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Sex" value={sex} onChange={setSex} options={[['m', 'Male'], ['f', 'Female']]} />
        <Field label="Height" value={height} onChange={setHeight} suffix="in" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Waist (at navel)" value={waist} onChange={setWaist} suffix="in" />
        <Field label="Neck" value={neck} onChange={setNeck} suffix="in" />
        {sex === 'f' && <Field label="Hip (widest)" value={hip} onChange={setHip} suffix="in" />}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result big label="Estimated body fat" value={isFinite(bf) ? `${num(bf, 1)}%` : '—'} />
        <Result label="Category (ACE bands)" value={category} />
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Final Grade ---------------- */

export function FinalGradeCalc() {
  const [current, setCurrent] = useNumber(87)
  const [weight, setWeight] = useNumber(30)
  const [target, setTarget] = useNumber(90)

  const needed = useMemo(() => {
    const w = weight / 100
    if (w <= 0) return NaN
    return (target - current * (1 - w)) / w
  }, [current, weight, target])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Current grade" value={current} onChange={setCurrent} suffix="%" />
        <Field label="Final exam weight" value={weight} onChange={setWeight} suffix="%" />
        <Field label="Grade you want" value={target} onChange={setTarget} suffix="%" />
      </div>
      <div className="grid gap-3 sm:grid-cols-1">
        <Result big label="You need on the final" value={
          !isFinite(needed) ? '—'
          : needed > 100 ? `${num(needed, 1)}% — not possible without extra credit`
          : needed <= 0 ? '0% — your grade is locked in 🎉'
          : `${num(needed, 1)}%`
        } />
      </div>
    </CardContent></Card>
  )
}

/* ---------------- Ohm's Law ---------------- */

export function OhmsLawCalc() {
  const [mode, setMode] = useState('vi')
  const [a, setA] = useNumber(12)
  const [b, setB] = useNumber(2)

  const r = useMemo(() => {
    let V = NaN, I = NaN, R = NaN, P = NaN
    switch (mode) {
      case 'vi': V = a; I = b; R = V / I; P = V * I; break
      case 'vr': V = a; R = b; I = V / R; P = V * I; break
      case 'vp': V = a; P = b; I = P / V; R = V / I; break
      case 'ir': I = a; R = b; V = I * R; P = V * I; break
      case 'ip': I = a; P = b; V = P / I; R = V / I; break
      case 'rp': R = a; P = b; V = Math.sqrt(P * R); I = V / R; break
    }
    return { V, I, R, P }
  }, [mode, a, b])

  const labels: Record<string, [string, string, string, string]> = {
    vi: ['Voltage', 'V', 'Current', 'A'],
    vr: ['Voltage', 'V', 'Resistance', 'Ω'],
    vp: ['Voltage', 'V', 'Power', 'W'],
    ir: ['Current', 'A', 'Resistance', 'Ω'],
    ip: ['Current', 'A', 'Power', 'W'],
    rp: ['Resistance', 'Ω', 'Power', 'W'],
  }
  const [la, ua, lb, ub] = labels[mode]

  return (
    <Card><CardContent className="space-y-4 p-5">
      <Select label="I know these two" value={mode} onChange={setMode} options={[
        ['vi', 'Voltage & Current'], ['vr', 'Voltage & Resistance'], ['vp', 'Voltage & Power'],
        ['ir', 'Current & Resistance'], ['ip', 'Current & Power'], ['rp', 'Resistance & Power'],
      ]} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={la} value={a} onChange={setA} suffix={ua} />
        <Field label={lb} value={b} onChange={setB} suffix={ub} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Voltage" value={`${num(r.V, 3)} V`} />
        <Result label="Current" value={`${num(r.I, 3)} A`} />
        <Result label="Resistance" value={`${num(r.R, 3)} Ω`} />
        <Result label="Power" value={`${num(r.P, 3)} W`} />
      </div>
    </CardContent></Card>
  )
}

export const NICHE_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'one-rep-max-calculator': OneRepMaxCalc,
  'heart-rate-zone-calculator': HeartRateZoneCalc,
  'macro-calculator': MacroCalc,
  'running-pace-calculator': RunningPaceCalc,
  'mulch-calculator': MulchCalc,
  'gravel-calculator': GravelCalc,
  'concrete-calculator': ConcreteCalc,
  'body-fat-calculator': BodyFatCalc,
  'final-grade-calculator': FinalGradeCalc,
  'ohms-law-calculator': OhmsLawCalc,
}
