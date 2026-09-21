/* Diagnostics: reports WHICH expected env vars are present (never values).
   GET /api/env-check → { TRADIER_TOKEN: true/false, ... } */
interface Res {
  status(code: number): Res
  json(body: unknown): void
}

export default function handler(_req: unknown, res: Res) {
  res.status(200).json({
    TRADIER_TOKEN: Boolean(process.env.TRADIER_TOKEN),
    TRADIER_API_KEY: Boolean(process.env.TRADIER_API_KEY),
    TRADIER_API_SANDBOX: Boolean(process.env.TRADIER_API_SANDBOX),
    TRADIER_BASE: Boolean(process.env.TRADIER_BASE),
    NODE_ENV: process.env.NODE_ENV ?? null,
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
  })
}
