import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import type { CalcProps } from './index'
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

/* ---------------- Periodization Planner (Bompa model) ---------------- */

interface Phase { name: string; share: number; intensity: string; reps: string; focus: string }

const PLANS: Record<string, Phase[]> = {
  strength: [
    { name: 'Anatomical Adaptation', share: 0.15, intensity: '40–65% 1RM', reps: '8–15', focus: 'Technique, tendon & core conditioning, balanced development' },
    { name: 'Maximum Strength', share: 0.45, intensity: '70–100% 1RM', reps: '1–6', focus: 'High loads, full recoveries, progressive overload' },
    { name: 'Conversion to Power', share: 0.25, intensity: '30–80% 1RM', reps: '1–5 explosive', focus: 'Speed of contraction, ballistic and plyometric work' },
    { name: 'Taper & Peak', share: 0.10, intensity: 'Openers only', reps: '1–3', focus: 'Cut volume 40–60%, keep intensity, arrive fresh' },
  ],
  hypertrophy: [
    { name: 'Anatomical Adaptation', share: 0.15, intensity: '40–65% 1RM', reps: '8–15', focus: 'Work capacity, technique under moderate load' },
    { name: 'Hypertrophy', share: 0.50, intensity: '70–80% 1RM', reps: '6–12', focus: 'Volume accumulation, 3–6 sets per muscle group' },
    { name: 'Maximum Strength', share: 0.25, intensity: '75–90% 1RM', reps: '3–6', focus: 'Convert size into strength density' },
    { name: 'Taper / Peak Week', share: 0.10, intensity: 'Light pump work', reps: '12–15', focus: 'Volume deload before stage or photoshoot' },
  ],
  endurance: [
    { name: 'Anatomical Adaptation', share: 0.20, intensity: '40–60% 1RM', reps: '12–20', focus: 'Injury-proofing, circuit training, posture' },
    { name: 'Strength Endurance', share: 0.45, intensity: '30–60% 1RM', reps: '15–30+', focus: 'Long sets, short rests, sport-specific patterns' },
    { name: 'Specific Conditioning', share: 0.25, intensity: 'Sport pace', reps: 'Intervals', focus: 'Race-pace and threshold work' },
    { name: 'Taper', share: 0.10, intensity: 'Easy', reps: '—', focus: 'Volume down 40–60%, intensity stays' },
  ],
}

