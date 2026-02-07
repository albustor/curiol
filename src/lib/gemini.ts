import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates a helpful response for a client message using Gemini
 */
export async function generateAiChatResponse(clientMessage: string, channel: string) {
    if (!process.env.GEMINI_API_KEY) return "Lo siento, mi cerebro de IA no está configurado aún.";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `Eres un asistente experto de Curiol Studio, un estudio de fotografía y tecnología avanzada liderado por el Maestro Alberto Bustos.
        El cliente te contacta por ${channel}. 
        Responde de forma amable, premium y profesional. 
        Si preguntan por precios, invítales a visitar el 'Cotizador' en la web.
        Si quieren agendar, diles que pueden hacerlo en la sección 'Agenda'.
        
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
