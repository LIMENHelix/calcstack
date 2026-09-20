import { CALCULATORS, CATEGORIES } from '@/data/calculators'
import { Seo } from '@/components/Seo'
import { Card, CardContent } from '@/components/ui/card'

const MAILTO =
  'mailto:chrishubbel72@gmail.com?subject=Advertise%20on%20CalcStack&body=Business%20name%3A%0AWebsite%3A%0AWhich%20pages%20or%20professions%20fit%20your%20customers%3F%0A'

export default function Advertise() {
  const total = CALCULATORS.length
  return (
    <>
      <Seo
        title="Advertise on CalcStack — Reach People Actively Doing Money Math"
        description="Put your business in front of contractors, nurses, agents, trainers, and owners at the exact moment they price a job, a paycheck, or a purchase."
      />
      <section className="mx-auto max-w-3xl py-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your customers are here doing math. <span className="text-primary">Be the answer next to it.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          CalcStack runs {total} free calculators used by contractors writing bids, nurses comparing contracts,
          agents running net sheets, trainers programming clients, and owners pricing their services. Every visitor
          arrives with a purchase decision in progress — that is the moment your business should appear.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="p-5 text-center">
            <p className="text-3xl font-extrabold text-primary">{total}</p>
            <p className="mt-1 text-sm text-muted-foreground">live calculator pages</p>
          </CardContent></Card>
          <Card><CardContent className="p-5 text-center">
            <p className="text-3xl font-extrabold text-primary">{CATEGORIES.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">profession & money categories</p>
          </CardContent></Card>
          <Card><CardContent className="p-5 text-center">
            <p className="text-3xl font-extrabold text-primary">100%</p>
            <p className="mt-1 text-sm text-muted-foreground">intent-driven visits — every page is a decision</p>
          </CardContent></Card>
        </div>

        <h2 className="mt-10 text-xl font-semibold">What you can book</h2>
        <div className="mt-4 space-y-4">
          <Card><CardContent className="p-5">
            <p className="font-semibold">Category sponsorship</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your business featured across every calculator in one profession — for example, every contractor bid
              tool, or every nursing pay tool. The most targeted slot on the site.
            </p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <p className="font-semibold">Single-calculator placement</p>
            <p className="mt-1 text-sm text-muted-foreground">
              One tool, your card. Perfect for local and niche businesses — a concrete supplier on the slab calculator,
              a payroll service on the paycheck tools.
            </p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <p className="font-semibold">Site-wide rotation</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your card rotates through unfilled slots across the whole site while the network ramps up — maximum
              reach at early-bird pricing.
            </p>
          </CardContent></Card>
        </div>

        <h2 className="mt-10 text-xl font-semibold">Why early matters</h2>
        <p className="mt-3 text-muted-foreground">
          The site is growing by dozens of calculators a month and every page is indexed and searchable. Early
          sponsors lock founding rates, get first pick of categories, and their cards age into the pages as traffic
          compounds. There is no ad network markup here — you deal directly with the owner.
        </p>

        <div className="mt-10 rounded-xl border-2 border-primary/40 bg-primary/5 p-6 text-center">
          <p className="text-lg font-semibold">Put your business here.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us who you want to reach and we will reply with placement options and founding rates.
          </p>
          <a
            href={MAILTO}
            className="mt-4 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Message us to advertise →
          </a>
        </div>
      </section>
    </>
  )
}
