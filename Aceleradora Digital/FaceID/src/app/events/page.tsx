import React from 'react';
import AdminLayout from '../admin-layout';
import { Search, Plus, Filter, MoreVertical, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';

export default function EventsPage() {
    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gestión de Eventos</h2>
                    <p className="text-slate-500">Administra tus galerías inteligentes y el alcance de FaceID.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={20} />
                    NUEVO EVENTO
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Buscar evento por nombre o fecha..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 flex items-center gap-2 hover:bg-slate-50">
                    <Filter size={18} />
                    Filtros
                </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <EventCard
                    title="Boda Real - San José"
                    location="Hotel Intercontinental"
                    date="20 de Febrero, 2026"
                    photos="2,450"
                    active={true}
                />
                <EventCard
                    title="Festival de las Flores"
                    location="Parque Central"
                    date="15 de Febrero, 2026"
                    photos="8,100"
                    active={true}
                />
                <EventCard
                    title="XV Años Sofía"
                    location="Salón de Eventos El Faro"
                    date="10 de Febrero, 2026"
                    photos="1,200"
                    active={false}
                />
            </div>
        </AdminLayout>
    );
}

function EventCard({ title, location, date, photos, active }: any) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                        <ImageIcon size={20} />
                    </div>
                    <button className="p-1 hover:bg-slate-50 rounded-md text-slate-400">
                        <MoreVertical size={18} />
                    </button>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-4">{title}</h3>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={14} />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={14} />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <ImageIcon size={14} />
                        <span className="font-medium text-slate-700">{photos} Fotos indexadas</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${active ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                    {active ? 'PÚBLICO: faceid.cr/boda-luis' : 'EVENTO FINALIZADO'}
                </span>
                <button className="text-xs font-bold text-blue-600 hover:underline">Gestionar</button>
            </div>
        </div>
    );
}
