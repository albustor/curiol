const WHATSAPP_ACCESS_TOKEN = "EAARzw1GAUzEBQhInOJ94WvrOWxlgJ78dNHaQG9UMyIrbuTZCM2fA2m7B96FYCzjQUbFa5PPcKWpxPxkQhdSUvcI4RLgJXfJYbbm6hLusktfmraWN28peHUCy2CdIAmER6hP3DZBr9Umyh2gBlsWnAT3tIZCo4R5nnPuMxuZCrxPKWmCBZCZCXj2BNetIREarmtC01wxb7pCPgPIP1fdEZATaZB9EOl1Dk6EggK6EKrCSQTEbTY181veA553W5fpZAeP9b3AdvEPqqOBUsiRzYnM9c";
const WABA_ID = "1098182375499508";

async function getPhone() {
    console.log(`Checking phones for WABA: ${WABA_ID}...`);
    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${WABA_ID}/phone_numbers`, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
        });
        const data = await response.json();
        console.log("Phone IDs found:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}

getPhone();
