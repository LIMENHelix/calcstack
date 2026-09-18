import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Result, useNumber } from './index'
import { usd, num } from '@/lib/calc'

/* ---------------- Nurse Shift Differential & OT Pay ---------------- */

export function NurseShiftPayCalc() {
  const [rate, setRate] = useNumber(38)
  const [dayHrs, setDayHrs] = useNumber(24)
  const [nightHrs, setNightHrs] = useNumber(12)
  const [nightDiffPct, setNightDiffPct] = useNumber(12)
  const [otHrs, setOtHrs] = useNumber(4)

  const r = useMemo(() => {
    const dayPay = dayHrs * rate
    const nightPay = nightHrs * rate * (1 + nightDiffPct / 100)
    const otPay = otHrs * rate * 1.5
    const weekly = dayPay + nightPay + otPay
    const annual = weekly * 52
    const diffBonus = nightHrs * rate * (nightDiffPct / 100) * 52
    const otBonus = otHrs * rate * 0.5 * 52
    return { dayPay, nightPay, otPay, weekly, annual, diffBonus, otBonus }
  }, [rate, dayHrs, nightHrs, nightDiffPct, otHrs])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Base hourly rate" value={rate} onChange={setRate} prefix="$" />
        <Field label="Day-shift hours / week" value={dayHrs} onChange={setDayHrs} step="1" />
        <Field label="Night-shift hours / week" value={nightHrs} onChange={setNightHrs} step="1" />
        <Field label="Night differential" value={nightDiffPct} onChange={setNightDiffPct} suffix="%" />
        <Field label="Overtime hours / week (1.5×)" value={otHrs} onChange={setOtHrs} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Day pay (week)" value={usd(r.dayPay, 2)} />
        <Result label="Night pay w/ diff (week)" value={usd(r.nightPay, 2)} />
        <Result label="OT pay (week)" value={usd(r.otPay, 2)} />
        <Result big label="Weekly gross" value={usd(r.weekly, 2)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Annualized gross" value={usd(r.annual, 0)} />
        <Result label="Night diff adds per year" value={usd(r.diffBonus, 0)} />
        <Result label="OT premium adds per year" value={usd(r.otBonus, 0)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Weekly gross = day hours × rate + night hours × rate × (1 + differential) + OT hours × rate × 1.5.
        The differential and OT premium lines show what the extras are worth alone: at a 12% night diff,
        {' '}{num(nightHrs, 0)} night hours a week adds {usd(r.diffBonus, 0)} a year over straight days.
        Facilities pay differentials for evenings, nights, weekends, and charge duties — stack them all.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Teacher Step/Lane Salary + 10 vs 12 Month Pay ---------------- */

export function TeacherPayCalc() {
  const [base, setBase] = useNumber(48000)
  const [stepPct, setStepPct] = useNumber(2)
  const [lanePct, setLanePct] = useNumber(5)
  const [laneYear, setLaneYear] = useNumber(5)
  const [years, setYears] = useNumber(10)

  const r = useMemo(() => {
    const y = Math.max(1, Math.round(years))
    const laneOn = y >= Math.round(laneYear)
    const salary = base * Math.pow(1 + stepPct / 100, y - 1) * (laneOn ? 1 + lanePct / 100 : 1)
    const per10 = salary / 10
    const per12 = salary / 12
    const monthlySetAside = per10 - per12
    const growth = base > 0 ? ((salary / base) - 1) * 100 : 0
    return { y, salary, per10, per12, monthlySetAside, growth, laneOn }
  }, [base, stepPct, lanePct, laneYear, years])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Starting salary (year 1)" value={base} onChange={setBase} prefix="$" />
        <Field label="Annual step increase" value={stepPct} onChange={setStepPct} suffix="%" />
        <Field label="Lane change bump (e.g., master's)" value={lanePct} onChange={setLanePct} suffix="%" />
        <Field label="Lane change at year" value={laneYear} onChange={setLaneYear} step="1" />
        <Field label="Project to year" value={years} onChange={setYears} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result big label={`Salary at year ${r.y}`} value={usd(r.salary, 0)} />
        <Result label="Growth from year 1" value={`${num(r.growth, 1)}%`} />
        <Result label="Per check (10-month)" value={usd(r.per10, 2)} />
        <Result label="Per check (12-month)" value={usd(r.per12, 2)} />
      </div>
      <p className="text-sm text-muted-foreground">
        Salary = base × (1 + step)^(years − 1){r.laneOn ? ' × lane bump' : ''}. On a 10-month pay schedule, set
        aside {usd(r.monthlySetAside, 2)} per check to cover the two unpaid months — or ask payroll about the
        12-month spread option most districts offer. Lane changes (master's, credits) are the single biggest
        raise lever in teaching: {num(lanePct, 1)}% compounds with every future step.
      </p>
    </CardContent></Card>
  )
}

/* ---------------- Truck Driver CPM Pay ---------------- */

export function TruckDriverPayCalc() {
  const [cpm, setCpm] = useNumber(0.58)
  const [milesWk, setMilesWk] = useNumber(2500)
  const [weeks, setWeeks] = useNumber(48)
  const [dutyHrs, setDutyHrs] = useNumber(65)

  const r = useMemo(() => {
    const weekly = cpm * milesWk
    const annual = weekly * weeks
    const monthly = annual / 12
    const perDutyHr = dutyHrs > 0 ? weekly / dutyHrs : 0
    const mph = dutyHrs > 0 ? milesWk / dutyHrs : 0
    return { weekly, annual, monthly, perDutyHr, mph }
  }, [cpm, milesWk, weeks, dutyHrs])

  return (
    <Card><CardContent className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Pay per mile (CPM)" value={cpm} onChange={setCpm} prefix="$" />
        <Field label="Miles per week" value={milesWk} onChange={setMilesWk} step="1" />
        <Field label="Working weeks per year" value={weeks} onChange={setWeeks} step="1" />
        <Field label="On-duty hours per week" value={dutyHrs} onChange={setDutyHrs} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Result label="Weekly gross" value={usd(r.weekly, 2)} />
        <Result big label="Annual gross" value={usd(r.annual, 0)} />
        <Result label="Monthly average" value={usd(r.monthly, 0)} />
        <Result label="Per on-duty hour" value={`${usd(r.perDutyHr, 2)}/hr`} />
      </div>
      <p className="text-sm text-muted-foreground">
        CPM pay only counts rolling miles — at {num(r.mph, 1)} effective miles per on-duty hour, a {usd(cpm, 2)} CPM
        rate works out to {usd(r.perDutyHr, 2)} per hour of your life. Loading docks, inspections, and traffic are
        unpaid under pure CPM, which is why carriers advertise CPM and drivers count hours. Comparing a local
        hourly job? Convert it the same way — hourly × real hours — and compare like with like.
      </p>
    </CardContent></Card>
  )
}

export const CAREERS_CALC_COMPONENTS: Record<string, (props: import('./index').CalcProps) => React.ReactElement> = {
  'nurse-shift-pay-calculator': NurseShiftPayCalc,
  'teacher-pay-calculator': TeacherPayCalc,
  'truck-driver-pay-calculator': TruckDriverPayCalc,
}
