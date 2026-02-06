"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Users, Heart, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ComunidadPage() {
    const posts = [
        { title: "Digitalización Humana: El puente entre el alma y el código", category: "Estrategia 2026", date: "Feb 05" },
        { title: "Preservando el legado de Nicoya: La tecnología al servicio de la Zona Azul", category: "Cultura & RSE", date: "Jan 28" },
        { title: "IDMV: Por qué tu negocio local no necesita un software inflado", category: "Negocios B2B", date: "Jan 20" }
    ];

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

                {/* Blog Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="flex items-center gap-4 mb-12">
                        <BookOpen className="text-curiol-500 w-6 h-6" />
                        <h2 className="text-2xl font-serif text-white italic">Bitácora de Innovación</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <GlassCard key={post.title} className="group cursor-pointer border-white/5 hover:border-curiol-500/20">
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest block mb-4">{post.category} • {post.date}</span>
                                <h3 className="text-xl font-serif text-white mb-6 group-hover:text-curiol-500 transition-colors leading-snug">{post.title}</h3>
                                <div className="flex items-center gap-2 text-tech-500 text-xs font-bold uppercase tracking-widest">
                                    Explorar artículo <ArrowRight className="w-4 h-4" />
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Niveles de Entrega - Alineados con 2026 */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 italic">Promesa de <span className="text-curiol-gradient">Calidad.</span></h2>
                            <p className="text-tech-400 font-light">Estandarizamos la excelencia técnica para asegurar que tu inversión digital tenga un retorno real y duradero.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassCard className="border-tech-800">
                            <h4 className="font-serif text-2xl text-white italic mb-2">Esencial</h4>
                            <p className="text-[10px] text-curiol-500 uppercase tracking-widest mb-6 font-bold">Respuesta Inmediata</p>
                            <p className="text-sm text-tech-400 font-light leading-relaxed">Calidad garantizada en activos digitales estándar: fotografía curada y web funcional en 15 días.</p>
                        </GlassCard>

                        <GlassCard className="border-curiol-500/30 bg-curiol-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="w-2 h-2 rounded-full bg-curiol-500 animate-pulse" />
                            </div>
                            <h4 className="font-serif text-2xl text-white italic mb-2">Phygital</h4>
                            <p className="text-[10px] text-curiol-500 uppercase tracking-widest mb-6 font-bold">Entrega: 8 días</p>
                            <p className="text-sm text-tech-400 font-light leading-relaxed">Fusión sensorial completa: Canción IA, portal interactivo y cuentos multimedia diseñados para trascender.</p>
                        </GlassCard>

                        <GlassCard className="border-tech-800">
                            <h4 className="font-serif text-2xl text-white italic mb-2">Premium Art</h4>
                            <p className="text-[10px] text-curiol-500 uppercase tracking-widest mb-6 font-bold">Curaduría de Autor</p>
                            <p className="text-sm text-tech-400 font-light leading-relaxed">Para legados que requieren lo tangible: impresión de museo y lienzos de alta gama para la posteridad.</p>
                        </GlassCard>
                    </div>
                </section>

                {/* El resto de la página (RSE) se mantiene igual ya que es el núcleo Social */}
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

                <section className="bg-tech-950 py-32 border-y border-tech-800" id="legado-azul">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-[4/5] bg-tech-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070')] bg-cover bg-center grayscale opacity-40 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-tech-950/20 to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Tributo al Legado</span>
                                <h3 className="text-white font-serif text-4xl italic leading-tight">Zonas Azules: <br /> <span className="text-curiol-gradient">Huellas de Vida.</span></h3>
                                <p className="text-tech-400 text-sm mt-4 font-light leading-relaxed">Nicoya es una de las 5 zonas más longevas del mundo. Documentamos la sabiduría de nuestros "personajes azules" y el potencial de las nuevas generaciones.</p>
                            </div>
                        </div>
                        <div>
                            <div className="inline-flex p-3 bg-curiol-500/10 rounded-full text-curiol-500 mb-8">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 italic">Responsabilidad con <br /> el Patrimonio Vivo.</h2>
                            <p className="text-tech-400 text-lg font-light leading-relaxed mb-10 italic">
                                "Honramos a los personajes azules que han dejado huella en nuestras comunidades, conectando su experiencia con la niñez potencial que hoy empieza a caminar."
                            </p>

                            <div className="p-8 rounded-3xl bg-tech-900/50 border border-curiol-500/20 mb-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-curiol-500 text-xs font-bold uppercase tracking-widest">Experiencia Legado Zona Azul</h4>
                                    <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gold-500/10 rounded-full border border-gold-500/20">Sin Costo Beneficiario</span>
                                </div>
                                <ul className="space-y-4 text-tech-300 text-sm font-light">
                                    <li className="flex gap-3">
                                        <Sparkles className="w-4 h-4 text-curiol-500 shrink-0" />
                                        <span>Sesión de 3 fotografías Fine Art en exterior (en contexto real).</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Sparkles className="w-4 h-4 text-curiol-500 shrink-0" />
                                        <span>Podcast del Corazón: Grabación de audio con diálogo e información del legado.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Sparkles className="w-4 h-4 text-curiol-500 shrink-0" />
                                        <span>Entregable digital con realidad aumentada integrada.</span>
                                    </li>
                                </ul>
                                <p className="mt-6 text-[10px] text-tech-500 italic font-light leading-relaxed border-t border-white/5 pt-4">
                                    * Este proyecto es una iniciativa de Curiol Studio para honrar el patrimonio vivo de nuestras comunidades. Entregado sin cargo a las familias.
                                </p>
                            </div>

                            <div className="mb-12 text-center lg:text-left">
                                <p className="text-tech-600 text-[9px] uppercase tracking-[0.3em] font-bold mb-2">In Memoriam</p>
                                <p className="text-curiol-500/60 font-serif italic text-sm">
                                    Dedicado con amor a <br className="md:hidden" /> Salvador Ortega Angulo y Aura Alvarez Deliyore (q.p.d.)
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-3xl font-serif text-white italic">+150</p>
                                    <p className="text-tech-500 text-[10px] uppercase tracking-widest mt-2 font-bold">Documentaciones Gratuitas</p>
                                </div>
                                <Link href="/cotizar" className="flex items-center gap-2 text-curiol-500 text-xs font-bold uppercase tracking-widest hover:underline self-end pb-1">
                                    Postular una Historia <ArrowRight className="w-4 h-4" />
                                </Link>
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
