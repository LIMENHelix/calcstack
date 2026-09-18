import { Link, NavLink } from 'react-router'
import { CALCULATORS } from '@/data/calculators'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Calc<span className="text-primary">Stack</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <NavLink
              to="/tools/bill-analyzer"
              className={({ isActive }) =>
                `rounded-full border px-3 py-1 ${isActive ? 'border-primary font-medium text-primary' : 'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10'}`
              }
            >
              Bill Analyzer ✦
            </NavLink>
            <NavLink
              to="/directory"
              className={({ isActive }) =>
                isActive ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'
              }
            >
              All tools
            </NavLink>
            {CALCULATORS.slice(0, 3).map((c) => (
              <NavLink
                key={c.slug}
                to={`/calculators/${c.slug}`}
                className={({ isActive }) =>
                  isActive
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                {c.shortTitle.replace(' Calculator', '')}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-4">
          <div>
            <p className="mb-2 font-semibold">CalcStack</p>
            <p className="text-muted-foreground">
              Free, instant financial calculators. No signup, no accounts, no data leaves your
              browser.
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold">Calculators</p>
            <ul className="space-y-1 text-muted-foreground">
              {CALCULATORS.map((c) => (
                <li key={c.slug}>
                  <Link to={`/calculators/${c.slug}`} className="hover:text-foreground">
                    {c.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold">Explore</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link to="/directory" className="hover:text-foreground">
                  Full directory
                </Link>
              </li>
              <li>
                <Link to="/for" className="hover:text-foreground">
                  By profession
                </Link>
              </li>
              <li>
                <Link to="/embeds" className="hover:text-foreground">
                  Embed these calculators
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold">Disclosure</p>
            <p className="text-muted-foreground">
              CalcStack is for education and planning — not financial advice. Some links are
              affiliate links; we may earn a commission at no cost to you.
            </p>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CalcStack. All calculations run locally in your browser.
        </div>
      </footer>
    </div>
  )
}
