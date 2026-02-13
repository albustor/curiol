"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Plus, Sparkles, Calendar, User, Settings,
    ArrowRight, Loader2, Search, Filter,
    Eye, MoreVertical, LayoutGrid, List
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getTimelines, createTimeline } from "@/actions/timeline";
import { EvolutiveTimeline } from "@/types/timeline";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TimelineManagement() {
    const { role, user } = useRole();
    const router = useRouter();
    const [timelines, setTimelines] = useState<EvolutiveTimeline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    useEffect(() => {
        async function loadTimelines() {
            const data = await getTimelines();
            setTimelines(data);
            setIsLoading(false);
        }
        loadTimelines();
    }, []);

    const handleCreateTimeline = async () => {
        const clientName = prompt("Nombre del Cliente:");
        const clientId = prompt("ID del Cliente (Email o Identificador):");

        if (clientName && clientId) {
            setIsCreating(true);
            const id = await createTimeline(clientId, clientName);
            if (id) {
                router.push(`/admin/timeline/${id}`);
            }
            setIsCreating(false);
        }
    };

    const filteredTimelines = timelines.filter(t =>
        t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.clientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading || role === "LOADING") {
        return (
            <div className="min-h-screen bg-tech-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-[1px] w-8 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase font-mono">Legacy Phygital Engine</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-white italic">
                            Gestión de <span className="text-curiol-gradient">Líneas de Tiempo</span>
                        </h1>
                    </div>

                    <button
                        onClick={handleCreateTimeline}
                        disabled={isCreating}
                        className="flex items-center gap-3 px-8 py-4 bg-curiol-gradient text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded-xl shadow-2xl shadow-curiol-500/20 disabled:opacity-50"
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Nueva Línea de Tiempo
                    </button>
                </header>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-500" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-tech-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-curiol-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-4 bg-tech-900/50 border border-white/5 rounded-xl text-tech-500 hover:text-white transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-4 bg-tech-900 border border-curiol-500/20 rounded-xl text-curiol-500">
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Timelines Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTimelines.map((timeline, idx) => (
                            <motion.div
                                key={timeline.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <GlassCard className="p-6 group hover:border-curiol-500/30 transition-all cursor-pointer overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-tech-500 hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-curiol-500/10 flex items-center justify-center text-curiol-500 group-hover:bg-curiol-500 group-hover:text-white transition-all">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif text-white italic mb-1 group-hover:text-curiol-200">{timeline.clientName}</h3>
                                            <p className="text-[10px] text-tech-600 font-bold uppercase tracking-widest">{timeline.clientId}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-tech-950/50 p-3 rounded-lg border border-white/5 text-center">
                                            <p className="text-[8px] text-tech-600 uppercase font-bold tracking-widest mb-1">Eventos</p>
                                            <p className="text-xl font-serif text-white italic">{timeline.events?.length || 0}</p>
                                        </div>
                                        <div className="bg-tech-950/50 p-3 rounded-lg border border-white/5 text-center">
                                            <p className="text-[8px] text-tech-600 uppercase font-bold tracking-widest mb-1">Activo</p>
                                            <div className="flex justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-[10px] text-tech-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>Actualizado: {new Date(timeline.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <Link
                                            href={`/admin/timeline/${timeline.id}`}
                                            className="p-2 bg-tech-900 group-hover:bg-curiol-500 rounded-lg text-tech-500 group-hover:text-white transition-all"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredTimelines.length === 0 && !isLoading && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-tech-900 rounded-[2rem]">
                            <Sparkles className="w-12 h-12 text-tech-800 mx-auto mb-6" />
                            <h3 className="text-white font-serif italic text-lg mb-2">No se encontraron legados</h3>
                            <p className="text-tech-600 text-sm">Comienza creando la primera línea de tiempo evolutiva.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
