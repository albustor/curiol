
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function auditData() {
    console.log("Auditing Firebase with Project ID:", firebaseConfig.projectId);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
        const querySnapshot = await getDocs(collection(db, "portfolio_albums"));
        console.log(`Found ${querySnapshot.size} albums.`);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`- Album ID: ${doc.id}`);
            console.log(`  Title: ${data.title}`);
            console.log(`  Category: ${data.category}`);
            console.log(`  Created At: ${data.createdAt ? "Present" : "MISSING"}`);
            // Check for legacy branding in content
            const jsonStr = JSON.stringify(data);
            if (jsonStr.toLowerCase().includes("arquitectura de memorias")) {
                console.log("  !!! WARNING: Legacy branding found in this document !!!");
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

auditData();
