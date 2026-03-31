'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface MagneticButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    magneticIntensity?: number;
    style?: React.CSSProperties;
}

export default function MagneticButton({
    children,
    href,
    onClick,
    className,
    magneticIntensity = 0.5, // 0.1 to 1. Higher is more magnetic pull.
    style,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const boundingRect = ref.current?.getBoundingClientRect();
        
        if (boundingRect) {
            const { width, height, left, top } = boundingRect;
            // Calculate distance from center of the button
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            
            // Apply magnetic pull, constrained by intensity
            setPosition({ x: x * magneticIntensity, y: y * magneticIntensity });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const Content = (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn("inline-flex h-full w-full items-center justify-center relative", className)}
            style={style}
            onClick={onClick}
        >
            {/* The actual visual button wrapper. We pull the text/icon inside it slightly more for parallax if desired. */}
            <motion.span
                animate={{ x: position.x * 0.2, y: position.y * 0.2 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                 className="flex items-center gap-2 pointer-events-none relative z-10"
            >
               {children}
            </motion.span>
        </motion.div>
    );

    if (href) {
        return (
            <Link href={href} className="group inline-block pointer-events-auto">
               {Content}
            </Link>
        )
    }

    return (
        <button className="group inline-block pointer-events-auto w-full">
            {Content}
        </button>
    );
}
