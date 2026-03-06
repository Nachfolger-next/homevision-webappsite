'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useScroll } from 'framer-motion';
import { Locale } from '@/i18n-config';

const content = {
    title: { el: 'Απόλυτη Διαφάνεια. Καμία Κρυφή Χρέωση.', en: 'Full Visibility From Anywhere. No Surprises.', ru: 'Полная видимость откуда угодно. Никаких сюрпризов.', tr: 'Her Yerden Tam Görünürlük. Sürpriz Yok.', bg: 'Пълна видимост откъдето и да сте. Без изненади.', he: 'נראות מלאה מכל מקום. בלי הפתעות.' },
    subtitle: {
        el: 'Ξεχάστε τις αμφιβολίες. Μέσα από το υπερσύγχρονο portal μας, έχετε την πλήρη εικόνα του ακινήτου σας, 24/7, απευθείας από την οθόνη σας.',
        en: 'Your owner dashboard gives you real-time access to bookings, revenue, and maintenance reports — in English, 24/7, from any device. No need to call. No need to wonder.',
        ru: 'Ваша панель владельца даёт доступ в реальном времени к бронированиям, доходам и отчётам — 24/7, с любого устройства. Не нужно звонить. Не нужно гадать.',
        tr: 'Sahip paneliniz size rezervasyonlara, gelirlere ve bakım raporlarına gerçek zamanlı erişim sağlar — 7/24, her cihazdan. Aramaya gerek yok. Merak etmeye gerek yok.',
        bg: 'Панелът ви дава достъп в реално време до резервации, приходи и отчети — 24/7, от всяко устройство. Без обаждания. Без неизвестност.',
        he: 'לוח הבקרה שלכם נותן גישה בזמן אמת להזמנות, הכנסות ודוחות תחזוקה — 24/7, מכל מכשיר. אין צורך להתקשר. אין צורך לתהות.'
    },
    features: [
        { el: 'Ζωντανή προβολή κρατήσεων', en: 'Live Booking Calendar', ru: 'Живой календарь бронирований', tr: 'Canlı Rezervasyon Takvimi', bg: 'Календар на резервациите на живо', he: 'יומן הזמנות חי' },
        { el: 'Αναλυτικές οικονομικές αναφορές', en: 'Detailed Financial Reports', ru: 'Подробные финансовые отчёты', tr: 'Detaylı Finansal Raporlar', bg: 'Подробни финансови отчети', he: 'דוחות כספיים מפורטים' },
        { el: 'Ιστορικό συντήρησης', en: 'Maintenance History', ru: 'История обслуживания', tr: 'Bakım Geçmişi', bg: 'История на поддръжката', he: 'היסטוריית תחזוקה' },
        { el: 'Άμεση επικοινωνία', en: 'Direct Communication', ru: 'Прямая коммуникация', tr: 'Doğrudan İletişim', bg: 'Директна комуникация', he: 'תקשורת ישירה' },
    ]
};

const getLocalized = (obj: any, lang: string) => obj[lang] || obj['en'] || '';

// --- Sub-components for the mockup ---

function AnimatedNumber({ value, suffix = '', duration = 1.5 }: { value: number, suffix?: string, duration?: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest: number) => Math.round(latest).toLocaleString());

    useEffect(() => {
        const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1], delay: 0.5 });
        return controls.stop;
    }, [count, value, duration]);

    return (
        <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="tabular-nums inline-block"
        >
            <motion.span>{rounded}</motion.span>
            {suffix}
        </motion.span>
    );
}

