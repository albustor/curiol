async function testHandshake() {
    const url = 'https://curiol.studio/api/webhooks/meta';
    const params = new URLSearchParams({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'abustosort',
        'hub.challenge': 'PROVANDO_123'
    });

    console.log(`Probando apretón de manos en: ${url}?${params.toString()}`);
    try {
        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.text();
        console.log('Respuesta del servidor:', data);
        if (data === 'PROVANDO_123') {
            console.log('✅ EXITO: El Webhook está vivo y reconoció el token.');
        } else {
            console.log('❌ ERROR: El servidor respondió algo inesperado o 403.');
        }
    } catch (e) {
        console.error('❌ ERROR de conexión:', e.message);
    }
}

testHandshake();
