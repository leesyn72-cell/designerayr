// Portfolio site: home, work, project and about pages.
// Compiled by tools/build.sh into assets/js/app.js. React comes from the UMD build (global `React`).

type Project = { slug: string; title: string; field: string; deliverable: string; year: string; cover: string; intro: string; body: [string, number, number][]; behance?: string; guide?: string }
const SITE = (window as any).SITE as { name: string; behance: string; tagline: string; hero: { title: string; name: string; role: string }; profile: any; carousel: string[]; projects: Project[] }
const IMG = "/assets/img/"
const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'
const projectUrl = (slug: string) => `/projects/${slug}/`

function useWidth<T extends HTMLElement>(initial = 1200) {
    const ref = React.useRef<T>(null)
    const [w, setW] = React.useState(initial)
    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        setW(el.getBoundingClientRect().width || initial)
        const ro = new ResizeObserver(([e]) => { if (e.contentRect.width > 0) setW(e.contentRect.width) })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    return [ref, w] as const
}

function useSeoulTime() {
    const fmt = () => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" }).format(new Date())
    const [t, setT] = React.useState(fmt)
    React.useEffect(() => {
        const id = setInterval(() => setT(fmt()), 30000)
        return () => clearInterval(id)
    }, [])
    return t
}

/* ---------------- Home hero: mono top bar and the big serif title ---------------- */

