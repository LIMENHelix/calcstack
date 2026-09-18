import { Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import CalculatorPage from './pages/CalculatorPage'
import BillAnalyzer from './pages/BillAnalyzer'
import DataMortgage from './pages/DataMortgage'
import DataSalaries from './pages/DataSalaries'
import StateMortgage from './pages/StateMortgage'
import Directory from './pages/Directory'
import PersonaPage from './pages/PersonaPage'
import PersonaIndex from './pages/PersonaIndex'
import EmbedPage from './pages/EmbedPage'
import EmbedTablePage from './pages/EmbedTablePage'
import EmbedGallery from './pages/EmbedGallery'
import TaxSeason from './pages/TaxSeason'
import OpenEnrollment from './pages/OpenEnrollment'
import HomeBuying from './pages/HomeBuying'
import AuditAll from './pages/AuditAll'

export default function App() {
  return (
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
              <Route path="/embeds" element={<EmbedGallery />} />
              <Route path="/tax-season" element={<TaxSeason />} />
              <Route path="/open-enrollment" element={<OpenEnrollment />} />
              <Route path="/home-buying" element={<HomeBuying />} />
              <Route path="/for" element={<PersonaIndex />} />
              <Route path="/for/:slug" element={<PersonaPage />} />
              <Route path="*" element={<CalculatorPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  )
}