export function PeriodizationCalc(_props: CalcProps) {
  const today = new Date().toISOString().slice(0, 10)
  const defaultComp = new Date(Date.now() + 16 * 7 * 864e5).toISOString().slice(0, 10)
  const [start, setStart] = useState(today)
  const [comp, setComp] = useState(defaultComp)
  const [goal, setGoal] = useState('strength')
  const [exp, setExp] = useState('advanced')

  const plan = useMemo(() => {
    const s = new Date(start + 'T00:00:00')
    const c = new Date(comp + 'T00:00:00')
    const totalWeeks = Math.round((c.getTime() - s.getTime()) / (7 * 864e5))
    if (totalWeeks < 4) return null

    let phases = PLANS[goal].map((p) => ({ ...p }))
    if (exp === 'beginner') {
      // Bompa: novices need a longer anatomical adaptation phase
      const aa = phases[0]
      const extra = Math.min(0.10, aa.share)
      aa.share += extra
      phases[1].share = Math.max(0.1, phases[1].share - extra)
    }

    // allocate integer weeks proportionally, taper fixed 1–2
    const taperIdx = phases.length - 1
    const taperWeeks = totalWeeks >= 12 ? 2 : 1
    let remaining = totalWeeks - taperWeeks
    const rows: { phase: Phase; weeks: number; from: Date; to: Date }[] = []
    const workShares = phases.slice(0, taperIdx)
    const shareSum = workShares.reduce((a, p) => a + p.share, 0)
    let cursor = new Date(s)
    workShares.forEach((p, i) => {
      let w = Math.round((p.share / shareSum) * remaining)
      if (w < 1) w = 1
      if (i === workShares.length - 1) w = remaining // give rounding remainder to last work phase
      remaining -= w
      const from = new Date(cursor)
      const to = new Date(cursor.getTime() + w * 7 * 864e5)
      rows.push({ phase: p, weeks: w, from, to })
      cursor = to
    })
    rows.push({ phase: phases[taperIdx], weeks: taperWeeks, from: cursor, to: c })
    return { totalWeeks, rows }
  }, [start, comp, goal, exp])

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Training start date</p>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Competition / peak date</p>
          <input type="date" value={comp} onChange={(e) => setComp(e.target.value)}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Training goal" value={goal} onChange={setGoal} options={[
          ['strength', 'Maximum strength → power (powerlifting, field sports)'],
          ['hypertrophy', 'Hypertrophy → strength (bodybuilding, physique)'],
          ['endurance', 'Strength endurance (running, cycling, team sports)'],
        ]} />
        <Select label="Training experience" value={exp} onChange={setExp} options={[
          ['beginner', 'Beginner (0–2 years)'], ['advanced', 'Intermediate / advanced'],
        ]} />
      </div>

      {!plan ? (
        <p className="text-sm text-destructive">Pick dates at least 4 weeks apart — Bompa&apos;s model needs room for real phases.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3">Phase</th><th className="py-2 pr-3">Dates</th>
                <th className="py-2 pr-3">Wks</th><th className="py-2 pr-3">Load</th>
                <th className="py-2 pr-3">Reps</th><th className="py-2">Focus</th>
              </tr>
            </thead>
            <tbody>
              {plan.rows.map((r) => (
                <tr key={r.phase.name} className="border-b last:border-0">
                  <td className="py-2.5 pr-3 font-semibold">{r.phase.name}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{fmt(r.from)} – {fmt(r.to)}</td>
                  <td className="py-2.5 pr-3">{r.weeks}</td>
                  <td className="py-2.5 pr-3">{r.phase.intensity}</td>
                  <td className="py-2.5 pr-3">{r.phase.reps}</td>
                  <td className="py-2.5 text-muted-foreground">{r.phase.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">
            {plan.totalWeeks}-week macrocycle, Bompa linear model. Peak on competition day;
            repeat with heavier loads for the next macrocycle.
          </p>
        </div>
      )}
    </CardContent></Card>
  )
}

/* ---------------- CKD / Glycogen Carb-Up (McDonald) ---------------- */

export function CkdCarbUpCalc(_props: CalcProps) {
  const [weight, setWeight] = useNumber(180)
  const [bf, setBf] = useNumber(15)
  const [duration, setDuration] = useState('24')
  const [activity, setActivity] = useState('14')

  const r = useMemo(() => {
    const lbmLb = weight * (1 - bf / 100)
    const lbmKg = lbmLb * 0.453592
    // McDonald keto guidelines: protein anchored to lean mass
    const proteinLo = lbmLb * 0.7
    const proteinHi = lbmLb * 0.9
    const maintenance = weight * parseFloat(activity) // McDonald quick estimate: 12–16 kcal/lb
    const proteinMid = (proteinLo + proteinHi) / 2
    const fatG = Math.max(0, (maintenance - proteinMid * 4) / 9)
    // Carb-up targets (g/kg LBM): 24h CKD ≈ 5–6, 48h UD2-style ≈ 12–16
    const [lo, hi] = duration === '24' ? [5, 6] : [12, 16]
    const carbsLo = lo * lbmKg
    const carbsHi = hi * lbmKg
    // Glycogen + water: 60–80% of carb-up carbs stored as glycogen (supercompensation
    // after a depleted keto week pushes storage up); each g binds ~3 g water. Add gut
    // content and extra water (~1–2 lb) for the realistic morning-after reading.
    const glyLo = carbsLo * 0.6
    const glyHi = carbsHi * 0.8
    const scaleLo = (glyLo * 4) / 453.592 + 1 // lbs on the scale
    const scaleHi = (glyHi * 4) / 453.592 + 2
    return { lbmLb, lbmKg, proteinLo, proteinHi, maintenance, fatG, carbsLo, carbsHi, scaleLo, scaleHi }
  }, [weight, bf, duration, activity])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Body weight" value={weight} onChange={setWeight} suffix="lb" />
        <Field label="Body fat" value={bf} onChange={setBf} suffix="%" />
        <Select label="Carb-up length" value={duration} onChange={setDuration} options={[
          ['24', '24-hour (classic CKD)'], ['48', '36–48 hour (UD2-style refeed)'],
        ]} />
      </div>
      <Select label="Activity level (for maintenance estimate)" value={activity} onChange={setActivity} options={[
        ['12', 'Sedentary (~12 kcal/lb)'], ['14', 'Moderately active (~14 kcal/lb)'], ['16', 'Very active (~16 kcal/lb)'],
      ]} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Lean body mass" value={`${num(r.lbmLb, 0)} lb`} />
        <Result label="Keto protein (daily)" value={`${num(r.proteinLo, 0)}–${num(r.proteinHi, 0)} g`} />
        <Result label="Keto fat (daily, approx)" value={`${num(r.fatG, 0)} g`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Carb-up carbs" value={`${num(r.carbsLo, 0)}–${num(r.carbsHi, 0)} g`} />
        <Result label="Expected scale jump" value={`+${num(r.scaleLo, 1)}–${num(r.scaleHi, 1)} lb`} />
        <Result label="Maintenance kcal (est)" value={`${num(r.maintenance, 0)}`} />
      </div>
      <p className="text-xs text-muted-foreground">
        Based on Lyle McDonald&apos;s published CKD / Ultimate Diet 2.0 guidelines: protein anchored to lean mass,
        carb-up volume scaled to LBM. The scale jump is glycogen (60–80% storage), ~3 g of water per gram, plus gut
        content — real-world reports run roughly 3–7 lb after a full carb-up. It is water and glycogen, not fat,
        and drains back out over the following keto week.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Velocity-Based Training ---------------- */

/* Average load–velocity profiles from published research (González-Badillo et al.).
   [%1RM, mean concentric velocity m/s] — individual profiles vary ±. */
const VBT_PROFILES: Record<string, { name: string; mvt: number; table: [number, number][] }> = {
  bench: {
    name: 'Bench press', mvt: 0.17,
    table: [[100, 0.17], [90, 0.29], [80, 0.42], [70, 0.55], [60, 0.70], [50, 0.85], [40, 1.00]],
  },
  squat: {
    name: 'Back squat', mvt: 0.30,
    table: [[100, 0.30], [90, 0.45], [80, 0.60], [70, 0.75], [60, 0.90], [50, 1.05], [40, 1.20]],
  },
  deadlift: {
    name: 'Deadlift', mvt: 0.15,
    table: [[100, 0.15], [90, 0.25], [80, 0.38], [70, 0.50], [60, 0.65], [50, 0.80], [40, 0.95]],
  },
}

function pctFromVelocity(table: [number, number][], v: number): number {
  if (v <= table[0][1]) return 100
  for (let i = 1; i < table.length; i++) {
    const [p1, v1] = table[i - 1]
    const [p2, v2] = table[i]
    if (v <= v2) return p1 + ((v - v1) / (v2 - v1)) * (p2 - p1)
  }
  return table[table.length - 1][0] * (table[table.length - 1][1] / v)
}

export function VelocityCalc(_props: CalcProps) {
  const [lift, setLift] = useState('bench')
  const [load, setLoad] = useNumber(185)
  const [velocity, setVelocity] = useNumber(0.5)

  const r = useMemo(() => {
    const prof = VBT_PROFILES[lift]
    const pct = pctFromVelocity(prof.table, velocity)
    const orm = pct > 0 ? (load / pct) * 100 : NaN
    return { pct, orm, prof }
  }, [lift, load, velocity])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Lift" value={lift} onChange={setLift} options={[
          ['bench', 'Bench press'], ['squat', 'Back squat'], ['deadlift', 'Deadlift'],
        ]} />
        <Field label="Load on the bar" value={load} onChange={setLoad} suffix="lb" />
        <Field label="Mean velocity" value={velocity} onChange={setVelocity} suffix="m/s" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Estimated %1RM" value={`${num(r.pct, 0)}%`} />
        <Result label="Estimated daily 1RM" value={isFinite(r.orm) ? `${num(r.orm, 1)} lb` : '—'} />
        <Result label="Min velocity threshold" value={`${r.prof.mvt} m/s`} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">{VBT_PROFILES[lift].name} reference profile</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {VBT_PROFILES[lift].table.map(([p, v]) => (
            <div key={p} className="rounded-lg border p-2 text-center">
              <p className="text-xs text-muted-foreground">{p}%</p>
              <p className="text-sm font-semibold">{v.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Based on average load–velocity profiles from published research. Individual profiles vary by
        several percent — for programming, build your own profile over 2–3 sessions and re-check monthly.
        Stop a set when velocity drops ~20% from the first rep for strength work.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- VO2max (Cooper / Rockport — ACSM & Fahey) ---------------- */

export function Vo2maxCalc(_props: CalcProps) {
  const [mode, setMode] = useState('cooper')
  const [minutes, setMinutes] = useNumber(12)
  const [seconds, setSeconds] = useNumber(0)
  const [age, setAge] = useNumber(30)
  const [weight, setWeight] = useNumber(170)
  const [sex, setSex] = useState('m')
  const [hr, setHr] = useNumber(130)

  const vo2 = useMemo(() => {
    const t = minutes + seconds / 60
    if (mode === 'cooper') {
      if (t <= 0) return NaN
      const metersPerMin = 2413.5 / t // 1.5 miles in meters
      return 0.2 * metersPerMin + 3.5
    }
    // Rockport 1-mile walk test
    return 132.853 - 0.0769 * weight - 0.3877 * age + 6.315 * (sex === 'm' ? 1 : 0) - 3.2649 * t - 0.1565 * hr
  }, [mode, minutes, seconds, age, weight, sex, hr])

  const band = !isFinite(vo2) ? '—'
    : vo2 >= 46 ? 'Excellent' : vo2 >= 40 ? 'Good' : vo2 >= 34 ? 'Fair' : vo2 >= 28 ? 'Below average' : 'Poor'

  return (
    <Card><CardContent className="space-y-4 p-5">
      <Select label="Test protocol" value={mode} onChange={setMode} options={[
        ['cooper', 'Cooper 1.5-mile run (fastest time)'],
        ['rockport', 'Rockport 1-mile walk test'],
      ]} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Minutes" value={minutes} onChange={setMinutes} step="1" />
        <Field label="Seconds" value={seconds} onChange={setSeconds} step="1" />
      </div>
      {mode === 'rockport' && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Age" value={age} onChange={setAge} step="1" />
          <Field label="Weight" value={weight} onChange={setWeight} suffix="lb" />
          <Select label="Sex" value={sex} onChange={setSex} options={[['m', 'Male'], ['f', 'Female']]} />
          <Field label="HR at finish" value={hr} onChange={setHr} suffix="bpm" step="1" />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Estimated VO₂max" value={isFinite(vo2) ? `${num(vo2, 1)} ml/kg/min` : '—'} />
        <Result label="Fitness band (general)" value={band} />
        <Result label="METs" value={isFinite(vo2) ? num(vo2 / 3.5, 1) : '—'} />
      </div>
      <p className="text-xs text-muted-foreground">
        Field-test estimates used in ACSM guidelines and exercise physiology texts (Fahey, Fit &amp; Well).
        Bands are general adult reference ranges — lab testing with a metabolic cart is the gold standard.
      </p>
    </CardContent></Card>
  )
}

export const SPORTS_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'periodization-planner': PeriodizationCalc,
  'ckd-carb-up-calculator': CkdCarbUpCalc,
  'velocity-based-training-calculator': VelocityCalc,
  'vo2max-calculator': Vo2maxCalc,
}
