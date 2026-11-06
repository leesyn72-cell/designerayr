(function () {
const SITE = window.SITE;
const IMG = "/assets/img/";
const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
const projectUrl = slug => `/projects/${slug}/`;
function useWidth(initial = 1200) {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(initial);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.getBoundingClientRect().width || initial);
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) setW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}
function useSeoulTime() {
  const fmt = () => new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Seoul"
  }).format(new Date());
  const [t, setT] = React.useState(fmt);
  React.useEffect(() => {
    const id = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return t;
}
function Hero() {
  const {
    title,
    name,
    role
  } = SITE.hero;
  const [rootRef, w] = useWidth();
  const [shown, setShown] = React.useState(false);
  const [hover, setHover] = React.useState(null);
  const time = useSeoulTime();
  React.useEffect(() => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setTimeout(() => setShown(true), 80);
      }
    };
    const fonts = document.fonts;
    if (fonts && fonts.load) fonts.load('400 100px "Instrument Serif"').then(go, go);else go();
    const t = setTimeout(go, 1500);
    return () => {
      done = true;
      clearTimeout(t);
    };
  }, []);
  const narrow = w < 600;
  const letters = Array.from(title);
  const base = Math.min(w * (narrow ? 0.2 : 0.165), 300);
  const size = base * Math.min(1, w * 0.9 / (Math.max(letters.length, 1) * 0.45 * base));
  const label = {
    fontFamily: MONO,
    fontSize: narrow ? 11 : 13,
    lineHeight: 1.45,
    letterSpacing: "0.01em",
    color: "var(--muted)",
    margin: 0
  };
  const value = {
    ...label,
    color: "var(--ink)"
  };
  return React.createElement("div", {
    ref: rootRef,
    className: "home-hero",
    style: {
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: narrow ? "1fr auto" : "1.2fr 1fr 1fr auto",
      gap: 24,
      padding: "0 24px",
      alignItems: "start"
    }
  }, React.createElement("p", {
    style: value
  }, name), !narrow && React.createElement("div", null, React.createElement("p", {
    style: label
  }, role), React.createElement("p", {
    style: value
  }, "Seoul ", time)), !narrow && React.createElement("div", null, React.createElement("p", {
    style: label
  }, "Project Inquiries"), React.createElement("a", {
    href: SITE.behance,
    target: "_blank",
    rel: "noopener",
    style: value
  }, "Behance \u2197")), React.createElement("div", {
    style: {
      display: "flex",
      gap: narrow ? 14 : 22
    }
  }, React.createElement("a", {
    href: "/work/",
    style: value
  }, "Work"), React.createElement("a", {
    href: "/about/",
    style: value
  }, "About"), React.createElement("a", {
    href: SITE.behance,
    target: "_blank",
    rel: "noopener",
    style: value
  }, "Contact"))), React.createElement("h1", {
    "aria-label": title,
    style: {
      margin: 0,
      marginTop: narrow ? 56 : 40,
      textAlign: "center",
      fontFamily: "var(--serif)",
      fontWeight: 400,
      fontSize: size,
      lineHeight: 0.95,
      height: base * 0.95,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
      transform: `scale(${shown ? 1 : 1.18})`,
      transition: "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)"
    }
  }, letters.map((ch, i) => React.createElement("span", {
    key: i,
    "aria-hidden": true,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null),
    style: {
      display: "inline-block",
      whiteSpace: "pre",
      opacity: shown ? hover === null || hover === i ? 1 : 0.35 : 0,
      filter: shown ? "blur(0px)" : "blur(12px)",
      transform: `translateY(${shown ? hover === i ? -0.06 : 0 : 0.45}em)`,
      transition: `opacity ${shown ? 0.5 : 0.9}s ease ${shown ? 0 : i * 0.07}s, filter 1s ease ${i * 0.07}s, transform ${hover === i || hover === null ? 0.9 : 0.6}s cubic-bezier(0.16, 1, 0.3, 1) ${shown && hover === null ? 0 : i * 0.07}s`
    }
  }, ch))), React.createElement("p", {
    style: {
      ...label,
      textAlign: "center",
      margin: narrow ? "20px 24px 0" : "18px 24px 0",
      opacity: shown ? 1 : 0,
      transition: "opacity 1s ease 0.7s"
    }
  }, SITE.tagline));
}
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function Carousel() {
  const speed = 3,
    hold = 0.8,
    turn = 0.8,
    ghost = 0.18,
    hoverScale = 1.16;
  const base = SITE.carousel.map(slug => SITE.projects.find(p => p.slug === slug)).filter(Boolean);
  const list = React.useMemo(() => {
    const out = [];
    while (out.length < 12) out.push(...base);
    return out;
  }, []);
  const n = list.length;
  const step = 360 / n;
  const rootRef = React.useRef(null);
  const ringRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const [size, setSize] = React.useState({
    w: 1200,
    h: 760
  });
  const [hovered, setHovered] = React.useState(null);
  const hoveredRef = React.useRef(null);
  hoveredRef.current = hovered;
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const {
        width,
        height
      } = e.contentRect;
      if (width > 0 && height > 0) setSize({
        w: width,
        h: height
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const narrow = size.w < 600;
  const cardH = Math.min(size.h * (narrow ? 0.46 : 0.56), size.w * 0.72 / 0.75);
  const cardW = cardH * 0.75;
  const radius = cardW * 1.15 / (2 * Math.tan(Math.PI / n));
  const persp = radius * 1.7;
  React.useEffect(() => {
    let raf = 0,
      last = 0,
      tv = 0,
      mult = 1;
    const period = hold + turn;
    const angleAt = t => {
      const k = Math.floor(t / period);
      const f = Math.min(1, Math.max(0, (t - k * period - hold) / turn));
      return -(speed * t + (step - speed * period) * (k + ease(f)));
    };
    const apply = angle => {
      if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateX(-7deg) rotateY(${angle}deg)`;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const cos = Math.cos((i * step + angle) * (Math.PI / 180));
        const front = Math.min(1, Math.max(0, (cos - 0.9) / 0.1));
        const back = Math.min(1, Math.max(0, (-cos - 0.35) / 0.35));
        c.style.opacity = String(Math.max(front, ghost * back));
        c.style.pointerEvents = front > 0.5 ? "auto" : "none";
        c.querySelectorAll("[data-face]").forEach(f => {
          f.style.visibility = f.dataset.face === "back" === cos < 0 ? "visible" : "hidden";
        });
      });
    };
    apply(0);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const tick = t => {
      const dt = last ? Math.min(64, t - last) / 1000 : 0;
      last = t;
      mult += ((hoveredRef.current === null ? 1 : 0) - mult) * Math.min(1, dt * 6);
      tv += dt * mult;
      apply(angleAt(tv));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n, step, radius]);
  return React.createElement("div", {
    ref: rootRef,
    className: "carousel-wrap",
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: narrow ? "10%" : "4%",
      width: "100%",
      height: "100%",
      perspective: persp,
      perspectiveOrigin: "50% 20%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, React.createElement("div", {
    ref: ringRef,
    style: {
      position: "relative",
      width: cardW,
      height: cardH,
      transformStyle: "preserve-3d"
    }
  }, list.map((p, i) => {
    const face = back => React.createElement("div", {
      "data-face": back ? "back" : "front",
      style: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "var(--line)",
        transform: back ? "scaleX(-1)" : "none",
        visibility: back ? "hidden" : "visible"
      }
    }, React.createElement("img", {
      src: IMG + p.cover,
      alt: back ? "" : p.title,
      draggable: false,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }));
    return React.createElement("div", {
      key: i,
      ref: el => {
        cardRefs.current[i] = el;
      },
      title: p.title,
      onMouseEnter: () => setHovered(i),
      onMouseLeave: () => setHovered(null),
      style: {
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
        cursor: "pointer",
        pointerEvents: "auto"
      }
    }, React.createElement("a", {
      href: projectUrl(p.slug),
      "aria-label": p.title,
      style: {
        display: "block",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d"
      }
    }, React.createElement("div", {
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        transform: `scale(${hovered === i ? hoverScale : 1})`,
        transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }, face(false), face(true))));
  }))));
}
function SiteHeader() {
  return React.createElement("header", {
    className: "site-header"
  }, React.createElement("p", {
    className: "tag"
  }, "Graphic designer based in Korea,", React.createElement("br", null), "working across brand, editorial and posters."), React.createElement("a", {
    href: "/",
    className: "brand"
  }, React.createElement("span", {
    "aria-hidden": true
  }, "\u2726"), " ", SITE.name), React.createElement("nav", null, React.createElement("a", {
    href: "/work/"
  }, "Work"), React.createElement("a", {
    href: "/about/"
  }, "About"), React.createElement("a", {
    href: SITE.behance,
    target: "_blank",
    rel: "noopener"
  }, "Behance")));
}
function Profile({
  tight = false
}) {
  const p = SITE.profile;
  return React.createElement("section", {
    className: "profile" + (tight ? " tight" : "")
  }, React.createElement("p", {
    className: "label"
  }, "(Profile)"), React.createElement("p", {
    className: "statement"
  }, "Hi, I\u2019m ", React.createElement("em", null, "Ahn Yu Lim"), " \u2014 a graphic designer who loves\xA0to\xA0learn. ", React.createElement("span", {
    className: "tail"
  }, "Always a step beyond yesterday.")), React.createElement("p", {
    className: "korean-line pre"
  }, p.koreanLine), React.createElement("div", {
    className: "intro-grid"
  }, React.createElement("div", {
    className: "intro-info"
  }, React.createElement("div", {
    className: "who"
  }, React.createElement("span", null, SITE.name), React.createElement("span", {
    className: "muted"
  }, p.role)), React.createElement("p", {
    className: "about pre"
  }, p.intro), React.createElement("span", {
    className: "available"
  }, "Available for freelance work"), React.createElement("a", {
    className: "btn",
    href: SITE.behance,
    target: "_blank",
    rel: "noopener"
  }, "Get in touch \u2197")), React.createElement("div", {
    className: "photo"
  }, React.createElement("img", {
    src: IMG + p.photo,
    alt: SITE.name
  })), React.createElement("div", {
    className: "lists"
  }, React.createElement("div", null, React.createElement("h4", null, "Capabilities"), React.createElement("ul", null, p.capabilities.map(c => React.createElement("li", {
    key: c
  }, c)))), React.createElement("div", null, React.createElement("h4", null, "Tools"), React.createElement("ul", null, p.tools.map(c => React.createElement("li", {
    key: c
  }, c)))))), React.createElement("div", {
    className: "row"
  }, React.createElement("h3", null, "Experience"), React.createElement("div", {
    className: "entries"
  }, p.experience.map(e => React.createElement("div", {
    key: e.role
  }, React.createElement("span", null, e.role), React.createElement("span", null, e.company), React.createElement("span", {
    className: "period"
  }, e.period))))), React.createElement("div", {
    className: "row"
  }, React.createElement("h3", null, "What I do"), React.createElement("div", {
    className: "services"
  }, p.services.map(s => React.createElement("div", {
    key: s.name
  }, React.createElement("span", null, s.name), React.createElement("span", {
    className: "desc pre"
  }, s.desc), React.createElement("span", {
    className: "work"
  }, s.work))))), React.createElement("div", {
    className: "row reach"
  }, React.createElement("h3", null, "Reach out"), React.createElement("div", null, React.createElement("a", {
    href: SITE.behance,
    target: "_blank",
    rel: "noopener"
  }, "Let\u2019s work together \u2197"), React.createElement("p", null, "Find more work and get in touch on Behance."))));
}
function Card({
  p
}) {
  return React.createElement("a", {
    className: "card",
    href: projectUrl(p.slug)
  }, React.createElement("div", {
    className: "cover"
  }, React.createElement("img", {
    src: IMG + p.cover,
    alt: p.title,
    loading: "lazy"
  })), React.createElement("div", {
    className: "cap"
  }, React.createElement("span", null, p.title), React.createElement("span", {
    className: "f"
  }, p.field)));
}
function HomePage() {
  return React.createElement(React.Fragment, null, React.createElement(Hero, null), React.createElement(Carousel, null), React.createElement(Profile, null));
}
function WorkPage() {
  return React.createElement(React.Fragment, null, React.createElement(SiteHeader, null), React.createElement("main", {
    className: "work-page"
  }, React.createElement("div", {
    className: "work-head"
  }, React.createElement("h1", null, "Selected Works", React.createElement("sup", null, "(", SITE.projects.length, ")")), React.createElement("span", {
    className: "cats"
  }, "Brand \xB7 Packaging \xB7 Editorial \xB7 Poster")), React.createElement("div", {
    className: "grid"
  }, SITE.projects.map(p => React.createElement(Card, {
    key: p.slug,
    p: p
  })))));
}
function ProjectPage({
  slug
}) {
  const p = SITE.projects.find(x => x.slug === slug);
  const Guide = p.guide ? window.Guides?.[p.guide] : null;
  const others = SITE.projects.filter(x => x.slug !== slug);
  return React.createElement(React.Fragment, null, React.createElement(SiteHeader, null), React.createElement("main", null, React.createElement("section", {
    className: "proj-head"
  }, React.createElement("a", {
    className: "back",
    href: "/work/"
  }, "\u2190 All projects"), React.createElement("h1", null, p.title, React.createElement("sup", null, p.year)), React.createElement("p", {
    className: "proj-intro pre"
  }, p.intro), React.createElement("div", {
    className: "meta"
  }, React.createElement("div", null, React.createElement("span", null, "Field"), p.field), React.createElement("div", null, React.createElement("span", null, "Deliverable"), p.deliverable))), Guide && React.createElement(Guide, null), p.body.length > 0 && React.createElement("div", {
    className: "body-imgs"
  }, p.body.map(([src, w, h], i) => React.createElement("img", {
    key: src,
    src: IMG + src,
    width: w,
    height: h,
    alt: `${p.title} ${i + 1}`,
    loading: i < 2 ? "eager" : "lazy"
  }))), p.behance && React.createElement("p", {
    className: "behance"
  }, React.createElement("a", {
    href: p.behance,
    target: "_blank",
    rel: "noopener"
  }, "View on Behance \u2197")), React.createElement("section", {
    className: "others"
  }, React.createElement("div", {
    className: "others-head"
  }, React.createElement("h2", null, "Other projects"), React.createElement("a", {
    href: "/work/"
  }, "All works \u2192")), React.createElement("div", {
    className: "grid"
  }, others.map(o => React.createElement(Card, {
    key: o.slug,
    p: o
  }))))));
}
function AboutPage() {
  return React.createElement(React.Fragment, null, React.createElement(SiteHeader, null), React.createElement(Profile, {
    tight: true
  }));
}
function App() {
  const page = window.PAGE;
  if (page.type === "work") return React.createElement(WorkPage, null);
  if (page.type === "about") return React.createElement(AboutPage, null);
  if (page.type === "project") return React.createElement(ProjectPage, {
    slug: page.slug
  });
  return React.createElement(HomePage, null);
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));})();
