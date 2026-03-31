'use client';

import { BedDouble, Baby, Sofa } from 'lucide-react';
import { t, Dictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

interface BedType {
    id: number;
    name: string;
    quantity: number;
}

interface BedConfigurationProps {
    bedTypes: BedType[];
    bedroomsNumber: number;
    dict: Dictionary;
    lang: Locale;
}

// Map the hostaway name roughly to icons
function getBedIcon(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes('crib') || lower.includes('toddler') || lower.includes('baby')) return Baby;
    if (lower.includes('sofa') || lower.includes('futon') || lower.includes('day bed')) return Sofa;
    return BedDouble;
}

export default function BedConfiguration({ bedTypes, bedroomsNumber, dict, lang }: BedConfigurationProps) {
    if (!bedTypes || bedTypes.length === 0) return null;

    // We don't have explicit room assignments from Hostaway API standard listing payload
    // So we will display the bed inventory across available "Bedroom" cards.
    // We'll create one card per bedroom if we have that, or just show the beds.
    
    // In many cases, it's better to just list them out per bed type, but for a premium feel
    // and matching the competitor, we will render "Spaces" (e.g., Space 1, Space 2) loosely.
    // If bedrooms == beds, we can map 1:1. Otherwise we just render the bed variants as cards.
    
    // Since we lack strict room mapping, we'll render each distinct bed type as a card, showing the quantity.
    // This is honest to the data and visually clean.

    return (
        <section className="py-8">
            <h2 className="font-serif text-xl text-[var(--color-text)] mb-6">
                {t(dict, 'property.whereYouWillSleep') || (lang === 'el' ? 'Πού θα κοιμηθείτε' : "Where you'll sleep")}
            </h2>
            
            {/* Horizontal scroll container with hidden scrollbar for a clean native feel */}
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x">
                {bedTypes.map((bed, idx) => {
                    const Icon = getBedIcon(bed.name);
                    
                    return (
                        <div 
                            key={`${bed.id}-${idx}`}
                            className="bg-white border border-[var(--color-neutral-200)] rounded-xl p-5 min-w-[160px] max-w-[200px] flex-shrink-0 snap-start shadow-sm hover:shadow-md hover:border-[var(--color-neutral-300)] transition-all duration-300"
                        >
                            <Icon size={24} className="text-[var(--color-neutral-600)] mb-8" strokeWidth={1.5} />
                            
                            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                                {t(dict, 'property.bedType') || (lang === 'el' ? 'Κρεβάτι' : 'Bed')} {idx + 1}
                            </h3>
                            <p className="text-xs text-[var(--color-neutral-500)] font-medium">
                                {bed.quantity} {bed.quantity === 1 ? '' : 'x '} {bed.name}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
