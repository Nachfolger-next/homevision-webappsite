import { type Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import CustomCursor from '@/components/CustomCursor';
import NoiseOverlay from '@/components/NoiseOverlay';
import PortfolioGrid from '@/components/PortfolioGrid';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Our Properties | Homevision',
    description: 'Explore our curated portfolio of premium short-term rental properties across Thessaloniki and the Greek Islands.',
    openGraph: {
        title: 'Curated Portfolio | Homevision',
        description: 'A collection of unique residences we manage across Greece.',
        type: 'website',
    },
    alternates: getAlternates('/portfolio'),
};

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const content = {
    title: { el: 'Επιλεγμένα Ακίνητα', en: 'Curated Portfolio', ru: 'Портфолио', tr: 'Seçilmiş Portföy', bg: 'Избрано портфолио', he: 'תיק עבודות נבחר' },
    subtitle: {
        el: 'Μια συλλογή από μοναδικές κατοικίες που διαχειριζόμαστε.',
        en: 'A collection of unique residences we manage.',
        ru: 'Коллекция уникальных резиденций под нашим управлением.',
        tr: 'Yönettiğimiz benzersiz konutlar koleksiyonu.',
        bg: 'Колекция от уникални жилища, които управляваме.',
        he: 'אוסף של מגורים ייחודיים שאנו מנהלים.',
    },
    statProperties: { el: 'Ακίνητα', en: 'Properties Managed', ru: 'Объектов', tr: 'Mülk', bg: 'Имоти', he: 'נכסים מנוהלים' },
    statCheckins: { el: 'Check-ins', en: 'Guest Check-ins', ru: 'Заселений', tr: 'Misafir Girişi', bg: 'Настанявания', he: 'כניסות אורחים' },
    statLocations: { el: 'Τοποθεσίες', en: 'Locations', ru: 'Локации', tr: 'Lokasyon', bg: 'Локации', he: 'מיקומים' },
    statRating: { el: 'Μέση Βαθμολογία', en: 'Average Guest Rating', ru: 'Средний рейтинг', tr: 'Ort. Misafir Puanı', bg: 'Среден рейтинг', he: 'דירוג ממוצע' },
    staging: { el: 'Staging & Φωτογράφιση', en: 'Staging & Photography', ru: 'Стайлинг и фотография', tr: 'Sahne Düzenleme & Fotoğraf', bg: 'Подготовка и фотография', he: 'עיצוב וצילום' },
    stagingDesc: { el: 'Αναδεικνύουμε τα δυνατά σημεία του ακινήτου σας, δημιουργώντας χώρους που οι επισκέπτες θέλουν να κλείσουν αμέσως.', en: 'We showcase your property\'s strongest features, creating spaces that guests want to book instantly.', ru: 'Мы подчёркиваем лучшие стороны вашего объекта, создавая пространства, которые гости хотят забронировать немедленно.', tr: 'Mülkünüzün en güçlü özelliklerini sergiliyoruz, misafirlerin anında rezervasyon yapmak isteyeceği mekanlar yaratıyoruz.', bg: 'Представяме най-силните характеристики на имота ви.', he: 'אנחנו מציגים את התכונות החזקות ביותר של הנכס.' },
    hotelStandards: { el: 'Πρότυπα Ξενοδοχείου', en: 'Hotel Standards', ru: 'Стандарты отеля', tr: 'Otel Standartları', bg: 'Хотелски стандарти', he: 'סטנדרטים של מלון' },
    hotelStandardsDesc: { el: 'Επαγγελματικός καθαρισμός και ιματισμός υψηλών προδιαγραφών για άψογη υγιεινή και άνεση.', en: 'Professional cleaning and premium linen standards ensuring impeccable hygiene and comfort.', ru: 'Профессиональная уборка и премиальное постельное бельё для безупречной гигиены и комфорта.', tr: 'Kusursuz hijyen ve konfor için profesyonel temizlik ve premium keten standartları.', bg: 'Професионално почистване и премиум спално бельо.', he: 'ניקיון מקצועי ומצעים פרימיום להיגיינה ונוחות.' },
    guestExperience: { el: 'Εμπειρία Φιλοξενίας', en: 'Guest Experience', ru: 'Гостевой опыт', tr: 'Misafir Deneyimi', bg: 'Гостоприемство', he: 'חווית אורח' },
    guestExperienceDesc: { el: 'Welcome baskets και premium παροχές που εξασφαλίζουν κριτικές 5 αστέρων.', en: 'Welcome baskets and premium amenities that consistently earn 5-star reviews.', ru: 'Приветственные корзины и премиальные удобства, которые стабильно получают 5 звёзд.', tr: 'Hoş geldin sepetleri ve sürekli 5 yıldız alan premium olanaklar.', bg: 'Приветствени кошници и премиум удобства.', he: 'סלי קבלת פנים ושירותים פרימיום.' },
    wantToList: { el: 'Θέλετε το ακίνητό σας να εμφανίζεται εδώ;', en: 'Want to see your property listed here?', ru: 'Хотите видеть свой объект здесь?', tr: 'Mülkünüzü burada görmek ister misiniz?', bg: 'Искате имотът ви да бъде тук?', he: 'רוצים לראות את הנכס שלכם כאן?' },
    listYourProperty: { el: 'Καταχωρήστε το Ακίνητό σας', en: 'List Your Property', ru: 'Разместить объект', tr: 'Mülkünüzü Listeleyin', bg: 'Добавете имота си', he: 'רשמו את הנכס שלכם' },
};

