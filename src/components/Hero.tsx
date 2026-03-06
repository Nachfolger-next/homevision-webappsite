'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n-config';

const content = {
    headline: { el: 'Premium Φιλοξενία.\nΑνέμελη Ιδιοκτησία.', en: 'Your Property in Greece.\nManaged Like You\'re Next Door.', ru: 'Ваша Недвижимость в Греции.\nПод Управлением Как Будто Вы Рядом.', tr: 'Yunanistan\'daki Mülkünüz.\nYanınızdaymışız Gibi Yönetiliyor.', bg: 'Вашият Имот в Гърция.\nУправляван Сякаш Сте До Нас.', he: 'הנכס שלכם ביוון.\nמנוהל כאילו אתם ממש כאן.' },
    subtitle: {
        el: 'Εσείς απολαμβάνετε τα έσοδα, εμείς αναλαμβάνουμε όλα τα υπόλοιπα.',
        en: 'Whether you\'re in London, Dubai or New York — you earn the revenue, we handle everything on the ground.',
        ru: 'Где бы вы ни были — в Лондоне, Дубае или Нью-Йорке — вы получаете доход, мы берём всё на себя на месте.',
        tr: 'Londra\'da, Dubai\'de veya New York\'ta olun — gelir sizin, her şeyi biz yerinde hallederiz.',
        bg: 'Където и да сте — Лондон, Дубай или Ню Йорк — вие печелите, ние се грижим за всичко на място.',
        he: 'בין אם אתם בלונדון, דובאי או ניו יורק — אתם מרוויחים, אנחנו מטפלים בהכל בשטח.',
    },
    cta: { el: 'Δωρεάν Εκτίμηση', en: 'Get a Free Assessment', ru: 'Бесплатная оценка', tr: 'Ücretsiz Değerlendirme', bg: 'Безплатна оценка', he: 'הערכה חינם' },
    discover: { el: 'Δωρεάν Εκτίμηση', en: 'Free Revenue Estimate', ru: 'Бесплатная оценка дохода', tr: 'Ücretsiz Gelir Tahmini', bg: 'Безплатна оценка на приходите', he: 'הערכת הכנסות חינם' },
    locations: [
        { label: { el: 'Θεσσαλονίκη', en: 'Thessaloniki', ru: 'Салоники', tr: 'Selanik', bg: 'Солун', he: 'סלוניקי' }, x: '12%', y: '25%', delay: 1.8 },
        { label: { el: 'Χαλκιδική', en: 'Chalkidiki', ru: 'Халкидики', tr: 'Halkidiki', bg: 'Халкидики', he: 'חלקידיקי' }, x: '78%', y: '35%', delay: 2.1 },
        { label: { el: 'Αθήνα', en: 'Athens', ru: 'Афины', tr: 'Atina', bg: 'Атина', he: 'אתונה' }, x: '20%', y: '72%', delay: 2.4 },
        { label: { el: 'Νησιά', en: 'Islands', ru: 'Острова', tr: 'Adalar', bg: 'Острови', he: 'איים' }, x: '82%', y: '68%', delay: 2.7 },
    ],
};

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

