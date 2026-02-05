"use client";

import { motion } from "framer-motion";
import { Smartphone, Radio, Sparkles } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";

export function PhygitalSimulation() {
    return (
        <section className="py-24 px-4 overflow-hidden bg-tech-950">
            <div className="max-w-6xl mx-auto">
                <GlassCard className="p-6 md:p-12 border-white/5 bg-gradient-to-br from-tech-900 to-tech-950 relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-curiol-500/5 blur-[100px] rounded-full -mr-48 -mt-48" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
                        {/* Left Content */}
                        <div className="space-y-8 md:space-y-12">
                            <div>
                                <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase block mb-4">Tecnología Curiol</span>
                                <h2 className="text-3xl md:text-6xl font-cinzel text-white leading-tight">
                                    Experiencia <span className="text-curiol-gradient">Phygital.</span>
                                </h2>
                            </div>

                            <div className="space-y-8 md:space-y-10">
                                <div className="flex gap-5 md:gap-6 items-start group">
                                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-tech-800 border border-white/10 flex items-center justify-center text-curiol-500 group-hover:border-curiol-500/50 transition-colors shadow-xl relative">
                                        <Radio className="w-5 h-5 md:w-6 md:h-6" />
                                        <span className="absolute -top-2 -right-2 text-[7px] md:text-[8px] font-bold bg-curiol-700 px-2 py-1 rounded text-white shadow-lg">NFC</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-white font-serif text-lg md:text-xl italic">Tarjetas Inteligentes</h3>
                                        <p className="text-tech-400 text-xs md:text-sm font-light leading-relaxed">
                                            Tu marca o portafolio personal en un solo toque. Rapidez y exclusividad para el networking moderno.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 md:gap-6 items-start group">
                                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-tech-800 border border-white/10 flex items-center justify-center text-curiol-500 group-hover:border-curiol-500/50 transition-colors shadow-xl relative">
                                        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                                        <span className="absolute -top-2 -right-2 text-[7px] md:text-[8px] font-bold bg-curiol-700 px-2 py-1 rounded text-white shadow-lg">AR</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-white font-serif text-lg md:text-xl italic">WebAR Experience</h3>
                                        <p className="text-tech-400 text-xs md:text-sm font-light leading-relaxed">
                                            Tus cuadros y álbumes impresos cobran vida al enfocarlos con tu celular. Sin apps, pura magia digital integrada al papel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Simulation Visual */}
                        <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full max-w-[400px] mx-auto">
                            <div className="absolute inset-0 bg-tech-800/30 rounded-[2rem] md:rounded-[3rem] border border-white/5 flex items-center justify-center overflow-hidden">
                                {/* The "Phone" container */}
                                <div className="w-full h-full p-6 md:p-8 flex flex-col items-center justify-center relative">

                                    {/* Scanning Circle */}
                                    <div className="relative w-48 h-48 md:w-64 md:h-64 border-2 border-white/10 rounded-full flex items-center justify-center">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3],
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 border-2 border-curiol-500 rounded-full blur-sm"
                                        />
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-2 border border-dashed border-white/20 rounded-full"
                                        />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="text-white text-[9px] md:text-[10px] font-bold tracking-[0.5em] uppercase"
                                            >
                                                Scanning...
                                            </motion.span>
                                        </div>
                                    </div>

                                    {/* Scanning beam effect */}
                                    <motion.div
                                        animate={{ y: [-150, 150, -150] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-curiol-500 to-transparent shadow-[0_0_20px_rgba(166,75,42,0.8)] z-20"
                                    />

                                    {/* Abstract background for "AR" feel */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <div className="grid grid-cols-6 h-full w-full">
                                            {[...Array(36)].map((_, i) => (
                                                <div key={i} className="border-[0.5px] border-white/5" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
}
