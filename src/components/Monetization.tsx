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

export function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  const live = Boolean(ADSENSE_CLIENT && ADSENSE_SLOT)
  const pushed = useRef(false)

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

  return (
    <div className="my-8 flex min-h-[90px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
      {label} — ad network slot
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
