
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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
};

async function auditData() {
    console.log("--- LIVE DATA AUDIT ---");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
        const snapshot = await getDocs(collection(db, "portfolio_albums"));
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`Album: ${data.title}`);
            console.log(`- Category: ${data.category}`);
            console.log(`- Photos Array length: ${data.photos ? data.photos.length : 'UNDEFINED'}`);
            if (data.photos && data.photos.length > 0) {
                console.log(`- First photo URL: ${data.photos[0].url}`);
            }
            console.log("----------------------");
        });
    } catch (error) {
        console.error("Audit Error:", error);
    }
}

auditData();
