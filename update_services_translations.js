const fs = require('fs');
const path = require('path');

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

const steps = [
    {
        num: '01',
        title: { el: 'Αξιολόγηση', en: 'Consultation', ru: 'Консультация', tr: 'Danışma', bg: 'Консултация', he: 'ייעוץ' },
        desc: { el: 'Δωρεάν εκτίμηση του ακινήτου σας και πρόταση στρατηγικής.', en: 'Free property assessment and tailored strategy proposal. We analyze your market, competition, and revenue potential.', ru: 'Бесплатная оценка и индивидуальная стратегия. Мы анализируем рынок и потенциал дохода.', tr: 'Ücretsiz mülk değerlendirmesi ve özel strateji önerisi. Pazarı, rekabeti ve gelir potansiyelini analiz ediyoruz.', bg: 'Безплатна оценка на имота и индивидуална стратегия. Анализираме пазара и потенциала.', he: 'הערכת נכס חינם והצעת אסטרטגיה מותאמת. אנחנו מנתחים את השוק והפוטנציאל.' },
    },
    {
        num: '02',
        title: { el: 'Προετοιμασία', en: 'Onboarding', ru: 'Подготовка', tr: 'Hazırlık', bg: 'Подготовка', he: 'הכנה' },
        desc: { el: 'Φωτογράφιση, δημιουργία αγγελίας, ρύθμιση πλατφορμών.', en: 'Professional photography, listing creation, platform setup, and pricing calibration. Your property goes live within days.', ru: 'Профессиональная фотосъёмка, создание объявлений, настройка платформ. Запуск за несколько дней.', tr: 'Profesyonel fotoğrafçılık, ilan oluşturma, platform kurulumu ve fiyat kalibrasyonu. Mülkünüz günler içinde yayına alınır.', bg: 'Професионална фотография, създаване на обява, настройка на платформи. Имотът ви е онлайн за дни.', he: 'צילום מקצועי, יצירת מודעה, הגדרת פלטפורמות. הנכס שלכם עולה לאוויר תוך ימים.' },
    },
    {
        num: '03',
        title: { el: 'Έναρξη Κρατήσεων', en: 'Go Live', ru: 'Запуск', tr: 'Yayına Alın', bg: 'На живо', he: 'השקה' },
        desc: { el: 'Λαμβάνετε κρατήσεις και παρακολουθείτε τα αποτελέσματα.', en: 'Start receiving bookings while we handle everything. Track performance in real-time through your owner portal.', ru: 'Принимайте бронирования, пока мы заботимся обо всём. Следите за результатами через портал.', tr: 'Biz her şeyi hallederken siz rezervasyon almaya başlayın. Sahip portalı üzerinden performansı gerçek zamanlı takip edin.', bg: 'Получавайте резервации, докато ние се грижим за всичко. Проследявайте резултатите в реално време.', he: 'התחילו לקבל הזמנות בזמן שאנחנו מטפלים בהכל. עקבו אחר ביצועים בזמן אמת.' },
    },
];

