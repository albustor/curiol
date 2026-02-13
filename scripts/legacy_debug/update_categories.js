
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
    }
});

const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function updateCategories() {
    console.log("Updating album categories to 'Legado y Crecimiento Comercial'...");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
        const snapshot = await getDocs(collection(db, "portfolio_albums"));
        for (const albumDoc of snapshot.docs) {
            console.log(`Updating ${albumDoc.id}...`);
            await updateDoc(doc(db, "portfolio_albums", albumDoc.id), {
                category: "Legado y Crecimiento Comercial"
            });
        }
        console.log("Successfully updated all albums.");
    } catch (error) {
        console.error("Update Error:", error);
    }
}

updateCategories();
