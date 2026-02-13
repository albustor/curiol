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
            "Viva Memory: Slideshow IA con música y letra (INCLUIDO)",
            "Línea de Tiempo Evolutiva (Legacy Sync)",
            "Álbum Digital de Descarga (LTD)",
            "Retablo 5x7\" con NFC incluido",
            "Inversión Estándar: ₡112.700 / $225",
            "Beneficio Pago de Contado: -15% (₡95.800)",
            "(Opcional) Phygital AR: Beneficio especial aplicado"
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
            "Portal de Entrega: Acceso Privado (User/Pass)",
            "Retablo 8x12\" con NFC",
            "Inversión Estándar: ₡132.250 / $265",
            "Beneficio Pago de Contado: -15% (₡112.400)"
        ],
        highlight: false
    },
    {
        id: "legado",
        title: "Membresía de Legado",
        icon: Users,
        items: [
            "Tu patrimonio emocional protegido",
            "Acompañamiento anual de evolución",
            "3 Sesiones programadas (Recuerdos Eternos)",
            "Portal de Entrega Privado (User/Pass)",
            "Gestión de Timeline Core (Archivo Vivo)",
            "Custodia digital hereditaria profesional",
            "Plan Semestral: ₡59.490 mes (-10% desc)",
            "Plan Anual: ₡29.414 mes (-11% desc)"
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
            "Portal de Entrega: Acceso Privado",
            "Inversión Estándar: ₡56.350 / $115",
            "Beneficio Pago de Contado: -15% (₡47.900)"
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
        `• *Aventura Mágica*: ₡112.7k / $225\n` +
        `• *Recuerdos Eternos*: ₡132.2k / $265\n` +
        `• *Relatos*: ₡56.3k / $115\n` +
        `• *Membresía*: Desde ₡29.4k/mes (Plan Anual)\n\n` +
        `*BENEFICIO PAGO DE CONTADO: -15% EN TODOS LOS PLANES*\n\n` +
        `*PORTAL DE ENTREGA: Acceso privado incluido*\n\n` +
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
                        <div className="flex p-1.5 bg-tech-900/80 backdrop-blur-2xl border border-white/10 rounded-full relative overflow-hidden w-fit shadow-[0_0_30px_rgba(180,95,50,0.2)]">
                            <button
                                onClick={() => setActiveTab("family")}
                                className={cn(
                                    "relative px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all z-10",
                                    activeTab === "family" ? "text-white" : "text-tech-500 hover:text-white"
                                )}
                            >
                                Legado Familiar
                            </button>
                            <button
                                onClick={() => setActiveTab("business")}
                                className={cn(
                                    "relative px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all z-10",
                                    activeTab === "business" ? "text-white" : "text-tech-500 hover:text-white"
                                )}
                            >
                                Crecimiento Comercial
                            </button>
                            <motion.div
                                className="absolute inset-y-1.5 bg-curiol-gradient rounded-full shadow-[0_0_20px_rgba(180,95,50,0.4)]"
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
                                        ? "Retratamos la esencia hoy para que sea eterna mañana, fusionando sensibilidad artesanal con fotografía de vanguardia."
                                        : "Ingeniería digital diseñada para escalar tu marca con inteligencia artificial y experiencias inmersivas."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                                {(activeTab === "family" ? familyPackages : businessPackages).map((item) => (
                                    <ServiceCard key={item.id} item={item} activeTab={activeTab} />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="bg-tech-900/50 border border-tech-800 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-curiol-500/10 blur-[100px] -mr-48 -mt-48" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest mb-4 block">Ecosistema Curiol & IA</span>
                                <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 italic">El Arte de lo <span className="text-curiol-gradient">Interactivo.</span></h2>
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-tech-800 flex items-center justify-center shrink-0 border border-tech-700">
                                            <Smartphone className="text-curiol-500 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-serif text-xl mb-2 italic">Descargas High-End (LTD)</h4>
                                            <p className="text-tech-400 text-sm font-light leading-relaxed">Olvídate de versiones comprimidas por redes sociales. Recibes tus fotografías en resolución maestra directamente de nuestro servidor de activos, optimizadas para impresión Fine Art o pantallas 4K.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-tech-800 flex items-center justify-center shrink-0 border border-tech-700">
                                            <Binary className="text-curiol-500 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-serif text-xl mb-2 italic">Línea de Tiempo Familiar (Sync)</h4>
                                            <p className="text-tech-400 text-sm font-light leading-relaxed">Tu legado es un organismo vivo. Cada sesión se sincroniza automáticamente con tu Línea de Tiempo Evolutiva, creando un archivo histórico dinámico que puedes consultar años después.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-tech-800 flex items-center justify-center shrink-0 border border-tech-700">
                                            <Sparkles className="text-curiol-500 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-serif text-xl mb-2 italic">Patrimonio Phygital 2026</h4>
                                            <p className="text-tech-400 text-sm font-light leading-relaxed">Fusionamos lo físico (Retablos NFC) con lo digital (Realidad Aumentada). Tu casa no solo muestra arte, cuenta tu historia interactiva mediante IA.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-square bg-tech-800 rounded-3xl border border-tech-700 overflow-hidden flex items-center justify-center cursor-pointer group">
                                <PhygitalSimulation />
                                <div className="absolute inset-0 bg-tech-950/40 group-hover:bg-tech-950/20 transition-all flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 border-2 border-curiol-500/50 rounded-full animate-[ping_3s_infinite] mb-4" />
                                        <div className="text-white text-[8px] font-bold uppercase tracking-[0.5em] animate-pulse">Explorar Realidad Aumentada</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

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

function ServiceCard({ item, activeTab }: { item: any, activeTab: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <PerspectiveCard
            className={cn(
                "flex flex-col items-center text-center p-6 md:p-10 cursor-pointer transition-all duration-500",
                item.highlight && "border-tech-500 shadow-2xl shadow-tech-500/10",
                isExpanded ? "scale-[1.02] border-curiol-500/40" : ""
            )}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className={cn("mb-8 p-4 rounded-full ring-1 transition-colors", (item.highlight || activeTab === "business") ? "text-tech-500 bg-tech-500/5 ring-tech-500/20" : "text-curiol-500 bg-curiol-500/5 ring-curiol-500/20")}>
                <item.icon className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-6 italic leading-tight">{item.title}</h3>

            <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : "180px" }}
                className="overflow-hidden relative w-full"
            >
                <div className="space-y-3 w-full pb-4">
                    {item.items.map((bullet: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 text-left">
                            <div className={cn("w-1 h-1 rounded-full mt-2 shrink-0", (item.highlight || activeTab === "business") ? "bg-tech-500" : "bg-curiol-500")} />
                            <p className="text-tech-400 text-[11px] font-light leading-snug">{bullet}</p>
                        </div>
                    ))}
                </div>

                {!isExpanded && item.items.length > 4 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-tech-950/40 to-transparent flex items-end justify-center pb-1">
                        <span className="text-[7px] font-bold text-curiol-500 uppercase tracking-widest opacity-60">Click para ver más</span>
                    </div>
                )}
            </motion.div>

            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 pt-6 border-t border-white/5 w-full flex flex-col gap-4"
                >
                    <p className="text-[10px] text-tech-500 font-light italic">
                        *Este paquete incluye acceso exclusivo al ecosistema digital de Curiol Studio para la gestión de su legado en resolución maestra.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/cotizar"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-curiol-gradient text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all w-full"
                        >
                            Reservar ahora <ArrowRight className="w-3 h-3" />
                        </Link>

                        {(activeTab === "family" || item.id === "express") && (
                            <Link
                                href="/pago-cuotas"
                                className="text-tech-500 hover:text-white text-[8px] font-bold uppercase tracking-[0.2em] transition-colors border-b border-white/5 pb-1 w-fit mx-auto"
                            >
                                Financiamiento
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </PerspectiveCard>
    );
}
