
const WHATSAPP_TOKEN = "EAARzw1GAUzEBQgHfCR4a0fKnLizhgQJFVYbWtr7S1IjhuytMJYBYBGtTrZADqYJ5jAl5Qa5JjcA3zHJibAZC4L4got2DebajRYAWAfZBloL6W0YtZAJr1F15J2eV7tFnlE72dWOkvT3FNJK2vOEd9HVpxZABFBlZCxuh5MgRMAHRFZAPpxSBb5q7BZB7RdCccwZDZD";
const WABAS = ["1577825263469656", "2153840142022709", "879129438059281"];

async function checkAll() {
    for (const waba of WABAS) {
        console.log(`\n--- Revisando WABA: ${waba} ---`);
        try {
            const response = await fetch(`https://graph.facebook.com/v24.0/${waba}/phone_numbers`, {
                headers: { "Authorization": `Bearer ${WHATSAPP_TOKEN}` }
            });
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                data.data.forEach(num => {
                    console.log(`📍 Número: ${num.display_phone_number}`);
                    console.log(`   ID: ${num.id}`);
                    console.log(`   Estado: ${num.code_verification_status}`);
                    console.log(`   Nombre: ${num.verified_name}`);
                });
            } else {
                console.log("   (Sin números)");
            }
        } catch (e) {
            console.log(`   Error: ${e.message}`);
        }
    }
}

checkAll();
