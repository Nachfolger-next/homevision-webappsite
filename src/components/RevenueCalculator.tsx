'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import { trackEvent } from '@/components/GoogleAnalytics';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n-config';
import {
    MapPin, BedDouble, Sparkles, ArrowRight, ArrowLeft, Check,
    Waves, Droplets, User, Mail, Info, Search, Lock, Unlock,
    Home, Gem
} from 'lucide-react';

// --- Types ---
type LocationCategory = 'city' | 'mainland' | 'islands' | 'coastal' | 'unknown';
type FinishLevel = 'standard' | 'renovated' | 'luxury';

// --- Greek Region Classifier ---
const ISLAND_KEYWORDS = [
    'μύκονος', 'mykonos', 'σαντορίνη', 'santorini', 'κρήτη', 'crete', 'heraklion', 'ηράκλειο',
    'ρόδος', 'rhodes', 'κέρκυρα', 'corfu', 'ζάκυνθος', 'zakynthos', 'zante',
    'πάρος', 'paros', 'νάξος', 'naxos', 'μήλος', 'milos', 'ίος', 'ios',
    'σκιάθος', 'skiathos', 'σκόπελος', 'skopelos', 'λέσβος', 'lesbos', 'mytilene',
    'σάμος', 'samos', 'κως', 'kos', 'χίος', 'chios', 'λήμνος', 'lemnos',
    'κεφαλονιά', 'kefalonia', 'λευκάδα', 'lefkada', 'ύδρα', 'hydra', 'σπέτσες', 'spetses',
    'αίγινα', 'aegina', 'πόρος', 'poros', 'τήνος', 'tinos', 'σύρος', 'syros',
    'σέριφος', 'serifos', 'σίφνος', 'sifnos', 'αμοργός', 'amorgos', 'φολέγανδρος', 'folegandros',
    'κάρπαθος', 'karpathos', 'κάλυμνος', 'kalymnos', 'ικαρία', 'ikaria',
    'cyclades', 'κυκλάδες', 'dodecanese', 'δωδεκάνησα', 'ionian', 'ιόνια',
    'sporades', 'σποράδες', 'north aegean', 'south aegean',
];

const COASTAL_KEYWORDS = [
    'χαλκιδική', 'halkidiki', 'chalkidiki', 'kassandra', 'κασσάνδρα',
    'sithonia', 'σιθωνία', 'ouranoupoli', 'ουρανούπολη',
    'πιερία', 'pieria', 'paralia', 'παραλία', 'olympic beach',
    'πρέβεζα', 'preveza', 'πάργα', 'parga', 'σύβοτα', 'sivota',
    'tolo', 'τολό', 'ναύπλιο', 'nafplio', 'πόρτο χέλι', 'porto heli',
    'μεθώνη', 'methoni', 'κορώνη', 'koroni', 'καλαμάτα', 'kalamata',
    'γύθειο', 'gythio', 'μονεμβασιά', 'monemvasia',
    'πήλιο', 'pelion', 'volos coast',
];

const CITY_KEYWORDS = [
    'αθήνα', 'athens', 'αθηνα', 'αττική', 'attica', 'attiki',
    'πειραιάς', 'piraeus', 'γλυφάδα', 'glyfada', 'βούλα', 'voula',
    'μαρούσι', 'marousi', 'κηφισιά', 'kifisia', 'χαλάνδρι', 'chalandri',
    'νέα σμύρνη', 'nea smyrni', 'παλαιό φάληρο', 'palaio faliro',
    'θεσσαλονίκη', 'thessaloniki', 'θεσσαλονικη', 'saloniki',
    'καλαμαριά', 'kalamaria', 'πυλαία', 'pylaia', 'τούμπα', 'toumba',
    'σταυρούπολη', 'stavroupoli', 'εύοσμος', 'evosmos',
];

function classifyLocation(addressText: string): LocationCategory {
    const lower = addressText.toLowerCase();
    if (ISLAND_KEYWORDS.some(k => lower.includes(k))) return 'islands';
    if (COASTAL_KEYWORDS.some(k => lower.includes(k))) return 'coastal';
    if (CITY_KEYWORDS.some(k => lower.includes(k))) return 'city';
    if (lower.includes('greece') || lower.includes('ελλάδα') || lower.includes('ελλάς')) return 'mainland';
    return 'unknown';
}

const L = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const LOCATION_META: Record<LocationCategory, { label: Record<string, string>; multiplier: number }> = {
    city: { label: { el: 'Αθήνα / Θεσσαλονίκη', en: 'Athens / Thessaloniki', ru: 'Афины / Салоники', tr: 'Atina / Selanik', bg: 'Атина / Солун', he: 'אתונה / סלוניקי' }, multiplier: 1.15 },
    mainland: { label: { el: 'Ηπειρωτική Ελλάδα', en: 'Mainland Greece', ru: 'Материковая Греция', tr: 'Anakara Yunanistan', bg: 'Континентална Гърция', he: 'יוון היבשתית' }, multiplier: 0.85 },
    islands: { label: { el: 'Ελληνικά Νησιά', en: 'Greek Islands', ru: 'Греческие острова', tr: 'Yunan Adaları', bg: 'Гръцки острови', he: 'האיים היוונים' }, multiplier: 1.60 },
    coastal: { label: { el: 'Παραθαλάσσιο', en: 'Coastal Resort', ru: 'Прибрежный курорт', tr: 'Kıyı Tatil Yeri', bg: 'Крайбрежен курорт', he: 'אתר חוף' }, multiplier: 1.35 },
    unknown: { label: { el: 'Ελλάδα', en: 'Greece', ru: 'Греция', tr: 'Yunanistan', bg: 'Гърция', he: 'יוון' }, multiplier: 1.0 },
};

