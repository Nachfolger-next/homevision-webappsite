'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, BedDouble, Bath } from 'lucide-react';
import type { PropertyListing } from '@/lib/hostaway-types';
import { t, Dictionary } from '@/lib/get-dictionary';

interface PropertyCardProps {
    property: PropertyListing;
    lang: string;
    index?: number;
    priceLabel?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    allInNightlyRate?: number;
    dict?: Dictionary;
}

export default function PropertyCard({
    property,
    lang,
    index = 0,
    priceLabel,
    checkIn,
    checkOut,
    guests,
    allInNightlyRate,
    dict = {},
}: PropertyCardProps) {
    const heroImage = property.images[0]?.url;
    const queryParams = [checkIn && `checkIn=${checkIn}`, checkOut && `checkOut=${checkOut}`, guests && `guests=${guests}`].filter(Boolean).join('&');
    const dateParams = queryParams ? `?${queryParams}` : '';

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="h-full perspective-[1000px] w-full block">
            <Link
                href={`/${lang}/properties/${property.slug}${dateParams}`}
                className="group block h-full outline-none"
            >
                <motion.div 
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-accent-sm)] hover:shadow-[var(--shadow-accent-md)] transition-shadow duration-500 cursor-pointer h-full flex flex-col will-change-transform"
                >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden translate-z-[20px]">
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
                                    {t(dict, 'property.noImage', 'No image')}
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
                                    {t(dict, 'property.petFriendly', 'Pet Friendly')}
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
                                <span className="text-xs text-[var(--color-neutral-500)]">{t(dict, 'booking.from', 'From')}</span>
                            )}
                            <span className="text-lg font-semibold text-[var(--color-text)]">
                                €{allInNightlyRate ? Math.round(allInNightlyRate) : property.price.toFixed(0)}
                            </span>
                            <span className="text-xs text-[var(--color-neutral-500)]">
                                {priceLabel || t(dict, 'booking.perNight', '/night')}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
