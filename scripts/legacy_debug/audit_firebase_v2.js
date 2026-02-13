
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
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

async function auditData() {
    console.log("--- FIREBASE DEEP AUDIT ---");
    console.log("Project ID:", firebaseConfig.projectId);

    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log("Fetching all documents in 'portfolio_albums'...");
        const fullSnapshot = await getDocs(collection(db, "portfolio_albums"));
        console.log(`Total documents found: ${fullSnapshot.size}`);

        console.log("\n--- DOCUMENT ANALYSIS ---");
        fullSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`ID: ${doc.id}`);
            console.log(`  Title: "${data.title}"`);
            console.log(`  Category: "${data.category}"`);
            console.log(`  CreatedAt: ${data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : "Present (Non-Timestamp)") : "MISSING"}`);

            const json = JSON.stringify(data).toLowerCase();
            if (json.includes("arquitectura de memorias") || json.includes("arquitectura de recuerdos")) {
                console.log("  !!! WARNING: LEGACY BRANDING FOUND IN FIELD !!!");
            }
        });

        console.log("\n--- TESTING 'getAlbums' QUERY (WITH ORDERBY) ---");
        try {
            const q = query(collection(db, "portfolio_albums"), orderBy("createdAt", "desc"));
            const qSnapshot = await getDocs(q);
            console.log(`Ordered query returned ${qSnapshot.size} results.`);
            if (qSnapshot.size === 0 && fullSnapshot.size > 0) {
                console.log("  !!! CRITICAL: OrderBy query failed to find documents that exist. Likely missing index or missing 'createdAt' fields. !!!");
            }
        } catch (queryError) {
            console.error("  !!! QUERY FAILED:", queryError.message);
        }

    } catch (error) {
        console.error("CRITICAL ERROR:", error);
    }
}

auditData();
