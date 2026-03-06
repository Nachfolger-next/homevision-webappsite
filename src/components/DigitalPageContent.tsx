'use client';

import { type Locale } from '@/i18n-config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevenueCalculator from '@/components/RevenueCalculator';
import Testimonials from '@/components/Testimonials';
import StickyFeatures from '@/components/StickyFeatures';
import TransparencySection from '@/components/TransparencySection';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function DigitalPageContent({ lang }: { lang: Locale }) {
    const content = {
        hero: {
            title: { el: 'Αυξήστε τις Κρατήσεις Σας. Όπου κι αν Βρίσκεται το Ακίνητό Σας.', en: 'Digital Management. Anywhere in Greece.', ru: 'Цифровое управление. В любой точке Греции.', tr: 'Dijital Yönetim. Yunanistan\'da her yerde.', bg: 'Дигитално управление. Навсякъде в Гърция.', he: 'ניהול דיגיטלי. בכל מקום ביוון.' },
            subtitle: {
                el: 'Αφήστε τον αλγόριθμο, τη δυναμική τιμολόγηση και την 24/7 επικοινωνία σε εμάς. Εσείς κρατάτε τον έλεγχο του χώρου σας — εμείς απογειώνουμε τις κρατήσεις σας.',
                en: 'Professional revenue management and 24/7 communication for your property.',
                ru: 'Профессиональное управление доходами и круглосучасовая связь.',
                tr: 'Profesyonel gelir yönetimi ve mülkünüz için 7/24 iletişim.',
                bg: 'Професионално управление на приходи и 24/7 комуникация.',
                he: 'ניהול הכנסות מקצועי ותקשורת 24/7 לנכס שלכם.'
            },
            cta: { el: 'Υπολογίστε τα Έσοδά σας', en: 'Calculate Your Revenue', ru: 'Рассчитать доход', tr: 'Gelirinizi Hesaplayın', bg: 'Изчислете приходите', he: 'חשבו את ההכנסות' }
        }
    };

    const getLocalized = (obj: any) => obj[lang] || obj['en'];
    const prefersReducedMotion = useReducedMotion();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 400]);
    const opacity = useTransform(scrollY, [0, 500], [1, prefersReducedMotion ? 1 : 0]);

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} theme="light" mode="owner" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex items-center justify-center">
                {/* Background Image with Overlay */}
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?q=80&w=2670&auto=format&fit=crop"
                        alt="Digital Nomad Background"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#1A1A1A]/70 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-background)]" />
                </motion.div>

                <div className="container relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span
                            className="inline-block py-1 px-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] mb-6"
                        >
                            Homevision Digital
                        </span>
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif mb-6 tracking-[-0.03em] leading-[1.1] md:leading-[0.95] max-w-5xl mx-auto shadow-black drop-shadow-lg">
                            {getLocalized(content.hero.title)}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto mb-10 leading-relaxed font-light">
                            {getLocalized(content.hero.subtitle)}
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="#calculator" className="bg-[var(--color-warm)] text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.15em] font-bold hover:bg-[#b0935d] transition-colors shadow-lg shadow-[var(--color-warm)]/20">
                                {getLocalized(content.hero.cta)}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Introduction / Value Prep */}
            <section className="py-20 -mt-10 relative z-20">
                <div className="container">
                    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-[var(--color-neutral-200)] flex flex-col md:flex-row gap-8 items-center justify-between">
                        <div className="md:max-w-2xl">
                            <h3 className="text-2xl font-serif mb-3 text-[var(--color-text)]">
                                {({ el: 'Όλα τα Οφέλη της Premium Διαχείρισης. Χωρίς την Πολυπλοκότητα.', en: 'Why Digital?', ru: 'Почему Digital?', tr: 'Neden Dijital?', bg: 'Защо Digital?', he: 'למה דיגיטלי?' }[lang] || 'Why Digital?')}
                            </h3>
                            <p className="text-[var(--color-neutral-500)] leading-relaxed">
                                {({ el: 'Η ιδανική λύση για ιδιοκτήτες που θέλουν να έχουν οι ίδιοι τον έλεγχο της καθαριότητας και της φυσικής υποδοχής, αλλά χρειάζονται την στρατηγική μιας premium ομάδας για να γεμίσουν το ημερολόγιό τους. Κερδίστε την ηρεμία σας και μεγιστοποιήστε τα έσοδά σας, χωρίς την ψηφιακή πολυπλοκότητα των πλατφορμών.', en: 'The ideal solution for owners who want to maximize earnings without dealing with platform complexity, while maintaining control over cleaning and maintenance.', ru: 'Идеальное решение для владельцев, которые хотят максимизировать доход без сложностей платформ.', tr: 'Platform karmaşıklığıyla uğraşmadan kazancınızı maksimize etmek isteyen mülk sahipleri için ideal çözüm.', bg: 'Идеалното решение за собственици, които искат максимални приходи без сложността на платформите.', he: 'הפתרון האידיאלי לבעלי נכסים שרוצים למקסם רווחים ללא מורכבות פלטפורמות.' }[lang] || 'The ideal solution for owners who want to maximize earnings without dealing with platform complexity, while maintaining control over cleaning and maintenance.')}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {['Airbnb Superhost Skills', 'Booking.com Experts', 'Direct Booking (0% Commission)'].map((tag, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-accent-dark)] font-medium">
                                    <CheckCircle2 size={16} />
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <StickyFeatures lang={lang} />

            <TransparencySection lang={lang} />

            <div id="calculator">
                <RevenueCalculator lang={lang} />
            </div>

            <Testimonials lang={lang} />

            {/* Final CTA */}
            <section className="py-32 md:py-40 bg-[var(--color-accent-dark)] text-white text-center">
                <div className="container">
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">
                        {({ el: 'Η Τοποθεσία σας δεν Περιορίζει Πια τα Έσοδά Σας.', en: 'Ready to start?', ru: 'Готовы начать?', tr: 'Başlamaya hazır mısınız?', bg: 'Готови ли сте да започнете?', he: 'מוכנים להתחיל?' }[lang] || 'Ready to start?')}
                    </h2>
                    <p className="text-white/60 mb-10 max-w-xl mx-auto">
                        {({ el: 'Ανεξάρτητα από το πού βρίσκεται το ακίνητό σας στην Ελλάδα, η ψηφιακή μας ομάδα είναι έτοιμη να αναλάβει δράση. Κάντε το πρώτο βήμα για υψηλότερες πληρότητες σήμερα.', en: 'Contact us today for a free property assessment.', ru: 'Свяжитесь с нами для бесплатной оценки вашего объекта.', tr: 'Ücretsiz mülk değerlendirmesi için bugün bize ulaşın.', bg: 'Свържете се с нас за безплатна оценка на имота.', he: 'צרו קשר להערכת נכס חינם.' }[lang] || 'Contact us today for a free property assessment.')}
                    </p>
                    <Link href="#calculator" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] border-b border-white/30 pb-1 hover:text-white hover:border-white transition-all">
                        {({ el: 'Ξεκινήστε τη Δωρεάν Εκτίμηση', en: 'Start Free Assessment', ru: 'Начать бесплатную оценку', tr: 'Ücretsiz Tahmini Başlat', bg: 'Започнете безплатна оценка', he: 'התחל הערכה חינם' }[lang] || 'Start Free Assessment')} <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <Footer lang={lang} />
        </main>
    );
}
