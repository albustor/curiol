
import { db } from "./src/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

async function checkWebhookLogs() {
    try {
        console.log("--- ULTIMAS CONVERSACIONES OMNITECH ---");
        const q = query(collection(db, "omni_conversations"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No se encontraron mensajes en omni_conversations.");
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp?.toDate().toLocaleString() || "Sin fecha";
            console.log(`[${time}] ${data.direction.toUpperCase()} | De: ${data.contactId} | Msg: ${data.message.substring(0, 50)}...`);
        });
    } catch (e) {
        console.error("Error al consultar Firestore:", e);
    }
}

checkWebhookLogs();
