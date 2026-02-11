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
        Eres el Asistente Curiol IA, un experto en Digitalización Humana y servicios phygital de Curiol Studio.
        Contexto actual del cliente: ${JSON.stringify(context)}.
        Mensaje del cliente: "${message}".
        
        INSTRUCCIONES DE COMPORTAMIENTO:
        1. Formato: Responde SIEMPRE en párrafos concisos y limpios. Evita listas infinitas.
        2. Tono: Profesional, objetivo y elegante.
        3. Estrategia: Enfócate en soluciones y beneficios bajo el concepto de "Legado Vivo".
        
        BASE DE CONOCIMIENTO (Servicios):
        - RECUERDOS ETERNOS: ₡115.000 ($225). Incluye 15 fotos Fine Art, Trascendencia intergeneracional, Cuadros Vivos AR, Retablo 8x12" con NFC.
        - AVENTURA MÁGICA: ₡80.900 ($165). Incluye 15 fotos High-End + IA, Realidad Aumentada, Canción IA personalizada, Retablo 5x7" con NFC.
        - MARCA PERSONAL: ₡89.000 ($179). Incluye 15 fotos de impacto, Tarjeta física chip NFT, Link a LinkedIn, Video o contenido personalizado.
        - MEMBRESÍA LEGADO: ₡25.000/mes ($59). Patrimonio protegido, 3 sesiones anuales, Custodia digital hereditaria.
        - MINI-RELATOS: ₡49.000 ($99). Encuentro ágil, 5 fotos Fine-Art, Esencia pura, Retablo 5x7" con NFC.
        - SOLUCIONES WEB: PWA (desde ₡250k/$500), No-Code/IA (desde ₡750k/$1500), Módulos IA (₡1.5M/$3000).
        
        LOGÍSTICA:
        - AGENDA: SÁBADOS y DOMINGOS únicamente.
        - RESERVA: Requiere depósito del 20% para asegurar fecha y activar pre-producción.
        - PAGOS SECCIONADOS: Disponibles para Recuerdos Eternos y Aventura Mágica si se reserva con 5+ meses de anticipación. (5 cuotas mensuales: RE ₡23k, AM ₡16.180).
        - CALIDAD: Exportación a 1350px (Lado Largo) + IA para composición perfecta (Regla de Tercios/Áurea).
        - RECORDATORIOS: Notificaciones automáticas 4d, 2d y 8h antes.
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
export async function generateAcademyBatch(track: "legacy" | "tech" = "tech") {
    try {
        const model = getModel();

        const legacyTopics = "Legado familiar, identidad, la familia, importancia de una imagen, el retrato y su historia, teoría del color para la piel (colorimetría), estética premium.";
        const techTopics = "Tecnología aplicada, desarrollo web, beneficios de automatización, Triángulo Mágico de la productividad, cómo emprender hoy, tendencias IA, Web3.";

        const prompt = `
        Actúa como el Maestro Alberto Bustos, un fotógrafo y tecnólogo de élite en Curiol Studio.
        Genera un lote (batch) de 4 lecciones estratégicas para la "Academia" en el track de: ${track === "legacy" ? "LEGADO FAMILIAR & IDENTIDAD" : "TECNOLOGÍA & DESARROLLO"}.
        
        Distribución OBLIGATORIA:
        - 2 artículos de texto profundo (type: "lesson").
        - 1 guion de podcast (type: "podcast").
        - 1 guion de video (type: "video").

        Temas a cubrir prioritariamente: ${track === "legacy" ? legacyTopics : techTopics}

        Para CADA lección (incluyendo video y podcast), debes incluir una "body" que sea la explicación o artículo base, y para los tipos 'video' y 'podcast' un 'mediaScript' con el guion detallado.

        Devuelve un JSON array con 4 objetos exactamente así:
        [
            {
                "title": "Título sugerente y profesional",
                "description": "Resumen que genere curiosidad",
                "type": "video" | "lesson" | "podcast",
                "category": "${track === 'legacy' ? 'Legado' : 'Tecnología'}",
                "body": "Artículo extenso (4+ párrafos) que explique el concepto a fondo",
                "infographicHighlight": "Dato o frase impactante para diseño visual",
                "mediaScript": "Guion narrativo completo (300+ palabras) si es video/podcast, de lo contrario vacío",
                "visualConcept": "Descripción detallada del contenido visual atractivo (colores, composition, miniaturas premium)"
            }
        ]
        
        Tono: Maestro Alberto (Elegante, trascendental, culto). Devuelve SOLAMENTE el JSON array.
      `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid JSON response from AI");
    } catch (error: any) {
        console.error("DEBUG - Gemini Academy Error:", error);
        return { error: error.message };
    }
}
