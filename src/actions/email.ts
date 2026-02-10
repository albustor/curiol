"use server";

import { sendNotification } from "./notifications";

export async function sendProfessionalEmail(to: string, subject: string, body: string) {
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

    return result;
}
