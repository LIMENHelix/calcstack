export interface CalculatorMeta {
  slug: string
  title: string
  shortTitle: string
  category: 'Freelance & Career' | 'Loans & Debt' | 'Savings & Investing'
  description: string // meta description
  tagline: string
  intro: string
  howItWorks: string[]
  faq: { q: string; a: string }[]
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: 'freelance-rate-calculator',
    title: 'Freelance Rate Calculator — What Should You Charge Per Hour?',
    shortTitle: 'Freelance Rate Calculator',
    category: 'Freelance & Career',
    description:
      'Free freelance hourly rate calculator. Turn your target salary, business expenses, and billable hours into a minimum hourly or day rate you should charge clients.',
    tagline: 'Turn a salary goal into a defensible hourly rate.',
    intro:
      'Most freelancers undercharge because they copy a salaried number and divide by 2,080 hours. That ignores unpaid admin time, vacations, taxes, software, insurance, and the fact that only part of your week is billable. This calculator starts from the income you actually want to take home, adds the real costs of running your business, and divides by the hours you can realistically bill — giving you a floor rate backed by arithmetic instead of guesswork.',
    howItWorks: [
      'Enter your target annual take-home income — what a salary would need to be for you to say yes to a job.',
      'Add annual business expenses: software, hardware, insurance, coworking, accounting, marketing.',
      'Set your billable percentage. Most freelancers bill 50–70% of working hours; the rest is sales, admin, and downtime.',
      'Set weeks off per year. Vacation, sick days, and gaps between contracts all reduce billable weeks.',
      'The calculator outputs your minimum hourly rate and an equivalent day rate (8 hours).',
    ],
    faq: [
      {
        q: 'What is a good freelance hourly rate?',
        a: 'It depends on your target income, expenses, and billable hours. A common outcome: to match a $100,000 salary with $10,000 in expenses, 48 working weeks, and 60% billable time, you need roughly $96/hour — far above the ~$48/hour a naive salary division suggests.',
      },
      {
        q: 'Should I charge hourly or per project?',
        a: 'Use your calculated hourly floor to price projects internally, then quote fixed project prices to clients. Fixed pricing lets you keep the upside of working efficiently while the hourly floor protects you from losing money.',
      },
      {
        q: 'Why is my calculated rate higher than market rates I see online?',
        a: 'Published "market rates" often come from surveys that include part-timers and underchargers. Your floor rate is personal: it is the minimum that makes freelancing rational for you. Compete on value and specialization, not on being the cheapest.',
      },
    ],
  },
  {
    slug: 'salary-to-hourly-calculator',
    title: 'Salary to Hourly Calculator — Convert Annual Salary to Hourly Wage',
    shortTitle: 'Salary to Hourly Calculator',
    category: 'Freelance & Career',
    description:
      'Convert an annual salary to an hourly, daily, weekly, or monthly wage — and back. Adjust for hours per week and vacation weeks. Free, instant, no signup.',
    tagline: 'Convert salary ↔ hourly, with unpaid time counted honestly.',
    intro:
      'A $75,000 salary is not $36.06 an hour once you account for the weeks you do not actually work. This converter goes both directions — salary to hourly and hourly to salary — and lets you adjust hours per week and weeks worked per year so the numbers reflect your real schedule, not a textbook assumption.',
    howItWorks: [
      'Choose a direction: annual salary to hourly, or hourly rate to annual salary.',
      'Enter the amount you want to convert.',
      'Adjust hours per week (default 40) and paid weeks per year (default 52).',
      'Read the full breakdown: hourly, daily, weekly, biweekly, and monthly equivalents.',
    ],
    faq: [
      {
        q: 'How many work hours are in a year?',
        a: 'The standard assumption is 2,080 hours (40 hours × 52 weeks). If you take 4 weeks off, the real number is 1,920 hours, which raises your effective hourly value by about 8%.',
      },
      {
        q: 'Is $30 an hour a good salary?',
        a: '$30/hour at 40 hours per week for 52 weeks is $62,400 per year before taxes. Whether that is "good" depends on your location and household costs — use the converter to compare it against monthly budget needs.',
      },
      {
        q: 'Does this calculator account for taxes?',
        a: 'No — it converts gross amounts. Taxes vary too much by jurisdiction and filing situation to fold into a converter. Compare gross-to-gross, then apply your own effective tax rate to both sides.',
      },
    ],
  },
  {
    slug: 'mortgage-payment-calculator',
    title: 'Mortgage Payment Calculator — Monthly Payment, Interest & Amortization',
    shortTitle: 'Mortgage Payment Calculator',
    category: 'Loans & Debt',
    description:
      'Free mortgage calculator. Compute your monthly principal & interest payment, total interest over the life of the loan, and see how rate and term change the cost.',
    tagline: 'See what a house really costs, month by month and in total.',
    intro:
      'The sticker price of a home is not what you pay — the interest is the silent second house. This calculator computes your monthly principal-and-interest payment using the standard amortization formula, then shows the total you will pay over the life of the loan and how much of it is interest. Change the rate or term and watch the totals move; small rate differences compound into tens of thousands of dollars.',
    howItWorks: [
      'Enter the home price and your down payment (dollar amount or percentage).',
      'Enter the annual interest rate (APR) and the loan term in years.',
      'The calculator applies the amortization formula M = P·r(1+r)ⁿ/((1+r)ⁿ−1).',
      'Review the monthly payment, total paid, and total interest.',
    ],
    faq: [
      {
        q: 'How much house can I afford?',
        a: 'A common guideline is the 28/36 rule: housing costs under 28% of gross monthly income and total debt payments under 36%. Work backward from your income with this calculator to find a payment that fits.',
      },
      {
        q: 'Does this include property tax and insurance?',
        a: 'No. This calculator covers principal and interest (P&I) only. Property taxes, homeowners insurance, HOA dues, and PMI typically add 20–40% on top of the P&I payment, depending on location.',
      },
      {
        q: 'Is a 15-year or 30-year mortgage better?',
        a: 'A 15-year term has a higher monthly payment but dramatically lower total interest — often less than half. A 30-year term offers flexibility and lower required payments. Run both in this calculator and compare the total interest lines.',
      },
    ],
  },
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator — Investment Growth Over Time',
    shortTitle: 'Compound Interest Calculator',
    category: 'Savings & Investing',
    description:
      'Free compound interest calculator with optional monthly contributions. See how your investments grow year by year at any rate, with a full schedule.',
    tagline: 'Watch small monthly deposits turn into serious money.',
    intro:
      'Compound interest is the engine of long-term wealth: returns earn returns, and the curve bends upward over time. This calculator projects an initial deposit plus optional monthly contributions at a fixed annual rate, compounded monthly, and shows the growth schedule year by year — including how much of the final balance is your contributions versus growth.',
    howItWorks: [
      'Enter your starting amount (can be $0).',
      'Enter a monthly contribution (can be $0).',
      'Set an annual return rate — 7% is a common long-run stock-market assumption after inflation; 4–5% for bonds or high-yield savings.',
      'Set the number of years. Compounding is monthly.',
      'Review the final balance, total contributed, and total growth, plus the year-by-year table.',
    ],
    faq: [
      {
        q: 'What is the rule of 72?',
        a: 'Divide 72 by your annual return rate to estimate years to double your money. At 7%, money doubles roughly every 10.3 years. This calculator shows the exact curve instead of the estimate.',
      },
      {
        q: 'How much do monthly contributions matter?',
        a: 'Enormously. $500/month at 7% for 30 years grows to about $610,000, of which only $180,000 is your contributions — the remaining $430,000 is growth. Starting 10 years earlier roughly doubles the outcome.',
      },
      {
        q: 'Is a fixed return rate realistic?',
        a: 'Real markets are volatile; a fixed rate is a planning simplification. It is useful for comparing scenarios (rate, contribution, time), not for predicting any specific year.',
      },
    ],
  },
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator — How Much to Save Per Month',
    shortTitle: 'Savings Goal Calculator',
    category: 'Savings & Investing',
    description:
      'Free savings goal calculator. Enter a target amount and deadline; get the monthly deposit you need, with or without interest. Plan a house deposit, emergency fund, or trip.',
    tagline: 'From "I want $30,000" to "I need $812/month".',
    intro:
      'A savings goal without a monthly number is a wish. This calculator converts any target — a house down payment, an emergency fund, a sabbatical — into the exact monthly deposit required by your deadline, accounting for your current savings and any interest your account earns. If the number is too high, extend the deadline or lower the goal until the plan fits your budget.',
    howItWorks: [
      'Enter your savings goal amount and what you have saved already.',
      'Set your deadline in months or years.',
      'Optionally add the annual interest rate of your savings account (high-yield accounts earn 4%+ as of recent years; checking earns near zero).',
      'Get the required monthly deposit and the total interest you will earn along the way.',
    ],
    faq: [
      {
        q: 'How much should an emergency fund be?',
        a: 'A common target is 3–6 months of essential expenses. If your essentials cost $3,000/month, that is a $9,000–$18,000 goal. Enter it here with your deadline to get the monthly plan.',
      },
      {
        q: 'Does interest really matter for short goals?',
        a: 'For goals under 2 years, interest moves the required deposit by only a few percent. For 5+ year goals in a high-yield account, it can reduce your required monthly deposit by 10% or more.',
      },
      {
        q: 'What if I cannot afford the monthly number?',
        a: 'That is the calculator doing its job. Lengthen the timeline, reduce the goal, or split it into phases. A plan that fits your budget beats an ambitious plan you abandon in month three.',
      },
    ],
  },
  {
    slug: 'loan-payoff-calculator',
    title: 'Loan Payoff Calculator — Extra Payments vs. Interest Saved',
    shortTitle: 'Loan Payoff Calculator',
    category: 'Loans & Debt',
    description:
      'Free loan payoff calculator. See your payoff date and total interest, then add extra monthly payments to see how much time and interest you save.',
    tagline: 'Find out what an extra $100/month does to your debt.',
    intro:
      'Extra payments attack the principal directly, which shrinks every future interest charge. This calculator shows your baseline payoff schedule for any fixed-rate loan — car, personal, student — then lets you add an extra monthly amount and instantly see the new payoff date and total interest saved. The answer is often startling: modest extra payments can cut years off a loan.',
    howItWorks: [
      'Enter the loan balance, annual interest rate (APR), and remaining term.',
      'See the baseline monthly payment, payoff date, and total interest.',
      'Add an extra monthly payment amount.',
      'Compare: new payoff time, months saved, and interest saved.',
    ],
    faq: [
      {
        q: 'Is it better to pay extra monthly or in a lump sum?',
        a: 'Mathematically, earlier money wins — a lump sum today beats the same total spread over time. But consistency beats intention for most people: automate a fixed extra amount you can sustain.',
      },
      {
        q: 'Should I pay off the loan or invest instead?',
        a: 'Paying down a loan earns a guaranteed, risk-free return equal to its interest rate. If your loan APR exceeds what you expect from investing after taxes and risk, pay the loan first. High-interest debt (above ~7–8%) almost always wins this comparison.',
      },
      {
        q: 'Do extra payments always reduce interest?',
        a: 'For standard amortizing loans, yes — as long as the lender applies extra payments to principal rather than advancing the due date. Check your loan agreement or tell the lender explicitly to apply overpayments to principal.',
      },
    ],
  },
]

export const CATEGORIES = ['Freelance & Career', 'Loans & Debt', 'Savings & Investing'] as const
