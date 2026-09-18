import { useParams } from 'react-router'
import { CALCULATORS } from '@/data/calculators'
import { VARIANTS } from '@/data/variants'
import { CALC_COMPONENTS } from '@/calcs'
import { MORE_CALC_COMPONENTS } from '@/calcs/more'
import { NICHE_CALC_COMPONENTS } from '@/calcs/niche'
import { SPORTS_CALC_COMPONENTS } from '@/calcs/sports'
import { CONSTRUCTION_CALC_COMPONENTS } from '@/calcs/construction'
import { TRADES_CALC_COMPONENTS } from '@/calcs/trades'
import { BID_CALC_COMPONENTS } from '@/calcs/bidsheet'
import { RE_CALC_COMPONENTS } from '@/calcs/realestate'
import { SALES_CALC_COMPONENTS } from '@/calcs/sales'
import { RESTAURANT_CALC_COMPONENTS } from '@/calcs/restaurant'
import { PaycheckCalc } from '@/calcs/paycheck'
import type { CalcProps } from '@/calcs'

const SITE = 'https://calcstack-eight.vercel.app'
const ALL_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  ...CALC_COMPONENTS,
  ...MORE_CALC_COMPONENTS,
  ...NICHE_CALC_COMPONENTS,
  ...SPORTS_CALC_COMPONENTS,
  ...CONSTRUCTION_CALC_COMPONENTS,
  ...TRADES_CALC_COMPONENTS,
  ...BID_CALC_COMPONENTS,
  ...RE_CALC_COMPONENTS,
  ...SALES_CALC_COMPONENTS,
  ...RESTAURANT_CALC_COMPONENTS,
  'paycheck-calculator': PaycheckCalc,
}

/**
 * Standalone embeddable widget: renders just the calculator, framed for
 * iframes, with a branded link back to the full page (our backlink engine).
 */
export default function EmbedPage() {
  const { slug } = useParams()
  const variant = VARIANTS.find((v) => v.slug === slug)
  const meta = CALCULATORS.find((c) => c.slug === slug) ?? variant
  const Calc = (variant ? ALL_COMPONENTS[variant.baseSlug] : slug ? ALL_COMPONENTS[slug] : undefined)

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
          <Calc presets={variant?.presets} />
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
