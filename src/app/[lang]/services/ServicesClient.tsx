'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import Image from 'next/image';
import { Locale } from '@/i18n-config';
import { Check } from 'lucide-react';

const content = {
    title: { el: 'Υπηρεσίες', en: 'Our Services', ru: 'Наши услуги', tr: 'Hizmetlerimiz', bg: 'Нашите услуги', he: 'השירותים שלנו' },
    subtitle: {
        el: 'Δύο επίπεδα υπηρεσίας, ένας στόχος: η μέγιστη απόδοση του ακινήτου σας.',
        en: 'Two tiers of service, one goal: maximizing your property\'s potential.',
        ru: 'Два уровня обслуживания, одна цель: максимизация потенциала вашей недвижимости.',
        tr: 'İki hizmet seviyesi, tek bir hedef: mülkünüzün potansiyelini maksimize etmek.',
        bg: 'Две нива на обслужване, една цел: максимизиране на потенциала на вашия имот.',
        he: 'שתי רמות שירות, מטרה אחת: למקסם את הפוטנציאל של הנכס שלכם.',
    },
};

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

function FAQAccordion({ items, lang }: { items: { q: Record<string, string>; a: Record<string, string> }[]; lang: string }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <div className="divide-y divide-[var(--color-neutral-200)]">
            {items.map((item, idx) => (
                <div key={idx}>
                    <button
                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        className="w-full flex items-center justify-between py-6 text-left group"
                    >
                        <span className="text-base md:text-lg font-serif tracking-[-0.02em] pr-8 group-hover:text-[var(--color-accent)] transition-colors">
                            {getLocalized(item.q, lang)}
                        </span>
                        <motion.div
                            animate={{ rotate: openIdx === idx ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                        >
                            <ChevronDown size={18} className="text-[var(--color-neutral-400)]" />
                        </motion.div>
                    </button>
                    <AnimatePresence>
                        {openIdx === idx && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                            >
                                <p className="pb-6 text-[var(--color-neutral-500)] leading-relaxed max-w-2xl">
                                    {getLocalized(item.a, lang)}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

export default function ServicesClient({ lang }: { lang: Locale }) {

    const steps = [
        {
            num: '01',
            title: { el: 'Αξιολόγηση', en: 'Consultation', ru: 'Консультация', tr: 'Danışma', bg: 'Консултация', he: 'ייעוץ' },
            desc: { el: 'Δωρεάν εκτίμηση του ακινήτου σας και πρόταση στρατηγικής.', en: 'Free property assessment and tailored strategy proposal. We analyze your market, competition, and revenue potential.', ru: 'Бесплатная оценка и индивидуальная стратегия. Мы анализируем рынок и потенциал дохода.', tr: 'Ücretsiz mülk değerlendirmesi ve özel strateji önerisi. Pazarı, rekabeti ve gelir potansiyelini analiz ediyoruz.', bg: 'Безплатна оценка на имота и индивидуална стратегия. Анализираме пазара и потенциала.', he: 'הערכת נכס חינם והצעת אסטרטגיה מותאמת. אנחנו מנתחים את השוק והפוטנציאל.' },
            img: '/services-step-1.webp',
        },
        {
            num: '02',
            title: { el: 'Προετοιμασία', en: 'Onboarding', ru: 'Подготовка', tr: 'Hazırlık', bg: 'Подготовка', he: 'הכנה' },
            desc: { el: 'Φωτογράφιση, δημιουργία αγγελίας, ρύθμιση πλατφορμών.', en: 'Professional photography, listing creation, platform setup, and pricing calibration. Your property goes live within days.', ru: 'Профессиональная фотосъёмка, создание объявлений, настройка платформ. Запуск за несколько дней.', tr: 'Profesyonel fotoğrafçılık, ilan oluşturma, platform kurulumu ve fiyat kalibrasyonu. Mülkünüz günler içinde yayına alınır.', bg: 'Професионална фотография, създаване на обява, настройка на платформи. Имотът ви е онлайн за дни.', he: 'צילום מקצועי, יצירת מודעה, הגדרת פלטפורמות. הנכס שלכם עולה לאוויר תוך ימים.' },
            img: '/services-step-2.webp',
        },
        {
            num: '03',
            title: { el: 'Έναρξη Κρατήσεων', en: 'Go Live', ru: 'Запуск', tr: 'Yayına Alın', bg: 'На живо', he: 'השקה' },
            desc: { el: 'Λαμβάνετε κρατήσεις και παρακολουθείτε τα αποτελέσματα.', en: 'Start receiving bookings while we handle everything. Track performance in real-time through your owner portal.', ru: 'Принимайте бронирования, пока мы заботимся обо всём. Следите за результатами через портал.', tr: 'Biz her şeyi hallederken siz rezervasyon almaya başlayın. Sahip portalı üzerinden performansı gerçek zamanlı takip edin.', bg: 'Получавайте резервации, докато ние се грижим за всичко. Проследявайте резултатите в реално време.', he: 'התחילו לקבל הזמנות בזמן שאנחנו מטפלים בהכל. עקבו אחר ביצועים בזמן אמת.' },
            img: '/services-step-3.webp',
        },
    ];

    const services = {
        full: {
            label: { el: 'Πλήρης Διαχείριση', en: 'Full Management', ru: 'Полное управление', tr: 'Tam Yönetim', bg: 'Пълно управление', he: 'ניהול מלא' },
            desc: { el: 'Η πλήρης διαχείριση. Ο ιδιοκτήτης δεν ασχολείται με τίποτα.', en: 'The complete solution. We handle every detail so you don\'t have to.', ru: 'Полное решение. Мы занимаемся всем.', tr: 'Eksiksiz çözüm. Her detayla biz ilgileniyoruz.', bg: 'Пълно решение. Ние се грижим за всичко.', he: 'הפתרון המלא. אנחנו מטפלים בכל פרט.' },
            commission: '20%',
            features: [
                { el: 'Διαχείριση Κρατήσεων', en: 'Booking Management', ru: 'Управление бронированиями', tr: 'Rezervasyon Yönetimi', bg: 'Управление на резервации', he: 'ניהול הזמנות' },
                { el: 'Δυναμική Τιμολόγηση', en: 'Dynamic Pricing', ru: 'Динамическое ценообразование', tr: 'Dinamik Fiyatlandırma', bg: 'Динамично ценообразуване', he: 'תמחור דינמי' },
                { el: '24/7 Επικοινωνία Επισκεπτών', en: '24/7 Guest Communication', ru: 'Круглосуточная связь', tr: '7/24 Misafir İletişimi', bg: '24/7 Комуникация', he: 'תקשורת 24/7' },
                { el: 'Επαγγελματικός Καθαρισμός', en: 'Professional Cleaning', ru: 'Профессиональная уборка', tr: 'Profesyonel Temizlik', bg: 'Професионално почистване', he: 'ניקיון מקצועי' },
                { el: 'Ιματισμός & Consumables', en: 'Linen & Consumables', ru: 'Бельё и расходники', tr: 'Çamaşır & Sarf Malzemeleri', bg: 'Спално бельо и консумативи', he: 'מצעים ומתכלים' },
                { el: 'Check-in / Check-out', en: 'In-Person Check-in/out', ru: 'Личный check-in/out', tr: 'Yüz Yüze Giriş/Çıkış', bg: 'Лично настаняване', he: 'קבלת פנים אישית' },
                { el: 'Συντήρηση & Επισκευές', en: 'Maintenance & Repairs', ru: 'Обслуживание и ремонт', tr: 'Bakım & Onarım', bg: 'Поддръжка и ремонт', he: 'תחזוקה ותיקונים' },
                { el: 'Φωτογράφιση Ακινήτου', en: 'Property Photography', ru: 'Фотосъёмка', tr: 'Profesyonel Fotoğrafçılık', bg: 'Професионална фотография', he: 'צילום מקצועי' },
                { el: 'Νομική Υποστήριξη', en: 'Legal Support', ru: 'Юридическая поддержка', tr: 'Hukuki Destek', bg: 'Правна подкрепа', he: 'תמיכה משפטית' },
                { el: 'Owner Portal', en: 'Owner Portal Access', ru: 'Доступ к порталу', tr: 'Sahip Portalı Erişimi', bg: 'Достъп до портал', he: 'גישה לפורטל' },
                { el: 'Website Απευθείας Κρατήσεων (0% προμήθεια)', en: 'Direct Booking Website (0% commission)', ru: 'Сайт прямого бронирования', tr: 'Doğrudan Rezervasyon Sitesi', bg: 'Уεбсайт за директни резервации', he: 'אתר הזמנות ישירות' },
            ],
            recommended: true,
        },
        digital: {
            label: { el: 'Digital Διαχείριση', en: 'Digital Management', ru: 'Цифровое управление', tr: 'Dijital Yönetim', bg: 'Дигитално управление', he: 'ניהול דיגיטלי' },
            desc: { el: 'Για τον ιδιοκτήτη που θέλει να γλιτώσει τα μηνύματα και το άγχος της επικοινωνίας.', en: 'For owners who want to save time on guest messaging and stress-free operations.', ru: 'Для владельцев, которые хотят сэкономить время.', tr: 'Misafir mesajlarından ve opersyonel stresten kurtulmak isteyen mülk sahipleri için.', bg: 'За собственици, които искат да спестят време.', he: 'לבעלים שרוצים לחסוך זמן בתקשורת.' },
            commission: '12%',
            features: [
                { el: 'Διαχείριση Κρατήσεων', en: 'Booking Management', ru: 'Управление бронированиями', tr: 'Rezervasyon Yönetimi', bg: 'Управление на резервации', he: 'ניהול הזמנות' },
                { el: 'Δυναμική Τιμολόγηση', en: 'Dynamic Pricing', ru: 'Динамическое ценообразование', tr: 'Dinamik Fiyatlandırma', bg: 'Динамично ценообразуване', he: 'תמחור דינמי' },
                { el: '24/7 Επικοινωνία Επισκεπτών', en: '24/7 Guest Communication', ru: 'Круглосуточная связь', tr: '7/24 Misafir İletişimi', bg: '24/7 Комуникация', he: 'תקשורת 24/7' },
                { el: 'Δημιουργία Αγγελίας', en: 'Listing Creation & SEO', ru: 'Создание объявления', tr: 'İlan Oluşturma & SEO', bg: 'Създаване на обява', he: 'יצירת מודעה' },
                { el: 'Συγχρονισμός Ημερολογίων', en: 'Calendar Sync', ru: 'Синхронизация календаря', tr: 'Takvim Senkronizasyonu', bg: 'Синхронизация на календари', he: 'סנכרון יומנים' },
                { el: 'Αναφορές Απόδοσης', en: 'Performance Reports', ru: 'Отчёты о производительности', tr: 'Performans Raporları', bg: 'Отчети за представяне', he: 'דוחות ביצועים' },
                { el: 'Owner Portal', en: 'Owner Portal Access', ru: 'Доступ к порталу', tr: 'Sahip Portalı Erişimi', bg: 'Достъп до портал', he: 'גישה לפורטל' },
                { el: 'Website Απευθείας Κρατήσεων (0% προμήθεια)', en: 'Direct Booking Website (0% commission)', ru: 'Сайт прямого бронирования', tr: 'Doğrudan Rezervasyon Sitesi', bg: 'Уεбсайт за директни резервации', he: 'אתר הזמנות ישירות' },
            ],
            recommended: false,
        },
    };

    const faqs = [
        {
            q: { el: 'Ποια προμήθεια χρεώνετε;', en: 'What commission do you charge?', ru: 'Какую комиссию вы берёте?', tr: 'Ne kadar komisyon alıyorsunuz?', bg: 'Каква комисиона вземате?', he: 'מה העמלה שאתם גובים?' },
            a: { el: 'Η πλήρης διαχείριση είναι 20% επί των εσόδων, η digital 12%. Χωρίς κρυφές χρεώσεις.', en: 'Full Management is 20% of revenue, Digital is 12%. No hidden fees, no setup costs. You only pay when you earn.', ru: 'Полное управление — 20% от дохода, цифровое — 12%. Без скрытых платежей.', tr: 'Tam Yönetim gelirin %20\'si, Dijital %12\'sidir. Gizli ücret yoktur.', bg: 'Пълно управление — 20% от приходите, дигитално — 12%. Без скрити такси.', he: 'ניהול מלא 20% מההכנסות, דיגיטלי 12%. ללא עמלות נסתרות.' },
        },
        {
            q: { el: 'Μπορώ να αλλάξω πακέτο;', en: 'Can I switch between plans?', ru: 'Можно ли менять тариф?', tr: 'Planlar arasında geçiş yapabilir miyim?', bg: 'Мога ли да сменя плана?', he: 'אפשר לעבור בין תוכניות?' },
            a: { el: 'Φυσικά. Μπορείτε να αναβαθμιστείτε ή να υποβαθμιστείτε ανά πάσα στιγμή χωρίς ποινές.', en: 'Absolutely. You can upgrade or downgrade at any time with no penalties. We\'ll handle the transition seamlessly.', ru: 'Конечно. Повышение или понижение — в любое время без штрафов.', tr: 'Elbette. İstediğiniz zaman yükseltme veya düşürme yapabilirsiniz.', bg: 'Разбира се. Можете да надградите или понижите по всяко време.', he: 'בוודאי. ניתן לשדרג או לשנמך בכל עת ללא קנסות.' },
        },
        {
            q: { el: 'Πόσο γρήγορα θα ξεκινήσω;', en: 'How quickly can I get started?', ru: 'Как быстро можно начать?', tr: 'Ne kadar hızlı başlayabilirim?', bg: 'Колко бързо мога да започна?', he: 'כמה מהר אפשר להתחיל?' },
            a: { el: 'Αν το σπίτι σας είναι έτοιμο να υποδεχτεί επισκέπτες, μπορούμε να είμαστε έτοιμοι σε 5–7 εργάσιμες ημέρες.', en: 'If your property is guest-ready, we can be live within 5–7 business days. We handle photography, listing creation, platform setup, and pricing calibration — you just hand us the keys.', ru: 'Если объект готов — мы запустим его за 5–7 рабочих дней.', tr: 'Mülkünüz misafir için hazırsa, 5-7 iş günü içinde yayına alabiliriz.', bg: 'Ако имотът ви е готов, можем да стартираме за 5-7 работни дни.', he: 'אם הנכס מוכן לאורחים, נוכל להתחיל תוך 5-7 ימי עסקים.' },
        },
        {
            q: { el: 'Πώς φορολογούνται τα εισοδήματα;', en: 'How is short-term rental income taxed?', ru: 'Как облагается доход от аренды?', tr: 'Kısa süreli kira geliri nasıl vergilendirilir?', bg: 'Как се облага доходът от краткосрочен наем?', he: 'כיצד ממוסה הכנסה מהשכרה לטווח קצר?' },
            a: { el: 'Τα εισοδήματα φορολογούνται κλιμακωτά: 15% για εισοδήματα έως 12.000€, 25% από 12.001€ έως 24.000€, 35% από 24.001€ έως 35.000€ και 45% για εισοδήματα πάνω από 35.000€. Στην ΑΑΔΕ δηλώνεται το συνολικό ποσό χρέωσης, συμπεριλαμβανομένης της προμήθειας πλατφόρμας.', en: 'Short-term rental income is taxed in tiers: 15% up to €12K, 25% from €12K–24K, 35% from €24K–35K, and 45% for €35K+. You declare the total booking amount to AADE, including the platform commission.', ru: 'Ставки: 0–12 000€ → 15%, 12–24 000€ → 25%, 24–35 000€ → 35%, 35 000€+ → 45%.', tr: 'Kısa süreli kira geliri: 0-12.000€ → %15, 12-24.000€ → %25, 24-35.000€ → %35, 35.000€+ → %45 oranında vergilendirilir.', bg: 'Доходите се облагат: 0-12 000€ → 15%, 12-24 000€ → 25%, 24-35 000€ → 35%, 35 000€+ → 45%.', he: 'הכנסות מושכרות: 0-12K€ → 15%, 12-24K€ → 25%, 24-35K€ → 35%, 35K€+ → 45%.' },
        },
        {
            q: { el: 'Χρειάζομαι ασφάλεια;', en: 'Do I need insurance?', ru: 'Нужна ли страховка?', tr: 'Sigortaya ihtiyacım var mı?', bg: 'Нужна ли ми е застраховка?', he: 'האם אני צריך ביטוח?' },
            a: { el: 'Ναι, η ασφάλιση αστικής ευθύνης για το ακίνητο είναι πλέον υποχρεωτική από το ελληνικό κράτος για τη βραχυχρόνια μίσθωση. Πλατφόρμες όπως η Airbnb προσφέρουν κάλυψη (AirCover), αλλά μια αποκλειστική ασφάλιση ακινήτου παρέχει την πληρέστερη προστασία.', en: 'Yes, liability insurance is now mandatory by the Greek state for short-term rentals. While platforms like Airbnb offer coverage (AirCover), a dedicated rental insurance policy provides more comprehensive protection and compliance.', ru: 'Да, страхование теперь обязательно. Airbnb предлагает AirCover, но отдельная страховка обеспечивает более полную защиту.', tr: 'Evet, artık sigorta zorunludur. Airbnb AirCover sunar, ancak özel sigorta daha kapsamlı koruma sağlar.', bg: 'Да, застраховката вече е задължителна. Airbnb предлага AirCover, но частната застраховка осигурява по-добра защита.', he: 'כן, הביטוח כיום חובה. Airbnb מציעה AirCover, אך ביטוח ייעודי מספק הגנה מקיפה יותר.' },
        },
        {
            q: { el: 'Μπορώ να το χρησιμοποιήσω και εγώ;', en: 'Can I still use my property?', ru: 'Могу ли я пользоваться своей недвижимостью?', tr: 'Mülkümü kendim kullanabilir miyim?', bg: 'Мога ли да ползвам имота си?', he: 'אפשר עדיין להשתמש בנכס?' },
            a: { el: 'Φυσικά! Μπλοκάρετε τις ημερομηνίες που θέλετε μέσω του owner portal. Φροντίστε μόνο να μην υπάρχει ήδη κράτηση.', en: 'Of course! Block off any dates through the owner portal — just make sure there\'s no existing booking for those dates. Your property, your schedule. We\'ll optimize pricing around your availability.', ru: 'Конечно! Блокируйте даты через портал владельца. Мы оптимизируем цены вокруг вашего расписания.', tr: 'Tabii ki! Sahip portalı üzerinden istediğiniz tarihleri engelleyin. Müsaitliğinize göre fiyatlandırmayı optimize ederiz.', bg: 'Разбира се! Блокирайте дати през портала. Ние оптимизираме цените около наличността ви.', he: 'כמובן! חסמו תאריכים דרך הפורטל. אנחנו נייעל את התמחור סביב הזמינות שלכם.' },
        },
        {
            q: { el: 'Πώς λειτουργεί η συνεργασία;', en: 'How does the co-hosting model work?', ru: 'Как работает модель совместного управления?', tr: 'Ortak ev sahipliği modeli nasıl çalışır?', bg: 'Как работи моделът на съвместно управление?', he: 'איך עובד מודל הניהול המשותף?' },
            a: { el: 'Η Homevision προστίθεται ως συνδιαχειρίστρια (co-host) στις πλατφόρμες. Εσείς παραμένετε ο ιδιοκτήτης με πλήρη πρόσβαση.', en: 'Homevision is added as a co-host on booking platforms. You remain the owner with full access. We handle the day-to-day operations while you maintain complete visibility through the owner portal.', ru: 'Homevision добавляется как со-хост на платформах. Вы остаётесь владельцем с полным доступом.', tr: 'Homevision, rezervasyon platformlarında ortak ev sahibi olarak eklenir. Siz tam erişimle mülk sahibi olarak kalırsınız.', bg: 'Homevision се добавя като съ-домакин в платформите. Вие оставате собственик с пълен достъп.', he: 'Homevision מתווסף כמארח משותף בפלטפורמות. אתם נשארים הבעלים עם גישה מלאה.' },
        },
        {
            q: { el: 'Πρέπει το σπίτι μου να είναι καινούργιο;', en: 'Does my property need to be new?', ru: 'Объект должен быть новым?', tr: 'Mülkümün yeni olması mı gerekiyor?', bg: 'Трябва ли имотът ми да е нов?', he: 'האם הנכס צריך להיות חדש?' },
            a: { el: 'Όχι απαραίτητα — αρκεί να είναι καθαρό και σε καλή κατάσταση. Ένα σπίτι με χαρακτήρα μπορεί να ξεχωρίσει. Στην ανταγωνιστική αγορά βραχυχρόνων μισθώσεων, ο κανόνας είναι: όσο περισσότερες παροχές, τόσο το καλύτερο.', en: 'Not at all — it just needs to be clean and well-maintained. A property with character can stand out beautifully. In today\'s competitive market, the rule is: the more amenities and quality touches you offer, the better your results.', ru: 'Совсем нет — достаточно чистоты и хорошего состояния. Чем больше удобств, тем лучше результат.', tr: 'Hayır — temiz ve bakımlı olması yeterlidir. Karakter sahibi bir mülk öne çıkabilir.', bg: 'Не — достатъчно е да е чисто и поддържано. Колкото повече удобства, толкова по-добре.', he: 'בכלל לא — רק צריך להיות נקי ומתוחזק. ככל שיש יותר שירותים, כך התוצאות טובות יותר.' },
        },
        {
            q: { el: 'Πόσο γρήγορα απαντάτε στους επισκέπτες;', en: 'How fast do you respond to guests?', ru: 'Как быстро вы отвечаете гостям?', tr: 'Misafirlere ne kadar hızlı yanıt veriyorsunuz?', bg: 'Колко бързо отговаряте на гостите?', he: 'כמה מהר אתם עונים לאורחים?' },
            a: { el: 'Εντός 30 λεπτών, 24 ώρες το 24ωρο. Από πριν κάνουν κράτηση μέχρι μετά την αναχώρησή τους.', en: 'Within 30 minutes, 24/7. From pre-booking inquiries through post-checkout follow-ups. We maintain communication from before guests book until after they leave.', ru: 'В течение 30 минут, круглосуточно. От запросов до послепроживания.', tr: '30 dakika içinde, 7/24. Rezervasyon öncesinden çıkış sonrasına kadar.', bg: 'До 30 минути, 24/7. От запитвания до след напускане.', he: 'תוך 30 דקות, 24/7. מפניות לפני הזמנה ועד מעקב אחרי יציאה.' },
        },
        {
            q: { el: 'Πώς γίνεται το check-in;', en: 'How does check-in work?', ru: 'Как проходит заселение?', tr: 'Giriş işlemi nasıl yapılır?', bg: 'Как се извършва настаняването?', he: 'איך עובד הצ\'ק-אין?' },
            a: { el: 'Για ακίνητα στο κέντρο, οι επισκέπτες προτιμούν αυτοεξυπηρέτηση με lockbox ή smart lock. Για βίλες, η προσωπική υποδοχή είναι ενδεδειγμένη. Προσαρμοζόμαστε στις δικές σας προτιμήσεις.', en: 'For city-center apartments, guests typically prefer self-check-in with lockbox or smart lock. For villas, personal welcome is recommended. We adapt to your preferences and property type.', ru: 'Для квартир — self-check-in с кодовым замком. Для вилл — личная встреча. Мы адаптируемся к вашим предпочтениям.', tr: 'Şehir merkezi daireleri için akıllı kilit ile kendi kendine giriş. Villalar için kişisel karşılama yapılır.', bg: 'За апартаменти — самостоятелно настаняване с кодова ключалка. За вили — лично посрещане.', he: 'לדירות בעיר — צ\'ק-אין עצמי עם מנעול חכם. לווילות — קבלת פנים אישית.' },
        },
        {
            q: { el: 'Πώς πληρώνομαι;', en: 'How and when do I get paid?', ru: 'Как и когда я получаю деньги?', tr: 'Ne zaman ve nasıl ödeme alırım?', bg: 'Как и кога получавам плащане?', he: 'מתי ואיך מקבלים תשלום?' },
            a: { el: 'Τα χρήματα κατατίθενται στον λογαριασμό σας 1–2 εργάσιμες μέρες μετά τη μεταφορά από την πλατφόρμα. Μετά από κάθε κράτηση λαμβάνετε αναλυτική αναφορά.', en: 'Funds are deposited to your bank account 1–2 business days after the platform sends the payout. After each booking, you receive a detailed revenue report via email plus 24/7 access through the owner portal.', ru: 'Средства зачисляются на ваш счёт через 1-2 рабочих дня после выплаты платформой.', tr: 'Fonlar, platform ödemeyi gönderdikten sonra 1-2 iş günü içinde hesabınıza yatırılır.', bg: 'Средствата се превеждат по сметката ви 1-2 работни дни след плащането от платформата.', he: 'הכספים מועברים לחשבונכם תוך 1-2 ימי עסקים לאחר תשלום הפלטפורמה.' },
        },
        {
            q: { el: 'Τι γίνεται με τις ζημιές;', en: 'What about property damage?', ru: 'Что насчёт ущерба имуществу?', tr: 'Mülk hasarı durumunda ne olur?', bg: 'Какво става при щети на имота?', he: 'מה לגבי נזק לנכס?' },
            a: { el: 'Κάθε κράτηση καλύπτεται από την ασφάλεια της πλατφόρμας. Τεκμηριώνουμε την κατάσταση του ακινήτου και διαχειριζόμαστε εμείς τις αξιώσεις.', en: 'Every booking is covered by platform damage protection. We document property condition before and after each stay and manage all claims on your behalf.', ru: 'Каждое бронирование покрыто защитой платформы. Мы документируем состояние и управляем претензиями.', tr: 'Her rezervasyon platform hasar koruması kapsamındadır. Mülk durumunu belgeleyip tüm talepleri sizin adınıza yönetiriz.', bg: 'Всяка резервация е покрита от защита на платформата. Документираме състоянието и управляваме претенциите.', he: 'כל הזמנה מכוסה על ידי הגנת הפלטפורמה. אנחנו מתעדים ומנהלים תביעות בשמכם.' },
        },
    ];

    const testimonial = {
        quote: {
            el: 'Μετά από 6 μήνες με το Homevision, τα έσοδά μου αυξήθηκαν κατά 40%. Η ομάδα είναι επαγγελματική και η διαφάνεια εντυπωσιακή.',
            en: 'After 6 months with Homevision, my revenue increased by 40%. The team is incredibly professional and the transparency through the owner portal is remarkable.',
            ru: 'За 6 месяцев с Homevision мой доход вырос на 40%. Команда невероятно профессиональная, а прозрачность поражает.',
            tr: 'Homevision ile 6 ay sonra gelirim %40 arttı. Ekip inanılmaz profesyonel ve sahip portalı üzerinden sağlanan şeffaflık olağanüstü.',
            bg: 'След 6 месеца с Homevision приходите ми се увеличиха с 40%. Екипът е невероятно професионален.',
            he: 'אחרי 6 חודשים עם Homevision, ההכנסות שלי עלו ב-40%. הצוות מקצועי להפליא והשקיפות יוצאת דופן.',
        },
        author: 'Nikos K.',
        role: { el: 'Ιδιοκτήτης 3 ακινήτων, Θεσσαλονίκη', en: 'Owner of 3 properties, Thessaloniki', ru: 'Владелец 3 объектов, Салоники', tr: '3 mülk sahibi, Selanik', bg: 'Собственик на 3 имота, Солун', he: 'בעלים של 3 נכסים, סלוניקי' },
    };

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} theme="light" />

            {/* Hero Intro */}
            <section className="pt-40 pb-20 md:pt-48 md:pb-28">
                <div className="container">
                    <div className="max-w-3xl">
                        <span className="editorial-rule editorial-rule--accent mb-6 block" />
                        <h1 className="text-5xl md:text-8xl font-serif mb-6 tracking-[-0.03em] leading-[1.1] md:leading-[0.95]">
                            {getLocalized(content.title, lang)}
                        </h1>
                        <p className="text-lg md:text-xl text-[var(--color-neutral-500)] leading-relaxed max-w-4xl font-light">
                            {getLocalized(content.subtitle, lang)}
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="pb-20 md:pb-32">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                        <div className="md:max-w-lg">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium block mb-4">
                                {({ el: 'Πώς Λειτουργεί', en: 'How It Works', ru: 'Как это работает', tr: 'Nasıl Çalışır', bg: 'Как работи', he: 'איך זה עובד' }[lang] || 'How It Works')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif tracking-[-0.03em]">
                                {({ el: 'Τρία Απλά Βήματα', en: 'Three Simple Steps', ru: 'Три простых шага', tr: 'Üç Basit Adım', bg: 'Три прости стъпки', he: 'שלושה צעדים פשוטים' }[lang] || 'Three Simple Steps')}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="group">
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                                    <Image
                                        src={step.img}
                                        alt={getLocalized(step.title, lang)}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <span className="absolute top-4 left-4 text-white/20 text-6xl font-serif font-light">
                                        {step.num}
                                    </span>
                                </div>
                                <h3 className="text-xl font-serif mb-2 tracking-[-0.02em]">
                                    {getLocalized(step.title, lang)}
                                </h3>
                                <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed">
                                    {getLocalized(step.desc, lang)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Comparison */}
            <section className="py-20 md:py-32 bg-[var(--color-surface)]">
                <div className="container">
                    <div className="max-w-xl mb-16">
                        <span className="editorial-rule editorial-rule--accent mb-6 block" />
                        <h2 className="text-4xl md:text-5xl font-serif tracking-[-0.03em] mb-4">
                            {({ el: 'Επιλέξτε το Πακέτο σας', en: 'Choose Your Plan', ru: 'Выберите план', tr: 'Paketinizi Seçin', bg: 'Изберете план', he: 'בחרו תוכנית' }[lang] || 'Choose Your Plan')}
                        </h2>
                        <p className="text-[var(--color-neutral-500)] leading-relaxed">
                            {({ el: 'Και τα δύο πακέτα περιλαμβάνουν πρόσβαση στο owner portal.', en: 'Both plans include full owner portal access and dedicated account management.', ru: 'Оба плана включают доступ к порталу владельца.', tr: 'Her iki plan da sahip portalı erişimi içerir.', bg: 'И двата плана включват достъп до портала за собственици.', he: 'שתי התוכניות כוללות גישה לפורטל בעלים.' }[lang] || 'Both plans include full owner portal access and dedicated account management.')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        {Object.entries(services).map(([key, plan]) => (
                            <div
                                key={key}
                                className={`bg-white rounded-2xl p-8 md:p-10 border relative ${plan.recommended
                                    ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20'
                                    : 'border-[var(--color-neutral-200)]'
                                    }`}
                                style={plan.recommended ? { boxShadow: 'var(--shadow-accent-md)' } : {}}
                            >
                                {plan.recommended && (
                                    <span className="absolute -top-3 left-8 bg-[var(--color-accent)] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full">
                                        {({ el: 'Προτεινόμενο', en: 'Recommended', ru: 'Рекомендуем', tr: 'Önerilen', bg: 'Препоръчан', he: 'מומלץ' }[lang] || 'Recommended')}
                                    </span>
                                )}

                                <h3 className="text-2xl font-serif mb-2 tracking-[-0.02em]">
                                    {getLocalized(plan.label, lang)}
                                </h3>
                                <p className="text-sm text-[var(--color-neutral-500)] mb-4 leading-relaxed">
                                    {getLocalized(plan.desc, lang)}
                                </p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-serif text-[var(--color-accent)]">{plan.commission}</span>
                                    <span className="text-sm text-[var(--color-neutral-500)]">
                                        {({ el: 'προμήθεια', en: 'commission', ru: 'комиссия', tr: 'komisyon', bg: 'комисионна', he: 'עמלה' }[lang] || 'commission')}
                                    </span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="bg-[var(--color-accent)]/10 p-0.5 rounded-full text-[var(--color-accent)] mt-0.5 flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm text-[var(--color-neutral-600)]">
                                                {getLocalized(feature, lang)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={`/${lang}/contact`}
                                    className={`block text-center py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-bold transition-colors ${plan.recommended
                                        ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]'
                                        : 'border border-[var(--color-neutral-300)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                                        }`}
                                >
                                    {({ el: 'Ξεκινήστε', en: 'Get Started', ru: 'Начать', tr: 'Başlayın', bg: 'Стартирайте', he: 'התחילו' }[lang] || 'Get Started')}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-20 md:py-28 bg-[#0F0F0F] text-white grain-overlay">
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="block w-12 h-[1px] bg-[var(--color-accent)] opacity-50 mx-auto mb-8" />
                        <blockquote className="text-2xl md:text-3xl font-serif leading-[1.4] tracking-[-0.02em] mb-8">
                            &ldquo;{getLocalized(testimonial.quote, lang)}&rdquo;
                        </blockquote>
                        <div>
                            <span className="text-sm font-medium text-white/80">{testimonial.author}</span>
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
                                {getLocalized(testimonial.role, lang)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
                        <div>
                            <span className="editorial-rule editorial-rule--accent mb-6 block" />
                            <h2 className="text-4xl md:text-5xl font-serif tracking-[-0.03em] mb-4">
                                {({ el: 'Συχνές Ερωτήσεις', en: 'FAQ', ru: 'ЧаВО', tr: 'SSS', bg: 'ЧЗВ', he: 'שאלות נפוצות' }[lang] || 'FAQ')}
                            </h2>
                            <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed">
                                {({ el: 'Όλα όσα πρέπει να γνωρίζετε πριν ξεκινήσετε.', en: 'Everything you need to know before getting started.', ru: 'Всё, что нужно знать перед началом.', tr: 'Başlamadan önce bilmeniz gereken her şey.', bg: 'Всичко, което трябва да знаете преди да започнете.', he: 'כל מה שצריך לדעת לפני שמתחילים.' }[lang] || 'Everything you need to know before getting started.')}
                            </p>
                        </div>
                        <div>
                            <FAQAccordion items={faqs} lang={lang} />
                        </div>
                    </div>
                </div>
            </section>

            <CallToAction lang={lang} />
            <Footer lang={lang} />
        </main>
    );
}
