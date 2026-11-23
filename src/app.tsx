// Portfolio site: home, work, project and about pages.
// Compiled by tools/build.sh into assets/js/app.js. React comes from the UMD build (global `React`).

type Project = { slug: string; title: string; field: string; deliverable: string; year: string; cover: string; intro: string; body: [string, number, number][]; behance?: string; guide?: string
    // Shown in every project header. A logo is an image file; with `mask` it is used as a mask filled with that colour.
    client?: { name: string; logo?: string; ratio?: number; mask?: string }
    facts?: [string, string][]
    // Company projects are done at ABBG and personal projects are both 100% mine.
    kind?: "company" | "personal"; contribution?: number }
const kindOf = (p: Project) => p.kind || "company"
const contributionOf = (p: Project) => p.contribution ?? 100
const KIND_LABEL = { company: "Company Project · ABBG", personal: "Personal Project" }
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

/* ---------------- Visitor count ---------------- */

// A free, no-signup counter (abacus.jasoncameron.dev). One visit = one browser session on the live site.
// The owner's own browsers are never counted: open any page once with ?owner=on to switch that browser off
// (?owner=off turns it back on). Local previews never count either.
const COUNTER = "https://abacus.jasoncameron.dev"
const COUNTER_KEY = "designerayr.com/visits"
const safe = <T,>(f: () => T, fallback: T) => { try { return f() } catch { return fallback } }

function useVisits() {
    const [n, setN] = React.useState<number | null>(null)
    React.useEffect(() => {
        const q = new URLSearchParams(location.search).get("owner")
        if (q === "on") safe(() => localStorage.setItem("ayr-owner", "1"), undefined)
        if (q === "off") safe(() => localStorage.removeItem("ayr-owner"), undefined)
        const owner = safe(() => localStorage.getItem("ayr-owner") === "1", false)
        const live = /(^|\.)designerayr\.com$/.test(location.hostname)
        const counted = safe(() => sessionStorage.getItem("ayr-counted") === "1", false)
        const hit = live && !owner && !counted
        fetch(`${COUNTER}/${hit ? "hit" : "get"}/${COUNTER_KEY}`)
            // a counter nobody has hit yet answers 404: show 0 until the first visit creates it
            .then((r) => (r.ok ? r.json() : r.status === 404 ? { value: 0 } : Promise.reject(r.status)))
            .then((d) => {
                if (typeof d.value === "number") setN(d.value)
                if (hit) safe(() => sessionStorage.setItem("ayr-counted", "1"), undefined)
            })
            .catch(() => setN(null))
    }, [])
    return n
}

function VisitCount({ style }: { style?: React.CSSProperties }) {
    const n = useVisits()
    if (n === null) return null
    return <span className="visits" style={style} title="Visitors">Visitors {n.toLocaleString("en-US")}</span>
}

/* ---------------- Home hero: mono top bar and the big serif title ---------------- */

/* ---------------- Home: one full screen — a top bar, a curving strip of project frames, a short line ----------------
   The strip drifts left on its own. On the right it curls toward the viewer like a page being turned:
   frames there come closer, grow and turn to follow the curve. Dragging, sideways swipes and page scrolling
   push the strip; the push fades out with an ease-out (exponential friction). */

