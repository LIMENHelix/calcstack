import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num, monthlyPayment, monthsToPayoff } from '@/lib/calc'

/* ---------------- First apartment budget (30% rule + 50/30/20 + move-in cash) ---------------- */

export function FirstApartmentCalc(_props: CalcProps) {
  const [takeHome, setTakeHome] = useNumber(3200)
  const [debts, setDebts] = useNumber(300)
  const [savings, setSavings] = useNumber(3000)

  const r = useMemo(() => {
    const rule30 = takeHome * 0.3
    // 50/30/20: needs bucket is 50% of take-home; rent must share it with other essentials.
    // We treat entered debts as the non-housing essentials the user already knows.
    const needsRoom = takeHome * 0.5 - debts
    const maxRent = Math.max(0, Math.min(rule30, needsRoom))
    const moveIn = maxRent * 2 + 150 // first month + 1-month deposit + typical app/admin fees
    const months = moveIn > 0 ? savings / moveIn : 0
    const leftover = takeHome - maxRent - debts
    return { rule30, needsRoom, maxRent, moveIn, months, leftover }
  }, [takeHome, debts, savings])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Monthly take-home pay" value={takeHome} onChange={setTakeHome} prefix="$" />
          <Field label="Monthly debt payments + essentials you know (loans, car, phone)" value={debts} onChange={setDebts} prefix="$" />
          <Field label="Cash saved for move-in" value={savings} onChange={setSavings} prefix="$" />
          <p className="text-xs text-muted-foreground">
            Two guardrails: the classic 30%-of-take-home rent cap, and the 50/30/20 budget where
            rent plus essentials stay under 50%. Your ceiling is the lower of the two. Move-in cash
            assumes first month + one-month deposit + ~$150 application/admin fees.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Max rent you should sign for" value={usd(r.maxRent)} />
          <Result label="30% rule ceiling" value={usd(r.rule30)} />
          <Result label="50/30/20 needs-bucket room" value={usd(Math.max(0, r.needsRoom))} />
          <Result label="Cash needed on signing day" value={usd(r.moveIn)} />
          <Result
            label="Your savings cover it"
            value={r.months >= 1 ? `${num(r.months, 1)}× over` : `short by ${usd(r.moveIn - savings)}`}
          />
          <Result label="Left each month after rent + debts" value={usd(r.leftover)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Salary offer comparison, cost-of-living adjusted ---------------- */

export function SalaryOfferCalc(_props: CalcProps) {
  const [salA, setSalA] = useNumber(75000)
  const [colA, setColA] = useNumber(100)
  const [salB, setSalB] = useNumber(68000)
  const [colB, setColB] = useNumber(85)

  const r = useMemo(() => {
    const adjA = colA > 0 ? salA / (colA / 100) : 0
    const adjB = colB > 0 ? salB / (colB / 100) : 0
    const diff = adjA - adjB
    const winner = Math.abs(diff) < 1 ? 0 : diff > 0 ? 1 : 2
    // Salary B would need in city B's prices to match A's purchasing power
    const equivB = adjA * (colB / 100)
    return { adjA, adjB, diff, winner, equivB }
  }, [salA, colA, salB, colB])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Offer A — salary" value={salA} onChange={setSalA} prefix="$" />
          <Field label="Offer A — city cost-of-living index (100 = US average)" value={colA} onChange={setColA} />
          <Field label="Offer B — salary" value={salB} onChange={setSalB} prefix="$" />
          <Field label="Offer B — city cost-of-living index" value={colB} onChange={setColB} />
          <p className="text-xs text-muted-foreground">
            Adjusted salary = offer ÷ (index ÷ 100) — what the paycheck is worth in
            average-American purchasing power. Look up indexes on C2ER, NerdWallet, or Numbeo;
            they move, so verify before signing. This ignores taxes — run both through the
            paycheck calculator for the state each job is in.
          </p>
        </div>
        <div className="space-y-3">
          <Result
            big
            label="Stronger offer (purchasing power)"
            value={r.winner === 0 ? 'Dead even' : r.winner === 1 ? 'Offer A' : 'Offer B'}
          />
          <Result label="Offer A, adjusted" value={usd(r.adjA)} />
          <Result label="Offer B, adjusted" value={usd(r.adjB)} />
          <Result label="Gap per year" value={usd(Math.abs(r.diff))} />
          <Result label="B would need to pay to tie A" value={usd(r.equivB)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Student loan vs investing (same-total-outlay comparison) ---------------- */

export function LoanVsInvestCalc(_props: CalcProps) {
  const [balance, setBalance] = useNumber(30000)
  const [rate, setRate] = useNumber(6.5)
  const [years, setYears] = useNumber(10)
  const [extra, setExtra] = useNumber(200)
  const [ret, setRet] = useNumber(7)

  const r = useMemo(() => {
    const nBase = Math.round(years * 12)
    const pmtBase = monthlyPayment(balance, rate, years)
    const pmtExtra = pmtBase + extra
    const nPay = Math.min(nBase, monthsToPayoff(balance, rate, pmtExtra))
    const interestBase = pmtBase * nBase - balance
    const interestExtra = pmtExtra * nPay - balance
    const interestSaved = Math.max(0, interestBase - interestExtra)

    // Fair comparison: both paths spend the same total over the original term.
    // Loan path: pay extra until payoff, then invest the full freed payment.
    // Invest path: make minimum payments, invest the extra from day one.
    const i = ret / 100 / 12
    const fv = (monthly: number, months: number) =>
      months <= 0 ? 0 : i === 0 ? monthly * months : (monthly * (Math.pow(1 + i, months) - 1)) / i
    const loanPathFv = fv(pmtExtra, nBase - nPay)
    const investPathFv = fv(extra, nBase)
    const diff = investPathFv - loanPathFv
    const verdict =
      Math.abs(diff) < 10
        ? 'Effectively a coin flip — do whichever keeps you motivated'
        : diff > 0
          ? `Investing ahead by ${usd(diff)} (expected, not guaranteed)`
          : `Loan payoff ahead by ${usd(-diff)} (guaranteed)`
    return { pmtBase, nPay, interestSaved, loanPathFv, investPathFv, diff, verdict }
  }, [balance, rate, years, extra, ret])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Student loan balance" value={balance} onChange={setBalance} prefix="$" />
          <Field label="Loan interest rate" value={rate} onChange={setRate} suffix="%" />
          <Field label="Years left on the loan" value={years} onChange={setYears} suffix="yrs" />
          <Field label="Extra cash available each month" value={extra} onChange={setExtra} prefix="$" />
          <Field label="Expected annual investment return" value={ret} onChange={setRet} suffix="%" />
          <p className="text-xs text-muted-foreground">
            Both paths spend the same total dollars over the original loan term — loan-first invests
            the freed payment after payoff, invest-first invests the extra from day one. Paying the
            loan is a guaranteed, tax-free return equal to the loan rate; market returns are
            expected but volatile. Any employer 401(k) match beats both — always grab that first.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Verdict" value={r.verdict} />
          <Result label="Minimum loan payment" value={usd(r.pmtBase, 2)} />
          <Result label="Loan gone in (with extra)" value={`${num(r.nPay, 0)} months`} />
          <Result label="Guaranteed interest saved" value={usd(r.interestSaved)} />
          <Result label="Loan-first: portfolio at end" value={usd(r.loanPathFv)} />
          <Result label="Invest-first: portfolio at end" value={usd(r.investPathFv)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Moving cost: DIY truck vs full-service movers ---------------- */

// Typical shipment weight by home size (industry rule-of-thumb pounds).
const MOVE_WEIGHTS: Record<string, number> = {
  'Studio': 1800,
  '1 bedroom': 2500,
  '2 bedroom': 5000,
  '3 bedroom': 9000,
  '4+ bedroom': 12500,
}

export function MovingCostCalc(_props: CalcProps) {
  const [miles, setMiles] = useNumber(1000)
  const [size, setSize] = useState('2 bedroom')
  const [gas, setGas] = useNumber(3.5)

  const r = useMemo(() => {
    const weight = MOVE_WEIGHTS[size] ?? 5000
    // Full-service long-distance model: ~$0.30/lb base + ~$0.0004/lb per mile.
    // Sanity: 2BR 1,000 mi ≈ $3,500; 3BR 1,000 mi ≈ $6,300 — inside published ranges.
    const fullService = weight * (0.3 + 0.0004 * miles)
    // DIY: one-way truck ≈ $300 base + ~$1.20/mile; rental trucks average ~8 mpg.
    const truck = 300 + 1.2 * miles
    const gallons = miles / 8
    const fuel = gallons * gas
    const supplies = 200 // boxes, tape, pads, dollies
    const diy = truck + fuel + supplies
    return { weight, fullService, truck, fuel, gallons, supplies, diy, savings: fullService - diy }
  }, [miles, size, gas])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Move distance (one way)" value={miles} onChange={setMiles} suffix="mi" />
          <div>
            <label className="mb-1 block text-sm font-medium">Home size</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {Object.keys(MOVE_WEIGHTS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <Field label="Gas price" value={gas} onChange={setGas} prefix="$" suffix="/gal" />
          <p className="text-xs text-muted-foreground">
            Rule-of-thumb model, not a quote. Full-service uses typical shipment weight times a
            per-pound rate that scales with distance; DIY is a one-way truck rental plus fuel at
            8 mpg plus ~$200 of supplies. Real quotes swing 30%+ with season (summer is peak),
            stairs, and scheduling — get three binding estimates before booking.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="DIY saves you roughly" value={usd(r.savings)} />
          <Result label="Full-service movers (est.)" value={usd(r.fullService)} />
          <Result label={`DIY total: truck ${usd(r.truck)} + fuel ${usd(r.fuel)} + supplies`} value={usd(r.diy)} />
          <Result label="Estimated shipment weight" value={`${num(r.weight, 0)} lbs`} />
          <Result label="Fuel needed" value={`${num(r.gallons, 0)} gal`} />
        </div>
      </CardContent>
    </Card>
  )
}

export const NEWGRAD_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'first-apartment-budget-calculator': FirstApartmentCalc,
  'salary-offer-comparison-calculator': SalaryOfferCalc,
  'student-loan-vs-investing-calculator': LoanVsInvestCalc,
  'moving-cost-calculator': MovingCostCalc,
}
