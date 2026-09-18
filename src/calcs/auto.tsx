import { useMemo } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num } from '@/lib/calc'

/* ---------------- Car Affordability (20/4/10 rule, solved backward) ---------------- */

export function CarAffordabilityCalc(_props: CalcProps) {
  const [income, setIncome] = useNumber(6500)
  const [insurance, setInsurance] = useNumber(150)
  const [fuel, setFuel] = useNumber(150)
  const [rate, setRate] = useNumber(8)
  const [term, setTerm] = useNumber(48)
  const [downPct, setDownPct] = useNumber(20)

  const r = useMemo(() => {
    const mr = rate / 100 / 12
    const n = Math.max(1, Math.round(term))
    const priceFor = (capPct: number) => {
      const pmtBudget = Math.max(0, capPct * income - insurance - fuel)
      const loan = mr > 0 ? (pmtBudget * (1 - Math.pow(1 + mr, -n))) / mr : pmtBudget * n
      return { pmtBudget, price: loan / Math.max(0.05, 1 - downPct / 100), loan }
    }
    const safe = priceFor(0.1)
    const stretch = priceFor(0.15)
    return { safe, stretch, transportCap: 0.1 * income }
  }, [income, insurance, fuel, rate, term, downPct])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Gross monthly income" value={income} onChange={setIncome} prefix="$" />
          <Field label="Insurance estimate" value={insurance} onChange={setInsurance} prefix="$" suffix="/mo" />
          <Field label="Fuel / charging per month" value={fuel} onChange={setFuel} prefix="$" suffix="/mo" />
          <Field label="Loan rate" value={rate} onChange={setRate} suffix="%" />
          <Field label="Term" value={term} onChange={setTerm} suffix="mo" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Max car price (20/4/10 rule)" value={usd(r.safe.price)} />
          <Result label="Payment budget inside the 10% cap" value={usd(r.safe.pmtBudget, 2)} />
          <Result label="Loan that budget carries" value={usd(r.safe.loan)} />
          <Result label="Absolute stretch (15% cap)" value={usd(r.stretch.price)} />
        </div>

        <p className="text-sm text-muted-foreground">
          The 20/4/10 rule: 20% down, a loan no longer than 4 years, and total transport costs
          (payment + insurance + fuel) under 10% of gross income. It is deliberately strict — cars
          depreciate while houses and index funds do not, so every dollar of car is a dollar of
          lost compounding. The 15% row is the hard ceiling where transport starts eating savings.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- Lease vs Buy ---------------- */

export function LeaseVsBuyCalc(_props: CalcProps) {
  const [price, setPrice] = useNumber(38000)
  const [leaseMo, setLeaseMo] = useNumber(399)
  const [leaseDue, setLeaseDue] = useNumber(2999)
  const [leaseMonths, setLeaseMonths] = useNumber(36)
  const [buyDown, setBuyDown] = useNumber(3000)
  const [buyRate, setBuyRate] = useNumber(7.5)
  const [buyTerm, setBuyTerm] = useNumber(60)
  const [resalePct, setResalePct] = useNumber(60)
  const [mf, setMf] = useNumber(0.00167)

  const r = useMemo(() => {
    const mr = buyRate / 100 / 12
    const loan = Math.max(0, price - buyDown)
    const bpmt = mr > 0 ? (loan * mr) / (1 - Math.pow(1 + mr, -Math.round(buyTerm))) : loan / buyTerm
    const H = Math.round(leaseMonths)
    const balAfter = (m: number) =>
      mr > 0 ? Math.max(0, loan * Math.pow(1 + mr, m) - bpmt * ((Math.pow(1 + mr, m) - 1) / mr)) : Math.max(0, loan - (loan / buyTerm) * m)
    const balH = balAfter(H)
    const resale = (resalePct / 100) * price
    // Lease: total outlay, own nothing at the end
    const leaseCost = leaseDue + leaseMo * H
    // Buy: down + payments − (resale − remaining loan) = outlay net of equity cashed out
    const buyEquity = resale - balH
    const buyNet = buyDown + bpmt * H - buyEquity
    const apr = mf * 2400
    return { bpmt, leaseCost, buyNet, buyEquity, balH, resale, apr, H }
  }, [price, leaseMo, leaseDue, leaseMonths, buyDown, buyRate, buyTerm, resalePct, mf])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Car price (buy scenario)" value={price} onChange={setPrice} prefix="$" />
          <Field label="Lease monthly payment" value={leaseMo} onChange={setLeaseMo} prefix="$" suffix="/mo" />
          <Field label="Lease due at signing" value={leaseDue} onChange={setLeaseDue} prefix="$" />
          <Field label="Lease term (comparison horizon)" value={leaseMonths} onChange={setLeaseMonths} suffix="mo" />
          <Field label="Money factor (APR = MF × 2400)" value={mf} onChange={setMf} step="0.00001" />
          <Field label="Buy: down payment" value={buyDown} onChange={setBuyDown} prefix="$" />
          <Field label="Buy: loan rate" value={buyRate} onChange={setBuyRate} suffix="%" />
          <Field label="Buy: loan term" value={buyTerm} onChange={setBuyTerm} suffix="mo" />
          <Field label="Resale value at horizon" value={resalePct} onChange={setResalePct} suffix="% of price" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label={r.buyNet <= r.leaseCost ? 'Buying wins this horizon' : 'Leasing costs less this horizon'} value={usd(Math.abs(r.buyNet - r.leaseCost))} />
          <Result label="Lease total outlay (own nothing)" value={usd(r.leaseCost)} />
          <Result label="Buy net cost (outlay − equity)" value={usd(r.buyNet)} />
          <Result label="Lease APR equivalent" value={`${num(r.apr, 2)}%`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">Buy monthly payment</td><td className="p-2 text-right">{usd(r.bpmt, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Equity at month {r.H} (resale − loan balance)</td><td className="p-2 text-right">{usd(r.buyEquity)}</td></tr>
              <tr className="border-t"><td className="p-2">After the horizon</td><td className="p-2 text-right">Lease: start over at full price. Buy: {usd(r.bpmt, 2)}/mo ends at month {buyTerm}.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          The honest comparison is outlay minus what you still own at the end. Leasing is renting
          depreciation: lower monthly, nothing at the end, and mileage limits with wear fees
          waiting. Buying usually wins beyond one lease cycle because the payment eventually stops
          while lease payments never do. Money factor × 2400 = APR — dealers quote MF precisely
          because it looks small.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- True Cost to Own (per mile & per month) ---------------- */

export function CarTrueCostCalc(_props: CalcProps) {
  const [price, setPrice] = useNumber(38000)
  const [keepYears, setKeepYears] = useNumber(5)
  const [resalePct, setResalePct] = useNumber(45)
  const [down, setDown] = useNumber(3000)
  const [rate, setRate] = useNumber(7.5)
  const [term, setTerm] = useNumber(60)
  const [insurance, setInsurance] = useNumber(1800)
  const [miles, setMiles] = useNumber(12000)
  const [mpg, setMpg] = useNumber(28)
  const [fuelPrice, setFuelPrice] = useNumber(3.6)
  const [maint, setMaint] = useNumber(900)
  const [reg, setReg] = useNumber(250)

  const r = useMemo(() => {
    const yrs = Math.max(1, keepYears)
    const loan = Math.max(0, price - down)
    const mr = rate / 100 / 12
    const n = Math.round(term)
    const pmt = mr > 0 ? (loan * mr) / (1 - Math.pow(1 + mr, -n)) : loan / n
    const intTotal = Math.max(0, pmt * n - loan)
    const dep = (price - (resalePct / 100) * price) / yrs
    const fuelYr = miles > 0 && mpg > 0 ? (miles / mpg) * fuelPrice : 0
    const yearly = dep + insurance + fuelYr + maint + reg + intTotal / yrs
    const perMile = miles > 0 ? yearly / miles : 0
    return { pmt, intTotal, dep, fuelYr, yearly, perMile }
  }, [price, keepYears, resalePct, down, rate, term, insurance, miles, mpg, fuelPrice, maint, reg])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Purchase price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Years kept" value={keepYears} onChange={setKeepYears} suffix="yrs" />
          <Field label="Resale value at sale" value={resalePct} onChange={setResalePct} suffix="% of price" />
          <Field label="Down payment" value={down} onChange={setDown} prefix="$" />
          <Field label="Loan rate" value={rate} onChange={setRate} suffix="%" />
          <Field label="Loan term" value={term} onChange={setTerm} suffix="mo" />
          <Field label="Insurance" value={insurance} onChange={setInsurance} prefix="$" suffix="/yr" />
          <Field label="Miles per year" value={miles} onChange={setMiles} suffix="mi" />
          <Field label="Fuel economy" value={mpg} onChange={setMpg} suffix="mpg" />
          <Field label="Fuel price" value={fuelPrice} onChange={setFuelPrice} prefix="$" suffix="/gal" />
          <Field label="Maintenance & tires" value={maint} onChange={setMaint} prefix="$" suffix="/yr" />
          <Field label="Registration & fees" value={reg} onChange={setReg} prefix="$" suffix="/yr" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="True cost per month" value={usd(r.yearly / 12, 2)} />
          <Result label="True cost per mile" value={`$${num(r.perMile, 2)}`} />
          <Result label="Depreciation per year (the silent one)" value={usd(r.dep)} />
          <Result label="Total loan interest" value={usd(r.intTotal)} />
        </div>

        <p className="text-xs text-muted-foreground">
          The payment is only about a third of what a car costs. Depreciation, insurance, fuel,
          maintenance, registration, and interest bring the real figure to roughly double the
          loan payment on a typical new car — the number to use when comparing against transit,
          car-sharing, or keeping the old car alive one more year.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- Car Lease Payment ---------------- */

// Standard lease formula: payment = (cap cost − residual)/term + (cap cost + residual) × money factor
// Verified: $30k cap, $18k residual, 36 mo, MF 0.0025 → $333.33 + $120.00 = $453.33/mo
export function CarLeaseCalc(_props: CalcProps) {
  const [msrp, setMsrp] = useNumber(30000)
  const [capCost, setCapCost] = useNumber(28500)
  const [residualPct, setResidualPct] = useNumber(60)
  const [term, setTerm] = useNumber(36)
  const [mf, setMf] = useNumber(0.0025)
  const [tax, setTax] = useNumber(7)

  const r = useMemo(() => {
    const residual = (msrp * residualPct) / 100
    const n = Math.max(1, Math.round(term))
    const depFee = (capCost - residual) / n
    const finFee = (capCost + residual) * mf
    const preTax = depFee + finFee
    const payment = preTax * (1 + tax / 100)
    const aprEquiv = mf * 2400
    const totalPayments = payment * n
    const totalInterest = finFee * n
    const perYear = payment * 12
    return { residual, depFee, finFee, preTax, payment, aprEquiv, totalPayments, totalInterest, perYear, n }
  }, [msrp, capCost, residualPct, term, mf, tax])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="MSRP (sticker price)" value={msrp} onChange={setMsrp} prefix="$" />
          <Field label="Negotiated cap cost" value={capCost} onChange={setCapCost} prefix="$" />
          <Field label="Residual" value={residualPct} onChange={setResidualPct} suffix="% of MSRP" />
          <Field label="Lease term" value={term} onChange={setTerm} suffix="mo" />
          <Field label="Money factor" value={mf} onChange={setMf} step="0.0001" />
          <Field label="Sales tax on payment" value={tax} onChange={setTax} suffix="%" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Monthly payment" value={usd(r.payment, 2)} />
          <Result label="Pre-tax payment" value={usd(r.preTax, 2)} />
          <Result label="Money factor as APR" value={`${num(r.aprEquiv, 2)}%`} />
          <Result label="Residual value" value={usd(r.residual, 0)} />
          <Result label="Depreciation portion" value={`${usd(r.depFee, 2)}/mo`} />
          <Result label="Finance portion" value={`${usd(r.finFee, 2)}/mo`} />
          <Result label="Total finance charges" value={usd(r.totalInterest, 0)} />
          <Result label={`Total of ${r.n} payments`} value={usd(r.totalPayments, 0)} />
        </div>

        <p className="text-xs text-muted-foreground">
          Payment = (cap cost − residual) ÷ term + (cap cost + residual) × money factor. The money
          factor × 2400 is your APR — dealers quote it as a decimal precisely so it sounds small;
          0.0025 is 6%. Negotiate the cap cost like a purchase price, not the payment: every $1,000
          off the cap cost cuts the payment about ${num(1000 / Math.max(1, r.n), 0)}/month on this term.
          A higher residual lowers the payment but raises the buyout price at lease end.
        </p>
      </CardContent>
    </Card>
  )
}

export const AUTO_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'car-lease-payment-calculator': CarLeaseCalc,
  'car-affordability-calculator': CarAffordabilityCalc,
  'lease-vs-buy-calculator': LeaseVsBuyCalc,
  'car-true-cost-calculator': CarTrueCostCalc,
}
