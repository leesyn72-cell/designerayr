import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const IMG = "https://framerusercontent.com/images/"
const A = {
    wordmark: { red: IMG + "D3NaZsE2ifbXRjAjt0bBjryF53k.png", pink: IMG + "AF1OBblEz4VfIOErJAlgOWb0Y.png", black: IMG + "V74D00hRvOHYDxzLmAW7PhbaQDk.png" },
    script: { red: IMG + "nNEfqfe6u5ulTvxRHS4pROQy3WE.png", pink: IMG + "60lrqNA37x3PtFUPnRlgr8czlbg.png", black: IMG + "2YSCSNQsPgTBhEf1Ub4u0L1NUQ.png" },
    symLine: { red: IMG + "V86qc0EG4VuExCMqhTMR6nGHO4.png", pink: IMG + "dF6hib4GvgrBNoGiGIHq3RI5Sc.png", black: IMG + "GGeazH1SxB0LHEzAhKooct8EQ.png" },
    symSolid: { red: IMG + "PwDlNnzRqwqJOlc7wXbQBS4Ej0.png", pink: IMG + "PxhvnoYjQkumSFNII1IREq3Gww.png", black: IMG + "H9HB2EpJI4mEjhApTDfkjT44TE.png" },
}

type Tone = "red" | "pink" | "black"
const COLOR: Record<Tone, string> = { red: "#F91515", pink: "#FFDFD7", black: "#0A0203" }
const SERIF = '"Instrument Serif", "Times New Roman", serif'
const SANS = '"Inter Display", "Inter", "Pretendard", system-ui, sans-serif'
// Logo artwork ratio (wordmark and script share one frame)
const LOGO_RATIO = 2935 / 1070

const CSS = `
@keyframes om-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes om-marquee-rev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
@keyframes om-spin { to { transform: rotate(360deg) } }
@keyframes om-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6%) } }
@keyframes om-split { 0%, 18% { transform: translateY(0) } 38%, 72% { transform: translateY(var(--om-gap)) } 92%, 100% { transform: translateY(0) } }
@keyframes om-label { 0%, 22% { opacity: 0 } 40%, 70% { opacity: 1 } 88%, 100% { opacity: 0 } }
`

