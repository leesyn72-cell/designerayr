import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const IMG = "https://framerusercontent.com/images/"
const A = {
    wordmark: { red: IMG + "D3NaZsE2ifbXRjAjt0bBjryF53k.png", pink: IMG + "AF1OBblEz4VfIOErJAlgOWb0Y.png", black: IMG + "V74D00hRvOHYDxzLmAW7PhbaQDk.png" },
    script: { red: IMG + "nNEfqfe6u5ulTvxRHS4pROQy3WE.png", pink: IMG + "60lrqNA37x3PtFUPnRlgr8czlbg.png", black: IMG + "2YSCSNQsPgTBhEf1Ub4u0L1NUQ.png" },
    symLine: { red: IMG + "V86qc0EG4VuExCMqhTMR6nGHO4.png", pink: IMG + "dF6hib4GvgrBNoGiGIHq3RI5Sc.png", black: IMG + "GGeazH1SxB0LHEzAhKooct8EQ.png" },
    symSolid: { red: IMG + "PwDlNnzRqwqJOlc7wXbQBS4Ej0.png", pink: IMG + "PxhvnoYjQkumSFNII1IREq3Gww.png", black: IMG + "H9HB2EpJI4mEjhApTDfkjT44TE.png" },
}
// Product photography from the Tandanji Box shoot, plus the packaging mockup.
const PHOTO = {
    platter: "/assets/img/om-platter.jpg",
    spread: "/assets/img/om-spread.jpg",
    office: "/assets/img/om-office.jpg",
    platter3: "/assets/img/om-platter3.jpg",
    box: "/assets/img/om-box.jpg",
}

type Tone = "red" | "pink" | "black"
const COLOR: Record<Tone, string> = { red: "#F91515", pink: "#FFDFD7", black: "#0A0203" }
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

/** A logo layer: the PNG is used only as a mask and filled with the exact brand colour, so the red stays #F91515. */
function Ink({ src, color, label, style }: { src: string; color: string; label?: string; style?: React.CSSProperties }) {
    return (
        <div
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            style={{
                position: "absolute", inset: 0, background: color,
                WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
                WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
                ...style,
            }}
        />
    )
}

/** The lockup drawn left-to-right like handwriting: wordmark first, then the script. */
function Lockup({ word, script, width, draw = true, delay = 0 }: { word: Tone; script: Tone; width: number | string; draw?: boolean; delay?: number }) {
    const [ref, seen] = useInView<HTMLDivElement>(0.3)
    const on = !draw || seen
    const wipe = (d: number, dur: number): React.CSSProperties => ({
        clipPath: on ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        transition: `clip-path ${dur}s cubic-bezier(0.65, 0, 0.35, 1) ${delay + d}s`,
    })
    return (
        <div ref={ref} style={{ position: "relative", width, aspectRatio: `${LOGO_RATIO}` }}>
            <Ink src={A.wordmark[word]} color={COLOR[word]} label="tandanji" style={wipe(0, 1.4)} />
            <Ink src={A.script[script]} color={COLOR[script]} label="office meal" style={wipe(0.75, 1.3)} />
        </div>
    )
}

function Symbol({ tone, solid, size, style }: { tone: Tone; solid?: boolean; size: number | string; style?: React.CSSProperties }) {
    return (
        <div style={{ position: "relative", width: size, height: size, ...style }}>
            <Ink src={(solid ? A.symSolid : A.symLine)[tone]} color={COLOR[tone]} label="O symbol" />
        </div>
    )
}

