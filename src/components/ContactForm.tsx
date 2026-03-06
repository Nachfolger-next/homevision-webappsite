'use client';

import { useState } from 'react';
import { trackEvent } from '@/components/GoogleAnalytics';

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const labels = {
    thankYou: { el: 'Ευχαριστούμε!', en: 'Thank You!', ru: 'Спасибо!', tr: 'Teşekkürler!', bg: 'Благодарим!', he: 'תודה!' },
    successMsg: { el: 'Λάβαμε το μήνυμά σας. Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών.', en: "We've received your message. We'll get back to you within 24 hours.", ru: 'Мы получили ваше сообщение. Свяжемся с вами в течение 24 часов.', tr: 'Mesajınızı aldık. 24 saat içinde size geri dönüş yapacağız.', bg: 'Получихме съобщението ви. Ще се свържем с вас в рамките на 24 часа.', he: 'קיבלנו את ההודעה שלכם. נחזור אליכם תוך 24 שעות.' },
    fullName: { el: 'Ονοματεπώνυμο', en: 'Full Name', ru: 'Полное имя', tr: 'Ad Soyad', bg: 'Име и фамилия', he: 'שם מלא' },
    phone: { el: 'Τηλέφωνο', en: 'Phone', ru: 'Телефон', tr: 'Telefon', bg: 'Телефон', he: 'טלפון' },
    message: { el: 'Μήνυμα', en: 'Message', ru: 'Сообщение', tr: 'Mesaj', bg: 'Съобщение', he: 'הודעה' },
    sending: { el: 'Αποστολή...', en: 'Sending...', ru: 'Отправка...', tr: 'Gönderiliyor...', bg: 'Изпращане...', he: 'שולח...' },
    send: { el: 'Αποστολή', en: 'Send Message', ru: 'Отправить', tr: 'Gönder', bg: 'Изпрати', he: 'שלח הודעה' },
    error: { el: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.', en: 'Something went wrong. Please try again.', ru: 'Что-то пошло не так. Попробуйте ещё раз.', tr: 'Bir şeyler ters gitti. Tekrar deneyin.', bg: 'Нещо се обърка. Опитайте отново.', he: 'משהו השתבש. נסו שוב.' },
    placeholderName: { el: 'Γιάννης Παππάς', en: 'John Smith', ru: 'Иван Петров', tr: 'Ahmet Yılmaz', bg: 'Иван Петров', he: 'ישראל ישראלי' },
    placeholderMsg: { el: 'Πείτε μας για το ακίνητό σας...', en: 'Tell us about your property...', ru: 'Расскажите о вашем объекте...', tr: 'Mülkünüz hakkında bilgi verin...', bg: 'Разкажете за имота си...', he: 'ספרו לנו על הנכס שלכם...' },
};

export default function ContactForm({ lang }: { lang: string }) {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        setStatus('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                trackEvent('contact_submit', 'Form', 'Contact Page Form');
                setStatus('sent');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'sent') {
        return (
            <div className="bg-white p-10 md:p-12 rounded-2xl border border-[var(--color-neutral-200)] text-center"
                style={{ boxShadow: 'var(--shadow-accent-md)' }}>
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-serif mb-3">
                    {getLocalized(labels.thankYou, lang)}
                </h3>
                <p className="text-[var(--color-neutral-500)]">
                    {getLocalized(labels.successMsg, lang)}
                </p>
            </div>
        );
    }

    return (
        <div
            className="bg-white p-10 md:p-12 rounded-2xl border border-[var(--color-neutral-200)]"
            style={{ boxShadow: 'var(--shadow-accent-md)' }}
        >
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="contact-name" className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mb-3 block font-medium">
                        {getLocalized(labels.fullName, lang)}
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border-b border-[var(--color-neutral-200)] py-3 text-base focus:border-[var(--color-accent)] outline-none transition-colors bg-transparent"
                        placeholder={getLocalized(labels.placeholderName, lang)}
                    />
                </div>
                <div>
                    <label htmlFor="contact-email" className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mb-3 block font-medium">
                        Email
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border-b border-[var(--color-neutral-200)] py-3 text-base focus:border-[var(--color-accent)] outline-none transition-colors bg-transparent"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="contact-phone" className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mb-3 block font-medium">
                        {getLocalized(labels.phone, lang)}
                    </label>
                    <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full border-b border-[var(--color-neutral-200)] py-3 text-base focus:border-[var(--color-accent)] outline-none transition-colors bg-transparent"
                        placeholder="+30 ..."
                    />
                </div>
                <div>
                    <label htmlFor="contact-message" className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mb-3 block font-medium">
                        {getLocalized(labels.message, lang)}
                    </label>
                    <textarea
                        id="contact-message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full border-b border-[var(--color-neutral-200)] py-3 text-base focus:border-[var(--color-accent)] outline-none transition-colors resize-none bg-transparent"
                        placeholder={getLocalized(labels.placeholderMsg, lang)}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-[var(--color-accent)] text-white py-4 rounded-full text-xs uppercase tracking-[0.15em] font-bold hover:bg-[var(--color-accent-dark)] transition-colors disabled:opacity-60"
                    style={{ boxShadow: '0 8px 30px rgba(68, 125, 156, 0.2)' }}
                >
                    {status === 'sending'
                        ? getLocalized(labels.sending, lang)
                        : getLocalized(labels.send, lang)}
                </button>
                {status === 'error' && (
                    <p className="text-sm text-red-500 text-center">
                        {getLocalized(labels.error, lang)}
                    </p>
                )}
            </form>
        </div>
    );
}
