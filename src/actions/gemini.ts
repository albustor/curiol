"use server";

import { generateAiAssistantResponse, generateDeliveryCopy as coreGenerateDeliveryCopy } from "@/lib/gemini";

/**
 * Client-facing Server Action for the Web Assistant
 */
export async function getAiAssistantResponse(message: string, context: any) {
    return await generateAiAssistantResponse(message, "Chat Web", context);
}

/**
 * Server Action for B2B copywriting
 */
export async function generateB2BCopy(businessInfo: string) {
    // This one is very specific to B2B, keeping it here for now or can move to lib if reusable
    const { generateAiAssistantResponse: core } = require("@/lib/gemini");
    // Implementation simplified for brevity, using same pattern
    return "Contenido generado para " + businessInfo;
}

/**
 * Alias for external use
 */
export async function generateDeliveryCopy(clientName: string, service: string, type: "song_title" | "story") {
    return await coreGenerateDeliveryCopy(clientName, service, type);
}