/** A photo that slowly settles from a slight zoom as it scrolls into view. */
function Photo({ src, alt, shade = 0, position = "50% 50%", still = false }: { src: string; alt: string; shade?: number; position?: string; still?: boolean }) {
    const [ref, inView] = useInView<HTMLDivElement>(0.2)
    const seen = still || inView
    return (
        <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <img src={src} alt={alt} loading="lazy" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, display: "block", transform: seen ? "scale(1)" : "scale(1.08)", transition: "transform 2.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
            {shade > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})` }} />}
        </div>
    )
}

/** Small underlined slide title with a few lines of copy, pinned top-left like a presentation board. */
function SlideTitle({ title, lines, color, m }: { title: string; lines?: string[]; color: string; m: boolean }) {
    return (
        <div style={{ position: "absolute", top: m ? 22 : "5.5%", left: m ? 20 : "4%", maxWidth: m ? "78%" : 320, zIndex: 3, fontFamily: SANS, color }}>
            <div style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: 3, marginBottom: lines ? 10 : 0 }}>{title}</div>
            {lines && lines.map((l, i) => (
                <div key={i} style={{ fontSize: 11, lineHeight: 1.6, opacity: 0.7, wordBreak: "keep-all" }}>{l}</div>
            ))}
        </div>
    )
}

/** A 16:9 board (4:5 on phones) with lots of air; children sit dead centre. */
function Slide({ bg, color, title, lines, m, children }: { bg: string; color: string; title?: string; lines?: string[]; m: boolean; children?: React.ReactNode }) {
    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: m ? "4 / 5" : "16 / 9", background: bg, color, overflow: "hidden" }}>
            {title && <SlideTitle title={title} lines={lines} color={color} m={m} />}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
        </div>
    )
}

/** A colour chip as a circle; hovering lifts it and reveals the full spec. */
function ColorDot({ c, size, m, delay }: { c: { name: string; hex: string; pantone: string; rgb: string; cmyk: string }; size: string; m: boolean; delay: number }) {
    const [on, setOn] = React.useState(false)
    return (
        <Reveal delay={delay} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: m ? 10 : 18, width: size }}>
            <div onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} style={{ width: "100%", aspectRatio: "1", borderRadius: "50%", background: c.hex, transform: on ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
            <div style={{ fontFamily: SANS, fontSize: 11, lineHeight: 1.6, textAlign: "center", color: COLOR.black }}>
                <div>{c.name}</div>
                <div style={{ opacity: 0.6 }}>{c.hex}</div>
                <div style={{ opacity: on ? 0.6 : 0, transition: "opacity 0.4s ease", whiteSpace: "nowrap" }}>PANTONE {c.pantone} · RGB {c.rgb} · CMYK {c.cmyk}</div>
            </div>
        </Reveal>
    )
}

/**
 * Tandanji Office Meal brand guideline laid out as presentation boards, with photo interleaves and motion.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function OfficeMealGuideline(props: { style?: React.CSSProperties }) {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const [w, setW] = React.useState(1440)
    React.useEffect(() => {
        const el = rootRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(([e]) => { if (e.contentRect.width > 0) setW(e.contentRect.width) })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const m = w < 760
    const pad = m ? 20 : Math.round(w * 0.04)
    const small: React.CSSProperties = { fontFamily: SANS, fontSize: 11, lineHeight: 1.6 }

    const colors = [
        { name: "Office meal red", pantone: "2347 C", rgb: "249 21 21", cmyk: "0 94 100 0", hex: "#F91515" },
        { name: "Office meal pink beige", pantone: "698 C", rgb: "255 223 215", cmyk: "0 15 3 0", hex: "#FFDFD7" },
        { name: "Office meal black", pantone: "Black 6 C", rgb: "10 2 3", cmyk: "100 61 32 96", hex: "#0A0203" },
    ]

    const marqueeItem = (word: Tone, script: Tone, sym: Tone, h: number, key: number) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: h * 0.5, paddingRight: h * 0.5 }}>
            <div style={{ position: "relative", height: h, aspectRatio: `${LOGO_RATIO}` }}>
                <Ink src={A.wordmark[word]} color={COLOR[word]} />
                <Ink src={A.script[script]} color={COLOR[script]} />
            </div>
            <Symbol tone={sym} solid={key % 2 === 0} size={h * 0.42} />
        </div>
    )

    return (
        <div ref={rootRef} style={{ ...props.style, width: "100%", display: "flex", flexDirection: "column" }}>
            <style>{CSS}</style>

            {/* Opening: the meal under a dark veil, the lockup drawn on top */}
            <div style={{ position: "relative", width: "100%", aspectRatio: m ? "4 / 5" : "16 / 9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Photo src={PHOTO.platter} alt="A Tandanji office meal on a round plate" shade={0.45} position="50% 50%" />
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: m ? 16 : 22 }}>
                    <Lockup word="pink" script="pink" width={Math.round(w * (m ? 0.66 : 0.36))} delay={0.2} />
                </div>
            </div>

            {/* Project strip */}
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 24 : pad, padding: m ? "32px 20px" : `${Math.round(w * 0.035)}px 4%`, background: "#FFFFFF", color: COLOR.black, borderBottom: "1px solid rgba(10,2,3,0.08)" }}>
                <div style={{ fontFamily: SANS, color: COLOR.red }}>
                    <div style={{ fontSize: m ? 18 : 22, lineHeight: 1.3 }}>tandanji office meal 탄단지 오피스밀</div>
                    <div style={{ fontSize: m ? 18 : 22, lineHeight: 1.3 }}>BRAND IDENTITY</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.6fr 1fr", gap: m ? 18 : 32 }}>
                    <div style={{ ...small }}>
                        <div style={{ color: COLOR.red, marginBottom: 6, letterSpacing: "0.04em" }}>CONCEPT</div>
                        <div style={{ opacity: 0.75, wordBreak: "keep-all" }}>office meal을 스크립트 서체로 적용해, 상단 tandanji 로고의 부드럽고 유기적인 무드와 자연스럽게 연결한 로고입니다. 곡선감이 강한 영문 서체는 기존 로고의 개성과 친근한 인상을 강조하고, 음식 브랜드가 가진 따뜻함과 감성적인 분위기를 더합니다.</div>
                    </div>
                    <div style={{ ...small }}>
                        <div style={{ color: COLOR.red, marginBottom: 6, letterSpacing: "0.04em" }}>SCOPE</div>
                        <div style={{ opacity: 0.75 }}>Logo · Symbol<br />Color System</div>
                    </div>
                </div>
            </div>

            {/* Photo: the meal spread under a dark veil, an oversized translucent lockup on the bottom edge */}
            <div style={{ position: "relative", width: "100%", aspectRatio: m ? "4 / 5" : "16 / 9", overflow: "hidden" }}>
                <Photo src={PHOTO.spread} alt="Tandanji office meal boxes laid out on a table" shade={0.42} position="50% 42%" still />
                <div style={{ position: "absolute", left: "4%", right: "4%", bottom: m ? "4%" : "-2%", opacity: 0.55 }}>
                    <Lockup word="pink" script="pink" width="100%" draw={false} />
                </div>
            </div>

            {/* Primary logo */}
            <Slide bg="#FFFFFF" color={COLOR.black} m={m} title="Primary Logo" lines={["tandanji 워드마크, office meal 스크립트,", "O 심볼로 구성됩니다."]}>
                <div style={{ display: "flex", flexDirection: m ? "column" : "row", alignItems: "center", gap: m ? 36 : Math.round(w * 0.06), marginTop: m ? 40 : 0 }}>
                    <Lockup word="red" script="black" width={Math.round(w * (m ? 0.72 : 0.4))} />
                    <Reveal delay={1.2}>
                        <Symbol tone="red" solid size={m ? 84 : Math.round(w * 0.075)} />
                    </Reveal>
                </div>
            </Slide>

            {/* Structure: the two parts gently separate and come back together */}
            <Slide bg={COLOR.pink} color={COLOR.black} m={m} title="Logo Structure" lines={["굵고 둥근 tandanji 워드마크 아래로", "office meal 스크립트가 겹쳐 흐르며", "하나의 손글씨처럼 이어집니다."]}>
                <div style={{ position: "relative", width: m ? "78%" : "44%", aspectRatio: `${LOGO_RATIO}`, marginTop: m ? 40 : 0, ["--om-gap" as any]: m ? "20px" : `${Math.round(w * 0.028)}px` }}>
                    <Ink src={A.wordmark.red} color={COLOR.red} label="tandanji" />
                    <Ink src={A.script.black} color={COLOR.black} label="office meal" style={{ animation: "om-split 6s cubic-bezier(0.65, 0, 0.35, 1) infinite" }} />
                    <span style={{ position: "absolute", left: 0, top: m ? -30 : -40, ...small, fontSize: 12, color: COLOR.red, animation: "om-label 6s ease infinite" }}>tandanji — Wordmark</span>
                    <span style={{ position: "absolute", right: 0, bottom: m ? -46 : -64, ...small, fontSize: 12, color: COLOR.black, animation: "om-label 6s ease infinite" }}>office meal — Script</span>
                </div>
            </Slide>

            {/* Symbol */}
            <Slide bg={COLOR.black} color={COLOR.pink} m={m} title="Symbol" lines={["O 심볼은 라인형과 면형", "두 가지로 구성됩니다."]}>
                <div style={{ display: "flex", alignItems: "center", gap: m ? 28 : Math.round(w * 0.08), marginTop: m ? 40 : 0 }}>
                    <Reveal><Symbol tone="pink" size={m ? 110 : Math.round(w * 0.14)} style={{ animation: "om-float 4s ease-in-out infinite" }} /></Reveal>
                    <Reveal delay={0.2}><Symbol tone="pink" solid size={m ? 110 : Math.round(w * 0.14)} style={{ animation: "om-float 4s ease-in-out 0.6s infinite" }} /></Reveal>
                </div>
            </Slide>

            {/* Photo split: the meal at the desk, and on the plate */}
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr" }}>
                {[
                    { src: PHOTO.office, alt: "An office meal at a desk beside a laptop", tag: "Office", pos: "50% 62%" },
                    { src: PHOTO.platter3, alt: "An office meal on a round plate", tag: "Meal", pos: "50% 50%" },
                ].map((p) => (
                    <div key={p.tag} style={{ position: "relative", aspectRatio: m ? "4 / 5" : "8 / 9", overflow: "hidden" }}>
                        <Photo src={p.src} alt={p.alt} shade={0.12} position={p.pos} />
                        <div style={{ position: "absolute", left: m ? 20 : "8%", bottom: m ? 20 : "7%", ...small, color: "#FFFFFF" }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: 3 }}>{p.tag}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Colour system */}
            <Slide bg="#FFFFFF" color={COLOR.black} m={m} title="Color System" lines={["Red, Pink Beige, Black —", "탄단지박스와의 연결성을 유지하면서도", "신뢰감 있는 브랜드 이미지를 만듭니다."]}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: m ? 10 : Math.round(w * 0.04), marginTop: m ? 40 : 0 }}>
                    {colors.map((c, i) => <ColorDot key={c.hex} c={c} size={`${Math.round(w * (m ? 0.22 : 0.13))}px`} m={m} delay={i * 0.15} />)}
                </div>
            </Slide>

            {/* Logo on colour */}
            <Slide bg={COLOR.pink} color={COLOR.black} m={m} title="Logo on Color" lines={["배경색에 따라 지정된 로고 조합을 사용합니다."]}>
                <div style={{ display: "flex", gap: m ? 6 : Math.round(w * 0.012), marginTop: m ? 40 : 0 }}>
                    {([["red", "pink", "pink"], ["pink", "red", "black"], ["black", "pink", "pink"]] as [Tone, Tone, Tone][]).map(([bg, word, script], i) => (
                        <Reveal key={bg} delay={i * 0.12}>
                            <div style={{ background: COLOR[bg], width: Math.round(w * (m ? 0.27 : 0.16)), aspectRatio: "3 / 4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: m ? 12 : 22, boxShadow: bg === "pink" ? "inset 0 0 0 1px rgba(10,2,3,0.08)" : "none" }}>
                                <Lockup word={word} script={script} width="72%" delay={0.3 + i * 0.15} />
                                <Symbol tone={word} solid={i !== 1} size={m ? 20 : Math.round(w * 0.026)} />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Slide>

            {/* Photo split: the packaging beside the brand line */}
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr" }}>
                <div style={{ position: "relative", aspectRatio: m ? "4 / 5" : "8 / 9", overflow: "hidden" }}>
                    <Photo src={PHOTO.box} alt="Office meal packaging mockup" position="50% 50%" />
                </div>
                <div style={{ position: "relative", aspectRatio: m ? "4 / 3" : "8 / 9", background: COLOR.red, color: COLOR.pink, display: "flex", flexDirection: "column", justifyContent: "center", padding: m ? "0 24px" : "0 12%" }}>
                    <Reveal>
                        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: m ? 24 : Math.min(44, Math.round(w * 0.03)), lineHeight: 1.35, letterSpacing: "-0.02em", wordBreak: "keep-all" }}>A soft, handwritten script that carries tandanji’s warmth into every office meal.</div>
                        <div style={{ ...small, fontSize: m ? 11 : 12, marginTop: m ? 18 : 28, letterSpacing: "0.04em", opacity: 0.85, textTransform: "uppercase" }}>Tandanji Office Meal</div>
                    </Reveal>
                </div>
            </div>

            {/* Motion band */}
            <div style={{ background: COLOR.red, overflow: "hidden", padding: `${m ? 16 : 26}px 0` }}>
                <div style={{ display: "flex", width: "max-content", animation: "om-marquee 28s linear infinite" }}>
                    {Array.from({ length: 8 }, (_, i) => marqueeItem("pink", "pink", "pink", m ? 34 : 56, i))}
                </div>
            </div>
            <div style={{ background: COLOR.pink, overflow: "hidden", padding: `${m ? 16 : 26}px 0` }}>
                <div style={{ display: "flex", width: "max-content", animation: "om-marquee-rev 32s linear infinite" }}>
                    {Array.from({ length: 8 }, (_, i) => marqueeItem("red", "black", "red", m ? 34 : 56, i))}
                </div>
            </div>

            {/* Closing: the black cover, as a last word */}
            <Slide bg={COLOR.black} color={COLOR.pink} m={m}>
                <Lockup word="pink" script="pink" width={m ? "64%" : "34%"} delay={0.2} />
                <div style={{ position: "absolute", left: m ? 20 : "4%", bottom: m ? 20 : "5.5%", ...small, color: COLOR.pink, letterSpacing: "0.04em", textTransform: "uppercase" }}>Logo & Color System · 2026</div>
                <Symbol tone="pink" size={m ? 24 : 34} style={{ position: "absolute", right: m ? 20 : "4%", bottom: m ? 20 : "5.5%", animation: "om-spin 14s linear infinite" }} />
            </Slide>
        </div>
    )
}

addPropertyControls(OfficeMealGuideline, {})
