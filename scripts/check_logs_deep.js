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

async function checkLatestLogs() {
    console.log("--- Últimos 10 Meta Debug Logs ---");
    const q = query(collection(db, "meta_debug_logs"), orderBy("timestamp", "desc"), limit(10));
    const snap = await getDocs(q);

    if (snap.empty) {
        console.log("No hay logs.");
        return;
    }

    snap.docs.forEach(doc => {
        const d = doc.data();
        const time = d.timestamp?.toDate().toLocaleString() || "N/A";
        console.log(`[${time}] ID: ${doc.id} | Type: ${d.type || 'POST'}`);
        if (d.params) {
            console.log(`   GET Params: ${JSON.stringify(d.params)}`);
        } else if (d.body) {
            const bodyStr = JSON.stringify(d.body);
            console.log(`   POST Body: ${bodyStr.substring(0, 150)}...`);
        }
    });
}

checkLatestLogs();
