import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const IMG = "https://framerusercontent.com/images/"
// Logo layers share one 3168 × 608 canvas so they stack exactly; each is an alpha mask coloured in CSS.
const L = {
    fru: IMG + "BuUG0cWdAikLcHiMigcmqjrrFMs.png",
    now: IMG + "WIQ4yIc36XZk0ck1tEyQdbCpelE.png",
    stem: IMG + "Sqw30h6tUH2p5fxTPhPLfoCoo.png",
    body: IMG + "KW5T4cvf9jlhl5FjdxV0pAyWs.png",
    dot: IMG + "RpWguutSyL43MeRYN4jQHLyXOvs.png",
    kr: IMG + "x8XOhcidgrX4jgKY4Xta48z1mds.png",
}
const EL = {
    orange: IMG + "MqzhRb8ibHjCOidBkeFe7Q0eRo.png",
    blueberry: IMG + "m3BOx0FpeOerXdKrtaQqyOxH0w.png",
    strawberry: IMG + "25A8t7eNfh22XcOdiGKaQ1LV2Q.png",
    loading: IMG + "CPjjVfGNkZk3YLbhXVIeahCtqw.png",
}
const BLUEBERRY = ["yQbo4pPJVUQK9SZ2NpEbn8uwAzU.jpg", "6fYdVNrSIde6Awbc2Ar9crJl8Yw.jpg", "ISGrrSey8lxEYenh6N708XLH3c.jpg", "UWzKiKqIGtkBuBQXK9GTyAs3w.gif", "T98oc7cFtJiX5B09RrBaxC6g.jpg", "fCGEaiwO4rug0bdW0JMTqnnDTSU.jpg", "iD59cIc4Jq2yv1yOrGLip5NFvgg.jpg", "T8v0qqkvovobf8JFrbzpmEU2npM.jpg", "ohv1qyNAOZTASlsJ03vCb7y1I.jpg", "R5QicHf7rXvukkxBDdx0e5Ca0I.jpg", "P7Xc15tRYuEmCxi9BcnCrAzKU.jpg", "rcGr8BZwCY8D6TYl9llyYaxGa0.jpg", "OdnLBfXSbAdJ99kcBZY4yfVz3Ww.jpg", "4caCsjJB6O8g2nKMdqkJTQ03fhI.jpg", "YSLQA7YjgO1DfHhC3tT2m1wQ.jpg"].map((f) => IMG + f)
// Pixel heights of each blueberry piece at 1000px wide (same order as BLUEBERRY)
const BLUEBERRY_H = [3551, 1530, 465, 1150, 1963, 2801, 692, 1754, 1720, 1580, 2469, 2276, 3559, 1518, 3566]

const C = { orange: "#FC6515", ivory: "#FFF6E5", brown: "#2C1107", white: "#FFFFFF" }
// Latin: Roc Grotesk Variable (Adobe Fonts kit name first, then the desktop name). Hangul falls through to Greta Sans.
const SANS = '"roc-grotesk-variable", "Roc Grotesk Variable", "roc-grotesk", "Roc Grotesk", "SD 그레타산스", "SD Greta Sans", "Pretendard", "Inter", "Apple SD Gothic Neo", system-ui, sans-serif'
// Type specimens are rendered from the real fonts, so they read correctly without a web licence.
const PHOTO = {
    berries: IMG + "1TlobLZOq9TsjPV8l15adrFSQ.jpg",
    farm: IMG + "LoyLWd1GMmV0vT8Rx341tA3C7Co.jpg",
    harvest: IMG + "4S0fsUE778vIyGPoyEqzR3WLe4I.jpg",
    spoon: IMG + "KwfC9pb1I9c8iQHQAVy0k9r84.jpg",
    tangerine2: IMG + "hfKZ5rfl8vH8fuAJJ9amwsXkk.jpg",
    // Unsplash licence (photo ib1dKZmYTiE)
    pear: IMG + "YZanDc8Kpdjip903uemRlVKiC8.jpg",
    tangerine: IMG + "lSu5wxCspugvt61MZiw5owz4b3w.jpg",
}
const TYPE = {
    rocAa: IMG + "OGMuvlE5RabaQGIy0kfdCfYzDZI.png",
    krGa: IMG + "CdDc1grsrqR5zYXPMpiOohTFf48.png",
    rocLadder: IMG + "UP2CHBzsF93lZxBwO531O41uiHo.png",
    krLadder: IMG + "wFtITa1KkucO9x94AOjUFnkKUaU.png",
    rocGlyphs: IMG + "9ThnA0k5uxMkSc2HG4RyV5dHwg0.png",
    krGlyphs: IMG + "MHstwmmhwdSTGFILqrQOSB9mc.png",
}
const CW = 3168
const CH = 608
const KR_RATIO = 3370 / 860

