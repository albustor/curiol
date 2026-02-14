
const WHATSAPP_TOKEN = "EAARzw1GAUzEBQgHfCR4a0fKnLizhgQJFVYbWtr7S1IjhuytMJYBYBGtTrZADqYJ5jAl5Qa5JjcA3zHJibAZC4L4got2DebajRYAWAfZBloL6W0YtZAJr1F15J2eV7tFnlE72dWOkvT3FNJK2vOEd9HVpxZABFBlZCxuh5MgRMAHRFZAPpxSBb5q7BZB7RdCccwZDZD";
const PHONE_ID = "991124360747337";

async function requestRegistration() {
    console.log(`Intentando registrar el número con ID: ${PHONE_ID}...`);
    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                pin: "123456" // Pin temporal para el registro
            })
        });

        const data = await response.json();
        console.log("Respuesta de Meta:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al solicitar registro:", error);
    }
}

requestRegistration();