function MockupChart() {
    return (
        <div className="h-28 md:h-32 w-full relative group cursor-crosshair">
            <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
                {/* Horizontal Grid Lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                    <line
                        key={y}
                        x1="0" y1={y} x2="400" y2={y}
                        stroke="white"
                        strokeOpacity="0.05"
                        strokeWidth="1"
                        className="transition-opacity duration-300 group-hover:stroke-opacity-[0.08]"
                    />
                ))}

                {/* The Path */}
                <motion.path
                    d="M 0 100 Q 50 80, 100 90 T 200 60 T 300 40 T 400 30"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                    viewport={{ once: true, margin: "-30px" }}
                />

                {/* Gradient area under path */}
                <motion.path
                    d="M 0 100 Q 50 80, 100 90 T 200 60 T 300 40 T 400 30 V 120 H 0 Z"
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.15 }}
                    transition={{ duration: 1, delay: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    className="group-hover:opacity-25 transition-opacity duration-500"
                />

                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent)" />
                        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Animated Dots */}
                {[
                    { x: 100, y: 90 },
                    { x: 200, y: 60 },
                    { x: 300, y: 40 },
                    { x: 400, y: 30 }
                ].map((pt, i) => (
                    <motion.circle
                        key={i}
                        cx={pt.x} cy={pt.y} r="4"
                        fill="var(--color-accent)"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        whileHover={{ scale: 1.5 }}
                        transition={{ delay: 1.2 + (i * 0.1), duration: 0.3 }}
                        viewport={{ once: true }}
                        className="cursor-pointer"
                    />
                ))}
            </svg>
        </div>
    );
}

