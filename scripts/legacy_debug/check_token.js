const WHATSAPP_ACCESS_TOKEN = "EAARzw1GAUzEBQtpWry97YJkxRivMBnvOtLZAgZCBeufWmNoiXOSMVQnHEj0p70H9tZAhELSIMo3piGuBib4kbWGknoR3XtXoAON4dEt7PrhIAC9aaNv1DjxZAwBdTWpIDm5Uhm5NbSpFwabPuXWZAOJKXFNvsja5gJIp3ZCuqCZBt1gnoJ5sBZCdZCjXtWQpxnFZCWaZBArSwjePQhqEjXGQP0xDpTXF4cWevtVZAIibiBuBsK0Gya7f7xPgfFgyGU6X8wQwVtTisi2qVXuxM3uX8pXo";

async function checkMe() {
    console.log("Checking token info...");
    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/debug_token?input_token=${WHATSAPP_ACCESS_TOKEN}&access_token=${WHATSAPP_ACCESS_TOKEN}`, {
        });
        const data = await response.json();
        console.log("Token Debug Info:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}

checkMe();
