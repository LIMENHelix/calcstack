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
