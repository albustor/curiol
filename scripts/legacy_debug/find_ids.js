const WHATSAPP_ACCESS_TOKEN = "EAARzw1GAUzEBQhInOJ94WvrOWxlgJ78dNHaQG9UMyIrbuTZCM2fA2m7B96FYCzjQUbFa5PPcKWpxPxkQhdSUvcI4RLgJXfJYbbm6hLusktfmraWN28peHUCy2CdIAmER6hP3DZBr9Umyh2gBlsWnAT3tIZCo4R5nnPuMxuZCrxPKWmCBZCZCXj2BNetIREarmtC01wxb7pCPgPIP1fdEZATaZB9EOl1Dk6EggK6EKrCSQTEbTY181veA553W5fpZAeP9b3AdvEPqqOBUsiRzYnM9c";

async function findAnything() {
    console.log("Searching for any accessible IDs...");

    // 1. Check /me
    try {
        const meR = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${WHATSAPP_ACCESS_TOKEN}`);
        console.log("ME:", await meR.json());
    } catch (e) { }

    // 2. Check /me/accounts (Pages)
    try {
        const accR = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${WHATSAPP_ACCESS_TOKEN}`);
        console.log("Accounts (Pages):", await accR.json());
    } catch (e) { }

    // 3. Check /me/ad_accounts
    try {
        const adR = await fetch(`https://graph.facebook.com/v21.0/me/ad_accounts?access_token=${WHATSAPP_ACCESS_TOKEN}`);
        console.log("Ad Accounts:", await adR.json());
    } catch (e) { }

    // 4. Try the ID Alberto sent as a broad node
    const id = "1987535688826355";
    try {
        const idR = await fetch(`https://graph.facebook.com/v21.0/${id}?access_token=${WHATSAPP_ACCESS_TOKEN}`);
        console.log(`Node ${id}:`, await idR.json());
    } catch (e) { }
}

findAnything();
