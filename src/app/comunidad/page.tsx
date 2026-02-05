"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Users, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ComunidadPage() {
    const posts = [
        { title: "El futuro de la fotografía en la era de la IA", category: "Tecnología", date: "Feb 01" },
        { title: "Preservando el legado Chorotega mediante Digitalización", category: "Cultura", date: "Jan 28" },
        { title: "Cómo preparar tu marca personal para 2026", category: "Negocios", date: "Jan 20" }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow">
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-24">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight italic">
                            Comunidad & <br /> <span className="text-curiol-gradient">Conocimiento.</span>
                        </h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light leading-relaxed">
                            En Curiol Studio creemos que la tecnología debe democratizarse. Aquí compartimos nuestros aprendizajes sobre TICs y celebramos el impacto social.
                        </p>
                    </div>
                </header>

                {/* Blog Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="flex items-center gap-4 mb-12">
                        <BookOpen className="text-curiol-500 w-6 h-6" />
                        <h2 className="text-2xl font-serif text-white italic">El Blog del Curiol</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <GlassCard key={post.title} className="group cursor-pointer">
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest block mb-4">{post.category} • {post.date}</span>
                                <h3 className="text-xl font-serif text-white mb-6 group-hover:text-curiol-500 transition-colors leading-snug">{post.title}</h3>
                                <div className="flex items-center gap-2 text-tech-500 text-xs font-bold uppercase tracking-widest">
                                    Leer más <ArrowRight className="w-4 h-4" />
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Social Impact / RSE */}
                <section className="bg-tech-950 py-32 border-y border-tech-800">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-[4/5] bg-tech-900 rounded-3xl overflow-hidden border border-tech-800">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070')] bg-cover bg-center grayscale opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10">
                                <p className="text-white font-serif text-3xl italic">Retratos de Futuro</p>
                                <p className="text-tech-400 text-sm mt-2">Visitas a comunidades de Guanacaste 2025</p>
                            </div>
                        </div>
                        <div>
                            <Heart className="w-12 h-12 text-curiol-500 mb-8" />
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 italic">Responsabilidad <br /> Humana.</h2>
                            <p className="text-tech-400 text-lg font-light leading-relaxed mb-10">
                                Parte de nuestras ganancias financia la documentación gratuita de adultos mayores en zonas rurales, asegurando que su legado visual no se pierda.
                            </p>
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-3xl font-serif text-white italic">+150</p>
                                    <p className="text-tech-500 text-xs uppercase tracking-widest mt-2">Familias Beneficiadas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <AiAssistant />
        </div>
    );
}
