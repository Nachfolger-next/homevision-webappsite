'use client';

import { motion } from 'framer-motion';
import { Smartphone, Globe, ShieldCheck, BarChart3, Clock, MessageSquare } from 'lucide-react';
import { Locale } from '@/i18n-config';

const FEATURES = [
    {
        icon: Globe,
        title: { el: 'Παρουσία σε Πολλαπλά Κανάλια', en: 'Multi-Channel Presence', ru: 'Мультиканальное присутствие', tr: 'Çoklu Kanal Varlığı', bg: 'Многоканално присъствие', he: 'נוכחות רב-ערוצית' },
        desc: { el: 'Δημιουργία και βελτιστοποίηση της καταχώρησής σας σε Airbnb, Booking.com, VRBO και Expedia.', en: 'Creation and optimization of your listing on Airbnb, Booking.com, VRBO, and Expedia.', ru: 'Создание и оптимизация объявлений на Airbnb, Booking.com, VRBO и Expedia.', tr: 'Airbnb, Booking.com, VRBO ve Expedia üzerinde ilanınızın oluşturulması ve optimizasyonu.', bg: 'Създаване и оптимизация на обявата ви в Airbnb, Booking.com, VRBO и Expedia.', he: 'יצירה ואופטימיזציה של המודעה שלכם ב-Airbnb, Booking.com, VRBO ו-Expedia.' }
    },
    {
        icon: BarChart3,
        title: { el: 'Δυναμική Τιμολόγηση', en: 'Dynamic Pricing Strategy', ru: 'Динамическое ценообразование', tr: 'Dinamik Fiyatlandırma Stratejisi', bg: 'Динамично ценообразуване', he: 'אסטרטגיית תמחור דינמי' },
        desc: { el: 'Προηγμένοι αλγόριθμοι που προσαρμόζουν τις τιμές καθημερινά για μεγιστοποίηση της πληρότητας και των εσόδων.', en: 'Advanced algorithms that adjust prices daily to maximize occupancy and revenue.', ru: 'Алгоритмы ежедневной корректировки цен для максимизации загрузки и дохода.', tr: 'Doluluk ve geliri en üst düzeye çıkarmak için fiyatları günlük ayarlayan gelişmiş algoritmalar.', bg: 'Алгоритми, които коригират цените ежедневно за максимална заетост и приходи.', he: 'אלגוריתמים מתקדמים שמתאימים מחירים יומית למקסום תפוסה והכנסות.' }
    },
    {
        icon: MessageSquare,
        title: { el: '24/7 Επικοινωνία', en: '24/7 Guest Communication', ru: 'Круглосуточная связь', tr: '7/24 Misafir İletişimi', bg: '24/7 Комуникация с гости', he: 'תקשורת אורחים 24/7' },
        desc: { el: 'Άμεση απάντηση σε ερωτήματα επισκεπτών, διαχείριση κρατήσεων και επίλυση προβλημάτων όλο το 24ωρο.', en: 'Immediate response to guest inquiries, booking management, and issue resolution 24/7.', ru: 'Мгновенный ответ на запросы гостей, управление бронированиями и решение проблем 24/7.', tr: 'Misafir sorularına anında yanıt, rezervasyon yönetimi ve sorun çözümü 7/24.', bg: 'Незабавен отговор на запитванията на гостите 24/7.', he: 'מענה מיידי לפניות אורחים, ניהול הזמנות ופתרון בעיות 24/7.' }
    },
    {
        icon: ShieldCheck,
        title: { el: 'Έλεγχος Επισκεπτών', en: 'Guest Vetting', ru: 'Проверка гостей', tr: 'Misafir Doğrulaması', bg: 'Проверка на гости', he: 'סינון אורחים' },
        desc: { el: 'Αυστηρός έλεγχος προφίλ επισκεπτών για την ασφάλεια του ακινήτου σας.', en: 'Strict vetting of guest profiles to ensure the safety of your property.', ru: 'Строгая проверка профилей гостей для безопасности вашего объекта.', tr: 'Mülkünüzün güvenliğini sağlamak için misafir profillerinin titiz doğrulaması.', bg: 'Строга проверка на профилите на гостите за безопасността на имота ви.', he: 'בדיקת פרופילי אורחים קפדנית לבטיחות הנכס.' }
    },
    {
        icon: Smartphone,
        title: { el: 'Εφαρμογή Ιδιοκτήτη', en: 'Owner App Access', ru: 'Приложение владельца', tr: 'Sahip Uygulaması Erişimi', bg: 'Достъп до приложение', he: 'גישה לאפליקציית בעלים' },
        desc: { el: 'Παρακολουθήστε τις κρατήσεις και τα έσοδά σας σε πραγματικό χρόνο από το κινητό σας.', en: 'Track your bookings and revenue in real-time from your mobile device.', ru: 'Отслеживайте бронирования и доход в реальном времени с мобильного.', tr: 'Mobil cihazınızdan rezervasyonlarınızı ve gelirinizi gerçek zamanlı takip edin.', bg: 'Следете резервациите и приходите си в реално време от мобилното си устройство.', he: 'עקבו אחר הזמנות והכנסות בזמן אמת מהנייד.' }
    },
    {
        icon: Clock,
        title: { el: 'Συγχρονισμός Ημερολογίων', en: 'Calendar Sync', ru: 'Синхронизация календаря', tr: 'Takvim Senkronizasyonu', bg: 'Синхронизация на календари', he: 'סנכרון יומנים' },
        desc: { el: 'Αυτόματος συγχρονισμός για αποφυγή διπλοκρατήσεων σε όλες τις πλατφόρμες.', en: 'Automatic synchronization to prevent double bookings across all platforms.', ru: 'Автоматическая синхронизация для предотвращения двойных бронирований.', tr: 'Tüm platformlarda çift rezervasyonu önlemek için otomatik senkronizasyon.', bg: 'Автоматична синхронизация за предотвратяване на двойни резервации.', he: 'סנכרון אוטומטי למניעת הזמנות כפולות בכל הפלטפורמות.' }
    }
];

