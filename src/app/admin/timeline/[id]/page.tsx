"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    ArrowLeft, Save, Plus, Trash2, Image as ImageIcon,
    Video, Calendar, MapPin, Tag, Sparkles, Loader2,
    Palette, ChevronRight, CheckCircle2, AlertCircle, Eye, Settings
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getTimelineById, addTimelineEvent, updateTimelineTheme } from "@/actions/timeline";
import { getAlbums } from "@/actions/portfolio";
import { EvolutiveTimeline, TimelineEvent, TimelineTheme } from "@/types/timeline";
import { getDirectImageUrl, cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

export default function TimelineEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { role } = useRole();
    const router = useRouter();

    const [timeline, setTimeline] = useState<EvolutiveTimeline | null>(null);
    const [albums, setAlbums] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'events' | 'theme' | 'settings'>('events');

    // New Event State
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState<Omit<TimelineEvent, 'id'>>({
        date: new Date().toISOString().split('T')[0],
        title: "",
        description: "",
        mediaUrl: "",
        mediaType: 'image',
    });

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        }
    }, [role, router]);

    useEffect(() => {
        async function loadData() {
            const [tData, aData] = await Promise.all([
                getTimelineById(id),
                getAlbums()
            ]);
            setTimeline(tData);
            setAlbums(aData);
            setIsLoading(false);
        }
        loadData();
    }, [id]);

    const handleAddEvent = async () => {
        if (!newEvent.title || !newEvent.mediaUrl) return alert("Completa el título y la URL de imagen/video");

        setIsSaving(true);
        const success = await addTimelineEvent(id, newEvent);
        if (success) {
            const updated = await getTimelineById(id);
            setTimeline(updated);
            setShowEventModal(false);
            setNewEvent({
                date: new Date().toISOString().split('T')[0],
                title: "",
                description: "",
                mediaUrl: "",
                mediaType: 'image',
            });
        }
        setIsSaving(false);
    };

    const handleThemeChange = async (theme: TimelineTheme) => {
        setIsSaving(true);
        const success = await updateTimelineTheme(id, theme);
        if (success && timeline) {
            setTimeline({ ...timeline, theme });
        }
        setIsSaving(false);
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
            <button onClick={() => router.push("/admin/timeline")} className="text-curiol-500 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver a Gestión
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950 overflow-x-hidden">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <button onClick={() => router.push("/admin/timeline")} className="p-3 bg-white/5 border border-white/10 rounded-xl text-tech-500 hover:text-white transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <p className="text-[10px] text-tech-600 font-bold uppercase tracking-[0.4em] mb-2 font-mono">Editor de Legado</p>
                            <h1 className="text-3xl md:text-4xl font-serif text-white italic">{timeline.clientName}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/timeline/demo`}
                            className="px-6 py-3 border border-white/10 text-tech-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest rounded-xl flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" /> Vista Previa Phygital
                        </Link>
                        <button className="px-8 py-3 bg-curiol-gradient text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-2xl shadow-curiol-500/20">
                            Publicar Evolución
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-tech-900/50 rounded-2xl w-fit mb-12 border border-white/5">
                    {(['events', 'theme', 'settings'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                activeTab === tab ? "bg-curiol-500 text-white shadow-lg" : "text-tech-500 hover:text-tech-300"
                            )}
                        >
                            {tab === 'events' && 'Eventos'}
                            {tab === 'theme' && 'Mundo Visual (Temas)'}
                            {tab === 'settings' && 'Configuración'}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        {activeTab === 'events' && (
                            <section className="space-y-8 pb-20">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-serif text-white italic">Hitos de Vida</h2>
                                    <button
                                        onClick={() => setShowEventModal(true)}
                                        className="flex items-center gap-2 text-curiol-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Añadir Momento
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {timeline.events.length > 0 ? timeline.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event, idx) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-6 p-6 bg-tech-900/40 border border-white/5 rounded-3xl group hover:border-curiol-500/20 transition-all"
                                        >
                                            <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                                <img src={getDirectImageUrl(event.mediaUrl)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={event.title} />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] text-curiol-500 font-bold uppercase tracking-widest font-mono">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </span>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 text-tech-500 hover:text-white"><Settings className="w-4 h-4" /></button>
                                                        <button className="p-2 text-tech-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-serif text-white italic mb-2">{event.title}</h4>
                                                <p className="text-xs text-tech-500 font-light leading-relaxed max-w-xl">{event.description}</p>

                                                <div className="flex items-center gap-4 mt-6">
                                                    {event.location && (
                                                        <div className="flex items-center gap-1 text-[8px] text-tech-700 uppercase font-bold tracking-widest">
                                                            <MapPin className="w-3 h-3 text-curiol-500/50" /> {event.location}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 text-[8px] text-tech-700 uppercase font-bold tracking-widest">
                                                        <Tag className="w-3 h-3 text-curiol-500/50" /> {event.packageId || "Legado"}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="py-32 text-center border-2 border-dashed border-tech-900 rounded-[3rem]">
                                            <Calendar className="w-12 h-12 text-tech-800 mx-auto mb-6" />
                                            <p className="text-tech-600 text-sm italic">Comienza a poblar el futuro del pasado.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {activeTab === 'theme' && (
                            <section className="space-y-12">
                                <h2 className="text-2xl font-serif text-white italic mb-8">Escenarios Visuales</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(['classic', 'modern', 'artistic', 'cinematic'] as TimelineTheme[]).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => handleThemeChange(t)}
                                            className={cn(
                                                "p-8 rounded-[2.5rem] text-left border transition-all group overflow-hidden relative",
                                                timeline.theme === t
                                                    ? "bg-curiol-gradient border-curiol-500/50 shadow-2xl shadow-curiol-500/20"
                                                    : "bg-tech-900 border-white/5 hover:border-curiol-500/30"
                                            )}
                                        >
                                            {timeline.theme === t && (
                                                <div className="absolute top-6 right-6">
                                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                                </div>
                                            )}
                                            <Palette className={cn("w-10 h-10 mb-6 transition-transform group-hover:scale-110", timeline.theme === t ? "text-white" : "text-curiol-500")} />
                                            <h4 className={cn("text-2xl font-serif italic mb-2 capitalize", timeline.theme === t ? "text-white" : "text-white")}>{t}</h4>
                                            <p className={cn("text-xs font-light leading-relaxed", timeline.theme === t ? "text-white/80" : "text-tech-500")}>
                                                {t === 'cinematic' ? 'Transiciones fluidas con desenfoque de movimiento y grano de película.' :
                                                    t === 'artistic' ? 'Enfoque en la textura y el color, emulando una galería de arte moderno.' :
                                                        t === 'modern' ? 'Minimalismo digital con líneas limpias y tipografía de alta tecnología.' :
                                                            'El equilibrio perfecto entre elegancia atemporal y funcionalidad.'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar: Media Bridge & Asset Library */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="p-8 bg-tech-900/50 border border-white/5 rounded-[2.5rem] sticky top-32">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-curiol-500 mb-8 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Puente Multimedia (Álbumes)
                            </h3>
                            <p className="text-xs text-tech-500 mb-8 italic">Arrastra o selecciona desde las sesiones del cliente para alimentar la línea de tiempo.</p>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {albums.length > 0 ? albums.map((album) => (
                                    <div key={album.id} className="p-4 bg-tech-950/50 border border-white/5 rounded-2xl hover:border-curiol-500/20 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <h5 className="text-[10px] text-white font-bold uppercase tracking-widest truncate max-w-[150px]">{album.title}</h5>
                                            <span className="text-[8px] text-tech-700 bg-tech-800 px-2 py-0.5 rounded-full">{album.photos?.length || 0} Fotos</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {album.photos?.slice(0, 4).map((photo: any, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setNewEvent({ ...newEvent, mediaUrl: photo.url, title: album.title })}
                                                    className="aspect-square rounded-lg border border-white/5 overflow-hidden hover:scale-110 active:scale-95 transition-all"
                                                >
                                                    <img src={getDirectImageUrl(photo.url)} className="w-full h-full object-cover" alt="" />
                                                </button>
                                            ))}
                                            <button className="aspect-square rounded-lg bg-tech-800 flex items-center justify-center text-tech-600 hover:text-white transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-12 text-center text-tech-800 italic text-xs">No hay álbumes vinculados.</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Event Modal Overlay */}
            <AnimatePresence>
                {showEventModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEventModal(false)}
                            className="absolute inset-0 bg-tech-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-tech-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-curiol-gradient" />
                            <h3 className="text-3xl font-serif text-white italic mb-8">Capturar Momento</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-500 mb-3 block">Hito / Título</label>
                                        <input
                                            type="text"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                            placeholder="Ej: El primer paso de Lucía"
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-500 mb-3 block">Fecha del Evento</label>
                                        <input
                                            type="date"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-500 mb-3 block">Ubicación (Opcional)</label>
                                        <input
                                            type="text"
                                            value={newEvent.location || ""}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                            placeholder="Sta Bárbara, Guanacaste"
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-500 mb-3 block">URL de Media (Img/Vid)</label>
                                        <input
                                            type="text"
                                            value={newEvent.mediaUrl}
                                            onChange={(e) => setNewEvent({ ...newEvent, mediaUrl: e.target.value })}
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-tech-500 mb-3 block">Descripción / Narrativa</label>
                                        <textarea
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                            rows={5}
                                            placeholder="Describe la emoción y el contexto..."
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:border-curiol-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end">
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-tech-500 hover:text-white transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddEvent}
                                    disabled={isSaving}
                                    className="px-10 py-4 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:brightness-110 shadow-xl disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Asegurar Momento'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
