"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldCheck, Menu, X, Gift } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/portafolio", label: "Portafolio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/regalo", label: "Tarjeta Regalo", mobileOnly: true },
    { href: "/cotizar", label: "Cotizar" },
    { href: "/soluciones-web", label: "Soluciones Web" },
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
                    : "bg-transparent border-transparent py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="group flex flex-col items-center">
                    <span className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-white leading-none">
                        CURIOL<span className="text-curiol-500 font-light ml-2">STUDIO</span>
                    </span>
                    <p className="text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.5em] text-tech-500 text-center mt-1.5 group-hover:text-curiol-500 transition-colors">
                        Fotografía • Tecnología • Legado
                    </p>
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
                        className="text-tech-500 hover:text-curiol-500 transition-colors ml-4"
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-curiol-500 p-2"
                    >
                        {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 top-20 bg-tech-950 z-40 lg:hidden flex flex-col items-center justify-center space-y-8 transition-all duration-500",
                    isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-10"
                )}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "text-xl font-serif tracking-[0.2em] uppercase transition-all hover:text-curiol-500",
                            pathname === link.href ? "text-curiol-500" : "text-white"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
