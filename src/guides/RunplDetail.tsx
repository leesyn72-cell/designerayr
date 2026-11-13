import * as React from "react"

// atflee (앳플리) Runpl x Kim Kuk-young: a client collaboration. Thumbnail and detail pages.
// The intro re-plays the detail page's hero: speed lines sweep in, the runner dashes in with after-images,
// then the headline and the Runpl logotype slice in. Every piece comes from the final files and the shoot.

const IMG = "/assets/img/"
const C = { ink: "#121212", gold: "#C9A227", board: "#F2F1F5", paper: "#F6F5F2", muted: "#777" }
const SANS = '"Pretendard", "Inter", "Apple SD Gothic Neo", system-ui, sans-serif'

const CSS = `
@keyframes rp-run { 0% { transform: translateX(-70%); opacity: 0; filter: blur(14px) } 4% { opacity: 1 } 13% { transform: translateX(3%); filter: blur(0) } 17%, 86% { transform: translateX(0); opacity: 1; filter: blur(0) } 94%, 100% { transform: translateX(45%); opacity: 0; filter: blur(12px) } }
@keyframes rp-ghost { 0% { transform: translateX(-70%); opacity: 0 } 5% { opacity: var(--o) } 15% { transform: translateX(0); opacity: 0 } 100% { opacity: 0 } }
@keyframes rp-sweep { 0% { transform: translateX(-110%); opacity: 0 } 3% { opacity: 1 } 14% { transform: translateX(110%); opacity: 0 } 100% { transform: translateX(110%); opacity: 0 } }
@keyframes rp-pop { 0%, 30% { transform: scale(0) rotate(-30deg) } 36% { transform: scale(1.12) rotate(4deg) } 40%, 88% { transform: scale(1) rotate(0) } 95%, 100% { transform: scale(0) } }
@keyframes rp-fade { 0%, 34% { opacity: 0 } 42%, 88% { opacity: 1 } 95%, 100% { opacity: 0 } }
@keyframes rp-lines { from { background-position: 0 0 } to { background-position: 46px 0 } }
` + [14, 18, 22, 27].map((a) => `@keyframes rp-wipe-${a} { 0%, ${a}% { clip-path: inset(0 100% 0 0); transform: translateX(-24px) } ${a + 5}%, 88% { clip-path: inset(0 0 0 0); transform: translateX(0) } 95%, 100% { clip-path: inset(0 0 0 100%); transform: translateX(24px) } }`).join("\n") + `
@keyframes rp-cover-out { 0%, 82% { clip-path: inset(0 0 0 0) } 100% { clip-path: inset(0 0 0 100%) } }
@keyframes rp-cover-in { 0% { opacity: 0; transform: translateY(24px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes rp-cover-streak { 0%, 78% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
@media (prefers-reduced-motion: reduce) { .rp-intro * { animation: none !important; clip-path: none !important; opacity: 1 !important } .rp-cover { display: none } }
`
// The atflee card holds for this long before it sweeps away and the hero loop starts.
const COVER = 3.4

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
    const [ref, seen] = useInView<HTMLDivElement>(0.12)
    return (
        <div ref={ref} style={{ ...style, opacity: seen ? 1 : 0, transform: `translateY(${seen ? 0 : 30}px)`, transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
            {children}
        </div>
    )
}

/** A label with a dotted leader line running toward the artwork, as on a presentation board. */
function Note({ title, text, side, m }: { title: string; text: string; side: "left" | "right"; m: boolean }) {
    return (
        <div style={{ position: "relative", fontFamily: SANS, color: C.ink, maxWidth: 300 }}>
            <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: m ? 12 : 13, lineHeight: 1.75, color: "#555", wordBreak: "keep-all" }}>{text}</div>
            {!m && (
                <div style={{ position: "absolute", top: 9, [side === "left" ? "left" : "right"]: "calc(100% + 16px)", width: 90, borderTop: "1.5px dotted #B9B7C2" } as React.CSSProperties}>
                    <span style={{ position: "absolute", top: -4, [side === "left" ? "right" : "left"]: -3, width: 6, height: 6, borderRadius: "50%", background: "#9E9CA8" } as React.CSSProperties} />
                </div>
            )}
        </div>
    )
}

function Page({ file, alt, ratio }: { file: string; alt: string; ratio: string }) {
    return <img src={`${IMG}${file}`} alt={alt} loading="lazy" draggable={false} style={{ width: "100%", aspectRatio: ratio, display: "block", borderRadius: 10, boxShadow: "0 30px 70px rgba(18,18,18,0.14)" }} />
}

