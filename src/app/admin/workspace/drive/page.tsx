"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { HardDrive, ExternalLink, Info, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

export default function GoogleDriveExplorer() {
    const { role, user } = useRole();
    const router = useRouter();

    // Folder IDs for Curiol Studio Workspace (Placeholders - Alberto can update these)
    const folders = [
        { name: "Producciones 2026", id: "1_7pW3z-7v3_k_PLACEHOLDER_A" },
        { name: "Entregas Clientes", id: "1_7pW3z-7v3_k_PLACEHOLDER_B" },
        { name: "Material Creativo", id: "1_7pW3z-7v3_k_PLACEHOLDER_C" }
    ];

    const [activeFolder, setActiveFolder] = useState(folders[0]);
    const isWorkspaceAccount = user?.email?.endsWith("@curiol.studio");

    if (role === "LOADING") return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    if (role === "UNAUTHORIZED") return null;

    return (
        <div className="min-h-screen bg-tech-950 pt-32 pb-24 relative overflow-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 relative z-10">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <HardDrive className="text-curiol-500 w-4 h-4" />
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest">Ecosistema Workspace</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic">Drive Explorer</h1>
                        <p className="text-tech-500 mt-4 max-w-2xl">Gestiona archivos, producciones y media directamente desde el almacenamiento centralizado de Curiol Studio.</p>

                        {!isWorkspaceAccount && (
                            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl max-w-2xl flex items-start gap-4">
                                <Info className="text-orange-500 w-5 h-5 shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mb-1">¡Posible Conflicto de Cuenta!</p>
                                    <p className="text-[10px] text-tech-400 leading-relaxed">
                                        Parece que no estás usando una cuenta <b>@curiol.studio</b>. Si ves un error de Google abajo, es porque Drive detecta tu sesión personal activa en el navegador.
                                    </p>
                                    <a
                                        href="https://accounts.google.com/AccountChooser"
                                        target="_blank"
                                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500/30 transition-all"
                                    >
                                        Validar Sesión de Workspace <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="p-4 bg-tech-900 border border-white/5 rounded-2xl text-tech-500 hover:text-white transition-all flex items-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Volver</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Folder Shortcuts */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-tech-500 px-2 flex items-center gap-2">
                            <Info className="w-3 h-3" /> Carpetas Maestras
                        </h3>
                        {folders.map(folder => (
                            <GlassCard
                                key={folder.id}
                                onClick={() => setActiveFolder(folder)}
                                className={`p-4 transition-all cursor-pointer group ${activeFolder.id === folder.id ? 'border-curiol-500/50 bg-curiol-500/5' : 'hover:border-curiol-500/30'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${activeFolder.id === folder.id ? 'bg-curiol-500/20' : 'bg-blue-500/10'}`}>
                                            <HardDrive className={`w-4 h-4 ${activeFolder.id === folder.id ? 'text-curiol-500' : 'text-blue-500'}`} />
                                        </div>
                                        <span className={`text-xs font-bold transition-all ${activeFolder.id === folder.id ? 'text-curiol-500' : 'text-white group-hover:text-curiol-500'}`}>{folder.name}</span>
                                    </div>
                                    <ExternalLink className={`w-3 h-3 ${activeFolder.id === folder.id ? 'text-curiol-500' : 'text-tech-800'}`} />
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Main Explorer Viewport */}
                    <div className="lg:col-span-3">
                        <GlassCard className="w-full h-[700px] overflow-hidden border-white/5 bg-tech-900/50 relative">
                            {activeFolder.id.includes("PLACEHOLDER") ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-20 h-20 bg-curiol-500/10 rounded-3xl flex items-center justify-center mb-8 border border-curiol-500/20">
                                        <HardDrive className="w-10 h-10 text-curiol-500" />
                                    </div>
                                    <h2 className="text-3xl font-serif text-white italic mb-4">Configuración Requerida</h2>
                                    <p className="text-tech-500 text-sm font-light max-w-md mb-8">
                                        Para activar este visor, necesitas reemplazar los IDs de las carpetas en el archivo: <br />
                                        <code className="bg-tech-950 px-2 py-1 rounded text-curiol-200 text-[10px] mt-2 inline-block">src/app/admin/workspace/drive/page.tsx</code>
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full max-w-2xl">
                                        <div className="p-4 bg-tech-950/50 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-curiol-500 font-bold uppercase mb-2">1. Obtener ID</p>
                                            <p className="text-[10px] text-tech-400">Abre tu carpeta en Google Drive y copia el código que aparece al final de la URL.</p>
                                        </div>
                                        <div className="p-4 bg-tech-950/50 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-curiol-500 font-bold uppercase mb-2">2. Compartir</p>
                                            <p className="text-[10px] text-tech-400">Asegúrate de que la carpeta esté compartida como "Cualquier persona con el enlace puede ver".</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    src={`https://drive.google.com/embeddedfolderview?id=${activeFolder.id}#grid`}
                                    className="w-full h-full border-none grayscale-[0.5] invert-[0.9] hue-rotate-180 contrast-125"
                                    title="Google Drive Explorer"
                                    allow="autoplay"
                                />
                            )}

                            {/* Branding Overlay */}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-tech-950/80 backdrop-blur-md rounded-full border border-curiol-500/30">
                                <span className="text-[8px] font-bold uppercase tracking-widest text-curiol-500 italic">Curiol Workspace Security</span>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
}
