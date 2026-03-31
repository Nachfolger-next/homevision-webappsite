export default function Loading() {
    return (
        <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                {/* Animated dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]"
                            style={{
                                animation: 'pulse 1.4s ease-in-out infinite',
                                animationDelay: `${i * 0.2}s`,
                                opacity: 0.3,
                            }}
                        />
                    ))}
                </div>
                <style>{`
                    @keyframes pulse {
                        0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                        40% { opacity: 1; transform: scale(1); }
                    }
                `}</style>
            </div>
        </main>
    );
}
