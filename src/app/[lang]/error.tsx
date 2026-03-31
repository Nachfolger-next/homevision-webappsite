'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Page error:', error);
    }, [error]);

    return (
        <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
            <div className="container text-center py-32">
                <span className="editorial-rule editorial-rule--accent mx-auto mb-8 block" />
                <h1 className="text-6xl md:text-8xl font-serif font-light tracking-[-0.03em] text-[var(--color-neutral-300)] leading-none mb-4">
                    Oops
                </h1>
                <h2 className="text-2xl md:text-3xl font-serif tracking-[-0.02em] mb-4 text-[var(--color-text)]">
                    Something went wrong
                </h2>
                <p className="text-[var(--color-neutral-500)] max-w-md mx-auto mb-10 leading-relaxed">
                    We encountered an unexpected error. Please try again.
                </p>
                <button
                    onClick={() => reset()}
                    className="inline-block px-8 py-3 bg-[var(--color-accent)] text-white text-[11px] uppercase tracking-[0.15em] font-bold rounded-full hover:bg-[var(--color-accent-dark)] transition-colors cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        </main>
    );
}
