"use client";

import React from "react";
import { Printer, ArrowLeft, ShieldCheck, Briefcase, Users } from "lucide-react";

interface ProcessDocumentationProps {
    onBack?: () => void;
}

export function ProcessDocumentation({ onBack }: ProcessDocumentationProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Bar */}
            <div className="flex justify-between items-center print:hidden">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-tech-400 hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Regresar al Dashboard</span>
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-2 bg-curiol-500/10 border border-curiol-500/20 text-curiol-500 rounded-xl hover:bg-curiol-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        <Printer className="w-4 h-4" /> Exportar a PDF / Imprimir
                    </button>
                </div>
            </div>

            {/* Documentation Container */}
            <div className="bg-white text-tech-950 p-8 md:p-16 rounded-[2rem] shadow-2xl print:shadow-none print:p-0 print:rounded-none">
                {/* PDF Header (Always Visible) */}
                <div className="border-b-2 border-tech-900 pb-12 mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-[2px] w-12 bg-tech-950"></span>
                            <span className="text-tech-950 text-[10px] font-bold tracking-[0.4em] uppercase font-sans">Estrategia de Digitalización</span>
                        </div>
                        <h1 className="text-5xl font-serif italic text-tech-950">Protocolo de Implementación</h1>
                        <p className="text-tech-600 font-sans uppercase tracking-[0.2em] text-[10px] mt-2 font-bold">
                            Meta WhatsApp Cloud API • Gestión de Clientes Terceros
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-tech-950 font-serif text-3xl italic">Curiol Studio</p>
                        <p className="text-[8px] text-tech-500 uppercase font-bold tracking-widest mt-1">Guía Maestra 2026</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="prose prose-tech max-w-none font-sans leading-relaxed">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 bg-tech-50 flex items-center justify-center rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-tech-900" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-tech-100 pb-2">Seguridad Central</h3>
                            <p className="text-xs text-tech-600">Nunca asumas la propiedad de los activos del cliente. Utiliza siempre el rol de Administrador en el Portfolio del cliente mediante Invitación.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 bg-tech-50 flex items-center justify-center rounded-lg">
                                <Briefcase className="w-5 h-5 text-tech-900" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-tech-100 pb-2">Valor Añadido</h3>
                            <p className="text-xs text-tech-600">Este proceso no es "soporte técnico", es "Infraestructura de Negocio". Considéralo un activo entregable con valor monetario.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 bg-tech-50 flex items-center justify-center rounded-lg">
                                <Users className="w-5 h-5 text-tech-900" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-tech-100 pb-2">Marca Blanca</h3>
                            <p className="text-xs text-tech-600">Aunque uses tu expertise, la cuenta de WhatsApp debe estar bajo la identidad legal del cliente para evitar riesgos de baneo cruzado.</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif italic mb-6 text-tech-900 border-l-4 border-tech-900 pl-4">1. El Protocolo de Apertura (Onboarding)</h2>
                    <p className="text-sm text-tech-700 mb-8">
                        Cuando trabajas con una cuenta que no es tuya, el error más común es pedir las credenciales personales del cliente. **Nunca lo hagas.** El proceso correcto es:
                    </p>
                    <ul className="list-disc pl-6 space-y-4 text-sm text-tech-700 mb-12">
                        <li><strong>Identificación del Portfolio:</strong> Solicita al cliente que entre a <code>business.facebook.com/settings</code> e identifique su Portfolio Comercial activo.</li>
                        <li><strong>Invitación de Socio/Persona:</strong> Debes ser agregado como una <strong>Persona</strong> con rol de Administrador (o como Socio si tienes tu propio Business Manager de Agencia).</li>
                        <li><strong>Verificación de Activos:</strong> Una vez dentro, verifica que el cliente tenga su Página de FB y su Cuenta de WhatsApp vinculadas al mismo Portfolio.</li>
                    </ul>

                    <h2 className="text-2xl font-serif italic mb-6 text-tech-900 border-l-4 border-tech-900 pl-4">2. Configuración de API sin Fricción</h2>
                    <div className="bg-tech-50 p-8 rounded-2xl mb-12 border border-tech-100">
                        <p className="text-xs font-bold uppercase tracking-widest text-tech-400 mb-4">Checklist Técnico para Clientes</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded border-2 border-tech-900 flex-shrink-0" />
                                <p className="text-sm text-tech-800">Crear App en Meta Developers: Elegir tipo "Negocios".</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded border-2 border-tech-900 flex-shrink-0" />
                                <p className="text-sm text-tech-800">Vincular Número: El número no puede estar en uso en la App de WhatsApp normal.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded border-2 border-tech-900 flex-shrink-0" />
                                <p className="text-sm text-tech-800">Generación de Token: Crear Usuario del Sistema y asignar permiso <code>whatsapp_business_messaging</code>.</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif italic mb-6 text-tech-900 border-l-4 border-tech-900 pl-4">3. Cuotas y Límites de Meta</h2>
                    <p className="text-sm text-tech-700 mb-12">
                        Informa al cliente sobre las 1,000 conversaciones gratuitas al mes iniciadas por el usuario. Las conversaciones iniciadas por el negocio tienen costo y requieren pasar por un proceso de verificación de identidad (Business Verification) para aumentar el límite de mensajes diarios.
                    </p>

                    <h2 className="text-2xl font-serif italic mb-6 text-tech-900 border-l-4 border-tech-900 pl-4">4. Bitácora de Estabilización (Feb 2026)</h2>
                    <div className="bg-curiol-50 p-8 rounded-2xl mb-12 border border-curiol-100">
                        <p className="text-xs font-bold uppercase tracking-widest text-curiol-700 mb-4">Actualizaciones del Núcleo Vital</p>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="text-curiol-700 font-bold text-xs shrink-0">AI Sync</div>
                                <p className="text-xs text-tech-800">Recuperación de WhatsApp AI con Token Permanente y prompt unificado para una experiencia de marca coherente.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-curiol-700 font-bold text-xs shrink-0">Geo Sync</div>
                                <p className="text-xs text-tech-800">Sincronización global de ubicación física a **Santa Bárbara de Santa Cruz, Guanacaste** en todos los puntos de contacto.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-curiol-700 font-bold text-xs shrink-0">Build Fix</div>
                                <div className="space-y-1">
                                    <p className="text-xs text-tech-800 font-bold">Estandarización Next.js 15.1.11 + React 19</p>
                                    <p className="text-[10px] text-tech-600 leading-relaxed">Se resolvieron conflictos de `eslint-config-next`, typos críticos en dashboards y **parche de seguridad CVE-2025 (React Server Components)**. Limpieza total de `package-lock.json` para despliegue seguro y blindado.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PDF Footer (Always Visible) */}
                    <div className="mt-24 pt-12 border-t border-tech-100 flex justify-between items-center text-[10px] text-tech-400 font-bold uppercase tracking-widest">
                        <div className="flex flex-col gap-1">
                            <p>© 2026 Curiol Studio • Legado y Crecimiento</p>
                            <p>Santa Bárbara de Santa Cruz, Guanacaste, CR</p>
                        </div>
                        <div className="text-right">
                            <p>Confidencial • Solo para uso interno</p>
                            <p>Versión 1.0.2</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles for Printing */}
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 2cm;
                        size: A4;
                    }
                    body {
                        background: white !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .prose {
                        color: #000 !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
