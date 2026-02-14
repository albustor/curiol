"use server";

import { sendNotification } from "./notifications";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";

export type EmailTask = "comercial" | "produccion" | "calidad" | "otros";

export async function sendProfessionalEmail(
    to: string,
    subject: string,
    body: string,
    task: EmailTask = "otros",
    sender: string | null | undefined = "info@curiol.studio"
) {
    const finalSender = sender || "info@curiol.studio";
    if (!to || !subject || !body) {
        throw new Error("Missing required fields: to, subject, or body");
    }

    const result = await sendNotification({
        to,
        message: body,
        type: "email",
        subject
    });

    if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : "Failed to send email");
    }

    // Persist to Shared Corporate Inbox (Firestore)
    try {
        await addDoc(collection(db, "corporate_emails"), {
            to,
            from: finalSender,
            subject,
            body,
            task,
            direction: "outgoing",
            createdAt: serverTimestamp(),
            status: "sent"
        });
    } catch (e) {
        console.error("Error persisting email record:", e);
        // We don't throw here to ensure the user knows the email was actually sent via Resend
    }

    return result;
}

export async function getCorporateEmails() {
    try {
        const q = query(collection(db, "corporate_emails"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
        }));
    } catch (e) {
        console.error("Error fetching corporate emails:", e);
        return [];
    }
}
