import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { num } from '@/lib/calc'

const LB_TO_KG = 0.45359237

/* ---------------- Glycogen Stores ---------------- */

const GLYCOGEN_G_PER_KG_MUSCLE = { untrained: 12, recreational: 15, trained: 20 } as const

export function GlycogenCalc(_props: CalcProps) {
  const [weightLb, setWeightLb] = useNumber(180)
  const [bodyFat, setBodyFat] = useNumber(15)
  const [status, setStatus] = useState<keyof typeof GLYCOGEN_G_PER_KG_MUSCLE>('trained')

  const r = useMemo(() => {
    const weightKg = weightLb * LB_TO_KG
    const leanKg = weightKg * (1 - bodyFat / 100)
    // Skeletal muscle is roughly half of lean mass for most adults (textbook estimate)
    const muscleKg = leanKg * 0.5
    const muscleGlycogen = muscleKg * GLYCOGEN_G_PER_KG_MUSCLE[status]
    const liver = 100 // g, standard reference value
    const total = muscleGlycogen + liver
    const energyKcal = total * 4
    const waterG = total * 3 // each gram of glycogen binds ~3 g of water
    const scaleLb = (total + waterG) / 453.59237
    return { weightKg, muscleKg, muscleGlycogen, liver, total, energyKcal, waterG, scaleLb }
  }, [weightLb, bodyFat, status])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Body weight" value={weightLb} onChange={setWeightLb} suffix="lb" />
          <Field label="Body fat" value={bodyFat} onChange={setBodyFat} suffix="%" />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Training status</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as keyof typeof GLYCOGEN_G_PER_KG_MUSCLE)}
            >
              <option value="untrained">Untrained (~12 g/kg muscle)</option>
              <option value="recreational">Recreational (~15 g/kg muscle)</option>
              <option value="trained">Trained / endurance-adapted (~20 g/kg muscle)</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            Estimates follow standard exercise-physiology figures: skeletal muscle ≈ half of lean mass;
            glycogen concentration 12–20 g/kg muscle by training status; liver ≈ 100 g; each gram of
            glycogen binds ~3 g of water.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Total glycogen stores" value={`${num(r.total, 0)} g`} />
          <Result label="Muscle glycogen" value={`${num(r.muscleGlycogen, 0)} g`} />
          <Result label="Liver glycogen" value={`${num(r.liver, 0)} g`} />
          <Result label="Energy stored as glycogen" value={`${num(r.energyKcal, 0)} kcal`} />
          <Result label="Scale weight of glycogen + bound water" value={`${num(r.scaleLb, 1)} lb`} />
          <p className="text-sm text-muted-foreground">
            That {num(r.scaleLb, 1)} lb is why the scale jumps after a refeed and crashes during a diet
            week — glycogen plus its bound water moves pounds without touching fat. A hard training
            session can burn through 25–40% of muscle glycogen; a marathon can nearly empty it.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Carb Loading ---------------- */

