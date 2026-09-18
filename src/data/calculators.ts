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
      'Free mortgage calculator with property tax, insurance, PMI, and HOA. Full monthly payment (PITI), amortization schedule, payoff date, and PMI drop-off month.',
    tagline: 'The real monthly payment — tax, insurance, PMI, HOA included.',
    intro:
      'The sticker price of a home is not what you pay — and principal & interest is not what you pay monthly. Property tax, homeowners insurance, PMI when you put less than 20% down, and HOA dues typically add 20–40% on top. This calculator computes the full monthly reality (PITI + PMI + HOA), tracks PMI until it drops off at 78% loan-to-value, and lays out the complete amortization schedule so you can see exactly when the balance tips from interest to principal.',
    howItWorks: [
      'Enter the home price and your down payment percentage.',
      'Enter the annual interest rate (APR) and the loan term in years.',
      'Add property tax (annual % of home value — 1.1% is the rough national average), homeowners insurance, PMI rate, and HOA dues.',
      'The calculator applies the amortization formula M = P·r(1+r)ⁿ/((1+r)ⁿ−1) and adds every monthly cost.',
      'Review the total monthly payment, the breakdown chart, and the full yearly amortization schedule.',
    ],
    faq: [
      {
        q: 'How much house can I afford?',
        a: 'A common guideline is the 28/36 rule: total housing costs (the full PITI + HOA number this calculator shows, not just P&I) under 28% of gross monthly income and total debt payments under 36%. Work backward from your income to find a payment that fits.',
      },
      {
        q: 'When does PMI go away?',
        a: 'By law (the Homeowners Protection Act), lenders must cancel PMI when your balance reaches 78% of the original home value, and you can request cancellation at 80%. This calculator tracks the balance monthly and shows the exact month PMI ends — plus what it costs you in total.',
      },
      {
        q: 'Is a 15-year or 30-year mortgage better?',
        a: 'A 15-year term has a higher monthly payment but dramatically lower total interest — often less than half. A 30-year term offers flexibility. Run both here and compare the total interest lines and the amortization schedules; the crossover year where principal beats interest arrives much sooner on a 15-year.',
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
  {
    slug: 'one-rep-max-calculator',
    title: 'One Rep Max Calculator — Epley & Brzycki Formulas With Training Percentages',
    shortTitle: 'One Rep Max Calculator',
    category: 'Fitness & Sports',
    description:
      'Free one rep max (1RM) calculator using the Epley and Brzycki formulas. Enter weight and reps to get your estimated max plus a full training percentage chart.',
    tagline: 'Know your max without testing your max.',
    intro:
      'Testing a true one-rep max is fatiguing, risky, and unnecessary for programming. This calculator estimates your 1RM from any submaximal set using the two most validated formulas — Epley (the NSCA standard) and Brzycki — averages them for a robust estimate, and generates the full percentage chart that percentage-based programs (5/3/1, Texas Method, most powerlifting peaking plans) are built on.',
    howItWorks: [
      'Enter the weight you lifted and the reps you completed with good form.',
      'Sets of 1–12 reps give the most accurate estimates; accuracy drops beyond that.',
      'The calculator applies Epley (weight × (1 + reps/30)) and Brzycki (weight × 36/(37−reps)) and averages them.',
      'Read your estimated 1RM and the 50–95% training loads below it.',
    ],
    faq: [
      {
        q: 'How accurate are 1RM formulas?',
        a: 'Within roughly ±5% for sets of 5 reps or fewer on big barbell lifts, and ±10% for sets up to 12. Accuracy degrades on high-rep sets and isolation movements. Treat the number as a programming guide, not a guarantee.',
      },
      {
        q: 'Which formula do certifications like NASM and NSCA use?',
        a: 'The NSCA teaches the Epley formula; NASM materials commonly reference Brzycki. Both appear in this calculator — the averaged estimate is usually closest to a tested max.',
      },
      {
        q: 'How do I use the percentage chart?',
        a: 'Match the program to the row: strength work lives at 85–95% (1–5 reps), hypertrophy at 65–85% (6–12 reps), and muscular endurance below 65%. Recalculate every 4–8 weeks as your estimated max climbs.',
      },
    ],
  },
  {
    slug: 'heart-rate-zone-calculator',
    title: 'Heart Rate Zone Calculator — Karvonen Formula Training Zones',
    shortTitle: 'Heart Rate Zone Calculator',
    category: 'Fitness & Sports',
    description:
      'Free heart rate zone calculator using the Karvonen formula. Enter age and resting heart rate for personalized zones 1–5, from recovery to max effort.',
    tagline: 'Train the right system, not just the right amount.',
    intro:
      '"220 minus age" zones ignore the biggest variable in cardiac fitness: your resting heart rate. This calculator uses the Karvonen (heart rate reserve) method — the approach taught in ACSM and NASM certifications — which scales every zone to your actual fitness level. Five zones, from active recovery to redline, personalized in two inputs.',
    howItWorks: [
      'Enter your age and resting heart rate (measure it lying down, right after waking).',
      'The calculator estimates max HR (220 − age), then your heart rate reserve (max − resting).',
      'Each zone is a percentage band of that reserve added back to your resting rate.',
      'Zone 2 (60–70%) is the endurance base zone where most training time should live.',
    ],
    faq: [
      {
        q: 'Why is Karvonen better than simple percentage-of-max zones?',
        a: 'Two 40-year-olds can have resting heart rates of 50 and 80 — a simple percentage gives them identical zones, which is wrong. Karvonen anchors to heart rate reserve, so a fitter heart earns lower, more accurate zone boundaries.',
      },
      {
        q: 'How much of my training should be Zone 2?',
        a: 'The 80/20 rule used by most endurance coaches: roughly 80% of weekly training time in Zones 1–2 (conversational pace) and 20% in Zones 3–5. Zone 2 feels almost too easy — that is the point.',
      },
      {
        q: 'What if I know my actual max heart rate?',
        a: 'Use it: replace (220 − age) with your tested max from a hard hill-repeat or race effort. The reserve method stays the same; the tested max just removes the estimation error.',
      },
    ],
  },
  {
    slug: 'macro-calculator',
    title: 'Macro Calculator — Protein, Carbs & Fat for Your Goal',
    shortTitle: 'Macro Calculator',
    category: 'Fitness & Sports',
    description:
      'Free macro calculator. Get daily protein, carb, and fat targets based on your body, activity, and goal — fat loss, maintenance, or muscle gain.',
    tagline: 'Calories decide weight; macros decide composition.',
    intro:
      'Two diets with identical calories can produce completely different physiques — the difference is macronutrient split. This calculator estimates your maintenance calories with the Mifflin-St Jeor equation, adjusts for your goal (cut, maintain, or bulk), then splits the total into evidence-based targets: protein anchored to body weight, fat set to support hormones, and carbs filling the rest.',
    howItWorks: [
      'Enter weight, height, age, and sex for the Mifflin-St Jeor BMR estimate.',
      'Pick your honest activity level — most people overestimate by one tier.',
      'Choose a goal: fat loss (−20% calories), maintenance, or muscle gain (+10%).',
      'Protein is set at 1.6–2.0 g/kg (higher when cutting), fat at 25% of calories, carbs take the remainder.',
    ],
    faq: [
      {
        q: 'Why does protein go up when cutting?',
        a: 'In a deficit, higher protein (around 2 g/kg) protects muscle mass — research consistently shows high-protein cuts preserve more lean tissue than low-protein ones at the same calories. Muscle is what keeps the weight off afterward.',
      },
      {
        q: 'How closely do I need to hit these numbers?',
        a: 'Calories and protein within ±10% covers ~90% of results. Carb and fat split can flex day to day — total weekly intake matters more than any single day\'s precision.',
      },
      {
        q: 'Should I eat back exercise calories?',
        a: 'No — the activity multiplier already includes them. Fitness trackers overestimate burn by 20–50%, so "eating back" their numbers is the most common reason diets stall.',
      },
    ],
  },
  {
    slug: 'running-pace-calculator',
    title: 'Running Pace Calculator — Pace, Speed & Race Time Predictor',
    shortTitle: 'Running Pace Calculator',
    category: 'Fitness & Sports',
    description:
      'Free running pace calculator. Enter any distance and time for pace per km and mile, speed, and equivalent 5K, 10K, half marathon, and marathon predictions.',
    tagline: 'One run in, every race prediction out.',
    intro:
      'Pace math trips everyone up mid-run: what is 4:55 per km in miles, and what does today\'s 10K say about your marathon? This calculator converts any distance and time into pace per kilometer and per mile, overall speed, and equivalent race times at the four classic distances using the Riegel formula — the standard race-equivalency model used by coaches.',
    howItWorks: [
      'Enter the distance you ran (km or miles) and your time in hours, minutes, seconds.',
      'Read your pace per km, pace per mile, and speed instantly.',
      'The Riegel formula (T₂ = T₁ × (D₂/D₁)^1.06) predicts equivalent times for 5K through marathon.',
      'Predictions assume equivalent training for the distance — a 5K time does not guarantee a marathon without the mileage.',
    ],
    faq: [
      {
        q: 'How accurate is the Riegel prediction?',
        a: 'Within a few percent for runners trained for both distances. It overestimates marathon performance for runners whose training is short and fast — endurance is a separate adaptation from speed.',
      },
      {
        q: 'What is a good running pace?',
        a: 'Context is everything: average 5K finish times cluster around 6:30–7:30 per km for recreational runners, sub-4:00 per km is competitive amateur, and elites run under 3:00. Compare against your own history first.',
      },
      {
        q: 'How do I convert treadmill speed to pace?',
        a: 'Treadmills display speed (km/h or mph): pace is 60 ÷ speed. 12 km/h is exactly 5:00 per km. The calculator converts automatically — enter a 1 km run at the time it takes at that speed.',
      },
    ],
  },
  {
    slug: 'mulch-calculator',
    title: 'Mulch Calculator — Cubic Yards & Bags From Area and Depth',
    shortTitle: 'Mulch Calculator',
    category: 'Home & Yard',
    description:
      'Free mulch calculator. Enter square footage and depth to get cubic feet, cubic yards for bulk delivery, and exact bag counts for 2 and 3 cu ft bags.',
    tagline: 'Never make a second trip to the garden center.',
    intro:
      'Mulch is sold two ways — by the cubic yard in bulk or by the bag — and beds are measured in square feet and inches. That unit mismatch is why everyone either runs out mid-job or pays for a pallet they never open. This calculator does the conversion both ways: bulk yards for delivery and exact bag counts for the DIY route.',
    howItWorks: [
      'Measure the bed\'s area in square feet (length × width for rectangles; pace off odd shapes in sections).',
      'Choose depth: 2–3 inches for annual refresh, 3–4 inches for new beds or weed suppression.',
      'The calculator converts area × depth to cubic feet, then to cubic yards (÷27).',
      'Bag counts use the standard 2 and 3 cubic foot sizes.',
    ],
    faq: [
      {
        q: 'How deep should mulch be?',
        a: '2–3 inches is the standard for established beds; 3–4 inches for new installations. More than 4 inches suffocates roots and invites rot — deeper is not better.',
      },
      {
        q: 'Bulk or bags — which is cheaper?',
        a: 'Bulk almost always wins above ~2 cubic yards: bulk mulch typically runs $30–50 per yard versus $3–5 per 2 cu ft bag (which works out to $40–67 per yard equivalent). Below a yard, bags avoid delivery fees.',
      },
      {
        q: 'How many bags are in a yard of mulch?',
        a: 'A cubic yard is 27 cubic feet — so 13.5 of the 2 cu ft bags or 9 of the 3 cu ft bags per yard. The calculator shows both counts directly.',
      },
    ],
  },
  {
    slug: 'gravel-calculator',
    title: 'Gravel Calculator — Tons, Yards & Bags for Driveways and Paths',
    shortTitle: 'Gravel Calculator',
    category: 'Home & Yard',
    description:
      'Free gravel calculator. Enter length, width, and depth to get cubic yards and approximate tons of crushed stone or gravel for any project.',
    tagline: 'The driveway math quarries assume you can\'t do.',
    intro:
      'Gravel is ordered by the ton but planned by the yard, and the conversion depends on the material. This calculator handles the full chain: dimensions to cubic feet to cubic yards to approximate tons using the standard crushed-stone density — so you can order once, order right, and spot a bad quote instantly.',
    howItWorks: [
      'Enter the project length and width in feet.',
      'Enter depth in inches: 2–3 for paths, 4 for driveways over a compacted base, 6+ for heavy vehicles.',
      'The calculator computes cubic yards and converts to tons at ~1.4 tons per yard (typical crushed stone).',
      'Add 5–10% for compaction and waste before ordering.',
    ],
    faq: [
      {
        q: 'How much does a ton of gravel cover?',
        a: 'Roughly 100 square feet at 2 inches deep, or 80 square feet at 3 inches, for standard crushed stone. Pea gravel and lava rock differ — ask the supplier for their density if ordering specialty stone.',
      },
      {
        q: 'How deep should a gravel driveway be?',
        a: 'Three layers is the professional standard: 4 inches of large base stone, 4 inches of mid-size, and 2–3 inches of surface gravel. For a single-layer refresh, 2–3 inches over existing compacted gravel is typical.',
      },
      {
        q: 'How many cubic yards fit in a dump truck?',
        a: 'A standard tandem dump truck carries 10–14 cubic yards; a single-axle around 5–6. Weight is often the real limit — a full load of gravel can exceed 10 tons.',
      },
    ],
  },
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator — Cubic Yards & Bag Count for Slabs',
    shortTitle: 'Concrete Calculator',
    category: 'Home & Yard',
    description:
      'Free concrete calculator. Enter slab length, width, and thickness to get cubic yards for ready-mix and exact 60/80 lb bag counts.',
    tagline: 'Slabs, footings, posts — ordered right the first time.',
    intro:
      'Concrete has a brutal property: you cannot pause mid-pour to buy more. Ordering short means a cold joint and a weakened slab; ordering long is money hardening in the truck. This calculator converts your dimensions to cubic yards for ready-mix orders and to exact bag counts for the mixer-in-a-wheelbarrow approach, so the pour finishes in one go.',
    howItWorks: [
      'Enter the slab length and width in feet.',
      'Enter thickness: 4 inches is standard for patios and walkways, 5–6 for driveways, 6+ for heavy loads.',
      'The calculator computes cubic yards (the ready-mix unit) and cubic feet.',
      'Bag counts use standard yields: 80 lb ≈ 0.6 cu ft, 60 lb ≈ 0.45 cu ft.',
    ],
    faq: [
      {
        q: 'When is ready-mix worth it over bags?',
        a: 'The crossover is around 1 cubic yard: that is 45 bags of 80 lb mix — hours of brutal mixing — versus a single truck delivery. Most pros say bags under a yard, truck over it, and always order 5–10% extra.',
      },
      {
        q: 'How thick should a concrete driveway be?',
        a: '4 inches handles passenger cars on good soil; 5–6 inches is the common standard for durability, and 6+ with reinforcement for trucks or poor subgrade. Thickness is cheaper than replacement.',
      },
      {
        q: 'How many 80 lb bags make a yard of concrete?',
        a: 'About 45 bags per cubic yard (27 cu ft ÷ 0.6 cu ft per bag). The 60 lb size takes about 60 bags. The calculator shows both counts for your exact slab.',
      },
    ],
  },
  {
    slug: 'body-fat-calculator',
    title: 'Body Fat Calculator — US Navy Method (Tape Measure Only)',
    shortTitle: 'Body Fat Calculator',
    category: 'Fitness & Sports',
    description:
      'Free body fat percentage calculator using the US Navy circumference method. Just a tape measure: waist, neck, height (plus hip for women).',
    tagline: 'A tape measure beats a $50 smart scale.',
    intro:
      'The US Navy body fat formula estimates body composition from circumference measurements — no calipers, no scanners, no bioimpedance scale guessing at your hydration. Developed for military fitness assessments, it is the most validated no-equipment method available and typically lands within 3–4% of a DEXA scan. This calculator also maps your result to the American Council on Exercise categories.',
    howItWorks: [
      'Measure height, waist at the navel (relaxed, not sucked in), and neck below the Adam\'s apple.',
      'Women also measure hips at the widest point.',
      'The Navy formula combines the circumferences logarithmically — men and women use different equations.',
      'Read your estimated body fat percentage and ACE category.',
    ],
    faq: [
      {
        q: 'How accurate is the Navy method?',
        a: 'Studies put it within roughly ±3–4% of DEXA for most people — better than consumer smart scales, which swing wildly with hydration. Consistency matters more than absolute precision: measure the same way, same time, weekly.',
      },
      {
        q: 'What is a healthy body fat percentage?',
        a: 'ACE guidelines: men 14–24% is the fitness-to-average range, women 21–31%. Essential fat (the floor for health) is roughly 2–5% for men and 10–13% for women. Athletes sit between the two.',
      },
      {
        q: 'Why does the Navy method use the neck?',
        a: 'Neck circumference corrects for frame size: a thick-necked 38-inch waist carries very different fat than a slim-necked one. The waist-to-neck difference is the core of the male formula.',
      },
    ],
  },
  {
    slug: 'final-grade-calculator',
    title: 'Final Grade Calculator — What Do I Need on the Final Exam?',
    shortTitle: 'Final Grade Calculator',
    category: 'School & Science',
    description:
      'Free final grade calculator. Enter your current grade, the final exam weight, and your target grade to see exactly what score you need.',
    tagline: 'The most-Googled question of every December and May.',
    intro:
      'Every semester ends with the same arithmetic panic: what do I need on the final? This calculator answers it exactly — current grade, the final\'s weight in the syllabus, and your target produce the required score. It also tells you the two honest edge cases: when the grade you want is mathematically impossible, and when you have already locked it in.',
    howItWorks: [
      'Enter your current grade in the course (before the final).',
      'Enter the final exam\'s weight from the syllabus (commonly 20–40%).',
      'Enter the overall grade you want in the course.',
      'The calculator solves: needed = (target − current × (1 − weight)) ÷ weight.',
    ],
    faq: [
      {
        q: 'What if my needed score is over 100%?',
        a: 'Then the target is mathematically out of reach on the final alone — the honest answer this calculator gives you. Options: extra credit, a lower target (run it again), or talking to the professor now rather than after the exam.',
      },
      {
        q: 'What if it says I need a negative score?',
        a: 'Congratulations — your target is locked in even if you score zero. That information is valuable too: it tells you which of your finals deserves your study time and which is already safe.',
      },
      {
        q: 'Does this work for weighted categories?',
        a: 'It works when your current grade is already computed as a single number. If your course uses weighted categories (homework 20%, tests 40%…), compute the current standing first — your LMS usually shows it — then use this for the final.',
      },
    ],
  },
  {
    slug: 'paycheck-calculator',
    title: 'Paycheck Calculator — 2026 Take-Home Pay After Taxes (All States)',
    shortTitle: 'Paycheck Calculator',
    category: 'Freelance & Career',
    description:
      'Free paycheck calculator with 2026 federal brackets, FICA, and all 50 state tax rules built in. See take-home pay per year, month, and paycheck. No signup.',
    tagline: 'The number on the offer letter, translated to the number in your account.',
    intro:
      'A $75,000 salary is not $75,000 — federal tax, Social Security, Medicare, and your state all take a cut before the money lands. This calculator applies the 2026 federal brackets and FICA rules plus the income tax rules of any US state, so you can see your real take-home per year, month, biweekly paycheck, and week. Switching states shows you exactly what a move is worth. Results are estimates: pre-tax deductions (401(k), health premiums), credits, and local taxes are not included.',
    howItWorks: [
      'Enter your annual gross salary and filing status.',
      'Pick your state — every state plus DC has its own rules pre-loaded.',
      'Federal tax uses the 2026 brackets after the standard deduction ($16,100 single / $32,200 married).',
      'FICA is 6.2% Social Security (capped at $184,500 of wages in 2026) plus 1.45% Medicare, with the 0.9% surtax above $200,000.',
      'Read take-home pay four ways plus a visual breakdown of where every dollar goes.',
    ],
    faq: [
      {
        q: 'How accurate is this paycheck calculator?',
        a: 'The federal and FICA math is exact for a W-2 employee taking the standard deduction with no pre-tax benefits. State taxes use simplified 2025–2026 rules — close for most filers, but local taxes, credits, and pre-tax deductions can shift the real number a few percent. Compare against your paystub to calibrate.',
      },
      {
        q: 'Which states have no income tax?',
        a: 'Nine: Alaska, Florida, Nevada, New Hampshire (wages), South Dakota, Tennessee, Texas, Washington, and Wyoming. But no-tax states often make it up in sales or property taxes — the take-home comparison is one input to a move, not the whole decision.',
      },
      {
        q: 'Why is my real paycheck lower than this estimate?',
        a: 'Almost always pre-tax deductions: 401(k) contributions, health and dental premiums, and HSA contributions come out before the money reaches you (and lower your taxes too). Add them back mentally, or subtract your per-check deductions from the take-home figure shown.',
      },
    ],
  },
  {
    slug: 'ohms-law-calculator',
    title: 'Ohm\'s Law Calculator — Voltage, Current, Resistance & Power',
    shortTitle: 'Ohm\'s Law Calculator',
    category: 'School & Science',
    description:
      'Free Ohm\'s law calculator. Enter any two of voltage, current, resistance, or power to solve the other two instantly. V=IR, P=VI.',
    tagline: 'Any two in, the other two out.',
    intro:
      'Ohm\'s law and the power law form the four equations behind every circuit: V = IR and P = VI. Knowing any two of voltage, current, resistance, and power determines the other two — but the rearrangements are where homework and field work slow down. This calculator does all twelve permutations: pick your two knowns, read everything else.',
    howItWorks: [
      'Select which two quantities you know (six possible pairs).',
      'Enter their values.',
      'The calculator solves the remaining two using V = IR and P = VI.',
      'Results update live as you type.',
    ],
    faq: [
      {
        q: 'What is Ohm\'s law?',
        a: 'V = IR: voltage equals current times resistance. It says pushing more current through a resistance requires proportionally more voltage — the foundational relationship of all circuit analysis.',
      },
      {
        q: 'How do I find power from voltage and resistance?',
        a: 'P = V²/R. A 12 V supply across 6 Ω dissipates 24 W. The calculator handles this and all other rearrangements automatically — pick the "Voltage & Resistance" mode.',
      },
      {
        q: 'Does Ohm\'s law work for AC circuits?',
        a: 'For purely resistive AC loads using RMS values, yes. With capacitors or inductors, impedance replaces resistance and phase enters the math — this calculator covers the DC and resistive-AC cases, which includes most household and automotive work.',
      },
    ],
  },
  {
    slug: 'periodization-planner',
    title: 'Periodization Planner — Bompa Macrocycle Generator With Dates',
    shortTitle: 'Periodization Planner',
    category: 'Fitness & Sports',
    description:
      'Free periodization planner based on Tudor Bompa\'s model. Enter your competition date and goal to generate a full macrocycle: phases, dates, loads, and rep ranges.',
    tagline: 'Your whole season, planned backward from game day.',
    intro:
      'Tudor Bompa\'s linear periodization — the model behind modern strength coaching — sequences training into phases: anatomical adaptation, maximum strength, conversion to power or sport-specific work, then a taper that lands you at peak on competition day. Most athletes improvise this in a spreadsheet. This planner builds the entire macrocycle from two dates and a goal: phase boundaries, week counts, intensity zones, and rep ranges, all dated.',
    howItWorks: [
      'Enter your training start date and the date you need to peak (meet, game, race, photoshoot).',
      'Pick the goal: maximum strength to power, hypertrophy to strength, or strength endurance.',
      'Beginners get a longer anatomical adaptation block, per Bompa\'s guidelines.',
      'The planner allocates weeks proportionally across phases and reserves a 1–2 week taper.',
      'Each phase shows dates, %1RM loads, rep ranges, and training focus.',
    ],
    faq: [
      {
        q: 'What is periodization?',
        a: 'Planned variation of training volume and intensity over time, so adaptation accumulates without burnout and performance peaks on a chosen date. Tudor Bompa formalized the model — phases (macrocycles) built from weekly blocks (microcycles) — now standard in strength and conditioning.',
      },
      {
        q: 'Why can\'t I just train hard all year?',
        a: 'Because adaptation plateaus and fatigue accumulates: the same stimulus stops working within weeks, and maximal-intensity training can only be sustained briefly before performance regresses. Phases solve both — each block creates the adaptation the next one converts.',
      },
      {
        q: 'How many times per year should I peak?',
        a: 'Bompa\'s answer: 2–3 macrocycles per year for most sports. Each macrocycle ends in a peak followed by a short transition (active rest) phase before the next anatomical adaptation block begins.',
      },
    ],
  },
  {
    slug: 'ckd-carb-up-calculator',
    title: 'CKD Carb-Up Calculator — Glycogen, Protein & Refeed Math (McDonald)',
    shortTitle: 'CKD Carb-Up Calculator',
    category: 'Fitness & Sports',
    description:
      'Free CKD carb-up calculator based on Lyle McDonald\'s guidelines. Lean-mass protein targets, carb-up amounts for 24–48h refeeds, and the glycogen + water scale jump explained.',
    tagline: 'The carb-up is a tool. This is its instruction manual.',
    intro:
      'The cyclical ketogenic diet — five to six days keto, one to two days of structured carbs — lives or dies on the carb-up math, and Lyle McDonald wrote the book on it (The Ketogenic Diet, Ultimate Diet 2.0). This calculator does his arithmetic: protein anchored to lean body mass, carb-up volume scaled to lean mass for 24-hour and 48-hour refeeds, and the number that stops the Monday-morning panic — how much of the scale jump is glycogen and water, not fat.',
    howItWorks: [
      'Enter body weight and body fat percentage (estimate it with our Navy-method calculator).',
      'Choose the carb-up length: classic 24-hour CKD or a 36–48 hour UD2-style refeed.',
      'Keto-day targets: protein at 0.7–0.9 g per pound of lean mass, fat filling the rest of maintenance.',
      'Carb-up targets: roughly 5–6 g/kg lean mass over 24 hours, 12–16 g/kg over a full refeed.',
      'The scale-jump estimate shows glycogen storage plus the ~3 g of water each gram binds.',
    ],
    faq: [
      {
        q: 'Why did I gain 4 pounds after my carb-up?',
        a: 'Glycogen and water, almost entirely. Stored glycogen binds roughly 3 g of water per gram, so a 400 g carb-up that stores ~240 g of glycogen puts about 2 lb of glycogen-plus-water on the scale. It is fuel in the tank, not fat — it drains back out over the keto week.',
      },
      {
        q: 'Who is CKD actually for?',
        a: 'Trainees doing intense glycolytic work (lifting, sprinting) several times a week, who need glycogen for performance but want keto\'s appetite control the rest of the week. Sedentary keto dieters do not need carb-ups; endurance athletes need different fueling entirely.',
      },
      {
        q: 'Can I gain fat during a carb-up?',
        a: 'Yes — but only from calories above maintenance, same as always. The carb-up targets here are sized to refill glycogen, not to be a cheat day. Stay near maintenance calories and the refeed overwhelmingly becomes glycogen and water.',
      },
    ],
  },
  {
    slug: 'velocity-based-training-calculator',
    title: 'Velocity Based Training Calculator — Bar Speed to %1RM & Daily Max',
    shortTitle: 'Velocity Training (VBT) Calculator',
    category: 'Fitness & Sports',
    description:
      'Free velocity based training (VBT) calculator. Enter load and mean bar velocity to estimate %1RM and daily max for bench, squat, and deadlift using published load-velocity profiles.',
    tagline: 'The bar speed never lies about how strong you are today.',
    intro:
      'Velocity-based training replaces guessing with a speedometer: every lift has a load-velocity relationship, so bar speed reveals what percentage of your max is on the bar — and therefore today\'s true max, which fluctuates with fatigue. This calculator applies the average load-velocity profiles from published research (González-Badillo and colleagues) to bench press, back squat, and deadlift: enter load and mean concentric velocity, get estimated %1RM and daily 1RM.',
    howItWorks: [
      'Pick the lift — each has its own profile (squats move faster at a given %1RM than bench).',
      'Enter the load and mean concentric velocity from your VBT device or phone app.',
      'The calculator interpolates the load-velocity profile to estimate %1RM.',
      'Estimated daily 1RM = load ÷ %1RM — use it to autoregulate the day\'s working weights.',
      'Reference table below shows the full profile, including the minimum velocity threshold.',
    ],
    faq: [
      {
        q: 'How accurate is velocity-based training?',
        a: 'The load-velocity relationship is remarkably stable within an individual (r > 0.95 in studies), but average profiles vary between lifters by several percent. Best practice: calibrate your own profile over 2–3 sessions, then re-check monthly as you get stronger.',
      },
      {
        q: 'How do coaches use velocity stops?',
        a: 'Stop a set when velocity drops a set percentage from the first rep: ~10–15% drop for speed-strength, ~20% for maximum strength, ~30–40% for hypertrophy. It ends sets at the right fatigue dose instead of an arbitrary rep count.',
      },
      {
        q: 'What is the minimum velocity threshold?',
        a: 'The slowest velocity at which a lifter can complete a rep — roughly their true 1RM speed. Around 0.15–0.2 m/s for bench and deadlift, ~0.3 m/s for squat in research averages. A rep slower than your threshold fails.',
      },
    ],
  },
  {
    slug: 'vo2max-calculator',
    title: 'VO2max Calculator — Cooper 1.5-Mile Run & Rockport Walk Test',
    shortTitle: 'VO₂max Calculator',
    category: 'Fitness & Sports',
    description:
      'Free VO2max calculator using the Cooper 1.5-mile run and Rockport 1-mile walk test. Field-test cardio fitness estimates from ACSM guidelines. No lab needed.',
    tagline: 'Lab-grade cardio fitness from a stopwatch.',
    intro:
      'VO₂max — the maximum oxygen your body can use per minute — is the single best number for cardiovascular fitness, and the one wearable brands charge you to estimate. The Cooper 1.5-mile run and Rockport 1-mile walk tests, standard in ACSM guidelines and exercise physiology texts like Fahey\'s Fit & Well, estimate it accurately from a stopwatch. Run (or walk) the distance, enter your time, get your number and fitness band.',
    howItWorks: [
      'Cooper test: run 1.5 miles as fast as sustainably possible; enter the time.',
      'Rockport test: walk 1 mile briskly, record time and heart rate at the finish; enter age, weight, and sex.',
      'The calculator applies the published regression equations for each test.',
      'Read your VO₂max in ml/kg/min, the MET equivalent, and a general fitness band.',
    ],
    faq: [
      {
        q: 'What is a good VO₂max?',
        a: 'General adult bands: below 28 poor, 28–34 below average, 34–40 fair to good, 40–46 good to excellent, above 46 excellent — with age and sex shifting the bands. Elite endurance athletes run 60–85. Any trend upward is the metric that matters.',
      },
      {
        q: 'Which test should I pick?',
        a: 'The Cooper run suits people already training — it is maximal effort. The Rockport walk is designed for beginners and older adults: submaximal, safer, and nearly as accurate when the heart rate is measured properly at the finish.',
      },
      {
        q: 'How fast does VO₂max improve?',
        a: 'Beginners commonly gain 10–20% in the first 3–6 months of consistent Zone 2 training. After that, gains slow to single digits per year — which is why tracking it annually, not weekly, keeps expectations honest.',
      },
    ],
  },
  {
    slug: 'framing-calculator',
    title: 'Framing Calculator — Studs, Plates & Wall Lumber Count',
    shortTitle: 'Framing Calculator',
    category: 'Home & Yard',
    description:
      'Free wall framing calculator. Get exact stud counts, plate boards, and openings math for 16" or 24" on-center walls — plus an editable materials and labor cost estimate.',
    tagline: 'How many studs is that wall, really?',
    intro:
      'Framing lumber counts follow simple rules, but getting them wrong means a mid-job lumber run or a pile of wasted studs. This calculator applies the standard carpentry count — one stud per spacing interval plus a starter, king/jack/cripple studs around every opening, extras at corners, and single-bottom-plus-double-top plates — so your order matches the plan.',
    howItWorks: [
      'Enter the wall length, height, and stud spacing (16" on center is standard for load-bearing walls).',
      'Count door and window openings and corners/intersections.',
      'Read the stud count, plate boards (8-ft), and total plate linear feet.',
      'Open the cost section to add editable unit costs and a labor rate for a project total.',
    ],
    faq: [
      {
        q: 'How many studs do I need for a 20-foot wall?',
        a: 'At 16" on center: ⌈20 × 12 ÷ 16⌉ + 1 = 16 studs before openings and corners. Each door or window opening adds about 4 studs (king, jack, and cripples), and each corner adds 1.',
      },
      {
        q: 'Should I frame at 16 or 24 inches on center?',
        a: '16" on center is the default for load-bearing walls and anywhere you will hang heavy cabinets or tile. 24" on center (advanced framing) saves roughly 30% on studs and improves insulation, but check your local code — some jurisdictions and wind/seismic zones require 16".',
      },
    ],
  },
  {
    slug: 'drywall-calculator',
    title: 'Drywall Calculator — Sheets, Mud, Tape & Screws',
    shortTitle: 'Drywall Calculator',
    category: 'Home & Yard',
    description:
      'Free drywall calculator. Compute sheets of drywall (4×8 or 4×12), joint tape, compound gallons, and screws for any room — with an editable cost and labor estimate.',
    tagline: 'Sheets, mud, tape, screws — the whole order in one pass.',
    intro:
      'Drywall estimates fail in two places: forgetting the ceiling and under-buying mud. This calculator nets out doors and windows, adds the ceiling if you want it, applies 10% cutting waste, then converts the area into sheets, 500-ft tape rolls, gallons of ready-mix, and pounds of screws — a complete shopping list, not just a sheet count.',
    howItWorks: [
      'Enter room length, width, and wall height, plus door and window counts (21 and 15 sq ft deducted each).',
      'Choose whether to include the ceiling and pick 4×8 or 4×12 sheets (12-footers mean fewer butt seams).',
      'Read sheets (with 10% waste), tape rolls, compound gallons, and screw weight.',
      'Open the cost section for a materials-plus-labor estimate with editable unit prices.',
    ],
    faq: [
      {
        q: 'How much drywall mud do I need per sheet?',
        a: 'A reliable rule is about 1 gallon of ready-mix joint compound per 100 square feet of wall for tape plus two finish coats — roughly 1.5 gallons per 4×8 sheet. Buy one extra gallon; running out mid-coat is worse than returning an unopened one.',
      },
      {
        q: 'Is 4×12 drywall worth it?',
        a: 'On walls longer than 8 feet, yes: 4×12 sheets eliminate butt joints, which are the hardest seams to hide. They are heavier and harder to maneuver in tight stairs and hallways — for small rooms, 4×8 sheets are easier to handle.',
      },
    ],
  },
  {
    slug: 'roofing-calculator',
    title: 'Roofing Calculator — Squares, Bundles & Shingle Estimate',
    shortTitle: 'Roofing Calculator',
    category: 'Home & Yard',
    description:
      'Free roofing calculator. Convert footprint and pitch into roofing squares, shingle bundles, underlayment rolls, and nails — plus an editable materials and labor estimate.',
    tagline: 'From footprint and pitch to squares and bundles.',
    intro:
      'Roofing is sold in squares (100 sq ft), but your house is measured in footprint and pitch. This calculator applies the correct slope multiplier for your roof pitch, adds the right waste factor for gable versus hip roofs, and converts the result into bundles, felt rolls, and nails — the numbers a supplier actually quotes in.',
    howItWorks: [
      'Enter the roof footprint length and width (the building outline, not the slope surface).',
      'Pick the pitch — rise per 12 inches of run. A 6/12 roof multiplies area by 1.118.',
      'Choose gable (10% waste) or hip/complex (15% waste).',
      'Read squares, bundles (3 per square), underlayment rolls, and nails; open the cost section for a project estimate.',
    ],
    faq: [
      {
        q: 'How many bundles of shingles are in a square?',
        a: 'Three bundles cover one square (100 sq ft) for standard architectural shingles. Some heavyweight designer shingles run 4 bundles per square — check the wrapper before ordering.',
      },
      {
        q: 'Why is my roofer\'s square count higher than this estimate?',
        a: 'This calculator covers field shingles, underlayment, and nails. Roofers also charge for tear-off and disposal, ridge cap, drip edge, flashing, pipe boots, and steep-slope or story surcharges. Use this number to sanity-check the materials line of their quote, not the total.',
      },
    ],
  },
  {
    slug: 'paint-calculator',
    title: 'Paint Calculator — Gallons Needed for Any Room',
    shortTitle: 'Paint Calculator',
    category: 'Home & Yard',
    description:
      'Free paint calculator. Get exact gallons from room dimensions, doors, windows, coats, and real coverage per can — plus primer, and an editable paint-and-labor cost estimate.',
    tagline: 'Buy the right number of gallons the first time.',
    intro:
      'The difference between one gallon and three is whether you subtracted the windows and used the coverage printed on your can instead of a guess. This calculator nets out doors and windows, multiplies by your coat count, divides by real coverage — and separates primer, because new drywall drinks a different product than finish paint.',
    howItWorks: [
      'Enter room length, width, and height, plus door and window counts.',
      'Choose coats: 1 for a same-color refresh, 2 standard, 3 for dark-over-light.',
      'Set coverage from your paint can (350–400 sq ft/gal is typical; textured walls cut it by a third).',
      'Read gallons and primer; open the cost section for a materials-plus-labor total.',
    ],
    faq: [
      {
        q: 'How many gallons paint a 12×14 room?',
        a: 'With 8-ft ceilings, 1 door, and 2 windows: about 340 sq ft of wall, so 2 coats at 350 sq ft/gal needs 2 gallons. Add the ceiling (168 sq ft) and you are at 3 gallons. Always round up — matching a touch-up batch later is nearly impossible.',
      },
      {
        q: 'Do I really need primer?',
        a: 'On new drywall, yes — bare joint compound and paper face absorb paint unevenly and flash through the finish. Over a sound, similar-color existing paint, a quality paint-and-primer-in-one with two coats usually skips the separate primer step.',
      },
    ],
  },
  {
    slug: 'tile-calculator',
    title: 'Tile Calculator — Tile Count, Thinset & Grout',
    shortTitle: 'Tile Calculator',
    category: 'Home & Yard',
    description:
      'Free tile calculator. Convert floor dimensions and tile size into exact tile counts with cutting waste, plus thinset bags and grout pounds — with an editable cost and labor estimate.',
    tagline: 'Tiles, thinset, grout — order once, order right.',
    intro:
      'Tile orders fail on waste: a straight grid loses about 10% to cuts, a diagonal or herringbone layout 15%. This calculator applies the right waste factor to your floor area and tile size, then adds the materials everyone forgets — 50-lb thinset bags and grout pounds — so one trip covers the whole job.',
    howItWorks: [
      'Enter floor length and width.',
      'Pick the tile size and layout — diagonal and herringbone add 15% waste instead of 10%.',
      'Read the tile count (rounded up), thinset bags at ~95 sq ft per 50-lb bag, and grout at ~¼ lb per sq ft.',
      'Open the cost section for a materials-plus-labor estimate; keep 2–3 spare tiles for future repairs.',
    ],
    faq: [
      {
        q: 'How many 12×12 tiles do I need for 100 square feet?',
        a: 'Each 12×12 tile covers exactly 1 sq ft. With 10% cutting waste: 110 tiles for a straight layout, 115 for diagonal. Buy the full box overage — dye lots vary between batches.',
      },
      {
        q: 'How much thinset do I need per 100 square feet?',
        a: 'Roughly one 50-lb bag per 95 sq ft with a ¼-inch square-notch trowel — so 2 bags for 100 sq ft. Large-format tile (24×24) needs a ½-inch trowel and uses about twice as much.',
      },
    ],
  },
  {
    slug: 'concrete-mix-calculator',
    title: 'Concrete Mix Calculator — Right PSI, Yards & Bags for Your Job',
    shortTitle: 'Concrete Mix Calculator',
    category: 'Home & Yard',
    description:
      'Free concrete mix calculator. Pick the job (footing, slab, driveway, patio), get the recommended PSI mix and air entrainment, and convert square feet to cubic yards or 80-lb bags.',
    tagline: 'The right mix for the job, and exactly how much of it.',
    intro:
      'Ordering concrete has two failure modes: the wrong amount (a short pour is a cold joint and a weak slab) and the wrong mix (a non-air-entrained driveway in Kansas scales apart in three winters). This calculator converts your dimensions to yards and bags with the 10% over-order rule, then specs the mix strength and air entrainment the application actually needs.',
    howItWorks: [
      'Pick the job: footing, interior slab, driveway, patio, or specialty.',
      'Enter length, width, and thickness — the calculator converts square feet to cubic yards (1 yd³ = 81 sq ft at 4 inches).',
      'Read the recommended PSI, whether you need air entrainment, and the order quantity with 10% extra.',
      'Compare ready-mix versus 80-lb bags with editable local prices.',
    ],
    faq: [
      {
        q: 'How many square feet does a yard of concrete cover?',
        a: 'One cubic yard covers 81 sq ft at 4 inches thick, 108 sq ft at 3 inches, or 54 sq ft at 6 inches. A 24×12 driveway at 4 inches is 288 sq ft, which needs 3.56 yards — order 4.',
      },
      {
        q: 'What PSI concrete do I need for a driveway?',
        a: '3,500–4,000 psi with 5–7% air entrainment in any climate that freezes. Interior slabs can run 3,000–3,500 psi without air. The mix design matters as much as thickness for how long the slab lasts.',
      },
    ],
  },
  {
    slug: 'road-base-calculator',
    title: 'Road Base Calculator — Aggregate Tonnage with Compaction',
    shortTitle: 'Road Base Calculator',
    category: 'Home & Yard',
    description:
      'Free road base calculator. Convert driveway dimensions and compacted depth into tons of crushed stone, recycled base, or asphalt — with the 25% loose-to-compacted factor built in.',
    tagline: 'Tonnage that accounts for compaction — the part everyone forgets.',
    intro:
      'The classic road base mistake: you calculate compacted volume, order that many tons of loose aggregate, and come up 25% short after the plate compactor does its job. This calculator builds the compaction factor in, converts to tons using the right density for crushed stone, recycled base, or hot-mix asphalt, and adds delivery if you need it.',
    howItWorks: [
      'Enter the area length, width, and the compacted depth you want (4–6 in for cars, 8–12 in for trucks/RVs).',
      'Pick the material — densities differ: crushed stone ~1.4 t/yd³, recycled base ~1.35, asphalt ~2.0.',
      'Read the order tonnage (compaction-adjusted) and compacted yards.',
      'Open the cost section for materials-plus-delivery with editable per-ton pricing.',
    ],
    faq: [
      {
        q: 'How much road base do I need for a 50×12 driveway?',
        a: 'At 6 inches compacted: 50 × 12 × 0.5 ft = 300 cu ft = 11.1 compacted yards ≈ 15.5 tons of crushed stone, or about 19.5 tons ordered loose after the 25% compaction factor.',
      },
      {
        q: 'Is recycled asphalt millings a good base?',
        a: 'Yes for driveways and rural lanes — millings re-bind under compaction and summer heat, resist dust, and usually cost less per ton than virgin crushed stone. They are not DOT-approved for public roads and can track indoors in hot weather.',
      },
    ],
  },
  {
    slug: 'driveway-cost-comparison',
    title: 'Driveway Cost Comparison — Gravel vs Asphalt vs Concrete',
    shortTitle: 'Driveway Cost Comparison',
    category: 'Home & Yard',
    description:
      'Free driveway cost comparison calculator. Compare gravel, asphalt, and concrete on install cost, 20-year maintenance, cost per square foot per year, and lifespan — with editable local rates.',
    tagline: 'First cost is not the cost. Run the 20-year math.',
    intro:
      'Gravel is cheapest to install and most expensive to own per year — unless you never maintain anything, in which case asphalt is. This calculator puts all three surfaces on one honest table: installed cost, 20-year maintenance schedule, total cost per square foot per year, and realistic lifespan. Adjust the installed rates to your local quotes and the ranking updates itself.',
    howItWorks: [
      'Enter your driveway length and width.',
      'Read the comparison table: install cost, 20-year maintenance, total, and cost per sq ft per year.',
      'Open the cost section and replace the defaults with real quotes from local contractors.',
      'Factor your climate: freeze-thaw punishes concrete without air entrainment; extreme heat softens asphalt; slopes shed gravel.',
    ],
    faq: [
      {
        q: 'Is asphalt or concrete cheaper for a driveway?',
        a: 'Asphalt is cheaper to install (typically $3–7/sq ft vs $6–12 for concrete) but needs sealcoating every 3–5 years and resurfacing around year 15–20. Over 20 years the totals are often close; over 30–40 years, concrete usually wins if it was installed correctly for the climate.',
      },
      {
        q: 'How long does a gravel driveway last?',
        a: 'Indefinitely, with upkeep — plan on regrading and a fresh top layer every couple of years. It is the best answer for long rural driveways where paving costs are prohibitive and the worst answer for steep slopes or heavy snow-plow use.',
      },
    ],
  },
  {
    slug: 'fence-calculator',
    title: 'Fence Calculator — Posts, Rails, Pickets & Concrete',
    shortTitle: 'Fence Calculator',
    category: 'Home & Yard',
    description:
      'Free fence calculator. Get exact post, rail, and picket/board counts plus concrete bags for privacy or picket fences — with an editable materials and labor cost estimate.',
    tagline: 'The whole fence order — posts to concrete — in one pass.',
    intro:
      'Fence material lists follow repeatable rules: a post every 8 feet plus a starter, doubled posts at every gate, two or three rails per section depending on height, and boards counted by coverage width. Getting any of these wrong means a mid-job supplier run. This calculator applies the standard counts and adds concrete at two 50-lb bags per post, so your order matches the plan.',
    howItWorks: [
      'Enter the total fence line in feet, then subtract gates with the gate count and width fields.',
      'Pick height and style — privacy (5.5" boards, no gaps) or picket (3.5" boards with 2.5" gaps).',
      'Read posts, rails, boards/pickets, and 50-lb concrete bags.',
      'Open the cost section for editable unit costs and a labor rate per linear foot.',
    ],
    faq: [
      {
        q: 'How many posts do I need for 100 feet of fence?',
        a: 'At 8-foot sections: ⌈100 ÷ 8⌉ + 1 = 14 posts for the fence line, plus 2 extra per gate (gate posts carry the load and are typically doubled or upsized). A 100-ft line with one 4-ft gate needs 15 posts and leaves 96 ft of actual fencing.',
      },
      {
        q: 'How much concrete per fence post?',
        a: 'Two 50-lb bags for a standard 4×4 post in an 8-inch-diameter hole set 24 inches deep (the hole holds about 0.7 cubic feet). Frost-line depths deeper than 24" or 6×6 gate posts need more — check your local frost depth before digging.',
      },
    ],
  },
  {
    slug: 'deck-calculator',
    title: 'Deck Calculator — Boards, Joists & Screws',
    shortTitle: 'Deck Calculator',
    category: 'Home & Yard',
    description:
      'Free deck materials calculator. Compute decking board count with waste, joist count at 12/16/24" spacing, and screw quantities for any deck size — plus an editable cost estimate.',
    tagline: 'Boards, joists, screws — order once, build once.',
    intro:
      'Deck material math is coverage math: each 5.5-inch board with a 1/8-inch gap covers 5.625 inches of width, rows multiply by length for total linear feet, and joists follow spacing rules plus one for the rim. This calculator runs the full count — boards with 10% waste, joists, and screws at ~350 per 100 square feet — so the lumberyard order is right the first time.',
    howItWorks: [
      'Enter deck length and width in feet.',
      'Pick your decking board length and joist spacing (16" standard; 12" for many composites).',
      'Read the board count (10% waste included), joist count, and screw quantity.',
      'Open the cost section for editable decking, joist, and labor rates.',
    ],
    faq: [
      {
        q: 'How many deck boards do I need for a 16×12 deck?',
        a: 'Rows across the 12-ft width: ⌈144 ÷ 5.625⌉ = 26 rows, times 16 ft = 416 linear feet. From 16-ft boards with 10% waste that is 29 boards. Shorter boards cost less each but add butt joints — keep joints staggered over joists.',
      },
      {
        q: 'Does this include footings, beams, and railing?',
        a: 'No — those are structural and code-driven. Footing count and depth depend on your frost line and soil, beam spans on lumber species and load, and railing on height. Check your local code and the IRC span tables before digging.',
      },
    ],
  },
  {
    slug: 'insulation-calculator',
    title: 'Insulation Calculator — Batt Count & R-Value by Climate Zone',
    shortTitle: 'Insulation Calculator',
    category: 'Home & Yard',
    description:
      'Free insulation calculator. Compute batt counts for 16" or 24" framing, get DOE R-value guidance by climate zone, and estimate materials cost — walls and attics.',
    tagline: 'How many batts, and how much R does your zone actually need?',
    intro:
      'Insulation orders go wrong two ways: wrong batt width for the framing spacing, and wrong R-value for the climate. This calculator handles both — pick 16" or 24" on-center framing and batt length for an exact batt count with trim waste, then check the DOE recommendation for your climate zone so the attic gets R-49 where R-49 is due.',
    howItWorks: [
      'Enter the area to insulate in square feet.',
      'Pick framing spacing (16" oc takes 15" batts; 24" oc takes 23" batts) and batt length.',
      'Pick your climate zone for DOE R-value guidance.',
      'Read the batt count with 5% trim waste and the materials estimate.',
    ],
    faq: [
      {
        q: 'What R-value do I need in my attic?',
        a: 'DOE guidance: warm climates (zones 1–2) R-30 to R-49, mixed (zones 3–4) R-38 to R-60, cold (zones 5–7) R-49 to R-60. Walls are typically R-13/R-15 in 2×4 framing and R-19/R-21 in 2×6. Attic targets usually mean stacking batts or blowing loose-fill on top.',
      },
      {
        q: 'Does compressing a batt into a smaller cavity work?',
        a: 'No — compressed fiberglass loses R-value roughly in proportion to compression. An R-19 batt squeezed into a 2×4 wall performs closer to R-13 and costs more than just buying R-15. Match the batt to the cavity depth.',
      },
    ],
  },
  {
    slug: 'asphalt-calculator',
    title: 'Asphalt Calculator — Tonnage for Driveways & Paving',
    shortTitle: 'Asphalt Calculator',
    category: 'Home & Yard',
    description:
      'Free asphalt tonnage calculator. Compute hot-mix asphalt tons from area and compacted thickness using 145 lb/cu ft density — with a sq-ft-per-ton sanity check and editable cost estimate.',
    tagline: 'Tons, not guesses — plus the coverage sanity check.',
    intro:
      'Asphalt is ordered by the ton and estimated by feel — which is how jobs come up short on the last pass. The math is simple: area times thickness times 145 lb per compacted cubic foot. This calculator runs it, shows the square-feet-per-ton coverage as a sanity check (about 80 sq ft per ton at 2 inches), and adds an editable cost layer.',
    howItWorks: [
      'Enter the paving length and width in feet.',
      'Pick compacted thickness: 2" for resurfacing, 3" standard driveway, 4" for heavy vehicles.',
      'Read the tonnage and the coverage check.',
      'Open the cost section for per-ton material and per-sq-ft paving labor rates.',
    ],
    faq: [
      {
        q: 'How many tons of asphalt do I need for a driveway?',
        a: 'Area × thickness × 145 lb/cu ft ÷ 2000. A 40×12 ft driveway at 3 inches: 480 sq ft × 0.25 ft = 120 cu ft × 145 = 17,400 lb ≈ 8.7 tons. Rule of thumb: one ton covers about 80 sq ft at 2" or 40 sq ft at 4".',
      },
      {
        q: 'Is the gravel base included?',
        a: 'No — tonnage here is paving only. A new driveway typically needs 4–8 inches of compacted road base under the asphalt; run that through the Road Base calculator with your excavation depth.',
      },
    ],
  },
  {
    slug: 'board-foot-calculator',
    title: 'Board Foot Calculator — Lumber Volume & Cost',
    shortTitle: 'Board Foot Calculator',
    category: 'Home & Yard',
    description:
      'Free board foot calculator. Compute board feet from thickness, width, and length, multiply by piece count, and price at your local per-BF rate — hardwood buying made exact.',
    tagline: 'Hardwood is sold by the board foot. Do the math before the lumberyard.',
    intro:
      'Hardwood and rough lumber are priced by the board foot — a volume unit that trips up everyone the first time: thickness in inches times width in inches times length in feet, divided by 12. This calculator runs the count for one board or a whole stack, and prices it at your supplier\'s per-BF rate.',
    howItWorks: [
      'Enter thickness and width in inches, length in feet.',
      'Enter the piece count for the stack total.',
      'Read board feet each and total, then set your local $/BF price for the cost.',
    ],
    faq: [
      {
        q: 'How many board feet is a 2×6×8?',
        a: '2 × 6 × 8 ÷ 12 = 8 board feet, using nominal dimensions. That is the convention at the lumberyard — a "two by six" bills as a full 2"×6" even though the dressed board measures 1.5"×5.5".',
      },
      {
        q: 'What does "four-quarter" mean?',
        a: 'Rough hardwood thickness in quarter-inches: 4/4 = 1" rough, which planes to about ¾". You pay for the rough dimension — a finished ¾" board still bills as 1" (one BF per square foot per foot of length).',
      },
    ],
  },
  {
    slug: 'stair-calculator',
    title: 'Stair Calculator — Risers, Treads, Run & Stringer Length',
    shortTitle: 'Stair Calculator',
    category: 'Home & Yard',
    description:
      'Free stair calculator with IRC code checks. Compute riser height, tread count, total run, and stringer length from total rise — with the 2R+T comfort rule built in.',
    tagline: 'Code-legal risers and the exact stringer to cut.',
    intro:
      'Stairs fail inspection on two numbers: riser height (7.75" max under the IRC) and tread depth (10" min). This calculator divides your total rise into equal, code-legal risers, counts treads (one fewer than risers — the upper floor is the last landing), computes total run and stringer length, and checks the 2R+T comfort rule.',
    howItWorks: [
      'Measure total rise — finished floor to finished floor — in inches.',
      'Pick tread depth (10" IRC minimum; 11" is noticeably more comfortable).',
      'Read the riser count and exact riser height, tread count, total run, and stringer length.',
      'Check the pass/fail line against IRC basics and the 24–26" comfort rule.',
    ],
    faq: [
      {
        q: 'How many risers for a 105-inch floor-to-floor rise?',
        a: '⌈105 ÷ 7.75⌉ = 14 risers, which makes each riser exactly 7.5". That yields 13 treads, a 130-inch total run at 10" treads, and a 2R+T of 25" — comfortably in the ideal range.',
      },
      {
        q: 'How many stringers do I need?',
        a: 'Two for stairs under 36" wide cut from 2×12s; add a center stringer at 36" and wider, and composite treads often need stringers at 12" on center regardless of width. Check headroom (6\'8" minimum) and handrail rules with your local code before cutting.',
      },
    ],
  },
  {
    slug: 'siding-calculator',
    title: 'Siding Calculator — Squares, Waste & Cost',
    shortTitle: 'Siding Calculator',
    category: 'Home & Yard',
    description:
      'Free siding calculator. Compute squares of siding (100 sq ft units) from house dimensions minus openings, with 10% waste and an editable materials and labor estimate.',
    tagline: 'Siding is sold by the square. Know your count before the quote.',
    intro:
      'A siding quote is only as honest as the square count behind it. This calculator computes net wall area from your house dimensions minus door and window openings, adds the standard 10% cutting waste, and converts to squares — the unit every supplier and installer prices in. Walk into the quote conversation knowing your number.',
    howItWorks: [
      'Enter house length, width, and wall height.',
      'Count doors and windows — 21 sq ft and 15 sq ft are deducted each.',
      'Read the squares to order with 10% waste included.',
      'Open the cost section for editable per-square materials and labor rates.',
    ],
    faq: [
      {
        q: 'What is a "square" of siding?',
        a: '100 square feet of coverage — the universal pricing unit for siding, like roofing. A typical one-story 1,500 sq ft ranch has roughly 10–12 squares of wall area after openings and waste.',
      },
      {
        q: 'Are gables included?',
        a: 'No — gable ends are triangular and measured separately: ½ × base × height each, then added to the wall total before the waste factor. Soffit, fascia, and trim are separate line items too.',
      },
    ],
  },
  {
    slug: 'paver-calculator',
    title: 'Paver Calculator — Pavers, Base & Sand',
    shortTitle: 'Paver Calculator',
    category: 'Home & Yard',
    description:
      'Free paver calculator. Compute paver count with waste, crushed gravel base tonnage, and bedding sand for patios and walkways — with an editable cost estimate.',
    tagline: 'Pavers on top, tons of base underneath — the full order.',
    intro:
      'Paver jobs fail from below, not above: the base is 80% of the work and most of the material weight. This calculator runs the full stack — paver count with cutting waste, compacted gravel base tonnage at your depth, and the 1-inch bedding sand layer — so nothing gets forgotten between the patio and the quote.',
    howItWorks: [
      'Enter patio or walkway length and width.',
      'Pick the paver size and base depth (4" pedestrian, 6" driveway).',
      'Read the paver count, base tonnage, and bedding sand volume.',
      'Open the cost section for per-paver and labor rates.',
    ],
    faq: [
      {
        q: 'How many 4×8 pavers do I need per square foot?',
        a: 'A 4×8-inch paver covers 0.222 sq ft, so 4.5 pavers per square foot — order 4.8 with the 7% waste factor, or about 5 per sq ft for herringbone patterns that generate more cuts.',
      },
      {
        q: 'How deep should the gravel base be?',
        a: '4 inches of compacted crushed gravel for pedestrian patios and walkways, 6+ inches for driveways. Compact in 2-inch lifts — one thick lift never compacts properly and the pavers will telegraph the failure within a season.',
      },
    ],
  },
  {
    slug: 'block-calculator',
    title: 'Concrete Block Calculator — CMU Count & Mortar',
    shortTitle: 'Block Calculator',
    category: 'Home & Yard',
    description:
      'Free concrete block (CMU) calculator. Compute 8×8×16 block count with breakage, mortar bags, and course count for any wall — plus an editable materials and labor estimate.',
    tagline: 'Blocks, mortar, courses — the masonry order in one pass.',
    intro:
      'Masonry counts are coverage math: one standard 8×8×16 block shows 0.889 sq ft of face. This calculator converts your wall dimensions to a block count with 5% breakage, mortar at ~3 bags per 100 blocks, and the course count — the same numbers a mason writes on the order.',
    howItWorks: [
      'Enter wall length and height in feet.',
      'Read the block count (breakage included), mortar bags, and courses.',
      'Open the cost section for per-block, mortar, and laying-labor rates.',
    ],
    faq: [
      {
        q: 'How many concrete blocks per square foot of wall?',
        a: '1.125 blocks per square foot for standard 8×8×16 units (each shows 0.889 sq ft of face). A 40×4 ft wall is 160 sq ft = 180 blocks, or 189 with 5% breakage.',
      },
      {
        q: 'When does a block wall need rebar and grout?',
        a: 'Generally any wall over 4 feet, any retaining wall, and anything structural — vertical rebar in grout-filled cells every 32–48 inches is the common code pattern, with footings sized to the soil. Check your local code before laying the first course.',
      },
    ],
  },
  {
    slug: 'wallpaper-calculator',
    title: 'Wallpaper Calculator — Double Rolls by Pattern Match',
    shortTitle: 'Wallpaper Calculator',
    category: 'Home & Yard',
    description:
      'Free wallpaper calculator. Compute double rolls needed from room dimensions, adjusted for pattern repeat (none, straight, drop) — because matching costs real yield.',
    tagline: 'The pattern repeat decides how many rolls. So does this.',
    intro:
      'Wallpaper estimates go wrong on the pattern repeat, not the wall area. A double roll covers ~56 square feet before matching — but a straight match costs 10% of that yield and a drop match 15%. This calculator measures your room, deducts full-size openings, applies the repeat factor, and rounds to whole double rolls from the same dye lot.',
    howItWorks: [
      'Enter room length, width, and wall height.',
      'Count full-size doors and windows to deduct.',
      'Pick the pattern match type from the wallpaper label.',
      'Read the double-roll count and cost at your roll price.',
    ],
    faq: [
      {
        q: 'How much wallpaper does a 12×14 room need?',
        a: 'Walls: 2×(14+12)×9 ft = 468 sq ft, minus a door and two windows ≈ 417 sq ft. With a drop-match pattern (56 ÷ 1.15 ≈ 49 usable sq ft per double roll) that is 9 double rolls. No-match paper would need 8.',
      },
      {
        q: 'Why buy from the same dye lot?',
        a: 'Color varies subtly between production runs — visible as stripes at the seams once hung. Every roll on one wall should share a lot number; buying the full count up front (plus one spare for repairs) is the only reliable way.',
      },
    ],
  },
  {
    slug: 'rebar-calculator',
    title: 'Rebar Calculator — Grid Count, Weight & Cost',
    shortTitle: 'Rebar Calculator',
    category: 'Home & Yard',
    description:
      'Free rebar calculator for slabs. Compute bar count each way, total linear feet with laps, steel weight by bar size (#3–#6), and 20-ft stick count — with cost at your local price.',
    tagline: 'The grid count, the weight, the stick order — before the pour.',
    intro:
      'Rebar is priced by weight and sold in 20-foot sticks, so a slab order needs three numbers: bars each way, total linear feet with lap allowance, and pounds at your bar size. This calculator runs the grid math (⌈dimension ÷ spacing⌉ + 1 per direction), applies ASTM nominal weights (#4 = 0.668 lb/ft), and converts to sticks and cost.',
    howItWorks: [
      'Enter slab length and width.',
      'Pick grid spacing — 12" for driveways, 18" standard slab, 24" light patio.',
      'Pick bar size (#3 patio, #4 slabs, #5+ driveways and heavy work).',
      'Read the weight, stick count, and cost at your $/lb.',
    ],
    faq: [
      {
        q: 'How much rebar does a 24×24 slab need?',
        a: 'At 18" on center with #4 bar: 17 bars each way = 816 linear feet, about 881 LF with 8% for laps and trim, which weighs ~589 lb — roughly 45 twenty-foot sticks. A 12" grid for a driveway of the same size would be 25 bars each way.',
      },
      {
        q: 'Is rebar or wire mesh better for a slab?',
        a: 'Rebar for driveways, structural slabs, and anything over 4–5 inches; wire mesh is adequate for light 4" patios and sidewalks. Either way, the steel must sit at mid-depth on chairs — steel lying on the ground adds almost no strength.',
      },
    ],
  },
  {
    slug: 'footing-size-calculator',
    title: 'Footing Size Calculator — Width & Thickness by Soil',
    shortTitle: 'Footing Size Calculator',
    category: 'Trades & Engineering',
    description:
      'Free footing size calculator. Size continuous wall footings and column pads from load and soil bearing capacity using IRC prescriptive rules — width, thickness, and projection.',
    tagline: 'Load ÷ soil = width. The prescriptive math, done right.',
    intro:
      'Footing sizing starts with one division: the load divided by what the soil can bear. This calculator runs that math for continuous wall footings and column pads, applies the prescriptive thickness rules (thickness ≥ projection, 6" minimum), and shows the projection each side. Soil capacity presets cover soft clay through bedrock — but the number that matters is the one from your site.',
    howItWorks: [
      'Pick continuous wall or column/pier pad.',
      'Enter the load (lb per foot of wall, or total column load).',
      'Pick the soil bearing estimate — or substitute your geotechnical report value.',
      'Read the width, minimum thickness, and projection.',
    ],
    faq: [
      {
        q: 'How wide should a footing be for a house wall?',
        a: 'Load per foot ÷ soil bearing. A typical two-story wall carrying 3,000 lb/ft on 2,000 psf soil needs 1.5 ft — an 18-inch footing, 6 inches thick. The IRC prescriptive minimum for light one-story construction on good soil is 12"×6".',
      },
      {
        q: 'When do I need an engineer instead of a calculator?',
        a: 'Multi-story construction, retaining walls, poor or unknown soils, steep sites, seismic zones D–F, and anything the building department stamps. Prescriptive math covers conventional light-frame work on decent soil; everything else is engineered.',
      },
    ],
  },
  {
    slug: 'block-fill-calculator',
    title: 'Block Fill Calculator — Grout Volume for CMU Walls',
    shortTitle: 'Block Fill Calculator',
    category: 'Home & Yard',
    description:
      'Free block fill (grout) calculator. Compute cubic yards of grout to fill CMU cells — full grout or rebar cells only — with waste allowance and ready-mix cost.',
    tagline: 'How much grout does that block wall actually swallow?',
    intro:
      'A grouted block wall is hollow until the truck arrives — and grout volumes surprise everyone. One 8×8×16 block holds about 0.24 cubic feet with both cells filled; a full wall runs roughly one cubic yard per 112 blocks. This calculator converts wall dimensions to grout yards with a waste allowance, full-fill or rebar-cells-only.',
    howItWorks: [
      'Enter wall length and height.',
      'Pick all cells (full grout) or every other cell (rebar cells only).',
      'Read the cubic yards with 10% waste, the block count, and the cost.',
    ],
    faq: [
      {
        q: 'How much grout per 100 blocks?',
        a: 'Fully grouted 8-inch blocks: about 0.9 cubic yards per 100 blocks (0.24 cu ft per block × 100 ÷ 27). Filling only the rebar cells halves it. Always add 10% for spillage and pump priming.',
      },
      {
        q: 'Does rebar go in before or after the grout?',
        a: 'Before — vertical bars are placed in the cells as the wall is laid, then grout is poured around them in lifts of about 4–5 feet and consolidated. Grouting first and pushing bars in traps air and creates hidden voids.',
      },
    ],
  },
  {
    slug: 'joist-span-calculator',
    title: 'Floor Joist Span Calculator — IRC Table R502.3.1(2)',
    shortTitle: 'Joist Span Calculator',
    category: 'Trades & Engineering',
    description:
      'Free floor joist span calculator using IRC Table R502.3.1(2) values for Douglas Fir-Larch #2 at 40 psf live load. Enter your span, get an instant pass/fail by size and spacing.',
    tagline: 'The actual IRC span table, as a pass/fail check.',
    intro:
      'Every "can I span 14 feet with 2×10s?" question is a table lookup — but the table is a wall of numbers. This calculator turns IRC Table R502.3.1(2) into a direct answer: pick size and spacing, enter your span, get PASS or FAILS with the maximum shown. Values are Douglas Fir-Larch #2 at 40 psf live / 10 psf dead with L/360 deflection — the standard living-area floor case.',
    howItWorks: [
      'Pick the joist size (2×6 through 2×12) and spacing (12", 16", or 19.2" on center).',
      'Enter the clear span you need to cover.',
      'Read the maximum allowable span and the pass/fail verdict.',
      'If it fails, tighten spacing or size up — or consider engineered joists for long spans.',
    ],
    faq: [
      {
        q: 'How far can a 2×10 floor joist span?',
        a: 'Douglas Fir-Larch #2 at 16" on center, 40 psf live load: 15\'-5" maximum per IRC Table R502.3.1(2). At 12" spacing it stretches to 17\'-9"; at 19.2" it drops to 14\'-1". Southern Pine runs longer, SPF shorter — check the stamp on your lumber.',
      },
      {
        q: 'Do these spans work for decks?',
        a: 'No — deck joists use different tables (IRC R507) because exterior decks carry different loads and get no deflection credit from a ceiling below. Tile floors, hot tubs, and bearing walls from above also change the residential floor math. When the answer matters, your local code edition and building department control.',
      },
    ],
  },
  {
    slug: 'board-batten-calculator',
    title: 'Board and Batten Spacing Calculator — Even Layout Math',
    shortTitle: 'Board & Batten Calculator',
    category: 'Home & Yard',
    description:
      'Free board and batten spacing calculator. Enter wall width, batten width, and target gap — get the exact number of battens and perfectly even spacing for accent walls and exteriors.',
    tagline: 'Even gaps, both ends matched — no almost-right walls.',
    intro:
      'Board and batten walls live or die on even spacing, and the math is one equation: n battens plus (n−1) gaps equals the wall width. This calculator solves it exactly — battens at both ends, every gap identical to the hundredth of an inch — so the last bay matches the first instead of being visibly off.',
    howItWorks: [
      'Measure the wall width in inches (a 10-ft wall is 120).',
      'Enter your batten width (a 1×3 is 2.5" actual; a 1×4 is 3.5").',
      'Enter your target gap — 12–18 inches is the usual accent-wall range.',
      'Read the batten count and the exact even gap, then lay out with a story stick.',
    ],
    faq: [
      {
        q: 'What spacing looks right for board and batten?',
        a: '12–18 inches between battens suits most accent walls; exterior siding traditionally ran 16–24 inches. Lower walls and wainscot look better tighter (10–14"), tall walls wider. The calculator finds the batten count that lands closest to your target with perfectly even gaps.',
      },
      {
        q: 'Do I start from the corner or center the layout?',
        a: 'Corner-to-corner with battens at both ends is the standard accent-wall approach and what this calculator solves. Centering a middle batten works for walls broken by a focal point (fireplace, bed), but then you must still equalize the side bays — same equation, applied twice.',
      },
    ],
  },
  {
    slug: 'gutter-size-calculator',
    title: 'Gutter Size Calculator — 5" vs 6" & Downspout Count',
    shortTitle: 'Gutter Size Calculator',
    category: 'Home & Yard',
    description:
      'Free gutter sizing calculator. Convert roof area and pitch to adjusted drainage area, get a 5-inch vs 6-inch K-style recommendation, and the minimum downspout count for your run.',
    tagline: '5-inch or 6-inch? The roof area and pitch decide, not the price.',
    intro:
      'Gutters overflow because they were undersized, not because they were dirty. Sizing is drainage math: roof footprint times a pitch factor gives adjusted area, and that number maps to 5-inch or 6-inch K-style capacity. This calculator runs it, adjusts for heavy-rainfall regions, and counts the downspouts your run actually needs.',
    howItWorks: [
      'Enter the roof footprint area draining to this gutter run.',
      'Pick the pitch factor (steeper roofs dump water faster) and your rainfall region.',
      'Enter the gutter run length for the downspout count.',
      'Read the size recommendation and minimum downspouts.',
    ],
    faq: [
      {
        q: 'When do I need 6-inch gutters instead of 5-inch?',
        a: 'When adjusted drainage area exceeds ~5,500 sq ft (heavy-rain regions: ~4,400), on steep roofs (9/12+), or on long runs where one downspout can\'t keep up. A 6" K-style carries roughly 40% more water than a 5". The upgrade cost is small; the fascia-rot cost of overflow is not.',
      },
      {
        q: 'How many downspouts do I need?',
        a: 'At least one per 30 feet of gutter run AND one per ~600 adjusted square feet — whichever demands more. A 120-ft run needs 4 by spacing alone. Long runs with too few downspouts are the classic overflow setup even with correctly sized gutters.',
      },
    ],
  },
  {
    slug: 'pool-volume-calculator',
    title: 'Pool Volume Calculator — Gallons by Shape & Depth',
    shortTitle: 'Pool Volume Calculator',
    category: 'Home & Yard',
    description:
      'Free pool volume calculator. Compute gallons for rectangular, oval, and round pools using exact geometry and the 7.48 gal/cu ft conversion — the number every chemical dose depends on.',
    tagline: 'Every chemical dose starts here. Get the gallons right.',
    intro:
      'Every pool chemical instruction says "per 10,000 gallons" — which means every dose is wrong if your volume is wrong. This calculator computes exact volume from shape and dimensions: rectangles by length × width × average depth, ovals and rounds by proper ellipse and circle geometry, all converted at 7.48 gallons per cubic foot.',
    howItWorks: [
      'Pick your pool shape (freeform: use the bounding rectangle and subtract ~15%).',
      'Enter dimensions; for sloped floors enter shallow and deep depths — the average is computed.',
      'Read the gallons, and write it on the equipment pad — you will use it forever.',
    ],
    faq: [
      {
        q: 'How many gallons is a 16×32 pool?',
        a: 'With a 3.5-ft shallow end and 8-ft deep end (5.75 ft average): 16 × 32 × 5.75 × 7.48 ≈ 22,000 gallons. A uniform 4.5-ft version of the same pool is about 17,200 gallons.',
      },
      {
        q: 'How do I measure average depth accurately?',
        a: '(Shallow depth + deep depth) ÷ 2 works for evenly sloped floors. If the pool has a flat hopper bottom or benches, take depth readings every few feet along the length and average them. When in doubt, err slightly low — overdosing chemicals is more dangerous than underdosing.',
      },
    ],
  },
  {
    slug: 'pool-pump-calculator',
    title: 'Pool Pump Calculator — Turnover Time & Required GPM',
    shortTitle: 'Pool Pump Calculator',
    category: 'Home & Yard',
    description:
      'Free pool pump calculator. Compute turnover time from gallons and GPM, the flow rate needed for an 8-hour turnover, and what the pump costs to run monthly.',
    tagline: 'Is your pump actually turning the water over? Do the math.',
    intro:
      'Cloudy water and algae usually trace back to filtration time, not chemicals — and filtration time is one division: gallons ÷ (GPM × 60). This calculator shows your actual turnover, the GPM needed to hit the 8-hour residential standard, and what each turnover costs in electricity (where the variable-speed-pump math gets persuasive).',
    howItWorks: [
      'Enter pool volume (use the Pool Volume calculator if unsure).',
      'Enter your pump\'s actual flow rate — from the pump curve at your system head, not the box.',
      'Pick the target turnover (8 hours is the residential standard).',
      'Open the cost section for the monthly electricity number.',
    ],
    faq: [
      {
        q: 'How long should I run my pool pump?',
        a: 'Long enough for one full turnover minimum — for a 20,000-gallon pool on a 50 GPM pump that is 6.7 hours. Many owners run 8–12 hours in summer for margin. A variable-speed pump run longer at low speed filters better AND costs less than a single-speed sprint.',
      },
      {
        q: 'What GPM does my pump actually produce?',
        a: 'Less than the label. Nameplate GPM is at zero head pressure; real systems run 30–60 feet of head (plumbing, filter, heater). Find your pump\'s curve chart and read the flow at your estimated head — typically 60–70% of nameplate for a clean filter.',
      },
    ],
  },
  {
    slug: 'pool-heater-calculator',
    title: 'Pool Heater Size Calculator — BTU by Surface Area',
    shortTitle: 'Pool Heater Calculator',
    category: 'Home & Yard',
    description:
      'Free pool heater sizing calculator. Compute required BTU/hr from pool surface area, desired temperature, and coldest swim-month air temp — gas heater and heat pump sizing.',
    tagline: 'BTU sizing is surface-area math, not gallon guessing.',
    intro:
      'Pool heaters are sized to hold temperature against surface heat loss, which is why the math runs on surface area, not gallons: BTU/hr = surface sq ft × temperature rise × 12, using the coldest month you intend to swim. This calculator runs the rule, adjusts for wind exposure, and tells you what size unit to quote.',
    howItWorks: [
      'Enter pool length and width (surface area drives heat loss).',
      'Enter desired water temperature and the coldest swim-month air temperature.',
      'Flag wind exposure — exposed pools need ~25% more capacity.',
      'Read the minimum BTU/hr; size up one step for faster heat-up.',
    ],
    faq: [
      {
        q: 'What size heater for a 16×32 pool?',
        a: '512 sq ft of surface, holding 80°F water against 65°F air (15° rise): 512 × 15 × 12 ≈ 92,000 BTU/hr minimum to maintain. In practice that pool gets quoted a 100–150k heat pump or 250–400k gas heater — gas heaters are oversized deliberately for fast weekend heat-up.',
      },
      {
        q: 'Why do gas heaters and heat pumps size so differently?',
        a: 'Gas heaters are cheap per BTU and oversized for speed (heating 2–3°F per hour); heat pumps are efficient but slow and sized to maintain temperature continuously. A heat pump also loses capacity as air temperature drops — check the output rating at YOUR coldest swim-month temp, not the 80°F nameplate condition.',
      },
    ],
  },
  {
    slug: 'pool-chemical-calculator',
    title: 'Pool Chemical Calculator — Chlorine, pH, TA, CYA Dosing',
    shortTitle: 'Pool Chemical Calculator',
    category: 'Home & Yard',
    description:
      'Free pool chemical dosing calculator. Exact amounts for liquid chlorine, bleach, dichlor, baking soda (TA), calcium chloride (CH), stabilizer (CYA), and muriatic acid — scaled to your gallons.',
    tagline: 'Per-10,000-gallon dosing rates, scaled to YOUR pool.',
    intro:
      'Chemical labels say "per 10,000 gallons" and every pool is a different size — that gap is where algae and scale come from. This calculator applies the standard industry dosing rates (10.7 oz of 12.5% liquid chlorine per ppm FC, 1.5 lb baking soda per 10 ppm TA, 13 oz stabilizer per 10 ppm CYA) scaled exactly to your volume, with the handling warnings that matter.',
    howItWorks: [
      'Enter your pool volume in gallons (use the Pool Volume calculator if unsure).',
      'Pick the chemical and goal — chlorine, alkalinity, hardness, stabilizer, or pH.',
      'Enter the adjustment size (e.g., 3 to raise FC by 3 ppm).',
      'Read the exact dose, then retest in 4–6 hours.',
    ],
    faq: [
      {
        q: 'How much liquid chlorine do I add to raise FC by 3 ppm?',
        a: 'Per 10,000 gallons: 3 × 10.7 = 32 oz of 12.5% liquid chlorine (about a quart). A 20,000-gallon pool doubles that to 64 oz — roughly half a jug. Household 6% bleach needs about twice the volume of 12.5% liquid.',
      },
      {
        q: 'Why does my CYA keep climbing?',
        a: 'Trichlor tablets and dichlor granules are chlorine PLUS stabilizer — every puck adds roughly 0.6 ppm CYA. By late summer, tablet-fed pools often hit 100+ ppm CYA, where normal chlorine levels stop working. Liquid chlorine adds none. There is no chemical that lowers CYA: only partial drains and refills.',
      },
    ],
  },
  {
    slug: 'voltage-drop-calculator',
    title: 'Voltage Drop Calculator — NEC Wire Run Check',
    shortTitle: 'Voltage Drop Calculator',
    category: 'Trades & Engineering',
    description:
      'Free voltage drop calculator using NEC Chapter 9 circular-mil math. Check any wire run against the 3% branch-circuit guideline and find the smallest gauge that passes.',
    tagline: 'Will that 100-foot run actually deliver 120 volts?',
    intro:
      'Every long wire run loses voltage — to a shed, an RV pedestal, a well pump, a shop. Undersized wire means dim lights, hot conductors, and motors that die young. This calculator runs the standard NEC formula (Vd = 2 × K × L × I ÷ CM), checks the result against the 3% branch-circuit guideline, and tells you the smallest copper or aluminum gauge that passes.',
    howItWorks: [
      'Enter the load in amps and the one-way distance in feet.',
      'Pick system voltage, wire gauge, and copper or aluminum.',
      'Read the voltage drop in volts and percent, and the NEC 3% pass/fail.',
      'Use the "smallest size that passes" output to spec the right wire before you trench.',
    ],
    faq: [
      {
        q: 'How much voltage drop is acceptable?',
        a: 'The NEC recommends (as a performance guideline, not a mandate) no more than 3% on a branch circuit and 5% total for feeder plus branch. At 120 V, 3% is 3.6 volts. Sensitive electronics and motors care more than light bulbs.',
      },
      {
        q: 'What size wire for 20 amps at 100 feet?',
        a: '12 AWG copper carries 20 A legally, but at 100 feet it drops 7.9 V (6.6%) — over the guideline. Even 10 AWG fails at 5.0 V (4.1%). You need 8 AWG (3.1 V, 2.6%) to pass. Distance, not just amps, is what upsizes wire — run the numbers before you buy.',
      },
    ],
  },
  {
    slug: 'wire-size-calculator',
    title: 'Wire Size Calculator — Ampacity & Breaker Sizing (NEC)',
    shortTitle: 'Wire Size Calculator',
    category: 'Trades & Engineering',
    description:
      'Free wire size calculator. NEC 75°C ampacity table plus the 125% continuous-load rule gives the minimum copper or aluminum gauge and breaker size for any load.',
    tagline: 'Load amps in, wire gauge and breaker out.',
    intro:
      'Wire sizing has two rules that collide: the conductor must carry the load (ampacity), and continuous loads must be multiplied by 125% before sizing anything. This calculator applies both, using NEC Table 310.16 75°C ampacities for copper and aluminum, and outputs the minimum gauge and standard breaker size.',
    howItWorks: [
      'Enter the load in amps.',
      'Say whether it runs 3+ hours at a stretch (EV chargers, heaters, lighting) — that triggers the 125% rule.',
      'Pick copper or aluminum and the system voltage.',
      'Read the minimum wire size, breaker, design amps, and load wattage.',
    ],
    faq: [
      {
        q: 'What size wire for a 50-amp circuit?',
        a: 'Intermittent 50 A load: 8 AWG copper (50 A at 75°C). Continuous: 50 × 1.25 = 62.5 A design, so 6 AWG copper and a 70 A breaker. The continuous rule is why EV chargers upsize wire.',
      },
      {
        q: 'Can I use aluminum instead of copper?',
        a: 'Yes for feeders and large branch circuits — it is roughly two gauges larger and much cheaper per foot. Use AL-rated terminals, antioxidant compound, and proper torque; the 1970s fire problems were termination failures, not the metal.',
      },
    ],
  },
  {
    slug: 'hvac-btu-calculator',
    title: 'BTU Calculator — HVAC Sizing by Room or Home',
    shortTitle: 'BTU Calculator',
    category: 'Trades & Engineering',
    description:
      'Free BTU calculator for HVAC sizing. Square footage, climate, insulation, ceiling height, sun, and occupants produce a BTU/hr estimate, cooling tons, and a typical unit size.',
    tagline: 'How many BTUs does this space actually need?',
    intro:
      'Oversized air conditioners short-cycle and leave the air clammy; undersized ones run forever and never catch up. This calculator applies the standard sizing factors — climate baseline, insulation quality, ceiling volume, sun exposure, occupant heat — to produce a defensible BTU/hr estimate and tonnage before you talk to a contractor.',
    howItWorks: [
      'Enter the conditioned square footage.',
      'Set climate (heating- vs cooling-dominant), insulation quality, and ceiling height.',
      'Adjust for sun exposure and regular occupants (600 BTU/hr each beyond two).',
      'Read BTU/hr, cooling tons (12,000 BTU = 1 ton), and the typical unit size to quote.',
    ],
    faq: [
      {
        q: 'How many BTUs per square foot do I need?',
        a: 'The rule of thumb runs 20–35 BTU per sq ft depending on climate and insulation — a 1,500 sq ft average home in a mixed climate lands near 45,000 BTU/hr (about 3.5–4 tons). It is a screening number; a Manual J calculation is the real design.',
      },
      {
        q: 'Is a bigger AC unit better?',
        a: 'No — oversizing is the more expensive mistake. An oversized unit cools the air before it dehumidifies, then shuts off, leaving cool, sticky rooms and short equipment life. Right-sized equipment runs longer cycles and controls humidity.',
      },
    ],
  },
  {
    slug: 'pipe-size-calculator',
    title: 'Pipe Size Calculator — Fixture Units to Pipe Diameter',
    shortTitle: 'Pipe Size Calculator',
    category: 'Trades & Engineering',
    description:
      'Free plumbing pipe size calculator. Count fixtures, get total fixture units and probable peak GPM, and size the supply line to keep velocity under 8 ft/s.',
    tagline: 'Count the fixtures, size the line.',
    intro:
      'Plumbing lines are not sized for every tap running at once — they are sized for probable simultaneous demand, which is what fixture units encode. This calculator totals your fixture units, converts them to peak GPM, and picks the smallest supply line that keeps water velocity under the 8 ft/s noise-and-wear ceiling.',
    howItWorks: [
      'Count each fixture type the line serves — toilets, sinks, showers, appliances, hose bibs.',
      'Read total fixture units and probable peak demand in GPM.',
      'Get the recommended pipe diameter at ≤8 ft/s velocity.',
      'Long runs, low street pressure, or flushometer fixtures need a licensed plumber\'s design — code governs.',
    ],
    faq: [
      {
        q: 'What size water line does a typical house need?',
        a: 'A standard 2–2.5 bath home totals roughly 15–20 fixture units, demanding about 7–10 GPM at peak — a ¾-inch main handles it comfortably. One-inch service lines are common where street pressure is low or runs are long.',
      },
      {
        q: 'Why not just run 1-inch pipe everywhere?',
        a: 'Oversized supply lines waste money and, worse, let hot water sit and cool in the pipe — longer waits at the tap and more wasted water. Right-sizing balances pressure, cost, and hot-water delivery time.',
      },
    ],
  },
  {
    slug: 'bid-sheet-calculator',
    title: 'Pro Bid Sheet — Contractor Estimate Builder with Markup & Margin',
    shortTitle: 'Pro Bid Sheet',
    category: 'Trades & Engineering',
    description:
      'Free contractor bid sheet. Turn takeoff quantities into a priced, line-item estimate with markup vs margin math and a $/sq ft check — saved in your browser, prints clean for the client.',
    tagline: 'Takeoff numbers in, client-ready bid out.',
    intro:
      'Every bid starts as a pile of takeoff quantities — studs, sheets, gallons, hours. This bid sheet turns that pile into a priced estimate: editable line items split into materials and labor, your overhead-and-profit markup applied on top, the true margin shown next to it, and a price-per-square-foot reality check against your market. It auto-saves in your browser, so the bid is still there when the client calls back, and it prints clean for the kitchen-table meeting.',
    howItWorks: [
      'Name the job and, optionally, the client.',
      'Edit the sample line items or add your own — description, quantity, unit, and unit cost for each; tag each line as material or labor.',
      'Set your markup percentage on cost and the job size in square feet.',
      'Read the materials and labor subtotals, markup amount, bid total, true margin, and $/sq ft — then print or save as PDF.',
    ],
    faq: [
      {
        q: 'What is the difference between markup and margin?',
        a: 'Markup is a percentage added to your cost; margin is the profit share of the final price. A 15% markup on a $2,428 cost adds $364.20 for a $2,792.20 bid — but $364.20 ÷ $2,792.20 is only a 13.0% margin. Overhead targets are expressed in margin, so quoting in markup without converting is how contractors undercharge.',
      },
      {
        q: 'What markup should a contractor charge?',
        a: 'It depends on overhead. Many residential remodelers and GCs target roughly 15–25% markup on small jobs, and specialty subs vary widely by trade and region. Work backwards from your real numbers: if running the business costs 15% of revenue and you want 10% profit, you need a 25% margin — which is a 33% markup on cost.',
      },
      {
        q: 'Where is my bid data stored?',
        a: "Only in your browser's local storage on this device — nothing is uploaded or shared. Clearing browser data resets the sheet, so use Print / save as PDF to keep a permanent copy of any real bid.",
      },
    ],
  },
  {
    slug: 'markup-margin-calculator',
    title: 'Markup vs Margin Calculator — Convert, Price Jobs & Hit Profit Targets',
    shortTitle: 'Markup vs Margin',
    category: 'Trades & Engineering',
    description:
      'Free markup vs margin calculator. Convert markup to margin and back, price a job from cost, or find the markup you need to cover overhead and hit a profit target.',
    tagline: 'Quote in markup. Run the business on margin.',
    intro:
      'Markup and margin measure the same profit from different bases — markup from cost, margin from price — and confusing them is one of the most common ways contractors and freelancers undercharge. This calculator works in all three directions: price a job from cost and markup, back into a price from a target margin, or dissect an existing quote into profit, markup, and margin. The overhead solver answers the harder question: given what it costs to run the business, what markup do you actually need?',
    howItWorks: [
      'Choose what you know: cost + markup %, cost + target margin %, or cost + sell price.',
      'Enter your job cost (materials + labor) and the percentage or price.',
      'Read the sell price, profit, markup, and margin — all four, always.',
      'Open the overhead solver to convert your business overhead and profit target into the required markup, or check the conversion table.',
    ],
    faq: [
      {
        q: 'What markup gives me a 20% margin?',
        a: '25%. Price = cost ÷ (1 − 0.20) = 1.25 × cost. The general conversion is markup = margin ÷ (1 − margin), so a 20% margin needs 0.20 ÷ 0.80 = 25% markup.',
      },
      {
        q: 'Is a 100% markup the same as a 50% margin?',
        a: 'Yes. Double your cost ($1,000 → $2,000) and the $1,000 profit is half of the selling price — a 50% margin. Doubling the price never means 100% margin; 100% margin would require a cost of zero.',
      },
      {
        q: 'Why does margin matter more than markup for my business?',
        a: 'Because your overhead — truck, insurance, office, taxes — eats a share of revenue (the selling price), not a share of cost. If overhead is 15% of revenue and you want 10% net profit, you need a 25% margin on every job, which means quoting a 33.3% markup on cost. Quote 25% markup instead and you get a 20% margin — 5 points short.',
      },
      {
        q: 'What is a good margin for a contractor?',
        a: 'It varies by trade and region, but many residential contractors find they need gross margins in the 25–35% range to cover overhead and leave real net profit, which translates to markups of roughly 33–54% on cost. Use the overhead solver with your own numbers — averages are a starting point, not a budget.',
      },
    ],
  },
  {
    slug: 'real-estate-commission-calculator',
    title: 'Real Estate Commission Calculator — Splits, Fees & Agent Net Pay',
    shortTitle: 'Commission Split Calculator',
    category: 'Freelance & Career',
    description:
      'Free real estate commission calculator. Run the full waterfall — gross commission, your side, franchise fee, broker split, transaction fees — and see your true net per deal.',
    tagline: 'What does the agent actually keep?',
    intro:
      'The headline commission percentage is never what lands in your account. This calculator runs the real waterfall: gross commission, your side of it, the franchise fee off the top, your split with the broker, and flat transaction fees — ending at your true net per deal and the effective percentage of the sale price you actually keep.',
    howItWorks: [
      'Enter the sale price, total commission %, and your side of the deal (50% if you have one side of a typical split).',
      'Add your franchise fee %, your broker split (% to you), and any flat transaction/admin fee.',
      'Read each stage of the waterfall plus your net and effective rate on the sale price.',
    ],
    faq: [
      {
        q: 'Why is my net so much lower than the commission percentage?',
        a: 'Because several layers come out first. On a $400,000 sale at 5.5% total, your half is $11,000 — then a 6% franchise fee ($660), then a 70/30 broker split leaves $7,238, and a $395 transaction fee leaves $6,843. That is 1.71% of the sale price, not 5.5%.',
      },
      {
        q: 'What are typical broker splits?',
        a: 'New agents often start at 50/50 to 70/30; experienced agents negotiate 80/20 or 90/10, sometimes with a yearly cap after which they keep 100%. Flat-fee and 100%-commission brokerages trade the split for monthly desk fees instead — run both structures through this calculator to compare.',
      },
      {
        q: 'What is a franchise fee?',
        a: 'Agents at franchise brokerages (the big national brands) typically pay 5–8% of gross commission off the top, before the broker split is applied. It funds the national brand and marketing. Independent brokerages usually do not charge one.',
      },
    ],
  },
  {
    slug: 'cap-rate-calculator',
    title: 'Cap Rate Calculator — NOI, Gross Rent Multiplier & Cash-on-Cash Return',
    shortTitle: 'Cap Rate Calculator',
    category: 'Savings & Investing',
    description:
      'Free cap rate calculator for rental property. Compute NOI, cap rate, gross rent multiplier, mortgage payment, annual cash flow, and cash-on-cash return in one pass.',
    tagline: 'Is this rental actually a good deal?',
    intro:
      'Cap rate is the fastest honest filter in rental investing — but only if the NOI is honest. This calculator builds NOI properly (rent minus vacancy minus real operating expenses, never the mortgage), then layers financing on top so you see both the property\'s unlevered yield (cap rate, GRM) and your actual leveraged result (cash flow and cash-on-cash return).',
    howItWorks: [
      'Enter the purchase price, monthly rent, a vacancy allowance, and operating expenses as % of income (35–50% is typical for single-family).',
      'Add your financing: down payment %, loan rate, and term.',
      'Read NOI, cap rate, and GRM for the property itself — then the mortgage payment, annual cash flow, and cash-on-cash return for your deal.',
    ],
    faq: [
      {
        q: 'Does cap rate include the mortgage?',
        a: 'No. Cap rate = NOI ÷ price, and NOI excludes debt service by definition — it measures the property\'s yield independent of how you finance it. Your return with financing is cash-on-cash: (NOI − annual debt service) ÷ cash invested. A property can have a healthy 6% cap rate and still produce near-zero cash flow at high interest rates.',
      },
      {
        q: 'What is a good cap rate?',
        a: 'It depends on market and risk. Roughly: prime big-city multifamily often trades at 4–5%, suburban single-family rentals at 5–7%, and higher-risk or smaller-market properties at 8–10%+. Compare a deal to similar sales in the same market — the absolute number means little alone.',
      },
      {
        q: 'What should I include in operating expenses?',
        a: 'Property taxes, insurance, maintenance and repairs, capital expenditure reserves, management (even if self-managed — your time has a cost), utilities you pay, and HOA dues. Not the mortgage. Sellers\' pro formas famously understate expenses; 35–50% of gross income is the common reality check for single-family rentals.',
      },
    ],
  },
  {
    slug: 'gci-goal-calculator',
    title: 'GCI Goal Calculator — How Many Deals to Hit Your Income Goal',
    shortTitle: 'GCI Goal Calculator',
    category: 'Freelance & Career',
    description:
      'Free GCI goal calculator for real estate agents. Convert your annual income goal into the number of closings you need, with franchise fees and broker splits baked in.',
    tagline: 'Turn the income goal into a deal count.',
    intro:
      'Business plans fail when the income goal never gets converted into a deal count. This planner works backwards from what you want to net: your average sale price, commission per side, franchise fee, and broker split produce a true net-per-deal figure, and your goal divided by that number is the closings you need — per year and per month.',
    howItWorks: [
      'Enter your annual net income goal and your market\'s average sale price.',
      'Add your commission per side %, franchise fee %, and broker split.',
      'Read your net per deal, the deals needed this year, and the pace per month your prospecting has to support.',
    ],
    faq: [
      {
        q: 'What is GCI?',
        a: 'Gross Commission Income — the total commission your sides of transactions generate before splits, fees, and expenses. It is the headline number brokerages recruit with, but your actual income is GCI minus franchise fees, broker splits, transaction fees, and your marketing costs. Plan on net, not GCI.',
      },
      {
        q: 'Why does net per deal matter more than GCI?',
        a: 'Because two agents with identical GCI can take home wildly different incomes. A $150,000 goal at $7,238 net per deal needs 21 closings; the same goal at a 50/50 split with a franchise fee can need 30+. Know your number before you commit to a pipeline.',
      },
      {
        q: 'How many deals does a typical agent close?',
        a: 'It varies enormously by market and experience — many part-time agents close a handful of deals a year while full-time agents in active markets may close 15–30. Use this planner in reverse: enter your actual last-year closings to see the income your current structure produces, then test what a better split would change.',
      },
    ],
  },
  {
    slug: 'sales-commission-calculator',
    title: 'Sales Commission Calculator — Tiered Commission Structures',
    shortTitle: 'Sales Commission Calculator',
    category: 'Freelance & Career',
    description:
      'Free tiered sales commission calculator. Enter your sales and up to three marginal commission tiers to see exactly what each band pays, the total, and your blended rate.',
    tagline: 'Tiers are marginal — see what each band really pays.',
    intro:
      'Tiered commission plans work like tax brackets: each rate applies only to the sales inside its band, so hitting the top tier does not retroactively raise the rate on everything. This calculator applies your plan\'s tiers marginally and shows the payout per band, the total commission, and your true blended rate — the number to compare across comp plans.',
    howItWorks: [
      'Enter your sales for the period.',
      'Set up to three tiers: rate and upper bound for tiers 1 and 2, and the rate for everything above tier 2.',
      'Read the commission per tier, the total, and the blended rate on your sales.',
    ],
    faq: [
      {
        q: 'How do tiered commissions work?',
        a: 'Marginally. With tiers of 5% up to $50k, 8% up to $100k, and 12% above that, $120,000 in sales pays 5% × $50,000 + 8% × $50,000 + 12% × $20,000 = $8,900 — not 12% of $120,000 ($14,400). Always check whether your plan is marginal ("tiered") or retroactive ("the top rate applies to everything once you cross it"); the difference is enormous.',
      },
      {
        q: 'What is a blended commission rate?',
        a: 'Total commission divided by total sales. In the example above it is $8,900 ÷ $120,000 = 7.42%. Blended rate is the honest way to compare two comp plans with different tier structures.',
      },
      {
        q: 'What about accelerators and decelerators?',
        a: 'Accelerators raise your rate after you pass quota (e.g., 1.5× beyond 100% attainment) and decelerators cut it below a floor. Model an accelerator by entering your above-quota sales with the multiplied rate in tier 3. Commission-only draws and clawbacks are separate mechanics — check your plan document.',
      },
    ],
  },
  {
    slug: 'quota-attainment-calculator',
    title: 'Quota Attainment Calculator — Pace, Projection & Catch-Up Math',
    shortTitle: 'Quota Attainment Calculator',
    category: 'Freelance & Career',
    description:
      'Free quota attainment calculator. See your attainment %, whether you are ahead or behind pace, what you must close per remaining month, and your projected year-end finish.',
    tagline: 'Are you actually on pace — or hoping?',
    intro:
      'Halfway through the year with 43% of quota closed feels fine until you do the math: a linear pace says you should have 50%. This calculator turns your year-to-date number into the four figures that matter — attainment, pace gap, the monthly close rate needed to catch up, and where you finish if nothing changes.',
    howItWorks: [
      'Enter your annual quota, closed-won so far, and months elapsed in the quota year.',
      'Read attainment %, the on-pace target, and how far ahead or behind you are.',
      'Check the required close rate per remaining month versus your current average — and the projected year-end finish.',
    ],
    faq: [
      {
        q: 'What is quota attainment?',
        a: 'Closed-won business divided by quota, as a percentage. $520,000 closed against a $1.2M annual quota after 6 months is 43.3% attainment — behind the 50% linear pace, needing $113,333 per month for the rest of the year to catch up.',
      },
      {
        q: 'Is linear pace realistic?',
        a: 'Rarely — most businesses are seasonal, and Q4 is often the biggest quarter. Use linear pace as the early-warning line, then adjust for your cycle: if 40% of your annual business historically lands in Q4, being slightly behind in Q2 is normal. The projected year-end figure shows what "nothing changes" looks like.',
      },
      {
        q: 'When should I worry about my number?',
        a: 'A common rule of thumb: pipeline coverage of 3–4× the remaining gap. If you need $680k more this year and your qualified pipeline is $1.2M, you are short. The catch-up math gets brutal fast — each month behind raises the required monthly close rate for every month left.',
      },
    ],
  },
  {
    slug: 'ote-calculator',
    title: 'OTE Calculator — On-Target Earnings, Implied Quota & Offer Comparison',
    shortTitle: 'OTE Calculator',
    category: 'Freelance & Career',
    description:
      'Free OTE calculator for sales roles. Split on-target earnings into base and variable, find the implied quota behind the offer, and see earnings at 80%, 100%, and 120% attainment.',
    tagline: 'OTE is a promise — find the quota behind it.',
    intro:
      'Two sales offers with the same OTE can be wildly different jobs. What matters is the implied quota: variable pay ÷ commission rate. This calculator splits any offer into base and variable, derives the quota you would carry, and shows what you actually earn at 80%, 100%, and 120% of that number — the honest way to compare offers.',
    howItWorks: [
      'Enter the base salary and the variable pay at 100% of quota.',
      'Enter the commission rate on sales.',
      'Read the OTE, the implied annual quota and monthly pace, and earnings at three attainment levels.',
    ],
    faq: [
      {
        q: 'What does OTE mean?',
        a: 'On-target earnings: base salary plus the variable pay you earn at exactly 100% of quota. A $70k base + $60k variable is a $130k OTE. It is not a guarantee — it is what the plan pays if you hit your number exactly.',
      },
      {
        q: 'How do I compare two offers with the same OTE?',
        a: 'Derive the implied quota for each. $60k variable at 5% commission means a $1.2M quota; at 3% it means $2M. The second offer requires 67% more sales for the same pay. Then ask what attainment the team actually achieves — a $130k OTE where the median rep hits 75% pays $115k in reality.',
      },
      {
        q: 'What base/variable split is normal?',
        a: 'Common splits are 50/50 to 70/30 (base/variable) depending on role — higher base for longer, complex sales cycles; higher variable for transactional roles. A higher base percentage de-risks your income; a higher variable percentage pays more if you consistently overperform. The 80/100/120% earnings table shows both sides of that trade.',
      },
    ],
  },
  {
    slug: 'food-cost-calculator',
    title: 'Food Cost Percentage Calculator — Actual Food Cost from Inventory',
    shortTitle: 'Food Cost Calculator',
    category: 'Freelance & Career',
    description:
      'Free food cost percentage calculator. Compute actual COGS from beginning inventory, purchases, and ending inventory, then food cost % against sales — the number restaurants live by.',
    tagline: 'COGS ÷ sales — the number restaurants live by.',
    intro:
      'Theoretical food cost comes off your menu cards; actual food cost comes off your shelves. This calculator computes the actual number the way your accountant does — beginning inventory plus purchases minus ending inventory, divided by food sales — so you can see the gap between what dishes should cost and what the kitchen actually consumed.',
    howItWorks: [
      'Count or pull beginning inventory for the period (week or month).',
      'Add all food purchases for the period, then subtract ending inventory.',
      'Enter food sales for the same period.',
      'Read COGS, food cost %, and gross profit — then compare against your theoretical cost to find the leak.',
    ],
    faq: [
      {
        q: 'What is a good food cost percentage?',
        a: 'Most full-service restaurants target 28–35%; quick-service often runs 25–30%. Fine dining can run higher because labor runs lower. What matters most is consistency — a food cost that jumps 3 points in a month means waste, theft, portion drift, or a supplier price increase you missed.',
      },
      {
        q: 'Why is my actual food cost higher than my menu-card cost?',
        a: 'Theoretical cost assumes every ounce sold perfectly. Actual cost includes waste, spoilage, over-portioning, staff meals, comps, and theft. A gap of 2–4 points is normal; beyond that, count inventory more often and watch portioning on your five highest-cost proteins.',
      },
      {
        q: 'How often should I calculate food cost?',
        a: 'Weekly if you can. Monthly is the minimum to catch problems — but a monthly number tells you about a leak four weeks after it started. High-volume operations count key items daily and full inventory weekly.',
      },
    ],
  },
  {
    slug: 'plate-cost-calculator',
    title: 'Plate Cost Calculator — Menu Pricing from Ingredient Cost',
    shortTitle: 'Plate Cost Calculator',
    category: 'Freelance & Career',
    description:
      'Free plate cost calculator for menu pricing. Enter ingredient cost per plate and your target food cost % to get the menu price, a psychological price point, and margin per plate and month.',
    tagline: 'Price the dish from the plate up.',
    intro:
      'Menu price = plate cost ÷ target food cost percentage. This calculator does that division honestly — including the little ingredients most people forget — then shows the margin each cover contributes, at both the exact target price and a rounded psychological price point, so you can see what the dish earns per month.',
    howItWorks: [
      'Enter the true ingredient cost per plate: protein, starch, vegetables, sauce, garnish, oil, breading — everything on the plate.',
      'Set your target food cost % (30% is a common full-service target).',
      'Read the target menu price, the .95 price-point version, and margin per plate.',
      'Add covers per month to see what the dish contributes to overhead and profit.',
    ],
    faq: [
      {
        q: 'How do I price a menu item from its cost?',
        a: 'Divide the plate cost by your target food cost percentage. A $4.20 plate at a 30% target prices at $14.00. Never price by multiplying competitors\' prices or gut feel — your cost structure is yours alone.',
      },
      {
        q: 'What ingredients do people forget when costing a plate?',
        a: 'Oil, butter, breading, spices, garnishes, sauce components, and the freebies — bread, chips, butter pats. These commonly add $0.50–$1.50 to a plate. Also fryer oil turnover and 5–10% cooking loss on proteins that shrink.',
      },
      {
        q: 'Should every dish hit the same food cost %?',
        a: 'No — mix matters. High-margin pasta dishes can run 20% to subsidize a 40% steak that sells the table. Manage the blended food cost across the menu, not each plate in isolation, and use this calculator on your ten best sellers first.',
      },
    ],
  },
  {
    slug: 'prime-cost-calculator',
    title: 'Prime Cost Calculator — COGS + Labor as a Percentage of Sales',
    shortTitle: 'Prime Cost Calculator',
    category: 'Freelance & Career',
    description:
      'Free prime cost calculator for restaurants. Combine food and beverage COGS with total labor and see prime cost as % of sales against the 60–65% benchmark.',
    tagline: 'The two costs you control daily.',
    intro:
      'Prime cost — cost of goods sold plus total labor — is the single best health metric for a restaurant, because it covers the two expenses management actually controls day to day. This calculator combines your food and beverage COGS with fully-loaded labor (wages, payroll taxes, benefits) and scores the result against industry benchmarks.',
    howItWorks: [
      'Enter food COGS and beverage COGS for the period (from the food cost calculator or your P&L).',
      'Enter total labor including payroll taxes and benefits, not just gross wages.',
      'Enter total sales for the same period.',
      'Read prime cost %, the COGS and labor splits, and what is left for rent, utilities, and profit.',
    ],
    faq: [
      {
        q: 'What is a good prime cost for a restaurant?',
        a: 'The classic benchmark is 60–65% of sales for full-service restaurants; profitable quick-service operations often run 55–60%. Above 65% there is rarely enough left for occupancy costs, utilities, and profit — at 62% prime on $55,000 of sales, $21,000 covers everything else.',
      },
      {
        q: 'Should labor include payroll taxes and benefits?',
        a: 'Yes. Labor is fully loaded: wages, employer payroll taxes, workers\' comp, benefits, and staff meals. Using gross wages alone understates labor by roughly 15–25% and makes prime cost look healthier than it is.',
      },
      {
        q: 'Which lever matters more — COGS or labor?',
        a: 'Whichever is further from its benchmark. Food cost problems respond to portioning, waste tracking, and menu engineering; labor problems respond to scheduling against forecast sales, not habit. Fix the bigger gap first — one point of prime cost on $55,000 of monthly sales is $550 a month.',
      },
    ],
  },
  {
    slug: 'pour-cost-calculator',
    title: 'Pour Cost Calculator — Bar Profit per Bottle',
    shortTitle: 'Pour Cost Calculator',
    category: 'Freelance & Career',
    description:
      'Free pour cost calculator for bars and restaurants. See pours per bottle, cost per pour, pour cost %, and gross profit per bottle for any spirit, wine, or beer.',
    tagline: 'What does that bottle really earn?',
    intro:
      'Bar math is where restaurant margins are made: a $24 bottle of spirits pouring $12 drinks earns more gross profit than most entrees. This calculator converts bottle size and pour size into pours per bottle (full pours only — the remainder is spillage), then shows cost per pour, pour cost %, and profit per bottle.',
    howItWorks: [
      'Enter the bottle cost and select the bottle size (750 ml, 1 L, or 1.75 L).',
      'Select your pour size — 1.5 oz is the standard spirits pour.',
      'Enter the drink price.',
      'Read pours per bottle, cost per pour, pour cost %, and gross profit per bottle.',
    ],
    faq: [
      {
        q: 'What is a good pour cost?',
        a: 'Bars typically target 18–24% pour cost on liquor, around 25% on wine by the glass, and 20–30% on draft beer. A $24 bottle of vodka pouring 16 one-and-a-half-ounce drinks at $12 each runs a 12.5% pour cost — premium pricing headroom most kitchens can only envy.',
      },
      {
        q: 'How many pours are in a 750 ml bottle?',
        a: 'A 750 ml bottle holds 25.4 oz, so sixteen full 1.5-oz pours with a little left over — the leftover plus spillage is why smart operators count full pours only. At 1-oz pours it is 25; at 2-oz pours, 12.',
      },
      {
        q: 'Why is my bar\'s actual pour cost higher than the math?',
        a: 'Over-pouring, unrecorded comps and spill tabs, bartender giveaways, and theft. A half-ounce over-pour on a 1.5-oz spec is a 33% cost increase on that drink. Measure actual pour cost monthly the same way as food cost: (beginning inventory + purchases − ending inventory) ÷ bar sales.',
      },
    ],
  },
  {
    slug: 'trainer-rate-calculator',
    title: 'Personal Trainer Rate Calculator — What to Charge Per Session',
    shortTitle: 'Trainer Rate Calculator',
    category: 'Fitness & Sports',
    description:
      'Free personal trainer rate calculator. Work backwards from your income goal, business costs, and real session capacity to the rate you must charge per session.',
    tagline: 'The rate is the business plan.',
    intro:
      'Most trainers pick a rate by looking at the trainer down the street. This calculator builds it from your own numbers: take-home goal plus business costs, divided by the sessions you can actually deliver in a year (not 52 fantasy weeks — real ones, with vacations and January cancellations). The answer is the minimum rate that makes the business work.',
    howItWorks: [
      'Enter your annual take-home income goal and your annual business costs (gym rent split, insurance, software, equipment).',
      'Enter sessions per week and honest working weeks per year — 44 to 48 for most trainers.',
      'Read the required rate per session and the monthly revenue target behind it.',
    ],
    faq: [
      {
        q: 'What do personal trainers charge per session?',
        a: 'Rates vary widely by market — roughly $40–$75 in smaller markets, $75–$150+ in major metros, and more for specialists. But the right question is what YOU must charge: an $80k goal with $12k of costs over 1,150 sessions a year requires $80 per session, full stop.',
      },
      {
        q: 'Why use 46 working weeks instead of 52?',
        a: 'Because you will not bill 52 weeks. Vacation, holidays, sick days, client travel, and the attendance dip after New Year\'s motivation fades all cut capacity. Planning on 46 weeks is still optimistic for many trainers — 44 is safer for a first plan.',
      },
      {
        q: 'What if the required rate is above my market?',
        a: 'Three levers: more sessions per week (limited by your energy), semi-private training (2–4 clients split the slot — the classic move), or online/hybrid clients who add revenue without adding gym hours. Lowering the income goal is the fourth lever, but know you are pulling it.',
      },
    ],
  },
  {
    slug: 'session-package-calculator',
    title: 'Session Package Calculator — Bundle Pricing for Trainers',
    shortTitle: 'Session Package Calculator',
    category: 'Fitness & Sports',
    description:
      'Free session package calculator for personal trainers. Price multi-session bundles with a discount, see the effective per-session rate, what the client saves, and monthly revenue per client.',
    tagline: 'Cash up front, commitment built in.',
    intro:
      'Packages are how trainers stabilize lumpy income: the client prepays ten sessions, you get cash flow and a booked calendar, and the discount buys commitment that drop-in pricing never earns. This calculator prices the bundle, shows the effective per-session rate you are really earning, and converts one package client into monthly revenue.',
    howItWorks: [
      'Enter your single-session rate.',
      'Set the package size (10 sessions is the industry standard) and the discount.',
      'Read the package price, effective rate per session, and what the client saves.',
      'Use the monthly revenue figure to see what each package client is worth at two sessions a week.',
    ],
    faq: [
      {
        q: 'How much should I discount a session package?',
        a: 'Five to fifteen percent is the common band. A 10-pack at 10% off an $80 rate prices at $720 — you trade $80 of rate for $720 of prepaid commitment. Deeper than 15% and you are discounting for clients who would have paid full price.',
      },
      {
        q: 'Should packages expire?',
        a: 'Yes — a 3–6 month expiry protects you from selling sessions at today\'s rate that get redeemed years later at tomorrow\'s prices, and it creates urgency that keeps clients training. Check your state\'s gift-card and prepaid-service laws; some regulate expiry on prepaid services.',
      },
      {
        q: 'Packages or monthly memberships?',
        a: 'Packages suit clients with irregular schedules; memberships (e.g., 8 sessions/month, use them or lose them) suit consistent clients and give you the most predictable revenue. Many trainers offer both and let the client self-select — run both through this calculator to see the effective rates you are really offering.',
      },
    ],
  },
  {
    slug: 'client-capacity-calculator',
    title: 'Client Capacity Calculator — How Many Clients Can a Trainer Carry?',
    shortTitle: 'Client Capacity Calculator',
    category: 'Fitness & Sports',
    description:
      'Free client capacity calculator for personal trainers. Convert working hours, session length, and utilization into max clients, weekly sessions, and annual revenue at capacity.',
    tagline: 'Your schedule has a ceiling — find it.',
    intro:
      'A trainer\'s income is capped by arithmetic: working minutes divided by session-plus-buffer gives the slots; honest utilization gives the sessions; sessions per client per week gives the client count. This calculator runs that chain and prices the result, so you know exactly when it is time to raise rates, go semi-private, or add online clients.',
    howItWorks: [
      'Enter working hours per week, session length, and the buffer between sessions.',
      'Set a realistic utilization (75% is honest — no-shows and admin eat slots) and sessions per client per week.',
      'Read your session slots, bookable sessions, client ceiling, and weekly/annual revenue at capacity.',
    ],
    faq: [
      {
        q: 'How many clients can a full-time personal trainer handle?',
        a: 'Typically 15–30 active clients. Forty working hours with 75-minute slots is 32 slots; at a realistic 75% utilization that is 24 sessions a week — 12 clients at twice a week, or 24 at once a week. Anyone claiming 50 weekly one-on-one clients is either running 30-minute sessions or counting ghosts.',
      },
      {
        q: 'What is a realistic utilization rate?',
        a: 'Seventy to eighty percent for an established trainer. New trainers run far lower; waitlisted trainers can approach 90% in peak hours. Prime-time slots (6–9am, 5–8pm) fill first — mid-day utilization is where capacity dies.',
      },
      {
        q: 'How do I grow past the capacity ceiling?',
        a: 'Raise rates (demand exceeds supply — that is what a waitlist means), switch some slots to semi-private (2–4 clients each paying 60–70% of solo rate multiplies slot revenue), or add online programming clients who consume no gym slots. All three beat adding hours.',
      },
    ],
  },
  {
    slug: 'lawn-care-pricing-calculator',
    title: 'Lawn Care Pricing Calculator — What to Charge Per Mow',
    shortTitle: 'Lawn Pricing Calculator',
    category: 'Freelance & Career',
    description:
      'Free lawn care pricing calculator. Turn mowable square footage, obstacles, and visit frequency into a defensible per-visit price, plus monthly and seasonal revenue per client.',
    tagline: 'Price the lawn, not the neighbor\'s guess.',
    intro:
      'Lawn pricing is a time estimate wearing a price tag. This calculator converts mowable square footage, obstacle count, and visit frequency into minutes on site, then prices those minutes at your target hourly rate — with growth surcharges for biweekly and monthly lawns that take longer per cut. The output is a per-visit price you can defend, plus what that client is worth per month and per season.',
    howItWorks: [
      'Measure or estimate the mowable area in square feet (lot size minus house, beds, and driveway).',
      'Count obstacles — trees, beds, fence lines, playsets — each one costs trimming time.',
      'Pick the visit frequency and set your target hourly rate (which must cover labor, fuel, and equipment).',
      'Read the per-visit price, monthly value, and seasonal value of the client.',
    ],
    faq: [
      {
        q: 'What should I charge to mow a lawn?',
        a: 'Build it from time, not vibes. An 8,000 sq ft lawn with 5 obstacles is about 34 minutes on site; at a $70/hr target that is roughly $40 weekly, $50 biweekly. National averages ($30–$60 per visit) hide huge variation — your rate has to cover YOUR labor, fuel, equipment wear, insurance, and drive time.',
      },
      {
        q: 'Should biweekly lawns cost the same as weekly?',
        a: 'No — charge 20–30% more per cut. The grass is twice as tall, the mower slows down, and sometimes it takes two passes. Monthly lawns need 50–60% more per visit. Clients pay for total grass removed, not for your calendar.',
      },
      {
        q: 'How do I estimate square footage without measuring?',
        a: 'County assessor and GIS sites list lot size for any address; subtract the house footprint, driveway, and beds. Or pace it off on the first visit (a long stride is about 3 feet) and write it in the client record so every future quote on that property is instant.',
      },
    ],
  },
  {
    slug: 'lawn-revenue-planner',
    title: 'Lawn Care Revenue Planner — Season Income from Mowing Contracts',
    shortTitle: 'Lawn Revenue Planner',
    category: 'Freelance & Career',
    description:
      'Free lawn care revenue planner. Convert client count, price per visit, and season length into season revenue, direct costs, upsell income, and monthly net — the whole season on one screen.',
    tagline: 'The client count IS the business plan.',
    intro:
      'A mowing business is multiplication: clients × price × visits. This planner runs that math for a full season, subtracts direct per-visit costs, adds the upsell revenue (mulch, cleanups, aeration) that good route density makes possible, and shows what the season is worth per month — so you know in March what the year looks like.',
    howItWorks: [
      'Enter your recurring client count and average price per visit.',
      'Set visits per season (about 30 for weekly service, April through October, in most of the US).',
      'Add your direct cost per visit and an upsell percentage.',
      'Read season gross, costs, upsell revenue, net, and the monthly average.',
    ],
    faq: [
      {
        q: 'How much can a lawn care business make in a season?',
        a: 'Pure arithmetic: 40 clients at $45 per visit for 30 visits grosses $54,000, and at 15% upsells plus $8/visit direct costs, nets about $52,500 before overhead. Solo operators with dense routes often run 40–60 recurring clients; a two-person crew can carry 80–120.',
      },
      {
        q: 'Why does route density matter so much?',
        a: 'Because drive time is unpaid. Two adjacent lawns share one stop; two lawns across town cost twenty minutes of windshield time each. A tight route of 40 clients can out-earn a scattered route of 55. Discount for referrals next door, never across town.',
      },
      {
        q: 'What upsells should a mowing business push?',
        a: 'Spring and fall cleanups, mulch installs (use the mulch calculator for the quote), aeration and overseeding in the fall, and shrub trimming. Upsells typically add 10–20% on top of mowing revenue and carry better margins because the crew is already on site.',
      },
    ],
  },
  {
    slug: 'snow-removal-bid-calculator',
    title: 'Snow Removal Bid Calculator — Per-Push and Seasonal Contract Pricing',
    shortTitle: 'Snow Removal Bid Calculator',
    category: 'Freelance & Career',
    description:
      'Free snow removal bid calculator. Price per-push residential and seasonal contracts from driveway size, depth trigger, and your hourly rate — with the seasonal discount math built in.',
    tagline: 'Price the push, then price the season.',
    intro:
      'Snow bids fail when they ignore depth: six inches of wet snow is not two three-inch pushes. This calculator models time on site from area and depth trigger, prices a single push at your hourly rate, then converts it into a seasonal contract with the standard discount — so you can quote both on the spot.',
    howItWorks: [
      'Enter the driveway or lot area in square feet and the snow depth trigger.',
      'Set your hourly rate (plow truck rates run higher than mowing rates — the equipment costs more).',
      'Enter the average pushes per season for your area.',
      'Read the per-push price and the seasonal contract price with the built-in 15% discount.',
    ],
    faq: [
      {
        q: 'Per-push or seasonal contract — which is better?',
        a: 'Seasonal contracts win in light winters and lose in heavy ones — they are insurance for the client and a bet for you. Per-push pricing carries no risk but no guarantee. Most contractors blend: seasonal contracts for predictable base revenue, per-push for overflow. Price per-push about 15–20% above the seasonal rate to reflect the risk.',
      },
      {
        q: 'What do snow removal services charge?',
        a: 'Residential driveways commonly run $30–$70 per push depending on size, depth, and region; seasonal contracts for a standard driveway often run $300–$800. Commercial lots price by the acre or by the hour. Your rate must carry truck, plow wear, insurance, and the fact that you work at 4am in a storm.',
      },
      {
        q: 'How does depth change the price?',
        a: 'Directly: deep snow is slower per pass, may need two passes, and wet snow is heavier on the equipment. That is why this model adds time per inch of depth — and why contracts specify a trigger (service starts at 2 or 3 inches) and often a surcharge past 12 inches.',
      },
    ],
  },
  {
    slug: 'gig-driver-hourly-calculator',
    title: 'Gig Driver True Hourly Calculator — Earnings After Gas & Wear',
    shortTitle: 'True Hourly (Gig)',
    category: 'Freelance & Career',
    description:
      'Free true hourly calculator for Uber, Lyft, DoorDash and delivery drivers. Subtract fuel and vehicle wear from gross earnings to see your real per-hour pay.',
    tagline: 'The app shows earnings. This shows what you kept.',
    intro:
      'Gig apps report gross earnings against active time, which flatters the number on both ends. This calculator counts every hour online and every mile driven, subtracts fuel and a per-mile wear allowance (oil, tires, brakes, depreciation), and shows the hourly rate you actually earned — the only number worth comparing to a job.',
    howItWorks: [
      'Enter gross earnings for the shift or week, including tips.',
      'Enter ALL hours online (waiting counts) and ALL miles driven (deadhead miles to pickups count).',
      'Add your MPG, local gas price, and a wear-per-mile figure (10–20¢ for an economy car).',
      'Read fuel cost, wear cost, net earnings, and your true hourly rate.',
    ],
    faq: [
      {
        q: 'What do gig drivers really make per hour?',
        a: 'Studies and driver logs consistently put gross app pay at $20–30/hr in busy metros, but after fuel and vehicle costs the true figure often lands at $12–18/hr — before self-employment tax. A $250 day over 12 hours and 180 miles nets about $16.76/hr after $49 of vehicle costs.',
      },
      {
        q: 'What should I count as vehicle cost per mile?',
        a: 'Fuel is obvious; the silent cost is wear — oil, tires, brakes, and depreciation. AAA-style estimates put total operating cost at 30–60¢/mile depending on the vehicle; a frugal economy car with cheap gas can run 20–30¢. The IRS standard mileage rate (76¢/mile from July 2026) bundles everything, which is why the tax deduction usually exceeds what you feel going out of pocket.',
      },
      {
        q: 'Should I count waiting time as hours worked?',
        a: 'Yes. If you are online and unable to do anything else, that is work time. Apps define "active time" narrowly because it raises the displayed hourly rate. Your bank account does not care about the distinction — neither should your math.',
      },
    ],
  },
  {
    slug: 'mileage-deduction-calculator',
    title: 'Mileage Deduction Calculator — 2026 IRS Rates (Split Year)',
    shortTitle: 'Mileage Deduction',
    category: 'Freelance & Career',
    description:
      'Free 2026 mileage deduction calculator with the correct split-year IRS rates: 72.5¢/mi Jan–Jun and 76¢/mi Jul–Dec. See your deduction and estimated tax savings.',
    tagline: '2026 has two rates. This handles both.',
    intro:
      'The IRS raised the business mileage rate mid-year in 2026 — 72.5¢ through June 30, then 76¢ from July 1 (Notice 2026-10, modified by Announcement 2026-11). Running the whole year at one rate gets the math wrong in both directions. This calculator applies the correct rate to each half and estimates what the deduction saves you in income tax and self-employment tax.',
    howItWorks: [
      'Enter business miles driven January through June 2026.',
      'Enter business miles driven July through December 2026.',
      'Pick your marginal income tax bracket.',
      'Read the deduction per period, the total, and the estimated tax savings.',
    ],
    faq: [
      {
        q: 'What is the IRS mileage rate for 2026?',
        a: 'Two rates: 72.5¢ per business mile from January 1 to June 30, and 76¢ per mile from July 1 to December 31. The IRS raised the rate mid-year (Announcement 2026-11) citing fuel prices — the first mid-year adjustment in years. Charitable miles stay at 14¢; medical/moving went to 23.5¢ in the second half.',
      },
      {
        q: 'How much is the mileage deduction worth in tax savings?',
        a: 'For a self-employed driver in the 22% bracket, roughly 36¢ per deducted dollar: the deduction cuts income tax at 22% and self-employment tax at about 14.1% (15.3% applied to the 92.35% SE base). A 20,000-mile year deducts about $14,900 and saves around $5,400 in tax.',
      },
      {
        q: 'Do I need records to claim mileage?',
        a: 'Yes — a contemporaneous mileage log with date, miles, and business purpose. Reconstructed logs are the first thing audits kill. Apps that auto-track trips satisfy this; a notebook works too. Also remember: parking and tolls are deductible separately, on top of the standard rate.',
      },
    ],
  },
  {
    slug: 'delivery-offer-calculator',
    title: 'Delivery Offer Calculator — Should You Accept This Order?',
    shortTitle: 'Delivery Offer Calculator',
    category: 'Freelance & Career',
    description:
      'Free delivery offer calculator. Score any DoorDash, Uber Eats, or Instacart offer by dollars per mile and net per hour after fuel and wear — with an accept/decline verdict.',
    tagline: 'Five seconds of math before you tap accept.',
    intro:
      'Veteran drivers screen every offer on dollars per mile — $1.50 or better is the common accept line — because payout without distance is meaningless. This calculator scores an offer on payout per mile AND net per hour after fuel and vehicle wear, then gives a plain accept/borderline/decline verdict you can act on in the seconds before the timer runs out.',
    howItWorks: [
      'Enter the offer payout (including any shown tip).',
      'Enter total miles — the drive to the pickup counts too — and estimated minutes.',
      'Set your vehicle MPG, gas price, and wear per mile once; they persist between offers.',
      'Read cost, net profit, payout per mile, net per hour, and the verdict.',
    ],
    faq: [
      {
        q: 'What is a good dollars-per-mile for delivery offers?',
        a: 'The community rule of thumb is $1.50+ per mile gross as the accept line, $1.00–$1.50 is borderline (take it only if it routes you home or toward a hot zone), and under $1.00 pays you less than your car costs to run long-term. A $9.50 offer over 6.5 miles is $1.46/mile — borderline — and nets about $7.74 after vehicle costs.',
      },
      {
        q: 'Why count the miles to the pickup?',
        a: 'Because the app pays neither gas nor time for them. A 2-mile drive to the restaurant on a 4-mile delivery makes it a 6-mile trip on your odometer and your maintenance schedule. Drivers who count only the delivery leg overestimate their per-mile pay by a third or more.',
      },
      {
        q: 'Is declining offers penalized?',
        a: 'It depends on the platform and market. Acceptance rate affects priority access on some apps, but cherry-picking profitable offers almost always beats a high acceptance rate full of $3 base-pay runs. Do the per-offer math — the algorithm optimizes for the platform, not for you.',
      },
    ],
  },
  {
    slug: 'nurse-shift-pay-calculator',
    title: 'Nurse Shift Pay Calculator — Differentials & Overtime Stacked',
    shortTitle: 'Nurse Shift Pay',
    category: 'Freelance & Career',
    description:
      'Free nurse shift pay calculator. Stack base hours, night differential %, and 1.5× overtime to see true weekly and annual gross — and what the extras are worth alone.',
    tagline: 'The differential is a raise hiding in plain sight.',
    intro:
      'Nursing pay is never just the base rate: night differentials, weekend premiums, and overtime stack into a number the job posting never mentions. This calculator stacks them properly — day hours at base, night hours with the differential, OT at time-and-a-half — and annualizes the result, so you can compare offers, units, and schedules on real money.',
    howItWorks: [
      'Enter your base hourly rate.',
      'Split your weekly hours between day and night shifts, and enter the night differential %.',
      'Add typical weekly overtime hours (paid at 1.5×).',
      'Read weekly and annualized gross, plus what the differential and OT premium each add per year.',
    ],
    faq: [
      {
        q: 'How much is a night shift differential worth?',
        a: 'A 12% differential on a $38 base adds $4.56 per night hour — 12 night hours a week is $2,845 a year over working straight days. Weekend and charge-nurse differentials stack on top at most facilities. When comparing offers, always compare rate × your actual shift mix, not the posted base.',
      },
      {
        q: 'How is overtime calculated for nurses?',
        a: 'Federal law (FLSA) requires 1.5× your regular rate past 40 hours in a week; some states (like California) also require OT past 8 or 12 hours in a day. The "regular rate" includes shift differentials in the OT base — this calculator applies the differential first, then OT on top, which matches how payroll computes it.',
      },
      {
        q: 'Is picking up extra shifts worth it?',
        a: 'Run it both ways. An extra 4 OT hours a week at $38 base adds $228/week or about $11,856/year gross — but only the $76/week OT premium is the "extra" over picking up straight-time hours. Check your true hourly on the extra shifts and weigh it against burnout; the annualized figure is the honest one.',
      },
    ],
  },
  {
    slug: 'teacher-pay-calculator',
    title: 'Teacher Pay Calculator — Step, Lane & 10 vs 12-Month Paychecks',
    shortTitle: 'Teacher Pay Calculator',
    category: 'Freelance & Career',
    description:
      'Free teacher salary calculator. Project salary growth through steps and lane changes, and compare 10-month vs 12-month paycheck schedules with the set-aside you need.',
    tagline: 'Steps compound. Lanes multiply. Plan both.',
    intro:
      'Teacher salaries are a grid: steps move you down (annual increases), lanes move you across (degree and credit bumps). This calculator projects your salary to any year with both movements, then shows what that salary means per paycheck on a 10-month versus 12-month schedule — including exactly what to set aside each check if you are paid over 10 months.',
    howItWorks: [
      'Enter your year-1 salary and the annual step increase %.',
      'Add a lane-change bump % and the year it takes effect (e.g., finishing a master\'s in year 5).',
      'Pick the projection year.',
      'Read the salary, total growth, and per-check amounts on both pay schedules.',
    ],
    faq: [
      {
        q: 'How do teacher salary steps and lanes work?',
        a: 'Steps are annual raises for each year of service (often 1.5–3%); lanes are jumps for education credits or degrees (commonly 3–8%). They compound: a 5% lane bump increases every future step\'s value. A $48,000 start with 2% steps and a 5% lane at year 5 reaches about $60,233 by year 10.',
      },
      {
        q: 'Should I take 10-month or 12-month pay?',
        a: 'Same money, different timing. 10-month checks are bigger ($6,023 vs $5,019 on a $60,233 salary) but June and August pay nothing. If you choose 10-month, set aside the difference — about $1,004 per check — into a summer account. Disciplined savers can even earn interest on the set-aside; everyone else should take the 12-month spread.',
      },
      {
        q: 'What is the fastest way to raise a teacher salary?',
        a: 'Lane changes, by far. A master\'s degree or credit threshold often adds 5%+ permanently and compounds with every step after it. Run the degree cost against the projected salary difference here — most lane changes pay back within a few years and keep paying for a career.',
      },
    ],
  },
  {
    slug: 'truck-driver-pay-calculator',
    title: 'Truck Driver Pay Calculator — CPM to Real Hourly & Annual Pay',
    shortTitle: 'Truck Driver Pay',
    category: 'Freelance & Career',
    description:
      'Free truck driver pay calculator. Convert cents-per-mile into weekly, monthly, and annual gross — and the honest per-on-duty-hour rate after docks, traffic, and inspections.',
    tagline: 'CPM pays the miles. You live the hours.',
    intro:
      'Cents-per-mile sounds simple until you divide by the hours you actually gave. This calculator converts CPM into weekly and annual gross, then divides by your real on-duty hours — driving, docks, fueling, inspections — to show the effective hourly rate, the only honest way to compare OTR pay to a local hourly job.',
    howItWorks: [
      'Enter your pay per mile (CPM) and average miles per week.',
      'Set working weeks per year — 46 to 48 after home time, not 52.',
      'Enter your real on-duty hours per week (the 70-hour rule is the ceiling; most run 60–70).',
      'Read weekly gross, annual gross, monthly average, and dollars per on-duty hour.',
    ],
    faq: [
      {
        q: 'How much do truck drivers make per mile?',
        a: 'Company OTR drivers commonly see 50–70¢ per mile depending on experience, freight type, and carrier; specialized and team driving runs higher. At 58¢ and 2,500 miles a week, that is $1,450/week or about $69,600 over 48 working weeks.',
      },
      {
        q: 'Why does my CPM pay feel low per hour?',
        a: 'Because CPM only pays rolling miles. 2,500 miles in a 65-hour on-duty week is 38.5 effective mph — so 58¢/mile equals $22.31 per on-duty hour. Every unpaid dock delay, inspection, and traffic jam drags the hourly rate down. That is why detention pay and drop-pay matter more than a penny of CPM.',
      },
      {
        q: 'CPM or percentage-of-load or salary — which is best?',
        a: 'Convert each to per-on-duty-hour and compare. Percentage pay wins in strong rate markets and loses in weak ones; salary is predictable but caps upside. Owner-operators should run the truck\'s true cost per mile (fuel, maintenance, insurance, truck payment) before celebrating any linehaul rate.',
      },
    ],
  },
  {
    slug: 'self-employment-tax-calculator',
    title: 'Self-Employment Tax Calculator — 2026 SE Tax on 1099 Income',
    shortTitle: 'Self-Employment Tax',
    category: 'Freelance & Career',
    description:
      'Free self-employment tax calculator for 2026. Compute the 15.3% SE tax on net profit with the 92.35% base and the $184,500 Social Security cap — plus the employer-half deduction.',
    tagline: 'The 15.3% surprise, computed before it surprises you.',
    intro:
      'The first year of freelancing comes with a shock: self-employment tax, both halves of Social Security and Medicare, charged on 92.35% of your net profit. This calculator breaks it into the Social Security part (capped at the 2026 wage base of $184,500), the Medicare part (uncapped), the total, and the employer-half deduction that reduces your income tax.',
    howItWorks: [
      'Enter your expected net self-employment profit (revenue minus business expenses — the Schedule C bottom line).',
      'Read the SE-taxable earnings (92.35% of profit), the Social Security and Medicare parts, and the total.',
      'Note the employer-half deduction — half of SE tax comes off your income before income tax is computed.',
    ],
    faq: [
      {
        q: 'How much is self-employment tax in 2026?',
        a: '15.3% of 92.35% of net profit — an effective 14.13% on profit under the Social Security cap. On $90,000 of profit that is $12,716.60: $10,306.26 Social Security (12.4%) and $2,410.34 Medicare (2.9%). Above $184,500 the Social Security part stops and only Medicare (plus a 0.9% surtax over $200k/$250k) continues.',
      },
      {
        q: 'Why 92.35% of profit?',
        a: 'Employees pay 7.65% and employers pay 7.65%; the self-employed pay both. To equalize, the IRS lets you compute SE tax on 92.35% of profit (100% minus the 7.65% employer share) — then also deduct half the SE tax from income. The two adjustments roughly mirror what an employer would have paid and deducted.',
      },
      {
        q: 'How do I reduce self-employment tax legally?',
        a: 'Business expenses reduce the profit it is charged on — every legitimate deduction saves 14.13% in SE tax plus income tax. At higher incomes, an S-corp election splits income into salary (SE-taxed) and distributions (not), though it adds payroll costs and a reasonable-salary requirement. Retirement contributions (SEP-IRA, Solo 401k) cut income tax but not SE tax.',
      },
    ],
  },
  {
    slug: 'quarterly-estimated-tax-calculator',
    title: 'Quarterly Estimated Tax Calculator — 2026 Federal Payments',
    shortTitle: 'Quarterly Estimated Tax',
    category: 'Freelance & Career',
    description:
      'Free quarterly estimated tax calculator for freelancers. Combines 2026 federal brackets, self-employment tax, and the safe-harbor rule into the payment due each quarter.',
    tagline: 'Four payments a year. Zero April panic.',
    intro:
      'Freelancers owe taxes as they earn, not in April — the IRS expects four estimated payments, and underpaying costs penalties even if you pay in full at filing. This calculator combines self-employment tax and income tax (2026 brackets, standard deduction, and the SE-tax deduction built in) into a quarterly payment, and shows the safe-harbor alternative based on last year\'s tax.',
    howItWorks: [
      'Enter expected self-employment profit and any other taxable income for the year.',
      'Pick your filing status (2026 standard deduction applied automatically).',
      'Enter last year\'s total tax for the safe-harbor comparison.',
      'Read the quarterly payment and the safe-harbor amount — pay the smaller of the two if last year\'s return covered 12 months.',
    ],
    faq: [
      {
        q: 'How much should I pay quarterly as a freelancer?',
        a: 'On $90,000 of profit filing single in 2026: SE tax is $12,716.60, income tax after the standard deduction and half-SE deduction is $9,571.17, total $22,287.77 — about $5,571.94 per quarter. If last year\'s total tax was lower, the safe-harbor rule (100% of prior-year tax, 110% over $150k AGI) may let you pay less without penalty.',
      },
      {
        q: 'When are quarterly estimated taxes due?',
        a: 'April 15, June 15, September 15, and January 15 of the following year. Note the quarters are uneven — the June payment covers only April and May. Pay via IRS Direct Pay or EFTPS; keep confirmation numbers.',
      },
      {
        q: 'What happens if I underpay my quarterly estimates?',
        a: 'The IRS charges an underpayment penalty (interest at the federal short-term rate plus 3 points) for each quarter you were short — even if you pay everything by April. The safe-harbor rule is the escape hatch: 100% (or 110%) of last year\'s tax, paid evenly, avoids the penalty regardless of this year\'s bill.',
      },
    ],
  },
  {
    slug: 'invoice-late-fee-calculator',
    title: 'Invoice Late Fee Calculator — Late Payment Interest & Total Due',
    shortTitle: 'Invoice Late Fee',
    category: 'Freelance & Career',
    description:
      'Free invoice late fee calculator. Compute late payment interest by days past due and monthly rate, the total now due, and the equivalent APR.',
    tagline: 'Net-30 is a suggestion until you price the alternative.',
    intro:
      'A late fee clause turns "I\'ll pay you Friday" into a cost the client can see. This calculator computes the accrued fee from invoice amount, days past due, and your contracted monthly rate — plus the equivalent APR, so you can check the charge against your state\'s usury limits before it goes on an invoice.',
    howItWorks: [
      'Enter the invoice amount and days past due.',
      'Enter the monthly late fee rate from your contract (1.5%/month is the common standard).',
      'Read the accrued fee, total due, and the equivalent APR.',
    ],
    faq: [
      {
        q: 'How much can I charge for late invoice payments?',
        a: '1–1.5% per month (12–18% APR) is the common commercial standard, but state usury laws cap it — ranging from about 6% to 18%+ APR depending on the state and whether the client is a business. The fee must be in the signed contract or terms accepted before work began; adding it after the fact rarely holds up.',
      },
      {
        q: 'Is a late fee worth enforcing with a good client?',
        a: 'Usually not the first time — the clause exists to change behavior, not to farm fees. Enforce it consistently for chronically late payers, waive it once for good clients with a reason, and always show the math (this calculator\'s total-due figure) in the reminder email. Visible arithmetic gets invoices paid faster than threats.',
      },
      {
        q: 'Late fee or early-payment discount?',
        a: 'Discounts outperform fees for cash flow. A 2% discount for payment within 10 days ("2/10 net 30") costs you less than the average late fee you would collect and gets money in weeks earlier. Offer both: the discount as the carrot, the fee clause as the stick.',
      },
    ],
  },
  {
    slug: 'billable-hours-calculator',
    title: 'Billable Hours Calculator — Hours Needed to Hit an Income Goal',
    shortTitle: 'Billable Hours',
    category: 'Freelance & Career',
    description:
      'Free billable hours calculator. Compute the billable hours required to hit a revenue goal at your hourly rate, compare against realistic capacity, and see weekly pace.',
    tagline: 'The goal is not the rate — it is the hours you can actually sell.',
    intro:
      'A $300,000 year at $250/hour means 1,200 billable hours — but at a realistic 70% utilization a 40-hour week only yields 1,344 of them. This calculator works out the required hours, compares them against your true capacity, and shows the weekly pace you must hold — before you promise anyone the number.',
    howItWorks: [
      'Enter your annual revenue goal and hourly rate.',
      'Enter utilization (the share of worked hours you can actually bill), hours per week, and working weeks per year.',
      'Read required billable hours, your capacity, the slack or shortfall, and the weekly billing pace.',
    ],
    faq: [
      {
        q: 'What is a realistic utilization rate?',
        a: 'Law firm associates are often targeted at 1,800–2,000 billable hours per year, which implies 75–85% utilization of a 40-hour week — and most report working far more than 40 hours to get there. Solo consultants and freelancers typically land at 50–65%: the rest goes to sales, admin, invoicing, and marketing. Plan with 60–70% unless your numbers prove otherwise.',
      },
      {
        q: 'How many billable hours are in a year?',
        a: 'A 40-hour week for 48 weeks is 1,920 worked hours; at 70% utilization that is 1,344 billable. The BigLaw 2,000-hour standard requires roughly 2,700–3,000 total hours — which is why it is described as a lifestyle, not a schedule.',
      },
      {
        q: 'What if my capacity falls short of the goal?',
        a: 'Three levers: raise the rate, raise utilization (better admin discipline or productized services), or add leverage (junior staff, subcontractors). Cutting vacation weeks is the fourth lever, and it is the one most people quietly pull first — the calculator makes that trade visible.',
      },
    ],
  },
  {
    slug: 'realization-rate-calculator',
    title: 'Realization Rate Calculator — Billing & Collection Realization',
    shortTitle: 'Realization Rate',
    category: 'Freelance & Career',
    description:
      'Free realization rate calculator for law firms and consultants. Compute billing realization, collection realization, and total leakage from worked value to cash.',
    tagline: 'Worked value is a rumor until it is collected cash.',
    intro:
      'Professional services lose revenue in three leaks: hours worked but never billed, bills discounted before invoicing, and invoices never collected. This calculator computes billing realization, invoice realization, collection realization, and the overall rate — plus the dollar leakage — so you can see which leak is actually costing you.',
    howItWorks: [
      'Enter hours worked, hours billed, and your standard rate.',
      'Enter the amount actually invoiced and the amount collected.',
      'Read the three realization stages, overall realization, and total leakage in dollars.',
    ],
    faq: [
      {
        q: 'What is a good realization rate for a law firm?',
        a: 'Industry surveys put average billing realization around 88–91% and collection realization around 85–91%, for an overall rate near 80–84%. Elite firms hold overall realization above 90%. Below 80%, the problem is usually write-downs at billing time, not client payment behavior.',
      },
      {
        q: 'Where does revenue usually leak?',
        a: 'In order of typical size: write-downs before the invoice goes out (partners discounting to keep clients happy), unbilled time that never makes it onto a bill, and then collections. Most firms watch collections hardest while the bigger leak is the silent discount at billing.',
      },
      {
        q: 'How do I improve realization without raising rates?',
        a: 'Bill promptly (invoices sent within a week of month-end collect faster and with fewer disputes), record time daily instead of reconstructing it, scope fixed-fee work tightly, and require retainers from clients with slow-pay history. A 5-point realization gain on a $400,000 practice is $20,000 — with zero new clients.',
      },
    ],
  },
  {
    slug: 'consultant-day-rate-calculator',
    title: 'Consultant Day Rate Calculator — Price Your Independent Rate',
    shortTitle: 'Consultant Day Rate',
    category: 'Freelance & Career',
    description:
      'Free consultant day rate calculator. Convert an income goal, overhead, and realistic billable days into the day rate and hourly rate you must charge.',
    tagline: 'Your old salary is the floor of the math, not the price.',
    intro:
      'Leaving a $150,000 job to consult does not mean charging $150,000 worth of time — overhead, taxes, insurance, and unpaid bench time mean you must bill roughly $195,000 to land the same income. This calculator converts your income goal, overhead share, and realistic billable days into the day rate and hourly rate you actually need.',
    howItWorks: [
      'Enter your target take-home income and overhead percentage (tools, insurance, taxes, marketing).',
      'Enter how many days per year you can realistically bill.',
      'Read the required revenue, day rate, hourly equivalent, and weekly rate.',
    ],
    faq: [
      {
        q: 'How many billable days should I plan for?',
        a: '220 weekdays minus 15–25 days of vacation/sick time, minus business development, admin, and gaps between engagements. Most independent consultants who track it honestly land at 100–150 billable days. Planning at 200 is the classic first-year mistake.',
      },
      {
        q: 'Is day rate or hourly better?',
        a: 'Day rates sell better for project work — clients compare a $1,600 day to their loaded cost of an employee day (often $800–1,200) and it reads as reasonable, while $200/hour reads as expensive. Hourly is safer for open-ended support work where scope creep is likely. Quote days, track hours.',
      },
      {
        q: 'What overhead percentage should I use?',
        a: 'Solo consultants with no office: 25–35% covers self-employment tax, health insurance, software, accounting, and marketing. Add 10 points if you rent space or carry subcontractors. The common error is counting only visible expenses and forgetting the employer-side payroll tax you now pay yourself.',
      },
    ],
  },
  {
    slug: 'tip-pool-calculator',
    title: 'Tip Pool Calculator — Split Shared Tips by Hours & Points',
    shortTitle: 'Tip Pool Splitter',
    category: 'Freelance & Career',
    description:
      'Free tip pool calculator. Split pooled tips fairly across servers, bartenders, bussers, and hosts using hours worked and points-weighted shares.',
    tagline: 'The shift ends; the argument about the pool begins.',
    intro:
      'Points-based pools split tips by responsibility, not just presence: a server at 1.0 points working 8 hours earns twice the share of a busser at 0.5 points working the same shift. This calculator does the weighted-hours math for the whole house and shows each person\'s cut — so the split is arithmetic, not negotiation.',
    howItWorks: [
      'Enter the total tips in the pool.',
      'Enter each person\'s hours worked and points weight (1.0 for servers/bartenders, 0.5 for bussers, 0.25 for hosts — or your house system).',
      'Read the value per point-hour and each person\'s share.',
    ],
    faq: [
      {
        q: 'How do tip pools usually work?',
        a: 'Two common systems: hours-proportional (everyone shares by hours worked) and points-weighted (roles get multipliers — servers 1.0, bussers 0.5, hosts 0.25 — then shares follow hours × points). Points systems are the norm in full-service restaurants because they reflect who carries the guest experience. This calculator does points-weighted math, which degenerates to hours-proportional if everyone gets 1.0.',
      },
      {
        q: 'Who can legally be in a tip pool?',
        a: 'Under the FLSA, if the employer pays the full minimum wage (no tip credit), the pool can include back-of-house staff like cooks and dishwashers. If the employer takes a tip credit, the pool is limited to employees who customarily receive tips — managers and supervisors are always excluded. State laws can be stricter.',
      },
      {
        q: 'What keeps a pool from causing fights?',
        a: 'Written weights agreed before the shift, math visible to everyone in the pool, and a payout the same night. Most pool disputes are not about greed — they are about a split nobody could verify. Run the numbers where everyone can see them.',
      },
    ],
  },
  {
    slug: 'tip-credit-calculator',
    title: 'Tip Credit Calculator — Minimum Wage Top-Up Checker for Tipped Workers',
    shortTitle: 'Tip Credit Checker',
    category: 'Everyday Money',
    description:
      'Free tip credit calculator. Check whether your cash wage plus tips meets minimum wage, and compute the hourly and weekly top-up your employer owes if it doesn\'t.',
    tagline: 'The $2.13 wage has a catch — and it is in your favor.',
    intro:
      'When an employer pays a tipped cash wage below minimum wage, the law requires tips to close the gap — and if they don\'t, the employer must pay the difference every single pay period. This calculator checks your cash wage plus tips against the minimum and computes exactly what you\'re owed if you fall short.',
    howItWorks: [
      'Enter your state minimum wage and the cash wage on your paystub.',
      'Enter your average tips per hour and tipped hours per week.',
      'Read your effective hourly wage — or the top-up owed if cash wage plus tips falls short.',
    ],
    faq: [
      {
        q: 'What is the federal tipped minimum wage?',
        a: '$2.13/hour cash wage against the $7.25 federal minimum — a maximum tip credit of $5.12. If tips don\'t bring you to $7.25 in any workweek, the employer must pay the difference. Many states set higher floors, and California, Oregon, Washington, Nevada, Montana, Alaska, and Minnesota prohibit tip credits entirely — servers there get full state minimum wage plus tips.',
      },
      {
        q: 'Can my employer average good and bad weeks?',
        a: 'No. The top-up obligation is computed per workweek. A $300 Friday cannot legally cover a $20 Tuesday across the week boundary, and within the week the test is total cash wage plus tips divided by hours. Slow weeks trigger the top-up regardless of what you made last week.',
      },
      {
        q: 'What counts as tips for the credit?',
        a: 'Only tips you actually receive and keep after any lawful pool. Mandatory service charges auto-added to large parties are not tips under federal law unless the employer passes them to you — check whether your house treats them as commission or distributes them.',
      },
    ],
  },
  {
    slug: 'tip-income-calculator',
    title: 'Tip Income Calculator — Budget on Base Pay, Bank the Tips',
    shortTitle: 'Tip Income Budget',
    category: 'Everyday Money',
    description:
      'Free tip income calculator. See what share of your income is tips, your real annual total, and the guaranteed base-pay floor to build a budget on.',
    tagline: 'Tips are weather. Base pay is climate.',
    intro:
      'When 50–70% of your income arrives in tips, budgeting on last Friday\'s take is how rent gets missed in February. This calculator splits your income into the guaranteed base and the variable tip share — so you can build fixed bills on the floor and aim the upside at savings and debt.',
    howItWorks: [
      'Enter your base hourly wage and hours per week.',
      'Enter your average weekly tips (use an 8–12 week average, or your slow-season average to be safe).',
      'Read your total weekly income, tip share, annual estimate, and the guaranteed floor for budgeting.',
    ],
    faq: [
      {
        q: 'How much of a server\'s income is usually tips?',
        a: 'For full-service restaurant servers, typically 60–85%. Bartenders in busy venues can top 90%. That variability is exactly why lenders and landlords discount tip income — and why your own budget should too.',
      },
      {
        q: 'Do I pay taxes on tips?',
        a: 'Yes — tips are taxable income. Employers withhold on reported tips, and under the 2025 tax law, qualifying tips up to $25,000 are deductible from federal income tax through 2028 (phasing out at higher incomes) — but Social Security and Medicare tax still applies. Report them all; the deduction happens on your return, not by under-reporting.',
      },
      {
        q: 'How do I budget when income swings week to week?',
        a: 'Two-account method: all income lands in one account, and you pay yourself a fixed weekly "salary" into a spending account sized to your floor. Fat weeks build the buffer in the first account; lean weeks draw it down. After 3–6 months you have a self-insuring income smoother.',
      },
    ],
  },
  {
    slug: 'glycogen-calculator',
    title: 'Glycogen Calculator — Muscle Glycogen Stores, Energy & Scale Impact',
    shortTitle: 'Glycogen Stores',
    category: 'Fitness & Sports',
    description:
      'Free glycogen calculator. Estimate muscle and liver glycogen stores from body weight, body fat, and training status — plus stored energy and the glycogen-water scale swing.',
    tagline: 'The 4-pound overnight swing is fuel and water, not fat.',
    intro:
      'Your muscles and liver store carbohydrate as glycogen — roughly 12 g per kg of muscle if untrained, up to 20 g/kg when endurance-trained, plus about 100 g in the liver. Every gram binds ~3 g of water, which is why keto dieters "lose 5 pounds" in week one and carb-ups put it back. This calculator estimates your tank size, its energy content, and its real scale impact.',
    howItWorks: [
      'Enter body weight and body fat percentage.',
      'Choose your training status (untrained, recreational, or endurance-trained).',
      'Read estimated muscle and liver glycogen, stored energy, and the glycogen-plus-water scale weight.',
    ],
    faq: [
      {
        q: 'How much glycogen can the body store?',
        a: 'A typical 180 lb trained athlete stores roughly 700–800 g total — about 600–700 g in muscle and ~100 g in the liver — worth around 3,000 kcal. Storage capacity scales with muscle mass and rises with endurance training and carb-rich diets; supercompensation protocols can push muscle stores above 20 g/kg.',
      },
      {
        q: 'Why does the scale jump after eating carbs?',
        a: 'Each gram of stored glycogen binds about 3 g of water. Refilling 400 g of glycogen puts roughly 3.5 lb of glycogen-plus-water on the scale — fuel in the tank, not fat gained. This is also why low-carb diets show dramatic first-week losses: mostly the glycogen tank and its water draining.',
      },
      {
        q: 'How fast do you deplete glycogen?',
        a: 'A hard lifting session burns roughly 25–40% of the glycogen in the muscles worked. High-intensity endurance work at 70–80% VO₂max empties most of the tank in 90–120 minutes — the marathon "wall" around mile 20 is glycogen running out. Liver glycogen falls steadily between meals and overnight.',
      },
    ],
  },
  {
    slug: 'carb-loading-calculator',
    title: 'Carb Loading Calculator — Race-Day Glycogen Supercompensation',
    shortTitle: 'Carb Loading',
    category: 'Fitness & Sports',
    description:
      'Free carb loading calculator. Compute daily and per-meal carbohydrate targets (10–12 g/kg) for the 36–48 hours before a marathon, triathlon, or long event.',
    tagline: 'Two days of pasta is a protocol, not a craving.',
    intro:
      'The evidence-based carb-load (Burke, ACSM position stand) is 10–12 g of carbohydrate per kg of body weight per day for 36–48 hours before a 90+ minute event, paired with a training taper. Done right, it supercompensates muscle glycogen 20–40% above normal and can add minutes to a marathon. This calculator turns your weight into daily and per-meal targets.',
    howItWorks: [
      'Enter your body weight and loading days before the event (2 is classic).',
      'Read the daily carb range (10–12 g/kg), per-meal targets, and event-total grams.',
      'Split across 4 meals plus snacks; keep fat and fiber low so the volume is eatable.',
    ],
    faq: [
      {
        q: 'Does carb loading actually work?',
        a: 'For events longer than ~90 minutes, yes — it is one of the most replicated findings in sports nutrition, raising muscle glycogen 20–40% above normal and improving time-trial performance by 2–3%. For anything under 90 minutes, normal glycogen stores are already sufficient and loading adds weight without benefit.',
      },
      {
        q: 'What should I eat to hit 10 g/kg?',
        a: 'For an 82 kg athlete that is 820 g of carbs a day — genuinely hard. Think rice, pasta, bread, bagels, jam, juice, and sports drink, not vegetables and chicken breast (fiber and protein crowd out the volume). White carbs over whole grains for these two days; low fat, low fiber, frequent meals.',
      },
      {
        q: 'Why did I gain weight carb loading?',
        a: 'That is the point. Each gram of stored glycogen carries ~3 g of water, so a successful load adds 2–4 lb of glycogen-plus-water. You are heavier at the start line and faster at mile 20 — the trade is worth it. The weight drains within days after the event.',
      },
    ],
  },
  {
    slug: 'sweat-rate-calculator',
    title: 'Sweat Rate Calculator — Hydration Plan from Pre/Post Weight',
    shortTitle: 'Sweat Rate',
    category: 'Fitness & Sports',
    description:
      'Free sweat rate calculator. Compute your hourly sweat rate from pre/post workout weight and fluid intake, plus personalized during- and after-exercise hydration targets.',
    tagline: 'Generic hydration advice fails because sweat rates vary 5×.',
    intro:
      'Sweat rates range from under 0.5 L/hr to over 2.5 L/hr between athletes — so "drink eight glasses" is useless for training. The field test is simple: weigh before and after, account for what you drank, divide by hours. This calculator gives your rate, your dehydration percentage against the 2% performance threshold, and exactly how much to drink during and after similar sessions.',
    howItWorks: [
      'Weigh yourself dry, minimal clothing, before the session.',
      'Track all fluid consumed (and any urine) during.',
      'Weigh again right after, toweled off. Enter everything plus session length.',
    ],
    faq: [
      {
        q: 'How much should I drink during exercise?',
        a: 'Enough to keep body-mass loss under 2% — beyond that, endurance performance and cognition measurably decline. Your sweat rate from this calculator sets the target: someone at 1.5 L/hr needs roughly double the fluids of someone at 0.75 L/hr in the same workout. In practice, gut absorption caps intake around 0.8–1.2 L/hr for most people.',
      },
      {
        q: 'Why replace 125–150% of losses afterward?',
        a: 'You keep losing fluid to urine after the session ends, and rapid drinking triggers diuresis before full rehydration. ACSM guidance is to replace 125–150% of the deficit over the following hours, ideally with sodium included — plain water alone dilutes blood sodium and blunts the thirst drive before you are actually rehydrated.',
      },
      {
        q: 'Do I need electrolytes or is water fine?',
        a: 'Under an hour: water is fine. Over an hour, or heavy/salty sweaters (white streaks on clothes, stinging eyes): include sodium — sweat carries roughly 500–1,000 mg per liter, and replacing large volumes with plain water risks hyponatremia, which has hospitalized marathoners.',
      },
    ],
  },
  {
    slug: 'dots-score-calculator',
    title: 'DOTS Score Calculator — Powerlifting Pound-for-Pound Strength',
    shortTitle: 'DOTS Score',
    category: 'Fitness & Sports',
    description:
      'Free DOTS score calculator. Compute your powerlifting coefficient from squat, bench, deadlift, and body weight — the modern standard for comparing lifters across weight classes.',
    tagline: 'A 400 lb total means nothing until you know the body weight.',
    intro:
      'DOTS (Dynamic Objective Team Scoring, 2019) normalizes your powerlifting total against body weight with a 4th-degree polynomial fitted to modern competition data — the system USAPL and USPA use for best-lifter awards. This calculator computes your score and classification from your squat, bench, deadlift, and body weight.',
    howItWorks: [
      'Select sex division (the coefficients differ).',
      'Enter body weight and your best squat, bench press, and deadlift (pounds or kilos — it converts).',
      'Read your DOTS score and classification band.',
    ],
    faq: [
      {
        q: 'What is a good DOTS score?',
        a: 'Under 200 is beginner, 200–300 novice, 300–400 intermediate, 400–500 advanced, and 500+ elite. Regional meet winners typically score 350–420; national-level lifters exceed 400. Scores are only comparable within the same sex division — the coefficient sets differ.',
      },
      {
        q: 'DOTS vs Wilks vs IPF GL points?',
        a: 'Wilks (1994) is the classic; DOTS (2019) and IPF GL (2020) are modern replacements fitted on current competition data, and both correct Wilks\' bias at extreme body weights. USAPL/USPA use DOTS for best-lifter awards; the IPF itself uses GL points. For personal tracking any of them works — consistency matters more than the system.',
      },
      {
        q: 'Should I cut weight to raise my DOTS?',
        a: 'Usually no, unless you are near a class boundary with muscle to spare. The polynomial rewards leanness only when the total holds — cutting hard enough to lose 5% off your total while dropping a class almost always nets a lower score. Compute both scenarios here before deciding.',
      },
    ],
  },
  {
    slug: 'beam-load-calculator',
    title: 'Beam Load Calculator — Moment, Shear, Stress & Deflection',
    shortTitle: 'Beam Load',
    category: 'Trades & Engineering',
    description:
      'Free beam load calculator. Max moment, shear, bending stress, and deflection for simply supported and cantilever beams with point or uniform loads.',
    tagline: 'PL/4 and wL²/8 — the two formulas that built the world.',
    intro:
      'First-pass beam sizing is four classic elastic cases: simply supported or cantilever, point load or uniform. This calculator computes max shear, max bending moment, bending stress from your section modulus, and deflection from E and I — with the deflection ratio checked against common L/240 and L/360 serviceability limits.',
    howItWorks: [
      'Choose the beam configuration (supports and load type).',
      'Enter the load, span, material E, and section properties I and S.',
      'Read max moment, shear, bending stress, deflection, and the L/x serviceability ratio.',
    ],
    faq: [
      {
        q: 'What is the max moment formula for a beam?',
        a: 'Simply supported with a center point load: M = PL/4. Simply supported with a uniform load: M = wL²/8. Cantilever with end load: M = PL. Cantilever uniform: M = wL²/2. Moment is in lb·ft when P is pounds, w is lb/ft, and L is feet — convert to lb·in before dividing by section modulus for stress.',
      },
      {
        q: 'How much deflection is acceptable?',
        a: 'Common serviceability limits: L/360 for floor beams supporting plaster or brittle finishes, L/240 for roofs, L/180 as an absolute floor. A 10 ft beam at L/360 deflects at most 0.33 inches. Deflection, not strength, governs most floor designs — stiffness (E×I) is usually the binding constraint.',
      },
      {
        q: 'Can I use this to design a real structure?',
        a: 'No — use it for feasibility checks, education, and sanity-checking software output. Real design applies code load combinations with safety factors (see the load combination calculator), lateral bracing checks, connection design, and a licensed engineer\'s stamp. These are elastic formulas for prismatic beams; they do not cover lateral-torsional buckling or shear failure.',
      },
    ],
  },
  {
    slug: 'load-combination-calculator',
    title: 'Load Combination Calculator — ASCE 7 LRFD Combinations',
    shortTitle: 'Load Combinations',
    category: 'Trades & Engineering',
    description:
      'Free load combination calculator. Compute ASCE 7 LRFD strength combinations from dead, live, snow, and wind loads and find the governing case.',
    tagline: 'You never design for D + L. You design for 1.2D + 1.6L.',
    intro:
      'Structural codes do not let you add loads and call it a day: each load type gets a factor reflecting its uncertainty, and the designer checks every combination to find which governs. This calculator runs the common ASCE 7 LRFD combinations on your dead, live, snow, and wind loads and flags the governing case — including the easily-forgotten 0.9D + 1.0W uplift check.',
    howItWorks: [
      'Enter dead, live, snow, and wind loads in consistent units (psf, plf, or kips).',
      'Read each factored combination.',
      'The governing (highest) combination is what members are sized for.',
    ],
    faq: [
      {
        q: 'Why are load factors different for each load type?',
        a: 'Uncertainty. Dead loads are knowable to within a few percent, so the factor is 1.2. Live loads vary wildly, so 1.6. The factors come from reliability analysis calibrated to a target probability of failure — they are statistics wearing a hard hat, not arbitrary padding.',
      },
      {
        q: 'Why is 0.9D in the uplift combination?',
        a: 'When wind lifts the roof, dead load is the only thing holding it down — and assuming you have MORE dead load than reality is unconservative. So the code reduces the resisting dead load to 0.9D while applying full wind. Underestimating your anchor is how roofs leave buildings.',
      },
      {
        q: 'LRFD vs ASD?',
        a: 'LRFD (strength design) factors loads up and compares against reduced member strength; ASD keeps loads unfactored and divides capacity by a safety factor. Both are legal under ASCE 7; steel and concrete codes each have both paths. Do not mix factors from one with capacities from the other.',
      },
    ],
  },
  {
    slug: 'horsepower-torque-calculator',
    title: 'Horsepower Torque Calculator — HP = T × RPM ÷ 5252',
    shortTitle: 'HP ↔ Torque',
    category: 'Trades & Engineering',
    description:
      'Free horsepower torque calculator. Convert between horsepower and torque at any RPM, with kW and newton-meter equivalents. Exact 5252 formula.',
    tagline: 'Torque does the work; horsepower tells you how fast.',
    intro:
      'Horsepower and torque are the same measurement at different speeds, welded together by one constant: HP = T × RPM ÷ 5,252. This calculator solves either direction and converts to kilowatts and newton-meters — for sizing motors, reading dyno sheets, or winning arguments about diesels.',
    howItWorks: [
      'Choose whether to solve for horsepower or torque.',
      'Enter the known value and the RPM.',
      'Read the result with kW and N·m equivalents.',
    ],
    faq: [
      {
        q: 'Why is the constant 5252?',
        a: 'One horsepower is defined as 33,000 ft·lb per minute. A pound-foot of torque acting through one revolution does 2π ft·lb of work, so HP = T × 2π × RPM ÷ 33,000 = T × RPM ÷ 5,252 (rounded). Every torque and horsepower curve on every dyno chart crosses at exactly 5,252 RPM — it is arithmetic, not coincidence.',
      },
      {
        q: 'Does gearing change horsepower?',
        a: 'No — gearing trades RPM for torque at roughly constant power (minus friction losses, typically 2–15%). A 3:1 reduction triples output torque at one-third the speed. This is why electric motors with flat torque curves need fewer gears than engines with peaky ones.',
      },
      {
        q: 'How do I size a motor from a load?',
        a: 'Start from the load torque at the required speed, compute HP here, then apply a service factor (1.15–1.25 typical) for starts, ambient temperature, and duty cycle. Size to the worst operating point, not the nameplate average — and check starting torque separately; it is often 2–3× running torque.',
      },
    ],
  },
  {
    slug: 'rc-circuit-calculator',
    title: 'RC Circuit Calculator — Time Constant & Filter Cutoff Frequency',
    shortTitle: 'RC Circuit',
    category: 'Trades & Engineering',
    description:
      'Free RC circuit calculator. Compute the RC time constant, −3 dB filter cutoff frequency, and capacitor charge times from resistance and capacitance.',
    tagline: 'τ = RC: the smallest useful equation in electronics.',
    intro:
      'One resistor and one capacitor set a time scale: τ = RC. That single number defines how fast a capacitor charges (63.2% in one τ), where a filter starts cutting (f = 1/2πRC), and how long a switch bounce lasts. This calculator converts your R and C into the time constant, cutoff frequency, and charge-time benchmarks.',
    howItWorks: [
      'Enter resistance in ohms and capacitance in microfarads.',
      'Read the time constant τ and the −3 dB cutoff frequency.',
      'Charge benchmarks: 63.2% in 1τ, 99% in ~4.6τ.',
    ],
    faq: [
      {
        q: 'What does the cutoff frequency mean?',
        a: 'At f = 1/(2πRC), a low-pass RC filter passes half power (−3 dB) — the signal drops to 70.7% amplitude. Above cutoff the signal rolls off at 20 dB per decade; below it, the signal passes nearly untouched. Put the cutoff at least a decade away from frequencies you must preserve or reject for clean behavior.',
      },
      {
        q: 'How long until a capacitor is "fully" charged?',
        a: 'Never completely — it is asymptotic. 1τ gets 63.2%, 3τ gets 95%, 4.6τ gets 99%, 5τ gets 99.3%. Digital designs usually wait 5τ before assuming a settled voltage; analog designs check the ripple spec against the actual exponential.',
      },
      {
        q: 'Where does RC math show up in real designs?',
        a: 'Switch debouncing (τ of a few ms kills bounce), power supply smoothing, 555 timer periods, audio crossovers, ADC input settling, and reset circuits. It is also the reason long wires and high impedance don\'t mix: stray capacitance forms an accidental RC filter with your source resistance.',
      },
    ],
  },
  {
    slug: 'wrvu-compensation-calculator',
    title: 'wRVU Compensation Calculator — Physician Productivity Pay',
    shortTitle: 'wRVU Compensation',
    category: 'Freelance & Career',
    description:
      'Free wRVU compensation calculator. Compute total physician pay from base salary, wRVU threshold, production, and conversion factor — plus effective dollars per wRVU.',
    tagline: 'Your contract is a formula. Know it better than the administrator does.',
    intro:
      'Most physician contracts pay a base salary up to a wRVU threshold, then a conversion factor for every wRVU above it — and the difference between a $45 and $55 factor is six figures over a contract. This calculator computes your total comp, productivity bonus, and effective rate per wRVU so you can model offers before signing.',
    howItWorks: [
      'Enter base salary and the wRVU threshold it covers.',
      'Enter your expected annual wRVUs and the conversion factor above threshold.',
      'Read total compensation, bonus, and effective $/wRVU.',
    ],
    faq: [
      {
        q: 'What is a wRVU worth?',
        a: 'Employers pay a conversion factor typically between $40 and $80 per wRVU depending on specialty and market, benchmarked against MGMA survey medians. Surgical specialties generate more wRVUs per clinic day; primary care generates fewer but with steadier volume. Always compare both your wRVU target and the factor against the specialty median — a high threshold with a low factor is a pay cut wearing a smile.',
      },
      {
        q: 'Base plus productivity or pure productivity?',
        a: 'Base-plus is safer early: guaranteed income while you build a panel. Pure productivity (100% conversion factor) pays more at high volume but leaves you exposed to slow quarters, payer mix shifts, and your own vacation. Model both here: pure productivity at $52/wRVU needs about 5,300 wRVUs just to match a $275k base.',
      },
      {
        q: 'What happens if I miss the threshold?',
        a: 'Usually nothing this year — you keep the base. But most contracts true-up at renewal: chronic below-threshold production renegotiates the base down at the next term. Some contracts also have negative accrual clauses that carry shortfalls forward. Read that clause twice.',
      },
    ],
  },
  {
    slug: 'rent-vs-buy-calculator',
    title: 'Rent vs Buy Calculator — True Breakeven Year',
    shortTitle: 'Rent vs Buy',
    category: 'Loans & Debt',
    description:
      'Free rent vs buy calculator. Compare the true net cost of buying versus renting year by year — mortgage, taxes, maintenance, closing costs, appreciation, and invested down payment.',
    tagline: 'Rent is not throwing money away. Interest is not building equity.',
    intro:
      'The honest comparison is not rent vs mortgage payment — it is total cost of each path, including closing costs, maintenance, selling costs, appreciation, and what the renter earns investing the down payment. This calculator simulates both year by year and finds the breakeven point where buying finally wins.',
    howItWorks: [
      'Enter the home price, down payment, mortgage terms, and ownership costs (tax, insurance, maintenance).',
      'Enter your rent, rent growth, home appreciation, and investment return assumptions.',
      'Read the breakeven year and the year-by-year net cost of each path.',
    ],
    faq: [
      {
        q: 'Is renting really throwing money away?',
        a: 'No — the first years of a mortgage are mostly interest, which is "thrown away" exactly like rent, plus closing and selling costs of 8–9% round trip. Buying wins over time through appreciation, principal paydown, and frozen housing costs while rent inflates. The crossover is typically 4–7 years; before that, renting is usually the cheaper path.',
      },
      {
        q: 'What assumption moves the answer most?',
        a: 'Appreciation. At 3% annual appreciation, buying a $400k home beats renting around year 5–7 in typical markets; at 1% it can push past year 10; at 5% it can arrive by year 3. Second most powerful: how long you stay. If you might move within 3 years, the transaction costs almost always make renting the winner.',
      },
      {
        q: 'Should the renter really invest the difference?',
        a: 'Mathematically yes — it is the honest comparison — behaviorally, most renters do not. If you know you won\'t invest the down payment and monthly savings, buying acts as forced savings, which is worth something real. Run the calculator with a 0% investment return to see the "I won\'t invest it" scenario.',
      },
    ],
  },
  {
    slug: 'closing-cost-calculator',
    title: 'Closing Cost Calculator — Cash to Close for Home Buyers',
    shortTitle: 'Closing Costs',
    category: 'Loans & Debt',
    description:
      'Free closing cost calculator. Estimate buyer closing costs item by item — origination, appraisal, title, escrow prepaids — and your total cash to close.',
    tagline: 'The down payment is not the check you write.',
    intro:
      'First-time buyers budget the down payment and get ambushed by the rest: origination fees, appraisal, title insurance, and escrow prepaids typically add 2–5% of the price. This calculator itemizes the stack and gives you the real cash-to-close number — the check you actually write at the table.',
    howItWorks: [
      'Enter the home price and down payment percentage.',
      'Adjust the fee estimates (origination, appraisal, title, recording) to match your Loan Estimate.',
      'Read itemized costs, total closing costs, and total cash to close minus any credits.',
    ],
    faq: [
      {
        q: 'How much are closing costs for the buyer?',
        a: 'Typically 2–5% of the purchase price: on a $400,000 home, $8,000–$20,000. The big items are loan origination (0.5–1% of the loan), title insurance, appraisal, and escrow prepaids — several months of property tax plus the first year of homeowner\'s insurance deposited upfront. State transfer taxes can add meaningfully in some states.',
      },
      {
        q: 'Which closing costs are negotiable?',
        a: 'Almost all of the lender side: origination points, application fees, and rate-buydowns are negotiable or shoppable between lenders. Title and escrow fees are shoppable in most states. Recording fees and transfer taxes are fixed by government. Seller credits are negotiated in the purchase contract — in slow markets, asking for 2–3% toward closing often works.',
      },
      {
        q: 'Can I roll closing costs into the loan?',
        a: 'Sometimes — lender credits (accept a higher rate in exchange for the lender covering costs) or financing costs into certain loan programs reduce upfront cash but raise the payment or rate for 30 years. A 0.25% higher rate on $320,000 costs about $50/month — roughly $18,000 over the full term. Do that math before choosing "no closing cost" offers.',
      },
    ],
  },
  {
    slug: 'rmd-calculator',
    title: 'RMD Calculator — Required Minimum Distribution by Age (IRS Table III)',
    shortTitle: 'RMD Calculator',
    category: 'Savings & Investing',
    description:
      'Free RMD calculator. Compute your required minimum distribution from age and prior year-end balance using the current IRS Uniform Lifetime Table (in effect since 2022).',
    tagline: 'The IRS set a floor under your patience.',
    intro:
      'Once you reach age 73 (75 if born 1960 or later), the IRS requires annual withdrawals from traditional IRAs and 401(k)s: your prior December 31 balance divided by the Uniform Lifetime Table divisor for your age. Miss it and the excise tax is 25% of the shortfall. This calculator applies the current Table III divisors — unchanged since 2022 — and shows the monthly equivalent and the penalty you\'re avoiding.',
    howItWorks: [
      'Enter the age you reach this calendar year.',
      'Enter your traditional IRA/401(k) balance as of last December 31.',
      'Read your RMD, the implied percentage, and the monthly equivalent.',
    ],
    faq: [
      {
        q: 'When do RMDs start in 2026?',
        a: 'Age 73 for anyone born 1951–1959; age 75 for those born 1960 or later (SECURE 2.0). Your first RMD can be delayed to April 1 of the following year — but every later one is due December 31, so delaying the first means two taxable RMDs in one year.',
      },
      {
        q: 'What is the penalty for missing an RMD?',
        a: '25% of the amount you failed to withdraw — on a $20,000 RMD, a $5,000 tax. It drops to 10% if you correct the shortfall within the IRS correction window and file the amended return. The penalty applies per year, so catching up quickly matters.',
      },
      {
        q: 'Do Roth IRAs have RMDs?',
        a: 'Not for the original owner — Roth IRAs are exempt during the owner\'s lifetime, which is a core argument for Roth conversions in low-income years before 73. Inherited Roth IRAs do have beneficiary distribution rules (the 10-year rule). And since 2024, Roth 401(k)s are RMD-free too.',
      },
    ],
  },
  {
    slug: 'social-security-breakeven-calculator',
    title: 'Social Security Breakeven Calculator — Claim at 62, 67, or 70?',
    shortTitle: 'SS Breakeven Age',
    category: 'Savings & Investing',
    description:
      'Free Social Security breakeven calculator. Compare claiming ages 62–70 with official SSA reduction and delayed-credit rules, and find the age where waiting pulls ahead.',
    tagline: 'Claiming at 62 costs 30%; waiting to 70 pays 124%. The crossover is the question.',
    intro:
      'Social Security reduces benefits 5/9 of 1% per month claimed early (30% less at 62) and credits 8% per year delayed past full retirement age (24% more at 70). Whether waiting wins depends on one thing: how long you live. This calculator applies the official SSA adjustment rules and computes the exact breakeven age between any two claiming ages.',
    howItWorks: [
      'Enter your full-retirement-age benefit (PIA) from your SSA statement.',
      'Pick two claiming ages to compare.',
      'Read both monthly amounts, the breakeven age, and lifetime totals at 85.',
    ],
    faq: [
      {
        q: 'What is the breakeven age for claiming at 62 vs 70?',
        a: 'Roughly age 80–81 for a FRA-67 worker: the 62-claimant\'s eight-year head start is overtaken by the 70-claimant\'s 77% larger monthly check around age 80.4. Median life expectancy at 62 is about 82 for men and 85 for women — past the breakeven — which is why most analysts say delaying is the better bet for healthy singles.',
      },
      {
        q: 'Does delaying past 70 help?',
        a: 'No — delayed retirement credits stop at 70, so there is never a financial reason to claim later. But credits also stop accumulating the month you claim, and the earnings test can withhold benefits before FRA if you work. The window that matters is 62–70.',
      },
      {
        q: 'What about my spouse?',
        a: 'Couples change everything: the higher earner delaying to 70 effectively buys the survivor a 24% larger check for life, since the surviving spouse keeps the larger benefit. That survivor insurance is often worth more than the breakeven math — model it before the lower earner claims early.',
      },
    ],
  },
  {
    slug: 'safe-withdrawal-calculator',
    title: 'Safe Withdrawal Rate Calculator — Will the 4% Rule Outlive You?',
    shortTitle: 'Safe Withdrawal',
    category: 'Savings & Investing',
    description:
      'Free safe withdrawal rate calculator. Test the 4% rule against your portfolio: initial withdrawal, monthly income, and the year the money runs out under your return and inflation assumptions.',
    tagline: 'Retirement fails on arithmetic, not vibes.',
    intro:
      'The 4% rule (Trinity study) says withdrawing 4% of your starting portfolio, adjusted for inflation, survived nearly every 30-year window in market history. This calculator stress-tests the rule with your own numbers: portfolio size, withdrawal rate, assumed return, and inflation — and tells you the exact year the money runs out if it does.',
    howItWorks: [
      'Enter your retirement portfolio and initial withdrawal rate.',
      'Set your return and inflation assumptions.',
      'Read year-one withdrawal, monthly income, and portfolio longevity.',
    ],
    faq: [
      {
        q: 'Is the 4% rule still valid?',
        a: 'For 30-year retirements, historically yes — it survived every window including the Depression, though 1966 retirees came close to failing. For 40+ year early retirements, 3.25–3.5% is the safer researched floor. The rule assumes a diversified stock/bond portfolio; 100% cash or 100% crypto breaks the premise.',
      },
      {
        q: 'What is sequence-of-returns risk?',
        a: 'Average return does not determine survival — the ORDER of returns does. A 30% crash in year 2 of retirement while withdrawing is far deadlier than the same crash in year 20. This calculator uses constant returns, so it shows the average case; real planning adds a bad-first-decade stress test. That\'s the guardrail answer: flexible spending.',
      },
      {
        q: 'How do I make withdrawals safer?',
        a: 'Three levers: start lower (3.5% instead of 4%), hold 1–2 years of spending in cash so crashes don\'t force selling at the bottom, and build in flexibility — committing to skip inflation raises after down years historically rescues most failing scenarios. A part-time income of even $1,000/month in early retirement moves the math dramatically.',
      },
    ],
  },
  {
    slug: 'va-funding-fee-calculator',
    title: 'VA Funding Fee Calculator — 2026 Rates, Exemptions & Financed Cost',
    shortTitle: 'VA Funding Fee',
    category: 'Loans & Debt',
    description:
      'Free VA funding fee calculator. Current rates by down payment and first/subsequent use, exemption check, and the true cost of financing the fee into the loan.',
    tagline: 'No PMI — but not free. Know the fee before the closing disclosure does.',
    intro:
      'The VA loan\'s trade for zero down and no mortgage insurance is the funding fee: 2.15% of the loan on first use under 5% down, 3.3% on subsequent use — dropping to 1.5% with 5% down. This calculator applies the current VA schedule, checks the exemption (service-connected disability pays nothing), and shows what financing the fee actually costs over 30 years.',
    howItWorks: [
      'Enter the purchase price and down payment.',
      'Select first or subsequent VA loan use, and check the exemption box if it applies.',
      'Read the fee, the financed loan amount, and the monthly payment difference.',
    ],
    faq: [
      {
        q: 'Who is exempt from the VA funding fee?',
        a: 'Veterans receiving VA compensation for a service-connected disability (any rating), those eligible for compensation but taking retirement pay instead, surviving spouses receiving DIC, and active-duty Purple Heart recipients. If your disability claim is approved with an effective date before closing, you can claim a full refund of a fee already paid.',
      },
      {
        q: 'Is it worth putting 5% down on a VA loan?',
        a: 'Often yes on subsequent use: the fee falls from 3.3% to 1.5%, saving $7,200 on a $400,000 purchase — an instant 144% return on the $20,000 down payment if you count avoided fee. On first use the drop is 2.15% to 1.5%, saving $2,600. The funding-fee tiers make a small down payment unusually powerful for repeat VA users.',
      },
      {
        q: 'Should I finance the fee or pay it cash?',
        a: 'Financing adds the fee to the loan — on $8,600 at 6.5% over 30 years, about $54/month and roughly $11,000 in total payments. Paying cash avoids that, but the VA loan\'s real advantage is preserving liquidity. If cash is tight, financing is fine; if you have it, compare against what the cash earns elsewhere.',
      },
    ],
  },
  {
    slug: 'military-retirement-calculator',
    title: 'Military Retirement Calculator — High-36 vs BRS Pension Estimator',
    shortTitle: 'Military Retirement',
    category: 'Freelance & Career',
    description:
      'Free military retirement calculator. Estimate your pension under legacy High-36 (2.5%/year) or BRS (2.0%/year) from years of service and high-3 base pay.',
    tagline: 'Twenty years is a cliff: 50% for life, or nothing at 19.',
    intro:
      'The military pension is one of the last true pensions: legacy High-36 pays 2.5% of your high-3 base pay per year of service — 50% at 20 years, for life, with COLA. BRS pays 2.0% per year plus TSP matching. This calculator estimates the pension both ways and shows what each additional year of service is worth.',
    howItWorks: [
      'Choose your retirement system (High-36 legacy or BRS).',
      'Enter years of service and your high-3 average monthly base pay.',
      'Read the annual and monthly pension, plus the value of each extra year.',
    ],
    faq: [
      {
        q: 'How is the military pension calculated?',
        a: 'Legacy High-36: 2.5% × years of service × average of your highest 36 months of base pay. At 20 years that is exactly 50%; at 30 years, 75%. BRS (members joining 2018+): 2.0% per year — 40% at 20 — plus government TSP matching up to 5% and mid-career continuation pay. Base pay only: BAH and BAS are excluded.',
      },
      {
        q: 'What happens if I leave at 18 years?',
        a: 'Under either system, the pension is cliff-vested at 20 years — separating at 18 or 19 pays nothing from the pension. This is why "just two more years" is the most consequential decision in a military career. Under BRS at least your TSP and its matching are fully portable.',
      },
      {
        q: 'Is the pension inflation-protected?',
        a: 'Yes — military retired pay receives annual cost-of-living adjustments tied to CPI, making it one of the few inflation-indexed annuities available anywhere. At 3% inflation, a $36,000 pension at 38 is worth roughly $66,000 at 58 in nominal dollars. That COLA is the hidden crown jewel of the benefit.',
      },
    ],
  },
  {
    slug: 'student-loan-idr-calculator',
    title: 'Student Loan IDR Calculator — IBR Payment & Forgiveness Estimate',
    shortTitle: 'Student Loan IDR',
    category: 'Loans & Debt',
    description:
      'Free income-driven repayment calculator. Estimate your IBR payment from income and family size, compare against the 10-year standard, and see the forgiveness horizon.',
    tagline: 'Your payment is a percentage of your life, not your balance.',
    intro:
      'Income-Based Repayment ignores your balance and prices your payment off your life: 10% (new IBR) or 15% (old IBR) of discretionary income — AGI minus 150% of the poverty guideline — capped at the 10-year standard payment, with forgiveness after 20 or 25 years. This calculator runs that math with the current poverty guidelines.',
    howItWorks: [
      'Enter your AGI and family size (discretionary income uses 150% of the poverty guideline).',
      'Enter your loan balance and rate.',
      'Compare the IDR payment against the standard cap, and note the forgiveness year.',
    ],
    faq: [
      {
        q: 'Which IDR plan should I be on in 2026?',
        a: 'The SAVE plan is in litigation and effectively unavailable; IBR is the stable statutory option. New IBR (borrowers after July 1, 2014) charges 10% of discretionary income with 20-year forgiveness; old IBR is 15% with 25-year forgiveness. PAYE phases out in 2027–2028. Confirm current availability at studentaid.gov before applying — the plan landscape has been volatile.',
      },
      {
        q: 'Can my IDR payment be zero?',
        a: 'Yes — if your AGI is below 150% of the poverty guideline for your family size ($23,940 for a single person in 2026), discretionary income is zero and so is the payment. Those $0 months still count toward the 20/25-year forgiveness clock, which is why certifying income even when broke matters.',
      },
      {
        q: 'Is forgiven student loan debt taxable?',
        a: 'Federal tax exemption on forgiven student debt expired after 2025 — forgiveness under IDR after 2025 is generally taxable as income again under current law (the "tax bomb"), unless Congress extends the exemption. Several states also tax it regardless. Model a potential tax bill of 20–30% of the forgiven amount when comparing IDR to aggressive payoff.',
      },
    ],
  },
  {
    slug: 'first-apartment-budget-calculator',
    title: 'First Apartment Budget Calculator — Rent You Can Actually Afford',
    shortTitle: 'First Apartment Budget',
    category: 'Everyday Money',
    description:
      'Free first-apartment budget calculator. Combines the 30% rule and the 50/30/20 budget into one rent ceiling, plus the cash you need on signing day.',
    tagline: 'The deposit math nobody teaches you.',
    intro:
      'Landlords, budgeting rules, and your own bank account all answer "how much rent can I afford" differently. This calculator runs both classic guardrails — the 30%-of-take-home cap and the 50/30/20 needs bucket — takes the stricter one, then prices the upfront hit: first month, deposit, and fees.',
    howItWorks: [
      'Enter monthly take-home pay (not salary — run the paycheck calculator first if unsure).',
      'Enter the monthly obligations you already have: loans, car, phone, subscriptions.',
      'Enter cash saved; see the rent ceiling and whether your savings survive signing day.',
    ],
    faq: [
      {
        q: 'Is the 30% rule gross or take-home?',
        a: 'Originally it was 30% of gross income (the old HUD guideline), but on a first salary with student loans, 30% of take-home is the safer read. This calculator uses take-home and cross-checks against the 50/30/20 budget so rent cannot crowd out food, transport, and minimum payments.',
      },
      {
        q: 'How much cash do I need before moving into a first apartment?',
        a: 'Plan on first month plus a security deposit equal to one month, plus $100–$200 in application and admin fees — roughly 2.1× monthly rent before movers, furniture, or utility deposits. Many landlords also require proof you earn 3× the rent monthly, which is its own affordability filter.',
      },
      {
        q: 'What if the math says I cannot afford any apartment?',
        a: 'Then the honest answers are roommates (splitting a 2BR usually beats a studio by 25–35% per person), a longer commute to a cheaper area, or a few months at home stacking the move-in fund. Signing a lease the math does not support is how the first credit-card spiral starts.',
      },
    ],
  },
  {
    slug: 'salary-offer-comparison-calculator',
    title: 'Salary Offer Comparison Calculator — Cost-of-Living Adjusted',
    shortTitle: 'Compare Job Offers',
    category: 'Freelance & Career',
    description:
      'Free salary offer comparison calculator. Adjusts two job offers for cost of living so you can compare purchasing power, not just headline salary.',
    tagline: '$85k in Austin beats $100k in San Francisco. Usually.',
    intro:
      'A salary is only a number until you divide it by what life costs where you earn it. This calculator converts two offers into cost-of-living-adjusted dollars so the comparison is purchasing power versus purchasing power — and shows what the weaker offer would need to pay to tie.',
    howItWorks: [
      'Enter both salaries.',
      'Enter each city\'s cost-of-living index (100 = national average; look it up on C2ER, NerdWallet, or Numbeo).',
      'Compare the adjusted figures — then run both salaries through the paycheck calculator for state taxes.',
    ],
    faq: [
      {
        q: 'What is a cost-of-living index?',
        a: 'A relative price level where 100 is the US average. An index of 120 means typical expenses run 20% above average; 85 means 15% below. Dividing salary by (index ÷ 100) converts any offer into equivalent national-average purchasing power, which makes cross-city offers comparable.',
      },
      {
        q: 'Should I compare gross salary or take-home?',
        a: 'Adjusted gross first, take-home second. State income tax can swing the answer several thousand dollars a year — an offer in Texas (no income tax) versus one in California is not the same comparison after taxes as before. Use this for the big sort, then the paycheck calculator for the final call.',
      },
      {
        q: 'What does cost of living not capture?',
        a: 'Career trajectory (some cities compound faster for your field), remote-work flexibility, state benefits, commute time, and whether you would actually enjoy living there. Use the adjusted number to negotiate from strength, not as the whole decision.',
      },
    ],
  },
  {
    slug: 'student-loan-vs-investing-calculator',
    title: 'Student Loan vs Investing Calculator — Pay Off or Invest?',
    shortTitle: 'Loan vs Investing',
    category: 'Savings & Investing',
    description:
      'Free student loan vs investing calculator. Compares extra loan payments against investing the same money over the loan term, with honest guaranteed-vs-expected framing.',
    tagline: 'A guaranteed 6.5% beats a hoped-for 7% more often than you think.',
    intro:
      'The oldest question in personal finance, answered with fair math: both paths spend the same total dollars over your loan term. Paying extra kills the loan early and then invests the freed-up payment; investing puts the extra in the market from day one. This calculator runs both and shows the gap.',
    howItWorks: [
      'Enter loan balance, rate, and years remaining.',
      'Enter the extra monthly cash you are deciding about.',
      'Enter an expected investment return (7% is the long-run stock-market average after inflation; use less to be conservative).',
    ],
    faq: [
      {
        q: 'Is paying off a loan really a guaranteed return?',
        a: 'Yes — every extra dollar of principal you kill stops accruing interest at the loan rate, permanently, with zero volatility and (for student loans) no tax on the benefit. A 6.5% loan payoff is a guaranteed 6.5% return. The stock market\'s 7% average arrives with years of −20% mixed in, which is why the guaranteed side wins ties.',
      },
      {
        q: 'What about the employer 401(k) match?',
        a: 'Grab the full match first, always — it is an instant 100% return, and neither loan payoff nor unmatched investing comes close. After the match, this calculator\'s comparison is the right frame: loan rate versus expected market return.',
      },
      {
        q: 'Does this account for IDR forgiveness or the tax bomb?',
        a: 'No — if you are on an income-driven plan heading toward forgiveness, extra payments can actually cost you money (you pay down a balance that would have been forgiven). Model that path with the student loan IDR calculator first, then use this one only if aggressive payoff is your real alternative.',
      },
    ],
  },
  {
    slug: 'moving-cost-calculator',
    title: 'Moving Cost Calculator — DIY Truck vs Full-Service Movers',
    shortTitle: 'Moving Cost',
    category: 'Everyday Money',
    description:
      'Free moving cost calculator. Compare a DIY rental truck against full-service movers for your distance and home size, with fuel, supplies, and weight estimates.',
    tagline: 'The truck is cheaper. The question is how much cheaper.',
    intro:
      'Every move is the same decision: sweat or money. This calculator prices both — a one-way rental truck with fuel and supplies versus full-service movers estimated from typical shipment weight and distance — so you can see the dollar value of your own labor before committing a weekend to it.',
    howItWorks: [
      'Enter the one-way distance and your home size (sets the typical shipment weight).',
      'Enter your local gas price — rental trucks average about 8 mpg.',
      'Compare the DIY total against the full-service estimate and judge the savings against your time.',
    ],
    faq: [
      {
        q: 'How accurate is this moving estimate?',
        a: 'It is a rule-of-thumb model, not a quote — real prices swing 30% or more with season (May–September is peak), stairs vs elevator, long carries, and how far ahead you book. Use it to decide DIY vs movers and to sanity-check quotes, then get three binding written estimates from licensed movers (check their USDOT number) before signing anything.',
      },
      {
        q: 'What hidden costs does DIY moving have?',
        a: 'Beyond truck and fuel: insurance on the rental (your auto policy usually does not cover it), tolls, parking permits in dense cities, hotel nights on long hauls, and the value of two or three days of your labor. Also the damage risk — movers carry liability; your friends carrying a couch do not.',
      },
      {
        q: 'Is moving still tax-deductible?',
        a: 'For most people, no — the moving expense deduction has been suspended since 2018 and remains suspended in 2026 for everyone except active-duty military moving under orders. Some employers offer relocation assistance instead; that is usually taxable income, so negotiate it grossed up if you can.',
      },
    ],
  },
  {
    slug: 'mileage-vs-actual-expense-calculator',
    title: 'Standard Mileage vs Actual Expenses Calculator — Which Deduction Wins?',
    shortTitle: 'Mileage vs Actual',
    category: 'Freelance & Career',
    description:
      'Free mileage vs actual expense calculator. Compares the IRS standard mileage rate against the actual-expense method using your real costs, miles, and business-use percentage.',
    tagline: 'The IRS gives you two ways. Only one is bigger.',
    intro:
      'Every business mile can be deducted two ways — the flat IRS rate or your share of what the car actually cost — and the gap is routinely thousands of dollars. This calculator runs both with your real numbers and shows the winner, plus the lock-in rule that decides which cars get to choose.',
    howItWorks: [
      'Enter business miles and total miles (sets your business-use percentage).',
      'Enter your real annual car costs: gas, insurance, repairs, depreciation or lease.',
      'Compare both deductions — and check the lock-in rule before switching methods.',
    ],
    faq: [
      {
        q: 'What is the mileage rate for 2026?',
        a: 'The IRS set a split year for 2026: 72.5¢/mile January through June and 76¢/mile July through December, a mid-year adjustment driven by fuel costs. A blended ~74¢ works for planning; for filing, track miles by half-year and apply each rate separately.',
      },
      {
        q: 'What is the lock-in rule?',
        a: 'To preserve the right to switch methods, you must use standard mileage in the FIRST year the car is placed in business service. Choose actual expenses first and that car is locked into actual (with MACRS depreciation) for life. Leased cars that start on standard mileage must keep it for the entire lease.',
      },
      {
        q: 'Which method usually wins for gig drivers?',
        a: 'Standard mileage, usually — a high-mpg car doing 20,000+ business miles often deducts 74¢/mi while actually costing 30–45¢/mi. Actual wins for expensive vehicles with low business mileage or big repair years. Either way you need a mileage log: apps, or a notebook with date, miles, and purpose.',
      },
    ],
  },
  {
    slug: '1099-vs-w2-calculator',
    title: '1099 vs W-2 Calculator — Contract Rate to Salary Equivalent',
    shortTitle: '1099 vs W-2',
    category: 'Freelance & Career',
    description:
      'Free 1099 vs W-2 calculator. Converts a contract hourly rate into its true W-2 salary equivalent after self-employment tax, health insurance, and unpaid time off.',
    tagline: '$60/hr contract is not $60/hr. Here is what it actually is.',
    intro:
      'Contract rates are inflated by everything an employer normally absorbs: half your FICA, your health insurance, and every vacation day. This calculator strips those out of any 1099 rate and shows the W-2 salary it truly equals — so a job offer and a contract offer become comparable numbers.',
    howItWorks: [
      'Enter the contract rate and realistic billable hours per year.',
      'Enter what health insurance would cost you on the open market.',
      'Enter unpaid weeks (vacation, sick days, gaps between contracts) and read the W-2 equivalent.',
    ],
    faq: [
      {
        q: 'What multiplier should a 1099 rate have over W-2?',
        a: 'The classic rule is 1.25×–1.4× the W-2 wage for the same work. This calculator shows your personal number: extra FICA is about 7.1% of gross, individual health insurance runs $5,000–$8,000/yr, and three unpaid weeks off costs about 5.8% of gross. Below 1.2× you are almost certainly underpaid as a contractor.',
      },
      {
        q: 'Does anything favor the 1099 side?',
        a: 'Yes, and it can be big: the QBI deduction shelters up to 20% of qualified business income from income tax, business expenses come off the top (home office, equipment, mileage), and a Solo 401(k) allows much larger retirement contributions than most employer plans. Run the quarterly tax calculator for the SE-tax side of the picture.',
      },
      {
        q: 'Can my employer just call me 1099 to save money?',
        a: 'Not legally. If they control your hours, tools, and how the work is done, the IRS considers you an employee regardless of the label — misclassification is their liability, not yours. The IRS SS-8 form exists precisely for workers who suspect this.',
      },
    ],
  },
  {
    slug: 'brrrr-calculator',
    title: 'BRRRR Calculator — Cash Left In, Refi Proceeds & Cash-on-Cash Return',
    shortTitle: 'BRRRR Deal',
    category: 'Savings & Investing',
    description:
      'Free BRRRR calculator. Model Buy-Rehab-Rent-Refinance-Repeat deals: all-in cost, refinance proceeds at your LTV, cash left in the deal, new payment, and true cash-on-cash return.',
    tagline: 'The whole strategy is one question: how much of your money comes back out?',
    intro:
      'BRRRR works when the refinance returns most or all of your invested cash while the property still cash-flows on the new, bigger loan. This calculator runs the full chain — all-in cost, refi proceeds at your LTV, cash recovered, and then the honest part: whether the rent actually covers the new payment at current rates.',
    howItWorks: [
      'Enter purchase, rehab, and closing/holding costs (your all-in basis).',
      'Enter the ARV and the refinance LTV — the new loan is ARV × LTV.',
      'Enter rent, rate, and a realistic expense ratio; read cash left in and cash-on-cash.',
    ],
    faq: [
      {
        q: 'What is a good BRRRR result?',
        a: 'The textbook win is leaving under 25% of your all-in cost in the deal while cash-flowing positive — recovering 75%+ of your capital while owning an asset with equity. Infinite returns (all cash out) are rare at current rates; the default example here is deliberately realistic: a solid equity capture with slightly negative cash flow at 7.5% money.',
      },
      {
        q: 'When can I refinance after buying?',
        a: 'Most lenders require 6–12 months of "seasoning" before a cash-out refinance, and the appraisal must support your ARV. Delayed-financing programs (Fannie Mae) allow cash-out immediately after a cash purchase, up to the original purchase price — beyond that needs seasoning.',
      },
      {
        q: 'What kills BRRRR deals?',
        a: 'The same three things every time: rehab overruns (budget +20% contingency), an ARV the appraiser does not support (use sold comps, not listings), and refinancing into a payment the rent cannot carry at current rates. Run the downside case — ARV 10% lower, rate 1% higher — before committing.',
      },
    ],
  },
  {
    slug: 'rental-depreciation-calculator',
    title: 'Rental Property Depreciation Calculator — 27.5-Year Deduction',
    shortTitle: 'Rental Depreciation',
    category: 'Savings & Investing',
    description:
      'Free rental property depreciation calculator. Computes the annual 27.5-year straight-line deduction, tax savings at your bracket, and the depreciation recapture bill at sale.',
    tagline: 'The IRS pays you for a building that is usually gaining value.',
    intro:
      'Depreciation is the strangest gift in the tax code: a deduction for wear on an asset that typically appreciates. Residential rentals depreciate over 27.5 years on the building value only — and the bill comes due at sale through recapture. This calculator shows both sides so the "paper loss" is never a surprise later.',
    howItWorks: [
      'Enter purchase price including closing costs (your starting basis).',
      'Enter the land share — from your county assessment; land never depreciates.',
      'Enter your marginal bracket to see the annual tax saved, and the 10-year recapture estimate.',
    ],
    faq: [
      {
        q: 'How is the 27.5-year deduction calculated?',
        a: '(Purchase price + closing costs − land value) ÷ 27.5, straight-line, starting the month the property is placed in service (mid-month convention: half a month for the first and last month). Residential rental is 27.5 years; commercial is 39. Appliances and improvements depreciate separately on faster schedules.',
      },
      {
        q: 'What is depreciation recapture?',
        a: 'When you sell, all depreciation you claimed (or could have claimed) is taxed as unrecaptured §1250 gain at up to 25% — even if you never took the deduction. It is deferral, not forgiveness. Strategies that legally avoid it: hold until death (stepped-up basis) or a 1031 exchange into the next property.',
      },
      {
        q: 'Should I do a cost segregation study instead?',
        a: 'For properties roughly $300k+, cost segregation reclassifies 20–30% of the building into 5/7/15-year property for front-loaded deductions — worth it for high-bracket owners, especially with bonus depreciation. The study runs $1,500–$5,000, so the property value and your bracket decide.',
      },
    ],
  },
  {
    slug: 'prorated-rent-calculator',
    title: 'Prorated Rent Calculator — Partial First Month Done Right',
    shortTitle: 'Prorated Rent',
    category: 'Everyday Money',
    description:
      'Free prorated rent calculator. Computes the partial first month from move-in day and days in month, with both actual-days and 30-day banker\'s-month methods.',
    tagline: 'Move in on the 14th, pay for 17 days. Not 30.',
    intro:
      'Mid-month move-ins mean partial rent, and the proration method matters more than people think — actual-days and 30-day-month conventions disagree by real money in February. This calculator shows both so tenants know what is fair and landlords charge what the lease says.',
    howItWorks: [
      'Enter the monthly rent.',
      'Enter the move-in day and the days in that month.',
      'Read the prorated amount under both conventions — then match whichever your lease specifies.',
    ],
    faq: [
      {
        q: 'Which proration method is correct?',
        a: 'Whichever the signed lease says — both are legal in most states. Actual-days (rent ÷ days in the month) is the fairest and most common; the banker\'s 30-day month is simpler but overcharges in February and undercharges in 31-day months. Some states mandate a specific method, so landlords should check local law.',
      },
      {
        q: 'Is the move-in day itself charged?',
        a: 'Conventionally yes — you pay from the day you get the keys. This calculator includes the move-in day. If your lease says occupancy starts the following day, subtract one day from the result.',
      },
      {
        q: 'Does the security deposit prorate too?',
        a: 'No — deposits are fixed (typically one month\'s rent) regardless of move-in day. Only rent prorates. Budget first month as: prorated rent + full deposit + any pet or admin fees.',
      },
    ],
  },
  {
    slug: 'employee-true-cost-calculator',
    title: 'Employee True Cost Calculator — What a Hire Really Costs',
    shortTitle: 'Employee True Cost',
    category: 'Freelance & Career',
    description:
      'Free employee cost calculator. Adds employer FICA, unemployment taxes, workers\' comp, health insurance, and 401(k) match to any salary for the true cost per hour and year.',
    tagline: 'A $50,000 salary is a $62,000 decision.',
    intro:
      'Salary is the sticker price, not the cost. Employers pay their own side of FICA, federal and state unemployment tax, workers\' comp, and whatever benefits they offer — typically 1.2× to 1.4× the salary. This calculator builds the real number so hiring, pricing, and "can I afford help" decisions use true costs.',
    howItWorks: [
      'Enter the gross salary.',
      'Add what you pay for health insurance, your state unemployment rate, workers\' comp rate, and any 401(k) match.',
      'Read the true annual cost, the multiplier, and the honest cost per hour.',
    ],
    faq: [
      {
        q: 'What percentage should I budget on top of salary?',
        a: 'The classic range is 1.25×–1.4× for benefits-plus-taxes. Taxes alone (employer FICA, FUTA, SUTA, workers\' comp) usually run 10–13%; health insurance adds $6,000–$15,000; a 3% retirement match adds 3%. Labor-intensive businesses price jobs off the loaded hourly cost, never the wage.',
      },
      {
        q: 'What is the employer share of payroll tax?',
        a: '7.65% of wages: 6.2% Social Security up to the $184,500 wage base (2026) plus 1.45% Medicare with no cap. Add FUTA at 0.6% on the first $7,000 and state unemployment at your assigned rate — new employers typically start around 2.7% on a state-specific wage base.',
      },
      {
        q: 'Is it cheaper to use a 1099 contractor?',
        a: 'On paper, yes — no employer taxes or benefits. But only if the working relationship is genuinely independent: the IRS reclassifies mislabeled employees and bills the employer for back taxes. Compare rates honestly with the 1099 vs W-2 calculator.',
      },
    ],
  },
  {
    slug: 'cash-runway-calculator',
    title: 'Cash Runway Calculator — Months Until the Money Runs Out',
    shortTitle: 'Cash Runway',
    category: 'Freelance & Career',
    description:
      'Free cash runway calculator. Simulates month-by-month burn with revenue growth to show exactly when cash hits zero — and when the business turns profitable.',
    tagline: 'Every business is a countdown clock. Know your number.',
    intro:
      'Runway is the only startup metric that is literally survival: months until cash hits zero. This calculator simulates it honestly — expenses against revenue that compounds at your growth rate — and shows both the optimistic case and the zero-growth case investors will ask for.',
    howItWorks: [
      'Enter cash on hand, monthly expenses, and current monthly revenue.',
      'Enter a realistic monthly revenue growth rate.',
      'Read the runway — then run it again at 0% growth for the conservative floor.',
    ],
    faq: [
      {
        q: 'How much runway should a small business keep?',
        a: 'Three to six months of expenses is the standard buffer for established businesses; pre-profit startups raising money want 12–18 months so a fundraise never happens from desperation. If runway is shrinking, the only three fixes are more revenue, less burn, or more capital — the math shows which lever matters most.',
      },
      {
        q: 'What is the difference between burn rate and runway?',
        a: 'Burn rate is the monthly net cash loss (expenses − revenue); runway is cash ÷ burn. Both lie if revenue is growing fast — compounding shortens burn over time, which is why this calculator simulates month by month instead of dividing once.',
      },
      {
        q: 'My runway is under 3 months. What now?',
        a: 'Cut burn before chasing revenue — cost cuts take effect this month, revenue takes effect next quarter. Founders also systematically overestimate growth; plan to the 0% case and treat any growth as margin of safety.',
      },
    ],
  },
  {
    slug: 'commercial-lease-calculator',
    title: 'Commercial Lease Calculator — True All-In Cost with NNN & Escalations',
    shortTitle: 'Commercial Lease',
    category: 'Freelance & Career',
    description:
      'Free commercial lease calculator. Combines base rent and NNN charges into the true per-sq-ft rate, then projects total lease cost over the term with annual escalations.',
    tagline: 'The $22/sq ft space costs $30/sq ft. Here is the math.',
    intro:
      'Commercial leases quote a base rate and bill the rest separately: taxes, insurance, and common-area maintenance (NNN), plus annual escalations that compound over the term. This calculator assembles the real all-in rate and the total 5-year commitment — the number to compare across spaces.',
    howItWorks: [
      'Enter the space size and the quoted base rent per square foot.',
      'Enter the NNN charges (ask the broker for the current actuals, not the estimate).',
      'Enter the annual escalation and term to see the total commitment and average monthly cost.',
    ],
    faq: [
      {
        q: 'What does NNN mean in a lease?',
        a: 'Triple net: the tenant pays property taxes, building insurance, and common-area maintenance on top of base rent — typically $6–$12/sq ft on top of the quoted rate. A gross lease bundles everything. Never compare a gross quote to a NNN quote without converting both to all-in rates.',
      },
      {
        q: 'How much do escalations really cost?',
        a: 'A 3% annual escalation on a 5-year lease adds about 6.2% to the total versus flat rent — on the default example here, $13,911 over the term. Escalations are negotiable at signing and nearly never negotiable after; caps and flat renewal options are worth real money.',
      },
      {
        q: 'What should I negotiate besides rate?',
        a: 'In order of dollar impact: tenant-improvement allowance (free build-out money), free rent months (1 month per year of term is common), the NNN reconciliation audit right, and assignment/sublet rights (your exit if the business moves or dies). Rate is the fourth thing, not the first.',
      },
    ],
  },
  {
    slug: 'hsa-growth-calculator',
    title: 'HSA Growth Calculator — The Triple Tax Advantage in Dollars',
    shortTitle: 'HSA Growth',
    category: 'Health & Life',
    description:
      'Free HSA growth calculator. Projects health savings account growth with 2026 IRS limits, annual tax savings at your marginal rate, and the advantage over a taxable account.',
    tagline: 'The only account that is tax-free three times.',
    intro:
      'An HSA is the most tax-favored account in the code: deductible going in, untaxed while it grows, untaxed coming out for medical costs. This calculator projects what maxing it actually becomes — and prices the difference versus investing the same money in a taxable account.',
    howItWorks: [
      'Pick your coverage type (2026 limits: $4,400 self-only / $8,750 family, IRS Rev. Proc. 2025-19).',
      'Enter contribution, years, expected return, and your combined marginal tax rate.',
      'Compare the HSA balance against the same dollars in a taxable account.',
    ],
    faq: [
      {
        q: 'What are the 2026 HSA limits?',
        a: '$4,400 for self-only HDHP coverage and $8,750 for family coverage, plus a $1,000 catch-up at 55+ (IRS Rev. Proc. 2025-19). Your HDHP must have a deductible of at least $1,700 self / $3,400 family and an out-of-pocket max under $8,500 / $17,000. Employer contributions count toward the same cap.',
      },
      {
        q: 'Should I spend the HSA or invest it?',
        a: 'If you can pay medical bills from cash flow, invest the HSA and save the receipts — there is no deadline to reimburse yourself, so a $3,000 ER visit in 2026 can be claimed tax-free in 2046 after two decades of growth. Keep receipts scanned and organized; the audit burden is yours.',
      },
      {
        q: 'What happens to my HSA at 65?',
        a: 'It becomes the best of both worlds: medical withdrawals stay tax-free forever, and non-medical withdrawals are simply taxed like a traditional IRA — the 20% penalty disappears at 65. Medicare premiums can even be paid from it. An overfunded HSA is never a problem.',
      },
    ],
  },
  {
    slug: 'health-plan-comparison-calculator',
    title: 'Health Plan Comparison Calculator — HDHP vs PPO Total Cost',
    shortTitle: 'Compare Health Plans',
    category: 'Health & Life',
    description:
      'Free health insurance plan comparison calculator. Totals premiums, deductible, coinsurance, and out-of-pocket max for two plans at your expected usage, with break-even analysis and HSA eligibility.',
    tagline: 'The cheaper premium is not the cheaper plan. Run the year, not the month.',
    intro:
      'Open enrollment forces a bet on your health for the next 12 months. This calculator prices both plans across the whole year — premiums plus what you would actually pay at your expected usage — and finds the break-even bill level where the answer flips.',
    howItWorks: [
      'Enter both plans\' premiums, deductibles, and out-of-pocket maximums.',
      'Enter your expected medical bills for the year (last year\'s EOBs are the best guess).',
      'Read the winner — then run a healthy year and a bad year to see the range.',
    ],
    faq: [
      {
        q: 'When does the high-deductible plan win?',
        a: 'When the annual premium savings exceed the extra exposure. Compare premium gap (×12) against the deductible gap: if premiums save $2,400/yr and the deductible is $2,500 higher, the HDHP wins in any year you stay healthy and roughly breaks even in a bad one — plus it unlocks the HSA, worth $1,300+/yr more in tax savings at a 30% rate.',
      },
      {
        q: 'What does this calculator not capture?',
        a: 'Copay structures (common in PPOs for office visits and prescriptions), network differences, and employer HSA contributions — an employer seed of $1,000 into the HSA is real money that belongs in the Plan A column. Also check whether your specific doctors and drugs are covered; no math fixes a bad network.',
      },
      {
        q: 'How do I estimate my medical bills?',
        a: 'Pull last year\'s explanation-of-benefits statements and total the allowed amounts, then adjust for known changes (a planned surgery, a new prescription, a pregnancy). Then run three scenarios: healthy year (routine visits only), expected year, and bad year (hit the out-of-pocket max). The right plan wins your expected year without catastrophic regret in the bad one.',
      },
    ],
  },
  {
    slug: 'cobra-cost-calculator',
    title: 'COBRA Cost Calculator — COBRA vs Marketplace After Job Loss',
    shortTitle: 'COBRA vs Marketplace',
    category: 'Health & Life',
    description:
      'Free COBRA cost calculator. Shows the 102% full-premium COBRA price, the sticker shock versus your old payroll deduction, and the marketplace alternative with subsidies.',
    tagline: 'Your $150 plan is about to cost $714. Know before you elect.',
    intro:
      'The COBRA letter shocks everyone the same way: the plan that cost $150/month now costs $714, because you were never paying the real premium. This calculator shows the statutory 102% price, the monthly shock, and the marketplace alternative — so the 60-day election window gets used on math, not panic.',
    howItWorks: [
      'Enter the full monthly premium (your old share plus the employer\'s — HR or the COBRA letter has it).',
      'Enter a marketplace premium and any subsidy you qualify for.',
      'Enter months needed and compare totals for the coverage gap.',
    ],
    faq: [
      {
        q: 'Why is COBRA so expensive?',
        a: 'Because employers typically pay 70–85% of the real premium invisibly. COBRA charges you the full premium plus a 2% admin fee — 102% by statute. Nothing about the plan got worse; you are just finally seeing the price. The silver lining: it is the same network and deductible progress you already had.',
      },
      {
        q: 'When is COBRA actually the right choice?',
        a: 'Three cases: you have already met most of this year\'s deductible (a new plan resets it to zero), your specific doctors or ongoing treatment are in the old network, or the gap is one or two months and the hassle premium is worth it. Otherwise the marketplace usually wins on price — especially with a subsidy.',
      },
      {
        q: 'What are the deadlines?',
        a: 'You have 60 days from losing coverage (or the notice, whichever is later) to elect COBRA, and it can be retroactive to the loss date — so you can wait, stay uninsured briefly, and elect only if a big bill appears. Job loss is also a 60-day Special Enrollment Period for the marketplace. Missing both windows means waiting for open enrollment.',
      },
    ],
  },
  {
    slug: 'home-affordability-calculator',
    title: 'Home Affordability Calculator — How Much House Can I Afford? (28/36 Rule)',
    shortTitle: 'Home Affordability',
    category: 'Loans & Debt',
    description:
      'Free home affordability calculator. Works backward from income and debts using the 28/36 rule to a maximum home price — with taxes, insurance, HOA, and PMI already inside the number.',
    tagline: 'Lenders tell you the ceiling. This shows the ceiling and the comfortable floor.',
    intro:
      'Every affordability answer online stops at "multiply your income by three." This calculator works backward properly: it applies the 28/36 debt-to-income rule lenders actually use, then solves for the home price with property tax, insurance, HOA, and PMI already inside the payment — so the price you get is a true ceiling, not a loan amount that forgets the escrow.',
    howItWorks: [
      'Enter gross annual income, monthly debt payments, and your saved down payment.',
      'Enter the mortgage rate, term, property tax rate, insurance, HOA, and PMI rate.',
      'Get the maximum price under the 28/36 rule and a comfortable price under 25/33, with the full monthly payment breakdown at the max.',
    ],
    faq: [
      {
        q: 'What is the 28/36 rule?',
        a: 'The guideline most lenders underwrite to: housing costs (principal, interest, taxes, insurance, HOA, PMI) should stay under 28% of gross monthly income, and housing plus all other debt payments under 36%. This calculator applies the stricter of the two — so if you carry a car loan or student debt, the back-end ratio is usually what actually caps you.',
      },
      {
        q: 'Why is my number lower than what a lender pre-approved me for?',
        a: 'Lenders routinely approve up to 43–50% back-end DTI on conventional and FHA loans — their ceiling is set by default statistics, not by your savings goals. The 28/36 number here is the classic conservative answer, and the 25/33 "comfortable" price is what leaves room for retirement contributions, maintenance surprises, and a life. Being approved for more is not a reason to spend more.',
      },
      {
        q: 'How much does PMI actually cost me?',
        a: 'With less than 20% down, private mortgage insurance typically runs 0.3–1.5% of the loan per year (0.5% is a fair planning default) — on a $265,000 loan that is roughly $110 a month, and it buys you nothing but the lender\'s protection. This calculator includes PMI in the price solution when your down payment is under 20%, which is why maxing the down payment can move the affordable price more than expected.',
      },
      {
        q: 'Does this include closing costs and moving?',
        a: 'No — the down payment field should be only what you can put down AFTER setting aside 2–5% of the price for closing costs and your moving budget. Run the Closing Costs and Moving Cost calculators next, and keep a post-move emergency fund out of the down payment pile entirely.',
      },
    ],
  },
  {
    slug: 'fha-loan-calculator',
    title: 'FHA Loan Calculator — True Payment with UFMIP & MIP (2026)',
    shortTitle: 'FHA Loan',
    category: 'Loans & Debt',
    description:
      'Free FHA loan calculator. Includes the 1.75% upfront MIP financed into the loan, annual MIP at HUD 2026 rates (0.55%/0.50%/0.15%), MIP duration rules, and the 2026 loan limit floor.',
    tagline: 'The FHA payment is never just P&I — here is the real monthly number.',
    intro:
      'FHA loans let you buy with 3.5% down and a 580 credit score — but the payment quote you see online almost never includes both layers of mortgage insurance. This calculator finances the 1.75% upfront MIP into the loan, applies the correct annual MIP rate from HUD Mortgagee Letter 2023-05 for your exact LTV and term, and totals what MIP costs over its entire life.',
    howItWorks: [
      'Enter the home price, down payment percent, rate, and term (30 or 15 years).',
      'The calculator computes the base loan, adds financed UFMIP, and picks the MIP rate and duration from your LTV.',
      'See the true monthly payment (PITI + MIP), total interest, and lifetime MIP cost — plus a flag if you exceed the 2026 FHA limit floor.',
    ],
    faq: [
      {
        q: 'How much is FHA mortgage insurance in 2026?',
        a: 'Two pieces: a 1.75% upfront premium (almost always financed into the loan) and an annual premium of 0.55% for 30-year loans with under 5% down, 0.50% with 5–10% down, and 0.15–0.40% on 15-year loans. On a typical $344,000 financed FHA loan that is about $158 a month — before it declines slowly with the balance.',
      },
      {
        q: 'Does FHA MIP ever go away?',
        a: 'Only if you put 10% or more down — then annual MIP ends automatically after 11 years. With less than 10% down (including the standard 3.5%), MIP runs for the entire loan term, and the only exit is refinancing into a conventional loan once you have the equity and credit. It does NOT cancel at 78% LTV the way conventional PMI does.',
      },
      {
        q: 'What is the 2026 FHA loan limit?',
        a: 'The one-unit floor is $541,287 in standard counties, rising to $1,249,125 in high-cost areas (per HUD Mortgagee Letter 2025-23). This calculator flags when your base loan exceeds the floor so you know to check your county limit at hud.gov.',
      },
      {
        q: 'Is a 15-year FHA loan worth it for the lower MIP?',
        a: 'The MIP rate drops to 0.15% with 10%+ down on a 15-year term — on a $300,000 loan that saves over $1,200 a year in insurance alone, and MIP expires at year 11. But the higher P&I payment is permanent, so run both terms here and compare total monthly, not just the insurance line.',
      },
    ],
  },
  {
    slug: '15-year-mortgage-calculator',
    title: '15 vs 30 Year Mortgage Calculator — Interest Saved & Invest-the-Difference',
    shortTitle: '15 vs 30 Year',
    category: 'Loans & Debt',
    description:
      'Free 15 vs 30 year mortgage calculator. Compares payments and lifetime interest, then runs the honest test: investing the payment difference versus the 15-year payoff.',
    tagline: 'Same house, same monthly outlay — which strategy ends richer at year 30?',
    intro:
      'The 15-vs-30 debate is usually argued with vibes: "interest saved" versus "flexibility." This calculator runs the complete comparison — both homes owned free and clear at year 30, both strategies spending the same monthly amount, with the difference invested at your assumed return. The answer depends on one number: whether your investment return beats the 15-year rate.',
    howItWorks: [
      'Enter the loan amount, the 30-year and 15-year rates you are quoted, and your expected investment return.',
      'See both payments, lifetime interest on each, and the interest saved by the shorter term.',
      'The wealth table compares investing the payment difference (30-year) against investing the full payment after payoff (15-year) — same outlay, honest math.',
    ],
    faq: [
      {
        q: 'How much interest does a 15-year mortgage actually save?',
        a: 'On a $320,000 loan at typical spreads (6.5% vs 5.9%), roughly $245,000 — about 60% less total interest. But the raw savings number is not the decision: the question is whether the higher payment beats what you would earn investing the difference, which is exactly what the wealth table computes.',
      },
      {
        q: 'Is it smarter to invest the difference instead?',
        a: 'Only if your investment return reliably beats the 15-year mortgage rate — paying down a 5.9% loan is a guaranteed, tax-free 5.9% return. At a 5% expected investment return the 15-year wins; at 8% the 30-year-plus-investing wins on paper. The behavioral catch: the strategy fails completely if the difference gets spent instead of invested.',
      },
      {
        q: 'Why is the 15-year rate lower?',
        a: 'Lenders price shorter terms lower because their money is at risk for half the time — the spread typically runs 0.5–0.75 percentage points. That spread is a second, often ignored, source of savings on top of the shorter amortization.',
      },
      {
        q: 'What about a compromise — 30-year loan, pay it like a 15?',
        a: 'That preserves flexibility (drop back to the lower required payment in a bad month) but you pay the higher 30-year rate for the privilege — roughly 0.6% more on the full balance. On $320,000 that insurance policy costs about $120 a month in extra interest. Some buyers happily pay it; run your exact spread here.',
      },
    ],
  },
  {
    slug: 'va-loan-calculator',
    title: 'VA Loan Calculator — Zero Down, Funding Fee & 3-Way Comparison (2026)',
    shortTitle: 'VA Loan',
    category: 'Loans & Debt',
    description:
      'Free VA loan calculator. Funding fee financed at current VA rates, exemption check, no PMI ever — and a side-by-side monthly comparison against FHA and conventional on the same house.',
    tagline: 'Zero down, zero monthly insurance — but the funding fee deserves math too.',
    intro:
      'The VA loan is the strongest mortgage benefit in the country: no down payment, no monthly mortgage insurance at any LTV, and typically the lowest rates. The one cost is the funding fee — 2.15% for first use with nothing down — and most calculators ignore it. This one finances it properly, checks your exemption, and compares the same house across VA, FHA, and conventional so the benefit shows up in dollars.',
    howItWorks: [
      'Enter the home price, down payment (0% is the standard VA structure), rate, and term.',
      'Mark first or subsequent use, and check the exemption box if you have a service-connected disability rating.',
      'See the true monthly payment with the fee financed, then compare the same house as FHA (3.5% down + lifetime MIP) and conventional (5% down + PMI).',
    ],
    faq: [
      {
        q: 'Do VA loans really need no down payment?',
        a: 'Yes — 0% down with full entitlement, and no monthly mortgage insurance regardless. There is also no VA loan limit with full entitlement since 2020; lenders will still cap you by income and DTI. Partial entitlement after a previous VA default can bring a down payment requirement back.',
      },
      {
        q: 'What is the VA funding fee in 2026?',
        a: 'For purchase loans (schedule effective April 7, 2023, still current): first use with under 5% down is 2.15% of the loan; 5–9.99% down drops it to 1.5%; 10%+ to 1.25%. Subsequent use with under 5% down is 3.3%. It is almost always financed into the loan. Veterans with service-connected disability ratings, DIC recipients, and active-duty Purple Heart recipients pay nothing.',
      },
      {
        q: 'VA vs FHA — how big is the difference really?',
        a: 'On a $400,000 home: VA at 0% down runs about $3,032/month all-in with $0 down. FHA at 3.5% down runs about $3,115/month AND needs $14,000 upfront — plus its MIP never expires, while the VA funding fee is a one-time cost. Over a 30-year hold, FHA\'s lifetime MIP alone adds roughly $40,000 the VA loan never charges.',
      },
      {
        q: 'Should I put money down on a VA loan anyway?',
        a: 'Only for two reasons: 5% down cuts the funding fee from 2.15% to 1.5% (10% cuts it to 1.25%), and a down payment lowers the payment if your budget is tight. Otherwise the math usually favors keeping the cash — invest it or hold it as reserves rather than prepaying a loan with no insurance penalty.',
      },
    ],
  },
  {
    slug: 'refinance-break-even-calculator',
    title: 'Refinance Break-Even Calculator — Months to Recoup & True Savings',
    shortTitle: 'Refinance Break-Even',
    category: 'Loans & Debt',
    description:
      'Free refinance calculator. Break-even months, honest horizon math (payments plus remaining debt), and the reset-the-clock warning when a lower payment hides higher total interest.',
    tagline: 'A lower payment is not the same as saving money. Here is the difference.',
    intro:
      'Refinance pitches lead with the monthly payment drop because it always looks good — even when the new loan costs more in total. This calculator gives you the break-even month, then the rigorous version: everything you pay plus everything you still owe at the month you plan to leave, on both paths. And it warns you when resetting to a new 30-year clock quietly raises your lifetime interest.',
    howItWorks: [
      'Enter your current balance, rate, and remaining term from your latest statement.',
      'Enter the quoted new rate, new term, and the closing costs from the Loan Estimate.',
      'Set how long you plan to stay — the horizon comparison, not the monthly drop, is the real answer.',
    ],
    faq: [
      {
        q: 'How do I calculate refinance break-even?',
        a: 'Closing costs ÷ monthly payment savings. $4,500 in costs with a $336 monthly saving breaks even in about 13 months — leave before that and the refi cost you money, stay past it and you are ahead. But break-even alone misses the clock reset: a new 30-year term on a loan with 27 years left adds three years of payments.',
      },
      {
        q: 'Is a lower monthly payment always worth it?',
        a: 'No — the payment can drop while total interest rises, whenever the new term is longer than your remaining one. On a $320,000 balance, dropping from 7.5% to 6.25% with a fresh 30-year clock saves $336 a month but can still add interest versus finishing the current loan. The horizon table above compares outlay plus remaining debt so the trade is visible.',
      },
      {
        q: 'What closing costs should I expect on a refinance?',
        a: 'Typically 2–3% of the loan: origination, appraisal, title, and recording fees. Use line J of the Loan Estimate — and be skeptical of "no-closing-cost" refis, which either raise the rate (lender credit) or roll costs into the balance. Both are fine choices; neither is free.',
      },
      {
        q: 'Does the old rule about waiting for a 1% rate drop hold?',
        a: 'It is a decent first filter, nothing more. On large balances a 0.5% drop can pay back in a year; on a small balance with five years left, even 2% may never recoup the closing costs. Balance, spread, term reset, and years-stayed decide it — which is why they are the inputs here.',
      },
    ],
  },
  {
    slug: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator — Snowball vs Avalanche, Exact Dates & Interest',
    shortTitle: 'Debt Payoff (Snowball vs Avalanche)',
    category: 'Loans & Debt',
    description:
      'Free debt payoff calculator. Enter up to 3 debts with balances, rates, and minimums — compare snowball vs avalanche with exact payoff months, total interest, and what extra payments save.',
    tagline: 'Two strategies, one winner — and the exact month you are free.',
    intro:
      'Every "snowball or avalanche" article argues philosophy. This calculator settles it with your actual debts: a month-by-month simulation of both strategies — minimums everywhere, your extra money aimed at the target, freed payments rolling forward — showing the payoff date and total interest for each, plus what your extra payment is worth versus minimums alone.',
    howItWorks: [
      'Enter each debt\'s balance, interest rate, and minimum payment (up to three).',
      'Add the extra amount you can pay monthly beyond the minimums.',
      'Compare avalanche (highest rate first) against snowball (smallest balance first) — payoff month, total interest, and the gap between them.',
    ],
    faq: [
      {
        q: 'Which is better — snowball or avalanche?',
        a: 'Avalanche (highest interest rate first) always wins mathematically. Snowball (smallest balance first) wins behaviorally — Northwestern researchers found the early quick win keeps people paying. The honest answer: run yours here. If the interest gap is a few hundred dollars, pick whichever you will actually finish; if it is thousands, find a way to love the avalanche.',
      },
      {
        q: 'How much does an extra $200 a month really matter?',
        a: 'On a typical three-debt pile ($23,000 across a card, medical bill, and car loan), $200 extra cuts roughly 20 months and $4,600 in interest versus minimums alone. The freed minimums rolling into the next target are the engine — the strategy compounds.',
      },
      {
        q: 'My minimum payment does not cover the interest. What now?',
        a: 'That is negative amortization — the balance grows even when you pay on time, and no strategy fixes it. Raise that payment above the interest first (the calculator flags this), call the issuer about hardship rates, or look at a lower-rate consolidation loan. Then run both strategies.',
      },
      {
        q: 'Should I consolidate instead?',
        a: 'Consolidation helps when the new rate is clearly below your weighted average AND you do not run the cards back up — the second part is where it usually fails. Run your debts here first; if the avalanche finishes in under 3 years, the discipline path often beats the new loan.',
      },
    ],
  },
  {
    slug: 'dti-calculator',
    title: 'DTI Calculator — Debt-to-Income Ratio Lenders Use (Front & Back End)',
    shortTitle: 'DTI Calculator',
    category: 'Loans & Debt',
    description:
      'Free debt-to-income calculator. Front-end and back-end DTI with the exact thresholds lenders use — 28/36 comfortable, 43% conventional, 50% FHA — and the housing payment you have room for.',
    tagline: 'The single number that decides your mortgage, computed the lender\'s way.',
    intro:
      'DTI is the gate every loan application walks through first, and it is computed in a way that surprises people: gross income, not take-home, against housing plus minimum debt payments. This calculator shows both ratios, grades them against the real lending tiers, and converts the rules into the number you actually need — how much housing payment you have room for.',
    howItWorks: [
      'Enter gross monthly income (before taxes) and your housing payment — current or proposed.',
      'Add car, student loan, credit card minimums, and other monthly debt payments.',
      'Read front-end and back-end DTI, your lender tier, and the max housing payment under each rule.',
    ],
    faq: [
      {
        q: 'What DTI do lenders actually require?',
        a: 'Conventional loans cap at 43% back-end for most borrowers (45–50% with strong compensating factors), FHA stretches to about 50%, and VA has no hard cap but uses residual income tests. The classic 28/36 rule (28% housing, 36% total) is the comfortable zone — approval above it is possible, but the budget gets tight fast.',
      },
      {
        q: 'What counts as income and debt in DTI?',
        a: 'Income is gross — before taxes — including salary, documented overtime, and provable side income. Debts are the minimum payments on your credit report: cards, car, student loans, personal loans, plus court-ordered payments. Renters: your CURRENT rent does not count once you are applying with a mortgage payment. Utilities, groceries, and subscriptions never count.',
      },
      {
        q: 'My DTI is too high — what moves it fastest?',
        a: 'Paying OFF a small debt beats paying DOWN a big one: eliminating a $250/month car payment drops your back-end by 3+ points instantly, while the same cash against a credit card balance barely moves the minimum. The second lever is a co-borrower\'s income. Run both scenarios here before touching anything.',
      },
      {
        q: 'Is DTI computed before or after taxes?',
        a: 'Before — lenders use gross income, which is why the approved payment always feels larger than your real budget can hold. Use the 36% "comfortable" row for planning your life and the 43% row only to know what you could be approved for.',
      },
    ],
  },
  {
    slug: 'car-affordability-calculator',
    title: 'Car Affordability Calculator — How Much Car Can I Afford? (20/4/10 Rule)',
    shortTitle: 'Car Affordability',
    category: 'Loans & Debt',
    description:
      'Free car affordability calculator. Works backward from income using the 20/4/10 rule — insurance and fuel inside the cap — to the maximum car price and a stretch ceiling.',
    tagline: 'The dealer asks "what payment do you want?" Ask the better question first.',
    intro:
      'Dealers sell payments because payments hide prices. This calculator works backward: the 20/4/10 rule (20% down, 4-year max loan, transport under 10% of gross income) with insurance and fuel already inside the cap — so the price it gives you is the whole-car answer, not a loan amount that forgets the insurance bill doubles on a new car.',
    howItWorks: [
      'Enter gross monthly income and your insurance and fuel estimates.',
      'Set the loan rate, term, and down payment percent.',
      'Get the max price under the 10% transport cap, plus the absolute 15% stretch ceiling.',
    ],
    faq: [
      {
        q: 'What is the 20/4/10 rule for cars?',
        a: '20% down, a loan no longer than 4 years, and total transport costs — payment, insurance, fuel — under 10% of gross income. It is stricter than what lenders approve on purpose: cars depreciate roughly 20% in year one, so a long loan on a new car means years of owing more than the car is worth.',
      },
      {
        q: 'Why is my number so much lower than what the dealer approved me for?',
        a: 'Because the dealer\'s math stops at the payment fitting your DTI — 72- and 84-month loans exist to make any price "fit." The 10% cap here includes insurance and fuel, which is where new-car budgets actually break. If the rule\'s price feels low, that is the information: the car market\'s norms are the outlier, not the rule.',
      },
      {
        q: 'Is a longer loan ever okay if the rate is low?',
        a: 'At 0–3% promotional rates, stretching the term costs little in interest — but it still extends the underwater years, and one accident or job change while upside-down turns a car problem into a debt problem. If you must stretch, gap insurance and a bigger down payment are the seatbelts.',
      },
      {
        q: 'What about used cars?',
        a: 'The rule works even better used: someone else paid the brutal first-year depreciation, reliability data exists, and insurance runs cheaper. A 3-year-old car at 65% of the new price with 80% of the life left is usually the value sweet spot.',
      },
    ],
  },
  {
    slug: 'lease-vs-buy-calculator',
    title: 'Lease vs Buy Car Calculator — True Cost with Equity & Money Factor APR',
    shortTitle: 'Lease vs Buy (Car)',
    category: 'Loans & Debt',
    description:
      'Free lease vs buy calculator. Compares total outlay minus what you still own, converts money factor to APR (×2400), and shows what happens after the lease ends.',
    tagline: 'Leasing is renting depreciation. Here is the receipt.',
    intro:
      'The lease pitch is always the lower monthly payment. This calculator runs the honest version over the lease term: total outlay on both sides, minus the equity you still own if you buy, plus the money factor converted to a real APR — because MF 0.00167 is 4% and dealers quote it precisely because it looks small.',
    howItWorks: [
      'Enter the car price, lease payment, due-at-signing, and lease term.',
      'Enter the buy scenario: down payment, loan rate and term, and resale value at the horizon.',
      'Compare total outlay, net cost after equity, and the lease\'s APR equivalent.',
    ],
    faq: [
      {
        q: 'Is leasing ever cheaper than buying?',
        a: 'Over a single 3-year horizon, leasing sometimes costs less in pure outlay — you are only paying for the steepest depreciation years. The trap is the day after: the leaseholder owns nothing and starts over at full price, while the buyer\'s payments end at month 60 and the car keeps going. Over 6+ years buying almost always wins by thousands.',
      },
      {
        q: 'What is a money factor and how do I compare it to an APR?',
        a: 'Multiply by 2400. A money factor of 0.00167 is a 4.0% APR; 0.00250 is 6%. Dealers quote the tiny decimal because it feels trivial — always convert before signing, and negotiate it exactly like an interest rate. Anything above the current prime-ish rates is markup.',
      },
      {
        q: 'What costs does this comparison leave out?',
        a: 'Mileage overage fees (typically 15–30¢ per mile past 10–12K/year), wear-and-tear charges, and disposition fees at lease end — all of which push real lease costs above the advertised payment. On the buy side, maintenance rises after warranty. If you drive over 12,000 miles a year, leasing\'s fine print usually ends the debate.',
      },
      {
        q: 'Who should actually lease?',
        a: 'People who genuinely want a new car every 3 years and would trade in anyway (leasing just structures that habit), and business owners who can deduct lease payments. For everyone else, buying a slightly older car and keeping it past the loan is the wealth move.',
      },
    ],
  },
  {
    slug: 'car-true-cost-calculator',
    title: 'Car True Cost Calculator — Cost Per Mile & Per Month (Depreciation Included)',
    shortTitle: 'Car True Cost',
    category: 'Everyday Money',
    description:
      'Free car true cost calculator. Depreciation, insurance, fuel, maintenance, registration, and interest combined into real cost per mile and per month.',
    tagline: 'The payment is a third of it. Here is the whole bill.',
    intro:
      'A $700 car payment feels like the cost of the car. It is not — depreciation, insurance, fuel, maintenance, registration, and loan interest roughly double it. This calculator totals all of it into the two numbers that matter: true cost per month and per mile, so comparisons against transit, used cars, or keeping the old one alive are honest.',
    howItWorks: [
      'Enter purchase price, years kept, and expected resale percent.',
      'Add loan terms, insurance, annual miles, fuel economy and price, maintenance, and registration.',
      'Read the true monthly and per-mile cost — depreciation shown separately because it is the cost nobody feels.',
    ],
    faq: [
      {
        q: 'What does a car really cost per mile in 2026?',
        a: 'AAA pegs a new car around $0.80–0.90 per mile all-in at 12,000 miles a year — our default scenario lands at $0.84. The biggest line is not fuel: it is depreciation, typically $3,000–5,000 a year on a new car, invisible because it only shows up when you sell.',
      },
      {
        q: 'Why does depreciation get its own line?',
        a: 'Because it is the largest cost and the only one with no monthly bill. A $38,000 car worth $17,000 after 5 years spent $4,200 a year evaporating — more than fuel and insurance combined for most drivers. Buying 3 years old lets someone else pay the steepest part of that curve.',
      },
      {
        q: 'How do I lower the per-mile number?',
        a: 'Keep the car longer (depreciation flattens after year 5 while reliability holds), buy used, and drive it more — per-mile cost falls as fixed costs spread. The worst move is the common one: trading a new car every 3 years, which concentrates the steepest depreciation into every year you own.',
      },
      {
        q: 'Is an EV cheaper per mile?',
        a: 'Usually on fuel and maintenance (charging at home runs 3–5¢/mile versus 12–15¢ for gas), often not on depreciation and insurance yet. Run both here — swap the fuel line for your kWh cost and compare the per-mile numbers directly.',
      },
    ],
  },
  {
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator — Assets Minus Debts, Benchmarked Against the Fed Data',
    shortTitle: 'Net Worth',
    category: 'Savings & Investing',
    description:
      'Free net worth calculator. Add assets and debts, see your net worth, debt-to-asset ratio, and how you compare to the Federal Reserve household median.',
    tagline: 'One number that summarizes your entire financial life.',
    intro:
      'Income is a flow; net worth is the scoreboard. This calculator totals what you own (cash, investments, retirement, home equity, property) and subtracts what you owe (mortgage, student, car, cards), then benchmarks the result against the Federal Reserve\'s Survey of Consumer Finances so the number has context, not just digits.',
    howItWorks: [
      'Enter current market values for assets — what things would sell for today, not what you paid.',
      'Enter every liability balance: mortgage, student loans, car loans, credit cards, other debts.',
      'Read net worth, the debt-to-asset ratio, and where you stand versus the US household median.',
    ],
    faq: [
      {
        q: 'What is the median US household net worth?',
        a: '$192,900, per the Federal Reserve\'s 2022 Survey of Consumer Finances (the triennial gold standard, published October 2023). The mean is $1,063,700 — the enormous gap between mean and median is wealth concentration at the top, which is why the median is the honest benchmark.',
      },
      {
        q: 'Should I count my house in net worth?',
        a: 'Yes, but honestly: market value minus mortgage balance is your home equity, and that is what counts. This calculator also shows what share of your assets are illiquid — a high net worth that is 90% house cannot pay for an emergency.',
      },
      {
        q: 'What is a good debt-to-asset ratio?',
        a: 'Under 40% is comfortable; over 60% means debt is compounding against you faster than assets compound for you. The ratio matters more than the absolute number — a $50,000 net worth with no debt beats a $200,000 one that is 80% leveraged.',
      },
    ],
  },
  {
    slug: 'cost-of-living-comparison-calculator',
    title: 'Cost of Living Comparison Calculator — Salary Equivalence Between States (BEA Data)',
    shortTitle: 'Cost of Living Compare',
    category: 'Everyday Money',
    description:
      'Free cost of living comparison calculator using official BEA Regional Price Parities. See the salary you would need in another state to keep the same buying power.',
    tagline: 'A $85,000 offer in California is not the same $85,000.',
    intro:
      'Comparing salaries across states with nominal dollars is how people accidentally take pay cuts. This calculator uses the Bureau of Economic Analysis Regional Price Parities — the official measure of state price levels — to compute the salary that preserves your exact purchasing power after a move.',
    howItWorks: [
      'Enter your current salary and pick the state you are leaving and the state you are considering.',
      'Read the equivalent salary: the number that buys the same life in the destination state.',
      'Optionally override with a metro-level index if you have one — state averages hide big city gaps.',
    ],
    faq: [
      {
        q: 'Where does the data come from?',
        a: 'The Bureau of Economic Analysis Regional Price Parities, all items, 2023 (released December 12, 2024) — the same dataset the Federal Reserve and researchers use to compute real income by state. California is the most expensive state at 112.6; Arkansas the least at 86.5, with the national average at 100.',
      },
      {
        q: 'Is the equivalent salary really what I should ask for?',
        a: 'It is the floor for a lateral move in living standards, not the ask. Ask for more — but if an offer comes in below the equivalent, you are accepting a real-terms pay cut no matter how big the nominal number looks.',
      },
      {
        q: 'Why add taxes separately?',
        a: 'RPP measures prices, not taxes — and a move from Texas to California swaps a 0% income tax for one of the highest. Run both states through the paycheck calculator and combine the two answers for the full picture.',
      },
    ],
  },
  {
    slug: 'raise-worth-calculator',
    title: 'Raise Calculator — What a Raise Is Worth After Taxes (2026 Brackets)',
    shortTitle: 'Raise Worth After Tax',
    category: 'Freelance & Career',
    description:
      'Free raise calculator. See what a percentage raise is actually worth after federal, FICA, and state taxes — per year, per month, and per paycheck, with 2026 brackets.',
    tagline: 'The raise is 5%. What lands in your check is not.',
    intro:
      'A 5% raise never arrives as 5% more take-home — federal brackets, Social Security, Medicare, and state tax each take their cut first. This calculator applies 2026 tax brackets to just the new dollars and shows the after-tax raise per paycheck, plus your true marginal rate on new income.',
    howItWorks: [
      'Enter your current salary and the raise percentage (or back into it from a new offer).',
      'Set filing status and a flat state estimate.',
      'Read the after-tax raise per year, month, and biweekly paycheck — and the keep rate.',
    ],
    faq: [
      {
        q: 'Will a raise push me into a higher tax bracket and cost me money?',
        a: 'No — that is the most persistent myth in personal finance. Brackets are marginal: only the dollars above a threshold pay the higher rate, never your whole salary. A raise always increases your take-home. The table shows your exact marginal rate on the new dollars.',
      },
      {
        q: 'How much of a raise do I typically keep?',
        a: 'For most single filers in the 12% or 22% federal brackets, roughly 70–80 cents per raise dollar after federal income tax, Social Security (6.2%), Medicare (1.45%), and a typical state rate. At default settings — $62,000 salary, 5% raise — it is $2,336 of the $3,100, a 75.4% keep rate.',
      },
      {
        q: 'Should I negotiate gross or after-tax?',
        a: 'Negotiate gross, but think after-tax. A $5,000 bump is ~$140 per biweekly check after taxes for most people — knowing that number keeps negotiations honest about what the raise actually buys.',
      },
    ],
  },
  {
    slug: 'w4-withholding-calculator',
    title: 'W-4 Withholding Calculator — Dial In the Exact Per-Paycheck Amount (2026)',
    shortTitle: 'W-4 Withholding',
    category: 'Everyday Money',
    description:
      'Free W-4 withholding calculator. Enter your paystub numbers and see the exact per-check withholding that lands you at zero owed — no giant refund, no surprise bill.',
    tagline: 'A big refund is an interest-free loan you gave the IRS.',
    intro:
      'Most W-4 advice stops at "check a box." This calculator does the real work: from your salary, year-to-date withholding, and paychecks remaining, it computes your actual 2026 federal liability and the exact per-check amount that hits your target — so April brings neither a surprise bill nor a refund you could have been investing all year.',
    howItWorks: [
      'Grab your latest paystub: enter annual salary, federal withheld year-to-date, and current per-check withholding.',
      'Enter how many paychecks remain this year and your target refund (zero is optimal).',
      'Read the exact per-check withholding to set on W-4 Line 4(c), and your projected year-end position.',
    ],
    faq: [
      {
        q: 'Is a big tax refund a good thing?',
        a: 'No — it means you overpaid every paycheck and got the excess back months later with zero interest. A $4,600 refund is $177 per biweekly check that could have been in a Roth IRA compounding instead. This calculator\'s default target is exactly $0 for that reason.',
      },
      {
        q: 'How do I actually change my withholding?',
        a: 'Submit a new Form W-4 to payroll. To withhold a specific extra amount per check, put it on Line 4(c) — that is exactly what this calculator computes. Changes usually take effect within one or two pay cycles.',
      },
      {
        q: 'Why does my withholding never match my real tax bill?',
        a: 'Because payroll annualizes each check in isolation — a big commission check gets taxed as if you earn that every check. Pre-tax 401(k) and HSA contributions also lower your liability below what the standard tables assume. Mid-year correction with real paystub numbers is the only accurate fix.',
      },
    ],
  },
  {
    slug: 'bonus-tax-calculator',
    title: 'Bonus Tax Calculator — Why Your Bonus Check Looks Overtaxed (22% Flat Rate)',
    shortTitle: 'Bonus Tax',
    category: 'Everyday Money',
    description:
      'Free bonus tax calculator. See the 22% flat supplemental withholding versus your true marginal liability on a bonus — and whether the gap comes back as a refund.',
    tagline: 'Your bonus isn\'t taxed higher. It\'s withheld higher.',
    intro:
      'The shock of a bonus check missing a third of its value is withholding, not tax. Payroll applies a flat 22% federal rate to supplemental wages, but your actual liability is the bonus stacked on your salary at marginal 2026 brackets. This calculator shows both numbers and what the difference means at filing time.',
    howItWorks: [
      'Enter your base salary, bonus amount, filing status, and a flat state estimate.',
      'See what payroll withholds (22% flat federal + FICA + state) versus your true tax on the bonus.',
      'Read the refund gap — for most filers, part of the withholding comes back in April.',
    ],
    faq: [
      {
        q: 'Are bonuses taxed at a higher rate than salary?',
        a: 'No. Bonuses are ordinary income taxed at your regular marginal brackets. They only LOOK overtaxed because employers withhold a flat 22% federal on supplemental wages (IRS rule for bonuses under $1M). At filing, the withholding is credited against your real liability and any excess refunds.',
      },
      {
        q: 'When would I actually owe more than the 22% withheld?',
        a: 'When your salary plus bonus puts your top dollars in the 24%, 32%, or higher brackets — roughly above $105,700 taxable for single filers in 2026. In that case the flat withholding falls short and setting aside the difference avoids an April surprise.',
      },
      {
        q: 'Can I reduce the tax on a bonus?',
        a: 'The cleanest lever: increase your pre-tax 401(k) contribution for the bonus paycheck — every dollar deferred dodges your marginal rate (22% or 24% for most bonus recipients) plus state tax. An HSA contribution works the same way if you are eligible.',
      },
    ],
  },
  {
    slug: 'marginal-tax-bracket-calculator',
    title: 'Marginal Tax Bracket Calculator 2026 — Visualize Every Bracket Your Income Fills',
    shortTitle: 'Tax Bracket Visualizer',
    category: 'Everyday Money',
    description:
      'Free 2026 tax bracket calculator. See your income fill each federal bracket, your marginal versus effective rate, and exactly how much room is left before the next bracket.',
    tagline: 'Your bracket is not your tax rate. See the difference.',
    intro:
      'The single most misunderstood idea in personal finance: only the dollars inside a bracket pay that bracket\'s rate. This visualizer fills each 2026 federal bracket with your taxable income, shows marginal versus effective rates side by side, and tells you the room left before your next dollar gets more expensive.',
    howItWorks: [
      'Enter gross income and filing status — the standard deduction is subtracted automatically.',
      'Watch each bracket fill and see the tax assessed per bracket.',
      'Read marginal rate (your next dollar\'s cost), effective rate (what you actually pay overall), and room left in the current bracket.',
    ],
    faq: [
      {
        q: 'What is the difference between marginal and effective tax rate?',
        a: 'Marginal is the rate on your NEXT dollar of income — the one that matters for decisions about raises, overtime, and Roth conversions. Effective is total tax divided by income — always lower, because early dollars are taxed at 10% and 12% no matter what bracket you top out in.',
      },
      {
        q: 'If I cross into the 22% bracket, does my whole salary get taxed at 22%?',
        a: 'Never. Only the dollars above $50,400 of taxable income (single, 2026) pay 22%. Everything below keeps its original 10% or 12% rate. A dollar that crosses the line cannot raise the tax on a single earlier dollar — the visualizer above shows this layer by layer.',
      },
      {
        q: 'Why does the room-left number matter?',
        a: 'It is the amount of extra income — overtime, a side gig, a Roth conversion — you can add at your current rate before the next bracket makes each new dollar costlier. For tax planning at year-end, that headroom number is the whole game.',
      },
    ],
  },
  {
    slug: 'box-fill-calculator',
    title: 'Box Fill Calculator — NEC 314.16 Conductor Volume Check',
    shortTitle: 'Box Fill Calculator',
    category: 'Trades & Engineering',
    description:
      'Free electrical box fill calculator per NEC 314.16. Count conductors, devices, clamps, and grounds — get required cubic inches, whether your box passes, and the smallest standard box that fits.',
    tagline: 'The math inspectors check before they approve your rough-in.',
    intro:
      'Every wire, device, clamp, and ground crammed into an electrical box consumes a code-defined volume, and overstuffed boxes are one of the most common inspection failures — overheated splices and damaged insulation start fires. This calculator applies NEC Table 314.16(B) conductor volumes to your wire count, adds the allowances for devices, clamps, and grounds, then checks the total against Table 314.16(A) box volumes to tell you pass or fail — and the smallest standard box that passes.',
    howItWorks: [
      'Count conductors of each gauge entering the box (each wire counts once; pigtails are free).',
      'Add the number of devices (switches/receptacles), whether internal clamps are present, and how many ground wires terminate in the box.',
      'The calculator sums required cubic inches: conductors × volume each, devices × 2, clamps × 1, grounds × 1 (all at the volume of the largest conductor present).',
      'Pick a box — see PASS/FAIL with margin, plus the smallest standard box that fits your count.',
    ],
    faq: [
      {
        q: 'Do pigtails count toward box fill?',
        a: 'No. Under NEC 314.16(B)(1), conductors originating inside the box and terminating inside it — like pigtails — do not count. Only conductors that pass through or terminate from outside the box count, plus one allowance for all grounds combined, one for internal clamps, and two per yoke-mounted device.',
      },
      {
        q: 'Does a GFCI or dimmer count differently than a regular switch?',
        a: 'Same count — two volume allowances per yoke — but deep devices like GFCIs and dimmers physically crowd the box, so electricians often upsize beyond the minimum. A box that barely passes the fill math can still be miserable to close up; going one size deeper costs pennies.',
      },
      {
        q: 'What is the most common box fill violation?',
        a: 'Forgetting that grounds count. Four 12 AWG conductors in a standard 3×2×2½ box seem fine until the ground allowance, clamp allowance, and device allowances push the requirement past 12.5 cubic inches. This calculator counts every allowance the inspector counts.',
      },
    ],
  },
  {
    slug: 'conduit-fill-calculator',
    title: 'Conduit Fill Calculator — NEC Chapter 9 (EMT & PVC)',
    shortTitle: 'Conduit Fill Calculator',
    category: 'Trades & Engineering',
    description:
      'Free conduit fill calculator per NEC Chapter 9. Pick conductor gauge and count, conduit type and size — get exact fill percentage against the 53%/31%/40% limits and max conductor count.',
    tagline: 'Forty percent is the ceiling. Know it before you pull.',
    intro:
      'The NEC caps conduit fill at 53% for one conductor, 31% for two, and 40% for three or more — because pulling tension and heat dissipation, not empty space, are the real limits. This calculator cross-references THHN conductor areas against EMT and Schedule 40 PVC internal areas, reports your exact fill percentage, and tells you the maximum conductors of one size that fit each conduit size — the same numbers as NEC Chapter 9 Table C.',
    howItWorks: [
      'Select conductor gauge (THHN) and how many you plan to pull — include grounds; they count.',
      'Choose conduit type (EMT or Schedule 40 PVC) and trade size.',
      'Read total conductor area, fill percentage, and PASS/FAIL against the NEC limit for your conductor count.',
      'Check the max-count table for one conductor size across all conduit sizes.',
    ],
    faq: [
      {
        q: 'Why can only one conductor fill 53% but three can only fill 40%?',
        a: 'Pulling geometry. A single cable slides cleanly; multiple conductors wedge against each other and the conduit wall, multiplying friction and trapping heat. The 40% limit for three or more conductors is what keeps long pulls possible and insulation intact.',
      },
      {
        q: 'Do equipment grounding wires count toward conduit fill?',
        a: 'Yes — every conductor in the conduit counts toward fill, including grounds. The classic violation: nine 12 AWG THHN conductors fit in ½-inch EMT, and adding a tenth as a ground pushes it over 40%. Count the ground in the calculator above and it will catch it.',
      },
      {
        q: 'What is the difference between EMT and PVC for fill?',
        a: 'Same trade size, different internal area — ¾-inch EMT has 0.533 sq in inside while Schedule 40 PVC has 0.508 sq in, because the plastic wall is thicker. Conduit fill tables are specific to raceway type; this calculator carries both.',
      },
    ],
  },
  {
    slug: 'ampacity-derating-calculator',
    title: 'Ampacity Derating Calculator — NEC 310.15 Temp & Bundling Factors',
    shortTitle: 'Ampacity Derating',
    category: 'Trades & Engineering',
    description:
      'Free NEC ampacity derating calculator. Apply 310.15(B)(1) ambient temperature correction and 310.15(C)(1) bundling adjustment to Table 310.16 values, capped by termination rating per 110.14.',
    tagline: 'The table ampacity is not the ampacity. Derate it.',
    intro:
      'The number in Table 310.16 assumes 86°F air and no more than three current-carrying conductors — conditions that vanish in attics, rooftops, and stuffed conduits. This calculator runs the full NEC 310.15 method: start at the conductor\'s insulation column, apply ambient temperature correction and bundling adjustment, then cap the result at the termination-temperature column per 110.14(C), because the weakest link governs. It also applies the 240.4(D) small-conductor breaker caps and the 125% continuous-load rule.',
    howItWorks: [
      'Pick wire gauge (copper) and insulation rating — 90°C for THHN/THWN-2, 75°C for THWN/XHHW, 60°C for TW/UF.',
      'Set the termination rating (most modern equipment is 75°C) and the real ambient temperature at the installation.',
      'Enter current-carrying conductor count and your load; mark continuous loads for the 125% rule.',
      'Read final allowable ampacity, PASS/FAIL against required ampacity, and the maximum legal breaker.',
    ],
    faq: [
      {
        q: 'Why is the final ampacity sometimes lower than the temperature-derated value?',
        a: 'The termination cap. NEC 110.14(C) says the circuit ampacity cannot exceed the column matching the lowest-rated termination in the circuit — usually 75°C for modern breakers. So even though 12 AWG THHN starts at 30A in the 90°C column, it can never exceed the 25A in the 75°C column after derating. You derate from the high column, then cap at the low one.',
      },
      {
        q: 'Do neutrals and grounds count as current-carrying conductors?',
        a: 'Grounds never count. Neutrals only count when they carry substantial harmonic current (nonlinear loads like VFDs and LED drivers on 3-phase systems). For a typical single-phase circuit, only the ungrounded (hot) conductors count.',
      },
      {
        q: 'What does the 125% continuous-load rule do to my wire size?',
        a: 'A continuous load (3+ hours: lighting, HVAC, EV charging) must be multiplied by 1.25 before comparing to conductor ampacity — a 20A continuous load requires conductors rated for 25A after all derating. On a 12 AWG run at 75°C terminations, that uses the entire 25A allowance with zero margin.',
      },
      {
        q: 'My ampacity came out between breaker sizes — can I round up?',
        a: 'Often yes: NEC 240.4(B) allows rounding to the next standard breaker size when the ampacity doesn\'t match one, but this calculator reports the largest breaker not exceeding your final ampacity — the conservative answer — and applies the 240.4(D) hard caps of 15/20/30A for 14/12/10 AWG copper, where rounding up is not allowed.',
      },
    ],
  },
  {
    slug: 'motor-circuit-calculator',
    title: 'Motor Circuit Calculator — NEC 430 FLC, Wire & Breaker Sizing',
    shortTitle: 'Motor Circuit Calculator',
    category: 'Trades & Engineering',
    description:
      'Free NEC motor circuit calculator. Look up Table 430.248/430.250 full-load current by HP and voltage, then get 125% conductor size, max breaker per 430.52, and disconnect rating.',
    tagline: 'Size it from the table, not the nameplate.',
    intro:
      'Motor circuits break the normal wiring intuition: the breaker is deliberately oversized to survive starting inrush, and the wire is sized from NEC table current — not the motor nameplate — so the circuit stays legal when the motor is eventually swapped. This calculator runs the full Article 430 workflow: table FLC by horsepower and voltage, minimum conductor ampacity at 125%, minimum wire size on the correct termination column, maximum breaker or fuse per Table 430.52, and the 115% disconnect rating.',
    howItWorks: [
      'Pick phase, motor horsepower, and voltage — the FLC comes from NEC Table 430.248 (single-phase) or 430.250 (three-phase).',
      'Choose the branch protection device: inverse-time breaker (250% FLC), dual-element fuse (175%), or non-time-delay fuse (300%).',
      'Set the termination rating — 60°C for unmarked gear under 100A per 110.14(C), 75°C for marked equipment.',
      'Read minimum wire size, max OCPD (rounded up to standard size per the 430.52 exception), and minimum disconnect rating.',
    ],
    faq: [
      {
        q: 'Why is the motor breaker allowed to be 250% of the running current?',
        a: 'Starting inrush. Motors draw 6–8× their running current for the moments it takes the rotor to spin up, so a breaker sized at the normal 125% rule would trip on every start. The oversized breaker only protects against short circuits and ground faults — the separate overload relay, set at 115–125% of nameplate amps, protects the motor while it runs.',
      },
      {
        q: 'Why can\'t I just use the nameplate amps?',
        a: 'NEC 430.6 requires the table values for conductor and breaker sizing precisely because nameplates vary — a high-efficiency replacement motor draws less than a cheap one, and the circuit must stay safe across swaps. The nameplate is reserved for the overload relay setting (430.32).',
      },
      {
        q: 'Why does the termination rating change my wire size?',
        a: 'Per 110.14(C), circuits rated 100A or less use the 60°C ampacity column unless the equipment is marked for 75°C. A 5 HP 230V single-phase motor needs 35A conductors — that is 8 AWG on the 60°C column (10 AWG tops out at 30A) but 10 AWG exactly meets it on the 75°C column. When in doubt, use 60°C.',
      },
      {
        q: 'Does this work for air conditioner compressors?',
        a: 'No — hermetic refrigerant motor-compressors follow NEC Article 440, not 430. Use the equipment nameplate MCA and MOP values, which already include the 125% factor. Applying Article 430 multipliers to HVAC equipment is a classic and dangerous mistake.',
      },
    ],
  },
  {
    slug: 'service-load-calculator',
    title: 'Residential Service Load Calculator — NEC 220 Standard Method',
    shortTitle: 'Service Load Calculator',
    category: 'Trades & Engineering',
    description:
      'Free NEC 220 residential load calculator. Compute demand VA with lighting, range, dryer, and HVAC demand factors, then get service amps and minimum panel size — 100A vs 150A vs 200A.',
    tagline: 'The math that decides 100A or 200A.',
    intro:
      'Every panel upgrade, service change, and new build starts with the same question: how big a service does this house actually need? This calculator runs the NEC Article 220 standard method line by line — lighting at 3 VA per square foot, demand factors from Table 220.42, the 8 kW range allowance, dryer minimums, fixed-appliance diversity, and the non-coincident heating/cooling rule — ending at total demand VA, service amps, and the minimum standard service size.',
    howItWorks: [
      'Enter floor area, small-appliance circuits, and laundry — lighting demand applies Table 220.42 automatically.',
      'Add range and dryer ratings (0 for gas/none) — code demand factors are built in.',
      'List fixed appliances; four or more trigger the 75% diversity factor (220.53).',
      'Enter AC and electric heat separately — only the larger counts (220.60). Read total VA, amps, and minimum service size.',
    ],
    faq: [
      {
        q: 'Why is my calculated load so much higher than my actual electric bill?',
        a: 'The calculation assumes worst case with code-mandated diversity, not your actual usage. It exists to guarantee the service can carry the peak the code imagines — burners, dryer, AC, and water heater with realistic overlap. Demand factors like 35% on lighting and 8 kW on a 12 kW range are the code\'s model of how homes really behave.',
      },
      {
        q: 'How do gas appliances affect the calculation?',
        a: 'Barely. A gas furnace contributes only its blower motor (often 400–800 VA), a gas water heater contributes nothing, and a gas range only its controls. Homes with gas heat, hot water, and cooking routinely calculate under 100A; all-electric homes are the ones pushing 150–200A.',
      },
      {
        q: 'Does an EV charger force a 200A service?',
        a: 'Often it is the deciding load. A 48A Level 2 charger adds 11,520 VA at 100% as a continuous load — on a house calculating at 90A, that single addition pushes the service past 125A toward 150 or 200A. Add the charger\'s VA to "other fixed appliances" above to see it.',
      },
      {
        q: 'What about the optional method?',
        a: 'NEC 220.82 offers an alternative for dwellings (100% of the first 10 kVA, 40% of the rest) that frequently lands one service size smaller. The standard method above is always accepted; many electricians run both and submit the smaller. The local authority having jurisdiction makes the final call.',
      },
    ],
  },
  {
    slug: 'duct-size-calculator',
    title: 'Duct Size Calculator — Ductulator Math (Equal Friction, ASHRAE)',
    shortTitle: 'Duct Size Calculator',
    category: 'Trades & Engineering',
    description:
      'Free HVAC duct sizing calculator. Enter CFM and friction rate — get round duct diameter, velocity, actual friction, and rectangular equivalent via the ASHRAE equal-friction method.',
    tagline: 'The cardboard ductulator, minus the cardboard.',
    intro:
      'Every duct in a building is sized by one question: how much air must it move at an acceptable pressure loss? This calculator runs the ASHRAE equal-friction correlation — the same math printed on a slide-rule ductulator — to turn CFM and a design friction rate into round duct diameter, air velocity, actual friction rate, and the rectangular equivalent that fits your joist space, with a 4:1 aspect-ratio guard and a 400 CFM-per-ton sanity check.',
    howItWorks: [
      'Enter the airflow the duct must carry in CFM (figure roughly 400 CFM per ton of load).',
      'Pick a design friction rate — 0.10 in./100 ft residential standard, 0.08 for run-outs, 0.05 for quiet trunks, 0.02 for returns.',
      'Read the exact and rounded-up round diameter, velocity, and the friction rate you actually get.',
      'Set your rectangular height constraint (joist depth) and get the matching width — keep the aspect ratio under 4:1.',
    ],
    faq: [
      {
        q: 'What friction rate should I design to?',
        a: '0.08–0.10 in. w.c. per 100 ft is the residential standard for supply run-outs. Dropping to 0.05 for trunks costs about 15% more sheet metal but cuts the duct share of pressure drop in half and saves 15–20% on fan energy — and it is quieter. Returns are designed lower, around 0.02–0.05.',
      },
      {
        q: 'Why does aspect ratio matter for rectangular ducts?',
        a: 'A wide, thin duct has far more surface area per unit of airflow, which raises friction and material cost. Above a 4:1 width-to-height ratio the penalty grows steeply — the equivalent-diameter math still works, but you are paying for metal and static pressure you did not need to spend.',
      },
      {
        q: 'How do I know the CFM for each room?',
        a: 'Room CFM comes from the room\'s load: CFM = BTU/h ÷ (1.08 × temperature difference). A 2.5-ton house at 400 CFM/ton moves 1,000 CFM total, split among rooms in proportion to their loads. Run the BTU load calculator first, then divide the airflow by room share.',
      },
      {
        q: 'Is bigger always safer for ducts?',
        a: 'Undersized ducts are the epidemic — they starve airflow, freeze coils, and roar. But wildly oversized trunks waste money and can drop velocity so low that air stratifies and balancing gets weird. Size to the friction rate and the velocity bands (600–900 fpm branches, 800–1,200 mains); that is the sweet spot.',
      },
    ],
  },
  {
    slug: 'room-airflow-calculator',
    title: 'Room Airflow Calculator — CFM per Room from BTU Loads',
    shortTitle: 'Room Airflow Calculator',
    category: 'Trades & Engineering',
    description:
      'Free room CFM calculator. Enter each room\'s cooling load in BTU/h — get target airflow per room, total CFM, and CFM per ton using the sensible-heat formula CFM = BTU ÷ 1.08ΔT.',
    tagline: 'Every room gets its share — on paper, then in the ducts.',
    intro:
      'A system that moves the right TOTAL air can still leave rooms roasting if the split is wrong. This calculator converts each room\'s cooling load into its target CFM using the sensible-heat equation, totals the system airflow, and checks the result against the 400 CFM-per-ton convention — the number you balance dampers to and the input the duct size calculator needs for every run-out.',
    howItWorks: [
      'Enter each room\'s name and cooling load in BTU/h (from a Manual J or the BTU load calculator).',
      'Set the sensible heat ratio — 0.75 typical, higher in dry climates, lower in humid ones — and the supply-to-room temperature difference (~20°F for cooling).',
      'Read target CFM and share per room, plus total system airflow and CFM per ton.',
      'Feed each room\'s CFM into the duct size calculator to size its run-out.',
    ],
    faq: [
      {
        q: 'Why does only part of the BTU load count for airflow?',
        a: 'Air carries sensible heat — the temperature part. The rest of the load is latent (moisture), which the coil removes without changing air temperature. The sensible heat ratio splits them: at 0.75 SHR, three-quarters of the BTU load needs air moved; that is why 2.5 tons at 0.75 SHR wants about 1,040 CFM, matching the 400-per-ton rule.',
      },
      {
        q: 'What ΔT should I use?',
        a: 'For cooling, supply air typically leaves the coil at 50–55°F against a 75°F room — a 20–25°F difference, and 20°F is the standard design value. For heating, furnaces supply at 120–140°F against a 70°F room (ΔT 50–70); heat pumps run cooler, 85–95°F supply (ΔT 15–25), which is why they move more air.',
      },
      {
        q: 'A room is always too hot — is it the airflow?',
        a: 'Most of the time, yes. Compare its target CFM above against what the register actually delivers (a cheap anemometer or a balance hood tells you). If the duct is undersized for its CFM share, no thermostat setting fixes it — the room airflow and duct size calculators together find the bottleneck.',
      },
    ],
  },
  {
    slug: 'superheat-subcooling-calculator',
    title: 'Superheat & Subcooling Calculator — R-410A / R-22 PT Conversion',
    shortTitle: 'Superheat & Subcooling',
    category: 'Trades & Engineering',
    description:
      'Free superheat and subcooling calculator. Convert suction and liquid pressures to saturation temps for R-410A or R-22, get superheat/subcooling, verdicts, and charge diagnosis.',
    tagline: 'Pressures in, diagnosis out.',
    intro:
      'Charging by "beer can cold" is how compressors die. The correct method reads pressures and line temperatures, converts them through the refrigerant\'s pressure-temperature relationship, and compares superheat and subcooling against the manufacturer target. This calculator does the PT conversion for R-410A and R-22, flags values outside field bands, and names the likely fault from the classic diagnosis matrix — undercharge, overcharge, or restriction.',
    howItWorks: [
      'Pick the refrigerant and metering device — TXV systems charge by subcooling; fixed-orifice by superheat.',
      'Enter suction pressure and suction line temperature → superheat appears with its verdict.',
      'Enter liquid pressure and liquid line temperature → subcooling appears against the manufacturer target.',
      'Read the combined diagnosis: high superheat + low subcooling means undercharged; the reverse means overcharged.',
    ],
    faq: [
      {
        q: 'Which do I use to charge — superheat or subcooling?',
        a: 'It depends on the metering device. TXV systems hold superheat constant by design, so you charge to the manufacturer\'s subcooling spec (commonly 8–12°F). Fixed-orifice (piston) systems let superheat float with load, so you charge to a superheat target from the manufacturer chart based on indoor wet-bulb and outdoor dry-bulb temperatures.',
      },
      {
        q: 'What does high superheat with low subcooling mean?',
        a: 'The classic undercharge signature: not enough refrigerant mass, so the evaporator starves (high superheat) and the condenser cannot stack liquid (low subcooling). The reverse — low superheat with high subcooling — points to overcharge. High on both suggests a restriction or low evaporator airflow, not a charge problem.',
      },
      {
        q: 'How long should the system run before I read gauges?',
        a: 'Ten to fifteen minutes minimum at stable conditions — pressures drift while the coil pulls down. Reading early is the most common way techs misdiagnose charge. Also insulate your temperature clamps and wait for them to settle; a bad line-temp reading corrupts both numbers.',
      },
      {
        q: 'Can I top off R-410A like R-22?',
        a: 'Not ideally. R-410A is a near-azeotropic blend; significant leaks can shift its composition, so best practice is recover and recharge by weight. R-22 is a single-component refrigerant and tolerates topping off — though as a phased-out HCFC, it is expensive and reclaimed-only. Either way, refrigerant handling requires EPA Section 608 certification.',
      },
    ],
  },
  {
    slug: 'drain-size-calculator',
    title: 'Drain Pipe Size Calculator — IPC DFU to Pipe Diameter',
    shortTitle: 'Drain Size Calculator',
    category: 'Trades & Engineering',
    description:
      'Free drain pipe sizing calculator. Count fixtures into drainage fixture units (IPC 709.1) and get the minimum drain diameter at your slope per Table 710.1 — building drain or branch.',
    tagline: 'Count the fixtures, slope the pipe, size the drain.',
    intro:
      'Drain sizing is the mirror image of supply sizing: drainage fixture units encode how much a fixture dumps and how often, and the pipe just has to swallow the probable peak at code slope. This calculator totals your DFU per IPC Table 709.1, then selects the smallest diameter from Table 710.1 at your slope — for the building drain or a horizontal branch — enforcing the 3-inch toilet minimum and the ¼-inch-per-foot rule for small pipe.',
    howItWorks: [
      'Count each fixture type draining into the pipe — toilets, sinks, tubs, showers, appliances, floor drains.',
      'Pick the slope (¼ inch per foot is the residential standard; ⅛ inch is legal only at 3 inches and up).',
      'Choose the pipe section — building drain/sewer or horizontal branch/stack; the capacity tables differ.',
      'Read the minimum diameter, its DFU capacity, and your spare headroom for future fixtures.',
    ],
    faq: [
      {
        q: 'How many fixture units is a typical house?',
        a: 'A two-bathroom single-family home totals roughly 18–24 DFU — two toilets (3 each), lavatories (1 each), a tub and shower (2 each), kitchen sink, dishwasher, and washer (2 each). That fits a 3-inch building drain at ¼-inch-per-foot with comfortable margin, which is why 3-inch is the de facto residential main.',
      },
      {
        q: 'Why is 3-inch the minimum for a toilet drain?',
        a: 'Solids. A water closet discharges a surge of waste that needs the pipe\'s full diameter to carry — IPC sets 3 inches as the floor for any drain serving a toilet regardless of what the DFU arithmetic allows.',
      },
      {
        q: 'Can I flatten a drain below ¼ inch per foot where framing is tight?',
        a: 'Only at 3 inches and larger — the ⅛-inch-per-foot column exists for bigger pipe because larger diameters maintain scouring velocity at flatter slopes. Two-inch and smaller must keep ¼ inch per foot. Too flat clogs; too steep (over about 2 inches per foot vertical-ish runs) lets liquids outrun solids, which also clogs.',
      },
      {
        q: 'Is UPC sizing different?',
        a: 'Slightly — the UPC counts a clothes washer as 3 DFU instead of 2 and uses its own capacity tables, though the pipe sizes usually come out the same for residential loads. Count and size with whichever code your jurisdiction adopted, and never mix tables between codes.',
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
  'Fitness & Sports',
  'Home & Yard',
  'Trades & Engineering',
  'School & Science',
] as const
