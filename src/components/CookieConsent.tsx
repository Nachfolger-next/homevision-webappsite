'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type ConsentState = 'pending' | 'accepted' | 'rejected';

function getConsent(): ConsentState {
    if (typeof window === 'undefined') return 'pending';
    const stored = localStorage.getItem('cookie-consent');
    if (stored === 'accepted' || stored === 'rejected') return stored;
    return 'pending';
}

export default function CookieConsent({ lang = 'en' }: { lang?: string }) {
    const [consent, setConsent] = useState<ConsentState>('accepted'); // default to accepted to avoid flash
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setConsent(getConsent());
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setConsent('accepted');
        // Dispatch custom event so GoogleAnalytics can react
        window.dispatchEvent(new Event('cookie-consent-change'));
    };

    const handleReject = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        setConsent('rejected');
    };

    if (!mounted || consent !== 'pending') return null;

    const labels = {
        message: {
            el: 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας και να αναλύσουμε την επισκεψιμότητα.',
            en: 'We use cookies to improve your experience and analyze site traffic.',
            ru: 'Мы используем файлы cookie для улучшения вашего опыта и анализа трафика.',
            tr: 'Deneyiminizi geliştirmek ve site trafiğini analiz etmek için çerezler kullanıyoruz.',
            bg: 'Използваме бисквитки, за да подобрим преживяването ви и да анализираме трафика.',
            he: 'אנו משתמשים בעוגיות כדי לשפר את החוויה שלך ולנתח את תעבורת האתר.',
        },
        accept: {
            el: 'Αποδοχή', en: 'Accept', ru: 'Принять', tr: 'Kabul Et', bg: 'Приемам', he: 'אישור',
        },
        reject: {
            el: 'Απόρριψη', en: 'Reject', ru: 'Отклонить', tr: 'Reddet', bg: 'Отказвам', he: 'דחייה',
        },
        learnMore: {
            el: 'Μάθετε περισσότερα', en: 'Learn more', ru: 'Подробнее', tr: 'Daha fazla', bg: 'Научете повече', he: 'למידע נוסף',
        },
    };

    const t = (obj: Record<string, string>) => obj[lang] || obj['en'] || '';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
            >
                <div className="container max-w-4xl mx-auto">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[var(--color-neutral-200)] shadow-lg p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--color-neutral-600)] leading-relaxed">
                                {t(labels.message)}{' '}
                                <Link
                                    href={`/${lang}/privacy`}
                                    className="text-[var(--color-accent)] hover:underline underline-offset-2"
                                >
                                    {t(labels.learnMore)}
                                </Link>
                            </p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
                            <button
                                onClick={handleReject}
                                className="flex-1 md:flex-none px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] font-semibold rounded-full border border-[var(--color-neutral-300)] text-[var(--color-neutral-600)] hover:border-[var(--color-neutral-400)] transition-colors cursor-pointer"
                            >
                                {t(labels.reject)}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] font-semibold rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors cursor-pointer"
                            >
                                {t(labels.accept)}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
