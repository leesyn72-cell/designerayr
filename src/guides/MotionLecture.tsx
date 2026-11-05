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
            n: "1", title: "도형을 변형하여\n공 튀기는 모션 만들기", stage: <BouncingBall size={m ? 44 : 56} />,
            points: ["모션에 대한 기본 지식을 공이 튀는 모습을 통해 쉽게 이해할 수 있습니다.", "키프레임 어시스턴트의 Easy-Ease, Easy-In, Easy-Out을 심도 있게 이해할 수 있습니다.", "Bezier 곡선을 이해하고 활용할 수 있습니다."],
        },
        {
            n: "2", title: "시간 차를 활용하여\n그네 타는 모션 만들기", stage: <Swing width={m ? 200 : 240} />,
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

            {/* Hero: the character waves while a ball keeps bouncing beside it */}
            <section style={{ position: "relative", overflow: "hidden", background: C.paper, backgroundImage: "linear-gradient(rgba(238,142,140,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(238,142,140,0.12) 1px, transparent 1px)", backgroundSize: "40px 40px", padding: m ? "56px 20px 40px" : `${Math.round(w * 0.06)}px ${pad}px`, display: "grid", gridTemplateColumns: m ? "1fr" : "1.1fr 1fr", alignItems: "center", gap: m ? 24 : pad }}>
                <Confetti items={confetti} />
                <div style={{ position: "relative" }}>
                    <div style={{ ...small, color: C.muted, textTransform: "uppercase", marginBottom: m ? 18 : 28 }}>Poster · Leaflet · Banner</div>
                    <h2 style={{ margin: 0, fontWeight: 800, fontSize: titleSize, lineHeight: 1.12, letterSpacing: "-0.03em" }}>
                        2D 모션 그래픽<br />
                        입문 <span style={{ display: "inline-block", background: C.purple, color: "#fff", borderRadius: 999, padding: "0 0.28em", lineHeight: 1.05 }}>무료</span> 특강
                    </h2>
                    <div style={{ marginTop: m ? 14 : 20, fontFamily: SERIF, fontStyle: "italic", fontSize: m ? 22 : 30, color: C.purple, borderBottom: `2px solid ${C.purple}`, display: "inline-block", lineHeight: 1.1 }}>with Designer yulim</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: m ? 28 : 48, fontWeight: 800, fontSize: m ? 22 : 30, letterSpacing: "-0.02em" }}>
                        <span>06.11</span><span style={{ width: m ? 48 : 80, height: 2, background: C.ink }} /><span>07.11</span>
                    </div>
                </div>
                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: m ? 8 : 24 }}>
                    <Mannequin pose="wave" width={m ? 200 : Math.min(300, Math.round(w * 0.2))} />
                    <div style={{ marginBottom: 6 }}><BouncingBall size={m ? 34 : 44} /></div>
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
                                <h3 style={{ margin: 0, whiteSpace: "pre-line", fontSize: m ? 18 : 20, fontWeight: 700, lineHeight: 1.4, letterSpacing: "-0.02em" }}>{l.title}</h3>
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
