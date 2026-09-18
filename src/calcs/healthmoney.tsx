import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

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

/* ---------------- Disability insurance needs ---------------- */

export function DisabilityInsuranceCalc() {
  const [income, setIncome] = useNumber(100000)
  const [target, setTarget] = useState('65')
  const [empPct, setEmpPct] = useNumber(60)
  const [empPays, setEmpPays] = useState('yes')
  const [taxRate, setTaxRate] = useNumber(30)

  const r = useMemo(() => {
    const gm = income / 12
    const targetMo = gm * (Number(target) / 100)
    const empGross = gm * (empPct / 100)
    // Employer-paid (pre-tax) premiums → taxable benefits; after-tax premiums → tax-free (IRC §104(a)(3))
    const empNet = empPays === 'yes' ? empGross * (1 - taxRate / 100) : empGross
    const gap = Math.max(0, targetMo - empNet)
    const costLo = (income * 0.01) / 12
    const costHi = (income * 0.03) / 12
    return { gm, targetMo, empGross, empNet, gap, costLo, costHi }
  }, [income, target, empPct, empPays, taxRate])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Gross annual income" value={income} onChange={setIncome} prefix="$" step="5000" />
          <div>
            <label className="mb-1 block text-sm font-medium">Replacement target</label>
            <select className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="60">60% of gross — lean budget</option>
              <option value="65">65% of gross — typical target</option>
              <option value="70">70% of gross — conservative</option>
            </select>
          </div>
          <Field label="Employer group LTD benefit" value={empPct} onChange={setEmpPct} suffix="% of income" step="5" />
          <div>
            <label className="mb-1 block text-sm font-medium">Who pays the group premium?</label>
            <select className={inputCls} value={empPays} onChange={(e) => setEmpPays(e.target.value)}>
              <option value="yes">Employer pays (benefits are taxable)</option>
              <option value="no">I pay after-tax (benefits are tax-free)</option>
            </select>
          </div>
          <Field label="Marginal tax rate on benefits" value={taxRate} onChange={setTaxRate} suffix="%" step="1" />
          <p className="text-sm text-muted-foreground">
            The standard target is 60–70% of gross income — close to take-home pay, because
            individual benefits are tax-free when you pay the premiums with after-tax dollars
            (IRC §104(a)(3)). The surprise most people find here: employer group LTD is usually
            taxable, so a &quot;60%&quot; group benefit lands as ~42% of gross after tax — the
            gap is what an individual policy fills. When shopping: own-occupation definition,
            90-day elimination period (bridge it with your emergency fund), benefit period to
            age 65, non-cancellable + guaranteed renewable, COLA rider if you can afford it.
            Expect comprehensive individual coverage to run roughly 1–3% of annual income.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Individual policy gap" value={`${usd(r.gap, 0)}/mo`} />
          <Result label="Gross monthly income" value={usd(r.gm, 0)} />
          <Result label={`Target benefit (${target}%)`} value={`${usd(r.targetMo, 0)}/mo tax-free`} />
          <Result label="Employer benefit (gross)" value={`${usd(r.empGross, 0)}/mo`} />
          <Result label={`Employer benefit (after tax)`} value={`${usd(r.empNet, 0)}/mo`} />
          <Result label="Typical individual premium" value={`${usd(r.costLo, 0)}–${usd(r.costHi, 0)}/mo`} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Term vs whole life: buy term & invest the difference ---------------- */

export function TermVsWholeCalc() {
  const [coverage, setCoverage] = useNumber(1000000)
  const [years, setYears] = useNumber(20)
  const [termMo, setTermMo] = useNumber(45)
  const [wholeMo, setWholeMo] = useNumber(450)
  const [ret, setRet] = useNumber(7)
  const [cashValue, setCashValue] = useNumber(60000)

  const r = useMemo(() => {
    const months = years * 12
    const i = ret / 100 / 12
    const termTotal = termMo * months
    const wholeTotal = wholeMo * months
    const diff = Math.max(0, wholeMo - termMo)
    const fv = i === 0 ? diff * months : diff * ((Math.pow(1 + i, months) - 1) / i)
    const netWhole = wholeTotal - cashValue
    // BTID end position: paid termTotal, holds fv invested. WL end position: paid wholeTotal, holds cashValue.
    const btidNet = fv - termTotal
    const wlNet = cashValue - wholeTotal
    const ahead = btidNet - wlNet
    return { termTotal, wholeTotal, diff, fv, netWhole, btidNet, wlNet, ahead }
  }, [years, termMo, wholeMo, ret, cashValue])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Coverage amount" value={coverage} onChange={setCoverage} prefix="$" step="50000" />
          <Field label="Term length" value={years} onChange={setYears} suffix="yrs" step="5" />
          <Field label="Term monthly premium (your quote)" value={termMo} onChange={setTermMo} prefix="$" step="5" />
          <Field label="Whole life monthly premium (your quote)" value={wholeMo} onChange={setWholeMo} prefix="$" step="10" />
          <Field label="Investment return on the difference" value={ret} onChange={setRet} suffix="%" step="0.5" />
          <Field label="Illustrated whole-life cash value at term end" value={cashValue} onChange={setCashValue} prefix="$" step="5000" />
          <p className="text-sm text-muted-foreground">
            &quot;Buy term and invest the difference&quot; (BTID) tested with your real quotes:
            both sides carry {usd(coverage)} of protection for {num(years, 0)} years, and the
            premium difference goes into an index fund earning {num(ret, 1)}%. The honest
            comparison is each side&apos;s end position — premiums paid minus what you still
            hold. Whole life&apos;s hold is the illustrated cash surrender value (get it from
            the policy illustration — it is usually far less than premiums paid in the first
            two decades). Whole life wins when the need is truly permanent — estate liquidity,
            lifelong dependents, final expenses — not when the need ends with the mortgage and
            the kids.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="BTID advantage at term end" value={usd(r.ahead)} />
          <Result label="Term premiums paid" value={usd(r.termTotal)} />
          <Result label="Whole life premiums paid" value={usd(r.wholeTotal)} />
          <Result label={`Monthly difference invested`} value={`${usd(r.diff, 2)}/mo`} />
          <Result label={`Invested difference at ${num(years, 0)} yrs`} value={usd(r.fv)} />
          <Result label="BTID end position (fund − premiums)" value={usd(r.btidNet)} />
          <Result label="Whole life end position (cash value − premiums)" value={usd(r.wlNet)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Life insurance needs (DIME method) ---------------- */

export function LifeInsuranceCalc() {
  const [income, setIncome] = useNumber(75000)
  const [years, setYears] = useNumber(10)
  const [mortgage, setMortgage] = useNumber(250000)
  const [debts, setDebts] = useNumber(15000)
  const [kids, setKids] = useNumber(2)
  const [perChild, setPerChild] = useNumber(100000)
  const [final, setFinal] = useNumber(15000)
  const [existing, setExisting] = useNumber(0)
  const [savings, setSavings] = useNumber(25000)

  const r = useMemo(() => {
    const i = income * years
    const e = kids * perChild
    const gross = debts + i + mortgage + e + final
    const net = Math.max(0, gross - existing - savings)
    const tenX = income * 10
    const gap10x = net - tenX
    return { i, e, gross, net, tenX, gap10x }
  }, [income, years, mortgage, debts, kids, perChild, final, existing, savings])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Annual income" value={income} onChange={setIncome} prefix="$" step="1000" />
          <Field label="Years of income to replace" value={years} onChange={setYears} step="1" />
          <Field label="Mortgage balance" value={mortgage} onChange={setMortgage} prefix="$" step="5000" />
          <Field label="Other debts (cards, loans)" value={debts} onChange={setDebts} prefix="$" step="1000" />
          <Field label="Children" value={kids} onChange={setKids} step="1" />
          <Field label="Education cost per child" value={perChild} onChange={setPerChild} prefix="$" step="5000" />
          <Field label="Final expenses" value={final} onChange={setFinal} prefix="$" step="1000" />
          <Field label="Existing life insurance" value={existing} onChange={setExisting} prefix="$" step="10000" />
          <Field label="Liquid savings & investments" value={savings} onChange={setSavings} prefix="$" step="5000" />
          <p className="text-sm text-muted-foreground">
            The DIME method — Debt, Income, Mortgage, Education — is the framework fee-only
            planners start from: add the four obligations, subtract what you already have, and
            the gap is the death benefit to shop for. The 10×-income rule is shown for contrast;
            for most families with a mortgage and kids it comes in hundreds of thousands low.
            Term life is usually the right tool for a need this size and this temporary — a
            20–30 year level term covers the mortgage years and the kids-to-college years at a
            fraction of whole-life cost.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Coverage to shop for" value={usd(r.net)} />
          <Result label="D — debts" value={usd(debts)} />
          <Result label={`I — income × ${num(years, 0)} yrs`} value={usd(r.i)} />
          <Result label="M — mortgage payoff" value={usd(mortgage)} />
          <Result label={`E — education (${num(kids, 0)} × ${usd(perChild)})`} value={usd(r.e)} />
          <Result label="Final expenses" value={usd(final)} />
          <Result label="Gross need" value={usd(r.gross)} />
          <Result label="Minus existing coverage + savings" value={`−${usd(existing + savings)}`} />
          <Result label="10×-income rule" value={usd(r.tenX)} />
          <Result label="DIME vs 10× rule" value={r.gap10x > 0 ? `DIME is ${usd(r.gap10x)} higher` : `10× rule is ${usd(-r.gap10x)} higher`} />
        </div>
      </CardContent>
    </Card>
  )
}

export const HEALTHMONEY_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'hsa-growth-calculator': HsaGrowthCalc,
  'life-insurance-calculator': LifeInsuranceCalc,
  'term-vs-whole-life-calculator': TermVsWholeCalc,
  'disability-insurance-calculator': DisabilityInsuranceCalc,
  'health-plan-comparison-calculator': HealthPlanCalc,
  'cobra-cost-calculator': CobraCalc,
}
