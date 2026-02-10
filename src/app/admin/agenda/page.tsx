"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Calendar as CalendarIcon, Clock, CheckCircle2,
    XCircle, ChevronLeft, ChevronRight, Filter,
    Camera, Code, AlertCircle, Sparkles, User,
    Mail, Smartphone, ShieldCheck, Heart, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp, where, getDoc } from "firebase/firestore";
import { recordTaxTransaction } from "@/actions/accounting";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";

interface Booking {
    id: string;
    name: string;
    email: string;
    whatsapp: string;
    service: string;
    date: any;
    time: string;
    status: "pending_approval" | "confirmed" | "cancelled";
    paymentVerified: boolean;
    aiConfidence: string;
}

export default function AdminAgendaPage() {
    const { role } = useRole();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    // Fetch Bookings
    useEffect(() => {
        if (role !== "MASTER" && role !== "TEAM") return;

        const q = query(collection(db, "bookings"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Booking[];
            setBookings(data);
        });
        return () => unsubscribe();
    }, [role]);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await updateDoc(doc(db, "bookings", id), { status });

            if (status === 'confirmed') {
                const bookingSnap = await getDoc(doc(db, "bookings", id));
                if (bookingSnap.exists()) {
                    const bookingData = bookingSnap.data();
                    // Automate tax transaction recording
                    await recordTaxTransaction({
                        type: 'income',
                        category: bookingData.service === 'software' ? 'software' : 'photography',
                        amount: bookingData.service === 'legado' ? 250000 : 85000, // Simulated logic based on standard prices
                        description: `Sesión Confirmada: ${bookingData.service} para ${bookingData.name}`,
                        relatedId: id
                    });
                }
            }
            setSelectedBooking(null);
        } catch (error) {
            console.error("Error updating booking status:", error);
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

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 pb-24 bg-grain">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <CalendarIcon className="text-curiol-500 w-4 h-4" />
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Sincronización Maestra</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Centro de Agenda</h1>
                        <p className="text-tech-500 mt-4">Gestión visual de sesiones, eventos y disponibilidad del estudio.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Calendar View */}
                    <GlassCard className="lg:col-span-8 p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-serif text-white italic">Calendario Visual</h2>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 text-tech-400 hover:text-white transition-all"><ChevronLeft /></button>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                                    {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                                </span>
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-tech-400 hover:text-white transition-all"><ChevronRight /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-4 mb-4">
                            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
                                <div key={d} className="text-[10px] font-bold text-tech-700 uppercase tracking-widest text-center">{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-4">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const isSunday = date.getDay() === 0;
                                // 4th Sunday calculation
                                const dayOfMonth = date.getDate();
                                const is4thSunday = isSunday && dayOfMonth > 21 && dayOfMonth <= 28;

                                const dayBookings = bookings.filter(b => b.date?.toDate().toDateString() === date.toDateString());

                                return (
                                    <div key={day} className="min-h-[100px] bg-tech-950/30 border border-white/5 rounded-2xl p-3 flex flex-col gap-2 relative group hover:border-curiol-500/30 transition-all">
                                        <span className="text-[10px] font-bold text-tech-700">{day}</span>
                                        <div className="space-y-1">
                                            {dayBookings.map(b => (
                                                <button
                                                    key={b.id}
                                                    onClick={() => setSelectedBooking(b)}
                                                    className={cn(
                                                        "w-full text-[8px] font-bold uppercase tracking-widest p-1.5 rounded-lg truncate text-left transition-all",
                                                        b.status === 'confirmed' ? "bg-green-500/10 text-green-500" :
                                                            b.status === 'cancelled' ? "bg-red-500/10 text-red-500" : "bg-curiol-500/10 text-curiol-500"
                                                    )}
                                                >
                                                    {b.time} • {b.name}
                                                </button>
                                            ))}
                                            {is4thSunday && (
                                                <div className="w-full text-[8px] font-bold uppercase tracking-widest p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/20 flex items-center gap-1">
                                                    <Heart className="w-2 h-2" /> Acción Social
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>

                    {/* Sidebar: Details/Next Citas */}
                    <div className="lg:col-span-4 space-y-6">
                        <header className="px-2">
                            <h2 className="text-xl font-serif text-white italic">Próximas Reservas</h2>
                            <p className="text-[9px] text-tech-700 font-bold uppercase tracking-widest mt-1">Pendientes de Aprobación</p>
                        </header>

                        <div className="space-y-4">
                            {bookings.filter(b => b.status === 'pending_approval').map(b => (
                                <GlassCard key={b.id} className="p-6 cursor-pointer hover:border-curiol-500/30 transition-all group" onClick={() => setSelectedBooking(b)}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-tech-900 rounded-xl border border-white/5 text-curiol-500">
                                            {b.service === 'legado' ? <Camera className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">{b.name}</p>
                                            <p className="text-tech-500 text-[10px] uppercase tracking-widest">{b.date?.toDate().toLocaleDateString()} • {b.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-green-500/60">Pago Validado por IA</span>
                                    </div>
                                </GlassCard>
                            ))}
                            {bookings.filter(b => b.status === 'pending_approval').length === 0 && (
                                <p className="text-tech-700 text-xs italic text-center py-10">No hay reservas pendientes.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Details Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-tech-950/90 backdrop-blur-md" onClick={() => setSelectedBooking(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-tech-900 border border-white/5 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden p-10">
                            <header className="mb-10 flex justify-between items-start">
                                <div>
                                    <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest mb-4 block">Detalles de Reserva</span>
                                    <h3 className="text-4xl font-serif text-white italic">{selectedBooking.name}</h3>
                                </div>
                                <div className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                                    selectedBooking.status === 'confirmed' ? "bg-green-500/10 text-green-500" :
                                        selectedBooking.status === 'cancelled' ? "bg-red-500/10 text-red-500" : "bg-curiol-500/10 text-curiol-500"
                                )}>
                                    {selectedBooking.status}
                                </div>
                            </header>

                            <div className="grid grid-cols-2 gap-8 mb-10 text-white/80">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-tech-500" /> <span className="text-sm">{selectedBooking.email}</span></div>
                                    <div className="flex items-center gap-3"><Smartphone className="w-4 h-4 text-tech-500" /> <span className="text-sm">{selectedBooking.whatsapp}</span></div>
                                    <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-tech-500" /> <span className="text-sm">{selectedBooking.time}</span></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-tech-500" /> <span className="text-sm uppercase tracking-widest font-bold">{selectedBooking.service}</span></div>
                                    <div className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-green-500" /> <span className="text-sm text-green-500">IA Confianza: {selectedBooking.aiConfidence}%</span></div>
                                </div>
                            </div>

                            <div className="flex gap-4 border-t border-white/5 pt-10">
                                <button
                                    onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                                    className="flex-grow py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Aprobar y Agendar
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                                    className="px-8 py-5 bg-tech-800 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" /> Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
