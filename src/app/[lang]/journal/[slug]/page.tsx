import { type Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getArticleBySlug, getAllArticles } from '@/lib/journal';
import { getAlternates } from '@/lib/metadata';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params;
    const article = getArticleBySlug(slug, lang);

    if (!article) {
        return {
            title: 'Article Not Found | Homevision',
        };
    }

    return {
        title: `${article.title} | Homevision Journal`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.date,
            images: [
                {
                    url: article.img,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        alternates: getAlternates(`/journal/${slug}`),
    };
}

export async function generateStaticParams() {
    // Generate paths for all languages and articles
    const locales: Locale[] = ['en', 'el', 'ru', 'tr', 'bg', 'he'];
    // We can just return an empty array and let Next.js build them dynamically
    // or return the slugs. To keep it simple, we'll fetch them for just 'en' 
    // since the structure is the same for all languages.
    const articles = getAllArticles('en');

    const params = [];
    for (const locale of locales) {
        for (const article of articles) {
            params.push({ lang: locale, slug: article.slug });
        }
    }
    return params;
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
    const { lang, slug } = await params;
    const article = getArticleBySlug(slug, lang);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} />

            {/* Spacer for fixed header */}
            <div style={{ height: '80px' }} />

            <article className="pb-20 md:pb-32">
                {/* Hero section */}
                <div className="container md:pt-10 mb-12">
                    <Link
                        href={`/${lang}/journal`}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-[var(--color-neutral-500)] hover:text-[var(--color-accent)] transition-colors mb-8"
                    >
                        <ArrowLeft size={14} />
                        {({ el: 'Επιστροφή στο Journal', en: 'Back to Journal', ru: 'Вернуться в журнал', tr: 'Dergiye Dön', bg: 'Обратно към Журнала', he: 'חזור ליומן' }[lang] || 'Back to Journal')}
                    </Link>

                    <div className="max-w-4xl">
                        <span className="inline-block py-1.5 px-4 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-6">
                            {article.category}
                        </span>

                        <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-[-0.03em] leading-[1.05]">
                            {article.title}
                        </h1>

                        <div className="flex items-center gap-4 text-xs text-[var(--color-neutral-500)] mb-10">
                            <time dateTime={article.date}>
                                {new Date(article.date).toLocaleDateString(({ el: 'el-GR', en: 'en-US', ru: 'ru-RU', tr: 'tr-TR', bg: 'bg-BG', he: 'he-IL' }[lang] || 'en-US') as string, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </time>
                            <span className="w-1 h-1 rounded-full bg-[var(--color-neutral-300)]" />
                            <span>Homevision Team</span>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                {article.img && (
                    <div className="container max-w-6xl mb-16">
                        <div className="relative aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden shadow-accent-lg">
                            <Image
                                src={article.img}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="container max-w-3xl">
                    <div className="prose prose-neutral prose-lg lg:prose-xl max-w-none prose-headings:font-serif prose-headings:tracking-[-0.02em] prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:text-[var(--color-accent-dark)] prose-img:rounded-xl">
                        <ReactMarkdown>
                            {article.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>

            <Footer lang={lang} />
        </main>
    );
}
