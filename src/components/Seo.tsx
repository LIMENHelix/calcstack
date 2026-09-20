import { useEffect } from 'react'

const SITE = 'https://limenhelix.com' // pathname already carries the /calcstack basename

function setMeta(selector: string, attrs: Record<string, string>, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    const el = document.createElement('meta')
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
    tag = el
  }
  tag.content = content
}

/** Sets document title, meta description, canonical, and OG/Twitter tags per page (SPA SEO layer). */
export function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title
    const url = SITE + window.location.pathname
    setMeta('meta[name="description"]', { name: 'description' }, description)
    setMeta('meta[property="og:title"]', { property: 'og:title' }, title)
    setMeta('meta[property="og:description"]', { property: 'og:description' }, description)
    setMeta('meta[property="og:url"]', { property: 'og:url' }, url)
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description])
  return null
}
