"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search, Command, LayoutDashboard, ImageIcon, Brain,
    BarChart3, FileText, HardDrive, Video, BookOpen,
    Mail, ClipboardCheck, Sparkles, PieChart, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CommandItem {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: any;
    category: string;
    isMaster?: boolean;
}

const COMMANDS: CommandItem[] = [
    { id: "dash", title: "Dashboard", description: "Vista general de operaciones", href: "/admin/dashboard", icon: LayoutDashboard, category: "General" },
    { id: "port", title: "Portafolio", description: "Gestión de proyectos y galerías", href: "/admin/portafolio", icon: ImageIcon, category: "Creativo" },
    { id: "ins", title: "Insumos IA", description: "Base de conocimientos para la IA", href: "/admin/insumos", icon: Brain, category: "Creativo" },
    { id: "ana", title: "Analítica", description: "Métricas de rendimiento", href: "/admin/analytics", icon: BarChart3, category: "Comercial", isMaster: true },
    { id: "pres", title: "Presupuestos", description: "Gestión de propuestas económicas", href: "/admin/presupuestos", icon: FileText, category: "Comercial", isMaster: true },
    { id: "cot", title: "Cotizador", description: "Herramienta de cotización Pro", href: "/admin/cotizador", icon: FileText, category: "Comercial", isMaster: true },
    { id: "drive", title: "Google Drive", description: "Archivos y assets en la nube", href: "/admin/workspace/drive", icon: HardDrive, category: "Workspace" },
    { id: "meet", title: "Curiol Meet", description: "Sala de videollamadas", href: "/admin/videollamadas", icon: Video, category: "Workspace" },
    { id: "doc", title: "Documentación Maestra", description: "Protocolos y estrategia", href: "/admin/documentacion", icon: BookOpen, category: "Estrategia", isMaster: true },
    { id: "equi", title: "Equilibrio", description: "Métricas financieras master", href: "/admin/equilibrio", icon: PieChart, category: "Estrategia", isMaster: true },
    { id: "mail", title: "Email Manager", description: "Gestión de comunicaciones", href: "/admin/email-manager", icon: Mail, category: "Operaciones" },
    { id: "qa", title: "QA Logs", description: "Control de calidad de procesos", href: "/admin/qa-logs", icon: ClipboardCheck, category: "Operaciones" },
    { id: "aca", title: "Academy", description: "Centro de capacitación", href: "/admin/academy", icon: Sparkles, category: "Operaciones" },
];

interface CommandKProps {
    isMaster?: boolean;
}

export function CommandK({ isMaster = false }: CommandKProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    const filteredCommands = COMMANDS.filter(cmd => {
        if (cmd.isMaster && !isMaster) return false;
        const searchLower = search.toLowerCase();
        return (
            cmd.title.toLowerCase().includes(searchLower) ||
            cmd.description.toLowerCase().includes(searchLower) ||
            cmd.category.toLowerCase().includes(searchLower)
        );
    });

    const handleSelect = useCallback((href: string) => {
        router.push(href);
        setOpen(false);
        setSearch("");
    }, [router]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => (i + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === "Enter") {
            const selected = filteredCommands[selectedIndex];
            if (selected) handleSelect(selected.href);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-tech-900 border border-white/5 rounded-lg text-tech-600 hover:text-white hover:border-curiol-500/30 transition-all text-[10px] font-bold uppercase tracking-wider"
            >
                <Search className="w-3 h-3" />
                <span>Buscar...</span>
                <kbd className="flex items-center gap-1 px-1.5 py-0.5 bg-tech-950 border border-white/10 rounded text-[9px] font-mono">
                    <Command className="w-2.5 h-2.5" /> K
                </kbd>
            </button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-black/40">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-2xl bg-tech-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center p-4 border-b border-white/5">
                                <Search className="w-5 h-5 text-curiol-500 mr-3" />
                                <input
                                    autoFocus
                                    placeholder="¿A dónde quieres ir, Maestro?"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    className="flex-grow bg-transparent border-none outline-none text-white text-lg font-serif italic placeholder:text-tech-700"
                                />
                                <button onClick={() => setOpen(false)} className="p-1 text-tech-700 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {filteredCommands.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredCommands.map((cmd, idx) => (
                                            <button
                                                key={cmd.id}
                                                onClick={() => handleSelect(cmd.href)}
                                                onMouseMove={() => setSelectedIndex(idx)}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all group",
                                                    selectedIndex === idx ? "bg-curiol-500/10 border border-curiol-500/20" : "bg-transparent border border-transparent"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center border transition-all",
                                                    selectedIndex === idx ? "bg-curiol-500 text-white border-curiol-500" : "bg-tech-900 text-tech-500 border-white/5"
                                                )}>
                                                    <cmd.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn("text-base font-serif italic", selectedIndex === idx ? "text-white" : "text-tech-300")}>
                                                            {cmd.title}
                                                        </span>
                                                        <span className="text-[10px] text-tech-600 font-bold uppercase tracking-widest bg-tech-900 px-2 py-0.5 rounded">
                                                            {cmd.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-tech-500 font-light truncate">{cmd.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <Sparkles className="w-8 h-8 text-tech-800 mx-auto mb-4" />
                                        <p className="text-tech-600 italic">No encontramos ese legado...</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-tech-900/50 border-t border-white/5 flex items-center justify-between text-[10px] text-tech-700 uppercase font-bold tracking-[0.2em]">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-tech-950 border border-white/10 rounded">⏎</kbd> Seleccionar
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-tech-950 border border-white/10 rounded">↑↓</kbd> Navegar
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-tech-950 border border-white/10 rounded">ESC</kbd> Cerrar
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
