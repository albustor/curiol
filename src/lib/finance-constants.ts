/**
 * Curiol Studio - Financial Constants & Logic
 * Based on 2026 Contracts and Production Costs
 */

export const FINANCE_CONFIG = {
    // General Business Costs
    FIXED_MONTHLY: {
        DOMAIN: 1500,
        HOSTING: 12000,
        GOOGLE_WORKSPACE: 6500, // Business Email + Drive
        ADOBE_CREATIVE_CLOUD: 32000, // Photoshop + Lightroom
        LUMINAR_NEO: 8500,
        FIREBASE_GOOGLE_CLOUD: 5000,
        IA_GEMINI_PRO: 12000,
        VIDEO_EDITORS_SUBS: 9000,
        EQUIPMENT_DEPRECIATION: 25000, // Saved for replacement
    },

    // Costa Rica Tax Compliance (Ministerio de Hacienda)
    TAX: {
        IVA_RATE: 0.13,
        CODES: {
            PHOTOGRAPHY: "7420",
            SOFTWARE: "6201.0",
        },
        REPORTING: {
            MONTHLY: "D-104-2",
            ANNUAL: "D-101",
        }
    },

    // Collaborator Payment Models
    COLLABORATORS: {
        KEVIN: {
            SALES_COMMISSION: 0.05, // 5% of net sale
            PROJECT_FEE: "Variable", // Negotiated per project
        },
        CRISTINA: {
            SESSION_FEE: 8000,
            SESSION_MAX_HOURS: 2,
            SOFTWARE_COMMISSION: 0.03, // 3% of total project
            INTERNAL_SERVICE_FEE: 5000,
        }
    },

    // Production Costs (Base price from provider)
    // We add 40% to these as per user request ("precio adicional considerando un 40%")
    PRODUCTION: {
        MARGIN_MULTIPLIER: 1.40,
        NFC_CARD_COST: 5000,

        RETABLO_BORDE_15MM: {
            "4x6": { base: 6231, pie: 2379 },
            "5x7": { base: 9543, pie: 2527 },
            "6x8": { base: 12009, pie: 3619 },
            "8x10": { base: 15467, pie: 4436 },
            "8x11": { base: 17193 },
            "8x12": { base: 18564 },
            "10x12": { base: 20455 },
            "11x14": { base: 21345 },
            "12x16": { base: 31954 },
            "12x18": { base: 35362 },
            "16x20": { base: 45401 },
            "16x24": { base: 54430 },
            "20x24": { base: 64830 },
            "20x30": { base: 83790 },
        },

        CANVA_TENSADA: {
            "4x6": { white: 9687, color: 9967 },
            "5x7": { white: 11951, color: 12296 },
            "6x8": { white: 14347, color: 14753 },
            "8x10": { white: 19503, color: 20031 },
            "8x11": { white: 20792, color: 21350 },
            "8x12": { white: 22081, color: 22670 },
            "10x12": { white: 26060, color: 27491 },
            "11x14": { white: 30642, color: 32261 },
            "12x16": { white: 35474, color: 37280 },
            "12x18": { white: 36869, color: 40539 },
            "16x20": { white: 50019, color: 52323 },
            "16x24": { white: 57291, color: 59844 },
            "20x24": { white: 68208, color: 72531 },
            "20x30": { white: 80794, color: 85681 },
        }
    },

    // Package Analysis (Internal Review for Alberto)
    PACKAGE_ANALYSIS: {
        "aventura": {
            name: "Aventura Mágica (Phygital)",
            totalPrice: 80900,
            breakdown: [
                { item: "Retablo (5x7 con pie) + 40%", cost: 16898, note: "₡12,070 base + margen" },
                { item: "Staff Técnico (Cristina)", cost: 8000, note: "Tarifa por sesión" },
                { item: "Logística / Equipo / Agua", cost: 2500, note: "Valor prerrateado" },
                { item: "Valor Fotografía (15 x ₡3,000)", cost: 45000, note: "Mano de obra artística" },
                { item: "Infraestructura Digital", cost: 5000, note: "Hosting, AI, Firebase" },
                { item: "Sticker NFC", cost: 800, note: "1 unidad" }
            ],
            margin: 0.03 // ~3%
        },
        "recuerdos": {
            name: "Recuerdos Eternos",
            totalPrice: 77000,
            breakdown: [
                { item: "Retablo (8x12) + 40%", cost: 25989, note: "₡18,564 base + margen" },
                { item: "Staff Técnico (Cristina)", cost: 8000, note: "Tarifa por sesión" },
                { item: "Logística / Equipo / Agua", cost: 2500, note: "Valor prerrateado" },
                { item: "Valor Fotografía (15 x ₡3,000)", cost: 45000, note: "Mano de obra artística" },
                { item: "Infraestructura Digital", cost: 5000, note: "Hosting, AI, Firebase" },
                { item: "Sticker NFC", cost: 800, note: "1 unidad" }
            ],
            margin: -0.13 // -13% (Se requiere ajuste en Mano de Obra para rentabilidad)
        }
    }
};

interface RetabloItem {
    base: number;
    pie?: number;
}

interface CanvaItem {
    white: number;
    color: number;
}

/**
 * Calculates the final cost of a production item including the 40% studio overhead/additional price.
 */
export function calculateProductionCost(
    type: 'retablo' | 'canva',
    size: string,
    options: { conPie?: boolean; fullColor?: boolean } = {}
) {
    const margin = FINANCE_CONFIG.PRODUCTION.MARGIN_MULTIPLIER;
    let base = 0;

    if (type === 'retablo') {
        const item = (FINANCE_CONFIG.PRODUCTION.RETABLO_BORDE_15MM as Record<string, RetabloItem>)[size];
        if (!item) return 0;
        base = item.base;
        if (options.conPie && item.pie) base += item.pie;
    } else {
        const item = (FINANCE_CONFIG.PRODUCTION.CANVA_TENSADA as Record<string, CanvaItem>)[size];
        if (!item) return 0;
        base = options.fullColor ? item.color : item.white;
    }

    return base * margin;
}
