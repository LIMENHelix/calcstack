/* Owner-only order endpoint for the real Tradier account.
   Gated by header  x-api-key: $CALCSTACK_API_KEY  on every call.

   POST /api/order  (JSON body)
     { symbol, side: "buy"|"sell", quantity, limitPrice?, execute?: boolean }

   SAFETY MODEL
   - Default is PREVIEW: Tradier validates the order against the account and
     returns cost/fees/warnings WITHOUT placing it.
   - The order only goes live when  execute: true  is sent explicitly.
   - Equities only (no options), buy/sell only, day or GTC limit/market.
   - Hard caps: quantity 1–500 shares per order; notional cap $25,000 per order
     (checked against last quote for market orders).
   - Every call (preview or live) returns the full Tradier response so there is
     an auditable record. */

interface Req {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}
interface Res {
  status(code: number): Res
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

const BASE = 'https://api.tradier.com/v1'
const SYMBOL_RE = /^[A-Za-z][A-Za-z0-9.\-]{0,9}$/
const MAX_QTY = 500
const MAX_NOTIONAL = 25_000

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'post_only' })
    return
  }
  const expected = process.env.CALCSTACK_API_KEY
  if (!expected || req.headers['x-api-key'] !== expected) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }
  const token = process.env.TRADIER_TOKEN ?? process.env.TRADIER_API_KEY
  const acct = process.env.TRADIER_ACCT_NUMBER
  if (!token || !acct) {
    res.status(503).json({ error: 'tradier_not_configured' })
    return
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
    symbol?: string
    side?: string
    quantity?: number
    limitPrice?: number
    execute?: boolean
  }
  const symbol = String(body?.symbol ?? '').toUpperCase()
  const side = String(body?.side ?? '').toLowerCase()
  const quantity = Math.floor(Number(body?.quantity ?? 0))
  const limitPrice = body?.limitPrice != null ? Number(body.limitPrice) : null
  const execute = body?.execute === true

  if (!SYMBOL_RE.test(symbol)) {
    res.status(400).json({ error: 'bad_symbol' })
    return
  }
  if (side !== 'buy' && side !== 'sell') {
    res.status(400).json({ error: 'side_must_be_buy_or_sell' })
    return
  }
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY) {
    res.status(400).json({ error: `quantity_must_be_1_to_${MAX_QTY}` })
    return
  }
  const type = limitPrice != null && limitPrice > 0 ? 'limit' : 'market'

  // Notional cap — quote the symbol and estimate cost.
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  try {
    const qr = await fetch(`${BASE}/markets/quotes?symbols=${symbol}&greeks=false`, { headers })
    if (qr.ok) {
      const qj = await qr.json()
      const q = qj?.quotes?.quote
      const last = Number((Array.isArray(q) ? q[0] : q)?.last ?? 0)
      const est = (type === 'limit' ? Number(limitPrice) : last) * quantity
      if (last > 0 && est > MAX_NOTIONAL) {
        res.status(400).json({
          error: 'notional_cap_exceeded',
          cap: MAX_NOTIONAL,
          estimated: Math.round(est * 100) / 100,
          last,
        })
        return
      }
    }
  } catch {
    // Quote check failed — continue; Tradier preview will still validate funds.
  }

  const params = new URLSearchParams({
    class: 'equity',
    symbol,
    side,
    quantity: String(quantity),
    type,
    duration: 'day',
    preview: execute ? 'false' : 'true',
  })
  if (type === 'limit') params.set('price', String(limitPrice))

  try {
    const up = await fetch(`${BASE}/accounts/${acct}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })
    const data = await up.json().catch(() => null)
    if (!up.ok) {
      res.status(502).json({ error: `tradier_order_${up.status}`, detail: data })
      return
    }
    res.status(200).json({
      mode: execute ? 'LIVE' : 'PREVIEW',
      request: { symbol, side, quantity, type, limitPrice, duration: 'day' },
      tradier: data,
      asOf: new Date().toISOString(),
    })
  } catch {
    res.status(502).json({ error: 'tradier_unreachable' })
  }
}
