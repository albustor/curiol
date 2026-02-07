"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Calendar as CalendarIcon, Clock, User,
    CheckCircle2, AlertCircle, XCircle,
    Search, Filter, ExternalLink,
    ShieldCheck, Smartphone, Mail,
    MessageCircle, Trash2, Settings, Plus, Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";

interface Booking {
    id: string;
    name: string;
    email: string;
    whatsapp: string;
    service: string;
    date: any; // Firestore Timestamp
    time: string;
    status: "pending_approval" | "approved" | "rejected";
    paymentVerified: boolean;
    aiConfidence?: number;
    transactionId?: string;
    createdAt: any;
}

export default function AdminAgendaPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [scheduleSettings, setScheduleSettings] = useState<{ [key: string]: string[] }>({
        "6": ["14:00", "17:00"], // Saturday
        "0": ["17:00"]          // Sunday
    });

    useEffect(() => {
        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
            setBookings(data);
            setIsLoading(false);
        });

        const fetchSettings = async () => {
            const docRef = doc(db, "settings", "schedule");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setScheduleSettings(docSnap.data().slots);
            }
        };
        fetchSettings();

        return () => unsubscribe();
    }, []);

    const saveSchedule = async () => {
        setIsSaving(true);
        try {
            await setDoc(doc(db, "settings", "schedule"), { slots: scheduleSettings });
            alert("Configuración Guardada");
        } catch (error) {
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    };

    const addSlot = (day: string) => {
        const time = prompt("Ingrese la hora (ej: 09:00, 14:00, 17:00):");
        if (time && /^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
            setScheduleSettings(prev => ({
                ...prev,
                [day]: [...(prev[day] || []), time].sort()
            }));
        } else if (time) {
            alert("Formato de hora inválido");
        }
    };

    const removeSlot = (day: string, index: number) => {
        setScheduleSettings(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await updateDoc(doc(db, "bookings", id), { status });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteBooking = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta reserva?")) return;
        try {
            await deleteDoc(doc(db, "bookings", id));
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (filter === "all") return true;
        return b.status === filter;
    });

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 pb-24 bg-grain">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest border border-curiol-500/30 px-3 py-1 rounded-full">Gestión de Tiempo</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Panel de Agenda</h1>
                        <p className="text-tech-500 max-w-xl mt-4">Controla las reservaciones, valida comprobantes asistidos por IA y coordina el flujo de trabajo.</p>
                    </div>

                    <div className="flex bg-tech-900/50 p-1 rounded-xl border border-tech-800 backdrop-blur-md">
                        {["all", "pending_approval", "approved", "rejected"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                                    filter === f ? "bg-curiol-700 text-white shadow-lg" : "text-tech-500 hover:text-white"
                                )}
                            >
                                {f === "all" ? "Todos" : f === "pending_approval" ? "Pendientes" : f === "approved" ? "Aprobados" : "Rechazados"}
                            </button>
                        ))}
                    </div>
                </header>

                <section className="mb-16">
                    <GlassCard className="p-10 border-curiol-500/10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-curiol-500/10 rounded-2xl flex items-center justify-center text-curiol-500 border border-curiol-500/20">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif text-white italic">Configuración de Horarios</h2>
                                    <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest mt-1">Define los bloques disponibles por día</p>
                                </div>
                            </div>
                            <button
                                onClick={saveSchedule}
                                disabled={isSaving}
                                className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Save className="w-4 h-4" /> {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { id: "6", label: "Sábados" },
                                { id: "0", label: "Domingos" }
                            ].map((day) => (
                                <div key={day.id} className="bg-tech-900/30 p-8 rounded-3xl border border-white/5">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-serif text-white italic">{day.label}</h3>
                                        <button
                                            onClick={() => addSlot(day.id)}
                                            className="w-8 h-8 rounded-full bg-tech-800 text-tech-400 flex items-center justify-center hover:bg-curiol-500 hover:text-white transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {scheduleSettings[day.id]?.length > 0 ? scheduleSettings[day.id].map((slot, i) => (
                                            <div key={i} className="group relative">
                                                <div className="px-6 py-3 bg-tech-950 border border-tech-800 rounded-xl text-white text-xs font-mono">
                                                    {slot}
                                                </div>
                                                <button
                                                    onClick={() => removeSlot(day.id, i)}
                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                                                >
                                                    <XCircle className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )) : (
                                            <p className="text-tech-700 text-[10px] uppercase font-bold tracking-widest py-4 italic">No hay bloques definidos</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </section>

                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <div className="py-20 text-center text-tech-700">Cargando reservaciones...</div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="py-20 text-center text-tech-700 border-2 border-dashed border-tech-900 rounded-[2rem]">No hay reservaciones en esta categoría.</div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <motion.div
                                    key={booking.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <GlassCard className={cn(
                                        "p-8 border-l-8 transition-all",
                                        booking.status === "approved" ? "border-l-green-500" :
                                            booking.status === "rejected" ? "border-l-red-500" : "border-l-curiol-500"
                                    )}>
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                            <div className="lg:col-span-2 flex flex-col items-center justify-center p-4 bg-tech-950/50 rounded-2xl border border-white/5">
                                                <CalendarIcon className="w-5 h-5 text-curiol-500 mb-2" />
                                                <p className="text-xl font-serif text-white italic">{booking.date?.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
                                                <p className="text-[10px] font-bold text-tech-500 uppercase tracking-widest mt-1">{booking.time}</p>
                                            </div>

                                            <div className="lg:col-span-3">
                                                <h3 className="text-xl font-serif text-white italic mb-2">{booking.name}</h3>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-[10px] text-tech-500 font-bold uppercase tracking-widest">
                                                        <Mail className="w-3 h-3" /> {booking.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-tech-500 font-bold uppercase tracking-widest">
                                                        <Smartphone className="w-3 h-3" /> {booking.whatsapp}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={cn("px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest", booking.service === "legado" ? "bg-curiol-500/10 text-curiol-500" : "bg-tech-500/10 text-tech-500")}>
                                                        {booking.service === "legado" ? "Arquitectura Memorias" : "Aceleradora Digital"}
                                                    </div>
                                                </div>
                                                <div className="bg-tech-900/50 p-3 rounded-xl border border-white/5">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] text-tech-600 font-bold uppercase tracking-widest">Pago IA Validado</span>
                                                        <span className={cn("text-[9px] font-bold", (booking.aiConfidence || 0) > 0.8 ? "text-green-500" : "text-yellow-500")}>
                                                            {Math.round((booking.aiConfidence || 0) * 100)}% Confianza
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-tech-400 font-mono">ID: {booking.transactionId}</p>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-4 flex justify-end gap-3">
                                                {booking.status === "pending_approval" && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, "approved")}
                                                            className="px-6 py-3 bg-green-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-green-500 transition-all flex items-center gap-2"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" /> Aprobar
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, "rejected")}
                                                            className="px-6 py-3 bg-red-950 text-red-500 text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-900 transition-all flex items-center gap-2 border border-red-900/30"
                                                        >
                                                            <XCircle className="w-4 h-4" /> Rechazar
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status !== "pending_approval" && (
                                                    <div className={cn(
                                                        "px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2",
                                                        booking.status === "approved" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    )}>
                                                        {booking.status === "approved" ? "Aprobado" : "Rechazado"}
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => deleteBooking(booking.id)}
                                                    className="p-3 text-tech-800 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
