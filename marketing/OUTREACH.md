# CalcStack Embed Outreach Kit

**Status: 370 calculators live (596 indexed pages). See LAUNCH.md for the domain-day
sequence.** Goal: backlinks + embedded calculators on other people's sites. Every embed carries a
"Powered by CalcStack" link — that is the SEO engine. This kit is for manual, honest outreach:
personalized, one at a time, no blasts.

The outreach destination is the embed gallery: https://calcstack-eight.vercel.app/embeds —
live working preview on-page, size presets, one-click copy for all 300 tools.

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
| Small business owners | PTET Election, Nanny Tax, QBI-adjacent tools | CPA/tax blogs, /r/tax and /r/smallbusiness answer threads, S-corp community newsletters, bookkeeping firm blogs |
| Parents & families | Trump Account, Custodial Roth, 529-vs-Trump-vs-Roth, Nanny Tax | Parenting finance blogs, college-planning sites, nanny agency resource pages, family-money newsletters |
| Eldercare & senior finance | LTC Cost, LTC Insurance vs Self-Fund, Hybrid vs Traditional LTC, Medicaid Spend-Down, RMD, Social Security Breakeven | Elder law firm blogs, caregiver forums (AgingCare-style), senior living referral sites, fee-only advisor newsletters, /r/AgingParents answer threads |
| Founders & startup equity | QSBS Exclusion, QSBS 1045 Rollover, PTET Election, QBI Deduction | Startup law blogs, founder communities (Indie Hackers-style), VC/advisor newsletters, /r/startups and /r/ycombinator answer threads, cap-table tool blogs |
| Real estate investors | 1031 Exchange, Depreciation Recapture, Cost Segregation, Rental Depreciation, Cap Rate | BiggerPockets-style blogs and forums, landlord associations, RE tax CPA blogs, property-management company blogs, /r/realestateinvesting answer threads |

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

## Wave 47 — New money rules 2026 (#247–#252)

Fresh angles nobody else has calculators for yet. All six are 2026-specific, which is the pitch:
every big site is still showing 2025 rules.

- **Car Loan Interest Deduction** — new §163(h)(4) deduction ($10k cap, phases out over
  $100k/$200k, US-assembled vehicles only, VIN required on the return). Pitch car-buying blogs
  and auto YouTube descriptions: "your 2025 car-loan articles are missing the new deduction."
- **Trump Account** — the $1,000 federal seed for 2025–28 births plus $5k/yr contributions.
  Parenting blogs are drowning in explainers with zero math; the embed IS the math.
- **Custodial Roth IRA** — teen summer-job money at 0% tax into a Roth. Pitch to parenting and
  first-job content: the "your kid's $3,000 lifeguard wage becomes $100k+" angle.
- **529 vs Trump vs Roth 3-way** — the only tool that runs the same dollars through all three
  vehicles including FAFSA treatment. College-planning blogs and fee-only advisor newsletters.
- **Nanny Tax** — $58/week makes you an employer; shows both FICA shares, FUTA, and the
  dependent-care FSA offset. Pitch nanny agencies' resource pages and parenting finance blogs —
  the "1099 your nanny is misclassification" angle is worker-protection content.
- **PTET Election** — the SALT-cap workaround with the QBI haircut included. The honest
  "electing can LOSE $264 when the cap wasn't binding" framing is the pitch to CPA bloggers
  tired of one-sided PTET hype. Target /r/tax answer threads and small-business tax
  newsletters during Q4 entity-planning season.

Timing: all six peak December–April (year-end planning → filing season). PTET leads the wave —
Q4 is when entities elect.

## Wave 48 — Eldercare funding (#253–#256 + retirement backlist)

The four-tool journey no competitor has: price the care, price the insurance, price the policy
type, price the Medicaid fallback. Every eldercare site has articles; none have the math inline.

- **LTC Cost** — 2025 CareScout medians with the counterintuitive headline: full-time home care
  ($80,080/yr) now costs MORE than assisted living ($74,400/yr). Pitch caregiver forums and
  senior living blogs: "your readers are making the home-vs-facility call on vibes."
