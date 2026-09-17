// Reference computation for audit: recompute canonical defaults independently.
const fmt = (x) => Math.round(x * 100) / 100

// 1. Loan Payoff (fixed): 25k @8%, 5yr, +$100/mo
{
  const m = 8 / 100 / 12, n = 60
  const pmt = 25000 * m * Math.pow(1 + m, n) / (Math.pow(1 + m, n) - 1)
  const baseInterest = pmt * n - 25000
  const newPmt = pmt + 100
  let bal = 25000, newInt = 0, months = 0
  while (bal > 0.005) {
    const i = bal * m; newInt += i
    const pay = Math.min(newPmt, bal + i)
    bal = bal + i - pay; months++
  }
  console.log('LOAN PAYOFF: pmt=%s baseInt=%s newMonths=%d newInt=%s saved=%s timeSaved=%d',
    fmt(pmt), fmt(baseInterest), months, fmt(newInt), fmt(baseInterest - newInt), n - months)
}

// 2. Savings Goal (fixed APY): goal 30k, saved 2k, 24mo, 4.5% APY
{
  const m = Math.pow(1.045, 1 / 12) - 1
  const fvSaved = 2000 * Math.pow(1 + m, 24)
  const deposit = Math.max(0, (30000 - fvSaved) / ((Math.pow(1 + m, 24) - 1) / m))
  console.log('SAVINGS GOAL: monthlyRate=%s deposit=%s interest=%s',
    m.toFixed(6), fmt(deposit), fmt(30000 - (deposit * 24 + 2000)))
}

// 3. Compound Interest: 10k initial, $500/mo, 7%, 30y
{
  const m = 0.07 / 12, n = 360
  const fv = 10000 * Math.pow(1 + m, n) + 500 * (Math.pow(1 + m, n) - 1) / m
  console.log('COMPOUND: FV=%s', fmt(fv))
}

// 4. Mortgage flagship: 300k @6.5%, 30yr → P&I
{
  const m = 0.065 / 12, n = 360
  const pmt = 300000 * m * Math.pow(1 + m, n) / (Math.pow(1 + m, n) - 1)
  console.log('MORTGAGE: P&I=%s', fmt(pmt))
}

// 5. Paycheck KS $21k single 2026: fed brackets 10% to 12400, 12% to 50400; std ded 16100
//    KS: ded 5925 (SB1 2024), brackets 5.2% to 23000, 5.58% above
{
  const gross = 21000, ded = 16100
  const taxable = Math.max(0, gross - ded) // 4900 → all in 10%
  const fed = taxable * 0.10
  const ss = gross * 0.062, mc = gross * 0.0145
  const ksTaxable = Math.max(0, gross - 5925)
  const ks = Math.min(ksTaxable, 23000) * 0.052 + Math.max(0, ksTaxable - 23000) * 0.0558
  console.log('PAYCHECK KS 21k: fed=%s ss=%s mc=%s state=%s net=%s effRate=%s%',
    fmt(fed), fmt(ss), fmt(mc), fmt(ks), fmt(gross - fed - ss - mc - ks),
    ((fed + ss + mc + ks) / gross * 100).toFixed(1))
}

// 6. Paycheck TX $75k single 2026
{
  const gross = 75000, ded = 16100
  const t = gross - ded
  const fed = Math.min(t, 12400) * 0.10 + Math.max(0, t - 12400) * 0.12
  const ss = gross * 0.062, mc = gross * 0.0145
  console.log('PAYCHECK TX 75k: fed=%s net=%s', fmt(fed), fmt(gross - fed - ss - mc))
}

// 7. CKD carb-up (fixed): 180lb, 15% bf, 24h, moderate
{
  const lbmLb = 180 * 0.85, lbmKg = lbmLb * 0.453592
  const carbsLo = 5 * lbmKg, carbsHi = 6 * lbmKg
  const scaleLo = carbsLo * 0.6 * 4 / 453.592 + 1
  const scaleHi = carbsHi * 0.8 * 4 / 453.592 + 2
  console.log('CKD: lbm=%slb carbs=%s–%sg scaleJump=+%s–%s lb',
    fmt(lbmLb), fmt(carbsLo), fmt(carbsHi), scaleLo.toFixed(1), scaleHi.toFixed(1))
}

// 8. Calorie (Mifflin): 75kg, 175cm, 32, male
console.log('CALORIE: BMR=%s', fmt(10 * 75 + 6.25 * 175 - 5 * 32 + 5))

// 9. BMI: 180lb, 70in → 703*180/70^2
console.log('BMI:', fmt(703 * 180 / 4900))
