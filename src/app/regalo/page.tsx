"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Gift, Sparkles, Camera, Send, Palette, User,
    MessageCircle, Smartphone, Music, Lock, Check,
    ChevronRight, Volume2, VolumeX, Eye, Copy, RefreshCw,
    Wand2, Stars, Info
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const MI_WHATSAPP = "50660602617";

const THEMES = [
    { id: "theme-red", name: "Rojo Pasión", color: "#a4161a", gradient: "linear-gradient(135deg, #4b0d0e 0%, #a4161a 100%)" },
    { id: "theme-green", name: "Verde Esmeralda", color: "#2d6a4f", gradient: "linear-gradient(135deg, #081c15 0%, #2d6a4f 100%)" },
    { id: "theme-blue", name: "Azul Profundo", color: "#1b263b", gradient: "linear-gradient(135deg, #0a1128 0%, #1b263b 100%)" },
    { id: "theme-gold", name: "Oro Curiol", color: "#b08968", gradient: "linear-gradient(135deg, #5e3023 0%, #b08968 100%)" },
    { id: "theme-purple", name: "Místico Púrpura", color: "#7b1fa2", gradient: "linear-gradient(135deg, #310d3e 0%, #7b1fa2 100%)" },
    { id: "theme-black", name: "Negro Obsidiana", color: "#111111", gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)" },
];

const PACKAGES = [
    { id: "mini", name: "Mini Sesión Inclusión", price: 25000, desc: "Sesión 40 min. 8 Fotos Digitales." },
    { id: "aventura", name: "Aventura Mágica", price: 95000, desc: "15 Fotos Fine Art + Canción IA + RA." },
    { id: "esencia", name: "Esencia Familiar", price: 110000, desc: "20 Fotos High-End + App Privada + Cuadro AR." },
    { id: "legado", name: "Membresía Legado", price: 25000, desc: "3 Sesiones al año (Pago mensual)." },
];

