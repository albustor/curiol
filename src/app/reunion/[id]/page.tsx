"use client";

import { use, useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Video, Mic, MicOff, PhoneOff,
    MessageSquare, Sparkles, Monitor, Loader2, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

export default function PublicMeetingRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const [isInCall, setIsInCall] = useState(false);
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);

    useEffect(() => {
        // Auto-join after 2 seconds to make it feel premium
        const timer = setTimeout(() => setIsInCall(true), 2000);
        return () => clearTimeout(timer);
    }, []);

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
                    roomName: `Curiol_Studio_${id}`,
                    width: "100%",
                    height: "100%",
                    parentNode: jitsiContainerRef.current,
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        disableModeratorIndicator: true,
                        startScreenSharing: false,
                        enableEmailInStats: false,
                        prejoinPageEnabled: false,
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'desktop', 'chat', 'raisehand',
                            'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur'
                        ],
                        DEFAULT_BACKGROUND: '#020617',
                        DISABLE_VIDEO_BACKGROUND: false,
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
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
    }, [isInCall, id]);

    return (
        <div className="min-h-screen bg-tech-950 pt-24 pb-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-curiol-500/5 blur-[160px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-purple-500/5 blur-[160px] rounded-full" />
            </div>

            <main className="max-w-7xl mx-auto px-4 relative z-10 h-[calc(100vh-160px)]">
                <GlassCard className="w-full h-full overflow-hidden border-white/5 bg-tech-950/40 backdrop-blur-3xl relative flex flex-col">

                    {/* Header Bar */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-tech-950/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-curiol-gradient rounded-xl flex items-center justify-center shadow-lg shadow-curiol-500/20">
                                <Video className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-serif text-white italic leading-none">Curiol Virtual Experience</h1>
                                <p className="text-[8px] text-tech-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                                    <ShieldCheck className="w-2 h-2 text-curiol-500" /> Sesión Privada y Segura
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] text-tech-500 font-bold uppercase tracking-widest">Invitado de Honor</span>
                                <span className="text-[10px] text-curiol-500 font-mono italic">ID: {id}</span>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-glow shadow-green-500/50" />
                        </div>
                    </div>

                    {/* Meeting Viewport */}
                    <div className="flex-grow relative">
                        {!isInCall ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <Loader2 className="w-12 h-12 text-curiol-500 animate-spin mb-6" />
                                <h2 className="text-2xl font-serif text-white italic mb-2">Preparando tu Espacio...</h2>
                                <p className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.3em]">Curiol Studio Virtual Hub</p>
                            </div>
                        ) : (
                            <div ref={jitsiContainerRef} className="w-full h-full" />
                        )}
                    </div>

                    {/* Minimalist Footer Overlay */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none">
                        <div className="px-6 py-2 bg-tech-900/80 backdrop-blur-md border border-white/5 rounded-full flex items-center gap-3">
                            <Sparkles className="w-3 h-3 text-curiol-500 animate-pulse" />
                            <span className="text-[9px] text-tech-400 font-light italic">"Elevamos cada segundo de tu historia"</span>
                        </div>
                    </div>
                </GlassCard>
            </main>
        </div>
    );
}
