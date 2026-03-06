'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Locale } from '@/i18n-config';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

type ServiceType = 'full' | 'digital';

const getLocalized = (obj: Record<string, string>, lang: string): string => {
    return obj[lang] || obj['en'] || Object.values(obj)[0] || '';
};

export default function ServiceBundles({ lang }: { lang: Locale }) {
    const [activeTab, setActiveTab] = useState<ServiceType>('full');

    const sectionTitle: Record<string, string> = { el: 'Δύο Μοντέλα, Ένας Στόχος — Μέγιστο Κέρδος', en: 'Two Ways to Earn — Choose What Suits Your Lifestyle', ru: 'Два пути к доходу — выберите подходящий вам', tr: 'İki Kazanç Yolu — Yaşam Tarzınıza Uygunı Seçin', bg: 'Два начина да печелите — изберете подходящия за вас', he: 'שתי דרכים להרוויח — בחרו את המתאימה לאורח החיים שלכם' };
    const sectionSubtitle: Record<string, string> = { el: 'Επιλέξτε την απόλυτη εμπειρία χωρίς κόπο ή τη στρατηγική μας καθοδήγηση. Όποιο μοντέλο κι αν διαλέξετε, τα έσοδά σας μεγιστοποιούνται.', en: 'Hands-off from anywhere in the world, or stay involved with expert guidance. Either way, your property earns more.', ru: 'Полностью без забот из любой точки мира, или участвуйте с экспертной поддержкой. В любом случае ваш доход растёт.', tr: 'Dünyanın her yerinden tamıyla eli boyadamadan, ya da uzman desteğiyle sürece dahil olarak. Her iki şekilde de mülkünüz daha fazla kazanır.', bg: 'Без грижи откъдето и да сте по света, или участвайте с експертна подкрепа. И в двата случая имотът ви печели повече.', he: 'בלי דאגות מכל מקום בעולם, או הישארו מעורבים עם הדרכה מקצועית. כך או כך, הנכס שלכם מרוויח יותר.' };

    const content = {
        full: {
            title: { el: 'Πλήρης Διαχείριση', en: 'Full Management', ru: 'Полное управление', he: 'ניהול מלא', tr: 'Tam Yönetim', bg: 'Пълно управление' },
            description: {
                el: 'Αφήστε τα κλειδιά σε εμάς — εσείς απλά βλέπετε τα έσοδα. Αναλαμβάνουμε κάθε λεπτομέρεια.',
                en: 'We take care of everything on-site — guest check-ins, cleaning, maintenance, emergencies. You monitor results from your phone, wherever you are.',
                ru: 'Мы заботимся обо всём на месте — заселение, уборка, обслуживание. Вы отслеживаете результаты с телефона, где бы вы ни были.',
                tr: 'Sahada her şeyi biz hallederiz — misafir karşılama, temizlik, bakım, acil durumlar. Sonuçları telefonunuzdan takip edersiniz, nerede olursanız olun.',
                bg: 'Ние се грижим за всичко на място — настаняване, почистване, поддръжка. Вие проследявате резултатите от телефона си, където и да сте.',
                he: 'אנחנו מטפלים בהכל בשטח — קבלת אורחים, ניקיון, תחזוקה, מקרי חירום. אתם עוקבים אחר התוצאות מהטלפון, בכל מקום.',
            },
            features: [
                { el: 'Διαχείριση Κρατήσεων & Επικοινωνία', en: 'Booking Management & Communication', ru: 'Управление бронированиями', tr: 'Rezervasyon Yönetimi & İletişim', bg: 'Управление на резервации', he: 'ניהול הזמנות ותקשורת' },
                { el: 'Επαγγελματικός Καθαρισμός & Ιματισμός', en: 'Professional Cleaning & Linen', ru: 'Профессиональная уборка', tr: 'Profesyonel Temizlik & Çamaşır', bg: 'Професионално почистване', he: 'ניקיון מקצועי ומצעים' },
                { el: 'Συντήρηση & Τεχνική Υποστήριξη', en: 'Maintenance & Technical Support', ru: 'Техническое обслуживание', tr: 'Bakım & Teknik Destek', bg: 'Поддръжка и техническа подкрепа', he: 'תחזוקה ותמיכה טכנית' },
                { el: 'Υποδοχή & Check-in', en: 'In-person Welcome & Check-in', ru: 'Личная встреча и заселение', tr: 'Karşılama & Check-in', bg: 'Посрещане и настаняване', he: 'קבלת פנים וצ\'ק-אין' },
                { el: 'Νομική & Φορολογική Συμβουλευτική', en: 'Legal & Tax Consultation', ru: 'Юридическая и налоговая поддержка', tr: 'Hukuki & Vergi Danışmanlığı', bg: 'Правна и данъчна консултация', he: 'ייעוץ משפטי ומס' },
                { el: 'Ιστοσελίδα Απευθείας Κρατήσεων (0% Προμήθεια)', en: 'Direct Booking Website (0% Commission)', ru: 'Сайт прямого бронирования', tr: 'Doğrudan Rezervasyon Sitesi', bg: 'Уебсайт за директни резервации', he: 'אתר הזמנות ישירות' },
            ],
            cta: { el: 'Μάθετε περισσότερα', en: 'Learn More', ru: 'Подробнее', tr: 'Daha Fazla', bg: 'Научете повече', he: 'למידע נוסף' },
            href: `/${lang}/management`,
            image: '/full_mgmt.webp',
        },
        digital: {
            title: { el: 'Digital Διαχείριση', en: 'Digital Management', ru: 'Цифровое управление', he: 'ניהול דיגיטלי', tr: 'Dijital Yönetim', bg: 'Дигитално управление' },
            description: {
                el: 'Η στρατηγική μας, στα χέρια σας. Ιδανικό για ιδιοκτήτες σε όλη την Ελλάδα που θέλουν να αυξήσουν τις κρατήσεις τους.',
                en: 'For owners across Greece. Maximize your revenue with our expert digital strategy.',
                ru: 'Для владельцев по всей Греции. Максимизируйте доход с нашей экспертной стратегией.',
                tr: 'Yunanistan genelindeki mülk sahipleri için. Uzman dijital stratejimizle gelirinizi maksimize edin.',
                bg: 'За собственици в цяла Гърция. Максимизирайте приходите с нашата стратегия.',
                he: 'לבעלי נכסים בכל יוון. מקסימו הכנסות עם האסטרטגיה הדיגיטלית שלנו.',
            },
            features: [
                { el: 'Δημιουργία & Βελτιστοποίηση Αγγελίας', en: 'Listing Creation & Optimization', ru: 'Создание и оптимизация объявлений', tr: 'İlan Oluşturma & Optimizasyon', bg: 'Създаване и оптимизация на обяви', he: 'יצירת מודעה ואופטימיזציה' },
                { el: 'Δυναμική Τιμολόγηση', en: 'Dynamic Pricing Strategy', ru: 'Динамическое ценообразование', tr: 'Dinamik Fiyatlandırma', bg: 'Динамично ценообразуване', he: 'תמחור דינמי' },
                { el: '24/7 Επικοινωνία Επισκεπτών', en: '24/7 Guest Communication', ru: 'Общение с гостями 24/7', tr: '7/24 Misafir İletişimi', bg: '24/7 Комуникация с гости', he: 'תקשורת 24/7 עם אורחים' },
                { el: 'Συγχρονισμός Ημερολογίων', en: 'Calendar Synchronization', ru: 'Синхронизация календарей', tr: 'Takvim Senkronizasyonu', bg: 'Синхронизация на календара', he: 'סנכרון יומנים' },
                { el: 'Αναφορές Απόδοσης', en: 'Monthly Performance Reports', ru: 'Ежемесячные отчёты', tr: 'Aylık Performans Raporları', bg: 'Месечни отчети', he: 'דוחות ביצועים חודשיים' },
                { el: 'Ιστοσελίδα Απευθείας Κρατήσεων (0% Προμήθεια)', en: 'Direct Booking Website (0% Commission)', ru: 'Сайт прямого бронирования', tr: 'Doğrudan Rezervasyon Sitesi', bg: 'Уебсайт за директни резервации', he: 'אתר הזמנות ישירות' },
            ],
            cta: { el: 'Ξεκινήστε Digital', en: 'Start Digital', ru: 'Начать Digital', tr: 'Dijital Başlayın', bg: 'Стартирайте Digital', he: 'התחילו דיגיטלי' },
            href: `/${lang}/digital`,
            image: '/Digital_mgmt.webp',
        }
    };

    return (
        <section className="py-20 md:py-28 bg-white overflow-hidden">
            <div className="container">

                {/* Asymmetric header — Right aligned */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                    <div className="md:max-w-lg">
                        <span className="editorial-rule editorial-rule--accent mb-6 block" />
                        <h2 className="text-5xl md:text-7xl font-serif tracking-[-0.03em]">{getLocalized(sectionTitle, lang)}</h2>
                    </div>
                    <div className="md:max-w-sm md:text-right">
                        <p className="text-[var(--color-neutral-500)] text-base leading-relaxed">{getLocalized(sectionSubtitle, lang)}</p>
                    </div>
                </div>

                {/* Tabs — Left aligned, not centered */}
                <div className="mb-12">
                    <div className="inline-flex bg-[var(--color-neutral-100)] rounded-full p-1 relative">
                        {(['full', 'digital'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "relative z-10 px-8 py-3 rounded-full text-sm uppercase tracking-[0.15em] font-medium transition-colors duration-300",
                                    activeTab === tab ? "text-white" : "text-[var(--color-neutral-500)] hover:text-[var(--color-text)]"
                                )}
                            >
                                {content[tab].title[lang] || content[tab].title['en']}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[var(--color-accent)] rounded-full -z-10"
                                        style={{ boxShadow: 'var(--shadow-accent-md)' }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area — Asymmetric layout */}
                <div className="max-w-6xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 items-center"
                        >
                            {/* Visual Side — Larger proportion */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                                style={{ boxShadow: 'var(--shadow-dark)' }}>
                                <Image
                                    src={content[activeTab].image}
                                    alt={getLocalized(content[activeTab].title, lang)}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-105"
                                />
                                {/* Brand-tinted hover overlay */}
                                <div className="absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/10 transition-colors duration-500" />
                            </div>

                            {/* Text Side */}
                            <div>
                                <h3 className="text-3xl md:text-4xl font-serif mb-4 tracking-[-0.02em]">
                                    {content[activeTab].title[lang] || content[activeTab].title['en']}
                                </h3>
                                <p className="text-[var(--color-neutral-500)] mb-8 leading-relaxed">
                                    {getLocalized(content[activeTab].description, lang)}
                                </p>

                                <ul className="space-y-4 mb-10">
                                    {content[activeTab].features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="bg-[var(--color-warm)]/10 p-1 rounded-full text-[var(--color-warm)] mt-0.5 flex-shrink-0">
                                                <Check size={13} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm">{getLocalized(feature, lang)}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={content[activeTab].href}
                                    className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-bold border-b border-[var(--color-text)] pb-1 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all group"
                                >
                                    {getLocalized(content[activeTab].cta, lang)}
                                    <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