const servicesObj = {
    full: {
        label: { el: 'Πλήρης Διαχείριση', en: 'Full Management', ru: 'Полное управление', tr: 'Tam Yönetim', bg: 'Пълно управление', he: 'ניהול מלא' },
        desc: { el: 'Η πλήρης διαχείριση. Ο ιδιοκτήτης δεν ασχολείται με τίποτα.', en: 'The complete solution. We handle every detail so you don\'t have to.', ru: 'Полное решение. Мы занимаемся всем.', tr: 'Eksiksiz çözüm. Her detayla biz ilgileniyoruz.', bg: 'Пълно решение. Ние се грижим за всичко.', he: 'הפתרון המלא. אנחנו מטפלים בכל פרט.' },
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
    },
    digital: {
        label: { el: 'Digital Διαχείριση', en: 'Digital Management', ru: 'Цифровое управление', tr: 'Dijital Yönetim', bg: 'Дигитално управление', he: 'ניהול דיגיטלי' },
        desc: { el: 'Για τον ιδιοκτήτη που θέλει να γλιτώσει τα μηνύματα και το άγχος της επικοινωνίας.', en: 'For owners who want to save time on guest messaging and stress-free operations.', ru: 'Для владельцев, которые хотят сэкономить время.', tr: 'Misafir mesajlarından ve opersyonel stresten kurtulmak isteyen mülk sahipleri için.', bg: 'За собственици, които искат да спестят време.', he: 'לבעלים שרוצים לחסוך זמן בתקשורת.' },
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
    role: { el: 'Ιδιοκτήτης 3 ακινήτων, Θεσσαλονίκη', en: 'Owner of 3 properties, Thessaloniki', ru: 'Владелец 3 объектов, Салоники', tr: '3 mülk sahibi, Selanik', bg: 'Собственик на 3 имота, Солун', he: 'בעלים של 3 נכסים, סלוניקי' },
};

const shortWords = {
    howItWorks: { el: 'Πώς Λειτουργεί', en: 'How It Works', ru: 'Как это работает', tr: 'Nasıl Çalışır', bg: 'Как работи', he: 'איך זה עובד' },
    threeSimpleSteps: { el: 'Τρία Απλά Βήματα', en: 'Three Simple Steps', ru: 'Три простых шага', tr: 'Üç Basit Adım', bg: 'Три прости стъпки', he: 'שלושה צעדים פשוטים' },
    chooseYourPlan: { el: 'Επιλέξτε το Πακέτο σας', en: 'Choose Your Plan', ru: 'Выберите план', tr: 'Paketinizi Seçin', bg: 'Изберете план', he: 'בחרו תוכנית' },
    bothPlansInclude: { el: 'Και τα δύο πακέτα περιλαμβάνουν πρόσβαση στο owner portal.', en: 'Both plans include full owner portal access and dedicated account management.', ru: 'Оба плана включают доступ к порталу владельца.', tr: 'Her iki plan da sahip portalı erişimi içerir.', bg: 'И двата плана включват достъп до портала за собственици.', he: 'שתי התוכניות כוללות גישה לפורטל בעלים.' },
    recommended: { el: 'Προτεινόμενο', en: 'Recommended', ru: 'Рекомендуем', tr: 'Önerilen', bg: 'Препоръчан', he: 'מומלץ' },
    commission: { el: 'προμήθεια', en: 'commission', ru: 'комиссия', tr: 'komisyon', bg: 'комисионна', he: 'עמלה' },
    getStarted: { el: 'Ξεκινήστε', en: 'Get Started', ru: 'Начать', tr: 'Başlayın', bg: 'Стартирайте', he: 'התחילו' },
    faqTitle: { el: 'Συχνές Ερωτήσεις', en: 'FAQ', ru: 'ЧаВО', tr: 'SSS', bg: 'ЧЗВ', he: 'שאלות נפוצות' },
    faqDesc: { el: 'Όλα όσα πρέπει να γνωρίζετε πριν ξεκινήσετε.', en: 'Everything you need to know before getting started.', ru: 'Всё, что нужно знать перед началом.', tr: 'Başlamadan önce bilmeniz gereken her şey.', bg: 'Всичко, което трябва да знаете преди да започнете.', he: 'כל מה שצריך לדעת לפני שמתחילים.' }
};

const langs = ['el', 'en', 'ru', 'tr', 'bg', 'he'];

for (const lang of langs) {
    const filePath = path.join(__dirname, 'src', 'translations', `${lang}.json`);
    const dict = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!dict.services) {
        dict.services = {};
    }

    dict.services.title = content.title[lang];
    dict.services.subtitle = content.subtitle[lang];

    dict.services.steps = steps.map(s => ({
        num: s.num,
        title: s.title[lang],
        desc: s.desc[lang]
    }));

    dict.services.plans = {
        full: {
            label: servicesObj.full.label[lang],
            desc: servicesObj.full.desc[lang],
            features: servicesObj.full.features.map(f => f[lang])
        },
        digital: {
            label: servicesObj.digital.label[lang],
            desc: servicesObj.digital.desc[lang],
            features: servicesObj.digital.features.map(f => f[lang])
        }
    };

    dict.services.faqs = faqs.map(f => ({
        q: f.q[lang],
        a: f.a[lang]
    }));

    dict.services.testimonial = {
        quote: testimonial.quote[lang],
        role: testimonial.role[lang]
    };

    for (const key of Object.keys(shortWords)) {
        dict.services[key] = shortWords[key][lang];
    }

    fs.writeFileSync(filePath, JSON.stringify(dict, null, 2));
    console.log(`Updated ${lang}.json`);
}
