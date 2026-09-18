import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num } from '@/lib/calc'
import { FEDERAL, SS_RATE, SS_WAGE_CAP, MEDICARE_RATE, bracketTax } from '@/data/paycheck'

const inputCls = 'flex h-9 w-full rounded-md border bg-background px-3 text-sm'

/* ---------------- Net Worth ---------------- */

// Federal Reserve Survey of Consumer Finances 2022 (published Oct 2023):
// median household net worth $192,900; mean $1,063,700.
const SCF_MEDIAN = 192900
const SCF_MEAN = 1063700

export function NetWorthCalc(_props: CalcProps) {
  const [cash, setCash] = useNumber(15000)
  const [invest, setInvest] = useNumber(40000)
  const [retire, setRetire] = useNumber(85000)
  const [home, setHome] = useNumber(350000)
  const [otherA, setOtherA] = useNumber(25000)
  const [mortgage, setMortgage] = useNumber(280000)
  const [student, setStudent] = useNumber(20000)
  const [carLoan, setCarLoan] = useNumber(15000)
  const [cards, setCards] = useNumber(4000)
  const [otherD, setOtherD] = useNumber(0)

  const r = useMemo(() => {
    const assets = cash + invest + retire + home + otherA
    const debts = mortgage + student + carLoan + cards + otherD
    const nw = assets - debts
    const debtRatio = assets > 0 ? debts / assets : 0
    const illiquid = assets > 0 ? (home + otherA) / assets : 0
    const vsMedian = SCF_MEDIAN > 0 ? nw / SCF_MEDIAN : 0
    return { assets, debts, nw, debtRatio, illiquid, vsMedian }
  }, [cash, invest, retire, home, otherA, mortgage, student, carLoan, cards, otherD])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <p className="mb-2 text-sm font-semibold">Assets — what you own</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Cash & savings" value={cash} onChange={setCash} prefix="$" />
            <Field label="Investments (brokerage)" value={invest} onChange={setInvest} prefix="$" />
            <Field label="Retirement (401k/IRA)" value={retire} onChange={setRetire} prefix="$" />
            <Field label="Home market value" value={home} onChange={setHome} prefix="$" />
            <Field label="Other property / vehicles" value={otherA} onChange={setOtherA} prefix="$" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Liabilities — what you owe</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Mortgage balance" value={mortgage} onChange={setMortgage} prefix="$" />
            <Field label="Student loans" value={student} onChange={setStudent} prefix="$" />
            <Field label="Car loans" value={carLoan} onChange={setCarLoan} prefix="$" />
            <Field label="Credit card balances" value={cards} onChange={setCards} prefix="$" />
            <Field label="Other debts" value={otherD} onChange={setOtherD} prefix="$" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Net worth" value={usd(r.nw)} />
          <Result label="Total assets" value={usd(r.assets)} />
          <Result label="Total liabilities" value={usd(r.debts)} />
          <Result label="Debt-to-asset ratio" value={`${num(r.debtRatio * 100, 1)}%`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">vs. US household median (Fed SCF 2022)</td><td className="p-2 text-right">{r.nw >= SCF_MEDIAN ? `${num(r.vsMedian, 1)}× the median` : `${num(r.vsMedian * 100, 0)}% of the median`} ({usd(SCF_MEDIAN)})</td></tr>
              <tr className="border-t"><td className="p-2">US household mean (for contrast)</td><td className="p-2 text-right">{usd(SCF_MEAN)} — the mean/median gap is wealth concentration, not a target</td></tr>
              <tr className="border-t"><td className="p-2">Share of assets that are illiquid</td><td className="p-2 text-right">{num(r.illiquid * 100, 0)}% (home + property — can't fund an emergency)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground">
          Net worth = assets − liabilities, the one number that summarizes your whole financial
          life. Benchmarks are from the Federal Reserve's 2022 Survey of Consumer Finances
          (median {usd(SCF_MEDIAN)}, mean {usd(SCF_MEAN)}). Use current market values, not what
          you paid — a house counts at what it would sell for today, minus what you still owe on it.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- Cost of Living Comparison (BEA 2023 RPP) ---------------- */

// BEA Regional Price Parities, all items, 2023 (released Dec 12, 2024). US = 100.
// Source: BEA news release rpp1224, Table 2.
export const RPP_2023: [string, number][] = [
  ['Alabama', 90.0], ['Alaska', 101.7], ['Arizona', 101.1], ['Arkansas', 86.5],
  ['California', 112.6], ['Colorado', 101.4], ['Connecticut', 103.7], ['Delaware', 99.3],
  ['District of Columbia', 110.8], ['Florida', 103.5], ['Georgia', 96.7], ['Hawaii', 108.6],
  ['Idaho', 91.4], ['Illinois', 98.9], ['Indiana', 92.2], ['Iowa', 88.8],
  ['Kansas', 90.0], ['Kentucky', 90.5], ['Louisiana', 88.3], ['Maine', 97.1],
  ['Maryland', 104.0], ['Massachusetts', 108.2], ['Michigan', 94.2], ['Minnesota', 98.4],
  ['Mississippi', 87.3], ['Missouri', 91.8], ['Montana', 90.2], ['Nebraska', 90.4],
  ['Nevada', 97.0], ['New Hampshire', 105.3], ['New Jersey', 108.9], ['New Mexico', 90.4],
  ['New York', 107.6], ['North Carolina', 94.1], ['North Dakota', 88.6], ['Ohio', 91.8],
  ['Oklahoma', 88.3], ['Oregon', 104.7], ['Pennsylvania', 97.5], ['Rhode Island', 101.4],
  ['South Carolina', 93.2], ['South Dakota', 88.1], ['Tennessee', 92.5], ['Texas', 97.2],
  ['Utah', 95.0], ['Vermont', 96.6], ['Virginia', 100.7], ['Washington', 108.6],
  ['West Virginia', 89.8], ['Wisconsin', 93.1], ['Wyoming', 90.8],
]

export function CostOfLivingCalc(_props: CalcProps) {
  const [salary, setSalary] = useNumber(85000)
  const [fromState, setFromState] = useState('Kansas')
  const [toState, setToState] = useState('California')
  const [customFrom, setCustomFrom] = useNumber(0) // 0 = use state preset
  const [customTo, setCustomTo] = useNumber(0)

  const r = useMemo(() => {
    const rppFrom = customFrom > 0 ? customFrom : (RPP_2023.find(([n]) => n === fromState)?.[1] ?? 100)
    const rppTo = customTo > 0 ? customTo : (RPP_2023.find(([n]) => n === toState)?.[1] ?? 100)
    const equivalent = salary * (rppTo / rppFrom)
    const realNow = salary / (rppFrom / 100) // purchasing power in national-average dollars
    const realThere = salary / (rppTo / 100)
    const deltaPct = (rppTo / rppFrom - 1) * 100
    return { rppFrom, rppTo, equivalent, realNow, realThere, deltaPct }
  }, [salary, fromState, toState, customFrom, customTo])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Current salary" value={salary} onChange={setSalary} prefix="$" />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Moving from</p>
            <select className={inputCls} value={fromState} onChange={(e) => setFromState(e.target.value)}>
              {RPP_2023.map(([n]) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Moving to</p>
            <select className={inputCls} value={toState} onChange={(e) => setToState(e.target.value)}>
              {RPP_2023.map(([n]) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label={`Equal buying power in ${customTo > 0 ? 'destination' : toState}`} value={usd(r.equivalent)} />
          <Result label={`${customFrom > 0 ? 'Origin' : fromState} price level (US = 100)`} value={num(r.rppFrom, 1)} />
          <Result label={`${customTo > 0 ? 'Destination' : toState} price level`} value={num(r.rppTo, 1)} />
          <Result label="Cost difference" value={`${r.deltaPct >= 0 ? '+' : ''}${num(r.deltaPct, 1)}%`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">Your salary in national-average dollars today</td><td className="p-2 text-right">{usd(r.realNow)}</td></tr>
              <tr className="border-t"><td className="p-2">Same paycheck's buying power after the move</td><td className="p-2 text-right">{usd(r.realThere)} ({r.deltaPct > 0 ? 'a pay cut in real terms' : 'a raise in real terms'})</td></tr>
              <tr className="border-t"><td className="p-2">Rule for evaluating an offer there</td><td className="p-2 text-right">Above {usd(r.equivalent)} → you come out ahead; below it → you lose ground</td></tr>
            </tbody>
          </table>
        </div>

        <details className="rounded-lg border p-3 text-sm">
          <summary className="cursor-pointer font-medium">Use a city-level index instead</summary>
          <p className="mt-2 text-muted-foreground">
            State parities average out big city/rural gaps. If you have a metro index from another
            source (e.g. a 115 for San Francisco), enter it here and it overrides the state preset.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Custom origin index (0 = use state)" value={customFrom} onChange={setCustomFrom} />
            <Field label="Custom destination index (0 = use state)" value={customTo} onChange={setCustomTo} />
          </div>
        </details>

        <p className="text-sm text-muted-foreground">
          Based on the Bureau of Economic Analysis Regional Price Parities, all items, 2023
          (released December 2024) — the same dataset economists use to compute real income by
          state. Equivalent salary = current salary × (destination RPP ÷ origin RPP). Housing is
          the biggest driver of the gap; taxes are separate — run both states through the paycheck
          calculator for the full picture.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- Raise Worth (after-tax value of a raise) ---------------- */

export function RaiseWorthCalc(_props: CalcProps) {
  const [current, setCurrent] = useNumber(62000)
  const [raisePct, setRaisePct] = useNumber(5)
  const [filing, setFiling] = useState<'single' | 'mfj'>('single')
  const [stateRate, setStateRate] = useNumber(5)

  const r = useMemo(() => {
    const fed = FEDERAL[filing]
    const fedTax = (gross: number) => bracketTax(fed.brackets, Math.max(0, gross - fed.ded))
    const fica = (gross: number) => {
      const ss = Math.min(gross, SS_WAGE_CAP) * (SS_RATE / 100)
      return ss + gross * (MEDICARE_RATE / 100)
    }
    const newSalary = current * (1 + raisePct / 100)
    const oldTotal = fedTax(current) + fica(current) + current * (stateRate / 100)
    const newTotal = fedTax(newSalary) + fica(newSalary) + newSalary * (stateRate / 100)
    const grossRaise = newSalary - current
    const taxOnRaise = newTotal - oldTotal
    const netRaise = grossRaise - taxOnRaise
    const keepRate = grossRaise > 0 ? netRaise / grossRaise : 0
    // marginal federal bracket on the last dollar of the NEW salary
    const taxable = Math.max(0, newSalary - fed.ded)
    let margFed = 10
    for (const [start, rate] of fed.brackets) if (taxable > start) margFed = rate
    const margAll = margFed + (current < SS_WAGE_CAP ? SS_RATE : 0) + MEDICARE_RATE + stateRate
    return { newSalary, grossRaise, taxOnRaise, netRaise, keepRate, margFed, margAll, perCheck: netRaise / 26, perMonth: netRaise / 12 }
  }, [current, raisePct, filing, stateRate])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Current salary" value={current} onChange={setCurrent} prefix="$" />
          <Field label="Raise" value={raisePct} onChange={setRaisePct} suffix="%" />
          <Field label="State income tax (flat est.)" value={stateRate} onChange={setStateRate} suffix="%" />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Filing status</p>
            <select className={inputCls} value={filing} onChange={(e) => setFiling(e.target.value as 'single' | 'mfj')}>
              <option value="single">Single</option>
              <option value="mfj">Married filing jointly</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Raise you actually keep" value={`${usd(r.netRaise)}/yr`} />
          <Result label="Gross raise" value={usd(r.grossRaise)} />
          <Result label="Taxes on the raise" value={usd(r.taxOnRaise)} />
          <Result label="Keep rate" value={`${num(r.keepRate * 100, 1)}%`} />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t"><td className="p-2">New salary</td><td className="p-2 text-right">{usd(r.newSalary)}</td></tr>
              <tr className="border-t"><td className="p-2">Extra per biweekly paycheck (after tax)</td><td className="p-2 text-right">{usd(r.perCheck, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Extra per month (after tax)</td><td className="p-2 text-right">{usd(r.perMonth, 2)}</td></tr>
              <tr className="border-t"><td className="p-2">Your marginal rate on new dollars</td><td className="p-2 text-right">{num(r.margAll, 1)}% total ({r.margFed}% federal + FICA + state)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground">
          A raise is taxed at your <em>marginal</em> rate — only the new dollars cross into the
          higher bracket, never your whole salary (2026 federal brackets, standard deduction
          included). "A raise bumps me into a higher bracket so I lose money" is a myth — the math
          above proves you always keep more. State is estimated as a flat rate; use your state's
          paycheck calculator page for exact brackets.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------- CD Interest & Early-Withdrawal Penalty ---------------- */

// APY-based growth: balance(m) = P × (1+APY)^(m/12). Penalty = months of interest at withdrawal point.
// Verified: $10k @ 4.5% → $10,450 (12mo), $12,461.82 (60mo); break at 6mo w/ 6-mo penalty → $9,995.05 net.
export function CdCalc(_props: CalcProps) {
  const [deposit, setDeposit] = useNumber(10000)
  const [apy, setApy] = useNumber(4.5)
  const [termMo, setTermMo] = useNumber(12)
  const [penaltyMo, setPenaltyMo] = useNumber(6)
  const [breakAt, setBreakAt] = useNumber(6)
  const [hysaApy, setHysaApy] = useNumber(4)

  const r = useMemo(() => {
    const g = 1 + apy / 100
    const maturity = deposit * Math.pow(g, termMo / 12)
    const interest = maturity - deposit
    // early withdrawal at breakAt months
    const balAtBreak = deposit * Math.pow(g, Math.min(breakAt, termMo) / 12)
    const penalty = balAtBreak * (Math.pow(g, Math.min(penaltyMo, breakAt) / 12) - 1)
    const netEarly = balAtBreak - penalty
    // HYSA comparison for the same break period
    const hysa = deposit * Math.pow(1 + hysaApy / 100, Math.min(breakAt, termMo) / 12)
    const earlyBeatsHysa = netEarly >= hysa
    return { maturity, interest, balAtBreak, penalty, netEarly, hysa, earlyBeatsHysa }
  }, [deposit, apy, termMo, penaltyMo, breakAt, hysaApy])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Deposit" value={deposit} onChange={setDeposit} prefix="$" />
          <Field label="CD APY" value={apy} onChange={setApy} suffix="%" step="0.05" />
          <Field label="Term" value={termMo} onChange={setTermMo} suffix="mo" />
          <Field label="Early-withdrawal penalty" value={penaltyMo} onChange={setPenaltyMo} suffix="mo of interest" />
          <Field label="If you break at month" value={breakAt} onChange={setBreakAt} step="1" />
          <Field label="Your HYSA rate (comparison)" value={hysaApy} onChange={setHysaApy} suffix="%" step="0.05" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result big label="Value at maturity" value={usd(r.maturity, 2)} />
          <Result label="Interest earned at term" value={usd(r.interest, 2)} />
          <Result label={`If broken at month ${num(breakAt, 0)}: net`} value={usd(r.netEarly, 2)} />
          <Result label="Penalty paid" value={`−${usd(r.penalty, 2)}`} />
          <Result label={`HYSA at ${num(hysaApy, 2)}% for same period`} value={usd(r.hysa, 2)} />
          <Result label="Breaking CD vs staying liquid" value={r.earlyBeatsHysa ? `CD still wins by ${usd(r.netEarly - r.hysa, 2)}` : `HYSA wins by ${usd(r.hysa - r.netEarly, 2)}`} />
        </div>

        <p className="text-xs text-muted-foreground">
          Growth uses the APY directly (compounding already included): balance = deposit ×
          (1 + APY)^(months/12). The penalty line is the one to check before committing: with a
          {num(penaltyMo, 0)}-month penalty, breaking this CD at month {num(breakAt, 0)} nets{' '}
          {usd(r.netEarly, 2)} — {r.earlyBeatsHysa ? 'still ahead of' : 'behind'} simply leaving it in
          a {num(hysaApy, 2)}% high-yield savings account. A CD ladder (splitting the deposit across
          staggered terms) is the standard fix: something matures every few months, so the penalty
          scenario rarely triggers.
        </p>
      </CardContent>
    </Card>
  )
}

export const WEALTH_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'cd-interest-calculator': CdCalc,
  'net-worth-calculator': NetWorthCalc,
  'cost-of-living-comparison-calculator': CostOfLivingCalc,
  'raise-worth-calculator': RaiseWorthCalc,
}
