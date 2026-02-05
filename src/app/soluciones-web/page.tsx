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
            subtitle: "Dúo Web + App Nativa",
            price: 250000,
            features: [
                "App para Android e iOS",
                "Panel Web de Control Incluido",
                "Notificaciones Push directas",
                "Base de Datos Robusta y Segura",
                "Inteligencia Artificial por Nicho",
                "70% más veloz (No-Coding)"
            ],
            color: "gold"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-32 bg-tech-950 bg-grain">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-curiol-500 text-xs font-bold tracking-[0.4em] uppercase mb-4 block">Soluciones que Resuelven</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white italic mb-8">Tecnología con <span className="text-curiol-gradient">Propósito Real.</span></h1>
                        <p className="text-tech-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                            No solo construimos código; desde nuestras raíces en Guanacaste proyectamos soluciones que resuelven problemas reales a nivel nacional e internacional.
                        </p>
                    </motion.div>
                </section>

                {/* SME Pain vs Gain Section */}
                <section className="py-24 bg-tech-900/10 border-y border-white/5 mb-32">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-serif text-white italic mb-4">¿Sientes que tu negocio <span className="text-curiol-500">está estancado?</span></h2>
                            <p className="text-tech-500 font-light">Identificamos tus "dolores" y los transformamos en ventajas competitivas.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    pain: "Invisibilidad Digital",
                                    situation: "Tus clientes te buscan en Google y no apareces, o tu link de redes sociales no funciona bien.",
                                    solution: "Página Web (Landing Page)",
                                    gain: "Profesionalismo inmediato. Un solo lugar para que te encuentren, vean tus servicios y te escriban por WhatsApp con un click.",
                                    type: "Presencia Express"
                                },
                                {
                                    pain: "Caos en Gestión",
                                    situation: "Pasas todo el día respondiendo lo mismo por chat y agendando citas en papel que se pierden.",
                                    solution: "Sitio Web Multi-Seccion",
                                    gain: "Orden y tiempo libre. Tu web responde las dudas, muestra tu catálogo y recibe cotizaciones automáticamente 24/7.",
                                    type: "Negocios Pro"
                                },
                                {
                                    pain: "Dependencia de Terceros",
                                    situation: "Las comisiones de apps externas devoran tu ganancia o dependes de que Instagram te muestre para vender.",
                                    solution: "App Móvil + Panel Web (Dúo)",
                                    gain: "Libertad total. Estás en el celular de tu cliente con notificaciones directas, sin comisiones y con IA que conoce a tu público.",
                                    type: "App Móvil SME"
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col h-full p-10 rounded-[2rem] bg-tech-900/30 border border-white/5 hover:border-curiol-500/20 transition-all group">
                                    <div className="mb-8">
                                        <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest mb-2 block">El Problema: {item.pain}</span>
                                        <p className="text-tech-400 text-sm font-light italic leading-relaxed">"{item.situation}"</p>
                                    </div>
                                    <div className="mt-auto pt-8 border-t border-white/5">
                                        <span className="text-[10px] font-bold text-curiol-500 uppercase tracking-widest mb-2 block">Solución Curiol: {item.solution}</span>
                                        <h4 className="text-lg text-white font-serif italic mb-4 group-hover:text-gold-500 transition-colors">Qué ganas:</h4>
                                        <p className="text-tech-500 text-sm font-light leading-relaxed">{item.gain}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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

                {/* Curiol Lab: Futuro del Comercio Local */}
                <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-gold-500 font-bold text-[10px] uppercase tracking-[0.3em]">Curiol Lab</span>
                                <div className="h-[1px] w-8 bg-gold-500/30" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 italic">Conceptos de <span className="text-gold-500">Próxima Generación.</span></h2>
                            <p className="text-tech-400 font-light">Explora las posibilidades ilimitadas de lo que podemos construir juntos. No es solo software, es la proyección de tu visión.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Gastro-Evolución",
                                category: "Restauración & Hospitalidad",
                                desc: "Apps con perfiles de sabor por IA que sugieren platos basados en preferencias biométricas y pedidos sin contacto físico.",
                                icon: UtensilsCrossed,
                                accent: "curiol"
                            },
                            {
                                title: "Bio-Logística Inteligente",
                                category: "Productores & Comercio",
                                desc: "Dashboards que conectan el inventario físico con sensores en tiempo real, prediciendo demanda y automatizando la cadena de suministro.",
                                icon: TrendingUp,
                                accent: "tech"
                            },
                            {
                                title: "Concierge Aumentado",
                                category: "Turismo Local",
                                desc: "Guías de realidad aumentada (AR) que conectan al turista con la artesanía de Guaitil, narrando historias mientras compran.",
                                icon: Compass,
                                accent: "gold"
                            },
                            {
                                title: "Patrimonio Digital",
                                category: "Cultura & Museografía",
                                desc: "Ecosistemas que preservan legados históricos mediante el aprendizaje automático, creando archivos interactivos de acceso global.",
                                icon: Landmark,
                                accent: "curiol"
                            }
                        ].map((concept, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-[2.5rem] bg-tech-900/40 border border-white/5 p-12 transition-all hover:bg-tech-900/60">
                                <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:text-gold-500/10 transition-colors">
                                    <concept.icon size={120} />
                                </div>
                                <div className="relative z-10">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest mb-4 block",
                                        concept.accent === "gold" ? "text-gold-500" : concept.accent === "curiol" ? "text-curiol-500" : "text-tech-500"
                                    )}>
                                        {concept.category}
                                    </span>
                                    <h4 className="text-2xl md:text-3xl font-serif text-white italic mb-6 group-hover:text-gold-500 transition-colors">
                                        {concept.title}
                                    </h4>
                                    <p className="text-tech-500 text-sm font-light leading-relaxed max-w-sm mb-8">
                                        {concept.desc}
                                    </p>
                                    <div className="h-1 w-0 group-hover:w-20 bg-gold-500 transition-all duration-500" />
                                </div>
                            </div>
                        ))}
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