const properties = [
    { id: 1, title: "Okto Penthouse", altText: "Interior view of the Okto Penthouse living room showing the dining area and hanging chair", location: "Thessaloniki", img: "/portfolio_okto_landscape.webp", size: "large" },
    { id: 2, title: "Okto Penthouse", altText: "Detail shot of the hanging chair in the Okto Penthouse", location: "Thessaloniki", img: "/portfolio_okto_penthouse_portrait.webp", size: "tall" },
    { id: 3, title: "Heart of Yes", altText: "Bright and airy interior at Heart of Yes property", location: "Thessaloniki", img: "/portfolio_heartofyes_square.webp", size: "small" },
    { id: 4, title: "Deka Apartment", altText: "Minimalist interior details in the Deka Apartment with a bonsai tree", location: "Thessaloniki", img: "/portfolio_deka_landscape.webp", size: "large" },
    { id: 5, title: "Deka Apartment", altText: "Kitchen area in the Deka Apartment with wood accents", location: "Thessaloniki", img: "/portfolio_deka_portrait.webp", size: "tall" },
    { id: 6, title: "Next Chapter", altText: "Modern interior at the Next Chapter property", location: "Thessaloniki", img: "/portfolio_nextchapter_square.webp", size: "small" },
    { id: 7, title: "Ant1", altText: "Light blue walls and classic details in the Ant1 property hallway", location: "Thessaloniki", img: "/portfolio_ant1_landscape.webp", size: "large" },
    { id: 8, title: "Ant1", altText: "Bedroom corner with bedside table and lamp at the Ant1 property", location: "Thessaloniki", img: "/portfolio_ant1_portrait.webp", size: "tall" },
    { id: 9, title: "Bliss", altText: "Modern dark bathroom interior at the Bliss property", location: "Thessaloniki", img: "/portfolio_bliss_portrait.webp", size: "tall" },
    { id: 10, title: "Bliss", altText: "Spacious living area at the Bliss property", location: "Thessaloniki", img: "/portfolio_bliss_landscape.webp", size: "large" },
    { id: 11, title: "Urban Hub", altText: "Contemporary dining area setup at Urban Hub", location: "Thessaloniki", img: "/portfolio_urbanhub_portrait.webp", size: "tall" },
    { id: 12, title: "Nido Blu", altText: "Warmly lit balcony with outdoor seating at Nido Blu", location: "Thessaloniki", img: "/portfolio_nidoblu_landscape.webp", size: "large" },
    { id: 13, title: "Nido Blu", altText: "Rustic outdoor terrace corner at Nido Blu", location: "Thessaloniki", img: "/portfolio_nidoblu_portrait.webp", size: "tall" },
    { id: 14, title: "Basquiat", altText: "Vibrant blue bathroom vanity area at the Basquiat property", location: "Thessaloniki", img: "/portfolio_basquiat_portrait.webp", size: "tall" },
    { id: 15, title: "Basquiat", altText: "Neoclassical interior with high ceilings and chandelier at the Basquiat property", location: "Thessaloniki", img: "/portfolio_basquiat_landscape.webp", size: "large" },
];

export default async function PortfolioPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    const stats = [
        { value: '50+', label: getLocalized(content.statProperties, lang) },
        { value: '3,000+', label: getLocalized(content.statCheckins, lang) },
        { value: 'Thessaloniki & Islands', label: getLocalized(content.statLocations, lang) },
        { value: '4.9', label: getLocalized(content.statRating, lang) },
    ];

    const pillars = [
        { title: getLocalized(content.staging, lang), desc: getLocalized(content.stagingDesc, lang) },
        { title: getLocalized(content.hotelStandards, lang), desc: getLocalized(content.hotelStandardsDesc, lang) },
        { title: getLocalized(content.guestExperience, lang), desc: getLocalized(content.guestExperienceDesc, lang) },
    ];

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <CustomCursor />
            <NoiseOverlay />
            <Header lang={lang} />

            {/* Spacer for fixed header */}
            <div style={{ height: '120px' }} />

            <div className="container pb-20 md:pb-32">
                {/* Asymmetric header */}
                <div className="max-w-xl mb-16">
                    <span className="editorial-rule editorial-rule--accent mb-6 block" />
                    <h1 className="text-5xl md:text-8xl font-serif mb-6 tracking-[-0.03em] leading-[1.1] md:leading-[0.95]">{getLocalized(content.title, lang)}</h1>
                    <p className="text-lg text-[var(--color-neutral-500)]">{getLocalized(content.subtitle, lang)}</p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-8 border-y border-[var(--color-neutral-200)]">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <span className="text-3xl md:text-4xl font-serif font-light tracking-[-0.03em] text-[var(--color-text)]">
                                {stat.value}
                            </span>
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mt-1">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Portfolio Context */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {pillars.map((pillar, idx) => (
                        <div key={idx} className="text-center md:text-left">
                            <span className="block w-8 h-[1px] bg-[var(--color-accent)] mb-4 mx-auto md:mx-0 opacity-50" />
                            <h3 className="text-lg font-serif tracking-[-0.02em] mb-2">{pillar.title}</h3>
                            <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Masonry-style Grid with numbered indices */}
                <PortfolioGrid properties={properties} />

                <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[var(--color-neutral-200)] pt-12">
                    <p className="text-lg font-serif text-[var(--color-neutral-600)]">
                        {getLocalized(content.wantToList, lang)}
                    </p>
                    <Link
                        href={`/${lang}/contact`}
                        className="px-8 py-4 bg-[var(--color-text)] text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[var(--color-accent)] transition-colors rounded-lg"
                    >
                        {getLocalized(content.listYourProperty, lang)}
                    </Link>
                </div>
            </div>

            <CallToAction lang={lang} />
            <Footer lang={lang} />
        </main>
    );
}
