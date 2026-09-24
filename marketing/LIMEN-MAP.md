# LIMEN Helix ↔ CalcStack Domain Map

Owner directive (2026-09-24): map every Limen Helix portal domain into
CalcStack. The P0–P10 ladder is the business model: **P0–P1 are no-capital,
free businesses that fund P2–P3** (and beyond). CalcStack IS the P0/P1 layer
at scale — free tools that cost nothing to serve and generate the traffic,
trust, and backlinks that the paid Limen tiers monetize.

## The architecture in one line

CalcStack calculators = P0/P1 (free, no capital, runs in the browser) →
Limen domain pages = the live read (free context, pressure/cycle) →
P2+ paid tiers (monitoring YOUR situation, alerts, filings).

The bridge works both directions:
1. **CalcStack → Limen:** every tool in a domain cluster carries a "live
   context" link to that domain's page (e.g. bank-safety tools → /finance,
   utility tools → /utility-watch). Traffic flows uphill to the paid tiers.
2. **Limen → CalcStack:** every Limen domain page embeds the matching
   CalcStack calculators via iframe (already built, free) — "run the numbers"
   under every live read. The portal's P0 layer becomes literally interactive.

## Domain map (all 20 + energy cluster)

| Limen domain | CalcStack feeder cluster (P0/P1) | Status | P2+ tie-in |
|---|---|---|---|
| /finance | paycheck, savings, FIRE, investing desk, bank-safety (FDIC data) | deep | P2 bank monitor $4/mo, P3 capital alert $8/mo (live) |
| /economy | inflation, purchasing power, salary-by-job, COL pages | strong | macro alerts tier (future) |
| /energy + /utility-watch (+37 utility pages) | utility bill, kWh-by-state, solar payback, EV vs gas, home energy trilogy | strong | per-utility watch tiers (future) |
| /medicine | BMI, water intake, macros, sports science, periodization | strong | personal-health monitor (future) |
| /infrastructure | construction desk: concrete, road base, bid sheets, renovation ROI | strong | contractor bid watch (future) |
| /governance | tax cluster: paycheck by state, property-tax appeal, W-4, 2026 brackets | strong | tax-change alerts (future) |
| /defense | BAH rent-vs-buy (exists), military pay, VA loan, PCS move | partial | deployment/PCS planner (future) |
| /law | freelance rate, billable hour, settlement math, small-claims limits | partial | legal-fee watch (careful, informational only) |
| /trade | Shopify vs Etsy, sales tax by state, tariff/landed cost (new) | partial | tariff-change alerts (future) |
| /education | GPA, weighted grade, student loan payoff, 529 growth | partial | tuition-tracker (future) |
| /industry | bid sheets, OEE, materials, labor burden | partial | — |
| /agriculture | NEW: land rent, yield breakeven, fertilizer rate, livestock feed | gap | commodity watch (future) |
| /technology | freelance rate, SaaS pricing, uptime cost, bandwidth | partial | — |
| /science | unit converter, statistics pack, fraction, percent | strong | — |
| /environment | carbon footprint, home energy, water use | partial | — |
| /culture | wedding budget, event cost, travel | partial | — |
| /population | demographic data pages (salary-by-job pattern extends) | partial | — |
| /communication | podcast/stream cost, data usage | gap | — |
| /religion | NEW: tithe calculator, church budget planner | gap | — |
| /intelligence | no CalcStack mapping — leave it standalone | n/a | n/a |

Legend — strong: cluster exists and is audited · partial: some tools · gap: build needed.

## Sequencing (highest overlap first)

Mortgage → credit stays the immediate build order (finance domain depth).
Then by existing CalcStack strength:

1. **Defense desk** — tiny build (BAH exists): VA loan, military pay, PCS.
   Passionate niche, high search volume, zero good incumbent tools.
2. **Agriculture desk** — gap = opportunity: land rent, yield breakeven,
   feed math. Almost no free competition.
3. **Trade desk** — tariff/landed-cost calculator rides the news cycle; the
   /trade live read is already generating context daily.
4. **Governance desk** — already strong; add per-state variant pages
   (property tax appeal by state = 51 new pages).
5. Religion/communication desks last — smallest search surface.

## The bridge build (concrete, near-term)

- [ ] Add a "Live context" link module to calculator pages: each cluster maps
      to its Limen domain URL (data-driven, one config file).
- [ ] Produce the embed shortlist for Limen domain pages (one iframe per
      domain — e.g. /finance embeds the paycheck calculator, /utility-watch
      embeds the utility-bill calculator). Chris pastes them into the portal.
- [ ] CalcStack footer gains a "Systems read by LIMEN Helix" link; Limen
      pages gain "Calculators by CalcStack" credit. Cross-domain authority
      flows both ways — this is the SEO alliance.

## What this is NOT

- Not merging the brands. CalcStack stays the friendly free tool site; LIMEN
  Helix stays the system-reading portal. The handshake is links + embeds +
  the P0→P2 funnel, not shared branding.
- Not building paid tiers on CalcStack. Free stays free — the paid products
  live on the portal. CalcStack's monetization stays ads/affiliates/embeds.

## Measurement

- Referral traffic calcstack.app ↔ limenhelix.com (both directions)
- Embeds live on Limen domain pages (target: 20 domains × 1 embed)
- Search Console impressions on new desk clusters (defense, agriculture)
- P2/P3 signups attributable to CalcStack referrals (portal-side metric)
