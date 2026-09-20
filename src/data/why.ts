/* "Why people use this" — the use-case explanation for each calculator page.
   Rendered as its own section on calculator pages (SEO + genuine helpfulness). */
export const WHY_USE: Record<string, string> = {
  'freelance-rate-calculator':
    'People use this before quoting a single client. The most common freelance failure is copying a salary and dividing by 2,080 — which ignores unpaid admin, taxes, insurance, and gaps between contracts. This calculator exists because "what should I charge?" is really "what must I charge to not lose money," and that number is almost always higher than instinct says.',
  'salary-to-hourly-calculator':
    'Job offers, freelance gigs, and overtime decisions all boil down to one question: what is my time actually worth? People use this to compare a $72K salary against a $38/hour contract, to see what a raise is really worth per hour, and to convert gig work into an honest yearly number before committing.',
  'paycheck-calculator':
    'People use this the day they get an offer letter, when they are planning a move to another state, and every time a paycheck looks wrong. It answers the gap between the salary you negotiated and the money that actually lands — and shows exactly which government layer took what.',
  'mortgage-payment-calculator':
    'This is the biggest purchase of most people\'s lives, and the payment the bank quotes is never the full one. People use this before house hunting (to set a real budget), before refinancing (to see if the new rate actually saves money), and when deciding between 15 and 30 years — a choice worth six figures.',
  'compound-interest-calculator':
    'People use this to make abstract saving goals visceral: what does $300 a month actually become? It is the calculator financial advisors show clients to end the "I\'ll start next year" debate, and the one that convinces 25-year-olds that starting now matters more than starting big.',
  'savings-goal-calculator':
    'A house deposit, an emergency fund, a wedding, a sabbatical — every goal is a wish until it has a monthly number. People use this to convert "I want $20,000 in two years" into "$812 a month," and to find out honestly whether the plan fits the budget before committing to it.',
  'loan-payoff-calculator':
    'People use this when they get a raise, a bonus, or a tax refund and face the classic question: throw it at the loan or not? It shows exactly what an extra $50 or $500 a month does to a car loan, student loan, or personal loan — the months erased and the interest saved, in dollars.',
  'heat-pump-vs-furnace-calculator':
    'Homeowners facing a furnace replacement use it with the gas bill in hand: the answer is genuinely rate-dependent — the heat pump loses at some price combinations and wins big at others — and the avoided-AC-replacement offset is the factor HVAC quotes leave out.',
  'ev-vs-gas-cost-calculator':
    'Car shoppers use it after the dealer quote, when the EV premium is a real number: with the federal credit gone since late 2025, the case rests on home-charging math and maintenance, and the breakeven year decides whether the premium is an investment or a donation.',
  'solar-payback-calculator':
    'Homeowners holding an installer quote use it to check the pitch: with the federal credit gone since January 2026, the honest drivers are the electric rate, net-metering terms, and state rebates — and the gap between a 9-year and a 21-year payback is exactly those three inputs.',
  'heloc-calculator':
    'Homeowners quoted a $354 interest-only payment use it before signing: the same $50,000 draw jumps to $434 when repayment starts and costs $96,639 in interest over the life — and the interest is deductible only if the money improves the house.',
  'heloc-vs-cash-out-refi-calculator':
    'Homeowners choosing between equity products use it to expose the number lenders never print: pulling $50k from a 3.5% mortgage via a 6.5% cash-out refi is an effective 10.9% loan on the cash — while a 6.8% holder refinancing down gets it nearly free.',
  'home-equity-loan-calculator':
    'Owners with a known one-time expense use it to see the boring option win: $50k at 8% fixed costs $36,009 in interest against the HELOC\'s $90,373 at the same rate — and the 80% CLTV cap decides how much equity is actually borrowable.',
  'cost-of-waiting-calculator':
    'Buyers holding off for lower rates use it to price the wait itself: a 1-point drop saves $206/mo on a $400k home, but 3% price growth plus $24k of rent turns that into a 21-year payback — breakeven appreciation is the deciding number.',
  'renovation-roi-calculator':
    'Owners weighing a remodel use it before signing the contract: 2025 Cost vs Value data says the garage door returns 268% and the upscale suite addition 18% — so the tool reframes big interior projects as a per-year cost of enjoyment, not an investment.',
  'contractor-bid-comparison-calculator':
    'Owners with three quotes use it before signing: exclusions and schedule get priced back in, and the $46.5k bid with $4k of gaps exposes itself as a $50.5k project — while a bid 15% under the middle triggers the change-order warning.',
  'diy-vs-hire-calculator':
    'Weekend warriors use it to settle the debate with arithmetic: a $600 pro-DIY gap is $50/hr of untaxed wages (the $800 pro bill takes $1,143 of gross salary at 30%) — with the 15% botch chance priced in before the verdict.',
  'house-flip-calculator':
    'Investors use it before writing the offer: the 70% rule sets a $220k ceiling on a $400k-ARV/$60k-rehab deal, and the full P&L shows $71.2k profit on $50.8k cash — plus the amber flag when your offer crosses the ceiling.',
  'rental-cash-flow-calculator':
    'Investors use it before offering: the lender-grade model prices vacancy, management, and CapEx honestly, so a $300k/$2,400-rent deal at 7% shows its real face — −$152/mo, 0.90 DSCR — instead of the seller\'s proforma fiction.',
  'property-tax-appeal-calculator':
    'Owners holding an assessment notice use it before the deadline: implied market value vs comp-supported value × the tax rate shows a $35k over-assessment is $630/yr — $6,898 over a decade — for a filing most counties charge nothing for.',
  'hoa-true-cost-calculator':
    'Buyers comparing HOA vs non-HOA homes use it to convert the fee into house-price terms: $400/mo at 6.5% weighs like $63,284 of mortgage, and 5% growth turns the stream into $318,906 over 30 years — before the reserve-study questions that predict special assessments.',
  'seller-net-sheet-calculator':
    'Sellers use it before picking a list price: a $450k sale with a $280k payoff nets $133,500 after commission, closing, and concessions — and the post-2024 buyer-agent concession field keeps the sheet honest in the new commission landscape.',
  'mortgage-buydown-calculator':
    'Buyers negotiating seller concessions use it to pick the right structure: the 2-1 buydown\'s $7,625 evaporates after year two while the same dollars as permanent points pay $130/mo for the life of the loan — hold period decides.',
  'home-sale-capital-gains-calculator':
    'Sellers use it before listing: the 2-of-5-years rule turns a $350k gain into $0 or $15k+ of federal tax, job-move partial exclusions prorate the cap, and rental-period depreciation recaptures at 25% no matter what.',
  'deductible-optimizer-calculator':
    'Drivers and homeowners use it at renewal: the breakeven claim rate (one per 4.7 yrs on a typical $500→$2,000 move) against your real claim history turns a gut-feel choice into a $1,700-per-decade expected win — gated by the emergency fund.',
  'umbrella-insurance-calculator':
    'Households use it to size liability protection against reality: net worth plus 10 years of garnishable wages minus current limits shows an $850k/$90k family $550k exposed — closed by a $1M umbrella at roughly $225/yr.',
  'drop-full-coverage-calculator':
    'Owners of aging cars use it at renewal: premium as % of actual cash value plus the breakeven total-loss frequency shows a $4k car at $600/yr needs totaling every 5.8 years to break even — against a real frequency of once in 25.',
  'home-insurance-adequacy-calculator':
    'Homeowners use it at renewal: sqft × rebuild cost sets Coverage A (market value is land plus mood), the 80% coinsurance rule turns underinsurance into pro-rata partial payouts, and a 2% wind deductible is $7,000 in real dollars.',
  'term-life-ladder-calculator':
    'Parents sizing coverage use it to stop overpaying the back half: a 10/20/30 ladder delivers the same $1.5M early protection as a flat 30-year policy but expires with the mortgage — $22,490 cheaper over three decades.',
  'barista-fire-calculator':
    'Burned-out savers use it to price the middle path: $20k of chosen part-time income cuts the freedom number from $1.375M to $875k and pulls the date forward five years — with the job-loss shortfall shown before anyone quits.',
  'lifestyle-creep-calculator':
    'Anyone holding a raise uses it before absorbing it: $20k invested at 7% becomes $558k in 20 years, and the recurring-spend portion also inflates the FIRE target by 25× — the raise taxed at payroll and again at the finish line.',
  'commute-cost-calculator':
    'House hunters and job changers use it to price distance honestly: 25 miles each way is $15,240/yr all-in — the weight of $200,928 of mortgage — so the farther "cheaper" house must beat that gap before it saves anything.',
  'daycare-vs-second-income-calculator':
    'Parents weighing a return to work use it to see the stacked-tax truth: $45k gross becomes $642/mo after marginal taxes, $18k daycare, and work costs — plus the FSA, match, and career-gap offsets the short ledger misses.',
  'fixed-bid-pricing-calculator':
    'Freelancers use it before quoting: floor × hours × scope-risk multiplier turns a fuzzy 40-hour brief into a $5,700 bid whose ×1.5 absorbs 20 hours of creep — and the likely-hours check catches optimism before it signs.',
  'retainer-pricing-calculator':
    'Consultants use it to price certainty correctly: 20 guaranteed hours at 10% off outpay the same hours at 60% utilization by $570/mo — the discount is the client buying your availability, not your time cheap.',
  's-corp-election-calculator':
    'Independent professionals use it before electing: $120k profit at a $60k salary yields $7,775 gross SE-tax arbitrage, but payroll, prep, and the QBI drag take $4,288 — the honest net and the ~$31k breakeven decide.',
  'rsu-vest-tax-calculator':
    'Tech employees use it before vest day: 400 shares at $150 is $60,000 of ordinary income, the default 22% withholding leaves a $6,000 gap at the 32% bracket — and the sell-vs-hold frame ("would you buy it with cash?") settles the rest.',
  'iso-vs-nso-calculator':
    'Employees with options use it before exercising: NSO spreads tax at 35% immediately ($172.5k out on a $350k spread) while ISOs defer regular tax but cast a ~$91k AMT shadow — and the December exercise keeps the escape hatch open.',
  'ev-home-charging-calculator':
    'EV owners use it before the electrician visit: 60% public charging dependence costs $626/yr extra at 12k miles — a $1,200 Level 2 install pays back in 1.9 years, and credits halve the quote.',
  'solar-sizing-calculator':
    'Solar shoppers use it before the quote calls: a $210/mo bill at 4.5 sun-hours needs 11.7 kW — thirty panels on 600 sq ft — and the EV belongs in the size now, not as tomorrow\'s 40%-more-expensive add-on.',
  'solar-quote-checker-calculator':
    'Solar shoppers use it before signing: 8 kW at $28k is $3.50/W — $6,000 over benchmark — and the financed "low payment" hides a 20–30% dealer fee; counter at $2.60–2.75/W cash.',
  'solar-lease-vs-buy-calculator':
    'Homeowners use it before signing the solar contract: $150/mo with a 2.9% escalator totals $47,878 over 20 years while buying nets +$31,454 — the $28,278 gap is what the sales deck omits.',
  'home-battery-roi-calculator':
    'Solar homeowners use it before adding storage: plain TOU arbitrage pays $387/yr (10.9-yr payback — marginal), but NEM 3.0 export math pays $1,296/yr and returns in 4.9 — the tariff decides, not the battery.',
  'tou-rate-switch-calculator':
    'Households use it before switching plans: at 35% peak usage TOU saves just $47/yr as-is but $252 with real shifting — and above 38.5% peak share it loses unless the EV and the delay-start buttons do their job.',
  'variable-speed-pump-roi-calculator':
    'Pool owners use it before the old pump dies: the cube law means 300W × 10 hrs replaces 1,800W × 8 — $666/yr back, 1.7-year payback after the rebate, and the water filters better.',
  'attic-insulation-roi-calculator':
    'Homeowners use it before blowing insulation: R-19→R-49 on 1,200 sqft saves $245/yr — 7.3-year payback after the 30% credit — but from R-30 it stretches to 11.6 years, and air sealing beats both.',
  'phantom-load-calculator':
    'Homeowners use it to find the silent line on the bill: a 75W always-on base is $105/yr doing nothing — the cable box is a third of it, strips pay back in 6 months, and charger guilt is 45 cents of theater.',
  'led-conversion-calculator':
    'Homeowners use it for the easiest win in the house: forty $3 LEDs save $401/yr in energy and avoided bulbs — 4-month payback, 13.7-year lifespan, and the porch light always converts first.',
  'window-replacement-roi-calculator':
    'Homeowners use it before the showroom visit: twelve $800 windows save ~$220/yr — a 43.6-year payback on a 20-year warranty — while air sealing and attic insulation return 5× per dollar.',
  'smart-thermostat-roi-calculator':
    'Homeowners use it before the gadget purchase: $250 minus a $50 rebate against $198/yr of savings on a $2,200 HVAC bill — 15-month payback, and heat-pump owners must cap setbacks or the strips erase them.',
  'generator-cost-calculator':
    'Homeowners in storm country use it before the season: two outages plus a 4% sump-flood risk is $1,750/yr of expected loss — a $10k standby annualizes to $1,149, and the portable middle option is $186.',
  'tank-vs-tankless-calculator':
    'Homeowners use it before the water heater dies: annualized honestly with descaling, the $1,600 tank beats the $3,200 tankless $590 to $635 a year at moderate use — only high-volume households flip it.',
  'repair-vs-replace-calculator':
    'Homeowners use it when the tech quotes the fix: a $900 repair on a 12-year-old system scores 10,800 on the rule, and the 4-year ledger — future failures plus the energy penalty — says keeping it costs $7,312 vs $2,167 net to replace.',
  'customer-ltv-cac-calculator':
    'Service-business owners use it before raising ad spend: a $450 ticket at 1.6 calls/yr over six years is $1,728 of MARGIN — 9.6:1 against $180 CAC means you could profitably pay $576 per customer.',
  'service-call-fee-calculator':
    'Service shops use it before printing the fee schedule: 35 minutes of driving plus 30 diagnosing at burdened rates costs $61 before a wrench turns — publish $89 credited to the repair, because free calls subsidize shoppers.',
  'seasonal-cash-reserve-calculator':
    'Seasonal shop owners use it before the peak hits: $180k/$60k months at 35% margin mean a $56k winter deficit on a business that nets $168k — hold $84k and fund it $10,500/mo in season.',
  'maintenance-agreement-calculator':
    'HVAC and service shops use it before printing the price sheet: two tune-ups at burdened rates plus the member discount cost $184/yr — the classic $199 agreement nets 7.5%, and one callback erases the year.',
  'bid-win-rate-calculator':
    'Owners use it when the calendar is full but the bank isn\'t: twelve $400 estimates a month at 25% wins and 20% margins nets $1,800 — breakeven is 18.2%, and below it the estimating itself loses money.',
  'warranty-reserve-calculator':
    'Owners use it at budget time: 150 jobs at a 6% callback rate and $850 per callback is $7,650/yr of expected warranty work — reserve 0.76% of revenue booked monthly, and read the rate as the quality metric it is.',
  'overtime-vs-hire-calculator':
    'Shop owners use it when OT stops being a surge: four people on 10 chronic OT hours burn $2,235/wk at burdened rates — a $4,000 hire pays back in 5.4 weeks, and the fatigue costs never show on payroll.',
  'equipment-hourly-cost-calculator':
    'Owners use it before buying iron: a $55k skid steer is $26/hr at 1,000 hours a year but $44/hr at 400 — breakeven against the rental yard is 516 hours, and utilization is the only variable that decides.',
  'job-costing-calculator':
    'Contractors use it before quoting: $3,800 materials + 60 burdened labor hours + subs + overhead + contingency = $8,819 true cost — the 20%-margin quote is $11,024, and the shop bidding $8,400 isn\'t efficient, it\'s unpriced.',
  'labor-burden-calculator':
    'Owners use it before bidding: a $25/hr tech costs $37.32 per billable hour after taxes, comp, benefits, and non-billable time — and a 20% margin needs a $46.65 bill rate, not the $44.79 that "cost plus 20%" produces.',
  'unpaid-internship-calculator':
    'Students use it before accepting: a 12-week unpaid internship costs $12,000 against a $20/hr summer job — it must lift starting salary $1,782/yr to break even, and NACE data says paid interns get both more offers and higher starts.',
  'walk-away-number-calculator':
    'Candidates use it before the recruiter calls: on $100k total comp with a 10% risk premium and $8k of switching costs, the honest floor is $115,967 — the $105k offer that feels like a raise is a pay cut you chose under adrenaline.',
  'job-hop-calculator':
    'Employees with an offer in hand use it before deciding: a 15% hop on $80k is +$58,710 over five years after switching costs, and the breakeven premium is just 1.3% — but unvested equity and bonus timing decide what the switch really costs.',
  'certification-roi-calculator':
    'Professionals use it before enrolling: a $1,500 cert with 150 study hours really costs $9,250 with expected retakes — a $10k/yr raise pays it back in 11 months, but only where job posts actually filter on the credential.',
  'grad-school-roi-calculator':
    'Professionals use it before applying: a $60k master\'s plus two years out of a $70k job really costs $192k in present value — a $25k/yr premium wins by $193k (breakeven year 13), a $10k premium never pays back.',
  'startup-offer-calculator':
    'Candidates use it before signing: 0.1% with a $20k strike at startup-typical odds is $68k of expected value over four years — against a $120k salary cut the trade is −$52k, and dilution makes it worse.',
  'solar-degradation-calculator':
    'Solar shoppers use it before picking a panel tier: an 8 kW array loses 19,982 kWh ($3,397) to degradation over 25 years — so a $1,400 premium for 0.25%/yr panels pays for itself, a $4,000 one does not.',
  'solar-removal-reinstall-calculator':
    'Homeowners with aging roofs use it before signing a solar contract: removing and reinstalling 20 panels costs $5,500 today ($6,959 by year 6) — with under 10 years of roof left, re-roof first and the bill never exists.',
  'heat-pump-water-heater-calculator':
    'Homeowners replacing an electric tank use it before the plumber visit: a heat pump unit cuts water heating by two-thirds — $386/yr back — and the incremental cost after rebates often pays back inside a year.',
  'duct-sealing-roi-calculator':
    'Homeowners use it before buying new HVAC equipment: ducts leak 20–30% of conditioned air — $405/yr at typical spend — and sealing pays back in 2.6 years while new equipment on leaky ducts delivers old efficiency.',
  'induction-vs-gas-calculator':
    'Homeowners use it before replacing a range: induction costs ~$47/yr more than gas at typical rates, so the switch never pays back on energy — the honest case is boil time, safety, and kitchen air quality.',
  'waterproofing-roi-calculator':
    'Homeowners with wet basements use it before signing a waterproofing contract: 5%/yr flood risk on $12,000 damage is $600/yr of expected loss — and the standard homeowners policy covers none of it, so expected value is the whole story.',
  'radon-mitigation-calculator':
    'Homeowners use it after a radon test: mitigating 6→2 pCi/L removes 16.5 per 1,000 of lung-cancer risk for a smoker ($73 per point) versus 1.9 for a never-smoker ($643 per point) — radon math is smoking math.',
  'sewer-line-cost-calculator':
    'Homeowners with recurring backups use it before accepting a quote: trenchless at $120/ft beats open trench at $70/ft the moment the line crosses a driveway — $7,700 vs $8,200 once restoration is priced in.',
  'gutter-guard-roi-calculator':
    'Homeowners use it before the guard sales pitch: pro micro-mesh saves $263/yr of cleaning (5.7-yr payback) — guards cut cleaning in half, never to zero, and the real wins are ladder risk and basement-water insurance.',
  'tenant-turnover-cost-calculator':
    'Landlords use it before setting renewal raises: one turnover at $1,800 rent costs $2,947 — 13.6% of the year — so a $50/mo raise that pushes turnover odds past 20% loses money.',
  'rent-vacancy-pricing-calculator':
    'Landlords use it before listing: $1,800 that sits 4 weeks earns less than $1,700 that fills in 1 — every vacant week costs 23% of a month, so the last $100 of ask is the most expensive money in landlording.',
  'maintenance-reserve-calculator':
    'Landlords use it before trusting cash flow: itemized reserves price out at $274/mo (15.2% of rent) — the 1% rule averages across houses, but your HVAC dies on YOUR schedule, in July.',
  'make-ready-calculator':
    'Landlords use it at move-out: paint, LVP, cleaning, and locks price at $4,200 — plus $59/day of lost rent during make-ready, which turns contractor lead times into the most expensive line item.',
  'pet-policy-calculator':
    'Landlords use it before writing the pet addendum: $40/mo pet rent nets $760 over a tenancy while a refundable deposit alone nets −$75 — and banning pets costs a week of vacancy since half of renters have them.',
  'property-manager-calculator':
    'Landlords use it before signing a management contract: the PM nets $2,419/yr after the vacancy edge — self-managing breaks even at $50/hr, so the question is what your 2 a.m. hours are worth.',
  'price-reduction-calculator':
    'Sellers use it before "testing the market": overpricing a $440k home and sitting 8 weeks costs $17,634 — the stale-listing penalty plus carrying burn — because the first two weeks are the listing\'s whole life.',
  'staging-roi-calculator':
    'Sellers use it before the staging quote: $2,500 of staging on a $440k home returns $11,015 at a 2% lift and 3 weeks saved — it breaks even at a 0.06% price bump, and the lift concentrates in vacant and dated homes.',
  'fsbo-vs-agent-calculator':
    'Sellers use it before skipping the agent: FSBO at 97% of the agent-achievable price nets $424,288 vs the pro\'s $427,500 — you must beat 97.7% of their price just to tie, and disclosure liability is yours either way.',
  'escalation-clause-calculator':
    'Buyers use it before the bidding war: base $440k escalating to a $460k cap lands at $454k with a $6,000 appraisal gap due in cash — set the cap at the price where losing feels fine.',
  'counteroffer-ev-calculator':
    'Job candidates use it before accepting: countering a $95k offer with $105k wins $6,750/yr in expected value even at 10% rescind risk — and a landed counter compounds to $114,639 over 10 years of raises.',
  'non-compete-cost-calculator':
    'Employees use it before signing: a 12-month non-compete on $110k carries $4,950 of expected cost — the signing premium to ask for — and the clause lives under state law, not the struck-down FTC ban.',
  'relocation-package-calculator':
    'Job movers use it before signing the offer: a $10k relocation lump is $7,600 after tax against $10,500 of real costs — the counter is $13,816 grossed up, and the clawback terms matter more than the amount.',
  'career-break-calculator':
    'Anyone planning a sabbatical uses it before resigning: six months off costs $37,200 in cash but $105,710 with retirement compounding — and ACA subsidies plus IRA continuity shrink it dramatically.',
  'signing-bonus-vs-salary-calculator':
    'Candidates use it before accepting the "generous" bonus: a $5,000 raise compounds to $27,608 over 5 years — beating a $15,000 bonus by $12,608 — because raises are seeds and bonuses are flowers.',
  'tuition-reimbursement-calculator':
    'Employees use it before enrolling: the $5,250 tax-free benefit covers $21,000 of a $30,000 degree with a 1.6-yr payback — but the 2-year stay clause can cost $20,000 in forgone raises.',
  'discount-leverage-calculator':
    'Business owners use it before quoting a discount: a 10% cut at 30% margin needs +50% volume to break even — discounts come 100% out of margin, and "make it up on volume" is the most expensive sentence in small business.',
  'payment-terms-calculator':
    'Business owners use it before setting invoice terms: 2/10 net 30 is a 36.5% APR decision, and a $50k invoice floating to 60 days on an 8% credit line is a hidden $658 price cut.',
  'price-raise-calculator':
    'Business owners use it before the price-increase letter: a 10% raise with 5% churn adds $29,700/yr and tolerates 28.6% churn before losing — the clients who leave over $15/mo were your most expensive revenue.',
  'saas-creep-calculator':
    'Business owners use it quarterly: a $2,400/mo stack at 8% vendor creep costs $93,496 over 3 years, and the surveyed 30–45% shelfware share means the audit hour is the best-paid hour of the quarter.',
  'workers-comp-calculator':
    'Trade contractors use it before renewal: $500k payroll at $5.50/$100 with a 1.25 mod is $34,375/yr — the class code drives more than the payroll, and a sub without a COI lands on your payroll at audit.',
  'emr-impact-calculator':
    'Trade contractors use it after a claim: a $30k claim that moves the mod to 1.22 costs $48,150 all-in — three years of surcharge on top — and the formula punishes frequency harder than severity.',
  'crew-downtime-calculator':
    'Contractors use it before blaming the bid: 45 idle minutes a day across a 5-person crew burns $71,562/yr — a full salary spent standing around, fixable with a 15-minute huddle and next-day staging.',
  'change-order-calculator':
    'Contractors use it before the scope creeps: $8,500 of direct work prices at $11,550 with OH&P and 3 days of general conditions — signed before the work, or it becomes an invoice argument.',
  'sub-vs-in-house-calculator':
    'GCs use it before self-performing: the $85k sub quote vs $67,100 in-house looks like $18k saved — until the crew\'s 3 weeks of lost billing make it $4,400. Idle crews flip it back.',
  'retainage-calculator':
    'Contractors use it before signing: 10% retainage on a $500k job at 12% margin holds 83% of the entire profit in escrow — the punch list is a cash-flow document, and closeout speed is profit collection.',
  'job-overhead-calculator':
    'Estimators use it before bidding: $2,800/wk × 16 weeks is $44,800 of GCs (9% of contract) — GCs run on the calendar, so a gut-feel percentage under-prices every long thin job and every week of slip.',
  'estimate-contingency-calculator':
    'Estimators use it before the review: the same $480k project carries $120k of contingency at schematic and $38k at construction documents — contingency is uncertainty priced, and it shrinks as information grows.',
  'chair-rental-vs-commission-calculator':
    'Stylists use it before signing: at $4,800/mo of services, booth rental nets $1,135 more than a 45% commission — but only past the $2,404 breakeven, and only if the clientele is yours.',
  'no-show-cost-calculator':
    'Salons and trainers use it to price prevention: eight appointments a day at 8% no-show burns $10,816/yr of perishable chair time — a deposits-and-confirmations policy cutting it to 3% recovers $6,760.',
  'salon-service-pricing-calculator':
    'Stylists use it before printing the menu: $5,913 of overhead and income spread over 97 bookable hours sets a $60.69/hr floor — a 90-minute color priced under $110 is a donation.',
  'retail-vs-service-time-calculator':
    'Stylists use it to time the pitch: $220/wk of retail at 15% pays $33/hr of selling time — half the $68 service rate, so sell in the processing gaps, never instead of a booking.',
  'cleaning-business-pricing-calculator':
    'Cleaning owners use it before quoting: a $216 flat rate on 1,800 sqft nets $50.64 after labor, drive time, and overhead — and one weekly client is $11,232/yr of annuity.',
  'photographer-session-pricing-calculator':
    'Photographers use it before booking season: 100 sessions carrying $64,400 of costs and income need $679 each — the "one-hour shoot" is 4.5 hours, and $350 is a $329 donation.',
  'tattoo-split-vs-booth-rental-calculator':
    'Tattoo artists use it before signing: at 25 booked hrs/wk, renting beats a 60/40 split by $965/wk — but the breakeven is 7.3 hours, and below it the shop’s walk-ins were paying your rent.',
  'event-dj-pricing-calculator':
    'DJs use it before quoting the wedding: the 5-hour gig is an 8-hour job plus a $50/gig rig line — the honest quote is $775, and the $500 competitor is working for $35/hr.',
  'pressure-washing-pricing-calculator':
    'Wash operators use it before quoting: an 800 sqft driveway at $0.20 clears $88 at $80/hr effective — because the rig, chemicals, and drive time are all priced in.',
  'catering-price-per-person-calculator':
    'Caterers use it before the proposal: 100 guests at $12 food cost and a 32% target prices at $37.50/head for $1,350 profit — and the breakeven math explains the event minimum.',
  'auto-detailing-pricing-calculator':
    'Detailers use it before printing the menu: a $175 detail bills $50/hr but keeps $14.71/hr after the van, gear, and labor — the gap is the whole business.',
  'mobile-mechanic-rate-calculator':
    'Mobile mechanics use it to write the pitch: the $465 shop brake job is $365 in the driveway — customer saves $100, you still clear $86/hr on a full route.',
  'mba-roi-calculator':
    'Applicants use it before the deposit: $120k tuition plus $140k forgone pay is the real $280k bill — and a $35k bump needs 8 years to pay it back.',
  'sabbatical-cost-calculator':
    'Planners use it to set the savings target: 6 months off at $3,800/month is a $57,420 decision once forgone pay and the buffer are counted honestly.',
  'bootcamp-roi-calculator':
    'Career-changers use it before enrolling: $15k tuition plus $16,800 of skipped paychecks is the real $31,800 — a $22k bump pays it back in 17 months, if placement lands.',
  'locum-tenens-rate-calculator':
    'Physicians use it at the negotiating table: $1,400/day at a real pace is $196k — $82k behind a $260k employed job, so the break-even day rate is the floor, not the opener.',
  'open-house-roi-calculator':
    'Agents use it to budget Sundays: 6 sign-ins at an 8% funnel is $2,160 of expected commission — $540/hr against $150 of signs, if the sign-in sheet actually gets signed.',
  'online-coaching-pricing-calculator':
    'Trainers use it to escape the calendar: 25 online clients at $200 is $5,000/mo on 18 hours — $277/hr versus the $75/hr ceiling that 30 sessions a month cannot break.',
  'taper-calculator':
    'Athletes use it the week it matters: Bompa\'s descent turns a 10-hour week into 6, then 4 — intensity held, fatigue gone, race day at the bottom.',
  'christmas-light-install-pricing-calculator':
    'Installers use it to price the season: 120 ft at $5.50 is a $760 job, and 3 jobs a day for 45 days is a $102,600 six-week sprint.',
  'staffing-agency-markup-calculator':
    'Agency owners use it before quoting: $20 pay + 15% burden is $23 cost — a $28 bill is 17.9% margin, $800/mo per head, and markup talk hides it.',
  'rpe-to-load-calculator':
    'Lifters use it at the rack: RPE 8 × 5 on a 405 e1RM is 330 on the bar — the Tuchscherer chart, half-steps interpolated, plates rounded.',
  'holiday-decor-stacking-calculator':
    'Decor operators use it to justify the off-season: Halloween at $8,100 plus permanent lighting at $109,200 turns a 6-week Christmas sprint into a $219,900 year.',
  'photo-booth-pricing-calculator':
    'Event entrepreneurs use it before buying: $9,500 of booth at $750 an event with 90% margin pays back in 4.7 months — if the calendar fills.',
  'amazon-fba-holiday-calculator':
    'FBA sellers use it before the shipment: $12.09/unit margin meets $360/mo of Q4 storage at 2.8× rates — send what sells by Christmas, not what fits the container.',
  'etsy-pricing-calculator':
    'Etsy sellers use it before listing: $18 + $4.50 shipping loses $2.59 to fees — including 6.5% of the postage — leaving $9.41 before your labor is counted.',
  'ebay-fee-calculator':
    'Sellers use it before buying inventory: 13.6% of the $53 total plus $0.30 is $7.51 — a $20 item needs a $45 sale price to keep 40% margin.',
  'shopify-vs-etsy-calculator':
    'Shop owners use it at the migration decision: Shopify undercuts Etsy past ~24 orders/mo on fees — but Etsy\'s $259 includes the buyers, Shopify\'s $134 does not.',
  'amortization-calculator':
    'Borrowers use it before signing: $320k at 6.5% is $2,022.62/mo and $408,142 of interest — 79% of year one is the bank\'s money, not yours.',
  'square-footage-calculator':
    'DIYers use it before the cart: 12×14 is 168 sq ft, but flooring wants 184.8 with waste — $792.79 at $4.29/ft, measured twice, ordered once.',
  'debt-to-income-calculator':
    'Homebuyers use it before pre-approval: $2,950 of debts on $7,800 income is 37.8% — the 43% cap says max housing $2,504, and lenders read it before your score.',
  'down-payment-calculator':
    'First-time buyers use it to size the real check: 5% on $400k is $20,000 plus $12,000 closing plus $158/mo PMI — $32,000 cash to close, not $20,000.',
  'cagr-calculator':
    'Investors use it to compare honestly: $10k → $26k in 7 years is 14.63% CAGR — the number that strips the calendar out of a good story.',
  'pregnancy-due-date-calculator':
    'Expecting parents use it the day the test turns: LMP + 280 days, current week, trimester — and the truth that the due date is a window, not an appointment.',
  'timesheet-calculator':
    'Workers use it on Sunday night: 8:30–5:00 minus the lunch is exactly 8.0 hrs — 40.0 a week, $980 at $24.50, and the OT line is where the money hides.',
  'biweekly-mortgage-calculator':
    'Homeowners use it to find the free money: 26 half-payments is a 13th payment a year — $94k saved and 6 years gone on $320k at 6.5%.',
  'fraction-calculator':
    'Students use it mid-homework: 3/4 + 2/3 = 17/12 (1 5/12), 1 2/3 × 2 1/4 = 3 3/4 — improper, mixed, reduced, and decimal, every form at once.',
  'simple-interest-calculator':
    'Borrowers use it before signing the short-term note: $5,000 at 7% for 3 years is $1,050 simple — and the calculator shows what compound would have cost for comparison.',
  'average-calculator':
    'Anyone with a column of numbers uses it: paste 12, 18, 7, 18, 25, 9, 31, 14 and get mean 16.75, median 16, mode 18 — plus weighted average for grades and share lots.',
  'ovulation-calculator':
    'Couples use it the week it matters: LMP Sep 1 on a 28-day cycle → ovulation ~Sep 15, fertile window Sep 10–16, and the due date if it works.',
  'unit-converter':
    'Everyone uses it mid-task: 5 miles is 8.0467 km, 10 kg is 22.046 lb, 98.6°F is exactly 37°C — length, weight, volume, area, speed, temperature.',
  'standard-deviation-calculator':
    'Analysts use it on any pasted column: {2,4,4,4,5,5,7,9} → mean 5, sample SD 2.138, population SD 2.000 — with the n vs n−1 choice explained.',
  'pythagorean-theorem-calculator':
    'Students and carpenters use the same theorem: legs 3 and 4 → hypotenuse exactly 5. Solves for hypotenuse or missing leg, and flags the perfect triples.',
  'quadratic-formula-calculator':
    'Algebra students use it nightly: x² − 5x + 6 → x = 3 and x = 2, discriminant 1, vertex (2.5, −0.25) — all three discriminant cases handled, complex roots included.',
  'square-root-calculator':
    'Students use it for exact answers: √50 = 5√2 = 7.0711 — simplified radical and decimal together, plus cube and nth roots (³√27 = 3, ⁴√625 = 5).',
  'slope-calculator':
    'Geometry students and builders use the same math: (2,3) to (8,11) → slope 4/3, y = 1.333x + 0.333, angle 53.13°, grade 133% — slope, distance, midpoint in one shot.',
  'factorial-calculator':
    'Stats students use it for the counting questions: 10! = 3,628,800 arrangements, P(10,3) = 720 podiums, C(52,5) = 2,598,960 poker hands — exact BigInt digits, no float lies.',
  'scientific-notation-converter':
    'Chem and physics students live here: 0.0000000543 → 5.43 × 10⁻⁸, with engineering notation (multiples of 10³) and plain decimal alongside.',
  'random-number-generator':
    'Teachers raffling prizes and DMs rolling damage use it: crypto-grade randomness, no-repeat mode, any range — with dice odds baked in (2d6 sums to 7 on 16.7% of rolls).',
  'word-counter':
    'Writers and students use it against limits: live words, characters, sentences, reading time at 200 wpm and speaking at 130 — a 10-minute talk is ~1,300 words.',
  'bmr-tdee-calculator':
    'Dieters use it before any plan: Mifflin-St Jeor says a 30-year-old at 80 kg / 180 cm burns 1,780 kcal at rest, 2,448 lightly active — cut from that number, not a guess.',
  'sleep-cycle-calculator':
    'People who wake up groggy use it: sleep runs in 90-minute cycles — bed at 11 PM means waking at 6:45 AM lands between cycles, not inside deep sleep.',
  'water-intake-calculator':
    'Anyone past the 8-glasses myth uses it: 35 mL/kg says 80 kg needs 2.8 L — plus 350 mL per 30 minutes of exercise and more in heat.',
  'bac-calculator':
    'The Widmark estimate, honest about its limits: 80 kg male, 4 drinks, 2 hours → 0.073% — and fully sober only after ~7 hours. Time is the only cure.',
  'triangle-area-calculator':
    'Geometry students use it three ways: ½bh, Heron for three sides (3-4-5 → 6), or two sides + angle — with the triangle inequality checked for you.',
  'circle-calculator':
    'From any one measurement — radius, diameter, circumference, or area — get all four, plus sector and arc: r=5 → area 78.54, circumference 31.42.',
  'roman-numeral-converter':
    'Students and Super Bowl viewers use it: 2026 = MMXXVI, 1994 = MCMXCIV — both directions, with strict validation so VIIII doesn\'t pass for 9.',
  'number-base-converter':
    'Programmers use it daily: 255 = 0xFF = 1111 1111₂ = 377₈ — decimal, hex, binary, octal with bit-width shown and 0x/0b prefixes auto-detected.',
  'density-calculator':
    'Science students and metal buyers use ρ = m/V: 500 g in 200 cm³ is 2.5 g/cm³ — sinks — with the float/sink verdict and the gold-fake test built in.',
  'force-calculator':
    'Physics homework starts here: 70 kg at 2 m/s² is 140 N; your weight is a force (70 kg = 686.7 N) — F = ma solved in all three directions.',
  'kinetic-energy-calculator':
    'Drivers and physics students learn the same law: ½mv² — a car at 100 km/h carries 463 kJ, at 50 km/h a quarter of that. Speed kills by squaring.',
  'velocity-calculator':
    'Bolt averaged 10.44 m/s over 9.58 s; a 4.5-second 0–100 launch is 0.63 g; 3 seconds of free fall is 105.9 km/h — v=d/t, a=Δv/t, and gravity.',
  'electricity-cost-calculator':
    'Anyone staring at a power bill uses it: 100 W × 8 h at $0.17/kWh is $49.64 a year — price every appliance, find the vampires.',
  'gas-trip-cost-calculator':
    'Road trippers use it before booking: 300 miles at 28 mpg and $3.40 gas is $36.43 — split 4 ways, $9.11 each, round-trip toggle built in.',
  'ideal-weight-calculator':
    'Anyone setting a goal weight uses it: at 5 ft 10, Devine says 161 lb, Robinson 157, Miller 155 — the four formulas define a zone, not a verdict.',
  'tire-size-calculator':
    'Drivers plus-sizing wheels use it: 225/45R17 is 24.97 in tall; jump to 235/40R18 and the speedo reads 59 at a true 60 — within the 3% rule.',
  'self-storage-roi-calculator':
    'Storage investors use it in underwriting: 120 units at 82% throw $80,590 NOI at 35% OpEx — and the 8% annual tenant bump is the yield engine apartments can only envy.',
  'car-wash-economics-calculator':
    'Wash developers use it before the land contract: 380 cars/day plus 900 members is $739k NOI at 16% yield-on-cost — the membership book is why PE pays 10×.',
  'tax-prep-pricing-calculator':
    'Preparers use it before setting the fee schedule: 120 returns at $350 is a $60k season at $78/hr true — and extensions plus advisory work are what turn the sprint into a firm.',
  'insurance-agent-commission-calculator':
    'Agents use it to see the annuity they are building: an 800-policy book pays $181k/yr with renewals compounding — and sells for 2× commission at exit.',
  'remodeling-contractor-markup-calculator':
    'Remodelers use it before signing the contract: 1.5× on $50k direct is a 33% margin — $17k net after overhead — and the markup-vs-margin confusion is where busy contractors go broke.',
  'dumpster-rental-pricing-calculator':
    'Roll-off operators use it to run the turns game: each $425 rental nets $270 after tipping and the driver — 8 cans at 4 turns is $8,240/mo, and yard-sitters earn nothing.',
  'welding-fabrication-pricing-calculator':
    'Fabricators use it before quoting custom work: the gate costs $735 to produce and quotes at $985 — the shop rate carries the margin, the materials markup just covers the waste.',
  'coffee-cart-economics-calculator':
    'Cart owners use it before signing a pitch: breakeven is 12 cups/day against an $850 fixed floor — survivable anywhere, but only catering breaks the foot-traffic ceiling.',
  'food-truck-economics-calculator':
    'Truck owners use it before signing the note: 90 tickets at $14 nets $15.6k/mo BEFORE your wage — prime cost under 65% and 62 breakeven tickets/day decide if the truck pays you or owns you.',
  'dog-walking-income-calculator':
    'Walkers use it before going independent: 8 walks at $22 nets $3,456/mo on your own book vs $2,902 through the platform — and 10 overnights add $600 with no extra daylight.',
  'bounce-house-rental-calculator':
    'Party-rental founders use it before the first unit: a $2,800 combo at $185/day × 6 rentals pays back in 3.1 months — then season length and the liability stack decide the year.',
  'vending-machine-route-calculator':
    'Route builders use it before buying machines: a $3,500 machine nets $27.56/wk after product and the location cut — 29-month payback — and the location, not the machine, is the asset.',
  'laundromat-roi-calculator':
    'Buyers use it in due diligence: 22 machines at 3.5 turns is a 9.4% cap rate at $425k — verified by water bills, not the seller\'s spreadsheet, and valued at 4× NOI.',
  'notary-signing-agent-calculator':
    'Signing agents use it before believing the course ads: 84 signings at $110 nets $8,004/mo at $47.64 true hourly — and direct title work pays $5,880/mo more than the services on the same calendar.',
  'massage-therapist-pricing-calculator':
    'Massage therapists use it before setting rates: 20 sessions at $85 nets $6,018/mo, $52/hr with turnover counted — and the 5-a-day body cap makes price the only growth lever.',
  'pest-control-route-calculator':
    'Pest pros use it before buying or selling a book: 400 quarterly accounts is $16k/mo on a half-full route, $200/hr on route time — and the route itself sells for 15× monthly.',
  'mobile-grooming-pricing-calculator':
    'Groomers use it before leaving the salon: 6 dogs at $95 nets $443/day ($68/hr) against the salon\'s $285 commission day — the driveway premium is the whole business.',
  'landscape-install-costing-calculator':
    'Landscapers use it before the quote: materials × 1.2 plus $60/man-hr prices the job at $1,867 against $1,472 true cost — and the maintenance contract attached is the real prize.',
  'tree-service-pricing-calculator':
    'Tree services use it before the rope goes up: the $2,100 removal-and-grind costs $1,355 to deliver — and the crew day burns $182/hr whether the saw runs or not.',
  'hvac-flat-rate-pricing-calculator':
    'HVAC owners use it to reprice the book: the $15 capacitor bills at $285 (71% margin, $271/hr) because the book prices diagnosis, truck stock, and warranty — installs run 28% and carry the rent.',
  'plumbing-flat-rate-pricing-calculator':
    'Plumbers use it before quoting the anchor job: the $1,650 water heater costs $1,025 all-in and clears $625 — if the book carries the permit, the code parts, and the callback warranty.',
  'electrician-apprentice-vs-college-calculator':
    'Future electricians use it before signing for student loans: 4 apprentice years EARN $193,440 while college spends $40k — and the journeyman card pays $79k before the OT that adds $15k more.',
  'owner-operator-vs-company-calculator':
    'Drivers use it before signing a lease: $2.10/mi gross nets $0.80 after the real $1.30/mi — $96k vs $66k company, but below $1.85/mi you are a company driver with a truck payment.',
  'pe-license-roi-calculator':
    'Engineers use it before another year unlicensed: $2,050 all-in against a $6,000/yr bump pays back in 4.1 months — and the seal gates the principal track and $300/hr expert work.',
  'real-estate-commission-split-calculator':
    'Agents use it at renewal time: on 12 deals the capped 70/30 beats uncapped by $24,550, and the 100% fee shop wins past $200k GCI — if you no longer need the leads.',
  'bah-rent-vs-buy-calculator':
    'Service members use it when orders drop: renting $450/mo under BAH pockets $5,400/yr tax-free — buying only beats it when the PCS window gives equity 5 years to clear the 8% drag.',
  'brs-tsp-match-calculator':
    'Service members use it before touching myPay: 5% in draws the full 5% match — $160/mo free for an E-4, compounding to $83k — and continuation pay at 12 years is a five-figure deposit.',
  'teacher-lane-change-roi-calculator':
    'Teachers use it before enrolling: a $14k MAT with a $2,400 lane bump pays back in 5.8 years, nets $46k in salary — then the pension formula pays the bump again for life, $28,800 more.',
  'teacher-summer-gap-calculator':
    'Teachers use it in September, not June: $62k over 10 months is $6,200 checks against a $5,167/mo life — save $1,033 per check ($613 with ESY) and August stops running on credit cards.',
  'nurse-agency-vs-staff-calculator':
    'Nurses use it before jumping to agency: the $20/hr premium is real but shrinks to $9,003/yr after the health plan, the match, and unbooked weeks — and each gap week costs $2,232.',
  'nurse-certification-roi-calculator':
    'Nurses use it before scheduling the exam: $665 for the CCRN pays a $2.25/hr differential — $4,212/yr, payback in 1.9 months, $20k net over five years.',
  'bookkeeping-pricing-calculator':
    'Bookkeepers use it before the proposal: the $325/mo client pays $108/hr effective at 3 hours — and the 6-month backlog is a $900 cleanup project, not a free month one.',
  'tutoring-rate-calculator':
    'Tutors use it before setting rates: 20 sessions at $60 pays $960/wk on a platform but $1,104 independent — and one 4-student group out-earns two solo hours.',
  'handyman-hourly-rate-calculator':
    'Handymen use it before quoting anything: $65k take-home on 25 billable hrs/wk needs $70.32/hr — and a 4-hour minimum with a trip fee is what makes the faucet swap pay.',
  'window-cleaning-pricing-calculator':
    'Window cleaners use it to split the business in two: the $198 home pays $59/hr with drive time, the 8-stop storefront route pays $70/hr and repeats every month.',
  'junk-removal-pricing-calculator':
    'Junk removal operators use it before printing the price book: a $280 half-load keeps $162 after the dump fee, crew, and fuel — and dense loads at household prices are where that margin dies.',
  'pool-service-route-calculator':
    'Pool techs use it before saying yes to a new account: the same $150/mo pool pays $58/hr next to your route and $35/hr thirty minutes away — density is the business.',
  'qlac-calculator':
    'Retirees with surplus IRA money use it before the first RMD: $210,000 moved to a QLAC cuts the forced withdrawal $7,924/yr at 73 and the tax $1,743 — but the annuity breakeven is ~90.8, so it\'s longevity insurance with a tax delay, not an investment.',
  'q4-equipment-timing-calculator':
    'Owners use it before December buying: over 40% of depreciated basis in Q4 flips everything to mid-quarter convention (20% → 5% first-year on 5-year property) — expensing the Q4 buys exits the test, and a one-day placed-in-service slip defers the whole deduction a year.',
  'equipment-lease-vs-buy-calculator':
    'Owners use it when the dealer offers both options: financed purchases still expense the full price year one (§179/bonus) plus interest — $100k at 7%/5yr nets $68,231 after tax vs a $1,900/mo lease at $77,520 — and the residual value is the fulcrum that flips it.',
  'business-vehicle-writeoff-calculator':
    'Business owners use it before signing for a vehicle: the door-jamb GVWR picks the path — $20,300 luxury cap vs $90,000 year-one write-off on the same $90k price tag, with the 50%-use recapture trap and mileage-method lock-in flagged.',
  'macrs-depreciation-calculator':
    'Bookkeepers and owners use it when spreading beats expensing: full Pub 946 schedules for 3/5/7/10-year property, the 40% Q4 mid-quarter trap flagged, and the honest comparison against §179 — MACRS wins in non-conforming states and higher-bracket future years.',
  'section-179-calculator':
    'Business owners use it before a December equipment buy: 2026 layers $2.56M of §179 (income-capped) with permanent 100% bonus depreciation (not) — a $75,000 machine nets to $48,750 after tax, and the $32,000 SUV cap and income limit are the traps.',
  'rule-of-55-calculator':
    'Workers eyeing retirement at 55–59 use it before giving notice: separate in the year you turn 55 and that 401(k) opens penalty-free until 59½ — but retiring at 53 never qualifies and rolling to an IRA locks it again, so the sequence is everything.',
  'social-security-bridge-calculator':
    'Pre-retirees use it when "should I delay" gets abstract: delaying 62→70 is a $147,840 portfolio bridge that buys a 9.6% COLA-protected payout for life — breakeven 80.4, and no commercial annuity at 70 matches it.',
  'social-security-earnings-test-calculator':
    'Workers claiming SS before full retirement age use it before taking the part-time job: 2026 withholds $1 per $2 over $24,480 — $40,000 of wages skips about five checks — but the FRA recalculation returns it as a permanently higher benefit, so the real cost is timing.',
  'hsa-medicare-trap-calculator':
    'Workers 65+ on HDHPs use it before claiming Social Security: Part A backdates six months, the $9,750 family limit collapses to $4,062.50 for a December claim, and the excess owes 6% every year until withdrawn — so the last safe contribution month is May.',
  '72t-sepp-calculator':
    'Early retirees under 59½ use it before committing: the three IRS methods pay $13,812–$30,156/yr on $500k at 50, the lock runs the longer of 5 years or to 59½, and busting the schedule claws back 10% on every payment ever taken.',
  'roth-conversion-bracket-filler-calculator':
    'Retirees in the gap years before RMDs use it each December: convert exactly enough to top out the 22% bracket — $60,700 on $45,000 of income costs $12,814 federal — and the 63+ IRMAA check stops the conversion from tripping a $1,148 Medicare cliff two years later.',
  'coast-fire-calculator':
    'Savers in their 20s–40s use it to find the day saving becomes optional: coast number = FIRE number discounted by real return — $347k invested at 35 carries you to a $1.5M retirement at 65, and after that a paycheck only has to cover the present.',
  'survivor-benefit-calculator':
    'Widows and widowers use it in the first planning pass after a death: claiming at 60 locks in 71.5% of the base forever, the 82.5%-of-PIA floor repairs a spouse\'s early claiming, and the survivor switch — reduced survivor now, own maxed benefit at 70 — is the last legal double-dip.',
  'spousal-social-security-calculator':
    'Couples use it when the lower earner nears 62: the spousal maximum is 50% of the worker\'s PIA only at full retirement age — 32.5% at 62 — deemed filing reduces both pieces permanently, and waiting past FRA adds nothing to the spousal share.',
  'roth-5-year-rule-calculator':
    'Early retirees and converters use it before touching Roth money: each conversion seasons Jan 1 of year+5, the 10% penalty only applies under 59½, and withdrawals hit contributions first — so the earnings clock rarely bites if you have basis.',
  '457b-calculator':
    'Public-sector employees use it when HR mentions "deferred comp": the 457 limit is separate from the 403(b) — $49,000 sheltered in 2026, $81,500+ in the final-3 window — and penalty-free withdrawals after separation make it the early-retirement account.',
  'drop-retirement-calculator':
    'Police and firefighters use it at DROP eligibility: the lump sum (pension payments banked at plan interest) against the frozen accrual — 14 years of gap coverage on the typical case, plus the direct-rollover move that dodges the 20% withholding trap.',
  'pension-vs-social-security-calculator':
    'Early-career teachers and state workers use it at the job-offer fork: the pension wins the income line but loses on COLA, portability, and survivorship — and post-repeal the pension-plus-covered-side-gig play locks Medicare credits for free.',
  'social-security-fairness-act-calculator':
    'Retired teachers, firefighters, and CSRS feds use it to check SSA\'s adjustment: WEP\'s bend-point cut (up to $643/mo) and GPO\'s two-thirds offset are both gone retroactive to Jan 2024 — and widows who never claimed because GPO zeroed them can finally file.',
  'pslf-calculator':
    'Public-service workers use it before year 10 locks in: the forgiven balance (tax-free, even when negative amortization grew it past the original loan) versus the aggressive-payoff total — the answer is arithmetic, and high-payment cases genuinely flip.',
  'adoption-credit-calculator':
    'Adopting families use it at finalization: 2026 made $5,120/child refundable cash, the $265k–$305k phaseout makes December MAGI management worth real money, and the special-needs full-credit rule is the most underclaimed benefit in the code.',
  'layoff-runway-calculator':
    'Newly laid-off workers use it the first weekend: savings plus NET severance plus UI against burn and COBRA, phased across the 26-week benefit cliff — the real survival number, and which lever (COBRA→ACA, burn cuts) moves it most.',
  'severance-pay-calculator':
    'Laid-off workers use it before signing the release: severance stacks on YTD income at top brackets, so a $25k shift from December to January saved $4,974 on a $50k package — the timing is negotiable, the brackets aren\'t.',
  'stock-donation-calculator':
    'Investors who give annually use it before the year-end gift: appreciated shares deduct at full value and erase the gain, 2026\'s 0.5% AGI floor trims itemizers, and the new $1k/$2k cash-only rule decides the small-gift route.',
  'qcd-calculator':
    'Retirees 70½+ who give to charity use it before writing the year-end check: the QCD satisfies the RMD tax-free, beats the standard deduction by the full marginal rate, and the 70½-to-73 gap quietly shrinks every future RMD.',
  'step-up-basis-calculator':
    'Families holding appreciated stock or rentals use it before selling in retirement: §1014 erases decades of gain AND recapture at death, community-property states double it at first death, and the gifting-carryover trap runs the wrong way.',
  'inherited-ira-calculator':
    'Adult children who just inherited a parent\'s IRA use it before touching anything: the 10-year clock is running, annual RMDs may apply in years 1–9 if the parent had started theirs, and the steady-vs-lump crossover bracket decides a six-figure timing question.',
  'kiddie-tax-calculator':
    'Parents with custodial accounts use it at dividend season: over $2,700 of unearned income, the child borrows the parents\' bracket — up to 37% — and the tool prices each layer plus the Form 8814 election trade-off.',
  'underpayment-penalty-calculator':
    'Freelancers and side-income earners use it after a missed quarter: the lesser-of 90%/100%/110% safe harbor sets the real requirement, withholding backfills earlier quarters while a late payment can\'t, and owing under $1,000 kills the penalty outright.',
  'net-investment-income-tax-calculator':
    'High earners use it before a big gain or Roth conversion: MAGI over $200k/$250k (frozen since 2013) drags investment income into the 3.8%, and wages over the line add 0.9% — the tool prices both surtaxes before they\'re committed.',
  's-corp-reasonable-salary-calculator':
    'S-corp owners use it at salary-setting time: payroll tax saved (15.3% on distributions) minus QBI lost (6.4¢ per salary dollar at the 32% bracket) is the real net — and the <40%-of-profit flag marks where reclassification risk starts.',
  'accountable-plan-calculator':
    'S-corp owners use it the week they learn their home office deducted nowhere: a one-page plan turns $9,000+ of personal spending into entity deductions received tax-free — no income tax, no payroll tax, every year — and it stacks with the Augusta Rule on the same house.',
  'augusta-rule-calculator':
    'S-corp owners use it when their CPA mentions "rent your house to your business": 14 days at a fair-market rate moves ~$21k from taxed business income to untaxed personal income — and the calculator guards the cliff, because day 15 taxes the whole year.',
  'str-reps-loophole-calculator':
    'W-2 earners with an Airbnb use it before counting on the paper loss: a ≤7-day average stay plus 100 honest hours moves the whole cost-seg deduction onto their salary — but the cleaner\'s hours count, and one day of average stay is the line between deductible and suspended.',
  'cost-segregation-calculator':
    'Rental and commercial owners use it before commissioning the study: 100% bonus is permanent now, so the year-one deduction jumps 7–10×, and the honest net — minus the study fee and the ordinary-rate recapture at sale — decides whether the engineering report pays for itself.',
  'depreciation-recapture-calculator':
    'Landlords use it the week they decide to sell: the years of depreciation come back at a flat 25% before appreciation sees capital-gains rates, equipment comes back at full ordinary rates, and the number decides whether to sell, exchange, or hold for the step-up.',
  '1031-exchange-calculator':
    'Investors use it before listing the rental: the three-condition test for full deferral (buy up, reinvest all equity, replace the debt), the mortgage boot nobody warns about, and the new basis that carries the deferred gain — because day 46 without an identification kills the whole exchange.',
  'qsbs-1045-rollover-calculator':
    'Founders and angels use it when the exit arrives a year early: reinvest the proceeds in new QSBS within 60 days, the gain defers, and the three years already banked tack onto the replacement — turning a forced sale into a bridge to the full exclusion instead of a tax bill.',
  'qsbs-exclusion-calculator':
    'Founders and early employees use it when an exit offer lands: the tiers (50/75/100% at 3/4/5 years), the $15M-or-10×-basis cap, and the cliff — one day short of a tier means zero exclusion and ordinary 23.8% capital gains, unless a §1045 rollover defers the gain and carries the clock into replacement stock.',
  'medicaid-spend-down-calculator':
    'Adult children use it the week a parent needs a nursing home, when the family learns the $2,000 asset limit, the spouse\'s protected share, and that the $100,000 gifted three years ago now means ten months of private pay — the three-test reality check before the elder-law attorney meeting.',
  'hybrid-ltc-vs-traditional-calculator':
    'Buyers comparing LTC quotes use it when the agent leads with "if you don\'t use it, you don\'t lose it": the hybrid\'s money-back is real but costs ~$183k of foregone growth versus ~$75k of traditional premiums — and what the difference actually buys is lapse-proofing and immunity from the 28% rate hikes.',
  'ltc-insurance-vs-self-fund-calculator':
    'Pre-retirees holding an LTC quote use it to turn the agent\'s pitch into a bet with a number: invested at 6%, the premiums cover about 14 months of care — so the policy only pays if the care event outlasts the breakeven, and the 5-year dementia tail is exactly what is being insured.',
  'long-term-care-cost-calculator':
    'Families use it in the week after a diagnosis or a fall, when the promise "we\'ll keep Mom at home" meets the math: at 44 hours a week home care already beats assisted living on price, Medicare pays for none of it, and the total over three years is the number that decides whether the house gets sold.',
  'ptet-election-calculator':
    'S-corp and partnership owners use it before signing the annual PTET election: with the 2026 SALT cap at $40,400 and the QBI haircut on entity-level deductions, the answer is your bracket rate on every PTET dollar when the cap is binding — and a small net loss when it is not.',
  'nanny-tax-calculator':
    'Parents negotiating a nanny offer use it when the hourly rate sounds settled but the real cost is not: past $58 a week the IRS treats the household as an employer, and the 7.65% employer share plus FUTA changes what "affordable" means — while the dependent-care FSA quietly pays a lot of it back.',
  '529-vs-trump-vs-roth-calculator':
    'Parents paralyzed by the three-account choice use it to run one contribution through all three vehicles at once — the 2026 caps enforced, the kid\'s tax rate applied, the aid penalty shown — and learn the ranking flips entirely depending on whether the money is for college or for life after it.',
  'custodial-roth-ira-calculator':
    'Parents of working teens use it to see why a summer job is a retirement account in disguise — $3,000 a summer for four years becomes $342,548 tax-free at 60 — with the earned-income rule and FAFSA invisibility that neither the 529 nor the Trump Account can match.',
  'trump-account-calculator':
    'New parents and grandparents use it to see what the $1,000 seed plus steady contributions actually becomes — $191k at 18 when maxed — and to grasp the tradeoffs nobody headlines: locked until 18, ordinary-income tax on earnings, and a student-asset hit on financial aid that makes the 529 the better college vehicle.',
  'car-loan-interest-deduction-calculator':
    'New-car buyers use it to shrink the "$10,000 deduction" headline to their real number — first-year interest on a typical loan is ~$2,800, worth a few hundred dollars at their bracket — and to check the three gates (new, US-assembled, under the MAGI phase-out) before counting it.',
  'tips-overtime-deduction-calculator':
    'Servers, bartenders, and overtime-heavy hourly workers use it to convert the campaign slogan into the real deduction — only the premium half of OT counts, auto-gratuities don\'t, caps and MAGI phase-outs apply — and to see the actual dollar savings at their bracket instead of the headline promise.',
  'senior-deduction-calculator':
    'Retirees use it to translate the "no tax on Social Security" headlines into the real provision — a temporary $6,000-per-person deduction with a 6% MAGI clawback — and to see exactly what a December Roth conversion or capital gain costs them in lost deduction during the 2025–2028 window.',
  'charitable-bunching-calculator':
    'Consistent givers use it to learn whether bunching still beats spreading under the 2026 rules — the new 0.5% AGI floor and the $1,000/$2,000 above-the-line deduction flipped the answer for a lot of households, and the two-year dollar comparison settles it in one pass.',
  'itemized-vs-standard-deduction-calculator':
    'Homeowners in high-tax states use it to catch the 2026 regime change: the SALT cap quadrupled to $40,400 while the standard deduction barely moved — millions who haven\'t itemized since 2017 cross back over, and the answer is now worth $2,000–$4,000 a year.',
  'second-income-calculator':
    'Parents weighing a second job against daycare use it to see the number nobody quotes: the second salary stacked on the first at marginal rates, minus childcare, commuting, and work costs — a $40,000 job can net $5/hour, which reframes the whole stay-or-work debate.',
  'gift-tax-calculator':
    'Parents and grandparents use it to turn the $19,000 annual exclusion into a strategy — how much a decade of gifting actually moves (over $1M with growth for a family of four recipients), when a gift forces Form 709 onto the $15M lifetime exclusion, and when a $95,000 529 superfund beats five years of checks.',
  'estate-tax-calculator':
    'Families with estates anywhere near $15M use it to see where they stand under the OBBBA\'s permanent 2026 rules — the $7M sunset is dead, but 40% above the line, a $30M couples\' shelter that vanishes without a Form 706 election, and states taxing estates as small as $1M are all still very much alive.',
  'child-tax-credit-calculator':
    'Parents use it to see the real number behind the $2,200 headline — how the $50-per-$1,000 phase-out trims higher earners, and how the 15%-of-earnings-over-$2,500 formula, not the $1,700 cap, decides what lower-income families actually get refunded.',
  'amt-calculator':
    'High earners exercising ISOs or taking big SALT deductions use it to see whether the parallel tax catches them — with 2026\'s doubled 50% phase-out and reset $500k/$1M thresholds, the zone where each extra dollar effectively costs 39–42% is back on the map.',
  'qbi-deduction-calculator':
    'Pass-through owners use it to find their real 20% deduction across the three 2026 regimes — and to catch the two traps that gut it: no W-2 wages above the threshold can zero the regular formula (the new $400 minimum is the floor), and SSTB income still cliffs to zero at the top of the widened phase-in range.',
  'eitc-calculator':
    'Low- and moderate-income workers use it to claim the refundable credit a fifth of eligible filers leave unclaimed — and to see the hidden 16–21% phase-out rate stacked on their bracket, plus the $12,200 investment-income cliff that zeroes the credit outright.',
  'aca-subsidy-calculator':
    'Freelancers, early retirees, and anyone buying marketplace coverage use it to price the returned 400% cliff — the enhanced subsidies expired for 2026, so one dollar of MAGI over the line zeroes a credit that can run $6,000–$13,000 a year, and the pre-tax moves that pull income back under pay for themselves twice.',
  'savers-credit-calculator':
    'Lower- and moderate-income savers use it to claim the government match most people never file for — up to $1,000 per person — and to see the rate cliffs: $1 of AGI over $48,500 joint cuts a couple\'s credit from $2,000 to $800, which makes the pre-tax contribution that pulls AGI back under worth double.',
  'student-loan-interest-deduction-calculator':
    'Anyone paying down student loans uses it to claim the $2,500 above-the-line deduction they do not need to itemize for — and to see the phase-out quietly eating it as their salary grows, plus the 401(k)/HSA move that pulls MAGI back under the line.',
  'traditional-ira-deduction-calculator':
    'Anyone with a 401(k) at work and a decent raise uses it to learn the contribution-versus-deduction trap: there is no income limit on putting money in a traditional IRA, only on deducting it — and which of the four phase-out bands applies depends on plan coverage, not just income.',
  'social-security-tax-calculator':
    'Retirees and near-retirees use it to see how much of their benefit the IRS actually taxes — and to spot the tax torpedo, the hidden 40%+ effective rate on withdrawals inside the 85% zone, before they size a Roth conversion or IRA withdrawal through it.',
  'medicare-irmaa-calculator':
    'Anyone approaching 65 — or doing Roth conversions near it — uses it to find the cliff edges: IRMAA surcharges trigger on $1 over a threshold and are assessed per person, so one oversized conversion can cost a couple $1,148–$13,872 in a single year two years later.',
  'raise-vs-bonus-calculator':
    'Anyone offered "raise or bonus" uses it to see the compounding gap — equal percentages are not equal money, because the raise inflates every future raise, match, and bonus target while the bonus pays once and evaporates.',
  'benefits-value-calculator':
    'Anyone comparing job offers uses it to price the layer recruiters count on you ignoring — match, health premiums, PTO — and then divides by REAL weekly hours, because a 50-hour job and a 45-hour job do not work the same year.',
  'overtime-exempt-threshold-calculator':
    'Salaried workers and small employers use it because half the web still quotes the vacated $58,656 — the real 2026 threshold is $684/week, salary alone never exempts anyone, and the tool prices the exact weekly premium owed when a role fails any of the three tests.',
  'weight-cut-calculator':
    'Fighters and their corners use it because every dangerous cut is the same arithmetic mistake — treating water and fat as interchangeable. It splits the cut into the two real phases, flags cuts past the ~5% acute ceiling, and shows the calendar the physics actually requires.',
  'training-load-acwr-calculator':
    'Athletes and coaches use it to audit training spikes before they become injuries — uncoupled ratio the way Gabbett validated it, because the coupled formula puts this week in both sides of the division and flatters exactly the spikes that break people.',
  'critical-power-calculator':
    'Cyclists and triathletes use it to turn two all-out time trials into the whole power-duration curve — CP as the aerobic ceiling, W′ as the anaerobic battery — with time-to-exhaustion at any pace, replacing the arbitrary 95%-of-20-minutes FTP estimate.',
  'wilks-score-calculator':
    'Powerlifters comparing across eras use it because old meet results are in Wilks and current ones are in DOTS — and the gap between the two scores reveals exactly whether the retired formula was flattering their weight class.',
  'race-time-predictor-calculator':
    'Runners use it to convert any race result into realistic targets at every other distance — the 1.06 fatigue exponent instead of the linear pace math that overpromises a marathon by 20+ minutes and wrecks race plans at mile 18.',
  'dependent-care-fsa-vs-credit-calculator':
    'Working parents use it at open enrollment to settle the FSA-vs-credit question on the 2026 rules — the new 50%-to-20% schedule and the $7,500 limit — because the dollar-for-dollar expense-cap offset means you can never have both on the same money, and the crossover is different at every income.',
  'hsa-vs-fsa-calculator':
    'Employees at open enrollment use it to end the debate with their own numbers: both accounts save the same marginal rate, but the HSA leftover compounds for decades while the FSA forfeits everything above the $680 carryover — plus the spouse-FSA trap that silently kills HSA eligibility.',
  'commission-draw-calculator':
    'Sales reps weighing a draw-against-commission offer use it to find the breakeven — draw ÷ rate — and to watch the recoverable deficit snowball month by month, including the balance they would owe back if they walked.',
  'espp-calculator':
    'Employees with a stock purchase plan use it to price the lookback — 85% of the lower price turns a rising stock into an instant gain — and to catch the counterintuitive case: after a down offering period, qualifying disposition can cost MORE tax than selling early.',
  'i-bond-calculator':
    'Savers parking emergency cash use it to check the real math: the composite rate is fixed + 2×inflation + their product (4.26% right now, not the 4.24% blogs quote), federal tax defers and state tax never applies, and the 3-month penalty under 5 years is priced to the dollar.',
  'sep-ira-calculator':
    'Freelancers who missed the December 31 solo 401(k) setup use it as the rescue — a SEP opens and funds by the filing deadline, extensions included — and stay for the verdict: identical employer math, so the solo 401(k) advantage is exactly the deferral, and the employee-uniform-percentage trap is the real separator.',
  'solo-401k-calculator':
    'Freelancers use it at year-end to find the real number: the employer side is 20% of net earnings after the half-SE-tax adjustment — not the "25% of profit" every article quotes — plus the deferral and catch-up, capped at $72,000 for 2026.',
  'roth-conversion-ladder-calculator':
    'Early retirees use it to see the ladder as a schedule, not a slogan: the 5-year bridge fund, the exact tax on each annual conversion at 2026 brackets, the Jan-1 clock that makes December conversions season in four years, and the 12%-bracket ceiling for sizing rungs.',
  'mega-backdoor-roth-calculator':
    'High earners at companies with after-tax 401(k) plans use it to find the number HR never quotes: the exact gap between their deferral-plus-match and the $72,000 annual-additions cap — and what two decades of converting that gap to Roth is worth versus leaving it taxable.',
  'social-security-pia-calculator':
    'Anyone within a decade of claiming uses it to see the statute itself: AIME through the 2026 bend points ($1,286/$7,749), rounded down to the dime, then the exact −30% to +24% swing between claiming at 62 and 70 — the number the SSA estimator shows without the formula.',
  'backdoor-roth-pro-rata-calculator':
    'High earners attempting a backdoor Roth with an old rollover IRA use it before December 31: the pro-rata rule taxes the conversion by the pre-tax share of ALL their IRAs, and the tool shows the bill — plus the 401(k) roll-in rescue that makes it clean.',
  '403b-calculator':
    'Teachers and hospital staff use it to claim the catch-up most articles describe wrong: the 15-year rule is a least-of-three formula where heavy savers get zero, and the tool shows which prong binds and how it stacks with age catch-ups — $35,500 possible at 50+, $38,750 at 60–63 in 2026.',
  'tsp-calculator':
    'Federal employees and BRS service members use it to catch the per-pay-period trap: the 5% match is computed every period, so hitting the $24,500 cap early forfeits match outright. It shows the exact forfeiture and the percentage election that maxes the year with every period matched.',
  'truck-driver-per-diem-calculator':
    'Drivers use it twice: owner-operators price the 80% DOT deduction on their real days out — 260 days is a $16,640 write-off — and company drivers see what a carrier per-diem program adds to take-home versus what it quietly cuts from Social Security, unemployment, and mortgage-verifiable income.',
  'travel-nurse-pay-calculator':
    'Any nurse weighing a contract against a staff job uses it to unblend the agency\'s headline rate: taxable wage after tax, stipends tax-free while the tax home holds, real duplicated housing off the top — and the breakeven stipend where the contract stops winning. The 12-month tax-home trap is built into the math.',
  'rent-affordability-calculator':
    'Apartment hunters use it before the showing, not after the rejection: the 30% rule and the landlord\'s 40× requirement are the same formula (income ÷ 40), the 3× rule is looser, and all of them run on gross pay — so the tool shows what the rules allow, what your debts leave, and the exact HUD burden status of the place you want.',
  'annuity-payout-calculator':
    'Anyone holding an insurer\'s monthly-income quote uses it to compute what the agent never volunteers: the implied interest rate. A $650/month promise on $100k is a 4.82% rate — and whether that beats Treasuries is the entire decision, hidden in plain sight.',
  'rule-of-72-doubling-calculator':
    'Anyone quoting the 72 shortcut uses it to see the exact answer beside the estimate — the rule is off a full year at savings-account rates — and the inflation flip: at 3%, idle cash loses half its purchasing power every 23.4 years. It turns a cocktail-party rule into a precision tool.',
  'paycheck-withholding-calculator':
    'Anyone staring at a gutted commission or overtime check uses it to learn the annualization rule: payroll pretends this check is every check, pushes the phantom annual salary through the full brackets, and the over-withholding comes back only as a refund. It turns paystub shock into a W-4 decision.',
  'home-office-deduction-calculator':
    'Freelancers and gig workers use it at tax time — or better, in January when the year can still be planned. The simplified method\'s $1,500 cap quietly loses to actual expenses for most renters, and seeing the gap in dollars is what makes the recordkeeping worth it.',
  '529-college-savings-calculator':
    'Parents and grandparents use it at the first birthday-party conversation about college: the sticker price today is not the bill at enrollment, and this shows the inflated 4-year total against the current plan\'s trajectory. The coverage percentage and the fully-funded monthly number turn an abstract worry into a savings target.',
  'pet-first-year-cost-calculator':
    'Prospective pet owners use it before the shelter visit, when the adoption fee feels like the whole cost. It separates the one-time expenses from the recurring run rate and forces the insurance-versus-vet-fund decision while it is still hypothetical.',
  'baby-first-year-cost-calculator':
    'Expecting parents use it to replace anxiety with a number: the daycare-dominated first year, priced by category, ending at a monthly figure they can test-drive before the due date. It turns "can we afford a baby" into a budget question with an answer.',
  'wedding-budget-calculator':
    'Engaged couples use it before the first venue tour, when "what can we afford" needs to be a number instead of a fight. The per-guest math reframes the guest list conversation, and the monthly savings line sets the date honestly.',
  'vacation-budget-calculator':
    'Families use it in the planning argument: "can we afford this trip" becomes a per-day number and a monthly savings target instead of a vibe. It is also the antidote to the post-vacation credit card bill — the trip gets paid before it happens.',
  '50-30-20-budget-calculator':
    'People use it the day they decide to "get serious about budgeting" — it converts one income number into three targets in ten seconds, then shows which bucket is actually breaking. The over/under view ends the latte debate: if needs are $400 over, the problem is housing, not coffee.',
  'emergency-fund-calculator':
    'People use it after the scare — the car repair that went on a card, the week of missed shifts — when "I need a buffer" needs to become a number and a finish date. It is also the first calculation in any financial reset, because everything else (debt payoff, investing) assumes the next emergency is already paid for.',
  'credit-card-minimum-payment-calculator':
    'Cardholders use it the month they realize the balance has not moved in a year: the simulation shows exactly where the payments went and the one change — freezing the payment — that ends it. It is the math behind the warning box on every statement.',
  'debt-avalanche-snowball-calculator':
    'Anyone carrying two or more debts uses it to end the strategy debate with their own numbers: the exact dollar and month difference between attacking the highest rate and attacking the smallest balance. It turns the loudest argument in personal finance into a five-minute decision.',
  'tip-calculator':
    'The most everyday calculator there is: splitting dinner with friends, tipping on a haircut, working out the delivery tip in the rain. People use it because nobody wants to do percentage math at the table — and because the "split 5 ways with 18%" answer needs to be instant.',
  'discount-calculator':
    'People use this standing in the store aisle. Stacked sales ("40% off + extra 20% off") are designed to feel bigger than they are, and this calculator reveals the register truth in seconds — whether that "deal" is 60% off or actually 52%, and what you really save.',
  'sales-tax-calculator':
    'Two groups live here: shoppers checking what a sticker price really costs at checkout, and freelancers or small businesses who need to reverse tax out of a receipt total for expense reports and bookkeeping. The reverse direction is the one that saves people at tax time.',
  'percentage-calculator':
    'Homework, tips, price changes, test scores, data at work — percent questions come in three forms and everyone mixes them up. People use this because it handles all three on one page without having to remember which formula goes where.',
  'bmi-calculator':
    'People use this before doctor visits, when starting a fitness plan, and for insurance and military/first-responder requirements that use BMI bands. It is a first screening number — crude, but the standard reference the whole health system still runs on.',
  'calorie-calculator':
    'The starting point of every diet that works: you cannot manage what you have not measured. People use this to get their maintenance number before a cut or bulk, then come back to adjust it as weight changes. It turns "eat less" into a specific, testable daily target.',
  'age-calculator':
    'Official forms, school enrollments, visa applications, "how old will I be when the mortgage ends," and birthday countdowns. People use this because exact age in years-months-days is surprisingly fiddly — months have different lengths and leap years exist.',
  'date-difference-calculator':
    'Contract terms, project deadlines, warranty windows, visa validity, countdowns to events. People use this whenever the question is "how many days between X and Y" — and the workday estimate makes it genuinely useful for planning, not just curiosity.',
  'gpa-calculator':
    'Students use this mid-semester to see where they stand, before registration to plan what grades they need, and when applying to programs with GPA cutoffs. The credit weighting is the point: a 4-credit class moves your GPA four times as much as a 1-credit one, and mental math always gets that wrong.',
  'crypto-profit-calculator':
    'People use this before selling (to see the real profit after fees), when planning exit targets, and at tax time to reconcile what the exchange says against what they actually made. Fees quietly change the answer more than most traders expect.',
  'roi-calculator':
    'Comparing investments honestly requires one number: annualized return. People use this to compare a rental property against an index fund, a side business against their 401(k), or any "I turned $X into $Y" claim against reality — because 48% over five years is very different from 48% over two.',
  'inflation-calculator':
    'Salary negotiations ("is my raise real?"), retirement planning ("what will $4,000 a month buy in 2045?"), and understanding why grandparents quote prices in dimes. People use this to translate money across time — the one conversion every financial decision quietly assumes.',
  'break-even-calculator':
    'Before launching a product, signing a lease, or buying equipment, one number decides whether the plan can work at all. People use this to kill bad business ideas in five minutes (cheaply) and to price new products against reality instead of optimism.',
  'one-rep-max-calculator':
    'Lifters use this every training day: percentage-based programs (5/3/1, most powerlifting plans) need a max to compute working weights, and testing a true 1RM is fatiguing and risky. Trainers use it to program for clients without ever maxing them out.',
  'heart-rate-zone-calculator':
    'Runners and cyclists use this to keep easy days truly easy (Zone 2 is where the aerobic engine gets built), and trainers use it to write cardio prescriptions. It exists because "220 minus age" zones ignore resting heart rate — the biggest fitness variable.',
  'macro-calculator':
    'People use this when calories alone stop working: two diets with identical calories build different bodies depending on the protein/carb/fat split. It is the starting point for meal prep, the number MyFitnessPal asks for, and the answer to "how much protein do I actually need?"',
  'running-pace-calculator':
    'Runners use this mid-training-block to convert treadmill speed to pace, to see what a 10K time predicts for a marathon, and to set honest race-day targets. Coaches use it to write workouts — "4:55/km" means nothing until you see it per mile or as a finish time.',
  'mulch-calculator':
    'Homeowners use this to avoid the second trip to the garden center; landscapers use it to quote jobs on-site in front of the client. The bulk-yards-to-bags conversion is the money question: above two yards, ordering wrong costs real cash.',
  'sod-calculator':
    'Landscapers use it to quote sod installs on the spot — area, waste factor, pallet count, done in front of the client. Homeowners use it because sod dies on the pallet in a day: ordering short means a second delivery of scraps, ordering long means cooked grass you paid for.',
  'irrigation-zone-calculator':
    'Irrigation techs use it to check a zone against the property\'s real supply before trenching — bucket test in, capacity verdict out. Homeowners adding heads to an existing zone use it to learn why the last head on the line barely spits: the zone was already overdrawn.',
  'gravel-calculator':
    'Driveway and path projects live here. People use this to order once and order right — gravel is sold by the ton but planned by the yard, and the conversion is exactly where DIY estimates go wrong. Landscapers use it to sanity-check supplier quotes.',
  'concrete-calculator':
    'A concrete pour cannot pause while you buy more — ordering short ruins the slab. People use this to size ready-mix orders and bag counts for patios, walkways, and footings, and to decide the bags-versus-truck question (the crossover is about one yard).',
  'body-fat-calculator':
    'People use this when the scale alone stops telling the truth — weight can drop while muscle goes with it. It is the no-equipment standard (developed for the US Navy), used before military fitness assessments, by trainers tracking clients, and by anyone who wants a trend line smarter than pounds.',
  'final-grade-calculator':
    'The most-Googled student question every December and May: "what do I need on the final?" Students use it to triage finals week — which course needs an all-nighter and which grade is already locked. Knowing a target is impossible is valuable too: it redirects the study time.',
  'ohms-law-calculator':
    'Students checking homework, hobbyists sizing resistors for LED projects, electricians and automotive techs doing quick field math. People use it because the rearrangements (solve for R, solve for P) are where errors creep in — and a wrong resistor size can mean a burnt circuit.',
  'periodization-planner':
    'Coaches and self-coached athletes use this at the start of every season: training without a peak date is just exercising. It answers "what should I be doing 8 weeks out?" with dated phases and loads — the planning layer that separates programs from workouts.',
  'ckd-carb-up-calculator':
    'Keto lifters use this every Friday: the carb-up is the most-mismanaged part of cyclical keto, and both overeating and under-filling glycogen cost performance. It is also the panic-stopper — the math that explains why Monday\'s scale jump is water, not failure.',
  'velocity-based-training-calculator':
    'Lifters with a VBT device (or a phone app) use this to autoregulate: bar speed reveals today\'s strength before you waste a warm-up guessing. Coaches use it to set velocity targets instead of fixed percentages — the difference between training an athlete and training a spreadsheet.',
  'vo2max-calculator':
    'Runners use this to track the engine; beginners use the walk test as a safe entry point; coaches use it to group athletes. It is the number smartwatches estimate opaquely — this shows the actual field-test math, free, with nothing on your wrist.',
  'framing-calculator':
    'DIYers standing in the lumber aisle and estimators pricing a basement finish both use this: the stud-count rules are simple but the openings-and-corners arithmetic is where orders go wrong. Contractors use the cost layer as a first-pass bid check before quoting.',
  'drywall-calculator':
    'Remodelers use it the night before the supplier run: sheets are only half the order — mud, tape, and screws are what get forgotten. The editable cost section doubles as a homeowner\'s sanity check against a drywall sub\'s quote.',
  'roofing-calculator':
    'Homeowners use this before calling roofers: knowing your square count and bundle math converts a black-box quote into a conversation. Handy homeowners pricing a shed or garage roof get the full materials list without climbing a ladder twice.',
  'paint-calculator':
    'Weekend painters use it to buy once — the can coverage, coat count, and openings math decide whether it is a 2-gallon or 3-gallon job. Landlords refreshing units between tenants use the cost layer to compare DIY against a painter\'s day rate.',
  'tile-calculator':
    'DIY tilers use it because the three purchases (tile, thinset, grout) live in different aisles with different coverage math. The diagonal-layout waste toggle exists because that is the exact mistake that strands a Saturday project half-tiled.',
  'concrete-mix-calculator':
    'Anyone calling a ready-mix plant for the first time uses this: the plant asks "how many yards and what mix?" and this answers both. It is also the settle-the-argument tool for whether a job is a bagged-mix Saturday or a truck delivery.',
  'road-base-calculator':
    'Rural homeowners and contractors pricing driveways use it because tonnage-with-compaction is where base orders go 25% short. The material toggle (crushed vs recycled vs asphalt) matters because densities — and prices — differ enough to change the order.',
  'driveway-cost-comparison':
    'Homeowners staring at three wildly different contractor bids use this to compare them on equal terms: the 20-year cost-per-square-foot column converts sales pitches into math. It is the five minutes that prevents a five-figure mistake.',
  'fence-calculator':
    'DIYers pricing a backyard fence and fencing contractors building a first-pass estimate both use this: posts, rails, boards, and concrete all follow simple count rules, but the gate subtraction and doubled gate posts are where orders go wrong. The cost layer doubles as a homeowner\'s check against a fencing quote.',
  'deck-calculator':
    'Weekend deck builders use it to write one lumberyard order instead of three; estimators use it as a sanity check before quoting. The board-coverage math (5.625" per row) and the 350-screws-per-100-sqft rule are exactly the numbers people estimate by feel and get wrong.',
  'insulation-calculator':
    'Homeowners insulating a garage or attic use this to buy the right batt width for their framing and the right R-value for their climate zone — the two mistakes that waste the most money. The DOE zone guidance answers "how much R do I actually need" without a sales pitch.',
  'asphalt-calculator':
    'Anyone getting paving bids uses this: asphalt is sold by the ton, and knowing your tonnage before the salesman arrives converts a black-box quote into a conversation. The sq-ft-per-ton check catches bad math on both sides of the transaction.',
  'board-foot-calculator':
    'Woodworkers buying hardwood and anyone pricing rough lumber at a sawmill use this: board feet is a volume unit that looks like an area unit until the invoice arrives. Run the stack count before the lumberyard, not after.',
  'stair-calculator':
    'Deck builders and basement finishers use this to get equal, code-legal risers on the first layout — the 7.75" IRC limit and the treads-minus-one rule are where stair math goes wrong. The stringer length and 2R+T comfort check come free with the count.',
  'rafter-length-calculator':
    'Framers use it to order and cut rafters without climbing back up to re-measure: span, pitch, and ridge thickness in, exact cut length and plumb angle out — the same multipliers printed on a framing square. Homeowners pricing an addition use it to sanity-check the lumber list before the quote.',
  'flooring-calculator':
    'Installers use it to order once and order right — the waste factor changes with the layout, and a diagonal or herringbone job ordered at the straight-lay 10% runs short mid-room. Homeowners use it to check the installer\'s material line against the carton coverage before paying for boxes that never get opened.',
  'ladder-angle-calculator':
    'Roofers and gutter crews use it before the ladder leaves the truck: eave height in, and it tells you whether the ladder on the rack reaches with the required 3 feet above the edge — or whether today needs the 28. Homeowners use it to learn that their 24-footer only works to 21, before finding out at the top.',
  'ramp-slope-calculator':
    'Contractors quoting accessibility work use it to show the client why a two-foot rise is a 24-foot structure — the landings do the talking. Families planning for aging-in-place use it to learn whether the yard has room for 1:12 at all, or whether a switchback or lift is the real answer.',
  'deck-footing-calculator':
    'Deck builders use it at the permit counter: tributary area in, the exact IRC R507.3.1 footing size out — no more upsizing every pier to 24 inches out of habit. Homeowners use it to check a contractor\'s plan before the holes are dug, because undersized footings are invisible until the deck starts to lean.',
  'sump-pump-calculator':
    'Homeowners replacing a dead pump use this to stop guessing at horsepower in the aisle — the 60-second rise test turns their actual pit into a GPH number, and the TDH math explains why the box rating is fiction. Waterproofing contractors use it to show customers the sizing logic, because "1/3 HP is fine" lands better with the inflow math next to it.',
  'dry-well-calculator':
    'Homeowners with downspouts dumping at the foundation and no downhill outlet use this to find out what underground storage actually takes — the 40% void ratio is the surprise that turns "dig a hole" into four pits and nine yards of stone. Drainage contractors use the runoff-to-pit math as the first pass before soil percolation tests refine it.',
  'french-drain-calculator':
    'Landscapers and drainage contractors use it to quote materials in one pass — gravel tonnage with pipe displacement already out, fabric for the burrito wrap, and the 1% slope check that decides whether the job needs a sump instead. Homeowners use it to learn why the "holes down" detail and the fabric wrap are the difference between a 30-year drain and a clogged trench.',
  'roof-pitch-calculator':
    'Roofers use it to stop converting pitch in their head: the slope factor out of this is what turns a measured footprint into the squares you actually order, and the hip factor is why valleys eat more material than the plan suggests. Homeowners use it to check a bid — footprint times the multiplier is the area, and anything padded past it needs an explanation.',
  'excavation-calculator':
    'Anyone pricing a dig — basement, pool, pond, foundation, drainage — uses this before calling the hauler: the in-ground yards are never the hauled yards, and the 25–40% swell difference is real money at $150 a load. Excavators use it as a five-second sanity check on truck counts before the iron shows up.',
  'retaining-wall-calculator':
    'Landscapers and hardscape crews use it to order once: courses × blocks-per-course is the supplier\'s language, and the buried course and drainage column are the two line items homeowners always leave off the DIY count. Homeowners comparing bids use it to see whether a quote actually includes base prep and drainage — the parts that decide whether the wall is still standing in ten years.',
  'siding-calculator':
    'Homeowners collecting siding quotes use this to know their square count before the first salesman measures — it converts a black-box estimate into a conversation. Contractors use it as a five-second first pass before a formal takeoff.',
  'paver-calculator':
    'DIY patio builders use this because the base is what everyone forgets: the pavers are the cheap, visible 20% — the tonnage underneath is the job. Landscapers use the full-stack output (pavers, base, sand) as a bid starting point.',
  'block-calculator':
    'Anyone pricing a garden wall or foundation uses this: block-per-square-foot is simple, but the breakage factor and mortar ratio are where orders come up short mid-wall. The per-block labor field doubles as a check against a mason\'s quote.',
  'wallpaper-calculator':
    'DIY wallpaperers use this because the pattern repeat — not the wall area — decides the roll count, and the label math (straight vs drop match) is exactly what big-box estimators skip. The same-dye-lot warning has saved more walls than any calculator feature.',
  'rebar-calculator':
    'Anyone pouring a slab uses this the day before the steel order: the grid count is easy, but the laps allowance and the pounds-to-sticks conversion are where orders come up short. Concrete subs use the weight output as a quick check against the supplier quote.',
  'footing-size-calculator':
    'Owner-builders and garage/shed builders use this to size footings from load and soil before the building department asks; contractors use it as a five-second prescriptive check. It deliberately says when to stop calculating and call an engineer — that honesty is the feature.',
  'block-fill-calculator':
    'Masons and owner-builders use this because grout volume is the number everyone underestimates — a "small" 40-foot wall swallows almost two cubic yards. Ordering right means no cold joint while the second truck is dispatched.',
  'joist-span-calculator':
    'Deck builders, basement finishers, and anyone staring at an undersized floor use this: the IRC table answer to "will 2×10s at 16 inches cover 14 feet" without flipping through code tables. The pass/fail verdict is the feature — max span alone makes people do interpolation math in their heads.',
  'board-batten-calculator':
    'DIY accent-wall builders use this because uneven end bays are the tell of amateur work — the math is one equation but nobody wants to solve it on a ladder. Interior designers use it to spec layouts contractors can\'t mess up.',
  'gutter-size-calculator':
    'Homeowners getting gutter quotes use this to know whether they need 5-inch or 6-inch before the upsell conversation, and how many downspouts the run demands. The pitch factor is the part every free estimator skips — steep roofs need bigger gutters, full stop.',
  'pool-volume-calculator':
    'Pool owners use this once and write the number on the equipment pad forever: every chemical dose, shock treatment, and heater spec keys off gallons, and most owners are guessing within ±30%. Pool service techs use it on new accounts where the owner has no idea.',
  'pool-pump-calculator':
    'Pool owners fighting cloudy water use this to find out whether the problem is runtime, not chemistry — one division tells you. The electricity cost layer makes the variable-speed upgrade math concrete: same turnover, a third of the watts.',
  'pool-heater-calculator':
    'Anyone pricing a heater or heat pump uses this before the sales call: the ×12 surface-area rule gives the honest minimum, so a 400k-BTU quote for a small pool reads as what it is. The solar-cover note saves more money than the calculator itself.',
  'pool-chemical-calculator':
    'Pool owners and route techs use this on every green-to-clean and every new account: the per-10k label rates are universal, but nobody\'s pool is 10,000 gallons. The CYA warnings (dichlor adds stabilizer, nothing removes it) prevent the most expensive chemistry mistake in the hobby.',
  'voltage-drop-calculator':
    'Electricians sizing runs to outbuildings, DIYers wiring a shed, and RV owners spec-ing a pedestal all hit the same wall: the wire is legal by ampacity but drops too many volts over distance. This catches that before the trench is backfilled.',
  'wire-size-calculator':
    'Anyone adding an EV charger, hot tub, or shop heater asks "what wire and what breaker?" — and the 125% continuous-load rule is exactly what casual answers miss. This applies the NEC table and the rule together, copper or aluminum.',
  'hvac-btu-calculator':
    'Homeowners use it before contractor season: knowing your tonnage converts "you need a 5-ton unit, trust me" into a conversation. It is also the reality check for window units and garage mini-splits — right-sizing beats oversizing every time.',
  'bid-sheet-calculator':
    'Contractors use it the night before the walkthrough: dump the takeoff counts from the framing, drywall, and paint calculators in as line items, apply markup, and print a bid. Homeowners run it in reverse — paste a contractor\'s quote in line by line and see the margin hiding inside it.',
  'markup-margin-calculator':
    'Anyone who quotes prices uses this: supplier talks and accounting run on margin, price sheets run on markup, and mixing the two up is how a "profitable" job loses money. The overhead solver is the part people bookmark — it converts what the business costs to run into the markup every quote must carry.',
  'real-estate-commission-calculator':
    'Agents use it before listing appointments and when comparing brokerages: the headline split means nothing until the franchise fee and transaction costs come out. New agents use it to find out why the 5.5% they quoted is really 1.7% to them.',
  'cap-rate-calculator':
    'Investors use it in the first five minutes of screening a listing — honest NOI, cap rate, and GRM kill bad deals fast, and the financing layer shows whether the deal still cash-flows at today\'s rates. Agents use it to speak investor language with clients.',
  'gci-goal-calculator':
    'Agents building a business plan use it to convert "I want to make $150k" into "I need 21 closings, which is 1.8 a month" — the number that actually drives prospecting. Brokers use it in recruiting conversations to show agents what their split really produces.',
  'sales-commission-calculator':
    'Salespeople use it when the comp plan lands and again at every commission check: marginal tiers make the payout non-obvious, and the blended rate is the only honest way to compare plans. Managers use it to model what a proposed tier change costs.',
  'quota-attainment-calculator':
    'Reps use it mid-quarter to replace vibes with math — attainment, pace gap, and the monthly close rate needed to catch up. Sales leaders use the projected year-end number in forecast calls, and job changers use it to sanity-check the quota attached to an offer.',
  'ote-calculator':
    'Anyone comparing sales offers uses this: the OTE headline hides the quota behind it, and implied quota (variable ÷ commission rate) is the number that decides whether the offer is good. Recruiters use it too — it is the fastest way to explain why their plan is competitive.',
  'food-cost-calculator':
    'Owners and chefs run it weekly: the gap between theoretical (menu-card) and actual (inventory) food cost is where profit leaks, and you cannot fix a leak you have not measured. It is also the first number a buyer or lender asks for.',
  'plate-cost-calculator':
    'Chefs use it when supplier prices move and before any menu reprint: plate cost ÷ target food cost is the price floor, and the per-cover margin shows which dishes actually pay the rent. Caterers use it to quote per-head menus without guessing.',
  'prime-cost-calculator':
    'Operators use it as the monthly health check — COGS plus labor against the 60–65% benchmark tells you whether the problem is the kitchen, the schedule, or neither. Lenders and franchise reviewers ask for prime cost before almost anything else.',
  'pour-cost-calculator':
    'Bar managers use it when pricing the drink menu and when bartender variance shows up in inventory: pours per bottle, cost per pour, and profit per bottle turn a liquor invoice into a pricing decision. New bar owners use it to discover why the bar subsidizes the kitchen.',
  'trainer-rate-calculator':
    'Trainers going independent use it before quitting the gym job: income goal plus costs over real session capacity gives the rate floor, and it is almost always higher than expected. Gym managers use it to show trainers why the 50/50 split is not the villain.',
  'session-package-calculator':
    'Trainers use it to price 10-packs without gut-feel discounts — the effective per-session rate shows exactly what the discount costs, and the monthly figure shows what each package client is worth. Studio owners use it to standardize pricing across a team.',
  'client-capacity-calculator':
    'Trainers use it to find their income ceiling before they hit it: slots, honest utilization, and sessions-per-client produce the max client count and the annual revenue at capacity. It answers "when do I raise rates" with a number instead of a feeling.',
  'lawn-care-pricing-calculator':
    'Landscapers use it in the driveway before quoting: square footage and obstacles become minutes, minutes become a defensible price, and the frequency surcharge stops biweekly clients from silently paying weekly prices. New operators use it to stop underbidding the established crews.',
  'lawn-revenue-planner':
    'Lawn care owners use it in the off-season to plan: clients × price × visits is the whole business, and seeing that each added client is worth $1,350 a season turns "I should advertise" into a specific target. It is also the loan-conversation number for equipment financing.',
  'snow-removal-bid-calculator':
    'Plow operators use it when a property manager calls mid-storm: area and depth become a per-push price in seconds, and the seasonal contract figure is already discounted correctly. Landscapers use it to keep winter revenue from being whatever the caller sounds willing to pay.',
  'gig-driver-hourly-calculator':
    'Gig drivers use it weekly to answer the only question that matters — is this beating a job? — with fuel and wear subtracted and every online hour counted. People considering signing up use it with the app\'s promised earnings before buying the "make $30/hour" pitch.',
  'mileage-deduction-calculator':
    'Every self-employed driver at tax time: 2026 is a split-rate year and most calculators apply one rate all year, which is wrong both directions. Gig drivers, realtors, and mobile service pros use it to turn a mileage log into an actual deduction figure.',
  'delivery-offer-calculator':
    'Drivers use it in the parking lot with the accept timer running: payout per mile and net per hour after costs, with a verdict. Multi-appers keep the vehicle inputs set and just punch in each offer as it pings.',
  'nurse-shift-pay-calculator':
    'Nurses use it when comparing facilities or deciding whether to pick up the night shift: base rate is marketing, the differential stack is money. Travel nurses use it to convert blended rates back into an honest hourly.',
  'overtime-calculator':
    'Hourly workers use it to check a paycheck before cashing it — the federal 40-hour rule is simple, but the California daily tiers and double time are where payroll errors (and back-pay claims) actually live. Small business owners use it to cost out a long week before promising the deadline.',
  'pto-accrual-calculator':
    'Employees use it before booking a trip: will the balance actually cover the dates, or does the trip land two pay periods early? HR and small-business owners use it to sanity-check a PTO policy — how much a 15-day allowance really costs, and where the cap quietly eats accrual.',
  'teacher-pay-calculator':
    'Teachers use it to plan the master\'s-degree lane change (the biggest raise lever in the profession) and to survive the 10-month paycheck schedule without a broke August. Career changers use it to see year 10 before signing up for year 1.',
  'truck-driver-pay-calculator':
    'Drivers use it to compare carriers honestly: CPM × miles ÷ on-duty hours converts any offer into an hourly rate you can hold against a local job. It is also the number that settles the "is OTR worth it" argument at home.',
  'self-employment-tax-calculator':
    'New freelancers use it the week they quit their job — the 15.3% nobody mentioned — and veterans use it to sanity-check their books. It separates the capped Social Security part from uncapped Medicare so high earners see exactly where the tax changes shape.',
  'quarterly-estimated-tax-calculator':
    'Every 1099 worker four times a year: it combines SE tax and income tax into the actual payment, and the safe-harbor line tells penalty-worriers the minimum that keeps them clean. Accountants point clients at it instead of explaining 1040-ES over the phone.',
  'invoice-late-fee-calculator':
    'Freelancers and agencies use it in the past-due reminder email — showing the client the exact accrued fee and total due gets checks written. Bookkeepers use it to apply contracted rates correctly across a whole aging report.',
  'pipe-size-calculator':
    'Remodelers adding a bathroom use this to answer "can I tee off the existing line?" with fixture-unit math instead of hope. Plumbers use it as a fast first pass before the official UPC/IPC design.',
  'billable-hours-calculator':
    'Law associates use it to see whether the firm\'s hours target is even reachable at their utilization. Solo consultants use it in January: revenue goal ÷ rate ÷ honest utilization, then they find out what the year actually requires before booking anything.',
  'realization-rate-calculator':
    'Firm partners use it at year-end to find which leak is costing them — write-downs, unbilled time, or collections. Solo attorneys and consultants run it quarterly; a 5-point realization gain is pure found revenue with zero new clients.',
  'consultant-day-rate-calculator':
    'People quitting salaried jobs to consult use it the week before they give notice: income goal plus overhead divided by realistic billable days. It replaces the classic mistake of dividing old salary by 2,080 and wondering why year one went broke.',
  'tip-pool-calculator':
    'Shift leads use it at close-out to split the pool where everyone can watch the math. Servers and bussers use it to verify their cut — hours times points is only fair if everyone can see the arithmetic.',
  'tip-credit-calculator':
    'Tipped workers use it after a slow week: if cash wage plus tips misses the minimum, the employer owes the difference — this computes the exact top-up. Workers moving states use it to learn whether they just landed in a no-tip-credit state with full minimum wage plus tips.',
  'tip-income-calculator':
    'Servers and bartenders use it to answer "can I afford this apartment?" honestly — fixed bills go against the guaranteed base-pay floor, tips go to savings and debt. It is the antidote to budgeting on your best Friday.',
  'glycogen-calculator':
    'Keto dieters use it to decode the week-one scale crash; athletes use it to size the fuel tank before race week. Coaches point athletes at it when the post-refeed scale spike causes a panic — 3 g of water per gram of glycogen explains everything.',
  'carb-loading-calculator':
    'Marathoners and triathletes use it in race week: 10–12 g/kg/day is the evidence-based target, and this turns body weight into actual grams per meal. Coaches use it to write the two-day fueling plan instead of saying "eat more pasta."',
  'sweat-rate-calculator':
    'Runners and field-sport athletes use it once per season per climate: weigh before and after, get your personal L/hr, and hydration stops being guesswork. It also answers the "why do I cramp and you don\'t" question between training partners.',
  'dots-score-calculator':
    'Powerlifters use it to compare against lifters in other weight classes and to pick the right weight class before a meet. Coaches track athlete progress with it when body weight is moving — the total can stall while the score quietly climbs.',
  'beam-load-calculator':
    'Engineering students use it to check homework before submitting; practicing engineers use it to sanity-check software output — if SAP2000 and PL/4 disagree, the model is wrong. DIYers use it before trusting a shelf span or a garage hoist point.',
  'load-combination-calculator':
    'Structural engineers use it as the first step of every member design — which combination governs sets everything downstream. Students use it to stop mixing LRFD factors with ASD capacities, the classic exam and rookie error.',
  'horsepower-torque-calculator':
    'Mechanical engineers and mechanics use it both directions: motor sizing from load torque, and decoding dyno sheets where peak torque and peak power happen at different RPM. Also settles bar arguments about why diesels tow.',
  'rc-circuit-calculator':
    'Electronics hobbyists use it for debounce and filter design; EE students live in it during circuits courses. The 1τ/63.2% benchmark is the fastest way to read a scope trace without a cursor.',
  'wrvu-compensation-calculator':
    'Physicians use it before contract negotiation: model the threshold and conversion factor against MGMA medians before the administrator names a number. Residents use it to understand what the attending contract they\'re about to sign actually pays.',
  'rent-vs-buy-calculator':
    'Anyone facing a move uses it to kill the "rent is throwing money away" argument with actual numbers — breakeven year included. Agents and lenders point clients at it because an honest comparison builds more trust than a sales pitch.',
  'closing-cost-calculator':
    'First-time buyers use it the week before making an offer — the down payment is not the whole check. Buyers use it again when the Loan Estimate arrives to catch padded fees line by line.',
  'rmd-calculator':
    'Retirees use it every December: the divisor shrinks every year, so the RMD percentage climbs — this shows both. Advisors use it to size Roth conversions in the gap years between retirement and age 73.',
  '401k-contribution-calculator':
    'Employees use it at open enrollment and after every raise: what does 1% more actually cost per check, and is the full match being captured? It is the answer to the two most common 401(k) questions — "how much should I put in" and "what will my paycheck look like."',
  'savings-rate-calculator':
    'The FIRE-curious use it to convert a vague "I should save more" into a date: raise the rate five points and watch years fall off. It is also the honest mirror for high earners — a big salary at a 10% rate retires later than a modest one at 40%.',
  'hsa-contribution-limit-calculator':
    'HDHP enrollees use it at open enrollment and after any mid-year change: employer money, part-year eligibility, and the 55+ catch-up all move the number, and overfunding costs a 6% excise tax. It also surfaces the payroll FICA trick most benefits portals never mention.',
  'roth-ira-contribution-limit-calculator':
    'Anyone whose income crossed into six figures uses it in January or at bonus time: the phase-out trims the limit gradually, and guessing wrong either wastes Roth space or triggers the 6% excess-contribution penalty. It turns "am I still eligible" into an exact dollar amount.',
  'roth-vs-traditional-calculator':
    'Savers use it every time income changes: the first job (low bracket — Roth), the peak-earning years (high bracket — Traditional), and the in-between years where splitting is the honest answer. It converts a tax-law guessing game into one rate comparison.',
  'pension-lump-sum-vs-annuity-calculator':
    'Anyone handed a pension buyout packet uses it in the 60–90 day election window: the implied payout rate and breakeven age convert a stack of actuarial tables into one question — how long do you expect to live, and do you trust yourself with the lump.',
  'social-security-breakeven-calculator':
    'People approaching 62 use it to see the real trade: a 30% haircut for eight extra years of checks, with the crossover age made explicit. Couples use it for the higher earner — delaying to 70 is really buying the survivor a bigger check.',
  'safe-withdrawal-calculator':
    'Near-retirees use it to turn a portfolio balance into an income number, and FIRE planners use it to test 40-year horizons at 3.5%. It answers the only question that matters: what can I spend without the money dying first?',
  'va-funding-fee-calculator':
    'Veterans use it before house-hunting: the fee tiers make 5% down worth real money on subsequent use, and the exemption check catches the disability waiver people leave on the table. Lenders embed it to pre-answer the "what is this fee?" call.',
  'military-retirement-calculator':
    'Service members at the 10–15 year mark use it to price the decision to stay: 20 years is a cliff worth 50% of base pay for life, COLA-adjusted. BRS members use it to see why the TSP match matters more than the smaller multiplier.',
  'student-loan-idr-calculator':
    'Borrowers use it before recertification to predict the payment from this year\'s AGI — and to see whether the balance even matters. Financial aid offices point students at it to show that a $0 payment still counts toward forgiveness.',
  'first-apartment-budget-calculator':
    'New grads use it before apartment hunting to get one honest rent ceiling instead of three conflicting rules of thumb — and to see whether their savings survive signing day. Parents send it to kids to make the deposit math concrete before co-signing anything.',
  'salary-offer-comparison-calculator':
    'Job seekers with offers in different cities use it to compare purchasing power instead of headline salary. Recruiters and career offices link it to pre-answer the "but $15k more in NYC" question before the negotiation call.',
  'student-loan-vs-investing-calculator':
    'Borrowers with extra monthly cash use it to settle the pay-down-or-invest debate with fair same-outlay math instead of vibes. It makes the guaranteed-versus-expected tradeoff visible, which is the part most advice glosses over.',
  'moving-cost-calculator':
    'People relocating for a job use it right after the offer lands to price the sweat-versus-money decision before booking anything. Pair it with the salary offer comparison and the whole "should I take the job in Denver" question becomes arithmetic.',
  'mileage-vs-actual-expense-calculator':
    'Rideshare drivers use it at tax time to confirm the standard rate really is the bigger deduction — and new gig drivers use it in year one because the lock-in rule makes that first-year choice permanent. It turns a shrug into a four-figure difference.',
  '1099-vs-w2-calculator':
    'Anyone weighing a contract offer against a salary offer uses it to make the numbers comparable — recruiters quote 1099 rates knowing they look bigger. It prices the invisible costs (FICA, insurance, unpaid weeks) that decide whether the contract is actually a raise.',
  'brrrr-calculator':
    'Investors use it before tying up cash: the refi proceeds math decides whether the deal recycles capital or traps it, and the new-payment cash flow is the honest check most BRRRR hype skips. Hard-money lenders point borrowers at it to pre-screen deals.',
  'rental-depreciation-calculator':
    'Landlords use it at tax time to see the deduction that shelters their cash flow — and before selling, to price the recapture bill nobody warned them about. CPAs use it to show clients why "the rental loses money on paper" is a feature.',
  'prorated-rent-calculator':
    'Tenants use it to check a mid-month move-in quote before paying; landlords use it to charge the lease-specified method and end the argument with arithmetic. It settles the February discrepancy that calculators using 30-day months get wrong.',
  'employee-true-cost-calculator':
    'Owners use it before posting the job: pricing a role off the wage instead of the loaded cost is how small businesses quietly go underwater. It converts "can we afford help?" into a per-hour number you can build into quotes.',
  'cash-runway-calculator':
    'Founders and small business owners run it monthly — it is the survival countdown. The zero-growth case is the floor investors and lenders ask for, and having both numbers in seconds beats a spreadsheet nobody updates.',
  'commercial-lease-calculator':
    'Tenants use it before signing to convert the quoted base rate into the real all-in commitment, and to see what escalations do to a 5-year term. Brokers respect tenants who show up knowing the NNN actuals.',
  'hsa-growth-calculator':
    'HDHP enrollees use it during open enrollment to see what the triple tax advantage is actually worth in dollars — it converts "HSAs are good" into a five-figure 20-year advantage. The receipt-shoebox strategy FAQ alone changes how people spend.',
  'disability-insurance-calculator':
    'High earners with group LTD use this to discover the tax surprise before the claim does — a "60%" employer benefit is really ~42% of gross after tax, and the gap is a real monthly number they can quote to a broker. Physicians, dentists, and other own-occupation shoppers use it to size the individual policy instead of accepting the group number.',
  'term-vs-whole-life-calculator':
    'Anyone sitting across from an insurance agent uses this to turn the oldest sales argument in the industry into arithmetic with their own two quotes — the end-position comparison (what you hold minus what you paid) is the framing no illustration ever leads with. Fee-only planners use it to show clients why the "permanent" pitch only wins for permanent needs.',
  'life-insurance-calculator':
    'New parents and new homeowners use it before the first agent call, so the coverage conversation starts from their obligations instead of a sales script — the DIME-vs-10× gap is the moment people realize the rule of thumb was never about their family. Fee-only planners use it as the client homework that makes the first meeting productive.',
  'health-plan-comparison-calculator':
    'Anyone choosing between an HDHP and a PPO uses it to price the whole year instead of comparing monthly premiums. The break-even bill level is the number HR departments never show you.',
  'cobra-cost-calculator':
    'People between jobs use it inside the 60-day election window to decide on math instead of panic — the 102% full premium is a shock everyone should see coming. The retroactive-election FAQ is the piece most sites miss.',
  'home-affordability-calculator':
    'First-time buyers use it before talking to a lender, so the pre-approval number lands on a desk that already knows its own ceiling. It is the only affordability answer that solves for price with taxes, insurance, and PMI already inside the payment.',
  'fha-loan-calculator':
    'Buyers with 3.5% saved use it to see the payment lenders never quote upfront — with financed UFMIP and lifetime MIP included. The 15-year MIP discount and the life-of-loan MIP trap are the two facts that change real decisions.',
  '15-year-mortgage-calculator':
    'Buyers who can afford either term use it to settle the debate with the same monthly outlay on both sides — interest saved versus investing the difference. It makes the decision hinge on one honest question: can you beat the 15-year rate after tax?',
  'va-loan-calculator':
    'Veterans use it to see the benefit in dollars: funding fee financed, exemption checked, and the same house priced three ways so the FHA lifetime-MIP trap is visible next to the VA zero. The "should I put money down anyway" FAQ settles the most common mistake.',
  'refinance-break-even-calculator':
    'Homeowners getting refi mailers use it to test the pitch: break-even month first, then the horizon total that exposes a reset clock. It is the calculator that separates a lower payment from actual savings — the confusion lenders profit from.',
  'mortgage-points-calculator':
    'Buyers staring at a loan estimate use it in the lender\'s parking lot: the points line item becomes a breakeven month, and the verdict changes with honest tenure — keep the loan five years or less and the answer is usually no.',
  'debt-payoff-calculator':
    'Anyone carrying multiple balances uses it to end the snowball-versus-avalanche argument with their own numbers — exact payoff dates and the dollar gap between strategies. The negative-amortization flag catches the trap most calculators never mention.',
  'dti-calculator':
    'Mortgage shoppers use it before applying, so the lender\'s first gate is never a surprise — and the "max housing payment per rule" table converts an abstract ratio into a shopping number. The gross-vs-take-home FAQ explains why approvals always feel generous.',
  'car-affordability-calculator':
    'Car shoppers use it before the dealership, because the dealer\'s first question ("what payment works?") is designed to hide the price. The 10%-cap-with-insurance-inside answer is the one no car site leads with.',
  'lease-vs-buy-calculator':
    'Anyone handed a lease offer uses it to convert the money factor to a real APR and see the outlay-minus-equity comparison. The month-after-the-lease row is the argument that settles it.',
  'car-true-cost-calculator':
    'Drivers comparing "new car vs keeping the old one" use it to see depreciation as a line item — usually the largest cost and the only one without a bill. Per-mile pricing makes transit and EV comparisons honest.',
  'car-lease-payment-calculator':
    'Shoppers sitting in the dealership use it on their phones: the salesperson quotes a payment, and this splits it into depreciation and finance charges with the money factor converted to APR. It is the difference between negotiating a price and accepting a payment.',
  'apy-apr-converter':
    'Rate shoppers use it when two banks quote different conventions — one advertises APY, another APR — and the comparison is meaningless until both are in the same unit. The $10,000 one-year line turns the abstract rate into dollars.',
  'cd-interest-calculator':
    'Savers use it before locking anything up: the maturity number is the easy half — the early-withdrawal scenario against a plain HYSA is what decides whether the CD\'s rate premium is real for their timeline. It is the check that turns "great rate" into an actual decision.',
  'dividend-drip-calculator':
    'Dividend investors use it to hold through boring years: projecting income forward — yield on cost climbing toward 30% — turns an abstract compounding argument into the exact year the portfolio starts paying serious money. The DRIP-vs-cash comparison settles the reinvest question in dollars.',
  'capital-gains-tax-calculator':
    'Anyone about to sell stock, crypto, or a property uses it before the sale, not after: the stacking math means timing the sale across December and January — or holding one more month past the one-year line — can move thousands of dollars between brackets. It turns "what will I owe" into an exact number.',
  'net-worth-calculator':
    'Anyone doing an annual money checkup uses it to turn scattered accounts into one number with context — the Fed SCF median comparison and the illiquidity share are the parts generic net-worth tools skip.',
  'cost-of-living-comparison-calculator':
    'Job changers comparing offers across states use it to convert nominal salaries into real purchasing power with official BEA price parities — the difference between a raise and a hidden pay cut.',
  'raise-worth-calculator':
    'Anyone negotiating pay uses it to translate a percentage raise into after-tax dollars per paycheck — and to kill the "higher bracket means I lose money" myth with their own numbers.',
  'w4-withholding-calculator':
    'Anyone who got a surprise tax bill or a giant refund uses it mid-year with real paystub numbers to set the exact W-4 Line 4(c) amount — the correction no checkbox-only guide computes.',
  'bonus-tax-calculator':
    'Bonus recipients confused by a shrunken bonus check use it to separate the 22% flat withholding from their true marginal liability — and to know whether April brings money back.',
  'marginal-tax-bracket-calculator':
    'Anyone weighing overtime, a side gig, or a Roth conversion uses it to see their real marginal rate and bracket headroom — the two numbers every year-end tax decision depends on.',
  'box-fill-calculator':
    'Electricians use it before rough-in inspection because box fill is the math inspectors actually check — and it fails more jobs than any other count. DIYers use it before buying boxes: the smallest box that passes is rarely the one on the shelf at eye level.',
  'conduit-fill-calculator':
    'Electricians use it at the design table and again in the field when the pull plan changes — the 40% limit is the difference between a clean pull and stripped insulation. The grounds-count rule is the violation nobody sees coming; this counts them automatically.',
  'ampacity-derating-calculator':
    'Electricians in hot climates use it every summer — an attic at 122°F quietly strips a third of a conductor\'s rating. Solar installers and EV-circuit runners use it to prove the 125% continuous-load math holds after derating, which is the first thing a plan reviewer checks.',
  'motor-circuit-calculator':
    'Electricians and maintenance techs use it when a motor gets swapped or a compressor gets added: table FLC, 125% wire, 250% breaker, 115% disconnect — the four numbers on every motor inspection tag. The nameplate-vs-table rule is the part apprentices get wrong, and the calculator makes it impossible.',
  'service-load-calculator':
    'Electricians use it to justify a panel upgrade to the inspector — the demand-factored VA total is the number on the permit. Homeowners quoted a 200A upgrade use it to check whether the house actually calculates past 100A, or whether the EV charger is the only thing pushing it over.',
  'duct-size-calculator':
    'HVAC techs use it when a room runs hot — is the run-out even big enough for its CFM share? Installers use it to convert round trunk sizes to the rectangular duct that fits the joist bay, and the friction-rate toggle shows exactly what the "quiet upgrade" to 0.05 costs in sheet metal.',
  'room-airflow-calculator':
    'HVAC techs use it for balance complaints: turn each room\'s load into its target CFM, then measure what the register actually delivers — the gap is the diagnosis. It is also the front end of every duct design: room CFM targets feed straight into duct sizing.',
  'superheat-subcooling-calculator':
    'HVAC techs use it on every service call — gauges and clamp thermometers in, charge verdict out, without flipping through a PT card. The diagnosis matrix catches the classic misread: high superheat with high subcooling is a restriction, not an undercharge, and adding refrigerant to it kills compressors.',
  'drain-size-calculator':
    'Plumbers use it for remodels and additions: count the new fixtures, and know in seconds whether the existing 3-inch main swallows the load or the job needs a 4-inch upgrade. It also settles the crawlspace argument about whether ⅛-inch slope is legal — only at 3 inches and up.',
  'vent-size-calculator':
    'Plumbers use it when the inspector flags an island sink or a long attic run — the 1½-inch floor is not the answer once developed length enters. Pair it with the drain calculator: the DFU total from one feeds the other, and the conservative table row is shown so the plan check matches.',
  'water-heater-size-calculator':
    'Plumbers use it to size replacements against the family\'s actual peak hour instead of like-for-like swapping the old tank — and to show customers why electric needs a bigger tank than gas. Homeowners quoted a tankless upgrade use it with winter inlet temps to see whether the unit feeds two showers or one.',
}
