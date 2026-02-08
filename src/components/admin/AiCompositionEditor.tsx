"use client";

import { useState, useRef, useEffect } from "react";
import { X, Sparkles, Instagram, Facebook, LayoutGrid, Frame, User, Download, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface Props {
    imageUrl: string;
    onClose: () => void;
    initialFormat?: Format;
}

type Rule = "thirds" | "golden" | "gaze" | "center";
type Format = "ig-post" | "ig-story" | "fb-post";

export function AiCompositionEditor({ imageUrl, onClose, initialFormat }: Props) {
    const [rule, setRule] = useState<Rule>("thirds");
    const [format, setFormat] = useState<Format>(initialFormat || "ig-post");
    const [facePos, setFacePos] = useState({ x: 50, y: 35 }); // Simulated face position in %
    const [isExporting, setIsExporting] = useState(false);
    const [exportDone, setExportDone] = useState(false);

    // Composition Calculation Simulation
    const getFaceAlignment = () => {
        if (rule === "thirds") return { x: 33.3, y: 33.3 };
        if (rule === "golden") return { x: 38.2, y: 38.2 };
        if (rule === "gaze") return { x: 66.6, y: 33.3 };
        return { x: 50, y: 50 };
    };

    const alignment = getFaceAlignment();

    // Calculate transform to align facePos to target alignment
    const translateX = alignment.x - facePos.x;
    const translateY = alignment.y - facePos.y;

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            setExportDone(true);
            setTimeout(() => setExportDone(false), 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-tech-950/95 backdrop-blur-2xl"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-tech-900 border border-white/10 w-full max-w-6xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
                {/* Visual Viewport */}
                <div className="flex-grow bg-black relative overflow-hidden group">
                    {/* The Image with AI alignment simulation */}
                    <div
                        className="absolute inset-0 transition-transform duration-1000 ease-in-out"
                        style={{
                            transform: `translate(${translateX}%, ${translateY}%) scale(1.2)`,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Overlays */}
                    <AnimatePresence>
                        {rule === "thirds" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/3 w-full h-[1px] bg-white" />
                                <div className="absolute top-2/3 w-full h-[1px] bg-white" />
                                <div className="absolute left-1/3 h-full w-[1px] bg-white" />
                                <div className="absolute left-2/3 h-full w-[1px] bg-white" />
                            </motion.div>
                        )}
                        {rule === "golden" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-[38.2%] w-full h-[1px] bg-curiol-500" />
                                <div className="absolute top-[61.8%] w-full h-[1px] bg-curiol-500" />
                                <div className="absolute left-[38.2%] h-full w-[1px] bg-curiol-500" />
                                <div className="absolute left-[61.8%] h-full w-[1px] bg-curiol-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* AI Target Point */}
                    <motion.div
                        animate={{ x: `${alignment.x}%`, y: `${alignment.y}%` }}
                        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                    >
                        <div className="w-4 h-4 rounded-full border border-curiol-500 animate-ping absolute" />
                        <div className="w-1 h-1 bg-curiol-500 rounded-full" />
                    </motion.div>

                    {/* Format Frame Label */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                        Vista Previa: {format.replace('-', ' ')}
                    </div>
                </div>

                {/* Control Sidebar */}
                <div className="w-full lg:w-96 bg-tech-950/50 border-l border-white/5 p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-3 h-3 text-curiol-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-curiol-500">IA de Composición</span>
                            </div>
                            <h3 className="text-xl font-serif text-white italic">Exportación Elite</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all text-tech-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-8 flex-grow">
                        {/* Rules */}
                        <div>
                            <label className="text-[10px] text-tech-600 font-bold uppercase tracking-widest block mb-4">Regla de Composición</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "thirds", label: "Tercios", icon: LayoutGrid },
                                    { id: "golden", label: "Zona Áurea", icon: Sparkles },
                                    { id: "gaze", label: "Mirada", icon: User },
                                    { id: "center", label: "Centro", icon: Frame },
                                ].map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => setRule(r.id as Rule)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-2xl border transition-all text-[10px] font-bold uppercase tracking-wider",
                                            rule === r.id ? "bg-curiol-500/10 border-curiol-500 text-curiol-500" : "bg-tech-900 border-white/5 text-tech-500 hover:border-white/10"
                                        )}
                                    >
                                        <r.icon className="w-4 h-4" /> {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Formats */}
                        <div>
                            <label className="text-[10px] text-tech-600 font-bold uppercase tracking-widest block mb-4">Formato de Redes</label>
                            <div className="space-y-3">
                                {[
                                    { id: "ig-post", label: "Instagram Post (4:5)", icon: Instagram },
                                    { id: "ig-story", label: "Instagram Story (9:16)", icon: Instagram },
                                    { id: "fb-post", label: "Facebook Post (1.91:1)", icon: Facebook },
                                ].map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFormat(f.id as Format)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-[10px] font-bold uppercase tracking-wider",
                                            format === f.id ? "bg-tech-100 text-tech-950 border-white" : "bg-tech-900 border-white/5 text-tech-500 hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <f.icon className="w-4 h-4" /> {f.label}
                                        </div>
                                        {format === f.id && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Export Actions */}
                    <div className="pt-8 border-t border-white/5 space-y-4">
                        <p className="text-[9px] text-tech-700 italic text-center">IA ha detectado el rostro y alineado a la {rule} automáticamente.</p>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className={cn(
                                "w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl",
                                exportDone ? "bg-green-500 text-white" : "bg-curiol-gradient text-white shadow-curiol-500/20"
                            )}
                        >
                            {isExporting ? <Sparkles className="w-4 h-4 animate-spin" /> : exportDone ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                            {isExporting ? "Procesando Composición..." : exportDone ? "Exportado con Éxito" : "Exportar con IA"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
