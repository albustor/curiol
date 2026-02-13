"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { Camera, Code, ArrowRight, CheckCircle2, ShoppingCart, Sparkles, CreditCard, Send, Clock, ShieldAlert, FileText, CheckCircle, FileSignature, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";

const SECTIONS = [
    { id: "category", label: "Categoría" },
    { id: "package", label: "Paquete" },
    { id: "upsell", label: "Complementos" },
    { id: "summary", label: "Resumen" },
    { id: "clauses", label: "Agenda" },
    { id: "payment", label: "Pago" }
];

const PACKAGES: Record<string, Array<{
    id: string;
    name: string;
    price: number;
    usdPrice: number;
    desc: string;
    isMonthly?: boolean;
    isHourly?: boolean;
    problem: string;
    solution?: string;
    promise?: string;
    photoCount: number;
    physicalProduct: string;
    techIntegrated: string;
    caseStudy?: { title: string; story: string };
    variants?: Array<{
        id: string;
        name: string;
        price: number;
        usdPrice: number;
        desc: string;
        problem: string;
        solution?: string;
        promise?: string;
        photoCount?: number;
        physicalProduct: string;
        techIntegrated: string;
        caseStudy?: { title: string; story: string };
    }>
}>> = {
    family: [
        {
            id: "aventura",
            name: "Aventura Mágica",
            price: 112700,
            usdPrice: 225,
            desc: "Exclusivo para niños: Imaginación hecha realidad. Transformamos la fantasía infantil en realidades phygital de gama alta.",
            problem: "¿Cómo capturar la imaginación sin límites de un niño? Resolvemos la pérdida de la magia infantil con tecnología High-end.",
            photoCount: 15,
            physicalProduct: "Retablo 5x7\" con integración NFC/QR.",
            techIntegrated: "Realidad Aumentada Interactiva, Viva Memory, Digital Bridge.",
            caseStudy: {
                title: "El Guardián del Sueño",
                story: "Santi se vio como un héroe galáctico. Sus padres usan el AR para escuchar su canción de cuna personalizada cada noche."
            }
        },
        {
            id: "recuerdos",
            name: "Recuerdos Eternos",
            price: 132250,
            usdPrice: 265,
            desc: "Conexión intergeneracional Fine Art. Un legado tangible que fusiona la calidez artesanal con la narrativa digital.",
            problem: "La fragilidad de los recuerdos digitales. Resolvemos la necesidad de un legado eterno y físico.",
            photoCount: 15,
            physicalProduct: "Retablo 8x12\" Fine Art (Borde 15mm).",
            techIntegrated: "Revelado de Autor, Narrativa IA, Timeline Premium.",
            caseStudy: {
                title: "El Ancla Familiar",
                story: "Elena restauró su conexión con sus raíces. El retablo es el centro de memoria de su hogar."
            }
        },
        {
            id: "legado",
            name: "Membresía Semestral",
            price: 59490,
            usdPrice: 119,
            desc: "Tu patrimonio emocional protegido. Acompañamiento mensual para documentar la evolución de tu historia.",
            problem: "La historia familiar se dispersa. Resolvemos el olvido con 3 sesiones anuales + Custodia Digital.",
            photoCount: 45,
            physicalProduct: "Membresía Premium (3 sesiones/año).",
            techIntegrated: "Custodia de Herencia Digital, 3 Sesiones anuales, Portal de Entrega.",
            isMonthly: true,
            caseStudy: {
                title: "La Bitácora de Vida",
                story: "Sofía asegura que cada cumpleaños y logro sea documentado y protegido para sus nietos."
            }
        },
        {
            id: "relatos",
            name: "Relatos",
            price: 56000,
            usdPrice: 112,
            desc: "La esencia en formato ágil. Encuentros fotográficos de alta intensidad para capturar momentos específicos.",
            problem: "Falta de tiempo para sesiones largas. Resolvemos la urgencia con profundidad artística.",
            photoCount: 6,
            physicalProduct: "Retablo 5x7\" (13x18 cm) Fine Art.",
            techIntegrated: "Revelado de Autor, Puente Digital NFC.",
            caseStudy: {
                title: "La Chispa del Momento",
                story: "30 minutos bastaron para capturar la mirada única de un recién nacido, creando una joya física eterna."
            }
        }
    ],
    seasonal: [
        {
            id: "navidad",
            name: "Instantes de Luz",
            price: 77000,
            usdPrice: 149,
            desc: "Momentos mágicos de temporada.",
            problem: "La prisa de fin de año impide conectar. Creamos una pausa mágica para celebrar la unión.",
            photoCount: 15,
            physicalProduct: "Tarjeta física con mensaje de video integrado.",
            techIntegrated: "Realidad Aumentada (Mensaje de Video), Fondos Temáticos IA.",
            caseStudy: {
                title: "El Abrazo Digital",
                story: "Su hijo estaba fuera del país. Al abrir la tarjeta física y ver su video cobrar vida en AR, sintieron que Navidad finalmente había llegado a casa."
            }
        },
        {
            id: "mini",
            name: "Minisesiones Phygital",
            price: 30000,
            usdPrice: 59,
            desc: "Calidad profesional en formato ágil.",
            problem: "Falta de tiempo. Resolvemos la necesidad de fotos WOW de forma rápida y accesible.",
            photoCount: 15,
            physicalProduct: "Detalle interactivo impreso.",
            techIntegrated: "Realidad Aumentada básica, Smart Delivery.",
            caseStudy: {
                title: "Actualización de Amor",
                story: "Entre el trabajo y la escuela, esta mini-sesión dio la foto perfecta de perfil y un detalle AR para recordar."
            }
        }
    ],
    business: [
        {
            id: "omni_local",
            name: "Omni Local (Guanacaste)",
            price: 280000,
            usdPrice: 550,
            desc: "Digitalización esencial para el comercio local de Santa Bárbara. Incluye 5 fotos de perfil profesional.",
            problem: "Invisibilidad comercial y dependencia del local físico. Muchos negocios locales pierden clientes porque los turistas no encuentran información clara.",
            solution: "Creamos una base digital sólida + 5 Retratos Profesionales. Una Micro-Landing Page auto-gestionable con un Cotizador Básico y Tarjeta NFC.",
            promise: "Tu negocio dejará de ser invisible y tu imagen será coherente con tu valor.",
            photoCount: 5,
            physicalProduct: "Tarjeta NFC Curiol Business personalizada (Bambú/Aluminio).",
            techIntegrated: "Micro-Landing, Cotizador Básico, NFC Smart Bridge, 5 Fotos Fine Art Pro.",
            caseStudy: {
                title: "De la Calle al Smartphone",
                story: "Un artesano local duplicó sus consultas al permitir que los turistas escanearan su tarjeta y vieran sus servicios y precios de inmediato."
            }
        },
        {
            id: "omni_pro_resident",
            name: "Omni Pro (Resident/Expat)",
            price: 780000,
            usdPrice: 1550,
            desc: "Automatización premium para marcas exclusivas. Incluye 5 fotos de perfil profesional.",
            problem: "Caos en la gestión de citas y pérdida de tiempo. Los clientes residentes esperan inmediatez y autogestión.",
            solution: "Infraestructura inteligente de ventas + 5 Retratos Profesionales. Web-App con Agenda integrada y filtro de IA (Gemini).",
            promise: "Recupera tu tiempo. Tu negocio funcionará como una máquina bien engrasada que solo te entrega leads calificados.",
            photoCount: 5,
            physicalProduct: "Kit de bienvenida digital + Tarjeta NFC Premium.",
            techIntegrated: "Web-App Pro, Agenda Inteligente, Filtro Lead IA, 5 Fotos Fine Art Pro.",
            caseStudy: {
                title: "Escalabilidad en la Zona",
                story: "Una empresa de servicios en Flamingo automatizó el 70% de sus citas. Ahora la agenda se llena sola mientras ellos se enfocan en la calidad."
            }
        },
        {
            id: "omni_ultra",
            name: "Omni Ultra (Curiol OS)",
            price: 1530000,
            usdPrice: 3050,
            desc: "Tu ecosistema digital absoluto y escalable. Incluye 5 fotos de perfil profesional.",
            problem: "Herramientas desconectadas y falta de inteligencia de datos estratégica.",
            solution: "El ecosistema absoluto (Curiol OS) + 5 Retratos Profesionales. Integramos Cotizador Pro, Album Studio, AI Analytics y WhatsApp Gateway.",
            promise: "Convierte tu negocio en una empresa de tecnología con una imagen de impacto absoluto.",
            photoCount: 5,
            physicalProduct: "Soporte VIP + Ecosistema Total Curiol (Hardware/Software).",
            techIntegrated: "Cotizador Pro, Album Studio, AI Analytics, WhatsApp Insumos IA, 5 Fotos Fine Art Pro.",
            caseStudy: {
                title: "Control Total del Futuro",
                story: "Al integrar todo el ecosistema, esta firma ya no adivina qué vender; su IA analiza los datos y les dice exactamente cuál será su próximo éxito."
            }
        }
    ]
};

