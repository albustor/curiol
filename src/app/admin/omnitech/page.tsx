"use client";

import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Bot, MessageSquare, Zap, Users,
    Clock, Instagram, Facebook, ChevronRight,
    TrendingUp, Activity, BarChart3
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OmnitechDashboard() {
    const stats = [
        { label: "Conversaciones Totales", value: "1,284", icon: MessageSquare, sub: "+12% este mes", color: "text-blue-500" },
        { label: "Leads Capturados", value: "482", icon: Users, sub: "+5.2% tasa conv.", color: "text-curiol-500" },
        { label: "Flujos Activos", value: "24", icon: Zap, sub: "8 flujos IA", color: "text-purple-500" },
        { label: "Tiempo de Respuesta", value: "0.8s", icon: Clock, sub: "Promedio global", color: "text-green-500" }
    ];

    const channels = [
        { name: "WhatsApp", status: "Conectado", icon: MessageSquare, color: "text-green-500" },
        { name: "Instagram DMs", status: "Conectado", icon: Instagram, color: "text-pink-500" },
        { name: "Facebook Messenger", status: "Inactivo", icon: Facebook, color: "text-blue-500" }
    ];

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Bot className="text-curiol-500 w-4 h-4" />
                        <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Inteligencia Conversacional</span>
                    </div>
                    <h1 className="text-5xl font-serif text-white italic">Soluciones Comerciales Center</h1>
                    <p className="text-tech-500 mt-4">Gestión de automatización y métricas de interacción en tiempo real.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
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
            </main>
        </div>
    );
}