const CSS = `
@keyframes pn-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes pn-marquee-rev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
@keyframes pn-spin { to { transform: rotate(360deg) } }
@keyframes pn-float { 0%, 100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-7%) rotate(-3deg) } }
@keyframes pn-hop { 0%, 60%, 100% { transform: translateY(0) } 30% { transform: translateY(-38%) } }
@keyframes pn-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-5%) } }
@keyframes pn-tick { to { transform: rotate(360deg) } }
@keyframes pn-scroll { 0%, 8% { transform: translateY(0) } 92%, 100% { transform: translateY(-62%) } }
@keyframes pn-weights { from { -webkit-mask-position: 0 0%; mask-position: 0 0% } to { -webkit-mask-position: 0 100%; mask-position: 0 100% } }
`

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

/** One logo layer: the alpha mask filled with a colour. */
function Mask({ src, color, style }: { src: string; color: string; style?: React.CSSProperties }) {
    return (
        <div
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

type Ink = { ink: string; fruit: string; stem: string }
const ON_LIGHT: Ink = { ink: C.brown, fruit: C.orange, stem: C.brown }
// On orange the original artwork is white letters and dot, a black fruit and a white stem.
const ON_ORANGE: Ink = { ink: C.white, fruit: "#000000", stem: C.white }
const ON_BROWN: Ink = { ink: C.ivory, fruit: C.orange, stem: C.ivory }

/**
 * The fru:now logotype. With `intro`, the words slide in from either side
 * and the fruit drops onto the colon when it scrolls into view.
 */
function Logo({ tone, width, intro = false, delay = 0, bob = false }: { tone: Ink; width: number | string; intro?: boolean; delay?: number; bob?: boolean }) {
    const [ref, seen] = useInView<HTMLDivElement>(0.3)
    const on = !intro || seen
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)"
    const slide = (x: number, d: number): React.CSSProperties => ({
        transform: on ? "none" : `translateX(${x}%)`, opacity: on ? 1 : 0,
        transition: `transform 1.3s ${ease} ${delay + d}s, opacity 0.8s ease ${delay + d}s`,
    })
    const drop: React.CSSProperties = {
        transform: on ? "none" : "translateY(-120%)", opacity: on ? 1 : 0,
        transition: `transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 0.75}s, opacity 0.3s ease ${delay + 0.75}s`,
    }
    const pop: React.CSSProperties = {
        transform: on ? "scale(1)" : "scale(0)", transformOrigin: "44.6% 81%",
        transition: `transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 0.55}s`,
    }
    return (
        <div ref={ref} style={{ position: "relative", width, aspectRatio: `${CW} / ${CH}` }}>
            <Mask src={L.fru} color={tone.ink} style={slide(-6, 0)} />
            <Mask src={L.now} color={tone.ink} style={slide(6, 0.1)} />
            <Mask src={L.dot} color={tone.ink} style={pop} />
            <div style={{ position: "absolute", inset: 0, ...drop }}>
                <div style={{ position: "absolute", inset: 0, animation: bob ? "pn-bob 2.8s ease-in-out 2.4s infinite" : undefined }}>
                    <Mask src={L.body} color={tone.fruit} />
                    <Mask src={L.stem} color={tone.stem} />
                </div>
            </div>
        </div>
    )
}

/** Moves between the horizontal and stacked signatures every few seconds. */
function Signature({ width, m }: { width: number; m: boolean }) {
    const [stacked, setStacked] = React.useState(false)
    React.useEffect(() => {
        const id = setInterval(() => setStacked((s) => !s), 3200)
        return () => clearInterval(id)
    }, [])
    // Box is 3168 × 1200 canvas units; the horizontal logo sits mid-height.
    // Stacked targets are measured from the original vertical logo (BIBX p.6): there the fruit
    // and dot are 2.73× larger relative to the letters, with a 190-unit gap to the words.
    const BH = 1200
    const hy = (BH - CH) / 2
    // [anchor x, anchor y] on the horizontal canvas, [move x, move y] when stacked, scale when stacked
    const part = (ax: number, ay: number, dx: number, dy: number, k: number): React.CSSProperties => ({
        position: "absolute", left: 0, top: `${(hy / BH) * 100}%`, width: "100%", height: `${(CH / BH) * 100}%`,
        transformOrigin: `${(ax / CW) * 100}% ${(ay / CH) * 100}%`,
        transform: stacked ? `translate(${(dx / CW) * 100}%, ${(dy / CH) * 100}%) scale(${k})` : "translate(0, 0) scale(1)",
        transition: "transform 1.1s cubic-bezier(0.65, 0, 0.35, 1)",
    })
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: m ? 18 : 28 }}>
            <div style={{ position: "relative", width, aspectRatio: `${CW} / ${BH}` }}>
                <div style={part(12, 580, 1157, -325, 1)}><Mask src={L.fru} color={C.brown} /></div>
                <div style={part(1320, 180, -800, -371, 2.73)}>
                    <Mask src={L.body} color={C.orange} />
                    <Mask src={L.stem} color={C.brown} />
                </div>
                <div style={part(1320, 412, -800, 14, 2.73)}><Mask src={L.dot} color={C.brown} /></div>
                <div style={part(1672, 580, -503, 279, 1)}><Mask src={L.now} color={C.brown} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, fontFamily: SANS, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                <span style={{ color: C.brown, opacity: stacked ? 0.35 : 1, transition: "opacity 0.6s" }}>Horizontal</span>
                <span style={{ color: C.brown, opacity: 0.35 }}>/</span>
                <span style={{ color: C.brown, opacity: stacked ? 1 : 0.35, transition: "opacity 0.6s" }}>Vertical</span>
            </div>
        </div>
    )
}

