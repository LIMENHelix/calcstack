import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num, monthlyPayment } from '@/lib/calc'

/* ---------------- VA Funding Fee (schedule effective April 7, 2023 — current for 2026) ---------------- */

function vaFeeRate(downPct: number, firstUse: boolean): number {
  if (downPct >= 10) return 0.0125
  if (downPct >= 5) return 0.015
  return firstUse ? 0.0215 : 0.033
}

export function VaFundingFeeCalc(_props: CalcProps) {
  const [price, setPrice] = useNumber(400000)
  const [downPct, setDownPct] = useNumber(0)
  const [firstUse, setFirstUse] = useState(true)
  const [exempt, setExempt] = useState(false)
  const [rate, setRate] = useNumber(6.5)

  const r = useMemo(() => {
    const down = price * (downPct / 100)
    const loan = Math.max(0, price - down)
    const feeRate = exempt ? 0 : vaFeeRate(downPct, firstUse)
    const fee = loan * feeRate
    const financedLoan = loan + fee
    const pmtNoFee = monthlyPayment(loan, rate, 30)
    const pmtFinanced = monthlyPayment(financedLoan, rate, 30)
    const totalCostFinanced = (pmtFinanced - pmtNoFee) * 360
    return { down, loan, feeRate, fee, financedLoan, pmtNoFee, pmtFinanced, totalCostFinanced }
  }, [price, downPct, firstUse, exempt, rate])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Purchase price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <div className="flex gap-2">
            <button
              onClick={() => setFirstUse(true)}
              className={`rounded-md border px-3 py-1.5 text-sm ${firstUse ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              First VA loan
            </button>
            <button
              onClick={() => setFirstUse(false)}
              className={`rounded-md border px-3 py-1.5 text-sm ${!firstUse ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              Subsequent use
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={exempt} onChange={(e) => setExempt(e.target.checked)} />
            Exempt (service-connected disability, DIC, or active-duty Purple Heart)
          </label>
          <Field label="Loan rate (APR)" value={rate} onChange={setRate} suffix="%" />
          <p className="text-xs text-muted-foreground">
            VA schedule effective April 7, 2023 (current): purchase loans — first use 2.15% under 5%
            down, 1.5% at 5–9.99%, 1.25% at 10%+; subsequent use 3.3% under 5% down, then the same
            1.5%/1.25%. IRRRL streamline refinances are a flat 0.5%. Fee is on the loan amount.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Funding fee" value={exempt ? '$0 (exempt)' : usd(r.fee)} />
          {!exempt && <Result label="Fee rate" value={`${num(r.feeRate * 100, 2)}% of loan`} />}
          <Result label="Base loan amount" value={usd(r.loan)} />
          {!exempt && <Result label="Loan with fee financed" value={usd(r.financedLoan)} />}
          <Result label="P&I without fee" value={usd(r.pmtNoFee, 2)} />
          {!exempt && <Result label="P&I with fee financed" value={usd(r.pmtFinanced, 2)} />}
          {!exempt && r.fee > 0 && (
            <p className="text-sm text-muted-foreground">
              Financing the fee adds {usd(r.pmtFinanced - r.pmtNoFee, 2)}/mo and about{' '}
              {usd(r.totalCostFinanced)} in payments over 30 years.{' '}
              {downPct < 5 &&
                'Putting 5% down drops the fee to 1.5%' +
                  (firstUse ? '' : ' (from 3.3% — the biggest jump in the whole table)') +
                  '.'}{' '}
              No monthly mortgage insurance on VA loans — this one-time fee is the trade.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Military Retirement (High-36 legacy vs BRS) ---------------- */

export function MilitaryRetirementCalc(_props: CalcProps) {
  const [system, setSystem] = useState<'legacy' | 'brs'>('legacy')
  const [years, setYears] = useNumber(20)
  const [high3, setHigh3] = useNumber(6000) // monthly base pay

  const r = useMemo(() => {
    const multiplier = system === 'legacy' ? 0.025 : 0.02
    const annualBase = high3 * 12
    const pension = Math.min(1, multiplier * years) * annualBase
    const monthly = pension / 12
    const perYear = multiplier * annualBase
    const twentyYear = (system === 'legacy' ? 0.5 : 0.4) * annualBase
    return { multiplier, annualBase, pension, monthly, perYear, twentyYear }
  }, [system, years, high3])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSystem('legacy')}
              className={`rounded-md border px-3 py-1.5 text-sm ${system === 'legacy' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              High-36 legacy (2.5%/yr)
            </button>
            <button
              onClick={() => setSystem('brs')}
              className={`rounded-md border px-3 py-1.5 text-sm ${system === 'brs' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              BRS (2.0%/yr + TSP)
            </button>
          </div>
          <Field label="Years of service" value={years} onChange={setYears} suffix="yrs" />
          <Field label="High-3 average monthly base pay" value={high3} onChange={setHigh3} prefix="$" suffix="/mo" />
          <p className="text-xs text-muted-foreground">
            Legacy High-36: 2.5% × years × high-3 base pay average. Blended Retirement System (joined
            2018+ or opted in): 2.0% × years, plus up to 5% TSP matching and continuation pay.
            Pension is cliff-vested at 20 years — 19 years and 11 months pays zero.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Annual pension" value={usd(r.pension)} />
          <Result label="Monthly pension" value={usd(r.monthly)} />
          <Result label="Each additional year adds" value={`${usd(r.perYear)}/yr`} />
          <Result label="Reference: 20-year pension" value={usd(r.twentyYear)} />
          <p className="text-sm text-muted-foreground">
            {system === 'legacy'
              ? `At 20 years you lock 50% of base pay for life, inflation-adjusted (COLA). Staying to 30 reaches 75%.`
              : `BRS trades the smaller pension (40% at 20 years) for portable TSP matching — the right system for the ~80% who separate before 20.`}{' '}
            Base pay only: BAH and BAS never count toward the pension, which is why retiring as an
            E-7 living like an E-9 in San Diego is a planning error.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Student Loan IDR (IBR) ---------------- */

// 2026 HHS poverty guidelines, 48 contiguous states + DC (published January 2026)
const FPG_2026_BASE = 15960
const FPG_2026_PER_PERSON = 5680

export function StudentLoanIdrCalc(_props: CalcProps) {
  const [agi, setAgi] = useNumber(60000)
  const [familySize, setFamilySize] = useNumber(1)
  const [balance, setBalance] = useNumber(40000)
  const [rate, setRate] = useNumber(6)
  const [plan, setPlan] = useState<'new' | 'old'>('new')

  const r = useMemo(() => {
    const fpg = FPG_2026_BASE + FPG_2026_PER_PERSON * Math.max(0, Math.round(familySize) - 1)
    const discretionary = Math.max(0, agi - 1.5 * fpg)
    const pct = plan === 'new' ? 0.1 : 0.15
    const forgivenessYears = plan === 'new' ? 20 : 25
    const idrMonthly = (discretionary * pct) / 12
    const standardMonthly = balance > 0 ? monthlyPayment(balance, rate, 10) : 0
    const capped = Math.min(idrMonthly, standardMonthly || idrMonthly)
    const wasCapped = standardMonthly > 0 && idrMonthly > standardMonthly
    const monthlyInterest = (balance * (rate / 100)) / 12
    const negativeAmort = capped < monthlyInterest
    return { fpg, discretionary, idrMonthly, standardMonthly, capped, wasCapped, forgivenessYears, monthlyInterest, negativeAmort }
  }, [agi, familySize, balance, rate, plan])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Adjusted gross income" value={agi} onChange={setAgi} prefix="$" />
          <Field label="Family size" value={familySize} onChange={setFamilySize} />
          <Field label="Loan balance" value={balance} onChange={setBalance} prefix="$" />
          <Field label="Interest rate" value={rate} onChange={setRate} suffix="%" />
          <div className="flex gap-2">
            <button
              onClick={() => setPlan('new')}
              className={`rounded-md border px-3 py-1.5 text-sm ${plan === 'new' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              New IBR (10%, 20 yrs)
            </button>
            <button
              onClick={() => setPlan('old')}
              className={`rounded-md border px-3 py-1.5 text-sm ${plan === 'old' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              Old IBR (15%, 25 yrs)
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Discretionary income = AGI − 150% of the HHS poverty guideline (2026: $15,960 + $5,680
            per additional person, 48 states). New IBR covers borrowers after July 1, 2014. Payments
            are capped at the 10-year standard amount. The SAVE plan remains in litigation — verify
            current plan availability at studentaid.gov.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Monthly IDR payment" value={usd(r.capped, 2)} />
          <Result label="Discretionary income" value={usd(r.discretionary)} />
          <Result label="150% poverty guideline (your family size)" value={usd(r.fpg * 1.5)} />
          <Result label="10-year standard payment (the cap)" value={usd(r.standardMonthly, 2)} />
          <Result label="Forgiveness horizon" value={`${r.forgivenessYears} years`} />
          <p className="text-sm text-muted-foreground">
            {r.wasCapped
              ? 'Your uncapped IDR amount exceeds the 10-year standard payment, so the cap applies — at high incomes, IDR costs the same as standard but takes twice as long. '
              : r.negativeAmort
                ? `Your payment (${usd(r.capped, 2)}) is below the monthly interest (${usd(r.monthlyInterest, 2)}) — the balance grows under IBR. Forgiveness at year ${r.forgivenessYears} can still win, but forgiven amounts may be taxable. `
                : `Your payment covers interest and some principal — ${usd(r.capped, 2)}/mo versus ${usd(r.standardMonthly, 2)}/mo standard. `}
            Recertify income annually; missing the deadline jumps you to standard and capitalizes
            interest.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const MILSTU_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'va-funding-fee-calculator': VaFundingFeeCalc,
  'military-retirement-calculator': MilitaryRetirementCalc,
  'student-loan-idr-calculator': StudentLoanIdrCalc,
}
