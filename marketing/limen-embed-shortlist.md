# LIMEN Helix Portal — Embed Shortlist

One CalcStack embed per domain page. Paste the iframe under the live read —
the portal's free tier becomes interactive ("run the numbers on what the
feeds are saying"). Embeds are free forever, fully functional inside the
frame, and carry a small "Powered by CalcStack" link.

Pattern — swap the slug:
```html
<iframe src="https://calcstack.app/calcstack/embed/SLUG"
        width="100%" height="680" style="border:0;border-radius:12px"
        loading="lazy" title="TITLE — CalcStack"></iframe>
```

| Portal page | Embed slug | Why this one |
|---|---|---|
| /finance | `paycheck-calculator` | Everyone's money, every week |
| /economy | `inflation-calculator` | The number the domain tracks, personalized |
| /energy | `electricity-cost-calculator` | kWh rates → your bill |
| /utility-watch | `electricity-cost-calculator` | Same tool, utility context |
| /energy-markets | `ev-vs-gas-cost-calculator` | Fuel prices made personal |
| /utility/* (37 pages) | `electricity-cost-calculator` | One embed covers all utility pages |
| /medicine | `bmi-calculator` | Universal, instant |
| /education | `gpa-calculator` | Student money-adjacent traffic |
| /governance | `property-tax-appeal-calculator` | Tax policy → your bill |
| /trade | `sales-tax-calculator` | Trade/cost context (tariff calc is a future build) |
| /infrastructure | `concrete-calculator` | Build costs, hands-on |
| /defense | `bah-rent-vs-buy-calculator` | Military audience, exact fit |
| /law | `billable-hours-calculator` | Legal economics |
| /culture | `wedding-budget-calculator` | Events/budgets |
| /technology | `freelance-rate-calculator` | Tech labor market |
| /industry | `concrete-mix-calculator` | Materials math |
| /science | `compound-interest-calculator` | Or unit-converter when slotted |
| /environment | `water-intake-calculator` | Placeholder — carbon-footprint calc is a future build |
| /agriculture | (gap — land-rent/yield calcs are a future desk) | — |
| /population | (gap — data pages fit better than tools) | — |
| /communication | (gap — data-usage calc is a future build) | — |
| /religion | (gap — tithe calculator is a future build) | — |
| /intelligence | none — stays standalone | — |

Priority paste order (traffic × fit): /finance, /economy, /energy,
/utility-watch, /governance, /education, /medicine — then the rest.

Gaps above are the actual future-build list for the P0/P1 layer: carbon
footprint, tariff/landed cost, tithe, land rent, data usage.
