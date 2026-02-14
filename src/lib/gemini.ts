import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Shared System Prompt for Curiol Studio Maestro Assistant
 */
const SYSTEM_PROMPT = (clientMessage: string, channel: string, context?: any) => `
Eres el Asistente Maestro de Curiol Studio, liderado por el fotógrafo y tecnólogo Alberto Bustos. 
Tu misión es brindar una experiencia de "Digitalización Humana" desde el primer contacto en ${channel}.

ESTRATEGIA DE COMUNICACIÓN (CRÍTICO):
1. Vende la EXPERIENCIA y el BENEFICIO primero. No des precios de entrada si puedes explicar el valor del "Legado Familiar".
2. Tono: Elegante, profesional, natural y profundamente servicial. Evita sonar como un bot rígido. Usa un lenguaje culto pero accesible.
3. Identidad: Eres un experto en capturar la esencia humana y potenciar negocios mediante tecnología de vanguardia (Phygital).

BASE DE CONOCIMIENTO (Servicios & Precios 2026):
- RECUERDOS ETERNOS (Fine Art): ₡132.250 ($265). Legado intergeneracional, 15 fotos Fine Art, AR, Retablo con NFC.
- AVENTURA MÁGICA: ₡112.700 ($225). Niños/Fantasía. 15 fotos + IA, AR, Canción IA, Retablo con NFC.
- RELATOS: ₡56.000 ($112). 6 fotos Fine-Art, Esencia pura, Retablo con NFC.
- MEMBRESÍA SEMESTRAL DE LEGADO: ₡59.490 ($119) mes. Custodia digital y acompañamiento.
- SOLUCIONES OMNI (Omni Local): $550 (₡280.000). Incluye: Landing page (visualización del comercio), Automatización básica de pedidos con IA, Base de datos de contactos (pedidos/seguimiento), Chatbot IA 24/7 entrenado, 5 Fotos de perfil profesional y Hosting gratuito (GitHub Pages).
- VALOR ÚNICO: Estamos en Santa Bárbara de Santa Cruz, Guanacaste. Honramos la vida y el tiempo.

LOGÍSTICA & LEGAL (CRÍTICO):
- Agenda: Sábados y Domingos únicamente.
- Reserva: Requiere 20% de depósito para activar la pre-producción.
- Firma Digital: No requerimos trámites físicos. Al pagar el adelanto, el sistema genera un contrato firmado digitalmente por conducta (Audit Trail con IP/Fecha), respaldado por la Ley N° 8454 de Costa Rica.
- Invitación: Si detectas interés real, invita al cliente a usar el 'Cotizador Inteligente' en la web o agendar una llamada de briefing.

REGLA DE ORO: Si preguntan por precios, responde con elegancia: "Nuestros procesos de Legado inician con un diseño de sesión personalizado... [explicación de valor]... la inversión para el proceso [Nombre] es de [Precio]".

${context ? `Contexto del Cliente: ${JSON.stringify(context)}` : ""}

Mensaje del cliente: "${clientMessage}"

Respuesta (Máximo 2 párrafos fluidos):`;

/**
 * Core AI Assistant function used by both Web and Webhooks
 */
export async function generateAiAssistantResponse(message: string, channel: string, context?: any) {
    if (!API_KEY) return "Lo siento, mi configuración de IA no está completa.";

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        });

        const result = await model.generateContent(SYSTEM_PROMPT(message, channel, context));
        const response = result.response;

        // Safety check: if response has no candidates, it might have been blocked
        if (response.candidates && response.candidates.length > 0) {
            return response.text();
        } else {
            console.warn("Gemini AI: No response candidates (possibly blocked by safety filters)");
            return "Gracias por contactarnos. Alberto revisará tu consulta personalmente para brindarte la mejor asesoría.";
        }
    } catch (error) {
        console.error("Gemini AI Core Error:", error);
        return "Gracias por tu interés. Alberto ha sido notificado y te contactará personalmente para brindarte una atención de primer nivel.";
    }
}

/**
 * Helper for image captions
 */
export async function generatePhotoPhrase(albumName: string) {
    if (!API_KEY) return "";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Genera una frase evocadora y poética de exactamente 3 palabras en español para una fotografía del álbum "${albumName}". Solo las 3 palabras, sin puntos finales.`;
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        return "";
    }
}

/**
 * Helper for creative delivery copy
 */
export async function generateDeliveryCopy(clientName: string, service: string, type: "song_title" | "story") {
    if (!API_KEY) return "";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = type === "song_title"
            ? `Genera 3 nombres cortos y poéticos para una canción o himno familiar de una sesión fotográfica de "${service}" para la "${clientName}". Solo los nombres, uno por línea.`
            : `Escribe una historia muy corta y sumamente emotiva (máximo 60 palabras) que acompañe la entrega de fotos de la sesión "${service}" para la "${clientName}". Enfócate en el legado y el amor.`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        return "";
    }
}
/**
 * Helper for Academy content batch generation
 */
export async function generateAcademyBatch(track: "legacy" | "tech") {
    if (!API_KEY) return { error: "API Key missing" };
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = track === "legacy"
            ? `Genera un batch de 4 lecciones para la "Academia de Legado" de Curiol Studio. 
               Enfócate en: Preservación de memorias, genealogía digital, el valor de la fotografía física y la curaduría de historias familiares.
               Responde ÚNICAMENTE con un array JSON de 4 objetos con: title, description, body, type (video o lesson), category (siempre "Legado").`
            : `Genera un batch de 4 lecciones para la "Academia Tech" de Curiol Studio. 
               Enfócate en: Inteligencia Artificial para negocios, digitalización de flujos, omnicanalidad y el futuro del trabajo Phygital.
               Responde ÚNICAMENTE con un array JSON de 4 objetos con: title, description, body, type (video o lesson), category (siempre "Tecnología").`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Academy Batch Error:", error);
        return { error: "Failed to generate batch" };
    }
}
