import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Curiol Studio | Fotografía • Tecnología • Legado",
  description: "Fusión de raíz artesanal con tecnología de vanguardia. Fotografía Fine Art, Realidad Aumentada y Soluciones Web en Guanacaste.",
};

import { AiAssistant } from "@/components/AiAssistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased selection:bg-curiol-500 selection:text-white`}
      >
        {children}
        <AiAssistant />
      </body>
    </html>
  );
}
