import * as React from "react"

// Motion lecture project. The artwork comes straight from the original Illustrator file:
// each mo-live-*.jpg is the page with the moving parts removed, and the matching .svg holds
// those parts as the original vectors, with their animation inside the file.

const IMG = "/assets/img/"

function Live({ name, ratio, alt }: { name: string; ratio: string; alt: string }) {
    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: ratio }}>
            <img src={`${IMG}${name}.jpg`} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
            <img src={`${IMG}${name}.svg`} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
        </div>
    )
}

function Board({ file, alt }: { file: string; alt: string }) {
    return <img src={`${IMG}${file}.jpg`} alt={alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
}

export default function MotionLecture() {
    return (
        <div style={{ width: "100%" }}>
            <section style={{ background: "#FBF0F0", padding: "clamp(32px, 7vw, 112px) clamp(20px, 6vw, 96px)", display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: 720, boxShadow: "0 30px 80px rgba(60, 30, 30, 0.14)" }}>
                    <Live name="mo-live-poster" ratio="1207.56 / 1700.79" alt="2D 모션 그래픽 입문 무료 특강 포스터" />
                </div>
            </section>
            <Live name="mo-live-leaflet" ratio="841.89 / 595.276" alt="특강 리플렛 내지" />
            <Board file="mo-board-01" alt="포스터와 배너 적용 보드" />
            <Board file="mo-board-02" alt="리플렛 목업 보드" />
            <Board file="mo-board-03" alt="리플렛 외지" />
            <section style={{ padding: "clamp(32px, 7vw, 112px) clamp(20px, 6vw, 96px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(16px, 3vw, 40px)" }}>
                <Board file="mo-poster-05" alt="포스터 시안" />
                <Board file="mo-poster-07" alt="포스터 시안" />
            </section>
            <Board file="mo-board-09" alt="포스터 적용 보드" />
        </div>
    )
}
