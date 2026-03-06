'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Tag, ChevronDown, ChevronUp, Shield, Sparkles } from 'lucide-react';
import PriceCalendar from './PriceCalendar';
import { t, Dictionary } from '@/lib/get-dictionary';

interface BookingCardProps {
    price: number;
    currency?: string;
    onBookingRequest: (params: {
        checkIn: string;
        checkOut: string;
        guests: number;
        couponCode?: string;
    }) => void;
    onPricingChange?: (params: {
        checkIn: string;
        checkOut: string;
        guests: number;
        couponCode?: string;
    }) => void;
    loading?: boolean;
    pricingData?: {
        nights: number;
        nightlyRate: number;
        cleaningFee: number;
        extraPersonFee: number;
        taxes: number;
        couponDiscount: number;
        lengthDiscount: number;
        lengthDiscountLabel: string;
        total: number;
    } | null;
    minNights?: number;
    initialCheckIn?: string;
    initialCheckOut?: string;
    initialGuests?: number;
    maxGuests?: number;
    listingId?: number;
    dict: Dictionary;
    lang?: string;
}

export default function BookingCard({
    price,
    currency = '€',
    onBookingRequest,
    onPricingChange,
    loading = false,
    pricingData,
    minNights = 1,
    initialCheckIn = '',
    initialCheckOut = '',
    initialGuests = 2,
    maxGuests = 10,
    listingId,
    dict,
    lang = 'en',
}: BookingCardProps) {
    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [guests, setGuests] = useState(initialGuests);
    const [couponCode, setCouponCode] = useState('');
    const [showCoupon, setShowCoupon] = useState(false);
    const [dynamicMinNights, setDynamicMinNights] = useState(minNights);
    const isFirstRender = useRef(true);

    const today = new Date().toISOString().split('T')[0];

    // Auto-fetch pricing when dates or guests change (skip initial render)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!checkIn || !checkOut || !onPricingChange) return;
        const timer = setTimeout(() => {
            onPricingChange({ checkIn, checkOut, guests, couponCode: couponCode || undefined });
        }, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkIn, checkOut, guests]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (checkIn && checkOut) {
            onBookingRequest({
                checkIn,
                checkOut,
                guests,
                couponCode: couponCode || undefined,
            });
        }
    };

    return (
        <>
            {/* Desktop: Sticky Sidebar Card */}
            <div className="hidden md:block">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="sticky top-28 bg-white rounded-2xl shadow-accent-md border border-[var(--color-neutral-200)] p-6"
                >
                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-6">
                        {!pricingData && (
                            <span className="text-sm text-[var(--color-neutral-500)] mr-0.5">{t(dict, 'booking.from')}</span>
                        )}
                        <span className="text-2xl font-semibold text-[var(--color-text)]">
                            {currency}{pricingData
                                ? Math.round((pricingData.nightlyRate * pricingData.nights + pricingData.cleaningFee) / pricingData.nights)
                                : price.toFixed(0)}
                        </span>
                        <span className="text-sm text-[var(--color-neutral-500)]">{t(dict, 'booking.perNight')}</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Price Calendar */}
                        {listingId ? (
                            <PriceCalendar
                                listingId={listingId}
                                checkIn={checkIn}
                                checkOut={checkOut}
                                dict={dict}
                                lang={lang}
                                onDateChange={(newCheckIn, newCheckOut, minStay) => {
                                    setCheckIn(newCheckIn);
                                    setCheckOut(newCheckOut);
                                    if (minStay > 0) setDynamicMinNights(minStay);
                                }}
                                currency={currency}
                            />
                        ) : (
                            /* Fallback: native date inputs when no listingId */
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1">
                                        {t(dict, 'property.checkIn')}
                                    </label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={today}
                                        required
                                        className="w-full px-3 py-2.5 bg-[var(--color-neutral-100)] rounded-lg text-sm border border-transparent focus:border-[var(--color-accent)] focus:outline-none transition-all cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1">
                                        {t(dict, 'property.checkOut')}
                                    </label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || today}
                                        required
                                        className="w-full px-3 py-2.5 bg-[var(--color-neutral-100)] rounded-lg text-sm border border-transparent focus:border-[var(--color-accent)] focus:outline-none transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Minimum stay notice */}
                        {dynamicMinNights > 1 && (
                            <p className="text-xs text-[var(--color-neutral-500)] -mt-2">
                                {t(dict, 'property.minimumStay')}: {dynamicMinNights} {t(dict, 'property.nights')}
                            </p>
                        )}

                        {/* Guests */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium mb-1">
                                {t(dict, 'property.guests', 'Guests')}
                            </label>
                            <select
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                                className="w-full px-3 py-2.5 bg-[var(--color-neutral-100)] rounded-lg text-sm border border-transparent focus:border-[var(--color-accent)] focus:outline-none transition-all cursor-pointer appearance-none"
                            >
                                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? t(dict, 'property.guest') : t(dict, 'property.guests')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Coupon Code */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowCoupon(!showCoupon)}
                                className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors cursor-pointer"
                            >
                                <Tag size={12} />
                                {t(dict, 'booking.haveCoupon')}
                                {showCoupon ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                            {showCoupon && (
                                <motion.input
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder={t(dict, 'booking.enterCode')}
                                    className="mt-2 w-full px-3 py-2.5 bg-[var(--color-neutral-100)] rounded-lg text-sm border border-transparent focus:border-[var(--color-accent)] focus:outline-none transition-all uppercase tracking-wider"
                                />
                            )}
                        </div>

                        {/* Price Breakdown */}
                        {pricingData && (() => {
                            const allInTotal = Math.round(pricingData.nightlyRate * pricingData.nights + pricingData.cleaningFee);
                            const allInRate = Math.round(allInTotal / pricingData.nights);
                            return (
                                <div className="pt-4 border-t border-[var(--color-neutral-200)] space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-neutral-600)]">
                                            {currency}{allInRate} × {pricingData.nights} {pricingData.nights === 1 ? t(dict, 'property.night') : t(dict, 'property.nights')}
                                        </span>
                                        <span>{currency}{allInTotal}</span>
                                    </div>
                                    {pricingData.extraPersonFee > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--color-neutral-600)]">{t(dict, 'booking.extraGuestFee')}</span>
                                            <span>{currency}{pricingData.extraPersonFee.toFixed(0)}</span>
                                        </div>
                                    )}
                                    {pricingData.taxes > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--color-neutral-600)]">{t(dict, 'booking.taxesAndFees')}</span>
                                            <span>{currency}{pricingData.taxes.toFixed(0)}</span>
                                        </div>
                                    )}
                                    {pricingData.lengthDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>{pricingData.lengthDiscountLabel || t(dict, 'booking.discount')}</span>
                                            <span>−{currency}{pricingData.lengthDiscount.toFixed(0)}</span>
                                        </div>
                                    )}
                                    {pricingData.couponDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>{t(dict, 'booking.couponDiscount')}</span>
                                            <span>−{currency}{pricingData.couponDiscount.toFixed(0)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-[var(--color-neutral-200)]">
                                        <span>{t(dict, 'booking.total')}</span>
                                        <span>{currency}{pricingData.total.toFixed(0)}</span>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* CTA */}
                        <motion.button
                            type="submit"
                            disabled={loading || !checkIn || !checkOut}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-3.5 bg-[var(--color-accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? t(dict, 'booking.checking') : t(dict, 'booking.requestToBook')}
                        </motion.button>
                    </form>

                    {/* Trust Signals */}
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[var(--color-neutral-500)]">
                            <Shield size={12} className="text-[var(--color-accent)]" />
                            {t(dict, 'booking.bestRateGuarantee')}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--color-neutral-500)]">
                            <Sparkles size={12} className="text-[var(--color-warm)]" />
                            {t(dict, 'booking.noHiddenFees')}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile: Sticky Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-neutral-200)] px-4 py-3 shadow-dark">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-semibold text-[var(--color-text)]">
                            {pricingData ? `${currency}${pricingData.total.toFixed(0)}` : `${t(dict, 'booking.from')} ${currency}${price.toFixed(0)}`}
                        </span>
                        <span className="text-xs text-[var(--color-neutral-500)] ml-1">
                            {pricingData ? t(dict, 'booking.total').toLowerCase() : t(dict, 'booking.perNight')}
                        </span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            // On mobile, scroll to top where the form would be, or open a sheet
                            const formEl = document.getElementById('booking-form-mobile');
                            if (formEl) {
                                formEl.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                // Trigger booking with current defaults
                                onBookingRequest({ checkIn, checkOut, guests, couponCode: couponCode || undefined });
                            }
                        }}
                        className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
                    >
                        {t(dict, 'booking.requestToBook')}
                    </motion.button>
                </div>
            </div>
        </>
    );
}
