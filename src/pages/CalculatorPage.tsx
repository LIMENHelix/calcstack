import { useParams, Link } from 'react-router'
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
import { TRAINER_CALC_COMPONENTS } from '@/calcs/trainer'
import { LAWN_CALC_COMPONENTS } from '@/calcs/lawn'
import { GIG_CALC_COMPONENTS } from '@/calcs/gig'
import { PaycheckCalc } from '@/calcs/paycheck'
import type { CalcProps } from '@/calcs'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'
import { EmbedSnippet } from '@/components/EmbedSnippet'
import { WHY_USE } from '@/data/why'

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
  ...TRAINER_CALC_COMPONENTS,
  ...LAWN_CALC_COMPONENTS,
  ...GIG_CALC_COMPONENTS,
  'paycheck-calculator': PaycheckCalc,
}

export default function CalculatorPage() {
  const { slug } = useParams()
  const core = CALCULATORS.find((c) => c.slug === slug)
  const variant = VARIANTS.find((v) => v.slug === slug)
  const meta = core ?? variant
  const baseSlug = variant ? variant.baseSlug : slug
  const Calc = baseSlug ? ALL_COMPONENTS[baseSlug] : undefined

  if (!meta || !Calc) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Calculator not found</h1>
        <p className="mt-2 text-muted-foreground">
          <Link to="/" className="text-primary underline">Back to all calculators</Link>
        </p>
      </div>
    )
  }

  // Related: for variants, link the parent + sibling variants; for core pages,
  // same-category calculators + this page's own variants.
  const related = variant
    ? [
        ...CALCULATORS.filter((c) => c.slug === variant.parentSlug),
        ...VARIANTS.filter((v) => v.slug !== variant.slug && v.parentSlug === variant.parentSlug),
      ].slice(0, 6)
    : [
        ...CALCULATORS.filter((c) => c.slug !== meta.slug && c.category === meta.category),
        ...VARIANTS.filter((v) => v.parentSlug === meta.slug),
      ].slice(0, 6)

  return (
    <>
      <Seo title={meta.title} description={meta.description} />

      {/* JSON-LD FAQ schema for search rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: meta.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">CalcStack</Link>
        <span className="mx-2">/</span>
        <span>{meta.category}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{meta.shortTitle}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">{meta.shortTitle}</h1>
      <p className="mb-6 text-lg text-muted-foreground">{meta.tagline}</p>

      {/* Tool first — the calculator is the hero of the page */}
      <Calc presets={variant?.presets} stateSlug={variant?.stateSlug} />

      <AdSlot />

      <article className="prose-neutral mt-10 max-w-3xl space-y-8">
        <section>
          <h2 className="mb-2 text-2xl font-bold">About this calculator</h2>
          <p className="text-muted-foreground">{meta.intro}</p>
        </section>

        {(WHY_USE[meta.slug] ?? (variant ? WHY_USE[variant.baseSlug] : undefined)) && (
          <section>
            <h2 className="mb-2 text-2xl font-bold">Why people use this calculator</h2>
            <p className="text-muted-foreground">{WHY_USE[meta.slug] ?? (variant ? WHY_USE[variant.baseSlug] : undefined)}</p>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-2xl font-bold">How it works</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            {meta.howItWorks.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-bold">Frequently asked questions</h2>
          <div className="space-y-4">
            {meta.faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-1 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <AffiliateCard items={DEFAULT_AFFILIATES} />

      <EmbedSnippet slug={meta.slug} title={meta.shortTitle} />

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">Related calculators</h2>
          <ul className="space-y-1">
            {related.map((c) => (
              <li key={c.slug}>
                <Link to={`/calculators/${c.slug}`} className="text-primary underline-offset-4 hover:underline">
                  {c.shortTitle} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
