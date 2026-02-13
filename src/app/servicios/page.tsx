"use client";

import { useState } from "react";
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
import { getDirectImageUrl, cn } from "@/lib/utils";
import { PerspectiveCard } from "@/components/ui/PerspectiveCard";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const familyPackages = [
    {
        id: "aventura",
        title: "Aventura Mágica",
        icon: Sparkles,
        items: [
            "Exclusivo para niños: Imaginación hecha realidad",
            "15 Fotos High-End (Gama Alta) + IA",
            "Phygital: Realidad Aumentada Interactiva",
            "Viva Memory: Slideshow IA con música y letra",
            "Línea de Tiempo Evolutiva (Legacy Sync)",
            "Álbum Digital de Descarga (LTD)",
            "Retablo 5x7\" con NFC incluido",
            "Inversión: ₡98.000 / $195",
            "10% OFF en Phygital adicional (₡22.500)"
        ],
        highlight: true
    },
    {
        id: "recuerdos",
        title: "Recuerdos Eternos",
        icon: Camera,
        items: [
            "Conexión intergeneracional Fine Art",
            "15 Fotos Fine Art de alta gama",
            "Cuadros Vivos AR + Viva Memory",
            "Timeline Evolutivo Premium",
            "Álbum Digital de Descarga (LTD)",
            "Impresión de lujo en papel algodón",
            "Retablo 8x12\" con NFC",
            "Inversión: ₡132.250 / $265",
            "(Aumento del 15% aplicado)"
        ],
        highlight: false
    },
    {
        id: "legado",
        title: "Membresía Anual de Legado",
        icon: Users,
        items: [
            "Tu patrimonio emocional protegido",
            "Acompañamiento anual de evolución",
            "3 Sesiones programadas anuales",
            "Gestión de Timeline Core (Archivo Vivo)",
            "Álbum Digital de Descarga (LTD)",
            "Custodia digital hereditaria profesional",
            "Suscripción: ₡28.750 / $69 mes",
            "(Aumento del 15% aplicado)"
        ],
        highlight: false
    },
    {
        id: "relatos",
        title: "Relatos",
        icon: Sparkles,
        items: [
            "La esencia en formato ágil Fine-Art",
            "5 Fotos Fine-Art de alta intensidad",
            "Propósito claro y experto",
            "Álbum Digital de Descarga (LTD)",
            "Retablo 5x7\" incluido",
            "Inversión: ₡56.350 / $115",
            "(Aumento del 15% aplicado)"
        ],
        highlight: false
    }
];

const businessPackages = [
    {
        id: "express",
        title: "Web-Apps (Omni Local)",
        icon: Smartphone,
        items: [
            "Digitalización comercial esencial",
            "5 Fotos de perfil profesional incluidas",
            "Experiencia nativa instalable (PWA)",
            "Automatización de catálogo básico",
            "Timeline de Evolución de Marca",
            "Álbum Digital Assets (LTD)",
            "Inversión: ₡280.000 / $550"
        ],
        highlight: true
    },
    {
        id: "negocio",
        title: "No-Code (Omni Pro)",
        icon: Code,
        items: [
            "Aceleración digital premium",
            "5 Fotos de perfil profesional incluidas",
            "Infraestructura inteligente de ventas",
            "Filtro de IA Gemini para leads",
            "Timeline de Crecimiento Integrado",
            "Álbum Digital Assets (LTD)",
            "Inversión: ₡780.000 / $1550"
        ],
        highlight: true
    },
    {
        id: "ultra",
        title: "Omni Ultra (Curiol OS)",
        icon: Binary,
        items: [
            "Ecosistema digital absoluto",
            "5 Fotos de perfil profesional incluidas",
            "Cerebro digital de negocio IA",
            "Timeline de Activos Estratégicos",
            "Álbum Digital Assets (LTD)",
            "Soporte VIP y Hardware/Software",
            "Inversión: ₡1.53M / $3050"
        ],
        highlight: true
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
        ],
        highlight: false
    }
];

const generateServicesSummary = () => {
    const summary = `*Curiol Studio 2026 - Legado vivo & Crecimiento Comercial & IA*\n\n` +
        `*LEGADO FAMILIAR (B2C) - Tarifas 2026*\n` +
        `• *Aventura Mágica*: ₡98k / $195 (Imaginería High-end + AR + Viva Memory)\n` +
        `• *Recuerdos Eternos*: ₡132.2k / $265 (Fine Art + Evolución)\n` +
        `• *Relatos*: ₡56.3k / $115 (Esencia Fine Art)\n` +
        `• *Membresía Legado*: ₡28.7k / $69 mes\n\n` +
        `*CRECIMIENTO COMERCIAL & IA (B2B)*\n` +
        `• *Omni Local*: ₡280k / $550\n` +
        `• *Omni Pro*: ₡780k / $1550\n` +
        `• *Omni Ultra*: ₡1.53M / $3050\n\n` +
        `_Ingeniería digital con sensibilidad artística._`;
    return `https://wa.me/50660602617?text=${encodeURIComponent(summary)}`;
};

