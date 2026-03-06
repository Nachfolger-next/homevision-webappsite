'use client';

import { useRef, useEffect } from 'react';

interface VideoBackgroundProps {
    src: string;
    poster?: string;
    className?: string;
}

export default function VideoBackground({ src, poster, className = '' }: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Ensure video plays after mounting
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // Autoplay was prevented, video will show poster instead
            });
        }
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover ${className}`}
            style={{ filter: 'contrast(1.1) brightness(0.85)' }}
            poster={poster}
        >
            <source src={src} type="video/mp4" />
        </video>
    );
}
