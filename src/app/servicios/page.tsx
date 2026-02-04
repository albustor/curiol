import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    UserCheck, ShoppingBag, UtensilsCrossed, Home,
    Briefcase, Camera, Smartphone, Binary, ArrowRight
} from "lucide-react";
import Link from "next/link";

const modalities = [
    { id: "personal", title: "Marca Personal", icon: UserCheck, desc: "Retratos de autor que proyectan autoridad y coherencia líder." },
    { id: "ecommerce", title: "E-commerce", icon: ShoppingBag, desc: "Fotografía de catálogo diseñada para optimizar la conversión digital." },
    { id: "gastronomia", title: "Gastronomía", icon: UtensilsCrossed, desc: "Capturamos texturas y sabores con stylist culinario de alta gama." },
    { id: "arquitectura", title: "Arquitectura", icon: Home, desc: "Documentación de espacios y real estate con precisión técnica." },
    { id: "corporativo", title: "Corporativo", icon: Briefcase, desc: "Cobertura estratégica de hitos empresariales y lanzamientos." },
    { id: "headshots", title: "Headshots Pro", icon: Camera, desc: "Sesiones dinámicas para equipos y perfiles impecables en LinkedIn." },
    { id: "social", title: "Social Hub", icon: Smartphone, desc: "Creación de contenido vertical optimizado (Reels/TikTok) de alto impacto." },
    { id: "phygital", title: "Estrategia Phygital", icon: Binary, desc: "Integramos Realidad Aumentada a tu material impreso legado.", highlight: true }
];

export default function ServiciosPage() {
    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow">
                <header className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-24">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-xs font-bold tracking-[0.3em] uppercase">Ecosistema B2B</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight italic">
                            Servicios de <br /> <span className="text-curiol-gradient">Impacto Visual.</span>
                        </h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light leading-relaxed">
                            Diseñamos soluciones fotográficas y tecnológicas de alta gama para marcas que buscan trascender. Desde la imagen corporativa hasta la realidad aumentada.
                        </p>
                    </div>
                </header>

                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modalities.map((item) => (
                            <GlassCard key={item.id} className={cn("flex flex-col items-center text-center p-10", item.highlight && "border-curiol-500/30")}>
                                <div className="text-curiol-500 mb-8 p-4 bg-curiol-500/5 rounded-full ring-1 ring-curiol-500/20">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-2xl text-white mb-4 italic">{item.title}</h3>
                                <p className="text-tech-400 text-sm font-light leading-relaxed">{item.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
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
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
