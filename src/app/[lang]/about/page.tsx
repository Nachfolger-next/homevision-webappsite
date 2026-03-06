import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import Image from 'next/image';
import { Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getAlternates } from '@/lib/metadata';
import { Target, Gem, Users, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | Homevision',
    description: 'Meet the team behind Homevision. Learn about our story, values, and mission to elevate hospitality across Greece.',
    openGraph: {
        title: 'About Homevision',
        description: 'Elevating hospitality to an art form. Premium property management in Greece since 2023.',
        type: 'website',
    },
    alternates: getAlternates('/about'),
};

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const content = {
    title: { el: 'Η Ιστορία Μας', en: 'Our Story', ru: 'Наша история', tr: 'Hikayemiz', bg: 'Нашата история', he: 'הסיפור שלנו' },
    subtitle: { el: 'Δεν Διαχειριζόμαστε Απλά Ακίνητα. Προστατεύουμε την Επένδυσή σας.', en: "We Don't Just Manage Properties. We Protect Your Investment — From Across the Globe.", ru: 'Мы не просто управляем недвижимостью. Мы защищаем вашу инвестицию.', tr: 'Sadece Mülk Yönetmiyoruz. Yatırımınızı Koruyoruz.', bg: 'Ние не просто управляваме имоти. Ние защитаваме инвестицията ви.', he: 'אנחנו לא רק מנהלים נכסים. אנחנו מגנים על ההשקעה שלכם.' },
    philosophy: { el: 'Φιλοσοφία', en: 'Philosophy', ru: 'Философия', tr: 'Felsefe', bg: 'Философия', he: 'פילוסופיה' },
    philosophyQuote: { el: 'Πίσω από κάθε κερδοφόρο ακίνητο, κρύβεται μια ομάδα που το φροντίζει σαν δικό της.', en: 'Behind every high-performing property in Greece, there\'s a local team that treats it as their own. That\'s us.', ru: 'За каждым прибыльным объектом стоит команда, которая заботится о нём как о своём.', tr: 'Her kârlı mülkün arkasında, onu kendi mülkü gibi önemseyen bir ekip var.', bg: 'Зад всеки печеливш имот стои екип, който се грижи за него като за свой.', he: 'מאחורי כל נכס רווחי עומד צוות שמטפל בו כאילו הוא שלו.' },
    ourRoots: { el: 'Οι Ρίζες Μας', en: 'Our Roots', ru: 'Наши корни', tr: 'Köklerimiz', bg: 'Нашите корени', he: 'השורשים שלנו' },
    rootsPara1: { el: 'Ξεκινήσαμε τη Homevision με μια ξεκάθαρη αποστολή: να απαλλάξουμε τους ιδιοκτήτες από το άγχος της βραχυχρόνιας μίσθωσης, διατηρώντας τα standards φιλοξενίας στο υψηλότερο επίπεδο.', en: 'We built Homevision for one reason: so property owners — whether in Thessaloniki or overseas — never have to worry about their short-term rental again.', ru: 'Мы создали Homevision с чёткой миссией: избавить владельцев от стресса краткосрочной аренды, сохраняя высочайшие стандарты гостеприимства.', tr: 'Homevision\'ı net bir misyonla kurduk: kısa dönem kiralama stresinden mülk sahiplerini kurtarmak, en yüksek konaklama standartlarını koruyarak.', bg: 'Създадохме Homevision с ясна мисия: да освободим собствениците от стреса на краткосрочните наеми, поддържайки най-високи стандарти.', he: 'הקמנו את Homevision עם משימה ברורה: לשחרר בעלי נכסים מהלחץ של השכרה לטווח קצר, תוך שמירה על סטנדרטים הגבוהים ביותר.' },
    rootsPara2: { el: 'Δεν είμαστε απλά μια εταιρεία διαχείρισης — είμαστε η ομάδα σας.', en: "We're not a faceless agency. We're your team on the ground in Greece.", ru: 'Мы не просто управляющая компания — мы ваша команда.', tr: 'Sadece bir yönetim şirketi değiliz — sizin ekibiniziz.', bg: 'Ние не сме просто управляваща компания — ние сме вашият екип.', he: 'אנחנו לא רק חברת ניהול — אנחנו הצוות שלכם.' },
    digitalApproach: { el: 'Η Digital Προσέγγιση', en: 'The Digital Approach', ru: 'Цифровой подход', tr: 'Dijital Yaklaşım', bg: 'Дигиталният подход', he: 'הגישה הדיגיטלית' },
    digitalPara1: { el: 'Η καρδιά μας χτυπάει στη φιλοξενία, αλλά το μυαλό μας είναι στα δεδομένα. Συνδυάζουμε την ανθρώπινη επαφή με τεχνολογία αιχμής — δυναμική τιμολόγηση, αναλύσεις σε πραγματικό χρόνο — για να διασφαλίσουμε ότι το ακίνητό σας αποδίδει το μέγιστο.', en: 'Our heart is in hospitality, but our mind is on the numbers. We combine personal care with cutting-edge tech — dynamic pricing, real-time analytics — so your property performs at its peak, even when you\'re 2,000 km away.', ru: 'Наше сердце бьётся для гостеприимства, но наш разум — в данных. Мы сочетаем человеческий подход с передовыми технологиями для максимальной отдачи вашей недвижимости.', tr: 'Kalbimiz konukseverlikte, ama aklımız verilerde. İnsan dokunuşunu son teknoloji ile birleştiriyoruz — mülkünüzün en iyi performansını sağlamak için.', bg: 'Сърцето ни бие за гостоприемство, но умът ни е в данните. Съчетаваме човешкия подход с технологии от последно поколение за максимална ефективност.', he: 'הלב שלנו פועם לאירוח, אבל הראש שלנו בנתונים. אנחנו משלבים מגע אנושי עם טכנולוגיה מתקדמת — כדי להבטיח שהנכס שלכם מניב את המקסימום.' },
    digitalPara2: { el: 'Με το owner portal μας, έχετε πλήρη ορατότητα στα έσοδα, τις κρατήσεις και τη συντήρηση — ανά πάσα στιγμή, από οπουδήποτε.', en: 'With our owner portal, you have full visibility into revenue, bookings, and maintenance — anytime, from anywhere.', ru: 'Через наш портал вы имеете полную видимость доходов, бронирований и обслуживания.', tr: 'Sahip portalımız ile gelirlere, rezervasyonlara ve bakıma tam görünürlük — her zaman, her yerden.', bg: 'Чрез нашия портал за собственици имате пълна видимост върху приходите, резервациите и поддръжката.', he: 'דרך פורטל הבעלים שלנו, יש לכם נראות מלאה על הכנסות, הזמנות ותחזוקה.' },
    values: { el: 'Οι Αξίες Μας', en: 'Our Values', ru: 'Наши ценности', tr: 'Değerlerimiz', bg: 'Нашите ценности', he: 'הערכים שלנו' },
    team: { el: 'Η Ομάδα', en: 'The Team', ru: 'Команда', tr: 'Ekip', bg: 'Екипът', he: 'הצוות' },
    teamSubtitle: { el: 'Πίσω από κάθε εξαιρετική εμπειρία, υπάρχει μια ομάδα που νοιάζεται.', en: "Behind every exceptional experience, there's a team that cares.", ru: 'За каждым исключительным опытом стоит команда, которая заботится.', tr: 'Her olağanüstü deneyimin arkasında önem veren bir ekip var.', bg: 'Зад всяко изключително преживяване стои екип, който го е грижа.', he: 'מאחורי כל חוויה יוצאת דופן עומד צוות שאכפת לו.' },
    journey: { el: 'Η Πορεία Μας', en: 'Our Journey', ru: 'Наш путь', tr: 'Yolculuğumuz', bg: 'Нашият път', he: 'המסע שלנו' },
};

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    const values = [
        {
            icon: Target,
            title: { el: 'Απόλυτη Διαφάνεια', en: 'Total Transparency', ru: 'Полная прозрачность', tr: 'Tam Şeffaflık', bg: 'Пълна прозрачност', he: 'שקיפות מלאה' },
            desc: { el: 'Καμία κρυφή χρέωση, κανένα ψιλά γράμματα. Βλέπετε ακριβώς ό,τι βλέπουμε κι εμείς, σε πραγματικό χρόνο.', en: 'No hidden fees. No fine print. Your owner dashboard shows everything — revenue, expenses, bookings — in English, in real time.', ru: 'Никаких скрытых платежей, никакого мелкого шрифта. Вы видите ровно то, что видим мы, в реальном времени.', tr: 'Gizli ücret yok, ince yazı yok. Tam olarak bizim gördüğümüzü görürsünüz, gerçek zamanlı.', bg: 'Без скрити такси, без дребен шрифт. Виждате точно това, което виждаме и ние, в реално време.', he: 'ללא עמלות נסתרות, ללא אותיות קטנות. אתם רואים בדיוק מה שאנחנו רואים, בזמן אמת.' },
        },
        {
            icon: Gem,
            title: { el: 'Εμμονή στην Ποιότητα', en: 'Obsession with Quality', ru: 'Одержимость качеством', tr: 'Kaliteye Takıntı', bg: 'Обсебеност от качеството', he: 'אובססיה לאיכות' },
            desc: { el: 'Αντιμετωπίζουμε το ακίνητό σας σαν 5άστερο boutique hotel. Από τις premium φωτογραφίες μέχρι τον επαγγελματικό καθαρισμό, δεν κάνουμε εκπτώσεις.', en: 'We treat your property like a 5-star boutique hotel. Premium photography, professional cleaning, 50-point inspections. The standard stays high whether or not you\'re watching.', ru: 'Мы обращаемся с вашим объектом как с 5-звёздочным бутик-отелем. От премиум-фотографии до профессиональной уборки — без компромиссов.', tr: 'Mülkünüze 5 yıldızlı bir butik otel gibi davranıyoruz. Premium fotoğrafçılıktan profesyonel temizliğe, asla ödün vermiyoruz.', bg: 'Третираме имота ви като 5-звезден бутиков хотел. От премиум фотография до професионално почистване — без компромиси.', he: 'אנחנו מתייחסים לנכס שלכם כמו למלון בוטיק 5 כוכבים. מצילום פרימיום ועד ניקיון מקצועי, בלי פשרות.' },
        },
        {
            icon: Lightbulb,
            title: { el: 'Καινοτομία', en: 'Smart Pricing, Zero Guesswork', ru: 'Инновации', tr: 'Yenilikçilik', bg: 'Иновации', he: 'חדשנות' },
            desc: { el: 'Δεν μαντεύουμε τις τιμές. Χρησιμοποιούμε προηγμένους αλγόριθμους δυναμικής τιμολόγησης για να μη χάνετε ούτε ευρώ από τα δυνητικά σας έσοδα.', en: "We don't guess prices. Our algorithms analyze local demand, seasonality, and competitor rates daily — so you never leave money on the table.", ru: 'Мы не гадаем с ценами. Мы используем алгоритмы динамического ценообразования, чтобы вы не теряли ни евро потенциального дохода.', tr: 'Fiyatları tahmin etmiyoruz. Potansiyel gelirinizden tek bir euro bile kaybetmemeniz için gelişmiş dinamik fiyatlandırma algoritmaları kullanıyoruz.', bg: 'Не гадаем цените. Използваме напреднали алгоритми за динамично ценообразуване, за да не губите нито евро от потенциалните си приходи.', he: 'אנחנו לא מנחשים מחירים. אנחנו משתמשים באלגוריתמים מתקדמים של תמחור דינמי כדי שלא תפסידו אף יורו מהכנסות פוטנציאליות.' },
        },
        {
            icon: Users,
            title: { el: 'Προσωπική Φροντίδα', en: 'Your Dedicated Point of Contact', ru: 'Персональная забота', tr: 'Kişisel İlgi', bg: 'Лична грижа', he: 'טיפול אישי' },
            desc: { el: 'Ξεχάστε τα απρόσωπα τηλεφωνικά κέντρα. Έχετε τον δικό σας αφοσιωμένο διαχειριστή, δίπλα σας 24/7.', en: 'Forget impersonal call centers. You get a dedicated manager who speaks your language, knows your property, and is reachable 24/7.', ru: 'Забудьте о безликих колл-центрах. У вас есть свой персональный менеджер, рядом с вами 24/7.', tr: 'Kişiliksiz çağrı merkezlerini unutun. Yanınızda 7/24 kendi özel yöneticiniz var.', bg: 'Забравете безличните кол центрове. Имате свой личен мениджър, до вас 24/7.', he: 'שכחו ממוקדים טלפוניים אנונימיים. יש לכם מנהל ייעודי משלכם, לצדכם 24/7.' },
        },
    ];

    const team = [
        {
            name: 'Andreas Patsis',
            role: { el: 'Ιδρυτής & CEO', en: 'Founder & CEO', ru: 'Основатель и CEO', tr: 'Kurucu & CEO', bg: 'Основател и CEO', he: 'מייסד ומנכ"ל' },
            bio: { el: 'Πάνω από 10 χρόνια εμπειρίας στον κλάδο. Χαράσσει τη στρατηγική για να μετατρέψει το ακίνητό σας σε κορυφαία επιλογή.', en: 'Over a decade in Greek hospitality. He builds the strategy that turns your property into a market leader — and keeps you informed every step of the way.', ru: 'Более 10 лет в индустрии. Разрабатывает стратегию, превращающую вашу недвижимость в лидера рынка.', tr: '10 yılı aşkın sektör deneyimi. Mülkünüzü en iyi performans gösteren varlığa dönüştürmek için stratejiyi belirler.', bg: 'Над 10 години в индустрията. Изгражда стратегията, която превръща имота ви в топ избор.', he: 'למעלה מעשור בתעשייה. הוא בונה את האסטרטגיה שהופכת את הנכס שלכם לנכס מוביל.' },
            img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
        },
        {
            name: 'Nikos Papageorgiou',
            role: { el: 'Συνιδρυτής - Head of Digital', en: 'Co-Founder - Head of Digital', ru: 'Соучредитель - Head of Digital', tr: 'Kurucu Ortak - Head of Digital', bg: 'Съосновател - Head of Digital', he: 'מייסד שותף - Head of Digital' },
            bio: { el: 'Αξιοποιεί δεδομένα αγοράς σε πραγματικό χρόνο για να βελτιστοποιεί τις τιμές και την πληρότητά σας — καθημερινά.', en: 'Uses real-time Greek market data to optimize your pricing and occupancy daily. You see the results in your dashboard — from anywhere.', ru: 'Использует рыночные данные в реальном времени для оптимизации ваших цен и заполняемости — ежедневно.', tr: 'Fiyatlandırmanızı ve doluluk oranınızı optimize etmek için gerçek zamanlı piyasa verilerini kullanır — her gün.', bg: 'Използва пазарни данни в реално време за οπτιμιζίρανε на цените и заетостта ви — ежедневно.', he: 'משתמש בנתוני שוק בזמן אמת לאופטימיזציה של המחירים והתפוסה שלכם — מדי יום.' },
            img: '/Nikos_Papageorgiou.webp',
        },
        {
            name: 'Dora Kandylaki',
            role: { el: 'Διευθύντρια Λειτουργιών', en: 'Head of Operations', ru: 'Руководитель операций', tr: 'Operasyon Müdürü', bg: 'Ръководител операции', he: 'מנהלת תפעול' },
            bio: { el: 'Ελέγχει προσωπικά κάθε λεπτομέρεια ώστε οι επισκέπτες να αφήνουν κριτικές 5 αστέρων — σταθερά.', en: 'She\'s on the ground, personally inspecting every detail so your guests leave consistent 5-star reviews — even when you can\'t be there yourself.', ru: 'Лично контролирует каждую деталь, чтобы гости оставляли 5-звёздочные отзывы — стабильно.', tr: 'Misafirlerin sürekli olarak 5 yıldızlı yorum bırakması için her detayı kişisel olarak kontrol eder.', bg: 'Лично проверява всеки детайл, за да оставят гостите отзиви с 5 звезди — постоянно.', he: 'בודקת באופן אישי כל פרט כדי שאורחים ישאירו ביקורות 5 כוכבים — בעקביות.' },
            img: '/Dora_Kandylaki.webp',
        },
    ];

    const timeline = [
        { year: '2023', title: { el: 'Ίδρυση', en: 'Founded', ru: 'Основание', tr: 'Kuruluş', bg: 'Основаване', he: 'הקמה' }, desc: { el: 'Ξεκινήσαμε με ένα ακίνητο στο ιστορικό κέντρο της Θεσσαλονίκης.', en: "Started with a single property in Thessaloniki's historic center, driven by a passion for premium hospitality.", ru: 'Начали с одного объекта в историческом центре Салоников.', tr: 'Selanik\'in tarihi merkezinde tek bir mülkle başladık.', bg: 'Започнахме с един имот в историческия център на Солун.', he: 'התחלנו עם נכס אחד במרכז ההיסטורי של סלוניקי.' } },
        { year: '2024', title: { el: 'Ανάπτυξη', en: 'Growth', ru: 'Рост', tr: 'Büyüme', bg: 'Растеж', he: 'צמיחה' }, desc: { el: 'Ταχεία ανάπτυξη σε 30+ ακίνητα. Εκκίνηση πλατφόρμας ιδιοκτήτη και Digital Management.', en: 'Rapid growth to 30+ properties. Launched the owner portal and Digital Management service for remote property owners.', ru: 'Быстрый рост до 30+ объектов. Запуск портала владельца и услуги цифрового управления.', tr: '30+ mülke hızlı büyüme. Sahip portalı ve Dijital Yönetim hizmeti başlatıldı.', bg: 'Бърз растеж до 30+ имота. Стартиране на портал за собственици.', he: 'צמיחה מהירה ל-30+ נכסים. השקת פורטל בעלים ושירות ניהול דיגיטלי.' } },
        { year: '2026', title: { el: 'Σήμερα', en: 'Today', ru: 'Сегодня', tr: 'Bugün', bg: 'Днес', he: 'היום' }, desc: { el: '50+ ακίνητα, Θεσσαλονίκη & Ελληνικά Νησιά, 3.000+ check-ins.', en: '50+ properties managed, operating across Thessaloniki & the Greek Islands, with 3,000+ guest check-ins.', ru: '50+ объектов в управлении, Салоники и Греческие острова, 3000+ заселений.', tr: '50+ yönetilen mülk, Selanik ve Yunan Adaları\'nda faaliyet, 3.000+ misafir girişi.', bg: '50+ управлявани имота, Солун и гръцките острови, 3 000+ настанявания.', he: '50+ נכסים מנוהלים, סלוניקי והאיים היווניים, 3,000+ כניסות אורחים.' } },
    ];

    const statsLabels = {
        properties: { el: 'Ακίνητα', en: 'Properties', ru: 'Объектов', tr: 'Mülk', bg: 'Имоти', he: 'נכסים' },
        rating: { el: 'Βαθμολογία', en: 'Guest Rating', ru: 'Рейтинг', tr: 'Puan', bg: 'Рейтинг', he: 'דירוג' },
        checkins: { el: 'Check-ins', en: 'Check-ins', ru: 'Заселений', tr: 'Giriş', bg: 'Настанявания', he: 'כניסות' },
        support: { el: 'Υποστήριξη', en: 'Support', ru: 'Поддержка', tr: 'Destek', bg: 'Поддръжка', he: 'תמיכה' },
    };

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Header lang={lang} theme="dark" />

            {/* Hero */}
            <section className="relative h-[70vh] flex items-end overflow-hidden grain-overlay">
                <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop"
                    alt="About Hero"
                    fill
                    className="object-cover"
                    style={{ filter: 'contrast(1.05) brightness(0.9)' }}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="container relative z-10 pb-10">
                    <span className="editorial-rule mb-6 block" style={{ background: 'white', opacity: 0.3 }} />
                    <h1 className="text-5xl md:text-8xl font-serif mb-4 text-white tracking-[-0.03em] leading-[1.1] md:leading-[0.95]">
                        {getLocalized(content.title, lang)}
                    </h1>
                    <p className="text-lg text-white/60 font-light tracking-wide max-w-4xl">
                        {getLocalized(content.subtitle, lang)}
                    </p>
                </div>
            </section>

            {/* Philosophy Pull-Quote */}
            <section className="py-20 md:py-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">
                        <div>
                            <span className="editorial-rule editorial-rule--accent mb-6 block" />
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium">
                                {getLocalized(content.philosophy, lang)}
                            </span>
                        </div>
                        <blockquote className="text-3xl md:text-4xl font-serif leading-[1.3] tracking-[-0.02em] text-[var(--color-text)]">
                            &ldquo;{getLocalized(content.philosophyQuote, lang)}&rdquo;
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="pb-20 md:pb-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                        <div>
                            <h3 className="text-2xl font-serif mb-6 tracking-[-0.02em]">
                                {getLocalized(content.ourRoots, lang)}
                            </h3>
                            <p className="text-[var(--color-neutral-500)] leading-relaxed mb-4">
                                {getLocalized(content.rootsPara1, lang)}
                            </p>
                            <p className="text-[var(--color-neutral-500)] leading-relaxed">
                                {getLocalized(content.rootsPara2, lang)}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif mb-6 tracking-[-0.02em]">
                                {getLocalized(content.digitalApproach, lang)}
                            </h3>
                            <p className="text-[var(--color-neutral-500)] leading-relaxed mb-4">
                                {getLocalized(content.digitalPara1, lang)}
                            </p>
                            <p className="text-[var(--color-neutral-500)] leading-relaxed">
                                {getLocalized(content.digitalPara2, lang)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-20 md:py-32 bg-[var(--color-surface)]">
                <div className="container">
                    <div className="max-w-xl mb-16">
                        <span className="editorial-rule editorial-rule--accent mb-6 block" />
                        <h2 className="text-4xl md:text-6xl font-serif tracking-[-0.03em]">
                            {getLocalized(content.values, lang)}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] group hover:border-[var(--color-accent)]/30 transition-colors"
                                >
                                    <span className="text-[var(--color-neutral-300)] text-5xl font-serif font-light block mb-4">
                                        0{idx + 1}
                                    </span>
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)]/20 transition-colors">
                                        <Icon size={18} className="text-[var(--color-accent)]" />
                                    </div>
                                    <h3 className="text-lg font-serif mb-3 tracking-[-0.02em]">
                                        {getLocalized(value.title, lang)}
                                    </h3>
                                    <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed">
                                        {getLocalized(value.desc, lang)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 md:py-32">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                        <div className="md:max-w-lg">
                            <span className="editorial-rule editorial-rule--accent mb-6 block" />
                            <h2 className="text-4xl md:text-6xl font-serif tracking-[-0.03em]">
                                {getLocalized(content.team, lang)}
                            </h2>
                        </div>
                        <p className="md:max-w-sm md:text-right text-[var(--color-neutral-500)] text-base leading-relaxed">
                            {getLocalized(content.teamSubtitle, lang)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="group">
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-6">
                                    <Image
                                        src={member.img}
                                        alt={member.name}
                                        fill
                                        className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/0 transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-serif mb-1 tracking-[-0.02em]">{member.name}</h3>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium block mb-3">
                                    {getLocalized(member.role, lang)}
                                </span>
                                <p className="text-sm text-[var(--color-neutral-500)] leading-relaxed">
                                    {getLocalized(member.bio, lang)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 md:py-32 bg-[#0F0F0F] text-white grain-overlay">
                <div className="container relative z-10">
                    <div className="max-w-xl mb-16">
                        <span className="editorial-rule mb-6 block" style={{ background: 'var(--color-accent)', opacity: 0.5 }} />
                        <h2 className="text-4xl md:text-6xl font-serif tracking-[-0.03em]">
                            {getLocalized(content.journey, lang)}
                        </h2>
                    </div>

                    <div className="relative max-w-3xl">
                        {/* Vertical line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-white/10" />

                        <div className="space-y-12">
                            {timeline.map((milestone, idx) => (
                                <div key={idx} className="flex gap-8 items-start group">
                                    {/* Dot */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-[#0F0F0F] group-hover:border-[var(--color-accent)]/50 transition-colors">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
                                        </div>
                                    </div>
                                    {/* Content */}
                                    <div className="pb-2">
                                        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium block mb-2">
                                            {milestone.year}
                                        </span>
                                        <h3 className="text-xl font-serif mb-2 tracking-[-0.02em]">
                                            {getLocalized(milestone.title, lang)}
                                        </h3>
                                        <p className="text-sm text-white/40 leading-relaxed max-w-md">
                                            {getLocalized(milestone.desc, lang)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 md:py-20 border-b border-[var(--color-neutral-200)]">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '50+', label: getLocalized(statsLabels.properties, lang) },
                            { value: '4.9★', label: getLocalized(statsLabels.rating, lang) },
                            { value: '3,000+', label: getLocalized(statsLabels.checkins, lang) },
                            { value: '24/7', label: getLocalized(statsLabels.support, lang) },
                        ].map((stat, idx) => (
                            <div key={idx}>
                                <span className="text-4xl md:text-5xl font-serif font-light tracking-[-0.03em] text-[var(--color-text)]">
                                    {stat.value}
                                </span>
                                <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mt-2">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CallToAction lang={lang} />
            <Footer lang={lang} />
        </main>
    );
}
