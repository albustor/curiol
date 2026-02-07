"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { PhygitalSimulation } from "@/components/PhygitalSimulation";
import {
    UserCheck, ShoppingBag, UtensilsCrossed, Home,
    Briefcase, Camera, Smartphone, Binary, ArrowRight, Sparkles, Code, MessageCircle, Users
} from "lucide-react";
import Link from "next/link";

const modalities = [
    { id: "aventura", title: "Aventura Mágica", icon: Sparkles, desc: "Fotografía Fine Art + Fantasía IA. Incluye canción original y photobook con realidad aumentada. (₡95.000 / $199)." },
    { id: "esencia", title: "Esencia Familiar", icon: Camera, desc: "Sesión High-End con 'Cuadros Vivos'. Tus fotos cobran vida a través de nuestra App de RA. (₡110.000 / $249)." },
    { id: "marca", title: "Marca Personal Pro", icon: UserCheck, desc: "Retratos de impacto con asesoría visual y tarjeta NFC inteligente integrada. (₡65.000 / $149)." },
    { id: "legado", title: "Membresía Legado", icon: Users, desc: "Tu biógrafo familiar: 3 sesiones al año, prioridad y herencia digital curada. (₡25.000 / $59 mes)." },
    { id: "express", title: "Plan A: Presencia Express", icon: Smartphone, desc: "IDMV: Landing page de alto impacto con generador de textos asistido por IA. (₡85.000 / $199).", highlight: true },
    { id: "negocio", title: "Plan B: Negocio Pro", icon: Code, desc: "Web corporativa con chatbot inteligente y módulos de automatización. (₡145.000 / $349).", highlight: true },
    { id: "phygital", title: "Ecosistema Phygital", icon: Binary, desc: "Fusión de productos físicos con alma digital: catálogos AR y activos interactivos." },
    { id: "mantenimiento", title: "Mantenimiento Evolutivo", icon: Sparkles, desc: "Gestión continua e integración trimestral de nuevos insumos de IA. (₡15.000 / $39 mes)." }
];

const generateServicesSummary = () => {
    const summary = `*Curiol Studio 2026 - Portafolio Digitalización Humana*\n\n` +
        `*FAMILIAS & LEGADO (B2C)*\n` +
        `• *Aventura Mágica*: ₡95k / $199\n` +
        `• *Esencia Familiar*: ₡110k / $249\n` +
        `• *Membresía Legado*: ₡25k / $59 mes\n\n` +
        `*NEGOCIOS & ACELERACIÓN (B2B)*\n` +
        `• *Marca Personal Pro*: ₡65k / $149\n` +
        `• *Plan A: Presencia Express*: ₡85k / $199\n` +
        `• *Plan B: Negocio Pro*: ₡145k / $349\n\n` +
        `_Ingeniería digital con sensibilidad artística._`;
    return `https://wa.me/50660602617?text=${encodeURIComponent(summary)}`;
};

export default function ServiciosPage() {
    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow">
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-24 mt-10 md:mt-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Digitalización Humana</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[0.9] italic">
                            Portafolio de <br /> <span className="text-curiol-gradient">Experiencias 2026.</span>
                        </h1>
                        <p className="text-tech-400 text-base md:text-xl font-light leading-relaxed">
                            Diseñamos activos digitales que trascienden el tiempo. Desde la arquitectura de memorias familiares hasta la aceleración tecnológica para el comercio local.
                        </p>
                    </div>
                </header>

                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modalities.map((item) => (
                            <GlassCard key={item.id} className={cn("flex flex-col items-center text-center p-6 md:p-10", item.highlight && "border-tech-500 shadow-2xl shadow-tech-500/10")}>
                                <div className={cn("mb-8 p-4 rounded-full ring-1", item.highlight ? "text-tech-500 bg-tech-500/5 ring-tech-500/20" : "text-curiol-500 bg-curiol-500/5 ring-curiol-500/20")}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-2xl text-white mb-4 italic leading-tight">{item.title}</h3>
                                <p className="text-tech-400 text-sm font-light leading-relaxed">{item.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Phygital Simulation */}
                <PhygitalSimulation />

                {/* WhatsApp Share Section */}
                <section className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <GlassCard className="p-8 md:p-12 text-center border-curiol-500/20">
                        <MessageCircle className="w-10 h-10 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-serif text-white italic mb-4">Consulta Express por WhatsApp.</h2>
                        <p className="text-tech-400 font-light mb-10 max-w-lg mx-auto leading-relaxed">
                            Genera un resumen detallado del catálogo 2026 y envíalo directamente a nuestro canal oficial para una asesoría personalizada.
                        </p>
                        <a
                            href={generateServicesSummary()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-green-600/10 border border-green-500/30 text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all rounded-full group"
                        >
                            Solicitar Asesoría por WhatsApp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </GlassCard>
                </section>

                {/* CTA Hero */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <div className="bg-gradient-to-r from-tech-950 to-tech-900 border border-tech-800 p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-curiol-700/10 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-serif text-white mb-10 italic">¿Cuál es tu próximo legado?</h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link href="/cotizar" className="px-12 py-6 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all transform hover:-translate-y-1 shadow-2xl flex items-center gap-3">
                                    Personalizar mi Legado <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link href="/soluciones-web" className="px-12 py-6 border border-tech-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-tech-800 transition-all">
                                    Ver Aceleradora Digital
                                </Link>
                            </div>
                        </div>
                    </div>
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
