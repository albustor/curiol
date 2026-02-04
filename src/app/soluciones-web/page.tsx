import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Target, TrendingUp, Zap, MessageSquare, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function SolucionesWebPage() {
    const plans = [
        {
            name: "Presencia Express",
            subtitle: "Ideal para Marcas Personales",
            price: 85000,
            features: [
                "1 Landing Page de alto impacto",
                "Link-in-bio avanzado",
                "Botón directo a WhatsApp",
                "Integración de Redes Sociales",
                "Optimización de Foto Perfil"
            ],
            color: "tech"
        },
        {
            name: "Negocio Pro",
            subtitle: "Para PyMES en Crecimiento",
            price: 145000,
            features: [
                "Hasta 4 Secciones (Inicio, Galería, etc)",
                "Formulario de Cotización",
                "Google Maps Integrado",
                "Panel Autogestionable IA",
                "1 Sesión de Fotos Producto (-15%)"
            ],
            primary: true,
            color: "curiol"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-32">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-12 bg-tech-500"></span>
                            <span className="text-tech-500 text-xs font-bold tracking-[0.3em] uppercase">Impulso Emprendedor</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight italic">
                            Acelera tu <br /> <span className="text-curiol-gradient">Presencia Digital.</span>
                        </h1>
                        <p className="text-tech-400 text-lg md:text-xl font-light leading-relaxed">
                            No necesitas pagar miles de dólares por una web compleja. Creamos tu infraestructura digital ágil para que el comercio local de Guanacaste compita al más alto nivel.
                        </p>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <GlassCard
                                key={plan.name}
                                className={cn(
                                    "p-12 relative overflow-hidden flex flex-col justify-between",
                                    plan.primary ? "border-curiol-500/30 bg-curiol-900/10" : "border-tech-800"
                                )}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-serif text-white italic mb-2">{plan.name}</h3>
                                            <p className="text-tech-500 text-xs uppercase tracking-widest">{plan.subtitle}</p>
                                        </div>
                                        {plan.primary && <Zap className="w-6 h-6 text-curiol-500" />}
                                    </div>

                                    <div className="mb-10">
                                        <span className="text-4xl font-serif text-white italic">₡{plan.price.toLocaleString()}</span>
                                        <span className="text-tech-500 text-xs ml-2 uppercase">Pago Único</span>
                                    </div>

                                    <ul className="space-y-4 mb-12">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex gap-3 text-sm text-tech-300 font-light">
                                                <Check className={cn("w-4 h-4 flex-shrink-0", plan.primary ? "text-curiol-500" : "text-tech-500")} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href="/cotizar"
                                    className={cn(
                                        "w-full py-5 text-[10px] font-bold uppercase tracking-widest text-center transition-all",
                                        plan.primary ? "bg-curiol-700 text-white hover:bg-curiol-500" : "bg-tech-800 text-white hover:bg-tech-700"
                                    )}
                                >
                                    Seleccionar este Plan
                                </Link>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* ROI Calculator Section (Visual Representation) */}
                <section className="py-24 bg-tech-950 border-t border-tech-800">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-serif text-white mb-8 italic">El Costo de <span className="text-curiol-500">no estar.</span></h2>
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-tech-800 flex items-center justify-center flex-shrink-0">
                                        <Target className="w-6 h-6 text-tech-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-serif text-xl mb-2 italic">Menos Visibilidad</h4>
                                        <p className="text-tech-500 text-sm font-light">Si no eres fácil de encontrar en Google o Redes, tus potenciales clientes llamarán a tu competencia.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-tech-800 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-serif text-xl mb-2 italic">Credibilidad & Confianza</h4>
                                        <p className="text-tech-500 text-sm font-light">Una web profesional eleva tu autoridad ante profesionales y turistas que visitan la zona.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <GlassCard className="p-12 border-curiol-500/10">
                            <div className="bg-tech-900/50 p-8 rounded-xl border border-tech-800">
                                <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest mb-6">Calculadora de Impacto Estimado</p>
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between text-xs text-tech-300 mb-2 font-bold uppercase">
                                            <span>Conversión Actual</span>
                                            <span>2%</span>
                                        </div>
                                        <div className="h-1 bg-tech-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-tech-700 w-[20%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-curiol-500 mb-2 font-bold uppercase">
                                            <span>Con Curiol Studio</span>
                                            <span>15% - 25%</span>
                                        </div>
                                        <div className="h-1 bg-tech-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-curiol-500 w-[75%] animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 pt-8 border-t border-tech-800 text-center">
                                    <p className="text-white font-light text-sm italic">"Tu inversión se recupera con apenas 3-5 cierres de ventas adicionales."</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </section>

                {/* AI Helper CTA */}
                <section className="py-32 px-4 md:px-8 lg:px-16 text-center">
                    <MessageSquare className="w-12 h-12 text-curiol-500 mx-auto mb-8" />
                    <h2 className="text-4xl font-serif text-white mb-8 italic">¿No sabes qué escribir en tu nueva web?</h2>
                    <p className="text-tech-400 max-w-xl mx-auto mb-10 font-light">
                        No te preocupes. Nuestra IA de Curiol Studio te ayuda a redactar los textos persuasivos de tu negocio de forma gratuita al contratar cualquier plan.
                    </p>
                    <Link href="mailto:hola@curiol.studio" className="px-10 py-5 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full">
                        Empezar hoy mismo
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
