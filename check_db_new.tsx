import { db } from "./src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function check() {
    console.log("--- AUDITORIA DE FIREBASE (ALBUMS) ---");
    try {
        const querySnapshot = await getDocs(collection(db, "portfolio_albums"));
        console.log(`Total álbumes: ${querySnapshot.size}`);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`- [${doc.id}] ${data.title} (${data.category})`);
            if (data.title.includes("Arquitectura")) {
                console.log("  !!! ENCONTRADO BRANDING VIEJO EN TITULO !!!");
            }
        });
    } catch (e) {
        console.error(e);
    }
}

check();
