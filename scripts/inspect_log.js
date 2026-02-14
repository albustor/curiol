const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

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

async function inspectDoc() {
    console.log("Inspeccionando sxNsNZfIf8OEA2bZyyXq...");
    const snap = await getDoc(doc(db, "meta_debug_logs", "sxNsNZfIf8OEA2bZyyXq"));
    if (snap.exists()) {
        console.log(JSON.stringify(snap.data(), null, 2));
    } else {
        console.log("Documento no encontrado.");
    }
}

inspectDoc();
