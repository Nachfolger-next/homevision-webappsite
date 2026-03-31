'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { Locale } from '@/i18n-config';

const dictionary: Record<string, Record<Locale, string>> = {
    checkAvailability: {
        en: 'Check Availability',
        el: 'Έλεγχος Διαθεσιμότητας',
        ru: 'Проверить доступность',
        tr: 'Müsaitlik Kontrolü',
        bg: 'Проверка на наличност',
        he: 'בדוק זמינות',
    }
};

interface MobileStickyCTAProps {
    lang: Locale;
}

export default function MobileStickyCTA({ lang }: MobileStickyCTAProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the hero (roughly 600px)
            setIsVisible(window.scrollY > 600);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
                    
                    <button
                        onClick={scrollToTop}
                        className="relative w-full flex items-center justify-center gap-2 bg-[var(--color-accent)] text-white py-4 rounded-xl font-semibold shadow-lg shadow-[var(--color-accent)]/20 active:scale-[0.98] transition-all"
                    >
                        <Calendar size={18} />
                        {dictionary.checkAvailability[lang] || dictionary.checkAvailability.en}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
