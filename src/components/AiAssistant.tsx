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
        <div className="fixed bottom-10 right-10 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-6 w-[350px] bg-tech-950 border border-tech-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-tech-900 p-4 border-b border-tech-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-curiol-500/20 flex items-center justify-center">
                                    <Binary className="w-4 h-4 text-curiol-500" />
                                </div>
                                <div>
                                    <p className="text-white text-xs font-bold uppercase tracking-widest">Curiol Studio IA</p>
                                    <p className="text-[10px] text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-tech-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="h-[400px] overflow-y-auto p-4 space-y-4 flex flex-col">
                            {chat.map((m, i) => (
                                <div key={i} className={cn(
                                    "max-w-[80%] p-3 rounded-xl text-sm leading-relaxed",
                                    m.role === 'user' ? "bg-curiol-700 text-white self-end" : "bg-tech-900 text-tech-300 self-start"
                                )}>
                                    {m.text}
                                </div>
                            ))}
                            {loading && (
                                <div className="bg-tech-900 text-tech-500 p-3 rounded-xl self-start flex gap-2">
                                    <span className="w-1.5 h-1.5 bg-tech-500 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-tech-500 rounded-full animate-bounce delay-150" />
                                    <span className="w-1.5 h-1.5 bg-tech-500 rounded-full animate-bounce delay-300" />
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-tech-800 bg-tech-950 flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe tu duda..."
                                className="flex-grow bg-tech-900 border border-tech-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-curiol-500 transition-all font-sans"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="p-2 bg-curiol-700 text-white rounded-lg hover:bg-curiol-500 transition-all disabled:opacity-50"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-curiol-700 rounded-full shadow-2xl flex items-center justify-center text-white relative z-10"
            >
                <Sparkles className="w-6 h-6" />
            </motion.button>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
