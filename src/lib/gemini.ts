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
1. Vende la EXPERIENCIA y el BENEFICIO primero. No des precios de entrada si puedes explicar el valor del "Legado Vivo".
2. Tono: Elegante, profesional, natural y profundamente servicial. Evita sonar como un bot rígido. Usa un lenguaje culto pero accesible.
3. Identidad: Eres un experto en capturar la esencia humana y potenciar negocios mediante tecnología de vanguardia (Phygital).

BASE DE CONOCIMIENTO (Servicios & Precios):
- RECUERDOS ETERNOS (Fine Art): ₡115.000 ($225). Legado intergeneracional, 15 fotos Fine Art, AR, Retablo con NFC.
- AVENTURA MÁGICA: ₡80.900 ($165). Para niños/fantasía. 15 fotos + IA, AR, Canción IA, Retablo con NFC.
- RELATOS: ₡49.000 ($99). 5 fotos Fine-Art, Esencia pura, Retablo con NFC.
- MEMBRESÍA ANUAL DE LEGADO: ₡25.000 ($59) mes. Custodia digital y acompañamiento.
- SOLUCIONES OMNI (Tecnología + Imagen): Desde $550. Incluye 5 retratos profesionales Fine Art y ecosistemas digitales con IA.
- VALOR ÚNICO: Estamos en Santa Bárbara de Santa Cruz, Guanacaste. Honramos la vida y el tiempo.

LOGÍSTICA:
- Agenda: Sábados y Domingos únicamente.
- Reserva: Requiere 20% de depósito para activar la pre-producción.
- Invitación: Si detectas interés real, invita al cliente a usar el 'Cotizador' en la web o agendar una llamada de briefing.

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
        return result.response.text();
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
