"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    BarChart3,
    TrendingUp,
    Users,
    Sparkles,
    ArrowRight,
    Calendar,
    MousePointer2,
    MessageSquare,
    BrainCircuit,
    Loader2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore";
import { generateAiChatResponse } from "@/lib/gemini"; // We'll use this for strategic insights
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";

export default function AnalyticsDashboard() {
    const { role, isMaster } = useRole();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [interactions, setInteractions] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [aiInsights, setAiInsights] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        } else if (role !== "LOADING" && !isMaster) {
            router.push("/admin/dashboard");
        }
    }, [role, isMaster, router]);

    useEffect(() => {
        if (isMaster) {
            loadData();
        }
    }, [isMaster]);

    const loadData = async () => {
        try {
            // Last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const ts = Timestamp.fromDate(thirtyDaysAgo);

            // Fetch interactions
            const qInteractions = query(
                collection(db, "interactions"),
                where("timestamp", ">=", ts),
                orderBy("timestamp", "desc")
            );
            const interSnap = await getDocs(qInteractions);
            setInteractions(interSnap.docs.map(d => d.data()));

            // Fetch recent quotes for context
            const qQuotes = query(
                collection(db, "quotes"),
                where("createdAt", ">=", ts),
                orderBy("createdAt", "desc")
            );
            const quoteSnap = await getDocs(qQuotes);
            setQuotes(quoteSnap.docs.map(d => d.data()));

        } catch (error) {
            console.error("Error loading analytics data:", error);
        } finally {
            setLoading(false);
        }
    };

    const consolidateIntelligence = async () => {
        setAnalyzing(true);
        try {
            const dataContext = {
                totalInteractions: interactions.length,
                totalQuotes: quotes.length,
                popularPackages: getTopPackages(),
                academyActivity: getAcademyStats(),
                recentQuotes: quotes.slice(0, 10).map(q => ({ pkg: q.package, total: q.total }))
            };

            const prompt = `Analiza estos datos de interacción de los últimos 30 días para Curiol Studio:
            Interacciones totales: ${dataContext.totalInteractions}
            Presupuestos generados: ${dataContext.totalQuotes}
            Paquetes populares: ${JSON.stringify(dataContext.popularPackages)}
            Actividad Academia: ${JSON.stringify(dataContext.academyActivity)}
            Últimos presupuestos: ${JSON.stringify(dataContext.recentQuotes)}

            Genera un informe estratégico CORTO (3 puntos clave) con recomendaciones para Alberto sobre qué contenido crear o qué paquetes promocionar. 
            Usa un tono profesional pero inspirador. Formato Markdown.`;

            const insight = await generateAiChatResponse(prompt, "Curiol Studio Strategy Assistant");
            setAiInsights(insight);
        } catch (error) {
            console.error("AI Insight Error:", error);
            setAiInsights("Error al generar inteligencia. Por favor intenta de nuevo.");
        } finally {
            setAnalyzing(false);
        }
    };

    const getTopPackages = () => {
        const counts: any = {};
        interactions.filter(i => i.type === "package_view").forEach(i => {
            const name = i.metadata?.packageName || i.metadata?.category || "Unknown";
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 5);
    };

    const getAcademyStats = () => {
        const reads = interactions.filter(i => i.type === "academy_read").length;
        const shares = interactions.filter(i => i.type === "link_click" && i.metadata?.articleId).length;
        return { reads, shares };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-tech-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
            </div>
        );
    }

    const topPackages = getTopPackages();
    const academyStats = getAcademyStats();

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="text-curiol-500 w-6 h-6" />
                        <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Intelligence Hub</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-serif text-white italic mb-6">Analítica <span className="text-curiol-gradient">Estratégica.</span></h1>
                            <p className="text-tech-400 max-w-2xl font-light">Visualiza el pulso de tu audiencia y toma decisiones basadas en datos reales e inteligencia artificial.</p>
                        </div>
                        <button
                            onClick={consolidateIntelligence}
                            disabled={analyzing}
                            className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-curiol-500/20 hover:brightness-110 transition-all flex items-center gap-3"
                        >
                            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                            Consolidar Inteligencia
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Stats Summary */}
                    <GlassCard className="p-8 border-white/5">
                        <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-6">Tráfico (30 días)</p>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-curiol-500/10 rounded-xl text-curiol-500">
                                        <MousePointer2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white font-serif text-xl italic">{interactions.length}</p>
                                        <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest">Interacciones</p>
                                    </div>
                                </div>
                                <TrendingUp className="text-green-500 w-4 h-4" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-tech-500/10 rounded-xl text-tech-500">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white font-serif text-xl italic">{quotes.length}</p>
                                        <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest">Presupuestos</p>
                                    </div>
                                </div>
                                <ArrowRight className="text-tech-700 w-4 h-4" />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Academy Stats */}
                    <GlassCard className="p-8 border-white/5">
                        <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-6">Academia & Comunidad</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-tech-900 rounded-2xl border border-white/5">
                                <p className="text-white text-3xl font-serif italic mb-1">{academyStats.reads}</p>
                                <p className="text-tech-600 text-[8px] uppercase font-bold tracking-widest">Lecturas</p>
                            </div>
                            <div className="p-6 bg-tech-900 rounded-2xl border border-white/5">
                                <p className="text-white text-3xl font-serif italic mb-1">{academyStats.shares}</p>
                                <p className="text-tech-600 text-[8px] uppercase font-bold tracking-widest">Shares</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Timeline Peek */}
                    <GlassCard className="p-8 border-white/5">
                        <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-6">Pico de Actividad</p>
                        <div className="h-32 flex items-end gap-1 px-2">
                            {[40, 70, 45, 90, 65, 30, 85, 50, 60, 40, 75, 95].map((h, i) => (
                                <div key={i} className="flex-grow bg-curiol-500/20 rounded-t hover:bg-curiol-500 transition-all cursor-help relative group/bar" style={{ height: `${h}%` }}>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-tech-800 text-[8px] text-white rounded opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none">
                                        {Math.floor(h / 1.5)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[8px] text-tech-700 font-bold uppercase tracking-widest">
                            <span>00:00</span>
                            <span>12:00</span>
                            <span>23:59</span>
                        </div>
                    </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Packages Char */}
                    <GlassCard className="p-10 border-white/5">
                        <h3 className="text-2xl font-serif text-white italic mb-10 flex items-center gap-3">
                            <Sparkles className="text-curiol-500 w-6 h-6" /> Interés por Servicios
                        </h3>
                        <div className="space-y-8">
                            {topPackages.map(([name, count]: any, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-white">{name}</span>
                                        <span className="text-tech-500">{count} vistas</span>
                                    </div>
                                    <div className="h-2 bg-tech-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-curiol-gradient transition-all duration-1000 delay-100"
                                            style={{ width: `${(count / (topPackages[0][1] as number)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {topPackages.length === 0 && <p className="text-tech-500 italic text-center text-sm py-10">Sin datos de paquetes aún.</p>}
                        </div>
                    </GlassCard>

                    {/* AI Insights Display */}
                    <GlassCard className="p-10 border-curiol-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                            <BrainCircuit className="w-32 h-32 text-curiol-500" />
                        </div>
                        <h3 className="text-2xl font-serif text-white italic mb-8 flex items-center gap-3">
                            Brújula Estratégica AI
                        </h3>
                        <div className="min-h-[300px] prose prose-invert prose-sm max-w-none">
                            {analyzing ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-6">
                                    <BrainCircuit className="w-12 h-12 text-curiol-500 animate-pulse" />
                                    <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest animate-pulse">Analizando comportamientos...</p>
                                </div>
                            ) : aiInsights ? (
                                <div className="text-tech-300 font-light leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                    {aiInsights}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 gap-8 text-center">
                                    <div className="p-6 bg-tech-900 rounded-full border border-white/5">
                                        <Sparkles className="w-8 h-8 text-curiol-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-serif text-lg italic mb-2">Prepara tu siguiente movimiento.</p>
                                        <p className="text-tech-500 text-xs">Haz clic en "Consolidar Inteligencia" para procesar los datos de este mes.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