const getLocalized = (obj: any, lang: string) => obj[lang] || obj['en'];

export default function DigitalFeatures({ lang }: { lang: Locale }) {
    return (
        <section className="py-24 bg-white">
            <div className="container">
                <div className="max-w-3xl mb-16">
                    <span className="editorial-rule editorial-rule--accent mb-6 block" />
                    <h2 className="text-4xl md:text-5xl font-serif tracking-[-0.02em] mb-4">
                        {({ el: 'Όλα όσα προσφέρουμε', en: 'Everything we offer', ru: 'Всё, что мы предлагаем', tr: 'Sunduğumuz her şey', bg: 'Всичко, което предлагаме', he: 'כל מה שאנחנו מציעים' }[lang] || 'Everything we offer')}
                    </h2>
                    <p className="text-[var(--color-neutral-500)] text-lg">
                        {({ el: 'Μια ολοκληρωμένη digital λύση για να έχετε το κεφάλι σας ήσυχο.', en: 'A complete digital solution so you can have peace of mind.', ru: 'Комплексное цифровое решение для вашего спокойствия.', tr: 'Huzurunuz için eksiksiz bir dijital çözüm.', bg: 'Пълно дигитално решение за вашето спокойствие.', he: 'פתרון דיגיטלי מלא לשקט נפשי.' }[lang] || 'A complete digital solution so you can have peace of mind.')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-[var(--color-neutral-100)]/50 p-8 rounded-xl border border-transparent hover:border-[var(--color-neutral-200)] transition-colors group shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow text-[var(--color-accent)]">
                                <feature.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-serif mb-3 text-[var(--color-text)]">
                                {getLocalized(feature.title, lang)}
                            </h3>
                            <p className="text-sm leading-relaxed text-[var(--color-neutral-500)]">
                                {getLocalized(feature.desc, lang)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
