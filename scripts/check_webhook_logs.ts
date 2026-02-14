import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkWebhookLogs() {
    console.log("\n--- MONITORING META WEBHOOK LOGS ---\n");
    try {
        const q = query(collection(db, "meta_debug_logs"), orderBy("timestamp", "desc"), limit(10));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No log entries found in 'meta_debug_logs'. Waiting for Meta...");
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp?.toDate().toLocaleString() || "No timestamp";
            console.log(`[${time}] TYPE: ${data.type || "POST_DATA"}`);
            if (data.type === "GET_VERIFY") {
                console.log(`   Verification Attempt: Mode=${data.params?.mode}, Token=${data.params?.token}`);
            } else if (data.body) {
                console.log(`   Payload received from Meta (check Firestore for full JSON)`);
            }
            console.log("---");
        });
    } catch (e: any) {
        console.error("Error fetching logs:", e.message);
    }
}

checkWebhookLogs();
