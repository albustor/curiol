"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    MessageSquare, Users, Zap,
    BarChart3, Settings, ArrowRight,
    Search, Filter, Plus, MessageCircle,
    Instagram, Facebook, Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function OmnitechDashboard() {
    const [stats, setStats] = useState({
        totalChats: 248,
        activeFlows: 12,
        capturedLeads: 85,
        avgResponseTime: "1.2s"
    });

    const channels = [
        { name: "WhatsApp", icon: MessageCircle, status: "connected", color: "text-green-500", bg: "bg-green-500/10" },
        { name: "Instagram", icon: Instagram, status: "pending", color: "text-pink-500", bg: "bg-pink-500/10" },
        { name: "Facebook", icon: Facebook, status: "disconnected", color: "text-blue-500", bg: "bg-blue-500/10" }
    ];

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 pb-24 bg-grain">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest border border-curiol-500/30 px-3 py-1 rounded-full">Inteligencia Omnicanal</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Omnitech Dashboard</h1>
                        <p className="text-tech-500 max-w-xl mt-4">Gestión unificada de automatizaciones, captura de datos y flujos conversacionales inteligentes.</p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/admin/omnitech/flows" className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-3">
                            <Plus className="w-4 h-4" /> Crear Nuevo Flujo
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Conversaciones Totales", value: stats.totalChats, icon: MessageSquare, color: "text-blue-500" },
                        { label: "Flujos Activos", value: stats.activeFlows, icon: Zap, color: "text-yellow-500" },
                        { label: "Leads Capturados", value: stats.capturedLeads, icon: Users, color: "text-curiol-500" },
                        { label: "Velocidad IA", value: stats.avgResponseTime, icon: BarChart3, color: "text-green-500" }
                    ].map((stat, i) => (
                        <GlassCard key={i} className="p-8">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-tech-900 border border-white/5", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-serif text-white italic">{stat.value}</h3>
                            <p className="text-[10px] text-tech-500 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Canal Connections */}
                    <div className="lg:col-span-4 space-y-6">
                        <h2 className="text-xl font-serif text-white italic px-2">Canales Conectados</h2>
                        {channels.map((ch, i) => (
                            <GlassCard key={i} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-xl", ch.bg, ch.color)}>
                                            <ch.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white font-serif italic">{ch.name}</p>
                                            <p className={cn("text-[9px] font-bold uppercase tracking-widest",
                                                ch.status === "connected" ? "text-green-500" :
                                                    ch.status === "pending" ? "text-yellow-500" : "text-tech-700"
                                            )}>{ch.status === "connected" ? "En Línea" : ch.status === "pending" ? "Configurar" : "Desconectado"}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-tech-500 hover:text-white transition-all">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Recent Activities */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-serif text-white italic">Actividad Reciente</h2>
                            <button className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest hover:underline">Ver Todo</button>
                        </div>
                        <GlassCard className="p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-tech-900/50 border-b border-white/5">
                                        <tr>
                                            <th className="px-8 py-4 text-[9px] font-bold text-tech-500 uppercase tracking-widest">Cliente</th>
                                            <th className="px-8 py-4 text-[9px] font-bold text-tech-500 uppercase tracking-widest">Canal</th>
                                            <th className="px-8 py-4 text-[9px] font-bold text-tech-500 uppercase tracking-widest">Estado</th>
                                            <th className="px-8 py-4 text-[9px] font-bold text-tech-500 uppercase tracking-widest text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[
                                            { name: "Juan Pérez", channel: "WhatsApp", status: "Datos Capturados", date: "Hace 2m" },
                                            { name: "María García", channel: "Instagram", status: "IA Respondiendo", date: "Hace 15m" },
                                            { name: "Carlos Ruiz", channel: "Facebook", status: "Finalizado", date: "Hace 1h" }
                                        ].map((act, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-4">
                                                    <p className="text-white text-sm font-serif italic">{act.name}</p>
                                                    <p className="text-[10px] text-tech-700 font-mono">{act.date}</p>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-[10px] text-tech-500 font-bold uppercase tracking-widest">{act.channel}</span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="px-3 py-1 bg-curiol-500/10 text-curiol-500 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                                        {act.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button className="p-2 text-tech-800 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                        <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
