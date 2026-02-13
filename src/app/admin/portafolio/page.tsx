"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Plus, Save, Trash2, Edit3,
    Image as ImageIcon, Upload, X,
    ChevronRight, Folder, Camera, Sparkles,
    Settings, Share2, Heart, Calendar, Link as LinkIcon,
    ChevronLeft, Download
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AiCompositionEditor } from "@/components/admin/AiCompositionEditor";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, Timestamp, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CommandK } from "@/components/admin/CommandK";

interface Album {
    id: string;
    title: string;
    description: string;
    category: string;
    coverUrl?: string;
    photos: { url: string; id: string; caption?: string }[];
    createdAt: any;
    eventDate?: string;
    slug?: string;
    password?: string;
    settings?: {
        allowLikes: boolean;
        allowDownloads: boolean;
        allowSharing: boolean;
    };
}

export default function PortfolioAdminPage() {
    const { role } = useRole();
    const router = useRouter();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [isEditing, setIsEditing] = useState<Partial<Album> | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [aiEditingPhoto, setAiEditingPhoto] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"general" | "interactions" | "downloads">("general");

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
        const files = Array.from(e.target.files);
        setUploading(true);
        setUploadProgress(0);

        const newPhotos: { url: string; id: string; caption?: string }[] = [];
        let completed = 0;

        try {
            for (const file of files) {
                const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);

                // NEW: Generate AI phrase for each photo
                let caption = "";
                try {
                    const response = await fetch("/api/ai/generate-phrase", {
                        method: "POST",
                        body: JSON.stringify({ albumTitle: isEditing.title || "Sesión Fotográfica" }),
                        headers: { "Content-Type": "application/json" }
                    });
                    const data = await response.json();
                    caption = data.phrase || "";
                } catch (e) {
                    console.error("AI phrase generation failed:", e);
                }

                newPhotos.push({
                    url,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    caption: caption
                });

                completed++;
                setUploadProgress(Math.round((completed / files.length) * 100));
            }

            setIsEditing({
                ...isEditing,
                photos: [...(isEditing.photos || []), ...newPhotos],
                coverUrl: isEditing.coverUrl || newPhotos[0]?.url
            });
        } catch (error) {
            console.error("Error uploading files:", error);
        }
        setUploading(false);
        setUploadProgress(0);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) return;
        setLoading(true);
        try {
            const albumData = {
                ...isEditing,
                slug: isEditing.slug || isEditing.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                settings: isEditing.settings || {
                    allowLikes: true,
                    allowDownloads: true,
                    allowSharing: true
                }
            };

            if (isEditing?.id) {
                await updateDoc(doc(db, "portfolio_albums", isEditing.id), albumData);
            } else {
                await addDoc(collection(db, "portfolio_albums"), {
                    ...albumData,
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

    if (role === "LOADING") return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    if (role === "UNAUTHORIZED") return null;

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 w-full">
                <nav className="flex items-center gap-2 text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                    <Link href="/admin/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> Dashboard
                    </Link>
                    <ChevronRight className="w-3 h-3 opacity-20" />
                    <span className="text-white">Portafolio & Álbumes</span>
                </nav>

                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Camera className="text-curiol-500 w-4 h-4" />
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Gestión Visual</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Publicación de Álbumnes</h1>
                        <p className="text-tech-500 mt-4">Crea y organiza galerías fotográficas para el portafolio 2026.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <CommandK isMaster={role === "MASTER" || localStorage.getItem("master_admin") === "true"} />
                        <button
                            onClick={() => setIsEditing({
                                title: "",
                                description: "",
                                category: "Legado Familiar",
                                photos: [],
                                eventDate: new Date().toISOString().split('T')[0],
                                settings: { allowLikes: true, allowDownloads: true, allowSharing: true }
                            })}
                            className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <Plus className="w-4 h-4" /> Nuevo Álbum
                        </button>
                    </div>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-tech-950/95 backdrop-blur-xl" onClick={() => setIsEditing(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-tech-900 border border-white/5 w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">

                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-tech-950/50">
                                <div>
                                    <h3 className="text-2xl font-serif text-white italic">Configuración de Galería</h3>
                                    <p className="text-tech-500 text-[10px] uppercase tracking-widest mt-1 font-bold">{isEditing.title || "Nuevo Álbum"}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex bg-tech-950 p-1 rounded-xl border border-white/5">
                                        {(["general", "interactions", "downloads"] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setActiveTab(t)}
                                                className={cn(
                                                    "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                                    activeTab === t ? "bg-curiol-gradient text-white shadow-lg" : "text-tech-500 hover:text-white"
                                                )}
                                            >
                                                {t === "general" ? "General" : t === "interactions" ? "Interacciones" : "Descargas"}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsEditing(null)} className="p-2 text-tech-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="flex-grow overflow-y-auto custom-scrollbar">
                                <div className="p-10">
                                    {activeTab === "general" && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <section>
                                                    <h4 className="text-white font-serif text-lg italic mb-6 flex items-center gap-3">
                                                        <Settings className="w-4 h-4 text-curiol-500" /> Básico
                                                    </h4>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Nombre de la galería</label>
                                                            <input required value={isEditing.title || ""} onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 transition-all font-light" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Fecha de sesión</label>
                                                            <div className="relative">
                                                                <input type="date" value={isEditing.eventDate || ""} onChange={(e) => setIsEditing({ ...isEditing, eventDate: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 transition-all font-light appearance-none" />
                                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-600 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Categoría del Proyecto</label>
                                                            <select value={isEditing.category || "Legado Familiar"} onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 transition-all">
                                                                <option value="Legado Familiar">Legado Familiar</option>
                                                                <option value="Crecimiento Comercial & IA">Crecimiento Comercial & IA</option>
                                                                <option value="Arte Fine Art">Arte Fine Art</option>
                                                                <option value="Estudio">Estudio</option>
                                                                <option value="Embarazo">Embarazo</option>
                                                                <option value="Parejas">Parejas</option>
                                                                <option value="Llegada bebé">Llegada bebé</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </section>

                                                <section>
                                                    <h4 className="text-white font-serif text-lg italic mb-6 flex items-center gap-3">
                                                        <LinkIcon className="w-4 h-4 text-curiol-500" /> Acceso
                                                    </h4>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">URL de la galería (Slug)</label>
                                                            <div className="flex items-center gap-2 bg-tech-950 border border-tech-800 rounded-xl px-4 text-tech-600 text-xs">
                                                                <span>/portafolio/</span>
                                                                <input placeholder="ej-boda-juan" value={isEditing.slug || ""} onChange={(e) => setIsEditing({ ...isEditing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="flex-grow bg-transparent py-4 text-white outline-none font-light" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-2">Contraseña (Opcional)</label>
                                                            <input type="password" placeholder="Proteger con clave" value={isEditing.password || ""} onChange={(e) => setIsEditing({ ...isEditing, password: e.target.value })} className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-sm outline-none focus:border-curiol-500 transition-all font-light" />
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>

                                            <div className="space-y-8">
                                                <section className="h-full flex flex-col">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-white font-serif text-lg italic flex items-center gap-3">
                                                            <ImageIcon className="w-4 h-4 text-curiol-500" /> Fotos del Álbum
                                                        </h4>
                                                        {uploading && (
                                                            <div className="flex items-center gap-3 bg-curiol-500/10 px-4 py-2 rounded-full border border-curiol-500/20">
                                                                <div className="w-2 h-2 bg-curiol-500 rounded-full animate-pulse" />
                                                                <span className="text-[10px] font-bold text-curiol-500 uppercase tracking-widest">{uploadProgress}% Subiendo</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-grow bg-tech-950/50 rounded-3xl border border-dashed border-tech-800 p-6 flex flex-col">
                                                        <div className="grid grid-cols-3 gap-4 auto-rows-min mb-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                                            {isEditing.photos?.map((p, idx) => (
                                                                <div key={idx} className="aspect-square bg-tech-900 rounded-2xl relative overflow-hidden group border border-white/5">
                                                                    <img src={p.url} className="w-full h-full object-cover" alt="" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                        <button type="button" onClick={() => setAiEditingPhoto(p.url)} className="p-2 bg-curiol-500 rounded-xl text-white hover:scale-110 transition-all"><Sparkles className="w-4 h-4" /></button>
                                                                        <button type="button" onClick={() => setIsEditing({ ...isEditing, photos: isEditing.photos?.filter((_, i) => i !== idx) })} className="p-2 bg-red-500 rounded-xl text-white hover:scale-110 transition-all"><X className="w-4 h-4" /></button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            <label className="aspect-square bg-tech-900 border-2 border-dashed border-tech-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-curiol-500/50 hover:bg-curiol-500/5 transition-all group">
                                                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} />
                                                                <Upload className="w-8 h-8 text-tech-700 group-hover:text-curiol-500 transition-colors" />
                                                                <span className="text-[8px] text-tech-700 font-bold uppercase mt-2 group-hover:text-curiol-500 transition-colors">Añadir Fotos</span>
                                                            </label>
                                                        </div>

                                                        <div className="mt-auto p-6 bg-tech-900 rounded-2xl border border-white/5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-tech-950 flex items-center justify-center text-tech-600">
                                                                    <ImageIcon className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-white text-sm font-bold">{isEditing.photos?.length || 0} Archivos seleccionados</p>
                                                                    <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest mt-0.5">Límite recomendado: 200 fotos por álbum</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "interactions" && (
                                        <div className="max-w-2xl mx-auto space-y-12">
                                            <div className="text-center mb-12">
                                                <Heart className="w-12 h-12 text-curiol-500 mx-auto mb-4" />
                                                <h4 className="text-2xl font-serif text-white italic">Interacciones del Cliente</h4>
                                                <p className="text-tech-500 text-sm font-light">Configura cómo los usuarios pueden interactuar con las fotografías.</p>
                                            </div>

                                            <div className="space-y-6">
                                                {[
                                                    { id: "allowLikes", label: "Permitir Favoritos/Likes", desc: "El cliente puede marcar fotos con un corazón para su selección final.", icon: Heart },
                                                    { id: "allowSharing", label: "Permitir Compartir", desc: "Habilitar botones para compartir fotos individuales o todo el álbum.", icon: Share2 }
                                                ].map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between p-8 bg-tech-950 border border-tech-800 rounded-3xl group hover:border-curiol-500/30 transition-all">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 rounded-2xl bg-tech-900 border border-white/5 flex items-center justify-center text-tech-500 group-hover:text-curiol-500 transition-colors">
                                                                <item.icon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-bold text-sm">{item.label}</p>
                                                                <p className="text-tech-500 text-xs font-light">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditing({
                                                                ...isEditing,
                                                                settings: {
                                                                    ...(isEditing.settings || { allowLikes: true, allowDownloads: true, allowSharing: true }),
                                                                    [item.id]: !isEditing.settings?.[item.id as keyof typeof isEditing.settings]
                                                                }
                                                            })}
                                                            className={cn(
                                                                "w-14 h-8 rounded-full relative transition-all duration-300",
                                                                isEditing.settings?.[item.id as keyof typeof isEditing.settings] ? "bg-curiol-gradient" : "bg-tech-800"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300",
                                                                isEditing.settings?.[item.id as keyof typeof isEditing.settings] ? "left-7" : "left-1"
                                                            )} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "downloads" && (
                                        <div className="max-w-2xl mx-auto space-y-12">
                                            <div className="text-center mb-12">
                                                <Download className="w-12 h-12 text-curiol-500 mx-auto mb-4" />
                                                <h4 className="text-2xl font-serif text-white italic">Control de Descargas</h4>
                                                <p className="text-tech-500 text-sm font-light">Gestiona la entrega de archivos digitales a tus clientes.</p>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-8 bg-tech-950 border border-tech-800 rounded-3xl group hover:border-curiol-500/30 transition-all">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-tech-900 border border-white/5 flex items-center justify-center text-tech-500 group-hover:text-curiol-500 transition-colors">
                                                            <Download className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold text-sm">Habilitar Descarga de Álbum</p>
                                                            <p className="text-tech-500 text-xs font-light">Permite al cliente descargar todas las fotos en un archivo ZIP.</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditing({
                                                            ...isEditing,
                                                            settings: {
                                                                ...(isEditing.settings || { allowLikes: true, allowDownloads: true, allowSharing: true }),
                                                                allowDownloads: !isEditing.settings?.allowDownloads
                                                            }
                                                        })}
                                                        className={cn(
                                                            "w-14 h-8 rounded-full relative transition-all duration-300",
                                                            isEditing.settings?.allowDownloads ? "bg-curiol-gradient" : "bg-tech-800"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300",
                                                            isEditing.settings?.allowDownloads ? "left-7" : "left-1"
                                                        )} />
                                                    </button>
                                                </div>

                                                <GlassCard className="p-8 border-tech-800 bg-curiol-500/5">
                                                    <p className="text-tech-400 text-xs font-light italic text-center">
                                                        "Las descargas siempre se realizan en la resolución original subida a Firebase Storage para garantizar la máxima calidad de entrega."
                                                    </p>
                                                </GlassCard>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>

                            <div className="p-10 bg-tech-950/50 border-t border-white/5 flex gap-4">
                                <button type="button" onClick={handleSave} disabled={loading} className="flex-grow py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-[0.98] transition-all">
                                    <Save className="w-4 h-4" /> {loading ? "Procesando cambios..." : "Publicar Galería"}
                                </button>
                                <button type="button" onClick={() => setIsEditing(null)} className="px-10 py-5 bg-tech-800 text-tech-400 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-tech-700 transition-all">Descartar</button>
                            </div>
                        </motion.div>
                    </div >
                )
                }
            </AnimatePresence >

            <AnimatePresence>
                {aiEditingPhoto && (
                    <AiCompositionEditor
                        imageUrl={aiEditingPhoto}
                        onClose={() => setAiEditingPhoto(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div >
    );
}
