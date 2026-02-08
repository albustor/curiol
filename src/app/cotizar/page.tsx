"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { Camera, Code, ArrowRight, CheckCircle2, AlertCircle, ShoppingCart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
    { id: "category", label: "Categoría" },
    { id: "package", label: "Paquete" },
    { id: "upsell", label: "Complementos" },
    { id: "summary", label: "Resumen" }
];

const PACKAGES: Record<string, Array<{ id: string; name: string; price: number; usdPrice: number; desc: string; isMonthly?: boolean; isHourly?: boolean }>> = {
    family: [
        { id: "aventura", name: "Aventura Mágica (Phygital)", price: 95000, usdPrice: 199, desc: "15 Fotos Fine Art + IA. Realidad Aumentada y música personalizada. El arte físico cobra vida." },
        { id: "esencia", name: "Esencia Familiar", price: 110000, usdPrice: 249, desc: "20 Fotos High-End. Cuadros Vivos interactivos con Realidad Aumentada y App de legado Hogar." },
        { id: "marca", name: "Marca Personal", price: 65000, usdPrice: 149, desc: "15 Fotos de impacto. Incluye asesoría visual y tarjeta de contacto inteligente para networking." },
        { id: "legado", name: "Membresía Legado", price: 25000, usdPrice: 59, desc: "Biógrafo familiar: 3 sesiones al año y custodia de herencia digital interactiva.", isMonthly: true },
        { id: "navidad", name: "Instantes de Luz", price: 40000, usdPrice: 99, desc: "15 Fotos temáticas + Tarjeta física con mensaje de video en Realidad Aumentada incluido." },
        { id: "mini", name: "Minisesiones Phygital", price: 25000, usdPrice: 49, desc: "8 Fotos ágiles. Incluye un detalle interactivo de Realidad Aumentada para compartir." }
    ],
    business: [
        { id: "express", name: "Omni Core (Ventas)", price: 85000, usdPrice: 199, desc: "Motor de presencia. Landing de alto impacto + Chatbot IA con contexto total de tu negocio." },
        { id: "negocio", name: "Omni Pro (Crecimiento)", price: 145000, usdPrice: 349, desc: "Tu sucursal digital 24/7. Web-App, Catálogo interactivo y Chatbot avanzado para cerrar ventas." },
        { id: "mantenimiento", name: "Omni Sincro", price: 15000, usdPrice: 39, desc: "Evolución digital: actualización trimestral de inteligencia artificial y seguridad.", isMonthly: true }
    ]
};

const UPSELLS = {
    nfc: { id: "nfc", name: "Puente Físico Inteligente", price: 20000, usdPrice: 40, desc: "Tarjeta premium NFC con Realidad Aumentada integrada para impacto inmediato." },
    cuadro: { id: "cuadro", name: "Cuadro Vivo Extra", price: 45000, usdPrice: 95, desc: "Canvas 16x20\" con Realidad Aumentada para expandir tu galería física." },
    seo: { id: "seo", name: "Optimización IA Search", price: 25000, usdPrice: 55, desc: "Configuración de visibilidad local y textos persuasivos optimizados por IA." }
};

