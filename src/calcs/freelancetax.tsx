import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* 2026 federal constants (IRS Rev. Proc. 2025-32 / user-verified against real paystub math) */
const BRACKETS_2026: Record<string, { std: number; rows: [number, number][] }> = {
  single: {
    std: 16100,
    rows: [[12400, 0.1], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [Infinity, 0.37]],
  },
  mfj: {
    std: 32200,
    rows: [[24800, 0.1], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [Infinity, 0.37]],
  },
}
const SS_WAGE_BASE_2026 = 184500 // SSA 2026 taxable maximum

function fedTax(taxable: number, status: string): number {
  const rows = BRACKETS_2026[status].rows
  let tax = 0
  let prev = 0
  for (const [cap, rate] of rows) {
    if (taxable <= prev) break
    tax += (Math.min(taxable, cap) - prev) * rate
    prev = cap
  }
  return tax
}

function seTax(profit: number): { earnings: number; ss: number; medicare: number; total: number; halfDed: number } {
  const earnings = Math.max(0, profit) * 0.9235
  const ss = Math.min(earnings, SS_WAGE_BASE_2026) * 0.124
  const medicare = earnings * 0.029
  const total = ss + medicare
  return { earnings, ss, medicare, total, halfDed: total / 2 }
}

/* ---------------- Self-Employment Tax ---------------- */

export function SelfEmploymentTaxCalc() {
  const [profit, setProfit] = useNumber(90000)

  const r = useMemo(() => {
    const se = seTax(profit)
    const effRate = profit > 0 ? (se.total / profit) * 100 : 0
    return { ...se, effRate }
  }, [profit])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <Field label="Net self-employment profit (Schedule C)" value={profit} onChange={setProfit} prefix="$" />
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="SE-taxable earnings (92.35%)" value={usd(r.earnings, 0)} />
        <Result label="Social Security part (12.4%)" value={usd(r.ss, 2)} />
        <Result label="Medicare part (2.9%)" value={usd(r.medicare, 2)} />
        <Result big label="Total SE tax" value={usd(r.total, 2)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Employer-half deduction (cuts income tax)" value={usd(r.halfDed, 2)} />
        <Result label="Effective rate on profit" value={`${num(r.effRate, 2)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        SE tax = 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of net profit — you pay both the employee
        and employer halves. Social Security stops at the 2026 wage base of $184,500; Medicare never stops, and
        earnings over $200,000 single / $250,000 joint add another 0.9% (not included here). Half the SE tax is
        deductible against income tax — that deduction is already built into the quarterly calculator below.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Quarterly Estimated Tax ---------------- */

export function QuarterlyTaxCalc() {
  const [profit, setProfit] = useNumber(90000)
  const [otherIncome, setOtherIncome] = useNumber(0)
  const [status, setStatus] = useState('single')
  const [priorTax, setPriorTax] = useNumber(15000)

  const r = useMemo(() => {
    const se = seTax(profit)
    const agi = profit - se.halfDed + otherIncome
    const taxable = Math.max(0, agi - BRACKETS_2026[status].std)
    const incomeTax = fedTax(taxable, status)
    const total = incomeTax + se.total
    const quarterly = total / 4
    const safeHarborQ = priorTax / 4 // 100% of prior-year tax (110% if prior AGI > $150k — noted in copy)
    const effRate = profit + otherIncome > 0 ? (total / (profit + otherIncome)) * 100 : 0
    return { se, agi, taxable, incomeTax, total, quarterly, safeHarborQ, effRate }
  }, [profit, otherIncome, status, priorTax])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Expected SE profit this year" value={profit} onChange={setProfit} prefix="$" />
        <Field label="Other taxable income (W-2, spouse)" value={otherIncome} onChange={setOtherIncome} prefix="$" />
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Filing status</p>
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="single">Single</option>
            <option value="mfj">Married filing jointly</option>
          </select>
        </div>
        <Field label="Last year's total tax (safe harbor)" value={priorTax} onChange={setPriorTax} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="SE tax" value={usd(r.se.total, 2)} />
        <Result label={`Income tax (taxable ${usd(r.taxable, 0)})`} value={usd(r.incomeTax, 2)} />
        <Result label="Total federal tax" value={usd(r.total, 2)} />
        <Result big label="Quarterly payment" value={usd(r.quarterly, 2)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Safe-harbor alternative per quarter" value={usd(r.safeHarborQ, 2)} />
        <Result label="Effective rate on total income" value={`${num(r.effRate, 1)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        2026 federal brackets, single/MFJ, standard deduction built in; SE tax uses the 92.35% base with the
        $184,500 Social Security cap, and half of SE tax is deducted before income tax. Safe harbor: pay 100% of
        last year's total tax (110% if last year's AGI exceeded $150,000) in four equal payments and you avoid
        underpayment penalties even if this year comes in higher. Payments are due Apr 15, Jun 15, Sep 15, and
        Jan 15. Excludes state estimates, the 0.9% Additional Medicare surtax, and credits. Not tax advice —
        confirm with Form 1040-ES or a CPA.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Invoice Late Fee ---------------- */

export function InvoiceLateFeeCalc() {
  const [amount, setAmount] = useNumber(5000)
  const [daysLate, setDaysLate] = useNumber(45)
  const [monthlyRate, setMonthlyRate] = useNumber(1.5)

  const r = useMemo(() => {
    const months = daysLate / 30
    const fee = amount * (monthlyRate / 100) * months
    const total = amount + fee
    const apr = monthlyRate * 12
    return { months, fee, total, apr }
  }, [amount, daysLate, monthlyRate])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Invoice amount" value={amount} onChange={setAmount} prefix="$" />
        <Field label="Days past due" value={daysLate} onChange={setDaysLate} step="1" />
        <Field label="Late fee rate" value={monthlyRate} onChange={setMonthlyRate} suffix="% / month" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Months late" value={num(r.months, 1)} />
        <Result label="Late fee accrued" value={usd(r.fee, 2)} />
        <Result big label="Total now due" value={usd(r.total, 2)} />
        <Result label="Equivalent APR" value={`${num(r.apr, 1)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        Fee = invoice × monthly rate × (days ÷ 30). A 1.5%/month charge equals an 18% APR — legal in most states
        for B2B invoices IF it was in the signed contract or terms; you generally cannot add it retroactively.
        State usury caps vary (often 6–18% APR equivalents), so check yours before printing a rate on the invoice.
        The best late fee is the one you never collect: state it clearly on every quote.
      </p>
    </CardContent></Card>
  )
}

export const FREELANCETAX_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'self-employment-tax-calculator': SelfEmploymentTaxCalc,
  'quarterly-estimated-tax-calculator': QuarterlyTaxCalc,
  'invoice-late-fee-calculator': InvoiceLateFeeCalc,
}
