'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SectionTransitionProps {
    children: React.ReactNode;
    className?: string;
    /** Apply a parallax offset to background elements */
    parallax?: boolean;
    /** Scale-up entrance: 0.97 → 1 */
    scaleEntrance?: boolean;
    /** Fade direction: 'up' slides content up, 'none' just fades in */
    direction?: 'up' | 'none';
}

export default function SectionTransition({
    children,
    className = '',
    parallax = false,
    scaleEntrance = true,
    direction = 'up',
}: SectionTransitionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'start 0.3'],
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [direction === 'up' ? 60 : 0, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [scaleEntrance ? 0.97 : 1, 1]);
    const parallaxY = useTransform(scrollYProgress, [0, 1], [40, 0]);

    return (
        <motion.div
            ref={ref}
            style={{
                opacity,
                y: parallax ? parallaxY : y,
                scale,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Word-by-word reveal heading — the signature scroll anchor */
export function RevealHeading({
    text,
    className = '',
    as: Tag = 'h2',
}: {
    text: string;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.9', 'start 0.4'],
    });

    const words = text.split(' ');

    return (
        <div ref={ref} className={className}>
            <Tag className="inline">
                <span className="sr-only">{text}</span>
                <span aria-hidden="true" className="inline">
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = Math.min(start + 1 / words.length + 0.1, 1);
                        return (
                            <RevealWord
                                key={i}
                                word={word}
                                progress={scrollYProgress}
                                range={[start, end]}
                                isLast={i === words.length - 1}
                            />
                        );
                    })}
                </span>
            </Tag>
        </div>
    );
}

function RevealWord({
    word,
    progress,
    range,
    isLast,
}: {
    word: string;
    progress: any;
    range: [number, number];
    isLast: boolean;
}) {
    const opacity = useTransform(progress, range, [0.15, 1]);
    const y = useTransform(progress, range, [8, 0]);

    return (
        <motion.span
            style={{ opacity, y }}
            className="inline-block"
        >
            {word}{!isLast && '\u00A0'}
        </motion.span>
    );
}
