"use client";

import { motion } from "framer-motion";
import { Sparkles, Binary, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-tech-950 flex flex-col items-center justify-center relative overflow-hidden px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-curiol-500/10 blur-[120px] rounded-full" />

            <div className="relative z-10 text-center max-w-2xl">
                {/* Logo Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-12"
                >
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <Camera className="w-10 h-10 text-curiol-500" />
                        <div className="h-8 w-[1px] bg-white/20" />
                        <Binary className="w-10 h-10 text-tech-500" />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif text-white italic tracking-tighter">
                        Curiol <span className="text-curiol-gradient">Studio</span>
                    </h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="h-[1px] w-8 bg-curiol-500"></span>
                        <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Evolución 2026</span>
                        <span className="h-[1px] w-8 bg-curiol-500"></span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-serif text-white italic mb-6">
                        Proceso de Construcción <br />
                        <span className="text-tech-400 font-light text-xl md:text-2xl">Diseñando el pasado del futuro.</span>
                    </h2>

                    <p className="text-tech-500 text-sm md:text-base font-light leading-relaxed mb-12 max-w-lg mx-auto italic">
                        "Estamos redefiniendo la custodia del patrimonio emocional y la aceleración comercial. Pronto el nuevo Ecosistema Curiol OS estará a su disposición."
                    </p>

                    <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-curiol-500 animate-pulse" />
                            <span className="text-[10px] text-tech-400 font-bold uppercase tracking-widest">Sincronizando Legado</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Tag */}
            <div className="absolute bottom-10 left-0 w-full text-center">
                <p className="text-[9px] text-tech-700 font-bold uppercase tracking-[0.5em] italic">
                    Santa Bárbara • Guanacaste • Costa Rica
                </p>
            </div>
        </div>
    );
}
