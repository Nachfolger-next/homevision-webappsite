import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n-config';

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

const labels = {
    tagline: { el: 'Ανεβάζουμε τη διαχείριση ακινήτων σε τέχνη.', en: 'Elevating property management to an art form.', ru: 'Управление недвижимостью как искусство.', tr: 'Mülk yönetimini sanata dönüştürüyoruz.', bg: 'Издигаме управлението на имоти до изкуство.', he: 'מעלים את ניהול הנכסים לאמנות.' },
    locations: { el: 'Θεσσαλονίκη • Χαλκιδική • Αθήνα • Νησιά', en: 'Thessaloniki • Chalkidiki • Athens • Islands', ru: 'Салоники • Халкидики • Афины • Острова', tr: 'Selanik • Halkidiki • Atina • Adalar', bg: 'Солун • Халкидики • Атина • Острови', he: 'סלוניקי • חלקידיקי • אתונה • איים' },
    company: { el: 'Εταιρεία', en: 'Company', ru: 'Компания', tr: 'Şirket', bg: 'Компания', he: 'חברה' },
    aboutUs: { el: 'Η Εταιρεία', en: 'About Us', ru: 'О нас', tr: 'Hakkımızda', bg: 'За нас', he: 'אודות' },
    services: { el: 'Υπηρεσίες', en: 'Services', ru: 'Услуги', tr: 'Hizmetler', bg: 'Услуги', he: 'שירותים' },
    owners: { el: 'Ιδιοκτήτες', en: 'Owners', ru: 'Владельцам', tr: 'Sahipler', bg: 'За собственици', he: 'בעלים' },
    fullManagement: { el: 'Πλήρης Διαχείριση', en: 'Full Management', ru: 'Полное управление', tr: 'Tam Yönetim', bg: 'Пълно управление', he: 'ניהול מלא' },
    digitalManagement: { el: 'Digital Διαχείριση', en: 'Digital Management', ru: 'Цифровое управление', tr: 'Dijital Yönetim', bg: 'Дигитално управление', he: 'ניהול דיגיטלי' },
    revenueCalculator: { el: 'Υπολογιστής Εσόδων', en: 'Revenue Calculator', ru: 'Калькулятор дохода', tr: 'Gelir Hesaplayıcı', bg: 'Калкулатор на приходи', he: 'מחשבון הכנסות' },
    contact: { el: 'Επικοινωνία', en: 'Contact', ru: 'Контакты', tr: 'İletişim', bg: 'Контакт', he: 'צור קשר' },
    address: { el: 'Θεσσαλονίκη, Ελλάδα', en: 'Thessaloniki, Greece', ru: 'Салоники, Греция', tr: 'Selanik, Yunanistan', bg: 'Солун, Гърция', he: 'סלוניקי, יוון' },
    copyright: { el: 'Με επιφύλαξη παντός δικαιώματος.', en: 'All rights reserved.', ru: 'Все права защищены.', tr: 'Tüm hakları saklıdır.', bg: 'Всички права запазени.', he: 'כל הזכויות שמורות.' },
    privacy: { el: 'Απόρρητο', en: 'Privacy', ru: 'Конфиденциальность', tr: 'Gizlilik', bg: 'Поверителност', he: 'פרטיות' },
    terms: { el: 'Όροι', en: 'Terms', ru: 'Условия', tr: 'Şartlar', bg: 'Условия', he: 'תנאים' },
};

export default function Footer({ lang = 'en' as Locale }: { lang?: Locale }) {
    return (
        <footer className="bg-[#111] text-white/60 relative">
            <div className="container pt-24 pb-8">
                {/* Brand gradient line — signature element */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40 mb-16" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Image
                            src="/logo-white.png"
                            alt="Homevision"
                            width={160}
                            height={36}
                            className="h-7 w-auto object-contain mb-4"
                        />
                        <p className="text-sm leading-relaxed text-white/30 max-w-xs">
                            {getLocalized(labels.tagline, lang)}<br />
                            {getLocalized(labels.locations, lang)}
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-medium mb-4 block">{getLocalized(labels.company, lang)}</span>
                        <ul className="space-y-3">
                            <li><Link href={`/${lang}/about`} className="text-sm hover:text-white transition-colors">{getLocalized(labels.aboutUs, lang)}</Link></li>
                            <li><Link href={`/${lang}/services`} className="text-sm hover:text-white transition-colors">{getLocalized(labels.services, lang)}</Link></li>
                            <li><Link href={`/${lang}/portfolio`} className="text-sm hover:text-white transition-colors">Portfolio</Link></li>
                            {lang === 'el' && <li><Link href={`/${lang}/journal`} className="text-sm hover:text-white transition-colors">Journal</Link></li>}
                        </ul>
                    </div>

                    {/* Owners */}
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-medium mb-4 block">{getLocalized(labels.owners, lang)}</span>
                        <ul className="space-y-3">
                            <li><Link href={`/${lang}/management`} className="text-sm hover:text-white transition-colors">{getLocalized(labels.fullManagement, lang)}</Link></li>
                            <li><Link href={`/${lang}/digital`} className="text-sm hover:text-white transition-colors">{getLocalized(labels.digitalManagement, lang)}</Link></li>
                            <li><Link href={`/${lang}/services`} className="text-sm hover:text-white transition-colors">{getLocalized(labels.revenueCalculator, lang)}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-medium mb-4 block">{getLocalized(labels.contact, lang)}</span>
                        <ul className="space-y-3 text-sm">
                            <li>+30 694 941 3865</li>
                            <li>info@homevision.gr</li>
                            <li>Εδμόνδου Ροστάν 9, 54641</li>
                            <li>{getLocalized(labels.address, lang)}</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-white/20 tracking-wider">© 2026 Homevision IKE. {getLocalized(labels.copyright, lang)}</p>
                    <div className="flex gap-6">
                        <Link href={`/${lang}/privacy`} className="text-[11px] text-white/20 hover:text-white transition-colors tracking-wider">{getLocalized(labels.privacy, lang)}</Link>
                        <Link href={`/${lang}/terms`} className="text-[11px] text-white/20 hover:text-white transition-colors tracking-wider">{getLocalized(labels.terms, lang)}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
