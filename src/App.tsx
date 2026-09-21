import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import { Layout } from './components/Layout'

// SPA routes keep the previous page's scroll position by default — without this,
// clicking a calculator from a scrolled-down page lands you at the bottom of the new one.
// Hash links (/directory#category) must scroll TO the anchor, not the top.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
import { lazy, Suspense } from 'react'
import Home from './pages/Home'
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'))
const BillAnalyzer = lazy(() => import('./pages/BillAnalyzer'))
const DataMortgage = lazy(() => import('./pages/DataMortgage'))
const DataSalaries = lazy(() => import('./pages/DataSalaries'))
const StateMortgage = lazy(() => import('./pages/StateMortgage'))
const Directory = lazy(() => import('./pages/Directory'))
const PersonaPage = lazy(() => import('./pages/PersonaPage'))
const PersonaIndex = lazy(() => import('./pages/PersonaIndex'))
const EmbedPage = lazy(() => import('./pages/EmbedPage'))
const EmbedTablePage = lazy(() => import('./pages/EmbedTablePage'))
const EmbedGallery = lazy(() => import('./pages/EmbedGallery'))
const TaxSeason = lazy(() => import('./pages/TaxSeason'))
const OpenEnrollment = lazy(() => import('./pages/OpenEnrollment'))
const HomeBuying = lazy(() => import('./pages/HomeBuying'))
const AuditAll = lazy(() => import('./pages/AuditAll'))
const Advertise = lazy(() => import('./pages/Advertise'))
const Invest = lazy(() => import('./pages/Invest'))
const CalcyPortfolio = lazy(() => import('./pages/CalcyPortfolio'))

const PageFallback = (
  <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>
)

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={PageFallback}>
      <Routes>
      {/* Bare widget route for iframes — no site chrome */}
      <Route path="/embed/:slug" element={<EmbedPage />} />
      <Route path="/embed/table/:name" element={<EmbedTablePage />} />
      {/* QA audit route — not linked, not in sitemap */}
      <Route path="/audit-all" element={<AuditAll />} />
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculators/:slug" element={<CalculatorPage />} />
              <Route path="/tools/bill-analyzer" element={<BillAnalyzer />} />
              <Route path="/data/mortgage-payment-by-state" element={<DataMortgage />} />
              <Route path="/data/mortgage-payment-in/:slug" element={<StateMortgage />} />
              <Route path="/data/average-salary-by-job" element={<DataSalaries />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/invest" element={<Invest />} />
              <Route path="/calcy" element={<CalcyPortfolio />} />
              <Route path="/embeds" element={<EmbedGallery />} />
              <Route path="/tax-season" element={<TaxSeason />} />
              <Route path="/open-enrollment" element={<OpenEnrollment />} />
              <Route path="/home-buying" element={<HomeBuying />} />
              <Route path="/advertise" element={<Advertise />} />
              <Route path="/for" element={<PersonaIndex />} />
              <Route path="/for/:slug" element={<PersonaPage />} />
              <Route path="*" element={<CalculatorPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
      </Suspense>
    </>
  )
}
