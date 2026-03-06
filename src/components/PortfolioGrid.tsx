'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface Property {
    id: number;
    title: string;
    altText?: string;
    location: string;
    img: string;
    size: string;
}

export default function PortfolioGrid({ properties }: { properties: Property[] }) {
    const [selectedProp, setSelectedProp] = useState<Property | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-row-dense auto-rows-[300px] md:auto-rows-[400px]">
                {properties.map((prop, idx) => (
                    <PortfolioCard
                        key={prop.id}
                        prop={prop}
                        idx={idx}
                        onClick={() => setSelectedProp(prop)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedProp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setSelectedProp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="relative w-full max-w-7xl aspect-[16/9] md:aspect-auto md:h-full max-h-[90vh] rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedProp.img}
                                alt={selectedProp.altText || selectedProp.title}
                                fill
                                sizes="100vw"
                                className="object-contain"
                            />

                            {/* Close button */}
                            <button
                                onClick={() => setSelectedProp(null)}
                                className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors z-50"
                                aria-label="Close"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            {/* Info overlay */}
                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                                <h3 className="text-2xl md:text-4xl font-serif text-white mb-2 tracking-[-0.02em]">{selectedProp.title}</h3>
                                <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/70">{selectedProp.location}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function PortfolioCard({ prop, idx, onClick }: { prop: Property; idx: number; onClick: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the image inside the card
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay: (idx % 3) * 0.1 }}
            onClick={onClick}
            className={`cursor-pointer magnetic-cursor-target relative group overflow-hidden rounded-lg ${prop.size === 'large' ? 'md:col-span-2' :
                prop.size === 'tall' ? 'row-span-2' :
                    ''
                }`}
        >
            <div className="absolute inset-0">
                <Image
                    src={prop.img}
                    alt={prop.altText || prop.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
                />
            </div>
            <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-500" />

            {/* Numbered index — editorial */}
            <div className="absolute top-4 left-5">
                <span className="text-white/15 text-5xl font-serif font-light z-10 relative">{String(idx + 1).padStart(2, '0')}</span>
            </div>

            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-[#0A1118]/80 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10">
                <h3 className="text-xl md:text-2xl font-serif text-white mb-1 tracking-[-0.02em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{prop.title}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{prop.location}</p>
            </div>
        </motion.div>
    );
}
