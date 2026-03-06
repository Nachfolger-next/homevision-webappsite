import { type Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Journal: Hospitality Insights | Homevision',
    description: 'Expert insights, market trends, and actionable tips for short-term rental owners in Greece.',
    openGraph: {
        title: 'Homevision Journal',
        description: 'Insights, trends, and stories from the world of hospitality.',
        type: 'website',
    },
    alternates: getAlternates('/journal'),
};

const content = {
    title: { el: 'Journal', en: 'Journal', ru: 'Журнал', tr: 'Dergi', bg: 'Журнал', he: 'יומן' },
    subtitle: {
        el: 'Συμβουλές, τάσεις και ιστορίες από τον κόσμο της φιλοξενίας.',
        en: 'Insights, trends, and stories from the world of hospitality.',
        ru: 'Советы, тренды и истории из мира гостеприимства.',
        tr: 'Konaklama dünyasından içgörüler, trendler ve hikayeler.',
        bg: 'Съвети, тенденции и истории от света на гостоприемството.',
        he: 'תובנות, מגמות וסיפורים מעולם האירוח.',
    },
};

const articles = [
    {
        id: 1,
        title: { el: 'Πώς να Μεγιστοποιήσετε τα Έσοδα το Καλοκαίρι', en: 'How to Maximize Summer Revenue', ru: 'Как максимизировать летний доход', tr: 'Yaz Gelirini Nasıl Maksimize Edersiniz', bg: 'Как да максимизирате лятните приходи', he: 'איך למקסם הכנסות בקיץ' },
        excerpt: { el: 'Στρατηγικές τιμολόγησης και βελτιστοποίησης για τη summer season.', en: 'Pricing strategies and optimization tips to make the most of peak season bookings in Greece.', ru: 'Стратегии ценообразования для пикового сезона.', tr: 'Yunanistan\'da yaz sezonu için fiyatlandırma stratejileri.', bg: 'Стратегии за върховия сезон.', he: 'אסטרטגיות תמחור לעונת השיא.' },
        category: { el: 'Στρατηγική', en: 'Strategy', ru: 'Стратегия', tr: 'Strateji', bg: 'Стратегия', he: 'אסטרטגיה' },
        date: '2026-02-10',
        img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop',
        featured: true,
    },
    {
        id: 2,
        title: { el: 'Η Τέχνη του Check-in', en: 'The Art of the Perfect Check-in', ru: 'Искусство заселения', tr: 'Mükemmel Check-in Sanatı', bg: 'Изкуството на настаняването', he: 'אמנות הצ\'k-אין' },
        excerpt: { el: 'Γιατί η πρώτη εντύπωση είναι η πιο σημαντική.', en: 'Why the first impression matters most and how to create a five-star arrival experience for your guests.', ru: 'Почему первое впечатление важнее всего.', tr: 'İlk izlenimin neden önemli olduğu.', bg: 'Защо първото впечатление е най-важно.', he: 'למה הרושם הראשון הוא החשוב ביותר.' },
        category: { el: 'Εμπειρία', en: 'Guest Experience', ru: 'Опыт гостей', tr: 'Misafir Deneyimi', bg: 'Гостоприятство', he: 'חוויית אורחים' },
        date: '2026-01-28',
        img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
        featured: false,
    },
    {
        id: 3,
        title: { el: 'Thessaloniki: Ο Κρυφός Θησαυρός', en: 'Thessaloniki: The Hidden Gem of Greece', ru: 'Салоники: жемчужина Греции', tr: 'Selanik: Yunanistan\'in Gizli Hazinesi', bg: 'Солун: Скритото съкровище', he: 'סלוניקי: הפנינה הנסתרת' },
        excerpt: { el: 'Γιατί η Θεσσαλονίκη αναδεικνύεται ως top destination.', en: 'Why Thessaloniki is emerging as one of Europe\'s top short-term rental markets and what it means for owners.', ru: 'Почему Салоники — топ-рынок аренды.', tr: 'Selanik\'in neden yükselen bir kiralama pazarı olduğu.', bg: 'Защо Солун става топ дестинация.', he: 'למה סלוניקי עולה כשוק ההשכרה.' },
        category: { el: 'Αγορά', en: 'Market Insights', ru: 'Рынок', tr: 'Pazar Analizi', bg: 'Пазар', he: 'תובנות שוק' },
        date: '2026-01-15',
        img: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=2670&auto=format&fit=crop',
        featured: false,
    },
    {
        id: 4,
        title: { el: 'Δυναμική Τιμολόγηση: Πλήρης Οδηγός', en: 'Dynamic Pricing: A Complete Guide', ru: 'Динамическое ценообразование: гид', tr: 'Dinamik Fiyatlandırma: Eksiksiz Rehber', bg: 'Динамично ценообразуване: Нанасяне', he: 'תמחור דינמי: מדריך מלא' },
        excerpt: { el: 'Πώς η δυναμική τιμολόγηση μπορεί να αυξήσει τα έσοδα μέχρι 40%.', en: 'How dynamic pricing algorithms can increase your rental revenue by up to 40% without sacrificing occupancy rates.', ru: 'Как динамическое ценообразование увеличивает доход до 40%.', tr: 'Dinamik fiyatlandırma kira gelirinizi %40\'a kadar nasıl artırır.', bg: 'Как динамичното ценообразуване увеличава приходите с 40%.', he: 'איך תמחור דינמי מגדיל הכנסות עד 40%.' },
        category: { el: 'Στρατηγική', en: 'Strategy', ru: 'Стратегия', tr: 'Strateji', bg: 'Стратегия', he: 'אסטרטגיה' },
        date: '2026-01-05',
        img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop',
        featured: false,
    },
    {
        id: 5,
        title: { el: 'Short-term vs Long-term Ενοικίαση', en: 'Short-term vs Long-term: Which Is Right for You?', ru: 'Краткосрочная вс долгосрочная аренда', tr: 'Kısa Süreli mi Uzun Süreli mi?', bg: 'Краткосрочен вс дългосрочен наем', he: 'השכרה לטווח קצר מול ארוך' },
        excerpt: { el: 'Μια σύγκριση εσόδων, ρίσκου και διαχείρισης.', en: 'A comprehensive comparison of revenue, risk, and management effort between short-term and long-term rental strategies.', ru: 'Сравнение доходов, рисков и управления.', tr: 'Kısa ve uzun süreli kiralama karşılaştırması.', bg: 'Сравнение на приходи и управление.', he: 'השוואה מקיפה של הכנסות וסיכון.' },
        category: { el: 'Ανάλυση', en: 'Analysis', ru: 'Анализ', tr: 'Analiz', bg: 'Анализ', he: 'ניתוח' },
        date: '2025-12-20',
        img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2670&auto=format&fit=crop',
        featured: false,
    },
    {
        id: 6,
        title: { el: 'Ιδανικό Interior Design για Airbnb', en: 'Interior Design Tips for Short-term Rentals', ru: 'Советы по дизайну', tr: 'Kısa Süreli Kiralamalar İçin Tasarım', bg: 'Съвети за интериорен дизайн', he: 'טיפים לעיצוב פנים' },
        excerpt: { el: 'Πώς να δημιουργήσετε χώρους που φωτογραφίζονται υπέροχα.', en: 'Design principles that photograph beautifully, impress guests, and stand out from the competition.', ru: 'Принципы дизайна, которые отлично выглядят на фото.', tr: 'Güzel fotoğraflanan ve misafirleri etkileyen tasarım ilkeleri.', bg: 'Принципи, които изглеждат страхотно на снимки.', he: 'עקרונות עיצוב שנראים נהדר בצילום.' },
        category: { el: 'Design', en: 'Design', ru: 'Дизайн', tr: 'Tasarım', bg: 'Дизайн', he: 'עיצוב' },
        date: '2025-12-10',
        img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2500&auto=format&fit=crop',
        featured: false,
    },
];

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

