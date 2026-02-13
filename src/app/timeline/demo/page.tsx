"use client";

import { TimelineView } from "@/components/TimelineView";
import { EvolutiveTimeline } from "@/types/timeline";

const mockTimeline: EvolutiveTimeline = {
    id: "demo-legacy-001",
    clientId: "alberto-bustos",
    clientName: "Familia Bustos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: "classic",
    status: "active",
    events: [
        {
            id: "event-1",
            date: "2023-05-15",
            title: "Primera Sesión: Aventura Mágica",
            description: "El inicio de un legado. Capturamos la esencia de la infancia con un toque de magia y tecnología.",
            mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
            mediaType: "image",
            location: "Guanacaste, CR",
            packageId: "aventura"
        },
        {
            id: "event-2",
            date: "2024-02-10",
            title: "Recuerdos Eternos: Retrato Fine Art",
            description: "Una evolución hacia la sofisticación. El retrato se convierte en arte tangible para las próximas generaciones.",
            mediaUrl: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2070",
            mediaType: "image",
            location: "Estudio Curiol",
            packageId: "recuerdos"
        },
        {
            id: "event-3",
            date: "2025-12-20",
            title: "Legado Familiar: Video de Proyección",
            description: "Integración total. La línea de tiempo cobra vida a través de un video summary exportado a YouTube.",
            mediaUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070",
            mediaType: "video",
            location: "Global",
            packageId: "legado"
        }
    ]
};

export default function TimelineDemoPage() {
    return <TimelineView timeline={mockTimeline} />;
}
