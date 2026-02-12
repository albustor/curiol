const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;

/**
 * Sends a message via WhatsApp Cloud API
 */
export async function sendWhatsAppMessage(to: string, text: string) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.warn("WhatsApp credentials missing. Skipping send.");
        return;
    }

    try {
        const response = await fetch(`https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: { body: text }
            })
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("WhatsApp API ERROR:", JSON.stringify(data, null, 2));
            return { error: true, details: data };
        }

        console.log("WhatsApp API Success:", data.messages?.[0]?.id);
        return data;
    } catch (error) {
        console.error("WhatsApp Fetch Exception:", error);
        return { error: true, message: "Network or Server Error" };
    }
}

/**
 * Sends a message via Messenger/Instagram API
 */
export async function sendSocialMessage(to: string, text: string, platform: "messenger" | "instagram") {
    const token = platform === "messenger" ? process.env.FACEBOOK_PAGE_TOKEN : process.env.INSTAGRAM_PAGE_TOKEN;
    if (!token) return;

    try {
        const response = await fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipient: { id: to },
                message: { text: text }
            })
        });
        return await response.json();
    } catch (error) {
        console.error(`${platform} Send Error:`, error);
    }
}
