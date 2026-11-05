import * as React from "react"

// "2D 모션 그래픽 입문 무료 특강" project board.
// The poster's wooden mannequin is redrawn as a rigged SVG so it can move: every limb turns on its
// own joint, and the red dashed squares mark the anchor points, as in the After Effects lessons.

const IMG = "/assets/img/"
const C = {
    paper: "#FDF3F2",
    pink: "#F8D4D3",
    rose: "#EE8E8C",
    line: "#2F2A2A",
    pivot: "#E5574F",
    joint: "#7C6BD6",
    purple: "#5B5BD6",
    yellow: "#F8E39C",
    mint: "#9BD8B1",
    ink: "#111111",
    muted: "#777777",
}
const SANS = '"Pretendard", "Inter", "Apple SD Gothic Neo", system-ui, sans-serif'
const SERIF = '"Instrument Serif", "Times New Roman", serif'

const CSS = `
.mq g { transform-box: view-box; }
@keyframes mq-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
@keyframes mq-head { 0%, 100% { transform: rotate(-5deg) } 50% { transform: rotate(6deg) } }
@keyframes mq-wave-up { 0%, 100% { transform: rotate(-148deg) } 50% { transform: rotate(-160deg) } }
@keyframes mq-wave-lo { 0%, 100% { transform: rotate(-28deg) } 50% { transform: rotate(32deg) } }
@keyframes mq-idle-up { 0%, 100% { transform: rotate(8deg) } 50% { transform: rotate(14deg) } }
@keyframes mq-idle-lo { 0%, 100% { transform: rotate(-6deg) } 50% { transform: rotate(-16deg) } }
@keyframes mq-walk-ul { 0%, 100% { transform: rotate(18deg) } 50% { transform: rotate(-18deg) } }
@keyframes mq-walk-ur { 0%, 100% { transform: rotate(-18deg) } 50% { transform: rotate(18deg) } }
@keyframes mq-walk-knee { 0%, 50%, 100% { transform: rotate(0deg) } 25%, 75% { transform: rotate(-22deg) } }
@keyframes mq-walk-al { 0%, 100% { transform: rotate(-22deg) } 50% { transform: rotate(22deg) } }
@keyframes mq-walk-ar { 0%, 100% { transform: rotate(22deg) } 50% { transform: rotate(-22deg) } }
@keyframes mq-walk-elbow { 0%, 100% { transform: rotate(-18deg) } 50% { transform: rotate(-6deg) } }
@keyframes mq-walk-bob { 0%, 50%, 100% { transform: translateY(0) } 25%, 75% { transform: translateY(-6px) } }
@keyframes ml-swing { 0%, 100% { transform: rotate(26deg) } 50% { transform: rotate(-26deg) } }
@keyframes ml-lag { 0%, 100% { transform: rotate(-12deg) } 50% { transform: rotate(12deg) } }
@keyframes ml-legs { 0%, 100% { transform: rotate(-20deg) } 50% { transform: rotate(20deg) } }
@keyframes ml-bounce {
    0%   { transform: translateY(0) scale(1.18, 0.78) }
    10%  { transform: translateY(-40%) scale(0.92, 1.1) }
    45%  { transform: translateY(-170%) scale(1, 1) }
    80%  { transform: translateY(-40%) scale(0.92, 1.1) }
    90%  { transform: translateY(0) scale(1, 1) }
    100% { transform: translateY(0) scale(1.18, 0.78) }
}
@keyframes ml-shadow { 0%, 90%, 100% { transform: scaleX(1); opacity: 0.35 } 45% { transform: scaleX(0.45); opacity: 0.12 } }
@keyframes ml-float { 0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)) } 50% { transform: translateY(-10px) rotate(calc(var(--r, 0deg) + 20deg)) } }
@keyframes ml-path { from { offset-distance: 0% } to { offset-distance: 100% } }
@keyframes ml-dash { to { stroke-dashoffset: -24 } }
`

