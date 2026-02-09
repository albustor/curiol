import React from 'react';
import './globals.css';

export const metadata = {
    title: 'FaceIDcr | Gestión Intuitiva de Eventos',
    description: 'Tecnología de reconocimiento facial para eventos masivos.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className="antialiased selection:bg-blue-100 selection:text-blue-900">
                {children}
            </body>
        </html>
    )
}
