// 四个婚礼套餐 —— 名称、价格、说明与包含项目来自客户文档《Website Overview》
export interface IncludedItem {
    title: string;
    desc: string;
    /** /public/images/icons/ 下的图标名（不含扩展名） */
    icon: string;
}

export interface Photo {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export interface FlowerPackage {
    id: string;
    /** 1–4，对应菜单里的 Package 1–4 */
    number: number;
    /** 数字的英文写法，用于 "Package One" 这类标题 */
    numberWord: string;
    name: string;
    href: string;
    price: number; // USD, 整数
    desc: string;
    /** 套餐卡片封面（首页 Wedding Packages / Gallery / 预订页） */
    img: string;
    /** Gallery 页套餐卡片用图（客户素材 package_N_photo） */
    galleryCard: string;
    /** 详情页 "What's Included" 分几列展示 */
    columns: 2 | 3;
    included: IncludedItem[];
}

/* ── 各套餐共用的项目 ── */
const ITEM = {
    chuppah: { title: "Acrylic Chuppah with Flowers / Flower Arch", desc: "Stunning acrylic chuppah adorned with luxurious flowers or a full flower arch.", icon: "chuppah-arch" },
    tableNumbers: { title: "Table Numbers", desc: "Stylish table numbers to match your décor.", icon: "table-numbers" },
    skinnyCandles: { title: "Skinny Candles", desc: "Elegant skinny taper candles for a romantic ambiance.", icon: "skinny-candles" },
    fatCandles: { title: "Fat Candles", desc: "Chic pillar candles to add warmth and dimension.", icon: "fat-candles" },
    welcomeSign: { title: "Welcome Sign", desc: "Custom welcome sign to greet your guests.", icon: "welcome-sign" },
    mrMrsSign: { title: "Mr and Mrs Sign", desc: "Beautiful “Mr & Mrs” sign for your sweetheart or main table.", icon: "mr-mrs-sign" },
    qrCode: { title: "Capture the Love QR Code", desc: "Custom QR code sign so guests can share their photos and videos.", icon: "qr-code" },
    flowerWall: { title: "Flower Wall", desc: "A beautiful floral wall for photos and décor.", icon: "flower-wall" },
    aisleFlowers: { title: "Aisle Flowers", desc: "Elegant floral arrangements to line the aisle.", icon: "aisle-flowers" },
    aisleRunner: { title: "Aisle Runner", desc: "A refined aisle runner for the ceremony entrance.", icon: "aisle-runner" },
    flowerLetters: { title: "Flower Letters – Initials of Clients", desc: "Custom floral initials for the couple.", icon: "flower-letters" },
    sweetheartFull: { title: "Sweetheart Table Decorations (Full Setup with Chandelier)", desc: "Complete sweetheart table décor including flowers and chandelier.", icon: "sweetheart-table" },
    champagneTowerLarge: { title: "Champagne Tower (Large)", desc: "Elegant large champagne tower display.", icon: "champagne-tower" },
    champagneWall: { title: "Champagne Wall", desc: "A stunning champagne wall to impress your guests.", icon: "champagne-wall" },
    pillars: { title: "Pillars with Flowers (Eight)", desc: "Eight grand pillars adorned with luxurious flowers.", icon: "pillars-with-flowers" },
    marquee: { title: "Big Letters – Marquee Letters (LOVE)", desc: "Giant marquee letters spelling LOVE to light up your celebration.", icon: "flower-letters" },
    clubSign: { title: "Club Sign", desc: "Custom club-style sign with your names.", icon: "club-sign" },
    mirrorSign: { title: "Mirror Sign", desc: "Custom mirror sign with your names or special message.", icon: "mirror-sign" },
    aisleDecorations: { title: "Aisle Decorations: White Tulle or Bows (for Ceremony)", desc: "Elegant tulle and/or bows to dress your aisle.", icon: "drapes" },
    pictureWall: { title: "Picture Wall", desc: "A beautiful picture wall to showcase your love story.", icon: "camera" },
    neonSigns: { title: "Neon Signs", desc: "Custom neon signs to add a modern and romantic vibe.", icon: "heart" },
    fogMachine: { title: "Fog Machine", desc: "Add a magical touch with a dreamy fog effect.", icon: "fog-machine" },
    photoBooth: { title: "Photo Booth", desc: "Fun photo booth setup for guests to enjoy.", icon: "photo-booth" },
    cakeDisplay: { title: "Wedding Cake Display", desc: "Elegant display for your wedding cake.", icon: "wedding-cake" },
    lightUpWall: { title: "DJ Background Light Up Wall", desc: "Spectacular light up wall behind the DJ for a high-energy vibe.", icon: "light-up-wall" },
    stage: { title: "Stage", desc: "Grand stage setup for your ceremony or reception.", icon: "stage" },
    danceFloor: { title: "Dance Floor (18x18)", desc: "Spacious 18x18 dance floor for an elevated experience.", icon: "dance-floor" },
    projector: { title: "Projector with White Background", desc: "Projector with a clean white background for videos or presentations.", icon: "projector" },
} satisfies Record<string, IncludedItem>;

export const PACKAGES: FlowerPackage[] = [
    {
        id: "classic",
        number: 1,
        numberWord: "One",
        name: "Classic Collection",
        href: "/classic",
        price: 1500,
        desc: "A beautifully curated package for couples who want an elegant wedding with the essential floral décor needed to create a timeless celebration.",
        img: "/images/packages/classic.webp",
        galleryCard: "/images/gallery-cards/package-1.webp",
        columns: 2,
        included: [
            { title: "Up to 10 Flower Centerpieces", desc: "Elegant floral centerpieces for your reception tables.", icon: "flower-centerpieces" },
            { title: "Up to 10 Cocktail Table Flowers", desc: "Beautiful floral accents for your cocktail tables.", icon: "cocktail-table-flowers" },
            ITEM.chuppah,
            { title: "Up to 20 Floating Candles (2 per Table)", desc: "Elegant floating candles to create a romantic ambiance.", icon: "floating-candles" },
            ITEM.tableNumbers,
            ITEM.skinnyCandles,
            ITEM.fatCandles,
            ITEM.welcomeSign,
            ITEM.mrMrsSign,
            { title: "Sweetheart Table Decorations (Flowers + 2 Candelabras)", desc: "Gorgeous floral arrangement paired with 2 elegant candelabras.", icon: "sweetheart-table" },
            ITEM.qrCode,
        ],
    },
    {
        id: "signature",
        number: 2,
        numberWord: "Two",
        name: "Signature Collection",
        href: "/signature",
        price: 2500,
        desc: "An elevated package for couples who want a fuller wedding design with more florals, enhanced ceremony décor, and additional statement pieces.",
        img: "/images/packages/signature.webp",
        galleryCard: "/images/gallery-cards/package-2.webp",
        columns: 2,
        included: [
            { title: "Up to 15 Flower Centerpieces", desc: "Elegant floral centerpieces for your reception tables.", icon: "flower-centerpieces" },
            { title: "Up to 13 Cocktail Table Flowers", desc: "Beautiful floral accents for your cocktail tables.", icon: "cocktail-table-flowers" },
            ITEM.chuppah,
            { title: "Up to 60 Floating Candles (4 per Table)", desc: "Includes up to 60 floating candles, 4 per table.", icon: "floating-candles" },
            ITEM.tableNumbers,
            ITEM.skinnyCandles,
            ITEM.flowerWall,
            ITEM.aisleFlowers,
            ITEM.fatCandles,
            ITEM.welcomeSign,
            ITEM.mrMrsSign,
            { title: "Sweetheart Table Decorations (Flowers + 2 Candelabras)", desc: "Gorgeous floral arrangement paired with 2 elegant candelabras.", icon: "sweetheart-table" },
            ITEM.qrCode,
            { title: "Champagne Tower (Small)", desc: "Elegant small champagne tower display.", icon: "champagne-tower" },
            ITEM.aisleRunner,
            ITEM.flowerLetters,
        ],
    },
    {
        id: "luxe",
        number: 3,
        numberWord: "Three",
        name: "Luxe Collection",
        href: "/luxe",
        price: 5000,
        desc: "A luxurious package for couples who want a grand celebration filled with abundant florals, dramatic installations, and striking decorative features.",
        img: "/images/packages/luxe.webp",
        galleryCard: "/images/gallery-cards/package-3.webp",
        columns: 2,
        included: [
            { title: "Up to 20 Flower Centerpieces", desc: "Elegant floral centerpieces for your reception tables.", icon: "flower-centerpieces" },
            { title: "Up to 20 Cocktail Table Flowers", desc: "Beautiful floral accents for your cocktail tables.", icon: "cocktail-table-flowers" },
            ITEM.chuppah,
            { title: "Up to 80 Floating Candles (4 per Table)", desc: "Includes up to 80 floating candles, 4 per table.", icon: "floating-candles" },
            ITEM.tableNumbers,
            ITEM.skinnyCandles,
            ITEM.flowerWall,
            ITEM.aisleFlowers,
            ITEM.champagneWall,
            ITEM.pillars,
            { title: "Drape Wall", desc: "Elegant draped wall to frame your celebration.", icon: "drapes" },
            ITEM.marquee,
            ITEM.clubSign,
            ITEM.mirrorSign,
            ITEM.aisleDecorations,
            ITEM.pictureWall,
            { title: "Twirl Flower Stands", desc: "Graceful twirl stands topped with florals.", icon: "flower-stand" },
            { title: "Filler Flowers", desc: "Additional florals to fill and soften every space.", icon: "filler-flowers" },
            ITEM.fatCandles,
            ITEM.welcomeSign,
            ITEM.mrMrsSign,
            ITEM.sweetheartFull,
            ITEM.qrCode,
            ITEM.champagneTowerLarge,
            ITEM.aisleRunner,
            ITEM.flowerLetters,
            ITEM.neonSigns,
            ITEM.fogMachine,
            ITEM.photoBooth,
            ITEM.cakeDisplay,
            ITEM.lightUpWall,
            ITEM.stage,
            ITEM.danceFloor,
            ITEM.projector,
        ],
    },
    {
        id: "grand",
        number: 4,
        numberWord: "Four",
        name: "Grand Collection",
        href: "/grand",
        price: 12500,
        desc: "Our most extravagant package for couples who want a spectacular, fully transformed wedding with large-scale florals, immersive décor, and showstopping installations.",
        img: "/images/packages/grand.webp",
        galleryCard: "/images/gallery-cards/package-4.webp",
        columns: 3,
        included: [
            { title: "Up to 25 Flower Centerpieces", desc: "Elegant floral arrangements for your reception tables.", icon: "flower-centerpieces" },
            { title: "Up to 25 Cocktail Table Flowers", desc: "Beautiful floral accents for your cocktail tables.", icon: "cocktail-table-flowers" },
            ITEM.chuppah,
            { title: "Up to 100 Floating Candles (4 per Table)", desc: "Includes up to 100 floating candles, 4 per table.", icon: "floating-candles" },
            ITEM.tableNumbers,
            ITEM.skinnyCandles,
            ITEM.fatCandles,
            ITEM.flowerWall,
            ITEM.aisleFlowers,
            ITEM.champagneWall,
            ITEM.pillars,
            ITEM.marquee,
            ITEM.mirrorSign,
            ITEM.pictureWall,
            { title: "Tier 1 Flowers", desc: "Additional tall flowers for added grandeur.", icon: "flower-stand" },
            ITEM.fogMachine,
            ITEM.cakeDisplay,
            ITEM.stage,
            ITEM.projector,
            ITEM.welcomeSign,
            ITEM.mrMrsSign,
            ITEM.sweetheartFull,
            ITEM.qrCode,
            ITEM.champagneTowerLarge,
            ITEM.aisleRunner,
            ITEM.flowerLetters,
            ITEM.clubSign,
            ITEM.aisleDecorations,
            { title: "Two 15x15 Love Stands", desc: "Beautiful heart style flower stands to elevate your décor.", icon: "heart" },
            ITEM.neonSigns,
            ITEM.photoBooth,
            { title: "Big Background Light Up Wall", desc: "Spectacular light up wall behind the DJ for a high-energy vibe.", icon: "light-up-wall" },
            ITEM.danceFloor,
            { title: "Six Arches", desc: "Six stunning arches for a grand entrance.", icon: "arch" },
            { title: "Chair Draping (for Reception)", desc: "Elegant chair draping for a sophisticated look.", icon: "drapes" },
            { title: "Chiavari Chairs", desc: "Classic Chiavari chairs for your reception.", icon: "drapes" },
            { title: "Light Up Arch", desc: "LED light up arch for a magical entrance.", icon: "arch" },
            { title: "Heart Arch", desc: "Romantic heart-shaped arch for unforgettable moments.", icon: "heart" },
            { title: "Couches (Two)", desc: "Two elegant couches for your lounge or sweetheart area.", icon: "couches" },
            { title: "Fifteen Chandeliers (in Ceiling or Standing, Depending on Venue)", desc: "Luxurious chandeliers in the ceiling or on stands for a breathtaking glow.", icon: "chandeliers" },
            { title: "Ceiling Drapes", desc: "Elegant ceiling draping to complete the magical atmosphere.", icon: "ceiling-drapes" },
        ],
    },
];

/** 套餐详情页 / Gallery 页使用的照片。
    TODO: 目前是从设计稿裁出的低分辨率示意图，4 个套餐共用；客户会另外打包发送每个套餐的真实活动照片，
    届时按套餐分别填进 PACKAGE_PHOTOS 即可（数量不限，相册会自动出现左右滚动）。 */
const PLACEHOLDER_PHOTOS: Photo[] = [
    { src: "/images/gallery/roses-table-number.webp", alt: "Rose centerpiece with table number" },
    { src: "/images/gallery/ceremony-aisle.webp", alt: "Floral ceremony chuppah" },
    { src: "/images/gallery/floating-candles.webp", alt: "Floating candles in glass cylinders" },
    { src: "/images/gallery/candelabra-tablescape.webp", alt: "Candelabra tablescape with roses" },
    { src: "/images/gallery/welcome-sign.webp", alt: "Wedding welcome sign" },
    { src: "/images/gallery/mr-mrs-neon.webp", alt: "Mr & Mrs neon sign" },
    { src: "/images/gallery/taper-candles.webp", alt: "Taper candles with roses" },
    { src: "/images/gallery/table-eight.webp", alt: "Gold framed table number" },
    { src: "/images/gallery/pillar-candles.webp", alt: "Pillar candles with florals" },
    { src: "/images/gallery/capture-the-love.webp", alt: "Capture the love QR code sign" },
].map((p) => ({ ...p, width: 172, height: 186 }));

const PACKAGE_PHOTOS: Record<string, Photo[]> = {};

/** 某个套餐的全部照片：套餐封面 + 活动照片 */
export function getPackagePhotos(pkg: FlowerPackage): Photo[] {
    return [
        { src: pkg.img, alt: pkg.name, width: 1448, height: 1086 },
        ...(PACKAGE_PHOTOS[pkg.id] ?? PLACEHOLDER_PHOTOS),
    ];
}

export function getPackage(id: string): FlowerPackage | undefined {
    return PACKAGES.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
    return `$${price.toLocaleString("en-US")}`;
}

// 预约时段（当地时间）
export const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00",
];

/** 最早可预约日期：后天。
    尾款在用花前一天早上 9 点自动扣款，预约必须留出这个窗口。 */
export function minBookingDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
}
