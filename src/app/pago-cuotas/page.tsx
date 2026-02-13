"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { CreditCard, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PagoCuotasPage() {
    return (
        <div className="min-h-screen flex flex-col bg-tech-950">
            <Navbar />

            <main className="flex-grow pt-40 pb-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-curiol-500/10 blur-[150px] rounded-full -mr-32 -mt-32 animate-pulse" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="mb-16 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="h-[1px] w-8 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Ecosistema Financiero 2026</span>
                            <span className="h-[1px] w-8 bg-curiol-500"></span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif text-white italic mb-8">Financiamiento <br /><span className="text-curiol-gradient">Tasa 0 & Cuotas</span></h1>
                        <p className="text-tech-400 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                            Tu legado no debería esperar. Hemos diseñado opciones flexibles para que puedas asegurar tu patrimonio hoy mismo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Option 1: Tasa 0 */}
                        <GlassCard className="p-8 border-curiol-500/10 hover:border-curiol-500/30 transition-all flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-curiol-500/10 flex items-center justify-center text-curiol-500 mb-6 group-hover:bg-curiol-500 group-hover:text-white transition-all">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-serif text-white italic mb-4">Tasa 0 BCR</h3>
                            <p className="text-tech-400 text-[11px] font-light mb-6 leading-relaxed">
                                Convenio exclusivo para tarjetas del **Banco de Costa Rica**. 0% interés al precio de catálogo.
                            </p>
                            <ul className="text-left w-full space-y-2 mb-8 text-[9px] uppercase tracking-widest font-bold text-tech-500">
                                <li className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-curiol-500" /> Plazos de 3 o 6 meses</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-curiol-500" /> Sujeto a aprobación BCR</li>
                            </ul>
                            <button
                                onClick={() => window.open('https://wa.me/50662856669?text=Hola Alberto, me gustaría pagar con Tasa 0 del BCR.', '_blank')}
                                className="w-full py-3 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-curiol-700 transition-all rounded-full mt-auto"
                            >
                                Info BCR Tasa 0
                            </button>
                        </GlassCard>

                        {/* Option 2: Contado */}
                        <GlassCard className="p-8 border-tech-500/10 hover:border-tech-500/30 transition-all flex flex-col items-center text-center group bg-tech-900/40">
                            <div className="w-16 h-16 rounded-2xl bg-tech-500/10 flex items-center justify-center text-tech-500 mb-6 group-hover:bg-tech-500 group-hover:text-white transition-all">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-serif text-white italic mb-4">Pago Contado</h3>
                            <p className="text-tech-400 text-[11px] font-light mb-6 leading-relaxed">
                                Recibe un **15% de descuento directo** sobre el precio de catálogo al realizar un pago único.
                            </p>
                            <ul className="text-left w-full space-y-2 mb-8 text-[9px] uppercase tracking-widest font-bold text-tech-500">
                                <li className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-tech-500" /> Beneficio inmediato</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-tech-500" /> SINPE o Transferencia</li>
                            </ul>
                            <button
                                onClick={() => window.open('https://wa.me/50662856669?text=Hola Alberto, me gustaría aplicar el descuento por pago de contado.', '_blank')}
                                className="w-full py-3 bg-tech-800 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all rounded-full mt-auto"
                            >
                                Aplicar -15% Contado
                            </button>
                        </GlassCard>

                        {/* Option 3: 3 Cuotas Curiol */}
                        <GlassCard className="p-8 border-white/10 hover:border-white/20 transition-all flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-tech-950 transition-all">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-serif text-white italic mb-4">3 Cuotas Curiol</h3>
                            <p className="text-tech-400 text-[11px] font-light mb-6 leading-relaxed">
                                Financiamiento interno diseñado para tu comodidad, dividido en tres momentos clave del proceso.
                            </p>
                            <ul className="text-left w-full space-y-2 mb-8 text-[9px] uppercase tracking-widest font-bold text-tech-500">
                                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-curiol-500" /> 1. Reservación (Inicio)</li>
                                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-curiol-500" /> 2. Día de Producción</li>
                                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-curiol-500" /> 3. Fecha de Entrega*</li>
                            </ul>
                            <p className="text-[8px] text-tech-600 italic mb-6">*No mayor a 2 meses después de la sesión.</p>
                            <button
                                onClick={() => window.open('https://wa.me/50662856669?text=Hola Alberto, me interesa el plan de 3 cuotas (Reserva/Producción/Entrega).', '_blank')}
                                className="w-full py-3 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-tech-100 hover:text-tech-950 transition-all rounded-full mt-auto"
                            >
                                Solicitar Plan 3 Cuotas
                            </button>
                        </GlassCard>
                    </div>

                    <div className="mt-20 p-12 bg-tech-900/50 border border-white/5 rounded-[3rem] text-center">
                        <h4 className="text-white font-serif text-xl italic mb-6">Seguridad Certificada</h4>
                        <p className="text-tech-500 text-xs font-light max-w-xl mx-auto leading-relaxed">
                            Todas nuestras transacciones digitales se procesan mediante túneles de encriptación de grado bancario. No almacenamos datos sensibles de tarjetas en nuestros servidores.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
