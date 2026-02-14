const { initializeApp } = require("firebase/app");
const { getFirestore, listCollections, collection, getDocs, limit, query, orderBy } = require("firebase/firestore");

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

async function inspectDb() {
    console.log("Iniciando inspección de colecciones...");
    // Note: listCollections is only available in Admin SDK. 
    // For client SDK, we check known paths or just try to find ANY recent message.

    const targets = ["meta_debug_logs", "omni_conversations", "messages", "logs"];

    for (const name of targets) {
        process.stdout.write(`Revisando ${name}... `);
        const q = query(collection(db, name), limit(1));
        const snap = await getDocs(q);
        console.log(snap.empty ? "VACÍA" : "CON DATOS");
    }
}

inspectDb();
