"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDirectImageUrl } from "@/lib/utils";

interface HeroSlideshowProps {
    images: { url: string; title: string; category: string }[];
}

export function HeroSlideshow({ images }: HeroSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Masterpiece images generated for Curiol Studio
    const bespokeImages = [
        { url: "/assets/slideshow/legacy.png", title: "Legado Familiar", category: "Fine Art" },
        { url: "/assets/slideshow/innovation.png", title: "Innovación Phygital", category: "Digital" },
        { url: "/assets/slideshow/art.png", title: "Esencia Maestro", category: "Arte" }
    ];

    const displayImages = images.length > 0 ? [...bespokeImages, ...images] : bespokeImages;

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
