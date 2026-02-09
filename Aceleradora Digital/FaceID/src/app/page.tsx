import React from 'react';
import AdminLayout from './admin-layout';
import { Camera, MousePointer2, TrendingUp, Link as LinkIcon } from 'lucide-react';

export default function DashboardPage() {
    return (
        <AdminLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Eventos" value="12" icon={Camera} color="blue" />
                <StatCard title="Clicks en Ads" value="1,240" icon={MousePointer2} color="green" />
                <StatCard title="Match Rate IA" value="89%" icon={TrendingUp} color="purple" />
                <StatCard title="Créditos API" value="4.5k" icon={LinkIcon} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Events List */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">Eventos Recientes</h3>
                            <button className="text-sm text-blue-600 font-medium hover:underline">Ver todos</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <EventRow name="Boda Real - San José" date="20 Feb 2026" photos="2,400" status="Active" />
                            <EventRow name="Festival de las Flores" date="15 Feb 2026" photos="8,100" status="Active" />
                            <EventRow name="XV Años Sofía" date="10 Feb 2026" photos="1,200" status="Completed" />
                        </div>
                    </section>

                    {/* Quick Action: Generate Link */}
                    <section className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl text-white shadow-lg shadow-blue-100">
                        <h3 className="text-xl font-bold mb-2">Generador de Enlaces de Acceso</h3>
                        <p className="text-blue-100 text-sm mb-6 max-w-md">Crea una landing page personalizada para tu próximo evento con un solo click. Podrás compartirla por QR o WhatsApp.</p>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Nombre del evento..."
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                                GENERAR LANDING
                            </button>
                        </div>
                    </section>
                </div>

                {/* Sidebar Ads/Merchant Preview */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-4">Comercio Afiliado (Ads)</h3>
                        <div className="space-y-4">
                            <AdItem name="Floristería El Retiro" active={true} />
                            <AdItem name="Catering Deluxe" active={true} />
                            <AdItem name="Música & Luz" active={false} />
                        </div>
                        <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl text-sm font-medium hover:border-blue-200 hover:text-blue-500 transition-all">
                            + Agregar Comercio
                        </button>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
    );
}

function EventRow({ name, date, photos, status }: any) {
    return (
        <div className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer">
            <div>
                <h4 className="font-medium text-slate-800">{name}</h4>
                <p className="text-xs text-slate-500">{date} • {photos} Fotos</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                {status}
            </span>
        </div>
    );
}

function AdItem({ name, active }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <MousePointer2 size={14} className="text-slate-400" />
                </div>
                <span className="text-sm text-slate-700 truncate max-w-[120px]">{name}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-slate-300'}`} />
        </div>
    );
}
