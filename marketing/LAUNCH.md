# CalcStack Launch Sequence — Domain Go-Live Playbook

Fire this the day the custom domain is live. Everything is sequenced so each step
compounds the previous one. The hook everywhere: **100 free calculators, no signup,
math runs in your browser.**

## Phase 0 — Technical go-live (Day 0, before any email)

1. Point domain at Vercel; confirm HTTPS + www redirect.
2. Swap hardcoded URLs (one commit): `Seo.tsx`, `EmbedPage.tsx`, `EmbedSnippet.tsx`,
   `EmbedGallery.tsx`, `public/robots.txt`, `scripts/gen-sitemap.mjs` — regenerate sitemap.
3. Google Search Console: verify domain property, submit `sitemap.xml` (322 URLs),
   request indexing on homepage + /directory + top 10 calculators.
4. Bing Webmaster Tools: import from Search Console (free second engine, 5 minutes).
5. AdSense application — submit only AFTER the domain shows 50+ indexed pages
   (check `site:domain.com`); thin-looking new domains get rejected.
   When approved: add Vercel env vars `VITE_ADSENSE_CLIENT` (ca-pub-…) and
   `VITE_ADSENSE_SLOT`, redeploy — every AdSlot on the site (all calculator
   pages, data pages, personas, all three hubs, homepage) goes live instantly.
   Until then, slots render as invisible-to-nobody dashed placeholders.
6. Smoke-test live: homepage, one calculator per category, /embeds, one /embed/ iframe,
   one persona page, one data page. Fix before announcing anything.

## Phase 1 — Embed outreach, Wave 1 (Days 1–7)

Work TARGETS.md top-down. Physician finance first (Wave 1 targets 1–5). One
personalized email per site, Template A. Reference the milestone where natural:

> "CalcStack just crossed 100 free calculators — all embeddable, all no-signup —
> and the wRVU one is built for exactly your audience."

Pace: 1–2 emails/day max. Log every send in the tracker.

## Phase 2 — Community value-drops (Days 3–14, parallel)

Template C answers in Bogleheads, /r/personalfinance, /r/Serverlife, city subreddits.
Rules: answer the question fully with the math in the comment itself; link only when
the calculator IS the answer. Zero posts that are just links. One per community per
week, max.

## Phase 3 — Follow-ups (Days 8–14)

One follow-up per non-responder, 7 days after first send, then done forever.
Follow-up template:

> Hi [name] — quick bump in case this got buried. The offer stands: the calculator
> is free, embeds with one iframe, and I can adjust inputs to match your audience
> if that makes it more useful. No worries either way.

## Phase 4 — Waves 2–5 (Weeks 2–6)

Wave 2 (legal/consulting) in week 2, Wave 3 (sports science) week 3,
Wave 4 (hospitality) week 4, Wave 5 (homebuying) week 5–6 or hold for spring season.

## Phase 5 — Wave 6, gig economy (Week 6+, or Week 1 if launching Jan–Mar)

Gig-driver communities are the highest-share audience — "true hourly" math is their
native content. If launch lands in tax season (Jan–Mar), promote Wave 6 to Week 1 and
lead with Quarterly Estimated Tax + Mileage vs Actual while searches spike.

## Success metrics (review weekly)

- Embeds live (the only metric that compounds): target 5 by day 30
- Search Console: impressions trending up week over week
- Indexed pages: 322 within 2 weeks of sitemap submit
- AdSense: approved by day 30 (reapply with more indexed content if rejected)

## What NOT to do

- No paid links, no link exchanges, no mass email — one manual penalty kills a new domain.
- No AdSense before content is indexed; rejection history makes later approval harder.
- No "AI-built site" framing anywhere public. The pitch is the math quality and the
  audit trail (AUDIT.md is public on GitHub — that IS the credibility story).
