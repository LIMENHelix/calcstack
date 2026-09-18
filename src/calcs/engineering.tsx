import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { num } from '@/lib/calc'

/* ---------------- Beam Load (moment / shear / stress / deflection) ---------------- */

type BeamCase = 'ss-point' | 'ss-uniform' | 'cant-point' | 'cant-uniform'

const BEAM_CASES: { key: BeamCase; label: string }[] = [
  { key: 'ss-point', label: 'Simply supported — point load at center' },
  { key: 'ss-uniform', label: 'Simply supported — uniform load' },
  { key: 'cant-point', label: 'Cantilever — point load at free end' },
  { key: 'cant-uniform', label: 'Cantilever — uniform load' },
]

export function BeamCalc(_props: CalcProps) {
  const [beamCase, setBeamCase] = useState<BeamCase>('ss-point')
  const [pointLoad, setPointLoad] = useNumber(1000) // lb
  const [uniformLoad, setUniformLoad] = useNumber(100) // lb/ft
  const [span, setSpan] = useNumber(10) // ft
  const [elasticity, setElasticity] = useNumber(29000000) // psi (steel)
  const [inertia, setInertia] = useNumber(30.8) // in^4 (W8x10)
  const [sectionMod, setSectionMod] = useNumber(7.81) // in^3

  const r = useMemo(() => {
    const L_in = span * 12
    const uniform = beamCase === 'ss-uniform' || beamCase === 'cant-uniform'
    // w in lb/ft → lb/in for the formulas
    const w = uniformLoad / 12
    let maxShear = 0 // lb
    let maxMomentLbIn = 0
    let deflection = 0 // in
    if (beamCase === 'ss-point') {
      maxShear = pointLoad / 2
      maxMomentLbIn = (pointLoad * L_in) / 4
      deflection = (pointLoad * L_in ** 3) / (48 * elasticity * inertia)
    } else if (beamCase === 'ss-uniform') {
      maxShear = (uniformLoad * span) / 2
      maxMomentLbIn = (w * L_in ** 2) / 8
      deflection = (5 * w * L_in ** 4) / (384 * elasticity * inertia)
    } else if (beamCase === 'cant-point') {
      maxShear = pointLoad
      maxMomentLbIn = pointLoad * L_in
      deflection = (pointLoad * L_in ** 3) / (3 * elasticity * inertia)
    } else {
      maxShear = uniformLoad * span
      maxMomentLbIn = (w * L_in ** 2) / 2
      deflection = (w * L_in ** 4) / (8 * elasticity * inertia)
    }
    const stressPsi = sectionMod > 0 ? maxMomentLbIn / sectionMod : 0
    const spanRatio = deflection > 0 ? L_in / deflection : Infinity
    return { maxShear, maxMomentLbIn, maxMomentLbFt: maxMomentLbIn / 12, deflection, stressPsi, spanRatio, uniform }
  }, [beamCase, pointLoad, uniformLoad, span, elasticity, inertia, sectionMod])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Beam configuration</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={beamCase}
              onChange={(e) => setBeamCase(e.target.value as BeamCase)}
            >
              {BEAM_CASES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          {r.uniform ? (
            <Field label="Uniform load" value={uniformLoad} onChange={setUniformLoad} suffix="lb/ft" />
          ) : (
            <Field label="Point load" value={pointLoad} onChange={setPointLoad} suffix="lb" />
          )}
          <Field label="Span" value={span} onChange={setSpan} suffix="ft" />
          <Field label="Modulus of elasticity E (steel ≈ 29,000,000)" value={elasticity} onChange={setElasticity} suffix="psi" />
          <Field label="Moment of inertia I (W8×10 ≈ 30.8)" value={inertia} onChange={setInertia} suffix="in⁴" />
          <Field label="Section modulus S (W8×10 ≈ 7.81)" value={sectionMod} onChange={setSectionMod} suffix="in³" />
        </div>
        <div className="space-y-3">
          <Result big label="Max bending moment" value={`${num(r.maxMomentLbFt, 0)} lb·ft`} />
          <Result label="Max shear" value={`${num(r.maxShear, 1)} lb`} />
          <Result label="Bending stress (M/S)" value={`${num(r.stressPsi, 0)} psi`} />
          <Result label="Max deflection" value={`${num(r.deflection, 3)} in`} />
          <Result label="Deflection ratio (L/x)" value={isFinite(r.spanRatio) ? `L/${num(r.spanRatio, 0)}` : '—'} />
          <p className="text-sm text-muted-foreground">
            {r.stressPsi > 0 && elasticity >= 20000000
              ? `A36 steel yields at 36,000 psi; this beam sees ${num(r.stressPsi, 0)} psi (${num((r.stressPsi / 36000) * 100, 0)}% of yield — before safety factors). `
              : ''}
            Deflection limits are usually L/360 for floors with plaster, L/240 for roofs —{' '}
            {isFinite(r.spanRatio)
              ? r.spanRatio >= 360
                ? `L/${num(r.spanRatio, 0)} clears both.`
                : r.spanRatio >= 240
                  ? `L/${num(r.spanRatio, 0)} clears roofs but not plastered floors.`
                  : `L/${num(r.spanRatio, 0)} fails common serviceability limits — stiffen the section.`
              : ''}{' '}
            Elastic formulas for first-pass sizing only; real design applies code load combinations and
            safety factors (see the load combination calculator).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- ASCE 7 Load Combinations (LRFD) ---------------- */

export function LoadComboCalc(_props: CalcProps) {
  const [dead, setDead] = useNumber(50) // psf
  const [live, setLive] = useNumber(40)
  const [snow, setSnow] = useNumber(30)
  const [wind, setWind] = useNumber(20)

  const r = useMemo(() => {
    // ASCE 7 basic LRFD combinations (strength design), simplified common cases
    const combos = [
      { name: '1.4D', value: 1.4 * dead, note: 'Dead load only' },
      { name: '1.2D + 1.6L + 0.5S', value: 1.2 * dead + 1.6 * live + 0.5 * snow, note: 'Live load governs' },
      { name: '1.2D + 1.6S + 1.0L', value: 1.2 * dead + 1.6 * snow + 1.0 * live, note: 'Snow governs' },
      { name: '1.2D + 1.0W + 1.0L + 0.5S', value: 1.2 * dead + 1.0 * wind + 1.0 * live + 0.5 * snow, note: 'Wind with gravity' },
      { name: '0.9D + 1.0W', value: 0.9 * dead + 1.0 * wind, note: 'Uplift / overturning check' },
    ]
    const governing = combos.reduce((a, c) => (c.value > a.value ? c : a), combos[0])
    return { combos, governing }
  }, [dead, live, snow, wind])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Dead load D" value={dead} onChange={setDead} suffix="psf" />
          <Field label="Live load L" value={live} onChange={setLive} suffix="psf" />
          <Field label="Snow load S" value={snow} onChange={setSnow} suffix="psf" />
          <Field label="Wind load W" value={wind} onChange={setWind} suffix="psf" />
          <p className="text-xs text-muted-foreground">
            ASCE 7 basic strength-design combinations, gravity-focused subset (roof live load Lr and
            rain R folded into S). Seismic (E) combos are a separate chapter — not included here.
            Verify against the current ASCE 7 edition and your local amendments before designing
            anything real.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Governing load" value={`${num(r.governing.value, 1)} psf (${r.governing.name})`} />
          {r.combos.map((c) => (
            <Result key={c.name} label={`${c.name} — ${c.note}`} value={`${num(c.value, 1)} psf`} />
          ))}
          <p className="text-sm text-muted-foreground">
            Design members for the governing combination, not the sum of loads. The 0.9D + 1.0W case
            looks small but it is the one that rips roofs off: dead load resisting uplift is reduced,
            not increased.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Horsepower ↔ Torque ---------------- */

export function HpTorqueCalc(_props: CalcProps) {
  const [mode, setMode] = useState<'hp' | 'torque'>('hp')
  const [torque, setTorque] = useNumber(300) // lb-ft
  const [hp, setHp] = useNumber(228.5)
  const [rpm, setRpm] = useNumber(4000)

  const r = useMemo(() => {
    // HP = T(lb-ft) × RPM / 5252  (5252 = 33,000 ft·lb/min ÷ 2π)
    const solvedHp = mode === 'hp' ? (torque * rpm) / 5252 : hp
    const solvedTorque = mode === 'torque' ? (hp * 5252) / rpm : torque
    const kw = solvedHp * 0.745699872
    const nm = solvedTorque * 1.35581795
    return { hp: solvedHp, torque: solvedTorque, kw, nm }
  }, [mode, torque, hp, rpm])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['hp', 'torque'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  mode === m ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {m === 'hp' ? 'Solve for HP' : 'Solve for torque'}
              </button>
            ))}
          </div>
          {mode === 'hp' ? (
            <Field label="Torque" value={torque} onChange={setTorque} suffix="lb·ft" />
          ) : (
            <Field label="Horsepower" value={hp} onChange={setHp} suffix="hp" />
          )}
          <Field label="RPM" value={rpm} onChange={setRpm} suffix="rpm" />
          <p className="text-xs text-muted-foreground">
            HP = T × RPM ÷ 5,252, exactly (5,252 ≈ 33,000 ft·lb/min ÷ 2π). Torque and horsepower
            curves always cross at 5,252 RPM — that is arithmetic, not engineering.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label={mode === 'hp' ? 'Horsepower' : 'Torque'} value={mode === 'hp' ? `${num(r.hp, 1)} hp` : `${num(r.torque, 1)} lb·ft`} />
          <Result label="Kilowatts" value={`${num(r.kw, 1)} kW`} />
          <Result label="Torque (newton-meters)" value={`${num(r.nm, 1)} N·m`} />
          <Result label="At 5,252 RPM" value="torque lb·ft = horsepower, always" />
          <p className="text-sm text-muted-foreground">
            Gearing multiplies torque, never power: a 3:1 reduction triples axle torque at one-third
            the RPM (minus friction). That is why motor sizing starts with the torque the load
            actually needs at the speed it actually runs.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- RC Circuit / Filter ---------------- */

export function RcCalc(_props: CalcProps) {
  const [resistance, setResistance] = useNumber(10000) // ohms
  const [capacitanceUf, setCapacitanceUf] = useNumber(0.1) // microfarads

  const r = useMemo(() => {
    const c = capacitanceUf * 1e-6
    const tau = resistance * c // seconds
    const cutoff = tau > 0 ? 1 / (2 * Math.PI * tau) : 0
    const t63 = tau
    const t99 = tau * 4.60517 // ln(100) ≈ 4.605
    return { tau, cutoff, t63, t99 }
  }, [resistance, capacitanceUf])

  const fmtTime = (s: number) => (s >= 1 ? `${num(s, 3)} s` : s >= 0.001 ? `${num(s * 1000, 3)} ms` : `${num(s * 1e6, 1)} µs`)
  const fmtFreq = (f: number) => (f >= 1000 ? `${num(f / 1000, 2)} kHz` : `${num(f, 1)} Hz`)

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Resistance R" value={resistance} onChange={setResistance} suffix="Ω" />
          <Field label="Capacitance C" value={capacitanceUf} onChange={setCapacitanceUf} suffix="µF" />
          <p className="text-xs text-muted-foreground">
            τ = RC (seconds); cutoff frequency f = 1 ÷ (2πRC). The −3 dB point where a filter passes
            half power. One τ charges a capacitor to 63.2%; about 4.6τ reaches 99%.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Time constant τ" value={fmtTime(r.tau)} />
          <Result label="Cutoff frequency (−3 dB)" value={fmtFreq(r.cutoff)} />
          <Result label="Charge to 63.2%" value={fmtTime(r.t63)} />
          <Result label="Charge to 99%" value={fmtTime(r.t99)} />
          <p className="text-sm text-muted-foreground">
            Same math everywhere: debouncing a switch, smoothing rectified AC, timing a 555, or
            setting a crossover. If your signal is near {fmtFreq(r.cutoff)}, this filter attenuates
            it 3 dB — design cutoffs a decade away from the frequencies you care about.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const ENG_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'beam-load-calculator': BeamCalc,
  'load-combination-calculator': LoadComboCalc,
  'horsepower-torque-calculator': HpTorqueCalc,
  'rc-circuit-calculator': RcCalc,
}
