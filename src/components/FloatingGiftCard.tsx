"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function FloatingGiftCard() {
    const pathname = usePathname();

    // Don't show on the gift card page itself
    if (pathname === "/regalo") return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-10 right-32 z-50 hidden lg:block"
        >
            <Link
                href="/regalo"
                className="group relative flex items-center justify-center"
            >
                {/* Ping animation effect */}
                <div className="absolute inset-0 bg-curiol-500 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />

                {/* Main Button */}
                <div className="relative bg-curiol-gradient p-5 rounded-full shadow-[0_10px_40px_-10px_rgba(234,88,12,0.5)] group-hover:scale-110 transition-transform duration-300">
                    <Gift className="w-6 h-6 text-white" />
                </div>

                {/* Tooltip/Label */}
                <div className="absolute right-[120%] top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none">
                    <div className="bg-tech-950/90 backdrop-blur-md border border-curiol-500/20 px-4 py-2 rounded-xl whitespace-nowrap">
                        <p className="text-curiol-500 text-[10px] uppercase font-bold tracking-widest">Regala una Experiencia</p>
                        <p className="text-white text-[12px] font-serif italic">Tarjeta de Regalo Curiol</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