export default async function JournalPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const featured = articles.find(a => a.featured)!;
    const rest = articles.filter(a => !a.featured);

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} />

            {/* Spacer for fixed header */}
            <div style={{ height: '120px' }} />

            <div className="container pb-20 md:pb-32">
                {/* Asymmetric header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                    <div className="md:max-w-lg">
                        <span className="editorial-rule editorial-rule--accent mb-6 block" />
                        <h1 className="text-6xl md:text-8xl font-serif mb-4 tracking-[-0.03em] leading-[0.95]">
                            {getLocalized(content.title, lang)}
                        </h1>
                    </div>
                    <p className="md:max-w-sm md:text-right text-[var(--color-neutral-500)] text-base leading-relaxed">
                        {getLocalized(content.subtitle, lang)}
                    </p>
                </div>

                {/* Featured Article — Hero Layout */}
                <div className="block group mb-16">
                    <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
                        <Image
                            src={featured.img}
                            alt={getLocalized(featured.title, lang)}
                            fill
                            className="object-cover group-hover:scale-105 transition-all duration-700 grayscale-[20%] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                            <span className="inline-block py-1 px-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] text-white/80 mb-4">
                                {getLocalized(featured.category, lang)}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif text-white mb-3 tracking-[-0.03em] leading-[1.05] max-w-2xl group-hover:translate-x-2 transition-transform duration-500">
                                {getLocalized(featured.title, lang)}
                            </h2>
                            <p className="text-white/50 max-w-xl text-sm md:text-base leading-relaxed">
                                {getLocalized(featured.excerpt, lang)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {rest.map((article) => (
                        <div key={article.id} className="group cursor-default">
                            <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-5">
                                <Image
                                    src={article.img}
                                    alt={getLocalized(article.title, lang)}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-all duration-700"
                                />
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium">
                                    {getLocalized(article.category, lang)}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[var(--color-neutral-300)]" />
                                <span className="text-[11px] text-[var(--color-neutral-400)]">
                                    {new Date(article.date).toLocaleDateString(({ el: 'el-GR', en: 'en-US', ru: 'ru-RU', tr: 'tr-TR', bg: 'bg-BG', he: 'he-IL' }[lang] || 'en-US') as string, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-xl font-serif mb-2 tracking-[-0.02em] group-hover:text-[var(--color-accent)] transition-colors">
                                {getLocalized(article.title, lang)}
                            </h3>
                            <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed line-clamp-2">
                                {getLocalized(article.excerpt, lang)}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] font-medium mt-4 group-hover:gap-2.5 transition-all">
                                {({ el: 'Σύντομα Κοντά σας', en: 'Coming Soon', ru: 'Скоро', tr: 'Yakında', bg: 'Очаквайте', he: 'בקרוב' }[lang] || 'Coming Soon')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>



            <Footer lang={lang} />
        </main>
    );
}
