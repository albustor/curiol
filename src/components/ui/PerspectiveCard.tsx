"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface PerspectiveCardProps {
    children: React.ReactNode;
    index?: number;
    className?: string;
    onClick?: () => void;
    rotateRange?: number;
    depth?: number;
}

export function PerspectiveCard({
    children,
    index = 0,
    className,
    onClick,
    rotateRange = 10,
    depth = 50
}: PerspectiveCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${rotateRange}deg`, `-${rotateRange}deg`]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${rotateRange}deg`, `${rotateRange}deg`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden transition-all duration-300",
                className
            )}
        >
            <div
                style={{
                    transform: `translateZ(${depth}px)`,
                    transformStyle: "preserve-3d",
                }}
                className="absolute inset-0"
            >
                {children}

                {/* Dynamic Shine Overlay */}
                <motion.div
                    style={{
                        background: useTransform(
                            [mouseXSpring, mouseYSpring],
                            ([latestX, latestY]: any) => {
                                const xVal = typeof latestX === 'number' ? latestX : 0;
                                const yVal = typeof latestY === 'number' ? latestY : 0;
                                return `radial-gradient(circle at ${(xVal + 0.5) * 100}% ${(yVal + 0.5) * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
                            }
                        )
                    }}
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                />
            </div>
        </motion.div>
    );
}
