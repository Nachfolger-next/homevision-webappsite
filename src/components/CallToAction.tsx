'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Locale } from '@/i18n-config';

const content = {
    title: {
        el: 'Είστε Έτοιμοι να Απογειώσετε τα Έσοδά σας;',
        en: 'Ready to Unlock Your Property\'s Full Potential?',
        ru: 'Готовы раскрыть полный потенциал вашей недвижимости?',
        tr: 'Mülkünüzün Tüm Potansiyelini Açığa Çıkarmaya Hazır Mısınız?',
        bg: 'Готови ли сте да разкриете пълния потенциал на имота си?',
        he: 'מוכנים לשחרר את הפוטנציאל המלא של הנכס?',
    },
    subtitle: {
        el: 'Κάθε μήνα χωρίς διαχείριση, χάνετε έσοδα. Κάντε το πρώτο βήμα σήμερα.',
        en: 'Every month your property sits idle — or underperforms — you lose income. Let\'s change that, no matter where you live.',
        ru: 'Каждый месяц, когда ваша недвижимость простаивает или недорабатывает, вы теряете доход. Давайте это изменим, где бы вы ни жили.',
        tr: 'Mülkünüz boş durduğu veya düşük performans gösterdiği her ay, gelir kaybedıyorsunuz. Nerede yaşarsanız yaşayın, bunu değiştirelim.',
        bg: 'Всеки месец, в който имотът ви стои празен или не работи на пълна мощност, губите приходи. Нека променим това, където и да живеете.',
        he: 'כל חודש שהנכס שלכם עומד ריק או מתפקד מתחת, אתם מפסידים הכנסות. בואו נשנה את זה, לא משנה איפה אתם גרים.',
    },
    cta: {
        el: 'Μιλήστε με την Ομάδα μας',
        en: 'Book a Call With Us',
        ru: 'Запишитесь на звонок',
        tr: 'Bizimle Görüşme Ayarlayın',
        bg: 'Запишете се за разговор',
        he: 'קבעו שיחה איתנו',
    },
    ctaSecondary: {
        el: 'Ξεκινήστε τη Δωρεάν Εκτίμηση',
        en: 'Get Your Free Revenue Estimate',
        ru: 'Получите бесплатную оценку дохода',
        tr: 'Ücretsiz Gelir Tahmininizi Alın',
        bg: 'Вземете безплатна оценка на приходите',
        he: 'קבלו הערכת הכנסות חינם',
    },
};

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

export default function CallToAction({ lang }: { lang: Locale }) {
    return (
        <section className="relative py-32 md:py-40 overflow-hidden grain-overlay">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F1419] via-[#1a2a35] to-[#0F1419]" />

            {/* Decorative accent glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)]/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Decorative dot grid */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="container relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Editorial rule */}
                    <span className="block w-16 h-[1px] bg-[var(--color-accent)] opacity-50 mx-auto mb-8" />

                    <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-[-0.03em] leading-[1.2] md:leading-[1]">
                        {getLocalized(content.title, lang)}
                    </h2>

                    <p className="text-white/40 text-base md:text-lg max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        {getLocalized(content.subtitle, lang)}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={`/${lang}/contact`}
                            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.15em] font-bold hover:bg-[var(--color-accent-dark)] transition-colors group"
                            style={{ boxShadow: '0 8px 30px rgba(68, 125, 156, 0.3)' }}
                        >
                            {getLocalized(content.cta, lang)}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href={`/${lang}/services`}
                            className="inline-flex items-center gap-2 text-white/50 text-xs uppercase tracking-[0.15em] font-medium border-b border-white/20 pb-1 hover:text-white hover:border-white/40 transition-all"
                        >
                            {getLocalized(content.ctaSecondary, lang)}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
