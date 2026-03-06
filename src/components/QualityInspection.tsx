'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    ChefHat,
    Bath,
    Sofa,
    TreePalm,
    Wifi,
    Shield,
    Star,
    Clock,
    CheckCircle2,
} from 'lucide-react';
import { Locale } from '@/i18n-config';

const getLocalized = (obj: any, lang: string) => obj[lang] || obj['en'] || '';

/* ── Animated Number Counter ── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 2000;
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, target]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
}

/* ── Inspection Data ── */
const categories = [
    {
        icon: ChefHat,
        title: { el: 'Κουζίνα', en: 'Kitchen', ru: 'Кухня', tr: 'Mutfak', bg: 'Кухня', he: 'מטבח' },
        points: [
            { el: 'Λειτουργικότητα συσκευών', en: 'Appliance functionality', ru: 'Функциональность бытовой техники', tr: 'Cihaz işlevselliği', bg: 'Функционалност на уредите', he: 'פונקציונליות מכשירי חשמל' },
            { el: 'Βαθύς καθαρισμός επιφανειών', en: 'Surface deep-clean', ru: 'Глубокая очистка поверхностей', tr: 'Yüzey derin temizlik', bg: 'Дълбоко почистване', he: 'ניקוי עמוק' },
            { el: 'Απογραφή σκευών', en: 'Utensil inventory', ru: 'Инвентаризация посуды', tr: 'Mutfak eşyası sayımı', bg: 'Инвентаризация на приборите', he: 'מלאי כלים' },
            { el: 'Ανεφοδιασμός προμηθειών', en: 'Supply restocking', ru: 'Пополнение запасов', tr: 'Malzeme yenileme', bg: 'Доставка на консумативи', he: 'חידוש מלאי אספקה' }
        ],
    },
    {
        icon: Bath,
        title: { el: 'Μπάνιο', en: 'Bathroom', ru: 'Ванная комната', tr: 'Banyo', bg: 'Баня', he: 'חדר אמבטיה' },
        points: [
            { el: 'Πρωτόκολλο απολύμανσης', en: 'Sanitization protocol', ru: 'Протокол дезинфекции', tr: 'Sanitasyon protokolü', bg: 'Протокол за дезинфекция', he: 'פרוטוקול חיטוי' },
            { el: 'Τοποθέτηση ειδών περιποίησης', en: 'Amenity placement', ru: 'Размещение удобств', tr: 'Buklet malzemesi yerleşimi', bg: 'Поставяне на удобства', he: 'הצבת מוצרי טיפוח' },
            { el: 'Επιθεώρηση εξαρτημάτων', en: 'Fixture inspection', ru: 'Осмотр сантехники', tr: 'Armatür denetimi', bg: 'Инспекция на арматурата', he: 'בדיקת אביזרים' },
            { el: 'Σετ πετσετών & λευκών ειδών', en: 'Towel & linen set', ru: 'Набор полотенец и белья', tr: 'Havlu ve nevresim takımı', bg: 'Комплект кърпи и спално бельо', he: 'סט מגבות ומצעים' }
        ],
    },
    {
        icon: Sofa,
        title: { el: 'Σαλόνι', en: 'Living Space', ru: 'Жилое пространство', tr: 'Yaşam Alanı', bg: 'Всекидневна', he: 'מרחב מגורים' },
        points: [
            { el: 'Κατάσταση επίπλων', en: 'Furniture condition', ru: 'Состояние мебели', tr: 'Mobilya durumu', bg: 'Състояние на мебелите', he: 'מצב ריהוט' },
            { el: 'Έλεγχος κλιματισμού', en: 'Climate control test', ru: 'Тест климат-контроля', tr: 'İklim kontrol testi', bg: 'Тест за контрол на климата', he: 'בדיקת בקרת אקלים' },
            { el: 'Ατμόσφαιρα φωτισμού', en: 'Lighting ambiance', ru: 'Освещение и атмосфера', tr: 'Aydınlatma ambiyansı', bg: 'Осветление и атмосфера', he: 'אווירת תאורה' },
            { el: 'Έλεγχος θορύβου & άνεσης', en: 'Noise & comfort check', ru: 'Проверка шума и комфорта', tr: 'Gürültü ve konfor kontrolü', bg: 'Проверка за шум и комфорт', he: 'בדיקת רעש ונוחות' }
        ],
    },
    {
        icon: TreePalm,
        title: { el: 'Εξωτερικός Χώρος', en: 'Exterior', ru: 'Экстерьер', tr: 'Dış Mekan', bg: 'Екстериор', he: 'חוץ' },
        points: [
            { el: 'Παρουσίαση εισόδου', en: 'Entrance presentation', ru: 'Презентация входа', tr: 'Giriş sunumu', bg: 'Презентация на входа', he: 'הצגת כניסה' },
            { el: 'Σκούπισμα εξωτερικού χώρου', en: 'Outdoor area sweep', ru: 'Уборка открытой территории', tr: 'Dış alan süpürme', bg: 'Почиствање на външни зони', he: 'טאטוא שטח חיצוני' },
            { el: 'Φωτισμός ασφαλείας', en: 'Safety lighting', ru: 'Аварийное освещение', tr: 'Güvenlik aydınlatması', bg: 'Защитно осветление', he: 'תאורת ביטחון' },
            { el: 'Έλεγχος κήπου', en: 'Landscaping check', ru: 'Проверка ландшафта', tr: 'Peyzaj kontrolü', bg: 'Проверка на озеленяването', he: 'בדיקת גינון' }
        ],
    },
    {
        icon: Wifi,
        title: { el: 'Ψηφιακά', en: 'Digital', ru: 'Цифровые сервисы', tr: 'Dijital', bg: 'Дигитални', he: 'דיגיטלי' },
        points: [
            { el: 'Τεστ ταχύτητας Wi-Fi', en: 'Wi-Fi speed test', ru: 'Тест скорости Wi-Fi', tr: 'Wi-Fi hız testi', bg: 'Тест за скорост на Wi-Fi', he: 'בדיקת מהירות Wi-Fi' },
            { el: 'Επαλήθευση έξυπνης κλειδαριάς', en: 'Smart lock verification', ru: 'Проверка умного замка', tr: 'Akıllı kilit doğrulaması', bg: 'Проверка на интелигентна ключалка', he: 'אימות מנעול חכם' },
            { el: 'Πρόσβαση σε streaming', en: 'Streaming access', ru: 'Доступ к стримингу', tr: 'Yayın erişimi', bg: 'Достъп до стрийминг', he: 'גישה לסטרימינג' },
            { el: 'Ετοιμότητα εφαρμογής επισκεπτών', en: 'Guest app readiness', ru: 'Готовность гостевого приложения', tr: 'Misafir uygulaması hazırlığı', bg: 'Готовност на приложението за гости', he: 'מוכנות אפליקציית אורחים' }
        ],
    },
];

