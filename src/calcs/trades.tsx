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

/* ---------------- Motor Circuit Sizing (NEC 430) ---------------- */

// NEC Table 430.250 — 3-phase induction FLC [208V, 230V, 460V, 575V]
const FLC_3PH: [string, number[]][] = [
  ['1/2', [2.4, 2.2, 1.1, 0.9]], ['3/4', [3.5, 3.2, 1.6, 1.3]], ['1', [4.6, 4.2, 2.1, 1.7]],
  ['1-1/2', [6.6, 6.0, 3.0, 2.4]], ['2', [7.5, 6.8, 3.4, 2.7]], ['3', [10.6, 9.6, 4.8, 3.9]],
  ['5', [16.7, 15.2, 7.6, 6.1]], ['7-1/2', [24.2, 22, 11, 9]], ['10', [30.8, 28, 14, 11]],
  ['15', [46.2, 42, 21, 17]], ['20', [59.4, 54, 27, 22]], ['25', [74.8, 68, 34, 27]],
  ['30', [88, 80, 40, 32]], ['40', [114, 104, 52, 41]], ['50', [143, 130, 65, 52]],
  ['60', [169, 154, 77, 62]], ['75', [211, 192, 96, 77]], ['100', [273, 248, 124, 99]],
]
// NEC Table 430.248 — single-phase FLC [115V, 230V]
const FLC_1PH: [string, number[]][] = [
  ['1/6', [4.4, 2.2]], ['1/4', [5.8, 2.9]], ['1/3', [7.2, 3.6]], ['1/2', [9.8, 4.9]],
  ['3/4', [13.8, 6.9]], ['1', [16, 8.0]], ['1-1/2', [20, 10]], ['2', [24, 12]],
  ['3', [34, 17]], ['5', [56, 28]], ['7-1/2', [80, 40]], ['10', [100, 50]],
]
// NEC 240.6(A) standard OCPD sizes
const STD_SIZES = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400]
// 75°C copper ampacities (Table 310.16) extended to kcmil for large motors
// Table 310.16 copper ampacities, 60°C and 75°C columns, extended to kcmil
const WIRE_60: [string, number][] = [
  ['14 AWG', 15], ['12 AWG', 20], ['10 AWG', 30], ['8 AWG', 40], ['6 AWG', 55], ['4 AWG', 70],
  ['3 AWG', 85], ['2 AWG', 95], ['1 AWG', 110], ['1/0 AWG', 125], ['2/0 AWG', 145],
  ['3/0 AWG', 165], ['4/0 AWG', 195], ['250 kcmil', 215], ['300 kcmil', 240], ['350 kcmil', 260],
  ['400 kcmil', 280], ['500 kcmil', 320],
]
const WIRE_75: [string, number][] = [
  ['14 AWG', 20], ['12 AWG', 25], ['10 AWG', 35], ['8 AWG', 50], ['6 AWG', 65], ['4 AWG', 85],
  ['3 AWG', 100], ['2 AWG', 115], ['1 AWG', 130], ['1/0 AWG', 150], ['2/0 AWG', 175],
  ['3/0 AWG', 200], ['4/0 AWG', 230], ['250 kcmil', 255], ['300 kcmil', 285], ['350 kcmil', 310],
  ['400 kcmil', 335], ['500 kcmil', 380],
]
// Table 430.52 max OCPD % of FLC by device type
const OCPD_PCT: Record<string, number> = { itb: 2.50, tdf: 1.75, ntd: 3.00 }

export function MotorCircuitCalc() {
  const [phase, setPhase] = useState('3')
  const [hp, setHp] = useState('10')
  const [volts3, setVolts3] = useState('460')
  const [volts1, setVolts1] = useState('230')
  const [device, setDevice] = useState('itb')
  const [termCol, setTermCol] = useState('75')

  const r = useMemo(() => {
    let flc: number | null = null
    let volts = volts3
    if (phase === '3') {
      const vi = ['208', '230', '460', '575'].indexOf(volts3)
      const row = FLC_3PH.find(([h]) => h === hp)
      if (row) flc = row[1][vi]
      volts = volts3
    } else {
      const vi = ['115', '230'].indexOf(volts1)
      const row = FLC_1PH.find(([h]) => h === hp)
      if (row) flc = row[1][vi]
      volts = volts1
    }
    if (flc === null) return null
    const mca = flc * 1.25 // 430.22 conductor ampacity
    const wireTable = termCol === '60' ? WIRE_60 : WIRE_75
    const wire = wireTable.find(([, a]) => a >= mca)
    const ocpdCalc = flc * OCPD_PCT[device]
    // 430.52(C)(1) Ex.1: may round UP to next standard size
    const ocpd = STD_SIZES.find((s) => s >= ocpdCalc) ?? null
    const disconnect = flc * 1.15 // 430.110
    const discStd = STD_SIZES.find((s) => s >= disconnect) ?? null
    return { flc, mca, wire, ocpdCalc, ocpd, disconnect, discStd, volts }
  }, [phase, hp, volts3, volts1, device, termCol])

  const hpOptions = phase === '3' ? FLC_3PH.map(([h]) => h) : FLC_1PH.map(([h]) => h)
  const hpSafe = hpOptions.includes(hp) ? hp : hpOptions[0]

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Phase" value={phase} onChange={(v) => { setPhase(v); if (!(v === '3' ? FLC_3PH : FLC_1PH).some(([h]) => h === hp)) setHp(v === '3' ? '10' : '5') }} options={[
          ['3', 'Three-phase (Table 430.250)'], ['1', 'Single-phase (Table 430.248)'],
        ]} />
        <Select label="Motor size" value={hpSafe} onChange={setHp} options={hpOptions.map((h) => [h, `${h} HP`])} />
        {phase === '3'
          ? <Select label="Voltage" value={volts3} onChange={setVolts3} options={[['208', '208 V'], ['230', '230 V'], ['460', '460 V'], ['575', '575 V']]} />
          : <Select label="Voltage" value={volts1} onChange={setVolts1} options={[['115', '115 V'], ['230', '230 V']]} />}
        <Select label="Branch protection device" value={device} onChange={setDevice} options={[
          ['itb', 'Inverse-time breaker (250%)'], ['tdf', 'Dual-element / time-delay fuse (175%)'], ['ntd', 'Non-time-delay fuse (300%)'],
        ]} />
        <Select label="Termination rating (110.14)" value={termCol} onChange={setTermCol} options={[
          ['75', '75°C — equipment marked 75°C'], ['60', '60°C — unmarked gear ≤100A, NM cable'],
        ]} />
      </div>
      {r && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Table FLC (not nameplate!)" value={`${num(r.flc, 1)} A`} />
            <Result label="Min conductor ampacity (125%)" value={`${num(r.mca, 1)} A`} />
            <Result label={`Min copper wire (${termCol}°C column)`} value={r.wire ? r.wire[0] : '>500 kcmil'} />
            <Result label="Max OCPD" value={r.ocpd ? `${r.ocpd} A` : '>400 A'} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Result label="OCPD calculated (430.52)" value={`${num(r.ocpdCalc, 1)} A → round up`} />
            <Result label="Min disconnect (430.110, 115%)" value={r.discStd ? `${r.discStd} A switch` : `${num(r.disconnect, 1)} A`} />
            <Result label="Overload relay basis" value="Nameplate FLA ×115–125%" />
          </div>
        </>
      )}
      <p className="text-sm text-muted-foreground">
        NEC 430.6 requires sizing from the TABLE full-load current (430.248/430.250), not the motor
        nameplate — so the circuit survives a future motor swap. Conductors: 125% of table FLC
        (430.22). Termination rating decides which ampacity column the wire comes from — per
        110.14(C), circuits ≤100A use the 60°C column unless the equipment is marked 75°C, which is
        why a 5 HP single-phase motor lands on 8 AWG in most panels. The breaker is intentionally
        oversized (250% inverse-time) to ride through 6–8× starting inrush; running overload
        protection comes from the separate overload relay, set on nameplate amps (430.32). If the
        calculated OCPD isn&apos;t a standard size, rounding UP is permitted (430.52(C)(1)
        Exception 1). HVAC compressors follow Article 440 instead — use the equipment nameplate MCA/MOP.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Residential Service Load (NEC 220, standard method) ---------------- */

