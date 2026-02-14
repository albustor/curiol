"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDirectImageUrl } from "@/lib/utils";

interface HeroSlideshowProps {
    images: { url: string; title: string; category: string }[];
}

export function HeroSlideshow({ images }: HeroSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fallback images (highest quality hand-picked from Unsplash for Curiol brand match)
    const fallbackImages = [
        { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80", title: "Legado Familiar", category: "Fine Art" },
        { url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80", title: "Esencia Pura", category: "Arte" },
        { url: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80", title: "Visión Innovadora", category: "Tecnología" }
    ];

    const displayImages = images.length > 0 ? images : fallbackImages;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        }, 8000); // 8-second transition

        return () => clearInterval(timer);
    }, [displayImages.length]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{
                        duration: 1.5, // Smooth fade
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0"
                >
                    <img
                        src={getDirectImageUrl(displayImages[currentIndex].url)}
                        alt={displayImages[currentIndex].title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
