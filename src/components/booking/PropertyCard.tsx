'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, BedDouble, Bath } from 'lucide-react';
import type { PropertyListing } from '@/lib/hostaway-types';

interface PropertyCardProps {
    property: PropertyListing;
    lang: string;
    index?: number;
    priceLabel?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    allInNightlyRate?: number;
}

export default function PropertyCard({
    property,
    lang,
    index = 0,
    priceLabel = '/night',
    checkIn,
    checkOut,
    guests,
    allInNightlyRate,
}: PropertyCardProps) {
    const heroImage = property.images[0]?.url;
    const queryParams = [checkIn && `checkIn=${checkIn}`, checkOut && `checkOut=${checkOut}`, guests && `guests=${guests}`].filter(Boolean).join('&');
    const dateParams = queryParams ? `?${queryParams}` : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <Link
                href={`/${lang}/properties/${property.slug}${dateParams}`}
                className="group block"
            >
                <div className="bg-white rounded-2xl overflow-hidden shadow-accent-sm hover:shadow-accent-md transition-all duration-500 cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                        {heroImage ? (
                            <Image
                                src={heroImage}
                                alt={property.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-[var(--color-neutral-200)] flex items-center justify-center">
                                <span className="text-[var(--color-neutral-400)] text-sm">
                                    No image
                                </span>
                            </div>
                        )}

                        {/* Rating badge */}
                        {property.rating && property.rating > 0 && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                <Star
                                    size={12}
                                    className="text-[var(--color-warm)] fill-[var(--color-warm)]"
                                />
                                <span className="text-xs font-semibold text-[var(--color-text)]">
                                    {property.rating.toFixed(1)}
                                </span>
                            </div>
                        )}

                        {/* Pets badge */}
                        {property.petsAllowed && (
                            <div className="absolute top-3 left-3 bg-[var(--color-accent)]/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                <span className="text-[10px] uppercase tracking-[0.1em] text-white font-medium">
                                    Pet Friendly
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6 flex flex-col flex-1">
                        {/* Location */}
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] font-medium mb-2">
                            {property.city}
                        </p>

                        {/* Name */}
                        <h3 className="font-serif text-xl md:text-2xl text-[var(--color-text)] mb-3 leading-tight group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                            {property.name}
                        </h3>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-[var(--color-neutral-500)] text-xs mb-4">
                            <span className="flex items-center gap-1.5">
                                <Users size={14} />
                                {property.personCapacity}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <BedDouble size={14} />
                                {property.bedroomsNumber}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Bath size={14} />
                                {property.bathroomsNumber}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 mt-auto">
                            {!allInNightlyRate && (
                                <span className="text-xs text-[var(--color-neutral-500)]">From</span>
                            )}
                            <span className="text-lg font-semibold text-[var(--color-text)]">
                                €{allInNightlyRate ? Math.round(allInNightlyRate) : property.price.toFixed(0)}
                            </span>
                            <span className="text-xs text-[var(--color-neutral-500)]">
                                {priceLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
