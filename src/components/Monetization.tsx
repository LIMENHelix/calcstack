import { useEffect, useRef } from 'react'

/**
 * Monetization slots. AdSlot is a drop-in container for an ad network
 * (AdSense/Ezoic/Raptive) once approved; AffiliateCard carries partner CTAs.
 * Swap the href values for real affiliate links once programs are approved.
 *
 * Domain day: set VITE_ADSENSE_CLIENT (ca-pub-...) and VITE_ADSENSE_SLOT in
 * Vercel env vars and every AdSlot on the site goes live — no code change.
 */
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined
const ADSENSE_SLOT = import.meta.env.VITE_ADSENSE_SLOT as string | undefined

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

function ensureAdsenseScript(client: string) {
  if (document.querySelector('script[data-adsense]')) return
  const s = document.createElement('script')
  s.async = true
  s.crossOrigin = 'anonymous'
  s.dataset.adsense = '1'
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
  document.head.appendChild(s)
}

// House ads keep the slots looking occupied until the network is approved.
// Rotate per slot so a page with two slots shows different businesses.
const BASE = import.meta.env.BASE_URL
const HOUSE_ADS = [
  {
    name: 'Kilswitch Websites',
    blurb: "We'll build your business website free — yours to keep, usually live the same day.",
    cta: 'Get your free site',
    href: 'https://www.killswitchwebsites.com',
    img: `${BASE}ads/killswitch-og.svg`,
    tone: 'from-sky-500/10',
    calcyLine: "Free website, live the same day — I checked their math. It adds up."
  },
  {
    name: 'Relay Supply',
    blurb: 'Coffee ritual gear, everyday clothing, comfort finds, and home goods — thoughtfully selected.',
    cta: 'Shop the edit',
    href: 'https://limenhelix.com/relay',
    img: `${BASE}ads/relay-coffee.jpg`,
    tone: 'from-amber-500/10',
    calcyLine: "The coffee gear is legit. I ran the cost-per-cup numbers myself."
  },
  {
    name: 'Tradier Brokerage',
    blurb: 'The brokerage powering Calcy\u2019s live quotes — open an account and trade the math yourself.',
    cta: 'Open an account',
    href: 'https://trade.tradier.com/raf-open/?mwr=christopher-793b',
    img: `${BASE}ads/tradier.jpg`,
    tone: 'from-emerald-500/10',
    calcyLine: "Their live quotes power my portfolio. I vouch for the data personally."
  },
  {
    name: 'All Access KC',
    blurb: 'The free local’s guide to Kansas City — real day-plans, parking tricks, and $370+ in mapped food rewards, updated weekly.',
    cta: 'Open the free guide',
    href: 'https://allaccesskc.com/',
    img: `${BASE}ads/allaccesskc.jpg`,
    tone: 'from-red-500/10',
    calcyLine: "A free guide carrying $1,000+ in real value — the ROI on free is my favorite number."
  },
  {
    name: 'Recursive Love',
    blurb: 'A calm, judgment-free community for parents of autistic children and autistic adults — evidence graded honestly, no fear-selling.',
    cta: 'Start here',
    href: 'https://www.recursivelove.com',
    img: `${BASE}ads/recursivelove.jpg`,
    tone: 'from-teal-500/10',
    calcyLine: "Evidence graded honestly, zero miracle cures, autistic voices first. This is what the internet should be."
  },
  {
    name: 'You can advertise here',
    blurb: 'Put your business in front of people actively doing money math. Drive real traffic — email chris@limenhelix.com.',
    cta: 'Advertise with us',
    href: '/advertise',
    tone: 'from-violet-500/10',
    calcyLine: "This spot gets seen by people mid-decision. Prime real estate — trust me, I am a calculator."
  },
]
let houseAdCounter = 0