export default function CotizadorPage() {
    const [step, setStep] = useState(0);
    const [currency, setCurrency] = useState<"CRC" | "USD">("CRC");
    const [category, setCategory] = useState<"family" | "business" | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [extras, setExtras] = useState<any[]>([]);
    const [hours, setHours] = useState(2);
    const [isCoastal, setIsCoastal] = useState(false);

    const handleNext = () => setStep(s => Math.min(s + 1, SECTIONS.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    const packageBaseTotal = selectedPackage
        ? (currency === "CRC" ? selectedPackage.price : selectedPackage.usdPrice)
        : 0;

    const packageTotal = selectedPackage?.isHourly
        ? packageBaseTotal * hours
        : packageBaseTotal;

    const coastalFee = isCoastal
        ? (currency === "CRC" ? 15000 : 30)
        : 0;

    const total = packageTotal + coastalFee +
        extras.reduce((acc, curr) => acc + (currency === "CRC" ? curr.price : curr.usdPrice), 0);

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 w-full">
                {/* Currency Toggle */}
                <div className="flex justify-end mb-8">
                    <div className="flex bg-tech-800 p-1 rounded-full border border-tech-700">
                        <button
                            onClick={() => setCurrency("CRC")}
                            className={cn("px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all", currency === "CRC" ? "bg-curiol-700 text-white" : "text-tech-500")}
                        >
                            CRC
                        </button>
                        <button
                            onClick={() => setCurrency("USD")}
                            className={cn("px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all", currency === "USD" ? "bg-curiol-700 text-white" : "text-tech-500")}
                        >
                            USD
                        </button>
                    </div>
                </div>

                {/* Progress Header */}
                <div className="flex justify-between items-center mb-16 px-4">
                    {SECTIONS.map((s, idx) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 group">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                step === idx ? "border-curiol-500 bg-curiol-500/10 text-curiol-500 scale-110" :
                                    step > idx ? "border-green-500 bg-green-500/10 text-green-500" : "border-tech-800 text-tech-500"
                            )}>
                                {step > idx ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                            </div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", step === idx ? "text-curiol-500" : "text-tech-500")}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative overflow-hidden min-h-[550px]">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <GlassCard
                                    className={cn("cursor-pointer border-2 transition-all", category === 'family' ? "border-curiol-500 shadow-2xl shadow-curiol-500/20" : "border-transparent")}
                                    onClick={() => { setCategory('family'); handleNext(); }}
                                >
                                    <Camera className="w-12 h-12 text-curiol-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-white mb-2 italic">Legado Familiar</h3>
                                    <p className="text-tech-400 text-sm font-light leading-relaxed">Memorias Vivas & Personal. Fotografía Fine Art y legados digitales que perduran.</p>
                                </GlassCard>
                                <GlassCard
                                    className={cn("cursor-pointer border-2 transition-all", category === 'business' ? "border-tech-500 shadow-2xl shadow-tech-500/20" : "border-transparent")}
                                    onClick={() => { setCategory('business'); handleNext(); }}
                                >
                                    <Code className="w-12 h-12 text-tech-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-white mb-2 italic">Motor de Soluciones Comerciales</h3>
                                    <p className="text-tech-400 text-sm font-light leading-relaxed">Atraemos miradas, cerramos ventas. Tu negocio visible y creciendo 24/7 con infraestructura inteligente.</p>
                                </GlassCard>
                            </motion.div>
                        )}

                        {step === 1 && category && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {PACKAGES[category].map((pkg) => (
                                    <GlassCard
                                        key={pkg.id}
                                        className={cn("cursor-pointer border-2 h-full flex flex-col justify-between transition-all hover:border-curiol-500/50", selectedPackage?.id === pkg.id ? "border-curiol-500 scale-[1.02] shadow-2xl shadow-curiol-500/10" : "border-transparent")}
                                        onClick={() => { setSelectedPackage(pkg); handleNext(); }}
                                    >
                                        <div>
                                            <h4 className="text-xl font-serif text-white mb-4 italic leading-tight">{pkg.name}</h4>
                                            <p className="text-tech-400 text-xs font-light mb-6 leading-relaxed">{pkg.desc}</p>
                                        </div>
                                        <div className="pt-6 border-t border-tech-800 flex justify-between items-center">
                                            <span className="text-curiol-500 font-bold">
                                                {currency === "USD" ? "$" : "₡"}
                                                {currency === "USD" ? pkg.usdPrice.toLocaleString() : pkg.price.toLocaleString()}
                                                {pkg.isMonthly && " / mes"}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-tech-800 flex items-center justify-center">
                                                <ArrowRight className="w-4 h-4 text-tech-500" />
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}

                                {selectedPackage?.isHourly && (
                                    <div className="md:col-span-2 lg:col-span-3 mt-8 p-8 bg-tech-900 border border-tech-700 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <p className="text-white font-serif text-xl italic">Calculadora de Cobertura</p>
                                            <p className="text-tech-500 text-xs">Ajusta la cantidad de horas estimadas para tu evento.</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => setHours(h => Math.max(2, h - 1))}
                                                className="w-12 h-12 rounded-full border border-tech-700 flex items-center justify-center text-white hover:bg-tech-800 transition-all"
                                            >
                                                -
                                            </button>
                                            <div className="text-center min-w-[80px]">
                                                <span className="text-3xl font-serif text-white italic">{hours}h</span>
                                                <p className="text-[8px] text-tech-600 font-bold uppercase tracking-widest mt-1">Sugerido: ₡{total.toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => setHours(h => Math.min(12, h + 1))}
                                                className="w-12 h-12 rounded-full border border-tech-700 flex items-center justify-center text-white hover:bg-tech-800 transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="mb-10 text-center">
                                    <h3 className="text-3xl font-serif text-white mb-4 italic">Potencia tu Legado.</h3>
                                    <p className="text-tech-400">Selecciona complementos Phygital e IA para expandir tu impacto.</p>
                                </div>

                                <div className="max-w-2xl mx-auto space-y-4">
                                    {Object.values(UPSELLS).map((up) => (
                                        <div key={up.id} className="p-6 bg-tech-800/30 border border-tech-700 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-curiol-500/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-curiol-500/10 flex items-center justify-center text-curiol-500 font-bold">
                                                    +
                                                </div>
                                                <div>
                                                    <p className="text-white font-serif text-lg italic">{up.name}</p>
                                                    <p className="text-tech-500 text-xs">{up.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (extras.find(e => e.id === up.id)) {
                                                        setExtras(extras.filter(e => e.id !== up.id));
                                                    } else {
                                                        setExtras([...extras, up]);
                                                    }
                                                }}
                                                className={cn(
                                                    "px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all w-full md:w-auto",
                                                    extras.find(e => e.id === up.id) ? "bg-curiol-500 text-white" : "bg-tech-700 text-tech-300 hover:bg-tech-600"
                                                )}
                                            >
                                                {extras.find(e => e.id === up.id) ? "Añadido" : `Añadir + ${currency === "USD" ? `$${up.usdPrice}` : `₡${up.price.toLocaleString()}`}`}
                                            </button>
                                        </div>
                                    ))}

                                    <div className="pt-10 flex flex-col items-center gap-6">
                                        <button onClick={handleNext} className="px-12 py-5 bg-tech-100 text-tech-950 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all rounded-full">
                                            Ver Resumen de Propuesta
                                        </button>
                                        <button onClick={handleBack} className="text-tech-500 hover:text-white transition-all text-xs uppercase tracking-widest font-bold">Volver</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="max-w-xl mx-auto"
                            >
                                <GlassCard className="border-tech-800 relative overflow-hidden">
                                    {/* Watermark Logo Signature */}
                                    <div className="absolute -bottom-10 -right-10 font-['Great_Vibes'] text-8xl text-white/5 pointer-events-none select-none -rotate-12">
                                        Alberto Bustos
                                    </div>

                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <h3 className="text-3xl font-serif text-white italic mb-2">Propuesta 2026</h3>
                                            <p className="text-tech-500 text-[10px] font-bold uppercase tracking-[0.3em]">Curiol Studio • Digitalización Humana</p>
                                        </div>
                                        <ShoppingCart className="w-8 h-8 text-curiol-500" />
                                    </div>

                                    <div className="space-y-6 mb-12">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-tech-500 text-[9px] font-bold uppercase tracking-widest mb-1">Paquete Base</p>
                                                <p className="text-white text-lg font-serif italic">{selectedPackage?.name}</p>
                                            </div>
                                            <span className="text-white font-bold">
                                                {currency === "USD" ? "$" : "₡"}
                                                {total.toLocaleString()}
                                                {selectedPackage?.isHourly && ` (${hours}h)`}
                                                {selectedPackage?.isMonthly && " / mes"}
                                            </span>
                                        </div>

                                        {isCoastal && (
                                            <div className="flex justify-between text-curiol-500 text-xs italic">
                                                <span>+ Logística Zona Costera</span>
                                                <span>{currency === "USD" ? `$${coastalFee}` : `₡${coastalFee.toLocaleString()}`}</span>
                                            </div>
                                        )}

                                        {extras.length > 0 && (
                                            <div className="pt-6 border-t border-tech-800 space-y-4">
                                                <p className="text-tech-500 text-[9px] font-bold uppercase tracking-widest">Complementos Seleccionados</p>
                                                {extras.map((ex, idx) => (
                                                    <div key={idx} className="flex justify-between text-curiol-500 text-sm italic">
                                                        <span>+ {ex.name}</span>
                                                        <span>{currency === "USD" ? "$" : "₡"}{currency === "USD" ? ex.usdPrice.toLocaleString() : ex.price.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-8 border-t border-tech-800 flex justify-between items-end mb-12">
                                        <div>
                                            <p className="text-tech-500 text-[9px] font-bold uppercase tracking-widest mb-1">Inversión Estimada</p>
                                            <p className="text-tech-400 text-[10px] italic">Sujeto a confirmación técnica</p>
                                        </div>
                                        <span className="text-5xl font-serif text-white italic">
                                            {currency === "USD" ? "$" : "₡"}{total.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button className="py-5 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all rounded-xl">
                                            Exportar Detalle
                                        </button>
                                        <button className="py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded-xl shadow-xl shadow-curiol-500/20">
                                            Confirmar WhatsApp
                                        </button>
                                    </div>
                                    <button onClick={handleBack} className="w-full text-center mt-8 text-tech-500 hover:text-white transition-all text-[10px] uppercase font-bold tracking-widest">Modificar Selección</button>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Bottom) */}
                {step > 0 && step < 3 && (
                    <div className="mt-16 flex justify-between items-center px-4">
                        <button onClick={handleBack} className="text-tech-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                            Volver
                        </button>
                        <button onClick={handleNext} className="px-8 py-3 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all flex items-center gap-2">
                            Continuar <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </main>

            <Footer />
            <AiAssistant />
        </div>
    );
}
