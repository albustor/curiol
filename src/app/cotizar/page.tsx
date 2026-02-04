"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

const PACKAGES = {
    family: [
        { id: "mini", name: "Mini Sesión", price: 25000, desc: "40 min, 5 fotos digitales." },
        { id: "aventura", name: "Aventura Mágica", price: 95000, desc: "Fantasía IA + Photobook." },
        { id: "esencia", name: "Esencia Familiar", price: 110000, desc: "25 Fotos + Cuadro AR." }
    ],
    business: [
        { id: "marca", name: "Marca Personal", price: 65000, desc: "Asesoría + Tarjeta NFC." },
        { id: "landing", name: "Landing Express", price: 85000, desc: "Presencia Web Ágil." },
        { id: "pro", name: "Negocio Pro", price: 145000, desc: "Web Corporativa Completa." }
    ]
};

const UPSELLS = {
    mini: { id: "retablo", name: "Retablo Físico", price: 15000, desc: "Convierte tus fotos digitales en una pieza de arte." },
    marca: { id: "landing_up", name: "Landing 'Link-in-bio'", price: 45000, desc: "El complemento perfecto para tu marca personal." }
};

export default function CotizadorPage() {
    const [step, setStep] = useState(0);
    const [category, setCategory] = useState<"family" | "business" | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [extras, setExtras] = useState<any[]>([]);

    const handleNext = () => setStep(s => Math.min(s + 1, SECTIONS.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    const total = (selectedPackage?.price || 0) + extras.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 w-full">
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

                <div className="relative overflow-hidden min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <GlassCard
                                    className={cn("cursor-pointer border-2 transition-all", category === 'family' ? "border-curiol-500" : "border-transparent")}
                                    onClick={() => { setCategory('family'); handleNext(); }}
                                >
                                    <Camera className="w-12 h-12 text-curiol-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-white mb-2 italic">Familias & Legado</h3>
                                    <p className="text-tech-400 text-sm font-light">Fotografía Fine Art, AR y memorias interactivas.</p>
                                </GlassCard>
                                <GlassCard
                                    className={cn("cursor-pointer border-2 transition-all", category === 'business' ? "border-tech-500" : "border-transparent")}
                                    onClick={() => { setCategory('business'); handleNext(); }}
                                >
                                    <Code className="w-12 h-12 text-tech-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-white mb-2 italic">Negocios & Marca</h3>
                                    <p className="text-tech-400 text-sm font-light">Estrategia visual y soluciones web para PyMES.</p>
                                </GlassCard>
                            </motion.div>
                        )}

                        {step === 1 && category && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {PACKAGES[category].map((pkg) => (
                                    <GlassCard
                                        key={pkg.id}
                                        className={cn("cursor-pointer border-2 h-full flex flex-col justify-between", selectedPackage?.id === pkg.id ? "border-curiol-500" : "border-transparent")}
                                        onClick={() => { setSelectedPackage(pkg); handleNext(); }}
                                    >
                                        <div>
                                            <h4 className="text-xl font-serif text-white mb-4 italic">{pkg.name}</h4>
                                            <p className="text-tech-400 text-xs font-light mb-6">{pkg.desc}</p>
                                        </div>
                                        <div className="pt-6 border-t border-tech-800">
                                            <span className="text-curiol-500 font-bold">₡{pkg.price.toLocaleString()}</span>
                                        </div>
                                    </GlassCard>
                                ))}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="mb-10 text-center">
                                    <h3 className="text-3xl font-serif text-white mb-4 italic">Potencia tu experiencia.</h3>
                                    <p className="text-tech-400">Hemos seleccionado estos complementos inteligentes para ti.</p>
                                </div>

                                <div className="max-w-2xl mx-auto space-y-6">
                                    {/* Smart Upsell Logic */}
                                    {selectedPackage?.id === 'mini' && (
                                        <div className="p-6 bg-curiol-700/10 border border-curiol-700/30 rounded-xl flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <Sparkles className="w-8 h-8 text-curiol-500" />
                                                <div>
                                                    <p className="text-white font-serif text-lg italic">{UPSELLS.mini.name}</p>
                                                    <p className="text-tech-500 text-xs">{UPSELLS.mini.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setExtras(e => [...e, UPSELLS.mini])}
                                                className="px-6 py-2 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all"
                                            >
                                                Añadir + ₡15k
                                            </button>
                                        </div>
                                    )}

                                    {selectedPackage?.id === 'marca' && (
                                        <div className="p-6 bg-tech-800/20 border border-tech-700 rounded-xl flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <Code className="w-8 h-8 text-tech-500" />
                                                <div>
                                                    <p className="text-white font-serif text-lg italic">{UPSELLS.marca.name}</p>
                                                    <p className="text-tech-500 text-xs">{UPSELLS.marca.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setExtras(e => [...e, UPSELLS.marca])}
                                                className="px-6 py-2 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all"
                                            >
                                                Añadir + ₡45k
                                            </button>
                                        </div>
                                    )}

                                    <div className="pt-10 flex justify-center">
                                        <button onClick={handleNext} className="text-tech-400 hover:text-white transition-all underline text-sm">Omitir complementos e ir al resumen</button>
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
                                <GlassCard className="border-tech-800">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-serif text-white italic mb-2">Resumen Final</h3>
                                            <p className="text-tech-500 text-xs uppercase tracking-widest">Curiol Studio • Cotización 2026</p>
                                        </div>
                                        <ShoppingCart className="w-8 h-8 text-curiol-500" />
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-tech-300">
                                            <span>Paquete: {selectedPackage?.name}</span>
                                            <span>₡{selectedPackage?.price.toLocaleString()}</span>
                                        </div>
                                        {extras.map((ex, idx) => (
                                            <div key={idx} className="flex justify-between text-curiol-500 text-sm italic">
                                                <span>+ {ex.name}</span>
                                                <span>₡{ex.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-tech-800 flex justify-between items-end mb-10">
                                        <span className="text-tech-500 uppercase tracking-widest text-[10px] font-bold">Total Estimado</span>
                                        <span className="text-4xl font-serif text-white italic">₡{total.toLocaleString()}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="py-4 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all">
                                            Exportar PDF
                                        </button>
                                        <button className="py-4 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all">
                                            Agendar en WhatsApp
                                        </button>
                                    </div>
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
        </div>
    );
}
