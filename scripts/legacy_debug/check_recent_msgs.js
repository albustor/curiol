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

async function checkRecentConversations() {
    console.log("Revisando los últimos mensajes en omni_conversations...");
    try {
        const q = query(collection(db, "omni_conversations"), orderBy("timestamp", "desc"), limit(10));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No se encontraron mensajes recientes.");
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp?.toDate().toLocaleString() || "Desconocido";
            console.log(`[${time}] ${data.direction === 'inbound' ? '📥 Recibido' : '📤 Enviado'} | De/Para: ${data.contactId} | Msg: ${data.message.substring(0, 50)}...`);
        });
    } catch (err) {
        console.error("Error al consultar Firestore:", err);
    } finally {
        process.exit();
    }
}

checkRecentConversations();
