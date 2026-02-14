"use client";

import Link from "next/link";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer id="footer" className="bg-tech-950 pt-32 pb-12 border-t border-tech-800 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-curiol-gradient opacity-20" />

            <div className="max-w-7xl mx-auto px-6 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    <div className="md:col-span-2">
                        <div className="flex flex-col items-start gap-4 mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="h-[1px] w-8 bg-curiol-500"></span>
                                <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Digitalización Humana</span>
                            </div>
                            <p className="text-tech-400 text-sm font-light leading-relaxed max-w-md mt-6">
                                Construimos ecosistemas de legado digital donde la sensibilidad artística se encuentra con la ingeniería de alta conversión. "Digitalización Humana" para familias y negocios locales.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-tech-800 pb-2">
                            Ecosistema
                        </h4>
                        <ul className="text-tech-300 text-sm space-y-4 font-light">
                            <li><Link href="/" className="hover:text-curiol-500 transition-all hover:translate-x-1 inline-block">Inicio</Link></li>
                            <li><Link href="/servicios" className="hover:text-curiol-500 transition-all hover:translate-x-1 inline-block">Servicios 2026</Link></li>
                            <li><Link href="/soluciones-web" className="hover:text-curiol-500 transition-all hover:translate-x-1 inline-block">Crecimiento Comercial & IA</Link></li>
                            <li><Link href="/cotizar" className="hover:text-curiol-500 transition-all hover:translate-x-1 inline-block">Cotizador Inteligente</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-tech-800 pb-2">
                            Presencia
                        </h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-2">Ubicación</p>
                                <p className="text-tech-400 text-sm font-light italic">Santa Bárbara de Santa Cruz, Guanacaste, CR</p>
                            </div>
                            <div>
                                <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-2">WhatsApp Oficial</p>
                                <a href="https://wa.me/50662856669" target="_blank" className="text-curiol-500 text-sm font-bold hover:underline block">
                                    +506 6285-6669
                                </a>
                            </div>
                            <div>
                                <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-2">Canal Oficial</p>
                                <a href="mailto:info@curiol.studio" className="text-curiol-500 text-sm font-bold hover:underline">
                                    info@curiol.studio
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-tech-800 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <img
                            src="/Firma_Blanco_Transparente.png"
                            alt="Firma Alberto Bustos"
                            className="h-12 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-all"
                        />
                        <p className="text-[9px] text-tech-600 font-bold uppercase tracking-[0.3em]">
                            &copy; 2026 Curiol Studio. Todos los derechos reservados.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex gap-6">
                            <Instagram className="w-5 h-5 text-tech-500 cursor-pointer hover:text-curiol-500 transition-colors" />
                            <Youtube className="w-5 h-5 text-tech-500 cursor-pointer hover:text-curiol-500 transition-colors" />
                            <Twitter className="w-5 h-5 text-tech-500 cursor-pointer hover:text-curiol-500 transition-colors" />
                        </div>
                        <div className="h-8 w-[1px] bg-tech-800 mx-2 hidden md:block" />
                        <span className="text-[9px] text-tech-600 font-bold uppercase tracking-widest hidden md:block">
                            Estrategia & Desarrollo
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
