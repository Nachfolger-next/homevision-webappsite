'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Grid2x2 } from 'lucide-react';
import { t, Dictionary } from '@/lib/get-dictionary';

interface ImageGalleryProps {
    images: { url: string; caption: string | null }[];
    propertyName: string;
    dict?: Dictionary;
}

export default function ImageGallery({
    images,
    propertyName,
    dict,
}: ImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="aspect-[16/9] bg-[var(--color-neutral-200)] rounded-xl flex items-center justify-center">
                <span className="text-[var(--color-neutral-400)]">No images available</span>
            </div>
        );
    }

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const goTo = (index: number) => {
        setLightboxIndex(
            index < 0 ? images.length - 1 : index >= images.length ? 0 : index
        );
    };

    const mosaicImages = images.slice(0, 5);

    return (
        <>
            {/* ── Desktop: 5-Photo Mosaic Grid ── */}
            <div className="hidden md:block">
                <div className="relative rounded-xl overflow-hidden">
                    <div
                        className="grid gap-1.5"
                        style={{
                            gridTemplateColumns: '1fr 1fr',
                            gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)',
                            height: '420px',
                        }}
                    >
                        {/* Hero image — spans 2 rows */}
                        <div
                            className="relative row-span-2 cursor-pointer group"
                            onClick={() => openLightbox(0)}
                        >
                            <Image
                                src={mosaicImages[0].url}
                                alt={mosaicImages[0].caption || `${propertyName} - Photo 1`}
                                fill
                                sizes="50vw"
                                className="object-cover transition-[filter] duration-300 group-hover:brightness-90"
                                priority
                            />
                        </div>

                        {/* Top-right 2 images */}
                        <div className="grid grid-cols-2 gap-1.5">
                            {mosaicImages.slice(1, 3).map((img, i) => (
                                <div
                                    key={i}
                                    className="relative cursor-pointer group"
                                    onClick={() => openLightbox(i + 1)}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.caption || `${propertyName} - Photo ${i + 2}`}
                                        fill
                                        sizes="25vw"
                                        className="object-cover transition-[filter] duration-300 group-hover:brightness-90"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Bottom-right 2 images */}
                        <div className="grid grid-cols-2 gap-1.5">
                            {mosaicImages.slice(3, 5).map((img, i) => (
                                <div
                                    key={i}
                                    className="relative cursor-pointer group"
                                    onClick={() => openLightbox(i + 3)}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.caption || `${propertyName} - Photo ${i + 4}`}
                                        fill
                                        sizes="25vw"
                                        className="object-cover transition-[filter] duration-300 group-hover:brightness-90"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* "Show all photos" button */}
                    {images.length > 5 && (
                        <button
                            onClick={() => openLightbox(0)}
                            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-semibold text-[var(--color-text)] border border-[var(--color-neutral-300)] hover:bg-white transition-colors cursor-pointer shadow-sm"
                        >
                            <Grid2x2 size={14} />
                            {dict ? t(dict, 'property.showAllPhotos') : 'Show all photos'}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Mobile: Swipeable single image with dots ── */}
            <div className="md:hidden">
                <MobileGallery
                    images={images}
                    propertyName={propertyName}
                    onImageClick={openLightbox}
                />
            </div>

            {/* ── Full-Screen Lightbox ── */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        {/* Counter */}
                        <div className="absolute top-4 left-4 text-white/60 text-sm">
                            {lightboxIndex + 1} / {images.length}
                        </div>

                        {/* Image */}
                        <div
                            className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto px-16"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[lightboxIndex].url}
                                alt={images[lightboxIndex].caption || `${propertyName} - Photo ${lightboxIndex + 1}`}
                                fill
                                sizes="100vw"
                                className="object-contain"
                            />
                        </div>

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goTo(lightboxIndex - 1);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft size={24} className="text-white" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goTo(lightboxIndex + 1);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <ChevronRight size={24} className="text-white" />
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ── Mobile Gallery sub-component ── */
function MobileGallery({
    images,
    propertyName,
    onImageClick,
}: {
    images: { url: string; caption: string | null }[];
    propertyName: string;
    onImageClick: (index: number) => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="relative">
            <div
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onImageClick(currentIndex)}
            >
                <Image
                    src={images[currentIndex].url}
                    alt={images[currentIndex].caption || `${propertyName} - Photo ${currentIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={currentIndex === 0}
                />

                {/* Nav arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(currentIndex <= 0 ? images.length - 1 : currentIndex - 1);
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(currentIndex >= images.length - 1 ? 0 : currentIndex + 1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}

                {/* Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.slice(0, 7).map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(i);
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === currentIndex
                                    ? 'bg-white w-4'
                                    : 'bg-white/50'
                                    }`}
                            />
                        ))}
                        {images.length > 7 && (
                            <span className="text-white/70 text-[10px] ml-1">
                                +{images.length - 7}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
