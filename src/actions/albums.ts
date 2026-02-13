"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

export interface AlbumMetadata {
    id?: string;
    clientId: string;
    clientName: string;
    clientPhone: string;
    name: string;
    theme: string;
    images: {
        original: string;
        captions?: string;
        tags?: string[];
        category?: "highlight" | "social" | "bw" | "general";
        social?: {
            story?: string;
            post?: string;
            portrait?: string;
        }
    }[];
    favorites?: string[]; // Array of image URLs or indices
    clientComments?: { imageUrl: string; text: string; createdAt: any }[];
    mood?: string;
    originalSong?: {
        url?: string;
        title?: string;
        price?: number;
        descriptionUrl?: string;
    };
    status: "active" | "expired";
    warningSent: boolean;
    expiresAt: any;
    createdAt: any;
}

/**
 * Saves a new album and sets expiration
 */
export async function createAlbum(data: Partial<AlbumMetadata>) {
    try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 60);

        const albumRef = await addDoc(collection(db, "albums"), {
            ...data,
            status: "active",
            warningSent: false,
            createdAt: Timestamp.now(),
            expiresAt: Timestamp.fromDate(expiresAt)
        });

        return { success: true, id: albumRef.id };
    } catch (error) {
        console.error("Error creating album:", error);
        return { success: false, error: String(error) };
    }
}

/**
 * Fetches an album by ID
 */
export async function getAlbum(id: string) {
    try {
        const albumDoc = await getDoc(doc(db, "albums", id));
        if (!albumDoc.exists()) return null;
        const data = albumDoc.data();
        if (!data) return null;

        return {
            ...data,
            id: albumDoc.id,
            createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            expiresAt: data.expiresAt?.toDate?.() ? data.expiresAt.toDate().toISOString() : null,
        } as AlbumMetadata;
    } catch (error) {
        console.error("Error fetching album:", error);
        return null;
    }
}
/**
 * Toggles a favorite image for an album
 */
export async function toggleFavorite(albumId: string, imageUrl: string) {
    try {
        const docRef = doc(db, "albums", albumId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return { success: false };

        const data = snap.data() as AlbumMetadata;
        const favorites = data.favorites || [];

        let newFavorites;
        if (favorites.includes(imageUrl)) {
            newFavorites = favorites.filter(url => url !== imageUrl);
        } else {
            newFavorites = [...favorites, imageUrl];
        }

        await updateDoc(docRef, { favorites: newFavorites });
        return { success: true, favorites: newFavorites };
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { success: false };
    }
}
