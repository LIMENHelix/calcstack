/* Calcy's animated introduction — homepage hero.
   Autonomous mascot behaviors: mouse-tracking pupils, random idle actions
   (wave / bounce / spin), celebration when the visitor uses the search,
   entrance pop + squash, typewriter speech bubble, tap-to-hear recorded voice. */
import { useCallback, useEffect, useRef, useState } from 'react'

const LINE = "Hi! I'm Calcy — your calculator buddy. 500+ calculators, zero sign-ups, and every answer runs right here in your browser. What are we figuring out today?"

type Action = 'float' | 'wave' | 'bounce' | 'spin' | 'hop'

// Eye centers as fractions of the image (measured from calcy.png)
const EYES = [
  { x: 42.5, y: 24 },
  { x: 62, y: 24 },
]

export function CalcyIntro() {
  const [typed, setTyped] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [action, setAction] = useState<Action>('float')
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  /* --- typewriter --- */
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

  /* --- pupils follow the mouse --- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height * 0.24
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height
      setLook({
        x: Math.max(-1, Math.min(1, dx * 2.2)),
        y: Math.max(-1, Math.min(1, dy * 2.2)),
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* --- blinking: he has working eyelids now --- */
  useEffect(() => {
    let alive = true
    const loop = () => {
      if (!alive) return
      setTimeout(() => {
        if (!alive) return
        setBlink(true)
        setTimeout(() => alive && setBlink(false), 140)
        loop()
      }, 2500 + Math.random() * 3000)
    }
    loop()
    return () => {
      alive = false
    }
  }, [])

  /* --- autonomous idle behaviors: he does things on his own --- */
  const act = useCallback((a: Action, ms: number) => {
    if (actionTimer.current) clearTimeout(actionTimer.current)
    setAction(a)
    actionTimer.current = setTimeout(() => setAction('float'), ms)
  }, [])

  useEffect(() => {
    let alive = true
    const loop = () => {
      if (!alive) return
      const wait = 6000 + Math.random() * 7000 // every 6–13s he does something
      setTimeout(() => {
        if (!alive) return
        const pick = Math.random()
        if (pick < 0.35) act('wave', 1700)
        else if (pick < 0.65) act('bounce', 1200)
        else if (pick < 0.85) act('hop', 1250)
        else act('spin', 1100)
        loop()
      }, wait)
    }
    const first = setTimeout(loop, 5000)
    return () => {
      alive = false
      clearTimeout(first)
    }
  }, [act])

  /* --- celebrate when the visitor starts searching --- */
  useEffect(() => {
    const onInput = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.('input')) act('bounce', 1200)
    }
    const onClick = (e: Event) => {
      const a = (e.target as HTMLElement)?.closest?.('a')
      if (a?.getAttribute('href')?.includes('/calculators/')) act('spin', 1100)
    }
    document.addEventListener('input', onInput)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('input', onInput)
      document.removeEventListener('click', onClick)
    }
  }, [act])

  /* --- tap-to-greet: wave, retype his line, and play his recorded voice --- */
  const greet = useCallback(() => {
    act('wave', 1700)
    if (timer.current) clearInterval(timer.current)
    setTyped(0)
    timer.current = setInterval(() => {
      setTyped((t) => {
        if (t >= LINE.length) {
          if (timer.current) clearInterval(timer.current)
          return t
        }
        return t + 1
      })
    }, 22)
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(`${import.meta.env.BASE_URL}calcy-voice.mp3`)
      }
      const a = audioRef.current
      a.currentTime = 0
      a.onended = () => setPlaying(false)
      a.onerror = () => setPlaying(false)
      setPlaying(true)
      a.play().catch(() => setPlaying(false))
    } catch {
      setPlaying(false)
    }
  }, [act])

  return (
    <div className="mx-auto mb-2 flex max-w-md flex-col items-center gap-1">
      <button
        type="button"
        onClick={greet}
        title={playing ? 'Calcy is talking…' : 'Hear Calcy say hi'}
        className="group relative cursor-pointer transition-transform hover:scale-105 focus:outline-none"
        aria-label="Hear Calcy introduce himself"
      >
        <div
          ref={wrapRef}
          className="relative inline-block"
          style={{
            transform: `rotate(${(look.x * 4).toFixed(1)}deg)`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}${action === 'bounce' || action === 'spin' ? 'calcy-celebrate.png' : 'calcy.png'}`}
            alt="Calcy, the CalcStack mascot — a friendly calculator waving hello"
            className={`calcy-pop w-28 drop-shadow-lg sm:w-36 calcy-${action}`}
            width="144"
            height="144"
            draggable={false}
          />
          {/* live pupils — they watch your cursor */}
          {EYES.map((eye, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                left: `${eye.x}%`,
                top: `${eye.y}%`,
                width: '5.5%',
                aspectRatio: '1',
                background: 'radial-gradient(circle at 35% 35%, #0f766e, #022c22)',
                transform: `translate(calc(-50% + ${(look.x * 5).toFixed(1)}px), calc(-50% + ${(look.y * 4).toFixed(1)}px)) scaleY(${blink ? 0.12 : 1})`,
                transition: 'transform 0.12s ease-out',
              }}
            />
          ))}
        </div>
        <span className="absolute -right-2 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground shadow-md transition-transform group-hover:scale-110">
          {playing ? '🔊' : '🔈'}
        </span>
      </button>
      <div className="relative min-h-[3.5rem] max-w-sm rounded-2xl rounded-tl-sm border border-primary/30 bg-primary/5 px-4 py-2.5 text-left text-sm text-foreground/90 shadow-sm">
        {LINE.slice(0, typed)}
        {typed < LINE.length && <span className="calcy-caret">▍</span>}
      </div>
    </div>
  )
}
