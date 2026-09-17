import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- Real Estate Commission Split ---------------- */

export function CommissionSplitCalc() {
  const [price, setPrice] = useNumber(400000)
  const [commPct, setCommPct] = useNumber(5.5)
  const [sideShare, setSideShare] = useNumber(50)
  const [franchisePct, setFranchisePct] = useNumber(6)
  const [agentSplitPct, setAgentSplitPct] = useNumber(70)
  const [transFee, setTransFee] = useNumber(395)

  const r = useMemo(() => {
    const gross = (price * commPct) / 100
    const side = (gross * sideShare) / 100
    const afterFranchise = side * (1 - franchisePct / 100)
    const agentGross = (afterFranchise * agentSplitPct) / 100
    const brokerCut = afterFranchise - agentGross
    const net = agentGross - transFee
    const effRate = price > 0 ? (net / price) * 100 : 0
    return { gross, side, afterFranchise, agentGross, brokerCut, net, effRate }
  }, [price, commPct, sideShare, franchisePct, agentSplitPct, transFee])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Sale price" value={price} onChange={setPrice} prefix="$" />
        <Field label="Total commission" value={commPct} onChange={setCommPct} suffix="%" />
        <Field label="Your side of the commission" value={sideShare} onChange={setSideShare} suffix="%" />
        <Field label="Franchise fee (off the top)" value={franchisePct} onChange={setFranchisePct} suffix="%" />
        <Field label="Your split with broker" value={agentSplitPct} onChange={setAgentSplitPct} suffix="% to you" />
        <Field label="Transaction/admin fee" value={transFee} onChange={setTransFee} prefix="$" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Gross commission" value={usd(r.gross, 2)} />
        <Result label="Your side" value={usd(r.side, 2)} />
        <Result label="After franchise fee" value={usd(r.afterFranchise, 2)} />
        <Result label="Broker keeps" value={usd(r.brokerCut, 2)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result big label="Your net on this deal" value={usd(r.net, 2)} />
        <Result label="Effective % of sale price" value={`${num(r.effRate, 2)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        The waterfall: gross commission → your side (listing or buyer) → minus the franchise fee → split with your
        broker → minus flat transaction/admin fees. On a 5.5% commission with a 70/30 split and a 6% franchise fee,
        a $400,000 sale nets the agent about {usd((400000 * 0.055 * 0.5 * 0.94 * 0.7) - 395, 0)} — roughly 1.7% of
        the sale price, not the headline 5.5%.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Cap Rate / Rental Yield ---------------- */

export function CapRateCalc() {
  const [price, setPrice] = useNumber(350000)
  const [rent, setRent] = useNumber(3000)
  const [vacancyPct, setVacancyPct] = useNumber(5)
  const [opexPct, setOpexPct] = useNumber(35)
  const [downPct, setDownPct] = useNumber(25)
  const [rate, setRate] = useNumber(7)
  const [term, setTerm] = useState('30')

  const r = useMemo(() => {
    const grossYear = rent * 12
    const egi = grossYear * (1 - vacancyPct / 100)
    const opex = (egi * opexPct) / 100
    const noi = egi - opex
    const cap = price > 0 ? (noi / price) * 100 : 0
    const grm = grossYear > 0 ? price / grossYear : 0
    const loan = price * (1 - downPct / 100)
    const n = parseFloat(term) * 12
    const i = rate / 100 / 12
    const pmt = i > 0 && n > 0 ? (loan * i) / (1 - Math.pow(1 + i, -n)) : n > 0 ? loan / n : 0
    const ds = pmt * 12
    const cashFlow = noi - ds
    const cashIn = price - loan
    const coc = cashIn > 0 ? (cashFlow / cashIn) * 100 : 0
    return { grossYear, egi, opex, noi, cap, grm, loan, pmt, ds, cashFlow, cashIn, coc }
  }, [price, rent, vacancyPct, opexPct, downPct, rate, term])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Purchase price" value={price} onChange={setPrice} prefix="$" />
        <Field label="Monthly rent" value={rent} onChange={setRent} prefix="$" />
        <Field label="Vacancy allowance" value={vacancyPct} onChange={setVacancyPct} suffix="%" />
        <Field label="Operating expenses" value={opexPct} onChange={setOpexPct} suffix="% of income" />
        <Field label="Down payment" value={downPct} onChange={setDownPct} suffix="%" />
        <Field label="Loan rate" value={rate} onChange={setRate} suffix="%" />
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Loan term</p>
          <select className={inputCls} value={term} onChange={(e) => setTerm(e.target.value)}>
            <option value="30">30 years</option>
            <option value="20">20 years</option>
            <option value="15">15 years</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label="Cap rate" value={`${num(r.cap, 2)}%`} />
        <Result label="NOI (year)" value={usd(r.noi, 0)} />
        <Result label="Gross rent multiplier" value={num(r.grm, 1)} />
        <Result label="Operating expenses" value={usd(r.opex, 0)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Loan amount" value={usd(r.loan, 0)} />
        <Result label="Mortgage payment" value={`${usd(r.pmt, 2)}/mo`} />
        <Result label="Cash flow (year)" value={usd(r.cashFlow, 0)} />
        <Result big label="Cash-on-cash return" value={`${num(r.coc, 2)}%`} />
      </div>
      <p className="text-sm text-muted-foreground">
        NOI = rent × 12, minus vacancy, minus operating expenses (taxes, insurance, maintenance, management — never
        the mortgage). Cap rate = NOI ÷ price. Cash-on-cash = (NOI − annual debt service) ÷ cash invested.
        Operating expenses typically run 35–50% of gross rent for single-family rentals; use real numbers from the
        seller&apos;s P&amp;L when you have them.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- GCI Goal Planner ---------------- */

export function GciGoalCalc() {
  const [goal, setGoal] = useNumber(150000)
  const [avgPrice, setAvgPrice] = useNumber(400000)
  const [commPct, setCommPct] = useNumber(2.75)
  const [franchisePct, setFranchisePct] = useNumber(6)
  const [agentSplitPct, setAgentSplitPct] = useNumber(70)

  const r = useMemo(() => {
    const perSide = (avgPrice * commPct) / 100
    const afterFranchise = perSide * (1 - franchisePct / 100)
    const netPerDeal = (afterFranchise * agentSplitPct) / 100
    const deals = netPerDeal > 0 ? Math.ceil(goal / netPerDeal) : 0
    const perMonth = deals / 12
    const grossGci = deals * perSide
    return { perSide, netPerDeal, deals, perMonth, grossGci }
  }, [goal, avgPrice, commPct, franchisePct, agentSplitPct])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Annual income goal (net to you)" value={goal} onChange={setGoal} prefix="$" />
        <Field label="Average sale price in your market" value={avgPrice} onChange={setAvgPrice} prefix="$" />
        <Field label="Commission per side" value={commPct} onChange={setCommPct} suffix="%" />
        <Field label="Franchise fee" value={franchisePct} onChange={setFranchisePct} suffix="%" />
        <Field label="Your split with broker" value={agentSplitPct} onChange={setAgentSplitPct} suffix="% to you" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Commission per side" value={usd(r.perSide, 2)} />
        <Result label="Net to you per deal" value={usd(r.netPerDeal, 2)} />
        <Result big label="Deals needed this year" value={String(r.deals)} />
        <Result label="Deals per month" value={num(r.perMonth, 1)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Work backwards: net income per deal = price × commission per side, minus franchise fee, times your broker
        split. Deals needed = ⌈goal ÷ net per deal⌉. At {usd(r.netPerDeal, 0)} net per deal, a {usd(goal, 0)} goal is
        {' '}{r.deals} closings — about {num(r.perMonth, 1)} per month, so prospecting has to feed that pipeline
        year-round, not in bursts.
      </p>
    </CardContent></Card>
  )
}

export const RE_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'real-estate-commission-calculator': CommissionSplitCalc,
  'cap-rate-calculator': CapRateCalc,
  'gci-goal-calculator': GciGoalCalc,
}
