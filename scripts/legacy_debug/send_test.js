const WHATSAPP_TOKEN = "EAARzw1GAUzEBQhInOJ94WvrOWxlgJ78dNHaQG9UMyIrbuTZCM2fA2m7B96FYCzjQUbFa5PPcKWpxPxkQhdSUvcI4RLgJXfJYbbm6hLusktfmraWN28peHUCy2CdIAmER6hP3DZBr9Umyh2gBlsWnAT3tIZCo4R5nnPuMxuZCrxPKWmCBZCZCXj2BNetIREarmtC01wxb7pCPgPIP1fdEZATaZB9EOl1Dk6EggK6EKrCSQTEbTY181veA553W5fpZAeP9b3AdvEPqqOBUsiRzYnM9c";
const PHONE_ID = "1064880893378872";
const RECIPIENT_PHONE = "50662856669";

async function sendTest() {
    console.log("Enviando mensaje de prueba...");
    try {
        const response = await fetch(`https://graph.facebook.com/v22.0/${PHONE_ID}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: RECIPIENT_PHONE,
                type: "template",
                template: {
                    name: "hello_world",
                    language: { code: "en_US" }
                }
            })
        });

        const data = await response.json();
        console.log("Respuesta de Meta:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al enviar:", error);
    }
}

sendTest();
