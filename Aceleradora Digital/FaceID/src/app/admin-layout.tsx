import React from 'react';
import { LayoutDashboard, Users, Megaphone, Link as LinkIcon, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900 italic">FaceID<span className="text-blue-600">cr</span></h1>
          <p className="text-xs text-slate-500">Panel de Administración</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Users} label="Eventos" />
          <NavItem icon={Megaphone} label="Publicidad" />
          <NavItem icon={LinkIcon} label="Mis Enlaces" />
          <NavItem icon={Settings} label="Branding" />
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Bienvenido, Maestro</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Licencia Activa</span>
            <div className="w-10 h-10 bg-slate-200 rounded-full border border-white shadow-sm" />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer ${active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
      }`}>
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
