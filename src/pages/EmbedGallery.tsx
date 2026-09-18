import { useState } from 'react'
import { Link } from 'react-router'
import { CALCULATORS, CATEGORIES } from '@/data/calculators'
import { Seo } from '@/components/Seo'
import { Card, CardContent } from '@/components/ui/card'

const SITE = 'https://calcstack-eight.vercel.app'

/**
 * Embed gallery: the webmaster-facing showcase of every embeddable calculator.
 * This page is both the outreach destination and an SEO page in its own right.
 */
export default function EmbedGallery() {
  const [copied, setCopied] = useState<string | null>(null)

  const embedCode = (slug: string, title: string) =>
    `<iframe src="${SITE}/embed/${slug}" width="100%" height="680" frameborder="0" style="border:0;border-radius:12px;" title="${title} — CalcStack" loading="lazy"></iframe>`

  const copy = async (slug: string, title: string) => {
    try {
      await navigator.clipboard.writeText(embedCode(slug, title))
      setCopied(slug)
      setTimeout(() => setCopied((c) => (c === slug ? null : c)), 2000)
    } catch {
      /* clipboard blocked — the code is visible for manual copy */
    }
  }

  return (
    <>
      <Seo
        title="Free Embeddable Calculators for Your Website — CalcStack"
        description="Embed any of our free calculators on your site with one iframe: mortgage, paycheck, business, fitness, and engineering tools. No signup, no cost, fully functional."
      />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Embed these calculators on your site — free</h1>
      <p className="mb-2 max-w-3xl text-muted-foreground">
        Every calculator on CalcStack is embeddable with a single iframe. Your visitors get a fully
        functional tool — live results as they type — without leaving your page. Free forever, no
        signup, no tracking pixels; the math runs entirely in the visitor&apos;s browser.
      </p>
      <p className="mb-8 max-w-3xl text-sm text-muted-foreground">
        Works anywhere iframes are allowed: WordPress (Custom HTML block), Squarespace, Wix,
        Webflow, Ghost, or plain HTML. Each embed links back to CalcStack — that&apos;s the whole deal.
      </p>

      <section className="mb-10 rounded-lg border bg-muted/40 p-5">
        <h2 className="mb-2 font-semibold">How it looks</h2>
        <pre className="overflow-x-auto rounded-md bg-background p-3 text-xs">
{`<iframe src="${SITE}/embed/mortgage-payment-calculator"
        width="100%" height="680" style="border:0;border-radius:12px"
        title="Mortgage Payment Calculator — CalcStack" loading="lazy"></iframe>`}
        </pre>
        <p className="mt-2 text-xs text-muted-foreground">
          Swap the slug and title for any calculator below. Height 680px fits most tools; 560px works
          for compact ones.
        </p>
      </section>

      {CATEGORIES.map((cat) => {
        const calcs = CALCULATORS.filter((c) => c.category === cat)
        if (calcs.length === 0) return null
        return (
          <section key={cat} className="mb-10">
            <h2 className="mb-3 text-xl font-semibold">{cat}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {calcs.map((c) => (
                <Card key={c.slug}>
                  <CardContent className="space-y-2 p-4">
                    <p className="text-sm font-semibold">{c.shortTitle}</p>
                    <p className="text-xs text-muted-foreground">{c.tagline}</p>
                    <div className="flex gap-2 pt-1">
                      <Link
                        to={`/embed/${c.slug}`}
                        className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                        target="_blank"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() => copy(c.slug, c.shortTitle)}
                        className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                      >
                        {copied === c.slug ? 'Copied ✓' : 'Copy embed code'}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )
      })}

      <section className="mt-12 border-t pt-8 text-sm text-muted-foreground">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Embed FAQ</h2>
        <p className="mb-2">
          <strong>Is it really free?</strong> Yes. Embeds cost nothing and never will; the
          &quot;Powered by CalcStack&quot; link is the exchange.
        </p>
        <p className="mb-2">
          <strong>Do you track my visitors?</strong> No. The calculator runs locally in the
          visitor&apos;s browser; inputs never leave their device.
        </p>
        <p className="mb-2">
          <strong>Can I restyle it?</strong> The iframe inherits its own clean theme. Need a custom
          variant (your brand color, different defaults)? Reach out — we build custom variants for
          embed partners.
        </p>
        <p>
          <strong>Medium or other no-iframe platforms?</strong> They block iframes — link to the
          calculator page directly instead; it loads fast and works on mobile.
        </p>
      </section>
    </>
  )
}
