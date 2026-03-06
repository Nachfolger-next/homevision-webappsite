import { Locale } from '@/i18n-config';
import { getAlternates } from '@/lib/metadata';

export const metadata = {
    title: 'Όροι Χρήσης | Homevision',
    description: 'Όροι Χρήσης και παροχής υπηρεσιών της Homevision.',
    alternates: getAlternates('/terms'),
};

export default function TermsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const isGreek = lang === 'el';

    const title = isGreek ? 'Όροι Χρήσης' : 'Terms of Service';
    const lastUpdated = isGreek ? 'Τελευταία ενημέρωση: Φεβρουάριος 2026' : 'Last updated: February 2026';

    const content = isGreek ? (
        <>
            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">1. Αποδοχή Όρων</h2>
                <p className="mb-4">
                    Με την πρόσβαση και τη χρήση του ιστοτόπου μας ή την ανάθεση της διαχείρισης
                    του ακινήτου σας στην Homevision, αποδέχεστε πλήρως τους παρόντες όρους χρήσης.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">2. Παρεχόμενες Υπηρεσίες</h2>
                <p className="mb-4">
                    Η Homevision παρέχει υπηρεσίες διαχείρισης βραχυχρόνιας μίσθωσης, συμπεριλαμβανομένης
                    ενδεικτικά της διαδικτυακής προώθησης, επικοινωνίας με επισκέπτες, συντήρησης και καθαρισμού ακινήτων.
                    Οι ακριβείς υπηρεσίες και αμοιβές καθορίζονται στη διμερή ιδιωτική σύμβαση που υπογράφεται
                    ανάμεσα στην εταιρεία και τον ιδιοκτήτη.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">3. Ευθύνες Ιδιοκτήτη</h2>
                <p className="mb-4">Ως ιδιοκτήτης εγγυάστε ότι:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Έχετε το νόμιμο δικαίωμα μίσθωσης του ακινήτου.</li>
                    <li>Το ακίνητο πληροί όλες τις απαραίτητες προδιαγραφές ασφαλείας.</li>
                    <li>Είστε υπεύθυνοι για την ασφάλιση του ακινήτου έναντι αστικών και υλικών ζημιών.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">4. Περιορισμός Ευθύνης</h2>
                <p className="mb-4">
                    Η Homevision λειτουργεί ως διαχειριστής. Δεν φέρουμε ευθύνη για σωματικές βλάβες των επισκεπτών
                    ή ζημιές στο ακίνητο που προκαλούνται από τρίτους ή φυσικές καταστροφές, πέραν όσων καλύπτονται συμβατικά.
                </p>
            </section>
        </>
    ) : (
        <>
            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                    By accessing and using our website or assigning the management of your property
                    to Homevision, you fully accept these terms of service.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">2. Provided Services</h2>
                <p className="mb-4">
                    Homevision provides short-term rental management services, including but not limited to
                    online listing optimization, guest communication, maintenance, and cleaning.
                    The exact services and fees are defined in the bilateral private contract signed
                    between the company and the property owner.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">3. Owner's Responsibilities</h2>
                <p className="mb-4">As the property owner, you guarantee that:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>You have the legal right to rent the property.</li>
                    <li>The property meets all necessary safety regulations.</li>
                    <li>You are responsible for insuring the property against civil liability and property damage.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-serif mb-4">4. Limitation of Liability</h2>
                <p className="mb-4">
                    Homevision acts as a property manager. We are not liable for guest injuries or property damages
                    caused by third parties or natural disasters, beyond what is contractually covered.
                </p>
            </section>
        </>
    );

    return (
        <main className="bg-white pt-32 pb-24 font-sans text-[var(--color-neutral-800)] text-base/relaxed">
            <div className="container max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-[-0.03em]">{title}</h1>
                <p className="text-[var(--color-neutral-500)] text-sm mb-12 uppercase tracking-wide">{lastUpdated}</p>
                <div className="prose prose-neutral max-w-none">
                    {content}
                </div>
            </div>
        </main>
    );
}
