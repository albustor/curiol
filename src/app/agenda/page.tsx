"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Calendar as CalendarIcon, Clock, User,
    CreditCard, CheckCircle2, AlertCircle,
    ArrowRight, ChevronLeft, ChevronRight,
    Camera, Code, Upload, Sparkles, FileText,
    ShieldCheck, Smartphone, Video,
    Lock, Unlock, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRole } from "@/hooks/useRole";
import { collection, addDoc, query, where, getDocs, Timestamp, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { notifyNewBooking } from "@/actions/notifications";

const STEPS = [
    { id: "service", label: "Servicio", icon: Sparkles },
    { id: "datetime", label: "Fecha & Hora", icon: CalendarIcon },
    { id: "details", label: "Datos", icon: User },
    { id: "payment", label: "Validación", icon: CreditCard }
];

const SERVICES = [
    { id: "legado", name: "Legado Vivo", desc: "Sesión Fine Art / Personal", icon: Camera, color: "curiol-500" },
    { id: "infra", name: "Crecimiento Comercial & IA", desc: "Negocio / Marca Personal", icon: Code, color: "tech-500" },
    { id: "meet", name: "Pre-producción Elite", desc: "Videollamada • 60-80 min", icon: Video, color: "curiol-500" }
];

const WEEKDAY_MEET_SLOTS = ["08:00 PM", "09:15 PM"]; // ~75 min chunks
const WEEKDAY_INFRA_SLOTS = ["07:00 PM", "08:15 PM"];

export default function AgendaPage() {
    const [step, setStep] = useState(0);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientData, setClientData] = useState({ name: "", email: "", whatsapp: "" });
    const [paymentVoucher, setPaymentVoucher] = useState<File | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Admin Features
    const { role, user, isMaster, isTeam } = useRole();
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);

    const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    // Simple Calendar Logic
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
    const [monthBookings, setMonthBookings] = useState<any[]>([]);
    const [scheduleConfig, setScheduleConfig] = useState<{ [key: string]: string[] }>({
        "6": ["02:00 PM", "05:00 PM"],
        "0": ["05:00 PM"]
    });
    const [blockedDates, setBlockedDates] = useState<string[]>([]);

    // Fetch Schedule Config on Mount
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

    // Fetch Blocked Dates
    useEffect(() => {
        const fetchBlocked = async () => {
            const q = query(collection(db, "blocked_dates"));
            const snapshot = await getDocs(q);
            setBlockedDates(snapshot.docs.map(doc => doc.id));
        };
        fetchBlocked();
    }, []);

    // Fetch all bookings for the current month view
    useEffect(() => {
        const fetchMonthBookings = async () => {
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999);

            const q = query(
                collection(db, "bookings"),
                where("date", ">=", Timestamp.fromDate(startOfMonth)),
                where("date", "<=", Timestamp.fromDate(endOfMonth))
            );

            const querySnapshot = await getDocs(q);
            const bookings = querySnapshot.docs.map(doc => doc.data());
            setMonthBookings(bookings);
        };
        fetchMonthBookings();
    }, [currentMonth]);

    // Fetch Availability when Date changes
    useEffect(() => {
        if (!selectedDate) return;

        const dayOfWeek = selectedDate.getDay().toString();

        let baseSlots = [];
        if (selectedService === "meet" && (dayOfWeek !== "0" && dayOfWeek !== "6")) {
            baseSlots = WEEKDAY_MEET_SLOTS;
        } else if (selectedService === "infra" && (dayOfWeek !== "0" && dayOfWeek !== "6")) {
            baseSlots = WEEKDAY_INFRA_SLOTS;
        } else {
            baseSlots = scheduleConfig[dayOfWeek] || [];
        }

        setAvailableSlots(baseSlots);
        setSelectedTime(null);

        const dayBookings = monthBookings.filter(b => {
            const bDate = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
            return bDate.toDateString() === selectedDate.toDateString();
        });

        const occupied = dayBookings.map(b => b.time);
        setOccupiedSlots(occupied);
    }, [selectedDate, scheduleConfig, monthBookings]);

    const handleConfirmBooking = async () => {
        if (!paymentVoucher) return;
        setIsVerifying(true);

        try {
            const formData = new FormData();
            formData.append("file", paymentVoucher);
            formData.append("amount", selectedService === "legado" ? "₡19.000 (20%)" : "₡29.000 (20%)"); // Base estimate

            const response = await fetch("/api/agenda/verify-payment", {
                method: "POST",
                body: formData
            });

            const aiResult = await response.json();

            if (aiResult.isValid) {
                const bookingData = {
                    ...clientData,
                    service: selectedService,
                    date: selectedDate,
                    time: selectedTime,
                    status: "pending_approval",
                    createdAt: Timestamp.now(),
                    paymentVerified: true,
                    aiConfidence: aiResult.confidence,
                    transactionId: aiResult.transactionId || "No detectado"
                };
                await addDoc(collection(db, "bookings"), bookingData);
                await notifyNewBooking(bookingData);
                setIsConfirmed(true);
            } else {
                alert(`La IA no pudo validar el pago: ${aiResult.reason}`);
            }
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Error en la conexión con el servidor de IA");
        }
        setIsVerifying(false);
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setShowLoginModal(false);
        } catch (error: any) {
            console.error("Login Error:", error);
            alert("Credenciales inválidas para acceso administrativo");
        }
        setIsLoggingIn(false);
    };

    const handleBlockDate = async (date: Date) => {
        const dateStr = date.toDateString();
        if (blockedDates.includes(dateStr)) return; // Already blocked, do nothing on single click

        setIsBlocking(true);
        try {
            await setDoc(doc(db, "blocked_dates", dateStr), {
                blockedAt: Timestamp.now(),
                blockedBy: user?.email || "Admin"
            });
            setBlockedDates(prev => [...prev, dateStr]);
        } catch (error) {
            console.error("Error blocking date:", error);
        }
        setIsBlocking(false);
    };

    const handleUnblockDate = async (date: Date) => {
        const dateStr = date.toDateString();
        setIsBlocking(true);
        try {
            await deleteDoc(doc(db, "blocked_dates", dateStr));
            setBlockedDates(prev => prev.filter(d => d !== dateStr));
        } catch (error) {
            console.error("Error unblocking date:", error);
        }
        setIsBlocking(false);
    };

    if (isConfirmed) {
        return (
            <div className="min-h-screen flex flex-col bg-tech-950">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-4 pt-32">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <GlassCard className="max-w-xl p-12 text-center border-curiol-500/20">
                            <div className="w-20 h-20 bg-curiol-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-curiol-500/20">
                                <CheckCircle2 className="w-10 h-10 text-curiol-500" />
                            </div>
                            <h2 className="text-4xl font-serif text-white italic mb-4">¡Reserva en Proceso!</h2>
                            <p className="text-tech-400 mb-10 leading-relaxed font-light">
                                Hola <span className="text-white font-bold">{clientData.name}</span>, hemos recibido tu comprobante. La IA está validando los detalles y Alberto aprobará tu fecha pronto.
                            </p>

                            <Link href="/experiencia" className="text-curiol-500 text-xs font-bold uppercase tracking-widest hover:underline transition-all">
                                Volver a la Experiencia
                            </Link>
                        </GlassCard>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-32 bg-tech-950 bg-grain">
            <Navbar />

            <main className="flex-grow max-w-4xl mx-auto px-4 w-full mb-20">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-serif text-white italic mb-4">Agenda <span className="text-curiol-gradient">Maestra</span></h1>
                    <p className="text-tech-500 uppercase text-[10px] font-bold tracking-[0.4em]">Autogestión Inteligente • Curiol Studio 2026</p>
                </header>

                {/* Progress Tracker */}
                <div className="flex justify-between items-center mb-16 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-tech-800 -translate-y-1/2 z-0"></div>
                    {STEPS.map((s, idx) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 group">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 backdrop-blur-md",
                                step === idx ? "border-curiol-500 bg-curiol-500/10 text-curiol-500 scale-110 shadow-lg shadow-curiol-500/10" :
                                    step > idx ? "border-green-500 bg-green-500/10 text-green-500" : "border-tech-800 bg-tech-950 text-tech-700"
                            )}>
                                {step > idx ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={cn("text-[9px] font-bold uppercase tracking-widest", step === idx ? "text-curiol-500" : "text-tech-700")}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {SERVICES.map((s) => (
                                    <GlassCard
                                        key={s.id}
                                        className={cn("p-10 cursor-pointer border-2 transition-all hover:scale-[1.02]", selectedService === s.id ? `border-curiol-500 shadow-2xl shadow-curiol-500/10` : "border-transparent opacity-60 hover:opacity-100")}
                                        onClick={() => { setSelectedService(s.id); handleNext(); }}
                                    >
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/5", selectedService === s.id ? "bg-curiol-500 text-white" : "bg-tech-900 text-tech-400")}>
                                            <s.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-serif text-white italic mb-2">{s.name}</h3>
                                        <p className="text-tech-500 text-xs uppercase tracking-widest font-bold">{s.desc}</p>
                                    </GlassCard>
                                ))}
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-12">
                                    <GlassCard className="p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-serif text-white italic">Selecciona tu Fecha</h3>
                                            <div className="flex gap-4">
                                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 text-tech-400 hover:text-white"><ChevronLeft /></button>
                                                <span className="text-xs uppercase font-bold tracking-widest text-white pt-2">
                                                    {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-tech-400 hover:text-white"><ChevronRight /></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-4 text-center mb-4">
                                            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => <span key={d} className="text-[10px] font-bold text-tech-700 uppercase">{d}</span>)}
                                            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                                const day = i + 1;
                                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                                                const dayOfWeek = date.getDay().toString();
                                                const isWeekend = dayOfWeek === "6" || dayOfWeek === "0";

                                                let baseSlots = [];
                                                let isServiceDay = false;

                                                if (selectedService === "meet") {
                                                    if (!isWeekend) {
                                                        baseSlots = WEEKDAY_MEET_SLOTS;
                                                        isServiceDay = true;
                                                    }
                                                } else if (selectedService === "infra") {
                                                    if (isWeekend) {
                                                        baseSlots = scheduleConfig[dayOfWeek] || [];
                                                        isServiceDay = true;
                                                    } else {
                                                        baseSlots = WEEKDAY_INFRA_SLOTS;
                                                        isServiceDay = true;
                                                    }
                                                } else {
                                                    if (isWeekend) {
                                                        baseSlots = scheduleConfig[dayOfWeek] || [];
                                                        isServiceDay = true;
                                                    }
                                                }

                                                // Check if all slots are full
                                                const dayBookings = monthBookings.filter(b => {
                                                    const bDate = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
                                                    return bDate.toDateString() === date.toDateString();
                                                });

                                                const isBlocked = blockedDates.includes(date.toDateString());
                                                const isFull = baseSlots.length > 0 && dayBookings.length >= baseSlots.length;
                                                const isDisabled = isPast || !isServiceDay || isFull || isBlocked;

                                                return (
                                                    <button
                                                        key={day}
                                                        disabled={isDisabled}
                                                        onClick={() => {
                                                            if (isAdminMode) {
                                                                if (role === "UNAUTHORIZED") {
                                                                    setShowLoginModal(true);
                                                                } else {
                                                                    handleBlockDate(date);
                                                                }
                                                                return;
                                                            }
                                                            setSelectedDate(date);
                                                        }}
                                                        onDoubleClick={(e) => {
                                                            if (isAdminMode && role !== "UNAUTHORIZED") {
                                                                e.preventDefault();
                                                                handleUnblockDate(date);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative overflow-hidden",
                                                            isSelected ? "bg-curiol-500 text-white shadow-xl shadow-curiol-500/30" :
                                                                isAdminMode ? (isBlocked ? "bg-red-500/20 text-red-500 ring-2 ring-red-500/50" : "bg-green-500/10 text-green-500 ring-1 ring-green-500/30 hover:bg-green-500/20") :
                                                                    isDisabled ? "opacity-20 cursor-not-allowed bg-tech-950/50" : "text-tech-400 hover:bg-tech-800 hover:text-white"
                                                        )}
                                                    >
                                                        <span>{day}</span>
                                                        {isFull && !isPast && isWeekend && !isBlocked && (
                                                            <span className="text-[6px] absolute bottom-1 uppercase font-black text-red-500/80">Lleno</span>
                                                        )}
                                                        {isBlocked && !isPast && (
                                                            <span className="text-[6px] absolute bottom-1 uppercase font-black text-red-500/80">Indisp.</span>
                                                        )}
                                                        {isAdminMode && isBlocking && isSelected && (
                                                            <Loader2 className="w-3 h-3 animate-spin absolute top-1 right-1 text-curiol-500" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {selectedDate && (
                                            <div className="mt-12 pt-8 border-t border-white/5">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-tech-500 mb-6 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> Disponibilidad para {selectedDate.toLocaleDateString()}
                                                </p>
                                                <div className="flex flex-wrap gap-3">
                                                    {availableSlots.length > 0 ? availableSlots.map(t => {
                                                        const isOccupied = occupiedSlots.includes(t);
                                                        return (
                                                            <button
                                                                key={t}
                                                                disabled={isOccupied}
                                                                onClick={() => setSelectedTime(t)}
                                                                className={cn(
                                                                    "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                                                    selectedTime === t ? "bg-curiol-500 text-white" :
                                                                        isOccupied ? "bg-tech-900/50 text-tech-800 cursor-not-allowed opacity-50" :
                                                                            "bg-tech-950 border border-tech-800 text-tech-500 hover:border-curiol-500/50"
                                                                )}
                                                            >
                                                                {t} {isOccupied && "• Ocupado"}
                                                            </button>
                                                        );
                                                    }) : (
                                                        <p className="text-tech-700 text-[10px] font-bold uppercase tracking-widest py-4 italic">No hay horarios disponibles para este día.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-xl mx-auto">
                                <GlassCard className="p-10 space-y-6">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-serif text-white italic mb-2">Tus Datos de Contacto</h3>
                                        <p className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest">
                                            {selectedService === 'meet' ? "Fase 0: Pre-producción esencial para conocer tu visión" : "Tus datos para coordinar la sesión"}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Nombre Completo"
                                                value={clientData.name}
                                                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                                                className="w-full bg-tech-950/50 border border-tech-800 rounded-xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                            <input
                                                type="email"
                                                placeholder="Correo Electrónico"
                                                value={clientData.email}
                                                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                                                className="w-full bg-tech-950/50 border border-tech-800 rounded-xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                            <input
                                                type="tel"
                                                placeholder="WhatsApp (ej: 6060-2617)"
                                                value={clientData.whatsapp}
                                                onChange={(e) => setClientData({ ...clientData, whatsapp: e.target.value })}
                                                className="w-full bg-tech-950/50 border border-tech-800 rounded-xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-xl mx-auto">
                                <GlassCard className="p-10 text-center">
                                    <div className="bg-tech-900 rounded-[2rem] p-8 mb-10 border border-white/5">
                                        <Sparkles className="w-12 h-12 text-curiol-500 mx-auto mb-6" />
                                        <h3 className="text-2xl font-serif text-white italic mb-2">Reserva de Espacio</h3>
                                        <p className="text-tech-500 text-sm font-light leading-relaxed">
                                            Para formalizar tu cita en la agenda, es indispensable reportar el <span className="text-white font-bold">20% de adelanto</span> vía SINPE o Depósito.
                                        </p>
                                        <div className="mt-4 p-4 bg-curiol-500/10 rounded-2xl border border-curiol-500/20">
                                            <p className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest leading-relaxed">
                                                Sin el comprobante, el sistema no permite completar el registro y el espacio permanecerá disponible para otros clientes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="border-2 border-dashed border-tech-800 rounded-[2rem] p-12 hover:border-curiol-500/50 transition-all cursor-pointer relative group">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => setPaymentVoucher(e.target.files ? e.target.files[0] : null)}
                                            />
                                            {paymentVoucher ? (
                                                <div className="flex flex-col items-center">
                                                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                                                    <p className="text-white text-xs font-bold uppercase tracking-widest">{paymentVoucher.name}</p>
                                                    <button onClick={(e) => { e.stopPropagation(); setPaymentVoucher(null); }} className="mt-4 text-[9px] text-tech-500 uppercase hover:text-red-500 transition-colors">Remover Archivo</button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Upload className="w-12 h-12 text-tech-700 mb-4 group-hover:text-curiol-500 group-hover:scale-110 transition-all" />
                                                    <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest">Sube tu Comprobante de Pago</p>
                                                    <p className="text-tech-700 text-[9px] mt-2 italic">(Transacción ID o Captura de Pantalla)</p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            disabled={!paymentVoucher || isVerifying}
                                            onClick={handleConfirmBooking}
                                            className={cn(
                                                "w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                                                paymentVoucher && !isVerifying ? "bg-curiol-gradient text-white shadow-2xl shadow-curiol-500/20" : "bg-tech-800 text-tech-600 cursor-not-allowed"
                                            )}
                                        >
                                            {isVerifying ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            {isVerifying ? "IA Validando Pago..." : "Finalizar Reserva"}
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                {step < 3 && (
                    <div className="mt-16 flex justify-between items-center bg-tech-950/50 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5">
                        <button
                            onClick={handleBack}
                            disabled={step === 0}
                            className={cn(
                                "px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl",
                                step === 0 ? "text-tech-800 bg-white/5" : "text-white bg-tech-800 hover:bg-tech-700"
                            )}
                        >
                            Anterior
                        </button>

                        <div className="hidden md:flex gap-2">
                            {STEPS.map((_, i) => (
                                <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === step ? "w-8 bg-curiol-500" : "bg-tech-800")} />
                            ))}
                        </div>

                        {selectedService && (step === 0 || (step === 1 && selectedDate && selectedTime) || (step === 2 && clientData.name && clientData.email)) ? (
                            <button
                                onClick={handleNext}
                                className="px-10 py-4 bg-white text-tech-950 text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-50 transition-all rounded-xl flex items-center gap-2 group shadow-xl shadow-curiol-500/10"
                            >
                                Siguiente <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <div className="px-10 py-4 bg-tech-900/80 border border-white/5 text-tech-500 text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-3 h-3 opacity-50" /> Selecciona una opción
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
            <AiAssistant />

            {/* Admin Toggle Button */}
            <div className="fixed bottom-32 right-8 z-40">
                <button
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-2xl",
                        isAdminMode ? "bg-curiol-500 text-white" : "bg-tech-900/80 text-tech-600 border border-white/5 backdrop-blur-md opacity-20 hover:opacity-100"
                    )}
                    title={isAdminMode ? "Desactivar Modo Admin" : "Activar Modo Admin"}
                >
                    <ShieldCheck className="w-5 h-5" />
                </button>
            </div>

            {/* Admin Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-tech-950/80 backdrop-blur-xl"
                            onClick={() => setShowLoginModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-10 w-full max-w-md"
                        >
                            <GlassCard className="p-10 border-curiol-500/30">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-curiol-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-curiol-500/20">
                                        <Lock className="w-6 h-6 text-curiol-500" />
                                    </div>
                                    <h3 className="text-2xl font-serif text-white italic">Acceso Administrativo</h3>
                                    <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mt-2">Valida tu identidad para gestionar fechas</p>
                                </div>

                                <form onSubmit={handleAdminLogin} className="space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Email Administrativo"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full bg-tech-950/50 border border-tech-800 rounded-xl py-4 px-6 text-white text-sm outline-none focus:border-curiol-500 transition-all"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full bg-tech-950/50 border border-tech-800 rounded-xl py-4 px-6 text-white text-sm outline-none focus:border-curiol-500 transition-all"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoggingIn}
                                        className="w-full py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-curiol-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                                        {isLoggingIn ? "Verificando..." : "Acceder"}
                                    </button>
                                </form>
                                <button
                                    onClick={() => setShowLoginModal(false)}
                                    className="w-full mt-4 text-[9px] text-tech-600 uppercase font-bold hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Utility mapping removed as icons are now imported correctly
