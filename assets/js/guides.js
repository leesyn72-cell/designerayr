(function () {
const addPropertyControls = () => {}; const ControlType = new Proxy({}, { get: (_, k) => k });
const IMG = "/assets/img/";
const C = {
  paper: "#FDF3F2",
  pink: "#F8D4D3",
  rose: "#EE8E8C",
  line: "#2F2A2A",
  pivot: "#E5574F",
  joint: "#7C6BD6",
  purple: "#5B5BD6",
  yellow: "#F8E39C",
  mint: "#9BD8B1",
  ink: "#111111",
  muted: "#777777"
};
const SANS = '"Pretendard", "Inter", "Apple SD Gothic Neo", system-ui, sans-serif';
const SERIF = '"Instrument Serif", "Times New Roman", serif';
const CSS = `
.mq g { transform-box: view-box; }
@keyframes mq-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
@keyframes mq-head { 0%, 100% { transform: rotate(-5deg) } 50% { transform: rotate(6deg) } }
@keyframes mq-wave-up { 0%, 100% { transform: rotate(-148deg) } 50% { transform: rotate(-160deg) } }
@keyframes mq-wave-lo { 0%, 100% { transform: rotate(-28deg) } 50% { transform: rotate(32deg) } }
@keyframes mq-idle-up { 0%, 100% { transform: rotate(8deg) } 50% { transform: rotate(14deg) } }
@keyframes mq-idle-lo { 0%, 100% { transform: rotate(-6deg) } 50% { transform: rotate(-16deg) } }
@keyframes mq-walk-ul { 0%, 100% { transform: rotate(18deg) } 50% { transform: rotate(-18deg) } }
@keyframes mq-walk-ur { 0%, 100% { transform: rotate(-18deg) } 50% { transform: rotate(18deg) } }
@keyframes mq-walk-knee { 0%, 50%, 100% { transform: rotate(0deg) } 25%, 75% { transform: rotate(-22deg) } }
@keyframes mq-walk-al { 0%, 100% { transform: rotate(-22deg) } 50% { transform: rotate(22deg) } }
@keyframes mq-walk-ar { 0%, 100% { transform: rotate(22deg) } 50% { transform: rotate(-22deg) } }
@keyframes mq-walk-elbow { 0%, 100% { transform: rotate(-18deg) } 50% { transform: rotate(-6deg) } }
@keyframes mq-walk-bob { 0%, 50%, 100% { transform: translateY(0) } 25%, 75% { transform: translateY(-6px) } }
@keyframes ml-swing { 0%, 100% { transform: rotate(26deg) } 50% { transform: rotate(-26deg) } }
@keyframes ml-lag { 0%, 100% { transform: rotate(-12deg) } 50% { transform: rotate(12deg) } }
@keyframes ml-legs { 0%, 100% { transform: rotate(-20deg) } 50% { transform: rotate(20deg) } }
@keyframes ml-bounce {
    0%   { transform: translateY(0) scale(1.18, 0.78) }
    10%  { transform: translateY(-40%) scale(0.92, 1.1) }
    45%  { transform: translateY(-170%) scale(1, 1) }
    80%  { transform: translateY(-40%) scale(0.92, 1.1) }
    90%  { transform: translateY(0) scale(1, 1) }
    100% { transform: translateY(0) scale(1.18, 0.78) }
}
@keyframes ml-shadow { 0%, 90%, 100% { transform: scaleX(1); opacity: 0.35 } 45% { transform: scaleX(0.45); opacity: 0.12 } }
@keyframes ml-float { 0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)) } 50% { transform: translateY(-10px) rotate(calc(var(--r, 0deg) + 20deg)) } }
@keyframes ml-path { from { offset-distance: 0% } to { offset-distance: 100% } }
@keyframes ml-dash { to { stroke-dashoffset: -24 } }
`;
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
  const [ref, seen] = useInView();
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
function Pivot({
  x = 0,
  y = 0,
  s = 18
}) {
  return React.createElement("rect", {
    x: x - s / 2,
    y: y - s / 2,
    width: s,
    height: s,
    fill: "none",
    stroke: C.pivot,
    strokeWidth: 1.2,
    strokeDasharray: "3 2.5"
  });
}
function Joint({
  x = 0,
  y = 0
}) {
  return React.createElement("circle", {
    cx: x,
    cy: y,
    r: 4.5,
    fill: "none",
    stroke: C.joint,
    strokeWidth: 1.4
  });
}
function Limb({
  x,
  y,
  upper,
  lower,
  len1,
  len2,
  w1,
  w2,
  end,
  anim
}) {
  const seg = (len, w) => React.createElement("rect", {
    x: -w / 2,
    y: -w / 2,
    width: w,
    height: len + w / 2,
    rx: w / 2,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  });
  const tip = end === "hand" ? React.createElement("g", null, React.createElement("rect", {
    x: -11,
    y: -2,
    width: 22,
    height: 20,
    rx: 8,
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("rect", {
    x: -11,
    y: 12,
    width: 22,
    height: 6,
    rx: 3,
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.2
  })) : React.createElement("path", {
    d: "M -13 -4 L 13 -4 L 15 18 Q 0 26 -15 18 Z",
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.6
  });
  return React.createElement("g", {
    transform: `translate(${x} ${y})`
  }, React.createElement("g", {
    style: {
      animation: anim[0]
    }
  }, seg(len1, w1), React.createElement(Joint, null), React.createElement(Pivot, {
    s: w1 + 6
  }), React.createElement("g", {
    transform: `translate(0 ${len1})`
  }, React.createElement("g", {
    style: {
      animation: anim[1]
    }
  }, seg(len2, w2), React.createElement(Joint, null), React.createElement("g", {
    transform: `translate(0 ${len2})`
  }, tip)))));
}
function Mannequin({
  pose,
  width,
  showPivots = true
}) {
  const walk = pose === "walk";
  const wave = pose === "wave";
  const hold = pose === "hold";
  const t = walk ? "0.9s" : "2.4s";
  const ani = (name, dur = t, delay = "0s") => `${name} ${dur} ease-in-out ${delay} infinite`;
  const armR = wave ? [ani("mq-wave-up"), ani("mq-wave-lo", "0.8s")] : walk ? [ani("mq-walk-ar"), ani("mq-walk-elbow")] : hold ? ["none", "none"] : [ani("mq-idle-up"), ani("mq-idle-lo")];
  const armL = walk ? [ani("mq-walk-al"), ani("mq-walk-elbow")] : hold ? ["none", "none"] : [ani("mq-idle-up", t, "-1.2s"), ani("mq-idle-lo", t, "-1.2s")];
  const legR = walk ? [ani("mq-walk-ul"), ani("mq-walk-knee")] : ["none", "none"];
  const legL = walk ? [ani("mq-walk-ur"), ani("mq-walk-knee", t, "-0.45s")] : ["none", "none"];
  return React.createElement("svg", {
    className: "mq",
    viewBox: "0 0 240 420",
    width: width,
    style: {
      display: "block",
      overflow: "visible",
      ["--pv"]: showPivots ? 1 : 0
    }
  }, React.createElement("g", {
    style: {
      animation: walk ? ani("mq-walk-bob") : ani("mq-bob", "2.4s")
    }
  }, React.createElement(Limb, {
    x: 104,
    y: 244,
    len1: 78,
    len2: 74,
    w1: 30,
    w2: 28,
    end: "foot",
    anim: legR
  }), React.createElement(Limb, {
    x: 136,
    y: 244,
    len1: 78,
    len2: 74,
    w1: 30,
    w2: 28,
    end: "foot",
    anim: legL
  }), React.createElement(Limb, {
    x: hold ? 82 : 86,
    y: 146,
    len1: 58,
    len2: 54,
    w1: 24,
    w2: 22,
    end: "hand",
    anim: hold ? ["none", "none"] : armL
  }), React.createElement("rect", {
    x: 84,
    y: 128,
    width: 72,
    height: 108,
    rx: 18,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("rect", {
    x: 80,
    y: 226,
    width: 80,
    height: 30,
    rx: 9,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement(Joint, {
    x: 120,
    y: 241
  }), React.createElement(Pivot, {
    x: 120,
    y: 241,
    s: 22
  }), React.createElement("g", {
    transform: "translate(120 128)"
  }, React.createElement("g", {
    style: {
      animation: ani("mq-head", "2.4s")
    }
  }, React.createElement("rect", {
    x: -9,
    y: -16,
    width: 18,
    height: 20,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("circle", {
    cx: 0,
    cy: -62,
    r: 52,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("g", {
    transform: "translate(0 -62) rotate(18)"
  }, React.createElement(Pivot, {
    s: 40
  })), React.createElement(Joint, {
    x: 0,
    y: -62
  }))), React.createElement(Limb, {
    x: hold ? 158 : 154,
    y: 146,
    len1: 58,
    len2: 54,
    w1: 24,
    w2: 22,
    end: "hand",
    anim: armR
  })));
}
function BouncingBall({
  size
}) {
  return React.createElement("div", {
    style: {
      position: "relative",
      width: size * 3,
      height: size * 3.4,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center"
    }
  }, [0.2, 0.42, 0.62].map((k, i) => React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: `${12 + i * 12}%`,
      bottom: `${k * 100}%`,
      width: size * 0.8,
      height: size * 0.8,
      borderRadius: "50%",
      background: C.rose,
      opacity: 0.18 + i * 0.06
    }
  })), React.createElement("div", {
    style: {
      position: "absolute",
      bottom: -6,
      width: size * 0.9,
      height: 10,
      borderRadius: "50%",
      background: C.line,
      animation: "ml-shadow 1.1s cubic-bezier(0.45, 0, 0.55, 1) infinite"
    }
  }), React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: C.rose,
      border: `1.6px solid ${C.line}`,
      transformOrigin: "50% 100%",
      animation: "ml-bounce 1.1s cubic-bezier(0.45, 0, 0.55, 1) infinite"
    }
  }));
}
function Swing({
  width
}) {
  return React.createElement("svg", {
    className: "mq",
    viewBox: "0 0 300 380",
    width: width,
    style: {
      display: "block",
      overflow: "visible"
    }
  }, React.createElement("line", {
    x1: 40,
    y1: 10,
    x2: 260,
    y2: 10,
    stroke: C.line,
    strokeWidth: 2
  }), React.createElement("rect", {
    x: 136,
    y: 2,
    width: 28,
    height: 16,
    rx: 4,
    fill: C.yellow,
    stroke: C.line,
    strokeWidth: 1.4
  }), React.createElement("g", {
    transform: "translate(150 10)"
  }, React.createElement(Pivot, {
    s: 20
  }), React.createElement("g", {
    style: {
      animation: "ml-swing 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite"
    }
  }, React.createElement("line", {
    x1: -34,
    y1: 0,
    x2: -34,
    y2: 250,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("line", {
    x1: 34,
    y1: 0,
    x2: 34,
    y2: 250,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("rect", {
    x: -52,
    y: 248,
    width: 104,
    height: 12,
    rx: 4,
    fill: C.purple,
    stroke: C.line,
    strokeWidth: 1.4
  }), React.createElement("g", {
    transform: "translate(0 250)"
  }, React.createElement("g", {
    style: {
      animation: "ml-lag 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.35s infinite"
    }
  }, React.createElement("rect", {
    x: -24,
    y: -70,
    width: 48,
    height: 64,
    rx: 14,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("g", {
    transform: "translate(0 -70)"
  }, React.createElement("g", {
    style: {
      animation: "ml-lag 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.6s infinite"
    }
  }, React.createElement("circle", {
    cx: 0,
    cy: -36,
    r: 34,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("g", {
    transform: "translate(0 -36) rotate(14)"
  }, React.createElement(Pivot, {
    s: 26
  })), React.createElement(Joint, {
    x: 0,
    y: -36
  }))), React.createElement("rect", {
    x: -42,
    y: -58,
    width: 16,
    height: 16,
    rx: 6,
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.4
  }), React.createElement("rect", {
    x: 26,
    y: -58,
    width: 16,
    height: 16,
    rx: 6,
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.4
  })), React.createElement("g", {
    transform: "translate(-12 6)"
  }, React.createElement("g", {
    style: {
      animation: "ml-legs 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.5s infinite"
    }
  }, React.createElement("rect", {
    x: -9,
    y: 0,
    width: 18,
    height: 62,
    rx: 9,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("path", {
    d: "M -10 58 L 10 58 L 12 72 Q 0 78 -12 72 Z",
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.4
  }))), React.createElement("g", {
    transform: "translate(12 6)"
  }, React.createElement("g", {
    style: {
      animation: "ml-legs 2.2s cubic-bezier(0.45, 0, 0.55, 1) -0.62s infinite"
    }
  }, React.createElement("rect", {
    x: -9,
    y: 0,
    width: 18,
    height: 62,
    rx: 9,
    fill: C.pink,
    stroke: C.line,
    strokeWidth: 1.6
  }), React.createElement("path", {
    d: "M -10 58 L 10 58 L 12 72 Q 0 78 -12 72 Z",
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.4
  })))))));
}
function BezierPath({
  width
}) {
  const d = "M 20 180 C 90 -40, 230 -40, 300 180";
  return React.createElement("div", {
    style: {
      position: "relative",
      width,
      aspectRatio: "320 / 200"
    }
  }, React.createElement("svg", {
    viewBox: "0 0 320 200",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      overflow: "visible"
    }
  }, React.createElement("path", {
    d: d,
    fill: "none",
    stroke: C.line,
    strokeWidth: 1.4
  }), React.createElement("line", {
    x1: 20,
    y1: 180,
    x2: 90,
    y2: -40,
    stroke: C.line,
    strokeWidth: 0.8,
    strokeDasharray: "4 4",
    style: {
      animation: "ml-dash 1.2s linear infinite"
    }
  }), React.createElement("line", {
    x1: 300,
    y1: 180,
    x2: 230,
    y2: -40,
    stroke: C.line,
    strokeWidth: 0.8,
    strokeDasharray: "4 4",
    style: {
      animation: "ml-dash 1.2s linear infinite"
    }
  }), [[20, 180], [300, 180]].map(([x, y]) => React.createElement("rect", {
    key: x,
    x: x - 6,
    y: y - 6,
    width: 12,
    height: 12,
    fill: C.yellow,
    stroke: C.line,
    strokeWidth: 1.2
  })), [[90, -40], [230, -40]].map(([x, y]) => React.createElement("circle", {
    key: x,
    cx: x,
    cy: y,
    r: 5,
    fill: "#fff",
    stroke: C.line,
    strokeWidth: 1.2
  }))), React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 22,
      height: 22,
      marginLeft: -11,
      marginTop: -11,
      borderRadius: "50%",
      background: C.rose,
      border: `1.6px solid ${C.line}`,
      offsetPath: `path("${d}")`,
      animation: "ml-path 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate",
      transform: `scale(${width / 320})`,
      transformOrigin: "0 0"
    }
  }));
}
function Confetti({
  items
}) {
  return React.createElement(React.Fragment, null, items.map((it, i) => React.createElement("div", {
    key: i,
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: it.x,
      top: it.y,
      width: it.s,
      height: it.s,
      background: it.shape === "tri" ? "none" : it.c,
      borderRadius: it.shape === "dot" ? "50%" : 2,
      borderLeft: it.shape === "tri" ? `${it.s / 2}px solid transparent` : undefined,
      borderRight: it.shape === "tri" ? `${it.s / 2}px solid transparent` : undefined,
      borderBottom: it.shape === "tri" ? `${it.s}px solid ${it.c}` : undefined,
      ["--r"]: `${it.r || 0}deg`,
      animation: `ml-float ${3 + (it.d || 0)}s ease-in-out ${-(i * 0.7)}s infinite`
    }
  })));
}
function MotionLecture() {
  const rootRef = React.useRef(null);
  const [w, setW] = React.useState(1440);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
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
    fontSize: 12,
    lineHeight: 1.6,
    letterSpacing: "0.02em"
  };
  const body = {
    fontFamily: SANS,
    fontSize: m ? 13 : 15,
    lineHeight: 1.75,
    margin: 0,
    wordBreak: "keep-all",
    color: C.ink
  };
  const titleSize = m ? 40 : Math.min(84, Math.round(w * 0.058));
  const lessons = [{
    n: "1",
    title: "도형을 변형하여\n공 튀기는 모션 만들기",
    stage: React.createElement(BouncingBall, {
      size: m ? 44 : 56
    }),
    points: ["모션에 대한 기본 지식을 공이 튀는 모습을 통해 쉽게 이해할 수 있습니다.", "키프레임 어시스턴트의 Easy-Ease, Easy-In, Easy-Out을 심도 있게 이해할 수 있습니다.", "Bezier 곡선을 이해하고 활용할 수 있습니다."]
  }, {
    n: "2",
    title: "시간 차를 활용하여\n그네 타는 모션 만들기",
    stage: React.createElement(Swing, {
      width: m ? 200 : 240
    }),
    points: ["실제 동영상을 통해 그네와 사람의 움직임을 단순한 동작으로 구분할 수 있습니다.", "시간 차의 개념을 심도 있게 이해할 수 있습니다.", "2등신 캐릭터의 신체 움직임과 모션블러의 원리를 이해할 수 있습니다."]
  }, {
    n: "3",
    title: "듀익 바셀을 활용하여\n인체 모션 만들기",
    stage: React.createElement(Mannequin, {
      pose: "walk",
      width: m ? 150 : 180
    }),
    points: ["<듀익 바셀> 플러그인을 이해하고 사용할 수 있습니다.", "신체의 관절을 분리하여 사고하고 정확한 관절에 모션을 줄 수 있습니다.", "Walk Cycle을 이해하고 걷는 모션을 GIF로 저장할 수 있습니다."]
  }];
  const confetti = [{
    x: "8%",
    y: "18%",
    c: C.yellow,
    s: 14,
    shape: "sq",
    r: 20
  }, {
    x: "46%",
    y: "10%",
    c: C.mint,
    s: 12,
    shape: "tri",
    d: 1
  }, {
    x: "52%",
    y: "78%",
    c: C.purple,
    s: 9,
    shape: "dot",
    d: 0.5
  }, {
    x: "90%",
    y: "16%",
    c: C.rose,
    s: 12,
    shape: "sq",
    r: 45,
    d: 1.4
  }, {
    x: "94%",
    y: "70%",
    c: C.yellow,
    s: 16,
    shape: "tri",
    d: 0.8
  }, {
    x: "30%",
    y: "86%",
    c: C.mint,
    s: 10,
    shape: "dot",
    d: 1.2
  }];
  return React.createElement("div", {
    ref: rootRef,
    style: {
      width: "100%",
      fontFamily: SANS,
      color: C.ink
    }
  }, React.createElement("style", null, CSS), React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: C.paper,
      backgroundImage: "linear-gradient(rgba(238,142,140,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(238,142,140,0.12) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      padding: m ? "56px 20px 40px" : `${Math.round(w * 0.06)}px ${pad}px`,
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1.1fr 1fr",
      alignItems: "center",
      gap: m ? 24 : pad
    }
  }, React.createElement(Confetti, {
    items: confetti
  }), React.createElement("div", {
    style: {
      position: "relative"
    }
  }, React.createElement("div", {
    style: {
      ...small,
      color: C.muted,
      textTransform: "uppercase",
      marginBottom: m ? 18 : 28
    }
  }, "Poster \xB7 Leaflet \xB7 Banner"), React.createElement("h2", {
    style: {
      margin: 0,
      fontWeight: 800,
      fontSize: titleSize,
      lineHeight: 1.12,
      letterSpacing: "-0.03em"
    }
  }, "2D \uBAA8\uC158 \uADF8\uB798\uD53D", React.createElement("br", null), "\uC785\uBB38 ", React.createElement("span", {
    style: {
      display: "inline-block",
      background: C.purple,
      color: "#fff",
      borderRadius: 999,
      padding: "0 0.28em",
      lineHeight: 1.05
    }
  }, "\uBB34\uB8CC"), " \uD2B9\uAC15"), React.createElement("div", {
    style: {
      marginTop: m ? 14 : 20,
      fontFamily: SERIF,
      fontStyle: "italic",
      fontSize: m ? 22 : 30,
      color: C.purple,
      borderBottom: `2px solid ${C.purple}`,
      display: "inline-block",
      lineHeight: 1.1
    }
  }, "with Designer yulim"), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginTop: m ? 28 : 48,
      fontWeight: 800,
      fontSize: m ? 22 : 30,
      letterSpacing: "-0.02em"
    }
  }, React.createElement("span", null, "06.11"), React.createElement("span", {
    style: {
      width: m ? 48 : 80,
      height: 2,
      background: C.ink
    }
  }), React.createElement("span", null, "07.11"))), React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      gap: m ? 8 : 24
    }
  }, React.createElement(Mannequin, {
    pose: "wave",
    width: m ? 200 : Math.min(300, Math.round(w * 0.2))
  }), React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, React.createElement(BouncingBall, {
    size: m ? 34 : 44
  })))), React.createElement("section", {
    style: {
      padding: m ? "56px 20px" : `${Math.round(w * 0.06)}px ${pad}px`
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1fr 1fr",
      gap: m ? 28 : pad * 1.5,
      alignItems: "center",
      marginBottom: m ? 40 : 72
    }
  }, React.createElement(Reveal, null, React.createElement("div", {
    style: {
      ...small,
      color: C.rose,
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "Concept"), React.createElement("p", {
    style: body
  }, "\uAC00\uC0C1\uC758 \uBAA8\uC158\uADF8\uB798\uD53D \uC785\uBB38 \uBB34\uB8CC \uD2B9\uAC15\uC744 \uD64D\uBCF4\uD558\uB294 \uD64D\uBCF4\uBB3C\uC744 \uC81C\uC791\uD588\uC2B5\uB2C8\uB2E4. \uC560\uD504\uD130\uC774\uD399\uD2B8\uB85C \uC6C0\uC9C1\uC784\uC744 \uC904 \uB54C \uAE30\uC900\uC774 \uB418\uB294 \uAD00\uC808\uC758 \uC704\uCE58(\uC575\uCEE4 \uD3EC\uC778\uD2B8)\uC640 \uC778\uD50C\uB8E8\uC5B8\uC2A4\uB97C \uD65C\uC6A9\uD55C \uC18D\uB3C4 \uC870\uC808\uC744 \uC2DC\uAC01\uC801\uC73C\uB85C \uB4DC\uB7EC\uB0B4, \uBAA8\uC158\uADF8\uB798\uD53D \uD2B9\uAC15\uC784\uC744 \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4."), React.createElement("p", {
    style: {
      ...body,
      marginTop: 14,
      color: C.muted
    }
  }, "\uC5B4\uB835\uAC8C \uB290\uAEF4\uC9C8 \uC218 \uC788\uB294 \uBAA8\uC158\uADF8\uB798\uD53D\uC744 \uBD80\uB4DC\uB7EC\uC6B4 \uD30C\uC2A4\uD154 \uADF8\uB798\uD53D\uC73C\uB85C \uCE5C\uADFC\uD558\uAC8C \uD480\uACE0, \uC120\uC744 \uC720\uC5F0\uD558\uAC8C \uADF8\uB824 \uBAA8\uC158\uAC10\uC744 \uC0B4\uB838\uC2B5\uB2C8\uB2E4.")), React.createElement(Reveal, {
    delay: 0.15,
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, React.createElement(BezierPath, {
    width: m ? 280 : Math.min(420, Math.round(w * 0.28))
  }))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)",
      gap: m ? 16 : 20
    }
  }, ["05", "06", "07"].map((p, i) => React.createElement(Reveal, {
    key: p,
    delay: i * 0.12
  }, React.createElement("img", {
    src: `${IMG}mo-poster-${p}.jpg`,
    alt: `Poster ${i + 1}`,
    loading: "lazy",
    style: {
      width: "100%",
      height: "auto",
      display: "block",
      boxShadow: "0 24px 60px rgba(47,42,42,0.12)"
    }
  }))))), React.createElement("section", {
    style: {
      background: C.paper,
      padding: m ? "56px 20px" : `${Math.round(w * 0.06)}px ${pad}px`
    }
  }, React.createElement(Reveal, null, React.createElement("div", {
    style: {
      ...small,
      color: C.rose,
      textTransform: "uppercase",
      marginBottom: 10
    }
  }, "Curriculum"), React.createElement("p", {
    style: {
      ...body,
      maxWidth: 560,
      marginBottom: m ? 32 : 56
    }
  }, "\uD2B9\uAC15\uC5D0\uC11C \uBC30\uC6B0\uB294 \uC138 \uAC00\uC9C0 \uD575\uC2EC \uB3D9\uC791\uC744, \uB9AC\uD50C\uB81B \uC18D \uCE90\uB9AD\uD130\uC640 \uC544\uC774\uCF58 \uADF8\uB300\uB85C \uC6C0\uC9C1\uC774\uAC8C \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4.")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)",
      gap: m ? 16 : 20
    }
  }, lessons.map((l, i) => React.createElement(Reveal, {
    key: l.n,
    delay: i * 0.12,
    style: {
      background: "#fff",
      border: "1px solid rgba(47,42,42,0.08)",
      padding: m ? 20 : 28,
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, React.createElement("h3", {
    style: {
      margin: 0,
      whiteSpace: "pre-line",
      fontSize: m ? 18 : 20,
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-0.02em"
    }
  }, l.title), React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: m ? 44 : 56,
      lineHeight: 0.9,
      color: C.rose
    }
  }, l.n)), React.createElement("div", {
    style: {
      height: m ? 240 : 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "16px 0"
    }
  }, l.stage), React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, l.points.map(t => React.createElement("li", {
    key: t,
    style: {
      display: "flex",
      gap: 10,
      fontSize: 13,
      lineHeight: 1.6,
      wordBreak: "keep-all"
    }
  }, React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 10,
      height: 10,
      marginTop: 5,
      borderRadius: "50%",
      background: C.mint,
      border: `1px solid ${C.line}`
    }
  }), t))))))), ["04", "03", "02", "01", "09"].map(p => React.createElement("img", {
    key: p,
    src: `${IMG}mo-board-${p}.jpg`,
    alt: "Motion graphics lecture board",
    loading: "lazy",
    style: {
      width: "100%",
      height: "auto",
      display: "block"
    }
  })));
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
const COLOR = {
  red: "#F91515",
  pink: "#FFDFD7",
  black: "#0A0203"
};
const SERIF = '"Instrument Serif", "Times New Roman", serif';
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
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
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
  }, React.createElement("img", {
    src: A.wordmark[word],
    alt: "tandanji",
    style: wipe(0, 1.4),
    draggable: false
  }), React.createElement("img", {
    src: A.script[script],
    alt: "office meal",
    style: wipe(0.75, 1.3),
    draggable: false
  }));
}
function Symbol({
  tone,
  solid,
  size,
  style
}) {
  return React.createElement("img", {
    src: (solid ? A.symSolid : A.symLine)[tone],
    alt: "O symbol",
    draggable: false,
    style: {
      width: size,
      height: size,
      display: "block",
      ...style
    }
  });
}
function Label({
  n,
  title,
  color
}) {
  return React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      fontFamily: SANS,
      fontSize: 12,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color
    }
  }, React.createElement("span", {
    style: {
      opacity: 0.55
    }
  }, n), React.createElement("span", null, title));
}
function OfficeMealGuideline(props) {
  const rootRef = React.useRef(null);
  const [w, setW] = React.useState(1440);
  const [hot, setHot] = React.useState(null);
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
  const section = (bg, extra) => ({
    background: bg,
    padding: `${m ? 64 : Math.round(w * 0.07)}px ${pad}px`,
    position: "relative",
    overflow: "hidden",
    ...extra
  });
  const big = Math.min(m ? 30 : w * 0.046, 76);
  const body = {
    fontFamily: SANS,
    fontSize: m ? 13 : 15,
    lineHeight: 1.75,
    margin: 0,
    wordBreak: "keep-all"
  };
  const colors = [{
    tone: "red",
    name: "Office meal red",
    pantone: "2347 C",
    rgb: "249 21 21",
    cmyk: "0 94 100 0",
    hex: "#F91515",
    text: "#FFDFD7",
    copy: "음식과 식욕을 자연스럽게 연상시키는 컬러로, 브랜드의 에너지와 주목성을 강화합니다."
  }, {
    tone: "pink",
    name: "Office meal pink beige",
    pantone: "698 C",
    rgb: "255 223 215",
    cmyk: "0 15 3 0",
    hex: "#FFDFD7",
    text: "#F91515",
    copy: "따뜻하고 편안한 식사 경험을 전달합니다."
  }, {
    tone: "black",
    name: "Office meal black",
    pantone: "Black 6 C",
    rgb: "10 2 3",
    cmyk: "100 61 32 96",
    hex: "#0A0203",
    text: "#FFDFD7",
    copy: "정보 전달의 안정감과 전문성을 담당합니다."
  }];
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
  }, React.createElement("img", {
    src: A.wordmark[word],
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    },
    draggable: false
  }), React.createElement("img", {
    src: A.script[script],
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    },
    draggable: false
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
    style: section(COLOR.red, {
      minHeight: m ? 520 : Math.round(w * 0.62),
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    })
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: 16,
      fontFamily: SANS,
      fontSize: 12,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: COLOR.pink
    }
  }, React.createElement("span", null, "Tandanji Office Meal"), React.createElement("span", {
    style: {
      textAlign: m ? "right" : "left"
    }
  }, "Brand Guidelines"), !m && React.createElement("span", null, "Logo & Color System"), !m && React.createElement("span", {
    style: {
      textAlign: "right"
    }
  }, "Ver 2.0 \u2014 2026")), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: m ? "40px 0" : 0
    }
  }, React.createElement(Lockup, {
    word: "pink",
    script: "pink",
    width: m ? "86%" : "58%",
    delay: 0.2
  })), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "end",
      color: COLOR.pink,
      fontFamily: SANS,
      fontSize: 12,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, React.createElement("span", null, "Logo \xB7 Symbol \xB7 Color"), React.createElement(Symbol, {
    tone: "pink",
    size: m ? 28 : 40,
    style: {
      animation: "om-spin 14s linear infinite"
    }
  }))), React.createElement("div", {
    style: section(COLOR.pink, {
      color: COLOR.black
    })
  }, React.createElement(Label, {
    n: "00",
    title: "Overview",
    color: COLOR.red
  }), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "1.4fr 1fr",
      gap: m ? 28 : pad * 1.5,
      marginTop: m ? 28 : 48,
      alignItems: "end"
    }
  }, React.createElement(Reveal, null, React.createElement("p", {
    style: {
      fontFamily: SERIF,
      fontSize: big,
      lineHeight: 1.08,
      margin: 0,
      color: COLOR.red,
      letterSpacing: "-0.01em"
    }
  }, "A soft, handwritten script that carries tandanji\u2019s warmth into every office meal.")), React.createElement(Reveal, {
    delay: 0.15
  }, React.createElement("p", {
    style: body
  }, "office meal\uC744 \uC2A4\uD06C\uB9BD\uD2B8 \uC11C\uCCB4\uB85C \uC801\uC6A9\uD574, \uC0C1\uB2E8 tandanji \uB85C\uACE0\uC758 \uBD80\uB4DC\uB7FD\uACE0 \uC720\uAE30\uC801\uC778 \uBB34\uB4DC\uC640 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC5F0\uACB0\uD55C \uB85C\uACE0\uC785\uB2C8\uB2E4. \uACE1\uC120\uAC10\uC774 \uAC15\uD55C \uC601\uBB38 \uC11C\uCCB4\uB294 \uAE30\uC874 \uB85C\uACE0\uC758 \uAC1C\uC131\uACFC \uCE5C\uADFC\uD55C \uC778\uC0C1\uC744 \uAC15\uC870\uD558\uACE0, \uC74C\uC2DD \uBE0C\uB79C\uB4DC\uAC00 \uAC00\uC9C4 \uB530\uB73B\uD568\uACFC \uAC10\uC131\uC801\uC778 \uBD84\uC704\uAE30\uB97C \uB354\uD569\uB2C8\uB2E4.")))), React.createElement("div", {
    style: section("#FFFFFF")
  }, React.createElement(Label, {
    n: "01",
    title: "Primary Logo",
    color: COLOR.red
  }), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: m ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: m ? 36 : pad * 1.6,
      padding: m ? "56px 0 40px" : `${Math.round(w * 0.08)}px 0`
    }
  }, React.createElement(Lockup, {
    word: "red",
    script: "black",
    width: m ? "88%" : "52%"
  }), React.createElement(Reveal, {
    delay: 1.2
  }, React.createElement(Symbol, {
    tone: "red",
    solid: true,
    size: m ? 84 : Math.round(w * 0.085)
  }))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)",
      gap: m ? 14 : 24,
      borderTop: "1px solid rgba(10,2,3,0.12)",
      paddingTop: 18
    }
  }, [["Wordmark", "tandanji"], ["Script", "office meal"], ["Symbol", "O"]].map(([k, v]) => React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: SANS,
      fontSize: 13,
      color: COLOR.black
    }
  }, React.createElement("span", {
    style: {
      opacity: 0.5
    }
  }, k), React.createElement("span", null, v))))), React.createElement("div", {
    style: section("#F4F1EE")
  }, React.createElement(Label, {
    n: "02",
    title: "Logo Structure",
    color: COLOR.red
  }), React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      padding: m ? "72px 0 88px" : `${Math.round(w * 0.075)}px 0 ${Math.round(w * 0.09)}px`
    }
  }, React.createElement("div", {
    style: {
      position: "relative",
      width: m ? "86%" : "50%",
      aspectRatio: `${LOGO_RATIO}`,
      ["--om-gap"]: m ? "22px" : `${Math.round(w * 0.03)}px`
    }
  }, React.createElement("img", {
    src: A.wordmark.red,
    alt: "tandanji",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    },
    draggable: false
  }), React.createElement("img", {
    src: A.script.black,
    alt: "office meal",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      animation: "om-split 6s cubic-bezier(0.65, 0, 0.35, 1) infinite"
    },
    draggable: false
  }), React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: m ? -30 : -40,
      fontFamily: SANS,
      fontSize: 12,
      color: COLOR.red,
      animation: "om-label 6s ease infinite"
    }
  }, "tandanji \u2014 Wordmark"), React.createElement("span", {
    style: {
      position: "absolute",
      right: 0,
      bottom: m ? -46 : -64,
      fontFamily: SANS,
      fontSize: 12,
      color: COLOR.black,
      animation: "om-label 6s ease infinite"
    }
  }, "office meal \u2014 Script"))), React.createElement("p", {
    style: {
      ...body,
      maxWidth: 560,
      color: COLOR.black,
      opacity: 0.75
    }
  }, "\uAD75\uACE0 \uB465\uADFC tandanji \uC6CC\uB4DC\uB9C8\uD06C \uC544\uB798\uB85C office meal \uC2A4\uD06C\uB9BD\uD2B8\uAC00 \uACB9\uCCD0 \uD750\uB974\uBA70, \uB450 \uC11C\uCCB4\uAC00 \uD558\uB098\uC758 \uC190\uAE00\uC528\uCC98\uB7FC \uC774\uC5B4\uC9D1\uB2C8\uB2E4.")), React.createElement("div", {
    style: section(COLOR.black, {
      color: COLOR.pink
    })
  }, React.createElement(Label, {
    n: "03",
    title: "Symbol",
    color: COLOR.pink
  }), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: m ? 28 : pad * 2,
      padding: m ? "64px 0" : `${Math.round(w * 0.08)}px 0`
    }
  }, React.createElement(Reveal, null, React.createElement(Symbol, {
    tone: "pink",
    size: m ? 110 : Math.round(w * 0.16),
    style: {
      animation: "om-float 4s ease-in-out infinite"
    }
  })), React.createElement(Reveal, {
    delay: 0.2
  }, React.createElement(Symbol, {
    tone: "pink",
    solid: true,
    size: m ? 110 : Math.round(w * 0.16),
    style: {
      animation: "om-float 4s ease-in-out 0.6s infinite"
    }
  }))), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: SANS,
      fontSize: 13,
      opacity: 0.7,
      gap: 16
    }
  }, React.createElement("span", null, "Line / Solid"), React.createElement("span", {
    style: {
      textAlign: "right",
      wordBreak: "keep-all"
    }
  }, "O \uC2EC\uBCFC\uC740 \uB77C\uC778\uD615\uACFC \uBA74\uD615 \uB450 \uAC00\uC9C0\uB85C \uAD6C\uC131\uB429\uB2C8\uB2E4."))), React.createElement("div", {
    style: section("#FFFFFF")
  }, React.createElement(Label, {
    n: "04",
    title: "Color System",
    color: COLOR.red
  }), React.createElement(Reveal, null, React.createElement("p", {
    style: {
      ...body,
      maxWidth: 620,
      margin: m ? "24px 0 32px" : "32px 0 48px",
      color: COLOR.black
    }
  }, "Red, Pink Beige, Black \u2014 \uC138 \uAC00\uC9C0 \uCEEC\uB7EC\uB85C \uD0C4\uB2E8\uC9C0\uBC15\uC2A4\uC640\uC758 \uC5F0\uACB0\uC131\uC744 \uC720\uC9C0\uD558\uBA74\uC11C\uB3C4, \uC2E0\uB8B0\uAC10 \uC788\uB294 \uBE0C\uB79C\uB4DC \uC774\uBBF8\uC9C0\uB97C \uB9CC\uB4ED\uB2C8\uB2E4.")), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: m ? "column" : "row",
      height: m ? "auto" : Math.round(w * 0.36),
      gap: 0
    },
    onMouseLeave: () => setHot(null)
  }, colors.map((c, i) => React.createElement("div", {
    key: c.hex,
    onMouseEnter: () => setHot(i),
    style: {
      flex: m ? "none" : hot === null ? 1 : hot === i ? 2.2 : 0.7,
      minHeight: m ? 200 : undefined,
      background: c.hex,
      color: c.text,
      padding: m ? 20 : 28,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "flex 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      overflow: "hidden",
      border: c.tone === "pink" ? "none" : undefined
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: m ? 30 : Math.min(w * 0.03, 44),
      lineHeight: 1,
      whiteSpace: "nowrap"
    }
  }, c.name), React.createElement("div", null, React.createElement("p", {
    style: {
      ...body,
      fontSize: 13,
      marginBottom: 18,
      maxWidth: 300,
      opacity: hot === i || m ? 1 : 0,
      transition: "opacity 0.5s ease"
    }
  }, c.copy), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, auto)",
      justifyContent: "start",
      gap: m ? "6px 18px" : "6px 28px",
      fontFamily: SANS,
      fontSize: 12,
      whiteSpace: "nowrap"
    }
  }, [["Pantone", c.pantone], ["RGB", c.rgb], ["CMYK", c.cmyk], ["HEX", c.hex]].map(([k, v]) => React.createElement("div", {
    key: k
  }, React.createElement("div", {
    style: {
      opacity: 0.6
    }
  }, k), React.createElement("div", null, v))))))))), React.createElement("div", {
    style: section("#FFFFFF", {
      paddingTop: 0
    })
  }, React.createElement(Label, {
    n: "05",
    title: "Logo on Color",
    color: COLOR.red
  }), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)",
      gap: 8,
      marginTop: 24
    }
  }, [["red", "pink", "pink"], ["pink", "red", "black"], ["black", "pink", "pink"]].map(([bg, word, script], i) => React.createElement(Reveal, {
    key: bg,
    delay: i * 0.12
  }, React.createElement("div", {
    style: {
      background: COLOR[bg],
      aspectRatio: m ? "4 / 3" : "3 / 4",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28
    }
  }, React.createElement(Lockup, {
    word: word,
    script: script,
    width: "72%",
    delay: 0.3 + i * 0.15
  }), React.createElement(Symbol, {
    tone: word,
    solid: i !== 1,
    size: m ? 40 : Math.round(w * 0.035)
  })))))), React.createElement("div", {
    style: {
      background: COLOR.red,
      overflow: "hidden",
      padding: `${m ? 28 : 44}px 0`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      width: "max-content",
      animation: "om-marquee 28s linear infinite"
    }
  }, Array.from({
    length: 8
  }, (_, i) => marqueeItem("pink", "pink", "pink", m ? 56 : 96, i)))), React.createElement("div", {
    style: {
      background: COLOR.pink,
      overflow: "hidden",
      padding: `${m ? 28 : 44}px 0`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      width: "max-content",
      animation: "om-marquee-rev 32s linear infinite"
    }
  }, Array.from({
    length: 8
  }, (_, i) => marqueeItem("red", "black", "red", m ? 56 : 96, i)))), React.createElement("div", {
    style: section(COLOR.black, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 28,
      textAlign: "center"
    })
  }, React.createElement(Lockup, {
    word: "pink",
    script: "pink",
    width: m ? "62%" : "30%"
  }), React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 12,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: COLOR.pink,
      opacity: 0.7
    }
  }, "Logo & Color System \xB7 2026")));
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
  }), React.createElement("span", {
    style: {
      ...small,
      fontSize: m ? 11 : 13,
      color: C.white,
      opacity: 0.9,
      letterSpacing: "0.04em"
    }
  }, "\uC9C0\uAE08, \uAC00\uC7A5 \uB9DB\uC788\uB294 \uACFC\uC77C."))), React.createElement("div", {
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
