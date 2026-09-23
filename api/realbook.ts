/* Public read-only snapshot of Calcy's REAL Tradier book — the transparency
   experiment: actual money, traded by the published formula, shown in public.
   Deliberately unauthenticated but deliberately minimal: symbols, quantities,
   cost basis, cash. No account numbers, no balances beyond the book, nothing
   that identifies or can act on the account. 5-minute CDN cache. */

interface Req {
  query: Record<string, string | string[] | undefined>
}
interface Res {
  status(code: number): Res
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

const BASE = 'https://api.tradier.com/v1'

export default async function handler(_req: Req, res: Res) {
  const token = process.env.TRADIER_TOKEN ?? process.env.TRADIER_API_KEY
  const acct = process.env.TRADIER_ACCT_NUMBER ?? process.env.TRADIER_ACCOUNT_NUMBER
  if (!token || !acct) {
    res.status(503).json({ error: 'not_configured' })
    return
  }
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  try {
    const [b, p] = await Promise.all([
      fetch(`${BASE}/accounts/${acct}/balances`, { headers }),
      fetch(`${BASE}/accounts/${acct}/positions`, { headers }),
    ])
    if (!b.ok) {
      res.status(502).json({ error: `upstream_${b.status}` })
      return
    }
    const balances = (await b.json())?.balances ?? null
    let positions: unknown[] = []
    if (p.ok) {
      const pj = await p.json()
      const raw = pj?.positions?.position
      positions = (Array.isArray(raw) ? raw : raw ? [raw] : []).map(
        (x: Record<string, unknown>) => ({
          symbol: x.symbol,
          quantity: x.quantity,
          costBasis: x.cost_basis,
        }),
      )
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(200).json({
      startedAt: '2026-09-23',
      startValue: 100,
      cash: balances?.cash?.cash_available ?? null,
      positions,
      asOf: new Date().toISOString(),
    })
  } catch {
    res.status(502).json({ error: 'upstream_unreachable' })
  }
}
