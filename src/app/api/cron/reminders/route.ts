import { NextResponse } from "next/server";
import { processReminders } from "@/actions/notifications";

export async function GET(req: Request) {
    try {
        // Simple security check (optional): Verify a secret token passed in headers
        // if (req.headers.get("x-cron-token") !== process.env.CRON_SECRET) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        await processReminders();
        return NextResponse.json({ success: true, message: "Reminders processed successfully" });
    } catch (error: any) {
        console.error("Cron Reminder Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
