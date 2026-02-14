const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, orderBy, limit, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDDY62OP_voyv9xp0vc1TiJTn_x0EsQlqc",
    authDomain: "curiol-studio.firebaseapp.com",
    projectId: "curiol-studio",
    storageBucket: "curiol-studio.firebasestorage.app",
    messagingSenderId: "421382767191",
    appId: "1:421382767191:web:83b0a017c7dde5cdac9912"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function monitor() {
    console.log("--- MONITORING INCOMING META TRAFFIC ---");
    const q = query(collection(db, "meta_debug_logs"), orderBy("timestamp", "desc"), limit(5));
    const snap = await getDocs(q);

    if (snap.empty) {
        console.log("No traffic detected yet.");
    } else {
        snap.docs.forEach(doc => {
            const d = doc.data();
            const time = d.timestamp?.toDate().toLocaleString() || "N/A";
            if (d.type === 'GET_VERIFY') {
                console.log(`[${time}] ✅ Handshake verified: ${d.params.challenge}`);
            } else if (d.body) {
                const entry = d.body.entry?.[0];
                const phoneId = entry?.id;
                const message = entry?.changes?.[0]?.value?.messages?.[0]?.text?.body;
                const from = entry?.changes?.[0]?.value?.messages?.[0]?.from;

                console.log(`[${time}] 📥 Incoming POST:`);
                console.log(`   Phone ID in request: ${phoneId}`);
                console.log(`   From: ${from}`);
                console.log(`   Text: ${message || "[Non-text event]"}`);
            }
        });
    }

    console.log("\n--- RECENT CONVERSATIONS ---");
    const qDoc = query(collection(db, "omni_conversations"), orderBy("timestamp", "desc"), limit(3));
    const snapDoc = await getDocs(qDoc);
    snapDoc.docs.forEach(doc => {
        const d = doc.data();
        console.log(`[${d.direction.toUpperCase()}] ${d.contactId}: ${d.message}`);
    });
}

monitor();
