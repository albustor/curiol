"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Users, Heart, ArrowRight, Sparkles, MessageSquare, Share2, Send, Facebook, Instagram, Twitter, Lock, Calendar } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, increment, updateDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logInteraction } from "@/actions/analytics";

interface AcademyContent {
    id: string;
    title: string;
    description: string;
    excerpt: string;
    category: string;
    imageUrl: string;
    content: string;
    videoUrl?: string;
    isLocked: boolean;
    unlockCode?: string;
    accessLevel?: 'public' | 'premium'; // New field for Phase 20
    author?: string;
    readTime?: string;
    sharesCount?: number;
    commentsCount?: number;
    isPublished: boolean;
    createdAt: any;
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockKey, setUnlockKey] = useState("");
    const [error, setError] = useState("");

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (!showComments) return;

        // Log interaction: Opened comments
        logInteraction("academy_read", {
            articleId: item.id,
            articleTitle: item.title,
            action: "view_comments"
        });

        const q = query(collection(db, `academy_content/${item.id}/comments`), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
            setComments(data);
        });
        return () => unsubscribe();
    }, [showComments, item.id, item.title]);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (item.unlockCode && unlockKey.toUpperCase() === item.unlockCode.toUpperCase()) {
            setIsExpanded(true); // Unlock and expand the content
            setShowUnlockModal(false);
            // Optionally, update a user's session or state to remember this unlock
        } else {
            setError("Llave incorrecta. Intenta de nuevo.");
        }
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

            // Log interaction: Added comment
            logInteraction("academy_read", {
                articleId: item.id,
                articleTitle: item.title,
                action: "add_comment"
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

            // Log interaction: Shared
            logInteraction("link_click", {
                articleId: item.id,
                articleTitle: item.title,
                platform
            });
        }
    };

    const isPremium = item.accessLevel === 'premium';
    const isActuallyLocked = item.isLocked || isPremium;

    return (
        <>
            <GlassCard
                className="group cursor-pointer hover:border-curiol-500/50 transition-all flex flex-col h-full overflow-hidden"
                onClick={() => !isActuallyLocked && setIsExpanded(true)}
            >
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-tech-950/20 group-hover:bg-tech-950/0 transition-colors" />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-tech-950/80 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-bold uppercase tracking-widest text-curiol-500">
                            {item.category}
                        </span>
                    </div>
                    {isActuallyLocked && (
                        <div className="absolute top-4 right-4 p-2 bg-tech-950/80 backdrop-blur-md border border-white/10 rounded-full text-white">
                            <Lock className="w-3 h-3" />
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-tech-500 text-[10px] font-bold uppercase tracking-widest">
                            <Calendar className="w-3 h-3" />
                            {item.readTime || "5 min read"}
                        </div>
                        {isActuallyLocked ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowUnlockModal(true); }}
                                className="flex items-center gap-2 text-curiol-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
                            >
                                <Sparkles className="w-3 h-3" /> Desbloquear
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" /> Abierto
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-serif text-white italic mb-3 group-hover:text-curiol-500 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-tech-400 text-xs font-light leading-relaxed line-clamp-3 mb-6">
                        {item.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-tech-600 text-[10px]">
                                <MessageSquare className="w-3 h-3" /> {item.commentsCount || 0}
                            </div>
                            <div className="flex items-center gap-1 text-tech-600 text-[10px]">
                                <Share2 className="w-3 h-3" /> {item.sharesCount || 0}
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-tech-800 group-hover:text-white transition-all translate-x-0 group-hover:translate-x-1" />
                    </div>
                </div>
            </GlassCard>

            {/* Unlock Modal */}
            <AnimatePresence>
                {showUnlockModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-tech-950/90 backdrop-blur-md"
                            onClick={() => setShowUnlockModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-tech-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-curiol-500/10 rounded-full blur-3xl" />

                            <div className="text-center relative z-10">
                                <div className="w-16 h-16 bg-curiol-500/10 rounded-2xl flex items-center justify-center text-curiol-500 mx-auto mb-6">
                                    <Lock className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif text-white italic mb-4">Área Exclusiva</h3>
                                <p className="text-tech-400 text-sm font-light leading-relaxed mb-8">
                                    {isPremium
                                        ? "Este contenido está reservado para el Círculo de Confianza Curiol (clientes activos con historial de adquisición)."
                                        : "Esta lección requiere una llave de acceso especial para visualizar su contenido completo."
                                    }
                                </p>

                                <form onSubmit={handleUnlock} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Ingresa tu Llave Maestra"
                                        className="w-full bg-tech-800 border-white/5 rounded-xl px-6 py-4 text-white text-sm focus:outline-none focus:border-curiol-500 transition-all text-center tracking-widest uppercase font-bold"
                                        value={unlockKey}
                                        onChange={(e) => setUnlockKey(e.target.value)}
                                    />
                                    {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}
                                    <button className="w-full py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-curiol-500/20 hover:brightness-110 transition-all">
                                        Validar Acceso
                                    </button>
                                </form>

                                <button
                                    onClick={() => setShowUnlockModal(false)}
                                    className="mt-6 text-tech-600 hover:text-white transition-all text-[8px] font-bold uppercase tracking-widest"
                                >
                                    Tal vez luego
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
