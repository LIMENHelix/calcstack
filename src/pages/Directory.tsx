import { Link } from 'react-router'
import { CALCULATORS, CATEGORIES } from '@/data/calculators'
import { VARIANTS } from '@/data/variants'
import { HOME_VALUES } from '@/data/stats'
import { PERSONAS } from '@/data/personas'
import { Seo } from '@/components/Seo'
import { SearchBar } from '@/components/SearchBar'

/** Full directory: every page on the site, grouped and linked. */
export default function Directory() {
  const variantGroups = new Map<string, typeof VARIANTS>()
  for (const v of VARIANTS) {
    const list = variantGroups.get(v.parentSlug) ?? []
    list.push(v)
    variantGroups.set(v.parentSlug, list)
  }

  return (
    <>
      <Seo
        title="All Calculators & Tools — CalcStack Directory"
        description="Every calculator, tool, and data page on CalcStack: finance, freelance, tax by state, mortgage by state, health, and more. Free and instant."
      />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Everything on CalcStack</h1>
      <p className="mb-6 text-muted-foreground">
        {CALCULATORS.length + VARIANTS.length} calculators, {HOME_VALUES.length} state data pages, and
        our flagship tools — all free, all instant.
      </p>

      <SearchBar />

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Featured</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          <li><Link className="text-primary underline-offset-4 hover:underline" to="/tools/bill-analyzer">Bill Analyzer — paste bills, find overpayments ✦</Link></li>
          <li><Link className="text-primary underline-offset-4 hover:underline" to="/data/mortgage-payment-by-state">Average Mortgage Payment by State</Link></li>
          <li><Link className="text-primary underline-offset-4 hover:underline" to="/data/average-salary-by-job">Average Salary by Job</Link></li>
        </ul>
      </section>

      {CATEGORIES.map((cat) => {
        const core = CALCULATORS.filter((c) => c.category === cat)
        if (core.length === 0) return null
        return (
          <section key={cat} className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">{cat}</h2>
            <ul className="space-y-4">
              {core.map((c) => {
                const vars = variantGroups.get(c.slug) ?? []
                return (
                  <li key={c.slug}>
                    <Link to={`/calculators/${c.slug}`} className="font-medium text-primary underline-offset-4 hover:underline">
                      {c.shortTitle}
                    </Link>
                    <span className="ml-2 text-sm text-muted-foreground">{c.tagline}</span>
                    {vars.length > 0 && (
                      <ul className="mt-1.5 grid gap-1 pl-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        {vars.map((v) => (
                          <li key={v.slug}>
                            <Link to={`/calculators/${v.slug}`} className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
                              {v.shortTitle.replace(' Calculator', '')}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Toolkits by profession</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <li key={p.slug}>
              <Link to={`/for/${p.slug}`} className="text-primary underline-offset-4 hover:underline">
                {p.job} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Mortgage Payment by State</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {HOME_VALUES.map((h) => (
            <li key={h.slug}>
              <Link to={`/data/mortgage-payment-in/${h.slug}`} className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
                {h.state}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
