import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Result } from './index'
import { usd, num } from '@/lib/calc'

type RowKind = 'material' | 'labor'
type Row = { id: number; kind: RowKind; desc: string; qty: string; unit: string; cost: string }
type BidState = { rows: Row[]; markup: string; sqft: string; job: string; client: string }

const STORE_KEY = 'calcstack-bidsheet-v1'

const DEFAULT_ROWS: Row[] = [
  { id: 1, kind: 'material', desc: 'Framing lumber — studs', qty: '22', unit: 'ea', cost: '4.50' },
  { id: 2, kind: 'material', desc: 'Drywall sheets, 4×8', qty: '19', unit: 'sheet', cost: '16.00' },
  { id: 3, kind: 'material', desc: 'Paint — walls, 2 coats', qty: '3', unit: 'gal', cost: '45.00' },
  { id: 4, kind: 'material', desc: 'Flooring — LVP', qty: '200', unit: 'sq ft', cost: '3.25' },
  { id: 5, kind: 'labor', desc: 'Carpentry labor', qty: '16', unit: 'hr', cost: '55.00' },
  { id: 6, kind: 'labor', desc: 'Paint labor', qty: '8', unit: 'hr', cost: '45.00' },
]

const DEFAULT_STATE: BidState = {
  rows: DEFAULT_ROWS,
  markup: '15',
  sqft: '400',
  job: 'Garage finish — 24 ft × 20 ft',
  client: '',
}

function loadState(): BidState {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<BidState>
    if (!Array.isArray(parsed.rows) || parsed.rows.length === 0) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...parsed, rows: parsed.rows }
  } catch {
    return DEFAULT_STATE
  }
}

const f = (s: string) => {
  const v = parseFloat(s)
  return Number.isFinite(v) ? v : 0
}

let nextId = 100

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

