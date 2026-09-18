import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num } from '@/lib/calc'
import { FEDERAL, SS_RATE, SS_WAGE_CAP, MEDICARE_RATE, SUPPLEMENTAL_RATE, bracketTax } from '@/data/paycheck'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- W-4 Withholding Optimizer ---------------- */

export function W4WithholdingCalc(_props: CalcProps) {
  const [salary, setSalary] = useNumber(78000)
  const [checksLeft, setChecksLeft] = useNumber(18)
  const [ytdWithheld, setYtdWithheld] = useNumber(5200)
  const [perCheck, setPerCheck] = useNumber(430)
  const [filing, setFiling] = useState<'single' | 'mfj'>('single')
  const [targetRefund, setTargetRefund] = useNumber(0)

  const r = useMemo(() => {
    const fed = FEDERAL[filing]
    const liability = bracketTax(fed.brackets, Math.max(0, salary - fed.ded))
    const projected = ytdWithheld + perCheck * Math.max(0, Math.round(checksLeft))
    const diff = liability - projected // positive = under-withheld (will owe)
    const required = Math.max(0, (liability + targetRefund - ytdWithheld)) / Math.max(1, Math.round(checksLeft))
    const adjust = required - perCheck // positive = withhold more per check
    const effRate = salary > 0 ? liability / salary : 0
    return { liability, projected, diff, required, adjust, effRate }
  }, [salary, checksLeft, ytdWithheld, perCheck, filing, targetRefund])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Annual gross salary" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Federal withheld YTD (from paystub)" value={ytdWithheld} onChange={setYtdWithheld} prefix="$" />
          <Field label="Federal withheld per check now" value={perCheck} onChange={setPerCheck} prefix="$" />
          <Field label="Paychecks remaining this year" value={checksLeft} onChange={setChecksLeft} />
          <Field label="Target refund" value={targetRefund} onChange={setTargetRefund} prefix="$" />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Filing status</p>
            <select className={inputCls} value={filing} onChange={(e) => setFiling(e.target.value as 'single' | 'mfj')}>
              <option value="single">Single</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Withhold per remaining check" value={usd(r.required, 2)} />
          <Result label="Projected year-end position" value={r.diff > 0 ? `Owe ${usd(r.diff)}` : `Refund ${usd(-r.diff)}`} />
          <Result label="2026 federal liability" value={usd(r.liability)} />
          <Result label="Effective federal rate" value={`${num(r.effRate * 100, 1)}%`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">Projected total withholding this year</td><td className="p-2 text-right">{usd(r.projected)}</td></tr>
              <tr className="border-t"><td className="p-2">Adjustment per paycheck</td><td className="p-2 text-right">{r.adjust > 0 ? `Withhold ${usd(r.adjust, 2)} MORE per check` : r.adjust < 0 ? `You can withhold ${usd(-r.adjust, 2)} LESS per check` : 'Exactly on target'}</td></tr>
              <tr className="border-t"><td className="p-2">How to change it</td><td className="p-2 text-right">New W-4 to payroll — extra withholding goes on Line 4(c)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground">
          The goal is not the biggest refund — a refund is an interest-free loan to the Treasury.
          The goal is landing within a few hundred dollars of zero (or your target). Computed with
          2026 federal brackets and the {filing === 'single' ? usd(FEDERAL.single.ded) : usd(FEDERAL.mfj.ded)} standard
          deduction. Pre-tax 401(k)/HSA contributions lower the liability — subtract them from
          salary here for the same effect. State withholding follows its own form.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- Bonus Tax (supplemental wages) ---------------- */

export function BonusTaxCalc(_props: CalcProps) {
  const [salary, setSalary] = useNumber(60000)
  const [bonus, setBonus] = useNumber(10000)
  const [filing, setFiling] = useState<'single' | 'mfj'>('single')
  const [stateRate, setStateRate] = useNumber(5)

  const r = useMemo(() => {
    const fed = FEDERAL[filing]
    const fedTax = (g: number) => bracketTax(fed.brackets, Math.max(0, g - fed.ded))
    // Flat method: employer withholds 22% federal on the bonus (supplemental wages under $1M)
    const flatWithheld = bonus * (SUPPLEMENTAL_RATE / 100)
    // Actual liability: bonus stacks on top of salary at marginal rates
    const actualFed = fedTax(salary + bonus) - fedTax(salary)
    const fica = Math.min(bonus, Math.max(0, SS_WAGE_CAP - salary)) * (SS_RATE / 100) + bonus * (MEDICARE_RATE / 100)
    const state = bonus * (stateRate / 100)
    const actualTotal = actualFed + fica + state
    const withheldTotal = flatWithheld + fica + state
    const refundGap = withheldTotal - actualTotal // positive = refund coming
    const effOnBonus = bonus > 0 ? actualTotal / bonus : 0
    const netBonus = bonus - actualTotal
    return { flatWithheld, actualFed, fica, state, actualTotal, refundGap, effOnBonus, netBonus }
  }, [salary, bonus, filing, stateRate])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Base salary" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Bonus amount" value={bonus} onChange={setBonus} prefix="$" />
          <Field label="State income tax (flat est.)" value={stateRate} onChange={setStateRate} suffix="%" />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Filing status</p>
            <select className={inputCls} value={filing} onChange={(e) => setFiling(e.target.value as 'single' | 'mfj')}>
              <option value="single">Single</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Bonus you actually keep" value={usd(r.netBonus)} />
          <Result label="Withheld from the bonus check" value={usd(r.flatWithheld + r.fica + r.state)} />
          <Result label="True tax on the bonus" value={usd(r.actualTotal)} />
          <Result label="Effective rate on bonus" value={`${num(r.effOnBonus * 100, 1)}%`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">Federal withholding (flat {SUPPLEMENTAL_RATE}% supplemental rate)</td><td className="p-2 text-right">{usd(r.flatWithheld)}</td></tr>
              <tr className="border-t"><td className="p-2">Actual federal liability (bonus at your marginal brackets)</td><td className="p-2 text-right">{usd(r.actualFed)}</td></tr>
              <tr className="border-t"><td className="p-2">FICA + state on the bonus</td><td className="p-2 text-right">{usd(r.fica + r.state)}</td></tr>
              <tr className="border-t"><td className="p-2">At filing time</td><td className="p-2 text-right">{r.refundGap >= 0 ? `~${usd(r.refundGap)} of the withholding comes back as refund` : `You'll owe ~${usd(-r.refundGap)} more than was withheld`}</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground">
          Bonuses feel overtaxed because payroll withholds a flat {SUPPLEMENTAL_RATE}% federal on
          supplemental wages — but that's just withholding, not the tax. Your real liability is the
          bonus stacked at your marginal 2026 brackets. High earners in the 24%+ brackets are
          under-withheld on bonuses; everyone else gets the gap back at filing.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- Marginal Bracket Visualizer ---------------- */

export function MarginalBracketCalc(_props: CalcProps) {
  const [salary, setSalary] = useNumber(95000)
  const [filing, setFiling] = useState<'single' | 'mfj'>('single')

  const r = useMemo(() => {
    const fed = FEDERAL[filing]
    const taxable = Math.max(0, salary - fed.ded)
    const total = bracketTax(fed.brackets, taxable)
    const eff = salary > 0 ? total / salary : 0
    let marg = 10
    for (const [start, rate] of fed.brackets) if (taxable > start) marg = rate
    // fill per bracket + room to next
    const rows: { rate: number; from: number; to: number | null; filled: number; tax: number }[] = []
    let room = Infinity
    for (let i = 0; i < fed.brackets.length; i++) {
      const [start, rate] = fed.brackets[i]
      const end = i + 1 < fed.brackets.length ? fed.brackets[i + 1][0] : Infinity
      if (taxable > start) {
        const filled = Math.min(taxable, end) - start
        rows.push({ rate, from: start, to: end === Infinity ? null : end, filled, tax: filled * (rate / 100) })
        room = end - taxable
      }
    }
    const effOnTaxable = taxable > 0 ? total / taxable : 0
    return { taxable, total, eff, marg, rows, room, effOnTaxable }
  }, [salary, filing])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Annual gross income" value={salary} onChange={setSalary} prefix="$" />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Filing status</p>
            <select className={inputCls} value={filing} onChange={(e) => setFiling(e.target.value as 'single' | 'mfj')}>
              <option value="single">Single</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Marginal rate (next dollar)" value={`${r.marg}%`} />
          <Result label="Effective rate on gross" value={`${num(r.eff * 100, 1)}%`} />
          <Result label="Federal tax (2026)" value={usd(r.total)} />
          <Result label="Room left in this bracket" value={r.room === Infinity ? 'Top bracket — no ceiling' : usd(r.room)} />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Your income, bracket by bracket</p>
          {r.rows.map((b) => {
            const width = b.to ? Math.min(100, (b.filled / (b.to - b.from)) * 100) : 100
            return (
              <div key={b.rate} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{b.rate}% bracket · {usd(b.from)}{b.to ? `–${usd(b.to)}` : '+'} (taxable)</span>
                  <span>{usd(b.filled)} taxed here → {usd(b.tax)}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${width}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-sm text-muted-foreground">
          Taxable income is gross minus the {filing === 'single' ? usd(FEDERAL.single.ded) : usd(FEDERAL.mfj.ded)} standard
          deduction (2026). Only the dollars inside each bracket pay that bracket's rate — crossing
          into a new bracket never retroactively raises the tax on earlier dollars. Your effective
          rate on taxable income is {num(r.effOnTaxable * 100, 1)}%; on gross pay it is {num(r.eff * 100, 1)}%.
          Both are always below your marginal rate.
        </p>
      </CardContent>
    </Card>
  )
}

export const TAXSEASON_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'w4-withholding-calculator': W4WithholdingCalc,
  'bonus-tax-calculator': BonusTaxCalc,
  'marginal-tax-bracket-calculator': MarginalBracketCalc,
}
