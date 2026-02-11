"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Plus, Save, Trash2, Edit3,
    BookOpen, Video, Sparkles,
    ChevronRight, Layout, Globe, MessageSquare, Share2, FileText, CheckCircle, Clock, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, Timestamp, orderBy } from "firebase/firestore";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AcademyContent {
    id: string;
    title: string;
    description: string;
    type: "video" | "lesson" | "podcast";
    category: string;
    track?: "legacy" | "tech";
    isRestricted?: boolean;
    videoUrl?: string;
    body?: string;
    infographicHighlight?: string;
    mediaScript?: string;
    visualConcept?: string;
    isPublished: boolean;
    createdAt: any;
    commentsCount?: number;
    sharesCount?: number;
}

export default function AcademyManagerPage() {
    const { role } = useRole();
    const router = useRouter();
    const [contents, setContents] = useState<AcademyContent[]>([]);
    const [isEditing, setIsEditing] = useState<AcademyContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"content" | "planner">("content");

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    useEffect(() => {
        const q = query(collection(db, "academy_content"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AcademyContent[];
            setContents(data);
        });
        return () => unsubscribe();
    }, []);

    if (role === "LOADING") return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    if (role === "UNAUTHORIZED") return null;

    const lastContentDate = contents.length > 0
        ? new Date(Math.max(...contents.map(c => c.createdAt?.toDate().getTime() || 0)))
        : new Date();

    const nextGenerationDate = new Date(lastContentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const daysUntilNext = Math.ceil((nextGenerationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) return;
        setLoading(true);
        try {
            if (isEditing.id) {
                const { id, ...data } = isEditing;
                await updateDoc(doc(db, "academy_content", id), data);
            } else {
                const { id, ...data } = isEditing;
                await addDoc(collection(db, "academy_content"), {
                    ...data,
                    createdAt: Timestamp.now(),
                    commentsCount: 0,
                    sharesCount: 0,
                    track: isEditing.track || "tech", // Default to tech if not set
                    isRestricted: isEditing.isRestricted || false // Default to false if not set
                });
            }
            setIsEditing(null);
        } catch (error) {
            console.error("Error saving content:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este contenido?")) return;
        try {
            await deleteDoc(doc(db, "academy_content", id));
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    };

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 w-full">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-curiol-500 w-4 h-4" />
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Educación & Innovación</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Aprendiendo de nuevas tendencias</h1>
                        <p className="text-tech-500 mt-4 max-w-2xl">Administra lecciones unificadas y materiales estratégicos. Ciclo de 7 días activado.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-tech-900 p-1 rounded-xl border border-white/5 flex">
                            <button onClick={() => setActiveTab("content")} className={`px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-tech-800 text-white shadow-lg' : 'text-tech-500 hover:text-white'}`}>Contenido</button>
                            <button onClick={() => setActiveTab("planner")} className={`px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'planner' ? 'bg-tech-800 text-white shadow-lg' : 'text-tech-500 hover:text-white'}`}>Generación IA</button>
                        </div>
                        <button
                            onClick={() => setIsEditing({ id: "", title: "", description: "", type: "video", category: "IA", isPublished: true, createdAt: null, track: "tech", isRestricted: false })}
                            className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <Plus className="w-4 h-4" /> Nuevo Contenido
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'content' ? (
                        <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {contents.map((item) => (
                                    <GlassCard key={item.id} className="p-6 group relative overflow-hidden">
                                        {item.isRestricted && (
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-curiol-500 rounded text-[8px] font-bold text-white uppercase tracking-widest z-20">Premium {item.track === 'legacy' ? 'Legacy' : 'Tech'}</div>
                                        )}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-tech-900 rounded-xl text-curiol-500">
                                                {item.type === "video" ? <Video className="w-6 h-6" /> : item.type === "podcast" ? <MessageSquare className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setIsEditing(item)} className="p-2 text-tech-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-tech-500 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-serif text-white italic mb-2">{item.title}</h3>
                                        <p className="text-xs text-tech-500 font-light mb-6 line-clamp-2">{item.description}</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-curiol-500/60">{item.category}</span>
                                            <div className="flex gap-3 text-tech-600">
                                                <div className="flex items-center gap-1 text-[8px] font-bold uppercase"><MessageSquare className="w-3 h-3" /> {item.commentsCount || 0}</div>
                                                <div className="flex items-center gap-1 text-[8px] font-bold uppercase"><Share2 className="w-3 h-3" /> {item.sharesCount || 0}</div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="planner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <GlassCard className="lg:col-span-1 p-8 border-curiol-500/20 bg-curiol-500/5">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-tech-950 rounded-2xl border border-curiol-500/30 flex items-center justify-center mb-6">
                                            <Clock className="w-6 h-6 text-curiol-500" />
                                        </div>
                                        <h2 className="text-2xl font-serif text-white italic mb-4">Ciclo de 7 Días</h2>

                                        <div className="space-y-6 w-full">
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={async () => {
                                                        setLoading(true);
                                                        const { generateAcademyBatch } = await import("@/actions/gemini");
                                                        const batch = await generateAcademyBatch("legacy");
                                                        if (!batch.error) {
                                                            if (confirm("He generado 4 lecciones de Legado Familiar. ¿Programar ahora?")) {
                                                                for (let i = 0; i < batch.length; i++) {
                                                                    const lesson = batch[i];
                                                                    const publishDate = new Date();
                                                                    publishDate.setDate(publishDate.getDate() + (i * 7));
                                                                    await addDoc(collection(db, "academy_content"), {
                                                                        ...lesson,
                                                                        track: "legacy",
                                                                        isRestricted: true,
                                                                        createdAt: Timestamp.fromDate(publishDate),
                                                                        isPublished: true,
                                                                        commentsCount: 0,
                                                                        sharesCount: 0
                                                                    });
                                                                }
                                                                alert("Batch Legado programado.");
                                                            }
                                                        }
                                                        setLoading(false);
                                                    }}
                                                    disabled={loading}
                                                    className="py-4 bg-curiol-500/10 border border-curiol-500/20 text-curiol-500 text-[8px] font-bold uppercase tracking-widest rounded-xl hover:bg-curiol-500 hover:text-white transition-all"
                                                >
                                                    Generar Legado
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        setLoading(true);
                                                        const { generateAcademyBatch } = await import("@/actions/gemini");
                                                        const batch = await generateAcademyBatch("tech");
                                                        if (!batch.error) {
                                                            if (confirm("He generado 4 lecciones Tecnológicas. ¿Programar ahora?")) {
                                                                for (let i = 0; i < batch.length; i++) {
                                                                    const lesson = batch[i];
                                                                    const publishDate = new Date();
                                                                    publishDate.setDate(publishDate.getDate() + (i * 7));
                                                                    await addDoc(collection(db, "academy_content"), {
                                                                        ...lesson,
                                                                        track: "tech",
                                                                        isRestricted: true,
                                                                        createdAt: Timestamp.fromDate(publishDate),
                                                                        isPublished: true,
                                                                        commentsCount: 0,
                                                                        sharesCount: 0
                                                                    });
                                                                }
                                                                alert("Batch Tech programado.");
                                                            }
                                                        }
                                                        setLoading(false);
                                                    }}
                                                    disabled={loading}
                                                    className="py-4 bg-tech-500/10 border border-tech-500/20 text-tech-400 text-[8px] font-bold uppercase tracking-widest rounded-xl hover:bg-tech-500 hover:text-white transition-all"
                                                >
                                                    Generar Tech
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>

                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-xl font-serif text-white italic px-4">Calendario de Publicaciones</h3>
                                    <div className="space-y-4">
                                        {contents.filter(c => c.createdAt?.toDate().getTime() > Date.now()).map((item) => (
                                            <div key={item.id} className="p-6 bg-tech-900/50 rounded-3xl border border-white/5 flex items-center justify-between group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-xl bg-tech-950 flex items-center justify-center text-tech-700">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-serif text-lg italic leading-tight">{item.title}</h4>
                                                        <p className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest mt-1">Programado: {item.createdAt?.toDate().toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDelete(item.id)} className="p-3 text-tech-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {contents.filter(c => c.createdAt?.toDate().getTime() > Date.now()).length === 0 && (
                                            <div className="p-12 text-center bg-tech-900/20 rounded-3xl border border-white/5 border-dashed">
                                                <p className="text-tech-500 text-sm font-light italic">No hay publicaciones programadas para el futuro.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modal de Edición */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-tech-950/90 backdrop-blur-md" onClick={() => setIsEditing(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-tech-900 border border-white/5 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                            <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto max-h-[90vh]">
                                <h3 className="text-2xl font-serif text-white italic">Gestionar Contenido</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Título</label>
                                        <input required value={isEditing.title} onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Track</label>
                                            <select value={isEditing.track || "tech"} onChange={(e) => setIsEditing({ ...isEditing, track: e.target.value as any })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none">
                                                <option value="tech">Tecnología</option>
                                                <option value="legacy">Legado Familiar</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Acceso</label>
                                            <select value={isEditing.isRestricted ? "true" : "false"} onChange={(e) => setIsEditing({ ...isEditing, isRestricted: e.target.value === "true" })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none">
                                                <option value="false">Libre</option>
                                                <option value="true">Restringido (Premium)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Tipo</label>
                                            <select value={isEditing.type} onChange={(e) => setIsEditing({ ...isEditing, type: e.target.value as any })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none">
                                                <option value="video">Video</option>
                                                <option value="lesson">Lección</option>
                                                <option value="podcast">Podcast</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Categoría</label>
                                            <input value={isEditing.category} onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Descripción</label>
                                        <textarea rows={2} value={isEditing.description} onChange={(e) => setIsEditing({ ...isEditing, description: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 resize-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Cuerpo / Guion</label>
                                        <textarea rows={8} value={isEditing.body || isEditing.mediaScript || ""} onChange={(e) => setIsEditing({ ...isEditing, body: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 resize-none" />
                                    </div>
                                    {isEditing.type === 'video' && (
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">URL del Video</label>
                                            <input value={isEditing.videoUrl} onChange={(e) => setIsEditing({ ...isEditing, videoUrl: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500" placeholder="https://youtube.com/..." />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-8">
                                    <button type="submit" disabled={loading} className="flex-grow py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3">
                                        <Save className="w-4 h-4" /> {loading ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(null)} className="px-8 py-4 bg-tech-800 text-tech-400 text-[10px] font-bold uppercase tracking-widest rounded-xl">Cancelar</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
