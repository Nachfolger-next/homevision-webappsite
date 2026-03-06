'use client';

import { useState } from 'react';
import { trackEvent } from '@/components/GoogleAnalytics';
import { cn } from '@/lib/utils';

export default function NewsletterForm({ lang }: { lang: string }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || status === 'submitting') return;

        setStatus('submitting');

        // Simulate API call for newsletter
        await new Promise(r => setTimeout(r, 600));

        trackEvent('newsletter_signup', 'Form', 'Journal Newsletter');
        setStatus('success');
        setEmail('');
    };

    if (status === 'success') {
        return (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center max-w-lg mx-auto transition-all animate-in fade-in slide-in-from-bottom-2">
                <span className="inline-block w-8 h-8 rounded-full bg-green-500/20 text-green-400 mb-3 flex items-center justify-center mx-auto">
                    ✓
                </span>
                <p className="text-white font-medium">
                    {({ el: 'Ευχαριστούμε για την εγγραφή!', en: 'Thank you for subscribing!', ru: 'Спасибо за подписку!', tr: 'Abone olduğunuz için teşekkürler!', bg: 'Благодарим ви за абонамента!', he: 'תודה שנרשמתם!' }[lang] || 'Thank you for subscribing!')}
                </p>
                <p className="text-white/60 text-sm mt-1">
                    {({ el: 'Θα λαμβάνετε τα τελευταία νέα μας.', en: 'You will receive our latest insights soon.', ru: 'Скоро вы получите наши новости.', tr: 'Yakında en son bilgilerimizi alacaksınız.', bg: 'Скоро ще получите нашите новини.', he: 'תקבלו את העדכונים שלנו בקרוב.' }[lang] || 'You will receive our latest insights soon.')}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={({ el: 'Το email σας', en: 'Your email address', ru: 'Ваш email', tr: 'E-posta adresiniz', bg: 'Вашият имейл', he: 'כתובת האימייל שלכם' }[lang] || 'Your email address') as string}
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-full px-6 py-4 text-sm text-white placeholder:text-white/30 focus:border-[var(--color-accent)]/50 outline-none transition-colors"
                disabled={status === 'submitting'}
            />
            <button
                type="submit"
                disabled={status === 'submitting'}
                className={cn(
                    "bg-[var(--color-accent)] text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.15em] font-bold hover:bg-[var(--color-accent-dark)] transition-colors whitespace-nowrap",
                    status === 'submitting' && "opacity-70 cursor-not-allowed"
                )}
            >
                {status === 'submitting'
                    ? ({ el: 'Αποστολη...', en: 'Sending...', ru: 'Отправка...', tr: 'Gönderiliyor...', bg: 'Изпращане...', he: 'שולח...' }[lang] || 'Sending...')
                    : ({ el: 'Εγγραφή', en: 'Subscribe', ru: 'Подписаться', tr: 'Abone Ol', bg: 'Абонирайте се', he: 'הרשמו' }[lang] || 'Subscribe')
                }
            </button>
        </form>
    );
}
