"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    TrendingUp, TrendingDown, DollarSign, Users,
    Calculator, Settings, Lock, ShieldCheck,
    Briefcase, ImageIcon, Zap, PieChart, Aperture,
    ChevronDown, ChevronUp, Info, AlertCircle,
    ArrowUpRight, ArrowDownRight, Activity,
    FileText as FileIcon, UploadCloud, Bot, Send, History,
    CheckCircle2, FileCheck, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FINANCE_CONFIG, calculateProductionCost } from "@/lib/finance-constants";
import { analyzeTaxDeduction, recordTaxTransaction, generateHaciendaReport } from "@/actions/accounting";
import { useRole } from "@/hooks/useRole";

export default function EquilibrioPage() {
    const { role, isMaster } = useRole();
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Calculator State
    const [calcType, setCalcType] = useState<'retablo' | 'canva'>('retablo');
    const [calcSize, setCalcSize] = useState('8x10');
    const [options, setOptions] = useState({ conPie: false, fullColor: true });

    // Tax Consultant State
    const [chatQuery, setChatQuery] = useState("");
    const [chatResponse, setChatResponse] = useState("");
    const [isAsking, setIsAsking] = useState(false);

    // Expense State
    const [expenseForm, setExpenseForm] = useState({ description: "", amount: "", category: "production" });
    const [isUploading, setIsUploading] = useState(false);
    const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

    useEffect(() => {
        if (role !== "LOADING" && !isMaster) {
            router.push("/admin/dashboard");
        }
    }, [role, isMaster, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Master PIN check (hashed/encoded like in regalo page)
        if (btoa(pin) === "MjYxNzI5MTg=") {
            localStorage.setItem("master_admin", "true");
            window.location.reload();
            setError("");
        } else {
            setError("Acceso Denegado. Solo para el Maestro.");
        }
    };

    if (role === "LOADING") return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-curiol-500 animate-spin" />
        </div>
    );

    if (!isMaster) {
        return (
            <div className="min-h-screen bg-tech-950 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <GlassCard className="p-12 text-center border-curiol-500/30">
                        <div className="w-20 h-20 bg-curiol-500/10 rounded-3xl flex items-center justify-center text-curiol-500 mx-auto mb-8 shadow-2xl shadow-curiol-500/20">
                            <Lock className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-serif text-white italic mb-4">Área de Equilibrio</h1>
                        <p className="text-tech-500 text-xs font-light mb-10 tracking-[0.2em] uppercase">Gestión Financiera de Alta Sensibilidad</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Ingresa tu Llave de Maestro"
                                className="w-full bg-tech-900 border border-tech-800 rounded-2xl px-6 py-5 text-white text-center text-2xl font-mono tracking-widest outline-none focus:border-curiol-500 transition-all"
                            />
                            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">{error}</p>}
                            <button className="w-full py-5 bg-curiol-gradient text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                                Validar Acceso
                            </button>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    const currentCost = calculateProductionCost(calcType, calcSize, options);

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 pb-24">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 w-full">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-[1px] w-12 bg-curiol-500"></span>
                            <span className="text-curiol-500 text-[10px] font-bold uppercase tracking-[0.4em]">Finanzas de Curiol Studio</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white italic mb-6 leading-tight">Equilibrio & <br /><span className="text-curiol-gradient">Rentabilidad Ciruclar.</span></h1>
                        <p className="text-tech-400 text-lg font-light">Este panel consolida el flujo de ingresos y egresos estratégicos para mantener el punto sutil de ganancias en cada proyecto.</p>
                    </div>
                    <div className="flex bg-tech-900/50 p-2 rounded-2xl border border-white/5">
                        <div className="px-6 py-3 text-center">
                            <p className="text-[8px] text-tech-600 font-bold uppercase mb-1">Status</p>
                            <p className="text-green-500 text-xs font-bold flex items-center gap-2">
                                <Activity className="w-3 h-3 animate-pulse" /> Sano
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    {/* Main stats cards */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard
                            title="Ingresos Estimados"
                            value="₡1.240.000"
                            trend="+12%"
                            icon={TrendingUp}
                            color="blue"
                        />
                        <MetricCard
                            title="Egresos Proyectados"
                            value={`₡${(Object.values(FINANCE_CONFIG.FIXED_MONTHLY).reduce((a, b) => a + b, 0)).toLocaleString()}`}
                            trend="+5%"
                            icon={TrendingDown}
                            color="red"
                        />
                        <MetricCard
                            title="Neto Disponible"
                            value={`₡${(1240000 - Object.values(FINANCE_CONFIG.FIXED_MONTHLY).reduce((a, b) => a + b, 0)).toLocaleString()}`}
                            trend="+62%"
                            icon={DollarSign}
                            color="gold"
                        />
                    </div>

                    <div className="lg:col-span-4">
                        <GlassCard className="p-8 border-curiol-500/20 bg-curiol-500/5 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="text-curiol-500 w-5 h-5" />
                                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Punto Sutil de Ganancia</span>
                            </div>
                            <h4 className="text-4xl font-serif text-white italic mb-2">60.8%</h4>
                            <p className="text-tech-500 text-[10px] font-light uppercase tracking-widest">Optimizado vía Triángulo Mágico</p>
                        </GlassCard>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Subscription Audit & Break-Even */}
                    <GlassCard className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-serif text-white italic flex items-center gap-3">
                                <Settings className="w-5 h-5 text-curiol-500" /> Auditoría de Suscripciones
                            </h3>
                            <div className="p-2 bg-curiol-500/10 rounded-lg text-curiol-500 text-[8px] font-bold uppercase tracking-widest border border-curiol-500/20">
                                Mensual
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(FINANCE_CONFIG.FIXED_MONTHLY).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center group p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-tech-400 text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">
                                            {key.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-[8px] text-tech-600 font-bold uppercase">Proveedor Directo</span>
                                    </div>
                                    <span className="text-white text-sm font-bold font-mono">₡{value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-tech-400 mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-[.3em]">Total Egresos Fijos</span>
                                <span className="text-xl font-serif italic font-bold text-white">
                                    ₡{Object.values(FINANCE_CONFIG.FIXED_MONTHLY).reduce((a, b) => a + b, 0).toLocaleString()}
                                </span>
                            </div>

                            {/* Break-Even Visualizer */}
                            <div className="bg-tech-950/50 p-6 rounded-2xl border border-curiol-500/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap className="text-curiol-500 w-4 h-4" />
                                    <span className="text-white text-[9px] font-bold uppercase tracking-widest">Punto de Equilibrio</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[8px] text-tech-600 font-bold uppercase mb-1">Mínimo en Ventas</p>
                                        <p className="text-2xl font-serif text-white italic">₡{(Object.values(FINANCE_CONFIG.FIXED_MONTHLY).reduce((a, b) => a + b, 0) / 0.6).toLocaleString().split('.')[0]}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-tech-600 font-bold uppercase mb-1">Citas Meta</p>
                                        <p className="text-lg font-serif text-curiol-500 italic">~1.5 Sesiones</p>
                                    </div>
                                </div>
                                <div className="mt-4 w-full bg-tech-900 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "45%" }}
                                        className="h-full bg-curiol-gradient shadow-[0_0_10px_rgba(191,139,38,0.5)]"
                                    />
                                </div>
                                <p className="text-[8px] text-tech-500 mt-4 leading-relaxed italic">
                                    Debes facturar este monto mínimo mensual para cubrir todas tus herramientas premium y mantener el estudio en "Cero" antes de ganancias reales.
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Collaborator Section */}
                    <GlassCard className="p-8 col-span-1 lg:col-span-2">
                        <h3 className="text-xl font-serif text-white italic mb-8 flex items-center gap-3">
                            <Users className="w-5 h-5 text-curiol-500" /> Capital Humano & Contratos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Kevin Card */}
                            <div className="bg-tech-950/40 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="w-6 h-6 text-curiol-500" />
                                </div>
                                <h4 className="text-white text-2xl font-serif italic mb-2">Kevin Sanchez</h4>
                                <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest mb-6">Desarrollador / Codesarrollador</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-tech-500 text-[10px] uppercase tracking-widest">Base por Proyecto</span>
                                        <span className="text-white text-xs font-bold italic">Negociable</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-tech-500 text-[10px] uppercase tracking-widest">Bono de Venta</span>
                                        <span className="text-curiol-500 text-xs font-bold">5.0% Neto</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-tech-500 text-[10px] uppercase tracking-widest">Infraestructura</span>
                                        <span className="text-tech-400 text-xs italic">A cargo Studio</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cristina Card */}
                            <div className="bg-tech-950/40 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="w-6 h-6 text-curiol-500" />
                                </div>
                                <h4 className="text-white text-2xl font-serif italic mb-2">Cristina</h4>
                                <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest mb-6">Asistencia, QA & Community</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-tech-500 text-[10px] uppercase tracking-widest">Tarifa Sesión</span>
                                        <span className="text-white text-xs font-bold">₡8,000</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-tech-500 text-[10px] uppercase tracking-widest">Comisión Software</span>
                                        <span className="text-curiol-500 text-xs font-bold">3.0% Total</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-tech-500 text-[10px] uppercase tracking-widest">Srv. Internos</span>
                                        <span className="text-white text-xs font-bold">₡5,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* IA Tax Consultant & Expense Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    {/* IA Consultant Chat */}
                    <div className="lg:col-span-12">
                        <GlassCard className="p-1 overflow-hidden border-curiol-500/30">
                            <div className="bg-tech-950/80 p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-curiol-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-curiol-500/20">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-serif italic text-lg">Consultor Contable IA</h3>
                                        <p className="text-tech-600 text-[8px] uppercase font-bold tracking-[.3em]">Experto en Hacienda Costa Rica</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[8px] text-tech-600 font-bold uppercase mb-1">CIIU Principal</p>
                                        <p className="text-white text-[10px] font-mono">{FINANCE_CONFIG.TAX.CODES.PHOTOGRAPHY} (7420)</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-tech-600 font-bold uppercase mb-1">IVA Devengado</p>
                                        <p className="text-white text-[10px] font-mono">13%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="mb-8 bg-tech-900/30 border border-white/5 rounded-2xl p-6 min-h-[120px] flex flex-col justify-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <ShieldCheck className="w-24 h-24" />
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {chatResponse ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-white text-sm font-light leading-relaxed italic"
                                            >
                                                "{chatResponse}"
                                            </motion.div>
                                        ) : (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-tech-500 text-xs font-light italic"
                                            >
                                                Hazme una pregunta sobre tus obligaciones con Hacienda, deducibilidad o fechas de pago de IVA/Renta...
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!chatQuery) return;
                                        setIsAsking(true);
                                        const res = await analyzeTaxDeduction(chatQuery);
                                        setChatResponse(res);
                                        setIsAsking(false);
                                        setChatQuery("");
                                    }}
                                    className="flex gap-4"
                                >
                                    <input
                                        type="text"
                                        value={chatQuery}
                                        onChange={(e) => setChatQuery(e.target.value)}
                                        placeholder="Ej: ¿Es deducible la compra de un lente Phase One?"
                                        className="flex-grow bg-tech-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-curiol-500 transition-all"
                                    />
                                    <button
                                        disabled={isAsking}
                                        className="px-8 py-4 bg-curiol-gradient text-white rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        {isAsking ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        <span className="text-[10px] uppercase font-bold tracking-widest hidden md:inline">Consultar</span>
                                    </button>
                                </form>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Expense Manager with Receipts */}
                    <div className="lg:col-span-7">
                        <GlassCard className="p-8 h-full">
                            <h3 className="text-xl font-serif text-white italic mb-8 flex items-center gap-3">
                                <FileCheck className="w-5 h-5 text-curiol-500" /> Registro de Compras & Gastos
                            </h3>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!expenseForm.description || !expenseForm.amount) return;
                                    setIsUploading(true);
                                    const amount = parseFloat(expenseForm.amount);
                                    await recordTaxTransaction({
                                        type: 'expense',
                                        category: expenseForm.category as any,
                                        amount,
                                        description: expenseForm.description,
                                    });
                                    setRecentExpenses([{
                                        description: expenseForm.description,
                                        amount,
                                        category: expenseForm.category,
                                        date: new Date().toLocaleDateString()
                                    }, ...recentExpenses]);
                                    setExpenseForm({ description: "", amount: "", category: "production" });
                                    setIsUploading(false);
                                }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-tech-600 text-[8px] font-bold uppercase tracking-widest ml-2">Descripción del Gasto</label>
                                        <input
                                            type="text"
                                            value={expenseForm.description}
                                            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                            placeholder="Ej: Factura de Servidor Firebase"
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-tech-600 text-[8px] font-bold uppercase tracking-widest ml-2">Monto Total (₡)</label>
                                        <input
                                            type="number"
                                            value={expenseForm.amount}
                                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-tech-600 text-[8px] font-bold uppercase tracking-widest ml-2">Categoría</label>
                                        <select
                                            value={expenseForm.category}
                                            onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                            className="w-full bg-tech-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm"
                                        >
                                            <option value="photography">Equipo Fotográfico</option>
                                            <option value="software">Software / Cloud</option>
                                            <option value="production">Producción FÍsica</option>
                                            <option value="collaborator">Pago Colaborador</option>
                                            <option value="fixed_cost">Costo Fijo</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-tech-600 text-[8px] font-bold uppercase tracking-widest ml-2">Digitalizar Comprobante</label>
                                        <div className="relative">
                                            <input type="file" className="hidden" id="receipt-upload" />
                                            <label
                                                htmlFor="receipt-upload"
                                                className="flex items-center justify-center gap-3 w-full bg-tech-950 border border-dashed border-tech-700 rounded-xl px-4 py-3 text-tech-500 text-xs hover:border-curiol-500 hover:text-white transition-all cursor-pointer"
                                            >
                                                <UploadCloud className="w-4 h-4" /> Adjuntar Factura / PDF
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-tech-900 border border-white/5 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-tech-800 transition-all flex items-center justify-center gap-2">
                                    {isUploading ? <Activity className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4 text-green-500" />}
                                    Registrar Transacción Hacienda
                                </button>
                            </form>
                        </GlassCard>
                    </div>

                    {/* Reporting Summary */}
                    <div className="lg:col-span-5">
                        <GlassCard className="p-8 h-full border-[#bf8b26]/20 bg-[#bf8b26]/5">
                            <h3 className="text-xl font-serif text-[#bf8b26] italic mb-8 flex items-center gap-3">
                                <PieChart className="w-5 h-5" /> Proyección D-104 (IVA)
                            </h3>
                            <div className="space-y-6">
                                <div className="p-4 bg-tech-950/50 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[8px] text-tech-600 font-bold uppercase tracking-widest">IVA Cobrado (Débito)</span>
                                        <span className="text-green-500 text-xs font-bold font-mono">₡161.200</span>
                                    </div>
                                    <div className="w-full bg-tech-900 h-1 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[80%]" />
                                    </div>
                                </div>
                                <div className="p-4 bg-tech-950/50 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[8px] text-tech-600 font-bold uppercase tracking-widest">IVA Pagado (Crédito)</span>
                                        <span className="text-red-500 text-xs font-bold font-mono">₡63.128</span>
                                    </div>
                                    <div className="w-full bg-tech-900 h-1 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[35%]" />
                                    </div>
                                </div>

                                <div className="pt-8 mt-4 border-t border-[#bf8b26]/20">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-[8px] text-[#bf8b26] font-bold uppercase tracking-widest">Saldo Estimado a Pagar</p>
                                            <p className="text-3xl font-serif text-white italic">₡98.072</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] text-tech-600 font-bold uppercase">Periodo</p>
                                            <p className="text-white text-[10px] uppercase font-bold">Febrero 2026</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-3 bg-[#bf8b26] text-black text-[8px] font-bold uppercase tracking-widest rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                                        <History className="w-3 h-3" /> Generar Informe para Declaración
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Production Calculator Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5">
                        <GlassCard className="p-10 border-tech-800">
                            <h3 className="text-xl font-serif text-white italic mb-10 flex items-center gap-3">
                                <Calculator className="w-5 h-5 text-curiol-500" /> Calculadora de Activos
                            </h3>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-tech-600 text-[10px] font-bold uppercase tracking-widest block mb-4">Tipo de Retablo / Tela</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setCalcType('retablo')}
                                            className={cn(
                                                "p-4 rounded-xl border transition-all flex items-center gap-3",
                                                calcType === 'retablo' ? "bg-curiol-500/10 border-curiol-500 text-white" : "bg-tech-950 border-white/5 text-tech-500"
                                            )}
                                        >
                                            <ImageIcon className="w-4 h-4" /> Retablo
                                        </button>
                                        <button
                                            onClick={() => setCalcType('canva')}
                                            className={cn(
                                                "p-4 rounded-xl border transition-all flex items-center gap-3",
                                                calcType === 'canva' ? "bg-curiol-500/10 border-curiol-500 text-white" : "bg-tech-950 border-white/5 text-tech-500"
                                            )}
                                        >
                                            <Aperture className="w-4 h-4" /> Canva
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-tech-600 text-[10px] font-bold uppercase tracking-widest block mb-4">Dimensiones (Pulgadas)</label>
                                    <select
                                        value={calcSize}
                                        onChange={(e) => setCalcSize(e.target.value)}
                                        className="w-full bg-tech-950 border border-white/5 rounded-xl px-4 py-4 text-white text-sm outline-none focus:border-curiol-500 cursor-pointer"
                                    >
                                        <option value="4x6">4" x 6"</option>
                                        <option value="5x7">5" x 7"</option>
                                        <option value="6x8">6" x 8"</option>
                                        <option value="8x10">8" x 10"</option>
                                        <option value="8x11">8" x 11"</option>
                                        <option value="8x12">8" x 12"</option>
                                        <option value="10x12">10" x 12"</option>
                                        <option value="11x14">11" x 14"</option>
                                        <option value="12x16">12" x 16"</option>
                                        <option value="12x18">12" x 18"</option>
                                        <option value="16x20">16" x 20"</option>
                                        <option value="16x24">16" x 24"</option>
                                        <option value="20x24">20" x 24"</option>
                                        <option value="20x30">20" x 30"</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-8">
                                    {calcType === 'retablo' ? (
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={options.conPie}
                                                onChange={(e) => setOptions({ ...options, conPie: e.target.checked })}
                                                className="w-4 h-4 accent-curiol-500"
                                            />
                                            <span className="text-tech-500 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">¿Con Pie?</span>
                                        </label>
                                    ) : (
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={options.fullColor}
                                                onChange={(e) => setOptions({ ...options, fullColor: e.target.checked })}
                                                className="w-4 h-4 accent-curiol-500"
                                            />
                                            <span className="text-tech-500 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">¿Full Color?</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="lg:col-span-7">
                        <GlassCard className="p-10 border-curiol-500/30 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-curiol-500/5 blur-[100px] -mr-32 -mt-32" />

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                                <div>
                                    <h4 className="text-white text-3xl font-serif italic mb-1">Precio Sugerido Studio</h4>
                                    <p className="text-tech-500 text-[10px] font-bold uppercase tracking-widest">Incluye margen de seguridad +40%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-5xl font-serif text-white italic">₡{currentCost.toLocaleString()}</p>
                                    <p className="text-curiol-500 text-[10px] font-bold uppercase tracking-widest mt-2">Valor de Egreso en Cotización</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-tech-800 flex items-center justify-center text-[10px] font-bold text-white">1</div>
                                        <span className="text-tech-400 text-xs font-light">Costo Base Impresión / Material</span>
                                    </div>
                                    <span className="text-white text-sm font-bold">₡{(currentCost / 1.4).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-curiol-500 font-bold">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-curiol-500/10 flex items-center justify-center text-[10px]">2</div>
                                        <span className="text-xs uppercase tracking-widest">Adicional Studio (40%)</span>
                                    </div>
                                    <span className="text-sm">+ ₡{(currentCost - (currentCost / 1.4)).toLocaleString()}</span>
                                </div>
                                <div className="bg-tech-900/50 p-6 rounded-2xl flex items-center gap-4 mt-8">
                                    <Info className="w-5 h-5 text-tech-600 flex-shrink-0" />
                                    <p className="text-[10px] text-tech-500 leading-relaxed font-light italic">
                                        Este cálculo permite absorber la depreciación de equipo, licencias de software y gastos administrativos indirectos, asegurando que el precio final no comprometa el "Punto Sutil" de la empresa.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function MetricCard({ title, value, trend, icon: Icon, color }: any) {
    const colors = {
        blue: "text-curiol-500 bg-curiol-500/5 border-curiol-500/10 hover:border-curiol-500/30",
        red: "text-red-500 bg-red-500/5 border-red-500/10 hover:border-red-500/30",
        gold: "text-[#bf8b26] bg-[#bf8b26]/5 border-[#bf8b26]/10 hover:border-[#bf8b26]/30",
    } as any;

    return (
        <GlassCard className={cn("p-8 transition-all duration-500 group", colors[color])}>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-black/20 rounded-2xl">
                    <Icon className="w-6 h-6" />
                </div>
                <div className={cn("text-[10px] font-bold px-2 py-1 rounded-full", trend.includes('+') ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                    {trend}
                </div>
            </div>
            <h4 className="text-tech-600 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-white transition-colors">{title}</h4>
            <p className="text-white text-3xl font-serif italic">{value}</p>
        </GlassCard>
    );
}
