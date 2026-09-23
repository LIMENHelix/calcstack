/* Calcy as an articulated SVG character — real skeletal cartoon movement.
   Separate groups for arms, legs, eyes, and mouth, each pivoting at its joint,
   driven by CSS keyframes: a true walk cycle (legs swing opposite, arms
   counter-swing, body bobs), a waving arm, blinking eyes, a talking mouth,
   bounce and spin tricks. No flipbook frames, no image assets. */

export type CalcyAction = 'float' | 'wave' | 'bounce' | 'spin'

interface Props {
  walking?: boolean
  talking?: boolean
  action?: CalcyAction
  className?: string
}

export function CalcySvg({ walking = false, talking = false, action = 'float', className = '' }: Props) {
  const cls = [
    'calsvg',
    walking ? 'calsvg-walk' : '',
    talking ? 'calsvg-talk' : '',
    !walking ? `calsvg-${action}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      viewBox="0 0 120 140"
      className={cls}
      role="img"
      aria-label="Calcy, the CalcStack mascot — a friendly walking calculator"
    >
      <style>{`
        .calsvg { width: 100%; height: auto; overflow: visible; }
        .calsvg * { transform-box: fill-box; }

        /* ---------- IDLE: gentle bob + breathing ---------- */
        .calsvg-float .calsvg-body  { animation: calsvg-bob 4s ease-in-out infinite; }
        .calsvg-float .calsvg-armL  { animation: calsvg-armSway 4s ease-in-out infinite; }
        .calsvg-float .calsvg-armR  { animation: calsvg-armSway 4s ease-in-out infinite reverse; }

        /* ---------- WALK CYCLE: legs alternate, arms counter-swing, body bobs ---------- */
        .calsvg-walk .calsvg-legL  { animation: calsvg-legSwing 0.42s ease-in-out infinite; }
        .calsvg-walk .calsvg-legR  { animation: calsvg-legSwing 0.42s ease-in-out infinite reverse; }
        .calsvg-walk .calsvg-armL  { animation: calsvg-armSwing 0.42s ease-in-out infinite reverse; }
        .calsvg-walk .calsvg-armR  { animation: calsvg-armSwing 0.42s ease-in-out infinite; }
        .calsvg-walk .calsvg-body  { animation: calsvg-walkBob 0.42s ease-in-out infinite; }

        /* ---------- WAVE: right arm up, wagging ---------- */
        .calsvg-wave .calsvg-armR  { animation: calsvg-wave 0.55s ease-in-out 3; }
        .calsvg-wave .calsvg-body  { animation: calsvg-bob 1.65s ease-in-out; }

        /* ---------- BOUNCE: happy jump, legs tuck ---------- */
        .calsvg-bounce .calsvg-all   { animation: calsvg-jump 0.6s cubic-bezier(.34,1.56,.64,1) 2; }
        .calsvg-bounce .calsvg-legL  { animation: calsvg-tuck 0.6s ease-in-out 2; }
        .calsvg-bounce .calsvg-legR  { animation: calsvg-tuck 0.6s ease-in-out 2 reverse; }
        .calsvg-bounce .calsvg-armL  { animation: calsvg-cheer 0.6s ease-in-out 2; }
        .calsvg-bounce .calsvg-armR  { animation: calsvg-cheer 0.6s ease-in-out 2 reverse; }

        /* ---------- SPIN ---------- */
        .calsvg-spin .calsvg-all   { animation: calsvg-spin 1.1s cubic-bezier(.34,1.3,.64,1); }

        /* ---------- BLINK (always on) ---------- */
        .calsvg-eye { animation: calsvg-blink 4.2s ease-in-out infinite; }

        /* ---------- TALK: mouth opens and closes ---------- */
        .calsvg-talk .calsvg-mouth { animation: calsvg-talk 0.19s ease-in-out infinite; }

        @keyframes calsvg-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes calsvg-armSway {
          0%, 100% { transform: rotate(4deg); }
          50%      { transform: rotate(-4deg); }
        }
        @keyframes calsvg-legSwing {
          0%, 100% { transform: rotate(26deg); }
          50%      { transform: rotate(-26deg); }
        }
        @keyframes calsvg-armSwing {
          0%, 100% { transform: rotate(22deg); }
          50%      { transform: rotate(-22deg); }
        }
        @keyframes calsvg-walkBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-2.5px); }
        }
        @keyframes calsvg-wave {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-150deg); }
          40%  { transform: rotate(-120deg); }
          60%  { transform: rotate(-150deg); }
          80%  { transform: rotate(-120deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes calsvg-jump {
          0%, 100% { transform: translateY(0) scale(1); }
          40%      { transform: translateY(-14px) scale(1.03); }
        }
        @keyframes calsvg-tuck {
          0%, 100% { transform: rotate(0deg); }
          40%      { transform: rotate(30deg); }
        }
        @keyframes calsvg-cheer {
          0%, 100% { transform: rotate(0deg); }
          40%      { transform: rotate(-70deg); }
        }
        @keyframes calsvg-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes calsvg-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%           { transform: scaleY(0.08); }
        }
        @keyframes calsvg-talk {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.25); }
        }
      `}</style>

      <g className="calsvg-all" style={{ transformOrigin: '50% 60%' }}>
        {/* shadow */}
        <ellipse cx="60" cy="134" rx="26" ry="5" fill="#0c4a36" opacity="0.18" />

        {/* legs — pivot at hip */}
        <g className="calsvg-legL" style={{ transformOrigin: '46px 108px' }}>
          <rect x="42" y="106" width="9" height="22" rx="4.5" fill="#0b7a54" />
          <ellipse cx="46.5" cy="129" rx="7.5" ry="4.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
        </g>
        <g className="calsvg-legR" style={{ transformOrigin: '74px 108px' }}>
          <rect x="69" y="106" width="9" height="22" rx="4.5" fill="#0b7a54" />
          <ellipse cx="73.5" cy="129" rx="7.5" ry="4.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
        </g>

        {/* arms — pivot at shoulder */}
        <g className="calsvg-armL" style={{ transformOrigin: '22px 62px' }}>
          <rect x="16" y="58" width="9" height="26" rx="4.5" fill="#0d8a5f" transform="rotate(14 20 60)" />
          <circle cx="15" cy="85" r="5.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
        </g>
        <g className="calsvg-armR" style={{ transformOrigin: '98px 62px' }}>
          <rect x="95" y="58" width="9" height="26" rx="4.5" fill="#0d8a5f" transform="rotate(-14 100 60)" />
          <circle cx="105" cy="85" r="5.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
        </g>

        {/* body */}
        <g className="calsvg-body" style={{ transformOrigin: '60px 75px' }}>
          <rect x="28" y="20" width="64" height="90" rx="14" fill="url(#calsvg-bodygrad)" stroke="#0a6b4a" strokeWidth="2" />
          <defs>
            <linearGradient id="calsvg-bodygrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0d8a5f" />
            </linearGradient>
          </defs>

          {/* screen / face */}
          <rect x="36" y="28" width="48" height="26" rx="6" fill="#052e22" />
          <g className="calsvg-eye" style={{ transformOrigin: '49px 41px' }}>
            <circle cx="49" cy="41" r="4.4" fill="#f8fafc" />
            <circle cx="50" cy="41.6" r="2" fill="#052e22" />
          </g>
          <g className="calsvg-eye" style={{ transformOrigin: '71px 41px' }}>
            <circle cx="71" cy="41" r="4.4" fill="#f8fafc" />
            <circle cx="72" cy="41.6" r="2" fill="#052e22" />
          </g>
          <rect
            className="calsvg-mouth"
            x="53"
            y="48"
            width="14"
            height="3.4"
            rx="1.7"
            fill="#34d399"
            style={{ transformOrigin: '60px 49.7px' }}
          />

          {/* button grid */}
          <g fill="#d1fae5">
            <rect x="37" y="61" width="13" height="9" rx="2.5" />
            <rect x="54" y="61" width="13" height="9" rx="2.5" />
            <rect x="71" y="61" width="13" height="9" rx="2.5" fill="#fbbf24" />
            <rect x="37" y="74" width="13" height="9" rx="2.5" />
            <rect x="54" y="74" width="13" height="9" rx="2.5" />
            <rect x="71" y="74" width="13" height="9" rx="2.5" fill="#fbbf24" />
            <rect x="37" y="87" width="13" height="9" rx="2.5" />
            <rect x="54" y="87" width="13" height="9" rx="2.5" />
            <rect x="71" y="87" width="13" height="9" rx="2.5" fill="#fb923c" />
          </g>
        </g>
      </g>
    </svg>
  )
}
