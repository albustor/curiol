const WHATSAPP_ACCESS_TOKEN = "EAARzw1GAUzEBQhInOJ94WvrOWxlgJ78dNHaQG9UMyIrbuTZCM2fA2m7B96FYCzjQUbFa5PPcKWpxPxkQhdSUvcI4RLgJXfJYbbm6hLusktfmraWN28peHUCy2CdIAmER6hP3DZBr9Umyh2gBlsWnAT3tIZCo4R5nnPuMxuZCrxPKWmCBZCZCXj2BNetIREarmtC01wxb7pCPgPIP1fdEZATaZB9EOl1Dk6EggK6EKrCSQTEbTY181veA553W5fpZAeP9b3AdvEPqqOBUsiRzYnM9c";

async function listWABAs() {
    console.log("Listing WABAs for the token...");
    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/me/whatsapp_business_accounts`, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
        });
        const data = await response.json();
        console.log("WABAs found:", JSON.stringify(data, null, 2));

        if (data.data && data.data.length > 0) {
            for (const waba of data.data) {
                console.log(`Checking Phone Numbers for WABA: ${waba.id} (${waba.name})...`);
                const phoneResponse = await fetch(`https://graph.facebook.com/v21.0/${waba.id}/phone_numbers`, {
                    headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
                });
                const phoneData = await phoneResponse.json();
                console.log(`Phones for ${waba.id}:`, JSON.stringify(phoneData, null, 2));
            }
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

listWABAs();
