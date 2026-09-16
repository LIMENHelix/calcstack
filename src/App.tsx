import { Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import CalculatorPage from './pages/CalculatorPage'
import BillAnalyzer from './pages/BillAnalyzer'
import DataMortgage from './pages/DataMortgage'
import DataSalaries from './pages/DataSalaries'
import StateMortgage from './pages/StateMortgage'
import EmbedPage from './pages/EmbedPage'
import EmbedTablePage from './pages/EmbedTablePage'

export default function App() {
  return (
    <Routes>
      {/* Bare widget route for iframes — no site chrome */}
      <Route path="/embed/:slug" element={<EmbedPage />} />
      <Route path="/embed/table/:name" element={<EmbedTablePage />} />
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
              <Route path="*" element={<CalculatorPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  )
}
