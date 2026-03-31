import { Locale } from '@/i18n-config';
import { getAlternates } from '@/lib/metadata';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const getLocalized = (obj: Record<string, string>, lang: string) => obj[lang] || obj['en'] || '';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const title = lang === 'el' ? 'Πολιτική Απορρήτου | Homevision' : 'Privacy Policy | Homevision';
    const description = lang === 'el'
        ? 'Πολιτική Απορρήτου και προστασία δεδομένων της Homevision.'
        : 'Privacy Policy and data protection for Homevision property management.';
    return { title, description, alternates: getAlternates('/privacy') };
}

const labels = {
    title: { el: 'Πολιτική Απορρήτου', en: 'Privacy Policy', ru: 'Политика конфиденциальности', tr: 'Gizlilik Politikası', bg: 'Политика за поверителност', he: 'מדיניות פרטיות' },
    lastUpdated: { el: 'Τελευταία ενημέρωση: Φεβρουάριος 2026', en: 'Last updated: February 2026', ru: 'Последнее обновление: Февраль 2026', tr: 'Son güncelleme: Şubat 2026', bg: 'Последна актуализация: Февруари 2026', he: 'עדכון אחרון: פברואר 2026' },
};

export default async function PrivacyPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const isGreek = lang === 'el';

    const content = isGreek ? (
        <>
            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">1. Εισαγωγή</h2>
                <p className="mb-4">
                    Η Homevision ΙΚΕ (&quot;εμείς&quot;, &quot;εμάς&quot;, &quot;μας&quot;) σέβεται το απόρρητό σας και δεσμεύεται να προστατεύει
                    τα προσωπικά σας δεδομένα σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR) (ΕΕ) 2016/679.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">2. Ποια Δεδομένα Συλλέγουμε</h2>
                <p className="mb-4">Μπορεί να συλλέξουμε και να επεξεργαστούμε τα ακόλουθα δεδομένα:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Προσωπικά στοιχεία αναγνώρισης (Όνομα, Επώνυμο, ΑΦΜ).</li>
                    <li>Στοιχεία επικοινωνίας (Email, Τηλέφωνο, Διεύθυνση Ακινήτου).</li>
                    <li>Οικονομικά δεδομένα (Στοιχεία λογαριασμού για καταβολή εσόδων).</li>
                    <li>Δεδομένα χρήσης ιστοτόπου (μέσω cookies, για ανώνυμη ανάλυση).</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">3. Πώς Χρησιμοποιούμε τα Δεδομένα Σας</h2>
                <p className="mb-4">Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Την παροχή των υπηρεσιών διαχείρισης ακινήτων.</li>
                    <li>Την επικοινωνία μαζί σας σχετικά με το ακίνητό σας.</li>
                    <li>Τη συμμόρφωση με τις νομικές και φορολογικές μας υποχρεώσεις.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">4. Τα Δικαιώματά Σας</h2>
                <p className="mb-4">
                    Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής, ή περιορισμού της επεξεργασίας των δεδομένων σας.
                    Για κάθε σχετικό αίτημα, επικοινωνήστε μαζί μας στο info@homevision.gr.
                </p>
            </section>
        </>
    ) : (
        <>
            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">1. Introduction</h2>
                <p className="mb-4">
                    Homevision IKE (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy and is committed to protecting
                    your personal data in compliance with the General Data Protection Regulation (GDPR) (EU) 2016/679.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">2. The Data We Collect</h2>
                <p className="mb-4">We may collect and process the following data:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Identity Data (First name, Last name, Tax info).</li>
                    <li>Contact Data (Email address, Telephone number, Property address).</li>
                    <li>Financial Data (Bank account details for revenue payouts).</li>
                    <li>Usage Data (via cookies, for anonymous analytics).</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">3. How We Use Your Data</h2>
                <p className="mb-4">Your data is used exclusively to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Provide our property management services to you.</li>
                    <li>Communicate with you regarding your property.</li>
                    <li>Comply with our legal and tax obligations.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">4. Your Rights</h2>
                <p className="mb-4">
                    You have the right to access, rectify, erase, or restrict the processing of your data.
                    For any privacy-related requests, contact us at info@homevision.gr.
                </p>
            </section>
        </>
    );

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Header lang={lang} />
            <div className="flex-1 pt-32 pb-24 font-sans text-[var(--color-text)] text-base/relaxed">
                <div className="container max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-[-0.03em]">{getLocalized(labels.title, lang)}</h1>
                    <p className="text-[var(--color-neutral-500)] text-sm mb-12 uppercase tracking-wide">{getLocalized(labels.lastUpdated, lang)}</p>
                    <div className="prose prose-neutral max-w-none">
                        {content}
                    </div>
                </div>
            </div>
            <Footer lang={lang} />
        </main>
    );
}
