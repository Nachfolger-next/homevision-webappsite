'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Search, MapPin, X } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';
import { el, enUS, ru, tr, bg, he } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';

const t: Record<string, Record<Locale, string>> = {
    checkIn: { el: 'Άφιξη', en: 'Check-in', ru: 'Заезд', tr: 'Giriş', bg: 'Настаняване', he: 'צ׳ק-אין' },
    checkOut: { el: 'Αναχώρηση', en: 'Check-out', ru: 'Выезд', tr: 'Çıkış', bg: 'Напускане', he: 'צ׳ק-אאוט' },
    selectDate: { el: 'Επιλέξτε', en: 'Select', ru: 'Выберите', tr: 'Seçin', bg: 'Изберете', he: 'בחר' },
    guests: { el: 'Επισκέπτες', en: 'Guests', ru: 'Гости', tr: 'Misafirler', bg: 'Гости', he: 'אורחים' },
    guest: { el: 'επισκέπτης', en: 'guest', ru: 'гость', tr: 'misafir', bg: 'гост', he: 'אורח' },
    guestsLc: { el: 'επισκέπτες', en: 'guests', ru: 'гостей', tr: 'misafir', bg: 'гости', he: 'אורחים' },
    search: { el: 'Αναζήτηση', en: 'Search', ru: 'Поиск', tr: 'Ara', bg: 'Търсене', he: 'חיפוש' },
    allAreas: { el: 'Όλες οι Περιοχές', en: 'All Areas', ru: 'Все районы', tr: 'Tüm Bölgeler', bg: 'Всички райони', he: 'כל האזורים' },
};

const localeMap: Record<string, any> = {
  el: el,
  en: enUS,
  ru: ru,
  tr: tr,
  bg: bg,
  he: he,
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
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [guests, setGuests] = useState(2);
    const [location, setLocation] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [activeField, setActiveField] = useState<'checkin' | 'checkout'>('checkin');
    const [isMounted, setIsMounted] = useState(false);
    
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close calendar when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const today = isMounted ? new Date() : new Date(); // Only calculate actual date post-mount

    if (!isMounted) {
        return null; // or a skeleton loader matching the height
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date?.from && date?.to) {
            const checkIn = format(date.from, 'yyyy-MM-dd');
            const checkOut = format(date.to, 'yyyy-MM-dd');
            onSearch({ checkIn, checkOut, guests, location: location || undefined });
        }
    };

    const currentLocale = localeMap[lang] || enUS;

    const formatCheckIn = () => {
        if (!date?.from) return t.selectDate[lang];
        return format(date.from, 'dd/MM/yyyy', { locale: currentLocale });
    };

    const formatCheckOut = () => {
        if (!date?.to) return t.selectDate[lang];
        return format(date.to, 'dd/MM/yyyy', { locale: currentLocale });
    };

    const handleDateFieldClick = (field: 'checkin' | 'checkout') => {
        setActiveField(field);
        setShowCalendar(true);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-50 w-full max-w-4xl mx-auto"
        >
            {/* Main search bar — relative so the calendar popover can anchor to it */}
            <div className="relative" ref={calendarRef}>
                <div className="bg-white rounded-2xl shadow-accent-lg p-2.5 md:p-4">
                    <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto_auto] gap-2 md:gap-2 items-end">
                        
                        {/* Check-in */}
                        <div className="relative min-w-0">
                            <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1.5 pl-1">
                                {t.checkIn[lang]}
                            </label>
                            <button
                                type="button"
                                onClick={() => handleDateFieldClick('checkin')}
                                className={`w-full flex items-center gap-2.5 pl-3 pr-2 py-2.5 rounded-xl text-sm transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
                                    showCalendar && activeField === 'checkin'
                                        ? 'bg-white border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/10'
                                        : 'bg-[var(--color-neutral-100)] border-transparent'
                                } ${date?.from ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-neutral-500)]'}`}
                            >
                                <Calendar size={16} className="text-[var(--color-neutral-400)] shrink-0" />
                                <span>{formatCheckIn()}</span>
                            </button>
                        </div>

                        {/* Check-out */}
                        <div className="relative min-w-0">
                            <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1.5 pl-1">
                                {t.checkOut[lang]}
                            </label>
                            <button
                                type="button"
                                onClick={() => handleDateFieldClick('checkout')}
                                className={`w-full flex items-center gap-2.5 pl-3 pr-2 py-2.5 rounded-xl text-sm transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
                                    showCalendar && activeField === 'checkout'
                                        ? 'bg-white border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/10'
                                        : 'bg-[var(--color-neutral-100)] border-transparent'
                                } ${date?.to ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-neutral-500)]'}`}
                            >
                                <Calendar size={16} className="text-[var(--color-neutral-400)] shrink-0" />
                                <span>{formatCheckOut()}</span>
                            </button>
                        </div>

                        {/* Guests */}
                        <div className="relative col-span-2 md:col-span-1">
                            <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1.5 pl-1">
                                {t.guests[lang]}
                            </label>
                            <div className="relative flex items-center">
                                <Users
                                    size={16}
                                    className="absolute left-3 text-[var(--color-neutral-400)] pointer-events-none"
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
                            disabled={loading || !date?.from || !date?.to}
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

                    {/* Location filter */}
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

                {/* Calendar Popover — rendered OUTSIDE the search bar to prevent clipping */}
                <AnimatePresence>
                    {showCalendar && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute left-0 right-0 md:left-0 md:right-auto top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[var(--color-neutral-200)] overflow-hidden"
                        >
                            <div className="flex justify-end pt-3 pr-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowCalendar(false)}
                                    className="text-[var(--color-neutral-400)] hover:text-[var(--color-text)] transition-colors p-1 rounded-full hover:bg-[var(--color-neutral-100)] cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {/* Desktop: 2 months side by side */}
                            <div className="hidden md:block">
                                <CustomDatePicker
                                    mode="range"
                                    defaultMonth={date?.from || today}
                                    selected={date}
                                    onSelect={setDate as any}
                                    numberOfMonths={2}
                                    lang={lang}
                                    disabled={{ before: today }}
                                    className="pb-5 px-5"
                                />
                            </div>
                            {/* Mobile: 1 month */}
                            <div className="block md:hidden">
                                <CustomDatePicker
                                    mode="range"
                                    defaultMonth={date?.from || today}
                                    selected={date}
                                    onSelect={setDate as any}
                                    numberOfMonths={1}
                                    lang={lang}
                                    disabled={{ before: today }}
                                    className="pb-5 px-5"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.form>
    );
}