- **LTC Insurance vs Self-Fund** — the breakeven-months framing (invested premiums cover ~14
  months; the pool covers 32). Fee-only advisor newsletters love a tool that isn't sold by an
  insurance agent.
- **Hybrid vs Traditional LTC** — the honest "$183k vs $75k true cost" comparison. Nobody else
  quantifies what "money back if you don't use it" actually costs. Pitch insurance-adjacent
  finance blogs tired of carrier-written content.
- **Medicaid Spend-Down** — three tests at once: $2,000 asset limit, CSRA $32,532–$162,660,
  and the lookback penalty in private-pay dollars ("your $100k gift = 9.4 months × $10,645").
  Elder law firm blogs are the prime target: every firm publishes the same lookback explainer,
  and an embeddable calculator makes theirs the one that ranks.
- **Backlist cross-pitch** — RMD and Social Security Breakeven ride along in the same emails
  to retirement-focused sites.

Timing: evergreen, but peaks with family gatherings (holidays → "Mom can't live alone"
conversations) and open enrollment. Elder law blogs update their figures every January — pitch
them in December before they rewrite.

## Wave 49 — Founder & startup equity (#252, #257, #258)

Every startup-law blog has a QSBS explainer; none have the calculator. Post-OBBBA confusion is
the opening — founders keep asking which regime their stock is in.

- **QSBS Exclusion** — both regimes side by side (legacy $10M cliff vs OBBBA 50/75/100% tiers,
  $15M/10×-basis cap), plus the rate nuance everyone gets wrong: the 28% + NIIT rate hits only
  the non-excluded slice when a tier is active; below the tier it's ordinary 23.8%. Pitch:
  "your QSBS article is pre-OBBBA — embed the calculator that knows both regimes."
- **QSBS 1045 Rollover** — the escape-hatch tool: recognized gain = unreinvested proceeds,
  basis reduction, holding-period tacking (including the acquisition DATE — no regime upgrade).
  Angel-investor newsletters and secondary-market blogs (tender-offer season is the trigger).
- **PTET Election** — from wave 47, cross-pitch here: founders with S-corp/LLC income are the
  exact audience, and Q4 is election season.
- **QBI Deduction** — backlist ride-along for the same readers; 2026 thresholds and the widened
  $75k/$150k phase-in ranges are already live in the tool.

Timing: exits and tender offers cluster Q4 and post-funding-announcement; secondary marketplaces
publish liquidity guides continuously. /r/ycombinator and founder Discords: answer-first, link
only when the math is the answer (Template C).

## Wave 50 — Real estate investor tax (#259–#261)

The hold-sell-exchange trilogy every landlord hits, with the math competitors leave out.

- **1031 Exchange** — the only free calculator showing BOTH cash boot and mortgage boot, with
  25% recapture-first ordering on the taxable piece. Pitch QI (qualified intermediary) company
  blogs: their entire business is people Googling "1031 exchange calculator" — embed ours and
  their content converts better.
- **Depreciation Recapture** — the "depreciation was a loan" framing, §1250's 25% cap vs
  §1245's ordinary rates, and the allowed-vs-claimed trap (IRS recaptures depreciation you
  never took). Landlord forums and property-management blogs: the pre-listing reality check.
- **Cost Segregation** — 100% bonus is permanent (OBBBA §70301) and the study is what makes a
  building eligible; honest netting of study fee + §1245 recapture delta. Pitch cost-seg firm
  blogs directly — a calculator that proves the ROI of their $5k study sells the study for them.
- **Backlist ride-alongs** — Rental Depreciation, Cap Rate, Rent vs Buy for the same sites.

Timing: Q4 acquisition season (bonus depreciation makes year-end closings tax-urgent) and
listing season (spring). /r/realestateinvesting: answer-first on boot and recapture threads —
the mortgage-boot correction alone earns the link.

## Wave 51 — Small-business owner tax (#252, #262–#265)

