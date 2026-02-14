"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    FileText, Download, Briefcase, Heart,
    ArrowRight, CheckCircle2, User,
    Sparkles, Trash2, Plus,
    ShieldCheck, Clock, FileCheck, X, Camera, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { CommandK } from "@/components/admin/CommandK";

interface Package {
    id: string;
    name: string;
    price: number;
    usd: number;
    desc: string;
}

const EXTRAS = {
    legado: [
        { id: "nfc", name: "Puente Físico (NFC + RA)", price: 20000, usd: 40, desc: "Tarjeta premium con Realidad Aumentada integrada." },
        { id: "cuadro", name: "Cuadro Vivo Extra (AR)", price: 45000, usd: 95, desc: "Canvas 16x20\" con Realidad Aumentada." },
        { id: "sesion_extra", name: "Sesión Adicional / Hora Extra", price: 35000, usd: 75, desc: "Más tiempo de cobertura para tu historia." },
        { id: "retoque_extra", name: "Retoque Fine Art (Por Foto)", price: 5000, usd: 10, desc: "Post-producción avanzada individual." }
    ],
    infra: [
        { id: "nfc_business", name: "Puente Físico (Tarjeta IA NFC)", price: 20000, usd: 40, desc: "Tarjeta de contacto inteligente para networking." },
        { id: "seo", name: "Optimización SEO / IA Search", price: 25000, usd: 55, desc: "Visibilidad local y textos optimizados por IA." },
        { id: "mantenimiento", name: "Omni Sincro (Mantenimiento)", price: 15000, usd: 35, desc: "Soporte completo, hosting y actualizaciones." },
        { id: "pagos", name: "Integración de Pagos", price: 45000, usd: 95, desc: "Configuración de pasarelas (SINPE/Tarjetas)." }
    ],
    sociales: [
        { id: "cobertura_hora", name: "Hora de Cobertura Extra", price: 45000, usd: 85, desc: "Tiempo adicional de captura para eventos sociales." },
        { id: "edicion_premium", name: "Edición Premium / Retoque", price: 15000, usd: 30, desc: "Post-producción avanzada para momentos clave." }
    ],
    deportes: [
        { id: "sesion_accion", name: "Sesión de Acción (Hora)", price: 35000, usd: 65, desc: "Cobertura de alto impacto para deportistas." },
        { id: "entrega_express", name: "Entrega Express (24h)", price: 20000, usd: 40, desc: "Prioridad en edición para redes sociales." }
    ]
};

const PACKAGES = {
    legado: [
        {
            id: "aventura",
            name: "Aventura Mágica",
            price: 112700,
            usd: 225,
            desc: "Patrimonio visual para la posteridad. Transformamos la imaginación infantil en realidades phygital eternas."
        },
        {
            id: "recuerdos",
            name: "Recuerdos Eternos",
            price: 132250,
            usd: 265,
            desc: "Conexión intergeneracional Fine Art. Un tributo que fusiona la calidez artesanal con la magia de la RA."
        },
        {
            id: "legado",
            name: "Membresía Semestral",
            price: 59490,
            usd: 119,
            desc: "Tu patrimonio emocional protegido. Pago mensual para documentar tu evolución anual con 3 sesiones programadas."
        },
        {
            id: "relatos",
            name: "Relatos",
            price: 56000,
            usd: 112,
            desc: "6 Fotos Fine-Art + Retablo 5x7\" (13x18 cm). Encuentros de alta intensidad artística en formato ágil."
        }
    ],
    infra: [
        {
            id: "omni_local",
            name: "Omni Local (+5 Retratos)",
            price: 280000,
            usd: 550,
            desc: "Landing Page + Cotizador Básico + NFC + 5 Retratos Profesionales."
        },
        {
            id: "omni_pro",
            name: "Omni Pro (+5 Retratos)",
            price: 780000,
            usd: 1550,
            desc: "Web-App Pro + Agenda + IA Gemini + 5 Retratos Profesionales."
        },
        {
            id: "omni_ultra",
            name: "Omni Ultra (+5 Retratos)",
            price: 1530000,
            usd: 3050,
            desc: "Curiol OS + AI Analytics + WhatsApp + 5 Retratos Profesionales."
        }
    ],
    sociales: [
        { id: "boda", name: "Memorias en Vivo (Gala)", price: 45000, usd: 85, desc: "Cobertura narrativa por hora. Post-producción de autor y galería interactiva." },
        { id: "grad", name: "Evento Institucional", price: 45000, usd: 85, desc: "Documentación estratégica para hitos académicos o corporativos." },
        { id: "cumple", name: "Celebración Social", price: 45000, usd: 85, desc: "Captura de la energía y momentos espontáneos." }
    ],
    deportes: [
        { id: "surf", name: "Acción Surf/Agua", price: 35000, usd: 65, desc: "Fotografía de adrenalina. Optimizado para impacto en redes." },
        { id: "golf", name: "Acción Técnica (Golf)", price: 35000, usd: 65, desc: "Cobertura de técnica y ambiente en campo." }
    ]
};

