"use server";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";

interface NotificationParams {
    to: string;
    message: string;
    type: "whatsapp" | "email";
    subject?: string;
}

export async function sendNotification({ to, message, type, subject }: NotificationParams) {
    // In a real production environment, you would use Twilio for WhatsApp and Resend/SendGrid for Email.
    // For now, we will log the notification and prepare the structure.

    console.log(`[NOTIFICATION SERVICE] Sending ${type} to ${to}: ${message}`);

    // Example Twilio Implementation (Commented out):
    /*
    if (type === "whatsapp") {
        const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            from: 'whatsapp:+14155238886', // Twilio Sandbox
            body: message,
            to: `whatsapp:${to}`
        });
    }
    */

    // Resend Implementation:
    if (type === "email") {
        try {
            const { Resend } = require('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);

            if (!process.env.RESEND_API_KEY) {
                console.warn("[NOTIFICATION SERVICE] Missing RESEND_API_KEY. Email logged to console.");
                return { success: true, logged: true };
            }

            await resend.emails.send({
                from: 'Curiol Studio <info@curiol.studio>',
                to: [to],
                subject: subject || "Notificación de Curiol Studio",
                text: message
            });
        } catch (error) {
            console.error("[NOTIFICATION SERVICE] Error sending email via Resend:", error);
            return { success: false, error };
        }
    }

    return { success: true };
}

export async function notifyNewBooking(booking: any) {
    const adminNumber = "60602617";
    const adminEmail = process.env.ADMIN_EMAIL || "info@curiol.studio";

    const adminMessage = `Nueva reserva agendada por ${booking.name}. Fecha: ${booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date}. Hora: ${booking.time}. Comprobante adjunto en el dashboard.\n\nAtentamente,\nCuriol Studio • Legado`;
    const clientMessage = `Hola ${booking.name}, gracias por agendar con Curiol Studio. Hemos recibido tu comprobante del 20%. Tu sesión para el ${booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date} a las ${booking.time} está en proceso de aprobación final.\n\nAtentamente,\nCuriol Studio • Legado`;

    // Notify Alberto (Admin)
    await sendNotification({ to: adminNumber, message: adminMessage, type: "whatsapp" });
    await sendNotification({ to: adminEmail, message: adminMessage, type: "email", subject: "Nueva Reserva - Curiol Studio" });

    // Notify Client
    await sendNotification({ to: booking.whatsapp, message: clientMessage, type: "whatsapp" });
    await sendNotification({ to: booking.email, message: clientMessage, type: "email", subject: "Detalles de tu Reserva - Curiol Studio" });
}

export async function processReminders() {
    const now = new Date();
    const bookingsRef = collection(db, "bookings");

    // Fetch pending and confirmed bookings
    const q = query(bookingsRef, where("status", "in", ["pending_approval", "confirmed"]));
    const querySnapshot = await getDocs(q);

    for (const docSnapshot of querySnapshot.docs) {
        const booking = docSnapshot.data();
        const bookingId = docSnapshot.id;
        const sessionDate = booking.date.toDate();
        const timeDiffHours = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        const timeDiffDays = timeDiffHours / 24;

        const reminders = booking.remindersSent || {};

        // 4 Days Reminder
        if (timeDiffDays <= 4 && timeDiffDays > 3 && !reminders.fourDays) {
            await sendBookingReminder(booking, "4 días");
            reminders.fourDays = true;
        }

        // 2 Days Reminder
        if (timeDiffDays <= 2 && timeDiffDays > 1 && !reminders.twoDays) {
            await sendBookingReminder(booking, "2 días");
            reminders.twoDays = true;
        }

        // 8 Hours Reminder
        if (timeDiffHours <= 8 && timeDiffHours > 7 && !reminders.eightHours) {
            await sendBookingReminder(booking, "8 horas");
            reminders.eightHours = true;
        }

        if (Object.keys(reminders).length > 0) {
            await updateDoc(doc(db, "bookings", bookingId), { remindersSent: reminders });
        }
    }
}

async function sendBookingReminder(booking: any, timeFrame: string) {
    const clientMessage = `Hola ${booking.name}, Curiol Studio te recuerda tu sesión agendada para el ${booking.date.toDate().toLocaleDateString()} a las ${booking.time}. Falta(n) ${timeFrame}. ¡Te esperamos!`;

    await sendNotification({
        to: booking.whatsapp,
        message: clientMessage,
        type: "whatsapp"
    });

    await sendNotification({
        to: booking.email,
        message: clientMessage,
        type: "email",
        subject: "Recordatorio de Sesión - Curiol Studio"
    });
}
