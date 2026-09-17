export interface Persona {
  slug: string
  job: string
  title: string
  description: string
  hero: string
  questions: string[] // money questions this person actually asks
  calcSlugs: string[] // core or variant slugs, in display order
  faq: { q: string; a: string }[]
}

export const PERSONAS: Persona[] = [
  {
    slug: 'freelancers',
    job: 'Freelancers & Independent Contractors',
    title: 'Calculators for Freelancers — Rates, Salary & Savings',
    description: 'Free tools for freelancers: hourly rate calculator, salary conversions, tax planning math, and savings goals. No signup, runs in your browser.',
    hero: 'Freelancing means being your own CFO. These tools handle the math of pricing your work, comparing salaried offers, and building the cushion that keeps you sane between contracts.',
    questions: [
      'What hourly rate actually matches my old salary?',
      'Is this full-time offer worth taking, or do I stay independent?',
      'How much should I set aside each month for taxes and dry spells?',
    ],
    calcSlugs: [
      'freelance-rate-calculator',
      'freelance-rate-calculator-web-developer',
      'freelance-rate-calculator-graphic-designer',
      'freelance-rate-calculator-writer',
      'freelance-rate-calculator-photographer',
      'salary-to-hourly-calculator',
      'savings-goal-calculator',
      'compound-interest-calculator',
      'break-even-calculator',
    ],
    faq: [
      {
        q: 'What is the first number a new freelancer should calculate?',
        a: 'Your floor rate: the hourly number below which freelancing pays less than employment. The freelance rate calculator builds it from your income goal, expenses, and realistic billable hours — everything else (project pricing, retainers, negotiations) builds on that floor.',
      },
      {
        q: 'How much should freelancers save for taxes?',
        a: 'A common rule is 25–30% of every payment, moved to a separate account the day money arrives. Use the savings goal calculator with your estimated quarterly payment as the target to build the habit before the first deadline.',
      },
      {
        q: 'How big should a freelancer emergency fund be?',
        a: 'Larger than an employee\'s — 6–9 months of expenses is the common advice, because income is lumpy and there is no severance. The savings goal calculator converts that target into a monthly deposit.',
      },
    ],
  },
  {
    slug: 'real-estate-agents',
    job: 'Real Estate Agents & Brokers',
    title: 'Calculators for Real Estate Agents — Mortgage, Commission Math & Client Tools',
    description: 'Free tools for real estate agents: mortgage calculators for client conversations, state-by-state payment data, loan types (FHA, VA, jumbo), and embeddable widgets for your website.',
    hero: 'Every client asks the same three questions: what will the payment be, can I afford it, and what about taxes. These tools answer all three — and every one of them is embeddable on your own website, free.',
    questions: [
      'What is the monthly payment on this listing at today\'s rate?',
      'How do FHA, VA, and conventional payments compare for my buyer?',
      'What is the typical payment in my state versus where my client is moving from?',
    ],
    calcSlugs: [
      'mortgage-payment-calculator',
      '15-year-mortgage-calculator',
      'fha-loan-calculator',
      'va-loan-calculator',
      'jumbo-loan-calculator',
      'loan-payoff-calculator',
      'sales-tax-calculator',
      'percentage-calculator',
    ],
    faq: [
      {
        q: 'Can I put these calculators on my agent website?',
        a: 'Yes — every calculator and the state mortgage table has a free embed snippet at the bottom of its page. Paste the iframe into your site; the tool works fully inside it and carries a small "Powered by CalcStack" credit.',
      },
      {
        q: 'How do I answer "what would the payment be?" in a showing?',
        a: 'The mortgage calculator runs on your phone and updates as you type — price, down payment, rate, and you have P&I in seconds. For the full picture, remind clients to add roughly 20–40% for taxes, insurance, and HOA depending on the area.',
      },
      {
        q: 'Where do I find typical payments for relocating clients?',
        a: 'The mortgage-by-state data page computes typical payments for all 50 states plus DC at adjustable rates — useful for showing a relocating buyer what their money does in your market versus theirs.',
      },
    ],
  },
  {
    slug: 'engineers',
    job: 'Engineers & Technical Professionals',
    title: 'Calculators for Engineers — Salary, RSU Math & Long-Term Compounding',
    description: 'Free tools for engineers: salary-to-hourly conversions, offer comparisons, compound interest projections, loan payoff optimization, and inflation-adjusted planning.',
    hero: 'Engineering pay is good; engineering pay optimized is better. These tools are for the questions spreadsheets usually answer: comparing offers, modeling stock compensation decay, and deciding between debt payoff and investing.',
    questions: [
      'Is this offer actually better once I adjust for hours worked?',
      'What does my savings rate become at 7% over 20 years?',
      'Should I pay extra on the loans or invest the difference?',
    ],
    calcSlugs: [
      'salary-to-hourly-calculator',
      'compound-interest-calculator',
      'loan-payoff-calculator',
      'roi-calculator',
      'inflation-calculator',
      'savings-goal-calculator',
      'percentage-calculator',
      'crypto-profit-calculator',
    ],
    faq: [
      {
        q: 'How do I compare two job offers with different structures?',
        a: 'Convert everything to the same unit: total annual compensation first, then honest hourly (total comp ÷ real hours, including on-call). The salary-to-hourly and ROI calculators cover both conversions. Perks like 401(k) matches belong in the annual number at face value.',
      },
      {
        q: 'Pay off student loans or invest?',
        a: 'Compare guaranteed vs expected return: loan payoff earns the loan APR risk-free. Above ~7–8% APR, payoff usually wins; below ~4%, investing usually wins. Between them it is risk tolerance. The loan payoff and compound interest calculators give you both sides of the comparison.',
      },
      {
        q: 'How much does an early savings rate actually matter?',
        a: 'Enormously, and the compound interest calculator makes it visceral: contributions made in the first 10 years of a 40-year career often end up worth more than everything contributed afterward. Run 25-vs-35 start ages and look at the gap.',
      },
    ],
  },
  {
    slug: 'teachers',
    job: 'Teachers & Educators',
    title: 'Calculators for Teachers — Salary, Loan Payoff & Savings on a Teacher Budget',
    description: 'Free tools for teachers: salary conversions, student loan payoff strategies, savings goals, and GPA calculations. Honest math for educator budgets. No signup.',
    hero: 'Teaching pay is structured — steps, lanes, summers — and so is teacher debt. These tools handle the math of loan payoff on a fixed salary, what a master\u2019s lane change is worth, and building savings on a school-year budget.',
    questions: [
      'How fast can I pay off my student loans on my salary?',
      'What does a lane change (master\'s) add per hour worked?',
      'How much do I need to save monthly for summer gap or a house deposit?',
    ],
    calcSlugs: [
      'loan-payoff-calculator',
      'salary-to-hourly-calculator',
      'savings-goal-calculator',
      'gpa-calculator',
      'compound-interest-calculator',
      'sales-tax-calculator',
      'percentage-calculator',
    ],
    faq: [
      {
        q: 'What is the fastest way to pay off teacher student loans?',
        a: 'First check PSLF eligibility — public service loan forgiveness can erase federal loans after 120 qualifying payments, which beats aggressive payoff for many teachers. If PSLF does not apply, the loan payoff calculator shows exactly what extra monthly payments save you.',
      },
      {
        q: 'Is a master\'s degree worth it for the pay lane change?',
        a: 'Compute the annual lane increase, divide by the degree cost, and project it with the ROI calculator over your remaining years to retirement. In many districts the payback is 3–6 years; in some it is over 15. The math, not the brochure, should decide.',
      },
      {
        q: 'How do I budget on a 10-month salary?',
        a: 'Annualize first: divide your salary by 12 and live on that number, letting the summer months fund themselves. The savings goal calculator can target a specific summer-gap cushion with a monthly deposit built into the school year.',
      },
    ],
  },
  {
    slug: 'nurses',
    job: 'Nurses & Healthcare Workers',
    title: 'Calculators for Nurses — Shift Pay, Loan Payoff & Overtime Math',
    description: 'Free tools for nurses: salary and shift-pay conversions, student loan payoff, savings goals, and offer comparisons for staff vs travel nursing. Free, no signup.',
    hero: 'Staff vs travel, nights vs days, overtime vs agency — nursing pay has more variables than most professions. These tools convert every option into the same units so the better offer is obvious.',
    questions: [
      'Is this travel contract actually better than my staff position?',
      'What does the night differential add per year?',
      'How fast can I kill my nursing school loans?',
    ],
    calcSlugs: [
      'salary-to-hourly-calculator',
      'loan-payoff-calculator',
      'percentage-calculator',
      'savings-goal-calculator',
      'compound-interest-calculator',
      'calorie-calculator',
      'sales-tax-calculator',
    ],
    faq: [
      {
        q: 'How do I compare a travel contract to a staff job?',
        a: 'Convert both to honest hourly: total weekly package (taxed + stipends) ÷ hours, then subtract duplicated living costs the stipend covers. The salary-to-hourly calculator handles the conversion; run both scenarios and compare the net number, not the headline rate.',
      },
      {
        q: 'What is my overtime actually worth?',
        a: 'Overtime at 1.5× sounds simple but the honest question is per-year: overtime hours × 1.5 × base rate, added to base pay, then re-divided by total hours to see your true blended rate. The salary-to-hourly calculator does the blend.',
      },
      {
        q: 'Aggressive loan payoff or minimum payments?',
        a: 'Nursing loans often sit at 5–7%. The loan payoff calculator shows what an extra shift\'s pay per month does to your timeline — on a typical nursing balance, one extra shift\'s worth monthly commonly cuts years off the loan.',
      },
    ],
  },
  {
    slug: 'small-business-owners',
    job: 'Small Business Owners',
    title: 'Calculators for Small Business Owners — Break-Even, Pricing & Cash Flow',
    description: 'Free tools for small business owners: break-even calculator, pricing and margin math, sales tax by state, loan payoff, and ROI analysis. No signup, runs locally.',
    hero: 'Small business decisions are math wearing a costume: can this product cover its costs, is that loan worth it, what does this state\'s tax do to my margins. These tools strip the costume off.',
    questions: [
      'How many units until this product stops losing money?',
      'What does this equipment loan actually cost over its life?',
      'How do different state tax rates hit my pricing?',
    ],
    calcSlugs: [
      'break-even-calculator',
      'loan-payoff-calculator',
      'sales-tax-calculator',
      'percentage-calculator',
      'discount-calculator',
      'roi-calculator',
      'inflation-calculator',
      'compound-interest-calculator',
    ],
    faq: [
      {
        q: 'What is the one number every small business should know?',
        a: 'Break-even units: fixed costs ÷ (price − variable cost). It tells you whether a business model works before effort can matter — if the number is implausible for your market, no amount of hustle fixes it. The break-even calculator computes it in seconds.',
      },
      {
        q: 'How do I price a new product?',
        a: 'Start from cost-plus as a floor (variable cost × your target margin), then sanity-check against the break-even units that price implies. A price is only good if the break-even count is realistically achievable in your market.',
      },
      {
        q: 'Is a business loan worth it?',
        a: 'Compare the loan\'s total interest cost (loan payoff calculator) against the profit the borrowed money generates (ROI calculator). If the capital earns more than the APR costs, the loan is a tool; if not, it is an anchor.',
      },
    ],
  },
  {
    slug: 'landlords',
    job: 'Landlords & Property Investors',
    title: 'Calculators for Landlords — Rental Math, Mortgage & ROI',
    description: 'Free tools for landlords and property investors: mortgage and payoff calculators, ROI and annualized returns, state-by-state payment data, and break-even analysis.',
    hero: 'Rental investing is arithmetic before it is real estate: does the rent cover the debt, what is the real return, and does this property beat an index fund. These tools answer all three honestly.',
    questions: [
      'Does this rent cover the mortgage plus a margin?',
      'What is my real annualized return including equity build?',
      'How do payments compare across states I am considering?',
    ],
    calcSlugs: [
      'mortgage-payment-calculator',
      'loan-payoff-calculator',
      'roi-calculator',
      'break-even-calculator',
      'inflation-calculator',
      'compound-interest-calculator',
      'sales-tax-calculator',
      'percentage-calculator',
    ],
    faq: [
      {
        q: 'What is the 1% rule and does it still work?',
        a: 'Monthly rent ≥ 1% of purchase price is the classic screen. At current prices and rates it fails in most metros — treat it as a quick filter, then run the real math: P&I plus ~40% of rent for taxes, insurance, maintenance, and vacancy against the rent.',
      },
      {
        q: 'How do I compute my real rental ROI?',
        a: 'Total return = cash flow + principal paydown + appreciation, divided by cash invested (down payment + closing + rehab). The ROI calculator annualizes it so you can compare against index funds honestly — many rentals lose that comparison once effort is priced in.',
      },
      {
        q: 'Pay down the rental mortgage or buy the next property?',
        a: 'Compare guaranteed vs leveraged return: paying down earns the mortgage APR risk-free; the next property earns rental ROI amplified by leverage but with concentration risk. The loan payoff and ROI calculators quantify both paths with your numbers.',
      },
    ],
  },
]
