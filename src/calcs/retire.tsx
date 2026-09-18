import { useMemo, useState } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num } from '@/lib/calc'

/* ---------------- RMD (IRS Uniform Lifetime Table, T.D. 9930, in effect since 2022) ---------------- */

const UNIFORM_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
  88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
  96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2,
  104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1, 108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4,
  112: 3.3, 113: 3.1, 114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3, 120: 2.0,
}

export function RmdCalc(_props: CalcProps) {
  const [age, setAge] = useNumber(75)
  const [balance, setBalance] = useNumber(500000)

  const r = useMemo(() => {
    const a = Math.min(120, Math.max(72, Math.round(age)))
    const divisor = UNIFORM_TABLE[a]
    const rmd = balance / divisor
    const pct = (rmd / Math.max(1, balance)) * 100
    return { age: a, divisor, rmd, pct, monthly: rmd / 12, penalty: rmd * 0.25 }
  }, [age, balance])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Age you reach this year" value={age} onChange={setAge} suffix="yrs" />
          <Field label="Traditional IRA/401(k) balance on prior Dec 31" value={balance} onChange={setBalance} prefix="$" />
          <p className="text-xs text-muted-foreground">
            IRS Uniform Lifetime Table (Pub. 590-B, Appendix B, Table III — divisors in effect since
            2022 under T.D. 9930). Applies to most owners. If your sole beneficiary is a spouse more
            than 10 years younger, you use Table II (joint life) instead and your RMD is lower.
            RMDs begin at age 73 (born 1951–1959) or 75 (born 1960+).
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Required minimum distribution" value={usd(r.rmd, 2)} />
          <Result label={`Divisor at age ${r.age}`} value={num(r.divisor, 1)} />
          <Result label="RMD as % of balance" value={`${num(r.pct, 2)}%`} />
          <Result label="Monthly equivalent" value={usd(r.monthly, 2)} />
          <Result label="Penalty if you skip it (25% excise)" value={usd(r.penalty)} />
          <p className="text-sm text-muted-foreground">
            Multiple IRAs: compute each separately, but you may take the total from any one. Your
            first RMD can wait until April 1 of the following year — but then you take two RMDs that
            year, which can stack up taxable income. The 25% excise drops to 10% if corrected promptly.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Social Security Claiming Breakeven ---------------- */

// PIA adjustments for FRA 67 (born 1960+): 62 → −30%, 70 → +24% (8%/yr delayed credits)
function ssBenefit(pia: number, claimAge: number): number {
  if (claimAge <= 67) {
    const monthsEarly = Math.round((67 - claimAge) * 12)
    const first36 = Math.min(36, monthsEarly)
    const beyond = Math.max(0, monthsEarly - 36)
    return pia * (1 - (first36 * (5 / 9 / 100) + beyond * (5 / 12 / 100)))
  }
  return pia * (1 + 0.08 * (claimAge - 67))
}

export function SsBreakevenCalc(_props: CalcProps) {
  const [pia, setPia] = useNumber(2000)
  const [ageA, setAgeA] = useState(62)
  const [ageB, setAgeB] = useState(70)

  const r = useMemo(() => {
    const benA = ssBenefit(pia, ageA)
    const benB = ssBenefit(pia, ageB)
    const early = Math.min(ageA, ageB)
    const late = Math.max(ageA, ageB)
    const benEarly = ssBenefit(pia, early)
    const benLate = ssBenefit(pia, late)
    // cumulative totals from claiming age to age 100, nominal (no COLA — real-dollar comparison)
    let breakeven: number | null = null
    for (let x = late; x <= 100; x++) {
      const cumEarly = benEarly * 12 * (x - early)
      const cumLate = benLate * 12 * (x - late)
      if (cumLate >= cumEarly) {
        breakeven = x
        break
      }
    }
    const at85Early = benEarly * 12 * (85 - early)
    const at85Late = benLate * 12 * (85 - late)
    return { benA, benB, early, late, benEarly, benLate, breakeven, at85Early, at85Late }
  }, [pia, ageA, ageB])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Full retirement age (67) benefit (PIA)" value={pia} onChange={setPia} prefix="$" suffix="/mo" />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Compare claiming ages</label>
            <div className="flex gap-2">
              <select
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={ageA}
                onChange={(e) => setAgeA(parseInt(e.target.value))}
              >
                {[62, 63, 64, 65, 66, 67, 68, 69, 70].map((a) => (
                  <option key={a} value={a}>Age {a}</option>
                ))}
              </select>
              <select
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={ageB}
                onChange={(e) => setAgeB(parseInt(e.target.value))}
              >
                {[62, 63, 64, 65, 66, 67, 68, 69, 70].map((a) => (
                  <option key={a} value={a}>Age {a}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            SSA rules for FRA 67 (born 1960+): −5/9% per month for the first 36 months early, −5/12%
            per month beyond; +8% per year delayed past 67 until 70. Breakeven computed in real
            dollars (no COLA, no discounting — both sides inflate together).
          </p>
        </div>
        <div className="space-y-3">
          <Result big label={`Monthly at ${ageA}`} value={usd(r.benA, 0)} />
          <Result big label={`Monthly at ${ageB}`} value={usd(r.benB, 0)} />
          {r.breakeven !== null ? (
            <Result label="Breakeven age (later claim pulls ahead)" value={`Age ${r.breakeven}`} />
          ) : (
            <Result label="Breakeven age" value="Never before 100" />
          )}
          <Result label={`Lifetime total at 85 — claim ${r.early}`} value={usd(r.at85Early)} />
          <Result label={`Lifetime total at 85 — claim ${r.late}`} value={usd(r.at85Late)} />
          <p className="text-sm text-muted-foreground">
            {r.breakeven !== null
              ? `Live past ${r.breakeven} and delaying wins; die before it and claiming early was better. Median life expectancy at 62 is roughly 20 more years for men, 23 for women — past most breakevens — but health, spouse benefits, and cash needs all argue their own cases.`
              : 'With these ages, the later claim never catches up before age 100.'}{' '}
            This is the money-only view; survivor benefits and portfolio drawdown can shift the answer.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- Safe Withdrawal Rate ---------------- */

export function SafeWithdrawalCalc(_props: CalcProps) {
  const [portfolio, setPortfolio] = useNumber(1000000)
  const [rate, setRate] = useNumber(4)
  const [returnRate, setReturnRate] = useNumber(6)
  const [inflation, setInflation] = useNumber(3)

  const r = useMemo(() => {
    let bal = portfolio
    let withdrawal = portfolio * (rate / 100)
    const firstYear = withdrawal
    let years = 0
    const maxYears = 60
    while (bal > 0 && years < maxYears) {
      bal = bal * (1 + returnRate / 100) - withdrawal
      withdrawal *= 1 + inflation / 100
      if (bal > 0) years++
    }
    return { firstYear, monthly: firstYear / 12, years, finalBal: Math.max(0, bal), sustainable: years >= maxYears }
  }, [portfolio, rate, returnRate, inflation])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Portfolio at retirement" value={portfolio} onChange={setPortfolio} prefix="$" />
          <Field label="Initial withdrawal rate" value={rate} onChange={setRate} suffix="%/yr" />
          <Field label="Assumed annual return" value={returnRate} onChange={setReturnRate} suffix="%" />
          <Field label="Inflation (withdrawals rise)" value={inflation} onChange={setInflation} suffix="%" />
          <p className="text-xs text-muted-foreground">
            The 4% rule (Trinity study): withdraw 4% of the starting portfolio in year one, raise it
            with inflation each year; historically that survived nearly every 30-year window since
            1926. This is a straight-line simulation — real returns arrive out of order, which is why
            sequence-of-returns risk, not average return, is the real killer.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Year-one withdrawal" value={usd(r.firstYear)} />
          <Result label="Monthly equivalent" value={usd(r.monthly)} />
          <Result
            label="Portfolio lasts"
            value={r.sustainable ? '60+ years (sustainable at these rates)' : `${num(r.years, 0)} years`}
          />
          {!r.sustainable && (
            <Result label="Depleted at" value={`year ${num(r.years, 0)}`} />
          )}
          <p className="text-sm text-muted-foreground">
            {r.sustainable
              ? `At ${num(returnRate, 1)}% return against ${num(inflation, 1)}% inflation, the portfolio compounds faster than withdrawals drain it.`
              : `At ${num(returnRate, 1)}% return against ${num(inflation, 1)}% inflation, the math runs out in year ${num(r.years, 0)} — drop the rate, raise the return assumption carefully, or plan a spending cut.`}{' '}
            Guardrail: if the portfolio falls 20% early in retirement, cut spending 10% — flexibility is
            what separates surviving the 1966 window from not.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- 401(k) Contribution & Match ---------------- */

// IRS Notice 2025-67 (2026 limits): deferral $24,500; catch-up $8,000 (age 50+);
// $11,250 (ages 60–63); §415(c) annual additions cap $72,000 (match doesn't count against deferral limit).
const K401_LIMITS: Record<string, number> = { under50: 24500, age50: 32500, age60: 35750 }

export function K401Calc(_props: CalcProps) {
  const [salary, setSalary] = useNumber(85000)
  const [pct, setPct] = useNumber(10)
  const [bracket, setBracket] = useState('under50')
  const [matchPct, setMatchPct] = useNumber(50)
  const [matchUpTo, setMatchUpTo] = useNumber(6)
  const [taxRate, setTaxRate] = useNumber(22)
  const [freq, setFreq] = useState('26')

  const periods = Number(freq) || 26

  const r = useMemo(() => {
    const limit = K401_LIMITS[bracket]
    const raw = salary * (pct / 100)
    const contrib = Math.min(raw, limit)
    const capped = raw > limit + 0.005
    // Employer match: matchPct% of the first matchUpTo% of salary deferred. Match does NOT count against the §402(g) deferral limit.
    const match = (Math.min(pct, matchUpTo) / 100) * salary * (matchPct / 100)
    const matchFull = (matchUpTo / 100) * salary * (matchPct / 100)
    const leftOnTable = Math.max(0, matchFull - match)
    const taxSaved = contrib * (taxRate / 100)
    const netCost = contrib - taxSaved
    const additions = contrib + match
    const overAdditions = additions > 72000
    const maxPct = salary > 0 ? (limit / salary) * 100 : 0
    return { limit, contrib, capped, match, leftOnTable, taxSaved, netCost, additions, overAdditions, maxPct, perCheck: contrib / periods }
  }, [salary, pct, bracket, matchPct, matchUpTo, taxRate, periods])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Annual salary" value={salary} onChange={setSalary} prefix="$" />
          <Field label="Your contribution" value={pct} onChange={setPct} suffix="%" step="0.5" />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Age bracket (2026 limit)</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={bracket}
              onChange={(e) => setBracket(e.target.value)}
            >
              <option value="under50">Under 50 — $24,500</option>
              <option value="age50">50–59 or 64+ — $32,500 with catch-up</option>
              <option value="age60">60–63 — $35,750 with super catch-up</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Employer matches" value={matchPct} onChange={setMatchPct} suffix="%" />
            <Field label="Of first % of salary" value={matchUpTo} onChange={setMatchUpTo} suffix="%" step="0.5" />
          </div>
          <Field label="Marginal tax rate (fed + state)" value={taxRate} onChange={setTaxRate} suffix="%" step="1" />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Pay frequency</label>
            <select
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
            >
              <option value="52">Weekly (52)</option>
              <option value="26">Biweekly (26)</option>
              <option value="24">Semi-monthly (24)</option>
              <option value="12">Monthly (12)</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          <Result big label="Your annual contribution" value={usd(r.contrib, 0)} />
          {r.capped && <Result label="IRS deferral cap reached" value={`Capped at ${usd(r.limit, 0)}`} />}
          <Result label="Per paycheck" value={usd(r.perCheck, 2)} />
          <Result label="Employer match (free money)" value={usd(r.match, 0)} />
          {r.leftOnTable > 0.005 && <Result label="Match left on the table" value={usd(r.leftOnTable, 0)} />}
          <Result label="Tax saved this year (pre-tax)" value={usd(r.taxSaved, 0)} />
          <Result label="Real take-home cost" value={usd(r.netCost, 0)} />
          <Result label="Total into the plan (you + match)" value={usd(r.additions, 0)} />
          <Result label={`% of salary to max the ${usd(r.limit, 0)} limit`} value={`${num(r.maxPct, 1)}%`} />
          {r.overAdditions && (
            <Result label="§415(c) warning" value="Over $72,000 annual-additions cap" />
          )}
          <p className="text-sm text-muted-foreground">
            2026 IRS limits (Notice 2025-67): $24,500 elective deferral, +$8,000 catch-up at 50+, +$11,250
            at ages 60–63. The employer match does not count against your deferral limit — it counts only
            toward the $72,000 total annual-additions cap. Contributing {num(pct, 1)}% of {usd(salary, 0)}{' '}
            defers {usd(r.contrib, 0)} but costs only {usd(r.netCost, 0)} of take-home at a {num(taxRate, 0)}%
            marginal rate — the tax saving funds the rest. Contributing under the match threshold is turning
            down part of your pay.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const RETIRE_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  '401k-contribution-calculator': K401Calc,
  'rmd-calculator': RmdCalc,
  'social-security-breakeven-calculator': SsBreakevenCalc,
  'safe-withdrawal-calculator': SafeWithdrawalCalc,
}