export default function ServiciosPage() {
    const [activeTab, setActiveTab] = useState<"family" | "business">("family");

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />

            <main className="flex-grow">
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-24 mt-10 md:mt-20">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Ecosistema 2026</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[0.9] italic">
                            Catálogo de <br /> <span className="text-curiol-gradient">Soluciones Phygital.</span>
                        </h1>
                        <p className="text-tech-400 text-base md:text-xl font-light leading-relaxed mb-12 max-w-2xl">
                            Estructuramos tu legado y potenciamos tu negocio mediante la fusión de visión artística e ingeniería de datos.
                        </p>

                        {/* Tabs Selector */}
                        <div className="flex p-1.5 bg-tech-900/80 backdrop-blur-2xl border border-white/10 rounded-full relative overflow-hidden w-fit shadow-2xl shadow-black/50">
                            <button
                                onClick={() => setActiveTab("family")}
                                className={cn(
                                    "relative px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all z-10",
                                    activeTab === "family" ? "text-white" : "text-tech-500 hover:text-tech-300"
                                )}
                            >
                                Legado Familiar
                            </button>
                            <button
                                onClick={() => setActiveTab("business")}
                                className={cn(
                                    "relative px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all z-10",
                                    activeTab === "business" ? "text-white" : "text-tech-500 hover:text-tech-300"
                                )}
                            >
                                Crecimiento Comercial
                            </button>
                            <motion.div
                                className="absolute inset-y-1.5 bg-curiol-gradient rounded-full shadow-lg"
                                initial={false}
                                animate={{
                                    left: activeTab === "family" ? "6px" : "calc(50% + 2px)",
                                    width: "calc(50% - 8px)"
                                }}
                                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                            />
                        </div>
                    </div>
                </header>

                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="mb-16">
                                <h2 className="text-3xl md:text-5xl font-serif text-white italic mb-4">
                                    {activeTab === "family" ? "Preservación de Memorias Vivas" : "Infraestructura de Crecimiento Comercial"}
                                </h2>
                                <p className="text-tech-500 text-sm md:text-lg font-light italic">
                                    {activeTab === "family"
                                        ? "Retratamos la esencia hoy para que sea eterna mañana, fusionando sensibilidad artesanal con custodia digital."
                                        : "Ingeniería digital diseñada para escalar tu marca con inteligencia artificial y experiencias inmersivas."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                                {(activeTab === "family" ? familyPackages : businessPackages).map((item) => (
                                    <PerspectiveCard key={item.id} className={cn("flex flex-col items-center text-center p-6 md:p-10 cursor-pointer", item.highlight && "border-tech-500 shadow-2xl shadow-tech-500/10")}>
                                        <div className={cn("mb-8 p-4 rounded-full ring-1", (item.highlight || activeTab === "business") ? "text-tech-500 bg-tech-500/5 ring-tech-500/20" : "text-curiol-500 bg-curiol-500/5 ring-curiol-500/20")}>
                                            <item.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-serif text-2xl text-white mb-6 italic leading-tight">{item.title}</h3>
                                        <div className="space-y-3 w-full mt-auto">
                                            {item.items.map((bullet, idx) => (
                                                <div key={idx} className="flex items-start gap-3 text-left">
                                                    <div className={cn("w-1 h-1 rounded-full mt-2 shrink-0", (item.highlight || activeTab === "business") ? "bg-tech-500" : "bg-curiol-500")} />
                                                    <p className="text-tech-400 text-[11px] font-light leading-snug">{bullet}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </PerspectiveCard>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </section>

                <PhygitalSimulation />

                <section className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <PerspectiveCard className="p-8 md:p-12 text-center border-curiol-500/20 cursor-pointer">
                        <MessageCircle className="w-10 h-10 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-serif text-white italic mb-4">Consulta Express por WhatsApp.</h2>
                        <p className="text-tech-400 font-light mb-10 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                            Genera un resumen detallado del catálogo 2026 y envíalo directamente a nuestro canal oficial para una asesoría personalizada.
                        </p>
                        <a
                            href={generateServicesSummary()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 px-12 py-5 bg-green-600/10 border border-green-500/30 text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all rounded-full group mx-auto"
                        >
                            Solicitar Asesoría por WhatsApp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </PerspectiveCard>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <AgendaWidget />
                        <div className="bg-gradient-to-r from-tech-950 to-tech-900 border border-tech-800 p-12 rounded-[3rem] text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-curiol-700/10 via-transparent to-transparent opacity-50" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-serif text-white mb-2 italic">¿Listo para iniciar?</h3>
                                <Link href="/cotizar" className="inline-flex items-center gap-4 px-10 py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-curiol-500/20 mb-6">
                                    Personalizar mi Legado <ArrowRight className="w-4 h-4" />
                                </Link>
                                <p className="text-[9px] text-tech-500 font-bold uppercase tracking-[0.2em] italic opacity-60">
                                    Reserva tu espacio en la agenda 2026
                                </p>
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