const FINISH_LEVELS: { id: FinishLevel; label: Record<string, string>; description: Record<string, string>; multiplier: number }[] = [
    { id: 'standard', label: { el: 'Τυπικό', en: 'Standard', ru: 'Стандарт', tr: 'Standart', bg: 'Стандарт', he: 'סטנדרטי' }, description: { el: 'Καθαρό & λειτουργικό', en: 'Clean & functional', ru: 'Чисто и функционально', tr: 'Temiz ve işlevsel', bg: 'Чисто и функционално', he: 'נקי ופונקציונלי' }, multiplier: 1.0 },
    { id: 'renovated', label: { el: 'Ανακαινισμένο', en: 'Renovated', ru: 'Обновлённый', tr: 'Yenilenmiş', bg: 'Ремонтиран', he: 'משופץ' }, description: { el: 'Μοντέρνο & σύγχρονο', en: 'Modern & updated', ru: 'Современный и обновлённый', tr: 'Modern ve güncel', bg: 'Модерен и обновен', he: 'מודרני ומעודכן' }, multiplier: 1.2 },
    { id: 'luxury', label: { el: 'Luxury Design', en: 'Luxury Design', ru: 'Люкс дизайн', tr: 'Lüks Tasarım', bg: 'Луксозен дизайн', he: 'עיצוב יוקרתי' }, description: { el: 'Premium φινίρισμα', en: 'Premium finishes', ru: 'Премиум отделка', tr: 'Premium bitişler', bg: 'Премиум завършване', he: 'גימורים יוקרתיים' }, multiplier: 1.5 },
];

const STEPS: Record<string, string>[] = [
    { el: 'Διεύθυνση', en: 'Property Address', ru: 'Адрес', tr: 'Adres', bg: 'Адрес', he: 'כתובת' },
    { el: 'Λεπτομέρειες', en: 'Property Details', ru: 'Детали', tr: 'Detaylar', bg: 'Детайли', he: 'פרטים' },
    { el: 'Ανάλυση', en: 'Your Analysis', ru: 'Анализ', tr: 'Analiz', bg: 'Анализ', he: 'ניתוח' },
];

// --- Animated counter hook ---
function useAnimatedCount(target: number, duration: number = 900) {
    const [current, setCurrent] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const startVal = current;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCurrent(Math.round(startVal + (target - startVal) * eased));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration]);

    return current;
}

// --- Progress Bar ---
function ProgressBar({ currentStep, lang }: { currentStep: number; lang: string }) {
    return (
        <div className="flex items-center justify-center gap-0 mb-10 md:mb-14">
            {STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                        <motion.div
                            animate={{
                                backgroundColor: idx <= currentStep ? 'var(--color-accent)' : 'var(--color-neutral-200)',
                                scale: idx === currentStep ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-default"
                        >
                            {idx < currentStep ? (
                                <Check size={14} className="text-white" />
                            ) : (
                                <span className={idx <= currentStep ? 'text-white' : 'text-[var(--color-neutral-500)]'}>
                                    {idx + 1}
                                </span>
                            )}
                        </motion.div>
                        <span className={cn(
                            "text-[9px] uppercase tracking-[0.15em] font-medium hidden md:block whitespace-nowrap",
                            idx <= currentStep ? 'text-[var(--color-accent)]' : 'text-[var(--color-neutral-400)]'
                        )}>
                            {L(step, lang)}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div className="relative w-12 md:w-20 h-[2px] mx-2 md:mx-3 mb-5 md:mb-0">
                            <div className="absolute inset-0 bg-[var(--color-neutral-200)] rounded-full" />
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-[var(--color-accent)] rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: idx < currentStep ? '100%' : '0%' }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// --- Google Places Autocomplete Hook ---
function useGooglePlaces(inputRef: React.RefObject<HTMLInputElement | null>, onSelect: (address: string) => void, googleReady: boolean) {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!googleReady || !inputRef.current || !window.google?.maps?.places) return;
        if (autocompleteRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'gr' },
            types: ['address'],
            fields: ['formatted_address', 'address_components', 'geometry'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.formatted_address) {
                onSelect(place.formatted_address);
            }
        });
    }, [inputRef, onSelect, googleReady]);
}

// --- Loading Interstitial (between Address and Details) ---
function StepLoading({ address, lang, onComplete }: { address: string; lang: string; onComplete: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const messages = [
        { el: 'Αναλύουμε δεδομένα περιοχής', en: 'Analyzing area data', ru: 'Анализ данных района', tr: 'Bölge verileri analiz ediliyor', bg: 'Анализ на данните за района', he: 'מנתח נתוני אזור' },
        { el: 'Υπολογισμός βέλτιστων εσόδων', en: 'Calculating optimal revenue', ru: 'Расчёт оптимального дохода', tr: 'Optimal gelir hesaplanıyor', bg: 'Изчисляване на оптимални приходи', he: 'חישוב הכנסות אופטימליות' },
    ];

    const [messageIndex, setMessageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => Math.min(prev + 1, messages.length - 1));
        }, 2000);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <motion.div
            key="step-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 space-y-8"
        >
            {/* Animated spinner ring */}
            <div className="relative w-20 h-20">
                {/* Outer spinning ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-[3px] border-transparent"
                    style={{ borderTopColor: 'var(--color-accent)', borderRightColor: 'var(--color-accent)' }}
                />
                {/* Inner counter-spinning ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border-[2px] border-transparent"
                    style={{ borderBottomColor: 'var(--color-warm)', borderLeftColor: 'var(--color-warm)' }}
                />
                {/* Center icon */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <MapPin size={22} className="text-[var(--color-accent)]" />
                </motion.div>
            </div>

            {/* Address being analyzed */}
            <div className="text-center space-y-3">
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[var(--color-neutral-500)] font-medium truncate max-w-xs"
                >
                    {address}
                </motion.p>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium"
                    >
                        {L(messages[messageIndex], lang)}
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                        >
                            ...
                        </motion.span>
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-warm)]"
                />
            </div>
        </motion.div>
    );
}

