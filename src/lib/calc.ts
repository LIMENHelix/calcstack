export function usd(n: number, digits = 0): string {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function num(n: number, digits = 1): string {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** Monthly payment for an amortizing loan. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12
  const n = Math.round(years * 12)
  if (n <= 0 || principal <= 0) return 0
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

/** Months to pay off a loan at a given monthly payment. Returns Infinity if payment doesn't cover interest. */
export function monthsToPayoff(balance: number, annualRatePct: number, payment: number): number {
  const r = annualRatePct / 100 / 12
  if (payment <= balance * r) return Infinity
  if (r === 0) return balance / payment
  return -Math.log(1 - (balance * r) / payment) / Math.log(1 + r)
}
