
const WHATSAPP_TOKEN = "EAARzw1GAUzEBQgHfCR4a0fKnLizhgQJFVYbWtr7S1IjhuytMJYBYBGtTrZADqYJ5jAl5Qa5JjcA3zHJibAZC4L4got2DebajRYAWAfZBloL6W0YtZAJr1F15J2eV7tFnlE72dWOkvT3FNJK2vOEd9HVpxZABFBlZCxuh5MgRMAHRFZAPpxSBb5q7BZB7RdCccwZDZD";
const WABA_ID = "1577825263469656";

async function getPhoneID() {
    console.log(`Consultando números para la cuenta WABA: ${WABA_ID}...`);
    try {
        const response = await fetch(`https://graph.facebook.com/v24.0/${WABA_ID}/phone_numbers`, {
            headers: {
                "Authorization": `Bearer ${WHATSAPP_TOKEN}`
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