function HomeMain() {
    const { title, name, role } = SITE.hero
    const time = useSeoulTime()
    const base = SITE.carousel.map((slug) => SITE.projects.find((p) => p.slug === slug)!).filter(Boolean)
    const stageRef = React.useRef<HTMLDivElement>(null)
    const cardRefs = React.useRef<(HTMLAnchorElement | null)[]>([])
    const [size, setSize] = React.useState({ w: 1200, h: 520 })
    const [hovered, setHovered] = React.useState<number | null>(null)
    const hoveredRef = React.useRef<number | null>(null)
    hoveredRef.current = hovered
    const movedRef = React.useRef(false)

    React.useEffect(() => {
        const el = stageRef.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => { const { width, height } = e.contentRect; if (width > 0 && height > 0) setSize({ w: width, h: height }) })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const narrow = size.w < 600
    const cardH = Math.round(Math.min(size.h * (narrow ? 0.5 : 0.56), narrow ? 240 : 320))
    const cardW = Math.round(cardH * 0.82)
    const gap = narrow ? 8 : 12
    const pitch = cardW + gap
    const reps = Math.max(2, Math.ceil((size.w * 2.2) / (pitch * base.length)))
    const list = React.useMemo(() => { const out: Project[] = []; for (let r = 0; r < reps; r++) out.push(...base); return out }, [reps])
    const total = list.length * pitch

    React.useEffect(() => {
        const W = size.w
        const persp = W * (narrow ? 1.1 : 0.85)
        // the strip runs flat, then wraps round a circular arc toward the viewer.
        // Frames are placed by distance along the strip, so they stay evenly spaced through the curl.
        const s0 = W * (narrow ? 0.34 : 0.48) // where the curl starts
        const R = W * (narrow ? 0.74 : 0.56) // radius of the curl
        const maxT = 1.5 // stop drawing once a frame has turned ~86°
        const drift = narrow ? -48 : -64
        let raf = 0, last = 0, x = 0, v = drift
        let dragging = false, px = 0, pt = 0, scrollY = window.scrollY
        const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

        const apply = () => {
            list.forEach((_, i) => {
                const c = cardRefs.current[i]
                if (!c) return
                // card centre on screen, wrapped so the loop never ends
                const s = ((((i * pitch + x) % total) + total) % total) - pitch * 2 + cardW / 2
                const t = Math.max(0, (s - s0) / R)
                const cx = t > 0 ? s0 + R * Math.sin(t) : s
                const z = t > 0 ? R * (1 - Math.cos(t)) : 0
                c.style.transform = `translate3d(${cx - cardW / 2}px, 0, ${z}px) rotateY(${(-t * 180) / Math.PI}deg)`
                c.style.visibility = s < -pitch || t > maxT || z > persp * 0.8 ? "hidden" : "visible"
            })
        }

        const tick = (t: number) => {
            const dt = last ? Math.min(64, t - last) / 1000 : 0
            last = t
            if (!dragging) {
                const target = hoveredRef.current !== null || reduce ? 0 : drift
                v += (target - v) * Math.min(1, dt * 2.4) // exponential decay = ease-out
                x += v * dt
            }
            apply()
            raf = requestAnimationFrame(tick)
        }

        const el = stageRef.current!
        const down = (e: PointerEvent) => { dragging = true; movedRef.current = false; px = e.clientX; pt = performance.now() }
        const move = (e: PointerEvent) => {
            if (!dragging) return
            const now = performance.now(), dx = e.clientX - px
            if (Math.abs(dx) > 4) movedRef.current = true
            x += dx
            v = v * 0.4 + (dx / Math.max(1, now - pt)) * 1000 * 0.6
            px = e.clientX; pt = now
        }
        const up = () => { dragging = false }
        const wheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { x -= e.deltaX; v -= e.deltaX * 8 } }
        const scroll = () => { const dy = window.scrollY - scrollY; scrollY = window.scrollY; v -= Math.max(-80, Math.min(80, dy)) * 12 }
        el.addEventListener("pointerdown", down)
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerup", up)
        window.addEventListener("pointercancel", up)
        el.addEventListener("wheel", wheel, { passive: true })
        window.addEventListener("scroll", scroll, { passive: true })
        apply()
        raf = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(raf)
            el.removeEventListener("pointerdown", down)
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", up)
            window.removeEventListener("pointercancel", up)
            el.removeEventListener("wheel", wheel)
            window.removeEventListener("scroll", scroll)
        }
    }, [size.w, narrow, pitch, total, list, cardW])

    const cap = (s: string) => s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())
    return (
        <section className="home-main">
            <header className="hm-bar">
                <p className="hm-name"><span>{cap(name)}</span> <span className="muted">{role}</span></p>
                <p className="hm-mid">Seoul {time}</p>
                <nav className="hm-nav">
                    <a href="/work/">Work</a>
                    <a href="/about/" className="muted">About</a>
                    <VisitCount />
                </nav>
            </header>

            <div
                ref={stageRef}
                className="hm-stage"
                onClickCapture={(e) => { if (movedRef.current) { e.preventDefault(); e.stopPropagation() } }}
                style={{ perspective: Math.round(size.w * (narrow ? 1.1 : 0.85)), perspectiveOrigin: "50% 50%" }}
            >
                <div className="hm-track" style={{ height: cardH, marginTop: -cardH / 2 }}>
                    {list.map((p, i) => (
                        <a
                            key={i}
                            ref={(el) => { cardRefs.current[i] = el }}
                            href={projectUrl(p.slug)}
                            aria-label={p.title}
                            draggable={false}
                            className={"hm-card" + (hovered === i ? " on" : "")}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ width: cardW, height: cardH }}
                        >
                            <img src={IMG + p.cover} alt="" draggable={false} />
                            <span className="hm-cap"><b>{p.title}</b><span>{p.field}</span><span>{p.year}</span></span>
                        </a>
                    ))}
                </div>
            </div>

            <footer className="hm-foot">
                <p className="hm-line"><span>{cap(title)}.</span> <span className="muted">Scroll or drag to browse, click a frame to open it.</span></p>
                <a className="hm-count" href="/work/">Selected Works ({String(base.length).padStart(2, "0")})</a>
            </footer>
        </section>
    )
}

