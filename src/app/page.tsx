"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { GiftCard } from "@/components/GiftCard";
import { Camera, Binary, ArrowRight, Sparkles, Code, Users, ArrowUpRight, Filter, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AgendaWidget } from "@/components/AgendaWidget";

import { getPortfolioAllPhotos, getAlbums } from "@/actions/portfolio";
import { getDirectImageUrl, cn } from "@/lib/utils";
import { PerspectiveCard } from "@/components/ui/PerspectiveCard";
import ComingSoon from "./coming-soon/page";

// ==========================================
// MAINTENANCE MODE TOGGLE
// Set to true to hide the site from the public
// ==========================================
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'; // Linked to ENV or false by default

const POETIC_PHRASES = [
  "Legado familiar",
  "La imaginación de tu hijo tangible",
  "Los años pasan las fotografías quedan",
  "En 60 años su fotografía va a ser un obsequio para su familia"
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [heroImages, setHeroImages] = useState<{ url: string; title: string; category: string }[]>([]);
  const [portfolioTeaser, setPortfolioTeaser] = useState<any[]>([]);

  const [activeCategory, setActiveCategory] = useState<"family" | "business">("family");

  useEffect(() => {
    async function loadData() {
      try {
        const [pPhotos, albums] = await Promise.all([
          getPortfolioAllPhotos(),
          getAlbums()
        ]);

        if (pPhotos && pPhotos.length > 0) {
          setHeroImages(pPhotos);
          // Initial phrase setup
          const photo = pPhotos[0];
          const isProfessional = photo.title.toLowerCase().includes("perfil") || photo.category.toLowerCase().includes("perfil");
          setCurrentPhrase(isProfessional ? "Su presencia de marca comercial" : POETIC_PHRASES[0]);
        }
        if (albums) setPortfolioTeaser(albums.slice(0, 8));
      } catch (error) {
        console.error("Home data load error:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;

    const updateHero = () => {
      const nextIdx = Math.floor(Math.random() * heroImages.length);
      setCurrentImage(nextIdx);

      const photo = heroImages[nextIdx];
      const isProfessional = photo.title.toLowerCase().includes("perfil") || photo.category.toLowerCase().includes("perfil");

      if (isProfessional) {
        setCurrentPhrase("Su presencia de marca comercial");
      } else {
        const randomPhrase = POETIC_PHRASES[Math.floor(Math.random() * POETIC_PHRASES.length)];
        setCurrentPhrase(randomPhrase);
      }
    };

    const timer = setInterval(updateHero, 7000);
    return () => clearInterval(timer);
  }, [heroImages]);

  // Render maintenance page if mode is active
  if (MAINTENANCE_MODE) {
    return <ComingSoon />;
  }

  return (
    <div className="flex flex-col min-h-screen uppercase-titles">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-end justify-end overflow-hidden">
          <div className="absolute inset-0 bg-tech-950">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.1, x: 10 }}
                animate={{
                  opacity: 0.8,
                  scale: 1,
                  x: 0,
                  transition: {
                    opacity: { duration: 2.5, ease: "linear" },
                    scale: { duration: 15, ease: "easeOut" },
                    x: { duration: 15, ease: "easeOut" }
                  }
                }}
                exit={{ opacity: 0, transition: { duration: 2 } }}
                style={{
                  backgroundImage: `url(${getDirectImageUrl(heroImages[currentImage]?.url || "", true)})`,
                  backgroundPosition: "center 20%"
                }}
                className="absolute inset-0 bg-cover img-premium"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-tech-950/90 via-transparent to-tech-950/40" />
            <div className="absolute inset-0 bg-tech-950/10 backdrop-blur-[1px]" />
          </div>

          {/* Hero Content - Bottom Right */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full pb-20 md:pb-32">
            <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-3 mb-6 animate-fade-in justify-end">
                <span className="h-[1px] w-8 bg-curiol-500/50"></span>
                <span className="text-curiol-500 text-[9px] font-bold tracking-[0.4em] uppercase">Evolución Visual 2026</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-8 leading-tight italic max-w-2xl bg-gradient-to-r from-white via-white to-tech-400 bg-clip-text text-transparent">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhrase}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    {currentPhrase}
                  </motion.div>
                </AnimatePresence>
              </h1>

              <div className="flex flex-wrap justify-end gap-4 mb-10">
                <Link href="/cotizar" className="px-8 py-4 bg-curiol-700/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all transform hover:-translate-y-1 shadow-2xl border border-white/5 rounded-sm">
                  Personalizar Legado
                </Link>
                <Link href="/servicios" className="px-8 py-4 border border-white/10 bg-white/5 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest hover:bg-tech-800 transition-all rounded-sm">
                  Explorar Ecosistema
                </Link>
              </div>

              <div className="flex flex-col items-end gap-2 opacity-60">
                <p className="text-white text-[9px] font-bold uppercase tracking-[0.3em] italic">
                  Santa Bárbara de Santa Cruz, Guanacaste
                </p>
                <div className="h-[1px] w-12 bg-curiol-500/50"></div>
              </div>
            </div>
          </div>

          {/* Floating indicator */}
          <div className="absolute bottom-10 left-10 md:left-16 animate-pulse opacity-20">
            <div className="w-[1px] h-12 bg-gradient-to-b from-curiol-500 to-transparent" />
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* Portfolio Teaser Section */}
        <section className="py-24 bg-tech-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(180,95,50,0.05),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[1px] w-8 bg-curiol-500"></span>
                  <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Visualización de Activos</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white italic leading-tight">Últimas <br /><span className="text-curiol-gradient">Producciones.</span></h2>
              </div>
              <Link href="/portafolio" className="px-8 py-3 border border-white/10 text-tech-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group rounded-full">
                Ver Todo el Portafolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioTeaser.length > 0 ? portfolioTeaser
                .sort((a, b) => {
                  const aTitle = (a.title || a.titulo || "").toLowerCase();
                  const bTitle = (b.title || b.titulo || "").toLowerCase();
                  const priorityKeywords = ["embarazo", "maternidad", "navidad"];
                  const aIsPriority = priorityKeywords.some(kw => aTitle.includes(kw));
                  const bIsPriority = priorityKeywords.some(kw => bTitle.includes(kw));
                  if (aIsPriority && !bIsPriority) return -1;
                  if (!aIsPriority && bIsPriority) return 1;
                  return 0;
                })
                .map((item, idx) => (
                  <Link key={idx} href={`/portafolio/${item.slug || item.id}`}>
                    <PerspectiveCard index={idx} className="aspect-[3/4]">
                      <img
                        src={getDirectImageUrl(item.url || (item.photos && item.photos.length > 0 ? item.photos[0].url : ""))}
                        alt={item.title || item.titulo}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-tech-950/20 to-transparent p-8 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-curiol-500 bg-curiol-500/10 px-3 py-1 rounded-full border border-curiol-500/10">
                            PRODUCCIÓN
                          </span>
                        </div>
                        <h3 className="text-xl font-serif text-white italic group-hover:text-curiol-200 transition-colors capitalize">
                          {(item.title || item.titulo || "").replace(/_/g, " ")}
                        </h3>
                      </div>
                    </PerspectiveCard>
                  </Link>
                )) : (
                <div className="col-span-full py-24 text-center border-2 border-dashed border-tech-800 rounded-[3rem] bg-tech-900/50">
                  <div className="w-16 h-16 bg-tech-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-8 h-8 text-tech-600 animate-pulse" />
                  </div>
                  <h3 className="text-white font-serif italic text-lg mb-2">Sincronizando Archivos...</h3>
                  <p className="text-tech-500 text-sm font-light">Conectando con el núcleo de datos del 2026.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Hybrid Grid Section */}
        <section className="py-32 px-4 md:px-8 lg:px-16 bg-tech-950 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-subtle.svg')] opacity-5" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center mb-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-[1px] w-8 bg-curiol-500"></span>
                <span className="text-curiol-500 text-[10px] font-bold tracking-[0.4em] uppercase">Ecosistema Curiol OS</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-12 italic text-center">Uniendo dos mundos: <br /><span className="text-curiol-gradient">Arte & Tecnología</span></h2>

              {/* TABS SELECTOR */}
              <div className="flex p-1.5 bg-tech-900/80 backdrop-blur-2xl border border-white/10 rounded-full mb-16 relative overflow-hidden shadow-2xl shadow-black/50">
                <button
                  onClick={() => setActiveCategory("family")}
                  className={cn(
                    "relative px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all z-10",
                    activeCategory === "family" ? "text-white" : "text-tech-500 hover:text-tech-300"
                  )}
                >
                  Legado Familiar
                </button>
                <button
                  onClick={() => setActiveCategory("business")}
                  className={cn(
                    "relative px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all z-10",
                    activeCategory === "business" ? "text-white" : "text-tech-500 hover:text-tech-300"
                  )}
                >
                  Crecimiento Comercial
                </button>
                {/* Selector Slide Background */}
                <motion.div
                  className="absolute inset-y-1.5 bg-curiol-gradient rounded-full shadow-lg"
                  initial={false}
                  animate={{
                    left: activeCategory === "family" ? "6px" : "calc(50% + 2px)",
                    width: "calc(50% - 8px)"
                  }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                {activeCategory === "family" ? (
                  <motion.div
                    key="family"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <PerspectiveCard className="group border-curiol-500/20 hover:border-curiol-500/40 transition-all rounded-[3rem] bg-tech-900/40 backdrop-blur-2xl p-12 md:p-20 border border-white/5 min-h-[500px] flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-16">
                        <div className="w-24 h-24 rounded-3xl bg-curiol-500/10 flex items-center justify-center text-curiol-500 group-hover:bg-curiol-500 group-hover:text-white transition-all shadow-2xl shadow-curiol-500/10">
                          <Users className="w-12 h-12" />
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-6xl font-serif text-white mb-10 italic">Legado Familiar <span className="text-curiol-500">Phygital</span></h3>
                      <p className="text-tech-300 font-light mb-16 leading-relaxed italic text-lg md:text-2xl max-w-4xl">
                        "Tu historia merece más que un marco; merece existencia propia. El nuevo concepto de Retrato Fine Art fusiona la sensibilidad artesanal con la infraestructura digital (Phygital) para que tu legado respire por siempre. Capturamos el alma para custodiarla con algoritmos; tu legado no solo es eterno, es dinámico y accesible en cada paso de tu evolution."
                      </p>

                      <div className="flex flex-wrap gap-6 mt-auto">
                        <Link href="/servicios" className="inline-flex items-center gap-4 px-12 py-6 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all rounded-full shadow-2xl shadow-curiol-500/20">
                          Explorar Legado <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/cotizar" className="inline-flex items-center gap-4 px-12 py-6 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all rounded-full">
                          Cotizar Sesión
                        </Link>
                      </div>
                    </PerspectiveCard>
                  </motion.div>
                ) : (
                  <motion.div
                    key="business"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <PerspectiveCard className="group border-tech-500/20 hover:border-tech-500/40 transition-all rounded-[3rem] bg-tech-900/40 backdrop-blur-2xl p-12 md:p-20 border border-white/5 min-h-[500px] flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-16">
                        <div className="w-24 h-24 rounded-3xl bg-tech-500/10 flex items-center justify-center text-tech-500 group-hover:bg-tech-500 group-hover:text-white transition-all shadow-2xl shadow-tech-500/10">
                          <Code className="w-12 h-12" />
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-6xl font-serif text-white mb-10 italic">Crecimiento Comercial <span className="text-tech-500">& IA</span></h3>
                      <p className="text-tech-300 font-light mb-16 leading-relaxed italic text-lg md:text-2xl max-w-4xl">
                        "La ingeniería web reimaginada desde la lente de un artista. No solo construimos infraestructuras; diseñamos portales que capturan la esencia de tu negocio con la misma profundidad de un Retrato Fine Art. Web-Apps impulsadas por IA que no solo digitalizan tu negocio, sino que fidelizan a tus clientes mediante experiencias estéticas inmersivas que se traducen en resultados reales y permanentes."
                      </p>

                      <div className="flex flex-wrap gap-6 mt-auto">
                        <Link href="/soluciones-web" className="inline-flex items-center gap-4 px-12 py-6 bg-tech-500 text-white text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all rounded-full shadow-2xl shadow-tech-500/20">
                          Acelerar Negocio <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
                          className="inline-flex items-center gap-4 px-12 py-6 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all rounded-full"
                        >
                          Consultar con IA
                        </button>
                      </div>
                    </PerspectiveCard>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  En el corazón de Guanacaste los héroes no solo cumplen años, cumplen propósitos. Homenajeamos desde el niño que inspira hasta el abuelo que custodia la tierra. Transformamos sus historias en activos Phygital interactivos, permitiendo que las próximas generaciones no solo lean sobre sus raíces, sino que las sientan y consulten en tiempo real. Estamos capturando el presente para diseñar el pasado del futuro. Postule a ese personaje que hace de Guanacaste un lugar eterno y ayúdenos a tejer una memoria comunitaria que respire a través de la tecnología.
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

        {/* AI Assistant Hook & Agenda */}
        <section className="py-32 px-4 md:px-8 lg:px-16 bg-tech-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-12 text-center mb-16">
                <div className="inline-flex p-3 bg-curiol-500/10 rounded-full text-curiol-500 mb-8">
                  <Binary className="w-6 h-6" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-10 italic text-curiol-gradient">¿Cuál es tu próximo legado?</h2>
                <p className="text-tech-400 text-xl font-light mb-12 leading-relaxed max-w-2xl mx-auto">
                  Nuestro asistente inteligente te guía para elegir la mejor ruta: ya sea inmortalizar tu historia familiar o construir la base tecnológica de tu negocio.
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
                  className="px-12 py-6 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all rounded-full flex items-center gap-4 mx-auto shadow-2xl shadow-curiol-500/20"
                >
                  Conversar con Curiol IA <Sparkles className="w-4 h-4" />
                </button>
              </div>

              {/* Agenda Integration */}
              <div className="lg:col-start-4 lg:col-span-6 mt-12">
                <AgendaWidget />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AiAssistant />
    </div>
  );
}
