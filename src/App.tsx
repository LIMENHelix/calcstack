import { Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import CalculatorPage from './pages/CalculatorPage'
import BillAnalyzer from './pages/BillAnalyzer'
import EmbedPage from './pages/EmbedPage'

export default function App() {
  return (
    <Routes>
      {/* Bare widget route for iframes — no site chrome */}
      <Route path="/embed/:slug" element={<EmbedPage />} />
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculators/:slug" element={<CalculatorPage />} />
              <Route path="/tools/bill-analyzer" element={<BillAnalyzer />} />
              <Route path="*" element={<CalculatorPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  )
}
