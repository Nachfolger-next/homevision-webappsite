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

import { getAllArticles } from '@/lib/journal';

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

export default async function JournalPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    // Fetch articles from the file system
    const articles = getAllArticles(lang);

    // Pick top article as featured (either explicitly featured, or just the newest one)
    const featured = articles.find(a => a.featured) || articles[0];
    const rest = articles.filter(a => a.slug !== featured?.slug);

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
                {featured && (
                    <Link href={`/${lang}/journal/${featured.slug}`} className="block group mb-16">
                        <div className="relative aspect-[21/9] rounded-xl overflow-hidden min-h-[400px]">
                            {featured.img && (
                                <Image
                                    src={featured.img}
                                    alt={featured.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-all duration-700 grayscale-[20%] group-hover:grayscale-0"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                                <span className="inline-block py-1 px-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] text-white/80 mb-4">
                                    {featured.category}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif text-white mb-3 tracking-[-0.03em] leading-[1.05] max-w-2xl group-hover:translate-x-2 transition-transform duration-500">
                                    {featured.title}
                                </h2>
                                <p className="text-white/50 max-w-xl text-sm md:text-base leading-relaxed">
                                    {featured.excerpt}
                                </p>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {rest.map((article) => (
                        <Link href={`/${lang}/journal/${article.slug}`} key={article.slug} className="group cursor-pointer">
                            <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-5">
                                {article.img && (
                                    <Image
                                        src={article.img}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-all duration-700"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium">
                                    {article.category}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[var(--color-neutral-300)]" />
                                <span className="text-[11px] text-[var(--color-neutral-400)]">
                                    {new Date(article.date).toLocaleDateString(({ el: 'el-GR', en: 'en-US', ru: 'ru-RU', tr: 'tr-TR', bg: 'bg-BG', he: 'he-IL' }[lang] || 'en-US') as string, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-xl font-serif mb-2 tracking-[-0.02em] group-hover:text-[var(--color-accent)] transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed line-clamp-2">
                                {article.excerpt}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] font-medium mt-4 group-hover:gap-2.5 transition-all">
                                {({ el: 'Διαβάστε Περισσότερα', en: 'Read More', ru: 'Читать далее', tr: 'Devamını Oku', bg: 'Прочетете повече', he: 'קרא עוד' }[lang] || 'Read More')}
                                <ArrowRight size={12} />
                            </span>
                        </Link>
                    ))}

                    {articles.length === 0 && (
                        <div className="col-span-full py-20 text-center text-[var(--color-neutral-500)]">
                            {({ el: 'Δεν υπάρχουν άρθρα.', en: 'No articles currently available.', ru: 'Нет доступных статей.', tr: 'Mevcut makale yok.', bg: 'В момента няма налични статии.', he: 'אין מאמרים זמינים כרגע.' }[lang] || 'No articles currently available.')}
                        </div>
                    )}
                </div>
            </div>



            <Footer lang={lang} />
        </main>
    );
}
