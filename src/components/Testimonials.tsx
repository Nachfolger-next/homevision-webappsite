'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Locale } from '@/i18n-config';

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const content = {
    label: { el: 'Ιστορίες Πελατών', en: 'Client Stories', ru: 'Отзывы клиентов', tr: 'Müşteri Hikayeleri', bg: 'Клиентски истории', he: 'סיפורי לקוחות' },
    heading: { el: 'Εμπιστοσύνη Ιδιοκτητών', en: 'Trusted by Owners', ru: 'Нам доверяют владельцы', tr: 'Sahipler Tarafından Güvenilen', bg: 'Доверието на собствениците', he: 'מהימנים בעיני בעלים' },
};

const TESTIMONIALS = [
    {
        id: 1,
        text: {
            el: 'Η προσοχή στη λεπτομέρεια που παρέχει η Homevision είναι ασύγκριτη. Το ακίνητό μου δεν ήταν ποτέ καλύτερο, και οι κριτικές των επισκεπτών είναι σταθερά εξαιρετικές.',
            en: "The attention to detail Homevision provides is unmatched. My property has never looked better, and the guest reviews are consistently glowing. Truly a 'set it and forget it' experience.",
            ru: 'Внимание к деталям, которое обеспечивает Homevision, не имеет аналогов. Моя недвижимость выглядит лучше, чем когда-либо, а отзывы гостей неизменно восторженные.',
            tr: 'Homevision\'\u0131n detaylara gösterdiği özen benzersiz. Mülküm hiç bu kadar iyi görünmemişti ve misafir değerlendirmeleri sürekli olumlu.',
            bg: 'Вниманието към детайлите, което Homevision осигурява, е ненадминато. Имотът ми никога не е изглеждал по-добре.',
            he: 'תשומת הלב לפרטים ש-Homevision מספקת היא ללא תחרות. הנכס שלי מעולם לא נראה טוב יותר.',
        },
        author: "Elena K.",
        role: { el: 'Ιδιοκτήτρια Βίλας, Χαλκιδική', en: 'Villa Owner, Chalkidiki', ru: 'Владелица виллы, Халкидики', tr: 'Villa Sahibi, Halkidiki', bg: 'Собственик на вила, Халкидики', he: 'בעלת וילה, חלקידיקי' },
        rating: 5,
    },
    {
        id: 2,
        text: {
            el: 'Η μετάβαση στην digital διαχείριση ήταν η καλύτερη απόφαση για τα διαμερίσματά μου στην πόλη. Ο υπολογιστής εσόδων ήταν ακριβής και η πληρότητα αυξήθηκε σημαντικά.',
            en: "Transitioning to their digital management service was the best decision for my city apartments. The revenue calculator was spot on, and the occupancy rates have increased significantly.",
            ru: 'Переход на цифровое управление стал лучшим решением для моих городских квартир. Калькулятор доходов оказался точным, а заполняемость значительно выросла.',
            tr: 'Dijital yönetim hizmetine geçiş, şehir dairelerim için en iyi karardı. Gelir hesaplayıcı isabetliydi ve doluluk oranları önemli ölçüde arttı.',
            bg: 'Преминаването към дигитално управление беше най-доброто решение за градските ми апартаменти. Калкулаторът на приходи беше точен.',
            he: 'המעבר לניהול דיגיטלי היה ההחלטה הטובה ביותר עבור הדירות העירוניות שלי. מחשבון ההכנסות היה מדויק.',
        },
        author: "Dimitris P.",
        role: { el: 'Ιδιοκτήτης Διαμερισμάτων, Θεσσαλονίκη', en: 'Apartment Owner, Thessaloniki', ru: 'Владелец квартир, Салоники', tr: 'Daire Sahibi, Selanik', bg: 'Собственик на апартаменти, Солун', he: 'בעל דירות, סלוניקי' },
        rating: 5,
    },
    {
        id: 3,
        text: {
            el: 'Επαγγελματική, διαφανής και απίστευτα αποτελεσματική. Φροντίζουν το σπίτι μου σαν να ήταν δικό τους. Εκτιμώ τις μηνιαίες αναφορές και την ηρεμία ότι τα πάντα είναι υπό έλεγχο.',
            en: "Professional, transparent, and incredibly effective. They treat my home as if it were their own. I appreciate the monthly reports and the peace of mind knowing everything is handled.",
            ru: 'Профессионально, прозрачно и невероятно эффективно. Они относятся к моему дому как к своему. Ценю ежемесячные отчёты и спокойствие.',
            tr: 'Profesyonel, şeffaf ve inandırılmaz derecede etkili. Evime kendi evleri gibi davranıyorlar. Aylık raporları ve her şeyin kontrol altında olduğunu bilmenin huzurunu takdir ediyorum.',
            bg: 'Професионално, прозрачно и невероятно ефективно. Грижат се за дома ми, сякаш е техен. Ценя месечните отчети и спокойствието.',
            he: 'מקצועי, שקוף ויעיל להפליא. הם מתייחסים לבית שלי כאילו היה שלהם. אני מעריך את הדוחות החודשיים ואת השקט הנפשי.',
        },
        author: "Sophia M.",
        role: { el: 'Ιδιοκτήτρια, Αθήνα', en: 'Homeowner, Athens', ru: 'Владелица, Афины', tr: 'Ev Sahibi, Atina', bg: 'Собственик, Атина', he: 'בעלת בית, אתונה' },
        rating: 5,
    },
];

export default function Testimonials({ lang = 'en' }: { lang?: Locale }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 md:py-32 bg-[var(--color-surface)] relative overflow-hidden">
            {/* Background decorative element */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[var(--color-accent)] blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[var(--color-warm)] blur-[120px]" />
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium mb-3 block">
                            {getLocalized(content.label, lang)}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-6 tracking-tight">
                            {getLocalized(content.heading, lang)}
                        </h2>
                        <div className="w-12 h-[1px] bg-[var(--color-neutral-300)] mx-auto" />
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {TESTIMONIALS.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            className="flex flex-col relative"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6 text-[var(--color-warm)] opacity-20">
                                <Quote size={40} />
                            </div>

                            {/* Text */}
                            <blockquote className="text-lg md:text-xl font-serif leading-relaxed text-[var(--color-neutral-600)] mb-8 flex-grow">
                                &ldquo;{getLocalized(item.text, lang)}&rdquo;
                            </blockquote>

                            {/* Author */}
                            <div className="mt-auto">
                                <div className="w-8 h-[1px] bg-[var(--color-neutral-300)] mb-4" />
                                <cite className="not-italic block text-[var(--color-text)] font-medium tracking-wide text-sm">
                                    {item.author}
                                </cite>
                                <span className="text-xs text-[var(--color-neutral-400)] uppercase tracking-wider mt-1 block">
                                    {getLocalized(item.role, lang)}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
