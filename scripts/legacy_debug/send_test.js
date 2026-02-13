
const WHATSAPP_TOKEN = "EAARzw1GAUzEBQgHfCR4a0fKnLizhgQJFVYbWtr7S1IjhuytMJYBYBGtTrZADqYJ5jAl5Qa5JjcA3zHJibAZC4L4got2DebajRYAWAfZBloL6W0YtZAJr1F15J2eV7tFnlE72dWOkvT3FNJK2vOEd9HVpxZABFBlZCxuh5MgRMAHRFZAPpxSBb5q7BZB7RdCccwZDZD";
const PHONE_NUMBER_ID = "991124360747337";
const RECIPIENT_PHONE = "50662856669";

async function sendTest() {
    console.log("Enviando mensaje de prueba...");
    try {
        const response = await fetch(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, {
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
