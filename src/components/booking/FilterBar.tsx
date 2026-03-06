'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, PawPrint, BedDouble, Car, Wifi } from 'lucide-react';
import type { Locale } from '@/i18n-config';

const t: Record<string, Record<Locale, string>> = {
    filters: { el: 'Φίλτρα', en: 'Filters', ru: 'Фильтры', tr: 'Filtreler', bg: 'Филтри', he: 'מסננים' },
    petFriendly: { el: 'Κατοικίδια', en: 'Pet Friendly', ru: 'С питомцами', tr: 'Evcil Hayvan', bg: 'Домашни любимци', he: 'ידידותי לחיות' },
    clear: { el: 'Καθαρισμός', en: 'Clear', ru: 'Сбросить', tr: 'Temizle', bg: 'Изчисти', he: 'נקה' },
    priceRange: { el: 'Εύρος Τιμής', en: 'Price Range', ru: 'Диапазон цен', tr: 'Fiyat Aralığı', bg: 'Ценови диапазон', he: 'טווח מחירים' },
    anyPrice: { el: 'Οποιαδήποτε Τιμή', en: 'Any Price', ru: 'Любая цена', tr: 'Herhangi bir Fiyat', bg: 'Всяка цена', he: 'כל מחיר' },
    bedrooms: { el: 'Υπνοδωμάτια', en: 'Bedrooms', ru: 'Спальни', tr: 'Yatak Odaları', bg: 'Спални', he: 'חדרי שינה' },
    any: { el: 'Όλα', en: 'Any', ru: 'Любое', tr: 'Herhangi', bg: 'Всяко', he: 'הכל' },
    mustHave: { el: 'Απαραίτητα', en: 'Must-Have', ru: 'Обязательно', tr: 'Olmazsa Olmaz', bg: 'Задължително', he: 'חובה' },
};

interface FilterBarProps {
    onFilter: (filters: FilterState) => void;
    activeFilters: FilterState;
    lang: Locale;
}

export interface FilterState {
    priceMin?: number;
    priceMax?: number;
    petFriendly?: boolean;
    bedrooms?: number;
    amenityIds?: number[];
}

const PRICE_RANGES = [
    { key: 'any', min: undefined, max: undefined },
    { key: '0-80', label: '€0 – €80', min: 0, max: 80 },
    { key: '80-120', label: '€80 – €120', min: 80, max: 120 },
    { key: '120-200', label: '€120 – €200', min: 120, max: 200 },
    { key: '200+', label: '€200+', min: 200, max: undefined },
];

const BEDROOM_OPTIONS = [
    { key: 'any', value: undefined },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3+', value: 3 },
];

export default function FilterBar({ onFilter, activeFilters, lang }: FilterBarProps) {
    const [expanded, setExpanded] = useState(false);

    const activeCount = [
        activeFilters.priceMin !== undefined || activeFilters.priceMax !== undefined,
        activeFilters.petFriendly,
        activeFilters.bedrooms !== undefined,
    ].filter(Boolean).length;

    const updateFilter = (updates: Partial<FilterState>) => {
        onFilter({ ...activeFilters, ...updates });
    };

    const clearFilters = () => {
        onFilter({});
        setExpanded(false);
    };

    return (
        <div className="w-full">
            {/* Toggle Button */}
            <div className="flex items-center gap-3">
                <motion.button
                    onClick={() => setExpanded(!expanded)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${expanded || activeCount > 0
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                        }`}
                >
                    <SlidersHorizontal size={14} />
                    <span>{t.filters[lang]}</span>
                    {activeCount > 0 && (
                        <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">
                            {activeCount}
                        </span>
                    )}
                </motion.button>

                {/* Quick filter chips */}
                <div className="hidden md:flex items-center gap-2">
                    <button
                        onClick={() =>
                            updateFilter({
                                petFriendly: !activeFilters.petFriendly || undefined,
                            })
                        }
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-medium transition-all cursor-pointer ${activeFilters.petFriendly
                            ? 'bg-[var(--color-accent-light)] text-[var(--color-accent-dark)] border border-[var(--color-accent)]'
                            : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)] border border-transparent'
                            }`}
                    >
                        <PawPrint size={12} />
                        {t.petFriendly[lang]}
                    </button>
                </div>

                {activeCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-[11px] text-[var(--color-neutral-500)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                    >
                        <X size={12} />
                        {t.clear[lang]}
                    </button>
                )}
            </div>

            {/* Expanded Filter Panel */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 p-5 bg-white rounded-xl shadow-accent-sm border border-[var(--color-neutral-200)]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Price Range */}
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-3">
                                        {t.priceRange[lang]}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {PRICE_RANGES.map((range) => {
                                            const isActive =
                                                activeFilters.priceMin === range.min &&
                                                activeFilters.priceMax === range.max;
                                            return (
                                                <button
                                                    key={range.key}
                                                    onClick={() =>
                                                        updateFilter({
                                                            priceMin: range.min,
                                                            priceMax: range.max,
                                                        })
                                                    }
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${isActive
                                                        ? 'bg-[var(--color-accent)] text-white'
                                                        : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                                                        }`}
                                                >
                                                    {range.key === 'any' ? t.anyPrice[lang] : range.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-3">
                                        {t.bedrooms[lang]}
                                    </h4>
                                    <div className="flex gap-2">
                                        {BEDROOM_OPTIONS.map((opt) => {
                                            const isActive = activeFilters.bedrooms === opt.value;
                                            return (
                                                <button
                                                    key={opt.key || opt.label}
                                                    onClick={() => updateFilter({ bedrooms: opt.value })}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${isActive
                                                        ? 'bg-[var(--color-accent)] text-white'
                                                        : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                                                        }`}
                                                >
                                                    {opt.key === 'any' ? t.any[lang] : opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-3">
                                        {t.mustHave[lang]}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() =>
                                                updateFilter({
                                                    petFriendly: !activeFilters.petFriendly || undefined,
                                                })
                                            }
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeFilters.petFriendly
                                                ? 'bg-[var(--color-accent)] text-white'
                                                : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                                                }`}
                                        >
                                            <PawPrint size={12} />
                                            {t.petFriendly[lang]}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