export default function TransparencySection({ lang }: { lang: Locale }) {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center center"]
    });

    // Scroll-driven 3D parallax effects
    const rotateXTransform = useTransform(scrollYProgress, [0, 1], [15, 0]);
    const yTransform = useTransform(scrollYProgress, [0, 1], [100, 0]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
    const scaleTransform = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

    // Ambient background Parallax
    const glowY1 = useTransform(scrollYProgress, [0, 1], [100, -50]);
    const glowY2 = useTransform(scrollYProgress, [0, 1], [-100, 50]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-[#0F0F0F] text-white overflow-hidden relative grain-overlay perspective-[2000px]">
            {/* Dot grid texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Text Content */}
                    <div className="w-full lg:w-5/12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <span className="editorial-rule mb-8 block" style={{ background: 'var(--color-accent)', opacity: 0.6 }} />
                            <span className="text-[var(--color-accent)] text-[10px] uppercase tracking-[0.25em] font-medium mb-4 block">
                                {({ el: 'Πίνακας Ελέγχου', en: 'Owner Dashboard', ru: 'Панель управления', tr: 'Sahip Paneli', bg: 'Табло за управление', he: 'לוח בקרה לבעלים' }[lang] || 'Owner Dashboard')}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 tracking-[-0.03em] leading-[1.05]">
                                {getLocalized(content.title, lang)}
                            </h2>
                            <p className="text-white/40 text-sm md:text-base mb-10 leading-relaxed max-w-md">
                                {getLocalized(content.subtitle, lang)}
                            </p>

                            <ul className="space-y-4 md:space-y-5">
                                {content.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-4 group">
                                        <span className="text-[10px] text-[var(--color-accent)]/50 font-medium tracking-widest w-6 transition-colors duration-300 group-hover:text-[var(--color-accent)]">0{idx + 1}</span>
                                        <span className="text-sm md:text-base font-medium tracking-wide text-white/70 transition-colors duration-300 group-hover:text-white">{getLocalized(feature, lang)}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Mockup / Visual — Refined Portal */}
                    <div className="w-full lg:w-7/12 relative [transform-style:preserve-3d]">
                        <motion.div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            style={{
                                rotateX: rotateXTransform,
                                y: yTransform,
                                opacity: opacityTransform,
                                scale: scaleTransform,
                                boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)',
                            }}
                            className="relative z-10 bg-white/[0.02] border border-white/[0.04] rounded-3xl p-6 md:p-8 backdrop-blur-xl group/card overflow-hidden"
                        >
                            {/* Dynamic Spotlight Glow */}
                            <motion.div
                                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                                style={{
                                    background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
                                }}
                            />

                            {/* Inner Noise for tactile feel */}
                            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay grain-bg rounded-3xl" />

                            <div className="relative z-10">
                                {/* Browser Header / Navigation */}
                                <div className="flex items-center justify-between mb-8 border-b border-white/[0.06] pb-5">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#ff6e66] transition-colors cursor-pointer" />
                                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#ffc64a] transition-colors cursor-pointer" />
                                        <div className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#32da4a] transition-colors cursor-pointer" />
                                    </div>
                                    <div className="flex gap-4 md:gap-6">
                                        <div className="h-1.5 w-8 md:w-12 bg-white/[0.1] rounded-full" />
                                        <div className="h-1.5 w-8 md:w-12 bg-white/[0.05] rounded-full" />
                                    </div>
                                </div>

                                {/* Main Stats Row */}
                                <div className="grid grid-cols-2 gap-6 md:gap-8 mb-10">
                                    <div className="space-y-2">
                                        <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-medium">{({ el: 'Μηνιαίο Εισόδημα', en: 'Monthly Income', ru: 'Месячный доход', tr: 'Aylık Gelir', bg: 'Месечен приход', he: 'הכנסה חודשית' }[lang] || 'Monthly Income')}</span>
                                        <div className="text-3xl md:text-4xl font-serif text-[var(--color-accent)] drop-shadow-sm">
                                            €<AnimatedNumber value={12840} />
                                        </div>
                                        <div className="text-[9px] md:text-[10px] text-emerald-400/90 font-medium mt-1 flex items-center gap-1">
                                            <span>{({ el: '↑ 12% από προηγ. μήνα', en: '↑ 12% vs last month', ru: '↑ 12% к пред. месяцу', tr: '↑ 12% geçen aya göre', bg: '↑ 12% спрямо миналия месец', he: '↑ 12% לעומת חודש שעבר' }[lang] || '↑ 12% vs last month')}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-medium">{({ el: 'Πληρότητα', en: 'Occupancy Rate', ru: 'Заполняемость', tr: 'Doluluk Oranı', bg: 'Заетост', he: 'שיעור תפוסה' }[lang] || 'Occupancy Rate')}</span>
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                        </div>
                                        <div className="text-3xl md:text-4xl font-serif text-white/90">
                                            <AnimatedNumber value={94} suffix="%" />
                                        </div>
                                        <div className="h-1 w-full bg-white/[0.05] rounded-full mt-3 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '94%' }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                                viewport={{ once: true }}
                                                className="h-full bg-gradient-to-r from-white/20 to-white/60 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="mb-10 w-full overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-medium">{({ el: 'Αναλυτικά Έσοδα', en: 'Earnings Analytics', ru: 'Аналитика доходов', tr: 'Gelir Analizi', bg: 'Анализ на приходи', he: 'אנליטיקת הכנסות' }[lang] || 'Earnings Analytics')}</span>
                                        <span className="text-[9px] text-white/20 tracking-wide">{({ el: 'Τελευταίοι 6 Μήνες', en: 'Last 6 Months', ru: 'Последние 6 месяцев', tr: 'Son 6 Ay', bg: 'Последните 6 месеца', he: '6 החודשים האחרונים' }[lang] || 'Last 6 Months')}</span>
                                    </div>
                                    <MockupChart />
                                </div>

                                {/* Recent Activity / Bookings */}
                                <div className="space-y-3">
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-medium block mb-4">{({ el: 'Πρόσφατες Κρατήσεις', en: 'Recent Bookings', ru: 'Последние бронирования', tr: 'Son Rezervasyonlar', bg: 'Скорошни резервации', he: 'הזמנות אחרונות' }[lang] || 'Recent Bookings')}</span>
                                    {[
                                        { name: 'Richard D. James', date: 'Jul 12-15', amount: '€1,250' },
                                        { name: 'Jeff Mills', date: 'Jul 16-18', amount: '€480' },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            whileHover={{ scale: 1.015, backgroundColor: 'rgba(255,255,255,0.06)', x: 5 }}
                                            transition={{ duration: 0.2 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.04] cursor-default"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--color-accent)] shadow-inner">
                                                    {item.name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-white/90">{item.name}</div>
                                                    <div className="text-[10px] text-white/40 mt-0.5 tracking-wide">{item.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs md:text-sm font-serif text-[var(--color-accent)]">{item.amount}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Enhanced Parallax Glow Effects */}
                        <motion.div
                            style={{ y: glowY1 }}
                            className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-[var(--color-accent)]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
                        />
                        <motion.div
                            style={{ y: glowY2 }}
                            className="absolute -bottom-24 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
