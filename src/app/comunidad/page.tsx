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

                {/* Entrega por Categorías */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 italic">Modelos de <span className="text-curiol-gradient">Entrega.</span></h2>
                            <p className="text-tech-400 font-light">Diseñamos diferentes niveles de experiencia para adaptarnos a la velocidad y profundidad que tu legado requiere.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard className="border-tech-800">
                            <h4 className="font-serif text-2xl text-white italic mb-2">Estándar</h4>
                            <p className="text-[10px] text-curiol-500 uppercase tracking-widest mb-6 font-bold">Entrega: 15 días</p>
                            <p className="text-sm text-tech-400 font-light leading-relaxed">Álbum digital curado y video detrás de escena. La pureza de la imagen capturada con precisión profesional.</p>
                        </GlassCard>

                        <GlassCard className="border-curiol-500/30 bg-curiol-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="w-2 h-2 rounded-full bg-curiol-500 animate-pulse" />
                            </div>
                            <h4 className="font-serif text-2xl text-white italic mb-2">Premium</h4>
                            <p className="text-[10px] text-curiol-500 uppercase tracking-widest mb-6 font-bold">Entrega: 8 días</p>
                            <p className="text-sm text-tech-400 font-light leading-relaxed">Portal exclusivo, Canción IA personalizada, Slideshow musical y Cuento Multimedia. Una narrativa completa para tus sentidos.</p>
                        </GlassCard>

                        <GlassCard className="border-tech-800">
                            <h4 className="font-serif text-2xl text-white italic mb-2">Fine Art</h4>
                            <p className="text-[10px] text-curiol-500 uppercase tracking-widest mb-6 font-bold">Novedad 2026</p>
                            <p className="text-sm text-tech-400 font-light leading-relaxed">Álbumes profesionales impresos y Canvas de museo. Lo tangible se vuelve eterno a través de la impresión de alta gama.</p>
                        </GlassCard>
                    </div>
                </section>

                {/* Phygital Experience */}
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
                            <div className="relative">
                                <div className="aspect-square bg-tech-800 rounded-3xl border border-tech-700 overflow-hidden">
                                    {/* Representación visual de AR */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-48 h-48 border-2 border-curiol-500/50 rounded-full animate-[ping_3s_infinite]" />
                                        <div className="absolute w-32 h-32 border-2 border-curiol-500/30 rounded-full animate-[ping_2s_infinite]" />
                                        <div className="text-white text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">Scanning...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Legado Anual */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40 text-center">
                    <div className="max-w-3xl mx-auto">
                        <Users className="w-12 h-12 text-curiol-500 mx-auto mb-8" />
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 italic">Plan Legado Anual.</h2>
                        <p className="text-tech-400 text-lg font-light leading-relaxed mb-12">
                            La historia de una familia no se cuenta en una sola sesión. Nuestra membresía anual permite documentar el crecimiento y los hitos de tu familia con prioridad técnica y beneficios exclusivos en digitalización de recuerdos.
                        </p>
                        <Link href="/cotizar" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-tech-950 text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 hover:text-white transition-all">
                            Consultar Membresía <ArrowRight className="w-4 h-4" />
                        </Link>
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