export default function AdminCotizadorPage() {
    const { role, isMaster } = useRole();
    const router = useRouter();
    const [tab, setTab] = useState<"legado" | "infra" | "sociales" | "deportes">("legado");
    const [clientName, setClientName] = useState("");
    const [currency, setCurrency] = useState<"CRC" | "USD">("CRC");
    const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
    const [selectedExtras, setSelectedExtras] = useState<Package[]>([]);
    const [photoCount, setPhotoCount] = useState<string>("15");
    const [isUnlimitedPhotos, setIsUnlimitedPhotos] = useState(false);
    const [proposalDescription, setProposalDescription] = useState("");
    const [internalNotes, setInternalNotes] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [quoteId, setQuoteId] = useState("");
    const [useCashDiscount, setUseCashDiscount] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (role === "UNAUTHORIZED") {
            router.push("/admin/login");
        } else if (role !== "LOADING" && !isMaster) {
            router.push("/admin/dashboard");
        }
    }, [role, isMaster, router]);

    useEffect(() => {
        setQuoteId(`Q-${Math.floor(Math.random() * 9000) + 1000}`);
    }, []);

    if (role === "LOADING") return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    const togglePackage = (pkg: Package) => {
        if (selectedPackages.find(p => p.id === pkg.id)) {
            setSelectedPackages(selectedPackages.filter(p => p.id !== pkg.id));
        } else {
            setSelectedPackages([...selectedPackages, pkg]);
        }
    };

    const toggleExtra = (pkg: Package) => {
        if (selectedExtras.find(p => p.id === pkg.id)) {
            setSelectedExtras(selectedExtras.filter(p => p.id !== pkg.id));
        } else {
            setSelectedExtras([...selectedExtras, pkg]);
        }
    };

    const packagesTotal = selectedPackages.reduce((acc, pkg) => acc + (currency === "CRC" ? pkg.price : pkg.usd), 0);
    const extrasTotal = selectedExtras.reduce((acc, pkg) => acc + (currency === "CRC" ? pkg.price : pkg.usd), 0);
    const baseTotal = packagesTotal + extrasTotal;

    // Estrategia 2026: El precio base incluye financiamiento.
    // Si es pago de contado, se aplica el -15%.
    const total = useCashDiscount ? Math.round(baseTotal * 0.85) : baseTotal;
    const advancePayment = total * 0.20;

    const exportPDF = async () => {
        if (!pdfRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });
            const imgData = canvas.toDataURL("image/png");

            const imgProps = { height: canvas.height, width: canvas.width };
            const pdfWidth = 210; // A4 Width in mm
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            const pdf = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: [pdfWidth, pdfHeight]
            });

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Cotizacion_Curiol_${clientName.replace(/\s+/g, "_")}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Error al generar el PDF");
        }
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest border border-curiol-500/30 px-3 py-1 rounded-full">Panel Administrativo</span>
                        </div>
                        <h1 className="text-5xl font-serif text-white italic mb-4">Cotizador & Contratos Maestro</h1>
                        <p className="text-tech-500 max-w-2xl">Diseña propuestas formales para <span className="text-white">Legado e Interacción</span> o <span className="text-white">Infraestructura Digital Ágil</span> con generación automática de contrato.</p>
                    </div>
                    <div className="pb-4">
                        <CommandK isMaster={isMaster} />
                    </div>
                </header>

                <div className="flex flex-col gap-8">
                    {/* Configuración Superior */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Datos del Cliente */}
                        <GlassCard className="p-6">
                            <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest block mb-4">Datos del Cliente & Entrega</label>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-800 group-focus-within:text-curiol-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Nombre del Cliente"
                                        className="w-full bg-tech-950/50 border border-tech-800 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-curiol-500 transition-all font-sans"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-tech-800 text-[8px] uppercase font-bold tracking-widest block mb-2 px-1">Cantidad de Fotos</label>
                                        <input
                                            type="text"
                                            disabled={isUnlimitedPhotos}
                                            value={photoCount}
                                            onChange={(e) => setPhotoCount(e.target.value)}
                                            placeholder="Ej: 15"
                                            className="w-full bg-tech-950/50 border border-tech-800 rounded-xl py-2 px-4 text-white text-xs outline-none focus:border-curiol-500 transition-all disabled:opacity-30 font-sans"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="unlimited"
                                            checked={isUnlimitedPhotos}
                                            onChange={(e) => setIsUnlimitedPhotos(e.target.checked)}
                                            className="w-4 h-4 accent-curiol-500"
                                        />
                                        <label htmlFor="unlimited" className="text-tech-500 text-[9px] uppercase font-bold tracking-widest cursor-pointer select-none">Ilimitadas</label>
                                    </div>
                                </div>
                                <div className="flex bg-tech-950/50 p-1 rounded-xl border border-tech-800">
                                    <button
                                        onClick={() => setCurrency("CRC")}
                                        className={cn("flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", currency === "CRC" ? "bg-curiol-700 text-white" : "text-tech-500")}
                                    >CRC (₡)</button>
                                    <button
                                        onClick={() => setCurrency("USD")}
                                        className={cn("flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", currency === "USD" ? "bg-curiol-700 text-white" : "text-tech-500")}
                                    >USD ($)</button>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Detalles y Notas */}
                        <GlassCard className="p-6 lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                <div className="flex flex-col">
                                    <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest block mb-4 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Detalles para Propuesta (Visible en PDF)
                                    </label>
                                    <textarea
                                        value={proposalDescription}
                                        onChange={(e) => setProposalDescription(e.target.value)}
                                        placeholder="Descripción detallada de lo que incluye esta propuesta especial para el cliente..."
                                        className="flex-grow w-full min-h-[120px] bg-tech-950/50 border border-tech-800 rounded-xl p-4 text-white text-xs outline-none focus:border-curiol-500 transition-all resize-none font-sans font-light"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-tech-700 text-[10px] uppercase font-bold tracking-widest block mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Notas Internas (Solo para ti)
                                    </label>
                                    <textarea
                                        value={internalNotes}
                                        onChange={(e) => setInternalNotes(e.target.value)}
                                        placeholder="Motivos de la excepción, historial del cliente o recordatorios privados..."
                                        className="flex-grow w-full min-h-[120px] bg-tech-950/20 border border-tech-900 rounded-xl p-4 text-tech-400 text-xs outline-none focus:border-red-900/30 transition-all resize-none font-sans font-light italic"
                                    />
                                </div>
                            </div>

                            {/* Descuento Contado Toggle */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setUseCashDiscount(!useCashDiscount)}
                                    className={cn(
                                        "w-full py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                                        useCashDiscount
                                            ? "bg-curiol-500/10 border-curiol-500 shadow-lg shadow-curiol-500/5 text-white"
                                            : "bg-tech-950/50 border-tech-800 text-tech-500 hover:border-tech-700"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Sparkles className={cn("w-4 h-4", useCashDiscount ? "text-curiol-500" : "text-tech-800")} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Pago de Contado (-15%)</span>
                                    </div>
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        useCashDiscount ? "border-curiol-500 bg-curiol-500" : "border-tech-800"
                                    )}>
                                        {useCashDiscount && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Selector de Categoría */}
                    <div className="w-full">
                        <label className="text-tech-500 text-[10px] uppercase font-bold tracking-widest block mb-4">Categoría Estratégica</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => { setTab("legado"); setSelectedPackages([]); setSelectedExtras([]); }}
                                className={cn(
                                    "p-6 rounded-2xl border transition-all flex items-center gap-6 group text-left",
                                    tab === "legado" ? "bg-curiol-500/10 border-curiol-500 shadow-2xl shadow-curiol-500/10" : "bg-tech-900/50 border-tech-800 hover:border-tech-700"
                                )}
                            >
                                <Heart className={cn("w-8 h-8", tab === "legado" ? "text-curiol-500" : "text-tech-500")} />
                                <div>
                                    <p className="text-white font-serif text-xl italic leading-none mb-1">Legado e Interacción</p>
                                    <p className="text-tech-500 text-[8px] uppercase tracking-[0.2em] font-bold">Consumidor Final • Memorias AR • Fine Art</p>
                                </div>
                            </button>
                            <button
                                onClick={() => { setTab("infra"); setSelectedPackages([]); setSelectedExtras([]); }}
                                className={cn(
                                    "p-6 rounded-2xl border transition-all flex items-center gap-6 group text-left",
                                    tab === "infra" ? "bg-tech-500/10 border-tech-500 shadow-2xl shadow-tech-500/10" : "bg-tech-900/50 border-tech-800 hover:border-tech-700"
                                )}
                            >
                                <Briefcase className={cn("w-8 h-8", tab === "infra" ? "text-tech-500" : "text-tech-500")} />
                                <div>
                                    <p className="text-white font-serif text-xl italic leading-none mb-1">Infraestructura Digital</p>
                                    <p className="text-tech-500 text-[8px] uppercase tracking-[0.2em] font-bold">B2B • Marca Personal • Aceleración IA</p>
                                </div>
                            </button>
                            <button
                                onClick={() => { setTab("sociales"); setSelectedPackages([]); setSelectedExtras([]); }}
                                className={cn(
                                    "p-6 rounded-2xl border transition-all flex items-center gap-6 group text-left",
                                    tab === "sociales" ? "bg-curiol-500/10 border-curiol-500 shadow-2xl shadow-curiol-500/10" : "bg-tech-900/50 border-tech-800 hover:border-tech-700"
                                )}
                            >
                                <Sparkles className={cn("w-8 h-8", tab === "sociales" ? "text-curiol-500" : "text-tech-500")} />
                                <div>
                                    <p className="text-white font-serif text-xl italic leading-none mb-1">Eventos Sociales</p>
                                    <p className="text-tech-500 text-[8px] uppercase tracking-[0.2em] font-bold">Gala • Cumpleaños • Institucional</p>
                                </div>
                            </button>
                            <button
                                onClick={() => { setTab("deportes"); setSelectedPackages([]); setSelectedExtras([]); }}
                                className={cn(
                                    "p-6 rounded-2xl border transition-all flex items-center gap-6 group text-left",
                                    tab === "deportes" ? "bg-tech-500/10 border-tech-500 shadow-2xl shadow-tech-500/10" : "bg-tech-900/50 border-tech-800 hover:border-tech-700"
                                )}
                            >
                                <Camera className={cn("w-8 h-8", tab === "deportes" ? "text-tech-500" : "text-tech-500")} />
                                <div>
                                    <p className="text-white font-serif text-xl italic leading-none mb-1">Acción Deportiva</p>
                                    <p className="text-tech-500 text-[8px] uppercase tracking-[0.2em] font-bold">Surf • Golf • Entrenamiento</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Grillade Productos y Resumen */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Selector de Servicios */}
                        <div className="lg:col-span-7 space-y-12">
                            {/* Paquetes */}
                            <div>
                                <h2 className="text-white font-serif text-2xl italic mb-6 flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-curiol-500" /> Paquetes Disponibles
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PACKAGES[tab].map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => togglePackage(pkg)}
                                            className={cn(
                                                "p-6 rounded-2xl border transition-all text-left flex flex-col justify-between group h-full",
                                                selectedPackages.find(p => p.id === pkg.id)
                                                    ? "bg-curiol-gradient border-transparent text-white shadow-xl shadow-curiol-500/20"
                                                    : "bg-tech-900/50 border-tech-800 hover:border-tech-700 text-tech-400"
                                            )}
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className={cn("text-xl font-serif italic text-white")}>{pkg.name}</h3>
                                                    {selectedPackages.find(p => p.id === pkg.id) && <CheckCircle2 className="w-5 h-5 text-white" />}
                                                </div>
                                                <p className={cn("text-xs font-light leading-relaxed mb-6", selectedPackages.find(p => p.id === pkg.id) ? "text-white/80" : "text-tech-500")}>{pkg.desc}</p>
                                            </div>
                                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Inversión</p>
                                                <p className="font-bold text-lg">
                                                    {currency === "CRC" ? `₡${pkg.price.toLocaleString()}` : `$${pkg.usd}`}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Extras */}
                            <div>
                                <h2 className="text-white font-serif text-2xl italic mb-6 flex items-center gap-3">
                                    <Plus className="w-5 h-5 text-curiol-500" /> Personalización & Extras
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {EXTRAS[tab].map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => toggleExtra(pkg)}
                                            className={cn(
                                                "p-6 rounded-2xl border transition-all text-left flex items-center justify-between group h-full",
                                                selectedExtras.find(p => p.id === pkg.id)
                                                    ? "bg-tech-500/10 border-tech-500"
                                                    : "bg-tech-900/50 border-tech-800 hover:border-tech-700"
                                            )}
                                        >
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">{pkg.name}</h3>
                                                    {selectedExtras.find(p => p.id === pkg.id) && <CheckCircle2 className="w-4 h-4 text-tech-500" />}
                                                </div>
                                                <p className="text-[10px] text-tech-500 font-light">{pkg.desc}</p>
                                            </div>
                                            <div className="pl-6 border-l border-tech-800 text-right">
                                                <p className="text-[8px] uppercase font-bold tracking-widest text-tech-600 mb-1">Extra</p>
                                                <p className={cn("font-bold text-sm", selectedExtras.find(p => p.id === pkg.id) ? "text-tech-400" : "text-tech-500")}>
                                                    {currency === "CRC" ? `₡${pkg.price.toLocaleString()}` : `$${pkg.usd}`}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Panel de Resumen y Contrato */}
                        <div className="lg:col-span-5 space-y-6">
                            <GlassCard className="p-8 border-curiol-500/20 relative overflow-hidden sticky top-32">
                                <div className="absolute -bottom-10 -right-10 font-['Great_Vibes'] text-8xl text-white/5 pointer-events-none select-none -rotate-12">
                                    Alberto Bustos
                                </div>

                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-[10px] text-tech-500 font-bold uppercase tracking-[0.3em] mb-1">Curiol Studio • Propuesta</p>
                                        <h3 className="text-2xl font-serif text-white italic">Resumen de Inversión</h3>
                                    </div>
                                    <FileText className="w-6 h-6 text-curiol-500" />
                                </div>

                                <div className="space-y-4 mb-8">
                                    {selectedPackages.length === 0 && selectedExtras.length === 0 ? (
                                        <p className="text-tech-800 text-sm italic text-center py-12">Selecciona servicios para generar el desglose...</p>
                                    ) : (
                                        <>
                                            {selectedPackages.map((pkg) => (
                                                <div key={pkg.id} className="flex justify-between items-end">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3 text-curiol-500" />
                                                        <span className="text-white text-sm font-medium">{pkg.name}</span>
                                                    </div>
                                                    <span className="text-tech-400 text-sm font-bold">
                                                        {currency === "CRC" ? `₡${pkg.price.toLocaleString()}` : `$${pkg.usd}`}
                                                    </span>
                                                </div>
                                            ))}
                                            {selectedExtras.map((pkg) => (
                                                <div key={pkg.id} className="flex justify-between items-end opacity-80">
                                                    <div className="flex items-center gap-2">
                                                        <Plus className="w-3 h-3 text-tech-500" />
                                                        <span className="text-white text-xs font-medium">{pkg.name}</span>
                                                    </div>
                                                    <span className="text-tech-500 text-xs font-bold">
                                                        {currency === "CRC" ? `₡${pkg.price.toLocaleString()}` : `$${pkg.usd}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-tech-800 space-y-3 mb-8">
                                    <div className="flex justify-between items-center bg-curiol-500/5 p-4 rounded-xl">
                                        <div>
                                            <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Inversión</p>
                                            <p className="text-2xl font-serif text-white italic">{currency === "CRC" ? `₡${total.toLocaleString()}` : `$${total}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-tech-800/30 p-4 rounded-xl border border-tech-800">
                                        <div>
                                            <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pago Anticipado (20%)</p>
                                            <p className="text-xl font-serif text-curiol-500 italic">
                                                {currency === "CRC" ? `₡${advancePayment.toLocaleString()}` : `$${advancePayment.toFixed(2)}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-tech-500 text-[8px] uppercase tracking-widest mb-1">Pendiente contra entrega</p>
                                            <p className="text-xs text-white font-bold">
                                                {currency === "CRC" ? `₡${(total - advancePayment).toLocaleString()}` : `$${(total - advancePayment).toFixed(2)}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        disabled={selectedPackages.length === 0 || !clientName}
                                        onClick={() => setShowPreview(true)}
                                        className="w-full py-4 bg-white text-tech-950 text-[10px] font-bold uppercase tracking-widest hover:bg-tech-100 transition-all rounded-xl disabled:opacity-30 flex items-center justify-center gap-2"
                                    >
                                        <FileCheck className="w-4 h-4" /> Generar Borrador de Contrato
                                    </button>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Ghost Area para Generación de PDF (Oculta) */}
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div ref={pdfRef} className="w-[800px] p-20 bg-white text-slate-900 font-serif">
                    <div className="flex justify-between items-center border-b-2 border-slate-100 pb-12 mb-12">
                        <div>
                            <h1 className="text-4xl uppercase tracking-[0.2em] font-medium text-slate-800">CURIOL<span className="text-slate-400">STUDIO</span></h1>
                            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-slate-400 mt-2">Digitalización Humana 2026</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 mb-1">No. Propuesta</p>
                            <p className="text-xl font-sans font-bold text-slate-800">{quoteId}</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-slate-50">I. Resumen de Acuerdo para: <span className="text-slate-900">{clientName}</span></h2>

                            {proposalDescription && (
                                <div className="mb-8 p-6 bg-slate-50 rounded-xl border-l-4 border-slate-200">
                                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 mb-2">Detalles de la Propuesta</p>
                                    <p className="text-xs text-slate-700 leading-relaxed italic whitespace-pre-wrap">{proposalDescription}</p>
                                </div>
                            )}

                            <table className="w-full text-left font-sans text-xs">
                                <thead>
                                    <tr className="border-b-2 border-slate-900/10 uppercase tracking-widest">
                                        <th className="py-4 font-bold">Concepto de Servicio</th>
                                        <th className="py-4 text-center font-bold">Entrega</th>
                                        <th className="py-4 text-right font-bold">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {selectedPackages.map(p => (
                                        <tr key={p.id}>
                                            <td className="py-4">
                                                <p className="font-bold text-slate-800">{p.name}</p>
                                                <p className="text-[9px] text-slate-500 mt-1 max-w-md">{p.desc}</p>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="bg-slate-100 px-3 py-1 rounded-full text-[9px] font-bold uppercase text-slate-600">
                                                    {tab === 'legado' ? (isUnlimitedPhotos ? 'Fotos Ilimitadas' : `${photoCount} Fotos Fine Art`) : 'Módulo Digital'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right font-bold text-slate-800">
                                                {currency === "CRC" ? `₡${p.price.toLocaleString()}` : `$${p.usd}`}
                                            </td>
                                        </tr>
                                    ))}
                                    {selectedExtras.map(p => (
                                        <tr key={p.id}>
                                            <td className="py-4 opacity-75">
                                                <p className="font-bold text-slate-600">+ {p.name}</p>
                                                <p className="text-[8px] text-slate-400 mt-0.5 max-w-md">{p.desc}</p>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-[9px] text-slate-400 font-medium italic">Complemento</span>
                                            </td>
                                            <td className="py-4 text-right font-bold text-slate-600">
                                                {currency === "CRC" ? `₡${p.price.toLocaleString()}` : `$${p.usd}`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-slate-900/10">
                                        <td colSpan={2} className="py-6 font-bold uppercase text-slate-400">Inversión Total Estimada</td>
                                        <td className="py-6 text-right font-bold text-2xl text-slate-900">
                                            {currency === "CRC" ? `₡${total.toLocaleString()}` : `$${total}`}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {selectedPackages.some(p => p.id === 'legado') && (
                            <div className="bg-curiol-50 p-10 rounded-2xl border-l-4 border-curiol-500 space-y-4">
                                <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-curiol-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-curiol-600" /> III. Cláusulas de Membresía & Agenda
                                </h2>
                                <ul className="space-y-3 text-[10px] text-slate-700 leading-relaxed font-sans">
                                    <li>• **Prioridad de Agenda**: El suscriptor goza de prioridad para asegurar sus 3 fechas anuales.</li>
                                    <li>• **Formalización**: Las fechas definitivas deben quedar agendadas por el cliente al momento de la firma de este contrato.</li>
                                    <li>• **Política de Reprogramación**: Se permite **un solo cambio de fecha** por sesión, el cual debe ser solicitado con un mínimo de **15 días de anticipación** para ser válido y aplicable según disponibilidad de Curiol Studio.</li>
                                </ul>
                            </div>
                        )}

                        <div className="bg-slate-50 p-10 rounded-2xl space-y-6">
                            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-slate-900" /> {selectedPackages.some(p => p.id === 'legado') ? 'IV' : 'II'}. Términos de Producción & Pago
                            </h2>
                            <div className="grid grid-cols-2 gap-10 font-sans">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Pago Anticipado Requerido (20%)</p>
                                        <p className="text-2xl font-bold text-slate-900">{currency === "CRC" ? `₡${advancePayment.toLocaleString()}` : `$${advancePayment.toFixed(2)}`}</p>
                                        <p className="text-[8px] text-slate-500 italic mt-2">* Este rubro asegura la fecha en agenda y la pre-producción IA/Logística.</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Métodos de Pago</p>
                                        <p className="text-[9px] font-medium">SINPE Móvil: 6060-2617 (Alberto Bustos)</p>
                                        <p className="text-[9px] font-medium">Transferencia / Tarjeta de Crédito (+3%)</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold">Entrega Estimada</p>
                                            <p className="text-[10px] text-slate-500">10-15 días hábiles post-producción.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold">Garantía Legado</p>
                                            <p className="text-[10px] text-slate-500">Respaldo digital en la nube por 12 meses incluido.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 grid grid-cols-2 gap-20 text-center font-sans border-t border-slate-300">
                            <div>
                                <div className="flex justify-center mb-4">
                                    <img
                                        src="/Firma_Blanco_Transparente.png"
                                        alt="Logo Curiol Studio"
                                        className="h-12 object-contain"
                                    />
                                </div>
                                <p className="text-[9px] font-bold uppercase tracking-widest">Alberto Bustos Ortega</p>
                                <p className="text-[8px] text-slate-400 uppercase">Curiol Studio • Productor</p>
                            </div>
                            <div>
                                <div className="h-16"></div>
                                <p className="text-[9px] font-bold uppercase tracking-widest">{clientName || "Nombre del Cliente"}</p>
                                <p className="text-[8px] text-slate-400 uppercase">Aceptación de Acuerdo</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-40 text-center pt-8 border-t border-slate-100">
                        <p className="text-[8px] text-slate-400 italic">Este documento tiene carácter de contrato privado de servicios profesionales. El inicio de labores está supeditado a la confirmación del pago anticipado.</p>
                    </div>
                </div>
            </div>

            {/* Modal de Vista Previa */}
            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-tech-950/90 backdrop-blur-md"
                            onClick={() => setShowPreview(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-4xl h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-serif text-slate-900 italic">Vista Previa de Propuesta Formal</h3>
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Revisa los datos antes de exportar el PDF</p>
                                </div>
                                <button onClick={() => setShowPreview(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto bg-slate-100 p-8 md:p-20">
                                <div className="bg-white shadow-xl mx-auto max-w-[800px] min-h-[1100px] p-20 text-slate-900 font-serif pointer-events-none scale-[0.85] origin-top">
                                    <div className="flex justify-between items-center border-b-2 border-slate-100 pb-12 mb-12">
                                        <div>
                                            <h1 className="text-4xl uppercase tracking-[0.2em] font-medium text-slate-800">CURIOL<span className="text-slate-400">STUDIO</span></h1>
                                            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-slate-400 mt-2">Digitalización Humana 2026</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 mb-1">No. Propuesta</p>
                                            <p className="text-xl font-sans font-bold text-slate-800">{quoteId}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <div>
                                            <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-slate-50">I. Resumen de Acuerdo para: <span className="text-slate-900">{clientName}</span></h2>

                                            {proposalDescription && (
                                                <div className="mb-8 p-6 bg-slate-50 rounded-xl border-l-4 border-slate-200">
                                                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 mb-2">Detalles de la Propuesta</p>
                                                    <p className="text-xs text-slate-700 leading-relaxed italic whitespace-pre-wrap">{proposalDescription}</p>
                                                </div>
                                            )}

                                            <table className="w-full text-left font-sans text-xs">
                                                <thead>
                                                    <tr className="border-b-2 border-slate-900/10 uppercase tracking-widest">
                                                        <th className="py-4 font-bold">Concepto de Servicio</th>
                                                        <th className="py-4 text-right font-bold">Monto</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {selectedPackages.map(p => (
                                                        <tr key={p.id}>
                                                            <td className="py-4">
                                                                <p className="font-bold text-slate-800">{p.name}</p>
                                                                <p className="text-[9px] text-slate-500 mt-1 max-w-md">{p.desc}</p>
                                                            </td>
                                                            <td className="py-4 text-right font-bold text-slate-800">
                                                                {currency === "CRC" ? `₡${p.price.toLocaleString()}` : `$${p.usd}`}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {selectedExtras.map(p => (
                                                        <tr key={p.id}>
                                                            <td className="py-4 opacity-75">
                                                                <p className="font-bold text-slate-600">+ {p.name}</p>
                                                            </td>
                                                            <td className="py-4 text-right font-bold text-slate-600">
                                                                {currency === "CRC" ? `₡${p.price.toLocaleString()}` : `$${p.usd}`}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-12">
                                            <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-slate-50">III. Cláusulas de Agenda y Compromiso</h2>
                                            <ul className="space-y-3">
                                                <li className="text-[10px] text-slate-600 font-sans leading-relaxed"><span className="font-bold text-slate-800">1. PRIORIDAD:</span> El cliente goza de prioridad en la agenda de Curiol Studio para asegurar su sesion.</li>
                                                <li className="text-[10px] text-slate-600 font-sans leading-relaxed"><span className="font-bold text-slate-800">2. FORMALIZACIÓN:</span> Las fechas anuales deben quedar agendadas al momento de la firma (hoy).</li>
                                                <li className="text-[10px] text-slate-600 font-sans leading-relaxed"><span className="font-bold text-slate-800">3. POLÍTICA DE CAMBIOS:</span> Se permite UN solo cambio de fecha por sesión, solicitado con 15 días de preaviso.</li>
                                                <li className="text-[10px] text-slate-600 font-sans leading-relaxed"><span className="font-bold text-slate-800">4. ENTREGA DE PRODUCTO FÍSICO:</span> La entrega del retablo/tarjeta con tecnología NFC se realizará 15 días hábiles posteriores a la entrega de la galería digital, una vez que el cliente haya seleccionado la fotografía final.</li>
                                                <li className="text-[10px] text-slate-600 font-sans leading-relaxed"><span className="font-bold text-slate-800">5. INCUMPLIMIENTO:</span> El incumplimiento de los plazos de preaviso anula el derecho a reprogramación automática.</li>
                                                <li className="text-[10px] text-slate-600 font-sans leading-relaxed"><span className="font-bold text-slate-800">6. RESERVA & EJECUCIÓN:</span> El pago del adelanto (20%) perfecciona este contrato y equivale a su firma legal.</li>
                                            </ul>
                                        </div>

                                        <div className="mt-6 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">IV. Cláusula de Ejecución Administrativa</p>
                                            <p className="text-[10px] text-slate-700 leading-relaxed font-sans italic">
                                                "El perfeccionamiento de este acuerdo ocurre con el pago del anticipo estipulado (20%). Dicho acto constituye la firma formal de este contrato y la aceptación irrevocable de todos los términos y condiciones aquí descritos."
                                            </p>
                                        </div>

                                        <div className="mt-4 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">V. Fundamento Jurídico (Ley N° 8454)</p>
                                            <p className="text-[9px] text-slate-600 leading-relaxed font-sans italic">
                                                Esta propuesta y su aceptación digital se rigen por la Ley de Certificados, Firmas Digitales y Documentos Electrónicos de Costa Rica (Ley N° 8454). Bajo el Principio de Equivalencia Funcional (Art. 3), los documentos y firmas electrónicas tienen la misma validez y eficacia que los físicos. El rastro de auditoría y el pago del anticipo constituyen la manifestación expresa de voluntad.
                                            </p>
                                            <p className="mt-4 text-[9px] text-slate-400 font-sans">
                                                ID de Propuesta: {quoteId} | Documento generado desde la consola de administración de Curiol Studio.
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100">
                                            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-4">Inversión Total</h2>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-slate-500">Total:</span>
                                                <span className="text-xl font-bold text-slate-900">{currency === "CRC" ? `₡${total.toLocaleString()}` : `$${total}`}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-curiol-600 font-bold bg-white p-4 rounded-lg">
                                                <span>Pago Anticipado (20%):</span>
                                                <span>{currency === "CRC" ? `₡${advancePayment.toLocaleString()}` : `$${advancePayment.toFixed(2)}`}</span>
                                            </div>
                                            <p className="mt-4 text-[9px] text-slate-400 text-center italic">
                                                * El pago de este anticipo perfecciona legalmente el contrato y acepta las cláusulas de agenda.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t bg-slate-50 flex justify-end gap-4">
                                <button onClick={() => setShowPreview(false)} className="px-8 py-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-all">
                                    Editar Selección
                                </button>
                                <button
                                    onClick={() => { setShowPreview(false); exportPDF(); }}
                                    className="px-10 py-4 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-curiol-500 transition-all rounded-xl shadow-xl shadow-curiol-500/20 flex items-center gap-3"
                                >
                                    {isGenerating ? <Clock className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    {isGenerating ? "Exportando..." : "Exportar Propuesta PDF"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
