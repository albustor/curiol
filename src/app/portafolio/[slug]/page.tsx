"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getAlbumBySlug, PortfolioAlbum } from "@/actions/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, Share2, Download, X,
    ChevronLeft, ChevronRight, Maximize2,
    Calendar, Lock, ShieldCheck, Instagram, Facebook
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AiCompositionEditor } from "@/components/admin/AiCompositionEditor";

export default function AlbumViewPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [album, setAlbum] = useState<PortfolioAlbum | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [password, setPassword] = useState("");
    const [isLocked, setIsLocked] = useState(false);
    const [likedPhotos, setLikedPhotos] = useState<string[]>([]);
    const [aiSocialFormat, setAiSocialFormat] = useState<"ig-post" | "ig-story" | "fb-post" | null>(null);

    useEffect(() => {
        async function load() {
            const data = await getAlbumBySlug(slug as string);
            if (data) {
                setAlbum(data);
                if (data.password) setIsLocked(true);
            }
            setLoading(false);
        }
        load();

        // Load likes from local storage
        const savedLikes = localStorage.getItem(`likes_${slug}`);
        if (savedLikes) setLikedPhotos(JSON.parse(savedLikes));
    }, [slug]);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === album?.password) {
            setIsLocked(false);
        } else {
            alert("Contraseña incorrecta");
        }
    };

    const toggleLike = (photoId: string) => {
        const newLikes = likedPhotos.includes(photoId)
            ? likedPhotos.filter(id => id !== photoId)
            : [...likedPhotos, photoId];
        setLikedPhotos(newLikes);
        localStorage.setItem(`likes_${slug}`, JSON.stringify(newLikes));
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleShare = (photoUrl: string) => {
        navigator.clipboard.writeText(photoUrl);
        alert("Enlace de la foto copiado al portapapeles");
    };

    if (loading) return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-curiol-500/20 border-t-curiol-500 rounded-full animate-spin" />
        </div>
    );

    if (!album) return (
        <div className="min-h-screen bg-tech-950 flex flex-col items-center justify-center p-4">
            <Navbar />
            <h1 className="text-4xl font-serif text-white italic mb-4">Álbum no encontrado</h1>
            <p className="text-tech-500 mb-8">La galería que buscas no existe o ha sido movida.</p>
            <button onClick={() => router.push("/portafolio")} className="px-8 py-4 bg-tech-900 text-white rounded-xl border border-white/5">Volver al Portafolio</button>
        </div>
    );

    if (isLocked) return (
        <div className="min-h-screen bg-tech-950 flex flex-col items-center justify-center p-4">
            <Navbar />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-tech-900 p-12 rounded-[2.5rem] border border-white/5 text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-curiol-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-curiol-500/20">
                    <Lock className="w-10 h-10 text-curiol-500" />
                </div>
                <h2 className="text-3xl font-serif text-white italic mb-4">Acceso Restringido</h2>
                <p className="text-tech-500 text-sm font-light mb-8">Esta galería está protegida por contraseña. Por favor, ingrésala para continuar.</p>
                <form onSubmit={handleUnlock} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full bg-tech-950 border border-tech-800 rounded-xl p-4 text-white text-center outline-none focus:border-curiol-500 transition-all font-light"
                        autoFocus
                    />
                    <button type="submit" className="w-full py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <ShieldCheck className="w-4 h-4" /> Desbloquear Galería
                    </button>
                </form>
            </motion.div>
        </div>
    );

    return (
        <main className="min-h-screen bg-tech-950">
            <Navbar />

            <header className="pt-40 pb-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-4 text-curiol-500">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{album.category}</span>
                        {album.eventDate && (
                            <>
                                <span className="w-1 h-1 bg-curiol-500/30 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{new Date(album.eventDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-white italic mb-6 leading-tight">{album.title}</h1>
                    <p className="text-tech-400 text-lg font-light leading-relaxed mb-10">{album.description}</p>

                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-white text-2xl font-serif italic">{album.photos.length}</p>
                            <p className="text-tech-600 text-[8px] font-bold uppercase tracking-wider">Fotografías</p>
                        </div>
                        <div className="w-[1px] h-8 bg-white/5" />
                        <div className="text-center">
                            <p className="text-white text-2xl font-serif italic">{likedPhotos.length}</p>
                            <p className="text-tech-600 text-[8px] font-bold uppercase tracking-wider">Favoritos</p>
                        </div>
                    </div>
                </div>
            </header>

            <section className="px-4 pb-32">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
                    {album.photos.map((p, idx) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (idx % 8) * 0.05 }}
                            onClick={() => setSelectedIndex(idx)}
                            className="group relative aspect-square bg-tech-900 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/5"
                        >
                            <img
                                src={p.url}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-10 h-10 text-white/50" />
                            </div>
                            {likedPhotos.includes(p.id) && (
                                <div className="absolute top-4 left-4 bg-curiol-gradient p-2 rounded-full shadow-lg">
                                    <Heart className="w-3 h-3 text-white fill-current" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Lightbox / Premium Viewer */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-tech-950/98 backdrop-blur-2xl flex flex-col"
                    >
                        {/* Lightbox Header */}
                        <div className="p-8 flex items-center justify-between z-10">
                            <div className="text-white">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Imagen {selectedIndex + 1} de {album.photos.length}</p>
                            </div>
                            <div className="flex items-center gap-6">
                                {album.settings?.allowLikes && (
                                    <button
                                        onClick={() => toggleLike(album.photos[selectedIndex].id)}
                                        className={cn(
                                            "flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-serif italic text-sm border border-white/5",
                                            likedPhotos.includes(album.photos[selectedIndex].id) ? "bg-curiol-gradient text-white" : "bg-tech-900 text-tech-400"
                                        )}
                                    >
                                        <Heart className={cn("w-4 h-4", likedPhotos.includes(album.photos[selectedIndex].id) && "fill-current")} />
                                        <span>{likedPhotos.includes(album.photos[selectedIndex].id) ? "En favoritos" : "Marcar favorito"}</span>
                                    </button>
                                )}

                                {album.settings?.allowSharing && (
                                    <button
                                        onClick={() => handleShare(album.photos[selectedIndex].url)}
                                        className="p-3 bg-tech-900 rounded-xl text-tech-400 hover:text-white transition-all border border-white/5"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                )}

                                {album.settings?.allowDownloads && (
                                    <div className="flex items-center gap-2 bg-tech-950 p-1 rounded-xl border border-white/5">
                                        <button
                                            onClick={() => handleDownload(album.photos[selectedIndex].url, `photo-${selectedIndex + 1}.jpg`)}
                                            className="p-3 bg-tech-900 rounded-xl text-tech-400 hover:text-white transition-all border border-white/5"
                                            title="Original Resolution"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <div className="w-[1px] h-6 bg-white/10 mx-1" />
                                        <button
                                            onClick={() => setAiSocialFormat("ig-post")}
                                            className="p-3 bg-tech-900 rounded-xl text-tech-400 hover:text-instagram transition-all border border-white/5"
                                            title="Instagram Optimized"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setAiSocialFormat("fb-post")}
                                            className="p-3 bg-tech-900 rounded-xl text-tech-400 hover:text-facebook transition-all border border-white/5"
                                            title="Facebook Optimized"
                                        >
                                            <Facebook className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <div className="w-[1px] h-8 bg-white/5 mx-2" />

                                <button onClick={() => setSelectedIndex(null)} className="p-3 text-tech-500 hover:text-white transition-colors">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>
                        </div>

                        {/* Lightbox Main Content */}
                        <div className="flex-grow flex items-center justify-between px-8 pb-8 relative overflow-hidden">
                            <button
                                onClick={() => setSelectedIndex((prev) => (prev! - 1 + album.photos.length) % album.photos.length)}
                                className="z-10 p-4 bg-tech-900/50 backdrop-blur-xl rounded-2xl text-white hover:bg-curiol-gradient transition-all border border-white/5 group"
                            >
                                <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            </button>

                            <motion.div
                                key={selectedIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="w-full h-full flex items-center justify-center p-4 md:p-12"
                            >
                                <img
                                    src={album.photos[selectedIndex].url}
                                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                    alt=""
                                />
                            </motion.div>

                            <button
                                onClick={() => setSelectedIndex((prev) => (prev! + 1) % album.photos.length)}
                                className="z-10 p-4 bg-tech-900/50 backdrop-blur-xl rounded-2xl text-white hover:bg-curiol-gradient transition-all border border-white/5 group"
                            >
                                <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {aiSocialFormat && selectedIndex !== null && (
                    <AiCompositionEditor
                        imageUrl={album.photos[selectedIndex].url}
                        initialFormat={aiSocialFormat}
                        onClose={() => setAiSocialFormat(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}

