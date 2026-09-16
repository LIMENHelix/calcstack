/**
 * Monetization slots. AdSlot is a drop-in container for an ad network
 * (AdSense/Ezoic/Raptive) once approved; AffiliateCard carries partner CTAs.
 * Swap the href values for real affiliate links once programs are approved.
 */
export function AdSlot({ label = 'Advertisement' }: { label?: string }) {
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
