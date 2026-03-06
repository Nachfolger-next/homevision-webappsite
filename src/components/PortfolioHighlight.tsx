'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Locale } from '@/i18n-config';
import Image from 'next/image';

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const sectionLabels = {
    title: { el: 'Επιλεγμένα Ακίνητα', en: 'Curated Portfolio', ru: 'Портфолио', tr: 'Seçilmiş Portföy', bg: 'Избрано портфолио', he: 'תיק עבודות נבחר' },
    viewAll: { el: 'Δείτε όλα', en: 'View All', ru: 'Смотреть все', tr: 'Tümünü Görün', bg: 'Вижте всички', he: 'צפו בהכל' },
};

const PROPERTIES = [
    { id: 1, title: "Okto Penthouse", location: "Thessaloniki", img: "/portfolio_okto_penthouse_portrait.webp" },
    { id: 2, title: "Urban Hub", location: "Thessaloniki", img: "/portfolio_urbanhub_portrait.webp" },
    { id: 3, title: "Basquiat", location: "Thessaloniki", img: "/portfolio_basquiat_portrait.webp" },
    { id: 4, title: "Deka Apartment", location: "Thessaloniki", img: "/portfolio_deka_portrait.webp" },
    { id: 5, title: "Ant1", location: "Thessaloniki", img: "/portfolio_ant1_portrait.webp" },
    { id: 6, title: "Nido Blu", location: "Thessaloniki", img: "/portfolio_nidoblu_portrait.webp" },
    { id: 7, title: "Heart of Yes", location: "Thessaloniki", img: "/portfolio_heartofyes_square.webp" },
    { id: 8, title: "Bliss", location: "Thessaloniki", img: "/portfolio_bliss_portrait.webp" },
];

export default function PortfolioHighlight({ lang }: { lang: Locale }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <>
            {/* Desktop Version: Sticky Horizontal Scroll */}
            <section ref={targetRef} className="hidden md:block relative h-[300vh] bg-[#1A1A1A] text-white">
                <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

                    {/* Asymmetric header */}
                    <div className="container mb-10 flex justify-between items-end">
                        <div>
                            <span className="editorial-rule mb-6 block" style={{ background: 'var(--color-neutral-400)' }} />
                            <h2 className="text-6xl md:text-7xl font-serif tracking-[-0.03em]">{getLocalized(sectionLabels.title, lang)}</h2>
                        </div>
                        <Link href={`/${lang}/portfolio`} className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition group">
                            {getLocalized(sectionLabels.viewAll, lang)} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <motion.div style={{ x }} className="flex gap-8 px-24 w-max cursor-grab active:cursor-grabbing">
                        {PROPERTIES.map((prop, idx) => (
                            <div key={prop.id} className="relative w-[500px] aspect-[3/4] group cursor-pointer overflow-hidden rounded-lg">
                                <Image
                                    src={prop.img}
                                    alt={prop.title}
                                    fill
                                    className="object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-[var(--color-accent)]/15 group-hover:bg-[var(--color-accent)]/5 transition-colors duration-500" />

                                {/* Numbered index — parallax-offset */}
                                <div className="absolute top-6 left-6">
                                    <span className="text-white/15 text-7xl font-serif font-light">{String(idx + 1).padStart(2, '0')}</span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <h3 className="text-2xl font-serif mb-1 group-hover:translate-x-2 transition-transform duration-500 tracking-[-0.02em]">{prop.title}</h3>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 group-hover:translate-x-2 transition-transform duration-500 delay-75">{prop.location}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mobile Version: Vertical Stack */}
            <section className="md:hidden py-20 bg-[#1A1A1A] text-white">
                <div className="container">
                    <div className="mb-10">
                        <span className="editorial-rule mb-6 block" style={{ background: 'var(--color-neutral-400)' }} />
                        <h2 className="text-4xl font-serif mb-6 tracking-[-0.03em]">{getLocalized(sectionLabels.title, lang)}</h2>
                    </div>

                    <div className="space-y-8">
                        {PROPERTIES.slice(0, 4).map((prop, idx) => (
                            <div key={prop.id} className="block relative aspect-[3/4] group cursor-pointer overflow-hidden rounded-lg">
                                <Image
                                    src={prop.img}
                                    alt={prop.title}
                                    fill
                                    className="object-cover transition-all duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10" />

                                {/* Numbered index */}
                                <div className="absolute top-4 left-4">
                                    <span className="text-white/15 text-5xl font-serif font-light">0{idx + 1}</span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="text-xl font-serif mb-1">{prop.title}</h3>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">{prop.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link href={`/${lang}/portfolio`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 border-b border-white/20 pb-1 hover:text-white transition">
                            {getLocalized(sectionLabels.viewAll, lang)} <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
