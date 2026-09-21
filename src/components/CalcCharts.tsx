/* Lazy-loaded chart components (recharts lives in its own chunk).
   Import via React.lazy so calculators that don't chart never pay the cost. */
import {
  Area, AreaChart, Bar, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

const fmt = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 10_000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v).toLocaleString()}`

const tooltipFmt = (v: unknown) => (typeof v === 'number' ? `$${Math.round(v).toLocaleString()}` : String(v))

const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
  fontSize: 13,
} as const

/* Compound interest: stacked area — contributions (solid) + growth (bright) */
export function GrowthChart({ data }: { data: { year: number; balance: number; contributed: number }[] }) {
  const rows = data.map((d) => ({ year: `Y${d.year}`, Contributed: Math.round(d.contributed), Growth: Math.round(d.balance - d.contributed) }))
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} interval="preserveStartEnd" stroke="hsl(var(--muted-foreground))" />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={58} stroke="hsl(var(--muted-foreground))" />
          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="Contributed" stackId="1" stroke="#0d9488" fill="#0d9488" fillOpacity={0.85} />
          <Area type="monotone" dataKey="Growth" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.75} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Mortgage: yearly principal vs interest bars + balance line */
export function AmortChart({ data }: { data: { year: number; principal: number; interest: number; balance: number }[] }) {
  const rows = data.map((d) => ({
    year: `Y${d.year}`,
    Principal: Math.round(d.principal),
    Interest: Math.round(d.interest),
    Balance: Math.round(d.balance),
  }))
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <ComposedChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} interval="preserveStartEnd" stroke="hsl(var(--muted-foreground))" />
          <YAxis yAxisId="left" tickFormatter={fmt} tick={{ fontSize: 11 }} width={58} stroke="hsl(var(--muted-foreground))" />
          <YAxis yAxisId="right" orientation="right" tickFormatter={fmt} tick={{ fontSize: 11 }} width={58} stroke="hsl(var(--muted-foreground))" />
          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="Principal" stackId="p" fill="#0d9488" />
          <Bar yAxisId="left" dataKey="Interest" stackId="p" fill="#f97316" />
          <Line yAxisId="right" type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Paycheck: donut of where the money goes */
export function MoneyPie({ rows }: { rows: [string, number][] }) {
  const COLORS = ['#f97316', '#6366f1', '#0ea5e9', '#a855f7', '#64748b']
  const data = rows.filter(([, v]) => v > 0.005).map(([name, value]) => ({ name, value: Math.round(value) }))
  if (data.length === 0) return null
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} strokeWidth={0}>
            {data.map((d, i) => <Cell key={d.name} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Loan payoff: balance over time with payoff marker */
export function PayoffChart({ data }: { data: { month: number; balance: number }[] }) {
  const rows = data.filter((_, i) => i % Math.ceil(data.length / 120) === 0 || i === data.length - 1)
    .map((d) => ({ month: `M${d.month}`, Balance: Math.round(d.balance) }))
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} interval="preserveStartEnd" stroke="hsl(var(--muted-foreground))" />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={58} stroke="hsl(var(--muted-foreground))" />
          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="Balance" stroke="#0d9488" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
