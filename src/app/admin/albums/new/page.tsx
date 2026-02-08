"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Layout, Palette, Share2, Crop,
    Save, Eye, Trash2, Plus, Image as ImageIcon,
    Settings, Zap, CheckCircle2, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NewAlbumStudio() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [albumName, setAlbumName] = useState("");
    const [theme, setTheme] = useState("dark-canvas");
    const [uploading, setUploading] = useState(false);

    const themes = [
        { id: "dark-canvas", name: "Dark Canvas", primary: "bg-tech-950", accent: "border-curiol-500" },
        { id: "minimal-white", name: "Minimal White", primary: "bg-white", accent: "border-tech-900" },
        { id: "sepia-legacy", name: "Sepia Legacy", primary: "bg-[#2d241e]", accent: "border-[#c4a484]" }
    ];

    return (
        <div className="min-h-screen bg-tech-950 text-white selection:bg-curiol-500/30">
            {/* Header / Top Bar */}
            <div className="fixed top-0 left-0 w-full bg-tech-900/80 backdrop-blur-xl border-b border-white/5 p-4 z-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/5 rounded-full transition-all"
                    >
                        <X className="w-5 h-5 text-tech-500" />
                    </button>
                    <div className="h-6 w-px bg-white/10" />
                    <h2 className="font-serif italic text-lg tracking-wide">
                        Album Studio <span className="text-tech-600 font-sans text-xs uppercase ml-2 tracking-[0.2em]">Beta v2026</span>
                    </h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex bg-tech-950 p-1 rounded-lg border border-white/5">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded text-[10px] font-bold transition-all",
                                    step === s ? "bg-curiol-500 text-white" : "text-tech-600"
                                )}
                            >
                                0{s}
                            </div>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 transition-all">
                        <Eye className="w-4 h-4" /> Previsualizar
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-curiol-500/20 hover:scale-[1.02] transition-all">
                        <Save className="w-4 h-4" /> Finalizar Entrega
                    </button>
                </div>
            </div>

            <main className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                        >
                            {/* Left: Configuration */}
                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <h3 className="text-2xl font-serif italic flex items-center gap-3">
                                        <Settings className="w-5 h-5 text-curiol-500" /> Configuración Base
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Nombre del Álbum / Cliente</label>
                                            <input
                                                value={albumName}
                                                onChange={(e) => setAlbumName(e.target.value)}
                                                placeholder="Ej: Boda Familia Bustos Ortega"
                                                className="w-full bg-tech-900 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Tema y Estética</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {themes.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setTheme(t.id)}
                                                        className={cn(
                                                            "p-4 rounded-xl border flex items-center justify-between transition-all group",
                                                            theme === t.id ? "bg-curiol-500/10 border-curiol-500" : "bg-tech-900 border-white/5 hover:border-white/20"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn("w-10 h-10 rounded-lg shadow-inner", t.primary, t.accent, "border")} />
                                                            <p className="text-xs font-bold uppercase tracking-widest">{t.name}</p>
                                                        </div>
                                                        <ChevronRight className={cn("w-4 h-4 transition-transform", theme === t.id ? "text-white" : "text-tech-700 group-hover:translate-x-1")} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="p-6 bg-curiol-500/5 border border-curiol-500/20 rounded-2xl flex items-start gap-4">
                                    <Zap className="w-5 h-5 text-curiol-500 mt-1" />
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-white">Ciclo de Vida Automático</p>
                                        <p className="text-[10px] text-tech-500 leading-relaxed font-light">
                                            Este álbum estará disponible durante <span className="text-white font-bold">2 meses</span>.
                                            El sistema enviará alertas automáticas 3 días antes de la expiración.
                                        </p>
                                    </div>
                                </section>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-5 bg-white text-tech-950 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:brightness-90 transition-all font-sans"
                                >
                                    Siguiente Paso <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Center/Right: Photo Management */}
                            <div className="lg:col-span-2 space-y-8">
                                <section className="min-h-[500px] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center p-12 bg-tech-900/20 hover:bg-tech-900/40 transition-all group">
                                    <div className="w-20 h-20 bg-tech-900 rounded-full flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                                        <Plus className="w-8 h-8 text-curiol-500" />
                                    </div>
                                    <h4 className="text-2xl font-serif italic mb-2">Arrastra las memorias aquí</h4>
                                    <p className="text-tech-500 text-sm font-light mb-8">Arrastra archivos o haz clic para seleccionar.</p>
                                    <input type="file" multiple className="hidden" id="file-upload" />
                                    <label htmlFor="file-upload" className="px-10 py-5 bg-white text-tech-950 text-[10px] font-bold uppercase tracking-widest rounded-full hover:brightness-90 transition-all flex items-center gap-3 cursor-pointer">
                                        <Layout className="w-4 h-4" /> Seleccionar Archivos
                                    </label>
                                </section>

                                <div className="grid grid-cols-3 gap-6">
                                    {[
                                        { icon: Crop, label: "IA Smart Crop", desc: "Prioridad rostro redes." },
                                        { icon: Share2, label: "Social Pack", desc: "IG & FB formats auto." },
                                        { icon: Palette, label: "Color Match", desc: "Tema según ambiente." }
                                    ].map((f, i) => (
                                        <GlassCard key={i} className="p-6 text-center">
                                            <f.icon className="w-6 h-6 text-curiol-500 mx-auto mb-4" />
                                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-white mb-2">{f.label}</h5>
                                            <p className="text-[8px] text-tech-500 font-light">{f.desc}</p>
                                        </GlassCard>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                                <div>
                                    <h3 className="text-4xl font-serif italic mb-2">Revisión de Curaduría IA</h3>
                                    <p className="text-tech-500 text-sm">Ajusta los recortes y leyendas generados automáticamente.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-tech-500 hover:text-white transition-all">
                                        Atrás
                                    </button>
                                    <button onClick={() => setStep(3)} className="px-8 py-3 bg-white text-tech-950 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                                        Continuar
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((idx) => (
                                    <GlassCard key={idx} className="p-0 overflow-hidden group/item">
                                        <div className="aspect-[4/5] bg-tech-900 relative">
                                            <div className="absolute inset-0 bg-tech-950/40 opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center gap-4 z-10">
                                                <button className="p-3 bg-white text-tech-950 rounded-full hover:scale-110 transition-all shadow-xl">
                                                    <Crop className="w-4 h-4" />
                                                </button>
                                                <button className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-xl">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="px-2 py-1 bg-curiol-500 text-white text-[8px] font-bold uppercase rounded">Face Detected</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-tech-900/40 border-t border-white/5">
                                            <p className="text-[10px] text-tech-500 font-bold uppercase mb-1">Leyenda IA Sugerida</p>
                                            <p className="text-[11px] text-white/80 line-clamp-2 italic font-light">"La luz perfecta capturando la esencia de un momento eterno."</p>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-3xl mx-auto py-12 text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h3 className="text-4xl font-serif italic">Entrega Lista para Despegue</h3>
                            <p className="text-tech-500 font-light">
                                Se han procesado <span className="text-white font-bold">24 fotografías</span>. El cliente recibirá un enlace premium con su tema personalizado y el pack social completo.
                            </p>

                            <div className="p-8 bg-tech-900/50 border border-white/5 rounded-3xl text-left space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-tech-500 font-bold uppercase tracking-widest">URL del Álbum</span>
                                    <span className="text-curiol-500">curiol.studio/album/x7-boda-bust...</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-tech-500 font-bold uppercase tracking-widest">Expiración</span>
                                    <span className="text-white">08 de Mayo, 2026 (60 días)</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-tech-500 font-bold uppercase tracking-widest">Tema</span>
                                    <span className="text-white capitalize">{theme.replace('-', ' ')}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="flex-1 py-5 bg-tech-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl">
                                    Seguir Editando
                                </button>
                                <button className="flex-1 py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-curiol-500/20">
                                    Enviar Notificaciones (WA/Email)
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
