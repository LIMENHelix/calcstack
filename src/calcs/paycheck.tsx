import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import type { CalcProps } from './index'
import { PAYCHECK_STATES, computePaycheck, computeCheck, computeYtd } from '@/data/paycheck'
import { usd, num } from '@/lib/calc'

type Mode = 'annual' | 'check' | 'ytd'

const MODES: [Mode, string, string][] = [
  ['annual', 'Annual salary', 'What you owe for the year'],
  ['check', 'This single check', 'Reproduce your paystub'],
  ['ytd', 'Variable income (YTD)', 'Commission & bonus earners'],
]

function Breakdown({ rows, gross }: { rows: [string, number][]; gross: number }) {
  return (
    <div className="space-y-1.5">
      {rows.map(([label, v]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${gross > 0 ? Math.min(100, (v / gross) * 100) : 0}%` }}
            />
          </div>
          <span className="w-24 shrink-0 text-right text-sm font-semibold">{usd(v)}</span>
        </div>
      ))}
    </div>
  )
}

export function PaycheckCalc({ stateSlug }: CalcProps) {
  const [mode, setMode] = useState<Mode>('annual')
  const [filing, setFiling] = useState<'single' | 'mfj'>('single')
  const [stateSel, setStateSel] = useState(stateSlug ?? 'texas')
  const rule = PAYCHECK_STATES.find((s) => s.slug === stateSel) ?? PAYCHECK_STATES[0]

  /* --- Annual mode --- */
  const [salary, setSalary] = useNumber(75000)
  const annual = useMemo(() => computePaycheck(salary, filing, rule), [salary, filing, rule])

  /* --- Single-check mode --- */
  const [checkGross, setCheckGross] = useNumber(3000)
  const [periods, setPeriods] = useState('26')
  const [bonus, setBonus] = useNumber(0)
  const [pretax125, setPretax125] = useNumber(0)
  const [pretax401k, setPretax401k] = useNumber(0)
  const check = useMemo(
    () =>
      computeCheck(
        { checkGross, periodsPerYear: parseFloat(periods) || 26, bonusInCheck: bonus, pretax125, pretax401k },
        filing,
        rule,
      ),
    [checkGross, periods, bonus, pretax125, pretax401k, filing, rule],
  )

  /* --- YTD variable-income mode --- */
  const [ytdGross, setYtdGross] = useNumber(60000)
  const [ytdFed, setYtdFed] = useNumber(7000)
  const [ytdState, setYtdState] = useNumber(2000)
  const [checksLeft, setChecksLeft] = useNumber(10)
  const [avgCheck, setAvgCheck] = useNumber(3000)
  const [bonusLeft, setBonusLeft] = useNumber(0)
  const [pretaxPerCheck, setPretaxPerCheck] = useNumber(0)
  const ytd = useMemo(
    () =>
      computeYtd(
        {
          ytdGross,
          ytdFederal: ytdFed,
          ytdState,
          checksRemaining: checksLeft,
          avgCheckGross: avgCheck,
          bonusRemaining: bonusLeft,
          pretaxPerCheck,
          periodsPerYear: parseFloat(periods) || 26,
        },
        filing,
        rule,
      ),
    [ytdGross, ytdFed, ytdState, checksLeft, avgCheck, bonusLeft, pretaxPerCheck, periods, filing, rule],
  )

  const filingLabel = filing === 'single' ? 'single filer' : 'married filing jointly'

  return (
    <Card><CardContent className="space-y-5 p-5">
      {/* Mode tabs */}
      <div className="grid gap-2 sm:grid-cols-3">
        {MODES.map(([m, label, sub]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              mode === m ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50'
            }`}
          >
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </button>
        ))}
      </div>

      {/* Shared selectors */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Filing status</p>
          <select
            value={filing}
            onChange={(e) => setFiling(e.target.value as 'single' | 'mfj')}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="single">Single</option>
            <option value="mfj">Married filing jointly</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">State</p>
          <select
            value={stateSel}
            onChange={(e) => setStateSel(e.target.value)}
            className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            {PAYCHECK_STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {mode === 'annual' && (
        <>
          <div className="max-w-sm">
            <Field label="Annual gross salary (full year — not one check)" value={salary} onChange={setSalary} prefix="$" />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Take-home per year" value={usd(annual.net)} />
            <Result label="Per month" value={usd(annual.net / 12)} />
            <Result label="Per biweekly check" value={usd(annual.net / 26)} />
            <Result label="Per week" value={usd(annual.net / 52)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Where the money goes (annual)</p>
            <Breakdown
              gross={annual.gross}
              rows={[
                ['Federal income tax', annual.federal],
                ['Social Security (6.2%)', annual.ss],
                ['Medicare (1.45%)', annual.medicare],
                [`${rule.name} state tax`, annual.state],
              ]}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Result label="Total taxes & payroll" value={usd(annual.gross - annual.net)} />
            <Result label="Effective total rate" value={`${num(annual.effectiveRate, 1)}%`} />
          </div>
          <p className="text-xs text-muted-foreground">
            Annual tax liability using 2026 federal brackets and {rule.name} state rules, {filingLabel}.
            This is what you truly owe for the year — it will NOT match any single paystub, because payroll
            withholding annualizes every check (see &quot;This single check&quot; mode). Excludes pre-tax
            deductions, tax credits, and local taxes. {rule.note ?? ''} Verify against your return or state
            revenue department.
          </p>
        </>
      )}

      {mode === 'check' && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Gross pay this check" value={checkGross} onChange={setCheckGross} prefix="$" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Pay frequency</p>
              <select
                value={periods}
                onChange={(e) => setPeriods(e.target.value)}
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="52">Weekly (52/yr)</option>
                <option value="26">Biweekly (26/yr)</option>
                <option value="24">Semimonthly (24/yr)</option>
                <option value="12">Monthly (12/yr)</option>
              </select>
            </div>
            <Field label="Bonus/commission in this check" value={bonus} onChange={setBonus} prefix="$" />
            <Field label="Pre-tax benefits per check (§125: health, dental, HSA/FSA)" value={pretax125} onChange={setPretax125} prefix="$" />
            <Field label="Pre-tax 401(k) per check (not Roth)" value={pretax401k} onChange={setPretax401k} prefix="$" />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Result big label="Net check" value={usd(check.net)} />
            <Result label="Federal withheld" value={usd(check.federal)} />
            <Result label="FICA (SS + Medicare)" value={usd(check.ss + check.medicare)} />
            <Result label={`${rule.name} withheld`} value={usd(check.state)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Withholding breakdown</p>
            <Breakdown
              gross={checkGross}
              rows={[
                ['Federal — regular wages', check.federalRegular],
                ['Federal — bonus @ flat 22%', check.federalSupplemental],
                ['Social Security (6.2%)', check.ss],
                ['Medicare (1.45%)', check.medicare],
                [`${rule.name} state W/H`, check.state],
              ]}
            />
          </div>
          <p className="rounded-md bg-muted/60 p-3 text-sm">
            This check annualizes to <strong>{usd(check.annualizedPace)}</strong> — payroll taxes it as if you
            earn that every check, which is why big commission checks get hit at 32–35% on the margin. It is a
            deposit, not your tax rate; over-withholding comes back at filing.
          </p>
          <p className="text-xs text-muted-foreground">
            Employer-style withholding, {filingLabel}: IRS percentage method on regular wages plus the flat 22%
            supplemental rate on the bonus portion. Per-check FICA ignores the Social Security wage-cap crossing
            mid-year. State withholding is the simplified annualized model. Compare line-by-line against your
            stub — small differences come from your employer&apos;s exact method (aggregate vs. flat-rate) and W-4 settings.
          </p>
        </>
      )}

      {mode === 'ytd' && (
        <>
          <p className="text-sm text-muted-foreground">
            Built for commission, bonus, and overtime earners. Copy the YTD figures straight off your latest
            paystub, estimate the rest of the year honestly, and get the only number that matters: your real
            projected liability versus your withholding pace.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="YTD gross pay (stub)" value={ytdGross} onChange={setYtdGross} prefix="$" />
            <Field label="YTD federal W/H (stub — not FICA)" value={ytdFed} onChange={setYtdFed} prefix="$" />
            <Field label={`YTD ${rule.name} W/H (stub)`} value={ytdState} onChange={setYtdState} prefix="$" />
            <Field label="Paychecks remaining this year" value={checksLeft} onChange={setChecksLeft} />
            <Field label="Expected gross per remaining check" value={avgCheck} onChange={setAvgCheck} prefix="$" />
            <Field label="Commission/bonus still expected" value={bonusLeft} onChange={setBonusLeft} prefix="$" />
            <Field label="Pre-tax deductions per check (§125 + 401(k))" value={pretaxPerCheck} onChange={setPretaxPerCheck} prefix="$" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Result label="Projected annual gross" value={usd(ytd.projectedGross)} />
            <Result label="Projected federal liability" value={usd(ytd.projectedFedLiability)} />
            <Result label="Projected federal withheld" value={usd(ytd.projectedFedWithheld)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Result
              big
              label={ytd.fedBalance > 0 ? 'Federal: you owe (projected)' : 'Federal: refund (projected)'}
              value={usd(Math.abs(ytd.fedBalance))}
            />
            <Result
              label={ytd.stateBalance > 0 ? `${rule.name}: you owe` : `${rule.name}: refund`}
              value={usd(Math.abs(ytd.stateBalance))}
            />
            <Result
              label={ytd.perCheckAdjustment > 0 ? 'Add to W-4 withholding per check' : 'Over-withheld per check'}
              value={usd(Math.abs(ytd.perCheckAdjustment))}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Projection method: remaining regular checks withheld at the IRS percentage-method pace; remaining
            commission/bonus withheld at the flat 22% supplemental rate. Liability uses 2026 brackets after the
            standard deduction. Re-run after every large commission check — the picture re-tilts each time.
            Estimates exclude tax credits and local taxes; confirm W-4 changes with payroll.
          </p>
        </>
      )}
    </CardContent></Card>
  )
}
