import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { sendWhatsAppMessage, sendSocialMessage } from "@/lib/meta";
import { generateAiChatResponse } from "@/lib/gemini";

// Meta verification token (should be in .env)
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "curiol_omnitech_2026";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Process entry (could be from whatsapp, messenger, or instagram)
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (messages && messages.length > 0) {
            const message = messages[0];
            const from = message.from; // Phone number or IG/FB ID
            const text = message.text?.body?.toUpperCase();
            const channel = body.object === "whatsapp_business_account" ? "whatsapp" : "social";

            // 1. Log the conversation
            await addDoc(collection(db, "omni_conversations"), {
                contactId: from,
                message: text,
                channel: channel,
                direction: "inbound",
                timestamp: Timestamp.now()
            });

            // 2. Find matching flow
            const flowsRef = collection(db, "omni_flows");
            const q = query(flowsRef, where("triggerKeyword", "==", text), where("isActive", "==", true));
            const flowSnap = await getDocs(q);

            if (!flowSnap.empty) {
                const flowData = flowSnap.docs[0].data();
                const steps = flowData.steps || [];

                // 3. Execute Steps
                for (const step of steps) {
                    if (step.type === "message" || step.type === "capture") {
                        if (channel === "whatsapp") {
                            await sendWhatsAppMessage(from, step.content);
                        } else {
                            // Detect platform from body.object or other metadata
                            const platform = body.object === "instagram" ? "instagram" : "messenger";
                            await sendSocialMessage(from, step.content, platform);
                        }
                    }
                    // Capture logic: Wait for next message or handle state in Firestore
                }
            } else {
                // 4. Fallback to Gemini AI
                const aiResponse = await generateAiChatResponse(text, channel);

                if (channel === "whatsapp") {
                    await sendWhatsAppMessage(from, aiResponse);
                } else {
                    const platform = body.object === "instagram" ? "instagram" : "messenger";
                    await sendSocialMessage(from, aiResponse, platform);
                }

                // Log AI response
                await addDoc(collection(db, "omni_conversations"), {
                    contactId: from,
                    message: aiResponse,
                    channel: channel,
                    direction: "outbound",
                    type: "ai_fallback",
                    timestamp: Timestamp.now()
                });
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
