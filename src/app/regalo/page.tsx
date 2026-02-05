"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Gift, Sparkles, Camera, Calendar, Check, Send, Palette, User, MessageCircle, Smartphone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const GIFT_COLORS = [
    { name: "Terracota", class: "bg-curiol-700", border: "border-curiol-500", text: "text-curiol-500", glow: "shadow-curiol-500/20" },
    { name: "Ocre Oro", class: "bg-gold-500", border: "border-gold-500", text: "text-gold-500", glow: "shadow-gold-500/20" },
    { name: "Pizarra Tech", class: "bg-tech-800", border: "border-tech-500", text: "text-tech-500", glow: "shadow-tech-500/20" },
    { name: "Gris Profundo", class: "bg-tech-950", border: "border-white/20", text: "text-white", glow: "shadow-white/10" },
    { name: "Rosa Legado", class: "bg-[#c07759]", border: "border-[#c07759]", text: "text-[#f5e9e3]", glow: "shadow-[#c07759]/20" },
];

export default function GiftCardPage() {
    const [isRevealed, setIsRevealed] = useState(false);
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const [message, setMessage] = useState("");
    const [selectedColor, setSelectedColor] = useState(GIFT_COLORS[0]);

    const steps = [
        { icon: User, title: "1. Personaliza", desc: "Escribe los nombres, el mensaje y elige el color de tu tarjeta." },
        { icon: Smartphone, title: "2. Paga vía SINPE", desc: "Realiza el pago al 6060-2617 (Alberto Bustos)." },
        { icon: Send, title: "3. Recibe y Envía", desc: "Te enviaremos el link por WhatsApp para que lo compartas." }
    ];

    const generateWhatsAppLink = () => {
        const text = `¡Hola! Me gustaría solicitar la Tarjeta de Regalo Virtual.\n\nDetalles:\nPara: ${to || "N/A"}\nDe: ${from || "N/A"}\nMensaje: ${message || "N/A"}\nColor: ${selectedColor.name}\n\nYa realicé el SINPE por el valor de la sesión.`;
        return `https://wa.me/50660602617?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950 bg-grain">
            <Navbar />

            <main className="flex-grow max-w-6xl mx-auto px-4 w-full">
                <header className="mb-16 text-center animate-fade-in text-balance">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <span className="h-[1px] w-12 bg-curiol-500"></span>
                        <span className="text-curiol-500 text-xs font-bold tracking-[0.4em] uppercase">Experiencia Phygital</span>
                        <span className="h-[1px] w-12 bg-curiol-500"></span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-white italic mb-6">Personaliza tu <span className="text-curiol-gradient">Legado.</span></h1>
                    <p className="text-tech-400 text-lg font-light max-w-2xl mx-auto">
                        Crea una sorpresa inolvidable. Elige los detalles y nosotros nos encargamos de que la entrega sea mágica.
                    </p>
                </header>

                {/* Steps Section */}
                <section className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-tech-900/20 border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-tech-800 flex items-center justify-center mb-6 text-curiol-500 ring-1 ring-curiol-500/30">
                                <step.icon className="w-6 h-6" />
                            </div>
                            <h4 className="text-white font-serif text-xl mb-3 italic">{step.title}</h4>
                            <p className="text-tech-500 text-sm font-light leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Preview Section */}
                    <div className="lg:sticky lg:top-40 flex flex-col items-center">
                        <p className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.3em] mb-8">Vista Previa en Tiempo Real</p>
                        <div className="relative perspective-1000 w-full max-w-2xl aspect-[1.58/1]">
                            <motion.div
                                animate={{ rotateY: isRevealed ? 180 : 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative w-full h-full preserve-3d cursor-pointer shadow-3xl"
                                onClick={() => setIsRevealed(!isRevealed)}
                            >
                                {/* Front */}
                                <div className="absolute inset-0 backface-hidden">
                                    <GlassCard className={cn("w-full h-full border-2 p-1 overflow-hidden relative", selectedColor.border, selectedColor.glow)}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-tech-950/90 to-tech-900/90" />
                                        <div className="relative h-full flex flex-col justify-between p-10 border border-white/5 rounded-[inherit]">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <span className={cn("font-serif italic text-3xl mb-1", selectedColor.text)}>Curiol Studio</span>
                                                    <span className="text-[7px] text-tech-500 uppercase tracking-[0.3em] font-bold">Arquitectura de Memorias</span>
                                                </div>
                                                <Gift className={cn("w-8 h-8", selectedColor.text)} />
                                            </div>
                                            <div>
                                                <p className="text-white text-2xl font-serif italic mb-6">
                                                    {message || "Capturando lo que el tiempo no puede borrar."}
                                                </p>
                                                <div className="flex justify-between items-end border-t border-white/5 pt-6">
                                                    <div>
                                                        <p className="text-tech-600 text-[8px] uppercase tracking-widest mb-1 font-bold">Identidad Visual por</p>
                                                        <p className="text-white/60 font-bold tracking-[0.2em] text-[10px] uppercase">Curiol Studio 2026</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-tech-600 text-[8px] uppercase font-bold">Abrir</span>
                                                        <div className={cn("w-8 h-[1px]", selectedColor.class)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>

                                {/* Back */}
                                <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
                                    <GlassCard className={cn("w-full h-full bg-tech-950 border-2 overflow-hidden relative", selectedColor.border, selectedColor.glow)}>
                                        <div className="absolute inset-0 bg-grain opacity-20" />
                                        <div className="relative h-full flex flex-col p-10 justify-between">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                                    <h3 className={cn("text-xl font-serif italic", selectedColor.text)}>Detalles del Obsequio</h3>
                                                    <Sparkles className="text-gold-500 w-5 h-5" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-8 text-left">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-tech-600 text-[8px] uppercase tracking-widest mb-1 font-bold">Para:</p>
                                                            <p className="text-white text-base font-serif italic leading-tight">{to || "Escribe el nombre..."}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-tech-600 text-[8px] uppercase tracking-widest mb-1 font-bold">De:</p>
                                                            <p className="text-white text-sm font-bold uppercase tracking-wider">{from || "Tu nombre..."}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-tech-600 text-[8px] uppercase tracking-widest mb-1 font-bold">Valor:</p>
                                                            <p className={cn("text-xl font-serif italic", selectedColor.text)}>₡110.000</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-tech-600 text-[8px] uppercase tracking-widest mb-1 font-bold">Vence en:</p>
                                                            <p className="text-white text-xs font-bold uppercase tracking-wider">6 Meses</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[7px] uppercase tracking-[0.2em] font-bold text-tech-700">
                                                <span>Legado Digital Garantizado</span>
                                                <span>Guanacaste, CR</span>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>
                            </motion.div>
                        </div>
                        <p className="mt-8 text-tech-600 text-xs font-light italic">Haz click en la tarjeta para ver el reverso.</p>
                    </div>

                    {/* Customization Form */}
                    <div className="space-y-10 order-first lg:order-last">
                        <GlassCard className="p-10 border-white/5 space-y-8">
                            <h3 className="text-2xl font-serif text-white italic mb-2">Formulario de <span className="text-curiol-gradient">Diseño.</span></h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest ml-1">¿Para quién es el regalo?</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            placeholder="Nombre completo"
                                            className="w-full bg-tech-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-light focus:outline-none focus:border-curiol-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest ml-1">¿De parte de quién?</label>
                                    <div className="relative group">
                                        <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            placeholder="Tu nombre o familia"
                                            className="w-full bg-tech-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-light focus:outline-none focus:border-curiol-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest ml-1">Mensaje de Inspiración</label>
                                    <div className="relative group">
                                        <MessageCircle className="absolute left-4 top-5 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Ej: Para que siempre recuerden lo felices que son juntos..."
                                            rows={2}
                                            className="w-full bg-tech-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-light focus:outline-none focus:border-curiol-500/50 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest ml-1 flex items-center gap-2">
                                        <Palette className="w-3 h-3" /> Selector de Estilo
                                    </label>
                                    <div className="flex gap-4">
                                        {GIFT_COLORS.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedColor(color)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110",
                                                    color.class,
                                                    selectedColor.name === color.name ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60"
                                                )}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <p className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-4 text-center">Inversión y Pago</p>
                                <div className="bg-tech-950 p-6 rounded-2xl border border-curiol-500/10 mb-6 text-center">
                                    <p className="text-curiol-500 text-3xl font-serif italic mb-1">₡110.000</p>
                                    <p className="text-tech-600 text-[8px] uppercase font-bold tracking-widest">Pago vía SINPE al 6060-2617</p>
                                </div>
                                <a
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-5 bg-curiol-gradient text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-xl hover:scale-[1.02] transition-all shadow-2xl flex items-center justify-center gap-4"
                                >
                                    Solicitar y Enviar Comprobante <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .shadow-3xl {
                    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
        </svg>
    );
}
