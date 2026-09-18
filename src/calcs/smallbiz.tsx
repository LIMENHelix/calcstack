import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

/* ---------------- True cost of an employee ---------------- */

export function EmployeeCostCalc() {
  const [salary, setSalary] = useNumber(50000)
  const [health, setHealth] = useNumber(6000)
  const [suta, setSuta] = useNumber(2.7)
  const [comp, setComp] = useNumber(1.5)
  const [retirement, setRetirement] = useNumber(3)

  const r = useMemo(() => {
    const fica = salary * 0.0765 // employer share: 6.2% SS + 1.45% Medicare
    const futa = Math.min(salary, 7000) * 0.006 // 0.6% on first $7,000 after state credit
    const sutaCost = Math.min(salary, 7000) * (suta / 100) // typical wage base $7,000; varies by state
    const compCost = salary * (comp / 100)
    const match = salary * (retirement / 100)
    const total = salary + fica + futa + sutaCost + compCost + health + match
    const multiplier = salary > 0 ? total / salary : 0
    const hourly = total / 2080
    return { fica, futa, sutaCost, compCost, match, total, multiplier, hourly }
  }, [salary, health, suta, comp, retirement])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Gross salary" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Health insurance you pay" value={health} onChange={setHealth} prefix="$/yr" />
          <Field label="State unemployment rate (new employer ~2.7%)" value={suta} onChange={setSuta} suffix="%" />
          <Field label="Workers' comp rate" value={comp} onChange={setComp} suffix="%" />
          <Field label="401(k) match you offer" value={retirement} onChange={setRetirement} suffix="%" />
          <p className="text-xs text-muted-foreground">
            Employer FICA is a flat 7.65%. FUTA is 0.6% on the first $7,000 (after the standard
            state credit). SUTA uses the common $7,000 wage base — your state's base can be far
            higher (Washington's is over $70,000), so check your rate notice. Excludes recruiting,
            equipment, training, and paid time off — real fully-loaded cost is higher still.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="True annual cost" value={usd(r.total)} />
          <Result label="Cost multiplier on salary" value={`${num(r.multiplier, 2)}×`} />
          <Result label="True cost per hour (2,080 hrs)" value={`${usd(r.hourly, 2)}/hr`} />
          <Result label="Employer FICA" value={usd(r.fica)} />
          <Result label="FUTA + SUTA" value={usd(r.futa + r.sutaCost)} />
          <Result label="Workers' comp" value={usd(r.compCost)} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Cash runway (startup/small business) ---------------- */

export function CashRunwayCalc() {
  const [cash, setCash] = useNumber(120000)
  const [expenses, setExpenses] = useNumber(25000)
  const [revenue, setRevenue] = useNumber(10000)
  const [growth, setGrowth] = useNumber(5)

  const r = useMemo(() => {
    // Month-by-month simulation with revenue compounding; cap at 120 months
    let c = cash
    let rev = revenue
    let months = 0
    while (c > 0 && months < 120) {
      c -= expenses - rev
      rev *= 1 + growth / 100
      months++
      if (expenses - rev <= 0 && c > 0) {
        months = Infinity // profitable: runway unlimited
        break
      }
    }
    const burn0 = expenses - revenue
    const profitableAt = (() => {
      if (revenue >= expenses) return 0
      if (growth <= 0) return Infinity
      return Math.log(expenses / revenue) / Math.log(1 + growth / 100)
    })()
    return { months, burn0, profitableAt }
  }, [cash, expenses, revenue, growth])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Cash in the bank" value={cash} onChange={setCash} prefix="$" />
          <Field label="Monthly expenses" value={expenses} onChange={setExpenses} prefix="$" />
          <Field label="Current monthly revenue" value={revenue} onChange={setRevenue} prefix="$" />
          <Field label="Monthly revenue growth" value={growth} onChange={setGrowth} suffix="%" />
          <p className="text-xs text-muted-foreground">
            Simulates month by month: cash minus (expenses − revenue), with revenue compounding at
            your growth rate. Runway is when cash hits zero. Flat revenue (0% growth) is the
            conservative case every investor will ask about first — run that one too.
          </p>
        </div>
        <div className="space-y-3">
          <Result
            big
            label="Runway"
            value={
              r.months === Infinity
                ? 'Infinite — you turn profitable'
                : r.months >= 120
                  ? '120+ months'
                  : `${num(r.months, 1)} months`
            }
          />
          <Result label="Net burn right now" value={`${usd(r.burn0)}/mo`} />
          <Result
            label="Profitable in (at this growth)"
            value={
              r.profitableAt === 0
                ? 'Already profitable'
                : r.profitableAt === Infinity
                  ? 'Never at 0% growth'
                  : `${num(r.profitableAt, 1)} months`
            }
          />
          <Result label="Zero-growth runway" value={r.burn0 > 0 ? `${num(cash / r.burn0, 1)} months` : '—'} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Commercial lease true cost (base + NNN) ---------------- */

export function CommercialLeaseCalc() {
  const [sqft, setSqft] = useNumber(1500)
  const [base, setBase] = useNumber(22)
  const [nnn, setNnn] = useNumber(8)
  const [escalation, setEscalation] = useNumber(3)
  const [term, setTerm] = useNumber(5)

  const r = useMemo(() => {
    const rate0 = base + nnn
    const annual0 = rate0 * sqft
    const monthly0 = annual0 / 12
    // Total over term with annual escalations
    let total = 0
    for (let y = 0; y < term; y++) total += annual0 * Math.pow(1 + escalation / 100, y)
    const avgMonthly = total / (term * 12)
    return { rate0, annual0, monthly0, total, avgMonthly }
  }, [sqft, base, nnn, escalation, term])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Space size" value={sqft} onChange={setSqft} suffix="sq ft" />
          <Field label="Base rent" value={base} onChange={setBase} prefix="$" suffix="/sq ft/yr" />
          <Field label="NNN charges (taxes, insurance, CAM)" value={nnn} onChange={setNnn} prefix="$" suffix="/sq ft/yr" />
          <Field label="Annual escalation" value={escalation} onChange={setEscalation} suffix="%" />
          <Field label="Lease term" value={term} onChange={setTerm} suffix="yrs" />
          <p className="text-xs text-muted-foreground">
            A triple-net (NNN) lease quotes base rent but bills taxes, insurance, and common-area
            maintenance separately — the "all-in" rate is what you actually pay. Total cost uses
            annual compounding escalations, which is where long leases quietly get expensive.
            Gross leases bundle everything; compare only all-in rates.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="All-in monthly cost (year 1)" value={usd(r.monthly0)} />
          <Result label="All-in rate per sq ft" value={`${usd(r.rate0, 2)}/sq ft`} />
          <Result label="Year-1 total" value={usd(r.annual0)} />
          <Result label={`Total over ${term}-year term`} value={usd(r.total)} />
          <Result label="Average monthly over term" value={usd(r.avgMonthly)} />
        </div>
      </CardContent>
    </Card>
  )
}

export const SMALLBIZ_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'employee-true-cost-calculator': EmployeeCostCalc,
  'cash-runway-calculator': CashRunwayCalc,
  'commercial-lease-calculator': CommercialLeaseCalc,
}
