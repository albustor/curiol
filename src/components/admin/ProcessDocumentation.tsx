"use client";

import React from 'react';
import { FileText, Printer, CheckCircle, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProcessDocumentationProps {
    title: string;
    lastUpdated: string;
    content: React.ReactNode;
}

export const ProcessDocumentation: React.FC<ProcessDocumentationProps> = ({
    title,
    lastUpdated,
    content
}) => {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header - Hidden on Print */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-6 print:hidden">
                <div className="space-y-1">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-zinc-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        {title}
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Última actualización: {lastUpdated}
                    </p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-all font-medium shadow-lg shadow-zinc-200"
                >
                    <Printer className="w-4 h-4" />
                    Imprimir / Guardar PDF
                </button>
            </div>

            {/* Print-only Header */}
            <div className="hidden print:block border-b-2 border-zinc-900 pb-4 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-black uppercase tracking-tight">Curiol Studio</h1>
                        <p className="text-sm font-medium text-zinc-600 uppercase tracking-widest mt-1">Protocolos Maestros & Estrategia</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold">{title}</p>
                        <p className="text-xs text-zinc-500 font-mono italic">Ref: {new Date().toLocaleDateString('es-CR')}</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/60 p-6 md:p-12 print:border-none print:shadow-none print:p-0">
                <div className="prose prose-zinc prose-lg max-w-none print:text-black">
                    {content}
                </div>
            </div>

            {/* Footer Branding - Print Only */}
            <div className="hidden print:block mt-12 pt-4 border-t border-zinc-200 text-center text-xs text-zinc-400">
                <p>© {new Date().getFullYear()} Curiol Studio - Propiedad intelectual de Alberto Bustos Ortega. Prohibida su reproducción sin autorización.</p>
                <p className="mt-1">Documento generado dinámicamente para uso profesional.</p>
            </div>
        </div>
    );
};

// Subcomponentes para una estructura limpia en la documentación
export const DocSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-12 break-inside-avoid">
        <h2 className="text-2xl font-bold text-zinc-900 border-l-4 border-blue-500 pl-4 mb-6 uppercase tracking-tight">
            {title}
        </h2>
        <div className="space-y-4">
            {children}
        </div>
    </section>
);

export const DocStep: React.FC<{ number: string; text: string; subtext?: string }> = ({ number, text, subtext }) => (
    <div className="flex gap-4 items-start group">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold text-sm border border-zinc-200 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
            {number}
        </span>
        <div>
            <p className="font-semibold text-zinc-900 leading-tight">{text}</p>
            {subtext && <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{subtext}</p>}
        </div>
    </div>
);

export const DocAlert: React.FC<{ type: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type, children }) => {
    const styles = {
        info: "bg-blue-50 border-blue-100 text-blue-800",
        warning: "bg-amber-50 border-amber-100 text-amber-800",
        tip: "bg-emerald-50 border-emerald-100 text-emerald-800",
    };
    const Icons = {
        info: Info,
        warning: AlertCircle,
        tip: CheckCircle,
    };
    const Icon = Icons[type];

    return (
        <div className={`p-4 rounded-xl border flex gap-3 my-6 ${styles[type]}`}>
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm italic font-medium">
                {children}
            </div>
        </div>
    );
};
