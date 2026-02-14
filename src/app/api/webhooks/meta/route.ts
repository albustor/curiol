import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
    collection, query, where, getDocs,
    addDoc, Timestamp, doc, setDoc,
    getDoc, updateDoc
} from "firebase/firestore";
import { sendWhatsAppMessage, sendSocialMessage } from "@/lib/meta";
import { generateAiAssistantResponse } from "@/lib/gemini";

// Meta verification token (should be in .env)
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "curiol_omnitech_2026";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    console.log("META WEBHOOK VERIFICATION ATTEMPT:", { mode, token });

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Verification successful, returning challenge:", challenge);
        return new Response(challenge || "", {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    console.warn("Verification failed. Expected token:", VERIFY_TOKEN, "Received:", token);
    return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("-----------------------------------------");
        console.log("META WEBHOOK RECEIVED");
        console.log("Body Object:", body.object);

        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        console.log("DEBUG: Webhook Processing:", {
            hasEntry: !!entry,
            hasChanges: !!changes,
            hasValue: !!value,
            hasMessages: !!messages,
            object: body.object
        });

        if (messages && messages.length > 0) {
            const message = messages[0];
            const from = message.from;
            const text = message.text?.body;

            // Log raw message details for debugging
            console.log(`MESSAGE RECEIVED | From: ${from} | Text: ${text || "[No Text]"}`);

            const textUpper = text?.toUpperCase();
            const channel = body.object === "whatsapp_business_account" ? "whatsapp" : "social";

            // 1. Log the conversation to Firestore
            await addDoc(collection(db, "omni_conversations"), {
                contactId: from,
                message: text || "",
                channel: channel,
                direction: "inbound",
                timestamp: Timestamp.now()
            });

            // 2. Check for Active Session
            const sessionRef = doc(db, "omni_sessions", from);
            const sessionSnap = await getDoc(sessionRef);
            let sessionData = sessionSnap.exists() ? sessionSnap.data() : null;

            if (sessionData && sessionData.status === "active") {
                console.log("Active session found for:", from, "Flow ID:", sessionData.flowId);
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
                        console.log("Advancing to step:", nextStepIdx);
                        await sendStepMessage(from, nextStep, channel, body.object);
                        await updateDoc(sessionRef, { currentStepIdx: nextStepIdx });
                    } else {
                        console.log("Flow completed for:", from);
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
            const q = query(flowsRef, where("triggerKeyword", "==", textUpper || ""), where("isActive", "==", true));
            const flowSnap = await getDocs(q);

            if (!flowSnap.empty) {
                const flowId = flowSnap.docs[0].id;
                const flowData = flowSnap.docs[0].data();
                console.log("Trigger match found! Flow ID:", flowId);
                const firstStep = flowData.steps[0];

                await setDoc(sessionRef, {
                    flowId,
                    currentStepIdx: 0,
                    status: "active",
                    data: {},
                    lastUpdated: Timestamp.now()
                });

                console.log("Sending first step...");
                await sendStepMessage(from, firstStep, channel, body.object);

                if (flowData.steps.length > 1) {
                    const secondStep = flowData.steps[1];
                    console.log("Sending second step...");
                    await sendStepMessage(from, secondStep, channel, body.object);
                    await updateDoc(sessionRef, { currentStepIdx: 1 });
                }
            } else {
                // 4. Fallback to Gemini AI
                console.log("No flow match. Falling back to Gemini...");
                try {
                    const aiResponse = await generateAiAssistantResponse(text || "", channel);
                    console.log("Gemini AI Response Success:", !!aiResponse);

                    if (channel === "whatsapp") {
                        console.log("Attempting to send WhatsApp message to:", from);
                        const waResult = await sendWhatsAppMessage(from, aiResponse);
                        console.log("WhatsApp API Result Status:", waResult?.error ? "FAILED" : "SUCCESS");
                    } else {
                        const platform = body.object === "instagram" ? "instagram" : "messenger";
                        console.log("Attempting to send Social message to:", from, "Platform:", platform);
                        const socialResult = await sendSocialMessage(from, aiResponse, platform);
                        console.log("Social API Result Status:", socialResult?.error ? "FAILED" : "SUCCESS");
                    }

                    await addDoc(collection(db, "omni_conversations"), {
                        contactId: from,
                        message: aiResponse,
                        channel: channel,
                        direction: "outbound",
                        type: "ai_assistant",
                        timestamp: Timestamp.now()
                    });
                } catch (aiError) {
                    console.error("ALET: Gemini Flow Error in Webhook:", aiError);
                    // Optional: fallback to manual notification if AI fails
                }
            }
        } else {
            console.log("Webhook event received but no user messages found (likely a Status or Read Receipt update).");
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("CRITICAL WEBHOOK ERROR:", error);
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
