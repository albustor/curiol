"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, ArrowRight, AlertCircle, Loader2, Key, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");
    const [mode, setMode] = useState<"auth" | "pin">("pin");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Clear any old sessions if arriving here
        localStorage.removeItem("master_admin");
    }, []);

    const handlePinLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const MASTER_PIN = "26172918";
        if (pin.trim() === MASTER_PIN) {
            localStorage.setItem("master_admin", "true");
            localStorage.setItem("admin_session_start", Date.now().toString());
            router.push("/admin/dashboard");
        } else {
            setError("PIN Maestro incorrecto.");
            setLoading(false);
        }
    };

    const handleAuthLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin/dashboard");
        } catch (err: any) {
            setError("Acceso denegado. Solo personal autorizado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />
            <div className="w-full h-1 bg-curiol-gradient shadow-[0_0_15px_rgba(176,137,104,0.5)] z-[60]" />
            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <GlassCard className="border-curiol-500/20 p-8">
                        <div className="text-center mb-10">
                            <div className="inline-flex p-4 bg-curiol-500/10 rounded-full text-curiol-500 mb-6">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-serif text-white italic mb-2">Panel Maestro</h1>
                            <p className="text-tech-500 text-sm italic">Curiol Studio Control Hub</p>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex p-1 bg-tech-900 rounded-xl mb-8 border border-white/5">
                            <button
                                onClick={() => setMode("pin")}
                                className={cn(
                                    "flex-grow flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                    mode === "pin" ? "bg-curiol-700 text-white shadow-lg" : "text-tech-500 hover:text-white"
                                )}
                            >
                                <Key className="w-3 h-3" /> Llave Maestra
                            </button>
                            <button
                                onClick={() => setMode("auth")}
                                className={cn(
                                    "flex-grow flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                    mode === "auth" ? "bg-curiol-700 text-white shadow-lg" : "text-tech-500 hover:text-white"
                                )}
                            >
                                <Mail className="w-3 h-3" /> Email Admin
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm mb-6 animate-fade-in">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        {mode === "pin" ? (
                            <form onSubmit={handlePinLogin} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest text-center">Ingresa el PIN de Acceso</label>
                                    <input
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="••••••••"
                                        autoFocus
                                        className="w-full bg-tech-900 border border-tech-800 focus:border-curiol-500 outline-none p-5 rounded-2xl text-white text-center text-3xl font-mono tracking-[1em] transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2 rounded-2xl"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Validar Maestro <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAuthLogin} className="space-y-6">
                                <div>
                                    <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">Email Profesional (@curiol.studio)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu-nombre@curiol.studio"
                                        required
                                        className="w-full bg-tech-900 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">Contraseña</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-tech-900 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-tech-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10 hover:bg-tech-800 transition-all shadow-xl flex items-center justify-center gap-2 rounded-xl"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Acceder por Firebase <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>
                        )}
                    </GlassCard>
                </div>
            </main>
            <Footer />
        </div>
    );
}
