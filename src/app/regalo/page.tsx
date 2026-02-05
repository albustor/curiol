"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Gift, Sparkles, Camera, Send, Palette, User,
    MessageCircle, Smartphone, Music, Lock, Check,
    ChevronRight, Volume2, VolumeX, Eye, Copy, RefreshCw
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const MI_WHATSAPP = "50660602617";

const THEMES = [
    { id: "theme-red", name: "Rojo Clásico", color: "#a4161a" },
    { id: "theme-green", name: "Verde Bosque", color: "#2d6a4f" },
    { id: "theme-blue", name: "Azul Real", color: "#1b263b" },
    { id: "theme-gold", name: "Oro Tierra", color: "#b08968" },
    { id: "theme-purple", name: "Púrpura", color: "#7b1fa2" },
    { id: "theme-black", name: "Negro", color: "#111111" },
    { id: "theme-pink", name: "Rosa Romántico", color: "#d81b60" },
    { id: "theme-teal", name: "Turquesa", color: "#00897b" },
];

const PACKAGES = [
    { id: "mini", name: "Minisesiones", price: 30000, desc: "10 Fotos (1 vez al mes)" },
    { id: "aventura", name: "Aventura Mágica", price: 60000, desc: "Fantasía IA + Photobook" },
    { id: "esencia", name: "Esencia Familiar", price: 80000, desc: "25 Fotos + Cuadro AR" },
    { id: "legado", name: "Membresía Legado", price: 25000, desc: "Membresía (Mensual)" },
];

