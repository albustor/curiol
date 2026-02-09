import React from 'react';
import AdminLayout from '../admin-layout';
import { Palette, Share2, Target, Type } from 'lucide-react';

export default function BrandingPage() {
    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Personalización de Marca</h2>
                <p className="text-slate-500 mb-8 font-serif italic text-lg">Define cómo tus seguidores y clientes verán tu portal de FaceIDcr.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brand Config */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Type className="text-blue-600" size={20} />
                                <h3 className="font-semibold text-slate-800">Identidad Visual</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial</label>
                                    <input type="text" defaultValue="Estudio Legado" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Color Principal (Hex)</label>
                                    <div className="flex gap-2">
                                        <input type="text" defaultValue="#3b82f6" className="flex-1 px-4 py-2 border border-slate-200 rounded-xl" />
                                        <div className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm" style={{ backgroundColor: '#3b82f6' }} />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Logo del Cliente</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-blue-400 transition-all cursor-pointer">
                                        <div className="space-y-1 text-center">
                                            <Palette className="mx-auto h-12 w-12 text-slate-400" />
                                            <div className="flex text-sm text-slate-600">
                                                <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">Subir archivo</span>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG o JPG hasta 5MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
                            GUARDAR CAMBIOS
                        </button>
                    </div>

                    {/* Ad Space Management */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="text-orange-500" size={20} />
                                <h3 className="font-semibold text-slate-800">Espacios Publicitarios</h3>
                            </div>

                            <p className="text-sm text-slate-500 mb-4">Configura banners que aparecerán en la landing page del evento para monetizar con tus patrocinadores.</p>

                            <div className="space-y-4">
                                <AdSlot active={true} merchant="Hotel San José" clicks={150} />
                                <AdSlot active={true} merchant="Joyas del Faro" clicks={89} />
                                <AdSlot active={false} merchant="Sin patrocinador" clicks={0} />
                            </div>

                            <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="flex gap-3">
                                    <Share2 className="text-orange-600 shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs font-bold text-orange-900 uppercase tracking-wider">Tip de Negocio</p>
                                        <p className="text-xs text-orange-800 mt-1">Ofrece a tus proveedores locales aparecer aquí a cambio de una comisión por cada evento.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function AdSlot({ active, merchant, clicks }: any) {
    return (
        <div className={`p-4 rounded-xl border ${active ? 'border-blue-100 bg-blue-50/50' : 'border-slate-100 bg-slate-50 grayscale italic opacity-60'}`}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-slate-800">{merchant}</p>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 uppercase font-bold text-slate-400">Slot 1</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">{clicks} Clicks registrados</span>
                <button className="text-blue-600 font-bold hover:underline">Configurar</button>
            </div>
        </div>
    );
}
