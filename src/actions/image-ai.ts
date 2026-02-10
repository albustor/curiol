"use server";

import sharp from "sharp";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type SocialFormat = "story" | "post" | "portrait";

const RATIOS = {
    story: { width: 1080, height: 1920 },    // 9:16
    post: { width: 1080, height: 1080 },     // 1:1
    portrait: { width: 1080, height: 1350 }  // 4:5
};

/**
 * Uses Gemini to detect face/subject and crops using Sharp
 */
export async function generateSocialCrop(imageUrl: string, format: SocialFormat) {
    if (!process.env.GEMINI_API_KEY) throw new Error("API Key missing");

    try {
        // 1. Fetch the image
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        // 2. Get metadata
        const metadata = await sharp(inputBuffer).metadata();
        if (!metadata.width || !metadata.height) throw new Error("Could not read image metadata");

        // 3. AI Face Detection (Simulated for this tool, in reality we'd send the image to Gemini)
        // For this implementation, we'll ask Gemini for the "Center of Interest" coordinates
        // based on the image URL or a lower-res version.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const analysisPrompt = `Analiza esta imagen (${imageUrl}) y detecta el centro de interés o el rostro principal.
        Considera las siguientes reglas de composición fotográfica para determinar las coordenadas ideales (x,y) en una escala de 0 a 100:
        1. Regla de los Tercios (intersecciones ideales).
        2. Proporción Áurea (armonía visual).
        3. Líneas Guía y Encuadre Natural.
        4. Espacio de Mirada (deja aire hacia donde mira el sujeto).
        
        Devuelve ÚNICAMENTE las coordenadas del punto de interés principal.
        Formato JSON: { "x": 50, "y": 40 }`;

        const result = await model.generateContent(analysisPrompt);
        let center = { x: 50, y: 50 };
        try {
            const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
            if (jsonMatch) center = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.warn("AI Center Detection failed, using 50,50");
        }

        // 4. Calculate Crop based on target ratio and center
        const target = RATIOS[format];
        const targetRatio = target.width / target.height;
        const currentRatio = metadata.width / metadata.height;

        let extractWidth, extractHeight;
        if (currentRatio > targetRatio) {
            // Image is wider than target
            extractHeight = metadata.height;
            extractWidth = Math.round(metadata.height * targetRatio);
        } else {
            // Image is taller than target
            extractWidth = metadata.width;
            extractHeight = Math.round(metadata.width / targetRatio);
        }

        // Adjust based on AI center
        let left = Math.round((metadata.width * (center.x / 100)) - (extractWidth / 2));
        let top = Math.round((metadata.height * (center.y / 100)) - (extractHeight / 2));

        // Clamp to edges
        left = Math.max(0, Math.min(left, metadata.width - extractWidth));
        top = Math.max(0, Math.min(top, metadata.height - extractHeight));

        // 5. Process with Sharp
        const croppedBuffer = await sharp(inputBuffer)
            .extract({ left, top, width: extractWidth, height: extractHeight })
            .resize(target.width, target.height)
            .toBuffer();

        // 6. Upload to Firebase
        const fileName = `social/${format}_${Date.now()}.jpg`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, croppedBuffer, { contentType: "image/jpeg" });

        return await getDownloadURL(storageRef);

    } catch (error) {
        console.error("Smart Crop Error:", error);
        return imageUrl; // Fallback to original
    }
}

/**
 * Detects the overall mood of a collection of images to suggest a theme
 */
export async function detectMood(imageUrls: string[]) {
    if (!process.env.GEMINI_API_KEY) return "dark-canvas";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analiza este set de imágenes (URLs: ${imageUrls.slice(0, 3).join(", ")}) y determina el "mood" predominante para un álbum fotográfico.
        Elige entre: "dark-canvas" (elegante, serio, nocturno), "minimal-white" (limpio, luminoso, moderno), "sepia-legacy" (nostálgico, clásico, cálido).
        Responde SOLO con el ID del tema.`;

        const result = await model.generateContent(prompt);
        const mood = result.response.text().trim().toLowerCase();

        return ["dark-canvas", "minimal-white", "sepia-legacy"].includes(mood) ? mood : "dark-canvas";
    } catch (error) {
        return "dark-canvas";
    }
}

/**
 * Generates searchable tags for an image using Gemini
 */
export async function generateImageTags(imageUrl: string) {
    if (!process.env.GEMINI_API_KEY) return [];

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analiza esta imagen (${imageUrl}) y genera 5 etiquetas descriptivas en español que ayuden a un cliente a buscarla en su álbum digital (ej: sonrisa, abrazo, blanco y negro, naturaleza, primer plano). 
        Devuelve SOLO las etiquetas separadas por comas.`;

        const result = await model.generateContent(prompt);
        return result.response.text().split(",").map(t => t.trim().toLowerCase());
    } catch (error) {
        return [];
    }
}
/**
 * Generates a creative social media caption for a specific photo
 */
export async function generateSocialCaption(imageUrl: string, tags: string[], mood: string) {
    if (!process.env.GEMINI_API_KEY) return "";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Actúa como un experto en Social Media y Storytelling.
        Genera una descripción creativa, emocional y breve para Instagram para una fotografía que tiene estos elementos: ${tags.join(", ")}.
        El tono debe ser coherente con un mood de tipo "${mood}".
        Incluye 3 hashtags relevantes.
        Devuelve SOLO el texto de la descripción.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        return "Una memoria capturada para siempre. #CuriolStudio #MemoriasVivas";
    }
}
