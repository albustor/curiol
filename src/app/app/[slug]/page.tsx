"use client";

import { use } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Camera, Music, Play, Smartphone, Share2, Download } from "lucide-react";

export default function ClientAppPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    // En producción, estos datos vendrían de Firestore
    const clientData = {
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        date: "4 de Febrero, 2026",
        service: "Esencia Familiar + AR",
        photos: ["/hero-bg.jpg", "/hero-bg.jpg", "/hero-bg.jpg"], // Placeholders
        aiSong: "Melodía del Legado.mp3",
        arTrigger: "https://artivive.com"
    };

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="mb-16">
                    <div className="flex justify-between items-end gap-6 flex-wrap">
                        <div>
                            <span className="text-curiol-500 text-[10px] uppercase font-bold tracking-[0.4em] mb-4 block">Entregable Digital</span>
                            <h1 className="text-4xl md:text-6xl font-serif text-white italic">{clientData.name}</h1>
                            <p className="text-tech-500 text-sm mt-4">{clientData.service} • {clientData.date}</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 bg-tech-900 border border-tech-800 text-tech-400 hover:text-white rounded-full transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-tech-900 border border-tech-800 text-tech-400 hover:text-white rounded-full transition-all">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Gallery */}
                    <div className="lg:col-span-2 space-y-10">
                        <h3 className="text-2xl font-serif text-white italic flex items-center gap-3">
                            <Camera className="w-6 h-6 text-curiol-500" /> Galería Fine Art
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[4/5] bg-tech-900 rounded-xl overflow-hidden border border-tech-800 group cursor-zoom-in">
                                    <div className="w-full h-full bg-tech-800 animate-pulse group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI & AR Sidebar */}
                    <div className="space-y-8">
                        {/* AI Song Player */}
                        <GlassCard className="border-curiol-500/20">
                            <div className="flex items-center gap-3 mb-6">
                                <Music className="w-5 h-5 text-curiol-500" />
                                <h4 className="text-white font-serif text-lg italic">Himno IA Personalizado</h4>
                            </div>
                            <div className="bg-tech-950/50 p-6 rounded-xl border border-tech-800">
                                <div className="flex items-center gap-4 mb-4">
                                    <button className="w-12 h-12 bg-curiol-700 rounded-full flex items-center justify-center text-white hover:bg-curiol-500 transition-all">
                                        <Play className="w-5 h-5 fill-current" />
                                    </button>
                                    <div>
                                        <p className="text-white text-sm font-bold">Resonancia Familiar</p>
                                        <p className="text-tech-500 text-[10px] uppercase">Generado por Gemini + Suno</p>
                                    </div>
                                </div>
                                <div className="w-full h-1 bg-tech-800 rounded-full overflow-hidden">
                                    <div className="w-1/3 h-full bg-curiol-500" />
                                </div>
                            </div>
                        </GlassCard>

                        {/* AR Instructions */}
                        <GlassCard className="border-tech-500/20">
                            <div className="flex items-center gap-3 mb-6">
                                <Smartphone className="w-5 h-5 text-tech-500" />
                                <h4 className="text-white font-serif text-lg italic">Tu Fotografía Cobran Vida</h4>
                            </div>
                            <p className="text-tech-400 text-sm font-light mb-6">
                                Escanea tus cuadros físicos con la aplicación de Curiol Studio para ver el video detrás de la imagen.
                            </p>
                            <button className="w-full py-4 border border-tech-700 text-tech-500 text-[10px] font-bold uppercase tracking-widest hover:bg-tech-800 transition-all">
                                Tutorial de Realidad Aumentada
                            </button>
                        </GlassCard>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
