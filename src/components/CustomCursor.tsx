'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useSpring(0, { damping: 25, stiffness: 200, mass: 0.5 });
    const cursorY = useSpring(0, { damping: 25, stiffness: 200, mass: 0.5 });

    useEffect(() => {
        // Only show on desktop devices where fine pointer is supported
        if (window.matchMedia('(pointer: coarse)').matches) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.magnetic-cursor-target')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center rounded-full backdrop-blur-md"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: '-50%',
                translateY: '-50%',
            }}
            animate={{
                width: isHovering ? 80 : 16,
                height: isHovering ? 80 : 16,
                backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.15)' : 'rgba(10, 17, 24, 0.4)',
                border: isHovering ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent'
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
        >
            <motion.span
                animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
                className="text-[10px] font-sans uppercase tracking-[0.2em] text-white font-medium"
            >
                View
            </motion.span>
        </motion.div>
    );
}
