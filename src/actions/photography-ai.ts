"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, orderBy, limit, getDocs, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface PhotographyInsight {
    id?: string;
    albumId: string;
    albumName: string;
    technicalScore: number; // 0-100
    creativityScore: number; // 0-100
    positives: string[];
    negatives: string[];
    maestroAdvice: string;
    detectedPatterns: string[];
    createdAt: any;
}

/**
 * Analyzes an album's compositions and technical aspects using AI
 */
export async function analyzeAlbumComposition(albumId: string) {
    if (!process.env.GEMINI_API_KEY) throw new Error("API Key missing");

    try {
        // 1. Fetch Album Data
        const albumDoc = await getDoc(doc(db, "albums", albumId));
        if (!albumDoc.exists()) throw new Error("Album not found");
        const album = albumDoc.data();

        // 2. Prepare AI Analysis
        // We'll send the URLs and ask Gemini to evaluate based on Curiol Standards
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageUrls = album.images?.slice(0, 4).map((img: any) => img.original).join(", ");

        const prompt = `
        Actúa como el Maestro Alberto Bustos, fotógrafo de élite. Analiza este conjunto de imágenes del álbum "${album.name}":
        URLs: ${imageUrls}

        Criterios de evaluación (Curiol Studio Standards):
        1. Técnico: ¿Cumplen con el estándar de 1350px y nitidez?
        2. Positivo: Identifica uso magistral de Regla de Tercios, Proporción Áurea, Líneas Guía o Emoción de Legado.
        3. Negativo: Detecta encuadres flojos, falta de aire, o inconsistencias técnicas.

        Devuelve un análisis en formato JSON:
        {
            "technicalScore": 0-100,
            "creativityScore": 0-100,
            "positives": ["punto positivo 1", "..."],
            "negatives": ["punto de mejora 1", "..."],
            "detectedPatterns": ["Patrón 1", "..."],
            "maestroAdvice": "Consejo breve y elegante del Maestro"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

        // 3. Save Insight
        const insightData: PhotographyInsight = {
            albumId,
            albumName: album.name,
            technicalScore: analysis.technicalScore || 0,
            creativityScore: analysis.creativityScore || 0,
            positives: analysis.positives || [],
            negatives: analysis.negatives || [],
            maestroAdvice: analysis.maestroAdvice || "Sigue capturando el alma del momento.",
            detectedPatterns: analysis.detectedPatterns || [],
            createdAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, "photography_insights"), insightData);

        // Update album with latest insight ID (optional)
        await updateDoc(doc(db, "albums", albumId), {
            latestInsightId: docRef.id
        });

        return { success: true, id: docRef.id };

    } catch (error) {
        console.error("Error analyzing photography:", error);
        return { success: false, error: String(error) };
    }
}

/**
 * Gets the latest insights for the admin dashboard
 */
export async function getPhotographyDashboardData(count = 1) {
    try {
        const q = query(
            collection(db, "photography_insights"),
            orderBy("createdAt", "desc"),
            limit(count)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString()
            };
        }) as PhotographyInsight[];
    } catch (error) {
        console.error("Error fetching photography insights:", error);
        return [];
    }
}