function Hero() {
    const { title, name, role } = SITE.hero
    const [rootRef, w] = useWidth<HTMLDivElement>()
    const [shown, setShown] = React.useState(false)
    const [hover, setHover] = React.useState<number | null>(null)
    const time = useSeoulTime()
    React.useEffect(() => { const t = setTimeout(() => setShown(true), 80); return () => clearTimeout(t) }, [])

    const narrow = w < 600
    const letters = Array.from(title)
    // Keep the title size; only shrink when a long word would overflow 90% of the width.
    const base = Math.min(w * (narrow ? 0.2 : 0.165), 300)
    const size = base * Math.min(1, (w * 0.9) / (Math.max(letters.length, 1) * 0.45 * base))
    const label: React.CSSProperties = { fontFamily: MONO, fontSize: narrow ? 11 : 13, lineHeight: 1.45, letterSpacing: "0.01em", color: "var(--muted)", margin: 0 }
    const value: React.CSSProperties = { ...label, color: "var(--ink)" }

    return (
        <div ref={rootRef} className="home-hero" style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr auto" : "1.2fr 1fr 1fr auto", gap: 24, padding: "0 24px", alignItems: "start" }}>
                <p style={value}>{name}</p>
                {!narrow && (
                    <div>
                        <p style={label}>{role}</p>
                        <p style={value}>Seoul {time}</p>
                    </div>
                )}
                {!narrow && (
                    <div>
                        <p style={label}>Project Inquiries</p>
                        <a href={SITE.behance} target="_blank" rel="noopener" style={value}>Behance ↗</a>
                    </div>
                )}
                <div style={{ display: "flex", gap: narrow ? 14 : 22 }}>
                    <a href="/work/" style={value}>Work</a>
                    <a href="/about/" style={value}>About</a>
                    <a href={SITE.behance} target="_blank" rel="noopener" style={value}>Contact</a>
                </div>
            </div>
            <h1
                aria-label={title}
                style={{ margin: 0, marginTop: narrow ? 56 : 40, textAlign: "center", fontFamily: "var(--serif)", fontWeight: 400, fontSize: size, lineHeight: 0.95, height: base * 0.95, display: "flex", alignItems: "flex-end", justifyContent: "center", letterSpacing: "-0.01em", whiteSpace: "nowrap", transform: `scale(${shown ? 1 : 1.18})`, transition: "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
                {letters.map((ch, i) => (
                    <span
                        key={i}
                        aria-hidden
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                        style={{
                            display: "inline-block",
                            whiteSpace: "pre",
                            opacity: shown ? (hover === null || hover === i ? 1 : 0.35) : 0,
                            filter: shown ? "blur(0px)" : "blur(12px)",
                            transform: `translateY(${shown ? (hover === i ? -0.06 : 0) : 0.45}em)`,
                            transition: `opacity ${shown ? 0.5 : 0.9}s ease ${shown ? 0 : i * 0.07}s, filter 1s ease ${i * 0.07}s, transform ${hover === i || hover === null ? 0.9 : 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${shown && hover === null ? 0 : i * 0.07}s`,
                        }}
                    >
                        {ch}
                    </span>
                ))}
            </h1>
            <p style={{ ...label, textAlign: "center", margin: narrow ? "20px 24px 0" : "18px 24px 0", opacity: shown ? 1 : 0, transition: "opacity 1s ease 0.7s" }}>{SITE.tagline}</p>
        </div>
    )
}

/* ---------------- Home carousel: a slowly turning 3D ring of covers ---------------- */

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Carousel() {
    const speed = 3, hold = 0.8, turn = 0.8, ghost = 0.18, hoverScale = 1.16
    const base = SITE.carousel.map((slug) => SITE.projects.find((p) => p.slug === slug)!).filter(Boolean)
    const list = React.useMemo(() => { const out: Project[] = []; while (out.length < 12) out.push(...base); return out }, [])
    const n = list.length
    const step = 360 / n
    const rootRef = React.useRef<HTMLDivElement>(null)
    const ringRef = React.useRef<HTMLDivElement>(null)
    const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const [size, setSize] = React.useState({ w: 1200, h: 760 })
    const [hovered, setHovered] = React.useState<number | null>(null)
    const hoveredRef = React.useRef<number | null>(null)
    hoveredRef.current = hovered

    React.useEffect(() => {
        const el = rootRef.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => { const { width, height } = e.contentRect; if (width > 0 && height > 0) setSize({ w: width, h: height }) })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const narrow = size.w < 600
    const cardH = Math.min(size.h * (narrow ? 0.46 : 0.56), (size.w * 0.72) / 0.75)
    const cardW = cardH * 0.75
    const radius = (cardW * 1.15) / (2 * Math.tan(Math.PI / n))
    const persp = radius * 1.7

    React.useEffect(() => {
        let raf = 0, last = 0, tv = 0, mult = 1
        const period = hold + turn
        const angleAt = (t: number) => {
            const k = Math.floor(t / period)
            const f = Math.min(1, Math.max(0, (t - k * period - hold) / turn))
            // always moving: slow drift while holding, quick push to the next card
            return -(speed * t + (step - speed * period) * (k + ease(f)))
        }
        const apply = (angle: number) => {
            if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateX(-7deg) rotateY(${angle}deg)`
            cardRefs.current.forEach((c, i) => {
                if (!c) return
                const cos = Math.cos((i * step + angle) * (Math.PI / 180))
                // front card fully visible, far side of the ring faint, side cards hidden
                const front = Math.min(1, Math.max(0, (cos - 0.9) / 0.1))
                const back = Math.min(1, Math.max(0, (-cos - 0.35) / 0.35))
                c.style.opacity = String(Math.max(front, ghost * back))
                c.style.pointerEvents = front > 0.5 ? "auto" : "none"
                c.querySelectorAll<HTMLElement>("[data-face]").forEach((f) => { f.style.visibility = (f.dataset.face === "back") === (cos < 0) ? "visible" : "hidden" })
            })
        }
        apply(0)
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
        const tick = (t: number) => {
            const dt = last ? Math.min(64, t - last) / 1000 : 0
            last = t
            mult += ((hoveredRef.current === null ? 1 : 0) - mult) * Math.min(1, dt * 6)
            tv += dt * mult
            apply(angleAt(tv))
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [n, step, radius])

    return (
        <div ref={rootRef} className="carousel-wrap" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: narrow ? "10%" : "4%", width: "100%", height: "100%", perspective: persp, perspectiveOrigin: "50% 20%", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div ref={ringRef} style={{ position: "relative", width: cardW, height: cardH, transformStyle: "preserve-3d" }}>
                    {list.map((p, i) => {
                        const face = (back: boolean) => (
                            <div data-face={back ? "back" : "front"} style={{ position: "absolute", inset: 0, overflow: "hidden", background: "var(--line)", transform: back ? "scaleX(-1)" : "none", visibility: back ? "hidden" : "visible" }}>
                                <img src={IMG + p.cover} alt={back ? "" : p.title} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        )
                        return (
                            <div
                                key={i}
                                ref={(el) => { cardRefs.current[i] = el }}
                                title={p.title}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, cursor: "pointer", pointerEvents: "auto" }}
                            >
                                <a href={projectUrl(p.slug)} aria-label={p.title} style={{ display: "block", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
                                    <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `scale(${hovered === i ? hoverScale : 1})`, transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                                        {face(false)}
                                        {face(true)}
                                    </div>
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

/* ---------------- Shared pieces ---------------- */

function SiteHeader() {
    return (
        <header className="site-header">
            <p className="tag">Graphic designer based in Korea,<br />working across brand, editorial and posters.</p>
            <a href="/" className="brand"><span aria-hidden>✦</span> {SITE.name}</a>
            <nav>
                <a href="/work/">Work</a>
                <a href="/about/">About</a>
                <a href={SITE.behance} target="_blank" rel="noopener">Behance</a>
            </nav>
        </header>
    )
}

function Profile({ tight = false }: { tight?: boolean }) {
    const p = SITE.profile
    return (
        <section className={"profile" + (tight ? " tight" : "")}>
            <p className="label">(Profile)</p>
            <p className="statement">
                Hi, I’m <em>Ahn Yu Lim</em> — a graphic designer who loves&nbsp;to&nbsp;learn. <span className="tail">Always a step beyond yesterday.</span>
            </p>
            <p className="korean-line pre">{p.koreanLine}</p>

            <div className="intro-grid">
                <div className="intro-info">
                    <div className="who">
                        <span>{SITE.name}</span>
                        <span className="muted">{p.role}</span>
                    </div>
                    <p className="about pre">{p.intro}</p>
                    <span className="available">Available for freelance work</span>
                    <a className="btn" href={SITE.behance} target="_blank" rel="noopener">Get in touch ↗</a>
                </div>
                <div className="photo"><img src={IMG + p.photo} alt={SITE.name} /></div>
                <div className="lists">
                    <div>
                        <h4>Capabilities</h4>
                        <ul>{p.capabilities.map((c: string) => <li key={c}>{c}</li>)}</ul>
                    </div>
                    <div>
                        <h4>Tools</h4>
                        <ul>{p.tools.map((c: string) => <li key={c}>{c}</li>)}</ul>
                    </div>
                </div>
            </div>

            <div className="row">
                <h3>Experience</h3>
                <div className="entries">
                    {p.experience.map((e: any) => (
                        <div key={e.role}><span>{e.role}</span><span>{e.company}</span><span className="period">{e.period}</span></div>
                    ))}
                </div>
            </div>
            <div className="row">
                <h3>What I do</h3>
                <div className="services">
                    {p.services.map((s: any) => (
                        <div key={s.name}><span>{s.name}</span><span className="desc pre">{s.desc}</span><span className="work">{s.work}</span></div>
                    ))}
                </div>
            </div>
            <div className="row reach">
                <h3>Reach out</h3>
                <div>
                    <a href={SITE.behance} target="_blank" rel="noopener">Let’s work together ↗</a>
                    <p>Find more work and get in touch on Behance.</p>
                </div>
            </div>
        </section>
    )
}

function Card({ p }: { p: Project }) {
    return (
        <a className="card" href={projectUrl(p.slug)}>
            <div className="cover"><img src={IMG + p.cover} alt={p.title} loading="lazy" /></div>
            <div className="cap"><span>{p.title}</span><span className="f">{p.field}</span></div>
        </a>
    )
}

/* ---------------- Pages ---------------- */

function HomePage() {
    return (
        <>
            <Hero />
            <Carousel />
            <Profile />
        </>
    )
}

function WorkPage() {
    return (
        <>
            <SiteHeader />
            <main className="work-page">
                <div className="work-head">
                    <h1>Selected Works<sup>({SITE.projects.length})</sup></h1>
                    <span className="cats">Brand · Packaging · Editorial · Poster</span>
                </div>
                <div className="grid">{SITE.projects.map((p) => <Card key={p.slug} p={p} />)}</div>
            </main>
        </>
    )
}

function ProjectPage({ slug }: { slug: string }) {
    const p = SITE.projects.find((x) => x.slug === slug)!
    const Guide = p.guide ? (window as any).Guides?.[p.guide] : null
    const others = SITE.projects.filter((x) => x.slug !== slug)
    return (
        <>
            <SiteHeader />
            <main>
                <section className="proj-head">
                    <a className="back" href="/work/">← All projects</a>
                    <h1>{p.title}<sup>{p.year}</sup></h1>
                    <p className="proj-intro pre">{p.intro}</p>
                    <div className="meta">
                        <div><span>Field</span>{p.field}</div>
                        <div><span>Deliverable</span>{p.deliverable}</div>
                    </div>
                </section>
                {Guide && <Guide />}
                {p.body.length > 0 && (
                    <div className="body-imgs">
                        {p.body.map(([src, w, h], i) => <img key={src} src={IMG + src} width={w} height={h} alt={`${p.title} ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} />)}
                    </div>
                )}
                {p.behance && <p className="behance"><a href={p.behance} target="_blank" rel="noopener">View on Behance ↗</a></p>}
                <section className="others">
                    <div className="others-head">
                        <h2>Other projects</h2>
                        <a href="/work/">All works →</a>
                    </div>
                    <div className="grid">{others.map((o) => <Card key={o.slug} p={o} />)}</div>
                </section>
            </main>
        </>
    )
}

function AboutPage() {
    return (
        <>
            <SiteHeader />
            <Profile tight />
        </>
    )
}

function App() {
    const page = (window as any).PAGE as { type: string; slug?: string }
    if (page.type === "work") return <WorkPage />
    if (page.type === "about") return <AboutPage />
    if (page.type === "project") return <ProjectPage slug={page.slug!} />
    return <HomePage />
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
