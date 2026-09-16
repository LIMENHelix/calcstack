export interface CalculatorMeta {
  slug: string
  title: string
  shortTitle: string
  category: string
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
  {
    slug: 'tip-calculator',
    title: 'Tip Calculator — Split the Bill & Tip Instantly',
    shortTitle: 'Tip Calculator',
    category: 'Everyday Money',
    description:
      'Free tip calculator with bill splitting. Enter the bill, pick a tip percentage, split between any number of people. Instant, no signup.',
    tagline: 'End the awkward phone-passing at dinner.',
    intro:
      'Nobody wants to do percentage math over appetizers. This tip calculator gives you the tip amount, the total, and the per-person split the second you type. Quick buttons for the common 15/18/20/25% rates handle most situations; the custom field handles the rest — from coffee-shop rounding to large-group celebrations.',
    howItWorks: [
      'Enter the bill amount before tip.',
      'Pick a tip percentage with the quick buttons or type a custom one.',
      'Set how many people are splitting the bill (1 if it is just you).',
      'Read the tip amount, total, and per-person cost instantly.',
    ],
    faq: [
      {
        q: 'Is 15% still a standard tip?',
        a: 'In the US, 18–20% is now the common range for sit-down restaurants, with 15% seen as the minimum for acceptable service. For delivery, bartenders, and baristas, norms vary — $1–2 per drink or 10–15% is typical.',
      },
      {
        q: 'Should I tip on the pre-tax or post-tax amount?',
        a: 'Etiquette guides say pre-tax, and that is what this calculator uses by default. The difference on most bills is small enough that nobody will fault you either way.',
      },
      {
        q: 'How do I split a bill fairly when people ordered differently?',
        a: 'This calculator splits evenly. For uneven orders, each person can run their own subtotal plus shared items divided by the group, then add their proportional tip percentage.',
      },
    ],
  },
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator — Final Price After Sale & Stacked Coupons',
    shortTitle: 'Discount Calculator',
    category: 'Everyday Money',
    description:
      'Free discount calculator. Compute the final price after one or two stacked percentage discounts, total savings, and your true effective discount rate.',
    tagline: 'Know what "40% off + extra 20% off" really means.',
    intro:
      'Stores count on discount math being confusing — a "40% off plus an extra 20% off" sale is not 60% off, it is 52%. This calculator applies discounts the way registers do: sequentially, each one shrinking the already-reduced price. Enter the original price and up to two stacked discounts to see the true final price, your total savings, and the honest effective discount.',
    howItWorks: [
      'Enter the original (pre-discount) price.',
      'Enter the first discount percentage.',
      'Optionally add a second, stacked discount (coupon, loyalty code).',
      'See the final price, total savings, and effective discount percentage.',
    ],
    faq: [
      {
        q: 'Why are stacked discounts smaller than they look?',
        a: 'Because the second discount applies to the already-reduced price, not the original. 40% off $100 leaves $60; a further 20% off removes $12, not $20. Combined effect: 52% off.',
      },
      {
        q: 'Does the order of discounts matter?',
        a: 'No — multiplication is commutative. 40% then 20% gives the same final price as 20% then 40%.',
      },
      {
        q: 'Is a "buy one get one 50% off" deal really 25% off?',
        a: 'Only if you buy exactly two identical items and want both. You pay 1.5x for 2 items, which is 25% off the pair — but 0% off if you only needed one.',
      },
    ],
  },
  {
    slug: 'sales-tax-calculator',
    title: 'Sales Tax Calculator — Add or Remove Tax From a Price',
    shortTitle: 'Sales Tax Calculator',
    category: 'Everyday Money',
    description:
      'Free sales tax calculator. Add tax to a price or reverse it out of a total. Works with any state or local rate. Instant and no signup.',
    tagline: 'Add tax, or reverse it out of a receipt total.',
    intro:
      'US price tags exclude tax, receipts include it, and invoices need it separated — this calculator handles both directions. Add a tax rate to a pre-tax price to see the checkout total, or reverse-tax a receipt to recover the pre-tax amount for expense reports and bookkeeping. Works with any combined state and local rate.',
    howItWorks: [
      'Choose "Add tax" (price → total) or "Remove tax" (total → price).',
      'Enter the amount.',
      'Enter your combined sales tax rate (state + county + city).',
      'Get the pre-tax price, tax amount, and total instantly.',
    ],
    faq: [
      {
        q: 'How do I find my sales tax rate?',
        a: 'Search "[your city] sales tax rate" — rates combine state, county, and city taxes and range from 0% (Oregon, Montana and others) to over 10% in parts of some states. Your receipt always shows the applied rate.',
      },
      {
        q: 'How do I remove tax from a total?',
        a: 'Divide by 1 plus the rate: $108.25 at 8.25% is $108.25 ÷ 1.0825 = $100. Multiplying the total by the rate instead is the common mistake — that overstates the tax.',
      },
      {
        q: 'Is sales tax the same as VAT?',
        a: 'Similar but not identical: US sales tax is added at checkout and shown separately, while VAT (Europe, UK, and elsewhere) is usually baked into displayed prices and collected at each production stage.',
      },
    ],
  },
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator — Percent Of, Percent Change, What Percent',
    shortTitle: 'Percentage Calculator',
    category: 'Everyday Money',
    description:
      'Free 3-in-1 percentage calculator: what is X% of Y, percentage increase/decrease between two numbers, and X is what percent of Y. Instant answers.',
    tagline: 'Every percent question, answered in one place.',
    intro:
      'Percent questions come in three flavors and everyone mixes them up: finding a percentage of a number, computing the percentage change between two numbers, and working out what percent one number is of another. This calculator has all three modes on one page with the formula visible in the labels — useful for homework, tips, price changes, and quick data checks.',
    howItWorks: [
      'Mode 1 — "What is X% of Y": enter the percent and the value.',
      'Mode 2 — "Percentage change": enter the starting and ending numbers.',
      'Mode 3 — "X is what percent of Y": enter the part and the whole.',
      'Each mode computes live as you type.',
    ],
    faq: [
      {
        q: 'What is the formula for percentage change?',
        a: '(New − Old) ÷ |Old| × 100. Going from 80 to 120 is (120−80)÷80×100 = +50%. The vertical bars matter: change from a negative base needs the absolute value to keep the sign sensible.',
      },
      {
        q: 'If a price drops 20% then rises 20%, is it back where it started?',
        a: 'No. $100 − 20% = $80; $80 + 20% = $96. Percentage changes apply to the current value, so symmetric moves do not cancel — you end up 4% down.',
      },
      {
        q: 'What is the difference between percentage points and percent?',
        a: 'An interest rate rising from 3% to 4% is up 1 percentage point but up 33.3% in relative terms. News headlines routinely confuse the two; this calculator computes the relative (percent) version.',
      },
    ],
  },
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator — Body Mass Index With Healthy Range',
    shortTitle: 'BMI Calculator',
    category: 'Health & Life',
    description:
      'Free BMI calculator. Enter height and weight for your body mass index, WHO category, and the healthy weight range for your height.',
    tagline: 'Your BMI, plus the healthy range for your height.',
    intro:
      'Body Mass Index is a quick screening number: weight divided by height squared. It is crude — it cannot tell muscle from fat — but it is the standard first check used by doctors and insurers worldwide. This calculator shows your BMI, the WHO category it falls in, and the weight range that would land you in the "healthy" band for your height.',
    howItWorks: [
      'Enter your height in centimeters.',
      'Enter your weight in kilograms.',
      'The calculator computes BMI = kg ÷ m².',
      'See your category and the healthy weight range for your height.',
    ],
    faq: [
      {
        q: 'What is a healthy BMI?',
        a: 'The WHO bands are: under 18.5 underweight, 18.5–24.9 healthy, 25–29.9 overweight, 30 and above obese. These are population screening bands, not individual diagnoses.',
      },
      {
        q: 'Why do athletes score "overweight" on BMI?',
        a: 'BMI only sees mass and height, not composition. A muscular athlete can exceed 25 while having low body fat. Waist circumference or body-fat percentage are better individual measures.',
      },
      {
        q: 'Is BMI different for children?',
        a: 'Yes — children and teens use age- and sex-adjusted percentile charts, not the adult bands. This calculator uses the adult WHO scale.',
      },
    ],
  },
  {
    slug: 'calorie-calculator',
    title: 'Calorie Calculator — TDEE & Daily Calorie Needs (Mifflin-St Jeor)',
    shortTitle: 'Calorie Calculator',
    category: 'Health & Life',
    description:
      'Free calorie calculator using the Mifflin-St Jeor equation. Get your maintenance calories (TDEE), BMR, and targets for fat loss or muscle gain.',
    tagline: 'Maintenance, cut, or bulk — get your daily number.',
    intro:
      'Every diet plan reduces to energy balance: eat at your maintenance level and weight stays flat, below it and you lose, above it and you gain. This calculator estimates your maintenance calories (TDEE) with the Mifflin-St Jeor equation — the formula the Academy of Nutrition and Dietetics rates most accurate for most adults — then gives practical targets for fat loss and muscle gain.',
    howItWorks: [
      'Enter weight, height, age, and sex.',
      'Choose your activity multiplier: 1.2 for desk-bound days up to ~1.7 for heavy training.',
      'The calculator computes your BMR, then multiplies by activity for TDEE.',
      'Fat-loss (−500 kcal) and muscle-gain (+300 kcal) targets appear alongside.',
    ],
    faq: [
      {
        q: 'How accurate is this calculator?',
        a: 'Within roughly ±10% for most people — good enough to start. Track your weight for 2–3 weeks at the computed intake; if you are not trending as expected, adjust by 100–200 kcal.',
      },
      {
        q: 'How fast should I lose weight?',
        a: 'A 500 kcal daily deficit targets about 0.5 kg (1 lb) per week — fast enough to see progress, slow enough to preserve muscle and sanity. Larger deficits mostly trade muscle for speed.',
      },
      {
        q: 'What activity multiplier should I pick?',
        a: 'Most people overestimate. Desk job with 3 gym sessions a week is usually 1.4–1.5, not 1.7. When in doubt, pick the lower option and adjust from real results.',
      },
    ],
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator — Exact Age in Years, Months, Days',
    shortTitle: 'Age Calculator',
    category: 'Health & Life',
    description:
      'Free age calculator. Enter a birth date to get your exact age in years, months and days, total days alive, and the countdown to your next birthday.',
    tagline: 'Exact age — down to the day — plus your birthday countdown.',
    intro:
      '"How old are you exactly?" turns out to be a fiddly calendar question — months have different lengths and leap years intrude. This calculator computes your precise age in years, months, and days as of today, plus fun totals: days and weeks alive, and the countdown to your next birthday.',
    howItWorks: [
      'Pick your date of birth in the date field.',
      'The calculator compares it against today, borrowing days from the previous month when needed — the same method used for legal age calculations.',
      'Read exact age, total days, total weeks, and days until your next birthday.',
    ],
    faq: [
      {
        q: 'How is exact age calculated?',
        a: 'Subtract birth year from current year, then adjust: if your birthday has not happened yet this year, subtract one. Months and days borrow from the previous month when the current day-of-month is smaller than the birth day.',
      },
      {
        q: 'How many days old am I?',
        a: 'The calculator shows this directly — expect roughly 365.25 times your age in years, since leap days add about one extra day every four years.',
      },
      {
        q: 'Can I calculate age at a past or future date?',
        a: 'This tool computes age as of today. For the gap between any two arbitrary dates, use the date difference calculator — it handles any pair of dates.',
      },
    ],
  },
  {
    slug: 'date-difference-calculator',
    title: 'Date Difference Calculator — Days, Weeks & Months Between Dates',
    shortTitle: 'Date Difference Calculator',
    category: 'Health & Life',
    description:
      'Free date difference calculator. Days, weeks, months, and approximate workdays between any two dates — for deadlines, contracts, and countdowns.',
    tagline: 'Days between any two dates — deadlines, contracts, countdowns.',
    intro:
      'Contract terms, project deadlines, visa windows, warranty periods — half of adult life is counting days between dates. This calculator gives you the exact day count between any two dates, plus week and average-month equivalents and an approximate workday count for planning.',
    howItWorks: [
      'Pick the start date and end date.',
      'The calculator computes the exact calendar-day difference.',
      'Weeks and months are shown as conversions (months use the 30.44-day average).',
      'Approximate workdays assume a standard 5-day week (~5/7 of all days).',
    ],
    faq: [
      {
        q: 'Does the count include the end date?',
        a: 'This calculator uses the standard convention: the difference between the two dates, so the start day is not counted but the end boundary is. For an inclusive count, add 1.',
      },
      {
        q: 'How are months computed?',
        a: 'As days divided by 30.44 — the average month length. Calendar months vary from 28 to 31 days, so for contract-grade "three calendar months" language, count month-by-month rather than by days.',
      },
      {
        q: 'Can it count backward to a past date?',
        a: 'Yes — if the end date is before the start date, the result is negative, telling you how many days ago that date was.',
      },
    ],
  },
  {
    slug: 'gpa-calculator',
    title: 'GPA Calculator — Weighted Grade Point Average by Credits',
    shortTitle: 'GPA Calculator',
    category: 'Health & Life',
    description:
      'Free GPA calculator. Add courses with letter-grade points and credit hours to get your weighted GPA on the standard 4.0 scale.',
    tagline: 'Your semester GPA, weighted the way registrars do it.',
    intro:
      'A 4-credit chemistry class moves your GPA four times as much as a 1-credit elective, which is why simple grade averages are wrong. This calculator computes your weighted GPA the way registrars do: each course grade (on the 4.0 scale) multiplied by its credit hours, summed, and divided by total credits. Add as many courses as your semester holds.',
    howItWorks: [
      'Add a row per course.',
      'Pick the grade points (A = 4.0, A− = 3.7, B+ = 3.3, and so on).',
      'Enter the credit hours for each course.',
      'Your weighted GPA updates live with every change.',
    ],
    faq: [
      {
        q: 'What is the difference between weighted and unweighted GPA?',
        a: 'Unweighted GPA treats all grades equally; this calculator weights by credit hours (the college standard). Separately, some high schools also weight by course difficulty (AP = 5.0 scale) — that is a different system, defined by each school.',
      },
      {
        q: 'What GPA do I need for grad school or scholarships?',
        a: 'Common thresholds: 3.0 for most graduate programs, 3.5+ for competitive ones and many merit scholarships, 3.7+ for top-tier programs. Run your current courses here and test scenarios before the semester ends, not after.',
      },
      {
        q: 'Can I use this to plan what grade I need in a final?',
        a: 'Yes — enter your completed courses, then experiment with different grades for the outstanding course to see how each outcome moves your GPA.',
      },
    ],
  },
  {
    slug: 'crypto-profit-calculator',
    title: 'Crypto Profit Calculator — Gains, ROI & Fees',
    shortTitle: 'Crypto Profit Calculator',
    category: 'Investing & Crypto',
    description:
      'Free crypto profit calculator. Enter buy and sell prices, investment amount, and exchange fees to see profit, ROI, and coins held.',
    tagline: 'Profit, ROI, and what the fees quietly took.',
    intro:
      'Crypto gains look bigger in your head than in your account — buy fees, sell fees, and spreads all shave the outcome. This calculator computes your true net profit: how many coins your investment bought, what they are worth at the exit price, what fees consumed, and your real return on investment. Use it before selling, or to plan entry and exit targets.',
    howItWorks: [
      'Enter how much you invested and your buy price per coin.',
      'Enter your actual or target sell price.',
      'Add the total exchange fee percentage (buy + sell combined).',
      'See net profit, ROI, coins held, and exit value.',
    ],
    faq: [
      {
        q: 'Do I pay tax on crypto profits?',
        a: 'In most jurisdictions, yes — selling, swapping, or spending crypto at a gain is typically a taxable event (capital gains in the US, UK, and many others). This calculator shows pre-tax profit; keep records of every trade.',
      },
      {
        q: 'Why is my exchange showing a different profit?',
        a: 'Exchanges usually display unrealized P&L at the current mid-price and may exclude withdrawal or network fees. Enter your actual filled buy price and a realistic sell price here for the number that matters.',
      },
      {
        q: 'What ROI is realistic in crypto?',
        a: 'Anyone quoting a fixed number is selling something. Historically crypto has produced both triple-digit years and 70%+ drawdowns. Plan exits with this calculator instead of hoping.',
      },
    ],
  },
  {
    slug: 'roi-calculator',
    title: 'ROI Calculator — Return on Investment & Annualized Returns',
    shortTitle: 'ROI Calculator',
    category: 'Investing & Crypto',
    description:
      'Free ROI calculator. Total return plus annualized ROI (CAGR) so you can compare investments over different time periods honestly.',
    tagline: 'Total return is vanity; annualized return is sanity.',
    intro:
      '"I made 48%" means nothing until you know over how long. This calculator shows both numbers that matter: total ROI and annualized ROI (CAGR), which converts any multi-year gain into a per-year rate you can compare against index funds, savings accounts, or other deals. It works for stocks, property, a side business, or any investment with a buy-in and a payout.',
    howItWorks: [
      'Enter the amount you invested.',
      'Enter what it returned (or is currently worth).',
      'Enter how many years you held it.',
      'Compare total ROI against the annualized figure.',
    ],
    faq: [
      {
        q: 'What is a good ROI?',
        a: 'Context decides. Broad stock-market index funds have historically returned roughly 7–10% annualized over long periods, so anything consistently above that is strong; a savings account near inflation is treading water. Compare annualized numbers, never totals.',
      },
      {
        q: 'Why is annualized ROI not just total ROI divided by years?',
        a: 'Because of compounding. 48% over 2 years is 21.7% per year compounded, not 24%. Dividing by years (the "simple" method) overstates performance on multi-year holds.',
      },
      {
        q: 'What does ROI not capture?',
        a: 'Risk, taxes, and cash flow timing. Two investments with identical ROI can have wildly different risk. For multi-payment investments (rental property, businesses), an IRR calculation is more precise.',
      },
    ],
  },
  {
    slug: 'inflation-calculator',
    title: 'Inflation Calculator — Future Cost & Purchasing Power',
    shortTitle: 'Inflation Calculator',
    category: 'Investing & Crypto',
    description:
      'Free inflation calculator. See what today\'s money will be worth and what today\'s prices will cost after any inflation rate and number of years.',
    tagline: 'See the silent tax on your cash, year by year.',
    intro:
      'Inflation compounds just like interest — against you. At 3% inflation, prices double roughly every 24 years and cash loses a quarter of its purchasing power per decade. This calculator shows both directions: what today\'s amount will cost in the future, and what today\'s cash will effectively be worth. Essential context for salary negotiations, retirement planning, and savings decisions.',
    howItWorks: [
      'Enter an amount in today\'s money.',
      'Enter an assumed annual inflation rate (3% is a common long-run planning assumption).',
      'Enter the number of years ahead.',
      'See the future cost equivalent, the eroded value of today\'s cash, and total purchasing power lost.',
    ],
    faq: [
      {
        q: 'What inflation rate should I use?',
        a: 'US inflation has averaged roughly 2–4% over recent decades, with occasional spikes well above. Use 3% for baseline planning, 4% for conservative planning, and check current CPI figures for short-term estimates.',
      },
      {
        q: 'Does my salary keep up with inflation?',
        a: 'Only if raises match or exceed it. A 2% raise in a 4% inflation year is a real-terms pay cut of about 2%. Run your salary through this calculator with and without the raise to see the truth.',
      },
      {
        q: 'Is all inflation bad?',
        a: 'Moderate inflation is normal in growing economies and eases debt burdens (fixed-rate mortgage payments shrink in real terms). It is cash and fixed incomes that suffer — which is why long-term savings belong in assets, not mattresses.',
      },
    ],
  },
  {
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator — Units & Revenue to Cover Costs',
    shortTitle: 'Break-Even Calculator',
    category: 'Investing & Crypto',
    description:
      'Free break-even calculator for businesses. Enter fixed costs, price, and unit cost to find the exact units and revenue where you stop losing money.',
    tagline: 'The exact sale count where you stop bleeding money.',
    intro:
      'Every product business lives or dies at one number: how many units you must sell before fixed costs are covered. This calculator computes that break-even point from three inputs — fixed costs, sale price, and variable cost per unit — and shows the contribution margin that determines it. Change any input to test pricing decisions before you commit to them.',
    howItWorks: [
      'Enter fixed costs: rent, salaries, software — costs that exist even at zero sales.',
      'Enter your sale price per unit.',
      'Enter variable cost per unit: materials, shipping, payment fees — costs that scale with each sale.',
      'Break-even units = fixed costs ÷ (price − variable cost), shown with revenue and margin.',
    ],
    faq: [
      {
        q: 'What is contribution margin?',
        a: 'Price minus variable cost per unit — the amount each sale contributes toward covering fixed costs. A $49 product costing $14 to fulfill contributes $35 per sale. Every pricing and cost decision flows through this number.',
      },
      {
        q: 'What if my price barely exceeds my costs?',
        a: 'Then break-even units explode toward infinity, which is the calculator telling you the business model needs a price rise or a cost cut, not more effort. Thin margins mean volume cannot save you.',
      },
      {
        q: 'Should fixed costs be monthly or annual?',
        a: 'Either works — just interpret the result in the same period. Monthly fixed costs give you break-even units per month, which is usually the most actionable frame.',
      },
    ],
  },
]

export const CATEGORIES = [
  'Freelance & Career',
  'Everyday Money',
  'Loans & Debt',
  'Savings & Investing',
  'Investing & Crypto',
  'Health & Life',
] as const
