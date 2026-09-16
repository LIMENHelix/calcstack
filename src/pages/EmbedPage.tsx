import { useParams } from 'react-router'
import { CALCULATORS } from '@/data/calculators'
import { CALC_COMPONENTS } from '@/calcs'
import { MORE_CALC_COMPONENTS } from '@/calcs/more'

const SITE = 'https://calcstack-eight.vercel.app'

/**
 * Standalone embeddable widget: renders just the calculator, framed for
 * iframes, with a branded link back to the full page (our backlink engine).
 */
export default function EmbedPage() {
  const { slug } = useParams()
  const meta = CALCULATORS.find((c) => c.slug === slug)
  const Calc = slug ? (CALC_COMPONENTS[slug] ?? MORE_CALC_COMPONENTS[slug]) : undefined

  if (!meta || !Calc) {
    return <div className="p-6 text-sm">Unknown calculator.</div>
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-900">
      <div className="rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <a
            href={`${SITE}/calculators/${meta.slug}`}
            target="_blank"
            rel="noopener"
            className="text-sm font-semibold text-emerald-800 hover:underline"
          >
            {meta.shortTitle}
          </a>
        </div>
        <div className="p-2">
          <Calc />
        </div>
        <div className="border-t border-slate-100 px-4 py-2 text-right">
          <a
            href={`${SITE}/calculators/${meta.slug}`}
            target="_blank"
            rel="noopener"
            className="text-xs text-slate-400 hover:text-emerald-800"
          >
            Powered by CalcStack — free calculators
          </a>
        </div>
      </div>
    </div>
  )
}
