import { useEffect } from 'react'

/** Sets document title + meta description per page (SPA SEO layer). */
export function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = description
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = 'https://calcstack-eight.vercel.app' + window.location.pathname
  }, [title, description])
  return null
}
