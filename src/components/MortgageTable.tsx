import { useState } from 'react'
import { Link } from 'react-router'
import { HOME_VALUES } from '@/data/stats'
import { monthlyPayment, usd } from '@/lib/calc'

const SITE = 'https://calcstack.app/calcstack'

/** Interactive mortgage-by-state table — used on the data page AND the embed widget. */
export function MortgageTable({ compact = false }: { compact?: boolean }) {
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const rows = HOME_VALUES.map((s) => {
    const principal = s.value * 0.8
    const pmt = monthlyPayment(principal, rate, years)
    return { ...s, principal, pmt, interest: pmt * years * 12 - principal }
  }).sort((a, b) => b.pmt - a.pmt)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border bg-card p-3">
        <label className="flex items-center gap-2 text-sm">
          Rate
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            className="h-8 w-20 rounded-md border border-input bg-transparent px-2 text-sm" />
          %
        </label>
        <label className="flex items-center gap-2 text-sm">
          Term
          <input type="number" value={years} onChange={(e) => setYears(parseFloat(e.target.value) || 30)}
            className="h-8 w-16 rounded-md border border-input bg-transparent px-2 text-sm" />
          yrs
        </label>
        <span className="text-xs text-muted-foreground">20% down · P&I only · table updates live</span>
      </div>
      <div className={`overflow-x-auto rounded-lg border ${compact ? 'max-h-[480px] overflow-y-auto' : ''}`}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted">
            <tr>
              <th className="p-2 text-left">State</th>
              <th className="p-2 text-right">Typical home*</th>
              {!compact && <th className="p-2 text-right">Loan (80%)</th>}
              <th className="p-2 text-right">Monthly P&I</th>
              {!compact && <th className="p-2 text-right">Total interest</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t hover:bg-muted/40">
                <td className="p-2 font-medium">
                  {compact ? (
                    <a href={`${SITE}/data/mortgage-payment-in/${r.slug}`} target="_blank" rel="noopener" className="hover:text-primary hover:underline">
                      {r.state}
                    </a>
                  ) : (
                    <Link to={`/data/mortgage-payment-in/${r.slug}`} className="hover:text-primary hover:underline">
                      {r.state}
                    </Link>
                  )}
                </td>
                <td className="p-2 text-right">{usd(r.value)}</td>
                {!compact && <td className="p-2 text-right">{usd(r.principal)}</td>}
                <td className="p-2 text-right font-semibold text-primary">{usd(r.pmt, 0)}</td>
                {!compact && <td className="p-2 text-right text-muted-foreground">{usd(r.interest)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
