import type { Metadata } from "next";
import { RootClientLayout } from "./RootClientLayout";

export const metadata: Metadata = {
  title: "Curiol Studio | Fotografía • Tecnología • Legado",
  description: "Fusión de raíz artesanal con tecnología de vanguardia. Fotografía Fine Art, Realidad Aumentada y Soluciones Web en Guanacaste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <RootClientLayout>{children}</RootClientLayout>
    </html>
  );
}
