'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Smartphone, Globe, ShieldCheck, BarChart3, Clock, MessageSquare, Check, Calendar, ArrowUpRight, Search, Home, RefreshCw } from 'lucide-react';
import { Locale } from '@/i18n-config';
import Image from 'next/image';

// --- Brand SVG Logos (from Simple Icons — verified) ---

const AirbnbLogo = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#FF5A5F">
        <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z" />
    </svg>
);

const BookingLogo = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#003580">
        <path d="M24 0H0v24h24ZM8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898 0 1.15-.575 1.82-.91 2.108l-.287.263.335.192c.815.479 1.318 1.389 1.318 2.395 0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15zm1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365 0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533 0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341 1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z" />
    </svg>
);

const ExpediaLogo = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#FBCE04">
        <path d="M19.067 0H4.933A4.94 4.94 0 0 0 0 4.933v14.134A4.932 4.932 0 0 0 4.933 24h14.134A4.932 4.932 0 0 0 24 19.067V4.933C24.01 2.213 21.797 0 19.067 0ZM7.336 19.341c0 .19-.148.337-.337.337h-2.33a.333.333 0 0 1-.337-.337v-2.33c0-.189.148-.336.337-.336H7c.19 0 .337.147.337.337zm12.121-1.486-2.308 2.298c-.169.168-.422.053-.422-.2V9.57l-6.44 6.44a.533.533 0 0 1-.421.17H8.169a.32.32 0 0 1-.338-.338v-1.697c0-.2.053-.316.169-.422l6.44-6.44H4.058c-.253 0-.369-.253-.2-.421l2.297-2.309c.137-.137.285-.232.517-.232H18.15c.854 0 1.539.686 1.539 1.54v11.478c-.01.231-.095.368-.232.516z" />
    </svg>
);

const VrboLogo = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
        <rect width="24" height="24" rx="4" fill="#3B5FC0" />
        <text x="3.5" y="16" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">vrbo</text>
    </svg>
);

// --- Polished UI Visuals ---

const MultiChannelVisual = ({ lang }: { lang: Locale }) => (
    <div className="w-full h-full bg-[var(--color-surface)] rounded-2xl flex items-center justify-center relative overflow-hidden p-8">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.04]"
            style={{
                backgroundImage: 'linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}
        />

        {/* Central Node — Homevision Logo */}
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className="w-28 h-28 bg-white rounded-full shadow-xl flex items-center justify-center z-10 border-2 border-[var(--color-accent)]/20 relative overflow-hidden"
        >
            <Image
                src="/logo-color.png"
                alt="Homevision"
                width={90}
                height={90}
                className="object-contain"
            />
        </motion.div>

        {/* Orbiting Nodes — Real Brand Logos */}
        {[
            { Logo: AirbnbLogo, label: "Airbnb", delay: 0.15, x: -100, y: -80 },
            { Logo: BookingLogo, label: "Booking", delay: 0.25, x: 100, y: -80 },
            { Logo: ExpediaLogo, label: "Expedia", delay: 0.35, x: -100, y: 80 },
            { Logo: VrboLogo, label: "VRBO", delay: 0.45, x: 100, y: 80 },
        ].map((item, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, x: item.x, y: item.y }}
                transition={{ delay: item.delay, type: "spring", stiffness: 200, damping: 20 }}
                className="absolute w-16 h-16 bg-white rounded-xl shadow-md flex flex-col items-center justify-center border border-[var(--color-neutral-200)] z-20 gap-0.5"
            >
                <item.Logo />
                <span className="text-[9px] font-medium text-[var(--color-neutral-600)]">{item.label}</span>
            </motion.div>
        ))}

        {/* Connecting Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 400 400">
            {[
                { x1: 200, y1: 200, x2: 100, y2: 120 },
                { x1: 200, y1: 200, x2: 300, y2: 120 },
                { x1: 200, y1: 200, x2: 100, y2: 280 },
                { x1: 200, y1: 200, x2: 300, y2: 280 },
            ].map((line, i) => (
                <motion.line
                    key={i}
                    x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                    stroke="var(--color-accent)"
                    strokeWidth="1"
                    strokeOpacity="0.15"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                />
            ))}
        </svg>
    </div>
);

const DynamicPricingVisual = ({ lang }: { lang: Locale }) => (
    <div className="w-full h-full bg-[var(--color-surface)] rounded-2xl p-8 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 z-10 relative">
            <div>
                <span className="text-[10px] text-[var(--color-neutral-500)] font-medium uppercase tracking-widest">
                    {({ el: 'Ημερησια Εσοδα', en: 'Daily Revenue', ru: 'Дневной доход', tr: 'Günlük Gelir', bg: 'Дневни приходи', he: 'הכנסה יומית' }[lang] || 'Daily Revenue')}
                </span>
                <h4 className="text-3xl md:text-4xl font-serif text-[var(--color-text)] tracking-tight mt-1">€485.00</h4>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-1 items-center bg-emerald-100 px-2.5 py-1 rounded-full"
            >
                <ArrowUpRight size={12} className="text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-bold">+24%</span>
            </motion.div>
        </div>

        {/* Graph */}
        <div className="flex-grow flex items-end justify-between gap-1.5 mt-2 z-10 relative">
            {[30, 45, 35, 60, 50, 75, 65, 90, 80, 100].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.1 + i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-full rounded-t-sm ${i === 9 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-neutral-200)]'}`}
                />
            ))}
        </div>

        {/* Tooltip Overlay */}
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute top-[45%] right-[25%] bg-white shadow-xl rounded-xl p-4 border border-[var(--color-neutral-200)] text-center z-20"
        >
            <span className="text-[9px] text-[var(--color-neutral-500)] uppercase tracking-widest block mb-1">
                {({ el: 'Εξυπνη Τιμη', en: 'Smart Price', ru: 'Умная цена', tr: 'Akıllı Fiyat', bg: 'Смарт цена', he: 'מחיר חכם' }[lang] || 'Smart Price')}
            </span>
            <span className="text-xl font-serif font-medium text-[var(--color-accent)]">€520</span>
        </motion.div>
    </div>
);