export function ServiceLoadCalc() {
  const [sqft, setSqft] = useNumber(2000)
  const [saCircuits, setSaCircuits] = useNumber(2)
  const [laundry, setLaundry] = useState('yes')
  const [rangeKw, setRangeKw] = useNumber(12)
  const [dryerKw, setDryerKw] = useNumber(5)
  const [waterHeater, setWaterHeater] = useNumber(4500)
  const [dishwasher, setDishwasher] = useNumber(1200)
  const [disposal, setDisposal] = useNumber(500)
  const [otherFixed, setOtherFixed] = useNumber(0)
  const [acVa, setAcVa] = useNumber(5000)
  const [heatVa, setHeatVa] = useNumber(0)

  const r = useMemo(() => {
    // General lighting + small appliance + laundry (220.12 / 220.52)
    const glTotal = sqft * 3 + saCircuits * 1500 + (laundry === 'yes' ? 1500 : 0)
    // Table 220.42 dwelling demand: first 3000 @100%, to 120k @35%, remainder @25%
    const glDemand = Math.min(glTotal, 3000) + Math.max(0, Math.min(glTotal - 3000, 117000)) * 0.35 + Math.max(0, glTotal - 120000) * 0.25
    // Range (Table 220.55): 8 kW for ≤12 kW; +5% per kW over 12
    const rangeDemand = rangeKw <= 0 ? 0 : rangeKw <= 12 ? 8000 : 8000 * (1 + 0.05 * (rangeKw - 12))
    // Dryer (220.54): nameplate or 5000 VA, whichever larger
    const dryerDemand = dryerKw <= 0 ? 0 : Math.max(dryerKw * 1000, 5000)
    // Fixed appliances (220.53): 4+ → 75% demand
    const fixed = [waterHeater, dishwasher, disposal, otherFixed].filter((v) => v > 0)
    const fixedSum = fixed.reduce((a, b) => a + b, 0)
    const fixedDemand = fixed.length >= 4 ? fixedSum * 0.75 : fixedSum
    // HVAC (220.60): non-coincident — larger of heating or cooling
    const hvac = Math.max(acVa, heatVa)
    const total = glDemand + rangeDemand + dryerDemand + fixedDemand + hvac
    const amps = total / 240
    const SERVICE_SIZES = [100, 125, 150, 175, 200, 225, 300, 400]
    const service = SERVICE_SIZES.find((s) => s >= amps) ?? null
    return { glTotal, glDemand, rangeDemand, dryerDemand, fixedDemand, fixedCount: fixed.length, hvac, total, amps, service }
  }, [sqft, saCircuits, laundry, rangeKw, dryerKw, waterHeater, dishwasher, disposal, otherFixed, acVa, heatVa])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Conditioned floor area" value={sqft} onChange={setSqft} suffix="sq ft" />
        <Field label="Small-appliance circuits (min 2)" value={saCircuits} onChange={setSaCircuits} step="1" />
        <Select label="Laundry circuit?" value={laundry} onChange={setLaundry} options={[['yes', 'Yes'], ['no', 'No']]} />
        <Field label="Electric range (0 = none)" value={rangeKw} onChange={setRangeKw} suffix="kW" />
        <Field label="Electric dryer (0 = none)" value={dryerKw} onChange={setDryerKw} suffix="kW" />
        <Field label="Water heater" value={waterHeater} onChange={setWaterHeater} suffix="VA" />
        <Field label="Dishwasher" value={dishwasher} onChange={setDishwasher} suffix="VA" />
        <Field label="Disposal" value={disposal} onChange={setDisposal} suffix="VA" />
        <Field label="Other fixed appliances" value={otherFixed} onChange={setOtherFixed} suffix="VA" />
        <Field label="Air conditioning" value={acVa} onChange={setAcVa} suffix="VA" />
        <Field label="Electric heat" value={heatVa} onChange={setHeatVa} suffix="VA" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Calculated demand" value={`${num(r.total, 0)} VA`} />
        <Result label="Service current" value={`${num(r.amps, 1)} A`} />
        <Result label="Minimum service" value={r.service ? `${r.service} A` : '>400 A'} />
        <Result label="Lighting after 220.42 demand" value={`${num(r.glDemand, 0)} of ${num(r.glTotal, 0)} VA`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Range demand (220.55)" value={`${num(r.rangeDemand, 0)} VA`} />
        <Result label="Dryer demand (220.54)" value={`${num(r.dryerDemand, 0)} VA`} />
        <Result label={`Fixed appliances (${r.fixedCount}×, 220.53)`} value={`${num(r.fixedDemand, 0)} VA`} />
        <Result label="HVAC — larger only (220.60)" value={`${num(r.hvac, 0)} VA`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Standard method, NEC Article 220 Part III: lighting at 3 VA/sq ft plus 1500 VA per
        small-appliance and laundry circuit, demand-factored per Table 220.42 (first 3000 VA at
        100%, remainder at 35%). One range ≤12 kW counts as 8 kW (Table 220.55); a dryer counts at
        nameplate or 5000 VA, whichever is larger (220.54); four or more fixed appliances drop to
        75% (220.53); and heating/cooling never coincide, so only the larger counts (220.60).
        EV chargers add at 100% as continuous loads (Article 625) — add one to &quot;other fixed
        appliances.&quot; Gas appliances contribute only their blowers and controls. The optional
        method (220.82) often lands one service size smaller; the AHJ has the final word.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Duct Sizing (ASHRAE equal-friction) ---------------- */

// Friction rate for round duct: FR = 0.109136 × Q^1.9 / D^5.02 (ASHRAE, Q cfm, D inches)
function frFor(q: number, d: number) { return 0.109136 * Math.pow(q, 1.9) / Math.pow(d, 5.02) }
function dFor(q: number, fr: number) { return Math.pow(0.109136 * Math.pow(q, 1.9) / fr, 1 / 5.02) }
// Huebscher equivalent round: De = 1.3 (a·b)^0.625 / (a+b)^0.25 — solve width a given height b
function rectWidthFor(de: number, b: number): number {
  let lo = b / 8, hi = b * 40
  for (let i = 0; i < 60; i++) {
    const a = (lo + hi) / 2
    const eq = 1.3 * Math.pow(a * b, 0.625) / Math.pow(a + b, 0.25)
    if (eq < de) lo = a; else hi = a
  }
  return (lo + hi) / 2
}

export function DuctSizeCalc() {
  const [cfm, setCfm] = useNumber(1000)
  const [fr, setFr] = useState('0.1')
  const [rectH, setRectH] = useNumber(10)

  const r = useMemo(() => {
    const frv = parseFloat(fr)
    const dExact = dFor(cfm, frv)
    const dStd = Math.max(4, Math.ceil(dExact)) // next whole inch up
    const area = Math.PI * Math.pow(dStd / 12, 2) / 4
    const velocity = cfm / area
    const frActual = frFor(cfm, dStd)
    const width = rectWidthFor(dStd, rectH)
    const widthIn = Math.ceil(width) // round up to whole inch
    const rectArea = (widthIn * rectH) / 144
    const rectVel = cfm / rectArea
    const aspect = widthIn / rectH
    return { dExact, dStd, area, velocity, frActual, widthIn, rectVel, aspect }
  }, [cfm, fr, rectH])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Airflow" value={cfm} onChange={setCfm} suffix="CFM" />
        <Select label="Friction rate (design)" value={fr} onChange={setFr} options={[
          ['0.1', '0.10 — residential standard'], ['0.08', '0.08 — supply run-outs'], ['0.05', '0.05 — trunk / quiet'], ['0.02', '0.02 — return ducts'],
        ]} />
        <Field label="Rectangular duct height" value={rectH} onChange={setRectH} suffix="in" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Round duct" value={`${r.dStd}" dia (calc ${num(r.dExact, 1)}")`} />
        <Result label="Velocity at that size" value={`${num(r.velocity, 0)} fpm`} />
        <Result label="Actual friction rate" value={`${num(r.frActual, 3)} in./100 ft`} />
        <Result label="Rectangular equivalent" value={`${r.widthIn}" × ${rectH}"`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Rectangular velocity" value={`${num(r.rectVel, 0)} fpm`} />
        <Result label="Aspect ratio" value={`${num(r.aspect, 1)}:1 ${r.aspect > 4 ? '— over 4:1 limit' : '✓'}`} />
        <Result label="CFM per ton check" value={`${num(cfm / 400, 2)} tons at 400 CFM/ton`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Equal-friction method per ASHRAE Fundamentals Ch. 21 — the same correlation inside a
        cardboard ductulator: friction rate = 0.109136 × CFM^1.9 ÷ D^5.02, solved for diameter at
        your design friction rate. Rectangular equivalents use the Huebscher equation
        De = 1.3(ab)^0.625/(a+b)^0.25 — keep aspect ratio under 4:1 or surface friction eats the
        savings. Design targets: 0.08–0.10 in./100 ft for supply run-outs, 0.05 for trunks
        (15–20% fan energy savings vs 0.10), lower for returns. Velocity sanity check: 600–900
        fpm branches, 800–1200 mains, 400–700 returns. For room CFM, figure 400 CFM per ton of
        load — or run the BTU load calculator first.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Room Airflow (sensible heat: CFM = BTU / 1.08ΔT) ---------------- */

interface Room { name: string; btu: number }

export function RoomAirflowCalc() {
  const [shr, setShr] = useNumber(0.75)
  const [deltaT, setDeltaT] = useNumber(20)
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Living room', btu: 9000 }, { name: 'Kitchen', btu: 6000 },
    { name: 'Primary bedroom', btu: 6000 }, { name: 'Bedroom 2', btu: 4500 }, { name: 'Bedroom 3', btu: 4500 },
  ])

  const r = useMemo(() => {
    const active = rooms.filter((rm) => rm.btu > 0)
    const totalBtu = active.reduce((a, rm) => a + rm.btu, 0)
    const rows = active.map((rm) => {
      const sensible = rm.btu * shr
      const cfm = sensible / (1.08 * deltaT)
      return { ...rm, sensible, cfm, share: totalBtu > 0 ? rm.btu / totalBtu : 0 }
    })
    const totalCfm = rows.reduce((a, rm) => a + rm.cfm, 0)
    const tons = totalBtu / 12000
    const cfmPerTon = tons > 0 ? totalCfm / tons : 0
    return { rows, totalBtu, totalCfm, tons, cfmPerTon }
  }, [rooms, shr, deltaT])

  function setRoom(i: number, patch: Partial<Room>) {
    setRooms((prev) => prev.map((rm, j) => (j === i ? { ...rm, ...patch } : rm)))
  }

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Sensible heat ratio (SHR)" value={shr} onChange={setShr} step="0.05" />
        <Field label="Supply-to-room ΔT" value={deltaT} onChange={setDeltaT} suffix="°F" />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setRooms((p) => [...p, { name: `Room ${p.length + 1}`, btu: 0 }])}
            className="h-9 rounded-md border px-3 text-sm hover:bg-accent"
          >+ Add room</button>
        </div>
      </div>
      <div className="space-y-2">
        {rooms.map((rm, i) => (
          <div key={i} className="grid grid-cols-[1fr_120px_110px_90px_32px] items-end gap-2">
            <div className="space-y-1.5">
              {i === 0 && <p className="text-sm font-medium">Room</p>}
              <input
                value={rm.name}
                onChange={(e) => setRoom(i, { name: e.target.value })}
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              {i === 0 && <p className="text-sm font-medium">Load (BTU/h)</p>}
              <input
                type="number"
                value={rm.btu || ''}
                onChange={(e) => setRoom(i, { btu: parseFloat(e.target.value) || 0 })}
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              {i === 0 && <p className="text-sm font-medium">Target CFM</p>}
              <p className="flex h-9 items-center rounded-md bg-muted px-3 text-sm font-semibold">
                {rm.btu > 0 ? num(rm.btu * shr / (1.08 * deltaT), 0) : '—'}
              </p>
            </div>
            <div className="space-y-1.5">
              {i === 0 && <p className="text-sm font-medium">Share</p>}
              <p className="flex h-9 items-center rounded-md bg-muted px-3 text-sm">
                {r.rows.find((x) => x.name === rm.name && x.btu === rm.btu) ? num((rm.btu / (r.totalBtu || 1)) * 100, 1) + '%' : '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRooms((p) => p.filter((_, j) => j !== i))}
              className="flex h-9 items-center justify-center rounded-md border text-sm text-muted-foreground hover:bg-accent"
              aria-label="Remove room"
            >×</button>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Total airflow" value={`${num(r.totalCfm, 0)} CFM`} />
        <Result label="Total load" value={`${num(r.totalBtu, 0)} BTU/h (${num(r.tons, 2)} tons)`} />
        <Result label="CFM per ton" value={`${num(r.cfmPerTon, 0)}`} />
        <Result label="Sensible capacity moved" value={`${num(r.totalCfm * 1.08 * deltaT, 0)} BTU/h`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Sensible-heat math: CFM = sensible BTU/h ÷ (1.08 × ΔT), where 1.08 is the heat carried by
        standard air (0.075 lb/ft³ × 60 min × 0.24 BTU/lb·°F) and ΔT is supply-to-room difference
        — about 20°F for cooling with ~55°F supply air. Only the SENSIBLE part of the load moves
        air: at a typical 0.75 SHR, a 30,000 BTU/h (2.5-ton) total load is 22,500 sensible and
        wants ~1,040 CFM — right at the 400 CFM/ton convention. Set SHR higher (0.80–0.90) in dry
        climates, lower (0.65–0.70) in humid ones. Then size each run-out with the duct size
        calculator so every room actually gets its target.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Superheat & Subcooling (PT conversion) ---------------- */

// Saturation tables [°F, psig] — R-410A: National Refrigerants/Hudson; R-22: standard chart
const PT_410A: [number, number][] = [
  [-40, 11.6], [-35, 14.9], [-30, 18.5], [-25, 22.5], [-20, 26.9], [-15, 31.7], [-10, 36.8],
  [-5, 42.5], [0, 48.6], [5, 55.2], [10, 62.3], [15, 70.0], [20, 78.3], [25, 87.3], [30, 96.8],
  [35, 107], [40, 118], [45, 130], [50, 142], [55, 155], [60, 170], [65, 185], [70, 201],
  [75, 217], [80, 235], [85, 254], [90, 274], [95, 295], [100, 317], [105, 340], [110, 365],
  [115, 391], [120, 418], [125, 446], [130, 476], [135, 507], [140, 539], [145, 573], [150, 608],
]
const PT_R22: [number, number][] = [
  [-20, 10.1], [-15, 13.2], [-10, 16.5], [-5, 20.6], [0, 24.0], [5, 28.2], [10, 32.8],
  [15, 37.8], [20, 43.1], [25, 48.8], [30, 54.9], [35, 61.5], [40, 68.5], [45, 76.0],
  [50, 84.0], [55, 92.6], [60, 101.6], [65, 111.3], [70, 121.4], [75, 132.2], [80, 143.6],
  [85, 155.7], [90, 168.4], [95, 181.8], [100, 195.9], [105, 210.8], [110, 226.4], [115, 242.7],
  [120, 259.9], [125, 277.8], [130, 296.8], [135, 316.6], [140, 335.9], [145, 357], [150, 381],
]
// Linear-interpolated saturation temp (°F) for a gauge pressure
function satTemp(table: [number, number][], psig: number): number | null {
  if (psig < table[0][1] || psig > table[table.length - 1][1]) return null
  for (let i = 1; i < table.length; i++) {
    const [t1, p1] = table[i - 1], [t2, p2] = table[i]
    if (psig <= p2) return t1 + ((psig - p1) / (p2 - p1)) * (t2 - t1)
  }
  return null
}

export function SuperheatCalc() {
  const [refrig, setRefrig] = useState('410a')
  const [metering, setMetering] = useState('txv')
  const [suctP, setSuctP] = useNumber(118)
  const [suctT, setSuctT] = useNumber(51)
  const [liqP, setLiqP] = useNumber(365)
  const [liqT, setLiqT] = useNumber(100)
  const [targetSc, setTargetSc] = useNumber(10)

  const r = useMemo(() => {
    const table = refrig === '410a' ? PT_410A : PT_R22
    const satSuct = satTemp(table, suctP)
    const satLiq = satTemp(table, liqP)
    const sh = satSuct === null ? null : suctT - satSuct
    const sc = satLiq === null ? null : satLiq - liqT
    let diagnosis = '—'
    if (sh !== null && sc !== null) {
      const shHigh = sh > 14, shLow = sh < 5
      const scHigh = sc > targetSc + 4, scLow = sc < targetSc - 4
      if (shHigh && scLow) diagnosis = 'Likely UNDERCHARGED (high superheat, low subcooling)'
      else if (shLow && scHigh) diagnosis = 'Likely OVERCHARGED (low superheat, high subcooling)'
      else if (shHigh && scHigh) diagnosis = 'Restriction or low evaporator airflow — check filters, coil, metering device'
      else if (shLow && sc < 5) diagnosis = 'Floodback risk — do NOT add charge; verify conditions stabilized'
      else diagnosis = 'Within normal field bands — verify against manufacturer charging spec'
    }
    return { satSuct, satLiq, sh, sc, diagnosis }
  }, [refrig, metering, suctP, suctT, liqP, liqT, targetSc])

  const verdict = (v: number | null, lo: number, hi: number) =>
    v === null ? 'Out of PT range' : v < lo ? `LOW (${num(v, 1)}°F)` : v > hi ? `HIGH (${num(v, 1)}°F)` : `✓ ${num(v, 1)}°F`

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Refrigerant" value={refrig} onChange={setRefrig} options={[
          ['410a', 'R-410A'], ['r22', 'R-22'],
        ]} />
        <Select label="Metering device" value={metering} onChange={setMetering} options={[
          ['txv', 'TXV — charge by subcooling'], ['fixed', 'Fixed orifice — charge by superheat'],
        ]} />
        <Field label="Target subcooling (mfr spec)" value={targetSc} onChange={setTargetSc} suffix="°F" />
        <Field label="Suction pressure" value={suctP} onChange={setSuctP} suffix="psig" />
        <Field label="Suction line temp" value={suctT} onChange={setSuctT} suffix="°F" />
        <Field label="Liquid pressure" value={liqP} onChange={setLiqP} suffix="psig" />
        <Field label="Liquid line temp" value={liqT} onChange={setLiqT} suffix="°F" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Superheat" value={verdict(r.sh, 8, 14)} />
        <Result big label="Subcooling" value={verdict(r.sc, Math.max(3, targetSc - 4), targetSc + 4)} />
        <Result label="Suction saturation" value={r.satSuct === null ? '—' : `${num(r.satSuct, 1)}°F`} />
        <Result label="Liquid saturation" value={r.satLiq === null ? '—' : `${num(r.satLiq, 1)}°F`} />
      </div>
      <div className="rounded-lg border p-3 text-sm font-medium">{r.diagnosis}</div>
      <p className="text-sm text-muted-foreground">
        Superheat = suction line temp − saturation temp at suction pressure (protects the
        compressor from liquid floodback). Subcooling = saturation temp at liquid pressure −
        liquid line temp (guarantees pure liquid at the metering device). TXV systems charge by
        subcooling to the manufacturer spec (often 8–12°F); fixed-orifice systems charge by
        superheat against the mfr chart (indoor wet-bulb × outdoor dry-bulb), with 8–14°F a common
        field band. Let the system stabilize 10–15 minutes before reading, and never adjust charge
        on superheat below 5°F. EPA 608 certification is required to handle refrigerant.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Drain Pipe Sizing (IPC 709/710) ---------------- */

// IPC Table 709.1 drainage fixture units (private use)
const DFU_FIXTURES: [string, number][] = [
  ['Toilet (≤1.6 gpf)', 3], ['Lavatory / bath sink', 1], ['Bathtub', 2], ['Shower (1 head)', 2],
  ['Kitchen sink', 2], ['Dishwasher', 2], ['Clothes washer', 2], ['Laundry / utility sink', 2],
  ['Floor drain (2")', 2],
]
// IPC Table 710.1(1) building drain/sewer max DFU [size, 1/8", 1/4", 1/2"]  (— = not permitted)
const DRAIN_TABLE: [string, (number | null)[]][] = [
  ['2"', [null, 21, 26]], ['2-1/2"', [null, 24, 31]], ['3"', [36, 42, 50]],
  ['4"', [180, 216, 250]], ['5"', [390, 480, 575]], ['6"', [700, 840, 1000]],
  ['8"', [1600, 1920, 2300]],
]
// IPC Table 710.1(2) horizontal fixture branches & stacks max DFU
const BRANCH_TABLE: [string, number][] = [
  ['1-1/2"', 3], ['2"', 6], ['2-1/2"', 12], ['3"', 20], ['4"', 160], ['5"', 360], ['6"', 620], ['8"', 1400],
]

export function DrainSizeCalc() {
  // default: 2-bath home
  const [counts, setCounts] = useState<number[]>([2, 2, 1, 1, 1, 1, 1, 0, 0])
  const [slope, setSlope] = useState('1') // index into slope columns: 0=1/8, 1=1/4, 2=1/2
  const [section, setSection] = useState('drain')

  const r = useMemo(() => {
    const total = DFU_FIXTURES.reduce((a, [, dfu], i) => a + dfu * (counts[i] || 0), 0)
    const hasToilet = (counts[0] || 0) > 0
    const si = parseInt(slope)
    let size: string | null = null
    let cap = 0
    if (section === 'drain') {
      for (const [s, caps] of DRAIN_TABLE) {
        const c = caps[si]
        if (c !== null && c >= total && (!hasToilet || parseFloat(s) >= 3)) { size = s; cap = c; break }
      }
    } else {
      for (const [s, c] of BRANCH_TABLE) {
        if (c >= total && (!hasToilet || parseFloat(s) >= 3)) { size = s; cap = c; break }
      }
    }
    return { total, size, cap, hasToilet, si }
  }, [counts, slope, section])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {DFU_FIXTURES.map(([label, dfu], i) => (
          <div key={label} className="space-y-1.5">
            <p className="text-sm font-medium">{label} <span className="text-muted-foreground">({dfu} DFU)</span></p>
            <input
              type="number" min={0} value={counts[i] || ''} placeholder="0"
              onChange={(e) => setCounts((p) => p.map((c, j) => (j === i ? parseInt(e.target.value) || 0 : c)))}
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
        ))}
        <Select label="Pipe slope" value={slope} onChange={setSlope} options={[
          ['1', '1/4" per foot (standard)'], ['0', '1/8" per foot (3"+ only)'], ['2', '1/2" per foot'],
        ]} />
        <Select label="Pipe section" value={section} onChange={setSection} options={[
          ['drain', 'Building drain / sewer (710.1(1))'], ['branch', 'Horizontal branch / stack (710.1(2))'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Total load" value={`${num(r.total, 1)} DFU`} />
        <Result label="Minimum pipe size" value={r.size ?? 'Beyond table'} />
        <Result label="Capacity at that size" value={r.size ? `${r.cap} DFU` : '—'} />
        <Result label="Spare capacity" value={r.size ? `${num(((r.cap - r.total) / r.cap) * 100, 0)}%` : '—'} />
      </div>
      <p className="text-sm text-muted-foreground">
        IPC sizing: fixtures count as drainage fixture units (Table 709.1 — a toilet is 3 DFU, a
        lavatory 1, most other fixtures 2), then the smallest pipe whose capacity covers the total
        is selected from Table 710.1 at your slope. Slope rules: 2&quot; and smaller must run at
        least 1/4&quot; per foot (Section 704.1); the 1/8&quot; column is legal only at 3&quot; and
        larger. Any drain serving a toilet is 3&quot; minimum regardless of the DFU math. A
        typical 2-bath house totals 18–24 DFU — 3&quot; at 1/4&quot;/ft with room to spare. Zero
        spare capacity means any future half-bath forces repiping; upsizing one step is cheap
        insurance. UPC values differ slightly (washer = 3 DFU) — confirm your adopted code.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Vent Sizing (IPC Table 906.1/916.1) ---------------- */

// [stack dia in, dfu row, [[vent dia in, max developed length ft], ...]]
const VENT_ROWS: [number, number, [number, number][]][] = [
  [1.5, 8, [[1.25, 50], [1.5, 150]]],
  [1.5, 10, [[1.25, 30], [1.5, 100]]],
  [2, 12, [[1.5, 75], [2, 200]]],
  [2, 20, [[1.25, 30], [1.5, 50], [2, 150]]],
  [2.5, 42, [[1.25, 26], [1.5, 30], [2, 100], [2.5, 300]]],
  [3, 10, [[1.5, 42], [2, 150], [2.5, 360], [3, 1040]]],
  [3, 21, [[1.5, 32], [2, 110], [2.5, 270], [3, 810]]],
  [3, 53, [[1.5, 27], [2, 94], [2.5, 230], [3, 680]]],
  [3, 102, [[1.5, 25], [2, 86], [2.5, 210], [3, 620]]],
  [4, 43, [[2, 35], [2.5, 85], [3, 250], [4, 980]]],
  [4, 140, [[2, 27], [2.5, 65], [3, 200], [4, 750]]],
  [4, 320, [[2, 23], [2.5, 55], [3, 170], [4, 640]]],
  [4, 540, [[2, 21], [2.5, 50], [3, 150], [4, 580]]],
  [5, 190, [[2.5, 28], [3, 82], [4, 320], [5, 990]]],
  [5, 490, [[2.5, 21], [3, 63], [4, 250], [5, 760]]],
  [5, 940, [[2.5, 18], [3, 53], [4, 210], [5, 670]]],
  [5, 1400, [[2.5, 16], [3, 49], [4, 190], [5, 590]]],
  [6, 500, [[3, 33], [4, 130], [5, 400], [6, 1000]]],
  [6, 1100, [[3, 26], [4, 100], [5, 310], [6, 780]]],
  [6, 2000, [[3, 22], [4, 84], [5, 260], [6, 660]]],
]
const diaLabel = (d: number) => `${Number.isInteger(d) ? d : d.toFixed(2).replace('1.25', '1-1/4').replace('1.50', '1-1/2').replace('2.50', '2-1/2')}"`

export function VentSizeCalc() {
  const [stackDia, setStackDia] = useState('3')
  const [dfu, setDfu] = useNumber(24)
  const [devLen, setDevLen] = useNumber(40)

  const r = useMemo(() => {
    const sd = parseFloat(stackDia)
    const minVent = Math.max(1.25, sd / 2)
    const rows = VENT_ROWS.filter(([d]) => d === sd)
    if (!rows.length) return null
    // conservative: use the next-higher DFU row that covers the load
    const row = rows.filter(([, d]) => d >= dfu).sort((a, b) => a[1] - b[1])[0]
    if (!row) return { beyondTable: true, minVent }
    const [, rowDfu, vents] = row
    let chosen: [number, number] | null = null
    for (const [vd, len] of vents) {
      if (vd >= minVent && len >= devLen) { chosen = [vd, len]; break }
    }
    return { beyondTable: false, rowDfu, minVent, chosen }
  }, [stackDia, dfu, devLen])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Drain/stack diameter served" value={stackDia} onChange={setStackDia} options={[
          ['1.5', '1-1/2"'], ['2', '2"'], ['2.5', '2-1/2"'], ['3', '3"'], ['4', '4"'], ['5', '5"'], ['6', '6"'],
        ]} />
        <Field label="Total DFU being vented" value={dfu} onChange={setDfu} suffix="DFU" />
        <Field label="Developed length to open air" value={devLen} onChange={setDevLen} suffix="ft" />
      </div>
      {r && (
        <div className="grid gap-3 sm:grid-cols-4">
          <Result big label="Minimum vent size" value={r.beyondTable ? 'Beyond table' : r.chosen ? diaLabel(r.chosen[0]) : 'Beyond table length'} />
          <Result label="Rule floor (½ drain, ≥1¼&quot;)" value={diaLabel(r.minVent)} />
          <Result label="Table row used (conservative)" value={r.beyondTable ? '—' : `${r.rowDfu} DFU`} />
          <Result label="Max length at that size" value={r.chosen ? `${r.chosen[1]} ft` : '—'} />
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        IPC Table 906.1 sizing: the vent must be at least half the diameter of the drain it serves
        and never under 1¼&quot; — then the table caps how far that vent may travel from the
        drainage connection to open air, shrinking as the DFU load grows. When your load falls
        between table rows, the next-higher DFU row governs (the conservative read). A 3&quot;
        stack venting a 2-bath house (~24 DFU) with 40 ft of run needs a 2&quot; vent — the
        1½&quot; minimum tops out at 27 ft. Individual and branch vents follow the same table, and
        branch vents over 40 ft must upsize one nominal size (906.4.1). Undersized vents announce
        themselves as gurgling traps and slow drains even when the drain sizing is perfect.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Water Heater Sizing (FHR + recovery + tankless) ---------------- */

// typical hot-water draw per use in the peak hour (gallons of ~105-120°F water)
const WH_USES: [string, number][] = [
  ['Shower (10 min)', 12], ['Bath', 15], ['Dishwasher cycle', 6],
  ['Clothes washer (warm)', 7], ['Kitchen sink use', 3], ['Hand/face sink', 2],
]
const TANK_SIZES = [30, 40, 50, 65, 80]

export function WaterHeaterCalc() {
  const [uses, setUses] = useState<number[]>([2, 0, 1, 1, 1, 1])
  const [inlet, setInlet] = useNumber(50)
  const [setpoint, setSetpoint] = useNumber(120)
  const [fuel, setFuel] = useState('gas40')
  const [simulGpm, setSimulGpm] = useNumber(4)

  const r = useMemo(() => {
    const peakGal = WH_USES.reduce((a, [, g], i) => a + g * (uses[i] || 0), 0)
    const dT = Math.max(1, setpoint - inlet)
    // effective hourly input (BTU/h): gas 40k/50k at 80% eff, electric 4.5/5.5 kW at ~98%
    const input = fuel === 'gas40' ? 40000 * 0.8 : fuel === 'gas50' ? 50000 * 0.8 : fuel === 'elec45' ? 4.5 * 3412 : 5.5 * 3412
    const recoveryGph = input / (8.34 * dT)
    // first-hour rating ≈ 70% of tank + 1-hour recovery
    const fhr = TANK_SIZES.map((t) => [t, t * 0.7 + recoveryGph] as [number, number])
    const pick = fhr.find(([, f]) => f >= peakGal) ?? null
    // tankless: required input for simultaneous GPM at this rise
    const tanklessBtu = simulGpm * 500 * dT
    return { peakGal, dT, recoveryGph, fhr, pick, tanklessBtu }
  }, [uses, inlet, setpoint, fuel, simulGpm])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {WH_USES.map(([label, g], i) => (
          <div key={label} className="space-y-1.5">
            <p className="text-sm font-medium">{label} <span className="text-muted-foreground">(~{g} gal)</span></p>
            <input
              type="number" min={0} value={uses[i] || ''} placeholder="0"
              onChange={(e) => setUses((p) => p.map((c, j) => (j === i ? parseInt(e.target.value) || 0 : c)))}
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
        ))}
        <Field label="Incoming water temp" value={inlet} onChange={setInlet} suffix="°F" />
        <Field label="Setpoint" value={setpoint} onChange={setSetpoint} suffix="°F" />
        <Select label="Heater input" value={fuel} onChange={setFuel} options={[
          ['gas40', 'Gas 40,000 BTU/h'], ['gas50', 'Gas 50,000 BTU/h'], ['elec45', 'Electric 4.5 kW'], ['elec55', 'Electric 5.5 kW'],
        ]} />
        <Field label="Simultaneous flow (tankless)" value={simulGpm} onChange={setSimulGpm} suffix="GPM" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Peak-hour demand" value={`${num(r.peakGal, 0)} gal`} />
        <Result label="Recovery rate" value={`${num(r.recoveryGph, 0)} GPH`} />
        <Result label="Recommended tank" value={r.pick ? `${r.pick[0]} gal (FHR ${num(r.pick[1], 0)})` : '80+ gal / go tankless'} />
        <Result label="Tankless input needed" value={`${num(r.tanklessBtu / 1000, 0)}k BTU/h`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Tank sizing is first-hour rating vs peak-hour demand: FHR ≈ 70% of tank volume plus one
        hour of recovery, and recovery = heater input ÷ (8.34 × temperature rise) — at a 70°F rise,
        a 40k BTU gas burner recovers ~55 GPH while a 4.5 kW electric element manages ~26, which
        is why electric tanks run bigger for the same family. A 2-shower household with a
        dishwasher, washer, and sinks peaks near 55 gallons: a 40-gal gas tank (FHR ~83) covers
        it; a 4.5 kW electric needs 50–65 gallons. Tankless skips storage entirely but must heat
        the flow in real time: GPM × 500 × rise — two simultaneous showers at a 70°F rise demand
        ~140k BTU/h, and cold-climate inlets are what turn a 199k unit into a one-shower device.
        Planning estimates; nameplate FHR and manufacturer sizing govern.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Ampacity Derating (NEC 310.15/310.16) ---------------- */

// NEC Table 310.16 — copper ampacities [60°C, 75°C, 90°C]
const AMP_CU: Record<string, [number, number, number]> = {
  '14': [15, 20, 25], '12': [20, 25, 30], '10': [30, 35, 40], '8': [40, 50, 55],
  '6': [55, 65, 75], '4': [70, 85, 95], '3': [85, 100, 110], '2': [95, 115, 130],
  '1': [110, 130, 145], '1/0': [125, 150, 170], '2/0': [145, 175, 195],
  '3/0': [165, 200, 225], '4/0': [195, 230, 260],
}
// NEC Table 310.15(B)(1) — ambient temp correction factors by °F bin [60, 75, 90] (null = not usable)
const TEMP_BINS: [number, number, (number | null)[]][] = [
  [0, 50, [1.29, 1.20, 1.15]],
  [51, 59, [1.22, 1.15, 1.12]],
  [60, 68, [1.15, 1.11, 1.08]],
  [69, 77, [1.08, 1.05, 1.04]],
  [78, 86, [1.00, 1.00, 1.00]],
  [87, 95, [0.91, 0.94, 0.96]],
  [96, 104, [0.82, 0.88, 0.91]],
  [105, 113, [0.71, 0.82, 0.87]],
  [114, 122, [0.58, 0.75, 0.82]],
  [123, 131, [0.41, 0.67, 0.76]],
  [132, 140, [null, 0.58, 0.71]],
  [141, 149, [null, 0.47, 0.65]],
  [150, 158, [null, 0.33, 0.58]],
  [159, 167, [null, null, 0.50]],
  [168, 176, [null, null, 0.41]],
  [177, 185, [null, null, 0.29]],
]
// NEC Table 310.15(C)(1) — adjustment factors for >3 current-carrying conductors
function bundleFactor(n: number): number {
  if (n <= 3) return 1.0
  if (n <= 6) return 0.8
  if (n <= 9) return 0.7
  if (n <= 20) return 0.5
  if (n <= 30) return 0.45
  if (n <= 40) return 0.4
  return 0.35
}
// NEC 240.4(D) small-conductor overcurrent caps (copper)
const SMALL_CAP: Record<string, number> = { '14': 15, '12': 20, '10': 30 }

export function AmpacityDerateCalc() {
  const [gauge, setGauge] = useState('12')
  const [insul, setInsul] = useState('90')
  const [term, setTerm] = useState('75')
  const [ambientF, setAmbientF] = useNumber(86)
  const [ccc, setCcc] = useNumber(3)
  const [load, setLoad] = useNumber(20)
  const [continuous, setContinuous] = useState('yes')

  const r = useMemo(() => {
    const ci = insul === '60' ? 0 : insul === '75' ? 1 : 2
    const ti = term === '60' ? 0 : 1
    const bin = TEMP_BINS.find(([lo, hi]) => ambientF >= lo && ambientF <= hi)
    const tFactor = bin ? bin[2][ci] : null
    const bFactor = bundleFactor(ccc)
    const base = AMP_CU[gauge][ci]
    const termCap = AMP_CU[gauge][ti]
    const derated = tFactor === null ? null : base * tFactor * bFactor
    const finalAmp = derated === null ? null : Math.min(derated, termCap)
    const required = continuous === 'yes' ? load * 1.25 : load
    const pass = finalAmp !== null && finalAmp >= required
    // Max breaker: largest standard ≤ final ampacity, capped by 240.4(D)
    let breaker: number | null = null
    if (finalAmp !== null) {
      for (const b of BREAKERS) if (b <= finalAmp) breaker = b
      const cap = SMALL_CAP[gauge]
      if (cap !== undefined && (breaker === null || breaker > cap)) breaker = cap
    }
    return { tFactor, bFactor, base, termCap, derated, finalAmp, required, pass, breaker }
  }, [gauge, insul, term, ambientF, ccc, load, continuous])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Wire gauge (copper)" value={gauge} onChange={setGauge} options={GAUGES.map((g) => [g, `${g} AWG`])} />
        <Select label="Conductor insulation rating" value={insul} onChange={setInsul} options={[
          ['60', '60°C (TW, UF)'], ['75', '75°C (THWN, XHHW)'], ['90', '90°C (THHN, THWN-2)'],
        ]} />
        <Select label="Termination rating" value={term} onChange={setTerm} options={[
          ['75', '75°C (most modern gear)'], ['60', '60°C (older gear, NM cable)'],
        ]} />
        <Field label="Ambient temperature" value={ambientF} onChange={setAmbientF} suffix="°F" />
        <Field label="Current-carrying conductors in raceway" value={ccc} onChange={setCcc} step="1" />
        <Field label="Load current" value={load} onChange={setLoad} suffix="A" />
        <Select label="Continuous load (≥3 hrs)?" value={continuous} onChange={setContinuous} options={[
          ['yes', 'Yes — apply the 125% rule'], ['no', 'No'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Final allowable ampacity" value={r.finalAmp === null ? 'Not usable' : `${num(r.finalAmp, 1)} A`} />
        <Result label="Required ampacity" value={`${num(r.required, 1)} A`} />
        <Result label="Verdict" value={r.finalAmp === null ? 'INSULATION OVER TEMP LIMIT' : r.pass ? 'PASS' : 'FAIL'} />
        <Result label="Max breaker (240.4)" value={r.breaker === null ? '—' : `${r.breaker} A`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Base ampacity (conductor column)" value={`${r.base} A (${insul}°C)`} />
        <Result label="Temp correction factor" value={r.tFactor === null ? '—' : `${r.tFactor}`} />
        <Result label="Bundling factor" value={`${r.bFactor}`} />
        <Result label="Termination cap (110.14)" value={`${r.termCap} A (${term}°C)`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Method per NEC 310.15: start at the conductor's insulation-rating column of Table 310.16,
        apply ambient-temperature correction (Table 310.15(B)(1)) and the bundling adjustment
        (Table 310.15(C)(1)) — then cap the result at the termination-temperature column per
        110.14(C), because the weakest link governs. Neutrals and grounds don't count as
        current-carrying except with harmonic loads. 240.4(D) caps small conductors at
        15/20/30 A for 14/12/10 AWG copper regardless of derating results.
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
  'ampacity-derating-calculator': AmpacityDerateCalc,
  'motor-circuit-calculator': MotorCircuitCalc,
  'service-load-calculator': ServiceLoadCalc,
  'duct-size-calculator': DuctSizeCalc,
  'room-airflow-calculator': RoomAirflowCalc,
  'superheat-subcooling-calculator': SuperheatCalc,
  'drain-size-calculator': DrainSizeCalc,
  'vent-size-calculator': VentSizeCalc,
  'water-heater-size-calculator': WaterHeaterCalc,
}