const UPSELLS = {
    nfc: { id: "nfc", name: "Puente Físico Inteligente", price: 20000, usdPrice: 40, desc: "Tarjeta premium NFC con Realidad Aumentada integrada para impacto inmediato." },
    cuadro: { id: "cuadro", name: "Cuadro Vivo Extra", price: 45000, usdPrice: 95, desc: "Canvas 16x20\" con Realidad Aumentada para expandir tu galería física." },
    seo: { id: "seo", name: "Optimización IA Search", price: 25000, usdPrice: 55, desc: "Configuración de visibilidad local y textos persuasivos optimizados por IA." }
};

const COMPLEMENTS = [
    { id: "phygital_extra", name: "Duo Phygital (AR + Viva Memory)", price: 22500, usdPrice: 45, desc: "Suma la magia de la Realidad Aumentada y el Slideshow con música IA. Precio especial por paquete." },
    { id: "memoria_viva", name: "Memoria Viva (Slideshow + Música)", price: 15000, usdPrice: 30, desc: "Tu historia en un slideshow con música original." },
    { id: "cancion_ia", name: "Canción Personalizada (IA)", price: 15000, usdPrice: 30, desc: "Las ideas y emociones son humanas, la música es asistida por IA." },
    { id: "detras_camaras", name: "Detrás de Cámaras (YouTube NFC)", price: 8000, usdPrice: 15, desc: "Acceso instantáneo al video del proceso creativo." },
    { id: "extra_photos", name: "Paquete +5 Fotos Extra", price: 18000, usdPrice: 35, desc: "Más momentos capturados con el mismo nivel de detalle." }
];

const UPGRADE_SIZES = [
    {
        type: "Retablo 12mm", sizes: [
            { label: "8x10\"", price: 125000, usdPrice: 250 },
            { label: "11x14\"", price: 135000, usdPrice: 270 },
            { label: "16x24\"", price: 185000, usdPrice: 370 },
            { label: "20x30\"", price: 245000, usdPrice: 490 }
        ]
    },
    {
        type: "Retablo 15mm", sizes: [
            { label: "8x10\"", price: 130000, usdPrice: 260 },
            { label: "11x14\"", price: 145000, usdPrice: 290 },
            { label: "16x24\"", price: 195000, usdPrice: 390 },
            { label: "20x30\"", price: 285000, usdPrice: 570 }
        ]
    },
    {
        type: "Canvas Full Color", sizes: [
            { label: "11x14\"", price: 135000, usdPrice: 270 },
            { label: "16x20\"", price: 180000, usdPrice: 360 },
            { label: "20x30\"", price: 235000, usdPrice: 470 }
        ]
    }
];

