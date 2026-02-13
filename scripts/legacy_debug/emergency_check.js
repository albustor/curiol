
const https = require('https');

const urls = [
    'https://curiol.studio',
    'https://curiolstudio.vercel.app',
    'https://curiol.studio/debug-ssr',
    'https://curiolstudio.vercel.app/debug-ssr'
];

async function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            console.log(`URL: ${url}`);
            console.log(`Status: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                const lowerData = data.toLowerCase();
                console.log(`Length: ${data.length}`);

                if (url.includes('debug-status') || url.includes('debug-ssr')) {
                    const albumsCount = data.match(/Albums Count \(SSR\): (?:<!-- -->)?(\d+)/) || data.match(/Albums Found: (?:<!-- -->)?(\d+)/);
                    if (albumsCount) {
                        console.log(`Live Albums Found: ${albumsCount[1]}`);
                    }
                    const envSection = data.match(/<li>(.*?)<\/li>/g) || data.match(/<p>Project ID: (?:<!-- -->)?(.*?)<\/p>/);
                    if (envSection) {
                        console.log(`Env Check: ${envSection[1] || envSection[0]}`);
                    }
                }

                const hasNew = data.includes('Legado y Crecimiento Comercial');
                const hasOld = data.includes('Arquitectura de Memorias');

                if (hasNew) {
                    console.log(`Result: ✅ NEW BRANDING DETECTED`);
                } else if (hasOld) {
                    console.log(`Result: ❌ OLD BRANDING DETECTED`);
                } else {
                    console.log(`Result: ❓ UNKNOWN CONTENT (Checked for "Legado y Crecimiento Comercial")`);
                }

                if (data.includes('Error') || data.includes('500') || data.includes('Application error')) {
                    console.log(`Warning: Potential error content detected`);
                }
                console.log('---');
                resolve();
            });
        }).on('error', (err) => {
            console.log(`URL: ${url}`);
            console.log(`Error: ${err.message}`);
            console.log('---');
            resolve();
        });
    });
}

async function run() {
    for (const url of urls) {
        await checkUrl(url);
    }
}

run();
