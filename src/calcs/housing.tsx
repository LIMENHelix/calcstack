import { useMemo } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num, monthlyPayment } from '@/lib/calc'

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

export const HOUSING_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'rent-vs-buy-calculator': RentVsBuyCalc,
  'closing-cost-calculator': ClosingCostCalc,
  'home-affordability-calculator': HomeAffordabilityCalc,
}
