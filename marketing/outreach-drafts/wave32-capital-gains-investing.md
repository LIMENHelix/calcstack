# Wave 32 outreach drafts — investing & tax-planning niche (capital gains tax calculator)

The hook: every November-December, "what will I owe if I sell" becomes the
highest-stakes question in investing content — and most capital gains calculators
get the core mechanic wrong, taxing the whole gain at one rate. Ours implements
stacking correctly: ordinary income fills the brackets first, the gain piles on top,
and the same sale lands partly at 0%, partly 15%, partly 20%. Add the NIIT with its
correct lesser-of rule (a major tax site's own worked example overstates it by
$1,900 — we checked) and this is the calculator tax-planning content deserves.
Send after Wave 31. Personalize every [bracket]. One per day.

Embed gallery: https://calcstack-eight.vercel.app/embeds

---

## 1. Investing education blogs (stock/ETF content) — Template A

Subject: Your capital gains posts explain the rates — this calculator shows the stacking

> Hi [name],
>
> Your readers learn that long-term gains are 0/15/20% — then hit the wall every
> calculator builds: which rate applies to MY gain? The answer is stacking: ordinary
> income fills the brackets first, the gain piles on top, and the same sale can be
> partly tax-free. Example from the tool: married couple, $70k taxable income, $40k
> gain → $28,900 at 0%, only $11,100 at 15%, $1,665 total. That's the aha your
> articles set up:
>
> Live demo: https://calcstack-eight.vercel.app/embed/capital-gains-tax-calculator
>
> 2026 breakpoints per IRS Rev. Proc. 2025-32, NIIT included. One iframe, free
> forever, all math client-side.
>
> [Name], CalcStack

## 2. Tax-loss harvesting & year-end planning content — Template B

Subject: A year-end sale-planning tool that gets the NIIT right

> Hi [name],
>
> Your November/December harvesting content tells readers to model the sale before
> executing it. This calculator is the model: gain split across the 0/15/20% bands
> with correct stacking, short-term at ordinary rates, and the 3.8% NIIT using the
> actual lesser-of rule (investment income vs MAGI excess) — a rule a prominent tax
> site's own worked example gets wrong by $1,900. It also surfaces the one-year
> holding line: the same gain at ordinary rates vs 15% is often thousands of dollars
> for waiting a month:
>
> https://calcstack-eight.vercel.app/embed/capital-gains-tax-calculator
>
> One iframe inside any tax-loss harvesting or year-end checklist post. Free forever.
>
> [Name], CalcStack

## 3. Crypto tax content sites — Template A

Subject: Crypto gains are capital gains — give readers the real stacking math

> Hi [name],
>
> Your audience sells in chunks all year and rarely knows which lots cross the
> one-year line. This calculator separates long-term from short-term, stacks the
> long-term gain on their income correctly across the 0/15/20% bands, and adds the
> NIIT once MAGI crosses $200k/$250k — the surtax crypto content consistently
> forgets. The short-term line is the behavioral fix: seeing the same gain taxed at
> 32% vs 15% is what convinces readers to wait:
>
> https://calcstack-eight.vercel.app/embed/capital-gains-tax-calculator
>
> One iframe, free forever, no signup, nothing they enter leaves the browser.
>
> [Name], CalcStack

## 4. Early-retirement & Roth-conversion-ladder blogs — Template B

Subject: The 0% capital gains bracket is a retirement tool — show readers their room

> Hi [name],
>
> Your gain-harvesting posts (living off taxable accounts in early retirement,
> resetting basis at 0%) need exactly one interactive piece: how much gain fits under
> the 0% ceiling this year — $49,450 single, $98,900 joint for 2026, minus whatever
> ordinary income already filled. This calculator computes the room directly:
>
> https://calcstack-eight.vercel.app/embed/capital-gains-tax-calculator
>
> Pairs naturally with your Roth-ladder content. One iframe, free forever.
>
> [Name], CalcStack

## 5. Reddit r/investing, r/personalfinance, r/tax & r/CryptoTax — community protocol, NO pitch

"What will I owe if I sell" threads are daily. Strict norms:
- Answer with stacking, always: their ordinary taxable income (after deductions)
  fills the 0% band first; only the overflow is taxed. The most common wrong belief
  to correct: "my gain is taxed at 15%" — parts of it may be 0%.
- Ask the two inputs that decide everything: filing status and other taxable income.
  Without them every answer is a guess.
- Short-term vs long-term: if they're inside a year, compute both scenarios — the
  difference is the cost of impatience, stated in dollars.
- NIIT: only above $200k/$250k MAGI, and it's the lesser of investment income or
  MAGI excess — not automatically 3.8% of the whole gain.
- Wash-sale rule for harvesters: 30 days either side, and it applies across accounts
  including a spouse's and IRAs (where the loss dies permanently).
- 10+ substantive answers before any link; link only when asked "what did you run
  this in."
