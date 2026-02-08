"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Plus, Save, Trash2, ArrowRight,
    Zap, MessageSquare, Database, Sparkles,
    ChevronDown, ChevronUp, Bot, Send,
    Clock, ListChecks
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, Timestamp, orderBy } from "firebase/firestore";

interface FlowStep {
    id: string;
    type: "trigger" | "message" | "capture" | "ai" | "condition" | "delay";
    content: string;
    config?: {
        field?: string;
        operator?: "equals" | "contains";
        value?: string;
        delaySeconds?: number;
    };
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

                                    <div className="space-y-0 relative">
                                        {selectedFlow.steps.map((step, idx) => (
                                            <div key={step.id} className="relative flex flex-col items-center">
                                                {/* Connector Line */}
                                                {idx > 0 && (
                                                    <div className="w-[2px] h-12 bg-gradient-to-b from-curiol-500/50 to-tech-800 my-2" />
                                                )}

                                                <div className="w-full flex gap-8 group">
                                                    <div className={cn(
                                                        "w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 border-2 shadow-2xl transition-all relative z-10",
                                                        step.type === "trigger" ? "bg-blue-500/20 border-blue-500/40 text-blue-400" :
                                                            step.type === "message" ? "bg-curiol-500/20 border-curiol-500/40 text-curiol-400" :
                                                                step.type === "capture" ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" :
                                                                    step.type === "delay" ? "bg-orange-500/20 border-orange-500/40 text-orange-400" :
                                                                        step.type === "condition" ? "bg-indigo-300/20 border-indigo-300/40 text-indigo-300" :
                                                                            "bg-purple-500/20 border-purple-500/40 text-purple-400"
                                                    )}>
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-tech-950 border border-white/10 flex items-center justify-center text-[10px] font-bold text-tech-400">
                                                            {idx + 1}
                                                        </div>
                                                        {step.type === "trigger" ? <Zap className="w-6 h-6" /> :
                                                            step.type === "message" ? <Send className="w-6 h-6" /> :
                                                                step.type === "capture" ? <Database className="w-6 h-6" /> :
                                                                    step.type === "delay" ? <Clock className="w-6 h-6" /> :
                                                                        step.type === "condition" ? <ListChecks className="w-6 h-6" /> :
                                                                            <Bot className="w-6 h-6" />}
                                                    </div>

                                                    <div className="flex-grow">
                                                        <div className="bg-tech-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 hover:border-curiol-500/30 transition-all shadow-xl">
                                                            <div className="flex justify-between items-center mb-6">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tech-500">Bloque de {step.type}</span>
                                                                    {step.type === "trigger" && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-bold rounded-full uppercase">Inicio</span>}
                                                                </div>
                                                                {idx > 0 && (
                                                                    <button onClick={() => removeStep(step.id)} className="p-2 bg-tech-950 rounded-lg text-tech-700 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {step.type === "trigger" ? (
                                                                <div className="p-4 bg-tech-950/50 rounded-xl border border-white/5">
                                                                    <p className="text-white font-serif italic text-lg leading-relaxed">{step.content}</p>
                                                                </div>
                                                            ) : (
                                                                <textarea
                                                                    value={step.content}
                                                                    onChange={(e) => updateStep(step.id, e.target.value)}
                                                                    className="bg-tech-950/30 w-full p-4 rounded-xl text-white text-base italic outline-none resize-none border border-transparent focus:border-white/10 transition-all"
                                                                    rows={3}
                                                                    placeholder="Configura el mensaje..."
                                                                />
                                                            )}

                                                            {/* Step Specific Configs */}
                                                            <div className="mt-6 pt-6 border-t border-white/5">
                                                                {step.type === "capture" && (
                                                                    <div className="flex items-center gap-4">
                                                                        <Database className="w-4 h-4 text-yellow-500" />
                                                                        <span className="text-[10px] text-tech-600 font-bold uppercase tracking-widest">Atributo a Guardar:</span>
                                                                        <input
                                                                            value={step.config?.field || ""}
                                                                            onChange={(e) => updateStep(step.id, step.content, { ...step.config, field: e.target.value })}
                                                                            className="bg-tech-950 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-yellow-500 font-mono outline-none focus:border-yellow-500/50"
                                                                            placeholder="ej: nombre_lead"
                                                                        />
                                                                    </div>
                                                                )}
                                                                {step.type === "delay" && (
                                                                    <div className="flex items-center gap-4">
                                                                        <Clock className="w-4 h-4 text-orange-500" />
                                                                        <span className="text-[10px] text-tech-600 font-bold uppercase tracking-widest">Tiempo de Espera:</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="number"
                                                                                value={step.config?.delaySeconds || 0}
                                                                                onChange={(e) => updateStep(step.id, step.content, { ...step.config, delaySeconds: parseInt(e.target.value) })}
                                                                                className="bg-tech-950 border border-white/5 rounded-lg px-4 py-2 w-20 text-[10px] text-orange-500 font-mono outline-none focus:border-orange-500/50"
                                                                            />
                                                                            <span className="text-[10px] text-tech-600 font-bold">segundos</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {step.type === "condition" && (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="flex flex-col gap-2">
                                                                            <span className="text-[9px] text-tech-600 font-bold uppercase">Si el mensaje...</span>
                                                                            <select
                                                                                value={step.config?.operator || "equals"}
                                                                                onChange={(e) => updateStep(step.id, step.content, { ...step.config, operator: e.target.value as any })}
                                                                                className="bg-tech-950 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-indigo-300 font-bold outline-none"
                                                                            >
                                                                                <option value="equals">Es igual a</option>
                                                                                <option value="contains">Contiene</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="flex flex-col gap-2">
                                                                            <span className="text-[9px] text-tech-600 font-bold uppercase">Valor esperado</span>
                                                                            <input
                                                                                value={step.config?.value || ""}
                                                                                onChange={(e) => updateStep(step.id, step.content, { ...step.config, value: e.target.value })}
                                                                                className="bg-tech-950 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-indigo-300 font-mono outline-none focus:border-indigo-500/50"
                                                                                placeholder="Valor..."
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {step.type === "ai" && (
                                                                    <div className="flex items-center gap-4">
                                                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                                                        <p className="text-[10px] text-tech-500 font-medium">La IA analizará el contexto del cliente para responder dinámicamente.</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* ADD BUTTONS - Dynamic Canvas Adder */}
                                        <div className="relative flex flex-col items-center mt-12">
                                            <div className="w-[2px] h-12 bg-tech-800 mb-4" />
                                            <div className="flex flex-wrap justify-center gap-3 p-6 bg-tech-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl">
                                                {[
                                                    { type: "message", icon: MessageSquare, label: "Mensaje", color: "hover:text-curiol-500" },
                                                    { type: "capture", icon: Database, label: "Captura", color: "hover:text-yellow-500" },
                                                    { type: "delay", icon: Clock, label: "Retraso", color: "hover:text-orange-500" },
                                                    { type: "condition", icon: ListChecks, label: "Condición", color: "hover:text-indigo-400" },
                                                    { type: "ai", icon: Bot, label: "IA", color: "hover:text-purple-400" }
                                                ].map((btn) => (
                                                    <button
                                                        key={btn.type}
                                                        onClick={() => addStep(btn.type as any)}
                                                        className={cn(
                                                            "group flex items-center gap-3 px-6 py-3 bg-tech-950 border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-tech-500 transition-all hover:scale-105 hover:bg-tech-800 hover:border-white/10",
                                                            btn.color
                                                        )}
                                                    >
                                                        <btn.icon className="w-4 h-4 transition-transform group-hover:rotate-12" />
                                                        {btn.label}
                                                    </button>
                                                ))}
                                            </div>
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
