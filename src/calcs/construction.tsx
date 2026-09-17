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
    <p className="text-xs text-muted-foreground">
      Quantities are exact math from your dimensions. Unit costs and labor rates are editable
      typical-range defaults — replace them with your supplier and contractor quotes before budgeting.
    </p>
  )
}

/* ---------------- Framing: studs & plates ---------------- */

export function FramingCalc() {
  const [length, setLength] = useNumber(20)
  const [height, setHeight] = useNumber(8)
  const [spacing, setSpacing] = useState('16')
  const [openings, setOpenings] = useNumber(1)
  const [corners, setCorners] = useNumber(2)
  const [studCost, setStudCost] = useNumber(4.5)
  const [plateCost, setPlateCost] = useNumber(5)
  const [laborLf, setLaborLf] = useNumber(3)

  const r = useMemo(() => {
    const sp = parseFloat(spacing)
    // Studs: one per spacing interval + 1 starter, plus jack+king+cripple per opening, plus corner studs
    const baseStuds = Math.ceil((length * 12) / sp) + 1
    const studs = baseStuds + openings * 4 + corners
    // Plates: single bottom + double top = 3× wall length, cut from 8-ft boards
    const plateLf = length * 3
    const plateBoards = Math.ceil(plateLf / 8)
    const materials = studs * studCost + plateBoards * plateCost
    const labor = laborLf * length
    return { baseStuds, studs, plateLf, plateBoards, materials, labor, total: materials + labor, sqft: length * height }
  }, [length, height, spacing, openings, corners, studCost, plateCost, laborLf])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Wall length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Wall height" value={height} onChange={setHeight} suffix="ft" />
        <Select label="Stud spacing" value={spacing} onChange={setSpacing} options={[
          ['16', '16" on center (standard)'], ['24', '24" on center'], ['12', '12" on center (heavy load)'],
        ]} />
        <Field label="Door/window openings" value={openings} onChange={setOpenings} step="1" />
        <Field label="Corners / intersections" value={corners} onChange={setCorners} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Studs needed" value={String(r.studs)} />
        <Result label="Plate boards (8 ft)" value={String(r.plateBoards)} />
        <Result label="Plate lumber (LF)" value={num(r.plateLf, 0)} />
        <Result label="Wall area" value={`${num(r.sqft, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Count: ⌈length ÷ spacing⌉ + 1 starter stud, + 4 per opening (king, jack, and cripples), + 1 per corner.
        Plates are single bottom + double top (3× length). Add ~10% for culls and miscuts on big jobs.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Cost per stud" value={studCost} onChange={setStudCost} prefix="$" />
          <Field label="Cost per plate board" value={plateCost} onChange={setPlateCost} prefix="$" />
          <Field label="Labor per LF of wall" value={laborLf} onChange={setLaborLf} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Materials" value={usd(r.materials, 2)} />
          <Result label="Labor" value={usd(r.labor, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Drywall ---------------- */

export function DrywallCalc() {
  const [length, setLength] = useNumber(14)
  const [width, setWidth] = useNumber(12)
  const [height, setHeight] = useNumber(8)
  const [doors, setDoors] = useNumber(1)
  const [windows, setWindows] = useNumber(2)
  const [ceiling, setCeiling] = useState('yes')
  const [sheet, setSheet] = useState('32')
  const [sheetCost, setSheetCost] = useNumber(16)
  const [laborSqft, setLaborSqft] = useNumber(2)

  const r = useMemo(() => {
    const wallArea = 2 * (length + width) * height - doors * 21 - windows * 15 // std door 21 sqft, window 15
    const ceilArea = ceiling === 'yes' ? length * width : 0
    const area = Math.max(0, wallArea + ceilArea)
    const withWaste = area * 1.1
    const sheetSqft = parseFloat(sheet)
    const sheets = Math.ceil(withWaste / sheetSqft)
    const tapeRolls = Math.ceil((sheets * 35) / 500) // ~35 ft tape per sheet, 500-ft rolls
    const mudGallons = Math.ceil(area / 100) // ~1 gal ready-mix per 100 sq ft, 3 coats
    const screwLbs = Math.ceil(sheets * 0.25) // ~32 screws per sheet, ~130 screws/lb
    const materials = sheets * sheetCost + tapeRolls * 9 + mudGallons * 15 + screwLbs * 8
    const labor = laborSqft * area
    return { area, sheets, tapeRolls, mudGallons, screwLbs, materials, labor, total: materials + labor }
  }, [length, width, height, doors, windows, ceiling, sheet, sheetCost, laborSqft])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Room length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Room width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Wall height" value={height} onChange={setHeight} suffix="ft" />
        <Field label="Doors (21 sq ft each)" value={doors} onChange={setDoors} step="1" />
        <Field label="Windows (15 sq ft each)" value={windows} onChange={setWindows} step="1" />
        <Select label="Sheet size" value={sheet} onChange={setSheet} options={[
          ['32', '4 × 8 ft (32 sq ft)'], ['48', '4 × 12 ft (48 sq ft — fewer seams)'],
        ]} />
        <Select label="Include ceiling?" value={ceiling} onChange={setCeiling} options={[['yes', 'Yes'], ['no', 'No']]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Sheets needed" value={String(r.sheets)} />
        <Result label="Net area (incl. 10% waste)" value={`${num(r.area * 1.1, 0)} sq ft`} />
        <Result label="Tape (500-ft rolls)" value={String(r.tapeRolls)} />
        <Result label="Joint compound" value={`${r.mudGallons} gal`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Drywall screws" value={`~${r.screwLbs} lb`} />
        <Result label="Wall + ceiling area" value={`${num(r.area, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Area = 2(L+W)×H minus openings (door 21 sq ft, window 15), plus ceiling if selected, plus 10% waste.
        Tape ~35 ft per sheet; ready-mix mud ~1 gal per 100 sq ft for tape + two finish coats.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Cost per sheet (½-inch)" value={sheetCost} onChange={setSheetCost} prefix="$" />
          <Field label="Labor per sq ft (hang + tape + finish)" value={laborSqft} onChange={setLaborSqft} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Materials (sheets, tape, mud, screws)" value={usd(r.materials, 2)} />
          <Result label="Labor" value={usd(r.labor, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Roofing ---------------- */

const PITCH_MULT: Record<string, number> = {
  '4': 1.054, '6': 1.118, '8': 1.202, '10': 1.302, '12': 1.414,
}

export function RoofingCalc() {
  const [length, setLength] = useNumber(40)
  const [width, setWidth] = useNumber(30)
  const [pitch, setPitch] = useState('6')
  const [style, setStyle] = useState('gable')
  const [bundleCost, setBundleCost] = useNumber(35)
  const [laborSquare, setLaborSquare] = useNumber(150)

  const r = useMemo(() => {
    const mult = PITCH_MULT[pitch]
    const waste = style === 'hip' ? 1.15 : 1.10
    const area = length * width * mult * waste
    const squares = area / 100
    const bundles = Math.ceil(squares * 3) // 3 bundles per square, architectural shingles
    const feltRolls = Math.ceil(area / 400) // 15-lb felt, 400 sq ft per roll
    const nailLbs = Math.ceil(squares * 2) // ~2 lb roofing nails per square
    const materials = bundles * bundleCost + feltRolls * 25 + nailLbs * 3
    const labor = laborSquare * squares
    return { area, squares, bundles, feltRolls, nailLbs, materials, labor, total: materials + labor }
  }, [length, width, pitch, style, bundleCost, laborSquare])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Roof footprint length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Roof footprint width" value={width} onChange={setWidth} suffix="ft" />
        <Select label="Pitch (rise per 12&quot; run)" value={pitch} onChange={setPitch} options={[
          ['4', '4/12 (low slope)'], ['6', '6/12 (common)'], ['8', '8/12 (steep)'],
          ['10', '10/12 (very steep)'], ['12', '12/12 (45°)'],
        ]} />
        <Select label="Roof style" value={style} onChange={setStyle} options={[
          ['gable', 'Gable (10% waste)'], ['hip', 'Hip / complex (15% waste)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Squares (100 sq ft)" value={num(r.squares, 1)} />
        <Result label="Shingle bundles" value={String(r.bundles)} />
        <Result label="Felt underlayment rolls" value={String(r.feltRolls)} />
        <Result label="Roofing nails" value={`~${r.nailLbs} lb`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Slope area = footprint × pitch multiplier ({PITCH_MULT[pitch]} for {pitch}/12) plus waste.
        3 bundles per square (architectural shingles), felt at 400 sq ft per roll, ~2 lb nails per square.
        Excludes ridge cap, drip edge, flashing, and tear-off disposal — budget those separately.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Cost per bundle" value={bundleCost} onChange={setBundleCost} prefix="$" />
          <Field label="Labor per square (install)" value={laborSquare} onChange={setLaborSquare} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Materials (shingles, felt, nails)" value={usd(r.materials, 2)} />
          <Result label="Labor" value={usd(r.labor, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Paint ---------------- */

export function PaintCalc() {
  const [length, setLength] = useNumber(14)
  const [width, setWidth] = useNumber(12)
  const [height, setHeight] = useNumber(8)
  const [doors, setDoors] = useNumber(1)
  const [windows, setWindows] = useNumber(2)
  const [coats, setCoats] = useState('2')
  const [ceiling, setCeiling] = useState('no')
  const [coverage, setCoverage] = useNumber(350)
  const [galCost, setGalCost] = useNumber(40)
  const [laborSqft, setLaborSqft] = useNumber(1.5)

  const r = useMemo(() => {
    const wallArea = Math.max(0, 2 * (length + width) * height - doors * 21 - windows * 15)
    const ceilArea = ceiling === 'yes' ? length * width : 0
    const area = wallArea + ceilArea
    const n = parseFloat(coats)
    const gallons = Math.ceil((area * n) / Math.max(50, coverage))
    const primer = Math.ceil(area / Math.max(50, coverage))
    const materials = gallons * galCost + primer * galCost * 0.7
    const labor = laborSqft * area
    return { wallArea, area, gallons, primer, materials, labor, total: materials + labor }
  }, [length, width, height, doors, windows, coats, ceiling, coverage, galCost, laborSqft])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Room length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Room width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Wall height" value={height} onChange={setHeight} suffix="ft" />
        <Field label="Doors (21 sq ft)" value={doors} onChange={setDoors} step="1" />
        <Field label="Windows (15 sq ft)" value={windows} onChange={setWindows} step="1" />
        <Select label="Coats" value={coats} onChange={setCoats} options={[['1', '1 (refresh)'], ['2', '2 (standard)'], ['3', '3 (dark over light)']]} />
        <Select label="Paint ceiling too?" value={ceiling} onChange={setCeiling} options={[['no', 'No'], ['yes', 'Yes']]} />
        <Field label="Coverage per gallon (can label)" value={coverage} onChange={setCoverage} suffix="sq ft" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Paint gallons" value={String(r.gallons)} />
        <Result label="Primer gallons (if new drywall)" value={String(r.primer)} />
        <Result label="Wall area" value={`${num(r.wallArea, 0)} sq ft`} />
        <Result label="Total paintable area" value={`${num(r.area, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Area = 2(L+W)×H minus openings, plus ceiling if selected. Gallons = area × coats ÷ coverage
        (check your can — 350–400 sq ft/gal is typical for quality paint). Textured walls can cut
        coverage by a third.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Cost per gallon" value={galCost} onChange={setGalCost} prefix="$" />
          <Field label="Labor per sq ft" value={laborSqft} onChange={setLaborSqft} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Materials (paint + primer)" value={usd(r.materials, 2)} />
          <Result label="Labor" value={usd(r.labor, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Tile ---------------- */

const TILE_SIZES: Record<string, number> = {
  '12x12': 1, '12x24': 2, '18x18': 2.25, '24x24': 4, '6x6': 0.25,
}

export function TileCalc() {
  const [length, setLength] = useNumber(10)
  const [width, setWidth] = useNumber(8)
  const [size, setSize] = useState('12x12')
  const [layout, setLayout] = useState('straight')
  const [tileCost, setTileCost] = useNumber(3)
  const [laborSqft, setLaborSqft] = useNumber(6)

  const r = useMemo(() => {
    const area = length * width
    const waste = layout === 'diagonal' ? 1.15 : 1.10
    const tileSqft = TILE_SIZES[size]
    const tiles = Math.ceil((area * waste) / tileSqft)
    const thinsetBags = Math.ceil(area / 95) // 50-lb bag, ¼-inch trowel ≈ 95 sq ft
    const groutLbs = Math.ceil(area * 0.25) // sanded grout, ⅛–¼-in joints
    const materials = tiles * tileSqft * tileCost + thinsetBags * 18 + groutLbs * 1.5
    const labor = laborSqft * area
    return { area, tiles, thinsetBags, groutLbs, materials, labor, total: materials + labor, waste }
  }, [length, width, size, layout, tileCost, laborSqft])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Floor length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Floor width" value={width} onChange={setWidth} suffix="ft" />
        <Select label="Tile size" value={size} onChange={setSize} options={[
          ['6x6', '6 × 6 in'], ['12x12', '12 × 12 in'], ['12x24', '12 × 24 in'],
          ['18x18', '18 × 18 in'], ['24x24', '24 × 24 in'],
        ]} />
        <Select label="Layout" value={layout} onChange={setLayout} options={[
          ['straight', 'Straight / grid (10% waste)'], ['diagonal', 'Diagonal / herringbone (15% waste)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Tiles needed" value={String(r.tiles)} />
        <Result label="Floor area" value={`${num(r.area, 0)} sq ft`} />
        <Result label="Thinset (50-lb bags)" value={String(r.thinsetBags)} />
        <Result label="Grout" value={`~${r.groutLbs} lb`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Tile count includes {layout === 'diagonal' ? '15%' : '10%'} cutting waste — always round up, and keep
        2–3 spare tiles for future repairs. Thinset at ~95 sq ft per 50-lb bag (¼-inch notch trowel);
        grout ≈ ¼ lb per sq ft for standard joints.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Tile cost per sq ft" value={tileCost} onChange={setTileCost} prefix="$" />
          <Field label="Labor per sq ft (set + grout)" value={laborSqft} onChange={setLaborSqft} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Materials (tile, thinset, grout)" value={usd(r.materials, 2)} />
          <Result label="Labor" value={usd(r.labor, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

export const CONSTRUCTION_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'framing-calculator': FramingCalc,
  'drywall-calculator': DrywallCalc,
  'roofing-calculator': RoofingCalc,
  'paint-calculator': PaintCalc,
  'tile-calculator': TileCalc,
  'concrete-mix-calculator': ConcreteMixCalc,
  'road-base-calculator': RoadBaseCalc,
  'driveway-cost-comparison': DrivewayCompareCalc,
}

/* ---------------- Concrete Mix Selector ---------------- */

const MIX_TABLE: Record<string, { psi: string; use: string; air: string; note: string }> = {
  footing: { psi: '2,500–3,000 psi', use: 'Footings & foundation walls', air: 'Not required (below grade)', note: 'Standard residential footing mix. Keep the slump at 4–5 inches for easy placement into forms.' },
  slab: { psi: '3,000–3,500 psi', use: 'Interior slabs & garage floors', air: 'Optional', note: 'Interior slabs skip air entrainment — it makes power-troweling harder and can blister the finish.' },
  driveway: { psi: '3,500–4,000 psi', use: 'Driveways & exterior flatwork', air: 'Yes — 5–7% in freeze-thaw climates', note: 'Exterior concrete in cold climates must be air-entrained or it will scale within a few winters.' },
  patio: { psi: '3,500 psi', use: 'Patios, sidewalks & pool decks', air: 'Yes — 5–7% if exposed to freezing', note: 'Same spec as driveways. For stamped finishes, tell the plant — stampable mixes tweak the sand content.' },
  countertop: { psi: '5,000+ psi (or GFRC)', use: 'Counters, sinks & furniture', air: 'No', note: 'High-early or GFRC mixes with fibers and admixtures — this is a specialty bagged product, not ready-mix.' },
}

export function ConcreteMixCalc() {
  const [job, setJob] = useState('driveway')
  const [length, setLength] = useNumber(24)
  const [width, setWidth] = useNumber(12)
  const [depth, setDepth] = useNumber(4)
  const [yardCost, setYardCost] = useNumber(165)
  const [bagCost, setBagCost] = useNumber(6.5)

  const r = useMemo(() => {
    const area = length * width
    const cuyd = (area * depth) / 12 / 27
    const orderYd = cuyd * 1.1 // 10% over-order rule
    const bags80 = Math.ceil((cuyd * 27) / 0.6)
    const readyMix = cuyd >= 1
    const mix = MIX_TABLE[job]
    const costReady = orderYd * yardCost
    const costBagged = bags80 * bagCost
    return { area, cuyd, orderYd, bags80, readyMix, mix, costReady, costBagged, coversAt4: cuyd * 81 }
  }, [job, length, width, depth, yardCost, bagCost])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <Select label="What are you pouring?" value={job} onChange={setJob} options={[
        ['footing', 'Footings / foundation'], ['slab', 'Interior or garage slab'],
        ['driveway', 'Driveway'], ['patio', 'Patio / sidewalk'], ['countertop', 'Countertop / specialty'],
      ]} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Thickness" value={depth} onChange={setDepth} suffix="in" />
      </div>
      <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
        <p className="text-sm font-semibold">Recommended mix: {r.mix.psi}</p>
        <p className="text-sm text-muted-foreground">{r.mix.use} · Air entrainment: {r.mix.air}</p>
        <p className="mt-1 text-sm text-muted-foreground">{r.mix.note}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Concrete needed" value={`${num(r.cuyd, 2)} yd³`} />
        <Result label="Order (with 10% extra)" value={`${num(r.orderYd, 2)} yd³`} />
        <Result label="Equals in 80-lb bags" value={String(r.bags80)} />
        <Result label="Area covered" value={`${num(r.area, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Conversion anchor: <strong>1 cubic yard covers 81 sq ft at 4 inches thick</strong> (54 sq ft at 6 in,
        108 sq ft at 3 in). {r.readyMix
          ? 'At ≥1 yard, ready-mix delivery usually beats bagged on both cost and your back.'
          : 'Under a yard, bags are practical; at 1 yard and up, call a ready-mix plant.'}
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Ready-mix per yard" value={yardCost} onChange={setYardCost} prefix="$" />
          <Field label="80-lb bag price" value={bagCost} onChange={setBagCost} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Result label={`Ready-mix (${num(r.orderYd, 1)} yd³ ordered)`} value={usd(r.costReady, 2)} />
          <Result label={`Bagged (${r.bags80} bags)`} value={usd(r.costBagged, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Road Base / Aggregate ---------------- */

export function RoadBaseCalc() {
  const [length, setLength] = useNumber(50)
  const [width, setWidth] = useNumber(12)
  const [depth, setDepth] = useNumber(6)
  const [material, setMaterial] = useState('crushed')
  const [tonCost, setTonCost] = useNumber(28)
  const [delivered, setDelivered] = useState('yes')

  const r = useMemo(() => {
    const density = material === 'asphalt' ? 2.0 : material === 'recycled' ? 1.35 : 1.4 // compacted tons per yd³
    const compactedYd = (length * width * depth) / 12 / 27
    const orderTons = compactedYd * density * (material === 'asphalt' ? 1 : 1.25) // aggregates: +25% loose-to-compacted
    const materials = orderTons * tonCost
    const delivery = delivered === 'yes' ? 150 : 0
    return { compactedYd, orderTons, materials, delivery, total: materials + delivery, area: length * width, density }
  }, [length, width, depth, material, tonCost, delivered])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Compacted depth" value={depth} onChange={setDepth} suffix="in" />
        <Select label="Material" value={material} onChange={setMaterial} options={[
          ['crushed', 'Crushed stone / road base (¾" minus)'], ['recycled', 'Recycled concrete / asphalt millings'],
          ['asphalt', 'Hot-mix asphalt'],
        ]} />
        <Select label="Delivery needed?" value={delivered} onChange={setDelivered} options={[['yes', 'Yes — add delivery'], ['no', 'No — I have a truck/trailer']]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Order quantity" value={`${num(r.orderTons, 1)} tons`} />
        <Result label="Compacted volume" value={`${num(r.compactedYd, 2)} yd³`} />
        <Result label="Coverage" value={`${num(r.area, 0)} sq ft`} />
        <Result label="Density used" value={`${r.density} t/yd³`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Aggregates compact ~25% from loose to rolled — the tonnage shown already includes that compaction
        factor (asphalt is ordered by compacted ton and doesn&apos;t need it). A passenger-car driveway base
        is typically 4–6 in compacted; RV/truck traffic wants 8–12 in. Compact in 3-inch lifts, not all at once.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Material per ton" value={tonCost} onChange={setTonCost} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Materials" value={usd(r.materials, 2)} />
          <Result label="Delivery (flat)" value={usd(r.delivery, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Driveway: Gravel vs Asphalt vs Concrete ---------------- */

export function DrivewayCompareCalc() {
  const [length, setLength] = useNumber(50)
  const [width, setWidth] = useNumber(12)
  const [gravelSqft, setGravelSqft] = useNumber(1.5)
  const [asphaltSqft, setAsphaltSqft] = useNumber(5)
  const [concreteSqft, setConcreteSqft] = useNumber(9)

  const r = useMemo(() => {
    const area = length * width
    // 20-year total cost per option: install + maintenance
    const gravelInstall = area * gravelSqft
    const gravelMaint = area * 0.25 * (20 / 2) // regrade/replenish ~every 2 yrs
    const asphaltInstall = area * asphaltSqft
    const asphaltMaint = area * 0.5 * 4 // sealcoat ~every 5 yrs, 4 times in 20
    const concreteInstall = area * concreteSqft
    const concreteMaint = area * 0.15 * 2 // joint sealing / cleaning, twice in 20 yrs
    const rows = [
      { name: 'Gravel (6" crushed base)', install: gravelInstall, maint: gravelMaint, life: 'Indefinite with upkeep' },
      { name: 'Asphalt (3" hot-mix over base)', install: asphaltInstall, maint: asphaltMaint, life: '~15–20 yrs (resurface)' },
      { name: 'Concrete (4" 4000 psi)', install: concreteInstall, maint: concreteMaint, life: '30–40 yrs' },
    ]
    return { area, rows }
  }, [length, width, gravelSqft, asphaltSqft, concreteSqft])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Driveway length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Driveway width" value={width} onChange={setWidth} suffix="ft" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3">Surface</th><th className="py-2 pr-3">Install cost</th>
              <th className="py-2 pr-3">20-yr maintenance</th><th className="py-2 pr-3">20-yr total</th>
              <th className="py-2 pr-3">Cost / sq ft / yr</th><th className="py-2">Lifespan</th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.name} className="border-b last:border-0">
                <td className="py-2 pr-3 font-medium">{row.name}</td>
                <td className="py-2 pr-3">{usd(row.install)}</td>
                <td className="py-2 pr-3">{usd(row.maint)}</td>
                <td className="py-2 pr-3 font-semibold">{usd(row.install + row.maint)}</td>
                <td className="py-2 pr-3">{usd((row.install + row.maint) / r.area / 20, 2)}</td>
                <td className="py-2 text-muted-foreground">{row.life}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        Gravel wins on first cost and stays cheapest if you keep up with regrading; asphalt splits the
        difference but needs sealcoating on schedule or the math collapses; concrete costs the most up front
        and typically pulls ahead only on a 30–40-year horizon. Climate matters: asphalt softens in extreme
        heat, concrete scales in freeze-thaw without air entrainment, gravel migrates on slopes.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Adjust installed costs (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Gravel installed $/sq ft" value={gravelSqft} onChange={setGravelSqft} prefix="$" />
          <Field label="Asphalt installed $/sq ft" value={asphaltSqft} onChange={setAsphaltSqft} prefix="$" />
          <Field label="Concrete installed $/sq ft" value={concreteSqft} onChange={setConcreteSqft} prefix="$" />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}
