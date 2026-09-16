import { useParams, Link } from 'react-router'
import { CALCULATORS } from '@/data/calculators'
import { CALC_COMPONENTS } from '@/calcs'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'

export default function CalculatorPage() {
  const { slug } = useParams()
  const meta = CALCULATORS.find((c) => c.slug === slug)
  const Calc = slug ? CALC_COMPONENTS[slug] : undefined

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

  const related = CALCULATORS.filter((c) => c.slug !== meta.slug && c.category === meta.category)

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
      <Calc />

      <AdSlot />

      <article className="prose-neutral mt-10 max-w-3xl space-y-8">
        <section>
          <h2 className="mb-2 text-2xl font-bold">About this calculator</h2>
          <p className="text-muted-foreground">{meta.intro}</p>
        </section>

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
