
import { db } from "./src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function checkData() {
    try {
        const snapshot = await getDocs(collection(db, "portfolio_albums"));
        console.log(`Found ${snapshot.size} albums in portfolio_albums`);
        snapshot.docs.forEach(doc => {
            console.log(`Album: ${doc.id}, Title: ${doc.data().title}, Photos: ${doc.data().photos?.length || 0}`);
        });
    } catch (e) {
        console.error("Error checking Firestore:", e);
    }
}

checkData();