const stats = [
    { icon: CheckCircle2, value: 50, suffix: '+', label: { el: 'Σημεία Ελέγχου', en: 'Checkpoints', ru: 'Контрольные точки', tr: 'Kontrol Noktaları', bg: 'Контролни точки', he: 'נקודות ביקורת' } },
    { icon: Clock, value: 24, suffix: '/7', label: { el: 'Υποστήριξη', en: 'Support', ru: 'Поддержка', tr: 'Destek', bg: 'Поддръжка', he: 'תמיכה' } },
    { icon: Shield, value: 100, suffix: '%', label: { el: 'Επαληθευμένο', en: 'Verified', ru: 'Проверено', tr: 'Onaylı', bg: 'Проверено', he: 'מאומת' } },
    { icon: Star, value: 5, suffix: '★', label: { el: 'Πρότυπο', en: 'Standard', ru: 'Стандарт', tr: 'Standart', bg: 'Стандарт', he: 'תקן' } },
];

/* ── Stagger animation variants ── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
};

const pointVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: 'easeOut' as const },
    },
};

export default function QualityInspection({ lang = 'en' }: { lang?: Locale }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
    const gridRef = useRef<HTMLDivElement>(null);
    const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

    return (
        <>
            {/* ═══ Part 1: Cinematic Counter Section ═══ */}
            <section
                ref={sectionRef}
                className="relative bg-[#0a0a0a] py-32 md:py-48 overflow-hidden"
            >
                {/* Subtle grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                <div className="container relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Pre-title */}
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium block mb-8"
                        >
                            {({ el: 'Η Εμμονή Μας στη Λεπτομέρεια', en: 'The Homevision Standard', ru: 'Стандарт Homevision', tr: 'Homevision Standardı', bg: 'Стандартът на Homevision', he: 'התקן של Homevision' }[lang as 'en' | 'el'] || 'The Homevision Standard')}
                        </motion.span>

                        {/* Giant Animated Counter */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            className="mb-6"
                        >
                            <span className="text-[120px] md:text-[200px] lg:text-[260px] font-serif font-light text-white leading-none tracking-[-0.04em] block">
                                <AnimatedCounter target={50} />
                            </span>
                        </motion.div>

                        {/* Sub-text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <span className="text-2xl md:text-3xl font-serif text-white/80 font-light tracking-[-0.01em]">
                                {({ el: 'Σημείων Πρωτόκολλο Ελέγχου', en: 'Point Quality Inspection', ru: 'пунктов контроль качества', tr: 'Noktalı Kalite Kontrolü', bg: 'точков контрол на качеството', he: 'נקודות בדיקת איכות' }[lang as 'en' | 'el'] || 'Point Quality Inspection')}
                            </span>
                            <p className="mt-6 text-white/40 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                                {({ el: 'Κάθε ακίνητο υποβάλλεται στο αυστηρό πρωτόκολλο επιθεώρησής μας πριν από κάθε άφιξη επισκέπτη. Καμία λεπτομέρεια δεν είναι πολύ μικρή, κανένα πρότυπο πολύ υψηλό. Διασφαλίζουμε κριτικές 5 αστέρων, προλαμβάνοντας τα προβλήματα πριν καν εμφανιστούν.', en: 'Every property undergoes our rigorous inspection protocol before each guest arrival. No detail is too small. No standard too high.', ru: 'Каждый объект проходит наш строгий протокол проверки перед каждым приездом гостя. Нет слишком мелких деталей. Нет слишком высоких стандартов.', tr: 'Her mülk, her misafir gelişinden önce sıkı denetim protokolümüzden geçer. Hiçbir detay çok küçük değildir. Hiçbir standart çok yüksek değildir.', bg: 'Всеки имот преминава през нашия строг протокол за инспекция преди всяко пристигане на гост. Нито един детайл не е твърде малък. Нито един стандарт не е твърде висок.', he: 'כל נכס עובר את פרוטוקול הבדיקה הקפדני שלנו לפני כל הגעת אורח. שום פרט אינו קטן מדי. שום תקן אינו גבוה מדי.' }[lang as 'en' | 'el'] || 'Every property undergoes our rigorous inspection protocol before each guest arrival. No detail is too small. No standard too high.')}
                            </p>
                        </motion.div>

                        {/* Decorative accent line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent mx-auto mt-12"
                        />
                    </div>
                </div>
            </section>

            {/* ═══ Part 2: Inspection Categories Grid ═══ */}
            <section className="bg-[#0a0a0a] pb-24 md:pb-32">
                <div className="container">
                    <motion.div
                        ref={gridRef}
                        variants={containerVariants}
                        initial="hidden"
                        animate={gridInView ? 'visible' : 'hidden'}
                        className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6"
                    >
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 md:p-8 group hover:bg-white/[0.07] transition-colors duration-500 cursor-default"
                                >
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center mb-5 group-hover:bg-[var(--color-accent)]/20 transition-colors">
                                        <Icon size={18} className="text-white/60 group-hover:text-[var(--color-accent)] transition-colors" />
                                    </div>

                                    {/* Category Title */}
                                    <h4 className="text-white font-serif text-lg mb-4 tracking-tight">{getLocalized(cat.title, lang)}</h4>

                                    {/* Checkpoint Items */}
                                    <motion.ul
                                        variants={containerVariants}
                                        className="space-y-3"
                                    >
                                        {cat.points.map((point, i) => (
                                            <motion.li
                                                key={i}
                                                variants={pointVariants}
                                                className="flex items-start gap-2 text-[13px] text-white/40 group-hover:text-white/60 transition-colors"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0 opacity-60" />
                                                {getLocalized(point, lang)}
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ═══ Part 3: Stats Promise Strip ═══ */}
            <section className="bg-[#0a0a0a] border-t border-white/[0.06]">
                <div className="container py-16 md:py-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="text-center"
                                >
                                    <Icon size={20} className="text-[var(--color-accent)] mx-auto mb-3 opacity-70" />
                                    <span className="block text-3xl md:text-4xl font-serif text-white font-light tracking-tight">
                                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-2 block">
                                        {getLocalized(stat.label, lang)}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
