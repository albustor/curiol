
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function checkSessions() {
    console.log("Revisando sesiones activas...");
    try {
        const snapshot = await getDocs(collection(db, "omni_sessions"));
        if (snapshot.empty) {
            console.log("No hay sesiones en omni_sessions.");
            return;
        }
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`Sesión: ${doc.id} | Status: ${data.status} | Flow: ${data.flowId}`);
        });
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

checkSessions();
