"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Camera, Music, Play, Smartphone, Share2, Download, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ClientAppPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [clientData, setClientData] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                const q = query(collection(db, "deliveries"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    setClientData(docData);
                } else {
                    console.error("No se encontró la entrega para el slug:", slug);
                }
            } catch (error) {
                console.error("Error fetching client data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleDownload = (photoUrl: string, format: string) => {
        const downloadUrl = `/api/download?url=${encodeURIComponent(photoUrl)}&format=${format}`;
        window.location.href = downloadUrl;
    };

    const handleShare = () => {
        const shareLink = window.location.href;
        navigator.clipboard.writeText(shareLink);
        alert("¡Enlace de galería copiado! Puedes enviarlo por WhatsApp a tu familia.");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-tech-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="mb-16">
                    <div className="flex justify-between items-end gap-6 flex-wrap">
                        <div>
                            <span className="text-curiol-500 text-[10px] uppercase font-bold tracking-[0.4em] mb-4 block">Entrega de Producción</span>
                            <h1 className="text-4xl md:text-6xl font-serif text-white italic">{clientData?.name}</h1>
                            <p className="text-tech-500 text-sm mt-4">{clientData?.service} • {clientData?.date}</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-6 py-3 bg-curiol-700 text-white rounded-full hover:bg-curiol-500 transition-all text-xs font-bold uppercase tracking-widest shadow-xl"
                            >
                                <Share2 className="w-4 h-4" /> Compartir con la Familia
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Gallery */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif text-white italic flex items-center gap-3">
                                <Camera className="w-6 h-6 text-curiol-500" /> Galería Fine Art
                            </h3>
                            <span className="text-tech-500 text-[10px] uppercase font-bold tracking-widest">Toca una foto para descargar</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {clientData?.photos.map((photo: string, i: number) => (
                                <div key={i} className="group relative">
                                    <div className="aspect-[4/5] bg-tech-900 rounded-2xl overflow-hidden border border-tech-800 transition-all duration-500">
                                        <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-tech-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                            <p className="text-tech-400 text-[10px] uppercase font-bold tracking-widest mb-4">Descargar Formatos:</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => handleDownload(photo, 'orig')}
                                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg flex flex-col items-center gap-1 transition-all"
                                                >
                                                    <Download className="w-4 h-4 text-white" />
                                                    <span className="text-[8px] text-white uppercase font-bold">Imprenta</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(photo, 'fb')}
                                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg flex flex-col items-center gap-1 transition-all"
                                                >
                                                    <Download className="w-4 h-4 text-white" />
                                                    <span className="text-[8px] text-white uppercase font-bold">FB</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(photo, 'ig')}
                                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg flex flex-col items-center gap-1 transition-all"
                                                >
                                                    <Download className="w-4 h-4 text-white" />
                                                    <span className="text-[8px] text-white uppercase font-bold">IG (4:5)</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI & AR Sidebar */}
                    <div className="space-y-8">
                        {/* Memoria Viva Section */}
                        <GlassCard className="border-curiol-500/20 py-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-5 h-5 text-curiol-500" />
                                <h4 className="text-white font-serif text-xl italic">Memoria Viva</h4>
                            </div>
                            <div className="bg-tech-950/50 p-6 rounded-2xl border border-tech-800 mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <button className="w-14 h-14 bg-curiol-700 rounded-full flex items-center justify-center text-white hover:bg-curiol-500 transition-all shadow-lg ring-4 ring-curiol-700/20">
                                        <Play className="w-6 h-6 fill-current" />
                                    </button>
                                    <div>
                                        <p className="text-white text-base font-serif italic">Himno Familiar IA</p>
                                        <p className="text-tech-500 text-[10px] uppercase font-bold">Slideshow Fotográfico & Música</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-full h-1 bg-tech-800 rounded-full overflow-hidden">
                                        <div className="w-1/3 h-full bg-curiol-gradient animate-pulse" />
                                    </div>
                                    <div className="flex justify-between text-[8px] text-tech-600 font-bold uppercase">
                                        <span>0:45</span>
                                        <span>3:20</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-tech-400 text-xs font-light leading-relaxed mb-6">
                                Tu historia convertida en una obra cinematográfica. Esta pieza fusiona tus mejores retratos con una composición musical generada para tu familia.
                            </p>
                        </GlassCard>

                        {/* Video Detrás de Escena */}
                        <GlassCard className="border-tech-500/10">
                            <div className="flex items-center gap-3 mb-6">
                                <Play className="w-5 h-5 text-tech-500" />
                                <h4 className="text-white font-serif text-lg italic">Behind the Scenes</h4>
                            </div>
                            <div className="aspect-video bg-tech-900 rounded-xl overflow-hidden relative group cursor-pointer border border-tech-800">
                                <div className="absolute inset-0 bg-tech-950/40 group-hover:bg-transparent transition-all flex items-center justify-center">
                                    <Play className="w-10 h-10 text-white opacity-50 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100" />
                                </div>
                            </div>
                            <p className="text-tech-500 text-[10px] mt-4 uppercase font-bold tracking-widest">Documental de la Sesión</p>
                        </GlassCard>

                        {/* AR Instructions */}
                        <GlassCard className="border-tech-500/20">
                            <div className="flex items-center gap-3 mb-6">
                                <Smartphone className="w-5 h-5 text-tech-500" />
                                <h4 className="text-white font-serif text-lg italic">¿Cómo activar el AR?</h4>
                            </div>
                            <p className="text-tech-400 text-sm font-light mb-6">
                                1. Escanea el cuadro vivo.<br />
                                2. Apunta tu cámara.<br />
                                3. Mira cómo el video emerge.
                            </p>
                            <a
                                href={clientData?.arTrigger}
                                target="_blank"
                                className="w-full py-4 bg-tech-900 border border-tech-700 text-tech-400 text-[10px] font-bold uppercase tracking-widest hover:border-curiol-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                Lanzar Escáner <ExternalLink className="w-3 h-3" />
                            </a>
                        </GlassCard>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
