"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPortfolioData, PortfolioItem } from "@/actions/portfolio";
import { cn } from "@/lib/utils";
import { Camera, Image as ImageIcon, Filter, Sparkles } from "lucide-react";

export default function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getPortfolioData();
            setItems(data);

            const cats = ["Todos", ...new Set(data.map(item => item.categoria))];
            setCategories(cats);
            setLoading(false);
        }
        load();
    }, []);

    const filteredItems = activeCategory === "Todos"
        ? items
        : items.filter(item => item.categoria === activeCategory);

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
                        Portafolio <br /> <span className="text-curiol-gradient">Visual.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-tech-400 text-lg max-w-2xl mx-auto mb-12 font-light"
                    >
                        Una colección curada de momentos que trascienden el tiempo.
                        Desde la calidez familiar hasta la precisión corporativa.
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
                            {filteredItems.map((item, idx) => (
                                <motion.div
                                    key={item.url}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="group relative aspect-square rounded-2xl overflow-hidden bg-tech-900 border border-tech-800 bg-grain"
                                >
                                    <img
                                        src={item.url}
                                        alt={item.titulo}
                                        className="w-full h-full object-cover object-[center_10%] transition-transform duration-700 group-hover:scale-110 img-premium"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-curiol-500 bg-curiol-500/10 px-2 py-1 rounded">
                                                {item.subcategoria}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-serif text-white italic line-clamp-2">
                                            {item.titulo}
                                        </h3>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-tech-950/80 backdrop-blur-md p-2 rounded-full border border-tech-700">
                                            <Sparkles className="w-4 h-4 text-curiol-500" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <Camera className="w-12 h-12 text-tech-800 mx-auto mb-4" />
                        <p className="text-tech-500 font-light">No se encontraron fotografías en esta categoría.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
