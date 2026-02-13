
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, orderBy, limit, getDocs } = require('firebase/firestore');

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

async function checkMessages() {
    console.log("Conectando a Firestore...");
    try {
        const q = query(collection(db, "omni_conversations"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No hay mensajes en omni_conversations.");
            return;
        }

        console.log("--- ULTIMOS 5 MENSAJES ---");
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : "N/A";
            console.log(`[${date}] ${data.direction}: ${data.message.substring(0, 50)}... (${data.contactId})`);
        });
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

checkMessages();
