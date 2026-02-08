"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import {
    LayoutDashboard, Users, Image as ImageIcon, MessageSquare,
    Plus, ExternalLink, Settings, BarChart3, LogOut, ArrowRight, Loader2, Sparkles,
    Calendar as CalendarIcon, Video, FileText
} from "lucide-react";

import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Check for Master PIN session first
        const isMaster = localStorage.getItem("master_admin") === "true";
        if (isMaster) {
            setUser({ email: "admin@curiol.studio", displayName: "Master Alberto" });
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin/login");
                return;
            }
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!user) return;

        // Entregas
        const qDeliveries = query(collection(db, "deliveries"), orderBy("createdAt", "desc"), limit(5));
        const unsubDeliveries = onSnapshot(qDeliveries, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentDeliveries(data);
        });

        // Leads
        const qLeads = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const unsubLeads = onSnapshot(qLeads, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLeads(data);
        });

        // Bookings
        const qBookings = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const unsubBookings = onSnapshot(qBookings, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(data);
        });

        // Quotes
        const qQuotes = query(collection(db, "quotes"), orderBy("createdAt", "desc"), limit(5));
        const unsubQuotes = onSnapshot(qQuotes, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuotes(data);
        });

        return () => { unsubDeliveries(); unsubLeads(); unsubBookings(); unsubQuotes(); };
    }, [user]);

    const exportLeads = () => {
        if (leads.length === 0) return alert("No hay leads para exportar");
        const headers = ["Nombre", "Email", "Teléfono", "Interés", "Fecha"];
        const csvContent = [
            headers.join(","),
            ...leads.map(l => `${l.name || ""},${l.email || ""},${l.phone || ""},${l.interest || ""},${l.date || ""}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Leads_Curiol_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const stats = [
        { label: "Entregas Totales", value: recentDeliveries.length.toString(), icon: ImageIcon, color: "text-curiol-500" },
        { label: "Leads Comunidad", value: leads.length.toString(), icon: Users, color: "text-tech-500" },
        { label: "Presupuestos", value: quotes.length.toString(), icon: FileText, color: "text-amber-500" }
    ];

    if (loading) return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-serif text-white italic mb-2">Gestión de Legado</h1>
                        <p className="text-tech-500 text-sm">Bienvenido, Maestro de Estrategia.</p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("master_admin");
                            localStorage.removeItem("admin_session_start");
                            auth.signOut();
                        }}
                        className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((s) => (
                        <GlassCard key={s.label} className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <s.icon className={`w-8 h-8 ${s.color}`} />
                                <BarChart3 className="w-4 h-4 text-tech-800" />
                            </div>
                            <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest mb-1">{s.label}</p>
                            <p className="text-4xl font-serif text-white italic">{s.value}</p>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Deliveries Management */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-white italic flex items-center gap-3">
                                <ImageIcon className="w-6 h-6 text-curiol-500" /> Entregas Recientes
                            </h3>
                            <Link
                                href="/admin/dashboard/new"
                                className="flex items-center gap-2 px-4 py-2 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-lg"
                            >
                                <Plus className="w-4 h-4" /> Nueva Entrega
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentDeliveries.map((delivery) => (
                                <div key={delivery.id} className="p-6 bg-tech-900/50 border border-tech-800 rounded-2xl flex items-center justify-between hover:border-curiol-500/30 transition-all group">
                                    <div>
                                        <p className="text-white font-serif text-lg italic">{delivery.name}</p>
                                        <p className="text-tech-500 text-xs">ID: {delivery.id} • {delivery.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded ${delivery.status === 'Entregado' ? 'bg-green-500/10 text-green-500' : 'bg-curiol-500/10 text-curiol-500'}`}>
                                            {delivery.status}
                                        </span>
                                        <a href={`/app/${delivery.id}`} target="_blank" className="p-2 text-tech-500 hover:text-white transition-all">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                        <button className="p-2 text-tech-500 hover:text-white transition-all">
                                            <Settings className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-serif text-white italic flex items-center gap-3">
                            <LayoutDashboard className="w-6 h-6 text-tech-500" /> Herramientas Rápidas
                        </h3>

                        <GlassCard className="p-8 border-curiol-500/30 bg-curiol-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Video className="w-16 h-16 text-curiol-500" />
                            </div>
                            <div className="relative z-10">
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Acceso Prioritario</span>
                                <h4 className="text-2xl font-serif text-white italic mb-4">Meet Admin Center</h4>
                                <p className="text-tech-500 text-xs font-light mb-8 leading-relaxed">
                                    Inicia o únete a videollamadas de pre-producción al instante con cifrado de grado militar.
                                </p>
                                <button
                                    onClick={() => router.push("/admin/videollamadas")}
                                    className="w-full py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-curiol-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <Video className="w-4 h-4" /> Entrar al Centro de Control
                                </button>
                            </div>
                        </GlassCard>

                        <div className="grid grid-cols-1 gap-4">
                            <button className="w-full text-left p-6 bg-tech-900 border border-tech-800 rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <MessageSquare className="w-6 h-6 text-tech-500" />
                                    <div>
                                        <p className="text-white font-bold text-sm">Gestionar Blog</p>
                                        <p className="text-tech-500 text-[10px] uppercase tracking-widest">3 posts pendientes</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-tech-800 group-hover:text-white transition-all" />
                            </button>
                            <button
                                onClick={() => router.push("/admin/cotizador")}
                                className="w-full text-left p-6 bg-tech-900 border border-tech-800 rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <BarChart3 className="w-6 h-6 text-curiol-500" />
                                    <div>
                                        <p className="text-white font-bold text-sm">Cotizador Formal</p>
                                        <p className="text-tech-500 text-[10px] uppercase tracking-widest">Generar Contratos PDF</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-tech-800 group-hover:text-white transition-all" />
                            </button>
                            <button
                                onClick={() => router.push("/admin/academy")}
                                className="w-full text-left p-6 bg-tech-900 border border-tech-800 rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <Sparkles className="w-6 h-6 text-curiol-500" />
                                    <div>
                                        <p className="text-white font-bold text-sm">Gestionar Academy</p>
                                        <p className="text-tech-500 text-[10px] uppercase tracking-widest">Lecciones y Videos Veo</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-tech-800 group-hover:text-white transition-all" />
                            </button>
                            <button
                                onClick={() => router.push("/admin/portafolio")}
                                className="w-full text-left p-6 bg-tech-900 border border-tech-800 rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <ImageIcon className="w-6 h-6 text-purple-500" />
                                    <div>
                                        <p className="text-white font-bold text-sm">Gestionar Portafolio</p>
                                        <p className="text-tech-500 text-[10px] uppercase tracking-widest">Álbumnes y Fotos IA</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-tech-800 group-hover:text-white transition-all" />
                            </button>
                            <button
                                onClick={() => router.push("/admin/presupuestos")}
                                className="w-full text-left p-6 bg-tech-900 border border-tech-800 rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <FileText className="w-6 h-6 text-amber-500" />
                                    <div>
                                        <p className="text-white font-bold text-sm">Gestionar Presupuestos</p>
                                        <p className="text-tech-500 text-[10px] uppercase tracking-widest">{quotes.filter((q: any) => q.status === 'pending_link').length} pendientes de link</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-tech-800 group-hover:text-white transition-all" />
                            </button>
                            <button
                                onClick={exportLeads}
                                className="w-full text-left p-6 bg-tech-900 border border-tech-800 rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <Users className="w-6 h-6 text-tech-500" />
                                    <div>
                                        <p className="text-white font-bold text-sm">Exportar Leads</p>
                                        <p className="text-tech-500 text-[10px] uppercase tracking-widest">CSV / Google Sheets</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-tech-800 group-hover:text-white transition-all" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
