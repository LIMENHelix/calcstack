/* Relay feature banner — full-width homepage sponsor slot with Calcy endorsement. */
const BASE = import.meta.env.BASE_URL

const PRODUCTS = [
  { img: `${BASE}ads/relay-coffee.jpg`, label: 'Coffee ritual' },
  { img: `${BASE}ads/relay-mug.jpg`, label: 'The details' },
  { img: `${BASE}ads/relay-crewneck.jpg`, label: 'Everyday style' },
]

export function RelayFeature() {
  return (
    <section className="my-10 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-background to-amber-50 shadow-sm dark:to-amber-950/20">
      <p className="pt-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Featured sponsor
      </p>
      <div className="flex flex-col items-center gap-6 p-6 sm:p-8 lg:flex-row lg:gap-10">
        {/* Calcy endorses */}
        <div className="flex shrink-0 flex-col items-center gap-2 lg:w-64">
          <img
            src={`${BASE}calcy-celebrate.png`}
            alt="Calcy, the CalcStack mascot, celebrating"
            className="w-24 drop-shadow-lg sm:w-28"
            width="112"
            height="112"
            loading="lazy"
          />
          <div className="relative rounded-2xl rounded-tl-sm border border-primary/30 bg-background/80 px-4 py-2.5 text-center text-sm shadow-sm">
            <span className="font-semibold text-primary">Calcy says: </span>
            <span className="text-foreground/90">
              I ran the numbers — brewing the good stuff at home pays for itself in about 47 mornings.
              Relay&rsquo;s picks pass my math. ✅
            </span>
          </div>
        </div>

        {/* Copy + CTA */}
        <div className="min-w-0 flex-1 text-center lg:text-left">
          <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Relay — The Everyday Edit
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground sm:text-base lg:mx-0">
            Coffee ritual gear, everyday clothing, comfort finds, and home goods — the few things
            you use every single day, thoughtfully selected so you buy once and buy right.
          </p>
          <a
            href="https://limenhelix.com/relay"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Shop the edit →
          </a>
        </div>

        {/* Product strip */}
        <div className="flex shrink-0 gap-3">
          {PRODUCTS.map((p) => (
            <a
              key={p.img}
              href="https://limenhelix.com/relay"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              title={p.label}
            >
              <img
                src={p.img}
                alt={`Relay — ${p.label}`}
                loading="lazy"
                className="h-28 w-24 rounded-lg border bg-white object-cover shadow-sm transition-transform group-hover:-translate-y-1 sm:h-36 sm:w-32"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
