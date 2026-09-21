/* Sponsor feature banner — full-width sponsor slot with a Calcy endorsement.
   Relay and Kilswitch use it on the homepage; reusable for future paying sponsors. */
export interface SponsorProps {
  name: string
  headline: string
  blurb: string
  cta: string
  href: string
  calcyLine: string
  calcyPose?: 'calcy.png' | 'calcy-celebrate.png' | 'calcy-thinking.png' | 'calcy-warning.png'
  images: { img: string; label: string }[]
  tone?: string // tailwind gradient tail, e.g. 'to-amber-50 dark:to-amber-950/20'
}

const BASE = import.meta.env.BASE_URL

export function SponsorFeature({
  name,
  headline,
  blurb,
  cta,
  href,
  calcyLine,
  calcyPose = 'calcy-celebrate.png',
  images,
  tone = 'to-amber-50 dark:to-amber-950/20',
}: SponsorProps) {
  return (
    <section className={`my-10 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-background shadow-sm ${tone}`}>
      <p className="pt-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Featured sponsor
      </p>
      <div className="flex flex-col items-center gap-6 p-6 sm:p-8 lg:flex-row lg:gap-10">
        {/* Calcy endorses */}
        <div className="flex shrink-0 flex-col items-center gap-2 lg:w-64">
          <img
            src={`${BASE}${calcyPose}`}
            alt="Calcy, the CalcStack mascot"
            className="w-24 drop-shadow-lg sm:w-28"
            width="112"
            height="112"
            loading="lazy"
          />
          <div className="relative rounded-2xl rounded-tl-sm border border-primary/30 bg-background/80 px-4 py-2.5 text-center text-sm shadow-sm">
            <span className="font-semibold text-primary">Calcy says: </span>
            <span className="text-foreground/90">{calcyLine}</span>
          </div>
        </div>

        {/* Copy + CTA */}
        <div className="min-w-0 flex-1 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{name}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{headline}</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground sm:text-base lg:mx-0">
            {blurb}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {cta} →
          </a>
        </div>

        {/* Product strip */}
        <div className="flex shrink-0 items-center gap-3">
          {images.map((p) => (
            <a key={p.img} href={href} target="_blank" rel="noopener noreferrer" className="group" title={p.label}>
              <img
                src={p.img}
                alt={`${name} — ${p.label}`}
                loading="lazy"
                className={`h-28 w-24 rounded-lg border bg-white shadow-sm transition-transform group-hover:-translate-y-1 sm:h-36 sm:w-32 ${p.img.endsWith('.svg') ? 'object-contain p-2' : 'object-cover'}`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RelayFeature() {
  return (
    <SponsorFeature
      name="Relay"
      headline="Relay — The Everyday Edit"
      blurb="Coffee ritual gear, everyday clothing, comfort finds, and home goods — the few things you use every single day, thoughtfully selected so you buy once and buy right."
      cta="Shop the edit"
      href="https://limenhelix.com/relay"
      calcyLine="I ran the numbers — brewing the good stuff at home pays for itself in about 47 mornings. Relay's picks pass my math. ✅"
      calcyPose="calcy-celebrate.png"
      images={[
        { img: `${BASE}ads/relay-coffee.jpg`, label: 'Coffee ritual' },
        { img: `${BASE}ads/relay-mug.jpg`, label: 'The details' },
        { img: `${BASE}ads/relay-crewneck.jpg`, label: 'Everyday style' },
      ]}
      tone="to-amber-50 dark:to-amber-950/20"
    />
  )
}

export function KillswitchFeature() {
  return (
    <SponsorFeature
      name="Kilswitch Websites"
      headline="Your business website — free, live today"
      blurb="Kilswitch builds your business website free — yours to keep, usually live the same day. No retainers, no ten-email quotes, no waiting three weeks for a homepage."
      cta="Get your free site"
      href="https://www.killswitchwebsites.com"
      calcyLine="A free website, live the same day? That's $0 cost against everything to gain — the easiest division problem I've ever solved. ✅"
      calcyPose="calcy-thinking.png"
      images={[{ img: `${BASE}ads/killswitch-og.svg`, label: 'Free business websites' }]}
      tone="to-sky-50 dark:to-sky-950/20"
    />
  )
}
