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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Option 1: Tasa 0 */}
                        <GlassCard className="p-10 border-curiol-500/20 hover:border-curiol-500/40 transition-all flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-2xl bg-curiol-500/10 flex items-center justify-center text-curiol-500 mb-8 group-hover:bg-curiol-500 group-hover:text-white transition-all shadow-xl shadow-curiol-500/5">
                                <CreditCard className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-serif text-white italic mb-4">Tasa 0 (3 o 6 Meses)</h3>
                            <p className="text-tech-400 text-sm font-light mb-8 leading-relaxed">
                                Disponible para tarjetas de crédito de bancos emisores seleccionados (BCR, BAC, Scotiabank). 0% intereses, sin recargo adicional sobre el precio base.
                            </p>
                            <ul className="text-left w-full space-y-3 mb-10 text-[10px] uppercase tracking-widest font-bold text-tech-500">
                                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-curiol-500" /> Sujeto a aprobación del banco</li>
                                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-curiol-500" /> Disponible para compras mayores a ₡50k</li>
                                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-curiol-500" /> Enlace de pago seguro incluido</li>
                            </ul>
                            <button
                                onClick={() => window.open('https://wa.me/50662856669?text=Hola Alberto, me gustaría pagar mi sesión con Tasa 0.', '_blank')}
                                className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-700 hover:border-curiol-500 transition-all rounded-full"
                            >
                                Solicitar Link Tasa 0
                            </button>
                        </GlassCard>

                        {/* Option 2: Cuotas Curiol */}
                        <GlassCard className="p-10 border-tech-500/20 hover:border-tech-500/40 transition-all flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-2xl bg-tech-500/10 flex items-center justify-center text-tech-500 mb-8 group-hover:bg-tech-500 group-hover:text-white transition-all shadow-xl shadow-tech-500/5">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-serif text-white italic mb-4">Multicuotas Curiol</h3>
                            <p className="text-tech-400 text-sm font-light mb-8 leading-relaxed">
                                Nuestro sistema de financiamiento interno. Diferencia tu inversión en hasta 5 pagos mensuales. Aplica un recargo del 15% sobre el valor total.
                            </p>
                            <ul className="text-left w-full space-y-3 mb-10 text-[10px] uppercase tracking-widest font-bold text-tech-500">
                                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-tech-500" /> Sin trámites bancarios</li>
                                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-tech-500" /> Gestión vía SINPE o Transferencia</li>
                                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-tech-500" /> Contrato de servicios incluido</li>
                            </ul>
                            <button
                                onClick={() => window.open('https://wa.me/50662856669?text=Hola Alberto, me gustaría aplicar al plan de 5 cuotas para mi legado.', '_blank')}
                                className="w-full py-4 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all rounded-full flex items-center justify-center gap-3 shadow-2xl shadow-black/50"
                            >
                                Aplicar Plan Cuotas <ArrowRight className="w-4 h-4" />
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
