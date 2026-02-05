"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Gift, Sparkles, Camera, Calendar, Check, Send } from "lucide-react";
import { useState } from "react";

export default function GiftCardPage() {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950 bg-grain">
            <Navbar />

            <main className="flex-grow max-w-4xl mx-auto px-4 w-full text-center">
                <header className="mb-16 animate-fade-in">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <span className="h-[1px] w-12 bg-curiol-500"></span>
                        <span className="text-curiol-500 text-xs font-bold tracking-[0.4em] uppercase">Obsequio de Distinción</span>
                        <span className="h-[1px] w-12 bg-curiol-500"></span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-white italic mb-6">Tarjeta de <span className="text-curiol-gradient">Regalo Virtual</span></h1>
                    <p className="text-tech-400 text-lg font-light max-w-2xl mx-auto">
                        Inmortaliza un momento especial. Un regalo que trasciende el tiempo y se convierte en un legado eterno.
                    </p>
                </header>

                <div className="relative perspective-1000 flex justify-center py-12">
                    <motion.div
                        initial={false}
                        animate={{ rotateY: isRevealed ? 180 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="relative w-full max-w-2xl aspect-[1.58/1] shadow-2xl preserve-3d cursor-pointer group"
                        onClick={() => setIsRevealed(!isRevealed)}
                    >
                        {/* Front of Card */}
                        <div className="absolute inset-0 backface-hidden">
                            <GlassCard className="w-full h-full p-1 border-curiol-500/20 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070')] bg-cover bg-center brightness-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-br from-curiol-900/80 to-tech-950/80" />
                                <div className="absolute inset-0 image-overlay opacity-30" />

                                <div className="relative h-full flex flex-col justify-between p-12 border border-white/10 rounded-[inherit]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-curiol-500 font-serif italic text-4xl mb-2">Curiol Studio</span>
                                            <span className="text-[8px] text-tech-400 uppercase tracking-[0.3em] font-bold">Arquitectura de Memorias</span>
                                        </div>
                                        <Gift className="text-curiol-500 w-10 h-10 transform group-hover:scale-110 transition-transform" />
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-white text-3xl font-serif italic mb-8">Un viaje al corazón de tus recuerdos.</p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-tech-500 text-[10px] uppercase tracking-widest mb-1">Cortesía de</p>
                                                <p className="text-white font-bold tracking-widest text-sm uppercase">Curiol Studio 2026</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-tech-500 text-[10px] uppercase tracking-widest mb-1">Click para abrir</p>
                                                <div className="w-12 h-[1px] bg-curiol-500 ml-auto" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Back of Card (Details) */}
                        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
                            <GlassCard className="w-full h-full bg-tech-950 border-curiol-500 overflow-hidden relative">
                                <div className="absolute inset-0 bg-grain opacity-50" />
                                <div className="relative h-full flex flex-col p-12 justify-between">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center pb-6 border-b border-white/5">
                                            <h3 className="text-2xl font-serif text-curiol-500 italic">Detalles del Obsequio</h3>
                                            <Sparkles className="text-gold-500 w-6 h-6" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 text-left">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-tech-500 text-[9px] uppercase tracking-widest mb-1 font-bold">Para:</p>
                                                    <p className="text-white text-lg font-serif italic">Persona Especial</p>
                                                </div>
                                                <div>
                                                    <p className="text-tech-500 text-[9px] uppercase tracking-widest mb-1 font-bold">Experiencia:</p>
                                                    <p className="text-white text-sm font-bold uppercase tracking-wider">Sesión Esencia Familiar</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-tech-500 text-[9px] uppercase tracking-widest mb-1 font-bold">Valor:</p>
                                                    <p className="text-curiol-500 text-2xl font-serif italic">₡110.000</p>
                                                </div>
                                                <div>
                                                    <p className="text-tech-500 text-[9px] uppercase tracking-widest mb-1 font-bold">Código:</p>
                                                    <p className="text-white text-sm font-mono tracking-widest font-bold">LEGACY-2026-XP</p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-tech-400 text-xs italic leading-relaxed pt-4 border-t border-white/5">
                                            "Este regalo incluye una sesión profesional de 1h 30min, 25 fotos digitales editadas y un Cuadro Vivo de Realidad Aumentada."
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.2em] font-bold text-tech-600">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-curiol-500" /> Vence en 6 meses</span>
                                        <span>Guanacaste, CR</span>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        { icon: Camera, title: "Captura Sublime", desc: "Fotografía de alta gama con dirección artística y técnica impecable." },
                        { icon: Sparkles, title: "Magia Digital", desc: "Integramos Realidad Aumentada para que tus fotos cuenten una historia viva." },
                        { icon: Send, title: "Envío Inmediato", desc: "Recibe tu tarjeta digital al instante por WhatsApp o correo electrónico." }
                    ].map((feat, i) => (
                        <div key={i} className="space-y-4 p-6 rounded-2xl bg-tech-900/30 border border-white/5 hover:border-curiol-500/30 transition-all">
                            <feat.icon className="w-8 h-8 text-curiol-500" />
                            <h4 className="text-xl font-serif text-white italic">{feat.title}</h4>
                            <p className="text-tech-400 text-sm font-light leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex flex-col items-center gap-6">
                    <button className="px-12 py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                        <Gift className="w-4 h-4" /> Personalizar mi Tarjeta
                    </button>
                    <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest">Pago seguro vía transferencia o SINPE</p>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
}
