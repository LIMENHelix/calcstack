import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num, monthlyPayment } from '@/lib/calc'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- BRRRR: Buy, Rehab, Rent, Refinance, Repeat ---------------- */

export function BrrrrCalc() {
  const [purchase, setPurchase] = useNumber(160000)
  const [rehab, setRehab] = useNumber(35000)
  const [closing, setClosing] = useNumber(5000)
  const [arv, setArv] = useNumber(260000)
  const [rent, setRent] = useNumber(2200)
  const [ltv, setLtv] = useNumber(75)
  const [rate, setRate] = useNumber(7.5)
  const [opexPct, setOpexPct] = useNumber(40)

  const r = useMemo(() => {
    const allIn = purchase + rehab + closing
    const newLoan = arv * (ltv / 100)
    const cashBack = newLoan - allIn
    const leftIn = Math.max(0, allIn - newLoan)
    const pmt = monthlyPayment(newLoan, rate, 30)
    const noi = rent * 12 * (1 - opexPct / 100)
    const cashFlow = noi - pmt * 12
    const coc = leftIn > 0 ? (cashFlow / leftIn) * 100 : cashFlow >= 0 ? Infinity : -Infinity
    const equity = arv - newLoan
    return { allIn, newLoan, cashBack, leftIn, pmt, noi, cashFlow, coc, equity }
  }, [purchase, rehab, closing, arv, rent, ltv, rate, opexPct])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Purchase price" value={purchase} onChange={setPurchase} prefix="$" />
          <Field label="Rehab budget" value={rehab} onChange={setRehab} prefix="$" />
          <Field label="Closing & holding costs" value={closing} onChange={setClosing} prefix="$" />
          <Field label="After-repair value (ARV)" value={arv} onChange={setArv} prefix="$" />
          <Field label="Monthly rent" value={rent} onChange={setRent} prefix="$" />
          <Field label="Refinance loan-to-value" value={ltv} onChange={setLtv} suffix="%" />
          <Field label="New loan rate (30-yr)" value={rate} onChange={setRate} suffix="%" />
          <Field label="Operating expenses + vacancy" value={opexPct} onChange={setOpexPct} suffix="% of rent" />
          <p className="text-xs text-muted-foreground">
            Assumes a cash purchase (or that short-term financing is inside closing costs), then a
            30-year cash-out refinance at the LTV you set. Operating expenses include vacancy,
            taxes, insurance, maintenance, and management — 40–50% of rent is the honest range.
            Seasoning rules apply: most lenders want 6–12 months of ownership before a cash-out refi.
          </p>
        </div>
        <div className="space-y-3">
          <Result
            big
            label="Cash left in the deal after refi"
            value={r.leftIn === 0 ? `${usd(0)} — you're fully out` : usd(r.leftIn)}
          />
          <Result label="All-in cost (purchase + rehab + closing)" value={usd(r.allIn)} />
          <Result label={`New loan at ${num(ltv, 0)}% of ARV`} value={usd(r.newLoan)} />
          <Result label="Cash recovered at closing" value={usd(Math.max(0, r.cashBack))} />
          <Result label="New mortgage payment" value={`${usd(r.pmt, 2)}/mo`} />
          <Result label="Annual cash flow" value={usd(r.cashFlow)} />
          <Result
            label="Cash-on-cash return"
            value={
              r.coc === Infinity
                ? 'Infinite (no cash left in)'
                : r.coc === -Infinity
                  ? 'Negative with zero basis'
                  : `${num(r.coc, 1)}%`
            }
          />
          <Result label="Equity captured" value={usd(r.equity)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Rental depreciation (27.5-yr residential straight-line) ---------------- */

export function RentalDepreciationCalc() {
  const [price, setPrice] = useNumber(250000)
  const [landPct, setLandPct] = useNumber(20)
  const [marginal, setMarginal] = useNumber(22)

  const r = useMemo(() => {
    const land = price * (landPct / 100)
    const basis = price - land
    const annual = basis / 27.5
    const monthly = annual / 12
    const taxSaved = annual * (marginal / 100)
    // Recapture at sale: unrecaptured §1250 gain taxed up to 25%
    const tenYear = annual * 10
    const recapture = tenYear * 0.25
    return { land, basis, annual, monthly, taxSaved, tenYear, recapture }
  }, [price, landPct, marginal])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Purchase price (incl. closing costs)" value={price} onChange={setPrice} prefix="$" />
          <Field label="Land share of value" value={landPct} onChange={setLandPct} suffix="%" />
          <Field label="Your marginal tax bracket" value={marginal} onChange={setMarginal} suffix="%" />
          <p className="text-xs text-muted-foreground">
            Residential rental buildings depreciate straight-line over 27.5 years; land never
            depreciates (use your county assessment's land/improvement split, typically 15–25%
            land). Depreciation is a paper deduction that shelters real cash flow — but it is
            recaptured at sale at up to 25% (unrecaptured §1250 gain), shown here at 10 years.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Annual depreciation deduction" value={usd(r.annual)} />
          <Result label="Depreciable basis (price − land)" value={usd(r.basis)} />
          <Result label="Monthly equivalent" value={usd(r.monthly, 2)} />
          <Result label="Tax saved per year at your bracket" value={usd(r.taxSaved)} />
          <Result label="Recapture tax if sold after 10 years" value={usd(r.recapture)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Prorated rent ---------------- */

export function ProratedRentCalc() {
  const [rent, setRent] = useNumber(1500)
  const [day, setDay] = useNumber(14)
  const [daysInMonth, setDaysInMonth] = useState('30')

  const r = useMemo(() => {
    const dim = Number(daysInMonth)
    const d = Math.min(Math.max(1, Math.round(day)), dim)
    const daily = rent / dim
    const daysCharged = dim - d + 1
    const prorated = daily * daysCharged
    const bankerDaily = rent / 30 // some leases use a 30-day month convention
    const bankerProrated = bankerDaily * daysCharged
    return { dim, d, daily, daysCharged, prorated, bankerProrated }
  }, [rent, day, daysInMonth])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Monthly rent" value={rent} onChange={setRent} prefix="$" />
          <Field label="Move-in day of the month" value={day} onChange={setDay} />
          <div>
            <label className="mb-1 block text-sm font-medium">Days in that month</label>
            <select className={inputCls} value={daysInMonth} onChange={(e) => setDaysInMonth(e.target.value)}>
              <option value="28">28 (February)</option>
              <option value="29">29 (February, leap year)</option>
              <option value="30">30</option>
              <option value="31">31</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            Standard proration: rent ÷ days-in-month × days the tenant occupies (including move-in
            day). Some leases use a "banker's month" of 30 days regardless — both are shown so you
            can match your lease language. Charging by the exact method in the signed lease is the
            only version that holds up in a dispute.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Prorated first month" value={usd(r.prorated, 2)} />
          <Result label="Daily rate (actual days)" value={usd(r.daily, 2)} />
          <Result label="Days charged" value={`${r.daysCharged} of ${r.dim}`} />
          <Result label="Banker's-month version (30-day)" value={usd(r.bankerProrated, 2)} />
        </div>
      </CardContent>
    </Card>
  )
}

export const LANDLORD_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'brrrr-calculator': BrrrrCalc,
  'rental-depreciation-calculator': RentalDepreciationCalc,
  'prorated-rent-calculator': ProratedRentCalc,
}
