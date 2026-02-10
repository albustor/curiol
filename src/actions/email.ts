"use server";

import { sendNotification } from "./notifications";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type EmailTask = "comercial" | "produccion" | "calidad" | "otros";

export async function sendProfessionalEmail(
    to: string,
    subject: string,
    body: string,
    task: EmailTask = "otros",
    sender: string = "info@curiol.studio"
) {
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
            from: sender,
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
    // This will be used by the frontend to fetch the shared inbox/history
    // Logic will be implemented directly in the component for real-time snapshots,
    // but we can export constants or types here if needed.
}
