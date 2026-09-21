/* Calcy tip bubble — the mascot speaks a one-line tip under calculator results.
   Mood swaps his pose: celebrate for wins, warning for cliffs/risks, default otherwise. */
import type { ReactNode } from 'react'

export type CalcyMood = 'default' | 'celebrate' | 'thinking' | 'warning'

const POSES: Record<CalcyMood, string> = {
  default: 'calcy.png',
  celebrate: 'calcy-celebrate.png',
  thinking: 'calcy-thinking.png',
  warning: 'calcy-warning.png',
}

const MOOD_STYLE: Record<CalcyMood, string> = {
  default: 'border-primary/30 bg-primary/5',
  celebrate: 'border-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/30',
  thinking: 'border-amber-400/50 bg-amber-50 dark:bg-amber-950/30',
  warning: 'border-orange-400/50 bg-orange-50 dark:bg-orange-950/30',
}

export function CalcyTip({ children, mood = 'default' }: { children: ReactNode; mood?: CalcyMood }) {
  return (
    <div className="mt-6 flex items-start gap-3">
      <img
        src={`${import.meta.env.BASE_URL}${POSES[mood]}`}
        alt=""
        aria-hidden
        className="w-12 shrink-0 drop-shadow"
        width="48"
        height="48"
      />
      <div className={`relative rounded-2xl rounded-tl-sm border px-4 py-3 text-sm ${MOOD_STYLE[mood]}`}>
        <span className="font-semibold text-primary">Calcy says: </span>
        <span className="text-foreground/90">{children}</span>
      </div>
    </div>
  )
}
