import { useParams } from 'react-router'
import { MortgageTable } from '@/components/MortgageTable'
import { SalaryTable } from '@/components/SalaryTable'

const SITE = 'https://calcstack.app/calcstack'

const TABLES: Record<string, { title: string; path: string; El: () => React.ReactElement }> = {
  'mortgage-by-state': {
    title: 'Average Mortgage Payment by State',
    path: '/data/mortgage-payment-by-state',
    El: () => <MortgageTable compact />,
  },
  'salary-by-job': {
    title: 'Average Salary by Job',
    path: '/data/average-salary-by-job',
    El: () => <SalaryTable compact />,
  },
}

/** Embeddable live data table — the backlink magnet version of our data pages. */
export default function EmbedTablePage() {
  const { name } = useParams()
  const t = name ? TABLES[name] : undefined
  if (!t) return <div className="p-6 text-sm">Unknown table.</div>

  return (
    <div className="min-h-screen bg-white p-3 text-slate-900">
      <div className="rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <a href={`${SITE}${t.path}`} target="_blank" rel="noopener"
            className="text-sm font-semibold text-emerald-800 hover:underline">
            {t.title}
          </a>
        </div>
        <div className="p-3">
          <t.El />
        </div>
        <div className="border-t border-slate-100 px-4 py-2 text-right">
          <a href={`${SITE}${t.path}`} target="_blank" rel="noopener"
            className="text-xs text-slate-400 hover:text-emerald-800">
            Live data by CalcStack — free calculators
          </a>
        </div>
      </div>
    </div>
  )
}
