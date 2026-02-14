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

    // REMOTE DEBUG: Log GET attempts
    await addDoc(collection(db, "meta_debug_logs"), {
        timestamp: Timestamp.now(),
        type: "GET_VERIFY",
        params: { mode, token, challenge }
    });

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

        // REMOTE DEBUG: Log everything to Firestore
        await addDoc(collection(db, "meta_debug_logs"), {
            timestamp: Timestamp.now(),
            body: body
        });

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

            console.log(`[META WEBHOOK] | Contact: ${from} | Message: ${text || "[No Text]"}`);

            // 1. Direct Ping Test (Always active for troubleshooting)
            if (text?.toUpperCase() === "PING") {
                console.log("[DIAGNOSTIC] PING detected. Sending PONG response...");
                const result = await sendWhatsAppMessage(from, "PONG 🏓 - Conectividad verificada por Curiol Studio.");
                return NextResponse.json({ status: "ok", diagnostic: "pong_sent", success: !result?.error });
            }

            const textUpper = text?.toUpperCase();
            const channel = body.object === "whatsapp_business_account" ? "whatsapp" : "social";

            // 2. Persist in Omni Conversations
            await addDoc(collection(db, "omni_conversations"), {
                contactId: from,
                message: text || "",
                channel: channel,
                direction: "inbound",
                timestamp: Timestamp.now()
            });

            // 3. Flow Engine Check
            const sessionRef = doc(db, "omni_sessions", from);
            const sessionSnap = await getDoc(sessionRef);
            let sessionData = sessionSnap.exists() ? sessionSnap.data() : null;

            if (sessionData && sessionData.status === "active") {
                console.log("[FLOW ENGINE] Resuming session for:", from);
                const flowRef = doc(db, "omni_flows", sessionData.flowId);
                const flowSnap = await getDoc(flowRef);

                if (flowSnap.exists()) {
                    const flow = flowSnap.data();
                    const currentStepIdx = sessionData.currentStepIdx;

                    if (currentStepIdx < flow.steps.length) {
                        const lastStep = flow.steps[currentStepIdx];
                        if (lastStep.type === "capture") {
                            const fieldName = lastStep.config?.field || "dato_extra";
                            const newData = { ...sessionData.data, [fieldName]: text };
                            await updateDoc(sessionRef, { data: newData });
                        }

                        const nextStepIdx = currentStepIdx + 1;
                        if (nextStepIdx < flow.steps.length) {
                            console.log("[FLOW ENGINE] Sending step:", nextStepIdx);
                            await sendStepMessage(from, flow.steps[nextStepIdx], channel, body.object);
                            await updateDoc(sessionRef, { currentStepIdx: nextStepIdx });
                        } else {
                            console.log("[FLOW ENGINE] Flow finished.");
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
                    }
                    return NextResponse.json({ status: "ok", engine: "flow" });
                }
            }

            // 4. Trigger Match
            const flowsRef = collection(db, "omni_flows");
            const q = query(flowsRef, where("triggerKeyword", "==", textUpper || ""), where("isActive", "==", true));
            const flowResults = await getDocs(q);

            if (!flowResults.empty) {
                const flowId = flowResults.docs[0].id;
                const flowData = flowResults.docs[0].data();
                console.log("[TRIGGER] Match found:", flowData.name);

                await setDoc(sessionRef, {
                    flowId,
                    currentStepIdx: 0,
                    status: "active",
                    data: {},
                    lastUpdated: Timestamp.now()
                });

                await sendStepMessage(from, flowData.steps[0], channel, body.object);
                return NextResponse.json({ status: "ok", engine: "flow_triggered" });
            }

            // 5. AI Assistant Fallback
            console.log("[AI ENGINE] Processing with Gemini...");
            try {
                const aiResponse = await generateAiAssistantResponse(text || "", channel);

                if (channel === "whatsapp") {
                    const result = await sendWhatsAppMessage(from, aiResponse);
                    console.log("[AI ENGINE] WhatsApp Send Result:", result?.error ? "ERROR" : "SUCCESS");
                } else {
                    const platform = body.object === "instagram" ? "instagram" : "messenger";
                    await sendSocialMessage(from, aiResponse, platform);
                }

                await addDoc(collection(db, "omni_conversations"), {
                    contactId: from,
                    message: aiResponse,
                    channel: channel,
                    direction: "outbound",
                    type: "ai_assistant",
                    timestamp: Timestamp.now()
                });

                return NextResponse.json({ status: "ok", engine: "ai" });
            } catch (aiError) {
                console.error("[AI ENGINE] CRITICAL ERROR:", aiError);
            }
        }
        else {
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