export default function GiftCardPage() {
    // Mode Logic
    const [viewMode, setViewMode] = useState(false);

    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Form State
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const [message, setMessage] = useState("");
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[2]);
    const [includeSong, setIncludeSong] = useState(true);
    const [songIdeas, setSongIdeas] = useState("");
    const [aiSong, setAiSong] = useState(false);
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
            if (params.has('song')) setIncludeSong(params.get('song') === '1');
            if (params.has('ai')) setAiSong(params.get('ai') === '1');
            if (params.has('ph')) setSenderPhone(params.get('ph') || "");
        }
    }, []);

    // Helper functions
    const generateCode = () => {
        const code = `NAV-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
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
        params.set('song', includeSong ? '1' : '0');
        if (aiSong) params.set('ai', '1');
        if (senderPhone) params.set('ph', senderPhone);

        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}#${params.toString()}`;
    };

    const handleSendToAlberto = () => {
        if (!senderPhone) return alert("Por favor ingresa tu WhatsApp.");

        let songText = includeSong
            ? `🎵 *IDEAS CANCIÓN:*%0A${songIdeas}${aiSong ? "%0A⚠️ CON IA (+₡5.000)" : ""}%0A%0A`
            : `🚫 *SIN CANCIÓN*%0A%0A`;

        const text = `Hola Alberto! Quiero regalar una tarjeta:%0A%0A` +
            `De: ${from}%0A` +
            `Para: ${to}%0A` +
            `Mi Teléfono: ${senderPhone}%0A` +
            `Paquete: ${selectedPackage.name}%0A` +
            songText +
            `🔗 *ENLACE BORRADOR:*%0A${getLink()}%0A%0A` +
            `Adjunto comprobante SINPE por ₡${(selectedPackage.price + (aiSong ? 5000 : 0)).toLocaleString()}.`;

        window.open(`https://wa.me/${MI_WHATSAPP}?text=${text}`, '_blank');
    };

    const handleShareWithClient = (type: 'whatsapp' | 'copy') => {
        if (includeSong && !finalAudioUrl) {
            return alert("⚠️ Falta el link de la canción (MP3).");
        }
        if (!adminCode) return alert("⚠️ Genera un código de seguridad primero.");

        const url = getLink();
        const waText = `¡Hola ${to}! 👋\n\n` +
            `¡Tienes un Regalo de parte de ${from}! 🎁✨\n\n` +
            `${from} ha pensado en ti para capturar un momento inolvidable${includeSong ? " y te envía esta tarjeta con una canción especial" : ""}.\n` +
            `Te esperamos en nuestra sesión. 📸\n\n` +
            `👉 *ABRIR TU TARJETA:* ${url}\n\n` +
            `⚠️ *Nota:* Revisa los pasos previos aquí: https://alberto-bustos.com/landingpage/`;

        if (type === 'copy') {
            navigator.clipboard.writeText(waText);
            alert("Enlace copiado al portapapeles");
        } else {
            if (!senderPhone) return alert("Ingresa el teléfono del Comprador.");
            window.open(`https://wa.me/${senderPhone}?text=${encodeURIComponent(waText)}`, '_blank');
        }
    };

    const checkAdmin = () => {
        if (btoa(adminPin) === "MjYxNzI5MTg=") {
            setIsAdminAuthenticated(true);
            if (!adminCode) generateCode();
        } else {
            alert("PIN Incorrecto");
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
        <div className={cn("min-h-screen flex flex-col pt-32 pb-24 transition-colors duration-700", viewMode ? "bg-black" : "bg-tech-950")}>
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full h-full flex flex-col lg:flex-row gap-12 items-center lg:items-start">

                {/* 1. EDITOR PANEL */}
                {!viewMode && (
                    <div className="w-full lg:w-[450px] shrink-0 space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-3xl font-cinzel text-white leading-tight">Diseñador de <span className="text-curiol-gradient">Regalos.</span></h2>
                            <p className="text-tech-500 text-xs font-lato mt-2">Personaliza una experiencia de legado única.</p>
                        </div>

                        {/* Theme Selector */}
                        <div className="space-y-4">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                <Palette className="w-3 h-3" /> Estilo & Color
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme)}
                                        className={cn(
                                            "w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 shadow-lg",
                                            selectedTheme.id === theme.id ? "border-white scale-110" : "border-transparent opacity-60"
                                        )}
                                        style={{ backgroundColor: theme.color }}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3" /> Mensaje
                            </label>
                            <input
                                value={to} onChange={(e) => setTo(e.target.value)}
                                placeholder="Para (Ej: Mi Esposa...)"
                                className="w-full bg-tech-900/50 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 transition-all outline-none"
                            />
                            <input
                                value={from} onChange={(e) => setFrom(e.target.value)}
                                placeholder="De (Ej: Alberto...)"
                                className="w-full bg-tech-900/50 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 transition-all outline-none"
                            />
                            <textarea
                                value={message} onChange={(e) => setMessage(e.target.value)}
                                placeholder="Un mensaje especial..."
                                rows={3}
                                className="w-full bg-tech-900/50 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 transition-all outline-none resize-none"
                            />
                        </div>

                        {/* Packages */}
                        <div className="space-y-4">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                <Gift className="w-3 h-3" /> Experiencia
                            </label>
                            <div className="space-y-3">
                                {PACKAGES.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={cn(
                                            "w-full flex justify-between items-center p-4 rounded-xl border transition-all",
                                            selectedPackage.id === pkg.id
                                                ? "border-curiol-500 bg-curiol-500/5"
                                                : "border-white/5 bg-tech-900/20 hover:border-white/20"
                                        )}
                                    >
                                        <div className="text-left">
                                            <p className="text-white text-sm font-cinzel">{pkg.name}</p>
                                            <p className="text-tech-600 text-[10px]">{pkg.desc}</p>
                                        </div>
                                        <div className="bg-tech-950 px-3 py-1 rounded-md text-curiol-500 text-xs font-bold">
                                            ₡{pkg.price.toLocaleString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Song Section */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 p-4 bg-tech-900/20 border border-white/5 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox" checked={includeSong}
                                    onChange={(e) => setIncludeSong(e.target.checked)}
                                    className="w-5 h-5 accent-curiol-500"
                                />
                                <span className="text-white text-sm font-bold flex items-center gap-2"><Music className="w-4 h-4" /> Incluir Canción</span>
                            </label>

                            <AnimatePresence>
                                {includeSong && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div className="p-4 bg-curiol-900/20 border border-curiol-500/20 rounded-xl space-y-3">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox" checked={aiSong}
                                                    onChange={(e) => setAiSong(e.target.checked)}
                                                    className="mt-1 w-4 h-4 accent-curiol-500"
                                                />
                                                <div className="flex-grow">
                                                    <p className="text-white text-xs font-bold">Personalización con IA (+₡5,000)</p>
                                                    <p className="text-tech-600 text-[10px]">Cuéntanos ideas o sentimientos para la letra.</p>
                                                </div>
                                            </label>
                                            <textarea
                                                value={songIdeas} onChange={(e) => setSongIdeas(e.target.value)}
                                                placeholder="Ej: Nuestra amistad empezó en el colegio..."
                                                className="w-full bg-tech-950 border border-white/5 rounded-lg p-3 text-white text-xs focus:border-curiol-500 outline-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Delivery */}
                        <div className="space-y-4">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest">Tu contacto</label>
                            <input
                                value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)}
                                placeholder="Tu WhatsApp (Ej: 60602617)"
                                className="w-full bg-tech-900/50 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 outline-none"
                            />
                        </div>

                        {/* CTA */}
                        <div className="pt-6 border-t border-white/5 space-y-4 text-center">
                            <p className="text-[10px] text-tech-500 uppercase tracking-widest">Total: ₡{(selectedPackage.price + (aiSong ? 5000 : 0)).toLocaleString()}</p>
                            <button
                                onClick={handleSendToAlberto}
                                className="w-full bg-curiol-gradient py-5 rounded-2xl text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                <MessageCircle className="w-4 h-4" /> Solicitar Tarjeta
                            </button>

                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                                    className="text-[9px] text-tech-700 uppercase tracking-widest hover:text-curiol-500 transition-colors flex items-center gap-1"
                                >
                                    <Lock className="w-2.5 h-2.5" /> Soy Alberto Bustos
                                </button>
                            </div>
                        </div>

                        {/* Admin Tools */}
                        <AnimatePresence>
                            {isAdminPanelOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className="p-8 bg-white rounded-3xl space-y-6 shadow-2xl"
                                >
                                    {!isAdminAuthenticated ? (
                                        <div className="space-y-4">
                                            <h4 className="text-tech-900 font-cinzel font-bold">Acceso de Seguridad</h4>
                                            <input
                                                type="password" value={adminPin} onChange={(e) => setAdminPin(e.target.value)}
                                                placeholder="PIN"
                                                className="w-full bg-tech-50 border border-tech-100 px-4 py-3 rounded-xl text-tech-900 outline-none"
                                            />
                                            <button
                                                onClick={checkAdmin}
                                                className="w-full bg-tech-900 text-white py-3 rounded-xl font-bold text-xs uppercase"
                                            >
                                                Ingresar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center pb-2 border-b border-tech-100">
                                                <h4 className="text-tech-900 font-cinzel font-bold text-sm">Área del Fotógrafo</h4>
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>

                                            {includeSong && (
                                                <div className="space-y-2">
                                                    <label className="text-[9px] text-tech-500 font-bold uppercase tracking-widest">1. Link Canción Final (MP3)</label>
                                                    <input
                                                        value={finalAudioUrl} onChange={(e) => setFinalAudioUrl(e.target.value)}
                                                        placeholder="https://.../audio.mp3"
                                                        className="w-full bg-tech-50 border border-tech-100 px-4 py-3 rounded-xl text-tech-900 text-xs outline-none"
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="text-[9px] text-tech-500 font-bold uppercase tracking-widest">2. Código de Seguridad</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={adminCode} readOnly
                                                        className="flex-grow bg-tech-50 border border-tech-100 px-4 py-3 rounded-xl text-tech-900 text-xs font-mono"
                                                    />
                                                    <button onClick={generateCode} className="p-3 bg-tech-100 rounded-xl hover:bg-tech-200 transition-colors">
                                                        <RefreshCw className="w-4 h-4 text-tech-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <button
                                                    onClick={() => handleShareWithClient('whatsapp')}
                                                    className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <MessageCircle className="w-4 h-4" /> Enviar al Comprador
                                                </button>
                                                <button
                                                    onClick={() => handleShareWithClient('copy')}
                                                    className="w-full bg-tech-900 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                                >
                                                    <Copy className="w-4 h-4" /> Copiar Enlace Final
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 2. PREVIEW SECTION */}
                <div className={cn("flex-grow flex flex-col items-center justify-center relative", viewMode ? "w-full" : "")}>
                    {viewMode && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                <span className="text-tech-500 text-[10px] font-bold uppercase tracking-[0.5em] block mb-2">Regalo Verificado</span>
                                <h1 className="text-white font-cinzel text-xl tracking-[0.2em]">{adminCode}</h1>
                            </motion.div>
                        </div>
                    )}

                    <div className="perspective-1200 w-full max-w-[350px] md:max-w-[380px] h-[500px] md:h-[600px] relative group select-none">
                        <motion.div
                            animate={{ rotateY: isOpen ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 60, damping: 20 }}
                            className="preserve-3d w-full h-full relative cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {/* FRONT SIDE (Tapa) */}
                            <div className={cn(
                                "absolute inset-0 backface-hidden rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-3xl overflow-hidden border-t border-white/20 transition-all duration-700",
                                selectedTheme.id
                            )} style={{ background: `var(--card-gradient, ${selectedTheme.color})` }}>
                                {/* Border deco */}
                                <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none" />

                                <div className="space-y-6 md:space-y-8 relative z-10 scale-90 md:scale-100">
                                    <span className="text-[9px] md:text-[10px] text-white/40 tracking-[0.3em] md:tracking-[0.4em] font-bold uppercase block">Curiol Studio</span>
                                    <h3 className="text-white font-cursive text-4xl md:text-6xl leading-none drop-shadow-2xl">¡Tienes un<br />Regalo!</h3>
                                    <p className="text-white/80 text-xs md:text-sm font-lato leading-relaxed max-w-[200px] md:max-w-[240px] mx-auto">Alguien especial ha pensado en ti para capturar un momento inolvidable.</p>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-8 bg-white text-black px-8 py-4 rounded-full font-cinzel text-xs font-bold tracking-widest shadow-2xl flex items-center gap-3 mx-auto"
                                    >
                                        <Gift className="w-4 h-4" /> ABRIR REGALO
                                    </motion.button>
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                            </div>

                            {/* BACK SIDE (Interior) */}
                            <div className={cn(
                                "absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-3xl p-10 flex flex-col shadow-3xl overflow-hidden border-t border-white/20",
                                selectedTheme.id
                            )} style={{ background: `var(--card-gradient, ${selectedTheme.color})` }}>
                                <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none" />

                                <div className="relative z-10 h-full flex flex-col text-center">
                                    <span className="text-[8px] md:text-[9px] text-[#bf8b26] tracking-[0.3em] md:tracking-[0.4em] font-bold uppercase block mb-8 md:mb-12 font-cinzel">Alberto Bustos Fotografía</span>

                                    <div className="space-y-4 md:space-y-8 mb-8 md:mb-12">
                                        <h4 className="text-[#bf8b26] font-cinzel text-xl md:text-2xl tracking-[0.1em] font-bold italic">Sesión Fotográfica</h4>
                                        <div className="inline-block bg-black/30 px-4 md:px-5 py-2 rounded-full border border-white/5">
                                            <span className="text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest font-lato">
                                                {selectedPackage.name} | 10 FOTOS
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-grow flex items-center justify-center">
                                        <p className="text-white font-cursive text-2xl md:text-3xl leading-snug px-4">
                                            "{message || "Los mejores momentos merecen ser eternos."}"
                                        </p>
                                    </div>

                                    <div className="space-y-8 mt-auto">
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <span className="text-[9px] text-white/40 tracking-widest uppercase font-bold block mb-1">Para</span>
                                                <span className="text-[#bf8b26] font-cinzel text-lg font-bold uppercase">{to || "Especial"}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/40 tracking-widest uppercase font-bold block mb-1">De</span>
                                                <span className="text-[#bf8b26] font-cinzel text-lg font-bold uppercase">{from || "Alguien"}</span>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {viewMode && adminCode && (
                                                    <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Código: {adminCode}</span>
                                                )}
                                                {!viewMode && (
                                                    <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Vista Borrador</span>
                                                )}
                                            </div>
                                            <a href="https://alberto-bustos.com" className="text-[#bf8b26] text-[8px] font-bold tracking-[0.2em] hover:underline transition-all">VISITAR ESTUDIO</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating View Controls */}
                        {isOpen && (
                            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex gap-4 animate-fade-in">
                                {finalAudioUrl && (
                                    <button
                                        onClick={toggleMusic}
                                        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-xl"
                                    >
                                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                    </button>
                                )}
                                <button
                                    onClick={() => window.print()}
                                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-xl"
                                >
                                    <Camera className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </div>

                    {!viewMode && !isOpen && (
                        <motion.button
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="lg:hidden fixed bottom-6 right-6 bg-curiol-700 text-white px-8 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-2xl flex items-center gap-3 z-[100]"
                            onClick={() => document.getElementById('preview-point')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Eye className="w-4 h-4" /> Ver Tarjeta
                        </motion.button>
                    )}
                </div>

                {/* Print Hidden Anchor */}
                <div id="preview-point" />

                {/* Audio Element */}
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
