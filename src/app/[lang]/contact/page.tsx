import { type Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { Phone, Mail, MapPin, Clock, Shield, CheckCircle2 } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us | Homevision',
    description: 'Get in touch with Homevision. Free property assessment, no commitment required. Response within 24 hours.',
    openGraph: {
        title: 'Contact Homevision',
        description: 'We\'re here for you. Send us a message or give us a call.',
        type: 'website',
    },
    alternates: getAlternates('/contact'),
};

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const content = {
    title: { el: 'Επικοινωνία', en: 'Get in Touch', ru: 'Связаться с нами', tr: 'İletişime Geçin', bg: 'Свържете се с нас', he: 'צרו קשר' },
    subtitle: {
        el: 'Είμαστε εδώ για εσάς. Στείλτε μας μήνυμα ή καλέστε μας.',
        en: 'We\'re here for you. Send us a message or give us a call.',
        ru: 'Мы здесь для вас. Отправьте сообщение или позвоните.',
        tr: 'Sizin için buradayız. Bize mesaj gönderin veya arayın.',
        bg: 'Тук сме за вас. Изпратете ни съобщение или ни се обадете.',
        he: 'אנחנו כאן בשבילכם. שלחו הודעה או התקשרו.',
    },
    phone: { el: 'Τηλέφωνο', en: 'Phone', ru: 'Телефон', tr: 'Telefon', bg: 'Телефон', he: 'טלפון' },
    office: { el: 'Γραφείο', en: 'Office', ru: 'Офис', tr: 'Ofis', bg: 'Офис', he: 'משרד' },
    trustResponse: { el: 'Απάντηση εντός 24 ωρών', en: 'Response within 24 hours', ru: 'Ответ в течение 24 часов', tr: '24 saat içinde yanıt', bg: 'Отговор в рамките на 24 часа', he: 'מענה תוך 24 שעות' },
    trustAssessment: { el: 'Δωρεάν Αξιολόγηση Ακινήτου', en: 'Free Property Assessment', ru: 'Бесплатная оценка объекта', tr: 'Ücretsiz Mülk Değerlendirmesi', bg: 'Безплатна оценка на имота', he: 'הערכת נכס חינם' },
    trustNoCommitment: { el: 'Χωρίς Δέσμευση', en: 'No Commitment Required', ru: 'Без обязательств', tr: 'Taahhüt Gerekmiyor', bg: 'Без ангажимент', he: 'ללא התחייבות' },
};

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    const trustSignals = [
        { icon: Clock, text: getLocalized(content.trustResponse, lang) },
        { icon: Shield, text: getLocalized(content.trustAssessment, lang) },
        { icon: CheckCircle2, text: getLocalized(content.trustNoCommitment, lang) },
    ];

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} />

            {/* Spacer for fixed header */}
            <div style={{ height: '120px' }} />

            <div className="container pb-20 md:pb-32">
                {/* Asymmetric header */}
                <div className="max-w-xl mb-16">
                    <span className="editorial-rule editorial-rule--accent mb-6 block" />
                    <h1 className="text-5xl md:text-8xl font-serif mb-6 tracking-[-0.03em] leading-[1.1] md:leading-[0.95]">
                        {getLocalized(content.title, lang)}
                    </h1>
                    <p className="text-lg text-[var(--color-neutral-500)]">
                        {getLocalized(content.subtitle, lang)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-20">
                    {/* Info Side */}
                    <div>
                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                                    <Phone size={16} className="text-[var(--color-accent)]" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-400)] font-medium block mb-1">
                                        {getLocalized(content.phone, lang)}
                                    </span>
                                    <a href="tel:+306949413865" className="text-lg font-serif hover:text-[var(--color-accent)] transition-colors">
                                        +30 694 941 3865
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                                    <Mail size={16} className="text-[var(--color-accent)]" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-400)] font-medium block mb-1">
                                        Email
                                    </span>
                                    <a href="mailto:info@homevision.gr" className="text-lg font-serif hover:text-[var(--color-accent)] transition-colors">
                                        info@homevision.gr
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} className="text-[var(--color-accent)]" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-400)] font-medium block mb-1">
                                        {getLocalized(content.office, lang)}
                                    </span>
                                    <p className="text-lg font-serif">Εδμόνδου Ροστάν 9, 54641</p>
                                    <p className="text-sm text-[var(--color-neutral-400)] mt-1">Thessaloniki, Greece</p>
                                </div>
                            </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-neutral-100)] border border-[var(--color-neutral-200)]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48663.86387185672!2d22.9176253!3d40.6264622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a838f41428e0ed%3A0x9bae715b8d574a9!2sThessaloniki%2C%20Greece!5e0!3m2!1sen!2s!4v1707000000000"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 grayscale-[60%] hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>

                    {/* Form Side */}
                    <div>
                        <ContactForm lang={lang} />

                        {/* Trust Signals */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {trustSignals.map((signal, idx) => {
                                const Icon = signal.icon;
                                return (
                                    <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-neutral-200)]">
                                        <Icon size={16} className="text-[var(--color-accent)] flex-shrink-0" />
                                        <span className="text-xs text-[var(--color-neutral-600)] font-medium">{signal.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <CallToAction lang={lang} />
            <Footer lang={lang} />
        </main>
    );
}
