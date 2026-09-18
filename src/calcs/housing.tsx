import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num, monthlyPayment } from '@/lib/calc'
import { vaFeeRate } from './milstu'

/* ---------------- Rent vs Buy Breakeven ---------------- */

export function RentVsBuyCalc(_props: CalcProps) {
  const [price, setPrice] = useNumber(400000)
  const [downPct, setDownPct] = useNumber(20)
  const [rate, setRate] = useNumber(6.5)
  const [years, setYears] = useNumber(30)
  const [taxRate, setTaxRate] = useNumber(1.1)
  const [insurance, setInsurance] = useNumber(1800)
  const [maintPct, setMaintPct] = useNumber(1)
  const [closingPct, setClosingPct] = useNumber(3)
  const [appreciation, setAppreciation] = useNumber(3)
  const [rent, setRent] = useNumber(1800)
  const [rentGrowth, setRentGrowth] = useNumber(3)
  const [investReturn, setInvestReturn] = useNumber(5)
  const [sellPct, setSellPct] = useNumber(6)
  const [horizon, setHorizon] = useNumber(10)

  const r = useMemo(() => {
    const down = price * (downPct / 100)
    const closing = price * (closingPct / 100)
    const loan = Math.max(0, price - down)
    const pmt = monthlyPayment(loan, rate, years)
    const mr = rate / 100 / 12
    const taxMo = (price * (taxRate / 100)) / 12
    const insMo = insurance / 12
    const maintMo = (price * (maintPct / 100)) / 12
    const ownerMonthly = pmt + taxMo + insMo + maintMo
    const im = investReturn / 100 / 12
    const apprecM = Math.pow(1 + appreciation / 100, 1 / 12) - 1
    const rentGrowthM = Math.pow(1 + rentGrowth / 100, 1 / 12) - 1

    let bal = loan
    let homeValue = price
    let rentMo = rent
    let ownerPaid = 0
    let renterPaid = 0
    let renterFund = down + closing // renter keeps the cash, invested
    let ownerFund = 0 // if owning is cheaper monthly, the difference gets invested
    let breakevenMonth: number | null = null
    const yearly: { year: number; ownerNet: number; renterNet: number }[] = []
    const months = Math.round(horizon * 12)

    for (let m = 1; m <= months; m++) {
      const interest = bal * mr
      bal = Math.max(0, bal - (pmt - interest))
      homeValue *= 1 + apprecM
      ownerPaid += ownerMonthly
      renterPaid += rentMo
      renterFund *= 1 + im
      ownerFund *= 1 + im
      const diff = ownerMonthly - rentMo
      if (diff > 0) renterFund += diff
      else ownerFund += -diff
      rentMo *= 1 + rentGrowthM

      const saleProceeds = homeValue * (1 - sellPct / 100) - bal
      const ownerNet = down + closing + ownerPaid - saleProceeds - ownerFund
      const renterNet = renterPaid - renterFund
      if (breakevenMonth === null && ownerNet < renterNet) breakevenMonth = m
      if (m % 12 === 0) yearly.push({ year: m / 12, ownerNet, renterNet })
    }
    return { down, closing, loan, pmt, ownerMonthly, breakevenMonth, yearly }
  }, [price, downPct, rate, years, taxRate, insurance, maintPct, closingPct, appreciation, rent, rentGrowth, investReturn, sellPct, horizon])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Home price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Mortgage rate" value={rate} onChange={setRate} suffix="%" />
          <Field label="Term" value={years} onChange={setYears} suffix="yrs" />
          <Field label="Current rent" value={rent} onChange={setRent} prefix="$" suffix="/mo" />
          <Field label="Rent growth" value={rentGrowth} onChange={setRentGrowth} suffix="%/yr" />
          <Field label="Home appreciation" value={appreciation} onChange={setAppreciation} suffix="%/yr" />
          <Field label="Investment return (renter's cash)" value={investReturn} onChange={setInvestReturn} suffix="%/yr" />
          <Field label="Property tax" value={taxRate} onChange={setTaxRate} suffix="%/yr" />
          <Field label="Insurance" value={insurance} onChange={setInsurance} prefix="$" suffix="/yr" />
          <Field label="Maintenance" value={maintPct} onChange={setMaintPct} suffix="%/yr" />
          <Field label="Buying closing costs" value={closingPct} onChange={setClosingPct} suffix="%" />
          <Field label="Selling costs" value={sellPct} onChange={setSellPct} suffix="%" />
          <Field label="Comparison horizon" value={horizon} onChange={setHorizon} suffix="yrs" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result
            big
            label="Breakeven point"
            value={r.breakevenMonth !== null ? `Year ${num(Math.ceil(r.breakevenMonth / 12), 0)}` : `Beyond ${horizon} yrs`}
          />
          <Result label="Owner monthly cost (PITI + maint)" value={usd(r.ownerMonthly, 2)} />
          <Result label="Upfront cash to buy" value={usd(r.down + r.closing)} />
          <Result label="Mortgage P&I" value={usd(r.pmt, 2)} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-2">Year</th>
                <th className="p-2 text-right">Net cost of buying</th>
                <th className="p-2 text-right">Net cost of renting</th>
                <th className="p-2 text-right">Cheaper</th>
              </tr>
            </thead>
            <tbody>
              {r.yearly.map((y) => (
                <tr key={y.year} className="border-t">
                  <td className="p-2 font-medium">{y.year}</td>
                  <td className="p-2 text-right">{usd(y.ownerNet)}</td>
                  <td className="p-2 text-right">{usd(y.renterNet)}</td>
                  <td className="p-2 text-right font-medium">
                    {y.ownerNet < y.renterNet ? 'Buy' : 'Rent'} by {usd(Math.abs(y.ownerNet - y.renterNet))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Net cost of buying = down payment + closing + all monthly owner costs, minus net sale
          proceeds (value × {num(100 - sellPct, 0)}% − remaining loan) and any invested monthly
          savings. Net cost of renting = all rent paid, minus the invested down payment and any
          monthly savings, compounded at {num(investReturn, 1)}%. Assumptions stay constant over the
          horizon — real life moves them, so test pessimistic cases too.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- Closing Cost / Cash to Close ---------------- */

export function ClosingCostCalc(_props: CalcProps) {
  const [price, setPrice] = useNumber(400000)
  const [downPct, setDownPct] = useNumber(20)
  const [originationPct, setOriginationPct] = useNumber(1)
  const [appraisal, setAppraisal] = useNumber(600)
  const [titlePct, setTitlePct] = useNumber(0.5)
  const [escrowRecording, setEscrowRecording] = useNumber(800)
  const [taxRate, setTaxRate] = useNumber(1.1)
  const [insurance, setInsurance] = useNumber(1800)
  const [credits, setCredits] = useNumber(0)

  const r = useMemo(() => {
    const down = price * (downPct / 100)
    const loan = Math.max(0, price - down)
    const origination = loan * (originationPct / 100)
    const title = price * (titlePct / 100)
    const prepaidTax = (price * (taxRate / 100)) / 2 // ~6 months of taxes into escrow
    const prepaidIns = insurance // first year of homeowner's insurance
    const prepaids = prepaidTax + prepaidIns
    const totalCosts = origination + appraisal + title + escrowRecording + prepaids
    const cashToClose = down + totalCosts - credits
    return { down, loan, origination, title, prepaidTax, prepaidIns, prepaids, totalCosts, cashToClose, appraisal, escrowRecording }
  }, [price, downPct, originationPct, appraisal, titlePct, escrowRecording, taxRate, insurance, credits])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Home price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Loan origination fee" value={originationPct} onChange={setOriginationPct} suffix="% of loan" />
          <Field label="Appraisal" value={appraisal} onChange={setAppraisal} prefix="$" />
          <Field label="Title insurance & search" value={titlePct} onChange={setTitlePct} suffix="% of price" />
          <Field label="Recording, escrow & misc fees" value={escrowRecording} onChange={setEscrowRecording} prefix="$" />
          <Field label="Property tax rate (for escrow prepaids)" value={taxRate} onChange={setTaxRate} suffix="%/yr" />
          <Field label="Annual insurance (prepaid year 1)" value={insurance} onChange={setInsurance} prefix="$" />
          <Field label="Seller / lender credits" value={credits} onChange={setCredits} prefix="$" />
        </div>
        <div className="space-y-3">
          <Result big label="Cash to close" value={usd(r.cashToClose)} />
          <Result label="Down payment" value={usd(r.down)} />
          <Result label="Total closing costs" value={usd(r.totalCosts)} />
          <Result label={`Origination (${num(originationPct, 1)}% of ${usd(r.loan / 1000, 0)}k loan)`} value={usd(r.origination)} />
          <Result label="Appraisal" value={usd(r.appraisal)} />
          <Result label="Title insurance" value={usd(r.title)} />
          <Result label="Recording & escrow" value={usd(r.escrowRecording)} />
          <Result label="Prepaids (6 mo tax + 12 mo insurance)" value={usd(r.prepaids)} />
          <p className="text-sm text-muted-foreground">
            Rule of thumb: closing costs run 2–5% of the price. Your Loan Estimate is the binding
            document — compare this against section J of the official form, and ask about any fee that
            differs. Everything here is negotiable except the government recording fees.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Home Affordability (28/36 rule) ---------------- */

export function HomeAffordabilityCalc(_props: CalcProps) {
  const [income, setIncome] = useNumber(95000)
  const [debts, setDebts] = useNumber(500)
  const [down, setDown] = useNumber(40000)
  const [rate, setRate] = useNumber(6.5)
  const [years, setYears] = useNumber(30)
  const [taxRate, setTaxRate] = useNumber(1.1)
  const [insurance, setInsurance] = useNumber(1800)
  const [hoa, setHoa] = useNumber(0)
  const [pmiRate, setPmiRate] = useNumber(0.5)

  const r = useMemo(() => {
    const grossMo = income / 12
    const mr = rate / 100 / 12
    const n = Math.round(years * 12)
    const f = mr > 0 ? mr / (1 - Math.pow(1 + mr, -n)) : 1 / n
    const insMo = insurance / 12
    const t = taxRate / 100 / 12
    const q = pmiRate / 100 / 12

    // Closed-form price from a target total housing payment P:
    //   (price − down)·(f [+ q if PMI]) + price·t + insMo + hoa = payment
    // PMI applies only when the loan exceeds 80% of the price; solve both cases
    // and keep the one consistent with its own assumption.
    const priceFor = (payment: number) => {
      const noPmi = Math.max(0, (payment - insMo - hoa + down * f) / (f + t))
      if (down >= 0.2 * noPmi) return noPmi
      return Math.max(0, (payment - insMo - hoa + down * (f + q)) / (f + q + t))
    }

    const maxPayment = Math.max(0, Math.min(0.28 * grossMo, 0.36 * grossMo - debts))
    const comfyPayment = Math.max(0, Math.min(0.25 * grossMo, 0.33 * grossMo - debts))
    const maxPrice = priceFor(maxPayment)
    const comfyPrice = priceFor(comfyPayment)

    // Payment breakdown at the max price
    const loan = Math.max(0, maxPrice - down)
    const pi = loan * f
    const pmi = down < 0.2 * maxPrice ? loan * q : 0
    const taxMo = maxPrice * t
    const totalMo = pi + pmi + taxMo + insMo + hoa
    const backEndDti = grossMo > 0 ? ((totalMo + debts) / grossMo) * 100 : 0
    const frontEndDti = grossMo > 0 ? (totalMo / grossMo) * 100 : 0

    return { maxPrice, comfyPrice, maxPayment, comfyPayment, loan, pi, pmi, taxMo, insMo, totalMo, backEndDti, frontEndDti }
  }, [income, debts, down, rate, years, taxRate, insurance, hoa, pmiRate])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Gross annual income" value={income} onChange={setIncome} prefix="$" />
          <Field label="Monthly debt payments" value={debts} onChange={setDebts} prefix="$" suffix="/mo" />
          <Field label="Down payment saved" value={down} onChange={setDown} prefix="$" />
          <Field label="Mortgage rate" value={rate} onChange={setRate} suffix="%" />
          <Field label="Term" value={years} onChange={setYears} suffix="yrs" />
          <Field label="Property tax" value={taxRate} onChange={setTaxRate} suffix="%/yr" />
          <Field label="Home insurance" value={insurance} onChange={setInsurance} prefix="$" suffix="/yr" />
          <Field label="HOA dues" value={hoa} onChange={setHoa} prefix="$" suffix="/mo" />
          <Field label="PMI rate (if under 20% down)" value={pmiRate} onChange={setPmiRate} suffix="%/yr" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Maximum home price (28/36 rule)" value={usd(r.maxPrice)} />
          <Result big label="Comfortable price (25/33 rule)" value={usd(r.comfyPrice)} />
          <Result label="Max monthly housing cost" value={usd(r.maxPayment, 2)} />
          <Result label="Back-end DTI at max price" value={`${num(r.backEndDti, 1)}%`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-2">Monthly piece at max price</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="p-2">Principal &amp; interest ({usd(r.loan / 1000, 0)}k loan)</td><td className="p-2 text-right">{usd(r.pi, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Property tax</td><td className="p-2 text-right">{usd(r.taxMo, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Home insurance</td><td className="p-2 text-right">{usd(r.insMo, 2)}</td></tr>
              {r.pmi > 0 && <tr className="border-t"><td className="p-2">PMI (under 20% down)</td><td className="p-2 text-right">{usd(r.pmi, 2)}</td></tr>}
              {hoa > 0 && <tr className="border-t"><td className="p-2">HOA dues</td><td className="p-2 text-right">{usd(hoa, 2)}</td></tr>}
              <tr className="border-t font-medium"><td className="p-2">Total housing payment</td><td className="p-2 text-right">{usd(r.totalMo, 2)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          The 28/36 rule caps housing at 28% of gross income and all debts at 36%; the stricter of
          the two wins. "Comfortable" uses 25/33 — the payment that leaves room for savings and
          surprises. Price is solved with taxes, insurance, HOA, and PMI included, so the number is
          a true ceiling, not just a loan amount. Lender limits are a ceiling, not a target.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- FHA Loan (UFMIP + annual MIP, ML 2023-05) ---------------- */

// Annual MIP matrix per HUD Mortgagee Letter 2023-05 (base loan ≤ $726,200 tier):
//   term > 15yr: LTV ≤95% → 0.50%, LTV >95% → 0.55%
//   term ≤ 15yr: LTV ≤90% → 0.15%, LTV >90% → 0.40%
// Duration: LTV ≤90% → 11 years; otherwise life of loan.
const FHA_FLOOR_LIMIT_2026 = 541287 // one-unit floor, ML 2025-23

export function FHALoanCalc(_props: CalcProps) {
  const [price, setPrice] = useNumber(350000)
  const [downPct, setDownPct] = useNumber(3.5)
  const [rate, setRate] = useNumber(6.25)
  const [term, setTerm] = useNumber(30)
  const [taxRate, setTaxRate] = useNumber(1.1)
  const [insurance, setInsurance] = useNumber(1800)

  const r = useMemo(() => {
    const down = price * (downPct / 100)
    const base = Math.max(0, price - down)
    const ufmip = base * 0.0175
    const loan = base + ufmip // UFMIP financed
    const ltv = price > 0 ? (base / price) * 100 : 0
    const over15 = term > 15
    const mipRate = over15 ? (ltv > 95 ? 0.55 : 0.5) : ltv > 90 ? 0.4 : 0.15
    const mipYears = ltv <= 90 ? 11 : term
    const mr = rate / 100 / 12
    const n = Math.round(term * 12)
    const pmt = mr > 0 ? (loan * mr) / (1 - Math.pow(1 + mr, -n)) : loan / n
    const mipMo = (loan * (mipRate / 100)) / 12 // year-1 amount
    const mipMonths = Math.min(n, Math.round(mipYears * 12))
    let bal = loan
    let mipTotal = 0
    for (let m = 1; m <= mipMonths; m++) {
      mipTotal += (bal * (mipRate / 100)) / 12
      bal = Math.max(0, bal - (pmt - bal * mr))
    }
    const totalInterest = pmt * n - loan
    const taxMo = (price * (taxRate / 100)) / 12
    const insMo = insurance / 12
    const totalMo = pmt + mipMo + taxMo + insMo
    const overFloor = base > FHA_FLOOR_LIMIT_2026
    return { down, base, ufmip, loan, ltv, mipRate, mipYears, pmt, mipMo, mipTotal, totalInterest, taxMo, insMo, totalMo, overFloor }
  }, [price, downPct, rate, term, taxRate, insurance])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Home price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Interest rate" value={rate} onChange={setRate} suffix="%" />
          <div className="space-y-1">
            <label className="text-sm font-medium">Term</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value={30}>30 years</option>
              <option value={15}>15 years</option>
            </select>
          </div>
          <Field label="Property tax" value={taxRate} onChange={setTaxRate} suffix="%/yr" />
          <Field label="Home insurance" value={insurance} onChange={setInsurance} prefix="$" suffix="/yr" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Total monthly (PITI + MIP)" value={usd(r.totalMo, 2)} />
          <Result label="P&I (on financed loan)" value={usd(r.pmt, 2)} />
          <Result label="Monthly MIP (year 1)" value={usd(r.mipMo, 2)} />
          <Result label="MIP over its full life" value={usd(r.mipTotal)} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">Down payment ({num(downPct, 1)}%)</td><td className="p-2 text-right">{usd(r.down)}</td></tr>
              <tr className="border-t"><td className="p-2">Base loan (price − down)</td><td className="p-2 text-right">{usd(r.base)}</td></tr>
              <tr className="border-t"><td className="p-2">Upfront MIP (1.75%, financed)</td><td className="p-2 text-right">{usd(r.ufmip)}</td></tr>
              <tr className="border-t font-medium"><td className="p-2">Total financed loan</td><td className="p-2 text-right">{usd(r.loan)}</td></tr>
              <tr className="border-t"><td className="p-2">Annual MIP rate (LTV {num(r.ltv, 1)}%, {term}-yr)</td><td className="p-2 text-right">{num(r.mipRate, 2)}%</td></tr>
              <tr className="border-t"><td className="p-2">MIP duration</td><td className="p-2 text-right">{r.ltv <= 90 ? '11 years' : 'Life of loan'}</td></tr>
              <tr className="border-t"><td className="p-2">Total interest over {term} years</td><td className="p-2 text-right">{usd(r.totalInterest)}</td></tr>
            </tbody>
          </table>
        </div>
        {r.overFloor && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Base loan exceeds the 2026 FHA floor limit of {usd(FHA_FLOOR_LIMIT_2026)} — this only
            works in a high-cost county. Check your county limit at hud.gov before shopping at
            this price with FHA.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          MIP rates per HUD Mortgagee Letter 2023-05 (still current for 2026); upfront MIP 1.75%
          per HUD Handbook 4000.1. With under 10% down, annual MIP runs the life of the loan — it
          does not cancel at 80% like conventional PMI. With 10%+ down it ends after 11 years.
          Minimum down is 3.5% with a 580+ credit score (10% for 500–579).
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- 15-Year vs 30-Year Mortgage ---------------- */

export function FifteenVsThirtyCalc(_props: CalcProps) {
  const [loan, setLoan] = useNumber(320000)
  const [rate30, setRate30] = useNumber(6.5)
  const [rate15, setRate15] = useNumber(5.9)
  const [investReturn, setInvestReturn] = useNumber(5)

  const r = useMemo(() => {
    const r30 = rate30 / 100 / 12
    const r15 = rate15 / 100 / 12
    const p30 = r30 > 0 ? (loan * r30) / (1 - Math.pow(1 + r30, -360)) : loan / 360
    const p15 = r15 > 0 ? (loan * r15) / (1 - Math.pow(1 + r15, -180)) : loan / 180
    const int30 = p30 * 360 - loan
    const int15 = p15 * 180 - loan
    const diff = p15 - p30
    // Honest wealth comparison at year 30 (both own the home free and clear):
    //   30-yr strategy: invest the payment difference (p15 − p30) for all 360 months.
    //   15-yr strategy: pay more now, then invest the full p15 for months 181–360.
    const i = investReturn / 100 / 12
    const fv = (mo: number, months: number) => (i > 0 ? mo * ((Math.pow(1 + i, months) - 1) / i) : mo * months)
    const wealth30 = fv(diff, 360)
    const wealth15 = fv(p15, 180)
    return { p30, p15, int30, int15, diff, wealth30, wealth15, saved: int30 - int15 }
  }, [loan, rate30, rate15, investReturn])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Loan amount" value={loan} onChange={setLoan} prefix="$" />
          <Field label="30-year rate" value={rate30} onChange={setRate30} suffix="%" />
          <Field label="15-year rate" value={rate15} onChange={setRate15} suffix="%" />
          <Field label="Investment return (for the diff)" value={investReturn} onChange={setInvestReturn} suffix="%/yr" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Interest saved by 15-year" value={usd(r.saved)} />
          <Result label="30-year payment" value={usd(r.p30, 2)} />
          <Result label="15-year payment" value={usd(r.p15, 2)} />
          <Result label="Monthly difference" value={usd(r.diff, 2)} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-2">At year 30 — both homes owned outright</th>
                <th className="p-2 text-right">30-yr + invest diff</th>
                <th className="p-2 text-right">15-yr + invest after</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="p-2">Total interest paid</td><td className="p-2 text-right">{usd(r.int30)}</td><td className="p-2 text-right">{usd(r.int15)}</td></tr>
              <tr className="border-t"><td className="p-2">Investment balance at year 30</td><td className="p-2 text-right">{usd(r.wealth30)}</td><td className="p-2 text-right">{usd(r.wealth15)}</td></tr>
              <tr className="border-t font-medium">
                <td className="p-2">Net position at year 30 (investments − interest)</td>
                <td className="p-2 text-right">{usd(r.wealth30 - r.int30)}</td>
                <td className="p-2 text-right">{usd(r.wealth15 - r.int15)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          The 15-year loan wins when its rate beats your investment return — paying it is a
          guaranteed {num(rate15, 2)}%. If you can reliably invest above the 15-year rate, the
          30-year plus disciplined investing can come out ahead; the table above runs both
          strategies honestly with the same monthly outlay ({usd(r.p15, 2)}/mo). The catch is
          behavioral: the 30-year strategy only works if the difference actually gets invested.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- VA Loan (funding fee financed, no PMI) ---------------- */

export function VaLoanCalc(_props: CalcProps) {
  const [price, setPrice] = useNumber(400000)
  const [downPct, setDownPct] = useNumber(0)
  const [firstUse, setFirstUse] = useState(true)
  const [exempt, setExempt] = useState(false)
  const [rate, setRate] = useNumber(6.25)
  const [term, setTerm] = useNumber(30)
  const [taxRate, setTaxRate] = useNumber(1.1)
  const [insurance, setInsurance] = useNumber(1800)

  const r = useMemo(() => {
    const n = Math.round(term * 12)
    const pmtFor = (l: number) => {
      const mr = rate / 100 / 12
      return mr > 0 ? (l * mr) / (1 - Math.pow(1 + mr, -n)) : l / n
    }
    const taxMo = (price * (taxRate / 100)) / 12
    const insMo = insurance / 12

    // VA: funding fee financed, no monthly mortgage insurance ever
    const vaDown = price * (downPct / 100)
    const vaBase = Math.max(0, price - vaDown)
    const vaFeeRateUsed = exempt ? 0 : vaFeeRate(downPct, firstUse)
    const vaFee = vaBase * vaFeeRateUsed
    const vaLoan = vaBase + vaFee
    const vaPmt = pmtFor(vaLoan)
    const vaTotal = vaPmt + taxMo + insMo

    // FHA comparison: 3.5% down, 1.75% UFMIP financed, 0.55% MIP for life (LTV > 95%)
    const fhaDown = price * 0.035
    const fhaBase = price - fhaDown
    const fhaLoan = fhaBase * 1.0175
    const fhaPmt = pmtFor(fhaLoan)
    const fhaMip = (fhaLoan * 0.0055) / 12
    const fhaTotal = fhaPmt + fhaMip + taxMo + insMo

    // Conventional comparison: 5% down, PMI 0.5%/yr of loan
    const convDown = price * 0.05
    const convLoan = price - convDown
    const convPmt = pmtFor(convLoan)
    const convPmi = (convLoan * 0.005) / 12
    const convTotal = convPmt + convPmi + taxMo + insMo

    return { vaDown, vaBase, vaFeeRateUsed, vaFee, vaLoan, vaPmt, vaTotal, fhaDown, fhaPmt, fhaMip, fhaTotal, convDown, convPmt, convPmi, convTotal, taxMo, insMo }
  }, [price, downPct, firstUse, exempt, rate, term, taxRate, insurance])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Home price" value={price} onChange={setPrice} prefix="$" />
          <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
          <Field label="Interest rate" value={rate} onChange={setRate} suffix="%" />
          <div className="space-y-1">
            <label className="text-sm font-medium">Term</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value={30}>30 years</option>
              <option value={15}>15 years</option>
            </select>
          </div>
          <Field label="Property tax" value={taxRate} onChange={setTaxRate} suffix="%/yr" />
          <Field label="Home insurance" value={insurance} onChange={setInsurance} prefix="$" suffix="/yr" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
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
            Funding-fee exempt (service-connected disability, DIC, active-duty Purple Heart)
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="VA total monthly (PITI)" value={usd(r.vaTotal, 2)} />
          <Result label="P&I (fee financed)" value={usd(r.vaPmt, 2)} />
          <Result label="Funding fee" value={exempt ? '$0 (exempt)' : usd(r.vaFee)} />
          <Result label="Cash due at close (down only)" value={usd(r.vaDown)} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-2">Same house, three loan types</th>
                <th className="p-2 text-right">VA ({num(downPct, 1)}% down)</th>
                <th className="p-2 text-right">FHA (3.5% down)</th>
                <th className="p-2 text-right">Conventional (5% down)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="p-2">P&I</td><td className="p-2 text-right">{usd(r.vaPmt, 2)}</td><td className="p-2 text-right">{usd(r.fhaPmt, 2)}</td><td className="p-2 text-right">{usd(r.convPmt, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Mortgage insurance</td><td className="p-2 text-right">$0 — never</td><td className="p-2 text-right">{usd(r.fhaMip, 2)} MIP (life of loan)</td><td className="p-2 text-right">{usd(r.convPmi, 2)} PMI (to 78% LTV)</td></tr>
              <tr className="border-t"><td className="p-2">Taxes & insurance</td><td className="p-2 text-right">{usd(r.taxMo + r.insMo, 2)}</td><td className="p-2 text-right">{usd(r.taxMo + r.insMo, 2)}</td><td className="p-2 text-right">{usd(r.taxMo + r.insMo, 2)}</td></tr>
              <tr className="border-t font-medium"><td className="p-2">Total monthly</td><td className="p-2 text-right">{usd(r.vaTotal, 2)}</td><td className="p-2 text-right">{usd(r.fhaTotal, 2)}</td><td className="p-2 text-right">{usd(r.convTotal, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Cash to bring (down payment)</td><td className="p-2 text-right">{usd(r.vaDown)}</td><td className="p-2 text-right">{usd(r.fhaDown)}</td><td className="p-2 text-right">{usd(r.convDown)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Funding fee per the VA schedule effective April 7, 2023 (current for 2026): first use
          2.15% under 5% down, 1.5% at 5–9.99%, 1.25% at 10%+; subsequent use 3.3% under 5% down.
          Exempt borrowers pay $0. FHA comparison uses ML 2023-05 MIP at 0.55% for life; conventional
          PMI at a 0.5% planning rate. Closing costs (2–5%) are additional for all three — run the
          Closing Costs calculator next. VA loans have no monthly mortgage insurance at any down
          payment, and no loan limit with full entitlement.
        </p>
      </CardContent>
    </Card>
  )
}

export const HOUSING_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'rent-vs-buy-calculator': RentVsBuyCalc,
  'closing-cost-calculator': ClosingCostCalc,
  'home-affordability-calculator': HomeAffordabilityCalc,
  'fha-loan-calculator': FHALoanCalc,
  '15-year-mortgage-calculator': FifteenVsThirtyCalc,
  'va-loan-calculator': VaLoanCalc,
}