export default function CotizadorPage() {
    const [step, setStep] = useState(0);
    const [currency, setCurrency] = useState<"CRC" | "USD">("CRC");
    const [category, setCategory] = useState<"family" | "business" | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [extras, setExtras] = useState<any[]>([]);
    const [selectedComplementIds, setSelectedComplementIds] = useState<string[]>([]);
    const [upgradeSize, setUpgradeSize] = useState<{ label: string; price: number; usdPrice: number } | null>(null);
    const [showSizes, setShowSizes] = useState(false);
    const [hours, setHours] = useState(2);
    const [isCoastal, setIsCoastal] = useState(false);
    const [isAdvanceBooking, setIsAdvanceBooking] = useState(false);
    const [useInstallments, setUseInstallments] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"sinpe" | "transfer" | "card" | null>(null);
    const [quoteId, setQuoteId] = useState("");
    const [clientData, setClientData] = useState({
        name: "",
        email: "",
        phone: "",
        cedula: "",
        domicilio: "",
        company: "",
        interest: ""
    });

    const [clausesAccepted, setClausesAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [clientIp, setClientIp] = useState("");

    useEffect(() => {
        setQuoteId(`CP-${Math.floor(Math.random() * 90000) + 10000}`);
        // Capture IP
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setClientIp(data.ip))
            .catch(err => console.error("Error fetching IP:", err));
    }, []);

    const generateContractPDF = () => {
        const doc = new jsPDF();
        const now = new Date();
        const dateStr = now.toLocaleDateString();

        // Branding
        doc.setFontSize(22);
        doc.setTextColor(191, 155, 48); // Curiol Gold
        doc.text("CURIOL STUDIO", 105, 30, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Contrato de Prestación de Servicios Fotográficos", 105, 40, { align: "center" });
        doc.text(`Ref: ${quoteId} | Fecha: ${dateStr}`, 105, 45, { align: "center" });

        // Client Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("I. DATOS DEL CLIENTE", 20, 60);
        doc.setFontSize(10);
        doc.text(`Nombre: ${clientData.name}`, 20, 70);
        doc.text(`Identificación: ${clientData.cedula}`, 20, 75);
        doc.text(`Domicilio: ${clientData.domicilio}`, 20, 80);

        // Service Info
        doc.setFontSize(12);
        doc.text("II. DETALLE DEL SERVICIO", 20, 95);
        doc.setFontSize(10);
        doc.text(`Paquete: ${selectedPackage?.name}`, 20, 105);
        doc.text(`Inversión Total: ${currency === "USD" ? "$" : "₡"}${total.toLocaleString()}`, 20, 110);
        doc.text(`Método de Pago: ${paymentMethod || "Pendiente"}`, 20, 115);

        // Clauses
        doc.setFontSize(12);
        doc.text("III. CLÁUSULAS DE AGENDA Y COMPROMISO", 20, 130);
        doc.setFontSize(9);
        const clauses = [
            "1. PRIORIDAD: El cliente goza de prioridad en la agenda de Curiol Studio para asegurar su sesion.",
            "2. FORMALIZACIÓN: Las fechas anuales deben quedar agendadas al momento de la firma (hoy).",
            "3. POLÍTICA DE CAMBIOS: Se permite UN solo cambio de fecha por sesión, solicitado con 15 días de preaviso.",
            "4. EL INCUMPLIMIENTO de los plazos de preaviso anula el derecho a reprogramación automática.",
            "5. RESERVA & EJECUCIÓN: El pago del adelanto (20%) perfecciona este contrato y equivale a su firma legal."
        ];
        clauses.forEach((line, i) => {
            doc.text(line, 20, 140 + (i * 7));
        });

        // Signature
        doc.setFontSize(12);
        doc.text("IV. ACEPTACIÓN Y FIRMA", 20, 185);
        doc.setFontSize(8);
        doc.text("Este documento ha sido generado automáticamente y aceptado digitalmente por el cliente.", 20, 195);
        doc.text(`Audit Trail ID: ${now.getTime()}-${quoteId} | IP: ${clientIp || 'N/A'}`, 20, 200);
        doc.text("CONFORMIDAD: Al realizar el pago, el cliente acepta irrevocablemente los términos aquí descritos.", 20, 205);

        doc.setLineWidth(0.5);
        doc.line(20, 215, 80, 215);
        doc.text("FIRMA DEL CLIENTE (Aceptado Digital)", 20, 220);
        doc.text(`Nombre: ${clientData.name}`, 20, 225);
        doc.text(`Audit Trail: ${now.getTime()}-${quoteId}`, 20, 230);

        doc.line(120, 215, 180, 215);
        doc.text("CURIOL STUDIO", 120, 220);
        doc.text("Alberto Bustos Ortega", 120, 225);

        doc.save(`Contrato_Curiol_${clientData.name.replace(/\s+/g, '_')}.pdf`);
    };

    const handleNext = () => setStep(s => Math.min(s + 1, SECTIONS.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    const packageBaseTotal = selectedPackage
        ? (upgradeSize
            ? (currency === "CRC" ? upgradeSize.price : upgradeSize.usdPrice)
            : (currency === "CRC" ? selectedPackage.price : selectedPackage.usdPrice))
        : 0;

    const packageTotal = selectedPackage?.isHourly
        ? packageBaseTotal * hours
        : packageBaseTotal;

    const complementTotal = COMPLEMENTS
        .filter(c => selectedComplementIds.includes(c.id))
        .reduce((acc, curr) => acc + (currency === "CRC" ? curr.price : curr.usdPrice), 0) * 0.85;

    const coastalFee = isCoastal
        ? (currency === "CRC" ? 15000 : 30)
        : 0;

    const baseTotal = packageTotal + coastalFee + complementTotal +
        extras.reduce((acc, curr) => acc + (currency === "CRC" ? curr.price : curr.usdPrice), 0);

    // Estrategia 2026: El precio ya incluye financiamiento.
    // Si NO se usan cuotas (Pago Contado), se aplica un 15% de descuento.
    const total = (useInstallments && category === 'family')
        ? baseTotal
        : (category === 'family' ? baseTotal * 0.85 : baseTotal);

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow max-w-5xl mx-auto px-4 w-full">
                {/* Currency Toggle */}
                <div className={cn("flex justify-end mb-8 transition-opacity duration-500", category === 'business' ? "opacity-0 pointer-events-none" : "opacity-100")}>
                    <div className="flex bg-tech-800 p-1 rounded-full border border-tech-700">
                        <button
                            onClick={() => setCurrency("CRC")}
                            className={cn("px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all", currency === "CRC" ? "bg-curiol-700 text-white" : "text-tech-500")}
                        >
                            CRC
                        </button>
                        <button
                            onClick={() => setCurrency("USD")}
                            className={cn("px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all", currency === "USD" ? "bg-curiol-700 text-white" : "text-tech-500")}
                        >
                            USD
                        </button>
                    </div>
                </div>

                {/* Progress Header */}
                <div className="flex justify-between items-center mb-16 px-4">
                    {SECTIONS.map((s, idx) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 group">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                step === idx ? "border-curiol-500 bg-curiol-500/10 text-curiol-500 scale-110" :
                                    step > idx ? "border-green-500 bg-green-500/10 text-green-500" : "border-tech-800 text-tech-500"
                            )}>
                                {step > idx ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                            </div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", step === idx ? "text-curiol-500" : "text-tech-500")}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative overflow-hidden min-h-[550px]">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <GlassCard
                                    className={cn("cursor-pointer border-2 transition-all", category === 'family' ? "border-curiol-500 shadow-2xl shadow-curiol-500/20" : "border-transparent")}
                                    onClick={() => {
                                        setCategory('family');
                                        handleNext();
                                    }}
                                >
                                    <Camera className="w-12 h-12 text-curiol-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-white mb-2 italic">Legado Familiar</h3>
                                    <p className="text-tech-400 text-sm font-light leading-relaxed">Aventura Mágica, Recuerdos Eternos, Marca Personal y Membresía.</p>
                                </GlassCard>
                                <GlassCard
                                    className={cn("cursor-pointer border-2 transition-all", category === 'business' ? "border-tech-500 shadow-2xl shadow-tech-500/20" : "border-transparent")}
                                    onClick={() => {
                                        setCategory('business');
                                        setCurrency('USD');
                                        handleNext();
                                    }}
                                >
                                    <Code className="w-12 h-12 text-tech-500 mb-6" />
                                    <h3 className="text-2xl font-serif text-white mb-2 italic">Crecimiento Comercial & IA</h3>
                                    <p className="text-tech-400 text-sm font-light leading-relaxed">Atraemos miradas, cerramos ventas. Tu negocio visible y creciendo 24/7 con infraestructura inteligente.</p>
                                </GlassCard>
                            </motion.div>
                        )}

                        {step === 1 && category && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {PACKAGES[category].map((pkg) => (
                                    <GlassCard
                                        key={pkg.id}
                                        className={cn("cursor-pointer border-2 h-full flex flex-col justify-between transition-all hover:border-curiol-500/50", selectedPackage?.id === pkg.id ? "border-curiol-500 scale-[1.02] shadow-2xl shadow-curiol-500/10" : "border-transparent")}
                                        onClick={() => {
                                            setSelectedPackage(pkg);
                                            // Si no tiene variantes, avanzamos. Si tiene, el usuario las verá en el mismo paso o el siguiente.
                                            if (!(pkg as any).variants) {
                                                handleNext();
                                            }
                                        }}
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xl font-serif text-white mb-2 italic leading-tight">{pkg.name}</h4>

                                                <div className="space-y-4 my-6">
                                                    <div>
                                                        <p className="text-curiol-500/80 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <span className="w-1 h-1 bg-curiol-500 rounded-full"></span>
                                                            TU DESAFÍO
                                                        </p>
                                                        <p className="text-tech-400 text-[11px] font-light italic leading-relaxed pl-3 border-l border-tech-800">
                                                            {pkg.problem}
                                                        </p>
                                                    </div>

                                                    {pkg.solution && (
                                                        <div>
                                                            <p className="text-curiol-500/80 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-curiol-500 rounded-full"></span>
                                                                LA SOLUCIÓN
                                                            </p>
                                                            <p className="text-tech-200 text-[11px] font-medium leading-relaxed pl-3 border-l border-tech-800">
                                                                {pkg.solution}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {pkg.promise && (
                                                        <div>
                                                            <p className="text-curiol-500/80 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-curiol-500 rounded-full"></span>
                                                                LA PROMESA
                                                            </p>
                                                            <p className="text-white text-[11px] font-bold leading-relaxed pl-3 border-l border-curiol-500/50 bg-curiol-500/5 py-1">
                                                                {pkg.promise}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <div className="space-y-1">
                                                    <p className="text-tech-500 text-[9px] uppercase tracking-tighter">Fotos Fine Art</p>
                                                    <p className="text-white text-[11px] font-medium">{pkg.photoCount} seleccionadas</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-tech-500 text-[9px] uppercase tracking-tighter">Tecnología</p>
                                                    <p className="text-curiol-400 text-[11px] font-medium">{pkg.techIntegrated.split(',')[0]}</p>
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <p className="text-tech-500 text-[9px] uppercase tracking-tighter">Físico</p>
                                                    <p className="text-white text-[11px] font-medium">{pkg.physicalProduct}</p>
                                                </div>
                                            </div>

                                            {pkg.caseStudy && (
                                                <div className="mt-4 p-4 bg-curiol-500/5 border border-curiol-500/10 rounded-xl relative">
                                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-curiol-500 mb-1">Impacto Real</p>
                                                    <p className="text-white text-[10px] font-serif italic leading-relaxed">"{pkg.caseStudy.story}"</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-6 border-t border-tech-800 flex justify-between items-center">
                                            <span className="text-curiol-500 font-bold">
                                                {currency === "USD" ? "$" : "₡"}
                                                {currency === "USD" ? pkg.usdPrice.toLocaleString() : pkg.price.toLocaleString()}
                                                {!(pkg as any).variants && pkg.isMonthly && " / mes"}
                                                {(pkg as any).variants && " desde"}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-tech-800 flex items-center justify-center">
                                                <ArrowRight className="w-4 h-4 text-tech-500" />
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}

                                {/* Variant Selection Modal/View inside Step 1 */}
                                <AnimatePresence>
                                    {selectedPackage?.variants && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="md:col-span-2 lg:col-span-3 mt-12 p-8 bg-tech-950 border border-curiol-500/20 rounded-3xl shadow-3xl overflow-hidden relative"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
                                                <div>
                                                    <h4 className="text-2xl font-serif text-white italic">Selecciona tu nivel de Esencia</h4>
                                                    <p className="text-tech-500 text-xs mt-1">Cada opción incluye 15 fotos Fine Art y narrativa personalizada.</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedPackage(null)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-tech-600 hover:text-white transition-all"
                                                >
                                                    Cerrar
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {selectedPackage.variants.map((v: any) => (
                                                    <div
                                                        key={v.id}
                                                        onClick={() => {
                                                            const finalPkg = { ...selectedPackage, ...v };
                                                            delete finalPkg.variants;
                                                            setSelectedPackage(finalPkg);
                                                            handleNext();
                                                        }}
                                                        className="p-6 bg-tech-900 border border-tech-800 rounded-2xl cursor-pointer hover:border-curiol-500 transition-all group"
                                                    >
                                                        <h5 className="text-white font-serif text-lg italic mb-2 group-hover:text-curiol-500 transition-colors">{v.name}</h5>
                                                        <p className="text-tech-500 text-[9px] uppercase tracking-widest mb-2 italic">{v.problem}</p>
                                                        <div className="space-y-3 mb-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-curiol-500" />
                                                                <p className="text-tech-400 text-[10px]">{v.physicalProduct}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-tech-500" />
                                                                <p className="text-tech-400 text-[10px]">{v.techIntegrated}</p>
                                                            </div>
                                                        </div>

                                                        {v.caseStudy && (
                                                            <div className="mb-6 p-3 bg-white/5 rounded-lg border-l-2 border-curiol-500">
                                                                <p className="text-white text-[9px] font-serif italic leading-relaxed">"{v.caseStudy.story}"</p>
                                                            </div>
                                                        )}
                                                        <span className="text-curiol-500 font-bold block">
                                                            {currency === "USD" ? "$" : "₡"}
                                                            {currency === "USD" ? v.usdPrice.toLocaleString() : v.price.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Size Upgrade Matrix Toggle */}
                                            <div className="mt-8 pt-8 border-t border-tech-800">
                                                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                                        showSizes ? "bg-curiol-500 border-curiol-500" : "border-tech-700 bg-tech-950 group-hover:border-curiol-500/50"
                                                    )} onClick={() => setShowSizes(!showSizes)}>
                                                        {showSizes && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-tech-400 group-hover:text-white transition-colors">
                                                        Deseo conocer otros tamaños de impresión
                                                    </span>
                                                </label>

                                                <AnimatePresence>
                                                    {showSizes && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-6 overflow-hidden"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-curiol-500/5 rounded-2xl border border-curiol-500/10">
                                                                {UPGRADE_SIZES.map((group) => (
                                                                    <div key={group.type} className="space-y-3">
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-curiol-500">{group.type}</p>
                                                                        <div className="space-y-2">
                                                                            {group.sizes.map((s) => (
                                                                                <button
                                                                                    key={s.label}
                                                                                    onClick={() => {
                                                                                        setUpgradeSize(s);
                                                                                        handleNext();
                                                                                    }}
                                                                                    className="w-full flex justify-between items-center p-3 bg-tech-900/50 hover:bg-curiol-500/20 border border-tech-800 rounded-lg group/btn transition-all text-left"
                                                                                >
                                                                                    <span className="text-xs text-white group-hover/btn:text-curiol-400">{s.label}</span>
                                                                                    <span className="text-[10px] font-bold text-tech-400">
                                                                                        {currency === "USD" ? "$" : "₡"}
                                                                                        {currency === "USD" ? s.usdPrice.toLocaleString() : s.price.toLocaleString()}
                                                                                    </span>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <p className="mt-4 text-[9px] text-tech-600 italic">
                                                                * Los precios de tamaños superiores mantienen los mismos criterios de cálculo artístico y producción.
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {selectedPackage?.isHourly && (
                                    <div className="md:col-span-2 lg:col-span-3 mt-8 p-8 bg-tech-900 border border-tech-700 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <p className="text-white font-serif text-xl italic">Calculadora de Cobertura</p>
                                            <p className="text-tech-500 text-xs">Ajusta la cantidad de horas estimadas para tu evento.</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => setHours(h => Math.max(2, h - 1))}
                                                className="w-12 h-12 rounded-full border border-tech-700 flex items-center justify-center text-white hover:bg-tech-800 transition-all"
                                            >
                                                -
                                            </button>
                                            <div className="text-center min-w-[80px]">
                                                <span className="text-3xl font-serif text-white italic">{hours}h</span>
                                                <p className="text-[8px] text-tech-600 font-bold uppercase tracking-widest mt-1">Sugerido: ₡{total.toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => setHours(h => Math.min(12, h + 1))}
                                                className="w-12 h-12 rounded-full border border-tech-700 flex items-center justify-center text-white hover:bg-tech-800 transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="mb-10 text-center">
                                    <h3 className="text-3xl font-serif text-white mb-4 italic">Potencia tu Legado.</h3>
                                    <p className="text-tech-400">Selecciona complementos Phygital e IA para expandir tu impacto.</p>
                                </div>

                                <div className="max-w-2xl mx-auto space-y-4">
                                    <section className="mb-8 p-6 bg-curiol-500/5 border border-curiol-500/10 rounded-3xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Sparkles className="w-5 h-5 text-curiol-500" />
                                            <h4 className="text-white font-serif text-xl italic">Complementa tu Memoria</h4>
                                        </div>
                                        <p className="text-tech-500 text-xs mb-6">Añade estas posibilidades exclusivas a tu paquete con un 15% de descuento incluido.</p>

                                        <div className="space-y-3">
                                            {COMPLEMENTS.map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => {
                                                        if (selectedComplementIds.includes(c.id)) {
                                                            setSelectedComplementIds(selectedComplementIds.filter(id => id !== c.id));
                                                        } else {
                                                            setSelectedComplementIds([...selectedComplementIds, c.id]);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group",
                                                        selectedComplementIds.includes(c.id)
                                                            ? "border-curiol-500 bg-curiol-500/10"
                                                            : "border-tech-800 bg-tech-950/30 hover:border-tech-700"
                                                    )}
                                                >
                                                    <div className="flex-grow">
                                                        <p className="text-white text-xs font-medium group-hover:text-curiol-400 transition-colors">{c.name}</p>
                                                        <p className="text-tech-600 text-[9px] mt-1">{c.desc}</p>
                                                    </div>
                                                    <div className="text-right flex items-center gap-4">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-tech-600 line-through text-[9px]">
                                                                {currency === "USD" ? "$" : "₡"}{currency === "USD" ? c.usdPrice.toLocaleString() : c.price.toLocaleString()}
                                                            </span>
                                                            <span className="text-curiol-500 font-bold text-[11px]">
                                                                {currency === "USD" ? "$" : "₡"}
                                                                {currency === "USD" ? (c.usdPrice * 0.85).toLocaleString() : (c.price * 0.85).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className={cn(
                                                            "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                                            selectedComplementIds.includes(c.id) ? "bg-curiol-500 border-curiol-500" : "border-tech-700"
                                                        )}>
                                                            {selectedComplementIds.includes(c.id) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <p className="text-tech-500 text-[10px] uppercase font-bold tracking-[0.2em] text-center mb-6">Mejoras de Producto & SEO</p>

                                    {Object.values(UPSELLS).map((up) => (
                                        <div key={up.id} className="p-6 bg-tech-800/30 border border-tech-700 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-curiol-500/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-curiol-500/10 flex items-center justify-center text-curiol-500 font-bold">
                                                    +
                                                </div>
                                                <div>
                                                    <p className="text-white font-serif text-lg italic">{up.name}</p>
                                                    <p className="text-tech-500 text-xs">{up.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (extras.find(e => e.id === up.id)) {
                                                        setExtras(extras.filter(e => e.id !== up.id));
                                                    } else {
                                                        setExtras([...extras, up]);
                                                    }
                                                }}
                                                className={cn(
                                                    "px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all w-full md:w-auto",
                                                    extras.find(e => e.id === up.id) ? "bg-curiol-500 text-white" : "bg-tech-700 text-tech-300 hover:bg-tech-600"
                                                )}
                                            >
                                                {extras.find(e => e.id === up.id) ? "Añadido" : `Añadir + ${currency === "USD" ? `$${up.usdPrice}` : `₡${up.price.toLocaleString()}`}`}
                                            </button>
                                        </div>
                                    ))}

                                    <div className="pt-10 flex flex-col items-center gap-6">
                                        <button onClick={handleNext} className="px-12 py-5 bg-tech-100 text-tech-950 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all rounded-full">
                                            Ver Resumen de Propuesta
                                        </button>
                                        <button onClick={handleBack} className="text-tech-500 hover:text-white transition-all text-xs uppercase tracking-widest font-bold">Volver</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="max-w-xl mx-auto"
                            >
                                <GlassCard className="border-tech-800 relative overflow-hidden">
                                    <div className="absolute -bottom-10 -right-10 font-['Great_Vibes'] text-8xl text-white/5 pointer-events-none select-none -rotate-12">
                                        Alberto Bustos
                                    </div>

                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-serif text-white italic mb-2">Resumen de Propuesta</h3>
                                            <p className="text-tech-500 text-[10px] font-bold uppercase tracking-[0.3em]">Curiol Studio • Datos para Contrato</p>
                                        </div>
                                        <ShoppingCart className="w-8 h-8 text-curiol-500" />
                                    </div>

                                    {/* Contract Data Fields */}
                                    <div className="space-y-4 mb-10 bg-white/5 p-6 rounded-2xl border border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[7px] font-black uppercase tracking-[0.4em] text-tech-600 ml-1 mb-2 block">Nombre Completo</label>
                                                <input
                                                    type="text"
                                                    value={clientData.name}
                                                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                                                    className="w-full bg-tech-950/50 border border-tech-800 rounded-xl px-4 py-2.5 text-white text-[11px] focus:border-curiol-500 transition-all outline-none"
                                                    placeholder="Nombre legal"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[7px] font-black uppercase tracking-[0.4em] text-tech-600 ml-1 mb-2 block">Cédula / ID</label>
                                                <input
                                                    type="text"
                                                    value={clientData.cedula}
                                                    onChange={(e) => setClientData({ ...clientData, cedula: e.target.value })}
                                                    className="w-full bg-tech-950/50 border border-tech-800 rounded-xl px-4 py-2.5 text-white text-[11px] focus:border-curiol-500 transition-all outline-none"
                                                    placeholder="Identificación"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[7px] font-black uppercase tracking-[0.4em] text-tech-600 ml-1 mb-2 block">Domicilio para Entrega</label>
                                            <input
                                                type="text"
                                                value={clientData.domicilio}
                                                onChange={(e) => setClientData({ ...clientData, domicilio: e.target.value })}
                                                className="w-full bg-tech-950/50 border border-tech-800 rounded-xl px-4 py-2.5 text-white text-[11px] focus:border-curiol-500 transition-all outline-none"
                                                placeholder="Dirección completa para productos físicos"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 mb-12">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-tech-500 text-[9px] font-bold uppercase tracking-widest mb-1">Paquete Seleccionado</p>
                                                <p className="text-white text-lg font-serif italic">{selectedPackage?.name}</p>
                                            </div>
                                            <span className="text-white font-bold">
                                                {currency === "USD" ? "$" : "₡"}
                                                {upgradeSize
                                                    ? (currency === "USD" ? upgradeSize.usdPrice : upgradeSize.price).toLocaleString()
                                                    : (currency === "USD" ? selectedPackage?.usdPrice : selectedPackage?.price).toLocaleString()
                                                }
                                                {selectedPackage?.isHourly && ` (${hours}h)`}
                                                {selectedPackage?.isMonthly && " / mes"}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 py-4 border-y border-tech-800/50">
                                            <div className="text-center">
                                                <p className="text-tech-600 text-[7px] uppercase tracking-widest font-bold mb-1">Fotos</p>
                                                <p className="text-white text-[10px]">{selectedPackage?.photoCount}</p>
                                            </div>
                                            <div className="text-center border-x border-tech-800/50">
                                                <p className="text-tech-600 text-[7px] uppercase tracking-widest font-bold mb-1">Producto</p>
                                                <p className="text-white text-[10px] truncate px-2">
                                                    {selectedPackage?.physicalProduct?.split(' ')?.[0] || ""} {selectedPackage?.physicalProduct?.split(' ')?.[1] || ""}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-tech-600 text-[7px] uppercase tracking-widest font-bold mb-1">Tecnología</p>
                                                <p className="text-curiol-500 text-[10px]">{selectedPackage?.techIntegrated?.split(',')?.[0] || ""}</p>
                                            </div>
                                        </div>

                                        {isCoastal && (
                                            <div className="flex justify-between text-curiol-500 text-xs italic">
                                                <span>+ Logística Zona Costera</span>
                                                <span>{currency === "USD" ? `$${coastalFee}` : `₡${coastalFee.toLocaleString()}`}</span>
                                            </div>
                                        )}

                                        {(extras.length > 0 || selectedComplementIds.length > 0) && (
                                            <div className="pt-6 border-t border-tech-800 space-y-4">
                                                <p className="text-tech-500 text-[9px] font-bold uppercase tracking-widest">Complementos Seleccionados</p>
                                                {COMPLEMENTS.filter(c => selectedComplementIds.includes(c.id)).map((c) => (
                                                    <div key={c.id} className="flex justify-between text-curiol-500 text-sm italic">
                                                        <span>+ {c.name} <span className="text-[10px] text-tech-600 line-through ml-2">{currency === "USD" ? "$" : "₡"}{currency === "USD" ? c.usdPrice.toLocaleString() : c.price.toLocaleString()}</span></span>
                                                        <span>{currency === "USD" ? "$" : "₡"}{currency === "USD" ? (c.usdPrice * 0.85).toLocaleString() : (c.price * 0.85).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                                {extras.map((ex, idx) => (
                                                    <div key={idx} className="flex justify-between text-curiol-500 text-sm italic">
                                                        <span>+ {ex.name}</span>
                                                        <span>{currency === "USD" ? "$" : "₡"}{currency === "USD" ? ex.usdPrice.toLocaleString() : ex.price.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Advance Booking & Installments */}
                                        <div className="pt-6 border-t border-tech-800 space-y-6">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={cn(
                                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                                    isAdvanceBooking ? "bg-curiol-500 border-curiol-500" : "border-tech-700 bg-tech-950 group-hover:border-curiol-500/50"
                                                )} onClick={() => {
                                                    setIsAdvanceBooking(!isAdvanceBooking);
                                                    if (isAdvanceBooking) setUseInstallments(false);
                                                }}>
                                                    {isAdvanceBooking && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-tech-400 group-hover:text-white transition-colors">
                                                        Sesión planeada con 5+ meses de anticipación
                                                    </span>
                                                    <span className="text-[9px] text-curiol-500 italic mt-0.5">¡Habilita planes de pago seccionados!</span>
                                                </div>
                                            </label>

                                            <AnimatePresence>
                                                {isAdvanceBooking && (selectedPackage?.id === "recuerdos" || selectedPackage?.id === "aventura") && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div
                                                            onClick={() => setUseInstallments(!useInstallments)}
                                                            className={cn(
                                                                "p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group",
                                                                useInstallments
                                                                    ? "border-curiol-500 bg-curiol-500/10"
                                                                    : "border-tech-800 bg-tech-950/30 hover:border-tech-700"
                                                            )}
                                                        >
                                                            <div className="flex-grow">
                                                                <p className="text-white text-xs font-bold group-hover:text-curiol-400 transition-colors uppercase tracking-widest">Pago Seccionado (5 Meses)</p>
                                                                <p className="text-tech-500 text-[9px] mt-1">Organiza tu inversión en 5 cuotas mensuales vía enlace de cobro.</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-curiol-500 font-bold text-sm">
                                                                    5 x ₡{selectedPackage?.id === "recuerdos" ? "23.000" : "16.180"}
                                                                </p>
                                                                <p className="text-[8px] text-tech-600 uppercase font-black tracking-widest mt-1">Sugerido por Alberto</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-tech-800 flex justify-between items-end mb-12">
                                        <div>
                                            <p className="text-tech-500 text-[9px] font-bold uppercase tracking-widest mb-1">
                                                {useInstallments ? "Cuota Mensual (1/5)" : "Inversión Estimada"}
                                            </p>
                                            <p className="text-tech-400 text-[10px] italic">
                                                {useInstallments ? "Inversión seccionada" : "Sujeto a confirmación técnica"}
                                            </p>
                                        </div>
                                        <span className="text-5xl font-serif text-white italic">
                                            {currency === "USD" ? "$" : "₡"}
                                            {useInstallments
                                                ? (Math.round(total / 5)).toLocaleString()
                                                : total.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button className="py-5 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all rounded-xl">
                                            Exportar Detalle
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="py-5 bg-curiol-gradient text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded-xl shadow-xl shadow-curiol-500/20"
                                        >
                                            Continuar a Agenda
                                        </button>
                                    </div>
                                    <button onClick={handleBack} className="w-full text-center mt-8 text-tech-500 hover:text-white transition-all text-[10px] uppercase font-bold tracking-widest">Modificar Selección</button>
                                </GlassCard>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="max-w-xl mx-auto"
                            >
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-serif text-white mb-4 italic">Agenda & Compromiso</h3>
                                    <p className="text-tech-400">Para asegurar la calidad y exclusividad de tu legado, solicitamos tu conformidad con nuestras políticas.</p>
                                </div>

                                <div className="space-y-6">
                                    <GlassCard className="border-curiol-500/20 p-8">
                                        <div className="flex gap-4 mb-8">
                                            <ShieldAlert className="w-10 h-10 text-curiol-500 shrink-0" />
                                            <div>
                                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Protocolo de Curiol Studio</h4>
                                                <p className="text-tech-500 text-[10px] mt-1 italic">Válido para todas las sesiones 2026</p>
                                            </div>
                                        </div>

                                        <ul className="space-y-5 text-sm text-tech-200">
                                            <li className="flex gap-4">
                                                <div className="w-5 h-5 rounded-full bg-curiol-500/10 flex items-center justify-center text-curiol-500 font-bold text-[10px] shrink-0">1</div>
                                                <p className="text-xs leading-relaxed"><span className="text-white font-bold">Prioridad de Agenda:</span> Gozarás de preferencia para asegurar tus espacios anuales.</p>
                                            </li>
                                            <li className="flex gap-4">
                                                <div className="w-5 h-5 rounded-full bg-curiol-500/10 flex items-center justify-center text-curiol-500 font-bold text-[10px] shrink-0">2</div>
                                                <p className="text-xs leading-relaxed"><span className="text-white font-bold">Formalización de Fechas:</span> Al firmar este contrato, definiremos tus fechas definitivas contra agenda.</p>
                                            </li>
                                            <li className="flex gap-4">
                                                <div className="w-5 h-5 rounded-full bg-curiol-500/10 flex items-center justify-center text-curiol-500 font-bold text-[10px] shrink-0">3</div>
                                                <p className="text-xs leading-relaxed"><span className="text-white font-bold">Un solo cambio:</span> Se permite una única reprogramación con <span className="text-curiol-500 font-bold">15 días de preaviso</span>.</p>
                                            </li>
                                        </ul>

                                        <div className="mt-10 pt-8 border-t border-white/5">
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <div
                                                    onClick={() => setClausesAccepted(!clausesAccepted)}
                                                    className={cn(
                                                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                        clausesAccepted ? "bg-curiol-500 border-curiol-500" : "border-tech-700 bg-tech-950 group-hover:border-curiol-500/50"
                                                    )}
                                                >
                                                    {clausesAccepted && <CheckCircle className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-tech-400 group-hover:text-white transition-colors">
                                                    Acepto las cláusulas de agenda y compromiso
                                                </span>
                                            </label>
                                        </div>
                                    </GlassCard>

                                    <div className="flex flex-col items-center gap-6 pt-6">
                                        <button
                                            disabled={!clausesAccepted}
                                            onClick={handleNext}
                                            className={cn(
                                                "px-16 py-6 text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-all rounded-full shadow-2xl",
                                                clausesAccepted ? "bg-curiol-gradient hover:brightness-110 shadow-curiol-500/20" : "bg-tech-800 text-tech-500 cursor-not-allowed opacity-50"
                                            )}
                                        >
                                            Proceder al Pago
                                        </button>
                                        <button onClick={handleBack} className="text-tech-500 hover:text-white transition-all text-[10px] uppercase font-bold tracking-widest">Modificar Propuesta</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && !isSuccess && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-serif text-white mb-4 italic">Método de Pago</h3>
                                    <p className="text-tech-400">Asegura tu reserva mediante el depósito del adelanto (20%).</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* SINPE Option */}
                                    <GlassCard
                                        className={cn("cursor-pointer border-2 transition-all p-8 flex items-center justify-between", paymentMethod === 'sinpe' ? "border-curiol-500 shadow-xl shadow-curiol-500/10" : "border-transparent")}
                                        onClick={() => setPaymentMethod('sinpe')}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-curiol-500/10 rounded-2xl flex items-center justify-center text-curiol-500 font-bold text-lg">SM</div>
                                            <div>
                                                <p className="text-white font-serif text-xl italic leading-none mb-1">SINPE Móvil</p>
                                                <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest">Pago inmediato al 6060-2617</p>
                                            </div>
                                        </div>
                                        <div className={cn("w-6 h-6 rounded-full border-2 transition-all", paymentMethod === 'sinpe' ? "border-curiol-500 bg-curiol-500 ring-4 ring-curiol-500/20" : "border-tech-800")} />
                                    </GlassCard>

                                    {/* Bank Transfer Option */}
                                    <GlassCard
                                        className={cn("cursor-pointer border-2 transition-all p-8 flex items-center justify-between", paymentMethod === 'transfer' ? "border-curiol-500 shadow-xl shadow-curiol-500/10" : "border-transparent")}
                                        onClick={() => setPaymentMethod('transfer')}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-tech-500/10 rounded-2xl flex items-center justify-center text-tech-500 font-bold text-lg">BCR</div>
                                            <div>
                                                <p className="text-white font-serif text-xl italic leading-none mb-1">Transferencia Bancaria (BCR)</p>
                                                <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest">Cuentas en Colones y Dólares</p>
                                            </div>
                                        </div>
                                        <div className={cn("w-6 h-6 rounded-full border-2 transition-all", paymentMethod === 'transfer' ? "border-curiol-500 bg-curiol-500 ring-4 ring-curiol-500/20" : "border-tech-800")} />
                                    </GlassCard>

                                    {/* Credit Card Option (Request Link) */}
                                    <GlassCard
                                        className={cn("cursor-pointer border-2 transition-all p-8 flex items-center justify-between", paymentMethod === 'card' ? "border-curiol-500 shadow-xl shadow-curiol-500/10" : "border-transparent")}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-curiol-gradient rounded-2xl flex items-center justify-center text-white">
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-white font-serif text-xl italic leading-none mb-1">Solicitar Link (Tarjeta)</p>
                                                <p className="text-tech-500 text-[10px] uppercase font-bold tracking-widest">Visa / MasterCard / AMEX</p>
                                            </div>
                                        </div>
                                        <div className={cn("w-6 h-6 rounded-full border-2 transition-all", paymentMethod === 'card' ? "border-curiol-500 bg-curiol-500 ring-4 ring-curiol-500/20" : "border-tech-800")} />
                                    </GlassCard>
                                </div>

                                <AnimatePresence>
                                    {paymentMethod && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 space-y-4">
                                            <div className="p-8 bg-tech-950/50 border border-tech-800 rounded-3xl text-center">
                                                <p className="text-curiol-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Monto a Depositar (Adelanto 20%)</p>
                                                <p className="text-5xl font-serif text-white italic mb-2 tracking-tighter">
                                                    {currency === "USD" ? "$" : "₡"}{(total * 0.2).toLocaleString()}
                                                </p>
                                                <p className="text-tech-600 text-[10px] italic">*El 80% restante se cancela el día de la sesión o según financiamiento.</p>
                                            </div>

                                            {paymentMethod === 'sinpe' && (
                                                <div className="p-6 bg-curiol-500/5 rounded-2xl border border-curiol-500/10 text-center">
                                                    <p className="text-white font-mono text-xl tracking-widest">6060-2617</p>
                                                    <p className="text-tech-500 text-[9px] uppercase font-black tracking-widest mt-1">SM - Alberto Bustos Ortega</p>
                                                </div>
                                            )}

                                            {paymentMethod === 'transfer' && (
                                                <div className="p-6 bg-tech-900/50 rounded-2xl border border-tech-800 text-[10px] space-y-3 font-mono">
                                                    <div className="flex justify-between">
                                                        <span className="text-tech-600 uppercase">Colones:</span>
                                                        <span className="text-white">CR84015202322000422006</span>
                                                    </div>
                                                    <div className="flex justify-between border-t border-white/5 pt-3">
                                                        <span className="text-tech-600 uppercase">Dólares:</span>
                                                        <span className="text-white">CR57015202001299024529</span>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-12 flex flex-col items-center gap-6">
                                    <button
                                        disabled={!paymentMethod || isGenerating}
                                        className={cn(
                                            "px-16 py-6 text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-all rounded-full shadow-2xl flex items-center gap-4",
                                            paymentMethod && !isGenerating ? "bg-curiol-gradient hover:brightness-110 shadow-curiol-500/20" : "bg-tech-800 text-tech-500 cursor-not-allowed"
                                        )}
                                        onClick={async () => {
                                            setIsGenerating(true);
                                            try {
                                                const methodText = paymentMethod === 'sinpe' ? 'SINPE Móvil' :
                                                    paymentMethod === 'transfer' ? 'Transferencia Bancaria' :
                                                        'Link de Pago Seguro (Tarjeta)';

                                                const cardNote = paymentMethod === 'card' ? '\n\n*Nota:* Favor enviarme el link de pago seguro.' : '';

                                                // Save to Firestore
                                                await addDoc(collection(db, "quotes"), {
                                                    quoteId,
                                                    package: selectedPackage?.name,
                                                    total,
                                                    advance: total * 0.2,
                                                    currency,
                                                    paymentMethod,
                                                    status: 'awaiting_advance',
                                                    clausesAccepted: true,
                                                    auditTrail: {
                                                        ip: clientIp,
                                                        userAgent: navigator.userAgent,
                                                        timestamp: Timestamp.now(),
                                                        acceptedByConduct: true
                                                    },
                                                    createdAt: Timestamp.now(),
                                                    client: clientData,
                                                    metadata: { category, installments: useInstallments }
                                                });

                                                // Success Logic
                                                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#bf9b30', '#ffffff', '#222222'] });

                                                generateContractPDF();
                                                setIsSuccess(true);

                                                // Prepare WhatsApp
                                                const message = encodeURIComponent(`Hola Alberto, he formalizado mi reserva en Curiol Studio.\nRef: ${quoteId}\nPaquete: ${selectedPackage?.name}\n\nHe aceptado las cláusulas y descargado mi contrato.\nMétodo de pago: ${methodText}${cardNote}\n\nQuedo a la espera de coordinar fechas contra agenda.`);

                                                setTimeout(() => {
                                                    window.open(`https://wa.me/50662856669?text=${message}`, '_blank');
                                                }, 3000);

                                            } catch (e) {
                                                console.error("Error:", e);
                                            } finally {
                                                setIsGenerating(false);
                                            }
                                        }}
                                    >
                                        {isGenerating ? "Generando Contrato..." : "Formalizar Reserva & Generar Contrato"}
                                        {!isGenerating && <FileSignature className="w-4 h-4" />}
                                    </button>

                                    <button onClick={handleBack} className="text-tech-500 hover:text-white transition-all text-[10px] uppercase font-bold tracking-widest">Volver a Agenda</button>
                                </div>
                            </motion.div>
                        )}

                        {isSuccess && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="max-w-xl mx-auto text-center py-12"
                            >
                                <div className="w-24 h-24 bg-curiol-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-curiol-500/50">
                                    <CheckCircle className="w-12 h-12 text-curiol-500" />
                                </div>
                                <h3 className="text-4xl font-serif text-white mb-4 italic">¡Reserva Formalizada!</h3>
                                <p className="text-tech-400 mb-10 leading-relaxed font-light">
                                    Tu contrato ha sido generado y descargado automáticante. <br />
                                    <span className="text-white font-medium">Estamos abriendo WhatsApp para concluir los detalles finales.</span>
                                </p>

                                <div className="space-y-4">
                                    <GlassCard className="border-tech-800 p-8 flex flex-col items-center">
                                        <FileText className="w-12 h-12 text-tech-400 mb-4" />
                                        <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">Tu Contrato Digital</p>
                                        <p className="text-tech-600 text-[10px] mb-6">Referencia: {quoteId}</p>

                                        <button
                                            onClick={generateContractPDF}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-tech-700 transition-all"
                                        >
                                            <Download className="w-3 h-3" /> Re-descargar Contrato
                                        </button>
                                    </GlassCard>

                                    <div className="pt-8">
                                        <p className="text-[9px] text-tech-700 font-black uppercase tracking-[0.4em]">Curiol Studio • Memorias Vivas 2026</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Bottom) */}
                {
                    step > 0 && step < 3 && (
                        <div className="mt-16 flex justify-between items-center px-4">
                            <button onClick={handleBack} className="text-tech-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <ArrowRight className="w-4 h-4 rotate-180" /> Volver
                            </button>
                            <button onClick={handleNext} className="px-8 py-3 bg-tech-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-tech-700 transition-all flex items-center gap-2">
                                Continuar <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )
                }
            </main >

            <Footer />
            <AiAssistant />
        </div >
    );
}
