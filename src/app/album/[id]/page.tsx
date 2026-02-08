"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getAlbum, AlbumMetadata } from "@/actions/albums";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Heart, MessageCircle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientAlbumPage() {
    const { id } = useParams();
    const [album, setAlbum] = useState<AlbumMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        if (id) loadAlbum();
    }, [id]);

    const loadAlbum = async () => {
        const data = await getAlbum(id as string);
        setAlbum(data);
        setLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!album) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-serif italic">
            El álbum ha expirado o no existe.
        </div>
    );

    const themeClass = {
        "dark-canvas": "bg-tech-950 text-white",
        "minimal-white": "bg-white text-tech-950",
        "sepia-legacy": "bg-[#2d241e] text-[#c4a484]"
    }[album.theme] || "bg-tech-950 text-white";

    return (
        <div className={cn("min-h-screen transition-colors duration-1000", themeClass)}>
            {/* Hero Header */}
            <header className="h-[70vh] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-current opacity-20" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center z-10 space-y-4 px-4"
                >
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">MEMORIAS VIVAS • ENTREGA PREMIUM</p>
                    <h1 className="text-6xl md:text-8xl font-serif italic tracking-tight">{album.name}</h1>
                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-current/10 max-w-xs mx-auto">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
                            <Clock className="w-3 h-3" /> 58 días restantes
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Gallery Grid */}
            <main className="max-w-7xl mx-auto px-4 py-24 space-y-24">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {album.images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative group cursor-zoom-in"
                        >
                            <img
                                src={img.original}
                                alt={`Memory ${i}`}
                                className="w-full h-auto rounded-lg shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex flex-col justify-end p-6">
                                <div className="flex justify-between items-center text-white">
                                    <div className="flex gap-4">
                                        <Heart className="w-5 h-5 hover:text-red-500 transition-colors cursor-pointer" />
                                        <MessageCircle className="w-5 h-5 hover:text-curiol-500 transition-colors cursor-pointer" />
                                    </div>
                                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 hover:text-white transition-all">
                                        <Download className="w-4 h-4" /> Bajar HD
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Legend Section */}
                <footer className="pt-24 border-t border-current/10 text-center space-y-8 max-w-2xl mx-auto p-8">
                    <p className="font-serif italic text-2xl opacity-80 leading-relaxed">
                        "Cada fotografía es un fragmento de eternidad que hemos capturado para tu legado."
                    </p>
                    <div className="flex justify-center gap-8">
                        <button className="flex items-center gap-3 px-8 py-4 bg-current text-white mix-blend-difference rounded-full text-[10px] font-bold uppercase tracking-widest">
                            <Download className="w-4 h-4" /> Pack Social (IA Optimized)
                        </button>
                        <button className="flex items-center gap-3 px-8 py-4 border border-current rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-current hover:text-white transition-all">
                            <Share2 className="w-4 h-4" /> Compartir Álbum
                        </button>
                    </div>
                </footer>
            </main>

            {/* Expiration Banner */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-tech-950/80 backdrop-blur-xl border border-white/5 py-3 px-6 rounded-full flex items-center gap-3 shadow-2xl">
                    <Info className="w-4 h-4 text-curiol-500" />
                    <p className="text-[10px] text-tech-400 uppercase tracking-widest font-bold">
                        Disponibilidad limitada hasta Mayo 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