export default function GiftCardPage() {
    // Mode Logic
    const [viewMode, setViewMode] = useState(false);

    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);

    // Form State
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const [message, setMessage] = useState("");
    const [selectedTheme, setSelectedTheme] = useState(THEMES[3]); // Gold default
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[2]);
    const [aiSong, setAiSong] = useState(false);
    const [songIdeas, setSongIdeas] = useState("");
    const [senderPhone, setSenderPhone] = useState("");

    // Admin State
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [adminPin, setAdminPin] = useState("");
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [finalAudioUrl, setFinalAudioUrl] = useState("");
    const [adminCode, setAdminCode] = useState("");

    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialization & Hash Parsing
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const params = new URLSearchParams(hash);
            if (params.has('t')) setTo(params.get('t') || "");
            if (params.has('f')) setFrom(params.get('f') || "");
            if (params.has('m')) setMessage(params.get('m') || "");
            if (params.has('c')) {
                const foundTheme = THEMES.find(t => t.id === params.get('c'));
                if (foundTheme) setSelectedTheme(foundTheme);
            }
            if (params.has('p')) {
                const foundPkg = PACKAGES.find(p => p.id === params.get('p'));
                if (foundPkg) setSelectedPackage(foundPkg);
            }
            if (params.has('s')) {
                setAdminCode(params.get('s') || "");
                setViewMode(true);
            }
            if (params.has('a')) setFinalAudioUrl(params.get('a') || "");
            if (params.has('ai')) setAiSong(params.get('ai') === '1');
            if (params.has('ph')) setSenderPhone(params.get('ph') || "");
        }
    }, []);

    useEffect(() => {
        if (viewMode && isOpen) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [selectedTheme.color, '#ffffff', '#ffd700']
            });
            if (audioRef.current && !isMuted) {
                audioRef.current.play().catch(e => console.log("Audio block:", e));
            }
        }
    }, [isOpen, viewMode, selectedTheme.color, isMuted]);

    // Helper functions
    const generateCode = () => {
        const code = `CURIOL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
        setAdminCode(code);
    };

    const getLink = () => {
        const params = new URLSearchParams();
        params.set('t', to);
        params.set('f', from);
        params.set('m', message);
        params.set('c', selectedTheme.id);
        params.set('p', selectedPackage.id);
        if (adminCode) params.set('s', adminCode);
        if (finalAudioUrl) params.set('a', finalAudioUrl);
        if (aiSong) params.set('ai', '1');
        if (senderPhone) params.set('ph', senderPhone);

        const baseUrl = "https://curiol.studio/regalo";
        return `${baseUrl}#${params.toString()}`;
    };

    const handleSendToAlberto = () => {
        if (!to || !from || !senderPhone) return alert("Por favor completa los campos principales.");

        let songText = aiSong
            ? `🎵 *CANCIÓN IA ACTIVADA (+₡5.000):*%0A${songIdeas}%0A%0A`
            : `🚫 *SIN CANCIÓN*%0A%0A`;

        const text = `✨ *NUEVA SOLICITUD DE TARJETA 3D* ✨%0A%0A` +
            `👤 *De:* ${from}%0A` +
            `🎁 *Para:* ${to}%0A` +
            `📱 *WhatsApp:* ${senderPhone}%0A` +
            `📦 *Experiencia:* ${selectedPackage.name}%0A` +
            songText +
            `🔗 *BORRADOR:*%0A${getLink()}%0A%0A` +
            `💰 *Monto Total:* ₡${(selectedPackage.price + (aiSong ? 5000 : 0)).toLocaleString()}`;

        window.open(`https://wa.me/${MI_WHATSAPP}?text=${text}`, '_blank');
    };

    const handleShareWithClient = (type: 'whatsapp' | 'copy') => {
        if (aiSong && !finalAudioUrl) {
            return alert("⚠️ Debes subir el audio MP3 y pegar el link antes de compartir.");
        }
        if (!adminCode) return alert("⚠️ Genera un código de seguridad primero.");

        const url = getLink();
        const waText = `¡Hola ${to}! 👋\n\n` +
            `¡Tienes un regalo muy especial de parte de ${from}! 🎁✨\n\n` +
            `${from} ha elegido para ti una experiencia de fotografía Fine Art en Curiol Studio${aiSong ? " y una canción personalizada con IA creada especialmente para ti" : ""}.\n\n` +
            `¡Espero que te guste mucho! Nos vemos pronto para capturar magia.\n\n` +
            `👉 *TOCA AQUÍ PARA ABRIR TU REGALO:* ${url}`;

        if (type === 'copy') {
            navigator.clipboard.writeText(waText);
            alert("Enlace copiado. ¡Listo para enviar!");
        } else {
            window.open(`https://wa.me/${senderPhone}?text=${encodeURIComponent(waText)}`, '_blank');
        }
    };

    const checkAdmin = () => {
        if (btoa(adminPin) === "MjYxNzI5MTg=") {
            setIsAdminAuthenticated(true);
            if (!adminCode) generateCode();
        } else {
            alert("Acceso denegado");
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.play();
            setIsMuted(false);
        } else {
            audioRef.current.pause();
            setIsMuted(true);
        }
    };

    return (
        <div className={cn("min-h-screen flex flex-col pt-32 pb-24 transition-colors duration-1000", viewMode ? "bg-[#050505]" : "bg-tech-950")}>
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full flex flex-col lg:flex-row gap-16 items-center lg:items-start">

                {/* --- 1. CONFIGURATION SIDEBAR --- */}
                {!viewMode && (
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-[480px] shrink-0 space-y-10"
                    >
                        <header>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="h-[1px] w-12 bg-curiol-500"></span>
                                <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-[0.4em]">Digitalización Humana</span>
                            </div>
                            <h2 className="text-4xl font-serif text-white italic leading-tight">Obsequia un <span className="text-curiol-gradient">Legado Digital.</span></h2>
                        </header>

                        {/* Theme & Palette */}
                        <div className="space-y-6">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.3em] flex items-center gap-3">
                                <Palette className="w-4 h-4" /> Estilo Visual
                            </label>
                            <div className="grid grid-cols-6 gap-3">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme)}
                                        className={cn(
                                            "aspect-square rounded-full border-2 transition-all duration-500 transform hover:scale-110",
                                            selectedTheme.id === theme.id ? "border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "border-transparent opacity-40"
                                        )}
                                        style={{ background: theme.gradient }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Personalization Fields */}
                        <div className="space-y-6 p-8 bg-tech-900/30 border border-white/5 rounded-[2rem]">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.3em] flex items-center gap-3 mb-2">
                                <User className="w-4 h-4" /> Datos del Regalo
                            </label>
                            <div className="space-y-4">
                                <div className="group relative">
                                    <input
                                        value={to} onChange={(e) => setTo(e.target.value)}
                                        placeholder="¿Para quién es?"
                                        className="w-full bg-tech-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white text-sm focus:border-curiol-500 transition-all outline-none"
                                    />
                                    <User className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                </div>
                                <div className="group relative">
                                    <input
                                        value={from} onChange={(e) => setFrom(e.target.value)}
                                        placeholder="¿De parte de quién?"
                                        className="w-full bg-tech-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white text-sm focus:border-curiol-500 transition-all outline-none"
                                    />
                                    <Sparkles className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700 group-focus-within:text-curiol-500 transition-colors" />
                                </div>
                                <textarea
                                    value={message} onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Escribe un mensaje que llegue al alma..."
                                    rows={3}
                                    className="w-full bg-tech-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white text-sm focus:border-curiol-500 transition-all outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Experience Selector */}
                        <div className="space-y-6">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.3em] flex items-center gap-3">
                                <Gift className="w-4 h-4" /> Selecciona el Legado
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {PACKAGES.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={cn(
                                            "w-full flex justify-between items-center p-5 rounded-2xl border transition-all duration-500",
                                            selectedPackage.id === pkg.id
                                                ? "border-curiol-500 bg-curiol-500/10 shadow-[0_0_30px_rgba(192,119,89,0.1)]"
                                                : "border-white/5 bg-tech-900/40 hover:border-white/20"
                                        )}
                                    >
                                        <div className="text-left">
                                            <p className="text-white text-sm font-serif italic">{pkg.name}</p>
                                            <p className="text-tech-600 text-[10px] uppercase tracking-widest mt-1">{pkg.desc}</p>
                                        </div>
                                        <div className="text-curiol-500 font-bold">
                                            ₡{pkg.price.toLocaleString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AI SONG FEATURE */}
                        <div className={cn(
                            "p-8 rounded-[2rem] border transition-all duration-700 overflow-hidden relative group",
                            aiSong ? "bg-curiol-900/20 border-curiol-500/30 shadow-2xl" : "bg-tech-900/20 border-white/5"
                        )}>
                            {aiSong && <div className="absolute top-0 right-0 p-4 text-curiol-500"><Wand2 className="w-5 h-5 animate-pulse" /></div>}

                            <label className="flex items-center gap-4 cursor-pointer mb-6">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                    aiSong ? "bg-curiol-500 text-white" : "bg-tech-800 text-tech-500"
                                )}>
                                    <Music className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white text-sm font-bold uppercase tracking-widest">Canción con IA</p>
                                        <span className="text-curiol-500 text-[10px] font-bold">+ ₡5.000</span>
                                    </div>
                                    <p className="text-tech-500 text-[10px] uppercase tracking-[0.2em]">"Tu historia cantada por inteligencia artificial"</p>
                                </div>
                                <input
                                    type="checkbox" checked={aiSong}
                                    onChange={(e) => setAiSong(e.target.checked)}
                                    className="hidden"
                                />
                                <div className={cn(
                                    "w-6 h-6 border-2 rounded flex items-center justify-center transition-all",
                                    aiSong ? "border-curiol-500 bg-curiol-500" : "border-tech-800"
                                )}>
                                    {aiSong && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </label>

                            <AnimatePresence>
                                {aiSong && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4"
                                    >
                                        <p className="text-xs text-tech-400 font-light italic bg-black/40 p-4 rounded-xl border border-white/5">
                                            Resumen de Momentos: Cuéntanos anécdotas, apodos o sentimientos que quieras destacar en la letra.
                                        </p>
                                        <textarea
                                            value={songIdeas} onChange={(e) => setSongIdeas(e.target.value)}
                                            placeholder="Ej: Nos conocimos en Guanacaste, siempre ríe cuando llueve..."
                                            rows={4}
                                            className="w-full bg-tech-950 border border-white/5 rounded-2xl p-5 text-white text-xs focus:border-curiol-500 outline-none resize-none"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Checkout Section */}
                        <div className="pt-10 space-y-6">
                            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                <div className="space-y-1">
                                    <p className="text-tech-500 text-[10px] uppercase tracking-widest">Inversión Total</p>
                                    <p className="text-white text-[10px] font-light">Incluye diseño 3D interactivo y entrega digital.</p>
                                </div>
                                <div className="text-4xl font-serif text-white italic">
                                    ₡{(selectedPackage.price + (aiSong ? 5000 : 0)).toLocaleString()}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)}
                                    placeholder="Tu WhatsApp para coordinar"
                                    className="w-full bg-curiol-500/10 border border-curiol-500/20 rounded-2xl px-6 py-5 text-white text-sm focus:border-curiol-500 transition-all outline-none text-center"
                                />
                                <button
                                    onClick={handleSendToAlberto}
                                    className="w-full bg-curiol-gradient py-6 rounded-2xl text-white font-bold uppercase tracking-[0.3em] text-xs shadow-[0_20px_40px_-10px_rgba(192,119,89,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                >
                                    <Send className="w-4 h-4" /> Solicitar este Diseño
                                </button>
                            </div>

                            <button
                                onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                                className="w-full text-center text-[10px] text-tech-700 uppercase tracking-widest hover:text-curiol-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Lock className="w-3 h-3" /> Panel Administrativo Curiol Studio
                            </button>
                        </div>

                        {/* Admin Tools Drawer */}
                        <AnimatePresence>
                            {isAdminPanelOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="p-10 bg-white rounded-[3rem] space-y-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                                >
                                    {!isAdminAuthenticated ? (
                                        <div className="space-y-6">
                                            <div className="text-center space-y-2">
                                                <h4 className="text-tech-950 font-serif text-2xl italic">Validación de Maestro</h4>
                                                <p className="text-tech-500 text-[10px] uppercase tracking-widest">Ingresa el PIN de seguridad</p>
                                            </div>
                                            <input
                                                type="password" value={adminPin} onChange={(e) => setAdminPin(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-tech-50 border border-tech-100 px-6 py-4 rounded-2xl text-tech-950 text-center text-xl font-mono tracking-widest outline-none focus:border-curiol-500 transition-all"
                                            />
                                            <button
                                                onClick={checkAdmin}
                                                className="w-full bg-tech-950 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl"
                                            >
                                                Acceder al Ecosistema
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="flex justify-between items-center pb-4 border-b border-tech-50">
                                                <h4 className="text-tech-950 font-serif text-xl italic uppercase tracking-wider">Control Maestro</h4>
                                                <Check className="w-5 h-5 text-green-600" />
                                            </div>

                                            <div className="space-y-6">
                                                {aiSong && (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                                            <Music className="w-3 h-3" /> 1. Link Audio Final (Directo MP3/S3)
                                                        </label>
                                                        <input
                                                            value={finalAudioUrl} onChange={(e) => setFinalAudioUrl(e.target.value)}
                                                            placeholder="https://bucket.com/audio-final.mp3"
                                                            className="w-full bg-tech-50 border border-tech-100 px-6 py-4 rounded-2xl text-tech-950 text-xs outline-none"
                                                        />
                                                    </div>
                                                )}

                                                <div className="space-y-3">
                                                    <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <Check className="w-3 h-3" /> 2. Código de Autenticidad
                                                    </label>
                                                    <div className="flex gap-3">
                                                        <input
                                                            value={adminCode} readOnly
                                                            className="flex-grow bg-tech-50 border border-tech-100 px-6 py-4 rounded-2xl text-tech-950 text-xs font-mono font-bold"
                                                        />
                                                        <button onClick={generateCode} className="p-4 bg-tech-100 rounded-2xl hover:bg-tech-200 transition-all">
                                                            <RefreshCw className="w-5 h-5 text-tech-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3 pt-4">
                                                    <button
                                                        onClick={() => handleShareWithClient('whatsapp')}
                                                        className="w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all"
                                                    >
                                                        <MessageCircle className="w-5 h-5" /> Notificar al Comprador
                                                    </button>
                                                    <button
                                                        onClick={() => handleShareWithClient('copy')}
                                                        className="w-full bg-tech-950 text-white py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all"
                                                    >
                                                        <Copy className="w-5 h-5" /> Copiar Enlace de Regalo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* --- 2. THE 3D CANVAS & CARD --- */}
                <div className={cn(
                    "flex-grow flex flex-col items-center justify-center min-h-[600px] lg:min-h-screen relative",
                    viewMode ? "w-full" : ""
                )}>
                    {/* Background Ambience */}
                    <AnimatePresence>
                        {viewMode && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none"
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-curiol-500/5 blur-[120px] rounded-full" />
                                <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-[0.03]" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Verificador UI */}
                    {viewMode && (
                        <div className="absolute top-10 w-full text-center pointer-events-none z-20">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-tech-500 text-[9px] font-bold uppercase tracking-[0.4em]">Autenticidad Verificada</span>
                                </div>
                                <h1 className="text-white/20 font-serif text-[12vw] lg:text-[8vw] leading-none select-none italic opacity-30 mt-4 leading-none">{adminCode}</h1>
                            </motion.div>
                        </div>
                    )}

                    {/* THE 3D GIFT CARD SYSTEM */}
                    <div
                        className="perspective-1200 w-full max-w-[380px] md:max-w-[420px] aspect-[2/3] relative group"
                        onMouseEnter={() => setIsCardHovered(true)}
                        onMouseLeave={() => setIsCardHovered(false)}
                    >
                        <motion.div
                            animate={{
                                rotateY: isOpen ? 180 : (isCardHovered ? 15 : 0),
                                rotateX: isCardHovered ? -5 : 0,
                                scale: isOpen ? 1.05 : 1
                            }}
                            transition={{ type: "spring", stiffness: 80, damping: 25 }}
                            className="preserve-3d w-full h-full relative cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {/* --- FRONT: CARÁTULA --- */}
                            <div className={cn(
                                "absolute inset-0 backface-hidden rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-3xl overflow-hidden border-t border-white/30 transition-all duration-1000",
                                selectedTheme.id
                            )} style={{ background: selectedTheme.gradient }}>

                                {/* Depth layers for 3D feel */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 mix-blend-overlay" />
                                <div className="absolute inset-8 border border-white/10 rounded-[2rem] pointer-events-none" />

                                <div className="space-y-12 relative z-10 card-depth-layer">
                                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-md border border-white/20">
                                            <Gift className="w-8 h-8 text-white" />
                                        </div>
                                    </motion.div>

                                    <div className="space-y-4">
                                        <span className="text-[10px] text-white/40 tracking-[0.5em] font-bold uppercase block font-sans">Curiol Studio • 2026</span>
                                        <h3 className="text-white font-cursive text-5xl md:text-7xl leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">Un Regalo<br />Eterno.</h3>
                                        <p className="text-white/60 text-xs font-light tracking-wide max-w-[240px] mx-auto italic">Toca para descubrir lo que han preparado para ti.</p>
                                    </div>

                                    {!isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="pt-10 flex flex-col items-center gap-3"
                                        >
                                            <div className="w-12 h-[1px] bg-white/20" />
                                            <span className="text-white/30 text-[8px] font-bold uppercase tracking-[0.5em] animate-pulse">Deslizar para abrir</span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Shine Refinement */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                            </div>

                            {/* --- BACK: INTERIOR --- */}
                            <div className={cn(
                                "absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-[2.5rem] p-12 flex flex-col shadow-3xl overflow-hidden border-t border-white/20",
                                selectedTheme.id
                            )} style={{ background: selectedTheme.gradient }}>
                                <div className="absolute inset-4 border border-white/5 rounded-[2rem] pointer-events-none" />

                                <div className="relative z-10 h-full flex flex-col items-center text-center py-6">
                                    <header className="mb-12">
                                        <span className="text-[9px] text-[#bf8b26] tracking-[0.4em] font-bold uppercase block mb-3 font-serif">Certificado de Legado</span>
                                        <div className="h-[1px] w-20 bg-[#bf8b26]/30 mx-auto" />
                                    </header>

                                    <div className="space-y-6 mb-12 flex-grow flex flex-col justify-center">
                                        <h4 className="text-white font-serif text-3xl italic tracking-tight mb-2">"{message || "Hay momentos que merecen ser capturados para siempre."}"</h4>
                                        <div className="inline-flex items-center gap-3 bg-black/40 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-sm mx-auto">
                                            <div className="w-1.5 h-1.5 rounded-full bg-curiol-500" />
                                            <span className="text-[#bf8b26] text-[10px] font-bold uppercase tracking-widest font-sans">
                                                Experiencia {selectedPackage.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-10 mt-auto">
                                        <div className="grid grid-cols-2 gap-8 relative">
                                            <div className="space-y-1">
                                                <span className="text-[8px] text-white/40 tracking-widest uppercase font-bold block">Expedido para</span>
                                                <p className="text-[#bf8b26] font-serif text-2xl italic leading-none">{to || "Especial"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] text-white/40 tracking-widest uppercase font-bold block">Enviado por</span>
                                                <p className="text-[#bf8b26] font-serif text-2xl italic leading-none">{from || "Alguien"}</p>
                                            </div>
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-8 bg-white/10" />
                                        </div>

                                        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                                            <div className="flex items-center gap-6">
                                                {aiSong && (
                                                    <div className="flex items-center gap-2 text-[#bf8b26]">
                                                        <Music className="w-3.5 h-3.5" />
                                                        <span className="text-[8px] font-bold uppercase tracking-widest">Canción Incluida</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-white/30">
                                                    <Lock className="w-3 h-3" />
                                                    <span className="text-[8px] font-bold uppercase tracking-widest">Cod: {adminCode || "PENDIENTE"}</span>
                                                </div>
                                            </div>
                                            <p className="text-[#bf8b26] text-[8px] font-bold tracking-[0.3em] font-sans">WWW.ALBERTO-BUSTOS.COM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* --- CONTROLES FLOTANTES --- */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex items-center gap-6 z-50 px-8 py-5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-3xl"
                                >
                                    {finalAudioUrl && (
                                        <button
                                            onClick={toggleMusic}
                                            className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                                                isMuted ? "bg-tech-950 text-tech-500" : "bg-curiol-500 text-white shadow-[0_0_20px_rgba(192,119,89,0.5)]"
                                            )}
                                        >
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => window.print()}
                                        className="w-12 h-12 rounded-full bg-tech-950 text-white flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                    {viewMode && (
                                        <div className="h-6 w-[1px] bg-white/10 mx-2" />
                                    )}
                                    {viewMode && (
                                        <a
                                            href={`https://wa.me/${MI_WHATSAPP}?text=Hola Alberto! Tengo el certificado ${adminCode}. Me gustaría coordinar mi sesión.`}
                                            target="_blank"
                                            className="px-6 py-3 bg-white text-tech-950 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                                        >
                                            Agendar Cita
                                        </a>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {!viewMode && !isOpen && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="lg:hidden fixed bottom-10 right-10 bg-curiol-700 text-white w-16 h-16 rounded-full shadow-3xl flex items-center justify-center z-[100] border-2 border-white/20"
                            onClick={() => document.getElementById('preview-point')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Eye className="w-6 h-6" />
                        </motion.button>
                    )}
                </div>

                <div id="preview-point" />

                {/* --- AUDIO SYSTEM --- */}
                {finalAudioUrl && (
                    <audio
                        ref={audioRef}
                        src={finalAudioUrl}
                        loop
                        onPlay={() => setIsMuted(false)}
                        onPause={() => setIsMuted(true)}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}
