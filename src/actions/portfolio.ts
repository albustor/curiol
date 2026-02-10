"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, addDoc, serverTimestamp } from "firebase/firestore";

export interface PortfolioItem {
    id?: string;
    categoria: string;
    subcategoria: string;
    url: string;
    titulo: string;
    slug?: string;
}

export interface PortfolioAlbum {
    id: string;
    title: string;
    description: string;
    category: string;
    coverUrl?: string;
    photos: { url: string; id: string }[];
    createdAt: any;
    eventDate?: string;
    slug?: string;
    password?: string;
    settings?: {
        allowLikes: boolean;
        allowDownloads: boolean;
        allowSharing: boolean;
    };
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
                        id: doc.id,
                        categoria: data.category || "General",
                        subcategoria: data.title || "",
                        url: photo.url,
                        titulo: data.title || "",
                        slug: data.slug || doc.id
                    });
                });
            }
        });

        return items;
    } catch (error) {
        console.error("Firestore Portfolio Fetch Error:", error);
        return [];
    }
}

export async function getAlbums(): Promise<PortfolioAlbum[]> {
    try {
        const q = query(collection(db, "portfolio_albums"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "Sin título",
                description: data.description || "",
                category: data.category || "General",
                coverUrl: data.coverUrl || "",
                photos: data.photos || [],
                createdAt: data.createdAt,
                eventDate: data.eventDate || "",
                slug: data.slug || doc.id,
                password: data.password || "",
                settings: data.settings || {
                    allowLikes: true,
                    allowDownloads: true,
                    allowSharing: true
                }
            };
        }) as PortfolioAlbum[];
    } catch (error) {
        console.error("Firestore Albums Fetch Error:", error);
        return [];
    }
}

export async function getAlbumBySlug(slug: string): Promise<PortfolioAlbum | null> {
    try {
        const q = query(collection(db, "portfolio_albums"));
        const snapshot = await getDocs(q);

        const doc = snapshot.docs.find(d => d.data().slug === slug || d.id === slug);

        if (!doc) return null;
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title || "Sin título",
            description: data.description || "",
            category: data.category || "General",
            coverUrl: data.coverUrl || "",
            photos: data.photos || [],
            createdAt: data.createdAt,
            eventDate: data.eventDate || "",
            slug: data.slug || doc.id,
            password: data.password || "",
            settings: data.settings || {
                allowLikes: true,
                allowDownloads: true,
                allowSharing: true
            }
        } as PortfolioAlbum;
    } catch (error) {
        console.error("Firestore Album Fetch Error:", error);
        return null;
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
        console.log("Iniciando migración desde:", CSV_URL);
        const response = await fetch(CSV_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);

        if (lines.length < 2) {
            console.warn("CSV está vacío o solo contiene cabecera");
            return { success: true, count: 0 };
        }

        const [_header, ...rows] = lines;
        const albumsMap: Record<string, any> = {};

        rows.forEach((row, index) => {
            // Regex para manejar comas y comillas correctamente
            const matches = row.match(/(".*?"|[^",\s][^",]*|(?<=,)(?=,)|(?<=^)(?=,))/g);
            if (!matches) return;

            const [categoria, subcategoria, url, titulo] = matches.map(val =>
                val ? val.replace(/^"|"$/g, "").trim() : ""
            );

            if (!url || !url.startsWith("http")) return;

            const albumName = subcategoria || categoria || "Sin Categoría";
            // Limpiar ID de caracteres raros
            const albumId = albumName.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            if (!albumsMap[albumId]) {
                albumsMap[albumId] = {
                    title: albumName,
                    category: categoria || "General",
                    coverUrl: url,
                    photos: [],
                    createdAt: serverTimestamp(),
                    slug: albumId,
                    description: `Galería de ${albumName}`,
                    settings: {
                        allowLikes: true,
                        allowDownloads: true,
                        allowSharing: true
                    }
                };
            }

            albumsMap[albumId].photos.push({
                id: `p-${index}-${Math.random().toString(36).substr(2, 5)}`,
                url: url,
                title: titulo || albumName
            });
        });

        const albumKeys = Object.keys(albumsMap);
        console.log(`Se detectaron ${albumKeys.length} álbumes para migrar.`);

        for (const key of albumKeys) {
            await addDoc(collection(db, "portfolio_albums"), albumsMap[key]);
        }

        return { success: true, count: albumKeys.length };
    } catch (error) {
        console.error("Critical Migration Error:", error);
        return { success: false, count: 0 };
    }
}
