import * as React from "react"

// Motion lecture project, using the original layout from the Illustrator file.
// mo-layout-*.jpg is each artboard with the moving characters removed. Each file in mo-anim/ holds
// one character as its original vectors, with the animation inside the file, placed by percent.

const IMG = "/assets/img/"

const PAGES = [
    { file: "mo-layout-1", ratio: "1920 / 6779.04", alt: "2D 모션 그래픽 입문 무료 특강 포스터와 리플렛" },
    { file: "mo-layout-2", ratio: "1920 / 3051.93", alt: "2D 모션 그래픽 입문 무료 특강 세로형 배너" },
]

const LAYERS = [
    { name: "mo-sit-1", page: 0, left: 52.3952, top: 2.8114, width: 15.6835, height: 6.0263 },
    { name: "mo-sit-2", page: 0, left: 70.2656, top: 58.6676, width: 7.7083, height: 2.9635 },
    { name: "mo-sit-3", page: 0, left: 80.4313, top: 29.8992, width: 10.6063, height: 4.0764 },
    { name: "mo-sit-4", page: 1, left: 78.6744, top: 32.1255, width: 6.2085, height: 5.2984 },
    { name: "mo-swing-5", page: 0, left: 40.4129, top: 68.4507, width: 26.6846, height: 6.3203 },
    { name: "mo-swing-6", page: 0, left: 64.5636, top: 0, width: 35.4364, height: 9.1797 },
    { name: "mo-swing-7", page: 0, left: 21.8817, top: 43.782, width: 54.6898, height: 7.3047 },
    { name: "mo-dangle-1", page: 0, left: 62.5283, top: 70.9844, width: 15.0683, height: 6.3581 },
    { name: "mo-dangle-2", page: 0, left: 1.6335, top: 62.2346, width: 21.061, height: 8.8858 },
    { name: "mo-walk-1", page: 0, left: 63.8802, top: 79.6248, width: 34.7969, height: 4.6068 },
]

export default function MotionLecture() {
    return (
        <div style={{ width: "100%" }}>
            {PAGES.map((p, i) => (
                <div key={p.file} style={{ position: "relative", width: "100%", aspectRatio: p.ratio, overflow: "hidden" }}>
                    <img src={`${IMG}${p.file}.jpg`} alt={p.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
                    {LAYERS.filter((l) => l.page === i).map((l) => (
                        <img
                            key={l.name}
                            src={`${IMG}mo-anim/${l.name}.svg`}
                            alt=""
                            aria-hidden
                            style={{ position: "absolute", left: `${l.left}%`, top: `${l.top}%`, width: `${l.width}%`, height: `${l.height}%`, display: "block" }}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
