"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getAlbum, AlbumMetadata, toggleFavorite } from "@/actions/albums";
import { generateSocialCaption } from "@/actions/image-ai";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Heart, MessageCircle, Clock, Info, Search, Grid, MousePointer2, Eye, X, Play, Pause, Copy, Check, Music, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDirectImageUrl, getPortfolioAiInsight } from "@/actions/portfolio";
import { PerspectiveCard } from "@/components/ui/PerspectiveCard";

export default function ClientAlbumPage() {
    const { id } = useParams();
    const [album, setAlbum] = useState<AlbumMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [socialCaption, setSocialCaption] = useState("");
    const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
    const [copied, setCopied] = useState(false);

    // AI Curator State
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);

    const handleGenerateAiInsight = async () => {
        if (!album) return;
        setAiLoading(true);
        setShowAiPanel(true);
        try {
            const insight = await getPortfolioAiInsight(album.name, "Sesión de Cliente", album.images.length);
            setAiInsight(insight);
        } catch (error) {
            console.error("AI Curator error:", error);
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadAlbum();
    }, [id]);

    useEffect(() => {
        let interval: any;
        if (isPlaying && album) {
            interval = setInterval(() => {
                setSelectedImage(prev => {
                    const next = (prev === null ? 0 : prev + 1) % album.images.length;
                    return next;
                });
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, album]);

    const loadAlbum = async () => {
        const data = await getAlbum(id as string);
        if (data) {
            setAlbum(data);
            setFavorites(data.favorites || []);
        }
        setLoading(false);
    };

    const handleToggleFavorite = async (url: string) => {
        const result = await toggleFavorite(id as string, url);
        if (result.success) {
            setFavorites(result.favorites || []);
        }
    };

    const handleGenerateCaption = async (img: any) => {
        setIsGeneratingCaption(true);
        const caption = await generateSocialCaption(img.original, img.tags || [], album?.theme || "dark-canvas");
        setSocialCaption(caption);
        setIsGeneratingCaption(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const filteredImages = album?.images.filter(img => {
        if (activeFilter === "highlights" && img.category !== "highlight") return false;
        if (activeFilter === "favorites" && !favorites.includes(img.original)) return false;

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return img.tags?.some(tag => tag.includes(searchLower)) ||
                img.captions?.toLowerCase().includes(searchLower);
        }
        return true;
    }) || [];

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
    }[(album.theme || "dark-canvas") as "dark-canvas" | "minimal-white" | "sepia-legacy"] || "bg-tech-950 text-white";

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

            {/* Premium Controls Bar */}
            <div className="sticky top-0 z-40 bg-inherit/80 backdrop-blur-xl border-y border-current/5 py-4 px-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    {["all", "highlights", "favorites"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all",
                                activeFilter === f ? "bg-current text-black mix-blend-difference" : "opacity-40 hover:opacity-100"
                            )}
                        >
                            {f === "all" ? "Todo" : f === "highlights" ? "Favoritas IA" : "Seleccionadas"}
                        </button>
                    ))}
                </div>

                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 opacity-40" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por tag IA (ej: sonrisa, abrazo)..."
                        className="w-full bg-current/5 border border-current/10 rounded-full py-2 pl-10 pr-4 text-[11px] outline-none focus:border-current/30 transition-all placeholder:opacity-30"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={cn(
                            "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                            isPlaying ? "text-curiol-500" : "opacity-60 hover:opacity-100"
                        )}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? "Pausar" : "Modo Cine"}
                    </button>
                    <div className="w-px h-6 bg-current/10" />
                    <div className="text-[10px] uppercase font-medium opacity-40">
                        {filteredImages.length} Memorias
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12 space-y-24">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {filteredImages.map((img, i) => (
                        <PerspectiveCard
                            key={img.original}
                            index={i}
                            onClick={() => setSelectedImage(i)}
                            className="rounded-lg shadow-2xl"
                        >
                            <img
                                src={getDirectImageUrl(img.original)}
                                alt={`Memory ${i}`}
                                className={cn(
                                    "w-full h-auto transition-all duration-700",
                                    favorites.includes(img.original) ? "ring-2 ring-curiol-500" : ""
                                )}
                            />

                            {/* Tags Bubble (AI) */}
                            <div className="absolute top-4 left-4 flex gap-2 z-20">
                                {img.category === "highlight" && (
                                    <span className="bg-curiol-500 text-white text-[8px] font-bold uppercase px-2 py-1 rounded">Highlight</span>
                                )}
                            </div>

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6 z-20">
                                <div className="flex justify-between items-center text-white">
                                    <div className="flex gap-4">
                                        <Heart
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(img.original);
                                            }}
                                            className={cn(
                                                "w-5 h-5 transition-colors cursor-pointer",
                                                favorites.includes(img.original) ? "text-red-500 fill-red-500" : "hover:text-red-500"
                                            )}
                                        />
                                        <MessageCircle className="w-5 h-5 hover:text-curiol-500 transition-colors cursor-pointer" />
                                    </div>
                                    <a
                                        href={img.original}
                                        download
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 hover:text-white transition-all pointer-events-auto"
                                    >
                                        <Download className="w-4 h-4" /> Bajar HD
                                    </a>
                                </div>
                            </div>
                        </PerspectiveCard>
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

            {/* AI Music Upsell Overlay (Cinematic Mode) */}
            <AnimatePresence>
                {isPlaying && !album.originalSong?.url && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-xl"
                    >
                        <div className="bg-curiol-950/90 backdrop-blur-2xl border border-curiol-500/30 p-6 rounded-3xl shadow-2xl flex items-center gap-6">
                            <div className="bg-curiol-500/20 p-4 rounded-2xl">
                                <Music className="w-8 h-8 text-curiol-500 animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-white text-xs leading-relaxed font-serif italic">
                                    "Esta presentación sería mucho más completa con tu canción original creada con tus ideas, emociones y sentimientos."
                                </p>
                                <div className="flex items-center gap-4">
                                    <a
                                        href={album.originalSong?.descriptionUrl || "https://curiol.studio/musica-ia"}
                                        target="_blank"
                                        className="text-[10px] bg-curiol-500 text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-curiol-600 transition-all"
                                    >
                                        Crear mi Canción (${album.originalSong?.price || 25000})
                                    </a>
                                    <button
                                        onClick={() => setIsPlaying(false)}
                                        className="text-[10px] text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Quizás luego
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox / Full View */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                            <div className="lg:col-span-2 relative">
                                <motion.img
                                    layoutId={`img-${selectedImage}`}
                                    src={getDirectImageUrl(filteredImages[selectedImage].original)}
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
                                />
                            </div>

                            <div className="space-y-8 text-white">
                                <div className="space-y-4">
                                    <p className="text-curiol-500 text-[10px] font-bold uppercase tracking-[0.3em]">IA Storytelling</p>
                                    <h3 className="text-3xl font-serif italic leading-tight">
                                        {filteredImages[selectedImage].captions || "Un momento para la eternidad."}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {filteredImages[selectedImage].tags?.map(tag => (
                                            <span key={tag} className="text-[9px] uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full opacity-60">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8 border-t border-white/10">
                                    <button
                                        onClick={() => handleToggleFavorite(filteredImages[selectedImage].original)}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                            favorites.includes(filteredImages[selectedImage].original) ? "bg-red-500 text-white" : "bg-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <Heart className={cn("w-4 h-4", favorites.includes(filteredImages[selectedImage].original) && "fill-current")} />
                                        {favorites.includes(filteredImages[selectedImage].original) ? "Destacada" : "Destacar"}
                                    </button>
                                    <button
                                        onClick={() => handleGenerateCaption(filteredImages[selectedImage])}
                                        disabled={isGeneratingCaption}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
                                        title="Generar Copy para Instagram con IA"
                                    >
                                        <Share2 className={cn("w-4 h-4", isGeneratingCaption && "animate-spin")} />
                                    </button>
                                </div>

                                {/* AI Social Caption Section */}
                                <AnimatePresence>
                                    {socialCaption && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 bg-curiol-500/10 border border-curiol-500/20 rounded-xl mt-4 relative group/caption">
                                                <p className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest mb-2">Sugerencia IA para Socials</p>
                                                <p className="text-[11px] leading-relaxed italic opacity-80">"{socialCaption}"</p>
                                                <button
                                                    onClick={() => copyToClipboard(socialCaption)}
                                                    className="absolute top-4 right-4 p-2 opacity-0 group-hover/caption:opacity-100 transition-opacity"
                                                >
                                                    {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Curator Trigger */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleGenerateAiInsight}
                className="fixed bottom-24 right-8 z-50 w-16 h-16 bg-curiol-gradient rounded-full flex items-center justify-center shadow-3xl text-white group"
            >
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <div className="absolute -top-12 right-0 bg-tech-950/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/5">
                    Curador de Legados AI
                </div>
            </motion.button>

            {/* AI Curator Panel */}
            <AnimatePresence>
                {showAiPanel && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md z-[110] bg-tech-950/40 backdrop-blur-3xl border-l border-white/5 p-12 flex flex-col"
                    >
                        <button
                            onClick={() => setShowAiPanel(false)}
                            className="absolute top-8 left-8 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="mt-20 space-y-12">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="h-[1px] w-8 bg-curiol-500"></span>
                                    <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">IA Curator</span>
                                </div>
                                <h2 className="text-5xl font-serif text-white italic">Nota del <br /> <span className="text-curiol-gradient">Curador.</span></h2>
                            </div>

                            <div className="relative">
                                {aiLoading ? (
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-white/5 rounded-full animate-pulse" />
                                        <div className="h-4 w-[90%] bg-white/5 rounded-full animate-pulse delay-75" />
                                        <div className="h-4 w-[95%] bg-white/5 rounded-full animate-pulse delay-150" />
                                    </div>
                                ) : (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-tech-300 text-xl font-light leading-relaxed italic"
                                    >
                                        "{aiInsight}"
                                    </motion.p>
                                )}
                            </div>

                            <div className="pt-12 border-t border-white/5">
                                <p className="text-[10px] text-tech-500 uppercase tracking-widest font-bold mb-4">Análisis de la Obra</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">Concepto</p>
                                        <p className="text-[10px] text-white font-medium italic">Eternidad Phygital</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">Valor</p>
                                        <p className="text-[10px] text-white font-medium italic">Preservación de Legado</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={() => setShowAiPanel(false)}
                                className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-curiol-500 hover:text-white transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expiration Banner */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-tech-950/80 backdrop-blur-xl border border-white/5 py-3 px-6 rounded-full flex items-center gap-3 shadow-2xl">
                    <Info className="w-4 h-4 text-curiol-500" />
                    <p className="text-[10px] text-tech-400 uppercase tracking-widest font-bold">
                        Disponibilidad limitada hasta {album.expiresAt ? new Date(album.expiresAt.seconds * 1000).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'Mayo 2026'}
                    </p>
                </div>
            </div>
        </div>
    );
}
