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

async function checkConversations() {
    console.log("Consultando últimas conversaciones...");
    try {
        const q = query(collection(db, "omni_conversations"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No se encontraron mensajes en omni_conversations.");
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp?.toDate().toLocaleString() || "Sin fecha";
            console.log(`[${time}] ${data.direction.toUpperCase()} | Canal: ${data.channel} | Msg: ${data.message}`);
        });
    } catch (e) {
        console.error("Error consultando Firestore:", e);
    }
}

checkConversations();
