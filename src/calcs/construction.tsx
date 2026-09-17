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
}
