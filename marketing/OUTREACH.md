# CalcStack Embed Outreach Kit

**Status: 224 calculators live (450 indexed pages). See LAUNCH.md for the domain-day
sequence.** Goal: backlinks + embedded calculators on other people's sites. Every embed carries a
"Powered by CalcStack" link — that is the SEO engine. This kit is for manual, honest outreach:
personalized, one at a time, no blasts.

The outreach destination is the embed gallery: https://calcstack-eight.vercel.app/embeds —
live working preview on-page, size presets, one-click copy for all 224 tools.

## Rules of engagement

- Never mass-send. One site, one human, one reason the embed helps THEIR readers.
- Lead with what their audience gets (a free tool on the page), not what we get (the link).
- Always mention: free forever, no signup, runs locally (privacy), they can iframe it in 30 seconds.
- If they say no or don't reply, one follow-up after 7 days, then done forever.
- Track in a simple sheet: site, contact, date sent, reply, embed live?

## The pitch asset

Every calculator page has an "Embed this calculator" section with a copy-paste iframe and
size presets (Compact / Standard / Tall). Example:

```html
<iframe src="https://calcstack-eight.vercel.app/embed/mileage-deduction-calculator"
        width="100%" height="680" style="border:0;border-radius:12px" loading="lazy"
        title="Mileage Deduction Calculator — CalcStack"></iframe>
```

Swap the slug for any calculator. The embed is fully functional inside the frame.

## Template A — Blogger / content site (embed pitch)

Subject: Free tool for your post on [topic] — readers can run the math inline

> Hi [name],
>
> Your post on [specific post] answers [question] really well — but readers still have to
> leave to do the math. I built a free calculator that does exactly that calculation, and
> it's embeddable: paste one iframe and your readers get the answer without leaving your page.
>
> Live demo: [embed URL]
> Full page (with the embed snippet at the bottom): [calculator URL]
>
> It's free forever, no signup, nothing tracked — the math runs in the reader's browser.
> Happy to build a custom variant if your audience needs a slightly different input.
>
> [Your name], CalcStack

## Template B — Resource page / "useful links" pitch

Subject: Free [niche] calculator for your resources page

> Hi [name],
>
> I maintain CalcStack, a free calculator library, and noticed your [resources page URL]
> links out to tools for [audience]. Our [calculator name] is one of the only free ones that
> [specific differentiator — e.g., "handles the 2026 split-year IRS mileage rates correctly"].
> Might be worth a slot: [URL]
>
> Either way, thanks for maintaining that page — I sent a friend there last week.

## Template C — Forum / community value-drop (Reddit, Facebook groups, Discord)

Do NOT pitch. Answer questions with the math, and link only when it's the actual answer:

> "Food cost is COGS ÷ food sales — beginning inventory + purchases − ending inventory first.
> At your numbers that's 8000+12000−7000 = 13,000 on 40,000 sales = 32.5%, which is fine for
> full-service. If you want to play with the inputs: [link]"

Rules: 10 genuine helpful comments for every 1 link. Mods delete drive-by links;
they keep the person who clearly knows the subject.

## Target list by vertical

| Vertical | Calculators to pitch | Where to pitch |
|---|---|---|
| Contractors / trades | Bid Sheet, Markup vs Margin, Framing, Voltage Drop | Contractor blogs, /r/Construction, trade school resource pages, lumber yard blogs |
| Real estate | Commission Split, GCI Goal, Cap Rate, Mortgage | Agent blogs, brokerage intranets, BiggerPockets threads, real estate coaches |
| Sales | Quota Attainment, OTE, Tiered Commission | Sales blogs, RevOps newsletters, /r/sales wiki, comp-plan consultants |
| Restaurants | Food Cost, Plate Cost, Prime Cost, Pour Cost | Restaurant Owner forums, Chef blogs, POS company blogs, culinary school pages |
| Trainers | Trainer Rate, Session Package, Client Capacity, 1RM, Macros | Certification org blogs (NASM/ACE/ISSA), gym-owner communities, fitness subreddits |
| Gig drivers | True Hourly, Mileage Deduction, Offer Scorer | Rideshare Guy-style blogs, driver YouTube descriptions, tax-prep blogs |
| Landscapers | Lawn Pricing, Revenue Planner, Snow Bid, Mulch | Lawn Care Forum, equipment dealer blogs, /r/landscaping |
| Physicians | wRVU Compensation, Loan Payoff, Rent vs Buy | Physician finance blogs (White Coat Investor-style), residency program coordinators, /r/whitecoatinvestor |
| Retirees / FIRE | RMD, Social Security Breakeven, Safe Withdrawal | Retirement blogs, Bogleheads forum (politely, in answer threads), AARP-style content sites, fee-only advisor blogs |
| Homebuyers | Rent vs Buy, Closing Costs, Mortgage | First-time-buyer blogs, housing YouTube descriptions, city subreddits (in answer threads), lender resource pages |
| Law & consulting | Billable Hours, Realization Rate, Consultant Day Rate | Legal-tech blogs, law practice management newsletters, consultant communities, accounting firm blogs |
| Tipped workers | Tip Pool, Tip Credit, Tip Income Budget | Server/bartender forums, /r/Serverlife, hospitality workforce blogs, restaurant staffing agencies |
| Sports science | DOTS Score, CKD Carb-Up, Glycogen, Carb Loading, Sweat Rate | Powerlifting federation blogs, keto/CKD communities, marathon training blogs, strength coaching newsletters |
| Engineers & STEM | Beam Load, Load Combinations, HP↔Torque, RC Circuit, Ohm's Law | Engineering school resource pages, hobbyist electronics blogs, /r/AskEngineers wiki, maker sites |
| Teachers & public sector | Teacher Pay, Pension math | Teacher blogs, education degree program pages, union local sites |

## New-vertical pitch angles (what makes OURS different)

- **RMD:** uses the current IRS Table III divisors (in effect since 2022) and shows the 25% excise penalty — most ranking RMD calculators never mention the penalty.
- **Rent vs Buy:** honest breakeven year with invested-difference math — NOT a lender tool that always says "buy." That honesty IS the pitch to independent blogs.
- **wRVU:** almost no free wRVU calculators exist; physician finance bloggers desperately need one to embed.
- **Tip Credit Checker:** computes the employer top-up owed — a worker-protection angle no competitor touches.
- **DOTS:** coefficients verified against published IPF sources; powerlifting blogs embed scoring tools their readers use weekly.
- **Student Loan IDR:** uses current-year HHS poverty guidelines and flags the post-2025 forgiveness tax bomb.

## Timing plays

- **Tax season (Jan–Apr):** mileage deduction + paycheck calculators. Pitch tax blogs early December.
- **January:** trainer tools (New Year client surge), savings goal, debt payoff.
- **Spring (Mar–May):** landscaper and construction waves — mulch, concrete, framing, bid sheet.
- **August:** final grade, GPA, student tools.
- **Q4:** quota attainment ("am I going to hit my number"), prime cost (year-end P&L review).

## Measurement

- UTM tags on outreach links where possible: `?utm_source=outreach&utm_medium=embed`
- Watch Search Console for new referring domains once the custom domain is live.
- An embed that renders counts double: it's a backlink AND a traffic channel.
