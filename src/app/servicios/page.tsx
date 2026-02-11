"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { PhygitalSimulation } from "@/components/PhygitalSimulation";
import { AgendaWidget } from "@/components/AgendaWidget";
import {
    UserCheck, ShoppingBag, UtensilsCrossed, Home,
    Briefcase, Camera, Smartphone, Binary, ArrowRight, Sparkles, Code, MessageCircle, Users
} from "lucide-react";
import Link from "next/link";

const modalities = [
    { id: "aventura", title: "Aventura Mágica", icon: Sparkles, desc: "Donde la imaginación cobra vida. Transformamos a los más pequeños en héroes de su propia historia, creando mundos de alegría y seguridad que se convierten en un legado visual eterno. (₡80.900 / $165)." },
    { id: "recuerdos", title: "Recuerdos Eternos", icon: Camera, desc: "Un tributo a la esencia del ayer y el hoy. Conectamos quiénes fuimos con quienes somos, valorando el presente a través de un arte fotográfico que trasciende el tiempo. (₡77.000 / $149)." },
    { id: "marca", title: "Marca Personal", icon: UserCheck, desc: "Presencia que abre puertas. Diseñamos una identidad visual estratégica para profesionales que buscan posicionamiento, coherencia y nuevas oportunidades en su mercado. (₡89.000 / $179)." },
    { id: "legado", title: "Membresía Legado", icon: Users, desc: "Tu patrimonio emocional protegido. Un acompañamiento anual con sesiones programadas diseñadas para documentar tu evolución mientras optimizamos tu inversión. (₡25.000 / $59 mes)." },
    { id: "express", title: "Web-Apps Progresivas (PWA)", icon: Smartphone, desc: "Experiencia nativa sin fricción. Aplicaciones web de alto rendimiento que funcionan sin conexión y se instalan en cualquier dispositivo para maximizar la retención del cliente. (₡250.000 / $500).", highlight: true },
    { id: "negocio", title: "Metodologías No-Code/IA Eficientes", icon: Code, desc: "Agilidad sin límites. Desarrollamos soluciones complejas a la velocidad del pensamiento, optimizando tiempos y costos mediante ingeniería de vanguardia asistida por IA. (₡750.000 / $1500).", highlight: true },
    { id: "ultra", title: "Módulos de IA para Comercio Local", icon: Binary, desc: "Cerebro digital para tu negocio. Implementamos motores de inteligencia artificial que automatizan ventas y atención, adaptados específicamente a la realidad de tu comunidad. (₡1.500.000 / $3000)." },
    { id: "mantenimiento", title: "Mantenimiento Evolutivo Trimestral", icon: Sparkles, desc: "Tu tecnología nunca duerme. Transformamos lo que la IA aprende de la interacción diaria de tu negocio en actualizaciones constantes, asegurando una ventaja competitiva perpetua. (₡15.000 / $39 mes)." }
];

const generateServicesSummary = () => {
    const summary = `*Curiol Studio 2026 - Legado vivo & Soluciones Comerciales*\n\n` +
        `*LEGADO FAMILIAR (B2C)*\n` +
        `• *Aventura Mágica*: ₡80.9k / $165\n` +
        `• *Recuerdos Eternos*: ₡77k / $149\n` +
        `• *Marca Personal*: ₡89k / $179\n` +
        `• *Membresía Legado*: ₡25k / $59 mes\n\n` +
        `*SOLUCIONES COMERCIALES (B2B)*\n` +
        `• *Omni Local*: ₡250k / $500\n` +
        `• *Omni Pro*: ₡750k / $1500\n` +
        `• *Omni Ultra*: ₡1.5M / $3000\n\n` +
        `_Ingeniería digital con sensibilidad artística._`;
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
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.3em] uppercase">Legado Familiar</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[0.9] italic">
                            Portafolio de <br /> <span className="text-curiol-gradient">Experiencias 2026.</span>
                        </h1>
                        <p className="text-tech-400 text-base md:text-xl font-light leading-relaxed">
                            Diseñamos activos digitales que trascienden el tiempo. Desde las memorias vivas familiares hasta la aceleración tecnológica para el comercio local.
                        </p>
                    </div>
                </header>

                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modalities.map((item) => (
                            <GlassCard key={item.id} className={cn("flex flex-col items-center text-center p-6 md:p-10", item.highlight && "border-tech-500 shadow-2xl shadow-tech-500/10")}>
                                <div className={cn("mb-8 p-4 rounded-full ring-1", item.highlight ? "text-tech-500 bg-tech-500/5 ring-tech-500/20" : "text-curiol-500 bg-curiol-500/5 ring-curiol-500/20")}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-2xl text-white mb-4 italic leading-tight">{item.title}</h3>
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
                        <h2 className="text-3xl font-serif text-white italic mb-4">Consulta Express por WhatsApp.</h2>
                        <p className="text-tech-400 font-light mb-10 max-w-lg mx-auto leading-relaxed">
                            Genera un resumen detallado del catálogo 2026 y envíalo directamente a nuestro canal oficial para una asesoría personalizada.
                        </p>
                        <a
                            href={generateServicesSummary()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-green-600/10 border border-green-500/30 text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all rounded-full group"
                        >
                            Solicitar Asesoría por WhatsApp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </GlassCard>
                </section>

                {/* CTA Hero */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <AgendaWidget />
                        <div className="bg-gradient-to-r from-tech-950 to-tech-900 border border-tech-800 p-12 rounded-[3rem] text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-curiol-700/10 via-transparent to-transparent opacity-50" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-serif text-white mb-8 italic">¿Listo para empezar?</h2>
                                <Link href="/cotizar" className="inline-flex items-center gap-4 px-10 py-5 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full">
                                    Personalizar mi Legado <ArrowRight className="w-4 h-4" />
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
