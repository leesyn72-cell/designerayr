import * as React from "react"

// LASERIN (GoGoDive) Instagram feed contents.
// Opens on the same turning 3D ring as the home page, then one board per product, the live feed and every post.

const IMG = "/assets/img/"
const INSTAGRAM = "https://www.instagram.com/laserin_swim/"
const C = { ink: "#111014", lilac: "#C9C3F4", violet: "#5B4FD8", line: "rgba(255,255,255,0.14)", muted: "rgba(255,255,255,0.55)" }
const SANS = '"Inter Display", "Inter", "Pretendard", system-ui, sans-serif'

type Set = { n: string; product: string; title: string; notes: string[]; files: string[]; tint: string }
const SETS: Set[] = [
    { n: "01", product: "Lumina 루미나", title: "Keep It Simple, Let It Shine!", tint: "#EAF2FB",
      notes: ["루미나 다섯 가지 컬러를 한 장에 모은 컬러 소개", "모델 컷 위에 손글씨 타이틀을 겹친 화보형 콘텐츠", "Find your color, own your mood"], files: ["ls-01", "ls-02", "ls-03"] },
    { n: "02", product: "Yunseul 윤슬", title: "Which Shimmer is Yours?", tint: "#E8F3FB",
      notes: ["선셋과 에메랄드, 두 가지 윤슬 컬러를 비교하는 질문형 커버", "컬러마다 디테일 컷을 콜라주로 배치"], files: ["ls-04", "ls-05", "ls-06"] },
    { n: "03", product: "Tweedy 트위디", title: "Stay Romantic — A new mood on the water", tint: "#F7EEF5",
      notes: ["우표 프레임 안에 네 가지 컬러를 담은 커버", "체크와 웨이브, 패턴별로 나눈 착용 컷"], files: ["ls-07", "ls-08", "ls-09"] },
    { n: "04", product: "Raina 레이나", title: "Sunset Coral · Blush Pink · Ice Blue", tint: "#FBEEE6",
      notes: ["컬러마다 배경 톤을 맞춘 단색 화보", "뒷모습 디테일 컷을 작은 프레임으로 더함"], files: ["ls-10", "ls-11", "ls-12"] },
    { n: "05", product: "Glit 글리트", title: "Berry Matcha · Ice Mocha · Charcol Velvet", tint: "#F1EEF3",
      notes: ["컬러 이름에 맞춘 오브젝트와 손그림 아이콘", "제품 컷을 스티커처럼 붙여 착용 컷과 함께 보여줌"], files: ["ls-13", "ls-14", "ls-15"] },
]
// Each spread takes its colour from its posts: Lumina butter, Yunseul water, Tweedy lilac, Raina peach, Glit sage.
const TONES = [
    { bg: "#F5F0DC", accent: "#A68A2A", ink: "#3A3424", line: "rgba(58,52,36,0.18)" },
    { bg: "#E2EEF6", accent: "#3D86B8", ink: "#22384A", line: "rgba(34,56,74,0.16)" },
    { bg: "#F0E6F2", accent: "#9C4A8B", ink: "#3B2438", line: "rgba(59,36,56,0.16)" },
    { bg: "#FAE7DC", accent: "#D0623F", ink: "#4A2A20", line: "rgba(74,42,32,0.16)" },
    { bg: "#E6EDE1", accent: "#5D7D4D", ink: "#2A3524", line: "rgba(42,53,36,0.16)" },
]
const ALL = SETS.flatMap((s) => s.files)

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
    const [ref, seen] = useInView<HTMLDivElement>(0.15)
    return (
        <div ref={ref} style={{ ...style, opacity: seen ? 1 : 0, transform: `translateY(${seen ? 0 : 30}px)`, transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
            {children}
        </div>
    )
}

function Card({ file, alt, shadow = true, radius = 6 }: { file: string; alt: string; shadow?: boolean; radius?: number }) {
    return <img src={`${IMG}${file}.jpg`} alt={alt} loading="lazy" draggable={false} style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block", borderRadius: radius, boxShadow: shadow ? "0 24px 60px rgba(17,16,20,0.18)" : "none" }} />
}

/** A simple phone frame showing one post the way it sits in the feed. */
function Phone({ file, width }: { file: string; width: number | string }) {
    return (
        <div style={{ width, background: "#fff", borderRadius: 34, padding: "14px 10px 18px", boxShadow: "0 30px 70px rgba(17,16,20,0.22)", border: "1px solid rgba(17,16,20,0.08)" }}>
            <div style={{ width: "34%", height: 6, margin: "0 auto 12px", borderRadius: 6, background: "#E6E3EE" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px 10px", fontFamily: SANS, fontSize: 11, color: C.ink }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.lilac }} />
                <span style={{ fontWeight: 600, letterSpacing: "0.02em" }}>laserin_swim</span>
            </div>
            <img src={`${IMG}${file}.jpg`} alt="" loading="lazy" draggable={false} style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block" }} />
            <div style={{ display: "flex", gap: 10, padding: "10px 4px 0" }}>
                {[0, 1, 2].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: i === 2 ? 3 : "50%", border: `1.5px solid ${C.ink}` }} />)}
            </div>
            <div style={{ padding: "8px 4px 0", display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ width: "62%", height: 6, borderRadius: 6, background: "#E6E3EE" }} />
                <div style={{ width: "40%", height: 6, borderRadius: 6, background: "#EEECF4" }} />
            </div>
        </div>
    )
}