/** The hero, replayed: speed lines, the runner with after-images, the headline and logotype slicing in. */
function Intro({ m, w }: { m: boolean; w: number }) {
    const dur = "6.4s"
    // The hero loop starts once the atflee card has swept away, then repeats.
    const play = (name: string, extra = 0) => `${name} ${dur} cubic-bezier(0.22, 1, 0.36, 1) ${COVER + extra}s infinite both`
    const piece = (file: string, width: string, a: number, style?: React.CSSProperties) => (
        <img src={`${IMG}${file}`} alt="" draggable={false} style={{ display: "block", width, mixBlendMode: "multiply", clipPath: "inset(0 100% 0 0)", animation: play(`rp-wipe-${a}`), ...style }} />
    )
    const runnerW = m ? "64%" : "34%"
    return (
        <div className="rp-intro" style={{ position: "relative", width: "100%", aspectRatio: m ? "4 / 5" : "16 / 9", background: C.paper, overflow: "hidden" }}>
            {/* standing speed lines on both sides, drifting */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, transparent 0 22px, rgba(201,162,39,0.20) 22px 23px)", WebkitMaskImage: "linear-gradient(90deg, #000 0, transparent 26%, transparent 74%, #000 100%)", maskImage: "linear-gradient(90deg, #000 0, transparent 26%, transparent 74%, #000 100%)", animation: "rp-lines 1.6s linear infinite" }} />
            {/* a burst of streaks that sweeps across ahead of the runner */}
            <div style={{ position: "absolute", left: 0, right: 0, top: m ? "40%" : "22%", height: m ? "40%" : "60%", opacity: 0, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 9px, rgba(18,18,18,0.16) 9px 10px, transparent 10px 23px, rgba(201,162,39,0.4) 23px 24px)", animation: play("rp-sweep") }} />

            {/* runner and two after-images */}
            <div style={{ position: "absolute", left: m ? "18%" : "50%", bottom: m ? "-6%" : "-8%", width: runnerW }}>
                {[0.28, 0.14].map((o, i) => (
                    <img key={o} src={`${IMG}rp-runner.png`} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, ["--o" as any]: o, animation: play("rp-ghost", (i + 1) * 0.07), filter: "blur(2px)" }} />
                ))}
                <img src={`${IMG}rp-runner.png`} alt="Kim Kuk-young running with Runpl" draggable={false} style={{ position: "relative", width: "100%", display: "block", opacity: 0, animation: play("rp-run") }} />
            </div>

            {/* headline and logotype */}
            <div style={{ position: "absolute", left: m ? "6%" : "9%", top: m ? "7%" : "16%", width: m ? "88%" : "40%", display: "flex", flexDirection: "column", alignItems: "center", gap: m ? 6 : Math.round(w * 0.006) }}>
                {piece("rp-t1.jpg", "56%", 14)}
                {piece("rp-t2.jpg", "64%", 18)}
                {piece("rp-t3.jpg", "86%", 22)}
                {piece("rp-t4.jpg", "88%", 27, { marginTop: m ? 4 : Math.round(w * 0.008) })}
            </div>

            {/* patent badge and logo */}
            <img src={`${IMG}rp-badge.png`} alt="" draggable={false} style={{ position: "absolute", left: m ? "5%" : "4%", bottom: m ? "4%" : "7%", width: m ? "22%" : "9%", transform: "scale(0)", animation: play("rp-pop") }} />
            <img src={`${IMG}rp-logo.png`} alt="Runpl" draggable={false} style={{ position: "absolute", right: m ? "5%" : "4%", bottom: m ? "5%" : "7%", width: m ? "20%" : "9%", opacity: 0, filter: "grayscale(1) brightness(0.8)", animation: play("rp-fade") }} />

            {/* Opening card: atflee orange with the logo and the collaboration, then a quick sweep into the hero */}
            <div className="rp-cover" style={{ position: "absolute", inset: 0, zIndex: 5, background: "#F06721", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: m ? 18 : Math.round(w * 0.018), animation: `rp-cover-out ${COVER}s cubic-bezier(0.7, 0, 0.3, 1) both`, fontFamily: SANS }}>
                <div style={{ display: "flex", alignItems: "center", gap: m ? 14 : Math.round(w * 0.022), animation: "rp-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both" }}>
                    <img src={`${IMG}atflee-white.svg`} alt="atflee" draggable={false} style={{ height: m ? 40 : Math.round(w * 0.05), display: "block" }} />
                    <span style={{ fontSize: m ? 26 : Math.round(w * 0.03), fontWeight: 300, opacity: 0.85 }}>×</span>
                    <span style={{ fontSize: m ? 30 : Math.round(w * 0.042), fontWeight: 800, letterSpacing: "-0.03em" }}>김국영</span>
                </div>
                <div style={{ textAlign: "center", animation: "rp-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both" }}>
                    <div style={{ fontSize: m ? 16 : Math.min(26, Math.round(w * 0.017)), fontWeight: 600, letterSpacing: "-0.01em" }}>앳플리 런플 상세페이지 제작</div>
                    <div style={{ marginTop: 8, fontSize: m ? 11 : 13, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>atflee × Kim Kuk-young Collaboration</div>
                </div>
                {/* the sweep: a bright streak that crosses just as the card slides off */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0, rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 65%, transparent 100%)", animation: `rp-cover-streak ${COVER}s cubic-bezier(0.7, 0, 0.3, 1) both` }} />
            </div>
        </div>
    )
}

export default function RunplDetail() {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const [w, setW] = React.useState(1440)
    React.useEffect(() => {
        const el = rootRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        setW(el.getBoundingClientRect().width || 1440)
        const ro = new ResizeObserver(([e]) => { if (e.contentRect.width > 0) setW(e.contentRect.width) })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    const m = w < 760
    const pad = m ? 20 : Math.round(w * 0.04)
    const head: React.CSSProperties = { display: "flex", gap: m ? 18 : 48, fontFamily: SANS, fontSize: m ? 12 : 14, color: C.ink }

    return (
        <div ref={rootRef} style={{ width: "100%", fontFamily: SANS }}>
            <style>{CSS}</style>
            <Intro m={m} w={w} />


            {/* 01 Detail page board */}
            <section style={{ background: C.board, padding: m ? "40px 20px 56px" : `${Math.round(w * 0.035)}px ${pad}px ${Math.round(w * 0.07)}px` }}>
                <div style={{ display: "flex", justifyContent: "space-between", ...head }}>
                    <div style={{ display: "flex", gap: m ? 18 : 48 }}><span>01</span><span>런플 × 김국영</span></div>
                    <span>상세페이지</span>
                </div>
                {m ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 36 }}>
                        <Note side="left" m title="메인 비주얼" text="100m 한국 기록 보유자 김국영 코치의 달리는 컷 위에 런플 로고타입을 크게 올리고, 세로 라인으로 속도감을 더했습니다." />
                        <Page file="rp-d1.jpg" alt="Runpl detail page, part 1" ratio="900 / 1769" />
                        <Note side="right" m title="인터뷰" text="선수 시절 사진과 김국영 코치의 말을 인용으로 담아, 런플을 쓰는 이유를 직접 전합니다." />
                        <Page file="rp-d2.jpg" alt="Runpl detail page, part 2" ratio="900 / 2928" />
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.2fr 1fr", gap: Math.round(w * 0.03), marginTop: Math.round(w * 0.08), alignItems: "start" }}>
                        <Reveal style={{ marginTop: Math.round(w * 0.06), display: "flex", justifyContent: "flex-end", paddingRight: 110 }}>
                            <Note side="left" m={false} title="메인 비주얼" text="100m 한국 기록 보유자 김국영 코치의 달리는 컷 위에 런플 로고타입을 크게 올리고, 세로 라인으로 속도감을 더했습니다." />
                        </Reveal>
                        <Reveal><Page file="rp-d1.jpg" alt="Runpl detail page, part 1" ratio="900 / 1769" /></Reveal>
                        <Reveal delay={0.15} style={{ marginTop: Math.round(w * 0.16) }}><Page file="rp-d2.jpg" alt="Runpl detail page, part 2" ratio="900 / 2928" /></Reveal>
                        <Reveal style={{ marginTop: Math.round(w * 0.3), paddingLeft: 110 }}>
                            <Note side="right" m={false} title="인터뷰" text="선수 시절 사진과 김국영 코치의 말을 인용으로 담아, 런플을 쓰는 이유를 직접 전합니다." />
                        </Reveal>
                    </div>
                )}
            </section>

            {/* 02 Thumbnail board */}
            <section style={{ background: "#fff", padding: m ? "40px 20px 56px" : `${Math.round(w * 0.035)}px ${pad}px ${Math.round(w * 0.06)}px` }}>
                <div style={{ display: "flex", justifyContent: "space-between", ...head }}>
                    <div style={{ display: "flex", gap: m ? 18 : 48 }}><span>02</span><span>런플 × 김국영</span></div>
                    <span>썸네일</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1.4fr 1fr", gap: m ? 24 : Math.round(w * 0.03), marginTop: m ? 32 : Math.round(w * 0.05), alignItems: "center" }}>
                    {!m && <div />}
                    <Reveal><Page file="rp-thumb.jpg" alt="Runpl x Kim Kuk-young thumbnail" ratio="1 / 1" /></Reveal>
                    <Reveal delay={0.15} style={{ paddingLeft: m ? 0 : 110 }}>
                        <Note side="right" m={m} title="썸네일" text="제품을 든 정면 컷과 달리는 컷을 겹치고, '100m 한국기록 보유자 김국영 PICK' 배지로 신뢰를 더했습니다." />
                    </Reveal>
                </div>
            </section>
        </div>
    )
}
