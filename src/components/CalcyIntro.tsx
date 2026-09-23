/* Calcy — animated mascot with real movement.
   Articulated SVG character (CalcySvg): jointed arms and legs with a true
   walk cycle, waving, blinking, lip-synced talking mouth, bounce and spin.
   Autonomous wandering: he picks a spot, turns, and WALKS there. Plus cursor
   lean, entrance pop, and the typewriter bubble. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { CalcySvg, type CalcyAction } from './CalcySvg'

const LINE = "Oh, hi! I'm Calcy, your calculator buddy! I've got, like, 500+ calculators in here — zero sign-ups, and everything runs right in your browser. It's kind of my whole thing. So... what are we figuring out today?"

type Action = CalcyAction

const WANDER_RANGE = 64 // px either side of center

export function CalcyIntro() {
  const [typed, setTyped] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [action, setAction] = useState<Action>('float')
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [pos, setPos] = useState(0) // px offset from center
  const [facing, setFacing] = useState(1) // 1 = right, -1 = left
  const [walking, setWalking] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const posRef = useRef(0)
  posRef.current = pos
  const playingRef = useRef(false)
  playingRef.current = playing

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

  /* --- leans toward the visitor's cursor --- */
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

  /* --- idle tricks --- */
  const act = useCallback((a: Action, ms: number) => {
    if (actionTimer.current) clearTimeout(actionTimer.current)
    setAction(a)
    actionTimer.current = setTimeout(() => setAction('float'), ms)
  }, [])

  /* --- autonomous wandering: pick a spot, turn, WALK there --- */
  useEffect(() => {
    let alive = true
    const loop = () => {
      if (!alive) return
      const wait = 7000 + Math.random() * 8000
      setTimeout(() => {
        if (!alive) return
        if (playingRef.current) {
          loop()
          return
        }
        const roll = Math.random()
        if (roll < 0.55) {
          // walk somewhere new
          let target = Math.round((Math.random() * 2 - 1) * WANDER_RANGE)
          if (Math.abs(target - posRef.current) < 20) {
            target = target > 0 ? -WANDER_RANGE : WANDER_RANGE
          }
          setFacing(target > posRef.current ? 1 : -1)
          setWalking(true)
          setPos(target)
          setTimeout(() => alive && setWalking(false), 1500)
        } else if (roll < 0.75) {
          act('wave', 1700)
        } else if (roll < 0.9) {
          act('bounce', 1200)
        } else {
          act('spin', 1100)
        }
        loop()
      }, wait)
    }
    const first = setTimeout(loop, 4500)
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

  /* --- tap-to-greet: wave, retype his line, play his recorded voice --- */
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
        {/* horizontal wander + cursor lean */}
        <div
          ref={wrapRef}
          className="relative inline-block"
          style={{
            transform: `translateX(${pos}px) rotate(${walking ? 0 : (look.x * 4).toFixed(1)}deg)`,
            transition: walking
              ? 'transform 1.5s linear'
              : 'transform 0.25s ease-out',
          }}
        >
          {/* face the direction he's walking */}
          <div style={{ transform: `scaleX(${facing})` }}>
            <div className="calcy-pop w-28 drop-shadow-lg sm:w-36">
              <CalcySvg walking={walking} talking={playing} action={action} />
            </div>
          </div>
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
