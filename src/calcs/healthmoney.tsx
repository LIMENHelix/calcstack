import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd } from '@/lib/calc'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- HSA growth: the triple tax advantage ---------------- */

export function HsaGrowthCalc() {
  const [coverage, setCoverage] = useState<'self' | 'family'>('self')
  const [contribution, setContribution] = useNumber(4400)
  const [years, setYears] = useNumber(20)
  const [ret, setRet] = useNumber(7)
  const [taxRate, setTaxRate] = useNumber(30)

  const limit = coverage === 'self' ? 4400 : 8750 // IRS Rev. Proc. 2025-19 (2026)

  const r = useMemo(() => {
    const c = Math.min(contribution, limit)
    const i = ret / 100
    const fv = i === 0 ? c * years : (c * (Math.pow(1 + i, years) - 1)) / i
    // Taxable comparison: contributions are taxed first, then gains are taxed
    // annually at 15% LTCG (approximation of a taxable brokerage drag).
    const cAfterTax = c * (1 - taxRate / 100)
    const iTax = i * 0.85
    const fvTax = iTax === 0 ? cAfterTax * years : (cAfterTax * (Math.pow(1 + iTax, years) - 1)) / iTax
    const savedPerYear = c * (taxRate / 100)
    return { c, fv, fvTax, savedPerYear, advantage: fv - fvTax }
  }, [contribution, years, ret, taxRate, limit])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">HDHP coverage type</label>
            <select className={inputCls} value={coverage} onChange={(e) => setCoverage(e.target.value as 'self' | 'family')}>
              <option value="self">Self-only (2026 limit $4,400)</option>
              <option value="family">Family (2026 limit $8,750)</option>
            </select>
          </div>
          <Field label="Your annual contribution (incl. employer)" value={contribution} onChange={setContribution} prefix="$" />
          <Field label="Years invested" value={years} onChange={setYears} suffix="yrs" />
          <Field label="Expected annual return" value={ret} onChange={setRet} suffix="%" />
          <Field label="Combined marginal rate (fed + state + 7.65% FICA)" value={taxRate} onChange={setTaxRate} suffix="%" />
          <p className="text-xs text-muted-foreground">
            2026 IRS limits (Rev. Proc. 2025-19): $4,400 self-only / $8,750 family, +$1,000
            catch-up at 55+. HSA is triple-tax-free: deductible going in, untaxed growth,
            untaxed out for medical. After 65, non-medical withdrawals are taxed like a
            traditional IRA with no penalty. Taxable comparison assumes gains taxed at 15%.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label={`HSA value in ${years} years`} value={usd(r.fv)} />
          <Result label="Tax saved every year" value={usd(r.savedPerYear)} />
          <Result label="Same money in a taxable account" value={usd(r.fvTax)} />
          <Result label="Triple-tax advantage" value={usd(r.advantage)} />
          {contribution > limit && (
            <Result label="Note" value={`Capped at the ${coverage === 'self' ? '$4,400' : '$8,750'} 2026 limit`} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Health plan comparison: HDHP vs PPO at your usage ---------------- */

export function HealthPlanCalc() {
  const [premA, setPremA] = useNumber(250)
  const [dedA, setDedA] = useNumber(3000)
  const [oopA, setOopA] = useNumber(6000)
  const [premB, setPremB] = useNumber(450)
  const [dedB, setDedB] = useNumber(500)
  const [oopB, setOopB] = useNumber(4000)
  const [bills, setBills] = useNumber(2000)
  const [coins, setCoins] = useNumber(20)

  const r = useMemo(() => {
    const cost = (prem: number, ded: number, oop: number, b: number) => {
      // You pay bills up to the deductible, then coinsurance on the rest, capped at OOP max
      const oopCost = Math.min(Math.min(b, ded) + (coins / 100) * Math.max(0, b - ded), oop)
      return prem * 12 + oopCost
    }
    const a = cost(premA, dedA, oopA, bills)
    const b = cost(premB, dedB, oopB, bills)
    const diff = a - b
    const winner = Math.abs(diff) < 1 ? 0 : diff < 0 ? 1 : 2
    // Break-even scan: bills level where total costs cross
    let breakeven: number | null = null
    for (let x = 0; x <= 100000; x += 50) {
      if (Math.sign(cost(premA, dedA, oopA, x) - cost(premB, dedB, oopB, x)) !== Math.sign(diff)) {
        breakeven = x
        break
      }
    }
    const hsaEligible = dedA >= 1700
    return { a, b, diff, winner, breakeven, hsaEligible }
  }, [premA, dedA, oopA, premB, dedB, oopB, bills, coins])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold">Plan A — high-deductible (HDHP)</p>
          <Field label="Monthly premium" value={premA} onChange={setPremA} prefix="$" />
          <Field label="Deductible" value={dedA} onChange={setDedA} prefix="$" />
          <Field label="Out-of-pocket max" value={oopA} onChange={setOopA} prefix="$" />
          <p className="text-sm font-semibold">Plan B — traditional (PPO)</p>
          <Field label="Monthly premium" value={premB} onChange={setPremB} prefix="$" />
          <Field label="Deductible" value={dedB} onChange={setDedB} prefix="$" />
          <Field label="Out-of-pocket max" value={oopB} onChange={setOopB} prefix="$" />
          <Field label="Your expected medical bills this year" value={bills} onChange={setBills} prefix="$" />
          <Field label="Coinsurance after deductible" value={coins} onChange={setCoins} suffix="%" />
          <p className="text-xs text-muted-foreground">
            Model: you pay bills up to the deductible, then coinsurance until the out-of-pocket
            max, plus premiums all year. Copays and networks are simplified away — check the
            plan documents. A deductible of $1,700+ self / $3,400+ family (2026) makes Plan A
            HSA-eligible, which is worth up to $1,320+/yr in extra tax savings at a 30% rate.
          </p>
        </div>
        <div className="space-y-3">
          <Result
            big
            label="Cheaper plan at your usage"
            value={r.winner === 0 ? 'Dead even' : r.winner === 1 ? 'Plan A (HDHP)' : 'Plan B (PPO)'}
          />
          <Result label="Plan A total this year" value={usd(r.a)} />
          <Result label="Plan B total this year" value={usd(r.b)} />
          <Result label="Difference" value={usd(Math.abs(r.diff))} />
          <Result
            label="Break-even bills"
            value={r.breakeven === null ? 'One plan wins at every level' : usd(r.breakeven)}
          />
          <Result label="Plan A HSA-eligible" value={r.hsaEligible ? 'Yes (2026 rules)' : 'No'} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- COBRA vs marketplace after job loss ---------------- */

export function CobraCalc() {
  const [fullPremium, setFullPremium] = useNumber(700)
  const [youPaid, setYouPaid] = useNumber(150)
  const [marketPremium, setMarketPremium] = useNumber(400)
  const [subsidy, setSubsidy] = useNumber(0)
  const [months, setMonths] = useNumber(6)

  const r = useMemo(() => {
    const cobraMonthly = fullPremium * 1.02 // 102% of full premium by statute
    const cobraTotal = cobraMonthly * months
    const marketMonthly = Math.max(0, marketPremium - subsidy)
    const marketTotal = marketMonthly * months
    const extraPerMonth = cobraMonthly - youPaid
    return { cobraMonthly, cobraTotal, marketMonthly, marketTotal, extraPerMonth, savings: cobraTotal - marketTotal }
  }, [fullPremium, youPaid, marketPremium, subsidy, months])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Full monthly premium (your share + employer's)" value={fullPremium} onChange={setFullPremium} prefix="$" />
          <Field label="What you paid as an employee" value={youPaid} onChange={setYouPaid} prefix="$/mo" />
          <Field label="Marketplace plan premium" value={marketPremium} onChange={setMarketPremium} prefix="$/mo" />
          <Field label="Monthly subsidy you qualify for" value={subsidy} onChange={setSubsidy} prefix="$/mo" />
          <Field label="Months of coverage needed" value={months} onChange={setMonths} suffix="mo" />
          <p className="text-xs text-muted-foreground">
            COBRA lets you keep your exact plan for up to 18 months but charges 102% of the FULL
            premium — the sticker shock is real because your employer's share was invisible.
            Job loss is a Special Enrollment Period for the marketplace (60 days). Note: the
            enhanced ACA subsidies expired at the end of 2025 — check healthcare.gov for what
            you actually qualify for before defaulting to COBRA.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="COBRA monthly" value={usd(r.cobraMonthly, 2)} />
          <Result label="Shock factor vs what you paid" value={`+${usd(r.extraPerMonth, 2)}/mo`} />
          <Result label={`COBRA total for ${months} months`} value={usd(r.cobraTotal)} />
          <Result label="Marketplace total" value={usd(r.marketTotal)} />
          <Result label="Marketplace saves" value={usd(Math.max(0, r.savings))} />
        </div>
      </CardContent>
    </Card>
  )
}

export const HEALTHMONEY_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'hsa-growth-calculator': HsaGrowthCalc,
  'health-plan-comparison-calculator': HealthPlanCalc,
  'cobra-cost-calculator': CobraCalc,
}
