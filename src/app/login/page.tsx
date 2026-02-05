"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const useRouterHook = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            useRouterHook.push("/"); // Or to a dashboard/last page
        } catch (err: any) {
            setError("Credenciales inválidas. Por favor intenta de nuevo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <GlassCard className="border-curiol-500/20 p-8">
                        <div className="text-center mb-10">
                            <div className="inline-flex p-4 bg-curiol-500/10 rounded-full text-curiol-500 mb-6">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-serif text-white italic mb-2">Área de Clientes</h1>
                            <p className="text-tech-500 text-sm">Accede a tu legado digital y descargas</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-tech-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="w-full bg-tech-900/50 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-tech-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-tech-900/50 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all shadow-xl flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Entrar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-10 border-t border-tech-800 text-center">
                            <p className="text-tech-500 text-xs">
                                ¿No tienes acceso? <Link href="/cotizar" className="text-curiol-500 hover:underline">Reserva tu sesión aquí</Link>
                            </p>
                        </div>
                    </GlassCard>
                </div>
            </main>
            <Footer />
        </div>
    );
}

import Link from "next/link";
