"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Sparkles, ShieldCheck, Heart, ArrowRight,
    Smartphone, Search, Camera, MessageCircle,
    CheckCircle2, Info, HelpCircle, Users, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PerspectiveCard } from "@/components/ui/PerspectiveCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { getPortfolioAllPhotos } from "@/actions/portfolio";

const PROCESS_STEPS = [
    {
        phase: "Antes",
        title: "Conexión & Reserva",
        desc: "Entendemos tu visión y aseguramos el espacio. Inicia con el agendamiento inteligente y la formalización mediante el depósito del 20%, activando la pre-producción IA.",
        icon: MessageCircle,
        points: ["Agendamiento & Depósito 20%", "Briefing de Sensibilidad", "Moodboard Estratégico", "Diseño de Escena IA"]
    },
    {
        phase: "Durante",
        title: "Creación Maestro",
        desc: "El momento de la captura. Fusionamos dirección artística con tecnología de vanguardia para crear activos que trascienden.",
        icon: Camera,
        points: ["Dirección de Arte Real", "Captura Fine Art", "Inmersión Tecnológica"]
    },
    {
        phase: "Después",
        title: "Legado & Activación",
        desc: "Transformamos la captura en un ecosistema de legado familiar. Entrega digital, Realidad Aumentada y respaldo eterno.",
        icon: Sparkles,
        points: ["Revelado Digital IA", "Activación Phygital", "Soporte Continua"]
    }
];

const INFOGRAPHIC = [
    {
        title: "Legado Familiar",
        target: "Para Familias & Individuos",
        color: "text-curiol-500",
        items: [
            { icon: Heart, label: "Fotografía Fine Art" },
            { icon: Sparkles, label: "Realidad Aumentada" },
            { icon: Smartphone, label: "Elementos Phygital (NFC & Arte)" },
            { icon: ShieldCheck, label: "Custodia de Legado Eterno" }
        ],
        cta: "Preservar mi Legado"
    },
    {
        title: "Crecimiento Comercial & IA",
        target: "Para Negocios & Marcas",
        color: "text-tech-500",
        items: [
            { icon: Zap, label: "Landing Pages de Conversión" },
            { icon: Search, label: "Optimización SEO con IA" },
            { icon: CheckCircle2, label: "Integraciones de Tecnología Pro" },
            { icon: Smartphone, label: "Ecosistemas NFC de Venta" }
        ],
        cta: "Potenciar mi Crecimiento"
    }
];

const FAQS = [
    {
        q: "¿Qué es el concepto de 'Digitalización Humana'?",
        a: "Es nuestra filosofía de trabajo: usamos tecnología de punta (IA, RA, Web) para amplificar la esencia humana, no para reemplazarla. Buscamos que tus recuerdos o tu negocio tengan el soporte técnico necesario para perdurar en el tiempo."
    },
    {
        q: "¿Cómo funciona el pago anticipado del 20%?",
        a: "Para asegurar tu fecha en nuestra agenda y comenzar con la pre-producción (diseño de sesión, guiones IA, logística), solicitamos un adelanto del 20%. Este proceso es validado automáticamente por nuestro sistema una vez subas el comprobante."
    },
    {
        q: "¿Puedo personalizar un paquete que no esté en el cotizador?",
        a: "¡Absolutamente! El cotizador es una base. En la fase de 'Antes' (Conexión), podemos diseñar una propuesta a la medida de tus necesidades específicas."
    },
    {
        q: "¿Qué pasa con mis fotos después de un año?",
        a: "Incluimos 12 meses de respaldo digital premium. Después de ese tiempo, ofrecemos planes de mantenimiento evolutivo para asegurar que tu legado siga accesible en las nuevas plataformas tecnológicas."
    }
];