export function CarbLoadingCalc(_props: CalcProps) {
  const [weightLb, setWeightLb] = useNumber(180)
  const [days, setDays] = useNumber(2)

  const r = useMemo(() => {
    const kg = weightLb * LB_TO_KG
    const low = 10 * kg // g/day — Burke/ACSM consensus range 10–12 g/kg/day
    const high = 12 * kg
    const perMealLow = low / 4
    const perMealHigh = high / 4
    const totalLow = low * days
    const totalHigh = high * days
    return { kg, low, high, perMealLow, perMealHigh, totalLow, totalHigh }
  }, [weightLb, days])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Body weight" value={weightLb} onChange={setWeightLb} suffix="lb" />
          <Field label="Loading days before the event" value={days} onChange={setDays} suffix="days" />
          <p className="text-xs text-muted-foreground">
            The classic protocol (Burke, ACSM position stand): 10–12 g of carbohydrate per kg of body
            weight per day for 36–48 hours before a 90+ minute event, while training tapers. Shorter
            events don&apos;t need it — normal eating covers glycogen for anything under ~90 minutes.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Carbs per day" value={`${num(r.low, 0)}–${num(r.high, 0)} g`} />
          <Result label="Per meal (4 meals + snacks)" value={`${num(r.perMealLow, 0)}–${num(r.perMealHigh, 0)} g`} />
          <Result label={`Total over ${num(days, 0)} days`} value={`${num(r.totalLow, 0)}–${num(r.totalHigh, 0)} g`} />
          <Result label="Carb calories per day" value={`${num(r.low * 4, 0)}–${num(r.high * 4, 0)} kcal`} />
          <p className="text-sm text-muted-foreground">
            At {num(r.kg, 1)} kg, most of your plate becomes rice, pasta, bread, and sports drink for
            two days. Keep fat and fiber low so the volume is eatable, and expect the scale to climb
            2–4 lb — that is glycogen and water, i.e. fuel.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Sweat Rate / Hydration ---------------- */

export function SweatRateCalc(_props: CalcProps) {
  const [preLb, setPreLb] = useNumber(180)
  const [postLb, setPostLb] = useNumber(178)
  const [fluidOz, setFluidOz] = useNumber(32)
  const [urineOz, setUrineOz] = useNumber(0)
  const [hours, setHours] = useNumber(2)

  const r = useMemo(() => {
    const weightLossMl = Math.max(0, (preLb - postLb) * 453.59237) // 1 g ≈ 1 ml sweat
    const fluidMl = fluidOz * 29.5735
    const urineMl = urineOz * 29.5735
    const sweatMl = Math.max(0, weightLossMl + fluidMl - urineMl)
    const rateMlH = hours > 0 ? sweatMl / hours : 0
    const replaceLow = sweatMl * 1.25
    const replaceHigh = sweatMl * 1.5
    const perHourLow = hours > 0 ? replaceLow / hours : 0
    const perHourHigh = hours > 0 ? replaceHigh / hours : 0
    const dehydrationPct = preLb > 0 ? ((preLb - postLb) / preLb) * 100 : 0
    return { sweatMl, rateMlH, replaceLow, replaceHigh, perHourLow, perHourHigh, dehydrationPct }
  }, [preLb, postLb, fluidOz, urineOz, hours])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Weight before session (dry, minimal clothing)" value={preLb} onChange={setPreLb} suffix="lb" />
          <Field label="Weight after session (toweled off)" value={postLb} onChange={setPostLb} suffix="lb" />
          <Field label="Fluid consumed during" value={fluidOz} onChange={setFluidOz} suffix="oz" />
          <Field label="Urine during (if any)" value={urineOz} onChange={setUrineOz} suffix="oz" />
          <Field label="Session length" value={hours} onChange={setHours} suffix="hrs" />
        </div>
        <div className="space-y-3">
          <Result big label="Sweat rate" value={`${num(r.rateMlH, 0)} ml/hr (${num(r.rateMlH / 29.5735, 0)} oz/hr)`} />
          <Result label="Total sweat loss" value={`${num(r.sweatMl, 0)} ml`} />
          <Result label="Body weight lost" value={`${num(r.dehydrationPct, 1)}%`} />
          <Result label="Replace after session (125–150%)" value={`${num(r.replaceLow, 0)}–${num(r.replaceHigh, 0)} ml`} />
          <Result label="Drink during similar sessions" value={`${num(r.perHourLow, 0)}–${num(r.perHourHigh, 0)} ml/hr`} />
          <p className="text-sm text-muted-foreground">
            ACSM guidance: keep body-mass loss under 2% during exercise and replace 125–150% of losses
            in the hours after (the extra covers ongoing urine losses). You lost{' '}
            {num(r.dehydrationPct, 1)}% —{' '}
            {r.dehydrationPct > 2
              ? 'above the 2% performance threshold; drink more during the session next time.'
              : 'within the 2% performance threshold. Well managed.'}{' '}
            Sweat carries roughly 500–1,000 mg of sodium per liter, so long or salty sweaters should
            include electrolytes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- DOTS Powerlifting Score ---------------- */

const DOTS = {
  male: { A: -0.000001093, B: 0.0007391293, C: -0.1918759221, D: 24.0900756, E: -307.75076 },
  female: { A: -0.0000010706, B: 0.0005158568, C: -0.1126655495, D: 13.6175032, E: -57.96288 },
} as const

function dotsScore(totalKg: number, bwKg: number, sex: keyof typeof DOTS): number {
  const { A, B, C, D, E } = DOTS[sex]
  const denom = A * bwKg ** 4 + B * bwKg ** 3 + C * bwKg ** 2 + D * bwKg + E
  return denom > 0 ? (totalKg * 500) / denom : 0
}

function dotsBand(score: number): string {
  if (score < 200) return 'Beginner'
  if (score < 300) return 'Novice'
  if (score < 400) return 'Intermediate'
  if (score < 500) return 'Advanced'
  return 'Elite'
}

export function DotsCalc(_props: CalcProps) {
  const [sex, setSex] = useState<keyof typeof DOTS>('male')
  const [bwLb, setBwLb] = useNumber(198)
  const [squatLb, setSquatLb] = useNumber(405)
  const [benchLb, setBenchLb] = useNumber(275)
  const [deadliftLb, setDeadliftLb] = useNumber(495)

  const r = useMemo(() => {
    const totalLb = squatLb + benchLb + deadliftLb
    const totalKg = totalLb * LB_TO_KG
    const bwKg = bwLb * LB_TO_KG
    const score = dotsScore(totalKg, bwKg, sex)
    return { totalLb, totalKg, bwKg, score, band: dotsBand(score) }
  }, [sex, bwLb, squatLb, benchLb, deadliftLb])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['male', 'female'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
                  sex === s ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Field label="Body weight" value={bwLb} onChange={setBwLb} suffix="lb" />
          <Field label="Best squat" value={squatLb} onChange={setSquatLb} suffix="lb" />
          <Field label="Best bench press" value={benchLb} onChange={setBenchLb} suffix="lb" />
          <Field label="Best deadlift" value={deadliftLb} onChange={setDeadliftLb} suffix="lb" />
          <p className="text-xs text-muted-foreground">
            DOTS (2019): Total(kg) × 500 ÷ a 4th-degree polynomial of body weight. Used by USAPL/USPA
            for best-lifter awards; the IPF itself uses IPF GL points. Scores are comparable only
            within the same sex division.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="DOTS score" value={num(r.score, 1)} />
          <Result label="Classification" value={r.band} />
          <Result label="Powerlifting total" value={`${num(r.totalLb, 0)} lb (${num(r.totalKg, 1)} kg)`} />
          <Result label="Body weight" value={`${num(r.bwKg, 1)} kg`} />
          <p className="text-sm text-muted-foreground">
            Reference bands: under 200 beginner, 200–300 novice, 300–400 intermediate, 400–500
            advanced, 500+ elite. Regional meet winners usually score 350–420; national-level lifters
            exceed 400.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const SPORTSCI_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'glycogen-calculator': GlycogenCalc,
  'carb-loading-calculator': CarbLoadingCalc,
  'sweat-rate-calculator': SweatRateCalc,
  'dots-score-calculator': DotsCalc,
}
