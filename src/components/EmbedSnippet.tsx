import { useState } from 'react'

const SITE = 'https://calcstack-eight.vercel.app'

const SIZES = [
  { key: 'compact', label: 'Compact', height: 520, note: 'sidebars & blogs' },
  { key: 'standard', label: 'Standard', height: 680, note: 'most pages' },
  { key: 'tall', label: 'Tall', height: 860, note: 'full-width tools' },
] as const

/** Copyable iframe snippet so bloggers/site owners can embed the tool. */
export function EmbedSnippet({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const [size, setSize] = useState<(typeof SIZES)[number]['key']>('standard')
  const h = SIZES.find((s) => s.key === size)!.height
  const code = `<iframe src="${SITE}/embed/${slug}" width="100%" height="${h}" frameborder="0" style="border:0;border-radius:12px;" title="${title}" loading="lazy"></iframe>`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="mt-10 rounded-lg border bg-muted/30 p-5">
      <h2 className="text-lg font-semibold">Embed this calculator on your site — free</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste this snippet into any blog or website. The calculator works fully inside the frame —
        no signup, no cost — with a small &quot;Powered by CalcStack&quot; credit at the bottom.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {SIZES.map((s) => (
          <button
            key={s.key}
            onClick={() => setSize(s.key)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              size === s.key ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {s.label} <span className="text-xs opacity-70">({s.note})</span>
          </button>
        ))}
        <a
          href={`${SITE}/embed/${slug}`}
          target="_blank"
          rel="noopener"
          className="ml-auto text-sm text-primary hover:underline"
        >
          Preview the widget →
        </a>
      </div>
      <div className="mt-3 flex items-start gap-2">
        <code className="flex-1 overflow-x-auto rounded-md border bg-background p-3 text-xs">
          {code}
        </code>
        <button
          onClick={copy}
          className="shrink-0 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </section>
  )
}