export default function Hero({ lang = 'en' }: { lang?: Locale }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const locationOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const locationY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%']);

    const headlineText = getLocalized(content.headline, lang);
    const headlineLines = headlineText.split('\n');
    const subtitleWords = getLocalized(content.subtitle, lang).split(' ');

    // For desktop: letter-by-letter animation (signature anchor)
    const headlineChars = headlineText.split('');

    return (
        <section
            ref={containerRef}
            className="relative h-[85vh] md:h-screen w-full overflow-hidden flex items-end md:items-center justify-center grain-overlay"
        >
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/hero.webp)',
                        filter: 'contrast(1.05) brightness(0.95)',
                    }}
                />
                {/* Overlay: stronger on mobile for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a4d]/70 via-[#447d9c]/30 to-[#1a2a35]/85 md:hidden" />
                {/* Overlay: lighter on desktop */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a4d]/60 via-[#447d9c]/20 to-[#1a2a35]/70 hidden md:block" />
            </motion.div>

            {/* Floating Location Badges — desktop only */}
            <motion.div
                style={{ opacity: locationOpacity, y: locationY }}
                className="absolute inset-0 z-[2] pointer-events-none hidden md:block"
            >
                {content.locations.map((loc) => (
                    <motion.div
                        key={getLocalized(loc.label, 'en')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: loc.delay, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute"
                        style={{ left: loc.x, top: loc.y }}
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: 'easeInOut' }}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warm)]" />
                            <span className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-medium">{getLocalized(loc.label, lang)}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Content — bottom-aligned on mobile, centered on desktop */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 text-white px-6 md:px-4 pb-28 md:pb-0 w-full md:w-auto text-left md:text-center"
            >
                {/* Signature brand line — extends on load */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[2px] bg-[var(--color-warm)] mb-6 md:mb-8 md:mx-auto"
                />

                {/* === MOBILE HEADLINE: word-level animation, smaller size === */}
                <h1 className="md:hidden text-[2rem] font-serif font-light tracking-[-0.02em] mb-5 leading-[1.2]">
                    <span className="sr-only">{headlineText}</span>
                    <span aria-hidden="true">
                        {headlineLines.map((line, lineIdx) => (
                            <span key={lineIdx} className="block">
                                {line.split(' ').map((word, wordIdx) => {
                                    // Calculate global word index for delay
                                    const prevWordsCount = headlineLines
                                        .slice(0, lineIdx)
                                        .reduce((acc, l) => acc + l.split(' ').length, 0);
                                    const globalIdx = prevWordsCount + wordIdx;
                                    return (
                                        <motion.span
                                            key={`${lineIdx}-${wordIdx}`}
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.7,
                                                delay: 0.3 + globalIdx * 0.1,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            className="inline-block mr-[0.25em]"
                                        >
                                            {word}
                                        </motion.span>
                                    );
                                })}
                            </span>
                        ))}
                    </span>
                </h1>

                {/* === DESKTOP HEADLINE: letter-stagger (signature anchor) === */}
                <h1 className="hidden md:block text-8xl lg:text-[10rem] font-serif font-light tracking-[-0.04em] mb-8 leading-[0.9]">
                    <span className="sr-only">{headlineText}</span>
                    <span aria-hidden="true" className="inline-flex flex-wrap justify-center">
                        {headlineChars.map((char, i) => (
                            char === '\n' ? (
                                <span key={i} className="basis-full h-0" />
                            ) : (
                                <motion.span
                                    key={i}
                                    initial={{ y: 80, opacity: 0, rotateX: 40 }}
                                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.3 + i * 0.05,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="inline-block"
                                    style={{ marginRight: char === ' ' ? '0.25em' : '0' }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            )
                        ))}
                    </span>
                </h1>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.2 }}
                    className="flex flex-col items-start md:items-center gap-4 md:gap-6"
                >
                    <span className="block w-10 md:w-12 h-[1px] bg-white/40" />
                    <p className="text-[13px] md:text-base font-light tracking-[0.12em] md:tracking-[0.3em] uppercase max-w-[320px] md:max-w-4xl md:mx-auto text-white/80 leading-relaxed md:leading-normal">
                        {subtitleWords.map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-block mr-[0.3em]"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </p>
                </motion.div>

                {/* Mobile CTA — in thumb zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 md:hidden"
                >
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-block px-7 py-3.5 bg-white text-[var(--color-text)] text-[10px] uppercase tracking-[0.15em] font-bold rounded-full hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                    >
                        {getLocalized(content.cta, lang)}
                    </Link>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator — desktop only for cleanliness */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-3 hidden md:flex"
            >
                <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">{getLocalized(content.discover, lang)}</span>
                <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                    <motion.div
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                        className="absolute top-0 left-0 w-full h-1/3 bg-[var(--color-warm)]"
                    />
                </div>
            </motion.div>
        </section>
    );
}
