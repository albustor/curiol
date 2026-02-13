
const WHATSAPP_TOKEN = "EAARzw1GAUzEBQpuZAxWSuS5PiSKpwrRvChRBQh9G61ycyZAlvrQWQSy7FOddFWdrJgBFDXP3b6WVZBZAa2iLcYARPrvVFLk1nqVsbXsFG9c12qzG86aitWiZCJNok2fhRgZAs5z5GfFssUTT9ZCnEWhDqTyswfTlWugfIlrclQyXulVK2nBj3Rptma6Aen1UQQ1IFtHTb3L83MnjvupSsqUhidF967KZAQIoLi3aZBi4VMf9CPuElI6SpdffmkUAKvYHPpQ4NCUKAZBaIy60GQJj3GUAZDZD";
const PHONE_NUMBER_ID = "1036340659558457";
const RECIPIENT_PHONE = "50662856669";

async function wakeUpBot() {
    console.log("Intentando 'despertar' al bot enviando el Hello World...");
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
        if (response.ok) {
            console.log("¡ÉXITO! Mensaje enviado correctamente.");
            console.log("ID del mensaje:", data.messages?.[0]?.id);
        } else {
            console.error("Error de Meta API:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
}

wakeUpBot();
