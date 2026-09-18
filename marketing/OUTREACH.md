# CalcStack Embed Outreach Kit

Goal: backlinks + embedded calculators on other people's sites. Every embed carries a
"Powered by CalcStack" link — that is the SEO engine. This kit is for manual, honest outreach:
personalized, one at a time, no blasts.

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
