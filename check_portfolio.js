const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkPortfolio() {
    console.log("--- AUDITORIA DE PORTAFOLIO ---");
    try {
        const snapshot = await db.collection('portfolio_albums').get();
        console.log(`Total álbumes: ${snapshot.size}`);

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- [${doc.id}] ${data.title} (${data.category})`);
            console.log(`  Fotos: ${data.photos ? data.photos.length : 0}`);
            console.log(`  Slug: ${data.slug || 'N/A'}`);
            console.log(`  Publicado: ${data.isPublished !== false ? 'SÍ' : 'NO'}`);
            console.log('------------------------------');
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

checkPortfolio();
