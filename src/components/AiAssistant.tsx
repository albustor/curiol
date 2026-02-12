"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, Send, Binary } from "lucide-react";
import { getAiAssistantResponse } from "@/actions/gemini";

export function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: string; text: string }[]>([
        { role: "ai", text: "¡Hola! Soy el asistente de Curiol Studio. ¿Cómo puedo ayudarte hoy con tu legado o tu negocio?" }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = { role: "user", text: message };
        setChat(prev => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const response = await getAiAssistantResponse(message, {});
            setChat(prev => [...prev, { role: "ai", text: response }]);
        } catch (error) {
            setChat(prev => [...prev, { role: "ai", text: "Ups, tuve un pequeño error técnico. ¿Podemos intentarlo de nuevo?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 md:mb-6 w-[calc(100vw-3rem)] md:w-[400px] bg-tech-950/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden glass-reflection"
                    >
                        <div className="bg-tech-900/50 p-6 border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-curiol-gradient flex items-center justify-center shadow-lg shadow-curiol-500/20">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Asistente Curiol IA</p>
                                    <p className="text-[9px] text-green-500 flex items-center gap-1.5 mt-0.5 font-bold uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        Presencia Activa
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-tech-500 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="h-[400px] md:h-[450px] overflow-y-auto p-6 space-y-6 flex flex-col scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {chat.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={cn(
                                        "max-w-[85%] p-4 rounded-3xl text-[13px] md:text-sm leading-relaxed shadow-sm",
                                        m.role === 'user'
                                            ? "bg-curiol-gradient text-white self-end rounded-tr-none"
                                            : "bg-white/5 text-tech-200 self-start rounded-tl-none border border-white/5"
                                    )}
                                >
                                    {m.text}
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="bg-white/5 text-tech-500 p-4 rounded-2xl self-start flex gap-2">
                                    <span className="w-1.5 h-1.5 bg-curiol-500 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-curiol-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-curiol-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/5 bg-tech-950/50 flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="¿Cómo podemos potenciar tu legado?"
                                className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-tech-600 focus:outline-none focus:border-curiol-500/50 transition-all font-sans"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="w-12 h-12 bg-curiol-gradient text-white rounded-2xl flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-curiol-500/10"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-curiol-gradient rounded-full shadow-[0_20px_50px_rgba(184,142,67,0.3)] flex items-center justify-center text-white relative z-10 border border-white/20 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="w-7 h-7 relative z-10" />
                        </motion.div>
                    ) : (
                        <motion.div key="spark" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}>
                            <Sparkles className="w-7 h-7 relative z-10" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
