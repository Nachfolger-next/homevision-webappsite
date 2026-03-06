'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { t, Dictionary } from '@/lib/get-dictionary';

// ─── Types ──────────────────────────────────────────────────

interface CalendarDay {
    date: string; // YYYY-MM-DD
    available: boolean;
    price: number;
    minimumStay: number;
}

interface PriceCalendarProps {
    listingId: number;
    checkIn: string;
    checkOut: string;
    onDateChange: (checkIn: string, checkOut: string, minStay: number) => void;
    currency?: string;
    dict?: Dictionary;
    lang?: string;
}

type SelectionPhase = 'check-in' | 'check-out';

// ─── Helpers ────────────────────────────────────────────────

const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_EL = ['Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ', 'Κυρ'];

function toDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
}

function parseDate(s: string): Date {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function addDays(d: Date, n: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
}

function isSameDay(a: string, b: string): boolean {
    return a === b;
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
    // 0 = Mon in our grid (JS getDay: 0=Sun, 1=Mon ...)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday-first
}

// Price tier: returns a color class based on price relative to range
function getPriceTier(price: number, minPrice: number, maxPrice: number): string {
    if (maxPrice === minPrice) return 'text-[var(--color-neutral-600)]';
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    if (ratio <= 0.33) return 'text-emerald-600'; // cheap
    if (ratio <= 0.66) return 'text-[var(--color-neutral-600)]'; // moderate
    return 'text-amber-600'; // expensive
}

// ─── Component ──────────────────────────────────────────────

export default function PriceCalendar({
    listingId,
    checkIn,
    checkOut,
    onDateChange,
    currency = '€',
    dict,
    lang = 'en',
}: PriceCalendarProps) {
    const today = useMemo(() => toDateStr(new Date()), []);
    const initialMonth = checkIn
        ? parseDate(checkIn)
        : new Date();

    const [currentMonth, setCurrentMonth] = useState(initialMonth.getMonth());
    const [currentYear, setCurrentYear] = useState(initialMonth.getFullYear());
    const [calendarData, setCalendarData] = useState<Record<string, CalendarDay>>({});
    const [loadingMonths, setLoadingMonths] = useState<Set<string>>(new Set());
    const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>(
        checkIn && !checkOut ? 'check-out' : 'check-in'
    );
    const [hoverDate, setHoverDate] = useState<string | null>(null);
    const [slideDirection, setSlideDirection] = useState(0);

    // ─── Fetch Calendar Data ────────────────────────────────

    const fetchMonth = useCallback(async (year: number, month: number) => {
        const key = `${year}-${month}`;
        if (loadingMonths.has(key)) return;

        // Check if we already have data for this month
        const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        if (calendarData[firstDay] !== undefined) return;

        setLoadingMonths((prev) => new Set(prev).add(key));

        try {
            const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            const lastDay = getDaysInMonth(year, month);
            const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

            const res = await fetch(
                `/api/hostaway/availability?listingId=${listingId}&startDate=${startDate}&endDate=${endDate}`
            );
            const data = await res.json();

            if (data.success && data.data?.dates) {
                setCalendarData((prev) => {
                    const updated = { ...prev };
                    for (const day of data.data.dates) {
                        updated[day.date] = day;
                    }
                    return updated;
                });
            }
        } catch (err) {
            console.error('Failed to fetch calendar:', err);
        } finally {
            setLoadingMonths((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        }
    }, [listingId, calendarData, loadingMonths]);

    // Fetch current and next month on mount / navigation
    useEffect(() => {
        fetchMonth(currentYear, currentMonth);
        // Also prefetch next month
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        fetchMonth(nextYear, nextMonth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentYear, currentMonth]);

    // ─── Navigation ─────────────────────────────────────────

    const goToPrevMonth = () => {
        setSlideDirection(-1);
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        setSlideDirection(1);
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Can't go before current month
    const canGoPrev = useMemo(() => {
        const now = new Date();
        return currentYear > now.getFullYear() ||
            (currentYear === now.getFullYear() && currentMonth > now.getMonth());
    }, [currentYear, currentMonth]);

    // ─── Date Selection ─────────────────────────────────────

    const handleDateClick = (dateStr: string) => {
        const dayData = calendarData[dateStr];
        if (!dayData?.available) return;
        if (dateStr < today) return;

        if (selectionPhase === 'check-in') {
            const minStay = dayData.minimumStay || 1;
            onDateChange(dateStr, '', minStay);
            setSelectionPhase('check-out');
        } else {
            // Check-out phase
            if (dateStr <= checkIn) {
                // If clicking before/on check-in, reset to new check-in
                const minStay = dayData.minimumStay || 1;
                onDateChange(dateStr, '', minStay);
                return;
            }

            // Validate all days in range are available
            const start = parseDate(checkIn);
            const end = parseDate(dateStr);
            let allAvailable = true;
            let d = addDays(start, 1);
            while (d < end) {
                const ds = toDateStr(d);
                const dd = calendarData[ds];
                if (!dd || !dd.available) {
                    allAvailable = false;
                    break;
                }
                d = addDays(d, 1);
            }

            if (!allAvailable) return;

            // Validate minimum stay
            const checkInDay = calendarData[checkIn];
            const minStay = checkInDay?.minimumStay || 1;
            const nights = Math.round(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (nights < minStay) return;

            onDateChange(checkIn, dateStr, minStay);
            setSelectionPhase('check-in');
        }
    };

    // ─── Compute Month Grid ─────────────────────────────────

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOffset = getFirstDayOfWeek(currentYear, currentMonth);

    // Price range for color coding (current month only)
    const { minPrice, maxPrice } = useMemo(() => {
        let min = Infinity, max = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const day = calendarData[dateStr];
            if (day?.available && day.price > 0) {
                min = Math.min(min, day.price);
                max = Math.max(max, day.price);
            }
        }
        if (min === Infinity) min = 0;
        return { minPrice: min, maxPrice: max };
    }, [calendarData, currentYear, currentMonth, daysInMonth]);

    // ─── Render Helpers ─────────────────────────────────────

    const isInRange = (dateStr: string): boolean => {
        if (!checkIn || !checkOut) {
            // Show hover range
            if (checkIn && hoverDate && selectionPhase === 'check-out') {
                return dateStr > checkIn && dateStr < hoverDate;
            }
            return false;
        }
        return dateStr > checkIn && dateStr < checkOut;
    };

    const isCheckIn = (dateStr: string) => checkIn && isSameDay(dateStr, checkIn);
    const isCheckOut = (dateStr: string) => checkOut && isSameDay(dateStr, checkOut);

    // Determine locale string for date formatting
    const LOCALE_MAP: Record<string, string> = { el: 'el-GR', en: 'en-US', ru: 'ru-RU', tr: 'tr-TR', bg: 'bg-BG', he: 'he-IL' };
    const localeStr = LOCALE_MAP[lang] || 'en-US';
    const weekdays = lang === 'el' ? WEEKDAYS_EL : WEEKDAYS_EN;

    const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString(localeStr, {
        month: 'long',
        year: 'numeric',
    });

    const isLoading = loadingMonths.has(`${currentYear}-${currentMonth}`);

    // ─── Render ─────────────────────────────────────────────

    return (
        <div className="select-none">
            {/* Selection Phase Indicator */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => {
                        setSelectionPhase('check-in');
                        onDateChange('', '', 1);
                    }}
                    className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border ${selectionPhase === 'check-in'
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                        : 'border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)]'
                        }`}
                >
                    <span className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium">
                        {dict ? t(dict, 'property.checkIn') : 'Check-in'}
                    </span>
                    <span className="block text-sm font-medium text-[var(--color-text)] mt-0.5">
                        {checkIn ? formatDisplayDate(checkIn) : '—'}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (checkIn) {
                            setSelectionPhase('check-out');
                            onDateChange(checkIn, '', calendarData[checkIn]?.minimumStay || 1);
                        }
                    }}
                    className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border ${selectionPhase === 'check-out'
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                        : 'border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)]'
                        }`}
                >
                    <span className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium">
                        {dict ? t(dict, 'property.checkOut') : 'Check-out'}
                    </span>
                    <span className="block text-sm font-medium text-[var(--color-text)] mt-0.5">
                        {checkOut ? formatDisplayDate(checkOut) : '—'}
                    </span>
                </button>
            </div>

            {/* Month Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    type="button"
                    onClick={goToPrevMonth}
                    disabled={!canGoPrev}
                    className="p-1.5 rounded-full hover:bg-[var(--color-neutral-100)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                    {monthName}
                </span>
                <button
                    type="button"
                    onClick={goToNextMonth}
                    className="p-1.5 rounded-full hover:bg-[var(--color-neutral-100)] transition-colors"
                    aria-label="Next month"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-1">
                {weekdays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)] font-medium py-1"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={`${currentYear}-${currentMonth}`}
                    initial={{ opacity: 0, x: slideDirection * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDirection * -40 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="grid grid-cols-7"
                >
                    {/* Empty cells for offset */}
                    {Array.from({ length: firstDayOffset }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-[52px]" />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayData = calendarData[dateStr];
                        const isPast = dateStr < today;
                        const isAvailable = dayData?.available && !isPast;
                        const price = dayData?.price ?? 0;
                        const isSelected = isCheckIn(dateStr) || isCheckOut(dateStr);
                        const inRange = isInRange(dateStr);
                        const isStart = isCheckIn(dateStr);
                        const isEnd = isCheckOut(dateStr);

                        return (
                            <div
                                key={dateStr}
                                className="relative h-[52px] flex items-center justify-center"
                            >
                                {/* Range background band */}
                                {(inRange || isEnd) && checkIn && (
                                    <div
                                        className={`absolute inset-y-0 bg-[var(--color-accent-light)] ${isEnd ? 'left-0 right-1/2 rounded-r-none' : 'inset-x-0'
                                            }`}
                                    />
                                )}
                                {isStart && (checkOut || (hoverDate && selectionPhase === 'check-out' && hoverDate > checkIn)) && (
                                    <div className="absolute inset-y-0 left-1/2 right-0 bg-[var(--color-accent-light)]" />
                                )}

                                {/* Day button */}
                                <button
                                    type="button"
                                    disabled={!isAvailable}
                                    onClick={() => handleDateClick(dateStr)}
                                    onMouseEnter={() => isAvailable && setHoverDate(dateStr)}
                                    onMouseLeave={() => setHoverDate(null)}
                                    className={`relative z-10 w-10 h-10 flex flex-col items-center justify-center rounded-full text-xs transition-all ${isSelected
                                        ? 'bg-[var(--color-accent)] text-white font-semibold shadow-sm'
                                        : isAvailable
                                            ? 'hover:bg-[var(--color-neutral-200)] cursor-pointer'
                                            : 'opacity-30 cursor-not-allowed line-through'
                                        }`}
                                >
                                    <span className={`leading-none ${isSelected ? 'text-white' : 'text-[var(--color-text)]'
                                        } ${!isAvailable ? 'text-[var(--color-neutral-400)]' : ''}`}>
                                        {day}
                                    </span>

                                </button>
                            </div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
                <div className="flex justify-center py-2">
                    <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                </div>
            )}



            {/* Selection hint */}
            <p className="text-center text-[10px] text-[var(--color-neutral-400)] mt-2">
                {selectionPhase === 'check-in'
                    ? (dict ? t(dict, 'booking.selectCheckInDate') : 'Select check-in date')
                    : (dict ? t(dict, 'booking.selectCheckOutDate') : 'Select check-out date')}
            </p>
        </div>
    );
}

// ─── Date Formatting Helper ─────────────────────────────────

function formatDisplayDate(dateStr: string): string {
    const d = parseDate(dateStr);
    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
