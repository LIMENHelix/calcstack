/* Owner-only account snapshot: balances + positions from the real Tradier account.
   Gated by header  x-api-key: $CALCSTACK_API_KEY  — never expose without it.
   GET /api/account → { balances, positions, asOf } */

interface Req {
  query: Record<string, string | string[] | undefined>
  headers: Record<string, string | string[] | undefined>
}
interface Res {
  status(code: number): Res
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

const BASE = 'https://api.tradier.com/v1'

export default async function handler(req: Req, res: Res) {
  const key = req.headers['x-api-key']
  const expected = process.env.CALCSTACK_API_KEY
  if (!expected || key !== expected) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }
  const token = process.env.TRADIER_TOKEN ?? process.env.TRADIER_API_KEY
  const acct = process.env.TRADIER_ACCT_NUMBER ?? process.env.TRADIER_ACCOUNT_NUMBER
  if (!token || !acct) {
    res.status(503).json({ error: 'tradier_not_configured' })
    return
  }
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  try {
    const [b, p] = await Promise.all([
      fetch(`${BASE}/accounts/${acct}/balances`, { headers }),
      fetch(`${BASE}/accounts/${acct}/positions`, { headers }),
    ])
    if (!b.ok) {
      res.status(502).json({ error: `tradier_balances_${b.status}` })
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
          dateAcquired: x.date_acquired,
        }),
      )
    }
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      balances: balances
        ? {
            totalEquity: balances.total_equity,
            cashAvailable: balances.cash?.cash_available,
            buyingPower: balances.margin?.stock_buying_power ?? balances.cash?.cash_available,
            longMarketValue: balances.long_market_value,
            accountType: balances.account_type,
          }
        : null,
      positions,
      asOf: new Date().toISOString(),
    })
  } catch {
    res.status(502).json({ error: 'tradier_unreachable' })
  }
}
