const WHATSAPP_ACCESS_TOKEN = "EAARzw1GAUzEBQhInOJ94WvrOWxlgJ78dNHaQG9UMyIrbuTZCM2fA2m7B96FYCzjQUbFa5PPcKWpxPxkQhdSUvcI4RLgJXfJYbbm6hLusktfmraWN28peHUCy2CdIAmER6hP3DZBr9Umyh2gBlsWnAT3tIZCo4R5nnPuMxuZCrxPKWmCBZCZCXj2BNetIREarmtC01wxb7pCPgPIP1fdEZATaZB9EOl1Dk6EggK6EKrCSQTEbTY181veA553W5fpZAeP9b3AdvEPqqOBUsiRzYnM9c";
const WABA_ID = "1236065411252784";

async function getPhoneID() {
    console.log(`Consultando números para la cuenta WABA: ${WABA_ID}...`);
    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${WABA_ID}/phone_numbers`, {
            headers: {
                "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
            }
        });

        const data = await response.json();
        console.log("Respuesta de Meta:", JSON.stringify(data, null, 2));

        if (data.data && data.data.length > 0) {
            console.log("\n✅ ¡NÚMERO ENCONTRADO!");
            data.data.forEach(num => {
                console.log(`- Número: ${num.display_phone_number}`);
                console.log(`- PHONE_NUMBER_ID: ${num.id}`);
                console.log(`- Estado: ${num.status}`);
            });
        } else {
            console.log("\n❌ No se encontraron números vinculados a este token. Verifica los permisos del Sistema User.");
        }
    } catch (error) {
        console.error("Error al consultar el API:", error);
    }
}

getPhoneID();
