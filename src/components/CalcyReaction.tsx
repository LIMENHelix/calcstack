/* Calcy reaction — celebrate-Calcy flies in when the user hits a milestone
   (debt-free date moved up, savings goal covered, money crosses over, etc).
   Edge-triggered: fires when `fire` flips false → true, auto-dismisses. */
import { useEffect, useRef, useState } from 'react'

export function CalcyReaction({ fire, message }: { fire: boolean; message: string }) {
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState(false)
  const prev = useRef(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (fire && !prev.current) {
      setVisible(true)
      setShown(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setVisible(false), 6000)
    }
    prev.current = fire
  }, [fire])

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current) }, [])

  if (!shown) return null
  return (
    <div
      role="status"
      className={`fixed bottom-6 right-4 z-50 flex max-w-xs items-end gap-2 transition-all duration-500 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      }`}
    >
      <div className="relative mb-3 rounded-2xl rounded-br-sm border border-emerald-400/50 bg-card px-4 py-3 text-sm shadow-xl">
        <span className="font-semibold text-primary">Calcy: </span>
        <span className="text-foreground/90">{message}</span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-xs text-muted-foreground shadow hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <img
        src={`${import.meta.env.BASE_URL}calcy-celebrate.png`}
        alt=""
        aria-hidden
        className={`w-24 shrink-0 drop-shadow-xl ${visible ? 'calcy-bounce' : ''}`}
        width="96"
        height="96"
      />
    </div>
  )
}
