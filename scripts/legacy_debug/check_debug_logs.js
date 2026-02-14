
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const serviceAccount = require('../../service-account.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkDebugLogs() {
    console.log("Revisando los últimos hits en meta_debug_logs...");
    const logsRef = db.collection('meta_debug_logs');
    const q = logsRef.orderBy('timestamp', 'desc').limit(5);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        console.log("No se encontraron registros en meta_debug_logs.");
        return;
    }

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const time = data.timestamp ? data.timestamp.toDate().toLocaleString('es-CR') : 'N/A';
        console.log(`[${time}] Hit recibido!`);
        console.log("Contenido:", JSON.stringify(data.body, null, 2));
        console.log("-----------------------------------------");
    });
}

checkDebugLogs();
