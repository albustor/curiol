"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProcessDocumentation } from "@/components/admin/ProcessDocumentation";
import { Loader2, ShieldAlert } from "lucide-react";

export default function DocumentacionPage() {
    const { role, isMaster } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (role !== "LOADING" && role !== "MASTER") {
            router.push("/admin/dashboard");
        }
    }, [role, isMaster, router]);

    if (role === "LOADING") {
        return (
            <div className="min-h-screen bg-tech-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
            </div>
        );
    }

    if (!isMaster) {
        return (
            <div className="min-h-screen bg-tech-950 flex flex-col items-center justify-center p-8 text-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-3xl font-serif text-white italic mb-4">Acceso Restringido</h1>
                <p className="text-tech-500 max-w-md mb-8">
                    Esta sección contiene protocolos de alto valor estratégico y solo es accesible para el Administrador Maestro.
                </p>
                <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="px-8 py-3 bg-tech-900 border border-white/5 text-white rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                >
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif text-white italic mb-2">Protocolos Maestros</h1>
                    <p className="text-tech-500 text-sm">Documentación técnica y estratégica para el crecimiento de Curiol Studio.</p>
                </header>

                <ProcessDocumentation onBack={() => router.push("/admin/dashboard")} />
            </main>
            <Footer />
        </div>
    );
}
