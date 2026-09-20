import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { searchAll, SEARCH_TOTAL } from '@/lib/searchIndex'

export function SearchBar() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const navigate = useNavigate()
  const boxRef = useRef<HTMLDivElement>(null)
  const results = searchAll(q)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (path: string) => {
    setOpen(false)
    setQ('')
    navigate(path)
  }

  return (
    <div ref={boxRef} className="relative mx-auto mt-6 max-w-xl">
      <input
        type="text"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setHighlight(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, results.length - 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)) }
          if (e.key === 'Enter' && results[highlight]) go(results[highlight].path)
          if (e.key === 'Escape') setOpen(false)
        }}
        placeholder={`Search ${SEARCH_TOTAL} calculators, tools & data — try “texas tax” or “bmi”…`}
        className="h-12 w-full rounded-xl border-2 border-primary/40 bg-background px-4 pr-12 text-base shadow-sm focus:border-primary focus:outline-none"
        aria-label="Search calculators and tools"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">⌕</span>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-background shadow-lg">
          {results.map((r, i) => (
            <li key={r.path}>
              <button
                onClick={() => go(r.path)}
                onMouseEnter={() => setHighlight(i)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${i === highlight ? 'bg-primary/10' : ''}`}
              >
                <span className="font-medium">{r.title}</span>
                <span className="ml-3 shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{r.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && q.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground shadow-lg">
          No matches — try a broader term like “tax”, “loan”, or “salary”.
        </div>
      )}
    </div>
  )
}
