"use client";

import { motion } from "framer-motion";
import { Gift, Camera, Sparkles } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";

export function GiftCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <GlassCard className="relative overflow-hidden group border-curiol-500/20 bg-gradient-to-br from-curiol-900/40 to-tech-950/40">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Gift className="w-32 h-32 text-curiol-500" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="p-2 bg-curiol-500/10 rounded-lg text-curiol-500">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Regala un Legado</span>
                        </div>

                        <h3 className="font-serif text-3xl md:text-4xl text-white mb-6 leading-tight italic">
                            Tarjeta de Regalo <br /> <span className="text-curiol-gradient">Curiol Studio</span>
                        </h3>

                        <p className="text-tech-400 font-light mb-8 max-w-md leading-relaxed">
                            El obsequio perfecto para quienes valoran el tiempo. Válida para cualquier experiencia de fotografía o soluciones digitales.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-4 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all transform hover:-translate-y-1 shadow-xl">
                                Comprar Ahora
                            </button>
                            <button className="px-8 py-4 border border-tech-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-800 transition-all">
                                Ver Detalles
                            </button>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-64 aspect-[1.6/1] bg-tech-800 rounded-xl border border-tech-700 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 bg-gradient-to-tr from-curiol-700/20 to-transparent" />
                        <div className="absolute inset-x-6 top-6 flex justify-between items-center">
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                <Camera className="w-4 h-4 text-white/50" />
                            </div>
                            <span className="text-[8px] text-white/40 tracking-[0.2em] font-bold uppercase">Gift Card</span>
                        </div>
                        <div className="absolute bottom-6 left-6">
                            <p className="text-white font-serif text-lg tracking-widest">CURIOL STUDIO</p>
                            <p className="text-[6px] text-tech-500 uppercase tracking-widest mt-1">Guanacaste, CR</p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
