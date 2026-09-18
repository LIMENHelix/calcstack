import { useMemo } from 'react'
import { Field, Result, useNumber, type CalcProps } from './index'
import { Card, CardContent } from '@/components/ui/card'
import { usd, num } from '@/lib/calc'

/* ---------------- wRVU Physician Compensation ---------------- */

export function WrvuCalc(_props: CalcProps) {
  const [base, setBase] = useNumber(275000)
  const [threshold, setThreshold] = useNumber(5000) // wRVUs covered by base
  const [actual, setActual] = useNumber(6200)
  const [cf, setCf] = useNumber(52) // $ per wRVU above threshold

  const r = useMemo(() => {
    const excess = Math.max(0, actual - threshold)
    const bonus = excess * cf
    const total = base + bonus
    const effectiveRate = actual > 0 ? total / actual : 0
    const wrvuNeededForBase = cf > 0 ? base / cf : 0 // breakeven vs pure productivity
    return { excess, bonus, total, effectiveRate, wrvuNeededForBase }
  }, [base, threshold, actual, cf])

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Base salary" value={base} onChange={setBase} prefix="$" />
          <Field label="wRVU threshold covered by base" value={threshold} onChange={setThreshold} suffix="wRVUs" />
          <Field label="Your actual annual wRVUs" value={actual} onChange={setActual} suffix="wRVUs" />
          <Field label="Conversion factor above threshold" value={cf} onChange={setCf} prefix="$" suffix="/wRVU" />
          <p className="text-xs text-muted-foreground">
            The standard productivity model: base salary covers a wRVU threshold, then each wRVU above
            it pays the conversion factor. MGMA surveys publish specialty medians for wRVUs and
            conversion factors — pull yours before negotiating.
          </p>
        </div>
        <div className="space-y-3">
          <Result big label="Total compensation" value={usd(r.total)} />
          <Result label="Productivity bonus" value={usd(r.bonus)} />
          <Result label="wRVUs above threshold" value={num(r.excess, 0)} />
          <Result label="Effective $ per wRVU (all-in)" value={usd(r.effectiveRate, 2)} />
          <p className="text-sm text-muted-foreground">
            {r.excess > 0
              ? `Every additional wRVU pays ${usd(cf, 2)} — at your pace, a 10% productivity gain is worth ${usd(Math.round(actual * 0.1) * cf)}.`
              : `You are inside the base threshold — additional wRVUs pay nothing until you pass ${num(threshold, 0)}. Know that cliff before signing.`}{' '}
            Pure-productivity offers replace the base entirely: at {usd(cf, 2)}/wRVU you would need{' '}
            {num(r.wrvuNeededForBase, 0)} wRVUs just to match the base alone.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const PHYSICIAN_CALC_COMPONENTS: Record<string, (props: CalcProps) => React.ReactElement> = {
  'wrvu-compensation-calculator': WrvuCalc,
}
