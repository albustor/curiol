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
    LayoutDashboard, Users, Image as ImageIcon, MessageSquare, Mail,
    Plus, ExternalLink, Settings, BarChart3, LogOut, ArrowRight, Loader2, Sparkles,
    Calendar as CalendarIcon, Video, FileText, Brain, Aperture, CheckCircle2, AlertCircle, PieChart, ClipboardCheck,
    HardDrive, ArrowUpRight, ShieldCheck, BookOpen, Youtube
} from "lucide-react";
import { getPhotographyDashboardData, PhotographyInsight, analyzeAlbumComposition } from "@/actions/photography-ai";

import { collection, query, orderBy, limit, onSnapshot, where, getDocs, Timestamp } from "firebase/firestore";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import { CommandK } from "@/components/admin/CommandK";

export default function AdminDashboard() {
    const { role, user, isMaster, isTeam } = useRole();
    const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [interactionCount, setInteractionCount] = useState<number | string>("...");
    const [photographyInsight, setPhotographyInsight] = useState<PhotographyInsight | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [youtubeAuthUrl, setYoutubeAuthUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

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

        // Albums (New System)
        const qAlbums = query(collection(db, "albums"), orderBy("createdAt", "desc"), limit(5));
        const unsubAlbums = onSnapshot(qAlbums, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAlbums(data);
        });

        // Interactions (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const qInteractions = query(collection(db, "interactions"), where("timestamp", ">=", Timestamp.fromDate(thirtyDaysAgo)));
        getDocs(qInteractions).then(snap => setInteractionCount(snap.size)).catch(() => setInteractionCount(0));

        // Photography Insights
        getPhotographyDashboardData(1).then(data => {
            if (data.length > 0) setPhotographyInsight(data[0]);
        });

        return () => {
            unsubDeliveries();
            unsubLeads();
            unsubBookings();
            unsubQuotes();
            unsubAlbums();
        };
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
        { label: "Galerías Activas", value: albums.length.toString(), icon: ImageIcon, color: "text-curiol-500", visible: true },
        { label: "Interacciones", value: interactionCount.toString(), icon: BarChart3, color: "text-tech-500", visible: true },
        { label: "Presupuestos", value: quotes.length.toString(), icon: FileText, color: "text-amber-500", visible: isMaster }
    ];

    if (role === "LOADING") return (
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
                        <p className="text-tech-500 text-sm">
                            {isMaster ? "Bienvenido, Maestro de Estrategia." : `Bienvenido, Coordinador de Calidad (${user?.displayName || "Curiol Team"}).`}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <CommandK isMaster={isMaster} />
                        {isMaster && (
                            <button
                                onClick={async () => {
                                    const { getGoogleAuthUrl } = await import('@/lib/google-auth');
                                    window.location.href = getGoogleAuthUrl();
                                }}
                                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest"
                            >
                                <Youtube className="w-4 h-4" /> Conectar YouTube
                            </button>
                        )}
                        {isMaster && (
                            <Link
                                href="/admin/equilibrio"
                                className="flex items-center gap-2 p-3 bg-curiol-500/10 border border-curiol-500/20 text-curiol-500 hover:bg-curiol-500 hover:text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest"
                            >
                                <PieChart className="w-4 h-4" /> Equilibrio
                            </Link>
                        )}
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
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.filter(s => s.visible).map((s) => (
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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Recent Production & Intelligence */}
                    <div className="lg:col-span-3 space-y-12">
                        {/* Producción Actual Section */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-center bg-tech-900/30 p-4 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-serif text-white italic flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-curiol-500" /> Producción: Galerías Premium V2
                                </h3>
                                <Link
                                    href="/admin/albums/new"
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-2 bg-curiol-gradient text-white text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded-lg"
                                >
                                    <Plus className="w-3 h-3" /> Nuevo Pro Studio
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {albums.map((album) => (
                                    <div key={album.id} className="p-4 bg-tech-900 border border-white/5 rounded-2xl flex items-center justify-between hover:border-curiol-500/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-tech-950 rounded-lg overflow-hidden border border-white/5 shrink-0">
                                                {album.images?.[0]?.original && <img src={album.images[0].original} className="w-full h-full object-cover opacity-60" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-white font-serif text-base italic truncate">{album.name}</p>
                                                <p className="text-tech-600 text-[9px] uppercase font-bold tracking-widest">{album.clientName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => router.push("/admin/albums")}
                                                className="p-2 text-tech-500 hover:text-white transition-all"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <a href={`/album/${album.id}`} target="_blank" className="p-2 bg-curiol-500/10 text-curiol-500 rounded-lg hover:bg-curiol-500 hover:text-white transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Intelligence Section (Photography AI) */}
                        <section className="space-y-6">
                            <div className="bg-tech-900/30 p-4 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-serif text-white italic flex items-center gap-3">
                                    <Aperture className="w-5 h-5 text-curiol-500" /> Inteligencia del Legado (IA)
                                </h3>
                            </div>

                            {photographyInsight ? (
                                <GlassCard className="p-8 border-curiol-500/20 bg-tech-900/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Salud del Legado</p>
                                            <div className="flex gap-4 items-end mb-8">
                                                <div className="text-center">
                                                    <p className="text-3xl font-serif text-white italic mb-1">{photographyInsight.technicalScore}%</p>
                                                    <p className="text-[8px] text-tech-600 uppercase font-bold tracking-widest">Técnico</p>
                                                </div>
                                                <div className="w-px h-10 bg-white/10" />
                                                <div className="text-center">
                                                    <p className="text-3xl font-serif text-white italic mb-1">{photographyInsight.creativityScore}%</p>
                                                    <p className="text-[8px] text-tech-600 uppercase font-bold tracking-widest">Creatividad</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Brain className="w-4 h-4 text-curiol-500" />
                                                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Patrones Detectados:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {photographyInsight.detectedPatterns.map(p => (
                                                        <span key={p} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] text-tech-400 font-bold">{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-tech-950/50 rounded-2xl p-6 border border-white/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Sparkles className="w-4 h-4 text-amber-500" />
                                                <p className="text-[10px] text-white font-bold uppercase tracking-widest">Consejo del Maestro</p>
                                            </div>
                                            <p className="text-xs text-tech-400 italic leading-relaxed mb-6 font-serif">
                                                "{photographyInsight.maestroAdvice}"
                                            </p>

                                            <div className="space-y-3">
                                                {photographyInsight.positives.slice(0, 2).map(p => (
                                                    <div key={p} className="flex items-start gap-2 text-[9px] text-green-500">
                                                        <CheckCircle2 className="w-3 h-3 mt-0.5" />
                                                        <span>{p}</span>
                                                    </div>
                                                ))}
                                                {photographyInsight.negatives.slice(0, 1).map(n => (
                                                    <div key={n} className="flex items-start gap-2 text-[9px] text-red-400">
                                                        <AlertCircle className="w-3 h-3 mt-0.5" />
                                                        <span>{n}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[9px]">
                                        <p className="text-tech-600">Álbum Analizado: <span className="text-white italic">{photographyInsight.albumName}</span></p>
                                        <button
                                            onClick={async () => {
                                                if (!albums[0]?.id) return;
                                                setIsAnalyzing(true);
                                                await analyzeAlbumComposition(albums[0].id);
                                                const data = await getPhotographyDashboardData(1);
                                                if (data.length > 0) setPhotographyInsight(data[0]);
                                                setIsAnalyzing(false);
                                            }}
                                            disabled={isAnalyzing}
                                            className="text-curiol-500 hover:text-white uppercase font-bold tracking-widest transition-all flex items-center gap-2"
                                        >
                                            {isAnalyzing ? "Analizando..." : "Re-analizar"} <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </GlassCard>
                            ) : (
                                <GlassCard className="p-12 text-center border-dashed border-white/10">
                                    <Brain className="w-12 h-12 text-tech-800 mx-auto mb-4" />
                                    <p className="text-tech-500 text-sm italic">Sin análisis previo.</p>
                                </GlassCard>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Ecosistemas / Tools Categories */}
                    <div className="lg:col-span-1 space-y-10">
                        {/* Ecosistema Creativo */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-tech-500 px-2 flex items-center gap-2">
                                <Aperture className="w-3 h-3" /> Ecosistema Creativo
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => router.push("/admin/portafolio")}
                                    className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-purple-500/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <ImageIcon className="w-5 h-5 text-purple-500" />
                                        <span className="text-xs font-bold text-white">Portafolio</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                </button>
                                <button
                                    onClick={() => router.push("/admin/insumos")}
                                    className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Brain className="w-5 h-5 text-curiol-500" />
                                        <span className="text-xs font-bold text-white">Insumos IA</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                </button>
                                <button
                                    onClick={() => router.push("/admin/timeline")}
                                    className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-curiol-500" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white">Línea de Tiempo</span>
                                            <span className="text-[10px] text-tech-600 font-bold uppercase">Legacy Phygital</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                </button>
                                <button
                                    className="w-full text-left p-4 bg-tech-900/50 border border-white/5 rounded-xl opacity-40 flex items-center justify-between cursor-not-allowed grayscale"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-tech-500" />
                                        <span className="text-xs font-bold text-white">Blog</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-tech-800" />
                                </button>
                            </div>
                        </div>

                        {/* Gestión Comercial - ONLY FOR MASTER */}
                        {isMaster && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-tech-500 px-2 flex items-center gap-2">
                                    <BarChart3 className="w-3 h-3" /> Gestión Comercial
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => router.push("/admin/analytics")}
                                        className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <BarChart3 className="w-5 h-5 text-curiol-500" />
                                            <span className="text-xs font-bold text-white">Analítica</span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                    </button>
                                    <button
                                        onClick={() => router.push("/admin/presupuestos")}
                                        className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-amber-500/30 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-amber-500" />
                                            <span className="text-xs font-bold text-white">Presupuestos</span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                    </button>
                                    <button
                                        onClick={() => router.push("/admin/cotizador")}
                                        className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-curiol-500" />
                                            <span className="text-xs font-bold text-white">Cotizador</span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                    </button>
                                    <button
                                        onClick={exportLeads}
                                        className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-tech-500 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-tech-500" />
                                            <span className="text-xs font-bold text-white">Exportar Leads</span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Ecosistema Workspace - NEW */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-tech-500 px-2 flex items-center gap-2">
                                <HardDrive className="w-3 h-3" /> Ecosistema Workspace
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => router.push("/admin/workspace/drive")}
                                    className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <HardDrive className="w-5 h-5 text-blue-500" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white">Google Drive</span>
                                            <span className="text-[10px] text-tech-600">Producciones & Media</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                </button>
                                <button
                                    onClick={() => router.push("/admin/videollamadas")}
                                    className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Video className="w-5 h-5 text-green-500" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white">Curiol Meet</span>
                                            <span className="text-[10px] text-tech-600">Videollamadas Clientes</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                </button>
                            </div>
                        </div>

                        {/* Estrategia & Procesos - MASTER ONLY */}
                        {isMaster && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-tech-500 px-2 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" /> Estrategia & Procesos
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => router.push("/admin/documentacion")}
                                        className="w-full text-left p-4 bg-curiol-500/10 border border-curiol-500/30 rounded-xl hover:bg-curiol-500/20 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-5 h-5 text-curiol-500" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">Documentación Maestra</span>
                                                <span className="text-[10px] text-tech-500 font-bold">Protocolos & Estrategia</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-curiol-500 group-hover:text-white transition-all" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Operaciones & Calidad */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-tech-500 px-2 flex items-center gap-2">
                                <Settings className="w-3 h-3" /> Operaciones & Calidad
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => router.push("/admin/email-manager")}
                                    className="w-full text-left p-4 bg-curiol-500/5 border border-curiol-500/20 rounded-xl hover:bg-curiol-500/10 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-curiol-500" />
                                        <span className="text-xs font-bold text-white">Email Manager</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-curiol-500 group-hover:text-white transition-all" />
                                </button>
                                <button
                                    onClick={() => router.push("/admin/qa-logs")}
                                    className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="w-5 h-5 text-curiol-500" />
                                        <span className="text-xs font-bold text-white">QA Logs</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                </button>
                                <button
                                    onClick={() => router.push("/admin/academy")}
                                    className="w-full text-left p-4 bg-tech-900 border border-white/5 rounded-xl hover:border-curiol-500/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-curiol-500" />
                                        <span className="text-xs font-bold text-white">Academy</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-tech-800 group-hover:text-white transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
