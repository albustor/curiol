"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { migrateCsvToFirestore } from "@/actions/portfolio";
import { Database, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MigratePage() {
    const { role } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [count, setCount] = useState(0);

    const handleMigrate = async () => {
        setStatus("loading");
        try {
            const result = await migrateCsvToFirestore();
            if (result.success) {
                setCount(result.count);
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    if (role === "LOADING") return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    if (role === "UNAUTHORIZED") return null;

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24 flex items-center justify-center">
            <Navbar />
            <GlassCard className="max-w-md w-full p-10 border-white/5 text-center">
                <div className="w-16 h-16 bg-curiol-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Database className="w-8 h-8 text-curiol-500" />
                </div>

                <h1 className="text-3xl font-serif text-white italic mb-4">Migración de Portafolio</h1>
                <p className="text-tech-500 text-sm font-light mb-10 leading-relaxed">
                    Esta herramienta moverá todas las fotos existentes del Excel (CSV) a la nueva base de datos de Firestore para asegurar la sincronización total.
                </p>

                {status === "idle" && (
                    <button
                        onClick={handleMigrate}
                        className="w-full py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-curiol-500/20 hover:scale-[1.02] transition-all"
                    >
                        Iniciar Migración
                    </button>
                )}

                {status === "loading" && (
                    <div className="space-y-4">
                        <Loader2 className="w-8 h-8 text-curiol-500 animate-spin mx-auto" />
                        <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Procesando álbumes...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                            <p className="text-white font-bold text-lg">¡Migración Exitosa!</p>
                            <p className="text-tech-500 text-xs">Se crearon {count} álbumes en Firestore.</p>
                        </div>
                        <Link
                            href="/admin/portafolio"
                            className="w-full py-5 bg-tech-900 border border-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-tech-800 transition-all flex items-center justify-center gap-3"
                        >
                            Ir al Panel de Portafolio <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-2 text-red-500">
                            <AlertCircle className="w-10 h-10" />
                            <p className="font-bold">Error en la migración</p>
                        </div>
                        <button
                            onClick={() => setStatus("idle")}
                            className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest hover:underline"
                        >
                            Reintentar
                        </button>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
