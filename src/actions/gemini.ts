"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateB2BCopy(businessInfo: string) {
    if (!API_KEY) {
        console.error("GEMINI_API_KEY is not defined in environment variables");
        return "Error: La configuración de IA no está completa.";
    }

    const prompt = `
    Actúa como un Copywriter experto en marketing digital para Curiol Studio. 
    Un cliente desea crear su sitio web. Información del negocio: "${businessInfo}".
    Genera un texto persuasivo para su página de inicio que incluya:
    1. Un Título impactante.
    2. Un Subtítulo que resalte su valor único en Guanacaste.
    3. Tres beneficios clave del negocio.
    Usa un tono profesional, elegante y moderno (estética Phygital).
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generando el contenido. Por favor intenta de nuevo.";
    }
}

export async function getAiAssistantResponse(message: string, context: any) {
    if (!API_KEY) {
        console.error("GEMINI_API_KEY is not defined in environment variables");
        return "Lo siento, la IA no está configurada en el servidor. Por favor revisa las variables de entorno en Vercel.";
    }

    const prompt = `
    Eres el asistente virtual de Curiol Studio.
    Contexto actual del cliente: ${JSON.stringify(context)}.
    Mensaje del cliente: "${message}".
    Responde de forma elegante, servicial y concisa.
    Recuerda que Curiol Studio ofrece experiencias fotográficas (Aventura Mágica, Esencia Familiar, Legado Anual) 
    y soluciones web (Landing Express ₡85k, Negocio Pro ₡145k).
    Utiliza el concepto de "Digitalización Humana" en tus respuestas.
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Lo siento, tuve un problema técnico con la conexión a la IA. ¿En qué más puedo ayudarte?";
    }
}
