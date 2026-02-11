"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { PhygitalSimulation } from "@/components/PhygitalSimulation";
import { AgendaWidget } from "@/components/AgendaWidget";
import {
    UserCheck, ShoppingBag, UtensilsCrossed, Home,
    Briefcase, Camera, Smartphone, Binary, ArrowRight, Sparkles, Code, MessageCircle, Users
} from "lucide-react";
import Link from "next/link";

const modalities = [
    {
        id: "aventura",
        title: "Aventura Mágica",
        icon: Sparkles,
        items: [
            "15 Fotos High-End + IA",
            "Realidad Aumentada interactiva",
            "Canción IA personalizada",
            "Retablo 5x7\" con NFC",
            "Inversión: ₡80.900 / $165"
        ]
    },
    {
        id: "recuerdos",
        title: "Recuerdos Eternos",
        icon: Camera,
        items: [
            "15 Fotos Fine Art",
            "Cuadros Vivos AR",
            "Impresión de alta gama",
            "Retablo 8x12\" con NFC",
            "Inversión: ₡77.000 / $149"
        ]
    },
    {
        id: "marca",
        title: "Marca Personal",
        icon: UserCheck,
        items: [
            "15 Fotos de impacto",
            "Estrategia de identidad visual",
            "Galería Digital Pro",
            "Tarjeta NFC incluida",
            "Inversión: ₡89.000 / $179"
        ]
    },
    {
        id: "legado",
        title: "Membresía Legado",
        icon: Users,
        items: [
            "Patrimonio emocional protegido",
            "3 Sesiones programadas anuales",
            "Custodia digital hereditaria",
            "Optimización de inversión",
            "Suscripción: ₡25.000 / $59 mes"
        ]
    },
    {
        id: "minirelatos",
        title: "Mini-relatos",
        icon: Sparkles,
        items: [
            "Encuentro ágil (30 min)",
            "5 Fotos Fine-Art",
            "Propósito claro y experto",
            "Retablo 5x7\" incluido",
            "Inversión: ₡49.000 / $99"
        ]
    },
    {
        id: "express",
        title: "Web-Apps (PWA)",
        icon: Smartphone,
        items: [
            "Experiencia nativa instalable",
            "Funcionamiento sin conexión",
            "Alta retención de clientes",
            "Instalación instantánea",
            "Desde: ₡250.000 / $500"
        ],
        highlight: true
    },
    {
        id: "negocio",
        title: "No-Code / IA Eficiente",
        icon: Code,
        items: [
            "Desarrollo ágil de soluciones",
            "Optimización de costos/tiempos",
            "Ingeniería asistida por IA",
            "Escalabilidad inmediata",
            "Desde: ₡750.000 / $1500"
        ],
        highlight: true
    },
    {
        id: "ultra",
        title: "Módulos IA Local",
        icon: Binary,
        items: [
            "Cerebro digital de negocio",
            "Automatización de ventas/atención",
            "Adaptado a contexto local",
            "Integración total con PWA",
            "Inversión: ₡1.5M / $3000"
        ]
    },
    {
        id: "mantenimiento",
        title: "Sincro Evolutiva",
        icon: Sparkles,
        items: [
            "Actualización por aprendizaje IA",
            "Seguridad y optimización",
            "Mejoras trimestrales",
            "Crecimiento perpetuo",
            "Suscripción: ₡15.000 / $39 mes"
        ]
    }
];

const generateServicesSummary = () => {
    const summary = `*Curiol Studio 2026 - Legado vivo & Soluciones Comerciales*\n\n` +
        `*LEGADO FAMILIAR (B2C)*\n` +
        `• *Aventura Mágica*: ₡80.9k / $165\n` +
        `• *Recuerdos Eternos*: ₡77k / $149\n` +
        `• *Marca Personal*: ₡89k / $179\n` +
        `• *Membresía Legado*: ₡25k / $59 mes\n\n` +
        `*SOLUCIONES COMERCIALES (B2B)*\n` +
        `• *Omni Local*: ₡250k / $500\n` +
        `• *Omni Pro*: ₡750k / $1500\n` +
        `• *Omni Ultra*: ₡1.5M / $3000\n\n` +
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
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Legado Familiar</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[0.9] italic">
                            Portafolio de <br /> <span className="text-curiol-gradient">Experiencias 2026.</span>
                        </h1>
                        <p className="text-tech-400 text-base md:text-xl font-light leading-relaxed">
                            Diseñamos activos digitales que trascienden el tiempo. Desde las memorias vivas familiares hasta la aceleración tecnológica para el comercio local.
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
                                <h3 className="font-serif text-2xl text-white mb-6 italic leading-tight">{item.title}</h3>
                                <div className="space-y-3 w-full">
                                    {item.items.map((bullet, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-left">
                                            <div className={cn("w-1 h-1 rounded-full mt-2 shrink-0", item.highlight ? "bg-tech-500" : "bg-curiol-500")} />
                                            <p className="text-tech-400 text-[11px] font-light leading-snug">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
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
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <AgendaWidget />
                        <div className="bg-gradient-to-r from-tech-950 to-tech-900 border border-tech-800 p-12 rounded-[3rem] text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-curiol-700/10 via-transparent to-transparent opacity-50" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-serif text-white mb-8 italic">¿Listo para empezar?</h2>
                                <Link href="/cotizar" className="inline-flex items-center gap-4 px-10 py-5 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full">
                                    Personalizar mi Legado <ArrowRight className="w-4 h-4" />
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
