"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { Target, TrendingUp, Zap, MessageSquare, ArrowRight, Check, Sparkles, Code, Binary } from "lucide-react";
import Link from "next/link";

export default function SolucionesWebPage() {
    const plans = [
        {
            name: "Presencia Express",
            subtitle: "Ideal para Marcas Personales",
            price: 85000,
            features: [
                "1 Landing Page de alto impacto",
                "Link-in-bio avanzado",
                "Botón directo a WhatsApp",
                "Integración de Redes Sociales",
                "Optimización de Foto Perfil"
            ],
            color: "tech"
        },
        {
            name: "Negocio Pro",
            subtitle: "Para PyMES en Crecimiento",
            price: 145000,
            features: [
                "Hasta 4 Secciones (Inicio, Galería, etc)",
                "Formulario de Cotización",
                "Google Maps Integrado",
                "Panel Autogestionable IA",
                "1 Sesión de Fotos Producto (-15%)"
            ],
            primary: true,
            color: "curiol"
        },
        {
            name: "App Móvil SME",
            subtitle: "Ecosistemas Móviles a Medida",
            price: 250000,
            features: [
                "Publicación en App Store & Play Store",
                "Notificaciones Push inteligentes",
                "Base de Datos Robusta y Segura",
                "Integración de APIS de IA (Gemini)",
                "Aprendizaje Específico por Nicho",
                "Esquema No-Coding: 70% más veloz"
            ],
            color: "gold"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-32">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-tech-500"></span>
                            <span className="text-tech-500 text-xs font-bold tracking-[0.3em] uppercase">Impulso Emprendedor</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight italic">
                            Acelera tu <br /> <span className="text-curiol-gradient">Presencia Digital.</span>
                        </h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light leading-relaxed">
                            No necesitas infraestructuras lentas. Creamos soluciones móviles y web ágiles, impulsadas por IA y bases de datos robustas para que el comercio local de Guanacaste lidere su industria.
                        </p>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan) => (
                            <GlassCard
                                key={plan.name}
                                className={cn(
                                    "p-8 relative overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.02]",
                                    plan.primary ? "border-curiol-500/30 bg-curiol-900/10" : plan.color === "gold" ? "border-gold-500/30 bg-gold-900/5" : "border-tech-800"
                                )}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-2xl font-serif text-white italic mb-2">{plan.name}</h3>
                                            <p className="text-tech-500 text-[10px] uppercase tracking-widest">{plan.subtitle}</p>
                                        </div>
                                        {plan.color === "gold" ? <Sparkles className="w-6 h-6 text-gold-500" /> : plan.primary && <Zap className="w-6 h-6 text-curiol-500" />}
                                    </div>

                                    <div className="mb-10">
                                        <span className="text-3xl font-serif text-white italic">
                                            {typeof plan.price === 'number' ? `₡${plan.price.toLocaleString()}` : plan.price}
                                        </span>
                                        <span className="text-tech-500 text-[10px] ml-2 uppercase">Inversión inicial</span>
                                    </div>

                                    <ul className="space-y-4 mb-12">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex gap-3 text-xs text-tech-300 font-light leading-relaxed">
                                                <Check className={cn("w-4 h-4 flex-shrink-0", plan.color === "gold" ? "text-gold-500" : plan.primary ? "text-curiol-500" : "text-tech-500")} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href="/cotizar"
                                    className={cn(
                                        "w-full py-4 text-[10px] font-bold uppercase tracking-widest text-center transition-all rounded-lg",
                                        plan.color === "gold" ? "bg-gold-500 text-white hover:bg-gold-600" : plan.primary ? "bg-curiol-700 text-white hover:bg-curiol-500" : "bg-tech-800 text-white hover:bg-tech-700"
                                    )}
                                >
                                    Cotizar Mi App
                                </Link>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Agentic & Tech Value Propositions */}
                <section className="py-32 bg-tech-950 border-y border-tech-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grain opacity-5" />
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-serif text-white italic mb-6">Ingeniería <span className="text-curiol-gradient">Agéntica Digital.</span></h2>
                            <p className="text-tech-400 max-w-2xl mx-auto font-light leading-relaxed">
                                Transformamos el esquema tradicional de desarrollo. Usamos esquemas de **Alta Velocidad** para entregar en semanas lo que a otros les toma meses.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="p-8 rounded-3xl bg-tech-900/30 border border-white/5 hover:border-curiol-500/30 transition-all">
                                <Code className="w-10 h-10 text-curiol-500 mb-6" />
                                <h4 className="text-2xl font-serif text-white italic mb-4">Esquema No-Coding</h4>
                                <p className="text-tech-500 text-sm font-light leading-relaxed">
                                    Valor agregado que se traduce en **70% menos tiempo de producción** y costos reducidos. Nos enfocamos en la lógica de negocio, no en escribir líneas innecesarias.
                                </p>
                            </div>
                            <div className="p-8 rounded-3xl bg-tech-900/30 border border-white/5 hover:border-gold-500/30 transition-all">
                                <Binary className="w-10 h-10 text-gold-500 mb-6" />
                                <h4 className="text-2xl font-serif text-white italic mb-4">IA por Nicho</h4>
                                <p className="text-tech-500 text-sm font-light leading-relaxed">
                                    No usamos IA genérica. Entrenamos modelos de aprendizaje específicos según tu nicho de comercio para automatizar ventas y atención al cliente.
                                </p>
                            </div>
                            <div className="p-8 rounded-3xl bg-tech-900/30 border border-white/5 hover:border-curiol-500/30 transition-all">
                                <Target className="w-10 h-10 text-curiol-500 mb-6" />
                                <h4 className="text-2xl font-serif text-white italic mb-4">Datos Robustos</h4>
                                <p className="text-tech-500 text-sm font-light leading-relaxed">
                                    Integración de Bases de Datos seguras y escalables que crecen con tu PYME, garantizando la integridad de tu información y la de tus clientes.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ROI Calculator Section (Visual Representation) */}
                <section className="py-32 px-4 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-serif text-white mb-8 italic">El Poder de la <span className="text-curiol-500">Automatización Local.</span></h2>
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-tech-800 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-serif text-xl mb-2 italic">Aumento en Ventas</h4>
                                        <p className="text-tech-500 text-sm font-light leading-relaxed">Las apps móviles personalizadas aumentan la retención del cliente en un 40% frente a sitios web convencionales.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-tech-800 flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-6 h-6 text-curiol-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-serif text-xl mb-2 italic">Eficiencia Operativa</h4>
                                        <p className="text-tech-500 text-sm font-light leading-relaxed">Reduce tiempos muertos automatizando agendas y pedidos a través de sistemas integrados.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <GlassCard className="p-12 border-curiol-500/10">
                            <div className="bg-tech-900/50 p-8 rounded-xl border border-tech-800">
                                <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest mb-6">Impacto en Tiempos de Entrega</p>
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between text-xs text-tech-300 mb-2 font-bold uppercase">
                                            <span>Agencias Tradicionales</span>
                                            <span>3-6 Meses</span>
                                        </div>
                                        <div className="h-1 bg-tech-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-tech-700 w-[100%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-curiol-500 mb-2 font-bold uppercase">
                                            <span>Curiol Studio (No-Coding)</span>
                                            <span>4-8 Semanas</span>
                                        </div>
                                        <div className="h-1 bg-tech-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-curiol-gradient w-[30%] animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 pt-8 border-t border-tech-800 text-center">
                                    <p className="text-white font-light text-sm italic">"Agilidad tecnológica para un mundo que no espera."</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </section>

                {/* AI Helper CTA */}
                <section className="py-32 px-4 md:px-8 lg:px-16 text-center">
                    <MessageSquare className="w-12 h-12 text-curiol-500 mx-auto mb-8" />
                    <h2 className="text-4xl font-serif text-white mb-8 italic">¿Tu PYME está lista para el siguiente nivel móvil?</h2>
                    <p className="text-tech-400 max-w-xl mx-auto mb-10 font-light leading-relaxed">
                        Nuestra IA de Curiol Studio analiza tu modelo de negocio y te propone la mejor arquitectura móvil sin costo inicial por asesoría.
                    </p>
                    <Link href="/cotizar" className="px-10 py-5 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full flex items-center gap-3 w-fit mx-auto">
                        Analizar Mi Negocio con IA <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>
            </main>

            <Footer />
            <AiAssistant />
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
