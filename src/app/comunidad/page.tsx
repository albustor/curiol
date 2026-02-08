"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Users, Heart, ArrowRight, Sparkles, MessageSquare, Share2, Send, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, increment, updateDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface Comment {
    id: string;
    text: string;
    author: string;
    createdAt: any;
}

export default function ComunidadPage() {
    const [academyContent, setAcademyContent] = useState<AcademyContent[]>([]);

    useEffect(() => {
        // Mostramos solo lo publicado que YA llegó a su fecha (o es pasado)
        const now = Timestamp.now();
        const q = query(
            collection(db, "academy_content"),
            where("isPublished", "==", true),
            where("createdAt", "<=", now),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AcademyContent[];
            setAcademyContent(data);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow">
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-24 mt-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Ecosistema Colaborativo</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight italic">
                            Comunidad & <br /> <span className="text-curiol-gradient">Trascendencia.</span>
                        </h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light leading-relaxed">
                            Creemos en la tecnología como un democratizador de oportunidades. Aquí compartimos el impacto social de nuestras soluciones y el conocimiento que impulsa el futuro local.
                        </p>
                    </div>
                </header>

                {/* Aprendiendo de nuevas tendencias (Dynamic Academy) */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="text-curiol-500 w-5 h-5" />
                                <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Tendencias & Innovación</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 italic">Aprendiendo de <br /> <span className="text-curiol-gradient">nuevas tendencias.</span></h2>
                            <p className="text-tech-400 text-lg font-light max-w-2xl">
                                Contenido estratégico generado periódicamente. Explora las últimas tendencias en IA, Realidad Aumentada y Marketing Digital.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {academyContent.map((item) => (
                            <AcademyCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>

                {/* El resto de contenido estático se mantiene para mantener la estructura de la página */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="bg-tech-900/50 border border-tech-800 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-curiol-500/10 blur-[100px] -mr-48 -mt-48" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest mb-4 block">Tecnología Curiol</span>
                                <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 italic">Experiencia <span className="text-curiol-gradient">Phygital.</span></h2>
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-tech-800 flex items-center justify-center shrink-0 border border-tech-700">
                                            <span className="text-curiol-500 font-bold">NFC</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-serif text-xl mb-2 italic">Tarjetas Inteligentes</h4>
                                            <p className="text-tech-400 text-sm font-light">Tu marca o portafolio personal en un solo toque. Rapidez y exclusividad para el networking moderno.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-tech-800 flex items-center justify-center shrink-0 border border-tech-700">
                                            <span className="text-curiol-500 font-bold">AR</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-serif text-xl mb-2 italic">WebAR Experience</h4>
                                            <p className="text-tech-400 text-sm font-light">Tus cuadros y álbumes impresos cobran vida al enfocarlos con tu celular. Sin apps, pura magia digital integrada al papel.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-square bg-tech-800 rounded-3xl border border-tech-700 overflow-hidden flex items-center justify-center">
                                <div className="w-48 h-48 border-2 border-curiol-500/50 rounded-full animate-[ping_3s_infinite]" />
                                <div className="text-white text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse absolute">Scanning...</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Zonas Azules */}
                <section className="bg-tech-950 py-32 border-y border-tech-800" id="legado-azul">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-[4/5] bg-tech-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070')] bg-cover bg-center grayscale opacity-40 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-tech-950/20 to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Tributo al Legado</span>
                                <h3 className="text-white font-serif text-4xl italic leading-tight">Zonas Azules: <br /> <span className="text-curiol-gradient">Huellas de Vida.</span></h3>
                                <p className="text-tech-400 text-sm mt-4 font-light leading-relaxed">Documentamos la sabiduría de nuestros "personajes azules" y el potencial de las nuevas generaciones.</p>
                            </div>
                        </div>
                        <div>
                            <div className="inline-flex p-3 bg-curiol-500/10 rounded-full text-curiol-500 mb-8">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 italic">Responsabilidad con <br /> el Patrimonio Vivo.</h2>
                            <p className="text-tech-400 text-lg font-light leading-relaxed mb-10 italic">
                                "Honramos a los personajes azules que han dejado huella en nuestras comunidades."
                            </p>
                            <Link href="/cotizar" className="flex items-center gap-2 text-curiol-500 text-xs font-bold uppercase tracking-widest hover:underline">
                                Postular una Historia <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <AiAssistant />
        </div>
    );
}

function AcademyCard({ item }: { item: AcademyContent }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [accessCode, setAccessCode] = useState("");
    const [unlockError, setUnlockError] = useState(false);

    useEffect(() => {
        if (!showComments) return;
        const q = query(collection(db, `academy_content/${item.id}/comments`), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
            setComments(data);
        });
        return () => unsubscribe();
    }, [showComments, item.id]);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setUnlockError(false);
        // Simplificación: Un código maestro o validación contra Firestore
        // Buscamos en la colección 'academy_codes' un documento con el ID del código
        // que coincida con el track del item.
        const codeQuery = query(collection(db, "academy_codes"), where("code", "==", accessCode.toUpperCase()), where("track", "==", item.track || "tech"));
        // O más simple para este MVP: Códigos directos
        if (accessCode.toUpperCase() === "CURIOL2026" || accessCode.toUpperCase() === "LEGADO2026") {
            setIsUnlocked(true);
            return;
        }

        setUnlockError(true);
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await addDoc(collection(db, `academy_content/${item.id}/comments`), {
                text: newComment,
                author: "Visitante",
                createdAt: Timestamp.now()
            });
            await updateDoc(doc(db, "academy_content", item.id), {
                commentsCount: increment(1)
            });
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleShare = (platform: string) => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const text = `Mira esto en la Academia: ${item.title}`;
        let shareUrl = '';

        if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

        if (shareUrl) {
            window.open(shareUrl, '_blank');
            updateDoc(doc(db, "academy_content", item.id), {
                sharesCount: increment(1)
            });
        }
    };

    if (item.isRestricted && !isUnlocked) {
        return (
            <GlassCard className="p-8 border-curiol-500/20 bg-tech-950/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-tech-900 flex items-center justify-center text-curiol-500 mb-6">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-serif text-white italic mb-2">{item.title}</h3>
                <p className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest mb-6">Contenido Exclusivo {item.track === 'legacy' ? 'Legado' : 'Tecnología'}</p>

                <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-4">
                    <input
                        required
                        type="text"
                        placeholder="Ingresa tu código"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="w-full bg-tech-900 border border-white/10 rounded-xl px-4 py-3 text-center text-white text-xs outline-none focus:border-curiol-500/50"
                    />
                    {unlockError && <p className="text-[10px] text-red-500 font-bold uppercase">Código inválido</p>}
                    <button type="submit" className="w-full py-3 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl">Desbloquear</button>
                </form>
                <p className="mt-6 text-[9px] text-tech-500 font-light italic">Este contenido es un plus exclusivo para nuestros clientes premium.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-0 overflow-hidden flex flex-col group border-white/5 hover:border-curiol-500/30 transition-all duration-500">
            {item.type !== 'lesson' && (
                <div className="aspect-video bg-tech-950 relative overflow-hidden group/video">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070')] bg-cover bg-center opacity-40 group-hover/video:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-curiol-500 flex items-center justify-center text-white shadow-2xl group-hover/video:scale-110 transition-all cursor-pointer">
                            {item.type === 'podcast' ? <MessageSquare className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 flex-grow">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-[0.3em]">{item.category}</span>
                    <span className="text-tech-700 text-[10px]">•</span>
                    <span className="text-tech-500 text-[10px] uppercase tracking-widest">{item.type}</span>
                </div>
                <h3 className="text-2xl font-serif text-white italic mb-4 leading-tight">{item.title}</h3>
                <p className="text-sm text-tech-400 font-light leading-relaxed mb-8">{item.description}</p>

                {item.body && (
                    <div className="mb-8 p-6 bg-tech-950/50 rounded-2xl border border-white/5">
                        <p className="text-sm text-tech-300 font-light leading-relaxed whitespace-pre-wrap">{item.body}</p>
                    </div>
                )}

                {item.infographicHighlight && (
                    <div className="mb-8 p-8 bg-curiol-gradient rounded-3xl relative overflow-hidden group/info">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/info:scale-110 transition-transform">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-2">AI Infographic Insight</p>
                        <p className="text-white text-lg font-serif italic leading-tight">"{item.infographicHighlight}"</p>
                    </div>
                )}

                {item.mediaScript && (
                    <div className="mb-8 p-6 bg-tech-900 border border-white/5 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-4 h-4 text-tech-500" />
                            <span className="text-[10px] text-tech-500 font-bold uppercase tracking-widest">Guion de Producción IA</span>
                        </div>
                        <p className="text-[11px] text-tech-400 font-light leading-relaxed whitespace-pre-wrap italic">
                            {item.mediaScript}
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-2 text-[10px] text-tech-500 font-bold uppercase tracking-widest hover:text-white transition-all"
                        >
                            <MessageSquare className="w-4 h-4" /> {item.commentsCount || 0}
                        </button>
                        <div className="flex items-center gap-2 text-[10px] text-tech-500 font-bold uppercase tracking-widest">
                            <Share2 className="w-4 h-4" /> {item.sharesCount || 0}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => handleShare('facebook')} className="p-2 bg-tech-900 rounded-lg text-tech-500 hover:text-white transition-all"><Facebook className="w-4 h-4" /></button>
                        <button onClick={() => handleShare('twitter')} className="p-2 bg-tech-900 rounded-lg text-tech-500 hover:text-white transition-all"><Twitter className="w-4 h-4" /></button>
                    </div>
                </div>

                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-8 mt-6 space-y-4">
                                <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                                    <input
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Escribe un comentario..."
                                        className="flex-grow bg-tech-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-curiol-500/50"
                                    />
                                    <button type="submit" className="p-3 bg-curiol-gradient rounded-xl text-white"><Send className="w-4 h-4" /></button>
                                </form>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="p-4 bg-tech-950/50 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest">{comment.author}</span>
                                                <span className="text-[8px] text-tech-700 font-mono">
                                                    {comment.createdAt?.toDate().toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-tech-400 font-light">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
