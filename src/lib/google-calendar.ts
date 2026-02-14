import { google } from 'googleapis';
import { getGoogleTokens, refreshAccessToken, saveGoogleTokens } from './google-auth';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google`
);

/**
 * Ensures we have valid tokens and returns an authenticated calendar instance
 */
async function getAuthenticatedCalendar() {
    const tokens = await getGoogleTokens();
    if (!tokens) {
        throw new Error('Google OAuth tokens not found. Please authenticate first.');
    }

    oauth2Client.setCredentials(tokens);

    // Check if token is expired (simplified, usually google-auth library handles this if we provide expiry)
    // For now, we refresh if we have a refresh_token
    if (tokens.refresh_token) {
        oauth2Client.on('tokens', (newTokens) => {
            saveGoogleTokens(newTokens);
        });
    }

    return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Creates an event in the studio's Google Calendar
 */
export async function createCalendarEvent(booking: any) {
    try {
        const calendar = await getAuthenticatedCalendar();

        const sessionDate = booking.date.toDate ? booking.date.toDate() : new Date(booking.date);

        // Construct start and end dates based on time string (e.g. "05:00 PM")
        const start = new Date(sessionDate);
        const [time, modifier] = booking.time.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        start.setHours(hours, minutes, 0, 0);

        // Default duration: 2 hours for photos, 1 hour for tech/meet
        const end = new Date(start);
        const durationHours = booking.service === 'legado' ? 2 : 1;
        end.setHours(start.getHours() + durationHours);

        const event = {
            summary: `Curiol [${booking.service.toUpperCase()}] - ${booking.name}`,
            location: 'Curiol Studio',
            description: `Reserva agendada: ${booking.service}\nCliente: ${booking.name}\nEmail: ${booking.email}\nWhatsApp: ${booking.whatsapp}`,
            start: {
                dateTime: start.toISOString(),
                timeZone: 'America/Costa_Rica',
            },
            end: {
                dateTime: end.toISOString(),
                timeZone: 'America/Costa_Rica',
            },
            attendees: [
                { email: booking.email },
                // We could add team emails here too if needed
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 30 },
                ],
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        console.log('[CALENDAR SERVICE] Event created:', response.data.htmlLink);
        return response.data;
    } catch (error) {
        console.error('[CALENDAR SERVICE] Error creating event:', error);
        return null;
    }
}

/**
 * Lists events for a specific month to identify blocked slots
 */
export async function getBlockedDatesFromGoogle(start: Date, end: Date) {
    try {
        const calendar = await getAuthenticatedCalendar();
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        // Map to date strings to block entire days or specific slots
        return events.map(event => {
            const startStr = event.start?.dateTime || event.start?.date;
            return new Date(startStr!).toDateString();
        });
    } catch (error) {
        console.error('[CALENDAR SERVICE] Error fetching events:', error);
        return [];
    }
}
