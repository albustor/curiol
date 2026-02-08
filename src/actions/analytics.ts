"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export type InteractionType =
    | "package_view"
    | "academy_read"
    | "link_click"
    | "search_query"
    | "session_start";

interface InteractionMetadata {
    packageId?: string;
    packageName?: string;
    articleId?: string;
    articleTitle?: string;
    platform?: string;
    query?: string;
    [key: string]: any;
}

/**
 * Logs a user interaction to Firestore for strategic analysis
 */
export async function logInteraction(type: InteractionType, metadata: InteractionMetadata = {}) {
    try {
        await addDoc(collection(db, "interactions"), {
            type,
            metadata,
            timestamp: Timestamp.now(),
            // Basic environment markers
            platform: typeof window !== 'undefined' ? 'web' : 'server',
        });
        return { success: true };
    } catch (error) {
        console.error("Error logging interaction:", error);
        return { success: false, error: String(error) };
    }
}
