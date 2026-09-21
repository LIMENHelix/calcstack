/* Calcy's animated introduction — homepage hero.
   Entrance pop + squash, waving loop, typewriter speech bubble,
   and a real voice on tap (browser speech synthesis — user-gesture only). */
import { useCallback, useEffect, useRef, useState } from 'react'

const LINE = "Hi! I'm Calcy — your calculator buddy. 500 calculators, zero sign-ups, and every answer runs right here in your browser. What are we figuring out today?"

export function CalcyIntro() {
  const [typed, setTyped] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [waving, setWaving] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Typewriter: starts after the entrance pop lands
  useEffect(() => {
    const start = setTimeout(() => {
      timer.current = setInterval(() => {
        setTyped((t) => {
          if (t >= LINE.length) {
            if (timer.current) clearInterval(timer.current)
            return t
          }
          return t + 1
        })
      }, 22)
    }, 900)
    return () => {
      clearTimeout(start)
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  // Idle wave every 9s so he feels alive without being noisy
  useEffect(() => {
    const wave = setInterval(() => {
      setWaving(true)
      setTimeout(() => setWaving(false), 1600)
    }, 9000)
    return () => clearInterval(wave)
  }, [])

  const speak = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(LINE)
    u.pitch = 1.35 // friendly, a little cartoonish
    u.rate = 1.05
    const voices = window.speechSynthesis.getVoices()
    u.voice =
      voices.find((v) => /Google US English/i.test(v.name)) ??
      voices.find((v) => v.lang === 'en-US' && /female|zira|samantha/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith('en')) ??
      null
    setWaving(true)
    setSpeaking(true)
    u.onend = () => {
      setSpeaking(false)
      setWaving(false)
    }
    u.onerror = u.onend
    window.speechSynthesis.speak(u)
  }, [])

  return (
    <div className="mx-auto mb-2 flex max-w-md flex-col items-center gap-1">
      <button
        type="button"
        onClick={speak}
        title={speaking ? 'Calcy is talking…' : 'Hear Calcy say hi'}
        className="group relative cursor-pointer transition-transform hover:scale-105 focus:outline-none"
        aria-label="Hear Calcy introduce himself"
      >
        <img
          src={`${import.meta.env.BASE_URL}calcy.png`}
          alt="Calcy, the CalcStack mascot — a friendly calculator waving hello"
          className={`calcy-pop w-28 drop-shadow-lg sm:w-36 ${waving ? 'calcy-wave' : 'calcy-float'}`}
          width="144"
          height="144"
        />
        <span className="absolute -right-2 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground shadow-md transition-transform group-hover:scale-110">
          {speaking ? '🔊' : '🔈'}
        </span>
      </button>
      <div className="relative min-h-[3.5rem] max-w-sm rounded-2xl rounded-tl-sm border border-primary/30 bg-primary/5 px-4 py-2.5 text-left text-sm text-foreground/90 shadow-sm">
        {LINE.slice(0, typed)}
        {typed < LINE.length && <span className="calcy-caret">▍</span>}
      </div>
    </div>
  )
}
