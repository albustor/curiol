"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Plus, Save, Trash2, ArrowRight,
    Zap, MessageSquare, Database, Sparkles,
    ChevronDown, ChevronUp, Bot, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, Timestamp, orderBy } from "firebase/firestore";

interface FlowStep {
    id: string;
    type: "trigger" | "message" | "capture" | "ai";
    content: string;
    config?: any;
    nextId?: string;
}

interface Flow {
    id: string;
    name: string;
    description: string;
    triggerKeyword: string;
    steps: FlowStep[];
    isActive: boolean;
    createdAt: any;
}

export default function FlowBuilderPage() {
    const [flows, setFlows] = useState<Flow[]>([]);
    const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "omni_flows"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Flow[];
            setFlows(data);
        });
        return () => unsubscribe();
    }, []);

    const createNewFlow = async () => {
        const newFlow: Omit<Flow, "id"> = {
            name: "Nuevo Flujo Automatizado",
            description: "Descripción del flujo...",
            triggerKeyword: "INFO",
            steps: [
                { id: "1", type: "trigger", content: "El cliente escribe: INFO" },
                { id: "2", type: "message", content: "¡Hola! Gracias por contactar a Curiol Studio. ¿En qué podemos ayudarte hoy?" }
            ],
            isActive: true,
            createdAt: Timestamp.now()
        };
        const docRef = await addDoc(collection(db, "omni_flows"), newFlow);
        setSelectedFlow({ id: docRef.id, ...newFlow } as Flow);
    };

    const saveFlow = async () => {
        if (!selectedFlow) return;
        setIsSaving(true);
        try {
            await updateDoc(doc(db, "omni_flows", selectedFlow.id), { ...selectedFlow });
            alert("Flujo Guardado Exitosamente");
        } catch (error) {
            console.error("Error saving flow:", error);
        }
        setIsSaving(false);
    };

    const addStep = (type: FlowStep["type"]) => {
        if (!selectedFlow) return;
        const newStep: FlowStep = {
            id: Date.now().toString(),
            type,
            content: type === "ai" ? "La IA responderá basándose en el contexto." : "Escribe el contenido aquí...",
            config: type === "capture" ? { field: "nombre" } : {}
        };
        setSelectedFlow({
            ...selectedFlow,
            steps: [...selectedFlow.steps, newStep]
        });
    };

    const removeStep = (id: string) => {
        if (!selectedFlow) return;
        setSelectedFlow({
            ...selectedFlow,
            steps: selectedFlow.steps.filter(s => s.id !== id)
        });
    };

    const updateStep = (id: string, content: string, config?: any) => {
        if (!selectedFlow) return;
        setSelectedFlow({
            ...selectedFlow,
            steps: selectedFlow.steps.map(s => s.id === id ? { ...s, content, config: config || s.config } : s)
        });
    };

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 pb-24 bg-grain">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* FLOW LIST */}
                    <div className="lg:col-span-4 space-y-6">
                        <header className="flex justify-between items-center px-2">
                            <h2 className="text-2xl font-serif text-white italic">Mis Flujos</h2>
                            <button onClick={createNewFlow} className="w-10 h-10 rounded-xl bg-curiol-500/10 text-curiol-500 flex items-center justify-center border border-curiol-500/20 hover:scale-110 transition-all">
                                <Plus className="w-5 h-5" />
                            </button>
                        </header>

                        <div className="space-y-4">
                            {flows.map((flow) => (
                                <GlassCard
                                    key={flow.id}
                                    className={cn(
                                        "p-6 cursor-pointer border-l-4 transition-all",
                                        selectedFlow?.id === flow.id ? "border-l-curiol-500 bg-curiol-500/5 shadow-lg" : "border-l-tech-800 hover:border-l-tech-600"
                                    )}
                                    onClick={() => setSelectedFlow(flow)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-serif italic">{flow.name}</h3>
                                            <p className="text-[10px] text-tech-500 font-bold uppercase tracking-widest mt-1">Disparador: {flow.triggerKeyword}</p>
                                        </div>
                                        <div className={cn("w-2 h-2 rounded-full", flow.isActive ? "bg-green-500" : "bg-tech-700")}></div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* FLOW EDITOR */}
                    <div className="lg:col-span-8">
                        {selectedFlow ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <GlassCard className="p-10 border-white/10">
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="flex-grow">
                                            <input
                                                value={selectedFlow.name}
                                                onChange={(e) => setSelectedFlow({ ...selectedFlow, name: e.target.value })}
                                                className="bg-transparent text-3xl font-serif text-white italic outline-none border-b border-transparent focus:border-white/10 w-full mb-2"
                                            />
                                            <input
                                                value={selectedFlow.triggerKeyword}
                                                onChange={(e) => setSelectedFlow({ ...selectedFlow, triggerKeyword: e.target.value })}
                                                placeholder="Palabra Clave (ej: INFO)"
                                                className="bg-tech-900/50 text-[10px] font-bold uppercase tracking-[0.3em] text-curiol-500 px-4 py-2 rounded-lg outline-none"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={saveFlow} disabled={isSaving} className="px-8 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-3">
                                                <Save className="w-4 h-4" /> {isSaving ? "Guardando..." : "Guardar"}
                                            </button>
                                            <button onClick={() => deleteDoc(doc(db, "omni_flows", selectedFlow.id))} className="p-4 text-tech-800 hover:text-red-500 transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-8 relative">
                                        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-tech-800 z-0"></div>
                                        {selectedFlow.steps.map((step, idx) => (
                                            <div key={step.id} className="relative z-10 flex gap-8 group">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all",
                                                    step.type === "trigger" ? "bg-blue-500/20 border-blue-500/30 text-blue-500" :
                                                        step.type === "message" ? "bg-green-500/20 border-green-500/30 text-green-500" :
                                                            step.type === "capture" ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-500" :
                                                                "bg-purple-500/20 border-purple-500/30 text-purple-500"
                                                )}>
                                                    {step.type === "trigger" ? <Zap className="w-5 h-5" /> :
                                                        step.type === "message" ? <Send className="w-5 h-5" /> :
                                                            step.type === "capture" ? <Database className="w-5 h-5" /> :
                                                                <Sparkles className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="bg-tech-900/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-tech-500">{step.type}</span>
                                                            {idx > 0 && (
                                                                <button onClick={() => removeStep(step.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-tech-700 hover:text-red-500">
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        {step.type === "trigger" ? (
                                                            <p className="text-white italic text-sm">{step.content}</p>
                                                        ) : (
                                                            <textarea
                                                                value={step.content}
                                                                onChange={(e) => updateStep(step.id, e.target.value)}
                                                                className="bg-transparent w-full text-white text-sm italic outline-none resize-none overflow-hidden"
                                                                rows={2}
                                                            />
                                                        )}
                                                        {step.type === "capture" && (
                                                            <div className="mt-4 flex items-center gap-2">
                                                                <span className="text-[8px] text-tech-600 font-bold uppercase tracking-widest">Guardar en el campo:</span>
                                                                <input
                                                                    value={step.config?.field || ""}
                                                                    onChange={(e) => updateStep(step.id, step.content, { field: e.target.value })}
                                                                    className="bg-tech-950 border border-white/5 rounded px-2 py-1 text-[8px] text-yellow-500 font-mono"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* ADD BUTTONS */}
                                        <div className="flex gap-4 pl-20 pt-4">
                                            {[
                                                { type: "message", icon: MessageSquare, label: "Mensaje" },
                                                { type: "capture", icon: Database, label: "Captura" },
                                                { type: "ai", icon: Bot, label: "Respuesta IA" }
                                            ].map((btn) => (
                                                <button
                                                    key={btn.type}
                                                    onClick={() => addStep(btn.type as any)}
                                                    className="px-4 py-2 bg-tech-900 border border-white/5 rounded-xl text-[8px] font-bold uppercase tracking-widest text-tech-500 hover:text-white hover:border-curiol-500/50 transition-all flex items-center gap-2"
                                                >
                                                    <btn.icon className="w-3 h-3" /> {btn.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-tech-900 rounded-[3rem]">
                                <Sparkles className="w-12 h-12 text-tech-800 mb-6" />
                                <h3 className="text-2xl font-serif text-tech-700 italic">Selecciona un flujo para editar</h3>
                                <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mt-2">Crea automatizaciones poderosas en segundos</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
