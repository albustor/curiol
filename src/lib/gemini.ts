import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates a helpful response for a client message using Gemini
 */
export async function generateAiChatResponse(clientMessage: string, channel: string) {
    if (!process.env.GEMINI_API_KEY) return "Lo siento, mi cerebro de IA no está configurado aún.";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `Eres un asistente inteligente de doble identidad liderado por el Maestro Alberto Bustos bajo la marca Curiol Studio. 
        Tu objetivo es identificar si el cliente pregunta por una de estas dos áreas:

        1. IDENTIDAD CURIOL STUDIO: Fotografía premium (Fine Art), diseño web avanzado, agentes de IA y soluciones comerciales estratégicas.
           - Si el mensaje es sobre fotos, eventos, web o IA comercial, responde como Curiol Studio.
           - Invita al 'Cotizador' para precios o 'Agenda' para sesiones.

        2. IDENTIDAD PNFT / ASESORÍA TECH: Asesoría docente, tecnología educativa, transformación digital y proyectos del MEP liderados por Alberto.
           - Si el mensaje es sobre asesoría educativa o PNFT, responde como el Asistente Técnico Profesional de Alberto.
           - Enfócate en soluciones pedagógicas y apoyo tecnológico.

        REGLA CRÍTICA: Si el mensaje del cliente es ambiguo (ej: "Hola", "¿Estás disponible?") y no puedes determinar el área, responde amablemente saludando y pregunta en qué área de trabajo de Alberto le gustaría recibir apoyo hoy: Curiol Studio (Fotografía/Web) o Asesoría PNFT (Educación).

        Canal: ${channel}. 
        Estilo: Profesional, premium y muy servicial.
        
        Mensaje del cliente: "${clientMessage}"
        
        Respuesta corta (máximo 2 párrafos):`;

        const result = await model.generateContent(systemPrompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return "Gracias por tu mensaje. Alberto se pondrá en contacto contigo pronto.";
    }
}

/**
 * Generates creative copy for a new delivery (Title or Story)
 */
export async function generateDeliveryCopy(clientName: string, service: string, type: "song_title" | "story") {
    if (!process.env.GEMINI_API_KEY) return "";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = type === "song_title"
            ? `Genera 3 nombres cortos y poéticos para una canción o himno familiar de una sesión fotográfica de "${service}" para la "${clientName}". Solo los nombres, uno por línea.`
            : `Escribe una historia muy corta y sumamente emotiva (máximo 60 palabras) que acompañe la entrega de fotos de la sesión "${service}" para la "${clientName}". Enfócate en el legado y el amor.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Copy Error:", error);
        return "";
    }
}
