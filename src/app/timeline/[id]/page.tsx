"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TimelineView } from "@/components/TimelineView";
import { getTimelineById } from "@/actions/timeline";
import { EvolutiveTimeline } from "@/types/timeline";
import { Loader2, AlertCircle, ArrowLeft, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ClientTimelineView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [timeline, setTimeline] = useState<EvolutiveTimeline | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getTimelineById(id);
            setTimeline(data);
            setIsLoading(false);
        }
        load();
    }, [id]);

    const handleRemoveEvent = async (eventId: string) => {
        if (!timeline) return;
        const confirm = window.confirm("¿Estás seguro de quitar este momento de tu línea de tiempo?");
        if (!confirm) return;

        const updatedEvents = timeline.events.filter(e => e.id !== eventId);

        try {
            const docRef = doc(db, "evolutive_timelines", timeline.id);
            await updateDoc(docRef, {
                events: updatedEvents,
                updatedAt: serverTimestamp()
            });
            setTimeline({ ...timeline, events: updatedEvents });
        } catch (error) {
            console.error("Error removing event:", error);
            alert("No se pudo quitar el momento. Intenta de nuevo.");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    if (!timeline) return (
        <div className="min-h-screen bg-tech-950 flex flex-col items-center justify-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
            <h1 className="text-2xl text-white font-serif italic mb-4">Línea de Tiempo no encontrada</h1>
            <button onClick={() => router.push("/timeline")} className="text-curiol-500 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver a mis memorias
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-tech-950">
            <Navbar />

            {/* Control Header for Client Self-Management */}
            <div className="fixed top-24 left-0 w-full z-[40] px-4 md:px-8 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
                    <button
                        onClick={() => router.push("/timeline")}
                        className="p-3 bg-tech-900/80 backdrop-blur-xl border border-white/5 rounded-2xl text-tech-500 hover:text-white transition-all shadow-2xl"
                        title="Volver al Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="px-6 py-2 bg-curiol-500/10 backdrop-blur-xl border border-curiol-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-curiol-500">
                            Modo Autogestión Activo
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-grow pt-20">
                <TimelineView
                    timeline={timeline}
                    editable={true}
                    onRemoveEvent={handleRemoveEvent}
                />
            </main>

            <Footer />
        </div>
    );
}