// --- Step 1: Address ---
function StepAddress({
    address, setAddress, onNext, googleReady, lang
}: {
    address: string; setAddress: (v: string) => void; onNext: () => void; googleReady: boolean; lang: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleSelect = useCallback((addr: string) => {
        setAddress(addr);
    }, [setAddress]);
    useGooglePlaces(inputRef, handleSelect, googleReady);

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
        >
            <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-serif text-[var(--color-text)]">{L({ el: 'Πού βρίσκεται το ακίνητό σας;', en: 'Where is your property?', ru: 'Где находится ваша недвижимость?', tr: 'Mülkünüz nerede?', bg: 'Къде е имотът ви?', he: 'איפה הנכס שלכם?' }, lang)}</h3>
            </div>

            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]" />
                <input
                    ref={inputRef}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={googleReady ? L({ el: 'Καταχωρήστε τη διεύθυνση του ακινήτου...', en: 'Enter your property address...', ru: 'Введите адрес недвижимости...', tr: 'Mülk adresinizi girin...', bg: 'Въведете адреса на имота...', he: 'הזינו את כתובת הנכס...' }, lang) : L({ el: 'π.χ. Αριστοτέλους 5, Θεσσαλονίκη', en: 'e.g. Aristotelous 5, Thessaloniki', ru: 'напр. Аристотелус 5, Салоники', tr: 'örn. Aristotelous 5, Selanik', bg: 'напр. Аристотелус 5, Солун', he: 'למשל אריסטוטלוס 5, סלוניקי' }, lang)}
                    className="w-full pl-12 pr-4 py-5 text-base border-2 border-[var(--color-neutral-200)] rounded-2xl focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all bg-white placeholder:text-[var(--color-neutral-300)]"
                    autoComplete="off"
                />
                {!googleReady && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-wider text-[var(--color-neutral-300)]">
                        {L({ el: 'Ελλάδα', en: 'Greece', ru: 'Греция', tr: 'Yunanistan', bg: 'Гърция', he: 'יוון' }, lang)}
                    </span>
                )}
            </div>


            <motion.button
                onClick={onNext}
                disabled={!address.trim()}
                whileHover={address.trim() ? { scale: 1.01 } : {}}
                whileTap={address.trim() ? { scale: 0.99 } : {}}
                className={cn(
                    "w-full py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer",
                    address.trim()
                        ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90"
                        : "bg-[var(--color-neutral-200)] text-[var(--color-neutral-400)] cursor-not-allowed"
                )}
                style={address.trim() ? { boxShadow: '0 8px 30px rgba(68, 125, 156, 0.25)' } : {}}
            >
                {L({ el: 'Ανάλυση Εσόδων', en: 'Get My Estimate', ru: 'Получить оценку', tr: 'Tahminimi Al', bg: 'Вземи оценката', he: 'קבלו הערכה' }, lang)} <ArrowRight size={16} />
            </motion.button>
        </motion.div>
    );
}

