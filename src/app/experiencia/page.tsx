"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { History, Zap, Sparkles, Smartphone, Landmark, ArrowRight, Binary, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const timeline = [
    {
        year: "1980s",
        title: "Raíces Artesanales",
        desc: "La familia Ortega Bustos inicia su legado en Nicoya, fusionando el arte de la fotografía análoga con la sensibilidad del entorno.",
        icon: Landmark,
        accent: "legacy"
    },
    {
        year: "2010s",
        title: "Transición Digital",
        desc: "Adoptamos las primeras herramientas de edición digital, manteniendo la esencia artística pero acelerando la entrega.",
        icon: Camera,
        accent: "tech"
    },
    {
        year: "2023",
        title: "Era Phygital",
        desc: "Nace el concepto de 'Cuadros Vivos'. Empezamos a integrar Realidad Aumentada en productos físicos.",
        icon: Smartphone,
        accent: "curiol"
    },
    {
        year: "2026",
        title: "Digitalización Humana",
        desc: "Consolidamos la IA no como un reemplazo, sino como un puente para amplificar la creatividad y el legado familiar/comercial.",
        icon: Sparkles,
        accent: "gold"
    }
];

export default function ExperienciaPage() {
    return (
        <div className="min-h-screen flex flex-col pt-32 bg-tech-950 bg-grain">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-24 mt-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Evolución de un Legado</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif text-white italic mb-10 leading-tight">
                            Nuestra <br /> <span className="text-curiol-gradient">Línea de Tiempo.</span>
                        </h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light leading-relaxed">
                            Desde el revelado químico hasta la ingeniería agéntica. Recorre el camino que nos ha convertido en arquitectos de memorias digitales.
                        </p>
                    </div>
                </header>

                {/* Timeline Layout */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="relative">
                        {/* Center Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-tech-800 hidden lg:block" />

                        <div className="space-y-24">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "flex flex-col lg:flex-row items-center gap-12",
                                        i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                    )}
                                >
                                    <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end">
                                        <div className={cn(
                                            "max-w-md w-full p-8 rounded-[2rem] border border-tech-800 bg-tech-900/30 hover:border-curiol-500/30 transition-all",
                                            i % 2 === 0 ? "lg:text-right" : "lg:text-left"
                                        )}>
                                            <span className="text-4xl font-serif text-white italic mb-4 block">{item.year}</span>
                                            <h3 className="text-2xl font-serif text-curiol-500 mb-4 italic">{item.title}</h3>
                                            <p className="text-tech-500 font-light leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>

                                    {/* Circle on Line */}
                                    <div className="relative z-10 w-12 h-12 rounded-full bg-tech-950 border border-tech-800 flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-curiol-500" />
                                        <div className="absolute inset-0 rounded-full bg-curiol-500/20 blur-xl opacity-50" />
                                    </div>

                                    <div className="flex-1 hidden lg:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Phygital Simulation CTA */}
                <section className="max-w-5xl mx-auto px-4 md:px-8 lg:px-16 mb-40 text-center">
                    <GlassCard className="p-16 border-curiol-500/20">
                        <Binary className="w-12 h-12 text-curiol-500 mx-auto mb-8" />
                        <h2 className="text-4xl font-serif text-white italic mb-8">Experimenta la Fusión.</h2>
                        <p className="text-tech-400 text-lg font-light mb-12 leading-relaxed">
                            No solo leemos historia, la construimos. Explora cómo nuestras soluciones actuales mezclan lo físico con lo digital en tiempo real.
                        </p>
                        <Link href="/servicios" className="px-12 py-6 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full inline-flex items-center gap-3">
                            Ver Portafolio 2026 <ArrowRight className="w-4 h-4" />
                        </Link>
                    </GlassCard>
                </section>
            </main>

            <Footer />
            <AiAssistant />
        </div>
    );
}
