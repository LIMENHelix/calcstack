import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

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

function CostNote() {
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Quantities are codebook math from your inputs. Unit costs are editable typical-range defaults —
      replace them with supplier quotes. Electrical and HVAC work may require permits and licensed
      contractors; verify against NEC / local code and a Manual J for final design.
    </p>
  )
}

// NEC Chapter 9 Table 8 — circular mils and 75°C copper ampacities (THHN)
const WIRE: Record<string, { cm: number; ampCu: number; ampAl: number }> = {
  '14': { cm: 4110, ampCu: 20, ampAl: 0 },
  '12': { cm: 6530, ampCu: 25, ampAl: 20 },
  '10': { cm: 10380, ampCu: 35, ampAl: 30 },
  '8': { cm: 16510, ampCu: 50, ampAl: 40 },
  '6': { cm: 26240, ampCu: 65, ampAl: 50 },
  '4': { cm: 41740, ampCu: 85, ampAl: 65 },
  '3': { cm: 52620, ampCu: 100, ampAl: 75 },
  '2': { cm: 66360, ampCu: 115, ampAl: 90 },
  '1': { cm: 83690, ampCu: 130, ampAl: 100 },
  '1/0': { cm: 105600, ampCu: 150, ampAl: 120 },
  '2/0': { cm: 133100, ampCu: 175, ampAl: 135 },
  '3/0': { cm: 167800, ampCu: 200, ampAl: 155 },
  '4/0': { cm: 211600, ampCu: 230, ampAl: 180 },
}
// NOTE: Object.keys would reorder integer-like keys ('1' before '8') — keep explicit order
const GAUGES = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0']

/* ---------------- Voltage Drop ---------------- */

