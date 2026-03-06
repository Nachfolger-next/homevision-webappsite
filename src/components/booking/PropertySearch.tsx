'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Search, MapPin } from 'lucide-react';
import type { Locale } from '@/i18n-config';

const t: Record<string, Record<Locale, string>> = {
    checkIn: { el: 'Άφιξη', en: 'Check-in', ru: 'Заезд', tr: 'Giriş', bg: 'Настаняване', he: 'צ׳ק-אין' },
    checkOut: { el: 'Αναχώρηση', en: 'Check-out', ru: 'Выезд', tr: 'Çıkış', bg: 'Напускане', he: 'צ׳ק-אאוט' },
    guests: { el: 'Επισκέπτες', en: 'Guests', ru: 'Гости', tr: 'Misafirler', bg: 'Гости', he: 'אורחים' },
    guest: { el: 'επισκέπτης', en: 'guest', ru: 'гость', tr: 'misafir', bg: 'гост', he: 'אורח' },
    guestsLc: { el: 'επισκέπτες', en: 'guests', ru: 'гостей', tr: 'misafir', bg: 'гости', he: 'אורחים' },
    search: { el: 'Αναζήτηση', en: 'Search', ru: 'Поиск', tr: 'Ara', bg: 'Търсене', he: 'חיפוש' },
    allAreas: { el: 'Όλες οι Περιοχές', en: 'All Areas', ru: 'Все районы', tr: 'Tüm Bölgeler', bg: 'Всички райони', he: 'כל האזורים' },
};

interface PropertySearchProps {
    onSearch: (params: {
        checkIn: string;
        checkOut: string;
        guests: number;
        location?: string;
    }) => void;
    lang: Locale;
    loading?: boolean;
    locations?: string[];
}

export default function PropertySearch({
    onSearch,
    lang,
    loading = false,
    locations = [],
}: PropertySearchProps) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [location, setLocation] = useState('');

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (checkIn && checkOut) {
            onSearch({ checkIn, checkOut, guests, location: location || undefined });
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-accent-lg p-2.5 md:p-4 overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto_auto] gap-2 md:gap-2 items-end">
                    {/* Check-in */}
                    <div className="relative">
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1.5 pl-1">
                            {t.checkIn[lang]}
                        </label>
                        <div className="relative">
                            <Calendar
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]"
                            />
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => {
                                    setCheckIn(e.target.value);
                                    // Auto-set checkout if empty or before checkin
                                    if (!checkOut || e.target.value >= checkOut) {
                                        const next = new Date(e.target.value);
                                        next.setDate(next.getDate() + 1);
                                        setCheckOut(next.toISOString().split('T')[0]);
                                    }
                                }}
                                min={today}
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-[var(--color-neutral-100)] rounded-xl text-sm text-[var(--color-text)] border border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Check-out */}
                    <div className="relative">
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1.5 pl-1">
                            {t.checkOut[lang]}
                        </label>
                        <div className="relative">
                            <Calendar
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]"
                            />
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                min={checkIn || today}
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-[var(--color-neutral-100)] rounded-xl text-sm text-[var(--color-text)] border border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Guests */}
                    <div className="relative col-span-2 md:col-span-1">
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1.5 pl-1">
                            {t.guests[lang]}
                        </label>
                        <div className="relative">
                            <Users
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]"
                            />
                            <select
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                                className="w-full pl-10 pr-8 py-2.5 bg-[var(--color-neutral-100)] rounded-xl text-sm text-[var(--color-text)] border border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all cursor-pointer appearance-none"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? t.guest[lang] : t.guestsLc[lang]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Search Button */}
                    <motion.button
                        type="submit"
                        disabled={loading || !checkIn || !checkOut}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                <Search size={16} />
                                <span>{t.search[lang]}</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Location filter (optional, shown if locations available) */}
                {locations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-neutral-200)]">
                        <div className="flex items-center gap-2 flex-wrap">
                            <MapPin
                                size={14}
                                className="text-[var(--color-neutral-400)]"
                            />
                            <button
                                type="button"
                                onClick={() => setLocation('')}
                                className={`px-3 py-1.5 rounded-full text-[11px] tracking-[0.05em] font-medium transition-all cursor-pointer ${!location
                                    ? 'bg-[var(--color-accent)] text-white'
                                    : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                                    }`}
                            >
                                {t.allAreas[lang]}
                            </button>
                            {locations.map((loc) => (
                                <button
                                    key={loc}
                                    type="button"
                                    onClick={() => setLocation(loc)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] tracking-[0.05em] font-medium transition-all cursor-pointer ${location === loc
                                        ? 'bg-[var(--color-accent)] text-white'
                                        : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                                        }`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.form>
    );
}
