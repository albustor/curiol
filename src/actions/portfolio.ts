"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, addDoc, serverTimestamp } from "firebase/firestore";

export interface PortfolioItem {
    categoria: string;
    subcategoria: string;
    url: string;
    titulo: string;
}

export async function getPortfolioData(): Promise<PortfolioItem[]> {
    try {
        const q = query(collection(db, "portfolio_albums"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const items: PortfolioItem[] = [];

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.photos && Array.isArray(data.photos)) {
                data.photos.forEach((photo: any) => {
                    items.push({
                        categoria: data.category || "General",
                        subcategoria: data.title || "",
                        url: photo.url,
                        titulo: data.title || ""
                    });
                });
            }
        });

        // Fallback or combine with CSV if needed? No, User wanted to sync with new Admin.
        return items;
    } catch (error) {
        console.error("Firestore Portfolio Fetch Error:", error);
        return [];
    }
}

export async function getHeroImages(): Promise<string[]> {
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4OuEDRXmfwRB51PGyTyz2D9cxb5IwXnvDrSiHtzh37iGZY1to7EB0O1rPyKcVVcSHqeHFb1I4glNZ/pub?gid=1480486138&output=csv";

    try {
        const response = await fetch(CSV_URL, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error("Error fetching hero images");
        }

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");

        const [_header, ...rows] = lines;

        return rows.map(row => {
            // Manejar comas dentro de comillas
            const matches = row.match(/(".*?"|[^",\s][^",]*|(?<=,)(?=,)|(?<=^)(?=,))/g);
            if (!matches) return null;

            // La URL suele ser la primera o única columna en esta hoja
            const url = matches[0].replace(/^"|"$/g, "").trim();
            return url.startsWith("http") ? url : null;
        }).filter(u => u !== null) as string[];
    } catch (error) {
        console.error("Hero Images Fetch Error:", error);
        return [];
    }
}
export async function migrateCsvToFirestore(): Promise<{ success: boolean; count: number }> {
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4OuEDRXmfwRB51PGyTyz2D9cxb5IwXnvDrSiHtzh37iGZY1to7EB0O1rPyKcVVcSHqeHFb1I4glNZ/pub?output=csv";

    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("Error fetching CSV");

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
        const [_header, ...rows] = lines;

        const albumsMap: Record<string, any> = {};

        rows.forEach(row => {
            const matches = row.match(/(".*?"|[^",\s][^",]*|(?<=,)(?=,)|(?<=^)(?=,))/g);
            if (!matches) return;

            const [categoria, subcategoria, url, titulo] = matches.map(val =>
                val.replace(/^"|"$/g, "").trim()
            );

            const albumKey = `${categoria}-${subcategoria}`;
            if (!albumsMap[albumKey]) {
                albumsMap[albumKey] = {
                    title: subcategoria || titulo || "Sin título",
                    category: categoria || "General",
                    createdAt: serverTimestamp(),
                    photos: []
                };
            }
            albumsMap[albumKey].photos.push({ url });
        });

        let count = 0;
        for (const key in albumsMap) {
            await addDoc(collection(db, "portfolio_albums"), albumsMap[key]);
            count++;
        }

        return { success: true, count };
    } catch (error) {
        console.error("Migration Error:", error);
        return { success: false, count: 0 };
    }
}
