(function () {
const addPropertyControls = () => {}; const ControlType = new Proxy({}, { get: (_, k) => k });
const IMG = "/assets/img/";
const INSTAGRAM = "https://www.instagram.com/laserin_swim/";
const C = {
  ink: "#111014",
  lilac: "#C9C3F4",
  violet: "#5B4FD8",
  line: "rgba(255,255,255,0.14)",
  muted: "rgba(255,255,255,0.55)"
};
const SANS = '"Inter Display", "Inter", "Pretendard", system-ui, sans-serif';
const SETS = [{
  n: "01",
  product: "Lumina 루미나",
  title: "Keep It Simple, Let It Shine!",
  tint: "#EAF2FB",
  notes: ["루미나 다섯 가지 컬러를 한 장에 모은 컬러 소개", "모델 컷 위에 손글씨 타이틀을 겹친 화보형 콘텐츠", "Find your color, own your mood"],
  files: ["ls-01", "ls-02", "ls-03"]
}, {
  n: "02",
  product: "Yunseul 윤슬",
  title: "Which Shimmer is Yours?",
  tint: "#E8F3FB",
  notes: ["선셋과 에메랄드, 두 가지 윤슬 컬러를 비교하는 질문형 커버", "컬러마다 디테일 컷을 콜라주로 배치"],
  files: ["ls-04", "ls-05", "ls-06"]
}, {
  n: "03",
  product: "Tweedy 트위디",
  title: "Stay Romantic — A new mood on the water",
  tint: "#F7EEF5",
  notes: ["우표 프레임 안에 네 가지 컬러를 담은 커버", "체크와 웨이브, 패턴별로 나눈 착용 컷"],
  files: ["ls-07", "ls-08", "ls-09"]
}, {
  n: "04",
  product: "Raina 레이나",
  title: "Sunset Coral · Blush Pink · Ice Blue",
  tint: "#FBEEE6",
  notes: ["컬러마다 배경 톤을 맞춘 단색 화보", "뒷모습 디테일 컷을 작은 프레임으로 더함"],
  files: ["ls-10", "ls-11", "ls-12"]
}, {
  n: "05",
  product: "Glit 글리트",
  title: "Berry Matcha · Ice Mocha · Charcol Velvet",
  tint: "#F1EEF3",
  notes: ["컬러 이름에 맞춘 오브젝트와 손그림 아이콘", "제품 컷을 스티커처럼 붙여 착용 컷과 함께 보여줌"],
  files: ["ls-13", "ls-14", "ls-15"]
}];
const TONES = [{
  bg: "#F5F0DC",
  accent: "#A68A2A",
  ink: "#3A3424",
  line: "rgba(58,52,36,0.18)"
}, {
  bg: "#E2EEF6",
  accent: "#3D86B8",
  ink: "#22384A",
  line: "rgba(34,56,74,0.16)"
}, {
  bg: "#F0E6F2",
  accent: "#9C4A8B",
  ink: "#3B2438",
  line: "rgba(59,36,56,0.16)"
}, {
  bg: "#FAE7DC",
  accent: "#D0623F",
  ink: "#4A2A20",
  line: "rgba(74,42,32,0.16)"
}, {
  bg: "#E6EDE1",
  accent: "#5D7D4D",
  ink: "#2A3524",
  line: "rgba(42,53,36,0.16)"
}];
const ALL = SETS.flatMap(s => s.files);
function useInView(threshold = 0.2) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}
function Reveal({
  children,
  delay = 0,
  style
}) {
  const [ref, seen] = useInView(0.15);
  return React.createElement("div", {
    ref: ref,
    style: {
      ...style,
      opacity: seen ? 1 : 0,
      transform: `translateY(${seen ? 0 : 30}px)`,
      transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
    }
  }, children);
}
function Card({
  file,
  alt,
  shadow = true,
  radius = 6
}) {
  return React.createElement("img", {
    src: `${IMG}${file}.jpg`,
    alt: alt,
    loading: "lazy",
    draggable: false,
    style: {
      width: "100%",
      aspectRatio: "4 / 5",
      objectFit: "cover",
      display: "block",
      borderRadius: radius,
      boxShadow: shadow ? "0 24px 60px rgba(17,16,20,0.18)" : "none"
    }
  });
}
function Phone({
  file,
  width
}) {
  return React.createElement("div", {
    style: {
      width,
      background: "#fff",
      borderRadius: 34,
      padding: "14px 10px 18px",
      boxShadow: "0 30px 70px rgba(17,16,20,0.22)",
      border: "1px solid rgba(17,16,20,0.08)"
    }
  }, React.createElement("div", {
    style: {
      width: "34%",
      height: 6,
      margin: "0 auto 12px",
      borderRadius: 6,
      background: "#E6E3EE"
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 4px 10px",
      fontFamily: SANS,
      fontSize: 11,
      color: C.ink
    }
  }, React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: C.lilac
    }
  }), React.createElement("span", {
    style: {
      fontWeight: 600,
      letterSpacing: "0.02em"
    }
  }, "laserin_swim")), React.createElement("img", {
    src: `${IMG}${file}.jpg`,
    alt: "",
    loading: "lazy",
    draggable: false,
    style: {
      width: "100%",
      aspectRatio: "4 / 5",
      objectFit: "cover",
      display: "block"
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      padding: "10px 4px 0"
    }
  }, [0, 1, 2].map(i => React.createElement("div", {
    key: i,
    style: {
      width: 16,
      height: 16,
      borderRadius: i === 2 ? 3 : "50%",
      border: `1.5px solid ${C.ink}`
    }
  }))), React.createElement("div", {
    style: {
      padding: "8px 4px 0",
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, React.createElement("div", {
    style: {
      width: "62%",
      height: 6,
      borderRadius: 6,
      background: "#E6E3EE"
    }
  }), React.createElement("div", {
    style: {
      width: "40%",
      height: 6,
      borderRadius: 6,
      background: "#EEECF4"
    }
  })));
}
const PINK = "#D47097";
const WALL_CSS = `
@keyframes ls-up { from { transform: translateY(0) } to { transform: translateY(-50%) } }
@keyframes ls-down { from { transform: translateY(-50%) } to { transform: translateY(0) } }
@keyframes ls-cover-out { 0%, 78% { transform: translateY(0); filter: blur(0) } 100% { transform: translateY(-104%); filter: blur(6px) } }
@keyframes ls-cover-in { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: translateY(0) } }
@keyframes ls-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@media (prefers-reduced-motion: reduce) { .ls-intro * { animation: none !important } .ls-cover { display: none } }
`;
function Wordmark({
  width,
  color
}) {
  return React.createElement("div", {
    role: "img",
    "aria-label": "LASERIN",
    style: {
      width,
      aspectRatio: "1020 / 264",
      background: color,
      WebkitMaskImage: `url(${IMG}laserin-word.png)`,
      maskImage: `url(${IMG}laserin-word.png)`,
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat"
    }
  });
}
function Wall({
  files,
  w,
  m
}) {
  const cols = m ? 3 : 5;
  const h = m ? Math.round(w * 1.2) : Math.min(820, Math.round(w * 0.56));
  const columns = Array.from({
    length: cols
  }, (_, c) => {
    const list = files.map((_, i) => files[(i * 2 + c * 4) % files.length]);
    return [...list, ...list];
  });
  const cover = 3.2;
  return React.createElement("div", {
    className: "ls-intro",
    style: {
      position: "relative",
      height: h,
      overflow: "hidden",
      background: "#F7EEF3"
    }
  }, React.createElement("style", null, WALL_CSS), React.createElement("div", {
    style: {
      position: "absolute",
      left: "-12%",
      right: "-12%",
      top: "-30%",
      bottom: "-30%",
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: m ? 8 : 16,
      transform: "rotate(-8deg)"
    }
  }, columns.map((list, c) => React.createElement("div", {
    key: c,
    style: {
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: m ? 8 : 16,
      animation: `${c % 2 ? "ls-down" : "ls-up"} ${46 + c * 6}s linear infinite`
    }
  }, list.map((f, i) => React.createElement("img", {
    key: i,
    src: `${IMG}${f}.jpg`,
    alt: "",
    draggable: false,
    style: {
      width: "100%",
      aspectRatio: "4 / 5",
      objectFit: "cover",
      display: "block",
      borderRadius: m ? 6 : 10
    }
  })))))), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse at center, rgba(247,238,243,0.86) 0, rgba(247,238,243,0.55) 26%, rgba(247,238,243,0) 58%)"
    }
  }), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: m ? 10 : 16,
      animation: "ls-bob 5s ease-in-out infinite"
    }
  }, React.createElement(Wordmark, {
    width: m ? "62%" : "34%",
    color: PINK
  }), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: m ? 11 : 13,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: PINK
    }
  }, "Instagram Contents")), React.createElement("div", {
    className: "ls-cover",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: m ? 16 : Math.round(w * 0.016),
      background: "linear-gradient(180deg, #F3D7DE 0%, #E9E1EC 30%, #A9CFE3 52%, #E6DDE8 74%, #EBB9C8 100%)",
      animation: `ls-cover-out ${cover}s cubic-bezier(0.7, 0, 0.3, 1) both`
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
      backgroundSize: m ? "26px 34px" : "42px 52px"
    }
  }), React.createElement("div", {
    style: {
      position: "relative",
      animation: "ls-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both"
    }
  }, React.createElement(Wordmark, {
    width: m ? Math.round(w * 0.62) : Math.round(w * 0.36),
    color: PINK
  })), React.createElement("div", {
    style: {
      position: "relative",
      textAlign: "center",
      fontFamily: SANS,
      color: "#fff",
      textShadow: "0 1px 12px rgba(120,60,90,0.25)",
      animation: "ls-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both"
    }
  }, React.createElement("div", {
    style: {
      fontSize: m ? 16 : Math.min(26, Math.round(w * 0.017)),
      fontWeight: 700
    }
  }, "\uB77C\uC138\uB9B0 \uC778\uC2A4\uD0C0\uADF8\uB7A8 \uCF58\uD150\uCE20 \uC81C\uC791"), React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: m ? 11 : 13,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      opacity: 0.9
    }
  }, "LASERIN Swimwear \xB7 Feed Contents"))));
}
function LaserinContents() {
  const rootRef = React.useRef(null);
  const [w, setW] = React.useState(1440);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    setW(el.getBoundingClientRect().width || 1440);
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) setW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const m = w < 760;
  const pad = m ? 20 : Math.round(w * 0.04);
  const small = {
    fontFamily: SANS,
    fontSize: m ? 11 : 12,
    lineHeight: 1.65,
    letterSpacing: "0.01em"
  };
  return React.createElement("div", {
    ref: rootRef,
    style: {
      width: "100%",
      fontFamily: SANS
    }
  }, React.createElement(Wall, {
    files: ALL,
    w: w,
    m: m
  }), SETS.map((s, si) => {
    const [en, ...kr] = s.product.split(" ");
    const tone = TONES[si % TONES.length];
    const flip = si % 2 === 1;
    const lift = ["-7%", "6%", "-2%"];
    const nameBlock = React.createElement(Reveal, {
      style: {
        color: tone.ink,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: m ? 0 : "100%"
      }
    }, React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: '"Instrument Serif", "Times New Roman", serif',
        fontStyle: "italic",
        fontSize: m ? 72 : Math.min(176, Math.round(w * 0.11)),
        lineHeight: 0.86,
        letterSpacing: "-0.03em",
        color: tone.accent
      }
    }, en), React.createElement("div", {
      style: {
        ...small,
        marginTop: m ? 10 : 18,
        fontSize: m ? 12 : 13,
        letterSpacing: "0.18em"
      }
    }, kr.join(" ")), React.createElement("div", {
      style: {
        fontFamily: '"Instrument Serif", "Times New Roman", serif',
        fontSize: m ? 20 : Math.min(30, Math.round(w * 0.02)),
        lineHeight: 1.25,
        marginTop: m ? 22 : 40,
        maxWidth: 360
      }
    }, s.title)), React.createElement("ol", {
      style: {
        listStyle: "none",
        padding: 0,
        margin: m ? "22px 0 0" : "48px 0 0",
        borderTop: `1px solid ${tone.line}`
      }
    }, s.notes.map((t, i) => React.createElement("li", {
      key: t,
      style: {
        ...small,
        display: "grid",
        gridTemplateColumns: "28px 1fr",
        padding: "10px 0",
        borderBottom: `1px solid ${tone.line}`,
        wordBreak: "keep-all",
        color: tone.ink
      }
    }, React.createElement("span", {
      style: {
        opacity: 0.45
      }
    }, String(i + 1).padStart(2, "0")), t))));
    const posts = React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: m ? "1fr 1fr" : "1fr 1.25fr 1fr",
        gap: m ? 10 : Math.round(w * 0.016),
        alignItems: "center",
        padding: m ? 0 : "5% 0"
      }
    }, s.files.map((f, i) => React.createElement(Reveal, {
      key: f,
      delay: i * 0.12,
      style: {
        gridColumn: m && i === 1 ? "1 / -1" : undefined,
        gridRow: m && i === 1 ? 1 : undefined
      }
    }, React.createElement("figure", {
      style: {
        margin: 0,
        transform: m ? "none" : `translateY(${lift[i]})`
      }
    }, React.createElement(Card, {
      file: f,
      alt: `${s.product} ${i + 1}`,
      radius: 2
    }), React.createElement("figcaption", {
      style: {
        ...small,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 10,
        color: tone.ink,
        opacity: 0.6
      }
    }, React.createElement("span", null, en), React.createElement("span", null, String(i + 1).padStart(2, "0")))))));
    return React.createElement("section", {
      key: s.n,
      style: {
        position: "relative",
        background: tone.bg,
        padding: m ? "40px 20px 56px" : `${Math.round(w * 0.04)}px ${pad}px ${Math.round(w * 0.06)}px`,
        overflow: "hidden"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 14,
        marginBottom: m ? 28 : Math.round(w * 0.035),
        borderBottom: `1px solid ${tone.line}`
      }
    }, React.createElement(Wordmark, {
      width: m ? 76 : 96,
      color: tone.ink
    }), React.createElement("span", {
      style: {
        ...small,
        color: tone.ink,
        letterSpacing: "0.12em"
      }
    }, s.n, " / ", String(SETS.length).padStart(2, "0"))), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: m ? "1fr" : flip ? "2.1fr 1fr" : "1fr 2.1fr",
        gap: m ? 32 : Math.round(w * 0.05),
        alignItems: "stretch"
      }
    }, m || !flip ? React.createElement(React.Fragment, null, nameBlock, posts) : React.createElement(React.Fragment, null, posts, nameBlock)));
  }), React.createElement("section", {
    style: {
      background: C.ink,
      color: "#fff",
      padding: m ? "56px 20px" : `${Math.round(w * 0.06)}px ${pad}px`,
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr",
      gap: m ? 36 : pad * 1.5,
      alignItems: "center"
    }
  }, React.createElement(Reveal, null, React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: m ? 36 : Math.min(72, Math.round(w * 0.05)),
      lineHeight: 0.95,
      letterSpacing: "-0.035em",
      color: C.lilac
    }
  }, "Live on", React.createElement("br", null), "Instagram"), React.createElement("p", {
    style: {
      ...small,
      fontSize: m ? 12 : 13,
      color: C.muted,
      margin: "20px 0 0",
      maxWidth: 360,
      wordBreak: "keep-all"
    }
  }, "\uB77C\uC138\uB9B0 \uACF5\uC2DD \uC778\uC2A4\uD0C0\uADF8\uB7A8 \uD53C\uB4DC\uC5D0 \uC2E4\uC81C\uB85C \uC5C5\uB85C\uB4DC\uB41C \uD654\uBA74\uC785\uB2C8\uB2E4."), React.createElement("a", {
    href: INSTAGRAM,
    target: "_blank",
    rel: "noopener",
    style: {
      display: "inline-flex",
      gap: 6,
      marginTop: 24,
      ...small,
      fontSize: m ? 13 : 14,
      color: "#fff",
      borderBottom: `1px solid ${C.lilac}`,
      paddingBottom: 2
    }
  }, "@laserin_swim \u2197")), React.createElement(Reveal, {
    delay: 0.15,
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, React.createElement("div", {
    style: {
      width: m ? "78%" : Math.min(360, Math.round(w * 0.25)),
      background: "#000",
      borderRadius: 40,
      padding: 10,
      boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
      border: "1px solid rgba(255,255,255,0.12)"
    }
  }, React.createElement("img", {
    src: `${IMG}ls-feed.jpg`,
    alt: "The LASERIN Instagram profile feed",
    loading: "lazy",
    draggable: false,
    style: {
      width: "100%",
      display: "block",
      borderRadius: 30
    }
  })))), React.createElement("section", {
    style: {
      background: C.ink,
      color: "#fff",
      padding: m ? "0 20px 56px" : `0 ${pad}px ${Math.round(w * 0.06)}px`
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: m ? 3 : 6,
      maxWidth: 1000,
      margin: "0 auto"
    }
  }, [...ALL].reverse().map((f, i) => React.createElement(Reveal, {
    key: f,
    delay: i % 3 * 0.08
  }, React.createElement(Card, {
    file: f,
    alt: "",
    shadow: false,
    radius: 0
  }))))));
}(window.Guides = window.Guides || {}).LaserinContents = LaserinContents;
})();
(function () {
const addPropertyControls = () => {}; const ControlType = new Proxy({}, { get: (_, k) => k });
const IMG = "/assets/img/";
const PAGES = [{
  file: "mo-layout-1",
  ratio: "1920 / 6339.04",
  alt: "2D 모션 그래픽 입문 무료 특강 포스터와 리플렛"
}, {
  file: "mo-layout-2",
  ratio: "1920 / 2891.93",
  alt: "2D 모션 그래픽 입문 무료 특강 세로형 배너"
}];
const LAYERS = [{
  name: "mo-sit-1",
  page: 0,
  left: 52.3952,
  top: 3.0065,
  width: 15.6835,
  height: 6.4446
}, {
  name: "mo-sit-2",
  page: 0,
  left: 70.2656,
  top: 55.7987,
  width: 7.7083,
  height: 3.1692
}, {
  name: "mo-sit-3",
  page: 0,
  left: 80.4313,
  top: 27.7152,
  width: 10.6063,
  height: 4.3593
}, {
  name: "mo-sit-4",
  page: 1,
  left: 78.6744,
  top: 28.3703,
  width: 6.2085,
  height: 5.5915
}, {
  name: "mo-swing-5",
  page: 0,
  left: 40.4129,
  top: 66.2608,
  width: 26.6846,
  height: 6.759
}, {
  name: "mo-swing-6",
  page: 0,
  left: 64.5636,
  top: 0,
  width: 35.4364,
  height: 9.8169
}, {
  name: "mo-swing-7",
  page: 0,
  left: 21.8817,
  top: 42.5616,
  width: 54.6898,
  height: 7.8117
}, {
  name: "mo-dangle-1",
  page: 0,
  left: 62.5283,
  top: 68.9704,
  width: 15.0683,
  height: 6.7994
}, {
  name: "mo-dangle-2",
  page: 0,
  left: 1.6335,
  top: 59.6133,
  width: 21.061,
  height: 9.5026
}, {
  name: "mo-walk-1",
  page: 0,
  left: 63.8802,
  top: 78.2105,
  width: 34.7969,
  height: 4.9266
}];
function MotionLecture() {
  return React.createElement("div", {
    style: {
      width: "100%"
    }
  }, PAGES.map((p, i) => React.createElement("div", {
    key: p.file,
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: p.ratio,
      overflow: "hidden"
    }
  }, React.createElement("img", {
    src: `${IMG}${p.file}.jpg`,
    alt: p.alt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      display: "block"
    }
  }), LAYERS.filter(l => l.page === i).map(l => React.createElement("img", {
    key: l.name,
    src: `${IMG}mo-anim/${l.name}.svg`,
    alt: "",
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: `${l.left}%`,
      top: `${l.top}%`,
      width: `${l.width}%`,
      height: `${l.height}%`,
      display: "block"
    }
  })))));
}(window.Guides = window.Guides || {}).MotionLecture = MotionLecture;
})();
(function () {
const addPropertyControls = () => {}; const ControlType = new Proxy({}, { get: (_, k) => k });
const IMG = "/assets/img/";
const A = {
  wordmark: {
    red: IMG + "D3NaZsE2ifbXRjAjt0bBjryF53k.png",
    pink: IMG + "AF1OBblEz4VfIOErJAlgOWb0Y.png",
    black: IMG + "V74D00hRvOHYDxzLmAW7PhbaQDk.png"
  },
  script: {
    red: IMG + "nNEfqfe6u5ulTvxRHS4pROQy3WE.png",
    pink: IMG + "60lrqNA37x3PtFUPnRlgr8czlbg.png",
    black: IMG + "2YSCSNQsPgTBhEf1Ub4u0L1NUQ.png"
  },
  symLine: {
    red: IMG + "V86qc0EG4VuExCMqhTMR6nGHO4.png",
    pink: IMG + "dF6hib4GvgrBNoGiGIHq3RI5Sc.png",
    black: IMG + "GGeazH1SxB0LHEzAhKooct8EQ.png"
  },
  symSolid: {
    red: IMG + "PwDlNnzRqwqJOlc7wXbQBS4Ej0.png",
    pink: IMG + "PxhvnoYjQkumSFNII1IREq3Gww.png",
    black: IMG + "H9HB2EpJI4mEjhApTDfkjT44TE.png"
  }
};
const PHOTO = {
  platter: "/assets/img/om-platter.jpg",
  spread: "/assets/img/om-spread.jpg",
  office: "/assets/img/om-office.jpg",
  platter3: "/assets/img/om-platter3.jpg",
  team: "/assets/img/om-team.jpg"
};
const COLOR = {
  red: "#F91515",
  pink: "#FFDFD7",
  black: "#0A0203"
};
const SANS = '"Inter Display", "Inter", "Pretendard", system-ui, sans-serif';
const LOGO_RATIO = 2935 / 1070;
const CSS = `
@keyframes om-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes om-marquee-rev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
@keyframes om-spin { to { transform: rotate(360deg) } }
@keyframes om-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6%) } }
@keyframes om-split { 0%, 18% { transform: translateY(0) } 38%, 72% { transform: translateY(var(--om-gap)) } 92%, 100% { transform: translateY(0) } }
@keyframes om-label { 0%, 22% { opacity: 0 } 40%, 70% { opacity: 1 } 88%, 100% { opacity: 0 } }
`;
function useInView(threshold = 0.25) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}
function Reveal({
  children,
  delay = 0,
  style
}) {
  const [ref, seen] = useInView(0.2);
  return React.createElement("div", {
    ref: ref,
    style: {
      ...style,
      opacity: seen ? 1 : 0,
      transform: `translateY(${seen ? 0 : 28}px)`,
      transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
    }
  }, children);
}
function Ink({
  src,
  color,
  label,
  style
}) {
  return React.createElement("div", {
    role: label ? "img" : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      position: "absolute",
      inset: 0,
      background: color,
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      ...style
    }
  });
}
function Lockup({
  word,
  script,
  width,
  draw = true,
  delay = 0
}) {
  const [ref, seen] = useInView(0.3);
  const on = !draw || seen;
  const wipe = (d, dur) => ({
    clipPath: on ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
    transition: `clip-path ${dur}s cubic-bezier(0.65, 0, 0.35, 1) ${delay + d}s`
  });
  return React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      width,
      aspectRatio: `${LOGO_RATIO}`
    }
  }, React.createElement(Ink, {
    src: A.wordmark[word],
    color: COLOR[word],
    label: "tandanji",
    style: wipe(0, 1.4)
  }), React.createElement(Ink, {
    src: A.script[script],
    color: COLOR[script],
    label: "office meal",
    style: wipe(0.75, 1.3)
  }));
}
function Symbol({
  tone,
  solid,
  size,
  style
}) {
  return React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      ...style
    }
  }, React.createElement(Ink, {
    src: (solid ? A.symSolid : A.symLine)[tone],
    color: COLOR[tone],
    label: "O symbol"
  }));
}
function Photo({
  src,
  alt,
  shade = 0,
  position = "50% 50%",
  still = false
}) {
  const [ref, inView] = useInView(0.2);
  const seen = still || inView;
  return React.createElement("div", {
    ref: ref,
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden"
    }
  }, React.createElement("img", {
    src: src,
    alt: alt,
    loading: "lazy",
    draggable: false,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: position,
      display: "block",
      transform: seen ? "scale(1)" : "scale(1.08)",
      transition: "transform 2.4s cubic-bezier(0.16, 1, 0.3, 1)"
    }
  }), shade > 0 && React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `rgba(0,0,0,${shade})`
    }
  }));
}
function SlideTitle({
  title,
  lines,
  color,
  m
}) {
  return React.createElement("div", {
    style: {
      position: "absolute",
      top: m ? 22 : "5.5%",
      left: m ? 20 : "4%",
      maxWidth: m ? "78%" : 320,
      zIndex: 3,
      fontFamily: SANS,
      color
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      textDecoration: "underline",
      textUnderlineOffset: 3,
      marginBottom: lines ? 10 : 0
    }
  }, title), lines && lines.map((l, i) => React.createElement("div", {
    key: i,
    style: {
      fontSize: 11,
      lineHeight: 1.6,
      opacity: 0.7,
      wordBreak: "keep-all"
    }
  }, l)));
}
function Slide({
  bg,
  color,
  title,
  lines,
  m,
  children
}) {
  return React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: m ? "4 / 5" : "16 / 9",
      background: bg,
      color,
      overflow: "hidden"
    }
  }, title && React.createElement(SlideTitle, {
    title: title,
    lines: lines,
    color: color,
    m: m
  }), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, children));
}
function ColorDot({
  c,
  size,
  m,
  delay
}) {
  const [on, setOn] = React.useState(false);
  return React.createElement(Reveal, {
    delay: delay,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: m ? 10 : 18,
      width: size
    }
  }, React.createElement("div", {
    onMouseEnter: () => setOn(true),
    onMouseLeave: () => setOn(false),
    style: {
      width: "100%",
      aspectRatio: "1",
      borderRadius: "50%",
      background: c.hex,
      transform: on ? "scale(1.08)" : "scale(1)",
      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
    }
  }), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      lineHeight: 1.6,
      textAlign: "center",
      color: COLOR.black
    }
  }, React.createElement("div", null, c.name), React.createElement("div", {
    style: {
      opacity: 0.6
    }
  }, c.hex), React.createElement("div", {
    style: {
      opacity: on ? 0.6 : 0,
      transition: "opacity 0.4s ease",
      whiteSpace: "nowrap"
    }
  }, "PANTONE ", c.pantone, " \xB7 RGB ", c.rgb, " \xB7 CMYK ", c.cmyk)));
}
function OfficeMealGuideline(props) {
  const rootRef = React.useRef(null);
  const [w, setW] = React.useState(1440);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) setW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const m = w < 760;
  const pad = m ? 20 : Math.round(w * 0.04);
  const small = {
    fontFamily: SANS,
    fontSize: 11,
    lineHeight: 1.6
  };
  const colors = [{
    name: "Office meal red",
    pantone: "2347 C",
    rgb: "249 21 21",
    cmyk: "0 94 100 0",
    hex: "#F91515"
  }, {
    name: "Office meal pink beige",
    pantone: "698 C",
    rgb: "255 223 215",
    cmyk: "0 15 3 0",
    hex: "#FFDFD7"
  }, {
    name: "Office meal black",
    pantone: "Black 6 C",
    rgb: "10 2 3",
    cmyk: "100 61 32 96",
    hex: "#0A0203"
  }];
  const bandH = m ? 24 : 36;
  const bandCount = Math.ceil(w / (bandH * 4.1) / 2) * 2 + 2;
  const marqueeItem = (word, script, sym, h, key) => React.createElement("div", {
    key: key,
    style: {
      display: "flex",
      alignItems: "center",
      gap: h * 0.5,
      paddingRight: h * 0.5
    }
  }, React.createElement("div", {
    style: {
      position: "relative",
      height: h,
      aspectRatio: `${LOGO_RATIO}`
    }
  }, React.createElement(Ink, {
    src: A.wordmark[word],
    color: COLOR[word]
  }), React.createElement(Ink, {
    src: A.script[script],
    color: COLOR[script]
  })), React.createElement(Symbol, {
    tone: sym,
    solid: key % 2 === 0,
    size: h * 0.42
  }));
  return React.createElement("div", {
    ref: rootRef,
    style: {
      ...props.style,
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("style", null, CSS), React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: m ? "4 / 5" : "16 / 9",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Photo, {
    src: PHOTO.platter,
    alt: "A Tandanji office meal on a round plate",
    shade: 0.45,
    position: "50% 50%"
  }), React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: m ? 16 : 22
    }
  }, React.createElement(Lockup, {
    word: "pink",
    script: "pink",
    width: Math.round(w * (m ? 0.66 : 0.36)),
    delay: 0.2
  }))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr",
      gap: m ? 24 : pad,
      padding: m ? "32px 20px" : `${Math.round(w * 0.035)}px 4%`,
      background: "#FFFFFF",
      color: COLOR.black,
      borderBottom: "1px solid rgba(10,2,3,0.08)"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      color: COLOR.red
    }
  }, React.createElement("div", {
    style: {
      fontSize: m ? 18 : 22,
      lineHeight: 1.3
    }
  }, "tandanji office meal \uD0C4\uB2E8\uC9C0 \uC624\uD53C\uC2A4\uBC00"), React.createElement("div", {
    style: {
      fontSize: m ? 18 : 22,
      lineHeight: 1.3
    }
  }, "BRAND IDENTITY")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1.6fr 1fr",
      gap: m ? 18 : 32
    }
  }, React.createElement("div", {
    style: {
      ...small
    }
  }, React.createElement("div", {
    style: {
      color: COLOR.red,
      marginBottom: 6,
      letterSpacing: "0.04em"
    }
  }, "CONCEPT"), React.createElement("div", {
    style: {
      opacity: 0.75,
      wordBreak: "keep-all"
    }
  }, "office meal\uC744 \uC2A4\uD06C\uB9BD\uD2B8 \uC11C\uCCB4\uB85C \uC801\uC6A9\uD574, \uC0C1\uB2E8 tandanji \uB85C\uACE0\uC758 \uBD80\uB4DC\uB7FD\uACE0 \uC720\uAE30\uC801\uC778 \uBB34\uB4DC\uC640 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC5F0\uACB0\uD55C \uB85C\uACE0\uC785\uB2C8\uB2E4. \uACE1\uC120\uAC10\uC774 \uAC15\uD55C \uC601\uBB38 \uC11C\uCCB4\uB294 \uAE30\uC874 \uB85C\uACE0\uC758 \uAC1C\uC131\uACFC \uCE5C\uADFC\uD55C \uC778\uC0C1\uC744 \uAC15\uC870\uD558\uACE0, \uC74C\uC2DD \uBE0C\uB79C\uB4DC\uAC00 \uAC00\uC9C4 \uB530\uB73B\uD568\uACFC \uAC10\uC131\uC801\uC778 \uBD84\uC704\uAE30\uB97C \uB354\uD569\uB2C8\uB2E4.")), React.createElement("div", {
    style: {
      ...small
    }
  }, React.createElement("div", {
    style: {
      color: COLOR.red,
      marginBottom: 6,
      letterSpacing: "0.04em"
    }
  }, "SCOPE"), React.createElement("div", {
    style: {
      opacity: 0.75
    }
  }, "Logo \xB7 Symbol", React.createElement("br", null), "Color System")))), React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: m ? "4 / 5" : "16 / 9",
      overflow: "hidden"
    }
  }, React.createElement(Photo, {
    src: PHOTO.spread,
    alt: "Tandanji office meal boxes laid out on a table",
    shade: 0.42,
    position: "50% 42%",
    still: true
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: "4%",
      right: "4%",
      bottom: m ? "4%" : "-2%",
      opacity: 0.55
    }
  }, React.createElement(Lockup, {
    word: "pink",
    script: "pink",
    width: "100%",
    draw: false
  }))), React.createElement(Slide, {
    bg: "#FFFFFF",
    color: COLOR.black,
    m: m,
    title: "Primary Logo",
    lines: ["tandanji 워드마크, office meal 스크립트,", "O 심볼로 구성됩니다."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: m ? "column" : "row",
      alignItems: "center",
      gap: m ? 36 : Math.round(w * 0.06),
      marginTop: m ? 40 : 0
    }
  }, React.createElement(Lockup, {
    word: "red",
    script: "black",
    width: Math.round(w * (m ? 0.72 : 0.4))
  }), React.createElement(Reveal, {
    delay: 1.2
  }, React.createElement(Symbol, {
    tone: "red",
    solid: true,
    size: m ? 84 : Math.round(w * 0.075)
  })))), React.createElement(Slide, {
    bg: COLOR.pink,
    color: COLOR.black,
    m: m,
    title: "Logo Structure",
    lines: ["굵고 둥근 tandanji 워드마크 아래로", "office meal 스크립트가 겹쳐 흐르며", "하나의 손글씨처럼 이어집니다."]
  }, React.createElement("div", {
    style: {
      position: "relative",
      width: m ? "78%" : "44%",
      aspectRatio: `${LOGO_RATIO}`,
      marginTop: m ? 40 : 0,
      ["--om-gap"]: m ? "20px" : `${Math.round(w * 0.028)}px`
    }
  }, React.createElement(Ink, {
    src: A.wordmark.red,
    color: COLOR.red,
    label: "tandanji"
  }), React.createElement(Ink, {
    src: A.script.black,
    color: COLOR.black,
    label: "office meal",
    style: {
      animation: "om-split 6s cubic-bezier(0.65, 0, 0.35, 1) infinite"
    }
  }), React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: m ? -30 : -40,
      ...small,
      fontSize: 12,
      color: COLOR.red,
      animation: "om-label 6s ease infinite"
    }
  }, "tandanji \u2014 Wordmark"), React.createElement("span", {
    style: {
      position: "absolute",
      right: 0,
      bottom: m ? -46 : -64,
      ...small,
      fontSize: 12,
      color: COLOR.black,
      animation: "om-label 6s ease infinite"
    }
  }, "office meal \u2014 Script"))), React.createElement(Slide, {
    bg: COLOR.black,
    color: COLOR.pink,
    m: m,
    title: "Symbol",
    lines: ["O 심볼은 라인형과 면형", "두 가지로 구성됩니다."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: m ? 28 : Math.round(w * 0.08),
      marginTop: m ? 40 : 0
    }
  }, React.createElement(Reveal, null, React.createElement(Symbol, {
    tone: "pink",
    size: m ? 110 : Math.round(w * 0.14),
    style: {
      animation: "om-float 4s ease-in-out infinite"
    }
  })), React.createElement(Reveal, {
    delay: 0.2
  }, React.createElement(Symbol, {
    tone: "pink",
    solid: true,
    size: m ? 110 : Math.round(w * 0.14),
    style: {
      animation: "om-float 4s ease-in-out 0.6s infinite"
    }
  })))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr"
    }
  }, [{
    src: PHOTO.office,
    alt: "An office meal at a desk beside a laptop",
    tag: "Office",
    pos: "50% 62%"
  }, {
    src: PHOTO.platter3,
    alt: "An office meal on a round plate",
    tag: "Meal",
    pos: "50% 50%"
  }].map(p => React.createElement("div", {
    key: p.tag,
    style: {
      position: "relative",
      aspectRatio: m ? "4 / 5" : "8 / 9",
      overflow: "hidden"
    }
  }, React.createElement(Photo, {
    src: p.src,
    alt: p.alt,
    shade: 0.12,
    position: p.pos
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: m ? 20 : "8%",
      bottom: m ? 20 : "7%",
      ...small,
      color: "#FFFFFF"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      textDecoration: "underline",
      textUnderlineOffset: 3
    }
  }, p.tag))))), React.createElement(Slide, {
    bg: "#FFFFFF",
    color: COLOR.black,
    m: m,
    title: "Color System",
    lines: ["Red, Pink Beige, Black —", "탄단지박스와의 연결성을 유지하면서도", "신뢰감 있는 브랜드 이미지를 만듭니다."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: m ? 10 : Math.round(w * 0.04),
      marginTop: m ? 40 : 0
    }
  }, colors.map((c, i) => React.createElement(ColorDot, {
    key: c.hex,
    c: c,
    size: `${Math.round(w * (m ? 0.22 : 0.13))}px`,
    m: m,
    delay: i * 0.15
  })))), React.createElement(Slide, {
    bg: COLOR.pink,
    color: COLOR.black,
    m: m,
    title: "Logo on Color",
    lines: ["배경색에 따라 지정된 로고 조합을 사용합니다."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: m ? 6 : Math.round(w * 0.012),
      marginTop: m ? 40 : 0
    }
  }, [["red", "pink", "pink"], ["pink", "red", "black"], ["black", "pink", "pink"]].map(([bg, word, script], i) => React.createElement(Reveal, {
    key: bg,
    delay: i * 0.12
  }, React.createElement("div", {
    style: {
      background: COLOR[bg],
      width: Math.round(w * (m ? 0.27 : 0.16)),
      aspectRatio: "3 / 4",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: m ? 12 : 22,
      boxShadow: bg === "pink" ? "inset 0 0 0 1px rgba(10,2,3,0.08)" : "none"
    }
  }, React.createElement(Lockup, {
    word: word,
    script: script,
    width: "72%",
    delay: 0.3 + i * 0.15
  }), React.createElement(Symbol, {
    tone: word,
    solid: i !== 1,
    size: m ? 20 : Math.round(w * 0.026)
  })))))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr"
    }
  }, React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: m ? "4 / 5" : "8 / 9",
      overflow: "hidden"
    }
  }, React.createElement(Photo, {
    src: PHOTO.team,
    alt: "Colleagues sharing Tandanji office meals at an office cafeteria table",
    position: "50% 58%"
  })), React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: m ? "4 / 3" : "8 / 9",
      background: COLOR.red,
      color: COLOR.pink,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: m ? "0 24px" : "0 12%"
    }
  }, React.createElement(Reveal, null, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: m ? 24 : Math.min(44, Math.round(w * 0.03)),
      lineHeight: 1.35,
      letterSpacing: "-0.02em",
      wordBreak: "keep-all"
    }
  }, "A soft, handwritten script that carries tandanji\u2019s warmth into every office meal."), React.createElement("div", {
    style: {
      ...small,
      fontSize: m ? 11 : 12,
      marginTop: m ? 18 : 28,
      letterSpacing: "0.04em",
      opacity: 0.85,
      textTransform: "uppercase"
    }
  }, "Tandanji Office Meal")))), React.createElement("div", {
    style: {
      background: COLOR.red,
      overflow: "hidden",
      padding: `${m ? 10 : 16}px 0`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      width: "max-content",
      animation: "om-marquee 28s linear infinite"
    }
  }, Array.from({
    length: bandCount * 2
  }, (_, i) => marqueeItem("pink", "pink", "pink", bandH, i)))), React.createElement("div", {
    style: {
      background: COLOR.pink,
      overflow: "hidden",
      padding: `${m ? 10 : 16}px 0`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      width: "max-content",
      animation: "om-marquee-rev 32s linear infinite"
    }
  }, Array.from({
    length: bandCount * 2
  }, (_, i) => marqueeItem("red", "black", "red", bandH, i)))), React.createElement(Slide, {
    bg: COLOR.black,
    color: COLOR.pink,
    m: m
  }, React.createElement(Lockup, {
    word: "pink",
    script: "pink",
    width: m ? "64%" : "34%",
    delay: 0.2
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: m ? 20 : "4%",
      bottom: m ? 20 : "5.5%",
      ...small,
      color: COLOR.pink,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, "Logo & Color System \xB7 2026"), React.createElement(Symbol, {
    tone: "pink",
    size: m ? 24 : 34,
    style: {
      position: "absolute",
      right: m ? 20 : "4%",
      bottom: m ? 20 : "5.5%",
      animation: "om-spin 14s linear infinite"
    }
  })));
}
addPropertyControls(OfficeMealGuideline, {});(window.Guides = window.Guides || {}).OfficeMealGuideline = OfficeMealGuideline;
})();
(function () {
const addPropertyControls = () => {}; const ControlType = new Proxy({}, { get: (_, k) => k });
const IMG = "/assets/img/";
const L = {
  fru: IMG + "BuUG0cWdAikLcHiMigcmqjrrFMs.png",
  now: IMG + "WIQ4yIc36XZk0ck1tEyQdbCpelE.png",
  stem: IMG + "Sqw30h6tUH2p5fxTPhPLfoCoo.png",
  body: IMG + "KW5T4cvf9jlhl5FjdxV0pAyWs.png",
  dot: IMG + "RpWguutSyL43MeRYN4jQHLyXOvs.png",
  kr: IMG + "x8XOhcidgrX4jgKY4Xta48z1mds.png"
};
const EL = {
  orange: IMG + "MqzhRb8ibHjCOidBkeFe7Q0eRo.png",
  blueberry: IMG + "m3BOx0FpeOerXdKrtaQqyOxH0w.png",
  strawberry: IMG + "25A8t7eNfh22XcOdiGKaQ1LV2Q.png",
  loading: IMG + "CPjjVfGNkZk3YLbhXVIeahCtqw.png"
};
const BLUEBERRY = ["yQbo4pPJVUQK9SZ2NpEbn8uwAzU.jpg", "6fYdVNrSIde6Awbc2Ar9crJl8Yw.jpg", "ISGrrSey8lxEYenh6N708XLH3c.jpg", "UWzKiKqIGtkBuBQXK9GTyAs3w.gif", "T98oc7cFtJiX5B09RrBaxC6g.jpg", "fCGEaiwO4rug0bdW0JMTqnnDTSU.jpg", "iD59cIc4Jq2yv1yOrGLip5NFvgg.jpg", "T8v0qqkvovobf8JFrbzpmEU2npM.jpg", "ohv1qyNAOZTASlsJ03vCb7y1I.jpg", "R5QicHf7rXvukkxBDdx0e5Ca0I.jpg", "P7Xc15tRYuEmCxi9BcnCrAzKU.jpg", "rcGr8BZwCY8D6TYl9llyYaxGa0.jpg", "OdnLBfXSbAdJ99kcBZY4yfVz3Ww.jpg", "4caCsjJB6O8g2nKMdqkJTQ03fhI.jpg", "YSLQA7YjgO1DfHhC3tT2m1wQ.jpg"].map(f => IMG + f);
const BLUEBERRY_H = [3551, 1530, 465, 1150, 1963, 2801, 692, 1754, 1720, 1580, 2469, 2276, 3559, 1518, 3566];
const C = {
  orange: "#FC6515",
  ivory: "#FFF6E5",
  brown: "#2C1107",
  white: "#FFFFFF"
};
const SANS = '"roc-grotesk-variable", "Roc Grotesk Variable", "roc-grotesk", "Roc Grotesk", "SD 그레타산스", "SD Greta Sans", "Pretendard", "Inter", "Apple SD Gothic Neo", system-ui, sans-serif';
const PHOTO = {
  berries: IMG + "1TlobLZOq9TsjPV8l15adrFSQ.jpg",
  farm: IMG + "LoyLWd1GMmV0vT8Rx341tA3C7Co.jpg",
  harvest: IMG + "4S0fsUE778vIyGPoyEqzR3WLe4I.jpg",
  spoon: IMG + "KwfC9pb1I9c8iQHQAVy0k9r84.jpg",
  tangerine2: IMG + "hfKZ5rfl8vH8fuAJJ9amwsXkk.jpg",
  pear: IMG + "YZanDc8Kpdjip903uemRlVKiC8.jpg",
  tangerine: IMG + "lSu5wxCspugvt61MZiw5owz4b3w.jpg"
};
const TYPE = {
  rocAa: IMG + "OGMuvlE5RabaQGIy0kfdCfYzDZI.png",
  krGa: IMG + "CdDc1grsrqR5zYXPMpiOohTFf48.png",
  rocLadder: IMG + "UP2CHBzsF93lZxBwO531O41uiHo.png",
  krLadder: IMG + "wFtITa1KkucO9x94AOjUFnkKUaU.png",
  rocGlyphs: IMG + "9ThnA0k5uxMkSc2HG4RyV5dHwg0.png",
  krGlyphs: IMG + "MHstwmmhwdSTGFILqrQOSB9mc.png"
};
const CW = 3168;
const CH = 608;
const KR_RATIO = 3370 / 860;
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
`;
function useInView(threshold = 0.25) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}
function Reveal({
  children,
  delay = 0,
  style
}) {
  const [ref, seen] = useInView(0.2);
  return React.createElement("div", {
    ref: ref,
    style: {
      ...style,
      opacity: seen ? 1 : 0,
      transform: `translateY(${seen ? 0 : 28}px)`,
      transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
    }
  }, children);
}
function Mask({
  src,
  color,
  style
}) {
  return React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: color,
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      ...style
    }
  });
}
const ON_LIGHT = {
  ink: C.brown,
  fruit: C.orange,
  stem: C.brown
};
const ON_ORANGE = {
  ink: C.white,
  fruit: "#000000",
  stem: C.white
};
const ON_BROWN = {
  ink: C.ivory,
  fruit: C.orange,
  stem: C.ivory
};
function Logo({
  tone,
  width,
  intro = false,
  delay = 0,
  bob = false
}) {
  const [ref, seen] = useInView(0.3);
  const on = !intro || seen;
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  const slide = (x, d) => ({
    transform: on ? "none" : `translateX(${x}%)`,
    opacity: on ? 1 : 0,
    transition: `transform 1.3s ${ease} ${delay + d}s, opacity 0.8s ease ${delay + d}s`
  });
  const drop = {
    transform: on ? "none" : "translateY(-120%)",
    opacity: on ? 1 : 0,
    transition: `transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 0.75}s, opacity 0.3s ease ${delay + 0.75}s`
  };
  const pop = {
    transform: on ? "scale(1)" : "scale(0)",
    transformOrigin: "44.6% 81%",
    transition: `transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 0.55}s`
  };
  return React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      width,
      aspectRatio: `${CW} / ${CH}`
    }
  }, React.createElement(Mask, {
    src: L.fru,
    color: tone.ink,
    style: slide(-6, 0)
  }), React.createElement(Mask, {
    src: L.now,
    color: tone.ink,
    style: slide(6, 0.1)
  }), React.createElement(Mask, {
    src: L.dot,
    color: tone.ink,
    style: pop
  }), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      ...drop
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      animation: bob ? "pn-bob 2.8s ease-in-out 2.4s infinite" : undefined
    }
  }, React.createElement(Mask, {
    src: L.body,
    color: tone.fruit
  }), React.createElement(Mask, {
    src: L.stem,
    color: tone.stem
  }))));
}
function Signature({
  width,
  m
}) {
  const [stacked, setStacked] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => setStacked(s => !s), 3200);
    return () => clearInterval(id);
  }, []);
  const BH = 1200;
  const hy = (BH - CH) / 2;
  const part = (ax, ay, dx, dy, k) => ({
    position: "absolute",
    left: 0,
    top: `${hy / BH * 100}%`,
    width: "100%",
    height: `${CH / BH * 100}%`,
    transformOrigin: `${ax / CW * 100}% ${ay / CH * 100}%`,
    transform: stacked ? `translate(${dx / CW * 100}%, ${dy / CH * 100}%) scale(${k})` : "translate(0, 0) scale(1)",
    transition: "transform 1.1s cubic-bezier(0.65, 0, 0.35, 1)"
  });
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: m ? 18 : 28
    }
  }, React.createElement("div", {
    style: {
      position: "relative",
      width,
      aspectRatio: `${CW} / ${BH}`
    }
  }, React.createElement("div", {
    style: part(12, 580, 1157, -325, 1)
  }, React.createElement(Mask, {
    src: L.fru,
    color: C.brown
  })), React.createElement("div", {
    style: part(1320, 180, -800, -371, 2.73)
  }, React.createElement(Mask, {
    src: L.body,
    color: C.orange
  }), React.createElement(Mask, {
    src: L.stem,
    color: C.brown
  })), React.createElement("div", {
    style: part(1320, 412, -800, 14, 2.73)
  }, React.createElement(Mask, {
    src: L.dot,
    color: C.brown
  })), React.createElement("div", {
    style: part(1672, 580, -503, 279, 1)
  }, React.createElement(Mask, {
    src: L.now,
    color: C.brown
  }))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      fontFamily: SANS,
      fontSize: 12,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, React.createElement("span", {
    style: {
      color: C.brown,
      opacity: stacked ? 0.35 : 1,
      transition: "opacity 0.6s"
    }
  }, "Horizontal"), React.createElement("span", {
    style: {
      color: C.brown,
      opacity: 0.35
    }
  }, "/"), React.createElement("span", {
    style: {
      color: C.brown,
      opacity: stacked ? 1 : 0.35,
      transition: "opacity 0.6s"
    }
  }, "Vertical")));
}
function Fruit({
  color,
  size,
  animation,
  stem = C.brown
}) {
  return React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      animation
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: color
    }
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "-14%",
      width: "16%",
      height: "46%",
      background: stem,
      transform: "translateX(-10%) rotate(24deg)",
      transformOrigin: "50% 100%"
    }
  }));
}
function Clock({
  size
}) {
  const hand = (h, dur) => ({
    position: "absolute",
    left: "46%",
    top: `${54 - h}%`,
    width: "8%",
    height: `${h}%`,
    background: C.brown,
    transformOrigin: `50% ${(h - 4) / h * 100}%`,
    animation: `pn-tick ${dur}s linear infinite`
  });
  return React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      background: C.orange
    }
  }, React.createElement("div", {
    style: hand(34, 12)
  }), React.createElement("div", {
    style: hand(44, 2.4)
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: "44%",
      top: "44%",
      width: "12%",
      height: "12%",
      borderRadius: "50%",
      background: C.brown
    }
  }));
}
function SlideTitle({
  title,
  lines,
  color,
  m
}) {
  return React.createElement("div", {
    style: {
      position: "absolute",
      top: m ? 22 : "5.5%",
      left: m ? 20 : "4%",
      maxWidth: m ? "78%" : 300,
      zIndex: 3,
      fontFamily: SANS,
      color
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      textDecoration: "underline",
      textUnderlineOffset: 3,
      marginBottom: lines ? 10 : 0
    }
  }, title), lines && lines.map((l, i) => React.createElement("div", {
    key: i,
    style: {
      fontSize: 11,
      lineHeight: 1.6,
      opacity: 0.7,
      wordBreak: "keep-all"
    }
  }, l)));
}
function Slide({
  bg,
  color,
  title,
  lines,
  m,
  ratio,
  children
}) {
  return React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: ratio || (m ? "4 / 5" : "16 / 9"),
      background: bg,
      color,
      overflow: "hidden"
    }
  }, title && React.createElement(SlideTitle, {
    title: title,
    lines: lines,
    color: color,
    m: m
  }), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, children));
}
function Construction({
  width,
  m
}) {
  const [ref, seen] = useInView(0.35);
  const line = d => ({
    strokeDasharray: 1,
    strokeDashoffset: seen ? 0 : 1,
    transition: `stroke-dashoffset 1.6s cubic-bezier(0.65, 0, 0.35, 1) ${d}s`
  });
  const ink = "rgba(255,255,255,0.6)";
  const tag = (x, y, t, d, anchor = "start") => React.createElement("text", {
    x: x,
    y: y,
    textAnchor: anchor,
    fill: C.white,
    style: {
      fontFamily: SANS,
      fontSize: m ? 64 : 48,
      opacity: seen ? 1 : 0,
      transition: `opacity 0.6s ease ${d}s`
    }
  }, t);
  return React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      width
    }
  }, React.createElement(Logo, {
    tone: {
      ink: "rgba(255,255,255,0.32)",
      fruit: "#000000",
      stem: C.white
    },
    width: "100%"
  }), React.createElement("svg", {
    viewBox: `0 0 ${CW} ${CH}`,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      overflow: "visible"
    },
    fill: "none",
    stroke: ink,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke"
  }, React.createElement("path", {
    pathLength: 1,
    d: "M -260 16 H 3428",
    style: line(0),
    vectorEffect: "non-scaling-stroke"
  }), React.createElement("path", {
    pathLength: 1,
    d: "M -260 184 H 3428",
    style: line(0.15),
    vectorEffect: "non-scaling-stroke"
  }), React.createElement("path", {
    pathLength: 1,
    d: "M -260 580 H 3428",
    style: line(0.3),
    vectorEffect: "non-scaling-stroke"
  }), React.createElement("path", {
    pathLength: 1,
    d: "M 1414 -220 V 830",
    style: line(0.5),
    vectorEffect: "non-scaling-stroke"
  }), React.createElement("circle", {
    pathLength: 1,
    cx: 1414,
    cy: 264,
    r: 150,
    style: line(0.8),
    vectorEffect: "non-scaling-stroke"
  }), React.createElement("circle", {
    pathLength: 1,
    cx: 1414,
    cy: 496,
    r: 150,
    style: line(0.95),
    vectorEffect: "non-scaling-stroke"
  }), React.createElement("path", {
    pathLength: 1,
    d: "M 1564 264 C 1900 120, 2300 -90, 2700 -150",
    style: line(1.2),
    vectorEffect: "non-scaling-stroke",
    stroke: C.white
  }), React.createElement("path", {
    pathLength: 1,
    d: "M 1564 496 C 1900 700, 2300 860, 2700 900",
    style: line(1.35),
    vectorEffect: "non-scaling-stroke",
    stroke: C.white
  }), tag(2730, -140, "과일 · Fruit", 2.2), tag(2730, 915, "사람 · Person", 2.35), tag(-280, 0, "Ascender", 1.8, "end"), tag(-280, 198, "x-height", 1.9, "end"), tag(-280, 594, "Baseline", 2.0, "end")));
}
function ColorDot({
  c,
  size,
  m,
  delay
}) {
  const [on, setOn] = React.useState(false);
  return React.createElement(Reveal, {
    delay: delay,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: m ? 10 : 18,
      width: size
    }
  }, React.createElement("div", {
    onMouseEnter: () => setOn(true),
    onMouseLeave: () => setOn(false),
    style: {
      width: "100%",
      aspectRatio: "1",
      borderRadius: "50%",
      background: c.bg,
      boxShadow: c.bg === C.ivory ? "inset 0 0 0 1px rgba(44,17,7,0.14)" : "none",
      transform: on ? "scale(1.08)" : "scale(1)",
      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
    }
  }), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      lineHeight: 1.6,
      textAlign: "center",
      color: C.brown
    }
  }, React.createElement("div", null, c.name), React.createElement("div", {
    style: {
      opacity: 0.6
    }
  }, c.hex), React.createElement("div", {
    style: {
      opacity: on ? 0.6 : 0,
      transition: "opacity 0.4s ease",
      whiteSpace: "nowrap"
    }
  }, "PANTONE ", c.pantone, " \xB7 RGB ", c.rgb, " \xB7 CMYK ", c.cmyk)));
}
function Photo({
  src,
  alt,
  shade = 0,
  position = "50% 50%",
  still = false
}) {
  const [ref, inView] = useInView(0.2);
  const seen = still || inView;
  return React.createElement("div", {
    ref: ref,
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden"
    }
  }, React.createElement("img", {
    src: src,
    alt: alt,
    loading: "lazy",
    draggable: false,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: position,
      display: "block",
      transform: seen ? "scale(1)" : "scale(1.08)",
      transition: "transform 2.4s cubic-bezier(0.16, 1, 0.3, 1)"
    }
  }), shade > 0 && React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `rgba(0,0,0,${shade})`
    }
  }));
}
function PageCrop({
  images,
  heights,
  start
}) {
  let y = 0;
  const parts = [];
  heights.forEach((h, i) => {
    if (y + h > start && y < start + 6000) parts.push({
      src: images[i],
      top: y,
      h
    });
    y += h;
  });
  const lead = start - parts[0].top;
  return React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: C.white,
      borderRadius: 10,
      boxShadow: "0 18px 50px rgba(44,17,7,0.10)"
    }
  }, React.createElement("div", {
    style: {
      marginTop: `${-(lead / 1000) * 100}%`
    }
  }, parts.map(p => React.createElement("img", {
    key: p.src,
    src: p.src,
    alt: "",
    draggable: false,
    style: {
      display: "block",
      width: "100%",
      height: "auto",
      aspectRatio: `1000 / ${p.h}`,
      objectFit: "cover"
    }
  }))));
}
function WeightSprite({
  src,
  color
}) {
  return React.createElement("div", {
    style: {
      width: "100%",
      aspectRatio: "900 / 600",
      background: color,
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: "100% 800%",
      maskSize: "100% 800%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      animation: "pn-weights 5.6s steps(8, jump-none) infinite alternate"
    }
  });
}
function Specimen({
  src,
  ratio,
  color
}) {
  return React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: ratio
    }
  }, React.createElement(Mask, {
    src: src,
    color: color
  }));
}
function PrunauGuideline(props) {
  const rootRef = React.useRef(null);
  const kit = (props.adobeKit || "").trim().replace(/[^a-z0-9]/gi, "");
  const [w, setW] = React.useState(1440);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) setW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const m = w < 760;
  const pad = m ? 20 : Math.round(w * 0.04);
  const small = {
    fontFamily: SANS,
    fontSize: 11,
    lineHeight: 1.6
  };
  const callout = (top, color, text) => {
    const lh = m ? 34 : Math.round(w * 0.04);
    const lw = m ? 18 : Math.round(w * 0.024);
    return React.createElement("div", {
      style: {
        position: "absolute",
        left: "44.6%",
        ...(top ? {
          bottom: "88%"
        } : {
          top: "104%"
        }),
        width: lw,
        height: lh,
        borderLeft: `1px solid ${color}`,
        ...(top ? {
          borderTop: `1px solid ${color}`
        } : {
          borderBottom: `1px solid ${color}`
        })
      }
    }, React.createElement("span", {
      style: {
        position: "absolute",
        left: lw + 8,
        ...(top ? {
          top: 0
        } : {
          bottom: 0
        }),
        transform: `translateY(${top ? "-50%" : "50%"})`,
        whiteSpace: "nowrap",
        ...small,
        fontSize: m ? 11 : 12,
        color
      }
    }, text));
  };
  const colors = [{
    name: "fru:now orange",
    pantone: "1585 C",
    rgb: "252 101 21",
    cmyk: "0 73 87 0",
    hex: "#FC6515",
    bg: C.orange
  }, {
    name: "fru:now ivory",
    pantone: "9180 C",
    rgb: "255 246 229",
    cmyk: "0 5 12 0",
    hex: "#FFF6E5",
    bg: C.ivory
  }, {
    name: "fru:now brown",
    pantone: "4975 C",
    rgb: "44 17 7",
    cmyk: "72 86 92 67",
    hex: "#2C1107",
    bg: C.brown
  }];
  const fruitSize = m ? 28 : Math.round(w * 0.036);
  return React.createElement("div", {
    ref: rootRef,
    style: {
      ...props.style,
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("style", null, CSS), kit && React.createElement("link", {
    rel: "stylesheet",
    href: `https://use.typekit.net/${kit}.css`
  }), React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: m ? "4 / 5" : "16 / 9",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Photo, {
    src: PHOTO.tangerine,
    alt: "A box of tangerines",
    shade: 0.42,
    position: "60% 50%"
  }), React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: m ? 16 : 22
    }
  }, React.createElement(Logo, {
    tone: {
      ink: C.white,
      fruit: C.orange,
      stem: C.white
    },
    width: Math.round(w * (m ? 0.6 : 0.3)),
    intro: true,
    bob: true
  }))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr",
      gap: m ? 24 : pad,
      padding: m ? "32px 20px" : `${Math.round(w * 0.035)}px 4%`,
      background: C.white,
      color: C.brown,
      borderBottom: "1px solid rgba(44,17,7,0.08)"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      color: C.orange
    }
  }, React.createElement("div", {
    style: {
      fontSize: m ? 18 : 22,
      lineHeight: 1.3
    }
  }, "fru:now \uD504\uB8E8\uB098\uC6B0"), React.createElement("div", {
    style: {
      fontSize: m ? 18 : 22,
      lineHeight: 1.3
    }
  }, "BRAND IDENTITY")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1.6fr 1fr",
      gap: m ? 18 : 32
    }
  }, React.createElement("div", {
    style: {
      ...small
    }
  }, React.createElement("div", {
    style: {
      color: C.orange,
      marginBottom: 6,
      letterSpacing: "0.04em"
    }
  }, "BRAND STORY"), React.createElement("div", {
    style: {
      opacity: 0.75,
      wordBreak: "keep-all"
    }
  }, "\uACFC\uC77C\uC758 \uC88B\uC740 \uC21C\uAC04\uC744, \uC77C\uC0C1\uC758 \uC2DD\uD0C1\uC73C\uB85C. \uD504\uB8E8\uB098\uC6B0\uB294 \uACFC\uC77C\uC758 \uD604\uC7AC \uC0C1\uD0DC\uC640 \uB9DB\uC744 \uC0B4\uD53C\uACE0 \uC9C0\uAE08 \uAD8C\uD560 \uB9CC\uD55C \uACFC\uC77C\uC744 \uC194\uC9C1\uD558\uAC8C \uC81C\uC548\uD558\uB294, \uCE5C\uADFC\uD55C \uACFC\uC77C \uC804\uBB38\uAC00\uB97C \uC9C0\uD5A5\uD569\uB2C8\uB2E4.")), React.createElement("div", {
    style: {
      ...small
    }
  }, React.createElement("div", {
    style: {
      color: C.orange,
      marginBottom: 6,
      letterSpacing: "0.04em"
    }
  }, "SCOPE"), React.createElement("div", {
    style: {
      opacity: 0.75
    }
  }, "Logo \xB7 Color \xB7 Typeface", React.createElement("br", null), "Graphic \xB7 Detail Page")))), React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: m ? "4 / 5" : "16 / 9",
      overflow: "hidden"
    }
  }, React.createElement(Photo, {
    src: PHOTO.berries,
    alt: "Blueberries",
    shade: 0.42,
    still: true
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: "4%",
      right: "4%",
      bottom: 0,
      opacity: 0.55,
      transform: "translateY(4.6%)"
    }
  }, React.createElement(Logo, {
    tone: {
      ink: C.white,
      fruit: C.orange,
      stem: C.white
    },
    width: "100%"
  }))), React.createElement(Slide, {
    bg: C.white,
    color: C.brown,
    m: m,
    title: "Logotype",
    lines: ["FRU(과일)와 NOW(지금)를 잇는 이름.", "가운데 콜론은 과일과 사람, 산지와 식탁의 연결입니다."]
  }, React.createElement("div", {
    style: {
      position: "relative",
      width: m ? "78%" : "46%"
    }
  }, React.createElement(Logo, {
    tone: ON_LIGHT,
    width: "100%",
    intro: true,
    bob: true
  }), React.createElement(Reveal, {
    delay: 1.4,
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }
  }, callout(true, C.orange, "과일 — 지금 가장 맛있는 순간")), React.createElement(Reveal, {
    delay: 1.6,
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }
  }, callout(false, C.brown, "사람 — 그 과일을 고르는 사람")))), React.createElement(Slide, {
    bg: C.orange,
    color: C.white,
    m: m,
    title: "Construction",
    lines: ["Ascender, x-height, baseline 위에 놓인 글자와", "콜론의 두 원이 하나의 축으로 정렬됩니다."]
  }, React.createElement(Construction, {
    width: m ? "64%" : "44%",
    m: m
  })), React.createElement(Slide, {
    bg: C.ivory,
    color: C.brown,
    m: m,
    title: "Signature",
    lines: ["로고타입과 한글 타이틀의 조합.", "매체에 따라 가로형과 세로형을 골라 씁니다."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: m ? "column" : "row",
      alignItems: "center",
      gap: m ? 40 : Math.round(w * 0.07)
    }
  }, React.createElement(Signature, {
    width: m ? Math.round(w * 0.62) : Math.round(w * 0.3),
    m: m
  }), React.createElement(Reveal, null, React.createElement("div", {
    style: {
      position: "relative",
      width: m ? Math.round(w * 0.36) : Math.round(w * 0.14),
      aspectRatio: `${KR_RATIO}`
    }
  }, React.createElement(Mask, {
    src: L.kr,
    color: C.brown
  }))))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr"
    }
  }, [{
    src: PHOTO.farm,
    alt: "Blueberry farm",
    tag: "Grow",
    line: "산지에서 제철과 숙도를 살피고",
    pos: "50% 60%"
  }, {
    src: PHOTO.harvest,
    alt: "Hands holding freshly picked tangerines",
    tag: "Harvest",
    line: "지금 가장 맛있는 순간에 고릅니다",
    pos: "50% 45%"
  }].map(p => React.createElement("div", {
    key: p.tag,
    style: {
      position: "relative",
      aspectRatio: m ? "4 / 5" : "8 / 9",
      overflow: "hidden"
    }
  }, React.createElement(Photo, {
    src: p.src,
    alt: p.alt,
    shade: 0.18,
    position: p.pos
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: m ? 20 : "8%",
      bottom: m ? 20 : "7%",
      ...small,
      color: C.white
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      textDecoration: "underline",
      textUnderlineOffset: 3,
      marginBottom: 6
    }
  }, p.tag), React.createElement("div", {
    style: {
      opacity: 0.9
    }
  }, p.line))))), React.createElement(Slide, {
    bg: C.white,
    color: C.brown,
    m: m,
    title: "Color System",
    lines: ["Orange, Ivory, Brown —", "과일의 생동감과 식탁의 따뜻함을 담은 세 가지 컬러."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: m ? 10 : Math.round(w * 0.04),
      marginTop: m ? 40 : 0
    }
  }, colors.map((c, i) => React.createElement(ColorDot, {
    key: c.hex,
    c: c,
    size: `${Math.round(w * (m ? 0.22 : 0.13))}px`,
    m: m,
    delay: i * 0.15
  })))), React.createElement(Slide, {
    bg: C.orange,
    color: C.white,
    m: m,
    title: "Typeface",
    lines: ["국문 Sandoll 클레어산스, 영문 Roc Grotesk.", "진한 굵기는 권장 범위, 흐린 굵기는 지양합니다."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: Math.round(w * (m ? 0.06 : 0.07)),
      marginTop: m ? 48 : 0
    }
  }, [{
    name: "Roc Grotesk",
    tag: "English",
    sprite: TYPE.rocAa,
    ladder: TYPE.rocLadder
  }, {
    name: "Sandoll 클레어산스",
    tag: "Korean",
    sprite: TYPE.krGa,
    ladder: TYPE.krLadder
  }].map((t, i) => {
    const cw = Math.round(w * (m ? 0.4 : 0.24));
    const sw = Math.round(cw * 0.62);
    return React.createElement(Reveal, {
      key: t.name,
      delay: i * 0.15,
      style: {
        width: cw,
        display: "flex",
        flexDirection: "column",
        gap: m ? 14 : 22
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        paddingBottom: 10,
        borderBottom: "1px solid rgba(255,255,255,0.35)",
        ...small
      }
    }, React.createElement("span", {
      style: {
        fontSize: m ? 11 : 13
      }
    }, t.name), React.createElement("span", {
      style: {
        opacity: 0.55,
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, t.tag)), React.createElement("div", {
      style: {
        width: sw,
        marginLeft: -Math.round(sw * (40 / 900))
      }
    }, React.createElement(WeightSprite, {
      src: t.sprite,
      color: C.white
    })), React.createElement(Specimen, {
      src: t.ladder,
      ratio: "1500 / 880",
      color: C.white
    }));
  }))), React.createElement(Slide, {
    bg: C.brown,
    color: C.white,
    m: m,
    title: "Graphic Motif",
    lines: ["콜론의 과일이 과일, 시계, 회전하는 모티브로", "확장되어 브랜드의 생동감을 전합니다."]
  }, React.createElement(Photo, {
    src: PHOTO.pear,
    alt: "Pears",
    shade: 0.68
  }), React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: `repeat(3, ${Math.round(w * (m ? 0.3 : 0.21))}px)`,
      marginTop: m ? 40 : 0
    }
  }, [{
    k: "① 과일 활용",
    node: React.createElement("div", {
      style: {
        display: "flex",
        gap: fruitSize * 0.5,
        alignItems: "center",
        transform: `translateY(${fruitSize * 0.07}px)`
      }
    }, ["#5570B4", C.orange, "#E0605A"].map((c, j) => React.createElement(Fruit, {
      key: c,
      color: c,
      size: fruitSize,
      animation: `pn-hop 1.8s cubic-bezier(0.45, 0, 0.55, 1) ${j * 0.18}s infinite`
    })))
  }, {
    k: "② 아이콘 변형 (시계)",
    node: React.createElement(Clock, {
      size: fruitSize * 2.2
    })
  }, {
    k: "③ 회전 변형",
    node: React.createElement(Fruit, {
      color: C.orange,
      size: fruitSize * 2.2,
      animation: "pn-spin 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite"
    })
  }].map((it, i) => React.createElement(Reveal, {
    key: it.k,
    delay: i * 0.12,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: m ? 12 : 22
    }
  }, React.createElement("div", {
    style: {
      height: fruitSize * 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, it.node), React.createElement("span", {
    style: {
      ...small,
      opacity: 0.7,
      textAlign: "center"
    }
  }, it.k))))), React.createElement(Slide, {
    bg: C.white,
    color: C.brown,
    m: m,
    title: "Color Regulation",
    lines: ["배경색에 따라 지정된 로고 조합을 사용합니다."]
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: m ? 6 : Math.round(w * 0.012),
      marginTop: m ? 40 : 0
    }
  }, [[C.orange, ON_ORANGE], [C.ivory, ON_LIGHT], [C.brown, ON_BROWN]].map(([bg, tone], i) => React.createElement(Reveal, {
    key: bg,
    delay: i * 0.12
  }, React.createElement("div", {
    style: {
      background: bg,
      width: Math.round(w * (m ? 0.27 : 0.16)),
      aspectRatio: "3 / 4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Logo, {
    tone: tone,
    width: "66%",
    intro: true,
    delay: 0.2 + i * 0.15
  })))))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr"
    }
  }, React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: m ? "4 / 5" : "8 / 9",
      overflow: "hidden"
    }
  }, React.createElement(Photo, {
    src: PHOTO.spoon,
    alt: "Blueberries on a wooden spoon",
    position: "40% 55%"
  })), React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: m ? "4 / 3" : "8 / 9",
      background: C.orange,
      color: C.white,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: m ? "0 24px" : "0 12%"
    }
  }, React.createElement(Reveal, null, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: m ? 26 : Math.min(48, Math.round(w * 0.032)),
      lineHeight: 1.4,
      letterSpacing: "-0.02em",
      wordBreak: "keep-all"
    }
  }, "\uACFC\uC77C\uC758 \uC88B\uC740 \uC21C\uAC04\uC744,", React.createElement("br", null), "\uC77C\uC0C1\uC758 \uC2DD\uD0C1\uC73C\uB85C."), React.createElement("div", {
    style: {
      ...small,
      fontSize: m ? 11 : 12,
      marginTop: m ? 18 : 28,
      letterSpacing: "0.04em",
      opacity: 0.85
    }
  }, "THE BEST MOMENT OF FRUIT")))), React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: m ? "4 / 5" : "16 / 9",
      overflow: "hidden",
      background: "#F4F2FA",
      backgroundImage: "linear-gradient(rgba(91,79,216,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(91,79,216,0.07) 1px, transparent 1px)",
      backgroundSize: "32px 32px"
    }
  }, React.createElement(SlideTitle, {
    title: "Detail Page",
    lines: ["블루베리의 보라색을 포인트로 쓴 상세페이지.", "원산지, 구성, 알 크기를 먼저 보여줍니다."],
    color: C.brown,
    m: m
  }), React.createElement("div", {
    style: {
      position: "absolute",
      top: m ? "26%" : 0,
      bottom: 0,
      left: m ? "6%" : "24%",
      right: m ? "6%" : "24%",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "6%"
    }
  }, (() => {
    const gridW = w * (m ? 0.88 : 0.52);
    const colW = gridW * (1 - 0.12) / 3;
    const gridH = m ? w * 1.25 * 0.74 : w * 9 / 16;
    const span = gridH / colW * 1000;
    const tops = [-0.02, -0.02, -0.02];
    let s = 0;
    return tops.map((t, i) => {
      const c = {
        start: Math.round(s),
        top: `${t * 100}%`,
        tint: i === 1
      };
      s += span;
      return c;
    });
  })().map(c => React.createElement("div", {
    key: c.start,
    style: {
      position: "relative"
    }
  }, c.tint && React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "-9%",
      right: "-9%",
      background: "rgba(91,79,216,0.12)"
    }
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: c.top,
      bottom: "-2%"
    }
  }, React.createElement(PageCrop, {
    images: BLUEBERRY,
    heights: BLUEBERRY_H,
    start: c.start
  })))))), React.createElement(Slide, {
    bg: C.orange,
    color: C.white,
    m: m
  }, React.createElement(Logo, {
    tone: ON_ORANGE,
    width: m ? "64%" : "34%",
    intro: true,
    delay: 0.2,
    bob: true
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: m ? 20 : "4%",
      bottom: m ? 20 : "5.5%",
      ...small,
      color: C.white,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, "The best moment of fruit")));
}
addPropertyControls(PrunauGuideline, {
  adobeKit: {
    type: ControlType.String,
    title: "Adobe Fonts kit",
    placeholder: "e.g. abc1234",
    defaultValue: ""
  }
});(window.Guides = window.Guides || {}).PrunauGuideline = PrunauGuideline;
})();
(function () {
const addPropertyControls = () => {}; const ControlType = new Proxy({}, { get: (_, k) => k });
const IMG = "/assets/img/";
const C = {
  ink: "#121212",
  gold: "#C9A227",
  board: "#F2F1F5",
  paper: "#F6F5F2",
  muted: "#777"
};
const SANS = '"Pretendard", "Inter", "Apple SD Gothic Neo", system-ui, sans-serif';
const CSS = `
@keyframes rp-run { 0% { transform: translateX(-70%); opacity: 0; filter: blur(14px) } 4% { opacity: 1 } 13% { transform: translateX(3%); filter: blur(0) } 17%, 86% { transform: translateX(0); opacity: 1; filter: blur(0) } 94%, 100% { transform: translateX(45%); opacity: 0; filter: blur(12px) } }
@keyframes rp-ghost { 0% { transform: translateX(-70%); opacity: 0 } 5% { opacity: var(--o) } 15% { transform: translateX(0); opacity: 0 } 100% { opacity: 0 } }
@keyframes rp-sweep { 0% { transform: translateX(-110%); opacity: 0 } 3% { opacity: 1 } 14% { transform: translateX(110%); opacity: 0 } 100% { transform: translateX(110%); opacity: 0 } }
@keyframes rp-pop { 0%, 30% { transform: scale(0) rotate(-30deg) } 36% { transform: scale(1.12) rotate(4deg) } 40%, 88% { transform: scale(1) rotate(0) } 95%, 100% { transform: scale(0) } }
@keyframes rp-fade { 0%, 34% { opacity: 0 } 42%, 88% { opacity: 1 } 95%, 100% { opacity: 0 } }
@keyframes rp-lines { from { background-position: 0 0 } to { background-position: 46px 0 } }
` + [14, 18, 22, 27].map(a => `@keyframes rp-wipe-${a} { 0%, ${a}% { clip-path: inset(0 100% 0 0); transform: translateX(-24px) } ${a + 5}%, 88% { clip-path: inset(0 0 0 0); transform: translateX(0) } 95%, 100% { clip-path: inset(0 0 0 100%); transform: translateX(24px) } }`).join("\n") + `
@keyframes rp-cover-out { 0%, 82% { clip-path: inset(0 0 0 0) } 100% { clip-path: inset(0 0 0 100%) } }
@keyframes rp-cover-in { 0% { opacity: 0; transform: translateY(24px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes rp-cover-streak { 0%, 78% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
@media (prefers-reduced-motion: reduce) { .rp-intro * { animation: none !important; clip-path: none !important; opacity: 1 !important } .rp-cover { display: none } }
`;
const COVER = 3.4;
function useInView(threshold = 0.2) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}
function Reveal({
  children,
  delay = 0,
  style
}) {
  const [ref, seen] = useInView(0.12);
  return React.createElement("div", {
    ref: ref,
    style: {
      ...style,
      opacity: seen ? 1 : 0,
      transform: `translateY(${seen ? 0 : 30}px)`,
      transition: `opacity 1s ease ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
    }
  }, children);
}
function Note({
  title,
  text,
  side,
  m
}) {
  return React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: SANS,
      color: C.ink,
      maxWidth: 300
    }
  }, React.createElement("div", {
    style: {
      fontSize: m ? 13 : 14,
      fontWeight: 700,
      marginBottom: 8
    }
  }, title), React.createElement("div", {
    style: {
      fontSize: m ? 12 : 13,
      lineHeight: 1.75,
      color: "#555",
      wordBreak: "keep-all"
    }
  }, text), !m && React.createElement("div", {
    style: {
      position: "absolute",
      top: 9,
      [side === "left" ? "left" : "right"]: "calc(100% + 16px)",
      width: 90,
      borderTop: "1.5px dotted #B9B7C2"
    }
  }, React.createElement("span", {
    style: {
      position: "absolute",
      top: -4,
      [side === "left" ? "right" : "left"]: -3,
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#9E9CA8"
    }
  })));
}
function Page({
  file,
  alt,
  ratio
}) {
  return React.createElement("img", {
    src: `${IMG}${file}`,
    alt: alt,
    loading: "lazy",
    draggable: false,
    style: {
      width: "100%",
      aspectRatio: ratio,
      display: "block",
      borderRadius: 10,
      boxShadow: "0 30px 70px rgba(18,18,18,0.14)"
    }
  });
}
function Intro({
  m,
  w
}) {
  const dur = "6.4s";
  const play = (name, extra = 0) => `${name} ${dur} cubic-bezier(0.22, 1, 0.36, 1) ${COVER + extra}s infinite both`;
  const piece = (file, width, a, style) => React.createElement("img", {
    src: `${IMG}${file}`,
    alt: "",
    draggable: false,
    style: {
      display: "block",
      width,
      mixBlendMode: "multiply",
      clipPath: "inset(0 100% 0 0)",
      animation: play(`rp-wipe-${a}`),
      ...style
    }
  });
  const runnerW = m ? "64%" : "34%";
  return React.createElement("div", {
    className: "rp-intro",
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: m ? "4 / 5" : "16 / 9",
      background: C.paper,
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "repeating-linear-gradient(90deg, transparent 0 22px, rgba(201,162,39,0.20) 22px 23px)",
      WebkitMaskImage: "linear-gradient(90deg, #000 0, transparent 26%, transparent 74%, #000 100%)",
      maskImage: "linear-gradient(90deg, #000 0, transparent 26%, transparent 74%, #000 100%)",
      animation: "rp-lines 1.6s linear infinite"
    }
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: m ? "40%" : "22%",
      height: m ? "40%" : "60%",
      opacity: 0,
      backgroundImage: "repeating-linear-gradient(180deg, transparent 0 9px, rgba(18,18,18,0.16) 9px 10px, transparent 10px 23px, rgba(201,162,39,0.4) 23px 24px)",
      animation: play("rp-sweep")
    }
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: m ? "18%" : "50%",
      bottom: m ? "-6%" : "-8%",
      width: runnerW
    }
  }, [0.28, 0.14].map((o, i) => React.createElement("img", {
    key: o,
    src: `${IMG}rp-runner.png`,
    alt: "",
    draggable: false,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      opacity: 0,
      ["--o"]: o,
      animation: play("rp-ghost", (i + 1) * 0.07),
      filter: "blur(2px)"
    }
  })), React.createElement("img", {
    src: `${IMG}rp-runner.png`,
    alt: "Kim Kuk-young running with Runpl",
    draggable: false,
    style: {
      position: "relative",
      width: "100%",
      display: "block",
      opacity: 0,
      animation: play("rp-run")
    }
  })), React.createElement("div", {
    style: {
      position: "absolute",
      left: m ? "6%" : "9%",
      top: m ? "7%" : "16%",
      width: m ? "88%" : "40%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: m ? 6 : Math.round(w * 0.006)
    }
  }, piece("rp-t1.jpg", "56%", 14), piece("rp-t2.jpg", "64%", 18), piece("rp-t3.jpg", "86%", 22), piece("rp-t4.jpg", "88%", 27, {
    marginTop: m ? 4 : Math.round(w * 0.008)
  })), React.createElement("img", {
    src: `${IMG}rp-badge.png`,
    alt: "",
    draggable: false,
    style: {
      position: "absolute",
      left: m ? "5%" : "4%",
      bottom: m ? "4%" : "7%",
      width: m ? "22%" : "9%",
      transform: "scale(0)",
      animation: play("rp-pop")
    }
  }), React.createElement("img", {
    src: `${IMG}rp-logo.png`,
    alt: "Runpl",
    draggable: false,
    style: {
      position: "absolute",
      right: m ? "5%" : "4%",
      bottom: m ? "5%" : "7%",
      width: m ? "20%" : "9%",
      opacity: 0,
      filter: "grayscale(1) brightness(0.8)",
      animation: play("rp-fade")
    }
  }), React.createElement("div", {
    className: "rp-cover",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 5,
      background: "#F06721",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: m ? 18 : Math.round(w * 0.018),
      animation: `rp-cover-out ${COVER}s cubic-bezier(0.7, 0, 0.3, 1) both`,
      fontFamily: SANS
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: m ? 14 : Math.round(w * 0.022),
      animation: "rp-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both"
    }
  }, React.createElement("img", {
    src: `${IMG}atflee-white.svg`,
    alt: "atflee",
    draggable: false,
    style: {
      height: m ? 40 : Math.round(w * 0.05),
      display: "block"
    }
  }), React.createElement("span", {
    style: {
      fontSize: m ? 26 : Math.round(w * 0.03),
      fontWeight: 300,
      opacity: 0.85
    }
  }, "\xD7"), React.createElement("span", {
    style: {
      fontSize: m ? 30 : Math.round(w * 0.042),
      fontWeight: 800,
      letterSpacing: "-0.03em"
    }
  }, "\uAE40\uAD6D\uC601")), React.createElement("div", {
    style: {
      textAlign: "center",
      animation: "rp-cover-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both"
    }
  }, React.createElement("div", {
    style: {
      fontSize: m ? 16 : Math.min(26, Math.round(w * 0.017)),
      fontWeight: 600,
      letterSpacing: "-0.01em"
    }
  }, "\uC573\uD50C\uB9AC \uB7F0\uD50C \uC0C1\uC138\uD398\uC774\uC9C0 \uC81C\uC791"), React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: m ? 11 : 13,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      opacity: 0.8
    }
  }, "atflee \xD7 Kim Kuk-young Collaboration")), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, transparent 0, rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 65%, transparent 100%)",
      animation: `rp-cover-streak ${COVER}s cubic-bezier(0.7, 0, 0.3, 1) both`
    }
  })));
}
function RunplDetail() {
  const rootRef = React.useRef(null);
  const [w, setW] = React.useState(1440);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    setW(el.getBoundingClientRect().width || 1440);
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) setW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const m = w < 760;
  const pad = m ? 20 : Math.round(w * 0.04);
  const head = {
    display: "flex",
    gap: m ? 18 : 48,
    fontFamily: SANS,
    fontSize: m ? 12 : 14,
    color: C.ink
  };
  return React.createElement("div", {
    ref: rootRef,
    style: {
      width: "100%",
      fontFamily: SANS
    }
  }, React.createElement("style", null, CSS), React.createElement(Intro, {
    m: m,
    w: w
  }), React.createElement("section", {
    style: {
      background: C.board,
      padding: m ? "40px 20px 56px" : `${Math.round(w * 0.035)}px ${pad}px ${Math.round(w * 0.07)}px`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      ...head
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: m ? 18 : 48
    }
  }, React.createElement("span", null, "01"), React.createElement("span", null, "\uB7F0\uD50C \xD7 \uAE40\uAD6D\uC601")), React.createElement("span", null, "\uC0C1\uC138\uD398\uC774\uC9C0")), m ? React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 28,
      marginTop: 36
    }
  }, React.createElement(Note, {
    side: "left",
    m: true,
    title: "\uBA54\uC778 \uBE44\uC8FC\uC5BC",
    text: "100m \uD55C\uAD6D \uAE30\uB85D \uBCF4\uC720\uC790 \uAE40\uAD6D\uC601 \uCF54\uCE58\uC758 \uB2EC\uB9AC\uB294 \uCEF7 \uC704\uC5D0 \uB7F0\uD50C \uB85C\uACE0\uD0C0\uC785\uC744 \uD06C\uAC8C \uC62C\uB9AC\uACE0, \uC138\uB85C \uB77C\uC778\uC73C\uB85C \uC18D\uB3C4\uAC10\uC744 \uB354\uD588\uC2B5\uB2C8\uB2E4."
  }), React.createElement(Page, {
    file: "rp-d1.jpg",
    alt: "Runpl detail page, part 1",
    ratio: "900 / 1769"
  }), React.createElement(Note, {
    side: "right",
    m: true,
    title: "\uC778\uD130\uBDF0",
    text: "\uC120\uC218 \uC2DC\uC808 \uC0AC\uC9C4\uACFC \uAE40\uAD6D\uC601 \uCF54\uCE58\uC758 \uB9D0\uC744 \uC778\uC6A9\uC73C\uB85C \uB2F4\uC544, \uB7F0\uD50C\uC744 \uC4F0\uB294 \uC774\uC720\uB97C \uC9C1\uC811 \uC804\uD569\uB2C8\uB2E4."
  }), React.createElement(Page, {
    file: "rp-d2.jpg",
    alt: "Runpl detail page, part 2",
    ratio: "900 / 2928"
  })) : React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1.2fr 1.2fr 1fr",
      gap: Math.round(w * 0.03),
      marginTop: Math.round(w * 0.08),
      alignItems: "start"
    }
  }, React.createElement(Reveal, {
    style: {
      marginTop: Math.round(w * 0.06),
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: 110
    }
  }, React.createElement(Note, {
    side: "left",
    m: false,
    title: "\uBA54\uC778 \uBE44\uC8FC\uC5BC",
    text: "100m \uD55C\uAD6D \uAE30\uB85D \uBCF4\uC720\uC790 \uAE40\uAD6D\uC601 \uCF54\uCE58\uC758 \uB2EC\uB9AC\uB294 \uCEF7 \uC704\uC5D0 \uB7F0\uD50C \uB85C\uACE0\uD0C0\uC785\uC744 \uD06C\uAC8C \uC62C\uB9AC\uACE0, \uC138\uB85C \uB77C\uC778\uC73C\uB85C \uC18D\uB3C4\uAC10\uC744 \uB354\uD588\uC2B5\uB2C8\uB2E4."
  })), React.createElement(Reveal, null, React.createElement(Page, {
    file: "rp-d1.jpg",
    alt: "Runpl detail page, part 1",
    ratio: "900 / 1769"
  })), React.createElement(Reveal, {
    delay: 0.15,
    style: {
      marginTop: Math.round(w * 0.16)
    }
  }, React.createElement(Page, {
    file: "rp-d2.jpg",
    alt: "Runpl detail page, part 2",
    ratio: "900 / 2928"
  })), React.createElement(Reveal, {
    style: {
      marginTop: Math.round(w * 0.3),
      paddingLeft: 110
    }
  }, React.createElement(Note, {
    side: "right",
    m: false,
    title: "\uC778\uD130\uBDF0",
    text: "\uC120\uC218 \uC2DC\uC808 \uC0AC\uC9C4\uACFC \uAE40\uAD6D\uC601 \uCF54\uCE58\uC758 \uB9D0\uC744 \uC778\uC6A9\uC73C\uB85C \uB2F4\uC544, \uB7F0\uD50C\uC744 \uC4F0\uB294 \uC774\uC720\uB97C \uC9C1\uC811 \uC804\uD569\uB2C8\uB2E4."
  })))), React.createElement("section", {
    style: {
      background: "#fff",
      padding: m ? "40px 20px 56px" : `${Math.round(w * 0.035)}px ${pad}px ${Math.round(w * 0.06)}px`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      ...head
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: m ? 18 : 48
    }
  }, React.createElement("span", null, "02"), React.createElement("span", null, "\uB7F0\uD50C \xD7 \uAE40\uAD6D\uC601")), React.createElement("span", null, "\uC378\uB124\uC77C")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1.4fr 1fr",
      gap: m ? 24 : Math.round(w * 0.03),
      marginTop: m ? 32 : Math.round(w * 0.05),
      alignItems: "center"
    }
  }, !m && React.createElement("div", null), React.createElement(Reveal, null, React.createElement(Page, {
    file: "rp-thumb.jpg",
    alt: "Runpl x Kim Kuk-young thumbnail",
    ratio: "1 / 1"
  })), React.createElement(Reveal, {
    delay: 0.15,
    style: {
      paddingLeft: m ? 0 : 110
    }
  }, React.createElement(Note, {
    side: "right",
    m: m,
    title: "\uC378\uB124\uC77C",
    text: "\uC81C\uD488\uC744 \uB4E0 \uC815\uBA74 \uCEF7\uACFC \uB2EC\uB9AC\uB294 \uCEF7\uC744 \uACB9\uCE58\uACE0, '100m \uD55C\uAD6D\uAE30\uB85D \uBCF4\uC720\uC790 \uAE40\uAD6D\uC601 PICK' \uBC30\uC9C0\uB85C \uC2E0\uB8B0\uB97C \uB354\uD588\uC2B5\uB2C8\uB2E4."
  })))));
}(window.Guides = window.Guides || {}).RunplDetail = RunplDetail;
})();
