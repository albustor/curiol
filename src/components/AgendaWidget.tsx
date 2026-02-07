"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar as CalendarIcon, Clock, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AgendaWidget() {
    const [nextBookings, setNextBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNext = async () => {
            try {
                const now = new Date();
                const q = query(
                    collection(db, "bookings"),
                    where("date", ">=", Timestamp.fromDate(now)),
                    where("status", "==", "confirmed"),
                    orderBy("date", "asc"),
                    limit(3)
                );
                const snap = await getDocs(q);
                setNextBookings(snap.docs.map(doc => doc.data()));
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
            setLoading(false);
        };
        fetchNext();
    }, []);

    return (
        <GlassCard className="p-8 border-curiol-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-curiol-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-curiol-500/10 transition-all duration-700" />

            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-curiol-500/10 rounded-lg">
                        <CalendarIcon className="w-4 h-4 text-curiol-500" />
                    </div>
                    <h3 className="text-xl font-serif text-white italic">Estado de Agenda</h3>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-tech-500 animate-pulse">Sincronizado • 2026</span>
            </header>

            <div className="space-y-4 mb-8">
                {loading ? (
                    <div className="py-4 space-y-3">
                        <div className="h-10 bg-tech-900 animate-pulse rounded-xl w-full" />
                        <div className="h-10 bg-tech-900 animate-pulse rounded-xl w-full" />
                    </div>
                ) : nextBookings.length > 0 ? (
                    nextBookings.map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-tech-950/50 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-tech-700" />
                                <span className="text-[10px] text-tech-400 font-bold uppercase tracking-widest">
                                    {b.date?.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                            <span className="text-[10px] text-red-500/60 font-bold uppercase tracking-widest italic">Reservado</span>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center">
                        <p className="text-tech-500 text-xs italic font-light">Disponibilidad completa para este mes.</p>
                    </div>
                )}

                {/* Fechas de Ejemplo (Disponibles) */}
                <div className="flex items-center justify-between p-3 bg-curiol-500/5 rounded-xl border border-curiol-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-curiol-500" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Próximos Cupos</span>
                    </div>
                    <span className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest">Disponibles</span>
                </div>
            </div>

            <Link href="/agenda" className="w-full py-4 bg-tech-100 text-tech-950 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 group/btn">
                Separar mi Fecha <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
        </GlassCard>
    );
}