function useInView<T extends HTMLElement>(threshold = 0.2) {
    const ref = React.useRef<T>(null)
    const [seen, setSeen] = React.useState(false)
    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return }
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
        io.observe(el)
        return () => io.disconnect()
    }, [threshold])
    return [ref, seen] as const
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
    const [ref, seen] = useInView<HTMLDivElement>()
    return (
        <div ref={ref} style={{ ...style, opacity: seen ? 1 : 0, transform: `translateY(${seen ? 0 : 28}px)`, transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
            {children}
        </div>
    )
}

/* ---------------- The rigged mannequin ---------------- */

type Pose = "wave" | "walk" | "hold"

/** Red dashed anchor-point marker. */
function Pivot({ x = 0, y = 0, s = 18 }: { x?: number; y?: number; s?: number }) {
    return <rect x={x - s / 2} y={y - s / 2} width={s} height={s} fill="none" stroke={C.pivot} strokeWidth={1.2} strokeDasharray="3 2.5" />
}
function Joint({ x = 0, y = 0 }: { x?: number; y?: number }) {
    return <circle cx={x} cy={y} r={4.5} fill="none" stroke={C.joint} strokeWidth={1.4} />
}

/** One limb: an upper segment turning at the root joint, a lower segment turning at the middle joint, and an end piece. */
function Limb({ x, y, upper, lower, len1, len2, w1, w2, end, anim }: { x: number; y: number; upper?: string; lower?: string; len1: number; len2: number; w1: number; w2: number; end: "hand" | "foot"; anim: [string, string] }) {
    const seg = (len: number, w: number) => <rect x={-w / 2} y={-w / 2} width={w} height={len + w / 2} rx={w / 2} fill={C.pink} stroke={C.line} strokeWidth={1.6} />
    const tip = end === "hand"
        ? <g><rect x={-11} y={-2} width={22} height={20} rx={8} fill="#fff" stroke={C.line} strokeWidth={1.6} /><rect x={-11} y={12} width={22} height={6} rx={3} fill="#fff" stroke={C.line} strokeWidth={1.2} /></g>
        : <path d="M -13 -4 L 13 -4 L 15 18 Q 0 26 -15 18 Z" fill="#fff" stroke={C.line} strokeWidth={1.6} />
    return (
        <g transform={`translate(${x} ${y})`}>
            <g style={{ animation: anim[0] }}>
                {seg(len1, w1)}
                <Joint />
                <Pivot s={w1 + 6} />
                <g transform={`translate(0 ${len1})`}>
                    <g style={{ animation: anim[1] }}>
                        {seg(len2, w2)}
                        <Joint />
                        <g transform={`translate(0 ${len2})`}>{tip}</g>
                    </g>
                </g>
            </g>
        </g>
    )
}

function Mannequin({ pose, width, showPivots = true }: { pose: Pose; width: number | string; showPivots?: boolean }) {
    const walk = pose === "walk"
    const wave = pose === "wave"
    const hold = pose === "hold"
    const t = walk ? "0.9s" : "2.4s"
    const ani = (name: string, dur = t, delay = "0s") => `${name} ${dur} ease-in-out ${delay} infinite`
    // left and right are the figure's own sides: its right arm is drawn on the viewer's left
    const armR: [string, string] = wave ? [ani("mq-wave-up"), ani("mq-wave-lo", "0.8s")] : walk ? [ani("mq-walk-ar"), ani("mq-walk-elbow")] : hold ? ["none", "none"] : [ani("mq-idle-up"), ani("mq-idle-lo")]
    const armL: [string, string] = walk ? [ani("mq-walk-al"), ani("mq-walk-elbow")] : hold ? ["none", "none"] : [ani("mq-idle-up", t, "-1.2s"), ani("mq-idle-lo", t, "-1.2s")]
    const legR: [string, string] = walk ? [ani("mq-walk-ul"), ani("mq-walk-knee")] : ["none", "none"]
    const legL: [string, string] = walk ? [ani("mq-walk-ur"), ani("mq-walk-knee", t, "-0.45s")] : ["none", "none"]
    return (
        <svg className="mq" viewBox="0 0 240 420" width={width} style={{ display: "block", overflow: "visible", ["--pv" as any]: showPivots ? 1 : 0 }}>
            <g style={{ animation: walk ? ani("mq-walk-bob") : ani("mq-bob", "2.4s") }}>
                {/* legs behind the pelvis */}
                <Limb x={104} y={244} len1={78} len2={74} w1={30} w2={28} end="foot" anim={legR} />
                <Limb x={136} y={244} len1={78} len2={74} w1={30} w2={28} end="foot" anim={legL} />
                {/* back arm */}
                <Limb x={hold ? 82 : 86} y={146} len1={58} len2={54} w1={24} w2={22} end="hand" anim={hold ? ["none", "none"] : armL} />
                {/* torso and pelvis */}
                <rect x={84} y={128} width={72} height={108} rx={18} fill={C.pink} stroke={C.line} strokeWidth={1.6} />
                <rect x={80} y={226} width={80} height={30} rx={9} fill={C.pink} stroke={C.line} strokeWidth={1.6} />
                <Joint x={120} y={241} />
                <Pivot x={120} y={241} s={22} />
                {/* head turns on the neck */}
                <g transform="translate(120 128)">
                    <g style={{ animation: ani("mq-head", "2.4s") }}>
                        <rect x={-9} y={-16} width={18} height={20} fill={C.pink} stroke={C.line} strokeWidth={1.6} />
                        <circle cx={0} cy={-62} r={52} fill={C.pink} stroke={C.line} strokeWidth={1.6} />
                        <g transform="translate(0 -62) rotate(18)"><Pivot s={40} /></g>
                        <Joint x={0} y={-62} />
                    </g>
                </g>
                {/* front arm */}
                <Limb x={hold ? 158 : 154} y={146} len1={58} len2={54} w1={24} w2={22} end="hand" anim={armR} />
            </g>
        </svg>
    )
}

/* ---------------- Small motion demos ---------------- */

function BouncingBall({ size }: { size: number }) {
    return (
        <div style={{ position: "relative", width: size * 3, height: size * 3.4, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            {/* onion-skin ghosts of the arc */}
            {[0.2, 0.42, 0.62].map((k, i) => (
                <div key={i} style={{ position: "absolute", left: `${12 + i * 12}%`, bottom: `${k * 100}%`, width: size * 0.8, height: size * 0.8, borderRadius: "50%", background: C.rose, opacity: 0.18 + i * 0.06 }} />
            ))}
            <div style={{ position: "absolute", bottom: -6, width: size * 0.9, height: 10, borderRadius: "50%", background: C.line, animation: "ml-shadow 1.1s cubic-bezier(0.45, 0, 0.55, 1) infinite" }} />
            <div style={{ width: size, height: size, borderRadius: "50%", background: C.rose, border: `1.6px solid ${C.line}`, transformOrigin: "50% 100%", animation: "ml-bounce 1.1s cubic-bezier(0.45, 0, 0.55, 1) infinite" }} />
        </div>
    )
}

function Swing({ width }: { width: number }) {
    return (
        <svg className="mq" viewBox="0 0 300 380" width={width} style={{ display: "block", overflow: "visible" }}>
            <line x1={40} y1={10} x2={260} y2={10} stroke={C.line} strokeWidth={2} />
            <rect x={136} y={2} width={28} height={16} rx={4} fill={C.yellow} stroke={C.line} strokeWidth={1.4} />
            <g transform="translate(150 10)">
                <Pivot s={20} />
                {/* the swing leads, the body follows a beat later: that delay is the "time offset" lesson */}
                <g style={{ animation: "ml-swing 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite" }}>
                    <line x1={-34} y1={0} x2={-34} y2={250} stroke={C.line} strokeWidth={1.6} />
                    <line x1={34} y1={0} x2={34} y2={250} stroke={C.line} strokeWidth={1.6} />
                    <rect x={-52} y={248} width={104} height={12} rx={4} fill={C.purple} stroke={C.line} strokeWidth={1.4} />
                    <g transform="translate(0 250)">
                        <g style={{ animation: "ml-lag 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.35s infinite" }}>
                            <rect x={-24} y={-70} width={48} height={64} rx={14} fill={C.pink} stroke={C.line} strokeWidth={1.6} />
                            <g transform="translate(0 -70)">
                                <g style={{ animation: "ml-lag 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.6s infinite" }}>
                                    <circle cx={0} cy={-36} r={34} fill={C.pink} stroke={C.line} strokeWidth={1.6} />
                                    <g transform="translate(0 -36) rotate(14)"><Pivot s={26} /></g>
                                    <Joint x={0} y={-36} />
                                </g>
                            </g>
                            {/* hands on the ropes */}
                            <rect x={-42} y={-58} width={16} height={16} rx={6} fill="#fff" stroke={C.line} strokeWidth={1.4} />
                            <rect x={26} y={-58} width={16} height={16} rx={6} fill="#fff" stroke={C.line} strokeWidth={1.4} />
                        </g>
                        <g transform="translate(-12 6)"><g style={{ animation: "ml-legs 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.5s infinite" }}><rect x={-9} y={0} width={18} height={62} rx={9} fill={C.pink} stroke={C.line} strokeWidth={1.6} /><path d="M -10 58 L 10 58 L 12 72 Q 0 78 -12 72 Z" fill="#fff" stroke={C.line} strokeWidth={1.4} /></g></g>
                        <g transform="translate(12 6)"><g style={{ animation: "ml-legs 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.62s infinite" }}><rect x={-9} y={0} width={18} height={62} rx={9} fill={C.pink} stroke={C.line} strokeWidth={1.6} /><path d="M -10 58 L 10 58 L 12 72 Q 0 78 -12 72 Z" fill="#fff" stroke={C.line} strokeWidth={1.4} /></g></g>
                    </g>
                </g>
            </g>
        </svg>
    )
}

/** The poster's bezier arc with handles, and a ball easing along it. */
function BezierPath({ width }: { width: number }) {
    const d = "M 20 180 C 90 -40, 230 -40, 300 180"
    return (
        <div style={{ position: "relative", width, aspectRatio: "320 / 200" }}>
            <svg viewBox="0 0 320 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                <path d={d} fill="none" stroke={C.line} strokeWidth={1.4} />
                <line x1={20} y1={180} x2={90} y2={-40} stroke={C.line} strokeWidth={0.8} strokeDasharray="4 4" style={{ animation: "ml-dash 1.2s linear infinite" }} />
                <line x1={300} y1={180} x2={230} y2={-40} stroke={C.line} strokeWidth={0.8} strokeDasharray="4 4" style={{ animation: "ml-dash 1.2s linear infinite" }} />
                {[[20, 180], [300, 180]].map(([x, y]) => <rect key={x} x={x - 6} y={y - 6} width={12} height={12} fill={C.yellow} stroke={C.line} strokeWidth={1.2} />)}
                {[[90, -40], [230, -40]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={5} fill="#fff" stroke={C.line} strokeWidth={1.2} />)}
            </svg>
            <div style={{ position: "absolute", left: 0, top: 0, width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: "50%", background: C.rose, border: `1.6px solid ${C.line}`, offsetPath: `path("${d}")` as any, animation: "ml-path 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate", transform: `scale(${width / 320})`, transformOrigin: "0 0" } as React.CSSProperties} />
        </div>
    )
}

/** Little confetti shapes from the poster, drifting. */
function Confetti({ items }: { items: { x: string; y: string; c: string; s: number; shape: "sq" | "tri" | "dot"; r?: number; d?: number }[] }) {
    return (
        <>
            {items.map((it, i) => (
                <div
                    key={i}
                    aria-hidden
                    style={{
                        position: "absolute", left: it.x, top: it.y, width: it.s, height: it.s,
                        background: it.shape === "tri" ? "none" : it.c,
                        borderRadius: it.shape === "dot" ? "50%" : 2,
                        borderLeft: it.shape === "tri" ? `${it.s / 2}px solid transparent` : undefined,
                        borderRight: it.shape === "tri" ? `${it.s / 2}px solid transparent` : undefined,
                        borderBottom: it.shape === "tri" ? `${it.s}px solid ${it.c}` : undefined,
                        ["--r" as any]: `${it.r || 0}deg`,
                        animation: `ml-float ${3 + (it.d || 0)}s ease-in-out ${-(i * 0.7)}s infinite`,
                    }}
                />
            ))}
        </>
    )
}

/* ---------------- The poster itself, set in motion ---------------- */

const EASE = "0.45 0 0.55 1"
const MP_CSS = `
@keyframes mp-wave { 0%, 100% { transform: rotate(4deg) } 50% { transform: rotate(58deg) } }
@keyframes mp-upper { 0%, 100% { transform: rotate(-22deg) } 50% { transform: rotate(-12deg) } }
@keyframes mp-sit { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes mp-bowl { 0%, 100% { transform: scale(1.04, 0.95) } 50% { transform: scale(1, 1) } }
@keyframes mp-tilt { 0%, 100% { transform: rotate(-4deg) } 50% { transform: rotate(5deg) } }
@keyframes mp-pulse { 0%, 100% { opacity: 0.15 } 50% { opacity: 1 } }
@keyframes mp-spin { 0%, 100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-14px) rotate(25deg) } }
@keyframes mp-play { from { transform: translateX(0) } to { transform: translateX(230px) } }
`

function Hand() {
    // open white glove seen from the palm, wrist at 0,0, pointing up
    const f = (x: number, a: number, l: number) => <rect key={x} x={-7} y={-l} width={14} height={l} rx={7} transform={`translate(${x} -22) rotate(${a})`} fill="#fff" stroke={C.line} strokeWidth={1.8} />
    return (
        <g>
            {f(-16, -28, 34)}{f(-6, -10, 44)}{f(6, 6, 46)}{f(17, 22, 40)}
            <rect x={-7} y={-26} width={14} height={30} rx={7} transform="translate(-22 -6) rotate(-62)" fill="#fff" stroke={C.line} strokeWidth={1.8} />
            <circle cx={0} cy={-18} r={24} fill="#fff" stroke={C.line} strokeWidth={1.8} />
            <circle cx={0} cy={-18} r={8} fill="none" stroke={C.joint} strokeWidth={2} />
        </g>
    )
}

function Forearm({ ghost }: { ghost?: boolean }) {
    return (
        <g opacity={ghost ? 0.35 : 1}>
            <rect x={-24} y={-100} width={48} height={112} rx={24} fill={ghost ? "#F7E3C4" : C.pink} stroke={C.line} strokeWidth={1.8} />
            <circle cx={0} cy={0} r={8} fill="none" stroke={C.joint} strokeWidth={2} />
            <rect x={-30} y={-30} width={60} height={60} fill="none" stroke={C.pivot} strokeWidth={1.6} strokeDasharray="7 6" transform="rotate(15)" />
            <g transform="translate(0 -104)"><Hand /></g>
        </g>
    )
}

/** Poster 2 of the series, redrawn as vectors so every part can move. */
function MovingPoster() {
    const sw = 1.8
    const arc = "M155 495 C 290 130, 380 65, 470 65 C 590 65, 640 330, 800 492"
    const rows = [120, 235, 350, 465, 580, 695, 810, 925, 1040]
    const shapes: { x: number; y: number; d: string; c: string; dur: number }[] = [
        { x: 245, y: 137, d: "M-14 -12 L4 0 L-14 12 L-6 0 Z", c: C.mint, dur: 3.2 },
        { x: 284, y: 428, d: "M0 -14 L14 0 L0 14 L-14 0 Z", c: C.yellow, dur: 2.8 },
        { x: 213, y: 573, d: "M-18 -14 L18 14 L18 -14 L-18 14 Z", c: C.mint, dur: 3.6 },
        { x: 840, y: 148, d: "M-14 -14 L14 -14 L14 14 L-14 14 Z", c: C.yellow, dur: 3 },
        { x: 737, y: 142, d: "M0 -14 L13 -4 L8 12 L-8 12 L-13 -4 Z", c: C.yellow, dur: 3.4 },
        { x: 742, y: 660, d: "M14 -12 L-4 0 L14 12 L6 0 Z", c: C.rose, dur: 2.6 },
        { x: 834, y: 697, d: "M-16 -16 L16 16 L16 -16 L-16 16 Z", c: C.rose, dur: 3.8 },
    ]
    return (
        <svg className="mq" viewBox="0 0 993 1090" style={{ display: "block", width: "100%", height: "auto", background: "#fff" }}>
            <style>{MP_CSS}</style>
            <defs>
                <clipPath id="mp-clip"><rect width={993} height={1090} /></clipPath>
                <linearGradient id="mp-bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F1B2B4" /><stop offset="1" stopColor="#E58F93" /></linearGradient>
                <linearGradient id="mp-leg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3C9CA" /><stop offset="1" stopColor="#FBEDEE" /></linearGradient>
            </defs>
            <g clipPath="url(#mp-clip)">
                {/* soft colour fields */}
                <circle cx={680} cy={95} r={115} fill="#F6EAA8" opacity={0.6} />
                <circle cx={110} cy={830} r={120} fill="#E6F2E2" opacity={0.6} />
                {/* AFTER EFFECTS type, drifting in alternate directions */}
                {rows.map((y, i) => (
                    <text key={y} x={i % 2 ? -160 : 120} y={y} fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={128} fill="#EFEEF7" letterSpacing={-2}>
                        AFTER EFFECTS AFTER EFFECTS
                        <animateTransform attributeName="transform" type="translate" values={i % 2 ? "0 0;160 0;0 0" : "0 0;-160 0;0 0"} dur={`${14 + (i % 3) * 3}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines={`${EASE};${EASE}`} />
                    </text>
                ))}

                {/* dates */}
                <text transform="translate(48 92) rotate(90)" fontFamily={SANS} fontSize={18} fill={C.ink}>모집기간</text>
                <text transform="translate(44 168) rotate(90)" fontFamily={SANS} fontWeight={800} fontSize={66} fill={C.ink}>06.11</text>
                <line x1={68} y1={368} x2={68} y2={522} stroke={C.ink} strokeWidth={2} />
                <text transform="translate(44 558) rotate(90)" fontFamily={SANS} fontWeight={800} fontSize={66} fill={C.ink}>07.11</text>

                {/* bezier path with its handles; a ball eases along it */}
                <line x1={85} y1={495} x2={950} y2={495} stroke={C.line} strokeWidth={sw} />
                <path d={arc} fill="none" stroke={C.line} strokeWidth={sw} />
                <rect x={143} y={483} width={24} height={24} fill={C.yellow} stroke={C.line} strokeWidth={sw} />
                <rect x={459} y={54} width={22} height={22} fill={C.rose} stroke={C.line} strokeWidth={sw} />
                <line x1={800} y1={495} x2={878} y2={495} stroke={C.line} strokeWidth={4} />
                <rect x={867} y={485} width={22} height={20} fill={C.yellow} stroke={C.line} strokeWidth={sw} />
                <circle r={16} fill={C.yellow} stroke={C.line} strokeWidth={sw}>
                    <animateMotion path={arc} dur="3.2s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines={`${EASE};${EASE}`} />
                </circle>

                {/* pink layer bars and the yellow layer box */}
                <rect x={220} y={240} width={688} height={22} fill="#E9A2A5" stroke={C.line} strokeWidth={sw} />
                <rect x={335} y={288} width={573} height={22} fill="#E9A2A5" stroke={C.line} strokeWidth={sw} />
                <rect x={605} y={202} width={227} height={208} fill="#F8DF95" stroke={C.line} strokeWidth={sw} />

                {shapes.map((s, i) => (
                    <g key={i} transform={`translate(${s.x} ${s.y})`}>
                        <path d={s.d} fill={s.c} stroke={C.line} strokeWidth={1.4} style={{ animation: `mp-spin ${s.dur}s ease-in-out ${-i * 0.6}s infinite` }} />
                    </g>
                ))}
                <circle cx={279} cy={697} r={11} fill="#F6D6D6" />
                <circle cx={712} cy={815} r={17} fill={C.mint} stroke={C.line} strokeWidth={1.4}>
                    <animate attributeName="cy" values="815;790;815" dur="2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines={`${EASE};${EASE}`} />
                </circle>

                {/* bouncing ball trail, bottom right */}
                {[[600, 842], [676, 918], [755, 880], [838, 838], [905, 828]].map(([x, y], i) => (
                    <ellipse key={i} cx={x} cy={y} rx={42} ry={48} transform={`rotate(${-30 + i * 14} ${x} ${y})`} fill="#F4C7C9" stroke={C.line} strokeWidth={1.2} opacity={0.35} />
                ))}
                <rect x={650} y={1012} width={104} height={50} rx={22} fill="#F4C7C9" stroke={C.line} strokeWidth={1.2} opacity={0.5} />
                <g>
                    <animateMotion path="M700 1000 Q 760 760 905 800" dur="1.6s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.2 0.7 0.4 1;0.6 0 0.8 0.3" />
                    <ellipse cx={0} cy={-40} rx={40} ry={42} fill="#EFA9AC" stroke={C.line} strokeWidth={1.6}>
                        <animate attributeName="ry" values="30;48;42;48;30" keyTimes="0;0.12;0.5;0.88;1" dur="1.6s" repeatCount="indefinite" />
                        <animate attributeName="cy" values="-30;-48;-42;-48;-30" keyTimes="0;0.12;0.5;0.88;1" dur="1.6s" repeatCount="indefinite" />
                        <animate attributeName="rx" values="50;36;40;36;50" keyTimes="0;0.12;0.5;0.88;1" dur="1.6s" repeatCount="indefinite" />
                    </ellipse>
                </g>

                {/* the sitting mannequin bounces on its bean seat */}
                <g style={{ animation: "mp-sit 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite" }}>
                    {/* bean seat */}
                    <g transform="translate(505 820)">
                        <g style={{ animation: "mp-bowl 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite" }}>
                            <path d="M-168 -176 Q -150 -196 -110 -182 Q 0 -150 110 -182 Q 150 -196 168 -176 C 178 -40, 95 0, 0 0 C -95 0, -178 -40, -168 -176 Z" fill="url(#mp-bowl)" stroke={C.line} strokeWidth={sw} />
                        </g>
                    </g>
                    {[[340, 648, C.yellow], [672, 648, C.yellow]].map(([x, y, c]) => (
                        <g key={x as number}>
                            <rect x={(x as number) - 30} y={(y as number) - 32} width={60} height={64} fill="none" stroke={c as string} strokeWidth={1.4} strokeDasharray="7 6" />
                            <circle cx={x as number} cy={y as number} r={7} fill="none" stroke={C.joint} strokeWidth={2} />
                        </g>
                    ))}
                    {/* squash lines */}
                    <g stroke={C.line} strokeWidth={1.6} fill="none" strokeLinecap="round" style={{ animation: "mp-pulse 1.6s ease-in-out infinite" }}>
                        <path d="M330 562 Q 360 570 382 592" /><path d="M342 586 Q 360 595 375 610" />
                        <path d="M592 607 Q 610 585 640 580" /><path d="M604 616 Q 620 600 650 596" />
                    </g>

                    {/* torso */}
                    <path d="M432 610 L432 488 Q432 436 488 436 L522 436 Q572 440 572 494 L572 610 Z" fill={C.pink} stroke={C.line} strokeWidth={sw} />
                    <rect x={482} y={570} width={60} height={60} fill="none" stroke={C.pivot} strokeWidth={1.4} strokeDasharray="7 6" />
                    <circle cx={512} cy={600} r={7} fill="none" stroke={C.joint} strokeWidth={2} />

                    {/* legs, knees up toward us */}
                    <rect x={488} y={630} width={58} height={210} rx={20} fill="url(#mp-leg)" stroke={C.line} strokeWidth={sw} />
                    <rect x={546} y={618} width={58} height={208} rx={20} fill="url(#mp-leg)" stroke={C.line} strokeWidth={sw} />
                    {[[523, 660], [577, 653]].map(([x, y]) => (
                        <g key={x}><rect x={x - 32} y={y - 30} width={64} height={62} fill="none" stroke={C.pivot} strokeWidth={1.4} strokeDasharray="7 6" /><circle cx={x} cy={y} r={7} fill="none" stroke={C.joint} strokeWidth={2} /></g>
                    ))}
                    <rect x={480} y={828} width={62} height={92} rx={28} fill="#fff" stroke={C.line} strokeWidth={sw} />
                    <rect x={544} y={818} width={62} height={108} rx={28} fill="#fff" stroke={C.line} strokeWidth={sw} />
                    <circle cx={509} cy={850} r={7} fill="none" stroke={C.joint} strokeWidth={2} />
                    <circle cx={575} cy={840} r={7} fill="none" stroke={C.joint} strokeWidth={2} />

                    {/* resting arm and hand on the knee */}
                    <rect x={390} y={455} width={48} height={120} rx={24} fill={C.pink} stroke={C.line} strokeWidth={sw} />
                    <circle cx={414} cy={551} r={7} fill="none" stroke={C.joint} strokeWidth={2} />
                    <rect x={384} y={520} width={62} height={64} fill="none" stroke={C.pivot} strokeWidth={1.4} strokeDasharray="7 6" />
                    <g transform="translate(420 606)">
                        <rect x={-30} y={-8} width={60} height={20} rx={8} fill="#fff" stroke={C.line} strokeWidth={sw} />
                        {[-20, -7, 6, 19].map((x) => <rect key={x} x={x - 7} y={6} width={14} height={36} rx={7} fill="#fff" stroke={C.line} strokeWidth={sw} />)}
                        <circle cx={0} cy={4} r={7} fill="none" stroke={C.joint} strokeWidth={2} />
                    </g>

                    {/* head */}
                    <g transform="translate(490 412)">
                        <g style={{ animation: "mp-tilt 3.2s ease-in-out infinite" }}>
                            <circle cx={0} cy={-60} r={64} fill={C.pink} stroke={C.line} strokeWidth={sw} />
                            <rect x={-30} y={-92} width={60} height={62} fill="none" stroke={C.pivot} strokeWidth={1.6} strokeDasharray="8 7" transform="rotate(-6 0 -60)" />
                            <circle cx={0} cy={-60} r={7} fill="none" stroke={C.joint} strokeWidth={2} />
                        </g>
                    </g>

                    {/* waving arm: upper arm from the shoulder, forearm turning at the elbow, onion-skin frames behind */}
                    <g transform="translate(560 458)">
                        <g style={{ animation: "mp-upper 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite" }}>
                            <rect x={-10} y={-26} width={112} height={52} rx={26} fill={C.pink} stroke={C.line} strokeWidth={sw} />
                            <g transform="translate(92 0) rotate(22)">
                                <g transform="rotate(58)"><Forearm ghost /></g>
                                <g transform="rotate(34)"><Forearm ghost /></g>
                                <g style={{ animation: "mp-wave 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite" }}>
                                    <Forearm />
                                    <path d="M10 -104 L10 -66 L19 -75 L27 -58 L33 -61 L25 -78 L37 -79 Z" fill="#fff" stroke={C.line} strokeWidth={1.6} strokeLinejoin="round" />
                                </g>
                            </g>
                        </g>
                    </g>
                    <g stroke={C.line} strokeWidth={1.6} fill="none" strokeLinecap="round" style={{ animation: "mp-pulse 0.8s ease-in-out infinite" }}>
                        <path d="M752 272 Q 790 300 790 345" /><path d="M770 262 Q 808 300 805 350" />
                    </g>
                </g>

                {/* title */}
                <text x={52} y={858} fontFamily={SANS} fontWeight={300} fontSize={64} fill={C.ink} letterSpacing={-1}>Designer yulim</text>
                <rect x={46} y={858} width={424} height={9} fill={C.purple} />
                <text x={44} y={962} fontFamily={SANS} fontWeight={900} fontSize={88} fill={C.ink} letterSpacing={-3}>2D 모션 그래픽</text>
                <rect x={186} y={985} width={186} height={74} rx={37} fill={C.purple} />
                <text x={44} y={1050} fontFamily={SANS} fontWeight={900} fontSize={88} fill={C.ink} letterSpacing={-3}>입문<tspan fill="#fff" dx={8}>무료</tspan><tspan dx={8}>특강</tspan></text>
            </g>
        </svg>
    )
}

/** Lesson 1, as on the leaflet: a ball hops from pad to pad, squashing on each landing. */
function PadBounce({ width }: { width: number }) {
    const path = "M70 200 Q 160 10 250 200 Q 160 10 70 200"
    const kt = "0;0.07;0.25;0.43;0.5;0.57;0.75;0.93;1"
    return (
        <svg viewBox="0 0 320 250" width={width} style={{ display: "block", overflow: "visible" }}>
            {[[95, 120, -30], [130, 78, -12], [190, 78, 12], [225, 120, 30]].map(([x, y, a], i) => (
                <ellipse key={i} cx={x} cy={y} rx={22} ry={26} transform={`rotate(${a} ${x} ${y})`} fill="#F4C7C9" stroke={C.line} strokeWidth={1} opacity={0.4} />
            ))}
            <line x1={0} y1={222} x2={320} y2={222} stroke={C.line} strokeWidth={1.4} />
            {[70, 250].map((x) => (
                <g key={x}>
                    <rect x={x - 34} y={200} width={68} height={22} rx={10} fill="#EFA9AC" stroke={C.line} strokeWidth={1.6} />
                    <rect x={x - 22} y={186} width={44} height={40} fill="none" stroke={C.pivot} strokeWidth={1.2} strokeDasharray="4 3" />
                </g>
            ))}
            <g>
                <animateMotion path={path} dur="2s" repeatCount="indefinite" keyPoints="0;0.04;0.25;0.46;0.5;0.54;0.75;0.96;1" keyTimes={kt} calcMode="linear" />
                <ellipse cx={0} cy={-22} rx={22} ry={22} fill={C.rose} stroke={C.line} strokeWidth={1.6}>
                    <animate attributeName="ry" values="14;26;22;26;14;26;22;26;14" keyTimes={kt} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="-14;-26;-22;-26;-14;-26;-22;-26;-14" keyTimes={kt} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="rx" values="30;18;22;18;30;18;22;18;30" keyTimes={kt} dur="2s" repeatCount="indefinite" />
                </ellipse>
                <circle cx={0} cy={-22} r={4} fill="none" stroke={C.joint} strokeWidth={1.4} />
            </g>
        </svg>
    )
}

/** Lesson 2, as on the leaflet: two puppets on long strings, the head trailing the swing, and a timeline below. */
function Puppets({ width }: { width: number }) {
    const ease = "cubic-bezier(0.45, 0, 0.55, 1)"
    const puppet = (x: number, delay: string, flip: boolean) => (
        <g transform={`translate(${x} -30)`}>
            <g style={{ animation: `ml-swing 2.4s ${ease} ${delay} infinite` }}>
                <line x1={-4} y1={0} x2={-4} y2={160} stroke="#9FD3DA" strokeWidth={1.4} />
                <line x1={6} y1={0} x2={6} y2={160} stroke="#9FD3DA" strokeWidth={1.4} />
                <g transform={`translate(0 160) scale(${flip ? -1 : 1} 1)`}>
                    <rect x={-30} y={-2} width={56} height={9} fill={C.purple} stroke={C.line} strokeWidth={1.2} transform="rotate(12)" />
                    <rect x={-36} y={-14} width={50} height={20} rx={10} fill="#EFA9AC" stroke={C.line} strokeWidth={1.4} />
                    <g style={{ animation: `ml-lag 2.4s ${ease} ${delay} infinite` }}>
                        <circle cx={6} cy={-46} r={32} fill="#EFA9AC" stroke={C.line} strokeWidth={1.4} />
                        <ellipse cx={-6} cy={-50} rx={4} ry={5} fill={C.line} />
                        <rect x={-10} y={-62} width={32} height={30} fill="none" stroke={C.pivot} strokeWidth={1.1} strokeDasharray="4 3" transform="rotate(20 6 -46)" />
                        <path d="M40 -46 Q 60 -48 76 -44 M38 -36 Q 56 -34 70 -30" stroke={C.line} strokeWidth={1.2} fill="none" />
                    </g>
                    <circle cx={-20} cy={-4} r={4} fill="none" stroke={C.joint} strokeWidth={1.3} />
                </g>
            </g>
        </g>
    )
    return (
        <svg className="mq" viewBox="0 0 320 300" width={width} style={{ display: "block", overflow: "visible" }}>
            {puppet(110, "0s", true)}
            {puppet(225, "-0.4s", false)}
            {/* timeline: layer bars, keyframes, a playhead running across */}
            <g transform="translate(20 200)">
                <rect x={0} y={0} width={280} height={96} fill="#FDF4D6" stroke={C.line} strokeWidth={1.4} />
                <rect x={0} y={0} width={34} height={96} fill="#F6E1E2" stroke={C.line} strokeWidth={1.4} />
                <rect x={-8} y={22} width={34} height={8} rx={4} fill="#B7AEE0" stroke={C.line} strokeWidth={1} />
                <rect x={-8} y={50} width={34} height={8} rx={4} fill="#B7AEE0" stroke={C.line} strokeWidth={1} />
                <rect x={34} y={20} width={246} height={7} fill="#EFA9AC" />
                <rect x={60} y={48} width={220} height={7} fill="#EFA9AC" />
                {[[62, 36], [74, 36], [130, 36], [142, 36], [96, 64], [108, 64], [210, 64], [222, 64]].map(([x, y], i) => (
                    <path key={i} d={`M${x - 4} ${y - 5} L${x + 4} ${y - 5} L${x - 4} ${y + 5} L${x + 4} ${y + 5} Z`} fill="none" stroke={C.line} strokeWidth={1.1} />
                ))}
                <g style={{ animation: "mp-play 2.4s linear infinite" }}>
                    <line x1={46} y1={4} x2={46} y2={96} stroke={C.line} strokeWidth={1.2} />
                    <path d="M40 -4 L52 -4 L52 6 L46 12 L40 6 Z" fill="#EFA9AC" stroke={C.line} strokeWidth={1} />
                </g>
            </g>
        </svg>
    )
}

/* ---------------- The board ---------------- */

/**
 * Motion graphics lecture project: moving hero, the three lessons as live demos, then the printed pieces.
 */
export default function MotionLecture() {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const [w, setW] = React.useState(1440)
    React.useEffect(() => {
        const el = rootRef.current
        if (!el) return
        setW(el.getBoundingClientRect().width || 1440)
        const ro = new ResizeObserver(([e]) => { if (e.contentRect.width > 0) setW(e.contentRect.width) })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    const m = w < 760
    const pad = m ? 20 : Math.round(w * 0.04)
    const small: React.CSSProperties = { fontFamily: SANS, fontSize: 12, lineHeight: 1.6, letterSpacing: "0.02em" }
    const body: React.CSSProperties = { fontFamily: SANS, fontSize: m ? 13 : 15, lineHeight: 1.75, margin: 0, wordBreak: "keep-all", color: C.ink }
    const titleSize = m ? 40 : Math.min(84, Math.round(w * 0.058))

    const lessons = [
        {
            n: "1", title: "도형을 변형하여\n공 튀기는 모션 만들기", stage: <PadBounce width={m ? 240 : 270} />,
            points: ["모션에 대한 기본 지식을 공이 튀는 모습을 통해 쉽게 이해할 수 있습니다.", "키프레임 어시스턴트의 Easy-Ease, Easy-In, Easy-Out을 심도 있게 이해할 수 있습니다.", "Bezier 곡선을 이해하고 활용할 수 있습니다."],
        },
        {
            n: "2", title: "시간 차를 활용하여\n그네 타는 모션 만들기", stage: <Puppets width={m ? 240 : 270} />,
            points: ["실제 동영상을 통해 그네와 사람의 움직임을 단순한 동작으로 구분할 수 있습니다.", "시간 차의 개념을 심도 있게 이해할 수 있습니다.", "2등신 캐릭터의 신체 움직임과 모션블러의 원리를 이해할 수 있습니다."],
        },
        {
            n: "3", title: "듀익 바셀을 활용하여\n인체 모션 만들기", stage: <Mannequin pose="walk" width={m ? 150 : 180} />,
            points: ["<듀익 바셀> 플러그인을 이해하고 사용할 수 있습니다.", "신체의 관절을 분리하여 사고하고 정확한 관절에 모션을 줄 수 있습니다.", "Walk Cycle을 이해하고 걷는 모션을 GIF로 저장할 수 있습니다."],
        },
    ]

    const confetti = [
        { x: "8%", y: "18%", c: C.yellow, s: 14, shape: "sq" as const, r: 20 },
        { x: "46%", y: "10%", c: C.mint, s: 12, shape: "tri" as const, d: 1 },
        { x: "52%", y: "78%", c: C.purple, s: 9, shape: "dot" as const, d: 0.5 },
        { x: "90%", y: "16%", c: C.rose, s: 12, shape: "sq" as const, r: 45, d: 1.4 },
        { x: "94%", y: "70%", c: C.yellow, s: 16, shape: "tri" as const, d: 0.8 },
        { x: "30%", y: "86%", c: C.mint, s: 10, shape: "dot" as const, d: 1.2 },
    ]

    return (
        <div ref={rootRef} style={{ width: "100%", fontFamily: SANS, color: C.ink }}>
            <style>{CSS}</style>

            {/* Hero: the poster itself, redrawn and set in motion */}
            <section style={{ position: "relative", overflow: "hidden", background: C.paper, backgroundImage: "linear-gradient(rgba(238,142,140,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(238,142,140,0.12) 1px, transparent 1px)", backgroundSize: "40px 40px", padding: m ? "48px 20px" : `${Math.round(w * 0.05)}px ${pad}px`, display: "grid", gridTemplateColumns: m ? "1fr" : "minmax(0, 1.25fr) minmax(0, 1fr)", alignItems: "center", gap: m ? 28 : pad * 1.5 }}>
                <Confetti items={confetti} />
                <div style={{ position: "relative", boxShadow: "0 30px 80px rgba(47,42,42,0.14)" }}>
                    <MovingPoster />
                </div>
                <div style={{ position: "relative" }}>
                    <div style={{ ...small, color: C.rose, textTransform: "uppercase", marginBottom: m ? 14 : 22 }}>Moving Poster</div>
                    <h2 style={{ margin: 0, fontWeight: 800, fontSize: m ? 30 : Math.min(48, Math.round(w * 0.032)), lineHeight: 1.2, letterSpacing: "-0.03em" }}>
                        2D 모션 그래픽<br />
                        입문 <span style={{ display: "inline-block", background: C.purple, color: "#fff", borderRadius: 999, padding: "0 0.28em", lineHeight: 1.1 }}>무료</span> 특강
                    </h2>
                    <p style={{ ...body, marginTop: m ? 16 : 24, maxWidth: 420 }}>
                        포스터 속 장면을 그대로 움직이게 했습니다. 캐릭터는 관절마다 앵커 포인트를 두고 팔꿈치를 축으로 손을 흔들고, 공은 베지어 곡선을 따라 이징되며, 바닥의 공은 착지할 때마다 찌그러집니다.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: m ? 24 : 40, fontWeight: 800, fontSize: m ? 20 : 26, letterSpacing: "-0.02em" }}>
                        <span>06.11</span><span style={{ width: m ? 48 : 72, height: 2, background: C.ink }} /><span>07.11</span>
                    </div>
                </div>
            </section>

            {/* Concept + the three posters */}
            <section style={{ padding: m ? "56px 20px" : `${Math.round(w * 0.06)}px ${pad}px` }}>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 28 : pad * 1.5, alignItems: "center", marginBottom: m ? 40 : 72 }}>
                    <Reveal>
                        <div style={{ ...small, color: C.rose, textTransform: "uppercase", marginBottom: 12 }}>Concept</div>
                        <p style={body}>
                            가상의 모션그래픽 입문 무료 특강을 홍보하는 홍보물을 제작했습니다. 애프터이펙트로 움직임을 줄 때 기준이 되는 관절의 위치(앵커 포인트)와 인플루언스를 활용한 속도 조절을 시각적으로 드러내, 모션그래픽 특강임을 표현했습니다.
                        </p>
                        <p style={{ ...body, marginTop: 14, color: C.muted }}>
                            어렵게 느껴질 수 있는 모션그래픽을 부드러운 파스텔 그래픽으로 친근하게 풀고, 선을 유연하게 그려 모션감을 살렸습니다.
                        </p>
                    </Reveal>
                    <Reveal delay={0.15} style={{ display: "flex", justifyContent: "center" }}>
                        <BezierPath width={m ? 280 : Math.min(420, Math.round(w * 0.28))} />
                    </Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 16 : 20 }}>
                    {["05", "06", "07"].map((p, i) => (
                        <Reveal key={p} delay={i * 0.12}>
                            <img src={`${IMG}mo-poster-${p}.jpg`} alt={`Poster ${i + 1}`} loading="lazy" style={{ width: "100%", height: "auto", display: "block", boxShadow: "0 24px 60px rgba(47,42,42,0.12)" }} />
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* The three lessons, each as a live demo */}
            <section style={{ background: C.paper, padding: m ? "56px 20px" : `${Math.round(w * 0.06)}px ${pad}px` }}>
                <Reveal>
                    <div style={{ ...small, color: C.rose, textTransform: "uppercase", marginBottom: 10 }}>Curriculum</div>
                    <p style={{ ...body, maxWidth: 560, marginBottom: m ? 32 : 56 }}>특강에서 배우는 세 가지 핵심 동작을, 리플렛 속 캐릭터와 아이콘 그대로 움직이게 만들었습니다.</p>
                </Reveal>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 16 : 20 }}>
                    {lessons.map((l, i) => (
                        <Reveal key={l.n} delay={i * 0.12} style={{ background: "#fff", border: "1px solid rgba(47,42,42,0.08)", padding: m ? 20 : 28, display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <h3 style={{ margin: 0, whiteSpace: "pre-line", wordBreak: "keep-all", fontSize: m ? 18 : 20, fontWeight: 700, lineHeight: 1.4, letterSpacing: "-0.02em" }}>{l.title}</h3>
                                <span style={{ fontWeight: 800, fontSize: m ? 44 : 56, lineHeight: 0.9, color: C.rose }}>{l.n}</span>
                            </div>
                            <div style={{ height: m ? 240 : 300, display: "flex", alignItems: "center", justifyContent: "center", margin: "16px 0" }}>{l.stage}</div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                                {l.points.map((t) => (
                                    <li key={t} style={{ display: "flex", gap: 10, fontSize: 13, lineHeight: 1.6, wordBreak: "keep-all" }}>
                                        <span style={{ flexShrink: 0, width: 10, height: 10, marginTop: 5, borderRadius: "50%", background: C.mint, border: `1px solid ${C.line}` }} />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* The printed pieces: leaflet, then the presentation boards */}
            {["04", "03", "02", "01", "09"].map((p) => (
                <img key={p} src={`${IMG}mo-board-${p}.jpg`} alt="Motion graphics lecture board" loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
            ))}
        </div>
    )
}
