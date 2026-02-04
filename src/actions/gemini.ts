"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateB2BCopy(businessInfo: string) {
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
        return "Lo siento, tuve un problema técnico. ¿En qué más puedo ayudarte?";
    }
}
