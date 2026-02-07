import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
    collection, query, where, getDocs,
    addDoc, Timestamp, doc, setDoc,
    getDoc, updateDoc
} from "firebase/firestore";
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
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (messages && messages.length > 0) {
            const message = messages[0];
            const from = message.from;
            const text = message.text?.body;
            const textUpper = text?.toUpperCase();
            const channel = body.object === "whatsapp_business_account" ? "whatsapp" : "social";

            // 1. Log the conversation
            await addDoc(collection(db, "omni_conversations"), {
                contactId: from,
                message: text,
                channel: channel,
                direction: "inbound",
                timestamp: Timestamp.now()
            });

            // 2. Check for Active Session
            const sessionRef = doc(db, "omni_sessions", from);
            const sessionSnap = await getDoc(sessionRef);
            let sessionData = sessionSnap.exists() ? sessionSnap.data() : null;

            if (sessionData && sessionData.status === "active") {
                const flowRef = doc(db, "omni_flows", sessionData.flowId);
                const flowSnap = await getDoc(flowRef);

                if (flowSnap.exists()) {
                    const flow = flowSnap.data();
                    const currentStepIdx = sessionData.currentStepIdx;
                    const lastStep = flow.steps[currentStepIdx];

                    if (lastStep.type === "capture") {
                        const fieldName = lastStep.config?.field || "dato_extra";
                        const newData = { ...sessionData.data, [fieldName]: text };
                        await updateDoc(sessionRef, { data: newData });
                        sessionData.data = newData;
                    }

                    const nextStepIdx = currentStepIdx + 1;
                    if (nextStepIdx < flow.steps.length) {
                        const nextStep = flow.steps[nextStepIdx];
                        await sendStepMessage(from, nextStep, channel, body.object);
                        await updateDoc(sessionRef, { currentStepIdx: nextStepIdx });
                    } else {
                        await updateDoc(sessionRef, { status: "completed" });
                        if (Object.keys(sessionData.data || {}).length > 0) {
                            await addDoc(collection(db, "leads"), {
                                ...sessionData.data,
                                source: "OmniFlow",
                                flowName: flow.name,
                                createdAt: Timestamp.now()
                            });
                        }
                    }
                    return NextResponse.json({ status: "ok" });
                }
            }

            // 3. Find matching flow (Trigger)
            const flowsRef = collection(db, "omni_flows");
            const q = query(flowsRef, where("triggerKeyword", "==", textUpper), where("isActive", "==", true));
            const flowSnap = await getDocs(q);

            if (!flowSnap.empty) {
                const flowId = flowSnap.docs[0].id;
                const flowData = flowSnap.docs[0].data();
                const firstStep = flowData.steps[0];

                await setDoc(sessionRef, {
                    flowId,
                    currentStepIdx: 0,
                    status: "active",
                    data: {},
                    lastUpdated: Timestamp.now()
                });

                await sendStepMessage(from, firstStep, channel, body.object);

                if (flowData.steps.length > 1) {
                    const secondStep = flowData.steps[1];
                    await sendStepMessage(from, secondStep, channel, body.object);
                    await updateDoc(sessionRef, { currentStepIdx: 1 });
                }
            } else {
                // 4. Fallback to Gemini AI
                const aiResponse = await generateAiChatResponse(text, channel);
                const platform = body.object === "instagram" ? "instagram" : "messenger";

                if (channel === "whatsapp") {
                    await sendWhatsAppMessage(from, aiResponse);
                } else {
                    await sendSocialMessage(from, aiResponse, platform);
                }

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

async function sendStepMessage(from: string, step: any, channel: string, object: string) {
    const content = step.content;
    if (channel === "whatsapp") {
        await sendWhatsAppMessage(from, content);
    } else {
        const platform = object === "instagram" ? "instagram" : "messenger";
        await sendSocialMessage(from, content, platform);
    }
}
