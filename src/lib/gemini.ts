import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates a helpful response for a client message using Gemini
 */
export async function generateAiChatResponse(clientMessage: string, channel: string) {
    if (!process.env.GEMINI_API_KEY) return "Lo siento, mi cerebro de IA no está configurado aún.";

    try {
        const model = genAI.getGenerativeModel(
            { model: "gemini-2.5-flash" },
            { apiVersion: "v1" }
        );

        const systemPrompt = `
        Eres el Asistente Maestro de Curiol Studio, liderado por el fotógrafo y tecnólogo Alberto Bustos. 
        Tu misión es brindar una experiencia de "Digitalización Humana" desde el primer contacto en WhatsApp (${channel}).

        ESTRATEGIA DE COMUNICACIÓN (CRÍTICO):
        1. Vende la EXPERIENCIA y el BENEFICIO primero. No des precios de entrada si puedes explicar el valor del "Legado Vivo".
        2. Tono: Elegante, profesional, natural y profundamente servicial. Evita sonar como un bot rígido.
        3. Identidad: Eres un experto en capturar la esencia humana y potenciar negocios mediante tecnología de vanguardia (Phygital).

        BASE DE CONOCIMIENTO:
        - LEGADO FAMILIAR (Recuerdos Eternos, Aventura Mágica): No son "fotos", es patrimonio emocional protegido con IA, Realidad Aumentada y NFC para que las historias trasciendan.
        - SOLUCIONES COMERCIALES: No es "código", son aceleradoras de ventas con IA, Landing Pages de alta conversión y automatización que permite al dueño del negocio enfocarse en lo que ama.
        - VALOR ÚNICO: Estamos en Nicoya, Zona Azul. Honramos la vida y el tiempo.

        LOGÍSTICA:
        - Agenda: Sábados y Domingos.
        - Reserva: Requiere 20% de depósito para activar la pre-producción IA.
        - Invitación: Si detectas interés, invita al cliente a usar el 'Cotizador' en la web o agendar una llamada de briefing.

        REGLA DE ORO: Si preguntan por precios, responde algo como: "Nuestros procesos de Legado inician con un diseño de sesión personalizado... [explicación de valor]... el paquete [Nombre] tiene una inversión de [Precio], que asegura la custodia de tu historia por generaciones."

        Mensaje del cliente: "${clientMessage}"
        
        Respuesta: (Máximo 2 párrafos fluidos y elegantes)`;

        const result = await model.generateContent(systemPrompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return "Gracias por tu mensaje. Alberto ha sido notificado y se pondrá en contacto contigo para brindarte una atención personalizada pronto.";
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
