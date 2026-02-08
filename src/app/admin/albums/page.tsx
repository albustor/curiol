"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import {
    Plus, ExternalLink, Trash2, Clock,
    Share2, Calendar, User, Search, Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AlbumsList() {
    const router = useRouter();
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        try {
            const q = query(collection(db, "albums"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            setAlbums(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error loading albums:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres eliminar este álbum?")) return;
        await deleteDoc(doc(db, "albums", id));
        setAlbums(prev => prev.filter(a => a.id !== id));
    };

    const filteredAlbums = albums.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-tech-950 text-white p-8">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-serif italic mb-2">Galerías Digitales</h1>
                    <p className="text-tech-500 text-sm">Entregas de alta gama con IA y ciclo de vida controlado.</p>
                </div>
                <button
                    onClick={() => router.push("/admin/albums/new")}
                    className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-curiol-500/20 hover:scale-105 transition-all flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" /> Nueva Entrega
                </button>
            </header>

            {/* Search and Filters */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-500" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por cliente o nombre de álbum..."
                        className="w-full bg-tech-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-curiol-500 transition-colors"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-tech-900 animate-pulse rounded-2xl" />)}
                </div>
            ) : filteredAlbums.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-tech-600 font-serif italic text-xl">No hay álbumes activos en este momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAlbums.map((album) => (
                        <GlassCard key={album.id} className="group overflow-hidden">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest">
                                            {album.theme.replace('-', ' ')}
                                        </p>
                                        <h3 className="text-xl font-serif italic group-hover:text-curiol-500 transition-colors">{album.name}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.open(`/album/${album.id}`, '_blank')}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-tech-400 hover:text-white transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(album.id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-tech-600" />
                                        <span className="text-xs text-tech-300">{album.clientName}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-tech-600" />
                                        <span className="text-[10px] text-tech-500 uppercase font-bold">60 días</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex -space-x-3">
                                        {album.images?.slice(0, 3).map((img: any, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-tech-950 overflow-hidden bg-tech-900">
                                                <img src={img.original} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {album.images?.length > 3 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-tech-950 bg-tech-800 flex items-center justify-center text-[10px] font-bold">
                                                +{album.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/album/${album.id}`);
                                            alert("Enlace copiado al portapapeles");
                                        }}
                                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-tech-500 hover:text-white transition-all"
                                    >
                                        <Share2 className="w-3 h-3" /> Copiar Enlace
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
