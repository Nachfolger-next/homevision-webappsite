'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { type Locale, i18n } from '@/i18n-config';

const localeConfig: Record<string, { flag: string; label: string }> = {
    el: { flag: '🇬🇷', label: 'Ελληνικά' },
    en: { flag: '🇬🇧', label: 'English' },
    ru: { flag: '🇷🇺', label: 'Русский' },
    tr: { flag: '🇹🇷', label: 'Türkçe' },
    bg: { flag: '🇧🇬', label: 'Български' },
    he: { flag: '🇮🇱', label: 'עברית' },
};

export default function LanguageSelector({ lang }: { lang: Locale }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const switchLocale = (newLocale: string) => {
        // Replace current locale prefix with new one
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
        setOpen(false);
    };

    const current = localeConfig[lang] || localeConfig['el'];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/10 cursor-pointer"
                aria-label="Select language"
                aria-expanded={open}
                aria-haspopup="true"
            >
                <Globe size={14} className="opacity-60" />
                <span className="hidden sm:inline">{current.flag}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 opacity-50 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-[var(--color-neutral-200)] overflow-hidden z-50 min-w-[160px]"
                    >
                        {i18n.locales.map((locale) => {
                            const config = localeConfig[locale];
                            const isActive = locale === lang;
                            return (
                                <button
                                    key={locale}
                                    onClick={() => switchLocale(locale)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${isActive
                                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
                                        : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                                        }`}
                                >
                                    <span className="text-base">{config.flag}</span>
                                    <span>{config.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
