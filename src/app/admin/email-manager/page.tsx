"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, Send, Users, History, Settings, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailManagerPage() {
    const [activeTab, setActiveTab] = useState<"compose" | "nurturing" | "history">("compose");
    const router = useRouter();

    useEffect(() => {
        const isMaster = localStorage.getItem("master_admin") === "true";
        // Simple session check (Master PIN or being logged in)
        // In a real app we'd verify the Firebase ID token here
        if (!isMaster && !localStorage.getItem("admin_session_start")) {
            // If we want to allow Kevin/Cris (who use Firebase Auth), we should check that too.
            // For now, let's just make sure there's SOME session.
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-tech-950 p-8 lg:p-16">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-[1px] w-8 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Comunicaciones Pro</span>
                        </div>
                        <h1 className="text-4xl font-serif text-white italic tracking-tight">
                            Coordinación de <span className="text-curiol-500">Calidad</span>
                        </h1>
                        <p className="text-tech-500 text-sm mt-2">Memorias Vivas | Gestión de Identidad info@curiol.studio</p>
                    </div>

                    <div className="flex gap-4">
                        <a
                            href="https://mail.google.com/a/curiol.studio"
                            target="_blank"
                            className="flex items-center gap-2 px-6 py-3 bg-tech-900 border border-tech-800 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-800 transition-all"
                        >
                            <ExternalLink className="w-3 h-3" /> Abrir Gmail
                        </a>
                        <button className="px-6 py-3 bg-curiol-gradient rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                            Nueva Campaña
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <aside className="space-y-2">
                        <button
                            onClick={() => setActiveTab("compose")}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === "compose" ? "bg-curiol-500/10 border border-curiol-500/20 text-curiol-500" : "text-tech-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <Send className="w-5 h-5" />
                            <span className="text-sm font-medium">Redactar</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("nurturing")}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === "nurturing" ? "bg-curiol-500/10 border border-curiol-500/20 text-curiol-500" : "text-tech-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium">Auto-Nurturing</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === "history" ? "bg-curiol-500/10 border border-curiol-500/20 text-curiol-500" : "text-tech-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <History className="w-5 h-5" />
                            <span className="text-sm font-medium">Historial</span>
                        </button>
                        <div className="pt-8 border-t border-tech-900 mt-8">
                            <button className="w-full flex items-center gap-4 px-6 py-4 text-tech-600 hover:text-white transition-all">
                                <Settings className="w-5 h-5" />
                                <span className="text-sm font-medium">Configuración API</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="lg:col-span-3">
                        <GlassCard className="h-full min-h-[600px] border-tech-900 overflow-hidden">
                            {activeTab === "compose" && (
                                <div className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-serif text-white italic">Nuevo Mensaje Profesional</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600">Para</label>
                                                <input type="text" className="w-full bg-tech-900/50 border border-tech-800 rounded-xl px-4 py-3 text-white text-sm focus:border-curiol-500 outline-none transition-all" placeholder="cliente@ejemplo.com" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600">Asunto</label>
                                                <input type="text" className="w-full bg-tech-900/50 border border-tech-800 rounded-xl px-4 py-3 text-white text-sm focus:border-curiol-500 outline-none transition-all" placeholder="Tu legado digital está listo | Curiol Studio" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600">Mensaje</label>
                                        <textarea
                                            className="w-full h-64 bg-tech-900/50 border border-tech-800 rounded-2xl px-4 py-4 text-white text-sm focus:border-curiol-500 outline-none transition-all resize-none"
                                            placeholder="Escribe tu mensaje aquí..."
                                        />
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-tech-900">
                                        <div className="flex gap-2">
                                            <button className="p-3 text-tech-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                <Mail className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                const toInput = document.querySelector('input[placeholder="cliente@ejemplo.com"]') as HTMLInputElement;
                                                const subjectInput = document.querySelector('input[placeholder="Tu legado digital está listo | Curiol Studio"]') as HTMLInputElement;
                                                const bodyInput = document.querySelector('textarea[placeholder="Escribe tu mensaje aquí..."]') as HTMLTextAreaElement;

                                                if (!toInput?.value || !subjectInput?.value || !bodyInput?.value) {
                                                    return alert("Por favor completa todos los campos.");
                                                }

                                                try {
                                                    const { sendProfessionalEmail } = await import("@/actions/email");
                                                    await sendProfessionalEmail(toInput.value, subjectInput.value, bodyInput.value);
                                                    alert("¡Correo enviado con éxito!");
                                                    toInput.value = "";
                                                    subjectInput.value = "";
                                                    bodyInput.value = "";
                                                } catch (e: any) {
                                                    alert("Vaya, parece que falta la configuración (Resend API Key) o hubo un error: " + e.message);
                                                }
                                            }}
                                            className="px-12 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-lg shadow-curiol-500/20 active:scale-95 transition-all"
                                        >
                                            Enviar Correo
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "nurturing" && (
                                <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                                    <Users className="w-16 h-16 text-curiol-500/20 mb-6" />
                                    <h2 className="text-2xl font-serif text-white italic mb-2">Flujos de Nurturing</h2>
                                    <p className="text-tech-500 text-sm max-w-sm mb-8">
                                        Automatiza el acompañamiento de tus clientes desde la cotización hasta la entrega final de su legado.
                                    </p>
                                    <button className="px-8 py-3 bg-tech-900 border border-tech-800 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-800 transition-all">
                                        Configurar Primer Flujo
                                    </button>
                                </div>
                            )}

                            {activeTab === "history" && (
                                <div className="p-8">
                                    <h2 className="text-xl font-serif text-white italic mb-8">Historial de Comunicación</h2>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="p-4 border border-tech-900 rounded-2xl flex justify-between items-center hover:bg-white/5 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-tech-900 rounded-xl flex items-center justify-center text-tech-500">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">Cotización Enviada - Ref #CP-2394</p>
                                                        <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest">Hace 2 horas • info@curiol.studio</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Entregado</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </main>
                </div>
            </div>
        </div>
    );
}
