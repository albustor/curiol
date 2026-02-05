"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
}

export function GlassCard({ children, className, hoverEffect = true, onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "glass-card p-8 rounded-2xl transition-all duration-500",
                hoverEffect && "hover:bg-white/5 hover:border-curiol-500/30 hover:-translate-y-2",
                onClick && "cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
}