function Fruit({ color, size, animation, stem = C.brown }: { color: string; size: number; animation: string; stem?: string }) {
    return (
        <div style={{ position: "relative", width: size, height: size, animation }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
            <div style={{ position: "absolute", left: "50%", top: "-14%", width: "16%", height: "46%", background: stem, transform: "translateX(-10%) rotate(24deg)", transformOrigin: "50% 100%" }} />
        </div>
    )
}

function Clock({ size }: { size: number }) {
    // Each hand reaches 4% past the centre and pivots there, so the two always meet at the hub.
    const hand = (h: number, dur: number): React.CSSProperties => ({
        position: "absolute", left: "46%", top: `${54 - h}%`, width: "8%", height: `${h}%`,
        background: C.brown, transformOrigin: `50% ${((h - 4) / h) * 100}%`, animation: `pn-tick ${dur}s linear infinite`,
    })
    return (
        <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: C.orange }}>
            <div style={hand(34, 12)} />
            <div style={hand(44, 2.4)} />
            <div style={{ position: "absolute", left: "44%", top: "44%", width: "12%", height: "12%", borderRadius: "50%", background: C.brown }} />
        </div>
    )
}

/** Small underlined slide title with a few lines of copy, pinned top-left like a presentation board. */
function SlideTitle({ title, lines, color, m }: { title: string; lines?: string[]; color: string; m: boolean }) {
    return (
        <div style={{ position: "absolute", top: m ? 22 : "5.5%", left: m ? 20 : "4%", maxWidth: m ? "78%" : 300, zIndex: 3, fontFamily: SANS, color }}>
            <div style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: 3, marginBottom: lines ? 10 : 0 }}>{title}</div>
            {lines && lines.map((l, i) => (
                <div key={i} style={{ fontSize: 11, lineHeight: 1.6, opacity: 0.7, wordBreak: "keep-all" }}>{l}</div>
            ))}
        </div>
    )
}

/** A 16:9 board (4:5 on phones) with lots of air; children sit dead centre. */
function Slide({ bg, color, title, lines, m, ratio, children }: { bg: string; color: string; title?: string; lines?: string[]; m: boolean; ratio?: string; children?: React.ReactNode }) {
    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: ratio || (m ? "4 / 5" : "16 / 9"), background: bg, color, overflow: "hidden" }}>
            {title && <SlideTitle title={title} lines={lines} color={color} m={m} />}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
        </div>
    )
}