export function VoltageDropCalc() {
  const [amps, setAmps] = useNumber(20)
  const [length, setLength] = useNumber(100)
  const [voltage, setVoltage] = useState('120')
  const [gauge, setGauge] = useState('12')
  const [material, setMaterial] = useState('cu')
  const [wireCost, setWireCost] = useNumber(0.75)

  const r = useMemo(() => {
    const K = material === 'cu' ? 12.9 : 21.2 // ohm-CM/ft at 75°C
    const V = parseFloat(voltage)
    const w = WIRE[gauge]
    // Single-phase: Vd = 2 × K × L × I / CM
    const vd = (2 * K * length * amps) / w.cm
    const pct = (vd / V) * 100
    // Smallest gauge meeting 3% (and still ampacity-legal)
    let minGauge = '—'
    for (const g of GAUGES) {
      const wg = WIRE[g]
      const ampOk = material === 'cu' ? amps <= wg.ampCu : amps <= wg.ampAl && wg.ampAl > 0
      const vdG = (2 * K * length * amps) / wg.cm
      if (ampOk && (vdG / V) * 100 <= 3) { minGauge = g; break }
    }
    const pass = pct <= 3
    return { vd, pct, pass, minGauge, circuitFt: length * 2 }
  }, [amps, length, voltage, gauge, material])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Load current" value={amps} onChange={setAmps} suffix="A" />
        <Field label="One-way distance" value={length} onChange={setLength} suffix="ft" />
        <Select label="System voltage" value={voltage} onChange={setVoltage} options={[
          ['120', '120 V'], ['240', '240 V'], ['208', '208 V'], ['277', '277 V'], ['480', '480 V'],
        ]} />
        <Select label="Wire gauge" value={gauge} onChange={setGauge} options={GAUGES.map((g) => [g, `${g} AWG`])} />
        <Select label="Conductor" value={material} onChange={setMaterial} options={[['cu', 'Copper'], ['al', 'Aluminum']]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Voltage drop" value={`${num(r.vd, 2)} V (${num(r.pct, 2)}%)`} />
        <Result label="NEC 3% branch check" value={r.pass ? '✓ Passes' : '✗ Exceeds 3%'} />
        <Result label="Smallest size that passes" value={r.minGauge === '—' ? 'Beyond 4/0' : `${r.minGauge} AWG`} />
        <Result label="Wire in circuit (round trip)" value={`${num(r.circuitFt, 0)} ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Formula: Vd = 2 × K × L × I ÷ CM (single phase), K = 12.9 copper / 21.2 aluminum at 75°C, CM from NEC
        Chapter 9 Table 8. NEC recommends ≤3% drop on branch circuits (≤5% total feeder + branch) as a
        performance guideline. Long runs to outbuildings and RV pedestals are where this bites.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Wire cost per ft (round-trip run)" value={wireCost} onChange={setWireCost} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Result label="Wire for this run" value={usd(r.circuitFt * wireCost, 2)} />
          <Result label="If upsized to passing gauge" value={r.minGauge === '—' ? '—' : usd(r.circuitFt * wireCost * 1.6, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Wire Ampacity & Breaker Sizing ---------------- */

const BREAKERS = [15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200]

export function WireSizeCalc() {
  const [load, setLoad] = useNumber(40)
  const [continuous, setContinuous] = useState('yes')
  const [material, setMaterial] = useState('cu')
  const [voltage, setVoltage] = useState('240')

  const r = useMemo(() => {
    const required = continuous === 'yes' ? load * 1.25 : load // NEC 210.19/215.2: 125% for continuous
    let gauge = '—'
    let ampacity = 0
    for (const g of GAUGES) {
      const w = WIRE[g]
      const a = material === 'cu' ? w.ampCu : w.ampAl
      if (a > 0 && required <= a) { gauge = g; ampacity = a; break }
    }
    const breaker = BREAKERS.find((b) => b >= required) ?? 200
    const watts = load * parseFloat(voltage)
    return { required, gauge, ampacity, breaker, watts }
  }, [load, continuous, material, voltage])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Load" value={load} onChange={setLoad} suffix="A" />
        <Select label="Continuous load (3+ hrs)?" value={continuous} onChange={setContinuous} options={[
          ['yes', 'Yes — EV charger, heater, lighting'], ['no', 'No — intermittent'],
        ]} />
        <Select label="Conductor" value={material} onChange={setMaterial} options={[['cu', 'Copper'], ['al', 'Aluminum']]} />
        <Select label="Voltage (for wattage)" value={voltage} onChange={setVoltage} options={[
          ['120', '120 V'], ['240', '240 V'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Minimum wire size" value={r.gauge === '—' ? 'Beyond 4/0' : `${r.gauge} AWG ${material === 'cu' ? 'Cu' : 'Al'}`} />
        <Result label="Breaker" value={`${r.breaker} A`} />
        <Result label="Design amps (with 125% rule)" value={num(r.required, 1)} />
        <Result label="Load wattage" value={`${num(r.watts / 1000, 2)} kW`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Ampacities from NEC Table 310.16 at 75°C (THHN in conduit, ≤3 current-carrying conductors).
        Continuous loads multiply by 125% before sizing wire and breaker. Terminals, bundling, ambient
        temperature, and NM-B (Romex, 60°C column) can all lower the legal ampacity — when in doubt, the
        inspector and a licensed electrician outrank this table.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- HVAC BTU Load (Manual-J-lite) ---------------- */

export function BtuLoadCalc() {
  const [area, setArea] = useNumber(1500)
  const [climate, setClimate] = useState('moderate')
  const [insulation, setInsulation] = useState('average')
  const [ceiling, setCeiling] = useNumber(8)
  const [sun, setSun] = useState('average')
  const [occupants, setOccupants] = useNumber(3)
  const [tonCost, setTonCost] = useNumber(3500)

  const r = useMemo(() => {
    const basePerSqft = { cold: 35, moderate: 30, hot: 25 }[climate] ?? 30 // heating-dominant vs cooling-dominant baseline
    let btu = area * basePerSqft
    btu *= { poor: 1.25, average: 1, good: 0.85 }[insulation] ?? 1
    btu *= Math.max(1, ceiling / 8) // taller ceilings, more volume
    btu *= { shaded: 0.9, average: 1, fullsun: 1.15 }[sun] ?? 1
    btu += Math.max(0, occupants - 2) * 600 // 600 BTU/hr per person beyond the first two
    const tons = btu / 12000
    const sizes = [1.5, 2, 2.5, 3, 3.5, 4, 5]
    const unit = sizes.find((s) => s >= tons) ?? 5
    return { btu, tons, unit, cost: unit * tonCost }
  }, [area, climate, insulation, ceiling, sun, occupants, tonCost])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Conditioned area" value={area} onChange={setArea} suffix="sq ft" />
        <Select label="Climate" value={climate} onChange={setClimate} options={[
          ['cold', 'Cold (heating-dominant north)'], ['moderate', 'Moderate / mixed'], ['hot', 'Hot (cooling-dominant south)'],
        ]} />
        <Select label="Insulation & windows" value={insulation} onChange={setInsulation} options={[
          ['poor', 'Poor (pre-1980, single pane)'], ['average', 'Average'], ['good', 'Good (new / updated)'],
        ]} />
        <Field label="Ceiling height" value={ceiling} onChange={setCeiling} suffix="ft" />
        <Select label="Sun exposure" value={sun} onChange={setSun} options={[
          ['shaded', 'Heavily shaded'], ['average', 'Average'], ['fullsun', 'Full sun / big west windows'],
        ]} />
        <Field label="Regular occupants" value={occupants} onChange={setOccupants} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Estimated load" value={`${num(r.btu, 0)} BTU/hr`} />
        <Result label="Cooling tons" value={`${num(r.tons, 2)} tons`} />
        <Result label="Typical unit size" value={`${r.unit} tons`} />
        <Result label="Window unit equivalent" value={`${num(r.btu / 1000, 0)}k BTU`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Rules of thumb (20–35 BTU per sq ft) are a starting point only — real sizing needs a Manual J load
        calculation with your insulation values, window areas, and local design temperatures. Oversizing is
        as bad as undersizing: short cycles wreck humidity control and efficiency.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Installed cost per ton" value={tonCost} onChange={setTonCost} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Result label="Estimated installed system" value={usd(r.cost)} />
          <Result label="Per sq ft of home" value={usd(r.cost / Math.max(1, area), 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Plumbing Pipe Sizing (fixture units) ---------------- */

const FIXTURES: Record<string, { fu: number; label: string }> = {
  toilet: { fu: 3, label: 'Toilet (tank type)' },
  sink: { fu: 1, label: 'Bathroom sink' },
  shower: { fu: 2, label: 'Shower' },
  tub: { fu: 2, label: 'Bathtub' },
  kitchen: { fu: 2, label: 'Kitchen sink' },
  dishwasher: { fu: 2, label: 'Dishwasher' },
  washer: { fu: 2, label: 'Clothes washer' },
  hosebib: { fu: 3, label: 'Hose bib / outdoor spigot' },
}

export function PipeSizeCalc() {
  const [counts, setCounts] = useState<Record<string, number>>({
    toilet: 2, sink: 2, shower: 1, tub: 0, kitchen: 1, dishwasher: 1, washer: 1, hosebib: 2,
  })

  const r = useMemo(() => {
    const fu = Object.entries(counts).reduce((sum, [k, c]) => sum + (FIXTURES[k]?.fu ?? 0) * c, 0)
    // Hunter-style probable simultaneous demand, residential tank-type: GPM ≈ 1.4 × FU^0.55 (small-system fit)
    const gpm = fu > 0 ? 1.4 * Math.pow(fu, 0.55) : 0
    // Size for ≤8 ft/s: area = gpm/8 → d inches; step up through standard sizes
    const sizes: [number, number][] = [[0.5, 7], [0.75, 13], [1, 22], [1.25, 35], [1.5, 48], [2, 85]] // max GPM at ~8 ft/s
    const pipe = sizes.find(([, maxGpm]) => gpm <= maxGpm)
    return { fu, gpm, pipe: pipe ? `${pipe[0]}"` : '>2" (commercial calc)' }
  }, [counts])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <p className="text-sm text-muted-foreground">Count each fixture the line will serve:</p>
      <div className="grid gap-3 sm:grid-cols-4">
        {Object.entries(FIXTURES).map(([key, f]) => (
          <Field
            key={key}
            label={`${f.label} (${f.fu} FU)`}
            value={counts[key] ?? 0}
            onChange={(v) => setCounts((prev) => ({ ...prev, [key]: Math.max(0, Math.round(parseFloat(v) || 0)) }))}
            step="1"
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Recommended supply line" value={r.pipe} />
        <Result label="Total fixture units" value={num(r.fu, 0)} />
        <Result label="Probable peak demand" value={`${num(r.gpm, 1)} GPM`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Fixture units (UPC/IPC style) convert fixtures into probable simultaneous demand — not every tap runs
        at once. Pipe sizes keep velocity under ~8 ft/s to limit noise, wear, and pressure loss. Long runs,
        low street pressure, and flushometer fixtures need a real design; local code governs.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Box fill (NEC 314.16) ---------------- */

// NEC Table 314.16(B)(1) volume allowances, cu in per conductor
const WIRE_VOL: Record<string, number> = { '14': 2.0, '12': 2.25, '10': 2.5, '8': 3.0, '6': 5.0 }
// NEC Table 314.16(A) standard metal box volumes, cu in
const BOXES: [string, number][] = [
  ['3×2×2 device (10.0)', 10.0], ['3×2×2½ device (12.5)', 12.5], ['3×2×2¾ device (14.0)', 14.0],
  ['3×2×3½ deep device (18.0)', 18.0], ['4×1½ octagon (15.5)', 15.5], ['4×2⅛ octagon (21.5)', 21.5],
  ['4×1¼ square (18.0)', 18.0], ['4×1½ square (21.0)', 21.0], ['4×2⅛ square (30.3)', 30.3],
  ['4-11/16×1½ square (29.5)', 29.5], ['4-11/16×2⅛ square (42.0)', 42.0],
  ['Handy 4×2⅛×1⅞ (13.0)', 13.0],
]

export function BoxFillCalc() {
  const [n14, setN14] = useNumber(4)
  const [n12, setN12] = useNumber(0)
  const [n10, setN10] = useNumber(0)
  const [devices, setDevices] = useNumber(1)
  const [clamps, setClamps] = useState('yes')
  const [grounds, setGrounds] = useNumber(1)
  const [largest, setLargest] = useState('14')
  const [boxIdx, setBoxIdx] = useState('7')

  const r = useMemo(() => {
    // NEC 314.16(B): conductors 1 allowance each; all grounds together 1 (largest ground);
    // internal clamps 1 (largest conductor); each device yoke 2 (largest conductor on it);
    // pigtails originating and ending in the box are free.
    const lw = WIRE_VOL[largest]
    const conductors = n14 * WIRE_VOL['14'] + n12 * WIRE_VOL['12'] + n10 * WIRE_VOL['10']
    const groundAllow = grounds > 0 ? lw : 0 // simplified: grounds sized with circuit
    const clampAllow = clamps === 'yes' ? lw : 0
    const deviceAllow = devices * 2 * lw
    const total = conductors + groundAllow + clampAllow + deviceAllow
    const boxVol = BOXES[parseInt(boxIdx)][1]
    const smallest = BOXES.find(([, v]) => v >= total)
    return { conductors, groundAllow, clampAllow, deviceAllow, total, boxVol, pass: total <= boxVol, smallest }
  }, [n14, n12, n10, devices, clamps, grounds, largest, boxIdx])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="14 AWG conductors" value={n14} onChange={setN14} step="1" />
        <Field label="12 AWG conductors" value={n12} onChange={setN12} step="1" />
        <Field label="10 AWG conductors" value={n10} onChange={setN10} step="1" />
        <Field label="Devices (receptacles/switches)" value={devices} onChange={setDevices} step="1" />
        <Field label="Ground wires entering" value={grounds} onChange={setGrounds} step="1" />
        <Select label="Internal cable clamps?" value={clamps} onChange={setClamps} options={[['yes', 'Yes'], ['no', 'No']]} />
        <Select label="Largest conductor in box" value={largest} onChange={setLargest} options={[
          ['14', '14 AWG (2.00 cu in)'], ['12', '12 AWG (2.25 cu in)'], ['10', '10 AWG (2.50 cu in)'], ['8', '8 AWG (3.00 cu in)'], ['6', '6 AWG (5.00 cu in)'],
        ]} />
        <Select label="Box to check" value={boxIdx} onChange={setBoxIdx} options={
          BOXES.map(([l], i) => [String(i), l] as [string, string])
        } />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Fill required" value={`${num(r.total, 2)} cu in`} />
        <Result label="Box volume" value={`${num(r.boxVol, 1)} cu in`} />
        <Result label="Verdict" value={r.pass ? 'PASS' : 'FAILS'} />
        <Result label="Smallest box that fits" value={r.smallest ? r.smallest[0].replace(/ \([\d.]+\)/, '') : 'None standard — use a deeper box'} />
      </div>
      <p className="text-sm text-muted-foreground">
        NEC 314.16 rules applied: conductors 1 allowance each (Table 314.16(B): 14 AWG = 2.00,
        12 = 2.25, 10 = 2.50 cu in), ALL grounds together = 1 allowance, internal clamps = 1,
        each device yoke = 2. Pigtails starting and ending in the box are free. Deep devices
        (GFCIs, smart switches) physically crowd even code-legal boxes — size up when close.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Conduit fill (NEC Chapter 9) ---------------- */

// NEC Chapter 9 Table 5, THHN/THWN areas (sq in)
const THHN_AREA: Record<string, number> = { '14': 0.0097, '12': 0.0133, '10': 0.0211, '8': 0.0366, '6': 0.0507, '4': 0.0824 }
// NEC Chapter 9 Table 4, 100% internal areas (sq in)
const CONDUIT_AREA: Record<string, Record<string, number>> = {
  emt: { '1/2': 0.304, '3/4': 0.533, '1': 0.864, '1-1/4': 1.496 },
  pvc40: { '1/2': 0.285, '3/4': 0.508, '1': 0.832, '1-1/4': 1.453 },
}

export function ConduitFillCalc() {
  const [ctype, setCtype] = useState('emt')
  const [size, setSize] = useState('3/4')
  const [c14, setC14] = useNumber(0)
  const [c12, setC12] = useNumber(6)
  const [c10, setC10] = useNumber(0)
  const [c8, setC8] = useNumber(0)
  const [c6, setC6] = useNumber(0)

  const r = useMemo(() => {
    const total = c14 + c12 + c10 + c8 + c6
    const area = c14 * THHN_AREA['14'] + c12 * THHN_AREA['12'] + c10 * THHN_AREA['10'] + c8 * THHN_AREA['8'] + c6 * THHN_AREA['6']
    // NEC Chapter 9 Table 1: 1 conductor 53%, 2 conductors 31%, 3+ conductors 40%
    const limit = total > 2 ? 0.40 : total === 2 ? 0.31 : 0.53
    const internal = CONDUIT_AREA[ctype][size]
    const allowed = internal * limit
    const pct = area / internal * 100
    const pass = area <= allowed
    // max same-size count per gauge for this conduit at 40% (Note 7: decimals ≥ 0.8 round up)
    const maxByGauge = Object.entries(THHN_AREA).map(([g, a]) => {
      const raw = (internal * 0.40) / a
      const frac = raw - Math.floor(raw)
      return [g, frac >= 0.8 ? Math.ceil(raw) : Math.floor(raw)] as [string, number]
    })
    return { total, area, limit, internal, allowed, pct, pass, maxByGauge }
  }, [ctype, size, c14, c12, c10, c8, c6])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Conduit type" value={ctype} onChange={setCtype} options={[
          ['emt', 'EMT (thinwall)'], ['pvc40', 'PVC Schedule 40'],
        ]} />
        <Select label="Trade size" value={size} onChange={setSize} options={[
          ['1/2', '1/2"'], ['3/4', '3/4"'], ['1', '1"'], ['1-1/4', '1-1/4"'],
        ]} />
        <Field label="14 AWG THHN" value={c14} onChange={setC14} step="1" />
        <Field label="12 AWG THHN" value={c12} onChange={setC12} step="1" />
        <Field label="10 AWG THHN" value={c10} onChange={setC10} step="1" />
        <Field label="8 AWG THHN" value={c8} onChange={setC8} step="1" />
        <Field label="6 AWG THHN" value={c6} onChange={setC6} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Fill" value={`${num(r.pct, 1)}%`} />
        <Result label="NEC limit" value={`${r.limit * 100}% (${r.total} conductor${r.total === 1 ? '' : 's'})`} />
        <Result label="Verdict" value={r.pass ? 'PASS' : 'OVERFILLED'} />
        <Result label="Conductor area" value={`${num(r.area, 4)} sq in`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Max same-size THHN in {size}" {ctype === 'emt' ? 'EMT' : 'PVC-40'} at 40%:{' '}
        {r.maxByGauge.map(([g, n]) => `${n}×${g} AWG`).join(' · ')}. Ground wires COUNT toward
        fill — the most common violation. Areas from NEC Chapter 9 Tables 4–5; the 40% rule is
        for 3+ conductors (2 wires get only 31%, 1 wire 53%; nipples under 24" get 60%).
        Pulling tension, not fill, is often the real limit on long runs with bends.
      </p>
    </CardContent></Card>
  )
}

export const TRADES_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'voltage-drop-calculator': VoltageDropCalc,
  'wire-size-calculator': WireSizeCalc,
  'hvac-btu-calculator': BtuLoadCalc,
  'pipe-size-calculator': PipeSizeCalc,
  'box-fill-calculator': BoxFillCalc,
  'conduit-fill-calculator': ConduitFillCalc,
}