/* ---------------- Shared pieces ---------------- */

function SiteHeader() {
    return (
        <header className="site-header">
            <p className="tag">Graphic designer based in Korea,<br />working across brand identity and posters.</p>
            <a href="/" className="brand"><span aria-hidden>✦</span> {SITE.name}</a>
            <nav>
                <a href="/work/">Work</a>
                <a href="/about/">About</a>
                <VisitCount />
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
        </section>
    )
}

function Card({ p }: { p: Project }) {
    return (
        <a className="card" href={projectUrl(p.slug)}>
            <div className="cover"><img src={IMG + p.cover} alt={p.title} loading="lazy" /></div>
            <div className="cap"><span>{p.title}</span><span className="f">{p.field}</span></div>
            <div className="kind"><span className={`dot ${kindOf(p)}`} />{kindOf(p) === "company" ? "ABBG" : "Personal"} · {contributionOf(p)}%</div>
        </a>
    )
}

/* ---------------- Pages ---------------- */

function HomePage() {
    return (
        <>
            <HomeMain />
            <Profile />
        </>
    )
}

function WorkPage() {
    // The filter lives in the URL hash (#company / #personal) so a filtered view can be linked to.
    const read = () => { const h = location.hash.slice(1); return h === "company" || h === "personal" ? h : "all" }
    const [tab, setTab] = React.useState<"all" | "company" | "personal">(read)
    React.useEffect(() => { const on = () => setTab(read()); window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on) }, [])
    const count = (k: string) => SITE.projects.filter((p) => k === "all" || kindOf(p) === k).length
    const shown = SITE.projects.filter((p) => tab === "all" || kindOf(p) === tab)
    const tabs: [typeof tab, string][] = [["all", "All"], ["company", "Company · ABBG"], ["personal", "Personal"]]
    return (
        <>
            <SiteHeader />
            <main className="work-page">
                <div className="work-head">
                    <h1>Selected Works<sup>({shown.length})</sup></h1>
                    <div className="work-tabs" role="tablist">
                        {tabs.map(([k, label]) => (
                            <a key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} href={k === "all" ? "#" : `#${k}`} onClick={(e) => { e.preventDefault(); history.replaceState(null, "", k === "all" ? location.pathname : `#${k}`); setTab(k) }}>
                                {label}<sup>{count(k)}</sup>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="grid">{shown.map((p) => <Card key={p.slug} p={p} />)}</div>
            </main>
        </>
    )
}

/** The same overview block on every project: title and summary on the left, the facts on the right. */
function ProjectHead({ p }: { p: Project }) {
    const c = p.client
    const logo = c && c.logo
        ? c.mask
            ? <span role="img" aria-label={c.name} className="ph-logo" style={{ aspectRatio: `${c.ratio || 4}`, background: c.mask, WebkitMaskImage: `url(${IMG}${c.logo})`, maskImage: `url(${IMG}${c.logo})` }} />
            : <img className="ph-logo" src={IMG + c.logo} alt={c.name} style={{ aspectRatio: `${c.ratio || 4}` }} />
        : null
    const pct = contributionOf(p)
    const rows: [string, React.ReactNode][] = []
    rows.push(["Project", <span className={`ph-kind ${kindOf(p)}`}>{KIND_LABEL[kindOf(p)]}</span>])
    rows.push(["Contribution", <span className="ph-contrib"><b>{pct}%</b><i><em style={{ width: `${pct}%` }} /></i></span>])
    if (c) rows.push(["Client", <>{logo}<span>{c.name}</span></>])
    rows.push(["Field", p.field], ["Deliverable", p.deliverable])
    ;(p.facts || []).forEach((f) => rows.push(f))
    rows.push(["Year", p.year])
    return (
        <section className="proj-head">
            <a className="back" href="/work/">← All projects</a>
            <div className="ph-grid">
                <div>
                    <h1>{p.title}</h1>
                    <p className="ph-lede pre">{p.intro}</p>
                </div>
                <dl className="ph-facts">
                    {rows.map(([k, v]) => (
                        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                </dl>
            </div>
        </section>
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
                <ProjectHead p={p} />
                {Guide && <Guide />}
                {p.body.length > 0 && (
                    <div className="body-imgs">
                        {p.body.map(([src, w, h], i) => <img key={src} src={IMG + src} width={w} height={h} alt={`${p.title} ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} />)}
                    </div>
                )}
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
