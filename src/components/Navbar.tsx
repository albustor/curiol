"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldCheck, Menu, X, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/portafolio", label: "Portafolio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/experiencia", label: "Experiencia" },
    { href: "/agenda", label: "Agenda" },
    { href: "/cotizar", label: "Cotizar" },
    { href: "/soluciones-web", label: "Soluciones Comerciales" },
    { href: "/comunidad", label: "Comunidad" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b",
                isScrolled
                    ? "bg-tech-950/90 backdrop-blur-xl border-tech-800 py-4"
                    : "bg-transparent border-transparent py-6 lg:bg-transparent"
            )}
        >
            {/* Top Gradient for visibility on mobile/light backgrounds */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-tech-950/60 via-tech-950/20 to-transparent lg:hidden" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-4">
                    <img src="/Logo_Principal.png" alt="Logo" className="h-10 w-10 object-contain" />
                    <div className="flex flex-col items-start">
                        <span className="font-serif text-xl md:text-2xl tracking-[0.2em] text-white leading-none drop-shadow-lg">
                            CURIOL<span className="text-curiol-500 font-light ml-2">STUDIO</span>
                        </span>
                        <p className="text-[0.5rem] md:text-[0.6rem] uppercase tracking-[0.4em] text-tech-400 mt-1 transition-colors drop-shadow-md">
                            Fotografía • Tecnología • Legado
                        </p>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:space-x-8 items-center">
                    {navLinks.filter(l => !(l as any).mobileOnly).map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "nav-link text-xs font-bold uppercase tracking-widest transition-all hover:text-curiol-500",
                                pathname === link.href ? "text-curiol-500" : "text-tech-300"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-tech-500 hover:text-curiol-500 transition-colors ml-4 pl-4 border-l border-tech-800 group/admin"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover/admin:opacity-100 transition-opacity">Panel Admin</span>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-curiol-500 p-2 bg-tech-950/40 backdrop-blur-md rounded-full border border-curiol-500/20 shadow-lg"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-tech-950/98 backdrop-blur-2xl z-[100] lg:hidden flex flex-col p-8"
                    >
                        {/* Mobile Header in Overlay */}
                        <div className="flex justify-between items-center mb-12">
                            <div className="group flex flex-col items-center">
                                <span className="font-serif text-xl tracking-[0.2em] text-white leading-none">
                                    CURIOL<span className="text-curiol-500 font-light ml-2">STUDIO</span>
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-curiol-500 p-2 bg-tech-900/50 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-col items-start space-y-6 flex-grow overflow-y-auto">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-2xl font-serif italic tracking-widest uppercase transition-all block",
                                            pathname === link.href ? "text-curiol-500" : "text-white"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto pt-10 border-t border-white/10 space-y-6">
                            <p className="text-tech-500 text-[8px] uppercase tracking-[0.4em] font-bold">Curiol Studio • Legado</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-4 bg-tech-900/50 rounded-xl border border-tech-800 text-tech-400">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
                                </Link>
                                <Link href="/regalo" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-4 bg-curiol-500/10 rounded-xl border border-curiol-500/20 text-curiol-500">
                                    <Gift className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Regalo</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
