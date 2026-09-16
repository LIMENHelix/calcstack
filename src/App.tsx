import { Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import CalculatorPage from './pages/CalculatorPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculators/:slug" element={<CalculatorPage />} />
        <Route path="*" element={<CalculatorPage />} />
      </Routes>
    </Layout>
  )
}
