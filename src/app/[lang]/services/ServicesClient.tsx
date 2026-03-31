'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown, Check, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import Image from 'next/image';
import { Locale } from '@/i18n-config';
import { Dictionary } from '@/lib/get-dictionary';

function t(dict: Dictionary, key: string, defaultValue: string = '') {
    const keys = key.split('.');
    let value: any = dict;
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return defaultValue;
        }
    }
    return typeof value === 'string' ? value : defaultValue;
}

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <div className="divide-y divide-[var(--color-neutral-200)]">
            {faqs.map((item, idx) => (
                <div key={idx}>
                    <button
                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        className="w-full flex items-center justify-between py-6 text-left group"
                    >
                        <span className="text-base md:text-lg font-serif tracking-[-0.02em] pr-8 group-hover:text-[var(--color-accent)] transition-colors">
                            {item.q}
                        </span>
                        <motion.div
                            animate={{ rotate: openIdx === idx ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                        >
                            <ChevronDown size={18} className="text-[var(--color-neutral-400)]" />
                        </motion.div>
                    </button>
                    <AnimatePresence>
                        {openIdx === idx && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                            >
                                <p className="pb-6 text-[var(--color-neutral-500)] leading-relaxed max-w-2xl">
                                    {item.a}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

// 3D Tilt Card Component
function PricingCard({ plan, recommended, lang, dict }: { plan: any, recommended: boolean, lang: string, dict: Dictionary }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useMotionTemplate`${mouseYSpring}deg`;
    const rotateY = useMotionTemplate`${mouseXSpring}deg`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        
        x.set(xPct * 10);
        y.set(yPct * -10);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div style={{ perspective: 1000 }} className="h-full">
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`bg-white rounded-2xl p-8 md:p-10 border relative h-full flex flex-col transition-shadow duration-300 hover:shadow-2xl ${recommended
                ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20 shadow-lg'
                : 'border-[var(--color-neutral-200)] shadow-sm'
                }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
        >
            {recommended && (
                <span className="absolute -top-3 left-8 bg-[var(--color-accent)] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full z-10" style={{ transform: "translateZ(20px)" }}>
                    {t(dict, 'services.recommended', 'Recommended')}
                </span>
            )}

            <div style={{ transform: "translateZ(30px)" }} className="flex-1 flex flex-col">
                <h3 className="text-2xl font-serif mb-2 tracking-[-0.02em]">
                    {plan.label}
                </h3>
                <p className="text-sm text-[var(--color-neutral-500)] mb-4 leading-relaxed">
                    {plan.desc}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-serif text-[var(--color-accent)]">{plan.commission}</span>
                    <span className="text-sm text-[var(--color-neutral-500)]">
                        {t(dict, 'services.commission', 'commission')}
                    </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="bg-[var(--color-accent)]/10 p-0.5 rounded-full text-[var(--color-accent)] mt-0.5 flex-shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span className="text-sm text-[var(--color-neutral-600)]">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                <a
                    href={`/${lang}/contact`}
                    className={`block text-center mt-auto py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-bold transition-all ${recommended
                        ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] hover:-translate-y-1'
                        : 'border border-[var(--color-neutral-300)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:-translate-y-1'
                        }`}
                >
                    {t(dict, 'services.getStarted', 'Get Started')}
                </a>
            </div>
        </motion.div>
        </div>
    );
}

export default function ServicesClient({ lang, dict }: { lang: Locale, dict: Dictionary }) {

    const stepsRaw = dict.services?.steps || [];
    const steps = [
        { num: '01', title: stepsRaw[0]?.title || 'Consultation', desc: stepsRaw[0]?.desc || 'Free property assessment.', img: '/services-step-1.webp' },
        { num: '02', title: stepsRaw[1]?.title || 'Onboarding', desc: stepsRaw[1]?.desc || 'Professional photography & setup.', img: '/services-step-2.webp' },
        { num: '03', title: stepsRaw[2]?.title || 'Go Live', desc: stepsRaw[2]?.desc || 'Start receiving bookings.', img: '/services-step-3.webp' },
    ];

    const plansRaw = dict.services?.plans || {};
    const services = {
        full: {
            label: plansRaw.full?.label || 'Full Management',
            desc: plansRaw.full?.desc || 'The complete solution.',
            commission: '20%',
            features: plansRaw.full?.features || [],
            recommended: true,
        },
        digital: {
            label: plansRaw.digital?.label || 'Digital Management',
            desc: plansRaw.digital?.desc || 'For owners who want to save time.',
            commission: '12%',
            features: plansRaw.digital?.features || [],
            recommended: false,
        },
    };

    const faqs = dict.services?.faqs || [];

    const testimonial = {
        quote: dict.services?.testimonial?.quote || 'I live permanently abroad, and managing my house in Greece was a constant headache. Homevision took over everything with absolute transparency. The immediate updates I receive make me feel completely secure from afar.',
        author: dict.services?.testimonial?.author || 'Manolis E.',
        role: dict.services?.testimonial?.role || 'Apartment Owner, Thessaloniki',
    };

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} theme="light" />

            {/* Hero Intro */}
            <section className="pt-40 pb-20 md:pt-48 md:pb-28">
                <div className="container">
                    <div className="max-w-3xl">
                        <span className="editorial-rule editorial-rule--accent mb-6 block" />
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-serif mb-6 tracking-[-0.03em] leading-[1.1] md:leading-[0.95]"
                        >
                            {t(dict, 'services.title', 'Our Services')}
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-[var(--color-neutral-500)] leading-relaxed max-w-4xl font-light"
                        >
                            {t(dict, 'services.subtitle', 'Two tiers of service, one goal: maximizing your property potential.')}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="pb-20 md:pb-32">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                        <div className="md:max-w-lg">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium block mb-4">
                                {t(dict, 'services.howItWorks', 'How It Works')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif tracking-[-0.03em]">
                                {t(dict, 'services.threeSimpleSteps', 'Three Simple Steps')}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div 
                                key={idx} 
                                className="group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.6 }}
                            >
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                                    <Image
                                        src={step.img}
                                        alt={step.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <span className="absolute top-4 left-4 text-white/20 text-6xl font-serif font-light">
                                        {step.num}
                                    </span>
                                </div>
                                <h3 className="text-xl font-serif mb-2 tracking-[-0.02em]">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Comparison */}
            <section className="py-20 md:py-32 bg-[var(--color-surface)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-background)]/50 pointer-events-none" />
                <div className="container relative z-10">
                    <div className="max-w-xl mb-16">
                        <span className="editorial-rule editorial-rule--accent mb-6 block" />
                        <h2 className="text-4xl md:text-5xl font-serif tracking-[-0.03em] mb-4">
                            {t(dict, 'services.chooseYourPlan', 'Choose Your Plan')}
                        </h2>
                        <p className="text-[var(--color-neutral-500)] leading-relaxed">
                            {t(dict, 'services.bothPlansInclude', 'Both plans include full owner portal access and dedicated account management.')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {Object.entries(services).map(([key, plan]) => (
                            <PricingCard key={key} plan={plan} recommended={plan.recommended} lang={lang} dict={dict} />
                        ))}
                    </div>
                    
                    {/* RISK REVERSAL BADGE */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto mt-12 flex justify-center"
                    >
                        <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-green-100 flex items-center gap-4 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="bg-green-100/50 text-green-700 p-3 rounded-full group-hover:scale-110 transition-transform">
                                <ShieldCheck size={28} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className="font-serif text-lg tracking-[-0.02em] text-[#0F0F0F] mb-0.5">{lang === 'el' ? 'Εγγύηση Μηδενικού Ρίσκου' : 'Zero-Risk Guarantee'}</h4>
                                <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed max-w-sm">{lang === 'el' ? 'Χωρίς κρυφές χρεώσεις, κόστος εγγραφής ή μακροχρόνια συμβόλαια. Πληρωνόμαστε μόνο όταν πληρώνεστε εσείς.' : 'No hidden fees, setup costs, or lock-in contracts. We get paid only when you get paid.'}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-20 md:py-28 bg-[#0F0F0F] text-white grain-overlay relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900 rounded-full blur-[80px]" />
                </div>
                
                <div className="container relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <svg className="w-12 h-12 mx-auto mb-8 text-[var(--color-accent)] opacity-50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>

                        <blockquote className="text-2xl md:text-4xl font-serif leading-[1.4] tracking-[-0.02em] mb-8">
                            &ldquo;{testimonial.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <span className="text-sm font-medium text-white block">{testimonial.author}</span>
                                <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] mt-1">
                                    {testimonial.role}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
                        <div>
                            <span className="editorial-rule editorial-rule--accent mb-6 block" />
                            <h2 className="text-4xl md:text-5xl font-serif tracking-[-0.03em] mb-4">
                                {t(dict, 'services.faqTitle', 'FAQ')}
                            </h2>
                            <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed">
                                {t(dict, 'services.faqDesc', 'Everything you need to know before getting started.')}
                            </p>
                        </div>
                        <div>
                            <FAQAccordion faqs={faqs} />
                        </div>
                    </div>
                </div>
            </section>

            <CallToAction lang={lang} />
            <Footer lang={lang} />
        </main>
    );
}
