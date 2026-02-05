"use client";

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

export function RootClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <body
            className={`${cormorant.variable} ${inter.variable} antialiased selection:bg-curiol-500 selection:text-white`}
        >
            {children}
        </body>
    );
}