The entity-owner playbook: six tools that collectively price the entire S-corp/LLC
tax strategy stack competitors cover one article at a time.

- **S-corp Reasonable Salary** — the headline. Payroll tax saved (15.3% on distributions)
  minus QBI lost (6.4¢/salary-dollar at 32%) = real net, plus the <40%-of-profit
  reclassification risk flag. Nobody else prices BOTH sides of the trade. Pitch
  small-business CPA blogs and /r/smallbusiness salary threads — answer-first on
  "how much salary should I pay myself" questions, which recur weekly.
- **Accountable Plan** — the boring $3k/year everyone misses. S-corp owners who pay
  expenses personally deduct NOTHING post-OBBBA. Pitch bookkeeper blogs: it's a
  one-page document they can sell as a service, and our calculator sizes it.
- **Augusta Rule** — the viral one. 14 days × FMV rent = tax-free income. High share
  potential on X/LinkedIn finance accounts; the day-15 cliff framing is the hook.
- **PTET Election** — 36 states, the SALT workaround with the QBI haircut honestly
  netted. State-society-of-CPAs newsletters in PTET states (CA, NY, NJ, IL lapsed —
  that's a story too).
- **STR/REPS** — W-2 earners with an Airbnb; ≤7-day stay + material participation.
  Cross-pitch to the RE investor blogs from wave 50.
- **QBI Deduction** (backlist) — the anchor tool for every pitch in this wave.

Timing: entity-election season (S-elections for 2026 must be filed by March 16) and
year-end planning. r/smallbusiness, r/taxpros (carefully — they're skeptical; lead
with the QBI-lost math), CPA firm newsletters, SCORE/SBA-adjacent blogs.

## Wave 52 — Estate & family money (#266, #268–#270)

The "what happens when someone dies" cluster — the highest-stakes searches with the
worst existing content (most competitors are estate-attorney lead-gen fluff).

- **Step-Up Basis** — the anchor. §1014 erases decades of gain AND recapture; the
  community-property double step-up (9 states) is the angle nobody else computes.
  Pitch estate-planning attorney blogs and elder-law sites: their clients ask "should
  mom sell the house now or later?" — our calculator IS the answer, and linking it
  makes their "don't sell" advice concrete. Also "upstream gifting" content angle for
  financial-planner blogs.
- **Inherited IRA 10-Year Rule** — the post-SECURE-Act confusion is still peaking:
  most heirs still believe "empty by year 10, whenever." The 2024 final regs (annual
  RMDs years 1–9 if owner died post-RBD) are the correction that earns links.
  Steady-vs-lump crossover bracket is a unique computation. Pitch /r/personalfinance
  inheritance threads (weekly), AARP-adjacent content, beneficiary-form marketing
  from custodians.
- **Kiddie Tax** — three-layer math with the Form 8814 election flag. Pitch
  529-plan blogs and college-savings content: "your UTMA has a tax leak" is a
  natural hook for 529 marketing sites. Grandparent-gifting angle for wealth blogs.
- **NIIT + Additional Medicare** — frozen-2013 thresholds = bracket creep story.
  Pairs with Roth-conversion content; pitch to fee-only planner blogs doing
  year-end conversion analyses.
- **Backlist ride-alongs** — Estate Tax, Gift Tax, RMD, Social Security Breakeven
  for the same elder-finance sites.

Timing: Q4 estate-planning season (year-end gifting, upstream gifting before Dec 31,
RMD deadlines). /r/EstatePlanning and /r/personalfinance: answer-first on
"inherited mom's house, sell or keep" threads.

## Wave 53 — Career shock & family credits (#273–#275, bonus-tax upgrade)

The layoff toolkit — content that spreads by word of mouth because everyone
forwards it to the person who just got let go.

- **Layoff Runway** — the "how long can I last" number. Two-phase UI burn model,
  COBRA lever priced, NET severance honesty (links the severance calc first).
  Pitch: /r/layoffs and /r/personalfinance job-loss threads (answer-first with the
  12.1-month example), career coaches, outplacement firm blogs — their whole
  product is this moment and they have no tools.
- **Severance Pay** — the December-vs-January timing play ($4,974 on a $50k
  package) is a unique computation nobody else shows. Pitch employment-law and
  HR blogs: "negotiate timing, not just amount" is a fresh angle for their
  severance-negotiation content.
- **Bonus Tax (upgraded)** — now the only calculator with BOTH Pub. 15-T methods:
  flat 22% vs aggregate annualization. The "why did they hold $5,900 on my $21k
  commission check" search is massive and every existing answer is wrong or vague.
  Pitch sales-comp blogs, /r/sales commission threads.
- **Adoption Credit** — 2026's $5,120 refundable piece is NEWS. Pitch
  foster-to-adopt Facebook groups' blogs, adoption agency resource pages, and
  family-finance podcasts: "special-needs full credit regardless of expenses"
  is the most underclaimed benefit in the code and agencies love sharing tools
  that help families afford adoption.
- **Backlist ride-alongs** — COBRA Cost, W-4 Optimizer, Emergency Fund for the
  same audiences.

Timing: layoff news cycles (any major layoff announcement spikes searches),
open enrollment (Oct–Dec for the COBRA-vs-ACA angle), adoption finalization
clusters in November (National Adoption Month) — wave 53 goes out in October.

## Wave 54 — Public-employee retirement (#276–#280)

Teachers, firefighters, police, state workers — organized audiences (unions,
associations, retiree groups) that share tools with members. The pitch is always
"free calculator for your members," not SEO.

- **457(b)** — the door-opener. "Your members have TWO $24,500 buckets" is news to
  most. Pitch NEA/AFT state affiliate blogs, university HR resource pages, hospital
  system intranets. The final-3-years $49,000 catch-up is the hook for 55+ members.
- **Fairness Act (WEP/GPO)** — still the emotional one. Widows who never filed
  because GPO zeroed them = untapped audience. Pitch retiree associations
  (NRTA, state teacher-retiree groups), police/fire union newsletters.
  Verify-your-SSA-adjustment angle earns trust over hype.
- **DROP** — police/fire specific. FOP and IAFF local newsletters; DROP-entry
  timing questions hit every eligibility class. The 20%-withholding rollover trap
  is the shareable nugget.
- **Pension vs Social Security** — career-fork content for recruiting pages and
  EARLY-career teacher groups (r/Teachers career threads).
- **PSLF** — crossover with the student-loan audience; teacher/nurse/government
  forums. The "negative amortization is fine" correction earns the link.
- **Backlist ride-alongs** — TSP, 403(b), Social Security PIA for the same sites.

Timing: open enrollment season (Oct–Nov) when HR sends benefits emails — unions
and HR pages update resources then. DROP/PSLF are evergreen; Fairness Act content
peaks again at tax season when the 2026 SSA-1099s arrive.

## Wave 55 — Retirement income & Roth mastery (#281–#285)

The retirement-income cluster: Roth conversions, Social Security claiming, and
coast FIRE. Audiences: Bogleheads forum, r/personalfinance and r/financialindependence
wikis, AARP-adjacent retiree blogs, fee-only planner newsletters, early-retirement
podcasts/show-note pages.

- **Bracket-filler (#285)** — the flagship pitch. "Convert to the exact top of the
  22% bracket, then check the IRMAA cliff two years out" is the planner-grade nuance
  that earns links. Pitch Bogleheads Roth-conversion threads and planner newsletters.
  December is peak season — conversions must settle by Dec 31.
- **Roth 5-year rule (#281)** — the three-clocks explainer. Every conversion-ladder
  thread on r/financialindependence eventually argues about seasoning; this settles it.
  Pitch FIRE subreddit wikis and early-retirement blogs (Mad Fientist-adjacent).
- **Spousal + Survivor SS (#282, #283)** — the pair. Spousal deemed-filing trap and
  the survivor switch (the last legal claim-now-switch-later) are both
  correction-content gold. Pitch widow/widower support orgs, AARP community
  moderators, SSA-answers blogs. Survivor content is evergreen and high-trust.
- **Coast FIRE (#284)** — r/coastFIRE and r/financialindependence sidebar material.
  The "day saving becomes optional" framing is the shareable hook; the honest
  real-return/SWR discussion is what earns the wiki link.
- **Backlist ride-alongs** — conversion ladder, mega-backdoor, pro-rata, safe
  withdrawal, IRMAA for the same sites. The Roth cluster now interlinks.

Timing: Roth content peaks Nov–Dec (year-end conversion deadline) and again at tax
season. Social Security claiming content is evergreen; survivor content spikes sadly
but reliably. Coast FIRE peaks January (resolution season).

## Wave 56 — Social Security claiming & early access (#288–#290, plus SS backlist)

The SS claiming suite is now six deep — pitch the CLUSTER, not a single tool.
Audiences: retiree forums (AARP community, RetirementWeb), widow/widower orgs
(Grief-support and financial-transition nonprofits), 55–62 pre-retiree groups,
federal-employee communities (FedPilot-style blogs), fee-only planner newsletters.

- **SS Bridge (#289)** — the flagship. "Delaying 62→70 is a $147,840 annuity
  purchase at a 9.6% COLA payout" converts a tired debate into a transaction.
  Pitch Bogleheads SS threads, Early Retirement Now–adjacent blogs, planner
  newsletters. The survivor-benefit multiplier angle (delay protects the widow)
  is the emotional close.
- **Earnings test (#288)** — correction content: "withheld ≠ lost" and
  "IRA withdrawals don't count, wages do" are the two hooks. Pitch
  working-retiree content sites and SSA-answers blogs. Tax season + January
  SSA-1099 mailings are the peaks.
- **Survivor + spousal (#283, #282)** — ride-along anchors for widow/widower
  orgs; the survivor switch (exempt from deemed filing) is genuinely news to
  most advisors' clients. High-trust evergreen content.
- **Rule of 55 + 72(t) (#290, #286)** — the 55–59 early-access pair. Pitch
  r/financialindependence, retire-early forums, public-safety union newsletters
  (age-50 rule for police/fire/EMS is the hook). The "IRA rollover kills it"
  warning is the shareable nugget.
- **HSA Medicare trap (#287)** — crossover for 65+ still-working audiences;
  HR benefits blogs and Medicare-adjacent newsletters. Open enrollment season.
- **Backlist ride-alongs** — PIA, breakeven, Fairness Act, bracket-filler,
  IRMAA for the same sites. Interlinking is the pitch: "a suite, not a page."

Timing: SS claiming content is evergreen with January (SSA-1099/COLA letters)
and open-enrollment (Oct–Nov) peaks. Rule-of-55 spikes in layoff news cycles.


## Wave 57 — Home equity & the wait-for-rates debate (#296–#300, milestone wave)

Milestone wave: 300 calculators live. The home-equity trio plus the
buy-now-vs-wait ledger — pitch as a suite to real estate and mortgage audiences.
Audiences: real estate blogs (BiggerPockets-adjacent), mortgage broker
newsletters, r/FirstTimeHomeBuyer and r/RealEstate wikis, credit-union content
pages, home-renovation contractor blogs, housing-market Substack writers.

- **HELOC vs cash-out refi (#298)** — the flagship pitch. "The effective rate on
  the cash" is a genuinely novel frame: a 3.5% holder pulling $50k via a 6.5%
  cash-out pays 10.9% on that cash. Every mortgage blogger has written the
  surface version of this comparison; nobody shows the solved rate. Correction
  content earns links.
- **HELOC (#297)** — the repayment-shock angle: "$354/mo for ten years, then
  $434 for twenty" plus the post-TCJA deductibility rule (improve-the-home or
  nothing). Pitch credit-union resource pages and renovation-cost blogs.
- **Home equity loan (#299)** — the "boring option wins" story: same rate,
  $36k vs $90k lifetime interest. Counter-intuitive and shareable. Pitch
  debt-consolidation and home-improvement financing content.
- **Cost of waiting (#300)** — the rate-watchers' reality check: 1-point hope,
  $206/mo saving, $38,400 burned, 21-year payback. Perfect timing: the entire
  housing-commentariat audience is waiting for rate cuts RIGHT NOW. Pitch
  housing Substacks, first-time-buyer forums, and realtor newsletters — the
  "date the rate" argument with the math actually done.
- **QLAC (#296)** — retirement crossover for the same finance newsletters;
  $210k RMD exclusion is the hook.
- **Backlist ride-alongs** — mortgage PITI, refinance break-even, DTI, rent vs
  buy for the same sites. The housing cluster now interlinks end to end.

Timing: rate-cut expectations make cost-of-waiting evergreen-hot through 2026;
HELOC content peaks in spring renovation season (Mar–May) and again in fall
home-improvement cycles (Sep–Oct).

## Wave 58 — Insurance gaps, life decisions & career money (#311–#330)

Thirty calculators across three clusters since the milestone — pitch each to
its own audience, or the whole set as "the decisions nobody prices."

- **Insurance gap cluster (#311–#315)** — deductible optimizer (premium saved
  vs exposure priced), umbrella insurance at ~$1/day per $1M, the
  drop-full-coverage breakeven, home insurance adequacy vs rebuild cost, term
  life ladder. Pitch: insurance consumer blogs, personal-finance newsletters,
  r/Insurance and r/personalfinance wikis. The "you're paying $400/yr to
  insure a $1,000 risk" frame earns links.
- **Life-decision cluster (#316–#319)** — barista FIRE (Coast's working
  sibling), lifestyle creep amortized, true commute cost, daycare vs second
  income. Pitch: FIRE subreddits and blogs, parenting newsletters, dual-income
  household content. Daycare-vs-second-income is the shareable one — the
  career-interruption cost dwarfs the salary comparison.
- **Career money suite (#320–#330)** — fixed-bid and retainer pricing,
  S-corp election with the honest net, RSU vest tax, ISO vs NSO with the AMT
  shadow, startup offer EV (probability-weighted equity vs the salary cut),
  grad school ROI, certification ROI with study hours priced, the job-hop
  premium vs the loyalty tax, the walk-away number, unpaid internship true
  cost. Pitch: Blind/levels.fyi-adjacent blogs, tech-worker newsletters,
  career Substack writers, HR/benefits blogs, r/cscareerquestions and
  r/ExperiencedDevs wikis, grad-school forums, career-coach resource pages.
- **Flagship pitches** — startup-offer EV ("0.1% with a $20k strike is $68k
  of expected value — the salary cut is $120k") and walk-away number ("the
  $105k offer that feels like a raise is a pay cut") are the correction
  content that earns backlinks: everyone writes negotiation advice, nobody
  publishes the arithmetic.
- **Backlist ride-alongs** — salary-offer comparison, RSU vest tax, bonus
  tax, 1099-vs-W2, freelance rate for the same career audiences. The careers
  cluster now interlinks offer → negotiate → equity → switch → educate.

## Wave 59 — Trade business operations suite (#331–#340, milestone wave)

Milestone wave: 340 calculators live. Ten calculators that run a trade business
end to end — pitch as "the back office nobody teaches" to contractor audiences.
Audiences: contractor podcasts and YouTube (trade-business coaches), HVAC /
plumbing / electrical trade associations' newsletters, r/Construction and
r/HVAC professionals threads, ServiceTitan/Housecall Pro user communities,
trade-school instructor resource pages, equipment-dealer content marketing.

- **Labor burden (#331)** — the foundation pitch: "$25/hr tech costs $37.32 per
  billable hour" plus the margin-vs-markup trap ($46.65 vs $44.79). Every
  trade-business coach teaches this; nobody's calculator prices it line by line.
- **Job costing (#332)** — the full bid stack with overhead allocation. Pair
  with #331 as the two-part series pitch.
- **Equipment hourly cost (#333)** — own vs rent by utilization; the 516-hr
  breakeven frame is instantly quotable. Pitch equipment-dealer blogs.
- **Overtime vs hire (#334)** — chronic OT priced as the loan it is; 5.4-week
  hire payback. Staffing-agency content and trade-hiring newsletters.
- **Warranty reserve (#335)** — callbacks as % of revenue with a 2σ buffer;
  "the callback rate is a quality metric with a dollar sign."
- **Bid win rate (#336)** — the pipeline breakeven: 18.2% win rate or the
  estimating loses money. The qualification-first fix is the correction content.
- **Maintenance agreement (#337)** — the $199 agreement nets 7.5%; floor $230.
  HVAC business coaches will cite this one.
- **Seasonal cash reserve (#338)** — winter deficit sized and funded in season;
  "banks lend umbrellas in sunshine."
- **Service call fee (#339)** — dispatch true cost $61 → publish $89 credited;
  the fee-as-filter argument. High engagement in trade communities.
- **LTV vs CAC (#340)** — margin-dollar LTV and the lost-bid CAC correction;
  the 3:1 floor and max sustainable CAC. Crossover to marketing newsletters.
- **Backlist ride-alongs** — markup-margin, bid sheet, snow-removal bid, lawn
  pricing, prime cost for the same audiences. The trades category now covers
  materials, estimating, staffing, equipment, cash flow, and growth.

Timing: spring hiring season (Mar–Apr) for #334/#331; pre-winter (Oct–Nov) for
#338; #337 pitches during shoulder seasons when agreements are sold.

## Wave 60 — Home energy & replacement decisions (#341–#350, milestone wave)

Milestone wave: 350 calculators live. The homeowner decision suite — repair vs
replace, efficiency paybacks ranked honestly, and the utility-bill calculators.
Audiences: home-improvement blogs, energy-efficiency and green-home newsletters,
utility consumer-education pages, r/HomeImprovement and r/hvacadvice wikis,
pool-owner forums, EV-owner communities (TOU content), homesteading/preparedness
blogs (generator).

- **Repair vs replace (#341)** — the $5,000 rule done properly with the future-
  failures ledger. HVAC-content crossover; the refrigerant phase-out angle is
  timely correction content.
- **Tank vs tankless (#342)** — "the tank wins at moderate use" is the
  counter-brochure headline; plumbing blogs and water-heater buyer guides.
- **Generator vs outage (#343)** — the sump-flood risk line dominating the math;
  storm-season timing (May–Jun hurricane prep, Oct–Nov winter storm prep).
- **Smart thermostat (#344)** + **LED conversion (#346)** — the positive-ROI pair:
  months-level paybacks. Utility consumer-education pages love these.
- **Window ROI (#345)** — the correction flagship: "43.6-year payback" headline
  with the 5× alternatives. Energy auditors and honest window contractors will
  cite it; pitch green-building blogs hard.
- **Phantom load (#347)** — charger-myth correction ("45 cents of theater") is
  the shareable detail. Tech and home-efficiency crossover.
- **Attic insulation ROI (#348)** — 1/R diminishing returns with the 30% federal
  credit; DIY blown-insulation angle for weekend-project audiences.
- **VS pool pump (#349)** — cube-law savings; pool forums and sunbelt utility
  pages. Peak pool season (Apr–Jun) timing.
- **TOU rate switch (#350)** — the breakeven peak share; EV-owner communities
  and solar-adjacent newsletters (NEM 3.0 angle for CA audiences).
- **Backlist ride-alongs** — solar payback, heat pump vs furnace, EV vs gas,
  pool volume/chemical suite. The energy cluster now interlinks audit → envelope
  → devices → rates.

## Wave 61 — Solar ownership & home fuel decisions (#351–#360, milestone wave)

Milestone wave: 360 calculators live. Solar through the full ownership lifecycle —
sizing, quote checking, lease vs buy, degradation, removal/reinstall — plus the
electrification paybacks (HPWH, duct sealing, induction). Audiences: solar
consumer-advocate blogs, r/solar wiki and SolarReviews-style communities,
green-building newsletters, electrification advocates (Rewiring America
audience), utility consumer-education pages, home-inspector content.

- **Home battery ROI (#351)** — the "backup math, not bill math" correction;
  NEM 3.0 California angle is the traffic hook.
- **Solar lease vs buy (#352)** — the escalator-clause exposé; homeowner
  advocacy blogs. Strong shareable: "the 2.9% escalator eats the savings."
- **Solar quote checker (#353)** — $/W against benchmark with the dealer-fee
  financed-price trap. The single most linkable anti-scam tool in the suite.
- **Solar sizing (#354)** — bills-to-panels arithmetic with EV/heat-pump future
  loads sized in NOW. Pre-quote homework tool.
- **EV home charging (#355)** — public-charging dependence tax + install-payback;
  EV forums and workplace-charging content.
- **Solar degradation (#356)** — converts warranty fine print into a panel-tier
  price decision. Data-nerd crossover (NREL study citations).
- **Solar removal & reinstall (#357)** — the roof-age trap; roofing + solar
  coordination content. Home inspectors will cite this one.
- **Heat pump water heater (#358)** — the cheapest big win in an electric home;
  electrification newsletters and utility rebate pages (rebate-stack content).
- **Duct sealing ROI (#359)** — "seal ducts before buying equipment" sequencing
  correction; HVAC-trade crossover and energy-auditor content.
- **Induction vs gas (#360)** — the honest verdict ("induction costs MORE on
  energy — switch for speed and air quality") is the credibility play; indoor-
  air-quality and healthy-home audiences.
- **Backlist ride-alongs** — solar payback, heat pump vs furnace, TOU switch,
  smart thermostat, LED, attic insulation. The energy cluster now covers the
  full sequence: audit → envelope → ducts → equipment → rates → solar → battery.

## Wave 62 — Home-risk & landlord operations (#361–#370, milestone wave)

Milestone wave: 370 calculators live. Two mini-suites: home-risk decisions
(waterproofing, radon, sewer, gutters) and landlord operations (turnover,
pricing, reserves, make-ready, pets, management). Audiences: BiggerPockets and
landlord forums, r/Landlord and r/realestateinvesting wikis, property-management
blogs, home-inspector content sites, radon/waterproofing contractor blogs
(the honest-math angle flatters the good ones), basement-health newsletters.

- **Waterproofing ROI (#361)** — expected-value framing with the insurance
  exclusion front and center; home-inspector and foundation-repair crossover.
- **Radon mitigation (#362)** — the smoking-multiplier math is the shareable
  ("radon math is smoking math"); EPA/WHO-citable content for health blogs.
- **Sewer line cost (#363)** — "what sits above the pipe decides the job";
  trenchless-vs-trench correction content for plumbing blogs.
- **Gutter guard ROI (#364)** — the honest "guards halve cleaning, never zero
  it" verdict; seasonal (fall) timing for home-maintenance newsletters.
- **Tenant turnover cost (#365)** — the raise-breakeven framing is catnip for
  landlord podcasts and BiggerPockets; "retention is the cheapest revenue."
- **Rent vs vacancy pricing (#366)** — "the last $100 of ask is the most
  expensive money in landlording"; pricing-discipline content for PM blogs.
- **Maintenance reserve (#367)** — itemized CapEx beats the 1% rule; the
  "HVAC dies in July" hook. Rental-proforma and buy-box content crossover.
- **Make-ready estimator (#368)** — the $59/day vacancy meter; durable-grade
  spec (LVP over carpet) content for rehab audiences.
- **Pet policy (#369)** — pet-rent-vs-deposit expected value + Fair Housing
  ESA line; strong engagement topic, heavy comment-section bait.
- **PM vs self-manage (#370)** — the breakeven hourly ($50/hr at defaults);
  pitch landlord-software blogs and real-estate newsletters.
- **Backlist ride-alongs** — rental cash flow, cap rate, BRRRR, depreciation,
  cost segregation, STR loophole. The landlord cluster now runs acquisition →
  operations → tax in one interlinked set.
