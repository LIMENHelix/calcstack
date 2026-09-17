import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import type { CalcProps } from './index'
import { PAYCHECK_STATES, computePaycheck } from '@/data/paycheck'
import { usd, num } from '@/lib/calc'

export function PaycheckCalc({ stateSlug }: CalcProps) {
  const [salary, setSalary] = useNumber(75000)
  const [filing, setFiling] = useState<'single' | 'mfj'>('single')
  const [stateSel, setStateSel] = useState(stateSlug ?? 'texas')

  const rule = PAYCHECK_STATES.find((s) => s.slug === stateSel) ?? PAYCHECK_STATES[0]
  const r = useMemo(() => computePaycheck(salary, filing, rule), [salary, filing, rule])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual gross salary" value={salary} onChange={setSalary} prefix="$" />
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

      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Take-home per year" value={usd(r.net)} />
        <Result label="Per month" value={usd(r.net / 12)} />
        <Result label="Per biweekly check" value={usd(r.net / 26)} />
        <Result label="Per week" value={usd(r.net / 52)} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Where the money goes</p>
        <div className="space-y-1.5">
          {([
            ['Federal income tax', r.federal],
            ['Social Security (6.2%)', r.ss],
            ['Medicare (1.45%)', r.medicare],
            [`${rule.name} state tax`, r.state],
          ] as [string, number][]).map(([label, v]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${r.gross > 0 ? Math.min(100, (v / r.gross) * 100) : 0}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-sm font-semibold">{usd(v)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Total taxes & payroll" value={usd(r.gross - r.net)} />
        <Result label="Effective total rate" value={`${num(r.effectiveRate, 1)}%`} />
      </div>

      <p className="text-xs text-muted-foreground">
        Estimate using 2026 federal brackets and {rule.name} state rules, {filing === 'single' ? 'single filer' : 'married filing jointly'}.
        Excludes pre-tax deductions (401(k), health premiums), tax credits, and local taxes.{' '}
        {rule.note ?? ''} Verify against your paystub or state revenue department.
      </p>
    </CardContent></Card>
  )
}
