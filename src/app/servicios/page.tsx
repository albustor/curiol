"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { PhygitalSimulation } from "@/components/PhygitalSimulation";
import {
    UserCheck, ShoppingBag, UtensilsCrossed, Home,
    Briefcase, Camera, Smartphone, Binary, ArrowRight, Sparkles, Code, MessageCircle
} from "lucide-react";
import Link from "next/link";

const modalities = [
    { id: "mini", title: "Minisesiones", icon: Sparkles, desc: "Fotografía profesional en sesiones rápidas de 40 minutos. Ideal para capturar la alegría del momento. (₡30.000)." },
    { id: "aventura", title: "Aventura Mágica", icon: Sparkles, desc: "Creamos mundos de fantasía para niños usando arte digital y música que envuelve sus historias. (₡60.000)." },
    { id: "esencia", title: "Esencia Familiar", icon: Camera, desc: "Imágenes artísticas que cobran vida. Incluye cuadros con realidad aumentada para ver tus recuerdos en movimiento. (₡80.000)." },
    { id: "marca", title: "Marca Personal", icon: UserCheck, desc: "Tu imagen es tu carta de presentación. Retratos de alto impacto con tecnología de contacto rápido para tus clientes." },
    { id: "pymes", title: "Vitrina Digital (Web)", icon: Code, desc: "Diseñamos tu espacio en la web. Páginas elegantes y funcionales que cuentan la historia de tu negocio y atraen clientes.", highlight: true },
    { id: "phygital", title: "El Arte de lo Interactivo", icon: Smartphone, desc: "Conectamos tus productos físicos con experiencias digitales mágicas, desde catálogos vivos hasta notificaciones inteligentes.", highlight: true },
    { id: "eventos", title: "Historias que Perduran", icon: Briefcase, desc: "Documentamos tus eventos más importantes con un enfoque artístico y eterno, capturando cada detalle con alma." }
];


const generateServicesSummary = () => {
    const summary = `*Curiol Studio 2026 - Portafolio de Experiencias*\n\n` +
        `*B2C: Legado Familiar*\n` +
        `• *Minisesiones*: ₡30,000 (10 fotos, 1 vez al mes)\n` +
        `• *Aventura Mágica*: ₡60,000 (Arte Niños + Música Especial)\n` +
        `• *Esencia Familiar*: ₡80,000 (25 Fotos + Cuadros que cobran vida)\n` +
        `• *Membresía Legado*: ₡25,000/mes (Tu biógrafo familiar)\n\n` +
        `*B2B: Estrategia Digital*\n` +
        `• *Marca Personal*: ₡65,000 (Retratos + Contacto Digital)\n` +
        `• *Web Landing*: ₡120,000 (Tu Vitrina Express)\n` +
        `• *Web Pro*: ₡250,000 (Plataforma de Negocios Completa)\n\n` +
        `_Fotografía artística potenciada con tecnología de vanguardia._`;
    return `https://wa.me/50660602617?text=${encodeURIComponent(summary)}`;
};

export default function ServiciosPage() {
    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow">
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-24 mt-10 md:mt-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Impacto y Trascendencia</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-cinzel text-white mb-8 leading-tight">
                            Servicios de <br /> <span className="text-curiol-gradient">Impacto Visual.</span>
                        </h1>
                        <p className="text-tech-400 text-base md:text-xl font-light leading-relaxed font-lato">
                            Diseñamos soluciones fotográficas y tecnológicas de alta gama para marcas que buscan trascender. Desde la imagen corporativa hasta la realidad aumentada.
                        </p>
                    </div>
                </header>

                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modalities.map((item) => (
                            <GlassCard key={item.id} className={cn("flex flex-col items-center text-center p-6 md:p-10", item.highlight && "border-curiol-500/30")}>
                                <div className="text-curiol-500 mb-8 p-4 bg-curiol-500/5 rounded-full ring-1 ring-curiol-500/20">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-2xl text-white mb-4 italic">{item.title}</h3>
                                <p className="text-tech-400 text-sm font-light leading-relaxed">{item.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Phygital Simulation */}
                <PhygitalSimulation />

                {/* WhatsApp Share Section */}
                <section className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <GlassCard className="p-8 md:p-12 text-center border-curiol-500/20">
                        <MessageCircle className="w-10 h-10 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-serif text-white italic mb-4">Comparte nuestra propuesta.</h2>
                        <p className="text-tech-400 font-light mb-10 max-w-lg mx-auto leading-relaxed">
                            ¿Deseas compartir nuestro catálogo de servicios y productos con alguien más? Genera un resumen listo para enviar por WhatsApp.
                        </p>
                        <a
                            href={generateServicesSummary()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-green-600/10 border border-green-500/30 text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all rounded-full group"
                        >
                            Enviar Propuesta por WhatsApp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </GlassCard>
                </section>

                {/* CTA Hero */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <div className="bg-gradient-to-r from-tech-950 to-tech-900 border border-tech-800 p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-curiol-700/10 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-serif text-white mb-10 italic">¿Listo para elevar tu marca?</h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link href="/cotizar" className="px-12 py-6 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all transform hover:-translate-y-1 shadow-2xl flex items-center gap-3">
                                    Personalizar mi Propuesta <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link href="/soluciones-web" className="px-12 py-6 border border-tech-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-tech-800 transition-all">
                                    Ver Soluciones Web
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

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
