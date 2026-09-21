/* Vercel serverless proxy for Tradier historical prices (monthly/daily closes).
   GET /api/history?symbol=SPY&months=36 → [{date, close}...], 1h CDN cache. */
interface Req { query: Record<string, string | string[] | undefined> }
interface Res {
  status(code: number): Res
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

const SYMBOL_RE = /^[A-Za-z][A-Za-z0-9.\-]{0,9}$/

export default async function handler(req: Req, res: Res) {
  const prodToken = process.env.TRADIER_TOKEN ?? process.env.TRADIER_API_KEY
  const token = prodToken ?? process.env.TRADIER_API_SANDBOX
  if (!token) {
    res.status(503).json({ error: 'quotes_not_configured' })
    return
  }
  const symbol = String(req.query.symbol ?? '').trim().toUpperCase()
  const months = Math.max(1, Math.min(120, Number(req.query.months) || 36))
  if (!SYMBOL_RE.test(symbol)) {
    res.status(400).json({ error: 'bad_symbol' })
    return
  }
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - months)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const base = process.env.TRADIER_BASE ?? (prodToken ? 'https://api.tradier.com/v1' : 'https://sandbox.tradier.com/v1')
  try {
    const up = await fetch(
      `${base}/markets/history?symbol=${encodeURIComponent(symbol)}&interval=monthly&start=${fmt(start)}&end=${fmt(end)}&session_filter=open`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
    )
    if (!up.ok) {
      res.status(502).json({ error: `tradier_${up.status}` })
      return
    }
    const data = await up.json()
    const days = data?.history?.day
    const list = (Array.isArray(days) ? days : days ? [days] : [])
      .map((d: Record<string, unknown>) => ({ date: d.date, close: Number(d.close) }))
      .filter((d: { close: number }) => Number.isFinite(d.close) && d.close > 0)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200')
    res.status(200).json({ symbol, closes: list })
  } catch {
    res.status(502).json({ error: 'tradier_unreachable' })
  }
}