// ==============================================================
//  STEP 2 — Premium Property Details
// ==============================================================
function StepDetails({
    bedrooms, setBedrooms, finish, setFinish, seaView, setSeaView, pool, setPool, onNext, onBack, address, lang
}: {
    bedrooms: number; setBedrooms: (v: number) => void;
    finish: FinishLevel; setFinish: (v: FinishLevel) => void;
    seaView: boolean; setSeaView: (v: boolean) => void;
    pool: boolean; setPool: (v: boolean) => void;
    onNext: () => void; onBack: () => void;
    address: string; lang: string;
}) {
    const finishIcons: Record<FinishLevel, React.ReactNode> = {
        standard: <Home size={22} className="text-[var(--color-neutral-500)]" />,
        renovated: <Sparkles size={22} className="text-[var(--color-neutral-500)]" />,
        luxury: <Gem size={22} className="text-[var(--color-neutral-500)]" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-7"
        >
            <div className="text-center mb-2">
                <h3 className="text-2xl md:text-3xl font-serif text-[var(--color-text)] mb-2">{L({ el: 'Πείτε μας για το ακίνητό σας', en: 'Tell us about your property', ru: 'Расскажите о вашем объекте', tr: 'Mülkünüz hakkında bilgi verin', bg: 'Разкажете ни за имота си', he: 'ספרו לנו על הנכס' }, lang)}</h3>
                <p className="text-sm text-[var(--color-neutral-500)]">{L({ el: 'Αυτά τα στοιχεία μας βοηθούν να κάνουμε πιο ακριβή εκτίμηση', en: 'These details help us craft a more accurate estimate', ru: 'Эти детали помогают сделать оценку точнее', tr: 'Bu detaylar daha doğru tahmin yapmamıza yardımcı olur', bg: 'Тези детайли ни помагат за по-точна оценка', he: 'פרטים אלה עוזרים לנו להעריך במדויק' }, lang)}</p>
            </div>

            {/* Bedrooms — pill selector */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mb-3 flex items-center gap-2 font-medium">
                    <BedDouble size={13} /> {L({ el: 'Υπνοδωμάτια', en: 'Bedrooms', ru: 'Спальни', tr: 'Yatak Odası', bg: 'Спални', he: 'חדרי שינה' }, lang)}
                </label>
                <div className="flex gap-1.5 bg-[var(--color-neutral-100)] rounded-2xl p-1.5 relative">
                    {[1, 2, 3, 4, 5].map(num => (
                        <motion.button
                            key={num}
                            onClick={() => setBedrooms(num)}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "flex-1 py-3 text-sm rounded-xl transition-colors duration-200 font-semibold cursor-pointer relative z-10",
                                bedrooms === num
                                    ? "text-[var(--color-accent)]"
                                    : "text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
                            )}
                        >
                            {num}{num === 5 ? '+' : ''}
                            {bedrooms === num && (
                                <motion.div
                                    layoutId="bedroomPill"
                                    className="absolute inset-0 bg-white rounded-xl shadow-md"
                                    style={{ zIndex: -1 }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-neutral-200)] to-transparent" />

            {/* Finish Level — visual cards with emojis */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mb-3 flex items-center gap-2 font-medium">
                    <Sparkles size={13} /> {L({ el: 'Επίπεδο Φινιρίσματος', en: 'Finish Level', ru: 'Уровень отделки', tr: 'Finish Seviyesi', bg: 'Ниво на завършване', he: 'רמת גימור' }, lang)}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {FINISH_LEVELS.map((level) => (
                        <motion.button
                            key={level.id}
                            onClick={() => setFinish(level.id)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                                "relative p-4 text-center border-2 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden",
                                finish === level.id
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 shadow-lg shadow-[var(--color-accent)]/10"
                                    : "border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)] hover:shadow-md"
                            )}
                        >
                            <span className="block mb-2">{finishIcons[level.id]}</span>
                            <span className={cn(
                                "block text-sm font-semibold mb-0.5",
                                finish === level.id ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
                            )}>
                                {L(level.label, lang)}
                            </span>
                            <span className="block text-[10px] text-[var(--color-neutral-400)] leading-tight">{L(level.description, lang)}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-neutral-200)] to-transparent" />

            {/* Premium Features toggles */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-neutral-500)] mb-3 font-medium">
                    {L({ el: 'Premium Χαρακτηριστικά', en: 'Premium Features', ru: 'Премиум характеристики', tr: 'Premium Özellikler', bg: 'Премиум характеристики', he: 'תכונות פרמיום' }, lang)}
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        onClick={() => setSeaView(!seaView)}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                            "relative flex flex-col items-center gap-2 p-5 border-2 rounded-2xl transition-all duration-300 cursor-pointer",
                            seaView
                                ? "border-[var(--color-accent)] bg-gradient-to-b from-[var(--color-accent)]/10 to-[var(--color-accent)]/5 shadow-lg shadow-[var(--color-accent)]/10"
                                : "border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)] hover:shadow-md"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                            seaView ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)]"
                        )}>
                            <Waves size={18} />
                        </div>
                        <span className={cn("text-sm font-semibold", seaView ? "text-[var(--color-accent)]" : "text-[var(--color-text)]")}>{L({ el: 'Θέα Θάλασσα', en: 'Sea View', ru: 'Вид на море', tr: 'Deniz Manzarası', bg: 'Морска гледка', he: 'נוף לים' }, lang)}</span>
                        <span className="text-[10px] text-[var(--color-neutral-400)]">+40% {L({ el: 'έσοδα', en: 'revenue', ru: 'доход', tr: 'gelir', bg: 'приходи', he: 'הכנסות' }, lang)}</span>
                        <div className={cn(
                            "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            seaView ? "border-[var(--color-accent)] bg-[var(--color-accent)]" : "border-[var(--color-neutral-300)]"
                        )}>
                            {seaView && <Check size={11} className="text-white" />}
                        </div>
                    </motion.button>

                    <motion.button
                        onClick={() => setPool(!pool)}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                            "relative flex flex-col items-center gap-2 p-5 border-2 rounded-2xl transition-all duration-300 cursor-pointer",
                            pool
                                ? "border-[var(--color-accent)] bg-gradient-to-b from-[var(--color-accent)]/10 to-[var(--color-accent)]/5 shadow-lg shadow-[var(--color-accent)]/10"
                                : "border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)] hover:shadow-md"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                            pool ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)]"
                        )}>
                            <Droplets size={18} />
                        </div>
                        <span className={cn("text-sm font-semibold", pool ? "text-[var(--color-accent)]" : "text-[var(--color-text)]")}>{L({ el: 'Πισίνα', en: 'Pool', ru: 'Бассейн', tr: 'Havuz', bg: 'Басейн', he: 'בריכה' }, lang)}</span>
                        <span className="text-[10px] text-[var(--color-neutral-400)]">+25% {L({ el: 'έσοδα', en: 'revenue', ru: 'доход', tr: 'gelir', bg: 'приходи', he: 'הכנסות' }, lang)}</span>
                        <div className={cn(
                            "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            pool ? "border-[var(--color-accent)] bg-[var(--color-accent)]" : "border-[var(--color-neutral-300)]"
                        )}>
                            {pool && <Check size={11} className="text-white" />}
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-3 pt-2">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 px-6 py-4 text-sm border border-[var(--color-neutral-200)] rounded-xl text-[var(--color-neutral-500)] hover:border-[var(--color-neutral-400)] transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} />
                </button>
                <motion.button
                    onClick={onNext}
                    whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(68, 125, 156, 0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 bg-[var(--color-accent)] text-white py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-accent)]/90 transition-colors cursor-pointer"
                    style={{ boxShadow: '0 8px 30px rgba(68, 125, 156, 0.25)' }}
                >
                    {L({ el: 'Δείτε την Εκτίμηση', en: 'See My Estimate', ru: 'Моя оценка', tr: 'Tahminimi Gör', bg: 'Виж оценката', he: 'ראה הערכה' }, lang)} <ArrowRight size={16} />
                </motion.button>
            </motion.div>

        </motion.div>
    );
}

