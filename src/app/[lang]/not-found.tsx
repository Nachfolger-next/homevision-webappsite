import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[var(--color-background)] flex flex-col">
            <Header lang="en" />

            <div className="flex-1 flex items-center justify-center">
                <div className="container text-center py-32">
                    <span className="editorial-rule editorial-rule--accent mx-auto mb-8 block" />
                    <h1 className="text-8xl md:text-[12rem] font-serif font-light tracking-[-0.05em] text-[var(--color-neutral-300)] leading-none mb-4">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-serif tracking-[-0.02em] mb-4 text-[var(--color-text)]">
                        Page Not Found
                    </h2>
                    <p className="text-[var(--color-neutral-500)] max-w-md mx-auto mb-10 leading-relaxed">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                    <Link
                        href="/en"
                        className="inline-block px-8 py-3 bg-[var(--color-accent)] text-white text-[11px] uppercase tracking-[0.15em] font-bold rounded-full hover:bg-[var(--color-accent-dark)] transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>

            <Footer lang="en" />
        </main>
    );
}
