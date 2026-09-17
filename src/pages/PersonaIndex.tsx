import { Link } from 'react-router'
import { PERSONAS } from '@/data/personas'
import { Seo } from '@/components/Seo'
import { Card, CardContent } from '@/components/ui/card'

export default function PersonaIndex() {
  return (
    <>
      <Seo
        title="Calculators by Profession — Free Tools for Your Job"
        description="Free calculator toolkits curated by profession: freelancers, nurses, teachers, engineers, truck drivers, contractors, students, retirees, and more. No signup."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Calculator toolkits by profession',
            itemListElement: PERSONAS.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `Calculators for ${p.job}`,
              url: `https://calcstack-eight.vercel.app/for/${p.slug}`,
            })),
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">CalcStack</Link>
        <span className="mx-2">/</span><span className="text-foreground">Toolkits</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Calculators for your job</h1>
      <p className="mb-8 max-w-3xl text-lg text-muted-foreground">
        Every profession has its own money questions. Each toolkit below collects the exact
        calculators for how you actually earn, spend, and save — no signup, no paywall.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((p) => (
          <Link key={p.slug} to={`/for/${p.slug}`}>
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <CardContent className="p-5">
                <p className="font-semibold">{p.job}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.questions[0]}</p>
                <p className="mt-2 text-xs text-primary">{p.calcSlugs.length} curated tools →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Your profession missing? The <Link to="/directory" className="text-primary hover:underline">full directory</Link> lists
        every calculator on the site, and the search bar above finds any tool instantly.
      </p>
    </>
  )
}
