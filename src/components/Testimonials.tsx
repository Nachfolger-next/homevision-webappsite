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
            el: 'Αυτό που μου αρέσει σε εσάς, είναι ότι λέμε κάτι και γίνεται. Χωρίς δικαιολογίες, καθυστερήσεις και χωρίς να χρειάζεται να σας κυνηγάω στο τηλέφωνο. Ο επαγγελματισμός της ομάδας με έχει γλιτώσει από άπειρο άγχος.',
            en: 'What I like about you is that when we say something, it gets done. No excuses, no delays, and no need to chase you on the phone. The team\'s professionalism has saved me from endless stress.',
            ru: 'Что мне нравится в вас, так это то, что сказано — сделано. Без оправданий, без задержек и без необходимости бегать за вами по телефону. Профессионализм команды избавил меня от бесконечного стресса.',
            tr: 'Sizde sevdiğim şey, bir şey söylediğimizde yapılması. Bahaneler yok, gecikmeler yok ve sizi telefonda kovalamaya gerek yok. Ekibin profesyonelliği beni sonsuz stresten kurtardı.',
            bg: 'Това, което ми харесва във вас, е че когато кажем нещо, то се прави. Без оправдания, без закъснения и без да се налага да ви гоня по телефона. Професионализмът на екипа ме спаси от безкраен стрес.',
            he: 'מה שאני אוהב בכם הוא שכשמדברים על משהו, הוא קורה. בלי תירוצים, בלי עיכובים ובלי צורך לרדוף אחריכם בטלפון. המקצועיות של הצוות חסכה לי אינסוף לחץ.',
        },
        author: "Miltos M.",
        role: { el: 'Ιδιοκτήτης, Θεσσαλονίκη', en: 'Owner, Thessaloniki', ru: 'Владелец, Салоники', tr: 'Mülk Sahibi, Selanik', bg: 'Собственик, Солун', he: 'בעלים, סלוניקי' },
        rating: 5,
    },
    {
        id: 2,
        text: {
            el: 'Δίσταζα να δώσω το πατρικό μου σε εταιρεία, αλλά τα παιδιά με κέρδισαν αμέσως. Το σπίτι είναι πάντα στην εντέλεια όποτε περνάω, και οι επισκέπτες αφήνουν τις καλύτερες κριτικές. Εξαιρετικοί επαγγελματίες.',
            en: 'I was hesitant to hand over my family home to a company, but the team won me over immediately. The house is always in perfect condition whenever I visit, and the guests leave the best reviews. Excellent professionals.',
            ru: 'Я не решалась передать родительский дом компании, но ребята сразу же меня покорили. Дом всегда в идеальном состоянии, когда я приезжаю, а гости оставляют лучшие отзывы. Отличные профессионалы.',
            tr: 'Aile evimi bir şirkete teslim etme konusunda tereddütlüydüm, ama ekip beni anında kazandı. Ne zaman uğrasam ev her zaman mükemmel durumda ve misafirler en iyi yorumları bırakıyor. Mükemmel profesyoneller.',
            bg: 'Колебаех се да поверя семейната си къща на компания, но екипът ме спечели веднага. Къщата е винаги в перфектно състояние, когато намина, а гостите оставят най-добрите отзиви. Отлични професионалисти.',
            he: 'היססתי למסור את בית המשפחה שלי לחברה, אבל הצוות קנה אותי מיד. הבית תמיד במצב מושלם בכל פעם שאני מבקרת, והאורחים משאירים את הביקורות הטובות ביותר. אנשי מקצוע מעולים.',
        },
        author: "Nancy T.",
        role: { el: 'Ιδιοκτήτρια Βίλας, Καλαμάτα', en: 'Villa Owner, Kalamata', ru: 'Владелица Виллы, Каламата', tr: 'Villa Sahibi, Kalamata', bg: 'Собственик На Вила, Каламата', he: 'בעלת וילה, קלמטה' },
        rating: 5,
    },
    {
        id: 3,
        text: {
            el: 'Αυτό που ξεχωρίζει στη Homevision είναι η στρατηγική τους. Ξέρουν πώς να προσαρμόζουν τις τιμές ανάλογα με τη ζήτηση, με αποτέλεσμα η πληρότητα στα ακίνητά μου να είναι σταθερά πάνω από 85%.',
            en: 'What makes Homevision stand out is their strategy. They know how to adjust prices based on demand, resulting in my properties\' occupancy consistently being over 85%.',
            ru: 'Что отличает Homevision, так это их стратегия. Они знают, как корректировать цены в зависимости от спроса, в результате чего заполняемость моих объектов стабильно превышает 85%.',
            tr: 'Homevision\'ı öne çıkaran şey stratejileridir. Talebe göre fiyatları nasıl ayarlayacaklarını biliyorlar, bu da mülklerimin doluluk oranının sürekli %85\'in üzerinde olmasıyla sonuçlanıyor.',
            bg: 'Това, което отличава Homevision, е тяхната стратегия. Те знаят как да коригират цените според търсенето, в резултат на което заетостта на моите имоти постоянно е над 85%.',
            he: 'מה שמייחד את Homevision הוא האסטרטגיה שלהם. הם יודעים איך להתאים מחירים בהתאם לביקוש, וכתוצאה מכך התפוסה בנכסים שלי עומדת בעקביות על מעל 85%.',
        },
        author: "Andreas M.",
        role: { el: 'Επενδυτής Ακινήτων, Θεσσαλονίκη', en: 'Real Estate Investor, Thessaloniki', ru: 'Инвестор В Недвижимость, Салоники', tr: 'Gayrimenkul Yatırımcısı, Selanik', bg: 'Инвеститор В Недвижими Имоти, Солун', he: 'משקיע נדל"ן, סלוניקי' },
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
