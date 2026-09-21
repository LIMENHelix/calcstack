/* Vercel serverless proxy for Tradier market quotes.
   Keeps TRADIER_TOKEN server-side (never in the JS bundle).
   GET /api/quotes?symbols=SPY,QQQ → trimmed quote JSON, 60s CDN cache.
   Set TRADIER_TOKEN (and optionally TRADIER_BASE, defaults to sandbox) in Vercel env. */

// Minimal Vercel function types — avoids adding @vercel/node as a dependency.
interface Req { query: Record<string, string | string[] | undefined> }
interface Res {
  status(code: number): Res
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

const SYMBOL_RE = /^[A-Za-z][A-Za-z0-9.\-]{0,9}$/

export default async function handler(req: Req, res: Res) {
  const token = process.env.TRADIER_TOKEN
  if (!token) {
    res.status(503).json({ error: 'quotes_not_configured' })
    return
  }
  const raw = String(req.query.symbols ?? '')
  const symbols = raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter((s) => SYMBOL_RE.test(s))
    .slice(0, 12)
  if (symbols.length === 0) {
    res.status(400).json({ error: 'no_valid_symbols' })
    return
  }
  const base = process.env.TRADIER_BASE ?? 'https://sandbox.tradier.com/v1'
  try {
    const up = await fetch(`${base}/markets/quotes?symbols=${symbols.join(',')}&greeks=false`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
    if (!up.ok) {
      res.status(502).json({ error: `tradier_${up.status}` })
      return
    }
    const data = await up.json()
    const q = data?.quotes?.quote
    const list = (Array.isArray(q) ? q : q ? [q] : []).map((x: Record<string, unknown>) => ({
      symbol: x.symbol,
      last: x.last,
      change: x.change,
      changePct: x.change_percentage,
      prevClose: x.prevclose,
      volume: x.volume,
      name: x.description,
    }))
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    res.status(200).json({ quotes: list, asOf: new Date().toISOString() })
  } catch {
    res.status(502).json({ error: 'tradier_unreachable' })
  }
}
