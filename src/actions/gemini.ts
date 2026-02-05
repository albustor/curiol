"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializamos el objeto fuera pero verificamos la llave dentro para mayor robustez en Vercel
function getModel() {
    const API_KEY = process.env.GEMINI_API_KEY || "";
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY_MISSING");
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export async function generateB2BCopy(businessInfo: string) {
    try {
        const model = getModel();
        const prompt = `
        Actúa como un Copywriter experto en marketing digital para Curiol Studio. 
        Un cliente desea crear su sitio web. Información del negocio: "${businessInfo}".
        Genera un texto persuasivo para su página de inicio que incluya:
        1. Un Título impactante.
        2. Un Subtítulo que resalte su valor único en Guanacaste.
        3. Tres beneficios clave del negocio.
        Usa un tono profesional, elegante y moderno (estética Phygital).
      `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error: any) {
        console.error("DEBUG - Gemini B2B Error:", error);
        if (error.message === "GEMINI_API_KEY_MISSING") {
            return "Error: La llave de API no está configurada en Vercel.";
        }
        return `Error generando el contenido: ${error.message}`;
    }
}

export async function getAiAssistantResponse(message: string, context: any) {
    try {
        const model = getModel();
        const prompt = `
        Eres el asistente virtual de Curiol Studio.
        Contexto actual del cliente: ${JSON.stringify(context)}.
        Mensaje del cliente: "${message}".
        Responde de forma elegante, servicial y concisa.
        Recuerda que Curiol Studio ofrece experiencias fotográficas (Aventura Mágica, Esencia Familiar, Legado Anual) 
        y soluciones web (Landing Express ₡85k, Negocio Pro ₡145k).
        Utiliza el concepto de "Digitalización Humana" en tus respuestas.
      `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error: any) {
        console.error("DEBUG - Gemini Assistant Error:", error);

        let userMessage = "Lo siento, tuve un problema técnico con la conexión a la IA.";

        if (error.message === "GEMINI_API_KEY_MISSING") {
            userMessage = "La IA no está configurada. Falta la GEMINI_API_KEY en Vercel.";
        } else if (error.message?.includes("fetch")) {
            userMessage = "Error de conexión con los servidores de Google.";
        } else if (error.message?.includes("API key not valid")) {
            userMessage = "La llave de API configurada no es válida.";
        }

        return `${userMessage} (Detalle técnico: ${error.message})`;
    }
}
