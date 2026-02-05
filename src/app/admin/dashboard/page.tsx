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
    Plus, ExternalLink, Settings, BarChart3, LogOut, ArrowRight, Loader2
} from "lucide-react";

import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
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

        const q = query(collection(db, "deliveries"), orderBy("createdAt", "desc"), limit(5));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentDeliveries(data);
            },
            (error) => {
                console.error("Firestore Subscription Error:", error);
                // Fail gracefully: try without ordering if index is missing
                const simpleQ = query(collection(db, "deliveries"), limit(5));
                onSnapshot(simpleQ, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setRecentDeliveries(data);
                });
            }
        );

        return () => unsubscribe();
    }, [user]);

    const stats = [
        { label: "Entregas Totales", value: recentDeliveries.length.toString(), icon: ImageIcon, color: "text-curiol-500" },
        { label: "Leads Comunidad", value: "48", icon: Users, color: "text-tech-500" },
        { label: "Visitas Hoy", value: "124", icon: BarChart3, color: "text-green-500" }
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
                        onClick={() => auth.signOut()}
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
                            <button className="w-full text-left p-6 bg-tech-900 border border-tech-800 rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-between group">
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
