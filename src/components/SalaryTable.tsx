import { SALARIES } from '@/data/stats'
import { usd } from '@/lib/calc'

/** Salary-by-job table — used on the data page AND the embed widget. */
export function SalaryTable({ compact = false }: { compact?: boolean }) {
  const rows = [...SALARIES].sort((a, b) => b.pay - a.pay)
  return (
    <div className={`overflow-x-auto rounded-lg border ${compact ? 'max-h-[480px] overflow-y-auto' : ''}`}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted">
          <tr>
            <th className="p-2 text-left">Occupation</th>
            <th className="p-2 text-right">Typical salary*</th>
            <th className="p-2 text-right">≈ Hourly</th>
            {!compact && <th className="p-2 text-right">≈ Monthly</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.job} className="border-t hover:bg-muted/40">
              <td className="p-2 font-medium">{r.job}</td>
              <td className="p-2 text-right font-semibold text-primary">{usd(r.pay)}</td>
              <td className="p-2 text-right">{usd(r.pay / 2080, 2)}</td>
              {!compact && <td className="p-2 text-right text-muted-foreground">{usd(r.pay / 12)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
