const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, orderBy, limit, getDocs } = require("firebase/firestore");
require('dotenv').config({ path: '.env.local' });

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

async function checkConversations() {
    console.log("Consultando últimas conversaciones...");
    try {
        const q = query(collection(db, "omni_conversations"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No se encontraron mensajes.");
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp?.toDate().toLocaleString() || "Sin fecha";
            console.log(`[${time}] ${data.direction.toUpperCase()} | Canal: ${data.channel} | Msg: ${data.message}`);
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

checkConversations();
