/* Calcy as an articulated SVG character — v2 with two-segment limbs.
   Thighs + shins with bending knees, upper arms + forearms with bending
   elbows, squash-and-stretch on jumps, anticipation on spins, heel-lift
   walk cycle with knee lift. The principles that make motion read as
   "character" instead of "jiggle": joints, anticipation, follow-through. */

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

        /* ---------- IDLE: breathing bob, slight arm sway ---------- */
        .calsvg-float .calsvg-body   { animation: cs-bob 4s ease-in-out infinite; }
        .calsvg-float .calsvg-armL   { animation: cs-armSway 4s ease-in-out infinite; }
        .calsvg-float .calsvg-armR   { animation: cs-armSway 4s ease-in-out infinite reverse; }
        .calsvg-float .calsvg-foreL  { animation: cs-foreSway 4s ease-in-out infinite; }
        .calsvg-float .calsvg-foreR  { animation: cs-foreSway 4s ease-in-out infinite reverse; }

        /* ---------- WALK: thigh swings, knee lifts on the swing-through,
           shin folds behind, arms counter-swing with elbow bend, body bobs
           twice per stride ---------- */
        .calsvg-walk .calsvg-legL    { animation: cs-thigh 0.48s ease-in-out infinite; }
        .calsvg-walk .calsvg-legR    { animation: cs-thigh 0.48s ease-in-out infinite reverse; }
        .calsvg-walk .calsvg-shinL   { animation: cs-knee 0.48s ease-in-out infinite; }
        .calsvg-walk .calsvg-shinR   { animation: cs-knee 0.48s ease-in-out infinite reverse; }
        .calsvg-walk .calsvg-armL    { animation: cs-armSwing 0.48s ease-in-out infinite reverse; }
        .calsvg-walk .calsvg-armR    { animation: cs-armSwing 0.48s ease-in-out infinite; }
        .calsvg-walk .calsvg-foreL   { animation: cs-elbow 0.48s ease-in-out infinite reverse; }
        .calsvg-walk .calsvg-foreR   { animation: cs-elbow 0.48s ease-in-out infinite; }
        .calsvg-walk .calsvg-body    { animation: cs-walkBob 0.24s ease-in-out infinite; }

        /* ---------- WAVE: arm snaps up (anticipation dip first), elbow
           wags the forearm, body leans in ---------- */
        .calsvg-wave .calsvg-armR    { animation: cs-waveUp 1.65s ease-in-out; }
        .calsvg-wave .calsvg-foreR   { animation: cs-waveWag 1.65s ease-in-out; }
        .calsvg-wave .calsvg-body    { animation: cs-waveLean 1.65s ease-in-out; }

        /* ---------- BOUNCE: crouch (anticipation) → spring up with squash
           and stretch → soft landing ---------- */
        .calsvg-bounce .calsvg-all   { animation: cs-jump 0.62s cubic-bezier(.3,1.4,.5,1) 2; }
        .calsvg-bounce .calsvg-body  { animation: cs-squash 0.62s ease-in-out 2; }
        .calsvg-bounce .calsvg-legL  { animation: cs-tuck 0.62s ease-in-out 2; }
        .calsvg-bounce .calsvg-legR  { animation: cs-tuck 0.62s ease-in-out 2 reverse; }
        .calsvg-bounce .calsvg-armL  { animation: cs-cheer 0.62s ease-in-out 2; }
        .calsvg-bounce .calsvg-armR  { animation: cs-cheer 0.62s ease-in-out 2 reverse; }

        /* ---------- SPIN: wind up backward, then whip around ---------- */
        .calsvg-spin .calsvg-all     { animation: cs-spin 1.15s cubic-bezier(.5,-0.2,.3,1.2); }
        .calsvg-spin .calsvg-armL    { animation: cs-spinArms 1.15s ease-in-out; }
        .calsvg-spin .calsvg-armR    { animation: cs-spinArms 1.15s ease-in-out reverse; }

        /* ---------- ALWAYS ON: blink; talk adds mouth flaps ---------- */
        .calsvg-eye { animation: cs-blink 4.2s ease-in-out infinite; }
        .calsvg-talk .calsvg-mouth { animation: cs-talk 0.19s ease-in-out infinite; }

        @keyframes cs-bob {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          50%      { transform: translateY(-3px) scale(1.01, 0.99); }
        }
        @keyframes cs-armSway {
          0%, 100% { transform: rotate(5deg); }
          50%      { transform: rotate(-5deg); }
        }
        @keyframes cs-foreSway {
          0%, 100% { transform: rotate(-6deg); }
          50%      { transform: rotate(4deg); }
        }
        @keyframes cs-thigh {
          0%, 100% { transform: rotate(28deg); }
          50%      { transform: rotate(-28deg); }
        }
        @keyframes cs-knee {
          /* knee folds most as the leg swings forward through the middle */
          0%   { transform: rotate(-8deg); }
          25%  { transform: rotate(-38deg); }
          50%  { transform: rotate(-10deg); }
          75%  { transform: rotate(-4deg); }
          100% { transform: rotate(-8deg); }
        }
        @keyframes cs-armSwing {
          0%, 100% { transform: rotate(24deg); }
          50%      { transform: rotate(-24deg); }
        }
        @keyframes cs-elbow {
          0%, 100% { transform: rotate(-14deg); }
          50%      { transform: rotate(-34deg); }
        }
        @keyframes cs-walkBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes cs-waveUp {
          0%   { transform: rotate(0deg); }
          10%  { transform: rotate(18deg); }   /* anticipation dip */
          28%  { transform: rotate(-158deg); }
          86%  { transform: rotate(-152deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes cs-waveWag {
          0%, 24%  { transform: rotate(0deg); }
          36%      { transform: rotate(-38deg); }
          48%      { transform: rotate(10deg); }
          60%      { transform: rotate(-38deg); }
          72%      { transform: rotate(10deg); }
          84%      { transform: rotate(-24deg); }
          100%     { transform: rotate(0deg); }
        }
        @keyframes cs-waveLean {
          0%, 100% { transform: rotate(0deg); }
          30%, 80% { transform: rotate(-4deg); }
        }
        @keyframes cs-jump {
          0%   { transform: translateY(0); }
          15%  { transform: translateY(4px); }    /* crouch */
          45%  { transform: translateY(-16px); }  /* spring */
          70%  { transform: translateY(-16px); }
          100% { transform: translateY(0); }
        }
        @keyframes cs-squash {
          0%   { transform: scale(1, 1); }
          15%  { transform: scale(1.08, 0.88); }  /* squash on crouch */
          45%  { transform: scale(0.94, 1.1); }   /* stretch mid-air */
          85%  { transform: scale(1.06, 0.92); }  /* squash on landing */
          100% { transform: scale(1, 1); }
        }
        @keyframes cs-tuck {
          0%, 100% { transform: rotate(0deg); }
          45%, 70% { transform: rotate(34deg); }
        }
        @keyframes cs-cheer {
          0%, 100% { transform: rotate(0deg); }
          45%, 70% { transform: rotate(-78deg); }
        }
        @keyframes cs-spin {
          0%   { transform: rotate(0deg); }
          18%  { transform: rotate(-28deg); }     /* wind up */
          100% { transform: rotate(360deg); }
        }
        @keyframes cs-spinArms {
          0%, 100% { transform: rotate(0deg); }
          18%      { transform: rotate(30deg); }
          55%      { transform: rotate(-55deg); } /* arms fly out mid-spin */
        }
        @keyframes cs-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%           { transform: scaleY(0.08); }
        }
        @keyframes cs-talk {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.25); }
        }
      `}</style>

      <g className="calsvg-all" style={{ transformOrigin: '50% 60%' }}>
        {/* shadow — squashes with him */}
        <ellipse cx="60" cy="134" rx="26" ry="5" fill="#0c4a36" opacity="0.18" />

        {/* LEFT LEG: thigh pivots at hip, shin pivots at knee */}
        <g className="calsvg-legL" style={{ transformOrigin: '46px 106px' }}>
          <rect x="41.5" y="104" width="9" height="14" rx="4.5" fill="#0b7a54" />
          <g className="calsvg-shinL" style={{ transformOrigin: '46px 116px' }}>
            <rect x="42.5" y="114" width="7.5" height="12" rx="3.75" fill="#0d8a5f" />
            <ellipse cx="46.5" cy="129" rx="7.5" ry="4.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
          </g>
        </g>
        {/* RIGHT LEG */}
        <g className="calsvg-legR" style={{ transformOrigin: '74px 106px' }}>
          <rect x="69.5" y="104" width="9" height="14" rx="4.5" fill="#0b7a54" />
          <g className="calsvg-shinR" style={{ transformOrigin: '74px 116px' }}>
            <rect x="70.5" y="114" width="7.5" height="12" rx="3.75" fill="#0d8a5f" />
            <ellipse cx="73.5" cy="129" rx="7.5" ry="4.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
          </g>
        </g>

        {/* LEFT ARM: upper arm at shoulder, forearm at elbow */}
        <g className="calsvg-armL" style={{ transformOrigin: '24px 60px' }}>
          <rect x="19.5" y="58" width="9" height="15" rx="4.5" fill="#0d8a5f" />
          <g className="calsvg-foreL" style={{ transformOrigin: '24px 71px' }}>
            <rect x="20.5" y="69" width="7.5" height="13" rx="3.75" fill="#10b981" />
            <circle cx="24" cy="85" r="5.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
          </g>
        </g>
        {/* RIGHT ARM */}
        <g className="calsvg-armR" style={{ transformOrigin: '96px 60px' }}>
          <rect x="91.5" y="58" width="9" height="15" rx="4.5" fill="#0d8a5f" />
          <g className="calsvg-foreR" style={{ transformOrigin: '96px 71px' }}>
            <rect x="92.5" y="69" width="7.5" height="13" rx="3.75" fill="#10b981" />
            <circle cx="96" cy="85" r="5.5" fill="#f8fafc" stroke="#d6d3d1" strokeWidth="1" />
          </g>
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
