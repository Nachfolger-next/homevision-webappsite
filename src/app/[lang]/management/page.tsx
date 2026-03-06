import { type Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';
import QualityInspection from '@/components/QualityInspection';

export const metadata: Metadata = {
    title: 'Full Property Management in Greece | Homevision',
    description: 'End-to-end short-term rental management — cleaning, guest communication, dynamic pricing, maintenance, and revenue optimization. We handle everything so you don\'t have to.',
    openGraph: {
        title: 'Full Property Management | Homevision',
        description: 'The art of hospitality. Full-service property management for owners who demand the best.',
        type: 'website',
    },
    alternates: getAlternates('/management'),
};

const content = {
    hero: {
        title: { el: 'Το Ακίνητό σας σε Αυτόματο Πιλότο.', en: 'The Art of Hospitality', ru: 'Искусство гостеприимства', tr: 'Konukseverlik Sanatı', bg: 'Изкуството на гостоприемството', he: 'אמנות האירוח' },
        subtitle: {
            el: 'Εσείς κερδίζετε τα έσοδα. Εμείς αναλαμβάνουμε τα πάντα.',
            en: 'You earn the revenue. We handle everything else.',
            ru: 'Вы зарабатываете доход. Мы берём на себя всё остальное.',
            tr: 'Siz geliri kazanın. Geri kalan her şeyi biz halledelim.',
            bg: 'Вие печелите приходите. Ние се грижим за всичко останало.',
            he: 'אתם מרוויחים. אנחנו מטפלים בכל השאר.'
        }
    },
    intro: {
        heading: { el: 'Απόλυτη Ξεγνοιασιά.', en: 'Complete Peace of Mind', ru: 'Полное спокойствие', tr: 'Tam Huzur', bg: 'Пълно спокойствие', he: 'שקט נפשי מלא' },
        text: {
            el: 'Από την επαγγελματική φωτογράφιση μέχρι τον βαθύ καθαρισμό μετά το check-out, διαχειριζόμαστε την περιουσία σας σαν να ήταν δική μας. Εσείς, απλά δεν χρειάζεται να ασχοληθείτε με τίποτα.',
            en: 'We handle everything from listing to cleaning, operations, and guest support, so you don\'t have to.',
            ru: 'Мы берем на себя все: от размещения до уборки, операций и поддержки гостей.',
            tr: 'İlan oluşturmadan temizliğe, operasyonlardan misafir desteğine kadar her şeyi biz hallediyoruz.',
            bg: 'Ние се грижим за всичко: от обявата до почистването, операциите и подкрепата на гостите.',
            he: 'אנחנו מטפלים בהכל מפרסום ועד ניקיון, תפעול ותמיכת אורחים.'
        }
    }
};

const getLocalized = (obj: any, lang: string) => obj[lang] || obj['en'] || '';

const services = {
    title1: { el: "Λειτουργίες & Logistics", en: "Operations & Logistics", ru: "Операции и логистика", tr: "Operasyonlar ve Lojistik", bg: "Операции и логистика", he: "תפעול ולוגיסטיקה" },
    items1: [
        { el: "Καθαρισμός Ξενοδοχειακού Επιπέδου (5 Αστέρων)", en: "Hotel-grade Cleaning", ru: "Уборка гостиничного уровня", tr: "Otel Standartlarında Temizlik", bg: "Почистване на хотелско ниво", he: "ניקיון ברמת מלון" },
        { el: "Διαχείριση Premium Λευκών Ειδών & Ιματισμού", en: "Premium Linen Management", ru: "Управление постельным бельем премиум-класса", tr: "Premium Nevresim Yönetimi", bg: "Управление на премиум спално бельо", he: "ניהול מצעי פרימיום" },
        { el: "Τακτική & Προληπτική Συντήρηση", en: "Routine Maintenance", ru: "Регулярное техническое обслуживание", tr: "Rutin Bakım", bg: "Рутинна поддръжка", he: "תחזוקה שוטפת" },
        { el: "Άμεση Αποκατάσταση & Επιθεωρήσεις Ζημιών", en: "Damage Inspections", ru: "Проверки на наличие повреждений", tr: "Hasar Denetimleri", bg: "Инспекции за щети", he: "בדיקות נזקים" }
    ],
    img1: "/mgmt-operations.webp",

    title2: { el: "Εμπειρία Επισκεπτών", en: "Guest Experience", ru: "Впечатления гостей", tr: "Misafir Deneyimi", bg: "Изживяване за гостите", he: "חווית אורח" },
    items2: [
        { el: "24/7 Υποστήριξη & Επικοινωνία (Άμεση Απόκριση)", en: "24/7 Concierge Support", ru: "Круглосуточная поддержка консьержа", tr: "7/24 Concierge Desteği", bg: "24/7 поддръжка от консиерж", he: "תמיכת קונסיירז' 24/7" },
        { el: "VIP Υποδοχή & Προσωπικό Check-in", en: "In-person Check-in (Premium)", ru: "Личная регистрация (премиум)", tr: "Yüz Yüze Giriş (Premium)", bg: "Лично настаняване (премиум)", he: "צ'ק אין אישי (פרימיום)" },
        { el: "Επιλεγμένοι Τοπικοί Οδηγοί & Προτάσεις", en: "Curated Local Guides", ru: "Кураторские местные путеводители", tr: "Özenle Hazırlanmış Yerel Rehberler", bg: "Подбрани местни гидове", he: "מדריכים מקומיים מותאמים" },
        { el: "Premium Welcome Basket (Δώρο Καλωσορίσματος)", en: "Welcome Gifts", ru: "Приветственные подарки", tr: "Hoşgeldin Hediyeleri", bg: "Подаръци за добре дошли", he: "מתנות קבלת פנים" }
    ],
    img2: "/mgmt-experience.webp",

    title3: { el: "Βελτιστοποίηση Εσόδων", en: "Revenue Optimization", ru: "Оптимизация доходов", tr: "Gelir Optimizasyonu", bg: "Оптимизация на приходите", he: "ייעול הכנסות" },
    items3: [
        { el: "Αλγόριθμοι Δυναμικής Τιμολόγησης ανά Ημέρα", en: "Dynamic Pricing Algorithms", ru: "Алгоритмы динамического ценообразования", tr: "Dinamik Fiyatlandırma Algoritmaları", bg: "Алгоритми за динамично ценообразуване", he: "אלגוריתמי תמחור דינמי" },
        { el: "Πολυκαναλική Διανομή (Airbnb, Booking, VRBO)", en: "Multi-channel Distribution", ru: "Многоканальное распространение", tr: "Çok Kanallı Dağıtım", bg: "Многоканално разпространение", he: "הפצה רב עροצית" },
        { el: "Ιστοσελίδα Απευθείας Κρατήσεων (0% Προμήθεια)", en: "Direct Booking Website (0% Commission)", ru: "Сайт прямого бронирования", tr: "Doğrudan Rezervasyon Sitesi", bg: "Уебсайт за директни резервации", he: "אתר הזמנות ישירות" },
        { el: "Νομική & Φορολογική Καθοδήγηση", en: "Legal Compliance & Taxes", ru: "Законодательство и налоги", tr: "Yasal Uyum ve Vergiler", bg: "Законово съответствие и данъци", he: "ציות לחוק ומיסים" },
        { el: "Διαφανείς Μηνιαίες Αναφορές Απόδοσης", en: "Monthly Performance Reports", ru: "Ежемесячные отчеты о производительности", tr: "Aylık Performans Raporları", bg: "Месечни отчети за изпълнение", he: "דוחות ביצועים חודשיים" }
    ],
    img3: "/mgmt-revenue.webp"
};

export default async function ManagementPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} theme="dark" />

            {/* Hero Section - Video Background */}
            <section className="relative h-[70vh] md:h-[65vh] flex items-end overflow-hidden grain-overlay">
                {/* Video Background */}
                <VideoBackground
                    src="/Management_hero.mp4"
                    poster="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2669&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="container relative z-10 pb-12 md:pb-32">
                    <span className="editorial-rule mb-6 md:mb-8 block" style={{ background: 'white', opacity: 0.4 }} />
                    <h1 className="text-[2rem] md:text-8xl font-serif mb-4 md:mb-6 text-white tracking-[-0.03em] leading-[1.15] md:leading-[0.95]">
                        {getLocalized(content.hero.title, lang)}
                    </h1>
                    <p className="text-base md:text-xl text-white/70 font-light tracking-wide max-w-lg mb-6 md:mb-10 leading-relaxed">
                        {getLocalized(content.hero.subtitle, lang)}
                    </p>
                    {/* Editorial text-link CTA — preserves cinematic mood */}
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/80 font-medium border-b border-white/30 pb-1 hover:text-white hover:border-white transition-all duration-300"
                    >
                        {({ el: 'Δωρεάν Αξιολόγηση', en: 'Get a Free Assessment', ru: 'Бесплатная оценка', tr: 'Ücretsiz Değerlendirme', bg: 'Безплатна оценка', he: 'הערכה חינם' }[lang] || 'Get a Free Assessment')}
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-16 md:py-40 container">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium mb-4 md:mb-6 block">
                        {({ el: 'Πλήρης Διαχείριση', en: 'Full Service Management', ru: 'Полный комплекс услуг по управлению', tr: 'Tam Otel Yönetimi', bg: 'Пълно обслужване при управление', he: 'ניהול שירות מלא' }[lang] || 'Full Service Management')}
                    </span>
                    <h2 className="text-3xl md:text-6xl font-serif mb-6 md:mb-8 text-[var(--color-text)] leading-[1.15] md:leading-[1]">
                        {getLocalized(content.intro.heading, lang)}
                    </h2>
                    <p className="text-base md:text-xl text-[var(--color-neutral-500)] leading-relaxed font-light">
                        {getLocalized(content.intro.text, lang)}
                    </p>
                </div>
            </section>

            {/* Core Services Grid (Bento/Card Style) */}
            <section className="bg-[var(--color-neutral-100)] py-24 md:py-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: services.title1, items: services.items1, img: services.img1 },
                            { title: services.title2, items: services.items2, img: services.img2 },
                            { title: services.title3, items: services.items3, img: services.img3 }
                        ].map((service, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500">
                                <div className="h-64 relative overflow-hidden">
                                    <Image
                                        src={service.img}
                                        alt={getLocalized(service.title, lang)}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="p-8 md:p-10">
                                    <h3 className="text-2xl font-serif mb-6 tracking-tight">{getLocalized(service.title, lang)}</h3>
                                    <ul className="space-y-4">
                                        {service.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-neutral-600)]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                                                {getLocalized(item, lang)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Homevision Standard — Cinematic 50-Point Inspection */}
            <QualityInspection lang={lang} />

            <CallToAction lang={lang} />
            <Footer lang={lang} />
        </main>
    );
}
