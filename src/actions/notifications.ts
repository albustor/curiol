"use server";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";

import { sendWhatsAppMessage } from "@/lib/meta";
import { createCalendarEvent, getBlockedDatesFromGoogle } from "@/lib/google-calendar";

interface NotificationParams {
    to: string;
    message: string;
    type: "whatsapp" | "email";
    subject?: string;
}

export async function sendNotification({ to, message, type, subject }: NotificationParams) {
    console.log(`[NOTIFICATION SERVICE] Sending ${type} to ${to}: ${message}`);

    if (type === "whatsapp") {
        try {
            await sendWhatsAppMessage(to, message);
        } catch (error) {
            console.error("[NOTIFICATION SERVICE] Error sending WhatsApp:", error);
        }
    }

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

const TEAM_CONTACTS = {
    alberto: { name: "Alberto", phone: "62856669", email: "info@curiol.studio" },
    kevin: { name: "Kevin", phone: process.env.WHATSAPP_KEVIN || "", email: "kevin@curiol.studio" },
    cristina: { name: "Cristina", phone: process.env.WHATSAPP_CRISTINA || "", email: "cristina@curiol.studio" },
    cristian: { name: "Cristian", phone: process.env.WHATSAPP_CRISTIAN || "", email: "cristian@curiol.studio" }
};

export async function notifyNewBooking(booking: any) {
    const adminMessage = `Nueva reserva agendada por ${booking.name}. Fecha: ${booking.date instanceof Date ? booking.date.toLocaleDateString() : (booking.date.toDate ? booking.date.toDate().toLocaleDateString() : booking.date)}. Hora: ${booking.time}. Comprobante adjunto en el dashboard.\n\nAtentamente,\nCuriol Studio • Legado`;
    const clientMessage = `Hola ${booking.name}, gracias por agendar con Curiol Studio. Hemos recibido tu comprobante del 20%. Tu sesión para el ${booking.date instanceof Date ? booking.date.toLocaleDateString() : (booking.date.toDate ? booking.date.toDate().toLocaleDateString() : booking.date)} a las ${booking.time} está en proceso de aprobación final.\n\nAtentamente,\nCuriol Studio • Legado`;

    // Determine which team members to notify based on service
    let targetTeam = [TEAM_CONTACTS.alberto];

    if (booking.service === 'legado') {
        // Photography is with Cristina ONLY as per latest audio
        targetTeam = [TEAM_CONTACTS.cristina];
    } else if (booking.service === 'infra') {
        // Commercial Growth / Tech is with Cristina, Kevin, and Alberto
        targetTeam = [TEAM_CONTACTS.cristina, TEAM_CONTACTS.kevin, TEAM_CONTACTS.alberto];
    } else {
        // Default for 'meet' or others: notify all for awareness
        targetTeam = Object.values(TEAM_CONTACTS);
    }

    // Notify Team
    for (const contact of targetTeam) {
        if (contact.phone) {
            await sendNotification({ to: contact.phone, message: adminMessage, type: "whatsapp" });
        }
        if (contact.email) {
            await sendNotification({ to: contact.email, message: adminMessage, type: "email", subject: `Nueva Reserva [${booking.service.toUpperCase()}] - Curiol Studio` });
        }
    }

    // Notify Client
    await sendNotification({ to: booking.whatsapp, message: clientMessage, type: "whatsapp" });
    await sendNotification({ to: booking.email, message: clientMessage, type: "email", subject: "Detalles de tu Reserva - Curiol Studio" });
}

export async function notifyBookingConfirmation(booking: any) {
    const message = `¡Confirmado! Tu sesión con Curiol Studio para el ${booking.date.toDate ? booking.date.toDate().toLocaleDateString() : booking.date} a las ${booking.time} ha sido aprobada. Ya puedes verla en tu calendario.\n\nAtentamente,\nCuriol Studio • Legado`;

    // Sync to Google Calendar
    await createCalendarEvent(booking);

    // Notify Client
    await sendNotification({ to: booking.whatsapp, message, type: "whatsapp" });
    await sendNotification({ to: booking.email, message, type: "email", subject: "Sesión Confirmada - Curiol Studio" });
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
        const sessionDate = booking.date.toDate ? booking.date.toDate() : new Date(booking.date);
        const timeDiffHours = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        const timeDiffDays = timeDiffHours / 24;

        const reminders = booking.remindersSent || {};

        // 4 Days Reminder
        if (timeDiffDays <= 4 && timeDiffDays > 3.5 && !reminders.fourDays) {
            await sendBookingReminder(booking, "4 días");
            reminders.fourDays = true;
        }

        // 2 Days Reminder
        if (timeDiffDays <= 2 && timeDiffDays > 1.5 && !reminders.twoDays) {
            await sendBookingReminder(booking, "2 días");
            reminders.twoDays = true;
        }

        // 5 Hours Reminder (Changed from 8)
        if (timeDiffHours <= 5 && timeDiffHours > 4 && !reminders.fiveHours) {
            await sendBookingReminder(booking, "5 horas");
            reminders.fiveHours = true;
        }

        if (Object.keys(reminders).length > (booking.remindersSent ? Object.keys(booking.remindersSent).length : 0)) {
            await updateDoc(doc(db, "bookings", bookingId), { remindersSent: reminders });
        }
    }
}

async function sendBookingReminder(booking: any, timeFrame: string) {
    const clientMessage = `Hola ${booking.name}, Curiol Studio te recuerda tu sesión agendada para el ${booking.date.toDate ? booking.date.toDate().toLocaleDateString() : booking.date} a las ${booking.time}. Falta(n) ${timeFrame}. ¡Te esperamos!`;
    const adminMessage = `Recordatorio enviado a ${booking.name}: Su sesión es en ${timeFrame} (${booking.time}).`;

    // Notify Client
    await sendNotification({ to: booking.whatsapp, message: clientMessage, type: "whatsapp" });
    await sendNotification({ to: booking.email, message: clientMessage, type: "email", subject: "Recordatorio de Sesión - Curiol Studio" });

    // Determine target team for reminders following the same logic
    let targetTeam = [TEAM_CONTACTS.alberto];
    if (booking.service === 'legado') {
        targetTeam = [TEAM_CONTACTS.cristina];
    } else if (booking.service === 'infra') {
        targetTeam = [TEAM_CONTACTS.cristina, TEAM_CONTACTS.kevin, TEAM_CONTACTS.alberto];
    } else {
        targetTeam = Object.values(TEAM_CONTACTS);
    }

    for (const contact of targetTeam) {
        if (contact.phone) {
            await sendNotification({ to: contact.phone, message: adminMessage, type: "whatsapp" });
        }
        if (contact.email) {
            await sendNotification({ to: contact.email, message: adminMessage, type: "email", subject: `Recordatorio [${booking.service.toUpperCase()}]: ${booking.name}` });
        }
    }
}

export async function fetchGoogleBlockedDates(start: Date, end: Date) {
    return await getBlockedDatesFromGoogle(start, end);
}
