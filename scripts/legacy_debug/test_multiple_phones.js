const WHATSAPP_ACCESS_TOKEN = "EAARzw1GAUzEBQhInOJ94WvrOWxlgJ78dNHaQG9UMyIrbuTZCM2fA2m7B96FYCzjQUbFa5PPcKWpxPxkQhdSUvcI4RLgJXfJYbbm6hLusktfmraWN28peHUCy2CdIAmER6hP3DZBr9Umyh2gBlsWnAT3tIZCo4R5nnPuMxuZCrxPKWmCBZCZCXj2BNetIREarmtC01wxb7pCPgPIP1fdEZATaZB9EOl1Dk6EggK6EKrCSQTEbTY181veA553W5fpZAeP9b3AdvEPqqOBUsiRzYnM9c";
const PHONE_IDS = ["1064880893378872", "106540352242922", "991124360747337"];
const RECIPIENT = "50662856669"; // Bot number as recipient to test internal send

async function testPhones() {
    for (const id of PHONE_IDS) {
        console.log(`Testing Phone ID: ${id}...`);
        try {
            const response = await fetch(`https://graph.facebook.com/v21.0/${id}`, {
                headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
            });
            const data = await response.json();
            console.log(`ID ${id} result:`, data.error ? "Error: " + data.error.message : "Success: " + data.display_phone_number);
        } catch (err) {
            console.log(`ID ${id} failed network.`);
        }
    }
}

testPhones();
