import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { sendWhatsAppMessage } from "@/lib/meta";

/**
 * Cron job to handle album expiration (60 days)
 * Should be called by Vercel Cron or a similar service
 */
export async function GET(req: Request) {
    // Verify secret to avoid external calls
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const now = new Date();
    const expirationThreshold = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
    const warningThreshold = new Date(now.getTime() - (57 * 24 * 60 * 60 * 1000));

    try {
        const albumsRef = collection(db, "albums");

        // 1. Process 3-day Warnings
        const qWarning = query(
            albumsRef,
            where("status", "==", "active"),
            where("createdAt", "<=", warningThreshold),
            where("warningSent", "==", false)
        );
        const warningSnap = await getDocs(qWarning);

        for (const albumDoc of warningSnap.docs) {
            const album = albumDoc.data();

            // Send Alerts
            await sendWhatsAppMessage(
                album.clientPhone,
                `⏰ ¡Atención! Tu álbum de Curiol Studio ("${album.name}") expira en 3 días. No olvides descargar tus fotografías.`
            );

            await sendWhatsAppMessage(
                process.env.ADMIN_PHONE || "",
                `⚠️ Notificación de Expiración: El álbum "${album.name}" del cliente ${album.clientName} se borrará en 3 días.`
            );

            // Mark warning as sent
            await updateDoc(doc(db, "albums", albumDoc.id), {
                warningSent: true
            });
        }

        // 2. Process Deletions
        const qDelete = query(
            albumsRef,
            where("status", "==", "active"),
            where("createdAt", "<=", expirationThreshold)
        );
        const deleteSnap = await getDocs(qDelete);

        for (const albumDoc of deleteSnap.docs) {
            // Delete record
            await deleteDoc(doc(db, "albums", albumDoc.id));
            console.log(`Album ${albumDoc.id} deleted due to expiration.`);
        }

        return NextResponse.json({ processed: warningSnap.size + deleteSnap.size });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
