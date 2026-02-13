"use client";

import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot, MessageSquare, Zap, Users,
    Clock, Instagram, Facebook, ChevronRight,
    TrendingUp, Activity, BarChart3, Megaphone, Send, Calendar, ListChecks,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";

export default function OmnitechDashboard() {
    const { role } = useRole();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"dashboard" | "campanas">("dashboard");

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    const channels = [
        { name: "WhatsApp", status: "Conectado", icon: MessageSquare, color: "text-green-500" },
        { name: "Instagram DMs", status: "Conectado", icon: Instagram, color: "text-pink-500" },
        { name: "Facebook Messenger", status: "Inactivo", icon: Facebook, color: "text-blue-500" }
    ];

    if (role === "LOADING") {
        return (
            <div className="min-h-screen bg-tech-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
            </div>
        );
    }

    if (role === "UNAUTHORIZED") return null;

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Bot className="text-curiol-500 w-4 h-4" />
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Inteligencia Conversacional</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Crecimiento Comercial & IA Center</h1>
                        <p className="text-tech-500 mt-4">Gestión de automatización y métricas de interacción en tiempo real.</p>
                    </div>

                    <div className="flex bg-tech-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={cn(
                                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                activeTab === "dashboard" ? "bg-curiol-500 text-white shadow-lg" : "text-tech-500 hover:text-white"
                            )}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab("campanas")}
                            className={cn(
                                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                activeTab === "campanas" ? "bg-curiol-500 text-white shadow-lg" : "text-tech-500 hover:text-white"
                            )}
                        >
                            Disfusión & Campañas
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === "dashboard" ? (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {[
                                    { label: "Conversaciones Totales", value: "1,284", icon: MessageSquare, sub: "+12% este mes", color: "text-blue-500" },
                                    { label: "Leads Capturados", value: "482", icon: Users, sub: "+5.2% tasa conv.", color: "text-curiol-500" },
                                    { label: "Flujos Activos", value: "24", icon: Zap, sub: "8 flujos IA", color: "text-purple-500" },
                                    { label: "Tiempo de Respuesta", value: "0.8s", icon: Clock, sub: "Promedio global", color: "text-green-500" }
                                ].map((stat, idx) => (
                                    <GlassCard key={idx} className="p-6 border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl bg-tech-900 ${stat.color}`}>
                                                <stat.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] text-green-500 font-bold">{stat.sub}</span>
                                        </div>
                                        <h4 className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h4>
                                        <p className="text-3xl font-serif text-white italic">{stat.value}</p>
                                    </GlassCard>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <GlassCard className="lg:col-span-2 p-8 h-[400px] flex flex-col">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-3">
                                            <Activity className="text-curiol-500 w-5 h-5" />
                                            <h3 className="text-xl font-serif text-white italic">Actividad de Conversación</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-tech-950 rounded-full text-[8px] text-tech-500 uppercase font-bold border border-white/5">Últimos 7 Días</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow flex items-end gap-2 pb-4">
                                        {[40, 60, 45, 90, 65, 80, 50, 70, 45, 100, 85, 95].map((h, i) => (
                                            <div key={i} className="flex-grow bg-curiol-gradient opacity-20 hover:opacity-100 transition-all rounded-t-sm" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </GlassCard>

                                <div className="space-y-6">
                                    <GlassCard className="p-8">
                                        <h3 className="text-xl font-serif text-white italic mb-6">Canales Conectados</h3>
                                        <div className="space-y-4">
                                            {channels.map((ch, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-tech-950/50 rounded-2xl border border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <ch.icon className={`w-5 h-5 ${ch.color}`} />
                                                        <div>
                                                            <p className="text-white text-xs font-bold">{ch.name}</p>
                                                            <p className="text-tech-600 text-[8px] uppercase">{ch.status}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-2 h-2 rounded-full ${ch.status === 'Conectado' ? 'bg-green-500 animate-pulse' : 'bg-tech-700'}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <Link href="/admin/omnitech/flows">
                                        <GlassCard className="p-8 border-curiol-500/30 bg-curiol-500/5 hover:bg-curiol-500/10 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-xl font-serif text-white italic mb-1">Flow Builder</h3>
                                                    <p className="text-tech-500 text-xs font-light">Diseña embudos de venta automatizados al estilo ManyChat.</p>
                                                </div>
                                                <ChevronRight className="text-curiol-500 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </GlassCard>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="campanas"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <GlassCard className="lg:col-span-2 p-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <Megaphone className="text-curiol-500 w-5 h-5" />
                                        <h3 className="text-2xl font-serif text-white italic">Nueva Difusión Masiva</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Nombre de la Campaña</label>
                                            <input placeholder="Ej: Oferta San Valentín 2026" className="w-full bg-tech-900 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Mensaje de Difusión</label>
                                            <textarea rows={5} placeholder="Escribe el mensaje que recibirán tus leads..." className="w-full bg-tech-900 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 resize-none font-light" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Público Objetivo</label>
                                                <select className="w-full bg-tech-900 border border-white/5 rounded-xl p-4 text-white text-sm outline-none">
                                                    <option>Todos los Leads (482)</option>
                                                    <option>Clientes Activos (124)</option>
                                                    <option>Interesados en Fotografía (210)</option>
                                                    <option>Interesados en Web (148)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Canal de Envío</label>
                                                <select className="w-full bg-tech-900 border border-white/5 rounded-xl p-4 text-white text-sm outline-none">
                                                    <option>WhatsApp API</option>
                                                    <option>Instagram DM</option>
                                                    <option>Correo Electrónico</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button className="w-full py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-curiol-500/20 flex items-center justify-center gap-3 hover:brightness-110 transition-all">
                                            <Send className="w-4 h-4" /> Programar Difusión
                                        </button>
                                    </div>
                                </GlassCard>

                                <div className="space-y-6">
                                    <GlassCard className="p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Calendar className="text-curiol-500 w-4 h-4" />
                                            <h3 className="text-xl font-serif text-white italic">Próximos Envíos</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-tech-950/50 rounded-xl border border-white/5">
                                                <p className="text-white text-xs font-bold mb-1">Campaña Educación 2026</p>
                                                <div className="flex justify-between items-center text-[8px] uppercase tracking-widest">
                                                    <span className="text-curiol-500">Programado: 14 Feb</span>
                                                    <span className="text-tech-600">210 destinatarios</span>
                                                </div>
                                            </div>
                                            <p className="text-center text-tech-700 text-[10px] font-bold uppercase tracking-widest pt-4 italic">No hay más campañas en cola.</p>
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-8 border-tech-800">
                                        <div className="flex items-center gap-3 mb-6">
                                            <ListChecks className="text-curiol-500 w-4 h-4" />
                                            <h3 className="text-xl font-serif text-white italic">Reglas de Envío</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {[
                                                "Máximo 500 mensajes por día.",
                                                "Sincronización con horario local.",
                                                "Validación de opt-in activada.",
                                                "IA de parafraseo habilitada."
                                            ].map((text, i) => (
                                                <li key={i} className="flex gap-3 text-[10px] text-tech-500 font-light">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-curiol-500 mt-1 shrink-0" />
                                                    {text}
                                                </li>
                                            ))}
                                        </ul>
                                    </GlassCard>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeTab === "dashboard" && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <GlassCard className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="text-curiol-500 w-5 h-5" />
                                <h3 className="text-xl font-serif text-white italic">Conversiones Mensuales</h3>
                            </div>
                            <p className="text-tech-500 text-sm font-light leading-relaxed">
                                Has capturado un <span className="text-white font-bold">15% más de leads</span> este mes gracias a los flujos de calificación automática.
                            </p>
                        </GlassCard>
                        <GlassCard className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="text-curiol-500 w-5 h-5" />
                                <h3 className="text-xl font-serif text-white italic">Métricas de Origen</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] uppercase font-bold">
                                    <span className="text-tech-500">Orgánico (Web)</span>
                                    <span className="text-white">65%</span>
                                </div>
                                <div className="w-full h-1 bg-tech-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-curiol-500 w-[65%]" />
                                </div>
                                <div className="flex justify-between text-[10px] uppercase font-bold pt-2">
                                    <span className="text-tech-500">Social (IG/WA)</span>
                                    <span className="text-white">35%</span>
                                </div>
                                <div className="w-full h-1 bg-tech-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[35%]" />
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </main>
        </div>
    );
}
