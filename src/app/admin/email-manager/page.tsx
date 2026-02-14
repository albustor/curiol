"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
    Mail, Send, Users, History, Settings,
    ExternalLink, Inbox, BadgeCheck, Clock,
    Tag, Filter, AlertCircle, Loader2, User,
    CheckCircle2, ChevronRight, Search
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, limit, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { sendProfessionalEmail, EmailTask } from "@/actions/email";
import { useRole } from "@/hooks/useRole";

export default function EmailManagerPage() {
    const { role, user, isMaster, isTeam } = useRole();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"inbox" | "compose" | "history">("inbox");
    const [emails, setEmails] = useState<any[]>([]);
    const [isSending, setIsSending] = useState(false);

    // Form State
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [task, setTask] = useState<EmailTask>("produccion");

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    useEffect(() => {
        if (!user || role === "LOADING") return;

        const q = query(
            collection(db, "corporate_emails"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate() || new Date(),
                email: doc.data().email ?? undefined
            }));
            setEmails(data);
        });

        return () => unsub();
    }, [user, role]);

    const handleSend = async () => {
        if (!to || !subject || !body) return alert("Por favor completa los campos obligatorios.");

        setIsSending(true);
        try {
            await sendProfessionalEmail(to, subject, body, task, user?.email);
            alert("¡Correo enviado y registrado en el sistema de calidad!");
            setTo("");
            setSubject("");
            setBody("");
            setActiveTab("inbox");
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setIsSending(false);
        }
    };

    if (role === "LOADING") {
        return (
            <div className="min-h-screen bg-tech-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
            </div>
        );
    }

    if (role === "UNAUTHORIZED") return null;

    const taskColors = {
        produccion: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        comercial: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        calidad: "text-curiol-500 bg-curiol-500/10 border-curiol-500/20",
        otros: "text-tech-500 bg-tech-500/10 border-tech-500/20"
    };

    return (
        <div className="min-h-screen bg-tech-950 text-white selection:bg-curiol-500/30">
            <div className="max-w-[1600px] mx-auto p-6 lg:p-12">
                {/* Header V2 */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-curiol-500"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-curiol-500">Coordinación V2</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif italic">
                            Email <span className="text-curiol-gradient">Corporate Studio</span>
                        </h1>
                        <div className="flex items-center gap-4 text-tech-500 text-[10px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><User className="w-3 h-3" /> {user?.displayName || user?.email}</span>
                            <span className="w-1 h-1 bg-tech-800 rounded-full"></span>
                            <span className="text-white">Legado Vivo</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://mail.google.com/a/curiol.studio"
                            target="_blank"
                            className="p-4 bg-tech-900 border border-white/5 rounded-2xl hover:bg-tech-800 transition-all text-tech-400 hover:text-white"
                            title="Abrir Gmail Externo"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                        <button
                            onClick={() => setActiveTab("compose")}
                            className="px-8 py-4 bg-curiol-gradient rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-curiol-500/20 hover:scale-[1.02] transition-all"
                        >
                            Redactar Nuevo
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <GlassCard className="p-4 space-y-2 border-white/5">
                            {[
                                { id: "inbox", icon: Inbox, label: "Bandeja de Entrada", count: emails.length },
                                { id: "compose", icon: Send, label: "Redactar" },
                                { id: "history", icon: History, label: "Historial Global" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all group",
                                        activeTab === tab.id ? "bg-curiol-500/10 text-curiol-500 border border-curiol-500/20" : "text-tech-500 hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <tab.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{tab.label}</span>
                                    </div>
                                    {tab.count !== undefined && (
                                        <span className="text-[10px] font-bold bg-tech-900 px-2 py-1 rounded-md">{tab.count}</span>
                                    )}
                                </button>
                            ))}
                        </GlassCard>

                        <GlassCard className="p-6 border-white/5">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-tech-600 mb-6 flex items-center gap-2">
                                <Filter className="w-3 h-3" /> Clasificación por Tarea
                            </h4>
                            <div className="space-y-4">
                                {Object.keys(taskColors).map((t) => (
                                    <div key={t} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-tech-500">
                                        <span className="capitalize">{t}</span>
                                        <span className="w-2 h-2 rounded-full bg-tech-800"></span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Main Workspace */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === "inbox" && (
                                <motion.div
                                    key="inbox"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-serif italic text-white/90">Comunicaciones Recientes</h3>
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-tech-600 absolute left-4 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Buscar por cliente o asunto..."
                                                className="bg-tech-900/50 border border-white/5 rounded-full pl-12 pr-6 py-2 text-xs outline-none focus:border-curiol-500 w-64"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {emails.length === 0 ? (
                                            <div className="py-32 text-center text-tech-600 space-y-4">
                                                <Mail className="w-12 h-12 mx-auto opacity-20" />
                                                <p className="text-sm italic">No hay correos registrados por el momento.</p>
                                            </div>
                                        ) : (
                                            emails.map((email) => (
                                                <GlassCard
                                                    key={email.id}
                                                    className="p-0 overflow-hidden hover:border-white/10 transition-all cursor-pointer group"
                                                >
                                                    <div className="p-6 flex items-center gap-6">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                                                            email.direction === "outgoing" ? "bg-tech-900 border-white/5" : "bg-curiol-500/10 border-curiol-500/20"
                                                        )}>
                                                            {email.direction === "outgoing" ? <Send className="w-5 h-5 text-tech-500" /> : <Inbox className="w-5 h-5 text-curiol-500" />}
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h4 className="text-sm font-bold text-white/90 truncate">{email.subject}</h4>
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border",
                                                                    taskColors[email.task as keyof typeof taskColors] || taskColors.otros
                                                                )}>
                                                                    {email.task}
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] text-tech-500 truncate">
                                                                {email.direction === "outgoing" ? `Para: ${email.to}` : `De: ${email.from}`}
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-[10px] font-bold text-tech-600 mb-1">
                                                                {email.date.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                                                            </p>
                                                            <div className="flex items-center gap-1 text-green-500 text-[8px] font-bold uppercase tracking-widest">
                                                                <CheckCircle2 className="w-3 h-3" /> Registrado
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-tech-800 group-hover:text-curiol-500 transition-colors" />
                                                    </div>
                                                </GlassCard>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "compose" && (
                                <motion.div
                                    key="compose"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GlassCard className="p-10 border-white/5 bg-tech-900/40">
                                        <div className="flex items-center justify-between mb-10">
                                            <h3 className="text-2xl font-serif italic">Redactar Memoria Digital</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-tech-500">Enviando como</span>
                                                <span className="px-3 py-1 bg-tech-900 rounded-lg text-white text-[10px] font-mono border border-white/5">{user?.email}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600 ml-2 flex items-center gap-2">
                                                    <User className="w-3 h-3" /> Destinatario (Cliente)
                                                </label>
                                                <input
                                                    value={to}
                                                    onChange={(e) => setTo(e.target.value)}
                                                    type="email"
                                                    className="w-full bg-tech-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:border-curiol-500 transition-all font-light"
                                                    placeholder="cliente@legacy.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600 ml-2 flex items-center gap-2">
                                                    <Tag className="w-3 h-3" /> Clasificación de Tarea
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.keys(taskColors).map((t) => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setTask(t as EmailTask)}
                                                            className={cn(
                                                                "py-3 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all",
                                                                task === t
                                                                    ? "bg-curiol-500 border-curiol-500 text-white shadow-lg shadow-curiol-500/20"
                                                                    : "bg-tech-950/50 border-white/5 text-tech-500 hover:border-white/10"
                                                            )}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-8">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600 ml-2 flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> Asunto de la Comunicación
                                            </label>
                                            <input
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                type="text"
                                                className="w-full bg-tech-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:border-curiol-500 transition-all font-light"
                                                placeholder="Tu Legado Fotográfico está listo para despegue..."
                                            />
                                        </div>

                                        <div className="space-y-2 mb-10">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-tech-600 ml-2 flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> Cuerpo del Mensaje
                                            </label>
                                            <textarea
                                                value={body}
                                                onChange={(e) => setBody(e.target.value)}
                                                className="w-full h-80 bg-tech-950/50 border border-white/5 rounded-[2rem] px-8 py-8 text-sm outline-none focus:border-curiol-500 transition-all font-light resize-none leading-relaxed"
                                                placeholder="Estimado cliente, es un honor para nosotros entregarte el resultado de nuestra curaduría..."
                                            />
                                        </div>

                                        <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-tech-900 border border-white/5 rounded-xl text-tech-600">
                                                    <BadgeCheck className="w-5 h-5" />
                                                </div>
                                                <p className="text-[9px] text-tech-500 uppercase tracking-widest leading-tight max-w-[200px]">
                                                    Esta comunicación será auditada por el sistema de calidad Legado Vivo.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleSend}
                                                disabled={isSending}
                                                className="px-16 py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-curiol-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-4"
                                            >
                                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                Transmitir Mensaje
                                            </button>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {activeTab === "history" && (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-curiol-500/5 border border-curiol-500/20 p-8 rounded-[2rem] flex items-center gap-6">
                                        <div className="w-16 h-16 bg-curiol-500/10 rounded-2xl flex items-center justify-center text-curiol-500">
                                            <Clock className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif italic text-white mb-1">Inmortalidad Logística</h3>
                                            <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                                Cada interacción queda registrada permanentemente en nuestra cadena de bloques informativa para garantizar la satisfacción total.
                                            </p>
                                        </div>
                                    </div>

                                    {/* List same as inbox but maybe with different filters in the future */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {emails.map((email) => (
                                            <div key={email.id} className="p-6 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-10 h-10 rounded-xl bg-tech-900 flex items-center justify-center text-tech-600">
                                                        <BadgeCheck className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{email.subject}</p>
                                                        <p className="text-[10px] text-tech-600 font-bold uppercase tracking-widest mt-1">
                                                            {email.from} • {email.date.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border",
                                                    taskColors[email.task as keyof typeof taskColors] || taskColors.otros
                                                )}>
                                                    {email.task}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
