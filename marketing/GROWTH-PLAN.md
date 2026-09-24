# CalcStack Growth Plan — Traffic × Tools

Owner directive (2026-09-24): dramatically increase traffic and tools.
Build order: **mortgage desk → credit desk**. Fit inside LIMEN Helix: CalcStack
is the top-of-funnel traffic engine; house brands (Relay, Kilswitch, Recursive
Love, All Access KC) fill ad slots until paid sponsors replace them; agent/loan
embeds are the B2B revenue path.

## What actually moves traffic (ranked by leverage)

1. **Programmatic data pages** — the proven engine. 730 prerendered pages got
   us indexed; the multiplier is tool × state × metro. Every calculator that
   has a location variable (property tax, closing costs, insurance, transfer
   tax) becomes 51 state pages + top-100-metro pages. Mortgage first, then
   credit (state usury/fee rules, average score by state).
2. **Fresh data beats static tools.** A "today's mortgage rates by state"
   page updated weekly by automation outranks a static calculator for
   freshness-sensitive queries. Same later: average credit score / card APR
   stats refreshed on a cron.
3. **Embeds = backlinks at scale.** Already built; every agent/blogger embed
   is a followed link. Outreach kit exists (46 waves + press pitches). The
   mortgage desk ships an "agent net-sheet embed" — the single most linkable
   B2B asset we can make.
4. **The Calcy story** — mascot trading real money in public is the press
   hook; mortgage gets its own narrative spine (the deal desk, below), not
   another trade book.
5. **Community plays** — staged in LAUNCH.md / LAUNCH-RUNBOOK.md. Fire them;
   they're paste-ready.

## Tool count growth without breaking the brand

Accuracy is the moat — one wrong tax calc almost killed us. Rules for scale:
- Every new tool ships with `why`, `howItWorks`, `faq`, a named data source
  and year in the UI, and a worked example in its blurb.
- State-variant pages must verify against the state DOR/agency schedule, not
  a blog.
- New clusters land as a desk (hub + chained tools), not scattered singles.
- Target: +40 mortgage-desk pages, then +35 credit-desk pages, all
  prerendered, all in sitemap.

## Phase 1 — Mortgage Deal Desk (next build)

Elevate /home-buying into a desk the way /invest was elevated:

**A. The chained "walk this listing" flow** — one input (price, down %, zip)
drives the whole chain: affordability → payment (PITI with state tax +
insurance) → PMI drop-off → closing costs → seller/buyer net. Each step links
to the next with inputs pre-filled. This is the retention feature: people
don't use one mortgage calculator, they use six in a row.

**B. Operator cluster (the money audience):**
- House-flip desk (exists) → add hold-vs-sell timeline and hard-money DSCR
- Seller net sheet (exists) → make it the flagship embed for agents
- FSBO vs agent (exists) → add post-NAR buyer-agreement cost math
- New: rate-lock float-down math, appraisal-gap exposure, wholesale/assignment
  (with legal caution copy), landlord vacancy + insurance cluster

**C. Insurance "tricks" cluster (first-class):**
- Adequacy (exists) + flood/EQ gap, extended replacement cost, ordinance-or-law,
  wind/hail deductible as % of dwelling (the gotcha), coinsurance penalty demo

**D. Fresh data spine:**
- Weekly automation: update state rate/tax stats JSON → every state page and
  the by-state table re-render with "as of" dates. Copy the Calcy cron pattern.

**E. Monetization hooks:** agent embed CTA on every seller-side tool;
insurance cluster carries the insurance-affiliate lane later. Honest labels
only — rate-table spam is the trap.

## Phase 2 — Credit Desk (after mortgage)

- Credit score simulator (utilization, age, inquiries — factor-weighted
  estimate, clearly labeled as educational)
- Utilization optimizer (which card to pay first for score points vs interest)
- Balance transfer break-even, APR true cost, minimum-payment trap timeline
- DTI calculator (bridges mortgage ↔ credit — cross-link the desks)
- Payoff planner exists (avalanche/snowball) → pull into the desk
- State variants: average score by state data page, statute-of-limitations
  reference (careful: informational, not legal advice)
- Narrative spine: "score moves are math, not mystery" — pairs with the Bill
  Analyzer (find the money) → payoff planner (deploy the money) → score
  simulator (watch the score move)

## Cadence & measurement

- Ship desk phases weekly; Monday automation continues Calcy + now rate-data
  refresh.
- Scoreboard (Search Console): impressions/day, indexed pages, embeds placed.
  Current baseline to beat: sitemap 730 URLs, fresh verification live.
- Guardrail: no new cluster ships until the previous one passes the accuracy
  audit script + spot-check on live pages.

## Immediate next actions (ordered)

1. Build the "walk this listing" chained flow on /home-buying (Phase 1A)
2. New operator tools: rate-lock, appraisal gap, hard-money DSCR (Phase 1B)
3. Insurance cluster pages (Phase 1C)
4. Weekly rate-data automation (Phase 1D)
5. Credit desk spec finalized while mortgage ships
