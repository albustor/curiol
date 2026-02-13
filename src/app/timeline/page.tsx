"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTimelines, createTimeline } from "@/actions/timeline";
import { EvolutiveTimeline } from "@/types/timeline";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, ArrowRight, Plus, Loader2, Lock, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole"; // Assuming this handles user/client auth
import { cn } from "@/lib/utils";

export default function TimelineDashboard() {
    const { role, user } = useRole();
    const router = useRouter();
    const [timelines, setTimelines] = useState<EvolutiveTimeline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        async function load() {
            // In a real scenario, we'd filter by the current logged-in client's ID
            // For now, we'll fetch all timelines and filter client-side if needed, 
            // or assume getTimelines is scoped to the user in the future.
            const data = await getTimelines();
            setTimelines(data);
            setIsLoading(false);
        }
        load();
    }, []);

    const handleCreateNew = async () => {
        if (!user) return alert("Debes iniciar sesión para expandir tu legado.");

        const confirm = window.confirm("Crear una nueva Línea de Tiempo tiene un costo de ₡50,000. ¿Deseas proceder?");
        if (!confirm) return;

        setIsCreating(true);
        const newId = await createTimeline((user as any).uid, (user as any).displayName || "Cliente Premium");
        if (newId) {
            router.push(`/timeline/${newId}`);
        }
        setIsCreating(false);
    };

    if (isLoading) return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <History className="w-5 h-5 text-curiol-500" />
                        <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Gestión de Legado</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-serif text-white italic mb-4">Mis Líneas de Tiempo.</h1>
                            <p className="text-tech-500 text-lg font-light max-w-xl">Administra tus hitos de vida y expande tu archivo vivo con nuevas ramificaciones de tu historia personal.</p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            disabled={isCreating}
                            className="group flex items-center gap-4 bg-curiol-gradient px-8 py-5 rounded-2xl text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl shadow-curiol-500/20"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Expandir Archivo (₡50,000)
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {timelines.map((t, idx) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => router.push(`/timeline/${t.id}`)}
                            className="bg-tech-900/40 border border-white/5 p-8 rounded-[3rem] group hover:border-curiol-500/30 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-curiol-500/5 blur-3xl rounded-full" />

                            <div className="flex justify-between items-start mb-12">
                                <div className="p-4 bg-tech-950 rounded-2xl border border-white/5">
                                    <Sparkles className="w-6 h-6 text-curiol-500" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-tech-600 bg-tech-800 px-3 py-1 rounded-full">
                                    {t.events?.length || 0} Hitos
                                </span>
                            </div>

                            <h3 className="text-2xl font-serif text-white italic mb-2 group-hover:text-curiol-400 transition-colors">
                                {t.clientName}
                            </h3>
                            <p className="text-[10px] text-tech-500 uppercase tracking-[0.2em] font-bold mb-8">Archivo ID: {t.id.slice(0, 8)}</p>

                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-tech-700 uppercase font-bold tracking-widest mb-1">Último Hito</span>
                                    <span className="text-[10px] text-tech-400 font-medium">
                                        {t.events && t.events.length > 0
                                            ? new Date(t.events[t.events.length - 1].date).toLocaleDateString()
                                            : "Sin eventos"}
                                    </span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-curiol-500 group-hover:text-white transition-all text-tech-600">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {timelines.length === 0 && (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-tech-900 rounded-[3rem]">
                            <History className="w-12 h-12 text-tech-800 mx-auto mb-6" />
                            <p className="text-tech-600 text-sm italic mb-8">No hemos encontrado arboles de legado activos.</p>
                            <button
                                onClick={handleCreateNew}
                                className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
                            >
                                Crear mi primera Línea de Tiempo
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
