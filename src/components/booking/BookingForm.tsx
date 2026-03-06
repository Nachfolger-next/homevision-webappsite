'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    Shield,
    ArrowLeft,
    Calendar,
    Moon,
    Users,
    CreditCard,
    Clock,
    Star,
} from 'lucide-react';
import { t, Dictionary } from '@/lib/get-dictionary';

interface BookingFormProps {
    propertyName: string;
    propertyImage?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    nightlyRate?: number;
    cleaningFee?: number;
    taxes?: number;
    lengthDiscount?: number;
    lengthDiscountLabel?: string;
    currency?: string;
    couponCode?: string;
    couponDiscount?: number;
    onSubmit: (data: {
        guestFirstName: string;
        guestLastName: string;
        guestEmail: string;
        guestPhone: string;
        specialRequests: string;
    }) => void;
    onBack: () => void;
    loading?: boolean;
    success?: boolean;
    confirmationId?: string;
    dict: Dictionary;
}

export default function BookingForm({
    propertyName,
    propertyImage,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    nightlyRate = 0,
    cleaningFee = 0,
    taxes = 0,
    lengthDiscount = 0,
    lengthDiscountLabel = '',
    currency = '€',
    couponCode,
    couponDiscount = 0,
    onSubmit,
    onBack,
    loading = false,
    success = false,
    confirmationId,
    dict,
}: BookingFormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const isFormValid = firstName && lastName && email && phone;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            guestFirstName: firstName,
            guestLastName: lastName,
            guestEmail: email,
            guestPhone: phone,
            specialRequests,
        });
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    // ─── Success State ─────────────────────────────────────
    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl mx-auto py-12 px-4"
            >
                <div className="bg-white rounded-3xl p-10 md:p-14 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-neutral-200)] relative overflow-hidden text-center">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-accent-light)] via-[var(--color-accent)] to-[var(--color-accent-dark)]" />

                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-success)]/20 to-[var(--color-success)]/5 flex items-center justify-center mx-auto mb-8 shadow-inner border border-[var(--color-success)]/10"
                    >
                        <CheckCircle size={48} className="text-[var(--color-success)]" strokeWidth={1.5} />
                    </motion.div>

                    <h2 className="font-serif text-4xl text-[var(--color-text)] mb-4 tracking-tight">
                        {t(dict, 'booking.requestSent')}
                    </h2>

                    <p className="text-[var(--color-neutral-500)] mb-10 max-w-md mx-auto text-lg leading-relaxed">
                        {t(dict, 'booking.requestSentDesc')} <strong className="text-[var(--color-text)] font-semibold">{propertyName}</strong>.
                        {' '}{t(dict, 'booking.confirmWithin24h')}
                    </p>

                    {confirmationId && (
                        <div className="inline-flex flex-col items-center bg-[#fcfcfc] border border-[var(--color-neutral-200)] rounded-2xl px-10 py-6 mb-12 w-full max-w-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-400)] block mb-2 font-bold">
                                {t(dict, 'booking.reference')}
                            </span>
                            <span className="text-xl md:text-2xl font-mono font-medium text-[var(--color-text)] tracking-wide">
                                {confirmationId}
                            </span>
                        </div>
                    )}

                    <div className="bg-[var(--color-surface)] border border-[var(--color-neutral-200)] rounded-2xl p-8 md:p-10 text-left relative overflow-hidden group hover:border-[var(--color-accent)]/20 transition-colors">
                        <h4 className="font-serif text-xl text-[var(--color-text)] mb-8 flex items-center gap-4">
                            <span className="w-10 h-px bg-[var(--color-accent)]/30 inline-block" />
                            {t(dict, 'booking.whatHappensNext')}
                        </h4>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[var(--color-neutral-200)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm">1</span>
                                <p className="text-[var(--color-neutral-600)] leading-relaxed text-sm pt-1">{t(dict, 'booking.step1Review')}</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[var(--color-neutral-200)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm">2</span>
                                <p className="text-[var(--color-neutral-600)] leading-relaxed text-sm pt-1">{t(dict, 'booking.step2Email')}</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[var(--color-neutral-200)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm">3</span>
                                <p className="text-[var(--color-neutral-600)] leading-relaxed text-sm pt-1">{t(dict, 'booking.step3Payment')}</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[var(--color-success)]/30 text-[var(--color-success)] flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm">4</span>
                                <p className="text-[var(--color-text)] font-medium leading-relaxed text-sm pt-1">{t(dict, 'booking.step4Confirmed')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ─── Checkout Form ─────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
        >
            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-text)] transition-colors mb-8 cursor-pointer group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {t(dict, 'booking.backToProperty')}
            </button>

            {/* ─── Progress Steps ──────────────────────────── */}
            <div className="flex items-center gap-3 mb-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-xs font-semibold">
                        1
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text)]">{t(dict, 'booking.yourDetails')}</span>
                </div>
                <div className="flex-1 h-px bg-[var(--color-neutral-300)]" />
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)] flex items-center justify-center text-xs font-semibold">
                        2
                    </div>
                    <span className="text-sm text-[var(--color-neutral-400)]">{t(dict, 'booking.confirmation')}</span>
                </div>
                <div className="flex-1 h-px bg-[var(--color-neutral-300)]" />
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)] flex items-center justify-center text-xs font-semibold">
                        3
                    </div>
                    <span className="text-sm text-[var(--color-neutral-400)]">{t(dict, 'booking.payment')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                {/* ═══════════════════════════════════ Left: Form ═══════════════════════════════════ */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section header */}
                    <div>
                        <h2 className="font-serif text-3xl text-[var(--color-text)] mb-2">
                            {t(dict, 'booking.completeYourBooking')}
                        </h2>
                        <p className="text-[var(--color-neutral-500)] text-sm">
                            {t(dict, 'booking.fillInDetails')}
                        </p>
                    </div>

                    {/* ─── Guest Information ──────────────────── */}
                    <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6 space-y-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                            <Users size={16} className="text-[var(--color-accent)]" />
                            {t(dict, 'booking.guestInformation')}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label
                                    className={`absolute left-4 transition-all pointer-events-none ${focusedField === 'firstName' || firstName
                                        ? 'top-2 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] font-medium'
                                        : 'top-1/2 -translate-y-1/2 text-sm text-[var(--color-neutral-400)]'
                                        }`}
                                >
                                    {t(dict, 'booking.firstName')}
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    onFocus={() => setFocusedField('firstName')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="w-full pt-6 pb-2 px-4 bg-[var(--color-neutral-100)] rounded-xl text-sm border-2 border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all"
                                />
                            </div>
                            <div className="relative">
                                <label
                                    className={`absolute left-4 transition-all pointer-events-none ${focusedField === 'lastName' || lastName
                                        ? 'top-2 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] font-medium'
                                        : 'top-1/2 -translate-y-1/2 text-sm text-[var(--color-neutral-400)]'
                                        }`}
                                >
                                    {t(dict, 'booking.lastName')}
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    onFocus={() => setFocusedField('lastName')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="w-full pt-6 pb-2 px-4 bg-[var(--color-neutral-100)] rounded-xl text-sm border-2 border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label
                                className={`absolute left-4 transition-all pointer-events-none ${focusedField === 'email' || email
                                    ? 'top-2 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] font-medium'
                                    : 'top-1/2 -translate-y-1/2 text-sm text-[var(--color-neutral-400)]'
                                    }`}
                            >
                                {t(dict, 'booking.emailAddress')}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                required
                                className="w-full pt-6 pb-2 px-4 bg-[var(--color-neutral-100)] rounded-xl text-sm border-2 border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <label
                                className={`absolute left-4 transition-all pointer-events-none ${focusedField === 'phone' || phone
                                    ? 'top-2 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] font-medium'
                                    : 'top-1/2 -translate-y-1/2 text-sm text-[var(--color-neutral-400)]'
                                    }`}
                            >
                                {t(dict, 'booking.phoneNumber')}
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                                required
                                className="w-full pt-6 pb-2 px-4 bg-[var(--color-neutral-100)] rounded-xl text-sm border-2 border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* ─── Special Requests ──────────────────── */}
                    <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6 space-y-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                            <Clock size={16} className="text-[var(--color-accent)]" />
                            {t(dict, 'booking.specialRequests')}
                            <span className="text-[var(--color-neutral-400)] font-normal text-xs">{t(dict, 'booking.optional')}</span>
                        </h3>
                        <textarea
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-[var(--color-neutral-100)] rounded-xl text-sm border-2 border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none transition-all resize-none"
                            placeholder={t(dict, 'booking.specialRequestsPlaceholder')}
                        />
                    </div>

                    {/* ─── Submit Button ─────────────────────── */}
                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.button
                                key={loading ? 'loading' : 'submit'}
                                type="submit"
                                disabled={loading || !isFormValid}
                                whileHover={!loading && isFormValid ? { scale: 1.01 } : {}}
                                whileTap={!loading && isFormValid ? { scale: 0.99 } : {}}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`w-full py-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${isFormValid
                                    ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] shadow-[var(--shadow-accent-md)]'
                                    : 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-400)] cursor-not-allowed'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        {t(dict, 'booking.processing')}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={16} />
                                        {t(dict, 'booking.submitBookingRequest')}
                                    </>
                                )}
                            </motion.button>
                        </AnimatePresence>

                        {/* Trust signals */}
                        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[var(--color-neutral-500)]">
                            <span className="flex items-center gap-1.5">
                                <Shield size={13} className="text-[var(--color-accent)]" />
                                {t(dict, 'booking.secureBooking')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star size={13} className="text-[var(--color-warm)]" />
                                {t(dict, 'booking.noPaymentNow')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle size={13} className="text-[var(--color-success)]" />
                                {t(dict, 'booking.zeroCommission')}
                            </span>
                        </div>
                    </div>
                </form>

                {/* ═══════════════════════════════════ Right: Summary Card ═══════════════════════════════════ */}
                <div className="lg:sticky lg:top-28">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="bg-white rounded-2xl border border-[var(--color-neutral-200)] overflow-hidden shadow-[var(--shadow-accent-sm)]"
                    >
                        {/* Property preview image */}
                        {propertyImage && (
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={propertyImage}
                                    alt={propertyName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <h3 className="absolute bottom-3 left-4 right-4 font-serif text-lg text-white leading-snug">
                                    {propertyName}
                                </h3>
                            </div>
                        )}

                        <div className="p-5 space-y-4">
                            {/* Property name fallback if no image */}
                            {!propertyImage && (
                                <h3 className="font-serif text-lg text-[var(--color-text)]">
                                    {propertyName}
                                </h3>
                            )}

                            {/* ─── Date & Guest Chips ──────────────── */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="bg-[var(--color-neutral-100)] rounded-xl p-3">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <Calendar size={12} className="text-[var(--color-accent)]" />
                                        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-neutral-500)] font-medium">
                                            {t(dict, 'property.checkIn')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-[var(--color-text)] leading-tight">
                                        {formatDate(checkIn)}
                                    </p>
                                </div>
                                <div className="bg-[var(--color-neutral-100)] rounded-xl p-3">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <Calendar size={12} className="text-[var(--color-accent)]" />
                                        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-neutral-500)] font-medium">
                                            {t(dict, 'property.checkOut')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-[var(--color-text)] leading-tight">
                                        {formatDate(checkOut)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2.5">
                                <div className="flex-1 bg-[var(--color-neutral-100)] rounded-xl p-3 flex items-center gap-2.5">
                                    <Moon size={14} className="text-[var(--color-accent)]" />
                                    <div>
                                        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-neutral-500)] font-medium block">
                                            {t(dict, 'booking.duration')}
                                        </span>
                                        <span className="text-sm font-medium text-[var(--color-text)]">
                                            {nights} {nights !== 1 ? t(dict, 'property.nights') : t(dict, 'property.night')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-[var(--color-neutral-100)] rounded-xl p-3 flex items-center gap-2.5">
                                    <Users size={14} className="text-[var(--color-accent)]" />
                                    <div>
                                        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-neutral-500)] font-medium block">
                                            {t(dict, 'property.guests', 'Guests')}
                                        </span>
                                        <span className="text-sm font-medium text-[var(--color-text)]">
                                            {guests} {guests !== 1 ? t(dict, 'property.guests') : t(dict, 'property.guest')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ─── Price Breakdown ─────────────────── */}
                            <div className="border-t border-[var(--color-neutral-200)] pt-4 space-y-2.5">
                                <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-neutral-500)] font-medium">
                                    {t(dict, 'booking.priceBreakdown')}
                                </span>

                                {nightlyRate > 0 && (() => {
                                    const allInTotal = Math.round(nightlyRate * nights + cleaningFee);
                                    const allInRate = Math.round(allInTotal / nights);
                                    return (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--color-neutral-600)]">
                                                {currency}{allInRate} × {nights} {nights !== 1 ? t(dict, 'property.nights') : t(dict, 'property.night')}
                                            </span>
                                            <span className="text-[var(--color-text)] font-medium">
                                                {currency}{allInTotal}
                                            </span>
                                        </div>
                                    );
                                })()}

                                {taxes > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-neutral-600)]">{t(dict, 'booking.taxesAndFees')}</span>
                                        <span className="text-[var(--color-text)]">{currency}{Math.round(taxes)}</span>
                                    </div>
                                )}

                                {lengthDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>{lengthDiscountLabel || t(dict, 'booking.discount')}</span>
                                        <span>−{currency}{Math.round(lengthDiscount)}</span>
                                    </div>
                                )}

                                {couponCode && couponDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>{t(dict, 'booking.couponDiscount')} ({couponCode})</span>
                                        <span>−{currency}{Math.round(couponDiscount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-baseline pt-3 border-t border-[var(--color-neutral-200)]">
                                    <span className="text-sm font-semibold text-[var(--color-text)]">{t(dict, 'booking.total')}</span>
                                    <span className="text-2xl font-semibold text-[var(--color-text)]">
                                        {currency}{Math.round(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* ─── What to expect ──────────────────── */}
                            <div className="bg-[var(--color-accent-light)] rounded-xl p-4 text-sm">
                                <p className="text-[var(--color-accent-dark)] font-medium mb-2 text-xs">
                                    {t(dict, 'booking.whatHappensAfter')}
                                </p>
                                <ul className="space-y-1.5 text-xs text-[var(--color-accent-dark)]/80">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                                        {t(dict, 'booking.confirmAvailability')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                                        {t(dict, 'booking.securePaymentLink')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                                        {t(dict, 'booking.noChargesUntilConfirmed')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
