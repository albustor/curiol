"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    FileText, Search, Filter, ArrowRight,
    Clock, CheckCircle2, User, Landmark,
    Smartphone, CreditCard, Sparkles, Loader2,
    Calendar, DollarSign, Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, Timestamp } from "firebase/firestore";

interface Quote {
    id: string;
    quoteId: string;
    package: string;
    total: number;
    currency: "CRC" | "USD";
    paymentMethod: "sinpe" | "transfer" | "card";
    status: string;
    createdAt: any;
    items: { name: string, price: number }[];
}

export default function AdminPresupuestosPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Quote[];
            setQuotes(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "quotes", id), { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredQuotes = quotes.filter(q => {
        const matchesSearch = q.quoteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.package.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || q.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const latestQuoteId = quotes.length > 0 ? quotes[0].id : null;

    if (loading) return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest border border-curiol-500/30 px-3 py-1 rounded-full">Gestión Comercial</span>
                        </div>
                        <h1 className="text-4xl font-serif text-white italic mb-2">Control de Presupuestos</h1>
                        <p className="text-tech-500 text-sm font-light">Monitorea y gestiona los leads generados desde el cotizador.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar ID o Paquete..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-tech-900 border border-tech-800 rounded-xl py-3 pl-12 pr-6 text-xs text-white outline-none focus:border-curiol-500 transition-all w-full sm:w-64"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-tech-900 border border-tech-800 rounded-xl py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-tech-500 outline-none focus:border-curiol-500 transition-all cursor-pointer"
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="pending_link">Pendiente Link (Tarjeta)</option>
                            <option value="pending_confirmation">Pendiente Confirmación</option>
                            <option value="converted">Convertido / Vendido</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredQuotes.length > 0 ? (
                            filteredQuotes.map((quote) => (
                                <motion.div
                                    key={quote.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                >
                                    <GlassCard className="p-8 group hover:border-curiol-500/30 transition-all">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Status Badge & Actions */}
                                            <div className="lg:w-48 shrink-0 flex flex-col gap-4">
                                                <div className={cn(
                                                    "py-2 px-4 rounded-lg text-[8px] font-bold uppercase tracking-[0.2em] text-center",
                                                    quote.status === 'pending_link' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                                        quote.status === 'converted' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                                            quote.status === 'cancelled' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                                                "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                                )}>
                                                    {quote.status === 'pending_link' ? "Enviar Link Tarjeta" :
                                                        quote.status === 'converted' ? "Venta Realizada" :
                                                            quote.status === 'cancelled' ? "Cancelado" : "Esperando Pago"}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    {quote.status !== 'converted' && (
                                                        <button
                                                            onClick={() => updateStatus(quote.id, 'converted')}
                                                            className="w-full py-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border border-green-500/20"
                                                        >
                                                            Marcar Vendido
                                                        </button>
                                                    )}
                                                    {quote.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => updateStatus(quote.id, 'cancelled')}
                                                            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Main Info */}
                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="w-3 h-3 text-tech-700" />
                                                            <p className="text-[10px] text-tech-500 font-bold uppercase tracking-widest">{quote.quoteId}</p>
                                                        </div>
                                                        {latestQuoteId === quote.id && (
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-curiol-500/20 text-curiol-400 text-[8px] font-bold uppercase tracking-tighter rounded-full border border-curiol-500/30">
                                                                <Sparkles className="w-2.5 h-2.5" /> Última Solicitud
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-serif text-white italic">{quote.package}</h3>
                                                    <div className="flex items-center gap-2 text-tech-600 text-[10px]">
                                                        <Clock className="w-3 h-3" />
                                                        {quote.createdAt?.toDate().toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>

                                                <div className="bg-tech-900/40 p-5 rounded-2xl border border-white/5">
                                                    <p className="text-tech-700 text-[8px] uppercase font-bold tracking-widest mb-1">Inversión Propuesta</p>
                                                    <p className="text-2xl font-serif text-curiol-500 italic">
                                                        {quote.currency === "USD" ? "$" : "₡"}{quote.total.toLocaleString()}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3 p-2 bg-white/5 rounded-lg w-fit">
                                                        {quote.paymentMethod === 'card' ? <CreditCard className="w-4 h-4 text-tech-500" /> :
                                                            quote.paymentMethod === 'sinpe' ? <Smartphone className="w-4 h-4 text-tech-500" /> :
                                                                <Landmark className="w-4 h-4 text-tech-500" />}
                                                        <span className="text-[10px] text-tech-400 font-bold uppercase tracking-widest">
                                                            {quote.paymentMethod === 'card' ? "Tarjeta" : quote.paymentMethod === 'sinpe' ? "SINPE" : "Transferencia"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="p-4 bg-tech-950/50 rounded-xl border border-tech-800">
                                                        <p className="text-[9px] font-bold text-tech-700 uppercase tracking-widest mb-3">Desglose rápido</p>
                                                        <div className="space-y-2">
                                                            {quote.items?.slice(0, 3).map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center text-[10px]">
                                                                    <span className="text-tech-500 truncate max-w-[120px]">{item.name}</span>
                                                                    <span className="text-white/60 font-mono">
                                                                        {quote.currency === "USD" ? "$" : "₡"}{item.price.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0 flex items-center">
                                                <button className="p-4 text-tech-700 hover:text-white transition-all bg-tech-900/50 rounded-2xl border border-white/5 hover:border-curiol-500/20 translate-x-0 group-hover:translate-x-2">
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-32 text-center">
                                <FileText className="w-12 h-12 text-tech-800 mx-auto mb-6" />
                                <h3 className="text-xl font-serif text-tech-500 italic">No hay presupuestos que coincidan</h3>
                                <p className="text-tech-700 text-sm font-light mt-2">Prueba ajustando los filtros o el término de búsqueda.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