export function BidSheetCalc() {
  const [state, setState] = useState<BidState>(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable (private mode) — the sheet still works for this visit */
    }
  }, [state])

  const set = (patch: Partial<BidState>) => setState((s) => ({ ...s, ...patch }))
  const setRow = (id: number, patch: Partial<Row>) =>
    setState((s) => ({ ...s, rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
  const addRow = (kind: RowKind) =>
    setState((s) => ({
      ...s,
      rows: [...s.rows, { id: ++nextId, kind, desc: '', qty: '1', unit: kind === 'labor' ? 'hr' : 'ea', cost: '' }],
    }))
  const removeRow = (id: number) => setState((s) => ({ ...s, rows: s.rows.filter((r) => r.id !== id) }))
  const reset = () => {
    try {
      localStorage.removeItem(STORE_KEY)
    } catch { /* ignore */ }
    setState({ ...DEFAULT_STATE, rows: DEFAULT_ROWS.map((r) => ({ ...r })) })
  }

  const r = useMemo(() => {
    const lines = state.rows.map((row) => ({ ...row, total: f(row.qty) * f(row.cost) }))
    const materials = lines.filter((l) => l.kind === 'material').reduce((a, l) => a + l.total, 0)
    const labor = lines.filter((l) => l.kind === 'labor').reduce((a, l) => a + l.total, 0)
    const base = materials + labor
    const markupPct = f(state.markup)
    const markupAmt = (base * markupPct) / 100
    const total = base + markupAmt
    const margin = total > 0 ? (markupAmt / total) * 100 : 0
    const sqft = f(state.sqft)
    const perSqft = sqft > 0 ? total / sqft : 0
    return { lines, materials, labor, base, markupPct, markupAmt, total, margin, perSqft }
  }, [state])

  return (
    <Card><CardContent className="space-y-5 p-5" id="bid-sheet-print">
      <style>{`@media print {
  body * { visibility: hidden; }
  #bid-sheet-print, #bid-sheet-print * { visibility: visible; }
  #bid-sheet-print { position: absolute; top: 0; left: 0; width: 100%; }
  #bid-sheet-print .no-print { display: none !important; }
}`}</style>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Job name</p>
          <input className={inputCls} value={state.job} onChange={(e) => set({ job: e.target.value })} placeholder="Kitchen remodel — 123 Main St" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Client (optional)</p>
          <input className={inputCls} value={state.client} onChange={(e) => set({ client: e.target.value })} placeholder="Client name" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="hidden grid-cols-[92px_1fr_64px_72px_88px_80px_32px] gap-2 text-xs font-medium text-muted-foreground sm:grid">
          <span>Type</span><span>Line item</span><span>Qty</span><span>Unit</span><span>Unit cost</span><span className="text-right">Total</span><span />
        </div>
        {r.lines.map((l) => (
          <div key={l.id} className="grid grid-cols-2 gap-2 sm:grid-cols-[92px_1fr_64px_72px_88px_80px_32px]">
            <select
              className={inputCls}
              value={l.kind}
              onChange={(e) => setRow(l.id, { kind: e.target.value as RowKind })}
            >
              <option value="material">Material</option>
              <option value="labor">Labor</option>
            </select>
            <input className={inputCls} value={l.desc} placeholder="Description" onChange={(e) => setRow(l.id, { desc: e.target.value })} />
            <input className={inputCls} value={l.qty} inputMode="decimal" onChange={(e) => setRow(l.id, { qty: e.target.value })} />
            <input className={inputCls} value={l.unit} onChange={(e) => setRow(l.id, { unit: e.target.value })} />
            <input className={inputCls} value={l.cost} inputMode="decimal" placeholder="0.00" onChange={(e) => setRow(l.id, { cost: e.target.value })} />
            <p className="self-center text-right text-sm font-medium">{usd(l.total, 2)}</p>
            <button
              type="button"
              aria-label="Remove line"
              className="no-print self-center text-center text-lg leading-none text-muted-foreground hover:text-foreground"
              onClick={() => removeRow(l.id)}
            >
              ×
            </button>
          </div>
        ))}
        <div className="no-print flex gap-2 pt-1">
          <button type="button" className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent" onClick={() => addRow('material')}>
            + Material
          </button>
          <button type="button" className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent" onClick={() => addRow('labor')}>
            + Labor
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Markup on cost (overhead &amp; profit)</p>
          <div className="flex items-center gap-2">
            <input className={inputCls} value={state.markup} inputMode="decimal" onChange={(e) => set({ markup: e.target.value })} />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Job size (for the $/sq ft sanity check)</p>
          <div className="flex items-center gap-2">
            <input className={inputCls} value={state.sqft} inputMode="decimal" onChange={(e) => set({ sqft: e.target.value })} />
            <span className="text-sm text-muted-foreground">sq ft</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Materials" value={usd(r.materials, 2)} />
        <Result label="Labor" value={usd(r.labor, 2)} />
        <Result label="Your cost (base)" value={usd(r.base, 2)} />
        <Result label={`Markup (${num(r.markupPct, 1)}%)`} value={usd(r.markupAmt, 2)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Bid total" value={usd(r.total, 2)} />
        <Result label="True margin" value={`${num(r.margin, 1)}%`} />
        <Result label="Price per sq ft" value={r.perSqft > 0 ? usd(r.perSqft, 2) : '—'} />
      </div>

      <p className="text-sm text-muted-foreground">
        Markup ≠ margin: a {num(r.markupPct, 1)}% markup on cost is a {num(r.margin, 1)}% margin on the bid price
        (margin = markup ÷ (1 + markup)). Quote in markup, but run the business on margin — overhead targets are
        always expressed as a share of the selling price.
      </p>
      <p className="text-xs text-muted-foreground">
        This sheet saves automatically in your browser (nothing is uploaded). Line totals are quantity × unit cost;
        bid total = (materials + labor) × (1 + markup).
      </p>

      <div className="no-print flex gap-2">
        <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => window.print()}>
          Print / save as PDF
        </button>
        <button type="button" className="rounded-md border px-4 py-2 text-sm hover:bg-accent" onClick={reset}>
          Reset to sample bid
        </button>
      </div>
    </CardContent></Card>
  )
}

export const BID_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'bid-sheet-calculator': BidSheetCalc,
}
