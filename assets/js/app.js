(function () {
const kindOf = p => p.kind || "company";
const contributionOf = p => p.contribution ?? 100;
const KIND_LABEL = {
  company: "Company Project · ABBG",
  personal: "Personal Project"
};
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
const COUNTER = "https://abacus.jasoncameron.dev";
const COUNTER_KEY = "designerayr.com/visits";
const safe = (f, fallback) => {
  try {
    return f();
  } catch {
    return fallback;
  }
};
function useVisits() {
  const [n, setN] = React.useState(null);
  React.useEffect(() => {
    const q = new URLSearchParams(location.search).get("owner");
    if (q === "on") safe(() => localStorage.setItem("ayr-owner", "1"), undefined);
    if (q === "off") safe(() => localStorage.removeItem("ayr-owner"), undefined);
    const owner = safe(() => localStorage.getItem("ayr-owner") === "1", false);
    const live = /(^|\.)designerayr\.com$/.test(location.hostname);
    const counted = safe(() => sessionStorage.getItem("ayr-counted") === "1", false);
    const hit = live && !owner && !counted;
    fetch(`${COUNTER}/${hit ? "hit" : "get"}/${COUNTER_KEY}`).then(r => r.ok ? r.json() : r.status === 404 ? {
      value: 0
    } : Promise.reject(r.status)).then(d => {
      if (typeof d.value === "number") setN(d.value);
      if (hit) safe(() => sessionStorage.setItem("ayr-counted", "1"), undefined);
    }).catch(() => setN(null));
  }, []);
  return n;
}
function VisitCount({
  style
}) {
  const n = useVisits();
  if (n === null) return null;
  return React.createElement("span", {
    className: "visits",
    style: style,
    title: "Visitors"
  }, "Visitors ", n.toLocaleString("en-US"));
}
function HomeMain() {
  const {
    title,
    name,
    role
  } = SITE.hero;
  const time = useSeoulTime();
  const base = SITE.carousel.map(slug => SITE.projects.find(p => p.slug === slug)).filter(Boolean);
  const stageRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const [size, setSize] = React.useState({
    w: 1200,
    h: 520
  });
  const [hovered, setHovered] = React.useState(null);
  const hoveredRef = React.useRef(null);
  hoveredRef.current = hovered;
  const movedRef = React.useRef(false);
  React.useEffect(() => {
    const el = stageRef.current;
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
  const cardH = Math.round(Math.min(size.h * (narrow ? 0.5 : 0.56), narrow ? 240 : 320));
  const cardW = Math.round(cardH * 0.82);
  const gap = narrow ? 8 : 12;
  const pitch = cardW + gap;
  const reps = Math.max(2, Math.ceil(size.w * 2.2 / (pitch * base.length)));
  const list = React.useMemo(() => {
    const out = [];
    for (let r = 0; r < reps; r++) out.push(...base);
    return out;
  }, [reps]);
  const total = list.length * pitch;
  React.useEffect(() => {
    const W = size.w;
    const persp = W * (narrow ? 1.1 : 0.85);
    const s0 = W * (narrow ? 0.34 : 0.48);
    const R = W * (narrow ? 0.74 : 0.56);
    const maxT = 1.5;
    const drift = narrow ? -48 : -64;
    let raf = 0,
      last = 0,
      x = 0,
      v = drift;
    let dragging = false,
      px = 0,
      pt = 0,
      scrollY = window.scrollY;
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const apply = () => {
      list.forEach((_, i) => {
        const c = cardRefs.current[i];
        if (!c) return;
        const s = ((i * pitch + x) % total + total) % total - pitch * 2 + cardW / 2;
        const t = Math.max(0, (s - s0) / R);
        const cx = t > 0 ? s0 + R * Math.sin(t) : s;
        const z = t > 0 ? R * (1 - Math.cos(t)) : 0;
        c.style.transform = `translate3d(${cx - cardW / 2}px, 0, ${z}px) rotateY(${-t * 180 / Math.PI}deg)`;
        c.style.visibility = s < -pitch || t > maxT || z > persp * 0.8 ? "hidden" : "visible";
      });
    };
    const tick = t => {
      const dt = last ? Math.min(64, t - last) / 1000 : 0;
      last = t;
      if (!dragging) {
        const target = hoveredRef.current !== null || reduce ? 0 : drift;
        v += (target - v) * Math.min(1, dt * 2.4);
        x += v * dt;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    const el = stageRef.current;
    const down = e => {
      dragging = true;
      movedRef.current = false;
      px = e.clientX;
      pt = performance.now();
    };
    const move = e => {
      if (!dragging) return;
      const now = performance.now(),
        dx = e.clientX - px;
      if (Math.abs(dx) > 4) movedRef.current = true;
      x += dx;
      v = v * 0.4 + dx / Math.max(1, now - pt) * 1000 * 0.6;
      px = e.clientX;
      pt = now;
    };
    const up = () => {
      dragging = false;
    };
    const wheel = e => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        x -= e.deltaX;
        v -= e.deltaX * 8;
      }
    };
    const scroll = () => {
      const dy = window.scrollY - scrollY;
      scrollY = window.scrollY;
      v -= Math.max(-80, Math.min(80, dy)) * 12;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, {
      passive: true
    });
    window.addEventListener("scroll", scroll, {
      passive: true
    });
    apply();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
      window.removeEventListener("scroll", scroll);
    };
  }, [size.w, narrow, pitch, total, list, cardW]);
  const cap = s => s.toLowerCase().replace(/\b\w/g, m => m.toUpperCase());
  return React.createElement("section", {
    className: "home-main"
  }, React.createElement("header", {
    className: "hm-bar"
  }, React.createElement("p", {
    className: "hm-name"
  }, React.createElement("span", null, cap(name)), " ", React.createElement("span", {
    className: "muted"
  }, role)), React.createElement("p", {
    className: "hm-mid"
  }, "Seoul ", time), React.createElement("nav", {
    className: "hm-nav"
  }, React.createElement("a", {
    href: "/work/"
  }, "Work"), React.createElement("a", {
    href: "/about/",
    className: "muted"
  }, "About"), React.createElement(VisitCount, null))), React.createElement("div", {
    ref: stageRef,
    className: "hm-stage",
    onClickCapture: e => {
      if (movedRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    style: {
      perspective: Math.round(size.w * (narrow ? 1.1 : 0.85)),
      perspectiveOrigin: "50% 50%"
    }
  }, React.createElement("div", {
    className: "hm-track",
    style: {
      height: cardH,
      marginTop: -cardH / 2
    }
  }, list.map((p, i) => React.createElement("a", {
    key: i,
    ref: el => {
      cardRefs.current[i] = el;
    },
    href: projectUrl(p.slug),
    "aria-label": p.title,
    draggable: false,
    className: "hm-card" + (hovered === i ? " on" : ""),
    onMouseEnter: () => setHovered(i),
    onMouseLeave: () => setHovered(null),
    style: {
      width: cardW,
      height: cardH
    }
  }, React.createElement("img", {
    src: IMG + p.cover,
    alt: "",
    draggable: false
  }), React.createElement("span", {
    className: "hm-cap"
  }, React.createElement("b", null, p.title), React.createElement("span", null, p.field), React.createElement("span", null, p.year)))))), React.createElement("footer", {
    className: "hm-foot"
  }, React.createElement("p", {
    className: "hm-line"
  }, React.createElement("span", null, cap(title), "."), " ", React.createElement("span", {
    className: "muted"
  }, "Scroll or drag to browse, click a frame to open it.")), React.createElement("a", {
    className: "hm-count",
    href: "/work/"
  }, "Selected Works (", String(base.length).padStart(2, "0"), ")")));
}
function SiteHeader() {
  return React.createElement("header", {
    className: "site-header"
  }, React.createElement("p", {
    className: "tag"
  }, "Graphic designer based in Korea,", React.createElement("br", null), "working across brand identity and posters."), React.createElement("a", {
    href: "/",
    className: "brand"
  }, React.createElement("span", {
    "aria-hidden": true
  }, "\u2726"), " ", SITE.name), React.createElement("nav", null, React.createElement("a", {
    href: "/work/"
  }, "Work"), React.createElement("a", {
    href: "/about/"
  }, "About"), React.createElement(VisitCount, null)));
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
  }, "Available for freelance work")), React.createElement("div", {
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
  }, s.work))))));
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
  }, p.field)), React.createElement("div", {
    className: "kind"
  }, React.createElement("span", {
    className: `dot ${kindOf(p)}`
  }), kindOf(p) === "company" ? "ABBG" : "Personal", " \xB7 ", contributionOf(p), "%"));
}
function HomePage() {
  return React.createElement(React.Fragment, null, React.createElement(HomeMain, null), React.createElement(Profile, null));
}
function WorkPage() {
  const read = () => {
    const h = location.hash.slice(1);
    return h === "company" || h === "personal" ? h : "all";
  };
  const [tab, setTab] = React.useState(read);
  React.useEffect(() => {
    const on = () => setTab(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const count = k => SITE.projects.filter(p => k === "all" || kindOf(p) === k).length;
  const shown = SITE.projects.filter(p => tab === "all" || kindOf(p) === tab);
  const tabs = [["all", "All"], ["company", "Company · ABBG"], ["personal", "Personal"]];
  return React.createElement(React.Fragment, null, React.createElement(SiteHeader, null), React.createElement("main", {
    className: "work-page"
  }, React.createElement("div", {
    className: "work-head"
  }, React.createElement("h1", null, "Selected Works", React.createElement("sup", null, "(", shown.length, ")")), React.createElement("div", {
    className: "work-tabs",
    role: "tablist"
  }, tabs.map(([k, label]) => React.createElement("a", {
    key: k,
    role: "tab",
    "aria-selected": tab === k,
    className: tab === k ? "on" : "",
    href: k === "all" ? "#" : `#${k}`,
    onClick: e => {
      e.preventDefault();
      history.replaceState(null, "", k === "all" ? location.pathname : `#${k}`);
      setTab(k);
    }
  }, label, React.createElement("sup", null, count(k)))))), React.createElement("div", {
    className: "grid"
  }, shown.map(p => React.createElement(Card, {
    key: p.slug,
    p: p
  })))));
}
function ProjectHead({
  p
}) {
  const c = p.client;
  const logo = c && c.logo ? c.mask ? React.createElement("span", {
    role: "img",
    "aria-label": c.name,
    className: "ph-logo",
    style: {
      aspectRatio: `${c.ratio || 4}`,
      background: c.mask,
      WebkitMaskImage: `url(${IMG}${c.logo})`,
      maskImage: `url(${IMG}${c.logo})`
    }
  }) : React.createElement("img", {
    className: "ph-logo",
    src: IMG + c.logo,
    alt: c.name,
    style: {
      aspectRatio: `${c.ratio || 4}`
    }
  }) : null;
  const pct = contributionOf(p);
  const rows = [];
  rows.push(["Project", React.createElement("span", {
    className: `ph-kind ${kindOf(p)}`
  }, KIND_LABEL[kindOf(p)])]);
  rows.push(["Contribution", React.createElement("span", {
    className: "ph-contrib"
  }, React.createElement("b", null, pct, "%"), React.createElement("i", null, React.createElement("em", {
    style: {
      width: `${pct}%`
    }
  })))]);
  if (c) rows.push(["Client", React.createElement(React.Fragment, null, logo, React.createElement("span", null, c.name))]);
  rows.push(["Field", p.field], ["Deliverable", p.deliverable]);
  (p.facts || []).forEach(f => rows.push(f));
  rows.push(["Year", p.year]);
  return React.createElement("section", {
    className: "proj-head"
  }, React.createElement("a", {
    className: "back",
    href: "/work/"
  }, "\u2190 All projects"), React.createElement("div", {
    className: "ph-grid"
  }, React.createElement("div", null, React.createElement("h1", null, p.title), React.createElement("p", {
    className: "ph-lede pre"
  }, p.intro)), React.createElement("dl", {
    className: "ph-facts"
  }, rows.map(([k, v]) => React.createElement("div", {
    key: k
  }, React.createElement("dt", null, k), React.createElement("dd", null, v))))));
}
function ProjectPage({
  slug
}) {
  const p = SITE.projects.find(x => x.slug === slug);
  const Guide = p.guide ? window.Guides?.[p.guide] : null;
  const others = SITE.projects.filter(x => x.slug !== slug);
  return React.createElement(React.Fragment, null, React.createElement(SiteHeader, null), React.createElement("main", null, React.createElement(ProjectHead, {
    p: p
  }), Guide && React.createElement(Guide, null), p.body.length > 0 && React.createElement("div", {
    className: "body-imgs"
  }, p.body.map(([src, w, h], i) => React.createElement("img", {
    key: src,
    src: IMG + src,
    width: w,
    height: h,
    alt: `${p.title} ${i + 1}`,
    loading: i < 2 ? "eager" : "lazy"
  }))), React.createElement("section", {
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