/** Construction lines drawn over the logo when it scrolls into view — the "sketched guide" layer. */
function Construction({ width, m }: { width: string; m: boolean }) {
    const [ref, seen] = useInView<HTMLDivElement>(0.35)
    const line = (d: number): React.CSSProperties => ({ strokeDasharray: 1, strokeDashoffset: seen ? 0 : 1, transition: `stroke-dashoffset 1.6s cubic-bezier(0.65, 0, 0.35, 1) ${d}s` })
    const ink = "rgba(255,255,255,0.6)"
    const tag = (x: number, y: number, t: string, d: number, anchor: "start" | "end" = "start") => (
        <text x={x} y={y} textAnchor={anchor} fill={C.white} style={{ fontFamily: SANS, fontSize: m ? 64 : 48, opacity: seen ? 1 : 0, transition: `opacity 0.6s ease ${d}s` }}>{t}</text>
    )
    // Canvas units of the logo artwork: x-height top 184, baseline 580, ascender 16, colon centre x 1414
    return (
        <div ref={ref} style={{ position: "relative", width }}>
            <Logo tone={{ ink: "rgba(255,255,255,0.32)", fruit: "#000000", stem: C.white }} width="100%" />
            <svg viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} fill="none" stroke={ink} strokeWidth={1} vectorEffect="non-scaling-stroke">
                <path pathLength={1} d="M -260 16 H 3428" style={line(0)} vectorEffect="non-scaling-stroke" />
                <path pathLength={1} d="M -260 184 H 3428" style={line(0.15)} vectorEffect="non-scaling-stroke" />
                <path pathLength={1} d="M -260 580 H 3428" style={line(0.3)} vectorEffect="non-scaling-stroke" />
                <path pathLength={1} d="M 1414 -220 V 830" style={line(0.5)} vectorEffect="non-scaling-stroke" />
                <circle pathLength={1} cx={1414} cy={264} r={150} style={line(0.8)} vectorEffect="non-scaling-stroke" />
                <circle pathLength={1} cx={1414} cy={496} r={150} style={line(0.95)} vectorEffect="non-scaling-stroke" />
                <path pathLength={1} d="M 1564 264 C 1900 120, 2300 -90, 2700 -150" style={line(1.2)} vectorEffect="non-scaling-stroke" stroke={C.white} />
                <path pathLength={1} d="M 1564 496 C 1900 700, 2300 860, 2700 900" style={line(1.35)} vectorEffect="non-scaling-stroke" stroke={C.white} />
                {tag(2730, -140, "과일 · Fruit", 2.2)}
                {tag(2730, 915, "사람 · Person", 2.35)}
                {tag(-280, 0, "Ascender", 1.8, "end")}
                {tag(-280, 198, "x-height", 1.9, "end")}
                {tag(-280, 594, "Baseline", 2.0, "end")}
            </svg>
        </div>
    )
}

/** A colour chip as a circle; hovering lifts it and reveals the full spec. */
function ColorDot({ c, size, m, delay }: { c: { name: string; hex: string; pantone: string; rgb: string; cmyk: string; bg: string }; size: string; m: boolean; delay: number }) {
    const [on, setOn] = React.useState(false)
    return (
        <Reveal delay={delay} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: m ? 10 : 18, width: size }}>
            <div onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} style={{ width: "100%", aspectRatio: "1", borderRadius: "50%", background: c.bg, boxShadow: c.bg === C.ivory ? "inset 0 0 0 1px rgba(44,17,7,0.14)" : "none", transform: on ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
            <div style={{ fontFamily: SANS, fontSize: 11, lineHeight: 1.6, textAlign: "center", color: C.brown }}>
                <div>{c.name}</div>
                <div style={{ opacity: 0.6 }}>{c.hex}</div>
                <div style={{ opacity: on ? 0.6 : 0, transition: "opacity 0.4s ease", whiteSpace: "nowrap" }}>PANTONE {c.pantone} · RGB {c.rgb} · CMYK {c.cmyk}</div>
            </div>
        </Reveal>
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

/** A crop of the long page from `start` (page px at 1000 wide), as tall as its column lets it be. */
function PageCrop({ images, heights, start }: { images: string[]; heights: number[]; start: number }) {
    let y = 0
    const parts: { src: string; top: number; h: number }[] = []
    heights.forEach((h, i) => {
        if (y + h > start && y < start + 6000) parts.push({ src: images[i], top: y, h })
        y += h
    })
    const lead = start - parts[0].top
    // Each image reserves its exact height up front, so the crop never shifts while pictures are still loading.
    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden", background: C.white, borderRadius: 10, boxShadow: "0 18px 50px rgba(44,17,7,0.10)" }}>
            <div style={{ marginTop: `${-(lead / 1000) * 100}%` }}>
                {parts.map((p) => (
                    <img key={p.src} src={p.src} alt="" draggable={false} style={{ display: "block", width: "100%", height: "auto", aspectRatio: `1000 / ${p.h}`, objectFit: "cover" }} />
                ))}
            </div>
        </div>
    )
}

/** Cycles through the 8 stacked weight frames of a specimen sprite. */
function WeightSprite({ src, color }: { src: string; color: string }) {
    return (
        <div
            style={{
                width: "100%", aspectRatio: "900 / 600", background: color,
                WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
                WebkitMaskSize: "100% 800%", maskSize: "100% 800%",
                WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
                animation: "pn-weights 5.6s steps(8, jump-none) infinite alternate",
            }}
        />
    )
}

function Specimen({ src, ratio, color }: { src: string; ratio: string; color: string }) {
    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: ratio }}>
            <Mask src={src} color={color} />
        </div>
    )
}

