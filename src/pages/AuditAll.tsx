import { Component, Suspense, type ReactNode } from 'react'
import { ALL_COMPONENTS } from './CalculatorPage'
import { CALCULATORS } from '@/data/calculators'
import { VARIANTS } from '@/data/variants'

/**
 * QA route (not linked, not in sitemap): renders EVERY calculator with default
 * props inside per-component error boundaries so one page load can be scanned
 * for crashes, NaN, undefined, or blank outputs across the whole site.
 */

class Boundary extends Component<{ slug: string; children: ReactNode }, { err: string | null }> {
  state = { err: null as string | null }
  static getDerivedStateFromError(e: Error) {
    return { err: e.message }
  }
  render() {
    if (this.state.err)
      return <div data-audit-slug={this.props.slug} data-audit-error={this.state.err}>CRASH: {this.state.err}</div>
    return <div data-audit-slug={this.props.slug}>{this.props.children}</div>
  }
}

export default function AuditAll() {
  const componentSlugs = new Set(Object.keys(ALL_COMPONENTS))
  const metaSlugs = new Set([...CALCULATORS.map((c) => c.slug), ...VARIANTS.map((v) => v.slug)])
  // Variants render their baseSlug component — check that, not the variant slug itself
  const missingComponent = [
    ...CALCULATORS.map((c) => c.slug).filter((s) => !componentSlugs.has(s)),
    ...VARIANTS.filter((v) => !componentSlugs.has(v.baseSlug)).map((v) => `${v.slug}→${v.baseSlug}`),
  ]
  const missingMeta = [...componentSlugs].filter((s) => !metaSlugs.has(s))

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Calculator audit — {componentSlugs.size} components</h1>
      <div data-audit-missing-component={missingComponent.join(',') || 'none'}>
        Missing component for: {missingComponent.join(', ') || 'none'}
      </div>
      <div data-audit-missing-meta={missingMeta.join(',') || 'none'}>
        Missing metadata for: {missingMeta.join(', ') || 'none'}
      </div>
      {Object.entries(ALL_COMPONENTS).map(([slug, Comp]) => (
        <section key={slug} className="rounded-lg border p-4">
          <h2 className="mb-3 font-mono text-sm font-semibold">{slug}</h2>
          <Boundary slug={slug}>
            <Suspense fallback={<div className="py-4 text-xs text-muted-foreground">Loading…</div>}>
              <Comp />
            </Suspense>
          </Boundary>
        </section>
      ))}
    </div>
  )
}
