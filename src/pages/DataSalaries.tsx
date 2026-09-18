import { Link } from 'react-router'
import { SALARY_DATA_YEAR } from '@/data/stats'
import { SalaryTable } from '@/components/SalaryTable'
import { Seo } from '@/components/Seo'
import { AdSlot, AffiliateCard, DEFAULT_AFFILIATES } from '@/components/Monetization'
import { EmbedSnippet } from '@/components/EmbedSnippet'

const FAQ = [
  {
    q: 'What is a good salary in the US?',
    a: 'Median household income is roughly $80,000, so individual pay above that puts you ahead of the typical household with a single earner. But "good" is local: $80,000 goes twice as far in Mississippi as in California. Convert any offer to monthly take-home equivalents before judging it.',
  },
  {
    q: 'How do I convert a salary to an hourly rate?',
    a: 'Divide by 2,080 (40 hours × 52 weeks) for the textbook number, or use the salary-to-hourly calculator to account for the weeks you actually work — the honest hourly figure is usually 5–10% higher.',
  },
  {
    q: 'Are these exact salaries?',
    a: `No — rounded medians based on publicly reported federal wage statistics (~${SALARY_DATA_YEAR}). Pay varies widely by metro, experience, and employer; treat these as ballpark medians and negotiate from role-specific data.`,
  },
  {
    q: 'Which jobs punch above their salary?',
    a: 'Look at the hourly column, not the annual one. Jobs with overtime, shift premiums, or low unpaid overhead (electricians, HVAC, dental hygienists) often beat higher-salary desk jobs on effective hourly value.',
  },
]

export default function SalaryByJob() {
  return (
    <>
      <Seo
        title="Average Salary by Job — 40 Popular Occupations Compared"
        description="Typical US pay for 40 popular jobs with hourly equivalents. Rounded median figures with honest-hourly conversions. Free, no signup."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">CalcStack</Link>
        <span className="mx-2">/</span><span>Data</span>
        <span className="mx-2">/</span><span className="text-foreground">Average Salary by Job</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Average Salary by Job</h1>
      <p className="mb-6 max-w-3xl text-muted-foreground">
        Typical US pay for 40 popular occupations, with the hourly and monthly equivalents people
        actually think in. Figures are rounded medians (~{SALARY_DATA_YEAR} estimates from publicly
        reported wage statistics) — use them for orientation, then convert your own offer with the{' '}
        <Link to="/calculators/salary-to-hourly-calculator" className="text-primary underline-offset-4 hover:underline">salary-to-hourly calculator</Link>{' '}
        or price freelance work with the{' '}
        <Link to="/calculators/freelance-rate-calculator" className="text-primary underline-offset-4 hover:underline">freelance rate calculator</Link>.
      </p>

      <SalaryTable />
      <p className="mt-2 text-xs text-muted-foreground">
        * Rounded median figures (~{SALARY_DATA_YEAR}), gross pay before taxes. Hourly assumes 2,080
        hours/year. Verify with current wage data before negotiations.
      </p>

      <AdSlot />

      <article className="mt-10 max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </article>

      <AffiliateCard items={DEFAULT_AFFILIATES} />
      <EmbedSnippet slug="table/salary-by-job" title="Average Salary by Job table" />
    </>
  )
}
