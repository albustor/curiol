"use client";

import Link from "next/link";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer id="footer" className="bg-tech-950 pt-24 pb-12 border-t border-tech-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="md:col-span-2">
                        <div className="flex flex-col items-start gap-4 mb-8">
                            <span className="font-serif text-3xl tracking-widest text-white leading-none">
                                CURIOL<span className="text-curiol-500 ml-2">STUDIO</span>
                            </span>
                            <p className="text-tech-400 text-sm font-light leading-relaxed max-w-sm">
                                Honramos el legado, capturamos el presente y diseñamos el futuro visual a través de la fotografía y la tecnología Phygital.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-tech-800 pb-2">
                            Explorar
                        </h4>
                        <ul className="text-tech-300 text-sm space-y-4">
                            <li><Link href="/" className="hover:text-curiol-500 transition-colors">Inicio</Link></li>
                            <li><Link href="/cotizar" className="hover:text-curiol-500 transition-colors">Cotizador</Link></li>
                            <li><Link href="/servicios" className="hover:text-curiol-500 transition-colors">Servicios</Link></li>
                            <li><Link href="/soluciones-web" className="hover:text-curiol-500 transition-colors">Soluciones Web</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-tech-800 pb-2">
                            Contacto
                        </h4>
                        <p className="text-tech-400 text-sm mb-4">Guanacaste, Costa Rica</p>
                        <a href="mailto:contacto@curiol.studio" className="text-curiol-500 text-xs font-bold hover:underline">
                            contacto@curiol.studio
                        </a>
                    </div>
                </div>
                <div className="pt-8 border-t border-tech-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-tech-500 font-bold uppercase tracking-widest">
                        &copy; 2026 Curiol Studio. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6">
                        <Instagram className="w-4 h-4 text-tech-500 cursor-pointer hover:text-white transition-colors" />
                        <Youtube className="w-4 h-4 text-tech-500 cursor-pointer hover:text-white transition-colors" />
                        <Twitter className="w-4 h-4 text-tech-500 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
