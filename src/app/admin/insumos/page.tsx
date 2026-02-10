"use client";

import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Brain, Upload, FileText, Image as ImageIcon,
    Mic, Video, Send, Loader2, CheckCircle2,
    TrendingUp, Heart, Lightbulb, User
} from "lucide-react";
import { useState, useEffect } from "react";
import { processAndSaveInsumo, getRecentInsumos, InsumoData, InsumoType } from "@/actions/ai-insumos";
import { useRouter } from "next/navigation"; // Assuming useRouter is from next/navigation

export default function AIInsumosPage() {
    const [insumos, setInsumos] = useState<InsumoData[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [textInput, setTextInput] = useState("");
    const [selectedType, setSelectedType] = useState<InsumoType>("text");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const isMaster = localStorage.getItem("master_admin") === "true";
        if (!isMaster) {
            router.push("/admin/dashboard");
        }
        loadInsumos();
    }, [router]);

    const loadInsumos = async () => {
        setFetching(true);
        const data = await getRecentInsumos();
        setInsumos(data);
        setFetching(false);
    };

    const handleUpload = async () => {
        if (!textInput.trim()) return;

        setLoading(true);
        const result = await processAndSaveInsumo("text", { text: textInput }, "Alberto");

        if (result.success) {
            setTextInput("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            loadInsumos();
        }
        setLoading(false);
    };

    const typeIcons = {
        text: <FileText className="w-4 h-4" />,
        image: <ImageIcon className="w-4 h-4" />,
        audio: <Mic className="w-4 h-4" />,
        video: <Video className="w-4 h-4" />
    };

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Brain className="text-curiol-500 w-5 h-5" />
                        <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Inteligencia Intencional</span>
                    </div>
                    <h1 className="text-6xl font-serif text-white italic tracking-tight">Insumos para IA</h1>
                    <p className="text-tech-500 mt-4 max-w-2xl font-light">
                        Alimenta el cerebro de Curiol Studio con ideas, emociones y tendencias.
                        Gemini analizará cada pieza para personalizar tus servicios.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassCard className="p-8 border-curiol-500/20 bg-curiol-500/5">
                            <h3 className="text-xl font-serif text-white italic mb-6 flex items-center gap-3">
                                <Upload className="w-5 h-5 text-curiol-500" />
                                Nuevo Insumo Estratégico
                            </h3>

                            <div className="flex gap-4 mb-6">
                                {(['text', 'image', 'audio', 'video'] as InsumoType[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedType(t)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                                            selectedType === t
                                                ? "bg-curiol-500 border-curiol-400 text-white shadow-lg"
                                                : "bg-tech-900 border-white/5 text-tech-500 hover:text-white"
                                        )}
                                    >
                                        {typeIcons[t]}
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder={
                                        selectedType === 'text'
                                            ? "Describe una idea, una emoción o una tendencia de mercado..."
                                            : `Describe el contenido del archivo ${selectedType} que vas a subir...`
                                    }
                                    className="w-full bg-tech-900/50 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-curiol-500 h-40 resize-none font-light placeholder:text-tech-700"
                                />

                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] text-tech-600 italic">
                                        * La IA procesará esto para informes semanales y el chatbot de WhatsApp.
                                    </p>
                                    <button
                                        onClick={handleUpload}
                                        disabled={loading || !textInput.trim()}
                                        className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-curiol-500/20 flex items-center gap-3 hover:brightness-110 transition-all disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Procesar Insumo
                                    </button>
                                </div>
                            </div>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500 text-xs"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    ¡Insumo recibido y procesado por el cerebro de la IA!
                                </motion.div>
                            )}
                        </GlassCard>

                        {/* Recent Insumos List */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-serif text-white italic px-2">Historial de Inteligencia</h3>
                            {fetching ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="w-8 h-8 text-curiol-500 animate-spin" />
                                </div>
                            ) : insumos.map((insumo, idx) => (
                                <GlassCard key={insumo.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-tech-900 rounded-lg text-curiol-500">
                                                {typeIcons[insumo.type]}
                                            </div>
                                            <div>
                                                <p className="text-white text-xs font-bold flex items-center gap-2">
                                                    <User className="w-3 h-3 text-tech-600" />
                                                    {insumo.author}
                                                </p>
                                                <p className="text-tech-600 text-[8px] uppercase tracking-widest">
                                                    {new Date(insumo.createdAt.seconds * 1000).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-tech-900 rounded-md text-[8px] text-green-500 font-bold uppercase border border-white/5">
                                                Analizado
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-tech-300 text-sm font-light mb-6 line-clamp-3 italic">
                                        "{insumo.content || insumo.metadata?.summary}"
                                    </p>

                                    {insumo.metadata && (
                                        <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                                            <div className="space-y-1">
                                                <span className="text-[8px] text-tech-600 uppercase font-bold flex items-center gap-1">
                                                    <Heart className="w-2 h-2" /> Emoción
                                                </span>
                                                <p className="text-[10px] text-pink-500 font-bold">{insumo.metadata.emotion}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] text-tech-600 uppercase font-bold flex items-center gap-1">
                                                    <TrendingUp className="w-2 h-2" /> Intención
                                                </span>
                                                <p className="text-[10px] text-blue-500 font-bold capitalize">{insumo.metadata.strategic_intent}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] text-tech-600 uppercase font-bold flex items-center gap-1">
                                                    <Lightbulb className="w-2 h-2" /> Patrones
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {insumo.metadata.patterns?.slice(0, 2).map((p, i) => (
                                                        <span key={i} className="text-[8px] text-white/40">{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Stats / Actions Sidebar */}
                    <div className="space-y-6">
                        <GlassCard className="p-8 h-fit">
                            <h3 className="text-xl font-serif text-white italic mb-6">Métricas de Sentimiento</h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Innovación Tech", value: 85, color: "bg-blue-500" },
                                    { label: "Conexión Emocional", value: 70, color: "bg-pink-500" },
                                    { label: "Intención Comercial", value: 60, color: "bg-green-500" }
                                ].map((m, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase font-bold">
                                            <span className="text-tech-500">{m.label}</span>
                                            <span className="text-white">{m.value}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-tech-900 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${m.value}%` }}
                                                className={cn("h-full", m.color)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 border-curiol-500/10 bg-curiol-500/5 hover:bg-curiol-500/10 transition-all cursor-pointer group">
                            <h3 className="text-xl font-serif text-white italic mb-2">Generar Reporte Semanal</h3>
                            <p className="text-tech-500 text-[10px] font-light mb-6">
                                Sintetiza todos los insumos en un audio estratégico para la toma de decisiones.
                            </p>
                            <button className="w-full py-4 bg-tech-900 text-white text-[8px] font-bold uppercase tracking-widest rounded-xl border border-white/5 group-hover:bg-curiol-500 transition-all">
                                Sintetizar Inteligencia
                            </button>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
}
