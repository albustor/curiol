"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Calendar as CalendarIcon, Clock, CheckCircle2,
    XCircle, ChevronLeft, ChevronRight, Filter,
    Camera, Code, AlertCircle, Sparkles, User,
    Mail, Smartphone, ShieldCheck, Heart, Loader2,
    Plus, Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp, where, getDoc, addDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import { notifyNewBooking } from "@/actions/notifications";
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
    const { role, user } = useRole();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [selectedDateForAction, setSelectedDateForAction] = useState<Date | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [manualStep, setManualStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [manualForm, setManualForm] = useState({
        name: "",
        email: "",
        whatsapp: "",
        cedula: "",
        serviceId: "legado",
        date: null as Date | null,
        time: "",
        markAsPaid: false,
        generateContract: true
    });

    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [scheduleConfig, setScheduleConfig] = useState<{ [key: string]: string[] }>({
        "6": ["02:00 PM", "05:00 PM"],
        "0": ["05:00 PM"]
    });

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

    // Fetch Blocked Dates
    useEffect(() => {
        if (role !== "MASTER" && role !== "TEAM") return;
        const q = query(collection(db, "blocked_dates"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.id); // Doc ID is the date string
            setBlockedDates(data);
        });
        return () => unsubscribe();
    }, [role]);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    // Fetch Schedule Config
    useEffect(() => {
        const fetchConfig = async () => {
            const docRef = doc(db, "settings", "schedule");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setScheduleConfig(docSnap.data().slots);
            }
        };
        fetchConfig();
    }, []);

    // Effect to update slots when manual date changes
    useEffect(() => {
        if (!manualForm.date) return;
        const dayOfWeek = manualForm.date.getDay().toString();
        const configSlots = scheduleConfig[dayOfWeek] || [];

        // If it's a weekday and service is "meet" or "infra", use special slots
        if (manualForm.serviceId === 'meet' && !["0", "6"].includes(dayOfWeek)) {
            setAvailableSlots(["08:00 PM", "09:15 PM"]);
        } else if (manualForm.serviceId === 'infra' && !["0", "6"].includes(dayOfWeek)) {
            setAvailableSlots(["07:00 PM", "08:15 PM"]);
        } else {
            setAvailableSlots(configSlots);
        }
    }, [manualForm.date, manualForm.serviceId, scheduleConfig]);


    const generateContractPDF = (data: typeof manualForm) => {
        const doc = new jsPDF();
        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const quoteId = `MB-${Math.floor(Math.random() * 90000) + 10000}`;

        // Branding
        doc.setFontSize(22);
        doc.setTextColor(191, 155, 48); // Curiol Gold
        doc.text("CURIOL STUDIO", 105, 30, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Contrato de Prestación de Servicios Fotográficos / Digitales", 105, 40, { align: "center" });
        doc.text(`Ref: ${quoteId} | Fecha: ${dateStr}`, 105, 45, { align: "center" });

        // Client Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("I. DATOS DEL CLIENTE", 20, 60);
        doc.setFontSize(10);
        doc.text(`Nombre: ${data.name}`, 20, 70);
        doc.text(`Identificación: ${data.cedula}`, 20, 75);
        doc.text(`WhatsApp: ${data.whatsapp}`, 20, 80);

        // Service Info
        doc.setFontSize(12);
        doc.text("II. DETALLE DEL SERVICIO", 20, 95);
        doc.setFontSize(10);
        doc.text(`Servicio: ${data.serviceId === 'legado' ? 'Legado Vivo' : data.serviceId === 'infra' ? 'Crecimiento Comercial' : 'Sesión Elite'}`, 20, 105);
        doc.text(`Fecha Programada: ${data.date?.toLocaleDateString()}`, 20, 110);
        doc.text(`Hora: ${data.time}`, 20, 115);

        // Clauses (Simplified for speed)
        doc.setFontSize(12);
        doc.text("III. CLÁUSULAS Y COMPROMISO", 20, 130);
        doc.setFontSize(9);
        const clauses = [
            "1. PRIORIDAD: El cliente goza de prioridad en la agenda de Curiol Studio.",
            "2. POLÍTICA DE CAMBIOS: Se permite UN solo cambio de fecha solicitado con 15 días de preaviso.",
            "3. RESERVA & EJECUCIÓN: Este contrato se perfecciona con el registro de la reserva.",
            "4. PAGOS: El saldo pendiente debe cancelarse el día de la sesión o contra entrega según el servicio."
        ];
        clauses.forEach((line, i) => {
            doc.text(line, 20, 140 + (i * 7));
        });

        // Legal Foundation
        doc.setFontSize(10);
        doc.text("IV. FUNDAMENTO JURÍDICO (Ley N° 8454)", 20, 180);
        doc.setFontSize(7);
        const legalText = [
            "Este contrato digital se rige por la Ley de Certificados, Firmas Digitales y Documentos Electrónicos de Costa Rica.",
            "Bajo el Principio de Equivalencia Funcional, los documentos electrónicos tienen la misma validez que los físicos.",
            "Este documento es generado administrativamente por Curiol Studio para validación de servicios agendados."
        ];
        legalText.forEach((line, i) => {
            doc.text(line, 20, 187 + (i * 4));
        });

        // Signature
        doc.setFontSize(12);
        doc.text("V. ACEPTACIÓN", 20, 210);
        doc.setFontSize(8);
        doc.text("Documento generado administrativamente. Al agendar la sesión, ambas partes aceptan los términos.", 20, 218);

        doc.setLineWidth(0.5);
        doc.line(20, 238, 80, 238);
        doc.text("FIRMA DEL CLIENTE", 20, 243);

        doc.line(120, 238, 180, 238);
        doc.text("CURIOL STUDIO", 120, 243);

        doc.save(`Contrato_Manual_${data.name.replace(/\s+/g, '_')}.pdf`);
    };

    const handleManualSubmit = async () => {
        if (!manualForm.date || !manualForm.time || !manualForm.name) {
            alert("Por favor completa los campos obligatorios");
            return;
        }

        setIsSubmitting(true);
        try {
            const bookingData = {
                name: manualForm.name,
                email: manualForm.email,
                whatsapp: manualForm.whatsapp,
                service: manualForm.serviceId,
                date: Timestamp.fromDate(manualForm.date),
                time: manualForm.time,
                status: manualForm.markAsPaid ? "confirmed" : "pending_approval",
                paymentVerified: manualForm.markAsPaid,
                aiConfidence: "100", // Admin override
                createdAt: Timestamp.now(),
                adminBooking: true,
                cedula: manualForm.cedula
            };

            await addDoc(collection(db, "bookings"), bookingData);

            if (manualForm.generateContract) {
                generateContractPDF(manualForm);
            }

            // Optional: Notify team/client
            // await notifyNewBooking(bookingData);

            setShowManualModal(false);
            setManualStep(1);
            setManualForm({
                name: "",
                email: "",
                whatsapp: "",
                cedula: "",
                serviceId: "legado",
                date: null,
                time: "",
                markAsPaid: false,
                generateContract: true
            });
        } catch (error) {
            console.error("Error creating manual booking:", error);
            alert("Error al crear la reserva");
        }
        setIsSubmitting(false);
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'confirmed' ? 'pending_approval' : 'confirmed';
        handleStatusUpdate(id, nextStatus);
    };

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
                        amount: bookingData.service === 'legado' ? 250000 : 85000,
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

    const toggleBlockDate = async (dateStr: string) => {
        setIsBlocking(true);
        try {
            if (blockedDates.includes(dateStr)) {
                // Delete doc (unblock)
                const { deleteDoc } = await import("firebase/firestore");
                await deleteDoc(doc(db, "blocked_dates", dateStr));
            } else {
                // Add doc (block)
                const { setDoc } = await import("firebase/firestore");
                await setDoc(doc(db, "blocked_dates", dateStr), {
                    blockedAt: Timestamp.now(),
                    blockedBy: user?.email
                });
            }
        } catch (error) {
            console.error("Error toggling block date:", error);
        }
        setIsBlocking(false);
        setSelectedDateForAction(null);
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
                    <div>
                        <button
                            onClick={() => setShowManualModal(true)}
                            className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-curiol-500/20"
                        >
                            <Plus className="w-4 h-4" /> Nueva Reserva Manual
                        </button>
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
                                    <div
                                        key={day}
                                        onClick={() => {
                                            if (dayBookings.length === 0) {
                                                setSelectedDateForAction(date);
                                            }
                                        }}
                                        className={cn(
                                            "min-h-[100px] bg-tech-950/30 border border-white/5 rounded-2xl p-3 flex flex-col gap-2 relative group hover:border-curiol-500/30 transition-all cursor-pointer",
                                            blockedDates.includes(date.toDateString()) && "bg-red-500/5 border-red-500/20"
                                        )}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-tech-700">{day}</span>
                                            {blockedDates.includes(date.toDateString()) && (
                                                <XCircle className="w-3 h-3 text-red-500" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {blockedDates.includes(date.toDateString()) ? (
                                                <div className="text-[8px] font-bold uppercase tracking-widest p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/20">
                                                    Bloqueado
                                                </div>
                                            ) : (
                                                dayBookings.map(b => (
                                                    <button
                                                        key={b.id}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); }}
                                                        className={cn(
                                                            "w-full text-[8px] font-bold uppercase tracking-widest p-1.5 rounded-lg truncate text-left transition-all",
                                                            b.status === 'confirmed' ? "bg-green-500/10 text-green-500" :
                                                                b.status === 'cancelled' ? "bg-red-500/10 text-red-500" : "bg-curiol-500/10 text-curiol-500"
                                                        )}
                                                    >
                                                        {b.time} • {b.name}
                                                    </button>
                                                ))
                                            )}
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

            {/* Date Blocking Confirmation Modal */}
            <AnimatePresence>
                {selectedDateForAction && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-tech-950/90 backdrop-blur-md" onClick={() => setSelectedDateForAction(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-tech-900 border border-white/5 w-full max-w-md rounded-[2rem] shadow-2xl p-10 text-center">
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
                                blockedDates.includes(selectedDateForAction.toDateString()) ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            )}>
                                <CalendarIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif text-white italic mb-2">
                                {blockedDates.includes(selectedDateForAction.toDateString()) ? "Desbloquear Fecha" : "Bloquear Fecha"}
                            </h3>
                            <p className="text-tech-500 text-sm mb-8">
                                {blockedDates.includes(selectedDateForAction.toDateString())
                                    ? `¿Deseas volver a habilitar el ${selectedDateForAction.toLocaleDateString()}?`
                                    : `¿Deseas bloquear el día ${selectedDateForAction.toLocaleDateString()} para evitar nuevas reservas?`}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    disabled={isBlocking}
                                    onClick={() => toggleBlockDate(selectedDateForAction.toDateString())}
                                    className={cn(
                                        "flex-grow py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                        blockedDates.includes(selectedDateForAction.toDateString()) ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                    )}
                                >
                                    {isBlocking ? "Procesando..." : (blockedDates.includes(selectedDateForAction.toDateString()) ? "Confirmar Desbloqueo" : "Confirmar Bloqueo")}
                                </button>
                                <button
                                    onClick={() => setSelectedDateForAction(null)}
                                    className="px-6 py-4 bg-tech-800 text-tech-400 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Manual Booking Modal */}
            <AnimatePresence>
                {showManualModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-tech-950/95 backdrop-blur-xl" onClick={() => setShowManualModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-tech-900 border border-white/5 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                            {/* Progress Header */}
                            <div className="flex bg-tech-950/50 p-6 border-b border-white/5">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className="flex-1 flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                                            manualStep === s ? "bg-curiol-500 text-white" : manualStep > s ? "bg-green-500 text-white" : "bg-tech-800 text-tech-500"
                                        )}>
                                            {manualStep > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                        </div>
                                        <span className={cn("text-[8px] uppercase font-black tracking-widest", manualStep === s ? "text-curiol-500" : "text-tech-700")}>
                                            {s === 1 ? "Servicio" : s === 2 ? "Fecha & Hora" : "Cliente & Contrato"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-grow p-10 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {manualStep === 1 && (
                                        <motion.div key="mstep1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[
                                                { id: "legado", name: "Legado Vivo", desc: "Artesanía Fotográfica", icon: Camera },
                                                { id: "infra", name: "Crecimiento Comercial", desc: "Infraestructura & IA", icon: Code },
                                                { id: "meet", name: "Sesión Elite", desc: "Pre-producción / Meet", icon: Video }
                                            ].map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => { setManualForm({ ...manualForm, serviceId: s.id }); setManualStep(2); }}
                                                    className={cn(
                                                        "p-8 bg-tech-950/50 border rounded-[2rem] text-left transition-all hover:border-curiol-500 group",
                                                        manualForm.serviceId === s.id ? "border-curiol-500 bg-curiol-500/5 shadow-2xl shadow-curiol-500/5" : "border-white/5"
                                                    )}
                                                >
                                                    <s.icon className={cn("w-10 h-10 mb-6 transition-all", manualForm.serviceId === s.id ? "text-curiol-500" : "text-tech-800 group-hover:text-curiol-500")} />
                                                    <h4 className="text-xl font-serif text-white italic mb-2">{s.name}</h4>
                                                    <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest">{s.desc}</p>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}

                                    {manualStep === 2 && (
                                        <motion.div key="mstep2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                            <div className="flex flex-col md:flex-row gap-10">
                                                <div className="flex-shrink-0">
                                                    <label className="text-curiol-500 text-[9px] font-black uppercase tracking-widest mb-4 block italic">Seleccioná el día</label>
                                                    <div className="p-4 bg-tech-950/50 border border-white/5 rounded-3xl w-fit">
                                                        <div className="grid grid-cols-7 gap-2">
                                                            {/* Simple small calendar for selection */}
                                                            {Array.from({ length: 31 }).map((_, i) => {
                                                                const day = i + 1;
                                                                const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                                                const isSelected = manualForm.date?.toDateString() === d.toDateString();
                                                                return (
                                                                    <button
                                                                        key={day}
                                                                        onClick={() => setManualForm({ ...manualForm, date: d, time: "" })}
                                                                        className={cn(
                                                                            "w-8 h-8 rounded-lg text-[10px] font-bold transition-all",
                                                                            isSelected ? "bg-curiol-500 text-white" : "text-tech-600 hover:bg-white/5"
                                                                        )}
                                                                    >
                                                                        {day}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="text-curiol-500 text-[9px] font-black uppercase tracking-widest mb-4 block italic">Seleccioná el horario</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {availableSlots.length > 0 ? (
                                                            availableSlots.map(t => (
                                                                <button
                                                                    key={t}
                                                                    onClick={() => setManualForm({ ...manualForm, time: t })}
                                                                    className={cn(
                                                                        "p-4 border rounded-xl text-xs font-bold transition-all",
                                                                        manualForm.time === t ? "border-curiol-500 bg-curiol-500/10 text-curiol-500" : "border-white/5 text-tech-500 hover:border-white/20"
                                                                    )}
                                                                >
                                                                    {t}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-2 py-10 text-center text-tech-700 text-xs italic">
                                                                No hay horarios configurados para este día.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-white/5 flex gap-4">
                                                <button onClick={() => setManualStep(1)} className="px-8 py-4 bg-tech-800 text-tech-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-white transition-all">Anterior</button>
                                                <button
                                                    disabled={!manualForm.date || !manualForm.time}
                                                    onClick={() => setManualStep(3)}
                                                    className="flex-grow py-4 bg-white text-tech-950 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-tech-100 transition-all disabled:opacity-30"
                                                >
                                                    Continuar a Datos del Cliente
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {manualStep === 3 && (
                                        <motion.div key="mstep3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-tech-700 block px-2">Nombre Completo</label>
                                                    <input
                                                        type="text"
                                                        value={manualForm.name}
                                                        onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                                                        placeholder="Nombre del Cliente"
                                                        className="w-full bg-tech-950/50 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-tech-700 block px-2">Cédula / Identificación</label>
                                                    <input
                                                        type="text"
                                                        value={manualForm.cedula}
                                                        onChange={(e) => setManualForm({ ...manualForm, cedula: e.target.value })}
                                                        placeholder="ID para contrato"
                                                        className="w-full bg-tech-950/50 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-tech-700 block px-2">Email</label>
                                                    <input
                                                        type="email"
                                                        value={manualForm.email}
                                                        onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                                                        placeholder="email@ejemplo.com"
                                                        className="w-full bg-tech-950/50 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-tech-700 block px-2">WhatsApp</label>
                                                    <input
                                                        type="text"
                                                        value={manualForm.whatsapp}
                                                        onChange={(e) => setManualForm({ ...manualForm, whatsapp: e.target.value })}
                                                        placeholder="6060-0000"
                                                        className="w-full bg-tech-950/50 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-tech-950/30 p-8 border border-white/5 rounded-[2rem] space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h5 className="text-white font-serif text-lg italic">Contrato & Estado</h5>
                                                        <p className="text-[9px] text-tech-600 font-bold uppercase tracking-widest mt-1">Automatización de formalismo legal</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => setManualForm({ ...manualForm, generateContract: !manualForm.generateContract })}
                                                            className={cn(
                                                                "px-6 py-3 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all",
                                                                manualForm.generateContract ? "border-curiol-500 bg-curiol-500/10 text-curiol-500" : "border-white/5 text-tech-800"
                                                            )}
                                                        >
                                                            {manualForm.generateContract ? "Generar PDF" : "Sin Contrato"}
                                                        </button>
                                                        <button
                                                            onClick={() => setManualForm({ ...manualForm, markAsPaid: !manualForm.markAsPaid })}
                                                            className={cn(
                                                                "px-6 py-3 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all",
                                                                manualForm.markAsPaid ? "border-green-500 bg-green-500/10 text-green-500" : "border-white/5 text-tech-800"
                                                            )}
                                                        >
                                                            {manualForm.markAsPaid ? "Pagado & Confirmado" : "Pendiente de Pago"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-white/5 flex gap-4">
                                                <button onClick={() => setManualStep(2)} className="px-8 py-4 bg-tech-800 text-tech-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-white transition-all">Anterior</button>
                                                <button
                                                    disabled={isSubmitting || !manualForm.name}
                                                    onClick={handleManualSubmit}
                                                    className="flex-grow py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-30 disabled:scale-100"
                                                >
                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                    {isSubmitting ? "Agendando..." : "Confirmar Reserva y " + (manualForm.generateContract ? "Generar Contrato" : "Guardar")}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