export default function ExperienciaPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [heroImages, setHeroImages] = useState<any[]>([]);

    useEffect(() => {
        async function loadPhotos() {
            const photos = await getPortfolioAllPhotos();
            // Filtrar para asegurar que tenemos las mejores (ej: las que duran más o tienen mejores tags si hubiera, 
            // por ahora tomamos las primeras del pool aleatorio del portfolio)
            setHeroImages(photos.slice(0, 10));
        }
        loadPhotos();
    }, []);

    return (
        <div className="min-h-screen flex flex-col pt-32 bg-tech-950 bg-grain">
            <Navbar />

            <main className="flex-grow">
                {/* HERO SECTION */}
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-32 mt-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-[1px] w-12 bg-curiol-500"></span>
                                <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Ecosistema Curiol Studio</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-white italic mb-10 leading-[1.1]">
                                La <span className="text-curiol-gradient">Experiencia</span> <br /> que Trasciende.
                            </h1>
                            <p className="text-tech-400 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-xl">
                                No solo tomamos fotos ni solo construimos webs. Diseñamos ecosistemas donde la sensibilidad artesanal se encuentra con la ingeniería de vanguardia.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <Link href="/agenda" className="px-10 py-5 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full border border-white/10 shadow-xl shadow-curiol-500/20">
                                    Agendar Sesión IA
                                </Link>
                                <Link href="/cotizar" className="px-10 py-5 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all rounded-full border border-white/10 backdrop-blur-md">
                                    Ver Cotizador
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square"
                        >
                            <PerspectiveCard className="relative aspect-square cursor-pointer">
                                <div className="absolute inset-0 bg-curiol-500/10 blur-[120px] rounded-full animate-pulse" />
                                <div className="relative z-10 w-full h-full rounded-[3rem] overflow-hidden border border-white/10">
                                    <HeroSlideshow images={heroImages} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-transparent to-transparent" />
                                    <div className="absolute bottom-10 left-10">
                                        <div className="flex items-center gap-4 text-white">
                                            <Users className="w-5 h-5 text-curiol-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest">+500 Memorias Creadas</span>
                                        </div>
                                    </div>
                                </div>
                            </PerspectiveCard>
                        </motion.div>
                    </div>
                </header>

                {/* 3-PHASE PROCESS */}
                <section className="bg-tech-900/30 py-40">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-serif text-white italic mb-6">El Proceso Maestro.</h2>
                        <p className="text-tech-500 max-w-2xl mx-auto uppercase text-[10px] font-bold tracking-[0.4em]">Calidad, Atención y Atención al Detalle</p>
                    </motion.div>

                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PROCESS_STEPS.map((step, idx) => (
                            <PerspectiveCard
                                key={idx}
                                index={idx}
                                className="p-10 hover:border-curiol-500/40 transition-all group cursor-pointer h-full"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 bg-curiol-500/10 rounded-2xl flex items-center justify-center border border-curiol-500/20 group-hover:bg-curiol-500 group-hover:text-white transition-all text-curiol-500">
                                        <step.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                                    </div>
                                    <span className="text-tech-700 text-[4rem] font-serif italic leading-none opacity-20 group-hover:opacity-40 transition-all">{step.phase}</span>
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-6 italic">{step.title}</h3>
                                <p className="text-tech-400 text-sm font-light leading-relaxed mb-8">{step.desc}</p>
                                <ul className="space-y-4">
                                    {step.points.map((p, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[10px] text-tech-500 uppercase font-bold tracking-widest">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-curiol-500" /> {p}
                                        </li>
                                    ))}
                                </ul>
                            </PerspectiveCard>
                        ))}
                    </div>
                </section>

                {/* PRODUCT INFOGRAPHIC */}
                <section className="py-40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-tech-800/50 rounded-[3rem] overflow-hidden border border-tech-800"
                        >
                            {INFOGRAPHIC.map((info, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-tech-950 p-16 md:p-24 flex flex-col justify-between hover:bg-tech-900/40 transition-colors"
                                >
                                    <div>
                                        <span className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block", info.color)}>{info.target}</span>
                                        <h3 className="text-4xl md:text-5xl font-serif text-white italic mb-12">{info.title}</h3>
                                        <div className="space-y-10 mb-16">
                                            {info.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-6 group/item">
                                                    <div className="w-12 h-12 rounded-full bg-tech-900 flex items-center justify-center border border-white/5 group-hover/item:border-curiol-500/50 transition-colors">
                                                        <item.icon className="w-5 h-5 text-tech-400 group-hover/item:text-curiol-500 transition-colors" />
                                                    </div>
                                                    <span className="text-lg font-serif text-tech-300 italic group-hover/item:text-white transition-colors">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Link href="/cotizar" className="inline-flex items-center gap-4 text-white text-xs font-bold uppercase tracking-[0.3em] group/link">
                                        {info.cta} <ArrowRight className="w-5 h-5 text-curiol-500 group-hover/link:translate-x-2 transition-transform" />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-40 bg-tech-900/20">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center mb-20">
                            <HelpCircle className="w-12 h-12 text-curiol-500 mx-auto mb-6" />
                            <h2 className="text-4xl font-serif text-white italic mb-4">Preguntas Frecuentes.</h2>
                            <p className="text-tech-500 text-[10px] font-bold uppercase tracking-[0.3em]">Claridad desde el primer contacto</p>
                        </div>

                        <div className="space-y-4">
                            {FAQS.map((faq, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full text-left p-8 bg-tech-900/50 border border-white/5 rounded-3xl hover:border-curiol-500/20 transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-white font-serif text-xl italic">{faq.q}</h4>
                                        <div className={cn("w-6 h-6 border rounded-full flex items-center justify-center transition-all", openFaq === idx ? "border-curiol-500 bg-curiol-500 text-white" : "border-tech-700 text-tech-700 rotate-90")}>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: openFaq === idx ? "auto" : 0, opacity: openFaq === idx ? 1 : 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pt-6 text-tech-400 text-sm font-light leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA FINAL */}
                <section className="py-40">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <GlassCard className="p-20 border-curiol-500/20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Sparkles className="w-64 h-64 text-curiol-500" />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-serif text-white italic mb-10 leading-tight">
                                Diseñemos hoy tu <br /> <span className="text-curiol-gradient">Próximo Legado.</span>
                            </h2>
                            <Link href="/agenda" className="px-16 py-8 bg-curiol-gradient text-white text-xs font-bold uppercase tracking-[0.4em] rounded-full inline-flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-curiol-500/30">
                                Iniciar Proceso <ArrowRight className="w-5 h-5" />
                            </Link>
                        </GlassCard>
                    </div>
                </section>
            </main>

            <Footer />
            <AiAssistant />
        </div>
    );
}
