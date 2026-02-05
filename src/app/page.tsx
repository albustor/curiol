"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { GiftCard } from "@/components/GiftCard";
import { Camera, Binary, ArrowRight, Sparkles, Code, Users } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1472393365320-dc77242e672c?q=80&w=2070", // Naturaleza / Legado
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070", // Familia / Emoción
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070", // Negocios / Estrategia
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070"  // Cámara / Fine Art
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-tech-950">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.3, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{ backgroundImage: `url(${BACKGROUND_IMAGES[currentImage]})` }}
                className="absolute inset-0 bg-cover bg-center mix-blend-luminosity"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-tech-900 via-transparent to-tech-950" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center">
            <div className="flex justify-center items-center gap-3 mb-8 animate-fade-in">
              <span className="h-[1px] w-12 bg-curiol-500"></span>
              <span className="text-curiol-500 text-xs font-bold tracking-[0.4em] uppercase">La Evolución del Legado Visual</span>
              <span className="h-[1px] w-12 bg-curiol-500"></span>
            </div>

            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-white mb-8 leading-tight italic">
              Imágenes que <br /> <span className="text-curiol-gradient">Trascienden el Tiempo.</span>
            </h1>

            <p className="text-tech-400 text-lg md:text-xl font-light max-w-3xl mx-auto mb-12 leading-relaxed">
              Fusionamos la maestría del Fine Art con Realidad Aumentada e Inteligencia Artificial para preservar tu historia familiar y potenciar tu marca en la era digital.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/cotizar" className="px-10 py-5 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all transform hover:-translate-y-1 shadow-2xl">
                Personalizar mi Propuesta
              </Link>
              <Link href="/servicios" className="px-10 py-5 border border-tech-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-tech-800 transition-all">
                Explorar Ecosistema
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-[1px] h-16 bg-gradient-to-b from-curiol-500 to-transparent" />
          </div>
        </section>

        {/* Hybrid Grid Section */}
        <section className="py-32 px-4 md:px-8 lg:px-16 bg-tech-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 italic">Arquitectura de <span className="text-curiol-500">Presencia.</span></h2>
                <p className="text-tech-400 font-light leading-relaxed">Fusionamos la calidez del legado familiar con la precisión de la infraestructura digital moderna. Dos mundos, un mismo propósito: trascender.</p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-4 text-curiol-500 text-[10px] uppercase font-bold tracking-widest">
                  <span>Selecciona una categoría</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Family & Legacy */}
              <GlassCard className="relative group overflow-hidden border-curiol-500/10">
                <div className="absolute top-0 right-0 p-8 text-curiol-500 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Users className="w-12 h-12" />
                </div>
                <span className="text-curiol-500 text-[10px] font-bold tracking-widest uppercase mb-4 block">B2C • Familias & Eventos</span>
                <h3 className="text-3xl font-serif text-white mb-6 italic">Legado Ancestral e Interactivo</h3>
                <p className="text-tech-400 font-light mb-8 leading-relaxed">Creamos álbumes físicos que cobran vida con Realidad Aumentada. Sesiones Fine Art para familias que desean que sus recuerdos nunca desaparezcan.</p>
                <div className="space-y-4 mb-8">
                  {['Aventura Mágica (Fantasía)', 'Esencia Familiar (AR)', 'Eventos de Gala (Bodas)'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-tech-300">
                      <Sparkles className="w-3 h-3 text-curiol-500" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/servicios#familia" className="inline-flex items-center gap-2 text-curiol-500 text-xs font-bold uppercase tracking-widest hover:underline">
                  Ver Experiencias <ArrowRight className="w-4 h-4" />
                </Link>
              </GlassCard>

              {/* Right: Business & Tech */}
              <GlassCard className="relative group overflow-hidden border-tech-500/10">
                <div className="absolute top-0 right-0 p-8 text-tech-500 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Code className="w-12 h-12" />
                </div>
                <span className="text-tech-500 text-[10px] font-bold tracking-widest uppercase mb-4 block">B2B • Negocios & Marca</span>
                <h3 className="text-3xl font-serif text-white mb-6 italic">Infraestructura Digital Ágil</h3>
                <p className="text-tech-400 font-light mb-8 leading-relaxed">No solo fotos, sino el sistema para venderlas. Landing pages de alta conversión y marca personal inteligente para el comercio local de Guanacaste.</p>
                <div className="space-y-4 mb-8">
                  {['Marca Personal Inteligente', 'Impulso Emprendedor (Web)', 'Contenido Vertical Automático'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-tech-300">
                      <Binary className="w-3 h-3 text-tech-500" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/soluciones-web" className="inline-flex items-center gap-2 text-tech-500 text-xs font-bold uppercase tracking-widest hover:underline">
                  Acelerar mi Negocio <ArrowRight className="w-4 h-4" />
                </Link>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Gift Card Highlight */}
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-tech-950">
          <div className="max-w-7xl mx-auto">
            <GiftCard />
          </div>
        </section>

        {/* AI Assistant Hook */}
        <section className="py-32 px-4 md:px-8 lg:px-16 bg-tech-900 border-t border-tech-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex p-3 bg-curiol-500/10 rounded-full text-curiol-500 mb-8">
              <Binary className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-10 italic">¿Dudas sobre tu próximo paso?</h2>
            <p className="text-tech-400 text-xl font-light mb-12 leading-relaxed">
              Nuestro asistente inteligente está entrenado para recomendarte la mejor experiencia basada en tus objetivos: ya sea inmortalizar un momento o dominar el mercado digital.
            </p>
            <button className="px-12 py-6 bg-tech-950 border border-tech-700 text-curiol-500 text-xs font-bold uppercase tracking-widest hover:bg-tech-800 hover:border-curiol-500 transition-all rounded-full flex items-center gap-4 mx-auto">
              Hablar con Curiol IA <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <AiAssistant />
    </div>
  );
}
