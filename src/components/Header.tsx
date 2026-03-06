'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n-config';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';

export default function Header({ lang, theme = 'light', mode = 'guest' }: { lang: Locale, theme?: 'light' | 'dark', mode?: 'guest' | 'owner' }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: `/${lang}/services`, label: { el: 'Υπηρεσίες', en: 'Services', ru: 'Услуги', he: 'שירותים', tr: 'Hizmetler', bg: 'Услуги', mk: 'Услуги' } },
        { href: `/${lang}/portfolio`, label: { el: 'Portfolio', en: 'Portfolio', ru: 'Портфолио', he: 'תיק עבודות', tr: 'Portföy', bg: 'Портфолио', mk: 'Портфолио' } },
        { href: `/${lang}/about`, label: { el: 'Η Εταιρεία', en: 'About', ru: 'О нас', he: 'עלינו', tr: 'Hakkımızda', bg: 'За нас', mk: 'За нас' } },
        { href: `/${lang}/contact`, label: { el: 'Επικοινωνία', en: 'Contact', ru: 'Контакты', he: 'צור קשר', tr: 'İletişim', bg: 'Контакт', mk: 'Контакт' } },
    ];

    const ctaConfig = {
        guest: {
            label: { el: 'Κράτηση', en: 'Book Now', ru: 'Забронировать', tr: 'Rezervasyon', bg: 'Резервация', he: 'הזמינו עכשיו' },
            href: `/${lang}/properties`
        },
        owner: {
            label: { el: 'Υπολογισμός Εσόδων', en: 'Calculate Revenue', ru: 'Рассчитать доход', tr: 'Gelir Hesapla', bg: 'Калкулатор', he: 'חשבו הכנסות' },
            href: '#calculator'
        }
    };

    const activeCta = ctaConfig[mode];
    const labelObj = activeCta.label as any; // Quick cast to avoid strict index signature issue since we have a fallback
    const ctaLabel = typeof activeCta.label === 'string' ? activeCta.label : (labelObj[lang] || labelObj['en']);

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                    isScrolled || mobileMenuOpen
                        ? 'bg-white/90 backdrop-blur-md py-3 md:py-4 text-[var(--color-text)]'
                        : theme === 'dark'
                            ? 'bg-transparent py-4 md:py-6 text-white'
                            : 'bg-transparent py-4 md:py-6 text-[var(--color-text)]'
                )}
                style={isScrolled ? { boxShadow: '0 1px 0 rgba(0,0,0,0.04)' } : {}}
            >
                <div className="container flex items-center justify-between">
                    <Link href={`/${lang}`} className="relative z-50">
                        <Image
                            src={!(isScrolled || mobileMenuOpen) && theme === 'dark' ? "/logo-white.png" : "/logo-color.png"}
                            alt="Homevision"
                            width={180}
                            height={40}
                            className="h-8 w-auto object-contain object-left transition-all"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[11px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity font-medium"
                            >
                                {link.label[lang] || link.label['en']}
                            </Link>
                        ))}
                        <LanguageSelector lang={lang} />
                        <Link
                            href={activeCta.href}
                            className="px-5 py-2 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.15em] font-bold rounded-full hover:bg-[var(--color-accent-dark)] transition-colors"
                        >
                            {ctaLabel}
                        </Link>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden relative z-50 p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col"
                    >
                        <nav className="flex flex-col gap-0">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block text-3xl font-serif py-4 border-b border-[var(--color-neutral-200)] text-[var(--color-text)]"
                                    >
                                        {link.label[lang] || link.label['en']}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link
                                    href={activeCta.href}
                                    className="mt-8 block text-center px-6 py-4 bg-[var(--color-accent)] text-white text-[11px] uppercase tracking-[0.15em] font-bold rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {ctaLabel}
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className="mt-6 flex justify-center"
                            >
                                <LanguageSelector lang={lang} />
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