/** Fires once when the element scrolls into view. */
function useInView<T extends HTMLElement>(threshold = 0.25) {
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
    const [ref, seen] = useInView<HTMLDivElement>(0.2)
    return (
        <div ref={ref} style={{ ...style, opacity: seen ? 1 : 0, transform: `translateY(${seen ? 0 : 28}px)`, transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
            {children}
        </div>
    )
}

/** The lockup drawn left-to-right like handwriting: wordmark first, then the script. */
function Lockup({ word, script, width, draw = true, delay = 0 }: { word: Tone; script: Tone; width: number | string; draw?: boolean; delay?: number }) {
    const [ref, seen] = useInView<HTMLDivElement>(0.3)
    const on = !draw || seen
    const wipe = (d: number, dur: number): React.CSSProperties => ({
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
        clipPath: on ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        transition: `clip-path ${dur}s cubic-bezier(0.65, 0, 0.35, 1) ${delay + d}s`,
    })
    return (
        <div ref={ref} style={{ position: "relative", width, aspectRatio: `${LOGO_RATIO}` }}>
            <img src={A.wordmark[word]} alt="tandanji" style={wipe(0, 1.4)} draggable={false} />
            <img src={A.script[script]} alt="office meal" style={wipe(0.75, 1.3)} draggable={false} />
        </div>
    )
}

function Symbol({ tone, solid, size, style }: { tone: Tone; solid?: boolean; size: number; style?: React.CSSProperties }) {
    return <img src={(solid ? A.symSolid : A.symLine)[tone]} alt="O symbol" draggable={false} style={{ width: size, height: size, display: "block", ...style }} />
}

function Label({ n, title, color }: { n: string; title: string; color: string }) {
    return (
        <div style={{ display: "flex", gap: 14, fontFamily: SANS, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", color }}>
            <span style={{ opacity: 0.55 }}>{n}</span>
            <span>{title}</span>
        </div>
    )
}

/**
 * Tandanji Office Meal brand guideline: logo, symbol and color system with motion.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function OfficeMealGuideline(props: { style?: React.CSSProperties }) {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const [w, setW] = React.useState(1440)
    const [hot, setHot] = React.useState<number | null>(null)
    React.useEffect(() => {
        const el = rootRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(([e]) => { if (e.contentRect.width > 0) setW(e.contentRect.width) })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const m = w < 760
    const pad = m ? 20 : Math.round(w * 0.04)
    const section = (bg: string, extra?: React.CSSProperties): React.CSSProperties => ({ background: bg, padding: `${m ? 64 : Math.round(w * 0.07)}px ${pad}px`, position: "relative", overflow: "hidden", ...extra })
    const big = Math.min(m ? 30 : w * 0.046, 76)
    const body: React.CSSProperties = { fontFamily: SANS, fontSize: m ? 13 : 15, lineHeight: 1.75, margin: 0, wordBreak: "keep-all" }

    const colors = [
        { tone: "red" as Tone, name: "Office meal red", pantone: "2347 C", rgb: "249 21 21", cmyk: "0 94 100 0", hex: "#F91515", text: "#FFDFD7", copy: "음식과 식욕을 자연스럽게 연상시키는 컬러로, 브랜드의 에너지와 주목성을 강화합니다." },
        { tone: "pink" as Tone, name: "Office meal pink beige", pantone: "698 C", rgb: "255 223 215", cmyk: "0 15 3 0", hex: "#FFDFD7", text: "#F91515", copy: "따뜻하고 편안한 식사 경험을 전달합니다." },
        { tone: "black" as Tone, name: "Office meal black", pantone: "Black 6 C", rgb: "10 2 3", cmyk: "100 61 32 96", hex: "#0A0203", text: "#FFDFD7", copy: "정보 전달의 안정감과 전문성을 담당합니다." },
    ]

    const marqueeItem = (word: Tone, script: Tone, sym: Tone, h: number, key: number) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: h * 0.5, paddingRight: h * 0.5 }}>
            <div style={{ position: "relative", height: h, aspectRatio: `${LOGO_RATIO}` }}>
                <img src={A.wordmark[word]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} draggable={false} />
                <img src={A.script[script]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} draggable={false} />
            </div>
            <Symbol tone={sym} solid={key % 2 === 0} size={h * 0.42} />
        </div>
    )

    return (
        <div ref={rootRef} style={{ ...props.style, width: "100%", display: "flex", flexDirection: "column" }}>
            <style>{CSS}</style>

            {/* 1. Cover */}
            <div style={section(COLOR.red, { minHeight: m ? 520 : Math.round(w * 0.62), display: "flex", flexDirection: "column", justifyContent: "space-between" })}>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, fontFamily: SANS, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", color: COLOR.pink }}>
                    <span>Tandanji Office Meal</span>
                    <span style={{ textAlign: m ? "right" : "left" }}>Brand Guidelines</span>
                    {!m && <span>Logo & Color System</span>}
                    {!m && <span style={{ textAlign: "right" }}>Ver 2.0 — 2026</span>}
                </div>
                <div style={{ display: "flex", justifyContent: "center", padding: m ? "40px 0" : 0 }}>
                    <Lockup word="pink" script="pink" width={m ? "86%" : "58%"} delay={0.2} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", color: COLOR.pink, fontFamily: SANS, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    <span>Logo · Symbol · Color</span>
                    <Symbol tone="pink" size={m ? 28 : 40} style={{ animation: "om-spin 14s linear infinite" }} />
                </div>
            </div>

            {/* 2. Overview */}
            <div style={section(COLOR.pink, { color: COLOR.black })}>
                <Label n="00" title="Overview" color={COLOR.red} />
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.4fr 1fr", gap: m ? 28 : pad * 1.5, marginTop: m ? 28 : 48, alignItems: "end" }}>
                    <Reveal>
                        <p style={{ fontFamily: SERIF, fontSize: big, lineHeight: 1.08, margin: 0, color: COLOR.red, letterSpacing: "-0.01em" }}>
                            A soft, handwritten script that carries tandanji’s warmth into every office meal.
                        </p>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p style={body}>
                            office meal을 스크립트 서체로 적용해, 상단 tandanji 로고의 부드럽고 유기적인 무드와 자연스럽게 연결한 로고입니다. 곡선감이 강한 영문 서체는 기존 로고의 개성과 친근한 인상을 강조하고, 음식 브랜드가 가진 따뜻함과 감성적인 분위기를 더합니다.
                        </p>
                    </Reveal>
                </div>
            </div>

            {/* 3. Primary logo */}
            <div style={section("#FFFFFF")}>
                <Label n="01" title="Primary Logo" color={COLOR.red} />
                <div style={{ display: "flex", flexDirection: m ? "column" : "row", alignItems: "center", justifyContent: "center", gap: m ? 36 : pad * 1.6, padding: m ? "56px 0 40px" : `${Math.round(w * 0.08)}px 0` }}>
                    <Lockup word="red" script="black" width={m ? "88%" : "52%"} />
                    <Reveal delay={1.2}>
                        <Symbol tone="red" solid size={m ? 84 : Math.round(w * 0.085)} />
                    </Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 14 : 24, borderTop: "1px solid rgba(10,2,3,0.12)", paddingTop: 18 }}>
                    {[["Wordmark", "tandanji"], ["Script", "office meal"], ["Symbol", "O"]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, color: COLOR.black }}>
                            <span style={{ opacity: 0.5 }}>{k}</span>
                            <span>{v}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Anatomy: the two parts gently separate and come back together */}
            <div style={section("#F4F1EE")}>
                <Label n="02" title="Logo Structure" color={COLOR.red} />
                <div style={{ position: "relative", display: "flex", justifyContent: "center", padding: m ? "72px 0 88px" : `${Math.round(w * 0.075)}px 0 ${Math.round(w * 0.09)}px` }}>
                    <div style={{ position: "relative", width: m ? "86%" : "50%", aspectRatio: `${LOGO_RATIO}`, ["--om-gap" as any]: m ? "22px" : `${Math.round(w * 0.03)}px` }}>
                        <img src={A.wordmark.red} alt="tandanji" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} draggable={false} />
                        <img src={A.script.black} alt="office meal" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "om-split 6s cubic-bezier(0.65, 0, 0.35, 1) infinite" }} draggable={false} />
                        <span style={{ position: "absolute", left: 0, top: m ? -30 : -40, fontFamily: SANS, fontSize: 12, color: COLOR.red, animation: "om-label 6s ease infinite" }}>tandanji — Wordmark</span>
                        <span style={{ position: "absolute", right: 0, bottom: m ? -46 : -64, fontFamily: SANS, fontSize: 12, color: COLOR.black, animation: "om-label 6s ease infinite" }}>office meal — Script</span>
                    </div>
                </div>
                <p style={{ ...body, maxWidth: 560, color: COLOR.black, opacity: 0.75 }}>
                    굵고 둥근 tandanji 워드마크 아래로 office meal 스크립트가 겹쳐 흐르며, 두 서체가 하나의 손글씨처럼 이어집니다.
                </p>
            </div>

            {/* 5. Symbol */}
            <div style={section(COLOR.black, { color: COLOR.pink })}>
                <Label n="03" title="Symbol" color={COLOR.pink} />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: m ? 28 : pad * 2, padding: m ? "64px 0" : `${Math.round(w * 0.08)}px 0` }}>
                    <Reveal><Symbol tone="pink" size={m ? 110 : Math.round(w * 0.16)} style={{ animation: "om-float 4s ease-in-out infinite" }} /></Reveal>
                    <Reveal delay={0.2}><Symbol tone="pink" solid size={m ? 110 : Math.round(w * 0.16)} style={{ animation: "om-float 4s ease-in-out 0.6s infinite" }} /></Reveal>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, opacity: 0.7, gap: 16 }}>
                    <span>Line / Solid</span>
                    <span style={{ textAlign: "right", wordBreak: "keep-all" }}>O 심볼은 라인형과 면형 두 가지로 구성됩니다.</span>
                </div>
            </div>

            {/* 6. Color system: hover a swatch to open it */}
            <div style={section("#FFFFFF")}>
                <Label n="04" title="Color System" color={COLOR.red} />
                <Reveal>
                    <p style={{ ...body, maxWidth: 620, margin: m ? "24px 0 32px" : "32px 0 48px", color: COLOR.black }}>
                        Red, Pink Beige, Black — 세 가지 컬러로 탄단지박스와의 연결성을 유지하면서도, 신뢰감 있는 브랜드 이미지를 만듭니다.
                    </p>
                </Reveal>
                <div style={{ display: "flex", flexDirection: m ? "column" : "row", height: m ? "auto" : Math.round(w * 0.36), gap: 0 }} onMouseLeave={() => setHot(null)}>
                    {colors.map((c, i) => (
                        <div
                            key={c.hex}
                            onMouseEnter={() => setHot(i)}
                            style={{
                                flex: m ? "none" : hot === null ? 1 : hot === i ? 2.2 : 0.7,
                                minHeight: m ? 200 : undefined,
                                background: c.hex, color: c.text, padding: m ? 20 : 28,
                                display: "flex", flexDirection: "column", justifyContent: "space-between",
                                transition: "flex 0.8s cubic-bezier(0.16, 1, 0.3, 1)", overflow: "hidden",
                                border: c.tone === "pink" ? "none" : undefined,
                            }}
                        >
                            <div style={{ fontFamily: SERIF, fontSize: m ? 30 : Math.min(w * 0.03, 44), lineHeight: 1, whiteSpace: "nowrap" }}>{c.name}</div>
                            <div>
                                <p style={{ ...body, fontSize: 13, marginBottom: 18, maxWidth: 300, opacity: hot === i || m ? 1 : 0, transition: "opacity 0.5s ease" }}>{c.copy}</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", justifyContent: "start", gap: m ? "6px 18px" : "6px 28px", fontFamily: SANS, fontSize: 12, whiteSpace: "nowrap" }}>
                                    {[["Pantone", c.pantone], ["RGB", c.rgb], ["CMYK", c.cmyk], ["HEX", c.hex]].map(([k, v]) => (
                                        <div key={k}><div style={{ opacity: 0.6 }}>{k}</div><div>{v}</div></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. Logo on color */}
            <div style={section("#FFFFFF", { paddingTop: 0 })}>
                <Label n="05" title="Logo on Color" color={COLOR.red} />
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 8, marginTop: 24 }}>
                    {([["red", "pink", "pink"], ["pink", "red", "black"], ["black", "pink", "pink"]] as [Tone, Tone, Tone][]).map(([bg, word, script], i) => (
                        <Reveal key={bg} delay={i * 0.12}>
                            <div style={{ background: COLOR[bg], aspectRatio: m ? "4 / 3" : "3 / 4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
                                <Lockup word={word} script={script} width="72%" delay={0.3 + i * 0.15} />
                                <Symbol tone={word} solid={i !== 1} size={m ? 40 : Math.round(w * 0.035)} />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>

            {/* 8. Motion band */}
            <div style={{ background: COLOR.red, overflow: "hidden", padding: `${m ? 28 : 44}px 0` }}>
                <div style={{ display: "flex", width: "max-content", animation: "om-marquee 28s linear infinite" }}>
                    {Array.from({ length: 8 }, (_, i) => marqueeItem("pink", "pink", "pink", m ? 56 : 96, i))}
                </div>
            </div>
            <div style={{ background: COLOR.pink, overflow: "hidden", padding: `${m ? 28 : 44}px 0` }}>
                <div style={{ display: "flex", width: "max-content", animation: "om-marquee-rev 32s linear infinite" }}>
                    {Array.from({ length: 8 }, (_, i) => marqueeItem("red", "black", "red", m ? 56 : 96, i))}
                </div>
            </div>

            {/* 9. Closing */}
            <div style={section(COLOR.black, { display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center" })}>
                <Lockup word="pink" script="pink" width={m ? "62%" : "30%"} />
                <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", color: COLOR.pink, opacity: 0.7 }}>Logo & Color System · 2026</span>
            </div>
        </div>
    )
}

addPropertyControls(OfficeMealGuideline, {})
