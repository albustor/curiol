"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    ClipboardCheck, ArrowLeft, Star, AlertTriangle,
    CheckCircle2, XCircle, Loader2, Save, Sparkles
} from "lucide-react";
import { saveQALog, QALog } from "@/actions/qa";
import { motion, AnimatePresence } from "framer-motion";

export default function QALogsPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState<Partial<QALog>>({
        testerName: "Cristina",
        featureName: "",
        navigation: 5,
        interaction: 5,
        responsiveness: 5,
        visualConsistency: 5,
        clarity: 5,
        performance: 5,
        notes: "",
        blockers: "",
        status: "pending"
    });

    const categories = [
        { key: "navigation", label: "Navegación", description: "Fluidez y facilidad de movimiento" },
        { key: "interaction", label: "Interacción", description: "Respuesta de botones y animaciones" },
        { key: "responsiveness", label: "Responsividad", description: "Adaptación móvil vs escritorio" },
        { key: "visualConsistency", label: "Consistencia Visual", description: "Estética y branding Curiol" },
        { key: "clarity", label: "Claridad & Textos", description: "Ortografía y comprensión" },
        { key: "performance", label: "Rendimiento", description: "Velocidad y fluidez general" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await saveQALog(form as QALog);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => router.push("/admin/dashboard"), 2000);
            } else {
                alert("Error al guardar: " + res.error);
            }
        } catch (error) {
            alert("Error crítico al enviar.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-tech-950 text-white flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow max-w-4xl mx-auto px-4 w-full">
                <header className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-tech-500 hover:text-white transition-colors mb-6 text-xs uppercase tracking-widest font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="h-[1px] w-8 bg-curiol-500"></span>
                        <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Control de Calidad (QA)</span>
                    </div>
                    <h1 className="text-4xl font-serif italic">Registros de <span className="text-curiol-500">Testeo</span></h1>
                    <p className="text-tech-500 text-sm mt-2">Cristina, tu validación es la base de nuestra excelencia.</p>
                </header>

                <AnimatePresence>
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 p-12 rounded-[2rem] text-center"
                        >
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-serif italic text-white mb-2">¡Reporte Guardado!</h2>
                            <p className="text-tech-500">Redirigiendo al centro de control...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <GlassCard className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600">Encargada de Prueba</label>
                                        <input
                                            type="text"
                                            value={form.testerName}
                                            onChange={e => setForm({ ...form, testerName: e.target.value })}
                                            className="w-full bg-tech-900/50 border border-tech-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-curiol-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600">Funcionalidad / Paquete en Prueba</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Álbum Digital Pro v2"
                                            value={form.featureName}
                                            onChange={e => setForm({ ...form, featureName: e.target.value })}
                                            className="w-full bg-tech-900/50 border border-tech-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-curiol-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categories.map((cat) => (
                                        <div key={cat.key} className="p-4 bg-tech-950/50 border border-white/5 rounded-2xl">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">{cat.label}</p>
                                            <p className="text-[9px] text-tech-600 mb-4">{cat.description}</p>
                                            <div className="flex justify-between items-center bg-tech-900/40 p-2 rounded-xl">
                                                {[1, 2, 3, 4, 5].map((val) => (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        onClick={() => setForm({ ...form, [cat.key]: val })}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${(form as any)[cat.key] === val
                                                                ? "bg-curiol-500 text-white"
                                                                : "hover:bg-white/5 text-tech-600"
                                                            }`}
                                                    >
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-curiol-500" /> Observaciones y Feedback Detallado
                                        </label>
                                        <textarea
                                            className="w-full h-32 bg-tech-900/50 border border-tech-800 rounded-2xl px-4 py-4 text-white text-sm outline-none focus:border-curiol-500 transition-all resize-none"
                                            placeholder="Detalla qué viste, qué te gustó o qué se puede mejorar..."
                                            value={form.notes}
                                            onChange={e => setForm({ ...form, notes: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                                            <AlertTriangle className="w-3 h-3" /> Bloqueos o ErroresCríticos
                                        </label>
                                        <textarea
                                            className="w-full h-24 bg-red-500/5 border border-red-500/20 rounded-2xl px-4 py-4 text-white text-sm outline-none focus:border-red-500/50 transition-all resize-none"
                                            placeholder="Si algo no funciona o rompe la experiencia, anótalo aquí..."
                                            value={form.blockers}
                                            onChange={e => setForm({ ...form, blockers: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-tech-600 mr-2">Resultado Final:</p>
                                        <div className="flex gap-2">
                                            {[
                                                { id: "pass", label: "Aprobado", icon: CheckCircle2, color: "bg-green-500/10 border-green-500/30 text-green-500", active: "bg-green-500 text-white" },
                                                { id: "pending", label: "Pendiente", icon: Loader2, color: "bg-amber-500/10 border-amber-500/30 text-amber-500", active: "bg-amber-500 text-white" },
                                                { id: "fail", label: "Rechazado", icon: XCircle, color: "bg-red-500/10 border-red-500/30 text-red-500", active: "bg-red-500 text-white" }
                                            ].map((st) => (
                                                <button
                                                    key={st.id}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, status: st.id as any })}
                                                    className={`px-4 py-2 border rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${form.status === st.id ? st.active : st.color
                                                        }`}
                                                >
                                                    <st.icon className="w-3 h-3" /> {st.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full md:w-auto px-12 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-xl shadow-curiol-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" /> Guardar Validación
                                            </>
                                        )}
                                    </button>
                                </div>
                            </GlassCard>
                        </form>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
