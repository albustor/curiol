"use client";

import { Cormorant_Garamond, Inter, Cinzel, Lato, Great_Vibes } from "next/font/google";
import "./globals.css";
import { FloatingGiftCard } from "@/components/FloatingGiftCard";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-cormorant",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const cinzel = Cinzel({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-cinzel",
});

const lato = Lato({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-lato",
});

const greatVibes = Great_Vibes({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-great-vibes",
});

import { AiAssistant } from "@/components/AiAssistant";

export function RootClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <body
            className={`${cormorant.variable} ${inter.variable} ${cinzel.variable} ${lato.variable} ${greatVibes.variable} font-sans antialiased bg-tech-950 selection:bg-curiol-500 selection:text-white`}
        >
            {children}
            <FloatingGiftCard />
            <AiAssistant />
        </body>
    );
}
