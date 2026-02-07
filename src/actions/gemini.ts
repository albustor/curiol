"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicialización robusta para Vercel
function getModel() {
    const API_KEY = process.env.GEMINI_API_KEY || "";
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY_MISSING");
    }

    // Usamos el SDK con la versión estable v1 y el modelo gemini-2.5-flash (Estándar en 2026)
    const genAI = new GoogleGenerativeAI(API_KEY);
    return genAI.getGenerativeModel(
        { model: "gemini-2.5-flash" },
        { apiVersion: "v1" }
    );
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
        Recuerda que:
        - Curiol ofrece experiencias fotográficas y soluciones web (Landing ₡85k, Negocio ₡145k).
        - La AGENDA funciona solo SÁBADOS y DOMINGOS.
        - RESERVA: Requiere depósito del 20% para asegurar fecha y activar pre-producción. Sin comprobante no hay registro.
        - RECORDATORIOS: El sistema envía avisos automáticos al cliente 4 días, 2 días y 8 horas antes de la sesión.
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
        } else if (error.message?.includes("not found")) {
            userMessage = "El modelo de IA solicitado no se encuentra o no es compatible.";
        }

        return `${userMessage} (Detalle técnico: ${error.message})`;
    }
}
