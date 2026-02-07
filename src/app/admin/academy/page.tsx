"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Plus, Save, Trash2, Edit3,
    BookOpen, Video, Sparkles,
    ChevronRight, Layout, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, Timestamp, orderBy } from "firebase/firestore";

interface AcademyContent {
    id: string;
    title: string;
    description: string;
    type: "video" | "lesson";
    category: "Realidad Aumentada" | "OmniTech" | "IA Strategist";
    videoUrl?: string; // Para videos de Google Veo
    isPublished: boolean;
    createdAt: any;
}

export default function AcademyManagerPage() {
    const [contents, setContents] = useState<AcademyContent[]>([]);
    const [isEditing, setIsEditing] = useState<AcademyContent | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "academy_content"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AcademyContent[];
            setContents(data);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing?.id) {
                await updateDoc(doc(db, "academy_content", isEditing.id), { ...isEditing });
            } else {
                await addDoc(collection(db, "academy_content"), {
                    ...isEditing,
                    createdAt: Timestamp.now()
                });
            }
            setIsEditing(null);
        } catch (error) {
            console.error("Error saving academy content:", error);
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
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-curiol-500 w-4 h-4" />
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Contenido Educativo</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Academy Manager</h1>
                        <p className="text-tech-500 mt-4">Gestiona lecciones y demostraciones de Google Veo para Curiol Academy.</p>
                    </div>
                    <button
                        onClick={() => setIsEditing({
                            id: "", title: "", description: "", type: "video",
                            category: "Realidad Aumentada", isPublished: true, createdAt: null
                        })}
                        className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Contenido
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Lista de Contenidos */}
                    <div className="lg:col-span-12 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contents.map((item) => (
                                <GlassCard key={item.id} className="p-6 group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-tech-900 rounded-xl border border-white/5">
                                            {item.type === 'video' ? <Video className="w-5 h-5 text-curiol-500" /> : <BookOpen className="w-5 h-5 text-tech-500" />}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsEditing(item)} className="p-2 text-tech-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-tech-700 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-curiol-500/60 block mb-2">{item.category}</span>
                                    <h3 className="text-xl font-serif text-white italic mb-4 leading-tight">{item.title}</h3>
                                    <p className="text-xs text-tech-500 font-light line-clamp-2 mb-6">{item.description}</p>
                                    {!item.isPublished && (
                                        <span className="absolute top-4 right-12 text-[8px] font-bold uppercase tracking-widest bg-tech-800 text-tech-500 px-2 py-1 rounded">Borrador</span>
                                    )}
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal de Edición */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-tech-950/90 backdrop-blur-md"
                            onClick={() => setIsEditing(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-tech-900 border border-white/5 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSave} className="p-10 space-y-6">
                                <h3 className="text-2xl font-serif text-white italic mb-8">
                                    {isEditing.id ? "Editar Contenido" : "Crear Nuevo Contenido"}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Título de la Lección</label>
                                        <input
                                            required
                                            value={isEditing.title}
                                            onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })}
                                            className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Tipo</label>
                                            <select
                                                value={isEditing.type}
                                                onChange={(e) => setIsEditing({ ...isEditing, type: e.target.value as any })}
                                                className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none"
                                            >
                                                <option value="video">Video (Google Veo)</option>
                                                <option value="lesson">Micro-Lección</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Categoría</label>
                                            <select
                                                value={isEditing.category}
                                                onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value as any })}
                                                className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none"
                                            >
                                                <option value="Realidad Aumentada">Realidad Aumentada</option>
                                                <option value="OmniTech">OmniTech</option>
                                                <option value="IA Strategist">IA Strategist</option>
                                            </select>
                                        </div>
                                    </div>
                                    {isEditing.type === 'video' && (
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">URL del Video / ID</label>
                                            <input
                                                value={isEditing.videoUrl}
                                                onChange={(e) => setIsEditing({ ...isEditing, videoUrl: e.target.value })}
                                                className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Descripción / Contenido</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={isEditing.description}
                                            onChange={(e) => setIsEditing({ ...isEditing, description: e.target.value })}
                                            className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 resize-none font-light"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="publish"
                                            checked={isEditing.isPublished}
                                            onChange={(e) => setIsEditing({ ...isEditing, isPublished: e.target.checked })}
                                            className="accent-curiol-500"
                                        />
                                        <label htmlFor="publish" className="text-tech-500 text-[10px] font-bold uppercase tracking-widest cursor-pointer">Publicar inmediatamente</label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-grow py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3"
                                    >
                                        <Save className="w-4 h-4" /> {loading ? "Guardando..." : "Guardar Contenido"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(null)}
                                        className="px-8 py-4 bg-tech-800 text-tech-400 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
