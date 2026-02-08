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
import { AgendaWidget } from "@/components/AgendaWidget";

import { getHeroImages, getPortfolioData, PortfolioItem } from "@/actions/portfolio";

const DEFAULT_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1472393365320-dc77242e672c?q=80&w=2070",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070"
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>(DEFAULT_BACKGROUNDS);
  const [portfolioTeaser, setPortfolioTeaser] = useState<PortfolioItem[]>([]);

  const heroTexts = [
    { main: "Memorias que", highlight: "cobran vida." },
    { main: "Crecimiento comercial con", highlight: "nuestros servicios en tecnología" }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [hImages, pData] = await Promise.all([
          getHeroImages(),
          getPortfolioData()
        ]);

        if (hImages && hImages.length > 0) setHeroImages(hImages);
        if (pData) setPortfolioTeaser(pData.slice(0, 4)); // Show first 4 items as teaser
      } catch (error) {
        console.error("Home data load error:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    const textTimer = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 15000);
    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, [heroImages.length, heroTexts.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen pt-32 md:pt-40 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-tech-950 bg-grain">
            <AnimatePresence>
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                style={{
                  backgroundImage: `url(${heroImages[currentImage]})`,
                  backgroundPosition: "center center"
                }}
                className="absolute inset-0 bg-cover img-premium image-overlay"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-tech-900 via-transparent to-tech-950" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center">
            <div className="flex justify-center items-center gap-3 mb-8 animate-fade-in">
              <span className="h-[1px] w-12 bg-curiol-500"></span>
              <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Fotografía • Tecnología • Legado</span>
              <span className="h-[1px] w-12 bg-curiol-500"></span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white mb-8 leading-[0.9] italic min-h-[2.5em] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                >
                  {heroTexts[currentText].main} <br />
                  <span className="text-curiol-gradient">{heroTexts[currentText].highlight}</span>
                </motion.div>
              </AnimatePresence>
            </h1>

            <p className="text-tech-400 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Donde la raíz guanacasteca se encuentra con la tecnología del futuro. Fusionamos la sensibilidad artística con la ingeniería digital avanzada para construir un ecosistema de legado que perdura y escala.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <Link href="/cotizar" className="px-10 py-5 bg-curiol-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all transform hover:-translate-y-1 shadow-2xl">
                Personalizar mi Legado
              </Link>
              <Link href="/soluciones-web" className="px-10 py-5 border border-tech-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-tech-800 transition-all">
                Aceleradora Digital
              </Link>
            </div>

            <p className="text-white/80 text-sm italic font-light leading-relaxed max-w-3xl mx-auto animate-fade-in delay-500 mt-8 border-t border-white/10 pt-8">
              "No vendemos solo código ni solo fotos; vendemos Presencia y Legado." <br />
              <span className="block mt-4 text-tech-400 not-italic">
                Emanado del corazón de Guaitil, el curiol es el alma mineral que ha dado color a nuestra historia Chorotega,
                es la materia prima con que pintan las vasijas de barro. Hoy, esa esencia trasciende fronteras,
                transformando la tierra en arte eterno con visión global.
              </span>
            </p>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-[1px] h-16 bg-gradient-to-b from-curiol-500 to-transparent" />
          </div>
        </section>

        {/* Hybrid Grid Section */}
        <section className="py-32 px-4 md:px-8 lg:px-16 bg-tech-900 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-subtle.svg')] opacity-5" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[1px] w-8 bg-curiol-500"></span>
                  <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">El Triángulo Mágico Expandido</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 italic">Arquitectura & <span className="text-curiol-500">Aceleración.</span></h2>
                <p className="text-tech-400 font-light leading-relaxed">Operamos bajo eficiencia tecnológica y rentabilidad circular. Nuestras soluciones están diseñadas para maximizar el impacto inmediato y la sostenibilidad a largo plazo.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Family (B2C) */}
              <GlassCard className="group border-curiol-500/10 hover:border-curiol-500/30 transition-all">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-curiol-500/10 flex items-center justify-center text-curiol-500 group-hover:bg-curiol-500 group-hover:text-white transition-all">
                    <Users className="w-8 h-8" />
                  </div>
                  <span className="text-curiol-500 text-[10px] font-bold tracking-widest uppercase py-2 px-4 bg-curiol-500/5 rounded-full">Legado Familiar</span>
                </div>
                <h3 className="text-3xl font-serif text-white mb-6 italic">Memorias Vivas</h3>
                <p className="text-tech-400 font-light mb-10 leading-relaxed italic">"Tus recuerdos convertidosen activos físicos con alma tecnológica."</p>
                <p className="text-tech-300 text-sm font-light mb-10 leading-relaxed">
                  Digitalización avanzada y preservación de historias. Creamos activos Phygital (Físicos-Digitales) mediante Realidad Aumentada para asegurar que tu historia perdure con vida propia.
                </p>
                <div className="space-y-4 mb-12">
                  {[
                    "Visuales de Autor (Fine Art + IA)",
                    "Realidad Aumentada & Música Personalizada",
                    "Cápsulas de Tiempo Digitales Interactivas",
                    "Membresía Legado (Tu Biógrafo Privado)"
                  ].map(item => (
                    <div key={item} className="flex items-center gap-4 text-xs text-tech-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-curiol-500" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/cotizar" className="flex items-center justify-between p-6 bg-tech-800/50 rounded-2xl hover:bg-curiol-500 group/btn transition-all">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Explorar Legado</span>
                  <ArrowRight className="w-4 h-4 text-curiol-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                </Link>
              </GlassCard>

              {/* Right: Business (B2B) */}
              <GlassCard className="group border-tech-500/10 hover:border-tech-500/30 transition-all">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-tech-500/10 flex items-center justify-center text-tech-500 group-hover:bg-tech-500 group-hover:text-white transition-all">
                    <Code className="w-8 h-8" />
                  </div>
                  <span className="text-tech-500 text-[10px] font-bold tracking-widest uppercase py-2 px-4 bg-tech-500/5 rounded-full">Motor de Crecimiento</span>
                </div>
                <h3 className="text-3xl font-serif text-white mb-6 italic">Aceleradora Soluciones Comerciales</h3>
                <p className="text-tech-400 font-light mb-10 leading-relaxed italic">"Atraemos miradas, cerramos ventas. Presencia 24/7."</p>
                <p className="text-tech-300 text-sm font-light mb-10 leading-relaxed">
                  Infraestructura inteligente diseñada para que el comercio local destaque. Landing pages de alta conversión, asistentes digitales personalizados y optimización asistida por IA para un impacto real en tus ventas.
                </p>
                <div className="space-y-4 mb-12">
                  {[
                    "Web-Apps Progresivas (PWA)",
                    "Metodologías No-Code/IA Eficientes",
                    "Módulos de IA para Contexto PYME",
                    "Mantenimiento Evolutivo Trimestral"
                  ].map(item => (
                    <div key={item} className="flex items-center gap-4 text-xs text-tech-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-tech-500" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/soluciones-web" className="flex items-center justify-between p-6 bg-tech-800/50 rounded-2xl hover:bg-tech-500 group/btn transition-all">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Acelerar Negocio</span>
                  <ArrowRight className="w-4 h-4 text-tech-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                </Link>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Portfolio Teaser Section */}
        <section className="py-32 px-4 md:px-8 lg:px-16 bg-tech-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[1px] w-8 bg-curiol-500"></span>
                  <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Galería Curada</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 italic">Portafolio <span className="text-curiol-gradient">Visual.</span></h2>
              </div>
              <Link href="/portafolio" className="text-curiol-500 text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2 mb-2">
                Ver Galería Completa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {portfolioTeaser.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer"
                >
                  <img
                    src={item.url}
                    alt={item.titulo}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tech-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <p className="text-[8px] text-curiol-500 uppercase font-bold tracking-widest mb-1">{item.categoria}</p>
                    <p className="text-white font-serif italic text-sm">{item.titulo}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Digitalización Humana Section (Legacy & Future) */}
        <section className="bg-tech-950 py-32 border-b border-tech-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-curiol-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-[1px] w-8 bg-curiol-500"></span>
                  <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Patrimonio Vivo</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 italic">El Legado de la <br /> <span className="text-curiol-gradient">Zona Azul.</span></h2>
                <p className="text-tech-400 text-lg font-light leading-relaxed mb-10">
                  Homenaje a los "personajes azules" de Nicoya —una de las zonas más longevas del mundo. Transformamos historias de vida en activos interactivos que las próximas generaciones podrán consultar y sentir. Un tributo gratuito a nuestra comunidad.
                </p>
                <Link href="/comunidad#legado-azul" className="inline-flex items-center gap-4 px-10 py-5 border border-curiol-500/30 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-full group">
                  Explorar Archivo Vivo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-curiol-gradient flex items-center justify-center shadow-2xl group animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-8 lg:px-16 bg-tech-950">
          <div className="max-w-7xl mx-auto">
            <GiftCard />
          </div>
        </section>

        {/* AI Assistant Hook */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-12 text-center mb-16">
            <div className="inline-flex p-3 bg-curiol-500/10 rounded-full text-curiol-500 mb-8">
              <Binary className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-10 italic text-curiol-gradient">¿Cuál es tu próximo legado?</h2>
            <p className="text-tech-400 text-xl font-light mb-12 leading-relaxed max-w-2xl mx-auto">
              Nuestro asistente inteligente te guía para elegir la mejor ruta: ya sea inmortalizar tu historia familiar o construir la base tecnológica de tu negocio.
            </p>
            <button className="px-12 py-6 bg-tech-100 text-tech-950 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all rounded-full flex items-center gap-4 mx-auto shadow-2xl shadow-curiol-500/10">
              Conversar con Curiol IA <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Agenda Integration */}
          <div className="lg:col-start-4 lg:col-span-6 mt-12">
            <AgendaWidget />
          </div>
        </div>
      </main>

      <Footer />
      <AiAssistant />
    </div>
  );
}
