"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Plus, Save, Trash2, Edit3,
    Image as ImageIcon, Upload, X,
    ChevronRight, Folder, Camera, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AiCompositionEditor } from "@/components/admin/AiCompositionEditor";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, Timestamp, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

interface Album {
    id: string;
    title: string;
    description: string;
    category: "Legado Familiar" | "Soluciones Comerciales" | "Arte Fine Art";
    coverUrl?: string;
    photos: { url: string; id: string }[];
    createdAt: any;
}

export default function PortfolioAdminPage() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [isEditing, setIsEditing] = useState<Partial<Album> | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiEditingPhoto, setAiEditingPhoto] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "portfolio_albums"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Album[];
            setAlbums(data);
        });
        return () => unsubscribe();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !isEditing) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            const newPhoto = { url, id: Date.now().toString() };
            setIsEditing({
                ...isEditing,
                photos: [...(isEditing.photos || []), newPhoto],
                coverUrl: isEditing.coverUrl || url
            });
        } catch (error) {
            console.error("Error uploading file:", error);
        }
        setUploading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing?.id) {
                await updateDoc(doc(db, "portfolio_albums", isEditing.id), { ...isEditing });
            } else {
                await addDoc(collection(db, "portfolio_albums"), {
                    ...isEditing,
                    createdAt: Timestamp.now()
                });
            }
            setIsEditing(null);
        } catch (error) {
            console.error("Error saving album:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (album: Album) => {
        if (!confirm("¿Seguro que deseas eliminar este álbum?")) return;
        try {
            await deleteDoc(doc(db, "portfolio_albums", album.id));
        } catch (error) {
            console.error("Error deleting album:", error);
        }
    };

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 w-full">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Camera className="text-curiol-500 w-4 h-4" />
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Gestión Visual</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Publicación de Álbumnes</h1>
                        <p className="text-tech-500 mt-4">Crea y organiza galerías fotográficas para el portafolio 2026.</p>
                    </div>
                    <button
                        onClick={() => setIsEditing({ title: "", description: "", category: "Legado Familiar", photos: [] })}
                        className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Álbum
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums.map((album) => (
                        <GlassCard key={album.id} className="p-0 overflow-hidden group">
                            <div className="aspect-[4/3] bg-tech-900 relative">
                                {album.coverUrl ? (
                                    <img src={album.coverUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={album.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-tech-800">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => setIsEditing(album)} className="p-2 bg-tech-950/80 backdrop-blur-md rounded-lg text-white hover:text-curiol-500 transition-all"><Edit3 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(album)} className="p-2 bg-tech-950/80 backdrop-blur-md rounded-lg text-white hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="p-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-curiol-500/60 block mb-2">{album.category}</span>
                                <h3 className="text-xl font-serif text-white italic mb-2">{album.title}</h3>
                                <p className="text-xs text-tech-500 font-light mb-4">{album.photos.length} Fotos</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </main>

            {/* Modal Editor */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-tech-950/90 backdrop-blur-md" onClick={() => setIsEditing(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-tech-900 border border-white/5 w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                            <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto">
                                <h3 className="text-2xl font-serif text-white italic">Gestionar Álbum</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Título del Álbum</label>
                                            <input required value={isEditing.title} onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Categoría</label>
                                            <select value={isEditing.category} onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value as any })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none">
                                                <option value="Legado Familiar">Legado Familiar</option>
                                                <option value="Soluciones Comerciales">Soluciones Comerciales</option>
                                                <option value="Arte Fine Art">Arte Fine Art</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Descripción</label>
                                            <textarea rows={3} value={isEditing.description} onChange={(e) => setIsEditing({ ...isEditing, description: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 resize-none font-light" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Fotos del Álbum</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {isEditing.photos?.map((p, idx) => (
                                                <div key={idx} className="aspect-square bg-tech-950 rounded-lg relative overflow-hidden group">
                                                    <img src={p.url} className="w-full h-full object-cover" alt="" />
                                                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            onClick={() => setAiEditingPhoto(p.url)}
                                                            className="p-1.5 bg-curiol-500 rounded text-white hover:scale-110 transition-all"
                                                            title="Exportar con IA"
                                                        >
                                                            <Sparkles className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditing({ ...isEditing, photos: isEditing.photos?.filter((_, i) => i !== idx) })}
                                                            className="p-1.5 bg-red-500 rounded text-white hover:scale-110 transition-all"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <label className="aspect-square bg-tech-950 border-2 border-dashed border-tech-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-curiol-500/50 transition-all">
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                                {uploading ? (
                                                    <div className="animate-spin text-curiol-500"><Plus className="w-6 h-6" /></div>
                                                ) : (
                                                    <>
                                                        <Plus className="w-6 h-6 text-tech-700" />
                                                        <span className="text-[8px] text-tech-700 font-bold uppercase mt-1">Subir</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8">
                                    <button type="submit" disabled={loading} className="flex-grow py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3">
                                        <Save className="w-4 h-4" /> {loading ? "Guardando..." : "Guardar Álbum"}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(null)} className="px-8 py-4 bg-tech-800 text-tech-400 text-[10px] font-bold uppercase tracking-widest rounded-xl">Cancelar</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {aiEditingPhoto && (
                    <AiCompositionEditor
                        imageUrl={aiEditingPhoto}
                        onClose={() => setAiEditingPhoto(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