// ==============================================================
//  STEP 3 — Golden Lock Gate + Estimate Reveal
// ==============================================================
function StepReveal({
    revenue, address, bedrooms, finish, seaView, pool, onBack, lang
}: {
    revenue: { min: number; max: number };
    address: string; bedrooms: number; finish: FinishLevel; seaView: boolean; pool: boolean;
    onBack: () => void; lang: string;
}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [wantsAnalysis, setWantsAnalysis] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [wantsAnalysisFinal, setWantsAnalysisFinal] = useState(false);
    const animatedMin = useAnimatedCount(unlocked ? revenue.min : 0, 2000);
    const animatedMax = useAnimatedCount(unlocked ? revenue.max : 0, 2000);
    const locationCat = classifyLocation(address);
    const finishLabel = FINISH_LEVELS.find(f => f.id === finish)?.label || { en: '' };

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || submitting) return;

        setSubmitting(true);

        // Cinematic scanning delay - 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Send lead to API
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, wantsAnalysis, address, bedrooms, finish, seaView, pool, revenue }),
            });
            trackEvent('lead_submit', 'Calculator', 'Revenue Estimate Unlocked', revenue.min);
        } catch (err) {
            console.error('Failed to send lead:', err);
        }

        // Always unlock — even if email fails, the lead had a good experience
        // Store preference for the final screen
        setWantsAnalysisFinal(wantsAnalysis);

        // Slow down the sequence for dramatic effect (extended to 6 seconds)
        setUnlocked(true);
        setTimeout(() => setSubmitted(true), 8000);
    };

    // Success state
    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-5">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"
                >
                    <Check size={28} className="text-emerald-600" />
                </motion.div>
                <h3 className="text-2xl font-serif text-[var(--color-text)]">{L({ el: 'Ευχαριστούμε,', en: 'Thank you,', ru: 'Спасибо,', tr: 'Teşekkürler,', bg: 'Благодарим,', he: 'תודה,' }, lang)} {name}!</h3>
                <p className="text-sm text-[var(--color-neutral-500)] max-w-sm mx-auto leading-relaxed">
                    {wantsAnalysisFinal
                        ? L({ el: 'Η ομάδα μας θα επικοινωνήσει μαζί σας εντός 24 ωρών με λεπτομερή ανάλυση.', en: 'Our team will reach out within 24 hours with a detailed, personalized analysis of your property\u0027s revenue potential.', ru: 'Наша команда свяжется с вами в течение 24 часов.', tr: 'Ekibimiz 24 saat içinde detaylı analiz ile sizinle iletişime geçecektir.', bg: 'Нашият екип ще се свърже с εσάς до 24 часа.', he: 'הצוות שלנו ייצור קשר תוך 24 שעות.' }, lang)
                        : L({ el: 'Η εκτίμησή σας αποθηκεύτηκε. Μη διστάσετε να επικοινωνήσετε μαζί μας αν χρειαστείτε βοήθεια.', en: 'Your estimate has been saved. Feel free to reach out if you need any assistance managing your property.', ru: 'Ваша оценка сохранена. Обращайтесь к нам за помощью.', tr: 'Tahmininiz kaydedildi. Yardıma ihtiyacınız olursa bizimle iletişime geçmekten çekinmeyin.', bg: 'Оценката ви е запазена. Свържете се с εμάς при нужда.', he: 'ההערכה שלכם נשמרה. צרו קשר אם תצטרכו עזרה.' }, lang)}
                </p>
                <div className="bg-[var(--color-surface)] rounded-2xl p-5 inline-block">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-neutral-400)] block mb-1">{L({ el: 'Εκτιμώμενα έσοδα', en: 'Your estimated revenue', ru: 'Ваш ориентировочный доход', tr: 'Tahmini geliriniz', bg: 'Ориентировъчен приход', he: 'הכנסה משוערת' }, lang)}</span>
                    <span className="text-2xl font-serif text-[var(--color-accent)]">
                        €{revenue.min.toLocaleString()} — €{revenue.max.toLocaleString()}
                        <span className="text-base text-[var(--color-accent)]/60">/{L({ el: 'μήνα', en: 'mo', ru: 'мес', tr: 'ay', bg: 'мес', he: 'חודש' }, lang)}</span>
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
        >
            {/* Revenue Card with Lock Overlay */}
            <div className="relative">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[var(--color-accent)] text-white rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 uppercase tracking-[0.2em] text-[10px] font-medium relative z-10 block mb-3"
                    >
                        {L({ el: 'Εκτιμώμενα Μηνιαία Έσοδα', en: 'Estimated Monthly Revenue', ru: 'Ориентировочный месячный доход', tr: 'Tahmini Aylık Gelir', bg: 'Приблизителен месечен приход', he: 'הכנסה חודשית משוערת' }, lang)}
                    </motion.span>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", bounce: 0.3 }}
                        className="flex items-baseline justify-center gap-3 relative z-10"
                    >
                        <span className="text-4xl md:text-6xl font-serif font-light tracking-[-0.02em]">
                            €{animatedMin.toLocaleString()}
                        </span>
                        <span className="text-xl opacity-40 font-serif">—</span>
                        <span className="text-4xl md:text-6xl font-serif font-light tracking-[-0.02em]">
                            €{animatedMax.toLocaleString()}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: unlocked ? 1 : 0.5 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center gap-3 md:gap-5 mt-5 relative z-10 flex-wrap"
                    >
                        {[
                            { label: L({ el: 'Περιοχή', en: 'Region', ru: 'Регион', tr: 'Bölge', bg: 'Регион', he: 'אזור' }, lang), value: L(LOCATION_META[locationCat].label, lang) },
                            { label: L({ el: 'Υπνοδωμάτια', en: 'Bedrooms', ru: 'Спальни', tr: 'Yatak', bg: 'Спални', he: 'חדרים' }, lang), value: `${bedrooms}${bedrooms === 5 ? '+' : ''}` },
                            { label: L({ el: 'Φινίρισμα', en: 'Finish', ru: 'Отделка', tr: 'Finish', bg: 'Завършване', he: 'גימור' }, lang), value: typeof finishLabel === 'string' ? finishLabel : L(finishLabel, lang) },
                            ...(seaView ? [{ label: L({ el: 'Χαρακτηριστικό', en: 'Feature', ru: 'Особенность', tr: 'Özellik', bg: 'Характеристика', he: 'תכונה' }, lang), value: L({ el: 'Θέα Θάλασσα', en: 'Sea View', ru: 'Вид на море', tr: 'Deniz', bg: 'Море', he: 'ים' }, lang) }] : []),
                            ...(pool ? [{ label: L({ el: 'Χαρακτηριστικό', en: 'Feature', ru: 'Особенность', tr: 'Özellik', bg: 'Характеристика', he: 'תכונה' }, lang), value: L({ el: 'Πισίνα', en: 'Pool', ru: 'Бассейн', tr: 'Havuz', bg: 'Басейн', he: 'בריכה' }, lang) }] : []),
                        ].map(item => (
                            <div key={item.label + item.value} className="text-center">
                                <span className="text-white/35 text-[8px] uppercase tracking-[0.15em] block">{item.label}</span>
                                <span className="text-white/85 text-[11px] font-medium">{item.value}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ========== GOLDEN LOCK OVERLAY ========== */}
                <AnimatePresence>
                    {!unlocked && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{
                                opacity: 0,
                                scale: 1.15,
                                filter: 'blur(20px)',
                            }}
                            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-20"
                            style={{
                                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.78) 0%, rgba(68, 125, 156, 0.68) 100%)',
                                backdropFilter: 'blur(14px)',
                                WebkitBackdropFilter: 'blur(14px)',
                            }}
                        >
                            {/* Shimmer ring — pulses every 4 seconds */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 0 0 rgba(201, 169, 110, 0)',
                                        '0 0 0 12px rgba(201, 169, 110, 0.25)',
                                        '0 0 0 24px rgba(201, 169, 110, 0)',
                                    ],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    repeatDelay: 1.5,
                                    ease: 'easeOut',
                                }}
                                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(232, 213, 163, 0.1) 100%)',
                                    border: '1px solid rgba(201, 169, 110, 0.3)',
                                }}
                            >
                                <motion.div
                                    animate={{
                                        rotate: [0, -8, 8, -4, 0],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 0.7,
                                        repeat: Infinity,
                                        repeatDelay: 3.3,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <Lock
                                        size={32}
                                        className="drop-shadow-lg"
                                        style={{ color: '#c9a96e', filter: 'drop-shadow(0 0 8px rgba(201, 169, 110, 0.5))' }}
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-white/90 text-base font-medium mb-1 font-serif text-center px-6"
                            >
                                {submitting
                                    ? L({ el: 'Αναλύουμε το ακίνητό σας...', en: 'Analyzing your property...', ru: 'Анализируем ваш объект...', tr: 'Mülkünüz analiz ediliyor...', bg: 'Анализираме имота ви...', he: 'מנתח את הנכס שלכם...' }, lang)
                                    : L({ el: 'Η εκτίμησή σας είναι έτοιμη', en: 'Your estimate is ready', ru: 'Ваша оценка готова', tr: 'Tahmininiz hazır', bg: 'Оценката ви ετοιμη', he: 'ההערכה שלכם מוכנה' }, lang)}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/40 text-xs tracking-wide text-center"
                            >
                                {submitting
                                    ? L({ el: 'Δημιουργία εξατομικευμένης αναφοράς σε εξέλιξη', en: 'Generating your personalized report', ru: 'Генерация отчёта', tr: 'Kişiselleştirilmiş rapor oluşturuluyor', bg: 'Генериране на отчет', he: 'מפיק דוח מותאם אישית' }, lang)
                                    : L({ el: 'Συμπληρώστε τα στοιχεία σας για ξεκλείδωμα', en: 'Enter your details below to unlock', ru: 'Введите данные для разблокировки', tr: 'Kilidi açmak için bilgilerinizi girin', bg: 'Въведете данните си за ξεκλείδване', he: 'הזינו פרטים לפתיחה' }, lang)}
                            </motion.p>

                            {submitting && (
                                <motion.div
                                    className="absolute inset-x-0 bottom-0 h-1 bg-white/20"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 3, ease: "linear" }}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Disclaimer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-[var(--color-neutral-400)] text-center leading-relaxed"
            >
                {L({ el: 'Αυτή είναι μια προσεγγιστική εκτίμηση βάσει δεδομένων αγοράς.', en: 'This is a rough estimate based on market data.', ru: 'Это приблизительная оценка.', tr: 'Bu piyasa verilerine dayalı tahmini bir değerdir.', bg: 'Това е приблизителна оценка.', he: 'זו הערכה משוערת בלבד.' }, lang)}
            </motion.p>

            {/* Lead Capture / Unlocked state */}
            <AnimatePresence mode="wait">
                {!unlocked ? (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="relative">
                                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={L({ el: 'Το όνομά σας', en: 'Your name', ru: 'Ваше имя', tr: 'Adınız', bg: 'Вашето име', he: 'השם שלכם' }, lang)}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 text-sm border border-[var(--color-neutral-200)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all bg-white placeholder:text-[var(--color-neutral-300)]"
                                />
                            </div>
                            <div className="relative">
                                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 text-sm border border-[var(--color-neutral-200)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all bg-white placeholder:text-[var(--color-neutral-300)]"
                                />
                            </div>
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={L({ el: 'Τηλέφωνο (προαιρετικό)', en: 'Phone (optional)', ru: 'Телефон (опционально)', tr: 'Telefon (isteğe bağlı)', bg: 'Телефон (незадължително)', he: 'טלפון (אופציונלי)' }, lang)}
                                    className="w-full pl-11 pr-4 py-3.5 text-sm border border-[var(--color-neutral-200)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all bg-white placeholder:text-[var(--color-neutral-300)]"
                                />
                            </div>
                        </div>

                        {/* Opt-in checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer group py-1">
                            <input
                                type="checkbox"
                                checked={wantsAnalysis}
                                onChange={(e) => setWantsAnalysis(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-[var(--color-neutral-300)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]/20 cursor-pointer accent-[var(--color-accent)]"
                            />
                            <span className="text-xs text-[var(--color-neutral-500)] leading-relaxed group-hover:text-[var(--color-neutral-600)] transition-colors">
                                {L({ el: 'Θα ήθελα μια', en: 'I\u0027d like a', ru: 'Хочу', tr: 'Ekibinizden', bg: 'Бих искал/а', he: 'אשמח ל' }, lang)} <strong className="text-[var(--color-text)]">{L({ el: 'δωρεάν ανάλυση', en: 'free detailed analysis', ru: 'бесплатный анализ', tr: 'ücretsiz analiz', bg: 'безплатен анализ', he: 'ניתוח חינם' }, lang)}</strong> {L({ el: 'από την ομάδα σας', en: 'from your team', ru: 'от вашей команды', tr: 'ücretsiz analiz istiyorum', bg: 'от вашия екип', he: 'מהצוות שלכם' }, lang)}
                            </span>
                        </label>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(201, 169, 110, 0.4)' }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-3 transition-all cursor-pointer text-white"
                            style={{
                                background: 'linear-gradient(135deg, #b8963d 0%, #e8d5a3 40%, #c9a96e 70%, #b8963d 100%)',
                                backgroundSize: '200% 200%',
                                animation: 'goldShimmer 3s ease-in-out infinite',
                                boxShadow: '0 8px 30px rgba(201, 169, 110, 0.35)',
                            }}
                        >
                            {submitting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    Unlocking...
                                </>
                            ) : (
                                <>
                                    <Lock size={15} />
                                    {L({ el: 'Ξεκλειδώστε την Εκτίμηση', en: 'Unlock My Estimate', ru: 'Разблокировать', tr: 'Tahminimi Aç', bg: 'Отключи оценката', he: 'פתח הערכה' }, lang)}
                                </>
                            )}
                        </motion.button>

                        <div className="flex items-center justify-center gap-4 md:gap-6 pt-2 flex-wrap">
                            {[L({ el: 'Χωρίς δέσμευση', en: 'No commitment', ru: 'Без обязательств', tr: 'Taahhüt yok', bg: 'Без ангажимент', he: 'ללא התחייבות' }, lang), L({ el: 'Χωρίς spam', en: 'No spam', ru: 'Без спама', tr: 'Spam yok', bg: 'Без спам', he: 'ללא ספאם' }, lang), L({ el: 'Άμεσο αποτέλεσμα', en: 'Instant result', ru: 'Мгновенный результат', tr: 'Anlık sonuç', bg: 'Мигновен резултат', he: 'תוצאה מיידית' }, lang)].map((signal) => (
                                <span key={signal} className="flex items-center gap-1.5 text-[11px] text-[var(--color-neutral-400)]">
                                    <Check size={11} className="text-emerald-500" /> {signal}
                                </span>
                            ))}
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        key="revealed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: "spring", bounce: 0.2 }}
                        className="text-center py-4 space-y-3"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                            style={{ background: 'linear-gradient(135deg, #c9a96e, #e8d5a3)' }}
                        >
                            <Unlock size={20} className="text-white" />
                        </motion.div>
                        <p className="text-sm font-medium text-[var(--color-text)]">{L({ el: 'Εκτίμηση ξεκλειδώθηκε!', en: 'Estimate unlocked!', ru: 'Оценка разблокирована!', tr: 'Tahmin açıldı!', bg: 'Оценката е отключена!', he: 'ההערכה נפתחה!' }, lang)}</p>
                        <p className="text-xs text-[var(--color-neutral-500)]">{L({ el: 'Η ομάδα μας θα επικοινωνήσει εντός 24 ωρών.', en: 'Our team will contact you within 24 hours with a detailed analysis.', ru: 'Наша команда свяжется с вами в течение 24 часов.', tr: 'Ekibimiz 24 saat içinde detaylı analiz ile iletişime geçecektir.', bg: 'Нашият екип ще се свърже до 24 часа.', he: 'הצוות שלנו ייצור קשר תוך 24 שעות.' }, lang)}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] transition-colors mx-auto cursor-pointer"
            >
                <ArrowLeft size={14} /> {L({ el: 'Αλλάξτε τις λεπτομέρειες', en: 'Adjust property details', ru: 'Изменить данные', tr: 'Detayları düzenle', bg: 'Променете детайлите', he: 'שנה פרטים' }, lang)}
            </button>
        </motion.div>
    );
}

// --- Google Maps Script Loader ---
function GoogleMapsLoader({ onLoad }: { onLoad: () => void }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    return (
        <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
            strategy="afterInteractive"
            onLoad={onLoad}
        />
    );
}

// --- Main Component ---
export default function RevenueCalculator({ lang }: { lang: Locale }) {
    const [step, setStep] = useState(0);
    const [address, setAddress] = useState('');
    const [googleReady, setGoogleReady] = useState(false);
    const [bedrooms, setBedrooms] = useState(2);
    const [finish, setFinish] = useState<FinishLevel>('renovated');
    const [seaView, setSeaView] = useState(false);
    const [pool, setPool] = useState(false);

    const calculateRevenue = () => {
        const baseRate = 800;
        const locationCat = classifyLocation(address);
        const locMult = LOCATION_META[locationCat].multiplier;
        const finishMult = FINISH_LEVELS.find(f => f.id === finish)?.multiplier || 1;
        const bedMult = 1 + (bedrooms - 1) * 0.4;
        const seaViewMult = seaView ? 1.4 : 1.0;
        const poolMult = pool ? 1.25 : 1.0;
        const total = baseRate * locMult * finishMult * bedMult * seaViewMult * poolMult;
        return {
            min: Math.round(total * 0.85),
            max: Math.round(total * 1.15)
        };
    };

    const revenue = calculateRevenue();

    return (
        <>
            <GoogleMapsLoader onLoad={() => setGoogleReady(true)} />
            <section className="py-20 md:py-32 bg-[#f8f5f0] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-accent)] opacity-[0.02] rounded-full blur-3xl pointer-events-none" />

                <div className="container relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                        <span className="editorial-rule editorial-rule--accent mb-6 block mx-auto" />
                        <h2 className="text-4xl md:text-6xl font-serif mb-4 tracking-[-0.03em]">
                            {({ el: 'Πόσα Μπορεί να Κερδίσει το Ακίνητό σας;', en: 'How Much Can Your Property Earn?', ru: 'Сколько может заработать ваша недвижимость?', tr: 'Mülkünüz Ne Kadar Kazanabilir?', bg: 'Колко може да спечели имотът ви?', he: 'כמה הנכס שלכם יכול להרוויח?' }[lang] || 'How Much Can Your Property Earn?')}
                        </h2>
                        <p className="text-base text-[var(--color-neutral-500)] max-w-lg mx-auto">
                            {({ el: 'Ανακαλύψτε την πραγματική του αξία. Δωρεάν εκτίμηση εσόδων σε μόλις 60 δευτερόλεπτα.', en: 'See what your Greek property could earn — even while you\'re abroad. Free estimate in 60 seconds.', ru: 'Узнайте, сколько может приносить ваша недвижимость в Греции — даже на расстоянии. Бесплатная оценка за 60 секунд.', tr: 'Yunanistan\'daki mülkünüzün ne kadar kazanabileceğini görün — yurt dışındayken bile. 60 saniyede ücretsiz tahmin.', bg: 'Вижте колко може да печели имотът ви в Гърция — дори когато сте в чужбина. Безплатна оценка за 60 секунди.', he: 'גלו כמה הנכס שלכם ביוון יכול להרוויח — גם כשאתם בחו"ל. הערכה חינם תוך 60 שניות.' }[lang] || 'See what your Greek property could earn — even while you\'re abroad. Free estimate in 60 seconds.')}
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <div
                            className="bg-white p-8 md:p-12 rounded-2xl border border-[var(--color-neutral-200)]"
                            style={{ boxShadow: '0 4px 60px rgba(68, 125, 156, 0.08)' }}
                        >
                            <ProgressBar currentStep={step} lang={lang} />

                            <AnimatePresence mode="wait">
                                {step === 0 && (
                                    <StepAddress
                                        key="step-address"
                                        address={address}
                                        setAddress={setAddress}
                                        onNext={() => setStep(0.5)}
                                        googleReady={googleReady}
                                        lang={lang}
                                    />
                                )}
                                {step === 0.5 && (
                                    <StepLoading
                                        key="step-loading"
                                        address={address}
                                        lang={lang}
                                        onComplete={() => setStep(1)}
                                    />
                                )}
                                {step === 1 && (
                                    <StepDetails
                                        key="step-details"
                                        bedrooms={bedrooms} setBedrooms={setBedrooms}
                                        finish={finish} setFinish={setFinish}
                                        seaView={seaView} setSeaView={setSeaView}
                                        pool={pool} setPool={setPool}
                                        onNext={() => setStep(2)}
                                        onBack={() => setStep(0)}
                                        address={address}
                                        lang={lang}
                                    />
                                )}
                                {step === 2 && (
                                    <StepReveal
                                        key="step-reveal"
                                        revenue={revenue}
                                        address={address} bedrooms={bedrooms} finish={finish}
                                        seaView={seaView} pool={pool}
                                        onBack={() => setStep(1)}
                                        lang={lang}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