export function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  const live = Boolean(ADSENSE_CLIENT && ADSENSE_SLOT)
  const pushed = useRef(false)
  const houseIdx = useRef(houseAdCounter++ % HOUSE_ADS.length)

  useEffect(() => {
    if (!live || pushed.current || !ADSENSE_CLIENT) return
    pushed.current = true
    ensureAdsenseScript(ADSENSE_CLIENT)
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // ad blockers throw here — stay silent, the slot just stays empty
    }
  }, [live])

  if (live) {
    return (
      <div className="my-8">
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  const ad = HOUSE_ADS[houseIdx.current]
  const inner = (
    <div>
      {'img' in ad && ad.img ? (
        <img
          src={ad.img}
          alt={ad.name}
          loading="lazy"
          className="h-32 w-full object-cover sm:h-40"
        />
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-primary/10 text-5xl font-extrabold text-primary sm:h-40">
          {ad.name.charAt(0)}
        </div>
      )}
      <div className="flex items-center gap-4 p-4 text-left sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold tracking-tight">{ad.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{ad.blurb}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs italic text-muted-foreground/80">
            <img src={`${BASE}calcy.png`} alt="" className="h-5 w-5" loading="lazy" />
            <span><span className="font-semibold not-italic text-primary">Calcy:</span> {ad.calcyLine}</span>
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm">
          {ad.cta} →
        </span>
      </div>
    </div>
  )
  return (
    <div className={`my-8 overflow-hidden rounded-xl border bg-gradient-to-br ${ad.tone} via-background to-background shadow-sm`}>
      <p className="pt-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">{label}</p>
      {ad.href ? (
        <a
          href={ad.href}
          {...(ad.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="block transition-all hover:brightness-95"
        >
          {inner}
        </a>
      ) : (
        <div>{inner}</div>
      )}
    </div>
  )
}

export function AffiliateCard({
  heading = 'Tools we recommend',
  items,
}: {
  heading?: string
  items: { name: string; blurb: string; href: string }[]
}) {
  return (
    <aside className="my-8 rounded-lg border bg-card p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {heading}
      </p>
      <p className="mb-4 text-xs text-muted-foreground">
        Affiliate links — we may earn a commission at no cost to you.
      </p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.name}>
            <a
              href={it.href}
              rel="sponsored nofollow"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {it.name} →
            </a>
            <span className="ml-2 text-sm text-muted-foreground">{it.blurb}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

/** Default affiliate lineup — replace hrefs with real program links. */
export const DEFAULT_AFFILIATES = [
  {
    name: 'High-yield savings comparison',
    blurb: 'Where the cash you calculated should actually sit.',
    href: '#affiliate-high-yield-savings',
  },
  {
    name: 'Business banking for freelancers',
    blurb: 'Separate your rate income from your spending.',
    href: '#affiliate-business-banking',
  },
  {
    name: 'Accounting software',
    blurb: 'Track the expenses you fed into the calculator.',
    href: '#affiliate-accounting',
  },
]

export interface AffiliateItem {
  name: string
  blurb: string
  href: string
}

/**
 * Category-matched affiliate lineups. A visitor running mortgage math should see
 * lender-marketplace CTAs, not freelancer banking — matching intent is where the
 * conversion rate lives. Replace placeholder hrefs with real program links as
 * applications get approved (see marketing/LAUNCH.md Phase 0).
 */
export const CATEGORY_AFFILIATES: Record<string, AffiliateItem[]> = {
  'Loans & Debt': [
    { name: 'Compare mortgage rates', blurb: 'The rate you just modeled — get it quoted by real lenders.', href: '#affiliate-mortgage-rates' },
    { name: 'Free credit score monitoring', blurb: 'Your score moves the rate more than the price does.', href: '#affiliate-credit-monitoring' },
    { name: 'Debt consolidation options', blurb: 'When the payoff calculator says the hole is deep.', href: '#affiliate-debt-consolidation' },
  ],
  'Savings & Investing': [
    { name: 'High-yield savings comparison', blurb: 'The growth you just projected deserves a real rate.', href: '#affiliate-high-yield-savings' },
    { name: 'Commission-free brokerage', blurb: 'Where compound interest stops being hypothetical.', href: 'https://trade.tradier.com/raf-open/?mwr=christopher-793b' },
    { name: 'CD rate comparison', blurb: 'Lock the rate when the goal has a date.', href: '#affiliate-cd-rates' },
  ],
  'Investing & Crypto': [
    { name: 'Regulated crypto exchange', blurb: 'If you are going to trade, fees are the first loss to control.', href: '#affiliate-crypto-exchange' },
    { name: 'Portfolio tracking app', blurb: 'See the ROI you calculated across everything you own.', href: '#affiliate-portfolio-tracker' },
    { name: 'Commission-free brokerage', blurb: 'The boring index fund usually wins the comparison.', href: 'https://trade.tradier.com/raf-open/?mwr=christopher-793b' },
  ],
  'Freelance & Career': [
    { name: 'Business banking for freelancers', blurb: 'Separate the rate income from the spending.', href: '#affiliate-business-banking' },
    { name: 'Invoicing & accounting software', blurb: 'Bill the hours this calculator just priced.', href: '#affiliate-accounting' },
    { name: 'LLC formation service', blurb: 'When the 1099 math starts beating the W-2.', href: '#affiliate-llc-formation' },
  ],
  'Everyday Money': [
    { name: 'Budgeting app', blurb: 'Put the numbers you just ran on autopilot.', href: '#affiliate-budgeting-app' },
    { name: 'High-yield savings comparison', blurb: 'The emergency fund should earn while it waits.', href: '#affiliate-high-yield-savings' },
    { name: 'Cash-back credit card comparison', blurb: 'Only if the balance gets paid — run it in the loan calculator first.', href: '#affiliate-cashback-card' },
  ],
  'Health & Life': [
    { name: 'HSA provider comparison', blurb: 'Invest the HSA you just projected — fees differ wildly.', href: '#affiliate-hsa-provider' },
    { name: 'Health insurance marketplace', blurb: 'Price the marketplace side of the COBRA comparison.', href: '#affiliate-health-marketplace' },
    { name: 'Term life insurance quotes', blurb: 'The income this math protects needs a backstop.', href: '#affiliate-life-insurance' },
  ],
  'Fitness & Sports': [
    { name: 'Training program app', blurb: 'Put the zones and numbers into a plan that adapts.', href: '#affiliate-training-app' },
    { name: 'Nutrition coaching certification', blurb: 'For the trainers running these numbers for clients.', href: '#affiliate-nutrition-cert' },
    { name: 'Home gym equipment', blurb: 'The one-time cost that replaces the monthly membership.', href: '#affiliate-home-gym' },
  ],
  'Home & Yard': [
    { name: 'Project materials delivered', blurb: 'Price the mulch, gravel, and concrete you just measured.', href: '#affiliate-materials-delivery' },
    { name: 'Hire a vetted local pro', blurb: 'When the DIY math says the weekend is not worth it.', href: '#affiliate-hire-pro' },
    { name: 'Home improvement financing', blurb: 'Compare the loan against the cash price before signing.', href: '#affiliate-home-improvement-loan' },
  ],
  'Trades & Engineering': [
    { name: 'Estimating & invoicing software', blurb: 'Turn the bid sheet math into the actual invoice.', href: '#affiliate-estimating-software' },
    { name: 'Small business insurance', blurb: 'The bid should price risk — so should the business.', href: '#affiliate-business-insurance' },
    { name: 'Pro tools retailer', blurb: 'The markup calculator says the right tool pays for itself.', href: '#affiliate-tools-retailer' },
  ],
  'School & Science': [
    { name: 'Student loan refinancing', blurb: 'If the IDR math says you will pay it off anyway, refi cheaper.', href: '#affiliate-student-refi' },
    { name: 'Textbook rental & course tools', blurb: 'The GPA calculator is free; the textbooks are not.', href: '#affiliate-textbooks' },
    { name: 'Online tutoring platforms', blurb: 'When the final-grade math says you need the points.', href: '#affiliate-tutoring' },
  ],
}

/** Pick the lineup for a calculator's category, falling back to the default. */
export function affiliatesFor(category: string): AffiliateItem[] {
  return CATEGORY_AFFILIATES[category] ?? DEFAULT_AFFILIATES
}
