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

/* ---------------- Fence ---------------- */

export function FenceCalc() {
  const [length, setLength] = useNumber(100)
  const [height, setHeight] = useState('6')
  const [style, setStyle] = useState('privacy')
  const [gates, setGates] = useNumber(1)
  const [gateWidth, setGateWidth] = useNumber(4)
  const [postCost, setPostCost] = useNumber(9)
  const [railCost, setRailCost] = useNumber(4)
  const [picketCost, setPicketCost] = useNumber(2.5)
  const [bagCost, setBagCost] = useNumber(6)
  const [laborLf, setLaborLf] = useNumber(12)

  const r = useMemo(() => {
    const fenceLf = Math.max(0, length - gates * gateWidth)
    const sections = Math.ceil(fenceLf / 8)
    const posts = sections + 1 + gates * 2 // gate posts are doubled
    const rails = sections * (parseFloat(height) > 4 ? 3 : 2)
    // privacy: 5.5" boards touching; picket: 3.5" board + 2.5" gap = 6" pitch
    const pickets = style === 'privacy'
      ? Math.ceil((fenceLf * 12) / 5.5)
      : Math.ceil((fenceLf * 12) / 6)
    const bags = posts * 2 // 2× 50-lb bags per 4×4 post set ~2 ft deep (8"Ø hole ≈ 0.7 cu ft)
    const materials = posts * postCost + rails * railCost + pickets * picketCost + bags * bagCost
    const labor = laborLf * fenceLf
    return { fenceLf, sections, posts, rails, pickets, bags, materials, labor, total: materials + labor }
  }, [length, height, style, gates, gateWidth, postCost, railCost, picketCost, bagCost, laborLf])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Total fence line" value={length} onChange={setLength} suffix="ft" />
        <Select label="Height" value={height} onChange={setHeight} options={[
          ['4', '4 ft'], ['6', '6 ft (privacy standard)'], ['8', '8 ft'],
        ]} />
        <Select label="Style" value={style} onChange={setStyle} options={[
          ['privacy', 'Privacy (5.5" boards, no gaps)'], ['picket', 'Picket (3.5" boards, 2.5" gaps)'],
        ]} />
        <Field label="Gates" value={gates} onChange={setGates} step="1" />
        <Field label="Gate width" value={gateWidth} onChange={setGateWidth} suffix="ft" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Posts (4×4)" value={String(r.posts)} />
        <Result label="Rails (2×4 × 8 ft)" value={String(r.rails)} />
        <Result label={style === 'privacy' ? 'Fence boards' : 'Pickets'} value={String(r.pickets)} />
        <Result label="Concrete (50-lb bags)" value={String(r.bags)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Posts every 8 ft plus 1 starter, 2 extra per gate. Rails: 2 per section up to 4 ft, 3 for 6 ft+.
        Concrete at 2 bags per post (8"Ø × 24" hole ≈ 0.7 cu ft). Add ~10% boards for culls and cuts.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Cost per post" value={postCost} onChange={setPostCost} prefix="$" />
          <Field label="Cost per rail" value={railCost} onChange={setRailCost} prefix="$" />
          <Field label="Cost per board/picket" value={picketCost} onChange={setPicketCost} prefix="$" />
          <Field label="Cost per concrete bag" value={bagCost} onChange={setBagCost} prefix="$" />
          <Field label="Labor per LF" value={laborLf} onChange={setLaborLf} prefix="$" />
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

/* ---------------- Deck ---------------- */

export function DeckCalc() {
  const [length, setLength] = useNumber(16)
  const [width, setWidth] = useNumber(12)
  const [boardLen, setBoardLen] = useState('16')
  const [joistSpacing, setJoistSpacing] = useState('16')
  const [deckCostLf, setDeckCostLf] = useNumber(2.2)
  const [joistCost, setJoistCost] = useNumber(12)
  const [laborSqft, setLaborSqft] = useNumber(8)

  const r = useMemo(() => {
    const area = length * width
    // 5.5" board + 1/8" gap = 5.625" coverage; rows run along deck width
    const rows = Math.ceil((width * 12) / 5.625)
    const deckLf = rows * length
    const boards = Math.ceil((deckLf / parseFloat(boardLen)) * 1.1) // 10% waste
    const joists = Math.ceil((length * 12) / parseFloat(joistSpacing)) + 1
    const screws = Math.ceil((area * 3.5) / 50) * 50 // ~350 screws per 100 sq ft, rounded to boxes
    const materials = deckLf * 1.1 * deckCostLf + joists * joistCost
    const labor = laborSqft * area
    return { area, rows, deckLf, boards, joists, screws, materials, labor, total: materials + labor }
  }, [length, width, boardLen, joistSpacing, deckCostLf, joistCost, laborSqft])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Deck length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Deck width" value={width} onChange={setWidth} suffix="ft" />
        <Select label="Deck board length" value={boardLen} onChange={setBoardLen} options={[
          ['8', '8 ft'], ['12', '12 ft'], ['16', '16 ft'], ['20', '20 ft'],
        ]} />
        <Select label="Joist spacing" value={joistSpacing} onChange={setJoistSpacing} options={[
          ['16', '16" on center (standard)'], ['12', '12" on center (composite/heavy)'], ['24', '24" on center'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Deck boards (incl. 10% waste)" value={String(r.boards)} />
        <Result label="Joists" value={String(r.joists)} />
        <Result label="Deck screws" value={`~${num(r.screws, 0)}`} />
        <Result label="Deck area" value={`${num(r.area, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Boards: 5.5" wide + 1/8" gap = 5.625" of coverage per row; rows × length = total linear feet,
        cut from your board length with 10% waste. Joists at your spacing + 1 rim side. Screws at ~350
        per 100 sq ft (2 per joist crossing). Footings, beams, posts, and railing are separate —
        check code for footing depth in your frost zone.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Decking cost per LF" value={deckCostLf} onChange={setDeckCostLf} prefix="$" />
          <Field label="Cost per joist" value={joistCost} onChange={setJoistCost} prefix="$" />
          <Field label="Labor per sq ft" value={laborSqft} onChange={setLaborSqft} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Materials (decking + joists)" value={usd(r.materials, 2)} />
          <Result label="Labor" value={usd(r.labor, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Insulation ---------------- */

export function InsulationCalc() {
  const [area, setArea] = useNumber(400)
  const [framing, setFraming] = useState('16')
  const [battLen, setBattLen] = useState('93')
  const [zone, setZone] = useState('mixed')
  const [battCost, setBattCost] = useNumber(1.1)

  const r = useMemo(() => {
    const battWidth = framing === '16' ? 15 : 23 // standard batt widths for 16"/24" oc
    const battSqft = (battWidth * parseFloat(battLen)) / 144
    const batts = Math.ceil((area * 1.05) / battSqft) // 5% trim waste
    const rec = zone === 'warm' ? 'R-30 to R-49 attic · R-13 to R-15 walls'
      : zone === 'mixed' ? 'R-38 to R-60 attic · R-13 to R-21 walls'
      : 'R-49 to R-60 attic · R-19 to R-21+ walls'
    const materials = area * 1.05 * battCost
    return { battWidth, battSqft, batts, rec, materials }
  }, [area, framing, battLen, zone, battCost])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Area to insulate" value={area} onChange={setArea} suffix="sq ft" />
        <Select label="Stud/joist spacing" value={framing} onChange={setFraming} options={[
          ['16', '16" on center (15" batts)'], ['24', '24" on center (23" batts)'],
        ]} />
        <Select label="Batt length" value={battLen} onChange={setBattLen} options={[
          ['93', '93" (8-ft walls)'], ['105', '105" (9-ft walls)'], ['48', '48" (attic joists)'],
        ]} />
        <Select label="Climate zone" value={zone} onChange={setZone} options={[
          ['warm', 'Warm (south, DOE zones 1–2)'], ['mixed', 'Mixed (zones 3–4)'], ['cold', 'Cold (zones 5–7)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Batts needed" value={String(r.batts)} />
        <Result label="Batt coverage" value={`${num(r.battSqft, 1)} sq ft each`} />
        <Result label="Materials (est.)" value={usd(r.materials, 2)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Batt cost per sq ft" value={battCost} onChange={setBattCost} prefix="$" />
      </div>
      <p className="text-sm text-muted-foreground">
        DOE guidance for your zone: <strong>{r.rec}</strong>. Count is area + 5% trim waste ÷ batt
        coverage ({r.battWidth}" × {battLen}"). Walls are usually R-13/R-15 (2×4) or R-19/R-21 (2×6);
        attics stack batts or blow loose-fill to reach the target R. Do not compress batts —
        compressed fiberglass loses R-value.
      </p>
      <CostNote />
    </CardContent></Card>
  )
}

/* ---------------- Asphalt ---------------- */

export function AsphaltCalc() {
  const [length, setLength] = useNumber(40)
  const [width, setWidth] = useNumber(12)
  const [thickness, setThickness] = useState('2')
  const [tonPrice, setTonPrice] = useNumber(120)
  const [laborSqft, setLaborSqft] = useNumber(2.5)

  const r = useMemo(() => {
    const area = length * width
    const t = parseFloat(thickness)
    const cuft = area * (t / 12)
    // compacted hot-mix asphalt ≈ 145 lb per cubic foot
    const tons = (cuft * 145) / 2000
    const materials = tons * tonPrice
    const labor = laborSqft * area
    return { area, cuft, tons, materials, labor, total: materials + labor }
  }, [length, width, thickness, tonPrice, laborSqft])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Width" value={width} onChange={setWidth} suffix="ft" />
        <Select label="Compacted thickness" value={thickness} onChange={setThickness} options={[
          ['2', '2 in (resurface/light drive)'], ['3', '3 in (driveway standard)'], ['4', '4 in (heavy vehicles)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Hot-mix asphalt" value={`${num(r.tons, 2)} tons`} />
        <Result label="Coverage check" value={`${num(r.area / r.tons, 0)} sq ft/ton`} />
        <Result label="Area" value={`${num(r.area, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Tonnage = area × thickness × 145 lb/cu ft compacted density. Sanity rule: 1 ton covers ~80
        sq ft at 2" or ~40 sq ft at 4" — thicker lifts and rough base need more. This is paving
        tonnage only; excavation and gravel base are separate (use the Road Base calculator first).
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Asphalt per ton" value={tonPrice} onChange={setTonPrice} prefix="$" />
          <Field label="Paving labor per sq ft" value={laborSqft} onChange={setLaborSqft} prefix="$" />
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

/* ---------------- Board feet (lumber) ---------------- */

export function BoardFootCalc() {
  const [thickness, setThickness] = useNumber(2)
  const [width, setWidth] = useNumber(6)
  const [length, setLength] = useNumber(8)
  const [pieces, setPieces] = useNumber(10)
  const [priceBf, setPriceBf] = useNumber(3.5)

  const r = useMemo(() => {
    // board feet = thickness(in) × width(in) × length(ft) ÷ 12
    const bfEach = (thickness * width * length) / 12
    const totalBf = bfEach * pieces
    return { bfEach, totalBf, cost: totalBf * priceBf }
  }, [thickness, width, length, pieces, priceBf])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Thickness" value={thickness} onChange={setThickness} suffix="in" />
        <Field label="Width" value={width} onChange={setWidth} suffix="in" />
        <Field label="Length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Pieces" value={pieces} onChange={setPieces} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Board feet each" value={num(r.bfEach, 2)} />
        <Result big label="Total board feet" value={num(r.totalBf, 2)} />
        <Result label="Cost at $/BF" value={usd(r.cost, 2)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price per board foot" value={priceBf} onChange={setPriceBf} prefix="$" />
      </div>
      <p className="text-sm text-muted-foreground">
        BF = thickness (in) × width (in) × length (ft) ÷ 12. Hardwood is sold by the board foot;
        remember rough lumber is measured full-dimension, so a planed ¾" board still bills as 1"
        (four-quarter). A softwood 2×6×8 at the home center is 8 BF nominal.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Stairs ---------------- */

// inches -> "7 3/4"" style fraction string, rounded to nearest 1/16
function fracIn(x: number): string {
  const whole = Math.floor(x)
  let six = Math.round((x - whole) * 16)
  if (six === 0) return `${whole}"`
  if (six === 16) return `${whole + 1}"`
  let d = 16
  while (six % 2 === 0) { six /= 2; d /= 2 }
  return `${whole} ${six}/${d}"`
}

export function StairCalc() {
  const [rise, setRise] = useNumber(105)
  const [tread, setTread] = useState('10')
  const [width, setWidth] = useNumber(36)

  const r = useMemo(() => {
    // IRC: riser max 7.75", tread min 10", plus 2×riser + tread should be 24–26"
    const risers = Math.ceil(rise / 7.75)
    const actualRiser = rise / risers
    const treads = risers - 1 // top landing counts as the last "step"
    const treadD = parseFloat(tread)
    const run = treads * treadD
    const stringer = Math.sqrt(run * run + rise * rise) / 12
    const angle = Math.atan(rise / run) * 180 / Math.PI
    const comfort = 2 * actualRiser + treadD
    const codeOk = actualRiser <= 7.75 && treadD >= 10
    const comfortOk = comfort >= 24 && comfort <= 26
    // stringer count: edges + intermediates sized for 2× treads (≤24" OC); round stock to next 2-ft board
    const stringers = width < 36 ? 2 : width < 54 ? 3 : Math.ceil(width / 16) + 1
    const spacing = width / (stringers - 1)
    const stockFt = Math.ceil(stringer / 2) * 2
    return { risers, actualRiser, treads, run, stringer, angle, comfort, codeOk, comfortOk, stringers, spacing, stockFt }
  }, [rise, tread, width])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Total rise (floor to floor)" value={rise} onChange={setRise} suffix="in" />
        <Select label="Tread depth" value={tread} onChange={setTread} options={[
          ['10', '10 in (IRC minimum)'], ['11', '11 in (comfortable)'],
        ]} />
        <Field label="Stair width" value={width} onChange={setWidth} suffix="in" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Risers" value={`${r.risers} × ${fracIn(r.actualRiser)}`} />
        <Result label="Treads" value={String(r.treads)} />
        <Result label="Total run" value={`${num(r.run / 12, 2)} ft`} />
        <Result label="Stringer length" value={`${num(r.stringer, 1)} ft`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Stair angle" value={`${num(r.angle, 1)}° (ideal 30–37°)`} />
        <Result label="Comfort 2R+T" value={`${num(r.comfort, 1)}" (ideal 24–26")`} />
        <Result label="Stringers needed" value={`${r.stringers} (${num(r.spacing, 1)}" OC, 2× treads)`} />
        <Result label="2×12 stock per stringer" value={`${r.stockFt} ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        {r.codeOk
          ? `Passes IRC basics (riser ≤ 7.75", tread ≥ 10"). Comfort rule 2R+T = ${num(r.comfort, 1)}" — ${r.comfortOk ? 'in the ideal 24–26" range.' : 'outside the ideal 24–26" range; adjust tread depth.'}`
          : 'Fails IRC basics (riser ≤ 7.75", tread ≥ 10") — adjust inputs.'}
        {' '}Treads = risers − 1 because the upper floor is the last landing. Stringer count assumes
        2× lumber treads (up to 24" on-center); 5/4 deck boards want 16" and composite treads often
        demand 12" — add stringers accordingly. All risers must match within
        3/8" (R311.7.5): divide the rise exactly, never leave the remainder in one step. Cut
        stringers from 2×12 with at least 3.5" of solid throat left below the notches; handrail
        required at 4+ risers (34–38"), headroom minimum 6'8". Verify local amendments.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Rafter Length ---------------- */

// inches -> "13' 4 3/8\"" style string (fracIn handles the inch part)
function ftInFrac(x: number): string {
  let ft = Math.floor(x / 12)
  const inch = x - ft * 12
  const s = fracIn(inch)
  if (s === '12"') { ft += 1; return `${ft}' 0"` }
  return `${ft}' ${s}`
}

export function RafterCalc() {
  const [span, setSpan] = useNumber(24)
  const [pitch, setPitch] = useState('6')
  const [overhang, setOverhang] = useNumber(12)
  const [ridge, setRidge] = useState('1.5')
  const [kind, setKind] = useState('common')

  const r = useMemo(() => {
    const p = parseFloat(pitch)
    const runIn = (span / 2) * 12
    const riseIn = runIn * p / 12
    // ridge board: deduct half its thickness measured horizontally (R802 framing convention)
    const effRunIn = runIn - parseFloat(ridge) / 2
    const mult = Math.sqrt(1 + (p / 12) ** 2)       // common: slope length per inch of run
    const hipMult = Math.sqrt(2 + (p / 12) ** 2)    // hip: run lies on the 45° diagonal
    const commonLen = effRunIn * mult
    const hipLen = effRunIn * hipMult
    const tail = overhang * mult                    // overhang is horizontal; tail runs on slope
    const body = kind === 'hip' ? hipLen : commonLen
    const total = body + tail
    const plumb = Math.atan(p / 12) * 180 / Math.PI
    const stockFt = Math.ceil(total / 12 / 2) * 2
    return { runIn, riseIn, effRunIn, mult, commonLen, hipLen, tail, body, total, plumb, stockFt }
  }, [span, pitch, overhang, ridge, kind])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Building span (wall to wall)" value={span} onChange={setSpan} suffix="ft" />
        <Select label="Pitch (rise per 12 of run)" value={pitch} onChange={setPitch} options={
          ['3','4','5','6','7','8','9','10','12'].map((x) => [x, `${x}/12`])
        } />
        <Field label="Overhang (horizontal)" value={overhang} onChange={setOverhang} suffix="in" />
        <Select label="Ridge board thickness" value={ridge} onChange={setRidge} options={[
          ['1.5', '1½ in (standard 2×)'], ['0.75', '¾ in (LVL / single ply)'], ['0', 'None (truss / gusset)'],
        ]} />
        <Select label="Rafter type" value={kind} onChange={setKind} options={[
          ['common', 'Common rafter'], ['hip', 'Hip rafter (45° plan)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label={kind === 'hip' ? 'Hip rafter length' : 'Common rafter length'} value={ftInFrac(r.body)} />
        <Result label="Tail (overhang on slope)" value={ftInFrac(r.tail)} />
        <Result label="Total to cut" value={ftInFrac(r.total)} />
        <Result label="Stock per rafter" value={`${r.stockFt} ft`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Run (half span − ½ ridge)" value={ftInFrac(r.effRunIn)} />
        <Result label="Rise at ridge" value={ftInFrac(r.riseIn)} />
        <Result label="Plumb cut angle" value={`${num(r.plumb, 1)}°`} />
        <Result label="Multiplier (per in of run)" value={num(r.mult, 4)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Rafter length is the slope hypotenuse: run × √(1 + (pitch/12)²) — the classic rafter-table
        multiplier (1.1180 for 6/12, 1.4142 for 12/12). Half the ridge thickness comes off the run
        before the multiplier, because that deduction is measured horizontally. Hips run on the
        plan diagonal, so their multiplier is √(2 + (pitch/12)²) — exactly 1.5 at 6/12. The
        overhang you measure on the wall line stretches by the same multiplier along the tail.
        Cut the plumb cut at the shown angle; seat (birdsmouth) depth is typically 3½" for a 2×4
        wall. Layout math for ordering and cutting — spans and species sizing are a span-table
        question (see the joist span calculator).
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Siding ---------------- */

export function SidingCalc() {
  const [length, setLength] = useNumber(40)
  const [width, setWidth] = useNumber(28)
  const [height, setHeight] = useNumber(9)
  const [doors, setDoors] = useNumber(2)
  const [windows, setWindows] = useNumber(8)
  const [squareCost, setSquareCost] = useNumber(350)
  const [laborSquare, setLaborSquare] = useNumber(200)

  const r = useMemo(() => {
    const wallArea = 2 * (length + width) * height - doors * 21 - windows * 15
    const area = Math.max(0, wallArea)
    const withWaste = area * 1.1 // 10% cutting/waste standard
    const squares = withWaste / 100
    const materials = squares * squareCost
    const labor = squares * laborSquare
    return { area, withWaste, squares, materials, labor, total: materials + labor }
  }, [length, width, height, doors, windows, squareCost, laborSquare])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="House length" value={length} onChange={setLength} suffix="ft" />
        <Field label="House width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Wall height" value={height} onChange={setHeight} suffix="ft" />
        <Field label="Doors" value={doors} onChange={setDoors} step="1" />
        <Field label="Windows" value={windows} onChange={setWindows} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Squares to order (100 sq ft)" value={num(r.squares, 1)} />
        <Result label="Net wall area" value={`${num(r.area, 0)} sq ft`} />
        <Result label="With 10% waste" value={`${num(r.withWaste, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Siding is sold by the &quot;square&quot; (100 sq ft). Net walls = perimeter × height −
        openings (21 sq ft per door, 15 per window) + 10% for cuts and gables. Gable ends,
        soffit, fascia, and trim are extra — measure triangular gables separately
        (½ base × height). Vinyl typically needs 2 panels per square per course layout.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Materials per square" value={squareCost} onChange={setSquareCost} prefix="$" />
          <Field label="Labor per square" value={laborSquare} onChange={setLaborSquare} prefix="$" />
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

/* ---------------- Pavers ---------------- */

export function PaverCalc() {
  const [length, setLength] = useNumber(20)
  const [width, setWidth] = useNumber(15)
  const [paver, setPaver] = useState('0.222') // 4×8 in
  const [baseDepth, setBaseDepth] = useState('4')
  const [paverCost, setPaverCost] = useNumber(0.6)
  const [laborSqft, setLaborSqft] = useNumber(6)

  const r = useMemo(() => {
    const area = length * width
    const each = parseFloat(paver)
    const pavers = Math.ceil((area / each) * 1.07) // 7% cuts/breakage
    const baseCuyd = (area * parseFloat(baseDepth)) / 12 / 27
    const sandCuyd = (area * 1) / 12 / 27 // 1" bedding sand
    const baseTons = baseCuyd * 1.4 // crushed gravel ~1.4 tons per cubic yard
    const materials = pavers * paverCost
    const labor = laborSqft * area
    return { area, pavers, baseCuyd, sandCuyd, baseTons, materials, labor, total: materials + labor }
  }, [length, width, paver, baseDepth, paverCost, laborSqft])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Patio length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Patio width" value={width} onChange={setWidth} suffix="ft" />
        <Select label="Paver size" value={paver} onChange={setPaver} options={[
          ['0.222', '4" × 8" (holland/brick)'], ['0.5', '6" × 12"'], ['1', '12" × 12"'], ['2.25', '18" × 18"'],
        ]} />
        <Select label="Gravel base depth" value={baseDepth} onChange={setBaseDepth} options={[
          ['4', '4 in (pedestrian patio)'], ['6', '6 in (driveway)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Pavers (incl. 7% waste)" value={String(r.pavers)} />
        <Result label="Gravel base" value={`${num(r.baseTons, 1)} tons`} />
        <Result label="Bedding sand (1 in)" value={`${num(r.sandCuyd, 1)} cu yd`} />
        <Result label="Area" value={`${num(r.area, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Pavers = area ÷ paver coverage + 7% for cuts and breakage (herringbone needs ~10%).
        Base is compacted crushed gravel at ~1.4 tons per cubic yard, plus a 1-inch bedding-sand
        layer. Compact the base in 2-inch lifts and slope 1/4" per foot away from the house.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Cost per paver" value={paverCost} onChange={setPaverCost} prefix="$" />
          <Field label="Install labor per sq ft" value={laborSqft} onChange={setLaborSqft} prefix="$" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Result label="Paver materials" value={usd(r.materials, 2)} />
          <Result label="Labor" value={usd(r.labor, 2)} />
          <Result big label="Project total" value={usd(r.total, 2)} />
        </div>
        <CostNote />
      </details>
    </CardContent></Card>
  )
}

/* ---------------- Concrete block (CMU) ---------------- */

export function BlockCalc() {
  const [length, setLength] = useNumber(40)
  const [height, setHeight] = useNumber(4)
  const [blockCost, setBlockCost] = useNumber(2.2)
  const [mortarCost, setMortarCost] = useNumber(8)
  const [laborBlock, setLaborBlock] = useNumber(4)

  const r = useMemo(() => {
    const area = length * height
    // standard 8×8×16 block face = 8"×16" = 0.889 sq ft
    const blocks = Math.ceil((area / 0.889) * 1.05) // 5% breakage
    const mortarBags = Math.ceil(blocks / 33) // ~3 bags per 100 block
    const materials = blocks * blockCost + mortarBags * mortarCost
    const labor = laborBlock * blocks
    const courses = Math.ceil(height * 12 / 8)
    return { area, blocks, mortarBags, materials, labor, total: materials + labor, courses }
  }, [length, height, blockCost, mortarCost, laborBlock])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Wall length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Wall height" value={height} onChange={setHeight} suffix="ft" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="8×8×16 blocks" value={String(r.blocks)} />
        <Result label="Mortar (bags)" value={String(r.mortarBags)} />
        <Result label="Courses" value={String(r.courses)} />
        <Result label="Wall area" value={`${num(r.area, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Block count = wall area ÷ 0.889 sq ft per block face + 5% breakage; mortar at ~3 bags per
        100 blocks. Walls over 4 ft typically need vertical rebar and grout-filled cells (every
        32–48 inches per code) and footings sized to soil — check local code for retaining or
        structural walls.
      </p>
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">Cost estimate (editable typical-range defaults)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Cost per block" value={blockCost} onChange={setBlockCost} prefix="$" />
          <Field label="Cost per mortar bag" value={mortarCost} onChange={setMortarCost} prefix="$" />
          <Field label="Labor per block laid" value={laborBlock} onChange={setLaborBlock} prefix="$" />
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

/* ---------------- Wallpaper ---------------- */

export function WallpaperCalc() {
  const [length, setLength] = useNumber(14)
  const [width, setWidth] = useNumber(12)
  const [height, setHeight] = useNumber(9)
  const [doors, setDoors] = useNumber(1)
  const [windows, setWindows] = useNumber(2)
  const [repeat, setRepeat] = useState('drop')
  const [rollCost, setRollCost] = useNumber(45)

  const r = useMemo(() => {
    const wallArea = 2 * (length + width) * height - doors * 21 - windows * 15
    const area = Math.max(0, wallArea)
    // usable coverage per double roll ≈ 56 sq ft; pattern repeat cuts yield
    const factor = repeat === 'none' ? 1 : repeat === 'straight' ? 1.1 : 1.15
    const usable = 56 / factor
    const doubleRolls = Math.ceil(area / usable)
    return { area, usable, doubleRolls, cost: doubleRolls * rollCost, factor }
  }, [length, width, height, doors, windows, repeat, rollCost])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Room length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Room width" value={width} onChange={setWidth} suffix="ft" />
        <Field label="Wall height" value={height} onChange={setHeight} suffix="ft" />
        <Field label="Doors" value={doors} onChange={setDoors} step="1" />
        <Field label="Windows" value={windows} onChange={setWindows} step="1" />
        <Select label="Pattern repeat" value={repeat} onChange={setRepeat} options={[
          ['none', 'No match (solid/texture)'], ['straight', 'Straight match'], ['drop', 'Drop match'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Double rolls to buy" value={String(r.doubleRolls)} />
        <Result label="Usable coverage per roll" value={`${num(r.usable, 0)} sq ft`} />
        <Result label="Wallpaper cost" value={usd(r.cost, 2)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Cost per double roll" value={rollCost} onChange={setRollCost} prefix="$" />
      </div>
      <p className="text-sm text-muted-foreground">
        Double rolls (the standard retail unit) cover ~56 sq ft before matching; straight match
        costs ~10% yield, drop match ~15%. Walls are measured gross (openings only deducted for
        full-size doors/windows — the strips above them are usable). Buy all rolls from the same
        dye lot.
      </p>
      <CostNote />
    </CardContent></Card>
  )
}

/* ---------------- Rebar grid ---------------- */

const REBAR_WT: Record<string, number> = { '#3': 0.376, '#4': 0.668, '#5': 1.043, '#6': 1.502 } // lb per linear ft (ASTM)

export function RebarCalc() {
  const [length, setLength] = useNumber(24)
  const [width, setWidth] = useNumber(24)
  const [spacing, setSpacing] = useState('18')
  const [bar, setBar] = useState('#4')
  const [priceLb, setPriceLb] = useNumber(0.85)

  const r = useMemo(() => {
    const sp = parseFloat(spacing)
    const barsL = Math.ceil((width * 12) / sp) + 1 // bars running lengthwise, spaced across width
    const barsW = Math.ceil((length * 12) / sp) + 1
    const lf = barsL * length + barsW * width
    const withLap = lf * 1.08 // 8% for laps and trim
    const weight = withLap * REBAR_WT[bar]
    return { barsL, barsW, lf, withLap, weight, cost: weight * priceLb, sticks: Math.ceil(withLap / 20) }
  }, [length, width, spacing, bar, priceLb])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Slab length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Slab width" value={width} onChange={setWidth} suffix="ft" />
        <Select label="Grid spacing" value={spacing} onChange={setSpacing} options={[
          ['12', '12" on center (driveway)'], ['18', '18" on center (slab standard)'], ['24', '24" on center (light patio)'],
        ]} />
        <Select label="Bar size" value={bar} onChange={setBar} options={[
          ['#3', '#3 (3/8" — patios)'], ['#4', '#4 (1/2" — slabs)'], ['#5', '#5 (5/8" — driveways)'], ['#6', '#6 (3/4" — heavy)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Total weight" value={`${num(r.weight, 0)} lb`} />
        <Result label="20-ft sticks" value={String(r.sticks)} />
        <Result label="Linear feet (incl. 8% laps)" value={num(r.withLap, 0)} />
        <Result label="Grid" value={`${r.barsL} × ${r.barsW} bars`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Each direction: ⌈dimension ÷ spacing⌉ + 1 bar; 8% added for lap splices (30–40 bar
        diameters) and trim. Weight uses ASTM nominal lb/ft (#4 = 0.668). Place the grid at
        mid-depth on chairs — rebar on the ground does nothing. Wire mesh is the lighter
        alternative for 4" patios; rebar earns its place in driveways and structural slabs.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price per lb" value={priceLb} onChange={setPriceLb} prefix="$" />
      </div>
      <Result label="Steel cost" value={usd(r.cost, 2)} />
    </CardContent></Card>
  )
}

/* ---------------- Footing size ---------------- */

const SOIL: Record<string, { psf: number; label: string }> = {
  clay: { psf: 1500, label: 'Soft clay (~1,500 psf)' },
  sand: { psf: 2000, label: 'Sand / sandy gravel (~2,000 psf)' },
  gravel: { psf: 3000, label: 'Compact gravel (~3,000 psf)' },
  rock: { psf: 10000, label: 'Bedrock (~10,000+ psf)' },
}

export function FootingCalc() {
  const [mode, setMode] = useState('wall')
  const [wallLoad, setWallLoad] = useNumber(3000)
  const [colLoad, setColLoad] = useNumber(20000)
  const [soil, setSoil] = useState('sand')
  const [wallThick, setWallThick] = useNumber(8)

  const r = useMemo(() => {
    const bearing = SOIL[soil].psf
    if (mode === 'wall') {
      const widthIn = Math.max(12, Math.ceil((wallLoad / bearing) * 12))
      const projection = Math.max(0, (widthIn - wallThick) / 2)
      const thickness = Math.max(6, Math.ceil(projection))
      return { bearing, widthIn, projection, thickness }
    }
    const area = colLoad / bearing
    const sideIn = Math.ceil(Math.sqrt(area) * 12)
    const thickness = Math.max(8, Math.ceil(sideIn / 2)) // prescriptive: T ≥ half the side, min 8"
    return { bearing, area, sideIn, thickness }
  }, [mode, wallLoad, colLoad, soil, wallThick])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Footing type" value={mode} onChange={setMode} options={[
          ['wall', 'Continuous wall footing'], ['column', 'Column / pier pad'],
        ]} />
        {mode === 'wall'
          ? <Field label="Load on wall" value={wallLoad} onChange={setWallLoad} suffix="lb/ft" />
          : <Field label="Column load" value={colLoad} onChange={setColLoad} suffix="lb" />}
        <Select label="Soil bearing (estimate)" value={soil} onChange={setSoil} options={
          Object.entries(SOIL).map(([k, v]) => [k, v.label] as [string, string])
        } />
        {mode === 'wall' && <Field label="Wall thickness" value={wallThick} onChange={setWallThick} suffix="in" />}
      </div>
      {mode === 'wall' ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Result big label="Footing width" value={`${r.widthIn}"`} />
          <Result label="Footing thickness" value={`${r.thickness}" min`} />
          <Result label="Projection each side" value={`${num(r.projection ?? 0, 1)}"`} />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <Result big label="Pad size" value={`${r.sideIn}" × ${r.sideIn}"`} />
          <Result label="Required area" value={`${num(r.area ?? 0, 1)} sq ft`} />
          <Result label="Pad thickness" value={`${r.thickness}" min`} />
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Width = load ÷ soil bearing capacity; thickness ≥ the projection beyond the wall (6" min
        for walls, 8" min for column pads) per IRC prescriptive rules. This is sizing math for
        prescriptive-code residential work — actual soil capacity comes from the site, and
        anything multi-story, retaining, or in poor soil needs an engineer. Footings must sit
        below your local frost depth.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Block fill (grout) ---------------- */

export function BlockFillCalc() {
  const [length, setLength] = useNumber(40)
  const [height, setHeight] = useNumber(4)
  const [fill, setFill] = useState('full')
  const [yardCost, setYardCost] = useNumber(165)

  const r = useMemo(() => {
    const blocks = Math.ceil((length * height) / 0.889)
    // 8×8×16 block, both cells grouted ≈ 0.24 cu ft per block (~112 blocks per cu yd)
    const cuft = blocks * (fill === 'full' ? 0.24 : 0.12)
    const yards = (cuft / 27) * 1.1 // 10% waste/spillage
    return { blocks, cuft, yards, cost: yards * yardCost }
  }, [length, height, fill, yardCost])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Wall length" value={length} onChange={setLength} suffix="ft" />
        <Field label="Wall height" value={height} onChange={setHeight} suffix="ft" />
        <Select label="Cells to fill" value={fill} onChange={setFill} options={[
          ['full', 'All cells (full grout)'], ['half', 'Every other cell (rebar cells only)'],
        ]} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Grout needed" value={`${num(r.yards, 2)} cu yd`} />
        <Result label="Blocks in wall" value={String(r.blocks)} />
        <Result label="Volume" value={`${num(r.cuft, 1)} cu ft`} />
        <Result label="Cost at $/yd" value={usd(r.cost, 2)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Grout/ready-mix per yard" value={yardCost} onChange={setYardCost} prefix="$" />
      </div>
      <p className="text-sm text-muted-foreground">
        One 8×8×16 block holds ~0.24 cu ft with both cells grouted (about 112 blocks per cubic
        yard); filling only the rebar cells halves that. Add the 10% shown for spillage and
        pumping loss. Grout in lifts of about 4–5 ft and consolidate — honeycombed cells are
        hidden structural defects. Rebar goes in BEFORE the grout, per your engineer's layout.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Floor joist span (IRC R502.3.1(2), DFL #2, 40 LL / 10 DL) ---------------- */

// 2012 IRC Table R502.3.1(2), residential living areas, 40 psf live / 10 psf dead, L/360.
// Douglas Fir-Larch #2. Values in inches: [2x6, 2x8, 2x10, 2x12] per spacing.
const JOIST_SPANS: Record<string, number[]> = {
  '12': [129, 170, 213, 247],   // 10-9, 14-2, 17-9, 20-7
  '16': [117, 151, 185, 214],   // 9-9, 12-7, 15-5, 17-10
  '19.2': [109, 138, 169, 195], // 9-1, 11-6, 14-1, 16-3
}
const JOIST_SIZES = ['2×6', '2×8', '2×10', '2×12']

function ftIn(inches: number) {
  return `${Math.floor(inches / 12)}'-${inches % 12}"`
}

export function JoistSpanCalc() {
  const [size, setSize] = useState('2')
  const [spacing, setSpacing] = useState('16')
  const [needed, setNeeded] = useNumber(14)

  const r = useMemo(() => {
    const maxIn = JOIST_SPANS[spacing][parseInt(size)]
    const neededIn = needed * 12
    const pass = neededIn <= maxIn
    // deflection limit sanity: L/360 live-load limit is baked into the table values
    return { maxIn, max: ftIn(maxIn), neededIn, pass }
  }, [size, spacing, needed])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Joist size" value={size} onChange={setSize} options={
          JOIST_SIZES.map((s, i) => [String(i), s] as [string, string])
        } />
        <Select label="Spacing" value={spacing} onChange={setSpacing} options={[
          ['12', '12" on center'], ['16', '16" on center (standard)'], ['19.2', '19.2" on center'],
        ]} />
        <Field label="Span you need" value={needed} onChange={setNeeded} suffix="ft" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label={`Max span — DFL #2, ${spacing}" oc`} value={r.max} />
        <Result label="Your span" value={ftIn(r.neededIn)} />
        <Result label="Verdict" value={r.pass ? 'PASS' : 'FAILS — size up or tighten spacing'} />
      </div>
      <p className="text-sm text-muted-foreground">
        Values from IRC Table R502.3.1(2): residential living areas, 40 psf live load, 10 psf
        dead load, L/360 deflection, Douglas Fir-Larch #2 — the most common framing lumber.
        Sleeping-room-only floors (30 psf) span slightly longer; Southern Pine and SPF differ.
        Cantilevers, bearing-wall loads from above, tile floors, and hot tubs change the math —
        and your local code edition controls. When in doubt, size up.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Board & batten spacing ---------------- */

export function BoardBattenCalc() {
  const [wallWidth, setWallWidth] = useNumber(120)
  const [battenWidth, setBattenWidth] = useNumber(2.5)
  const [targetGap, setTargetGap] = useNumber(16)

  const r = useMemo(() => {
    // n battens, battens at both ends: n·b + (n−1)·g = W  →  n = round((W + g) / (b + g))
    const n = Math.max(2, Math.round((wallWidth + targetGap) / (battenWidth + targetGap)))
    const gap = (wallWidth - n * battenWidth) / (n - 1)
    return { n, gap }
  }, [wallWidth, battenWidth, targetGap])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Wall width" value={wallWidth} onChange={setWallWidth} suffix="in" />
        <Field label="Batten width" value={battenWidth} onChange={setBattenWidth} suffix="in" />
        <Field label="Target gap between battens" value={targetGap} onChange={setTargetGap} suffix="in" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Battens (both ends)" value={String(r.n)} />
        <Result label="Even gap" value={`${num(r.gap, 2)}"`} />
        <Result label="Batten spacing on center" value={`${num(r.gap + battenWidth, 2)}"`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Layout math: n battens with one at each end — n × batten width + (n−1) × gap = wall width.
        The calculator rounds n to the nearest whole batten and solves for the exact even gap,
        which is what makes a wall look intentional instead of almost-right. Mark from one corner
        with a story stick cut to the gap, not a tape, to avoid accumulated error.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Gutter sizing ---------------- */

export function GutterCalc() {
  const [area, setArea] = useNumber(1200)
  const [pitch, setPitch] = useState('1.1')
  const [rain, setRain] = useState('normal')
  const [gutterFt, setGutterFt] = useNumber(120)

  const r = useMemo(() => {
    const adj = area * parseFloat(pitch)
    // industry rules of thumb: 5" K-style ≈ 5,520 adj sq ft, 6" ≈ 7,960 (moderate rain);
    // heavy-rain regions cut capacity by ~20%
    const rainFactor = rain === 'heavy' ? 0.8 : 1
    const cap5 = 5520 * rainFactor
    const cap6 = 7960 * rainFactor
    const size = adj <= cap5 ? '5" K-style' : adj <= cap6 ? '6" K-style' : '6" K-style + extra downspouts (or two runs)'
    const downspouts = Math.max(Math.ceil(gutterFt / 30), Math.ceil(adj / 600))
    return { adj, size, downspouts, cap5, cap6 }
  }, [area, pitch, rain, gutterFt])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Roof footprint area draining here" value={area} onChange={setArea} suffix="sq ft" />
        <Select label="Roof pitch factor" value={pitch} onChange={setPitch} options={[
          ['1', 'Flat to 3/12 (×1.0)'], ['1.05', '4–5/12 (×1.05)'], ['1.1', '6–8/12 (×1.1)'],
          ['1.2', '9–11/12 (×1.2)'], ['1.3', '12/12+ (×1.3)'],
        ]} />
        <Select label="Rainfall intensity" value={rain} onChange={setRain} options={[
          ['normal', 'Normal (most of the US)'], ['heavy', 'Heavy (Gulf Coast, PNW storms, monsoon)'],
        ]} />
        <Field label="Gutter run length" value={gutterFt} onChange={setGutterFt} suffix="ft" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Recommended gutter" value={r.size} />
        <Result label="Downspouts (min)" value={String(r.downspouts)} />
        <Result label="Adjusted drainage area" value={`${num(r.adj, 0)} sq ft`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Capacity rules of thumb (K-style, moderate rainfall): 5" handles ~5,500 adjusted sq ft,
        6" ~7,960. Steeper pitches drain faster — the pitch factor converts footprint to effective
        area. Downspouts: at least one per 30 ft of run AND one per ~600 adjusted sq ft; 2×3"
        spouts pair with 5" gutters, 3×4" with 6". Slope gutters 1/16–1/8" per foot toward
        downspouts.
      </p>
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
  'fence-calculator': FenceCalc,
  'deck-calculator': DeckCalc,
  'insulation-calculator': InsulationCalc,
  'asphalt-calculator': AsphaltCalc,
  'board-foot-calculator': BoardFootCalc,
  'stair-calculator': StairCalc,
  'rafter-length-calculator': RafterCalc,
  'siding-calculator': SidingCalc,
  'paver-calculator': PaverCalc,
  'block-calculator': BlockCalc,
  'wallpaper-calculator': WallpaperCalc,
  'rebar-calculator': RebarCalc,
  'footing-size-calculator': FootingCalc,
  'block-fill-calculator': BlockFillCalc,
  'joist-span-calculator': JoistSpanCalc,
  'board-batten-calculator': BoardBattenCalc,
  'gutter-size-calculator': GutterCalc,
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
