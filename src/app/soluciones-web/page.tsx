"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Target, TrendingUp, Zap, MessageSquare, ArrowRight,
    Check, Sparkles, Code, Binary, UtensilsCrossed,
    Compass, Landmark, Bot, Database
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PerspectiveCard } from "@/components/ui/PerspectiveCard";

export default function SolucionesWebPage() {
    const plans = [
        {
            name: "Omni Local (IDMV)",
            subtitle: "Presencia Digital Agéntica",
            price: 280000,
            usdPrice: 550,
            features: [
                "Sitio Web de Alto Impacto (IDMV)",
                "Optimización de Enlace Bio Integrado",
                "Asistente IA para generación de contenido",
                "Integración Meta Business Essentials",
                "Acceso a la Academia Curiol"
            ],
            color: "tech"
        },
        {
            name: "Omni Pro (Ecosistema)",
            subtitle: "Automatización & Escalabilidad",
            price: 780000,
            usdPrice: 1550,
            features: [
                "Infraestructura Inteligente de Ventas",
                "OmniFlow: manyChat-style Automation",
                "IA Gemini Integrada para Leads",
                "Galerías Interactivas Fine-Art Style",
                "Soporte Estratégico Mensual"
            ],
            primary: true,
            color: "curiol"
        },
        {
            name: "Omni Ultra (Curiol OS)",
            subtitle: "Ecosistema Digital Absoluto",
            price: 1530000,
            usdPrice: 3050,
            features: [
                "Cerebro Digital de Negocio (IA Custom)",
                "App Web Progresiva (PWA)",
                "Optimización Agéntica de Costos",
                "Soporte VIP Hardware & Software",
                "Gestión de Activos Estratégicos"
            ],
            color: "white"
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
                        <span className="text-curiol-500 text-xs font-bold tracking-[0.4em] uppercase mb-4 block animate-fade-in">Crecimiento Comercial & IA</span>
                        <h1 className="text-5xl md:text-8xl font-serif text-white italic mb-10 leading-tight">La Infraestructura <br /> <span className="text-curiol-gradient">Digital que Convierte.</span></h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
                            Implementamos estrategias de **Crecimiento Comercial & IA** basadas en el **IDMV** (Infraestructura Digital Mínima Viable). Ahora con una fase obligatoria de **Pre-producción Elite** vía videollamada para asegurar el éxito de cada proyecto.
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
                            <PerspectiveCard className="p-12 border-tech-800 rounded-[2.5rem] bg-tech-900/40 backdrop-blur-md border border-white/5">
                                <div className="space-y-8">
                                    <h4 className="text-xl font-serif text-white italic mb-6">Metodología Curiol Studio</h4>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-curiol-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-curiol-500/20">0</div>
                                        <div>
                                            <p className="text-white text-sm font-bold uppercase tracking-widest mb-1 italic">Pre-producción Elite</p>
                                            <p className="text-tech-500 text-xs font-light">Videollamada estratégica (7:00 PM+) para definir el ADN del proyecto.</p>
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
                            </PerspectiveCard>
                        </div>
                    </div>
                </section>

                {/* OmniFlow Showcase */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Bot className="text-curiol-500 w-5 h-5" />
                                    <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-[0.3em]">OmniFlow Engine</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-serif text-white italic mb-10 leading-tight">Automatización de <span className="text-[#E7633E]">Agendas, Cotizaciones y Contratos.</span></h2>
                                <p className="text-tech-400 text-lg font-light leading-relaxed mb-12 max-w-xl">
                                    Creamos sistemas inteligentes que gestionan el ciclo completo de tu cliente. Desde la cotización instantánea hasta la firma del contrato, todo sucede en línea y sin intervención humana.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { title: "Generación de Cotización", desc: "El cliente recibe una propuesta personalizada basada en sus necesidades exactas.", icon: Database },
                                        { title: "Agenda Inteligente", desc: "Sincronización en tiempo real con tu disponibilidad para evitar traslapes.", icon: Bot },
                                        { title: "Pagos & Contratos", desc: "Gestión automática de adelantos y generación de contratos legales al instante.", icon: MessageSquare }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 p-8 bg-[#0B1221]/60 rounded-3xl border border-white/5 hover:border-[#E7633E]/20 transition-all">
                                            <div className="w-14 h-14 rounded-2xl bg-[#0B1221] border border-white/10 flex items-center justify-center text-[#E7633E] shrink-0">
                                                <item.icon className="w-6 h-6" opacity={0.8} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-serif text-2xl italic mb-1">{item.title}</h4>
                                                <p className="text-tech-500 text-sm font-light leading-snug">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="relative">
                                <GlassCard className="p-12 border-white/5 bg-[#0B1221]/80 relative z-10 overflow-hidden rounded-[3rem]">
                                    <div className="absolute top-0 right-0 p-6">
                                        <Zap className="w-6 h-6 text-[#E7633E] animate-pulse" />
                                    </div>

                                    <div className="space-y-6 relative text-center">
                                        {/* Visual Flow Representation - Updated to show the 4-step process */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-full bg-[#070B14] p-6 rounded-2xl border border-white/10 text-center shadow-lg">
                                                <p className="text-[10px] text-tech-400 font-bold uppercase tracking-[0.2em] mb-2">Paso 1: Cotización</p>
                                                <p className="text-white text-sm italic font-medium leading-tight">Presupuesto generado <span className="text-[#E7633E] font-bold">AL INSTANTE</span></p>
                                            </div>
                                            <div className="w-[1px] h-8 bg-white/10 mx-auto" />

                                            <div className="w-full bg-[#070B14] p-6 rounded-2xl border border-white/10 text-center shadow-lg">
                                                <p className="text-[10px] text-tech-400 font-bold uppercase tracking-[0.2em] mb-2">Paso 2: Agenda</p>
                                                <p className="text-white text-sm italic font-medium leading-tight text-[#E7633E] font-bold">Fecha reservada en línea</p>
                                            </div>
                                            <div className="w-[1px] h-8 bg-white/10 mx-auto" />

                                            <div className="w-full bg-[#070B14] p-6 rounded-2xl border border-white/10 text-center shadow-lg">
                                                <p className="text-[10px] text-tech-400 font-bold uppercase tracking-[0.2em] mb-2">Paso 3: Adelanto</p>
                                                <p className="text-white text-sm italic font-medium leading-tight">Pago procesado & validado</p>
                                            </div>
                                            <div className="w-[1px] h-8 bg-white/10 mx-auto" />

                                            <div className="w-full p-6 rounded-2xl text-center shadow-2xl relative overflow-hidden border border-[#E7633E]/20 bg-gradient-to-b from-[#070B14] to-[#121926]">
                                                <div className="absolute inset-0 bg-[#E7633E]/5" />
                                                <p className="text-[10px] text-tech-400 font-bold uppercase tracking-[0.2em] mb-2">Paso 4: Contrato</p>
                                                <p className="text-white text-sm font-bold italic leading-tight">Contrato legal enviado y firmado.</p>
                                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E7633E]/30 blur-[2px]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                                        <p className="text-[11px] text-white/60 font-bold uppercase tracking-[0.15em] mb-6 italic">Proceso 100% automatizado.</p>
                                        <div className="flex justify-center items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                                            <span className="text-[10px] text-tech-400 uppercase font-extrabold tracking-widest">Sistema OmniFlow Activo</span>
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Background Glow */}
                                <div className="absolute -inset-20 bg-curiol-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />
                            </div>
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
                            <PerspectiveCard
                                key={plan.name}
                                className={cn(
                                    "p-10 relative overflow-hidden flex flex-col justify-between transition-all border-2 shadow-2xl rounded-[3rem] bg-tech-950/20 backdrop-blur-md",
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
                            </PerspectiveCard>
                        ))}
                    </div>

                    {/* Hosting & Maintenance Tiers */}
                    <section className="max-w-5xl mx-auto px-4 mb-40">
                        <div className="text-center mb-16">
                            <Database className="w-10 h-10 text-curiol-500 mx-auto mb-6" />
                            <h2 className="text-4xl font-serif text-white italic mb-4">Suscripciones de Hosting</h2>
                            <p className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.3em]">Continuidad, Seguridad & Evolución Agéntica</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <GlassCard className="p-10 border-tech-800 hover:border-tech-700 transition-all">
                                <h3 className="text-2xl font-serif text-white italic mb-2">Hosting Esencial</h3>
                                <p className="text-tech-500 text-[10px] uppercase tracking-widest font-bold mb-6">Estabilidad & Soporte Básico</p>
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-3xl font-serif text-white italic">₡15,000</span>
                                    <span className="text-tech-600 text-[10px] uppercase font-bold">/ mes ($29)</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    <li className="flex gap-3 text-xs text-tech-400">
                                        <Check className="w-4 h-4 text-tech-600 shrink-0" />
                                        Hosting Ultra-Rápido (Edge Network)
                                    </li>
                                    <li className="flex gap-3 text-xs text-tech-400">
                                        <Check className="w-4 h-4 text-tech-600 shrink-0" />
                                        Certificado SSL & Seguridad WAF
                                        0</li>
                                    <li className="flex gap-3 text-xs text-tech-400">
                                        <Check className="w-4 h-4 text-tech-600 shrink-0" />
                                        Mantenimiento Técnico Mensual
                                    </li>
                                </ul>
                            </GlassCard>

                            <GlassCard className="p-10 border-curiol-500/30 bg-curiol-500/5 hover:border-curiol-500 transition-all relative overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <Sparkles className="w-5 h-5 text-curiol-500 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-serif text-white italic mb-2">Mantenimiento Agéntico</h3>
                                <p className="text-curiol-500 text-[10px] uppercase tracking-widest font-bold mb-6">IA Evolution & Soporte Prioritario</p>
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-3xl font-serif text-white italic">₡25,000</span>
                                    <span className="text-tech-600 text-[10px] uppercase font-bold">/ mes ($49)</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    <li className="flex gap-3 text-xs text-tech-300">
                                        <Check className="w-4 h-4 text-curiol-500 shrink-0" />
                                        Todo lo incluido en Esencial
                                    </li>
                                    <li className="flex gap-3 text-xs text-tech-300">
                                        <Check className="w-4 h-4 text-curiol-500 shrink-0" />
                                        Actualizaciones de Modelos IA (Gemini)
                                    </li>
                                    <li className="flex gap-3 text-xs text-tech-300">
                                        <Check className="w-4 h-4 text-curiol-500 shrink-0" />
                                        Soporte Estratégico & Evolución Circular
                                    </li>
                                    <li className="flex gap-3 text-xs text-tech-300 font-bold italic">
                                        <Check className="w-4 h-4 text-curiol-500 shrink-0" />
                                        Optimización Agéntica Mensual
                                    </li>
                                </ul>
                            </GlassCard>
                        </div>

                        <p className="mt-12 text-tech-700 text-[10px] italic font-light text-center">
                            * Los planes de hosting se activan automáticamente tras el despliegue del IDMV.
                        </p>
                    </section>
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
                            <Link href="https://wa.me/50662856669" className="px-12 py-6 border border-tech-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-tech-800 transition-all rounded-full flex items-center justify-center gap-3">
                                Chat Directo <Sparkles className="w-4 h-4" />
                            </Link>
                        </div>
                        <p className="text-[10px] text-tech-600 font-bold uppercase tracking-[0.3em] mt-8 italic text-center">
                            Comunicación inicial únicamente vía WhatsApp
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