const CommVisual = ({ lang }: { lang: Locale }) => (
    <div className="w-full h-full bg-[var(--color-surface)] rounded-2xl p-6 md:p-8 flex flex-col justify-center gap-3 relative">
        {/* Subtle messenger chrome */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between opacity-40">
            <span className="text-[9px] font-medium tracking-wide text-[var(--color-neutral-500)]">
                {({ el: 'Μηνύματα', en: 'Messages', ru: 'Сообщения', tr: 'Mesajlar', bg: 'Съобщения', he: 'הודעות' }[lang] || 'Messages')}
            </span>
            <span className="text-[9px] text-[var(--color-neutral-400)]">
                {({ el: 'Σήμερα', en: 'Today', ru: 'Сегодня', tr: 'Bugün', bg: 'Днес', he: 'היום' }[lang] || 'Today')}
            </span>
        </div>

        <div className="mt-6">
            <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="self-start bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-[var(--color-neutral-200)] max-w-[85%] mb-3"
            >
                <div className="flex gap-2 items-center mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[8px] font-bold text-orange-600">G</div>
                    <span className="text-[9px] text-[var(--color-neutral-400)] font-medium">
                        {({ el: 'Επισκέπτης', en: 'Guest', ru: 'Гость', tr: 'Misafir', bg: 'Гост', he: 'אורח' }[lang] || 'Guest')} • 10:42 AM
                    </span>
                </div>
                <p className="text-sm text-[var(--color-text)] leading-snug">
                    {({ el: 'Γεια σας! Είναι διαθέσιμο το early check-in;', en: 'Hi! Is early check-in available?', ru: 'Привет! Доступен ли ранний заезд?', tr: 'Merhaba! Erken giriş mümkün mü?', bg: 'Здравейте! Възможен ли е ранен чек-ин?', he: 'היי! האם צ\'ק-אין מוקדם אפשרי?' }[lang] || 'Hi! Is early check-in available?')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="self-end ml-auto bg-[var(--color-accent)] p-4 rounded-2xl rounded-tr-sm shadow-lg max-w-[85%]"
                style={{ boxShadow: '0 8px 30px rgba(68, 125, 156, 0.25)' }}
            >
                <div className="flex gap-2 items-center mb-1.5 justify-end">
                    <span className="text-[9px] text-white/70 font-medium">Homevision • 10:43 AM</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold text-white">H</div>
                </div>
                <p className="text-sm text-white leading-snug">
                    {({ el: 'Απολύτως! Το διαμέρισμα είναι έτοιμο. Το φροντίζουμε τώρα. 🏠', en: 'Absolutely! The apartment is ready for you. Taking care of it now. 🏠', ru: 'Абсолютно! Квартира готова для вас. Заботимся об этом сейчас. 🏠', tr: 'Kesinlikle! Daire sizin için hazır. Şu an ilgileniyoruz. 🏠', bg: 'Абсолютно! Апартаментът е готов за вас. Грижим се за това. 🏠', he: 'בהחלט! הדירה מוכנה עבורך. מטפלים בזה עכשיו. 🏠' }[lang] || 'Absolutely! The apartment is ready for you. Taking care of it now. 🏠')}
                </p>
            </motion.div>
        </div>

        {/* Response time indicator */}
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-2 mt-2"
        >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-[var(--color-neutral-400)] font-medium tracking-wide">
                {({ el: 'Μέσος χρόνος: 1 λεπτό', en: 'Avg response: 1 min', ru: 'Ср. время ответа: 1 мин', tr: 'Ort. yanıt: 1 dk', bg: 'Ср. време за отговор: 1 мин', he: 'זמן תגובה ממוצע: 1 דק' }[lang] || 'Avg response: 1 min')}
            </span>
        </motion.div>
    </div>
);

const VettingVisual = ({ lang }: { lang: Locale }) => (
    <div className="w-full h-full bg-[var(--color-surface)] rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-xl shadow-lg border border-[var(--color-neutral-200)] p-6 w-full max-w-xs relative z-10"
        >
            {/* Guest profile header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--color-neutral-200)]">
                <div className="w-10 h-10 bg-[var(--color-surface)] rounded-full flex items-center justify-center">
                    <span className="text-sm font-serif text-[var(--color-neutral-500)]">JD</span>
                </div>
                <div>
                    <div className="h-3 w-28 bg-[var(--color-neutral-200)] rounded mb-1.5" />
                    <div className="h-2 w-16 bg-[var(--color-neutral-100)] rounded" />
                </div>
            </div>

            {/* Verification rows */}
            <div className="space-y-3 mb-5">
                {[
                    { label: { el: 'Ταυτότητα', en: 'Identity', ru: 'Личность', tr: 'Kimlik', bg: 'Самоличност', he: 'זהות' }[lang] || 'Identity', status: { el: 'Επαληθεύτηκε', en: 'Verified', ru: 'Проверено', tr: 'Doğrulandı', bg: 'Потвърдено', he: 'מאומת' }[lang] || 'Verified', delay: 0.3 },
                    { label: { el: 'Κριτικές', en: 'Reviews', ru: 'Отзывы', tr: 'Yorumlar', bg: 'Отзиви', he: 'ביקורות' }[lang] || 'Reviews', status: "5.0 (12)", delay: 0.5 },
                    { label: { el: 'Κρατ. ID', en: 'Gov. ID', ru: 'Гос. ID', tr: 'Resmi Kimlik', bg: 'Лична карта', he: 'תעודה מזהה' }[lang] || 'Gov. ID', status: { el: 'Επιβεβαιώθηκε', en: 'Confirmed', ru: 'Подтверждено', tr: 'Onaylandı', bg: 'Потвърдено', he: 'אושר' }[lang] || 'Confirmed', delay: 0.7 },
                ].map((row, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: row.delay }}
                        className="flex justify-between text-sm items-center"
                    >
                        <span className="text-[var(--color-neutral-500)]">{row.label}</span>
                        <div className="flex gap-1.5 text-emerald-600 font-medium items-center text-xs">
                            <Check size={12} strokeWidth={2.5} /> {row.status}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Progress bar */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
                className="h-1 bg-emerald-500 w-full mb-2 origin-left rounded-full"
            />
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                {({ el: 'Ασφαλες', en: 'Safe to Book', ru: 'Безопасно', tr: 'Güvenli', bg: 'Безопасно', he: 'בטוח' }[lang] || 'Safe to Book')}
            </span>
        </motion.div>

        {/* Subtle background shield */}
        <ShieldCheck className="absolute -bottom-8 -right-8 text-[var(--color-accent)] w-48 h-48 opacity-[0.04]" />
    </div>
);

const AppVisual = ({ lang }: { lang: Locale }) => (
    <div className="w-full h-full bg-slate-900 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--color-accent)]/20 rounded-full blur-[80px]" />

        <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-44 bg-slate-950 rounded-[2rem] border-2 border-slate-800 p-1.5 shadow-2xl relative z-10"
        >
            <div className="w-full aspect-[9/16] bg-slate-900 rounded-[1.5rem] overflow-hidden relative">
                {/* Notch */}
                <div className="w-20 h-5 bg-slate-950 rounded-b-xl mx-auto" />

                {/* Content */}
                <div className="px-3 mt-3">
                    {/* Greeting */}
                    <div className="text-[8px] text-slate-500 mb-1">
                        {({ el: 'Καλημέρα', en: 'Good morning', ru: 'Доброе утро', tr: 'Günaydın', bg: 'Добро утро', he: 'בוקר טוב' }[lang] || 'Good morning')}
                    </div>
                    <div className="text-[10px] text-white font-medium mb-3">
                        {({ el: 'Τα Ακίνητά Σας', en: 'Your Properties', ru: 'Ваши объекты', tr: 'Mülkleriniz', bg: 'Вашите имоти', he: 'הנכסים שלך' }[lang] || 'Your Properties')}
                    </div>

                    {/* Stats card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[var(--color-accent)] rounded-xl p-3 mb-2"
                    >
                        <div className="text-[7px] text-white/60 uppercase tracking-wider mb-0.5">
                            {({ el: 'Αυτο το μηνα', en: 'This Month', ru: 'В этом месяце', tr: 'Bu Ay', bg: 'Този месец', he: 'החודש' }[lang] || 'This Month')}
                        </div>
                        <div className="text-base text-white font-bold">€4,280</div>
                        <div className="flex items-center gap-1 mt-1">
                            <ArrowUpRight size={8} className="text-emerald-300" />
                            <span className="text-[7px] text-emerald-300 font-medium">+18%</span>
                        </div>
                    </motion.div>

                    {/* Property tiles */}
                    <div className="grid grid-cols-2 gap-1.5">
                        {[
                            { label: { el: 'Κρατήσεις', en: 'Bookings', ru: 'Бронирования', tr: 'Rezervasyonlar', bg: 'Резервации', he: 'הזמנות' }[lang] || 'Bookings', value: "12" },
                            { label: { el: 'Πληρότητα', en: 'Occupancy', ru: 'Заполняемость', tr: 'Doluluk', bg: 'Заетост', he: 'תפוסה' }[lang] || 'Occupancy', value: "94%" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className="bg-slate-800 rounded-lg p-2"
                            >
                                <div className="text-[7px] text-slate-500">{stat.label}</div>
                                <div className="text-xs text-white font-medium">{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Nav */}
                <div className="absolute bottom-0 w-full h-8 bg-slate-800/90 backdrop-blur-sm flex justify-around items-center px-4">
                    <Home size={12} className="text-[var(--color-accent)]" />
                    <Calendar size={12} className="text-slate-600" />
                    <BarChart3 size={12} className="text-slate-600" />
                </div>
            </div>
        </motion.div>
    </div>
);

const SyncVisual = ({ lang }: { lang: Locale }) => (
    <div className="w-full h-full bg-[var(--color-surface)] rounded-2xl flex items-center justify-center relative overflow-hidden p-8">
        <div className="flex gap-6 items-center">
            {/* Calendar A */}
            <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white p-4 rounded-xl shadow-md border border-[var(--color-neutral-200)]"
            >
                <div className="flex gap-2 items-center mb-3">
                    <Globe size={14} className="text-rose-500" />
                    <span className="text-xs font-bold text-[var(--color-text)]">Airbnb</span>
                </div>
                {/* Mini calendar grid */}
                <div className="grid grid-cols-7 gap-0.5 w-24">
                    {Array.from({ length: 14 }, (_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm text-[5px] flex items-center justify-center ${[3, 4, 5, 10, 11].includes(i)
                            ? 'bg-rose-400/20 text-rose-500'
                            : 'bg-[var(--color-neutral-100)]'
                            }`}>
                            {i + 1}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Sync indicator */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex flex-col items-center gap-1"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: 2, ease: "linear" }}
                >
                    <RefreshCw size={18} className="text-[var(--color-accent)]" />
                </motion.div>
                <span className="text-[8px] text-[var(--color-accent)] font-bold uppercase tracking-widest">
                    {({ el: 'Συγχρονιστηκε', en: 'Synced', ru: 'Синх.', tr: 'Senkronize', bg: 'Синхр.', he: 'מסונכרן' }[lang] || 'Synced')}
                </span>
            </motion.div>

            {/* Calendar B */}
            <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white p-4 rounded-xl shadow-md border border-[var(--color-neutral-200)]"
            >
                <div className="flex gap-2 items-center mb-3">
                    <Search size={14} className="text-blue-600" />
                    <span className="text-xs font-bold text-[var(--color-text)]">Booking</span>
                </div>
                {/* Mini calendar grid (mirrored blocked dates) */}
                <div className="grid grid-cols-7 gap-0.5 w-24">
                    {Array.from({ length: 14 }, (_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm text-[5px] flex items-center justify-center ${[3, 4, 5, 10, 11].includes(i)
                            ? 'bg-blue-400/20 text-blue-600'
                            : 'bg-[var(--color-neutral-100)]'
                            }`}>
                            {i + 1}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
);

const DirectBookingVisual = ({ lang }: { lang: Locale }) => (
    <div className="w-full h-full bg-[var(--color-surface)] rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-[40px]" />

        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-[var(--color-neutral-200)] overflow-hidden relative z-10"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
        >
            {/* Browser chrome */}
            <div className="bg-slate-50 border-b border-[var(--color-neutral-200)] px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mx-auto bg-white border border-[var(--color-neutral-200)] text-[8px] text-[var(--color-neutral-400)] px-4 py-1 rounded w-1/2 text-center truncate">
                    your-property.com
                </div>
            </div>

            {/* Mock website content */}
            <div className="relative">
                {/* Hero image placeholder */}
                <div className="w-full h-32 bg-slate-200 relative overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" alt="Villa" fill className="object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Booking widget */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mx-6 -mt-8 bg-white rounded-lg shadow-lg p-3 border border-[var(--color-neutral-100)] relative z-20 flex flex-col gap-2"
                >
                    <div className="flex justify-between items-end border-b border-[var(--color-neutral-100)] pb-2 mb-1">
                        <div>
                            <span className="text-[10px] text-[var(--color-neutral-400)] uppercase block mb-0.5">
                                {({ el: 'Τιμη ανα βραδυ', en: 'Price per night', ru: 'Цена за ночь', tr: 'Gecelik Fiyat', bg: 'Цена на нощувка', he: 'מחיר ללילה' }[lang] || 'Price per night')}
                            </span>
                            <span className="text-lg font-serif">€250</span>
                        </div>
                        {/* 0% Commission Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
                            className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                        >
                            {({ el: '0% Προμήθεια', en: '0% Commission', ru: '0% Комиссии', tr: '%0 Komisyon', bg: '0% Комисионна', he: '0% עמלה' }[lang] || '0% Commission')}
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="bg-slate-50 text-[8px] text-[var(--color-neutral-500)] p-1.5 rounded border border-[var(--color-neutral-200)]">
                            Check-in <span className="block text-slate-800 font-medium">12 Oct</span>
                        </div>
                        <div className="bg-slate-50 text-[8px] text-[var(--color-neutral-500)] p-1.5 rounded border border-[var(--color-neutral-200)]">
                            Check-out <span className="block text-slate-800 font-medium">18 Oct</span>
                        </div>
                    </div>

                    <button className="w-full bg-[var(--color-accent)] text-white text-[10px] uppercase font-bold py-2 rounded mt-1">
                        {({ el: 'Κρατηση Τωρα', en: 'Book Now', ru: 'Забронировать сейчас', tr: 'Hemen Rezervasyon Yap', bg: 'Резервирай сега', he: 'הזמן עכשיו' }[lang] || 'Book Now')}
                    </button>
                </motion.div>
                <div className="h-4" /> {/* spacing */}
            </div>
        </motion.div>
    </div>
);

const FeaturesData = [
    {
        id: 'multi-channel',
        title: { el: 'Πανταχού Παρόντες', en: 'Multi-Channel Presence', ru: 'Мультиканальное присутствие', tr: 'Çoklu Kanal Varlığı', bg: 'Многоканално присъствие', he: 'נוכחות רב-ערוצית' },
        desc: { el: 'Δεν βασιζόμαστε μόνο στην Airbnb. Δημιουργούμε, βελτιστοποιούμε και προωθούμε την καταχώρησή σας σε κορυφαίες πλατφόρμες (Booking.com, VRBO, Expedia), πολλαπλασιάζοντας δραματικά το κοινό που βλέπει το ακίνητό σας.', en: 'We optimize your listing across all major platforms—Airbnb, Booking.com, VRBO—ensuring maximum visibility.', ru: 'Оптимизация объявления на всех ключевых платформах — Airbnb, Booking.com, VRBO — для максимальной видимости.', tr: 'İlanınızı tüm büyük platformlarda optimize ediyoruz — Airbnb, Booking.com, VRBO — maksimum görünürlük sağlıyoruz.', bg: 'Оптимизираме обявата ви във всички основни платформи — Airbnb, Booking.com, VRBO — за максимална видимост.', he: 'אנחנו מייעלים את המודעה שלכם בכל הפלטפורמות המובילות — Airbnb, Booking.com, VRBO — לנראות מקסימלית.' },
        Visual: MultiChannelVisual
    },
    {
        id: 'dynamic-pricing',
        title: { el: 'Έξυπνη Δυναμική Τιμολόγηση', en: 'Dynamic Pricing', ru: 'Динамическое ценообразование', tr: 'Dinamik Fiyatlandırma', bg: 'Динамично ценообразуване', he: 'תמחור דינמי' },
        desc: { el: 'Τέλος στις σταθερές τιμές κατ\' εκτίμηση. Οι προηγμένοι αλγόριθμοί μας "διαβάζουν" την αγορά καθημερινά και προσαρμόζουν τις τιμές σας βάσει ζήτησης, εποχικότητας και τοπικών events, διασφαλίζοντας ότι δεν χάνετε ούτε ένα ευρώ.', en: 'Our algorithms analyze market demand, local events, and seasonality to adjust your daily rates automatically.', ru: 'Алгоритмы анализируют спрос, местные события и сезонность для автоматической корректировки цен.', tr: 'Algoritmalarımız pazar talebini, yerel etkinlikleri ve mevsimselliği analiz ederek günlük fiyatlarınızı otomatik ayarlar.', bg: 'Алгоритмите ни анализират търсенето и автоматично коригират дневните ви цени.', he: 'האלגוריתמים שלנו מנתחים ביקוש, אירועים ועונתיות כדי להתאים מחירים אוטומטית.' },
        Visual: DynamicPricingVisual
    },
    {
        id: 'communication',
        title: { el: '24/7 Άμεση Επικοινωνία', en: '24/7 Guest Communication', ru: 'Круглосуточная связи', tr: '7/24 Misafir İletişimi', bg: '24/7 Комуникация с гости', he: 'תקשורת אורחים 24/7' },
        desc: { el: 'Στη φιλοξενία, η ταχύτητα φέρνει κρατήσεις. Η ομάδα μας απαντά στα μηνύματα των υποψήφιων και ενεργών επισκεπτών σας μέσα σε λίγα λεπτά, μέρα και νύχτα. Εξασφαλίζουμε τον τίτλο του Superhost, ενώ εσείς κοιμάστε.', en: 'We handle every inquiry within minutes. Late-night check-ins? Emergency questions? We are always online.', ru: 'Отвечаем на каждый запрос за минуты. Ночной заезд? Срочные вопросы? Мы всегда на связи.', tr: 'Her soruyu dakikalar içinde yanıtlıyoruz. Gece girişleri? Acil sorular? Her zaman çevrimiçiyiz.', bg: 'Отговаряме на всяко запитване за минути. Нощно настаняване? Спешни въпроси? Винаги сме онлайн.', he: 'אנחנו מטפלים בכל פנייה תוך דקות. צ\'ק-אין מאוחר? שאלות דחופות? אנחנו תמיד מחוברים.' },
        Visual: CommVisual
    },
    {
        id: 'vetting',
        title: { el: 'Αυστηρό Guest Screening', en: 'Guest Vetting', ru: 'Проверка гостей', tr: 'Misafir Doğrulaması', bg: 'Проверка на гости', he: 'סינון אורחים' },
        desc: { el: 'Προστατεύουμε το ακίνητό σας ψηφιακά. Πριν επιβεβαιωθεί οποιαδήποτε κράτηση, ελέγχουμε σχολαστικά το προφίλ, την ταυτότητα και τις προηγούμενες κριτικές του επισκέπτη, αποτρέποντας τα κακά σενάρια.', en: 'Safety first. We screen guest profiles and reviews before accepting bookings to ensure your property remains secure.', ru: 'Безопасность прежде всего. Мы проверяем профили и отзывы гостей перед принятием бронирований.', tr: 'Güvenlik önceliğimiz. Rezervasyonları kabul etmeden önce misafir profillerini ve yorumlarını inceliyoruz.', bg: 'Безопасността е на първо място. Проверяваме профилите и отзивите на гостите.', he: 'בטיחות קודם. אנחנו בודקים פרופילי אורחים וביקורות לפני קבלת הזמנות.' },
        Visual: VettingVisual
    },
    {
        id: 'app',
        title: { el: 'Πλήρης Έλεγχος στο Κινητό Σας', en: 'Owner App Access', ru: 'Приложение владельца', tr: 'Sahip Uygulaması', bg: 'Приложение за собственици', he: 'אפליקציית בעלים' },
        desc: { el: 'Έχετε την πλήρη εικόνα του ακινήτου σας στην τσέπη σας. Παρακολουθήστε ζωντανά τις κρατήσεις και τα επερχόμενα έσοδά σας, με απόλυτη διαφάνεια, από όπου κι αν βρίσκεστε.', en: 'Track earnings, view upcoming bookings, and block dates for your personal use—all from our dedicated Owner App.', ru: 'Отслеживайте доход, просматривайте бронирования и блокируйте даты — всё через приложение владельца.', tr: 'Kazançlarınızı takip edin, gelecek rezervasyonları görüntüleyin ve kişisel kullanım için tarihleri engelleyin.', bg: 'Следете приходите, вижте предстоящите резервации и блокирайте дати — всичко от приложението.', he: 'עקבו אחר הכנסות, צפו בהזמנות עתידיות וחסמו תאריכים — הכל מהאפליקציה.' },
        Visual: AppVisual
    },
    {
        id: 'sync',
        title: { el: 'Αλάνθαστος Συγχρονισμός', en: 'Calendar Sync', ru: 'Синхронизация календаря', tr: 'Takvim Senkronizasyonu', bg: 'Синхронизация на календари', he: 'סנכרון יומנים' },
        desc: { el: 'Ξεχάστε τον εφιάλτη των διπλοκρατήσεων (double bookings) και τις ποινές των πλατφορμών. Το υπερσύγχρονο λογισμικό μας συγχρονίζει αυτόματα όλα τα ημερολόγιά σας σε κλάσματα δευτερολέπτου.', en: 'Never worry about double bookings. Our centralized system instantly syncs availability across all channels.', ru: 'Забудьте о двойных бронированиях. Централизованная система мгновенно синхронизирует доступность.', tr: 'Çift rezervasyon endişesi yok. Merkezi sistemimiz tüm kanallarda müsaitliği anında senkronize eder.', bg: 'Без двойни резервации. Централизираната ни система синхронизира наличността мигновено.', he: 'בלי דאגה מהזמנות כפולות. המערכת שלנו מסנכרנת זמינות מיידית בכל הערוצים.' },
        Visual: SyncVisual
    },
    {
        id: 'direct-booking',
        title: { el: 'Απευθείας Κρατήσεις (0% Προμήθεια)', en: 'Direct Bookings (0% Commission)', ru: 'Прямые бронирования (0% комиссии)', tr: 'Doğrudan Rezervasyonlar (%0 Komisyon)', bg: 'Директни резервации (0% комисионна)', he: 'הזמנות ישירות (0% עמלה)' },
        desc: { el: 'Κατασκευάζουμε την προσωπική ιστοσελίδα του ακινήτου σας. Δεχτείτε κρατήσεις απευθείας από τους πελάτες σας χωρίς καμία απολύτως προμήθεια προς τρίτες πλατφόρμες.', en: 'We build your property\'s custom website. Accept bookings directly from your guests without paying any commissions to third-party platforms.', ru: 'Мы создаем собственный сайт вашего объекта недвижимости. Принимайте заказы напрямую от клиентов без комиссий сторонних платформ.', tr: 'Mülkünüz için özel web sitesini kuruyoruz. Üçüncü taraf platformlara komisyon ödemeden doğrudan müşterilerinizden rezervasyon alın.', bg: 'Ще създадем персонализиран уебсайт за вашия имот. Приемайте резервации директно от клиентите си без никаква комисионна за платформи на трети страни.', he: 'אנו בונים אתר אישי לנכס שלך. קבל הזמנות ישירות מלקוחות ללא עמלות לפלטפורמות צד שלישי.' },
        Visual: DirectBookingVisual
    },
];

const getLocalized = (obj: any, lang: string) => obj[lang] || obj['en'];

export default function StickyFeatures({ lang }: { lang: Locale }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="bg-white py-16 md:py-24 relative">
            <div className="container">
                <div className="mb-16 max-w-2xl px-4 md:px-0">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium mb-4 block">
                        Features
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 text-slate-900">
                        {({ el: 'Όλα όσα προσφέρουμε', en: 'Everything we offer', ru: 'Всё, что мы предлагаем', tr: 'Sunduğumuz her şey', bg: 'Всичко, което предлагаме', he: 'כל מה שאנחנו מציעים' }[lang] || 'Everything we offer')}
                    </h2>
                    <p className="text-lg text-slate-500 leading-relaxed font-light">
                        {({ el: 'Κάθε λεπτομέρεια, κάθε επαφή — σχεδιασμένη για να μεγιστοποιήσει τα αποτελέσματα.', en: 'Every detail, every touchpoint — designed to maximize your results and delight your guests.', ru: 'Каждая деталь, каждое касание — для максимальных результатов.', tr: 'Her detay, her temas noktası — sonuçlarınızı en üst düzeye çıkarmak için tasarlandı.', bg: 'Всеки детайл, всяка точка на контакт — проектирани за максимални резултати.', he: 'כל פרט, כל נקודת מגע — מתוכנן למקסם תוצאות.' }[lang] || 'Every detail, every touchpoint — designed to maximize your results and delight your guests.')}
                    </p>
                </div>

                <div className="relative">
                    {/* Desktop: Sticky Layout */}
                    <div className="hidden lg:grid grid-cols-2 gap-16">
                        {/* Left: Scrollable Text */}
                        <div>
                            {FeaturesData.map((feature, idx) => (
                                <FeatureText
                                    key={feature.id}
                                    feature={feature}
                                    lang={lang}
                                    idx={idx}
                                    setActiveIndex={setActiveIndex}
                                />
                            ))}
                        </div>

                        {/* Right: Sticky Visual */}
                        <div className="h-screen sticky top-0 flex items-center justify-center py-20">
                            <div className="w-full aspect-square max-w-md rounded-3xl shadow-xl border border-[var(--color-neutral-200)] relative overflow-hidden transition-all duration-500"
                                style={{ boxShadow: 'var(--shadow-accent-md)' }}
                            >
                                {FeaturesData.map((feature, idx) => {
                                    const VisualComp = feature.Visual;
                                    return (
                                        <motion.div
                                            key={feature.id}
                                            initial={false}
                                            animate={{
                                                opacity: idx === activeIndex ? 1 : 0,
                                                y: idx === activeIndex ? 0 : 10,
                                            }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className={`absolute inset-0 ${idx === activeIndex ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                        >
                                            {idx === activeIndex && <VisualComp lang={lang} />}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Stacked Layout */}
                    <div className="lg:hidden flex flex-col gap-12">
                        {FeaturesData.map((feature, idx) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-5"
                            >
                                <div className="aspect-[3/2] w-full bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-sm border border-[var(--color-neutral-200)]">
                                    <feature.Visual lang={lang} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-[10px] font-mono text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded">0{idx + 1}</span>
                                    </div>
                                    <h3 className="text-2xl font-serif mb-3 text-slate-900">{getLocalized(feature.title, lang)}</h3>
                                    <p className="text-slate-500 leading-relaxed font-light">{getLocalized(feature.desc, lang)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureText({ feature, lang, idx, setActiveIndex }: { feature: any, lang: Locale, idx: number, setActiveIndex: (i: number) => void }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

    useEffect(() => {
        if (isInView) {
            setActiveIndex(idx);
        }
    }, [isInView, idx, setActiveIndex]);

    return (
        <motion.div
            ref={ref}
            id={`feature-${idx}`}
            className={`min-h-[35vh] flex flex-col justify-center transition-opacity duration-500 ${isInView ? 'opacity-100' : 'opacity-30'}`}
        >
            <div className="flex items-center gap-4 mb-5">
                <span className={`text-xs font-mono transition-colors duration-300 ${isInView ? 'text-[var(--color-accent)]' : 'text-[var(--color-neutral-300)]'}`}>0{idx + 1}</span>
                <div className={`h-[1px] w-12 transition-all duration-300 ${isInView ? 'bg-[var(--color-accent)] w-12' : 'bg-[var(--color-neutral-200)] w-8'}`} />
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-5 text-slate-900">
                {getLocalized(feature.title, lang)}
            </h3>
            <p className="text-lg text-slate-500 leading-relaxed font-light max-w-sm">
                {getLocalized(feature.desc, lang)}
            </p>
        </motion.div>
    );
}
