"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Video, VideoOff, Mic, MicOff, PhoneOff,
    Share2, Copy, MessageSquare, Plus,
    History, Users, Sparkles, Monitor, Info, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

export default function VideoCallCenter() {
    const { role } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    const [roomName, setRoomName] = useState("");
    const [isInCall, setIsInCall] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);

    const generateRoomName = () => {
        const prefix = "Curiol_Meet_";
        const random = Math.random().toString(36).substring(2, 9).toUpperCase();
        setRoomName(`${prefix}${random}`);
    };

    const startCall = () => {
        if (!roomName) return;
        setIsInCall(true);
    };

    const endCall = () => {
        if (apiRef.current) {
            apiRef.current.dispose();
            apiRef.current = null;
        }
        setIsInCall(false);
    };

    useEffect(() => {
        let api: any = null;
        let script: HTMLScriptElement | null = null;

        if (isInCall && jitsiContainerRef.current) {
            script = document.createElement("script");
            script.src = "https://meet.jit.si/external_api.js";
            script.async = true;
            script.onload = () => {
                if (!window.JitsiMeetExternalAPI) return;

                const domain = "meet.jit.si";
                const options = {
                    roomName: roomName,
                    width: "100%",
                    height: "100%",
                    parentNode: jitsiContainerRef.current,
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        disableModeratorIndicator: false,
                        startScreenSharing: false,
                        enableEmailInStats: false,
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                            'security'
                        ],
                    }
                };
                api = new window.JitsiMeetExternalAPI(domain, options);
                apiRef.current = api;
            };
            document.body.appendChild(script);
        }

        return () => {
            if (api) {
                api.dispose();
            }
            if (script && document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [isInCall, roomName]);

    const meetingUrl = typeof window !== "undefined" ? `${window.location.origin}/reunion/${roomName}` : `/reunion/${roomName}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(meetingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(`Hola, te invito a una videollamada de Curiol Studio. Únete a nuestro entorno seguro aquí: ${meetingUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    if (role === "LOADING") return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    if (role === "UNAUTHORIZED") return null;

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-curiol-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-curiol-500 w-4 h-4 animate-pulse" />
                        <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Comunicación Directa</span>
                    </div>
                    <h1 className="text-5xl font-serif text-white italic">Meet Admin Center</h1>
                    <p className="text-tech-500 mt-4 max-w-2xl">Gestiona sesiones de consultoría y seguimiento con clientes en tiempo real dentro de tu propia infraestructura.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                    {/* Control Panel */}
                    <div className="lg:col-span-4 space-y-6 flex flex-col">
                        <GlassCard className="p-8 flex-grow">
                            <h3 className="text-xl font-serif text-white italic mb-6 flex items-center gap-3">
                                <Plus className="w-5 h-5 text-curiol-500" /> Nueva Sesión
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] text-tech-500 font-bold uppercase tracking-widest block mb-4">Nombre de la Sala</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            placeholder="Ej: Consulta_Evento_01"
                                            className="flex-grow bg-tech-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-curiol-500"
                                        />
                                        <button
                                            onClick={generateRoomName}
                                            className="p-3 bg-tech-900 border border-white/5 rounded-xl text-tech-500 hover:text-white transition-all"
                                            title="Generar nombre aleatorio"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-tech-950 border border-curiol-500/20 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Google Workspace Ready</span>
                                    </div>
                                    <button
                                        onClick={() => window.open("https://meet.google.com/new", "_blank")}
                                        className="text-[10px] text-curiol-500 hover:text-white transition-all font-bold uppercase tracking-widest flex items-center gap-1"
                                    >
                                        Alternar a Meet <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>

                                {roomName && !isInCall && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-4">
                                        <div className="p-4 bg-tech-950 rounded-2xl border border-white/5 space-y-3">
                                            <p className="text-[10px] text-tech-600 font-bold uppercase tracking-widest">Enlace de Invitación</p>
                                            <p className="text-xs text-curiol-500 font-mono truncate">{meetingUrl}</p>
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={handleCopy} className="flex-grow py-2 bg-tech-800 rounded-lg text-[8px] font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 hover:bg-tech-700 transition-all">
                                                    <Copy className="w-3 h-3" /> {copied ? "Copiado" : "Copiar"}
                                                </button>
                                                <button onClick={handleWhatsAppShare} className="flex-grow py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-[8px] font-bold uppercase tracking-widest text-green-500 flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all">
                                                    <MessageSquare className="w-3 h-3" /> WhatsApp
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={startCall}
                                            className="w-full py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-curiol-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                        >
                                            <Video className="w-5 h-5" /> Iniciar Videollamada
                                        </button>
                                    </motion.div>
                                )}

                                {isInCall && (
                                    <button
                                        onClick={endCall}
                                        className="w-full py-5 bg-red-500/20 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-3"
                                    >
                                        <PhoneOff className="w-5 h-5" /> Finalizar Sesión
                                    </button>
                                )}
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 h-48">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-tech-500 mb-6 flex items-center gap-2">
                                <Info className="w-3 h-3" /> Tips de Conexión
                            </h3>
                            <ul className="text-[10px] text-tech-400 space-y-3 font-light">
                                <li className="flex items-center gap-2 italic">• Asegúrate de que el cliente use Chrome o Safari.</li>
                                <li className="flex items-center gap-2 italic">• Usa auriculares para evitar eco emocional.</li>
                                <li className="flex items-center gap-2 italic">• El enlace es único y seguro mediante SSL.</li>
                            </ul>
                        </GlassCard>
                    </div>

                    {/* Meeting Viewport */}
                    <div className="lg:col-span-8">
                        <GlassCard className="w-full h-full overflow-hidden relative border-white/5 bg-tech-950/50 backdrop-blur-xl">
                            {!isInCall ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                                    <div className="w-24 h-24 bg-tech-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center mb-8 relative">
                                        <Monitor className="w-10 h-10 text-tech-700" />
                                        <div className="absolute top-0 right-0 w-4 h-4 bg-tech-800 rounded-full border-2 border-tech-950" />
                                    </div>
                                    <h2 className="text-2xl font-serif text-tech-600 italic mb-2">Sala de Espera Virtual</h2>
                                    <p className="text-tech-700 text-[10px] uppercase font-bold tracking-widest max-w-xs">Configura una sala para activar el visor de alta fidelidad</p>
                                </div>
                            ) : (
                                <div ref={jitsiContainerRef} className="w-full h-full" />
                            )}
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
}
