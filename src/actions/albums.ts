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
        social?: {
            story?: string;
            post?: string;
            portrait?: string;
        }
    }[];
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
        return { id: albumDoc.id, ...albumDoc.data() } as AlbumMetadata;
    } catch (error) {
        console.error("Error fetching album:", error);
        return null;
    }
}
