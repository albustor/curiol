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
    } catch (error: any) {
        console.error("DEBUG - Gemini API B2B Error Details:", {
            message: error.message,
            stack: error.stack,
            status: error.status,
            code: error.code
        });

        let userMessage = "Error generando el contenido de marketing.";

        if (error.message?.includes("API key not valid")) {
            userMessage = "La llave de API (GEMINI_API_KEY) es inválida.";
        }

        return `${userMessage} (Detalle: ${error.message?.substring(0, 50)}...)`;
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
    } catch (error: any) {
        console.error("DEBUG - Gemini API Error Details:", {
            message: error.message,
            stack: error.stack,
            status: error.status,
            code: error.code
        });

        // Mensaje más descriptivo para el usuario
        let userMessage = "Lo siento, tuve un problema técnico con la conexión a la IA.";

        if (error.message?.includes("API key not valid")) {
            userMessage = "La llave de API (GEMINI_API_KEY) parece ser inválida. Por favor verifícala en Vercel.";
        } else if (error.message?.includes("User location is not supported")) {
            userMessage = "Lo siento, la API de Gemini no está disponible en la región donde está el servidor.";
        } else if (error.message?.includes("quota")) {
            userMessage = "Se ha superado el límite de uso gratuito de la IA. Por favor espera un minuto.";
        }

        return `${userMessage} (Detalle: ${error.message?.substring(0, 50)}...)`;
    }
}
