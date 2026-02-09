import React from 'react';
import { Camera, Search } from 'lucide-react';

export default function EventLandingTemplate({ config }: { config: any }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{ backgroundColor: config.bgColor || '#ffffff' }}>

      <div className="mb-12">
        <Camera size={48} className="mx-auto mb-4 text-slate-300" />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900"
          style={{ color: config.primaryColor }}>
          {config.brandName || "Evento Especial"}
        </h1>
        <p className="mt-2 text-slate-600 italic">Encuentra tus recuerdos con un solo click</p>
      </div>

      <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 space-y-6">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto border-4 border-blue-100 shadow-inner">
          <Search size={32} className="text-blue-500 animate-pulse" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-800">¿Estuviste aquí?</h2>
          <p className="text-sm text-slate-500 mt-1">Tómate una selfie para encontrar todas tus fotos del evento instantáneamente.</p>
        </div>

        <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
          <Camera size={20} />
          ESCANEAR MI ROSTRO
        </button>
      </div>

      {/* Espacios de Publicidad Federada */}
      <div className="mt-16 grid grid-cols-2 gap-4 max-w-lg w-full">
        {config.ads?.map((ad: any) => (
          <div key={ad.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-lg shrink-0" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Auspiciador</p>
              <p className="text-xs font-semibold text-slate-700 truncate">{ad.merchant}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