const PINK = "#D47097"
const WALL_CSS = `
@keyframes ls-up { from { transform: translateY(0) } to { transform: translateY(-50%) } }
@keyframes ls-down { from { transform: translateY(-50%) } to { transform: translateY(0) } }
@keyframes ls-cover-out { 0%, 78% { transform: translateY(0); filter: blur(0) } 100% { transform: translateY(-104%); filter: blur(6px) } }
@keyframes ls-cover-in { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: translateY(0) } }
@keyframes ls-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@media (prefers-reduced-motion: reduce) { .ls-intro * { animation: none !important } .ls-cover { display: none } }
`

/** The LASERIN wordmark, taken from the brand's own artwork and used as a mask so it can take any colour. */
function Wordmark({ width, color }: { width: number | string; color: string }) {
    return (
        <div role="img" aria-label="LASERIN" style={{ width, aspectRatio: "1020 / 264", background: color, WebkitMaskImage: `url(${IMG}laserin-word.png)`, maskImage: `url(${IMG}laserin-word.png)`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }} />
    )
}

/**
 * Intro: a LASERIN card in the brand's pink-to-water gradient, which rises away like a wave
 * to show a tilted wall of every post drifting up and down in columns.
 */
function Wall({ files, w, m }: { files: string[]; w: number; m: boolean }) {
    const cols = m ? 3 : 5
    const h = m ? Math.round(w * 1.2) : Math.min(820, Math.round(w * 0.56))
    const columns = Array.from({ length: cols }, (_, c) => {
        const list = files.map((_, i) => files[(i * 2 + c * 4) % files.length])
        return [...list, ...list]
    })
    const cover = 3.2
    return (
        <div className="ls-intro" style={{ position: "relative", height: h, overflow: "hidden", background: "#F7EEF3" }}>
            <style>{WALL_CSS}</style>
            {/* the moving wall */}
            <div style={{ position: "absolute", left: "-12%", right: "-12%", top: "-30%", bottom: "-30%", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: m ? 8 : 16, transform: "rotate(-8deg)" }}>
                {columns.map((list, c) => (
                    <div key={c} style={{ overflow: "hidden" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: m ? 8 : 16, animation: `${c % 2 ? "ls-down" : "ls-up"} ${46 + c * 6}s linear infinite` }}>
                            {list.map((f, i) => (
                                <img key={i} src={`${IMG}${f}.jpg`} alt="" draggable={false} style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block", borderRadius: m ? 6 : 10 }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* soft wash and the wordmark floating on top */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(247,238,243,0.86) 0, rgba(247,238,243,0.55) 26%, rgba(247,238,243,0) 58%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: m ? 10 : 16, animation: "ls-bob 5s ease-in-out infinite" }}>
                <Wordmark width={m ? "62%" : "34%"} color={PINK} />
                <div style={{ fontFamily: SANS, fontSize: m ? 11 : 13, letterSpacing: "0.22em", textTransform: "uppercase", color: PINK }}>Instagram Contents</div>
            </div>

            {/* opening card */}
            <div className="ls-cover" style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: m ? 16 : Math.round(w * 0.016), background: "linear-gradient(180deg, #F3D7DE 0%, #E9E1EC 30%, #A9CFE3 52%, #E6DDE8 74%, #EBB9C8 100%)", animation: `ls-cover-out ${cover}s cubic-bezier(0.7, 0, 0.3, 1) both` }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)", backgroundSize: m ? "26px 34px" : "42px 52px" }} />
                <div style={{ position: "relative", animation: "ls-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both" }}><Wordmark width={m ? Math.round(w * 0.62) : Math.round(w * 0.36)} color={PINK} /></div>
                <div style={{ position: "relative", textAlign: "center", fontFamily: SANS, color: "#fff", textShadow: "0 1px 12px rgba(120,60,90,0.25)", animation: "ls-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both" }}>
                    <div style={{ fontSize: m ? 16 : Math.min(26, Math.round(w * 0.017)), fontWeight: 700 }}>라세린 인스타그램 콘텐츠 제작</div>
                    <div style={{ marginTop: 8, fontSize: m ? 11 : 13, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>LASERIN Swimwear · Feed Contents</div>
                </div>
            </div>
        </div>
    )
}

export default function LaserinContents() {
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
    const small: React.CSSProperties = { fontFamily: SANS, fontSize: m ? 11 : 12, lineHeight: 1.65, letterSpacing: "0.01em" }

    return (
        <div ref={rootRef} style={{ width: "100%", fontFamily: SANS }}>
            {/* Intro: the LASERIN card, then the drifting wall of posts */}
            <Wall files={ALL} w={w} m={m} />


            {/* One editorial spread per product: the name set large in the brand's serif mood, three posts staggered */}
            {SETS.map((s, si) => {
                const [en, ...kr] = s.product.split(" ")
                const tone = TONES[si % TONES.length]
                const flip = si % 2 === 1
                const lift = ["-7%", "6%", "-2%"]
                const nameBlock = (
                    <Reveal style={{ color: tone.ink, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: m ? 0 : "100%" }}>
                        <div>
                            <div style={{ fontFamily: '"Instrument Serif", "Times New Roman", serif', fontStyle: "italic", fontSize: m ? 72 : Math.min(176, Math.round(w * 0.11)), lineHeight: 0.86, letterSpacing: "-0.03em", color: tone.accent }}>{en}</div>
                            <div style={{ ...small, marginTop: m ? 10 : 18, fontSize: m ? 12 : 13, letterSpacing: "0.18em" }}>{kr.join(" ")}</div>
                            <div style={{ fontFamily: '"Instrument Serif", "Times New Roman", serif', fontSize: m ? 20 : Math.min(30, Math.round(w * 0.02)), lineHeight: 1.25, marginTop: m ? 22 : 40, maxWidth: 360 }}>{s.title}</div>
                        </div>
                        <ol style={{ listStyle: "none", padding: 0, margin: m ? "22px 0 0" : "48px 0 0", borderTop: `1px solid ${tone.line}` }}>
                            {s.notes.map((t, i) => (
                                <li key={t} style={{ ...small, display: "grid", gridTemplateColumns: "28px 1fr", padding: "10px 0", borderBottom: `1px solid ${tone.line}`, wordBreak: "keep-all", color: tone.ink }}>
                                    <span style={{ opacity: 0.45 }}>{String(i + 1).padStart(2, "0")}</span>{t}
                                </li>
                            ))}
                        </ol>
                    </Reveal>
                )
                const posts = (
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1.25fr 1fr", gap: m ? 10 : Math.round(w * 0.016), alignItems: "center", padding: m ? 0 : "5% 0" }}>
                        {s.files.map((f, i) => (
                            <Reveal key={f} delay={i * 0.12} style={{ gridColumn: m && i === 1 ? "1 / -1" : undefined, gridRow: m && i === 1 ? 1 : undefined }}>
                                <figure style={{ margin: 0, transform: m ? "none" : `translateY(${lift[i]})` }}>
                                    <Card file={f} alt={`${s.product} ${i + 1}`} radius={2} />
                                    <figcaption style={{ ...small, display: "flex", justifyContent: "space-between", marginTop: 10, color: tone.ink, opacity: 0.6 }}>
                                        <span>{en}</span><span>{String(i + 1).padStart(2, "0")}</span>
                                    </figcaption>
                                </figure>
                            </Reveal>
                        ))}
                    </div>
                )
                return (
                    <section key={s.n} style={{ position: "relative", background: tone.bg, padding: m ? "40px 20px 56px" : `${Math.round(w * 0.04)}px ${pad}px ${Math.round(w * 0.06)}px`, overflow: "hidden" }}>
                        {/* running header, like a magazine page */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, marginBottom: m ? 28 : Math.round(w * 0.035), borderBottom: `1px solid ${tone.line}` }}>
                            <Wordmark width={m ? 76 : 96} color={tone.ink} />
                            <span style={{ ...small, color: tone.ink, letterSpacing: "0.12em" }}>{s.n} / {String(SETS.length).padStart(2, "0")}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : flip ? "2.1fr 1fr" : "1fr 2.1fr", gap: m ? 32 : Math.round(w * 0.05), alignItems: "stretch" }}>
                            {m || !flip ? <>{nameBlock}{posts}</> : <>{posts}{nameBlock}</>}
                        </div>
                    </section>
                )
            })}

            {/* Live: the posts as they appear on the brand's Instagram */}
            <section style={{ background: C.ink, color: "#fff", padding: m ? "56px 20px" : `${Math.round(w * 0.06)}px ${pad}px`, display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 36 : pad * 1.5, alignItems: "center" }}>
                <Reveal>
                    <div style={{ fontWeight: 800, fontSize: m ? 36 : Math.min(72, Math.round(w * 0.05)), lineHeight: 0.95, letterSpacing: "-0.035em", color: C.lilac }}>Live on<br />Instagram</div>
                    <p style={{ ...small, fontSize: m ? 12 : 13, color: C.muted, margin: "20px 0 0", maxWidth: 360, wordBreak: "keep-all" }}>라세린 공식 인스타그램 피드에 실제로 업로드된 화면입니다.</p>
                    <a href={INSTAGRAM} target="_blank" rel="noopener" style={{ display: "inline-flex", gap: 6, marginTop: 24, ...small, fontSize: m ? 13 : 14, color: "#fff", borderBottom: `1px solid ${C.lilac}`, paddingBottom: 2 }}>@laserin_swim ↗</a>
                </Reveal>
                <Reveal delay={0.15} style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: m ? "78%" : Math.min(360, Math.round(w * 0.25)), background: "#000", borderRadius: 40, padding: 10, boxShadow: "0 40px 90px rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <img src={`${IMG}ls-feed.jpg`} alt="The LASERIN Instagram profile feed" loading="lazy" draggable={false} style={{ width: "100%", display: "block", borderRadius: 30 }} />
                    </div>
                </Reveal>
            </section>

            {/* Every post, three across like the grid */}
            <section style={{ background: C.ink, color: "#fff", padding: m ? "0 20px 56px" : `0 ${pad}px ${Math.round(w * 0.06)}px` }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: m ? 3 : 6, maxWidth: 1000, margin: "0 auto" }}>
                    {[...ALL].reverse().map((f, i) => (
                        <Reveal key={f} delay={(i % 3) * 0.08}>
                            <Card file={f} alt="" shadow={false} radius={0} />
                        </Reveal>
                    ))}
                </div>
            </section>
        </div>
    )
}
