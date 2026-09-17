import { useParams, Link } from 'react-router'
import { PERSONAS } from '@/data/personas'
import { CALCULATORS } from '@/data/calculators'
import { VARIANTS } from '@/data/variants'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'
import { Card, CardContent } from '@/components/ui/card'

const ALL_PAGES = [...CALCULATORS, ...VARIANTS]

export default function PersonaPage() {
  const { slug } = useParams()
  const p = PERSONAS.find((x) => x.slug === slug)

  if (!p) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          <Link to="/" className="text-primary underline">Back to CalcStack</Link>
        </p>
      </div>
    )
  }

  const calcs = p.calcSlugs
    .map((s) => ALL_PAGES.find((c) => c.slug === s))
    .filter((c): c is (typeof ALL_PAGES)[number] => c !== undefined)

  return (
    <>
      <Seo title={p.title} description={p.description} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: p.faq.map((f) => ({
              '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">CalcStack</Link>
        <span className="mx-2">/</span><span>Toolkits</span>
        <span className="mx-2">/</span><span className="text-foreground">{p.job}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Calculators for {p.job}</h1>
      <p className="mb-8 max-w-3xl text-lg text-muted-foreground">{p.hero}</p>

      <section className="mb-8 rounded-xl border bg-card p-5">
        <h2 className="mb-3 font-semibold">The questions these tools answer</h2>
        <ul className="space-y-2 text-muted-foreground">
          {p.questions.map((q) => (
            <li key={q} className="flex gap-2"><span className="text-primary">→</span>{q}</li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calcs.map((c) => (
          <Link key={c.slug} to={`/calculators/${c.slug}`}>
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <CardContent className="p-5">
                <p className="font-semibold">{c.shortTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <AdSlot />

      <article className="mt-10 max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        {p.faq.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </article>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Toolkits for other professions</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.filter((x) => x.slug !== p.slug).map((x) => (
            <li key={x.slug}>
              <Link to={`/for/${x.slug}`} className="text-primary underline-offset-4 hover:underline">
                {x.job} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AffiliateCard items={DEFAULT_AFFILIATES} />
    </>
  )
}