/**
 * fru:now (프루나우) brand identity guideline laid out as presentation boards, with motion.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function PrunauGuideline(props: { style?: React.CSSProperties; adobeKit?: string }) {
    const rootRef = React.useRef<HTMLDivElement>(null)
    // Loads Roc Grotesk from the owner's Adobe Fonts web project when a kit ID is set.
    const kit = (props.adobeKit || "").trim().replace(/[^a-z0-9]/gi, "")
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
    // Logotype callouts drawn like the BI guide: a line out of the colon that turns toward its label.
    const callout = (top: boolean, color: string, text: string): React.ReactNode => {
        const lh = m ? 34 : Math.round(w * 0.04)
        const lw = m ? 18 : Math.round(w * 0.024)
        return (
            <div style={{ position: "absolute", left: "44.6%", ...(top ? { bottom: "88%" } : { top: "104%" }), width: lw, height: lh, borderLeft: `1px solid ${color}`, ...(top ? { borderTop: `1px solid ${color}` } : { borderBottom: `1px solid ${color}` }) }}>
                <span style={{ position: "absolute", left: lw + 8, ...(top ? { top: 0 } : { bottom: 0 }), transform: `translateY(${top ? "-50%" : "50%"})`, whiteSpace: "nowrap", ...small, fontSize: m ? 11 : 12, color }}>{text}</span>
            </div>
        )
    }

    const colors = [
        { name: "fru:now orange", pantone: "1585 C", rgb: "252 101 21", cmyk: "0 73 87 0", hex: "#FC6515", bg: C.orange },
        { name: "fru:now ivory", pantone: "9180 C", rgb: "255 246 229", cmyk: "0 5 12 0", hex: "#FFF6E5", bg: C.ivory },
        { name: "fru:now brown", pantone: "4975 C", rgb: "44 17 7", cmyk: "72 86 92 67", hex: "#2C1107", bg: C.brown },
    ]
    const fruitSize = m ? 28 : Math.round(w * 0.036)

    return (
        <div ref={rootRef} style={{ ...props.style, width: "100%", display: "flex", flexDirection: "column" }}>
            <style>{CSS}</style>
            {kit && <link rel="stylesheet" href={`https://use.typekit.net/${kit}.css`} />}

            {/* Opening: a box of tangerines under a dark veil, logo on top */}
            <div style={{ position: "relative", width: "100%", aspectRatio: m ? "4 / 5" : "16 / 9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Photo src={PHOTO.tangerine} alt="A box of tangerines" shade={0.42} position="60% 50%" />
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: m ? 16 : 22 }}>
                    <Logo tone={{ ink: C.white, fruit: C.orange, stem: C.white }} width={Math.round(w * (m ? 0.6 : 0.3))} intro bob />
                </div>
            </div>

            {/* Project strip: what this is, in the brand's own words */}
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 24 : pad, padding: m ? "32px 20px" : `${Math.round(w * 0.035)}px 4%`, background: C.white, color: C.brown, borderBottom: "1px solid rgba(44,17,7,0.08)" }}>
                <div style={{ fontFamily: SANS, color: C.orange }}>
                    <div style={{ fontSize: m ? 18 : 22, lineHeight: 1.3 }}>fru:now 프루나우</div>
                    <div style={{ fontSize: m ? 18 : 22, lineHeight: 1.3 }}>BRAND IDENTITY</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.6fr 1fr", gap: m ? 18 : 32 }}>
                    <div style={{ ...small }}>
                        <div style={{ color: C.orange, marginBottom: 6, letterSpacing: "0.04em" }}>BRAND STORY</div>
                        <div style={{ opacity: 0.75, wordBreak: "keep-all" }}>과일의 좋은 순간을, 일상의 식탁으로. 프루나우는 과일의 현재 상태와 맛을 살피고 지금 권할 만한 과일을 솔직하게 제안하는, 친근한 과일 전문가를 지향합니다.</div>
                    </div>
                    <div style={{ ...small }}>
                        <div style={{ color: C.orange, marginBottom: 6, letterSpacing: "0.04em" }}>SCOPE</div>
                        <div style={{ opacity: 0.75 }}>Logo · Color · Typeface<br />Graphic · Detail Page</div>
                    </div>
                </div>
            </div>


            {/* Photo: a field of blueberries under a dark veil, with an oversized translucent logo sitting on the bottom edge */}
            <div style={{ position: "relative", width: "100%", aspectRatio: m ? "4 / 5" : "16 / 9", overflow: "hidden" }}>
                <Photo src={PHOTO.berries} alt="Blueberries" shade={0.42} still />
                {/* the artwork leaves 28/608 below the baseline; shift it down so the letters touch the edge */}
                <div style={{ position: "absolute", left: "4%", right: "4%", bottom: 0, opacity: 0.55, transform: "translateY(4.6%)" }}>
                    <Logo tone={{ ink: C.white, fruit: C.orange, stem: C.white }} width="100%" />
                </div>
            </div>

            {/* Logotype */}
            <Slide bg={C.white} color={C.brown} m={m} title="Logotype" lines={["FRU(과일)와 NOW(지금)를 잇는 이름.", "가운데 콜론은 과일과 사람, 산지와 식탁의 연결입니다."]}>
                <div style={{ position: "relative", width: m ? "78%" : "46%" }}>
                    <Logo tone={ON_LIGHT} width="100%" intro bob />
                    <Reveal delay={1.4} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{callout(true, C.orange, "과일 — 지금 가장 맛있는 순간")}</Reveal>
                    <Reveal delay={1.6} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{callout(false, C.brown, "사람 — 그 과일을 고르는 사람")}</Reveal>
                </div>
            </Slide>

            {/* Construction: sketched guide lines over a faint logo */}
            <Slide bg={C.orange} color={C.white} m={m} title="Construction" lines={["Ascender, x-height, baseline 위에 놓인 글자와", "콜론의 두 원이 하나의 축으로 정렬됩니다."]}>
                <Construction width={m ? "64%" : "44%"} m={m} />
            </Slide>

            {/* Signature */}
            <Slide bg={C.ivory} color={C.brown} m={m} title="Signature" lines={["로고타입과 한글 타이틀의 조합.", "매체에 따라 가로형과 세로형을 골라 씁니다."]}>
                <div style={{ display: "flex", flexDirection: m ? "column" : "row", alignItems: "center", gap: m ? 40 : Math.round(w * 0.07) }}>
                    <Signature width={m ? Math.round(w * 0.62) : Math.round(w * 0.3)} m={m} />
                    <Reveal>
                        <div style={{ position: "relative", width: m ? Math.round(w * 0.36) : Math.round(w * 0.14), aspectRatio: `${KR_RATIO}` }}><Mask src={L.kr} color={C.brown} /></div>
                    </Reveal>
                </div>
            </Slide>

            {/* Photo split: where the fruit grows, and the moment it is picked */}
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr" }}>
                {[
                    { src: PHOTO.farm, alt: "Blueberry farm", tag: "Grow", line: "산지에서 제철과 숙도를 살피고", pos: "50% 60%" },
                    { src: PHOTO.harvest, alt: "Hands holding freshly picked tangerines", tag: "Harvest", line: "지금 가장 맛있는 순간에 고릅니다", pos: "50% 45%" },
                ].map((p) => (
                    <div key={p.tag} style={{ position: "relative", aspectRatio: m ? "4 / 5" : "8 / 9", overflow: "hidden" }}>
                        <Photo src={p.src} alt={p.alt} shade={0.18} position={p.pos} />
                        <div style={{ position: "absolute", left: m ? 20 : "8%", bottom: m ? 20 : "7%", ...small, color: C.white }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: 3, marginBottom: 6 }}>{p.tag}</div>
                            <div style={{ opacity: 0.9 }}>{p.line}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Colour system */}
            <Slide bg={C.white} color={C.brown} m={m} title="Color System" lines={["Orange, Ivory, Brown —", "과일의 생동감과 식탁의 따뜻함을 담은 세 가지 컬러."]}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: m ? 10 : Math.round(w * 0.04), marginTop: m ? 40 : 0 }}>
                    {colors.map((c, i) => <ColorDot key={c.hex} c={c} size={`${Math.round(w * (m ? 0.22 : 0.13))}px`} m={m} delay={i * 0.15} />)}
                </div>
            </Slide>

            {/* Typeface: one board, two aligned columns — weights cycle above each weight ladder */}
            <Slide bg={C.orange} color={C.white} m={m} title="Typeface" lines={["국문 Sandoll 클레어산스, 영문 Roc Grotesk.", "진한 굵기는 권장 범위, 흐린 굵기는 지양합니다."]}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: Math.round(w * (m ? 0.06 : 0.07)), marginTop: m ? 48 : 0 }}>
                    {[
                        { name: "Roc Grotesk", tag: "English", sprite: TYPE.rocAa, ladder: TYPE.rocLadder },
                        { name: "Sandoll 클레어산스", tag: "Korean", sprite: TYPE.krGa, ladder: TYPE.krLadder },
                    ].map((t, i) => {
                        const cw = Math.round(w * (m ? 0.4 : 0.24))
                        const sw = Math.round(cw * 0.62)
                        return (
                            <Reveal key={t.name} delay={i * 0.15} style={{ width: cw, display: "flex", flexDirection: "column", gap: m ? 14 : 22 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.35)", ...small }}>
                                    <span style={{ fontSize: m ? 11 : 13 }}>{t.name}</span>
                                    <span style={{ opacity: 0.55, letterSpacing: "0.04em", textTransform: "uppercase" }}>{t.tag}</span>
                                </div>
                                {/* the sprite artwork starts 40/900 in; pull it back so its glyphs share the ladder's left edge */}
                                <div style={{ width: sw, marginLeft: -Math.round(sw * (40 / 900)) }}><WeightSprite src={t.sprite} color={C.white} /></div>
                                <Specimen src={t.ladder} ratio="1500 / 880" color={C.white} />
                            </Reveal>
                        )
                    })}
                </div>
            </Slide>


            {/* Graphic motif: equal cells; stems are offset so each body sits on the same centre line */}
            <Slide bg={C.brown} color={C.white} m={m} title="Graphic Motif" lines={["콜론의 과일이 과일, 시계, 회전하는 모티브로", "확장되어 브랜드의 생동감을 전합니다."]}>
                <Photo src={PHOTO.pear} alt="Pears" shade={0.68} />
                <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(3, ${Math.round(w * (m ? 0.3 : 0.21))}px)`, marginTop: m ? 40 : 0 }}>
                    {[
                        { k: "① 과일 활용", node: <div style={{ display: "flex", gap: fruitSize * 0.5, alignItems: "center", transform: `translateY(${fruitSize * 0.07}px)` }}>{["#5570B4", C.orange, "#E0605A"].map((c, j) => <Fruit key={c} color={c} size={fruitSize} animation={`pn-hop 1.8s cubic-bezier(0.45, 0, 0.55, 1) ${j * 0.18}s infinite`} />)}</div> },
                        { k: "② 아이콘 변형 (시계)", node: <Clock size={fruitSize * 2.2} /> },
                        { k: "③ 회전 변형", node: <Fruit color={C.orange} size={fruitSize * 2.2} animation="pn-spin 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite" /> },
                    ].map((it, i) => (
                        <Reveal key={it.k} delay={i * 0.12} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: m ? 12 : 22 }}>
                            <div style={{ height: fruitSize * 3, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.node}</div>
                            <span style={{ ...small, opacity: 0.7, textAlign: "center" }}>{it.k}</span>
                        </Reveal>
                    ))}
                </div>
            </Slide>

            {/* Logo on colour */}
            <Slide bg={C.white} color={C.brown} m={m} title="Color Regulation" lines={["배경색에 따라 지정된 로고 조합을 사용합니다."]}>
                <div style={{ display: "flex", gap: m ? 6 : Math.round(w * 0.012), marginTop: m ? 40 : 0 }}>
                    {([[C.orange, ON_ORANGE], [C.ivory, ON_LIGHT], [C.brown, ON_BROWN]] as [string, Ink][]).map(([bg, tone], i) => (
                        <Reveal key={bg} delay={i * 0.12}>
                            <div style={{ background: bg, width: Math.round(w * (m ? 0.27 : 0.16)), aspectRatio: "3 / 4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Logo tone={tone} width="66%" intro delay={0.2 + i * 0.15} />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Slide>

            {/* Photo split: the fruit itself beside the brand line */}
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr" }}>
                <div style={{ position: "relative", aspectRatio: m ? "4 / 5" : "8 / 9", overflow: "hidden" }}>
                    <Photo src={PHOTO.spoon} alt="Blueberries on a wooden spoon" position="40% 55%" />
                </div>
                <div style={{ position: "relative", aspectRatio: m ? "4 / 3" : "8 / 9", background: C.orange, color: C.white, display: "flex", flexDirection: "column", justifyContent: "center", padding: m ? "0 24px" : "0 12%" }}>
                    <Reveal>
                        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: m ? 26 : Math.min(48, Math.round(w * 0.032)), lineHeight: 1.4, letterSpacing: "-0.02em", wordBreak: "keep-all" }}>과일의 좋은 순간을,<br />일상의 식탁으로.</div>
                        <div style={{ ...small, fontSize: m ? 11 : 12, marginTop: m ? 18 : 28, letterSpacing: "0.04em", opacity: 0.85 }}>THE BEST MOMENT OF FRUIT</div>
                    </Reveal>
                </div>
            </div>

            {/* Detail page: three cropped excerpts of the page bleeding off a gridded board */}
            <div style={{ position: "relative", width: "100%", aspectRatio: m ? "4 / 5" : "16 / 9", overflow: "hidden", background: "#F4F2FA", backgroundImage: "linear-gradient(rgba(91,79,216,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(91,79,216,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
                <SlideTitle title="Detail Page" lines={["블루베리의 보라색을 포인트로 쓴 상세페이지.", "원산지, 구성, 알 크기를 먼저 보여줍니다."]} color={C.brown} m={m} />
                <div style={{ position: "absolute", top: m ? "26%" : 0, bottom: 0, left: m ? "6%" : "24%", right: m ? "6%" : "24%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6%" }}>
                    {(() => {
                        // Read top-to-bottom, left-to-right: each column picks up exactly where the previous one leaves the board.
                        const gridW = w * (m ? 0.88 : 0.52)
                        const colW = (gridW * (1 - 0.12)) / 3
                        const gridH = m ? w * 1.25 * 0.74 : (w * 9) / 16
                        const span = (gridH / colW) * 1000
                        // Every column runs the full height of the board (bleeding 2% past both edges to hide the rounded corners).
                        const tops = [-0.02, -0.02, -0.02]
                        let s = 0
                        return tops.map((t, i) => {
                            const c = { start: Math.round(s), top: `${t * 100}%`, tint: i === 1 }
                            s += span
                            return c
                        })
                    })().map((c) => (
                        <div key={c.start} style={{ position: "relative" }}>
                            {c.tint && <div style={{ position: "absolute", top: 0, bottom: 0, left: "-9%", right: "-9%", background: "rgba(91,79,216,0.12)" }} />}
                            <div style={{ position: "absolute", left: 0, right: 0, top: c.top, bottom: "-2%" }}>
                                <PageCrop images={BLUEBERRY} heights={BLUEBERRY_H} start={c.start} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Closing: the orange cover, as a last word */}
            <Slide bg={C.orange} color={C.white} m={m}>
                <Logo tone={ON_ORANGE} width={m ? "64%" : "34%"} intro delay={0.2} bob />
                <div style={{ position: "absolute", left: m ? 20 : "4%", bottom: m ? 20 : "5.5%", ...small, color: C.white, letterSpacing: "0.04em", textTransform: "uppercase" }}>The best moment of fruit</div>
            </Slide>

        </div>
    )
}

addPropertyControls(PrunauGuideline, {
    adobeKit: { type: ControlType.String, title: "Adobe Fonts kit", placeholder: "e.g. abc1234", defaultValue: "" },
})
