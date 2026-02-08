"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getAlbums, PortfolioAlbum } from "@/actions/portfolio";
import { cn } from "@/lib/utils";
import { Camera, Image as ImageIcon, Filter, Sparkles, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function PortfolioPage() {
    const [albums, setAlbums] = useState<PortfolioAlbum[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getAlbums();
            setAlbums(data);

            const cats = ["Todos", ...new Set(data.map(album => album.category))];
            setCategories(cats);
            setLoading(false);
        }
        load();
    }, []);

    const filteredAlbums = activeCategory === "Todos"
        ? albums
        : albums.filter(album => album.category === activeCategory);

    return (
        <main className="min-h-screen bg-tech-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,95,50,0.1),transparent_70%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center items-center gap-3 mb-6"
                    >
                        <span className="h-[1px] w-12 bg-curiol-500"></span>
                        <span className="text-curiol-500 text-xs font-bold tracking-[0.4em] uppercase">Galería de Legados</span>
                        <span className="h-[1px] w-12 bg-curiol-500"></span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif text-white mb-8 italic"
                    >
                        Arquitectura <br /> <span className="text-curiol-gradient">de Memorias.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-tech-400 text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Nuestra curaduría visual trasciende la captura estática. Cada obra es un activo del ecosistema de "Digitalización Humana", diseñado para perdurar y cobrar vida.
                    </motion.p>

                    {/* Filters */}
                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-3 mb-16"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                                        activeCategory === cat
                                            ? "bg-curiol-700 text-white shadow-lg shadow-curiol-700/20"
                                            : "bg-tech-900 text-tech-400 hover:text-white border border-tech-800"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="pb-32 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-curiol-500/20 border-t-curiol-500 rounded-full animate-spin" />
                        <p className="text-tech-500 text-sm font-bold uppercase tracking-widest">Cargando Portafolio...</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredAlbums.map((album, idx) => (
                                <Link
                                    key={album.id}
                                    href={`/portafolio/${album.slug || album.id}`}
                                >
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-tech-900 border border-white/5 shadow-2xl"
                                    >
                                        <img
                                            src={album.coverUrl || (album.photos.length > 0 ? album.photos[0].url : "")}
                                            alt={album.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-tech-950/20 to-transparent p-10 flex flex-col justify-end">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-curiol-500 bg-curiol-500/10 px-3 py-1 rounded-full border border-curiol-500/20">
                                                    {album.category}
                                                </span>
                                                {album.eventDate && (
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tech-500 flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(album.eventDate).getFullYear()}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-3xl font-serif text-white italic mb-4 leading-tight group-hover:text-curiol-200 transition-colors">
                                                {album.title}
                                            </h3>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                <span className="text-tech-500 text-[10px] font-bold uppercase tracking-widest">{album.photos.length} Fotografías</span>
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tech-950 group-hover:scale-110 transition-transform">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>

                                        {album.password && (
                                            <div className="absolute top-6 right-6">
                                                <div className="bg-tech-950/80 backdrop-blur-md p-2 rounded-full border border-tech-700">
                                                    <Filter className="w-3 h-3 text-curiol-500" />
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && filteredAlbums.length === 0 && (
                    <div className="text-center py-20">
                        <Camera className="w-12 h-12 text-tech-800 mx-auto mb-4" />
                        <p className="text-tech-500 font-light">No se encontraron álbumes en esta categoría.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
