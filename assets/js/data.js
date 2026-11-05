// Site content. Images live in /assets/img/ under their original file names.
window.SITE = {
    name: "Ahn Yu Lim",
    behance: "https://www.behance.net/bb96089b",
    tagline: "Graphic designer based in Korea, working across brand, editorial and posters.",
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
            { name: "Branding & Packaging", desc: "브랜드를 더 친근하게 만드는\n아이덴티티, 캐릭터, 패키지.", work: "YUMME" },
            { name: "Editorial", desc: "읽는 흐름이 분명한\n북 커버와 매거진 지면.", work: "나는 내가 제일 어렵다 · BHG Black Stone Interior" },
            { name: "Posters & Campaigns", desc: "하나의 강한 이미지로 완성하는\n행사·광고 포스터.", work: "Motion Graphics Lecture · Santa Maria Novella" },
            { name: "Fashion Graphics & Illustration", desc: "의류와 일상 소품을 위한\n프린트와 일러스트.", work: "FW Street Wear" },
        ],
    },
    // Order here is the order on the Work page; `carousel` is the order of the home ring.
    carousel: ["tandanji-office-meal", "motion-graphics-lecture-poster", "yumme", "book-design", "prunau", "bhg-black-stone-interior", "santa-maria-novella", "fw-street-wear"],
    projects: [
        {
            slug: "prunau", title: "fru:now Brand Identity", field: "Brand Identity", deliverable: "Logo, Color System, Detail Page", year: "2026",
            cover: "dvwtygDs6sF6eAWmwXJeTPI9NAE.jpg", guide: "PrunauGuideline",
            intro: "과일 브랜드 프루나우의\n브랜드 아이덴티티와 상세페이지 디자인.\n콜론에 과일과 사람의 연결을 담았습니다.",
            body: [],
        },
        {
            slug: "tandanji-office-meal", title: "Tandanji Office Meal", field: "Brand Identity", deliverable: "Logo, Color System", year: "2026",
            cover: "Wbic18i1zs3EUWDRfMGh4a5JqI.jpg", guide: "OfficeMealGuideline",
            intro: "탄단지박스 오피스밀의\n로고와 컬러 시스템 디자인.\n곡선의 스크립트로 따뜻함을 담았습니다.",
            body: [],
        },
        {
            slug: "yumme", title: "YUMME", field: "Brand Design", deliverable: "Packaging, Graphic Design", year: "2026",
            cover: "bwnG0uFL4xzBpN00QdC6JzOGfkg.jpg", behance: "https://www.behance.net/gallery/241580101/Brand-design_YUMME",
            intro: "어린이 영양 전문 브랜드 얌미의\n브랜드 아이덴티티, 캐릭터,\n패키지, SNS 콘텐츠 디자인.",
            body: [
                ["Dsyy0elTbACsNAKKEz1DRHLkPD4.gif", 1400, 788], ["WWDSHvwKVswyffEOA9arHPM0Kk0.jpg", 1400, 2418], ["Suon7Ym0oDhgo8jgN2BzbnQOXLA.gif", 1400, 618],
                ["GesCMkEGc47oTSLb1Xf0KGFac.jpg", 1400, 2070], ["yfilWfQFKKHePw94ZVBqWpvEE.gif", 1400, 788], ["bT7F7SE1hwp38vioUXWq4y1BDAE.gif", 1400, 864],
                ["bvuj4Xa4v04g2B9MtwgilX9G4.jpg", 1400, 1742], ["FtgNIKOHsjeF0ZoWoOg3zFMOAVQ.gif", 1400, 788], ["awjUaWSdNezB1l5IVqrRRD6xNA.gif", 1400, 788],
                ["DAYi3zLCfYXaeNAMd5j137gv8.jpg", 1400, 2669], ["7xlscrPe8jnmpAAb7RWrWtRtk.gif", 1400, 582], ["TQlzrduiVN8Qy5F5ZS8iM6KCfpU.jpg", 1400, 3229],
                ["4Eor0D3dFcr4FZrAOOoIoKBqBWE.gif", 1400, 858], ["n2jFXSODDnCipWT2HnztE8vxUuM.jpg", 1400, 1304],
            ],
        },
        {
            slug: "motion-graphics-lecture-poster", title: "Free Special Lecture on Motion Graphics", field: "Poster Design", deliverable: "Graphic Design", year: "2025",
            cover: "JjiIg3TIvM2TJlXmnVf6qom3WA.jpg", behance: "https://www.behance.net/gallery/236741261/Poster-Design-_-Free-special-lecture-on-motion-graphics",
            intro: "가상의 모션그래픽 입문 무료 특강을 위한\n포스터, 세로형 배너,\n3단형 리플렛 디자인.",
            body: [["uPkEVe5unkJYPNcopaYyuESEg.jpg", 1400, 4943], ["oSxbu4kJw73Ap7RbxCwgl07r58.jpg", 1400, 2225]],
        },
        {
            slug: "book-design", title: "나는 내가 제일 어렵다", field: "Book Design", deliverable: "Graphic Design", year: "2025",
            cover: "eHprX07y3sReomLZn4FS3evV44.jpg", behance: "https://www.behance.net/gallery/236740789/Book-Design-_-",
            intro: "‘나는 내가 제일 어렵다’와\n‘너도 나만큼 어렵다’\n북 커버 디자인.",
            body: [["CvRAASNO45brbXLSTYSz5AEGw0U.jpg", 1400, 5322], ["Lr16j2f1fs5MOxLqXPp0AD47du0.jpg", 1400, 4239]],
        },
        {
            slug: "bhg-black-stone-interior", title: "BHG Black Stone Interior", field: "Magazine Design", deliverable: "Graphic Design", year: "2025",
            cover: "W3QSDkDIylwjVDOJhlEkvPUNs6w.jpg", behance: "https://www.behance.net/gallery/236740459/Magazine-Design-_-BHG-black-stone-inerior",
            intro: "라이프스타일 매거진 BHG\n블랙스톤 인테리어 특집의\n표지와 지면 디자인.",
            body: [["UirppuWjqo53v99Y9bIXmInUiM.jpg", 2835, 2019], ["4jVOiYUJREdR1n6r8YD4RUvM.jpg", 2835, 2019], ["UItKcME2vCfM8h16rWMz3WKFY.jpg", 2835, 2019], ["NaVv5flSI1hUSrPTvZpvkwcuOi4.jpg", 2835, 2019]],
        },
        {
            slug: "santa-maria-novella", title: "Santa Maria Novella", field: "Advertising Poster", deliverable: "Graphic Design", year: "2025",
            cover: "5VNGA03E1K0K6bqy4GELCiOEpQ.jpg", behance: "https://www.behance.net/gallery/236740703/Advertising-Poster-_-Santa-maria-novella",
            intro: "산타 마리아 노벨라 메디치 가든 컬렉션,\nMagnolia와 Bizzarria의\n광고 포스터 디자인.",
            body: [["PFpnJ5qlq7h57yYkwvn9Z9sY.jpg", 1400, 5605], ["2AztFgsHtDaLWGoflY2WH5pAw.jpg", 1400, 4976]],
        },
        {
            slug: "fw-street-wear", title: "FW Street Wear", field: "Fashion Graphic Design", deliverable: "Illustration, Graphic Design", year: "2025",
            cover: "Ywg8MENwh107xL9RSzaut9T5aU.jpg", behance: "https://www.behance.net/gallery/237411873/Fashion-Graphic-Design_FW-Street-Wear",
            intro: "F/W 시즌 맨투맨과 후드티를 위한\n그래픽 디자인. 남녀 구분 없이\n입을 수 있는 스트릿 웨어.",
            body: [["eqbAQfAOqL6siHxR0g5kDkaak.jpg", 1400, 5023], ["y7lXpGmhbQjFjMHWfMDthTbpnEk.jpg", 1400, 4573], ["blu8KHxA1iTAgpbqZN14Qyvc4.jpg", 1400, 5362], ["AePaozuyprwYKJS65631Ak6mWo.jpg", 1400, 3872]],
        },
    ],
}
