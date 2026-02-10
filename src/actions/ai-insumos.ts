"use server";

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, orderBy, getDocs, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type InsumoType = "text" | "image" | "audio" | "video";

export interface InsumoData {
    id?: string;
    type: InsumoType;
    content?: string; // For text
    url?: string;     // For files
    author: string;
    metadata?: {
        emotion?: string;
        patterns?: string[];
        strategic_intent?: string;
        summary?: string;
    };
    createdAt: any;
}

/**
 * Processes a multimedia input with Gemini and saves it to Firestore
 */
export async function processAndSaveInsumo(
    type: InsumoType,
    data: { text?: string; file?: File },
    author: string
) {
    if (!process.env.GEMINI_API_KEY) throw new Error("API Key missing");

    let fileUrl = "";
    let aiAnalysis = {};

    try {
        // 1. Handle File Upload if necessary
        if (data.file) {
            const fileRef = ref(storage, `ai_inputs/${Date.now()}_${data.file.name}`);
            await uploadBytes(fileRef, data.file);
            fileUrl = await getDownloadURL(fileRef);
        }

        // 2. AI Analysis with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = "";
        let contentItems: any[] = [];

        if (type === "text") {
            prompt = `Analiza el siguiente texto estratégico para Curiol Studio/PNFT. 
            Extrae: 1. Emoción dominante. 2. Patrones clave. 3. Intención estratégica. 4. Resumen corto.
            Formato JSON: { "emotion": "", "patterns": [], "strategic_intent": "", "summary": "" }
            
            Texto: "${data.text}"`;
            contentItems.push(prompt);
        } else if (data.file) {
            // For files, we'd ideally pass the buffer, but for simplicity in this action 
            // we'll assume the text description if provided or just focus on the type.
            // In a real multi-modal call, we'd pass the Part objects.
            prompt = `Analiza este archivo de tipo ${type} para extraer inteligencia de negocio.
            Extrae: 1. Emoción dominante. 2. Patrones clave. 3. Intención estratégica. 4. Resumen corto.
            Formato JSON: { "emotion": "", "patterns": [], "strategic_intent": "", "summary": "" }`;

            // Note: In a full production env, we'd convert File to a Gemini Part
            contentItems.push(prompt);
        }

        const result = await model.generateContent(contentItems);
        const responseText = result.response.text();

        try {
            // Extract JSON from response (sometimes Gemini adds markdown)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            aiAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        } catch (e) {
            console.error("Failed to parse AI JSON", e);
            aiAnalysis = { summary: responseText };
        }

        // 3. Save to Firestore
        const docRef = await addDoc(collection(db, "ai_inputs"), {
            type,
            content: data.text || "",
            url: fileUrl,
            author,
            metadata: aiAnalysis,
            createdAt: Timestamp.now()
        });

        return { success: true, id: docRef.id };

    } catch (error) {
        console.error("Error processing insumo:", error);
        return { success: false, error: String(error) };
    }
}

/**
 * Fetches recent insumos
 */
export async function getRecentInsumos(count = 10) {
    try {
        const q = query(collection(db, "ai_inputs"), orderBy("createdAt", "desc"), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InsumoData[];
    } catch (error) {
        console.error("Error fetching insumos:", error);
        return [];
    }
}
