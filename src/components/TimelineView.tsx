"use client";

import { motion } from "framer-motion";
import { TimelineEvent, EvolutiveTimeline, TimelineTheme } from "@/types/timeline";
import { Calendar, MapPin, Camera, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
    timeline: EvolutiveTimeline;
}

export function TimelineView({ timeline }: TimelineViewProps) {
    const { events, theme } = timeline;

    const themeStyles = {
        classic: "bg-tech-950 text-white",
        modern: "bg-white text-tech-900",
        artistic: "bg-gradient-to-br from-curiol-900 via-tech-950 to-tech-900 text-white",
        cinematic: "bg-black text-white"
    };

    return (
        <div className={cn("min-h-screen py-20 px-4 md:px-8 lg:px-16 overflow-hidden", themeStyles[theme])}>
            <div className="max-w-4xl mx-auto relative">
                {/* Central Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-curiol-500 via-tech-500 to-transparent transform -translate-x-1/2 opacity-30" />

                <div className="mb-20 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-3 bg-curiol-500/10 rounded-full mb-6"
                    >
                        <Sparkles className="w-8 h-8 text-curiol-500" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-serif italic mb-4">Línea de Tiempo de {timeline.clientName}</h1>
                    <p className="text-tech-400 font-light max-w-xl mx-auto">Custodiando la evolución de un legado que trasciende el tiempo.</p>
                </div>

                <div className="space-y-24 relative z-10">
                    {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event, idx) => (
                        <TimelineItem key={event.id} event={event} index={idx} theme={theme} />
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-40 border-2 border-dashed border-tech-800 rounded-[3rem]">
                        <Camera className="w-12 h-12 text-tech-700 mx-auto mb-6 animate-pulse" />
                        <h3 className="text-xl font-serif italic text-tech-500">Iniciando Archivo Vivo...</h3>
                        <p className="text-tech-600 text-sm">Pronto verás aquí la evolución de tu legado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TimelineItem({ event, index, theme }: { event: TimelineEvent; index: number; theme: TimelineTheme }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={cn(
                "flex flex-col md:flex-row items-center gap-8 md:gap-16",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
            )}
        >
            {/* Content Card */}
            <div className="w-full md:w-1/2">
                <div className={cn(
                    "p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl relative group transition-all duration-500 hover:border-curiol-500/30",
                    theme === 'modern' ? "bg-tech-50/50" : "bg-tech-900/50"
                )}>
                    {/* Glowing background on hover */}
                    <div className="absolute inset-0 bg-curiol-500/0 group-hover:bg-curiol-500/5 rounded-[2.5rem] transition-colors" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="w-4 h-4 text-curiol-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-tech-400">
                                {new Date(event.date).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-serif italic mb-4 group-hover:text-curiol-200 transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-tech-400 font-light leading-relaxed mb-6 text-sm md:text-base">
                            {event.description}
                        </p>

                        {event.location && (
                            <div className="flex items-center gap-2 text-tech-500 text-[10px] font-bold uppercase tracking-widest">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Central Node Indicator */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-tech-950 border-2 border-curiol-500 items-center justify-center z-20 shadow-[0_0_20px_rgba(180,95,50,0.3)]">
                <div className="w-3 h-3 rounded-full bg-curiol-500 animate-pulse" />
            </div>

            {/* Media Display */}
            <div className="w-full md:w-1/2">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                    <img
                        src={event.mediaUrl}
                        alt={event.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                    {event.mediaType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-curiol-500 group-hover:border-curiol-500 transition-all">
                                <Play className="w-6 h-6 text-white fill-current" />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
