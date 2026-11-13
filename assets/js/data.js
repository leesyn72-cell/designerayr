// Site content. Images live in /assets/img/ under their original file names.
window.SITE = {
    name: "Ahn Yu Lim",
    behance: "https://www.behance.net/bb96089b",
    tagline: "Graphic designer based in Korea, working across brand identity and posters.",
    hero: { title: "ALWAYS EVOLVING", name: "AHN YU LIM", role: "Graphic Designer" },
    profile: {
        photo: "zd87DXtHrE26amjyuCnuvEN4OSI.jpg",
        koreanLine: "안녕하세요! 배우는 것을 사랑하는 그래픽 디자이너 안유림입니다.\n어제보다 한 걸음 더 나아가는 작업을 합니다.",
        role: "Graphic Designer — Seoul, Korea",
        intro: "브랜드 아이덴티티, 패키지, 편집, 패션 그래픽 작업을 합니다.\n현재 ABBG에서 그래픽 디자이너로 재직 중이며,\n프리랜스 작업 의뢰도 받고 있습니다.",
        capabilities: ["Brand Identity", "Packaging", "Poster Design", "Editorial Design", "Fashion Graphics", "Illustration"],
        tools: ["Photoshop", "Illustrator", "After Effects", "Premiere Pro", "Figma", "Blender", "Claude"],
        experience: [{ role: "Graphic Designer (Full-time)", company: "ABBG", period: "2026.03 — Present" }],
        services: [
            { name: "Branding & Packaging", desc: "브랜드를 더 친근하게 만드는\n아이덴티티, 캐릭터, 패키지.", work: "fru:now · Tandanji Office Meal" },
            { name: "Posters & Campaigns", desc: "하나의 강한 이미지로 완성하는\n행사·광고 포스터.", work: "Motion Graphics Lecture" },
        ],
    },
    // Order here is the order on the Work page; `carousel` is the order of the home ring.
    carousel: ["tandanji-office-meal", "motion-graphics-lecture-poster", "laserin-contents", "runpl-kim-kukyoung", "prunau"],
    projects: [
        {
            slug: "prunau", title: "fru:now Brand Identity", field: "Brand Identity", deliverable: "Logo, Color System, Detail Page", year: "2026",
            cover: "dvwtygDs6sF6eAWmwXJeTPI9NAE.jpg", guide: "PrunauGuideline",
            kind: "company", contribution: 96,
            intro: "과일 브랜드 프루나우의\n브랜드 아이덴티티와 상세페이지 디자인.\n콜론에 과일과 사람의 연결을 담았습니다.",
            body: [],
        },
        {
            slug: "tandanji-office-meal", title: "Tandanji Office Meal", field: "Brand Identity", deliverable: "Logo, Color System", year: "2026",
            cover: "Wbic18i1zs3EUWDRfMGh4a5JqI.jpg", guide: "OfficeMealGuideline",
            kind: "company", contribution: 96,
            client: { name: "탄단지박스", logo: "D3NaZsE2ifbXRjAjt0bBjryF53k.png", ratio: 2.744, mask: "#F91515" },
            intro: "탄단지박스 오피스밀의\n로고와 컬러 시스템 디자인.\n곡선의 스크립트로 따뜻함을 담았습니다.",
            body: [],
        },
        {
            slug: "motion-graphics-lecture-poster", title: "Free Special Lecture on Motion Graphics", field: "Poster Design", deliverable: "Graphic Design", year: "2025",
            cover: "mo-cover.svg", guide: "MotionLecture",
            kind: "personal", contribution: 100, behance: "https://www.behance.net/gallery/236741261/Poster-Design-_-Free-special-lecture-on-motion-graphics",
            intro: "가상의 모션그래픽 입문 무료 특강을 위한\n포스터, 세로형 배너,\n3단형 리플렛 디자인.",
            body: [],
        },
        {
            slug: "laserin-contents", title: "LASERIN Contents Design", field: "Contents Design", deliverable: "Instagram Contents", year: "2026",
            cover: "ls-12.jpg", guide: "LaserinContents",
            kind: "company", contribution: 96,
            client: { name: "라세린 · GoGoDive", logo: "laserin-word.png", ratio: 3.864, mask: "#D47097" },
            facts: [["Products", "Lumina · Yunseul · Tweedy · Raina · Glit"]],
            intro: "라세린 인스타그램 콘텐츠 제작.\n수영복 브랜드 라세린의\n인스타그램 피드 콘텐츠 디자인.",
            body: [],
        },
        {
            slug: "runpl-kim-kukyoung", title: "atflee Runpl × Kim Kuk-young", field: "Detail Page", deliverable: "Detail Page, Thumbnail", year: "2026",
            cover: "rp-cover.jpg", guide: "RunplDetail",
            kind: "company", contribution: 96,
            client: { name: "앳플리 atflee", logo: "atflee-orange.svg", ratio: 3.733 },
            facts: [["Collaboration", "김국영 코치 · 100m 한국 기록 보유자"]],
            intro: "앳플리 × 김국영 콜라보\n앳플리 런플 상세페이지 제작.\n100m 한국 기록 보유자 김국영 코치와 함께했습니다.",
            body: [],
        },
    ],
}
