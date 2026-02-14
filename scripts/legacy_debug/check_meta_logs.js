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

async function checkMetaLogs() {
    console.log("Revisando los últimos registros en meta_debug_logs...");
    try {
        const q = query(collection(db, "meta_debug_logs"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No se encontraron registros de debug.");
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp?.toDate().toLocaleString() || "Desconocido";
            console.log(`[${time}] LOG RECIBIDO | Tipo: ${data.type || 'POST'} | Body/Params: ${JSON.stringify(data.body || data.params).substring(0, 100)}...`);
        });
    } catch (err) {
        console.error("Error al consultar Firestore:", err);
    } finally {
        process.exit();
    }
}

checkMetaLogs();
