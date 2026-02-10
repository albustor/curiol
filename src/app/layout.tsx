import type { Metadata } from "next";
import { RootClientLayout } from "./RootClientLayout";

export const metadata: Metadata = {
  title: "Curiol Studio | Fotografía Fine Art • Diseño Web • IA",
  description: "Curiol Studio: Fusionando arte y tecnología. Especialistas en fotografía premium, diseño de experiencias web y soluciones estratégicas con Inteligencia Artificial.",
  metadataBase: new URL("https://curiol.studio"),
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
