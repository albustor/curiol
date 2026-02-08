"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { Target, TrendingUp, Zap, MessageSquare, ArrowRight, Check, Sparkles, Code, Binary, UtensilsCrossed, Compass, Landmark } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SolucionesWebPage() {
    const plans = [
        {
            name: "Plan A: Presencia Express",
            subtitle: "IDMV - El Primer Paso",
            price: 85000,
            usdPrice: 199,
            features: [
                "1 Landing Page de alto impacto",
                "Optimización de Enlace Bio (Links)",
                "Generador de Textos con IA",
                "Integración WhatsApp Business",
                "Alineación Visual de Marca"
            ],
            color: "tech"
        },
        {
            name: "Plan B: Negocio Pro",
            subtitle: "Escalabilidad & Automatización",
            price: 145000,
            usdPrice: 349,
            features: [
                "Sitio Web Corporativo (4 Secciones)",
                "Chatbot Inteligente de Atención",
                "Módulos de IA para Pedidos/Citas",
                "Dashboard de Gestión Pyme",
                "Hosting & Seguridad de Alta Gama"
            ],
            primary: true,
            color: "curiol"
        },
        {
            name: "Mantenimiento Evolutivo",
            subtitle: "Crecimiento Continuo",
            price: 15000,
            usdPrice: 39,
            isMonthly: true,
            features: [
                "Actualizaciones de Seguridad",
                "Nuevos Insumos de IA Trimestrales",
                "Soporte Estratégico Prioritario",
                "Optimización SEO Permanente",
                "Gestión de Infraestructura"
            ],
            color: "gold"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-32 bg-tech-950 bg-grain">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-24 text-center mt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-curiol-500 text-xs font-bold tracking-[0.4em] uppercase mb-4 block animate-fade-in">Soluciones Comerciales & IA</span>
                        <h1 className="text-5xl md:text-8xl font-serif text-white italic mb-10 leading-tight">La Infraestructura <br /> <span className="text-curiol-gradient">Digital que Convierte.</span></h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
                            Implementamos Soluciones Comerciales basadas en el **IDMV** (Infraestructura Digital Mínima Viable). Ahora con una fase obligatoria de **Pre-producción Elite** vía videollamada para asegurar el éxito de cada proyecto.
                        </p>
                    </motion.div>
                </section>

                {/* IDMV Meaning */}
                <section className="py-24 bg-tech-900/20 border-y border-white/5 mb-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-curiol-gradient opacity-5" />
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-4xl font-serif text-white italic mb-8 italic">¿Qué es el <span className="text-curiol-500 underline decoration-tech-800">IDMV?</span></h2>
                                <p className="text-tech-400 text-lg font-light leading-relaxed mb-10">
                                    No construimos software inflado. Construimos la estructura exacta que tu negocio necesita para facturar más hoy, asegurando una base técnica que permita escalar mañana. Menos fricción, más resultados.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-white font-bold text-xs uppercase tracking-widest">
                                            <Zap className="w-5 h-5 text-curiol-500" /> Rapidez de Carga
                                        </div>
                                        <p className="text-tech-500 text-xs font-light">Optimizamos cada línea de código para velocidades instantáneas.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-white font-bold text-xs uppercase tracking-widest">
                                            <Sparkles className="w-5 h-5 text-curiol-500" /> IA Nativa
                                        </div>
                                        <p className="text-tech-500 text-xs font-light">Todas nuestras soluciones incluyen asistentes o procesos potenciados por IA.</p>
                                    </div>
                                </div>
                            </div>
                            <GlassCard className="p-12 border-tech-800">
                                <div className="space-y-8">
                                    <h4 className="text-xl font-serif text-white italic mb-6">Metodología Curiol Studio</h4>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-curiol-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-curiol-500/20">0</div>
                                        <div>
                                            <p className="text-white text-sm font-bold uppercase tracking-widest mb-1 italic">Pre-producción Elite</p>
                                            <p className="text-tech-500 text-xs font-light">Videollamada estratégica (8:00 PM+) para definir el ADN del proyecto.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-tech-800 flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
                                        <div>
                                            <p className="text-white text-sm font-bold uppercase tracking-widest mb-1">Diagnóstico IA</p>
                                            <p className="text-tech-500 text-xs font-light">Identificamos cuellos de botella mediante nuestra IA de negocios.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-tech-800 flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
                                        <div>
                                            <p className="text-white text-sm font-bold uppercase tracking-widest mb-1">Despliegue IDMV</p>
                                            <p className="text-tech-500 text-xs font-light">Lanzamos tu infraestructura en tiempo récord (2-4 semanas).</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-tech-800 flex items-center justify-center text-xs font-bold text-white shrink-0">3</div>
                                        <div>
                                            <p className="text-white text-sm font-bold uppercase tracking-widest mb-1">Evolución Circular</p>
                                            <p className="text-tech-500 text-xs font-light">Actualizamos tu sistema con lo último en tecnología trimestralmente.</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-4 italic">Nuestros <span className="text-curiol-gradient">Planes 2026.</span></h2>
                        <p className="text-tech-500 font-light tracking-widest uppercase text-[10px] font-bold">Inversión transparente para un retorno real.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan) => (
                            <GlassCard
                                key={plan.name}
                                className={cn(
                                    "p-10 relative overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.02] border-2 shadow-2xl",
                                    plan.primary ? "border-curiol-500 bg-curiol-900/10 shadow-curiol-500/10" : "border-tech-800"
                                )}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-serif text-white italic mb-2 leading-tight">{plan.name}</h3>
                                            <p className="text-tech-500 text-[10px] uppercase tracking-widest font-bold">{plan.subtitle}</p>
                                        </div>
                                        {plan.primary && <Zap className="w-6 h-6 text-curiol-500 animate-pulse" />}
                                    </div>

                                    <div className="mb-12">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-serif text-white italic">
                                                ₡{plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-tech-600 text-[10px] uppercase font-bold">/ ${plan.usdPrice}</span>
                                            {plan.isMonthly && <span className="text-tech-400 text-xs italic ml-2">mes</span>}
                                        </div>
                                        <p className="text-tech-600 text-[9px] uppercase font-bold mt-2 tracking-widest">Pago Único de Implementación</p>
                                    </div>

                                    <ul className="space-y-4 mb-12">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex gap-4 text-xs text-tech-300 font-light leading-relaxed">
                                                <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", plan.primary ? "bg-curiol-500" : "bg-tech-700")} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href="/cotizar"
                                    className={cn(
                                        "w-full py-5 text-[10px] font-bold uppercase tracking-widest text-center transition-all rounded-xl",
                                        plan.primary ? "bg-curiol-gradient text-white hover:brightness-110" : "bg-tech-800 text-white hover:bg-tech-700"
                                    )}
                                >
                                    Iniciar Implementación
                                </Link>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Tech ROI Proposition */}
                <section className="py-32 bg-tech-950 border-y border-tech-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grain opacity-5" />
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-6xl font-serif text-white italic mb-10 leading-tight">Estrategia de <span className="text-curiol-gradient">Rentabilidad Circular.</span></h2>
                                <p className="text-tech-400 text-lg font-light leading-relaxed mb-12">
                                    No buscamos un solo proyecto. Buscamos ser el socio tecnológico que evoluciona junto a tu negocio. Inviertes una vez en la infraestructura y la optimizas continuamente con nuestro mantenimiento agéntico.
                                </p>
                                <div className="space-y-8">
                                    {[
                                        { title: "Despliegue Agéntico", desc: "Entrega total en semanas, no meses, mediante flujos asistidos por IA.", icon: Zap },
                                        { title: "Escalabilidad Modular", desc: "Añade funciones (E-commerce, CRM, IA) conforme tu negocio crece.", icon: TrendingUp }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-tech-900 border border-tech-800 flex items-center justify-center text-curiol-500 shrink-0">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-serif text-xl italic mb-1">{item.title}</h4>
                                                <p className="text-tech-500 text-sm font-light">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <div className="relative">
                                <GlassCard className="p-10 border-tech-800 rotate-1">
                                    <div className="text-center mb-8">
                                        <Binary className="w-10 h-10 text-curiol-500 mx-auto mb-4" />
                                        <h4 className="text-2xl font-serif text-white italic">Curiol Lab IA</h4>
                                        <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest">Optimización de Costos</p>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-tech-400 text-sm italic font-light text-center">
                                            "Reducimos el costo operativo de tu web hasta en un 60% mediante arquitecturas modernas (Serverless) e Inteligencia Artificial."
                                        </p>
                                        <div className="pt-6 border-t border-tech-800 text-center">
                                            <Link href="/cotizar" className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest hover:underline inline-flex items-center gap-2">
                                                Ver Análisis de ROI <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-40 px-4 md:px-8 lg:px-16 text-center">
                    <div className="max-w-3xl mx-auto">
                        <MessageSquare className="w-12 h-12 text-curiol-500 mx-auto mb-8" />
                        <h2 className="text-4xl md:text-5xl font-serif text-white mb-10 italic">¿Tu negocio está listo para acelerar?</h2>
                        <p className="text-tech-400 text-xl font-light mb-12 leading-relaxed">
                            No pierdas más tiempo con soluciones que no escalan. Hablemos sobre cómo implementar tu **IDMV** y transformar tu presencia digital.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Link href="/cotizar" className="px-12 py-6 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full flex items-center justify-center gap-3">
                                Analizar Propuesta Inteligente <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="https://wa.me/50660602617" className="px-12 py-6 border border-tech-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-tech-800 transition-all rounded-full flex items-center justify-center gap-3">
                                Chat Directo <Sparkles className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <AiAssistant />
        </div>
    );
}
