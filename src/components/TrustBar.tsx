'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Locale } from '@/i18n-config';

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const statsContent = [
    { value: 50, suffix: '+', label: { el: 'Ακίνητα', en: 'Properties Managed', ru: 'Объектов', tr: 'Mülk Yönetildi', bg: 'Имоти', he: 'נכסים מנוהלים' } },
    { value: 4.9, suffix: '★', label: { el: 'Βαθμολογία', en: 'Guest Rating', ru: 'Рейтинг', tr: 'Misafir Puanı', bg: 'Рейтинг', he: 'דירוג אורחים' }, isDecimal: true, highlight: true },
    { value: 3000, suffix: '+', label: { el: 'Check-ins', en: 'Guest Check-ins', ru: 'Заездов', tr: 'Check-in', bg: 'Настанявания', he: 'צ\'ק-אין' }, highlight: true },
    { value: 95, suffix: '%', label: { el: 'Πληρότητα', en: 'Occupancy Rate', ru: 'Заполняемость', tr: 'Doluluk Oranı', bg: 'Заетост', he: 'שיעור תפוסה' } },
];

const sectionLabels = {
    poweredBy: { el: 'Τεχνολογία', en: 'Powered by', ru: 'Технологии', tr: 'Destekleyen', bg: 'Технология', he: 'מופעל על ידי' },
    listedOn: { el: 'Καταχωρημένοι σε', en: 'Listed on', ru: 'Размещены на', tr: 'Listelenen', bg: 'Регистрирани в', he: 'רשום ב' },
};

// --- Logo Components ---

// Each logo gets its own bounding box tuned for optical balance
// Wide wordmarks (4:1+) → wider max-w, shorter max-h
// Square-ish logos (2:1) → narrower max-w, taller max-h
const LogoImage = ({ src, alt, maxW, maxH }: { src: string; alt: string; maxW: string; maxH: string }) => (
    <div className={`flex items-center justify-center ${maxW} ${maxH}`}>
        <Image
            src={src}
            alt={alt}
            width={200}
            height={60}
            className="w-full h-full object-contain grayscale opacity-50 hover:opacity-70 transition-opacity duration-300"
        />
    </div>
);

// Text-based logo (fallback for brands without image files)
const TextLogo = ({ name }: { name: string }) => (
    <span className="text-[14px] md:text-[16px] font-bold tracking-tight text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-500)] transition-colors duration-300">
        {name}
    </span>
);

// Optically-normalized logos — each tuned so visual weight is balanced
const techStack = [
    { name: 'Hostaway', Logo: () => <TextLogo name="hostaway" /> },
    { name: 'PriceLabs', Logo: () => <LogoImage src="/logo_pricelabs.png" alt="PriceLabs" maxW="max-w-[120px]" maxH="max-h-[30px]" /> },
    { name: 'Google Gemini', Logo: () => <div className="-translate-y-[4px]"><LogoImage src="/logo_gemini.png" alt="Google Gemini" maxW="max-w-[100px]" maxH="max-h-[28px]" /></div> },
    { name: 'Stripe', Logo: () => <LogoImage src="/logo_stripe.png" alt="Stripe" maxW="max-w-[80px]" maxH="max-h-[32px]" /> },
];

const listedOn = [
    { name: 'Airbnb', Logo: () => <LogoImage src="/logo_airbnb.png" alt="Airbnb" maxW="max-w-[110px]" maxH="max-h-[28px]" /> },
    { name: 'Booking.com', Logo: () => <LogoImage src="/logo_booking.svg.png" alt="Booking.com" maxW="max-w-[130px]" maxH="max-h-[24px]" /> },
    { name: 'VRBO', Logo: () => <LogoImage src="/logo_vrbo.png" alt="VRBO" maxW="max-w-[90px]" maxH="max-h-[24px]" /> },
    { name: 'Google Vacation Rentals', Logo: () => <LogoImage src="/logo_google_vacation_rentals.webp" alt="Google Vacation Rentals" maxW="max-w-[100px]" maxH="max-h-[28px]" /> },
    { name: 'Marriott Homes & Villas', Logo: () => <LogoImage src="/logo_mariott.svg" alt="Marriott Homes & Villas" maxW="max-w-[110px]" maxH="max-h-[28px]" /> },
];

function AnimatedCounter({ value, suffix, isDecimal = false, highlight = false, inView }: {
    value: number;
    suffix: string;
    isDecimal?: boolean;
    highlight?: boolean;
    inView: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const duration = 1800;
        const start = performance.now();

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            if (isDecimal) {
                setCount(Math.round(eased * value * 10) / 10);
            } else {
                setCount(Math.round(eased * value));
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, value, isDecimal]);

    return (
        <span className={highlight ? 'text-[var(--color-warm)]' : ''}>
            {isDecimal ? count.toFixed(1) : count}
            <span className={`text-lg md:text-xl ml-0.5 ${highlight ? 'text-[var(--color-warm)]' : 'text-[var(--color-accent-muted)]'}`}>{suffix}</span>
        </span>
    );
}

export default function TrustBar({ lang = 'en' }: { lang?: Locale }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="relative -mt-20 z-20 mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-white/50 py-10 md:py-14 px-6 md:px-12">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-14">
                    {statsContent.map((stat, idx) => (
                        <motion.div
                            key={getLocalized(stat.label, 'en')}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-serif font-light tracking-[-0.02em] text-[var(--color-text)] mb-2">
                                <AnimatedCounter
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    isDecimal={stat.isDecimal}
                                    highlight={stat.highlight}
                                    inView={isInView}
                                />
                            </div>
                            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] font-medium">
                                {getLocalized(stat.label, lang)}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Logo Rows */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="space-y-8"
                >
                    {/* Powered By — Tech Stack */}
                    <div className="flex flex-col items-center gap-5">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-neutral-400)] font-medium">
                            {getLocalized(sectionLabels.poweredBy, lang)}
                        </span>
                        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap text-[var(--color-neutral-400)] hover:[&>div]:text-[var(--color-neutral-600)]">
                            {techStack.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: 0.6 + idx * 0.08 }}
                                    className="transition-colors duration-300 cursor-default flex items-center gap-2"
                                    title={item.name}
                                >
                                    <item.Logo />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex justify-center">
                        <div className="h-[1px] w-16 bg-[var(--color-neutral-200)]" />
                    </div>

                    {/* Listed On — Platforms */}
                    <div className="flex flex-col items-center gap-5">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-neutral-400)] font-medium">
                            {getLocalized(sectionLabels.listedOn, lang)}
                        </span>
                        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap text-[var(--color-neutral-400)] hover:[&>div]:text-[var(--color-neutral-600)]">
                            {listedOn.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: 0.7 + idx * 0.08 }}
                                    className="transition-colors duration-300 cursor-default flex items-center gap-2"
                                    title={item.name}
                                >
                                    <item.Logo />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
