"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { CreditCard, ShieldCheck, Sparkles, ArrowRight, FileCheck } from "lucide-react";
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

                        {/* Option 3: 5 Cuotas Curiol */}
                        <GlassCard className="p-8 border-white/10 hover:border-white/20 transition-all flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-tech-950 transition-all">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-serif text-white italic mb-4">5 Cuotas Curiol</h3>
                            <p className="text-tech-400 text-[11px] font-light mb-6 leading-relaxed">
                                Financia tu patrimonio emocional en **5 cuotas mensuales fijas**, permitiendo que tu presupuesto fluya con tu historia.
                            </p>
                            <ul className="text-left w-full space-y-2 mb-8 text-[9px] uppercase tracking-widest font-bold text-tech-500">
                                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-curiol-500" /> Sin trámites bancarios</li>
                                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-curiol-500" /> Cuotas desde ₡16.180*</li>
                                <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-curiol-500" /> Control total en tu Portal</li>
                            </ul>
                            <p className="text-[8px] text-tech-600 italic mb-6">*Ejemplo basado en Plan Aventura Mágica.</p>
                            <button
                                onClick={() => window.open('https://wa.me/50662856669?text=Hola Alberto, me interesa el plan de 5 cuotas para mi sesión familiar.', '_blank')}
                                className="w-full py-3 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-tech-100 hover:text-tech-950 transition-all rounded-full mt-auto"
                            >
                                Solicitar Plan 5 Cuotas
                            </button>
                        </GlassCard>
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <GlassCard className="p-10 border-curiol-500/5 bg-tech-900/30">
                            <h4 className="text-white font-serif text-xl italic mb-6 flex items-center gap-3">
                                <FileCheck className="w-5 h-5 text-curiol-500" /> Proceso de Activación (B2C)
                            </h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-curiol-500/10 flex items-center justify-center text-curiol-500 text-[10px] font-bold flex-shrink-0">01</div>
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Reservación</p>
                                        <p className="text-tech-500 text-[10px] font-light">Se coordina la fecha y se realiza el depósito inicial para asegurar el espacio en la agenda.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-curiol-500/10 flex items-center justify-center text-curiol-500 text-[10px] font-bold flex-shrink-0">02</div>
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Formalización Automática</p>
                                        <p className="text-tech-500 text-[10px] font-light">Al realizar tu reserva, el sistema genera inmediatamente tu **Contrato Digital con Audit Trail**, validado por tu IP y el primer depósito.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-curiol-500/10 flex items-center justify-center text-curiol-500 text-[10px] font-bold flex-shrink-0">03</div>
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Ejecución</p>
                                        <p className="text-tech-500 text-[10px] font-light">Iniciamos la pre-producción artística y técnica para tu legado.</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-10 border-tech-500/5 bg-tech-950/50">
                            <h4 className="text-white font-serif text-xl italic mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-tech-500" /> Aspectos Generales Importantes
                            </h4>
                            <ul className="space-y-4 text-[10px] text-tech-400 font-light leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-curiol-500 mt-1 flex-shrink-0"></span>
                                    <span>**Prioridad de Agenda**: Los planes de membresía gozan de prioridad para asegurar fechas anuales. Estas deben ser agendadas al momento de firmar el contrato.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tech-500 mt-1 flex-shrink-0"></span>
                                    <span>**Política de Cambios**: Se permite **un solo cambio de fecha** por sesión, notificando con al menos **15 días de anticipación** para ser aplicable.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tech-500 mt-1 flex-shrink-0"></span>
                                    <span>La **reservación no es reembolsable**, ya que asegura la exclusividad del tiempo del artista y el inicio de la logística digital.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tech-500 mt-1 flex-shrink-0"></span>
                                    <span>El **Contrato de Servicios** respalda tanto la inversión del cliente como el compromiso de entrega de Curiol Studio.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tech-500 mt-1 flex-shrink-0"></span>
                                    <span>En el plan de cuotas, la **entrega final** se libera únicamente al completar el pago total y dentro de un máximo de 2 meses.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tech-500 mt-1 flex-shrink-0"></span>
                                    <span>Este flujo aplica exclusivamente para el sector de **Legado Familiar (B2C)**.</span>
                                </li>
                            </ul>
                        </GlassCard>
                    </div>

                    <div className="mt-20 p-12 bg-tech-900/50 border border-white/5 rounded-[3rem] text-center">
                        <h4 className="text-white font-serif text-xl italic mb-6">Seguridad & Compromiso</h4>
                        <p className="text-tech-500 text-[10px] font-light max-w-2xl mx-auto leading-relaxed uppercase tracking-wider">
                            Todas las transacciones se gestionan mediante túneles de encriptación seguros. Curiol Studio se rige por un estricto código ético y legal para la protección de tu patrimonio emocional.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
