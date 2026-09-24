/* Live-context bridge — a quiet one-line link from a calculator to the LIMEN
   Helix domain reading the same system live. P0/P1 → portal handshake:
   subtle, honest, external. */
import { limenFor } from '@/data/limen'

export function LimenContext({ category, slug }: { category: string; slug: string }) {
  const domain = limenFor(category, slug)
  if (!domain) return null
  return (
    <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">
      Live context — LIMEN Helix is reading{' '}
      <a
        href={domain.url}
        target="_blank"
        rel="noopener"
        className="font-medium text-primary underline"
      >
        {domain.line}
      </a>{' '}
      right now.
    </p>
  )
}
