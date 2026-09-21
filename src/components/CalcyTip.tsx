/* Calcy tip bubble — the mascot speaks a one-line tip under calculator results. */
import type { ReactNode } from 'react'

export function CalcyTip({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex items-start gap-3">
      <img
        src={`${import.meta.env.BASE_URL}calcy.png`}
        alt=""
        aria-hidden
        className="w-12 shrink-0 drop-shadow"
        width="48"
        height="48"
      />
      <div className="relative rounded-2xl rounded-tl-sm border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
        <span className="font-semibold text-primary">Calcy says: </span>
        <span className="text-foreground/90">{children}</span>
      </div>
    </div>
  )
}
